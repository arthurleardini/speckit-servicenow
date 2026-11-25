// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateTimeColumn, GenericColumn, IntegerColumn, ReferenceColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_parcelamento = Table({
    name: "x_2326104_cob_parcelamento",
    label: "Parcelamento",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "icms_normal": { label: "ICMS Normal", sequence: 0 },
            "icms_st": { label: "ICMS ST", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        valor_total: GenericColumn({ columnType: "currency", label: "Valor total (R$)" }),
        parcelas_total: IntegerColumn({ label: "Parcelas" }),
        parcelas_atraso: IntegerColumn({ label: "Parcelas em atraso" }),
        status: ChoiceColumn({ label: "Status", choices: {
            "em_dia": { label: "Em dia", sequence: 0 },
            "em_risco": { label: "Em risco", sequence: 1 },
            "rompido": { label: "Rompido", sequence: 2 },
            "quitado": { label: "Quitado", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        alerta_risco: BooleanColumn({ label: "Alerta de risco" }),
        atualizado_em: DateTimeColumn({ label: "Atualizado em" }),
    },
})
