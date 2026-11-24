// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_comunicacao_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_031"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_045"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_005"),
        canal: "sne",
        status: "agendada",
        motivo: "Motivo 001",
        enviada_em: "2026-09-21 11:07:00",
        tentativas: 997,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_041"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        canal: "sms",
        status: "agendada",
        motivo: "Motivo 002",
        enviada_em: "2026-05-31 15:24:00",
        tentativas: 27,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_028"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_043"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_033"),
        canal: "email",
        status: "entregue",
        motivo: "Motivo 003",
        enviada_em: "2026-10-10 09:41:00",
        tentativas: 446,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_006"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_024"),
        canal: "sms",
        status: "falha",
        motivo: "Motivo 004",
        enviada_em: "2026-06-05 11:28:00",
        tentativas: 534,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_019"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_031"),
        canal: "whatsapp",
        status: "pulada",
        motivo: "Motivo 005",
        enviada_em: "2026-12-11 14:14:00",
        tentativas: 784,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_009"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_008"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_004"),
        canal: "sms",
        status: "entregue",
        motivo: "Motivo 006",
        enviada_em: "2026-08-31 09:37:00",
        tentativas: 198,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_050"),
        canal: "sms",
        status: "falha",
        motivo: "Motivo 007",
        enviada_em: "2026-10-13 10:32:00",
        tentativas: 638,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_004"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_047"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_010"),
        canal: "whatsapp",
        status: "falha",
        motivo: "Motivo 008",
        enviada_em: "2026-05-16 17:05:00",
        tentativas: 299,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_036"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_007"),
        canal: "email",
        status: "agendada",
        motivo: "Motivo 009",
        enviada_em: "2026-02-28 08:00:00",
        tentativas: 360,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_045"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        canal: "sne",
        status: "falha",
        motivo: "Motivo 010",
        enviada_em: "2026-04-02 17:27:00",
        tentativas: 424,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_026"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_014"),
        canal: "sms",
        status: "agendada",
        motivo: "Motivo 011",
        enviada_em: "2026-12-27 11:00:00",
        tentativas: 657,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_049"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_005"),
        canal: "whatsapp",
        status: "encerrada",
        motivo: "Motivo 012",
        enviada_em: "2026-09-28 16:24:00",
        tentativas: 645,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_025"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_023"),
        canal: "whatsapp",
        status: "encerrada",
        motivo: "Motivo 013",
        enviada_em: "2026-02-15 17:05:00",
        tentativas: 458,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_025"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_004"),
        canal: "sms",
        status: "enviada",
        motivo: "Motivo 014",
        enviada_em: "2026-11-27 15:31:00",
        tentativas: 992,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_033"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_009"),
        canal: "email",
        status: "enviada",
        motivo: "Motivo 015",
        enviada_em: "2026-03-19 08:58:00",
        tentativas: 619,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_008"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_034"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 016",
        enviada_em: "2026-10-25 08:16:00",
        tentativas: 323,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_039"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_048"),
        canal: "whatsapp",
        status: "agendada",
        motivo: "Motivo 017",
        enviada_em: "2026-05-06 18:03:00",
        tentativas: 29,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_031"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_023"),
        canal: "email",
        status: "enviada",
        motivo: "Motivo 018",
        enviada_em: "2026-08-28 13:43:00",
        tentativas: 379,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_026"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_009"),
        canal: "whatsapp",
        status: "enviada",
        motivo: "Motivo 019",
        enviada_em: "2026-12-31 15:57:00",
        tentativas: 494,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_037"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_002"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_048"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 020",
        enviada_em: "2026-04-13 13:35:00",
        tentativas: 757,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "TEL-004_registro_demo"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_002"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_024"),
        canal: "sms",
        status: "agendada",
        motivo: "Motivo 021",
        enviada_em: "2026-11-03 10:49:00",
        tentativas: 352,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_007"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_033"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_042"),
        canal: "sne",
        status: "falha",
        motivo: "Motivo 022",
        enviada_em: "2026-01-15 08:10:00",
        tentativas: 743,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_027"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_005"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 023",
        enviada_em: "2026-05-08 18:20:00",
        tentativas: 48,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_040"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_025"),
        canal: "sne",
        status: "enviada",
        motivo: "Motivo 024",
        enviada_em: "2026-05-29 18:38:00",
        tentativas: 680,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_035"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_002"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_023"),
        canal: "whatsapp",
        status: "pulada",
        motivo: "Motivo 025",
        enviada_em: "2026-04-28 12:51:00",
        tentativas: 931,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_011"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_041"),
        canal: "sms",
        status: "enviada",
        motivo: "Motivo 026",
        enviada_em: "2026-04-08 09:32:00",
        tentativas: 412,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_045"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        canal: "sne",
        status: "agendada",
        motivo: "Motivo 027",
        enviada_em: "2026-03-16 09:15:00",
        tentativas: 621,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_038"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_007"),
        canal: "email",
        status: "falha",
        motivo: "Motivo 028",
        enviada_em: "2026-12-14 18:31:00",
        tentativas: 216,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_036"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_048"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_037"),
        canal: "email",
        status: "falha",
        motivo: "Motivo 029",
        enviada_em: "2026-07-10 12:10:00",
        tentativas: 319,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_035"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_020"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_042"),
        canal: "sms",
        status: "entregue",
        motivo: "Motivo 030",
        enviada_em: "2026-09-28 18:03:00",
        tentativas: 823,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_024"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        canal: "whatsapp",
        status: "pulada",
        motivo: "Motivo 031",
        enviada_em: "2026-06-17 12:21:00",
        tentativas: 968,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_011"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_042"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 032",
        enviada_em: "2026-03-09 16:38:00",
        tentativas: 367,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_041"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_045"),
        canal: "sms",
        status: "falha",
        motivo: "Motivo 033",
        enviada_em: "2026-06-21 16:27:00",
        tentativas: 508,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_043"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_017"),
        canal: "email",
        status: "pulada",
        motivo: "Motivo 034",
        enviada_em: "2026-05-27 11:50:00",
        tentativas: 531,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_007"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_045"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_045"),
        canal: "sne",
        status: "entregue",
        motivo: "Motivo 035",
        enviada_em: "2026-10-22 16:20:00",
        tentativas: 559,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_031"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_028"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_024"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 036",
        enviada_em: "2026-12-20 14:14:00",
        tentativas: 810,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_016"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_006"),
        canal: "email",
        status: "entregue",
        motivo: "Motivo 037",
        enviada_em: "2026-12-21 14:07:00",
        tentativas: 453,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_035"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_035"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_017"),
        canal: "email",
        status: "entregue",
        motivo: "Motivo 038",
        enviada_em: "2026-08-27 15:00:00",
        tentativas: 915,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_002"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_013"),
        canal: "email",
        status: "falha",
        motivo: "Motivo 039",
        enviada_em: "2026-01-08 11:36:00",
        tentativas: 920,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_049"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_028"),
        canal: "email",
        status: "falha",
        motivo: "Motivo 040",
        enviada_em: "2026-12-30 17:06:00",
        tentativas: 681,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_037"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_007"),
        canal: "whatsapp",
        status: "enviada",
        motivo: "Motivo 041",
        enviada_em: "2026-09-20 10:43:00",
        tentativas: 123,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_043"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_026"),
        canal: "sms",
        status: "agendada",
        motivo: "Motivo 042",
        enviada_em: "2026-02-03 11:01:00",
        tentativas: 789,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_030"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_037"),
        canal: "email",
        status: "enviada",
        motivo: "Motivo 043",
        enviada_em: "2026-10-15 11:20:00",
        tentativas: 3,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_017"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_037"),
        canal: "whatsapp",
        status: "falha",
        motivo: "Motivo 044",
        enviada_em: "2026-09-23 17:28:00",
        tentativas: 813,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_009"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_007"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_011"),
        canal: "whatsapp",
        status: "falha",
        motivo: "Motivo 045",
        enviada_em: "2026-05-03 17:01:00",
        tentativas: 113,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_042"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_042"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 046",
        enviada_em: "2026-03-24 17:28:00",
        tentativas: 712,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_011"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_014"),
        canal: "whatsapp",
        status: "pulada",
        motivo: "Motivo 047",
        enviada_em: "2026-10-15 08:21:00",
        tentativas: 307,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_034"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_016"),
        canal: "sms",
        status: "entregue",
        motivo: "Motivo 048",
        enviada_em: "2026-05-21 15:05:00",
        tentativas: 146,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_028"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_006"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_034"),
        canal: "whatsapp",
        status: "pulada",
        motivo: "Motivo 049",
        enviada_em: "2026-03-30 13:26:00",
        tentativas: 317,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_048"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_005"),
        canal: "email",
        status: "encerrada",
        motivo: "Motivo 050",
        enviada_em: "2026-08-22 10:09:00",
        tentativas: 313,
    },
})
