// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Form, default_view } from '@servicenow/sdk/core'

Form({
    table: "x_2326104_cob_debito_stg",
    view: default_view,
    sections: [
        {
            caption: "Staging de fontes (Simulado)",
            content: [
                { layout: 'two-column', leftElements: [{ field: "origem", type: 'table_field' }, { field: "tipo_pessoa", type: 'table_field' }, { field: "cpf", type: 'table_field' }, { field: "cnpj", type: 'table_field' }, { field: "tributo", type: 'table_field' }, { field: "valor", type: 'table_field' }], rightElements: [{ field: "vencimento", type: 'table_field' }, { field: "id_fonte", type: 'table_field' }, { field: "processado", type: 'table_field' }, { field: "falha_simulada", type: 'table_field' }, { field: "ficticio", type: 'table_field' }, { field: "falhar", type: 'table_field' }] },
                { layout: 'one-column', elements: [{ field: "nome", type: 'table_field' }] },
            ],
        },
    ],
})
