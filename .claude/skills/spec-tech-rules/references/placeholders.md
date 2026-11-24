# spec-tech-rules — placeholders de cada template (PASSO 4)

> Lido no PASSO 4, ao preencher cada template `.mdc`. Alvo ServiceNow: os cinco templates gerados
> são `conventions`, `architecture`, `security`, `test-strategy` e `deploy-and-build`. Os
> placeholders comuns a todos os arquivos estão no `SKILL.md`, PASSO 4.
>
> **Fonte dos valores fixos do app:** `{{SCOPE}}` = `scope` de `app/now.config.json`; `{{APP_NAME}}` =
> `name` de `app/now.config.json`; `{{SDK_VERSION}}` e `{{GLIDE_VERSION}}` = versões fixas em
> `app/package.json` (`@servicenow/sdk`, `@servicenow/glide`). Nunca perguntar o que o arquivo já diz.

### `conventions.mdc` ← `./templates/conventions.mdc`

| Placeholder | Valor |
|-------------|-------|
| `{{IDENTIFIER_LANGUAGE}}` | Decisão 1.2: `português` (padrão) ou `inglês` |
| `{{UI_LANGUAGE}}` | `Português do Brasil` ou conforme decisão 1.2 |
| `{{COLUMN_EXAMPLES}}` | 2 colunas reais do `data-model.previa.json`/`data-model.json`, em crase |
| `{{TABLE_EXAMPLE}}` | Uma tabela real do app: `` `<escopo>_<sufixo>` `` |
| `{{SIM_TABLE_EXAMPLE}}` | Tabela `SIM-` real (`inputs/simulacoes.md`) ou `— (sem integração simulada)` |
| `{{COLUMN_EXAMPLE}}` | Uma coluna real |
| `{{ROLE_EXAMPLES}}` | Roles reais (decisão 7.1), em crase: `` `<escopo>.atendente` `` |
| `{{NOWID_EXAMPLE}}` | `$id` real a partir de um RF do fio condutor: `` `Now.ID['RF-MOD-F2-002_br_<nome>']` `` |
| `{{SCRIPT_INCLUDE_EXAMPLE}}` | Nome de Script Include previsto na `architecture.mdc` |
| `{{BR_NAME_EXAMPLE}}` | Nome de Business Rule de uma RN real: verbo + objeto |
| `{{TEST_NAME_EXAMPLE}}` | `RF-… — <comportamento>` de um CT real |
| `{{CHOICE_EXAMPLE}}` | Um valor de choice real → label com acento |
| `{{CONSTANT_EXAMPLE}}` | Uma constante real (prazo, limite) das RN |
| `{{ERROR_MESSAGE_EXAMPLE}}` | Mensagem real de uma RN do fio condutor: o que aconteceu + o que fazer |
| `{{A11Y_LEVEL}}` | `WCAG 2.2 AA` — lido da rule de UI do harness (9.2 é informação, não pergunta); com a exceção do cliente, se houver |
| `{{ANTIPATTERNS_LIST}}` | 4–5 anti-patterns de nomenclatura e script vistos no tema (lista `- `) |

---

### `architecture.mdc` ← `./templates/architecture.mdc`

| Placeholder | Valor |
|-------------|-------|
| `{{INSTANCE_ALIAS}}` | Alias do `now-sdk auth` / `SN_ALIAS` do `.env.example` (decisão 8.1) |
| `{{INSTANCE_RELEASE}}` | Release da instância (decisão 8.1), ex.: `Brazil` |
| `{{CROSS_SCOPE_STANCE}}` | Decisão 2.3: ex. «o app referencia `sys_user` e não altera tabela de outro escopo» |
| `{{MODULES_TREE}}` | Linhas da árvore `├── tables/ MOD-… <tabelas>`, uma por módulo de `modules.md` (o `check-rules.mjs` confere os `MOD-` contra o `data-model.json`) |
| `{{REGRESSION_SUITE}}` | Nome da `TestSuite()` de regressão (decisão 5.3), ex.: `<sigla>-regressao` |
| `{{SERVER_AREAS}}` | Pastas de `app/src/server/` por área de negócio |
| `{{EXAMPLE_DICTIONARY}}` … `{{EXAMPLE_SCRIPT_INCLUDE}}` | Um exemplo real do projeto por degrau (decisão 2.2); `—` quando o degrau não é usado |
| `{{LOGIC_PLACEMENT_TABLE}}` | Linhas `\| regra \| mecanismo \| peças \|` para cada RN que não é só dicionário, fio condutor primeiro |
| `{{SIMULATIONS_LIST}}` | Uma linha por `SIM-` de `inputs/simulacoes.md` (tabela, Script Include leitor, interruptor de falha); «Sem integração simulada.» quando não houver |
| `{{PERFORMANCE_NOTES}}` | Regras de volume do projeto (decisão 3.3): report × valor gravado, lotes; vazio permitido |
| `{{ANTIPATTERNS_LIST}}` | 4–5 anti-patterns de lugar errado de lógica |

---

### `test-strategy.mdc` ← `./templates/test-strategy.mdc`

| Placeholder | Valor |
|-------------|-------|
| `{{REGRESSION_SUITE}}` | Igual ao da `architecture.mdc` |
| `{{ATF_FORM_RUNNER}}` | Decisão 5.2: ex. «pelo Client Test Runner aberto num navegador Playwright» (desfecho do teste de viabilidade no `ORIGEM.md`) |
| `{{MANDATORY_CASES_TABLE}}` | Linhas `\| RN \| positivo \| negativo \|`, uma por RN do fio condutor, cada lado em frase «quando X, o sistema Y» |

---

### `deploy-and-build.mdc` ← `./templates/deploy-and-build.mdc`

| Placeholder | Valor |
|-------------|-------|
| `{{INSTANCE_ALIAS}}`, `{{INSTANCE_RELEASE}}` | Iguais aos da `architecture.mdc` |
| `{{NODE_RANGE}}` | `engines.node` do `package.json` da raiz, em crase |
| `{{ENVIRONMENTS}}` | Decisão 8.2: ex. «um só (dev)» ou «dev → test → prod» |
| `{{BRANCHING}}` | Decisão 8.3: ex. «Um branch por user story no Deliver» |
| `{{REGRESSION_SUITE}}` | Igual ao da `architecture.mdc` |
| `{{SEED_MAX_ROWS}}` | Decisão 3.4: teto de registros demo por tabela (≤ 1.000; padrão 300) |

---

### `security.mdc` ← `./templates/security.mdc`

Sem placeholder. A parte fixa é copiada integralmente. O bloco entre `<!-- projeto:inicio -->` e
`<!-- projeto:fim -->` é reescrito com as decisões do BLOCO 7: tabela de roles (role, quem, contém),
matriz de ACL de linha por tabela e papel, lista de `CrossScopePrivilege` permitidos e exceções de
`delete`. Os dois marcadores ficam no arquivo — o `SECURITY_UNMODIFIED` compara o resto.

---

### Templates do upstream fora do alvo

`auth.mdc`, `database.mdc`, `observability.mdc`, `messaging-and-queue.mdc`, `integrations.mdc`,
`frontend.mdc` e `frontend-default.mdc` continuam na pasta para o merge com o harness Elo, assim como
os originais do upstream de `architecture`, `conventions`, `deploy-and-build`, `test-strategy` e
`security`, o kickoff e esta tabela de placeholders, guardados em `templates/upstream/`. Nenhum deles
**é gerado** no alvo ServiceNow: autenticação é da instância e o controle de acesso está na
`security.mdc`; persistência são tabelas da plataforma (`conventions.mdc` + `data-model.json`); log é
`gs.*` (`conventions.mdc`); integração é `SIM-` (`architecture.mdc`); tela é a Core UI clássica da
`.claude/rules/harness/servicenow-ui.md`.
