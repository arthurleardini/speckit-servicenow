// ATF da US-MOD-F5-003 — dossiê consolidado do caso em 3 níveis (RF-MOD-F5-003, RN-NOVO-F5-003,
// RN-NOVO-F5-004, RN-NOVO-F5-007). Migrado na F4 do design UX v1 (R6): o caso é do coordenador; positivo =
// demo.coordenador, negativo = demo.atendente sem acesso. Usuários demo do seed impersonados; massa fictícia criada
// pelo próprio teste e desfeita pelo rollback do ATF.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

export const t_f5003_dossie_pos = Test({
    $id: Now.ID['US-MOD-F5-003_atf_dossie_completo_positivo'],
    name: 'RF-MOD-F5-003 — dossiê do caso reúne os 3 níveis para o coordenador responsável',
    description: 'Cria um caso fictício em condução de demo.coordenador (o responsável pelo caso qualificado, design UX v1 R6) com 2 débitos, nenhum parcelamento, 1 comunicação, 3 interações, 1 regularização, score 72 e sinalização coercitiva ativa; impersonado como demo.coordenador, CasoDossie.montar devolve o nível 1 (2 débitos, 0 parcelamentos — lista vazia), o nível 2 (1, 3 e 1) e o nível 3 (score 72 e a sinalização com a descrição); um caso sem contribuinte é recusado com «Operação recusada: visão única do contribuinte por documento.» (RN-NOVO-F5-003, RN-NOVO-F1-001, lado positivo e bordas).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-003_test_01'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.coordenador');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício dossiê F5-003');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var c = new GlideRecord('x_2326104_cob_caso');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('coordenador', u.getUniqueValue());
    c.setValue('estagio', 'conducao');
    c.setValue('score', 72);
    c.setValue('sinal_coercitivo', true);
    c.setValue('sinal_coercitivo_desc', 'Protesto disponível (fictício)');
    var cid = c.insert();
    var k;
    for (k = 0; k < 2; k++) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', pid);
        d.setValue('origem', 'ccf');
        d.setValue('valor', 1000 + k);
        d.insert();
    }
    for (k = 0; k < 3; k++) {
        var i = new GlideRecord('x_2326104_cob_interacao');
        i.initialize();
        i.setValue('caso', cid);
        i.setValue('resultado', 'sem_contato');
        i.setValue('descricao', 'Interação fictícia F5-003');
        i.insert();
    }
    var m = new GlideRecord('x_2326104_cob_comunicacao');
    m.initialize();
    m.setValue('contribuinte', pid);
    m.insert();
    var r = new GlideRecord('x_2326104_cob_regularizacao');
    r.initialize();
    r.setValue('contribuinte', pid);
    r.setValue('caso', cid);
    r.setValue('origem', 'resposta_cobranca');
    r.insert();
    var semDono = new GlideRecord('x_2326104_cob_caso');
    semDono.initialize();
    semDono.setValue('coordenador', u.getUniqueValue());
    semDono.setValue('prioridade', 98765);
    semDono.insert();
    outputs.table = 'x_2326104_cob_caso';
    outputs.record_id = cid;
    return !!cid;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const dono = atf.server.recordQuery({ $id: Now.ID['US-MOD-F5-003_test_02'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F5-003_test_03'], user: dono.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-003_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Dossiê completo', function() {
        it('monta os 3 níveis', function() {
            var c = new GlideRecordSecure('x_2326104_cob_caso');
            c.addQuery('contribuinte.nome', 'Contribuinte fictício dossiê F5-003');
            c.query();
            expect(c.next()).toBe(true);
            var d = new CasoDossie().montar(c.getUniqueValue());
            expect(d.ok).toBe(true);
            expect(d.nivel1.debitos).toBe(2);
            expect(d.nivel1.parcelamentos).toBe(0);
            expect(d.nivel2.comunicacoes).toBe(1);
            expect(d.nivel2.interacoes).toBe(3);
            expect(d.nivel2.regularizacoes).toBe(1);
            expect(parseFloat(d.nivel3.score)).toBe(72);
            expect(d.nivel3.sinalCoercitivo).toBe(true);
            expect(d.nivel3.sinalCoercitivoDesc).toBe('Protesto disponível (fictício)');
        });
        it('caso sem contribuinte não monta dossiê', function() {
            var s = new GlideRecordSecure('x_2326104_cob_caso');
            s.addQuery('prioridade', 98765);
            s.query();
            expect(s.next()).toBe(true);
            expect(new CasoDossie().montar(s.getUniqueValue()).mensagem).toBe('Operação recusada: visão única do contribuinte por documento.');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f5003_dossie_neg = Test({
    $id: Now.ID['US-MOD-F5-003_atf_dossie_outro_atendente_negativo'],
    name: 'RF-MOD-F5-003 — atendente não monta o dossiê do caso qualificado por nenhum caminho',
    description: 'Cria um caso fictício de demo.coordenador, de contribuinte da carteira de demo.atendente; impersonado como demo.atendente (que não tem acesso ao caso qualificado, design UX v1 R6), CasoDossie.montar recusa com «Operação recusada: atendente vê só a própria carteira.» (e sem caso, com «Operação recusada: dossiê em 3 níveis (premissa).»), o caso não é lido, a interação não é gravada e o caso não pode ser encerrado (gravação negada pela ACL de carteira) (RN-NOVO-F5-007 no dossiê, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-003_test_05'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.coordenador');
    var a = new GlideRecord('sys_user');
    a.get('user_name', 'demo.atendente');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício dossiê negado F5-003');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', a.getUniqueValue());
    var c = new GlideRecord('x_2326104_cob_caso');
    c.initialize();
    c.setValue('contribuinte', p.insert());
    c.setValue('coordenador', u.getUniqueValue());
    c.setValue('estagio', 'conducao');
    outputs.table = 'x_2326104_cob_caso';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const outro = atf.server.recordQuery({ $id: Now.ID['US-MOD-F5-003_test_06'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F5-003_test_07'], user: outro.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-003_test_08'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Dossiê negado ao atendente', function() {
        var g = new GlideRecord('x_2326104_cob_caso');
        g.setWorkflow(false); // só para achar o id do caso: a consulta normal do atendente já não o traz
        g.addQuery('contribuinte.nome', 'Contribuinte fictício dossiê negado F5-003');
        g.query();
        g.next();
        var id = g.getUniqueValue();
        it('não monta nem mostra o caso', function() {
            var negado = new CasoDossie().montar(id);
            expect(negado.ok).toBe(false);
            expect(negado.mensagem).toBe('Operação recusada: atendente vê só a própria carteira.');
            expect(new CasoDossie().montar('').mensagem).toBe('Operação recusada: dossiê em 3 níveis (premissa).');
            expect(new GlideRecordSecure('x_2326104_cob_caso').get(id)).toBe(false);
        });
        it('não grava interação nem encerra o caso', function() {
            var n = new GlideRecordSecure('x_2326104_cob_interacao');
            n.initialize();
            n.setValue('caso', id);
            n.setValue('resultado', 'sem_contato');
            n.setValue('descricao', 'Tentativa fictícia');
            expect(!!n.insert()).toBe(false);
            expect(g.canWrite()).toBe(false);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f5003_ui = Test({
    $id: Now.ID['US-MOD-F5-003_atf_ui_dossie_positivo'],
    name: 'RF-MOD-F5-003 — o form do caso abre no dossiê com seções e listas relacionadas',
    description: 'Cria um caso fictício de demo.coordenador e o abre no form como demo.coordenador: a View Rule abre a view «Dossiê do caso», os campos de score, sinalização e encerramento aparecem, a sinalização fica somente leitura (sinaliza, não executa — RN-NOVO-F5-004) e a lista de Interações aparece (RN-NOVO-F5-003, lado positivo da tela).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F5-003_test_09'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.coordenador');
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício tela F5-003');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var c = new GlideRecord('x_2326104_cob_caso');
    c.initialize();
    c.setValue('contribuinte', p.insert());
    c.setValue('coordenador', u.getUniqueValue());
    c.setValue('estagio', 'conducao');
    c.setValue('sinal_coercitivo', true);
    outputs.table = 'x_2326104_cob_caso';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const caso = atf.server.recordQuery({ $id: Now.ID['US-MOD-F5-003_test_15'], table: 'x_2326104_cob_caso', fieldValues: 'contribuinte.nome=Contribuinte fictício tela F5-003', assert: 'records_match_query' })
    const dono = atf.server.recordQuery({ $id: Now.ID['US-MOD-F5-003_test_10'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F5-003_test_11'], user: dono.first_record })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F5-003_test_12'], table: 'x_2326104_cob_caso', recordId: caso.first_record })
    atf.form.fieldStateValidation({
        $id: Now.ID['US-MOD-F5-003_test_13'],
        table: 'x_2326104_cob_caso',
        visible: ['contribuinte', 'score', 'sem_score', 'sinal_coercitivo', 'sinal_coercitivo_desc', 'motivo_encerramento', 'encerrado_em'],
        readOnly: ['sinal_coercitivo', 'sinal_coercitivo_desc'],
    })
    atf.list.relatedListVisibility({ $id: Now.ID['US-MOD-F5-003_test_14'], table: 'x_2326104_cob_caso', visible: ['x_2326104_cob_interacao.caso'] })
})
