// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["home_usuario_demo_atendente"],
    $meta: { installMethod: 'demo' },
    table: "sys_user_preference",
    data: {
        name: "my_home_navigation_page",
        value: "x_2326104_cob_contato_list.do?sysparm_query=atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade",
        user: Now.ref("sys_user", "usuario_demo_atendente"),
        type: "string",
        description: "Página inicial do papel atendente (módulo Minha lista)",
    },
})

Record({
    $id: Now.ID["home_usuario_demo_atendente2"],
    $meta: { installMethod: 'demo' },
    table: "sys_user_preference",
    data: {
        name: "my_home_navigation_page",
        value: "x_2326104_cob_contato_list.do?sysparm_query=atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade",
        user: Now.ref("sys_user", "usuario_demo_atendente2"),
        type: "string",
        description: "Página inicial do papel atendente (módulo Minha lista)",
    },
})

Record({
    $id: Now.ID["home_usuario_demo_coordenador"],
    $meta: { installMethod: 'demo' },
    table: "sys_user_preference",
    data: {
        name: "my_home_navigation_page",
        value: "x_2326104_cob_caso_list.do?sysparm_query=estagio!=encerrado^ORDERBYestagio^ORDERBYDESCprioridade&sysparm_view=x_2326104_cob_tel_023",
        user: Now.ref("sys_user", "usuario_demo_coordenador"),
        type: "string",
        description: "Página inicial do papel coordenador (módulo Casos qualificados)",
    },
})
