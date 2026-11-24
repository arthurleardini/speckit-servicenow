// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_criterio",
    view: default_view,
    columns: ["nome","versao","estado","tributo","valor_minimo","atraso_minimo_dias","publicada_em"],
})
