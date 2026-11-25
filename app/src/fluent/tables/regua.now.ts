// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_regua = Table({
    name: "x_2326104_cob_regua",
    label: [{ label: "Régua de cobrança", plural: "Réguas de cobrança", language: 'en' }],
    display: "nome",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        nome: StringColumn({ label: "Nome", mandatory: true, maxLength: 100 }),
        codigo: StringColumn({ label: "Código", mandatory: true, maxLength: 40 }),
        carteira: ChoiceColumn({ label: "Carteira", mandatory: true, choices: {
            "parcelamentos": { label: "Parcelamentos", sequence: 0 },
            "ipva": { label: "IPVA", sequence: 1 },
            "itcd": { label: "ITCD", sequence: 2 },
            "icms_normal": { label: "ICMS Normal", sequence: 3 },
            "icms_st": { label: "ICMS ST", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        ativa: BooleanColumn({ label: "Ativa" }),
        prazo_final_dias: IntegerColumn({ label: "Prazo de resposta depois da última etapa (dias)", mandatory: true }),
        janela_atribuicao_dias: IntegerColumn({ label: "Janela de atribuição (dias)" }),
        ordem_fallback: StringColumn({ label: "Ordem de fallback de canal", maxLength: 60 }),
        flow: ReferenceColumn({ label: "Flow", referenceTable: "sys_hub_flow" }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
