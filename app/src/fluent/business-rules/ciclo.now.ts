// RF-MOD-F2-002 — ciclo publicado guarda a versão do critério aplicada e os totais (RN-NOVO-F2-002).
// Business Rule (degrau 5): o campo «Critério aplicado» e os totais não mudam por form, lista ou script.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_ciclo_publicado_imutavel = BusinessRule({
    $id: Now.ID['RF-MOD-F2-002_br_ciclo_publicado_imutavel'],
    name: 'Bloquear troca de critério e totais em ciclo publicado',
    description: 'Ciclo publicado ou encerrado mantém o critério aplicado, a semente e os totais (RN-NOVO-F2-002, SEC-010).',
    table: 'x_2326104_cob_ciclo',
    when: 'before',
    action: ['update'],
    order: 100,
    active: true,
    condition: "previous.estado == 'publicado' || previous.estado == 'encerrado'",
    script: Now.include('../../server/qualificacao/cicloPublicadoImutavel.server.js'),
})
