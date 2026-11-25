// RF-MOD-F4-014 — papel de Flow Designer para o coordenador (design ux-cobranca-v2-regua-flow.md, B6, mecanismo 1;
// validado na F0, ponto 5). O papel do coordenador contém flow_designer e flow_operator: ele abre e edita o Flow
// «Régua: <nome>» no Designer, lê as execuções (sys_flow_context) e o campo «Flow» da régua (sem flow_operator a
// referência a sys_hub_flow volta nula e o campo some do form). O admin do app ganha os mesmos papéis, porque vê
// os mesmos links. Referência por nome nos dois lados (sem sys_id fixo); Now.ref('sys_user_role', 'role_coordenador')
// não resolve. Arquivo à mão: roles.now.ts é gerado pelo sn-scaffold.
// Edição feita no Designer vale até o próximo `npm run reinstall`, salvo se levada à fonte (roteiro da demo, B6).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID['F4-014_role_coordenador_flow_designer'],
    table: 'sys_user_role_contains',
    data: {
        role: Now.ref('sys_user_role', { name: 'x_2326104_cob.coordenador' }),
        contains: Now.ref('sys_user_role', { name: 'flow_designer' }),
    },
})

Record({
    $id: Now.ID['F4-014_role_coordenador_flow_operator'],
    table: 'sys_user_role_contains',
    data: {
        role: Now.ref('sys_user_role', { name: 'x_2326104_cob.coordenador' }),
        contains: Now.ref('sys_user_role', { name: 'flow_operator' }),
    },
})

Record({
    $id: Now.ID['F4-014_role_admin_flow_designer'],
    table: 'sys_user_role_contains',
    data: {
        role: Now.ref('sys_user_role', { name: 'x_2326104_cob.admin' }),
        contains: Now.ref('sys_user_role', { name: 'flow_designer' }),
    },
})

Record({
    $id: Now.ID['F4-014_role_admin_flow_operator'],
    table: 'sys_user_role_contains',
    data: {
        role: Now.ref('sys_user_role', { name: 'x_2326104_cob.admin' }),
        contains: Now.ref('sys_user_role', { name: 'flow_operator' }),
    },
})
