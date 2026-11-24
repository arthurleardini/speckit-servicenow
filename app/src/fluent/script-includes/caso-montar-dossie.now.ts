// RF-MOD-F5-003 — monta o dossiê do caso em 3 níveis e filtra as listas relacionadas do form.
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_caso_dossie = ScriptInclude({
    $id: Now.ID['RF-MOD-F5-003_si_montar_dossie'],
    name: 'CasoDossie',
    description: 'Monta o dossiê do caso em 3 níveis (débitos e parcelamentos; comunicações, interações e regularizações; score e sinalizações) respeitando a carteira do atendente (RN-NOVO-F5-003, RN-NOVO-F5-007).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/atendimento/CasoDossie.server.js'),
})
