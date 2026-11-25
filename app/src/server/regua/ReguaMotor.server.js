/**
 * ReguaMotor — regra da régua de cobrança como Flow (design ux-cobranca-v2-regua-flow.md, B3, D9–D19).
 *
 * O Flow «Régua: <nome>» passa só a inscrição e a ordem; o motor lê a etapa (dia, canal, texto, postura,
 * ação sem resposta) na hora da execução, para o coordenador mudar prazo, canal e texto no form sem regerar.
 * As 4 custom actions (app/src/fluent/actions/regua.now.ts) chamam:
 *   agendar(inscricao, ordem)   quando a etapa (ou o fecho, ordem = última + 1) roda   — US-MOD-F4-010
 *   checarGuardas(inscricao)    régua pausada, controle, regularizado                  — US-MOD-F4-011
 *   enviar(inscricao, ordem)    canal da etapa + fallback, opt-in, opt-out, teto        — US-MOD-F4-011
 *   escalonar(inscricao)        cobrança ativa ou qualificada                           — US-MOD-F4-012
 * E as business rules de B4: inscrever (publicação do ciclo), reavaliar (débito, regularização, parcelamento),
 * encerrarDaRegua (pausa), pausar/ativar (UI Actions) — US-MOD-F4-012; inscreverParcelamento — US-MOD-F4-013.
 * Os métodos aceitam GlideRecord ou sys_id e releem a inscrição do banco (o GlideRecord do Flow pode estar velho).
 * Também guarda as regras de gravação da régua e da etapa (D17), chamadas pela business rule validarEtapa.
 */
var ReguaMotor = Class.create();

ReguaMotor.T_INSCRICAO = 'x_2326104_cob_regua_inscricao';
ReguaMotor.T_REGUA = 'x_2326104_cob_regua';
ReguaMotor.T_ETAPA = 'x_2326104_cob_regua_etapa';
ReguaMotor.T_COMUNICACAO = 'x_2326104_cob_comunicacao';
ReguaMotor.T_ENVIO = 'x_2326104_cob_envio_sim';
ReguaMotor.T_CANAL = 'x_2326104_cob_canal_sim';
ReguaMotor.T_CONSENTIMENTO = 'x_2326104_cob_consentimento';
ReguaMotor.T_DEBITO = 'x_2326104_cob_debito';
ReguaMotor.T_PARCELAMENTO = 'x_2326104_cob_parcelamento';
ReguaMotor.T_CONTRIBUINTE = 'x_2326104_cob_contribuinte';
ReguaMotor.T_SEGMENTACAO = 'x_2326104_cob_segmentacao';
ReguaMotor.T_CICLO = 'x_2326104_cob_ciclo';

/** Segundos de um «dia» da régua: 86400 em produção, 60 na demo (D11). */
ReguaMotor.PROP_SEGUNDOS_POR_DIA = 'x_2326104_cob.regua.segundos_por_dia';
/** Tentativas por contribuinte e canal dentro da janela de segundos_por_dia (RN-38, D19). */
ReguaMotor.TETO_POR_JANELA = 1;
/** Ordem de fallback depois do canal da etapa (RN-NOVO-F4-004, D18). */
ReguaMotor.ORDEM_FALLBACK = ['sne', 'email', 'sms'];
ReguaMotor.POSTURAS = ['utilitaria', 'consciente', 'explicativa', 'ameacadora'];
ReguaMotor.ENCAMINHA = { encaminhar_ativa: true, encaminhar_qualificada: true };
ReguaMotor.CANAIS_INFORMAIS = { email: true, sms: true, whatsapp: true };
ReguaMotor.ROTULO_CANAL = { sne: 'SNE', email: 'E-mail', sms: 'SMS', whatsapp: 'WhatsApp' };
ReguaMotor.SIGILO = /R\$|\{valor\}|\{debito\}|\{tributo\}/i;

ReguaMotor.MSG_SEM_CODIGO = 'Informe o código da régua.';
ReguaMotor.MSG_SEM_PRAZO = 'Informe o prazo de resposta depois da última etapa.';
ReguaMotor.MSG_CODIGO_REPETIDO = 'Operação recusada: já existe régua com este código.';
ReguaMotor.MSG_POSTURA = 'Operação recusada: a postura não pode regredir nem saltar nível em relação à etapa anterior.';
ReguaMotor.MSG_DIA = 'Operação recusada: o dia precisa vir depois do dia da etapa anterior.';
ReguaMotor.MSG_ENCAMINHAR = 'Operação recusada: só a última etapa encaminha, e ela precisa encaminhar.';
ReguaMotor.MSG_PARCELAMENTO = 'Operação recusada: inscrição na régua de Parcelamentos precisa do parcelamento.';
ReguaMotor.MSG_REGUA_NAO_ACHADA = 'Régua não encontrada.';
ReguaMotor.MSG_JA_PAUSADA = 'A régua já está pausada.';
ReguaMotor.MSG_JA_ATIVA = 'A régua já está ativa.';
ReguaMotor.MSG_PAUSADA = 'Régua pausada: {n} inscrição(ões) ativa(s) encerrada(s). Ao ativar de novo, só entra quem for inscrito depois.';
ReguaMotor.MSG_ATIVADA = 'Régua ativada: as inscrições encerradas pela pausa não voltam; entra quem for inscrito daqui em diante.';
ReguaMotor.MSG_SEM_EXECUCAO = 'Execução não encontrada.';
ReguaMotor.MSG_SEM_FLOW = 'Esta régua não tem Flow.';
ReguaMotor.MSG_SIGILO ='Operação recusada: texto de e-mail, SMS ou WhatsApp não pode trazer valor nem tributo (só ciência do DT-e).';

/** sys_id de um GlideRecord ou de uma string. */
ReguaMotor.idDe = function (x) {
    if (!x) {
        return '';
    }
    if (typeof x.getUniqueValue === 'function') {
        return x.getUniqueValue();
    }
    return String(x);
};

ReguaMotor.prototype = {
    initialize: function () {},

    segundosPorDia: function () {
        var s = parseInt(gs.getProperty(ReguaMotor.PROP_SEGUNDOS_POR_DIA, '86400'), 10);
        return s > 0 ? s : 86400;
    },

    /** Relê a inscrição do banco; null se não existe. */
    _inscricao: function (x) {
        var gr = new GlideRecord(ReguaMotor.T_INSCRICAO);
        return gr.get(ReguaMotor.idDe(x)) ? gr : null;
    },

    /** Etapas da régua por ordem: [{ id, ordem, dia, canal, postura, acao, template }]. Uma consulta. */
    _etapas: function (reguaId) {
        var lista = [];
        var e = new GlideRecord(ReguaMotor.T_ETAPA);
        e.addQuery('regua', reguaId);
        e.orderBy('ordem');
        e.query();
        while (e.next()) {
            lista.push({
                id: e.getUniqueValue(), ordem: parseInt(e.getValue('ordem'), 10), dia: parseInt(e.getValue('offset_dias') || '0', 10),
                canal: e.getValue('canal'), postura: e.getValue('postura'), acao: e.getValue('acao_sem_resposta'),
                template: e.getValue('template') || ''
            });
        }
        return lista;
    },

    /**
     * Quando a etapa `ordem` roda. Etapa real: iniciada_em + dia × segundos_por_dia, grava etapa_atual e
     * proxima_etapa_em. Fecho (ordem = última + 1): iniciada_em + (dia da última + prazo_final_dias) × segundos_por_dia,
     * grava só proxima_etapa_em. Inscrição não ativa: { segue: false } sem gravar.
     * @returns {{segue: boolean, executar_em: GlideDateTime|string}} executar_em como objeto GlideDateTime (F0 ponto 1)
     */
    agendar: function (inscricao, ordem) {
        var insc = this._inscricao(inscricao);
        if (!insc || insc.getValue('status') !== 'ativa') {
            return { segue: false, executar_em: '' };
        }
        var etapas = this._etapas(insc.getValue('regua'));
        if (!etapas.length) {
            throw new Error('régua sem etapas');
        }
        var ultima = etapas[etapas.length - 1];
        var dias = null;
        var real = false;
        for (var i = 0; i < etapas.length; i++) {
            if (etapas[i].ordem === ordem) {
                dias = etapas[i].dia;
                real = true;
            }
        }
        if (dias === null) {
            if (ordem !== ultima.ordem + 1) {
                throw new Error('etapa ' + ordem + ' não existe na régua');
            }
            dias = ultima.dia + parseInt(insc.regua.prazo_final_dias.toString() || '0', 10);
        }
        var base = insc.getValue('iniciada_em') || insc.getValue('sys_created_on');
        var executar = new GlideDateTime(base);
        executar.addSeconds(dias * this.segundosPorDia());
        if (real) {
            insc.setValue('etapa_atual', ordem);
        }
        insc.setValue('proxima_etapa_em', executar.getValue());
        insc.update();
        return { segue: true, executar_em: executar };
    },

    /**
     * Guardas antes de cada envio e do encaminhamento (RN-NOVO-F4-011). Inscrição não ativa: segue=false sem
     * regravar. Com motivo de parada, encerra a inscrição (e as comunicações agendadas dela) e devolve segue=false.
     */
    checarGuardas: function (inscricao) {
        var insc = this._inscricao(inscricao);
        if (!insc || insc.getValue('status') !== 'ativa') {
            return { segue: false, motivo: '' };
        }
        var motivo = this.motivoParada(insc);
        if (motivo) {
            this.encerrar(insc, motivo);
            gs.info('RF-MOD-F4-011: inscrição ' + insc.getUniqueValue() + ' encerrada pela guarda: ' + motivo);
            return { segue: false, motivo: motivo };
        }
        return { segue: true, motivo: '' };
    },

    /**
     * Por que a régua para para esta inscrição ('' quando segue): régua pausada; contribuinte no grupo de controle
     * do ciclo da inscrição (sem ciclo, a guarda não se aplica); na carteira Parcelamentos, o parcelamento em dia
     * ou quitado (regularizado) ou rompido (parcelamento_rompido); nas outras, nenhum débito em aberto do tributo.
     */
    motivoParada: function (inscricao) {
        var insc = this._inscricao(inscricao);
        if (!insc) {
            return '';
        }
        var regua = new GlideRecord(ReguaMotor.T_REGUA);
        if (!regua.get(insc.getValue('regua')) || regua.getValue('ativa') !== '1') {
            return 'regua_pausada';
        }
        var contribuinte = insc.getValue('contribuinte');
        var ciclo = insc.getValue('ciclo');
        if (ciclo && new QualificacaoCiclo().emControle(contribuinte, ciclo)) {
            return 'controle';
        }
        var carteira = regua.getValue('carteira');
        if (carteira === 'parcelamentos') {
            var parc = new GlideRecord(ReguaMotor.T_PARCELAMENTO);
            if (!insc.getValue('parcelamento') || !parc.get(insc.getValue('parcelamento'))) {
                return '';
            }
            var st = parc.getValue('status');
            if (st === 'em_dia' || st === 'quitado') {
                return 'regularizado';
            }
            return st === 'rompido' ? 'parcelamento_rompido' : '';
        }
        var deb = new GlideAggregate(ReguaMotor.T_DEBITO);
        deb.addQuery('contribuinte', contribuinte);
        deb.addQuery('status', 'aberto');
        deb.addQuery('tributo', carteira);
        deb.addAggregate('COUNT');
        deb.query();
        var abertos = deb.next() ? parseInt(deb.getAggregate('COUNT'), 10) : 0;
        return abertos > 0 ? '' : 'regularizado';
    },

    /**
     * Encerra a inscrição com o motivo e passa as comunicações «agendada» dela para «encerrada» numa só
     * consulta (RN-NOVO-F1-002).
     */
    encerrar: function (inscricao, motivo) {
        var insc = this._inscricao(inscricao);
        if (!insc) {
            return;
        }
        insc.setValue('status', 'encerrada');
        insc.setValue('encerrada_em', new GlideDateTime().getValue());
        insc.setValue('motivo_encerramento', motivo);
        insc.update();
        var com = new GlideRecord(ReguaMotor.T_COMUNICACAO);
        com.addQuery('inscricao', insc.getUniqueValue());
        com.addQuery('status', 'agendada');
        com.setValue('status', 'encerrada');
        com.updateMultiple();
    },

    /** Configuração dos canais simulados: { canal: { contratado, exigeOptIn, falha } } (primeiro registro por canal). */
    _canais: function () {
        var mapa = {};
        var c = new GlideRecord(ReguaMotor.T_CANAL);
        c.orderBy('sys_created_on');
        c.query();
        while (c.next()) {
            var nome = c.getValue('canal');
            if (!mapa[nome]) {
                mapa[nome] = {
                    contratado: c.getValue('contratado') === '1',
                    exigeOptIn: c.getValue('exige_opt_in') === '1',
                    falha: c.getValue('forcar_falha') === '1'
                };
            }
        }
        return mapa;
    },

    /** Consentimento vigente por canal: o mais recente (registrado_em, depois sys_created_on). { canal: 'opt_in'|'opt_out' }. */
    _consentimentos: function (contribuinteId) {
        var mapa = {};
        var c = new GlideRecord(ReguaMotor.T_CONSENTIMENTO);
        c.addQuery('contribuinte', contribuinteId);
        c.orderByDesc('registrado_em');
        c.orderByDesc('sys_created_on');
        c.query();
        while (c.next()) {
            var canal = c.getValue('canal');
            if (!mapa[canal]) {
                mapa[canal] = c.getValue('situacao');
            }
        }
        return mapa;
    },

    /** Tentativas do contribuinte no canal dentro da janela de segundos_por_dia (D19). */
    _tentativasNaJanela: function (contribuinteId, canal) {
        var limite = new GlideDateTime();
        limite.addSeconds(-this.segundosPorDia());
        var e = new GlideAggregate(ReguaMotor.T_ENVIO);
        e.addQuery('comunicacao.contribuinte', contribuinteId);
        e.addQuery('canal', canal);
        e.addQuery('recebido_em', '>=', limite);
        e.addAggregate('COUNT');
        e.query();
        return e.next() ? parseInt(e.getAggregate('COUNT'), 10) : 0;
    },

    /**
     * Envia a etapa `ordem` (RN-NOVO-F4-012, F4-003): canal da etapa e depois SNE, e-mail e SMS, sem repetir.
     * Pula o canal não contratado, o que exige opt-in sem opt-in vigente, o com opt-out vigente e o que já teve
     * TETO_POR_JANELA tentativas do contribuinte nos últimos segundos_por_dia segundos. Cada tentativa vira um
     * retorno de envio; para no primeiro entregue. Uma comunicação por inscrição e etapa (idempotente).
     * @returns {{status: string, canal: string, comunicacao: string}}
     */
    enviar: function (inscricao, ordem) {
        var insc = this._inscricao(inscricao);
        if (!insc) {
            throw new Error('inscrição não encontrada');
        }
        var etapa = null;
        var etapas = this._etapas(insc.getValue('regua'));
        for (var i = 0; i < etapas.length; i++) {
            if (etapas[i].ordem === ordem) {
                etapa = etapas[i];
            }
        }
        if (!etapa) {
            throw new Error('etapa ' + ordem + ' não existe na régua');
        }
        var com = new GlideRecord(ReguaMotor.T_COMUNICACAO);
        com.addQuery('inscricao', insc.getUniqueValue());
        com.addQuery('etapa', etapa.id);
        com.setLimit(1);
        com.query();
        if (com.next()) {
            if (com.getValue('status') !== 'agendada') {
                return { status: com.getValue('status'), canal: com.getValue('canal') || '', comunicacao: com.getUniqueValue() };
            }
        } else {
            com = new GlideRecord(ReguaMotor.T_COMUNICACAO);
            com.initialize();
            com.setValue('contribuinte', insc.getValue('contribuinte'));
            com.setValue('regua', insc.getValue('regua'));
            com.setValue('etapa', etapa.id);
            com.setValue('ciclo', insc.getValue('ciclo'));
            com.setValue('inscricao', insc.getUniqueValue());
            com.setValue('canal', etapa.canal);
            com.setValue('status', 'agendada');
            if (!com.insert()) {
                throw new Error('comunicação recusada ao gravar (grupo de controle)');
            }
        }
        var contribuinte = insc.getValue('contribuinte');
        var canais = [etapa.canal];
        for (var f = 0; f < ReguaMotor.ORDEM_FALLBACK.length; f++) {
            if (canais.indexOf(ReguaMotor.ORDEM_FALLBACK[f]) < 0) {
                canais.push(ReguaMotor.ORDEM_FALLBACK[f]);
            }
        }
        var config = this._canais();
        var vigente = this._consentimentos(contribuinte);
        var notas = [];
        var tentativas = 0;
        var entregue = '';
        var ultimo = '';
        var agora = new GlideDateTime().getValue();
        for (var k = 0; k < canais.length && !entregue; k++) {
            var canal = canais[k];
            var rotulo = ReguaMotor.ROTULO_CANAL[canal] || canal;
            var cfg = config[canal];
            if (!cfg || !cfg.contratado) {
                notas.push(rotulo + ': não contratado');
                continue;
            }
            if (cfg.exigeOptIn && vigente[canal] !== 'opt_in') {
                notas.push(rotulo + ': sem opt-in');
                continue;
            }
            if (vigente[canal] === 'opt_out') {
                notas.push(rotulo + ': opt-out');
                continue;
            }
            if (this._tentativasNaJanela(contribuinte, canal) >= ReguaMotor.TETO_POR_JANELA) {
                notas.push(rotulo + ': teto');
                continue;
            }
            var env = new GlideRecord(ReguaMotor.T_ENVIO);
            env.initialize();
            env.setValue('comunicacao', com.getUniqueValue());
            env.setValue('inscricao', insc.getUniqueValue());
            env.setValue('canal', canal);
            env.setValue('status_retorno', cfg.falha ? 'falha' : 'entregue');
            env.setValue('codigo_retorno', cfg.falha ? '500' : '200');
            env.setValue('recebido_em', agora);
            env.insert();
            tentativas++;
            ultimo = canal;
            if (cfg.falha) {
                notas.push(rotulo + ': falha');
            } else {
                entregue = canal;
            }
        }
        var status = entregue ? 'entregue' : (tentativas > 0 ? 'falha' : 'pulada');
        com.setValue('status', status);
        com.setValue('canal', entregue || ultimo || etapa.canal);
        com.setValue('tentativas', tentativas);
        if (tentativas > 0) {
            com.setValue('enviada_em', agora);
        }
        var motivo = notas.join('; ');
        com.setValue('motivo', status === 'pulada' ? 'Comunicação pulada: ' + motivo + '.' : motivo);
        com.update();
        if (status !== 'entregue') {
            gs.warn('RF-MOD-F4-011: comunicação ' + com.getUniqueValue() + ' da inscrição ' + insc.getUniqueValue() + ' etapa ' + ordem + ' ' + status + ' — ' + motivo);
        }
        return { status: status, canal: com.getValue('canal'), comunicacao: com.getUniqueValue() };
    },

    /**
     * Fecho da régua (D13, D14, RN-NOVO-F4-008): lê a ação sem resposta da última etapa.
     * encaminhar_ativa: o contribuinte entra na lista do atendente por QualificacaoCiclo.atribuirContato (reaproveita
     * o contato aberto do ciclo, sem duplicar), a inscrição guarda o contato e encerra «encaminhada_ativa».
     * encaminhar_qualificada: grava contribuinte.encaminhado_qualificada_em (lida por SegmentacaoScore.aplicar na
     * próxima publicação) e encerra «encaminhada_qualificada». Inscrição que não está ativa: nada muda (idempotente).
     * @returns {{destino: string, contato: string}} destino 'ativa', 'qualificada' ou '' (nada feito)
     */
    escalonar: function (inscricao) {
        var insc = this._inscricao(inscricao);
        if (!insc || insc.getValue('status') !== 'ativa') {
            return { destino: '', contato: '' };
        }
        var etapas = this._etapas(insc.getValue('regua'));
        var acao = etapas.length ? etapas[etapas.length - 1].acao : '';
        var id = insc.getUniqueValue();
        var contribuinte = insc.getValue('contribuinte');
        if (acao === 'encaminhar_ativa') {
            var r = new QualificacaoCiclo().atribuirContato(contribuinte, insc.getValue('ciclo'), 'regua', id);
            if (!r.contato) {
                throw new Error('contato da cobrança ativa não foi gravado');
            }
            insc.setValue('contato', r.contato);
            insc.update();
            this.encerrar(insc, 'encaminhada_ativa');
            gs.info('RF-MOD-F4-012: inscrição ' + id + ' encaminhada à cobrança ativa; contato ' + r.contato + (r.criado ? ' criado' : ' reaproveitado'));
            return { destino: 'ativa', contato: r.contato };
        }
        if (acao === 'encaminhar_qualificada') {
            var p = new GlideRecord(ReguaMotor.T_CONTRIBUINTE);
            if (!p.get(contribuinte)) {
                throw new Error('contribuinte da inscrição não encontrado');
            }
            p.setValue('encaminhado_qualificada_em', new GlideDateTime().getValue());
            p.update();
            this.encerrar(insc, 'encaminhada_qualificada');
            gs.info('RF-MOD-F4-012: inscrição ' + id + ' encaminhada à cobrança qualificada (próximo ciclo)');
            return { destino: 'qualificada', contato: '' };
        }
        throw new Error('a última etapa da régua não encaminha (ação «' + acao + '»)');
    },

    /**
     * Publicação do ciclo (BR after update prévia → publicado, D7): inscreve cada contribuinte da massificada na régua
     * ativa da carteira do maior débito em aberto (tributo com a maior soma de valor). Sem débito em aberto, sem régua
     * ativa da carteira ou já com inscrição ativa nessa régua: pula. O grupo de controle fica de fora (segmento
     * controle, e a BR da inscrição recusa). Depois limpa a marca encaminhado_qualificada_em de quem a marca levou à
     * qualificada neste ciclo (motivo «Esgotou a régua»); a marca gravada depois da segmentação da prévia continua
     * para o ciclo seguinte. Consultas agregadas, sem consulta por contribuinte.
     * @param {GlideRecord|string} ciclo
     * @returns {number} inscrições criadas
     */
    inscrever: function (ciclo) {
        var cicloId = ReguaMotor.idDe(ciclo);
        var massificada = [];
        var consumidos = [];
        var seg = new GlideRecord(ReguaMotor.T_SEGMENTACAO);
        seg.addQuery('ciclo', cicloId);
        seg.query();
        while (seg.next()) {
            if (seg.getValue('motivo') === SegmentacaoScore.MOTIVO_REGUA) {
                consumidos.push(seg.getValue('contribuinte'));
            }
            if (seg.getValue('segmento') === 'massificada') {
                massificada.push(seg.getValue('contribuinte'));
            }
        }
        var criadas = 0;
        if (massificada.length) {
            var maior = {};
            var deb = new GlideAggregate(ReguaMotor.T_DEBITO);
            deb.addQuery('contribuinte', 'IN', massificada.join(','));
            deb.addQuery('status', 'aberto');
            deb.addNotNullQuery('tributo');
            deb.addAggregate('SUM', 'valor');
            deb.groupBy('contribuinte');
            deb.groupBy('tributo');
            deb.query();
            while (deb.next()) {
                var pid = deb.getValue('contribuinte');
                var soma = parseFloat(deb.getAggregate('SUM', 'valor')) || 0;
                if (!maior[pid] || soma > maior[pid].soma) {
                    maior[pid] = { tributo: deb.getValue('tributo'), soma: soma };
                }
            }
            var reguas = this._reguasAtivas();
            var ativas = this._inscritosAtivos(massificada);
            for (var i = 0; i < massificada.length; i++) {
                var c = massificada[i];
                var regua = maior[c] ? reguas[maior[c].tributo] : '';
                if (!regua || ativas[c + '|' + regua]) {
                    continue;
                }
                if (this._criarInscricao(c, regua, cicloId, '')) {
                    ativas[c + '|' + regua] = true;
                    criadas++;
                }
            }
        }
        if (consumidos.length) {
            var marca = new GlideRecord(ReguaMotor.T_CONTRIBUINTE);
            marca.addQuery('sys_id', 'IN', consumidos.join(','));
            marca.addNotNullQuery('encaminhado_qualificada_em');
            marca.setValue('encaminhado_qualificada_em', '');
            marca.updateMultiple();
        }
        gs.info('RF-MOD-F4-012_br_inscrever_ao_publicar: ciclo ' + cicloId + ', ' + criadas + ' inscrição(ões) criada(s); usuário ' + gs.getUserID());
        return criadas;
    },

    /**
     * Parcelamento que vira «em risco» (P3, D16): inscreve o contribuinte na régua ativa de Parcelamentos, com o
     * parcelamento e o último ciclo publicado (vazio se não há). Sem régua ativa ou já com inscrição ativa nela: pula.
     * Contribuinte no controle desse ciclo é recusado pela BR da inscrição.
     * @returns {string} sys_id da inscrição criada ('' quando não criou)
     */
    inscreverParcelamento: function (parcelamento) {
        var parc = new GlideRecord(ReguaMotor.T_PARCELAMENTO);
        if (!parc.get(ReguaMotor.idDe(parcelamento))) {
            return '';
        }
        var regua = this._reguasAtivas().parcelamentos;
        var contribuinte = parc.getValue('contribuinte');
        if (!regua || !contribuinte || this._inscritosAtivos([contribuinte])[contribuinte + '|' + regua]) {
            return '';
        }
        var ciclo = new GlideRecord(ReguaMotor.T_CICLO);
        ciclo.addQuery('estado', 'publicado');
        ciclo.orderByDesc('publicado_em');
        ciclo.setLimit(1);
        ciclo.query();
        var cicloId = ciclo.next() ? ciclo.getUniqueValue() : '';
        var id = this._criarInscricao(contribuinte, regua, cicloId, parc.getUniqueValue());
        gs.info('RF-MOD-F4-013_br_parcelamento_em_risco: parcelamento ' + parc.getUniqueValue() + (id ? ' inscrito (' + id + ')' : ' não inscrito'));
        return id || '';
    },

    /**
     * Regularização, mudança de débito ou de parcelamento (B4): cada inscrição ativa do contribuinte com motivo de
     * parada encerra na hora (RN-NOVO-F4-009, G8).
     * @returns {number} inscrições encerradas
     */
    reavaliar: function (contribuinte) {
        var id = ReguaMotor.idDe(contribuinte);
        var encerradas = 0;
        if (!id) {
            return 0;
        }
        var insc = new GlideRecord(ReguaMotor.T_INSCRICAO);
        insc.addQuery('contribuinte', id);
        insc.addQuery('status', 'ativa');
        insc.query();
        while (insc.next()) {
            var motivo = this.motivoParada(insc.getUniqueValue());
            if (motivo) {
                this.encerrar(insc.getUniqueValue(), motivo);
                encerradas++;
            }
        }
        if (encerradas) {
            gs.info('RF-MOD-F4-012: contribuinte ' + id + ', ' + encerradas + ' inscrição(ões) encerrada(s) na reavaliação');
        }
        return encerradas;
    },

    /** Régua deixou de estar ativa (BR after update): encerra as inscrições ativas dela com «regua_pausada». */
    encerrarDaRegua: function (regua) {
        var n = 0;
        var insc = new GlideRecord(ReguaMotor.T_INSCRICAO);
        insc.addQuery('regua', ReguaMotor.idDe(regua));
        insc.addQuery('status', 'ativa');
        insc.query();
        while (insc.next()) {
            this.encerrar(insc.getUniqueValue(), 'regua_pausada');
            n++;
        }
        gs.info('F4-010_ua_pausar_regua: régua ' + ReguaMotor.idDe(regua) + ' pausada, ' + n + ' inscrição(ões) encerrada(s); usuário ' + gs.getUserID());
        return n;
    },

    /** «Pausar»: grava ativa = false; a BR da régua encerra as inscrições ativas. */
    pausar: function (regua) {
        return this._gravarAtiva(regua, false);
    },

    /** «Ativar»: grava ativa = true; inscrição encerrada pela pausa não volta (quem entra é a próxima publicação). */
    ativar: function (regua) {
        return this._gravarAtiva(regua, true);
    },

    _gravarAtiva: function (regua, ativa) {
        var r = new GlideRecord(ReguaMotor.T_REGUA);
        if (!r.get(ReguaMotor.idDe(regua))) {
            return { ok: false, mensagem: ReguaMotor.MSG_REGUA_NAO_ACHADA };
        }
        if ((r.getValue('ativa') === '1') === ativa) {
            return { ok: false, mensagem: ativa ? ReguaMotor.MSG_JA_ATIVA : ReguaMotor.MSG_JA_PAUSADA };
        }
        var antes = 0;
        if (!ativa) {
            var agg = new GlideAggregate(ReguaMotor.T_INSCRICAO);
            agg.addQuery('regua', r.getUniqueValue());
            agg.addQuery('status', 'ativa');
            agg.addAggregate('COUNT');
            agg.query();
            antes = agg.next() ? parseInt(agg.getAggregate('COUNT'), 10) : 0;
        }
        r.setValue('ativa', ativa);
        r.update();
        return { ok: true, mensagem: ativa ? ReguaMotor.MSG_ATIVADA : ReguaMotor.MSG_PAUSADA.replace('{n}', antes), encerradas: antes };
    },

    /** Régua ativa por carteira: { carteira: sys_id } (a mais antiga, quando há mais de uma). Uma consulta. */
    _reguasAtivas: function () {
        var mapa = {};
        var r = new GlideRecord(ReguaMotor.T_REGUA);
        r.addQuery('ativa', true);
        r.orderBy('sys_created_on');
        r.query();
        while (r.next()) {
            if (!mapa[r.getValue('carteira')]) {
                mapa[r.getValue('carteira')] = r.getUniqueValue();
            }
        }
        return mapa;
    },

    /** Inscrições ativas dos contribuintes: { 'contribuinte|regua': true }. Uma consulta. */
    _inscritosAtivos: function (contribuintes) {
        var mapa = {};
        var i = new GlideRecord(ReguaMotor.T_INSCRICAO);
        i.addQuery('contribuinte', 'IN', contribuintes.join(','));
        i.addQuery('status', 'ativa');
        i.query();
        while (i.next()) {
            mapa[i.getValue('contribuinte') + '|' + i.getValue('regua')] = true;
        }
        return mapa;
    },

    /** Cria a inscrição (as BRs preenchem status, etapa e início e recusam o controle). '' quando recusada. */
    _criarInscricao: function (contribuinte, regua, ciclo, parcelamento) {
        var n = new GlideRecord(ReguaMotor.T_INSCRICAO);
        n.initialize();
        n.setValue('contribuinte', contribuinte);
        n.setValue('regua', regua);
        if (ciclo) {
            n.setValue('ciclo', ciclo);
        }
        if (parcelamento) {
            n.setValue('parcelamento', parcelamento);
        }
        n.setValue('status', 'ativa');
        n.setValue('etapa_atual', 0);
        n.setValue('iniciada_em', new GlideDateTime().getValue());
        return n.insert() || '';
    },

    // ——— Gravação da inscrição, da régua e da etapa (business rules) ———

    /**
     * Before insert da inscrição: na régua de Parcelamentos o parcelamento é obrigatório (é ele que diz quando a
     * régua para; GAP-159). @returns {string} mensagem de recusa ('' quando grava)
     */
    motivoRecusaInscricao: function (current) {
        if (current.getValue('parcelamento')) {
            return '';
        }
        var r = new GlideRecord(ReguaMotor.T_REGUA);
        return r.get(current.getValue('regua')) && r.getValue('carteira') === 'parcelamentos' ? ReguaMotor.MSG_PARCELAMENTO : '';
    },

    /** Before insert da inscrição: status ativa, etapa 0 e iniciada_em agora quando vierem vazios. */
    preencherInscricao: function (current) {
        if (!current.getValue('status')) {
            current.setValue('status', 'ativa');
        }
        if (!current.getValue('etapa_atual')) {
            current.setValue('etapa_atual', 0);
        }
        if (!current.getValue('iniciada_em')) {
            current.setValue('iniciada_em', new GlideDateTime().getValue());
        }
    },

    /**
     * Régua: código obrigatório e único; prazo final obrigatório (padrão 5 na criação).
     * @returns {string} mensagem de recusa ('' quando grava)
     */
    motivoRecusaRegua: function (current) {
        var codigo = current.getValue('codigo');
        if (!codigo) {
            return ReguaMotor.MSG_SEM_CODIGO;
        }
        if (current.getValue('prazo_final_dias') === null || current.getValue('prazo_final_dias') === '') {
            if (current.isNewRecord() || current.operation() === 'insert') {
                current.setValue('prazo_final_dias', 5);
            } else {
                return ReguaMotor.MSG_SEM_PRAZO;
            }
        }
        var outra = new GlideRecord(ReguaMotor.T_REGUA);
        outra.addQuery('codigo', codigo);
        outra.addQuery('sys_id', '!=', current.getUniqueValue());
        outra.setLimit(1);
        outra.query();
        return outra.hasNext() ? ReguaMotor.MSG_CODIGO_REPETIDO : '';
    },

    /**
     * Etapa (D17): sem valor nem tributo no texto de canal informal; só a última encaminha (e, numa alteração,
     * a última precisa encaminhar); postura sobe no máximo um nível e não regride; dia em ordem.
     * Uma consulta às etapas da mesma régua.
     * @returns {string} mensagem de recusa ('' quando grava)
     */
    motivoRecusaEtapa: function (current) {
        if (ReguaMotor.CANAIS_INFORMAIS[current.getValue('canal')] && ReguaMotor.SIGILO.test(current.getValue('template') || '')) {
            return ReguaMotor.MSG_SIGILO;
        }
        var eu = {
            id: current.getUniqueValue(), ordem: parseInt(current.getValue('ordem') || '0', 10),
            dia: parseInt(current.getValue('offset_dias') || '0', 10), postura: current.getValue('postura'),
            acao: current.getValue('acao_sem_resposta'), atual: true
        };
        var lista = [];
        var outras = this._etapas(current.getValue('regua'));
        for (var i = 0; i < outras.length; i++) {
            if (outras[i].id !== eu.id) {
                lista.push(outras[i]);
            }
        }
        lista.push(eu);
        lista.sort(function (a, b) { return a.ordem - b.ordem || (a.atual ? 1 : 0) - (b.atual ? 1 : 0); });
        var pos = lista.indexOf(eu);
        var ant = pos > 0 ? lista[pos - 1] : null;
        var seg = pos < lista.length - 1 ? lista[pos + 1] : null;
        var alteracao = !(current.isNewRecord() || current.operation() === 'insert');
        for (var k = 0; k < lista.length - 1; k++) {
            if (ReguaMotor.ENCAMINHA[lista[k].acao]) {
                return ReguaMotor.MSG_ENCAMINHAR;
            }
        }
        if (alteracao && !seg && !ReguaMotor.ENCAMINHA[eu.acao]) {
            return ReguaMotor.MSG_ENCAMINHAR;
        }
        var nivel = function (p) { return ReguaMotor.POSTURAS.indexOf(p); };
        if (ant && ant.postura && eu.postura) {
            var d1 = nivel(eu.postura) - nivel(ant.postura);
            if (d1 < 0 || d1 > 1) {
                return ReguaMotor.MSG_POSTURA;
            }
        }
        if (seg && seg.postura && eu.postura) {
            var d2 = nivel(seg.postura) - nivel(eu.postura);
            if (d2 < 0 || d2 > 1) {
                return ReguaMotor.MSG_POSTURA;
            }
        }
        if ((ant && !(eu.dia > ant.dia)) || (seg && !(seg.dia > eu.dia))) {
            return ReguaMotor.MSG_DIA;
        }
        return '';
    },

    /**
     * sys_id do Flow da régua: o campo «Flow»; vazio, o sys_hub_flow com internal_name regua_<codigo> (plano B de B6).
     * @returns {string} '' quando não há Flow
     */
    flowDaRegua: function (regua) {
        var r = new GlideRecord(ReguaMotor.T_REGUA);
        if (!r.get(ReguaMotor.idDe(regua))) {
            return '';
        }
        if (r.getValue('flow')) {
            return r.getValue('flow');
        }
        var f = new GlideRecord('sys_hub_flow');
        f.addQuery('internal_name', 'regua_' + r.getValue('codigo'));
        f.setLimit(1);
        f.query();
        return f.next() ? f.getUniqueValue() : '';
    },

    /** «Ver execuções» (D12): lista de sys_flow_context do Flow da régua, mais recentes primeiro. */
    urlExecucoes: function (regua) {
        var r = new GlideRecord(ReguaMotor.T_REGUA);
        if (!r.get(ReguaMotor.idDe(regua))) {
            return '';
        }
        var flow = this.flowDaRegua(r);
        var filtro = (flow ? 'flow=' + flow : 'name=Régua: ' + r.getValue('nome')) + '^ORDERBYDESCsys_created_on';
        return 'sys_flow_context_list.do?sysparm_query=' + encodeURIComponent(filtro);
    },

    /** «Abrir no Flow Designer» (D12, D15): o Flow da régua no Designer. '' quando a régua não tem Flow. */
    urlDesigner: function (regua) {
        var flow = this.flowDaRegua(regua);
        return flow ? '$flow-designer.do#/flow-designer/' + flow : '';
    },

    /**
     * «Ver execução» (D12): a execução mais recente cujo source_record é a inscrição (F0, ponto 6), nos detalhes
     * de execução do Flow Designer. '' quando a inscrição não tem execução.
     */
    urlExecucao: function (inscricao) {
        var id = ReguaMotor.idDe(inscricao);
        if (!id) {
            return '';
        }
        var c = new GlideRecord('sys_flow_context');
        c.addQuery('source_record', id);
        c.orderByDesc('sys_created_on');
        c.setLimit(1);
        c.query();
        return c.next() ? '$flow-designer.do#/operations/context/' + c.getUniqueValue() : '';
    },

    type: 'ReguaMotor'
};
