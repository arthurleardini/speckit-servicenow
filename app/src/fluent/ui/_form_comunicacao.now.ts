// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_comunicacao",
    view: default_view,
    sections: [
        {
            caption: "Comunicação",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "regua", type: 'table_field' }, { field: "etapa", type: 'table_field' }, { field: "ciclo", type: 'table_field' }, { field: "canal", type: 'table_field' }], rightElements: [{ field: "status", type: 'table_field' }, { field: "enviada_em", type: 'table_field' }, { field: "tentativas", type: 'table_field' }, { field: "inscricao", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "motivo", type: 'table_field' }] },
            ],
        },
    ],
})
