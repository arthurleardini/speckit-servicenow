// RF-MOD-F2-005 — classifica a linha da carteira segmentada com o fallback «sem score» (RN-NOVO-F3-002).
// Só age quando a linha chega sem segmento: a prévia do ciclo grava o contribuinte e a regra classifica.
(function executeRule(current, previous) {
    new SegmentacaoScore().aplicar(current);
})(current, previous);
