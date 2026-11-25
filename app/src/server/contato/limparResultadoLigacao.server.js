// RF-MOD-UX-002 / GAP-150 — «Resultado desta ligação» é só campo de entrada do botão «Registrar ligação»: nunca
// fica gravado, para o form abrir sempre vazio e o verbo nunca reaproveitar resultado de ligação anterior.
(function executeRule(current, previous) {
    if (current.getValue('resultado_ligacao')) {
        current.setValue('resultado_ligacao', '');
    }
})(current, previous);
