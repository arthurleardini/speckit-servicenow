// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde
import '@servicenow/sdk/global'
import { Role } from '@servicenow/sdk/core'

export const role_coordenador = Role({
    $id: Now.ID["role_coordenador"],
    name: "x_2326104_cob.coordenador",
    description: "Papel Coordenador do app x_2326104_cob",
})

export const role_atendente = Role({
    $id: Now.ID["role_atendente"],
    name: "x_2326104_cob.atendente",
    description: "Papel Atendente do app x_2326104_cob",
})

export const role_admin = Role({
    $id: Now.ID["role_admin"],
    name: "x_2326104_cob.admin",
    description: "Papel Admin do app x_2326104_cob",
})
