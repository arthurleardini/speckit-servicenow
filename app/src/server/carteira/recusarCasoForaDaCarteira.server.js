// RF-MOD-F5-007 / RF-MOD-UX-006 — só o coordenador responsável (ou quem vê tudo) altera o caso, e não troca o dono do caso
// (RN-NOVO-F5-007, SEC-002). Confere o dono como estava gravado: trocar o atendente não dá acesso.
(function executeRule(current, previous) {
    var carteira = new CarteiraAtendente();
    var msg = carteira.motivoRecusa(previous, 'coordenador');
    if (!msg && !carteira.veTudo() && current.coordenador.changes()) {
        msg = CarteiraAtendente.MSG_RECUSA;
    }
    if (msg) {
        gs.warn('RF-MOD-F5-007 SEC-002: alteração de caso recusada; usuário ' + gs.getUserID() + ', caso ' + current.getUniqueValue());
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
