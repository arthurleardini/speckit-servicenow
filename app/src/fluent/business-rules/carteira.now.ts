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
