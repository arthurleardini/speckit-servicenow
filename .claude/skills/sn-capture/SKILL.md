---
name: sn-capture
description: >
  sn-capture (Explore e Deliver — prints da instância ServiceNow) — abre cada tela do
  outputs/spec/screens-manifest.json na instância, na visão do papel da tela (impersonate do usuário
  demo.<role>), e grava o PNG 1440×900 em outputs/spec/screens/<TEL>.png, atualizando screenshot e
  capturedAt no manifesto. No Deliver, --story grava em screens/deliver/<STORY>-<TEL>.png. Invocar
  com `npm run capture` depois do `npm run reinstall`, ou quando pedirem "tirar os prints",
  "capturar as telas".
version: "0.1"
updated: "2026-11-24"
---

# sn-capture — Prints na visão do papel

Extensão do projeto (design v0, decisão A10 e item 26).

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
npm run capture                              # todas as telas do manifesto
npm run capture -- --tel TEL-01,TEL-02       # só algumas
npm run capture -- --story RF-MOD-F1-001     # Deliver: screens/deliver/<STORY>-<TEL>.png
```

Outras flags: `--manifesto <arquivo>` (os PNG ficam em `<pasta do manifesto>/screens/`) e
`--moldura` (abre a rota dentro do cabeçalho da instância, `/now/nav/ui/classic/params/target/...`).

## Passos

1. Carrega `.env.instancia` e faz login em `/login.do` com o usuário da credencial (admin).
2. Para cada tela: impersonate de `demo.<role>`, abre a rota, espera a rede parar, confere que a
   página não mostra "Record not found" nem "Security constraints prevent access" e que o usuário
   da página é o do papel.
3. PNG 1440×900, menor que 5 MB; `screenshot` (relativo a `outputs/spec/`) e `capturedAt` no
   manifesto. No modo `--story` o manifesto não muda.
4. Desfaz a impersonação (impersonate de volta ao usuário da credencial) e fecha o navegador.

Sai com código 1 se alguma tela falhar (as outras são capturadas) e 2 em erro de configuração.

## Impersonação

Usa o endpoint `POST /api/now/ui/impersonate/<sys_id do usuário>` pela sessão do navegador
(`page.request`, que leva o cookie), com o cabeçalho `X-UserToken` lido de `window.g_ck`. Verificado
em 2026-11-24: responde 201, e a página seguinte abre com `g_user.userName = demo.<role>`. O
usuário demo não tem senha; o admin impersona sem ela. Tela sem `role` é capturada como o usuário
da credencial.

## Pré-requisitos

- usuários `demo.<role>` instalados (`npm run reinstall`, seed do `sn-seed`);
- Playwright na raiz (`node_modules/playwright`) com o Chromium instalado.

## Testes

```bash
node --test .claude/skills/sn-capture/scripts/capture.test.mjs
```
