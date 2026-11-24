// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_contribuinte",
    view: default_view,
    sections: [
        {
            caption: "Visão única do contribuinte",
            content: [
                { layout: 'two-column', leftElements: [{ field: "tipo_pessoa", type: 'table_field' }, { field: "cpf", type: 'table_field' }, { field: "cnpj", type: 'table_field' }, { field: "municipio", type: 'table_field' }, { field: "email", type: 'table_field' }, { field: "telefone", type: 'table_field' }, { field: "atendente", type: 'table_field' }], rightElements: [{ field: "segmento", type: 'table_field' }, { field: "score", type: 'table_field' }, { field: "sem_score", type: 'table_field' }, { field: "valor_em_aberto", type: 'table_field' }, { field: "situacao", type: 'table_field' }, { field: "ficticio", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "nome", type: 'table_field' }, { field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
