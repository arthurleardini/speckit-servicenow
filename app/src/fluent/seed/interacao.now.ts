// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_interacao_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_030"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "telefone",
        resultado: "promessa_pagamento",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-05-23 08:47:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_046"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "dte",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-11-30 10:17:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_030"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "presencial",
        resultado: "sem_contato",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-05-27 12:27:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_017"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-09-03 12:14:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_005"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "recusa",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-11-17 16:44:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_023"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-02-20 15:28:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_014"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-11-26 15:05:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_025"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "dte",
        resultado: "sem_contato",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-02-14 17:34:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_030"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "dte",
        resultado: "recusa",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-05-14 10:10:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_044"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "presencial",
        resultado: "contato_efetivo",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-01-14 13:09:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_040"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "promessa_pagamento",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-11-09 11:55:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_007"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "presencial",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-02-16 16:59:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_038"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "presencial",
        resultado: "promessa_pagamento",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-07-16 13:59:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_035"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "sem_contato",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-06-26 12:47:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_018"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "telefone",
        resultado: "recusa",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-01-22 16:56:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_032"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "presencial",
        resultado: "sem_contato",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-10-14 13:11:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_045"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "recusa",
        descricao: "Contato registrado com o contribuinte fictício.",
        ocorrida_em: "2026-05-11 08:08:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_038"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-07-13 18:05:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_019"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "telefone",
        resultado: "recusa",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-02-20 17:58:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_046"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "presencial",
        resultado: "contato_efetivo",
        descricao: "Contato registrado com o contribuinte fictício.",
        ocorrida_em: "2026-12-24 16:31:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_037"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "presencial",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-04-15 13:40:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_020"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "presencial",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-12-07 11:19:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_011"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "dte",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-11-03 16:44:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_013"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "telefone",
        resultado: "sem_contato",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-03-23 13:23:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_010"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "email",
        resultado: "sem_contato",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-12-31 14:06:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_010"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "telefone",
        resultado: "recusa",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-11-10 13:41:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_049"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "promessa_pagamento",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-09-27 11:15:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_035"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "sem_contato",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-12-10 14:10:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_025"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "presencial",
        resultado: "sem_contato",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-10-01 15:00:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_021"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "dte",
        resultado: "recusa",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-05-04 08:31:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_005"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "dte",
        resultado: "sem_contato",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-06-08 08:59:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_017"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "telefone",
        resultado: "promessa_pagamento",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-11-13 10:34:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_031"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "presencial",
        resultado: "contato_efetivo",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-07-10 10:42:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_009"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "dte",
        resultado: "sem_contato",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-06-11 11:24:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_033"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-05-18 15:53:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_033"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "email",
        resultado: "sem_contato",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-03-11 16:32:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_004"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "telefone",
        resultado: "recusa",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-01-05 16:27:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_027"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "dte",
        resultado: "recusa",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-06-28 17:34:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_012"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "telefone",
        resultado: "promessa_pagamento",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-10-12 14:31:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_042"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "presencial",
        resultado: "promessa_pagamento",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-01-09 12:45:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_005"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "presencial",
        resultado: "recusa",
        descricao: "Contato registrado com o contribuinte fictício.",
        ocorrida_em: "2026-03-05 10:59:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_043"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "email",
        resultado: "recusa",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-03-31 18:09:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_048"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "dte",
        resultado: "promessa_pagamento",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-07-28 15:57:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_003"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Documentação conferida pela equipe de atendimento.",
        ocorrida_em: "2026-08-31 17:56:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_035"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "presencial",
        resultado: "sem_contato",
        descricao: "Contato registrado com o contribuinte fictício.",
        ocorrida_em: "2026-03-08 08:59:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_021"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Contato registrado com o contribuinte fictício.",
        ocorrida_em: "2026-05-05 11:10:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_033"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Dados atualizados a partir do cadastro de demonstração.",
        ocorrida_em: "2026-02-17 14:39:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_047"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "email",
        resultado: "sem_contato",
        descricao: "Pendência encaminhada para análise da coordenação.",
        ocorrida_em: "2026-04-29 18:23:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_043"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        tipo: "email",
        resultado: "contato_efetivo",
        descricao: "Retorno agendado para a próxima semana.",
        ocorrida_em: "2026-02-24 13:21:00",
    },
})

Record({
    $id: Now.ID["seed_interacao_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_043"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        tipo: "dte",
        resultado: "recusa",
        descricao: "Contato registrado com o contribuinte fictício.",
        ocorrida_em: "2026-06-15 14:06:00",
    },
})

Record({
    $id: Now.ID["TEL-025_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_interacao",
    data: {
        caso: Now.ref("x_2326104_cob_caso", "seed_caso_009"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        tipo: "dte",
        resultado: "promessa_pagamento",
        descricao: "Registro demo TEL-025",
        ocorrida_em: "2026-10-13 10:24:00",
    },
})
