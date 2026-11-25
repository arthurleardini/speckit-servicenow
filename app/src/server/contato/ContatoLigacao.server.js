/**
 * ContatoLigacao — verbos do contato da lista de cobrança ativa (RF-MOD-UX-002, design UX v1 R3/🔴13).
 *
 * «Registrar ligação»: cria a interação ligada ao contato, soma 1 em tentativas e aplica a tabela de
 * decisão do design (RN-NOVO-UX-003):
 *
 *   resultado            retorno?  tentativas  →  status     próxima ação          motivo
 *   promessa_pagamento   —         —              ligado     retorno ou hoje + 7   —
 *   contato_efetivo      sim       —              retornar   retorno               —
 *   contato_efetivo      não       —              encerrado  vazio                 contato_realizado
 *   sem_contato          —         < 3            retornar   amanhã                —
 *   sem_contato          —         ≥ 3            encerrado  vazio                 sem_contato
 *   recusa               —         —              encerrado  vazio                 recusa
 *
 * A anotação (descrição da interação) é obrigatória aqui e no form. Quem pode: o atendente dono do
 * contato, o coordenador e o admin do app (o mesmo critério da carteira, CarteiraAtendente).
 * Devolve sempre {ok, mensagem}; a UI Action mostra a mensagem e nada é gravado pela metade.
 */
var ContatoLigacao = Class.create();

ContatoLigacao.TABELA_CONTATO = 'x_2326104_cob_contato';
ContatoLigacao.TABELA_INTERACAO = 'x_2326104_cob_interacao';
ContatoLigacao.MAX_TENTATIVAS = 3;
ContatoLigacao.DIAS_PROMESSA = 7;
ContatoLigacao.MSG_SEM_ANOTACAO = 'Operação recusada: informe a anotação da ligação.';
ContatoLigacao.MSG_SEM_RESULTADO = 'Operação recusada: informe o resultado da ligação.';
ContatoLigacao.MSG_ENCERRADO = 'Operação recusada: contato já encerrado.';
ContatoLigacao.MSG_CARTEIRA = 'Operação recusada: atendente vê só a própria carteira.';
ContatoLigacao.MSG_SEM_PAI = 'Operação recusada: a interação pertence a um contato ou a um caso.';
ContatoLigacao.MSG_NAO_GRAVOU = 'A ligação não foi registrada. Confira a mensagem acima e tente de novo.';
ContatoLigacao.ROTULO_STATUS = { a_ligar: 'A ligar', ligado: 'Ligado', retornar: 'Retornar', encerrado: 'Encerrado' };

ContatoLigacao.prototype = {
    initialize: function () {},

    /**
     * Botão «Registrar ligação».
     * @param {GlideRecord} contato contato da lista (o registro do form, ou lido pelo teste)
     * @param {{resultado: string, anotacao: string, retorno: string}} dados retorno = data (aaaa-mm-dd) ou ''
     * @returns {{ok: boolean, mensagem: string}}
     */
    registrar: function (contato, dados) {
        dados = dados || {};
        var recusa = this._recusaBasica(contato);
        if (recusa) {
            return this._recusar(contato, recusa);
        }
        var resultado = String(dados.resultado || '');
        var anotacao = String(dados.anotacao || '').replace(/^\s+|\s+$/g, '');
        var retorno = String(dados.retorno || '');
        if (!resultado) {
            return this._recusar(contato, ContatoLigacao.MSG_SEM_RESULTADO);
        }
        if (!anotacao) {
            return this._recusar(contato, ContatoLigacao.MSG_SEM_ANOTACAO);
        }
        var tentativas = (parseInt(contato.getValue('tentativas'), 10) || 0) + 1;
        var decisao = this.decidir(resultado, retorno, tentativas);
        if (!decisao) {
            return this._recusar(contato, ContatoLigacao.MSG_SEM_RESULTADO);
        }

        var i = new GlideRecord(ContatoLigacao.TABELA_INTERACAO);
        i.initialize();
        i.setValue('contato', contato.getUniqueValue());
        i.setValue('atendente', gs.getUserID());
        i.setValue('tipo', 'telefone');
        i.setValue('resultado', resultado);
        i.setValue('descricao', anotacao.substring(0, 4000));
        i.setValue('ocorrida_em', new GlideDateTime());
        if (retorno) {
            i.setValue('retorno_em', retorno);
        }
        if (!i.insert()) {
            gs.error('RF-MOD-UX-002_ua_registrar_ligacao: interação não gravada; contato ' + contato.getUniqueValue());
            return { ok: false, mensagem: ContatoLigacao.MSG_NAO_GRAVOU };
        }

        contato.setValue('ultimo_resultado', resultado);
        contato.setValue('tentativas', tentativas);
        contato.setValue('status', decisao.status);
        contato.setValue('proxima_acao_em', decisao.proxima);
        if (decisao.motivo) {
            contato.setValue('motivo_encerramento', decisao.motivo);
        }
        contato.update();
        gs.info('RF-MOD-UX-002_ua_registrar_ligacao: contato ' + contato.getUniqueValue() + ' → ' + decisao.status + '; usuário ' + gs.getUserID());
        return { ok: true, mensagem: this._mensagemOk(decisao) };
    },

    /**
     * Tabela de decisão pura (sem gravar): o que acontece com o contato depois da ligação.
     * @param {string} resultado choice de interacao.resultado
     * @param {string} retorno data informada (aaaa-mm-dd) ou ''
     * @param {number} tentativas já somando a ligação atual
     * @returns {{status: string, proxima: string, motivo: string}|null} null quando o resultado não existe
     */
    decidir: function (resultado, retorno, tentativas) {
        if (resultado == 'promessa_pagamento') {
            return { status: 'ligado', proxima: retorno || this.dataDaqui(ContatoLigacao.DIAS_PROMESSA), motivo: '' };
        }
        if (resultado == 'contato_efetivo') {
            return retorno
                ? { status: 'retornar', proxima: retorno, motivo: '' }
                : { status: 'encerrado', proxima: '', motivo: 'contato_realizado' };
        }
        if (resultado == 'sem_contato') {
            return tentativas < ContatoLigacao.MAX_TENTATIVAS
                ? { status: 'retornar', proxima: this.dataDaqui(1), motivo: '' }
                : { status: 'encerrado', proxima: '', motivo: 'sem_contato' };
        }
        if (resultado == 'recusa') {
            return { status: 'encerrado', proxima: '', motivo: 'recusa' };
        }
        return null;
    },

    /** Data local (aaaa-mm-dd) daqui a n dias. */
    dataDaqui: function (dias) {
        var gdt = new GlideDateTime();
        gdt.addDaysLocalTime(dias);
        return gdt.getLocalDate().getValue();
    },

    /**
     * Interação pertence a exatamente um entre contato e caso (RN-NOVO-UX-004). '' quando segue.
     * @param {GlideRecord} interacao
     */
    motivoRecusaInteracao: function (interacao) {
        var temContato = !!interacao.getValue('contato');
        var temCaso = !!interacao.getValue('caso');
        return temContato == temCaso ? ContatoLigacao.MSG_SEM_PAI : '';
    },

    /** Recusa comum aos verbos: contato inexistente, encerrado ou de outra carteira. '' quando segue. */
    _recusaBasica: function (contato) {
        if (!contato || !contato.getUniqueValue()) {
            return ContatoLigacao.MSG_CARTEIRA;
        }
        if (!new CarteiraAtendente().podeVer(contato, 'atendente') || !this._temPapel()) {
            return ContatoLigacao.MSG_CARTEIRA;
        }
        if (contato.getValue('status') == 'encerrado') {
            return ContatoLigacao.MSG_ENCERRADO;
        }
        return '';
    },

    _temPapel: function () {
        var escopo = gs.getCurrentScopeName();
        return gs.hasRole(escopo + '.atendente') || gs.hasRole(escopo + '.coordenador') || gs.hasRole(escopo + '.admin');
    },

    _recusar: function (contato, mensagem) {
        gs.warn('RF-MOD-UX-002: verbo do contato recusado; contato ' + (contato ? contato.getUniqueValue() : '') + ', usuário ' + gs.getUserID() + ' — ' + mensagem);
        return { ok: false, mensagem: mensagem };
    },

    _mensagemOk: function (decisao) {
        var msg = 'Ligação registrada. Status: ' + ContatoLigacao.ROTULO_STATUS[decisao.status];
        if (decisao.proxima) {
            var p = decisao.proxima.split('-');
            msg += '; próxima ação em ' + p[2] + '/' + p[1] + '/' + p[0];
        }
        return msg + '.';
    },

    type: 'ContatoLigacao'
};
