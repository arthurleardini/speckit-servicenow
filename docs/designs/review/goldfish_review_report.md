# Goldfish Annotated Review Report

**Status: resolved** (auto accept, 24/11/2026: 27 PROPOSE FIX aplicados em speckit-servicenow-v0.md v0.2; 4 DECLINE mantidos)

**Target:** `docs/designs/speckit-servicenow-v0.md` (full file, 1–591)
**Fonte dos achados:** as 31 ações de [consolidated_review_report.md](consolidated_review_report.md), que já deduplicam os 136 achados dos estágios 5–9.
**Resultado:** 27 PROPOSE FIX · 0 CONTEST · 0 ESCALATE · 4 DECLINE

Antes de classificar, conferi no harness extraído os blockers de código:
- `kit.mjs:70-88`: o `WHITELIST_EXPLORE` não tem `data-model*`, mas tem `screens-manifest.json` e `screens/`.
- `kit.mjs:1145`: a Seção A do `sync-log` tem 9 colunas.
- `zonas.mjs:174, 453`: o marcador `.harness-template` existe, e `souOTemplate` também.
- `kit.mjs:704`: a regex `RF-MOD-[A-Z0-9-]*-\d{2,4}` existe.

Os quatro pontos se confirmam, e não contestei nenhum achado.

## Prioritized Findings & AI Suggestions

### [R1] [`zoom-out`, `inventive-catalyst`] - Severity: Blocker
*   **Affected Scope:** A1 (l. 97); itens 1, 2, 8, 35
*   **Discrepancy Description:** Com o lock no primeiro commit, o repositório vira *clone*, e o hook bloqueia a edição de hooks, ferramentas, rules e skills. O `empacotar.mjs` não regenera o lock na raiz.
*   **Rationale:** sem isso, o estágio 1 não consegue editar os arquivos que precisa editar.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** confirmado em `zonas.mjs:453`. A correção do Z8-1 também resolve o conflito com o M15.
*   ***Proposed Edit:***
    *   **A1:** "Fork adaptável em dois modos. Até o fim do bloco de endurecimento, o repositório roda como template: commit base sem `harness-zona.lock.json` e marcador `.harness-template`, criado pelo FDE no terminal. No fim do endurecimento, o manifesto do fork é gerado uma única vez com `montarManifesto` (`verificar-zona.mjs`), o commit é feito e o marcador sai. O ensaio e a demo rodam travados."
    *   **Item 1:** commit base sem o lock, com a tag `base-harness-2.6.0`.
    *   **Item 2 (`ORIGEM.md`):** versão, data e motivo das remoções, sem hashes. A comparação passa a ser `git diff --stat base-harness-2.6.0..HEAD`.
    *   **Item 8 (`doutor`):** sai a checagem de divergência e entra "modo template ou clone".
    *   **Item 35:** "gerar o manifesto uma vez, no fim do endurecimento", no lugar de "depois de cada bloco".

### [R2] [`zoom-out`, `design`, `implementation-readiness`] - Severity: Blocker
*   **Affected Scope:** A9 (l. 105), l. 159, NFR Sigilo (l. 226), itens 16, 25; Verification Plan (l. 586)
*   **Discrepancy Description:** o `check_sensivel.py` pontua 7 por CPF formatado e chega a 40 com qualquer seed de volume. Já um número sem pontuação passa sem ser contado. Além disso, um CPF com DV válido pode ser de uma pessoa real, e o script fica fora do repositório.
*   **Rationale:** do jeito atual, o gate ou barra sempre ou não protege nada.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** a regra de pontuação está no script. Proponho o mecanismo de lista (B2) e não o de "faixa que não colide", porque não existe faixa de CPF garantidamente livre.
*   ***Proposed Edit:***
    *   **A9 e item 25:** o `sn-seed` gera CPF/CNPJ com DV válido a partir de uma semente fixa e grava `app/src/fluent/seed/_documentos.json`, a lista dos documentos gerados. Todo registro de pessoa leva `ficticio = true`.
    *   **Item 16 e l. 159:** o gate confere que todo documento encontrado em `app/src/fluent/seed/` está nessa lista.
    *   **NFR Sigilo e l. 586:** o `check_sensivel.py` (caminho absoluto `/config/workspace/scripts/check_sensivel.py`, fora do repositório, chamado pelo `doutor` e pelos gates) roda só em `inputs/`, `outputs/**/*.md` e no corpo das issues.

### [R3] [`implementation-readiness`, `codebase-details`, `zoom-out`] - Severity: Blocker
*   **Affected Scope:** l. 143, 160; itens 13, 15, 17, 23, 24, 30
*   **Discrepancy Description:** a prévia grava `outputs/spec/data-model.json`, que fica fora do `WHITELIST_EXPLORE`, e o Explore não fecha. Herdar os pré-requisitos da `spec-data-model` também exige `tech-rules-summary.md`, que só existe no Plan.
*   **Rationale:** é um impasse no fluxo central.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** confirmado em `kit.mjs:70-88`. O `keys.ts` com `deleted: true` (SDK ≥ 4.14, `sdlc-guide.md`) dispensa a migração.
*   ***Proposed Edit:***
    *   **Item 15:** incluir `data-model.previa.json` no `WHITELIST_EXPLORE`.
    *   **Item 17:** `exigeNoExplore` explícito. O `sn-data-model --previa` exige só `modelo-de-dados.md`, e o `sn-scaffold` no Explore exige `data-model.previa.json`. No Plan, o scaffold lê `data-model.json`.
    *   **Item 23:** sai o `data-model.diff.json` e a regra de "NEW + migração". No Plan, o modelo final reescreve os `Table()`, e campos removidos viram DELETE pelo `keys.ts`.
    *   **l. 160:** reescrever no mesmo sentido.
    *   **Item 30:** o `--zerar` sempre pede confirmação, sem exceção.

### [R4] [`implementation-readiness`, `codebase-details`, `inventive-catalyst`] - Severity: Blocker
*   **Affected Scope:** CUJ 3 (l. 83); itens 16, 18, 19, 30, 33
*   **Discrepancy Description:** a linha de 7 campos é descartada pelo `lerLinhasSecaoA`, que espera 9 colunas. A linha também não traz story nem ATF. O gate confia num resultado escrito pelo próprio agente.
*   **Rationale:** os gates ficam sem dado.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** confirmado em `kit.mjs:1145`. Encaixar nas 9 colunas evita escrever um parser novo.
*   ***Proposed Edit:***
    *   **Item 18:** o install entra na Seção A com as 9 colunas e Skill = `now-sdk-install` (rótulo, não skill). Saídas = `commit`, `alias`, `escopo`. Decisões = `resultado`, `registros`. Os itens 18 e 19 passam a citar o `kit.mjs` (onde ficam `COLUNAS_SECAO_A` e `ID_PADRAO`).
    *   **Item novo no estágio da demo, recibo de ATF:** `npm run atf -- --story <ID>` roda `now-sdk cicd test run -o json` e grava `outputs/spec/auditorias/atf/<STORY>.json` com `sys_id`, horário, status e commit.
    *   **Item 19:** o `delivery-gate` lê esse recibo. Instância fora do ar faz o gate reprovar com mensagem.
    *   **Item 16:** compara o commit do install com `git log -1 --format=%H -- app/src/fluent`.

### [R5] [`implementation-readiness`] - Severity: Blocker
*   **Affected Scope:** l. 158; itens 24, 26, 27, 34
*   **Discrepancy Description:** nenhuma skill gera o `screens-manifest.json`, porque o produtor era a `spec-prototype`, que foi removida. A URL de form depende de `sys_id`.
*   **Rationale:** a captura e o gate leem um arquivo que ninguém escreve.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** confirmado em `tools/references/screens-manifest.md:3`.
*   ***Proposed Edit:***
    *   **Item 24:** o `sn-scaffold` grava `outputs/spec/screens-manifest.json` depois do build, com uma entrada por `TEL-` (`id`, `route`, `type`, `role`, `screenshot`, `capturedAt`). A rota de list sai do nome da tabela. A rota de form usa o `sys_id` do registro de seed `Now.ID['<TEL>_registro_demo']`, lido de `app/src/fluent/generated/keys.ts`.
    *   **Item 34:** a coluna "URL esperada" vira "registro demo da tela".
    *   **Item novo:** `tools/references/screens-manifest.md` (Modify), com o produtor `sn-scaffold` e os campos novos.

### [R6] [`implementation-readiness`, `codebase-details`, `zoom-out`] - Severity: Blocker
*   **Affected Scope:** A6 (l. 102), Fluxo (l. 145); itens 14, 15, 17, 20, 21, 22
*   **Discrepancy Description:** o Fluxo cita uma `sn-tasks` que nenhum item cria. Os 17 valores no enum espalham mudança por validadores, estimativa e status. O item 21 cobra `table` de tipos sem tabela.
*   **Rationale:** a ambiguidade quebra a lista do `cadeia` e do `kit`.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** o campo opcional mantém os leitores de tipo existentes intactos, o que elimina o item 22.
*   ***Proposed Edit:***
    *   **Fluxo e itens 14/15:** usar `spec-tasks`, alterada no lugar.
    *   **A6:** "Tipo ServiceNow em `Task.snArtifact.kind` (enum próprio de 17 valores: `table`, `form`, `list`, ..., `simulation`), opcional. O enum `Task.type` não muda."
    *   **Item 20:** schema `tasks/v5.4` = campo `snArtifact {kind, table?, fluentFile, nowId}` mais `uiContext.instanceUrl`, com `metadata.schemaVersion` trocado de `v5.3` para `v5.4` e os validadores aceitando os dois.
    *   **Item 21:** exige `kind`, `fluentFile` e `nowId` quando há `snArtifact`; exige `table` só para `table`, `form`, `list`, `business_rule`, `acl`, `client_script`, `ui_policy`, `ui_action` e `seed`.
    *   **Item 22:** sai.

### [R7] [`design`] - Severity: Blocker
*   **Affected Scope:** G3 (l. 39), CUJ 1 (l. 71), CUJ 2 (l. 76), A10 (l. 106), item 26
*   **Discrepancy Description:** o print é tirado como admin, então não mostra a visão do papel (por exemplo, a regra "atendente vê só a própria carteira").
*   **Rationale:** o print do backlog engana justamente na cena do fio condutor.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** o impersonate dispensa senhas novas (Z8-10).
*   ***Proposed Edit:***
    *   **Seed (item 25):** um `sys_user` demo por role, sem senha.
    *   **A10 e item 26:** a `sn-capture` entra como admin e faz impersonate do usuário do papel da `TEL-` (coluna "papel" da tabela de telas) antes de fotografar.
    *   **CUJ 1:** "o print na issue é a tela que o papel da story vê na instância".

### [R8] [`structural`, `design`, `zoom-out`] - Severity: Blocker
*   **Affected Scope:** l. 33; NFRs (l. 224–229)
*   **Discrepancy Description:** falta a seção de riscos com mitigação que o padrão exige.
*   **Rationale:** os riscos do dia da demo estão espalhados ou não aparecem.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** a versão curta do Z8-12 atende o padrão sem inchar o documento.
*   ***Proposed Edit:*** nova H2 "Riscos e mitigações", depois das Alternatives, em tabela Risco | Mitigação | Item:
    *   **PDI reclamada:** reinstall completo na véspera, no roteiro (item 42).
    *   **Trecho ao vivo falha:** plano B offline (item 42).
    *   **Mudança do SDK:** versão fixada (item 6).
    *   **GitHub ou `gh` indisponível:** `spec-tasks-html` offline.
    *   **Falta de tokens ou indisponibilidade da Anthropic:** trilha pronta não depende de execução ao vivo.

    A l. 33 vai para essa tabela.

### [R9] [`zoom-out`, `comprehension`] - Severity: Major
*   **Affected Scope:** Detailed Implementation Plan (estágios); l. 214, 228
*   **Discrepancy Description:** a sequência de estágios não fecha, e o kit é endurecido antes de a demo existir.
*   **Rationale:** atrasa a demo e confunde quem lê.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** a tabela de estágios do M15 resolve as duas coisas ao mesmo tempo.
*   ***Proposed Edit:***
    *   Tabela no início do plano detalhado, com critério de saída de cada estágio:
        *   **Estágio 0, viabilidade:** itens 1–9. Sai com `doutor` verde e o resultado das 4 checagens.
        *   **Estágio 1, caminho da demo:** itens 6, 23–26, 28–30, 37–42. Sai com o fio condutor N3 na instância.
        *   **Estágio 2, endurecimento:** itens 10–22, 27, 31–36. Sai com `npm test` verde e o lock gerado.
        *   **Estágio 3, ensaio:** reinstall do zero mais o CUJ 1.
    *   Ajustar as l. 214 e 228.

### [R10] [`zoom-out`, `design`, `implementation-readiness`] - Severity: Major
*   **Affected Scope:** Q2 (l. 62); itens 6, 9
*   **Discrepancy Description:** o teste de ATF tem dois desfechos e ignora o `cicd test run`. O `sys_report`, o print em repositório privado e o tamanho do nome de tabela não foram testados. O `init` está incompleto e a versão do SDK fica em aberto.
*   **Rationale:** as dúvidas de viabilidade estão espalhadas.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** comandos documentados em `ci-integration.md:216-304`.
*   ***Proposed Edit:***
    *   **Item 9:** "teste de viabilidade" com 4 checagens e desfecho registrado para cada uma:
        1. `now-sdk cicd test run` executa servidor e form. Três desfechos: os dois rodam; só servidor; nenhum.
        2. `Record({table:'sys_report'})` aparece no UI16. Se não aparecer, KPI vira list com group-by.
        3. PNG visível numa issue privada para quem assiste.
        4. O maior nome de tabela previsto cabe em 30 caracteres.
    *   **Item 6:** `now-sdk init` com nome, escopo e `--template` explícitos, SDK fixado em `4.14.x` (≥ 4.14).
    *   **Q2:** reescrita como "confirmar o `cicd test run` na PDI".

### [R11] [`zoom-out`, `inventive-catalyst`, `implementation-readiness`] - Severity: Major
*   **Affected Scope:** Alternativa A, A5 (l. 101), Componentes (l. 114); itens 17, 23–31, 36
*   **Discrepancy Description:** criar espelhos `sn-*` de skills existentes dobra skills e alterações na zona. As remoções não batem entre si: o G3 referencia `frontend.md` e há uma origem inexistente. A `sn-api-contracts` documenta tabelas como se fossem API.
*   **Rationale:** o fork fica maior do que precisa.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** a regra `ehExtensaoDoProjeto` (`zonas.mjs:182-243`) já aceita skills novas.
*   ***Proposed Edit:***
    *   **A5:** "skills realmente novas (`sn-scaffold`, `sn-seed`, `sn-capture`, `sn-tasks-github`, `sn-implement`, `sn-reinstall`) e o `validador-escopo-app` entram como extensões do projeto. Etapas existentes são alteradas no lugar (`spec-data-model`, `spec-tech-rules`, `spec-hld`, `revisao-de-seguranca`, `spec-iterate`, `spec-code-audit`, `spec-debug-fix`, `spec-status-report`)."
    *   **Item 23:** vira Modify de `spec-data-model`.
    *   **Item 31:** vira lista de Modify no lugar.
    *   **Item 17:** a `api-contracts.yaml` deixa de ser exigida.
    *   **Item 36:** inclui as referências ao `frontend.md` no G3 (`validacao/rules.mjs`, `validador-rules-tecnicas`).
    *   Corrigir a origem inexistente apontada no S9 M23.

### [R12] [`zoom-out`, `comprehension`] - Severity: Major
*   **Affected Scope:** G1 (l. 37), A7 (l. 103); itens 18, 33, 38
*   **Discrepancy Description:** a família `RF-F<n>-<nn>` duplica o formato nativo, e `RF-T` fica fora da gramática.
*   **Rationale:** cria família de ID e mudança de gramática sem necessidade.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** `kit.mjs:704` já aceita `RF-MOD-F2-003`.
*   ***Proposed Edit:***
    *   **A7:** `RF-MOD-F<n>-<nnn>` e `RF-MOD-T-<nnn>` (transversais), mais `CT-MOD-F<n>-<nnn>`.
    *   **Item 18:** só `SIM-<nn>` é família nova.
    *   **Item 38:** de-para para esse formato.
    *   No G1, definir "RF transversal: requisito que vale para todas as funcionalidades".

### [R13] [`zoom-out`, `comprehension`, `implementation-readiness`] - Severity: Major
*   **Affected Scope:** l. 163, NFR Custo; itens 19, 29, 32
*   **Discrepancy Description:** "isenção" mistura dispensa de G3 e dispensa de ATF de form. Isenção em `_isencoes/` derruba gates inteiros.
*   **Rationale:** não fica claro o que uma story precisa para fazer push.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** consolida comprehension #11, M8 e S9 M1/M28.
*   ***Proposed Edit:*** tabela no Technical Plan, Validação:

    | Story | G3 com LLM | build + install | ATF servidor | ATF form |
    |---|---|---|---|---|
    | fio-condutor | sim | sim | sim | conforme item 9 |
    | gerada (tabela/form/list/menu/role/seed) | não ("isenção de G3") | sim | sim | conforme item 9 |
    | outra feita à mão | não ("isenção de G3") | sim | sim | conforme item 9 |

    As isenções ficam registradas por story em `auditorias/_isencoes/<STORY>-<tipo>.md`, com o escopo da story, sem isenção de fase.

### [R14] [`zoom-out`, `comprehension`, `implementation-readiness`] - Severity: Major
*   **Affected Scope:** G1, l. 161; item 33; Verification Plan (l. 585)
*   **Discrepancy Description:** a matriz mistura gate estático com dado vivo. Faltam a definição de N1/N2/N3 e de "órfão", e o comando do gate.
*   **Rationale:** sem isso, o gate do G1 não dá para verificar.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** os sys_id já estão no `keys.ts`, e o ATF já está nos recibos do R4.
*   ***Proposed Edit:***
    *   **Item 33:** `traceability.json` com `rf`, `ct[]`, `tel[]`, `story`, `tasks[]`, `nowIds[]` (de `app/src` e do `keys.ts`) e `atf[]` (dos recibos). Nenhuma consulta à instância.
    *   **Níveis:** N1 = tem story. N2 = tem `nowId` instalado. N3 = tem recibo de ATF verde.
    *   **Órfão:** RF sem story.
    *   **Gate:** `node .claude/ferramentas/promocao.mjs --rastreio`, chamado pelo `cadeia.mjs` antes do `sn-tasks-github`.
    *   Sai a consulta de `sysIds` por `now-sdk query`.

### [R15] [`zoom-out`, `inventive-catalyst`, `implementation-readiness`] - Severity: Major
*   **Affected Scope:** A4 (l. 100), l. 162; itens 4, 8, 28, 29; CUJ 2 (l. 77); l. 583
*   **Discrepancy Description:**
    *   Um label por ID gera centenas de labels.
    *   O Project v2 não serve a nenhuma meta.
    *   O print aponta para `main`, que muda.
    *   A API de sub-issue pede o `id` numérico, que o plano não guarda.
    *   As tasks SEC do Deliver não chegam ao GitHub.
*   **Rationale:** o CUJ 1 fica frágil, e o publicador fica incompleto.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** consolida M11, M13, Z8-13/14 e S9 M14/M17.
*   ***Proposed Edit:***
    *   **A4 e item 28:** idempotência pelo `id-map.json` (`logical-id` → `{number, id}`) mais o marcador `<!-- logical-id: X -->` no corpo. Labels só de tipo e `fio-condutor`. Project v2 opcional, fora do `doutor`. Imagem por permalink `blob/<sha>/...?raw=1`. Modo `--change` publica as tasks SEC novas.
    *   **Item 29:** mesmo permalink no comentário de entrega.
    *   **CUJ 2 e l. 583:** idempotência conferida pelo marcador.
    *   **Alternativas:** "atualizar o `gh` para `--attach`" registrada como alternativa não adotada.

### [R16] [`design`, `zoom-out`, `implementation-readiness`] - Severity: Major
*   **Affected Scope:** NFR Segredos (l. 227); itens 3, 4, 7
*   **Discrepancy Description:**
    *   O agente pode ler o `.env`.
    *   Os nomes das variáveis não são os que o SDK lê.
    *   O `.env*` no `.gitignore` também exclui o `.env.example`.
*   **Rationale:** a senha de admin pode acabar no contexto e nos transcripts.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** confirmado em `ci-integration.md:159-165`. O `settings.json` base não tem `deny`.
*   ***Proposed Edit:***
    *   **Item 7:** `permissions.deny` para `Read(./.env.instancia)` e `Bash(cat .env*)`.
    *   **Item 4:** `SN_SDK_INSTANCE_URL`, `SN_SDK_USER` e `SN_SDK_USER_PWD` no lugar de `SN_*`.
    *   **Item 3:** `.env*` mais `!.env.example`.
    *   **NFR Segredos:** só `doutor`, `capture.mjs`, `reinstall.mjs` e `atf` carregam o arquivo.

### [R17] [`design`, `inventive-catalyst`] - Severity: Major
*   **Affected Scope:** A3 (l. 99), Overview, l. 158; itens 6, 23, 24, 30, 34
*   **Discrepancy Description:** com `x_2326104_cobmt_`, sobram 14 caracteres para o nome da tabela, e o literal se espalha pelo kit.
*   **Rationale:** renomear depois do `init` custa caro.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** o limite de 30 caracteres está em `table-guide.md:48,76`.
*   ***Proposed Edit:***
    *   **Escopo do app:** `x_2326104_cob`, o que deixa 16 caracteres para a tabela. Substituir em todo o documento.
    *   **Itens 23, 24 e 30:** "escopo lido de `app/now.config.json`".
    *   O literal fica só em `app/`, `inputs/` e `outputs/`.

### [R18] [`inventive-catalyst`, `zoom-out`] - Severity: Major
*   **Affected Scope:** item 7 (l. 272), item 5, item 30, CUJ 3, item 42
*   **Discrepancy Description:** a confirmação do `install` trava o trecho ao vivo da demo.
*   **Rationale:** a demo ao vivo depende disso.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** é o Z8-8, sem wrapper novo.
*   ***Proposed Edit:***
    *   **Item 7:** liberar sem confirmação só `npm run reinstall` (sem `--zerar`). O script confere o prefixo e a lista de documentos do R2.
    *   **Item 29:** o `sn-implement` instala por esse script.

### [R19] [`implementation-readiness`, `codebase-details`] - Severity: Major
*   **Affected Scope:** itens 13, 15, 16, 17, 19, 32; `harness.json`
*   **Discrepancy Description:** os itens citam constantes e linhas que não batem com o código. O item 17 pede o que o `cadeia.mjs` não expressa. O item 19 não diz como o PreToolUse confere o build. O item 13 tira um documento que o gate exige. O validador novo não está ligado ao roteador. O G3 do app não tem comando. O `harness.json` não tem `geradoDe`.
*   **Rationale:** a implementação ia esbarrar em cada um desses pontos.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** detalhes com evidência em `implementation_readiness_report.md` (M3, M8, M9, M11, M12, M18, M21).
*   ***Proposed Edit:*** aplicar em cada item a correção citada no relatório do estágio 9:
    *   nomes reais das constantes (`FIDELIDADE_DO_EXPLORE` em `kit.mjs`, e não as linhas 548–587);
    *   pré-requisitos expressos como `exige`/`exigeNoExplore`;
    *   o item 19 lê o recibo do R4, sem rodar build no hook;
    *   o item 13 mantém os documentos que o `fecho-explore` exige;
    *   o roteador manda `app/src/**` para o `validador-escopo-app`;
    *   o G3 do app roda por `validar.mjs` com `--alvo app/src`;
    *   o item 2 lê a versão de `harness.json.versao`, sem `geradoDe`.

### [R20] [`implementation-readiness`] - Severity: Major
*   **Affected Scope:** itens 5, 30; Verification Plan
*   **Discrepancy Description:** o app não tem suíte ATF nomeada, e a contagem esperada de registros não tem fonte. O script `test` da raiz não tem comando.
*   **Rationale:** a verificação fica sem critério.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** apontado em S9 M13 e M22.
*   ***Proposed Edit:***
    *   **Item 30:** suíte `TestSuite()` "cob-regressao" em `app/src/fluent/tests/suite.now.ts`, com a contagem esperada lida de `_documentos.json` e de um `seed/_contagem.json` gerado pelo `sn-seed`.
    *   **Item 5:** `"test": "node --test .claude/**/*.test.mjs"`.

### [R21] [`implementation-readiness`] - Severity: Major
*   **Affected Scope:** item 25; l. 160
*   **Discrepancy Description:** o seed lê limites de RN e `testData`, que só existem no Plan. Falta o número do limite do laço do Flow.
*   **Rationale:** a prévia do Explore não tem de onde tirar o seed.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** apontado em S9 M15 e M25.
*   ***Proposed Edit:***
    *   **Item 25:** no Explore, o seed sai do `modelo-de-dados.md` e da tabela de telas (1 registro demo nomeado por `TEL-` + 50 por tabela). No Plan, ele é regerado com os limites das RN e o `testData`.
    *   **Volume:** "até 300 por tabela (laço de Flow limitado a 1.000 iterações, RN-SN-154)".

### [R22] [`zoom-out`, `comprehension`] - Severity: Major
*   **Affected Scope:** Non-Goals (l. 55); Open Questions; itens 9, 31, 42; l. 163; Verification Plan "Ensaio"
*   **Discrepancy Description:** o documento tem contradições internas e referências erradas:
    *   o `validador-escopo-app` está nos Non-Goals, mas é criado no plano;
    *   `sn-estimate` tem dois status diferentes;
    *   o item 9 aponta "item 32" no lugar do item 19;
    *   a Q1 e a Q4 sumiram;
    *   o ensaio "sem intervenção" contradiz o CUJ 4.
*   **Rationale:** a spec se contradiz.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** são erros factuais do próprio documento.
*   ***Proposed Edit:***
    *   **Non-Goals:** tirar o `validador-escopo-app`; "`spec-legacy`, `spec-benchmark` e `spec-estimate` ficam como na base, sem adaptação".
    *   **Item 9:** referência corrigida para o item 19.
    *   **Open Questions:** Q1 "resolvida: repositório único (A3)" e Q4 "resolvida: item 42".
    *   **l. 163:** remete ao item 32.
    *   **Ensaio:** "sem intervenção além da autenticação do CUJ 4".
    *   Alinhar o nome `sn-seed` no arquivo 12.

### [R23] [`comprehension`] - Severity: Major
*   **Affected Scope:** Overview, Goals, todo o documento
*   **Discrepancy Description:**
    *   As fases aparecem com dois vocabulários.
    *   "G3" é ao mesmo tempo meta e ciclo de validação.
    *   Termos e fontes aparecem sem definição.
*   **Rationale:** é uma lacuna de compreensão, que não se contesta.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** quem ler o documento sem o contexto da conversa precisa dessas definições.
*   ***Proposed Edit:***
    *   **Metas:** renomear G1–G6 para M1–M6.
    *   **Overview:** um parágrafo com as fases Explore, Plan e Deliver (o que cada uma produz e o hook que a fecha) e o ciclo G3 (validadores independentes depois dos testes verdes, até 3 rodadas, bloqueiam CRÍTICO/ALTO).
    *   **Nova seção "Referências e glossário":**
        *   caminhos de `referencias/12`, `32` (catálogo RN-SN, 173 regras), `33`, brief, plano 2.6;
        *   termos: zona imutável, lock, gate de autossuficiência, isenção, FDE, SYDLE/Delivery Suite/CodeForge, PDI, Fluent, ATF, ACL, OOTB, siglas RF/CT/RN/TEL/US.

### [R24] [`structural`, `style`, `design`] - Severity: Major
*   **Affected Scope:** The Problem (l. 31, 33); Alternatives (l. 166–220)
*   **Discrepancy Description:** The Problem mistura solução e risco. As alternativas abrem por "Rejeitada pelo autor", sem o trade-off. O enum aparece nos contras da A. Falta a alternativa de atualizar o `gh`.
*   **Rationale:** é o que o padrão de feature spec pede.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** a redação muda e as decisões continuam as mesmas.
*   ***Proposed Edit:***
    *   **The Problem:** a l. 31 vai para o fim do Overview e a l. 33 vai para o R8.
    *   **Alternativas:** cada motivo abre pelo contra que pesou, seguido de "(decisão do autor, 24/11/2026)".
    *   **Alternativa A:** tirar o enum dos contras.
    *   **Alternativa nova:** "Atualizar o `gh` (`--attach`)".

### [R25] [`structural`, `style`] - Severity: Major
*   **Affected Scope:** CUJs (l. 65–89); G6 (l. 47); Alternativa G
*   **Discrepancy Description:** a meta "instância é o protótipo" não tem CUJ, e o G6 não diz se entra no critério de pronto.
*   **Rationale:** a principal novidade do design fica sem jornada.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** segue o Z8-12, com CUJ 5 e sem CUJ 6.
*   ***Proposed Edit:***
    *   **CUJ 5, "FDE fecha o Explore com a instância como protótipo":**
        *   Given: `modelo-de-dados.md` e a tabela de telas prontos.
        *   When: `sn-data-model --previa`, depois `sn-scaffold`, depois `npm run reinstall`, depois `sn-capture`.
        *   Then: o `fecho-explore` libera; se faltar print ou install, bloqueia listando o que falta.
    *   **M6 (ex-G6):** "fora do critério de pronto do v0".

### [R26] [`zoom-out`] - Severity: Nit
*   **Affected Scope:** itens 24, 30, 32
*   **Discrepancy Description:** o plano não reaproveita componentes prontos listados no arquivo 33.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** custa uma linha e reduz trabalho.
*   ***Proposed Edit:***
    *   **Itens 24, 30 e 32:** "partir de `add-table` (sn-app-template), `deploy` (starter) e dos revisores do `servicenow-claude-kit` (MIT); conferir a licença do starter".

### [R27] [`zoom-out`] - Severity: Nit
*   **Affected Scope:** item 6; Verification Plan
*   **Discrepancy Description:** o documento não diz que o `keys.ts` vai para o git nem usa `--frozenKeys`.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** o `keys.ts` vira peça central depois do R3, do R5 e do R14.
*   ***Proposed Edit:***
    *   **Item 6:** "`app/src/fluent/generated/keys.ts` versionado".
    *   **Verification Plan:** `now-sdk build --frozenKeys`.

### [R28] [`design`] - Severity: Nit
*   **Affected Scope:** G3 (l. 39)
*   **Discrepancy Description:** o activity stream vai sair vazio no print.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** faz parte da "cara de ServiceNow" que o autor pediu.
*   ***Proposed Edit:***
    *   **Tabelas de `TEL-` com form:** `journal_input` e `audit` ligados.
    *   **Seed:** 2–3 linhas de journal por registro demo.

### [R29] [`comprehension`] - Severity: Nit
*   **Affected Scope:** CUJ 2, A10, itens 4, 18, 29, 40; Fluxo PLAN
*   **Discrepancy Description:**
    *   A credencial aparece com três nomes.
    *   `sn-install` parece uma skill.
    *   Há duas revisões de segurança sem explicação.
    *   A origem da label `fio-condutor` não está explicada.
*   ***AI Suggestion:*** PROPOSE FIX
*   ***Justification:*** cada correção é uma linha.
*   ***Proposed Edit:***
    *   **Credencial:** sempre `.env.instancia`, com o `.env.example` como modelo.
    *   **`sn-install`:** coberto pelo R4.
    *   **Fluxo PLAN:** "`revisao-de-seguranca` monta o catálogo SEC e `spec-security-review` injeta as tasks SEC nas stories".
    *   **Label `fio-condutor`:** aplicada pelo `sn-tasks-github` às stories cujos RF estão em `inputs/fio-condutor.md` (F2, dossiê F5, ACL de carteira).

### [R30] [`structural`, `style`] - Severity: Nit
*   **Affected Scope:** forma do documento
*   **Discrepancy Description:**
    *   Ordem das Open Questions.
    *   Marcadores de lista misturados.
    *   Títulos em duas línguas.
    *   Réguas inconsistentes.
    *   Raiz dos caminhos.
    *   Coluna de alternativas na tabela de decisões.
*   ***AI Suggestion:*** DECLINE
*   ***Justification:*** é forma, não conteúdo. Fica registrado para uma limpeza final, se o autor quiser.
*   ***Proposed Edit:*** nenhum.

### [R31] [`style`] - Severity: Nit
*   **Affected Scope:** redação geral; nits do estágio 9
*   **Discrepancy Description:** linguagem coloquial, frases longas e "Then" pouco verificável.
*   ***AI Suggestion:*** DECLINE
*   ***Justification:*** o "Then" do CUJ 1 já é corrigido pelo R7, e o resto é estilo.
*   ***Proposed Edit:*** nenhum.

### [S5-N7] [`inventive-catalyst`] - Severity: Nit
*   **Discrepancy Description:** o revisor confirma que não há compromisso falso nas escolhas do autor.
*   ***AI Suggestion:*** DECLINE
*   ***Justification:*** não pede mudança.

### [S7-N3..N6 parcial] [`structural`] - Severity: Nit
*   **Discrepancy Description:** mover as Open Questions para antes do plano detalhado.
*   ***AI Suggestion:*** DECLINE
*   ***Justification:*** está coberto pelo R30.
