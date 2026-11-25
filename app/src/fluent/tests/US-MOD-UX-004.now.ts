// ATF da US-MOD-UX-004 — «Distribuir lista» do ciclo publicado (RF-MOD-UX-004, RN-NOVO-UX-006, RN-NOVO-F2-005).
// Massa fictícia criada pelo próprio teste (rollback do ATF desfaz); o coordenador é um usuário criado pelo
// ATF com o papel coordenador.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'



export const t_ux004_pos = Test({
    $id: Now.ID['US-MOD-UX-004_atf_distribuir_positivo'],
    name: 'RF-MOD-UX-004 — distribuir cria um contato por contribuinte da massificada, com o atendente da carteira ou por rodízio',
    description: 'Ciclo publicado fictício com 3 contribuintes na massificada (1 na carteira de demo.atendente2, 2 sem atendente), 2 no grupo de controle e 1 na qualificada; o coordenador distribui: nascem 3 contatos «A ligar»; o da carteira de demo.atendente2 fica com ele; os 2 sem atendente recebem um atendente por rodízio, gravado também no contribuinte; prioridade e valor vêm do contribuinte; nenhum contato para controle ou qualificada; o ciclo grava «Distribuído em» e «Contatos distribuídos = 3»; a mensagem traz a contagem por atendente (RN-NOVO-UX-006, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['US-MOD-UX-004_test_01'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u2 = new GlideRecord('sys_user');
    u2.get('user_name', 'demo.atendente2');
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo UX-004 pos (fictício)');
    ci.setValue('estado', 'publicado');
    var ciclo = ci.insert();
    var lista = [
        { nome: 'mass A', segmento: 'massificada', atendente: u2.getUniqueValue(), valor: 120000 },
        { nome: 'mass B', segmento: 'massificada', atendente: '', valor: 30000 },
        { nome: 'mass C', segmento: 'massificada', atendente: '', valor: 1000 },
        { nome: 'ctrl A', segmento: 'controle', atendente: '', valor: 50000 },
        { nome: 'ctrl B', segmento: 'controle', atendente: '', valor: 60000 },
        { nome: 'qual A', segmento: 'qualificada', atendente: '', valor: 900000 }
    ];
    for (var k = 0; k < lista.length; k++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício UX-004 pos ' + lista[k].nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        p.setValue('valor_em_aberto', lista[k].valor);
        if (lista[k].atendente) { p.setValue('atendente', lista[k].atendente); }
        var pid = p.insert();
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', pid);
        s.setValue('segmento', lista[k].segmento);
        s.insert();
    }
    return !!ciclo;
})(outputs, steps, params, stepResult, assertEqual);` })
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-004_test_02'], firstName: 'ATF', lastName: 'Coordenador UX-004', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-004_test_03'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function ciclo(rotulo) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.addQuery('nome', 'ATF ciclo ' + rotulo + ' (fictício)');
        c.query();
        c.next();
        return c;
    }
    function contatos(cicloId, filtro) {
        var g = new GlideRecord('x_2326104_cob_contato');
        g.addQuery('ciclo', cicloId);
        if (filtro) { g.addEncodedQuery(filtro); }
        g.query();
        var n = 0;
        while (g.next()) { n++; }
        return n;
    }
    describe('Distribuir lista', function() {
        var c = ciclo('UX-004 pos');
        var r = new QualificacaoCiclo().distribuir(c);
        it('cria 3 contatos só da massificada e grava o ciclo', function() {
            expect(r.ok).toBe(true);
            expect(r.mensagem.indexOf('Lista distribuída: 3 contatos')).toBe(0);
            expect(contatos(c.getUniqueValue(), '')).toBe(3);
            expect(contatos(c.getUniqueValue(), 'contribuinte.nomeLIKEctrl^ORcontribuinte.nomeLIKEqual')).toBe(0);
            expect(contatos(c.getUniqueValue(), 'status=a_ligar^tentativas=0')).toBe(3);
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(c.getUniqueValue());
            expect(lido.getValue('distribuido_em')).toBeTruthy();
            expect(lido.getValue('qtd_contatos')).toBe('3');
        });
        it('atendente do contato = atendente do contribuinte (carteira ou rodízio)', function() {
            var g = new GlideRecord('x_2326104_cob_contato');
            g.addQuery('ciclo', c.getUniqueValue());
            g.query();
            var donos = 0;
            while (g.next()) {
                expect(g.getValue('atendente')).toBeTruthy();
                expect(g.getValue('atendente')).toBe(g.contribuinte.atendente.toString());
                var temPapel = new GlideRecord('sys_user_has_role');
                temPapel.addQuery('user', g.getValue('atendente'));
                temPapel.addQuery('role.name', 'x_2326104_cob.atendente');
                temPapel.query();
                expect(temPapel.hasNext()).toBe(true);
                if (g.contribuinte.nome.toString().indexOf('mass A') > 0) {
                    expect(g.contribuinte.atendente.user_name.toString()).toBe('demo.atendente2');
                    expect(g.getValue('prioridade')).toBe('5');
                    expect(parseFloat(g.getValue('valor_em_aberto'))).toBe(120000);
                }
                donos++;
            }
            expect(donos).toBe(3);
            var total = 0;
            for (var u in r.porAtendente) { total += r.porAtendente[u]; }
            expect(total).toBe(3);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux004_neg = Test({
    $id: Now.ID['US-MOD-UX-004_atf_distribuir_negativo'],
    name: 'RF-MOD-UX-004 — segundo clique não duplica e o grupo de controle não recebe contato',
    description: 'Depois de distribuir o ciclo fictício, distribuir de novo é recusado com «Operação recusada: ciclo já distribuído ou não publicado.» e nenhum contato novo nasce; inserir à mão um contato para contribuinte do grupo de controle é recusado com a mensagem do grupo de controle, e para contribuinte da massificada é gravado (RN-NOVO-UX-006 e RN-NOVO-F2-005, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['US-MOD-UX-004_test_04'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u2 = new GlideRecord('sys_user');
    u2.get('user_name', 'demo.atendente2');
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo UX-004 neg (fictício)');
    ci.setValue('estado', 'publicado');
    var ciclo = ci.insert();
    var lista = [
        { nome: 'mass A', segmento: 'massificada', atendente: u2.getUniqueValue(), valor: 120000 },
        { nome: 'mass B', segmento: 'massificada', atendente: '', valor: 30000 },
        { nome: 'mass C', segmento: 'massificada', atendente: '', valor: 1000 },
        { nome: 'ctrl A', segmento: 'controle', atendente: '', valor: 50000 },
        { nome: 'ctrl B', segmento: 'controle', atendente: '', valor: 60000 },
        { nome: 'qual A', segmento: 'qualificada', atendente: '', valor: 900000 }
    ];
    for (var k = 0; k < lista.length; k++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício UX-004 neg ' + lista[k].nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        p.setValue('valor_em_aberto', lista[k].valor);
        if (lista[k].atendente) { p.setValue('atendente', lista[k].atendente); }
        var pid = p.insert();
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', pid);
        s.setValue('segmento', lista[k].segmento);
        s.insert();
    }
    return !!ciclo;
})(outputs, steps, params, stepResult, assertEqual);` })
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-004_test_05'], firstName: 'ATF', lastName: 'Coordenador UX-004 neg', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-004_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function ciclo(rotulo) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.addQuery('nome', 'ATF ciclo ' + rotulo + ' (fictício)');
        c.query();
        c.next();
        return c;
    }
    function contatos(cicloId, filtro) {
        var g = new GlideRecord('x_2326104_cob_contato');
        g.addQuery('ciclo', cicloId);
        if (filtro) { g.addEncodedQuery(filtro); }
        g.query();
        var n = 0;
        while (g.next()) { n++; }
        return n;
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.addQuery('nome', 'Contribuinte fictício UX-004 neg ' + nome);
        p.query();
        p.next();
        return p.getUniqueValue();
    }
    describe('Distribuição recusada', function() {
        // Os dois cliques rodam antes dos casos (o Jasmine embaralha a ordem dos it).
        var c = ciclo('UX-004 neg');
        var primeiro = new QualificacaoCiclo().distribuir(c);
        var lido = new GlideRecord('x_2326104_cob_ciclo');
        lido.get(c.getUniqueValue());
        var segundo = new QualificacaoCiclo().distribuir(lido);
        var depois = contatos(c.getUniqueValue(), '');
        it('segundo clique não duplica', function() {
            expect(primeiro.ok).toBe(true);
            expect(segundo.ok).toBe(false);
            expect(segundo.mensagem).toBe('Operação recusada: ciclo já distribuído ou não publicado.');
            expect(depois).toBe(3);
        });
        it('contato para contribuinte do grupo de controle é recusado; da massificada, gravado', function() {
            var k = new GlideRecord('x_2326104_cob_contato');
            k.initialize();
            k.setValue('contribuinte', contribuinte('ctrl A'));
            k.setValue('ciclo', c.getUniqueValue());
            k.setValue('status', 'a_ligar');
            expect(new QualificacaoCiclo().motivoRecusaAcao(k)).toBe('Contribuinte está no Grupo de controle do ciclo e fica fora das ações de cobrança.');
            expect(!!k.insert()).toBe(false);
            var m = new GlideRecord('x_2326104_cob_contato');
            m.initialize();
            m.setValue('contribuinte', contribuinte('qual A'));
            m.setValue('ciclo', c.getUniqueValue());
            m.setValue('status', 'a_ligar');
            expect(!!m.insert()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux004_ui = Test({
    $id: Now.ID['US-MOD-UX-004_atf_ui_distribuir'],
    name: 'RF-MOD-UX-004 — «Distribuir lista» aparece para o coordenador no ciclo publicado sem distribuição',
    description: 'Abre no form (TEL-009) um ciclo publicado e ainda não distribuído como coordenador: o botão «Distribuir lista» aparece e «Publicar ciclo» não (UI Action com condition e roles).',
    failOnServerError: true,
}, (atf) => {
    const ciclo = atf.server.recordInsert({
        $id: Now.ID['US-MOD-UX-004_test_07'],
        table: 'x_2326104_cob_ciclo',
        fieldValues: { nome: 'ATF ciclo UI UX-004 (fictício)', estado: 'publicado' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-004_test_08'], firstName: 'ATF', lastName: 'Coordenador UX-004 UI', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-UX-004_test_09'], table: 'x_2326104_cob_ciclo', recordId: ciclo.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-UX-004_test_10'], table: 'x_2326104_cob_ciclo', visible: [Now.ref('sys_ui_action', 'RF-MOD-UX-004_ua_distribuir_lista')], notVisible: [Now.ref('sys_ui_action', 'RF-MOD-F2-004_ua_publicar_ciclo')] })
})
