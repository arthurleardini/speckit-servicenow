// RF-MOD-F2-004 — grupo de controle fora das ações de cobrança e imutável após a publicação
// (RN-NOVO-F2-005, SEC-010). Business Rule (degrau 5): vale para form, lista, script, régua e importação.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_recusar_comunicacao_controle = BusinessRule({
    $id: Now.ID['RF-MOD-F2-004_br_recusar_comunicacao_controle'],
    name: 'Recusar comunicação para contribuinte em controle',
    description: 'Contribuinte no grupo de controle de ciclo publicado não recebe comunicação (RN-NOVO-F2-005).',
    table: 'x_2326104_cob_comunicacao',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    script: Now.include('../../server/qualificacao/recusarAcaoControle.server.js'),
})

export const br_recusar_caso_controle = BusinessRule({
    $id: Now.ID['RF-MOD-F2-004_br_recusar_caso_controle'],
    name: 'Recusar caso para contribuinte em controle',
    description: 'Contribuinte no grupo de controle de ciclo publicado não vira caso de cobrança qualificada (RN-NOVO-F2-005).',
    table: 'x_2326104_cob_caso',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    script: Now.include('../../server/qualificacao/recusarAcaoControle.server.js'),
})

export const br_recusar_contato_controle = BusinessRule({
    $id: Now.ID['RF-MOD-UX-004_br_contato_controle'],
    name: 'Recusar contato para contribuinte em controle',
    description: 'Contribuinte no grupo de controle de ciclo publicado não entra na lista de contatos (RN-NOVO-F2-005, RN-NOVO-UX-006, design UX v1 🟡7).',
    table: 'x_2326104_cob_contato',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    script: Now.include('../../server/qualificacao/recusarAcaoControle.server.js'),
})

export const br_publicar_ciclo = BusinessRule({
    $id: Now.ID['RF-MOD-F2-004_br_publicar_ciclo'],
    name: 'Sortear grupo de controle ao publicar o ciclo',
    description: 'Ciclo em prévia que vira «publicado», por qualquer caminho: só o coordenador, com versão publicada do critério; o sistema gera a semente, sorteia o grupo de controle e grava totais, data e autor. Em prévia, esses campos não são gravados à mão (RN-NOVO-F2-005, SEC-010).',
    table: 'x_2326104_cob_ciclo',
    when: 'before',
    action: ['update'],
    order: 50,
    active: true,
    condition: "previous.estado == 'previa'",
    script: Now.include('../../server/qualificacao/publicarCiclo.server.js'),
})

export const br_segmento_controle_imutavel = BusinessRule({
    $id: Now.ID['RF-MOD-F2-004_br_segmento_controle_imutavel'],
    name: 'Bloquear troca do grupo de controle após publicar o ciclo',
    description: 'Depois de publicado o ciclo, ninguém tira nem põe contribuinte no grupo de controle (SEC-010).',
    table: 'x_2326104_cob_segmentacao',
    when: 'before',
    action: ['update'],
    order: 100,
    active: true,
    condition: "current.segmento.changes()",
    script: Now.include('../../server/qualificacao/segmentoControleImutavel.server.js'),
})
