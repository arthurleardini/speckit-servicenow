// RF-MOD-UX-002 / RF-MOD-UX-003 — verbos do contato da lista (TEL-035). Cada verbo é UI Action cliente +
// servidor (design UX v1 🔴3): no cliente marca os campos do verbo como obrigatórios e envia; no servidor o
// ContatoLigacao revalida tudo e devolve {ok, mensagem}. A anotação da ligação é escrita em «Comentários».
import '@servicenow/sdk/global'
import { UiAction } from '@servicenow/sdk/core'
import { role_atendente, role_coordenador } from '../security/roles.now'

export const ua_registrar_ligacao = UiAction({
    $id: Now.ID['RF-MOD-UX-002_ua_registrar_ligacao'],
    name: 'Registrar ligação',
    actionName: 'x_cob_registrar_ligacao',
    table: 'x_2326104_cob_contato',
    hint: 'Escolha o resultado, escreva a anotação em Comentários e, se combinou retorno, informe a próxima ação',
    roles: [role_atendente, role_coordenador],
    condition: "current.status != 'encerrado' && !current.isNewRecord()",
    showInsert: false,
    showUpdate: true,
    form: { showButton: true, showLink: false, showContextMenu: false, style: 'primary' },
    client: { isClient: true, onClick: 'cobRegistrarLigacao()' },
    script: `function cobRegistrarLigacao() {
    g_form.setMandatory('motivo_encerramento', false);
    g_form.setMandatory('ultimo_resultado', true);
    g_form.setMandatory('comentarios', true);
    gsftSubmit(null, g_form.getFormElement(), 'x_cob_registrar_ligacao');
}

if (typeof window == 'undefined') {
    cobRegistrarLigacaoServidor();
}

function cobRegistrarLigacaoServidor() {
    var r = new ContatoLigacao().registrar(current, {
        resultado: current.getValue('ultimo_resultado'),
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
