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

// Campos que só os verbos da lista (Registrar ligação, Encerrar) e a distribuição mudam: o atendente escolhe o
// resultado, a próxima ação, o motivo e a anotação; status, tentativas, dono e dados da distribuição seguem a
// tabela de decisão (auditoria US-MOD-UX-002, SEC-001). A ACL do campo vale no lugar do curinga «*».

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_status'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'status',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «status» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_ultimo_resultado'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'ultimo_resultado',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «ultimo_resultado» do contato muda pelo verbo «Registrar ligação»; o atendente escolhe em «Resultado desta ligação» (GAP-150). À mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_tentativas'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'tentativas',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «tentativas» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_atendente'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'atendente',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «atendente» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_contribuinte'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'contribuinte',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «contribuinte» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_ciclo'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'ciclo',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «ciclo» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_prioridade'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'prioridade',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «prioridade» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-002_acl_contato_write_valor_em_aberto'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'valor_em_aberto',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'O campo «valor_em_aberto» do contato muda pelos verbos da lista; à mão, só coordenador e admin do app.',
})

// RF-MOD-UX-010 — «O que fazer agora» é só leitura para as personas: a business rule grava pelo estado
// (ProximaAcao); à mão, só o admin do app.
Acl({
    $id: Now.ID['UX-010_acl_contato_write_proxima_acao'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'proxima_acao',
    operation: 'write',
    roles: [role_admin],
    description: '«O que fazer agora» é calculado pela business rule; à mão, só o admin do app.',
})

// RF-MOD-F4-012 — «Origem» (distribuição do ciclo ou régua) é gravada por quem cria o contato
// (QualificacaoCiclo._criarContato); à mão, só o admin do app. Sem esta ACL, o curinga «*» deixava o atendente
// trocar a origem no form (F5 do design ux-v2).
Acl({
    $id: Now.ID['F4-012_acl_contato_write_origem'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'origem',
    operation: 'write',
    roles: [role_admin],
    description: '«Origem» do contato é gravada na criação (distribuição ou régua); à mão, só o admin do app.',
})

// RF-MOD-UX-010 — «Lista da equipe» agrupa os contatos por atendente (GROUPBYatendente). Sem query_range no
// campo, o coordenador recebe «Security prevents reading Atendente» e a lista sai vazia (F0, ponto 9).
Acl({
    $id: Now.ID['UX-010_acl_contato_atendente_query_range'],
    type: 'record',
    table: 'x_2326104_cob_contato',
    field: 'atendente',
    operation: 'query_range',
    roles: [role_coordenador, role_admin],
    description: 'Coordenador e admin do app agrupam e filtram contatos por atendente («Lista da equipe»).',
})
