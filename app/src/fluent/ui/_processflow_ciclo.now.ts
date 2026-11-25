// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const processFlow_ciclo = Record({
    $id: Now.ID["processflow_ciclo_formatter"],
    table: 'sys_ui_formatter',
    data: { name: 'Process Flow', type: 'formatter', formatter: 'process_flow.xml', table: "x_2326104_cob_ciclo", active: true },
})

Record({
    $id: Now.ID["processflow_ciclo_previa"],
    table: 'sys_process_flow',
    data: { name: "Ciclo de qualificação - Prévia", label: "Prévia", table: "x_2326104_cob_ciclo", condition: "estado=previa", order: "100", active: true },
})

Record({
    $id: Now.ID["processflow_ciclo_publicado"],
    table: 'sys_process_flow',
    data: { name: "Ciclo de qualificação - Publicado", label: "Publicado", table: "x_2326104_cob_ciclo", condition: "estado=publicado^distribuido_emISEMPTY", order: "200", active: true },
})

Record({
    $id: Now.ID["processflow_ciclo_distribuido"],
    table: 'sys_process_flow',
    data: { name: "Ciclo de qualificação - Distribuído", label: "Distribuído", table: "x_2326104_cob_ciclo", condition: "estado=publicado^distribuido_emISNOTEMPTY", order: "300", active: true },
})

Record({
    $id: Now.ID["processflow_ciclo_encerrado"],
    table: 'sys_process_flow',
    data: { name: "Ciclo de qualificação - Encerrado", label: "Encerrado", table: "x_2326104_cob_ciclo", condition: "estado=encerrado", order: "400", active: true },
})
