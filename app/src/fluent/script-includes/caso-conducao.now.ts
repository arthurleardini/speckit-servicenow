// RF-MOD-UX-005 — verbos do caso qualificado (Avançar etapa, Encerrar caso) num Script Include: a UI Action só
// chama; o ATF testa pelo servidor.
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_caso_conducao = ScriptInclude({
    $id: Now.ID['RF-MOD-UX-005_si_caso_conducao'],
    name: 'CasoConducao',
    description: 'Avança o caso qualificado pela ordem das etapas e encerra com motivo obrigatório; só coordenador e admin do app (RN-NOVO-UX-008).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/atendimento/CasoConducao.server.js'),
})
