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
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_026"),
        tributo: "itcd",
        valor: 86111.93,
        data: "2026-04-21",
        origem: "espontanea",
        canal: "sne",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_001"),
        tributo: "ipva",
        valor: 27598.07,
        data: "2026-12-26",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_045"),
        tributo: "itcd",
        valor: 93769.92,
        data: "2026-04-01",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "regua",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_041"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_027"),
        tributo: "icms_normal",
        valor: 3120.73,
        data: "2026-04-08",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_003"),
        tributo: "itcd",
        valor: 43219.35,
        data: "2026-03-25",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_050"),
        tributo: "itcd",
        valor: 81959.72,
        data: "2026-09-16",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_035"),
        tributo: "itcd",
        valor: 93013.2,
        data: "2026-12-31",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_030"),
        tributo: "itcd",
        valor: 85338.92,
        data: "2026-07-15",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_042"),
        tributo: "ipva",
        valor: 39456.23,
        data: "2026-10-18",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_003"),
        tributo: "icms_normal",
        valor: 46316.99,
        data: "2026-10-08",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "nenhum",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_012"],
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
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_022"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_025"),
        tributo: "ipva",
        valor: 8583.11,
        data: "2026-02-20",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_043"),
        tributo: "ipva",
        valor: 223.06,
        data: "2026-11-22",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_037"),
        tributo: "ipva",
        valor: 26661.96,
        data: "2026-02-12",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_047"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_038"),
        tributo: "icms_normal",
        valor: 1956.39,
        data: "2026-05-09",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_021"),
        tributo: "icms_st",
        valor: 27670.19,
        data: "2026-05-14",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_030"),
        tributo: "icms_normal",
        valor: 49946.74,
        data: "2026-12-03",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_042"),
        tributo: "ipva",
        valor: 66667.47,
        data: "2026-05-12",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "nenhum",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_012"),
        tributo: "ipva",
        valor: 82633.62,
        data: "2026-12-11",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_010"),
        tributo: "ipva",
        valor: 83288.21,
        data: "2026-10-10",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_031"),
        tributo: "icms_st",
        valor: 2064.69,
        data: "2026-02-11",
        origem: "espontanea",
        canal: "email",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_023"],
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
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_011"),
        tributo: "icms_st",
        valor: 576.16,
        data: "2026-10-10",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_014"),
        tributo: "icms_st",
        valor: 43893.1,
        data: "2026-08-26",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_042"),
        tributo: "itcd",
        valor: 89001.68,
        data: "2026-09-13",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "regua",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_017"),
        tributo: "icms_normal",
        valor: 89183.26,
        data: "2026-12-13",
        origem: "espontanea",
        canal: "sne",
        instrumento: "regua",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_015"),
        tributo: "itcd",
        valor: 28888.75,
        data: "2026-09-20",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_014"),
        tributo: "itcd",
        valor: 25163.17,
        data: "2026-11-12",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "TEL-004_registro_demo"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_007"),
        tributo: "itcd",
        valor: 77680.34,
        data: "2026-09-17",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_022"),
        tributo: "icms_st",
        valor: 69289.71,
        data: "2026-03-05",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_048"),
        tributo: "itcd",
        valor: 35447.39,
        data: "2026-09-19",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_004"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_030"),
        tributo: "icms_normal",
        valor: 76309.95,
        data: "2026-02-21",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_034"],
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
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_017"),
        tributo: "ipva",
        valor: 37211.96,
        data: "2026-12-17",
        origem: "resposta_cobranca",
        canal: "whatsapp",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_018"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_032"),
        tributo: "icms_st",
        valor: 77227.46,
        data: "2026-06-14",
        origem: "resposta_cobranca",
        canal: "sms",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_042"),
        tributo: "icms_normal",
        valor: 75795.73,
        data: "2026-02-21",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_031"),
        tributo: "icms_st",
        valor: 44576.31,
        data: "2026-04-07",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_011"),
        tributo: "ipva",
        valor: 2659.15,
        data: "2026-10-11",
        origem: "resposta_cobranca",
        canal: "email",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_008"),
        tributo: "itcd",
        valor: 17163.22,
        data: "2026-10-04",
        origem: "espontanea",
        canal: "sms",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_035"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_041"),
        tributo: "ipva",
        valor: 17124.75,
        data: "2026-12-16",
        origem: "resposta_cobranca",
        canal: "nenhum",
        instrumento: "regua",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_017"),
        tributo: "icms_st",
        valor: 98949.95,
        data: "2026-02-13",
        origem: "resposta_cobranca",
        canal: "sms",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_047"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_034"),
        tributo: "itcd",
        valor: 89128.52,
        data: "2026-12-18",
        origem: "espontanea",
        canal: "sne",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_028"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_015"),
        tributo: "ipva",
        valor: 65476.62,
        data: "2026-07-15",
        origem: "resposta_cobranca",
        canal: "atendimento",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_045"],
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
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_049"),
        tributo: "icms_normal",
        valor: 61381.89,
        data: "2026-01-23",
        origem: "espontanea",
        canal: "atendimento",
        instrumento: "nenhum",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_040"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_048"),
        tributo: "icms_normal",
        valor: 45069.91,
        data: "2026-07-07",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "regua",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_023"),
        tributo: "icms_normal",
        valor: 11758.11,
        data: "2026-07-11",
        origem: "resposta_cobranca",
        canal: "sne",
        instrumento: "qualificada",
        grupo_controle: false,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_035"),
        tributo: "itcd",
        valor: 80824.14,
        data: "2026-01-10",
        origem: "espontanea",
        canal: "nenhum",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
    },
})

Record({
    $id: Now.ID["seed_regularizacao_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regularizacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        debito: Now.ref("x_2326104_cob_debito", "seed_debito_004"),
        tributo: "icms_st",
        valor: 31819.12,
        data: "2026-01-29",
        origem: "espontanea",
        canal: "whatsapp",
        instrumento: "qualificada",
        grupo_controle: true,
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
    },
})
