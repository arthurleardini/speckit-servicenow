// ATF da US-MOD-F5-007 — atendente vê só a própria carteira (RF-MOD-F5-007, RN-NOVO-F5-007, SEC-002).
// Migrado na F4 do design UX v1 (R3, R4, R6, US-MOD-UX-006): a carteira do atendente é feita de contribuintes e
// contatos da lista; o caso qualificado é do coordenador e o atendente não tem acesso a ele. Usa os atendentes
// demo do seed (demo.atendente e demo.atendente2) impersonados, sem enforceSecurity desligado (RN-SN-83). Massa
// fictícia criada pelo próprio teste e desfeita pelo rollback do ATF.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'

export const t_f5007_propria_pos = Test({
    $id: Now.ID['US-MOD-F5-007_atf_carteira_propria_positivo'],
    name: 'RF-MOD-F5-007 — atendente vê e grava os registros da própria carteira',
    description: 'Cria um contribuinte, um contato da lista, uma interação do contato e um débito fictícios da carteira de demo.atendente; impersonado como demo.atendente, lê os quatro registros, grava o contato e registra uma interação nova no próprio contato (ACL de carteira, lado positivo).',
    failOnServerError: true,
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
    var c = new GlideRecord('x_2326104_cob_contato');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('atendente', u.getUniqueValue());
    c.setValue('status', 'a_ligar');
    var cid = c.insert();
    var i = new GlideRecord('x_2326104_cob_interacao');
    i.initialize();
    i.setValue('contato', cid);
    i.setValue('resultado', 'sem_contato');
    i.setValue('descricao', 'Interação fictícia F5-007');
    i.insert();
    var d = new GlideRecord('x_2326104_cob_debito');
    d.initialize();
    d.setValue('contribuinte', pid);
    d.setValue('origem', 'ccf');
    d.setValue('valor', 1000);
    d.insert();
    outputs.table = 'x_2326104_cob_contato';
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
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('contribuinte.nome', 'Contribuinte fictício carteira A F5-007');
        c.query();
        var achou = c.next();
        it('lê contato, contribuinte, interação e débito', function() {
            expect(achou).toBe(true);
            var p = new GlideRecordSecure('x_2326104_cob_contribuinte');
            expect(p.get(c.getValue('contribuinte'))).toBe(true);
            var i = new GlideRecordSecure('x_2326104_cob_interacao');
            i.addQuery('contato', c.getUniqueValue());
            i.query();
            expect(i.next()).toBe(true);
            var d = new GlideRecordSecure('x_2326104_cob_debito');
            d.addQuery('contribuinte', c.getValue('contribuinte'));
            d.query();
            expect(d.next()).toBe(true);
        });
        it('grava o contato e registra interação no próprio contato', function() {
            expect(c.canWrite()).toBe(true);
            var n = new GlideRecordSecure('x_2326104_cob_interacao');
            n.initialize();
            n.setValue('contato', c.getUniqueValue());
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
    name: 'RF-MOD-F5-007 — atendente não vê nem grava a carteira de outro atendente nem o caso qualificado',
    description: 'Cria contribuinte, contato, interação, débito e parcelamento fictícios da carteira de demo.atendente, um contato de demo.atendente2 e um caso qualificado de demo.coordenador; impersonado como demo.atendente2, a lista e a contagem não trazem nem contam o contato do outro (sem o aviso de linhas removidas), abrir os registros do outro retorna vazio, registrar interação ou alterar o contato do outro — pela tela ou por script — é recusado com «Operação recusada: atendente vê só a própria carteira.», ele não troca o dono do próprio contato, o próprio contato continua visível e o caso qualificado não aparece nem é gravado (ACL de carteira, deny do caso e business rule, lado negativo).',
    failOnServerError: true,
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
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', dono);
        c.setValue('status', 'a_ligar');
        var cid = c.insert();
        var i = new GlideRecord('x_2326104_cob_interacao');
        i.initialize();
        i.setValue('contato', cid);
        i.setValue('resultado', 'sem_contato');
        i.setValue('descricao', 'Interação fictícia F5-007');
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
        return pid;
    }
    var pA = carteira('carteira A neg', usuario('demo.atendente'));
    carteira('carteira B neg', usuario('demo.atendente2'));
    var k = new GlideRecord('x_2326104_cob_caso');
    k.initialize();
    k.setValue('contribuinte', pA);
    k.setValue('coordenador', usuario('demo.coordenador'));
    k.setValue('estagio', 'conducao');
    k.setValue('prioridade', 97007);
    outputs.table = 'x_2326104_cob_caso';
    outputs.record_id = k.insert();
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
        g.setWorkflow(false); // só para achar o id do registro do outro: a consulta normal já não o traz
        g.addQuery(campo, valor);
        g.query();
        return g.next() ? g.getUniqueValue() : '';
    }
    describe('Carteira de outro atendente (demo.atendente2)', function() {
        var pA = idDe('x_2326104_cob_contribuinte', 'nome', 'Contribuinte fictício carteira A neg F5-007');
        var cA = idDe('x_2326104_cob_contato', 'contribuinte', pA);
        var kA = idDe('x_2326104_cob_caso', 'prioridade', 97007);
        it('a lista não traz o contato do outro atendente', function() {
            var l = new GlideRecordSecure('x_2326104_cob_contato');
            l.addQuery('contribuinte', pA);
            l.query();
            expect(l.next()).toBe(false);
        });
        it('abrir contato, contribuinte, interação, débito e parcelamento do outro retorna vazio', function() {
            expect(new GlideRecordSecure('x_2326104_cob_contato').get(cA)).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_contribuinte').get(pA)).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_interacao').get(idDe('x_2326104_cob_interacao', 'contato', cA))).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_debito').get(idDe('x_2326104_cob_debito', 'contribuinte', pA))).toBe(false);
            expect(new GlideRecordSecure('x_2326104_cob_parcelamento').get(idDe('x_2326104_cob_parcelamento', 'contribuinte', pA))).toBe(false);
        });
        it('não registra interação no contato do outro', function() {
            var n = new GlideRecordSecure('x_2326104_cob_interacao');
            n.initialize();
            n.setValue('contato', cA);
            n.setValue('resultado', 'sem_contato');
            n.setValue('descricao', 'Tentativa fictícia');
            expect(new CarteiraAtendente().motivoRecusa(n, ['contato.atendente', 'caso.coordenador'])).toBe('Operação recusada: atendente vê só a própria carteira.');
            expect(!!n.insert()).toBe(false);
            var porScript = new GlideRecord('x_2326104_cob_interacao');
            porScript.initialize();
            porScript.setValue('contato', cA);
            porScript.setValue('resultado', 'sem_contato');
            porScript.setValue('descricao', 'Tentativa fictícia');
            expect(!!porScript.insert()).toBe(false);
        });
        it('não altera o contato do outro nem por script nem pelo verbo', function() {
            var g = new GlideRecord('x_2326104_cob_contato');
            g.setWorkflow(false);
            expect(g.get(cA)).toBe(true);
            g.setWorkflow(true);
            expect(new ContatoLigacao().registrar(g, { resultado: 'recusa', anotacao: 'Tentativa fictícia', retorno: '' }).mensagem).toBe('Operação recusada: atendente vê só a própria carteira.');
            g.setValue('status', 'ligado');
            g.update();
            var lido = new GlideRecord('x_2326104_cob_contato');
            lido.setWorkflow(false);
            lido.get(cA);
            expect(lido.getValue('status')).toBe('a_ligar');
        });
        it('a consulta e a contagem não trazem linhas de outra carteira', function() {
            var agg = new GlideAggregate('x_2326104_cob_contato');
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
        it('não troca o dono do próprio contato', function() {
            var pB = idDe('x_2326104_cob_contribuinte', 'nome', 'Contribuinte fictício carteira B neg F5-007');
            var meu = new GlideRecord('x_2326104_cob_contato');
            meu.addQuery('contribuinte', pB);
            meu.query();
            expect(meu.next()).toBe(true);
            meu.setValue('atendente', idDe('sys_user', 'user_name', 'demo.atendente'));
            meu.update();
            var lido = new GlideRecord('x_2326104_cob_contato');
            lido.setWorkflow(false);
            lido.get(meu.getUniqueValue());
            expect(lido.getValue('atendente')).toBe(gs.getUserID());
        });
        it('continua vendo o próprio contato', function() {
            var pB = idDe('x_2326104_cob_contribuinte', 'nome', 'Contribuinte fictício carteira B neg F5-007');
            var l = new GlideRecordSecure('x_2326104_cob_contato');
            l.addQuery('contribuinte', pB);
            l.query();
            expect(l.next()).toBe(true);
        });
        it('não vê nem grava o caso qualificado, nem registra interação nele', function() {
            expect(new GlideRecordSecure('x_2326104_cob_caso').get(kA)).toBe(false);
            var l = new GlideRecordSecure('x_2326104_cob_caso');
            l.addQuery('prioridade', 97007);
            l.query();
            expect(l.hasNext()).toBe(false);
            var g = new GlideRecord('x_2326104_cob_caso');
            g.setWorkflow(false);
            g.get(kA);
            expect(g.canRead()).toBe(false);
            expect(g.canWrite()).toBe(false);
            var n = new GlideRecordSecure('x_2326104_cob_interacao');
            n.initialize();
            n.setValue('caso', kA);
            n.setValue('resultado', 'sem_contato');
            n.setValue('descricao', 'Tentativa fictícia');
            expect(!!n.insert()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f5007_coord_pos = Test({
    $id: Now.ID['US-MOD-F5-007_atf_coordenador_ve_tudo_positivo'],
    name: 'RF-MOD-F5-007 — coordenador vê a carteira de todos os atendentes e registra interação no caso',
    description: 'Cria contatos fictícios de demo.atendente e de demo.atendente2 e um caso qualificado de demo.coordenador; entra como usuário com o papel coordenador: ele lê os dois contatos, os dois contribuintes e o caso, e registra interação no caso (design UX v1 R4 — o coordenador conduz o caso; ACL de carteira, lado do papel que vê tudo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_09'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var nomes = ['demo.atendente', 'demo.atendente2'];
    var pid = '';
    for (var k = 0; k < nomes.length; k++) {
        var u = new GlideRecord('sys_user');
        u.get('user_name', nomes[k]);
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício coord ' + k + ' F5-007');
        p.setValue('tipo_pessoa', 'pf');
        p.setValue('ficticio', true);
        p.setValue('atendente', u.getUniqueValue());
        pid = p.insert();
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', 'a_ligar');
        c.insert();
    }
    var co = new GlideRecord('sys_user');
    co.get('user_name', 'demo.coordenador');
    var caso = new GlideRecord('x_2326104_cob_caso');
    caso.initialize();
    caso.setValue('contribuinte', pid);
    caso.setValue('coordenador', co.getUniqueValue());
    caso.setValue('estagio', 'conducao');
    caso.setValue('prioridade', 97017);
    caso.insert();
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F5-007_test_10'], firstName: 'ATF', lastName: 'Coordenador F5-007', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-007_test_11'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Coordenador', function() {
        it('lê os contatos e contribuintes dos dois atendentes', function() {
            var c = new GlideRecordSecure('x_2326104_cob_contato');
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
        it('lê o caso qualificado e registra interação nele (R4)', function() {
            var k = new GlideRecordSecure('x_2326104_cob_caso');
            k.addQuery('prioridade', 97017);
            k.query();
            expect(k.next()).toBe(true);
            var i = new GlideRecordSecure('x_2326104_cob_interacao');
            expect(i.canCreate()).toBe(true);
            i.initialize();
            i.setValue('caso', k.getUniqueValue());
            i.setValue('resultado', 'contato_efetivo');
            i.setValue('descricao', 'Reunião fictícia com o contribuinte');
            expect(!!i.insert()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
