// ATF da US-MOD-F5-007 — atendente vê só a própria carteira (RF-MOD-F5-007, RN-NOVO-F5-007, SEC-002).
// Usa os atendentes demo do seed (demo.atendente e demo.atendente2) impersonados, sem enforceSecurity
// desligado (RN-SN-83). Massa fictícia criada pelo próprio teste e desfeita pelo rollback do ATF.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'

export const t_f5007_propria_pos = Test({
    $id: Now.ID['US-MOD-F5-007_atf_carteira_propria_positivo'],
    name: 'RF-MOD-F5-007 — atendente vê e grava os registros da própria carteira',
    description: 'Cria um contribuinte, um caso, uma interação e um débito fictícios da carteira de demo.atendente; impersonado como demo.atendente, lê os quatro registros, grava o caso e registra uma interação nova no próprio caso (ACL de carteira, lado positivo).',
    failOnServerError: true,
    // migrar na F4: o caso passou ao coordenador (caso.atendente → caso.coordenador, design UX v1 R6); a premissa deste teste se inverteu
    active: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício carteira A F5-007');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var c = new GlideRecord('x_2326104_cob_caso');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('atendente', u.getUniqueValue());
    c.setValue('estagio', 'conducao');
    var cid = c.insert();
    var i = new GlideRecord('x_2326104_cob_interacao');
    i.initialize();
    i.setValue('caso', cid);
    i.setValue('resultado', 'sem_contato');
    i.setValue('descricao', 'Interação fictícia F5-007');
    i.insert();
    var d = new GlideRecord('x_2326104_cob_debito');
    d.initialize();
    d.setValue('contribuinte', pid);
    d.setValue('origem', 'ccf');
    d.setValue('valor', 1000);
    d.insert();
    outputs.table = 'x_2326104_cob_caso';
    outputs.record_id = cid;
    return !!cid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const dono = atf.server.recordQuery({ $id: Now.ID['US-MOD-F5-007_test_02'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F5-007_test_03'], user: dono.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Carteira própria (demo.atendente)', function() {
        var c = new GlideRecordSecure('x_2326104_cob_caso');
        c.addQuery('contribuinte.nome', 'Contribuinte fictício carteira A F5-007');
        c.query();
        var achou = c.next();
        it('lê caso, contribuinte, interação e débito', function() {
            expect(achou).toBe(true);
            var p = new GlideRecordSecure('x_2326104_cob_contribuinte');
            expect(p.get(c.getValue('contribuinte'))).toBe(true);
            var i = new GlideRecordSecure('x_2326104_cob_interacao');
            i.addQuery('caso', c.getUniqueValue());
            i.query();
            expect(i.next()).toBe(true);
            var d = new GlideRecordSecure('x_2326104_cob_debito');
            d.addQuery('contribuinte', c.getValue('contribuinte'));
            d.query();
            expect(d.next()).toBe(true);
        });
        it('grava o caso e registra interação no próprio caso', function() {
            expect(c.canWrite()).toBe(true);
            var n = new GlideRecordSecure('x_2326104_cob_interacao');
            n.initialize();
            n.setValue('caso', c.getUniqueValue());
            n.setValue('resultado', 'sem_contato');
            n.setValue('descricao', 'Nova interação fictícia');
            expect(!!n.insert()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f5007_outro_neg = Test({
    $id: Now.ID['US-MOD-F5-007_atf_carteira_outro_atendente_negativo'],
    name: 'RF-MOD-F5-007 — atendente não vê nem grava a carteira de outro atendente',
    description: 'Cria caso, contribuinte, interação, débito e parcelamento fictícios da carteira de demo.atendente e um caso de demo.atendente2; impersonado como demo.atendente2, a lista e a contagem não trazem nem contam o caso do outro (sem o aviso de linhas removidas), abrir os registros do outro retorna vazio, registrar interação ou encerrar o caso do outro — pela tela ou por script — é recusado com «Operação recusada: atendente vê só a própria carteira.», ele não troca o dono do próprio caso, e o próprio caso continua visível (ACL de carteira e business rule, lado negativo).',
    failOnServerError: true,
    // migrar na F4: o caso passou ao coordenador (caso.atendente → caso.coordenador, design UX v1 R6); a premissa deste teste se inverteu
    active: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_05'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(nome) { var u = new GlideRecord('sys_user'); u.get('user_name', nome); return u.getUniqueValue(); }
    function carteira(rotulo, dono) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + rotulo + ' F5-007');
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        p.setValue('atendente', dono);
        var pid = p.insert();
        var c = new GlideRecord('x_2326104_cob_caso');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', dono);
        var cid = c.insert();
        var i = new GlideRecord('x_2326104_cob_interacao');
        i.initialize();
        i.setValue('caso', cid);
        i.setValue('resultado', 'sem_contato');
        i.insert();
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', pid);
        d.setValue('origem', 'ccf');
        d.insert();
        var pa = new GlideRecord('x_2326104_cob_parcelamento');
        pa.initialize();
        pa.setValue('contribuinte', pid);
        pa.insert();
        return cid;
    }
    carteira('carteira A neg', usuario('demo.atendente'));
    outputs.table = 'x_2326104_cob_caso';
    outputs.record_id = carteira('carteira B neg', usuario('demo.atendente2'));
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const outro = atf.server.recordQuery({ $id: Now.ID['US-MOD-F5-007_test_06'], table: 'sys_user', fieldValues: 'user_name=demo.atendente2', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F5-007_test_07'], user: outro.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_08'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function idDe(tabela, campo, valor) {
        var g = new GlideRecord(tabela);
        g.setWorkflow(false); // só para achar o id do registro do outro atendente: a consulta normal já não o traz
        g.addQuery(campo, valor);
        g.query();
        return g.next() ? g.getUniqueValue() : '';
    }
    describe('Carteira de outro atendente (demo.atendente2)', function() {
        var pA = idDe('x_2326104_cob_contribuinte', 'nome', 'Contribuinte fictício carteira A neg F5-007');
        var cA = idDe('x_2326104_cob_caso', 'contribuinte', pA);
        it('a lista não traz o caso do outro atendente', function() {
            var l = new GlideRecordSecure('x_2326104_cob_caso');
            l.addQuery('contribuinte', pA);
            l.query();
            expect(l.next()).toBe(false);
        });
        it('abrir caso, contribuinte, interação, débito e parcelamento do outro retorna vazio', function() {
            expect(new GlideRecordSecure('x_2326104_cob_caso').get(cA)).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_contribuinte').get(pA)).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_interacao').get(idDe('x_2326104_cob_interacao', 'caso', cA))).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_debito').get(idDe('x_2326104_cob_debito', 'contribuinte', pA))).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_parcelamento').get(idDe('x_2326104_cob_parcelamento', 'contribuinte', pA))).toBe(false);
        });
        it('não registra interação no caso do outro', function() {
            var n = new GlideRecordSecure('x_2326104_cob_interacao');
            n.initialize();
            n.setValue('caso', cA);
            n.setValue('resultado', 'sem_contato');
            expect(new CarteiraAtendente().motivoRecusa(n, 'caso.atendente')).toBe('Operação recusada: atendente vê só a própria carteira.');
            expect(!!n.insert()).toBe(false);
            var porScript = new GlideRecord('x_2326104_cob_interacao');
            porScript.initialize();
            porScript.setValue('caso', cA);
            porScript.setValue('resultado', 'sem_contato');
            expect(!!porScript.insert()).toBe(false);
        });
        it('não altera o caso do outro nem por script', function() {
            var g = new GlideRecord('x_2326104_cob_caso');
            g.setWorkflow(false);
            expect(g.get(cA)).toBe(true);
            g.setWorkflow(true);
            g.setValue('estagio', 'encerrado');
            g.update();
            var lido = new GlideRecord('x_2326104_cob_caso');
            lido.setWorkflow(false);
            lido.get(cA);
            expect(lido.getValue('estagio')).not.toBe('encerrado');
        });
        it('a consulta e a contagem não trazem linhas de outra carteira', function() {
            var agg = new GlideAggregate('x_2326104_cob_caso');
            agg.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício carteira ');
            agg.addQuery('contribuinte.nome', 'ENDSWITH', 'neg F5-007');
            agg.addAggregate('COUNT');
            agg.query();
            agg.next();
            expect(agg.getAggregate('COUNT')).toBe('1');
            var semAcl = new GlideRecord('x_2326104_cob_debito');
            semAcl.addQuery('contribuinte', pA);
            semAcl.query();
            expect(semAcl.hasNext()).toBe(false);
        });
        it('não troca o dono do próprio caso', function() {
            var pB = idDe('x_2326104_cob_contribuinte', 'nome', 'Contribuinte fictício carteira B neg F5-007');
            var meu = new GlideRecord('x_2326104_cob_caso');
            meu.addQuery('contribuinte', pB);
            meu.query();
            expect(meu.next()).toBe(true);
            var outro = new GlideRecord('x_2326104_cob_caso');
            outro.setWorkflow(false);
            outro.get(cA);
            meu.setValue('atendente', outro.getValue('atendente'));
            meu.update();
            var lido = new GlideRecord('x_2326104_cob_caso');
            lido.setWorkflow(false);
            lido.get(meu.getUniqueValue());
            expect(lido.getValue('atendente')).toBe(gs.getUserID());
        });
        it('continua vendo o próprio caso', function() {
            var pB = idDe('x_2326104_cob_contribuinte', 'nome', 'Contribuinte fictício carteira B neg F5-007');
            var l = new GlideRecordSecure('x_2326104_cob_caso');
            l.addQuery('contribuinte', pB);
            l.query();
            expect(l.next()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f5007_coord_pos = Test({
    $id: Now.ID['US-MOD-F5-007_atf_coordenador_ve_tudo_positivo'],
    name: 'RF-MOD-F5-007 — coordenador vê a carteira de todos os atendentes',
    description: 'Cria casos fictícios de demo.atendente e de demo.atendente2 e entra como usuário com o papel coordenador: ele lê os dois casos e os dois contribuintes, mas não registra interação (coordenador só lê interações — ACL de carteira, lado do papel que vê tudo).',
    failOnServerError: true,
    // migrar na F4: o caso passou ao coordenador (caso.atendente → caso.coordenador, design UX v1 R6); a premissa deste teste se inverteu
    active: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_09'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var nomes = ['demo.atendente', 'demo.atendente2'];
    for (var k = 0; k < nomes.length; k++) {
        var u = new GlideRecord('sys_user');
        u.get('user_name', nomes[k]);
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício coord ' + k + ' F5-007');
        p.setValue('tipo_pessoa', 'pf');
        p.setValue('ficticio', true);
        p.setValue('atendente', u.getUniqueValue());
        var c = new GlideRecord('x_2326104_cob_caso');
        c.initialize();
        c.setValue('contribuinte', p.insert());
        c.setValue('atendente', u.getUniqueValue());
        c.insert();
    }
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F5-007_test_10'], firstName: 'ATF', lastName: 'Coordenador F5-007', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_11'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Coordenador', function() {
        it('lê os casos e contribuintes dos dois atendentes', function() {
            var c = new GlideRecordSecure('x_2326104_cob_caso');
            c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício coord ');
            c.query();
            var n = 0;
            while (c.next()) { n++; }
            expect(n).toBe(2);
            var p = new GlideRecordSecure('x_2326104_cob_contribuinte');
            p.addQuery('nome', 'STARTSWITH', 'Contribuinte fictício coord ');
            p.query();
            var m = 0;
            while (p.next()) { m++; }
            expect(m).toBe(2);
        });
        it('não registra interação', function() {
            expect(new GlideRecordSecure('x_2326104_cob_interacao').canCreate()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
