// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateColumn, DecimalColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_meta = Table({
    name: "x_2326104_cob_meta",
    label: [{ label: "Meta de KPI", plural: "Metas de KPI", language: 'en' }],
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        indicador: ChoiceColumn({ label: "Indicador", mandatory: true, choices: {
            "taxa_regularizacao": { label: "Taxa de regularização", sequence: 0 },
            "valor_recuperado": { label: "Valor recuperado", sequence: 1 },
            "tempo_medio": { label: "Tempo médio até regularizar", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "todos": { label: "Todos", sequence: 0 },
            "icms_normal": { label: "ICMS Normal", sequence: 1 },
            "icms_st": { label: "ICMS ST", sequence: 2 },
            "ipva": { label: "IPVA", sequence: 3 },
            "itcd": { label: "ITCD", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        canal: ChoiceColumn({ label: "Canal", choices: {
            "todos": { label: "Todos", sequence: 0 },
            "email": { label: "E-mail", sequence: 1 },
            "sms": { label: "SMS", sequence: 2 },
            "sne": { label: "SNE", sequence: 3 },
            "whatsapp": { label: "WhatsApp", sequence: 4 },
            "atendimento": { label: "Atendimento", sequence: 5 },
        }, dropdown: 'dropdown_with_none' }),
        periodo: DateColumn({ label: "Período" }),
        valor_meta: DecimalColumn({ label: "Valor da meta", mandatory: true }),
    },
})
