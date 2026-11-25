// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DecimalColumn, GenericColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_contribuinte = Table({
    name: "x_2326104_cob_contribuinte",
    label: "Contribuinte",
    display: "nome",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        nome: StringColumn({ label: "Nome", mandatory: true, maxLength: 120 }),
        tipo_pessoa: ChoiceColumn({ label: "Tipo de pessoa", mandatory: true, choices: {
            "pf": { label: "Pessoa física", sequence: 0 },
            "pj": { label: "Pessoa jurídica", sequence: 1 },
        }, dropdown: 'dropdown_with_none' }),
        cpf: StringColumn({ label: "CPF", maxLength: 14 }),
        cnpj: StringColumn({ label: "CNPJ", maxLength: 18 }),
        email: StringColumn({ label: "E-mail", maxLength: 100 }),
        telefone: StringColumn({ label: "Telefone", maxLength: 20 }),
        municipio: StringColumn({ label: "Município", maxLength: 80 }),
        atendente: ReferenceColumn({ label: "Atendente vinculado", referenceTable: "sys_user" }),
        segmento: ChoiceColumn({ label: "Segmento", choices: {
            "nao_avaliado": { label: "Não avaliado", sequence: 0 },
            "massificada": { label: "Massificada", sequence: 1 },
            "qualificada": { label: "Qualificada", sequence: 2 },
            "controle": { label: "Grupo de controle", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        score: DecimalColumn({ label: "Score de liquidez" }),
        sem_score: BooleanColumn({ label: "Sem score" }),
        valor_em_aberto: GenericColumn({ columnType: "currency", label: "Valor em aberto (R$)" }),
        situacao: ChoiceColumn({ label: "Situação", choices: {
            "em_cobranca": { label: "Em cobrança", sequence: 0 },
            "parcelado": { label: "Em parcelamento", sequence: 1 },
            "regularizado": { label: "Regularizado", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        ficticio: BooleanColumn({ label: "Fictício", mandatory: true }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
