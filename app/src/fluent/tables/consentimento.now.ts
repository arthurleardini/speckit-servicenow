// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_consentimento = Table({
    name: "x_2326104_cob_consentimento",
    label: [{ label: "Consentimento por canal", plural: "Consentimentos por canal", language: 'en' }],
    display: "origem",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        canal: ChoiceColumn({ label: "Canal", mandatory: true, choices: {
            "email": { label: "E-mail", sequence: 0 },
            "sms": { label: "SMS", sequence: 1 },
            "sne": { label: "SNE", sequence: 2 },
            "whatsapp": { label: "WhatsApp", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        situacao: ChoiceColumn({ label: "Situação", mandatory: true, choices: {
            "opt_in": { label: "Opt-in", sequence: 0 },
            "opt_out": { label: "Opt-out", sequence: 1 },
        }, dropdown: 'dropdown_with_none' }),
        registrado_em: DateTimeColumn({ label: "Registrado em" }),
        origem: StringColumn({ label: "Origem do registro", maxLength: 80 }),
    },
})
