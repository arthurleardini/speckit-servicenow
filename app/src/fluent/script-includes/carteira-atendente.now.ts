// RF-MOD-F5-007 — regra «atendente vê só a própria carteira» num Script Include chamado pelas ACL de linha.
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_carteira_atendente = ScriptInclude({
    $id: Now.ID['RF-MOD-F5-007_si_carteira_atendente'],
    name: 'CarteiraAtendente',
    description: 'Diz se o usuário logado pode ver ou gravar um registro da carteira: coordenador e admin do app veem tudo; atendente só o que é dele (RN-NOVO-F5-007, SEC-002).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/carteira/CarteiraAtendente.server.js'),
})
