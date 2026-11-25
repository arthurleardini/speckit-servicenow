// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateTimeColumn, DecimalColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_criterio = Table({
    name: "x_2326104_cob_criterio",
    label: [{ label: "Critério de qualificação", plural: "Critérios de qualificação", language: 'en' }],
    display: "codigo",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        nome: StringColumn({ label: "Nome", mandatory: true, maxLength: 100 }),
        codigo: StringColumn({ label: "Código do critério", maxLength: 40 }),
        versao: IntegerColumn({ label: "Versão" }),
        estado: ChoiceColumn({ label: "Estado", mandatory: true, choices: {
            "rascunho": { label: "Rascunho", sequence: 0 },
            "publicada": { label: "Publicada", sequence: 1 },
            "substituida": { label: "Substituída", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        tributo: ChoiceColumn({ label: "Tributo", choices: {
            "todos": { label: "Todos", sequence: 0 },
            "icms_normal": { label: "ICMS Normal", sequence: 1 },
            "icms_st": { label: "ICMS ST", sequence: 2 },
            "ipva": { label: "IPVA", sequence: 3 },
            "itcd": { label: "ITCD", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        valor_minimo: GenericColumn({ columnType: "currency", label: "Valor mínimo (R$)" }),
        atraso_minimo_dias: IntegerColumn({ label: "Atraso mínimo (dias)" }),
        instrumento: StringColumn({ label: "Instrumento", maxLength: 80 }),
        excluir_contumaz: BooleanColumn({ label: "Excluir contumazes" }),
        usar_score: BooleanColumn({ label: "Usar score de liquidez" }),
        threshold_score: DecimalColumn({ label: "Threshold do score" }),
        pct_grupo_controle: DecimalColumn({ label: "Grupo de controle (%)" }),
        desempate: ChoiceColumn({ label: "Desempate", choices: {
            "maior_debito_mais_antigo": { label: "Maior débito, depois o mais antigo", sequence: 0 },
        }, dropdown: 'dropdown_with_none' }),
        versao_anterior: ReferenceColumn({ label: "Versão anterior", referenceTable: "x_2326104_cob_criterio" }),
        motivo_alteracao: StringColumn({ label: "Motivo da nova versão", maxLength: 255 }),
        publicada_em: DateTimeColumn({ label: "Publicada em" }),
        publicada_por: ReferenceColumn({ label: "Publicada por", referenceTable: "sys_user" }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
