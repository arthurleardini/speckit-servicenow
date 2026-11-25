// gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json) — não editar à mão
// Régua Parcelamentos (parcelamentos): 3 etapas e o fecho. Design ux-cobranca-v2-regua-flow.md, B2 e Anexo A (US-MOD-F4-010).
import '@servicenow/sdk/global'
import { Flow, FlowStage, wfa, trigger, action } from '@servicenow/sdk/automation'
import { agendarEtapa, checarGuardas, enviarComunicacao, escalonar } from '../actions/regua.now'

export const flow_regua_parcelamentos = Flow(
    {
        $id: Now.ID['flow_regua_parcelamentos'],
        name: "Régua: Parcelamentos",
        internalName: "regua_parcelamentos",
        runAs: 'system',
        description: "Gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json, parcelamentos). Uma inscrição ativa na régua Parcelamentos percorre as etapas e o encaminhamento.",
        stages: {
            e1: FlowStage({ label: 'Etapa 1', value: 'e1' }),
            e2: FlowStage({ label: 'Etapa 2', value: 'e2' }),
            e3: FlowStage({ label: 'Etapa 3', value: 'e3' }),
            fim: FlowStage({ label: 'Encaminhamento', value: 'fim' }),
        },
    },
    wfa.trigger(trigger.record.created, { $id: Now.ID['flow_regua_parcelamentos_gatilho'] },
        { table: 'x_2326104_cob_regua_inscricao', condition: 'regua.codigo=parcelamentos^status=ativa', run_flow_in: 'background' }),
    (params) => {
        wfa.flowLogic.tryCatch({ $id: Now.ID['parcelamentos_try'] }, {
            try: () => {
                // ---- etapa 1 (stage «Etapa 1») ----
                wfa.stage(params.stages.e1)
                const age1 = wfa.action(agendarEtapa, { $id: Now.ID['parcelamentos_e1_agendar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 1 })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_e1_ag_parar'], condition: `${wfa.dataPill(age1.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_e1_ag_fim'] }) })
                wfa.flowLogic.waitForADuration({ $id: Now.ID['parcelamentos_e1_esperar'], durationType: 'relative_duration',
                    duration: Duration({ seconds: 1 }), relativeOperator: 'after',
                    relativeDatetime: wfa.dataPill(age1.executar_em, 'glide_date_time') })
                const ge1 = wfa.action(checarGuardas, { $id: Now.ID['parcelamentos_e1_guardas'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_e1_parar'], condition: `${wfa.dataPill(ge1.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_e1_fim'] }) })
                wfa.action(enviarComunicacao, { $id: Now.ID['parcelamentos_e1_enviar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 1 })

                // ---- etapa 2 (stage «Etapa 2») ----
                wfa.stage(params.stages.e2)
                const age2 = wfa.action(agendarEtapa, { $id: Now.ID['parcelamentos_e2_agendar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 2 })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_e2_ag_parar'], condition: `${wfa.dataPill(age2.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_e2_ag_fim'] }) })
                wfa.flowLogic.waitForADuration({ $id: Now.ID['parcelamentos_e2_esperar'], durationType: 'relative_duration',
                    duration: Duration({ seconds: 1 }), relativeOperator: 'after',
                    relativeDatetime: wfa.dataPill(age2.executar_em, 'glide_date_time') })
                const ge2 = wfa.action(checarGuardas, { $id: Now.ID['parcelamentos_e2_guardas'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_e2_parar'], condition: `${wfa.dataPill(ge2.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_e2_fim'] }) })
                wfa.action(enviarComunicacao, { $id: Now.ID['parcelamentos_e2_enviar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 2 })

                // ---- etapa 3 (stage «Etapa 3») ----
                wfa.stage(params.stages.e3)
                const age3 = wfa.action(agendarEtapa, { $id: Now.ID['parcelamentos_e3_agendar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 3 })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_e3_ag_parar'], condition: `${wfa.dataPill(age3.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_e3_ag_fim'] }) })
                wfa.flowLogic.waitForADuration({ $id: Now.ID['parcelamentos_e3_esperar'], durationType: 'relative_duration',
                    duration: Duration({ seconds: 1 }), relativeOperator: 'after',
                    relativeDatetime: wfa.dataPill(age3.executar_em, 'glide_date_time') })
                const ge3 = wfa.action(checarGuardas, { $id: Now.ID['parcelamentos_e3_guardas'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_e3_parar'], condition: `${wfa.dataPill(ge3.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_e3_fim'] }) })
                wfa.action(enviarComunicacao, { $id: Now.ID['parcelamentos_e3_enviar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 3 })

                // ---- fecho (stage «Encaminhamento»): ordem 4 = depois da última etapa e do prazo final ----
                wfa.stage(params.stages.fim)
                const agfim = wfa.action(agendarEtapa, { $id: Now.ID['parcelamentos_fim_agendar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 4 })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_fim_ag_parar'], condition: `${wfa.dataPill(agfim.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_fim_ag_fim'] }) })
                wfa.flowLogic.waitForADuration({ $id: Now.ID['parcelamentos_fim_esperar'], durationType: 'relative_duration',
                    duration: Duration({ seconds: 1 }), relativeOperator: 'after',
                    relativeDatetime: wfa.dataPill(agfim.executar_em, 'glide_date_time') })
                const gfim = wfa.action(checarGuardas, { $id: Now.ID['parcelamentos_fim_guardas'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
                wfa.flowLogic.if({ $id: Now.ID['parcelamentos_fim_parar'], condition: `${wfa.dataPill(gfim.segue, 'boolean')}=false` },
                    () => { wfa.flowLogic.endFlow({ $id: Now.ID['parcelamentos_fim_fim'] }) })
                wfa.action(escalonar, { $id: Now.ID['parcelamentos_fim_escalonar'] },
                    { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
            },
            catch: () => {
                wfa.action(action.core.updateRecord, { $id: Now.ID['parcelamentos_erro'] }, {
                    table_name: 'x_2326104_cob_regua_inscricao',
                    record: wfa.dataPill(params.trigger.current, 'reference'),
                    values: TemplateValue({ status: 'erro', detalhe: 'Erro na execução do Flow; ver detalhes da execução' }),
                })
            },
        })
    })
