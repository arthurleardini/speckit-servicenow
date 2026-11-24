// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_contribuinte",
    view: default_view,
    columns: ["nome","tipo_pessoa","cnpj","municipio","segmento","atendente","valor_em_aberto","situacao","ficticio"],
})
