// RF-MOD-UX-002 — gravação do contato da lista por papel. A ACL de leitura vem do scaffold (acl-base); a linha
// do atendente (só os próprios contatos) é conferida pelas ACL de carteira (security/carteira.now.ts).
// Sem a ACL de campo, o curinga «*.*» da plataforma deixaria o form somente leitura.
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { role_atendente, role_coordenador, role_admin } from './roles.now'

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    operation: 'write',
    roles: [role_atendente, role_coordenador, role_admin],
    description: 'Atendente, coordenador e admin do app gravam o contato; a linha é conferida pela ACL de carteira.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: '*',
    operation: 'write',
    roles: [role_atendente, role_coordenador, role_admin],
    description: 'Campos do contato gravam para atendente, coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_create'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    operation: 'create',
    roles: [role_coordenador, role_admin],
    description: 'Contato nasce da distribuição da lista (coordenador) ou pelo admin do app.',
})
