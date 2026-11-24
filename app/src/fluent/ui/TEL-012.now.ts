// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_score_sim",
    view: default_view,
    columns: ["contribuinte","tributo","score","versao_modelo","ingerido_em","status"],
})
