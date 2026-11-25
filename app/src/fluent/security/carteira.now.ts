// RF-MOD-F5-007 / SEC-002 — atendente vê só a própria carteira (RN-NOVO-F5-007, fio condutor 5).
// ACL (degrau 2). A ACL de leitura por papel do scaffold continua dando acesso ao atendente; estas ACL
// «deny-unless» negam a linha que não é dele, em form, lista, related list, report e exportação.
// Coordenador e admin do app passam (CarteiraAtendente.veTudo); o admin da plataforma passa por
// adminOverrides. Filtro de lista e view não protegem dado (RN-SN-145): a proteção é esta.
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { role_coordenador, role_atendente, role_admin } from './roles.now'

// Leitura: o dono é o campo «atendente» da própria linha.
Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_caso_carteira'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'coordenador');",
    description: 'Nega ao atendente o caso de outro atendente (RN-NOVO-F5-007).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_contribuinte_carteira'],
    type: 'record',
    table: 'x_2326104_cob_contribuinte',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'atendente');",
    description: 'Nega ao atendente o contribuinte de outra carteira (RN-NOVO-F5-007).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_interacao_carteira'],
    type: 'record',
    table: 'x_2326104_cob_interacao',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'caso.coordenador');",
    description: 'Nega ao atendente a interação de caso de outro atendente (RN-NOVO-F5-007).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_regularizacao_carteira'],
    type: 'record',
    table: 'x_2326104_cob_regularizacao',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, ['atendente', 'caso.coordenador']);",
    description: 'Nega ao atendente a regularização de outra carteira (SEC-002).',
})

// Leitura: o dono é o atendente do contribuinte.
Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_debito_carteira'],
    type: 'record',
    table: 'x_2326104_cob_debito',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');",
    description: 'Nega ao atendente o débito de contribuinte de outra carteira (SEC-002).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_parcelamento_carteira'],
    type: 'record',
    table: 'x_2326104_cob_parcelamento',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');",
    description: 'Nega ao atendente o parcelamento de contribuinte de outra carteira (SEC-002).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_comunicacao_carteira'],
    type: 'record',
    table: 'x_2326104_cob_comunicacao',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');",
    description: 'Nega ao atendente a comunicação de contribuinte de outra carteira (SEC-002).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_consentimento_carteira'],
    type: 'record',
    table: 'x_2326104_cob_consentimento',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');",
    description: 'Nega ao atendente o consentimento de contribuinte de outra carteira (SEC-002).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_score_carteira'],
    type: 'record',
    table: 'x_2326104_cob_score_sim',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');",
    description: 'Nega ao atendente o score de contribuinte de outra carteira (SEC-002).',
})

// Gravação: caso (atendente encerra o próprio caso; coordenador e admin, qualquer um).
Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_caso_write'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    operation: 'write',
    roles: [role_atendente, role_coordenador, role_admin],
    description: 'Atendente, coordenador e admin do app gravam o caso; a linha é conferida pela ACL de carteira.',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_caso_write_carteira'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    operation: 'write',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'coordenador');",
    description: 'Nega ao atendente gravar caso de outro atendente (RN-NOVO-F5-007).',
})

// Campos: sem ACL de campo, o curinga «*.*» da plataforma deixaria o form somente leitura.
Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_caso_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    field: '*',
    operation: 'write',
    roles: [role_atendente, role_coordenador, role_admin],
    description: 'Campos do caso gravam para atendente, coordenador e admin do app.',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_interacao_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_interacao',
    field: '*',
    operation: 'write',
    roles: [role_atendente, role_admin],
    description: 'Campos da interação gravam para atendente e admin do app.',
})

// Gravação: interação (atendente registra só nos próprios casos; coordenador só lê).
Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_interacao_create'],
    type: 'record',
    table: 'x_2326104_cob_interacao',
    operation: 'create',
    roles: [role_atendente, role_admin],
    description: 'Atendente e admin do app registram interação.',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_interacao_write'],
    type: 'record',
    table: 'x_2326104_cob_interacao',
    operation: 'write',
    roles: [role_atendente, role_admin],
    description: 'Atendente e admin do app gravam interação; a linha é conferida pela ACL de carteira.',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_interacao_create_carteira'],
    type: 'record',
    table: 'x_2326104_cob_interacao',
    operation: 'create',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'caso.coordenador');",
    description: 'Nega ao atendente registrar interação em caso de outro atendente (RN-NOVO-F5-007).',
})

Acl({
    $id: Now.ID['RF-MOD-F5-007_acl_interacao_write_carteira'],
    type: 'record',
    table: 'x_2326104_cob_interacao',
    operation: 'write',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'caso.coordenador');",
    description: 'Nega ao atendente gravar interação de caso de outro atendente (RN-NOVO-F5-007).',
})
