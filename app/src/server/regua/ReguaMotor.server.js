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
ReguaMotor.MSG_SIGILO = 'Operação recusada: texto de e-mail, SMS ou WhatsApp não pode trazer valor nem tributo (só ciência do DT-e).';

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

    /** F2 (US-MOD-F4-010): contrato final, regra mínima — o escalonamento entra na US-MOD-F4-012. */
    escalonar: function (inscricao) {
        return { destino: '', contato: '' };
    },

    // ——— Gravação da inscrição, da régua e da etapa (business rules) ———

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

    type: 'ReguaMotor'
};
