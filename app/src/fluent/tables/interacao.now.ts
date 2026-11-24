// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, GenericColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_interacao = Table({
    name: "x_2326104_cob_interacao",
    label: "Interação",
    display: "descricao",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        caso: ReferenceColumn({ label: "Caso", mandatory: true, referenceTable: "x_2326104_cob_caso" }),
        atendente: ReferenceColumn({ label: "Atendente", referenceTable: "sys_user" }),
        tipo: ChoiceColumn({ label: "Tipo", choices: {
            "telefone": { label: "Telefone", sequence: 0 },
            "email": { label: "E-mail", sequence: 1 },
            "presencial": { label: "Presencial", sequence: 2 },
            "dte": { label: "DT-e", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        resultado: ChoiceColumn({ label: "Resultado", choices: {
            "contato_efetivo": { label: "Contato efetivo", sequence: 0 },
            "sem_contato": { label: "Sem contato", sequence: 1 },
            "promessa_pagamento": { label: "Promessa de pagamento", sequence: 2 },
            "recusa": { label: "Recusa", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        descricao: StringColumn({ label: "Descrição", maxLength: 4000 }),
        ocorrida_em: DateTimeColumn({ label: "Ocorrida em" }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
