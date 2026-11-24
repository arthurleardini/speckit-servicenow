// RF-MOD-F2-004 — o grupo de controle não muda depois de publicado o ciclo (SEC-010).
(function executeRule(current, previous) {
    var msg = new QualificacaoCiclo().motivoRecusaSegmento(current, previous);
    if (msg) {
        gs.warn('RF-MOD-F2-004: gravação recusada ' + current.getTableName() + ' ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
