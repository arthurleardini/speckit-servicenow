# Plano de Implementação 2.6 Cobrança

**Produto:** 2.6 Cobrança · **Tipo:** Plano de Implementação · **Versão/data:** setembro de 2026 (20 slides, sem notas de apresentador; slides 3 e 4 ocultos)
**Arquivos cobertos:** `2.6 Cobrança/Plano de Implementação 2.6 Cobrança.pptx`

## Números-chave
| Indicador | Valor |
|---|---|
| Necessidades avaliadas | 5 (2 na v1, 3 parciais) |
| Épicos | 5 |
| Funcionalidades | 6 (F1 a F6) |
| Requisitos funcionais (resumo do slide 8) | 42 RF (7 + 6 + 6 + 9 + 7 + 7) + 4 transversais (RF-T-01 a RF-T-04) |
| Critérios de aceite (resumo) | 32 CT (6 + 5 + 5 + 5 + 6 + 5) |
| Fontes de débito consolidadas | 5: CCF, MPI/Big Data, IPVA, ITCD, SNE |
| Carteiras prioritárias das réguas | 5: parcelamentos, IPVA, ITCD, ICMS Normal, ICMS ST |
| Canais das réguas | e-mail, SMS, SNE (v1); WhatsApp condicionado a contratação e opt-in |
| Dependência externa | Score de liquidez da UFMT (dados de cobrança alimentam o modelo a partir de mai/26) |
| Janela de atribuição assumida | 30 dias |
| Cronograma | dez/26 (plano) a abr/27 (treinamento + OA), 5 meses |
| Squad | SQUAD Cobrança, compartilhada com o 2.5 |
| Candidatos a corte | 6 (todos "Em discussão") |
| Horas técnicas | Não informadas (premissas em branco) |

## Principais insights
- A v1 entrega o ciclo completo de cobrança: consolidação, qualificação, réguas, atendimento qualificado e KPIs.
- Score de liquidez da UFMT e WhatsApp dependem de terceiros; sem score, a qualificação roda em fallback determinístico e o contribuinte fica marcado "sem score".
- O produto só integra e usa o score; desenvolvimento e recalibração do modelo são da UFMT, por convênio.
- Critérios de qualificação versionados e imutáveis após publicação; editar cria nova versão.
- Grupo de controle sorteado a cada ciclo, fora das ações de cobrança; efeito incremental = taxa de regularização da carteira cobrada menos a do grupo de controle.
- Régua dispara e escalona sem confirmação manual em lote; regularização encerra a abordagem e marca a origem (espontânea vs. cobrança por canal/instrumento).
- Contribuinte que esgota a régua sem regularizar vai para a cobrança qualificada.
- Atendente vê só a própria carteira, sem comparativo com colegas.
- Medidas coercitivas e articulação com a PGE são lacunas fora do sistema: o dossiê sinaliza, não executa.
- Transição MPI → Big Data (P2.2) sem ruptura da carteira.

## Conteúdo estruturado

### Escopo da v1
| # | Necessidade | Implementação v1 | Status |
|---|---|---|---|
| 1 | Consolidação multifonte em visão única do contribuinte | F1 por inteiro (RF-01 a RF-07) | Na v1 |
| 2 | Qualificação por critérios parametrizáveis com score da UFMT | F2 por inteiro; F3 depende da entrega do modelo | Parcial |
| 3 | Réguas multicanal para as 5 carteiras prioritárias | F4 com e-mail, SMS e SNE; WhatsApp condicionado | Parcial |
| 4 | Distribuição automática e dossiê para o atendente | F5 por inteiro; coercitivas e PGE fora do sistema | Parcial |
| 5 | Indicadores em tempo quase-real e efeito causal via grupo de controle | F6 por inteiro | Na v1 |

### Épicos e funcionalidades
| Épico | Func. | Nome | RF · CT | Perfis |
|---|---|---|---|---|
| 1. Ingestão e Fonte de Dados | F1 | Ingestão e Carteira Consolidada | 7 · 6 | Coordenador, Atendente de Cobrança |
| 2. Qualificação e Parametrização | F2 | Qualificação e Parametrização da Carteira | 6 · 5 | Coordenador de Cobrança |
| 2. Qualificação e Parametrização | F3 | Scoring de Liquidez (Priorização Inteligente) | 6 · 5 | Coordenador, Atendente |
| 3. Cobrança Automatizada Multicanal | F4 | Réguas de Cobrança Massificada Multicanal | 9 · 5 | Coordenador de Cobrança |
| 4. Operação do Atendente | F5 | Cobrança Qualificada - Operação do Atendente | 7 · 6 | Coordenador, Atendente |
| 5. Monitoramento e KPIs | F6 | Monitoramento, KPIs e Grupo de Controle | 7 · 5 | Coordenador, Atendente |

Transversais: RF-T-01 exportação CSV/PDF com trilha; RF-T-02 busca e filtro padronizados; RF-T-03 visão única do contribuinte (lar em F1); RF-T-04 marcação de origem da regularização (lar em F4).

### Requisitos, regras e critérios
**F1 · Ingestão e Carteira Consolidada** — RF-01 consolidação periódica das 5 fontes; RF-02 vínculo por CPF/CNPJ com resolução de sobreposição; RF-03 atualização intraciclo; RF-04 alerta de inadimplência parcial em parcelamentos. Documento inválido rejeitado e logado (RNF-T-CONF-01). CT-01 consolidação com origem registrada; CT-03 intraciclo encerra abordagem; CT-04 parcela em atraso gera alerta; CT-05 falha numa fonte não trava as demais. Riscos: frequência do ciclo e regra de sobreposição indefinidas; transição MPI → Big Data.

**F2 · Qualificação e Parametrização** — RF-01 critérios (valor, tributo, atraso, instrumento, exclusões); RF-02 versionamento imutável; RF-03 segmentação massificada x qualificada; RF-04 sorteio do grupo de controle. CT-01 critério ICMS, valor ≥ R$ 500 mil, atraso ≥ 90d forma a carteira; CT-02 edição cria nova versão; CT-03 grupo de controle excluído das ações; CT-04 sem score opera com critérios determinísticos. Riscos: regra de desempate indefinida; tamanho do grupo de controle a confirmar.

**F3 · Scoring de Liquidez** — RF-01 ingestão e normalização do output da UFMT; RF-02 score como variável com threshold; RF-05 fallback determinístico; RF-03 score no dossiê. Painel operacional com versão do modelo, cobertura por tributo e última ingestão. CT-01 a CT-04. Integração: modelo UFMT (API ou arquivo, a definir). Riscos: contrato técnico e escala do score indefinidos; data do modelo em aberto.

**F4 · Réguas Multicanal** — RF-01 editor de régua (etapas, offsets, canais, templates); RF-02 disparo automático; RF-03 escalonamento por comportamento; RF-05 opt-in/opt-out por canal. CT-01 avanço automático sem pagamento; CT-02 regularização encerra e marca origem; CT-03 sem opt-in de WhatsApp o canal é pulado; CT-04 falha de entrega sinalizada e reenviável. Riscos: ordem de fallback entre canais e janela de 30 dias a confirmar; contrato de WhatsApp em aberto.

**F5 · Cobrança Qualificada** — RF-01 distribuição por vínculo, balanceamento e prioridade; RF-03 dossiê consolidado; RF-05 registro estruturado de interações; RF-06 encerramento ao detectar regularização. CT-01 vínculos e carga equilibrada; CT-02 fila por score/estágio ou critérios determinísticos; CT-03 dossiê em tela única; CT-06 atendente vê só os próprios casos. Integrações: F2, F3, F4 e sinalizações coercitivas (CCF/SNE/SUCOM). Riscos: níveis do dossiê (grupo econômico, situação patrimonial) a confirmar; capacidade por atendente indefinida.

**F6 · Monitoramento e KPIs** — RF-01 painel do funil do crédito (identificado → notificado → regularizado); RF-02 KPIs por tributo, canal, instrumento e atendente com metas; RF-03 origem da regularização; RF-04 efeito incremental. CT-01 regularizações do dia sem extração manual; CT-02 regularização pós e-mail contada como "resposta à cobrança / canal e-mail"; CT-03 cálculo do efeito incremental; CT-04 atendente só vê indicadores próprios. Riscos: modelo de atribuição causal e janela de 30 dias; fonte do pipeline em tempo real (CCF/Oracle).

### Cronograma (slide 10)
| Período | Atividade |
|---|---|
| dez/26 | Plano de implementação |
| jan/27 | F1 consolidação multifonte |
| jan/27 a fev/27 | F2·F3 critérios, versionamento e score; F4 réguas e disparo; F5·F6 distribuição, dossiê e KPIs (escalonadas) |
| fev/27 (2ª metade) | Testes e homologação |
| início de mar/27 | Go-live |
| mar/27 a abr/27 | Treinamento + operação assistida |

O 2.5 Atendimento roda com a mesma SQUAD. Marcos conforme Planejamento do Delivery (Executivo Soluções, slide 6).

### Homologação
Etapas: 1 Preparação (EloGroup + SQUAD) · 2 Testes integrados (SQUAD) · 3 Homologação (área dona) · 4 Correção e reteste (SQUAD) · 5 Aceite e go-live (SEFAZ-MT).

| Papel | Quem |
|---|---|
| Dono do produto | Coordenação de Cobrança (CPRF) |
| Usuários-chave | Atendentes de Cobrança |
| Desenvolvimento | SQUAD Cobrança |
| Consultoria | EloGroup |
| Sistemas de origem | TI SEFAZ-MT / CCF, MPI-Big Data, IPVA, ITCD, SNE |

### Premissas
7 temas (banco de horas, ritos, ambientes, dados e integrações, homologação, treinamento e OA, mudanças de escopo), todos "[preencher]". O slide oculto 4, "Histórico da frente de trabalho dentro do projeto", repete a mesma tabela em branco.

### Candidatos a corte
1. Canal WhatsApp nas réguas (F4).
2. Score de liquidez da UFMT (F3).
3. Grupo de controle com priorização por score (F2/F6).
4. Recalibração periódica do score (F3), Should.
5. Sinalização de medidas coercitivas no dossiê (F5).
6. Insumos analíticos automáticos para revisão de estratégia (F6), Should.
