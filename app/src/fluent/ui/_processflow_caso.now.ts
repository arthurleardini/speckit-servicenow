// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const processFlow_caso = Record({
    $id: Now.ID["processflow_caso_formatter"],
    table: 'sys_ui_formatter',
    data: { name: 'Process Flow', type: 'formatter', formatter: 'process_flow.xml', table: "x_2326104_cob_caso", active: true },
})

Record({
    $id: Now.ID["processflow_caso_em_selecao"],
    table: 'sys_process_flow',
    data: { name: "Caso de cobrança qualificada - Em seleção", label: "Em seleção", table: "x_2326104_cob_caso", condition: "estagio=em_selecao", order: "100", active: true },
})

Record({
    $id: Now.ID["processflow_caso_selecionado"],
    table: 'sys_process_flow',
    data: { name: "Caso de cobrança qualificada - Selecionado", label: "Selecionado", table: "x_2326104_cob_caso", condition: "estagio=selecionado", order: "200", active: true },
})

Record({
    $id: Now.ID["processflow_caso_dossie"],
    table: 'sys_process_flow',
    data: { name: "Caso de cobrança qualificada - Dossiê", label: "Dossiê", table: "x_2326104_cob_caso", condition: "estagio=dossie_gerado", order: "300", active: true },
})

Record({
    $id: Now.ID["processflow_caso_conducao"],
    table: 'sys_process_flow',
    data: { name: "Caso de cobrança qualificada - Condução", label: "Condução", table: "x_2326104_cob_caso", condition: "estagio=conducao", order: "400", active: true },
})

Record({
    $id: Now.ID["processflow_caso_encerrado"],
    table: 'sys_process_flow',
    data: { name: "Caso de cobrança qualificada - Encerrado", label: "Encerrado", table: "x_2326104_cob_caso", condition: "estagio=encerrado", order: "500", active: true },
})
