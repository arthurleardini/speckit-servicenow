# Speckit ServiceNow v0

* **Author:** arthurleardini
* **Date:** 2026-11-24
* **Status:** Histórico. O design `speckit-servicenow-v0.md` prevalece onde diverge (protótipo = instância, base no zip, repo único).

## Overview

É um kit separado, fork do Harness Elo 2.6.0 com manutenção da própria equipe. Ele copia as etapas do Elo Spec Kit (Discovery → Especificação → Dev e Testes) e troca o alvo: em vez de um app Next.js, gera um app escopado ServiceNow. Quem usa são os FDEs da EloGroup em projetos de cliente.

O v0 roda de ponta a ponta num caso real, o Plano de Implementação 2.6 Cobrança da SEFAZ-MT: 5 épicos, 6 funcionalidades (F1 a F6), 42 RF mais 4 transversais e 32 critérios de aceite. A cadeia do v0 é esta:

1. Especificação.
2. Protótipo HTML com o visual da Core UI clássica do ServiceNow.
3. Backlog no GitHub (issues e Projects), com o print de cada tela na story.
4. App criado pelo ServiceNow SDK (Fluent) com Claude Code numa PDI e populado com dados fictícios.

O escopo é grande por decisão do autor. O sucesso é o diretor da EloGroup ver na demo que o método é um avanço.

Insumos: `../../referencias/` (índice em `00-README.md`, etapas em `12-etapas-speckit-servicenow.md`) e `10-elogroup/sefaz-mt/planos-implementacao/apresentacoes/refined/1.5 Planos de Implementação/Plano de Implementação - 2.6 Cobrança.md`.

## Analysis

Os 7 revisores (design, codebase, zoom-out, compreensão, prontidão, estrutura, inventivo) leram as referências e o código do harness extraído.

### Contradições centrais e como resolver

**1. Protótipo HTML × app real.** Quanto mais o HTML se parece com o ServiceNow, mais ele repete o trabalho do form e da list que o app vai ter de novo em Fluent. Telas dinâmicas, como o dossiê em tela única e os painéis de KPI, tendem a sair diferentes na PDI.

Resolução: uma descrição de tela por tabela (campos, seções, ações, related lists), como extensão do `screens-manifest.json`, que alimenta dois geradores: o HTML Core UI e o layout Fluent. Depois da instalação, o Playwright fotografa a tela da PDI, e a story recebe dois prints: o desenhado e o construído.

**2. Escopo grande × prazo da demo.** O escopo inteiro fica, e o que varia é a profundidade.
- Spec, protótipo e backlog cobrem 100%, porque texto e HTML custam pouco.
- No app, todas as funcionalidades ganham tabelas, forms, lists, menu, roles e ACLs.
- Lógica completa (business rules, flow, ATF) entra só num fio que atravessa os épicos.

Cada RF ganha um nível no `tasks.json`: N1 estrutura, N2 comportamento, N3 testado. O ciclo G3 completo (cerca de 390 mil tokens por task) roda só nas stories do fio. As outras usam isenção registrada, mecanismo que o harness já tem.

**3. Dados fictícios × realismo, com sigilo fiscal.**
- O seed sai da própria spec: limites das regras, `testData` dos cenários e estados de tela viram registros que exercitam cada critério.
- O mesmo conjunto serve ao mock do HTML, aos `Record()` de demo e ao ATF.
- CPF e CNPJ fictícios precisam ter dígito verificador válido, porque a F1 rejeita documento inválido.
- O `check_sensivel.py` roda antes de instalar e antes de publicar.

**4. Dependências externas × ponta a ponta na PDI.** Cada integração vira uma tabela simulada:
- Score UFMT: arquivo fictício carregado por Import Set, com a marca "sem score" e o fallback.
- SMS, e-mail, SNE e WhatsApp: tabela de envio simulado, com status e um interruptor de falha.
- 5 fontes de débito: campo de origem ou tabelas de staging.

O próprio plano já pede fallback quando falta o score e pula o WhatsApp sem opt-in, então a ausência vira cena da demo, como requisito atendido. Tudo que é simulado leva o rótulo "simulado" na tela e no backlog.

**5. Fork que copia × manutenção.** O harness trava edição em skills, hooks e rules (`harness-zona.lock.json`), e o v0 precisa mexer nessa zona.

Resolução:
- Partir do repositório-template e gerar o próprio lock com `empacotar.mjs`.
- Separar as cópias intactas das peças novas.
- Manter um manifesto de origem e hash por arquivo copiado.
- Usar um script no molde do `doutor.mjs` que aponta divergências quando sair um harness novo, sem fazer merge automático.

**6. PDI descartável.** A PDI some com 10 dias sem login e o `--reinstall` é destrutivo. Por isso a demo precisa sair de um comando só (build, install e seed a partir do git), ensaiado numa PDI zerada.

### Resultado ideal

A pessoa escreve só a spec. Protótipo, prints, backlog, app, ATF e dados de demo saem dela, e uma PDI zerada vira a demo com um comando.

O diretor acompanha um mesmo identificador atravessando tudo: épico → funcionalidade → RF → critério → tela → story/task → arquivo `.now.ts` → ATF → registro do seed.

### Problemas confirmados no código do harness

| # | Problema | Onde |
|---|---|---|
| 1 | Não existe script que gere os prints. O kit define só o contrato `screens/<TEL-ID>.png`, e a captura fica com o agente via Playwright, que não é dependência do harness | `spec-iterate`, `tools/references/screens-manifest.md` |
| 2 | O `fecho-explore` exige protótipo `Fidelidade: alta` com frontend em `src/` e recusa HTML sem isenção | `hooks/fecho-explore.mjs` l. 548–587, `hooks/kit.mjs` |
| 3 | A ordem do v0 no `12` §4 roda etapas do Plan antes do protótipo, e o gate bloqueia | `12` §4 × `fecho-explore` |
| 4 | Os hooks comparam o nome exato `spec-*`. Uma skill `sn-*` roda sem pré-requisito conferido | `cadeia.mjs` (`PRE_REQUISITOS`), `fecho-explore.mjs:50`, `sync-log.mjs` |
| 5 | `Task.type` é enum fechado. Tipos ServiceNow quebram o schema, 41 validadores, o publicador e a estimativa | `spec-tasks/templates/tasks.schema-atual.json:1135-1144` |
| 6 | `cadeia.mjs` exige `api-contracts.yaml` para `spec-tasks` e `spec-scaffold`, então a etapa 7b não é opcional | `cadeia.mjs` l. 97 e 109 |
| 7 | O publicador ADO segue sem imagem quando falta o print, só com aviso. O `id-map.json` é entrada, não saída | `azureDevopsService.js` l. 841, `cli.mjs:35` |
| 8 | O publicador nunca rodou contra um ADO real (nota 2.6.0). A falta do `az` não importa, porque ele usa REST com PAT | `azureDevopsService.js` l. 709–805 |
| 9 | ATF pela linha de comando não está confirmado, e o ATF de form precisa de um navegador aberto no Client Test Runner. Sem isso, o `delivery-gate` barra todo push | arquivo `30`, RN-SN de ATF |
| 10 | No plano piloto, RF-01, RF-02 e CT-01 se repetem em cada funcionalidade e há saltos na numeração. Não servem de chave | plano 2.6 |

Outros pontos:
- O `validador-observabilidade` procura `console.log`, e na plataforma o equivalente é `gs.log`/`gs.error`.
- A PDI de desenvolvedor tem limite de Performance Analytics, o que afeta os KPIs da F6. A saída são reports simples.
- Laço de Flow vai até 1.000 iterações, o que limita o volume do seed a centenas de registros.

## Goals vs. Non-Goals

* **In-Scope Goals:**
  * Fork do harness 2.6.0 com as etapas do Elo Spec Kit e as peças ServiceNow.
  * F1 a F6 do plano 2.6 Cobrança especificadas por inteiro, com protótipo Core UI clássico e backlog completo no GitHub com prints.
  * Harness adaptado no fork (hooks, schema, validadores e rules). Não há zona intocável.
  * App escopado na PDI com estrutura de todas as funcionalidades (tabelas, forms, lists, menu, roles, ACLs), lógica e ATF num fio que atravessa os épicos, e seed fictício idempotente.
  * Integrações externas simuladas como tabelas e rotuladas.
  * Rastreio por ID da spec até o registro na instância.
  * Reinstalação da PDI do zero por um comando, ensaiada.
* **Out-of-Scope Non-Goals:**
  * Integração real com UFMT, canais e fontes de débito, e qualquer dado real de contribuinte.
  * Destinos de backlog Azure DevOps e Agile 2.0, e geração para Cursor e Kiro.
  * Workspace, Service Portal e UI Builder.
  * `sn-legacy`, `sn-estimate`, relatório executivo de 7 abas, `sn-code-audit` com Instance Scan, `validador-escopo-app` e wiki em duas camadas. No v0 ficam como stub ou cópia sem mudança.
  * As 173 RN-SN viram gate só quando revisadas. No v0 entram como referência.
  * Recalibração do score, medidas coercitivas e articulação com a PGE (o próprio plano já trata como lacuna).

## Alternatives Weighed

- **Camada `sn-*` sobre o kit Elo, sem fork.** Rejeitada pelo autor: o kit vai ser um fork separado com manutenção própria.
- **Workspace, Service Portal ou UI Builder como visual.** Rejeitado pelo autor: o visual é a Core UI clássica.
- **Azure DevOps como destino do backlog.** Rejeitado pelo autor: o backlog vai para o GitHub. O publicador ADO do kit serve de molde para o publicador GitHub (mesmo gate de autossuficiência, `--dry-run`, `--change` por `logical-id`).
- **v0 enxuto, só com uma fatia.** Rejeitado pelo autor: o v0 é grande. A fatia vira o primeiro estágio, não o limite.
- **Protótipo pelo `spec-to-html` do spec-kit-v2.** Usa o design system EloGroup e não gera o `screens-manifest.json`, então não serve para o visual ServiceNow.

## Key Decisions & Staging for Next Steps

Decisões fechadas: fork separado; harness adaptável no fork; Core UI clássica; caso piloto 2.6 Cobrança MT; usuários FDEs Elo; v0 grande e sem teto de tokens ou prazo; sucesso é convencer o diretor; backlog no GitHub; instância `dev493801` (abaixo).

Decisões propostas, a confirmar no `/egm:egm-draft`:

| # | Ponto | Proposta |
|---|---|---|
| D1 | Nomes das skills no fork | Como o harness é adaptável: skills `sn-*` e hooks (`cadeia.mjs`, `fecho-explore.mjs`, `sync-log.mjs`) atualizados com os nomes novos, e lock regenerado |
| D2 | `fecho-explore` × protótipo HTML | Alterar o hook no fork para aceitar `Fidelidade: alta` em HTML com `screens-manifest.json` e regenerar o lock |
| D3 | Tipo de artefato ServiceNow na task | Ampliar o enum `Task.type` (schema `tasks/v5.4`) com os tipos ServiceNow e ajustar validadores, estimativa e leitores de tipo |
| D3b | Publicador GitHub | `sn-tasks-github`: épico e funcionalidade como issue pai, story como sub-issue, task como checklist ou sub-issue; labels por tipo e `logical-id`; PNG versionado no repo e referenciado no corpo da issue (o `gh` 2.63.2 não anexa imagem); falha se faltar print obrigatório |
| D4 | Prints | Script versionado com Playwright: captura protótipo e PDI, 1440×900, PNG abaixo de 5 MB |
| D5 | Visual Core UI | Imitar a UI16 (Core UI clássica), escrito na rule de UI do fork |
| D6 | IDs | Renomear RF e CT por funcionalidade (`RF-F1-01`, `CT-F1-01`). Matriz `traceability.json` obrigatória, cobrada no gate do Plan |
| D7 | Integrações externas | Tabelas simuladas + seed. `api-contracts.yaml` só documenta as simulações (atende `cadeia.mjs`) |
| D8 | ATF | ATF de servidor pela CLI se o teste do estágio 0 passar. ATF de form rodado à mão e registrado como isenção |
| D9 | Seed | `Record()` com `installMethod: 'demo'`, centenas de registros por tabela, gerado da spec |
| D10 | Profundidade | Fio N3 por F2 (qualificação com critério versionado e grupo de controle) mais o dossiê da F5. O resto em N1/N2 |
| D11 | Formato da demo | Resultado pronto com a trilha de IDs, mais um trecho ao vivo da esteira (uma story da spec ao app). Plano B offline: `spec-tasks-html` e prints |

Estágios:

| Estágio | Entrega | Pronto quando |
|---|---|---|
| 0. Testes rápidos | Fork a partir do template; Node e SDK fixados; Playwright; `now-sdk auth` e `init` na PDI; repositório GitHub privado e `gh` validado; teste de ATF pela CLI | `doutor` verde |
| 1. Fatia vertical | F2: RF → telas → `tasks.json` → work item com print → tabela, form, BR e ATF na PDI, com seed | Matriz de rastreio sem lacuna na fatia |
| 2. PDI do zero | Reinstalação por um comando a partir do git | Ensaio numa PDI zerada |
| 3. Largura na spec | F1–F6 na spec e no protótipo; backlog completo publicado com prints | Todos os itens com print; `check_sensivel` limpo |
| 4. Largura no app | Estrutura de tudo; F1 e F5 com fontes simuladas; F4 com canais simulados; F6 com reports; F3 por último | Todas as funcionalidades navegáveis na PDI |
| 5. Demo | Roteiro, prints protótipo × PDI lado a lado, plano B offline | Ensaio completo com o diretor como público-alvo |

Pré-requisitos:

| Item | Situação (24/11/2026) |
|---|---|
| Instância | `dev493801.service-now.com`, release **Brazil** patch 2 (out/2026). Credencial em `deliversuiteServiceNow/.env.instancia` (chmod 600, fora do git) |
| Prefixo de escopo | `2326104` → app `x_2326104_<nome>`, até 8 caracteres de nome (ex.: `x_2326104_cobmt`) |
| Plugins | ATF ativo. Agile 2.0 inativo (não usado) |
| Apps próprios na instância | nenhum |
| Backlog | GitHub, `gh` já autenticado. Falta definir o repositório |
| Teto de tokens e prazo | sem limite no v0 |
