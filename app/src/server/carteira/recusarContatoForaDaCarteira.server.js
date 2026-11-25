// RF-MOD-UX-006 — atendente só altera contato da lista que já é dele e não troca o dono (RN-NOVO-F5-007); e,
// por qualquer caminho (form, lista, API), contato só vai a «Encerrado» com motivo (RN-NOVO-UX-005).
// Confere o dono como estava gravado: trocar o atendente não dá acesso.
(function executeRule(current, previous) {
    var carteira = new CarteiraAtendente();
    var msg = carteira.motivoRecusa(previous, 'atendente');
    if (!msg && !carteira.veTudo() && current.atendente.changes()) {
        msg = CarteiraAtendente.MSG_RECUSA;
    }
    if (!msg && current.getValue('status') == 'encerrado' && !current.getValue('motivo_encerramento')) {
        msg = ContatoLigacao.MSG_SEM_MOTIVO;
    }
    if (msg) {
        gs.warn('RF-MOD-UX-006: alteração de contato recusada; usuário ' + gs.getUserID() + ', contato ' + current.getUniqueValue() + ' — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
