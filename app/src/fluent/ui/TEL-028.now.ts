// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

export const report_TEL_028 = Record({
    $id: Now.ID["TEL-028_report"],
    table: 'sys_report',
    data: { title: "Regularizações por origem e canal", table: "x_2326104_cob_regularizacao", type: 'bar', field: "tributo", aggregate: 'COUNT', is_published: true, user: 'GLOBAL', roles: ["x_2326104_cob.coordenador","x_2326104_cob.atendente","x_2326104_cob.admin"] },
})
