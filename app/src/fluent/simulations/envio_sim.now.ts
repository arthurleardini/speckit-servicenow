// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateTimeColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_envio_sim = Table({
    name: "x_2326104_cob_envio_sim",
    label: [{ label: "Retorno de envio (Simulado)", plural: "Retornos de envio (Simulado)", language: 'en' }],
    display: "codigo_retorno",
    allowWebServiceAccess: true,
    schema: {
        comunicacao: ReferenceColumn({ label: "Comunicação", mandatory: true, referenceTable: "x_2326104_cob_comunicacao" }),
        canal: ChoiceColumn({ label: "Canal", choices: {
            "email": { label: "E-mail", sequence: 0 },
            "sms": { label: "SMS", sequence: 1 },
            "sne": { label: "SNE", sequence: 2 },
            "whatsapp": { label: "WhatsApp", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        status_retorno: ChoiceColumn({ label: "Status de retorno", choices: {
            "entregue": { label: "Entregue", sequence: 0 },
            "falha": { label: "Falha", sequence: 1 },
            "recusado_sem_optin": { label: "Recusado sem opt-in", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        codigo_retorno: StringColumn({ label: "Código de retorno", maxLength: 20 }),
        recebido_em: DateTimeColumn({ label: "Recebido em" }),
        falhar: BooleanColumn({ label: "Simular falha" }),
    },
})
