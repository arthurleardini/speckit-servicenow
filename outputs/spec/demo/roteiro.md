# Roteiro da demo: Speckit ServiceNow v0 (piloto 2.6 Cobrança SEFAZ-MT)

Público: diretor da EloGroup. A demo dura cerca de 20 minutos. Todos os dados são fictícios.

## Véspera

1. `npm run doutor`: tudo verde, exceto o `gh` fora do PATH, que é contornado com `GH_BIN`.
2. Regerar o seed manual (ciclos, carteira segmentada, contatos e casos, com datas relativas a hoje), da raiz: `node app/scripts/gerar-seed-demo.mjs`. Commitar `app/src/fluent/seed-demo/` e `app/src/fluent/seed/_contagem.manual.json`, e rodar `node .claude/skills/sn-seed/scripts/gerar-seed.mjs` para juntar a contagem. Sem isso, a «Minha lista» do atendente chega vazia, porque as próximas ações envelhecem (design UX v1, R7).
3. `npm run reinstall`: install ok, contagem igual a `_contagem.json` e suíte `cob-regressao` verde (50 testes).
4. Entrar na instância com o admin (a PDI é recolhida depois de 10 dias sem login).
5. Abrir as abas da trilha (abaixo) e conferir que a [issue #63](https://github.com/arthurleardini/speckit-servicenow/issues/63) mostra os prints.

## 1. O problema (2 min)

Plano 2.6 Cobrança: 42 RF + 4 transversais e 32 critérios de aceite, hoje sem ligação com a instância. O protótipo antigo tinha visual próprio e o backlog não levava a tela.

## 2. A trilha de um requisito, pronta (8 min, CUJ 1)

RF escolhido: **RF-MOD-F2-002, publicação de versão do critério de qualificação** (fio condutor).

| Passo | Onde | O que mostrar |
|---|---|---|
| Spec | `outputs/spec/requirements/requirements.md` e `business-rules.md` | o RF e as RN (versão publicada é imutável; editar cria versão nova) |
| Teste de aceite | `outputs/spec/test-plan.md` | os CT-MOD-F2 do critério, em linguagem de negócio |
| Backlog | [issue #63](https://github.com/arthurleardini/speckit-servicenow/issues/63) (sub-issue do [épico #10](https://github.com/arthurleardini/speckit-servicenow/issues/10)) | a tela da instância no corpo, as tasks com `snArtifact` e os cenários |
| Código | `app/src/fluent/` (Script Include `CriterioVersao`, business rules, UI Actions) | o `$id` com o ID da spec |
| Instância | [Versão do critério](https://dev493801.service-now.com/x_2326104_cob_criterio.do?sys_id=d5fc10ccc165417891772b280ae1b4c2) | "Publicar versão" bloqueia a edição; "Criar nova versão" |
| Teste | `outputs/spec/auditorias/atf/US-MOD-F2-002.json` + ATF na instância | recibo verde, 13 testes (positivo e negativo por regra) |
| Auditoria | `outputs/spec/auditorias/US-MOD-F2-002.md` | veredito de um revisor sem contexto da implementação |
| Rastreio | `outputs/spec/traceability.json` / `report/tasks.html` | RF em N3, sem órfãos |

Segunda trilha, se houver tempo: **isolamento de carteira** ([issue #68](https://github.com/arthurleardini/speckit-servicenow/issues/68), [issue #101](https://github.com/arthurleardini/speckit-servicenow/issues/101)). Fazer *impersonate* de `demo.atendente` e depois de `demo.atendente2` em [Minha lista](https://dev493801.service-now.com/x_2326104_cob_contato_list.do): cada um vê só os próprios contatos, e nenhum dos dois vê caso qualificado.

## 2b. Antes e depois da UX v1 (4 min)

A reformulação de UX v1 (`docs/designs/ux-cobranca-v1.md`, v1.1) organizou o app pelo trabalho de cada papel. Antes, o menu tinha uma lista por tabela e o atendente trabalhava casos qualificados. Depois, o atendente trabalha uma lista de ligações e o caso qualificado é do coordenador. Prints «antes» do commit `48e8686` (Plan, 33 telas); prints «depois» em `outputs/spec/screens/ux-v1/`.

| Tela | Antes | Depois |
|---|---|---|
| Entrada do atendente | [TEL-023 antes](https://github.com/arthurleardini/speckit-servicenow/blob/48e8686/outputs/spec/screens/TEL-023.png) «Minha fila» de casos, aberta pelo menu | [home = Minha lista](../screens/ux-v1/home-atendente.png) · [TEL-034 Minha lista](../screens/ux-v1/TEL-034.png) |
| Contato e ligação | [TEL-025 antes](https://github.com/arthurleardini/speckit-servicenow/blob/48e8686/outputs/spec/screens/TEL-025.png) interação solta, ligada ao caso | [TEL-035 Contato da lista](../screens/ux-v1/TEL-035.png) · [depois de Registrar ligação](../screens/ux-v1/contato-depois-registrar.png) |
| Entrada do coordenador | [TEL-021 antes](https://github.com/arthurleardini/speckit-servicenow/blob/48e8686/outputs/spec/screens/TEL-021.png) lista crua de casos | [home = Casos qualificados](../screens/ux-v1/home-coordenador.png) · [pela sequência das etapas](../screens/ux-v1/casos-qualificados-por-etapa.png) |
| Caso qualificado | [TEL-024 antes](https://github.com/arthurleardini/speckit-servicenow/blob/48e8686/outputs/spec/screens/TEL-024.png) sem trilha nem botões de etapa | [trilha de etapas](../screens/ux-v1/caso-dossie-trilha.png) · [depois de Avançar etapa](../screens/ux-v1/caso-depois-avancar.png) |
| Ciclo do mês | [TEL-009 antes](https://github.com/arthurleardini/speckit-servicenow/blob/48e8686/outputs/spec/screens/TEL-009.png) «Ciclo de qualificação (prévia)» | [trilha do ciclo](../screens/ux-v1/ciclo-trilha.png) · [depois de Distribuir lista](../screens/ux-v1/ciclo-depois-distribuir.png) |
| Menu | uma lista por tabela, igual para todos | [menu do atendente](../screens/ux-v1/menu-atendente.png) · [menu do coordenador](../screens/ux-v1/menu-coordenador.png) |

**Jornada do atendente** (`demo.atendente`): login → «Minha lista» → «Registrar ligação». 5 cliques do login à ligação registrada, contados em `outputs/spec/screens/ux-v1/acoes.json`.

| # | Passo | Cliques |
|---|---|---|
| 1 | Login: a home do atendente já é «Minha lista» | 0 |
| 2 | Abrir o contato na lista | 1 |
| 3 | Escolher «Resultado desta ligação» (abrir a lista e escolher) | 2 |
| 4 | Clicar em «Comentários» e digitar a anotação | 1 |
| 5 | Clicar em «Registrar ligação» | 1 |

Resultado na instância: «Ligação registrada. Status: Ligado; próxima ação em 01/12/2026.» O form abre com «Resultado desta ligação» vazio, mesmo com «Último resultado» preenchido (GAP-150): repetir «Sem contato» funciona, esquecer de escolher é recusado.

**Jornada do coordenador** (`demo.coordenador`): login → «Casos qualificados» → «Avançar etapa». 2 cliques do login ao caso avançado.

| # | Passo | Cliques |
|---|---|---|
| 1 | Login: a home do coordenador já é «Casos qualificados» | 0 |
| 2 | Abrir o caso na lista | 1 |
| 3 | Clicar em «Avançar etapa» | 1 |

Resultado: «Caso avançou para «Caso selecionado».» O caso anda uma etapa por vez e só encerra com motivo, também por lista e API (GAP-152).

Depois, «Ciclo do mês» → «Distribuir lista»: 3 cliques.

| # | Passo | Cliques |
|---|---|---|
| 1 | Login: a home do coordenador é «Casos qualificados» | 0 |
| 2 | Menu «Ciclo do mês» | 1 |
| 3 | Abrir o ciclo publicado | 1 |
| 4 | Clicar em «Distribuir lista» | 1 |

Resultado: «Lista distribuída: 3 contatos — Demo Atendente B: 1; Demo Atendente: 2.»

Issues: [épico #91](https://github.com/arthurleardini/speckit-servicenow/issues/91) e stories [#96](https://github.com/arthurleardini/speckit-servicenow/issues/96) a [#103](https://github.com/arthurleardini/speckit-servicenow/issues/103), fechadas com ATF, prints e commits no comentário.

## 3. Um trecho ao vivo (5 min)

Rodar `npm run reinstall` (sem `--zerar`) e mostrar a linha nova no `outputs/spec/sync-log.md`. Depois `npm run atf -- --suite cob-regressao` e mostrar o recibo atualizado em `outputs/spec/auditorias/atf/cob-regressao.json`.

## 4. Largura (3 min)

Na instância, menu **Cobrança MT** por área de trabalho: 22 tabelas, 35 telas na Core UI clássica, 1009 registros fictícios e reports de KPI ([Funil do crédito](https://dev493801.service-now.com/sys_report_template.do?jvar_report_id=1a1426065dd943ab896d646f7625bb90)). No GitHub, 97 issues ([#7](https://github.com/arthurleardini/speckit-servicenow/issues/7) a #103) com prints.

| Situação | Quantidade |
|---|---|
| RF do fio condutor com lógica e ATF (N3) | 5 de 46 |
| Demais RF | estrutura navegável (N1/N2) |
| Integrações (score UFMT, canais, fontes) | simuladas, com rótulo "Simulado" (SIM-01..03) |

## Plano B (offline)

`outputs/spec/report/tasks.html`, com os prints embutidos, e os PNGs em `outputs/spec/screens/`. Use se a instância ou o GitHub não responderem.

## Perguntas previsíveis

| Pergunta | Resposta e onde está |
|---|---|
| De onde vêm os parâmetros de negócio (grupo de controle 10%, ciclo mensal)? | Premissas fictícias do v0, marcadas como premissa (`inputs/premissas-ficticias.md`, GAP-001..005) |
| E as integrações reais? | Fora do v0; tabelas `SIM-` simulam score, canais e fontes |
| Quanto disso o agente fez sozinho? | Spec, app, testes, backlog e auditorias saíram das skills do kit; as decisões de produto ficam com o consultor |
