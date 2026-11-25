// RF-MOD-UX-009 — botão New só para o admin do app nas listas de contato, régua e etapa (inclusive a related
// list de etapas no form da régua). O contato nasce da distribuição; régua e etapa, do gerador (design
// ux-cobranca-v2-regua-flow.md, D2 e A2). new_roles vai como array de string (F0, ponto 8).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

const ADMIN = ['x_2326104_cob.admin']

Record({
    $id: Now.ID['UX-009_lc_contato'],
    table: 'sys_ui_list_control',
    data: { name: 'x_2326104_cob_contato', new_roles: ADMIN },
})

Record({
    $id: Now.ID['UX-009_lc_regua'],
    table: 'sys_ui_list_control',
    data: { name: 'x_2326104_cob_regua', new_roles: ADMIN },
})

Record({
    $id: Now.ID['UX-009_lc_regua_etapa'],
    table: 'sys_ui_list_control',
    data: { name: 'x_2326104_cob_regua_etapa', new_roles: ADMIN },
})

Record({
    $id: Now.ID['UX-009_lc_regua_etapa_relacionada'],
    table: 'sys_ui_list_control',
    data: { name: 'x_2326104_cob_regua', related_list: 'x_2326104_cob_regua_etapa.regua', new_roles: ADMIN },
})
