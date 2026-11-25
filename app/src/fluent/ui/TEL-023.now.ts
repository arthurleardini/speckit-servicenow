// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, Record } from '@servicenow/sdk/core'

const view_TEL_023 = Record({
    $id: Now.ID["TEL-023_view"],
    table: 'sys_ui_view',
    data: { name: "x_2326104_cob_tel_023", title: "Casos qualificados" },
})

List({
    table: "x_2326104_cob_caso",
    view: view_TEL_023,
    columns: ["contribuinte","proxima_acao","estagio","prioridade","valor_em_aberto","sinal_coercitivo"],
})
