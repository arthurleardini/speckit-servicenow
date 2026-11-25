// RF-MOD-F4-010 — motor da régua como Flow: as 4 custom actions e as business rules da régua só chamam este
// Script Include; o ATF testa a regra pelo servidor (design ux-cobranca-v2-regua-flow.md, D10 e B3).
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_regua_motor = ScriptInclude({
    $id: Now.ID['regua_motor_si'],
    name: 'ReguaMotor',
    description: 'Régua de cobrança como Flow: agendar etapa, guardas, envio simulado, escalonamento e validação da régua e da etapa (RF-MOD-F4-010 a 012).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/regua/ReguaMotor.server.js'),
})
