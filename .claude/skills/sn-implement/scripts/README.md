# atf.mjs — leitor de ATF

Parte do item 29 do design v0. Roda testes ATF na instância pelo `now-sdk cicd` e grava o recibo que
o `delivery-gate` e a `promocao.mjs` leem. Ninguém mais consulta resultado de ATF na instância.

```bash
npm run atf -- --story <ID>         # Test() de app/src/fluent/tests/<ID>.now.ts
npm run atf -- --suite <nome>       # TestSuite pelo nome (ex.: cob-regressao)
npm run atf -- --test-sys-id <id>   # um teste
```

| Flag | Efeito |
|---|---|
| `--sem-runner` | não abre o Client Test Runner |
| `--com-runner` | abre o runner mesmo sem passo de UI na story |
| `--recibo-dir <pasta>` | pasta do recibo (padrão `outputs/spec/auditorias/atf`) |

- **Runner.** Com `--story`, o runner abre só se o arquivo tem passo de UI (`atf.form`, `atf.list`,
  `atf.catalog`, …). Com `--suite` e `--test-sys-id`, abre sempre, salvo `--sem-runner`. O runner é
  um Chromium sem tela, logado, em `/atf_test_runner.do?sysparm_nostack=true&sysparm_scheduled_tests_only=true`,
  aberto antes do disparo e fechado no fim (desfecho A do item 9).
- **sys_id do teste.** Lido do `keys.ts` pela chave `Now.ID` de cada `Test()` do arquivo; rodar
  `npm run reinstall` antes.
- **Recibo** `<pasta>/<STORY|suite|test-<sys_id>>.json`: `sys_id`, `resultId`, `status`
  (`success`/`failure`), `horario`, `commit` (`git rev-parse HEAD`), `runner` e o detalhe por teste.
- **Código de saída.** 0 se tudo passou, 1 se algum teste falhou, 2 em erro de uso ou configuração.

O envelope do `now-sdk cicd ... -o json` (SDK 4.14.3) traz o resultado em
`interpretedResult.summary` (`resultId`, `testStatus`/`testSuiteStatus`); o `result.status_label`
é o estado do disparo (`Pending`) e não o resultado.

Usa `../../sn-reinstall/scripts/lib/instancia.mjs` para credencial, CLI do SDK e login.
Testes: `node --test .claude/skills/sn-implement/scripts/atf.test.mjs`.
