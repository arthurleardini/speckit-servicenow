// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, Record } from '@servicenow/sdk/core'

const view_TEL_036 = Record({
    $id: Now.ID["TEL-036_view"],
    table: 'sys_ui_view',
    data: { name: "x_2326104_cob_tel_036", title: "Ciclo do mês" },
})

List({
    table: "x_2326104_cob_ciclo",
    view: view_TEL_036,
    columns: ["nome","proxima_acao","referencia","estado","qtd_massificada","qtd_contatos"],
})
