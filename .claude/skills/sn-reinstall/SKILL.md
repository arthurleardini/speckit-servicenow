---
name: sn-reinstall
description: >
  sn-reinstall (Explore, Plan e Deliver — instalação na instância ServiceNow) — confere o prefixo da
  instância e os documentos do seed, roda now-sdk build e install, compara a contagem de registros
  com _contagem.json, roda a suíte ATF cob-regressao e escreve a linha now-sdk-install no sync-log.
  Invocar com `npm run reinstall` depois de gerar ou alterar o app, ou quando pedirem "instalar",
  "subir na instância", "reinstalar a demo". O --zerar (desinstala e reinstala) exige --confirmo.
version: "0.1"
updated: "2026-11-24"
---

# sn-reinstall — Build, install e conferências

Extensão do projeto (design v0, item 30). A credencial fica em `.env.instancia`; o script carrega o
arquivo sozinho e nunca imprime os valores. A IA não lê esse arquivo.

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
npm run reinstall                          # caminho normal
npm run reinstall -- --frozen              # build com --frozenKeys (CI, ensaio)
npm run reinstall -- --zerar --confirmo    # install --reinstall (apaga o que foi criado na instância)
```

Outras flags: `--sem-atf`, `--suite <nome>` (padrão `cob-regressao`), `--sync-log <arquivo>`
(padrão `outputs/spec/sync-log.md`), `--recibo-dir <pasta>` (repassado ao `atf.mjs`).

## Etapas

| # | Etapa | Para com |
|---|---|---|
| 1 | `glide.appcreator.company.code` (REST Table API, basic auth) contra o escopo de `app/now.config.json`: o escopo precisa começar com `x_<prefixo>_` | exit 3 |
| 2 | todo CPF/CNPJ em `app/src/fluent/seed/*.now.ts` com DV válido e presente em `_documentos.json` | exit 5 |
| 2b | poda do `keys.ts`: tira as entradas `deleted: true` cuja tabela do app já não existe na instância (consulta `sys_db_object`). Avisa para versionar o `keys.ts` | — |
| 3 | `now-sdk build` (ou `build --frozenKeys` com `--frozen`). Avisa quando o `keys.ts` mudou | linha `falha-build` |
| 4 | `now-sdk install` (em modo CI não leva `--auth`; fora dele, `--auth $SN_ALIAS`). Com `--zerar`, `--reinstall` | linha `falha-install` |
| 4b | apaga pela REST API os registros de dados com `deleted: true` no `keys.ts` (tabelas do app, `sys_user`, `sys_user_has_role`, `sys_journal_field`): o install aplica o DELETE de metadado, mas não o de registro de dados | — |
| 5 | contagem por tabela pela Aggregate API (`/api/now/stats/<tabela>?sysparm_count=true`) contra `_contagem.json`: exata nas tabelas do app e nos usuários demo; mínimo no journal | linha `falha-contagem` |
| 6 | suíte ATF `cob-regressao`, se existir na instância, via `.claude/skills/sn-implement/scripts/atf.mjs --suite` | linha `falha-atf` |
| 7 | linha no `sync-log.md` | — |

`--zerar` sem `--confirmo` é recusado antes de qualquer acesso à instância (exit 4).

## `--frozenKeys`

A doc do SDK (`configuration/ci-integration.md`) confirma: `build --frozenKeys` compara o `keys.ts`
antes e depois e **falha** se a build acrescentou ou mudou chave ("Keys file is out-of-date"). Por
isso o padrão em desenvolvimento é o build normal, que atualiza o `keys.ts` (o script avisa para
versionar). O `--frozen` serve ao ensaio e ao CI, quando o `keys.ts` já está commitado.

## Linha do sync-log

Seção A, nove colunas (`COLUNAS_SECAO_A` em `.claude/hooks/kit.mjs`), mais recente no topo. Se o
arquivo não existe, nasce do template `.claude/skills/spec-iterate/templates/sync-log.md`.

| Coluna | Valor |
|---|---|
| Skill | `now-sdk-install` |
| Modo / contexto | alias da instância (`SN_ALIAS`) |
| Inputs consumidos | escopo do app |
| Outputs | `git log -1 --format=%H -- app/src/fluent` |
| Decisões-chave | `<resultado>; <n> registros` — resultado `ok`, `falha-build`, `falha-install`, `falha-contagem` ou `falha-atf` |
| Próximo passo | `sn-capture` (ok) ou `corrigir e rodar npm run reinstall` |

O commit é o da última alteração em `app/src/fluent` que já está no git: o gate do Explore compara
os dois. Rodar o reinstall depois de commitar o app.

## Idempotência

Os `$id` são fixos (`keys.ts`), então um segundo install atualiza os mesmos registros. Verificado em
2026-11-24: dois installs seguidos deram a mesma contagem.

## Tabela que saiu do modelo

O install remove form, lista, ACL, role, menu e teste que saíram da fonte, mas não apaga a tabela
(`sys_db_object`). Em escopo global, o business rule "Validate Table Delete" recusa o delete se a
aplicação corrente não é a do app; no escopo do app, a política de acesso entre escopos recusa.
O que funcionou em 2026-11-24, depois do reinstall:

```js
// now-sdk exec --scope global --reason "remover tabela fora do modelo" --file <arquivo>
gs.setCurrentApplicationId('<scopeId de app/now.config.json>');
var gr = new GlideRecord('sys_db_object');
gr.addQuery('name', '<tabela>');
gr.query();
if (gr.next()) gr.deleteRecord();
```

Depois de apagar a tabela, o `keys.ts` continua com as entradas `deleted: true` dela: os registros
do seed e o `sys_dictionary`, `sys_documentation` e `sys_choice` que apontam para ela pelo
`key.name`. No install seguinte o SDK manda essas entradas como DELETE no
`author_elective_update`, a tabela não existe mais e o install quebra com
`this.fPrimaryKey is null` (estágio 1, 2026-11-24). Por isso a etapa 2b tira essas entradas do
`keys.ts` antes do build (`podarKeysOrfas` em `scripts/reinstall.mjs`). Entrada `deleted: true` de
tabela que ainda existe fica, porque é ela que remove da instância o que saiu da fonte. Depois do
reinstall, versionar o `keys.ts`.

## Módulo compartilhado

`scripts/lib/instancia.mjs` carrega a credencial, chama a REST API, roda o CLI do SDK e faz login
pelo Playwright. É usado também por `sn-capture` e `sn-implement/scripts/atf.mjs`.

## Testes

```bash
node --test .claude/skills/sn-reinstall/scripts/reinstall.test.mjs
```
