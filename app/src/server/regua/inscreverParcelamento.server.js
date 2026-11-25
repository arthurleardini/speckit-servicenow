// RF-MOD-F4-013 — parcelamento passou a «em risco»: inscreve o contribuinte na régua Parcelamentos, com o
// parcelamento e o último ciclo publicado (design ux-v2, D16 e B4; P3 do dono).
(function executeRule(current, previous) {
    try {
        new ReguaMotor().inscreverParcelamento(current);
    } catch (e) {
        gs.error('RF-MOD-F4-013_br_parcelamento_em_risco: parcelamento ' + current.getUniqueValue() + ' — ' + e);
    }
})(current, previous);
