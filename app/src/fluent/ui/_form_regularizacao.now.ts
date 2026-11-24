// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_regularizacao",
    view: default_view,
    sections: [
        {
            caption: "Regularização",
            content: [
                { layout: 'two-column', leftElements: [{ field: "contribuinte", type: 'table_field' }, { field: "debito", type: 'table_field' }, { field: "ciclo", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "valor", type: 'table_field' }, { field: "data", type: 'table_field' }, { field: "origem", type: 'table_field' }], rightElements: [{ field: "canal", type: 'table_field' }, { field: "instrumento", type: 'table_field' }, { field: "grupo_controle", type: 'table_field' }, { field: "comunicacao", type: 'table_field' }, { field: "caso", type: 'table_field' }, { field: "atendente", type: 'table_field' }] },
            ],
        },
    ],
})
