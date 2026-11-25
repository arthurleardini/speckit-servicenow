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
    $id: Now.ID["modulo_mod_ux_lista"],
    table: 'sys_app_module',
    data: { title: "Minha lista", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.atendente"], active: true, order: 100 },
})

Record({
    $id: Now.ID["modulo_mod_ux_lista_minha_lista"],
    table: 'sys_app_module',
    data: { title: "Minha lista", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.atendente"], active: true, name: "x_2326104_cob_contato", filter: "atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade", order: 200 },
})

Record({
    $id: Now.ID["modulo_mod_ux_lista_meus_contribuintes"],
    table: 'sys_app_module',
    data: { title: "Meus contribuintes", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.atendente"], active: true, name: "x_2326104_cob_contribuinte", filter: "atendente=javascript:gs.getUserID()^ORDERBYnome", order: 300 },
})

Record({
    $id: Now.ID["modulo_mod_ux_lista_meus_indicadores"],
    table: 'sys_app_module',
    data: { title: "Meus indicadores", application: menu, link_type: 'REPORT', roles: ["x_2326104_cob.atendente"], active: true, report: Now.ref('sys_report', "TEL-031_report"), order: 400 },
})

Record({
    $id: Now.ID["modulo_mod_ux_equipe"],
    table: 'sys_app_module',
    data: { title: "Equipe", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.coordenador","x_2326104_cob.admin"], active: true, order: 500 },
})

Record({
    $id: Now.ID["modulo_mod_ux_equipe_lista_da_equipe"],
    table: 'sys_app_module',
    data: { title: "Lista da equipe", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador","x_2326104_cob.admin"], active: true, name: "x_2326104_cob_contato", filter: "status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em", order: 600 },
})

Record({
    $id: Now.ID["modulo_mod_ux_casos"],
    table: 'sys_app_module',
    data: { title: "Casos qualificados", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.coordenador"], active: true, order: 1000 },
})

Record({
    $id: Now.ID["modulo_mod_ux_casos_casos_qualificados"],
    table: 'sys_app_module',
    data: { title: "Casos qualificados", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_caso", filter: "estagio!=encerrado^ORDERBYetapa_ordem^ORDERBYDESCprioridade", view_name: "x_2326104_cob_tel_023", order: 1100 },
})

Record({
    $id: Now.ID["modulo_mod_ux_ciclo"],
    table: 'sys_app_module',
    data: { title: "Ciclo e carteira", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.coordenador"], active: true, order: 2000 },
})

Record({
    $id: Now.ID["modulo_mod_ux_ciclo_ciclo_do_mes"],
    table: 'sys_app_module',
    data: { title: "Ciclo do mês", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_ciclo", filter: "estado!=encerrado^ORDERBYDESCreferencia", view_name: "x_2326104_cob_tel_036", order: 2100 },
})

Record({
    $id: Now.ID["modulo_mod_ux_ciclo_carteira"],
    table: 'sys_app_module',
    data: { title: "Carteira", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_contribuinte", filter: "ORDERBYDESCvalor_em_aberto", order: 2200 },
})

Record({
    $id: Now.ID["modulo_mod_ux_reguas"],
    table: 'sys_app_module',
    data: { title: "Réguas", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.coordenador"], active: true, order: 3000 },
})

Record({
    $id: Now.ID["modulo_mod_ux_reguas_reguas"],
    table: 'sys_app_module',
    data: { title: "Réguas", application: menu, link_type: 'LIST', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_regua", order: 3100 },
})

Record({
    $id: Now.ID["modulo_mod_ux_reguas_inscricoes"],
    table: 'sys_app_module',
    data: { title: "Inscrições", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_regua_inscricao", filter: "statusINativa,erro^ORDERBYDESCiniciada_em", order: 3200 },
})

Record({
    $id: Now.ID["modulo_mod_ux_reguas_disparos_com_falha"],
    table: 'sys_app_module',
    data: { title: "Disparos com falha", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_comunicacao", filter: "status=falha^ORDERBYDESCenviada_em", order: 3300 },
})

Record({
    $id: Now.ID["modulo_mod_ux_analytics"],
    table: 'sys_app_module',
    data: { title: "Analytics", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.coordenador"], active: true, order: 4000 },
})

Record({
    $id: Now.ID["modulo_mod_ux_analytics_funil_do_credito"],
    table: 'sys_app_module',
    data: { title: "Funil do crédito", application: menu, link_type: 'REPORT', roles: ["x_2326104_cob.coordenador"], active: true, report: Now.ref('sys_report', "TEL-026_report"), order: 4100 },
})

Record({
    $id: Now.ID["modulo_mod_ux_analytics_regularizacoes_por_tributo"],
    table: 'sys_app_module',
    data: { title: "Regularizações por tributo", application: menu, link_type: 'REPORT', roles: ["x_2326104_cob.coordenador"], active: true, report: Now.ref('sys_report', "TEL-027_report"), order: 4200 },
})

Record({
    $id: Now.ID["modulo_mod_ux_analytics_regularizacoes_por_origem_e_canal"],
    table: 'sys_app_module',
    data: { title: "Regularizações por origem e canal", application: menu, link_type: 'REPORT', roles: ["x_2326104_cob.coordenador"], active: true, report: Now.ref('sys_report', "TEL-028_report"), order: 4300 },
})

Record({
    $id: Now.ID["modulo_mod_ux_analytics_efeito_incremental_por_ciclo"],
    table: 'sys_app_module',
    data: { title: "Efeito incremental por ciclo", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_ciclo", filter: "estado=encerrado^ORDERBYDESCreferencia", view_name: "x_2326104_cob_tel_029", order: 4400 },
})

Record({
    $id: Now.ID["modulo_mod_ux_analytics_parcelamentos_em_risco"],
    table: 'sys_app_module',
    data: { title: "Parcelamentos em risco", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_parcelamento", filter: "status=em_risco^ORDERBYDESCvalor_total", order: 4500 },
})

Record({
    $id: Now.ID["modulo_mod_ux_config"],
    table: 'sys_app_module',
    data: { title: "Configurações", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.coordenador","x_2326104_cob.admin"], active: true, order: 5000 },
})

Record({
    $id: Now.ID["modulo_mod_ux_config_criterios"],
    table: 'sys_app_module',
    data: { title: "Critérios", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_criterio", filter: "estado=publicada^ORDERBYDESCpublicada_em", order: 5100 },
})

Record({
    $id: Now.ID["modulo_mod_ux_config_metas"],
    table: 'sys_app_module',
    data: { title: "Metas", application: menu, link_type: 'LIST', roles: ["x_2326104_cob.coordenador"], active: true, name: "x_2326104_cob_meta", order: 5200 },
})

Record({
    $id: Now.ID["modulo_mod_ux_config_integracoes"],
    table: 'sys_app_module',
    data: { title: "Integrações", application: menu, link_type: 'FILTER', roles: ["x_2326104_cob.admin"], active: true, name: "x_2326104_cob_sincronizacao", filter: "ORDERBYDESCinicio", order: 5300 },
})

Record({
    $id: Now.ID["modulo_administracao"],
    table: 'sys_app_module',
    data: { title: "Administração", application: menu, link_type: 'SEPARATOR', roles: ["x_2326104_cob.admin"], active: true, order: 5400 },
})

Record({
    $id: Now.ID["modulo_administracao_contribuinte"],
    table: 'sys_app_module',
    data: { title: "Contribuinte", application: menu, link_type: 'LIST', name: "x_2326104_cob_contribuinte", roles: ["x_2326104_cob.admin"], active: true, order: 5500 },
})

Record({
    $id: Now.ID["modulo_administracao_debito"],
    table: 'sys_app_module',
    data: { title: "Débito", application: menu, link_type: 'LIST', name: "x_2326104_cob_debito", roles: ["x_2326104_cob.admin"], active: true, order: 5600 },
})

Record({
    $id: Now.ID["modulo_administracao_parcelamento"],
    table: 'sys_app_module',
    data: { title: "Parcelamento", application: menu, link_type: 'LIST', name: "x_2326104_cob_parcelamento", roles: ["x_2326104_cob.admin"], active: true, order: 5700 },
})

Record({
    $id: Now.ID["modulo_administracao_sincronizacao"],
    table: 'sys_app_module',
    data: { title: "Execução de sincronização", application: menu, link_type: 'LIST', name: "x_2326104_cob_sincronizacao", roles: ["x_2326104_cob.admin"], active: true, order: 5800 },
})

Record({
    $id: Now.ID["modulo_administracao_rejeicao"],
    table: 'sys_app_module',
    data: { title: "Rejeição de registro", application: menu, link_type: 'LIST', name: "x_2326104_cob_rejeicao", roles: ["x_2326104_cob.admin"], active: true, order: 5900 },
})

Record({
    $id: Now.ID["modulo_administracao_debito_stg"],
    table: 'sys_app_module',
    data: { title: "Staging de fontes (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_debito_stg", roles: ["x_2326104_cob.admin"], active: true, order: 6000 },
})

Record({
    $id: Now.ID["modulo_administracao_criterio"],
    table: 'sys_app_module',
    data: { title: "Critério de qualificação", application: menu, link_type: 'LIST', name: "x_2326104_cob_criterio", roles: ["x_2326104_cob.admin"], active: true, order: 6100 },
})

Record({
    $id: Now.ID["modulo_administracao_ciclo"],
    table: 'sys_app_module',
    data: { title: "Ciclo de qualificação", application: menu, link_type: 'LIST', name: "x_2326104_cob_ciclo", roles: ["x_2326104_cob.admin"], active: true, order: 6200 },
})

Record({
    $id: Now.ID["modulo_administracao_segmentacao"],
    table: 'sys_app_module',
    data: { title: "Carteira segmentada", application: menu, link_type: 'LIST', name: "x_2326104_cob_segmentacao", roles: ["x_2326104_cob.admin"], active: true, order: 6300 },
})

Record({
    $id: Now.ID["modulo_administracao_score_sim"],
    table: 'sys_app_module',
    data: { title: "Score de liquidez (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_score_sim", roles: ["x_2326104_cob.admin"], active: true, order: 6400 },
})

Record({
    $id: Now.ID["modulo_administracao_regua"],
    table: 'sys_app_module',
    data: { title: "Régua de cobrança", application: menu, link_type: 'LIST', name: "x_2326104_cob_regua", roles: ["x_2326104_cob.admin"], active: true, order: 6500 },
})

Record({
    $id: Now.ID["modulo_administracao_regua_etapa"],
    table: 'sys_app_module',
    data: { title: "Etapa da régua", application: menu, link_type: 'LIST', name: "x_2326104_cob_regua_etapa", roles: ["x_2326104_cob.admin"], active: true, order: 6600 },
})

Record({
    $id: Now.ID["modulo_administracao_regua_inscricao"],
    table: 'sys_app_module',
    data: { title: "Inscrição na régua", application: menu, link_type: 'LIST', name: "x_2326104_cob_regua_inscricao", roles: ["x_2326104_cob.admin"], active: true, order: 6700 },
})

Record({
    $id: Now.ID["modulo_administracao_comunicacao"],
    table: 'sys_app_module',
    data: { title: "Comunicação", application: menu, link_type: 'LIST', name: "x_2326104_cob_comunicacao", roles: ["x_2326104_cob.admin"], active: true, order: 6800 },
})

Record({
    $id: Now.ID["modulo_administracao_envio_sim"],
    table: 'sys_app_module',
    data: { title: "Retorno de envio (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_envio_sim", roles: ["x_2326104_cob.admin"], active: true, order: 6900 },
})

Record({
    $id: Now.ID["modulo_administracao_canal_sim"],
    table: 'sys_app_module',
    data: { title: "Canal de envio (Simulado)", application: menu, link_type: 'LIST', name: "x_2326104_cob_canal_sim", roles: ["x_2326104_cob.admin"], active: true, order: 7000 },
})

Record({
    $id: Now.ID["modulo_administracao_consentimento"],
    table: 'sys_app_module',
    data: { title: "Consentimento por canal", application: menu, link_type: 'LIST', name: "x_2326104_cob_consentimento", roles: ["x_2326104_cob.admin"], active: true, order: 7100 },
})

Record({
    $id: Now.ID["modulo_administracao_regularizacao"],
    table: 'sys_app_module',
    data: { title: "Regularização", application: menu, link_type: 'LIST', name: "x_2326104_cob_regularizacao", roles: ["x_2326104_cob.admin"], active: true, order: 7200 },
})

Record({
    $id: Now.ID["modulo_administracao_contato"],
    table: 'sys_app_module',
    data: { title: "Contato da lista", application: menu, link_type: 'LIST', name: "x_2326104_cob_contato", roles: ["x_2326104_cob.admin"], active: true, order: 7300 },
})

Record({
    $id: Now.ID["modulo_administracao_caso"],
    table: 'sys_app_module',
    data: { title: "Caso de cobrança qualificada", application: menu, link_type: 'LIST', name: "x_2326104_cob_caso", roles: ["x_2326104_cob.admin"], active: true, order: 7400 },
})

Record({
    $id: Now.ID["modulo_administracao_interacao"],
    table: 'sys_app_module',
    data: { title: "Interação", application: menu, link_type: 'LIST', name: "x_2326104_cob_interacao", roles: ["x_2326104_cob.admin"], active: true, order: 7500 },
})

Record({
    $id: Now.ID["modulo_administracao_meta"],
    table: 'sys_app_module',
    data: { title: "Meta de KPI", application: menu, link_type: 'LIST', name: "x_2326104_cob_meta", roles: ["x_2326104_cob.admin"], active: true, order: 7600 },
})

Record({
    $id: Now.ID["modulo_administracao_exportacao"],
    table: 'sys_app_module',
    data: { title: "Exportação", application: menu, link_type: 'LIST', name: "x_2326104_cob_exportacao", roles: ["x_2326104_cob.admin"], active: true, order: 7700 },
})
