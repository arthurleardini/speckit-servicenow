// ATF da US-MOD-F4-012 — inscrição na publicação do ciclo, reavaliação (regularizou, parou), escalonamento à cobrança
// ativa e à qualificada, pausa e ativação da régua, módulo «Inscrições» (design ux-cobranca-v2-regua-flow.md, B3, B4,
// B9, D7, D13, D14; RN-NOVO-F4-002, F4-008, F4-009). Massa fictícia criada pelo próprio teste e desfeita pelo rollback.
// Régua de teste com codigo = atf_<caso>: nenhum gatilho de Flow casa. Onde o teste inscreve por carteira, as réguas
// reais da carteira são desligadas por setWorkflow(false) dentro do teste (o rollback religa), para a inscrição cair
// na régua de teste e não disparar o Flow real. A massa se repete em cada script (macro expandida antes do build).
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador, role_atendente } from '../security/roles.now'


export const t_f4012_inscrever = Test({
    $id: Now.ID['US-MOD-F4-012_atf_inscrever'],
    name: 'RF-MOD-F4-012 — inscrever: só a massificada com débito em aberto, na régua do maior débito, sem duplicar',
    description: 'Ciclo fictício publicado por insert (a BR não roda): A (massificada, IPVA 1.250 + ITCD 500 em aberto) entra na régua atf_inscrever (IPVA); T (massificada, ITCD 3.000 + IPVA 100) entra na régua atf_inscrever_itcd; C (controle), Q (qualificada) e S (massificada sem débito em aberto) não entram; a segunda chamada não cria nada (D7, RN-NOVO-F4-002; AS-TASK-MOD-F4-012-01-01).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_01'],
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

    describe('ReguaMotor.inscrever', function() {
        desligarReais(['ipva', 'itcd']);
        var rI = regua('atf_inscrever', 'ipva');
        var rT = regua('atf_inscrever_itcd', 'itcd');
        var ci = ciclo('ATF ciclo F4-012 inscrever (fictício)', 'publicado');
        var a = contribuinte('F4-012 A');
        debito(a, 'ipva', 'aberto', 1250);
        debito(a, 'itcd', 'aberto', 500);
        segmentar(ci, a, 'massificada');
        var t = contribuinte('F4-012 T');
        debito(t, 'itcd', 'aberto', 3000);
        debito(t, 'ipva', 'aberto', 100);
        segmentar(ci, t, 'massificada');
        var c = contribuinte('F4-012 C controle');
        debito(c, 'ipva', 'aberto', 1250);
        segmentar(ci, c, 'controle');
        var q = contribuinte('F4-012 Q qualificada');
        debito(q, 'ipva', 'aberto', 1250);
        segmentar(ci, q, 'qualificada');
        var s = contribuinte('F4-012 S sem débito');
        debito(s, 'ipva', 'regularizado', 1250);
        segmentar(ci, s, 'massificada');
        var motor = new ReguaMotor();
        var n1 = motor.inscrever(ci);
        var n2 = motor.inscrever(ci);
        it('2 inscrições na primeira chamada, nenhuma na segunda', function() {
            expect(n1).toBe(2);
            expect(n2).toBe(0);
        });
        it('A na régua do IPVA (maior débito), ativa, etapa 0, com o ciclo', function() {
            var l = inscricoes('contribuinte=' + a);
            expect(l.length).toBe(1);
            expect(l[0].regua).toBe(rI);
            expect(l[0].status).toBe('ativa');
            expect(l[0].ciclo).toBe(ci);
        });
        it('T na régua do ITCD (maior débito)', function() {
            var l = inscricoes('contribuinte=' + t);
            expect(l.length).toBe(1);
            expect(l[0].regua).toBe(rT);
        });
        it('controle, qualificada e massificada sem débito em aberto ficam de fora', function() {
            expect(contar('x_2326104_cob_regua_inscricao', 'contribuinteIN' + [c, q, s].join(','))).toBe(0);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4012_br_publicar = Test({
    $id: Now.ID['US-MOD-F4-012_atf_br_publicar'],
    name: 'RF-MOD-F4-012 — publicar o ciclo por GlideRecord (sem botão) inscreve a massificada; gravar a prévia não inscreve',
    description: 'Coordenador criado pelo teste grava estado = publicado num ciclo fictício em prévia (10 massificada com IPVA em aberto, régua atf_br): a BR after update inscreve os 9 fora do controle sorteado e nenhum do controle. Outro ciclo em prévia só renomeado não ganha inscrição (D7, 🔴5; AS-TASK-MOD-F4-012-01-02).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_02'],
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

    desligarReais(['ipva']);
    regua('atf_br', 'ipva');
    var crit = criterio('ATF-F4012-BR', 0);
    var ci = ciclo('ATF ciclo F4-012 BR publicar (fictício)', 'previa', crit);
    for (var k = 1; k <= 10; k++) {
        var p = contribuinte('F4-012 BR ' + k);
        debito(p, 'ipva', 'aberto', 1000 + k);
        segmentar(ci, p, 'massificada');
    }
    var ci2 = ciclo('ATF ciclo F4-012 BR prévia (fictício)', 'previa', crit);
    var z = contribuinte('F4-012 BR prévia');
    debito(z, 'ipva', 'aberto', 1000);
    segmentar(ci2, z, 'massificada');
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-012_test_03'], firstName: 'ATF', lastName: 'Coordenador F4-012 BR', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_04'],
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

    describe('BR after update do ciclo', function() {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.get('nome', 'ATF ciclo F4-012 BR publicar (fictício)');
        ci.setValue('estado', 'publicado');
        ci.update();
        var ci2 = new GlideRecord('x_2326104_cob_ciclo');
        ci2.get('nome', 'ATF ciclo F4-012 BR prévia (fictício)');
        ci2.setValue('nome', 'ATF ciclo F4-012 BR prévia renomeado (fictício)');
        ci2.update();
        var id = ci.getUniqueValue();
        it('ciclo publicado com 1 no controle', function() {
            var lido = ler('x_2326104_cob_ciclo', id);
            expect(lido.getValue('estado')).toBe('publicado');
            expect(lido.getValue('qtd_controle')).toBe('1');
        });
        it('9 inscrições na régua atf_br, todas da massificada', function() {
            expect(contar('x_2326104_cob_regua_inscricao', 'ciclo=' + id + '^regua.codigo=atf_br^status=ativa')).toBe(9);
        });
        it('nenhuma inscrição para o contribuinte sorteado para o controle', function() {
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.addQuery('ciclo', id);
            s.addQuery('segmento', 'controle');
            s.query();
            s.next();
            expect(contar('x_2326104_cob_regua_inscricao', 'contribuinte=' + s.getValue('contribuinte'))).toBe(0);
        });
        it('ciclo que continua em prévia não inscreve', function() {
            expect(contar('x_2326104_cob_regua_inscricao', 'ciclo=' + ci2.getUniqueValue())).toBe(0);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4012_reavaliar = Test({
    $id: Now.ID['US-MOD-F4-012_atf_reavaliar'],
    name: 'RF-MOD-F4-012 — regularizou, a inscrição encerra na hora; débito de outro tributo não encerra',
    description: 'Inscrição IPVA ativa de A com comunicação agendada: o débito de ITCD regularizado não mexe nela; o débito de IPVA regularizado encerra a inscrição como regularizado e a comunicação agendada vira encerrada. Inscrição de B encerra quando entra uma regularização (RN-NOVO-F4-009, RN-NOVO-F1-002, G8; AS-TASK-MOD-F4-012-01-03..04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_05'],
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

    describe('ReguaMotor.reavaliar pelas business rules', function() {
        var r = regua('atf_reavaliar', 'ipva');
        var a = contribuinte('F4-012 reavaliar A');
        var dI = debito(a, 'ipva', 'aberto', 1250);
        var dT = debito(a, 'itcd', 'aberto', 500);
        var iA = inscricao(a, r, '', '');
        var com = new GlideRecord('x_2326104_cob_comunicacao');
        com.initialize();
        com.setWorkflow(false);
        com.setValue('contribuinte', a);
        com.setValue('inscricao', iA);
        com.setValue('status', 'agendada');
        var comA = com.insert();
        mudar('x_2326104_cob_debito', dT, 'status', 'regularizado');
        var depoisItcd = ler('x_2326104_cob_regua_inscricao', iA).getValue('status');
        mudar('x_2326104_cob_debito', dI, 'status', 'regularizado');
        var b = contribuinte('F4-012 reavaliar B');
        var dB = debito(b, 'ipva', 'aberto', 800);
        var iB = inscricao(b, r, '', '');
        var g = ler('x_2326104_cob_debito', dB);
        g.setWorkflow(false);
        g.setValue('status', 'regularizado');
        g.update();
        var antesReg = ler('x_2326104_cob_regua_inscricao', iB).getValue('status');
        var reg = new GlideRecord('x_2326104_cob_regularizacao');
        reg.initialize();
        reg.setValue('contribuinte', b);
        reg.setValue('debito', dB);
        reg.setValue('tributo', 'ipva');
        reg.setValue('origem', 'resposta_cobranca');
        reg.setValue('valor', 800);
        reg.insert();
        it('débito de ITCD regularizado não encerra a inscrição do IPVA', function() {
            expect(depoisItcd).toBe('ativa');
        });
        it('débito de IPVA regularizado encerra como regularizado; comunicação agendada vira encerrada', function() {
            var i = ler('x_2326104_cob_regua_inscricao', iA);
            expect(i.getValue('status')).toBe('encerrada');
            expect(i.getValue('motivo_encerramento')).toBe('regularizado');
            expect(ler('x_2326104_cob_comunicacao', comA).getValue('status')).toBe('encerrada');
        });
        it('regularização registrada encerra a inscrição de B', function() {
            expect(antesReg).toBe('ativa');
            var i = ler('x_2326104_cob_regua_inscricao', iB);
            expect(i.getValue('status')).toBe('encerrada');
            expect(i.getValue('motivo_encerramento')).toBe('regularizado');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4012_escalonar_ativa = Test({
    $id: Now.ID['US-MOD-F4-012_atf_escalonar_ativa'],
    name: 'RF-MOD-F4-012 — escalonar à cobrança ativa: cria o contato com origem régua ou reaproveita o aberto, sem duplicar',
    description: 'Régua atf_escalonar (última etapa encaminhar_ativa), ciclo fictício publicado. A (carteira de demo.atendente) sem contato: nasce contato com origem regua, atendente de A e a inscrição; a inscrição encerra como encaminhada_ativa com o contato; a segunda chamada não faz nada. B com contato aberto (próxima ação daqui a 5 dias): nenhum contato novo; o existente ganha a inscrição e a próxima ação hoje. C sem atendente: o contato vai a um atendente, gravado também no contribuinte (D14, P1; AS-TASK-MOD-F4-012-02-01..03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_06'],
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

    describe('ReguaMotor.escalonar — cobrança ativa', function() {
        var motor = new ReguaMotor();
        var u = usuario('demo.atendente');
        var r = regua('atf_escalonar', 'ipva');
        etapa(r, 1, 0, 'sne', 'utilitaria', 'encaminhar_ativa');
        var ci = ciclo('ATF ciclo F4-012 escalonar (fictício)', 'publicado');
        var a = contribuinte('F4-012 escalonar A', u);
        var iA = inscricao(a, r, ci, '');
        var r1 = motor.escalonar(iA);
        var r2 = motor.escalonar(iA);
        var b = contribuinte('F4-012 escalonar B', u);
        var futuro = new GlideDateTime();
        futuro.addDaysLocalTime(5);
        var cb = new GlideRecord('x_2326104_cob_contato');
        cb.initialize();
        cb.setValue('contribuinte', b);
        cb.setValue('atendente', u);
        cb.setValue('ciclo', ci);
        cb.setValue('status', 'a_ligar');
        cb.setValue('origem', 'distribuicao');
        cb.setValue('proxima_acao_em', futuro.getLocalDate().getValue());
        var contatoB = cb.insert();
        var iB = inscricao(b, r, ci, '');
        var rB = motor.escalonar(iB);
        var c = contribuinte('F4-012 escalonar C sem atendente', '');
        var iC = inscricao(c, r, ci, '');
        var rC = motor.escalonar(iC);
        var hoje = new GlideDateTime().getLocalDate().getValue();
        it('A: contato novo com origem regua, atendente de A, a inscrição e o ciclo', function() {
            expect(r1.destino).toBe('ativa');
            expect(contar('x_2326104_cob_contato', 'contribuinte=' + a)).toBe(1);
            var k = ler('x_2326104_cob_contato', r1.contato);
            expect(k.getValue('origem')).toBe('regua');
            expect(k.getValue('atendente')).toBe(u);
            expect(k.getValue('inscricao')).toBe(iA);
            expect(k.getValue('ciclo')).toBe(ci);
            expect(k.getValue('status')).toBe('a_ligar');
        });
        it('A: inscrição encerrada como encaminhada_ativa, com o contato', function() {
            var i = ler('x_2326104_cob_regua_inscricao', iA);
            expect(i.getValue('status')).toBe('encerrada');
            expect(i.getValue('motivo_encerramento')).toBe('encaminhada_ativa');
            expect(i.getValue('contato')).toBe(r1.contato);
        });
        it('segunda chamada não faz nada', function() {
            expect(r2.destino).toBe('');
            expect(r2.contato).toBe('');
            expect(contar('x_2326104_cob_contato', 'contribuinte=' + a)).toBe(1);
        });
        it('B: contato aberto reaproveitado, com a inscrição e a próxima ação hoje', function() {
            expect(rB.destino).toBe('ativa');
            expect(rB.contato).toBe(contatoB);
            expect(contar('x_2326104_cob_contato', 'contribuinte=' + b)).toBe(1);
            var k = ler('x_2326104_cob_contato', contatoB);
            expect(k.getValue('inscricao')).toBe(iB);
            expect(k.getValue('proxima_acao_em')).toBe(hoje);
            expect(k.getValue('origem')).toBe('distribuicao');
        });
        it('C sem atendente: o contato vai a um atendente, gravado também no contribuinte', function() {
            var k = ler('x_2326104_cob_contato', rC.contato);
            expect(k.getValue('atendente')).toBeTruthy();
            expect(ler('x_2326104_cob_contribuinte', c).getValue('atendente')).toBe(k.getValue('atendente'));
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4012_escalonar_qualificada = Test({
    $id: Now.ID['US-MOD-F4-012_atf_escalonar_qualificada'],
    name: 'RF-MOD-F4-012 — escalonar à qualificada: a marca leva o contribuinte à qualificada no ciclo seguinte e a publicação limpa a marca',
    description: 'Régua atf_itcd (última etapa encaminhar_qualificada): escalonar grava encaminhado_qualificada_em em A, encerra a inscrição como encaminhada_qualificada e não cria contato. No ciclo seguinte (critério fictício de valor mínimo alto), a segmentação de A sai qualificada com motivo «Esgotou a régua (RN-NOVO-F4-008)» e a de B, sem a marca, massificada; inscrever nesse ciclo limpa a marca de A (RN-NOVO-F4-008; AS-TASK-MOD-F4-012-02-04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_07'],
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

    describe('ReguaMotor.escalonar — cobrança qualificada', function() {
        desligarReais(['itcd']);
        var motor = new ReguaMotor();
        var r = regua('atf_itcd', 'itcd');
        etapa(r, 1, 0, 'sne', 'utilitaria', 'encaminhar_qualificada');
        var a = contribuinte('F4-012 qualificada A');
        debito(a, 'itcd', 'aberto', 500);
        var b = contribuinte('F4-012 qualificada B');
        debito(b, 'itcd', 'aberto', 500);
        var iA = inscricao(a, r, '', '');
        var res = motor.escalonar(iA);
        var marca = ler('x_2326104_cob_contribuinte', a).getValue('encaminhado_qualificada_em');
        var crit = criterio('ATF-F4012-QUAL', 1000000);
        var ci = ciclo('ATF ciclo F4-012 seguinte (fictício)', 'previa', crit);
        var sA = segmentar(ci, a, '');
        var sB = segmentar(ci, b, '');
        motor.inscrever(ci);
        it('marca gravada, inscrição encerrada como encaminhada_qualificada, sem contato', function() {
            expect(res.destino).toBe('qualificada');
            expect(marca).toBeTruthy();
            var i = ler('x_2326104_cob_regua_inscricao', iA);
            expect(i.getValue('status')).toBe('encerrada');
            expect(i.getValue('motivo_encerramento')).toBe('encaminhada_qualificada');
            expect(contar('x_2326104_cob_contato', 'contribuinte=' + a)).toBe(0);
        });
        it('segmentação do ciclo seguinte: A qualificada pela régua; B massificada', function() {
            var g = ler('x_2326104_cob_segmentacao', sA);
            expect(g.getValue('segmento')).toBe('qualificada');
            expect(g.getValue('motivo')).toBe('Esgotou a régua (RN-NOVO-F4-008)');
            expect(ler('x_2326104_cob_segmentacao', sB).getValue('segmento')).toBe('massificada');
        });
        it('inscrever no ciclo seguinte limpa a marca', function() {
            expect(ler('x_2326104_cob_contribuinte', a).getValue('encaminhado_qualificada_em')).toBeFalsy();
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4012_pausa = Test({
    $id: Now.ID['US-MOD-F4-012_atf_pausa'],
    name: 'RF-MOD-F4-012 — Pausar encerra as inscrições ativas com régua pausada; Ativar não retoma',
    description: 'Régua atf_pausa com 2 inscrições ativas e régua atf_pausa_outra com 1: pausar grava «Ativa» = falso e encerra as 2 como regua_pausada, sem mexer na outra régua; pausar de novo é recusado; ativar grava «Ativa» = verdadeiro e as inscrições continuam encerradas (B4, A1; AS-TASK-MOD-F4-012-03-01..02).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-012_test_08'],
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

    describe('ReguaMotor.pausar e ativar', function() {
        var motor = new ReguaMotor();
        var r = regua('atf_pausa', 'ipva');
        var o = regua('atf_pausa_outra', 'ipva');
        var i1 = inscricao(contribuinte('F4-012 pausa 1'), r, '', '');
        var i2 = inscricao(contribuinte('F4-012 pausa 2'), r, '', '');
        var i3 = inscricao(contribuinte('F4-012 pausa 3'), o, '', '');
        var p1 = motor.pausar(r);
        var ativaDepoisPausa = ler('x_2326104_cob_regua', r).getValue('ativa');
        var p2 = motor.pausar(r);
        var a1 = motor.ativar(r);
        it('pausar grava ativa = falso e encerra as 2 inscrições com regua_pausada', function() {
            expect(p1.ok).toBe(true);
            expect(ativaDepoisPausa).toBe('0');
            expect(ler('x_2326104_cob_regua_inscricao', i1).getValue('motivo_encerramento')).toBe('regua_pausada');
            expect(ler('x_2326104_cob_regua_inscricao', i2).getValue('motivo_encerramento')).toBe('regua_pausada');
        });
        it('a inscrição de outra régua continua ativa', function() {
            expect(ler('x_2326104_cob_regua_inscricao', i3).getValue('status')).toBe('ativa');
        });
        it('pausar régua já pausada é recusado', function() {
            expect(p2.ok).toBe(false);
            expect(p2.mensagem).toBe('A régua já está pausada.');
        });
        it('ativar grava ativa = verdadeiro e não retoma as inscrições', function() {
            expect(a1.ok).toBe(true);
            expect(ler('x_2326104_cob_regua', r).getValue('ativa')).toBe('1');
            expect(ler('x_2326104_cob_regua_inscricao', i1).getValue('status')).toBe('encerrada');
            expect(ler('x_2326104_cob_regua_inscricao', i2).getValue('status')).toBe('encerrada');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4012_ui_coordenador = Test({
    $id: Now.ID['US-MOD-F4-012_atf_ui_coordenador'],
    name: 'RF-MOD-F4-012 — coordenador vê Pausar na régua ativa e o módulo «Inscrições»',
    description: 'Coordenador criado pelo teste abre uma régua fictícia ativa: vê «Pausar» e não vê «Ativar»; no menu vê o módulo «Inscrições» do separador Réguas (TASK-MOD-F4-012-03, D5).',
    failOnServerError: true,
}, (atf) => {
    const r = atf.server.recordInsert({ $id: Now.ID['US-MOD-F4-012_test_09'], table: 'x_2326104_cob_regua', fieldValues: { nome: 'Régua ATF atf_pausa_ui (fictícia)', codigo: 'atf_pausa_ui', carteira: 'ipva', ativa: true, prazo_final_dias: 5 } })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-012_test_10'], firstName: 'ATF', lastName: 'Coordenador F4-012 UI', roles: [role_coordenador] })
    atf.applicationNavigator.moduleVisibility({ $id: Now.ID['US-MOD-F4-012_test_11'], navigator: 'ui16', visibleModules: [Now.ref('sys_app_module', 'modulo_mod_ux_reguas_inscricoes')] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-012_test_12'], table: 'x_2326104_cob_regua', recordId: r.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F4-012_test_13'], table: 'x_2326104_cob_regua', visible: [Now.ref('sys_ui_action', 'F4-010_ua_pausar_regua')], notVisible: [Now.ref('sys_ui_action', 'F4-010_ua_ativar_regua')] })
})

export const t_f4012_ui_atendente = Test({
    $id: Now.ID['US-MOD-F4-012_atf_ui_atendente'],
    name: 'RF-MOD-F4-012 — atendente não vê Pausar nem o módulo «Inscrições»',
    description: 'Atendente criado pelo teste abre uma régua fictícia ativa: não vê «Pausar» nem «Ativar»; no menu não vê o módulo «Inscrições» (TASK-MOD-F4-012-03; AS-TASK-MOD-F4-012-03-03).',
    failOnServerError: true,
}, (atf) => {
    const r = atf.server.recordInsert({ $id: Now.ID['US-MOD-F4-012_test_14'], table: 'x_2326104_cob_regua', fieldValues: { nome: 'Régua ATF atf_pausa_ui2 (fictícia)', codigo: 'atf_pausa_ui2', carteira: 'ipva', ativa: true, prazo_final_dias: 5 } })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-012_test_15'], firstName: 'ATF', lastName: 'Atendente F4-012 UI', roles: [role_atendente] })
    atf.applicationNavigator.moduleVisibility({ $id: Now.ID['US-MOD-F4-012_test_16'], navigator: 'ui16', notVisibleModules: [Now.ref('sys_app_module', 'modulo_mod_ux_reguas_inscricoes')] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-012_test_17'], table: 'x_2326104_cob_regua', recordId: r.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F4-012_test_18'], table: 'x_2326104_cob_regua', notVisible: [Now.ref('sys_ui_action', 'F4-010_ua_pausar_regua'), Now.ref('sys_ui_action', 'F4-010_ua_ativar_regua')] })
})
