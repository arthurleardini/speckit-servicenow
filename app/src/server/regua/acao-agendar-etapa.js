// RF-MOD-F4-010 — passo «Agendar» da custom action «Régua: agendar etapa» (design ux-v2, B3).
// inputs.inscricao chega como GlideRecord; inputs.ordem chega como string vinda do Flow e número vindo do FlowAPI.
// executar_em sai como objeto GlideDateTime (com getValue() a espera do Flow atrasa pelo fuso; F0 ponto 1).
(function execute(inputs, outputs) {
    try {
        var r = new ReguaMotor().agendar(inputs.inscricao, parseInt(inputs.ordem, 10));
        outputs.segue = r.segue;
        outputs.executar_em = r.executar_em;
    } catch (e) {
        gs.error('RF-MOD-F4: erro no passo agendar da inscrição ' + ReguaMotor.idDe(inputs.inscricao) + ': ' + e);
        throw e;
    }
})(inputs, outputs);
