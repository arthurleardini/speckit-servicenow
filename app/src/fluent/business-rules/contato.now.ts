// RF-MOD-UX-002 / GAP-150 — «Resultado desta ligação» é campo de entrada do botão «Registrar ligação»: a
// business rule limpa o valor em toda gravação, então o form abre vazio e o verbo usa só o que foi escolhido agora.
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_contato_resultado_ligacao = BusinessRule({
    $id: Now.ID['RF-MOD-UX-002_br_contato_resultado_ligacao'],
    name: 'Limpar o resultado desta ligação',
    description: '«Resultado desta ligação» nunca fica gravado: o form abre vazio e «Registrar ligação» lê só o resultado escolhido nesta ação; o registrado vai para «Último resultado» (GAP-150).',
    table: 'x_2326104_cob_contato',
    when: 'before',
    action: ['insert', 'update'],
    order: 50,
    active: true,
    script: Now.include('../../server/contato/limparResultadoLigacao.server.js'),
})
