// RF-MOD-UX-005 / GAP-152 — estágio, data de encerramento e ordem da etapa do caso mudam pelos botões «Avançar
// etapa» e «Encerrar caso» (e pela business rule da ordem); o coordenador não os grava à mão no form, na lista ou
// pela API. O motivo de encerramento continua gravável: o botão «Encerrar caso» pede o motivo no form. A ACL do
// campo vale no lugar do curinga «*» (security/carteira.now.ts). A business rule do estágio cobre também o admin.
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { role_admin } from './roles.now'

Acl({
    $id: Now.ID['RF-MOD-UX-005_acl_caso_write_estagio'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    field: 'estagio',
    operation: 'write',
    roles: [role_admin],
    description: 'O «Estágio» do caso muda pelos botões «Avançar etapa» e «Encerrar caso»; à mão, só o admin do app (GAP-152).',
})

Acl({
    $id: Now.ID['RF-MOD-UX-005_acl_caso_write_encerrado_em'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    field: 'encerrado_em',
    operation: 'write',
    roles: [role_admin],
    description: '«Encerrado em» é gravado pelo botão «Encerrar caso»; à mão, só o admin do app (GAP-152).',
})

Acl({
    $id: Now.ID['RF-MOD-UX-005_acl_caso_write_etapa_ordem'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    field: 'etapa_ordem',
    operation: 'write',
    roles: [role_admin],
    description: '«Ordem da etapa» é gravada pela business rule a partir do estágio; à mão, só o admin do app (GAP-152).',
})
