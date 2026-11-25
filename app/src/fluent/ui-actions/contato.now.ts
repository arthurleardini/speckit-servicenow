// RF-MOD-UX-002 / RF-MOD-UX-003 — verbos do contato da lista (TEL-035). Cada verbo é UI Action cliente +
// servidor (design UX v1 🔴3): no cliente marca os campos do verbo como obrigatórios e envia; no servidor o
// ContatoLigacao revalida tudo e devolve {ok, mensagem}. A anotação da ligação é escrita em «Comentários».
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_atendente, role_coordenador, role_admin } from '../security/roles.now'

export const ua_registrar_ligacao = UiAction({
    $id: Now.ID['RF-MOD-UX-002_ua_registrar_ligacao'],
    name: 'Registrar ligação',
    actionName: 'x_cob_registrar_ligacao',
    table: 'x_2326104_cob_contato',
    hint: 'Escolha o «Resultado desta ligação», escreva a anotação em Comentários e, se combinou retorno, informe a próxima ação',
    roles: [role_atendente, role_coordenador],
    condition: "current.status != 'encerrado' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    client: { isClient: true, onClick: 'cobRegistrarLigacao()' },
    script: `function cobRegistrarLigacao() {
    g_form.setMandatory('motivo_encerramento', false);
    g_form.setMandatory('resultado_ligacao', true);
    g_form.setMandatory('comentarios', true);
    gsftSubmit(null, g_form.getFormElement(), 'x_cob_registrar_ligacao');
}

if (typeof window == 'undefined') {
    cobRegistrarLigacaoServidor();
}

function cobRegistrarLigacaoServidor() {
    var r = new ContatoLigacao().registrar(current, {
        resultado: current.getValue('resultado_ligacao'), // campo de entrada: nunca gravado, vem só desta ação (GAP-150)
        anotacao: current.getValue('comentarios'),
        retorno: current.proxima_acao_em.changes() ? current.getValue('proxima_acao_em') : ''
    });
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
        current.setAbortAction(true);
    }
    action.setRedirectURL(current);
}`,
})

export const ua_encerrar_contato = UiAction({
    $id: Now.ID['RF-MOD-UX-003_ua_encerrar_contato'],
    name: 'Encerrar',
    actionName: 'x_cob_encerrar_contato',
    table: 'x_2326104_cob_contato',
    hint: 'Informe o motivo de encerramento; o contato sai de «Minha lista»',
    roles: [role_atendente, role_coordenador],
    condition: "current.status != 'encerrado' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 200,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'unstyled' },
    client: { isClient: true, onClick: 'cobEncerrarContato()' },
    script: `function cobEncerrarContato() {
    g_form.setMandatory('resultado_ligacao', false);
    g_form.setMandatory('comentarios', false);
    g_form.setMandatory('motivo_encerramento', true);
    gsftSubmit(null, g_form.getFormElement(), 'x_cob_encerrar_contato');
}

if (typeof window == 'undefined') {
    cobEncerrarContatoServidor();
}

function cobEncerrarContatoServidor() {
    var r = new ContatoLigacao().encerrar(current, current.getValue('motivo_encerramento'));
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
        current.setAbortAction(true);
    }
    action.setRedirectURL(current);
}`,
})

// RF-MOD-UX-009 — verbos do contato também na lista (menu da linha, botão direito). Pedem anotação ou motivo,
// então só abrem o form, onde o verbo é executado (design ux-cobranca-v2-regua-flow.md, D1 e A1).
export const ual_registrar_ligacao = UiAction({
    $id: Now.ID['UX-009_ual_registrar_ligacao'],
    name: 'Registrar ligação…',
    actionName: 'x_cob_l_registrar_ligacao',
    table: 'x_2326104_cob_contato',
    hint: 'Abre o contato para registrar o resultado da ligação',
    roles: [role_atendente, role_coordenador],
    condition: "current.status != 'encerrado'",
    showInsert: false,
    showUpdate: true,
    order: 100,
    list: { showContextMenu: true },
    script: `action.setRedirectURL(current);`,
})

export const ual_encerrar_contato = UiAction({
    $id: Now.ID['UX-009_ual_encerrar_contato'],
    name: 'Encerrar…',
    actionName: 'x_cob_l_encerrar_contato',
    table: 'x_2326104_cob_contato',
    hint: 'Abre o contato para encerrar com o motivo',
    roles: [role_atendente, role_coordenador],
    condition: "current.status != 'encerrado'",
    showInsert: false,
    showUpdate: true,
    order: 200,
    list: { showContextMenu: true },
    script: `action.setRedirectURL(current);`,
})

// RF-MOD-UX-009 — Update do contato só para o admin do app: o atendente e o coordenador mudam o contato pelos
// verbos. Mesmo actionName da ação global (sysverb_update), que esta substitui na tabela (D2, A2).
export const ua_update_contato = UiAction({
    $id: Now.ID['UX-009_ua_update_contato'],
    name: 'Update',
    actionName: 'sysverb_update',
    table: 'x_2326104_cob_contato',
    hint: 'Grava o contato (só admin do app)',
    roles: [role_admin],
    condition: '!current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 900,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'unstyled' },
    script: `current.update();
action.setRedirectURL(current);`,
})
