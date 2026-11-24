// RF-MOD-F2-005 — marca o contribuinte «Sem score» e soma no total do ciclo em prévia (RN-NOVO-F3-002).
(function executeRule(current, previous) {
    new SegmentacaoScore().propagarSemScore(current);
})(current, previous);
