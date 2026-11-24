// RF-MOD-F2-005 — score de liquidez como critério, com fallback «sem score» (RN-NOVO-F3-001/002).
// Script Include (degrau 7): lógica usada pelas business rules da segmentação e pelo ATF.
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_segmentacao_score = ScriptInclude({
    $id: Now.ID['RF-MOD-F2-005_si_fallback_sem_score'],
    name: 'SegmentacaoScore',
    description: 'Classifica o contribuinte pela versão do critério: score válido acima do threshold qualifica; sem score válido, valem só valor e atraso e o contribuinte fica «Sem score» (RN-NOVO-F3-002).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/qualificacao/SegmentacaoScore.server.js'),
})
