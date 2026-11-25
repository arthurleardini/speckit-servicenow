// ATF da US-MOD-F4-016 — «Reenviar» comunicação com falha (design ux-cobranca-v2-regua-flow.md, A1 e B9; RF-MOD-F4-006,
// RN-NOVO-F4-005). Massa fictícia criada pelo próprio teste e desfeita pelo rollback; régua de teste atf_reenviar
// (nenhum gatilho de Flow casa) com uma etapa por SNE.
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_coordenador } from '../security/roles.now'

export const t_f4016_reenviar = Test({
    $id: Now.ID['US-MOD-F4-016_atf_reenviar'],
    name: 'RF-MOD-F4-006 — «Reenviar» cria nova tentativa na comunicação com falha; entregue não reenvia',
    description: 'Comunicação de teste com falha e 3 tentativas (SNE sem falha forçada): reenviar cria um retorno de envio entregue, status «Entregue» e 4 tentativas; comunicação entregue é recusada com a mensagem (AS-TASK-MOD-F4-016-01-01 e 02).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-016_test_01'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    function massa(codigo) {
        var r = new GlideRecord('x_2326104_cob_regua');
        r.initialize();
        r.setValue('nome', 'Régua ATF ' + codigo + ' (fictícia)');
        r.setValue('codigo', codigo);
        r.setValue('carteira', 'ipva');
        r.setValue('ativa', true);
        r.setValue('prazo_final_dias', 5);
        var rid = r.insert();
        var e = new GlideRecord('x_2326104_cob_regua_etapa');
        e.initialize();
        e.setWorkflow(false);
        e.setValue('regua', rid);
        e.setValue('ordem', 1);
        e.setValue('offset_dias', 0);
        e.setValue('canal', 'sne');
        e.setValue('postura', 'utilitaria');
        e.setValue('acao_sem_resposta', 'encaminhar_ativa');
        e.setValue('template', 'Há uma mensagem para você no DT-e.');
        var eid = e.insert();
        var p = new GlideRecord('x_2326104_cob_contribuinte');
        p.initialize();
        p.setValue('nome', 'Contribuinte fictício F4-016 ' + codigo);
        p.setValue('tipo_pessoa', 'pj');
        p.setValue('ficticio', true);
        var pid = p.insert();
        var i = new GlideRecord('x_2326104_cob_regua_inscricao');
        i.initialize();
        i.setValue('contribuinte', pid);
        i.setValue('regua', rid);
        var iid = i.insert();
        return { regua: rid, etapa: eid, contribuinte: pid, inscricao: iid };
    }
    function comunicacao(m, status, tentativas) {
        var c = new GlideRecord('x_2326104_cob_comunicacao');
        c.initialize();
        c.setValue('contribuinte', m.contribuinte);
        c.setValue('regua', m.regua);
        c.setValue('etapa', m.etapa);
        c.setValue('inscricao', m.inscricao);
        c.setValue('canal', 'sne');
        c.setValue('status', status);
        c.setValue('tentativas', tentativas);
        return c.insert();
    }
    function sneSemFalha() {
        var c = new GlideRecord('x_2326104_cob_canal_sim');
        c.addQuery('canal', 'sne');
        c.query();
        while (c.next()) {
            c.setWorkflow(false);
            c.setValue('forcar_falha', false);
            c.setValue('contratado', true);
            c.update();
        }
    }
    describe('Reenviar', function() {
        sneSemFalha();
        it('falha → nova tentativa entregue, 4 tentativas', function() {
            var m = massa('atf_reenviar');
            var id = comunicacao(m, 'falha', 3);
            var r = new ReguaMotor().reenviar(id);
            expect(r.ok).toBe(true);
            var c = new GlideRecord('x_2326104_cob_comunicacao');
            c.get(id);
            expect(c.getValue('status')).toBe('entregue');
            expect(c.getValue('tentativas')).toBe('4');
            var e = new GlideRecord('x_2326104_cob_envio_sim');
            e.addQuery('comunicacao', id);
            e.addQuery('status_retorno', 'entregue');
            e.query();
            expect(e.getRowCount()).toBe(1);
        });
        it('entregue → recusada com a mensagem, nada muda', function() {
            var m = massa('atf_reenviar2');
            var id = comunicacao(m, 'entregue', 1);
            var r = new ReguaMotor().reenviar(id);
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Operação recusada: só comunicação com falha pode ser reenviada.');
            var c = new GlideRecord('x_2326104_cob_comunicacao');
            c.get(id);
            expect(c.getValue('tentativas')).toBe('1');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4016_atendente = Test({
    $id: Now.ID['US-MOD-F4-016_atf_reenviar_atendente'],
    name: 'RF-MOD-F4-006 — atendente não reenvia',
    description: 'Impersonado como demo.atendente, numa comunicação com falha de contribuinte da carteira dele: reenviar é recusado por papel e a comunicação fica como estava (AS-TASK-MOD-F4-016-01-03).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-016_test_02'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var r = new GlideRecord('x_2326104_cob_regua');
    r.initialize();
    r.setValue('nome', 'Régua ATF atf_reenviar_at (fictícia)');
    r.setValue('codigo', 'atf_reenviar_at');
    r.setValue('carteira', 'ipva');
    r.setValue('ativa', true);
    r.setValue('prazo_final_dias', 5);
    var rid = r.insert();
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    var u = new GlideRecord('sys_user');
    u.get('user_name', 'demo.atendente');
    p.setValue('nome', 'Contribuinte fictício F4-016 atendente');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    p.setValue('atendente', u.getUniqueValue());
    var pid = p.insert();
    var c = new GlideRecord('x_2326104_cob_comunicacao');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('regua', rid);
    c.setValue('canal', 'sne');
    c.setValue('status', 'falha');
    c.setValue('tentativas', 3);
    c.setValue('motivo', 'ATF F4-016 atendente');
    outputs.table = 'x_2326104_cob_comunicacao';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    const demo = atf.server.recordQuery({ $id: Now.ID['US-MOD-F4-016_test_03'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-F4-016_test_04'], user: demo.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-016_test_05'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    describe('Reenviar — atendente', function() {
        it('recusa por papel', function() {
            var g = new GlideRecord('x_2326104_cob_comunicacao');
            g.addQuery('motivo', 'ATF F4-016 atendente');
            g.query();
            expect(g.next()).toBe(true);
            var r = new ReguaMotor().reenviar(g.getUniqueValue());
            expect(r.ok).toBe(false);
            expect(r.mensagem).toBe('Operação recusada: ação do coordenador.');
            var c = new GlideRecord('x_2326104_cob_comunicacao');
            c.get(g.getUniqueValue());
            expect(c.getValue('status')).toBe('falha');
            expect(c.getValue('tentativas')).toBe('3');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_f4016_ui = Test({
    $id: Now.ID['US-MOD-F4-016_atf_reenviar_ui'],
    name: 'RF-MOD-F4-006 — coordenador vê «Reenviar» na comunicação com falha',
    description: 'Comunicação fictícia com falha; coordenador criado pelo teste abre o form e vê «Reenviar» (A1).',
    failOnServerError: true,
}, (atf) => {
    const c = atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-F4-016_test_06'],
        script: `(function(outputs, steps, params, stepResult, assertEqual) {
    var p = new GlideRecord('x_2326104_cob_contribuinte');
    p.initialize();
    p.setValue('nome', 'Contribuinte fictício F4-016 UI');
    p.setValue('tipo_pessoa', 'pj');
    p.setValue('ficticio', true);
    var pid = p.insert();
    var c = new GlideRecord('x_2326104_cob_comunicacao');
    c.initialize();
    c.setValue('contribuinte', pid);
    c.setValue('canal', 'sne');
    c.setValue('status', 'falha');
    c.setValue('tentativas', 3);
    outputs.table = 'x_2326104_cob_comunicacao';
    outputs.record_id = c.insert();
    return !!outputs.record_id;
})(outputs, steps, params, stepResult, assertEqual);`,
    })
    atf.server.createUser({ $id: Now.ID['US-MOD-F4-016_test_07'], firstName: 'ATF', lastName: 'Coordenador F4-016', roles: [role_coordenador] })
    atf.form.openExistingRecord({ $id: Now.ID['US-MOD-F4-016_test_08'], table: 'x_2326104_cob_comunicacao', recordId: c.record_id })
    atf.form.uiActionVisibility({
        $id: Now.ID['US-MOD-F4-016_test_09'],
        table: 'x_2326104_cob_comunicacao',
        visible: [Now.ref('sys_ui_action', 'F4-016_ua_reenviar')],
    })
})
