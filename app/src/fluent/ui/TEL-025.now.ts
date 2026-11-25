// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_interacao",
    view: default_view,
    sections: [
        {
            caption: "Registro de interação",
            content: [
                { layout: 'two-column', leftElements: [{ field: "caso", type: 'table_field' }, { field: "contato", type: 'table_field' }, { field: "atendente", type: 'table_field' }, { field: "tipo", type: 'table_field' }], rightElements: [{ field: "resultado", type: 'table_field' }, { field: "ocorrida_em", type: 'table_field' }, { field: "retorno_em", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "descricao", type: 'table_field' }, { field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
