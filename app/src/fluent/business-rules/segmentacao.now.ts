// RF-MOD-F2-005 — segmentação com fallback «sem score» (RN-NOVO-F3-002). Business Rule (degrau 5):
// vale para a prévia gerada por script, importação e form. A regra que tira e põe no grupo de controle
// depois de publicado o ciclo está em business-rules/grupo-controle.now.ts (RF-MOD-F2-004).
import '@servicenow/sdk/global'
import { BusinessRule } from '@servicenow/sdk/core'

export const br_marcar_sem_score = BusinessRule({
    $id: Now.ID['RF-MOD-F2-005_br_marcar_sem_score'],
    name: 'Classificar segmentação com fallback sem score',
    description: 'Linha sem segmento é classificada pela versão do critério; sem score válido, valem só valor e atraso e a linha fica «Sem score» (RN-NOVO-F3-002).',
    table: 'x_2326104_cob_segmentacao',
    when: 'before',
    action: ['insert'],
    order: 100,
    active: true,
    filterCondition: 'segmentoISEMPTY^EQ',
    script: Now.include('../../server/qualificacao/marcarSemScore.server.js'),
})

export const br_propagar_sem_score = BusinessRule({
    $id: Now.ID['RF-MOD-F2-005_br_propagar_sem_score'],
    name: 'Marcar contribuinte sem score e somar no ciclo',
    description: 'Linha «Sem score» marca o contribuinte e atualiza o total «Sem score» do ciclo em prévia (RN-NOVO-F3-002).',
    table: 'x_2326104_cob_segmentacao',
    when: 'after',
    action: ['insert', 'update'],
    order: 100,
    active: true,
    filterCondition: 'sem_score=true^EQ',
    script: Now.include('../../server/qualificacao/propagarSemScore.server.js'),
})
