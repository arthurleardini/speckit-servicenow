// RF-MOD-F4-012 — passo «Escalonar» da custom action «Régua: escalonar» (design ux-v2, B3).
(function execute(inputs, outputs) {
    try {
        var r = new ReguaMotor().escalonar(inputs.inscricao);
        outputs.destino = r.destino;
        outputs.contato = r.contato;
    } catch (e) {
        gs.error('RF-MOD-F4: erro no passo escalonar da inscrição ' + ReguaMotor.idDe(inputs.inscricao) + ': ' + e);
        throw e;
    }
})(inputs, outputs);
