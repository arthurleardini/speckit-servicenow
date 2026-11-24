// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { List, default_view } from '@servicenow/sdk/core'

List({
    table: "x_2326104_cob_canal_sim",
    view: default_view,
    columns: ["canal","contratado","forcar_falha","exige_opt_in"],
})
