/**
 * CarteiraAtendente — diz se o usuário logado pode ver ou gravar um registro da carteira
 * (RF-MOD-F5-007, RN-NOVO-F5-007, SEC-002, fio condutor 5).
 *
 * Coordenador e admin do app veem tudo. Quem só tem o papel de atendente vê o registro quando o campo
 * de dono (direto ou por dot-walk, como «contribuinte.atendente») é ele. Usado pelas ACL de linha
 * (script de uma linha, RN-SN-137/142): nenhuma consulta própria, só leitura do registro corrente.
 */
var CarteiraAtendente = Class.create();

CarteiraAtendente.MSG_RECUSA = 'Operação recusada: atendente vê só a própria carteira.';

CarteiraAtendente.prototype = {
    initialize: function () {},

    /**
     * Mensagem de recusa quando o usuário não pode mexer no registro ('' quando pode).
     * Usada pelas business rules que reforçam a ACL na gravação.
     */
    motivoRecusa: function (gr, campos) {
        return this.podeVer(gr, campos) ? '' : CarteiraAtendente.MSG_RECUSA;
    },

    /** Coordenador e admin do app veem a carteira inteira. */
    veTudo: function () {
        var escopo = gs.getCurrentScopeName();
        return gs.hasRole(escopo + '.coordenador') || gs.hasRole(escopo + '.admin');
    },

    /**
     * @param {GlideRecord} gr registro avaliado pela ACL
     * @param {string|string[]} campos campo(s) de dono; basta um deles ser o usuário logado
     * @returns {boolean}
     */
    podeVer: function (gr, campos) {
        if (this.veTudo()) {
            return true;
        }
        var lista = typeof campos == 'string' ? [campos] : campos;
        var eu = gs.getUserID();
        for (var i = 0; i < lista.length; i++) {
            var el = gr.getElement(lista[i]);
            if (el && String(el) == eu) {
                return true;
            }
        }
        return false;
    },

    type: 'CarteiraAtendente'
};
