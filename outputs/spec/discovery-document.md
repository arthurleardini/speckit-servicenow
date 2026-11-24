# Discovery — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft
Última atualização: 2026-11-24
Fontes: `inputs/plano-2.6-cobranca.md`, `inputs/de-para-ids.md`, `inputs/fio-condutor.md`, `inputs/premissas-ficticias.md`, `inputs/simulacoes.md`, `outputs/explore/` (5 documentos), `outputs/spec/screens-manifest.json`

Espelho do que as fontes dizem. Cada afirmação cita o fato (`F-xxx`) ou a inferência (`INF-xxx`) do `context-map.md`. Prioridade, metas e escopo ficam no `product-vision.md`.

<!-- id: dd-problem -->

## 1. Problema Central

Os débitos de um mesmo contribuinte estão espalhados em 5 fontes (CCF, MPI/Big Data, IPVA, ITCD e SNE), sem visão única, e a cobrança não separa quem pagou por causa dela de quem pagaria de qualquer jeito (F-020, F-027, F-131, F-039). A distribuição de casos aos atendentes não tem balanceamento automático, e o disparo das réguas depende de confirmação manual em lote (F-061, F-049, F-143).

<!-- id: dd-context -->

## 2. Contexto de Negócio

- A Coordenação de Cobrança (CPRF) da SEFAZ-MT é a dona do produto; os Atendentes de Cobrança são os usuários-chave (F-155).
- O Plano de Implementação 2.6 Cobrança (setembro de 2026) define 6 funcionalidades, 42 requisitos mais 4 transversais e 32 critérios de aceite (F-126, F-128 a F-130).
- Cronograma: plano em dez/26, construção em jan–fev/27, go-live no início de mar/27, operação assistida até abr/27 (F-136, F-154).
- A SQUAD Cobrança é compartilhada com o produto 2.5 Atendimento (F-137).
- O score de liquidez depende da UFMT, que só recebe dados de cobrança a partir de mai/26 e não tem data de entrega do modelo (F-134, F-151).
- No piloto do Speckit ServiceNow, o produto é construído como app escopado `x_2326104_cob` na instância `dev493801`, com integrações simuladas e dados fictícios (F-001, F-083, F-170).

<!-- id: dd-stakeholders -->

## 3. Atores e Stakeholders

| Ator | Papel | Interesse principal | Poder de decisão | Fonte |
|------|-------|---------------------|------------------|-------|
| Coordenação de Cobrança (CPRF) | dono do produto; parametriza critérios, réguas, metas; distribui casos | medir o efeito da cobrança e priorizar a carteira | alto | F-011, F-155 |
| Atendente de Cobrança | usuário-chave; trabalha a própria fila | fila priorizada e dossiê completo do contribuinte | médio | F-012, F-155 |
| Administrador do app | mantém tabelas simuladas e trilha | operar o ambiente do piloto | baixo | F-013 |
| UFMT | desenvolve e recalibra o modelo de score | integração do score | médio | F-047, F-134 |
| TI SEFAZ-MT | sistemas de origem | contrato das integrações | médio | F-155 |
| SQUAD Cobrança | desenvolvimento | escopo estável dentro do prazo | médio | F-137 |
| EloGroup | consultoria | método e entrega do plano | médio | F-155 |

<!-- id: dd-requests -->

## 4. O que o cliente pediu (linguagem bruta)

| # | O que foi pedido (linguagem do cliente) | Ator que pediu | Origem (F-xxx) |
|---|----------------------------------------|----------------|----------------|
| 1 | Consolidar periodicamente os débitos das 5 fontes numa visão única do contribuinte | CPRF | F-020, F-024 |
| 2 | Vincular débito por CPF/CNPJ e resolver sobreposição; rejeitar documento inválido | CPRF | F-021, F-030 |
| 3 | Atualizar regularização e parcelamento dentro do ciclo e alertar parcelamento em risco | CPRF | F-022, F-023 |
| 4 | Trocar MPI por Big Data sem ruptura e mostrar o status das integrações | CPRF | F-025, F-026 |
| 5 | Parametrizar critérios de qualificação, versionados e imutáveis após publicação | CPRF | F-031, F-032, F-141 |
| 6 | Segmentar a carteira em massificada e qualificada, com prévia antes de publicar | CPRF | F-033, F-036 |
| 7 | Sortear o grupo de controle a cada ciclo, fora das ações de cobrança | CPRF | F-034, F-142 |
| 8 | Usar o score da UFMT com threshold quando existir; sem score, critérios determinísticos | CPRF | F-035, F-041, F-044, F-140 |
| 9 | Desenhar réguas por carteira com etapas, offsets, canais e templates, com disparo automático e escalonamento | CPRF | F-048 a F-050, F-143 |
| 10 | Respeitar opt-in/opt-out por canal; WhatsApp só com contratação e opt-in | CPRF | F-052, F-133 |
| 11 | Registrar entrega e reenviar falhas; marcar a origem da regularização | CPRF | F-053, F-054 |
| 12 | Encaminhar à cobrança qualificada quem esgota a régua | CPRF | F-056, F-144 |
| 13 | Distribuir casos por vínculo, balanceamento e prioridade, com fila priorizada | CPRF | F-061, F-062 |
| 14 | Dossiê consolidado com sinalização de medidas coercitivas, sem executá-las | CPRF | F-063, F-064, F-003 |
| 15 | Registrar interações e encerrar o caso ao detectar regularização | Atendente | F-065, F-066 |
| 16 | Atendente vê só a própria carteira, sem comparativo | CPRF | F-067, F-145 |
| 17 | Painel do funil, KPIs com metas, origem da regularização e efeito incremental | CPRF | F-072 a F-078 |
| 18 | Exportação CSV/PDF com trilha e busca/filtro padronizados | CPRF | F-079, F-080 |

<!-- id: dd-existing-systems -->

## 5. Sistemas Existentes (candidatos a AS-IS)

- Fontes de débito: CCF, MPI (em transição para Big Data), IPVA, ITCD e SNE, mantidas pela TI SEFAZ-MT (F-131, F-146, F-155).
- Sinalizações coercitivas de outras coordenadorias: CCF, SNE e SUCOM (F-096).
- Candidato a fonte de tempo quase-real: CCF/Oracle, a confirmar (F-153).
- Canais: e-mail, SMS e SNE; WhatsApp sem contrato (F-133).
- Distribuição de casos hoje sem sistema (planilha citada como o que se quer eliminar) (F-061).
- No piloto, todas essas integrações são tabelas simuladas (SIM-01 a SIM-03) dentro do app (F-164 a F-170).

Não há sistema legado de cobrança a migrar: o Explore declarou `legado=Não`.

<!-- id: dd-contradictions -->

## 6. Contradições e Inconsistências

| Tema | Posição A (F-xxx) | Posição B (F-xxx) | Decisão pendente |
|------|-------------------|-------------------|------------------|
| Contagem de RF e CT | 42 RF e 32 CT no plano (F-129, F-130) | itens extras no material refinado (F-177) | registrada em GAP-017; o Plan segue o plano |
| Visão única do contribuinte | RF-105 em MOD-F1 (F-024) | RF-903 transversal (F-081) | resolvido: lar em MOD-F1 |
| Origem da regularização | RF-407 e RF-603 (F-054, F-074) | RF-904 transversal (F-082) | resolvido: marca em MOD-F4, apuração em MOD-F6 |
| Dossiê em tela única | plano (F-063) | Core UI entrega form com related lists (F-019) | registrada em GAP-012 |

<!-- id: dd-org-context -->

## 7. Contexto Organizacional

| Fator | Descrição | Impacto no projeto | Fonte |
|-------|-----------|-------------------|-------|
| Resistência interna | nenhum fator identificado nas fontes | — | — |
| Campeão do projeto | Coordenação de Cobrança (CPRF) como dona do produto | alto | F-155 |
| Dependência externa | modelo de score da UFMT sem data; contrato de WhatsApp em aberto | alto | F-134, F-151 |
| Restrição política | medidas coercitivas e articulação com a PGE ficam fora do sistema | médio | F-003 |
| Janela de oportunidade | go-live no início de mar/27, com squad compartilhada | médio | F-137, F-154 |

<!-- id: dd-readiness -->

## 8. Avaliação de Prontidão do Insumo (Readiness Score)

| Dimensão | Nota (0-3) | Justificativa |
|----------|------------|----------------|
| Clareza do problema | 2 | dor descrita com impacto qualitativo; sem custo ou volume medido |
| Cobertura de atores | 3 | papéis, interesse e poder de decisão mapeados (F-155) |
| Densidade evidencial (F-xxx vs INF-xxx/NCR) | 3 | 178 fatos, 5 inferências, nenhum NCR |
| Sistemas e integrações | 2 | sistemas e integrações citados; protocolo em aberto (UFMT, fontes) |
| Métricas e SLAs | 1 | números de escopo e prazo; sem baseline de taxa de regularização nem SLA |
| Contradições resolvidas | 3 | contradições resolvidas ou registradas em GAP |
| Clareza dos pedidos | 3 | pedidos específicos, com ator e origem |

**Nota consolidada:** 81% (17 de 21) — **Classificação:** Pronto para projetificação

**Maiores lacunas:**

| Dimensão | Por quê |
|----------|---------|
| Métricas e SLAs | não há taxa de regularização atual, valor recuperado nem meta formal (GAP-019) |
| Sistemas e integrações | contrato técnico do score e das fontes em aberto (GAP-008, GAP-011) |
| Clareza do problema | impacto da dor sem número medido |

**Recomendação:** seguir para `spec-product`; as lacunas estão em `gaps.md` e as premissas do piloto cobrem os parâmetros em aberto.
