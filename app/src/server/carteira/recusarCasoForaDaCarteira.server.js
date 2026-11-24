// RF-MOD-F5-007 — atendente só altera (e encerra) caso que já é dele (RN-NOVO-F5-007, SEC-002).
// Confere o dono como estava gravado: trocar o atendente do caso não dá acesso a ele.
(function executeRule(current, previous) {
    var msg = new CarteiraAtendente().motivoRecusa(previous, 'atendente');
    if (msg) {
        gs.warn('RF-MOD-F5-007 SEC-002: alteração de caso recusada; usuário ' + gs.getUserID() + ', caso ' + current.getUniqueValue());
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
