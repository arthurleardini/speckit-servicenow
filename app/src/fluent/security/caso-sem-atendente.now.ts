// RF-MOD-UX-006 — o caso qualificado é do coordenador: quem só tem o papel de atendente não lê nem grava caso
// (design UX v1 R6, 🔴6). Arquivo à mão: a ACL de leitura por papel do scaffold (acl-base, gerado) dá leitura a
// todos os papéis em todas as tabelas; esta ACL «nega, a menos que» tira o atendente por cima dela, em form,
// lista, related list, report e API. Coordenador e admin do app passam (CarteiraAtendente.veTudo); o admin da
// plataforma passa por adminOverrides.
import '@servicenow/sdk/global'
import { Acl } from '@servicenow/sdk/core'

Acl({
    $id: Now.ID['RF-MOD-UX-006_acl_caso_sem_atendente'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: 'answer = new CarteiraAtendente().veTudo();',
    description: 'Atendente não tem acesso ao caso qualificado (R6): só coordenador e admin do app leem o caso.',
})

Acl({
    $id: Now.ID['RF-MOD-UX-006_acl_caso_campos_sem_atendente'],
    type: 'record',
    table: 'x_2326104_cob_caso',
    field: '*',
    operation: 'read',
    decisionType: 'deny',
    adminOverrides: true,
    script: 'answer = new CarteiraAtendente().veTudo();',
    description: 'Atendente não lê campo de caso qualificado (R6).',
})
