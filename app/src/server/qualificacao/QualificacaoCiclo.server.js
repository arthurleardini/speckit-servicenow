/**
 * QualificacaoCiclo — publicação do ciclo e sorteio do grupo de controle (RF-MOD-F2-004, fio condutor 2).
 *
 * O sorteio roda só no servidor, na publicação do ciclo. A semente fica gravada no ciclo: o mesmo
 * sorteio refeito com a mesma semente e os mesmos elegíveis dá o mesmo grupo (RN-NOVO-F2-005,
 * RN-NOVO-F2-006, SEC-010). Contribuinte no grupo de controle não recebe comunicação nem caso.
 */
var QualificacaoCiclo = Class.create();

QualificacaoCiclo.TABELA_CICLO = 'x_2326104_cob_ciclo';
QualificacaoCiclo.TABELA_SEGMENTACAO = 'x_2326104_cob_segmentacao';
QualificacaoCiclo.TABELA_CRITERIO = 'x_2326104_cob_criterio';
QualificacaoCiclo.TABELA_CONTATO = 'x_2326104_cob_contato';
QualificacaoCiclo.TABELA_CONTRIBUINTE = 'x_2326104_cob_contribuinte';
QualificacaoCiclo.MSG_JA_DISTRIBUIDO = 'Operação recusada: ciclo já distribuído ou não publicado.';
QualificacaoCiclo.MSG_SO_COORDENADOR_DISTRIBUI = 'Só o coordenador de cobrança distribui a lista do ciclo.';
QualificacaoCiclo.MSG_SEM_ATENDENTE = 'Operação recusada: nenhum usuário ativo com o papel atendente para receber a lista.';
/** Premissa P do grupo de controle quando a versão do critério não informa (RN-NOVO-F2-006, GAP-003). */
QualificacaoCiclo.PCT_PADRAO = 10;
QualificacaoCiclo.MSG_SO_COORDENADOR = 'Só o coordenador de cobrança publica o ciclo.';
QualificacaoCiclo.MSG_SO_PREVIA = 'Só ciclo em prévia pode ser publicado.';
QualificacaoCiclo.MSG_SEM_CRITERIO = 'Informe uma versão publicada do critério antes de publicar o ciclo.';
QualificacaoCiclo.MSG_EM_CONTROLE = 'Contribuinte está no Grupo de controle do ciclo e fica fora das ações de cobrança.';
QualificacaoCiclo.MSG_SEGMENTO_CONTROLE = 'O Grupo de controle não muda depois de publicado o ciclo.';
QualificacaoCiclo.MSG_CAMPO_DO_SISTEMA = 'Semente, totais e autoria do ciclo são gravados pelo sistema ao publicar.';
QualificacaoCiclo.MSG_NAO_PUBLICOU = 'O ciclo não foi publicado. Confira a mensagem acima e tente de novo.';

QualificacaoCiclo.prototype = {
    initialize: function () {},

    /**
     * Tamanho do grupo de controle: percentual dos elegíveis, arredondado para cima (205 × 10% = 21).
     * @param {number} qtdElegiveis
     * @param {number} pct percentual (10 = 10%)
     * @returns {number}
     */
    tamanhoControle: function (qtdElegiveis, pct) {
        var n = parseInt(qtdElegiveis, 10) || 0;
        var p = parseFloat(pct);
        if (n <= 0 || !(p > 0)) {
            return 0;
        }
        return Math.min(n, Math.ceil((n * p) / 100 - 1e-9));
    },

    /**
     * Lista dos contribuintes sorteados para o controle, sem gravar nada (refazer o sorteio).
     * @param {string} cicloId sys_id do ciclo
     * @param {number} semente semente do sorteio
     * @param {number} pct percentual do grupo
     * @returns {string[]} sys_id dos contribuintes sorteados, em ordem
     */
    listaSorteio: function (cicloId, semente, pct) {
        var elegiveis = this._elegiveis(cicloId);
        var k = this.tamanhoControle(elegiveis.length, pct);
        var embaralhados = this._embaralhar(elegiveis, semente);
        var sorteados = [];
        for (var i = 0; i < k; i++) {
            sorteados.push(embaralhados[i].contribuinte);
        }
        return sorteados.sort();
    },

    /**
     * Botão «Publicar ciclo»: confere papel e estado para dar a mensagem e grava o estado
     * «publicado». O sorteio, a semente e os totais são feitos pela business rule de gravação
     * (prepararPublicacao), que vale por qualquer caminho — botão, form, lista ou API (SEC-010).
     * @param {GlideRecord} ciclo
     * @returns {{ok: boolean, mensagem: string}}
     */
    publicar: function (ciclo) {
        if (!this._ehCoordenador()) {
            return { ok: false, mensagem: QualificacaoCiclo.MSG_SO_COORDENADOR };
        }
        if (ciclo.getValue('estado') != 'previa') {
            return { ok: false, mensagem: QualificacaoCiclo.MSG_SO_PREVIA };
        }
        var id = ciclo.getUniqueValue();
        ciclo.setValue('estado', 'publicado');
        ciclo.update();
        var lido = new GlideRecord(QualificacaoCiclo.TABELA_CICLO);
        if (!lido.get(id) || lido.getValue('estado') != 'publicado') {
            return { ok: false, mensagem: QualificacaoCiclo.MSG_NAO_PUBLICOU };
        }
        return { ok: true, mensagem: 'Ciclo publicado: ' + lido.getValue('qtd_elegiveis') + ' elegíveis e ' + lido.getValue('qtd_controle') + ' no Grupo de controle.' };
    },

    /**
     * Gravação de ciclo em prévia (business rule before update). Ao virar «publicado», confere o
     * papel e a versão do critério, sorteia o grupo de controle com semente nova gerada aqui e grava
     * totais, data e autor. Fora da publicação, semente, totais e autoria não são gravados à mão.
     * @param {GlideRecord} ciclo registro sendo gravado
     * @param {GlideRecord} previous como estava gravado
     * @returns {string} mensagem de recusa, ou '' quando segue
     */
    prepararPublicacao: function (ciclo, previous) {
        if (ciclo.getValue('estado') != 'publicado') {
            var campos = ['semente_sorteio', 'qtd_elegiveis', 'qtd_controle', 'qtd_qualificada', 'qtd_massificada', 'publicado_em', 'publicado_por'];
            for (var c = 0; c < campos.length; c++) {
                if (String(ciclo.getValue(campos[c]) || '') != String(previous.getValue(campos[c]) || '')) {
                    return QualificacaoCiclo.MSG_CAMPO_DO_SISTEMA;
                }
            }
            return '';
        }
        if (!this._ehCoordenador()) {
            return QualificacaoCiclo.MSG_SO_COORDENADOR;
        }
        var criterio = new GlideRecord(QualificacaoCiclo.TABELA_CRITERIO);
        if (!ciclo.getValue('criterio') || !criterio.get(ciclo.getValue('criterio')) || criterio.getValue('estado') != 'publicada') {
            return QualificacaoCiclo.MSG_SEM_CRITERIO;
        }
        var pct = parseFloat(criterio.getValue('pct_grupo_controle'));
        if (!(pct > 0) || pct > 100) {
            pct = QualificacaoCiclo.PCT_PADRAO;
        }
        var semente = Math.floor(Math.random() * 2147483646) + 1;
        var cicloId = ciclo.getUniqueValue();
        var sorteados = this.listaSorteio(cicloId, semente, pct);
        var marcados = {};
        for (var i = 0; i < sorteados.length; i++) {
            marcados[sorteados[i]] = true;
        }
        var seg = new GlideRecord(QualificacaoCiclo.TABELA_SEGMENTACAO);
        seg.addQuery('ciclo', cicloId);
        seg.query();
        while (seg.next()) {
            if (marcados[seg.getValue('contribuinte')] && seg.getValue('segmento') != 'controle') {
                seg.setValue('segmento', 'controle');
                seg.setValue('motivo', 'Sorteado para o Grupo de controle do ciclo');
                seg.update();
            }
        }
        var totais = this._totais(cicloId);
        ciclo.setValue('semente_sorteio', semente);
        ciclo.setValue('qtd_elegiveis', totais.elegiveis);
        ciclo.setValue('qtd_controle', totais.controle);
        ciclo.setValue('qtd_qualificada', totais.qualificada);
        ciclo.setValue('qtd_massificada', totais.massificada);
        ciclo.setValue('qtd_sem_score', totais.semScore);
        ciclo.setValue('publicado_em', new GlideDateTime());
        ciclo.setValue('publicado_por', gs.getUserID());
        gs.info('RF-MOD-F2-004: ciclo ' + cicloId + ' publicado com ' + totais.controle + ' no grupo de controle');
        return '';
    },

    /**
     * Botão «Distribuir lista» (RF-MOD-UX-004, RN-NOVO-UX-006, design UX v1 R1/R3/🟡7): cria um contato por
     * contribuinte do segmento massificada do ciclo publicado. O atendente do contato é o do contribuinte;
     * contribuinte sem atendente recebe um por rodízio entre os usuários com o papel atendente, gravado no
     * contato e no contribuinte. Grava «Distribuído em» e «Contatos distribuídos». Não distribui duas vezes
     * e não cria contato repetido para o mesmo contribuinte no ciclo. O grupo de controle fica de fora
     * (só massificada, e a business rule do contato recusa contribuinte em controle).
     * @param {GlideRecord} ciclo
     * @returns {{ok: boolean, mensagem: string, porAtendente: object}}
     */
    distribuir: function (ciclo) {
        if (!this._ehCoordenador()) {
            return { ok: false, mensagem: QualificacaoCiclo.MSG_SO_COORDENADOR_DISTRIBUI, porAtendente: {} };
        }
        if (ciclo.getValue('estado') != 'publicado' || ciclo.getValue('distribuido_em')) {
            gs.warn('RF-MOD-UX-004_ua_distribuir_lista: recusado; ciclo ' + ciclo.getUniqueValue() + ', usuário ' + gs.getUserID());
            return { ok: false, mensagem: QualificacaoCiclo.MSG_JA_DISTRIBUIDO, porAtendente: {} };
        }
        var atendentes = this._atendentes();
        if (!atendentes.length) {
            return { ok: false, mensagem: QualificacaoCiclo.MSG_SEM_ATENDENTE, porAtendente: {} };
        }
        var cicloId = ciclo.getUniqueValue();
        var jaTem = {};
        var ex = new GlideRecord(QualificacaoCiclo.TABELA_CONTATO);
        ex.addQuery('ciclo', cicloId);
        ex.query();
        while (ex.next()) {
            jaTem[ex.getValue('contribuinte')] = true;
        }
        var porAtendente = {};
        var vez = 0;
        var criados = 0;
        var seg = new GlideRecord(QualificacaoCiclo.TABELA_SEGMENTACAO);
        seg.addQuery('ciclo', cicloId);
        seg.addQuery('segmento', 'massificada');
        seg.orderBy('contribuinte');
        seg.query();
        while (seg.next()) {
            var pid = seg.getValue('contribuinte');
            var p = new GlideRecord(QualificacaoCiclo.TABELA_CONTRIBUINTE);
            if (jaTem[pid] || !p.get(pid)) {
                continue;
            }
            jaTem[pid] = true;
            var dono = p.getValue('atendente');
            if (!dono) {
                dono = atendentes[vez % atendentes.length];
                vez++;
                p.setValue('atendente', dono);
                p.update();
            }
            var valor = p.getValue('valor_em_aberto') || seg.getValue('valor_em_aberto') || 0;
            if (this._criarContato(pid, cicloId, dono, valor, 'distribuicao', '')) {
                criados++;
                porAtendente[dono] = (porAtendente[dono] || 0) + 1;
            }
        }
        var total = new GlideAggregate(QualificacaoCiclo.TABELA_CONTATO);
        total.addQuery('ciclo', cicloId);
        total.addAggregate('COUNT');
        total.query();
        ciclo.setValue('distribuido_em', new GlideDateTime());
        ciclo.setValue('qtd_contatos', total.next() ? parseInt(total.getAggregate('COUNT'), 10) || 0 : criados);
        ciclo.update();
        gs.info('RF-MOD-UX-004_ua_distribuir_lista: ciclo ' + cicloId + ' distribuído com ' + criados + ' contatos; usuário ' + gs.getUserID());
        return { ok: true, mensagem: this._mensagemDistribuicao(criados, porAtendente), porAtendente: porAtendente };
    },

    /**
     * Grava um contato «A ligar» do contribuinte no ciclo (sem checagem de papel; quem chama confere). `origem` diz
     * por onde o contato nasceu: distribuicao (Distribuir lista) ou regua (escalonamento da régua, D14).
     * @returns {string} sys_id do contato ('' quando a gravação foi recusada)
     */
    _criarContato: function (contribuinteId, cicloId, dono, valor, origem, inscricaoId) {
        var c = new GlideRecord(QualificacaoCiclo.TABELA_CONTATO);
        c.initialize();
        c.setValue('contribuinte', contribuinteId);
        c.setValue('atendente', dono);
        if (cicloId) {
            c.setValue('ciclo', cicloId);
        }
        c.setValue('status', 'a_ligar');
        c.setValue('tentativas', 0);
        c.setValue('prioridade', this.prioridadePorValor(valor));
        c.setValue('valor_em_aberto', valor);
        c.setValue('origem', origem || 'distribuicao');
        if (inscricaoId) {
            c.setValue('inscricao', inscricaoId);
        }
        return c.insert() || '';
    },

    /**
     * Escalonamento da régua à cobrança ativa (D14, P1 do dono). Sem checagem de papel: chamado pelo Flow (system).
     * Se o contribuinte já tem contato aberto no ciclo (o da distribuição), não cria outro: grava a inscrição nele e
     * antecipa «Próxima ação em» para hoje quando vazia ou futura. Senão cria o contato com o atendente do
     * contribuinte; sem atendente, o atendente ativo com menos contatos abertos no ciclo (empate pelo login), gravado
     * também no contribuinte.
     * @param {string} contribuinteId
     * @param {string} cicloId pode ser vazio (inscrição sem ciclo, régua de Parcelamentos)
     * @param {string} origem 'regua' ou 'distribuicao'
     * @param {string} inscricaoId
     * @returns {{contato: string, criado: boolean}}
     */
    atribuirContato: function (contribuinteId, cicloId, origem, inscricaoId) {
        var hoje = new GlideDateTime().getLocalDate().getValue();
        var aberto = new GlideRecord(QualificacaoCiclo.TABELA_CONTATO);
        aberto.addQuery('contribuinte', contribuinteId);
        if (cicloId) {
            aberto.addQuery('ciclo', cicloId);
        } else {
            aberto.addNullQuery('ciclo');
        }
        aberto.addQuery('status', '!=', 'encerrado');
        aberto.orderBy('sys_created_on');
        aberto.setLimit(1);
        aberto.query();
        if (aberto.next()) {
            if (inscricaoId) {
                aberto.setValue('inscricao', inscricaoId);
            }
            var quando = aberto.getValue('proxima_acao_em');
            if (!quando || quando > hoje) {
                aberto.setValue('proxima_acao_em', hoje);
            }
            aberto.update();
            return { contato: aberto.getUniqueValue(), criado: false };
        }
        var p = new GlideRecord(QualificacaoCiclo.TABELA_CONTRIBUINTE);
        if (!p.get(contribuinteId)) {
            return { contato: '', criado: false };
        }
        var dono = p.getValue('atendente');
        if (!dono) {
            dono = this._atendenteMenosCarregado(cicloId);
            if (!dono) {
                gs.warn('RF-MOD-F4-012: sem atendente ativo para o contribuinte ' + contribuinteId);
                return { contato: '', criado: false };
            }
            p.setValue('atendente', dono);
            p.update();
        }
        var id = this._criarContato(contribuinteId, cicloId, dono, p.getValue('valor_em_aberto') || 0, origem, inscricaoId);
        return { contato: id, criado: !!id };
    },

    /** Atendente ativo com menos contatos abertos no ciclo (empate: o primeiro login em ordem alfabética). */
    _atendenteMenosCarregado: function (cicloId) {
        var atendentes = this._atendentes();
        if (!atendentes.length) {
            return '';
        }
        var carga = {};
        var agg = new GlideAggregate(QualificacaoCiclo.TABELA_CONTATO);
        if (cicloId) {
            agg.addQuery('ciclo', cicloId);
        } else {
            agg.addNullQuery('ciclo');
        }
        agg.addQuery('status', '!=', 'encerrado');
        agg.addQuery('atendente', 'IN', atendentes.join(','));
        agg.addAggregate('COUNT');
        agg.groupBy('atendente');
        agg.query();
        while (agg.next()) {
            carga[agg.getValue('atendente')] = parseInt(agg.getAggregate('COUNT'), 10) || 0;
        }
        var melhor = atendentes[0];
        for (var i = 1; i < atendentes.length; i++) {
            if ((carga[atendentes[i]] || 0) < (carga[melhor] || 0)) {
                melhor = atendentes[i];
            }
        }
        return melhor;
    },

    /** Prioridade 1 (menor) a 5 (maior) pelo valor em aberto do contribuinte (design UX v1, D1). */
    prioridadePorValor: function (valor) {
        var v = parseFloat(valor) || 0;
        if (v >= 100000) { return 5; }
        if (v >= 50000) { return 4; }
        if (v >= 20000) { return 3; }
        if (v >= 5000) { return 2; }
        return 1;
    },

    /** Usuários ativos com o papel atendente do app, em ordem de login (base do rodízio). */
    _atendentes: function () {
        var lista = [];
        var visto = {};
        var r = new GlideRecord('sys_user_has_role');
        r.addQuery('role.name', gs.getCurrentScopeName() + '.atendente');
        r.addQuery('user.active', true);
        r.orderBy('user.user_name');
        r.query();
        while (r.next()) {
            var u = r.getValue('user');
            if (!visto[u]) {
                visto[u] = true;
                lista.push(u);
            }
        }
        return lista;
    },

    _mensagemDistribuicao: function (criados, porAtendente) {
        var partes = [];
        for (var u in porAtendente) {
            var usr = new GlideRecord('sys_user');
            partes.push((usr.get(u) ? usr.getDisplayValue() : u) + ': ' + porAtendente[u]);
        }
        partes.sort();
        return 'Lista distribuída: ' + criados + (criados == 1 ? ' contato' : ' contatos') + (partes.length ? ' — ' + partes.join('; ') : '') + '.';
    },

    _ehCoordenador: function () {
        return gs.hasRole(gs.getCurrentScopeName() + '.coordenador');
    },

    /**
     * Diz se o contribuinte está no grupo de controle de um ciclo publicado.
     * @param {string} contribuinteId
     * @param {string} cicloId opcional; vazio = qualquer ciclo publicado
     * @returns {boolean}
     */
    emControle: function (contribuinteId, cicloId) {
        if (!contribuinteId) {
            return false;
        }
        var seg = new GlideRecord(QualificacaoCiclo.TABELA_SEGMENTACAO);
        seg.addQuery('contribuinte', contribuinteId);
        seg.addQuery('segmento', 'controle');
        seg.addQuery('ciclo.estado', 'publicado');
        if (cicloId) {
            seg.addQuery('ciclo', cicloId);
        }
        seg.setLimit(1);
        seg.query();
        return seg.hasNext();
    },

    /**
     * Motivo de recusa para comunicação ou caso de contribuinte em controle ('' quando segue).
     * @param {GlideRecord} current comunicação ou caso sendo gravado
     */
    motivoRecusaAcao: function (current) {
        return this.emControle(current.getValue('contribuinte'), current.getValue('ciclo')) ? QualificacaoCiclo.MSG_EM_CONTROLE : '';
    },

    /**
     * Motivo de recusa para mudar o segmento de/para controle depois de publicado o ciclo.
     */
    motivoRecusaSegmento: function (current, previous) {
        var antes = previous.getValue('segmento');
        var depois = current.getValue('segmento');
        if (antes == depois || (antes != 'controle' && depois != 'controle')) {
            return '';
        }
        var ciclo = new GlideRecord(QualificacaoCiclo.TABELA_CICLO);
        if (ciclo.get(current.getValue('ciclo')) && (ciclo.getValue('estado') == 'publicado' || ciclo.getValue('estado') == 'encerrado')) {
            return QualificacaoCiclo.MSG_SEGMENTO_CONTROLE;
        }
        return '';
    },

    _elegiveis: function (cicloId) {
        var lista = [];
        var seg = new GlideRecord(QualificacaoCiclo.TABELA_SEGMENTACAO);
        seg.addQuery('ciclo', cicloId);
        seg.orderBy('contribuinte');
        seg.orderBy('sys_id');
        seg.query();
        while (seg.next()) {
            lista.push({ contribuinte: seg.getValue('contribuinte') });
        }
        return lista;
    },

    /** Fisher-Yates com gerador Park-Miller (determinístico pela semente; aritmética exata em double). */
    _embaralhar: function (lista, semente) {
        var copia = lista.slice(0);
        var MODULO = 2147483647;
        var estado = (Math.abs(parseInt(semente, 10)) % MODULO) || 1;
        var proximo = function () {
            estado = (estado * 16807) % MODULO;
            return (estado - 1) / (MODULO - 1);
        };
        for (var i = copia.length - 1; i > 0; i--) {
            var j = Math.floor(proximo() * (i + 1));
            var tmp = copia[i];
            copia[i] = copia[j];
            copia[j] = tmp;
        }
        return copia;
    },

    _totais: function (cicloId) {
        var t = { elegiveis: 0, controle: 0, qualificada: 0, massificada: 0, semScore: 0 };
        var agg = new GlideAggregate(QualificacaoCiclo.TABELA_SEGMENTACAO);
        agg.addQuery('ciclo', cicloId);
        agg.addAggregate('COUNT');
        agg.groupBy('segmento');
        agg.query();
        while (agg.next()) {
            var n = parseInt(agg.getAggregate('COUNT'), 10) || 0;
            t.elegiveis += n;
            var s = agg.getValue('segmento');
            if (t.hasOwnProperty(s)) {
                t[s] = n;
            }
        }
        var sem = new GlideAggregate(QualificacaoCiclo.TABELA_SEGMENTACAO);
        sem.addQuery('ciclo', cicloId);
        sem.addQuery('sem_score', true);
        sem.addAggregate('COUNT');
        sem.query();
        if (sem.next()) {
            t.semScore = parseInt(sem.getAggregate('COUNT'), 10) || 0;
        }
        return t;
    },

    type: 'QualificacaoCiclo'
};
