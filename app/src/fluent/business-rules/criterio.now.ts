// RF-MOD-F2-002 — versão publicada do critério é imutável (RN-NOVO-F2-001, SEC-009).
// Business Rule (degrau 5): a regra vale para form, lista, script e importação, e para todo papel,
// inclusive o administrador do app; a UI Policy não protegeria o dado.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_bloquear_versao_publicada = BusinessRule({
    $id: Now.ID['RF-MOD-F2-002_br_bloquear_versao_publicada'],
    name: 'Bloquear edição de versão publicada',
    description: 'Recusa alteração de parâmetro em versão publicada ou substituída do critério, para qualquer papel (RN-NOVO-F2-001).',
    table: 'x_2326104_cob_criterio',
    when: 'before',
    action: ['update'],
    order: 100,
    active: true,
    condition: "previous.estado == 'publicada' || previous.estado == 'substituida'",
    script: Now.include('../../server/qualificacao/bloquearVersaoPublicada.server.js'),
})

export const br_bloquear_exclusao_publicada = BusinessRule({
    $id: Now.ID['RF-MOD-F2-002_br_bloquear_exclusao_publicada'],
    name: 'Bloquear exclusão de versão publicada',
    description: 'Recusa excluir versão publicada ou substituída do critério (RN-NOVO-F2-001, SEC-009).',
    table: 'x_2326104_cob_criterio',
    when: 'before',
    action: ['delete'],
    order: 100,
    active: true,
    filterCondition: 'estadoINpublicada,substituida^EQ',
    script: Now.include('../../server/qualificacao/bloquearExclusaoPublicada.server.js'),
})

export const br_conferir_gravacao_criterio = BusinessRule({
    $id: Now.ID['RF-MOD-F2-002_br_conferir_gravacao_criterio'],
    name: 'Conferir gravação de versão do critério',
    description: 'Versão nova nasce em rascunho (versão 1 quando vazia) e código + versão não se repetem (SEC-009).',
    table: 'x_2326104_cob_criterio',
    when: 'before',
    action: ['insert', 'update'],
    order: 200,
    active: true,
    script: Now.include('../../server/qualificacao/conferirGravacaoCriterio.server.js'),
})
