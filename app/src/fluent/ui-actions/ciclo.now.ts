// RF-MOD-F2-004 — «Publicar ciclo» (TEL-009): sorteia o grupo de controle e congela a versão aplicada.
// Só o coordenador vê; QualificacaoCiclo.publicar reconfere o papel no servidor. «Distribuir lista» (RF-MOD-UX-004)
// cria os contatos da massificada do ciclo publicado (QualificacaoCiclo.distribuir).
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from '../security/roles.now'

export const ua_publicar_ciclo = UiAction({
    $id: Now.ID['RF-MOD-F2-004_ua_publicar_ciclo'],
    name: 'Publicar ciclo',
    actionName: 'x_cob_publicar_ciclo',
    table: 'x_2326104_cob_ciclo',
    hint: 'Sorteia o grupo de controle, grava a semente e congela a versão do critério',
    roles: [role_coordenador],
    condition: "current.estado == 'previa' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    script: `(function () {
    var r = new QualificacaoCiclo().publicar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

export const ua_distribuir_lista = UiAction({
    $id: Now.ID['RF-MOD-UX-004_ua_distribuir_lista'],
    name: 'Distribuir lista',
    actionName: 'x_cob_distribuir_lista',
    table: 'x_2326104_cob_ciclo',
    hint: 'Cria um contato por contribuinte da massificada, com o atendente da carteira (ou por rodízio)',
    roles: [role_coordenador],
    condition: "current.estado == 'publicado' && current.distribuido_em.nil() && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    script: `(function () {
    var r = new QualificacaoCiclo().distribuir(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

// RF-MOD-UX-009 — «Publicar ciclo» e «Distribuir lista» também na lista (menu da linha e «Ações nas linhas
// selecionadas»); executam o mesmo método do botão do form, sem redirecionar (D1, A1).
export const ual_publicar_ciclo = UiAction({
    $id: Now.ID['UX-009_ual_publicar_ciclo'],
    name: 'Publicar ciclo',
    actionName: 'x_cob_l_publicar_ciclo',
    table: 'x_2326104_cob_ciclo',
    hint: 'Publica cada ciclo marcado em prévia',
    roles: [role_coordenador],
    condition: "current.estado == 'previa' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 100,
    list: { showContextMenu: true, showListChoice: true },
    script: `(function () {
    var r = new QualificacaoCiclo().publicar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
})();`,
})

export const ual_distribuir_lista = UiAction({
    $id: Now.ID['UX-009_ual_distribuir_lista'],
    name: 'Distribuir lista',
    actionName: 'x_cob_l_distribuir_lista',
    table: 'x_2326104_cob_ciclo',
    hint: 'Cria os contatos da massificada de cada ciclo marcado',
    roles: [role_coordenador],
    condition: "current.estado == 'publicado' && current.distribuido_em.nil() && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 110,
    list: { showContextMenu: true, showListChoice: true },
    script: `(function () {
    var r = new QualificacaoCiclo().distribuir(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
})();`,
})

// RF-MOD-UX-009 — Update do ciclo: o coordenador só na prévia (edita nome, referência e critério); o admin do
// app sempre. Substitui a ação global sysverb_update na tabela (D2, A2).
export const ua_update_ciclo = UiAction({
    $id: Now.ID['UX-009_ua_update_ciclo'],
    name: 'Update',
    actionName: 'sysverb_update',
    table: 'x_2326104_cob_ciclo',
    hint: 'Grava o ciclo (coordenador só na prévia)',
    roles: [role_coordenador, role_admin],
    condition: "!current.isNewRecord() && (current.estado == 'previa' || gs.hasRole(gs.getCurrentScopeName() + '.admin'))",
    showInsert: false,
    showUpdate: true,
    order: 900,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'unstyled' },
    script: `current.update();
action.setRedirectURL(current);`,
})
