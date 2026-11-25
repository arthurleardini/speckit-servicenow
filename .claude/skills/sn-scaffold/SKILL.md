---
name: sn-scaffold
description: >
  sn-scaffold (Explore e Plan — esqueleto do app ServiceNow) — gera o app Fluent a partir do modelo
  de dados e da tabela de telas: Table() com colunas e choices, Form() e List() por tela TEL-,
  report, menu com módulos, roles, ACL de leitura por role, tabelas de integração simulada e o seed
  (via sn-seed). Roda o now-sdk build e grava o outputs/spec/screens-manifest.json com a rota de
  cada tela na instância. Invocar depois do spec-data-model (--previa no Explore, final no Plan) ou
  quando pedirem "gerar o app", "scaffold", "criar as tabelas e telas na instância".
version: "0.1"
updated: "2026-11-24"
---

# sn-scaffold — Esqueleto Fluent do app

Extensão do projeto (design v0, item 24). Quem gera é o script; a IA não escreve à mão os arquivos
que ele produz.

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

## Como rodar

```bash
node .claude/skills/sn-scaffold/scripts/scaffold.mjs \
  [--modelo outputs/spec/data-model.previa.json] [--app app] [--por-tabela 50] [--semente N] \
  [--sem-build] [--manifesto outputs/spec/screens-manifest.json]
```

Em seguida: `npm run reinstall` (instala) e `npm run capture` (prints).

O modelo é o mesmo do `sn-seed` (formato em `.claude/skills/sn-seed/SKILL.md`), com dois campos a mais:

| Campo | Regra |
|---|---|
| `entities[].simulation` | `true` para integração simulada (`SIM-`): o arquivo vai para `simulations/`, o rótulo ganha "(Simulado)" e a tabela ganha a coluna `falhar` (interruptor de falha) |
| `modules` | opcional. `[{ "id": "MOD-F1", "label": "F1 Cadastro", "screens": ["TEL-01"], "tables": ["devedor"] }]`. Sem `items`: cada módulo vira um separador no menu (o `label`; `title` também vale), seguido de um módulo de lista por tabela. Sem o campo, um módulo de lista por tabela. Com `items`: menu por área de trabalho (abaixo) |
| `modules[].items` | opcional. Módulos de menu da área. Ver "Menu por área de trabalho" |
| `adminTables` | opcional. `true` acrescenta a área "Administração", visível só para o papel admin, com uma lista por tabela do modelo |
| `processFlows` | opcional. Trilha de etapas no topo do form. Ver "Trilha de etapas" |
| `screens[].fields` | opcional. Campos da tela, na ordem. Sem o campo: form com todas as colunas, lista com as 6 primeiras |

## Menu por área de trabalho

O menu se organiza pelo trabalho de cada papel, não por tabela. Quando algum módulo do modelo
tem `items`, o menu entra nesse modo: cada módulo com `items` é uma área (um separador no menu)
seguida dos módulos dela. Módulo sem `items` não aparece no menu; as tabelas cruas ficam só na
área "Administração" (`adminTables: true`), para o admin.

O exemplo abaixo monta a área "Minha lista", com a fila do atendente e um report para o coordenador:

```json
"modules": [
  { "id": "MOD-UX-LISTA", "label": "Minha lista", "tables": ["x_2326104_cob_contato"], "order": 100,
    "items": [
      { "label": "Minha lista", "type": "FILTER", "table": "x_2326104_cob_contato",
        "filter": "atendente=javascript:gs.getUserID()^status!=encerrado^ORDERBYproxima_acao_em",
        "view": "minha_lista", "roles": ["atendente"] },
      { "label": "Funil do crédito", "type": "REPORT", "report": "TEL-026", "roles": ["coordenador"] },
      { "label": "Outros", "type": "SEPARATOR" },
      { "label": "Ajuda", "type": "DIRECT", "link": "x_2326104_cob_ajuda.do" }
    ] }
],
"adminTables": true
```

| Campo do módulo | Regra |
|---|---|
| `label` (ou `title`) | título no menu; único dentro da área |
| `type` | `FILTER` (lista filtrada), `LIST`, `DIRECT` (URL relativa), `REPORT` ou `SEPARATOR` (subgrupo). Sem o campo: `REPORT` se tem `report`, `DIRECT` se tem `link`, `FILTER` se tem `filter`, senão `LIST` |
| `table` | tabela do modelo (FILTER e LIST) |
| `filter` | encoded query (a consulta no formato da plataforma), com `ORDERBY` se precisar |
| `view` | nome da view da lista (`view_name` do módulo) |
| `roles` | sufixos dos papéis do app (viram `<escopo>.<papel>`) ou papel da plataforma (`admin`). Sem o campo: os da área; sem eles, todos os do app |
| `order` | posição; sem o campo, segue a sequência de 100 em 100 |
| `report` | id da tela report (`TEL-`); o módulo aponta para o `sys_report` dela por `Now.ref('sys_report', '<TEL>_report')`, que o build resolve pelo `keys.ts` |
| `link` | URL relativa do DIRECT; URL com host é recusada |

A área aceita `roles` (quem vê o separador; sem o campo, a união dos papéis dos módulos dela) e
`order`. A área "Administração" usa o papel `admin` do app; se o app não tiver esse papel, usa o
`admin` da plataforma.

## Trilha de etapas

`processFlows` põe a trilha de etapas (o process flow da Core UI) no topo do form da tabela. Cada
etapa acende quando a `condition` (encoded query) vale para o registro:

```json
"processFlows": [
  { "table": "x_2326104_cob_contato", "field": "status",
    "steps": [
      { "label": "A ligar", "condition": "status=a_ligar", "order": 100 },
      { "label": "Retornar", "value": "retornar" },
      { "label": "Encerrado", "condition": "status=encerrado" }
    ] }
]
```

Com `field`, a etapa pode trazer `value` no lugar de `condition` (vira `<field>=<value>`). Sem
`order`, as etapas seguem de 100 em 100. É gerado `ui/_processflow_<sufixo>.now.ts` com o
`sys_ui_formatter` do macro `process_flow.xml` para a tabela (a instância não tem esse formatter
global, só por tabela da plataforma) e um `sys_process_flow` por etapa. Todo `Form()` gerado da
tabela, em qualquer view, ganha a trilha como primeiro elemento da primeira seção.

## O que é gerado (`app/src/fluent/`)

| Pasta | Conteúdo |
|---|---|
| `tables/<sufixo>.now.ts` | `Table()` com colunas, choices, `allowWebServiceAccess` e, nas tabelas com form, `audit: true` e a coluna `comentarios` (`journal_input`) |
| `simulations/<sufixo>.now.ts` | o mesmo, para `simulation: true` |
| `ui/<TEL>.now.ts` | `Form()` (form-layout-guide: duas colunas a partir de 4 campos curtos, texto longo e journal em uma coluna, seção "Atividades" com o activity stream) ou `List()`; tela `report` vira `sys_report` de barras agrupado pela primeira coluna choice |
| `ui/_form_<sufixo>.now.ts` | form na view padrão para tabela sem tela de form (regra 6 do table-guide) |
| `ui/_processflow_<sufixo>.now.ts` | formatter e etapas da trilha (só com `processFlows`) |
| `navigation/menu.now.ts` | `ApplicationMenu` + módulos `sys_app_module` (separadores, listas, filtros, reports e links) |
| `security/roles.now.ts` | `Role()` `<escopo>.<role>` |
| `security/acl-base.now.ts` | `Acl()` de leitura (tabela e `*`) por tabela, para todas as roles do app |
| `seed/` | ver `sn-seed` |

Views: a primeira tela de form e a primeira de lista de cada tabela usam a view padrão; as
seguintes ganham `sys_ui_view` própria (`<escopo>_<tel>`) e a rota leva `sysparm_view`.

## Manifesto (`outputs/spec/screens-manifest.json`)

Gravado depois do build. Contrato em `.claude/skills/tools/references/screens-manifest.md`.

| Tipo | Rota |
|---|---|
| list | `/<tabela>_list.do` |
| form | `/<tabela>.do?sys_id=<sys_id de Now.ID['<TEL>_registro_demo'] no keys.ts>` |
| report | `/sys_report_template.do?jvar_report_id=<sys_id de Now.ID['<TEL>_report']>` |

Campos por tela: `id`, `title`, `route`, `type`, `role`, `table`, `screenshot`, `capturedAt`. Quando a
rota não muda, `screenshot` e `capturedAt` anteriores são mantidos; quando muda, voltam a `null`.

## Validações

- tabela com até 30 caracteres, só minúsculas, números e `_`;
- coluna sem prefixo `sys_` e sem repetição; tipo da lista do `sn-seed`;
- tela com tabela do modelo, tipo `form`/`list`/`report` e role existente;
- módulo de área com tipo válido, tabela do modelo, tela report existente, link relativo, papel
  existente e label único na área;
- trilha com tabela e campo existentes, etapas com label único e condição;
- depois do build, toda chave de registro demo e de report presente no `keys.ts`.

## Regerar

Arquivos com o cabeçalho `// gerado por sn-scaffold` que saíram do modelo são apagados; o SDK
transforma em DELETE, no install seguinte, o metadado que sumiu da fonte (form, lista, ACL, role,
menu, coluna). Tabela inteira que saiu do modelo continua na instância: ver "Tabela que saiu do
modelo" no `sn-reinstall`. Arquivo sem o cabeçalho não é
tocado. Mudança à mão num arquivo gerado se perde na próxima geração.

## Testes

```bash
node --test .claude/skills/sn-scaffold/scripts/scaffold.test.mjs
```

O último teste roda `now-sdk build` de verdade numa cópia temporária do app (pula se o SDK não
estiver em `app/node_modules`).
