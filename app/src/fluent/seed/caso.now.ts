// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_caso_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_017"),
        estagio: "selecionado",
        prioridade: 916,
        score: 96961.25,
        sem_score: true,
        valor_em_aberto: 66446.08,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 001",
        motivo_encerramento: "outro",
        encerrado_em: "2026-07-22 17:50:00",
    },
})

Record({
    $id: Now.ID["seed_caso_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_028"),
        estagio: "selecionado",
        prioridade: 198,
        score: 56330.57,
        sem_score: false,
        valor_em_aberto: 63543.9,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 002",
        motivo_encerramento: "outro",
        encerrado_em: "2026-12-16 17:28:00",
    },
})

Record({
    $id: Now.ID["seed_caso_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_022"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_018"),
        estagio: "conducao",
        prioridade: 962,
        score: 42143.79,
        sem_score: false,
        valor_em_aberto: 41764.82,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 003",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-04-27 15:52:00",
    },
})

Record({
    $id: Now.ID["seed_caso_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_030"),
        estagio: "em_selecao",
        prioridade: 217,
        score: 71577.84,
        sem_score: false,
        valor_em_aberto: 4794.05,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 004",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-08-27 17:57:00",
    },
})

Record({
    $id: Now.ID["seed_caso_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_022"),
        estagio: "dossie_gerado",
        prioridade: 472,
        score: 76262.01,
        sem_score: true,
        valor_em_aberto: 16033.25,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 005",
        motivo_encerramento: "outro",
        encerrado_em: "2026-08-15 14:43:00",
    },
})

Record({
    $id: Now.ID["seed_caso_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_018"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_008"),
        estagio: "dossie_gerado",
        prioridade: 400,
        score: 31092.97,
        sem_score: true,
        valor_em_aberto: 70602.47,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 006",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-02-11 11:19:00",
    },
})

Record({
    $id: Now.ID["seed_caso_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_013"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_028"),
        estagio: "dossie_gerado",
        prioridade: 486,
        score: 43204.48,
        sem_score: true,
        valor_em_aberto: 83418.5,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 007",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-04-10 12:27:00",
    },
})

Record({
    $id: Now.ID["seed_caso_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_040"),
        estagio: "selecionado",
        prioridade: 432,
        score: 38153.57,
        sem_score: true,
        valor_em_aberto: 8666.66,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 008",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-09-28 10:45:00",
    },
})

Record({
    $id: Now.ID["seed_caso_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_011"),
        estagio: "encerrado",
        prioridade: 807,
        score: 34878.75,
        sem_score: false,
        valor_em_aberto: 78527.4,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 009",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-11-03 18:16:00",
    },
})

Record({
    $id: Now.ID["seed_caso_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_013"),
        estagio: "em_selecao",
        prioridade: 450,
        score: 6026.98,
        sem_score: false,
        valor_em_aberto: 84937.98,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 010",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-12-29 16:51:00",
    },
})

Record({
    $id: Now.ID["seed_caso_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_008"),
        estagio: "em_selecao",
        prioridade: 522,
        score: 65912.23,
        sem_score: true,
        valor_em_aberto: 31577.05,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 011",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-02-08 13:34:00",
    },
})

Record({
    $id: Now.ID["seed_caso_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_049"),
        estagio: "selecionado",
        prioridade: 580,
        score: 14162.93,
        sem_score: false,
        valor_em_aberto: 65900.58,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 012",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-07-01 14:55:00",
    },
})

Record({
    $id: Now.ID["seed_caso_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_037"),
        estagio: "dossie_gerado",
        prioridade: 883,
        score: 16959.82,
        sem_score: true,
        valor_em_aberto: 44670.11,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 013",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-01-11 15:19:00",
    },
})

Record({
    $id: Now.ID["seed_caso_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_018"),
        estagio: "encerrado",
        prioridade: 498,
        score: 72955.2,
        sem_score: true,
        valor_em_aberto: 88548.79,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 014",
        motivo_encerramento: "outro",
        encerrado_em: "2026-04-17 18:44:00",
    },
})

Record({
    $id: Now.ID["seed_caso_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_045"),
        estagio: "dossie_gerado",
        prioridade: 621,
        score: 9262.61,
        sem_score: false,
        valor_em_aberto: 13529.75,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 015",
        motivo_encerramento: "outro",
        encerrado_em: "2026-01-02 10:09:00",
    },
})

Record({
    $id: Now.ID["seed_caso_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_014"),
        estagio: "conducao",
        prioridade: 693,
        score: 56257.22,
        sem_score: true,
        valor_em_aberto: 38766.95,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 016",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-02-11 10:52:00",
    },
})

Record({
    $id: Now.ID["seed_caso_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_015"),
        estagio: "em_selecao",
        prioridade: 436,
        score: 92011.92,
        sem_score: true,
        valor_em_aberto: 86766.1,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 017",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-06-29 18:57:00",
    },
})

Record({
    $id: Now.ID["seed_caso_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_016"),
        estagio: "dossie_gerado",
        prioridade: 105,
        score: 19211.07,
        sem_score: true,
        valor_em_aberto: 50968.43,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 018",
        motivo_encerramento: "outro",
        encerrado_em: "2026-03-24 18:27:00",
    },
})

Record({
    $id: Now.ID["seed_caso_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_001"),
        estagio: "em_selecao",
        prioridade: 725,
        score: 46276.66,
        sem_score: true,
        valor_em_aberto: 97847.32,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 019",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-01-22 17:39:00",
    },
})

Record({
    $id: Now.ID["seed_caso_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_007"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_011"),
        estagio: "selecionado",
        prioridade: 103,
        score: 82447.66,
        sem_score: true,
        valor_em_aberto: 53321.74,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 020",
        motivo_encerramento: "outro",
        encerrado_em: "2026-03-27 10:24:00",
    },
})

Record({
    $id: Now.ID["seed_caso_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_003"),
        estagio: "dossie_gerado",
        prioridade: 74,
        score: 10378.02,
        sem_score: false,
        valor_em_aberto: 30185.92,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 021",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-12-05 10:30:00",
    },
})

Record({
    $id: Now.ID["seed_caso_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_015"),
        estagio: "dossie_gerado",
        prioridade: 868,
        score: 17737.93,
        sem_score: true,
        valor_em_aberto: 71244.83,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 022",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-05-25 15:45:00",
    },
})

Record({
    $id: Now.ID["seed_caso_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_039"),
        estagio: "encerrado",
        prioridade: 869,
        score: 1958.06,
        sem_score: false,
        valor_em_aberto: 53871.84,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 023",
        motivo_encerramento: "outro",
        encerrado_em: "2026-11-21 13:14:00",
    },
})

Record({
    $id: Now.ID["seed_caso_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_045"),
        estagio: "selecionado",
        prioridade: 32,
        score: 60901.96,
        sem_score: false,
        valor_em_aberto: 40492.19,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 024",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-06-02 15:01:00",
    },
})

Record({
    $id: Now.ID["seed_caso_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_035"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_007"),
        estagio: "encerrado",
        prioridade: 528,
        score: 47254.67,
        sem_score: false,
        valor_em_aberto: 69075.93,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 025",
        motivo_encerramento: "outro",
        encerrado_em: "2026-02-08 16:26:00",
    },
})

Record({
    $id: Now.ID["seed_caso_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_041"),
        estagio: "dossie_gerado",
        prioridade: 45,
        score: 41630.96,
        sem_score: false,
        valor_em_aberto: 67490.51,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 026",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-01-14 18:17:00",
    },
})

Record({
    $id: Now.ID["seed_caso_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_046"),
        estagio: "dossie_gerado",
        prioridade: 493,
        score: 10079.55,
        sem_score: false,
        valor_em_aberto: 60094.42,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 027",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-07-02 09:51:00",
    },
})

Record({
    $id: Now.ID["seed_caso_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_032"),
        estagio: "em_selecao",
        prioridade: 704,
        score: 18498.01,
        sem_score: false,
        valor_em_aberto: 63756.12,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 028",
        motivo_encerramento: "outro",
        encerrado_em: "2026-11-07 08:48:00",
    },
})

Record({
    $id: Now.ID["seed_caso_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_040"),
        estagio: "dossie_gerado",
        prioridade: 497,
        score: 16720.78,
        sem_score: true,
        valor_em_aberto: 49508.41,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 029",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-04-17 15:01:00",
    },
})

Record({
    $id: Now.ID["seed_caso_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_049"),
        estagio: "encerrado",
        prioridade: 867,
        score: 88190.24,
        sem_score: false,
        valor_em_aberto: 75321.63,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 030",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-10-04 13:32:00",
    },
})

Record({
    $id: Now.ID["seed_caso_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_010"),
        estagio: "encerrado",
        prioridade: 891,
        score: 14779.3,
        sem_score: true,
        valor_em_aberto: 65999.1,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 031",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-10-12 10:26:00",
    },
})

Record({
    $id: Now.ID["seed_caso_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_039"),
        estagio: "encerrado",
        prioridade: 774,
        score: 10539.5,
        sem_score: false,
        valor_em_aberto: 93307.4,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 032",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-07-29 09:56:00",
    },
})

Record({
    $id: Now.ID["seed_caso_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_014"),
        estagio: "selecionado",
        prioridade: 841,
        score: 6063,
        sem_score: true,
        valor_em_aberto: 39371.73,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 033",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-05-17 09:18:00",
    },
})

Record({
    $id: Now.ID["seed_caso_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_041"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_046"),
        estagio: "selecionado",
        prioridade: 329,
        score: 39049.43,
        sem_score: true,
        valor_em_aberto: 88363.36,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 034",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-07-14 11:45:00",
    },
})

Record({
    $id: Now.ID["seed_caso_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_048"),
        estagio: "em_selecao",
        prioridade: 560,
        score: 44567.7,
        sem_score: false,
        valor_em_aberto: 72913.99,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 035",
        motivo_encerramento: "outro",
        encerrado_em: "2026-09-01 11:00:00",
    },
})

Record({
    $id: Now.ID["seed_caso_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_002"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_017"),
        estagio: "em_selecao",
        prioridade: 40,
        score: 77347.68,
        sem_score: false,
        valor_em_aberto: 79822.57,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 036",
        motivo_encerramento: "outro",
        encerrado_em: "2026-03-25 10:31:00",
    },
})

Record({
    $id: Now.ID["seed_caso_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_009"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_008"),
        estagio: "dossie_gerado",
        prioridade: 462,
        score: 7161.12,
        sem_score: true,
        valor_em_aberto: 75112.78,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 037",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-05-20 12:20:00",
    },
})

Record({
    $id: Now.ID["seed_caso_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_034"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_048"),
        estagio: "encerrado",
        prioridade: 342,
        score: 5116.36,
        sem_score: false,
        valor_em_aberto: 8430.27,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 038",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-02-02 16:18:00",
    },
})

Record({
    $id: Now.ID["seed_caso_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_033"),
        estagio: "conducao",
        prioridade: 729,
        score: 67255.53,
        sem_score: true,
        valor_em_aberto: 65719.23,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 039",
        motivo_encerramento: "outro",
        encerrado_em: "2026-08-03 13:18:00",
    },
})

Record({
    $id: Now.ID["seed_caso_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_011"),
        estagio: "selecionado",
        prioridade: 674,
        score: 56358.21,
        sem_score: false,
        valor_em_aberto: 87497.04,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 040",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-09-08 14:05:00",
    },
})

Record({
    $id: Now.ID["seed_caso_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_040"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_019"),
        estagio: "encerrado",
        prioridade: 78,
        score: 62222.24,
        sem_score: false,
        valor_em_aberto: 28748.62,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 041",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-07-01 15:14:00",
    },
})

Record({
    $id: Now.ID["seed_caso_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_029"),
        estagio: "selecionado",
        prioridade: 132,
        score: 9149.34,
        sem_score: true,
        valor_em_aberto: 26306.65,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 042",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-11-30 09:34:00",
    },
})

Record({
    $id: Now.ID["seed_caso_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_033"),
        estagio: "selecionado",
        prioridade: 233,
        score: 63596.05,
        sem_score: false,
        valor_em_aberto: 55152.39,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 043",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-05-23 12:24:00",
    },
})

Record({
    $id: Now.ID["seed_caso_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_016"),
        estagio: "selecionado",
        prioridade: 957,
        score: 90524.51,
        sem_score: true,
        valor_em_aberto: 70721.61,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 044",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-05-25 10:49:00",
    },
})

Record({
    $id: Now.ID["seed_caso_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_050"),
        estagio: "conducao",
        prioridade: 818,
        score: 33310.25,
        sem_score: false,
        valor_em_aberto: 32286.57,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 045",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-04-02 16:59:00",
    },
})

Record({
    $id: Now.ID["seed_caso_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "TEL-004_registro_demo"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_036"),
        estagio: "selecionado",
        prioridade: 473,
        score: 94726.51,
        sem_score: true,
        valor_em_aberto: 26068.33,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 046",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-05-25 18:55:00",
    },
})

Record({
    $id: Now.ID["seed_caso_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_002"),
        estagio: "dossie_gerado",
        prioridade: 396,
        score: 59350.03,
        sem_score: true,
        valor_em_aberto: 91458.18,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 047",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-10-10 11:42:00",
    },
})

Record({
    $id: Now.ID["seed_caso_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        atendente: Now.ref("sys_user", "usuario_demo_admin"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_026"),
        estagio: "em_selecao",
        prioridade: 159,
        score: 33033.8,
        sem_score: false,
        valor_em_aberto: 11139.39,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 048",
        motivo_encerramento: "esgotado",
        encerrado_em: "2026-03-04 15:23:00",
    },
})

Record({
    $id: Now.ID["seed_caso_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_036"),
        estagio: "selecionado",
        prioridade: 230,
        score: 49625.01,
        sem_score: true,
        valor_em_aberto: 62430.68,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 049",
        motivo_encerramento: "outro",
        encerrado_em: "2026-02-22 13:45:00",
    },
})

Record({
    $id: Now.ID["seed_caso_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_011"),
        estagio: "encerrado",
        prioridade: 29,
        score: 10566.72,
        sem_score: true,
        valor_em_aberto: 91219.55,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Sinalização coercitiva (descrição) 050",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-03-18 17:24:00",
    },
})

Record({
    $id: Now.ID["TEL-024_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        atendente: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_ciclo_009"),
        estagio: "selecionado",
        prioridade: 350,
        score: 80914.95,
        sem_score: true,
        valor_em_aberto: 39425.46,
        sinal_coercitivo: false,
        sinal_coercitivo_desc: "Registro demo TEL-024",
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-09-14 18:22:00",
    },
})
