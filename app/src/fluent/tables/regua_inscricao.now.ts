// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_regua_inscricao = Table({
    name: "x_2326104_cob_regua_inscricao",
    label: [{ label: "Inscrição na régua", plural: "Inscrições na régua", language: 'en' }],
    display: "contribuinte",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        regua: ReferenceColumn({ label: "Régua", mandatory: true, referenceTable: "x_2326104_cob_regua" }),
        ciclo: ReferenceColumn({ label: "Ciclo", referenceTable: "x_2326104_cob_ciclo" }),
        parcelamento: ReferenceColumn({ label: "Parcelamento", referenceTable: "x_2326104_cob_parcelamento" }),
        status: ChoiceColumn({ label: "Status", choices: {
            "ativa": { label: "Ativa", sequence: 0 },
            "encerrada": { label: "Encerrada", sequence: 1 },
            "erro": { label: "Erro", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        etapa_atual: IntegerColumn({ label: "Etapa atual" }),
        proxima_etapa_em: DateTimeColumn({ label: "Próxima etapa em" }),
        iniciada_em: DateTimeColumn({ label: "Iniciada em" }),
        encerrada_em: DateTimeColumn({ label: "Encerrada em" }),
        motivo_encerramento: ChoiceColumn({ label: "Motivo de encerramento", choices: {
            "regularizado": { label: "Regularizado", sequence: 0 },
            "parcelamento_rompido": { label: "Parcelamento rompido", sequence: 1 },
            "controle": { label: "Grupo de controle", sequence: 2 },
            "regua_pausada": { label: "Régua pausada", sequence: 3 },
            "encaminhada_ativa": { label: "Encaminhada à cobrança ativa", sequence: 4 },
            "encaminhada_qualificada": { label: "Encaminhada à cobrança qualificada", sequence: 5 },
        }, dropdown: 'dropdown_with_none' }),
        contato: ReferenceColumn({ label: "Contato da cobrança ativa", referenceTable: "x_2326104_cob_contato" }),
        detalhe: StringColumn({ label: "Detalhe", maxLength: 255 }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
