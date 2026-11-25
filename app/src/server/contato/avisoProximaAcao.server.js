// RF-MOD-UX-010 — aviso «Próximo passo» no topo do form do contato aberto (RN-NOVO-UX-015).
(function executeRule(current, previous) {
    if (current.isNewRecord() || current.getValue('status') == 'encerrado') {
        return;
    }
    gs.addInfoMessage(gs.getMessage('Próximo passo: {0}', new ProximaAcao().texto(current)));
})(current, previous);
