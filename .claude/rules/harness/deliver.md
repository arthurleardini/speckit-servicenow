---
description: Fase Deliver — implementação por story no app ServiceNow, install registrado, recibo de ATF, auditoria por US e gate de push.
paths: ".claude/rules/harness/deliver.md"
---

# 🚀 Deliver — construção

## Comportamento — human *on the loop*

O humano acompanha e decide nos pontos de controle; não revisa cada passo. O que garante
qualidade é o loop fechado por US, não a supervisão contínua.

## Loop por story

O `sn-scaffold` (modo Plan) já levantou tabelas, forms, lists, menu, roles e seed. Depois, para
cada story:

```
sn-implement → commit de app/src/fluent → npm run reinstall → npm run atf -- --story <ID>
  → validação conforme o tipo da story → sn-capture --story → comentário na issue
  → auditoria-de-us → delivery-gate no push → PR
```

- **Instalação só por `npm run reinstall`.** Nunca `now-sdk install` direto. Commite o código de
  `app/src/fluent/` **antes** do reinstall: a linha de install no `sync-log.md` leva o commit
  `git log -1 --format=%H -- app/src/fluent`, e o gate compara os dois.
- **ATF:** o `npm run atf -- --story <ID>` grava o recibo `outputs/spec/auditorias/atf/<STORY>.json`
  (status `success`/`failure`, commit do HEAD). Servidor e form rodam pela linha de comando
  (desfecho A do item 9, `ORIGEM.md`).
- **Pronto da US** = install `ok` registrado no commit atual de `app/src/fluent` + recibo de ATF
  `success` do mesmo commit (ou isenção de ATF de form da story) + auditoria aprovada.
- **Um branch é uma user story.** `outputs/spec/em-andamento.md` é o marcador efêmero da US aberta:
  quem cria é a `sn-implement`
  (`node .claude/ferramentas/andamento.mjs abrir-us --us <US> --repositorios <repos>`), quem apaga é
  a `auditoria-de-us` ao fechar a US com veredito diferente de BLOQUEADA (`MARKER_CLEARED`).
  Enquanto ele estiver na árvore, o `delivery-gate` nega o push.
- **Dependência e status da task** (`tasks.json` local): `andamento.mjs conferir` antes de começar;
  `andamento.mjs concluir` grava `status: "DONE"` com o G3 em `fim` ou com a isenção registrada.

## Validação por tipo de story

| Story | G3 com LLM | build + install | ATF servidor | ATF form |
|---|---|---|---|---|
| fio condutor (label `fio-condutor`) | sim | sim | sim | sim |
| gerada (tabela, form, list, menu, role, seed) | isenção de G3 | sim | sim | sim |
| outra feita à mão | isenção de G3 | sim | sim | sim |

No fio condutor o G3 roda por
`node .claude/ferramentas/validar.mjs --repo app --cmd-build "npx now-sdk build" --cmd-testes "npm run atf -- --story <ID>"`.

**Isenção por story** mora em `outputs/spec/auditorias/_isencoes/<STORY>-<tipo>.md`, com `tipo` `g3`
ou `atf-form`, e o bloco:

```markdown
<!-- gate:isencao-story -->
story: <ID>
tipo: g3|atf-form
autor: <nome>
data: <AAAA-MM-DD>
motivo: <texto>
<!-- /gate:isencao-story -->
```

A de `atf-form` substitui o recibo de ATF de form daquela story no `delivery-gate`; a de `g3`
dispensa os validadores com LLM. Uma isenção de story não isenta a fase nem outra story.

## O gate e a política de branch

O `delivery-gate` bloqueia o push sem auditoria fresca e aprovada ancorada no commit **daquele
repositório**, com o marcador ainda na árvore, sem linha de install `ok` com o commit atual de
`app/src/fluent`, ou sem recibo de ATF `success` do commit (ou isenção). Ele só **lê** o
`sync-log.md` e o recibo: nunca roda `now-sdk`. Instância fora do ar = sem recibo = push negado.

**Ele é a camada local**, `PreToolUse` em `Bash`: push digitado no terminal, na IDE ou de outra
máquina não passa por ele. A garantia autoritativa é o PR e a proteção de branch do GitHub.

## Auditoria — três granularidades, todas ficam

- o G3 da `sn-implement` valida **cada task** do fio condutor, com correção automática
- `auditoria-de-us` audita o **delta** de uma US, com regressão leve
- `spec-code-audit` varre o **código inteiro** no fim, com veredito APROVADO/BLOQUEADO

As três usam **o mesmo motor determinístico** — `validar.mjs` na task, `varrer-entrega.mjs
--desde-o-ramo` na US, `varrer-entrega.mjs --tudo` no repositório — e **a mesma regra de rastreio
SEC**: `.claude/references/seguranca/rastreio-sec.md` (Decisões 69 e 74). Achado SEC CRÍTICO/ALTO
só fecha com a task `SEC-NNN` no backlog. Sem ela, a auditoria pergunta se cria a task: com «sim»,
cria no `tasks.json` e publica a issue por `sn-tasks-github --change`; com «não», SEC proposto +
`GAP-NNN`, e bloqueia.

## Segurança nesta fase

A `spec-security-review` já injetou `SEC-NNN` no backlog, no Plan. ACL, escopo e privilégio seguem
a Camada G de `.claude/rules/harness/security.md`.

## Ferramentas de apoio

- `spec-status-report` — detecta a fase, lê os recibos de ATF e gera o HTML de acompanhamento
- `spec-scope-change` — virada de escopo
- `spec-debug-fix` — bugs, com evidência do system log e dos execution details
