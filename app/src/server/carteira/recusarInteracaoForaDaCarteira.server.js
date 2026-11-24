// RF-MOD-F5-007 — atendente só registra ou altera interação de caso dele (RN-NOVO-F5-007, SEC-002).
// Reforça a ACL na gravação: vale também para script e API chamados em nome do usuário.
(function executeRule(current, previous) {
    var msg = new CarteiraAtendente().motivoRecusa(current, 'caso.atendente');
    if (msg) {
        gs.warn('RF-MOD-F5-007 SEC-002: gravação de interação recusada; usuário ' + gs.getUserID() + ', caso ' + current.getValue('caso'));
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
