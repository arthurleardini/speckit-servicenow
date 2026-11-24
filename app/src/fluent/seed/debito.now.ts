// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_debito_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        origem: "sne",
        tributo: "itcd",
        valor: 39719.63,
        vencimento: "2026-12-18",
        dias_atraso: 844,
        status: "cancelado",
        id_fonte: "ID na fonte 001",
        sobreposto: true,
        atualizado_em: "2026-10-07 17:34:00",
    },
})

Record({
    $id: Now.ID["seed_debito_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_004"),
        origem: "mpi_bigdata",
        tributo: "icms_st",
        valor: 78361.91,
        vencimento: "2026-01-25",
        dias_atraso: 409,
        status: "parcelado",
        id_fonte: "ID na fonte 002",
        sobreposto: true,
        atualizado_em: "2026-07-19 10:59:00",
    },
})

Record({
    $id: Now.ID["seed_debito_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_007"),
        origem: "mpi_bigdata",
        tributo: "ipva",
        valor: 9697.47,
        vencimento: "2026-09-26",
        dias_atraso: 61,
        status: "parcelado",
        id_fonte: "ID na fonte 003",
        sobreposto: true,
        atualizado_em: "2026-10-02 12:10:00",
    },
})

Record({
    $id: Now.ID["seed_debito_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_047"),
        origem: "sne",
        tributo: "itcd",
        valor: 17193.61,
        vencimento: "2026-05-10",
        dias_atraso: 154,
        status: "aberto",
        id_fonte: "ID na fonte 004",
        sobreposto: true,
        atualizado_em: "2026-12-10 16:06:00",
    },
})

Record({
    $id: Now.ID["seed_debito_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        origem: "mpi_bigdata",
        tributo: "itcd",
        valor: 50814.13,
        vencimento: "2026-03-10",
        dias_atraso: 889,
        status: "regularizado",
        id_fonte: "ID na fonte 005",
        sobreposto: true,
        atualizado_em: "2026-11-02 14:21:00",
    },
})

Record({
    $id: Now.ID["seed_debito_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        origem: "itcd",
        tributo: "icms_st",
        valor: 90926.41,
        vencimento: "2026-06-02",
        dias_atraso: 203,
        status: "aberto",
        id_fonte: "ID na fonte 006",
        sobreposto: false,
        atualizado_em: "2026-09-09 08:17:00",
    },
})

Record({
    $id: Now.ID["seed_debito_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        origem: "mpi_bigdata",
        tributo: "icms_normal",
        valor: 71511,
        vencimento: "2026-10-24",
        dias_atraso: 167,
        status: "regularizado",
        id_fonte: "ID na fonte 007",
        sobreposto: true,
        atualizado_em: "2026-11-14 14:41:00",
    },
})

Record({
    $id: Now.ID["seed_debito_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        origem: "ipva",
        tributo: "icms_st",
        valor: 75758.01,
        vencimento: "2026-07-08",
        dias_atraso: 218,
        status: "aberto",
        id_fonte: "ID na fonte 008",
        sobreposto: true,
        atualizado_em: "2026-06-26 18:42:00",
    },
})

Record({
    $id: Now.ID["seed_debito_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        origem: "ipva",
        tributo: "itcd",
        valor: 32808.43,
        vencimento: "2026-07-25",
        dias_atraso: 824,
        status: "cancelado",
        id_fonte: "ID na fonte 009",
        sobreposto: false,
        atualizado_em: "2026-02-05 17:02:00",
    },
})

Record({
    $id: Now.ID["seed_debito_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        origem: "ipva",
        tributo: "icms_st",
        valor: 97683.35,
        vencimento: "2026-11-20",
        dias_atraso: 329,
        status: "aberto",
        id_fonte: "ID na fonte 010",
        sobreposto: false,
        atualizado_em: "2026-09-04 17:52:00",
    },
})

Record({
    $id: Now.ID["seed_debito_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        origem: "mpi_bigdata",
        tributo: "ipva",
        valor: 90144.01,
        vencimento: "2026-02-22",
        dias_atraso: 81,
        status: "cancelado",
        id_fonte: "ID na fonte 011",
        sobreposto: true,
        atualizado_em: "2026-11-08 18:18:00",
    },
})

Record({
    $id: Now.ID["seed_debito_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "TEL-004_registro_demo"),
        origem: "itcd",
        tributo: "icms_normal",
        valor: 70058.49,
        vencimento: "2026-12-01",
        dias_atraso: 988,
        status: "regularizado",
        id_fonte: "ID na fonte 012",
        sobreposto: false,
        atualizado_em: "2026-01-09 16:27:00",
    },
})

Record({
    $id: Now.ID["seed_debito_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        origem: "ccf",
        tributo: "ipva",
        valor: 87489.11,
        vencimento: "2026-12-28",
        dias_atraso: 632,
        status: "aberto",
        id_fonte: "ID na fonte 013",
        sobreposto: true,
        atualizado_em: "2026-11-29 09:13:00",
    },
})

Record({
    $id: Now.ID["seed_debito_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_002"),
        origem: "ipva",
        tributo: "icms_normal",
        valor: 34997.29,
        vencimento: "2026-01-29",
        dias_atraso: 682,
        status: "cancelado",
        id_fonte: "ID na fonte 014",
        sobreposto: true,
        atualizado_em: "2026-06-27 18:16:00",
    },
})

Record({
    $id: Now.ID["seed_debito_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        origem: "sne",
        tributo: "ipva",
        valor: 58149.45,
        vencimento: "2026-09-13",
        dias_atraso: 715,
        status: "regularizado",
        id_fonte: "ID na fonte 015",
        sobreposto: true,
        atualizado_em: "2026-10-08 12:30:00",
    },
})

Record({
    $id: Now.ID["seed_debito_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_022"),
        origem: "mpi_bigdata",
        tributo: "itcd",
        valor: 32128.85,
        vencimento: "2026-05-30",
        dias_atraso: 898,
        status: "cancelado",
        id_fonte: "ID na fonte 016",
        sobreposto: true,
        atualizado_em: "2026-02-12 11:59:00",
    },
})

Record({
    $id: Now.ID["seed_debito_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        origem: "mpi_bigdata",
        tributo: "itcd",
        valor: 4187.92,
        vencimento: "2026-03-17",
        dias_atraso: 625,
        status: "cancelado",
        id_fonte: "ID na fonte 017",
        sobreposto: false,
        atualizado_em: "2026-07-06 11:42:00",
    },
})

Record({
    $id: Now.ID["seed_debito_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        origem: "ipva",
        tributo: "icms_normal",
        valor: 10732.71,
        vencimento: "2026-03-31",
        dias_atraso: 915,
        status: "parcelado",
        id_fonte: "ID na fonte 018",
        sobreposto: false,
        atualizado_em: "2026-07-06 17:46:00",
    },
})

Record({
    $id: Now.ID["seed_debito_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_004"),
        origem: "sne",
        tributo: "icms_normal",
        valor: 17883.39,
        vencimento: "2026-12-26",
        dias_atraso: 579,
        status: "regularizado",
        id_fonte: "ID na fonte 019",
        sobreposto: true,
        atualizado_em: "2026-05-25 16:20:00",
    },
})

Record({
    $id: Now.ID["seed_debito_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        origem: "sne",
        tributo: "ipva",
        valor: 52343.15,
        vencimento: "2026-04-29",
        dias_atraso: 489,
        status: "regularizado",
        id_fonte: "ID na fonte 020",
        sobreposto: false,
        atualizado_em: "2026-02-26 13:43:00",
    },
})

Record({
    $id: Now.ID["seed_debito_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_018"),
        origem: "itcd",
        tributo: "icms_st",
        valor: 60668.65,
        vencimento: "2026-07-18",
        dias_atraso: 147,
        status: "regularizado",
        id_fonte: "ID na fonte 021",
        sobreposto: true,
        atualizado_em: "2026-04-15 18:23:00",
    },
})

Record({
    $id: Now.ID["seed_debito_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        origem: "sne",
        tributo: "icms_st",
        valor: 59118.13,
        vencimento: "2026-11-04",
        dias_atraso: 307,
        status: "aberto",
        id_fonte: "ID na fonte 022",
        sobreposto: false,
        atualizado_em: "2026-02-21 11:06:00",
    },
})

Record({
    $id: Now.ID["seed_debito_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        origem: "itcd",
        tributo: "icms_st",
        valor: 26017.42,
        vencimento: "2026-09-21",
        dias_atraso: 312,
        status: "cancelado",
        id_fonte: "ID na fonte 023",
        sobreposto: false,
        atualizado_em: "2026-09-28 11:20:00",
    },
})

Record({
    $id: Now.ID["seed_debito_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_031"),
        origem: "ccf",
        tributo: "itcd",
        valor: 29619.54,
        vencimento: "2026-09-01",
        dias_atraso: 937,
        status: "cancelado",
        id_fonte: "ID na fonte 024",
        sobreposto: true,
        atualizado_em: "2026-03-10 09:51:00",
    },
})

Record({
    $id: Now.ID["seed_debito_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        origem: "sne",
        tributo: "itcd",
        valor: 35566.18,
        vencimento: "2026-06-30",
        dias_atraso: 271,
        status: "cancelado",
        id_fonte: "ID na fonte 025",
        sobreposto: true,
        atualizado_em: "2026-11-22 15:59:00",
    },
})

Record({
    $id: Now.ID["seed_debito_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        origem: "mpi_bigdata",
        tributo: "icms_st",
        valor: 58576.02,
        vencimento: "2026-09-26",
        dias_atraso: 27,
        status: "parcelado",
        id_fonte: "ID na fonte 026",
        sobreposto: true,
        atualizado_em: "2026-05-24 16:46:00",
    },
})

Record({
    $id: Now.ID["seed_debito_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        origem: "sne",
        tributo: "itcd",
        valor: 27158.79,
        vencimento: "2026-04-01",
        dias_atraso: 838,
        status: "aberto",
        id_fonte: "ID na fonte 027",
        sobreposto: false,
        atualizado_em: "2026-02-08 17:34:00",
    },
})

Record({
    $id: Now.ID["seed_debito_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        origem: "ipva",
        tributo: "icms_st",
        valor: 20335.56,
        vencimento: "2026-12-04",
        dias_atraso: 784,
        status: "regularizado",
        id_fonte: "ID na fonte 028",
        sobreposto: true,
        atualizado_em: "2026-11-18 11:54:00",
    },
})

Record({
    $id: Now.ID["seed_debito_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        origem: "itcd",
        tributo: "icms_normal",
        valor: 16171.56,
        vencimento: "2026-07-02",
        dias_atraso: 451,
        status: "parcelado",
        id_fonte: "ID na fonte 029",
        sobreposto: true,
        atualizado_em: "2026-10-05 11:21:00",
    },
})

Record({
    $id: Now.ID["seed_debito_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        origem: "sne",
        tributo: "icms_st",
        valor: 63339.17,
        vencimento: "2026-02-26",
        dias_atraso: 781,
        status: "aberto",
        id_fonte: "ID na fonte 030",
        sobreposto: true,
        atualizado_em: "2026-12-29 12:53:00",
    },
})

Record({
    $id: Now.ID["seed_debito_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        origem: "sne",
        tributo: "icms_normal",
        valor: 48415.43,
        vencimento: "2026-02-21",
        dias_atraso: 970,
        status: "aberto",
        id_fonte: "ID na fonte 031",
        sobreposto: true,
        atualizado_em: "2026-12-05 09:39:00",
    },
})

Record({
    $id: Now.ID["seed_debito_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        origem: "ccf",
        tributo: "icms_st",
        valor: 68367.34,
        vencimento: "2026-10-30",
        dias_atraso: 10,
        status: "cancelado",
        id_fonte: "ID na fonte 032",
        sobreposto: true,
        atualizado_em: "2026-01-04 15:18:00",
    },
})

Record({
    $id: Now.ID["seed_debito_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_007"),
        origem: "ipva",
        tributo: "itcd",
        valor: 3955.55,
        vencimento: "2026-09-14",
        dias_atraso: 848,
        status: "aberto",
        id_fonte: "ID na fonte 033",
        sobreposto: false,
        atualizado_em: "2026-09-04 14:55:00",
    },
})

Record({
    $id: Now.ID["seed_debito_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        origem: "itcd",
        tributo: "itcd",
        valor: 33850.68,
        vencimento: "2026-10-17",
        dias_atraso: 910,
        status: "regularizado",
        id_fonte: "ID na fonte 034",
        sobreposto: true,
        atualizado_em: "2026-08-05 16:56:00",
    },
})

Record({
    $id: Now.ID["seed_debito_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        origem: "mpi_bigdata",
        tributo: "icms_normal",
        valor: 45406.57,
        vencimento: "2026-11-28",
        dias_atraso: 364,
        status: "parcelado",
        id_fonte: "ID na fonte 035",
        sobreposto: false,
        atualizado_em: "2026-03-01 08:36:00",
    },
})

Record({
    $id: Now.ID["seed_debito_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        origem: "ipva",
        tributo: "icms_normal",
        valor: 4956.85,
        vencimento: "2026-09-09",
        dias_atraso: 370,
        status: "aberto",
        id_fonte: "ID na fonte 036",
        sobreposto: false,
        atualizado_em: "2026-11-03 14:41:00",
    },
})

Record({
    $id: Now.ID["seed_debito_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_041"),
        origem: "sne",
        tributo: "icms_normal",
        valor: 26738.83,
        vencimento: "2026-02-24",
        dias_atraso: 489,
        status: "cancelado",
        id_fonte: "ID na fonte 037",
        sobreposto: true,
        atualizado_em: "2026-11-18 11:58:00",
    },
})

Record({
    $id: Now.ID["seed_debito_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_041"),
        origem: "itcd",
        tributo: "itcd",
        valor: 11132.11,
        vencimento: "2026-10-12",
        dias_atraso: 431,
        status: "aberto",
        id_fonte: "ID na fonte 038",
        sobreposto: false,
        atualizado_em: "2026-06-07 14:58:00",
    },
})

Record({
    $id: Now.ID["seed_debito_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        origem: "itcd",
        tributo: "icms_st",
        valor: 23805.33,
        vencimento: "2026-04-15",
        dias_atraso: 263,
        status: "aberto",
        id_fonte: "ID na fonte 039",
        sobreposto: true,
        atualizado_em: "2026-02-18 08:15:00",
    },
})

Record({
    $id: Now.ID["seed_debito_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        origem: "itcd",
        tributo: "itcd",
        valor: 89163.74,
        vencimento: "2026-10-15",
        dias_atraso: 68,
        status: "regularizado",
        id_fonte: "ID na fonte 040",
        sobreposto: false,
        atualizado_em: "2026-05-27 10:54:00",
    },
})

Record({
    $id: Now.ID["seed_debito_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_022"),
        origem: "sne",
        tributo: "ipva",
        valor: 53422.91,
        vencimento: "2026-04-02",
        dias_atraso: 203,
        status: "parcelado",
        id_fonte: "ID na fonte 041",
        sobreposto: true,
        atualizado_em: "2026-12-15 11:57:00",
    },
})

Record({
    $id: Now.ID["seed_debito_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        origem: "sne",
        tributo: "icms_st",
        valor: 25577.91,
        vencimento: "2026-09-17",
        dias_atraso: 234,
        status: "aberto",
        id_fonte: "ID na fonte 042",
        sobreposto: false,
        atualizado_em: "2026-02-23 13:55:00",
    },
})

Record({
    $id: Now.ID["seed_debito_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        origem: "ccf",
        tributo: "icms_normal",
        valor: 36019.03,
        vencimento: "2026-08-13",
        dias_atraso: 137,
        status: "regularizado",
        id_fonte: "ID na fonte 043",
        sobreposto: false,
        atualizado_em: "2026-10-07 17:21:00",
    },
})

Record({
    $id: Now.ID["seed_debito_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        origem: "sne",
        tributo: "ipva",
        valor: 7213.91,
        vencimento: "2026-08-30",
        dias_atraso: 908,
        status: "parcelado",
        id_fonte: "ID na fonte 044",
        sobreposto: false,
        atualizado_em: "2026-05-03 15:51:00",
    },
})

Record({
    $id: Now.ID["seed_debito_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_028"),
        origem: "mpi_bigdata",
        tributo: "ipva",
        valor: 32742.54,
        vencimento: "2026-09-05",
        dias_atraso: 656,
        status: "regularizado",
        id_fonte: "ID na fonte 045",
        sobreposto: true,
        atualizado_em: "2026-06-10 13:38:00",
    },
})

Record({
    $id: Now.ID["seed_debito_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        origem: "ccf",
        tributo: "icms_normal",
        valor: 38407.84,
        vencimento: "2026-06-19",
        dias_atraso: 261,
        status: "aberto",
        id_fonte: "ID na fonte 046",
        sobreposto: false,
        atualizado_em: "2026-04-24 18:36:00",
    },
})

Record({
    $id: Now.ID["seed_debito_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        origem: "ipva",
        tributo: "itcd",
        valor: 18.13,
        vencimento: "2026-06-14",
        dias_atraso: 818,
        status: "cancelado",
        id_fonte: "ID na fonte 047",
        sobreposto: true,
        atualizado_em: "2026-10-15 08:44:00",
    },
})

Record({
    $id: Now.ID["seed_debito_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        origem: "ccf",
        tributo: "itcd",
        valor: 78098.47,
        vencimento: "2026-08-24",
        dias_atraso: 161,
        status: "parcelado",
        id_fonte: "ID na fonte 048",
        sobreposto: false,
        atualizado_em: "2026-10-16 15:29:00",
    },
})

Record({
    $id: Now.ID["seed_debito_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_018"),
        origem: "sne",
        tributo: "itcd",
        valor: 50241.43,
        vencimento: "2026-01-04",
        dias_atraso: 186,
        status: "regularizado",
        id_fonte: "ID na fonte 049",
        sobreposto: true,
        atualizado_em: "2026-01-05 13:45:00",
    },
})

Record({
    $id: Now.ID["seed_debito_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        origem: "itcd",
        tributo: "ipva",
        valor: 36994.25,
        vencimento: "2026-04-01",
        dias_atraso: 893,
        status: "parcelado",
        id_fonte: "ID na fonte 050",
        sobreposto: false,
        atualizado_em: "2026-12-25 16:00:00",
    },
})
