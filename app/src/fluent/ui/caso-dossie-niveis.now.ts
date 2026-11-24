// RF-MOD-F5-003 — dossiê do caso em 3 níveis (RN-NOVO-F5-003, fio condutor 4), na Core UI clássica.
// Configuração, sem tela custom: view própria «Dossiê do caso» com as seções Caso, Score, Sinalizações
// e Encerramento, listas relacionadas dos 3 níveis e uma View Rule que abre o form do caso nesta view.
// O form TEL-024 do scaffold (view padrão) fica intocado. As listas relacionadas respeitam as ACL de
// carteira (RN-NOVO-F5-007): o atendente só vê linhas do próprio contribuinte.
import '@servicenow/sdk/global'
import { Form, Formatter, Record, UiPolicy } from '@servicenow/sdk/core'

export const view_dossie = Record({
    $id: Now.ID['RF-MOD-F5-003_view_dossie'],
    table: 'sys_ui_view',
    data: { name: 'x_2326104_cob_dossie', title: 'Dossiê do caso' },
})

// O Form() não leva $id (a API não aceita); a view e as listas levam o ID do RF.
export const form_dossie = Form({
    table: 'x_2326104_cob_caso',
    view: view_dossie,
    sections: [
        {
            caption: 'Caso',
            content: [
                { layout: 'two-column', leftElements: [{ field: 'contribuinte', type: 'table_field' }, { field: 'atendente', type: 'table_field' }, { field: 'ciclo', type: 'table_field' }], rightElements: [{ field: 'estagio', type: 'table_field' }, { field: 'prioridade', type: 'table_field' }, { field: 'valor_em_aberto', type: 'table_field' }] },
            ],
        },
        {
            caption: 'Score',
            content: [{ layout: 'two-column', leftElements: [{ field: 'score', type: 'table_field' }], rightElements: [{ field: 'sem_score', type: 'table_field' }] }],
        },
        {
            caption: 'Sinalizações',
            content: [{ layout: 'one-column', elements: [{ field: 'sinal_coercitivo', type: 'table_field' }, { field: 'sinal_coercitivo_desc', type: 'table_field' }] }],
        },
        {
            caption: 'Encerramento',
            content: [{ layout: 'two-column', leftElements: [{ field: 'motivo_encerramento', type: 'table_field' }], rightElements: [{ field: 'encerrado_em', type: 'table_field' }] }],
        },
        {
            caption: 'Atividades',
            content: [{ layout: 'one-column', elements: [{ field: 'comentarios', type: 'table_field' }, { type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],
        },
    ],
})

// Nível 1 e 2: listas que saem do contribuinte do caso (relacionamento explícito).
const consulta = `(function refineQuery(current, parent) {
    new CasoDossie().filtrarPorContribuinte(current, parent);
})(current, parent);`

export const rel_debitos = Record({
    $id: Now.ID['RF-MOD-F5-003_rel_debitos'],
    table: 'sys_relationship',
    data: { name: 'Débitos do contribuinte do caso', advanced: false, basic_apply_to: 'x_2326104_cob_caso', basic_query_from: 'x_2326104_cob_debito', query_with: consulta },
})

export const rel_parcelamentos = Record({
    $id: Now.ID['RF-MOD-F5-003_rel_parcelamentos'],
    table: 'sys_relationship',
    data: { name: 'Parcelamentos do contribuinte do caso', advanced: false, basic_apply_to: 'x_2326104_cob_caso', basic_query_from: 'x_2326104_cob_parcelamento', query_with: consulta },
})

export const rel_comunicacoes = Record({
    $id: Now.ID['RF-MOD-F5-003_rel_comunicacoes'],
    table: 'sys_relationship',
    data: { name: 'Comunicações do contribuinte do caso', advanced: false, basic_apply_to: 'x_2326104_cob_caso', basic_query_from: 'x_2326104_cob_comunicacao', query_with: consulta },
})

export const rel_regularizacoes = Record({
    $id: Now.ID['RF-MOD-F5-003_rel_regularizacoes'],
    table: 'sys_relationship',
    data: { name: 'Regularizações do contribuinte do caso', advanced: false, basic_apply_to: 'x_2326104_cob_caso', basic_query_from: 'x_2326104_cob_regularizacao', query_with: consulta },
})

const listas = Record({
    $id: Now.ID['RF-MOD-F5-003_rel_listas_dossie'],
    table: 'sys_ui_related_list',
    data: { name: 'x_2326104_cob_caso', view: view_dossie },
})

Record({
    $id: Now.ID['RF-MOD-F5-003_rel_entrada_debitos'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listas, position: 0, related_list: `REL:${rel_debitos.$id}` },
})

Record({
    $id: Now.ID['RF-MOD-F5-003_rel_entrada_parcelamentos'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listas, position: 1, related_list: `REL:${rel_parcelamentos.$id}` },
})

Record({
    $id: Now.ID['RF-MOD-F5-003_rel_entrada_comunicacoes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listas, position: 2, related_list: `REL:${rel_comunicacoes.$id}` },
})

Record({
    $id: Now.ID['RF-MOD-F5-003_rel_entrada_interacoes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listas, position: 3, related_list: 'x_2326104_cob_interacao.caso' },
})

Record({
    $id: Now.ID['RF-MOD-F5-003_rel_entrada_regularizacoes'],
    table: 'sys_ui_related_list_entry',
    data: { list_id: listas, position: 4, related_list: `REL:${rel_regularizacoes.$id}` },
})

// O form do caso abre sempre no dossiê (UI Action não troca view: View Rule — servicenow-ui.md).
Record({
    $id: Now.ID['RF-MOD-F5-003_viewrule_dossie'],
    table: 'sysrule_view',
    data: {
        name: 'Caso abre no dossiê',
        table: 'x_2326104_cob_caso',
        advanced: true,
        active: true,
        order: 100,
        overrides_user_preference: true,
        script: `(function overrideView(view, is_list) {
    answer = is_list ? null : 'x_2326104_cob_dossie';
})(view, is_list);`,
    },
})

// Nível 3: o dossiê sinaliza medida coercitiva, não executa (RN-NOVO-F5-004) — sinalização somente leitura.
UiPolicy({
    $id: Now.ID['RF-MOD-F5-003_uip_sinalizacoes_somente_leitura'],
    table: 'x_2326104_cob_caso',
    shortDescription: 'Sinalizações do dossiê somente leitura',
    description: 'A sinalização coercitiva vem da fonte e só é mostrada no dossiê (RN-NOVO-F5-004).',
    onLoad: true,
    global: true,
    reverseIfFalse: false,
    actions: [
        { field: 'sinal_coercitivo', readOnly: true },
        { field: 'sinal_coercitivo_desc', readOnly: true },
    ],
})
