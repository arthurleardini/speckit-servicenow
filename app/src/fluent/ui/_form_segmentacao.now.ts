// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_segmentacao",
    view: default_view,
    sections: [
        {
            caption: "Carteira segmentada",
            content: [
                { layout: 'two-column', leftElements: [{ field: "ciclo", type: 'table_field' }, { field: "contribuinte", type: 'table_field' }, { field: "criterio", type: 'table_field' }, { field: "segmento", type: 'table_field' }], rightElements: [{ field: "valor_em_aberto", type: 'table_field' }, { field: "score_usado", type: 'table_field' }, { field: "sem_score", type: 'table_field' }, { field: "estagio_funil", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "motivo", type: 'table_field' }] },
            ],
        },
    ],
})
