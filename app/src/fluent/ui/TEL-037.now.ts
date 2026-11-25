// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_regua_inscricao",
    view: default_view,
    columns: ["contribuinte","regua","status","etapa_atual","proxima_etapa_em","motivo_encerramento"],
})
