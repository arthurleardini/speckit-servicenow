// ATF da US-MOD-UX-002 — «Registrar ligação» no contato da lista (RF-MOD-UX-002, RN-NOVO-UX-003,
// RN-NOVO-UX-004). Um teste positivo por linha da tabela de decisão do design UX v1, um negativo de entrada
// e um da regra «exatamente um entre contato e caso». Massa fictícia criada pelo próprio teste (rollback do
// ATF desfaz); demo.atendente impersonado, sem enforceSecurity desligado.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'



export const t_ux002_promessa = Test({
    $id: Now.ID['US-MOD-UX-002_atf_promessa_positivo'],
    name: 'RF-MOD-UX-002 — promessa de pagamento leva o contato a «Ligado» com próxima ação',
    description: 'Como demo.atendente, registra a ligação com resultado «Promessa de pagamento» em dois contatos «A ligar» fictícios: sem retorno, o contato fica «Ligado», 1 tentativa e próxima ação em hoje + 7 dias; com retorno informado, a próxima ação é o retorno. Nos dois, a interação nasce ligada ao contato, com a anotação e o atendente (tabela de decisão, linha 1).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-002 promessa');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'a_ligar', tentativas: 0, prioridade: 9101}, {status: 'a_ligar', tentativas: 0, prioridade: 9102}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        c.setValue('valor_em_aberto', 18450);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_002_test_02 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-002_test_02'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-002_test_03'], user: u_US_MOD_UX_002_test_02.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function contato(marca) {
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-002');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecordSecure('x_2326104_cob_contato');
        g.get(c.getUniqueValue());
        return g;
    }
    function daqui(n) {
        var d = new GlideDateTime();
        d.addDaysLocalTime(n);
        return d.getLocalDate().getValue();
    }
    function interacoes(c) {
        var i = new GlideRecordSecure('x_2326104_cob_interacao');
        i.addQuery('contato', c.getUniqueValue());
        i.query();
        var n = 0, ultima = null;
        while (i.next()) { n++; ultima = { descricao: i.getValue('descricao'), resultado: i.getValue('resultado'), retorno: i.getValue('retorno_em'), atendente: i.getValue('atendente') }; }
        return { n: n, ultima: ultima };
    }
    describe('Promessa de pagamento', function() {
        it('sem retorno: ligado, 1 tentativa, próxima ação hoje + 7, interação criada', function() {
            var c = contato(9101);
            var r = new ContatoLigacao().registrar(c, { resultado: 'promessa_pagamento', anotacao: 'Prometeu pagar a 1ª parcela', retorno: '' });
            expect(r.ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('ligado');
            expect(g.getValue('tentativas')).toBe('1');
            expect(g.getValue('ultimo_resultado')).toBe('promessa_pagamento');
            expect(g.getValue('proxima_acao_em')).toBe(daqui(7));
            var i = interacoes(c);
            expect(i.n).toBe(1);
            expect(i.ultima.descricao).toBe('Prometeu pagar a 1ª parcela');
            expect(i.ultima.resultado).toBe('promessa_pagamento');
            expect(i.ultima.atendente).toBe(gs.getUserID());
        });
        it('com retorno: a próxima ação é o retorno informado', function() {
            var c = contato(9102);
            var retorno = daqui(3);
            expect(new ContatoLigacao().registrar(c, { resultado: 'promessa_pagamento', anotacao: 'Paga na sexta', retorno: retorno }).ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('ligado');
            expect(g.getValue('proxima_acao_em')).toBe(retorno);
            expect(interacoes(c).ultima.retorno).toBe(retorno);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux002_sem_contato = Test({
    $id: Now.ID['US-MOD-UX-002_atf_sem_contato_positivo'],
    name: 'RF-MOD-UX-002 — sem contato: retorna amanhã até a 3ª tentativa, que encerra',
    description: 'Como demo.atendente, registra «Sem contato» num contato «A ligar» com 0 tentativas (fica «Retornar», próxima ação amanhã, 1 tentativa) e num contato «Retornar» com 2 tentativas (fica «Encerrado», motivo «Sem contato», próxima ação vazia, 3 tentativas) — tabela de decisão, linhas 4 e 5.',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_05'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-002 sem contato');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'a_ligar', tentativas: 0, prioridade: 9201}, {status: 'retornar', tentativas: 2, prioridade: 9202}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        c.setValue('valor_em_aberto', 18450);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_002_test_06 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-002_test_06'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-002_test_07'], user: u_US_MOD_UX_002_test_06.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_08'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function contato(marca) {
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-002');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecordSecure('x_2326104_cob_contato');
        g.get(c.getUniqueValue());
        return g;
    }
    function daqui(n) {
        var d = new GlideDateTime();
        d.addDaysLocalTime(n);
        return d.getLocalDate().getValue();
    }
    function interacoes(c) {
        var i = new GlideRecordSecure('x_2326104_cob_interacao');
        i.addQuery('contato', c.getUniqueValue());
        i.query();
        var n = 0, ultima = null;
        while (i.next()) { n++; ultima = { descricao: i.getValue('descricao'), resultado: i.getValue('resultado'), retorno: i.getValue('retorno_em'), atendente: i.getValue('atendente') }; }
        return { n: n, ultima: ultima };
    }
    describe('Sem contato', function() {
        it('1ª tentativa: retornar amanhã', function() {
            var c = contato(9201);
            expect(new ContatoLigacao().registrar(c, { resultado: 'sem_contato', anotacao: 'Caixa postal', retorno: '' }).ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('retornar');
            expect(g.getValue('tentativas')).toBe('1');
            expect(g.getValue('proxima_acao_em')).toBe(daqui(1));
            expect(g.getValue('motivo_encerramento')).toBeFalsy();
        });
        it('3ª tentativa: encerrado por sem contato, próxima ação vazia', function() {
            var c = contato(9202);
            expect(new ContatoLigacao().registrar(c, { resultado: 'sem_contato', anotacao: 'Não atende de novo', retorno: '' }).ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('encerrado');
            expect(g.getValue('tentativas')).toBe('3');
            expect(g.getValue('motivo_encerramento')).toBe('sem_contato');
            expect(g.getValue('proxima_acao_em')).toBeFalsy();
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux002_recusa_efetivo = Test({
    $id: Now.ID['US-MOD-UX-002_atf_recusa_contato_efetivo_positivo'],
    name: 'RF-MOD-UX-002 — recusa encerra; contato efetivo retorna na data combinada ou encerra',
    description: 'Como demo.atendente: «Recusa» encerra o contato com motivo «Recusa»; «Contato efetivo» com retorno leva a «Retornar» na data do retorno; «Contato efetivo» sem retorno encerra com motivo «Contato realizado» (tabela de decisão, linhas 2, 3 e 6).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_09'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-002 recusa');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'a_ligar', tentativas: 0, prioridade: 9301}, {status: 'ligado', tentativas: 1, prioridade: 9302}, {status: 'a_ligar', tentativas: 0, prioridade: 9303}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        c.setValue('valor_em_aberto', 18450);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_002_test_10 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-002_test_10'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-002_test_11'], user: u_US_MOD_UX_002_test_10.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_12'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function contato(marca) {
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-002');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecordSecure('x_2326104_cob_contato');
        g.get(c.getUniqueValue());
        return g;
    }
    function daqui(n) {
        var d = new GlideDateTime();
        d.addDaysLocalTime(n);
        return d.getLocalDate().getValue();
    }
    function interacoes(c) {
        var i = new GlideRecordSecure('x_2326104_cob_interacao');
        i.addQuery('contato', c.getUniqueValue());
        i.query();
        var n = 0, ultima = null;
        while (i.next()) { n++; ultima = { descricao: i.getValue('descricao'), resultado: i.getValue('resultado'), retorno: i.getValue('retorno_em'), atendente: i.getValue('atendente') }; }
        return { n: n, ultima: ultima };
    }
    describe('Recusa e contato efetivo', function() {
        it('recusa: encerrado com motivo recusa', function() {
            var c = contato(9301);
            expect(new ContatoLigacao().registrar(c, { resultado: 'recusa', anotacao: 'Não reconhece o débito', retorno: '' }).ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('encerrado');
            expect(g.getValue('motivo_encerramento')).toBe('recusa');
            expect(g.getValue('proxima_acao_em')).toBeFalsy();
        });
        it('contato efetivo com retorno: retornar na data do retorno', function() {
            var c = contato(9302);
            var retorno = daqui(5);
            expect(new ContatoLigacao().registrar(c, { resultado: 'contato_efetivo', anotacao: 'Pediu para ligar depois', retorno: retorno }).ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('retornar');
            expect(g.getValue('proxima_acao_em')).toBe(retorno);
            expect(g.getValue('tentativas')).toBe('2');
        });
        it('contato efetivo sem retorno: encerrado com motivo contato realizado', function() {
            var c = contato(9303);
            expect(new ContatoLigacao().registrar(c, { resultado: 'contato_efetivo', anotacao: 'Orientado sobre o débito', retorno: '' }).ok).toBe(true);
            var g = relido(c);
            expect(g.getValue('status')).toBe('encerrado');
            expect(g.getValue('motivo_encerramento')).toBe('contato_realizado');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux002_neg = Test({
    $id: Now.ID['US-MOD-UX-002_atf_registrar_negativo'],
    name: 'RF-MOD-UX-002 — ligação sem anotação, sem resultado ou em contato encerrado não é registrada',
    description: 'Como demo.atendente: sem anotação, o sistema recusa com «Operação recusada: informe a anotação da ligação.»; sem resultado, com «Operação recusada: informe o resultado da ligação.»; em contato encerrado, com «Operação recusada: contato já encerrado.». Nos três casos o contato não muda e nenhuma interação é criada.',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_13'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-002 negativo');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'a_ligar', tentativas: 0, prioridade: 9401}, {status: 'encerrado', tentativas: 1, prioridade: 9402}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        c.setValue('valor_em_aberto', 18450);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const u_US_MOD_UX_002_test_14 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-002_test_14'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-002_test_15'], user: u_US_MOD_UX_002_test_14.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_16'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    function contato(marca) {
        var c = new GlideRecordSecure('x_2326104_cob_contato');
        c.addQuery('prioridade', marca);
        c.addQuery('contribuinte.nome', 'STARTSWITH', 'Contribuinte fictício UX-002');
        c.query();
        c.next();
        return c;
    }
    function relido(c) {
        var g = new GlideRecordSecure('x_2326104_cob_contato');
        g.get(c.getUniqueValue());
        return g;
    }
    function daqui(n) {
        var d = new GlideDateTime();
        d.addDaysLocalTime(n);
        return d.getLocalDate().getValue();
    }
    function interacoes(c) {
        var i = new GlideRecordSecure('x_2326104_cob_interacao');
        i.addQuery('contato', c.getUniqueValue());
        i.query();
        var n = 0, ultima = null;
        while (i.next()) { n++; ultima = { descricao: i.getValue('descricao'), resultado: i.getValue('resultado'), retorno: i.getValue('retorno_em'), atendente: i.getValue('atendente') }; }
        return { n: n, ultima: ultima };
    }
    describe('Registrar ligação recusada', function() {
        it('sem anotação', function() {
            var c = contato(9401);
            var r = new ContatoLigacao().registrar(c, { resultado: 'recusa', anotacao: '   ', retorno: '' });
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Operação recusada: informe a anotação da ligação.');
            var g = relido(c);
            expect(g.getValue('status')).toBe('a_ligar');
            expect(g.getValue('tentativas')).toBe('0');
            expect(interacoes(c).n).toBe(0);
        });
        it('sem resultado', function() {
            var c = contato(9401);
            var r = new ContatoLigacao().registrar(c, { resultado: '', anotacao: 'Ligação', retorno: '' });
            expect(r.mensagem).toBe('Operação recusada: informe o resultado da ligação.');
            expect(interacoes(c).n).toBe(0);
        });
        it('contato encerrado', function() {
            var c = contato(9402);
            var r = new ContatoLigacao().registrar(c, { resultado: 'sem_contato', anotacao: 'Tentativa', retorno: '' });
            expect(r.mensagem).toBe('Operação recusada: contato já encerrado.');
            expect(relido(c).getValue('tentativas')).toBe('1');
            expect(interacoes(c).n).toBe(0);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux002_um_pai = Test({
    $id: Now.ID['US-MOD-UX-002_atf_interacao_um_pai_negativo'],
    name: 'RF-MOD-UX-002 — interação pertence a um contato ou a um caso, nunca aos dois nem a nenhum',
    description: 'Interação só com contato é gravada; com contato e caso ao mesmo tempo, ou sem nenhum dos dois, o sistema recusa com «Operação recusada: a interação pertence a um contato ou a um caso.» (RN-NOVO-UX-004, positivo e negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_17'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Interação com um pai só', function() {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício UX-002 pai');
        p.setValue('tipo_pessoa', 'pf');
        p.setValue('ficticio', true);
        var pid = p.insert();
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('status', 'a_ligar');
        var contatoId = c.insert();
        var k = new GlideRecord('x_2326104_cob_caso');
        k.initialize();
        k.setValue('contribuinte', pid);
        k.setValue('estagio', 'conducao');
        var casoId = k.insert();
        function nova(contato, caso) {
            var i = new GlideRecord('x_2326104_cob_interacao');
            i.initialize();
            if (contato) { i.setValue('contato', contato); }
            if (caso) { i.setValue('caso', caso); }
            i.setValue('resultado', 'sem_contato');
            i.setValue('descricao', 'Interação fictícia UX-002');
            return i;
        }
        it('só com contato: grava', function() {
            expect(!!nova(contatoId, '').insert()).toBe(true);
        });
        it('com contato e caso: recusa com a mensagem da regra', function() {
            var i = nova(contatoId, casoId);
            expect(new ContatoLigacao().motivoRecusaInteracao(i)).toBe('Operação recusada: a interação pertence a um contato ou a um caso.');
            expect(!!i.insert()).toBe(false);
        });
        it('sem contato e sem caso: recusa', function() {
            expect(!!nova('', '').insert()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux002_ui = Test({
    $id: Now.ID['US-MOD-UX-002_atf_ui_registrar_ligacao'],
    name: 'RF-MOD-UX-002 — «Registrar ligação» aparece para o atendente no contato aberto',
    description: 'Abre no form (TEL-035) um contato «A ligar» de demo.atendente como demo.atendente: o botão «Registrar ligação» aparece (UI Action com condition e roles, lado positivo da tela).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-002_test_18'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício UX-002 tela');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var lista = [{status: 'a_ligar', tentativas: 0, prioridade: 9501}];
    for (var k = 0; k < lista.length; k++) {
        var c = new GlideRecord('x_2326104_cob_contato');
        c.initialize();
        c.setValue('contribuinte', pid);
        c.setValue('atendente', u.getUniqueValue());
        c.setValue('status', lista[k].status);
        c.setValue('tentativas', lista[k].tentativas);
        c.setValue('prioridade', lista[k].prioridade);
        c.setValue('valor_em_aberto', 18450);
        c.insert();
    }
    return !!pid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const aberto = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-002_test_19'], table: 'x_2326104_cob_contato', fieldValues: 'prioridade=9501', assert: 'records_match_query' })
    const u_US_MOD_UX_002_test_20 = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-002_test_20'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-002_test_21'], user: u_US_MOD_UX_002_test_20.first_record })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-UX-002_test_22'], table: 'x_2326104_cob_contato', recordId: aberto.first_record })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-UX-002_test_23'], table: 'x_2326104_cob_contato', visible: [Now.ref('sys_ui_action', 'RF-MOD-UX-002_ua_registrar_ligacao')] })
})
