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
import { t_ux002_promessa, t_ux002_sem_contato, t_ux002_recusa_efetivo, t_ux002_neg, t_ux002_um_pai, t_ux002_ui, t_ux002_entrada } from './US-MOD-UX-002.now'
import { t_ux003_pos, t_ux003_neg } from './US-MOD-UX-003.now'
import { t_ux004_pos, t_ux004_neg, t_ux004_ui } from './US-MOD-UX-004.now'
import { t_ux005_pos, t_ux005_neg, t_ux005_ui, t_ux005_so_verbos } from './US-MOD-UX-005.now'
import { t_ux006_pos, t_ux006_neg } from './US-MOD-UX-006.now'
import {
    t_ux009_lista_atendente, t_ux009_lista_coordenador, t_ux009_condicoes, t_ux009_update_contato,
    t_ux009_update_ciclo_previa, t_ux009_update_ciclo_publicado,
} from './US-MOD-UX-009.now'
import { t_ux010_quadro, t_ux010_gravacao, t_ux010_equipe_coordenador, t_ux010_equipe_atendente } from './US-MOD-UX-010.now'
import {
    t_f4010_modelo, t_f4010_flows, t_f4010_etapa_pos, t_f4010_etapa_neg, t_f4010_controle, t_f4010_fumaca,
    t_f4010_acl_coord, t_f4010_acl_atendente,
} from './US-MOD-F4-010.now'
import {
    t_f4011_guardas_pos, t_f4011_guardas_neg, t_f4011_guardas_encerrada, t_f4011_envio, t_f4011_teto, t_f4011_idempotencia,
} from './US-MOD-F4-011.now'

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
        t_ux002_promessa, t_ux002_sem_contato, t_ux002_recusa_efetivo, t_ux002_neg, t_ux002_um_pai, t_ux002_ui, t_ux002_entrada,
        t_ux003_pos, t_ux003_neg,
        t_ux004_pos, t_ux004_neg, t_ux004_ui,
        t_ux005_pos, t_ux005_neg, t_ux005_ui, t_ux005_so_verbos,
        t_ux006_pos, t_ux006_neg,
        t_ux009_lista_atendente, t_ux009_lista_coordenador, t_ux009_condicoes, t_ux009_update_contato,
        t_ux009_update_ciclo_previa, t_ux009_update_ciclo_publicado,
        t_ux010_quadro, t_ux010_gravacao, t_ux010_equipe_coordenador, t_ux010_equipe_atendente,
        t_f4010_modelo, t_f4010_flows, t_f4010_etapa_pos, t_f4010_etapa_neg, t_f4010_controle, t_f4010_fumaca,
        t_f4010_acl_coord, t_f4010_acl_atendente,
        t_f4011_guardas_pos, t_f4011_guardas_neg, t_f4011_guardas_encerrada, t_f4011_envio, t_f4011_teto, t_f4011_idempotencia,
    ],
})
