// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

import { processFlow_contato } from './_processflow_contato.now'

Form({
    table: "x_2326104_cob_contato",
    view: default_view,
    sections: [
        {
            caption: "Contato da lista",
            content: [
                { layout: 'one-column', elements: [{ type: 'formatter', formatterRef: processFlow_contato, formatterName: 'process_flow.xml' }] },
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "atendente", type: 'table_field' }, { field: "ciclo", type: 'table_field' }, { field: "status", type: 'table_field' }, { field: "proxima_acao_em", type: 'table_field' }, { field: "ultimo_resultado", type: 'table_field' }], rightElements: [{ field: "tentativas", type: 'table_field' }, { field: "prioridade", type: 'table_field' }, { field: "valor_em_aberto", type: 'table_field' }, { field: "motivo_encerramento", type: 'table_field' }, { field: "resultado_ligacao", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
