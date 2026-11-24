// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_ciclo",
    view: default_view,
    sections: [
        {
            caption: "Ciclo de qualificação (prévia)",
            content: [
                { layout: 'two-column', leftElements: [{ field: "nome", type: 'table_field' }, { field: "referencia", type: 'table_field' }, { field: "criterio", type: 'table_field' }, { field: "estado", type: 'table_field' }, { field: "qtd_massificada", type: 'table_field' }, { field: "qtd_qualificada", type: 'table_field' }], rightElements: [{ field: "qtd_controle", type: 'table_field' }, { field: "qtd_sem_score", type: 'table_field' }, { field: "taxa_cobrada", type: 'table_field' }, { field: "taxa_controle", type: 'table_field' }, { field: "efeito_incremental", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
