// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { BooleanColumn, ChoiceColumn, DateTimeColumn, DecimalColumn, GenericColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_caso = Table({
    name: "x_2326104_cob_caso",
    label: "Caso de cobrança qualificada",
    display: "contribuinte",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        contribuinte: ReferenceColumn({ label: "Contribuinte", mandatory: true, referenceTable: "x_2326104_cob_contribuinte" }),
        coordenador: ReferenceColumn({ label: "Responsável", referenceTable: "sys_user" }),
        ciclo: ReferenceColumn({ label: "Ciclo", referenceTable: "x_2326104_cob_ciclo" }),
        estagio: ChoiceColumn({ label: "Estágio", choices: {
            "em_selecao": { label: "Em seleção", sequence: 0 },
            "selecionado": { label: "Caso selecionado", sequence: 1 },
            "dossie_gerado": { label: "Dossiê gerado", sequence: 2 },
            "conducao": { label: "Condução", sequence: 3 },
            "encerrado": { label: "Encerrado", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        prioridade: IntegerColumn({ label: "Prioridade" }),
        score: DecimalColumn({ label: "Score de liquidez" }),
        sem_score: BooleanColumn({ label: "Sem score" }),
        valor_em_aberto: GenericColumn({ columnType: "currency", label: "Valor em aberto (R$)" }),
        sinal_coercitivo: BooleanColumn({ label: "Sinalização coercitiva ativa" }),
        sinal_coercitivo_desc: StringColumn({ label: "Sinalização coercitiva (descrição)", maxLength: 255 }),
        motivo_encerramento: ChoiceColumn({ label: "Motivo de encerramento", choices: {
            "regularizado": { label: "Regularizado", sequence: 0 },
            "esgotado": { label: "Esgotado", sequence: 1 },
            "outro": { label: "Outro", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        encerrado_em: DateTimeColumn({ label: "Encerrado em" }),
        comentarios: GenericColumn({ columnType: "journal_input", label: "Comentários" }),
    },
})
