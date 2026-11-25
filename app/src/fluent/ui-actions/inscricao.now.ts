// RF-MOD-F4-014 — «Ver execução» no form da inscrição (D12; design ux-v2 A1 e B6). Abre os detalhes da execução
// do Flow da régua (stage tracker) no Flow Designer: o contexto cujo source_record é a inscrição (F0, ponto 6).
// Sem execução, avisa «Execução não encontrada.» e fica no form. Coordenador e admin do app.
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from '../security/roles.now'

export const ua_ver_execucao = UiAction({
    $id: Now.ID['F4-014_ua_ver_execucao'],
    name: 'Ver execução',
    actionName: 'x_cob_ver_execucao',
    table: 'x_2326104_cob_regua_inscricao',
    hint: 'Abre a execução do Flow desta inscrição no Flow Designer (etapa a etapa)',
    roles: [role_coordenador, role_admin],
    condition: '!current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 300,
    form: { showButton: false, showLink: true, showContextMenu: false },
    script: `(function () {
    var url = new ReguaMotor().urlExecucao(current);
    if (url) {
        action.setRedirectURL(url);
    } else {
        gs.addInfoMessage(ReguaMotor.MSG_SEM_EXECUCAO);
        action.setRedirectURL(current);
    }
})();`,
})
