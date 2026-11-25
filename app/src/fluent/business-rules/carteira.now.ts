// RF-MOD-F5-007 / SEC-002 — reforço da carteira do atendente na gravação (RN-NOVO-F5-007). A ACL de
// linha (security/carteira.now.ts) protege form, lista, report e API; estas business rules dão a
// mensagem ao usuário e valem também para script chamado em nome dele.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_interacao_carteira = BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_interacao_carteira'],
    name: 'Recusar interação fora da carteira do atendente',
    description: 'Atendente só registra ou altera interação de caso dele (RN-NOVO-F5-007).',
    table: 'x_2326104_cob_interacao',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/recusarInteracaoForaDaCarteira.server.js'),
})

export const br_caso_carteira = BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_caso_carteira'],
    name: 'Recusar alteração de caso fora da carteira do atendente',
    description: 'Atendente só altera ou encerra caso que já é dele (RN-NOVO-F5-007).',
    table: 'x_2326104_cob_caso',
    when: 'before',
    action: ['update'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/recusarCasoForaDaCarteira.server.js'),
})

export const br_contato_carteira = BusinessRule({
    $id: Now.ID['RF-MOD-UX-006_br_contato_carteira'],
    name: 'Recusar alteração de contato fora da carteira do atendente',
    description: 'Atendente só altera contato que já é dele e não troca o dono; contato só encerra com motivo (RN-NOVO-F5-007, RN-NOVO-UX-005).',
    table: 'x_2326104_cob_contato',
    when: 'before',
    action: ['update'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/recusarContatoForaDaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-UX-006_br_consulta_carteira_contato'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só os próprios contatos da lista (RN-NOVO-F5-007, RF-MOD-UX-006).',
    table: 'x_2326104_cob_contato',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

// Consulta: quem só tem o papel de atendente nem recebe nem conta linhas de outra carteira (o papel do
// Data Filter com Deny do SEC-002). A ACL de linha continua como segunda barreira.

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_caso'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_caso',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_contribuinte'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_contribuinte',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_interacao'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_interacao',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_regularizacao'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_regularizacao',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_debito'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_debito',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_parcelamento'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_parcelamento',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_comunicacao'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_comunicacao',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_consentimento'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_consentimento',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})

BusinessRule({
    $id: Now.ID['RF-MOD-F5-007_br_consulta_carteira_score_sim'],
    name: 'Restringir consulta à carteira do atendente',
    description: 'Consulta de quem só tem o papel de atendente traz só as linhas da própria carteira (RN-NOVO-F5-007, SEC-002).',
    table: 'x_2326104_cob_score_sim',
    when: 'before',
    action: ['query'],
    order: 100,
    active: true,
    script: Now.include('../../server/carteira/restringirConsultaCarteira.server.js'),
})
