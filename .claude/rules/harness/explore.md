---
description: Fase Explore — pré-projeto conversacional que fecha com quatro documentos e o app preliminar instalado na instância ServiceNow como protótipo.
paths: ".claude/rules/harness/explore.md"
---

# 🔍 Explore — pré-projeto

## Comportamento

Conversacional, *human in the loop*, **sem cadeia obrigatória de skills**. Negócio comanda,
técnico apoia. O trabalho é descobrir; os templates são onde a descoberta assenta.

Push direto na `main` é aceitável nesta fase.

## Primeiro artefato, antes de qualquer outro

`workspace.md` na raiz — o manifesto multi-repo. Ele declara o papel de cada repositório
(`docs`, `codigo`, `prototipo`) e é o que o `delivery-gate` usa depois para decidir o que
fiscalizar. Repositório com papel não declarado tem push negado.

Valide com: `node .claude/hooks/workspace.mjs --validar`

**Layout dos repositórios no disco.** Com mais de um repositório, a sessão abre na **pasta-pai**,
com os repositórios lado a lado como subpastas dela; o repo de docs é a única subpasta com
`outputs/explore/` e `outputs/spec/`. Repositório **aninhado** dentro do de docs (o de código em
`codigo/`, por exemplo) não é suportado: o harness cai em mono-repo e o `delivery-gate` passa a
negar o push do próprio repo de docs. O `--validar` e o aviso do início da sessão acusam esse
layout pela coluna «Pasta local» do manifesto.

Logo em seguida, `outputs/spec/sync-log.md` com a linha de kickoff — é a memória cronológica única
das três fases, e é nele que o `npm run reinstall` registra cada install.

## O que o Explore entrega

| Artefato | Caminho | Status no fecho |
|---|---|---|
| `workspace.md` | raiz | válido |
| `hld-funcional.md` | `outputs/explore/` | completo |
| `especificacao-funcional.md` | `outputs/explore/` | cobertura completa, profundidade preliminar |
| `especificacao-tecnica.md` | `outputs/explore/` | preliminar |
| `modelo-de-dados.md` | `outputs/explore/` | preliminar; é a entrada da `spec-data-model --previa` |
| `gaps.md` | `outputs/explore/` | vivo |
| `sync-log.md` | `outputs/spec/` | com linha de kickoff |
| `data-model.previa.json` | `outputs/spec/` | prévia do modelo, da `spec-data-model --previa` |
| app preliminar | `app/` (Fluent) | instalado na instância, install registrado no `sync-log.md` |
| `screens-manifest.json` e `screens/<TEL>.png` | `outputs/spec/` | rota e print para toda `TEL-` |

Neste kit o `modelo-de-dados.md` é necessário na prática: sem ele não há prévia do modelo, nem
scaffold, nem app na instância. Para o fecho, a ausência dele **exige linha de dispensa no
`gaps.md`** — decisão não registrada é decisão não tomada. A linha vai na tabela «Dispensas
registradas» do template, com o nome do arquivo na primeira coluna e Motivo, Quem decidiu e Data
preenchidos de verdade:

```markdown
| modelo-de-dados.md | o modelo nasce direto da spec-data-model no Plan | Fulana de Tal | 2026-08-25 |
```

O fecho confere: sem o documento e sem essa linha, ele nega e mostra a linha a escrever. Campo com
o token de exemplo (`<quem decidiu>`), vazio ou só com traço não conta.

Os templates estão em `.claude/templates/`. Copie para `outputs/explore/` e preencha.

## Vocabulário — quatro famílias, nada mais

`MOD-CODIGO` · `RF-nnn` · `RN-nnn` · `GAP-nnn`

`F-xxx` é proibido aqui. Ver `CLAUDE.md`, seção Vocabulário de IDs.

Neste kit a tabela de telas usa `TEL-nnn`, e as integrações simuladas usam `SIM-nn`
(`inputs/simulacoes.md`). São rótulos de tela e de simulação, não famílias de requisito.

## Ordem interna — por dependência real, não por decreto

1. `workspace.md` e `sync-log.md` com a linha de kickoff
2. *opcional:* `spec-frame`, só se o pedido chegou vago (sem mudança)
3. `spec-ingest`
4. *opcional, fora do v0:* `spec-legacy` (e `spec-benchmark`)
5. `hld-funcional.md` — visão, módulos com `MOD-CODIGO`, funcionalidades por módulo
6. `especificacao-funcional.md` — personas, matriz de acesso com as roles `<escopo>.*`, a tabela
   de telas `TEL-` (tabela, tipo, visão, papel, registro demo), `RF-nnn` e `RN-nnn`
7. `especificacao-tecnica.md` e `modelo-de-dados.md` preliminares — os dois obrigatórios aqui
8. `spec-data-model --previa` → `outputs/spec/data-model.previa.json`
9. `sn-scaffold` — `Table()`, `Form()`/`List()` por `TEL-`, menu, roles, ACL base, usuários demo e
   seed fictício (chama o `sn-seed`); grava o `screens-manifest.json` depois do build
10. `npm run reinstall` — build e install na instância, com a linha de install no `sync-log.md`
11. `sn-capture` — print de cada `TEL-` com o usuário demo do papel → `outputs/spec/screens/<TEL>.png`
12. revisão do `gaps.md` contra a instância
13. `fecho-explore`

O passo 9 não roda antes do 8 por dependência real: o scaffold lê a prévia do modelo e a tabela de
telas. O passo 12 é o retorno esperado — a tela de verdade encontra erro de entendimento mais rápido
que qualquer documento, e o que a Core UI não faz como o plano pede vira GAP.

## Aceleradores opcionais

`spec-legacy` e `spec-benchmark` estão disponíveis e não são obrigatórios; no v0 ficam como na
base, fora do caminho.

`spec-legacy` e `spec-benchmark` exigem `outputs/spec/context-map.md` (validadores `V-LEG-01` e
`V-BEN-01`). Portanto **quem quer uma das duas roda `spec-ingest` primeiro** — é um pacote, não
três escolhas independentes. Os três escrevem nos seus caminhos nativos em `outputs/spec/` e o
Plan herda pronto, rodando a `spec-ingest` em modo delta.

**`spec-frame` — só para pedido vago, e antes de tudo.** Quando o que chegou é uma frase solta
(«o cliente quer modernizar o X») e ainda não há material para a `spec-ingest` ancorar, a
`spec-frame` enquadra o problema, levanta hipóteses (`HIP-xxx`) e o plano de levantamento
(`PRB-xxx`), e grava `outputs/spec/frame.md` (mais o pré-protótipo descartável em
`outputs/spec/frame/pre-prototype/`, se houver). A ordem é `spec-frame` → `spec-ingest`: a
ingestão lê o `frame.md` como fonte, e hipótese não vira `F-xxx`. A Decisão 71 tirou a skill do
**fluxo padrão** — o pré-projeto do Explore é o enquadramento, e com material rico ela mesma se
declara desnecessária —, mas não a proibiu: este é o único lugar onde ela roda. No Plan ela não
roda (`.claude/rules/harness/plan.md`).

## Protótipo — a instância é o protótipo

Não há protótipo HTML. Depois do modelo de dados preliminar, o app é gerado em `app/src/fluent/`
pelo `sn-scaffold`, instalado na instância pelo `npm run reinstall` e fotografado pelo `sn-capture`.
O cliente valida a tela que vai existir. A constituição da tela é
`.claude/rules/harness/servicenow-ui.md` (Core UI clássica, UI16); Workspace, Portal e UI Builder
ficam fora.

- **Escrita de modelo no Explore:** só a prévia, `outputs/spec/data-model.previa.json`. O
  `data-model.json` final é do Plan.
- **Dados:** só fictícios. CPF e CNPJ com DV válido de semente fixa, `ficticio = true` nos
  registros de pessoa e a lista dos documentos gerados em `app/src/fluent/seed/_documentos.json`.
- **Instalação:** só por `npm run reinstall`. Ele confere o prefixo de escopo da instância contra
  `app/now.config.json` e escreve a linha de install na Seção A do `sync-log.md` (Skill
  `now-sdk-install`, o alias da instância, o escopo, o commit de `app/src/fluent` e `ok; N
  registros`). Commite o que mudou em `app/src/fluent/` **antes** do reinstall: o commit da linha
  tem que ser o último commit daquela pasta.
- **Telas fora do padrão** (dossiê consolidado, painel de KPIs) entram como form com related lists
  e report simples, com a diferença registrada como GAP.

**O fecho confere três condições** sobre o app, além dos documentos:

1. toda `TEL-` da tabela de telas tem `route` e `screenshot` no `outputs/spec/screens-manifest.json`,
   e o PNG existe;
2. a última linha de install do `sync-log.md` tem resultado `ok` e commit igual a
   `git log -1 --format=%H -- app/src/fluent` — app mudado depois do install não fecha;
3. todo CPF ou CNPJ encontrado em `app/src/fluent/seed/` está em `_documentos.json`.

Faltando alguma, o fecho nega e lista o que falta. A saída legítima para pré-projeto reduzido
continua sendo a isenção (ver **Marco da fase**).

## Forma agora, profundidade no Plan

O fecho valida **presença, gramática e preenchimento** — nunca profundidade. Documento preenchido
e raso passa; documento **vazio** não passa.

Isso é deliberado: lacuna vira `GAP-nnn`, e profundidade é o que o Plan agrega via `spec-product`.
`gaps.md` com GAPs abertos **não bloqueia** — GAP aberto é combustível do Plan, não defeito do
Explore.

Não deixe token de preenchimento (`<produto>`, `<CODIGO>`, `<nnn>`, `<data>`) no documento
entregue. Se um campo não se aplica, escreva por que não se aplica — não deixe o placeholder.

## Cabeçalho de todo documento do Explore

Este é o contrato. Os cinco documentos de `outputs/explore/` precisam das duas coisas abaixo, e o
`gramatica.mjs` avisa na hora quando falta uma delas. Os templates de `.claude/templates/` já
nascem com as duas — copiar e preencher basta.

**1. Uma versão declarada na linha de cabeçalho.** A palavra *Versão*, dois-pontos, e o número, na
mesma linha:

```markdown
> **Fase:** Explore · **Versão:** 0.1 · **Status:** preliminar
```

A forma acima é a dos templates e é a que se recomenda. O que o harness exige é menos que isso: a
ênfase é opcional, os dois-pontos podem estar dentro ou fora dela, e o espaçamento é livre —
`**Versão:** 0.1`, `**Versão**: 0.1`, `*Versão:* 0.1` e `Versão: 0.1` são todos aceitos. O que
**não** é aceito é a ausência: documento sem nenhuma versão declarada. A coluna `Versão` da tabela
do changelog não conta — ela é o cabeçalho da tabela, não a declaração do documento.

**2. Uma seção de changelog.** Um título de `##` a `####` cujo texto seja *Changelog*:

```markdown
## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-08-27 | versão inicial |
```

Nível, caixa, numeração (`## 0. Changelog`) e sufixo (`## Changelog do documento`) são livres. O
que **não** é aceito é a ausência da seção.

**Por que as duas.** O documento do Explore é revisado pelo cliente mais de uma vez, e o
`revisao.mjs` e o fecho de fase comparam revisões. Sem versão e sem changelog não há como dizer o
que mudou entre a conversa da semana passada e a desta — e é exatamente essa a pergunta que o
Nível 1 do caminho de revisão faz.

**Este é o dono do contrato.** Até a rodada J ele não tinha nenhum: as duas regex do
`gramatica.mjs` eram a única definição no repositório inteiro, de modo que ninguém tinha decidido
o quão rígidas elas deviam ser. Se o contrato mudar, muda aqui primeiro — e o `gramatica.mjs`
segue. Nem a rule nem o verificador exigem profundidade: uma linha de changelog é uma linha de
changelog.

## Caminho de revisão — quem lê o quê

| Nível | Quem | Tempo | O que lê |
|---|---|---|---|
| 1 | Decisor | ~10 min | `hld-funcional.md` mais o relatório do `revisao.mjs` |
| 2 | Validador de negócio | ~1 h | o app na instância (ou os prints de `outputs/spec/screens/`), mais a `especificacao-funcional.md` do seu módulo |
| 3 | Auditoria | sob demanda | `gaps.md`, `sync-log.md` e, se o pacote opcional rodou, `context-map.md` |

A instância é o principal instrumento de revisão: clicar na tela que vai existir, com os dados
fictícios e no papel de quem a usa, encontra erro de entendimento mais rápido que ler documento.

O `product-discovery-kit.html` **não** é entregável do Explore — é do Plan.

## Marco da fase

O `fecho-explore` morde na primeira escrita em `outputs/spec/` fora da whitelist do Explore, ou na
invocação de uma skill de fase Plan. Ele verifica presença, gramática, preenchimento, a linha de
dispensa do `modelo-de-dados.md` ausente, as três condições do app (rota e print por `TEL-`,
install `ok` no commit atual de `app/src/fluent`, seed só com documentos de `_documentos.json`) e o
relatório de revisão. Pré-projeto legitimamente reduzido declara isenção em arquivo,
com repositório, autor, data e motivo.

### A isenção — onde mora e como se escreve

Até aqui quem ensinava isto era a mensagem de negação. Funciona, mas depender de ser barrado para
descobrir que a saída de emergência existe é frágil, e ela é a **única** saída do único verificador
bloqueante desta camada.

O arquivo mora em **`outputs/spec/auditorias/_isencoes/`**. O nome dele é livre — o que o gate lê é
o bloco:

```markdown
<!-- gate:isencao -->
repositorio: https://dev.azure.com/acme/portal/_git/portal-docs
autor: Fulana de Tal
data: 2026-08-25
motivo: pré-projeto herdado de outro fornecedor, já especificado em contrato anterior
<!-- /gate:isencao -->
```

**Os quatro campos têm que ser preenchidos de verdade.** Campo vazio, campo só com espaço e campo
que ainda carrega o token de exemplo entre `<` e `>` — `<quem decidiu>`, `<AAAA-MM-DD>` — são
recusados, e o gate continua negando. Isso é deliberado: colar o bloco de exemplo sem editar
liberava o Plan de um pré-projeto vazio, o que fazia da isenção um botão de desligar em vez de uma
trilha de auditoria. O que **não** é conferido é o conteúdo em si — data plausível, URL que
resolve, autor que exista. Isso é julgamento humano sobre uma decisão humana.

Não há ledger agregado: o registro é o próprio arquivo, versionado no git com autor e data. É por
isso que os quatro campos importam — eles são a trilha.

Num workspace multi-repo, o arquivo vai em `outputs/spec/auditorias/_isencoes/` **do repo de
docs**, o mesmo lugar onde moram os outros artefatos. Se o gate reclamar de *workspace
indeterminado*, é porque há mais de uma subpasta com `outputs/explore/` e `outputs/spec/` e ele não
sabe qual é o repo de docs: `node .claude/hooks/workspace.mjs --validar` diz quais são as
candidatas.
