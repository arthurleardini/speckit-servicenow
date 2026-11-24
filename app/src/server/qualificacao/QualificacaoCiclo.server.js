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
