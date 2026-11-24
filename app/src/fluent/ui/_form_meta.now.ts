// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_meta",
    view: default_view,
    sections: [
        {
            caption: "Meta de KPI",
            content: [
                { layout: 'two-column', leftElements: [{ field: "indicador", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "canal", type: 'table_field' }], rightElements: [{ field: "periodo", type: 'table_field' }, { field: "valor_meta", type: 'table_field' }] },
            ],
        },
    ],
})
