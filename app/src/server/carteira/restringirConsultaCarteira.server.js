// RF-MOD-F5-007 — consulta de quem só tem o papel de atendente traz só a própria carteira (SEC-002).
// Faz o papel do Data Filter com Deny: a lista, o report e as contagens não trazem nem contam linhas de
// outro atendente. Os campos de dono de cada tabela vêm do mapa abaixo.
(function executeRule(current, previous) {
    var DONO = {
        x_2326104_cob_caso: ['coordenador'],
        x_2326104_cob_contribuinte: ['atendente'],
        x_2326104_cob_interacao: ['contato.atendente', 'caso.coordenador'],
        x_2326104_cob_regularizacao: ['atendente', 'caso.coordenador'],
        x_2326104_cob_debito: ['contribuinte.atendente'],
        x_2326104_cob_parcelamento: ['contribuinte.atendente'],
        x_2326104_cob_comunicacao: ['contribuinte.atendente'],
        x_2326104_cob_consentimento: ['contribuinte.atendente'],
        x_2326104_cob_score_sim: ['contribuinte.atendente']
    };
    var campos = DONO[current.getTableName()];
    if (campos) {
        new CarteiraAtendente().restringirConsulta(current, campos);
    }
})(current, previous);
