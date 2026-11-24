# Tech Rules — Sumário de Decisões

**Gerado em:** 2026-11-24  **Por:** spec-tech-rules (versão ServiceNow, design item 31)
**Projeto:** Cobrança MT — app escopado `x_2326104_cob`, piloto 2.6 Cobrança SEFAZ-MT
**Ambiente das rules:** `claude`. As rules ficam em `outputs/spec/tech-rules/*.mdc` (fonte versionada). A materialização em `.claude/rules/` não foi feita nesta execução: a pasta é mantida por outra frente.

## Decisões

| Bloco | Decisão | Justificativa (documento e sinal) |
|-------|---------|----------------------------------|
| Plataforma | ServiceNow, app escopado `x_2326104_cob` na PDI `dev493801` (release Brazil) | `docs/designs/speckit-servicenow-v0.md` §Overview e A2; `especificacao-tecnica.md` §2 |
| Linguagem / SDK | Fluent (`@servicenow/sdk` 4.14.3) para metadados; JavaScript de servidor Glide (`@servicenow/glide` 27.0.5) em `app/src/server/` | `especificacao-tecnica.md` §2 «Código-fonte do app»; `app/package.json` |
| Interface | Core UI clássica (UI16): Form, List, related list, report, UI Action, UI Policy; sem Workspace, Portal ou UI Builder | design Non-Goals; `especificacao-funcional.md` §2 (33 telas form/list/report) |
| Arquitetura | configurar antes de customizar: dicionário → ACL → Data Policy → UI Policy → Business Rule → Flow → Script Include | design item 31 (ADR "configurar × customizar"); RN-SN-13, RN-SN-151 |
| Lógica reutilizável | Script Include por área (`QualificacaoCiclo`, `CarteiraAtendente`, `ScoreUfmt`, `CanalEnvio`, `FonteDebito`) | `business-rules.md` com 12 RN de Derivação; RN-SN-49, RN-SN-73 |
| Integrações | tabelas `SIM-` lidas por um Script Include por integração (camada anti-corrupção) | `inputs/simulacoes.md`; design A8 |
| Persistência | tabelas do escopo geradas do `data-model.json` pelo `sn-scaffold`; remoção vira DELETE via `keys.ts`; sem migração | design §Como as peças se ligam «Prévia e final do modelo de dados» |
| Convenções | identificadores em português sem acento, tabela ≤ 30 caracteres, `$id = Now.ID['<ID-da-spec>_<tipo>_<nome>']` | design A7, item 23; RN-SN-03, RN-SN-06 |
| Autorização | roles `x_2326104_cob.coordenador/atendente/admin`; ACL por tabela e operação; ACL de linha para a carteira do atendente | `especificacao-funcional.md` §1.2; RN-NOVO-F5-007; RN-SN-136 a RN-SN-142 |
| Segurança de script | `GlideRecordSecure` em consulta do usuário; `clientCallable` só com GlideAjax e ACL; `package_private` | RN-SN-71, RN-SN-72, RN-SN-80, RN-SN-147 |
| Testes | ATF em `Test()`; servidor por `now-sdk cicd test run`; form pelo Client Test Runner com Playwright; positivo e negativo por regra; recibo por story; suíte `cob-regressao` | design §ATF e tabela de validação por tipo de story; RN-SN-110 a RN-SN-115 |
| Instalação | só `npm run reinstall` (prefixo, documentos, build `--frozenKeys`, install, contagem, suíte, sync-log) | design item 30; RN-SN-07, RN-SN-08 |
| Credencial | `.env.instancia` fora do git, chmod 600, sem leitura pelo agente | design NFR «Segredos» |
| Seed | `Record()` com `installMethod: 'demo'`, só fictício, `ficticio = true`, até 300 por tabela | design A9; RN-NOVO-T-002; RN-SN-103, RN-SN-154, RN-SN-168 |
| Observabilidade | `gs.debug/info/warn/error` sem dado pessoal; resultado de execução nas tabelas `sincronizacao` e `envio_sim` | RN-SN-12, RN-SN-84; `especificacao-tecnica.md` §3 |

## Arquivos gerados

| Arquivo | alwaysApply | Propósito |
|---------|------------|-----------|
| `conventions.mdc` | true | nomes, idioma, pastas, `$id`, estilo de script |
| `architecture.mdc` | false (`app/src/**`) | onde vai cada regra; peças do fio condutor; integrações `SIM-` |
| `security.mdc` | false (`app/src/**`) | roles, ACL, carteira do atendente, script seguro, cross-scope, seed, credencial — complementa `.claude/rules/harness/security.md` |
| `test-strategy.mdc` | false (`app/src/fluent/tests/**`, `app/src/server/**`) | ATF, cobertura por tipo de story, casos do fio condutor, recibo |
| `deploy-and-build.mdc` | false (`app/**`, `package.json`, `.env*`) | `npm run reinstall`, `keys.ts`, credencial, git, seed |

Não gerados no v0: `database.mdc` (persistência coberta por `architecture.mdc` e `conventions.mdc`), `auth.mdc` (autenticação é a da plataforma; autorização em `security.mdc`), `observability.mdc` (coberta em `conventions.mdc`), `frontend.mdc` (UI16 sem código de frontend; ver `.claude/rules/harness/servicenow-ui.md` quando existir), `integrations.mdc` e `messaging-and-queue.mdc` (integrações simuladas, sem fila).

O `security.mdc` desta pasta é a versão ServiceNow pedida no item 31 do design; não é cópia do `templates/security.mdc` do kit. A regra universal continua em `.claude/rules/harness/security.md`.

## Questões em aberto <!-- id: open-questions -->

| # | Pergunta | Evidência/contexto (bloco/decisão) | Bloqueia próxima fase? |
|---|----------|-------------------------------------|-------------------------|
| 1 | O `now-sdk cicd test run` executa teste de form sem navegador? | design Q2 / item 9; define se a story usa isenção de ATF de form | não — a isenção está prevista |
| 2 | Contrato técnico das integrações reais (UFMT, canais, fontes) | GAP-008, GAP-009, GAP-011 | não no v0 — tabelas `SIM-` |

## Como usar

1. As rules estão em `outputs/spec/tech-rules/*.mdc`. A cópia para `.claude/rules/` é feita pela frente que mantém essa pasta, com `python3 .claude/skills/spec-tech-rules/tools/mdc_to_md.py --dir outputs/spec/tech-rules .claude/rules`.
2. `spec-data-model`, `spec-tasks` e `sn-implement` leem estas rules como constituição técnica do app.
3. Regenerar a partir do `.mdc`; não editar cópias.
