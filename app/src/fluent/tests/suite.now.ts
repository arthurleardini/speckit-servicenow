// Suíte de regressão do app (cob-regressao): todo Test() de story entra aqui e roda ao fim de cada
// `npm run reinstall`. Acrescentar os testes de cada story na lista, em ordem de story.
import '@servicenow/sdk/global'
import { TestSuite } from '@servicenow/sdk/core'
import {
    t_f2002_publicar_pos, t_f2002_publicar_neg, t_f2002_imutavel_neg, t_f2002_nova_versao_pos,
    t_f2002_nova_versao_neg, t_f2002_ciclo_neg, t_f2002_gravacao_neg, t_f2002_ui_pos, t_f2002_ui_publicada, t_f2002_ui_neg,
    t_f2002_outro_caminho_neg, t_f2002_nome_neg, t_f2002_ui_threshold,
} from './US-MOD-F2-002.now'

export const suite_cob_regressao = TestSuite({
    $id: Now.ID['suite_cob_regressao'],
    name: 'cob-regressao',
    description: 'Regressão do app Cobrança MT: testes ATF de todas as stories (positivo e negativo por regra).',
    tests: [
        t_f2002_publicar_pos, t_f2002_publicar_neg, t_f2002_imutavel_neg, t_f2002_nova_versao_pos,
        t_f2002_nova_versao_neg, t_f2002_ciclo_neg, t_f2002_gravacao_neg, t_f2002_ui_pos, t_f2002_ui_publicada, t_f2002_ui_neg,
    t_f2002_outro_caminho_neg, t_f2002_nome_neg, t_f2002_ui_threshold,
    ],
})
