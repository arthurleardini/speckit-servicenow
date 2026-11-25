// ATF da US-MOD-UX-009 — ações de negócio na lista, Update só para quem precisa e New só para o admin
// (RF-MOD-UX-009, RN-NOVO-UX-013, RN-NOVO-UX-014; design ux-cobranca-v2-regua-flow.md, A1, A2 e B9).
// Massa fictícia criada pelo próprio teste (o rollback do ATF desfaz); usuários criados pelo ATF com o papel.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_atendente, role_coordenador } from '../security/roles.now'

export const t_ux009_lista_atendente = Test({
    $id: Now.ID['US-MOD-UX-009_atf_lista_atendente'],
    name: 'RF-MOD-UX-009 — ações de lista no menu da linha, separadas das de form, com os papéis do form',
    description: 'Confere no servidor as UI Actions de lista: cada verbo está no menu da linha (list_context_menu) e não no cabeçalho do form; os de servidor também em «Ações nas linhas selecionadas» (list_choice); show_update ligado (sem ele a ação não aparece na lista, F0); papéis iguais aos do botão do form (atendente e coordenador no contato; só coordenador no caso, ciclo e critério). O menu da linha aberto pelo atendente é conferido por Playwright (print em screens/ux-v2): no Client Test Runner o menu de contexto da lista não é montado (RN-NOVO-UX-013, G1).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-009_test_01'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    var E = gs.getCurrentScopeName();
    function acao(nome) {
        var a = new GlideRecord('sys_ui_action');
        a.addQuery('action_name', nome);
        a.addQuery('sys_scope.scope', E);
        a.query();
        a.next();
        return a;
    }
    function b(a, f) { var v = String(a.getValue(f)); return (v == 'true' || v == '1') ? '1' : '0'; }
    function papeis(a) {
        var r = new GlideRecord('sys_ui_action_role');
        r.addQuery('sys_ui_action', a.getUniqueValue());
        r.query();
        var n = [];
        while (r.next()) { n.push(r.sys_user_role.name.toString()); }
        return n.sort().join(',');
    }
    var CONTATO = [E + '.atendente', E + '.coordenador'].sort().join(',');
    var COORD = E + '.coordenador';
    var lista = [
        ['x_cob_l_registrar_ligacao', false, CONTATO], ['x_cob_l_encerrar_contato', false, CONTATO],
        ['x_cob_l_avancar_etapa', true, COORD], ['x_cob_l_encerrar_caso', false, COORD],
        ['x_cob_l_publicar_ciclo', true, COORD], ['x_cob_l_distribuir_lista', true, COORD],
        ['x_cob_l_publicar_versao', false, COORD], ['x_cob_l_criar_nova_versao', false, COORD]
    ];
    describe('UI Actions de lista', function() {
        it('menu da linha, sem botão de form, com show_update', function() {
            for (var i = 0; i < lista.length; i++) {
                var a = acao(lista[i][0]);
                expect(a.isValidRecord() ? lista[i][0] : 'falta ' + lista[i][0]).toBe(lista[i][0]);
                expect(b(a, 'list_context_menu') + ' ' + lista[i][0]).toBe('1 ' + lista[i][0]);
                expect(b(a, 'form_button') + ' ' + lista[i][0]).toBe('0 ' + lista[i][0]);
                expect(b(a, 'show_update') + ' ' + lista[i][0]).toBe('1 ' + lista[i][0]);
            }
        });
        it('«Ações nas linhas selecionadas» só para os verbos de servidor', function() {
            for (var i = 0; i < lista.length; i++) {
                expect(b(acao(lista[i][0]), 'list_choice') + ' ' + lista[i][0]).toBe((lista[i][1] ? '1 ' : '0 ') + lista[i][0]);
            }
        });
        it('papéis iguais aos do botão do form', function() {
            for (var i = 0; i < lista.length; i++) {
                expect(papeis(acao(lista[i][0])) + ' ' + lista[i][0]).toBe(lista[i][2] + ' ' + lista[i][0]);
            }
            expect(papeis(acao('x_cob_registrar_ligacao'))).toBe(CONTATO);
            expect(papeis(acao('x_cob_publicar_ciclo'))).toBe(COORD);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux009_lista_coordenador = Test({
    $id: Now.ID['US-MOD-UX-009_atf_lista_coordenador'],
    name: 'RF-MOD-UX-009 — coordenador vê «Publicar ciclo» e «Distribuir lista» em «Ações nas linhas selecionadas» de «Ciclo do mês»',
    description: 'Coordenador abre «Ciclo do mês» (com o ciclo fictício em prévia): «Ações nas linhas selecionadas» traz «Publicar ciclo» e «Distribuir lista»; os botões de form («Publicar ciclo» do form) não entram na lista (RN-NOVO-UX-013, G1, D1).',
    failOnServerError: true,
}, (atf) => {
    atf.server.recordInsert({
        $id: Now.ID['US-MOD-UX-009_test_07'],
        table: 'x_2326104_cob_ciclo',
        fieldValues: { nome: 'ATF ciclo UX-009 lista (fictício)', estado: 'previa' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-009_test_08'], firstName: 'ATF', lastName: 'Coordenador UX-009 lista', roles: [role_coordenador] })
    atf.uiTestScript.runTest({
        // passo de script de UI (o comentário evita que o atf.mjs leia este runTest como Test())
        $id: Now.ID['US-MOD-UX-009_test_09'],
        script: `
await sn_atf.navigate('/x_2326104_cob_ciclo_list.do?sysparm_view=x_2326104_cob_tel_036&sysparm_query=estado!%3Dencerrado')
await screen.findByText('ATF ciclo UX-009 lista (fictício)', {}, { timeout: 20000 })
const opcoes = await sn_atf.evaluate(() => {
    var t = [];
    document.querySelectorAll('select option').forEach(function (o) { t.push(o.textContent.trim()); });
    return t.join('|');
})
expect(opcoes).toContain('Publicar ciclo')
expect(opcoes).toContain('Distribuir lista')
`,
    })
})

export const t_ux009_condicoes = Test({
    $id: Now.ID['US-MOD-UX-009_atf_condicoes_lista'],
    name: 'RF-MOD-UX-009 — as ações de lista seguem o estado do registro; New só para o admin',
    description: 'Avalia a condition de cada UI Action de lista contra registros fictícios: «Registrar ligação…»/«Encerrar…» só em contato não encerrado; «Avançar etapa» não em condução nem encerrado; «Publicar ciclo» só na prévia; «Distribuir lista» só no publicado sem distribuição; «Publicar versão» só em rascunho. Confere que o New de contato, régua e etapa (lista e related list) é só do admin do app (RN-NOVO-UX-013 e RN-NOVO-UX-014, positivo e negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-009_test_11'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function acao(nome) {
        var a = new GlideRecord('sys_ui_action');
        a.addQuery('action_name', nome);
        a.addQuery('sys_scope.scope', gs.getCurrentScopeName());
        a.query();
        a.next();
        return a;
    }
    function vale(nome, tabela, campos) {
        var r = new GlideRecord(tabela);
        r.initialize();
        for (var k in campos) { r.setValue(k, campos[k]); }
        var ev = new GlideScopedEvaluator();
        return ev.evaluateScript(acao(nome), 'condition', { current: r }) == true;
    }
    var S = gs.getCurrentScopeName() + '_';
    describe('Condições das ações de lista', function() {
        it('contato: só não encerrado', function() {
            expect(vale('x_cob_l_registrar_ligacao', S + 'contato', { status: 'a_ligar' })).toBe(true);
            expect(vale('x_cob_l_encerrar_contato', S + 'contato', { status: 'retornar' })).toBe(true);
            expect(vale('x_cob_l_registrar_ligacao', S + 'contato', { status: 'encerrado' })).toBe(false);
            expect(vale('x_cob_l_encerrar_contato', S + 'contato', { status: 'encerrado' })).toBe(false);
        });
        it('caso: avançar até o dossiê; encerrar até condução', function() {
            expect(vale('x_cob_l_avancar_etapa', S + 'caso', { estagio: 'em_selecao' })).toBe(true);
            expect(vale('x_cob_l_avancar_etapa', S + 'caso', { estagio: 'conducao' })).toBe(false);
            expect(vale('x_cob_l_encerrar_caso', S + 'caso', { estagio: 'conducao' })).toBe(true);
            expect(vale('x_cob_l_encerrar_caso', S + 'caso', { estagio: 'encerrado' })).toBe(false);
        });
        it('ciclo: publicar na prévia; distribuir no publicado sem distribuição', function() {
            expect(vale('x_cob_l_publicar_ciclo', S + 'ciclo', { estado: 'previa' })).toBe(true);
            expect(vale('x_cob_l_publicar_ciclo', S + 'ciclo', { estado: 'publicado' })).toBe(false);
            expect(vale('x_cob_l_distribuir_lista', S + 'ciclo', { estado: 'publicado' })).toBe(true);
            expect(vale('x_cob_l_distribuir_lista', S + 'ciclo', { estado: 'publicado', distribuido_em: '2026-11-01 13:00:00' })).toBe(false);
            expect(vale('x_cob_l_distribuir_lista', S + 'ciclo', { estado: 'previa' })).toBe(false);
        });
        it('critério: publicar só em rascunho; criar nova versão só da publicada', function() {
            expect(vale('x_cob_l_publicar_versao', S + 'criterio', { estado: 'rascunho' })).toBe(true);
            expect(vale('x_cob_l_publicar_versao', S + 'criterio', { estado: 'publicada' })).toBe(false);
            expect(vale('x_cob_l_criar_nova_versao', S + 'criterio', { estado: 'publicada' })).toBe(true);
            expect(vale('x_cob_l_criar_nova_versao', S + 'criterio', { estado: 'rascunho' })).toBe(false);
        });
        it('New de contato, régua e etapa só para o admin do app', function() {
            var lc = new GlideRecord('sys_ui_list_control');
            lc.addEncodedQuery('nameIN' + S + 'contato,' + S + 'regua,' + S + 'regua_etapa');
            lc.query();
            var n = 0;
            while (lc.next()) {
                expect(lc.getValue('new_roles')).toBe(gs.getCurrentScopeName() + '.admin');
                n++;
            }
            expect(n).toBe(4);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux009_update_contato = Test({
    $id: Now.ID['US-MOD-UX-009_atf_update_contato'],
    name: 'RF-MOD-UX-009 — form do contato sem Update para o atendente',
    description: 'Atendente abre o próprio contato «A ligar»: vê «Registrar ligação» e «Encerrar» e não vê Update (override de sysverb_update só para o admin do app) (RN-NOVO-UX-014, G2).',
    failOnServerError: true,
}, (atf) => {
    const u = atf.server.createUser({ $id: Now.ID['US-MOD-UX-009_test_12'], firstName: 'ATF', lastName: 'Atendente UX-009 form', roles: [role_atendente], impersonate: false })
    const p = atf.server.recordInsert({
        $id: Now.ID['US-MOD-UX-009_test_13'],
        table: 'x_2326104_cob_contribuinte',
        fieldValues: { nome: 'Contribuinte fictício UX-009 form', tipo_pessoa: 'pj', ficticio: true, atendente: u.user },
    })
    const c = atf.server.recordInsert({
        $id: Now.ID['US-MOD-UX-009_test_14'],
        table: 'x_2326104_cob_contato',
        fieldValues: { contribuinte: p.record_id, atendente: u.user, status: 'a_ligar' },
    })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-009_test_15'], user: u.user })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-UX-009_test_16'], table: 'x_2326104_cob_contato', recordId: c.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-UX-009_test_17'],
        table: 'x_2326104_cob_contato',
        visible: [Now.ref('sys_ui_action', 'RF-MOD-UX-002_ua_registrar_ligacao'), Now.ref('sys_ui_action', 'RF-MOD-UX-003_ua_encerrar_contato')],
        notVisible: [Now.ref('sys_ui_action', 'UX-009_ua_update_contato')],
    })
})

export const t_ux009_update_ciclo_previa = Test({
    $id: Now.ID['US-MOD-UX-009_atf_update_ciclo_previa'],
    name: 'RF-MOD-UX-009 — coordenador vê Update no ciclo em prévia',
    description: 'Coordenador abre um ciclo fictício em prévia: vê Update (edita nome, referência e critério) e «Publicar ciclo» (RN-NOVO-UX-014, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    const ciclo = atf.server.recordInsert({
        $id: Now.ID['US-MOD-UX-009_test_18'],
        table: 'x_2326104_cob_ciclo',
        fieldValues: { nome: 'ATF ciclo UX-009 prévia (fictício)', estado: 'previa' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-009_test_19'], firstName: 'ATF', lastName: 'Coordenador UX-009 prévia', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-UX-009_test_20'], table: 'x_2326104_cob_ciclo', recordId: ciclo.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-UX-009_test_21'],
        table: 'x_2326104_cob_ciclo',
        visible: [Now.ref('sys_ui_action', 'UX-009_ua_update_ciclo'), Now.ref('sys_ui_action', 'RF-MOD-F2-004_ua_publicar_ciclo')],
    })
})

export const t_ux009_update_ciclo_publicado = Test({
    $id: Now.ID['US-MOD-UX-009_atf_update_ciclo_publicado'],
    name: 'RF-MOD-UX-009 — coordenador não vê Update no ciclo publicado',
    description: 'Coordenador abre um ciclo fictício publicado e não distribuído: vê «Distribuir lista» e não vê Update (RN-NOVO-UX-014, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    const ciclo = atf.server.recordInsert({
        $id: Now.ID['US-MOD-UX-009_test_22'],
        table: 'x_2326104_cob_ciclo',
        fieldValues: { nome: 'ATF ciclo UX-009 publicado (fictício)', estado: 'publicado' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-009_test_23'], firstName: 'ATF', lastName: 'Coordenador UX-009 publicado', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-UX-009_test_24'], table: 'x_2326104_cob_ciclo', recordId: ciclo.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-UX-009_test_25'],
        table: 'x_2326104_cob_ciclo',
        visible: [Now.ref('sys_ui_action', 'RF-MOD-UX-004_ua_distribuir_lista')],
        notVisible: [Now.ref('sys_ui_action', 'UX-009_ua_update_ciclo')],
    })
})
