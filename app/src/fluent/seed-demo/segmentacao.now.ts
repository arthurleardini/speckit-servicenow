// Seed manual da demo: carteira segmentada dos ciclos publicados (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_demo_segmentacao_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 95344.04,
        sem_score: true,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 37562.26,
        sem_score: true,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 40187.09,
        score_usado: 41.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 47533.5,
        score_usado: 78.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 32207.59,
        score_usado: 60.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 41426.54,
        score_usado: 42.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 80086.57,
        score_usado: 79.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 51591.47,
        score_usado: 61.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 13738.68,
        score_usado: 43.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 74222.23,
        score_usado: 80.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 4628.03,
        score_usado: 62.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 70740.61,
        score_usado: 44.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 87281.64,
        score_usado: 81.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 17437.97,
        score_usado: 63.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 13845.56,
        score_usado: 45.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 36659.28,
        score_usado: 82.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 90319.49,
        score_usado: 64.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_031"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 71786.35,
        score_usado: 46.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 28991.35,
        score_usado: 83.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 91736.44,
        score_usado: 65.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 62558.22,
        score_usado: 47.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 13372.42,
        score_usado: 84.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 18470.63,
        score_usado: 66.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 33202.53,
        score_usado: 48.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 90285.67,
        score_usado: 85.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 80024.95,
        score_usado: 67.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 67645.63,
        score_usado: 49.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "massificada",
        valor_em_aberto: 95607.67,
        score_usado: 86.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "qualificada",
        valor_em_aberto: 44844.64,
        score_usado: 68.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "qualificada",
        valor_em_aberto: 96203.12,
        score_usado: 50.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_009"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "qualificada",
        valor_em_aberto: 75098.99,
        sem_score: true,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_011"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "qualificada",
        valor_em_aberto: 57341.48,
        score_usado: 69.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "qualificada",
        valor_em_aberto: 4167.49,
        score_usado: 51.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "qualificada",
        valor_em_aberto: 52337.19,
        score_usado: 88.5,
        sem_score: false,
        estagio_funil: "regularizado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_002"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "controle",
        valor_em_aberto: 2669.28,
        score_usado: 70.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Sorteado para o grupo de controle do ciclo",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_004"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "controle",
        valor_em_aberto: 77104.52,
        score_usado: 52.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Sorteado para o grupo de controle do ciclo",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_007"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "controle",
        valor_em_aberto: 64642.3,
        score_usado: 89.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Sorteado para o grupo de controle do ciclo",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_013"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        segmento: "controle",
        valor_em_aberto: 47247.64,
        score_usado: 71.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Sorteado para o grupo de controle do ciclo",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 95344.04,
        sem_score: true,
        estagio_funil: "regularizado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 37562.26,
        score_usado: 90.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_041"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 40187.09,
        score_usado: 72.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_042"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 47533.5,
        score_usado: 54.5,
        sem_score: false,
        estagio_funil: "regularizado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_043"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 32207.59,
        score_usado: 91.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_044"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 41426.54,
        score_usado: 73.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_045"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 80086.57,
        score_usado: 55.5,
        sem_score: false,
        estagio_funil: "regularizado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_046"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 51591.47,
        score_usado: 92.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_047"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 13738.68,
        score_usado: 74.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_048"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 74222.23,
        score_usado: 56.5,
        sem_score: false,
        estagio_funil: "regularizado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_049"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 4628.03,
        score_usado: 93.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_050"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "massificada",
        valor_em_aberto: 70740.61,
        score_usado: 75.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor e atraso dentro da faixa da cobrança massificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_051"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_040"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "qualificada",
        valor_em_aberto: 66163.2,
        score_usado: 57.5,
        sem_score: false,
        estagio_funil: "regularizado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_052"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_041"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "qualificada",
        valor_em_aberto: 9245.1,
        score_usado: 94.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_053"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_043"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "qualificada",
        valor_em_aberto: 34495.72,
        score_usado: 76.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_054"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_047"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "qualificada",
        valor_em_aberto: 27804.11,
        score_usado: 58.5,
        sem_score: false,
        estagio_funil: "notificado",
        motivo: "Valor acima do limite da cobrança qualificada",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_055"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_018"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "controle",
        valor_em_aberto: 89562.08,
        score_usado: 40.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Sorteado para o grupo de controle do ciclo",
    },
})

Record({
    $id: Now.ID["seed_demo_segmentacao_056"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_segmentacao",
    data: {
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_022"),
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        segmento: "controle",
        valor_em_aberto: 7094.6,
        score_usado: 77.5,
        sem_score: false,
        estagio_funil: "identificado",
        motivo: "Sorteado para o grupo de controle do ciclo",
    },
})
