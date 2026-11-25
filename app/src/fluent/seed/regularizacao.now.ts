// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_regularizacao_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_033"),
        tributo: "icms_st",
        valor: 61973.88,
        data: "2026-12-25",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_033"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_046"),
        tributo: "itcd",
        valor: 30152.37,
        data: "2026-01-28",
        origem: "espontanea",
        canal: "email",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_046"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_014"),
        tributo: "itcd",
        valor: 85534.9,
        data: "2026-10-01",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_045"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_013"),
        tributo: "ipva",
        valor: 13196.72,
        data: "2026-01-05",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_001"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_042"),
        tributo: "icms_st",
        valor: 98732.14,
        data: "2026-09-21",
        origem: "resposta_cobranca",
        canal: "sms",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_022"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_028"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_046"),
        tributo: "itcd",
        valor: 73309.87,
        data: "2026-01-21",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_036"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_010"),
        tributo: "ipva",
        valor: 69866.76,
        data: "2026-02-03",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_045"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_010"),
        tributo: "itcd",
        valor: 5012.93,
        data: "2026-08-01",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_049"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_012"),
        tributo: "icms_st",
        valor: 83184.52,
        data: "2026-07-26",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_034"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_016"),
        tributo: "icms_normal",
        valor: 17449.44,
        data: "2026-06-19",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_024"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_011"),
        tributo: "icms_normal",
        valor: 22387.5,
        data: "2026-04-09",
        origem: "espontanea",
        canal: "sms",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_032"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_026"),
        tributo: "icms_normal",
        valor: 13867.43,
        data: "2026-03-03",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_038"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_001"),
        tributo: "itcd",
        valor: 83847.1,
        data: "2026-05-30",
        origem: "espontanea",
        canal: "sne",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_037"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_006"),
        tributo: "itcd",
        valor: 84971.05,
        data: "2026-12-12",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_010"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_024"),
        tributo: "itcd",
        valor: 57224.26,
        data: "2026-10-16",
        origem: "espontanea",
        canal: "sms",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_014"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_044"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_026"),
        tributo: "itcd",
        valor: 87657.22,
        data: "2026-11-08",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "regua",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_047"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_015"),
        tributo: "itcd",
        valor: 66830.81,
        data: "2026-10-30",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_027"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_003"),
        tributo: "icms_normal",
        valor: 18653.62,
        data: "2026-03-22",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_029"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_037"),
        tributo: "ipva",
        valor: 19569.26,
        data: "2026-07-27",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_022"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_036"),
        tributo: "ipva",
        valor: 48776.07,
        data: "2026-01-08",
        origem: "espontanea",
        canal: "email",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_029"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_038"),
        tributo: "itcd",
        valor: 62541.83,
        data: "2026-10-06",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_017"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_011"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_021"),
        tributo: "icms_normal",
        valor: 77361.26,
        data: "2026-10-14",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_021"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_022"),
        tributo: "ipva",
        valor: 46744.46,
        data: "2026-11-13",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_042"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_035"),
        tributo: "icms_normal",
        valor: 52751.94,
        data: "2026-04-15",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_001"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_006"),
        tributo: "icms_st",
        valor: 18806.24,
        data: "2026-05-19",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_015"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_023"),
        tributo: "itcd",
        valor: 55874.68,
        data: "2026-07-13",
        origem: "resposta_cobranca",
        canal: "sms",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_044"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_040"),
        tributo: "ipva",
        valor: 77148.21,
        data: "2026-12-24",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_041"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_048"),
        tributo: "ipva",
        valor: 26261.69,
        data: "2026-06-04",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "regua",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_034"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_022"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_042"),
        tributo: "ipva",
        valor: 94419.74,
        data: "2026-12-23",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_015"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_004"),
        tributo: "ipva",
        valor: 12773.83,
        data: "2026-10-06",
        origem: "espontanea",
        canal: "sms",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_009"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_004"),
        tributo: "itcd",
        valor: 96805.85,
        data: "2026-06-21",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_006"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_027"),
        tributo: "icms_st",
        valor: 96160.02,
        data: "2026-11-03",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_018"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_039"),
        tributo: "icms_st",
        valor: 95543.62,
        data: "2026-04-03",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_042"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_008"),
        tributo: "icms_normal",
        valor: 78410.39,
        data: "2026-04-09",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_020"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_004"),
        tributo: "itcd",
        valor: 90201.12,
        data: "2026-07-30",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_002"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_004"),
        tributo: "icms_st",
        valor: 3058.65,
        data: "2026-03-10",
        origem: "espontanea",
        canal: "email",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_038"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_011"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_007"),
        tributo: "ipva",
        valor: 25517.34,
        data: "2026-09-06",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_049"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_021"),
        tributo: "ipva",
        valor: 23372.11,
        data: "2026-04-27",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_016"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_040"),
        tributo: "itcd",
        valor: 66426.05,
        data: "2026-12-02",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_021"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_028"),
        tributo: "icms_st",
        valor: 73916.15,
        data: "2026-08-27",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_021"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_002"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_040"),
        tributo: "itcd",
        valor: 57056.92,
        data: "2026-05-10",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_003"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_007"),
        tributo: "ipva",
        valor: 6196.36,
        data: "2026-01-11",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_039"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_023"),
        tributo: "ipva",
        valor: 5289.62,
        data: "2026-08-12",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_023"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_027"),
        tributo: "ipva",
        valor: 37880.07,
        data: "2026-05-31",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_043"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_002"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_005"),
        tributo: "itcd",
        valor: 43201.01,
        data: "2026-05-20",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "regua",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_016"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_028"),
        tributo: "icms_st",
        valor: 9101.11,
        data: "2026-03-18",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: true,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_023"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_028"),
        tributo: "icms_normal",
        valor: 51834.79,
        data: "2026-01-28",
        origem: "resposta_cobranca",
        canal: "sms",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_005"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_013"),
        tributo: "icms_st",
        valor: 73717.89,
        data: "2026-03-24",
        origem: "espontanea",
        canal: "sms",
        instrumento: "nenhum",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_028"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_007"),
        tributo: "ipva",
        valor: 5487.26,
        data: "2026-11-13",
        origem: "espontanea",
        canal: "sms",
        instrumento: "regua",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_048"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_013"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_024"),
        tributo: "ipva",
        valor: 18576.87,
        data: "2026-03-14",
        origem: "resposta_cobranca",
        canal: "sms",
        instrumento: "qualificada",
        grupo_controle: false,
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_comunicacao_008"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})
