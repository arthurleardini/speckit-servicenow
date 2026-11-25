/**
 * ProximaAcao — texto da coluna «O que fazer agora» (proxima_acao) do contato, do caso e do ciclo
 * (RF-MOD-UX-010, RN-NOVO-UX-015; design ux-cobranca-v2-regua-flow.md, A3).
 *
 *   tabela   estado                          texto
 *   contato  a_ligar                         Ligar e registrar o resultado
 *   contato  retornar                        Retornar a ligação em <proxima_acao_em>  (sem data: «Retornar a ligação»)
 *   contato  ligado                          Conferir pagamento combinado em <data>  (sem data: «Conferir pagamento combinado»)
 *   caso     em_selecao/selecionado/dossie   Avançar etapa: Caso selecionado / Dossiê gerado / Condução
 *   caso     conducao                        Conduzir e encerrar com motivo
 *   ciclo    previa                          Publicar ciclo
 *   ciclo    publicado sem distribuido_em    Distribuir lista
 *   ciclo    publicado distribuído           Acompanhar a lista
 *   todos    encerrado                       Nada a fazer (encerrado)
 *
 * A data é a da próxima ação gravada (dd/mm/aaaa), não «hoje»: o texto não envelhece. O mesmo quadro está
 * portado em app/scripts/gerar-seed-demo.mjs (seed sem business rule).
 */
var ProximaAcao = Class.create();

ProximaAcao.ENCERRADO = 'Nada a fazer (encerrado)';

ProximaAcao.prototype = {
    initialize: function () {},

    /**
     * @param {GlideRecord} gr contato, caso ou ciclo (valores atuais, gravados ou não)
     * @returns {string} o texto de «O que fazer agora» ('' para tabela fora do quadro)
     */
    texto: function (gr) {
        // Sufixo da tabela, sem digitar o escopo (padrão do app).
        var tabela = gr.getTableName();
        if (/_contato$/.test(tabela)) {
            return this._contato(gr);
        }
        if (/_caso$/.test(tabela)) {
            return this._caso(gr);
        }
        if (/_ciclo$/.test(tabela)) {
            return this._ciclo(gr);
        }
        return '';
    },

    _contato: function (gr) {
        var status = gr.getValue('status') || 'a_ligar';
        var data = this._data(gr.getValue('proxima_acao_em'));
        if (status == 'encerrado') {
            return gs.getMessage(ProximaAcao.ENCERRADO);
        }
        if (status == 'retornar') {
            return data ? gs.getMessage('Retornar a ligação em {0}', data) : gs.getMessage('Retornar a ligação');
        }
        if (status == 'ligado') {
            return data ? gs.getMessage('Conferir pagamento combinado em {0}', data) : gs.getMessage('Conferir pagamento combinado');
        }
        return gs.getMessage('Ligar e registrar o resultado');
    },

    _caso: function (gr) {
        var estagio = gr.getValue('estagio') || 'em_selecao';
        var proximo = { em_selecao: 'Caso selecionado', selecionado: 'Dossiê gerado', dossie_gerado: 'Condução' };
        if (estagio == 'encerrado') {
            return gs.getMessage(ProximaAcao.ENCERRADO);
        }
        if (estagio == 'conducao') {
            return gs.getMessage('Conduzir e encerrar com motivo');
        }
        return gs.getMessage('Avançar etapa: {0}', gs.getMessage(proximo[estagio] || 'Caso selecionado'));
    },

    _ciclo: function (gr) {
        var estado = gr.getValue('estado') || 'previa';
        if (estado == 'encerrado') {
            return gs.getMessage(ProximaAcao.ENCERRADO);
        }
        if (estado == 'publicado') {
            return gr.getValue('distribuido_em') ? gs.getMessage('Acompanhar a lista') : gs.getMessage('Distribuir lista');
        }
        return gs.getMessage('Publicar ciclo');
    },

    /** 'aaaa-mm-dd' (valor interno de glide_date) → 'dd/mm/aaaa'; vazio → ''. */
    _data: function (valor) {
        if (!valor) {
            return '';
        }
        var p = String(valor).substring(0, 10).split('-');
        return p.length == 3 ? p[2] + '/' + p[1] + '/' + p[0] : String(valor);
    },

    type: 'ProximaAcao'
};
