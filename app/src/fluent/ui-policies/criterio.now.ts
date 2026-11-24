// RF-MOD-F2-001 (critério de aceite do nó RF-MOD-F2-002) — com «Usar score de liquidez» desmarcado, o
// «Threshold do score» fica desabilitado. UI Policy (degrau 4): é experiência de tela; o servidor
// ignora o threshold quando o score não é usado (SegmentacaoScore, RF-MOD-F2-005).
import '@servicenow/sdk/global'
import { UiPolicy } from '@servicenow/sdk/core'

UiPolicy({
    $id: Now.ID['RF-MOD-F2-002_uip_threshold_sem_score'],
    table: 'x_2326104_cob_criterio',
    shortDescription: 'Threshold desabilitado sem score',
    description: 'Com «Usar score de liquidez» desmarcado, o «Threshold do score» fica somente leitura.',
    conditions: 'usar_score=false^EQ',
    onLoad: true,
    global: true,
    reverseIfFalse: true,
    actions: [{ field: 'threshold_score', readOnly: true }],
})
