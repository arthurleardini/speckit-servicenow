// RF-MOD-F4-010 — business rules da régua como Flow (design ux-cobranca-v2-regua-flow.md, B4 e D17). A regra
// fica no ReguaMotor (e em QualificacaoCiclo para o grupo de controle); a BR só chama, por qualquer caminho de gravação.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_validar_etapa = BusinessRule({
    $id: Now.ID['RF-MOD-F4-010_br_validar_etapa'],
    name: 'Validar etapa da régua (postura, dia, encaminhar e sigilo)',
    description: 'Recusa etapa com postura que regride ou salta nível, dia fora de ordem, encaminhar fora da última etapa (ou última sem encaminhar) e valor ou tributo em texto de e-mail, SMS e WhatsApp (D17, RN-NOVO-F4-010).',
    table: 'x_2326104_cob_regua_etapa',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: Now.include('../../server/regua/validarEtapa.server.js'),
})

export const br_validar_regua = BusinessRule({
    $id: Now.ID['RF-MOD-F4-010_br_validar_regua'],
    name: 'Validar régua (código e prazo final)',
    description: 'Régua sem código, com código repetido ou sem prazo de resposta depois da última etapa é recusada; na criação o prazo vazio vira 5 dias (B1, RN-NOVO-F4-009).',
    table: 'x_2326104_cob_regua',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: Now.include('../../server/regua/validarEtapa.server.js'),
})

export const br_inscricao_padroes = BusinessRule({
    $id: Now.ID['RF-MOD-F4-010_br_inscricao_padroes'],
    name: 'Inscrição na régua nasce ativa',
    description: 'Inscrição criada só com contribuinte e régua nasce com status ativa, etapa 0 e iniciada agora (B1).',
    table: 'x_2326104_cob_regua_inscricao',
    when: 'before',
    action: ['insert'],
    order: 50,
    active: true,
    script: `(function executeRule(current, previous) {
    var motor = new ReguaMotor();
    var msg = motor.motivoRecusaInscricao(current);
    if (msg) {
        gs.warn('RF-MOD-F4-013: inscrição recusada — ' + msg);
        gs.addErrorMessage(msg);
        current.setAbortAction(true);
        return;
    }
    motor.preencherInscricao(current);
})(current, previous);`,
})

// ——— US-MOD-F4-012: gatilhos que criam ou encerram inscrição (B4) ———

export const br_inscrever_ao_publicar = BusinessRule({
    $id: Now.ID['RF-MOD-F4-012_br_inscrever_ao_publicar'],
    name: 'Inscrever a massificada na régua ao publicar o ciclo',
    description: 'Ciclo que passa de prévia a publicado, por qualquer caminho (botão, lista, form, API): cada contribuinte da massificada com débito em aberto entra na régua ativa da carteira do maior débito; limpa a marca de encaminhado à qualificada dos segmentados (D7, RN-NOVO-F4-002, RN-NOVO-F4-008).',
    table: 'x_2326104_cob_ciclo',
    when: 'after',
    action: ['update'],
    order: 200,
    active: true,
    condition: "previous.estado == 'previa' && current.estado == 'publicado'",
    script: Now.include('../../server/regua/inscreverAoPublicar.server.js'),
})

export const br_reavaliar_debito = BusinessRule({
    $id: Now.ID['RF-MOD-F4-012_br_reavaliar_debito'],
    name: 'Reavaliar a régua quando o débito muda de status',
    description: 'Débito que muda de status (regularizado, parcelado, cancelado…) reavalia as inscrições ativas do contribuinte: sem débito em aberto do tributo da carteira, a inscrição encerra como regularizado na hora (RN-NOVO-F4-009, G8).',
    table: 'x_2326104_cob_debito',
    when: 'after',
    action: ['update'],
    order: 200,
    active: true,
    condition: 'current.status.changes()',
    script: Now.include('../../server/regua/reavaliarContribuinte.server.js'),
})

export const br_reavaliar_regularizacao = BusinessRule({
    $id: Now.ID['RF-MOD-F4-012_br_reavaliar_regularizacao'],
    name: 'Reavaliar a régua quando há regularização',
    description: 'Regularização registrada reavalia as inscrições ativas do contribuinte (RN-NOVO-F4-009, G8).',
    table: 'x_2326104_cob_regularizacao',
    when: 'after',
    action: ['insert'],
    order: 200,
    active: true,
    script: Now.include('../../server/regua/reavaliarContribuinte.server.js'),
})

export const br_encerrar_ao_pausar = BusinessRule({
    $id: Now.ID['RF-MOD-F4-012_br_encerrar_ao_pausar'],
    name: 'Encerrar as inscrições ao pausar a régua',
    description: 'Régua cuja «Ativa» vira falso encerra as inscrições ativas dela com «Régua pausada»; ativar de novo não as retoma (B4, A1).',
    table: 'x_2326104_cob_regua',
    when: 'after',
    action: ['update'],
    order: 200,
    active: true,
    condition: 'current.ativa.changesTo(false)',
    script: Now.include('../../server/regua/encerrarAoPausar.server.js'),
})

// ——— US-MOD-F4-013: régua de Parcelamentos (P3, D16) ———

export const br_parcelamento_em_risco = BusinessRule({
    $id: Now.ID['RF-MOD-F4-013_br_parcelamento_em_risco'],
    name: 'Inscrever na régua Parcelamentos o parcelamento em risco',
    description: 'Parcelamento que passa a «Em risco» inscreve o contribuinte na régua ativa de Parcelamentos, com o parcelamento e o último ciclo publicado (D16, RN-NOVO-F4-014).',
    table: 'x_2326104_cob_parcelamento',
    when: 'after',
    action: ['update'],
    order: 200,
    active: true,
    condition: "current.status.changesTo('em_risco')",
    script: Now.include('../../server/regua/inscreverParcelamento.server.js'),
})

export const br_parcelamento_reavaliar = BusinessRule({
    $id: Now.ID['RF-MOD-F4-013_br_parcelamento_reavaliar'],
    name: 'Reavaliar a régua quando o parcelamento sai de em risco',
    description: 'Parcelamento que muda para em dia ou quitado encerra a inscrição como regularizado; para rompido, como parcelamento rompido (D16, RN-NOVO-F4-014).',
    table: 'x_2326104_cob_parcelamento',
    when: 'after',
    action: ['update'],
    order: 200,
    active: true,
    condition: "current.status.changes() && current.status != 'em_risco'",
    script: Now.include('../../server/regua/reavaliarContribuinte.server.js'),
})

export const br_recusar_inscricao_controle = BusinessRule({
    $id: Now.ID['RF-MOD-F4-010_br_recusar_inscricao_controle'],
    name: 'Recusar inscrição na régua para contribuinte em controle',
    description: 'Contribuinte no grupo de controle do ciclo da inscrição não entra na régua (RN-NOVO-F2-005); mesma regra de comunicação, caso e contato (recusarAcaoControle).',
    table: 'x_2326104_cob_regua_inscricao',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    script: Now.include('../../server/qualificacao/recusarAcaoControle.server.js'),
})
