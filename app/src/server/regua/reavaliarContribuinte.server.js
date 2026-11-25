// RF-MOD-F4-012 — débito mudou de status, regularização registrada ou parcelamento saiu de «em risco»: as inscrições
// ativas do contribuinte que perderam o motivo de cobrança encerram na mesma transação (design ux-v2, B4; G8).
(function executeRule(current, previous) {
    try {
        new ReguaMotor().reavaliar(current.getValue('contribuinte'));
    } catch (e) {
        gs.error('RF-MOD-F4-012_br_reavaliar: ' + current.getTableName() + ' ' + current.getUniqueValue() + ' — ' + e);
    }
})(current, previous);
