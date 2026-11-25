// RF-MOD-F4-011 — passo «Checar guardas» da custom action «Régua: checar guardas» (design ux-v2, B3).
(function execute(inputs, outputs) {
    try {
        var r = new ReguaMotor().checarGuardas(inputs.inscricao);
        outputs.segue = r.segue;
        outputs.motivo = r.motivo;
    } catch (e) {
        gs.error('RF-MOD-F4: erro em checarGuardas da inscrição ' + ReguaMotor.idDe(inputs.inscricao) + ': ' + e);
        throw e;
    }
})(inputs, outputs);
