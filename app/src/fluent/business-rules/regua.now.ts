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
    new ReguaMotor().preencherInscricao(current);
})(current, previous);`,
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
