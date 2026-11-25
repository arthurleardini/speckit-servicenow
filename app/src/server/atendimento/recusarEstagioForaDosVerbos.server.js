// RF-MOD-UX-005 / GAP-152 — por qualquer caminho (form, lista, API, script), o estágio do caso segue as regras
// dos botões «Avançar etapa» e «Encerrar caso»: uma etapa por vez, «Encerrado» só com motivo, encerrado não volta.
(function executeRule(current, previous) {
    if (!current.estagio.changes()) {
        return;
    }
    var msg = new CasoConducao().motivoRecusaEstagio(previous.getValue('estagio'), current.getValue('estagio'), current.getValue('motivo_encerramento'));
    if (msg) {
        gs.warn('RF-MOD-UX-005_br_caso_estagio: mudança de estágio recusada; usuário ' + gs.getUserID() + ', caso ' + current.getUniqueValue() + ' (' + previous.getValue('estagio') + ' → ' + current.getValue('estagio') + ') — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
    }
})(current, previous);
