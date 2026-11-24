# De-para de IDs — Plano 2.6 Cobrança → Speckit ServiceNow

> **Versão:** 0.1 · **Data:** 2026-11-24 · Insumo do piloto (item 38 do design `docs/designs/speckit-servicenow-v0.md`). Sem dado de pessoa: só IDs e enunciados do plano.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial |

## 1. Regras de conversão

| Família | No plano | No Explore (`outputs/explore/`) | No Plan (`outputs/spec/`) |
|---|---|---|---|
| Funcionalidade | `F<n>` | `MOD-F<n>` | `MOD-F<n>` |
| Requisito | `F<n>/RF-<nn>` | `RF-<n><nn>` (bloco por módulo) | `RF-MOD-F<n>-<nnn>` |
| Transversal | `RF-T-<nn>` | `RF-9<nn>` (módulo `MOD-T`) | `RF-MOD-T-<nnn>` |
| Critério de aceite | `F<n>/CT-<nn>` | não existe no Explore | `CT-MOD-F<n>-<nnn>` |
| Regra de negócio | `RN-<nn>`, `RN-AI-01`, `RNF-T-CONF-01` | `RN-<nnn>` | `RN` da `spec-product` |

- O número de sequência do plano é mantido: `F2/RF-03` → `RF-203` → `RF-MOD-F2-003`.
- Contagens do plano (slide 9): F1 7 RF · 6 CT; F2 6 · 5; F3 6 · 5; F4 9 · 5; F5 7 · 6; F6 7 · 5; 4 transversais. Total 42 RF + 4 RF-T e 32 CT.
- Enunciado: texto do plano quando o slide da funcionalidade cita o ID; nos IDs contados mas não citados, texto do material refinado `knowledge-mt/mt-produtos/2.6-cobranca/refined/Requisitos/` (coluna "Fonte do texto" = `refinado`).

## 2. Saltos de numeração

| Onde | Salto | Motivo |
|---|---|---|
| Explore, RF | `RF-107` → `RF-201`, `RF-206` → `RF-301`, `RF-306` → `RF-401`, `RF-409` → `RF-501`, `RF-507` → `RF-601`, `RF-607` → `RF-901` | numeração em bloco por módulo (centena = F<n>; 9 = transversal) |
| Plano, slides F1 a F6 | F1 cita RF-01 a 04 e CT-01, 03, 04, 05; F2 cita RF-01 a 04 e CT-01 a 04; F3 cita RF-01, 02, 03, 05 e CT-01 a 04; F4 cita RF-01, 02, 03, 05 e CT-01 a 04; F5 cita RF-01, 03, 05, 06 e CT-01, 02, 03, 06; F6 cita RF-01 a 04 e CT-01 a 04 | o slide mostra 4 RF e 4 CT por funcionalidade; os demais IDs entram pela contagem e pelo refinado |
| Plano × refinado | F1 CT-07 a 09, F3 CT-06, F4 RF-10, F4 CT-06 e 07 | existem só no refinado (acima da contagem do plano); **não mapeados** — ver GAP-017 |
| Explore, RN | `RN-013` a `RN-017` | IDs do plano fora da série `RN-<nn>` e regras sem ID (seção 5) |

## 3. Requisitos funcionais (46)

| Plano | Explore | Plan | Enunciado | Fonte do texto |
|---|---|---|---|---|
| F1/RF-01 | RF-101 | RF-MOD-F1-001 | Consolidação periódica de CCF, MPI/Big Data, IPVA, ITCD e SNE | plano |
| F1/RF-02 | RF-102 | RF-MOD-F1-002 | Vínculo do débito ao contribuinte por CPF/CNPJ com resolução de sobreposição | plano |
| F1/RF-03 | RF-103 | RF-MOD-F1-003 | Atualização intraciclo do status de regularização/parcelamento | plano |
| F1/RF-04 | RF-104 | RF-MOD-F1-004 | Alerta de inadimplência parcial em parcelamentos | plano |
| F1/RF-05 | RF-105 | RF-MOD-F1-005 | Exibir visão única do contribuinte em tela com abas | refinado |
| F1/RF-06 | RF-106 | RF-MOD-F1-006 | Operar a transição MPI → Big Data sem ruptura da carteira | refinado |
| F1/RF-07 | RF-107 | RF-MOD-F1-007 | Expor status de cada integração (última sync, volume, erros) | refinado |
| F2/RF-01 | RF-201 | RF-MOD-F2-001 | Parametrização de critérios: valor, tributo, atraso, instrumento e exclusões | plano |
| F2/RF-02 | RF-202 | RF-MOD-F2-002 | Versionamento imutável de cada conjunto de critérios publicado | plano |
| F2/RF-03 | RF-203 | RF-MOD-F2-003 | Segmentação automática entre carteira massificada e qualificada | plano |
| F2/RF-04 | RF-204 | RF-MOD-F2-004 | Sorteio automático do grupo de controle a cada ciclo | plano |
| F2/RF-05 | RF-205 | RF-MOD-F2-005 | Incluir o score de liquidez como critério/threshold quando disponível | refinado |
| F2/RF-06 | RF-206 | RF-MOD-F2-006 | Gerar prévia da carteira segmentada antes de publicar | refinado |
| F3/RF-01 | RF-301 | RF-MOD-F3-001 | Ingestão e normalização do output do modelo da UFMT | plano |
| F3/RF-02 | RF-302 | RF-MOD-F3-002 | Score disponível como variável de priorização com threshold configurável | plano |
| F3/RF-03 | RF-303 | RF-MOD-F3-003 | Exibição do score no dossiê do atendente | plano |
| F3/RF-04 | RF-304 | RF-MOD-F3-004 | Recalibrar/atualizar o score periodicamente com base em resultados observados | refinado |
| F3/RF-05 | RF-305 | RF-MOD-F3-005 | Fallback determinístico quando o score está indisponível | plano |
| F3/RF-06 | RF-306 | RF-MOD-F3-006 | Acompanhar cobertura e qualidade da ingestão do score por tributo | refinado |
| F4/RF-01 | RF-401 | RF-MOD-F4-001 | Editor de régua com etapas, offsets, canais e templates | plano |
| F4/RF-02 | RF-402 | RF-MOD-F4-002 | Disparo automático, sem confirmação manual em lote | plano |
| F4/RF-03 | RF-403 | RF-MOD-F4-003 | Escalonamento conforme o comportamento do contribuinte | plano |
| F4/RF-04 | RF-404 | RF-MOD-F4-004 | Operar múltiplos canais (e-mail, SMS, WhatsApp, SNE) com fallback | refinado |
| F4/RF-05 | RF-405 | RF-MOD-F4-005 | Opt-in/opt-out respeitado por canal, com registro | plano |
| F4/RF-06 | RF-406 | RF-MOD-F4-006 | Registrar status de entrega por comunicação e reenviar falhas | refinado |
| F4/RF-07 | RF-407 | RF-MOD-F4-007 | Marcar origem da regularização (canal/instrumento) | refinado |
| F4/RF-08 | RF-408 | RF-MOD-F4-008 | Monitorar a efetividade por segmento/etapa/canal | refinado |
| F4/RF-09 | RF-409 | RF-MOD-F4-009 | Encaminhar à cobrança qualificada contribuintes sem retorno na régua | refinado |
| F5/RF-01 | RF-501 | RF-MOD-F5-001 | Distribuição automática por vínculo, balanceamento e prioridade | plano |
| F5/RF-02 | RF-502 | RF-MOD-F5-002 | Priorizar a fila do atendente por score/estágio | refinado |
| F5/RF-03 | RF-503 | RF-MOD-F5-003 | Dossiê consolidado automaticamente de múltiplas fontes | plano |
| F5/RF-04 | RF-504 | RF-MOD-F5-004 | Sinalizar no dossiê notificações coercitivas ativas em outras coordenadorias | refinado |
| F5/RF-05 | RF-505 | RF-MOD-F5-005 | Registro estruturado de interações por caso | plano |
| F5/RF-06 | RF-506 | RF-MOD-F5-006 | Encerramento do caso ao detectar regularização, com origem marcada | plano |
| F5/RF-07 | RF-507 | RF-MOD-F5-007 | Restringir a visão do atendente à própria carteira (não comparativa) | refinado |
| F6/RF-01 | RF-601 | RF-MOD-F6-001 | Painel com KPIs do ciclo do crédito em tempo quase-real | plano |
| F6/RF-02 | RF-602 | RF-MOD-F6-002 | KPIs por tributo, canal, instrumento e atendente, com metas formais | plano |
| F6/RF-03 | RF-603 | RF-MOD-F6-003 | Identificação da origem da regularização: espontânea vs. cobrança | plano |
| F6/RF-04 | RF-604 | RF-MOD-F6-004 | Cálculo do efeito incremental: carteira cobrada × grupo de controle | plano |
| F6/RF-05 | RF-605 | RF-MOD-F6-005 | Incluir IPVA e ITCD no monitoramento com metas | refinado |
| F6/RF-06 | RF-606 | RF-MOD-F6-006 | Visões distintas por perfil (coordenador completa; atendente individual) | refinado |
| F6/RF-07 | RF-607 | RF-MOD-F6-007 | Gerar insumos analíticos para revisão da estratégia | refinado |
| RF-T-01 | RF-901 | RF-MOD-T-001 | Exportação CSV/PDF de listas e painéis, com registro em trilha de auditoria | plano |
| RF-T-02 | RF-902 | RF-MOD-T-002 | Busca e filtro padronizados (contribuinte/documento, tributo, status, atraso, segmento, atendente) | plano |
| RF-T-03 | RF-903 | RF-MOD-T-003 | Visão única do contribuinte (lar em F1) | plano |
| RF-T-04 | RF-904 | RF-MOD-T-004 | Marcação de origem da regularização (lar em F4) | plano |

## 4. Critérios de aceite (32)

| Plano | Plan | Verifica (Plan) | Enunciado | Fonte do texto |
|---|---|---|---|---|
| F1/CT-01 | CT-MOD-F1-001 | RF-MOD-F1-001 | A sincronização consolida os débitos das fontes, vinculados ao contribuinte, com origem registrada | plano |
| F1/CT-02 | CT-MOD-F1-002 | RF-MOD-F1-002 | Documento inválido rejeitado e registrado no log de rejeições | refinado |
| F1/CT-03 | CT-MOD-F1-003 | RF-MOD-F1-003 | A atualização intraciclo encerra a abordagem de quem já regularizou | plano |
| F1/CT-04 | CT-MOD-F1-004 | RF-MOD-F1-004 | Parcelamento com parcelas em atraso gera alerta de risco de rompimento | plano |
| F1/CT-05 | CT-MOD-F1-005 | RF-MOD-F1-001 | Falha numa fonte não impede a consolidação das demais (degradação segura) | plano |
| F1/CT-06 | CT-MOD-F1-006 | RF-MOD-F1-006 | Transição de fonte MPI → Big Data sem ruptura | refinado |
| F2/CT-01 | CT-MOD-F2-001 | RF-MOD-F2-001, RF-MOD-F2-003 | Critério parametrizado (ICMS, valor ≥ R$ 500 mil, atraso ≥ 90d) forma a carteira qualificada correspondente | plano |
| F2/CT-02 | CT-MOD-F2-002 | RF-MOD-F2-002 | Editar critérios publicados cria nova versão; a carteira existente mantém a versão original | plano |
| F2/CT-03 | CT-MOD-F2-003 | RF-MOD-F2-004 | O grupo de controle sorteado é marcado e excluído das ações de cobrança | plano |
| F2/CT-04 | CT-MOD-F2-004 | RF-MOD-F2-005 | Sem score de liquidez disponível, a segmentação opera só com critérios determinísticos | plano |
| F2/CT-05 | CT-MOD-F2-005 | RF-MOD-F2-003 | Desempate massificada/qualificada | refinado |
| F3/CT-01 | CT-MOD-F3-001 | RF-MOD-F3-001 | A ingestão normaliza os scores e os associa aos contribuintes correspondentes | plano |
| F3/CT-02 | CT-MOD-F3-002 | RF-MOD-F3-002 | Um threshold de score configurado prioriza a carteira além dos demais critérios | plano |
| F3/CT-03 | CT-MOD-F3-003 | RF-MOD-F3-005 | Com o modelo indisponível, a priorização opera em fallback determinístico | plano |
| F3/CT-04 | CT-MOD-F3-004 | RF-MOD-F3-003 | O score do contribuinte aparece no resumo do dossiê | plano |
| F3/CT-05 | CT-MOD-F3-005 | RF-MOD-F3-004 | Recálculo periódico do score | refinado |
| F4/CT-01 | CT-MOD-F4-001 | RF-MOD-F4-002, RF-MOD-F4-003 | Sem pagamento após uma etapa, o sistema avança automaticamente para a próxima, sem confirmação manual | plano |
| F4/CT-02 | CT-MOD-F4-002 | RF-MOD-F4-003, RF-MOD-F4-007 | Regularização durante a régua encerra as ações e marca a origem pelo canal correspondente | plano |
| F4/CT-03 | CT-MOD-F4-003 | RF-MOD-F4-005 | Contribuinte sem opt-in de WhatsApp tem o canal pulado, sem envio | plano |
| F4/CT-04 | CT-MOD-F4-004 | RF-MOD-F4-006 | Falha de entrega é sinalizada e pode ser reenviada | plano |
| F4/CT-05 | CT-MOD-F4-005 | RF-MOD-F4-009 | Encaminhamento à cobrança qualificada | refinado |
| F5/CT-01 | CT-MOD-F5-001 | RF-MOD-F5-001 | A distribuição automática respeita vínculos e equilibra a carga entre atendentes | plano |
| F5/CT-02 | CT-MOD-F5-002 | RF-MOD-F5-002 | A fila do atendente prioriza por score/estágio; sem score, ordena pelos critérios determinísticos | plano |
| F5/CT-03 | CT-MOD-F5-003 | RF-MOD-F5-003, RF-MOD-F5-004 | O dossiê reúne débitos, parcelamentos e sinalizações coercitivas em tela única | plano |
| F5/CT-04 | CT-MOD-F5-004 | RF-MOD-F5-005 | Registro de interação auditado | refinado |
| F5/CT-05 | CT-MOD-F5-005 | RF-MOD-F5-006 | Encerramento por regularização | refinado |
| F5/CT-06 | CT-MOD-F5-006 | RF-MOD-F5-007 | Um atendente vê só os próprios casos, sem comparativo com outros | plano |
| F6/CT-01 | CT-MOD-F6-001 | RF-MOD-F6-001 | O painel reflete regularizações do dia sem extração manual | plano |
| F6/CT-02 | CT-MOD-F6-002 | RF-MOD-F6-003 | Regularização após notificação por e-mail é contada como "resposta à cobrança / canal e-mail" | plano |
| F6/CT-03 | CT-MOD-F6-003 | RF-MOD-F6-004 | O efeito incremental é a diferença entre a taxa da carteira cobrada e a do grupo de controle | plano |
| F6/CT-04 | CT-MOD-F6-004 | RF-MOD-F6-006 | O atendente vê só indicadores próprios, sem comparativo entre atendentes | plano |
| F6/CT-05 | CT-MOD-F6-005 | RF-MOD-F6-005 | Cobertura IPVA/ITCD | refinado |

## 5. Regras de negócio (Explore)

| Plano | Explore | Enunciado resumido |
|---|---|---|
| RN-01 | RN-001 | Débitos de fontes distintas do mesmo contribuinte formam uma visão única; duplicidade resolvida por sobreposição |
| RN-02 | RN-002 | Status atualizado intraciclo; ao regularizar, o contribuinte deixa de ser abordado |
| RN-03 | RN-003 | Critérios versionados; versão aplicada registrada e imutável após publicação |
| RN-04 | RN-004 | Segmentação massificada × qualificada; quem esgota a régua sem regularizar é elegível à qualificada |
| RN-05 | RN-005 | Escalonamento por comportamento: sem resposta intensifica, regularização encerra |
| RN-06 | RN-006 | Canal com consentimento só dispara com opt-in vigente; opt-out vale de imediato |
| RN-07 | RN-007 | Distribuição automática por vínculo, balanceamento e prioridade |
| RN-08 | RN-008 | Toda regularização é marcada pela origem |
| RN-09 | RN-009 | Grupo de controle sorteado por ciclo; efeito incremental = taxa cobrada − taxa do controle |
| RN-10 | RN-010 | Ação relevante do caso registrada com ator, data/hora e resultado |
| RN-11 | RN-011 | Atendente vê só a própria carteira, sem comparativo; coordenador vê tudo |
| RN-12 | RN-012 | Transição MPI → Big Data sem ruptura da carteira |
| RN-AI-01 | RN-013 | Score como variável com threshold; sem score, fallback determinístico e marca "sem score" |
| RNF-T-CONF-01 | RN-014 | CPF/CNPJ inválido é rejeitado, não gravado e registrado no log de rejeições |
| (sem ID, slide 16) | RN-015 | Modelo de score desenvolvido e recalibrado pela UFMT; o produto só integra e usa |
| (sem ID, números-chave) | RN-016 | Janela de atribuição de 30 dias entre comunicação e regularização |
| (sem ID, insights) | RN-017 | Medidas coercitivas e PGE: o dossiê sinaliza, não executa |
