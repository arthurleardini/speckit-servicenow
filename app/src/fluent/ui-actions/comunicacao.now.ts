// RF-MOD-F4-006 — «Reenviar» comunicação com falha (US-MOD-F4-016, design ux-v2 A1; RN-NOVO-F4-005). Form e lista
// («Disparos com falha»), coordenador e admin do app; a regra fica no ReguaMotor.reenviar (reconfere papel e status,
// mesma lista de canais de enviar, tentativas somam).
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from '../security/roles.now'

export const ua_reenviar = UiAction({
    $id: Now.ID['F4-016_ua_reenviar'],
    name: 'Reenviar',
    actionName: 'x_cob_reenviar',
    table: 'x_2326104_cob_comunicacao',
    hint: 'Nova rodada de tentativas nesta comunicação, com as mesmas regras de canal, consentimento e teto',
    roles: [role_coordenador, role_admin],
    condition: "current.status == 'falha'",
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    script: `(function () {
    var r = new ReguaMotor().reenviar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

export const ual_reenviar = UiAction({
    $id: Now.ID['F4-016_ual_reenviar'],
    name: 'Reenviar',
    actionName: 'x_cob_l_reenviar',
    table: 'x_2326104_cob_comunicacao',
    hint: 'Reenvia cada comunicação com falha marcada',
    roles: [role_coordenador, role_admin],
    condition: "current.status == 'falha'",
    showInsert: false,
    showUpdate: true,
    order: 100,
    list: { showContextMenu: true, showListChoice: true },
    script: `(function () {
    var r = new ReguaMotor().reenviar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
})();`,
})
