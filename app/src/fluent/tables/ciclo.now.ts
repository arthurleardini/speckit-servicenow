// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateColumn, DateTimeColumn, DecimalColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_ciclo = Table({
    name: "x_2326104_cob_ciclo",
    label: [{ label: "Ciclo de qualificação", plural: "Ciclos de qualificação", language: 'en' }],
    display: "nome",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        nome: StringColumn({ label: "Nome", mandatory: true, maxLength: 60 }),
        referencia: DateColumn({ label: "Mês de referência" }),
        criterio: ReferenceColumn({ label: "Critério aplicado", referenceTable: "x_2326104_cob_criterio" }),
        estado: ChoiceColumn({ label: "Estado", choices: {
            "previa": { label: "Prévia", sequence: 0 },
            "publicado": { label: "Publicado", sequence: 1 },
            "encerrado": { label: "Encerrado", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        qtd_elegiveis: IntegerColumn({ label: "Elegíveis" }),
        semente_sorteio: IntegerColumn({ label: "Semente do sorteio" }),
        qtd_massificada: IntegerColumn({ label: "Massificada" }),
        qtd_qualificada: IntegerColumn({ label: "Qualificada" }),
        qtd_controle: IntegerColumn({ label: "Grupo de controle" }),
        qtd_sem_score: IntegerColumn({ label: "Sem score" }),
        taxa_cobrada: DecimalColumn({ label: "Taxa da carteira cobrada (%)" }),
        taxa_controle: DecimalColumn({ label: "Taxa do grupo de controle (%)" }),
        efeito_incremental: DecimalColumn({ label: "Efeito incremental (p.p.)" }),
        publicado_em: DateTimeColumn({ label: "Publicado em" }),
        publicado_por: ReferenceColumn({ label: "Publicado por", referenceTable: "sys_user" }),
        distribuido_em: DateTimeColumn({ label: "Distribuído em" }),
        qtd_contatos: IntegerColumn({ label: "Contatos distribuídos" }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
