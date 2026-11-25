// ATF da US-MOD-UX-010 — «O que fazer agora» em contato, caso e ciclo e «Lista da equipe» do coordenador
// (RF-MOD-UX-010, RN-NOVO-UX-015, RN-NOVO-UX-016; design ux-cobranca-v2-regua-flow.md, A3, A4 e B9).
// Massa fictícia criada pelo próprio teste (o rollback do ATF desfaz).
import '@servicenow/sdk/global'
import { Test } from '@servicenow/sdk/core'
import { role_atendente, role_coordenador } from '../security/roles.now'

export const t_ux010_quadro = Test({
    $id: Now.ID['US-MOD-UX-010_atf_proxima_acao_quadro'],
    name: 'RF-MOD-UX-010 — ProximaAcao devolve o texto de cada estado de contato, caso e ciclo',
    description: 'Um caso por linha do quadro A3 do design: contato a ligar, retornar (com e sem data), ligado (com e sem data) e encerrado; caso em seleção, selecionado, dossiê gerado, condução e encerrado; ciclo prévia, publicado sem e com distribuição e encerrado (RN-NOVO-UX-015).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-010_test_01'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    var S = gs.getCurrentScopeName() + '_';
    function texto(tabela, campos) {
        var r = new GlideRecord(S + tabela);
        r.initialize();
        for (var k in campos) { r.setValue(k, campos[k]); }
        return new ProximaAcao().texto(r);
    }
    describe('O que fazer agora', function() {
        it('contato a ligar', function() { expect(texto('contato', { status: 'a_ligar' })).toBe('Ligar e registrar o resultado'); });
        it('contato retornar com data', function() { expect(texto('contato', { status: 'retornar', proxima_acao_em: '2026-12-03' })).toBe('Retornar a ligação em 03/12/2026'); });
        it('contato retornar sem data', function() { expect(texto('contato', { status: 'retornar' })).toBe('Retornar a ligação'); });
        it('contato ligado com data', function() { expect(texto('contato', { status: 'ligado', proxima_acao_em: '2026-12-10' })).toBe('Conferir pagamento combinado em 10/12/2026'); });
        it('contato ligado sem data', function() { expect(texto('contato', { status: 'ligado' })).toBe('Conferir pagamento combinado'); });
        it('contato encerrado', function() { expect(texto('contato', { status: 'encerrado' })).toBe('Nada a fazer (encerrado)'); });
        it('caso em seleção', function() { expect(texto('caso', { estagio: 'em_selecao' })).toBe('Avançar etapa: Caso selecionado'); });
        it('caso selecionado', function() { expect(texto('caso', { estagio: 'selecionado' })).toBe('Avançar etapa: Dossiê gerado'); });
        it('caso dossiê gerado', function() { expect(texto('caso', { estagio: 'dossie_gerado' })).toBe('Avançar etapa: Condução'); });
        it('caso em condução', function() { expect(texto('caso', { estagio: 'conducao' })).toBe('Conduzir e encerrar com motivo'); });
        it('caso encerrado', function() { expect(texto('caso', { estagio: 'encerrado' })).toBe('Nada a fazer (encerrado)'); });
        it('ciclo em prévia', function() { expect(texto('ciclo', { estado: 'previa' })).toBe('Publicar ciclo'); });
        it('ciclo publicado sem distribuição', function() { expect(texto('ciclo', { estado: 'publicado' })).toBe('Distribuir lista'); });
        it('ciclo publicado e distribuído', function() { expect(texto('ciclo', { estado: 'publicado', distribuido_em: '2026-11-01 13:00:00' })).toBe('Acompanhar a lista'); });
        it('ciclo encerrado', function() { expect(texto('ciclo', { estado: 'encerrado' })).toBe('Nada a fazer (encerrado)'); });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux010_gravacao = Test({
    $id: Now.ID['US-MOD-UX-010_atf_proxima_acao_gravacao'],
    name: 'RF-MOD-UX-010 — «O que fazer agora» é gravado em toda gravação e não aceita valor à mão',
    description: 'Contato, caso e ciclo fictícios inseridos por GlideRecord ganham o texto do estado; mudar o estado recalcula; gravar outro texto à mão em «O que fazer agora» é sobrescrito pelo texto do estado; demo.atendente, no próprio contato, não tem escrita no campo e tem em «Próxima ação em» (RN-NOVO-UX-015, positivo e negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-010_test_02'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    var S = gs.getCurrentScopeName() + '_';
    function inserir(tabela, campos) {
        var r = new GlideRecord(S + tabela);
        r.initialize();
        for (var k in campos) { r.setValue(k, campos[k]); }
        var id = r.insert();
        var lido = new GlideRecord(S + tabela);
        lido.get(id);
        return lido;
    }
    describe('Gravação de «O que fazer agora»', function() {
        var p = inserir('contribuinte', { nome: 'Contribuinte fictício UX-010 gravação', tipo_pessoa: 'pj', ficticio: true });
        it('contato: insert, mudança de estado e valor à mão', function() {
            var c = inserir('contato', { contribuinte: p.getUniqueValue(), status: 'a_ligar' });
            expect(c.getValue('proxima_acao')).toBe('Ligar e registrar o resultado');
            c.setValue('status', 'retornar');
            c.setValue('proxima_acao_em', '2026-12-03');
            c.update();
            c.get(c.getUniqueValue());
            expect(c.getValue('proxima_acao')).toBe('Retornar a ligação em 03/12/2026');
            c.setValue('proxima_acao', 'texto à mão');
            c.update();
            c.get(c.getUniqueValue());
            expect(c.getValue('proxima_acao')).toBe('Retornar a ligação em 03/12/2026');
        });
        it('caso e ciclo: insert grava o texto do estado', function() {
            var k = inserir('caso', { contribuinte: p.getUniqueValue(), estagio: 'em_selecao' });
            expect(k.getValue('proxima_acao')).toBe('Avançar etapa: Caso selecionado');
            var ci = inserir('ciclo', { nome: 'ATF ciclo UX-010 gravação (fictício)', estado: 'previa' });
            expect(ci.getValue('proxima_acao')).toBe('Publicar ciclo');
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
    const demo = atf.server.recordQuery({ $id: Now.ID['US-MOD-UX-010_test_10'], table: 'sys_user', fieldValues: 'user_name=demo.atendente', assert: 'records_match_query' })
    atf.server.impersonate({ $id: Now.ID['US-MOD-UX-010_test_03'], user: demo.first_record })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-010_test_04'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    describe('Campo só leitura para o atendente', function() {
        it('atendente não grava «O que fazer agora» e grava «Próxima ação em»', function() {
            var c = new GlideRecord(gs.getCurrentScopeName() + '_contato');
            c.addQuery('atendente', gs.getUserID());
            c.addQuery('status', '!=', 'encerrado');
            c.query();
            expect(c.next()).toBe(true);
            expect(c.proxima_acao.canWrite()).toBe(false);
            expect(c.proxima_acao_em.canWrite()).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux010_equipe_coordenador = Test({
    $id: Now.ID['US-MOD-UX-010_atf_lista_equipe_coordenador'],
    name: 'RF-MOD-UX-010 — coordenador vê «Lista da equipe» e lê os contatos de todos os atendentes',
    description: 'Coordenador vê o módulo «Lista da equipe» no menu e, pelo servidor com segurança, lê contatos abertos de demo.atendente e de demo.atendente2 (RN-NOVO-UX-016, G4, lado positivo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-010_test_05'], firstName: 'ATF', lastName: 'Coordenador UX-010 equipe', roles: [role_coordenador] })
    atf.applicationNavigator.moduleVisibility({
        $id: Now.ID['US-MOD-UX-010_test_06'],
        navigator: 'ui16',
        visibleModules: [Now.ref('sys_app_module', 'modulo_mod_ux_equipe_lista_da_equipe')],
    })
    atf.server.runServerSideScript({
        $id: Now.ID['US-MOD-UX-010_test_07'],
        jasmineVersion: '3.1',
        script: `(function(outputs, steps, params, stepResult, assertEqual) {

    describe('Lista da equipe', function() {
        it('contatos abertos dos dois atendentes de demo', function() {
            var g = new GlideRecordSecure(gs.getCurrentScopeName() + '_contato');
            g.addEncodedQuery('status!=encerrado^atendente.user_nameINdemo.atendente,demo.atendente2');
            g.query();
            var donos = {};
            var n = 0;
            while (g.next()) { donos[g.atendente.user_name.toString()] = true; n++; }
            expect(n >= 20).toBe(true);
            expect(donos['demo.atendente']).toBe(true);
            expect(donos['demo.atendente2']).toBe(true);
        });
    });
})(outputs, steps, params, stepResult, assertEqual);
jasmine.getEnv().execute();`,
    })
})

export const t_ux010_equipe_atendente = Test({
    $id: Now.ID['US-MOD-UX-010_atf_lista_equipe_atendente'],
    name: 'RF-MOD-UX-010 — atendente não vê «Lista da equipe»',
    description: 'Atendente vê «Minha lista» e não vê o módulo «Lista da equipe» (RN-NOVO-UX-016, lado negativo).',
    failOnServerError: true,
}, (atf) => {
    atf.server.createUser({ $id: Now.ID['US-MOD-UX-010_test_08'], firstName: 'ATF', lastName: 'Atendente UX-010 equipe', roles: [role_atendente] })
    atf.applicationNavigator.moduleVisibility({
        $id: Now.ID['US-MOD-UX-010_test_09'],
        navigator: 'ui16',
        visibleModules: [Now.ref('sys_app_module', 'modulo_mod_ux_lista_minha_lista')],
        notVisibleModules: [Now.ref('sys_app_module', 'modulo_mod_ux_equipe_lista_da_equipe')],
    })
})
