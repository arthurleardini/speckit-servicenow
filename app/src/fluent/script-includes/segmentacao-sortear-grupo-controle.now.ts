// RF-MOD-F2-004 — sorteio do grupo de controle por ciclo, com semente gravada (RN-NOVO-F2-005/006).
// Script Include (degrau 7): lógica usada pela UI Action «Publicar ciclo», pelas business rules de
// comunicação, caso e segmentação, e pelo ATF.
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_qualificacao_ciclo = ScriptInclude({
    $id: Now.ID['RF-MOD-F2-004_si_sortear_grupo_controle'],
    name: 'QualificacaoCiclo',
    description: 'Publica o ciclo, sorteia o grupo de controle com semente gravada e diz se um contribuinte está no controle (RN-NOVO-F2-005, RN-NOVO-F2-006, SEC-010).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/qualificacao/QualificacaoCiclo.server.js'),
})
