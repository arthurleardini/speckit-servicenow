// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_parcelamento",
    view: default_view,
    columns: ["contribuinte","tributo","valor_total","parcelas_total","parcelas_atraso","status","alerta_risco"],
})
