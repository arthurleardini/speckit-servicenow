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

export const br_substituir_versao_anterior = BusinessRule({
    $id: Now.ID['RF-MOD-F2-002_br_substituir_versao_anterior'],
    name: 'Substituir versão anterior ao publicar',
    description: 'Ao publicar uma versão, as outras versões publicadas do mesmo código ficam «Substituídas» (RN-NOVO-F2-001).',
    table: 'x_2326104_cob_criterio',
    when: 'after',
    action: ['update'],
    order: 100,
    active: true,
    filterCondition: 'estadoCHANGESTOpublicada^EQ',
    script: Now.include('../../server/qualificacao/substituirVersaoAnterior.server.js'),
})

export const br_conferir_gravacao_criterio = BusinessRule({
    $id: Now.ID['RF-MOD-F2-002_br_conferir_gravacao_criterio'],
    name: 'Conferir gravação de versão do critério',
    description: 'Nome obrigatório; versão nova nasce em rascunho (versão 1 quando vazia); código + versão não se repetem; só o coordenador publica, com motivo quando há versão anterior, e a publicação grava data e autor por qualquer caminho (RF-MOD-F2-001, SEC-009).',
    table: 'x_2326104_cob_criterio',
    when: 'before',
    action: ['insert', 'update'],
    order: 200,
    active: true,
    script: Now.include('../../server/qualificacao/conferirGravacaoCriterio.server.js'),
})
