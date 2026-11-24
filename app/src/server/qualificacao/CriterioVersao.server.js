/**
 * CriterioVersao — regras de versão do critério de qualificação (RF-MOD-F2-002, fio condutor 1).
 *
 * Reúne o que a business rule e as UI Actions do critério precisam, para o ATF testar tudo pelo
 * servidor: publicar uma versão, criar a versão seguinte a partir da publicada, e dizer se uma
 * alteração em critério publicado ou em ciclo publicado deve ser recusada (RN-NOVO-F2-001,
 * RN-NOVO-F2-002, SEC-009).
 */
var CriterioVersao = Class.create();

CriterioVersao.TABELA = 'x_2326104_cob_criterio';
CriterioVersao.TABELA_CICLO = 'x_2326104_cob_ciclo';
CriterioVersao.MSG_VERSAO_PUBLICADA = 'Versão publicada não pode ser alterada. Crie uma nova versão.';
CriterioVersao.MSG_EXCLUSAO_PUBLICADA = 'Versão publicada não pode ser excluída.';
CriterioVersao.MSG_CICLO_PUBLICADO = 'Ciclo publicado não pode trocar o critério aplicado nem os totais.';
CriterioVersao.MSG_SO_COORDENADOR = 'Só o coordenador de cobrança publica ou cria versão do critério.';
CriterioVersao.MSG_SO_RASCUNHO = 'Só versão em rascunho pode ser publicada.';
CriterioVersao.MSG_SO_PUBLICADA = 'Só a versão publicada gera uma nova versão.';
CriterioVersao.MSG_MOTIVO = 'Informe o motivo da nova versão antes de publicar.';
CriterioVersao.MSG_NASCE_RASCUNHO = 'Versão nova nasce em rascunho. Publique com «Publicar versão».';
CriterioVersao.MSG_DUPLICADA = 'Já existe esta versão para o código do critério.';
CriterioVersao.MSG_NOME = 'Nome é obrigatório';
CriterioVersao.MSG_NAO_PUBLICOU = 'A versão não foi publicada. Confira a mensagem acima e tente de novo.';

/** Campos de parâmetro que não mudam depois de publicada a versão (RN-NOVO-F2-001). */
CriterioVersao.CAMPOS_PROTEGIDOS = [
    'nome', 'codigo', 'versao', 'tributo', 'valor_minimo', 'atraso_minimo_dias', 'instrumento',
    'excluir_contumaz', 'usar_score', 'threshold_score', 'pct_grupo_controle', 'desempate',
    'versao_anterior', 'motivo_alteracao', 'publicada_em', 'publicada_por'
];

/** Campos do ciclo que não mudam depois de publicado (RN-NOVO-F2-002, SEC-010). */
CriterioVersao.CAMPOS_CICLO_PROTEGIDOS = [
    'criterio', 'referencia', 'qtd_elegiveis', 'semente_sorteio', 'qtd_massificada',
    'qtd_qualificada', 'qtd_controle', 'qtd_sem_score', 'publicado_em', 'publicado_por'
];

CriterioVersao.prototype = {
    initialize: function () {},

    /**
     * Diz por que uma alteração em critério publicado ou substituído é recusada.
     * @param {GlideRecord} current registro com os valores novos
     * @param {GlideRecord} previous registro como estava gravado
     * @returns {string} a mensagem de recusa, ou '' quando a alteração é permitida
     */
    motivoRecusaAlteracao: function (current, previous) {
        var antes = this._valor(previous, 'estado');
        if (antes != 'publicada' && antes != 'substituida') {
            return '';
        }
        if (this._algumMudou(current, previous, CriterioVersao.CAMPOS_PROTEGIDOS)) {
            return CriterioVersao.MSG_VERSAO_PUBLICADA;
        }
        var depois = this._valor(current, 'estado');
        if (depois != antes && !(antes == 'publicada' && depois == 'substituida')) {
            return CriterioVersao.MSG_VERSAO_PUBLICADA;
        }
        return '';
    },

    /**
     * Diz por que uma alteração em ciclo publicado é recusada (critério aplicado e totais fixos).
     * @returns {string} a mensagem de recusa, ou '' quando a alteração é permitida
     */
    motivoRecusaAlteracaoCiclo: function (current, previous) {
        var antes = this._valor(previous, 'estado');
        if (antes != 'publicado' && antes != 'encerrado') {
            return '';
        }
        if (this._algumMudou(current, previous, CriterioVersao.CAMPOS_CICLO_PROTEGIDOS)) {
            return CriterioVersao.MSG_CICLO_PUBLICADO;
        }
        // Estado só anda para a frente: publicado → encerrado; não volta para prévia (SEC-010).
        var depois = this._valor(current, 'estado');
        if (depois != antes && !(antes == 'publicado' && depois == 'encerrado')) {
            return CriterioVersao.MSG_CICLO_PUBLICADO;
        }
        return '';
    },

    /**
     * Confere a gravação de uma versão: nome obrigatório, nasce em rascunho, não repete código +
     * versão e — por qualquer caminho (botão, form, lista, API) — só o coordenador publica, com motivo
     * quando há versão anterior. Ao publicar, completa data e autor (SEC-009).
     * @param {GlideRecord} current registro sendo gravado (pode receber data e autor da publicação)
     * @param {GlideRecord} previous como estava gravado (null na inclusão)
     * @returns {string} a mensagem de recusa, ou '' quando a gravação segue
     */
    motivoRecusaGravacao: function (current, previous) {
        if (!this._valor(current, 'nome')) {
            return CriterioVersao.MSG_NOME;
        }
        if (current.isNewRecord() && this._valor(current, 'estado') != 'rascunho') {
            return CriterioVersao.MSG_NASCE_RASCUNHO;
        }
        if (previous && this._valor(previous, 'estado') == 'rascunho' && this._valor(current, 'estado') == 'publicada') {
            if (!this._ehCoordenador()) {
                return CriterioVersao.MSG_SO_COORDENADOR;
            }
            if (this._valor(current, 'versao_anterior') && !this._valor(current, 'motivo_alteracao')) {
                return CriterioVersao.MSG_MOTIVO;
            }
            current.setValue('publicada_em', new GlideDateTime());
            current.setValue('publicada_por', gs.getUserID());
        }
        var codigo = this._valor(current, 'codigo');
        var versao = this._valor(current, 'versao');
        if (!codigo || !versao) {
            return '';
        }
        var outro = new GlideRecord(CriterioVersao.TABELA);
        outro.addQuery('codigo', codigo);
        outro.addQuery('versao', versao);
        outro.addQuery('sys_id', '!=', current.getUniqueValue());
        outro.setLimit(1);
        outro.query();
        return outro.hasNext() ? CriterioVersao.MSG_DUPLICADA : '';
    },

    /**
     * Publica a versão em rascunho. As regras da publicação (papel, motivo, data e autor) ficam na
     * business rule de gravação, que vale por qualquer caminho; a substituição da versão anterior fica
     * na business rule depois de gravar. Aqui ficam só as mensagens do botão.
     * @param {GlideRecord} criterio a versão a publicar
     * @returns {{ok: boolean, mensagem: string}}
     */
    publicar: function (criterio) {
        if (!this._ehCoordenador()) {
            return { ok: false, mensagem: CriterioVersao.MSG_SO_COORDENADOR };
        }
        if (this._valor(criterio, 'estado') != 'rascunho') {
            return { ok: false, mensagem: CriterioVersao.MSG_SO_RASCUNHO };
        }
        if (this._valor(criterio, 'versao_anterior') && !this._valor(criterio, 'motivo_alteracao')) {
            return { ok: false, mensagem: CriterioVersao.MSG_MOTIVO };
        }
        criterio.setValue('estado', 'publicada');
        if (!criterio.update()) {
            gs.warn('RF-MOD-F2-002: publicação recusada ' + criterio.getUniqueValue());
            return { ok: false, mensagem: CriterioVersao.MSG_NAO_PUBLICOU };
        }
        gs.info('RF-MOD-F2-002: versão publicada ' + criterio.getUniqueValue());
        return { ok: true, mensagem: 'Versão ' + this._valor(criterio, 'versao') + ' publicada.' };
    },

    /**
     * Depois de publicar uma versão, as outras versões publicadas do mesmo código ficam «Substituídas»:
     * há uma só versão publicada por código (RN-NOVO-F2-001).
     * @param {GlideRecord} publicada a versão que acabou de ser publicada
     * @returns {number} quantas versões foram substituídas
     */
    substituirAnteriores: function (publicada) {
        var n = 0;
        var outras = new GlideRecord(CriterioVersao.TABELA);
        outras.addQuery('codigo', publicada.getValue('codigo'));
        outras.addQuery('estado', 'publicada');
        outras.addQuery('sys_id', '!=', publicada.getUniqueValue());
        outras.query();
        while (outras.next()) {
            outras.setValue('estado', 'substituida');
            if (outras.update()) {
                n++;
            } else {
                gs.warn('RF-MOD-F2-002: não substituiu a versão ' + outras.getUniqueValue());
            }
        }
        return n;
    },

    /**
     * Cria a versão seguinte, em rascunho, ligada à versão publicada (RN-NOVO-F2-001).
     * @param {GlideRecord} publicada a versão publicada de origem
     * @returns {{ok: boolean, mensagem: string, sysId: string}}
     */
    criarNovaVersao: function (publicada) {
        if (!this._ehCoordenador()) {
            return { ok: false, mensagem: CriterioVersao.MSG_SO_COORDENADOR, sysId: '' };
        }
        if (this._valor(publicada, 'estado') != 'publicada') {
            return { ok: false, mensagem: CriterioVersao.MSG_SO_PUBLICADA, sysId: '' };
        }
        var nova = new GlideRecord(CriterioVersao.TABELA);
        nova.initialize();
        var copiar = ['nome', 'codigo', 'tributo', 'valor_minimo', 'atraso_minimo_dias', 'instrumento',
            'excluir_contumaz', 'usar_score', 'threshold_score', 'pct_grupo_controle', 'desempate'];
        for (var i = 0; i < copiar.length; i++) {
            nova.setValue(copiar[i], publicada.getValue(copiar[i]));
        }
        nova.setValue('versao', this._proximaVersao(publicada.getValue('codigo')));
        nova.setValue('estado', 'rascunho');
        nova.setValue('versao_anterior', publicada.getUniqueValue());
        var sysId = nova.insert();
        if (!sysId) {
            return { ok: false, mensagem: CriterioVersao.MSG_DUPLICADA, sysId: '' };
        }
        gs.info('RF-MOD-F2-002: nova versão ' + sysId + ' a partir de ' + publicada.getUniqueValue());
        return { ok: true, mensagem: 'Versão ' + nova.getValue('versao') + ' criada em rascunho.', sysId: sysId };
    },

    _proximaVersao: function (codigo) {
        var agg = new GlideAggregate(CriterioVersao.TABELA);
        agg.addQuery('codigo', codigo);
        agg.addAggregate('MAX', 'versao');
        agg.query();
        var maior = 0;
        if (agg.next()) {
            maior = parseInt(agg.getAggregate('MAX', 'versao'), 10) || 0;
        }
        return maior + 1;
    },

    _ehCoordenador: function () {
        return gs.hasRole(gs.getCurrentScopeName() + '.coordenador');
    },

    _algumMudou: function (current, previous, campos) {
        for (var i = 0; i < campos.length; i++) {
            if (this._valor(current, campos[i]) != this._valor(previous, campos[i])) {
                return true;
            }
        }
        return false;
    },

    _valor: function (gr, campo) {
        var v = gr.getValue(campo);
        return v === null || v === undefined ? '' : String(v);
    },

    type: 'CriterioVersao'
};
