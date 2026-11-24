// RF-MOD-F2-002 — ciclo publicado guarda a versão aplicada e os totais (RN-NOVO-F2-002, SEC-010).
(function executeRule(current, previous) {
    var msg = new CriterioVersao().motivoRecusaAlteracaoCiclo(current, previous);
    if (msg) {
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
