// RF-MOD-F2-002 — versão nova nasce em rascunho e código + versão não se repetem (SEC-009).
(function executeRule(current, previous) {
    if (current.isNewRecord()) {
        if (!current.getValue('estado')) {
            current.setValue('estado', 'rascunho');
        }
        if (!current.getValue('versao')) {
            current.setValue('versao', 1);
        }
    }
    var msg = new CriterioVersao().motivoRecusaGravacao(current);
    if (msg) {
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
