// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_regua_inscricao",
    view: default_view,
    sections: [
        {
            caption: "Inscrição na régua",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "regua", type: 'table_field' }, { field: "status", type: 'table_field' }, { field: "etapa_atual", type: 'table_field' }, { field: "proxima_etapa_em", type: 'table_field' }, { field: "motivo_encerramento", type: 'table_field' }], rightElements: [{ field: "iniciada_em", type: 'table_field' }, { field: "encerrada_em", type: 'table_field' }, { field: "ciclo", type: 'table_field' }, { field: "parcelamento", type: 'table_field' }, { field: "contato", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "detalhe", type: 'table_field' }, { field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
