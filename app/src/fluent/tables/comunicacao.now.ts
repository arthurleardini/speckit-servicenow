// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_comunicacao = Table({
    name: "x_2326104_cob_comunicacao",
    label: "Comunicação",
    display: "motivo",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        regua: ReferenceColumn({ label: "Régua", referenceTable: "x_2326104_cob_regua" }),
        etapa: ReferenceColumn({ label: "Etapa", referenceTable: "x_2326104_cob_regua_etapa" }),
        ciclo: ReferenceColumn({ label: "Ciclo", referenceTable: "x_2326104_cob_ciclo" }),
        canal: ChoiceColumn({ label: "Canal", choices: {
            "email": { label: "E-mail", sequence: 0 },
            "sms": { label: "SMS", sequence: 1 },
            "sne": { label: "SNE", sequence: 2 },
            "whatsapp": { label: "WhatsApp", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        status: ChoiceColumn({ label: "Status", choices: {
            "agendada": { label: "Agendada", sequence: 0 },
            "enviada": { label: "Enviada", sequence: 1 },
            "entregue": { label: "Entregue", sequence: 2 },
            "falha": { label: "Falha", sequence: 3 },
            "pulada": { label: "Pulada", sequence: 4 },
            "encerrada": { label: "Encerrada", sequence: 5 },
        }, dropdown: 'dropdown_with_none' }),
        motivo: StringColumn({ label: "Motivo", maxLength: 255 }),
        enviada_em: DateTimeColumn({ label: "Enviada em" }),
        tentativas: IntegerColumn({ label: "Tentativas" }),
    },
})
