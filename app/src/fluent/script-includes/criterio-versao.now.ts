// RF-MOD-F2-002 — regras de versão do critério, num Script Include para o ATF testar pelo servidor
// (TESTABILITY_REFACTOR: a business rule e as UI Actions só chamam este Script Include).
import '@servicenow/sdk/global'
import { ScriptInclude } from '@servicenow/sdk/core'

export const si_criterio_versao = ScriptInclude({
    $id: Now.ID['RF-MOD-F2-002_si_criterio_versao'],
    name: 'CriterioVersao',
    description: 'Publica versão do critério, cria a versão seguinte e diz quando alterar critério ou ciclo publicado é recusado (RN-NOVO-F2-001, RN-NOVO-F2-002).',
    accessibleFrom: 'package_private',
    clientCallable: false,
    active: true,
    script: Now.include('../../server/qualificacao/CriterioVersao.server.js'),
})
