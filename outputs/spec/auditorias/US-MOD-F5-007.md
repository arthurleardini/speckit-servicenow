# Auditoria de Entrega — [US-MOD-F5-007] Visão restrita do atendente

- **User Story:** US-MOD-F5-007 (nó `STORY-MOD-F5-007` no `outputs/spec/tasks.json`, label `fio-condutor`) — RF-MOD-F5-007 · Visão restrita do atendente
- **Features/IDs cobertos:** RF-MOD-F5-007 · RN-NOVO-F5-007 (atendente vê só a própria carteira) · AC-RF-MOD-F5-007-01..03 e AC-STORY-MOD-F5-007-RF-MOD-F5-007-01..03 · tasks TASK-MOD-F5-007-01, -02, -03 e o controle SEC-002 (CRÍTICO, CVSS 8.8) · tela TEL-023 (Minha fila)
- **Branch/commit auditado:** `feat/v0` @ `5a0e1f7` (delta `3111eeb..5a0e1f7 -- app/`; `3111eeb` abriu a US)
- **Data:** 2026-11-24
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Esta auditoria substitui a anterior.** A versão anterior deste arquivo auditou o commit `bd0c671` e bloqueou a US pelo achado CONF-001 (a lista mostrava quantas linhas a ACL tinha escondido e faltava o equivalente ao Data Filter). O commit `5a0e1f7` acrescentou regras de consulta nas 9 tabelas da carteira e impediu o atendente de trocar o dono do caso. Esta auditoria refez todos os passos sobre o estado atual.

> **Contexto regulatório:** o app vai tratar dado sob sigilo fiscal (CTN art. 198) e dado pessoal (LGPD). No v0 todo dado é fictício. A carteira do atendente é o controle que impede um servidor de ver contribuintes que não atende; o plano de segurança a classifica como CRÍTICA (SEC-002).

> **Critérios do nó que pertencem a outras stories:** o nó da US traz também critérios de RF-MOD-F6-006 («Meus indicadores», «Funil do crédito»), RF-MOD-T-001 (exportação com trilha) e RF-MOD-F1-005 (visão do contribuinte). Esses RF têm story própria (`STORY-MOD-F6-006`, `STORY-MOD-T-001`, `STORY-MOD-F1-005`), com tasks em `PENDING`. Esta auditoria confere só se a carteira do atendente vale nesses caminhos, porque o SEC-002 diz que ela «vale em form, list, related list do dossiê, report (TEL-031) e exportação». O resto desses critérios fica N/A aqui.

---

## 1. Inventário do delta

O delta faz a plataforma esconder do atendente o que não é da carteira dele, em duas camadas. A primeira é uma regra de consulta (Business Rule `before query`, que roda antes de cada consulta ao banco): quando o usuário só tem o papel de atendente, a consulta ganha o filtro «dono = usuário logado». Assim a lista, o report e as contagens nem trazem as linhas de outro atendente. A segunda camada são ACL (regras de acesso da plataforma) do tipo «nega, a menos que»: se uma linha de outro atendente chegar por outro caminho, a ACL a nega. Na gravação, duas Business Rules recusam alterar caso ou interação fora da carteira e recusam trocar o dono do caso.

**Arquivos tocados pela US (10, todos em `app/`):**

| Arquivo | Papel |
|---|---|
| `app/src/fluent/security/carteira.now.ts` (novo, 192 linhas) | 17 ACL: 9 de leitura «nega, a menos que» (caso, contribuinte, interação, regularização, débito, parcelamento, comunicação, consentimento, score simulado) e 8 de gravação/criação de caso e interação, incluindo 2 de campo `*` |
| `app/src/fluent/business-rules/carteira.now.ts` (novo, 140 linhas) | 11 Business Rules: 2 de gravação (`before update` no caso; `before insert/update` na interação) e 9 de consulta (`before query`), uma por tabela da carteira |
| `app/src/server/carteira/CarteiraAtendente.server.js` (novo, 69 linhas) | Script Include (classe de servidor reutilizável) com a regra: `veTudo()` (coordenador ou admin do app), `podeVer(registro, campos)` (algum campo de dono é o usuário logado), `motivoRecusa()` e `restringirConsulta()` (acrescenta o filtro de dono à consulta) |
| `app/src/fluent/script-includes/carteira-atendente.now.ts` (novo) | Registra o Script Include `CarteiraAtendente` como `package_private` e não chamável pelo navegador |
| `app/src/server/carteira/restringirConsultaCarteira.server.js` (novo) | Corpo das 9 regras de consulta, com o mapa tabela → campo de dono |
| `app/src/server/carteira/recusarCasoForaDaCarteira.server.js` (novo) | Corpo da regra de caso: confere o dono como estava gravado e recusa troca de dono por quem não é coordenador nem admin |
| `app/src/server/carteira/recusarInteracaoForaDaCarteira.server.js` (novo) | Corpo da regra de interação: confere o dono do caso da interação |
| `app/src/fluent/tests/US-MOD-F5-007.now.ts` (novo, 284 linhas) | 3 testes ATF (Automated Test Framework, testes automáticos que rodam na instância), todos de servidor |
| `app/src/fluent/tests/suite.now.ts` | Inclui os 3 testes na suíte de regressão `cob-regressao` |
| `app/src/fluent/generated/keys.ts` | Chaves geradas pelo build (não editado à mão) |

**Endpoints alterados/criados:** nenhuma rota REST, UI Action ou tela nova. As regras novas valem em todo caminho de leitura e gravação das 9 tabelas: form, lista, related list, report, exportação de lista e Table API (as tabelas têm `allowWebServiceAccess: true`, herdado do scaffold).
**Entidades/modelos tocados:** `x_2326104_cob_caso`, `x_2326104_cob_contribuinte`, `x_2326104_cob_interacao`, `x_2326104_cob_regularizacao`, `x_2326104_cob_debito`, `x_2326104_cob_parcelamento`, `x_2326104_cob_comunicacao`, `x_2326104_cob_consentimento`, `x_2326104_cob_score_sim`. Nenhum campo novo.
**Stack envolvido no delta:** app escopado `x_2326104_cob`, Fluent `@servicenow/sdk` 4.14.3 (`Acl`, `BusinessRule`, `ScriptInclude`, `Test`); script de servidor ES5 (`Class.create`, `gs.hasRole`, `gs.getUserID`, `addQuery`/`addOrCondition` com dot-walk, isto é, filtro por campo de um registro referenciado, como `contribuinte.atendente`); ATF com `runServerSideScript` (Jasmine 3.1), `impersonate` e `createUser`.

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 3111eeb --repo app` → 10 arquivos varridos, **0 achados** (exit 0).

**Evidência de instância:**
- Recibo ATF `outputs/spec/auditorias/atf/US-MOD-F5-007.json` (não commitado): `status: success`, commit `5a0e1f7`, 3/3 testes verdes, `runner: false` (nenhum teste de form rodou).
- Linha de install no `outputs/spec/sync-log.md` (alteração não commitada): `now-sdk-install … 5a0e1f70e0c9… ok; 1056 registros`, igual ao último commit de `app/src/fluent`.
- Print `outputs/spec/screens/deliver/US-MOD-F5-007-TEL-023.png`, capturado como `demo.atendente` depois do commit: a lista «Caso de cobrança qualificadas» na view da TEL-023 mostra «1 to 20 of 26» e **não** mostra a linha de rodapé de registros removidos por segurança. O seed dá exatamente 26 casos a `demo.atendente` (25 gerados mais o registro demo da TEL-024), então o total da paginação é o da carteira dele.
- Validação G3 das tasks, que rodou em paralelo: os quatro arquivos (`TASK-MOD-F5-007-01`, `-02`, `-03` e `SEC-002.validacao.json`) foram regravados depois do commit (17:31 a 17:34), todos com veredito `APROVADO`, modo `sem-agentes` (só a parte determinística: build, ATF e varredura) e 0 bloqueantes.
- Recibo da suíte `outputs/spec/auditorias/atf/cob-regressao.json`: commit antigo (`1c417e7`) e `status: failure`; não vale para este commit.

## 2. Mapa de regressão leve

Pontos que já existiam antes desta US e que o delta encosta:

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| ACL de leitura por papel do scaffold (`app/src/fluent/security/acl-base.now.ts`) | As ACL novas negam por cima dela. Ela continua dando leitura ao atendente em todas as tabelas do app, inclusive as que guardam dado de contribuinte fora das 9 protegidas | alto |
| Lógica de servidor que consulta as 9 tabelas (`server/qualificacao/SegmentacaoScore.server.js:15-16`, contribuinte e débito) | A regra de consulta filtra **qualquer** consulta feita na sessão de um atendente, inclusive `GlideRecord` simples dentro de outra regra | médio |
| Business Rule de caso da US-MOD-F2-004 «Recusar caso para contribuinte em controle» (`business-rules/grupo-controle.now.ts:22`, `before insert`) | Roda na mesma tabela que as regras novas de caso | baixo |
| Seed de caso e contribuinte (`seed/caso.now.ts`, `seed/contribuinte.now.ts`) | A carteira usa dois campos de dono diferentes (`caso.atendente` e `contribuinte.atendente`) | médio |
| «Minha fila» (`ui/TEL-023.now.ts`) e módulo «Caso de cobrança qualificada» (`navigation/menu.now.ts:119`) | Nenhum dos dois filtra por atendente; o recorte vem da regra de consulta | médio |
| Reports «Meus indicadores» (`ui/TEL-031.now.ts:5-8`, contagem de regularização) e «Carga por atendente» (`ui/TEL-022.now.ts:5-8`, contagem de caso) | Os dois estão publicados para o papel atendente e contam linhas das tabelas filtradas | médio |
| Testes da US-MOD-F2-005 que entram como atendente (`tests/US-MOD-F2-005.now.ts`) | Leem a segmentação, que não está na carteira | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (spec, tech-rules, critérios de aceite, regra RN-NOVO-F5-007, cenários das 3 tasks e do SEC-002), segurança (leitura, contagem e gravação fora da carteira; campos graváveis; caminhos que a carteira não cobre), teste de mesa com os usuários demo, performance das ACL e das regras de consulta, bugs de script de servidor, testes ATF, observabilidade e regressão nos vizinhos acima.

**Não auditado (e por quê):**
- Rate limiting, SSRF, upload, prompt injection — N/A: o delta não cria autenticação, não recebe URL nem arquivo e não chama LLM.
- Race condition — N/A: o delta não lê e depois grava saldo ou contador.
- Injeção — N/A: o filtro de consulta usa nomes de campo fixos no código e o sys_id do usuário logado (`restringirConsultaCarteira.server.js:5-14`; `CarteiraAtendente.server.js:31-40`); nada vem do usuário.
- `allowWebServiceAccess` ligado e ACL de gravação/exclusão das demais tabelas — vêm do scaffold e são escopo do SEC-001 e do SEC-007 (`STORY-SEC-TRANSVERSAL`). Aparecem só como contexto.
- Trilha de exportação (RN-NOVO-T-001), «Funil do crédito» e related lists do contribuinte — são das stories `STORY-MOD-T-001`, `STORY-MOD-F6-006` e `STORY-MOD-F1-005`. Audito só se a carteira vale nesses caminhos.
- Comportamento de tela além do print da TEL-023 — não abri a instância. O que depende de tela e não tem print está marcado «a confirmar na instância», com o passo de verificação.

## 4. Conformidade

Verificado contra `outputs/spec/tech-rules/*.mdc` (a tabela «Carteira do atendente» de `security.mdc`), `.claude/rules/harness/{deliver,security,servicenow-ui}.md`, `plano-de-seguranca.md` (SEC-002, SEC-003), `business-rules.md` (RN-NOVO-F5-007) e o nó da story no `tasks.json`.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| AC-RF-MOD-F5-007-01 / AC-STORY…-01 — Atendente A abre «Minha fila» e a lista mostra só os casos dele | `business-rules/carteira.now.ts:34-44`; `restringirConsultaCarteira.server.js:5-18`; `CarteiraAtendente.server.js:31-40`; teste `tests/US-MOD-F5-007.now.ts:149-154, 187-199`; print da TEL-023 | ✅ PASS | Provado no servidor com consulta que respeita ACL (`GlideRecordSecure`), consulta simples e contagem, impersonando `demo.atendente2`. O print mostra 26 linhas, o total da carteira de `demo.atendente`, sem aviso de linhas removidas |
| AC-RF-MOD-F5-007-02 / AC-STORY…-02 — acesso direto ao caso do outro atendente não mostra o registro | `security/carteira.now.ts:11-20`; regra de consulta; teste `:155-161` | ✅ PASS | `get(sys_id)` do caso, contribuinte, interação, débito e parcelamento do outro devolve vazio |
| AC-RF-MOD-F5-007-03 / AC-STORY…-03 — coordenador vê todos os casos | `CarteiraAtendente.server.js:31-33, 43-46`; teste `:229-284` | ✅ PASS | Usuário criado pelo teste com o papel coordenador (o `createUser` do SDK já o impersona) lê casos e contribuintes dos dois atendentes |
| RN-NOVO-F5-007 — atendente «vê, lista, reporta e exporta» só a própria carteira | `security/carteira.now.ts:11-109`; `business-rules/carteira.now.ts:34-140` | ✅ PASS nas 9 tabelas | Report e exportação de lista passam pela mesma consulta filtrada. Tabelas vizinhas fora da carteira seguem legíveis (SEC-024) |
| RN-NOVO-F5-007 — «números de outros atendentes nunca aparecem» | regra de consulta; teste `:187-199`; print da TEL-023 | ✅ PASS | A contagem (`GlideAggregate`) do atendente devolve só a linha dele. O achado CONF-001 da auditoria anterior está resolvido |
| Cenário AS-TASK-MOD-F5-007-01-01 — «Nenhuma tela mostra total ou comparação com o outro atendente» | idem; `ui/TEL-022.now.ts:5-8` | ✅ PASS (com nota) | O report «Carga por atendente» está publicado ao atendente, mas a contagem sai filtrada pela carteira dele. Ver CONF-004 |
| Cenário AS-TASK-MOD-F5-007-02-01 — caso do outro não é mostrado, interação não é gravada, caso não é encerrado | `recusarCasoForaDaCarteira.server.js:5-12`; `recusarInteracaoForaDaCarteira.server.js:4-8`; teste `:162-186` | ✅ PASS | Recusa também por `GlideRecord` simples chamado em nome do atendente |
| Cenário AS-TASK-MOD-F5-007-03-01 — atendente não vê «Distribuição da carteira qualificada» nem «Carga por atendente» | `navigation/menu.now.ts`; `ui/TEL-022.now.ts:5-8` | ⚠️ PARCIAL | Não há módulo de menu para as duas telas; o report TEL-022 está publicado também para o papel atendente. Ver CONF-004 |
| SEC-002 — «ACL de registro com condição **e** Data Filter com Deny para a role atendente» | `security/carteira.now.ts`; `business-rules/carteira.now.ts:31-140` | ✅ PASS (com nota) | O Data Filter foi trocado por regra de consulta, que tem o mesmo efeito (o filtro entra na consulta). A troca está explicada no código, mas não no plano de segurança nem no `security.mdc`. Ver CONF-003 |
| SEC-002 — teste ATF negativo com dois atendentes demo, sem `enforceSecurity: false` (RN-SN-83) | `tests/US-MOD-F5-007.now.ts:88-227` | ✅ PASS | `demo.atendente2` impersonado contra a carteira de `demo.atendente` |
| SEC-002 doNotDo — «Não criar ACL só com script, sem role do app» | `security/carteira.now.ts:11-109, 121-130, 172-192` | ⚠️ PARCIAL | As 11 ACL «nega, a menos que» têm só script. Ver CONF-002 |
| SEC-001 — «atendente [grava] só em interação e encerramento de caso» | `security/carteira.now.ts:133-151` | ⚠️ PARCIAL | A troca de dono agora é recusada; os demais campos do caso e o `atendente` da interação seguem graváveis. Ver SEC-023 |
| `security.mdc` — script de ACL curto, sem GlideRecord/GlideAggregate em ACL de `read` (RN-SN-137, RN-SN-142) | `CarteiraAtendente.server.js:53-66` | ✅ PASS (com nota) | Sem consulta explícita; o dot-walk lê o registro referenciado por linha. Ver PERF-001 |
| `security.mdc` — campos de dono por tabela (interação por `caso.atendente`; regularização por `atendente` **ou** `caso.atendente`; filhas do contribuinte por `contribuinte.atendente`) | `security/carteira.now.ts:22-109`; `restringirConsultaCarteira.server.js:5-14` | ✅ PASS | ACL e regra de consulta usam os mesmos campos; por isso nada é removido depois da consulta |
| `security.mdc` — «demais tabelas: sem acesso» para o atendente | `security/acl-base.now.ts:95-107, 146-157, 231-242, 350-362` | ❌ FAIL (vizinho, fora do delta) | O scaffold dá leitura ao atendente em todas as tabelas. Ver SEC-024 |
| `security.mdc` — Business Rule que grava confere a regra de negócio (RN-SN-81) | `business-rules/carteira.now.ts:7-29` | ✅ PASS | |
| `architecture.mdc` — Script Include `Class.create()`, `package_private`, `clientCallable: false`, ES5 | `script-includes/carteira-atendente.now.ts:6-14`; `CarteiraAtendente.server.js` | ✅ PASS | |
| `architecture.mdc` — Business Rule sem `current.update()`; condição em `filterCondition` | `recusar*.server.js`; `restringirConsultaCarteira.server.js` | ✅ PASS (com nota) | Sem `current.update()`. A condição de papel está dentro do script (guard clause); em regra de consulta não há campo do registro para pôr em `filterCondition` |
| `conventions.mdc` — `$id` com o ID da spec; arquivos nas pastas certas | todos os `.now.ts` do delta | ✅ PASS | `RF-MOD-F5-007_acl_*`, `_br_*`, `_si_*`; `US-MOD-F5-007_test_NN` |
| `conventions.mdc` / `servicenow-ui.md` — mensagem ao usuário com texto traduzível | `CarteiraAtendente.server.js:11` | ⚠️ PARCIAL | Texto fixo em `gs.addErrorMessage`. Mesma causa do GAP-123 |
| `deliver.md` / `test-strategy.mdc` — fio condutor com ATF de form ou isenção registrada | `outputs/spec/auditorias/_isencoes/` (não existe) | ❌ FAIL | Recibo com `runner: false`. Ver TEST-001 |
| `deliver.md` — G3 com validadores de LLM no fio condutor | `*.validacao.json` (`modo: sem-agentes`) | ⚠️ PARCIAL | Mesma causa do GAP-107 |
| Log sem dado pessoal (`security.mdc`) | `recusarCasoForaDaCarteira.server.js:10`; `recusarInteracaoForaDaCarteira.server.js:6` | ✅ PASS | Registra sys_id do usuário e do caso |

**CA da US cumpridos?** Sim para os critérios da RF-MOD-F5-007: AC-RF-MOD-F5-007-01, -02 e -03 e os três AC-STORY equivalentes estão no código, com ATF verde no servidor e, no caso da lista, com o print da TEL-023. Nos critérios das outras stories, a parte da carteira vale: «Meus indicadores» conta só as regularizações do atendente (AC-STORY-MOD-F5-007-RF-MOD-F6-006-01), a exportação de lista leva só os casos dele (AC-STORY-MOD-F5-007-RF-MOD-T-001-02) e o contribuinte de outra carteira não abre (AC-STORY-MOD-F5-007-RF-MOD-F1-005-03). O restante desses critérios é N/A aqui (stories próprias pendentes).
**Tecnologia fora da spec sem aprovação?** Não. A regra de consulta é Business Rule, mecanismo previsto na `architecture.mdc`.

**[CONF-002] ACL «nega, a menos que» só com script, sem papel do app — BAIXO**
`security/carteira.now.ts:11-109, 121-130, 172-192`. O SEC-001 e o `doNotDo` do SEC-002 pedem ACL com papel do app. As 11 ACL de negação têm só `script`. Hoje isso não abre acesso, porque a ACL de leitura do scaffold exige papel do app e o script nega quem não é coordenador, admin ou dono. Pôr `roles: [role_atendente, role_coordenador, role_admin]` nelas alinha com a regra e nega quem não tem papel antes de rodar o script. GAP proposto: GAP-138.

**[CONF-003] O Data Filter do SEC-002 virou regra de consulta, e a spec não registra a troca — BAIXO**
`business-rules/carteira.now.ts:31-140`; `restringirConsultaCarteira.server.js:1-3`. O SEC-002 (plano de segurança e `tasks.json`) e o `security.mdc` falam em Data Filter com Deny. O código usa 9 Business Rules `before query`, que filtram a consulta do mesmo jeito; o comentário do código explica a troca. O plano de segurança ainda mostra o SEC-002 como `ABERTO` e o texto do controle continua pedindo Data Filter. Atualizar o texto do SEC-002 e a tabela do `security.mdc` para «Data Filter ou Business Rule `before query`», e o status do controle. GAP proposto: GAP-139.

**[CONF-004] Report «Carga por atendente» publicado ao papel atendente — BAIXO**
`app/src/fluent/ui/TEL-022.now.ts:5-8` (arquivo gerado pelo `sn-scaffold`). O cenário AS-TASK-MOD-F5-007-03-01 diz que o atendente não vê «Carga por atendente», e o SEC-003 reserva esse report ao coordenador. O report tem `roles` com o papel atendente. Não há vazamento: a contagem passa pela regra de consulta e mostra só os casos do próprio atendente. Correção pelo `data-model.json` + `sn-scaffold` (o arquivo é gerado). Soma ao GAP-106 (mesma causa: o scaffold dá acesso ao atendente) e ao controle SEC-003, já no backlog (`STORY-MOD-F6-006`, `PENDING`).

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum. O controle planejado SEC-002 (CRÍTICO) está implementado nas duas camadas pedidas (filtro na consulta e ACL de linha), tem teste negativo com dois atendentes demo e recibo ATF verde no commit auditado. A task `SEC-002` está no backlog (`tasks.json`, status `DONE` na cópia de trabalho, ainda não commitado), o que atende à regra de rastreio.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-023] Atendente grava os demais campos do próprio caso e o autor da interação — MÉDIO** (ID proposto) · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A01, API3 (mass assignment, isto é, aceitar campo que o papel não deveria alterar) · CWE-915 · STRIDE T (adulteração) · ASVS 5.0 V8
> Arquivo: `app/src/fluent/security/carteira.now.ts:133-151` · Contexto: form, lista e API de `x_2326104_cob_caso` e `x_2326104_cob_interacao`
> **Problema:** as ACL de campo `field: '*'` dão ao atendente gravação em todos os campos do caso e da interação. O commit `5a0e1f7` passou a recusar a troca do dono do caso (`recusarCasoForaDaCarteira.server.js:6`), e isso reduz o achado da auditoria anterior. Continuam graváveis pelo atendente, no próprio caso: `contribuinte`, `ciclo`, `prioridade`, `score`, `valor_em_aberto`, `sinal_coercitivo` e `sinal_coercitivo_desc`; na interação: `atendente`.
> **Risco:** o atendente muda a prioridade ou o score do próprio caso para mexer na fila; liga ou desliga a sinalização coercitiva, que a RN-NOVO-F5-004 manda mostrar somente leitura; grava interação com outro usuário no campo `atendente`, e o registro passa a dizer que outra pessoa fez o contato.
> **Fix:** trocar o curinga por ACL de campo só nos campos que o atendente altera (no caso: `estagio`, `motivo_encerramento`, `encerrado_em`, `comentarios`; na interação: `tipo`, `resultado`, `descricao`, `ocorrida_em`, `comentarios`); preencher `interacao.atendente` no servidor com o usuário logado.
> **TDD RED:** impersonado como `demo.atendente`, `GlideRecordSecure` no próprio caso com `setValue('prioridade', 1)` e `update()` grava.
> **TDD GREEN:** a mesma gravação é recusada (`canWrite()` no campo `prioridade` devolve `false`); interação nova gravada pelo atendente fica com `atendente` = ele, mesmo que o form envie outro valor.
> **GAP recomendado:** GAP-135.

> **[SEC-024] Dados de contribuintes de outras carteiras continuam legíveis pela segmentação, pelo staging e por tabelas vizinhas — MÉDIO** (controles já no backlog) · CVSS 6.5 (AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:N/A:N) · OWASP A01, API1 (IDOR, quando um usuário acessa o registro de outro) · CWE-639 · STRIDE I · ASVS 5.0 V8
> Arquivo: `app/src/fluent/security/acl-base.now.ts:95-107` (staging de débitos), `:146-157` (segmentação), `:231-242` (envio simulado), `:350-362` (trilha de exportação); `navigation/menu.now.ts:47, 65` (módulos «Staging de fontes (Simulado)» e «Carteira segmentada» publicados ao atendente) · Contexto: fora do delta, vizinho direto da carteira
> **Problema:** a ACL de leitura do scaffold dá ao atendente leitura em todas as tabelas. A carteira cobre 9 delas. Ficam abertas `x_2326104_cob_segmentacao` (contribuinte, valor, score, segmento), `x_2326104_cob_debito_stg` (documento, nome e valor de todos os contribuintes), `x_2326104_cob_envio_sim` (envios de todos) e `x_2326104_cob_exportacao` (trilha que o AC-STORY-MOD-F5-007-RF-MOD-T-001-03 reserva ao administrador).
> **Risco:** o atendente contorna a carteira e lê, pela segmentação ou pelo staging, valor, score e documento de contribuintes que não atende. Hoje o dado é fictício.
> **Fix:** tirar o papel atendente da leitura e dos módulos dessas tabelas pelo `data-model.json` + `sn-scaffold` (o arquivo é gerado), como a tabela «Carteira do atendente» do `security.mdc` manda («demais tabelas: sem acesso»); staging só para admin (SEC-013, SEC-020); trilha só para admin (SEC-011).
> **TDD RED:** impersonado como `demo.atendente`, `GlideRecordSecure('x_2326104_cob_debito_stg')` traz linha de contribuinte da carteira de `demo.atendente2`.
> **TDD GREEN:** a consulta volta vazia para o atendente; o coordenador continua lendo a segmentação.
> **GAP recomendado:** soma ao GAP-106 (mesma causa), estendendo-o a staging, envio simulado e trilha; controles SEC-001, SEC-011, SEC-013 e SEC-020 já estão no backlog (`PENDING`).

## 6. Testes de mesa (vetores no delta)

Situações rastreadas com os usuários e tabelas reais do delta:

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR — abrir caso do outro pela URL do form | `x_2326104_cob_caso.do?sys_id=<caso de demo.atendente>` como `demo.atendente2` | ✅ BLOQUEADO | Regra de consulta + ACL `carteira.now.ts:11-20`; ATF `tests/US-MOD-F5-007.now.ts:156` |
| IDOR — related list do dossiê (débito, parcelamento, interação) do caso do outro | `x_2326104_cob_debito`, `_parcelamento`, `_interacao` | ✅ BLOQUEADO | ACL `:33-42, 56-76`; ATF `:157-160` |
| IDOR — regularização, comunicação, consentimento, score do outro | `x_2326104_cob_regularizacao`, `_comunicacao`, `_consentimento`, `_score_sim` | ✅ BLOQUEADO (sem teste) | ACL `:44-53, 78-109`; regra de consulta `business-rules/carteira.now.ts:70-140`; ver TEST-001 |
| IDOR — contorno por tabela vizinha | `x_2326104_cob_segmentacao`, `_debito_stg`, `_envio_sim`, `_exportacao` | ❌ VULNERÁVEL (fora do delta) | `acl-base.now.ts:95-107, 146-157, 231-242, 350-362` — SEC-024 |
| Divulgação de totais — rodapé da lista e paginação | «Minha fila» (TEL-023) como `demo.atendente` | ✅ BLOQUEADO | Print: «1 to 20 of 26», sem linha de registros removidos; 26 = casos do seed de `demo.atendente` |
| Divulgação de totais — contagem e report | `GlideAggregate` COUNT em caso; reports TEL-031 e TEL-022 | ✅ BLOQUEADO (report a confirmar na instância) | ATF `:187-194` prova a contagem; os reports contam pela mesma consulta filtrada. Confirmação: impersonar `demo.atendente`, abrir «Meus indicadores» e conferir que o total é o das regularizações dele |
| Consulta simples (sem Secure) em nome do atendente | `GlideRecord('x_2326104_cob_debito')` com contribuinte do outro | ✅ BLOQUEADO | ATF `:195-198` |
| Auth bypass — gravar caso do outro por script em nome do atendente | `GlideRecord` simples com `update()` impersonado | ✅ BLOQUEADO | `recusarCasoForaDaCarteira.server.js:5, 9-12`; ATF `:175-186` |
| Auth bypass — registrar interação no caso do outro (tela e script) | `x_2326104_cob_interacao` insert com `caso` do outro | ✅ BLOQUEADO | ACL `:172-181` + `recusarInteracaoForaDaCarteira.server.js:4-8`; ATF `:162-174` |
| Auth bypass — mover interação própria para o caso do outro | `interacao.caso` alterado no update | ✅ BLOQUEADO | A regra confere o registro novo (`recusarInteracaoForaDaCarteira.server.js:4`) |
| Privilege escalation — atendente passa o próprio caso a outro atendente | `caso.atendente` alterado pelo dono | ✅ BLOQUEADO | `recusarCasoForaDaCarteira.server.js:6`; ATF `:200-215` |
| Privilege escalation — atendente se põe como dono de caso alheio | gravar `atendente` num caso que não lê | ✅ BLOQUEADO | Leitura negada; a regra confere o dono gravado (`recusarCasoForaDaCarteira.server.js:5`) |
| Privilege escalation — coordenador registra interação | `GlideRecordSecure.canCreate()` | ✅ BLOQUEADO | ACL `:154-161`; ATF `:277-279` |
| Mass assignment — atendente muda prioridade, score ou sinalização do próprio caso; grava outro autor na interação | ACL de campo `*` | ❌ VULNERÁVEL | `carteira.now.ts:133-151` — SEC-023 |
| Injeção | filtro de consulta com campos fixos e `gs.getUserID()` | N/A | `CarteiraAtendente.server.js:31-40` |
| Secret exposure | nenhuma credencial, URL de instância ou sys_id no delta | N/A | varredura 0 achados |
| Rate limiting | sem rota de autenticação nova | N/A | — |
| Race condition | sem contador nem saldo | N/A | — |
| Usuário com atendente **e** coordenador | `gs.hasRole` de coordenador | ✅ vê tudo, como a RN («só o papel de atendente») | `CarteiraAtendente.server.js:31-33, 43-46` |

## 7. Findings de Performance

**[PERF-001] A ACL de leitura lê o registro referenciado a cada linha — BAIXO**
`CarteiraAtendente.server.js:53-66`, chamado por `security/carteira.now.ts:40, 51, 63, 74, 85, 96, 107`. Em débito, parcelamento, comunicação, consentimento, score, interação e regularização, o dono vem de outro registro (`contribuinte.atendente`, `caso.atendente`). Cada linha da lista avalia o script, cria um `CarteiraAtendente`, chama `gs.hasRole` duas vezes e busca o registro referenciado. Uma página de 20 linhas faz até 20 leituras extras. Com a regra de consulta, a ACL virou segunda barreira: as linhas que chegam já são do atendente, então o custo é só de leitura, sem efeito no resultado. A RN-SN-142 pede script de ACL de leitura curto por esse motivo. Opção: trocar o script por condição (`contribuinte.atendente` = `javascript:gs.getUserID()`) com os papéis coordenador e admin numa ACL «permite» separada. GAP proposto: GAP-140.

A regra de consulta não acrescenta custo relevante: duas chamadas a `gs.hasRole` por consulta e um filtro por campo de referência (a plataforma indexa coluna de referência).

## 8. Findings de Bugs Técnicos

**[BUG-001] Dois donos que divergem: o atendente do caso nem sempre é o do contribuinte — MÉDIO**
JavaScript de servidor · `security/carteira.now.ts:22-31` e `restringirConsultaCarteira.server.js:7, 10-14` (contribuinte e filhas por `contribuinte.atendente`) × `security/carteira.now.ts:11-20, 33-42` e `restringirConsultaCarteira.server.js:6, 8` (caso e interação por `caso.atendente`) · seed `seed/caso.now.ts` × `seed/contribuinte.now.ts`.
- **Cenário:** no seed instalado, 22 dos 51 casos têm `caso.atendente` diferente de `contribuinte.atendente` (contagem feita sobre os dois arquivos de seed). No print da TEL-023, 8 das 20 linhas são casos de `demo.atendente` cujo contribuinte é da carteira de `demo.atendente2`.
- **Consequência:** o atendente abre o próprio caso no dossiê (TEL-024) e, ao clicar no contribuinte, não consegue abrir; débitos, parcelamentos, comunicações e consentimentos aparecem vazios, porque pertencem à carteira do colega. Ao mesmo tempo, o colega vê o contribuinte e os débitos de um caso que não é dele. Nada no app mantém os dois campos iguais.
- **Fix:** definir um dono único. Opção 1: o caso herda `atendente` do contribuinte (Business Rule `before insert/update` no caso, ou na distribuição da `STORY-MOD-F5-001`) e o seed gera os dois iguais. Opção 2: a carteira do contribuinte e das tabelas filhas vale também por «existe caso do usuário para este contribuinte», o que exige consulta na ACL e vai contra a RN-SN-142. A opção 1 cabe na spec atual.
- **GAP recomendado:** GAP-136 (decisão de negócio: quem é o dono da carteira quando caso e contribuinte divergem).

**[BUG-002] Criar interação a partir de form em branco pode ser negado ao atendente — BAIXO (a confirmar na instância)**
`security/carteira.now.ts:172-181`. A ACL de criação confere `caso.atendente` no registro novo. Ao abrir «Nova interação» pelo módulo «Interação» (`navigation/menu.now.ts:125`), o caso está vazio e a ACL nega. Se a plataforma avaliar a mesma ACL ao montar o botão «Novo» da related list do caso, o atendente fica sem caminho de tela para registrar interação; nesse caso o achado sobe para ALTO. Confirmação: impersonar `demo.atendente`, abrir um caso próprio e conferir se o botão «Novo» aparece na related list de interações e se a gravação funciona. Fix: deixar a ACL de criação passar com caso vazio e manter a conferência na Business Rule (`recusarInteracaoForaDaCarteira.server.js:4`), que roda na gravação. GAP proposto: GAP-141.

**[BUG-003] A regra de consulta filtra qualquer lógica de servidor que rode na sessão do atendente — BAIXO**
`restringirConsultaCarteira.server.js:15-18`; `CarteiraAtendente.server.js:31-40`. A regra roda em toda consulta às 9 tabelas, inclusive `GlideRecord` simples dentro de outra Business Rule, Script Include ou UI Action disparada pelo atendente. Hoje nenhuma lógica desse tipo roda como atendente nessas tabelas (o sorteio e a segmentação, em `SegmentacaoScore.server.js:15-16`, são acionados pelo coordenador). Uma regra futura que conte duplicados, some valores ou confira existência em nome do atendente vai enxergar só a carteira dele e decidir errado, sem erro visível. Fix: documentar no `architecture.mdc` que lógica de sistema chamada pelo atendente nessas tabelas precisa de `setWorkflow(false)` justificado ou de rodar como processo de sistema; incluir um teste quando a primeira regra dessas aparecer. GAP proposto: GAP-143.

## 9. Testes

**CA viraram teste?** AC-01, AC-02 e AC-03 sim, no servidor, com `demo.atendente`, `demo.atendente2` e um coordenador criado pelo teste. A parte «nenhuma tela mostra total» tem teste de contagem (`GlideAggregate`) e o print da TEL-023.
**TDD RED/GREEN presente?** O lado negativo existe e passa; não há saída RED guardada (teste rodando antes do controle). Mesma causa do GAP-116.
**Cobertura do delta:** boa no núcleo (caso, contribuinte, interação, débito, parcelamento; leitura, consulta simples, contagem, gravação por tela e por script, troca de dono). Lacunas abaixo.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `tests/US-MOD-F5-007.now.ts:8-86` — atendente lê e grava a própria carteira | Sim: lê caso, contribuinte, interação, débito; `canWrite()` no caso; insere interação | — | `canWrite()` não prova gravação de fato; nenhum `update()` real no caso próprio |
| `tests/US-MOD-F5-007.now.ts:88-227` — atendente não vê nem grava a do outro | Sim: continua vendo o próprio caso | Sim: lista, `get` em 5 tabelas, consulta simples, contagem, interação por tela e por script, encerrar por script, troca de dono | Bom; não cobre regularização, comunicação, consentimento e score |
| `tests/US-MOD-F5-007.now.ts:229-284` — coordenador vê tudo | Sim | Sim: coordenador não cria interação | Não cobre o administrador do app (exceção da RN) |

**[TEST-001] Lacunas de teste do controle crítico — MÉDIO**
`tests/US-MOD-F5-007.now.ts`. (1) Nenhum teste de form nem isenção `atf-form` em `outputs/spec/auditorias/_isencoes/` (o recibo tem `runner: false`), embora a US seja de fio condutor e a regra seja visível na tela; o print da TEL-023 mostra a tela, mas não prova a regra. (2) 4 das 9 tabelas sem teste (regularização, comunicação, consentimento, score). (3) Sem teste do administrador do app. (4) Sem teste do report «Meus indicadores» como atendente. (5) Sem teste de campo não gravável (SEC-023). GAP proposto: GAP-137; a saída RED guardada soma ao GAP-116.

**[TEST-002] Suíte `cob-regressao` sem recibo verde no commit da US — MÉDIO**
`outputs/spec/auditorias/atf/cob-regressao.json`: commit `1c417e7`, `status: failure`. Os 3 testes novos entraram na suíte (`suite.now.ts:15, 28`), mas não há execução da suíte inteira em `5a0e1f7`. Como a regra de consulta muda o que qualquer consulta do atendente devolve, a suíte inteira é o que mostra se testes de outras US que entram como atendente continuam verdes. Soma ao GAP-122.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Recusa de alteração de caso (fora da carteira ou troca de dono) | Sim, `gs.warn` com origem, sys_id do usuário e do caso, sem dado de contribuinte (`recusarCasoForaDaCarteira.server.js:10`) | `sys_audit` do caso | — |
| Recusa de interação fora da carteira | Sim, `gs.warn` com origem, usuário e caso (`recusarInteracaoForaDaCarteira.server.js:6`) | — | — |
| Filtro de consulta aplicado | Não (e não deve: roda em toda consulta) | Não | — |
| Abertura de registro de outra carteira negada | Não | Não | OBS-001 |

**[OBS-001] Tentativa de abrir registro de outra carteira não deixa rastro nem contagem — BAIXO**
`CarteiraAtendente.server.js:31-40, 53-66`. O SEC-002 pede «gs.warn em acesso negado: SEC-002, usuário, tabela, operação» e a métrica «contagem de acessos negados por dia». Com a regra de consulta, a abertura por URL direta de um caso alheio só volta vazia, sem log. Logar dentro da regra de consulta geraria uma linha por consulta; o ponto útil é a abertura de registro único (form com `sys_id`) que volta vazia. Opções: log nesse caso específico, ou contagem pelos eventos de segurança da plataforma. GAP proposto: GAP-142.

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| ACL de leitura por papel do scaffold (`acl-base.now.ts`) | Não quebrou; a negação nova se soma a ela. Continua abrindo tabelas vizinhas ao atendente (SEC-024) | ATF positivo verde |
| Lógica de servidor que consulta as 9 tabelas | Não hoje: nenhuma roda na sessão do atendente. Risco para código futuro (BUG-003) | `SegmentacaoScore.server.js:15-16`; busca por `GlideRecord` nessas tabelas em `app/src/server/` |
| BR «Recusar caso para contribuinte em controle» (US-MOD-F2-004, `grupo-controle.now.ts:22`) | Não. Ela é `before insert`; a regra nova de caso é `before update`; o atendente não tem ACL de criação de caso | `business-rules/carteira.now.ts:19-29` |
| Seed de caso e contribuinte | Sim: 22 de 51 casos com donos divergentes deixam o dossiê incompleto para o atendente | BUG-001 |
| «Minha fila» e módulo de caso sem filtro | Não: a regra de consulta recorta a lista sem aviso de linhas removidas | Print da TEL-023 |
| Reports «Meus indicadores» e «Carga por atendente» | Não há comparação: contam pela consulta filtrada. «Carga por atendente» segue publicado ao atendente | CONF-004 |
| Testes da US-MOD-F2-005 com atendente | Não: a segmentação não está na carteira; sem recibo da suíte para confirmar | TEST-002 |
| Instalação | Não. Install `ok; 1056 registros` em `5a0e1f7` | `outputs/spec/sync-log.md` |

Fora do delta, no print da TEL-023: a lista não sai ordenada por prioridade, como pede o `uiContext` da story (`defaultSort: prioridade`). O `List()` gerado em `ui/TEL-023.now.ts:11-15` não declara ordenação. Não é efeito desta US.

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

O atendente não abre, não lista, não conta e não grava registro de outro atendente nas 9 tabelas da carteira, por tela ou por script, e o coordenador vê tudo. O bloqueio da auditoria anterior (CONF-001) caiu: a consulta já sai filtrada, a lista da TEL-023 mostra só o total da carteira do atendente e a contagem tem teste. Ficam achados MÉDIO e BAIXO, nenhum bloqueante.

| Condição de bloqueio | Status |
|---|---|
| Sem SEC CRÍTICO/ALTO aberto | ✅ SEC-002 implementado (filtro na consulta + ACL de linha), com teste negativo e recibo ATF verde em `5a0e1f7` |
| Sem BUG ALTO bloqueante | ✅ (BUG-002 sobe para ALTO só se a verificação na instância mostrar que o atendente não registra interação pela tela) |
| Todos os CA da US cumpridos | ✅ AC-RF-MOD-F5-007-01..03 e AC-STORY equivalentes |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ A task `SEC-002` está no backlog |

**Pendências para fechar a US no fluxo do harness** (não feitas por esta auditoria, por instrução de quem a pediu): registrar os GAPs propostos abaixo em `outputs/spec/gaps-document.md`; commitar o recibo ATF, a linha de install do `sync-log.md` e o status das tasks; apagar `outputs/spec/em-andamento.md` e commitar a remoção (o `delivery-gate` nega o push enquanto o marcador estiver na árvore).

## 13. Pontos a revisar / próximos passos

Os GAPs abaixo são propostas, a partir de GAP-135; nenhum foi gravado em `gaps-document.md` nesta auditoria.

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|---|---|---|---|
| 1 | SEC-023 (MÉDIO, proposto) — atendente grava prioridade, score, sinalização e outros campos do próprio caso, e o autor da interação | `security/carteira.now.ts:133-151` | ACL de campo só nos campos de encerramento e de interação; `interacao.atendente` preenchido no servidor | `gaps-document.md` (GAP-135) |
| 2 | SEC-024 (MÉDIO) — segmentação, staging, envio simulado e trilha legíveis pelo atendente | `security/acl-base.now.ts:95-107, 146-157, 231-242, 350-362`; `navigation/menu.now.ts:47, 65` | Tirar o atendente da leitura e dos módulos dessas tabelas via `data-model.json` + `sn-scaffold` | soma ao GAP-106; controles SEC-001, SEC-011, SEC-013, SEC-020 |
| 3 | BUG-001 (MÉDIO) — dono do caso diverge do dono do contribuinte | `security/carteira.now.ts:11-42`; `restringirConsultaCarteira.server.js:6-14`; `seed/caso.now.ts`; `seed/contribuinte.now.ts` | Dono único: caso herda o atendente do contribuinte; seed coerente | `gaps-document.md` (GAP-136) |
| 4 | TEST-001 (MÉDIO) — lacunas de teste do controle | `tests/US-MOD-F5-007.now.ts` | ATF de form da TEL-023/TEL-024 (ou isenção `atf-form`); testes de regularização, comunicação, consentimento, score, admin do app, «Meus indicadores» e campo não gravável | `gaps-document.md` (GAP-137); saída RED soma ao GAP-116 |
| 5 | TEST-002 (MÉDIO) — suíte sem recibo verde no commit | `outputs/spec/auditorias/atf/cob-regressao.json` | Rodar `npm run reinstall` completo (que roda a suíte) e guardar o recibo | soma ao GAP-122 |
| 6 | CONF-002 (BAIXO) — ACL de negação só com script | `security/carteira.now.ts:11-109, 121-130, 172-192` | Acrescentar `roles` do app nas 11 ACL «nega, a menos que» | `gaps-document.md` (GAP-138) |
| 7 | CONF-003 (BAIXO) — troca do Data Filter por regra de consulta não está na spec | `business-rules/carteira.now.ts:31-140`; `outputs/spec/plano-de-seguranca.md` (SEC-002); `outputs/spec/tech-rules/security.mdc` | Atualizar o texto e o status do SEC-002 e a tabela da carteira no `security.mdc` | `gaps-document.md` (GAP-139) |
| 8 | CONF-004 (BAIXO) — report «Carga por atendente» publicado ao atendente | `ui/TEL-022.now.ts:5-8` | Tirar o papel atendente do report via `data-model.json` + `sn-scaffold` | soma ao GAP-106; controle SEC-003 |
| 9 | PERF-001 (BAIXO) — leitura do registro referenciado a cada linha na ACL | `CarteiraAtendente.server.js:53-66` | Condição de ACL no lugar do script, com ACL «permite» para coordenador e admin | `gaps-document.md` (GAP-140) |
| 10 | BUG-002 (BAIXO, a confirmar) — «Nova interação» em branco negada ao atendente | `security/carteira.now.ts:172-181` | Conferir o botão «Novo» na related list; deixar a ACL de criação passar com caso vazio | `gaps-document.md` (GAP-141) |
| 11 | OBS-001 (BAIXO) — abertura de registro de outra carteira sem log nem contagem | `CarteiraAtendente.server.js:31-40, 53-66` | Log na abertura de registro único que volta vazia, ou contagem pelos eventos de segurança | `gaps-document.md` (GAP-142) |
| 12 | BUG-003 (BAIXO) — regra de consulta filtra lógica de servidor na sessão do atendente | `restringirConsultaCarteira.server.js:15-18` | Registrar a regra no `architecture.mdc` e testar a primeira lógica de sistema que rodar como atendente | `gaps-document.md` (GAP-143) |
| 13 | Mensagem em texto fixo | `CarteiraAtendente.server.js:11` | Mensagem traduzível (`gs.getMessage`) | soma ao GAP-123 |
| 14 | G3 sem validadores de LLM | `TASK-MOD-F5-007-0*.validacao.json`, `SEC-002.validacao.json` | Rodar o G3 com os agentes ou registrar isenção | soma ao GAP-107 |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@5a0e1f7
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
