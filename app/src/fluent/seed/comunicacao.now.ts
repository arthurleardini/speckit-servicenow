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
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_029"),
        canal: "email",
        status: "pulada",
        motivo: "Motivo 001",
        enviada_em: "2026-04-22 09:59:00",
        tentativas: 556,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_041"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_032"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_013"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_001"),
        canal: "sms",
        status: "pulada",
        motivo: "Motivo 002",
        enviada_em: "2026-05-31 08:32:00",
        tentativas: 840,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_005"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_020"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_040"),
        canal: "email",
        status: "pulada",
        motivo: "Motivo 003",
        enviada_em: "2026-06-12 09:06:00",
        tentativas: 467,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_031"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_022"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_015"),
        canal: "sms",
        status: "falha",
        motivo: "Motivo 004",
        enviada_em: "2026-04-15 11:36:00",
        tentativas: 827,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_040"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_049"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_029"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_013"),
        canal: "whatsapp",
        status: "agendada",
        motivo: "Motivo 005",
        enviada_em: "2026-02-25 08:27:00",
        tentativas: 398,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_006"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_011"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 006",
        enviada_em: "2026-12-25 11:37:00",
        tentativas: 781,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_013"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_028"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_004"),
        canal: "whatsapp",
        status: "enviada",
        motivo: "Motivo 007",
        enviada_em: "2026-11-26 14:22:00",
        tentativas: 852,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_016"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_003"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_036"),
        canal: "email",
        status: "agendada",
        motivo: "Motivo 008",
        enviada_em: "2026-02-16 09:02:00",
        tentativas: 6,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_014"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_044"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_033"),
        canal: "sne",
        status: "falha",
        motivo: "Motivo 009",
        enviada_em: "2026-04-02 17:27:00",
        tentativas: 424,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_026"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_014"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_019"),
        canal: "email",
        status: "encerrada",
        motivo: "Motivo 010",
        enviada_em: "2026-05-03 08:39:00",
        tentativas: 687,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_005"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_050"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_049"),
        canal: "sne",
        status: "pulada",
        motivo: "Motivo 011",
        enviada_em: "2026-05-29 15:33:00",
        tentativas: 478,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_049"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_043"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_007"),
        canal: "whatsapp",
        status: "agendada",
        motivo: "Motivo 012",
        enviada_em: "2026-06-17 09:29:00",
        tentativas: 65,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_010"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_046"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_033"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 013",
        enviada_em: "2026-10-01 14:10:00",
        tentativas: 149,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_011"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_001"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_050"),
        canal: "sne",
        status: "falha",
        motivo: "Motivo 014",
        enviada_em: "2026-02-23 15:56:00",
        tentativas: 354,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_005"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_014"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_017"),
        canal: "whatsapp",
        status: "pulada",
        motivo: "Motivo 015",
        enviada_em: "2026-12-15 17:08:00",
        tentativas: 345,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "TEL-004_registro_demo"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_003"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_002"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_045"),
        canal: "sne",
        status: "entregue",
        motivo: "Motivo 016",
        enviada_em: "2026-03-08 10:39:00",
        tentativas: 514,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_037"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_020"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_037"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_026"),
        canal: "email",
        status: "pulada",
        motivo: "Motivo 017",
        enviada_em: "2026-04-19 18:42:00",
        tentativas: 959,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_037"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_002"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_048"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 018",
        enviada_em: "2026-04-13 13:35:00",
        tentativas: 757,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "TEL-004_registro_demo"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_002"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_024"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_024"),
        canal: "email",
        status: "encerrada",
        motivo: "Motivo 019",
        enviada_em: "2026-04-09 17:21:00",
        tentativas: 131,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_043"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_026"),
        canal: "email",
        status: "agendada",
        motivo: "Motivo 020",
        enviada_em: "2026-03-07 16:34:00",
        tentativas: 519,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_033"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_050"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_018"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 021",
        enviada_em: "2026-01-18 11:46:00",
        tentativas: 500,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_013"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_021"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_049"),
        canal: "sne",
        status: "pulada",
        motivo: "Motivo 022",
        enviada_em: "2026-09-03 08:26:00",
        tentativas: 795,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_017"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_020"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_044"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 023",
        enviada_em: "2026-03-14 16:21:00",
        tentativas: 233,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_006"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_028"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_022"),
        canal: "email",
        status: "encerrada",
        motivo: "Motivo 024",
        enviada_em: "2026-08-18 14:07:00",
        tentativas: 204,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_014"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_010"),
        canal: "sne",
        status: "agendada",
        motivo: "Motivo 025",
        enviada_em: "2026-01-18 15:57:00",
        tentativas: 998,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_012"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_036"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_048"),
        canal: "sne",
        status: "enviada",
        motivo: "Motivo 026",
        enviada_em: "2026-07-19 13:23:00",
        tentativas: 174,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_035"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_019"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_043"),
        canal: "sms",
        status: "entregue",
        motivo: "Motivo 027",
        enviada_em: "2026-09-28 18:03:00",
        tentativas: 823,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_024"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        canal: "sne",
        status: "entregue",
        motivo: "Motivo 028",
        enviada_em: "2026-06-11 12:58:00",
        tentativas: 81,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_011"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_043"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_041"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_021"),
        canal: "email",
        status: "pulada",
        motivo: "Motivo 029",
        enviada_em: "2026-08-23 12:57:00",
        tentativas: 786,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_021"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_029"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_024"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 030",
        enviada_em: "2026-07-05 13:49:00",
        tentativas: 327,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_009"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_040"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_021"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_018"),
        canal: "whatsapp",
        status: "falha",
        motivo: "Motivo 031",
        enviada_em: "2026-02-13 17:52:00",
        tentativas: 614,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_018"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_042"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_041"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_018"),
        canal: "sne",
        status: "falha",
        motivo: "Motivo 032",
        enviada_em: "2026-07-15 13:54:00",
        tentativas: 390,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_029"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_013"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_042"),
        canal: "sne",
        status: "enviada",
        motivo: "Motivo 033",
        enviada_em: "2026-02-11 09:29:00",
        tentativas: 971,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_031"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_007"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_023"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_035"),
        canal: "sne",
        status: "entregue",
        motivo: "Motivo 034",
        enviada_em: "2026-02-17 12:39:00",
        tentativas: 651,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_047"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_030"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_002"),
        canal: "sms",
        status: "enviada",
        motivo: "Motivo 035",
        enviada_em: "2026-08-14 08:21:00",
        tentativas: 607,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_047"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_010"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_048"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_029"),
        canal: "email",
        status: "falha",
        motivo: "Motivo 036",
        enviada_em: "2026-12-30 17:06:00",
        tentativas: 681,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_037"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_007"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_040"),
        canal: "sms",
        status: "pulada",
        motivo: "Motivo 037",
        enviada_em: "2026-03-30 15:07:00",
        tentativas: 969,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_027"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_019"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_003"),
        canal: "email",
        status: "enviada",
        motivo: "Motivo 038",
        enviada_em: "2026-01-09 16:27:00",
        tentativas: 576,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_037"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_007"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_014"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_041"),
        canal: "sms",
        status: "entregue",
        motivo: "Motivo 039",
        enviada_em: "2026-01-01 12:19:00",
        tentativas: 720,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_032"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_037"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_046"),
        canal: "sms",
        status: "pulada",
        motivo: "Motivo 040",
        enviada_em: "2026-03-05 09:12:00",
        tentativas: 762,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_018"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_046"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_001"),
        canal: "email",
        status: "encerrada",
        motivo: "Motivo 041",
        enviada_em: "2026-10-22 17:34:00",
        tentativas: 905,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_045"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_025"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_037"),
        canal: "email",
        status: "enviada",
        motivo: "Motivo 042",
        enviada_em: "2026-04-09 16:49:00",
        tentativas: 789,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_004"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_019"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_016"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_034"),
        canal: "sne",
        status: "enviada",
        motivo: "Motivo 043",
        enviada_em: "2026-06-15 12:23:00",
        tentativas: 657,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_008"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_028"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_006"),
        canal: "sne",
        status: "encerrada",
        motivo: "Motivo 044",
        enviada_em: "2026-09-10 10:30:00",
        tentativas: 439,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_038"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_047"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_005"),
        canal: "email",
        status: "encerrada",
        motivo: "Motivo 045",
        enviada_em: "2026-08-22 10:09:00",
        tentativas: 313,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_036"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_024"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_016"),
        canal: "sms",
        status: "falha",
        motivo: "Motivo 046",
        enviada_em: "2026-09-04 16:44:00",
        tentativas: 172,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_028"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_032"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_045"),
        canal: "email",
        status: "falha",
        motivo: "Motivo 047",
        enviada_em: "2026-09-07 12:09:00",
        tentativas: 418,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_023"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_031"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_024"),
        canal: "email",
        status: "enviada",
        motivo: "Motivo 048",
        enviada_em: "2026-03-06 14:00:00",
        tentativas: 216,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_021"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_001"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_021"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 049",
        enviada_em: "2026-06-09 12:21:00",
        tentativas: 717,
    },
})

Record({
    $id: Now.ID["seed_comunicacao_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_029"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_044"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_021"),
        canal: "whatsapp",
        status: "entregue",
        motivo: "Motivo 050",
        enviada_em: "2026-06-07 13:09:00",
        tentativas: 817,
    },
})
