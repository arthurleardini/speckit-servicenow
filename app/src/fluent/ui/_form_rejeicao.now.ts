// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_rejeicao",
    view: default_view,
    sections: [
        {
            caption: "Rejeição de registro",
            content: [
                { layout: 'two-column', leftElements: [{ field: "sincronizacao", type: 'table_field' }, { field: "fonte", type: 'table_field' }], rightElements: [{ field: "id_registro", type: 'table_field' }, { field: "motivo", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "detalhe", type: 'table_field' }] },
            ],
        },
    ],
})
