/**
 * CasoDossie — monta o dossiê do caso em 3 níveis (RF-MOD-F5-003, RN-NOVO-F5-003, fio condutor 4).
 *
 * Nível 1: débitos e parcelamentos do contribuinte. Nível 2: comunicações e regularizações do
 * contribuinte e interações do caso. Nível 3: score e sinalizações coercitivas (só sinaliza, não
 * executa — RN-NOVO-F5-004). Chamado em nome do usuário: lê o caso por GlideRecordSecure, e o caso de
 * outro atendente devolve nada (RN-NOVO-F5-007). Também filtra as listas relacionadas do form.
 */
var CasoDossie = Class.create();

CasoDossie.TABELA_CASO = 'x_2326104_cob_caso';
CasoDossie.MSG_SEM_CASO = 'Operação recusada: dossiê em 3 níveis (premissa).';
CasoDossie.MSG_SEM_CONTRIBUINTE = 'Operação recusada: visão única do contribuinte por documento.';
CasoDossie.MSG_CARTEIRA = 'Operação recusada: atendente vê só a própria carteira.';

CasoDossie.prototype = {
    initialize: function () {},

    /**
     * @param {string} casoId sys_id do caso
     * @returns {object} `{ok: true, nivel1, nivel2, nivel3}` com os 3 níveis do dossiê, ou
     *   `{ok: false, mensagem}` quando não há caso, o usuário não pode ver o caso (mesma resposta para
     *   caso inexistente, para não revelar se existe) ou o caso não tem contribuinte.
     */
    montar: function (casoId) {
        if (!casoId) {
            return { ok: false, mensagem: CasoDossie.MSG_SEM_CASO };
        }
        var caso = new GlideRecordSecure(CasoDossie.TABELA_CASO);
        if (!caso.get(casoId)) {
            gs.warn('RF-MOD-F5-003 SEC-002: dossiê negado; usuário ' + gs.getUserID() + ', caso ' + casoId);
            return { ok: false, mensagem: CasoDossie.MSG_CARTEIRA };
        }
        var contribuinte = caso.getValue('contribuinte');
        if (!contribuinte) {
            return { ok: false, mensagem: CasoDossie.MSG_SEM_CONTRIBUINTE };
        }
        return {
            ok: true,
            caso: casoId,
            nivel1: {
                debitos: this._contar('x_2326104_cob_debito', 'contribuinte', contribuinte),
                parcelamentos: this._contar('x_2326104_cob_parcelamento', 'contribuinte', contribuinte)
            },
            nivel2: {
                comunicacoes: this._contar('x_2326104_cob_comunicacao', 'contribuinte', contribuinte),
                interacoes: this._contar('x_2326104_cob_interacao', 'caso', casoId),
                regularizacoes: this._contar('x_2326104_cob_regularizacao', 'contribuinte', contribuinte)
            },
            nivel3: {
                score: caso.getValue('score'),
                semScore: ['1', 'true'].indexOf(String(caso.getValue('sem_score'))) >= 0,
                sinalCoercitivo: ['1', 'true'].indexOf(String(caso.getValue('sinal_coercitivo'))) >= 0,
                sinalCoercitivoDesc: caso.getValue('sinal_coercitivo_desc') || ''
            }
        };
    },

    /**
     * Filtro das listas relacionadas do dossiê que saem do contribuinte do caso (sys_relationship).
     * @param {GlideRecord} current consulta da tabela filha
     * @param {GlideRecord} parent o caso aberto no form
     */
    filtrarPorContribuinte: function (current, parent) {
        current.addQuery('contribuinte', parent.getValue('contribuinte') || 'sem-contribuinte');
    },

    _contar: function (tabela, campo, valor) {
        if (!valor) {
            return 0;
        }
        var agg = new GlideAggregate(tabela);
        agg.addQuery(campo, valor);
        agg.addAggregate('COUNT');
        agg.query();
        return agg.next() ? parseInt(agg.getAggregate('COUNT'), 10) || 0 : 0;
    },

    type: 'CasoDossie'
};
