// RF-MOD-F2-002 — ações de tela da versão do critério (TEL-008). Só o coordenador as vê; o servidor
// reconfere o papel no CriterioVersao, porque UI Action pode ser chamada por URL (security.mdc).
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'

export const ua_publicar_versao = UiAction({
    $id: Now.ID['RF-MOD-F2-002_ua_publicar_versao'],
    name: 'Publicar versão',
    actionName: 'x_cob_publicar_versao',
    table: 'x_2326104_cob_criterio',
    hint: 'Publica a versão em rascunho; depois de publicada ela não muda',
    roles: [role_coordenador],
    condition: "current.estado == 'rascunho' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 100,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    script: `(function () {
    var r = new CriterioVersao().publicar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

export const ua_criar_nova_versao = UiAction({
    $id: Now.ID['RF-MOD-F2-002_ua_criar_nova_versao'],
    name: 'Criar nova versão',
    actionName: 'x_cob_criar_nova_versao',
    table: 'x_2326104_cob_criterio',
    hint: 'Cria a versão seguinte em rascunho, ligada a esta versão publicada',
    roles: [role_coordenador],
    condition: "current.estado == 'publicada'",
    showInsert: false,
    showUpdate: true,
    order: 200,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'unstyled' },
    script: `(function () {
    var r = new CriterioVersao().criarNovaVersao(current);
    if (!r.ok) {
        gs.addErrorMessage(r.mensagem);
        action.setRedirectURL(current);
        return;
    }
    gs.addInfoMessage(r.mensagem);
    var nova = new GlideRecord('x_2326104_cob_criterio');
    nova.get(r.sysId);
    action.setRedirectURL(nova);
})();`,
})

// RF-MOD-UX-009 — verbos do critério no menu da linha da lista: «Publicar versão» executa o mesmo método do
// form; «Criar nova versão…» abre o form da versão publicada, onde o botão cria a versão (D1, A1).
export const ual_publicar_versao = UiAction({
    $id: Now.ID['UX-009_ual_publicar_versao'],
    name: 'Publicar versão',
    actionName: 'x_cob_l_publicar_versao',
    table: 'x_2326104_cob_criterio',
    hint: 'Publica a versão em rascunho',
    roles: [role_coordenador],
    condition: "current.estado == 'rascunho' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    order: 100,
    list: { showContextMenu: true },
    script: `(function () {
    var r = new CriterioVersao().publicar(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
})();`,
})

export const ual_criar_nova_versao = UiAction({
    $id: Now.ID['UX-009_ual_criar_nova_versao'],
    name: 'Criar nova versão…',
    actionName: 'x_cob_l_criar_nova_versao',
    table: 'x_2326104_cob_criterio',
    hint: 'Abre a versão publicada para criar a seguinte',
    roles: [role_coordenador],
    condition: "current.estado == 'publicada'",
    showInsert: false,
    showUpdate: true,
    order: 200,
    list: { showContextMenu: true },
    script: `action.setRedirectURL(current);`,
})
