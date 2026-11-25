// RF-MOD-F4-012 — «Pausar» e «Ativar» a régua (TASK-MOD-F4-012-03, design ux-v2 A1 e B4). Só coordenador e admin do
// app veem; a regra fica no ReguaMotor (pausar/ativar grava «Ativa») e a BR da régua encerra as inscrições ativas
// com «Régua pausada». Uma UI Action por superfície (form e lista), mesmo método.
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from '../security/roles.now'

export const ua_pausar_regua = UiAction({
    $id: Now.ID['F4-010_ua_pausar_regua'],
    name: 'Pausar',
    actionName: 'x_cob_pausar_regua',
    table: 'x_2326104_cob_regua',
    hint: 'Para a régua: as inscrições ativas encerram como «Régua pausada»',
    roles: [role_coordenador, role_admin],
    condition: 'current.ativa == true && !current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'destructive' },
    script: `(function () {
    var r = new ReguaMotor().pausar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

export const ua_ativar_regua = UiAction({
    $id: Now.ID['F4-010_ua_ativar_regua'],
    name: 'Ativar',
    actionName: 'x_cob_ativar_regua',
    table: 'x_2326104_cob_regua',
    hint: 'Volta a inscrever na régua; as inscrições encerradas pela pausa não voltam',
    roles: [role_coordenador, role_admin],
    condition: 'current.ativa == false && !current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    script: `(function () {
    var r = new ReguaMotor().ativar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

export const ual_pausar_regua = UiAction({
    $id: Now.ID['F4-010_ual_pausar_regua'],
    name: 'Pausar',
    actionName: 'x_cob_l_pausar_regua',
    table: 'x_2326104_cob_regua',
    hint: 'Pausa cada régua marcada',
    roles: [role_coordenador, role_admin],
    condition: 'current.ativa == true && !current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 100,
    list: { showContextMenu: true, showListChoice: true },
    script: `(function () {
    var r = new ReguaMotor().pausar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
})();`,
})

// RF-MOD-F4-014 — «Ver execuções» e «Abrir no Flow Designer» no form da régua (D12, D15; design ux-v2 A1 e B6).
// Links do form, para coordenador e admin do app (o papel deles contém flow_designer e flow_operator,
// security/coordenador-flow.now.ts). O endereço sai do ReguaMotor (urlExecucoes, urlDesigner), testado no ATF.
export const ua_ver_execucoes = UiAction({
    $id: Now.ID['F4-014_ua_ver_execucoes'],
    name: 'Ver execuções',
    actionName: 'x_cob_ver_execucoes',
    table: 'x_2326104_cob_regua',
    hint: 'Lista as execuções do Flow desta régua (uma por inscrição)',
    roles: [role_coordenador, role_admin],
    condition: '!current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 300,
    form: { showButton: false, showLink: true, showContextMenu: false },
    script: `(function () {
    var url = new ReguaMotor().urlExecucoes(current);
    if (url) {
        action.setRedirectURL(url);
    } else {
        gs.addErrorMessage(ReguaMotor.MSG_REGUA_NAO_ACHADA);
        action.setRedirectURL(current);
    }
})();`,
})

export const ua_abrir_designer = UiAction({
    $id: Now.ID['F4-014_ua_abrir_designer'],
    name: 'Abrir no Flow Designer',
    actionName: 'x_cob_abrir_designer',
    table: 'x_2326104_cob_regua',
    hint: 'Abre o Flow desta régua no Flow Designer. Mudança feita lá vale até o próximo reinstall, salvo se levada à fonte',
    roles: [role_coordenador, role_admin],
    condition: '!current.isNewRecord() && !current.flow.nil()',
    showInsert: false,
    showUpdate: true,
    order: 310,
    form: { showButton: false, showLink: true, showContextMenu: false },
    script: `(function () {
    var url = new ReguaMotor().urlDesigner(current);
    if (url) {
        action.setRedirectURL(url);
    } else {
        gs.addErrorMessage(ReguaMotor.MSG_SEM_FLOW);
        action.setRedirectURL(current);
    }
})();`,
})

export const ual_ativar_regua = UiAction({
    $id: Now.ID['F4-010_ual_ativar_regua'],
    name: 'Ativar',
    actionName: 'x_cob_l_ativar_regua',
    table: 'x_2326104_cob_regua',
    hint: 'Ativa cada régua marcada',
    roles: [role_coordenador, role_admin],
    condition: 'current.ativa == false && !current.isNewRecord()',
    showInsert: false,
    showUpdate: true,
    order: 110,
    list: { showContextMenu: true, showListChoice: true },
    script: `(function () {
    var r = new ReguaMotor().ativar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
})();`,
})
