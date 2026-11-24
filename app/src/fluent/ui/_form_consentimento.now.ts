// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_consentimento",
    view: default_view,
    sections: [
        {
            caption: "Consentimento por canal",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "canal", type: 'table_field' }, { field: "situacao", type: 'table_field' }], rightElements: [{ field: "registrado_em", type: 'table_field' }, { field: "origem", type: 'table_field' }] },
            ],
        },
    ],
})
