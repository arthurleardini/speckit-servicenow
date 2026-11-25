// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateColumn, GenericColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_debito_stg = Table({
    name: "x_2326104_cob_debito_stg",
    label: "Staging de fontes (Simulado)",
    display: "nome",
    allowWebServiceAccess: true,
    schema: {
        origem: ChoiceColumn({ label: "Origem", mandatory: true, choices: {
            "ccf": { label: "CCF", sequence: 0 },
            "mpi_bigdata": { label: "MPI/Big Data", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
            "sne": { label: "SNE", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        tipo_pessoa: ChoiceColumn({ label: "Tipo de pessoa", choices: {
            "pf": { label: "Pessoa física", sequence: 0 },
            "pj": { label: "Pessoa jurídica", sequence: 1 },
        }, dropdown: 'dropdown_with_none' }),
        cpf: StringColumn({ label: "CPF", maxLength: 14 }),
        cnpj: StringColumn({ label: "CNPJ", maxLength: 18 }),
        nome: StringColumn({ label: "Nome", maxLength: 120 }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "icms_normal": { label: "ICMS Normal", sequence: 0 },
            "icms_st": { label: "ICMS ST", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        valor: GenericColumn({ columnType: "currency", label: "Valor (R$)" }),
        vencimento: DateColumn({ label: "Vencimento" }),
        id_fonte: StringColumn({ label: "ID na fonte", maxLength: 40 }),
        processado: BooleanColumn({ label: "Processado" }),
        falha_simulada: BooleanColumn({ label: "Falha simulada" }),
        ficticio: BooleanColumn({ label: "Fictício", mandatory: true }),
        falhar: BooleanColumn({ label: "Simular falha" }),
    },
})
