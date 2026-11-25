// Seed manual da demo: contatos da lista de cobrança ativa (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["TEL-035_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-25",
        ultimo_resultado: "sem_contato",
        tentativas: 1,
        prioridade: 5,
        valor_em_aberto: 95344.04,
        proxima_acao: "Retornar a ligação em 25/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_002"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-25",
        tentativas: 0,
        prioridade: 2,
        valor_em_aberto: 37562.26,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_003"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-25",
        tentativas: 0,
        prioridade: 5,
        valor_em_aberto: 80086.57,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_004"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-25",
        ultimo_resultado: "contato_efetivo",
        tentativas: 1,
        prioridade: 1,
        valor_em_aberto: 13738.68,
        proxima_acao: "Retornar a ligação em 25/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_005"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-25",
        tentativas: 0,
        prioridade: 4,
        valor_em_aberto: 74222.23,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_006"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "ligado",
        proxima_acao_em: "2026-12-02",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 1,
        prioridade: 4,
        valor_em_aberto: 70740.61,
        proxima_acao: "Conferir pagamento combinado em 02/12/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_007"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_023"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-26",
        tentativas: 0,
        prioridade: 5,
        valor_em_aberto: 87281.64,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_008"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_027"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-26",
        ultimo_resultado: "sem_contato",
        tentativas: 2,
        prioridade: 1,
        valor_em_aberto: 13845.56,
        proxima_acao: "Retornar a ligação em 26/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_009"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_029"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-27",
        tentativas: 0,
        prioridade: 2,
        valor_em_aberto: 36659.28,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_010"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_031"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-28",
        tentativas: 0,
        prioridade: 4,
        valor_em_aberto: 71786.35,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_011"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_033"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "encerrado",
        ultimo_resultado: "recusa",
        tentativas: 1,
        prioridade: 5,
        valor_em_aberto: 91736.44,
        motivo_encerramento: "recusa",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_012"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_039"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-29",
        ultimo_resultado: "contato_efetivo",
        tentativas: 1,
        prioridade: 1,
        valor_em_aberto: 13372.42,
        proxima_acao: "Retornar a ligação em 29/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_013"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_045"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-30",
        tentativas: 0,
        prioridade: 2,
        valor_em_aberto: 33202.53,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_014"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_049"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "ligado",
        proxima_acao_em: "2026-12-01",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 2,
        prioridade: 4,
        valor_em_aberto: 67645.63,
        proxima_acao: "Conferir pagamento combinado em 01/12/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_015"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-25",
        ultimo_resultado: "sem_contato",
        tentativas: 1,
        prioridade: 2,
        valor_em_aberto: 40187.09,
        proxima_acao: "Retornar a ligação em 25/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_016"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-25",
        tentativas: 0,
        prioridade: 3,
        valor_em_aberto: 47533.5,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_017"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-25",
        tentativas: 0,
        prioridade: 2,
        valor_em_aberto: 32207.59,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_018"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-25",
        ultimo_resultado: "contato_efetivo",
        tentativas: 1,
        prioridade: 2,
        valor_em_aberto: 41426.54,
        proxima_acao: "Retornar a ligação em 25/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_019"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-25",
        tentativas: 0,
        prioridade: 3,
        valor_em_aberto: 51591.47,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_020"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "ligado",
        proxima_acao_em: "2026-12-02",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 1,
        prioridade: 1,
        valor_em_aberto: 4628.03,
        proxima_acao: "Conferir pagamento combinado em 02/12/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_021"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_026"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-26",
        tentativas: 0,
        prioridade: 1,
        valor_em_aberto: 17437.97,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_022"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_030"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-26",
        ultimo_resultado: "sem_contato",
        tentativas: 2,
        prioridade: 5,
        valor_em_aberto: 90319.49,
        proxima_acao: "Retornar a ligação em 26/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_023"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_032"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-27",
        tentativas: 0,
        prioridade: 2,
        valor_em_aberto: 28991.35,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_024"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_038"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-28",
        tentativas: 0,
        prioridade: 4,
        valor_em_aberto: 62558.22,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_025"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_042"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "encerrado",
        ultimo_resultado: "recusa",
        tentativas: 1,
        prioridade: 1,
        valor_em_aberto: 18470.63,
        motivo_encerramento: "recusa",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_026"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_046"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "retornar",
        proxima_acao_em: "2026-11-29",
        ultimo_resultado: "contato_efetivo",
        tentativas: 1,
        prioridade: 5,
        valor_em_aberto: 90285.67,
        proxima_acao: "Retornar a ligação em 29/11/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_027"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_048"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "a_ligar",
        proxima_acao_em: "2026-11-30",
        tentativas: 0,
        prioridade: 5,
        valor_em_aberto: 80024.95,
        proxima_acao: "Ligar e registrar o resultado",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_028"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_050"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "ligado",
        proxima_acao_em: "2026-12-01",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 2,
        prioridade: 5,
        valor_em_aberto: 95607.67,
        proxima_acao: "Conferir pagamento combinado em 01/12/2026",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_029"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 1,
        prioridade: 5,
        valor_em_aberto: 95344.04,
        motivo_encerramento: "regularizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_030"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "contato_efetivo",
        tentativas: 1,
        prioridade: 2,
        valor_em_aberto: 37562.26,
        motivo_encerramento: "contato_realizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_031"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "sem_contato",
        tentativas: 3,
        prioridade: 2,
        valor_em_aberto: 40187.09,
        motivo_encerramento: "sem_contato",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_032"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_010"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 2,
        prioridade: 3,
        valor_em_aberto: 47533.5,
        motivo_encerramento: "regularizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_033"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_012"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "recusa",
        tentativas: 1,
        prioridade: 2,
        valor_em_aberto: 32207.59,
        motivo_encerramento: "recusa",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_034"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_014"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "contato_efetivo",
        tentativas: 2,
        prioridade: 2,
        valor_em_aberto: 41426.54,
        motivo_encerramento: "contato_realizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_035"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_015"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 1,
        prioridade: 5,
        valor_em_aberto: 80086.57,
        motivo_encerramento: "regularizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_036"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_016"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "contato_efetivo",
        tentativas: 1,
        prioridade: 3,
        valor_em_aberto: 51591.47,
        motivo_encerramento: "contato_realizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_037"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_017"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "sem_contato",
        tentativas: 3,
        prioridade: 1,
        valor_em_aberto: 13738.68,
        motivo_encerramento: "sem_contato",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_038"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_019"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "promessa_pagamento",
        tentativas: 2,
        prioridade: 4,
        valor_em_aberto: 74222.23,
        motivo_encerramento: "regularizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_039"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_020"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "recusa",
        tentativas: 1,
        prioridade: 1,
        valor_em_aberto: 4628.03,
        motivo_encerramento: "recusa",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["seed_demo_contato_040"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_contato",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_021"),
        atendente: Now.ref("sys_user", "usuario_demo_atendente"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "seed_demo_ciclo_encerrado"),
        status: "encerrado",
        ultimo_resultado: "contato_efetivo",
        tentativas: 2,
        prioridade: 4,
        valor_em_aberto: 70740.61,
        motivo_encerramento: "contato_realizado",
        proxima_acao: "Nada a fazer (encerrado)",
    },
})
