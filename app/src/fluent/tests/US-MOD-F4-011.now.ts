// ATF da US-MOD-F4-011 — guardas e envio simulado com fallback, opt-in, opt-out, teto e idempotência
// (design ux-cobranca-v2-regua-flow.md, B3, B9, D18 e D19; RN-NOVO-F4-011, F1-002, F4-012, F4-003).
// Massa fictícia criada pelo próprio teste e desfeita pelo rollback do ATF. Régua de teste com codigo = atf_<caso>:
// nenhum gatilho de Flow casa. Os canais simulados são reconfigurados pelo teste (rollback desfaz).
// A massa se repete no começo de cada script: o Fluent não aceita função nem variável fora do texto do passo
// (macro expandida antes do build).
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'


export const t_f4011_guardas_pos = Test({
    $id: Now.ID['US-MOD-F4-011_atf_guardas_positivo'],
    name: 'RF-MOD-F4-011 — guardas: caso limpo segue',
    description: 'Régua atf_guardas ativa (IPVA); contribuinte A com débito de IPVA em aberto, fora do controle do ciclo publicado: checarGuardas devolve segue = true e motivo vazio, e a inscrição continua ativa (RN-NOVO-F4-011; AS-TASK-MOD-F4-011-01-01).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-011_test_01'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
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
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-011 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function debito(contribuinteId, tributo, status) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', 1250);
        return d.insert();
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
    function canais(cfg) {
        var nomes = ['sne', 'email', 'sms', 'whatsapp'];
        for (var k = 0; k < nomes.length; k++) {
            var c = cfg[nomes[k]] || {};
            var g = new GlideRecord('x_2326104_cob_canal_sim');
            g.addQuery('canal', nomes[k]);
            g.query();
            var achou = false;
            while (g.next()) {
                achou = true;
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.update();
            }
            if (!achou) {
                g.initialize();
                g.setValue('canal', nomes[k]);
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.insert();
            }
        }
    }
    function consentir(contribuinteId, canal, situacao) {
        var c = new GlideRecord('x_2326104_cob_consentimento');
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('canal', canal);
        c.setValue('situacao', situacao);
        c.setValue('registrado_em', new GlideDateTime().getValue());
        c.setValue('origem', 'ATF (fictício)');
        return c.insert();
    }
    function envios(comunicacaoId) {
        var e = new GlideRecord('x_2326104_cob_envio_sim');
        e.addQuery('comunicacao', comunicacaoId);
        e.orderBy('sys_created_on');
        e.query();
        var lista = [];
        while (e.next()) { lista.push(e.getValue('canal') + ':' + e.getValue('status_retorno')); }
        return lista;
    }
    function lerInscricao(id) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.get(id);
        return g;
    }
    function lerComunicacao(id) {
        var g = new GlideRecord('x_2326104_cob_comunicacao');
        g.get(id);
        return g;
    }
    describe('checarGuardas — caso limpo', function() {
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.initialize();
        ci.setValue('nome', 'ATF ciclo F4-011 guardas pos (fictício)');
        ci.setValue('estado', 'publicado');
        var ciclo = ci.insert();
        var a = contribuinte('A');
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', a);
        s.setValue('segmento', 'massificada');
        s.insert();
        debito(a, 'ipva', 'aberto');
        var r = regua('atf_guardas');
        var i = inscricao(a, r, ciclo, '');
        var res = new ReguaMotor().checarGuardas(i);
        it('segue = true, motivo vazio, inscrição ativa', function() {
            expect(res.segue).toBe(true);
            expect(res.motivo).toBe('');
            expect(lerInscricao(i).getValue('status')).toBe('ativa');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4011_guardas_neg = Test({
    $id: Now.ID['US-MOD-F4-011_atf_guardas_negativo'],
    name: 'RF-MOD-F4-011 — guardas: controle, régua pausada, regularizado, parcelamento quitado e rompido param e encerram a inscrição',
    description: 'Cada inscrição ativa com motivo de parada devolve segue = false com o motivo e fica «Encerrada» com encerrada_em e o motivo: controle (contribuinte no grupo de controle do ciclo, inscrito por script com a BR desligada), regua_pausada (régua com ativa = false), regularizado (IPVA sem débito em aberto), regularizado (parcelamento quitado), parcelamento_rompido (parcelamento rompido); a comunicação «agendada» da inscrição vira «encerrada» (RN-NOVO-F4-011, RN-NOVO-F1-002; AS-TASK-MOD-F4-011-01-02..03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-011_test_02'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
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
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-011 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function debito(contribuinteId, tributo, status) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', 1250);
        return d.insert();
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
    function canais(cfg) {
        var nomes = ['sne', 'email', 'sms', 'whatsapp'];
        for (var k = 0; k < nomes.length; k++) {
            var c = cfg[nomes[k]] || {};
            var g = new GlideRecord('x_2326104_cob_canal_sim');
            g.addQuery('canal', nomes[k]);
            g.query();
            var achou = false;
            while (g.next()) {
                achou = true;
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.update();
            }
            if (!achou) {
                g.initialize();
                g.setValue('canal', nomes[k]);
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.insert();
            }
        }
    }
    function consentir(contribuinteId, canal, situacao) {
        var c = new GlideRecord('x_2326104_cob_consentimento');
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('canal', canal);
        c.setValue('situacao', situacao);
        c.setValue('registrado_em', new GlideDateTime().getValue());
        c.setValue('origem', 'ATF (fictício)');
        return c.insert();
    }
    function envios(comunicacaoId) {
        var e = new GlideRecord('x_2326104_cob_envio_sim');
        e.addQuery('comunicacao', comunicacaoId);
        e.orderBy('sys_created_on');
        e.query();
        var lista = [];
        while (e.next()) { lista.push(e.getValue('canal') + ':' + e.getValue('status_retorno')); }
        return lista;
    }
    function lerInscricao(id) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.get(id);
        return g;
    }
    function lerComunicacao(id) {
        var g = new GlideRecord('x_2326104_cob_comunicacao');
        g.get(id);
        return g;
    }
    function parcelamento(contribuinteId, status) {
        var p = new GlideRecord('x_2326104_cob_parcelamento');
        p.initialize();
        p.setValue('contribuinte', contribuinteId);
        p.setValue('tributo', 'icms_normal');
        p.setValue('status', status);
        return p.insert();
    }
    describe('checarGuardas — paradas', function() {
        var motor = new ReguaMotor();
        var ci = new GlideRecord('x_2326104_cob_ciclo');
        ci.initialize();
        ci.setValue('nome', 'ATF ciclo F4-011 guardas neg (fictício)');
        ci.setValue('estado', 'publicado');
        var ciclo = ci.insert();
        var c = contribuinte('C controle');
        var s = new GlideRecord('x_2326104_cob_segmentacao');
        s.initialize();
        s.setValue('ciclo', ciclo);
        s.setValue('contribuinte', c);
        s.setValue('segmento', 'controle');
        s.insert();
        debito(c, 'ipva', 'aberto');
        var rIpva = regua('atf_guardas_neg');
        var iControle = inscricao(c, rIpva, ciclo, '');
        var com = new GlideRecord('x_2326104_cob_comunicacao');
        com.initialize();
        com.setWorkflow(false);
        com.setValue('contribuinte', c);
        com.setValue('inscricao', iControle);
        com.setValue('status', 'agendada');
        var comAgendada = com.insert();
        var p = contribuinte('P pausada');
        debito(p, 'ipva', 'aberto');
        var rPausada = regua('atf_guardas_pausada', 'ipva', false);
        var iPausada = inscricao(p, rPausada, '', '');
        var q = contribuinte('Q sem débito');
        debito(q, 'ipva', 'regularizado');
        debito(q, 'itcd', 'aberto');
        var iReg = inscricao(q, rIpva, '', '');
        var rParc = regua('atf_guardas_parc', 'parcelamentos');
        var x = contribuinte('X quitado');
        var iQuitado = inscricao(x, rParc, '', parcelamento(x, 'quitado'));
        var y = contribuinte('Y rompido');
        var iRompido = inscricao(y, rParc, '', parcelamento(y, 'rompido'));
        var z = contribuinte('Z em risco');
        var iRisco = inscricao(z, rParc, '', parcelamento(z, 'em_risco'));
        var res = {
            controle: motor.checarGuardas(iControle), pausada: motor.checarGuardas(iPausada),
            regularizado: motor.checarGuardas(iReg), quitado: motor.checarGuardas(iQuitado),
            rompido: motor.checarGuardas(iRompido), risco: motor.checarGuardas(iRisco)
        };
        function confere(r, id, motivo) {
            expect(r.segue).toBe(false);
            expect(r.motivo).toBe(motivo);
            var g = lerInscricao(id);
            expect(g.getValue('status')).toBe('encerrada');
            expect(g.getValue('motivo_encerramento')).toBe(motivo);
            expect(g.getValue('encerrada_em')).toBeTruthy();
        }
        it('controle para e encerra; a comunicação agendada vira encerrada', function() {
            confere(res.controle, iControle, 'controle');
            expect(lerComunicacao(comAgendada).getValue('status')).toBe('encerrada');
        });
        it('régua pausada para', function() { confere(res.pausada, iPausada, 'regua_pausada'); });
        it('sem débito em aberto do tributo da carteira: regularizado', function() { confere(res.regularizado, iReg, 'regularizado'); });
        it('parcelamento quitado: regularizado; rompido: parcelamento_rompido', function() {
            confere(res.quitado, iQuitado, 'regularizado');
            confere(res.rompido, iRompido, 'parcelamento_rompido');
        });
        it('parcelamento em risco segue', function() {
            expect(res.risco.segue).toBe(true);
            expect(lerInscricao(iRisco).getValue('status')).toBe('ativa');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4011_guardas_encerrada = Test({
    $id: Now.ID['US-MOD-F4-011_atf_guardas_encerrada'],
    name: 'RF-MOD-F4-011 — guardas: inscrição já encerrada só termina, sem regravar',
    description: 'Inscrição com status encerrada e motivo encaminhada_ativa: checarGuardas devolve segue = false com motivo vazio; motivo e encerrada_em ficam como estavam (RN-NOVO-F4-011; AS-TASK-MOD-F4-011-01-04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-011_test_03'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
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
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-011 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function debito(contribuinteId, tributo, status) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', 1250);
        return d.insert();
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
    function canais(cfg) {
        var nomes = ['sne', 'email', 'sms', 'whatsapp'];
        for (var k = 0; k < nomes.length; k++) {
            var c = cfg[nomes[k]] || {};
            var g = new GlideRecord('x_2326104_cob_canal_sim');
            g.addQuery('canal', nomes[k]);
            g.query();
            var achou = false;
            while (g.next()) {
                achou = true;
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.update();
            }
            if (!achou) {
                g.initialize();
                g.setValue('canal', nomes[k]);
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.insert();
            }
        }
    }
    function consentir(contribuinteId, canal, situacao) {
        var c = new GlideRecord('x_2326104_cob_consentimento');
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('canal', canal);
        c.setValue('situacao', situacao);
        c.setValue('registrado_em', new GlideDateTime().getValue());
        c.setValue('origem', 'ATF (fictício)');
        return c.insert();
    }
    function envios(comunicacaoId) {
        var e = new GlideRecord('x_2326104_cob_envio_sim');
        e.addQuery('comunicacao', comunicacaoId);
        e.orderBy('sys_created_on');
        e.query();
        var lista = [];
        while (e.next()) { lista.push(e.getValue('canal') + ':' + e.getValue('status_retorno')); }
        return lista;
    }
    function lerInscricao(id) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.get(id);
        return g;
    }
    function lerComunicacao(id) {
        var g = new GlideRecord('x_2326104_cob_comunicacao');
        g.get(id);
        return g;
    }
    describe('checarGuardas — inscrição encerrada', function() {
        var a = contribuinte('E encerrada');
        var r = regua('atf_guardas_enc');
        var i = inscricao(a, r, '', '');
        var g = lerInscricao(i);
        g.setValue('status', 'encerrada');
        g.setValue('motivo_encerramento', 'encaminhada_ativa');
        g.setValue('encerrada_em', '2026-01-02 03:04:05');
        g.update();
        var res = new ReguaMotor().checarGuardas(i);
        it('segue = false, motivo e encerrada_em inalterados', function() {
            expect(res.segue).toBe(false);
            expect(res.motivo).toBe('');
            var l = lerInscricao(i);
            expect(l.getValue('motivo_encerramento')).toBe('encaminhada_ativa');
            expect(l.getValue('encerrada_em')).toBe('2026-01-02 03:04:05');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4011_envio = Test({
    $id: Now.ID['US-MOD-F4-011_atf_envio_fallback'],
    name: 'RF-MOD-F4-011 — envio: WhatsApp sem opt-in cai para SNE, SNE com falha vai para e-mail, tudo falha dá Falha, opt-out de SMS não sai por SMS',
    description: 'Canais simulados reconfigurados pelo teste (WhatsApp exige opt-in). (1) etapa WhatsApp sem consentimento → Entregue por SNE, motivo «WhatsApp: sem opt-in», 1 retorno de envio; (2) SNE com forcar_falha → Entregue por e-mail, 2 retornos (sne falha, email entregue); (3) SNE, e-mail e SMS com falha → Falha, 3 tentativas; (4) contribuinte B com opt-out de SMS e etapa SMS → canal final SNE, motivo «SMS: opt-out», nenhum retorno de SMS. Uma comunicação por etapa, com inscrição, régua, etapa e contribuinte (RN-NOVO-F4-012, RN-NOVO-F4-003; AS-TASK-MOD-F4-011-02-01..04).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-011_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
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
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-011 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function debito(contribuinteId, tributo, status) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', 1250);
        return d.insert();
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
    function canais(cfg) {
        var nomes = ['sne', 'email', 'sms', 'whatsapp'];
        for (var k = 0; k < nomes.length; k++) {
            var c = cfg[nomes[k]] || {};
            var g = new GlideRecord('x_2326104_cob_canal_sim');
            g.addQuery('canal', nomes[k]);
            g.query();
            var achou = false;
            while (g.next()) {
                achou = true;
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.update();
            }
            if (!achou) {
                g.initialize();
                g.setValue('canal', nomes[k]);
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.insert();
            }
        }
    }
    function consentir(contribuinteId, canal, situacao) {
        var c = new GlideRecord('x_2326104_cob_consentimento');
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('canal', canal);
        c.setValue('situacao', situacao);
        c.setValue('registrado_em', new GlideDateTime().getValue());
        c.setValue('origem', 'ATF (fictício)');
        return c.insert();
    }
    function envios(comunicacaoId) {
        var e = new GlideRecord('x_2326104_cob_envio_sim');
        e.addQuery('comunicacao', comunicacaoId);
        e.orderBy('sys_created_on');
        e.query();
        var lista = [];
        while (e.next()) { lista.push(e.getValue('canal') + ':' + e.getValue('status_retorno')); }
        return lista;
    }
    function lerInscricao(id) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.get(id);
        return g;
    }
    function lerComunicacao(id) {
        var g = new GlideRecord('x_2326104_cob_comunicacao');
        g.get(id);
        return g;
    }
    describe('enviar — fallback, opt-in e opt-out', function() {
        var motor = new ReguaMotor();
        // (1) WhatsApp exige opt-in e o contribuinte não tem consentimento de WhatsApp
        canais({ whatsapp: { exige: true } });
        var r1 = regua('atf_envio_wpp');
        etapa(r1, 1, 0, 'whatsapp', 'utilitaria', 'encaminhar_ativa');
        var a1 = contribuinte('W sem opt-in');
        var i1 = inscricao(a1, r1, '', '');
        var e1 = motor.enviar(i1, 1);
        var c1 = lerComunicacao(e1.comunicacao);
        var env1 = envios(e1.comunicacao);
        // (2) SNE com falha forçada
        canais({ sne: { falha: true }, whatsapp: { exige: true } });
        var r2 = regua('atf_envio_falha');
        etapa(r2, 1, 0, 'sne', 'utilitaria', 'encaminhar_ativa');
        var a2 = contribuinte('F opt-in em tudo');
        consentir(a2, 'sne', 'opt_in');
        consentir(a2, 'email', 'opt_in');
        consentir(a2, 'sms', 'opt_in');
        var i2 = inscricao(a2, r2, '', '');
        var e2 = motor.enviar(i2, 1);
        var env2 = envios(e2.comunicacao);
        // (3) tudo com falha
        canais({ sne: { falha: true }, email: { falha: true }, sms: { falha: true }, whatsapp: { exige: true } });
        var a3 = contribuinte('T tudo falha');
        var i3 = inscricao(a3, r2, '', '');
        var e3 = motor.enviar(i3, 1);
        var c3 = lerComunicacao(e3.comunicacao);
        // (4) opt-out de SMS
        canais({ whatsapp: { exige: true } });
        var r4 = regua('atf_envio_sms');
        etapa(r4, 1, 0, 'sms', 'utilitaria', 'encaminhar_ativa');
        var b = contribuinte('B opt-out SMS');
        consentir(b, 'sne', 'opt_in');
        consentir(b, 'sms', 'opt_out');
        var i4 = inscricao(b, r4, '', '');
        var e4 = motor.enviar(i4, 1);
        var c4 = lerComunicacao(e4.comunicacao);
        var env4 = envios(e4.comunicacao);
        it('WhatsApp sem opt-in: entregue por SNE, motivo «WhatsApp: sem opt-in», 1 retorno', function() {
            expect(e1.status).toBe('entregue');
            expect(e1.canal).toBe('sne');
            expect(c1.getValue('motivo')).toBe('WhatsApp: sem opt-in');
            expect(env1.join(',')).toBe('sne:entregue');
            expect(c1.getValue('tentativas')).toBe('1');
            expect(c1.getValue('inscricao')).toBe(i1);
            expect(c1.getValue('regua')).toBe(r1);
            expect(c1.getValue('contribuinte')).toBe(a1);
            expect(c1.getValue('etapa')).toBeTruthy();
            expect(c1.getValue('enviada_em')).toBeTruthy();
        });
        it('SNE com falha forçada: entregue por e-mail, 2 retornos', function() {
            expect(e2.status).toBe('entregue');
            expect(e2.canal).toBe('email');
            expect(env2.join(',')).toBe('sne:falha,email:entregue');
        });
        it('tudo falha: Falha com 3 tentativas', function() {
            expect(e3.status).toBe('falha');
            expect(c3.getValue('status')).toBe('falha');
            expect(c3.getValue('tentativas')).toBe('3');
            expect(envios(e3.comunicacao).length).toBe(3);
        });
        it('opt-out de SMS: sai por SNE, motivo «SMS: opt-out», nenhum retorno de SMS', function() {
            expect(e4.status).toBe('entregue');
            expect(c4.getValue('canal')).toBe('sne');
            expect(c4.getValue('motivo')).toBe('SMS: opt-out');
            expect(env4.join(',')).toBe('sne:entregue');
        });
        it('uma comunicação por inscrição e etapa', function() {
            var g = new GlideAggregate('x_2326104_cob_comunicacao');
            g.addQuery('inscricao', 'IN', [i1, i2, i3, i4].join(','));
            g.addAggregate('COUNT');
            g.query();
            g.next();
            expect(g.getAggregate('COUNT')).toBe('4');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4011_teto = Test({
    $id: Now.ID['US-MOD-F4-011_atf_teto_demo'],
    name: 'RF-MOD-F4-011 — teto em modo demo: segundo envio no mesmo canal dentro de 60 s pula; depois de 60 s sai no mesmo canal',
    description: 'Com segundos_por_dia = 60 e TETO_POR_JANELA = 1: a etapa 1 (SNE) sai por SNE; a etapa 2 (SNE) logo em seguida pula SNE («SNE: teto») e sai por e-mail; recuado o recebido_em do primeiro retorno em 61 s, a etapa 3 (SNE) sai por SNE (D19, RN-38; AS-TASK-MOD-F4-011-02-05).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-011_test_05'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
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
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-011 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function debito(contribuinteId, tributo, status) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', 1250);
        return d.insert();
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
    function canais(cfg) {
        var nomes = ['sne', 'email', 'sms', 'whatsapp'];
        for (var k = 0; k < nomes.length; k++) {
            var c = cfg[nomes[k]] || {};
            var g = new GlideRecord('x_2326104_cob_canal_sim');
            g.addQuery('canal', nomes[k]);
            g.query();
            var achou = false;
            while (g.next()) {
                achou = true;
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.update();
            }
            if (!achou) {
                g.initialize();
                g.setValue('canal', nomes[k]);
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.insert();
            }
        }
    }
    function consentir(contribuinteId, canal, situacao) {
        var c = new GlideRecord('x_2326104_cob_consentimento');
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('canal', canal);
        c.setValue('situacao', situacao);
        c.setValue('registrado_em', new GlideDateTime().getValue());
        c.setValue('origem', 'ATF (fictício)');
        return c.insert();
    }
    function envios(comunicacaoId) {
        var e = new GlideRecord('x_2326104_cob_envio_sim');
        e.addQuery('comunicacao', comunicacaoId);
        e.orderBy('sys_created_on');
        e.query();
        var lista = [];
        while (e.next()) { lista.push(e.getValue('canal') + ':' + e.getValue('status_retorno')); }
        return lista;
    }
    function lerInscricao(id) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.get(id);
        return g;
    }
    function lerComunicacao(id) {
        var g = new GlideRecord('x_2326104_cob_comunicacao');
        g.get(id);
        return g;
    }
    describe('enviar — teto por janela', function() {
        canais({ whatsapp: { exige: true } });
        var motor = new ReguaMotor();
        var r = regua('atf_teto');
        etapa(r, 1, 0, 'sne', 'utilitaria', 'intensificar');
        etapa(r, 2, 10, 'sne', 'consciente', 'intensificar');
        etapa(r, 3, 20, 'sne', 'explicativa', 'encaminhar_ativa');
        var a = contribuinte('teto');
        var i = inscricao(a, r, '', '');
        var e1 = motor.enviar(i, 1);
        var e2 = motor.enviar(i, 2);
        var c2 = lerComunicacao(e2.comunicacao);
        var antes = new GlideDateTime();
        antes.addSeconds(-61);
        var env = new GlideRecord('x_2326104_cob_envio_sim');
        env.addQuery('inscricao', i);
        env.addQuery('canal', 'sne');
        env.query();
        while (env.next()) {
            env.setValue('recebido_em', antes.getValue());
            env.update();
        }
        var envE = new GlideRecord('x_2326104_cob_envio_sim');
        envE.addQuery('inscricao', i);
        envE.addQuery('canal', 'email');
        envE.query();
        while (envE.next()) {
            envE.setValue('recebido_em', antes.getValue());
            envE.update();
        }
        var e3 = motor.enviar(i, 3);
        it('primeira etapa sai por SNE', function() {
            expect(motor.segundosPorDia()).toBe(60);
            expect(e1.canal).toBe('sne');
        });
        it('segunda dentro de 60 s pula SNE pelo teto e sai por e-mail', function() {
            expect(e2.status).toBe('entregue');
            expect(e2.canal).toBe('email');
            expect(c2.getValue('motivo')).toBe('SNE: teto');
            expect(envios(e2.comunicacao).join(',')).toBe('email:entregue');
        });
        it('depois de 60 s sai de novo por SNE', function() {
            expect(e3.status).toBe('entregue');
            expect(e3.canal).toBe('sne');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4011_idempotencia = Test({
    $id: Now.ID['US-MOD-F4-011_atf_idempotencia'],
    name: 'RF-MOD-F4-011 — idempotência: enviar duas vezes a mesma etapa deixa 1 comunicação e os mesmos retornos de envio',
    description: 'Inscrição ativa, etapa 1 SNE: a segunda chamada de enviar devolve a mesma comunicação, com o mesmo status e canal, sem novo retorno de envio (RN-NOVO-F4-012; AS-TASK-MOD-F4-011-02-06).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-011_test_06'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
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
    function contribuinte(nome) {
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-011 ' + nome);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        return p.insert();
    }
    function debito(contribuinteId, tributo, status) {
        var d = new GlideRecord('x_2326104_cob_debito');
        d.initialize();
        d.setValue('contribuinte', contribuinteId);
        d.setValue('origem', 'sne');
        d.setValue('tributo', tributo);
        d.setValue('status', status);
        d.setValue('valor', 1250);
        return d.insert();
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
    function canais(cfg) {
        var nomes = ['sne', 'email', 'sms', 'whatsapp'];
        for (var k = 0; k < nomes.length; k++) {
            var c = cfg[nomes[k]] || {};
            var g = new GlideRecord('x_2326104_cob_canal_sim');
            g.addQuery('canal', nomes[k]);
            g.query();
            var achou = false;
            while (g.next()) {
                achou = true;
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.update();
            }
            if (!achou) {
                g.initialize();
                g.setValue('canal', nomes[k]);
                g.setValue('contratado', c.contratado !== false);
                g.setValue('exige_opt_in', !!c.exige);
                g.setValue('forcar_falha', !!c.falha);
                g.insert();
            }
        }
    }
    function consentir(contribuinteId, canal, situacao) {
        var c = new GlideRecord('x_2326104_cob_consentimento');
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('canal', canal);
        c.setValue('situacao', situacao);
        c.setValue('registrado_em', new GlideDateTime().getValue());
        c.setValue('origem', 'ATF (fictício)');
        return c.insert();
    }
    function envios(comunicacaoId) {
        var e = new GlideRecord('x_2326104_cob_envio_sim');
        e.addQuery('comunicacao', comunicacaoId);
        e.orderBy('sys_created_on');
        e.query();
        var lista = [];
        while (e.next()) { lista.push(e.getValue('canal') + ':' + e.getValue('status_retorno')); }
        return lista;
    }
    function lerInscricao(id) {
        var g = new GlideRecord('x_2326104_cob_regua_inscricao');
        g.get(id);
        return g;
    }
    function lerComunicacao(id) {
        var g = new GlideRecord('x_2326104_cob_comunicacao');
        g.get(id);
        return g;
    }
    describe('enviar — idempotência', function() {
        canais({ whatsapp: { exige: true } });
        var motor = new ReguaMotor();
        var r = regua('atf_idem');
        etapa(r, 1, 0, 'sne', 'utilitaria', 'encaminhar_ativa');
        var a = contribuinte('idempotência');
        var i = inscricao(a, r, '', '');
        var e1 = motor.enviar(i, 1);
        var env1 = envios(e1.comunicacao);
        var e2 = motor.enviar(i, 1);
        var env2 = envios(e2.comunicacao);
        it('1 comunicação e os mesmos retornos de envio', function() {
            expect(e2.comunicacao).toBe(e1.comunicacao);
            expect(e2.status).toBe(e1.status);
            expect(e2.canal).toBe(e1.canal);
            expect(env2.join(',')).toBe(env1.join(','));
            var g = new GlideRecord('x_2326104_cob_comunicacao');
            g.addQuery('inscricao', i);
            g.query();
            expect(g.getRowCount()).toBe(1);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})
