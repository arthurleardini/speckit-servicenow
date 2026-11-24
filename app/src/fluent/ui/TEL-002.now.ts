// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_rejeicao",
    view: default_view,
    columns: ["sincronizacao","fonte","id_registro","motivo","detalhe"],
})
