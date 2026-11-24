# Revisão EGM consolidada: speckit-servicenow-v0.md

* **Alvo:** `docs/designs/speckit-servicenow-v0.md` (591 linhas; FeatureRange 1–232, DetailedRange 233–591)
* **Data:** 2026-11-24
* **Modo:** relatório consolidado (estágios 5→9 sem pausa)
* **Contexto dos revisores:** `referencias/00, 12, 30, 32, 33`, plano 2.6 Cobrança, harness Elo 2.6.0 extraído, docs do ServiceNow SDK

## Contagem bruta por estágio

| Estágio | Relatório | 🔴 | 🟡 | 🟢 |
|---|---|---|---|---|
| 5. Zoom Out inicial | [zoom_out_report.md](zoom_out_report.md) | 2 | 15 | 7 |
| 6. Compreensão | [comprehension_report.md](comprehension_report.md) | 0 | 11 | 6 |
| 7. Crítica | [critic_report.md](critic_report.md) | 2 | 8 | 11 |
| 8. Zoom Out intermediário | [intermediate_zoom_out_report.md](intermediate_zoom_out_report.md) | 3 | 9 | 3 |
| 9. Prontidão de implementação | [implementation_readiness_report.md](implementation_readiness_report.md) | 4 | 28 | 27 |
| **Total bruto** | | **11** | **71** | **54** |

Os 136 achados brutos viraram as **31 ações** abaixo. Onde os estágios propunham coisas diferentes, vale a conciliação do estágio 8 (Z8-x), que escolhe o conjunto mínimo coerente.

## Leitura geral

O desenho geral se sustenta: nenhum revisor contestou instância como protótipo, Core UI clássica, GitHub, repositório único ou integrações simuladas. O problema está no plano detalhado, que não roda do jeito que está escrito. Ele trava em três pontos do harness:
- a zona imutável;
- a whitelist do Explore;
- o formato do `sync-log`.

Falta também um dono para o `screens-manifest.json`. O documento ainda cresce mais do que o plano exige, e o estágio 8 corta parte disso.

## 🔴 Blockers (8 ações)

| # | Ação | Origem |
|---|---|---|
| R1 | **Ciclo da zona imutável.** O repositório roda como *template* (sem lock, com `.harness-template`) até o fim do bloco de endurecimento. O lock é gerado uma vez, com `montarManifesto`, e só o ensaio e a demo rodam travados. O commit base leva a tag `base-harness-2.6.0`, o `ORIGEM.md` fica sem hashes e o `doutor` só confere se o repositório está em modo template ou clone. Reescrever A1 e os itens 1, 2, 8 e 35 | S5 B1, S5 M14, S8 Z8-1 |
| R2 | **Sigilo do seed por faixa sentinela.** O `sn-seed` gera CPF/CNPJ numa faixa documentada que não colide, e o gate do Explore confere que todo documento do seed está nela. O `check_sensivel.py` (que pontua demais com volume e deixa passar número sem pontuação) continua só em `inputs/`, `outputs/*.md` e no corpo das issues, e passa a ser referenciado por caminho fora do repositório. Sem máscara na UI | S5 B2, S7 M5, S8 Z8-3, S9 M4 |
| R3 | **Prévia do modelo de dados permitida no Explore.** Usar o arquivo `outputs/spec/data-model.previa.json`, incluído no `WHITELIST_EXPLORE` (`kit.mjs:70-88`). `exigeNoExplore` explícito: `sn-data-model` exige `modelo-de-dados.md` e `sn-scaffold` exige a prévia. Dizer qual arquivo o scaffold lê em cada fase. Sem diff nem migração no v0, porque o `keys.ts` com `deleted: true` cuida da remoção. Regra única: `--zerar` sempre pede confirmação | S9 B1, S5 M6, S7 N2, S8 Z8-2 |
| R4 | **Registro de install e ATF.** O install entra na Seção A do `sync-log` (9 colunas, com Skill=`sn-install`) ou numa seção nova com parser próprio no `kit.mjs`. O ATF ganha um recibo por story em `outputs/spec/auditorias/atf/<STORY>.json`, escrito pelo leitor único (`now-sdk cicd test run -o json` ou `sys_atf_result`). O `delivery-gate` e a `promocao.mjs` leem o recibo, e o `fecho-explore` compara o commit do install com `git log -1 -- app/src/fluent`. Incluir o `kit.mjs` nos itens 18–19 | S9 B2, S5 M3, S9 M9, S8 Z8-4 |
| R5 | **Dono do `screens-manifest.json`.** O `sn-scaffold` grava o manifesto depois do build, com `id`, `route`, `type`, `role`, `screenshot` e `capturedAt`. A rota de form vem do `keys.ts`, a partir de um registro de seed nomeado para cada `TEL-`. Atualizar `tools/references/screens-manifest.md` (produtor e campos) | S9 B3 |
| R6 | **`sn-tasks` e tipo de artefato.** O Plan usa a `spec-tasks` alterada no lugar, sem criar `sn-tasks`. O tipo ServiceNow vai em `Task.snArtifact.kind`, e o enum `Task.type` fica como está. O item 22 sai. Os validadores exigem `snArtifact` só quando ele existe e não cobram `table` de tipos sem tabela. Especificar a troca para v5.4 sem campo duplicado | S9 B4, S5 M7, S8 Z8-6, S9 M5, M6, M7, M24 |
| R7 | **Print na visão do papel.** O seed cria um `sys_user` demo por role, sem senha. A `sn-capture` entra como admin e faz *impersonate* do papel da tela. Isso vale para A10, CUJ 1, CUJ 2 e o item 26 | S7 C1, S8 Z8-10 |
| R8 | **Riscos do dia da demo.** Criar uma seção H2 curta com uma tabela de risco, mitigação e item. Riscos: PDI reclamada (mitigada pelo reinstall na véspera), trecho ao vivo falhando (plano B), SDK, GitHub e tokens. A l. 33 vai para essa seção. Sem agendamento diário | S7 C2, S5 M10, S8 Z8-9, Z8-12 |

## 🟡 Majors (17 ações)

| # | Ação | Origem |
|---|---|---|
| R9 | **Tabela de estágios.** Estágio 0 (viabilidade), caminho da demo (itens 6, 9, 23–26, 28–30 e 37–42) e endurecimento do kit (gates, gramática, wiring, lock, validadores), cada um com critério de saída. Corrigir as menções soltas a "estágio 2" e "primeiro estágio" | S5 M15, S6 #10, S8 Z8-12 |
| R10 | **Estágio 0 com um teste de viabilidade.** Quatro checagens: (1) `cicd test run` em servidor e form, com terceiro desfecho; (2) `sys_report` via `Record()` aparece no UI16; (3) PNG aparece numa issue de repositório privado para quem assiste; (4) o nome de tabela mais longo cabe em 30 caracteres. O `sn-atf-runner` entra só se a checagem 1 falhar para form. Completar o `now-sdk init` e fixar a versão do SDK (≥ 4.14) | S5 M2, S7 M4, S7 M7, S5 M11, S8 Z8-11, S9 M16, M26 |
| R11 | **Fork menor.** Skills realmente novas (`sn-scaffold`, `sn-seed`, `sn-capture`, `sn-tasks-github`, `sn-implement`, `sn-reinstall`) e o `validador-escopo-app` entram como extensão do projeto. Mudança só de conteúdo é feita na `spec-*` no lugar. A `sn-api-contracts` sai, e a etapa de contratos fica opcional, com as simulações descritas em `inputs/simulacoes.md` e no modelo de dados. Fazer as remoções baterem entre si (o `frontend.md` é referenciado pelo G3) e corrigir a origem inexistente | S5 M5, S5 M15, S8 §3, S9 M2, M19, M23 |
| R12 | **IDs no formato nativo.** `RF-MOD-F2-003` e `RF-MOD-T-001`, que o `kit.mjs:704` já aceita. A gramática só ganha `CT-` e `SIM-` se não houver família nativa. O `de-para-ids.md` faz a ponte com o plano | S5 M12, S6 #8, S8 Z8-5 |
| R13 | **Isenções com nome.** Uma tabela de três linhas por tipo de story (fio condutor, gerada, à mão) diz o que cada uma exige: G3, build/install, ATF de servidor, ATF de form. "Isenção de G3" e "isenção de ATF de form" passam a ser coisas distintas. Corrigir também o `_isencoes/` que, do jeito atual, derruba gates inteiros. Sem roteamento novo nem teto de tokens | S8 Z8-7, S6 #11, S5 M8, S9 M1, M28 |
| R14 | **Rastreio estático.** O `traceability.json` tem as colunas rf, ct, tel, story, tasks e nowIds. Os sys_id vêm do `keys.ts` e o ATF vem dos recibos (R4). Definir N1, N2 e N3 e "órfão" uma única vez. O gate ganha comando e hook. Sai o `traceability.live.json` | S5 M4, S6 #7, #17, S8 Z8-4, S9 M10 |
| R15 | **Publicador GitHub.** Idempotência pelo `id-map.json` mais o marcador `<!-- logical-id -->` no corpo da issue, sem label por ID. Labels só de tipo e `fio-condutor`. Project v2 opcional. Print por permalink com SHA. Guardar o `id` numérico da issue, que a API de sub-issue exige. Tasks de segurança achadas no Deliver também vão para o GitHub. Ajustar o CUJ 2 e o Verification Plan | S5 M13, S5 M11, S8 Z8-13, Z8-14, S9 M14, M17 |
| R16 | **Credencial.** `permissions.deny` para `Read(./.env*)` e `cat .env*`. Variáveis `SN_SDK_INSTANCE_URL`, `SN_SDK_USER` e `SN_SDK_USER_PWD`. O `.gitignore` precisa deixar o `.env.example` de fora da exclusão | S7 M6, S5 N3, S9 M20 |
| R17 | **Nome do app.** Escolher o sufixo curto antes do `init` (`cob` deixa 16 caracteres para o nome da tabela). Skills e validadores leem o escopo de `app/now.config.json`, sem teste de literal | S7 M7, S5 M9, S8 Z8-15 |
| R18 | **Instalação pelo script.** Liberar sem confirmação só o `npm run reinstall` (com a checagem de prefixo e da faixa sentinela). O `sn-implement` instala por ele. O `now-sdk install` direto e o `--zerar` continuam pedindo confirmação | S5 N6, S8 Z8-8 |
| R19 | **Precisão dos hooks.** Os itens 15 e 16 precisam citar constantes e linhas reais. O item 17 precisa caber no que o `cadeia.mjs` consegue expressar. O item 19 precisa dizer como um PreToolUse confere o build. O item 13 não pode tirar um documento que o gate exige. Ligar o validador novo no roteador para `app/src/**`, dar comando ao G3 do código e corrigir o `geradoDe` ausente do `harness.json` | S9 M3, M8, M9, M11, M12, M18, M21 |
| R20 | **Testes da app e da raiz.** Suíte ATF do app com contagem esperada vinda de uma fonte, e o script `test` da raiz com comando definido | S9 M13, M22 |
| R21 | **Entradas do seed no Explore.** Dizer de onde o seed tira os limites das RN e o `testData` ainda no Explore, ou gerar só a partir do `modelo-de-dados.md` e da tabela de telas. Dar o número do limite de laço do Flow | S9 M15, M25 |
| R22 | **Contradições internas.** `validador-escopo-app` sai dos Non-Goals. `sn-estimate`, `sn-legacy` e `sn-benchmark` ficam com um só status. Referência do item 9 para o item 19. Reinserir Q1 e Q4 como resolvidas. A l. 163 remete ao item 32. Alinhar `sn-seed` com o nome usado no arquivo 12 | S5 M1, S5 N4, N5, S6 #3, #4, #9 |
| R23 | **Clareza para quem lê sem contexto.** Um só vocabulário de fases (Explore/Plan/Deliver), definidas no Overview. Metas renomeadas para M1–M6 (o "G3" de meta colide com o ciclo G3). Uma seção única de Referências e glossário (RN-SN, arquivos 32/33, brief, zona imutável, gate de autossuficiência, isenção, FDE, SYDLE...) | S6 #1, #2, #5, #6, #12, S8 Z8-12 |
| R24 | **Spec mais enxuta.** The Problem fica só com o problema (l. 31 vai para o Overview ou Technical Plan, l. 33 vai para R8). As alternativas abrem pelo trade-off. Tirar o enum dos contras da Alternativa A. Registrar a atualização do `gh` como alternativa | S7 M1, M2, M8, S8 Z8-6 |
| R25 | **CUJ 5 para a meta da instância como protótipo.** Spec → `sn-scaffold` → install → `sn-capture` → `fecho-explore` libera ou bloqueia. Não entra CUJ 6. O G6 diz que está fora do critério de pronto, e a Alternativa G se alinha a isso | S7 M3, S7 N7, S8 Z8-12 |

## 🟢 Nits (6 ações agrupadas)

| # | Ação | Origem |
|---|---|---|
| R26 | Reaproveitar componentes prontos do arquivo 33 (skills `deploy` e `git-issues-*` do starter, `add-table` e `deploy-and-verify` do `sn-app-template`, revisores do `servicenow-claude-kit`, `check-scope-prefix.py`) | S5 N1 |
| R27 | Versionar `keys.ts` e usar `build --frozenKeys` | S5 N2 |
| R28 | Activity stream com `journal_input`, `audit` e linhas de journal no seed, ou tirar o activity stream da M3 | S7 N1 |
| R29 | Um só nome para a credencial (`.env.instancia`, com o `.env.example` como modelo). `sn-install` explicado como rótulo. Papéis de `sn-revisao-de-seguranca` × `spec-security-review`. Origem da label `fio-condutor` | S6 #13–#16 |
| R30 | Forma do documento: Open Questions antes do Detailed Plan, um só marcador de bullet, títulos numa língua só, régua uniforme, caminhos a partir de `10-elogroup/`, tabela de decisões com coluna de alternativas descartadas | S7 N3–N6 |
| R31 | Redação: linguagem menos coloquial, onde o GAP é registrado, Overview sem repetir as metas, M5 em frase completa, CUJ com Then verificável, frases de seis verbos divididas, mais os nits de estilo e de código do estágio 9 (lista no relatório) | S7 N8–N11, S9 nits |

## Matriz de rastreio (achado bruto → ação)

| Estágio | Achado → Ação |
|---|---|
| S5 | B1→R1 · B2→R2 · M1→R22 · M2→R10 · M3→R4 · M4→R14 · M5→R11 · M6→R3 · M7→R6 · M8→R13 · M9→R17 · M10→R8 · M11→R10/R15 · M12→R12 · M13→R15 · M14→R1 · M15→R9/R11 · N1→R26 · N2→R27 · N3→R16 · N4→R22 · N5→R22 · N6→R18 · N7→(sem ação: confirma escolhas) |
| S6 | #1→R23 · #2→R23 · #3→R22 · #4→R22 · #5→R23 · #6→R23 · #7→R14 · #8→R12 · #9→R22 · #10→R9 · #11→R13 · #12→R23 · #13–#16→R29 · #17→R14 |
| S7 | C1→R7 · C2→R8 · M1→R24 · M2→R24 · M3→R25 · M4→R10 · M5→R2 · M6→R16 · M7→R10/R17 · M8→R24 · N1→R28 · N2→R3 · N3–N6→R30 · N7→R25 · N8–N11→R31 |
| S8 | Z8-1→R1 · Z8-2→R3 · Z8-3→R2 · Z8-4→R4/R14 · Z8-5→R12 · Z8-6→R6/R24 · Z8-7→R13 · Z8-8→R18 · Z8-9→R8 · Z8-10→R7 · Z8-11→R10 · Z8-12→R9/R23/R25 · Z8-13→R15 · Z8-14→R15 · Z8-15→R17 |
| S9 | B1→R3 · B2→R4 · B3→R5 · B4→R6 · M1→R13 · M2→R11 · M3→R19 · M4→R2 · M5–M7→R6 · M8→R19 · M9→R4/R19 · M10→R14 · M11→R19 · M12→R19 · M13→R20 · M14→R15 · M15→R21 · M16→R10 · M17→R15 · M18→R19 · M19→R11 · M20→R16 · M21→R19 · M22→R20 · M23→R11 · M24→R6 · M25→R21 · M26→R10 · M27→R22 · M28→R13 · nits→R31 |

## Ordem sugerida de correção

1. **R1, R3, R4, R5, R6:** destravam o fluxo do harness, sem os quais o plano não roda.
2. **R2, R7, R9, R10:** sigilo, print correto, ordem de trabalho e teste de viabilidade.
3. **R11–R21:** enxugar o fork e precisar os itens.
4. **R8, R22–R25 e as nits:** documento.

Depois das correções, o método prevê no máximo uma nova auditoria por estágio.
