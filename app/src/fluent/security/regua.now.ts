// RF-MOD-F4-010 — gravação da régua e da etapa por papel (design ux-cobranca-v2-regua-flow.md, B5). A leitura vem
// do scaffold (acl-base). O coordenador muda parâmetros (ativa, prazo, janela, dia, canal, texto, postura, ação sem
// resposta); código, carteira e Flow da régua, régua e ordem da etapa só o admin do app (a estrutura muda pelo
// gerador). Sem ACL de create nem de delete: régua e etapa nascem pelo seed/gerador (admin de sistema).
// A ACL do campo vale no lugar do curinga «*».
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from './roles.now'

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_regua_write'],
    type: 'record',
    table: 'x_2326104_cob_regua',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'Coordenador e admin do app gravam a régua (parâmetros); estrutura só pelo admin.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_regua_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_regua',
    field: '*',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'Campos da régua gravam para coordenador e admin do app, salvo código, carteira e Flow.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_regua_write_codigo'],
    type: 'record',
    table: 'x_2326104_cob_regua',
    field: 'codigo',
    operation: 'write',
    roles: [role_admin],
    description: 'O código casa com o gatilho do Flow da régua: só o admin do app grava.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_regua_write_carteira'],
    type: 'record',
    table: 'x_2326104_cob_regua',
    field: 'carteira',
    operation: 'write',
    roles: [role_admin],
    description: 'A carteira da régua decide quem é inscrito: só o admin do app grava.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_regua_write_flow'],
    type: 'record',
    table: 'x_2326104_cob_regua',
    field: 'flow',
    operation: 'write',
    roles: [role_admin],
    description: 'O Flow da régua vem do gerador: só o admin do app grava.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_etapa_write'],
    type: 'record',
    table: 'x_2326104_cob_regua_etapa',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'Coordenador e admin do app gravam a etapa (dia, canal, texto, postura, ação sem resposta).',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_etapa_write_campos'],
    type: 'record',
    table: 'x_2326104_cob_regua_etapa',
    field: '*',
    operation: 'write',
    roles: [role_coordenador, role_admin],
    description: 'Campos da etapa gravam para coordenador e admin do app, salvo régua e ordem.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_etapa_write_regua'],
    type: 'record',
    table: 'x_2326104_cob_regua_etapa',
    field: 'regua',
    operation: 'write',
    roles: [role_admin],
    description: 'A régua da etapa é estrutura (o Flow tem uma etapa por stage): só o admin do app grava.',
})

Acl({
    $id: Now.ID['RF-MOD-F4-010_acl_etapa_write_ordem'],
    type: 'record',
    table: 'x_2326104_cob_regua_etapa',
    field: 'ordem',
    operation: 'write',
    roles: [role_admin],
    description: 'A ordem da etapa é estrutura (o Flow tem uma etapa por stage): só o admin do app grava.',
})

// RF-MOD-F4-013 — inscrição na régua: o atendente lê só as da própria carteira (deny-unless pelo atendente do
// contribuinte); coordenador e admin do app leem todas (CarteiraAtendente.veTudo); o admin da plataforma passa por
// adminOverrides. A BR de consulta (business-rules/carteira.now.ts) tira as linhas de outra carteira da lista e das
// contagens. Sem ACL de create, write ou delete: nenhuma persona grava inscrição; o motor grava no servidor (B5).
Acl({
    $id: Now.ID['RF-MOD-F4-013_acl_inscricao_carteira'],
    type: 'record',
    table: 'x_2326104_cob_regua_inscricao',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: "answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');",
    description: 'Nega ao atendente a inscrição na régua de contribuinte de outra carteira (B5, RN-NOVO-F5-007).',
})
