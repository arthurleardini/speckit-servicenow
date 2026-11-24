// RF-MOD-F2-002 — ao publicar uma versão, as outras publicadas do mesmo código ficam «Substituídas».
(function executeRule(current, previous) {
    new CriterioVersao().substituirAnteriores(current);
})(current, previous);
