// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_canal_sim = Table({
    name: "x_2326104_cob_canal_sim",
    label: "Canal de envio (Simulado)",
    allowWebServiceAccess: true,
    schema: {
        canal: ChoiceColumn({ label: "Canal", mandatory: true, choices: {
            "email": { label: "E-mail", sequence: 0 },
            "sms": { label: "SMS", sequence: 1 },
            "sne": { label: "SNE", sequence: 2 },
            "whatsapp": { label: "WhatsApp", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        contratado: BooleanColumn({ label: "Contratado" }),
        forcar_falha: BooleanColumn({ label: "Forçar falha" }),
        exige_opt_in: BooleanColumn({ label: "Exige opt-in" }),
        falhar: BooleanColumn({ label: "Simular falha" }),
    },
})
