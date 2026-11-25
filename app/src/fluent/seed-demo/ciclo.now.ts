// Seed manual da demo: ciclos de qualificação (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_demo_ciclo_encerrado"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_ciclo",
    data: {
        nome: "Ciclo 2026-10",
        referencia: "2026-10-01",
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_004"),
        estado: "encerrado",
        qtd_elegiveis: 18,
        semente_sorteio: 20261001,
        qtd_massificada: 12,
        qtd_qualificada: 4,
        qtd_controle: 2,
        qtd_sem_score: 1,
        taxa_cobrada: 23.4,
        taxa_controle: 15.1,
        efeito_incremental: 8.3,
        publicado_em: "2026-10-01 12:00:00",
        publicado_por: Now.ref("sys_user", "usuario_demo_coordenador"),
        distribuido_em: "2026-10-01 13:00:00",
        qtd_contatos: 12,
        proxima_acao: "Nada a fazer (encerrado)",
    },
})

Record({
    $id: Now.ID["TEL-009_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_ciclo",
    data: {
        nome: "Ciclo 2026-11",
        referencia: "2026-11-01",
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        estado: "publicado",
        qtd_elegiveis: 38,
        semente_sorteio: 20261101,
        qtd_massificada: 28,
        qtd_qualificada: 6,
        qtd_controle: 4,
        qtd_sem_score: 3,
        taxa_cobrada: 2.9,
        taxa_controle: 0,
        efeito_incremental: 2.9,
        publicado_em: "2026-11-01 12:00:00",
        publicado_por: Now.ref("sys_user", "usuario_demo_coordenador"),
        distribuido_em: "2026-11-01 13:00:00",
        qtd_contatos: 28,
        proxima_acao: "Acompanhar a lista",
    },
})

Record({
    $id: Now.ID["seed_demo_ciclo_previa"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_ciclo",
    data: {
        nome: "Ciclo 2026-12",
        referencia: "2026-12-01",
        criterio: Now.ref("x_2326104_cob_criterio", "seed_criterio_001"),
        estado: "previa",
        proxima_acao: "Publicar ciclo",
    },
})
