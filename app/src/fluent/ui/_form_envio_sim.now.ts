// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_envio_sim",
    view: default_view,
    sections: [
        {
            caption: "Retorno de envio (Simulado)",
            content: [
                { layout: 'two-column', leftElements: [{ field: "comunicacao", type: 'table_field' }, { field: "canal", type: 'table_field' }, { field: "status_retorno", type: 'table_field' }], rightElements: [{ field: "codigo_retorno", type: 'table_field' }, { field: "recebido_em", type: 'table_field' }, { field: "falhar", type: 'table_field' }] },
            ],
        },
    ],
})
