// RF-MOD-UX-002 — a interação pertence a exatamente um entre contato e caso (RN-NOVO-UX-004).
(function executeRule(current, previous) {
    var msg = new ContatoLigacao().motivoRecusaInteracao(current);
    if (msg) {
        gs.warn('RF-MOD-UX-002_br_interacao_um_pai: interação recusada; usuário ' + gs.getUserID() + ', interação ' + current.getUniqueValue());
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
