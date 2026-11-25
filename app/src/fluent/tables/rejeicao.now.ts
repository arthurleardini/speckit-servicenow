// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_rejeicao = Table({
    name: "x_2326104_cob_rejeicao",
    label: [{ label: "Rejeição de registro", plural: "Rejeições de registro", language: 'en' }],
    display: "id_registro",
    allowWebServiceAccess: true,
    schema: {
        sincronizacao: ReferenceColumn({ label: "Sincronização", referenceTable: "x_2326104_cob_sincronizacao" }),
        fonte: ChoiceColumn({ label: "Fonte", choices: {
            "ccf": { label: "CCF", sequence: 0 },
            "mpi_bigdata": { label: "MPI/Big Data", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
            "sne": { label: "SNE", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        id_registro: StringColumn({ label: "ID do registro na fonte", maxLength: 40 }),
        motivo: ChoiceColumn({ label: "Motivo", choices: {
            "documento_invalido": { label: "Documento inválido", sequence: 0 },
            "sem_vinculo": { label: "Sem vínculo", sequence: 1 },
            "duplicado": { label: "Duplicado", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        detalhe: StringColumn({ label: "Detalhe", maxLength: 255 }),
    },
})
