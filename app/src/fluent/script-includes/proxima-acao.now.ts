// RF-MOD-UX-010 — «O que fazer agora» (proxima_acao) de contato, caso e ciclo num Script Include: as business
// rules só chamam; o ATF testa o quadro pelo servidor (design ux-cobranca-v2-regua-flow.md, A3).
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_proxima_acao = ScriptInclude({
    $id: Now.ID['UX-010_si_proxima_acao'],
    name: 'ProximaAcao',
    description: 'Texto de «O que fazer agora» pelo estado do contato, do caso e do ciclo (RN-NOVO-UX-015).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/contato/ProximaAcao.server.js'),
})
