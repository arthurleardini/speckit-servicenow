// RF-MOD-F4-011 — passo «Enviar» da custom action «Régua: enviar comunicação (simulado)» (design ux-v2, B3).
(function execute(inputs, outputs) {
    try {
        var r = new ReguaMotor().enviar(inputs.inscricao, parseInt(inputs.ordem, 10));
        outputs.status = r.status;
        outputs.canal = r.canal;
        outputs.comunicacao = r.comunicacao;
    } catch (e) {
        gs.error('RF-MOD-F4: erro em enviar da inscrição ' + ReguaMotor.idDe(inputs.inscricao) + ', etapa ' + inputs.ordem + ': ' + e);
        throw e;
    }
})(inputs, outputs);
