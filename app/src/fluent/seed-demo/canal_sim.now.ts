// Seed manual da demo: canais de envio simulados (régua, design ux-v2 B1) (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs
// com datas relativas a 2026-11-25; na véspera da demo, rodar o script de novo (roteiro da demo).
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

Record({
    $id: Now.ID["seed_demo_canal_sne"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_canal_sim",
    data: {
        canal: "sne",
        contratado: true,
        exige_opt_in: false,
        forcar_falha: false,
    },
})

Record({
    $id: Now.ID["seed_demo_canal_email"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_canal_sim",
    data: {
        canal: "email",
        contratado: true,
        exige_opt_in: false,
        forcar_falha: false,
    },
})

Record({
    $id: Now.ID["seed_demo_canal_sms"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_canal_sim",
    data: {
        canal: "sms",
        contratado: true,
        exige_opt_in: false,
        forcar_falha: false,
    },
})

Record({
    $id: Now.ID["seed_demo_canal_whatsapp"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_canal_sim",
    data: {
        canal: "whatsapp",
        contratado: true,
        exige_opt_in: true,
        forcar_falha: false,
    },
})
