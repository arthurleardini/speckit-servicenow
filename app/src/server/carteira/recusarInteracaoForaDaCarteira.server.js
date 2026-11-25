// RF-MOD-F5-007 — atendente só registra ou altera interação de contato dele (o caso qualificado é do coordenador, design UX v1 🔴4) (RN-NOVO-F5-007, SEC-002).
// Reforça a ACL na gravação: vale também para script e API chamados em nome do usuário.
(function executeRule(current, previous) {
    var msg = new CarteiraAtendente().motivoRecusa(current, ['contato.atendente', 'caso.coordenador']);
    if (msg) {
        gs.warn('RF-MOD-F5-007 SEC-002: gravação de interação recusada; usuário ' + gs.getUserID() + ', contato ' + current.getValue('contato') + ', caso ' + current.getValue('caso'));
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
