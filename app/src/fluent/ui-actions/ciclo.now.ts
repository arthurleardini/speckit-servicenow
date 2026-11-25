// RF-MOD-F2-004 — «Publicar ciclo» (TEL-009): sorteia o grupo de controle e congela a versão aplicada.
// Só o coordenador vê; QualificacaoCiclo.publicar reconfere o papel no servidor. «Distribuir lista» (RF-MOD-UX-004)
// cria os contatos da massificada do ciclo publicado (QualificacaoCiclo.distribuir).
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'

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
