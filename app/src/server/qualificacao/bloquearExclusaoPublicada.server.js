// RF-MOD-F2-002 — versão publicada ou substituída não é excluída (RN-NOVO-F2-001, SEC-009).
(function executeRule(current, previous) {
    gs.addErrorMessage(CriterioVersao.MSG_EXCLUSAO_PUBLICADA);
    current.setAbortAction(true);
})(current, previous);
