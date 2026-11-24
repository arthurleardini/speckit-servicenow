// RF-MOD-F2-002 / SEC-009 — gravação do critério por papel e estado. ACL (degrau 2) antes de script:
// coordenador e admin do app gravam só versão em rascunho; excluir é só do admin e só em rascunho.
// Versão publicada ou substituída fica somente leitura para todos (a business rule reforça no servidor).
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from './roles.now'

Acl({
    $id: Now.ID['RF-MOD-F2-002_acl_criterio_write'],
    type: 'record',
    table: 'x_2326104_cob_criterio',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    condition: 'estado=rascunho^ORestadoISEMPTY^EQ',
    description: 'Coordenador e admin do app gravam só versão em rascunho (RN-NOVO-F2-001).',
})

Acl({
    $id: Now.ID['RF-MOD-F2-002_acl_criterio_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_criterio',
    field: '*',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    condition: 'estado=rascunho^ORestadoISEMPTY^EQ',
    description: 'Campos do critério gravam só em rascunho (RN-NOVO-F2-001).',
})

Acl({
    $id: Now.ID['RF-MOD-F2-002_acl_criterio_create'],
    type: 'record',
    table: 'x_2326104_cob_criterio',
    operation: 'create',
    roles: [role_coordenador, role_admin],
    description: 'Coordenador e admin do app criam versão nova do critério.',
})

Acl({
    $id: Now.ID['RF-MOD-F2-002_acl_criterio_delete'],
    type: 'record',
    table: 'x_2326104_cob_criterio',
    operation: 'delete',
    roles: [role_admin],
    condition: 'estado=rascunho^EQ',
    description: 'Só o admin do app exclui, e só versão em rascunho (SEC-009).',
})
