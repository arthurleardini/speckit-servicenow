---
name: sn-seed
description: >
  sn-seed (Explore e Plan — dados fictícios do app ServiceNow) — gera o seed do app Fluent a partir
  do modelo de dados: registros Record() com installMethod 'demo', CPF e CNPJ com dígito verificador
  válido a partir de uma semente fixa, 1 registro demo por tela de form, 1 usuário demo por papel
  (sem senha) e linhas de journal no registro demo. Grava _documentos.json e _contagem.json, que o
  sn-reinstall e o fecho-explore conferem. Invocar quando o modelo de dados mudar ou quando pedirem
  "gerar o seed", "dados de demonstração", "registros fictícios". O sn-scaffold já chama esta skill.
version: "0.1"
updated: "2026-11-24"
---

# sn-seed — Seed fictício do app

Extensão do projeto (design v0, decisão A9 e item 25). Quem gera é o script; a IA não escreve
registro de seed à mão.

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
node .claude/skills/sn-seed/scripts/gerar-seed.mjs \
  [--modelo outputs/spec/data-model.previa.json] [--app app] [--por-tabela 50] [--semente 20261124]
```

- `--modelo`: sem a flag, usa `outputs/spec/data-model.json` e, se não existir, `data-model.previa.json`.
- `--por-tabela`: registros gerados por tabela, de 1 a 300 (padrão 50). O teto vem do laço do Flow,
  limitado a 1.000 iterações (RN-SN-154).
- `--semente`: muda todos os valores. Mesma semente e mesmo modelo geram os mesmos arquivos.

Depois de gerar, rodar `npm run reinstall` para instalar (o `now-sdk install` carrega o demo data por
padrão).

## Formato mínimo do modelo

```json
{
  "entities": [
    {
      "name": "devedor",
      "label": "Devedor",
      "extends": "task",
      "simulation": false,
      "columns": [
        { "name": "nome", "label": "Nome", "type": "string", "mandatory": true },
        { "name": "cpf", "label": "CPF", "type": "string", "format": "cpf" },
        { "name": "situacao", "label": "Situação", "type": "choice",
          "choices": [{ "value": "ativo", "label": "Ativo" }] },
        { "name": "responsavel", "label": "Responsável", "type": "reference", "reference": "sys_user" },
        { "name": "ficticio", "label": "Fictício", "type": "boolean" }
      ]
    }
  ],
  "screens": [{ "id": "TEL-01", "title": "Ficha do devedor", "table": "devedor", "type": "form", "role": "atendente" }],
  "roles": ["coordenador", "atendente", "admin"]
}
```

| Campo | Regra |
|---|---|
| `entities[].name` | sufixo da tabela (`devedor`) ou nome completo (`x_2326104_cob_devedor`). O prefixo vem de `app/now.config.json`. Nome completo com até 30 caracteres |
| `columns[].type` | `string`, `integer`, `decimal`, `boolean`, `reference`, `choice`, `glide_date`, `glide_date_time`, `journal`, `journal_input`, `currency` |
| `columns[].format` | `cpf` ou `cnpj` em coluna `string`: o valor sai formatado e com DV válido |
| `columns[].reference` | tabela do próprio modelo (pelo sufixo) ou tabela existente (`sys_user`) |
| `choices` | lista de `{ value, label }`, lista de strings ou objeto `{ valor: rótulo }` |
| `screens[]` | `id` no padrão `TEL-`, `table` do modelo, `type` `form`, `list` ou `report`, `role` de `roles` |
| `roles` | sufixos; viram `<escopo>.<sufixo>`. Sem o campo, `coordenador`, `atendente` e `admin` |
| `demoUsers` | opcional. `[{ "user": "demo.atendente2", "role": "atendente", "label": "Atendente B" }]`: usuário demo a mais, além do `demo.<role>`. `user` começa com `demo.`; `role` está em `roles` |

## O que é gerado (`app/src/fluent/seed/`)

| Arquivo | Conteúdo |
|---|---|
| `<sufixo>.now.ts` | N registros `seed_<sufixo>_<nnn>` + 1 registro `Now.ID['<TEL>_registro_demo']` por tela de form da tabela |
| `_usuarios.now.ts` | `sys_user` `demo.<role>` e os de `demoUsers` (sem senha), e o `sys_user_has_role` de cada um |
| `_journal.now.ts` | 2 ou 3 linhas em `sys_journal_field` por registro demo, na primeira coluna `journal_input` |
| `_documentos.json` | todo CPF e CNPJ gerado, com tabela, coluna e `$id` |
| `_contagem.json` | contagem esperada por tabela e os extras (usuários demo; journal como mínimo) |

Regras dos valores:

- coluna `ficticio` (boolean) sempre `true`;
- coluna de nome em tabela com CNPJ recebe razão social fictícia; nas demais, nome de pessoa fictício;
- e-mail em `@exemplo.invalid`, telefone com DDD `00`;
- referência a tabela do modelo aponta para um registro do seed (`Now.ref(tabela, chave)`);
  referência a `sys_user` aponta para um usuário demo; se a coluna tem o nome de um role (ex.: `atendente`),
  os registros se distribuem em rodízio entre os usuários demo desse role (a carteira de cada um);
- tabela com tela de form recebe, na normalização, a coluna `comentarios` (`journal_input`) e `audit`,
  como o `sn-scaffold` gera.

Cada tabela usa uma semente própria derivada da semente geral e do nome da tabela: incluir uma
tabela nova não muda os valores das outras.

## Journal

Os registros de `sys_journal_field` entram como `Record()` de demo data. Na instância de
desenvolvimento eles aparecem no activity stream do form, com o usuário do install como autor
(verificado em 2026-11-24). O campo `element_id` recebe o `sys_id` do registro demo por
`Now.ref(tabela, '<TEL>_registro_demo')`.

## Regerar

O script apaga de `seed/` os `.now.ts` que ele mesmo gerou antes e que saíram do modelo (arquivo
com o cabeçalho `// gerado por sn-seed`). Arquivo escrito à mão na pasta não é tocado.

O registro cujo `$id` sumiu da fonte fica com `deleted: true` no `keys.ts`, mas o `now-sdk install`
**não** apaga registro de tabela de dados (seed, `sys_user`, `sys_journal_field`); só metadado.
Verificado em 2026-11-24. Quem apaga é o `npm run reinstall` (etapa 4b do `sn-reinstall`).

## Testes

```bash
node --test .claude/skills/sn-seed/scripts/gerar-seed.test.mjs
```
