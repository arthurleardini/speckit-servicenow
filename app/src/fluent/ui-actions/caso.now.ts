// RF-MOD-UX-005 — verbos do caso qualificado do coordenador (TEL-024 / view «Dossiê do caso»). «Avançar etapa»
// segue a ordem das etapas; «Encerrar caso» é cliente + servidor: no cliente marca o motivo como obrigatório,
// no servidor o CasoConducao revalida e devolve {ok, mensagem} (design UX v1 🔴3).
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'

export const ua_avancar_etapa = UiAction({
    $id: Now.ID['RF-MOD-UX-005_ua_avancar_etapa'],
    name: 'Avançar etapa',
    actionName: 'x_cob_avancar_etapa',
    table: 'x_2326104_cob_caso',
    hint: 'Leva o caso à etapa seguinte: Em seleção → Caso selecionado → Dossiê gerado → Condução',
    roles: [role_coordenador],
    condition: "current.estagio != 'encerrado' && current.estagio != 'conducao' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    script: `(function () {
    var r = new CasoConducao().avancarEtapa(current);
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
    }
    action.setRedirectURL(current);
})();`,
})

export const ua_encerrar_caso = UiAction({
    $id: Now.ID['RF-MOD-UX-005_ua_encerrar_caso'],
    name: 'Encerrar caso',
    actionName: 'x_cob_encerrar_caso',
    table: 'x_2326104_cob_caso',
    hint: 'Informe o motivo de encerramento',
    roles: [role_coordenador],
    condition: "current.estagio != 'encerrado' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'unstyled' },
    client: { isClient: true, onClick: 'cobEncerrarCaso()' },
    script: `function cobEncerrarCaso() {
    g_form.setMandatory('motivo_encerramento', true);
    gsftSubmit(null, g_form.getFormElement(), 'x_cob_encerrar_caso');
}

if (typeof window == 'undefined') {
    cobEncerrarCasoServidor();
}

function cobEncerrarCasoServidor() {
    var r = new CasoConducao().encerrar(current, current.getValue('motivo_encerramento'));
    if (r.ok) {
        gs.addInfoMessage(r.mensagem);
    } else {
        gs.addErrorMessage(r.mensagem);
        current.setAbortAction(true);
    }
    action.setRedirectURL(current);
}`,
})
