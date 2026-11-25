// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_regua_etapa",
    view: default_view,
    sections: [
        {
            caption: "Etapa da régua",
            content: [
                { layout: 'two-column', leftElements: [{ field: "regua", type: 'table_field' }, { field: "ordem", type: 'table_field' }, { field: "offset_dias", type: 'table_field' }], rightElements: [{ field: "canal", type: 'table_field' }, { field: "postura", type: 'table_field' }, { field: "acao_sem_resposta", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "template", type: 'table_field' }] },
            ],
        },
    ],
})
