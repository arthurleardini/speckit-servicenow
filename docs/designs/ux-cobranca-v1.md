# Cobrança MT: reformulação de UX v1

*   **Author:** arthurleardini (decisões D1–D10 tomadas pelo agente em 25/11/2026, a validar)
*   **Status:** Proposed
*   **Date:** 2026-11-25
*   **Insumos:**
    *   `deliversuiteServiceNow/ux-cobranca/01-teoria-cobranca-para-ux.md`: teoria
    *   `deliversuiteServiceNow/ux-cobranca/02-personas-jornadas-licoes.md`: personas, jornadas, validações SEFAZ-MT
    *   `deliversuiteServiceNow/ux-cobranca/03-auditoria-ux-app-atual.md`: auditoria do app

--------------------------------------------------------------------------------

## Overview

O app Cobrança MT (`x_2326104_cob`, dev493801) foi gerado a partir do modelo de dados: uma tabela por entidade, um módulo de menu por tabela e telas de CRUD. O resultado não tem ponto de partida por persona, não diz em que etapa está cada coisa e quase não tem ações de negócio. Esta reformulação reorganiza o app em torno do trabalho de cada persona, como validado com a SEFAZ-MT, sem trocar de plataforma nem de experiência (continua Core UI clássica). O kit aprende o padrão para que o próximo app já nasça assim.

## The Problem

| Sintoma (auditoria 03) | Causa |
|---|---|
| Menu com 21 módulos, um por tabela, iguais para todos os papéis | O scaffold gera menu a partir de tabelas, não de tarefas |
| Ninguém tem tela de entrada; todo login cai no banner da PDI | Não existe home por persona |
| "Minha fila" instalada, mas nenhum módulo aponta para ela; mostra casos de outros, encerrados e fora de ordem | Módulos sem filtro, sem view e sem ordenação |
| 3 das 12 ações de negócio previstas; registrar uma interação custa cerca de 15 cliques; rodar o ciclo do mês, cerca de 20 | Verbos não implementados |
| Nenhuma tela mostra estado nem próxima ação | Sem modelo de estados nem trilha de etapas |
| O atendente aparece como dono do "Caso de cobrança qualificada" | O modelo segue a spec MT antiga. A validação de 17/06 corrigiu: o atendente faz **cobrança ativa** (lista de ligações) e a qualificada é conduzida pelo **coordenador** (02, §1) |
| Termos em inglês, moeda em "$", `true/false`, referências mostrando o campo errado; demo com taxa de 81.010% e grupo de controle maior que os elegíveis | Rótulos e display values não tratados; seed sem coerência entre tabelas |

## Goals

*   **M1. Cada persona entra direto no próprio trabalho.**
    *   O atendente cai em "Minha lista", e o coordenador no "Painel da cobrança".
    *   Do login à tarefa principal: no máximo 1 clique.
*   **M2. Menu por área de trabalho**, com as 6 áreas validadas em 22/06: Minha lista, Casos qualificados, Réguas, Carteira, Analytics e Configurações.
    *   O atendente vê no máximo 5 módulos, e o coordenador no máximo 12.
    *   As 21 tabelas ficam só em "Administração", para o admin.
*   **M3. Verbos de negócio no lugar de CRUD.**
    *   Registrar uma ligação, com resultado e retorno: no máximo 3 cliques a partir da lista.
    *   Rodar o ciclo do mês (gerar prévia, publicar, distribuir): no máximo 4 cliques, com 3 botões em sequência no mesmo registro.
*   **M4. Estado e próxima ação visíveis**: trilha de etapas no topo do item da lista ativa, do caso qualificado e do ciclo, e um campo "Próxima ação" na lista.
*   **M5. Papéis corretos**:
    *   o atendente trabalha a lista de cobrança ativa, só a própria;
    *   o coordenador conduz os casos qualificados e vê tudo;
    *   as ACLs garantem isso, não apenas o menu.
*   **M6. Telas em português e coerentes**: moeda em R$, choices com rótulo, referências com o campo certo e dados demo coerentes entre si (taxas entre 0 e 100%, grupo de controle menor que os elegíveis).
*   **M7. O kit gera isso.** O modelo de dados ganha uma seção de navegação (áreas, módulos com filtro e view, papéis, home por papel) e trilhas de etapas. O `sn-scaffold` gera esses elementos. Ações com lógica continuam no Deliver (`sn-implement`).

## Non-Goals

*   UI Builder, Workspace, Service Portal e UI Page React. Fica tudo na Core UI clássica.
*   Kanban (Visual Task Board). No v1, a etapa aparece como lista agrupada por etapa mais a trilha no topo do registro.
*   Editor visual de régua com nós. A régua vira registro-pai com etapas editáveis na própria lista.
*   A/B de régua e fila de aprovação de IA, que ficam para depois. A priorização é por regra determinística (o score fica como campo opcional).
*   Integrações reais (seguem simuladas).

## Decisões do agente (a validar)

| # | Decisão | Por quê | Alternativa descartada |
|---|---|---|---|
| D1 | **Nova tabela `contato`** (item da lista de cobrança ativa): contribuinte, atendente, ciclo, status, próxima ação em, último resultado, tentativas, prioridade e valor em aberto. A `interacao` passa a apontar para `contato` ou para `caso` | O atendente trabalha ligações, não casos qualificados (02 §1). Reaproveitar `caso` misturaria as duas estratégias, que não podem dividir lista (01, implicação 3) | Usar `contribuinte` como item da lista: perde ciclo, status e histórico por rodada |
| D2 | **O `caso` passa a ser do coordenador**: `atendente` vira `responsavel` (padrão: coordenador). A ACL de carteira (F5-007) passa a valer para `contato` e `contribuinte`; no `caso`, só coordenador e admin | Validação MT 17/06 | Manter atendente no caso qualificado |
| D3 | **Home por persona.** Atendente: preferência de página inicial apontando para o módulo "Minha lista". Coordenador: o dashboard "Painel da cobrança" | A Core UI não tem home por papel nativa. A preferência por usuário funciona para os usuários demo e é documentada para os reais | UI Page de redirecionamento (custo alto) |
| D4 | **Painel da cobrança** como `Dashboard()` (Platform Analytics) com 4 widgets: funil do crédito, regularizado × meta, efeito incremental × controle e parcelamentos em risco | A teoria pede painel de decisão (01, implicação 8). O Dashboard é a única superfície de painel no Fluent | Reports soltos no menu (a situação atual) |
| D5 | **Modelo de estados com trilha de etapas** em `contato` (a ligar → ligado → retornar → encerrado), `caso` (em seleção → selecionado → dossiê → condução → encerrado) e `ciclo` (prévia → publicado → distribuído → encerrado). A trilha usa process flow formatter; as transições são feitas por UI Actions | M4. O `StateModel()` exige a BR `evaluateTransition`, e o process flow só mostra a etapa | Só campo choice sem trilha |
| D6 | **Verbos (UI Actions)**: no contato, "Registrar ligação", "Agendar retorno" e "Encerrar"; no caso, "Avançar etapa" e "Encerrar caso"; no ciclo, "Gerar prévia", "Publicar" e "Distribuir lista". O dado obrigatório vem por UI Policy no form (resultado, data de retorno, motivo), sem modal | Ações sem modal cabem na Core UI sem UI Page. A justificativa obrigatória é auditável (02, implicação 9) | GlideModal com UI Page (custo médio, ATF de UI mais frágil) |
| D7 | **Listas de até 6 colunas por tarefa**, com field styles (prioridade alta, retorno vencido, sinal coercitivo, parcelamento em risco). O menu filtra e ordena por prioridade e próxima ação | 02, implicação 3; auditoria P12/P13 | Listas com todas as colunas |
| D8 | **"Carteira" é a visão 360 do contribuinte em modo leitura**: débitos, parcelamentos, comunicações, ligações e casos como related lists. As ações ficam só no contato e no caso | Cada tarefa tem uma casa (02, §4) | Ações espalhadas |
| D9 | **Seed coerente**: o ciclo publicado tem segmentação consistente; o grupo de controle vale 10% dos elegíveis; as taxas ficam entre 0 e 100%; os contatos são distribuídos entre os 2 atendentes com próximas ações de hoje até +7 dias; há 6 casos qualificados do coordenador espalhados pelas etapas | M6 | Seed aleatório por coluna |
| D10 | **O kit generaliza**: `navigation` (áreas, módulos FILTER/LIST/DIRECT, roles, view, filtro, ordem), `homes` (por papel), `processFlows` (tabela, campo, etapas) e `fieldStyles` no formato do modelo de dados. O `sn-scaffold` gera módulos, separadores, preferências de home, process flows e estilos | M7: o próximo app já nasce orientado a tarefa | Codificar à mão só neste app |

## Critical User Journeys

### CUJ-A: Atendente trabalha a lista do dia (M1, M3, M4, M5)
*   **Given**: `demo.atendente` com 20 contatos, 5 com retorno vencendo hoje.
*   **When**: entra na instância.
*   **Then**: cai em "Minha lista". Vê só os próprios contatos, ordenados por próxima ação e prioridade, com telefone, valor, status e próxima ação. Abre um contato, vê a trilha de etapas e o histórico de ligações, clica em "Registrar ligação", escolhe o resultado, informa o retorno se houver e salva. O contato sai da lista do dia ou muda de status. Total: no máximo 3 cliques.

### CUJ-B: Coordenador roda o ciclo do mês (M3, M4)
*   **Given**: um critério publicado e um ciclo novo em "prévia".
*   **When**: no ciclo, clica em "Gerar prévia", "Publicar" e "Distribuir lista".
*   **Then**: a trilha avança a cada passo. A prévia preenche os elegíveis, o sorteio do grupo de controle e a segmentação. Publicar trava os números. Distribuir cria os contatos da massificada, divididos entre os atendentes. A mensagem informa quantos contatos foram para cada um.

### CUJ-C: Coordenador conduz um caso qualificado (M4, M5)
*   **Given**: casos qualificados em várias etapas.
*   **When**: abre "Casos qualificados".
*   **Then**: a lista vem agrupada por etapa. No caso, a trilha mostra a etapa, o dossiê está nas related lists (débitos, parcelamentos, comunicações, ligações), e o caso avança com "Avançar etapa" ou "Encerrar caso". Encerrar exige motivo.

### CUJ-D: Coordenador olha o painel (M1)
*   **Given**: dados demo coerentes.
*   **When**: entra na instância.
*   **Then**: cai no "Painel da cobrança" e vê funil, regularizado × meta, efeito incremental × controle e parcelamentos em risco, com números plausíveis.

## Technical Plan

### Menu "Cobrança MT"

| Área (separador) | Módulo | Tipo | Destino | Papéis |
|---|---|---|---|---|
| Minha lista | Minha lista | FILTER | `contato`: `atendente=javascript:gs.getUserID()^status!=encerrado^ORDERBYproxima_acao_em^ORDERBYDESCprioridade`, view `minha_lista` | atendente |
| | Retornos de hoje | FILTER | `contato`: `atendente=eu^status=retornar^proxima_acao_em<=hoje` | atendente |
| | Meus contribuintes | FILTER | `contribuinte`: `atendente=eu`, view `carteira` | atendente |
| Casos qualificados | Casos qualificados | FILTER | `caso`: `estagio!=encerrado^ORDERBYestagio^ORDERBYDESCprioridade`, view `qualificada` | coordenador |
| Ciclo e carteira | Ciclo do mês | FILTER | `ciclo`: `estado!=encerrado^ORDERBYDESCreferencia` | coordenador |
| | Carteira | LIST | `contribuinte`, view `carteira` | coordenador |
| | Distribuição da lista | FILTER | `contato`: `status!=encerrado^GROUPBYatendente` | coordenador |
| Réguas | Réguas | LIST | `regua` | coordenador |
| | Disparos com falha | FILTER | `comunicacao`: `status=falha` | coordenador |
| Analytics | Painel da cobrança | DIRECT | dashboard | coordenador |
| | Parcelamentos em risco | FILTER | `parcelamento`: `status=em_risco` | coordenador |
| Configurações | Critérios | FILTER | `criterio`: `estado=publicada` | coordenador |
| | Metas | LIST | `meta` | coordenador |
| | Integrações | FILTER | `sincronizacao`: `ORDERBYDESCinicio` | coordenador, admin |
| Administração | 21 tabelas | LIST | uma por tabela | admin |

### Mudanças no modelo

*   **Nova `contato`:**
    *   `contribuinte` (ref), `atendente` (sys_user), `ciclo` (ref);
    *   `status` [a_ligar/ligado/retornar/encerrado];
    *   `proxima_acao_em` (glide_date), `ultimo_resultado` [choices de `interacao.resultado`], `tentativas` (integer), `prioridade` (integer);
    *   `valor_em_aberto` (currency), `telefone` (string, cópia de exibição), `motivo_encerramento` [regularizado/sem_contato/recusa/outro].
*   **`interacao`:**
    *   ganha `contato` (ref);
    *   `caso` continua, e uma interação aponta para um dos dois;
    *   ganha `retorno_em` (glide_date).
*   **`caso`:** `atendente` renomeado para `responsavel` (padrão: usuário coordenador).
*   **`ciclo.estado`:** ganha a choice `distribuido`.
*   **Rótulos e display values:**
    *   display de `caso` = número/contribuinte;
    *   display de `ciclo` = nome;
    *   display de `contato` = contribuinte.

### Lógica (Deliver)

| Objeto | Comportamento |
|---|---|
| UI Action "Registrar ligação" (contato) | UI Policy torna `ultimo_resultado` obrigatório. O script cria a `interacao`, incrementa `tentativas` e define o status: promessa ou contato efetivo vira `ligado`; retorno informado vira `retornar` com `proxima_acao_em`; recusa ou sem contato na 3ª tentativa vira `encerrado` |
| UI Action "Agendar retorno" | Exige `proxima_acao_em` e passa o status para `retornar` |
| UI Action "Encerrar" (contato) | Exige `motivo_encerramento` |
| BR (regularização) | Ao inserir uma regularização do contribuinte, encerra os contatos abertos com motivo "regularizado" (RN-09) |
| UI Actions do ciclo | "Gerar prévia", "Publicar" e "Distribuir lista" reaproveitam o `QualificacaoCiclo` (F2-004). "Distribuir" cria um `contato` por contribuinte da massificada, em rodízio entre os usuários com o role atendente |
| UI Actions do caso | "Avançar etapa" segue a ordem dos estágios. "Encerrar caso" exige motivo (já existe UI Policy) |
| ACL | Ver tabela abaixo |
| Testes ATF | Um teste positivo e um negativo por ação. Os testes da carteira (F5-007) e do dossiê (F5-003) são migrados para o novo dono |

ACLs:

| Tabela | Atendente | Coordenador e admin |
|---|---|---|
| `contato` | lê e grava os próprios | tudo |
| `contribuinte` | lê os da própria carteira | tudo |
| `caso` | sem acesso | tudo |

### Kit (D10)

O formato do `data-model.json` ganha seções opcionais:

```json
"navigation": [{ "area": "Minha lista", "roles": ["atendente"], "modules": [{ "title": "...", "type": "FILTER|LIST|DIRECT", "table": "...", "filter": "...", "view": "...", "roles": ["..."], "link": "..." }] }],
"homes": [{ "role": "atendente", "module": "Minha lista" }, { "role": "coordenador", "dashboard": "Painel da cobrança" }],
"processFlows": [{ "table": "contato", "field": "status", "steps": ["a_ligar", "ligado", "retornar", "encerrado"] }],
"fieldStyles": [{ "table": "contato", "field": "proxima_acao_em", "condition": "proxima_acao_em<javascript:gs.beginningOfToday()", "style": "background-color: #fde8e8" }],
"dashboards": [{ "title": "Painel da cobrança", "roles": ["coordenador"], "widgets": [{ "title": "...", "table": "...", "groupBy": "...", "metric": "COUNT|SUM:<campo>" }] }]
```

*   **O `sn-scaffold`:**
    *   gera menu por área a partir de `navigation`, com separadores, módulos filtrados e roles;
    *   sem `navigation`, mantém o comportamento atual: um módulo por tabela, num separador "Dados";
    *   gera `sys_process_flow` mais o formatter no form;
    *   gera `sys_ui_style`;
    *   gera `Dashboard()`;
    *   gera as preferências de home dos usuários demo.
*   **Testes:** cada seção nova tem teste.
*   **Documentação:** o formato fica documentado no SKILL.md do `sn-scaffold` e no schema ServiceNow da `spec-data-model`.

### Documentos

Os documentos do Plan precisam acompanhar a nova estrutura:

| Documento | Mudança |
|---|---|
| `especificacao-funcional.md` | novas telas (Minha lista, contato, ciclo com ações, painel) |
| `product-requirements.md` | as mesmas telas |
| `flow-map.md` | as mesmas telas |
| `screens-manifest.json` | reprodução das telas novas |
| `tasks.json` e issues | stories novas para contato, verbos, menu, home e painel; publicadas por `sn-tasks-github --change` |

Registrar a mudança de escopo pela `spec-scope-change`.

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| A preferência de home não tem efeito na versão Brazil | Verificar na instância. Plano B: módulo "Minha lista" como primeiro item, com o caminho documentado |
| Dashboard (Platform Analytics) abre fora da UI16 | Aceito (Non-Goal de UI Page). O link fica no menu |
| Migrar `caso.atendente` para `responsavel` quebra os testes F5-003 e F5-007 | Migrar os testes na mesma story e reinstalar com a suíte inteira |
| `StateModel()` em tabela custom exige a BR `evaluateTransition` | Seguir o `state-model-guide.md`. Se travar, usar só o process flow mais as UI Actions |

## Verification

*   **Instância:**
    *   `npm run reinstall` com a suíte `cob-regressao` verde, incluindo os testes novos;
    *   prints antes e depois, na visão de `demo.atendente` e `demo.coordenador`.
*   **Navegação, conferida por Playwright:**
    *   o login de `demo.atendente` cai em "Minha lista" e o de `demo.coordenador` no painel;
    *   contagem de módulos visíveis por papel: atendente ≤ 5, coordenador ≤ 12.
*   **Cliques:** o CUJ-A é percorrido por script com no máximo 3 cliques, e o CUJ-B com no máximo 4.
*   **Kit:** `npm test` sem falha nova, com os testes das seções novas do scaffold.

--------------------------------------------------------------------------------

## Revisão EGM e decisões finais (v1.1, 25/11/2026)

A revisão consolidada (zoom-out, design, prontidão e codebase) está em `review-ux/consolidated_review_report.md`. Ela encontrou 13 bloqueadores, 14 problemas maiores e 7 menores, e deixou 8 decisões em aberto. Com o autor ausente e autorização para seguir, o agente decidiu as 8. **Prevalecem sobre o texto acima onde houver conflito.**

| # | Decisão | Escolha |
|---|---|---|
| R1 | Estado do ciclo | **Sem estado novo.** Campo `ciclo.distribuido_em` (glide_date_time) mais `qtd_contatos` (integer). A etapa "Distribuído" do process flow sai da condição `estado=publicado^distribuido_emISNOTEMPTY`. O ciclo continua indo a "encerrado" pelo caminho que já existe |
| R2 | "Gerar prévia" | **Cortada no v1.** O fluxo do ciclo fica Publicar (existente, sorteio e totais) e depois Distribuir lista: 2 botões. O M3 passa a "no máximo 3 cliques" |
| R3 | Dono contato × contribuinte | `contato.atendente := contribuinte.atendente`. O contribuinte sem atendente recebe um por rodízio entre os usuários com role atendente, e o mesmo valor é gravado no contato e no contribuinte |
| R4 | O coordenador registra interação no caso? | **Sim.** `role_coordenador` entra no create de `interacao`. O teste F5-007 que afirmava o contrário é invertido |
| R5 | Painel | **Reports, sem `Dashboard()`.** Os reports TEL-026 a TEL-029 viram módulos REPORT na área Analytics, e o GAP fica em `gaps.md`, conforme `servicenow-ui.md`. A home do coordenador é "Casos qualificados", o trabalho diário dele |
| R6 | Coluna de dono do caso | **`coordenador`** (reference `sys_user`, rótulo "Responsável"). O `sn-seed` já distribui entre os usuários demo do papel com esse nome, e a coluna `atendente` sai do `caso` |
| R7 | Seed coerente | **Seed à mão** para `ciclo`, `contato` e `caso`, em arquivos sem cabeçalho de gerado (`app/src/fluent/seed-demo/`). O `sn-seed` deixa de gerar essas tabelas quando elas aparecem em `seedManual`. As datas relativas são calculadas no momento em que o seed é escrito; o roteiro da véspera regera esses arquivos |
| R8 | M1 se a preferência de home não funcionar | O critério do M1 passa a ser "1º módulo do menu do papel" |

**Cortes aplicados** (tabela "Cortes" da revisão):
- UI Action "Agendar retorno" (coberta por "Registrar ligação" com retorno);
- módulos "Retornos de hoje" e "Distribuição da lista";
- field styles;
- BR de regularização (RN-09), registrada em GAP;
- cópia de `contato.telefone` (exibido por dot-walk `contribuinte.telefone`);
- `Dashboard()`;
- estado `distribuido`;
- "Gerar prévia";
- seções `homes`, `fieldStyles` e `dashboards` do kit; a home é gerada pelo `sn-seed`;
- documentos, exceto a `spec-scope-change`;
- risco do StateModel: **v1 sem StateModel**, só process flow e UI Actions;
- ATF reduzido a 1 por verbo do CUJ mais 1 negativo por ACL nova.

**Correções obrigatórias aplicadas na implementação** (itens da revisão):
- **Verbos (🔴3):** UI Action client+server (`g_form.setMandatory` + `gsftSubmit` + guard `typeof window`), revalidação no servidor com `{ok, mensagem}`, `condition`, `roles` e `actionName`.
- **Interação (🔴4):** `interacao.caso` deixa de ser obrigatório, e uma BR exige exatamente um entre `contato` e `caso`. O dono passa a ser `contato.atendente` ou `caso.coordenador` no mapa `DONO`, nas ACLs e nas BRs da carteira. Regularização: `atendente` ou `caso.coordenador`.
- **Migração do dono do caso (🔴5):** todo o inventário de arquivos da revisão. F5-003 e F5-007 são reescritos (positivo = coordenador, negativo = atendente sem acesso).
- **Atendente sem acesso ao caso (🔴6):** ACL deny à mão em arquivo próprio.
- **Grupo de controle (🟡7):** BR before insert em `contato` chama `motivoRecusaAcao` do grupo de controle, e "Distribuir" só cria contato para `segmento=massificada`.
- **Registrar ligação (🔴13):** tabela de decisão abaixo; filtro exato de "Minha lista"; etapas do process flow por `condition`.
- **Menu (🟡3, 🟡4):** encoded queries reais e roles `x_2326104_cob.*`; `modules` estendido com `type`, `filter`, `view` e `roles`, sem seção paralela; corrigido o bug `title`/`label` do `scaffold.mjs` (o separador nunca era gerado); `servicenow-ui.md` atualizado.
- **Rótulos e moeda (🟡6, 🟡11):** display por `entities[].display`; rótulos em português; moeda R$ por `currency` com código BRL no campo, ou `decimal` com rótulo "(R$)" quando o código não puder ser fixado no Fluent.

### Tabela de decisão: "Registrar ligação"

| Resultado | Retorno informado? | Tentativas após somar 1 | Novo status | `proxima_acao_em` | Motivo |
|---|---|---|---|---|---|
| promessa_pagamento | — | — | ligado | retorno informado ou hoje + 7 | — |
| contato_efetivo | sim | — | retornar | retorno | — |
| contato_efetivo | não | — | encerrado | vazio | contato realizado |
| sem_contato | — | < 3 | retornar | amanhã | — |
| sem_contato | — | ≥ 3 | encerrado | vazio | sem_contato |
| recusa | — | — | encerrado | vazio | recusa |

O campo "Anotação" (`descricao` da interação) é obrigatório no cliente e no servidor.

Filtro de "Minha lista":
```
atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade
```

### Fases de implementação

| Fase | O que | Verde quando |
|---|---|---|
| F0 | `spec-scope-change` (CHG) e stories US-MOD-UX-001…008 no `tasks.json` | validadores do kit sem FATAL |
| F1 | Kit: `modules` estendido, `processFlows`, `seedManual`, home no `sn-seed`, bug `title`/`label` | `npm test` sem falha nova |
| F2 | `data-model.json` → `sn-scaffold` → seed à mão → commit → `npm run reinstall` | install ok, contagem ok |
| F3 | Verbos e BRs pelo `sn-implement`, com migração do dono do caso | recibo ATF por story |
| F4 | ACLs e testes migrados (F5-003, F5-007) | suíte `cob-regressao` verde |
| F5 | Home por preferência e reports no menu | impersonate confere o destino |
| F6 | Prints antes e depois por persona, documentos e issues (`--change`) | prints em `outputs/spec/screens/ux-v1/` |

Stories:
- US-MOD-UX-001: contato e menu;
- US-MOD-UX-002: Registrar ligação;
- US-MOD-UX-003: Encerrar contato;
- US-MOD-UX-004: Distribuir lista;
- US-MOD-UX-005: caso do coordenador e Avançar etapa;
- US-MOD-UX-006: ACLs;
- US-MOD-UX-007: home e reports;
- US-MOD-UX-008: seed coerente e rótulos.
