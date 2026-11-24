# Speckit ServiceNow v0

*   **Author:** arthurleardini
*   **Status:** Proposed (v0.2, revisão EGM aplicada)
*   **Date:** 2026-11-24

--------------------------------------------------------------------------------

## Overview

O Speckit ServiceNow é um kit de trabalho para FDEs (Forward Deployed Engineers) da EloGroup. Ele leva um projeto de cliente da especificação até um app ServiceNow funcionando.

É um fork do Harness Elo 2.6.0, o pacote para Claude Code que hoje leva um projeto da spec até um app Next.js, usando as skills do Elo Spec Kit. O fork mantém o método e troca o destino: o "código" passa a ser um app escopado ServiceNow, escrito em Fluent (a linguagem de metadados do ServiceNow SDK) e instalado numa instância pelo Claude Code.

O harness organiza o trabalho em três fases, cada uma fechada por um hook:

| Fase | Produz | Fecha com |
|---|---|---|
| **Explore** | entendimento do problema, especificação funcional, modelo de dados preliminar e, neste kit, o app preliminar instalado na instância como protótipo | `fecho-explore` |
| **Plan** | especificação técnica, modelo de dados final, plano de testes, backlog autossuficiente publicado e matriz de rastreio | gate de rastreio, mais a publicação |
| **Deliver** | implementação por story, com testes e validação independente | `delivery-gate` no `git push` |

O **ciclo G3** é a validação independente do Deliver. Depois dos testes verdes, agentes validadores separados (regras de negócio, testes, segurança, performance, observabilidade, rules técnicas) leem o código da task. Eles bloqueiam achados CRÍTICO e ALTO, e um agente corretor tenta resolver em até 3 rodadas.

O v0 roda de ponta a ponta num caso real, o Plano de Implementação 2.6 Cobrança da SEFAZ-MT, na instância `dev493801` (release Brazil), com o app `x_2326104_cob`. As saídas estão nas metas M2 a M5. A mesma spec gera o app na instância, que serve de protótipo desde o Explore, e o backlog com os prints tirados dele. Um ID liga spec, tela, issue, código e teste.

O v0 existe para uma demonstração: convencer o diretor da EloGroup de que esse método é um avanço para os projetos ServiceNow.

## The Problem

A SEFAZ-MT usa ServiceNow, e a EloGroup tem contrato de implementação lá. Hoje o caminho entre o plano de implementação e a instância é manual e sem rastreio:

- **Spec e plataforma andam separadas.** O Plano 2.6 Cobrança tem 42 RF e 32 critérios de aceite, mas nada liga um RF a uma tabela, business rule, ACL ou teste na instância. O precedente da mesma secretaria, Distribuição de Restituição (`10-elogroup/sefaz-mt/knowledge-mt/docs/analises/specs/distribuicao-restituicao/`), usou App Engine Studio, com scripts de seed e criação feitos à mão e sem testes automatizados.
- **O protótipo não parece o produto.** O protótipo atual de cobrança (`10-elogroup/sefaz-mt/knowledge-mt/mt-produtos/2.6-cobranca/prototipo/`) usa visual próprio. O cliente valida uma tela que não vai existir assim na plataforma, e o retrabalho aparece na construção.
- **O backlog não carrega a tela.** Sem o print, o desenvolvedor precisa procurar o protótipo, e cada um interpreta de um jeito.
- **O método da Elo não chega ao ServiceNow.** O Elo Spec Kit e o harness trazem IDs rastreáveis, gates, validadores independentes e backlog autossuficiente, mas assumem Next.js, OpenAPI e Azure DevOps. No SYDLE, a plataforma low-code usada em outros projetos da Elo, o Delivery Suite e o CodeForge já mostraram que a IA operando a plataforma encurta o ciclo. Para ServiceNow não existe equivalente.

## Goals

*   **M1. Rastreio de ponta a ponta visível.** Para cada RF do fio condutor (`inputs/fio-condutor.md`: F2 Qualificação, dossiê da F5 e ACL de carteira do atendente), a demo mostra a cadeia completa: RF → critério → tela (`TEL-`) → issue no GitHub com o print → arquivo `.now.ts` → registro na instância → teste ATF verde.
    *   A matriz `traceability.json` cobre os 46 RF, ou seja, os 42 das funcionalidades e os 4 transversais (requisitos que valem para todas as funcionalidades).
    *   Nenhum RF fica órfão. Órfão é o RF sem story.
*   **M2. Especificação completa do piloto.** F1 a F6 especificadas pelas etapas do kit (`especificacao-funcional`, `business-rules`, `requirements`, `data-model`, `test-plan`, `tasks.json`). Os 42 RF e os 32 critérios ganham ID único no formato nativo do kit (`RF-MOD-F2-003`).
*   **M3. A instância é o protótipo.** No fim do Explore, todas as telas do inventário existem na instância como form, list ou report da Core UI clássica (UI16), com dados fictícios:
    *   o visual inclui cabeçalho, navegador, seções, related lists, activity stream com histórico e UI Actions;
    *   cada print mostra a tela como o papel da tela a vê;
    *   o `screens-manifest.json` aponta cada `TEL-` para a tela na instância e para o seu PNG;
    *   telas que a Core UI não faz como o plano pede (dossiê consolidado da F5, painel de KPIs da F6) entram como form com related lists e report simples, com a diferença registrada como GAP em `outputs/explore/gaps.md`.
*   **M4. Backlog no GitHub com print.** Todos os épicos, funcionalidades e stories do `tasks.json` são publicados como issues num repositório privado. Cada story de tela leva o print, e o publicador falha se faltar um print obrigatório.
*   **M5. App na instância.** Todas as funcionalidades ficam navegáveis em `x_2326104_cob` (tabelas, forms, lists, menu, roles e ACLs), e o fio condutor ganha business rules, flow e ATF. Os dados fictícios exercitam cada critério, e as integrações externas são simuladas e rotuladas. O app inteiro volta do zero, a partir do git, com um comando.
*   **M6. Kit reaproveitável.** As skills novas rodam com os gates do harness, para que um FDE repita o processo noutro projeto. Esta meta fica **fora do critério de pronto do v0**: o v0 é julgado por M1 a M5.

## Non-Goals

*   Integração real com o score UFMT, os canais (SMS, e-mail, SNE, WhatsApp) e as 5 fontes de débito. No v0 são tabelas simuladas.
*   Qualquer dado real de contribuinte na instância, no repositório ou no backlog.
*   Azure DevOps e Agile 2.0 como destino do backlog. Geração do kit para Cursor e Kiro.
*   Workspace, Service Portal e UI Builder. Só a Core UI clássica.
*   Adaptar `spec-legacy`, `spec-benchmark`, `spec-estimate` e `spec-estimate-report`. Ficam como na base, e a `spec-estimate` só ganha a leitura opcional de `snArtifact` sem quebrar.
*   Auditoria com Instance Scan e wiki em duas camadas.
*   As 173 regras RN-SN como gate. Entram como referência e só viram gate quando revisadas.
*   Recalibração do score, medidas coercitivas e articulação com a PGE, que o próprio plano trata como lacuna.
*   Acompanhar automaticamente versões novas do harness Elo. A comparação é manual, via `git diff` contra a tag base.

## Critical User Journeys (CUJs)

### CUJ 1: Diretor acompanha um requisito da spec até a instância (M1, M4, M5)

*   **Given**: o v0 está instalado na `dev493801` com seed fictício, e o backlog está publicado no GitHub.
*   **When**: o FDE escolhe um RF do fio condutor, por exemplo a publicação de uma versão do critério de qualificação na F2. Ele navega pela cadeia: spec → issue com o print da tela → arquivo `.now.ts` → form na instância → recibo do ATF.
*   **Then**: cada passo exibe o ID do RF. O print na issue é a tela que o papel da story vê na instância. O recibo do ATF do critério está verde.

### CUJ 2: FDE gera o backlog com prints a partir da spec (M4)

*   **Given**: o Explore está fechado, com o `screens-manifest.json` e os PNGs gerados, e o Plan gerou o `tasks.json`.
*   **When**: o FDE roda o `sn-tasks-github`, primeiro com `--dry-run` e depois para valer.
*   **Then**:
    *   Cada épico, funcionalidade e story vira issue, com label de tipo e o marcador `<!-- logical-id: X -->` no corpo.
    *   Cada story de tela leva o PNG por permalink do commit.
    *   Rodar de novo atualiza as mesmas issues, sem duplicar.
    *   Se faltar um print obrigatório, o publicador para com erro e lista as telas.

### CUJ 3: FDE implementa uma story e instala na instância (M1, M5)

*   **Given**: a story está "pronta para fazer" no GitHub, com cenários de aceite e `snArtifact`. O app `x_2326104_cob` existe no git.
*   **When**: o FDE roda o `sn-implement` na story. O agente consulta a documentação do SDK, escreve os `.now.ts` e o teste ATF da story, e instala pelo `npm run reinstall`. Depois roda o ATF pelo `npm run atf` e passa pela validação que o tipo da story exige (tabela de isenções).
*   **Then**:
    *   O build sai limpo e o install fica registrado no `sync-log.md`.
    *   O recibo do ATF da story fica verde, ou a isenção de ATF de form fica registrada.
    *   A issue recebe um comentário com o resultado e o print da tela na instância.

### CUJ 4: Instância zerada volta a ser a demo (M5)

*   **Given**: a instância foi reclamada ou zerada, e o repositório está no GitHub.
*   **When**: o FDE autentica o `now-sdk` na instância nova (`now-sdk auth --add`) e roda o `npm run reinstall`.
*   **Then**:
    *   O app, os roles, as ACLs, os usuários demo e os dados fictícios voltam como antes.
    *   O comando é idempotente: rodar duas vezes não duplica registros.
    *   Se o prefixo de escopo da instância nova for diferente, o comando para antes de instalar e avisa.

### CUJ 5: FDE fecha o Explore com a instância como protótipo (M3)

*   **Given**: `especificacao-funcional.md` (com a tabela de telas) e `modelo-de-dados.md` prontos.
*   **When**: o FDE roda `spec-data-model --previa`, `sn-scaffold`, `npm run reinstall` e `sn-capture`, e depois pede para fechar o Explore.
*   **Then**: o `fecho-explore` libera quando toda `TEL-` tem rota e PNG, o último install é posterior à última mudança em `app/src/fluent/` e todo documento do seed está na lista de fictícios. Se faltar alguma condição, ele bloqueia e lista o que falta.

## Technical Plan (Architecture)

### Decisões de arquitetura

| # | Decisão | Alternativas descartadas |
|---|---|---|
| A1 | **Fork adaptável em dois modos.** Até o fim do estágio de endurecimento, o repositório roda como *template*: commit base sem `harness-zona.lock.json` e com o marcador `.harness-template`, criado pelo FDE no terminal. Nesse modo, hooks, ferramentas, rules e skills podem ser alterados, e a garantia é o `npm test` a cada commit. No fim do endurecimento, o manifesto do fork é gerado uma vez com `montarManifesto` (`verificar-zona.mjs`), entra no commit e o marcador sai. O ensaio e a demo rodam travados | A |
| A2 | **A instância é o protótipo.** Não há HTML. Depois do modelo de dados preliminar, o app é instalado na instância ainda no Explore, e os prints vêm dela | B, C |
| A3 | **Um repositório só.** Repositório privado `arthurleardini/speckit-servicenow` com kit, spec, app Fluent em `app/` e issues | G |
| A4 | **Backlog em issues do GitHub.** Épico e funcionalidade viram issue pai, e a story vira sub-issue (API REST). As tasks ficam em checklist no corpo da story. Os labels marcam só o tipo (`epic`, `feature`, `story`, `sn:<kind>`) e `fio-condutor`. A idempotência vem do `id-map.json` mais o marcador `<!-- logical-id -->`. A imagem entra por permalink do commit | D (atualizar `gh`), E, F |
| A5 | **Skills novas como extensão; etapas existentes alteradas no lugar.** Seis skills novas: `sn-scaffold`, `sn-seed`, `sn-capture`, `sn-tasks-github`, `sn-implement`, `sn-reinstall`. Também é novo o agente `validador-escopo-app`. Skill ou agente com nome que não está no manifesto é "extensão do projeto" (`zonas.mjs:182-243`). As demais etapas são `spec-*` alteradas no próprio arquivo | — |
| A6 | **Tipo ServiceNow num campo à parte.** `Task.snArtifact = { kind, table?, fluentFile, nowId }`, opcional, no schema `tasks/v5.4`. O enum `Task.type` não muda | — |
| A7 | **IDs no formato nativo do kit.** `RF-MOD-F<n>-<nnn>`, `RF-MOD-T-<nnn>` (transversais) e `CT-MOD-F<n>-<nnn>`. Única família nova: `SIM-<nn>` (integração simulada) | — |
| A8 | **Integrações simuladas como tabela.** Score UFMT, canais e fontes de débito viram tabelas do app, com seed, rótulo "Simulado" e interruptor de falha. A etapa de contratos de API fica opcional no v0 | — |
| A9 | **Seed fictício por `Record()` com `installMethod: 'demo'`.** É instalado junto pelo `now-sdk install` (`--demoData` ligado por padrão). CPF e CNPJ têm DV válido e vêm de uma semente fixa. O `sn-seed` grava a lista dos documentos gerados (`_documentos.json`), e todo registro de pessoa leva `ficticio = true`. Usuários demo por role, sem senha | I (Build Agent) |
| A10 | **Prints por script, na visão do papel.** A `sn-capture` (Playwright) entra como admin, faz *impersonate* do usuário demo do papel da `TEL-` e fotografa a tela em 1440×900 | — |

### Componentes

```text
speckit-servicenow/                      (repo único, privado)
├── CLAUDE.md, harness.json, workspace.md, ORIGEM.md
├── .claude/
│   ├── skills/   spec-* (algumas alteradas no lugar) + sn-* (6 novas, extensão)
│   ├── hooks/    kit, cadeia, fecho-explore, sync-log, gramatica, delivery-gate (alterados)
│   ├── agents/   validadores G3 com checklist ServiceNow + validador-escopo-app
│   ├── rules/harness/  servicenow-ui.md (Core UI), security.md (ACL/escopo)
│   └── ferramentas/    doutor, promocao (+ rastreio), validar, validacao/ …
├── inputs/        plano 2.6, de-para de IDs, simulações, premissas, fio condutor
├── outputs/
│   ├── explore/   hld-funcional, especificacao-funcional, especificacao-tecnica, modelo-de-dados, gaps …
│   └── spec/      data-model.previa.json, data-model.json, tasks.json, traceability.json,
│                  screens-manifest.json, screens/<TEL>.png, test-plan.md,
│                  auditorias/atf/<STORY>.json, id-map.json …
├── app/           projeto Fluent (now.config.json, src/fluent/**, src/server/**,
│                  src/fluent/generated/keys.ts versionado, src/fluent/seed/**)
└── .env.instancia (fora do git; modelo em .env.example)
```

### Fluxo

```text
EXPLORE
 inputs ─► spec-ingest ─► hld-funcional ─► especificacao-funcional (tabela de telas TEL-)
        ─► especificacao-tecnica + modelo-de-dados (preliminares)
        ─► spec-data-model --previa  (data-model.previa.json)
        ─► sn-scaffold  (Table, Form, List, menu, roles, usuários demo, seed; screens-manifest.json)
        ─► npm run reinstall  (build + install na dev493801; linha no sync-log)
        ─► sn-capture   (impersonate do papel → screens/<TEL>.png)
        ─► revisão do gaps.md contra a instância ─► fecho-explore

PLAN
 spec-product ─► spec-iterate ─► spec-tech-rules ─► spec-hld ─► revisao-de-seguranca (catálogo SEC)
 ─► spec-data-model (final; reescreve os Table(); campo removido vira DELETE pelo keys.ts)
 ─► spec-test-plan ─► spec-tasks (tasks.json v5.4) ─► spec-security-review (injeta tasks SEC)
 ─► promocao.mjs --rastreio (traceability.json; gate) ─► spec-tasks-html
 ─► sn-tasks-github (issues + sub-issues; PNG por permalink)

DELIVER  (por story)
 sn-implement: Test Blueprint ─► .now.ts ─► Test() ATF ─► npm run reinstall
             ─► npm run atf (recibo) ─► validação conforme o tipo da story
             ─► sn-capture --story ─► comentário na issue
 ─► auditoria-de-us ─► delivery-gate (lê sync-log + recibo; nunca roda now-sdk) ─► push
```

### Como as peças se ligam

- **Telas.** A `especificacao-funcional.md` lista as telas (`TEL-`) com tabela, tipo (form, list ou report), visão e papel.
  - **Geração:** o `sn-scaffold` gera `Form()` e `List()` por tela, seguindo o `form-layout-guide.md` do SDK.
  - **Activity stream:** as tabelas com form ligam `journal_input` e `audit`, e o seed grava 2 a 3 linhas de journal por registro demo, para o histórico não sair vazio.
  - **Manifesto:** depois do build, o `sn-scaffold` grava o `screens-manifest.json`. A rota de list sai do nome da tabela. A rota de form usa o `sys_id` do registro demo `Now.ID['<TEL>_registro_demo']`, lido do `keys.ts`.
- **Gate do Explore.** O `fecho-explore` deixa de exigir protótipo de fidelidade alta. Passa a exigir três coisas:
  1. rota e PNG para toda `TEL-`;
  2. no `sync-log.md`, a última linha de install com resultado `ok` e commit igual a `git log -1 --format=%H -- app/src/fluent`;
  3. todo CPF ou CNPJ encontrado em `app/src/fluent/seed/` presente em `_documentos.json`.
- **Prévia e final do modelo de dados.** A prévia (`data-model.previa.json`) é a única escrita de modelo permitida no Explore. No Plan, o `data-model.json` final reescreve os `Table()`, e o SDK (≥ 4.14) transforma em DELETE, no install seguinte, o campo que sumiu da fonte (`keys.ts` com `deleted: true`). Não há diff nem migração no v0.
- **Rastreio.** O `traceability.json` tem uma linha por RF: `rf`, `ct[]`, `tel[]`, `story`, `tasks[]`, `nowIds[]` (de `app/src` e do `keys.ts`), `atf[]` (dos recibos) e `nivel`. Ninguém consulta a instância para montar a matriz.
  - **Níveis:** N1 = tem story; N2 = tem `nowId` instalado; N3 = tem recibo de ATF verde.
  - **O `$id` dos registros Fluent usa o ID da spec**, por exemplo `Now.ID['RF-MOD-F2-003_br_publicar_versao']`.
- **ATF.** Um único leitor, o `npm run atf -- --story <ID>`, roda `now-sdk cicd test run -o json` (ou consulta `sys_atf_result`, conforme o resultado do item 9). Ele grava o recibo `outputs/spec/auditorias/atf/<STORY>.json` com `sys_id`, horário, status e commit. O `delivery-gate` e a `promocao.mjs` leem só o recibo.
- **Backlog.** O `sn-tasks-github` segue o molde do `spec-tasks-azure`: gate de autossuficiência, `--dry-run`, `--change` e `--id-map`.
  - O `id-map.json` guarda o `number` e o `id` numérico de cada issue, porque a API de sub-issue exige o `id`.
  - O PNG é commitado em `outputs/spec/screens/` e referenciado por `blob/<sha>/...?raw=1`.
  - No Deliver, o `--change` publica as tasks SEC novas.
- **Validação por tipo de story.**

  | Story | G3 com LLM | build + install | ATF servidor | ATF form |
  |---|---|---|---|---|
  | fio condutor (label `fio-condutor`) | sim | sim | sim | conforme item 9 |
  | gerada (tabela, form, list, menu, role, seed) | não: isenção de G3 | sim | sim | conforme item 9 |
  | outra feita à mão | não: isenção de G3 | sim | sim | conforme item 9 |

  Há dois tipos de isenção. A **isenção de G3** dispensa os validadores com LLM. A **isenção de ATF de form** vale quando o item 9 mostra que o teste de form não roda sem navegador. As duas são registradas por story em `outputs/spec/auditorias/_isencoes/<STORY>-<tipo>.md`, e uma não isenta a fase nem a outra story. O checklist dos validadores está no item 32.
- **Instância e credencial.** A credencial fica em `.env.instancia`, que o agente não pode ler (item 7). Só `doutor`, `capture.mjs`, `reinstall.mjs` e `atf` carregam o arquivo. O alias do `now-sdk auth` é `dev493801`. O `npm run reinstall` confere o prefixo de escopo (`glide.appcreator.company.code`) e para se for diferente do que está em `app/now.config.json`.
- **Segurança no Plan.** A `revisao-de-seguranca` monta o catálogo `SEC-` com os vetores da plataforma, e a `spec-security-review` injeta as tasks SEC nas stories.

## Alternatives Considered

### Alternativa A: camada sobre o Elo Spec Kit, sem fork

*   **Prós**: recebe as versões novas do kit Elo sem retrabalho e não duplica os testes nem as ferramentas.
*   **Contras**: a zona imutável bloqueia o `fecho-explore`, a rule de frontend Next.js e os checklists dos validadores, que precisam mudar para ServiceNow.
*   **Motivo da rejeição**: o fork é o único jeito de alterar esses pontos. Manutenção própria (decisão do autor, 24/11/2026).

### Alternativa B: protótipo HTML com descrição de tela única e dois geradores

*   **Prós**: valida as telas antes de qualquer instalação, e protótipo e instância saem da mesma fonte.
*   **Contras**: são dois geradores para manter, e as telas fora do padrão form/list viram exceção feita à mão.
*   **Motivo da rejeição**: manter dois geradores custa mais que instalar a tela de verdade. A instância como protótipo elimina a divergência entre desenhado e construído (decisão do autor).

### Alternativa C: protótipo HTML livre e Fluent escrito depois (modelo atual do kit)

*   **Prós**: nenhum gerador novo e liberdade visual total.
*   **Contras**: o layout é feito duas vezes, e o protótipo pode prometer o que a Core UI não faz.
*   **Motivo da rejeição**: o retrabalho e a divergência visual derrubam o CUJ 1 (decisão do autor).

### Alternativa D: atualizar o `gh` para anexar imagem (`--attach`)

*   **Prós**: a imagem vira anexo da issue, sem PNG commitado.
*   **Contras**: exige atualizar o binário em toda máquina de FDE, e o recurso é recente.
*   **Motivo da rejeição**: o permalink por commit resolve com o `gh` atual. Fica registrada para depois do v0.

### Alternativa E: Azure DevOps como backlog

*   **Prós**: o publicador do kit já existe e anexa o print, e é a ferramenta padrão da Elo.
*   **Contras**: exige organização, projeto, PAT e template de processo, e o publicador nunca rodou contra um ADO real.
*   **Motivo da rejeição**: o custo de configuração e o publicador não testado pesaram mais. O publicador do ADO fica como molde (decisão do autor).

### Alternativa F: Agile 2.0 dentro da própria instância

*   **Prós**: backlog e app no mesmo lugar, e a demo fica 100% ServiceNow.
*   **Contras**: o plugin está inativo na `dev493801`, não há publicador, e o backlog some se a instância for zerada.
*   **Motivo da rejeição**: perder o backlog junto com a instância é inaceitável numa PDI volátil.

### Alternativa G: repositórios separados (kit + projeto, ou kit + docs + código)

*   **Prós**: o kit fica reaproveitável sem limpeza manual.
*   **Contras**: dois ou três repositórios para sincronizar, e o casamento multi-repo do harness espera URL do Azure DevOps.
*   **Motivo da rejeição**: a demo fica espalhada. Extrair o kit é trabalho de M6, fora do critério de pronto (decisão do autor).

### Alternativa H: v0 enxuto, só com uma fatia vertical

*   **Prós**: entrega mais cedo e com menos risco.
*   **Contras**: mostra pouco do método para o diretor.
*   **Motivo da rejeição**: o argumento para o diretor precisa da largura. A fatia do fio condutor fecha o estágio 1, mas não é o limite (decisão do autor).

### Alternativa I: Build Agent da própria ServiceNow para gerar o app

*   **Prós**: nativo da plataforma, gera o esqueleto a partir de linguagem natural.
*   **Contras**: cota de 25 chamadas na instância de desenvolvedor, sem ligação com a spec, os IDs e os gates.
*   **Motivo da rejeição**: não entrega o rastreio da spec até a instância, que é o ponto central da demo. Pode servir de comparação fora do v0.

## Riscos e mitigações (dia da demo)

| Risco | Mitigação | Item |
|---|---|---|
| A PDI é reclamada ou fica fora do ar | `npm run reinstall` completo na véspera, previsto no roteiro; instância de reserva com o mesmo prefixo | 30, 42 |
| O trecho ao vivo falha (SDK, rede, tokens, Anthropic) | Trilha pronta independente de execução ao vivo; plano B offline (`report/tasks.html` com prints e vídeo do ensaio) | 42 |
| O SDK muda de comportamento | Versão fixada em `app/package.json` e conferida pelo `doutor` | 6, 8 |
| GitHub ou `gh` indisponíveis | `spec-tasks-html` offline, com os mesmos prints | 42 |
| O diretor quer abrir uma tela fora do fio condutor | Toda funcionalidade é navegável (M5), e o nível N1/N2 de cada RF aparece na matriz | 33 |
| O diretor pergunta da origem dos parâmetros de negócio | Os valores estão marcados como premissa em `inputs/premissas-ficticias.md` | 41 |

## Non-Functional Requirements

*   **Sigilo e LGPD.** Nenhum dado real de contribuinte entra no repositório, na instância ou nas issues.
    *   **Seed:** o gate confere que todo documento está em `_documentos.json` e que os registros de pessoa têm `ficticio = true`.
    *   **Demais arquivos:** o `check_sensivel.py` (`/config/workspace/scripts/check_sensivel.py`, fora do repositório e chamado pelo `doutor` e pelos gates) roda em `inputs/`, `outputs/**/*.md` e no corpo das issues antes de publicar, e bloqueia com score ≥ 40.
*   **Segredos.** A credencial da instância fica em `.env.instancia` (chmod 600, fora do git), com `permissions.deny` para o agente. Os scripts leem o arquivo pelas variáveis `SN_SDK_*`, que o SDK usa, sem imprimir os valores.
*   **Volatilidade da instância.** A instância de desenvolvedor é reclamada após 10 dias sem login. O `npm run reinstall` refaz tudo a partir do git de forma idempotente. O ensaio numa instância zerada é o estágio 3.
*   **Custo de tokens.** O ciclo G3 completo custa cerca de 390 mil tokens por task, e o v0 não tem teto. O G3 com LLM roda só no fio condutor (tabela de validação por tipo de story).

## Referências e glossário

**Fontes** (caminhos relativos a `/config/workspace/10-elogroup/`):

| Fonte | O que é |
|---|---|
| `deliversuiteServiceNow/referencias/00-README.md` | índice das referências do speckit |
| `deliversuiteServiceNow/referencias/12-etapas-speckit-servicenow.md` | as etapas do Elo Spec Kit espelhadas para ServiceNow |
| `deliversuiteServiceNow/referencias/32-servicenow-boas-praticas-oficiais.md` | catálogo **RN-SN**: 173 regras de boas práticas ServiceNow em rascunho, tiradas das fontes oficiais; seção 2.12 = 21 regras candidatas ao validador de escopo |
| `deliversuiteServiceNow/referencias/33-servicenow-ia-rules-wiki.md` | plugin `servicenow-sdk`, starter, repos com rules/skills reaproveitáveis e a configuração que libera `now-sdk explain` |
| `deliversuiteServiceNow/docs/designs/concepts_brief.md` | brief do brainstorm (histórico; decisões D1–D11) |
| `sefaz-mt/planos-implementacao/apresentacoes/refined/1.5 Planos de Implementação/Plano de Implementação - 2.6 Cobrança.md` | caso piloto |
| `deliversuiteServiceNow/harness-elo-v2-claude-2.6.0 11 (1).zip` | base do fork |

**Glossário:**

| Termo | Significado |
|---|---|
| FDE | Forward Deployed Engineer, o consultor técnico da Elo alocado no cliente |
| SYDLE, Delivery Suite, CodeForge | plataforma low-code usada em outros projetos da Elo, o app desktop que liga o Claude a ela e o repositório de skills que ele usa |
| PDI | Personal Developer Instance, a instância gratuita de desenvolvedor ServiceNow |
| Fluent | linguagem TypeScript do ServiceNow SDK que descreve metadados (`Table()`, `Form()`, `Record()`, `Test()`) |
| ATF | Automated Test Framework, os testes automatizados da plataforma |
| ACL | regra de acesso por tabela, campo e operação |
| OOTB | o que a plataforma traz pronto |
| RF / CT / RN / TEL / US | requisito funcional / critério de aceite / regra de negócio / tela / user story |
| Zona imutável e lock | arquivos do kit que o hook `zonas.mjs` impede de alterar num clone; o `harness-zona.lock.json` lista esses arquivos |
| Gate de autossuficiência | checagem do publicador: cada story precisa trazer no próprio corpo tudo o que é necessário para ser implementada |
| Isenção | dispensa registrada por story (de G3 ou de ATF de form), descrita no Technical Plan |
| Fio condutor | RFs com lógica completa e G3, listados em `inputs/fio-condutor.md` |

## Open Questions

*   **Q1, resolvida:** repositório único (A3).
*   **Q2. ATF pela linha de comando:** confirmar na PDI se `now-sdk cicd test run` executa testes de servidor e de form. O item 9 responde, e a regra para cada desfecho está no item 19.
*   **Q3. Premissas fictícias:** os valores do item 41 são premissa do v0 e precisam ser validados com o time de cobrança da SEFAZ-MT antes de virar requisito.
*   **Q4, resolvida:** formato da demo no item 42.

--------------------------------------------------------------------------------

## Detailed Implementation Plan

Base: zip `harness-elo-v2-claude-2.6.0 11 (1).zip` (pasta-mãe `deliversuiteServiceNow/`), primeiro commit do repositório `arthurleardini/speckit-servicenow` (privado). Caminhos relativos à raiz desse repositório. App `x_2326104_cob`, rótulo "Cobrança MT". Componentes prontos do arquivo `33` servem de ponto de partida onde indicado (licença MIT conferida, e a licença do starter ainda a conferir).

### Estágios

| Estágio | Itens | Pronto quando |
|---|---|---|
| 0. Viabilidade | 1–9 | `doutor` verde e desfecho registrado para as 4 checagens do item 9 |
| 1. Caminho da demo | 23–26, 28–30, 37–42 (com 6 já feito) | fio condutor em N3 na instância; demais RF em N1/N2; backlog publicado |
| 2. Endurecimento do kit | 10–22, 27, 31–36 | `npm test` verde; manifesto da zona gerado; marcador `.harness-template` removido |
| 3. Ensaio | roteiro do item 42 | instância zerada volta à demo com `npm run reinstall`; CUJ 1 percorrido |

No estágio 1, os gates ainda são os da base. As skills novas são extensões e não passam pelos hooks alterados. A isenção de fase, já prevista no harness em `outputs/spec/auditorias/_isencoes/`, cobre o `fecho-explore` até o estágio 2.

### Estágio 0: base, ambiente e viabilidade

#### 1. Raiz do repositório (Create, a partir do zip)

*   **Type / Scope**: esqueleto do harness.
*   **Proposed Changes**: extrair o zip, **remover `harness-zona.lock.json`** e fazer o commit `base: harness-elo 2.6.0` com a tag `base-harness-2.6.0`. O FDE cria `.harness-template` no terminal (modo template, A1).

#### 2. `ORIGEM.md` (Create)

*   **Type / Scope**: registro do fork.
*   **Proposed Changes**:
    *   versão base (`harness.json.versao` = 2.6.0) e SHA do commit base;
    *   data e lista de remoções com o motivo;
    *   a comparação com versões futuras usa `git diff --stat base-harness-2.6.0..HEAD`.

#### 3. `.gitignore` (Modify)

*   **Type / Scope**: configuração.
*   **Proposed Changes**: acrescentar `.env*`, `!.env.example`, `app/dist/`, `app/node_modules/` e `outputs/spec/_tmp/`.

#### 4. `.env.example` (Create)

*   **Type / Scope**: modelo do `.env.instancia`.
*   **Proposed Changes**: as variáveis abaixo, sem valores.
    *   `SN_SDK_INSTANCE_URL`, `SN_SDK_USER`, `SN_SDK_USER_PWD` (nomes que o SDK lê, `ci-integration.md:159-165`)
    *   `SN_ALIAS=dev493801`
    *   `GH_REPO=arthurleardini/speckit-servicenow`

#### 5. `package.json` (Create, raiz)

*   **Type / Scope**: ferramentas.
*   **Proposed Changes**:
    *   Dependência `playwright`, com `engines.node` em `>=20.18 <27`.
    *   `"test": "node --test .claude/**/*.test.mjs"`
    *   `"doutor": "node .claude/ferramentas/doutor.mjs"`
    *   `"capture": "node .claude/skills/sn-capture/scripts/capture.mjs"`
    *   `"publish": "node .claude/skills/sn-tasks-github/cli.mjs"`
    *   `"reinstall": "node .claude/skills/sn-reinstall/scripts/reinstall.mjs"`
    *   `"atf": "node .claude/skills/sn-implement/scripts/atf.mjs"`

#### 6. `app/` (Create via `now-sdk init`)

*   **Type / Scope**: projeto Fluent.
*   **Proposed Changes**:
    1. Conferir na instância `glide.appcreator.company.code = 2326104` e que `x_2326104_cob` não existe em `sys_scope` (RN-SN-02).
    2. Rodar `cd app && npx @servicenow/sdk@4.14 init --appName "Cobrança MT" --packageName cob --scopeName x_2326104_cob --template base`.
    3. O template `base` cria `package.json` e `now.config.json`. As pastas `src/fluent/` (com `tables/`, `ui/`, `navigation/`, `security/`, `seed/`, `simulations/` e `tests/`) e `src/server/` são criadas à mão.
    4. Fixar `@servicenow/sdk` em `4.14.x` (o DELETE pelo `keys.ts` exige ≥ 4.14).
    5. `src/fluent/generated/keys.ts` vai para o git, e o build usa `--frozenKeys`.

#### 7. `.claude/settings.json` (Modify)

*   **Type / Scope**: configuração do Claude Code.
*   **Proposed Changes**:
    *   Habilitar o plugin `servicenow-sdk@claude-plugins-official` no escopo do projeto.
    *   Liberar sem confirmação `now-sdk explain`, `now-sdk query`, `now-sdk build`, `npm run reinstall` (sem `--zerar`) e `npm run atf`.
    *   `now-sdk install` direto e `npm run reinstall -- --zerar` continuam pedindo confirmação.
    *   `permissions.deny`: `Read(./.env.instancia)`, `Bash(cat .env*)`, `Bash(*.env.instancia*)`.

#### 8. `.claude/ferramentas/doutor.mjs` (Modify) + `doutor.test.mjs` (Modify)

*   **Type / Scope**: pré-requisitos.
*   **Proposed Changes**: checagens novas.
    *   Node dentro do `engines`.
    *   `now-sdk --version` igual ao fixado.
    *   Alias `dev493801` no `now-sdk auth`.
    *   GET do prefixo na instância.
    *   `gh auth status` com escopo `repo`.
    *   Playwright com Chromium.
    *   `.env.instancia` com permissão 600.
    *   Modo do repositório: template ou clone.
    *   `check_sensivel.py` acessível no caminho absoluto.
    *   Saída verde/vermelho por item, sem imprimir segredo.

#### 9. Teste de viabilidade (estágio 0, app descartável)

*   **Type / Scope**: quatro checagens com desfecho registrado em `ORIGEM.md`.
*   **Proposed Changes**: instalar um app mínimo e, ao final, removê-lo da instância.
    1. **ATF:** um `Test()` de servidor e um de form, rodados por `now-sdk cicd test run -o json`.
        *   **Desfecho A, os dois rodam:** o gate exige recibo verde de servidor e de form.
        *   **Desfecho B, só o de servidor roda:** form vira isenção de ATF de form, rodada à mão no Client Test Runner antes da demo. Um `sn-atf-runner` com Playwright fica como evolução.
        *   **Desfecho C, nenhum roda:** o `npm run atf` passa a consultar `sys_atf_result` depois de disparar a suíte pela API REST de ATF. Se isso também falhar, o ATF sai do gate e fica só como evidência manual na demo.
    2. **Report:** `Record({ table: 'sys_report' })` com um report de barras aparece na UI16. Se não aparecer, os KPIs da F6 viram list com group-by.
    3. **Imagem:** um PNG commitado e referenciado por permalink aparece numa issue do repositório privado para a conta que vai assistir à demo.
    4. **Nome de tabela:** o maior nome previsto (`x_2326104_cob_` mais o sufixo) cabe em 30 caracteres.

### Estágio 2: endurecimento do kit

#### 10. `CLAUDE.md` (Modify)

*   **Type / Scope**: constituição do projeto.
*   **Proposed Changes**:
    *   Stack-alvo ServiceNow: Fluent, Core UI clássica, app escopado.
    *   Fases com as skills novas.
    *   Regra: consultar `now-sdk explain` antes de escrever cada tipo de objeto.
    *   Regra: nunca apagar `Table()`, `BusinessRule()` ou `Record()` sem confirmar.
    *   Instalar só por `npm run reinstall`.
    *   Escopo sempre lido de `app/now.config.json`.
    *   Apontar `inputs/premissas-ficticias.md` e `inputs/fio-condutor.md`.

#### 11. Rule de UI e validação de frontend

*   **Type / Scope**: `.claude/rules/harness/frontend.md` (Delete) → `.claude/rules/harness/servicenow-ui.md` (Create).
*   **Proposed Changes**:
    *   **Conteúdo da rule nova:**
        *   Core UI clássica (UI16).
        *   `Form()` em seções de uma ou duas colunas.
        *   `List()`.
        *   Related lists embutidas.
        *   Formatter de activity em seção própria.
        *   UI Action para as ações de tela.
        *   UI Policy antes de Client Script.
        *   Painéis viram report simples ou list com group-by (item 9).
        *   Proibido usar Workspace, Portal e UI Builder.
        *   Carrega com `paths: app/src/fluent/**`.
    *   **Também mudam** (Modify):
        *   `.claude/ferramentas/validacao/rules.mjs`: `RULE_FRONTEND` aponta para `servicenow-ui.md`, com regex de seção novas.
        *   `.claude/ferramentas/validacao/varredura.mjs:399-410`: troca as checagens de Next.js por checagens de `.now.ts`.
        *   `.claude/ferramentas/gerar-cursor.mjs` e `gerar-kiro.mjs`: trocam o nome do arquivo.

#### 12. `.claude/rules/harness/security.md` (Modify)

*   **Type / Scope**: kernel de segurança.
*   **Proposed Changes**:
    *   **Camada G, antes frontend web, passa a cobrir:**
        *   ACL por tabela, campo e operação;
        *   `GlideRecordSecure` em código chamado pelo cliente;
        *   script include client-callable só com ACL;
        *   cross-scope privilege declarado;
        *   role mínima.
    *   Saem os itens de cabeçalho HTTP e npm.
    *   Referência às RN-SN-135 a 150.

#### 13. `.claude/rules/harness/explore.md` (Modify)

*   **Type / Scope**: rule da fase.
*   **Proposed Changes**: nova ordem do Explore.
    1. `workspace.md` + `sync-log.md`
    2. `spec-frame`, opcional, sem mudança
    3. `spec-ingest`
    4. `spec-legacy`, opcional e fora do v0
    5. `hld-funcional`
    6. `especificacao-funcional`, com a tabela de telas `TEL-`
    7. `especificacao-tecnica` e `modelo-de-dados` preliminares (os dois continuam obrigatórios em `DOCS_EXPLORE`)
    8. `spec-data-model --previa`
    9. `sn-scaffold`
    10. `npm run reinstall`
    11. `sn-capture`
    12. revisão do `gaps.md` contra a instância
    13. `fecho-explore`

    Sai o de-para da `spec-prototype`.

#### 14. `.claude/rules/harness/plan.md` e `deliver.md` (Modify)

*   **Type / Scope**: rules das fases.
*   **Proposed Changes**:
    *   **Plan:** usa `spec-tasks` alterada, passa pelo gate `promocao.mjs --rastreio` e publica por `sn-tasks-github`.
    *   **Deliver:**
        *   `spec-scaffold` sai e dá lugar a `sn-scaffold`;
        *   `spec-implement` sai e dá lugar a `sn-implement`;
        *   instalação só por `npm run reinstall`;
        *   pronto da US = install registrado + recibo de ATF (ou isenção) + auditoria;
        *   tabela de validação por tipo de story.

#### 15. `.claude/hooks/kit.mjs` (Modify) + `kit.test.mjs` (Modify)

*   **Type / Scope**: inventário canônico e gramática.
*   **Proposed Changes**:
    *   **`WHITELIST_EXPLORE`** (l. 70–88): acrescentar `data-model.previa.json`. Os itens `prototype.md` e `design-system.md` saem.
    *   **Removidos:** `ARTEFATOS_PROTOTIPO` (l. 94), `PROTOTIPO_MD`, `FIDELIDADE_DO_EXPLORE`, `lerFidelidade` e `nivelDeFidelidade`, com os imports em `fecho-explore.mjs` e `.claude/ferramentas/wiki.mjs:17,39`.
    *   **`ID_PADRAO`:** acrescentar `SIM-\d{2}` e `CT-MOD-[A-Z0-9-]*-\d{2,4}`. `RF-MOD-*` já é aceito (l. 704).
    *   **Seção A do `sync-log`** (`COLUNAS_SECAO_A`, l. 1145): o install entra nas 9 colunas existentes, sem coluna nova.

#### 16. `.claude/hooks/fecho-explore.mjs` (Modify) + `fecho-explore.test.mjs` (Modify)

*   **Type / Scope**: gate Explore → Plan.
*   **Proposed Changes**:
    *   **Sai** a checagem de fidelidade (l. 943–945) e as mensagens dela (l. 548–587).
    *   **Entram** as três condições do Technical Plan, "Gate do Explore":
        1. rota e `screenshot` em toda `TEL-` da tabela de telas;
        2. última linha de install com `ok` e commit = `git log -1 --format=%H -- app/src/fluent`;
        3. documentos do seed contidos em `_documentos.json`.
    *   **`SKILLS_DO_PLAN`** (l. 38–50): sem `spec-prototype`.
    *   **Testes:** um por condição de bloqueio.

#### 17. `.claude/hooks/cadeia.mjs` (Modify) + `cadeia.test.mjs` (Modify)

*   **Type / Scope**: pré-requisitos (existência de arquivo, relativo a `outputs/spec/`).
*   **Proposed Changes**:
    *   **`spec-data-model --previa`:** `exigeNoExplore` = `../explore/modelo-de-dados.md`.
    *   **`spec-data-model` (final):** mantém `tech-rules/tech-rules-summary.md`.
    *   **`sn-scaffold`:** no Explore, `data-model.previa.json`. No Plan, `data-model.json`.
    *   **`sn-capture`:** `screens-manifest.json`.
    *   **`sn-tasks-github`:** `tasks.json` e `traceability.json`.
    *   **`sn-implement`:** `id-map.json`.
    *   **`spec-tasks`:** deixa de exigir `api-contracts.yaml`.
    *   Checagens de conteúdo (install ok, issue no mapa) ficam no próprio script da skill, que sai com erro e mensagem.

#### 18. `.claude/hooks/sync-log.mjs` e `gramatica.mjs` (Modify) + testes (Modify)

*   **Type / Scope**: log e gramática.
*   **Proposed Changes**:
    *   **`SKILLS_NOSSAS`** (`sync-log.mjs:42-70`): incluir as 6 skills `sn-*`.
    *   **Linha de install na Seção A** (9 colunas):

        | Coluna | Valor |
        |---|---|
        | Skill | `now-sdk-install` (rótulo, não é skill) |
        | Modo | `alias` |
        | Inputs | `escopo` |
        | Outputs | `commit` |
        | Decisões | `resultado`; `registros` |

    *   **`gramatica.mjs`:** reconhece `SIM-` e `CT-MOD-`.

#### 19. `.claude/hooks/delivery-gate.mjs` (Modify) + `delivery-gate.test.mjs` (Modify)

*   **Type / Scope**: gate de push (PreToolUse, só leitura, **nunca roda `now-sdk`**).
*   **Proposed Changes**: além da auditoria da US, o gate exige:
    1. linha de install `ok` no `sync-log` com o commit do HEAD para `app/src/fluent`;
    2. recibo `outputs/spec/auditorias/atf/<STORY>.json` verde e do mesmo commit, ou isenção da story conforme o desfecho do item 9.

    Sem recibo ou com instância fora do ar, o gate reprova com mensagem.

#### 20. `.claude/skills/spec-tasks/templates/tasks.schema-atual.json` (Modify) + exemplos e `validate-examples.mjs` (Modify)

*   **Type / Scope**: schema `tasks/v5.4`.
*   **Proposed Changes**:
    *   **`metadata.schemaVersion`:** os validadores aceitam `v5.3` e `v5.4`.
    *   **Campo opcional `Task.snArtifact`:**
        *   `kind`, um enum com `table`, `form`, `list`, `business_rule`, `client_script`, `ui_policy`, `ui_action`, `script_include`, `acl`, `role`, `flow`, `atf`, `notification`, `report`, `menu`, `seed` e `simulation`;
        *   `table?`, `fluentFile` e `nowId`.
    *   **Campo opcional `Story.uiContext.instanceUrl`.**
    *   **`Task.type`** não muda.
    *   **Exemplo:** `tasks.example-completo.json` ganha uma task com `snArtifact.kind = business_rule`.

#### 21. `.claude/skills/spec-tasks/scripts/validate-tasks-selfsufficiency.mjs`, `validate-tasks-business.mjs`, `enrich-tasks.mjs` (Modify)

*   **Type / Scope**: validadores do backlog.
*   **Proposed Changes**:
    *   **Quando há `snArtifact`:** exigir `kind`, `fluentFile` e `nowId`.
    *   **`table`:** exigir só para `table`, `form`, `list`, `business_rule`, `client_script`, `ui_policy`, `ui_action`, `acl` e `seed`.
    *   **`apiContracts`:** dispensado quando há `snArtifact` e o `kind` não é `simulation`.

#### 22. Leitores de tipo (`spec-estimate`, `spec-status-report`) (sem mudança)

*   **Type / Scope**: nenhum arquivo.
*   **Proposed Changes**: como `Task.type` não muda (A6), `forecast.mjs`, `detect-phase.mjs` e `collect-code.mjs` continuam funcionando.

### Estágio 1: caminho da demo

#### 23. `.claude/skills/spec-data-model/` (Modify, no lugar)

*   **Type / Scope**: skill, schema e validador.
*   **Proposed Changes**:
    *   **`data-model.schema.json`:**
        *   tipos ServiceNow: `string`, `integer`, `decimal`, `boolean`, `reference`, `choice`, `glide_date`, `glide_date_time`, `journal`, `journal_input`, `currency`;
        *   propriedades `extends`, `display`, `choices[]`, `auto_number` e `audit`.
    *   **`validate-data-model.mjs`:**
        *   prefixo lido de `app/now.config.json`;
        *   nome de tabela com até 30 caracteres;
        *   coluna da tabela própria sem prefixo;
        *   `reference` só para tabela existente (RN-SN-03/04).
    *   **Modo `--previa`:** grava `outputs/spec/data-model.previa.json` a partir de `modelo-de-dados.md`.
    *   **Modo final:** grava `data-model.json`.
    *   Sem diff e sem migração.

#### 24. `.claude/skills/sn-scaffold/SKILL.md` + `scripts/scaffold.mjs` (Create, extensão; ponto de partida: `add-table` do `sn-app-template`)

*   **Type / Scope**: skill.
*   **Proposed Changes**: lê a prévia no Explore e o modelo final no Plan, mais a tabela de telas. Gera em `app/src/fluent/`:

    | Pasta | Conteúdo |
    |---|---|
    | `tables/` | `Table()` com colunas, choices, `journal_input` e `audit` nas tabelas de form |
    | `ui/` | `Form()` e `List()` por `TEL-` |
    | `navigation/menu.now.ts` | menu e módulos de F1 a F6 |
    | `security/roles.now.ts` | `<escopo>.coordenador`, `<escopo>.atendente`, `<escopo>.admin` |
    | `security/acl-base.now.ts` | leitura por role |
    | `simulations/` | tabelas `SIM-` do item 39 |

    Chama o `sn-seed`. O `$id` segue `Now.ID['<ID-da-spec>_<tipo>_<nome>']`. Depois do build, grava o `screens-manifest.json` (Technical Plan, "Telas"). A spec de referência é `.claude/skills/tools/references/screens-manifest.md` (Modify: produtor `sn-scaffold`, campos `type`, `role`, `capturedAt`, rota na instância).

#### 25. `.claude/skills/sn-seed/SKILL.md` + `scripts/gerar-seed.mjs` (Create, extensão)

*   **Type / Scope**: skill e gerador.
*   **Proposed Changes**:
    *   **No Explore**, lê `modelo-de-dados.md` e a tabela de telas, e gera:
        *   1 registro demo nomeado por `TEL-`;
        *   50 registros por tabela;
        *   1 `sys_user` demo por role, sem senha;
        *   2 a 3 linhas de journal por registro demo.
    *   **No Plan**, regera com os limites das RN e os `acceptanceScenarios[].testData`. O volume vai até 300 por tabela, porque o laço do Flow é limitado a 1.000 iterações (RN-SN-154).
    *   **Documentos fictícios:**
        *   CPF e CNPJ com DV válido a partir de uma semente fixa;
        *   `ficticio = true` nos registros de pessoa;
        *   inconsistências plantadas: documento sobreposto entre fontes e falha de entrega.
    *   **Saída:** `app/src/fluent/seed/*.now.ts` com `Record()` e `$meta: { installMethod: 'demo' }`, mais `_documentos.json` e `_contagem.json`.

#### 26. `.claude/skills/sn-capture/SKILL.md` + `scripts/capture.mjs` (Create, extensão)

*   **Type / Scope**: skill e script Playwright.
*   **Proposed Changes**:
    1. Carrega `.env.instancia` e faz login como admin.
    2. Para cada `TEL-` do `screens-manifest.json`, faz impersonate do usuário demo do papel da tela, abre a rota e espera a carga.
    3. Salva `outputs/spec/screens/<TEL>.png` em 1440×900, com menos de 5 MB, e atualiza `screenshot` e `capturedAt`.

    *   **Modo `--story <ID>`:** grava em `outputs/spec/screens/deliver/<STORY>-<TEL>.png`.
    *   **Falha:** sai com código diferente de zero se alguma rota falhar.

#### 27. Remoções (Delete) e testes que as acompanham (Modify)

*   **Type / Scope**: skills fora do alvo.
*   **Proposed Changes**:
    *   **Remover:**
        *   `.claude/skills/spec-prototype/`;
        *   `spec-convert-prototype/`;
        *   `spec-scaffold/`;
        *   `spec-implement/`, depois de copiado para o item 29;
        *   `spec-tasks-azure/`, depois de copiar `lib/load-tasks.mjs` para o item 28.
    *   **Atualizar as referências a essas skills:**
        *   `.claude/ferramentas/preservacao.test.mjs`, `relatorio-fases.test.mjs`;
        *   `.claude/hooks/tasks-azure-dry-run.test.mjs` (Delete), `onda5-decisoes.test.mjs`, `skills-correcoes.test.mjs`, `modulo-placeholder.test.mjs`;
        *   `.claude/skills/spec-status-report/lib/load-dotenv.mjs`, `spec/SKILL.md`, `spec-tasks-html/lib/render-html.mjs`;
        *   `tools/check-outputs.py`, `tools/references/paths.md`.
    *   As remoções ficam registradas no `ORIGEM.md`.

#### 28. `.claude/skills/sn-tasks-github/` (Create, extensão: `SKILL.md`, `cli.mjs`, `lib/github-upsert.mjs`, `lib/publish-plan.mjs`, `lib/load-tasks.mjs`, `package.json`)

*   **Type / Scope**: publicador.
*   **Proposed Changes**:
    *   **Contrato do `spec-tasks-azure`:** gate de autossuficiência, `--dry-run`, `--change` e `--id-map`.
    *   **Mapeamento:**
        *   Épico e funcionalidade viram issue (labels `epic`/`feature`).
        *   A story vira sub-issue, via `gh api POST /repos/{o}/{r}/issues/{n}/sub_issues` com o `sub_issue_id` numérico.
        *   As tasks entram como checklist no corpo, com `snArtifact` e cenários.
        *   Labels `sn:<kind>`, e `fio-condutor` nas stories cujos RF estão em `inputs/fio-condutor.md`.
    *   **Corpo da issue:** o marcador `<!-- logical-id: X -->` e a imagem por `blob/<sha>/outputs/spec/screens/<TEL>.png?raw=1`.
    *   **Bloqueio:** o publicador falha se a story tem `uiContext.screenshot` e o arquivo não existe ou não foi commitado.
    *   **`outputs/spec/id-map.json`:** mapeia `logical-id → {number, id}` e é relido no `--change`, que também publica as tasks SEC novas do Deliver.

#### 29. `.claude/skills/sn-implement/SKILL.md` + `scripts/atf.mjs` (Create, extensão, copiando `spec-implement`)

*   **Type / Scope**: skill e leitor de ATF.
*   **Proposed Changes**: o fluxo por task fica igual (Test Blueprint, ciclo G3). O que muda:
    1. Consultar `now-sdk explain <tópico> --peek` antes de cada tipo de objeto.
    2. Escrever em `app/src/fluent/<tipo>/` e `app/src/server/`.
    3. Gerar `Test()` em `app/src/fluent/tests/<STORY>.now.ts` a partir dos `acceptanceScenarios`, com caso positivo e negativo por regra (`atf-guide.md`).
    4. `npm run reinstall`.
    5. `npm run atf -- --story <ID>`: roda o leitor do item 9 e grava o recibo.
    6. Validação conforme o tipo da story. No fio condutor, `node .claude/ferramentas/validar.mjs --repo app --cmd-build "npx now-sdk build" --cmd-testes "npm run atf -- --story <ID>"`.
    7. `sn-capture --story`.
    8. `gh issue comment` com o resultado, os prints (permalink) e o commit.

#### 30. `.claude/skills/sn-reinstall/SKILL.md` + `scripts/reinstall.mjs` (Create, extensão; ponto de partida: `deploy` do starter)

*   **Type / Scope**: skill e script.
*   **Proposed Changes**:
    1. Confere se o prefixo da instância é igual ao de `app/now.config.json`. Se for diferente, para.
    2. Confere os documentos do seed contra `_documentos.json`.
    3. Roda `now-sdk build --frozenKeys` e `now-sdk install --auth $SN_ALIAS`.
    4. Compara a contagem de registros por tabela com `seed/_contagem.json`.
    5. Roda a suíte `TestSuite()` "cob-regressao" (`app/src/fluent/tests/suite.now.ts`).
    6. Escreve a linha de install no `sync-log`.

    É idempotente, porque os `$id` são fixos. O `--zerar` (reinstalação destrutiva) sempre pede confirmação.

#### 31. Skills existentes alteradas no lugar (Modify)

*   **Type / Scope**: conteúdo das skills.
*   **Proposed Changes**:
    *   **`spec-tech-rules`:** templates `.mdc` ServiceNow (`conventions`, `architecture`, `security`, `test-strategy`, `deploy-and-build`), com as RN-SN do arquivo 32 como referência.
    *   **`spec-hld`:** containers instância, escopo, tabelas simuladas e GitHub, mais o ADR "configurar × customizar".
    *   **`revisao-de-seguranca`:** catálogo `SEC-` com os vetores da plataforma.
    *   **`spec-iterate`:** pontos cegos de plataforma, e a colheita das telas passa a ler o `screens-manifest.json` da instância.
    *   **`spec-code-audit`:** lint das RN-SN [AUTO] sobre `.now.ts`.
    *   **`spec-debug-fix`:** evidência por system log e execution details.
    *   **`spec-status-report`:** lê os recibos de ATF.
    *   A etapa de contratos de API (`spec-api-contracts`) fica opcional, e as simulações são descritas em `inputs/simulacoes.md` e no modelo de dados.

#### 32. Validadores G3 (Modify) + `validador-escopo-app.md` (Create, extensão)

*   **Type / Scope**: `.claude/agents/validador-*.md`, `.claude/ferramentas/validacao/roteador.mjs`, `validar.mjs`, `validacao.test.mjs`.
*   **Proposed Changes**:
    *   **Checklists por validador:**
        *   `testes`: cada RN tem `Test()` positivo e negativo.
        *   `seguranca`: ACL, `GlideRecordSecure`, client-callable.
        *   `performance`: GlideRecord em laço, `getRowCount`, `GlideAggregate`.
        *   `observabilidade`: `gs.error`/`gs.warn` no lugar de `console.log`.
        *   `rules-tecnicas`: as `.mdc` da `spec-tech-rules`.
    *   **`validador-escopo-app`:** novo, com as 21 regras da seção 2.12 do arquivo 32 e `maxTurns ≤ 4`. Pode partir dos revisores do `servicenow-claude-kit` (MIT).
    *   **`roteador.mjs`:**
        *   `escopo-app` entra em `DIMENSOES`, com regra própria para `app/src/`;
        *   regex de performance passa a reconhecer `GlideRecord|GlideAggregate|\.query\(|\.next\(`;
        *   regex de observabilidade passa a reconhecer `gs\.(info|warn|error|debug)`.

#### 33. `.claude/ferramentas/promocao.mjs` (Modify) + `promocao.test.mjs` (Modify)

*   **Type / Scope**: promoção e rastreio.
*   **Proposed Changes**:
    *   **Modo `--rastreio`:** gera `outputs/spec/traceability.json` com o formato do Technical Plan.
    *   **Fontes:**
        *   `tasks.json`, para `sourceRefs`;
        *   `app/src` (varredura de `Now.ID[`) e `keys.ts`, para os `nowIds`;
        *   os recibos de ATF, para `atf` e `nivel`.
    *   **Gate:** zero RF sem story. O `cadeia.mjs` exige o `traceability.json` antes do `sn-tasks-github`.

#### 34. `.claude/templates/especificacao-funcional.md` (Modify)

*   **Type / Scope**: template do Explore.
*   **Proposed Changes**:
    *   A tabela de telas ganha as colunas `TEL-`, tabela ServiceNow, tipo (form/list/report), visão, papel e "registro demo da tela".
    *   A matriz de acesso §1.2 passa a usar as roles `<escopo>.*`.

#### 35. `harness-zona.lock.json` (Create, uma vez)

*   **Type / Scope**: manifesto da zona.
*   **Proposed Changes**:
    *   **No fim do estágio 2:** gerar com `montarManifesto` (`verificar-zona.mjs`), fazer o commit e remover `.harness-template`.
    *   **A partir daí:** o repositório é clone, e as skills `sn-*` e o `validador-escopo-app` seguem como extensões.

#### 36. `.claude/hooks/vendorizacao.test.mjs`, `wiring.test.mjs`, `skills-prosa.test.mjs` (Modify)

*   **Type / Scope**: testes do harness.
*   **Proposed Changes**: atualizar as listas esperadas de skills e caminhos. A suíte inteira (`npm test`) passa a cada commit do estágio 2.

### Estágio 1: insumos do piloto

#### 37. `inputs/plano-2.6-cobranca.md` (Create)

*   **Type / Scope**: insumo.
*   **Proposed Changes**: cópia do plano 2.6 Cobrança, feita depois do `check_sensivel.py`.

#### 38. `inputs/de-para-ids.md` (Create)

*   **Type / Scope**: renomeação de IDs.
*   **Proposed Changes**:
    *   Tabela `ID no plano (F<n>/RF-<nn>/CT-<nn>) → RF-MOD-F<n>-<nnn> / CT-MOD-F<n>-<nnn>`.
    *   Saltos de numeração registrados.
    *   Transversais → `RF-MOD-T-<nnn>`.

#### 39. `inputs/simulacoes.md` (Create)

*   **Type / Scope**: integrações simuladas.
*   **Proposed Changes**:
    *   **`SIM-01`, score UFMT:** tabela `<escopo>_score_sim`, com uma fração "sem score" para o fallback.
    *   **`SIM-02`, envio por canal:** tabela `<escopo>_envio_sim`, com status e interruptor de falha por canal. O WhatsApp só envia com opt-in.
    *   **`SIM-03`, fontes de débito:** campo `origem` com 5 choices (CCF, MPI/Big Data, IPVA, ITCD, SNE) e uma tabela de staging.
    *   **Todas:** rótulo "Simulado" no form e label `sn:simulation` nas issues.

#### 40. `inputs/fio-condutor.md` (Create) e artefatos do piloto

*   **Type / Scope**: escopo do fio condutor e saídas das skills.
*   **Proposed Changes**: lista dos RF do fio condutor:
    *   F2 Qualificação: critério versionado e imutável depois de publicado, grupo de controle sorteado por ciclo, fallback "sem score";
    *   dossiê da F5;
    *   ACL "atendente vê só a própria carteira".

    `outputs/**` e `app/src/**` são produzidos pelas skills na ordem do Fluxo.

#### 41. `inputs/premissas-ficticias.md` (Create)

*   **Type / Scope**: resposta à Q3.
*   **Proposed Changes**: valores adotados onde o plano deixa em aberto, todos marcados como "premissa":

    | Parâmetro | Premissa |
    |---|---|
    | Ciclo de qualificação | mensal |
    | Desempate | maior débito, depois o mais antigo |
    | Grupo de controle | 10% da carteira por ciclo |
    | Fallback de canal | SNE → e-mail → SMS |
    | Dossiê | 3 níveis |

    A `spec-product` registra cada valor como `RN` com origem "premissa".

#### 42. `outputs/spec/demo/roteiro.md` (Create)

*   **Type / Scope**: roteiro da demo (resposta à Q4).
*   **Proposed Changes**:
    *   **Véspera:** `npm run reinstall` completo e `doutor`.
    *   **Trilha pronta:** CUJ 1 com um RF da F2 e um do dossiê da F5, mais a matriz aberta no `spec-tasks-html`.
    *   **Trecho ao vivo:** uma story pequena do fio condutor, da issue ao recibo de ATF.
    *   **Plano B offline:** `report/tasks.html` com prints embutidos e o vídeo do ensaio.

### Verification Plan

*   **Build**: `cd app && npx now-sdk build --frozenKeys` sem erro a cada commit em `app/`.
*   **Testes do kit**: `npm test` verde a cada commit do estágio 2.
*   **Gates**: cada condição de bloqueio do `fecho-explore`, do `cadeia.mjs` e do `delivery-gate` tem um teste em `*.test.mjs`.
*   **Publicador**:
    *   `--dry-run` lista o plano sem criar nada.
    *   A execução para valer cria as issues.
    *   O `--change` não duplica: cada `logical-id` aparece em um único corpo de issue, conferido pelo marcador.
*   **Instância**: `npm run reinstall` duas vezes seguidas dá a mesma contagem de registros, igual a `_contagem.json`, e a suíte "cob-regressao" fica verde ou só com as isenções da tabela de validação.
*   **Rastreio**: `promocao.mjs --rastreio` com zero RF sem story, e todo RF do fio condutor em N3.
*   **Sigilo**: todo documento do seed em `_documentos.json`, e `check_sensivel.py` com score menor que 40 em `inputs/`, `outputs/**/*.md` e no corpo das issues.
*   **Ensaio**: a instância zerada, ou uma segunda instância com o mesmo prefixo, volta à demo completa com `npm run reinstall`, sem intervenção além da autenticação do CUJ 4. O CUJ 1 é percorrido do começo ao fim.

--------------------------------------------------------------------------------

*Drafted with EGM*
