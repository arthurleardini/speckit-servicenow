// RF-MOD-UX-002 — a interação aponta para um contato da lista ou para um caso qualificado, nunca os dois e
// nunca nenhum (RN-NOVO-UX-004, design UX v1 🔴4). Business Rule: vale por form, lista, script e API.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_interacao_um_pai = BusinessRule({
    $id: Now.ID['RF-MOD-UX-002_br_interacao_um_pai'],
    name: 'Interação pertence a um contato ou a um caso',
    description: 'Recusa interação sem contato e sem caso, ou com os dois (RN-NOVO-UX-004).',
    table: 'x_2326104_cob_interacao',
    when: 'before',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    script: Now.include('../../server/contato/interacaoUmPai.server.js'),
})
