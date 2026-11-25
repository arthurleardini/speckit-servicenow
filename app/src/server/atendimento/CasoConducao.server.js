/**
 * CasoConducao — verbos do caso qualificado conduzido pelo coordenador (RF-MOD-UX-005, RN-NOVO-UX-008,
 * design UX v1 R6).
 *
 * «Avançar etapa» leva o caso à etapa seguinte na ordem em_selecao → selecionado → dossie_gerado →
 * conducao; da condução em diante o caminho é «Encerrar caso», que exige o motivo. Só coordenador e admin
 * do app conduzem o caso (o atendente nem o vê — US-MOD-UX-006). Devolve {ok, mensagem}.
 */
var CasoConducao = Class.create();

CasoConducao.TABELA_CASO = 'x_2326104_cob_caso';
CasoConducao.ORDEM = ['em_selecao', 'selecionado', 'dossie_gerado', 'conducao'];
CasoConducao.ROTULO = { em_selecao: 'Em seleção', selecionado: 'Caso selecionado', dossie_gerado: 'Dossiê gerado', conducao: 'Condução', encerrado: 'Encerrado' };
CasoConducao.MOTIVOS = { regularizado: 'Regularizado', esgotado: 'Esgotado', outro: 'Outro' };
CasoConducao.MSG_ENCERRADO = 'Operação recusada: caso já encerrado.';
CasoConducao.MSG_SEM_MOTIVO = 'Operação recusada: informe o motivo de encerramento.';
CasoConducao.MSG_ULTIMA_ETAPA = 'Operação recusada: o caso já está em condução; use «Encerrar caso».';
CasoConducao.MSG_SO_COORDENADOR = 'Operação recusada: só o coordenador conduz o caso qualificado.';
CasoConducao.MSG_NAO_GRAVOU = 'O caso não foi gravado. Confira a mensagem acima e tente de novo.';
CasoConducao.MSG_PULAR_ETAPA = 'Operação recusada: o caso anda uma etapa por vez; use «Avançar etapa».';
CasoConducao.MSG_REABRIR = 'Operação recusada: caso encerrado não reabre.';

CasoConducao.prototype = {
    initialize: function () {},

    /**
     * Botão «Avançar etapa».
     * @param {GlideRecord} caso
     * @returns {{ok: boolean, mensagem: string}}
     */
    avancarEtapa: function (caso) {
        var gravado = this._gravado(caso);
        var recusa = this._recusaBasica(gravado);
        if (recusa) {
            return this._recusar(caso, recusa, 'RF-MOD-UX-005_ua_avancar_etapa');
        }
        var atual = gravado.getValue('estagio') || CasoConducao.ORDEM[0];
        var i = CasoConducao.ORDEM.indexOf(atual);
        if (i < 0 || i >= CasoConducao.ORDEM.length - 1) {
            return this._recusar(caso, CasoConducao.MSG_ULTIMA_ETAPA, 'RF-MOD-UX-005_ua_avancar_etapa');
        }
        var proxima = CasoConducao.ORDEM[i + 1];
        caso.setValue('estagio', proxima);
        if (!caso.update()) {
            return { ok: false, mensagem: CasoConducao.MSG_NAO_GRAVOU };
        }
        gs.info('RF-MOD-UX-005_ua_avancar_etapa: caso ' + caso.getUniqueValue() + ' ' + atual + ' → ' + proxima + '; usuário ' + gs.getUserID());
        return { ok: true, mensagem: 'Caso avançou para «' + CasoConducao.ROTULO[proxima] + '».' };
    },

    /**
     * Botão «Encerrar caso»: exige o motivo; grava a data do encerramento.
     * @param {GlideRecord} caso
     * @param {string} motivo choice de caso.motivo_encerramento
     * @returns {{ok: boolean, mensagem: string}}
     */
    encerrar: function (caso, motivo) {
        var recusa = this._recusaBasica(this._gravado(caso));
        if (recusa) {
            return this._recusar(caso, recusa, 'RF-MOD-UX-005_ua_encerrar_caso');
        }
        motivo = String(motivo || '');
        if (!CasoConducao.MOTIVOS.hasOwnProperty(motivo)) {
            return this._recusar(caso, CasoConducao.MSG_SEM_MOTIVO, 'RF-MOD-UX-005_ua_encerrar_caso');
        }
        caso.setValue('estagio', 'encerrado');
        caso.setValue('motivo_encerramento', motivo);
        caso.setValue('encerrado_em', new GlideDateTime());
        if (!caso.update()) {
            return { ok: false, mensagem: CasoConducao.MSG_NAO_GRAVOU };
        }
        gs.info('RF-MOD-UX-005_ua_encerrar_caso: caso ' + caso.getUniqueValue() + ' encerrado (' + motivo + '); usuário ' + gs.getUserID());
        return { ok: true, mensagem: 'Caso encerrado: ' + CasoConducao.MOTIVOS[motivo] + '.' };
    },

    /**
     * Posição do estágio na trilha (1 Em seleção … 5 Encerrado), para ordenar «Casos qualificados» pela
     * sequência das etapas — a lista ordena choice pelo valor, não pela sequência (business rule before).
     * @param {GlideRecord} caso registro sendo gravado
     */
    preencherOrdemEtapa: function (caso) {
        var ordem = CasoConducao.ORDEM.indexOf(caso.getValue('estagio'));
        var valor = caso.getValue('estagio') == 'encerrado' ? CasoConducao.ORDEM.length + 1 : ordem + 1;
        caso.setValue('etapa_ordem', valor > 0 ? valor : '');
    },

    /**
     * Mudança de estágio por qualquer caminho (form, lista, API, script) segue as mesmas regras dos botões
     * (GAP-152): anda uma etapa por vez na ordem, «Encerrado» exige motivo e caso encerrado não volta.
     * Chamada pela business rule before update do caso. '' quando segue.
     * @param {string} anterior estágio gravado
     * @param {string} novo estágio pedido
     * @param {string} motivo motivo de encerramento do registro sendo gravado
     */
    motivoRecusaEstagio: function (anterior, novo, motivo) {
        anterior = String(anterior || CasoConducao.ORDEM[0]);
        novo = String(novo || '');
        if (anterior == novo) {
            return '';
        }
        if (anterior == 'encerrado') {
            return CasoConducao.MSG_REABRIR;
        }
        if (novo == 'encerrado') {
            return CasoConducao.MOTIVOS.hasOwnProperty(String(motivo || '')) ? '' : CasoConducao.MSG_SEM_MOTIVO;
        }
        var i = CasoConducao.ORDEM.indexOf(anterior);
        return i >= 0 && CasoConducao.ORDEM[i + 1] == novo ? '' : CasoConducao.MSG_PULAR_ETAPA;
    },

    /** Caso como está gravado (o estágio e o dono não vêm do form). */
    _gravado: function (caso) {
        var g = new GlideRecord(CasoConducao.TABELA_CASO);
        return caso && caso.getUniqueValue() && g.get(caso.getUniqueValue()) ? g : null;
    },

    _recusaBasica: function (gravado) {
        var escopo = gs.getCurrentScopeName();
        if (!gravado || !(gs.hasRole(escopo + '.coordenador') || gs.hasRole(escopo + '.admin'))) {
            return CasoConducao.MSG_SO_COORDENADOR;
        }
        if (gravado.getValue('estagio') == 'encerrado') {
            return CasoConducao.MSG_ENCERRADO;
        }
        return '';
    },

    _recusar: function (caso, mensagem, origem) {
        gs.warn(origem + ': recusado; caso ' + (caso ? caso.getUniqueValue() : '') + ', usuário ' + gs.getUserID() + ' — ' + mensagem);
        return { ok: false, mensagem: mensagem };
    },

    type: 'CasoConducao'
};
