// RF-MOD-F4-010 — segundos de um «dia» da régua (design ux-cobranca-v2-regua-flow.md, D11 e B7): 60 neste app de
// demonstração (dia 30 vira minuto 30); 86400 em produção. Mudar vale para as próximas etapas agendadas.
import '@servicenow/sdk/global'
import { Property } from '@servicenow/sdk/core'

export const prop_regua_segundos_por_dia = Property({
    $id: Now.ID['RF-MOD-F4-010_prop_segundos_por_dia'],
    name: 'x_2326104_cob.regua.segundos_por_dia',
    type: 'integer',
    value: 60,
    description: 'Segundos de um dia da régua de cobrança: 86400 em produção; 60 na demonstração (a régua IPVA encaminha em 35 minutos).',
})
