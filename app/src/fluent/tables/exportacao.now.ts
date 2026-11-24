// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { ChoiceColumn, DateTimeColumn, IntegerColumn, ReferenceColumn, StringColumn, Table } from '@servicenow/sdk/core'

export const x_2326104_cob_exportacao = Table({
    name: "x_2326104_cob_exportacao",
    label: "Exportação",
    display: "tabela",
    audit: true,
    allowWebServiceAccess: true,
    schema: {
        usuario: ReferenceColumn({ label: "Usuário", referenceTable: "sys_user" }),
        tabela: StringColumn({ label: "Tabela", maxLength: 80 }),
        formato: ChoiceColumn({ label: "Formato", choices: {
            "csv": { label: "CSV", sequence: 0 },
            "pdf": { label: "PDF", sequence: 1 },
        }, dropdown: 'dropdown_with_none' }),
        filtro: StringColumn({ label: "Filtro aplicado", maxLength: 1000 }),
        registros: IntegerColumn({ label: "Registros" }),
        exportado_em: DateTimeColumn({ label: "Exportado em" }),
    },
})
