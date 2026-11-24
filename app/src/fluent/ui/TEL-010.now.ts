// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_segmentacao",
    view: default_view,
    columns: ["ciclo","contribuinte","criterio","segmento","valor_em_aberto","score_usado","sem_score","motivo"],
})
