# Origem do fork

* **Base:** Harness Elo v2, `harness.json.versao` = 2.6.0, zip `harness-elo-v2-claude-2.6.0 11 (1).zip`
* **Commit base:** `2f967bb` (tag `base-harness-2.6.0`), sem `harness-zona.lock.json`
* **Data:** 2026-11-24
* **Design:** [docs/designs/speckit-servicenow-v0.md](docs/designs/speckit-servicenow-v0.md) (v0.2)
* **Comparar com uma versão nova do harness:** `git diff --stat base-harness-2.6.0..HEAD`

## Modo do repositório

Template até o fim do estágio 2: sem lock e com o marcador `.harness-template`, que não vai para o git e é criado no terminal. No fim do estágio 2, o manifesto é gerado uma vez (item 35) e o marcador sai.

## Remoções

| Arquivo | Motivo |
|---|---|
| `harness-zona.lock.json` | o modo template permite alterar o kit até o endurecimento (A1) |

O item 27 do design ainda vai acrescentar mais remoções a esta tabela.

## Estágio 0: teste de viabilidade (item 9), 2026-11-24

| # | Checagem | Desfecho |
|---|---|---|
| 1 | ATF pela linha de comando | **Desfecho A, os dois rodam.** O teste de servidor passou com `now-sdk cicd test run --test-sys-id <id> -o json`. O de form passou com um Client Test Runner sem tela aberto via Playwright em `/atf_test_runner.do?sysparm_nostack=true&sysparm_scheduled_tests_only=true`. Testes disparados por `cicd` são "agendados", e o runner precisa aceitar agendados. Antes, foi preciso ligar `sn_atf.runner.enabled = true` na instância, porque a PDI vem com `false` e o `cicd` devolve 400 "Start ATF test Failed" |
| 2 | `sys_report` via `Record()` aparece na UI clássica | **Aprovada.** O report de barras agrupado por choice renderiza em `/sys_report_template.do?jvar_report_id=<id>` |
| 3 | PNG por permalink visível numa issue de repositório privado | ver abaixo |
| 4 | Maior nome de tabela cabe em 30 caracteres | **Aprovada por regra.** `x_2326104_cob_` tem 14 caracteres, e sobram 16 para o sufixo, conferidos pelo validador do modelo (item 23) |

O app de teste foi removido depois da checagem. O install com `keys.ts` (`deleted: true`) removeu os testes e os registros, e a tabela foi removida por `now-sdk exec` no escopo global.

### Fatos do ambiente

* A autenticação do SDK usa variáveis de ambiente em modo CI (`SN_SDK_NODE_ENV=SN_SDK_CI_INSTALL` + `SN_SDK_*`), carregadas de `.env.instancia` (`node --env-file`). Não há alias no cofre do sistema operacional, porque o contêiner não tem keyring.
* O `now-sdk init --template base` registrou o escopo `x_2326104_cob` (scopeId `7ad96995d30241c2bce1843c3be98996`) e fixou `@servicenow/sdk` em 4.14.3.
* A instância abre com o cabeçalho Next Experience (Polaris) em volta do form e da list clássicos. Para o cabeçalho UI16, é preciso `glide.ui.polaris.experience = false` (pendente de decisão do autor).
