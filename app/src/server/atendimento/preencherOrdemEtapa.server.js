// RF-MOD-UX-005 — «Casos qualificados» ordenados pela sequência das etapas: grava a posição do estágio.
(function executeRule(current, previous) {
    new CasoConducao().preencherOrdemEtapa(current);
})(current, previous);
