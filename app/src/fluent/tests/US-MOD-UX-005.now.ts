// ATF da US-MOD-UX-005 — caso qualificado do coordenador: «Avançar etapa» e «Encerrar caso» (RF-MOD-UX-005,
// RN-NOVO-UX-008, design UX v1 R4/R6). Massa fictícia criada pelo próprio teste (rollback do ATF desfaz);
// demo.coordenador e demo.atendente impersonados.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'



export const t_ux005_pos = Test({
    $id: Now.ID['US-MOD-UX-005_atf_conducao_positivo'],
    name: 'RF-MOD-UX-005 — coordenador avança a etapa, encerra com motivo e registra interação no caso',
    description: 'Como demo.coordenador, em casos fictícios dele: «Avançar etapa» leva «Em seleção» a «Caso selecionado» e «Caso selecionado» a «Dossiê gerado»; «Encerrar caso» com motivo «Regularizado» leva o caso em condução a «Encerrado» com a data; e ele registra uma interação no caso que conduz (RN-NOVO-UX-008 e R4, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-005_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.coordenador');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-005 positivo');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var lista = [{estagio: 'em_selecao', prioridade: 9801}, {estagio: 'selecionado', prioridade: 9802}, {estagio: 'conducao', prioridade: 9803}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_caso');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('coordenador', u.getUniqueValue());
        c.setValue('estagio', lista[k].estagio);
        c.setValue('prioridade', lista[k].prioridade);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_005_test_02 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-005_test_02'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-005_test_03'], user: u_US_MOD_UX_005_test_02.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-005_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function caso(marca) {
        var c = new GlideRecord('x_2326104_cob_caso');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-005');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecord('x_2326104_cob_caso');
        g.get(c.getUniqueValue());
        return g;
    }
    describe('Conduzir o caso', function() {
        it('avança uma etapa por vez, na ordem', function() {
            var a = caso(9801);
            var r = new CasoConducao().avancarEtapa(a);
            expect(r.ok).toBe(true);
            expect(relido(a).getValue('estagio')).toBe('selecionado');
            var b = caso(9802);
            r = new CasoConducao().avancarEtapa(b);
            expect(r.mensagem).toBe('Caso avançou para «Dossiê gerado».');
            expect(relido(b).getValue('estagio')).toBe('dossie_gerado');
        });
        it('encerra com motivo e grava a data', function() {
            var c = caso(9803);
            var r = new CasoConducao().encerrar(c, 'regularizado');
            expect(r.ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('estagio')).toBe('encerrado');
            expect(g.getValue('motivo_encerramento')).toBe('regularizado');
            expect(g.getValue('encerrado_em')).toBeTruthy();
        });
        it('registra interação no caso que conduz (R4)', function() {
            var i = new GlideRecordSecure('x_2326104_cob_interacao');
            expect(i.canCreate()).toBe(true);
            i.initialize();
            i.setValue('caso', caso(9802).getUniqueValue());
            i.setValue('resultado', 'contato_efetivo');
            i.setValue('descricao', 'Reunião com o contador (fictício)');
            expect(!!i.insert()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux005_neg = Test({
    $id: Now.ID['US-MOD-UX-005_atf_conducao_negativo'],
    name: 'RF-MOD-UX-005 — encerrar sem motivo, avançar além da condução, mexer em caso encerrado ou conduzir como atendente é recusado',
    description: 'Como demo.coordenador: «Encerrar caso» sem motivo é recusado com «Operação recusada: informe o motivo de encerramento.»; «Avançar etapa» de um caso em condução é recusado e o caso fica em condução; caso encerrado recusa com «Operação recusada: caso já encerrado.». Como demo.atendente, avançar o caso é recusado com «Operação recusada: só o coordenador conduz o caso qualificado.» (lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-005_test_05'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.coordenador');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-005 negativo');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var lista = [{estagio: 'conducao', prioridade: 9901}, {estagio: 'encerrado', prioridade: 9902}, {estagio: 'selecionado', prioridade: 9903}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_caso');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('coordenador', u.getUniqueValue());
        c.setValue('estagio', lista[k].estagio);
        c.setValue('prioridade', lista[k].prioridade);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_005_test_06 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-005_test_06'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-005_test_07'], user: u_US_MOD_UX_005_test_06.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-005_test_08'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function caso(marca) {
        var c = new GlideRecord('x_2326104_cob_caso');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-005');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecord('x_2326104_cob_caso');
        g.get(c.getUniqueValue());
        return g;
    }
    describe('Conduzir recusado (coordenador)', function() {
        it('encerrar sem motivo', function() {
            var c = caso(9901);
            var r = new CasoConducao().encerrar(c, '');
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Operação recusada: informe o motivo de encerramento.');
            expect(relido(c).getValue('estagio')).toBe('conducao');
        });
        it('avançar além da condução', function() {
            var c = caso(9901);
            expect(new CasoConducao().avancarEtapa(c).ok).toBe(false);
            expect(relido(c).getValue('estagio')).toBe('conducao');
        });
        it('caso encerrado', function() {
            var c = caso(9902);
            expect(new CasoConducao().avancarEtapa(c).mensagem).toBe('Operação recusada: caso já encerrado.');
            expect(new CasoConducao().encerrar(c, 'outro').mensagem).toBe('Operação recusada: caso já encerrado.');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
    const u_US_MOD_UX_005_test_09 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-005_test_09'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-005_test_10'], user: u_US_MOD_UX_005_test_09.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-005_test_11'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function caso(marca) {
        var c = new GlideRecord('x_2326104_cob_caso');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-005');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecord('x_2326104_cob_caso');
        g.get(c.getUniqueValue());
        return g;
    }
    describe('Conduzir recusado (atendente)', function() {
        it('atendente não avança o caso', function() {
            var c = new GlideRecord('x_2326104_cob_caso');
            c.setWorkflow(false); // só para achar o caso: a consulta normal do atendente já não o traz
            c.addQuery('prioridade', 9903);
            c.query();
            expect(c.next()).toBe(true);
            c.setWorkflow(true);
            var r = new CasoConducao().avancarEtapa(c);
            expect(r.mensagem).toBe('Operação recusada: só o coordenador conduz o caso qualificado.');
            var lido = new GlideRecord('x_2326104_cob_caso');
            lido.setWorkflow(false);
            lido.get(c.getUniqueValue());
            expect(lido.getValue('estagio')).toBe('selecionado');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux005_ui = Test({
    $id: Now.ID['US-MOD-UX-005_atf_ui_avancar_etapa'],
    name: 'RF-MOD-UX-005 — «Avançar etapa» e «Encerrar caso» aparecem para o coordenador no caso aberto',
    description: 'Abre no form um caso fictício «Caso selecionado» de demo.coordenador como demo.coordenador: os botões «Avançar etapa» e «Encerrar caso» aparecem (UI Actions com condition e roles).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-005_test_12'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.coordenador');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-005 tela');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var lista = [{estagio: 'selecionado', prioridade: 9951}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_caso');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('coordenador', u.getUniqueValue());
        c.setValue('estagio', lista[k].estagio);
        c.setValue('prioridade', lista[k].prioridade);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const aberto = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-005_test_13'], table: 'x_2326104_cob_caso', fieldValues: 'prioridade=9951', assert: 'records_match_query' })
    const u_US_MOD_UX_005_test_14 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-005_test_14'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-005_test_15'], user: u_US_MOD_UX_005_test_14.first_record })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-UX-005_test_16'], table: 'x_2326104_cob_caso', recordId: aberto.first_record })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-UX-005_test_17'], table: 'x_2326104_cob_caso', visible: [Now.ref('sys_ui_action', 'RF-MOD-UX-005_ua_avancar_etapa'), Now.ref('sys_ui_action', 'RF-MOD-UX-005_ua_encerrar_caso')] })
})
