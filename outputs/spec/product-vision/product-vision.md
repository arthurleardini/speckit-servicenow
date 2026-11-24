# Documento de Visão de Produto — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft
Última atualização: 2026-11-24
Versão: 1.0
Autor: arthurleardini (FDE, EloGroup)
Classificação: Interno
Fonte: discovery-document.md, context-map.md (F-xxx), inputs/plano-2.6-cobranca.md, inputs/premissas-ficticias.md

Não há `benchmark.md` nem `legacy.md` neste projeto: o piloto parte do Plano de Implementação 2.6 Cobrança, sem legado digital de cobrança. Os campos que o template pede do benchmark usam o status quo descrito nas fontes.

<!-- id: pv-summary -->

## 1. Sumário Executivo

O Cobrança MT dá à Coordenação de Cobrança da SEFAZ-MT uma carteira única por contribuinte, qualificada por critério versionado e medida contra um grupo de controle sorteado a cada ciclo (F-020, F-032, F-039). A régua multicanal dispara sozinha e o atendente trabalha só a própria carteira, com dossiê e fila priorizada (F-049, F-062, F-145). Sem o score da UFMT, a qualificação continua em fallback determinístico (F-140). A primeira versão cobre as 6 funcionalidades do plano, com integrações simuladas e dados fictícios na instância `dev493801` (F-001, F-170). O valor central é saber quanto a cobrança muda a regularização: a taxa da carteira cobrada menos a do grupo de controle (F-075).

---

<!-- id: pv-context -->

## 2. Contexto e Oportunidade

### 2.1 Situação Atual (AS-IS)

| Dor | Impacto (quantificado) | Fonte |
|-----|------------------------|-------|
| Débitos espalhados em 5 fontes, sem visão única | cobrança duplicada ou de quem já regularizou; sem número medido | F-020, F-027, F-131 |
| Sem grupo de controle | o efeito da cobrança não é separado da regularização espontânea | F-039, F-075 |
| Disparo com confirmação manual em lote | atraso entre etapas da régua | F-049, F-143 |
| Distribuição de casos sem sistema | sem balanceamento nem prioridade | F-061 |
| Score da UFMT sem data de entrega | qualificação depende de um modelo externo | F-134, F-151 |

### 2.2 Oportunidade

- Para o negócio: medir o efeito incremental da cobrança por ciclo e por canal (F-075, F-074).
- Para o usuário: o atendente recebe fila priorizada e dossiê pronto; o coordenador publica critérios e réguas sem planilha (F-061 a F-063).
- Para o mercado: não se aplica (órgão público).

### 2.3 Por que agora?

Estratégico: o plano prevê go-live no início de mar/27 e os dados de cobrança alimentam o modelo da UFMT desde mai/26 (F-154, F-134).

### 2.4 Value Proposition Canvas (Osterwalder) — por persona primária

**Persona: Coordenador de Cobrança (CPRF)**

| Jobs (tarefas/objetivos) | Pains (dores) | Gains (ganhos esperados) |
|--------------------------|---------------|--------------------------|
| definir quem vai para a cobrança qualificada `F-031` | débitos espalhados em 5 fontes `F-020` | carteira única e atualizada no ciclo `F-022` |
| desenhar e acompanhar réguas `F-048` | disparo com confirmação manual `F-049` | disparo e escalonamento automáticos `F-143` |
| provar o efeito da cobrança `F-075` | sem grupo de controle `F-039` | efeito incremental por ciclo `F-142` |
| distribuir casos `F-061` | distribuição sem balanceamento `F-061` | distribuição por vínculo e carga `F-068` |

| Pain relievers → dor atendida | Gain creators → ganho atendido |
|-------------------------------|--------------------------------|
| `MOD-F1` alivia a dispersão em 5 fontes | `MOD-F1` cria a visão única atualizada no ciclo |
| `MOD-F4` alivia o disparo manual | `MOD-F4` cria escalonamento automático e origem marcada |
| `MOD-F2` alivia a falta de grupo de controle | `MOD-F6` cria o efeito incremental por ciclo |
| `MOD-F5` alivia a distribuição sem balanceamento | `MOD-F5` cria distribuição automática |

**Persona: Atendente de Cobrança**

| Jobs (tarefas/objetivos) | Pains (dores) | Gains (ganhos esperados) |
|--------------------------|---------------|--------------------------|
| trabalhar a própria fila `F-062` | sem prioridade na fila `F-061` | fila ordenada por score ou critério `F-062` |
| conduzir a negociação com o contribuinte `F-063` | consultar várias fontes para montar o histórico `F-020` | dossiê consolidado no caso `F-063` |
| registrar o que foi feito `F-065` | exposição a comparação com colegas `F-145` | visão só da própria carteira `F-067` |

| Pain relievers → dor atendida | Gain creators → ganho atendido |
|-------------------------------|--------------------------------|
| `MOD-F5` alivia a fila sem prioridade e a comparação | `MOD-F5` cria dossiê e fila priorizada |
| `MOD-F1` alivia a consulta a várias fontes | `MOD-F3` cria o score visível no dossiê |

---

<!-- id: pv-vision -->

## 3. Declaração de Visão (Formato Moore)

```
PARA           a Coordenação de Cobrança da SEFAZ-MT e seus atendentes
QUE            precisam cobrar a carteira certa e provar o efeito da cobrança
O COBRANÇA MT É um app de cobrança no ServiceNow da SEFAZ-MT
QUE            consolida os débitos, qualifica a carteira por critério versionado, dispara réguas sozinho e mede o efeito contra um grupo de controle
DIFERENTE DE   débitos espalhados em 5 fontes, disparo com confirmação manual e distribuição sem sistema
NOSSO PRODUTO  liga cada regularização à regra, ao canal e ao ciclo que a produziram, com a carteira de cada atendente isolada
```

---

<!-- id: pv-metrics -->

## 4. Objetivos e Métricas de Sucesso (SMART)

| Objetivo | Métrica | Baseline | Meta | Prazo | Dono |
|----------|---------|----------|------|-------|------|
| Medir o efeito da cobrança | ciclos com efeito incremental calculado | sem baseline (QA-01) | 100% dos ciclos publicados | 1º ciclo após o go-live (mar/27) | CPRF |
| Cobrar a carteira certa | débitos consolidados com origem registrada | sem baseline (QA-01) | 100% das linhas válidas das 5 fontes | mar/27 | CPRF |
| Eliminar o disparo manual | etapas disparadas sem confirmação | sem baseline (QA-01) | 100% das etapas | mar/27 | CPRF |

### 4.1 North Star Metric + árvore de métricas

```
NSM: efeito incremental do ciclo (taxa da carteira cobrada − taxa do grupo de controle, em p.p.)
 ├─ input 1: % da carteira com débitos consolidados e origem registrada → MOD-F1
 ├─ input 2: % dos ciclos com grupo de controle sorteado e versão do critério registrada → MOD-F2
 ├─ input 3: % das comunicações entregues na primeira tentativa ou no fallback → MOD-F4
 └─ input 4: % dos casos qualificados distribuídos sem intervenção manual → MOD-F5
```

### 4.2 OKR verificável

| Objective | KR | Métrica | Baseline (F-xxx / "sem baseline") | Alvo numérico | Prazo |
|-----------|----|---------|------------------------------------|---------------|-------|
| Provar o efeito da cobrança | KR1 | ciclos com efeito incremental calculado | sem baseline (QA-01) | 100% | abr/27 |
| Provar o efeito da cobrança | KR2 | regularizações com origem marcada | sem baseline (QA-01) | 100% | abr/27 |
| Operar sem planilha | KR1 | casos distribuídos automaticamente | sem baseline (QA-01) | 100% | abr/27 |
| Operar sem planilha | KR2 | etapas de régua disparadas sem confirmação manual | sem baseline (QA-01) | 100% | abr/27 |

---

<!-- id: pv-scope -->

## 5. Escopo — É / Não É

| Esta versão É | Esta versão NÃO É |
|---------------|-------------------|
| 6 funcionalidades do plano (F1 a F6) e 4 transversais, 46 RF | integração real com UFMT, canais e fontes (simuladas, SIM-01 a SIM-03) |
| critério versionado, grupo de controle por ciclo e fallback sem score com lógica completa | recalibração do modelo de score (é da UFMT) |
| dossiê e carteira isolada do atendente com lógica completa | execução de medidas coercitivas e articulação com a PGE |
| 33 telas na Core UI clássica, com dados fictícios | Workspace, Service Portal ou UI Builder |
| roles coordenador, atendente e administrador | dado real de contribuinte |

| Item fora do escopo | Justificativa | Quando revisar |
|---------------------|---------------|----------------|
| Integração real com o score da UFMT | contrato técnico em aberto (GAP-008) | quando a UFMT definir API ou arquivo |
| WhatsApp contratado | contrato em aberto (GAP-009) | após contratação |
| Medidas coercitivas e PGE | fora do sistema por decisão do plano (F-003) | não previsto |
| Itens do refinado acima da contagem do plano | GAP-017 | decisão FDE + CPRF |
| Painel único de KPIs com metas sobrepostas | limite da Core UI clássica (GAP-013) | após o v0 |

---

<!-- id: pv-personas -->

## 6. Personas e Jobs to Be Done

```
PERSONA: Coordenador de Cobrança (CPRF)
Perfil:    dono do produto na Coordenação de Cobrança
Contexto:  publica critérios e ciclos mensais, desenha réguas, distribui casos e acompanha KPIs

JTBD Emocional:  "Quero me sentir seguro de que a cobrança funciona e de que posso provar isso."

Dores principais:
  1. Débitos espalhados em 5 fontes — origem: F-020
  2. Efeito da cobrança sem medida — origem: F-039

Ganhos esperados:
  1. Efeito incremental por ciclo
  2. Régua sem confirmação manual
```

| # | Job story | Rastreio |
|---|-----------|----------|
| 1 | Quando o mês de referência começa, quero publicar o ciclo com a versão vigente do critério, para que a carteira seja formada pela regra que eu aprovei. | F-032, F-159 |
| 2 | Quando mudo um critério, quero que nasça uma versão nova, para que os ciclos antigos continuem explicáveis. | F-141 |
| 3 | Quando o ciclo fecha, quero ver a taxa da carteira cobrada contra a do grupo de controle, para que eu saiba o efeito da cobrança. | F-075 |
| 4 | Quando uma etapa vence sem pagamento, quero que a próxima dispare sozinha, para que a régua não dependa de mim. | F-143 |

```
PERSONA: Atendente de Cobrança
Perfil:    usuário-chave da cobrança qualificada
Contexto:  trabalha a própria fila todo dia (INF-001)

JTBD Emocional:  "Quero chegar ao contribuinte preparado e sem ser comparado com colegas."

Dores principais:
  1. Histórico espalhado — origem: F-020
  2. Exposição à comparação — origem: F-145

Ganhos esperados:
  1. Dossiê pronto no caso
  2. Fila priorizada
```

| # | Job story | Rastreio |
|---|-----------|----------|
| 1 | Quando abro meu dia, quero a fila ordenada por chance de pagamento, para que eu comece pelos casos certos. | F-062 |
| 2 | Quando abro um caso, quero ver débitos, comunicações e score no mesmo lugar, para que eu negocie sem procurar. | F-063 |
| 3 | Quando falo com o contribuinte, quero registrar o resultado no caso, para que o histórico fique completo. | F-065 |

```
PERSONA: Administrador do app
Perfil:    mantém o ambiente do piloto
Contexto:  liga e desliga falhas simuladas, confere a trilha de exportação
```

| # | Job story | Rastreio |
|---|-----------|----------|
| 1 | Quando preparo a demonstração, quero ligar a falha simulada de um canal, para que o fallback apareça. | F-013, F-166 |
| 2 | Quando alguém exporta dados, quero ver a trilha, para que eu preste contas do uso. | F-013, F-079 |

---

<!-- id: pv-constraints -->

## 7. Premissas, Dependências e Restrições

| Tipo | Descrição | Impacto se falhar | Dono |
|------|-----------|-------------------|------|
| premissa | ciclo mensal (P1), desempate maior débito/mais antigo (P2), controle de 10% (P3), fallback SNE → e-mail → SMS (P4), dossiê em 3 níveis (P5) | regras RN-NOVO-F1-006, F2-004, F2-006, F4-004, F5-003 mudam de valor | CPRF |
| dependência | score da UFMT | qualificação opera em fallback (RN-NOVO-F3-002) | UFMT |
| dependência | contrato de WhatsApp | canal pulado (RN-NOVO-F4-003) | SEFAZ-MT |
| restrição | Core UI clássica, app escopado `x_2326104_cob` | dossiê e painel em form/report (GAP-012, GAP-013) | EloGroup |
| restrição | só dado fictício (sigilo fiscal e LGPD) | nenhum teste com dado real (RN-NOVO-T-002) | EloGroup |
| restrição | RNF de negócio: RNF-SEGURANCA-001/002/003, RNF-CONFIABILIDADE-001/002, RNF-DESEMPENHO-001, RNF-USABILIDADE-001, RNF-MANUTENIBILIDADE-001 (`requirements.md`) | — | EloGroup |

---

<!-- id: pv-roadmap -->

## 8. Roadmap de Alto Nível (Now / Next / Later)

| Horizonte | Critério de corte | Iniciativas | RF / MOD referenciado | Valor Esperado | Risco / dependência |
|-----------|-------------------|-------------|-----------------------|----------------|---------------------|
| Now (0-3m) | Must da jornada crítica + pré-requisitos técnicos | consolidação, critério versionado, segmentação, grupo de controle, régua e disparo, distribuição, dossiê, carteira isolada, funil, efeito incremental, exportação | RF-MOD-F1-001 a 003, RF-MOD-F2-002 a 004, RF-MOD-F3-001, RF-MOD-F3-005, RF-MOD-F4-001 a 003, RF-MOD-F4-005, RF-MOD-F5-001, RF-MOD-F5-003, RF-MOD-F5-007, RF-MOD-F6-001, RF-MOD-F6-003, RF-MOD-F6-004, RF-MOD-T-001 | ciclo completo de cobrança medido | premissas P1–P5 |
| Next (3-6m) | Should ligados a KRs | parametrização completa, prévia, score como critério, fallback de canal, reenvio, origem, encaminhamento, fila, interações, encerramento, KPIs com metas, visões por perfil | RF-MOD-F1-004 a 007, RF-MOD-F2-001, RF-MOD-F2-005, RF-MOD-F2-006, RF-MOD-F3-002 a 004, RF-MOD-F3-006, RF-MOD-F4-004, RF-MOD-F4-006, RF-MOD-F4-007, RF-MOD-F4-009, RF-MOD-F5-002, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F6-002, RF-MOD-F6-005, RF-MOD-F6-006, RF-MOD-T-002 a 004 + KR1/KR2 | operação sem planilha | score UFMT (GAP-008) |
| Later (6m+) | Could / apostas não validadas | efetividade da régua, sinalização coercitiva, insumos de estratégia | RF-MOD-F4-008, RF-MOD-F5-004, RF-MOD-F6-007 / GAP-018 | revisão da estratégia | fonte das sinalizações (GAP-016) |

No piloto do Speckit ServiceNow todos os 46 RF entram no app: os 5 do fio condutor com lógica completa e os demais como tabela, form, list, menu, role e seed (`inputs/fio-condutor.md`).

---

<!-- id: pv-raci -->

## 9. Stakeholders e RACI

| Stakeholder | R | A | C | I |
|-------------|---|---|---|---|
| Coordenação de Cobrança (CPRF) | | ✔ | | |
| Atendentes de Cobrança | | | ✔ | ✔ |
| SQUAD Cobrança | ✔ | | | |
| EloGroup (FDE) | ✔ | | ✔ | |
| UFMT | | | ✔ | ✔ |
| TI SEFAZ-MT | | | ✔ | ✔ |

---

<!-- id: pv-gaps -->

## 10. Visão ↔ GAPs

| GAP existente | Tema em aberto | Impacto na visão | Referência |
|---------------|----------------|------------------|------------|
| GAP-001 a GAP-005 | premissas P1–P5 | valores das regras do ciclo, do controle, do fallback e do dossiê | `inputs/premissas-ficticias.md` |
| GAP-006 | regra de sobreposição | visão única marca, não decide | RN-NOVO-F1-001 |
| GAP-008 | contrato do score | score simulado | RN-NOVO-F3-002 |
| GAP-012, GAP-013 | dossiê e painel na Core UI | tela única vira form e reports | RF-MOD-F5-003, RF-MOD-F6-001 |
| GAP-017, GAP-018 | itens fora da contagem e candidatos a corte | escopo do plano mantido | §5 |

---

<!-- id: pv-history -->

## 11. Histórico de Versões

| Versão | Data | Autor | Mudanças |
|--------|------|-------|----------|
| 1.0 | 2026-11-24 | arthurleardini | Versão inicial (Plan do piloto) |

---

<!-- id: pv-open-questions -->

## Questões em aberto

| QA | Descrição | Onde aparece | Sugestão de tratamento |
|----|-----------|--------------|-------------------------|
| QA-01 | Não há baseline de taxa de regularização, valor recuperado nem metas formais | §4, §4.2 | instrumentar no primeiro ciclo; metas em GAP-019 |
