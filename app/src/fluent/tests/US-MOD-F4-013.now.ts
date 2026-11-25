// ATF da US-MOD-F4-013 — régua de Parcelamentos (em risco inscreve; em dia, quitado e rompido encerram) e segurança
// da inscrição (atendente só a própria carteira; coordenador todas; nenhuma persona grava) (design
// ux-cobranca-v2-regua-flow.md, B4, B5, B9, D16; RN-NOVO-F4-014, RN-NOVO-F5-007). Massa fictícia criada pelo próprio
// teste e desfeita pelo rollback. A régua real de Parcelamentos é desligada por setWorkflow(false) dentro do teste
// (o rollback religa), para a inscrição cair na régua atf_* e não disparar o Flow real.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'


export const t_f4013_em_risco = Test({
    $id: Now.ID['US-MOD-F4-013_atf_em_risco'],
    name: 'RF-MOD-F4-013 — parcelamento em risco inscreve na régua Parcelamentos com o último ciclo publicado; quitado, rompido e em dia encerram',
    description: 'Régua atf_parc (Parcelamentos) e ciclo fictício publicado por último: o parcelamento de D que vira «Em risco» cria a inscrição com o parcelamento e esse ciclo; ao virar «Quitado» ela encerra como regularizado. E: em risco → rompido encerra como parcelamento_rompido. F: em risco → em dia encerra como regularizado. G: em risco de novo com inscrição ativa não duplica (D16, P3, RN-NOVO-F4-014; AS-TASK-MOD-F4-013-01-01..03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-013_test_01'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(login) {
        var u = new GlideRecord('sys_user');
        return u.get('user_name', login) ? u.getUniqueValue() : '';
    }
    function regua(codigo, carteira, ativa) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', carteira || 'ipva');
        r.setValue('ativa', ativa === undefined ? true : ativa);
        r.setValue('prazo_final_dias', 5);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function desligarReais(carteiras) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.addQuery('carteira', 'IN', carteiras.join(','));
        r.addQuery('ativa', true);
        r.addQuery('codigo', 'NOT LIKE', 'atf_%');
        r.query();
        while (r.next()) {
            r.setWorkflow(false);
            r.setValue('ativa', false);
            r.update();
        }
    }
    function contribuinte(nome, atendente) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        if (atendente) { p.setValue('atendente', atendente); }
        return p.insert();
    }
    function debito(contribuinteId, tributo, status, valor) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', valor || 1250);
        return d.insert();
    }
    function ciclo(nome, estado, criterio) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setValue('nome', nome);
        c.setValue('estado', estado);
        if (criterio) { c.setValue('criterio', criterio); }
        return c.insert();
    }
    function segmentar(cicloId, contribuinteId, segmento) {
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', cicloId);
        s.setValue('contribuinte', contribuinteId);
        if (segmento) { s.setValue('segmento', segmento); }
        return s.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId, parcelamentoId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setWorkflow(false);
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        i.setValue('status', 'ativa');
        i.setValue('etapa_atual', 0);
        i.setValue('iniciada_em', new GlideDateTime().getValue());
        if (cicloId) { i.setValue('ciclo', cicloId); }
        if (parcelamentoId) { i.setValue('parcelamento', parcelamentoId); }
        return i.insert();
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    function mudar(tabela, id, campo, valor) {
        var g = new GlideRecord(tabela);
        g.get(id);
        g.setValue(campo, valor);
        g.update();
    }
    function ler(tabela, id) {
        var g = new GlideRecord(tabela);
        g.get(id);
        return g;
    }
    function inscricoes(query) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.addEncodedQuery(query);
        g.orderBy('sys_created_on');
        g.query();
        var lista = [];
        while (g.next()) { lista.push({ id: g.getUniqueValue(), status: g.getValue('status'), motivo: g.getValue('motivo_encerramento'), ciclo: g.getValue('ciclo') || '', parcelamento: g.getValue('parcelamento') || '', regua: g.getValue('regua'), contato: g.getValue('contato') || '' }); }
        return lista;
    }
    function contar(tabela, query) {
        var a = new GlideAggregate(tabela);
        a.addEncodedQuery(query);
        a.addAggregate('COUNT');
        a.query();
        return a.next() ? parseInt(a.getAggregate('COUNT'), 10) : 0;
    }
    function criterio(codigo, valorMinimo) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'Critério ATF ' + codigo + ' (fictício)');
        c.setValue('codigo', codigo);
        c.setValue('versao', 1);
        c.setValue('estado', 'publicada');
        c.setValue('pct_grupo_controle', 10);
        c.setValue('tributo', 'todos');
        c.setValue('valor_minimo', valorMinimo || 0);
        c.setValue('atraso_minimo_dias', 0);
        c.setValue('usar_score', false);
        return c.insert();
    }

    describe('Régua Parcelamentos', function() {
        desligarReais(['parcelamentos']);
        var r = regua('atf_parc', 'parcelamentos');
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'ATF ciclo F4-013 último publicado (fictício)');
        c.setValue('estado', 'publicado');
        c.setValue('publicado_em', '2099-12-31 00:00:00');
        var ci = c.insert();
        var d = contribuinte('F4-013 D');
        var pD = parcelamento(d, 'em_dia');
        mudar('x_2326104_cob_parcelamento', pD, 'status', 'em_risco');
        var criada = inscricoes('contribuinte=' + d);
        mudar('x_2326104_cob_parcelamento', pD, 'status', 'quitado');
        var e = contribuinte('F4-013 E');
        var pE = parcelamento(e, 'em_dia');
        mudar('x_2326104_cob_parcelamento', pE, 'status', 'em_risco');
        mudar('x_2326104_cob_parcelamento', pE, 'status', 'rompido');
        var f = contribuinte('F4-013 F');
        var pF = parcelamento(f, 'em_dia');
        mudar('x_2326104_cob_parcelamento', pF, 'status', 'em_risco');
        mudar('x_2326104_cob_parcelamento', pF, 'status', 'em_dia');
        var g = contribuinte('F4-013 G');
        var pG = parcelamento(g, 'em_dia');
        mudar('x_2326104_cob_parcelamento', pG, 'status', 'em_risco');
        var gr = ler('x_2326104_cob_parcelamento', pG);
        gr.setWorkflow(false);
        gr.setValue('status', 'em_dia');
        gr.update();
        mudar('x_2326104_cob_parcelamento', pG, 'status', 'em_risco');
        it('em risco cria a inscrição com o parcelamento e o último ciclo publicado', function() {
            expect(criada.length).toBe(1);
            expect(criada[0].regua).toBe(r);
            expect(criada[0].parcelamento).toBe(pD);
            expect(criada[0].ciclo).toBe(ci);
            expect(criada[0].status).toBe('ativa');
        });
        it('quitado encerra como regularizado', function() {
            var l = inscricoes('contribuinte=' + d);
            expect(l[0].status).toBe('encerrada');
            expect(l[0].motivo).toBe('regularizado');
        });
        it('rompido encerra como parcelamento_rompido', function() {
            var l = inscricoes('contribuinte=' + e);
            expect(l.length).toBe(1);
            expect(l[0].motivo).toBe('parcelamento_rompido');
        });
        it('em dia de novo encerra como regularizado', function() {
            var l = inscricoes('contribuinte=' + f);
            expect(l[0].motivo).toBe('regularizado');
        });
        it('em risco com inscrição ativa não duplica', function() {
            expect(contar('x_2326104_cob_regua_inscricao', 'contribuinte=' + g)).toBe(1);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4013_sem_ciclo = Test({
    $id: Now.ID['US-MOD-F4-013_atf_sem_ciclo'],
    name: 'RF-MOD-F4-013 — sem ciclo publicado a inscrição nasce sem ciclo; inscrição de Parcelamentos sem parcelamento é recusada',
    description: 'Com todos os ciclos publicados tirados de «Publicado» dentro do teste: o parcelamento em risco cria a inscrição com ciclo vazio e a guarda segue (a de controle não se aplica). Inscrição na régua de Parcelamentos sem o parcelamento é recusada na gravação (AS-TASK-MOD-F4-013-01-04; GAP-159).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-013_test_02'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(login) {
        var u = new GlideRecord('sys_user');
        return u.get('user_name', login) ? u.getUniqueValue() : '';
    }
    function regua(codigo, carteira, ativa) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', carteira || 'ipva');
        r.setValue('ativa', ativa === undefined ? true : ativa);
        r.setValue('prazo_final_dias', 5);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function desligarReais(carteiras) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.addQuery('carteira', 'IN', carteiras.join(','));
        r.addQuery('ativa', true);
        r.addQuery('codigo', 'NOT LIKE', 'atf_%');
        r.query();
        while (r.next()) {
            r.setWorkflow(false);
            r.setValue('ativa', false);
            r.update();
        }
    }
    function contribuinte(nome, atendente) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        if (atendente) { p.setValue('atendente', atendente); }
        return p.insert();
    }
    function debito(contribuinteId, tributo, status, valor) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', valor || 1250);
        return d.insert();
    }
    function ciclo(nome, estado, criterio) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setValue('nome', nome);
        c.setValue('estado', estado);
        if (criterio) { c.setValue('criterio', criterio); }
        return c.insert();
    }
    function segmentar(cicloId, contribuinteId, segmento) {
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', cicloId);
        s.setValue('contribuinte', contribuinteId);
        if (segmento) { s.setValue('segmento', segmento); }
        return s.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId, parcelamentoId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setWorkflow(false);
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        i.setValue('status', 'ativa');
        i.setValue('etapa_atual', 0);
        i.setValue('iniciada_em', new GlideDateTime().getValue());
        if (cicloId) { i.setValue('ciclo', cicloId); }
        if (parcelamentoId) { i.setValue('parcelamento', parcelamentoId); }
        return i.insert();
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    function mudar(tabela, id, campo, valor) {
        var g = new GlideRecord(tabela);
        g.get(id);
        g.setValue(campo, valor);
        g.update();
    }
    function ler(tabela, id) {
        var g = new GlideRecord(tabela);
        g.get(id);
        return g;
    }
    function inscricoes(query) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.addEncodedQuery(query);
        g.orderBy('sys_created_on');
        g.query();
        var lista = [];
        while (g.next()) { lista.push({ id: g.getUniqueValue(), status: g.getValue('status'), motivo: g.getValue('motivo_encerramento'), ciclo: g.getValue('ciclo') || '', parcelamento: g.getValue('parcelamento') || '', regua: g.getValue('regua'), contato: g.getValue('contato') || '' }); }
        return lista;
    }
    function contar(tabela, query) {
        var a = new GlideAggregate(tabela);
        a.addEncodedQuery(query);
        a.addAggregate('COUNT');
        a.query();
        return a.next() ? parseInt(a.getAggregate('COUNT'), 10) : 0;
    }
    function criterio(codigo, valorMinimo) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'Critério ATF ' + codigo + ' (fictício)');
        c.setValue('codigo', codigo);
        c.setValue('versao', 1);
        c.setValue('estado', 'publicada');
        c.setValue('pct_grupo_controle', 10);
        c.setValue('tributo', 'todos');
        c.setValue('valor_minimo', valorMinimo || 0);
        c.setValue('atraso_minimo_dias', 0);
        c.setValue('usar_score', false);
        return c.insert();
    }

    describe('Parcelamentos sem ciclo publicado', function() {
        desligarReais(['parcelamentos']);
        var pub = new GlideRecord('x_2326104_cob_ciclo');
        pub.addQuery('estado', 'publicado');
        pub.query();
        while (pub.next()) {
            pub.setWorkflow(false);
            pub.setValue('estado', 'encerrado');
            pub.update();
        }
        var r = regua('atf_parc_sem_ciclo', 'parcelamentos');
        var d = contribuinte('F4-013 sem ciclo');
        var p = parcelamento(d, 'em_dia');
        mudar('x_2326104_cob_parcelamento', p, 'status', 'em_risco');
        var l = inscricoes('contribuinte=' + d);
        var guarda = l.length ? new ReguaMotor().checarGuardas(l[0].id) : null;
        var x = contribuinte('F4-013 sem parcelamento');
        var n = new GlideRecord('x_2326104_cob_regua_inscricao');
        n.initialize();
        n.setValue('contribuinte', x);
        n.setValue('regua', r);
        var recusada = n.insert();
        it('inscrição nasce com ciclo vazio e a guarda segue', function() {
            expect(l.length).toBe(1);
            expect(l[0].ciclo).toBe('');
            expect(guarda.segue).toBe(true);
        });
        it('inscrição de Parcelamentos sem parcelamento é recusada', function() {
            expect(recusada).toBeFalsy();
            expect(contar('x_2326104_cob_regua_inscricao', 'contribuinte=' + x)).toBe(0);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4013_acl_atendente = Test({
    $id: Now.ID['US-MOD-F4-013_atf_acl_atendente'],
    name: 'RF-MOD-F4-013 — atendente lê só a inscrição da própria carteira e não grava inscrição',
    description: 'Régua atf_acl_inscricao com uma inscrição de contribuinte de demo.atendente e outra de demo.atendente2. Impersonado como demo.atendente: a consulta (business rule de consulta) traz e conta só a dele; com a business rule desligada, a ACL de linha também esconde a outra; inserir inscrição por GlideRecordSecure é negado (B5, SEC-001; AS-TASK-MOD-F4-013-02-01..02).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-013_test_03'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(login) {
        var u = new GlideRecord('sys_user');
        return u.get('user_name', login) ? u.getUniqueValue() : '';
    }
    function regua(codigo, carteira, ativa) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', carteira || 'ipva');
        r.setValue('ativa', ativa === undefined ? true : ativa);
        r.setValue('prazo_final_dias', 5);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function desligarReais(carteiras) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.addQuery('carteira', 'IN', carteiras.join(','));
        r.addQuery('ativa', true);
        r.addQuery('codigo', 'NOT LIKE', 'atf_%');
        r.query();
        while (r.next()) {
            r.setWorkflow(false);
            r.setValue('ativa', false);
            r.update();
        }
    }
    function contribuinte(nome, atendente) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        if (atendente) { p.setValue('atendente', atendente); }
        return p.insert();
    }
    function debito(contribuinteId, tributo, status, valor) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', valor || 1250);
        return d.insert();
    }
    function ciclo(nome, estado, criterio) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setValue('nome', nome);
        c.setValue('estado', estado);
        if (criterio) { c.setValue('criterio', criterio); }
        return c.insert();
    }
    function segmentar(cicloId, contribuinteId, segmento) {
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', cicloId);
        s.setValue('contribuinte', contribuinteId);
        if (segmento) { s.setValue('segmento', segmento); }
        return s.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId, parcelamentoId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setWorkflow(false);
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        i.setValue('status', 'ativa');
        i.setValue('etapa_atual', 0);
        i.setValue('iniciada_em', new GlideDateTime().getValue());
        if (cicloId) { i.setValue('ciclo', cicloId); }
        if (parcelamentoId) { i.setValue('parcelamento', parcelamentoId); }
        return i.insert();
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    function mudar(tabela, id, campo, valor) {
        var g = new GlideRecord(tabela);
        g.get(id);
        g.setValue(campo, valor);
        g.update();
    }
    function ler(tabela, id) {
        var g = new GlideRecord(tabela);
        g.get(id);
        return g;
    }
    function inscricoes(query) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.addEncodedQuery(query);
        g.orderBy('sys_created_on');
        g.query();
        var lista = [];
        while (g.next()) { lista.push({ id: g.getUniqueValue(), status: g.getValue('status'), motivo: g.getValue('motivo_encerramento'), ciclo: g.getValue('ciclo') || '', parcelamento: g.getValue('parcelamento') || '', regua: g.getValue('regua'), contato: g.getValue('contato') || '' }); }
        return lista;
    }
    function contar(tabela, query) {
        var a = new GlideAggregate(tabela);
        a.addEncodedQuery(query);
        a.addAggregate('COUNT');
        a.query();
        return a.next() ? parseInt(a.getAggregate('COUNT'), 10) : 0;
    }
    function criterio(codigo, valorMinimo) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'Critério ATF ' + codigo + ' (fictício)');
        c.setValue('codigo', codigo);
        c.setValue('versao', 1);
        c.setValue('estado', 'publicada');
        c.setValue('pct_grupo_controle', 10);
        c.setValue('tributo', 'todos');
        c.setValue('valor_minimo', valorMinimo || 0);
        c.setValue('atraso_minimo_dias', 0);
        c.setValue('usar_score', false);
        return c.insert();
    }

    var r = regua('atf_acl_inscricao', 'ipva');
    var x = contribuinte('F4-013 carteira X', usuario('demo.atendente'));
    var y = contribuinte('F4-013 carteira Y', usuario('demo.atendente2'));
    inscricao(x, r, '', '');
    inscricao(y, r, '', '');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const atend = atf.server.recordQuery({ $id: Now.ID['US-MOD-F4-013_test_04'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F4-013_test_05'], user: atend.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-013_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(login) {
        var u = new GlideRecord('sys_user');
        return u.get('user_name', login) ? u.getUniqueValue() : '';
    }
    function regua(codigo, carteira, ativa) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', carteira || 'ipva');
        r.setValue('ativa', ativa === undefined ? true : ativa);
        r.setValue('prazo_final_dias', 5);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function desligarReais(carteiras) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.addQuery('carteira', 'IN', carteiras.join(','));
        r.addQuery('ativa', true);
        r.addQuery('codigo', 'NOT LIKE', 'atf_%');
        r.query();
        while (r.next()) {
            r.setWorkflow(false);
            r.setValue('ativa', false);
            r.update();
        }
    }
    function contribuinte(nome, atendente) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        if (atendente) { p.setValue('atendente', atendente); }
        return p.insert();
    }
    function debito(contribuinteId, tributo, status, valor) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', valor || 1250);
        return d.insert();
    }
    function ciclo(nome, estado, criterio) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setValue('nome', nome);
        c.setValue('estado', estado);
        if (criterio) { c.setValue('criterio', criterio); }
        return c.insert();
    }
    function segmentar(cicloId, contribuinteId, segmento) {
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', cicloId);
        s.setValue('contribuinte', contribuinteId);
        if (segmento) { s.setValue('segmento', segmento); }
        return s.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId, parcelamentoId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setWorkflow(false);
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        i.setValue('status', 'ativa');
        i.setValue('etapa_atual', 0);
        i.setValue('iniciada_em', new GlideDateTime().getValue());
        if (cicloId) { i.setValue('ciclo', cicloId); }
        if (parcelamentoId) { i.setValue('parcelamento', parcelamentoId); }
        return i.insert();
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    function mudar(tabela, id, campo, valor) {
        var g = new GlideRecord(tabela);
        g.get(id);
        g.setValue(campo, valor);
        g.update();
    }
    function ler(tabela, id) {
        var g = new GlideRecord(tabela);
        g.get(id);
        return g;
    }
    function inscricoes(query) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.addEncodedQuery(query);
        g.orderBy('sys_created_on');
        g.query();
        var lista = [];
        while (g.next()) { lista.push({ id: g.getUniqueValue(), status: g.getValue('status'), motivo: g.getValue('motivo_encerramento'), ciclo: g.getValue('ciclo') || '', parcelamento: g.getValue('parcelamento') || '', regua: g.getValue('regua'), contato: g.getValue('contato') || '' }); }
        return lista;
    }
    function contar(tabela, query) {
        var a = new GlideAggregate(tabela);
        a.addEncodedQuery(query);
        a.addAggregate('COUNT');
        a.query();
        return a.next() ? parseInt(a.getAggregate('COUNT'), 10) : 0;
    }
    function criterio(codigo, valorMinimo) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'Critério ATF ' + codigo + ' (fictício)');
        c.setValue('codigo', codigo);
        c.setValue('versao', 1);
        c.setValue('estado', 'publicada');
        c.setValue('pct_grupo_controle', 10);
        c.setValue('tributo', 'todos');
        c.setValue('valor_minimo', valorMinimo || 0);
        c.setValue('atraso_minimo_dias', 0);
        c.setValue('usar_score', false);
        return c.insert();
    }

    describe('ACL de inscrição — atendente', function() {
        var q = new GlideRecordSecure('x_2326104_cob_regua_inscricao');
        q.addQuery('regua.codigo', 'atf_acl_inscricao');
        q.query();
        var nomes = [];
        while (q.next()) { nomes.push(String(q.contribuinte.nome)); }
        var conta = contar('x_2326104_cob_regua_inscricao', 'regua.codigo=atf_acl_inscricao');
        var semBr = new GlideRecordSecure('x_2326104_cob_regua_inscricao');
        semBr.setWorkflow(false);
        semBr.addQuery('regua.codigo', 'atf_acl_inscricao');
        semBr.query();
        var lidosSemBr = 0;
        while (semBr.next()) { lidosSemBr++; }
        var reg = new GlideRecord('x_2326104_cob_regua');
        reg.get('codigo', 'atf_acl_inscricao');
        var meu = new GlideRecord('x_2326104_cob_contribuinte');
        meu.get('nome', 'Contribuinte fictício F4-013 carteira X');
        var n = new GlideRecordSecure('x_2326104_cob_regua_inscricao');
        n.initialize();
        n.setValue('contribuinte', meu.getUniqueValue());
        n.setValue('regua', reg.getUniqueValue());
        var inserida = n.insert();
        it('lê só a inscrição da própria carteira', function() {
            expect(nomes.length).toBe(1);
            expect(nomes[0]).toBe('Contribuinte fictício F4-013 carteira X');
        });
        it('a contagem não revela a outra carteira', function() {
            expect(conta).toBe(1);
        });
        it('sem a business rule de consulta, a ACL de linha esconde a outra carteira', function() {
            expect(lidosSemBr).toBe(1);
        });
        it('inserir inscrição é negado', function() {
            expect(inserida).toBeFalsy();
            expect(contar('x_2326104_cob_regua_inscricao', 'regua.codigo=atf_acl_inscricao')).toBe(1);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4013_acl_coordenador = Test({
    $id: Now.ID['US-MOD-F4-013_atf_acl_coordenador'],
    name: 'RF-MOD-F4-013 — coordenador lê as inscrições de todas as carteiras e não cria nem altera inscrição',
    description: 'Mesma massa (carteiras de demo.atendente e demo.atendente2). Coordenador criado pelo teste lê as 2 inscrições por GlideRecordSecure; não pode gravar (canWrite falso, status continua ativa depois do update) e inserir é negado (B5; AS-TASK-MOD-F4-013-02-03..04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-013_test_07'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(login) {
        var u = new GlideRecord('sys_user');
        return u.get('user_name', login) ? u.getUniqueValue() : '';
    }
    function regua(codigo, carteira, ativa) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', carteira || 'ipva');
        r.setValue('ativa', ativa === undefined ? true : ativa);
        r.setValue('prazo_final_dias', 5);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function desligarReais(carteiras) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.addQuery('carteira', 'IN', carteiras.join(','));
        r.addQuery('ativa', true);
        r.addQuery('codigo', 'NOT LIKE', 'atf_%');
        r.query();
        while (r.next()) {
            r.setWorkflow(false);
            r.setValue('ativa', false);
            r.update();
        }
    }
    function contribuinte(nome, atendente) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        if (atendente) { p.setValue('atendente', atendente); }
        return p.insert();
    }
    function debito(contribuinteId, tributo, status, valor) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', valor || 1250);
        return d.insert();
    }
    function ciclo(nome, estado, criterio) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setValue('nome', nome);
        c.setValue('estado', estado);
        if (criterio) { c.setValue('criterio', criterio); }
        return c.insert();
    }
    function segmentar(cicloId, contribuinteId, segmento) {
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', cicloId);
        s.setValue('contribuinte', contribuinteId);
        if (segmento) { s.setValue('segmento', segmento); }
        return s.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId, parcelamentoId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setWorkflow(false);
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        i.setValue('status', 'ativa');
        i.setValue('etapa_atual', 0);
        i.setValue('iniciada_em', new GlideDateTime().getValue());
        if (cicloId) { i.setValue('ciclo', cicloId); }
        if (parcelamentoId) { i.setValue('parcelamento', parcelamentoId); }
        return i.insert();
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    function mudar(tabela, id, campo, valor) {
        var g = new GlideRecord(tabela);
        g.get(id);
        g.setValue(campo, valor);
        g.update();
    }
    function ler(tabela, id) {
        var g = new GlideRecord(tabela);
        g.get(id);
        return g;
    }
    function inscricoes(query) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.addEncodedQuery(query);
        g.orderBy('sys_created_on');
        g.query();
        var lista = [];
        while (g.next()) { lista.push({ id: g.getUniqueValue(), status: g.getValue('status'), motivo: g.getValue('motivo_encerramento'), ciclo: g.getValue('ciclo') || '', parcelamento: g.getValue('parcelamento') || '', regua: g.getValue('regua'), contato: g.getValue('contato') || '' }); }
        return lista;
    }
    function contar(tabela, query) {
        var a = new GlideAggregate(tabela);
        a.addEncodedQuery(query);
        a.addAggregate('COUNT');
        a.query();
        return a.next() ? parseInt(a.getAggregate('COUNT'), 10) : 0;
    }
    function criterio(codigo, valorMinimo) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'Critério ATF ' + codigo + ' (fictício)');
        c.setValue('codigo', codigo);
        c.setValue('versao', 1);
        c.setValue('estado', 'publicada');
        c.setValue('pct_grupo_controle', 10);
        c.setValue('tributo', 'todos');
        c.setValue('valor_minimo', valorMinimo || 0);
        c.setValue('atraso_minimo_dias', 0);
        c.setValue('usar_score', false);
        return c.insert();
    }

    var r = regua('atf_acl_inscricao', 'ipva');
    var x = contribuinte('F4-013 carteira X', usuario('demo.atendente'));
    var y = contribuinte('F4-013 carteira Y', usuario('demo.atendente2'));
    inscricao(x, r, '', '');
    inscricao(y, r, '', '');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-013_test_08'], firstName: 'ATF', lastName: 'Coordenador F4-013 ACL', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-013_test_09'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function usuario(login) {
        var u = new GlideRecord('sys_user');
        return u.get('user_name', login) ? u.getUniqueValue() : '';
    }
    function regua(codigo, carteira, ativa) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', carteira || 'ipva');
        r.setValue('ativa', ativa === undefined ? true : ativa);
        r.setValue('prazo_final_dias', 5);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function desligarReais(carteiras) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.addQuery('carteira', 'IN', carteiras.join(','));
        r.addQuery('ativa', true);
        r.addQuery('codigo', 'NOT LIKE', 'atf_%');
        r.query();
        while (r.next()) {
            r.setWorkflow(false);
            r.setValue('ativa', false);
            r.update();
        }
    }
    function contribuinte(nome, atendente) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        if (atendente) { p.setValue('atendente', atendente); }
        return p.insert();
    }
    function debito(contribuinteId, tributo, status, valor) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', valor || 1250);
        return d.insert();
    }
    function ciclo(nome, estado, criterio) {
        var c = new GlideRecord('x_2326104_cob_ciclo');
        c.initialize();
        c.setValue('nome', nome);
        c.setValue('estado', estado);
        if (criterio) { c.setValue('criterio', criterio); }
        return c.insert();
    }
    function segmentar(cicloId, contribuinteId, segmento) {
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', cicloId);
        s.setValue('contribuinte', contribuinteId);
        if (segmento) { s.setValue('segmento', segmento); }
        return s.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId, parcelamentoId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setWorkflow(false);
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        i.setValue('status', 'ativa');
        i.setValue('etapa_atual', 0);
        i.setValue('iniciada_em', new GlideDateTime().getValue());
        if (cicloId) { i.setValue('ciclo', cicloId); }
        if (parcelamentoId) { i.setValue('parcelamento', parcelamentoId); }
        return i.insert();
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    function mudar(tabela, id, campo, valor) {
        var g = new GlideRecord(tabela);
        g.get(id);
        g.setValue(campo, valor);
        g.update();
    }
    function ler(tabela, id) {
        var g = new GlideRecord(tabela);
        g.get(id);
        return g;
    }
    function inscricoes(query) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.addEncodedQuery(query);
        g.orderBy('sys_created_on');
        g.query();
        var lista = [];
        while (g.next()) { lista.push({ id: g.getUniqueValue(), status: g.getValue('status'), motivo: g.getValue('motivo_encerramento'), ciclo: g.getValue('ciclo') || '', parcelamento: g.getValue('parcelamento') || '', regua: g.getValue('regua'), contato: g.getValue('contato') || '' }); }
        return lista;
    }
    function contar(tabela, query) {
        var a = new GlideAggregate(tabela);
        a.addEncodedQuery(query);
        a.addAggregate('COUNT');
        a.query();
        return a.next() ? parseInt(a.getAggregate('COUNT'), 10) : 0;
    }
    function criterio(codigo, valorMinimo) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'Critério ATF ' + codigo + ' (fictício)');
        c.setValue('codigo', codigo);
        c.setValue('versao', 1);
        c.setValue('estado', 'publicada');
        c.setValue('pct_grupo_controle', 10);
        c.setValue('tributo', 'todos');
        c.setValue('valor_minimo', valorMinimo || 0);
        c.setValue('atraso_minimo_dias', 0);
        c.setValue('usar_score', false);
        return c.insert();
    }

    describe('ACL de inscrição — coordenador', function() {
        var q = new GlideRecordSecure('x_2326104_cob_regua_inscricao');
        q.addQuery('regua.codigo', 'atf_acl_inscricao');
        q.query();
        var lidos = 0;
        var podeGravar = true;
        var umId = '';
        while (q.next()) {
            lidos++;
            podeGravar = podeGravar && q.canWrite();
            umId = q.getUniqueValue();
        }
        var w = new GlideRecordSecure('x_2326104_cob_regua_inscricao');
        w.get(umId);
        w.setValue('status', 'encerrada');
        w.update();
        var reg = new GlideRecord('x_2326104_cob_regua');
        reg.get('codigo', 'atf_acl_inscricao');
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.get('nome', 'Contribuinte fictício F4-013 carteira X');
        var n = new GlideRecordSecure('x_2326104_cob_regua_inscricao');
        n.initialize();
        n.setValue('contribuinte', p.getUniqueValue());
        n.setValue('regua', reg.getUniqueValue());
        var inserida = n.insert();
        it('lê as 2 inscrições', function() {
            expect(lidos).toBe(2);
        });
        it('não grava inscrição', function() {
            expect(podeGravar).toBe(false);
            expect(ler('x_2326104_cob_regua_inscricao', umId).getValue('status')).toBe('ativa');
        });
        it('inserir inscrição é negado', function() {
            expect(inserida).toBeFalsy();
            expect(contar('x_2326104_cob_regua_inscricao', 'regua.codigo=atf_acl_inscricao')).toBe(2);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
