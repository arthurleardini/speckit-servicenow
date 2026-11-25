// Seed manual da demo: casos qualificados do coordenador (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-24; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_demo_caso_001"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_003"),
        coordenador: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        estagio: "em_selecao",
        etapa_ordem: 1,
        prioridade: 5,
        score: 81.5,
        sem_score: false,
        valor_em_aberto: 44844.64,
        sinal_coercitivo: false,
    },
})

Record({
    $id: Now.ID["seed_demo_caso_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_006"),
        coordenador: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        estagio: "selecionado",
        etapa_ordem: 2,
        prioridade: 4,
        score: 74,
        sem_score: false,
        valor_em_aberto: 96203.12,
        sinal_coercitivo: false,
    },
})

Record({
    $id: Now.ID["seed_demo_caso_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_009"),
        coordenador: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        estagio: "dossie_gerado",
        etapa_ordem: 3,
        prioridade: 3,
        sem_score: true,
        valor_em_aberto: 75098.99,
        sinal_coercitivo: false,
    },
})

Record({
    $id: Now.ID["TEL-024_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_011"),
        coordenador: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        estagio: "conducao",
        etapa_ordem: 4,
        prioridade: 2,
        score: 68.2,
        sem_score: false,
        valor_em_aberto: 57341.48,
        sinal_coercitivo: true,
        sinal_coercitivo_desc: "Notificação de protesto ativa na CCF (fictícia)",
    },
})

Record({
    $id: Now.ID["seed_demo_caso_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_024"),
        coordenador: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        estagio: "conducao",
        etapa_ordem: 4,
        prioridade: 1,
        score: 59.9,
        sem_score: false,
        valor_em_aberto: 4167.49,
        sinal_coercitivo: false,
    },
})

Record({
    $id: Now.ID["seed_demo_caso_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_caso",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_025"),
        coordenador: Now.ref("sys_user", "usuario_demo_coordenador"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        estagio: "encerrado",
        etapa_ordem: 5,
        prioridade: 5,
        score: 77.3,
        sem_score: false,
        valor_em_aberto: 52337.19,
        sinal_coercitivo: false,
        motivo_encerramento: "regularizado",
        encerrado_em: "2026-11-21 15:00:00",
    },
})
