// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_sincronizacao",
    view: default_view,
    sections: [
        {
            caption: "Execução de sincronização",
            content: [
                { layout: 'two-column', leftElements: [{ field: "fonte", type: 'table_field' }, { field: "inicio", type: 'table_field' }, { field: "fim", type: 'table_field' }], rightElements: [{ field: "status", type: 'table_field' }, { field: "volume", type: 'table_field' }, { field: "rejeitados", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "mensagem", type: 'table_field' }] },
            ],
        },
    ],
})
