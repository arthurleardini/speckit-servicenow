// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["usuario_demo_coordenador"],
    $meta: { installMethod: 'demo' },
    table: "sys_user",
    data: {
        user_name: "demo.coordenador",
        first_name: "Demo",
        last_name: "Coordenador",
        active: true,
    },
})

Record({
    $id: Now.ID["usuario_demo_coordenador_role"],
    $meta: { installMethod: 'demo' },
    table: "sys_user_has_role",
    data: {
        user: Now.ref("sys_user", "usuario_demo_coordenador"),
        role: Now.ref("sys_user_role", {"name":"x_2326104_cob.coordenador"}),
    },
})

Record({
    $id: Now.ID["usuario_demo_atendente"],
    $meta: { installMethod: 'demo' },
    table: "sys_user",
    data: {
        user_name: "demo.atendente",
        first_name: "Demo",
        last_name: "Atendente",
        active: true,
    },
})

Record({
    $id: Now.ID["usuario_demo_atendente_role"],
    $meta: { installMethod: 'demo' },
    table: "sys_user_has_role",
    data: {
        user: Now.ref("sys_user", "usuario_demo_atendente"),
        role: Now.ref("sys_user_role", {"name":"x_2326104_cob.atendente"}),
    },
})

Record({
    $id: Now.ID["usuario_demo_admin"],
    $meta: { installMethod: 'demo' },
    table: "sys_user",
    data: {
        user_name: "demo.admin",
        first_name: "Demo",
        last_name: "Admin",
        active: true,
    },
})

Record({
    $id: Now.ID["usuario_demo_admin_role"],
    $meta: { installMethod: 'demo' },
    table: "sys_user_has_role",
    data: {
        user: Now.ref("sys_user", "usuario_demo_admin"),
        role: Now.ref("sys_user_role", {"name":"x_2326104_cob.admin"}),
    },
})
