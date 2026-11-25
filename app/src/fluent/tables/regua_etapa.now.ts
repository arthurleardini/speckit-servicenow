// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_regua_etapa = Table({
    name: "x_2326104_cob_regua_etapa",
    label: [{ label: "Etapa da régua", plural: "Etapas da régua", language: 'en' }],
    display: "template",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        regua: ReferenceColumn({ label: "Régua", mandatory: true, referenceTable: "x_2326104_cob_regua" }),
        ordem: IntegerColumn({ label: "Ordem" }),
        offset_dias: IntegerColumn({ label: "Dia (D+n)" }),
        canal: ChoiceColumn({ label: "Canal", choices: {
            "email": { label: "E-mail", sequence: 0 },
            "sms": { label: "SMS", sequence: 1 },
            "sne": { label: "SNE", sequence: 2 },
            "whatsapp": { label: "WhatsApp", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        template: StringColumn({ label: "Template", maxLength: 1000 }),
        postura: ChoiceColumn({ label: "Postura", choices: {
            "utilitaria": { label: "Utilitária", sequence: 0 },
            "consciente": { label: "Consciente", sequence: 1 },
            "explicativa": { label: "Explicativa", sequence: 2 },
            "ameacadora": { label: "Ameaçadora", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        acao_sem_resposta: ChoiceColumn({ label: "Ação sem resposta", choices: {
            "renotificar": { label: "Renotificar", sequence: 0 },
            "intensificar": { label: "Intensificar", sequence: 1 },
            "encaminhar_ativa": { label: "Encaminhar à cobrança ativa", sequence: 2 },
            "encaminhar_qualificada": { label: "Encaminhar à qualificada", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
    },
})
