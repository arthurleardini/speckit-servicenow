// RF-MOD-UX-002 / RF-MOD-UX-003 — verbos do contato da lista (Registrar ligação, Encerrar) num Script Include:
// a UI Action só chama; o ATF testa pelo servidor.
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_contato_ligacao = ScriptInclude({
    $id: Now.ID['RF-MOD-UX-002_si_contato_ligacao'],
    name: 'ContatoLigacao',
    description: 'Registra a ligação no contato da lista com a tabela de decisão do design UX v1 (RN-NOVO-UX-003) e encerra o contato com motivo (RN-NOVO-UX-005).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/contato/ContatoLigacao.server.js'),
})
