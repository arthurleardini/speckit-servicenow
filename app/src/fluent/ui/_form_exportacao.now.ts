// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_exportacao",
    view: default_view,
    sections: [
        {
            caption: "Exportação",
            content: [
                { layout: 'two-column', leftElements: [{ field: "usuario", type: 'table_field' }, { field: "tabela", type: 'table_field' }, { field: "formato", type: 'table_field' }], rightElements: [{ field: "registros", type: 'table_field' }, { field: "exportado_em", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "filtro", type: 'table_field' }] },
            ],
        },
    ],
})
