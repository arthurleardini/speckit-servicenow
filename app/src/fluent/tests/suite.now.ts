// Suíte de regressão do app (cob-regressao): todo Test() de story entra aqui e roda ao fim de cada
// `npm run reinstall`. Acrescentar os testes de cada story na lista, em ordem de story.
import '@servicenow/sdk/global'
import { TestSuite } from '@servicenow/sdk/core'
import {
    t_f2002_publicar_pos, t_f2002_publicar_neg, t_f2002_imutavel_neg, t_f2002_nova_versao_pos,
    t_f2002_nova_versao_neg, t_f2002_ciclo_neg, t_f2002_gravacao_neg, t_f2002_ui_pos, t_f2002_ui_publicada, t_f2002_ui_neg,
    t_f2002_outro_caminho_neg, t_f2002_nome_neg, t_f2002_ui_threshold,
} from './US-MOD-F2-002.now'
import {
    t_f2004_sorteio_pos, t_f2004_semente_neg, t_f2004_sem_elegiveis, t_f2004_acao_neg,
    t_f2004_publicar_neg, t_f2004_imutavel_neg, t_f2004_ui, t_f2004_ui_neg, t_f2004_outro_caminho,
} from './US-MOD-F2-004.now'
import { t_f2005_score, t_f2005_fallback, t_f2005_fallback_neg, t_f2005_autorizacao } from './US-MOD-F2-005.now'
import { t_f5007_propria_pos, t_f5007_outro_neg, t_f5007_coord_pos } from './US-MOD-F5-007.now'
import { t_f5003_dossie_pos, t_f5003_dossie_neg, t_f5003_ui } from './US-MOD-F5-003.now'
import { t_ux002_promessa, t_ux002_sem_contato, t_ux002_recusa_efetivo, t_ux002_neg, t_ux002_um_pai, t_ux002_ui } from './US-MOD-UX-002.now'

export const suite_cob_regressao = TestSuite({
    $id: Now.ID['suite_cob_regressao'],
    name: 'cob-regressao',
    description: 'Regressão do app Cobrança MT: testes ATF de todas as stories (positivo e negativo por regra).',
    tests: [
        t_f2002_publicar_pos, t_f2002_publicar_neg, t_f2002_imutavel_neg, t_f2002_nova_versao_pos,
        t_f2002_nova_versao_neg, t_f2002_ciclo_neg, t_f2002_gravacao_neg, t_f2002_ui_pos, t_f2002_ui_publicada, t_f2002_ui_neg,
    t_f2002_outro_caminho_neg, t_f2002_nome_neg, t_f2002_ui_threshold,
        t_f2004_sorteio_pos, t_f2004_semente_neg, t_f2004_sem_elegiveis, t_f2004_acao_neg,
        t_f2004_publicar_neg, t_f2004_imutavel_neg, t_f2004_ui, t_f2004_ui_neg, t_f2004_outro_caminho,
        t_f2005_score, t_f2005_fallback, t_f2005_fallback_neg, t_f2005_autorizacao,
        t_f5007_propria_pos, t_f5007_outro_neg, t_f5007_coord_pos,
        t_f5003_dossie_pos, t_f5003_dossie_neg, t_f5003_ui,
        t_ux002_promessa, t_ux002_sem_contato, t_ux002_recusa_efetivo, t_ux002_neg, t_ux002_um_pai, t_ux002_ui,
    ],
})
