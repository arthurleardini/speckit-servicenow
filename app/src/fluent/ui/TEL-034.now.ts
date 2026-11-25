// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_contato",
    view: default_view,
    columns: ["contribuinte","proxima_acao","contribuinte.telefone","valor_em_aberto","proxima_acao_em","prioridade"],
})
