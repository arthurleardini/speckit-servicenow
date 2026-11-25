// RF-MOD-F4-012 — régua deixou de estar ativa (botão «Pausar», form, lista ou API): encerra as inscrições ativas
// dela com «Régua pausada»; o Flow de cada uma para na próxima guarda (design ux-v2, B4).
(function executeRule(current, previous) {
    new ReguaMotor().encerrarDaRegua(current);
})(current, previous);
