// ATF da US-MOD-F4-010 — régua como Flow: modelo, custom actions, validação da etapa, inscrição em controle e
// ACLs de régua e etapa (design ux-cobranca-v2-regua-flow.md, B1–B5, B9 e D17; RN-NOVO-F4-009, F4-010, F4-001, F2-005).
// Massa fictícia criada pelo próprio teste e desfeita pelo rollback do ATF. Régua de teste com codigo = atf_<caso>:
// nenhum gatilho de Flow casa, então inserir inscrição ativa não dispara Flow em background (B9).
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'

// A massa (regua, etapa, contribuinte, inscricao) se repete no começo de cada script: o Fluent não aceita
// função nem variável fora do texto do passo (macro expandida antes do build).

export const t_f4010_modelo = Test({
    $id: Now.ID['US-MOD-F4-010_atf_modelo_positivo'],
    name: 'RF-MOD-F4-010 — inscrição nasce ativa, régua exige código e a propriedade da demo vale 60',
    description: 'Inscrição criada só com contribuinte e régua (atf_modelo) nasce ativa, na etapa 0 e com «Iniciada em»; régua sem código é recusada com «Informe o código da régua.»; régua sem prazo final nasce com 5 dias; código repetido é recusado; x_2326104_cob.regua.segundos_por_dia = 60 (B1, D11; AS-TASK-MOD-F4-010-01-01..03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_01'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    describe('Modelo da régua como Flow', function() {
        var r = regua('atf_modelo');
        var p = contribuinte('A');
        var i = inscricao(p, r, '');
        var semCodigo = new GlideRecord('x_2326104_cob_regua');
        semCodigo.initialize();
        semCodigo.setValue('nome', 'Régua sem código (fictícia)');
        semCodigo.setValue('carteira', 'ipva');
        semCodigo.setValue('prazo_final_dias', 5);
        var idSemCodigo = semCodigo.insert();
        var semPrazo = new GlideRecord('x_2326104_cob_regua');
        semPrazo.initialize();
        semPrazo.setValue('nome', 'Régua sem prazo (fictícia)');
        semPrazo.setValue('codigo', 'atf_sem_prazo');
        semPrazo.setValue('carteira', 'ipva');
        var idSemPrazo = semPrazo.insert();
        var repetida = regua('atf_modelo');
        it('inscrição só com contribuinte e régua nasce ativa, etapa 0, iniciada agora', function() {
            expect(i).toBeTruthy();
            var g = new GlideRecord('x_2326104_cob_regua_inscricao');
            g.get(i);
            expect(g.getValue('status')).toBe('ativa');
            expect(parseInt(g.getValue('etapa_atual') || '0', 10)).toBe(0);
            expect(g.getValue('iniciada_em')).toBeTruthy();
        });
        it('régua sem código é recusada com a mensagem', function() {
            expect(idSemCodigo).toBeFalsy();
            var g = new GlideRecord('x_2326104_cob_regua');
            g.initialize();
            g.setValue('nome', 'x');
            expect(new ReguaMotor().motivoRecusaRegua(g)).toBe('Informe o código da régua.');
        });
        it('régua sem prazo final nasce com 5 dias; código repetido é recusado', function() {
            expect(idSemPrazo).toBeTruthy();
            var g = new GlideRecord('x_2326104_cob_regua');
            g.get(idSemPrazo);
            expect(g.getValue('prazo_final_dias')).toBe('5');
            expect(repetida).toBeFalsy();
        });
        it('segundos_por_dia da demo = 60', function() {
            expect(gs.getProperty('x_2326104_cob.regua.segundos_por_dia')).toBe('60');
            expect(new ReguaMotor().segundosPorDia()).toBe(60);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_flows = Test({
    $id: Now.ID['US-MOD-F4-010_atf_flows_positivo'],
    name: 'RF-MOD-F4-010 — as 5 réguas do seed têm Flow ativo «Régua: <nome>» com uma etapa por stage e «Encaminhamento»',
    description: 'Cada régua do seed (parcelamentos, ipva, itcd, icms_normal, icms_st) aponta para um sys_hub_flow ativo de nome «Régua: <nome>» e internal_name regua_<codigo>; o Flow tem um stage «Etapa k» por etapa da régua mais «Encaminhamento»; não sobra régua aleatória do seed antigo (G5; AC-RF-MOD-F4-010-01).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_02'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Réguas e Flows do seed', function() {
        var codigos = ['parcelamentos', 'ipva', 'itcd', 'icms_normal', 'icms_st'];
        it('5 réguas, uma por código, sem régua sem código', function() {
            var r = new GlideRecord('x_2326104_cob_regua');
            r.addEncodedQuery('codigoNOT LIKEatf_^ORcodigoISEMPTY');
            r.query();
            expect(r.getRowCount()).toBe(5);
        });
        it('cada régua aponta para o Flow ativo «Régua: <nome>» com os stages das etapas', function() {
            for (var k = 0; k < codigos.length; k++) {
                var r = new GlideRecord('x_2326104_cob_regua');
                expect(r.get('codigo', codigos[k])).toBe(true);
                var f = new GlideRecord('sys_hub_flow');
                expect(f.get(r.getValue('flow'))).toBe(true);
                expect(f.getValue('name')).toBe('Régua: ' + r.getValue('nome'));
                expect(f.getValue('internal_name')).toBe('regua_' + codigos[k]);
                expect(f.getValue('active')).toBe('1');
                var e = new GlideAggregate('x_2326104_cob_regua_etapa');
                e.addQuery('regua', r.getUniqueValue());
                e.addAggregate('COUNT');
                e.query();
                e.next();
                var etapas = parseInt(e.getAggregate('COUNT'), 10);
                expect(etapas >= 3 && etapas <= 4).toBe(true);
                var s = new GlideRecord('sys_hub_flow_stage');
                s.addQuery('flow', f.getUniqueValue());
                s.query();
                var rotulos = [];
                while (s.next()) { rotulos.push(s.getValue('label')); }
                expect(rotulos.length).toBe(etapas + 1);
                expect(rotulos.indexOf('Encaminhamento') >= 0).toBe(true);
                expect(rotulos.indexOf('Etapa ' + etapas) >= 0).toBe(true);
            }
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_etapa_pos = Test({
    $id: Now.ID['US-MOD-F4-010_atf_etapa_positivo'],
    name: 'RF-MOD-F4-010 — etapa válida grava (postura sobe um nível, dia depois do anterior, e-mail sem valor)',
    description: 'Régua atf_etapa com a etapa 1 (dia 0, SNE, utilitária, intensificar); a etapa 2 (dia 10, e-mail, consciente, encaminhar_ativa, «Há uma mensagem para você no DT-e.») grava e a régua fica com 2 etapas (D17; AS-TASK-MOD-F4-010-04-01).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_03'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    describe('validarEtapa — caso válido', function() {
        var r = regua('atf_etapa');
        etapa(r, 1, 0, 'sne', 'utilitaria', 'intensificar');
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setValue('regua', r);
        e.setValue('ordem', 2);
        e.setValue('offset_dias', 10);
        e.setValue('canal', 'email');
        e.setValue('postura', 'consciente');
        e.setValue('acao_sem_resposta', 'encaminhar_ativa');
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        var id = e.insert();
        it('grava a etapa 2', function() {
            expect(id).toBeTruthy();
            var n = new GlideRecord('x_2326104_cob_regua_etapa');
            n.addQuery('regua', r);
            n.query();
            expect(n.getRowCount()).toBe(2);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_etapa_neg = Test({
    $id: Now.ID['US-MOD-F4-010_atf_etapa_negativo'],
    name: 'RF-MOD-F4-010 — etapa com salto ou regressão de postura, dia fora de ordem, encaminhar fora da última, última sem encaminhar ou valor em SMS é recusada',
    description: 'Cada gravação inválida é recusada pela business rule (nada gravado) e o ReguaMotor devolve a mensagem exata: postura («…não pode regredir nem saltar nível…»), dia («…precisa vir depois do dia da etapa anterior.»), encaminhar («…só a última etapa encaminha, e ela precisa encaminhar.») e sigilo («…não pode trazer valor nem tributo…») (D17; AS-TASK-MOD-F4-010-04-02..04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    var MSG_POSTURA = 'Operação recusada: a postura não pode regredir nem saltar nível em relação à etapa anterior.';
    var MSG_DIA = 'Operação recusada: o dia precisa vir depois do dia da etapa anterior.';
    var MSG_ENC = 'Operação recusada: só a última etapa encaminha, e ela precisa encaminhar.';
    var MSG_SIGILO = 'Operação recusada: texto de e-mail, SMS ou WhatsApp não pode trazer valor nem tributo (só ciência do DT-e).';
    function nova(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e;
    }
    function contar(reguaId) {
        var n = new GlideRecord('x_2326104_cob_regua_etapa');
        n.addQuery('regua', reguaId);
        n.query();
        return n.getRowCount();
    }
    describe('validarEtapa — recusas', function() {
        var motor = new ReguaMotor();
        // salto: utilitária -> ameaçadora
        var r1 = regua('atf_etapa_salto');
        etapa(r1, 1, 0, 'sne', 'utilitaria', 'intensificar');
        var salto = nova(r1, 2, 10, 'sne', 'ameacadora', 'encaminhar_ativa', 'Aviso no DT-e.');
        var msgSalto = motor.motivoRecusaEtapa(salto);
        var idSalto = salto.insert();
        // regressão, dia e encaminhar: régua com 1 (dia 0, consciente) e 2 (dia 10, explicativa, encaminhar_ativa)
        var r2 = regua('atf_etapa_seq');
        etapa(r2, 1, 0, 'sne', 'consciente', 'intensificar');
        var e2 = etapa(r2, 2, 10, 'sne', 'explicativa', 'encaminhar_ativa');
        var g = new GlideRecord('x_2326104_cob_regua_etapa');
        g.get(e2);
        g.setValue('postura', 'utilitaria');
        var msgRegride = motor.motivoRecusaEtapa(g);
        var okRegride = g.update();
        var g2 = new GlideRecord('x_2326104_cob_regua_etapa');
        g2.get(e2);
        g2.setValue('offset_dias', 0);
        var msgDia = motor.motivoRecusaEtapa(g2);
        var okDia = g2.update();
        var antes = nova(r2, 1, 0, 'sne', 'consciente', 'encaminhar_ativa');
        var msgEncFora = motor.motivoRecusaEtapa(antes);
        var idEncFora = antes.insert();
        var g3 = new GlideRecord('x_2326104_cob_regua_etapa');
        g3.get(e2);
        g3.setValue('acao_sem_resposta', 'intensificar');
        var msgSemEnc = motor.motivoRecusaEtapa(g3);
        var okSemEnc = g3.update();
        // sigilo: SMS com «Pague R$ 500»
        var r3 = regua('atf_etapa_sigilo');
        etapa(r3, 1, 0, 'sne', 'utilitaria', 'intensificar');
        var sms = nova(r3, 2, 10, 'sms', 'consciente', 'encaminhar_ativa', 'Pague R$ 500');
        var msgSigilo = motor.motivoRecusaEtapa(sms);
        var idSigilo = sms.insert();
        it('salto de postura recusado', function() {
            expect(msgSalto).toBe(MSG_POSTURA);
            expect(idSalto).toBeFalsy();
            expect(contar(r1)).toBe(1);
        });
        it('regressão de postura recusada', function() {
            expect(msgRegride).toBe(MSG_POSTURA);
            expect(okRegride).toBeFalsy();
        });
        it('dia fora de ordem recusado', function() {
            expect(msgDia).toBe(MSG_DIA);
            expect(okDia).toBeFalsy();
        });
        it('encaminhar fora da última e última sem encaminhar recusados', function() {
            expect(msgEncFora).toBe(MSG_ENC);
            expect(idEncFora).toBeFalsy();
            expect(msgSemEnc).toBe(MSG_ENC);
            expect(okSemEnc).toBeFalsy();
            var lida = new GlideRecord('x_2326104_cob_regua_etapa');
            lida.get(e2);
            expect(lida.getValue('postura')).toBe('explicativa');
            expect(lida.getValue('offset_dias')).toBe('10');
            expect(lida.getValue('acao_sem_resposta')).toBe('encaminhar_ativa');
            expect(contar(r2)).toBe(2);
        });
        it('valor em SMS recusado', function() {
            expect(msgSigilo).toBe(MSG_SIGILO);
            expect(idSigilo).toBeFalsy();
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_controle = Test({
    $id: Now.ID['US-MOD-F4-010_atf_inscricao_controle_negativo'],
    name: 'RF-MOD-F4-010 — inscrição de contribuinte do grupo de controle é recusada; da massificada grava',
    description: 'Ciclo fictício publicado com C no grupo de controle e A na massificada; inserir inscrição de C na régua atf_controle é recusado (mensagem do grupo de controle) e a de A grava (RN-NOVO-F2-005; AS-TASK-MOD-F4-010-04-05; AC-RF-MOD-F4-010-04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_05'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    describe('Inscrição e grupo de controle', function() {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.initialize();
        ci.setValue('nome', 'ATF ciclo F4-010 controle (fictício)');
        ci.setValue('estado', 'publicado');
        var ciclo = ci.insert();
        var a = contribuinte('A massificada');
        var c = contribuinte('C controle');
        var seg = [[a, 'massificada'], [c, 'controle']];
        for (var k = 0; k < seg.length; k++) {
            var s = new GlideRecord('x_2326104_cob_segmentacao');
            s.initialize();
            s.setValue('ciclo', ciclo);
            s.setValue('contribuinte', seg[k][0]);
            s.setValue('segmento', seg[k][1]);
            s.insert();
        }
        var r = regua('atf_controle');
        var iC = inscricao(c, r, ciclo);
        var iA = inscricao(a, r, ciclo);
        it('C (controle) é recusado', function() {
            expect(iC).toBeFalsy();
            var g = new GlideRecord('x_2326104_cob_regua_inscricao');
            g.initialize();
            g.setValue('contribuinte', c);
            g.setValue('ciclo', ciclo);
            expect(new QualificacaoCiclo().motivoRecusaAcao(g)).toBe(QualificacaoCiclo.MSG_EM_CONTROLE);
        });
        it('A (massificada) grava', function() {
            expect(iA).toBeTruthy();
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_fumaca = Test({
    $id: Now.ID['US-MOD-F4-010_atf_fumaca_flowapi_positivo'],
    name: 'RF-MOD-F4-010 — fumaça das custom actions pelo FlowAPI: agendar etapa, fecho, inscrição encerrada e reference por sys_id',
    description: 'Régua atf_fumaca (etapas nos dias 0 e 10, prazo final 5) e inscrição ativa: action x_2326104_cob.regua_agendar_etapa com o GlideRecord e ordem 1 devolve segue = true e executar_em = iniciada_em, e grava etapa_atual 1 e proxima_etapa_em; ordem 3 (fecho) devolve iniciada_em + 900 s sem mudar etapa_atual; inscrição encerrada devolve segue = false sem gravar; passar o sys_id dá «Invalid GlideRecord input format found»; as outras 3 actions respondem pelo contrato (B3; AS-TASK-MOD-F4-010-03-01..04).',
    failOnServerError: false,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    function acao(nome, entradas) {
        return sn_fd.FlowAPI.getRunner().action('x_2326104_cob.' + nome).inForeground().withInputs(entradas).run().getOutputs();
    }
    describe('Custom actions da régua pelo FlowAPI', function() {
        var r = regua('atf_fumaca', 5);
        etapa(r, 1, 0, 'sne', 'utilitaria', 'intensificar');
        etapa(r, 2, 10, 'email', 'consciente', 'encaminhar_ativa');
        var p = contribuinte('fumaça');
        var id = inscricao(p, r, '');
        var gr = new GlideRecord('x_2326104_cob_regua_inscricao');
        gr.get(id);
        var iniciada = new GlideDateTime(gr.getValue('iniciada_em'));
        var o1 = acao('regua_agendar_etapa', { inscricao: gr, ordem: 1 });
        var depois1 = new GlideRecord('x_2326104_cob_regua_inscricao');
        depois1.get(id);
        var oF = acao('regua_agendar_etapa', { inscricao: gr, ordem: 3 });
        var depoisF = new GlideRecord('x_2326104_cob_regua_inscricao');
        depoisF.get(id);
        var oG = acao('regua_checar_guardas', { inscricao: gr });
        var oE = acao('regua_enviar_comunicacao', { inscricao: gr, ordem: 1 });
        var erroSysId = '';
        try {
            acao('regua_agendar_etapa', { inscricao: id, ordem: 1 });
        } catch (e) {
            erroSysId = String(e.message || e);
        }
        var fechada = new GlideRecord('x_2326104_cob_regua_inscricao');
        fechada.get(id);
        fechada.setValue('status', 'encerrada');
        fechada.setValue('motivo_encerramento', 'regularizado');
        fechada.update();
        var proxAntes = fechada.getValue('proxima_etapa_em');
        var oX = acao('regua_agendar_etapa', { inscricao: fechada, ordem: 2 });
        var depoisX = new GlideRecord('x_2326104_cob_regua_inscricao');
        depoisX.get(id);
        it('ordem 1: segue, executar_em = iniciada_em, grava etapa 1 e próxima etapa', function() {
            expect(String(o1.segue)).toBe('true');
            expect(o1.executar_em).toBeTruthy();
            expect(depois1.getValue('etapa_atual')).toBe('1');
            expect(depois1.getValue('proxima_etapa_em')).toBe(iniciada.getValue());
        });
        it('fecho (ordem 3): iniciada_em + (10 + 5) × 60 s, etapa_atual não muda', function() {
            expect(String(oF.segue)).toBe('true');
            var alvo = new GlideDateTime(iniciada.getValue());
            alvo.addSeconds(900);
            expect(depoisF.getValue('proxima_etapa_em')).toBe(alvo.getValue());
            expect(depoisF.getValue('etapa_atual')).toBe('1');
        });
        it('guardas e envio respondem pelo contrato', function() {
            expect(String(oG.segue)).toBe('true');
            expect(oE.status !== undefined).toBe(true);
        });
        it('reference por sys_id é recusada pelo FlowAPI', function() {
            expect(erroSysId.indexOf('Invalid GlideRecord input format found') >= 0).toBe(true);
        });
        it('inscrição encerrada: segue = false e nada gravado', function() {
            expect(String(oX.segue)).toBe('false');
            expect(depoisX.getValue('etapa_atual')).toBe('1');
            expect(depoisX.getValue('proxima_etapa_em')).toBe(proxAntes);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_acl_coord = Test({
    $id: Now.ID['US-MOD-F4-010_atf_acl_coordenador_positivo'],
    name: 'RF-MOD-F4-010 — coordenador grava texto, canal, dia e postura da etapa; não troca código da régua nem ordem da etapa',
    description: 'Régua atf_acl com 2 etapas criada pelo teste; impersonado como demo.coordenador, por GlideRecordSecure: o template da etapa 2 grava; codigo da régua e ordem da etapa não podem ser gravados (canWrite false e valor inalterado) (B5; AS-TASK-MOD-F4-010-05-01..02; AC-RF-MOD-F4-010-03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['US-MOD-F4-010_test_07'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    var r = regua('atf_acl');
    etapa(r, 1, 0, 'sne', 'utilitaria', 'intensificar');
    etapa(r, 2, 10, 'email', 'consciente', 'encaminhar_ativa');
    return !!r;
})(outputs, steps, params, stepResult, assertEqual);` })
    const coord = atf.server.recordQuery({ $id: Now.ID['US-MOD-F4-010_test_08'], table: 'sys_user', fieldValues: 'user_name=demo.coordenador', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F4-010_test_09'], user: coord.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_10'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('ACL de régua e etapa — coordenador', function() {
        var r = new GlideRecordSecure('x_2326104_cob_regua');
        r.get('codigo', 'atf_acl');
        var e = new GlideRecordSecure('x_2326104_cob_regua_etapa');
        e.addQuery('regua', r.getUniqueValue());
        e.addQuery('ordem', 2);
        e.query();
        e.next();
        var podeTexto = e.template.canWrite();
        var podeOrdem = e.ordem.canWrite();
        e.setValue('template', 'Nova mensagem de ciência no DT-e.');
        e.setValue('ordem', 7);
        e.update();
        var podeCodigo = r.codigo.canWrite();
        var podeCarteira = r.carteira.canWrite();
        var podeFlow = r.flow.canWrite();
        var podeAtiva = r.ativa.canWrite();
        r.setValue('codigo', 'outro');
        r.update();
        it('grava o texto da etapa e os parâmetros da régua', function() {
            expect(podeTexto).toBe(true);
            expect(podeAtiva).toBe(true);
            var lida = new GlideRecord('x_2326104_cob_regua_etapa');
            lida.get(e.getUniqueValue());
            expect(lida.getValue('template')).toBe('Nova mensagem de ciência no DT-e.');
        });
        it('não grava código, carteira e Flow da régua nem ordem da etapa', function() {
            expect(podeOrdem).toBe(false);
            expect(podeCodigo).toBe(false);
            expect(podeCarteira).toBe(false);
            expect(podeFlow).toBe(false);
            var lidaE = new GlideRecord('x_2326104_cob_regua_etapa');
            lidaE.get(e.getUniqueValue());
            expect(lidaE.getValue('ordem')).toBe('2');
            var lidaR = new GlideRecord('x_2326104_cob_regua');
            lidaR.get(r.getUniqueValue());
            expect(lidaR.getValue('codigo')).toBe('atf_acl');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4010_acl_atendente = Test({
    $id: Now.ID['US-MOD-F4-010_atf_acl_atendente_negativo'],
    name: 'RF-MOD-F4-010 — atendente não grava régua nem etapa',
    description: 'Régua atf_acl criada pelo teste; impersonado como demo.atendente, por GlideRecordSecure: a régua não pode ser gravada (canWrite false) e «Ativa» continua true depois do update (B5; AS-TASK-MOD-F4-010-05-03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({ $id: Now.ID['US-MOD-F4-010_test_11'], script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function regua(codigo, prazo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', prazo === undefined ? 5 : prazo);
        return r.insert();
    }
    function etapa(reguaId, ordem, dia, canal, postura, acao, texto) {
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', reguaId);
        e.setValue('ordem', ordem);
        e.setValue('offset_dias', dia);
        e.setValue('canal', canal);
        e.setValue('postura', postura);
        e.setValue('acao_sem_resposta', acao);
        e.setValue('template', texto || 'Há uma mensagem para você no DT-e.');
        return e.insert();
    }
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-010 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function inscricao(contribuinteId, reguaId, cicloId) {
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', contribuinteId);
        i.setValue('regua', reguaId);
        if (cicloId) { i.setValue('ciclo', cicloId); }
        return i.insert();
    }
    var r = regua('atf_acl_atendente');
    etapa(r, 1, 0, 'sne', 'utilitaria', 'encaminhar_ativa');
    return !!r;
})(outputs, steps, params, stepResult, assertEqual);` })
    const atend = atf.server.recordQuery({ $id: Now.ID['US-MOD-F4-010_test_12'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F4-010_test_13'], user: atend.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-010_test_14'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('ACL de régua — atendente', function() {
        var r = new GlideRecordSecure('x_2326104_cob_regua');
        r.get('codigo', 'atf_acl_atendente');
        var pode = r.canWrite();
        var e = new GlideRecordSecure('x_2326104_cob_regua_etapa');
        e.addQuery('regua', r.getUniqueValue());
        e.query();
        e.next();
        var podeEtapa = e.canWrite();
        r.setValue('ativa', false);
        r.update();
        it('régua e etapa sem gravação para o atendente', function() {
            expect(pode).toBe(false);
            expect(podeEtapa).toBe(false);
            var lida = new GlideRecord('x_2326104_cob_regua');
            lida.get(r.getUniqueValue());
            expect(lida.getValue('ativa')).toBe('1');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
