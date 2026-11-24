// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_caso",
    view: default_view,
    sections: [
        {
            caption: "Dossiê do caso",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "atendente", type: 'table_field' }, { field: "ciclo", type: 'table_field' }, { field: "estagio", type: 'table_field' }, { field: "prioridade", type: 'table_field' }, { field: "score", type: 'table_field' }], rightElements: [{ field: "sem_score", type: 'table_field' }, { field: "valor_em_aberto", type: 'table_field' }, { field: "sinal_coercitivo", type: 'table_field' }, { field: "motivo_encerramento", type: 'table_field' }, { field: "encerrado_em", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "sinal_coercitivo_desc", type: 'table_field' }, { field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
