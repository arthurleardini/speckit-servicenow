// RF-MOD-F2-002 — recusa alteração de versão publicada ou substituída do critério (RN-NOVO-F2-001, SEC-009).
// Vale para todo papel, inclusive o administrador do app.
(function executeRule(current, previous) {
    var msg = new CriterioVersao().motivoRecusaAlteracao(current, previous);
    if (msg) {
        gs.warn('RF-MOD-F2-002: alteração recusada ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
