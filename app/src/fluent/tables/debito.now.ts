// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateColumn, DateTimeColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_debito = Table({
    name: "x_2326104_cob_debito",
    label: "Débito",
    display: "id_fonte",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        origem: ChoiceColumn({ label: "Origem", mandatory: true, choices: {
            "ccf": { label: "CCF", sequence: 0 },
            "mpi_bigdata": { label: "MPI/Big Data", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
            "sne": { label: "SNE", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "icms_normal": { label: "ICMS Normal", sequence: 0 },
            "icms_st": { label: "ICMS ST", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        valor: GenericColumn({ columnType: "currency", label: "Valor (R$)" }),
        vencimento: DateColumn({ label: "Vencimento" }),
        dias_atraso: IntegerColumn({ label: "Dias de atraso" }),
        status: ChoiceColumn({ label: "Status", choices: {
            "aberto": { label: "Aberto", sequence: 0 },
            "parcelado": { label: "Parcelado", sequence: 1 },
            "regularizado": { label: "Regularizado", sequence: 2 },
            "cancelado": { label: "Cancelado", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        id_fonte: StringColumn({ label: "ID na fonte", maxLength: 40 }),
        sobreposto: BooleanColumn({ label: "Sobreposto entre fontes" }),
        atualizado_em: DateTimeColumn({ label: "Atualizado em" }),
    },
})
