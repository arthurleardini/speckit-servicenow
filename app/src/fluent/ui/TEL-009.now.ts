// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

import { processFlow_ciclo } from './_processflow_ciclo.now'

Form({
    table: "x_2326104_cob_ciclo",
    view: default_view,
    sections: [
        {
            caption: "Ciclo do mês",
            content: [
                { layout: 'one-column', elements: [{ type: 'formatter', formatterRef: processFlow_ciclo, formatterName: 'process_flow.xml' }] },
                { layout: 'two-column', leftElements: [{ field: "nome", type: 'table_field' }, { field: "referencia", type: 'table_field' }, { field: "criterio", type: 'table_field' }, { field: "estado", type: 'table_field' }, { field: "qtd_elegiveis", type: 'table_field' }, { field: "semente_sorteio", type: 'table_field' }, { field: "qtd_massificada", type: 'table_field' }, { field: "qtd_qualificada", type: 'table_field' }, { field: "qtd_controle", type: 'table_field' }], rightElements: [{ field: "qtd_sem_score", type: 'table_field' }, { field: "taxa_cobrada", type: 'table_field' }, { field: "taxa_controle", type: 'table_field' }, { field: "efeito_incremental", type: 'table_field' }, { field: "publicado_em", type: 'table_field' }, { field: "publicado_por", type: 'table_field' }, { field: "distribuido_em", type: 'table_field' }, { field: "qtd_contatos", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
