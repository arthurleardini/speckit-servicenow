// ATF da US-MOD-F2-002 — versão do critério imutável depois de publicada (RF-MOD-F2-002, RN-NOVO-F2-001,
// RN-NOVO-F2-002, SEC-009). Massa fictícia criada pelo próprio teste (desfeita pelo rollback do ATF).
// Cada teste roda como usuário criado na hora com o papel do app (createUser), nunca como admin.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador, role_admin } from '../security/roles.now'

export const t_f2002_publicar_pos = Test({
    $id: Now.ID['US-MOD-F2-002_atf_publicar_versao_positivo'],
    name: 'RF-MOD-F2-002 — coordenador publica a versão em rascunho',
    description: 'Cria a versão 1 de «ICMS alto valor (fictício)» em rascunho, entra como coordenador e chama CriterioVersao.publicar: confere estado «publicada», data e autor gravados e o registro passando a somente leitura pela ACL (RN-NOVO-F2-001, lado que atende a regra).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2002-PUB');
    c.setValue('versao', 1);
    c.setValue('estado', 'rascunho');
    c.setValue('tributo', 'icms_normal');
    c.setValue('valor_minimo', 500000);
    c.setValue('atraso_minimo_dias', 90);
    outputs.table = 'x_2326104_cob_criterio';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_02'], firstName: 'ATF', lastName: 'Coordenador F2-002', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_03'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Publicar versão (coordenador)', function() {
        it('grava publicada com data e autor e fica somente leitura', function() {
            var c = new GlideRecordSecure('x_2326104_cob_criterio');
            c.addQuery('codigo', 'ATF-F2002-PUB');
            c.query();
            expect(c.next()).toBe(true);
            expect(c.canWrite()).toBe(true);
            var r = new CriterioVersao().publicar(c);
            expect(r.ok).toBe(true);
            var d = new GlideRecordSecure('x_2326104_cob_criterio');
            expect(d.get(c.getUniqueValue())).toBe(true);
            expect(d.getValue('estado')).toBe('publicada');
            expect(d.getValue('publicada_por')).toBe(gs.getUserID());
            expect(d.publicada_em.nil()).toBe(false);
            expect(d.canWrite()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_publicar_neg = Test({
    $id: Now.ID['US-MOD-F2-002_atf_publicar_versao_negativo'],
    name: 'RF-MOD-F2-002 — administrador do app edita o rascunho mas não publica',
    description: 'Cria a versão em rascunho e entra como usuário só com o papel admin do app: ele grava o rascunho (ACL de write), mas CriterioVersao.publicar recusa com «Só o coordenador de cobrança publica ou cria versão do critério.» e o estado continua «rascunho» (publicação restrita ao coordenador, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_04'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2002-ADM');
    c.setValue('versao', 1);
    c.setValue('estado', 'rascunho');
    c.setValue('valor_minimo', 500000);
    outputs.table = 'x_2326104_cob_criterio';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_05'], firstName: 'ATF', lastName: 'Admin app F2-002', roles: [role_admin] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Publicar versão (admin do app)', function() {
        it('edita o rascunho mas não publica', function() {
            var c = new GlideRecordSecure('x_2326104_cob_criterio');
            c.addQuery('codigo', 'ATF-F2002-ADM');
            c.query();
            expect(c.next()).toBe(true);
            expect(c.canWrite()).toBe(true);
            var r = new CriterioVersao().publicar(c);
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Só o coordenador de cobrança publica ou cria versão do critério.');
            var d = new GlideRecord('x_2326104_cob_criterio');
            d.get(c.getUniqueValue());
            expect(d.getValue('estado')).toBe('rascunho');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_imutavel_neg = Test({
    $id: Now.ID['US-MOD-F2-002_atf_versao_publicada_imutavel_negativo'],
    name: 'RF-MOD-F2-002 — alterar versão publicada é recusado, inclusive pelo administrador',
    description: 'Cria a versão 2 publicada com atraso mínimo de 90 dias e entra como admin do app: a ACL deixa a versão somente leitura e, mesmo gravando por script sem ACL, a business rule recusa com «Versão publicada não pode ser alterada. Crie uma nova versão.» e o atraso continua 90 (RN-NOVO-F2-001 e SEC-009, lado que viola a regra).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_07'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2002-IMU');
    c.setValue('versao', 2);
    c.setValue('estado', 'publicada');
    c.setValue('valor_minimo', 500000);
    c.setValue('atraso_minimo_dias', 90);
    outputs.table = 'x_2326104_cob_criterio';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_08'], firstName: 'ATF', lastName: 'Admin app F2-002 imutavel', roles: [role_admin] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_09'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Versão publicada imutável', function() {
        it('ACL deixa somente leitura', function() {
            var s = new GlideRecordSecure('x_2326104_cob_criterio');
            s.addQuery('codigo', 'ATF-F2002-IMU');
            s.query();
            expect(s.next()).toBe(true);
            expect(s.canWrite()).toBe(false);
            expect(s.canDelete()).toBe(false);
        });
        it('business rule recusa a gravação e mostra a mensagem', function() {
            var antes = new GlideRecord('x_2326104_cob_criterio');
            antes.addQuery('codigo', 'ATF-F2002-IMU');
            antes.query();
            antes.next();
            var depois = new GlideRecord('x_2326104_cob_criterio');
            depois.get(antes.getUniqueValue());
            depois.setValue('atraso_minimo_dias', 30);
            expect(new CriterioVersao().motivoRecusaAlteracao(depois, antes)).toBe('Versão publicada não pode ser alterada. Crie uma nova versão.');
            depois.update();
            var lida = new GlideRecord('x_2326104_cob_criterio');
            lida.get(antes.getUniqueValue());
            expect(lida.getValue('atraso_minimo_dias')).toBe('90');
            expect(lida.getValue('estado')).toBe('publicada');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_nova_versao_pos = Test({
    $id: Now.ID['US-MOD-F2-002_atf_criar_nova_versao_positivo'],
    name: 'RF-MOD-F2-002 — criar nova versão a partir da publicada e o ciclo mantém a original',
    description: 'Cria a versão 2 publicada (R$ 500.000,00) e o ciclo 2027-01 publicado com ela; o coordenador cria a versão 3, muda o valor mínimo para R$ 300.000,00, informa o motivo e publica: a versão 3 nasce em rascunho ligada à 2, a 2 fica «substituída» com R$ 500.000,00 e o ciclo continua com a versão 2 (RN-NOVO-F2-001 e RN-NOVO-F2-002, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_10'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2002-NV');
    c.setValue('versao', 2);
    c.setValue('estado', 'publicada');
    c.setValue('valor_minimo', 500000);
    c.setValue('atraso_minimo_dias', 90);
    var v2 = c.insert();
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo 2027-01 (fictício)');
    ci.setValue('estado', 'publicado');
    ci.setValue('criterio', v2);
    ci.setValue('qtd_elegiveis', 200);
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ci.insert();
    return !!v2 && !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_11'], firstName: 'ATF', lastName: 'Coordenador F2-002 nova', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_12'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Criar nova versão', function() {
        it('versão 3 nasce em rascunho, publica e substitui a 2; ciclo mantém a 2', function() {
            var v2 = new GlideRecordSecure('x_2326104_cob_criterio');
            v2.addQuery('codigo', 'ATF-F2002-NV');
            v2.query();
            expect(v2.next()).toBe(true);
            var si = new CriterioVersao();
            var r = si.criarNovaVersao(v2);
            expect(r.ok).toBe(true);
            var v3 = new GlideRecordSecure('x_2326104_cob_criterio');
            expect(v3.get(r.sysId)).toBe(true);
            expect(v3.getValue('estado')).toBe('rascunho');
            expect(v3.getValue('versao')).toBe('3');
            expect(v3.getValue('codigo')).toBe('ATF-F2002-NV');
            expect(v3.getValue('versao_anterior')).toBe(v2.getUniqueValue());
            v3.setValue('valor_minimo', 300000);
            v3.setValue('motivo_alteracao', 'Ajuste do valor mínimo (fictício)');
            expect(!!v3.update()).toBe(true);
            expect(si.publicar(v3).ok).toBe(true);
            var lida3 = new GlideRecord('x_2326104_cob_criterio');
            lida3.get(r.sysId);
            expect(lida3.getValue('estado')).toBe('publicada');
            expect(lida3.publicada_por.nil()).toBe(false);
            var lida2 = new GlideRecord('x_2326104_cob_criterio');
            lida2.get(v2.getUniqueValue());
            expect(lida2.getValue('estado')).toBe('substituida');
            expect(parseFloat(lida2.getValue('valor_minimo'))).toBe(500000);
            var ciclo = new GlideRecord('x_2326104_cob_ciclo');
            ciclo.addQuery('nome', 'ATF ciclo 2027-01 (fictício)');
            ciclo.query();
            expect(ciclo.next()).toBe(true);
            expect(ciclo.getValue('criterio')).toBe(v2.getUniqueValue());
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_nova_versao_neg = Test({
    $id: Now.ID['US-MOD-F2-002_atf_criar_nova_versao_negativo'],
    name: 'RF-MOD-F2-002 — nova versão só nasce de versão publicada e só publica com motivo',
    description: 'Como coordenador, pede nova versão a partir de um rascunho e o CriterioVersao recusa com «Só a versão publicada gera uma nova versão.» sem criar registro; depois tenta publicar uma versão ligada à anterior sem motivo e recebe «Informe o motivo da nova versão antes de publicar.» (RN-NOVO-F2-001 e SEC-009, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_13'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var a = new GlideRecord('x_2326104_cob_criterio');
    a.initialize();
    a.setWorkflow(false);
    a.setValue('nome', 'ICMS alto valor (fictício)');
    a.setValue('codigo', 'ATF-F2002-NEG');
    a.setValue('versao', 1);
    a.setValue('estado', 'publicada');
    var v1 = a.insert();
    var b = new GlideRecord('x_2326104_cob_criterio');
    b.initialize();
    b.setValue('nome', 'ICMS alto valor (fictício)');
    b.setValue('codigo', 'ATF-F2002-NEG');
    b.setValue('versao', 2);
    b.setValue('estado', 'rascunho');
    b.setValue('versao_anterior', v1);
    outputs.table = 'x_2326104_cob_criterio';
    outputs.record_id = b.insert();
    return !!v1 && !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_14'], firstName: 'ATF', lastName: 'Coordenador F2-002 neg', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_15'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Nova versão recusada', function() {
        it('rascunho não gera nova versão', function() {
            var b = new GlideRecordSecure('x_2326104_cob_criterio');
            b.addQuery('codigo', 'ATF-F2002-NEG');
            b.addQuery('estado', 'rascunho');
            b.query();
            expect(b.next()).toBe(true);
            var r = new CriterioVersao().criarNovaVersao(b);
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Só a versão publicada gera uma nova versão.');
            var agg = new GlideAggregate('x_2326104_cob_criterio');
            agg.addQuery('codigo', 'ATF-F2002-NEG');
            agg.addAggregate('COUNT');
            agg.query();
            agg.next();
            expect(agg.getAggregate('COUNT')).toBe('2');
        });
        it('versão ligada à anterior não publica sem motivo', function() {
            var b = new GlideRecordSecure('x_2326104_cob_criterio');
            b.addQuery('codigo', 'ATF-F2002-NEG');
            b.addQuery('estado', 'rascunho');
            b.query();
            b.next();
            var r = new CriterioVersao().publicar(b);
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Informe o motivo da nova versão antes de publicar.');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_ciclo_neg = Test({
    $id: Now.ID['US-MOD-F2-002_atf_ciclo_guarda_versao_negativo'],
    name: 'RF-MOD-F2-002 — trocar o critério ou os totais de ciclo publicado é recusado',
    description: 'Cria o ciclo publicado com a versão 1 e 20 contribuintes no grupo de controle; como coordenador tenta trocar o «Critério aplicado» e o total do grupo de controle: a business rule do ciclo recusa com «Ciclo publicado não pode trocar o critério aplicado nem os totais.» e os valores ficam como estavam; o comentário do ciclo continua gravando (RN-NOVO-F2-002, lado negativo e positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_16'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var ids = [];
    for (var i = 1; i <= 2; i++) {
        var c = new GlideRecord('x_2326104_cob_criterio');
        c.initialize();
        c.setWorkflow(false);
        c.setValue('nome', 'ICMS alto valor (fictício)');
        c.setValue('codigo', 'ATF-F2002-CIC');
        c.setValue('versao', i);
        c.setValue('estado', 'publicada');
        ids.push(c.insert());
    }
    var ci = new GlideRecord('x_2326104_cob_ciclo');
    ci.initialize();
    ci.setValue('nome', 'ATF ciclo publicado F2-002 (fictício)');
    ci.setValue('estado', 'publicado');
    ci.setValue('criterio', ids[0]);
    ci.setValue('qtd_controle', 20);
    outputs.table = 'x_2326104_cob_ciclo';
    outputs.record_id = ci.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_17'], firstName: 'ATF', lastName: 'Coordenador F2-002 ciclo', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_18'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Ciclo publicado guarda a versão', function() {
        it('recusa trocar critério e totais', function() {
            var v2 = new GlideRecord('x_2326104_cob_criterio');
            v2.addQuery('codigo', 'ATF-F2002-CIC');
            v2.addQuery('versao', 2);
            v2.query();
            v2.next();
            var ci = new GlideRecord('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo publicado F2-002 (fictício)');
            ci.query();
            expect(ci.next()).toBe(true);
            var original = ci.getValue('criterio');
            var antes = new GlideRecord('x_2326104_cob_ciclo');
            antes.get(ci.getUniqueValue());
            ci.setValue('criterio', v2.getUniqueValue());
            ci.setValue('qtd_controle', 5);
            expect(new CriterioVersao().motivoRecusaAlteracaoCiclo(ci, antes)).toBe('Ciclo publicado não pode trocar o critério aplicado nem os totais.');
            ci.update();
            var lido = new GlideRecord('x_2326104_cob_ciclo');
            lido.get(antes.getUniqueValue());
            expect(lido.getValue('criterio')).toBe(original);
            expect(lido.getValue('qtd_controle')).toBe('20');
        });
        it('aceita o comentário, que não é parâmetro do ciclo', function() {
            var ci = new GlideRecord('x_2326104_cob_ciclo');
            ci.addQuery('nome', 'ATF ciclo publicado F2-002 (fictício)');
            ci.query();
            ci.next();
            var antes = new GlideRecord('x_2326104_cob_ciclo');
            antes.get(ci.getUniqueValue());
            ci.setValue('taxa_cobrada', 15);
            expect(new CriterioVersao().motivoRecusaAlteracaoCiclo(ci, antes)).toBe('');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_gravacao_neg = Test({
    $id: Now.ID['US-MOD-F2-002_atf_codigo_versao_unico_negativo'],
    name: 'RF-MOD-F2-002 — versão nasce em rascunho e código + versão não se repetem',
    description: 'Como coordenador, cria a versão 1 de um código em rascunho (gravada) e depois tenta gravar outra versão 1 do mesmo código e, por script sem ACL, uma versão já «publicada»: a business rule recusa as duas e só a primeira existe (SEC-009, lados positivo e negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_19'], firstName: 'ATF', lastName: 'Coordenador F2-002 unico', roles: [role_coordenador] })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_20'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function nova(versao, estado) {
        var c = new GlideRecordSecure('x_2326104_cob_criterio');
        c.initialize();
        c.setValue('nome', 'ICMS alto valor (fictício)');
        c.setValue('codigo', 'ATF-F2002-UNI');
        c.setValue('versao', versao);
        c.setValue('estado', estado);
        return c.insert();
    }
    describe('Gravação da versão', function() {
        it('aceita a primeira versão em rascunho', function() {
            expect(!!nova(1, 'rascunho')).toBe(true);
        });
        it('recusa versão repetida e versão que nasce publicada', function() {
            expect(!!nova(1, 'rascunho')).toBe(false);
            var pub = new GlideRecord('x_2326104_cob_criterio');
            pub.initialize();
            pub.setValue('nome', 'ICMS alto valor (fictício)');
            pub.setValue('codigo', 'ATF-F2002-UNI');
            pub.setValue('versao', 2);
            pub.setValue('estado', 'publicada');
            expect(!!pub.insert()).toBe(false);
            var agg = new GlideAggregate('x_2326104_cob_criterio');
            agg.addQuery('codigo', 'ATF-F2002-UNI');
            agg.addAggregate('COUNT');
            agg.query();
            agg.next();
            expect(agg.getAggregate('COUNT')).toBe('1');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f2002_ui_pos = Test({
    $id: Now.ID['US-MOD-F2-002_atf_ui_acoes_coordenador_positivo'],
    name: 'RF-MOD-F2-002 — coordenador vê «Publicar versão» no rascunho e «Criar nova versão» na publicada',
    description: 'Abre no form (TEL-008) uma versão em rascunho e uma publicada como coordenador: no rascunho aparece «Publicar versão» e não «Criar nova versão»; na publicada aparece «Criar nova versão», some «Publicar versão» e o valor mínimo e o atraso ficam somente leitura (UI Action e ACL, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    const rascunho = atf.server.recordInsert({
        $id: Now.ID['US-MOD-F2-002_test_21'],
        table: 'x_2326104_cob_criterio',
        fieldValues: { nome: 'ICMS alto valor (fictício)', codigo: 'ATF-F2002-UI1', versao: 1, estado: 'rascunho' },
    })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F2-002_test_22'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var c = new GlideRecord('x_2326104_cob_criterio');
    c.initialize();
    c.setWorkflow(false);
    c.setValue('nome', 'ICMS alto valor (fictício)');
    c.setValue('codigo', 'ATF-F2002-UI2');
    c.setValue('versao', 1);
    c.setValue('estado', 'publicada');
    c.setValue('valor_minimo', 500000);
    outputs.table = 'x_2326104_cob_criterio';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    // A versão publicada nasce sem a business rule (setWorkflow false); o id vem de uma consulta.
    const publicada = atf.server.recordQuery({ $id: Now.ID['US-MOD-F2-002_test_34'], table: 'x_2326104_cob_criterio', fieldValues: 'codigo=ATF-F2002-UI2', assert: 'records_match_query' })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_23'], firstName: 'ATF', lastName: 'Coordenador F2-002 UI', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F2-002_test_24'], table: 'x_2326104_cob_criterio', recordId: rascunho.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F2-002_test_25'], table: 'x_2326104_cob_criterio', visible: [Now.ref('sys_ui_action', 'RF-MOD-F2-002_ua_publicar_versao')], notVisible: [Now.ref('sys_ui_action', 'RF-MOD-F2-002_ua_criar_nova_versao')] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F2-002_test_26'], table: 'x_2326104_cob_criterio', recordId: publicada.first_record })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F2-002_test_27'], table: 'x_2326104_cob_criterio', visible: [Now.ref('sys_ui_action', 'RF-MOD-F2-002_ua_criar_nova_versao')], notVisible: [Now.ref('sys_ui_action', 'RF-MOD-F2-002_ua_publicar_versao')] })
    atf.form.fieldStateValidation({ $id: Now.ID['US-MOD-F2-002_test_28'], table: 'x_2326104_cob_criterio', readOnly: ['valor_minimo', 'atraso_minimo_dias'] })
})

export const t_f2002_ui_neg = Test({
    $id: Now.ID['US-MOD-F2-002_atf_ui_acoes_admin_negativo'],
    name: 'RF-MOD-F2-002 — administrador do app não vê «Publicar versão»',
    description: 'Abre no form (TEL-008) uma versão em rascunho como usuário só com o papel admin do app: o botão «Publicar versão» não aparece e o valor mínimo continua editável (o admin edita o rascunho, mas a publicação é só do coordenador — lado negativo da UI Action).',
    failOnServerError: true,
}, (atf) => {
    const rascunho = atf.server.recordInsert({
        $id: Now.ID['US-MOD-F2-002_test_29'],
        table: 'x_2326104_cob_criterio',
        fieldValues: { nome: 'ICMS alto valor (fictício)', codigo: 'ATF-F2002-UI3', versao: 1, estado: 'rascunho' },
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F2-002_test_30'], firstName: 'ATF', lastName: 'Admin app F2-002 UI', roles: [role_admin] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F2-002_test_31'], table: 'x_2326104_cob_criterio', recordId: rascunho.record_id })
    atf.form.uiActionVisibility({ $id: Now.ID['US-MOD-F2-002_test_32'], table: 'x_2326104_cob_criterio', notVisible: [Now.ref('sys_ui_action', 'RF-MOD-F2-002_ua_publicar_versao'), Now.ref('sys_ui_action', 'RF-MOD-F2-002_ua_criar_nova_versao')] })
    atf.form.fieldStateValidation({ $id: Now.ID['US-MOD-F2-002_test_33'], table: 'x_2326104_cob_criterio', notReadOnly: ['valor_minimo'] })
})
