---
name: sn-tasks-github
description: >
  sn-tasks-github (Plan — publicação do backlog no GitHub) — publica o outputs/spec/tasks.json
  (spec-tasks v5.3/v5.4) como issues do repositório: épico e funcionalidade viram issue, a story
  vira sub-issue com o print da tela por permalink e as tasks entram em checklist. Toda a regra
  está no Node.js. A IA roda o CLI em --dry-run, mostra o plano, pede confirmação e só então publica.
version: "0.1"
updated: "2026-11-24"
---

# sn-tasks-github — Publicação do backlog no GitHub

Extensão do projeto (design v0, decisão A4 e item 28). Segue o contrato do `spec-tasks-azure`:
gate de autossuficiência, `--dry-run`, `--change` e `--id-map`. A IA **não** monta payload nem chama
a API à mão: quem publica é o `cli.mjs`.

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

Aqui o texto **não é gerado, é publicado**: título e corpo das issues vêm do `tasks.json`. A régua vira
conferência antes de publicar: se o campo narrativo trava na leitura em voz alta, traz sigla solta ou
código de regra no lugar do texto da regra, **avise no chat e ofereça corrigir na origem** (`spec-tasks`).
Vale também para a devolutiva no chat: o que foi publicado, onde, e o que ficou pendente.

## Sync-log (obrigatório)

Antes de iniciar, ler `outputs/spec/sync-log.md` (Seção A). Ao terminar, adicionar UMA linha:
`| # | data | sn-tasks-github | <resultado-resumo> | <artefatos> | <questões em aberto> | <próximo passo> |`.

## Como usar

Dois passos, nesta ordem:

1. **Simular** (só leitura no GitHub):

   ```bash
   node .claude/skills/sn-tasks-github/cli.mjs --repo <dono/repo> --dry-run
   ```

   Mostre ao usuário o plano: quantas issues serão criadas, atualizadas ou já existem, os vínculos
   de sub-issue e os labels que serão criados.

2. **Pedir confirmação no chat e publicar só depois de um "sim" explícito**: o mesmo comando, sem
   `--dry-run`. Issue criada não se apaga com um comando (`security.md`, Camada J). Se o
   `tasks.json`, o repositório ou o `--change` mudaram depois da simulação, simule de novo.

Atalho na raiz: `npm run publish -- --repo <dono/repo> [--dry-run|--change]`.

### Parâmetros

| Parâmetro | Padrão | Descrição |
|---|---|---|
| `--input`, `-i` | `outputs/spec/tasks.json` | tasks.json (`metadata.schemaVersion` `tasks/v5.3` ou `tasks/v5.4`) |
| `--repo`, `-R` | `GH_REPO` | repositório `dono/repo` |
| `--id-map` | `id-map.json` ao lado do tasks.json | `{ "<ID>": { "number", "id" } }`, gravado a cada issue criada |
| `--fio-condutor` | `inputs/fio-condutor.md` | arquivo com os RF do fio condutor; ausente → label `fio-condutor` não aplica |
| `--change` | — | atualiza as issues existentes (`gh issue edit`) e cria as novas, inclusive stories e tasks SEC do Deliver |
| `--dry-run` | — | mostra o plano sem escrever no GitHub |

Ambiente: `GH_BIN` (binário do `gh`, padrão `gh`) e `GH_REPO`. O `gh` precisa estar autenticado com
acesso de escrita ao repositório. Se um `GITHUB_TOKEN` inválido estiver no ambiente, rode com
`env -u GITHUB_TOKEN` para o `gh` usar a credencial do `gh auth`.

## O que vira o quê

| tasks.json | GitHub |
|---|---|
| epic | issue com label `epic` |
| feature | issue com label `feature`, sub-issue do epic |
| story | issue com label `story`, sub-issue da feature (ou do epic, se não houver feature) |
| task | item de checklist no corpo da story: tipo, `snArtifact` (kind, table, fluentFile, nowId) e cenários de aceite |

- **Labels:** `sn:<kind>` de cada `snArtifact.kind` das tasks da story, e `fio-condutor` quando algum RF da
  story está em `inputs/fio-condutor.md`. Labels ausentes são criados (`gh label create --force`). No
  `--change`, label gerenciado que deixou de valer sai; label posto à mão fica.
- **Corpo:** começa com `<!-- logical-id: <ID> -->`. Story com `uiContext.screenshot` leva a imagem por
  `https://github.com/<dono>/<repo>/blob/<sha do HEAD>/<caminho>?raw=1`.
- **Vínculo:** `gh api -X POST repos/{dono}/{repo}/issues/{pai}/sub_issues -F sub_issue_id=<id numérico>`.

## Bloqueios

- **Gate de autossuficiência:** roda `spec-tasks/scripts/validate-tasks-selfsufficiency.mjs` antes de tudo,
  inclusive no `--dry-run`. FATAL ou validador que não analisa o arquivo → exit 3.
  `SN_TASKS_GITHUB_SKIP_SELFSUFFICIENCY_GATE=1` desliga (só emergência, registrar no sync-log).
- **Print obrigatório:** story com `uiContext.screenshot` cujo arquivo não existe, não está commitado
  (`git ls-files --error-unmatch`) ou tem modificação pendente → exit 4 com a lista de telas. Faça o
  commit **e o push** do PNG antes de publicar; sem push, o permalink não abre (o CLI avisa).

## Idempotência

Correlação logical-id → issue: `id-map.json`; para o que não está nele, uma busca
`gh issue list --search "logical-id in:body"` conferida pelo marcador exato no corpo. Sem `--change`,
issue que já existe não é tocada nem duplicada. Com `--change`, issue sem diferença de título, corpo
e labels não é editada. Versione o `id-map.json` junto com o `tasks.json`.

## Exit codes

`0` sucesso · `1` erro fatal · `2` falha parcial (erros por item) · `3` gate de autossuficiência · `4` print obrigatório com problema.

## Testes

`node --test ".claude/skills/sn-tasks-github/lib/*.test.mjs"` (gh simulado por executor injetado).
