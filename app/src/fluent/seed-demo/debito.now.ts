// Seed manual da demo: débitos de IPVA dos contribuintes de demo da régua (A, B e C) (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_demo_debito_ipva_a"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        origem: "sne",
        tributo: "ipva",
        valor: 1250,
        vencimento: "2026-09-26",
        dias_atraso: 60,
        status: "aberto",
        id_fonte: "IPVA-DEMO-A",
        sobreposto: false,
        atualizado_em: "2026-11-24 08:00:00",
    },
})

Record({
    $id: Now.ID["seed_demo_debito_ipva_b"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        origem: "sne",
        tributo: "ipva",
        valor: 1250,
        vencimento: "2026-09-26",
        dias_atraso: 60,
        status: "aberto",
        id_fonte: "IPVA-DEMO-B",
        sobreposto: false,
        atualizado_em: "2026-11-24 08:00:00",
    },
})

Record({
    $id: Now.ID["seed_demo_debito_ipva_c"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_debito",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_008"),
        origem: "sne",
        tributo: "ipva",
        valor: 1250,
        vencimento: "2026-09-26",
        dias_atraso: 60,
        status: "regularizado",
        id_fonte: "IPVA-DEMO-C",
        sobreposto: false,
        atualizado_em: "2026-11-24 08:00:00",
    },
})
