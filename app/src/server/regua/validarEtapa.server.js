// RF-MOD-F4-010 — gravação da régua e da etapa por qualquer caminho (form, lista, API, script): a etapa não
// salta nem regride postura, o dia vem em ordem, só a última encaminha e o texto de e-mail, SMS e WhatsApp não
// traz valor nem tributo (D17, RN-NOVO-F4-010); a régua tem código único e prazo final. Regra em ReguaMotor.
(function executeRule(current, previous) {
    var motor = new ReguaMotor();
    var msg = current.getTableName() === ReguaMotor.T_REGUA ? motor.motivoRecusaRegua(current) : motor.motivoRecusaEtapa(current);
    if (msg) {
        gs.warn('RF-MOD-F4-010: gravação recusada ' + current.getTableName() + ' ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(gs.getMessage(msg));
        current.setAbortAction(true);
    }
})(current, previous);
