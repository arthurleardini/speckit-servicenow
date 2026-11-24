// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateTimeColumn, DecimalColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_score_sim = Table({
    name: "x_2326104_cob_score_sim",
    label: "Score de liquidez (Simulado)",
    display: "versao_modelo",
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "icms_normal": { label: "ICMS Normal", sequence: 0 },
            "icms_st": { label: "ICMS ST", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        score: DecimalColumn({ label: "Score" }),
        versao_modelo: StringColumn({ label: "Versão do modelo", maxLength: 20 }),
        ingerido_em: DateTimeColumn({ label: "Ingerido em" }),
        status: ChoiceColumn({ label: "Status", choices: {
            "valido": { label: "Válido", sequence: 0 },
            "invalido": { label: "Inválido", sequence: 1 },
            "sem_score": { label: "Sem score", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        falhar: BooleanColumn({ label: "Simular falha" }),
    },
})
