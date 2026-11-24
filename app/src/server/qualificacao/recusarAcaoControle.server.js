// RF-MOD-F2-004 — contribuinte no grupo de controle não recebe comunicação nem caso (RN-NOVO-F2-005, SEC-010).
(function executeRule(current, previous) {
    var msg = new QualificacaoCiclo().motivoRecusaAcao(current);
    if (msg) {
        gs.warn('RF-MOD-F2-004: gravação recusada ' + current.getTableName() + ' ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
