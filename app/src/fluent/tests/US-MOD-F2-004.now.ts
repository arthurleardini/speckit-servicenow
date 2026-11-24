// ATF da US-MOD-F2-004 — sorteio do grupo de controle por ciclo (RF-MOD-F2-004, RN-NOVO-F2-005,
// RN-NOVO-F2-006, SEC-010). Massa fictícia criada pelo próprio teste e desfeita pelo rollback do ATF.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from '../security/roles.now'

export const t_f2004_sorteio_pos = Test({
    $id: Now.ID['US-MOD-F2-004_atf_sorteio_controle_positivo'],
    name: 'RF-MOD-F2-004 — publicar o ciclo sorteia 10% dos elegíveis para o grupo de controle',
    description: 'Cria o ciclo 2027-01 em prévia com 200 elegíveis fictícios e a versão do critério com 10%; o coordenador publica com QualificacaoCiclo.publicar: 20 contribuintes ficam no «Grupo de controle», o ciclo grava a semente, «Elegíveis = 200» e «Grupo de controle = 20», e refazer o sorteio com a mesma semente devolve a mesma lista (RN-NOVO-F2-005 e RN-NOVO-F2-006, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2004-POS');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('pct_grupo_controle', 10);
    var crit = c.insert();
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo 2027-01 F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', crit);
    var ciclo = ci.insert();
    for (var i = 1; i <= 200; i++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F2-004 ' + i);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        var pid = p.insert();
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', pid);
        s.setValue('criterio', crit);
        s.setValue('segmento', i % 2 ? 'qualificada' : 'massificada');
        s.insert();
    }
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ciclo;
    return !!ciclo;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_02'], firstName: 'ATF', lastName: 'Coordenador F2-004', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_03'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Publicar ciclo com sorteio de 10%', function() {
        it('sorteia 20 de 200, grava semente e totais, e o sorteio é reprodutível', function() {
            var ci = new GlideRecordSecure('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo 2027-01 F2-004 (fictício)');
            ci.query();
            expect(ci.next()).toBe(true);
            var criterioAntes = ci.getValue('criterio');
            var r = new QualificacaoCiclo().publicar(ci);
            expect(r.ok).toBe(true);
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(ci.getUniqueValue());
            expect(lido.getValue('estado')).toBe('publicado');
            expect(lido.getValue('qtd_elegiveis')).toBe('200');
            expect(lido.getValue('qtd_controle')).toBe('20');
            expect(lido.getValue('criterio')).toBe(criterioAntes);
            expect(lido.getValue('publicado_por')).toBe(gs.getUserID());
            var semente = parseInt(lido.getValue('semente_sorteio'), 10);
            expect(semente > 0).toBe(true);
            var ctl = [];
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.addQuery('ciclo', ci.getUniqueValue());
            s.addQuery('segmento', 'controle');
            s.query();
            while (s.next()) { ctl.push(s.getValue('contribuinte')); }
            expect(ctl.length).toBe(20);
            ctl.sort();
            var refeito = new QualificacaoCiclo().listaSorteio(ci.getUniqueValue(), semente, 10);
            expect(refeito.join(',')).toBe(ctl.join(','));
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2004_semente_neg = Test({
    $id: Now.ID['US-MOD-F2-004_atf_sorteio_semente_negativo'],
    name: 'RF-MOD-F2-004 — semente diferente dá outro grupo e o tamanho arredonda para cima',
    description: 'Com 60 elegíveis fictícios em prévia, refaz o sorteio pelo QualificacaoCiclo: a mesma semente devolve a mesma lista e uma semente diferente devolve outra (o grupo só se reproduz pela semente gravada); confere ainda 205 × 10% = 21 (arredondado para cima) e 0 elegíveis = 0 no controle (RN-NOVO-F2-006, lados positivo e negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_04'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo semente F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    var ciclo = ci.insert();
    for (var i = 1; i <= 60; i++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício semente ' + i);
        p.setValue('tipo_pessoa', 'pf');
        p.setValue('ficticio', true);
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', p.insert());
        s.setValue('segmento', 'qualificada');
        s.insert();
    }
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ciclo;
    return !!ciclo;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_05'], firstName: 'ATF', lastName: 'Coordenador F2-004 semente', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Semente e tamanho do grupo', function() {
        var si = new QualificacaoCiclo();
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.addQuery('nome', 'ATF ciclo semente F2-004 (fictício)');
        ci.query();
        ci.next();
        var id = ci.getUniqueValue();
        it('mesma semente, mesma lista', function() {
            var a = si.listaSorteio(id, 12345, 10);
            expect(a.length).toBe(6);
            expect(si.listaSorteio(id, 12345, 10).join(',')).toBe(a.join(','));
        });
        it('semente diferente, outra lista', function() {
            expect(si.listaSorteio(id, 777, 10).join(',')).not.toBe(si.listaSorteio(id, 12345, 10).join(','));
        });
        it('arredonda para cima e trata zero', function() {
            expect(si.tamanhoControle(205, 10)).toBe(21);
            expect(si.tamanhoControle(200, 10)).toBe(20);
            expect(si.tamanhoControle(0, 10)).toBe(0);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2004_sem_elegiveis = Test({
    $id: Now.ID['US-MOD-F2-004_atf_ciclo_sem_elegiveis_positivo'],
    name: 'RF-MOD-F2-004 — publicar ciclo sem elegíveis fica com zero no controle',
    description: 'Cria o ciclo em prévia sem nenhum contribuinte segmentado e o coordenador publica: o ciclo fica «Publicado» com «Elegíveis = 0» e «Grupo de controle = 0», sem erro (caso de borda do RN-NOVO-F2-005).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_07'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2004-VAZ');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('pct_grupo_controle', 10);
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo vazio F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', c.insert());
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ci.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_08'], firstName: 'ATF', lastName: 'Coordenador F2-004 vazio', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_09'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Ciclo sem elegíveis', function() {
        it('publica com zero', function() {
            var ci = new GlideRecordSecure('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo vazio F2-004 (fictício)');
            ci.query();
            expect(ci.next()).toBe(true);
            expect(new QualificacaoCiclo().publicar(ci).ok).toBe(true);
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(ci.getUniqueValue());
            expect(lido.getValue('estado')).toBe('publicado');
            expect(lido.getValue('qtd_elegiveis')).toBe('0');
            expect(lido.getValue('qtd_controle')).toBe('0');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2004_acao_neg = Test({
    $id: Now.ID['US-MOD-F2-004_atf_acao_controle_negativo'],
    name: 'RF-MOD-F2-004 — contribuinte no grupo de controle não recebe comunicação nem caso',
    description: 'Publica um ciclo fictício de 20 elegíveis com 10% (2 no controle); como coordenador, grava por script uma comunicação e um caso para um contribuinte do controle e as business rules recusam com «Contribuinte está no Grupo de controle do ciclo e fica fora das ações de cobrança.»; para um contribuinte fora do controle a comunicação é gravada (RN-NOVO-F2-005, lados negativo e positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_10'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2004-ACA');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('pct_grupo_controle', 10);
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo ações F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', c.insert());
    var ciclo = ci.insert();
    for (var i = 1; i <= 20; i++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício ações ' + i);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', p.insert());
        s.setValue('segmento', 'qualificada');
        s.insert();
    }
    ci.get(ciclo);
    var r = new QualificacaoCiclo().publicar(ci);
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ciclo;
    return r.ok;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_11'], firstName: 'ATF', lastName: 'Coordenador F2-004 acoes', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_12'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Controle fora das ações', function() {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.addQuery('nome', 'ATF ciclo ações F2-004 (fictício)');
        ci.query();
        ci.next();
        function um(segmento) {
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.addQuery('ciclo', ci.getUniqueValue());
            s.addQuery('segmento', segmento);
            s.setLimit(1);
            s.query();
            s.next();
            return s.getValue('contribuinte');
        }
        it('recusa comunicação e caso para o controle', function() {
            var ctl = um('controle');
            expect(!!ctl).toBe(true);
            var com = new GlideRecord('x_2326104_cob_comunicacao');
            com.initialize();
            com.setValue('contribuinte', ctl);
            com.setValue('ciclo', ci.getUniqueValue());
            expect(!!com.insert()).toBe(false);
            var caso = new GlideRecord('x_2326104_cob_caso');
            caso.initialize();
            caso.setValue('contribuinte', ctl);
            caso.setValue('ciclo', ci.getUniqueValue());
            expect(!!caso.insert()).toBe(false);
            expect(new QualificacaoCiclo().motivoRecusaAcao(com)).toBe('Contribuinte está no Grupo de controle do ciclo e fica fora das ações de cobrança.');
        });
        it('grava comunicação para quem está fora do controle', function() {
            var com = new GlideRecord('x_2326104_cob_comunicacao');
            com.initialize();
            com.setValue('contribuinte', um('qualificada'));
            com.setValue('ciclo', ci.getUniqueValue());
            expect(!!com.insert()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2004_publicar_neg = Test({
    $id: Now.ID['US-MOD-F2-004_atf_publicar_ciclo_negativo'],
    name: 'RF-MOD-F2-004 — só o coordenador publica, e só com versão publicada do critério',
    description: 'Cria um ciclo em prévia sem versão do critério; o usuário só com o papel admin do app recebe «Só o coordenador de cobrança publica o ciclo.», e o coordenador recebe «Informe uma versão publicada do critério antes de publicar o ciclo.»; o ciclo continua em prévia e sem semente (publicação restrita, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_13'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo recusa F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ci.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_14'], firstName: 'ATF', lastName: 'Admin app F2-004', roles: [role_admin] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_15'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Publicar ciclo (admin do app)', function() {
        it('recusa', function() {
            var ci = new GlideRecord('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo recusa F2-004 (fictício)');
            ci.query();
            ci.next();
            var r = new QualificacaoCiclo().publicar(ci);
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Só o coordenador de cobrança publica o ciclo.');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_16'], firstName: 'ATF', lastName: 'Coordenador F2-004 recusa', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_17'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Publicar ciclo sem critério', function() {
        it('recusa e mantém em prévia', function() {
            var ci = new GlideRecord('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo recusa F2-004 (fictício)');
            ci.query();
            ci.next();
            var antes = new GlideRecord('x_2326104_cob_ciclo');
            antes.get(ci.getUniqueValue());
            var tentativa = new GlideRecord('x_2326104_cob_ciclo');
            tentativa.get(ci.getUniqueValue());
            tentativa.setValue('estado', 'publicado');
            expect(new QualificacaoCiclo().prepararPublicacao(tentativa, antes)).toBe('Informe uma versão publicada do critério antes de publicar o ciclo.');
            var r = new QualificacaoCiclo().publicar(ci);
            expect(r.ok).toBe(false);
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(ci.getUniqueValue());
            expect(lido.getValue('estado')).toBe('previa');
            expect(lido.semente_sorteio.nil()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2004_imutavel_neg = Test({
    $id: Now.ID['US-MOD-F2-004_atf_controle_imutavel_negativo'],
    name: 'RF-MOD-F2-004 — semente e grupo de controle não mudam depois de publicado o ciclo',
    description: 'Publica um ciclo fictício de 20 elegíveis; como coordenador tenta trocar a semente do ciclo e tirar um contribuinte do «Grupo de controle»: as business rules recusam e os valores ficam iguais; mudar de massificada para qualificada um contribuinte fora do controle continua permitido (SEC-010, lados negativo e positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_18'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2004-IMU');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('pct_grupo_controle', 10);
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo imutável F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', c.insert());
    var ciclo = ci.insert();
    for (var i = 1; i <= 20; i++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício imutável ' + i);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', p.insert());
        s.setValue('segmento', 'massificada');
        s.insert();
    }
    ci.get(ciclo);
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ciclo;
    return new QualificacaoCiclo().publicar(ci).ok;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_19'], firstName: 'ATF', lastName: 'Coordenador F2-004 imutavel', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_20'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Controle imutável após publicar', function() {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.addQuery('nome', 'ATF ciclo imutável F2-004 (fictício)');
        ci.query();
        ci.next();
        var id = ci.getUniqueValue();
        it('semente não muda e a ACL deixa o ciclo somente leitura', function() {
            var semente = ci.getValue('semente_sorteio');
            var sec = new GlideRecordSecure('x_2326104_cob_ciclo');
            sec.get(id);
            expect(sec.canWrite()).toBe(false);
            ci.setValue('semente_sorteio', 1);
            ci.update();
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(id);
            expect(lido.getValue('semente_sorteio')).toBe(semente);
        });
        it('contribuinte do controle não sai do grupo', function() {
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.addQuery('ciclo', id);
            s.addQuery('segmento', 'controle');
            s.setLimit(1);
            s.query();
            expect(s.next()).toBe(true);
            s.setValue('segmento', 'qualificada');
            s.update();
            var lido = new GlideRecord('x_2326104_cob_segmentacao');
            lido.get(s.getUniqueValue());
            expect(lido.getValue('segmento')).toBe('controle');
        });
        it('fora do controle o segmento ainda muda', function() {
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.addQuery('ciclo', id);
            s.addQuery('segmento', 'massificada');
            s.setLimit(1);
            s.query();
            s.next();
            s.setValue('segmento', 'qualificada');
            s.update();
            var lido = new GlideRecord('x_2326104_cob_segmentacao');
            lido.get(s.getUniqueValue());
            expect(lido.getValue('segmento')).toBe('qualificada');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2004_ui = Test({
    $id: Now.ID['US-MOD-F2-004_atf_ui_publicar_ciclo_por_papel'],
    name: 'RF-MOD-F2-004 — «Publicar ciclo» aparece para o coordenador no ciclo em prévia',
    description: 'Abre no form (TEL-009) um ciclo em prévia como coordenador: o botão «Publicar ciclo» aparece (UI Action restrita ao coordenador, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    const ciclo = atf.server.recordInsert({
        $id: Now.ID['US-MOD-F2-004_test_21'],
        table: 'x_2326104_cob_ciclo',
        fieldValues: { nome: 'ATF ciclo UI F2-004 (fictício)', estado: 'previa' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_22'], firstName: 'ATF', lastName: 'Coordenador F2-004 UI', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F2-004_test_23'], table: 'x_2326104_cob_ciclo', recordId: ciclo.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F2-004_test_24'], table: 'x_2326104_cob_ciclo', visible: [Now.ref('sys_ui_action', 'RF-MOD-F2-004_ua_publicar_ciclo')] })
})

export const t_f2004_ui_neg = Test({
    $id: Now.ID['US-MOD-F2-004_atf_ui_publicar_ciclo_admin_negativo'],
    name: 'RF-MOD-F2-004 — «Publicar ciclo» não aparece para o admin do app',
    description: 'Abre no form (TEL-009) um ciclo em prévia como usuário só com o papel admin do app: o botão «Publicar ciclo» não aparece (UI Action restrita ao coordenador, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    const ciclo = atf.server.recordInsert({
        $id: Now.ID['US-MOD-F2-004_test_28'],
        table: 'x_2326104_cob_ciclo',
        fieldValues: { nome: 'ATF ciclo UI admin F2-004 (fictício)', estado: 'previa' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_25'], firstName: 'ATF', lastName: 'Admin app F2-004 UI', roles: [role_admin] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F2-004_test_26'], table: 'x_2326104_cob_ciclo', recordId: ciclo.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F2-004_test_27'], table: 'x_2326104_cob_ciclo', notVisible: [Now.ref('sys_ui_action', 'RF-MOD-F2-004_ua_publicar_ciclo')] })
})

export const t_f2004_outro_caminho = Test({
    $id: Now.ID['US-MOD-F2-004_atf_publicacao_outro_caminho_negativo'],
    name: 'RF-MOD-F2-004 — publicar o ciclo trocando o «Estado» à mão segue as regras do botão',
    description: 'Cria um ciclo fictício em prévia com 20 elegíveis e a versão com 10%. Por script (sem ACL, como a Table API): o admin do app troca o estado para publicado e é recusado; o coordenador tenta gravar uma semente escolhida por ele e é recusado com «Semente, totais e autoria do ciclo são gravados pelo sistema ao publicar.»; o coordenador troca o estado e o sistema sorteia 2 no grupo de controle com semente própria, data e autor (SEC-010, lados negativo e positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_29'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2004-CAM');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('pct_grupo_controle', 10);
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo caminho F2-004 (fictício)');
    ci.setValue('estado', 'previa');
    ci.setValue('criterio', c.insert());
    var ciclo = ci.insert();
    for (var i = 1; i <= 20; i++) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício caminho ' + i);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', p.insert());
        s.setValue('segmento', 'qualificada');
        s.insert();
    }
    return !!ciclo;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_30'], firstName: 'ATF', lastName: 'Admin app F2-004 caminho', roles: [role_admin] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_31'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Publicar pelo campo Estado (admin do app)', function() {
        it('é recusado', function() {
            var ci = new GlideRecord('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo caminho F2-004 (fictício)');
            ci.query();
            ci.next();
            ci.setValue('estado', 'publicado');
            ci.update();
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(ci.getUniqueValue());
            expect(lido.getValue('estado')).toBe('previa');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-004_test_32'], firstName: 'ATF', lastName: 'Coordenador F2-004 caminho', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-004_test_33'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function ciclo() {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.addQuery('nome', 'ATF ciclo caminho F2-004 (fictício)');
        ci.query();
        ci.next();
        return ci;
    }
    describe('Publicar pelo campo Estado (coordenador)', function() {
        it('recusa semente escolhida à mão e sorteia ao publicar', function() {
            var a = ciclo();
            var antes = ciclo();
            a.setValue('semente_sorteio', 42);
            expect(new QualificacaoCiclo().prepararPublicacao(a, antes)).toBe('Semente, totais e autoria do ciclo são gravados pelo sistema ao publicar.');
            a.update();
            expect(ciclo().semente_sorteio.nil()).toBe(true);
            var b = ciclo();
            b.setValue('estado', 'publicado');
            b.update();
            var lido = ciclo();
            expect(lido.getValue('estado')).toBe('publicado');
            expect(lido.getValue('qtd_elegiveis')).toBe('20');
            expect(lido.getValue('qtd_controle')).toBe('2');
            expect(parseInt(lido.getValue('semente_sorteio'), 10) > 0).toBe(true);
            expect(lido.getValue('publicado_por')).toBe(gs.getUserID());
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
