// RF-MOD-UX-010 — grava «O que fazer agora» em toda gravação de contato, caso e ciclo (RN-NOVO-UX-015).
(function executeRule(current, previous) {
    current.setValue('proxima_acao', new ProximaAcao().texto(current));
})(current, previous);
