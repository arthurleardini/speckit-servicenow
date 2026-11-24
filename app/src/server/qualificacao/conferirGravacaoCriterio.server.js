// RF-MOD-F2-001/002 — nome obrigatório, versão nova nasce em rascunho, código + versão não se repetem e só
// o coordenador publica, por qualquer caminho, com data e autor (SEC-009).
(function executeRule(current, previous) {
    if (current.isNewRecord()) {
        if (!current.getValue('estado')) {
            current.setValue('estado', 'rascunho');
        }
        if (!current.getValue('versao')) {
            current.setValue('versao', 1);
        }
    }
    var msg = new CriterioVersao().motivoRecusaGravacao(current, current.isNewRecord() ? null : previous);
    if (msg) {
        gs.warn('RF-MOD-F2-002: gravação de critério recusada ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
