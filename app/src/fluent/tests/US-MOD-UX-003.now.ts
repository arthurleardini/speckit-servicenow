// ATF da US-MOD-UX-003 — «Encerrar» contato da lista com motivo (RF-MOD-UX-003, RN-NOVO-UX-005). Massa
// fictícia criada pelo próprio teste (rollback do ATF desfaz); demo.atendente impersonado.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'



export const t_ux003_pos = Test({
    $id: Now.ID['US-MOD-UX-003_atf_encerrar_positivo'],
    name: 'RF-MOD-UX-003 — encerrar com motivo tira o contato de «Minha lista»',
    description: 'Como demo.atendente, encerra um contato «Ligado» fictício com motivo «Regularizado»: o status vira «Encerrado», a próxima ação fica vazia, o motivo é gravado e o contato, que estava em «Minha lista», sai dela (RN-NOVO-UX-005, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-003_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-003 positivo');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'ligado', tentativas: 1, prioridade: 9601}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        if (lista[k].motivo) { c.setValue('motivo_encerramento', lista[k].motivo); }
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_003_test_02 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-003_test_02'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-003_test_03'], user: u_US_MOD_UX_003_test_02.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-003_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function contato(marca) {
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-003');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecordSecure('x_2326104_cob_contato');
        g.get(c.getUniqueValue());
        return g;
    }
    function naMinhaLista(c) {
        var l = new GlideRecordSecure('x_2326104_cob_contato');
        l.addEncodedQuery('atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()');
        l.addQuery('sys_id', c.getUniqueValue());
        l.query();
        return l.hasNext();
    }
    describe('Encerrar contato', function() {
        it('com motivo regularizado: encerrado, sem próxima ação e fora de Minha lista', function() {
            var c = contato(9601);
            expect(naMinhaLista(c)).toBe(true);
            var r = new ContatoLigacao().encerrar(c, 'regularizado');
            expect(r.ok).toBe(true);
            expect(r.mensagem).toBe('Contato encerrado: Regularizado.');
            var g = relido(c);
            expect(g.getValue('status')).toBe('encerrado');
            expect(g.getValue('motivo_encerramento')).toBe('regularizado');
            expect(g.getValue('proxima_acao_em')).toBeFalsy();
            expect(naMinhaLista(g)).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux003_neg = Test({
    $id: Now.ID['US-MOD-UX-003_atf_encerrar_negativo'],
    name: 'RF-MOD-UX-003 — encerrar sem motivo ou contato já encerrado é recusado',
    description: 'Como demo.atendente: encerrar um contato «A ligar» sem motivo é recusado com «Operação recusada: informe o motivo de encerramento.» e o contato continua «A ligar»; encerrar de novo um contato encerrado por recusa é recusado com «Operação recusada: contato já encerrado.» e o motivo não muda (RN-NOVO-UX-005, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-003_test_05'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-003 negativo');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'a_ligar', tentativas: 0, prioridade: 9701}, {status: 'encerrado', tentativas: 1, prioridade: 9702, motivo: 'recusa'}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        if (lista[k].motivo) { c.setValue('motivo_encerramento', lista[k].motivo); }
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_003_test_06 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-003_test_06'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-003_test_07'], user: u_US_MOD_UX_003_test_06.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-003_test_08'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function contato(marca) {
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-003');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecordSecure('x_2326104_cob_contato');
        g.get(c.getUniqueValue());
        return g;
    }
    function naMinhaLista(c) {
        var l = new GlideRecordSecure('x_2326104_cob_contato');
        l.addEncodedQuery('atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()');
        l.addQuery('sys_id', c.getUniqueValue());
        l.query();
        return l.hasNext();
    }
    describe('Encerrar recusado', function() {
        it('sem motivo', function() {
            var c = contato(9701);
            var r = new ContatoLigacao().encerrar(c, '');
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Operação recusada: informe o motivo de encerramento.');
            expect(relido(c).getValue('status')).toBe('a_ligar');
        });
        it('contato já encerrado', function() {
            var c = contato(9702);
            var r = new ContatoLigacao().encerrar(c, 'outro');
            expect(r.mensagem).toBe('Operação recusada: contato já encerrado.');
            expect(relido(c).getValue('motivo_encerramento')).toBe('recusa');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
