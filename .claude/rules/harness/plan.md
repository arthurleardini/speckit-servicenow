---
description: Fase Plan — ingestão do pré-projeto, discovery aprofundado e cadeia técnica até o backlog publicado em issues do GitHub, com a matriz de rastreio.
paths: ".claude/rules/harness/plan.md"
---

# 📐 Plan — discovery aprofundado e especificação técnica

## Comportamento

*Human in the loop*. O soberano é o `Elo-Spec-Kit`: a partir daqui, artefato e processo saem das
skills `spec-*`, e o vocabulário de `outputs/spec/` vence sem exceção.

## Tempo A — ingerir o pré-projeto e aprofundar o discovery

| Skill | Papel |
|---|---|
| `spec-frame` | Não roda no Plan: o pré-projeto do Explore é o enquadramento (a skill se declara desnecessária). Se o pedido chegou vago, ela já rodou no Explore, antes da `spec-ingest` — acelerador opcional, ver `.claude/rules/harness/explore.md` |
| `spec-ingest` | **Primeira ação do Plan.** Ingere `outputs/explore/` como diretório de fontes, ancorando cada afirmação como `F-xxx`. Modo inicial se o pacote opcional não rodou no Explore; modo delta se rodou |
| `spec-legacy` (completo) | As 12 dimensões, `architecture.md` AS-IS, `legacy-analysis.md`, `threat-model.md` |
| `spec-benchmark` | Se não rodou no Explore |
| `spec-product` (completo) | **Obrigatório.** `modules.md`, `product-vision.md`, `business-rules.md`, `requirements.md`, `product-requirements.md`, `flow-map.md` |
| `spec-iterate` | Auditoria, GAPs com os 13 campos, propagação cirúrgica; colhe as telas da instância pelo `outputs/spec/screens-manifest.json` e pelos prints de `outputs/spec/screens/` |
| `spec-report` | `product-discovery-kit.html` |

**`outputs/explore/` é o diretório de fontes da `spec-ingest`.** Ela não precisa de edição —
basta apontá-la para lá.

## Convenção de âncora — obrigatória

Quando a fonte de um `F-xxx` está em `outputs/explore/`, a coluna **Âncora** do `context-map.md`
tem formato fixo, carregando o ID do Explore **literalmente**:

```
<arquivo> §<seção> <ID>
```

Exemplo: `especificacao-funcional.md §3 MOD-PAG RF-007`

Âncora por número de linha é proibida — ela morre no primeiro rework do documento.

**Seção sem ID.** Parte do Explore não tem ID nenhum: personas e matriz de acesso, a tabela de
telas quando não cita RF, a `especificacao-tecnica.md`. Para fato colhido dali, a âncora é
`<arquivo> §<seção>` — exemplo: `especificacao-funcional.md §1.1 Vendedor`. O `promocao.mjs` aceita
essa forma só quando a seção existe no documento e nenhum `MOD`, `RF` ou `RN` aparece nela; seção
com ID exige o ID. Não pendure um RF ou RN qualquer na âncora para o relatório passar: é rastreio
inventado.

Com essa convenção o rastreio funciona nas duas direções, com dois greps cada:

- **Ida:** `RF-007` no `context-map.md` → `F-xxx` → `requirements-functional.md` → `RF-MOD-PAGAMENTOS-003`
- **Volta:** coluna "Fato fonte" de `RF-MOD-PAGAMENTOS-003` → `F-xxx` → âncora → `RF-007`

## Promoção de IDs

O `spec-product` **não redescobre** — ele estrutura material que a `spec-ingest` já ancorou.
`RF-007` vira `RF-MOD-PAGAMENTOS-003` com `F-xxx` de origem; `RN-nnn` preliminar vira `RN-NOVO-xxx`
aprofundada.

Ao fim do `spec-product`, rode o verificador de cobertura:

```bash
node .claude/ferramentas/promocao.mjs
```

Todo `RF-nnn` e `RN-nnn` do Explore tem que aparecer em pelo menos uma âncora e ser citado por pelo
menos um `RF-MOD-CODIGO-NNN` ou `RN-NOVO`. Órfão **não bloqueia** — descarte pode ser legítimo — mas
exige linha no `gaps.md` dizendo por quê.

O verificador lê o consumo nos dois artefatos da `spec-product`: o `requirements/requirements.md`
(tabela de rastreio e linha `**Rastreabilidade:**` de cada RF/RNF) e o `business-rules.md`, onde a
regra nova — `RN-NOVO-<DOMÍNIO>-NNN`, a forma do template, ou `RN-NOVO-NNN` — cita o `F-xxx` na
linha **Origem** do bloco dela.

## Congelamento do Explore

Terminada a `spec-product`, existem **duas descrições do mesmo requisito**: a
`especificacao-funcional.md` que o cliente leu e aprovou, e o `requirements/requirements.md` mais
fundo. Editadas nas duas, divergem em semanas; editada só a do Plan, o documento que o cliente
considera atual vira mentira.

**Um comando faz as três etapas, e a ordem é contrato:**

```bash
node .claude/ferramentas/promocao.mjs --congelar
```

Ele **carimba** os cinco documentos de `outputs/explore/`, **relê o disco** para conferir que
nenhum ficou sem carimbo, e só então **cria o marcador** `outputs/spec/_explore-congelado.md`, que
é o que liga a trava. Se algum documento ficar sem carimbo — permissão, arquivo aberto em outro
editor —, ele **recusa** criar o marcador e diz qual. Rodar de novo é seguro: o comando é
idempotente.

A linha de carimbo que ele insere no topo de cada documento é esta, e ela é para o leitor humano:
quem abrir o arquivo depois precisa saber que aquele documento foi sucedido.

```
> **CONGELADO em AAAA-MM-DD** — sucedido por `outputs/spec/`. Mudança vai para lá, ou para `spec-scope-change` se for virada de escopo.
```

**Não crie o marcador à mão, e não inverta a ordem.** O marcador liga a negação de escrita sob
`outputs/explore/` — **inclusive a do próprio carimbo**, sem exceção: não existe operação
privilegiada, nem para recarimbar. Criá-lo antes de carimbar tranca o Explore com os documentos
ainda crus, e a partir daí nem carimbar passa. É recuperável removendo o marcador, e é retrabalho
que a ordem evita. **Documento carimbado sem marcador não congela nada**; o carimbo sozinho é
decoração, e o harness não lê o texto de documento nenhum para decidir.

**Como desfazer.** Remover `outputs/spec/_explore-congelado.md` reabre o Explore na hora. É a
saída real, e é a única — o marcador está na zona mutável de propósito, para que você consiga
executá-la. O carimbo no topo dos documentos continua contando a história.

**Para onde vai a mudança.** Aprofundamento vai para `outputs/spec/`; virada de escopo vai para
`spec-scope-change`.

O congelamento **não** dispara no `fecho-explore`: o Tempo A do Plan ainda lê o Explore, e a
`spec-ingest` e a `spec-iterate` podem legitimamente corrigi-lo enquanto rodam.

## Tempo B — cadeia técnica, nesta ordem

| Ordem | Skill | Saída |
|---|---|---|
| 1 | `spec-tech-rules` | 11 rules `.mdc` + `tech-rules-summary.md` |
| 2 | `spec-hld` | `hld.md` — contexto e containers (C4 1 e 2), RNF → tática, ADRs |
| 3 | `revisao-de-seguranca` (`plano-geral`) | `plano-de-seguranca.md` — kernel `SEC-###` |
| 4 | `spec-data-model` | `data-model.json` final, no formato da prévia, com tipos ServiceNow e `rf`/`rn` por entidade |
| 5 | `spec-api-contracts` | **opcional** no v0: `api-contracts.yaml` só se houver API exposta; as integrações são simuladas (`inputs/simulacoes.md`) |
| 6 | `spec-test-plan` | `test-plan.md` |
| 7 | `spec-tasks` | `tasks.json` (`tasks/v5.4`, com `snArtifact` nas tasks ServiceNow) + `gaps-document.md` |
| 8 | `spec-security-review` | injeta `SEC-NNN` no `tasks.json` |
| 9 | `spec-estimate` | `estimate-report.md` |
| 10 | `promocao.mjs --rastreio` | `traceability.json` — **gate**: sai com erro se algum RF ficar sem story |
| 11 | `spec-tasks-html` | `report/tasks.html`, com os prints (plano B offline) |
| 12 | `sn-tasks-github` | issues e sub-issues no GitHub, com o print por permalink; `id-map.json` |

**Depois da `spec-data-model` final, o app acompanha.** O `sn-scaffold` em modo Plan lê o
`data-model.json` e reescreve os `Table()`; o `sn-seed` regera o seed com os limites das RN e o
`testData` dos cenários; e o `npm run reinstall` instala. Campo que sumiu da fonte vira DELETE no
install seguinte, pelo `keys.ts` (`deleted: true`). Não há diff nem migração.

**O gate do rastreio vem antes da publicação.** Rode:

```bash
node .claude/ferramentas/promocao.mjs --rastreio
```

Ele monta `outputs/spec/traceability.json` com uma linha por RF (`rf`, `ct[]`, `tel[]`, `story`,
`tasks[]`, `nowIds[]`, `atf[]`, `nivel`), lendo o `tasks.json`, o `Now.ID[` de `app/src` e o
`keys.ts`, e os recibos de ATF — ninguém consulta a instância. Nível N1 = tem story; N2 = tem
`nowId` instalado; N3 = tem recibo de ATF verde. Com RF órfão (sem story), sai com código 2, e o
`sn-tasks-github` não roda sem o `traceability.json` (`cadeia.mjs`).

**Publicação.** `sn-tasks-github --dry-run` primeiro, depois para valer: épico e funcionalidade
viram issue, a story vira sub-issue, as tasks ficam em checklist no corpo, e a story de tela leva o
print por permalink do commit. O publicador falha se faltar print obrigatório ou se o PNG não
estiver commitado. Rodar de novo atualiza as mesmas issues (`--change`, pelo `id-map.json` e pelo
marcador `<!-- logical-id -->`).

**A ordem 6 antes de 7 é correção deliberada.** O kit rotula a `spec-test-plan` de forma
inconsistente. Nós a rotulamos «Fase 7c» na própria skill e em `tools/references/task-pipeline.md`
(antes da `spec-tasks`, Fase 8); o upstream usa «Fase 8a» ali e «7a»
em outros arquivos. A nossa ordem é deliberada: o `test-plan.md` é a fonte dos cenários de aceite
(`acceptanceScenarios[]`) que a `spec-tasks` grava nas tasks — homologação não vira item de backlog
(`NO_UAT_BACKLOG`, FATAL) —, então a dependência real é a inversa.

## Registro no `sync-log.md` — obrigatório para a cadeia técnica

O `outputs/spec/sync-log.md` é a memória cronológica que atravessa as três fases. O kit já obriga
as sete skills de discovery a registrar; **neste harness a cadeia técnica registra também** —
`spec-tech-rules`, `spec-data-model`, `spec-api-contracts`, `spec-test-plan`, `spec-tasks` e
`spec-security-review`, e as seis skills ServiceNow do kit — `sn-scaffold`, `sn-seed`,
`sn-capture`, `sn-tasks-github`, `sn-implement` e `sn-reinstall`. Sem esta regra a memória para na
fronteira do Plan: quem retomar o projeto não tem como saber o que já rodou, com que insumo, nem
que decisão foi tomada.

**O install também é linha da Seção A**, escrita pelo `npm run reinstall` (não à mão): Skill
`now-sdk-install`, `Modo / contexto` = alias da instância, Inputs = escopo, Outputs = commit de
`app/src/fluent`, Decisões = `ok; N registros`. É ela que o `fecho-explore` e o `delivery-gate`
leem.

**A `spec-hld` não entra nesta lista.** Ela tem `## Sync-log (obrigatório)` no próprio `SKILL.md`
(`.claude/skills/spec-hld/SKILL.md`); listá-la aqui de novo duplicaria a fonte da obrigação que o
`SKILL.md` dela já carrega, sem acrescentar nada.

**Ao terminar a skill**, acrescente uma linha na Seção A. Quando for reexecução, escreva `delta` na
coluna **`Modo / contexto`** — é ela que carrega o modo, os marcadores de skip e a linha de kickoff.

**O formato não está escrito aqui, de propósito.** Ele é o do template do kit,
`spec-iterate/templates/sync-log.md` — abra-o e copie de lá. Fonte escrita duas vezes diverge, e a
cópia que diverge é a que alguém vai ler: foi assim que este harness passou meses exigindo uma
linha de kickoff que o kit nunca conheceu.

Escrever o artefato terminal de uma dessas skills faz o harness lembrar da linha, com o esqueleto
pronto para colar. **O lembrete não bloqueia nada, e ninguém preenche a linha por você**: a Seção A
registra que *alguém decidiu*, e decisão fabricada por máquina parece evidência sem ser.

## Kernels de fonte única

- **Segurança:** o kernel é o `plano-de-seguranca.md`. A `spec-security-review` **consome** esse
  kernel; ela não deriva controles sozinha.
- **Interface:** a constituição de tela é `.claude/rules/harness/servicenow-ui.md` (Core UI
  clássica, carregada ao tocar `app/src/fluent/**`). As rules que a `spec-tech-rules` gera na raiz
  de `.claude/rules/` trazem as decisões do projeto (convenções, arquitetura, segurança,
  testes, build e deploy ServiceNow) por cima dela. O `security.mdc` do kit fica em
  `outputs/spec/tech-rules/` e o `frontend-default.mdc` (Next.js) não se aplica: os dois **não** são materializados de novo em `.claude/rules/` —
  carregariam duas vezes (Decisão 73).
- **Modelo de dados:** o `data-model.json` é a autoridade. O `modelo-de-dados.md` do Explore é
  ancestral preliminar e o `data-model.md` do Plan é a **renderização** da autoridade — nenhum dos
  dois é fonte concorrente, e o do Plan é gerado, nunca editado à mão.
- **Desenho de alto nível:** o `hld.md` do Plan é a autoridade; o `hld-funcional.md` do Explore é
  ancestral preliminar, não fonte concorrente.

**Sobre o vocabulário destas rules e das mensagens de negação.** O bloco «Linguagem clara» das
skills do kit (regra 6) proíbe jargão de processo — "gate", "FATAL", nome de validador — no texto
**que a skill escreve nos artefatos**, porque quem lê é o stakeholder e o desenvolvedor. Estas rules
e as mensagens do harness falam com o consultor, no meio do trabalho, e usam esse vocabulário de
propósito: é o nome das coisas que ele precisa destravar. Público diferente, norma diferente
(Decisão 43 do Plano 5). Se uma mensagem confundir um humano de verdade, é conserto pontual.

## Marco da fase

Backlog publicado no GitHub (`sn-tasks-github`, com prints) · `traceability.json` sem RF órfão ·
estimativa emitida · kernel de segurança fechado · rules materializadas · Kit HTML emitido ·
`promocao.mjs` executado com órfãos justificados · `outputs/explore/` congelado · app reinstalado
com o modelo final · GAPs bloqueantes fechados ou convertidos em Spike.

**Pré-requisito:** `gh auth status` com escopo `repo` no repositório privado, conferido pelo
`npm run doutor`.
