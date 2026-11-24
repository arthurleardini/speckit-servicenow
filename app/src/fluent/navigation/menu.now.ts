// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ApplicationMenu, Record } from '@servicenow/sdk/core'

import { role_coordenador, role_atendente, role_admin } from '../security/roles.now'

export const menu = ApplicationMenu({
    $id: Now.ID['menu_app'],
    title: "Cobrança MT",
    roles: [role_coordenador, role_atendente, role_admin],
    active: true,
})

Record({
    $id: Now.ID["modulo_1_contribuinte"],
    table: 'sys_app_module',
    data: { title: "Contribuinte", application: menu, link_type: 'LIST', name: "x_2326104_cob_contribuinte", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 100 },
})

Record({
    $id: Now.ID["modulo_1_debito"],
    table: 'sys_app_module',
    data: { title: "Débito", application: menu, link_type: 'LIST', name: "x_2326104_cob_debito", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 200 },
})

Record({
    $id: Now.ID["modulo_1_parcelamento"],
    table: 'sys_app_module',
    data: { title: "Parcelamento", application: menu, link_type: 'LIST', name: "x_2326104_cob_parcelamento", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 300 },
})

Record({
    $id: Now.ID["modulo_1_sincronizacao"],
    table: 'sys_app_module',
    data: { title: "Execução de sincronização", application: menu, link_type: 'LIST', name: "x_2326104_cob_sincronizacao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 400 },
})

Record({
    $id: Now.ID["modulo_1_rejeicao"],
    table: 'sys_app_module',
    data: { title: "Rejeição de registro", application: menu, link_type: 'LIST', name: "x_2326104_cob_rejeicao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 500 },
})

Record({
    $id: Now.ID["modulo_1_debito_stg"],
    table: 'sys_app_module',
    data: { title: "Staging de fontes (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_debito_stg", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 600 },
})

Record({
    $id: Now.ID["modulo_2_criterio"],
    table: 'sys_app_module',
    data: { title: "Critério de qualificação", application: menu, link_type: 'LIST', name: "x_2326104_cob_criterio", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 700 },
})

Record({
    $id: Now.ID["modulo_2_ciclo"],
    table: 'sys_app_module',
    data: { title: "Ciclo de qualificação", application: menu, link_type: 'LIST', name: "x_2326104_cob_ciclo", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 800 },
})

Record({
    $id: Now.ID["modulo_2_segmentacao"],
    table: 'sys_app_module',
    data: { title: "Carteira segmentada", application: menu, link_type: 'LIST', name: "x_2326104_cob_segmentacao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 900 },
})

Record({
    $id: Now.ID["modulo_3_score_sim"],
    table: 'sys_app_module',
    data: { title: "Score de liquidez (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_score_sim", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1000 },
})

Record({
    $id: Now.ID["modulo_4_regua"],
    table: 'sys_app_module',
    data: { title: "Régua de cobrança", application: menu, link_type: 'LIST', name: "x_2326104_cob_regua", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1100 },
})

Record({
    $id: Now.ID["modulo_4_regua_etapa"],
    table: 'sys_app_module',
    data: { title: "Etapa da régua", application: menu, link_type: 'LIST', name: "x_2326104_cob_regua_etapa", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1200 },
})

Record({
    $id: Now.ID["modulo_4_comunicacao"],
    table: 'sys_app_module',
    data: { title: "Comunicação", application: menu, link_type: 'LIST', name: "x_2326104_cob_comunicacao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1300 },
})

Record({
    $id: Now.ID["modulo_4_envio_sim"],
    table: 'sys_app_module',
    data: { title: "Retorno de envio (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_envio_sim", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1400 },
})

Record({
    $id: Now.ID["modulo_4_canal_sim"],
    table: 'sys_app_module',
    data: { title: "Canal de envio (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_canal_sim", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1500 },
})

Record({
    $id: Now.ID["modulo_4_consentimento"],
    table: 'sys_app_module',
    data: { title: "Consentimento por canal", application: menu, link_type: 'LIST', name: "x_2326104_cob_consentimento", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1600 },
})

Record({
    $id: Now.ID["modulo_4_regularizacao"],
    table: 'sys_app_module',
    data: { title: "Regularização", application: menu, link_type: 'LIST', name: "x_2326104_cob_regularizacao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1700 },
})

Record({
    $id: Now.ID["modulo_5_caso"],
    table: 'sys_app_module',
    data: { title: "Caso de cobrança qualificada", application: menu, link_type: 'LIST', name: "x_2326104_cob_caso", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1800 },
})

Record({
    $id: Now.ID["modulo_5_interacao"],
    table: 'sys_app_module',
    data: { title: "Interação", application: menu, link_type: 'LIST', name: "x_2326104_cob_interacao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 1900 },
})

Record({
    $id: Now.ID["modulo_6_meta"],
    table: 'sys_app_module',
    data: { title: "Meta de KPI", application: menu, link_type: 'LIST', name: "x_2326104_cob_meta", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 2000 },
})

Record({
    $id: Now.ID["modulo_7_exportacao"],
    table: 'sys_app_module',
    data: { title: "Exportação", application: menu, link_type: 'LIST', name: "x_2326104_cob_exportacao", roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"], active: true, order: 2100 },
})
