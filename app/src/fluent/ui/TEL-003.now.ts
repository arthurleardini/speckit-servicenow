// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_debito",
    view: default_view,
    columns: ["contribuinte","origem","tributo","valor","vencimento","dias_atraso","status","sobreposto","atualizado_em"],
})
