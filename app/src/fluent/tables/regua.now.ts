// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, GenericColumn, IntegerColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_regua = Table({
    name: "x_2326104_cob_regua",
    label: "Régua de cobrança",
    display: "nome",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        nome: StringColumn({ label: "Nome", mandatory: true, maxLength: 100 }),
        carteira: ChoiceColumn({ label: "Carteira", mandatory: true, choices: {
            "parcelamentos": { label: "Parcelamentos", sequence: 0 },
            "ipva": { label: "IPVA", sequence: 1 },
            "itcd": { label: "ITCD", sequence: 2 },
            "icms_normal": { label: "ICMS Normal", sequence: 3 },
            "icms_st": { label: "ICMS ST", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        ativa: BooleanColumn({ label: "Ativa" }),
        janela_atribuicao_dias: IntegerColumn({ label: "Janela de atribuição (dias)" }),
        ordem_fallback: StringColumn({ label: "Ordem de fallback de canal", maxLength: 60 }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
