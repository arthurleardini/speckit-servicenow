// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DecimalColumn, GenericColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_segmentacao = Table({
    name: "x_2326104_cob_segmentacao",
    label: "Carteira segmentada",
    display: "motivo",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        ciclo: ReferenceColumn({ label: "Ciclo", mandatory: true, referenceTable: "x_2326104_cob_ciclo" }),
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        criterio: ReferenceColumn({ label: "Versão do critério", referenceTable: "x_2326104_cob_criterio" }),
        segmento: ChoiceColumn({ label: "Segmento", choices: {
            "massificada": { label: "Massificada", sequence: 0 },
            "qualificada": { label: "Qualificada", sequence: 1 },
            "controle": { label: "Grupo de controle", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        valor_em_aberto: GenericColumn({ columnType: "currency", label: "Valor em aberto (R$)" }),
        score_usado: DecimalColumn({ label: "Score usado" }),
        sem_score: BooleanColumn({ label: "Sem score" }),
        estagio_funil: ChoiceColumn({ label: "Estágio do funil", choices: {
            "identificado": { label: "Identificado", sequence: 0 },
            "notificado": { label: "Notificado", sequence: 1 },
            "regularizado": { label: "Regularizado", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        motivo: StringColumn({ label: "Motivo", maxLength: 255 }),
    },
})
