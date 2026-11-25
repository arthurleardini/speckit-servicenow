/**
 * SegmentacaoScore — score de liquidez como critério, com fallback «sem score» (RF-MOD-F2-005, fio condutor 3).
 *
 * Com a versão usando score: score válido acima do threshold qualifica; abaixo, massificada. Sem score
 * válido, o contribuinte é avaliado só pelos critérios determinísticos (valor e atraso) e fica marcado
 * «Sem score» (RN-NOVO-F3-001, RN-NOVO-F3-002). A qualificação nunca para por falta de score.
 * Exemplo do critério de aceite: versão com threshold 60 e score válido 72 → «Qualificada» com
 * «Score usado = 72»; score 41 → «Massificada»; sem score → valor e atraso decidem, «Sem score».
 */
var SegmentacaoScore = Class.create();

SegmentacaoScore.TABELA_SEGMENTACAO = 'x_2326104_cob_segmentacao';
SegmentacaoScore.TABELA_CRITERIO = 'x_2326104_cob_criterio';
SegmentacaoScore.TABELA_CICLO = 'x_2326104_cob_ciclo';
SegmentacaoScore.TABELA_CONTRIBUINTE = 'x_2326104_cob_contribuinte';
SegmentacaoScore.TABELA_DEBITO = 'x_2326104_cob_debito';
SegmentacaoScore.SCORE_MINIMO = 0;
SegmentacaoScore.SCORE_MAXIMO = 100;
SegmentacaoScore.MOTIVO_REGUA = 'Esgotou a régua (RN-NOVO-F4-008)';

SegmentacaoScore.prototype = {
    initialize: function () {},

    /**
     * Diz se o score é válido: número entre 0 e 100.
     * @param {*} score
     * @returns {boolean}
     */
    scoreValido: function (score) {
        if (score === null || score === undefined || String(score) === '') {
            return false;
        }
        var n = parseFloat(score);
        return !isNaN(n) && n >= SegmentacaoScore.SCORE_MINIMO && n <= SegmentacaoScore.SCORE_MAXIMO;
    },

    /**
     * Classifica um contribuinte pela versão do critério, com o fallback «sem score».
     * @param {GlideRecord} criterio versão do critério
     * @param {{valor: number, atraso: number, score: *}} dados do contribuinte
     * @returns {{segmento: string, semScore: boolean, scoreUsado: string, motivo: string}}
     */
    classificar: function (criterio, dados) {
        var valorMin = parseFloat(criterio.getValue('valor_minimo')) || 0;
        var atrasoMin = parseInt(criterio.getValue('atraso_minimo_dias'), 10) || 0;
        var deterministico = (parseFloat(dados.valor) || 0) >= valorMin && (parseInt(dados.atraso, 10) || 0) >= atrasoMin;
        var usarScore = criterio.getValue('usar_score') == '1' || criterio.getValue('usar_score') == 'true';
        if (!usarScore) {
            return { segmento: deterministico ? 'qualificada' : 'massificada', semScore: false, scoreUsado: '',
                motivo: deterministico ? 'Atende valor e atraso' : 'Não atende valor ou atraso' };
        }
        if (!this.scoreValido(dados.score)) {
            return { segmento: deterministico ? 'qualificada' : 'massificada', semScore: true, scoreUsado: '',
                motivo: 'Sem score válido: avaliado só por valor e atraso' };
        }
        var threshold = parseFloat(criterio.getValue('threshold_score')) || 0;
        var acima = parseFloat(dados.score) >= threshold;
        return { segmento: deterministico && acima ? 'qualificada' : 'massificada', semScore: false,
            scoreUsado: String(parseFloat(dados.score)),
            motivo: !deterministico ? 'Não atende valor ou atraso' : (acima ? 'Score acima do threshold' : 'Score abaixo do threshold') };
    },

    /**
     * Valor em aberto e maior atraso do contribuinte, no tributo da versão (todos = sem filtro).
     */
    dadosDoContribuinte: function (contribuinteId, criterio) {
        var dados = { valor: 0, atraso: 0, score: null, encaminhado: '' };
        var agg = new GlideAggregate(SegmentacaoScore.TABELA_DEBITO);
        agg.addQuery('contribuinte', contribuinteId);
        var tributo = criterio.getValue('tributo');
        if (tributo && tributo != 'todos') {
            agg.addQuery('tributo', tributo);
        }
        agg.addAggregate('SUM', 'valor');
        agg.addAggregate('MAX', 'dias_atraso');
        agg.setGroup(false);
        agg.query();
        if (agg.next()) {
            dados.valor = parseFloat(agg.getAggregate('SUM', 'valor')) || 0;
            dados.atraso = parseInt(agg.getAggregate('MAX', 'dias_atraso'), 10) || 0;
        }
        var c = new GlideRecord(SegmentacaoScore.TABELA_CONTRIBUINTE);
        if (c.get(contribuinteId)) {
            dados.score = c.getValue('score');
            dados.encaminhado = c.getValue('encaminhado_qualificada_em') || '';
        }
        return dados;
    },

    /**
     * Preenche segmento, «Sem score», score usado, valor e motivo de uma linha da carteira segmentada.
     * A versão vem da linha ou do ciclo. Sem versão, a linha fica como está.
     * @param {GlideRecord} seg linha de segmentação (antes de gravar)
     * @returns {boolean} true quando classificou
     */
    aplicar: function (seg) {
        var criterioId = seg.getValue('criterio');
        if (!criterioId) {
            var ciclo = new GlideRecord(SegmentacaoScore.TABELA_CICLO);
            if (ciclo.get(seg.getValue('ciclo'))) {
                criterioId = ciclo.getValue('criterio');
            }
        }
        var criterio = new GlideRecord(SegmentacaoScore.TABELA_CRITERIO);
        if (!criterioId || !criterio.get(criterioId)) {
            return false;
        }
        var dados = this.dadosDoContribuinte(seg.getValue('contribuinte'), criterio);
        var r = this.classificar(criterio, dados);
        if (dados.encaminhado) {
            // Esgotou a régua na cobrança massificada: vai à qualificada na publicação seguinte (RN-NOVO-F4-008).
            // ReguaMotor.inscrever limpa a marca quando este ciclo é publicado.
            r.segmento = 'qualificada';
            r.motivo = SegmentacaoScore.MOTIVO_REGUA;
        }
        seg.setValue('criterio', criterioId);
        seg.setValue('segmento', r.segmento);
        seg.setValue('sem_score', r.semScore);
        seg.setValue('score_usado', r.scoreUsado);
        seg.setValue('valor_em_aberto', dados.valor);
        seg.setValue('motivo', r.motivo);
        return true;
    },

    /**
     * Marca o contribuinte «Sem score» e recalcula o total «Sem score» do ciclo em prévia.
     * @param {GlideRecord} seg linha de segmentação gravada
     */
    propagarSemScore: function (seg) {
        if (seg.getValue('sem_score') == '1' || seg.getValue('sem_score') == 'true') {
            var c = new GlideRecord(SegmentacaoScore.TABELA_CONTRIBUINTE);
            if (c.get(seg.getValue('contribuinte')) && c.getValue('sem_score') != '1') {
                c.setValue('sem_score', true);
                c.update();
            }
        }
        var ciclo = new GlideRecord(SegmentacaoScore.TABELA_CICLO);
        if (!ciclo.get(seg.getValue('ciclo')) || ciclo.getValue('estado') != 'previa') {
            return;
        }
        var agg = new GlideAggregate(SegmentacaoScore.TABELA_SEGMENTACAO);
        agg.addQuery('ciclo', ciclo.getUniqueValue());
        agg.addQuery('sem_score', true);
        agg.addAggregate('COUNT');
        agg.query();
        var total = agg.next() ? parseInt(agg.getAggregate('COUNT'), 10) || 0 : 0;
        if (String(total) != ciclo.getValue('qtd_sem_score')) {
            ciclo.setValue('qtd_sem_score', total);
            ciclo.update();
        }
    },

    type: 'SegmentacaoScore'
};
