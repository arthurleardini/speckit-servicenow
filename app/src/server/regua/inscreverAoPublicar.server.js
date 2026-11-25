// RF-MOD-F4-012 — ciclo publicado (prévia → publicado, por qualquer caminho): inscreve a massificada com débito em
// aberto na régua da carteira do maior débito (design ux-v2, D7 e B4). O controle já foi sorteado no before update.
(function executeRule(current, previous) {
    try {
        new ReguaMotor().inscrever(current);
    } catch (e) {
        gs.error('RF-MOD-F4-012_br_inscrever_ao_publicar: ciclo ' + current.getUniqueValue() + ' — ' + e);
    }
})(current, previous);
