# spec_story — app Cobrança MT (`x_2326104_cob`)

> Memória de implementação do app. Lida pelo sn-implement antes de cada task.
> Atualizada ao final de cada story do Deliver.

---

## Padrões estabelecidos

- Regra de negócio fica num Script Include (`app/src/server/<area>/<Classe>.server.js`, `Class.create`, ES5);
  a business rule e a UI Action só chamam o Script Include. Motivo: o ATF testa o Script Include pelo
  servidor (`runServerSideScript`), sem depender de form (TESTABILITY_REFACTOR, US-MOD-F2-002).
- Mensagem de erro de regra é constante do Script Include (`CriterioVersao.MSG_*`, `QualificacaoCiclo.MSG_*`),
  usada pela business rule (`gs.addErrorMessage` + `setAbortAction`) e conferida literal no ATF.
- Papel conferido no servidor por `gs.hasRole(gs.getCurrentScopeName() + '.<papel>')` — escopo nunca digitado.
- UI Action de mudança de estado: `roles` + `condition` + reconferência do papel no Script Include.
- ACL de gravação por estado (`condition: 'estado=rascunho^ORestadoISEMPTY^EQ'`) em tabela e em `field: '*'`:
  sem a ACL de campo, o curinga `*.*` da plataforma deixa o form somente leitura.
- Carteira do atendente: ACL `decisionType: 'deny'` (deny-unless) com script de uma linha chamando
  `CarteiraAtendente.podeVer(current, '<campo dono>')`; a ACL de leitura por papel do scaffold continua.
- IDs de story nos arquivos de teste, recibo e auditoria: `US-MOD-<F>-<nnn>` (a story do tasks.json é
  `STORY-MOD-<F>-<nnn>`; o `promocao.mjs --rastreio` aceita os dois).

---

## Estratégia de testes do módulo

| Camada | Ferramenta | Localização | Comando |
|--------|-----------|-------------|---------|
| Build | now-sdk build | app/ | `cd app && npx now-sdk build` |
| ATF servidor | `Test()` + `atf.server.runServerSideScript` (Jasmine 3.1) | `app/src/fluent/tests/<US>.now.ts` | `npm run atf -- --story <US>` |
| ATF form | `Test()` + `atf.form.*` (Client Test Runner via Playwright) | o mesmo arquivo | idem (o atf.mjs abre o runner) |
| Regressão | TestSuite `cob-regressao` | `app/src/fluent/tests/suite.now.ts` | `npm run reinstall` |

- **Massa:** cada teste cria a própria massa fictícia num passo `runServerSideScript` inicial (como o
  usuário do ATF, antes de impersonar); registro em estado protegido nasce com `setWorkflow(false)`.
  O rollback do ATF desfaz tudo.
- **Usuário:** `atf.server.createUser` com o `Role()` do app; carteira usa `demo.atendente`/`demo.atendente2`
  impersonados (`recordQuery` em `sys_user` → `impersonate`).
- **Pegadinhas:**
  - `outputs.record_id` de `runServerSideScript` NÃO chega a passo de form: o form fica esperando até o
    timeout de 600 s e o runner sai do ar. Para abrir no form, pegar o id por `recordQuery` (`first_record`)
    ou criar por `recordInsert`.
  - Teste de form que estoura o tempo derruba o runner agendado; os testes seguintes ficam `waiting`.
    A massa dele só é desfeita quando o timeout de 600 s do teste vence (até lá a contagem do reinstall diverge).
  - `fieldStateValidation` com `readOnly` em campo somente leitura **por ACL** fica esperando até o timeout;
    somente leitura por ACL se prova no servidor (`canWrite()`); `readOnly` por UI Policy funciona no form.
  - Um `openExistingRecord` por teste: abrir dois forms no mesmo teste também ficou esperando.
  - `GlideRecordSecure` ignora em silêncio campo sem ACL de escrita (o valor não é gravado).
  - Cada `Test()` leva ~1 min no `cicd test run`; a suíte inteira cresce com as stories — rodar o
    `npm run reinstall` sem `timeout` curto.

---

## Histórico de tasks

### US-MOD-F2-005 — score como critério com fallback «sem score» (TASK-MOD-F2-005-01..02)
**Data:** 2026-11-24 | **State:** DONE (G3 APROVADO sem agentes nas 2 tasks)

**Implementado:**
- `src/server/qualificacao/SegmentacaoScore.server.js` + `script-includes/segmentacao-fallback-sem-score.now.ts`
- `business-rules/segmentacao.now.ts` — classificar linha sem segmento (before insert); marcar contribuinte e total do ciclo (after)

**Testes:**
- Cenários: 7 | Verdes: 7 (4 testes ATF de servidor) | Vermelhos: 0 | Não cobertos: 0
- Por categoria: HAPPY_PATH 3/3 · BUSINESS_RULE_VIOLATION 2/2 · AUTHORIZATION 1/1 · EDGE_CASE 1/1 · INVALID_INPUT n/a · EXTERNAL_SERVICE_FAILURE n/a (falha do SIM-01 fica na STORY-MOD-F3-001)
- Arquivo: `src/fluent/tests/US-MOD-F2-005.now.ts`

**Decisões:**
- Score válido = número de 0 a 100 em `contribuinte.score`; a leitura do SIM-01 (`ScoreUfmt`) fica para a STORY-MOD-F3-001 (GAP-124).
- `DEPENDENCY_PENDING`: STORY-MOD-F2-003 (gerar prévia) e STORY-MOD-F3-001 abertas; a regra roda na inclusão da linha da carteira segmentada, venha de onde vier.

### US-MOD-F2-004 — sorteio do grupo de controle por ciclo (TASK-MOD-F2-004-01..02, SEC-010)
**Data:** 2026-11-24 | **State:** DONE (G3 APROVADO sem agentes nas 3 tasks)

**Implementado:**
- `src/server/qualificacao/QualificacaoCiclo.server.js` + `script-includes/segmentacao-sortear-grupo-controle.now.ts` — sorteio (Fisher-Yates + Park-Miller pela semente), tamanho = teto(n × %), publicação
- `business-rules/grupo-controle.now.ts` — sortear ao publicar por qualquer caminho; recusar comunicação e caso de contribuinte em controle; controle imutável após publicar
- `ui-actions/ciclo.now.ts` — «Publicar ciclo»; `security/ciclo.now.ts` — ACL de gravação do ciclo em prévia

**Testes:**
- Cenários: 10 | Verdes: 9 testes ATF (10 cenários) | Vermelhos: 0 | Não cobertos: 3 critérios do RF-MOD-F6-004 no nó (efeito incremental) — são da STORY-MOD-F6-004
- Por categoria: HAPPY_PATH 2/2 · BUSINESS_RULE_VIOLATION 4/4 · AUTHORIZATION 2/2 · EDGE_CASE 2/2 · INVALID_INPUT n/a · EXTERNAL_SERVICE_FAILURE n/a
- Arquivo: `src/fluent/tests/US-MOD-F2-004.now.ts`

**Decisões:**
- O sorteio roda na business rule do ciclo (antes de gravar «publicado»), não só no botão; a semente é sempre gerada pelo servidor.
- Script Include `QualificacaoCiclo` (nome da arquitetura) só com a publicação e o sorteio; o fallback de score fica num Script Include próprio (task do RF-MOD-F2-005).

### US-MOD-F2-002 — versão do critério imutável (TASK-MOD-F2-002-01..03, SEC-009)
**Data:** 2026-11-24 | **State:** DONE (G3 APROVADO sem agentes nas 4 tasks)

**Implementado:**
- `src/server/qualificacao/CriterioVersao.server.js` + `script-includes/criterio-versao.now.ts` — regras da versão
- `business-rules/criterio.now.ts` — bloquear edição/exclusão de publicada; conferir gravação (nome, rascunho, unicidade, publicação só pelo coordenador com data/autor); substituir anteriores
- `business-rules/ciclo.now.ts` — ciclo publicado guarda critério, totais e estado
- `ui-actions/criterio.now.ts` — «Publicar versão», «Criar nova versão»; `ui-policies/criterio.now.ts` — threshold sem score
- `security/criterio.now.ts` — ACL de gravação por estado

**Testes:**
- Cenários: 13 | Verdes: 13 | Vermelhos: 0 | Não cobertos: 1 (estados carga/vazio da Core UI — a plataforma entrega)
- Por categoria: HAPPY_PATH 4/4 · INVALID_INPUT 2/2 · BUSINESS_RULE_VIOLATION 4/4 · AUTHORIZATION 3/3 · EDGE_CASE 2/2 · EXTERNAL_SERVICE_FAILURE n/a
- Camadas: ATF servidor(9) · ATF form(4)
- Arquivo: `src/fluent/tests/US-MOD-F2-002.now.ts`
- Fonte dos cenários: mista

**Decisões:**
- Regras da publicação na business rule de gravação, não só no botão: publicar trocando o «Estado» à mão segue as mesmas regras (achado da auditoria).
- Data Policy do SEC-009 não criada: a business rule vale para importação e API.
- `DEPENDENCY_PENDING`: STORY-MOD-F2-001 e STORY-SEC-TRANSVERSAL abertas; o pedido foi entregar o fio condutor primeiro. Os critérios de aceite do RF-MOD-F2-001 presentes neste nó (nome obrigatório, threshold) foram entregues aqui.
