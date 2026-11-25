// ATF da US-MOD-F4-014 — execuções visíveis e edição no Flow Designer (design ux-cobranca-v2-regua-flow.md, A1, B6, B9,
// D12, D15; RN-NOVO-F4-015). Massa fictícia criada pelo próprio teste e desfeita pelo rollback; régua de teste com
// codigo = atf_<caso> (nenhum gatilho de Flow casa). A régua de teste com Flow aponta para o Flow «Régua: IPVA».
// Inclui a correção da F5 no contato: «Origem» só leitura para as personas (ACL F4-012_acl_contato_write_origem).
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador, role_atendente } from '../security/roles.now'

export const t_f4014_links_coordenador = Test({
    $id: Now.ID['US-MOD-F4-014_atf_links_coordenador'],
    name: 'RF-MOD-F4-014 — coordenador vê «Ver execuções» e «Abrir no Flow Designer» no form da régua',
    description: 'Régua atf_links com o Flow «Régua: IPVA»; coordenador criado pelo teste abre o form e vê os dois links (D12, CUJ-6; AS-TASK-MOD-F4-014-01-01).',
    failOnServerError: true,
}, (atf) => {
    const r = atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var f = new GlideRecord('sys_hub_flow');
    f.addQuery('internal_name', 'regua_ipva');
    f.query();
    if (!f.next()) { stepResult.setOutputMessage('Flow regua_ipva não encontrado'); return false; }
    var r = new GlideRecord('x_2326104_cob_regua');
    r.initialize();
    r.setValue('nome', 'Régua ATF atf_links (fictícia)');
    r.setValue('codigo', 'atf_links');
    r.setValue('carteira', 'ipva');
    r.setValue('ativa', true);
    r.setValue('prazo_final_dias', 5);
    r.setValue('flow', f.getUniqueValue());
    outputs.table = 'x_2326104_cob_regua';
    outputs.record_id = r.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-014_test_02'], firstName: 'ATF', lastName: 'Coordenador F4-014 links', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-014_test_03'], table: 'x_2326104_cob_regua', recordId: r.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-F4-014_test_04'],
        table: 'x_2326104_cob_regua',
        visible: [Now.ref('sys_ui_action', 'F4-014_ua_ver_execucoes'), Now.ref('sys_ui_action', 'F4-014_ua_abrir_designer')],
    })
})

export const t_f4014_links_atendente = Test({
    $id: Now.ID['US-MOD-F4-014_atf_links_atendente'],
    name: 'RF-MOD-F4-014 — atendente não vê os links de execução e de Flow Designer',
    description: 'Régua atf_links_at com o Flow «Régua: IPVA»; atendente criado pelo teste abre o form e não vê «Ver execuções» nem «Abrir no Flow Designer» (A1 roles; AS-TASK-MOD-F4-014-01-02).',
    failOnServerError: true,
}, (atf) => {
    const r = atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_05'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var f = new GlideRecord('sys_hub_flow');
    f.addQuery('internal_name', 'regua_ipva');
    f.query();
    f.next();
    var r = new GlideRecord('x_2326104_cob_regua');
    r.initialize();
    r.setValue('nome', 'Régua ATF atf_links_at (fictícia)');
    r.setValue('codigo', 'atf_links_at');
    r.setValue('carteira', 'ipva');
    r.setValue('ativa', true);
    r.setValue('prazo_final_dias', 5);
    r.setValue('flow', f.getUniqueValue());
    outputs.table = 'x_2326104_cob_regua';
    outputs.record_id = r.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-014_test_06'], firstName: 'ATF', lastName: 'Atendente F4-014 links', roles: [role_atendente] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-014_test_07'], table: 'x_2326104_cob_regua', recordId: r.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-F4-014_test_08'],
        table: 'x_2326104_cob_regua',
        notVisible: [Now.ref('sys_ui_action', 'F4-014_ua_ver_execucoes'), Now.ref('sys_ui_action', 'F4-014_ua_abrir_designer')],
    })
})

export const t_f4014_sem_flow = Test({
    $id: Now.ID['US-MOD-F4-014_atf_sem_flow'],
    name: 'RF-MOD-F4-014 — régua sem Flow não mostra «Abrir no Flow Designer»; inscrição sem execução avisa',
    description: 'Régua atf_sem_flow com o campo «Flow» vazio: o coordenador vê «Ver execuções» e não vê «Abrir no Flow Designer»; na inscrição de teste (código atf não dispara Flow) vê «Ver execução» e o endereço sai vazio, o que leva a «Execução não encontrada.» (AS-TASK-MOD-F4-014-01-03).',
    failOnServerError: true,
}, (atf) => {
    const r = atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_09'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var r = new GlideRecord('x_2326104_cob_regua');
    r.initialize();
    r.setValue('nome', 'Régua ATF atf_sem_flow (fictícia)');
    r.setValue('codigo', 'atf_sem_flow');
    r.setValue('carteira', 'ipva');
    r.setValue('ativa', true);
    r.setValue('prazo_final_dias', 5);
    outputs.table = 'x_2326104_cob_regua';
    outputs.record_id = r.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const i = atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_10'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var r = new GlideRecord('x_2326104_cob_regua');
    r.get('codigo', 'atf_sem_flow');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício F4-014 sem execução');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var i = new GlideRecord('x_2326104_cob_regua_inscricao');
    i.initialize();
    i.setValue('contribuinte', pid);
    i.setValue('regua', r.getUniqueValue());
    outputs.table = 'x_2326104_cob_regua_inscricao';
    outputs.record_id = i.insert();
    var m = new ReguaMotor();
    assertEqual({ name: 'urlExecucao sem contexto', shouldbe: '', value: m.urlExecucao(outputs.record_id) });
    assertEqual({ name: 'urlDesigner sem Flow nem Flow regua_atf_sem_flow', shouldbe: '', value: m.urlDesigner(r) });
    assertEqual({ name: 'mensagem', shouldbe: 'Execução não encontrada.', value: ReguaMotor.MSG_SEM_EXECUCAO });
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-014_test_11'], firstName: 'ATF', lastName: 'Coordenador F4-014 sem flow', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-014_test_12'], table: 'x_2326104_cob_regua', recordId: r.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-F4-014_test_13'],
        table: 'x_2326104_cob_regua',
        visible: [Now.ref('sys_ui_action', 'F4-014_ua_ver_execucoes')],
        notVisible: [Now.ref('sys_ui_action', 'F4-014_ua_abrir_designer')],
    })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-014_test_14'], table: 'x_2326104_cob_regua_inscricao', recordId: i.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-F4-014_test_15'],
        table: 'x_2326104_cob_regua_inscricao',
        visible: [Now.ref('sys_ui_action', 'F4-014_ua_ver_execucao')],
    })
})

export const t_f4014_enderecos = Test({
    $id: Now.ID['US-MOD-F4-014_atf_enderecos'],
    name: 'RF-MOD-F4-014 — endereços de «Ver execuções», «Abrir no Flow Designer» e «Ver execução»',
    description: 'ReguaMotor: urlExecucoes da régua IPVA filtra sys_flow_context pelo Flow dela; urlDesigner abre o Flow no Designer; sem o campo «Flow», o plano B acha o Flow por internal_name regua_<codigo>; urlExecucao acha o contexto pelo source_record (D12, F0 pontos 4 e 6).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_16'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Endereços da régua', function() {
        var f = new GlideRecord('sys_hub_flow');
        f.addQuery('internal_name', 'regua_ipva');
        f.query();
        f.next();
        var flow = f.getUniqueValue();
        var r = new GlideRecord('x_2326104_cob_regua');
        r.get('codigo', 'ipva');
        var m = new ReguaMotor();
        it('régua IPVA aponta para o Flow «Régua: IPVA»', function() {
            expect(r.getValue('flow')).toBe(flow);
        });
        it('Ver execuções filtra pelo Flow', function() {
            expect(m.urlExecucoes(r)).toBe('sys_flow_context_list.do?sysparm_query=' + encodeURIComponent('flow=' + flow + '^ORDERBYDESCsys_created_on'));
        });
        it('Abrir no Flow Designer', function() {
            expect(m.urlDesigner(r)).toBe('$flow-designer.do#/flow-designer/' + flow);
        });
        it('plano B: sem o campo, acha por internal_name', function() {
            r.setWorkflow(false);
            r.setValue('flow', '');
            r.update();
            expect(m.urlDesigner(r.getUniqueValue())).toBe('$flow-designer.do#/flow-designer/' + flow);
        });
        it('Ver execução acha o contexto pelo source_record', function() {
            var c = new GlideRecord('sys_flow_context');
            c.addQuery('source_table', 'x_2326104_cob_regua_inscricao');
            c.orderByDesc('sys_created_on');
            c.setLimit(1);
            c.query();
            if (c.next()) {
                var u = m.urlExecucao(c.getValue('source_record'));
                expect(u.indexOf('$flow-designer.do#/operations/context/')).toBe(0);
            }
            expect(m.urlExecucao('')).toBe('');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4014_papel = Test({
    $id: Now.ID['US-MOD-F4-014_atf_papel_flow_designer'],
    name: 'RF-MOD-F4-014 — o papel do coordenador contém flow_designer e flow_operator; o do atendente não',
    description: 'sys_user_role_contains do coordenador (e do admin do app) com flow_designer e flow_operator; demo.coordenador herda os dois; demo.atendente não tem nenhum (B6 mecanismo 1; AS-TASK-MOD-F4-014-02-01 e 02).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_17'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var E = gs.getCurrentScopeName();
    function contem(papel) {
        var c = new GlideRecord('sys_user_role_contains');
        c.addQuery('role.name', papel);
        c.query();
        var n = [];
        while (c.next()) { n.push(c.contains.name.toString()); }
        return n.sort().join(',');
    }
    function tem(login, papel) {
        var h = new GlideRecord('sys_user_has_role');
        h.addQuery('user.user_name', login);
        h.addQuery('role.name', papel);
        h.query();
        return h.hasNext();
    }
    describe('Papel de Flow Designer', function() {
        it('coordenador e admin do app contêm flow_designer e flow_operator', function() {
            expect(contem(E + '.coordenador')).toBe('flow_designer,flow_operator');
            expect(contem(E + '.admin').indexOf('flow_designer')).not.toBe(-1);
            expect(contem(E + '.admin').indexOf('flow_operator')).not.toBe(-1);
        });
        it('demo.coordenador herda; demo.atendente não', function() {
            expect(tem('demo.coordenador', 'flow_designer')).toBe(true);
            expect(tem('demo.coordenador', 'flow_operator')).toBe(true);
            expect(tem('demo.atendente', 'flow_designer')).toBe(false);
            expect(tem('demo.atendente', 'flow_operator')).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4014_campo_flow = Test({
    $id: Now.ID['US-MOD-F4-014_atf_campo_flow_coordenador'],
    name: 'RF-MOD-F4-014 — coordenador lê o campo «Flow» da régua e as execuções, e não grava o campo',
    description: 'Impersonado como coordenador criado pelo teste, por GlideRecordSecure: o campo «Flow» da régua IPVA traz o Flow «Régua: IPVA» (antes voltava nulo: sem flow_operator a referência a sys_hub_flow não se lia); sys_flow_context pode ser lido; gravar «Flow» é recusado (ACL de campo só admin) (B5, B6).',
    failOnServerError: true,
}, (atf) => {
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-014_test_18'], firstName: 'ATF', lastName: 'Coordenador F4-014 campo', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_19'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Campo Flow para o coordenador', function() {
        var f = new GlideRecord('sys_hub_flow');
        f.addQuery('internal_name', 'regua_ipva');
        f.query();
        f.next();
        var flow = f.getUniqueValue();
        it('lê o campo e o nome do Flow', function() {
            var r = new GlideRecordSecure('x_2326104_cob_regua');
            r.addQuery('codigo', 'ipva');
            r.query();
            expect(r.next()).toBe(true);
            expect(r.getValue('flow')).toBe(flow);
            expect(r.getDisplayValue('flow')).toBe('Régua: IPVA');
        });
        it('lê as execuções', function() {
            var c = new GlideRecordSecure('sys_flow_context');
            expect(c.canRead()).toBe(true);
        });
        it('não grava o campo Flow', function() {
            var r = new GlideRecordSecure('x_2326104_cob_regua');
            r.addQuery('codigo', 'ipva');
            r.query();
            r.next();
            r.setValue('flow', '');
            r.update();
            var g = new GlideRecord('x_2326104_cob_regua');
            g.get('codigo', 'ipva');
            expect(g.getValue('flow')).toBe(flow);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4014_origem_atendente = Test({
    $id: Now.ID['US-MOD-F4-014_atf_origem_atendente'],
    name: 'RF-MOD-F4-012 — atendente não grava «Origem» do contato e continua gravando «Próxima ação em»',
    description: 'Impersonado como demo.atendente, num contato aberto da própria carteira: «Origem» não pode ser gravada (canWrite false e o update não muda o valor); «Próxima ação em» continua gravável (correção da F5: ACL de campo F4-012_acl_contato_write_origem, só admin do app).',
    failOnServerError: true,
}, (atf) => {
    const demo = atf.server.recordQuery({ $id: Now.ID['US-MOD-F4-014_test_20'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F4-014_test_21'], user: demo.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_22'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Origem só leitura para o atendente', function() {
        it('não grava Origem; grava Próxima ação em', function() {
            var c = new GlideRecordSecure(gs.getCurrentScopeName() + '_contato');
            c.addQuery('atendente', gs.getUserID());
            c.addQuery('status', '!=', 'encerrado');
            c.setLimit(1);
            c.query();
            expect(c.next()).toBe(true);
            var antes = c.getValue('origem');
            var novo = antes == 'regua' ? 'distribuicao' : 'regua';
            expect(c.origem.canWrite()).toBe(false);
            expect(c.proxima_acao_em.canWrite()).toBe(true);
            c.setValue('origem', novo);
            c.update();
            var g = new GlideRecord(gs.getCurrentScopeName() + '_contato');
            g.get(c.getUniqueValue());
            expect(g.getValue('origem')).toBe(antes);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4014_origem_coordenador = Test({
    $id: Now.ID['US-MOD-F4-014_atf_origem_coordenador'],
    name: 'RF-MOD-F4-012 — coordenador também não grava «Origem» do contato',
    description: 'Impersonado como coordenador criado pelo teste, por GlideRecordSecure: «Origem» do contato não pode ser gravada (canWrite false); «Status» continua gravável (persona sem exceção; só o admin do app grava Origem à mão).',
    failOnServerError: true,
}, (atf) => {
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-014_test_23'], firstName: 'ATF', lastName: 'Coordenador F4-014 origem', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-014_test_24'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Origem só leitura para o coordenador', function() {
        it('não grava Origem; grava Status', function() {
            var c = new GlideRecordSecure(gs.getCurrentScopeName() + '_contato');
            c.addQuery('status', '!=', 'encerrado');
            c.setLimit(1);
            c.query();
            expect(c.next()).toBe(true);
            expect(c.origem.canWrite()).toBe(false);
            expect(c.status.canWrite()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
