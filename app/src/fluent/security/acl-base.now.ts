// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

import { role_coordenador, role_atendente, role_admin } from './roles.now'

Acl({
    $id: Now.ID["acl_contribuinte_read"],
    type: 'record',
    table: "x_2326104_cob_contribuinte",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_contribuinte_read_campos"],
    type: 'record',
    table: "x_2326104_cob_contribuinte",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_debito_read"],
    type: 'record',
    table: "x_2326104_cob_debito",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_debito_read_campos"],
    type: 'record',
    table: "x_2326104_cob_debito",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_parcelamento_read"],
    type: 'record',
    table: "x_2326104_cob_parcelamento",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_parcelamento_read_campos"],
    type: 'record',
    table: "x_2326104_cob_parcelamento",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_sincronizacao_read"],
    type: 'record',
    table: "x_2326104_cob_sincronizacao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_sincronizacao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_sincronizacao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_rejeicao_read"],
    type: 'record',
    table: "x_2326104_cob_rejeicao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_rejeicao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_rejeicao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_debito_stg_read"],
    type: 'record',
    table: "x_2326104_cob_debito_stg",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_debito_stg_read_campos"],
    type: 'record',
    table: "x_2326104_cob_debito_stg",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_criterio_read"],
    type: 'record',
    table: "x_2326104_cob_criterio",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_criterio_read_campos"],
    type: 'record',
    table: "x_2326104_cob_criterio",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_ciclo_read"],
    type: 'record',
    table: "x_2326104_cob_ciclo",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_ciclo_read_campos"],
    type: 'record',
    table: "x_2326104_cob_ciclo",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_segmentacao_read"],
    type: 'record',
    table: "x_2326104_cob_segmentacao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_segmentacao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_segmentacao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_score_sim_read"],
    type: 'record',
    table: "x_2326104_cob_score_sim",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_score_sim_read_campos"],
    type: 'record',
    table: "x_2326104_cob_score_sim",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_regua_read"],
    type: 'record',
    table: "x_2326104_cob_regua",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_regua_read_campos"],
    type: 'record',
    table: "x_2326104_cob_regua",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_regua_etapa_read"],
    type: 'record',
    table: "x_2326104_cob_regua_etapa",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_regua_etapa_read_campos"],
    type: 'record',
    table: "x_2326104_cob_regua_etapa",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_comunicacao_read"],
    type: 'record',
    table: "x_2326104_cob_comunicacao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_comunicacao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_comunicacao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_envio_sim_read"],
    type: 'record',
    table: "x_2326104_cob_envio_sim",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_envio_sim_read_campos"],
    type: 'record',
    table: "x_2326104_cob_envio_sim",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_canal_sim_read"],
    type: 'record',
    table: "x_2326104_cob_canal_sim",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_canal_sim_read_campos"],
    type: 'record',
    table: "x_2326104_cob_canal_sim",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_consentimento_read"],
    type: 'record',
    table: "x_2326104_cob_consentimento",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_consentimento_read_campos"],
    type: 'record',
    table: "x_2326104_cob_consentimento",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_regularizacao_read"],
    type: 'record',
    table: "x_2326104_cob_regularizacao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_regularizacao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_regularizacao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_contato_read"],
    type: 'record',
    table: "x_2326104_cob_contato",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_contato_read_campos"],
    type: 'record',
    table: "x_2326104_cob_contato",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_caso_read"],
    type: 'record',
    table: "x_2326104_cob_caso",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_caso_read_campos"],
    type: 'record',
    table: "x_2326104_cob_caso",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_interacao_read"],
    type: 'record',
    table: "x_2326104_cob_interacao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_interacao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_interacao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_meta_read"],
    type: 'record',
    table: "x_2326104_cob_meta",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_meta_read_campos"],
    type: 'record',
    table: "x_2326104_cob_meta",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_exportacao_read"],
    type: 'record',
    table: "x_2326104_cob_exportacao",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})

Acl({
    $id: Now.ID["acl_exportacao_read_campos"],
    type: 'record',
    table: "x_2326104_cob_exportacao",
    field: "*",
    operation: 'read',
    roles: [role_coordenador, role_atendente, role_admin],
})
