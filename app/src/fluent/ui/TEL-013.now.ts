// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_regua",
    view: default_view,
    columns: ["nome","carteira","ativa","janela_atribuicao_dias","ordem_fallback"],
})
