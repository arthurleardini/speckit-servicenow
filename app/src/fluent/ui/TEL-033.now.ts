// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_exportacao",
    view: default_view,
    columns: ["usuario","tabela","formato","filtro","registros","exportado_em"],
})
