// RF-MOD-UX-010 — «O que fazer agora» gravado em toda gravação de contato, caso e ciclo, e aviso «Próximo passo»
// no topo do form do contato (RN-NOVO-UX-015; design ux-cobranca-v2-regua-flow.md, D3 e A3).
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

const descricao = 'Grava em «O que fazer agora» o próximo passo pelo estado do registro (ProximaAcao, RN-NOVO-UX-015).'

export const br_proxima_acao_contato = BusinessRule({
    $id: Now.ID['UX-010_br_proxima_acao_contato'],
    name: 'Gravar «O que fazer agora» do contato',
    description: descricao,
    table: 'x_2326104_cob_contato',
    when: 'before',
    action: ['insert', 'update'],
    order: 900,
    active: true,
    script: Now.include('../../server/contato/gravarProximaAcao.server.js'),
})

export const br_proxima_acao_caso = BusinessRule({
    $id: Now.ID['UX-010_br_proxima_acao_caso'],
    name: 'Gravar «O que fazer agora» do caso',
    description: descricao,
    table: 'x_2326104_cob_caso',
    when: 'before',
    action: ['insert', 'update'],
    order: 900,
    active: true,
    script: Now.include('../../server/contato/gravarProximaAcao.server.js'),
})

export const br_proxima_acao_ciclo = BusinessRule({
    $id: Now.ID['UX-010_br_proxima_acao_ciclo'],
    name: 'Gravar «O que fazer agora» do ciclo',
    description: descricao,
    table: 'x_2326104_cob_ciclo',
    when: 'before',
    action: ['insert', 'update'],
    order: 900,
    active: true,
    script: Now.include('../../server/contato/gravarProximaAcao.server.js'),
})

export const br_proxima_acao_aviso = BusinessRule({
    $id: Now.ID['UX-010_br_proxima_acao_aviso'],
    name: 'Aviso «Próximo passo» no form do contato',
    description: 'No form do contato aberto (não encerrado), mostra «Próximo passo: <texto>» no topo (RN-NOVO-UX-015).',
    table: 'x_2326104_cob_contato',
    when: 'display',
    order: 100,
    active: true,
    script: Now.include('../../server/contato/avisoProximaAcao.server.js'),
})
