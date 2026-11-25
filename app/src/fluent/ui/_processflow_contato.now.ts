// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const processFlow_contato = Record({
    $id: Now.ID["processflow_contato_formatter"],
    table: 'sys_ui_formatter',
    data: { name: 'Process Flow', type: 'formatter', formatter: 'process_flow.xml', table: "x_2326104_cob_contato", active: true },
})

Record({
    $id: Now.ID["processflow_contato_a_ligar"],
    table: 'sys_process_flow',
    data: { name: "Contato da lista - A ligar", label: "A ligar", table: "x_2326104_cob_contato", condition: "status=a_ligar", order: "100", active: true },
})

Record({
    $id: Now.ID["processflow_contato_ligado"],
    table: 'sys_process_flow',
    data: { name: "Contato da lista - Ligado", label: "Ligado", table: "x_2326104_cob_contato", condition: "status=ligado", order: "200", active: true },
})

Record({
    $id: Now.ID["processflow_contato_retornar"],
    table: 'sys_process_flow',
    data: { name: "Contato da lista - Retornar", label: "Retornar", table: "x_2326104_cob_contato", condition: "status=retornar", order: "300", active: true },
})

Record({
    $id: Now.ID["processflow_contato_encerrado"],
    table: 'sys_process_flow',
    data: { name: "Contato da lista - Encerrado", label: "Encerrado", table: "x_2326104_cob_contato", condition: "status=encerrado", order: "400", active: true },
})
