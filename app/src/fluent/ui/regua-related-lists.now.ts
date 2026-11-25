// RF-MOD-F4-010 — related lists do form da régua (TEL-014: etapas, inscrições e comunicações) e do form da
// inscrição (TEL-038: comunicações e retornos de envio), design ux-cobranca-v2-regua-flow.md, D12 e CUJ-6.
// O sn-scaffold não gera related list; a regra de UI pede os filhos embutidos no form (servicenow-ui.md).
import '@servicenow/sdk/global'
import { Record, default_view } from '@servicenow/sdk/core'

const listasRegua = Record({
    $id: Now.ID['RF-MOD-F4-010_rel_listas_regua'],
    table: 'sys_ui_related_list',
    data: { name: 'x_2326104_cob_regua', view: default_view },
})

Record({
    $id: Now.ID['RF-MOD-F4-010_rel_regua_etapas'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listasRegua, position: 0, related_list: 'x_2326104_cob_regua_etapa.regua' },
})

Record({
    $id: Now.ID['RF-MOD-F4-010_rel_regua_inscricoes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listasRegua, position: 1, related_list: 'x_2326104_cob_regua_inscricao.regua' },
})

Record({
    $id: Now.ID['RF-MOD-F4-010_rel_regua_comunicacoes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listasRegua, position: 2, related_list: 'x_2326104_cob_comunicacao.regua' },
})

const listasInscricao = Record({
    $id: Now.ID['RF-MOD-F4-010_rel_listas_inscricao'],
    table: 'sys_ui_related_list',
    data: { name: 'x_2326104_cob_regua_inscricao', view: default_view },
})

Record({
    $id: Now.ID['RF-MOD-F4-010_rel_inscricao_comunicacoes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listasInscricao, position: 0, related_list: 'x_2326104_cob_comunicacao.inscricao' },
})

Record({
    $id: Now.ID['RF-MOD-F4-010_rel_inscricao_envios'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listasInscricao, position: 1, related_list: 'x_2326104_cob_envio_sim.inscricao' },
})
