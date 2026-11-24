---
name: spec-tech-rules
description: >
  spec-tech-rules (Fase 6.5 — Regras Técnicas de Implementação) — invocar ANTES de spec-data-model,
  logo após a estabilização dos requisitos de produto (spec-product / spec-iterate).
  Lê os documentos de negócio gerados, monta perfil do projeto e conduz kickoff interativo
  sugerindo decisões técnicas fundamentadas no contexto real do produto.
  Gera as rules em outputs/spec/tech-rules/*.mdc (fonte versionada) e materializa cópias em
  .cursor/rules/, .claude/rules/ e/ou .kiro/steering/ conforme o ambiente escolhido — nada a copiar manualmente.
  Alvo ServiceNow: gera conventions, architecture, security, test-strategy e deploy-and-build para o
  app escopado (escopo lido de app/now.config.json), com as RN-SN do catálogo oficial como referência.
  security.mdc é SEMPRE gerado: parte fixa da plataforma + bloco do projeto (roles, ACL de linha, cross-scope).
  A tela segue a rule do harness servicenow-ui.md (Core UI clássica); não há frontend.mdc.
  Invocar para: "criar regras técnicas", "definir arquitetura", "tech rules", "setup técnico",
  "definir stack", "regras de implementação", "configurar cursor rules".
version: "4.4"
updated: "2026-10-20"
---

# spec-tech-rules — Regras Técnicas de Implementação

> **Skill agnóstica de projeto.** Toda sugestão é derivada e justificada pelos documentos de produto.

## Papel

Lê os artefatos de produto, monta um perfil do projeto e conduz diálogo interativo para capturar
todas as decisões técnicas. Para cada pergunta: apresenta as opções, **sugere com base no que leu**
citando o documento e a seção que embasa a sugestão, e aguarda confirmação ou ajuste.

Gera os arquivos de rules que formam o "constitution" técnico do projeto — todo agente de IA que
implementar neste projeto lerá essas regras **automaticamente**: o **Cursor** via `globs`/`alwaysApply`
em `.cursor/rules/*.mdc`; o **Claude Code/Cowork** via `paths` (ou sem `paths` = sempre) em
`.claude/rules/*.md`; o **Kiro** via `inclusion`/`fileMatchPattern` em `.kiro/steering/*.md`.
Mesmo conteúdo, três formatos nativos — a skill pergunta o ambiente alvo (PASSO 1)
e cria a(s) pasta(s) correspondente(s).

**Arquivos gerados (alvo ServiceNow):** `conventions`, `architecture`, `security`, `test-strategy` e
`deploy-and-build` — lista e regras de preenchimento no PASSO 3/PASSO 4. A `security` vem do template
com a parte fixa intacta e o bloco do projeto preenchido; as demais nascem dos moldes em `templates/`
preenchendo os placeholders com as decisões do projeto. Os moldes do upstream que não se aplicam à
plataforma (`auth`, `database`, `observability`, `messaging-and-queue`, `integrations`, `frontend`,
`frontend-default` e os originais em `templates/upstream/`) ficam na pasta só para o merge com o
harness e não são gerados (`references/placeholders.md`, § Templates do upstream fora do alvo).

**Alvo ServiceNow — o que muda em relação ao upstream:** linguagem = Fluent (metadados) + Glide
(script de servidor); persistência = tabelas da plataforma no escopo do app; deploy = `now-sdk` via
`npm run reinstall` + git; testes = ATF (`Test()` Fluent, recibo por story); frontend = Core UI
clássica (`.claude/rules/harness/servicenow-ui.md`). Escopo, nome do app e versões do SDK são lidos
de `app/now.config.json` e `app/package.json`, nunca perguntados. Catálogo de boas práticas:
`referencias/32-servicenow-boas-praticas-oficiais.md` (RN-SN), citado nas rules como referência.

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

Vale para as rules geradas (`.mdc` / `.md`): cada regra diz, em uma frase, **por que** existe e o que quebra se for violada, antes de dizer qual padrão seguir. Rule que só enuncia o padrão não é obedecida — é contornada.

## Posição no fluxo

```
spec-product → spec-iterate → [spec-tech-rules] → spec-hld → revisao-de-seguranca → spec-data-model → spec-test-plan → spec-tasks
```

**Pré-requisitos:** `outputs/spec/requirements/requirements.md`, `product-requirements.md`, `discovery-document.md`;
no alvo ServiceNow também `app/now.config.json`, `app/package.json`, `outputs/explore/especificacao-funcional.md`
(tabela de telas `TEL-` e papéis), `inputs/simulacoes.md` (quando houver) e o `ORIGEM.md` (desfecho do teste de viabilidade)

**Saídas:** `outputs/spec/tech-rules/*.mdc` (fonte versionada) + `outputs/spec/tech-rules/tech-rules-summary.md`
— e as **cópias materializadas** em `.cursor/rules/*.mdc` e/ou `.claude/rules/*.md` conforme o
`ambiente` escolhido no PASSO 1.0 (regra única de destino no § PASSO 4 — Onde salvar).

## Sync-log (obrigatório)

Antes de iniciar, ler `outputs/spec/sync-log.md` (Seção A) — inclui a linha de kickoff (ver
`../tools/references/task-pipeline.md` §4), especialmente o `ambiente` já decidido em
`spec-init`, se houver.

Ao terminar, adicionar UMA linha — formato específico desta skill no § PASSO 6.

---

## PASSO 0 — Leitura de contexto (obrigatório antes de qualquer pergunta)

Ler os documentos de produto e extrair os seguintes sinais. Cada sinal afeta diretamente as
sugestões — **nunca sugerir sem citar a fonte**.

| Sinal | Onde buscar | Como afeta sugestões |
|-------|-------------|---------------------|
| Volume de registros / SLO de latência | RNF em `requirements.md` | `GlideAggregate`, report × valor gravado, lote em Flow (RN-SN-20, 154) |
| Dados pessoais / sigilo / LGPD | `business-rules.md`, `requirements.md` | ACL de campo `query_range`/`query_match`, seed fictício, log sem documento |
| Integrações com sistemas externos | `context-map.md`, `inputs/simulacoes.md` | Tabela `SIM-` + Script Include leitor (camada anti-corrupção) |
| Módulos de negócio distintos | Seções `## Módulo:` em `requirements.md`, `modules.md` | Grupo de tabelas e módulo de menu por `MOD-` |
| Regras de negócio complexas / workflows | `business-rules.md` | Degrau da escada «configurar antes de customizar» por RN |
| Papéis e visão parcial dos dados | tabela `TEL-` da `especificacao-funcional.md` | Roles do escopo, ACL de linha |
| Equipe / prazo / restrições | `discovery-document.md` | Menos customização, mais configuração |
| Cliente governamental | `discovery-document.md` | WCAG 2.2 AA, LGPD reforçada, auditoria (`audit`, `journal_input`) |
| Operações irreversíveis | `business-rules.md`, `requirements.md` | Business Rule `before` + ATF negativo, `delete` só admin |
| Customização de tabela da plataforma | `especificacao-tecnica.md`, `data-model.previa.json` | ADR «configurar × customizar» no `hld.md`, ponto cego de upgrade |

Montar perfil interno antes de formular qualquer pergunta:

```
perfil = {
  escopo: string,                 // app/now.config.json → scope
  papeis: string[],               // papéis da tabela TEL- da especificacao-funcional.md
  temAclDeLinha: bool,            // algum papel só vê parte dos registros (carteira, dono)
  simulacoes: string[],           // SIM- de inputs/simulacoes.md
  temDadosPessoais: bool,
  temIntegracaoExterna: bool,
  temOperacaoIrreversivel: bool,  // protocolos, emissões, financeiro
  volumeAlto: bool,               // RNF latência < 200ms OU > 10k usuários
  modulosDistintos: int,          // contagem de ## Módulo: em requirements.md
  clienteGoverno: bool,
  prazoApertado: bool,            // < 6 meses mencionado
  dominioComplexo: bool           // business-rules.md com > 10 RNs condicionais
}
```

**Regra de sugestão:** toda sugestão deve seguir o formato:
> *"[documento] §[seção ou RNF] indica [sinal] → [decisão sugerida]"*
> Ex: *"requirements.md §RNF-03 exige latência < 200ms → Redis distribuído obrigatório"*

---

## Modo expresso (opcional — 2 turnos)

Depois do PASSO 0, oferecer ao usuário a escolha entre dois modos de kickoff:

> "Prefere o **modo expresso** (todas as decisões num quadro único, com defaults
> pré-preenchidos e fonte citada — você confirma ou lista exceções por número) ou o
> **modo detalhado** (bloco a bloco, com as opções explicadas uma a uma)?"

### Turno 1 — apresentar o quadro único

Montar, a partir do perfil (§ PASSO 0), **um único quadro** cobrindo todas as decisões dos
Blocos 1–10 (em `references/kickoff-blocos.md`), cada uma já preenchida com o default sugerido e
a fonte que o embasa:

| Bloco | Decisão | Default sugerido | Fonte |
|-------|---------|-------------------|-------|
| 1.1 Linguagem | Fluent + Glide (informação) | — | `app/package.json` |
| 1.2 Idioma dos identificadores | [decisão] | [default] | [documento §seção] |
| 2.2 Onde vai cada regra | [decisão] | [default] | [documento §seção] |
| … | … | … | … |

Fechar com: **"Confirma todos os defaults acima, ou lista exceções por número (ex.:
'3.1 → MySQL, 7.1 → OIDC via Keycloak')?"**

### Turno 2 — aplicar a resposta

- **Sem exceções:** aplicar todos os defaults e seguir direto para o PASSO 3 (Revisão e
  confirmação) — pular o PASSO 2 bloco a bloco.
- **Com exceções:** substituir apenas os itens citados por número, manter os demais defaults,
  e seguir para o PASSO 3.

**Modo detalhado (opt-in):** seguir o PASSO 2 completo, bloco a bloco, quando o usuário pedir
explicitamente ("quero ver bloco a bloco", "vá com calma", "explique cada decisão") **ou**
quando o perfil indicar alta complexidade/ambiguidade (`dominioComplexo = true` **e**
`modulosDistintos ≥ 5`) — nesses casos, a superfície de decisão é grande demais para um único
quadro responsável.

---

## PASSO 1 — Abertura

**1.0 — Ambiente alvo das rules:** se o `ambiente` **já veio do kickoff/sync-log** (gravado por
`spec-init` — ver § Sync-log), **confirmar em uma linha** («ambiente=X, do kickoff — mantenho?»)
em vez de reperguntar. Só perguntar quando a informação estiver ausente:
```
Onde estas rules serão usadas?
  1. Cursor          → gero só .cursor/rules/*.mdc  (globs / alwaysApply)
  2. Claude (Code/Cowork) → gero só .claude/rules/*.md  (paths / sempre)
  3. Ambos           ← recomendado quando não há Kiro (gero as duas pastas, cada uma no seu formato)
  4. Kiro            → gero só .kiro/steering/*.md  (inclusion / fileMatchPattern)
```
Guardar a resposta como `ambiente ∈ {cursor, claude, kiro, ambos}` — ela decide em qual(is)
pasta(s) o PASSO 4 materializa (as pastas em si são criadas pelo `spec-init`; se faltarem,
criar sem apagar nada). **Conteúdo idêntico; só muda o formato do frontmatter por pasta.**

```
# spec-tech-rules — Definição das Regras Técnicas (alvo ServiceNow)

Li os documentos do projeto e o app em app/ (escopo [escopo], SDK [versão]).
Vou sugerir cada decisão técnica com base no que encontrei.

Já decidido, sem perguntas:
  ✅ security  — parte fixa da plataforma (ACL, GlideRecordSecure, cross-scope); eu preencho o bloco do projeto
  ✅ tela      — Core UI clássica, pela rule do harness servicenow-ui.md

Para os demais, vou guiar você bloco a bloco.
Digite o número da opção, descreva livremente, ou "pular" para registrar como questão em aberto.
```

---

## PASSO 2 — Kickoff interativo

Os dez blocos de decisão — perguntas, opções e como fundamentar o default no perfil do PASSO 0 —
estão em [`references/kickoff-blocos.md`](references/kickoff-blocos.md). Ler antes de montar o
quadro do Modo expresso (Turno 1) ou de começar o modo detalhado. No alvo ServiceNow vários itens são
informação lida do repositório (escopo, SDK, instância, Core UI) e entram no quadro com a fonte, fora
das exceções por número.

---

## PASSO 3 — Revisão e confirmação

Apresentar resumo consolidado antes de gerar:

```
# Resumo das Decisões Técnicas — [Nome do Projeto]

App         : [nome] (escopo [escopo]) | SDK [versão] | Instância [alias] ([release])
Linguagem   : Fluent + Glide | Identificadores: [idioma] | Tela: Core UI clássica
Arquitetura : configurar antes de customizar | Outro escopo: [só referência / estende task / ADR]
Persistência: tabelas do escopo | Histórico: [journal+audit] | Indicadores: [report / gravado] | Seed: até [n]/tabela
Testes      : ATF servidor + form ([runner ou isenção]) | Suíte: [nome] | Recibo por story
Log         : gs.* | Nível: [padrão / propriedade]
Acesso      : roles [lista] | ACL de linha: [sim/não] | Cross-scope: [lista ou nenhum]
Deploy      : npm run reinstall | Ambientes: [lista] | Branching: [estratégia]
Integrações : [SIM- lista ou nenhuma]

Arquivos que serão gerados:
  ✅ security.mdc              (parte fixa do template + bloco do projeto)
  ✅ architecture.mdc
  ✅ conventions.mdc           (alwaysApply: true)
  ✅ test-strategy.mdc
  ✅ deploy-and-build.mdc

Questões em aberto: [lista de perguntas puladas com impacto]

Confirma? (S / N / "ajustar bloco N")
```

---

## PASSO 4 — Geração dos arquivos

Copiar o template de `templates/` (desta skill) e substituir **todos os placeholders `{{...}}`**
com os valores reais das decisões. A `security` não tem placeholder: a parte fixa é cópia integral
de `templates/security.mdc`, e só o bloco entre `<!-- projeto:inicio -->` e `<!-- projeto:fim -->`
é reescrito com as decisões do BLOCO 7.

**Regra universal:** nenhum `{{PLACEHOLDER}}` sobrevive no arquivo final. Blocos `{{#if}}...{{/if}}`
— incluir se condição verdadeira, remover completamente se falsa.

### Onde salvar (depende do `ambiente` do PASSO 1.0)

**Regra única de destino:** gerar cada rule
como **arquivo "mestre" no formato Cursor** (frontmatter `globs`/`alwaysApply`) em
**`outputs/spec/tech-rules/*.mdc`** — esta é a **fonte versionada** do projeto de discovery —
**e, no mesmo passo, materializar cópias** nas pastas de rules do repositório de implementação
conforme o `ambiente`. As duas gravações acontecem juntas; **nada a copiar manualmente depois**.

| `ambiente` | Fonte (`outputs/`) | Pastas materializadas | Formato |
|------------|---------------------|------------------------|---------|
| `cursor` | `outputs/spec/tech-rules/*.mdc` | `.cursor/rules/` | `*.mdc` (conteúdo Cursor, sem conversão) |
| `claude` | `outputs/spec/tech-rules/*.mdc` | `.claude/rules/` | `*.md` (converter frontmatter — ver tabela) |
| `ambos`  | `outputs/spec/tech-rules/*.mdc` | `.cursor/rules/` **e** `.claude/rules/` | `.mdc` + `.md` |
| `kiro` | `outputs/spec/tech-rules/*.mdc` | `.kiro/steering/` | `*.md` (converter frontmatter — `--kiro`) |

**Projeto com o harness Elo — o que o harness já carrega não é materializado de novo (Decisão 73
do harness).** No upstream, o harness traz a rule de segurança (`.claude/rules/harness/security.md`)
e a de frontend padrão (`.claude/rules/harness/frontend.md`) com o corpo idêntico ao de
`templates/security.mdc` e `templates/frontend-default.mdc`, e as duas **não** são materializadas na
pasta que já tem a rule do harness.
As duas continuam em `outputs/spec/tech-rules/` — o `SECURITY_UNMODIFIED` confere lá.

No fork ServiceNow: a `harness/frontend.md` virou `.claude/rules/harness/servicenow-ui.md` e a
`frontend-default.mdc` não é gerada. A `security.mdc` ServiceNow **é** materializada mesmo com a
`harness/security.md` na pasta, porque não é cópia dela: é a tradução da Camada G para o app, com o
bloco do projeto, e carrega só em `app/src/**`. O `mdc_to_md.py` reconhece o marcador
`<!-- projeto:inicio -->` e converte.

- **Claude e Kiro:** o `mdc_to_md.py --dir` faz isso sozinho e imprime `PULADA` para cada uma. Se
  sobrou cópia de uma execução anterior, ele avisa e não apaga: apague-a.
- **Cursor** (cópia sem conversão): não copiar `frontend-default.mdc` nem uma `security.mdc` sem o
  bloco do projeto para a pasta que já tem a rule do harness equivalente.

**Conversão `.mdc → .md` (Claude)** — determinística, via `tools/mdc_to_md.py` desta skill
(caminho relativo a este `SKILL.md`): `python3 tools/mdc_to_md.py --dir <pasta_mdc> .claude/rules`:

| `.mdc` (Cursor) | `.md` (Claude) |
|---|---|
| `alwaysApply: true` **ou** sem `globs` (ex.: `security`) | **sem** `paths` (carrega sempre) |
| `globs: "**/*.ts,**/*.tsx"` + `alwaysApply: false` | `alwaysApply: false` + `paths: **/*.ts, **/*.tsx` |
| `globs: "src/**/*.{ts,tsx}"` (chaves) | `paths: src/**/*.{ts,tsx}` — a vírgula **dentro** da chave é do glob, não separa |

> O script gera `paths` em CSV sem aspas, numa linha. **Medido no Claude Code 2.1.295
> (2026-10-19):** CSV sem aspas, CSV com aspas, glob com chaves e lista YAML **carregam todos** —
> o aviso antigo de que aspas ou lista "não carregam" não vale mais. O corpo da rule é idêntico nos
> formatos. Extensão **deve** ser `.md` (o Claude só descobre `.md` em `.claude/rules/`, não `.mdc`).

**Conversão `.mdc → .md` (Kiro)** — determinística, via o mesmo script com `--kiro`:
`python3 tools/mdc_to_md.py --kiro --dir <pasta_mdc> .kiro/steering`:

| `.mdc` (Cursor) | `.md` (Kiro) |
|---|---|
| `alwaysApply: true`, ou sem frontmatter | `inclusion: always` |
| `globs: "**/*.ts,**/*.tsx"` + `alwaysApply: false` | `inclusion: fileMatch` + `fileMatchPattern: ["**/*.ts", "**/*.tsx"]` |
| `globs: "src/**/*.{ts,tsx}"` (chaves) | `fileMatchPattern: ["src/**/*.ts", "src/**/*.tsx"]` — chaves **expandidas**: a documentação do Kiro mostra string ou lista e não cita `{a,b}` |
| sem `globs`, `alwaysApply: false`, com `description` (o "Agent Requested" do Cursor) | `inclusion: auto` + `name` (nome do arquivo) + `description` — carrega quando o pedido casa com a descrição |
| demais casos sem `globs` | `inclusion: always` |

> **Como o Kiro lê o steering** ([kiro.dev/docs/steering](https://kiro.dev/docs/steering/), consultado
> em 2026-10-19):
> - O frontmatter tem que ser a **primeira coisa** do arquivo, sem linha em branco antes. O script
>   garante isso.
> - Na **IDE** e na **CLI V3**, os quatro modos valem: `always`, `fileMatch`, `manual` e `auto`.
> - Na **CLI V1/V2**, só `always` carrega sozinha. As de `fileMatch`, `manual` e `auto` **não
>   carregam** — o oposto do que esta skill dizia antes ("a CLI ignora `inclusion` e carrega tudo").
>   Nessas versões, quem precisa da rule contextual a anexa (`#nome-do-arquivo`) ou a
>   `sn-implement` a lê explicitamente.
> - **Agente customizado** (`.kiro/agents/*.json`) **não** inclui o steering sozinho: ele precisa
>   declarar `"resources": ["file://.kiro/steering/**/*.md"]`.
> - O `AGENTS.md` na raiz é sempre incluído, sem modos.

**Orçamento de tamanho.** Toda rule que carrega é reenviada a cada volta do modelo, então rule grande
custa em toda conversa. O script **avisa** (não corta: cortar norma em silêncio é pior que o custo)
quando uma rule passa de **12.000 caracteres**. Ao receber o aviso, divida a rule por tema ou restrinja
os `globs`, regenere e confirme que o aviso sumiu antes do PASSO 5. A `security.mdc` do template é a
exceção conhecida: ela é a regra universal, carrega sempre e não se divide.

**Conferência final, antes do PASSO 5** — os dois FATAL que dá para checar por máquina:

```bash
node tools/check-rules.mjs outputs/spec/tech-rules <pastas materializadas do ambiente>
# ex.: node tools/check-rules.mjs outputs/spec/tech-rules .claude/rules
```

Exit 1 lista cada `{{PLACEHOLDER}}` que sobrou (`NO_PLACEHOLDER_LEFT`, com arquivo e linha) e se a
`security.mdc` gerada difere do template fora do bloco do projeto (`SECURITY_UNMODIFIED`). Corrigir e rodar de novo. Os dois
continuam FATAL — o script é a evidência deles (WARNING `RULES_SCRIPT_CHECK`).

O mesmo exit 1 traz `RULES_CONTRADICTION` quando as rules se contradizem num ponto que dá para ver
por texto: **módulo** citado numa rule (`src/modules/acesso/…`) ou no `data-model.json` (quando já
existir — `--data-model <arquivo>` se não estiver em `outputs/spec/`) que não está na árvore de
módulos da `architecture.mdc`, com a lista dos módulos dela; e **dependência** — uma rule diz «sem
dependências de runtime» e a `database.mdc` escolhe um banco servidor, cujo driver é dependência de
runtime (inerte no alvo ServiceNow, que não gera `database.mdc`). Corrigir a rule que está errada e
rodar de novo: é a contradição que o `sn-scaffold` levantaria depois, com o app já gerado. No alvo
ServiceNow a árvore de módulos é a de `app/src/fluent/tables/` com os `MOD-` da `architecture.mdc`.

---

**Placeholders comuns a todos os arquivos** (não repetidos nas tabelas abaixo): `{{APP_NAME}}` = `name` de `app/now.config.json` · `{{SCOPE}}` = `scope` de `app/now.config.json` · `{{SDK_VERSION}}` / `{{GLIDE_VERSION}}` = versões fixas em `app/package.json` · `{{ANTIPATTERNS_LIST}}` = 4–5 anti-patterns concretos do tema do arquivo. Nos moldes do upstream (fora do alvo) valiam também `{{PROJECT_NAME}}`, `{{LANGUAGE}}` e `{{CONFIG_FORMAT}}`. O validator `NO_PLACEHOLDER_LEFT` cobre omissões.

---

### `security.mdc`
Copiar `./templates/security.mdc` integralmente e reescrever **só** o bloco entre
`<!-- projeto:inicio -->` e `<!-- projeto:fim -->` (os marcadores ficam): tabela de roles (role,
quem, contém), matriz de ACL de linha por tabela e papel, `CrossScopePrivilege` permitidos e
exceções de `delete`. Nenhuma outra linha muda.

---

Ao preencher cada template, ler [`references/placeholders.md`](references/placeholders.md): de
qual decisão do kickoff sai cada placeholder de `conventions`, `architecture`, `test-strategy` e
`deploy-and-build`. O validator `NO_PLACEHOLDER_LEFT` cobre omissões.

---

## PASSO 5 — Sumário

Gerar `outputs/spec/tech-rules/tech-rules-summary.md`:

```markdown
# Tech Rules — Sumário de Decisões

**Gerado em:** [data]  **Por:** spec-tech-rules

## Decisões

| Bloco | Decisão | Justificativa (documento e sinal) |
|-------|---------|----------------------------------|
| Idioma dos identificadores | [X] | [ex: "requirements.md §RNF-02 — equipe e cliente falam português"] |
...

## Arquivos gerados

| Arquivo | alwaysApply | Propósito |
|---------|------------|-----------|
| security.mdc | false (`app/src/**`) | Segurança da plataforma (Camada G do harness) + roles, ACL de linha e cross-scope do projeto |
...

## Questões em aberto <!-- id: open-questions -->

Ver vocabulário e propriedade de GAPs em [`../tools/references/task-pipeline.md`](../tools/references/task-pipeline.md)
(§2.16) — esta skill **não cria** `GAP-XXX`; apenas registra questões pendentes nesta seção.

| # | Pergunta | Evidência/contexto (bloco/decisão) | Bloqueia próxima fase? |
|---|----------|-------------------------------------|-------------------------|

## Como usar
1. As rules foram geradas em `outputs/spec/tech-rules/*.mdc` (fonte versionada) **e** já
   materializadas na(s) pasta(s) do projeto conforme o `ambiente` (PASSO 1.0):
   `.cursor/rules/*.mdc`, `.claude/rules/*.md` e/ou `.kiro/steering/*.md`. Nada a copiar manualmente.
2. **Cursor:** aplica cada regra via `globs`/`alwaysApply` automaticamente — nada a fazer.
3. **Claude (Code/Cowork):** aplica nativamente via `.claude/rules/*.md` — a segurança universal
   do harness sempre; `conventions` sempre; as demais quando o Claude toca um arquivo que casa com `paths`.
   Nenhum roteamento manual no `CLAUDE.md` é necessário.
4. **Kiro:** aplica via `inclusion`/`fileMatchPattern` em `.kiro/steering/*.md` — `security`
   (`inclusion: always`) sempre; as demais (`inclusion: fileMatch`) quando o arquivo tocado casa
   com `fileMatchPattern`; as só com `description` (`inclusion: auto`) quando o pedido casa com a
   descrição. **Atenção:** na CLI do Kiro V1/V2 só as `always` carregam sozinhas — as contextuais
   precisam ser anexadas (`#nome-do-arquivo`); na IDE e na CLI V3 os modos valem. Agente
   customizado do Kiro precisa de `"resources": ["file://.kiro/steering/**/*.md"]`.
5. spec-hld, spec-data-model, spec-tasks, sn-implement e spec-code-audit lerão as rules sem configuração adicional.
```

> Nunca editar os dois formatos à mão — regenerar do mestre `.mdc` (conversão do PASSO 4).

---

## PASSO 6 — Sync-log

Adicionar entrada em `outputs/spec/sync-log.md` (Seção A), uma linha:
`| # | data | spec-tech-rules | ambiente=[cursor|claude|kiro|ambos] | rules geradas: [lista] | top 3 decisões de maior impacto | Questões em aberto: [n] | usuário | próximo: spec-hld |`

---

## Validators (FATAL / WARNING)

### FATAL — bloqueia a geração dos arquivos

| Código | Verificação |
|--------|-------------|
| `NO_PLACEHOLDER_LEFT` | Nenhum `{{...}}` sobrevive em qualquer arquivo `.mdc`/`.md` final gerado |
| `SUGGESTION_HAS_SOURCE` | Toda sugestão de decisão cita documento + seção/RNF que a embasa, no formato da § Regra de sugestão (PASSO 0) |
| `SECURITY_UNMODIFIED` | `security.mdc` gerado é **byte-idêntico** a `templates/security.mdc` fora do bloco `<!-- projeto:inicio -->` … `<!-- projeto:fim -->` — a parte fixa não muda |

### WARNING — não bloqueia, registrar e seguir

| Código | Verificação |
|--------|-------------|
| `RULES_SCRIPT_CHECK` | `node tools/check-rules.mjs` rodado antes do PASSO 5 (§ Conferência final); exit 1 = furo de `NO_PLACEHOLDER_LEFT`/`SECURITY_UNMODIFIED` ou `RULES_CONTRADICTION` (módulo fora da architecture, «sem dependências» × banco) a corrigir; exit 2 ou script ausente → `TOOL_UNAVAILABLE:check-rules` no sync-log. Vira gate quando rodar em projeto real sem falso positivo |
| `OPEN_QUESTIONS_LOGGED` | Toda pergunta pulada ("pular") está registrada na seção "Questões em aberto" de `tech-rules-summary.md` com evidência/contexto — esta skill não cria `GAP-XXX` (§2.16 de `task-pipeline.md`), apenas questões em aberto |

---

## Skills irmãs

| Skill | Consome | Produz |
|-------|---------|--------|
| `spec-product` / `spec-iterate` | — | `requirements.md`, `product-requirements.md`, `discovery-document.md` — insumo desta skill |
| `spec-init` | — | `.cursor/rules/` e/ou `.claude/rules/` **vazios e prontos** — esta skill preenche o conteúdo |
| `spec-hld` | Rules geradas aqui (escopo, mecanismos, SIM-) | `hld.md` com o ADR «configurar × customizar» |
| `revisao-de-seguranca` | `security.mdc` (roles, ACL de linha, cross-scope) | `plano-de-seguranca.md` (catálogo SEC) |
| `spec-data-model` | Rules geradas aqui (nomenclatura de tabela e coluna, limite de 30 caracteres) | `data-model.json` |
| `spec-api-contracts` | Opcional no alvo ServiceNow (A8) | `api-contracts.yaml` |
| `spec-tasks` | Rules geradas aqui | `tasks.json` |
| `sn-scaffold` | `conventions.mdc` (nomes, pastas) | Tabelas, forms, lists, menu, roles, ACL base |
| `sn-implement` | Rules geradas aqui (constitution técnico) | `.now.ts` e `Test()` ATF seguindo as rules |
| `spec-code-audit` | Rules geradas aqui (RN-SN [AUTO]) | Auditoria de conformidade do código |

## O que NÃO faz
- Não decide requisitos de negócio nem valida escopo — isso é `spec-product`/`spec-iterate`
- Não faz o bootstrap do repositório (CLAUDE.md, migração/espelhamento de rules existentes) — isso é `spec-init`; aqui as pastas de rules só são criadas se faltarem, nunca apagadas
- Não implementa código — apenas define as regras que o código deve seguir
- Não gera modelo de dados, contratos de API ou tasks — apenas as rules que orientam essas skills
- Não audita conformidade de código já escrito — isso é `spec-code-audit`
