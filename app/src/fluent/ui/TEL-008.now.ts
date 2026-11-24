// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, Formatter, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_criterio",
    view: default_view,
    sections: [
        {
            caption: "Versão do critério de qualificação",
            content: [
                { layout: 'two-column', leftElements: [{ field: "nome", type: 'table_field' }, { field: "versao", type: 'table_field' }, { field: "estado", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "valor_minimo", type: 'table_field' }, { field: "atraso_minimo_dias", type: 'table_field' }, { field: "instrumento", type: 'table_field' }, { field: "excluir_contumaz", type: 'table_field' }], rightElements: [{ field: "usar_score", type: 'table_field' }, { field: "threshold_score", type: 'table_field' }, { field: "pct_grupo_controle", type: 'table_field' }, { field: "desempate", type: 'table_field' }, { field: "versao_anterior", type: 'table_field' }, { field: "publicada_em", type: 'table_field' }, { field: "publicada_por", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "comentarios", type: 'table_field' }] },
            ],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})
