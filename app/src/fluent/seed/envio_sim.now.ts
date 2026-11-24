// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_envio_sim_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_047"),
        canal: "email",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-06-03 11:56:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_038"),
        canal: "whatsapp",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-08-01 10:19:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_036"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-02-27 09:43:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_031"),
        canal: "sne",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-09-12 16:58:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_042"),
        canal: "email",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-06-20 11:52:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_007"),
        canal: "sne",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-10-11 11:39:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_034"),
        canal: "email",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-09-29 11:23:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_032"),
        canal: "sms",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-05-10 09:12:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_032"),
        canal: "whatsapp",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 00",
        recebido_em: "2026-03-12 17:07:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_037"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-02-06 17:23:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_040"),
        canal: "sms",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-04-09 12:19:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_044"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-07-10 12:15:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_016"),
        canal: "sms",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-03-11 10:55:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_048"),
        canal: "sms",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-05-25 10:17:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_001"),
        canal: "email",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-05-07 09:42:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_024"),
        canal: "email",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-01-03 14:00:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_038"),
        canal: "sne",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-05-12 09:18:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_008"),
        canal: "sms",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-08-04 08:12:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_042"),
        canal: "email",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 01",
        recebido_em: "2026-11-20 18:14:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_004"),
        canal: "sne",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-06-02 16:40:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_041"),
        canal: "sms",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-03-02 17:52:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_049"),
        canal: "email",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-05-27 08:44:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_041"),
        canal: "sne",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-04-23 17:49:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_026"),
        canal: "sne",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-07-17 14:41:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_014"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-08-31 13:03:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_004"),
        canal: "sne",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-06-26 10:32:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_010"),
        canal: "sms",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-11-24 18:02:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_014"),
        canal: "sne",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-02-12 10:01:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_032"),
        canal: "sms",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 02",
        recebido_em: "2026-11-15 09:55:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_021"),
        canal: "sms",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-05-04 17:40:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_005"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-10-08 17:01:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_014"),
        canal: "sne",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-01-07 08:53:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_019"),
        canal: "sne",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-05-15 14:20:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_040"),
        canal: "email",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-09-03 17:45:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_026"),
        canal: "sms",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-09-02 13:15:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_028"),
        canal: "sne",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-09-30 12:56:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_035"),
        canal: "sms",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-05-23 14:38:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_038"),
        canal: "whatsapp",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-08-16 14:56:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_040"),
        canal: "sms",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 03",
        recebido_em: "2026-03-07 08:42:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_042"),
        canal: "whatsapp",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-02-05 17:55:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_026"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-04-09 13:54:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_032"),
        canal: "sms",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-11-19 12:55:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_010"),
        canal: "whatsapp",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-09-24 10:24:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_032"),
        canal: "whatsapp",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-05-28 09:48:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_037"),
        canal: "whatsapp",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-07-26 09:32:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_027"),
        canal: "sne",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-05-23 16:10:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_010"),
        canal: "sms",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-06-04 17:08:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_048"),
        canal: "email",
        status_retorno: "recusado_sem_optin",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-11-28 17:23:00",
        falhar: false,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_010"),
        canal: "sms",
        status_retorno: "entregue",
        codigo_retorno: "Código de retorno 04",
        recebido_em: "2026-04-22 13:29:00",
        falhar: true,
    },
})

Record({
    $id: Now.ID["seed_envio_sim_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_048"),
        canal: "email",
        status_retorno: "falha",
        codigo_retorno: "Código de retorno 05",
        recebido_em: "2026-03-25 14:32:00",
        falhar: false,
    },
})
