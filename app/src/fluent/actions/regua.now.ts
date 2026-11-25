// RF-MOD-F4-010 — as 4 custom actions da régua como Flow (design ux-cobranca-v2-regua-flow.md, B3 e Anexo A).
// Cada action tem um passo de script que só chama o ReguaMotor; a regra fica no Script Include (testável por ATF).
// Chamada por script: sn_fd.FlowAPI.getRunner().action('x_2326104_cob.<internalName>') com a inscrição como GlideRecord.
import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { BooleanColumn, DateTimeColumn, IntegerColumn, ReferenceColumn, StringColumn } from '@servicenow/sdk/core'

export const agendarEtapa = Action({
    $id: Now.ID['regua_acao_agendar'],
    name: 'Régua: agendar etapa',
    internalName: 'regua_agendar_etapa',
    description: 'Calcula quando a etapa (ou o fecho, ordem = última + 1) roda; segue=false se a inscrição não está ativa.',
    inputs: {
        inscricao: ReferenceColumn({ label: 'Inscrição', referenceTable: 'x_2326104_cob_regua_inscricao', mandatory: true }),
        ordem: IntegerColumn({ label: 'Ordem', mandatory: true }),
    },
    outputs: { segue: BooleanColumn({ label: 'Segue' }), executar_em: DateTimeColumn({ label: 'Executar em' }) },
}, (params) => {
    const passo = wfa.actionStep(actionStep.script, { $id: Now.ID['regua_acao_agendar_script'], label: 'Agendar' }, {
        required_run_time: 'instance',
        script: Now.include('../../server/regua/acao-agendar-etapa.js'),
        inputVariables: {
            inscricao: { label: 'Inscrição', value: wfa.dataPill(params.inputs.inscricao, 'reference') },
            ordem: { label: 'Ordem', value: wfa.dataPill(params.inputs.ordem, 'integer') },
        },
        outputVariables: { segue: BooleanColumn({ label: 'Segue' }), executar_em: DateTimeColumn({ label: 'Executar em' }) },
    })
    wfa.assignActionOutputs(params.outputs, {
        segue: wfa.dataPill(passo.segue, 'boolean'),
        executar_em: wfa.dataPill(passo.executar_em, 'glide_date_time'),
    })
})

export const checarGuardas = Action({
    $id: Now.ID['regua_acao_guardas'],
    name: 'Régua: checar guardas',
    internalName: 'regua_checar_guardas',
    description: 'Confere régua pausada, grupo de controle e regularização; com motivo, encerra a inscrição e devolve segue=false.',
    inputs: {
        inscricao: ReferenceColumn({ label: 'Inscrição', referenceTable: 'x_2326104_cob_regua_inscricao', mandatory: true }),
    },
    outputs: { segue: BooleanColumn({ label: 'Segue' }), motivo: StringColumn({ label: 'Motivo', maxLength: 40 }) },
}, (params) => {
    const passo = wfa.actionStep(actionStep.script, { $id: Now.ID['regua_acao_guardas_script'], label: 'Checar guardas' }, {
        required_run_time: 'instance',
        script: Now.include('../../server/regua/acao-checar-guardas.js'),
        inputVariables: {
            inscricao: { label: 'Inscrição', value: wfa.dataPill(params.inputs.inscricao, 'reference') },
        },
        outputVariables: { segue: BooleanColumn({ label: 'Segue' }), motivo: StringColumn({ label: 'Motivo', maxLength: 40 }) },
    })
    wfa.assignActionOutputs(params.outputs, {
        segue: wfa.dataPill(passo.segue, 'boolean'),
        motivo: wfa.dataPill(passo.motivo, 'string'),
    })
})

export const enviarComunicacao = Action({
    $id: Now.ID['regua_acao_enviar'],
    name: 'Régua: enviar comunicação (simulado)',
    internalName: 'regua_enviar_comunicacao',
    description: 'Envia a etapa pelo canal simulado com fallback, opt-in, opt-out e teto; uma comunicação por inscrição e etapa.',
    inputs: {
        inscricao: ReferenceColumn({ label: 'Inscrição', referenceTable: 'x_2326104_cob_regua_inscricao', mandatory: true }),
        ordem: IntegerColumn({ label: 'Ordem', mandatory: true }),
    },
    outputs: {
        status: StringColumn({ label: 'Status', maxLength: 20 }),
        canal: StringColumn({ label: 'Canal', maxLength: 20 }),
        comunicacao: ReferenceColumn({ label: 'Comunicação', referenceTable: 'x_2326104_cob_comunicacao' }),
    },
}, (params) => {
    const passo = wfa.actionStep(actionStep.script, { $id: Now.ID['regua_acao_enviar_script'], label: 'Enviar' }, {
        required_run_time: 'instance',
        script: Now.include('../../server/regua/acao-enviar-comunicacao.js'),
        inputVariables: {
            inscricao: { label: 'Inscrição', value: wfa.dataPill(params.inputs.inscricao, 'reference') },
            ordem: { label: 'Ordem', value: wfa.dataPill(params.inputs.ordem, 'integer') },
        },
        outputVariables: {
            status: StringColumn({ label: 'Status', maxLength: 20 }),
            canal: StringColumn({ label: 'Canal', maxLength: 20 }),
            comunicacao: ReferenceColumn({ label: 'Comunicação', referenceTable: 'x_2326104_cob_comunicacao' }),
        },
    })
    wfa.assignActionOutputs(params.outputs, {
        status: wfa.dataPill(passo.status, 'string'),
        canal: wfa.dataPill(passo.canal, 'string'),
        comunicacao: wfa.dataPill(passo.comunicacao, 'reference'),
    })
})

export const escalonar = Action({
    $id: Now.ID['regua_acao_escalonar'],
    name: 'Régua: escalonar',
    internalName: 'regua_escalonar',
    description: 'Depois da última etapa e do prazo final: encaminha à cobrança ativa ou à qualificada, conforme a última etapa.',
    inputs: {
        inscricao: ReferenceColumn({ label: 'Inscrição', referenceTable: 'x_2326104_cob_regua_inscricao', mandatory: true }),
    },
    outputs: {
        destino: StringColumn({ label: 'Destino', maxLength: 40 }),
        contato: ReferenceColumn({ label: 'Contato', referenceTable: 'x_2326104_cob_contato' }),
    },
}, (params) => {
    const passo = wfa.actionStep(actionStep.script, { $id: Now.ID['regua_acao_escalonar_script'], label: 'Escalonar' }, {
        required_run_time: 'instance',
        script: Now.include('../../server/regua/acao-escalonar.js'),
        inputVariables: {
            inscricao: { label: 'Inscrição', value: wfa.dataPill(params.inputs.inscricao, 'reference') },
        },
        outputVariables: {
            destino: StringColumn({ label: 'Destino', maxLength: 40 }),
            contato: ReferenceColumn({ label: 'Contato', referenceTable: 'x_2326104_cob_contato' }),
        },
    })
    wfa.assignActionOutputs(params.outputs, {
        destino: wfa.dataPill(passo.destino, 'string'),
        contato: wfa.dataPill(passo.contato, 'reference'),
    })
})
