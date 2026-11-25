// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, IntegerColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_sincronizacao = Table({
    name: "x_2326104_cob_sincronizacao",
    label: [{ label: "Execução de sincronização", plural: "Execuções de sincronização", language: 'en' }],
    display: "mensagem",
    allowWebServiceAccess: true,
    schema: {
        fonte: ChoiceColumn({ label: "Fonte", mandatory: true, choices: {
            "ccf": { label: "CCF", sequence: 0 },
            "mpi_bigdata": { label: "MPI/Big Data", sequence: 1 },
            "ipva": { label: "IPVA", sequence: 2 },
            "itcd": { label: "ITCD", sequence: 3 },
            "sne": { label: "SNE", sequence: 4 },
        }, dropdown: 'dropdown_with_none' }),
        inicio: DateTimeColumn({ label: "Início" }),
        fim: DateTimeColumn({ label: "Fim" }),
        status: ChoiceColumn({ label: "Status", choices: {
            "sucesso": { label: "Sucesso", sequence: 0 },
            "parcial": { label: "Parcial", sequence: 1 },
            "falha": { label: "Falha", sequence: 2 },
        }, dropdown: 'dropdown_with_none' }),
        volume: IntegerColumn({ label: "Volume" }),
        rejeitados: IntegerColumn({ label: "Rejeitados" }),
        mensagem: StringColumn({ label: "Mensagem", maxLength: 255 }),
    },
})
