// RF-MOD-F2-004 — publicação do ciclo por qualquer caminho: só o coordenador, com versão publicada do
// critério; o sorteio do grupo de controle, a semente e os totais são gravados pelo sistema (SEC-010).
(function executeRule(current, previous) {
    var msg = new QualificacaoCiclo().prepararPublicacao(current, previous);
    if (msg) {
        gs.warn('RF-MOD-F2-004: gravação de ciclo recusada ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
