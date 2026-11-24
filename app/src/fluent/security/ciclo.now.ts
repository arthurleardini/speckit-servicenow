// RF-MOD-F2-004 / SEC-010 — gravação do ciclo por papel e estado. Coordenador e admin do app gravam
// só o ciclo em prévia; depois de publicado, semente, elegíveis, data e autor ficam somente leitura.
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from './roles.now'

Acl({
    $id: Now.ID['RF-MOD-F2-004_acl_ciclo_write'],
    type: 'record',
    table: 'x_2326104_cob_ciclo',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    condition: 'estado=previa^ORestadoISEMPTY^EQ',
    description: 'Ciclo grava só em prévia (SEC-010).',
})

Acl({
    $id: Now.ID['RF-MOD-F2-004_acl_ciclo_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_ciclo',
    field: '*',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    condition: 'estado=previa^ORestadoISEMPTY^EQ',
    description: 'Campos do ciclo gravam só em prévia (SEC-010).',
})

Acl({
    $id: Now.ID['RF-MOD-F2-004_acl_ciclo_create'],
    type: 'record',
    table: 'x_2326104_cob_ciclo',
    operation: 'create',
    roles: [role_coordenador, role_admin],
    description: 'Coordenador e admin do app abrem ciclo novo.',
})
