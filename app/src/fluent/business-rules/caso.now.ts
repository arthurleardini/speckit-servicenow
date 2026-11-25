// RF-MOD-UX-005 — ordem das etapas do caso qualificado (polimento do design UX v1): a lista «Casos qualificados»
// ordena por etapa_ordem, que esta business rule mantém igual à posição do estágio na trilha.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_caso_ordem_etapa = BusinessRule({
    $id: Now.ID['RF-MOD-UX-005_br_caso_ordem_etapa'],
    name: 'Gravar a ordem da etapa do caso',
    description: 'Grava em «Ordem da etapa» a posição do estágio na trilha (1 Em seleção … 5 Encerrado), para ordenar «Casos qualificados» pela sequência das etapas.',
    table: 'x_2326104_cob_caso',
    when: 'before',
    action: ['insert', 'update'],
    order: 90,
    active: true,
    script: Now.include('../../server/atendimento/preencherOrdemEtapa.server.js'),
})
