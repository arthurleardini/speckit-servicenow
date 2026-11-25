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

    /** F2 (US-MOD-F4-010): contrato final, regra mínima — as guardas entram na US-MOD-F4-011. */
    checarGuardas: function (inscricao) {
        var insc = this._inscricao(inscricao);
        if (!insc || insc.getValue('status') !== 'ativa') {
            return { segue: false, motivo: '' };
        }
        return { segue: true, motivo: '' };
    },

    /** F2 (US-MOD-F4-010): contrato final, regra mínima — o envio entra na US-MOD-F4-011. */
    enviar: function (inscricao, ordem) {
        return { status: 'pulada', canal: '', comunicacao: '' };
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
