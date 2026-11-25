// gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json) — não editar à mão
// Seed das réguas de cobrança e das etapas (design ux-v2, B1). Fonte: outputs/spec/reguas.json.
import '@servicenow/sdk/global'
import { Record } from '@servicenow/sdk/core'

// régua parcelamentos
Record({
    $id: Now.ID["seed_regua_parcelamentos"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua",
    data: {
        nome: "Parcelamentos",
        codigo: "parcelamentos",
        carteira: "parcelamentos",
        ativa: true,
        prazo_final_dias: 5,
        janela_atribuicao_dias: 30,
        flow: Now.ref("sys_hub_flow", "flow_regua_parcelamentos"),
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_parcelamentos_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_parcelamentos"),
        ordem: 1,
        offset_dias: 0,
        canal: "sne",
        postura: "utilitaria",
        acao_sem_resposta: "intensificar",
        template: "Há uma mensagem sobre o seu parcelamento no DT-e. Acesse o portal da SEFAZ-MT.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_parcelamentos_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_parcelamentos"),
        ordem: 2,
        offset_dias: 7,
        canal: "email",
        postura: "consciente",
        acao_sem_resposta: "intensificar",
        template: "Lembrete: há uma mensagem sobre o seu parcelamento no DT-e. Acesse o portal da SEFAZ-MT para conferir as parcelas.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_parcelamentos_3"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_parcelamentos"),
        ordem: 3,
        offset_dias: 15,
        canal: "sne",
        postura: "explicativa",
        acao_sem_resposta: "encaminhar_ativa",
        template: "Parcelas em atraso podem levar ao rompimento do parcelamento. Regularize pelo portal da SEFAZ-MT ou fale com a central de atendimento.",
    },
})

// régua ipva (seed_regua_ipva: registro demo da TEL-014)
Record({
    $id: Now.ID["TEL-014_registro_demo"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua",
    data: {
        nome: "IPVA",
        codigo: "ipva",
        carteira: "ipva",
        ativa: true,
        prazo_final_dias: 5,
        janela_atribuicao_dias: 30,
        flow: Now.ref("sys_hub_flow", "flow_regua_ipva"),
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_ipva_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        ordem: 1,
        offset_dias: 0,
        canal: "sne",
        postura: "utilitaria",
        acao_sem_resposta: "intensificar",
        template: "Há uma mensagem para você no DT-e. Acesse o portal da SEFAZ-MT.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_ipva_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        ordem: 2,
        offset_dias: 10,
        canal: "email",
        postura: "consciente",
        acao_sem_resposta: "intensificar",
        template: "Você tem uma mensagem não lida no DT-e. Acesse o portal da SEFAZ-MT para conferir a situação do seu veículo.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_ipva_3"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        ordem: 3,
        offset_dias: 20,
        canal: "sms",
        postura: "explicativa",
        acao_sem_resposta: "intensificar",
        template: "SEFAZ-MT: há uma pendência do seu veículo no DT-e. Regularizar evita restrições no licenciamento. Acesse o portal.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_ipva_4"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        ordem: 4,
        offset_dias: 30,
        canal: "sne",
        postura: "ameacadora",
        acao_sem_resposta: "encaminhar_ativa",
        template: "Sem a regularização, o débito de IPVA segue para a cobrança ativa e pode ser inscrito em dívida ativa. Regularize pelo portal da SEFAZ-MT.",
    },
})

Record({
    $id: Now.ID["TEL-014_journal_1"],
    $meta: { installMethod: 'demo' },
    table: "sys_journal_field",
    data: {
        name: "x_2326104_cob_regua",
        element: "comentarios",
        element_id: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        value: "Régua revisada com a coordenação: SNE no dia 0, e-mail no dia 10, SMS no dia 20 e SNE no dia 30.",
    },
})

Record({
    $id: Now.ID["TEL-014_journal_2"],
    $meta: { installMethod: 'demo' },
    table: "sys_journal_field",
    data: {
        name: "x_2326104_cob_regua",
        element: "comentarios",
        element_id: Now.ref("x_2326104_cob_regua", "TEL-014_registro_demo"),
        value: "Textos de e-mail e SMS só dão ciência do DT-e, sem valor nem tributo.",
    },
})

// régua itcd
Record({
    $id: Now.ID["seed_regua_itcd"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua",
    data: {
        nome: "ITCD",
        codigo: "itcd",
        carteira: "itcd",
        ativa: true,
        prazo_final_dias: 5,
        janela_atribuicao_dias: 30,
        flow: Now.ref("sys_hub_flow", "flow_regua_itcd"),
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_itcd_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_itcd"),
        ordem: 1,
        offset_dias: 0,
        canal: "sne",
        postura: "utilitaria",
        acao_sem_resposta: "intensificar",
        template: "Há uma mensagem para você no DT-e sobre uma declaração de ITCD. Acesse o portal da SEFAZ-MT.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_itcd_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_itcd"),
        ordem: 2,
        offset_dias: 15,
        canal: "email",
        postura: "consciente",
        acao_sem_resposta: "intensificar",
        template: "Você tem uma mensagem não lida no DT-e. Acesse o portal da SEFAZ-MT para conferir a sua declaração.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_itcd_3"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_itcd"),
        ordem: 3,
        offset_dias: 30,
        canal: "sne",
        postura: "explicativa",
        acao_sem_resposta: "encaminhar_qualificada",
        template: "A pendência de ITCD segue para análise da cobrança qualificada. Regularize pelo portal da SEFAZ-MT ou fale com a central de atendimento.",
    },
})

// régua icms_normal
Record({
    $id: Now.ID["seed_regua_icms_normal"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua",
    data: {
        nome: "ICMS Normal",
        codigo: "icms_normal",
        carteira: "icms_normal",
        ativa: true,
        prazo_final_dias: 5,
        janela_atribuicao_dias: 30,
        flow: Now.ref("sys_hub_flow", "flow_regua_icms_normal"),
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_normal_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_normal"),
        ordem: 1,
        offset_dias: 0,
        canal: "sne",
        postura: "utilitaria",
        acao_sem_resposta: "intensificar",
        template: "Há uma mensagem para a sua empresa no DT-e. Acesse o portal da SEFAZ-MT.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_normal_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_normal"),
        ordem: 2,
        offset_dias: 10,
        canal: "email",
        postura: "consciente",
        acao_sem_resposta: "intensificar",
        template: "A sua empresa tem uma mensagem não lida no DT-e. Acesse o portal da SEFAZ-MT para conferir.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_normal_3"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_normal"),
        ordem: 3,
        offset_dias: 20,
        canal: "whatsapp",
        postura: "explicativa",
        acao_sem_resposta: "intensificar",
        template: "SEFAZ-MT: há uma pendência da sua empresa no DT-e. Regularizar evita restrições na emissão de documentos. Acesse o portal.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_normal_4"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_normal"),
        ordem: 4,
        offset_dias: 30,
        canal: "sne",
        postura: "ameacadora",
        acao_sem_resposta: "encaminhar_ativa",
        template: "Sem a regularização, o débito segue para a cobrança ativa e pode ser inscrito em dívida ativa. Regularize pelo portal da SEFAZ-MT.",
    },
})

// régua icms_st
Record({
    $id: Now.ID["seed_regua_icms_st"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua",
    data: {
        nome: "ICMS ST",
        codigo: "icms_st",
        carteira: "icms_st",
        ativa: true,
        prazo_final_dias: 5,
        janela_atribuicao_dias: 30,
        flow: Now.ref("sys_hub_flow", "flow_regua_icms_st"),
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_st_1"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_st"),
        ordem: 1,
        offset_dias: 0,
        canal: "sne",
        postura: "utilitaria",
        acao_sem_resposta: "intensificar",
        template: "Há uma mensagem para a sua empresa no DT-e sobre substituição tributária. Acesse o portal da SEFAZ-MT.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_st_2"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_st"),
        ordem: 2,
        offset_dias: 10,
        canal: "email",
        postura: "consciente",
        acao_sem_resposta: "intensificar",
        template: "A sua empresa tem uma mensagem não lida no DT-e. Acesse o portal da SEFAZ-MT para conferir.",
    },
})

Record({
    $id: Now.ID["seed_regua_etapa_icms_st_3"],
    $meta: { installMethod: 'demo' },
    table: "x_2326104_cob_regua_etapa",
    data: {
        regua: Now.ref("x_2326104_cob_regua", "seed_regua_icms_st"),
        ordem: 3,
        offset_dias: 20,
        canal: "sne",
        postura: "explicativa",
        acao_sem_resposta: "encaminhar_ativa",
        template: "A pendência de substituição tributária segue para a cobrança ativa. Regularize pelo portal da SEFAZ-MT ou fale com a central de atendimento.",
    },
})
