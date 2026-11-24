// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_caso",
    view: default_view,
    columns: ["contribuinte","atendente","ciclo","estagio","prioridade","score","sem_score","valor_em_aberto"],
})
