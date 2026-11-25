// Seed manual da demo: consentimento por canal dos contribuintes de demo A e B (CUJ-4) (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_demo_consentimento_a_sne"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        canal: "sne",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_a_email"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        canal: "email",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_a_sms"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        canal: "sms",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_a_whatsapp"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_001"),
        canal: "whatsapp",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_b_sne"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        canal: "sne",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_b_email"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        canal: "email",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_b_whatsapp"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        canal: "whatsapp",
        situacao: "opt_in",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})

Record({
    $id: Now.ID["seed_demo_consentimento_b_sms"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_consentimento",
    data: {
        contribuinte: Now.ref("x_2326104_cob_contribuinte", "seed_contribuinte_005"),
        canal: "sms",
        situacao: "opt_out",
        registrado_em: "2026-10-26 10:00:00",
        origem: "Portal do contribuinte (fictício)",
    },
})
