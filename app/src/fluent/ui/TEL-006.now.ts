// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_debito_stg",
    view: default_view,
    columns: ["origem","tipo_pessoa","cpf","cnpj","nome","tributo","valor","processado","falha_simulada","ficticio"],
})
