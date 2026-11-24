// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_parcelamento",
    view: default_view,
    sections: [
        {
            caption: "Parcelamento",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "valor_total", type: 'table_field' }, { field: "parcelas_total", type: 'table_field' }], rightElements: [{ field: "parcelas_atraso", type: 'table_field' }, { field: "status", type: 'table_field' }, { field: "alerta_risco", type: 'table_field' }, { field: "atualizado_em", type: 'table_field' }] },
            ],
        },
    ],
})
