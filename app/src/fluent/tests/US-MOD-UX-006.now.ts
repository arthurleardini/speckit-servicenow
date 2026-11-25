// ATF da US-MOD-UX-006 — acesso por papel: contato do atendente, caso do coordenador (RF-MOD-UX-006,
// RN-NOVO-F5-007, design UX v1 R4/R6/🔴6). A carteira completa (contribuinte, interação, débito, parcelamento)
// é provada pelos testes migrados da US-MOD-F5-007; aqui ficam os 3 aceites da story. Massa fictícia criada pelo
// próprio teste (rollback do ATF desfaz).
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'



export const t_ux006_pos = Test({
    $id: Now.ID['US-MOD-UX-006_atf_acesso_positivo'],
    name: 'RF-MOD-UX-006 — dono vê e grava o próprio contato; coordenador vê o caso e registra interação nele',
    description: 'Contato fictício de demo.atendente e caso fictício de demo.coordenador: como demo.atendente, o contato aparece e pode ser gravado; como demo.coordenador, o caso e o contato aparecem e ele registra interação no caso (RN-NOVO-F5-007 e R4, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['US-MOD-UX-006_test_01'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(nome) { var u = new GlideRecord('sys_user'); u.get('user_name', nome); return u.getUniqueValue(); }
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-006');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', usuario('demo.atendente'));
    var pid = p.insert();
    var c = new GlideRecord('x_2326104_cob_contato');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('atendente', usuario('demo.atendente'));
    c.setValue('status', 'a_ligar');
    c.setValue('prioridade', 96006);
    c.insert();
    var k = new GlideRecord('x_2326104_cob_caso');
    k.initialize();
    k.setValue('contribuinte', pid);
    k.setValue('coordenador', usuario('demo.coordenador'));
    k.setValue('estagio', 'conducao');
    k.setValue('prioridade', 96006);
    k.insert();
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);` })
    const u_US_MOD_UX_006_test_02 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-006_test_02'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-006_test_03'], user: u_US_MOD_UX_006_test_02.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-006_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function idDe(tabela) {
        var g = new GlideRecord(tabela);
        g.setWorkflow(false); // só para achar o id: a consulta normal de quem não tem acesso já não o traz
        g.addQuery('prioridade', 96006);
        g.query();
        return g.next() ? g.getUniqueValue() : '';
    }
    describe('Dono do contato (demo.atendente)', function() {
        it('vê e grava o próprio contato', function() {
            var c = new GlideRecordSecure('x_2326104_cob_contato');
            expect(c.get(idDe('x_2326104_cob_contato'))).toBe(true);
            expect(c.canWrite()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
    const u_US_MOD_UX_006_test_05 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-006_test_05'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-006_test_06'], user: u_US_MOD_UX_006_test_05.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-006_test_07'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function idDe(tabela) {
        var g = new GlideRecord(tabela);
        g.setWorkflow(false); // só para achar o id: a consulta normal de quem não tem acesso já não o traz
        g.addQuery('prioridade', 96006);
        g.query();
        return g.next() ? g.getUniqueValue() : '';
    }
    describe('Coordenador (demo.coordenador)', function() {
        it('vê o caso e o contato e registra interação no caso', function() {
            var k = new GlideRecordSecure('x_2326104_cob_caso');
            expect(k.get(idDe('x_2326104_cob_caso'))).toBe(true);
            expect(new GlideRecordSecure('x_2326104_cob_contato').get(idDe('x_2326104_cob_contato'))).toBe(true);
            var i = new GlideRecordSecure('x_2326104_cob_interacao');
            i.initialize();
            i.setValue('caso', k.getUniqueValue());
            i.setValue('resultado', 'contato_efetivo');
            i.setValue('descricao', 'Reunião fictícia');
            expect(!!i.insert()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux006_neg = Test({
    $id: Now.ID['US-MOD-UX-006_atf_acesso_negativo'],
    name: 'RF-MOD-UX-006 — atendente não vê contato de outro atendente nem o caso qualificado',
    description: 'Contato fictício de demo.atendente e caso fictício de demo.coordenador: como demo.atendente2, o contato não aparece; como demo.atendente, o caso não aparece, não é gravado e não recebe interação; e o contato não vai a «Encerrado» sem motivo por gravação direta (RN-NOVO-F5-007, R6, RN-NOVO-UX-005, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['US-MOD-UX-006_test_08'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(nome) { var u = new GlideRecord('sys_user'); u.get('user_name', nome); return u.getUniqueValue(); }
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-006');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', usuario('demo.atendente'));
    var pid = p.insert();
    var c = new GlideRecord('x_2326104_cob_contato');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('atendente', usuario('demo.atendente'));
    c.setValue('status', 'a_ligar');
    c.setValue('prioridade', 96006);
    c.insert();
    var k = new GlideRecord('x_2326104_cob_caso');
    k.initialize();
    k.setValue('contribuinte', pid);
    k.setValue('coordenador', usuario('demo.coordenador'));
    k.setValue('estagio', 'conducao');
    k.setValue('prioridade', 96006);
    k.insert();
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);` })
    const u_US_MOD_UX_006_test_09 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-006_test_09'], table: 'sys_user', fieldValues: 'user_name=demo.atendente2', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-006_test_10'], user: u_US_MOD_UX_006_test_09.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-006_test_11'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function idDe(tabela) {
        var g = new GlideRecord(tabela);
        g.setWorkflow(false); // só para achar o id: a consulta normal de quem não tem acesso já não o traz
        g.addQuery('prioridade', 96006);
        g.query();
        return g.next() ? g.getUniqueValue() : '';
    }
    describe('Outro atendente (demo.atendente2)', function() {
        it('não vê o contato de demo.atendente', function() {
            expect(new GlideRecordSecure('x_2326104_cob_contato').get(idDe('x_2326104_cob_contato'))).toBe(false);
            var l = new GlideRecordSecure('x_2326104_cob_contato');
            l.addQuery('prioridade', 96006);
            l.query();
            expect(l.hasNext()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
    const u_US_MOD_UX_006_test_12 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-006_test_12'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-006_test_13'], user: u_US_MOD_UX_006_test_12.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-006_test_14'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function idDe(tabela) {
        var g = new GlideRecord(tabela);
        g.setWorkflow(false); // só para achar o id: a consulta normal de quem não tem acesso já não o traz
        g.addQuery('prioridade', 96006);
        g.query();
        return g.next() ? g.getUniqueValue() : '';
    }
    describe('Atendente sem acesso ao caso (demo.atendente)', function() {
        it('o caso não aparece, não grava e não recebe interação', function() {
            var id = idDe('x_2326104_cob_caso');
            expect(new GlideRecordSecure('x_2326104_cob_caso').get(id)).toBe(false);
            var g = new GlideRecord('x_2326104_cob_caso');
            g.setWorkflow(false);
            g.get(id);
            expect(g.canRead()).toBe(false);
            expect(g.canWrite()).toBe(false);
            var i = new GlideRecordSecure('x_2326104_cob_interacao');
            i.initialize();
            i.setValue('caso', id);
            i.setValue('resultado', 'sem_contato');
            i.setValue('descricao', 'Tentativa fictícia');
            expect(!!i.insert()).toBe(false);
        });
        it('contato próprio não encerra sem motivo por gravação direta', function() {
            var c = new GlideRecord('x_2326104_cob_contato');
            expect(c.get(idDe('x_2326104_cob_contato'))).toBe(true);
            c.setValue('status', 'encerrado');
            c.update();
            var lido = new GlideRecord('x_2326104_cob_contato');
            lido.get(c.getUniqueValue());
            expect(lido.getValue('status')).toBe('a_ligar');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
