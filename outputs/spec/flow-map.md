# Mapa de Fluxos e Telas — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft  
Última atualização: 2026-11-24  
Fonte: discovery-document.md, product-requirements.md, business-rules.md, screens-manifest.json

Sem legado: todos os fluxos são TO-BE. As 33 telas são as do `screens-manifest.json`, já instaladas na instância; a rota é a da instância e o print é o da `sn-capture`. Etapa sem tela (`—`) é processamento do sistema.

## Fluxos

| ID | Nome | Tipo | Ator principal | Origem (AS-IS) | Objetivo |
|----|------|------|----------------|----------------|----------|
| FLX-001 | Consolidação da carteira | TO-BE | Sistema | — | Juntar os débitos das 5 fontes por contribuinte a cada ciclo, com rejeições e status por fonte |
| FLX-002 | Qualificação do ciclo | TO-BE | Coordenador de Cobrança | — | Publicar a versão do critério, gerar a prévia e publicar o ciclo com o grupo de controle sorteado |
| FLX-003 | Ingestão do score de liquidez | TO-BE | Sistema | — | Receber o score simulado da UFMT e acompanhar a cobertura |
| FLX-004 | Régua multicanal | TO-BE | Coordenador de Cobrança | — | Desenhar a régua, disparar as etapas sem confirmação manual e marcar a origem das regularizações |
| FLX-005 | Cobrança qualificada | TO-BE | Atendente de Cobrança | — | Distribuir os casos e conduzir cada caso pela fila e pelo dossiê até o encerramento |
| FLX-006 | Monitoramento do ciclo | TO-BE | Coordenador de Cobrança | — | Acompanhar funil, KPIs contra metas e efeito incremental |
| FLX-007 | Exportação com trilha | TO-BE | Coordenador de Cobrança | — | Exportar listas e relatórios com registro na trilha |

## Etapas

| ID | Fluxo | Ordem | Nome | Ator | Tela | Entrada | Saída |
|----|-------|-------|------|------|------|---------|-------|
| ETP-001 | FLX-001 | 1 | Receber linhas das fontes | Administrador do app | TEL-006 | Linhas simuladas das 5 fontes | Linhas a processar |
| ETP-002 | FLX-001 | 2 | Consolidar débitos | Sistema | — | Linhas a processar | Débitos ligados ao contribuinte e rejeições |
| ETP-003 | FLX-001 | 3 | Conferir execuções por fonte | Coordenador de Cobrança | TEL-001 | Execuções do ciclo | Fontes conferidas |
| ETP-004 | FLX-001 | 4 | Conferir rejeições | Coordenador de Cobrança | TEL-002 | Linhas recusadas | Rejeições conferidas |
| ETP-005 | FLX-001 | 5 | Conferir carteira consolidada | Coordenador de Cobrança | TEL-003 | Débitos consolidados | Carteira conferida |
| ETP-006 | FLX-001 | 6 | Acompanhar parcelamentos em risco | Coordenador de Cobrança | TEL-005 | Parcelamentos com alerta | Riscos identificados |
| ETP-007 | FLX-001 | 7 | Consultar contribuintes | Coordenador de Cobrança | TEL-032 | Filtro de busca | Contribuinte localizado |
| ETP-008 | FLX-001 | 8 | Abrir a visão única | Atendente de Cobrança | TEL-004 | Contribuinte da própria carteira | Histórico consultado |
| ETP-009 | FLX-002 | 1 | Escolher o critério | Coordenador de Cobrança | TEL-007 | Lista de versões | Versão escolhida |
| ETP-010 | FLX-002 | 2 | Editar e publicar a versão | Coordenador de Cobrança | TEL-008 | Versão em rascunho | Versão publicada |
| ETP-011 | FLX-002 | 3 | Gerar a prévia do ciclo | Coordenador de Cobrança | TEL-009 | Versão publicada | Ciclo em prévia |
| ETP-012 | FLX-002 | 4 | Conferir a carteira segmentada | Coordenador de Cobrança | TEL-010 | Ciclo em prévia | Segmentação conferida |
| ETP-013 | FLX-002 | 5 | Publicar o ciclo e sortear o controle | Coordenador de Cobrança | TEL-009 | Segmentação conferida | Ciclo publicado com grupo de controle |
| ETP-014 | FLX-003 | 1 | Ingerir carga de score | Sistema | — | Carga simulada da UFMT | Scores válidos e inválidos |
| ETP-015 | FLX-003 | 2 | Conferir scores ingeridos | Coordenador de Cobrança | TEL-012 | Scores da carga | Scores conferidos |
| ETP-016 | FLX-003 | 3 | Acompanhar a cobertura do score | Coordenador de Cobrança | TEL-011 | Scores por tributo e status | Cobertura conhecida |
| ETP-017 | FLX-004 | 1 | Escolher a régua | Coordenador de Cobrança | TEL-013 | Lista de réguas | Régua escolhida |
| ETP-018 | FLX-004 | 2 | Desenhar e ativar a régua | Coordenador de Cobrança | TEL-014 | Régua com etapas | Régua ativa |
| ETP-019 | FLX-004 | 3 | Disparar etapa | Sistema | — | Régua ativa e ciclo publicado | Comunicações enviadas, puladas ou com falha |
| ETP-020 | FLX-004 | 4 | Acompanhar disparos e reenviar falhas | Coordenador de Cobrança | TEL-015 | Comunicações do ciclo | Falhas reenviadas |
| ETP-021 | FLX-004 | 5 | Conferir consentimentos | Coordenador de Cobrança | TEL-017 | Opt-in e opt-out por canal | Consentimentos conferidos |
| ETP-022 | FLX-004 | 6 | Configurar canais simulados | Administrador do app | TEL-018 | Canais e interruptores | Canais configurados |
| ETP-023 | FLX-004 | 7 | Conferir retornos de envio | Administrador do app | TEL-019 | Retornos simulados | Retornos conferidos |
| ETP-024 | FLX-004 | 8 | Registrar regularização com origem | Sistema | TEL-020 | Pagamento ou parcelamento | Regularização marcada |
| ETP-025 | FLX-004 | 9 | Avaliar efetividade da régua | Coordenador de Cobrança | TEL-016 | Comunicações por canal e status | Ajustes na régua |
| ETP-026 | FLX-005 | 1 | Distribuir casos | Coordenador de Cobrança | TEL-021 | Casos sem atendente | Casos atribuídos |
| ETP-027 | FLX-005 | 2 | Conferir carga por atendente | Coordenador de Cobrança | TEL-022 | Casos atribuídos | Carga equilibrada |
| ETP-028 | FLX-005 | 3 | Abrir a própria fila | Atendente de Cobrança | TEL-023 | Casos do atendente | Caso escolhido |
| ETP-029 | FLX-005 | 4 | Consultar o dossiê | Atendente de Cobrança | TEL-024 | Caso escolhido | Caso em condução |
| ETP-030 | FLX-005 | 5 | Registrar interação | Atendente de Cobrança | TEL-025 | Contato com o contribuinte | Interação registrada |
| ETP-031 | FLX-005 | 6 | Encerrar o caso | Sistema | TEL-024 | Regularização ou decisão do atendente | Caso encerrado |
| ETP-032 | FLX-006 | 1 | Cadastrar metas | Coordenador de Cobrança | TEL-030 | Indicador, tributo, canal e período | Metas vigentes |
| ETP-033 | FLX-006 | 2 | Acompanhar o funil | Coordenador de Cobrança | TEL-026 | Carteira do ciclo | Funil conhecido |
| ETP-034 | FLX-006 | 3 | Acompanhar regularizações por tributo | Coordenador de Cobrança | TEL-027 | Regularizações | KPIs por tributo |
| ETP-035 | FLX-006 | 4 | Acompanhar regularizações por origem e canal | Coordenador de Cobrança | TEL-028 | Regularizações | KPIs por origem |
| ETP-036 | FLX-006 | 5 | Conferir efeito incremental | Coordenador de Cobrança | TEL-029 | Ciclos encerrados | Efeito incremental por ciclo |
| ETP-037 | FLX-006 | 6 | Ver os próprios indicadores | Atendente de Cobrança | TEL-031 | Regularizações do atendente | Resultado individual |
| ETP-038 | FLX-007 | 1 | Exportar lista ou relatório | Coordenador de Cobrança | TEL-003 | Lista filtrada | Arquivo CSV ou PDF |
| ETP-039 | FLX-007 | 2 | Conferir a trilha de exportação | Administrador do app | TEL-033 | Exportações registradas | Trilha conferida |

## Telas

| ID | Nome | Rota | Módulo | Estados UI | RF/PR | Screenshot |
|----|------|------|--------|------------|-------|------------|
| TEL-001 | Integrações e sincronização | /x_2326104_cob_sincronizacao_list.do | MOD-F1 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007, PR-MOD-F1-001 | screens/TEL-001.png |
| TEL-002 | Log de rejeições | /x_2326104_cob_rejeicao_list.do | MOD-F1 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F1-002, PR-MOD-F1-002 | screens/TEL-002.png |
| TEL-003 | Carteira consolidada | /x_2326104_cob_debito_list.do | MOD-F1 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002, PR-MOD-F1-003 | screens/TEL-003.png |
| TEL-004 | Visão única do contribuinte | /x_2326104_cob_contribuinte.do?sys_id=ad022df8dc8a447e8cd5eecf3b0f84d3 | MOD-F1 | Carregando, Sucesso, Erro de validação, Erro de sistema | RF-MOD-F1-005, RF-MOD-T-003, PR-MOD-F1-004 | screens/TEL-004.png |
| TEL-005 | Parcelamentos em risco | /x_2326104_cob_parcelamento_list.do | MOD-F1 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F1-004, PR-MOD-F1-005 | screens/TEL-005.png |
| TEL-006 | Staging de fontes (Simulado) | /x_2326104_cob_debito_stg_list.do | MOD-F1 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F1-001, RF-MOD-F1-002, PR-MOD-F1-006 | screens/TEL-006.png |
| TEL-007 | Critérios de qualificação | /x_2326104_cob_criterio_list.do | MOD-F2 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F2-001, RF-MOD-F2-002, PR-MOD-F2-001 | screens/TEL-007.png |
| TEL-008 | Versão do critério de qualificação | /x_2326104_cob_criterio.do?sys_id=d5fc10ccc165417891772b280ae1b4c2 | MOD-F2 | Carregando, Sucesso, Erro de validação, Erro de sistema | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005, PR-MOD-F2-002 | screens/TEL-008.png |
| TEL-009 | Ciclo de qualificação (prévia) | /x_2326104_cob_ciclo.do?sys_id=67fc0380efcd42fe9d3da42308b5384d | MOD-F2 | Carregando, Sucesso, Erro de validação, Erro de sistema | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006, PR-MOD-F2-003 | screens/TEL-009.png |
| TEL-010 | Carteira segmentada | /x_2326104_cob_segmentacao_list.do | MOD-F2 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002, PR-MOD-F2-004 | screens/TEL-010.png |
| TEL-011 | Painel do score de liquidez | /sys_report_template.do?jvar_report_id=2b9fb315939349ffb1dfb40c6cf6af59 | MOD-F3 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F3-006, PR-MOD-F3-001 | screens/TEL-011.png |
| TEL-012 | Scores ingeridos (Simulado) | /x_2326104_cob_score_sim_list.do | MOD-F3 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005, PR-MOD-F3-002 | screens/TEL-012.png |
| TEL-013 | Réguas de cobrança | /x_2326104_cob_regua_list.do | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-001, PR-MOD-F4-001 | screens/TEL-013.png |
| TEL-014 | Editor de régua | /x_2326104_cob_regua.do?sys_id=9a4d959966c4468794d7daa6482851ff | MOD-F4 | Carregando, Sucesso, Erro de validação, Erro de sistema | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009, PR-MOD-F4-002 | screens/TEL-014.png |
| TEL-015 | Execução e status de disparo | /x_2326104_cob_comunicacao_list.do | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006, PR-MOD-F4-003 | screens/TEL-015.png |
| TEL-016 | Efetividade da régua | /sys_report_template.do?jvar_report_id=beadc90588a64760ac1c4ff10e3607e9 | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-008, PR-MOD-F4-004 | screens/TEL-016.png |
| TEL-017 | Consentimentos por canal | /x_2326104_cob_consentimento_list.do | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-005, PR-MOD-F4-005 | screens/TEL-017.png |
| TEL-018 | Canais de envio (Simulado) | /x_2326104_cob_canal_sim_list.do | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-004, RF-MOD-F4-005, PR-MOD-F4-006 | screens/TEL-018.png |
| TEL-019 | Retorno de envio (Simulado) | /x_2326104_cob_envio_sim_list.do | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-006, PR-MOD-F4-007 | screens/TEL-019.png |
| TEL-020 | Regularizações | /x_2326104_cob_regularizacao_list.do | MOD-F4 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004, PR-MOD-F4-008 | screens/TEL-020.png |
| TEL-021 | Distribuição da carteira qualificada | /x_2326104_cob_caso_list.do | MOD-F5 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F5-001, PR-MOD-F5-001 | screens/TEL-021.png |
| TEL-022 | Carga por atendente | /sys_report_template.do?jvar_report_id=ff58b093be4d42db947a1cfcc7ddd9df | MOD-F5 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F5-001, PR-MOD-F5-002 | screens/TEL-022.png |
| TEL-023 | Minha fila | /x_2326104_cob_caso_list.do?sysparm_view=x_2326104_cob_tel_023 | MOD-F5 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F5-002, RF-MOD-F5-007, PR-MOD-F5-003 | screens/TEL-023.png |
| TEL-024 | Dossiê do caso | /x_2326104_cob_caso.do?sys_id=541104d723384cd0bd1aaa40e178ae60 | MOD-F5 | Carregando, Sucesso, Erro de validação, Erro de sistema | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003, PR-MOD-F5-004 | screens/TEL-024.png |
| TEL-025 | Registro de interação | /x_2326104_cob_interacao.do?sys_id=385ad7c968ff4f8c93f0d9f1e64350e0 | MOD-F5 | Carregando, Sucesso, Erro de validação, Erro de sistema | RF-MOD-F5-005, PR-MOD-F5-005 | screens/TEL-025.png |
| TEL-026 | Funil do crédito | /sys_report_template.do?jvar_report_id=1a1426065dd943ab896d646f7625bb90 | MOD-F6 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F6-001, RF-MOD-F6-007, PR-MOD-F6-001 | screens/TEL-026.png |
| TEL-027 | Regularizações por tributo | /sys_report_template.do?jvar_report_id=95113251015f4d14bc9811a61ca6b516 | MOD-F6 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F6-002, RF-MOD-F6-005, RF-MOD-F6-007, PR-MOD-F6-002 | screens/TEL-027.png |
| TEL-028 | Regularizações por origem e canal | /sys_report_template.do?jvar_report_id=49853964652145c68ac2fa5593df1070 | MOD-F6 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F6-003, RF-MOD-F6-007, PR-MOD-F6-003 | screens/TEL-028.png |
| TEL-029 | Efeito incremental por ciclo | /x_2326104_cob_ciclo_list.do | MOD-F6 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F6-004, PR-MOD-F6-004 | screens/TEL-029.png |
| TEL-030 | Metas de KPI | /x_2326104_cob_meta_list.do | MOD-F6 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F6-002, RF-MOD-F6-005, PR-MOD-F6-005 | screens/TEL-030.png |
| TEL-031 | Meus indicadores | /sys_report_template.do?jvar_report_id=f40880cae4d8479b8758361ce063a033 | MOD-F6 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-F6-006, PR-MOD-F6-006 | screens/TEL-031.png |
| TEL-032 | Contribuintes | /x_2326104_cob_contribuinte_list.do | MOD-F1 | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-T-002, RF-MOD-T-003, PR-MOD-F1-007 | screens/TEL-032.png |
| TEL-033 | Trilha de exportação | /x_2326104_cob_exportacao_list.do | MOD-T | Carregando, Sucesso, Vazio, Erro de sistema | RF-MOD-T-001, PR-MOD-T-001 | screens/TEL-033.png |

## Transições

| ID | De | Para | Gatilho | Regras | Estado da entidade |
|----|----|------|---------|--------|--------------------|
| TRS-001 | ETP-001 | ETP-002 | Início do ciclo mensal | RN-NOVO-F1-006 | Sincronizacao.sucesso |
| TRS-002 | ETP-002 | ETP-003 | Consolidação concluída, com ou sem falha de fonte | RN-NOVO-F1-005, RN-NOVO-F1-001 | Debito.aberto |
| TRS-003 | ETP-002 | ETP-004 | Linha com documento inválido | RN-NOVO-F1-004 | Rejeicao.documento_invalido |
| TRS-004 | ETP-003 | ETP-005 | Execuções conferidas | — | — |
| TRS-005 | ETP-005 | ETP-006 | Parcela em atraso detectada | RN-NOVO-F1-007 | Parcelamento.em_risco |
| TRS-006 | ETP-007 | ETP-008 | Atendente abre contribuinte da própria carteira | RN-NOVO-F5-007 | — |
| TRS-007 | ETP-009 | ETP-010 | Coordenador cria nova versão | RN-NOVO-F2-001 | Criterio.rascunho |
| TRS-008 | ETP-010 | ETP-011 | Coordenador clica em «Publicar versão» | RN-NOVO-F2-001 | Criterio.publicada |
| TRS-009 | ETP-011 | ETP-012 | Coordenador clica em «Gerar prévia» | RN-NOVO-F2-003, RN-NOVO-F2-004, RN-NOVO-F3-002 | Ciclo.previa |
| TRS-010 | ETP-012 | ETP-013 | Coordenador clica em «Publicar ciclo» | RN-NOVO-F2-002, RN-NOVO-F2-005, RN-NOVO-F2-006 | Ciclo.publicado |
| TRS-011 | ETP-013 | ETP-019 | Ciclo publicado libera o disparo da régua | RN-NOVO-F2-005, RN-NOVO-F4-002 | Segmentacao.identificado |
| TRS-012 | ETP-014 | ETP-015 | Carga ingerida | RN-NOVO-F3-003 | Score_sim.valido |
| TRS-013 | ETP-015 | ETP-016 | Scores conferidos | RN-NOVO-F3-002 | Score_sim.sem_score |
| TRS-014 | ETP-017 | ETP-018 | Coordenador abre a régua | — | — |
| TRS-015 | ETP-018 | ETP-019 | Coordenador clica em «Ativar» | RN-NOVO-F4-001 | — |
| TRS-016 | ETP-019 | ETP-020 | Etapa disparada | RN-NOVO-F4-003, RN-NOVO-F4-004, RN-NOVO-F4-005 | Comunicacao.enviada |
| TRS-017 | ETP-020 | ETP-019 | Prazo da etapa termina sem pagamento: próxima etapa agendada | RN-NOVO-F4-001 | Comunicacao.agendada |
| TRS-018 | ETP-019 | ETP-024 | Pagamento ou parcelamento durante a régua | RN-NOVO-F1-002, RN-NOVO-F4-006, RN-NOVO-F4-007 | Regularizacao.resposta_cobranca |
| TRS-019 | ETP-019 | ETP-026 | Última etapa vence sem pagamento | RN-NOVO-F4-008 | Comunicacao.encerrada |
| TRS-020 | ETP-020 | ETP-020 | Coordenador clica em «Reenviar» | RN-NOVO-F4-005, RN-NOVO-F5-005 | Comunicacao.entregue |
| TRS-021 | ETP-026 | ETP-027 | Distribuição concluída | RN-NOVO-F5-001 | Caso.selecionado |
| TRS-022 | ETP-027 | ETP-028 | Casos atribuídos aparecem na fila | RN-NOVO-F5-002, RN-NOVO-F5-007 | — |
| TRS-023 | ETP-028 | ETP-029 | Atendente abre o caso | RN-NOVO-F5-003, RN-NOVO-F5-004, RN-NOVO-F5-007 | Caso.conducao |
| TRS-024 | ETP-029 | ETP-030 | Atendente clica em «Registrar interação» | RN-NOVO-F5-005 | — |
| TRS-025 | ETP-030 | ETP-029 | Interação salva | RN-NOVO-F5-005 | — |
| TRS-026 | ETP-029 | ETP-031 | Regularização total ou «Encerrar caso» | RN-NOVO-F5-006 | Caso.encerrado |
| TRS-027 | ETP-031 | — | Caso encerrado | — | — |
| TRS-028 | ETP-032 | ETP-033 | Metas cadastradas | — | — |
| TRS-029 | ETP-033 | ETP-034 | Coordenador abre KPIs por tributo | RN-NOVO-F6-002 | Segmentacao.regularizado |
| TRS-030 | ETP-034 | ETP-035 | Coordenador abre KPIs por origem | RN-NOVO-F4-006 | — |
| TRS-031 | ETP-035 | ETP-036 | Ciclo encerrado | RN-NOVO-F6-001 | Ciclo.encerrado |
| TRS-032 | ETP-036 | — | Efeito incremental conferido | — | — |
| TRS-033 | ETP-038 | ETP-039 | Exportação registrada | RN-NOVO-T-001 | Exportacao.registrada |
| TRS-034 | ETP-039 | — | Trilha conferida | — | — |
| TRS-035 | ETP-024 | ETP-031 | Regularização de contribuinte com caso aberto | RN-NOVO-F5-006 | Caso.encerrado |
| TRS-036 | ETP-004 | ETP-005 | Rejeições conferidas | — | — |
| TRS-037 | ETP-016 | — | Cobertura conferida | — | — |
| TRS-038 | ETP-021 | ETP-019 | Consentimento registrado vale no próximo disparo | RN-NOVO-F4-003 | — |
| TRS-039 | ETP-022 | ETP-019 | Interruptor de falha ligado ou desligado | RN-NOVO-F4-004 | — |
| TRS-040 | ETP-037 | — | Indicadores conferidos | RN-NOVO-F5-007 | — |
| TRS-041 | ETP-006 | — | Riscos acompanhados | — | — |
| TRS-042 | ETP-008 | — | Histórico consultado | — | — |
| TRS-043 | ETP-023 | — | Retornos conferidos | — | — |
| TRS-044 | ETP-025 | ETP-018 | Coordenador ajusta a régua | RN-NOVO-F4-006 | — |

## Amarração Técnica

Preenchida pela `spec-data-model` (coluna Entidades). Não há contratos de API no piloto (etapa opcional no v0): Endpoints = `—`.

| Tela | Entidades | Endpoints |
|------|-----------|-----------|
| TEL-001 | x_2326104_cob_sincronizacao | — |
| TEL-002 | x_2326104_cob_rejeicao | — |
| TEL-003 | x_2326104_cob_debito | — |
| TEL-004 | x_2326104_cob_contribuinte, x_2326104_cob_debito, x_2326104_cob_parcelamento, x_2326104_cob_comunicacao, x_2326104_cob_consentimento, x_2326104_cob_regularizacao | — |
| TEL-005 | x_2326104_cob_parcelamento | — |
| TEL-006 | x_2326104_cob_debito_stg | — |
| TEL-007 | x_2326104_cob_criterio | — |
| TEL-008 | x_2326104_cob_criterio, x_2326104_cob_ciclo | — |
| TEL-009 | x_2326104_cob_ciclo, x_2326104_cob_criterio, x_2326104_cob_segmentacao | — |
| TEL-010 | x_2326104_cob_segmentacao | — |
| TEL-011 | x_2326104_cob_score_sim | — |
| TEL-012 | x_2326104_cob_score_sim | — |
| TEL-013 | x_2326104_cob_regua | — |
| TEL-014 | x_2326104_cob_regua, x_2326104_cob_regua_etapa, x_2326104_cob_comunicacao | — |
| TEL-015 | x_2326104_cob_comunicacao | — |
| TEL-016 | x_2326104_cob_comunicacao | — |
| TEL-017 | x_2326104_cob_consentimento | — |
| TEL-018 | x_2326104_cob_canal_sim | — |
| TEL-019 | x_2326104_cob_envio_sim | — |
| TEL-020 | x_2326104_cob_regularizacao | — |
| TEL-021 | x_2326104_cob_caso | — |
| TEL-022 | x_2326104_cob_caso | — |
| TEL-023 | x_2326104_cob_caso | — |
| TEL-024 | x_2326104_cob_caso, x_2326104_cob_contribuinte, x_2326104_cob_debito, x_2326104_cob_parcelamento, x_2326104_cob_comunicacao, x_2326104_cob_interacao, x_2326104_cob_regularizacao | — |
| TEL-025 | x_2326104_cob_interacao | — |
| TEL-026 | x_2326104_cob_segmentacao | — |
| TEL-027 | x_2326104_cob_regularizacao | — |
| TEL-028 | x_2326104_cob_regularizacao | — |
| TEL-029 | x_2326104_cob_ciclo | — |
| TEL-030 | x_2326104_cob_meta | — |
| TEL-031 | x_2326104_cob_regularizacao | — |
| TEL-032 | x_2326104_cob_contribuinte | — |
| TEL-033 | x_2326104_cob_exportacao | — |

## Cobertura

```
MÉTRICAS:
  fluxos=7 etapas=39 telas=33 transições=44
  % etapas com tela: 92.3%
  % transições com regra RN: 75.0%
  telas órfãs: nenhuma
  fluxos sem etapas: nenhum
  matriz estado×tela:
    Caso.conducao → TEL-023, TEL-024
    Caso.encerrado → TEL-020, TEL-024
    Caso.selecionado → TEL-021, TEL-022
    Ciclo.encerrado → TEL-028, TEL-029
    Ciclo.previa → TEL-009, TEL-010
    Ciclo.publicado → TEL-009, TEL-010
    Comunicacao.agendada → TEL-015
    Comunicacao.encerrada → TEL-021
    Comunicacao.entregue → TEL-015
    Comunicacao.enviada → TEL-015
    Criterio.publicada → TEL-008, TEL-009
    Criterio.rascunho → TEL-007, TEL-008
    Debito.aberto → TEL-001
    Exportacao.registrada → TEL-003, TEL-033
    Parcelamento.em_risco → TEL-003, TEL-005
    Regularizacao.resposta_cobranca → TEL-020
    Rejeicao.documento_invalido → TEL-002
    Score_sim.sem_score → TEL-011, TEL-012
    Score_sim.valido → TEL-012
    Segmentacao.identificado → TEL-009
    Segmentacao.regularizado → TEL-026, TEL-027
    Sincronizacao.sucesso → TEL-006
  % telas com amarração técnica: 100.0%
RESULTADO: OK (0 erro(s), 0 aviso(s))
```

Avisos tratados:
- `check-flowmap.py --data-model` acusa as entidades da amarração como desconhecidas porque procura `boundedContexts[].entities[]` (formato do kit); o `data-model.json` deste projeto segue o formato da prévia lido pelo `sn-scaffold` (design item 23). Os nomes da coluna Entidades conferem com `entities[].name` do `data-model.json` (conferência por script na execução da `spec-data-model`).
- 3 etapas sem tela (ETP-002, ETP-014, ETP-019) são processamento do sistema (consolidação, ingestão do score, disparo).
- 11 transições sem RN são navegação entre telas de consulta.

