// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_score_sim",
    view: default_view,
    sections: [
        {
            caption: "Score de liquidez (Simulado)",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "score", type: 'table_field' }, { field: "versao_modelo", type: 'table_field' }], rightElements: [{ field: "ingerido_em", type: 'table_field' }, { field: "status", type: 'table_field' }, { field: "falhar", type: 'table_field' }] },
            ],
        },
    ],
})
