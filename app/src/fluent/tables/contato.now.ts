// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_contato = Table({
    name: "x_2326104_cob_contato",
    label: [{ label: "Contato da lista", plural: "Contatos da lista", language: 'en' }],
    display: "contribuinte",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        atendente: ReferenceColumn({ label: "Atendente", referenceTable: "sys_user" }),
        ciclo: ReferenceColumn({ label: "Ciclo", referenceTable: "x_2326104_cob_ciclo" }),
        status: ChoiceColumn({ label: "Status", choices: {
            "a_ligar": { label: "A ligar", sequence: 0 },
            "ligado": { label: "Ligado", sequence: 1 },
            "retornar": { label: "Retornar", sequence: 2 },
            "encerrado": { label: "Encerrado", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        proxima_acao_em: DateColumn({ label: "Próxima ação em" }),
        resultado_ligacao: ChoiceColumn({ label: "Resultado desta ligação", choices: {
            "contato_efetivo": { label: "Contato efetivo", sequence: 0 },
            "sem_contato": { label: "Sem contato", sequence: 1 },
            "promessa_pagamento": { label: "Promessa de pagamento", sequence: 2 },
            "recusa": { label: "Recusa", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        ultimo_resultado: ChoiceColumn({ label: "Último resultado", choices: {
            "contato_efetivo": { label: "Contato efetivo", sequence: 0 },
            "sem_contato": { label: "Sem contato", sequence: 1 },
            "promessa_pagamento": { label: "Promessa de pagamento", sequence: 2 },
            "recusa": { label: "Recusa", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        tentativas: IntegerColumn({ label: "Tentativas" }),
        prioridade: IntegerColumn({ label: "Prioridade" }),
        valor_em_aberto: GenericColumn({ columnType: "currency", label: "Valor em aberto (R$)" }),
        motivo_encerramento: ChoiceColumn({ label: "Motivo de encerramento", choices: {
            "regularizado": { label: "Regularizado", sequence: 0 },
            "contato_realizado": { label: "Contato realizado", sequence: 1 },
            "sem_contato": { label: "Sem contato", sequence: 2 },
            "recusa": { label: "Recusa", sequence: 3 },
            "outro": { label: "Outro", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        proxima_acao: StringColumn({ label: "O que fazer agora", maxLength: 100 }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
