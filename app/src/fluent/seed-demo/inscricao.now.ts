// Seed manual da demo: inscrição demo da TEL-038, com comunicações e retornos de envio (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["TEL-038_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_inscricao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        status: "encerrada",
        etapa_atual: 2,
        iniciada_em: "2026-11-13 09:00:00",
        proxima_etapa_em: "2026-12-03 09:00:00",
        encerrada_em: "2026-11-24 15:00:00",
        motivo_encerramento: "regularizado",
    },
})

Record({
    $id: Now.ID["seed_demo_comunicacao_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_ipva_1"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        inscricao: Now.ref("x_2326104_cob_regua_inscricao", "TEL-038_registro_demo"),
        canal: "sne",
        status: "entregue",
        motivo: "Etapa 1 entregue por SNE",
        enviada_em: "2026-11-13 09:00:00",
        tentativas: 1,
    },
})

Record({
    $id: Now.ID["seed_demo_comunicacao_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_comunicacao",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        etapa: Now.ref("x_2326104_cob_regua_etapa", "seed_regua_etapa_ipva_2"),
        ciclo: Now.ref("x_2326104_cob_ciclo", "TEL-009_registro_demo"),
        inscricao: Now.ref("x_2326104_cob_regua_inscricao", "TEL-038_registro_demo"),
        canal: "email",
        status: "entregue",
        motivo: "Etapa 2 entregue por e-mail",
        enviada_em: "2026-11-23 09:00:00",
        tentativas: 1,
    },
})

Record({
    $id: Now.ID["seed_demo_envio_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_demo_comunicacao_1"),
        inscricao: Now.ref("x_2326104_cob_regua_inscricao", "TEL-038_registro_demo"),
        canal: "sne",
        status_retorno: "entregue",
        codigo_retorno: "200",
        recebido_em: "2026-11-13 09:00:05",
    },
})

Record({
    $id: Now.ID["seed_demo_envio_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_envio_sim",
    data: {
        comunicacao: Now.ref("x_2326104_cob_comunicacao", "seed_demo_comunicacao_2"),
        inscricao: Now.ref("x_2326104_cob_regua_inscricao", "TEL-038_registro_demo"),
        canal: "email",
        status_retorno: "entregue",
        codigo_retorno: "200",
        recebido_em: "2026-11-23 09:00:05",
    },
})
