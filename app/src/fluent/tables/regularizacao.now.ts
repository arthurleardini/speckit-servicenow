// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateColumn, GenericColumn, ReferenceColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_regularizacao = Table({
    name: "x_2326104_cob_regularizacao",
    label: "Regularização",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        debito: ReferenceColumn({ label: "Débito", referenceTable: "x_2326104_cob_debito" }),
        ciclo: ReferenceColumn({ label: "Ciclo", referenceTable: "x_2326104_cob_ciclo" }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "icms_normal": { label: "ICMS Normal", sequence: 0 },
            "icms_st": { label: "ICMS ST", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
        }, dropdown: 'dropdown_with_none' }),
        valor: GenericColumn({ columnType: "currency", label: "Valor regularizado" }),
        data: DateColumn({ label: "Data" }),
        origem: ChoiceColumn({ label: "Origem", mandatory: true, choices: {
            "espontanea": { label: "Espontânea", sequence: 0 },
            "resposta_cobranca": { label: "Resposta à cobrança", sequence: 1 },
        }, dropdown: 'dropdown_with_none' }),
        canal: ChoiceColumn({ label: "Canal", choices: {
            "email": { label: "E-mail", sequence: 0 },
            "sms": { label: "SMS", sequence: 1 },
            "sne": { label: "SNE", sequence: 2 },
            "whatsapp": { label: "WhatsApp", sequence: 3 },
            "atendimento": { label: "Atendimento", sequence: 4 },
            "nenhum": { label: "Nenhum", sequence: 5 },
        }, dropdown: 'dropdown_with_none' }),
        instrumento: ChoiceColumn({ label: "Instrumento", choices: {
            "regua": { label: "Régua", sequence: 0 },
            "qualificada": { label: "Cobrança qualificada", sequence: 1 },
            "nenhum": { label: "Nenhum", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        grupo_controle: BooleanColumn({ label: "Grupo de controle" }),
        comunicacao: ReferenceColumn({ label: "Comunicação", referenceTable: "x_2326104_cob_comunicacao" }),
        caso: ReferenceColumn({ label: "Caso", referenceTable: "x_2326104_cob_caso" }),
        atendente: ReferenceColumn({ label: "Atendente", referenceTable: "sys_user" }),
    },
})
