# Origem do fork

* **Base:** Harness Elo v2, `harness.json.versao` = 2.6.0, zip `harness-elo-v2-claude-2.6.0 11 (1).zip`
* **Commit base:** `2f967bb` (tag `base-harness-2.6.0`), sem `harness-zona.lock.json`
* **Data:** 2026-11-24
* **Design:** [docs/designs/speckit-servicenow-v0.md](docs/designs/speckit-servicenow-v0.md) (v0.2)
* **Comparar com uma versão nova do harness:** `git diff --stat base-harness-2.6.0..HEAD`

## Modo do repositório

Clone desde 2026-11-24, depois do Deliver do fio condutor: o manifesto `harness-zona.lock.json` foi gerado uma vez (item 35, `montarManifesto` sobre os arquivos versionados, 406 arquivos na zona) e o marcador `.harness-template` saiu. `node .claude/ferramentas/verificar-zona.mjs` confere a zona. Para alterar o kit de novo, recriar `.harness-template` no terminal, alterar, regerar o manifesto e remover o marcador.

## Remoções

| Arquivo | Motivo |
|---|---|
| `harness-zona.lock.json` | o modo template permite alterar o kit até o endurecimento (A1) |
| `.claude/skills/spec-prototype/` | a instância é o protótipo (A2): as telas saem do `sn-scaffold` e os prints do `sn-capture` |
| `.claude/skills/spec-convert-prototype/` | não há protótipo HTML para converter (A2) |
| `.claude/skills/spec-scaffold/` | o esqueleto do app é o projeto Fluent em `app/`, gerado pelo `sn-scaffold` |
| `.claude/skills/spec-implement/` | substituída pela `sn-implement` (item 29), copiada dela e adaptada a Fluent, ATF e `npm run reinstall` |
| `.claude/skills/spec-tasks-azure/` | o backlog vai para issues do GitHub (A4) pelo `sn-tasks-github`, que levou o `lib/load-tasks.mjs` |
| `.claude/hooks/tasks-azure-dry-run.test.mjs` | testava o publicador do Azure DevOps removido |

As referências às skills removidas nas skills `spec-ingest`, `spec-product`, `spec-tech-rules`,
`spec-hld`, `revisao-de-seguranca`, `spec-test-plan` e `spec-iterate` ficam para o item 31, que muda
o conteúdo delas.

## Estágio 0: teste de viabilidade (item 9), 2026-11-24

| # | Checagem | Desfecho |
|---|---|---|
| 1 | ATF pela linha de comando | **Desfecho A, os dois rodam.** O teste de servidor passou com `now-sdk cicd test run --test-sys-id <id> -o json`. O de form passou com um Client Test Runner sem tela aberto via Playwright em `/atf_test_runner.do?sysparm_nostack=true&sysparm_scheduled_tests_only=true`. Testes disparados por `cicd` são "agendados", e o runner precisa aceitar agendados. Antes, foi preciso ligar `sn_atf.runner.enabled = true` na instância, porque a PDI vem com `false` e o `cicd` devolve 400 "Start ATF test Failed" |
| 2 | `sys_report` via `Record()` aparece na UI clássica | **Aprovada.** O report de barras agrupado por choice renderiza em `/sys_report_template.do?jvar_report_id=<id>` |
| 3 | PNG por permalink visível numa issue de repositório privado | **Parcial.** A issue #1 do repositório privado renderiza `<img src="…/blob/<sha>/docs/viabilidade/form-ui.png?raw=1">`. Falta a confirmação visual de quem vai assistir à demo, logado no GitHub com acesso ao repositório |
| 4 | Maior nome de tabela cabe em 30 caracteres | **Aprovada por regra.** `x_2326104_cob_` tem 14 caracteres, e sobram 16 para o sufixo, conferidos pelo validador do modelo (item 23) |

O app de teste foi removido depois da checagem. O install com `keys.ts` (`deleted: true`) removeu os testes e os registros, e a tabela foi removida por `now-sdk exec` no escopo global.

### Fatos do ambiente

* A autenticação do SDK usa variáveis de ambiente em modo CI (`SN_SDK_NODE_ENV=SN_SDK_CI_INSTALL` + `SN_SDK_*`), carregadas de `.env.instancia` (`node --env-file`). Não há alias no cofre do sistema operacional, porque o contêiner não tem keyring.
* O `now-sdk init --template base` registrou o escopo `x_2326104_cob` (scopeId `7ad96995d30241c2bce1843c3be98996`) e fixou `@servicenow/sdk` em 4.14.3.
* A instância abre com o cabeçalho Next Experience (Polaris) em volta do form e da list clássicos. Para o cabeçalho UI16, é preciso `glide.ui.polaris.experience = false` (pendente de decisão do autor).

## Branch `template` (2026-11-25)

Kit limpo para outro plano de implementação: sem `app/`, `inputs/` e `outputs/` do piloto (que ficam na `feat/v0`), com `workspace.md` e `.env.example` genéricos e o `README.md` como guia de uso. O `check_sensivel.py` passou a ir junto, em `scripts/`, e o `doutor` o procura ali, ou no caminho da variável `CHECK_SENSIVEL`. A alteração no `doutor.mjs` foi feita em modo template, com o manifesto regerado.
