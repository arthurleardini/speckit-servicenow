// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_canal_sim",
    view: default_view,
    sections: [
        {
            caption: "Canal de envio (Simulado)",
            content: [
                { layout: 'two-column', leftElements: [{ field: "canal", type: 'table_field' }, { field: "contratado", type: 'table_field' }, { field: "forcar_falha", type: 'table_field' }], rightElements: [{ field: "exige_opt_in", type: 'table_field' }, { field: "falhar", type: 'table_field' }] },
            ],
        },
    ],
})
