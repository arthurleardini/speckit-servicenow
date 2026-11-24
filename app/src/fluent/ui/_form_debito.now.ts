// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_debito",
    view: default_view,
    sections: [
        {
            caption: "Débito",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "origem", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "valor", type: 'table_field' }, { field: "vencimento", type: 'table_field' }], rightElements: [{ field: "dias_atraso", type: 'table_field' }, { field: "status", type: 'table_field' }, { field: "id_fonte", type: 'table_field' }, { field: "sobreposto", type: 'table_field' }, { field: "atualizado_em", type: 'table_field' }] },
            ],
        },
    ],
})
