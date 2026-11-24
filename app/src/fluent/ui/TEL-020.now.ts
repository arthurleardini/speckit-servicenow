// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_regularizacao",
    view: default_view,
    columns: ["contribuinte","tributo","valor","data","origem","canal","instrumento","grupo_controle","atendente"],
})
