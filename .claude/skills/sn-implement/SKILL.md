---
name: sn-implement
description: >
  sn-implement (Fase 11 — Deliver: implementação de story no app ServiceNow) — invocar quando o usuário quiser
  implementar uma story ou task do backlog (issue do GitHub publicada pelo sn-tasks-github, ou task
  do tasks.json) no app Fluent em app/. Trabalha test-first: monta o Test Blueprint antes do código,
  consulta `now-sdk explain` antes de cada tipo de objeto, escreve os `.now.ts` em app/src/fluent/ e
  o script de servidor em app/src/server/, gera o Test() ATF da story com caso positivo e negativo
  por regra, instala pelo `npm run reinstall`, roda o ATF pelo `npm run atf -- --story <ID>` (recibo
  em outputs/spec/auditorias/atf/), aplica a validação que o tipo da story exige (G3 só no fio
  condutor; isenção registrada nas demais), tira o print pelo sn-capture --story e comenta o
  resultado na issue. Termina sempre com a devolutiva em chat, em português simples. Pré-requisito:
  outputs/spec/id-map.json (backlog publicado). Conteúdo humano em Português do Brasil.
version: "0.1"
updated: "2026-11-24"
---

# sn-implement — Implementação de story no app ServiceNow (test-first)

> **Extensão do projeto** (design v0, item 29). Cópia adaptada da `spec-implement` do Harness Elo
> 2.6.0, que o fork removeu (ver `ORIGEM.md`). O método é o mesmo — Test Blueprint antes do código,
> ciclo G3, devolutiva —; o que muda é o destino: um app escopado ServiceNow escrito em Fluent, e não
> um repositório Next.js. Exemplos usam placeholders (`TASK-001`, `US-MOD-F2-001`, `RF-MOD-F2-003`).

## Papel

Implementa, no Deliver, **uma story** (ou uma task dela) do backlog gerado pela `spec-tasks` e
publicado pelo `sn-tasks-github`. Fecha o CUJ 3 do design: story "pronta para fazer" no GitHub →
`.now.ts` + `Test()` ATF → `npm run reinstall` → `npm run atf` → validação conforme o tipo da story →
print na instância → comentário na issue.

Usa:

1. **A issue do GitHub** (`gh issue view`) ou a task do `tasks.json` local — **fonte única de
   verdade** (a `spec-tasks` garante que cada item é autossuficiente). O `Task.snArtifact`
   (`kind`, `table`, `fluentFile`, `nowId`) diz que objeto ServiceNow a task cria e em que arquivo.
2. **As rules técnicas** do projeto (as `.mdc` da `spec-tech-rules`), mais
   `.claude/rules/harness/servicenow-ui.md` e `.claude/rules/harness/security.md` do harness.
3. **O app Fluent em `app/`** — a única pasta de código. Escrita em `app/src/fluent/<tipo>/` e
   `app/src/server/`; o escopo é sempre lido de `app/now.config.json`, nunca escrito à mão.
4. **`data-model.json`** (Plan) — só como conferência opcional, quando a task o cita. Em conflito,
   **a task vence**; a divergência vai no comentário da issue.

**Fora do escopo:** gerar o `tasks.json` (`spec-tasks`); gerar tabela, form, list, menu, role e seed
em massa a partir do modelo (`sn-scaffold` e `sn-seed`); instalar por `now-sdk install` direto
(só `npm run reinstall`).

> **Língua:** o texto desta skill mistura português e inglês herdado da origem. Identificadores do
> app seguem as rules do projeto.

### Regras de plataforma (valem em toda a skill)

- **Consultar a documentação do SDK antes de escrever cada tipo de objeto:**
  `npx now-sdk explain --list` → `npx now-sdk explain <tópico> --peek` → tópico completo quando o
  resumo não basta. Vale para `Table`, `Form`, `List`, `BusinessRule`, `ClientScript`, `UiPolicy`,
  `UiAction`, `ScriptInclude`, `Acl`, `Role`, `Flow`, `Test`, `TestSuite`, `Record`.
- **Nunca apagar** `Table()`, `BusinessRule()` ou `Record()` sem confirmar com o usuário: o campo ou
  registro que some da fonte vira DELETE na instância no install seguinte (`keys.ts` com
  `deleted: true`).
- **`$id` com o ID da spec:** `Now.ID['<ID-da-spec>_<tipo>_<nome>']`, por exemplo
  `Now.ID['RF-MOD-F2-003_br_publicar_versao']`. É o que liga o código ao rastreio
  (`promocao.mjs --rastreio`).
- **Instalar só por `npm run reinstall`.** `now-sdk install` direto e `--zerar` pedem confirmação.
- **Código de servidor:** `GlideRecordSecure` em código chamado pelo cliente; `gs.error`/`gs.warn`
  no lugar de `console.log`; `GlideAggregate` no lugar de contar em laço.

---
## Linguagem clara — como escrever o que o humano vai ler (OBRIGATÓRIO)

<!-- linguagem-clara:v1 inicio -->
<!-- Bloco canônico. Ao alterar, rodar `python scripts/apply_linguagem_clara.py` para replicar em todas as skills. -->

**Quem lê não é você.** É o desenvolvedor que pegou a task sem ter participado do discovery, o PO
que precisa aprovar, o analista que entrou no time semana passada. Texto correto e ilegível custa
uma reunião — e quem lê desiste e vai perguntar. Escrever difícil não é sinal de rigor: é defeito de
geração, do mesmo peso de um campo obrigatório faltando.

**Alvo verificável:** uma pessoa que nunca viu este projeto entende o que precisa fazer **lendo uma
vez**, sem abrir outro documento e sem precisar procurar o significado de nenhuma palavra.

### As 10 regras

1. **Frase curta, voz ativa, presente.** "O serviço confere o CPF antes de gravar" — não "a
   validação do CPF é realizada previamente à persistência". Alvo: até ~25 palavras por frase, uma
   ideia por frase.
2. **Termo técnico ganha explicação de meia linha na primeira aparição:** "no repository (a classe
   que conversa com o banco)", "um índice único (o banco passa a recusar duplicados sozinho)". Da
   segunda vez em diante, usar o termo puro.
3. **Nenhuma sigla solta.** Expandir na primeira aparição — inclusive as siglas do negócio e as da
   própria metodologia: "IDOR (quando um usuário consegue acessar o registro de outro)",
   "DV (Documento de Visão)", "RN (Regra de Negócio)".
4. **Código de regra ou de requisito nunca substitui o conteúdo dela.** Escrever a regra por extenso
   e pôr o código no fim, entre parênteses: "não deixa cadastrar dois clientes com o mesmo CPF
   (RN-012)". "Implementar a RN-012" não informa nada a quem não tem o documento aberto.
5. **Nome de arquivo, tabela, rota ou classe sempre acompanhado do papel dele.**
   `PedidoService.java` sozinho não diz nada; `PedidoService.java — onde ficam as regras de quando
   um pedido pode ser aprovado` diz. Vale igual para `TB_PEDIDO` e para `POST /pedidos`.
6. **Sem jargão de processo.** "blueprint", "gate", "FATAL", "matriz de cenários", "compact-prose",
   nome de validator, nome de camada de arquitetura: isso é vocabulário interno das skills, não do
   leitor. Traduzir — em vez de "6 cenários da matriz em VERDE", escrever "testei 6 situações, todas
   passaram".
7. **Sem "simplesmente", "basta", "apenas", "trivial", "é só".** Minimizam a dificuldade e afastam
   quem não entendeu de primeira.
8. **Verbo no lugar de substantivo; ativa no lugar de passiva.** "realizar a validação" → "validar";
   "efetuar o cadastramento" → "cadastrar"; "é disponibilizado ao usuário" → "o sistema mostra";
   "deve ser efetuada a persistência" → "grava no banco".
9. **Cenário de teste é uma frase "quando X, o sistema Y"** — nunca o id do cenário, nunca o nome do
   método de teste: "quando o CPF já existe, o sistema recusa e mostra 'CPF já cadastrado'".
10. **Bloco técnico denso abre com uma frase em português dizendo o que ele significa.** Contrato de
    API, colunas de tabela, status HTTP, schema, JSON: o conteúdo continua **completo e preciso** —
    o que muda é que antes dele vem uma linha do tipo "esta rota cria o pedido e devolve o número
    dele; se o CPF não existir, recusa com 404". Precisão técnica e legibilidade não competem: a
    frase de abertura é o mapa, o bloco é o território.

### Antes → depois (referência de tom)

| Complexo (não usar) | Claro (usar) |
|---|---|
| "Implementar validação de unicidade conforme RN-012, com persistência idempotente." | "Impedir o cadastro de dois clientes com o mesmo CPF. Se o CPF já existir, o sistema recusa e mostra 'CPF já cadastrado' — nada é gravado. Se a mesma requisição chegar duas vezes, o resultado é o mesmo da primeira (RN-012)." |
| "A entidade é submetida ao processo de normalização previamente à sua persistência." | "Antes de gravar, o sistema padroniza os dados: tira acento, deixa em maiúscula e remove espaço sobrando." |
| "Realizar o tratamento de exceções no fluxo de integração." | "Se o sistema externo não responder, tentar mais 2 vezes. Se ainda falhar, guardar a solicitação na fila e avisar o usuário que o processamento termina depois." |
| "Garantir a aderência aos padrões arquiteturais definidos." | "Seguir o padrão do projeto: a tela nunca fala direto com o banco, sempre passa pelo serviço." |
| "Disponibilizar endpoint para consulta paginada de pedidos com filtros." | "Criar a busca de pedidos: quem chama informa a página e pode filtrar por cliente, período e situação. A resposta traz 20 pedidos por vez e o total encontrado." |
| "Efetuar refatoração do componente visando redução do acoplamento." | "Separar o componente em dois, para que mudar a regra de desconto deixe de exigir mexer na tela." |

### Como conferir antes de entregar (30 segundos)

1. Leia em voz alta a **primeira frase de cada seção**. Travou a língua? Reescreva.
2. Existe alguma palavra que um analista de primeiro emprego **não usaria numa conversa**? Troque, ou
   explique entre parênteses na primeira aparição.
3. Alguma frase obriga a abrir outro documento para fazer sentido — sigla, código de regra, nome de
   arquivo sem o papel dele? Complete ali mesmo.
4. Algum bloco técnico começa direto no JSON, na tabela ou no YAML? Ponha a frase de abertura.

> **Isto não autoriza cortar conteúdo.** Nenhuma das regras acima permite resumir, omitir campo
> obrigatório ou trocar dado concreto por prosa. Linguagem clara é sobre a **forma**; densidade,
> precisão e auto-suficiência continuam sendo sobre o **conteúdo**. As duas coisas valem juntas.

<!-- linguagem-clara:v1 fim -->

### Aplicação nesta skill

Vale para o `spec_story.md`, para o comentário no work item e para a devolutiva no chat do passo J. As **Regras de escrita** da seção de devolutiva (mais abaixo) são a aplicação desta régua ao formato daquele passo — as duas valem, não há conflito entre elas.

## Princípio central — o teste é o plano, não o resíduo

Esta skill trabalha **test-first**. A ordem não é negociável:

```
o que precisa ser verdade  →  como isso será provado  →  código que torna verdade  →  provas rodando
   (cenários)                  (Test Blueprint)            (implementação)              (testes verdes)
```

**Por quê.** Enquanto os testes eram a última etapa, eles competiam com "a task já está funcionando"
e perdiam: o agente escrevia o caminho feliz e declarava pronto. Quando a matriz de cenários e os
nomes dos arquivos de teste existem **antes** da primeira linha de produção, a implementação passa a
ser *o que falta para essas linhas passarem* — e a cobertura deixa de depender de disciplina no fim
do fôlego. Não é TDD estrito (o teste não precisa ser escrito antes do código), mas a **decisão do
que será testado** é sempre anterior ao código.

**Consequência prática:** o Test Blueprint (§ Fase 2) é um **gate FATAL**. Editar código de produção
antes de ele existir é defeito de execução, não estilo.

---

## Sync-log (obrigatório)

Antes de iniciar, ler `outputs/spec/sync-log.md` (Seção A) — inclui a linha de kickoff (ver `../tools/references/task-pipeline.md` §4)
e a última linha `now-sdk-install`.
Ao terminar, adicionar UMA linha: `| # | data | sn-implement | <resultado-resumo> | <artefatos> | <questões em aberto> | <próximo passo> |`.
A linha `now-sdk-install` quem escreve é o `npm run reinstall` — não escrevê-la à mão.

**Gate `IMPL_COVERAGE` (WARNING — obrigatório na coluna `<questões em aberto>`):** registrar os
números do blueprint, no formato:
`IMPL_COVERAGE: cenários=N (verdes=a, vermelhos=b, não cobertos=c) | camadas=atf-servidor/atf-form | fonte=structured|derived|mista`.

---

## Quick start (ordem de execução)

```
A → Entradas — ID da story (ou issue) e da task, tasks.json, pasta do código (app), rules
B → Ler app/spec_story.md (memória do módulo), se existir
C → Ler a story: issue do GitHub via gh (Mode A) ou task do tasks.json (Mode B)
D → Story com várias tasks — confirmar o escopo; perguntar se ambíguo
D2 → Conferir as dependências (andamento.mjs conferir) — aberta → perguntar;
     na primeira task da US, criar o marcador outputs/spec/em-andamento.md (andamento.mjs abrir-us)

    ── FASE 2 — PROJETO DE TESTES (nenhum código de produção ainda) ──
E1 → Estratégia de testes (ATF de servidor e de form) e linha de base dos comandos (fio condutor)
E2 → Matriz de cenários (da story, ou PLANEJAR quando ela não os traz)
E3 → Cenário → camada → app/src/fluent/tests/<STORY>.now.ts::<Now.ID do Test()>
E4 → Congelar o Test Blueprint e reportá-lo (gate TEST_BLUEPRINT_BEFORE_CODE)

    ── FASE 3 — IMPLEMENTAÇÃO ──
F  → now-sdk explain antes de cada tipo de objeto; .now.ts em app/src/fluent/<tipo>/, script em app/src/server/

    ── FASE 4 — PROVAS ──
G1 → Test() ATF da story (positivo e negativo por regra), acrescentado à suíte cob-regressao
G2 → commit de app/src/fluent → npm run reinstall → npm run atf -- --story <STORY> (recibo)
G2b → Validação conforme o tipo da story: G3 no fio condutor; isenção g3 nas demais
G3 → Validação independente (fio condutor): validar.mjs + validadores e corretor em laço
H  → sn-capture --story, comentário na issue (gh issue comment) e andamento.mjs concluir
I  → Atualizar app/spec_story.md
J  → Devolutiva em chat, em linguagem simples, SEMPRE
```

---

## Pré-requisitos (ambiente)

| Requisito | Detalhe |
|-----------|---------|
| **`npm run doutor` verde** | Node no `engines`, `now-sdk` na versão fixada, credencial em `.env.instancia` (que a IA não lê), Playwright com Chromium, `gh auth status` com escopo `repo`. |
| **Backlog publicado** | `outputs/spec/id-map.json` do `sn-tasks-github` (o `cadeia.mjs` o exige antes desta skill). |
| **`gh` autenticado** | Para ler e comentar a issue (Mode A). Sem ele, rodar em Mode B. |

---

## A — Entradas (normativo)

Pedir uma vez o que faltar:

| Entrada | Obrigatória | Descrição |
|-------|----------|-------------|
| **ID da story** | Sim | `US-…` do `tasks.json` (o mesmo ID do recibo de ATF e do relatório da `auditoria-de-us`). Em Mode A, alternativamente o número da issue; o `id-map.json` liga os dois. |
| **ID da task** | Não | Uma task da story (`TASK-…`). Sem ela, o escopo segue o § D. |
| **`tasks.json`** | Sim | `outputs/spec/tasks.json` (v5.4). É dele que o G3 tira as perguntas. |
| **Pasta do código** | Fixa | `app/` — a skill não escreve fora de `app/src/fluent/` e `app/src/server/` sem o usuário ampliar o escopo. |
| **Rules** | Sim | As rules do projeto (`.mdc` da `spec-tech-rules`), lidas inteiras, sem escolher por tema. **A regra de testes é leitura obrigatória** (Fase 2 · E1). |

**Opcional**

| Entrada | Uso |
|-------|-----|
| **data-model.json** | Só conferência, e só quando a story o cita. |

---

## Onde estão as rules

1. **Rules do projeto (prioridade):** `.claude/rules/` da raiz (fora de `harness/`), escritas pela
   `spec-tech-rules`. Vencem em conflito.
2. **Rules do harness:** `.claude/rules/harness/security.md` (camada G: ACL, `GlideRecordSecure`,
   client-callable, cross-scope, role mínima) e `.claude/rules/harness/servicenow-ui.md` (Core UI
   clássica). Ler as duas **explicitamente**; a de UI sempre que a story tocar form, list, UI Policy,
   Client Script ou UI Action.
3. **Boas práticas da plataforma (referência, não gate):** as regras RN-SN do catálogo do projeto,
   quando a `spec-tech-rules` as cita.

Sem rules do projeto, **parar e perguntar** — não implementar só com suposições genéricas.

---

## B — Read spec_story.md (module memory)

Before fetching the work item, load the memory of each code folder:

1. For **each code folder** supplied by the user, check if `spec_story.md` exists at its root.
2. If the file exists, **read it in full** before doing anything else.
3. Treat its contents as authoritative context for this session:
   - **Padrões estabelecidos** — patterns that must be followed in all new code (naming, soft delete strategy, pagination style, migration naming, etc.). These override any generic assumption the agent might make.
   - **Estratégia de testes do módulo** — runner, localização dos testes, comandos que já rodaram
     antes, fixtures/factories reutilizáveis. Usar isso na Fase 2 · E1 antes de redescobrir o stack.
   - **Histórico de tasks** — what was already implemented, which files/endpoints exist, decisions already made. Use this to avoid duplicating work or contradicting prior decisions.
4. If `spec_story.md` does **not** exist, proceed normally — it will be created at the end (passo I).
5. If multiple code folders are given, read each folder's `spec_story.md` independently.

> **Why this matters:** Each task runs in a fresh session with no memory of prior tasks. The `spec_story.md` is the only persistent record of what was built before. Ignoring it risks reimplementing existing code, breaking established patterns, or contradicting prior decisions.

---


## C — Ler a story na issue do GitHub — Mode A

1. Achar o número da issue no `outputs/spec/id-map.json` (chave = ID lógico da story ou da task;
   valor `{ number, id }`).
2. Ler a issue: `gh issue view <número> --json title,body,labels,state,comments`. O corpo traz o
   marcador `<!-- logical-id: … -->`, os cenários de aceite, o `snArtifact` de cada task (checklist)
   e o print da tela por permalink.
3. Labels que importam: `fio-condutor` (decide o G3 — § G2b) e `sn:<kind>` (o tipo do objeto).
4. Conferir o corpo contra a task do `tasks.json` (Mode B abaixo): o `tasks.json` é a fonte dos
   cenários estruturados e do `snArtifact`. Divergência → a issue publicada pode estar velha; avisar
   e seguir o `tasks.json` (o `sn-tasks-github --change` a atualiza).

## C (alt) — Mode B — tasks.json local

Sem `gh` autenticado, ou quando o usuário aponta direto o `tasks.json`, rodar em **Mode B**:

1. **Localizar a task pelo id** em `stories[].tasks[]` do `tasks.json`. Id não achado → parar e
   pedir para confirmar o id ou o caminho.
2. A task localizada é a **story/task de trabalho** em todos os passos seguintes: `title`,
   `description`/`prompt`, `acceptanceCriteria`/`acceptanceScenarios[]`, `businessRules[]`,
   `persistenceModel`, `implementationGuidance` e `snArtifact` fazem o papel do corpo da issue.
3. **Classe da task (`class`)** muda o que se espera encontrar — ver § "Classes de task e o
   blueprint" na Fase 2.
4. Pular o que é do GitHub: sem `gh issue view` e sem `gh issue comment`. O equivalente do estado é
   o `status` da task no `tasks.json` — conferido antes de começar (§ D2) e gravado no fim (§ H
   (Mode B)).
5. **Passo final:** com o G3 em `fim` (ou a isenção `g3`), gravar a task como concluída (§ H
   (Mode B)), atualizar o `spec_story.md` (passo I) e entregar a **devolutiva** do passo **J** — que
   em Mode B é o único relatório e por isso acrescenta o que iria no comentário da issue: matriz
   condensada, comandos rodados e saída, recibo do ATF e divergências da conferência opcional.

O resto da skill (rules, `spec_story.md`, Test Blueprint, fronteiras de código, validações, regras
duras) vale igual nos dois modos.

---

## D — User Story vs Task (including parents with children)

| Scenario | Behavior |
|----------|----------|
| **Task / Bug with clear scope** | Implement directly per description + AC. |
| **User Story** **without** requiring children | Implement that **single** work item (the story) per its description + AC. |
| **User Story** that **has child** work items (tasks under the story) | **Do not** automatically read every child and implement **all** of them in one go. You may list the story's tasks (checklist of the issue or `tasks[]`) only to **inform** scope and to ask a precise question. **Default:** one implementation target per invocation — either the **story id** the user gave (story-level scope only) **or** **one child id** the user explicitly names. **Full backlog under a story** (implement every child) requires the user to **state that explicitly** (e.g. "implement all tasks under story X"); then process in **clear order** (the backlog's `executionOrder`, each child checked first per § D2) and still **one task closed (§ H) at a time** unless the user allows batching state updates. If the user only passes the **parent story id** and children exist, **stop and ask** whether to target the parent only, **one** child id, or **all** children. |
| **Epic** | Do not implement in one shot; split with the user into stories/tasks. |

> Em execução "all children", o Test Blueprint é **por task filha** — não existe blueprint único
> para a story inteira. Cada filha completa o ciclo Fase 2 → 2 → 3 antes de a próxima começar.

## D2 — Dependências da task e marcador da US (antes da Fase 2)

**Por quê.** Task implementada antes da dependência dela é escrita em cima de código que ainda não
existe, ou que vai mudar. E, em Mode B, o `tasks.json` é o único lugar em que a próxima sessão vê o
que já terminou: se ninguém grava ali, toda task parece pendente para sempre.

**1. Conferir as dependências.** Em Mode B, da raiz do harness:

```bash
node .claude/ferramentas/andamento.mjs conferir --task <TASK-ID> [--tasks outputs/spec/tasks.json]
```

O script lê as `dependencies` (e o apelido `dependsOn`) da task e dos níveis acima dela — story,
feature, epic —, as stories com `mustImplementFirst: true` e o `executionOrder`, e imprime uma linha
JSON. Concluída é a task com `status: "DONE"` — o valor que o
§ H (Mode B) grava. O schema da `spec-tasks` deixa `status` livre, com padrão `PENDING`; ausente ou
qualquer outro valor conta como aberto.

| `acao` (exit) | O que fazer |
|---|---|
| `seguir` (0) | Siga para a Fase 2. Se vier `antesNaOrdem`, diga no relato do blueprint (E4) que há tasks anteriores na ordem do backlog ainda abertas — é aviso, não bloqueio. |
| `perguntar` (1) | **Pare e pergunte** ao usuário, com a `mensagem` e os `pendentes` (dependência declarada aberta ou fora do backlog, story `mustImplementFirst` com task aberta, ou a própria task já `DONE`), se segue mesmo assim. Com o «sim», registre `DEPENDENCY_PENDING` e a decisão no `spec_story.md` (passo I) e na devolutiva (J). Execução desassistida: não comece; devolutiva do J em modo falha. |
| erro (2) | Task ou `tasks.json` não encontrados — o mesmo caminho do item 1 do C (alt). |

Nos dois modos, o `andamento.mjs conferir` lê o `status` no `tasks.json`: é ele, e não a issue, que
diz se a dependência terminou (o `§ H (Mode B)` grava `DONE` também em Mode A). Dependência aberta
leva à mesma pergunta.

**2. Abrir a US, na primeira task dela.** `outputs/spec/em-andamento.md` é o marcador da US aberta
(`.claude/rules/harness/deliver.md`): existe se e somente se há US em andamento. Quem o cria é esta
skill; quem o apaga é a `auditoria-de-us`, ao fechar a US (FATAL `MARKER_CLEARED` dela). Da raiz do
harness, nos dois modos:

```bash
node .claude/ferramentas/andamento.mjs abrir-us --us <US-ID> --repositorios <repo1,repo2> [--task <TASK-ID>]
```

- `--us`: o id da US como a `auditoria-de-us` vai chamá-la — o `story` que o `conferir` devolveu
  (Mode B) ou o id do work item User Story (Mode A).
- `--repositorios`: os nomes, no `workspace.md`, dos repositórios que a US toca
  (`node .claude/hooks/workspace.mjs --validar` lista as entradas). É desse campo que a
  `auditoria-de-us` tira quais deltas auditar.

O script copia `.claude/templates/em-andamento.md`, preenche o bloco `estado:us` e grava o marcador na
raiz de artefatos do workspace — o repositório de docs, onde o `delivery-gate` o procura.

| `acao` (exit) | O que fazer |
|---|---|
| `criado` (0) | **Commite o marcador** no repositório de docs, na branch da US, antes do primeiro commit de código: o `delivery-gate` lê a árvore do commit, não a pasta. |
| `ja-aberta` (0) | A US já estava aberta (task seguinte da mesma US). Siga. |
| `perguntar` (1) | Outra US está aberta. Pare e pergunte: o marcador é de uma US só, e sai na auditoria dela. |

Enquanto o marcador estiver na árvore, o `delivery-gate` nega o push. É o desenho: o push da US vem
depois da `auditoria-de-us`, que apaga o marcador ao aprová-la.

---

# FASE 2 — Projeto de testes (antes de qualquer código de produção)

> **Nada nesta fase escreve código de produção.** A saída é o **Test Blueprint**: a lista fechada
> do que precisa ser provado, em que camada, em que arquivo, com que dados.

## E1 — Descobrir a estratégia de testes nas rules

**Sempre procurar** — não assumir que a story dispensa teste porque não fala em teste.

**1. Localizar a regra de testes** no corpus de rules: `test-strategy.mdc` gerado pela
`spec-tech-rules` (versão ServiceNow), e as seções de teste de `conventions.mdc` /
`deploy-and-build.mdc`. Ler também `spec_story.md` (seção "Estratégia de testes do módulo").

**2. O que vale neste app**, salvo regra do projeto em contrário:

| Camada | Ferramenta | Onde nasce | Quando |
|---|---|---|---|
| **ATF de servidor** | `Test()` com passos `atf.server.*` | `app/src/fluent/tests/<STORY>.now.ts` | toda regra de negócio, ACL, script include, flow — caso positivo **e** negativo por regra |
| **ATF de form/list** | `Test()` com passos `atf.form.*` / `atf.list.*` (Client Test Runner) | o mesmo arquivo | UI Policy, Client Script, UI Action, campo obrigatório ou somente leitura |
| **Build** | `npx now-sdk build` | — | toda story: o build valida tipos e metadados do Fluent |
| **Install + contagem** | `npm run reinstall` | — | toda story: install na instância e contagem do seed contra `_contagem.json` |
| **Regressão** | suíte "cob-regressao" (`app/src/fluent/tests/suite.now.ts`) | — | rodada pelo `npm run reinstall` |

Não há unit test em Node para código de servidor da plataforma: a prova é o ATF na instância. Não
introduzir Jest, Vitest ou outro runner no app — é decisão de projeto (`NO_TEST_STACK_DECLARED` se a
rule não diz nada, e aí vale a tabela acima).

**3. Confirmar o ambiente.** `npm run doutor` verde (Node, `now-sdk`, credencial, Playwright). Sem
instância acessível, não há install nem ATF: parar e avisar, porque o `delivery-gate` não aceita a
story sem recibo.

**4. Dispensa de camada exige linha na matriz com motivo** (`TEST_LAYERS_FROM_RULES`). Exemplo:
story de menu não tem regra de servidor — a linha ATF de servidor fica "dispensada: menu sem lógica".

**5. Tirar a linha de base dos comandos — antes de qualquer código** (só no fio condutor, onde o G3
roda). Da raiz do harness, com os mesmos comandos que o G3 vai usar:

```bash
node .claude/ferramentas/validar.mjs linha-de-base --task <TASK-ID> --repo app --cmd-testes "npm --prefix .. run atf -- --story <STORY>" --cmd-build "npx now-sdk build"
```

Ela grava como cada comando sai **antes** da task e imprime o caminho do arquivo. No G3, esse arquivo
faz a falha que já existia deixar de bloquear — e só ela. Tirada depois do código, ela esconderia a
falha da própria task. Em lote, uma por task.

## E2 — Montar a matriz de cenários

**Não começar pelo caminho feliz.** Enumerar tudo que o work item implica, em uma tabela:

| ID | Categoria | Fonte | Camada | Arquivo::nome do teste | Dados (fixture) | Status |
|----|-----------|-------|--------|------------------------|-----------------|--------|

Categorias canônicas — as **cinco** que a `spec-tasks` emite em `acceptanceScenarios[].category`
(`HAPPY_PATH` · `INVALID_INPUT` · `BUSINESS_RULE_VIOLATION` · `AUTHORIZATION` · `EDGE_CASE`), mais
`EXTERNAL_SERVICE_FAILURE`, **planejada aqui** quando a task chama serviço externo ou fila. A Fase 8
não emite essa sexta categoria hoje: uma linha `EXTERNAL_SERVICE_FAILURE` é sempre de origem
`derived`, mesmo numa task estruturada.

Status: `PLANEJADO` → `ESCRITO` → `VERDE` / `VERMELHO` / `NÃO COBERTO (<motivo>)`.

**Vocabulário fechado da coluna `Fonte`** (cada linha usa exatamente um destes):

| Valor | Significa | Conta como |
|---|---|---|
| `AS-<id>` | veio de um `acceptanceScenarios[]` do work item | structured |
| `RN-<id>` | veio de `businessRules[].testScenarios[]` / `errorMessages{}` | structured |
| `EH-<chave>` | veio de `implementationGuidance.errorHandling{}` | structured |
| `UI-<estado>` / `UI-<campo>` | veio de `uiContext.estadosUI[]` / `uiContext.fields[]` | structured |
| `API-<status>` | veio de um status declarado em `apiContracts[]` | structured |
| `AC-<n>` | veio de um bullet de `acceptanceCriteria` sem cenário correspondente | structured |
| `TC-<nnn>` | veio de um caso do `test-plan.md` citado pela task (via `coverageNote`) | structured |
| `derived` | planejado aqui a partir da prosa (Caminho 2) ou categoria que a Fase 8 não emite | derived |
| `descoberto` | apareceu durante a implementação, depois do congelamento do blueprint | derived |

O cabeçalho do blueprint (E4) e o relatório de fechamento agregam nas duas últimas colunas:
`structured` / `derived` / `mista (N structured + M derived)`.

### Caminho 1 — o work item traz cenários estruturados (preferencial)

Popular a matriz a partir dos campos que a `spec-tasks` garante:

1. **Cada `acceptanceScenarios[]`** — já traz `category` e `testData` concreto (`request`,
   `mockedExternalResponse`, `expectedResponse`, `expectedDatabaseState`, `expectedEvents`).
   **Usar esse `testData` como fixture e asserção do teste** — não inventar dado mais leve nem
   "simplificar" o payload. `verificationSteps` viram as asserções; `relatedRules` amarram a linha
   à regra de negócio.
2. **Cada `businessRules[].testScenarios[]`** — uma regra com condição negativa (suas
   `implementation.errorMessages{}`, chaves UPPERCASE) **não está implementada** enquanto não
   houver teste provando que a violação é rejeitada **com aquela mensagem exata**.
3. **Cada `implementationGuidance.errorHandling{}`** (a `spec-tasks` garante ≥3 por task) — um
   teste por `scenario`, asseverando o `action`/`userImpact` documentado.
4. **`implementationGuidance.testingStrategy{}`** — quando presente, lista os testes que a Fase 8
   já previu (`unitTests[]` é a única subchave que a `spec-tasks` garante por nome; as demais
   camadas — integração, contrato, e2e, carga — aparecem conforme o projeto). É **piso, não teto**:
   fundir com as camadas decididas em E1; conflito → vence a união dos dois.
5. **`uiContext` (task de UI derivada do flow-map)** — cada estado em `uiContext.estadosUI[]`
   (`vazio`, `carregando`, `erro`, …) é **cenário obrigatório**, um por estado. As
   `uiContext.regras[]` (RN-xxx) **reforçam** as linhas `BUSINESS_RULE_VIOLATION`: toda RN citada
   ali precisa de cenário de violação na matriz.
6. **`uiContext.fields[]`** (a `spec-tasks` o exige em toda task de UI, com `name`, `type`,
   obrigatoriedade e `options[]`/`optionsSource`) — é a fonte mais rica de `INVALID_INPUT`: campo
   obrigatório ausente, tipo errado, valor fora da lista de opções. Ao menos uma linha por classe de
   violação que o inventário de campos permite.
7. **`apiContracts[]` (compact-prose)** — para cada status de resposta declarado (2xx, 4xx, 5xx),
   deve existir linha na matriz. Um 4xx documentado sem teste é cobertura ausente, não detalhe.
8. **`acceptanceCriteria` — todo bullet precisa de destino.** Um critério de aceite que **não** tem
   `acceptanceScenario` correspondente vira **linha própria** na matriz (`Fonte: AC-<n>`), resolvida
   como cenário automatizado, passo manual (`MANUAL_QA_REMAINING`) ou check de build/lint. É o caso
   típico da task `class=security`, cuja âncora é `implementationGuidance.security{}` +
   `acceptanceCriteria`, e não `acceptanceScenarios[]`.

Preencher a coluna `Fonte` com o vocabulário fechado acima.

### Caminho 2 — o work item NÃO traz cenários estruturados

Vale para task antiga, work item de Mode A sem `tasks.json`, Bug, ou task escrita à mão.
**Aqui a skill PLANEJA os cenários** — não é motivo para pular a matriz. Derivar da descrição, dos
critérios de aceite e de qualquer regra em prosa, com este **piso mínimo**:

- **1 `HAPPY_PATH`** — o fluxo documentado com dados válidos.
- **1 `INVALID_INPUT`** — payload malformado, campo obrigatório ausente ou tipo errado.
- **1 `BUSINESS_RULE_VIOLATION` por condição negativa explícita** no texto ("não pode", "deve",
  "obrigatório", "somente se", "apenas quando", "must", "cannot", "only if") — o teste viola a
  condição e assevera **o erro documentado**, não um 4xx genérico.
- **1 `AUTHORIZATION`/ownership** — quando o recurso pertence a um usuário/tenant, um teste que
  tenta ler/alterar recurso de outro dono e assevera a negativa (alinhar com `security.mdc`,
  Camada B — IDOR). Dispensar **apenas** se a task não tem recurso por dono, e dizer isso na linha.
- **1 `EDGE_CASE`** — entrada vazia/nula, limite de tamanho, duplicidade, ou escrita concorrente
  quando a task toca estado mutável compartilhado.
- **1 `EXTERNAL_SERVICE_FAILURE`** — quando a task chama serviço externo/fila: timeout ou resposta
  de erro, asseverando o comportamento documentado (retry, fallback, erro propagado).

**Inventar os dados que faltam, explicitamente.** Sem `testData` pronto, construir fixtures
concretas a partir do modelo de dados/contratos que a própria task declara (`persistenceModel`,
`apiContracts`) e **registrar na matriz** que a massa foi construída aqui. Fixture com placeholder
(`"TODO"`, `"xxx"`, `"a definir"`) não conta como cenário coberto.

Marcar toda linha assim derivada com `Fonte: derived` → dispara `SCENARIOS_DERIVED_FROM_TEXT`
(WARNING): a cobertura é *best-effort*, não garantida pela spec.

> **Não confundir com a `spec-test-plan`.** O `test-plan.md` (Fase 8a) é homologação de negócio,
> executada por pessoa. A matriz desta skill é técnica e automatizada. Quando a `spec-tasks` deriva
> um cenário de um caso de homologação, ela registra o ID em `acceptanceScenarios[].coverageNote`
> (ex.: `"Cobre TC-004 do plano de testes"`) — extrair o `TC-NNN` dali e usá-lo na coluna `Fonte`
> (`TC-004`). É o que permite rastrear homologação ↔ teste automatizado.

### Categoria que não se aplica

Escrever a linha assim mesmo, com a categoria, `NÃO COBERTO` e o motivo
(`SCENARIO_CATEGORY_SKIPPED`, WARNING). **Nunca** omitir a categoria em silêncio — a diferença
entre "não se aplica" e "esqueci" é exatamente o que se perde na omissão.

## E3 — Mapear cenário → camada → arquivo::nome do teste

Cada linha da matriz recebe, **antes de existir código**:

1. **Camada** — da tabela de E1 (ATF de servidor ou ATF de form/list). Um cenário pode aparecer nas
   duas; nesse caso, uma linha por camada.
2. **Arquivo::nome do teste** — `app/src/fluent/tests/<STORY>.now.ts::<chave Now.ID do Test()>`.
   Ex.: `app/src/fluent/tests/US-MOD-F2-001.now.ts::US-MOD-F2-001_atf_versao_publicada_imutavel_negativo`.
3. **Fixture** — o `testData` do cenário, sobre registros do seed fictício (o registro demo da tela,
   `Now.ID['<TEL>_registro_demo']`, ou um criado pelo próprio teste).

**Escolher a camada mais barata que ainda prova o cenário.** Regra de servidor se prova em
`atf.server.*`, não abrindo o form; só o que o navegador executa (UI Policy, Client Script) vai para
`atf.form.*`.

## E4 — Congelar e reportar o Test Blueprint

O **Test Blueprint** é a matriz de E2 completa com as colunas de E3 preenchidas, mais o cabeçalho:

```
Test Blueprint — TASK-XXX
Stack: <runner> | Integração: <ferramenta> | Cobertura: <ferramenta> @ <threshold> | E2E: <ferramenta ou N/A> | Carga: <ferramenta ou N/A>
Fonte dos cenários: structured | derived | mista (N structured + M derived)
Camadas aplicáveis a esta task: <lista> | Dispensadas: <camada — motivo>
Cenários: N (HAPPY_PATH=a, INVALID_INPUT=b, BUSINESS_RULE_VIOLATION=c, AUTHORIZATION=d, EDGE_CASE=e, EXTERNAL_SERVICE_FAILURE=f)
```

**Gate `TEST_BLUEPRINT_BEFORE_CODE` (FATAL):** o blueprint existe, com camada e `arquivo::nome`
preenchidos em toda linha, **antes** da primeira edição em código de produção.

**Reportar o blueprint ao usuário em chat** antes de implementar (é barato e é onde o usuário
corrige o rumo com o menor custo). **Não** bloquear esperando aprovação — seguir direto para a
Fase 3 — **exceto** quando: o usuário pediu confirmação explícita; a derivação produziu zero
cenários; ou a task é ambígua a ponto de o caminho feliz não ser determinável. Nesses casos,
**parar e perguntar**.

## Classes de task e o blueprint

| `class` da task | O que esperar |
|---|---|
| `functional` (padrão) | Blueprint completo. `acceptanceScenarios[]` + `businessRules[].testScenarios[]` + `errorHandling{}` são a fonte; ausência é defeito da Fase 8 → cair no Caminho 2 e sinalizar. |
| `security` (injetada por `spec-security-review`) | O conteúdo âncora é `implementationGuidance.security{}` + `acceptanceCriteria`. `acceptanceScenarios[]` pode não existir — **derivar** cenários de ataque/negação a partir da regra de segurança citada (o caso negativo é o ponto da task). |
| `uat` *(legado)* | **Não gera testes automatizados.** É roteiro de homologação humana. A `spec-tasks` **não gera mais** esta classe (`NO_UAT_BACKLOG`); se um backlog antigo trouxer uma, reportar isso e apontar o `test-plan.md`/executor humano. |
| `spike` | Sem blueprint de produção. A saída é a investigação documentada; registrar no `spec_story.md` e reportar. |
| story gerada (`snArtifact.kind` = `table`, `form`, `list`, `menu`, `role` ou `seed`) | O objeto já veio do `sn-scaffold`. O blueprint cobre o que a story promete na tela (campo obrigatório, choice, papel que vê o registro) com ATF; G3 dispensado pela isenção `g3` (§ G2b). |

---

# FASE 3 (passo F) — Implementação guiada pelo blueprint

1. **Onde escrever.** O código mora em `app/` (repositório único). O `snArtifact` da task diz o
   tipo e o arquivo; sem ele, a pasta segue o tipo do objeto:

   | `snArtifact.kind` | Arquivo |
   |---|---|
   | `table`, `seed`, `simulation` | `app/src/fluent/tables/`, `seed/`, `simulations/` |
   | `form`, `list`, `report` | `app/src/fluent/ui/` |
   | `menu` | `app/src/fluent/navigation/` |
   | `role`, `acl` | `app/src/fluent/security/` |
   | `business_rule`, `client_script`, `ui_policy`, `ui_action`, `script_include`, `flow`, `notification` | `app/src/fluent/<tipo>/` (`.now.ts`), com o corpo do script em `app/src/server/` quando passa de poucas linhas |
   | `atf` | `app/src/fluent/tests/<STORY>.now.ts` |

   O `nowId` da task é a chave `Now.ID[...]` que o registro **tem** de usar — é ela que o rastreio
   (`traceability.json`) procura em `app/src` e no `keys.ts`.
2. **Consultar o SDK antes de cada tipo de objeto** (`SDK_DOC_CONSULTED`):
   `npx now-sdk explain --list` → `npx now-sdk explain <tópico> --peek` → tópico completo. Não
   escrever API de Fluent de memória.
3. **Aplicar as rules:** ler todas as rules do projeto, mais `servicenow-ui.md` (Core UI clássica:
   `Form()` em seções de uma ou duas colunas, UI Policy antes de Client Script, UI Action para as
   ações de tela; nada de Workspace, Portal ou UI Builder) e `security.md` (ACL por tabela, campo e
   operação; `GlideRecordSecure` em código chamado pelo cliente; script include client-callable só
   com ACL; role mínima).
4. **A story é a fonte única de verdade.** Implementar estritamente pela descrição, critérios e
   cenários da story. **Não** ler `data-model.json` como entrada primária; abri-lo só como
   conferência opcional quando a story o cita. Em conflito, **a story vence** — implementar pela
   story e **reportar a divergência** no comentário da issue (passo H).
5. **O blueprint é o contrato de trabalho.** Toda mudança em código de produção deve ser rastreável
   a pelo menos uma linha da matriz. Código sem linha correspondente é escopo extra — remover ou
   justificar.
6. **Testabilidade é requisito, não consequência.** Se uma linha do blueprint não é testável no
   desenho escolhido (lógica presa num business rule que o ATF não alcança, efeito sem ponto de
   observação), **o desenho está errado** — extrair a lógica para um script include testável por
   `atf.server.*`, em vez de rebaixar a linha para "não coberto". Ajuste feito → registrar
   `TESTABILITY_REFACTOR` (WARNING) e a decisão no `spec_story.md`.
7. **RED→GREEN — obrigatório para Bug, recomendado no resto.**
   - **Story de correção de defeito:** o `Test()` que reproduz o defeito é escrito **antes** do fix,
     falhando (recibo `failure`) e passando depois (recibo `success`). Defeito vindo de homologação
     → a skill certa é a **`spec-debug-fix`**.
   - **Demais tasks:** recomendado nas linhas de alto risco — violação de regra, autorização.
8. **Sem escopo extra:** não refatorar módulos não relacionados nem acrescentar o que a story não
   pede. **Nunca apagar** `Table()`, `BusinessRule()` ou `Record()` sem confirmar com o usuário.
9. **Cenário descoberto durante a implementação:** adicionar linha à matriz com
   `Fonte: descoberto na implementação` e cobri-la como qualquer outra
   (`SCENARIO_ADDED_DURING_IMPLEMENTATION`, WARNING).

---

# FASE 4 — Provas (escrever, rodar, medir)

## G1 — Escrever os testes do blueprint

O teste da story é **ATF**, escrito em Fluent: `Test()` em `app/src/fluent/tests/<STORY>.now.ts`,
um por regra, com caso positivo **e** negativo (`atf-guide.md` do SDK — consultar
`npx now-sdk explain atf --peek` antes). Para cada linha da matriz:

1. Abrir ou criar `app/src/fluent/tests/<STORY>.now.ts`. O `$id` de cada `Test()` é
   `Now.ID['<STORY>_atf_<regra>_<positivo|negativo>']`: é por essa chave que o `atf.mjs` acha o
   `sys_id` no `keys.ts`.
2. Escrever os passos com a fixture da matriz: `atf.server.*` para regra de servidor (business rule,
   script include, ACL por impersonate do usuário demo do papel); `atf.form.*` / `atf.list.*` para o
   que só a tela mostra (UI Policy, Client Script, UI Action). Passo de UI faz o `atf.mjs` abrir o
   Client Test Runner.
3. Asseverar **o comportamento documentado**, não um genérico:
   - violação de regra → a mensagem exata de `errorMessages{}` (o `gs.addErrorMessage` ou o
     `setAbortAction` com o texto);
   - persistência → `expectedDatabaseState` conferido por `atf.server.recordValidation` em todas as
     tabelas afetadas;
   - autorização → o registro que o papel **não** pode ver/alterar, testado com impersonate;
   - estado de UI → o campo obrigatório, oculto ou somente leitura declarado em `uiContext`.
4. Acrescentar o `Test()` à suíte "cob-regressao" (`app/src/fluent/tests/suite.now.ts`, criada pelo
   `sn-scaffold`), para o `npm run reinstall` rodá-lo junto da regressão.
5. Dados: só do seed fictício. CPF/CNPJ novo num teste precisa estar em
   `app/src/fluent/seed/_documentos.json` — o `reinstall.mjs` para (exit 5) se não estiver.
6. Atualizar o Status da linha para `ESCRITO`.

## G2 — Rodar (build, install, ATF)

Na ordem:

1. **Commitar `app/src/fluent`** (e `app/src/server`, se mudou). O `fecho-explore` e o
   `delivery-gate` comparam o commit da linha de install com `git log -1 --format=%H -- app/src/fluent`:
   install feito antes do commit não conta.
2. **Instalar:**

   ```bash
   npm run reinstall
   ```

   Prefixo, documentos do seed, poda do `keys.ts`, `now-sdk build`, `now-sdk install`, contagem por
   tabela e suíte "cob-regressao", e a linha `now-sdk-install` no `outputs/spec/sync-log.md`
   (Decisões = `ok; <n> registros`, Outputs = o commit). O build atualizou o `keys.ts`? Commitar e
   rodar de novo, para a linha levar o commit certo. Qualquer `falha-*` → corrigir e repetir; não
   seguir com install quebrado.
3. **ATF da story:**

   ```bash
   npm run atf -- --story <STORY>
   ```

   Roda os `Test()` de `app/src/fluent/tests/<STORY>.now.ts` e grava o recibo
   `outputs/spec/auditorias/atf/<STORY>.json` (`sys_id`, `resultId`, `status`, `horario`, `commit`,
   detalhe por teste). Saída 0 = tudo passou; 1 = algum teste falhou; 2 = erro de uso ou
   configuração (credencial, `keys.ts` sem o teste — rode o reinstall antes). `<STORY>` é o mesmo ID
   do relatório de auditoria da US (`outputs/spec/auditorias/US-*.md`). Flags em
   [`scripts/README.md`](scripts/README.md).
4. **Commitar o recibo** junto com a story: o `delivery-gate` lê o recibo, nunca a instância.

Atualizar cada linha da matriz para `VERDE` ou `VERMELHO`, pelo detalhe do recibo.

**Se algo falha:** a issue não muda, a task não vai para `DONE`. Corrigir, ou registrar o bloqueio
no comentário da issue (passo H, item 2).

## G2b — Validação conforme o tipo da story

O G3 com validadores LLM custa caro e roda **só no fio condutor**. Build + install e ATF de servidor
valem para todas as stories:

| Story | G3 com LLM | build + install | ATF servidor | ATF form |
|---|---|---|---|---|
| fio condutor (label `fio-condutor`) | sim | sim | sim | sim (desfecho A do item 9) |
| gerada (tabela, form, list, menu, role, seed) | não: isenção `g3` | sim | sim | sim |
| outra feita à mão | não: isenção `g3` | sim | sim | sim |

O desfecho A do item 9 (`ORIGEM.md`) mostrou que teste de servidor e de form rodam pela linha de
comando: o `atf.mjs` abre o Client Test Runner sozinho quando a story tem passo de UI. A isenção
`atf-form` existe só para quando o runner não sobe nesta instância (propriedade
`sn_atf.runner.enabled` desligada, PDI nova) — e aí o teste de form roda à mão no Client Test Runner
antes da demo.

**Isenção por story.** Um arquivo por story e tipo, em
`outputs/spec/auditorias/_isencoes/<STORY>-<tipo>.md`, com o bloco abaixo (comentário HTML, campos
preenchidos de verdade):

```markdown
<!-- gate:isencao-story -->
story: <ID da story>
tipo: g3|atf-form
autor: <quem decidiu>
data: <AAAA-MM-DD>
motivo: <por que esta story dispensa o G3 ou o ATF de form>
<!-- /gate:isencao-story -->
```

- `g3`: dispensa só os validadores LLM desta story. Build, install e ATF continuam obrigatórios.
- `atf-form`: dispensa só o recibo de ATF de form desta story; o de servidor continua.
- Uma isenção não isenta a fase nem outra story. **Não** usar o bloco `gate:isencao` de fase
  (`.claude/templates/isencao.md`) para isso: aquele isenta o gate inteiro.

O `delivery-gate` exige, para o push: a última linha `now-sdk-install` do `sync-log.md` com
Decisões começando em `ok` e Outputs = `git log -1 --format=%H -- app/src/fluent`; e o recibo
`outputs/spec/auditorias/atf/<STORY>.json` com `status: "success"` e commit igual ou posterior ao
último de `app/src/fluent` — ou a isenção `atf-form` da story.

## Reportar a matriz

O relatório de fechamento (comentário na issue em Mode A, chat em Mode B) **deve** trazer a matriz
condensada:

```
Cobertura de cenários — TASK-XXX
Total: N | Verdes: a | Vermelhos: b | Não cobertos: c
Por categoria: HAPPY_PATH a/a · INVALID_INPUT b/b · BUSINESS_RULE_VIOLATION c/c · AUTHORIZATION d/d · EDGE_CASE e/e · EXTERNAL_SERVICE_FAILURE f/f
Camadas criadas: unit(N) · integração(N) · contrato(N) · E2E(N) · carga(N)
Cobertura: X% (threshold Y%)
Não cobertos: <ID> — <motivo> ; <ID> — <motivo>
Fonte dos cenários: structured | derived | mista
```

A matriz fica registrada em dois lugares duráveis — o **bloco Testes** do `spec_story.md` e o
comentário do work item — para que a `spec-code-audit` (Fase 12, Passo A.9, que lê o `spec_story.md`)
e qualquer revisor humano confiram cobertura sem re-derivar tudo do zero. **A auditoria continua
independente:** ela redescobre a cobertura a partir do código real; a matriz é ponto de comparação,
nunca substituto da verificação dela.

## G3 — Validação independente: validar, corrigir, revalidar

**Por quê.** Até aqui, quem escreveu o código também escreveu os testes e marcou VERDE. O G3 traz uma
validação que não depende de quem implementou:

- as perguntas saem do work item, por código;
- antes de qualquer modelo, uma varredura por código acha o que regra fixa pega (segredo, dado
  pessoal em log, HTML cru, SQL montado, erro engolido, consulta em laço, `fetch` na tela);
- até seis validadores, cada um com contexto limpo, julgam a entrega em um turno;
- outro agente corrige o que bloqueia, só nos arquivos dos itens;
- a validação roda de novo, só sobre o que a correção mudou, até zero bloqueantes.

Bloqueia CRÍTICO e ALTO. MÉDIO e BAIXO **não são avaliados no G3** — quem os cobre é a
`auditoria-de-us` (veredito APROVADA COM RESSALVAS, débito em `gaps-document.md`). Nenhum agente fixa
modelo: todos herdam o da sessão, em qualquer ferramenta.

**Quem decide cada passo é o script** — você só executa a ação que ele imprime.

**Quando.** Depois do G2 verde, antes do H, nos dois modos — **só nas stories do fio condutor**
(label `fio-condutor`, RF listados em `inputs/fio-condutor.md`). Nas demais, o G3 é dispensado pela
isenção `g3` do § G2b.

**Pré-requisitos.**

- O `tasks.json` local, porque é dele que o script tira as perguntas.
- Para o ciclo completo, um ambiente com subagentes — Claude Code ou Cursor —, com os agentes de
  `.claude/agents/` carregados. Eles só aparecem numa sessão aberta depois de instalados.
  - **No Cursor o campo `tools:` dos agentes é ignorado**: a restrição de ferramentas (validador só
    lê e grava o próprio resultado) vale só no Claude Code. Quem garante que o validador não mexeu em
    nada é a guarda do `validar.mjs`, que recusa a rodada que alterou arquivo fora da pasta de trabalho.
  - O `omitClaudeMd: true` dos agentes é campo do Claude Code 2.1.295 ou mais novo; versão anterior,
    Cursor e Kiro o ignoram.

**Sem subagente** (Kiro, Cowork, ou a ferramenta de subagente indisponível na sessão): **não pule o
G3** — rode-o com `--sem-agentes`. A parte determinística decide sozinha (comandos, varredura,
mensagens de erro), nenhuma ação dispara agente, e o `corrigir` é seu: você corrige e roda `avancar`.
O relatório registra `"modo": "sem-agentes"` e as dimensões que ficaram sem validador.

Só **sem `tasks.json` local** (Mode A sem o arquivo): pule o G3, registre `VALIDACAO_INDISPONIVEL` e
siga. Nesse caso a `auditoria-de-us` continua sendo a barreira.

**Timeout.** `iniciar` e `avancar` rodam os comandos do projeto (testes, cobertura, lint) e o Semgrep
e o gitleaks quando instalados — pode levar minutos. Rode os dois **com timeout alto** (no Bash do
Claude Code, `timeout: 600000`) ou **em segundo plano**, esperando terminar. O script grava o
`estado.json` antes de cada comando longo: **se o processo cair** (timeout, sessão fechada), rode
`avancar` de novo — ele retoma de onde parou. Não rode `iniciar` de novo para "destravar": ele
recomeça do zero e limpa a pasta de trabalho.

**O laço.**

1. Rode da raiz do harness, com os comandos que você confirmou no E1:

   ```bash
   node .claude/ferramentas/validar.mjs iniciar --task <TASK-ID> --repo <pasta do código> --base <ref> --linha-de-base <arquivo> --cmd-testes "<comando>" [--cmd-cobertura "<comando>"] [--cmd-lint "<comando>"] [--cmd-build "<comando>"] [--shell bash|cmd|powershell] [--sem-agentes] [--regras-frontend auto|sim|nao]
   ```

   **No app ServiceNow** (só stories do fio condutor — § G2b), a linha concreta é:

   ```bash
   node .claude/ferramentas/validar.mjs iniciar --task <TASK-ID> --repo app --base <ref> --linha-de-base <arquivo> --cmd-build "npx now-sdk build" --cmd-testes "npm --prefix .. run atf -- --story <STORY>" --regras-frontend auto
   ```

   É o `--cmd-build "npx now-sdk build"` e o `--cmd-testes "npm run atf -- --story <ID>"` do design
   (item 29). O `validar.mjs` roda os comandos **dentro** de `--repo` (`app/`), onde o
   `package.json` não tem o script `atf`: por isso o `--prefix ..`, que chama o `npm run atf` da raiz.
   `--regras-frontend auto` liga as regras da varredura que a rule `harness/servicenow-ui.md`
   sustenta para `.now.ts` (as de Next.js — `fetch` na tela, formatação no JSX — não se aplicam
   aqui). O ATF roda contra a instância: o corretor que mudar
   `.now.ts` precisa de `npm run reinstall` antes da rodada seguinte, e o `--cmd-testes` não instala —
   ao receber `corrigir`, depois do corretor, rode `npm run reinstall` e só então `avancar`.

   `--base` é a referência de antes da task: o commit de onde a branch saiu, ou `HEAD` se nada da
   task foi commitado.

   `--linha-de-base` é o arquivo que o passo 6 do E1 gravou, com os **mesmos** comandos. A falha de
   comando igual à da linha de base vai para `preExistentes` no relatório, não bloqueia e não vai
   para o corretor: reporte-a como `VALIDACAO_FALHA_PRE_EXISTENTE`. Sem linha de base, toda falha de
   comando bloqueia.

   `--cmd-build` é o build que o G2 rodou. Ele roda de novo a cada rodada, depois do corretor.

   No Windows os comandos rodam no **Git Bash** (o mesmo shell do G2), nunca no bash do WSL;
   `--shell cmd|powershell` força outro. O relatório registra o shell usado.

   `--cmd-testes` é o comando **completo** de testes do projeto, nunca um arquivo só. O corretor cria
   testes novos, e o teste que o comando não roda fica fora da checagem por código. Comando que não
   existe no projeto não é passado (`--cmd-lint ""` também vale): o relatório o lista em
   `naoInformados`.

   `--regras-frontend` liga ou desliga as duas regras da varredura que só a rule de frontend Next.js
   sustenta (`fetch` na tela, formatação no JSX). O padrão `auto` as liga quando a rule de frontend do
   harness existe e nenhuma rule de frontend do projeto (raiz de `.claude/rules/`) fala de outra stack.
2. O script imprime **uma linha JSON**. Execute a ação dela:

   | `acao` | O que fazer |
   |---|---|
   | `validar` | Dispare **todos** os `agentes` numa única mensagem, em paralelo. Use a ferramenta de subagente do ambiente — no Claude Code, Agent com `subagent_type` igual ao `tipo`; no Cursor, o subagente de nome igual ao `tipo` — e o prompt `Leia <entrada> e siga.` Se o item trouxer `problema`, acrescente `Da última vez: <problema>.` Espere todos terminarem. |
   | `corrigir` com `agente: "corretor"` | Dispare **um** agente `corretor` com o prompt `Leia <entrada> e siga.` |
   | `corrigir` com `executor: "sessao"` (`--sem-agentes`) | Leia a `entrada` e corrija **você mesmo**: teste que falha antes, correção, teste que passa, só nos arquivos do escopo dela. A mesma guarda vale. |
   | `fim` | Veredito APROVADO. Siga para o H (em Mode B, o § H (Mode B)). Com `semAgentes: true`, registre no H e no I que só a parte determinística validou. |
   | `parar` | O ciclo não fechou; o motivo está no JSON e no relatório. **Não** mude o estado do work item. Nesta ordem: (a) comente no work item os bloqueantes e o motivo, com o estado inalterado — o mesmo caminho do G2 quando uma validação falha (Mode B: no relatório da task); (b) faça a devolutiva do J em modo falha; (c) se `editadosPeloCorretor` não está vazio, mostre ao usuário o diff desses arquivos e pergunte se mantém ou descarta — nunca descarte sozinho; (d) em lote, não comece a próxima task em cima desta: espere a decisão. |

3. Depois de cada `validar` ou `corrigir`, rode:

   ```bash
   node .claude/ferramentas/validar.mjs avancar --task <TASK-ID> --tokens <tipo>=<subagent_tokens>,<tipo>=<subagent_tokens>
   ```

   O `--tokens` leva o `subagent_tokens` do rodapé de cada agente: é o registro de custo do ciclo.
4. Repita os passos 2 e 3 até `fim` ou `parar`. Depois deles, `avancar` só repete a ação final.

**O que você NÃO faz no G3.** É isso que mantém a validação independente:

- não abre os arquivos de entrada nem os resultados: passa só o caminho;
- não corrige nada durante o ciclo: quem corrige é o `corretor` (com `--sem-agentes`, você corrige
  só quando a ação é `corrigir`, e só o que a entrada dela pede);
- não reinterpreta achado, não rebaixa severidade e não pula ação.

**Relatório.** Fica em `outputs/spec/auditorias/<TASK-ID>.validacao.json` e traz:

- o veredito e o histórico das rodadas;
- os bloqueantes, os incertos e os descartados (evidência que não conferiu no disco);
- `preExistentes`: as falhas de comando iguais às da linha de base, que não bloquearam;
- `naoCorrigidos`: o que o corretor recusou e por quê (refatoração, dependência nova, item que ele
  acha errado). Se ele recusa tudo sem mudar nada, o ciclo para ali, com esse motivo;
- `medioEBaixo`: a declaração de que MÉDIO e BAIXO não são avaliados no G3 — a ausência de achado
  médio no relatório não diz nada sobre o código;
- as ferramentas da varredura determinística (a própria, e Semgrep e gitleaks quando instalados) e
  se as regras de frontend Next.js estavam em vigor;
- o modo (`com-agentes` ou `sem-agentes`), o shell, os comandos rodados, os não informados e os tokens.

Evidência de segredo sai **mascarada** no relatório e na entrada do corretor (prefixo de 4
caracteres + `****`): o arquivo e a linha bastam para corrigir.

No H e no I, cite o veredito, as contagens, as falhas pré-existentes e que MÉDIO e BAIXO não foram
avaliados no G3.

---

## H — Print, comentário na issue e status

Depois do G2 verde, do § G2b cumprido e, no fio condutor, do G3 em `fim` (ou pulado com
`VALIDACAO_INDISPONIVEL` registrado). Com o G3 em `parar`, só o passo 2 roda — o comentário leva os
bloqueantes e o motivo — e a issue fica como está (ver a linha `parar` do G3).

1. **Print da tela na instância**, quando a story tem tela (`uiContext.screenshot` ou `TEL-` nos
   `sourceRefs`):

   ```bash
   npm run capture -- --story <STORY>
   ```

   O `sn-capture` entra como admin, faz *impersonate* do usuário demo do papel da tela e grava
   `outputs/spec/screens/deliver/<STORY>-<TEL>.png`. Commitar os PNGs: o comentário os referencia
   por permalink do commit (`blob/<sha>/outputs/spec/screens/deliver/<STORY>-<TEL>.png?raw=1`).
   Falhou uma rota → `CAPTURE_FAILED` (WARNING) e o comentário diz qual.

2. **Comentário na issue** (Mode A; o número vem de `outputs/spec/id-map.json`, chave = ID da story):

   ```bash
   gh issue comment <número> --body-file <arquivo>
   ```

   O corpo leva:
   - os arquivos `.now.ts` e de `app/src/server/` criados ou alterados, cada um com o papel dele;
   - o **Test Blueprint** (cabeçalho do E4) e a **matriz condensada** (§ Reportar a matriz), com
     toda linha não coberta e o motivo;
   - o resultado do `npm run reinstall` (a linha do `sync-log.md`) e o recibo do ATF (`status`,
     `resultId`, `commit`), ou a isenção registrada;
   - o veredito do G3 (fio condutor) ou a isenção `g3`;
   - os prints por permalink e o commit;
   - divergência com o `data-model.json`, se a conferência opcional achou alguma.

   Antes de publicar, passar o corpo pelo `check_sensivel.py --stdin`: score ≥ 40 não publica.
   Sem `gh` autenticado → `ISSUE_COMMENT_FAILED` (WARNING) e o corpo vai no chat.

3. **A issue não é fechada aqui.** Quem fecha a US é a `auditoria-de-us`, depois da última task.

## H (Mode B) — Status da task no `tasks.json`

Nos dois modos, o `status` da task no `tasks.json` é o que o `conferir` (§ D2) da próxima task lê.
Com o G2 verde, o § G2b cumprido e o G3 em `fim` (ou a isenção `g3`), da raiz do harness:

```bash
node .claude/ferramentas/andamento.mjs concluir --task <TASK-ID> [--tasks outputs/spec/tasks.json]
```

O script confere o relatório do G3 (`outputs/spec/auditorias/<TASK-ID>.validacao.json`). Só com
veredito APROVADO, e da mesma task, ele grava `status: "DONE"` — muda só esse campo e mantém a
indentação e o fim de linha do arquivo. Task `spike` conclui sem G3: a entrega dela é uma decisão,
não código. Fora do fio condutor (isenção `g3`), não há relatório do G3: o `concluir` recusa, e o
status é gravado à mão no `tasks.json` (`"status": "DONE"`), citando a isenção no I e no J.

- `concluida` / `ja-concluida` (exit 0): siga para o I. Cite no I e no J que a task ficou `DONE`.
- `recusar` (exit 1): nada foi gravado. Com o G3 em `parar` é o esperado. Fora disso, o `motivo` diz
  o que falta (relatório ausente, de outra task, ou veredito que não é APROVADO).

---

## I — Update spec_story.md (module memory)

Depois do H, atualizar o `spec_story.md` da pasta do código (`app/spec_story.md`):

### If spec_story.md already exists
Prepend a new entry to the **Histórico de tasks** section (most recent first), immediately
after the `## Histórico de tasks` heading, using the entry structure of the canonical template
`./templates/spec_story.template.md`.

O bloco **Testes** é obrigatório e traz a **matriz condensada** (§ Reportar a matriz) mais os
arquivos de teste criados. É o único registro persistente que uma task futura (ou a
`spec-code-audit`) tem do que foi **provado** versus **assumido**.

Se esta task **descobriu ou fixou** algo sobre o stack de testes do módulo (runner, comando,
localização, fixture/factory reutilizável, Testcontainers configurado), registrar na seção
**Estratégia de testes do módulo** — é o que evita a próxima task redescobrir tudo em E1.

If any decision in this task establishes a **recurring pattern** (naming convention, architectural choice, cross-cutting rule), also add it to the **Padrões estabelecidos** section.

### If spec_story.md does not exist
Create it at the root of the code folder from the canonical template
`./templates/spec_story.template.md`, then add the entry per above.

### Rules for this step
- **Never** overwrite or delete existing entries.
- **Never** modify existing **Padrões estabelecidos** items — only append new ones.
- **Never** create `spec_story.md` outside the module's code folder (never at the workspace root).
- The file is **append-friendly**: new entries go at the top of the history, below the patterns section.
- Use **Português do Brasil** for all human-readable content.
- Keep entries **factual and terse** — future agents read this, not humans reviewing style.
- If the task touched multiple code folders, create/update the `spec_story.md` in **each** of them.

### On-demand maintenance (owned by this skill)

Maintaining `spec_story.md` is **this skill's responsibility** (a `spec-debug-fix` também escreve nele ao fechar um bug, no mesmo formato) — there is no separate
skill for it. Besides the automatic read (passo B) and update (passo I) around each task, the user
may ask for these operations directly, and this skill handles them against the module's
`spec_story.md` using the same template and hard rules above:

- **`view`** — read and display the full `spec_story.md`, highlighting **Padrões estabelecidos** at the top.
- **`init`** — create `spec_story.md` from the template for a module that has none (never overwrite an existing one without explicit confirmation).
- **`add-entry`** — insert a new task entry at the top of **Histórico de tasks**; if it establishes a recurring pattern, ask before also adding to **Padrões estabelecidos**.
- **`add-pattern`** — append a new item to **Padrões estabelecidos**.
- **`edit-entry`** — locate an entry by task id and **correct or complement** it; never remove listed **Implementado** items (mark as superseded instead) and append the suffix `(editado YYYY-MM-DD: motivo)`.

---

## J — Devolutiva em chat (obrigatória, nos dois modos)

**Toda execução termina com uma explicação em chat, em português simples, do que foi feito e de
como foi feito.** Não é resumo do comentário da issue nem cópia da matriz: é a tradução do trabalho
para quem precisa entendê-lo sem ter acompanhado a implementação.

**Público-alvo (escrever para estas duas pessoas, literalmente):**

- **Uma pessoa NÃO técnica** — o PO, o gestor, o cliente — que nunca leu código. Ela precisa sair da
  leitura sabendo **o que o sistema passou a fazer**, **quais decisões técnicas foram tomadas e por
  quê**, e **o que cada decisão custa ou deixa de fora**. É para ela a seção "As decisões técnicas,
  sem jargão", e é ela quem dita o tom do texto inteiro.
- **Um desenvolvedor que acabou de chegar no projeto**, conhece pouco da stack e nada do negócio. Ele
  precisa saber **por onde o código faz isso**. É para ele a seção "Como foi feito".

Se uma frase só fizer sentido para o desenvolvedor, ela pertence a "Como foi feito" — nunca às
seções de negócio e de decisões.

**Por que existe:** o comentário do work item é registro de auditoria — dita para quem já conhece o
contexto. O `spec_story.md` é memória para o próximo agente. Nenhum dos dois é uma explicação para
uma pessoa. Sem este passo, o trabalho fica correto e ilegível, e quem revisa ou dá manutenção
recomeça do zero.

Ao chegar neste passo, ler [`references/devolutiva.md`](references/devolutiva.md) antes de
escrever: o formato das seções, as regras de escrita verificáveis, o exemplo preenchido, a checagem
antes de enviar e a relação com os outros relatórios.

---

## Hard rules

As proibições já codificadas como validators FATAL não se repetem aqui — valem as tabelas abaixo
(`WORK_ITEM_SOURCED`, `TEST_BLUEPRINT_BEFORE_CODE`, `TEST_LAYERS_FROM_RULES`,
`VALIDATIONS_PASSED`, `NO_STATE_CHANGE_ON_FAILURE`, `NEGATIVE_PATHS_COVERED`,
`CHAT_HANDOFF_DELIVERED`). Restam as sem validator:

- **Never** assumir que o projeto não tem testes automatizados sem ter procurado a regra de testes
  **e** inspecionado o repositório (Fase 2 · E1).
- **Never** "simplificar" o `testData` que a task entregou — payload completo, estado de banco
  completo, mensagem de erro literal.
- **Never** deixar fixture com placeholder (`TODO`, `xxx`, `a definir`) e contar a linha como
  coberta.
- **Never** report `VALIDATIONS_PASSED` without the matriz de cenários attached to the closing
  comment/report.
- **Never** introduzir um framework de teste novo por conta própria quando o projeto não tem
  nenhum — perguntar.
- **Credenciais:** nunca ler `.env.instancia` nem ecoar senha ou token em comentário ou chat. Só os
  scripts (`reinstall.mjs`, `atf.mjs`, `capture.mjs`) carregam o arquivo.
- **Nunca** pôr dado real de contribuinte em `Test()`, seed ou comentário de issue: CPF e CNPJ vêm
  do seed fictício (`app/src/fluent/seed/_documentos.json`).
- **Nunca** escrever fora de `app/src/fluent/`, `app/src/server/` e dos artefatos da story em
  `outputs/spec/` sem o usuário ampliar o escopo.

---

## Validators (FATAL / WARNING)

### FATAL — blocks completion

| Code | Check |
|------|-------|
| `WORK_ITEM_SOURCED` | Os dados da story vêm da issue do GitHub (Mode A, `gh issue view`) ou de uma entrada `stories[].tasks[]` localizada no `tasks.json` (Mode B) — nunca inventados |
| `SDK_DOC_CONSULTED` | Antes de escrever cada tipo de objeto Fluent, `now-sdk explain <tópico> --peek` (ou o tópico completo) foi consultado nesta sessão |
| `INSTALL_REGISTERED` | Com o `app/src/fluent` commitado, `npm run reinstall` terminou `ok` e a linha `now-sdk-install` do `sync-log.md` traz o commit `git log -1 --format=%H -- app/src/fluent` |
| `ATF_RECEIPT` | `npm run atf -- --story <STORY>` gravou `outputs/spec/auditorias/atf/<STORY>.json` com `status: "success"` e commit igual ou posterior ao último de `app/src/fluent` — ou a story tem a isenção `atf-form` registrada (§ G2b) |
| `VALIDATION_BY_STORY_TYPE` | A validação seguiu a tabela do § G2b: G3 no fio condutor; nas demais stories, isenção `g3` registrada em `outputs/spec/auditorias/_isencoes/<STORY>-g3.md` |
| `DEPENDENCIES_CHECKED` | Antes da Fase 2, as dependências da task foram conferidas (§ D2: `andamento.mjs conferir` em Mode B, links de predecessora em Mode A) e, com dependência aberta, o usuário confirmou antes de começar |
| `US_MARKER_OPEN` | Antes do primeiro commit de código da US, `outputs/spec/em-andamento.md` existe — criado com `andamento.mjs abrir-us` a partir de `.claude/templates/em-andamento.md` — e está commitado no repositório de docs |
| `TASK_STATUS_RECORDED` | Mode B: com o G3 em `fim`, `andamento.mjs concluir` gravou `status: "DONE"` no `tasks.json` antes do passo I; com `parar`, o status ficou inalterado |
| `TEST_BLUEPRINT_BEFORE_CODE` | O Test Blueprint (matriz com categoria, camada e `arquivo::nome` em toda linha) foi produzido **antes** da primeira edição em código de produção |
| `TEST_LAYERS_FROM_RULES` | Toda camada que as rules técnicas exigem para o código tocado (unit, integração, contrato, E2E, carga) tem ao menos um teste criado — ou linha de dispensa com motivo na matriz |
| `VALIDATIONS_PASSED` | Tests/build mandated by the work item ran and passed before any state change or "done" report |
| `SCOPE_CONFIRMED` | For a User Story with children, the scope (story-only / one child / all children) was confirmed with the user before implementing |
| `NO_STATE_CHANGE_ON_FAILURE` | Com build, install ou ATF reprovado, a issue não é fechada nem marcada como pronta (Mode A) e a task não vai para `DONE` (Mode B) |
| `ALL_SCENARIOS_TESTED` | Every `acceptanceScenarios[]` entry and every `businessRules[].testScenarios[]` entry the work item declares has a matching row in the scenario matrix with a passing test — or an explicit, justified exception |
| `NEGATIVE_PATHS_COVERED` | For every `INVALID_INPUT`/`BUSINESS_RULE_VIOLATION` scenario, `errorHandling{}` entry, or explicit negative condition in prose, a test exists that forces the failure and asserts the documented error — not just the happy path |
| `CHAT_HANDOFF_DELIVERED` | A devolutiva em chat do passo J foi entregue, nos dois modos e também em caso de falha, no formato e nas regras de escrita da seção — negócio, decisões técnicas sem jargão (problema, comparação do dia a dia, alternativa, preço) **e** técnico, sem jargão não explicado |
| `VALIDACAO_INDEPENDENTE_APROVADA` | No fio condutor, o G3 terminou em `fim` (APROVADO) antes do H, ou foi pulado com `VALIDACAO_INDISPONIVEL` registrado; fora dele, a isenção `g3` está registrada. Nenhuma issue vai para pronta (o equivalente do Testing) com o G3 em andamento ou terminado em `parar`; com `parar`, o H se reduz ao comentário dos bloqueantes, com o estado inalterado |

### WARNING — does not block, goes in the closing comment/report

| Code | Check |
|------|-------|
| `MANUAL_QA_REMAINING` | Work item lists manual QA steps that could not be automated — recorded in the closing comment/report |
| `DEPENDENCY_PENDING` | A task começou com dependência não concluída (§ D2), com o «sim» do usuário — a decisão está no `spec_story.md` e na devolutiva |
| `CROSS_CHECK_DIVERGENCE` | `data-model.json` citado pela story diverge dela — divergência reportada, a story vence |
| `ISSUE_COMMENT_FAILED` | Mode A: o `gh issue comment` falhou (sem autenticação, sem rede) — o texto do comentário foi entregue no chat para colar |
| `CAPTURE_FAILED` | `npm run capture -- --story` falhou numa rota — a story segue, e o comentário diz qual tela ficou sem print |
| `SCENARIOS_DERIVED_FROM_TEXT` | Work item had no structured `acceptanceScenarios[]`/`businessRules[]`; a matriz foi planejada a partir da prosa (Caminho 2) — cobertura é best-effort |
| `SCENARIO_CATEGORY_SKIPPED` | A mandatory category (authorization/edge/external failure) was marked not-applicable — the reason is recorded in the matrix, not silently omitted |
| `NO_TEST_STACK_DECLARED` | Nenhuma regra de testes encontrada no corpus — a convenção foi inferida dos testes existentes, ou o usuário foi consultado |
| `TEST_STACK_MISSING` | As rules declaram uma ferramenta ausente do repositório — usou-se o stack real e a divergência foi reportada (nada foi instalado por conta própria) |
| `COVERAGE_BELOW_THRESHOLD` | Cobertura medida ficou abaixo do threshold declarado nas rules — número reportado |
| `E2E_SCENARIO_DEFERRED` | Linha E2E aplicável não executada (sem ambiente ou adiada pelo usuário) — script criado e caminho informado |
| `LOAD_SCENARIO_DEFERRED` | Linha de carga aplicável não executada — script criado e caminho informado |
| `SCENARIO_ADDED_DURING_IMPLEMENTATION` | Cenário descoberto depois do congelamento do blueprint — adicionado à matriz e coberto, não absorvido em silêncio |
| `TESTABILITY_REFACTOR` | O desenho foi ajustado (porta extraída, dependência injetada) para tornar uma linha testável — registrado como decisão no `spec_story.md` |
| `IMPL_COVERAGE` | A linha de cobertura (`cenários`, `verdes`, `não cobertos`, `camadas`, `fonte`) foi registrada no sync-log, na coluna `<questões em aberto>` |
| `VALIDACAO_PARADA` | O G3 terminou em `parar` (limite de rodadas, oscilação, incerteza que só uma pessoa decide, ou o corretor recusou todos os itens) — bloqueantes comentados no work item, devolutiva do J em modo falha, diff das edições do corretor mostrado e a decisão do usuário (manter ou descartar) registrada, estado inalterado; em lote, a próxima task esperou |
| `VALIDACAO_FALHA_PRE_EXISTENTE` | Um comando do projeto falhou no G3 igual ao que já falhava na linha de base (E1, passo 6) — não bloqueou; a falha vai no comentário e na devolutiva, com o comando |
| `VALIDACAO_INDISPONIVEL` | O G3 não rodou porque não há `tasks.json` local — registrado no comentário e na devolutiva. Sem subagente (Kiro, Cowork, ou Claude Code/Cursor sem os agentes de `.claude/agents/` carregados) **não** é indisponível: o G3 roda com `--sem-agentes` |

---

## O que NÃO faz

- Não gera o `tasks.json` nem os GAPs — isso é a `spec-tasks`.
- Não gera tabela, form, list, menu, role nem seed em massa a partir do modelo de dados — isso é o
  `sn-scaffold` (que chama o `sn-seed`). A story gerada passa por aqui só para receber o ATF, o
  install e o comentário.
- Não instala por `now-sdk install` direto nem roda `npm run reinstall -- --zerar` por conta própria.
- Não consulta a instância para decidir se a story está pronta: quem diz isso é a linha de install no
  `sync-log.md` e o recibo do ATF, que o `delivery-gate` lê.
- Não trata `data-model.json` como entrada primária — só conferência quando a task o cita.
- Não escreve o plano de homologação de negócio (`spec-test-plan`).
- Não usa Workspace, Service Portal nem UI Builder (`servicenow-ui.md`).
- Não implementa um épico inteiro de uma vez.
- Não audita a entrega depois de pronta — isso é a `auditoria-de-us` e a `spec-code-audit`.

---

## Relação com as outras skills

| Skill | Quando |
|-------|--------|
| `spec-tech-rules` | Produz as rules `.mdc` (inclusive `test-strategy`) que o E1 lê. |
| `spec-tasks` | Produz o `tasks.json` (v5.4, com `Task.snArtifact`) — a fonte dos cenários e do objeto a criar. |
| `sn-tasks-github` | Publica o backlog como issues e grava o `outputs/spec/id-map.json`, pré-requisito desta skill. Publica também, com `--change`, as tasks SEC novas do Deliver. |
| `sn-scaffold` / `sn-seed` | Geram tabelas, forms, lists, menu, roles, ACL base, seed e a `TestSuite` "cob-regressao" (`app/src/fluent/tests/suite.now.ts`), onde esta skill acrescenta o `Test()` de cada story. |
| `sn-reinstall` | `npm run reinstall`: build, install, contagem, suíte e a linha de install no `sync-log.md`. |
| `sn-capture` | `npm run capture -- --story <ID>`: o print da tela na visão do papel, em `outputs/spec/screens/deliver/`. |
| `spec-security-review` | Injeta tasks `class=security`; os cenários de negação entram na matriz como `AUTHORIZATION`. |
| `spec-debug-fix` | Story que voltou da homologação com defeito — protocolo de evidência (log do sistema, execution details); usa o mesmo `spec_story.md`. |
| `auditoria-de-us` | Fecha a US depois da última task: confere entrega, testes e segurança e apaga o marcador `em-andamento.md`. |
| `spec-code-audit` | Auditoria independente do código, depois da implementação. |

---

## Referências

- **Leitor de ATF:** [`scripts/README.md`](scripts/README.md) — flags, recibo e códigos de saída.
- **Devolutiva:** [`references/devolutiva.md`](references/devolutiva.md).
- **Histórico herdado da `spec-implement`:** [`./HISTORY.md`](./HISTORY.md).

---

## Invocação

**Claude Code:** "use a skill sn-implement" com o bloco:

```markdown
- Story: <ID da story, ex.: US-MOD-F2-001>          # ou: Issue: #<número>
- Task (opcional): <TASK-ID>                          # uma task da story
- tasks.json: outputs/spec/tasks.json
- Pasta do código: app
- Rules: <pasta das .mdc do projeto>
```

Variações: `(Só esta task; não implementar as irmãs.)`; `Story inteira — todas as tasks em ordem;
confirmar antes de começar.`

Mesmo quando o código já existe, **o Test Blueprint continua obrigatório**: é ele que mostra se o que
está lá cobre os cenários da story.

---

## Limitações

- **ATF de form precisa do Client Test Runner.** O `atf.mjs` abre um Chromium sem tela logado no
  runner (desfecho A do item 9); se a instância não aceitar testes agendados, o teste de form não
  roda e a story precisa da isenção `atf-form`.
- **A instância de desenvolvedor é volátil.** Sem instância, não há install nem recibo novos: o
  `delivery-gate` reprova o push até o `npm run reinstall` e o `npm run atf` rodarem de novo.
- **Story grande:** implementar todas as tasks numa sessão pode estourar contexto — preferir uma
  task por sessão.
- **Blueprint é planejamento, não garantia:** cobertura real é o que o recibo do ATF mostra.