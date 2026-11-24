// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_regua",
    view: default_view,
    sections: [
        {
            caption: "Editor de régua",
            content: [
                { layout: 'two-column', leftElements: [{ field: "nome", type: 'table_field' }, { field: "carteira", type: 'table_field' }, { field: "ativa", type: 'table_field' }], rightElements: [{ field: "janela_atribuicao_dias", type: 'table_field' }, { field: "ordem_fallback", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
