// ATF da US-MOD-F2-005 — score como critério com fallback «sem score» (RF-MOD-F2-005, RN-NOVO-F3-001,
// RN-NOVO-F3-002). Massa fictícia criada pelo próprio teste e desfeita pelo rollback do ATF.
// Versão do critério: ICMS Normal, valor mínimo R$ 500.000,00, atraso mínimo 90 dias, usar score, threshold 60.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador, role_atendente } from '../security/roles.now'

export const t_f2005_score = Test({
    $id: Now.ID['US-MOD-F2-005_atf_score_threshold_positivo'],
    name: 'RF-MOD-F2-005 — score válido acima do threshold qualifica; abaixo vai para a massificada',
    description: 'Gera a prévia do ciclo 2027-02 (fictício) com os contribuintes J (score 72) e K (score 41), os dois com R$ 700.000,00 de ICMS Normal e 100 dias de atraso: a business rule classifica J como «Qualificada» com «Score usado = 72» e K como «Massificada», nenhum marcado «Sem score» (RN-NOVO-F3-001, lados positivo e negativo do threshold).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor com score (fictício)');
    c.setValue('codigo', 'ATF-F2005-SC');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('tributo', 'icms_normal');
    c.setValue('valor_minimo', 500000);
    c.setValue('atraso_minimo_dias', 90);
    c.setValue('usar_score', true);
    c.setValue('threshold_score', 60);
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo 2027-02 score (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', c.insert());
    ci.insert();
    var pessoas = [['J', 72], ['K', 41]];
    for (var i = 0; i < pessoas.length; i++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ' + pessoas[i][0] + ' F2-005');
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        p.setValue('score', pessoas[i][1]);
        var pid = p.insert();
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', pid);
        d.setValue('origem', 'ccf');
        d.setValue('tributo', 'icms_normal');
        d.setValue('valor', 700000);
        d.setValue('dias_atraso', 100);
        d.insert();
    }
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-005_test_02'], firstName: 'ATF', lastName: 'Coordenador F2-005', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_03'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function segmentar(letra) {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.addQuery('nome', 'ATF ciclo 2027-02 score (fictício)');
        ci.query();
        ci.next();
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.addQuery('nome', 'Contribuinte fictício ' + letra + ' F2-005');
        p.query();
        p.next();
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ci.getUniqueValue());
        s.setValue('contribuinte', p.getUniqueValue());
        var id = s.insert();
        var lida = new GlideRecord('x_2326104_cob_segmentacao');
        lida.get(id);
        return lida;
    }
    function marcado(gr) { return ['1', 'true'].indexOf(String(gr.getValue('sem_score'))) >= 0; }
    describe('Score como critério', function() {
        it('J com score 72 fica qualificada com score usado 72', function() {
            var j = segmentar('J');
            expect(j.getValue('segmento')).toBe('qualificada');
            expect(parseFloat(j.getValue('score_usado'))).toBe(72);
            expect(marcado(j)).toBe(false);
        });
        it('K com score 41 fica massificada', function() {
            var k = segmentar('K');
            expect(k.getValue('segmento')).toBe('massificada');
            expect(marcado(k)).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2005_fallback = Test({
    $id: Now.ID['US-MOD-F2-005_atf_fallback_sem_score_positivo'],
    name: 'RF-MOD-F2-005 — sem score válido, vale só valor e atraso e o contribuinte fica «Sem score»',
    description: 'Gera a prévia do ciclo 2027-02 (fictício) com o contribuinte E sem score válido, R$ 700.000,00 de ICMS Normal e 100 dias: E fica «Qualificada» com «Sem score» marcado na linha e no contribuinte, e o total «Sem score» do ciclo passa a 1 (fallback do RN-NOVO-F3-002, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_04'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor com score (fictício)');
    c.setValue('codigo', 'ATF-F2005-FB');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('tributo', 'icms_normal');
    c.setValue('valor_minimo', 500000);
    c.setValue('atraso_minimo_dias', 90);
    c.setValue('usar_score', true);
    c.setValue('threshold_score', 60);
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo 2027-02 fallback (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', c.insert());
    ci.insert();
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício E F2-005');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var d = new GlideRecord('x_2326104_cob_debito');
    d.initialize();
    d.setValue('contribuinte', pid);
    d.setValue('origem', 'ccf');
    d.setValue('tributo', 'icms_normal');
    d.setValue('valor', 700000);
    d.setValue('dias_atraso', 100);
    d.insert();
    return true;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-005_test_05'], firstName: 'ATF', lastName: 'Coordenador F2-005 fallback', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function marcado(gr) { return ['1', 'true'].indexOf(String(gr.getValue('sem_score'))) >= 0; }
    describe('Fallback sem score', function() {
        it('E qualifica por valor e atraso e fica Sem score', function() {
            var ci = new GlideRecord('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo 2027-02 fallback (fictício)');
            ci.query();
            ci.next();
            var p = new GlideRecord('x_2326104_cob_contribuinte');
            p.addQuery('nome', 'Contribuinte fictício E F2-005');
            p.query();
            p.next();
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.initialize();
            s.setValue('ciclo', ci.getUniqueValue());
            s.setValue('contribuinte', p.getUniqueValue());
            var id = s.insert();
            var lida = new GlideRecord('x_2326104_cob_segmentacao');
            lida.get(id);
            expect(lida.getValue('segmento')).toBe('qualificada');
            expect(marcado(lida)).toBe(true);
            var pessoa = new GlideRecord('x_2326104_cob_contribuinte');
            pessoa.get(p.getUniqueValue());
            expect(marcado(pessoa)).toBe(true);
            var ciclo = new GlideRecord('x_2326104_cob_ciclo');
            ciclo.get(ci.getUniqueValue());
            expect(ciclo.getValue('qtd_sem_score')).toBe('1');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2005_fallback_neg = Test({
    $id: Now.ID['US-MOD-F2-005_atf_fallback_sem_score_negativo'],
    name: 'RF-MOD-F2-005 — sem score e abaixo do valor mínimo não entra na qualificada',
    description: 'Com a mesma versão (usar score, threshold 60, valor mínimo R$ 500.000,00), classifica pelo SegmentacaoScore um contribuinte sem score válido com R$ 100.000,00 e 100 dias: fica «Massificada» e «Sem score»; um score fora da faixa (150) também conta como sem score; e sem «Usar score» o score 41 é ignorado (lado negativo do fallback e caso de borda).',
    failOnServerError: true,
}, (atf) => {
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-005_test_07'], firstName: 'ATF', lastName: 'Coordenador F2-005 neg', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_08'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Fallback sem score — lado negativo', function() {
        var si = new SegmentacaoScore();
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setValue('valor_minimo', 500000);
        c.setValue('atraso_minimo_dias', 90);
        c.setValue('usar_score', true);
        c.setValue('threshold_score', 60);
        it('sem score e valor abaixo fica massificada e Sem score', function() {
            var r = si.classificar(c, { valor: 100000, atraso: 100, score: '' });
            expect(r.segmento).toBe('massificada');
            expect(r.semScore).toBe(true);
        });
        it('score fora de 0 a 100 conta como sem score', function() {
            expect(si.scoreValido(150)).toBe(false);
            expect(si.classificar(c, { valor: 700000, atraso: 100, score: 150 }).semScore).toBe(true);
        });
        it('sem Usar score, o score é ignorado', function() {
            var s = new GlideRecord('x_2326104_cob_criterio');
            s.initialize();
            s.setValue('valor_minimo', 500000);
            s.setValue('atraso_minimo_dias', 90);
            s.setValue('usar_score', false);
            s.setValue('threshold_score', 60);
            var r = si.classificar(s, { valor: 700000, atraso: 100, score: 41 });
            expect(r.segmento).toBe('qualificada');
            expect(r.semScore).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2005_autorizacao = Test({
    $id: Now.ID['US-MOD-F2-005_atf_segmentacao_atendente_negativo'],
    name: 'RF-MOD-F2-005 — atendente não grava a carteira segmentada',
    description: 'Cria uma linha fictícia da carteira segmentada e entra como usuário só com o papel atendente: a ACL não deixa criar nem alterar linha de segmentação (a classificação é do servidor, na prévia do ciclo — lado de autorização).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_09'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo autorização F2-005 (fictício)');
    ci.setValue('estado', 'previa');
    var ciclo = ci.insert();
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício autorização F2-005');
    p.setValue('tipo_pessoa', 'pf');
    p.setValue('ficticio', true);
    var s = new GlideRecord('x_2326104_cob_segmentacao');
    s.initialize();
    s.setValue('ciclo', ciclo);
    s.setValue('contribuinte', p.insert());
    s.setValue('segmento', 'massificada');
    outputs.table = 'x_2326104_cob_segmentacao';
    outputs.record_id = s.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-005_test_10'], firstName: 'ATF', lastName: 'Atendente F2-005', roles: [role_atendente] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-005_test_11'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Segmentação pelo atendente', function() {
        it('não cria nem altera', function() {
            var s = new GlideRecordSecure('x_2326104_cob_segmentacao');
            expect(s.canCreate()).toBe(false);
            var t = new GlideRecord('x_2326104_cob_segmentacao');
            t.addQuery('ciclo.nome', 'ATF ciclo autorização F2-005 (fictício)');
            t.query();
            expect(t.next()).toBe(true);
            expect(t.canWrite()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
