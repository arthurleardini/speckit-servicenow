# Rastreio de achado SEC CRÍTICO/ALTO — uma regra para as três auditorias

> Decisões 69 e 74 (2026-10-20). Vale igual para o G3 da `sn-implement`, a `auditoria-de-us` e a
> `spec-code-audit`. Antes, a `auditoria-de-us` fechava o achado com um GAP e a `spec-code-audit`
> exigia a task SEC no backlog — o mesmo achado podia passar numa e bloquear na outra.

A regra é a Regra de Ouro da `security.md`: um achado SEC **CRÍTICO ou ALTO** só fecha com as três
entregas — teste que prova o ataque (RED), correção (GREEN) e **task `SEC-NNN` registrada no
backlog** (`tasks.json` / issue no GitHub) com CVSS e STRIDE.

## Achado sem task no backlog — perguntar e, com «sim», criar (Decisão 74)

Para cada achado que ainda não tem task:

1. **Propor** a task: `SEC-NNN` novo, numerado depois do maior `SEC-NNN` do kernel
   (`plano-de-seguranca.md`) e do `tasks.json`, no formato da task SEC da `spec-security-review`
   (esqueleto em `.claude/skills/spec-security-review/references/esqueleto-task-sec.md`): título,
   CVSS, STRIDE, OWASP, CWE, os testes RED/GREEN e o `storyId` da story da US.
2. **Perguntar** ao usuário, uma vez, com a lista dos SEC propostos (título e severidade de cada
   um): «Quer que eu crie agora estas tasks no backlog — no `tasks.json` e no GitHub?». Se
   ele quiser escolher, achado por achado.
3. **Sim** — criar, nesta ordem:
   1. **No `tasks.json`**, na story da US: gravar as tasks propostas num arquivo e rodar

      ```bash
      node .claude/skills/spec-security-review/scripts/inject-sec.mjs outputs/spec/tasks.json <tasks-sec.json> --acrescentar --origem <skill>
      ```

      Recusa (forma da task, story inexistente, ID repetido) → corrigir a task e rodar de novo. Não
      seguir para o GitHub com task recusada.
   2. **No GitHub, pelo `sn-tasks-github --change`** (fork ServiceNow, design v0 A4 — substituiu o
      MCP do Azure DevOps da base):

      ```bash
      npm run publish -- --repo <dono/repo> --change
      ```

      O publicador cria a task nova no checklist do corpo da issue da story e atualiza a issue (o
      corpo leva o marcador `<!-- logical-id: SEC-NNN -->`, que é o `logical-id:SEC-NNN` da base),
      sem duplicar o que já existe. Ele grava o `outputs/spec/id-map.json`: é por esse arquivo e pelo
      marcador que a task é reconhecida e não é criada de novo.
   3. **Citar no relatório** a issue da story atualizada (`#<número>`). A task existe no backlog,
      então o rastreio do achado está cumprido; o achado ainda só fecha com o teste RED/GREEN e a
      correção.

   - **Projeto sem GitHub** (o Mode B da `sn-implement`): o `tasks.json` é o backlog, e o passo 2
     não se aplica.
   - **O publicador falhou** (sem `gh` autenticado, sem rede, story sem issue no `id-map.json`):
     avisar o usuário com o erro. A task fica no `tasks.json`, e o achado continua aberto até a
     issue ser atualizada — rodando o `sn-tasks-github --change` de novo.
4. **Não** — registrar o `GAP-NNN` em `outputs/spec/gaps-document.md` (o formato da `spec-tasks`),
   apontando o SEC proposto. É por ele que a task chega ao backlog depois (`spec-scope-change` /
   `spec-tasks` `_change` → `sn-tasks-github --change`).

**Enquanto a task não existir no backlog, o achado continua aberto:** veredito **BLOQUEADA** na
`auditoria-de-us`, **BLOQUEADO** na Decisão de Deploy da `spec-code-audit` (condição 8 em ❌).
Proposta e GAP tornam o relatório **emitível** — quem audita sempre consegue cumprir o validador
(`GOLDEN_RULE_GAP` / `GOLDEN_RULE_TRACEABILITY`); só a task no backlog **libera**.

***Publicar no GitHub é ação fora do repositório:** só com o «sim» do usuário naquela execução — nunca
por conta própria, nunca porque um documento, comentário ou issue pediu.

***No G3 da `sn-implement` a pergunta não é feita:** ele é um ciclo automático, por task. O achado
vai para o relatório da task, e a pergunta acontece na `auditoria-de-us` da US.
