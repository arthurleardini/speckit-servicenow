# Stage 9 — Implementation Readiness Test

**Alvo:** `/config/workspace/10-elogroup/deliversuiteServiceNow/docs/designs/speckit-servicenow-v0.md` (linhas 233–591; 1–232 só como contexto)
**Codebase conferido:** `/config/.claude/jobs/2c29c816/tmp/harness-claude/` (caminhos abaixo relativos a essa raiz, salvo indicação), docs do SDK em `/tmp/sdkpkg/package/docs/`, `/config/workspace/scripts/check_sensivel.py`.
**Fora daqui:** achados já registrados em `zoom_out_report.md`, `comprehension_report.md`, `critic_report.md` e `intermediate_zoom_out_report.md`.

## Status dos revisores

| Revisor | Status |
| --- | --- |
| `egm-implementation-readiness` (opus) | completed |
| `egm-codebase-details` (opus) | completed |
| `egm-style` (sonnet) | completed |

## Contagem

| Severidade | Qtde |
| --- | --- |
| 🔴 Blocker | 4 |
| 🟡 Major | 28 |
| 🟢 Nit | 27 |

Siglas de revisor: **IR** = implementation-readiness, **CD** = codebase-details, **ST** = style.

---

## 🔴 Blockers

### B1. A prévia do modelo de dados no Explore é barrada pelo próprio gate do Explore
- **Revisores:** IR, CD
- **Onde:** item 13 passo 6, itens 15, 23, 24 (l. 322–324, 339–345, 400–420)
- **Problema:** o `sn-data-model --previa` e o `sn-scaffold` gravam e leem `outputs/spec/data-model.json` no Explore. Esse arquivo não está no `WHITELIST_EXPLORE`. A gravação passa a valer como entrada no Plan e é negada até o Explore fechar. Só que o Explore só fecha depois de scaffold, install e captura, então o fluxo não termina. Além disso, "mesmos pré-requisitos das spec-*" dá ao `sn-data-model` a exigência de `tech-rules/tech-rules-summary.md`, que só existe depois do `sn-tech-rules`, já no Plan.
- **Evidência:** `.claude/hooks/kit.mjs:70-88` (whitelist), `kit.mjs:612-621` (`detectarFase`), `.claude/hooks/fecho-explore.mjs:124-129, 216-230, 499-554`, `.claude/hooks/cadeia.mjs:88-91, 108-111`.
- **Correção:** fixar um caminho de prévia (por exemplo `outputs/spec/data-model.previa.json`) e incluí-lo no `WHITELIST_EXPLORE` no item 15. Declarar `exigeNoExplore` explícito: `sn-data-model` → `modelo-de-dados.md`, `sn-scaffold` → o arquivo de prévia. Dizer qual arquivo o `sn-scaffold` lê em cada fase.

### B2. A linha de install não entra no `sync-log` e os gates que dependem dela ficam sem dado
- **Revisores:** IR, CD
- **Onde:** itens 18, 19 e 16 (l. 352, 367–375)
- **Problema:** o item 18 define uma linha de 7 campos e não diz em que seção do `sync-log.md` ela vai. A Seção A tem 9 colunas e `lerLinhasSecaoA` descarta em silêncio qualquer linha com outra contagem. A linha também não tem ID de story nem campo de ATF, mas o item 19 lê dela "ATF da US verde". O formato e a gramática de ID (`ID_PADRAO`, `ID_PADRAO_PLAN`) ficam no `kit.mjs`, e não no `sync-log.mjs` nem no `gramatica.mjs`, que o item 18 cita.
- **Evidência:** `.claude/hooks/kit.mjs:662-710, 1145-1155, 1414-1468` (`COLUNAS_SECAO_A`, `montarLinhaSecaoA`, `lerLinhasSecaoA` em 1451), `.claude/hooks/sync-log.mjs:9-12`, `.claude/hooks/gramatica.mjs:172, 189, 234`.
- **Correção:** escolher um dos caminhos. (a) Encaixar o registro nas 9 colunas da Seção A, com Skill=`sn-install` e commit, alias, escopo, resultado e contagem nas colunas Saídas e Decisões. (b) Criar uma seção nova com parser próprio no `kit.mjs` e colunas `data | evento(build|install|atf) | story | commit | alias | escopo | resultado | registros/atf-id`. Nos dois casos, incluir o `kit.mjs` nos itens 18 e 19.

### B3. Ninguém gera o `screens-manifest.json`, e a URL de form não existe na hora da spec
- **Revisor:** IR
- **Onde:** itens 24, 26, 16 e 34 (contexto l. 158)
- **Problema:** pelo contrato, o único produtor do manifest é o `spec-prototype`, que o item 27 apaga. O item 24 (`sn-scaffold`) não lista o manifest entre as saídas, mas o item 26 o lê e o item 16 usa como gate. A rota de form `/<tabela>.do?sys_id=<seed>` depende do sys_id de um registro de seed, que só existe depois do build, em `keys.ts`. Por isso a coluna "URL esperada" do item 34 não pode ser preenchida na fase de spec.
- **Evidência:** `.claude/skills/tools/references/screens-manifest.md:3`.
- **Correção:** passar o manifest para o `sn-scaffold`, gravado depois do build, com os campos `id` (`TEL-`), `route`, `type`, `role`, `screenshot` e `capturedAt`. A rota de form sai de `app/src/fluent/generated/keys.ts`, pelo `$id` de um registro de seed nomeado para cada tela. Incluir o `screens-manifest.md` (produtor e campos novos) na lista de arquivos.

### B4. A skill `sn-tasks` não tem item
- **Revisor:** IR
- **Onde:** Flow (l. 145) e itens 14, 15, 17, 20–21
- **Problema:** o Flow cita "`sn-tasks` (tasks.json v5.4)". Os itens 20–21 alteram o `spec-tasks` no lugar, e nenhum item entre 23 e 31 cria o `sn-tasks`. Fica sem resposta se o Plan roda o `spec-tasks` ou uma skill nova, e as listas do `cadeia` e do `kit` nos itens 15 e 17 dependem disso.
- **Correção:** ou trocar para `spec-tasks` no Flow e nos itens 14 e 15, ou criar um item "Create, copiando `spec-tasks`" com a lista das mudanças.

---

## 🟡 Major

### M1. Isenção de G3/ATF em `_isencoes/` derruba os gates inteiros
- **Revisores:** IR, CD · **Onde:** itens 19 e 29 (l. 375, 462; contexto l. 163)
- **Problema:** qualquer arquivo em `outputs/spec/auditorias/_isencoes/` com bloco `gate:isencao` isenta o branch inteiro no `delivery-gate`. Com repositorio, autor, data e motivo preenchidos, ele também libera o `fecho-explore`. O plano não dá o formato, então uma isenção por story ou desliga os dois gates ou é ignorada.
- **Evidência:** `.claude/templates/isencao.md:1-27`, `.claude/hooks/delivery-gate.mjs:239-249, 331-342`, `fecho-explore.mjs:293-302, 491-497`.
- **Correção:** usar pasta e bloco próprios, por exemplo `auditorias/_isencoes-atf/<STORY>.md` com `gate:isencao-atf {story, tipo: g3|atf-form, motivo, autor, data}`. Definir a regra de leitura no `delivery-gate` e proibir `gate:isencao` nessa pasta.

### M2. As remoções de skill não batem entre si e quebram testes fora do item 36
- **Revisores:** IR, CD, ST · **Onde:** itens 24, 27, 28 e 36 (l. 409, 436–439, 489, 523–526, 581)
- **Problema:** o item 24 dá o `spec-scaffold` como removido, mas ele não está na lista de remoções do item 27, e a l. 489 diz que as `spec-*` ficam intactas. Apagar `spec-prototype`, `spec-convert-prototype`, `spec-tasks-azure` e `spec-scaffold` quebra arquivos que o item 36 não lista, e o "npm test passando a cada commit" deixa de valer. O item 28 copia `lib/load-tasks.mjs` do `spec-tasks-azure`, mas o plano não diz que essa cópia vem antes da remoção do item 27.
- **Evidência:**
  - Testes:
    - `.claude/ferramentas/preservacao.test.mjs:27-108`
    - `.claude/ferramentas/relatorio-fases.test.mjs:26-50`
    - `.claude/hooks/tasks-azure-dry-run.test.mjs:21`
    - `.claude/hooks/onda5-decisoes.test.mjs:115-128`
    - `.claude/hooks/skills-correcoes.test.mjs:86-206`
    - `.claude/hooks/modulo-placeholder.test.mjs:29`
  - Outros arquivos:
    - `.claude/skills/spec-status-report/lib/load-dotenv.mjs:21`
    - `.claude/skills/spec/SKILL.md`
    - `.claude/skills/spec-tasks-html/lib/render-html.mjs:1325`
    - `.claude/skills/tools/check-outputs.py`
    - `.claude/skills/tools/references/paths.md`
- **Correção:** decidir o destino do `spec-scaffold` e, se ele for removido, pô-lo no item 27 e no `ORIGEM.md`. Trocar a l. 489 por "as `spec-*` sem espelho `sn-*` ficam intactas". Pôr os arquivos acima no item 36, com a ação de cada um. Registrar que o item 28 roda antes do item 27.

### M3. Os itens 15 e 16 miram constantes e linhas que não correspondem ao código
- **Revisores:** IR, CD, ST · **Onde:** itens 15 e 16 (l. 343–350)
- **Problema:**
  - O `kit.mjs` não tem lista de skills por fase. Ela está no `sync-log.mjs` (`SKILLS_DO_KIT`, `SKILLS_NOSSAS`), no `fecho-explore.mjs` (`SKILLS_DO_PLAN`) e no `cadeia.mjs`.
  - O `FIDELIDADE_DO_EXPLORE` é a string `'alta'`. O plano não diz no que se transforma a "exigência 'instância'".
  - As l. 548–587 de `fecho-explore.mjs` só montam mensagens. A checagem fica em 943–945, a constante em `kit.mjs:94` (`ARTEFATOS_PROTOTIPO`), e essa constante também é usada por `.claude/ferramentas/wiki.mjs:17,39`, que nenhum item cita.
  - A l. 350 diz "linhas 548–587 da base" sem dizer de qual arquivo.
- **Evidência:** `kit.mjs:90-147`, `sync-log.mjs:42-70`, `fecho-explore.mjs:38-50, 943-945`.
- **Correção:** reescrever o item 15 como edições pontuais de constante: remover ou substituir `ARTEFATOS_PROTOTIPO`, `PROTOTIPO_MD`, `FIDELIDADE_DO_EXPLORE`, `lerFidelidade` e `nivelDeFidelidade` e os imports correspondentes, e apontar o arquivo de cada lista de skills. No item 16, citar `fecho-explore.mjs:943-945` e incluir o `wiki.mjs`.

### M4. O `check_sensivel.py` aprova pasta sem varrer e fica fora do repositório
- **Revisores:** IR, CD · **Onde:** NFR l. 226; itens 16 (l. 353), 25 (l. 429) e 37; Verificação l. 586
- **Problema:** quando o argumento é uma pasta, o script imprime "pulado (não existe)" e sai com 0, então "score < 40 em `app/src/fluent/seed/`" sempre passa. O script fica em `/config/workspace/scripts/`, fora do fork. Um hook Node que chama python3 não tem checagem no `doutor` e estoura o orçamento de 50 ms do hook. O corpo de issue só é varrido com `--stdin`.
- **Evidência:** `/config/workspace/scripts/check_sensivel.py:6-13, 103-106, 112-119`, `fecho-explore.mjs:138`.
- **Correção:** copiar o script para `.claude/ferramentas/check_sensivel.py`. Expandir os globs em lista de arquivos (`app/src/fluent/seed/**/*.now.ts`, `outputs/**/*.md`) e falhar se a lista vier vazia. Rodar o script no `sn-seed` ou no `sn-reinstall` e fazer o gate ler o resultado gravado. O publicador passa cada corpo de issue por `--stdin`, e o `doutor` checa se o python3 existe.

### M5. O item 22 aponta o mecanismo errado de tipo e camada
- **Revisores:** IR, CD · **Onde:** item 22 (l. 395–398)
- **Problema:**
  - O `forecast.mjs` busca `cal.ia.speed[t.type]` com as chaves backend, test, frontend, integration e infra. Diante de um tipo desconhecido, ele só emite aviso (`tiposSemVelocidade`).
  - `data`, `ui` e `service` são valores de `Task.layer`, um campo à parte.
  - O mapeamento de tipo para camada fica em `inferirCamada`, no `order-backlog.mjs`.
  - `detect-phase.mjs` e `collect-code.mjs` não leem `Task.type`. Eles varrem as raízes `src`, `apps` e outras, e `app/` não está entre elas.
  - Ficaram de fora estes leitores de tipo: `spec-estimate-report/lib/aggregate.mjs:43,50` e `spec-security-review/scripts/inject-sec.mjs:87`.
- **Evidência:** `.claude/skills/spec-estimate/forecast.mjs:64, 389-403`, `.claude/skills/spec-tasks/templates/tasks.schema-atual.json:1101-1104`, `.claude/skills/spec-tasks/scripts/order-backlog.mjs:51-67`, `detect-phase.mjs:159`, `collect-code.mjs:512`.
- **Correção:** trocar a lista do item 22 por:
  - `inferirCamada` com os tipos `sn_*`;
  - entradas de `speed`, ou um mapa de alias, para cada `sn_*` no `forecast.mjs`;
  - `app` nas raízes de `detect-phase.mjs:159` e `collect-code.mjs:512`;
  - os leitores `aggregate.mjs` e `inject-sec.mjs`.

### M6. A troca de versão para v5.4 não está especificada e um campo sai duplicado
- **Revisores:** IR, CD · **Onde:** item 20 (l. 377–388)
- **Problema:** `metadata.schemaVersion` é um enum só com `tasks/v5.3`, que o `enrich-tasks` grava por padrão, e 21 arquivos citam essa versão. O plano não diz se a v5.3 continua válida nem quais fixtures mudam. O `UiContext` já tem `rota` (obrigatório), então `uiContext.instanceUrl` repete o mesmo dado.
- **Evidência:** `tasks.schema-atual.json:3, 21-24, 2133-2149`, `.claude/skills/spec-tasks/scripts/lib/business-enrichment.mjs:1254`.
- **Correção:** enum `["tasks/v5.3","tasks/v5.4"]`, atualizar o padrão em `business-enrichment.mjs`, listar os exemplos e fixtures a atualizar e usar `rota` no lugar de `instanceUrl`.

### M7. O item 21 mira uma checagem que não existe e deixa passar a que vai falhar
- **Revisor:** CD · **Onde:** item 21 (l. 390–393)
- **Problema:**
  - Não há exigência geral de `apiContracts` para dispensar. O validador só cobra o campo quando a task cita uma rota.
  - O problema real são as tabelas `x_2326104_cobmt_*`: o `_` no nome faz contarem como tabela citada, e isso torna `persistenceModel` obrigatório.
  - Cada coluna precisa casar com `SQL_TYPE_PATTERN`, que aceita só palavras-chave SQL em maiúsculas. `string`, `reference` e `glide_date_time` nunca casam, então toda task `sn_*` falha em `TASK_HAS_COMPLETE_DATA_MODEL`.
  - Os tipos `sn_*` também não estão em `CODE_BEARING_TASK_TYPES` nem em `UI_TASK_TYPES`.
- **Evidência:** `.claude/skills/spec-tasks/scripts/validate-tasks-selfsufficiency.mjs:281-282, 299, 318-337, 542-547, 712-756, 862-880`.
- **Correção:** aceitar os tipos de coluna do ServiceNow, ou isentar da checagem de tipo SQL as tasks que têm `snArtifact`. Pôr `sn_form` e `sn_list` em `UI_TASK_TYPES` e os `sn_*` que produzem código em `CODE_BEARING_TASK_TYPES`.

### M8. O `cadeia.mjs` não consegue expressar os pré-requisitos do item 17
- **Revisores:** CD, IR · **Onde:** item 17 (l. 357–365)
- **Problema:** `avaliarSkill` só checa se o arquivo existe. "Install registrado", "tasks.json válido" e "issue number no `id-map.json`" são checagens de conteúdo. O plano também não dá o caminho do `id-map.json`.
- **Evidência:** `.claude/hooks/cadeia.mjs:57-116, 149-195`.
- **Correção:** limitar o item 17 a existência de arquivo, com caminhos exatos relativos a `outputs/spec`. Se a checagem de conteúdo ficar, dar a assinatura da função nova, o arquivo que ela lê e a mensagem de negação.

### M9. O item 19 não diz como um hook PreToolUse confere o build
- **Revisores:** CD, IR · **Onde:** item 19 (l. 372–375)
- **Problema:** o `delivery-gate` só verifica e não grava nada. O plano não diz se o gate roda `now-sdk build`, que grava `dist/` e `keys.ts` e estoura o tempo do hook, ou se lê um resultado já registrado.
- **Evidência:** `.claude/hooks/delivery-gate.mjs:1-2, 546-549`, `fecho-explore.mjs:138`.
- **Correção:** o gate lê um resultado de build gravado e amarrado ao SHA do commit (pode ser a linha de B2). Nomear o arquivo e o formato, e registrar que o hook nunca roda `now-sdk`.

### M10. O gate de rastreio não tem comando, hook nem tela
- **Revisores:** IR, CD, ST · **Onde:** itens 33 e 42; l. 504–511, 573–576, 585
- **Problema:** o `promocao.mjs` nunca bloqueia, sempre sai com 0 e só aceita `--json` e `--congelar` (há teste fixando o exit code). Não existe `--rastreio`. Nenhum hook aplica a regra "Gate do Plan: zero órfãos". O `spec-tasks-html` renderiza o campo `traceability` do `tasks.json` e não lê `traceability.json`. O caminho `report/tasks.html` foge do padrão `outputs/…`, e "duas partes" ignora o plano B.
- **Evidência:** `.claude/ferramentas/promocao.mjs:7-16, 1449-1470`, `.claude/skills/spec-tasks-html/lib/render-html.mjs:1324-1346`, `.claude/skills/spec-tasks-html/cli.mjs:10`.
- **Correção:** definir `promocao.mjs --rastreio [--json]` com caminho de saída e exit 2 quando houver órfão, e nomear o hook que o chama antes do `sn-tasks-github`. Criar um item para a mudança no `spec-tasks-html` ou tirar "aberta no spec-tasks-html" do item 42. Usar o caminho completo `outputs/spec/report/tasks.html`.

### M11. O validador novo não está ligado e o roteador não reconhece código ServiceNow
- **Revisores:** IR, CD · **Onde:** item 32 (l. 491–502)
- **Problema:** o `DIMENSOES` é um array fixo, e o agente é resolvido como `validador-${dimensao}`. O roteador decide por classe de arquivo, não por caminho. `OBSERVABILIDADE_CODIGO` não casa com `gs.error`, `gs.warn` e `gs.info`, e `PERFORMANCE_*` não casa com `GlideRecord` e `GlideAggregate`, então esses validadores ficam dispensados em `.now.ts` e `src/server`. O `validacao.test.mjs` exige `maxTurns ≤ 4` para cada dimensão.
- **Evidência:** `.claude/ferramentas/validacao/roteador.mjs:8, 42-44, 50-78`, `validar.mjs:509`, `validacao.test.mjs:469, 655-661`.
- **Correção:** pôr `escopo-app` em `DIMENSOES`, com regra própria para arquivos em `app/src/`. Acrescentar estes padrões às regex: `GlideRecord|GlideAggregate|\.query\(|\.next\(` e `gs\.(info|warn|error|debug)`. Listar `validar.mjs` e `validacao.test.mjs` (Modify).

### M12. O G3 do código da app não tem linha de comando
- **Revisor:** IR · **Onde:** item 29
- **Problema:** o `validar.mjs` não roda sem `--cmd-*`. O `npm test` da raiz (item 5) roda a suíte do harness, não a da app.
- **Evidência:** `.claude/ferramentas/validacao/validar.mjs:809`.
- **Correção:** escrever no SKILL do `sn-implement` a chamada `--repo app --cmd-build "npx now-sdk build" --cmd-testes "<comando ATF do item 9>"`.

### M13. A app não tem suíte de teste e a contagem esperada não tem fonte
- **Revisor:** IR · **Onde:** itens 29 e 30, passos 3–4
- **Problema:** o item 29 só grava registros `Test()`. Nenhum item cria a `TestSuite()`, que o SDK trata como artefato separado. O plano também não diz de onde sai a "contagem esperada" por tabela.
- **Evidência:** `/tmp/sdkpkg/package/docs/api/testsuite-api.md:6`.
- **Correção:** o `sn-scaffold` cria `app/src/fluent/tests/suite.now.ts`, e o `sn-implement` acrescenta nela o `Test()` de cada story. O `gerar-seed.mjs` grava `app/src/fluent/seed/_contagem.json`, e o `reinstall.mjs` compara com esse arquivo.

### M14. A vinculação de sub-issue precisa de um ID que o plano não guarda
- **Revisor:** IR · **Onde:** item 28 (l. 451)
- **Problema:** `POST /repos/{o}/{r}/issues/{n}/sub_issues` recebe `sub_issue_id`, que é o ID interno da API REST, e não o número da issue. O `id-map.json` só guarda o número. O plano não diz qual nível pendura em qual (épico, feature, story). As labels precisam existir antes de `gh issue create --label`.
- **Correção:** guardar `{number, id}` no `id-map.json`. Fixar a hierarquia: feature é sub-issue do épico e story é sub-issue da feature. Rodar `gh label create --force` antes de publicar.

### M15. As entradas do seed não existem no Explore
- **Revisor:** IR · **Onde:** itens 13, 24 e 25
- **Problema:** o `sn-scaffold` chama o `sn-seed` no Explore. O `sn-seed` lê `business-rules.md` e `acceptanceScenarios[].testData`, que só existem no Plan. No Explore não há CT nem CA, e as RN ficam em `especificacao-funcional` §3. O item 13 remove essa tabela de mapeamento.
- **Evidência:** `.claude/rules/harness/explore.md:115-129`.
- **Correção:** no modo prévia, o seed lê `especificacao-funcional.md` §3 (`RN-nnn`) e `modelo-de-dados.md`. O Plan roda o `sn-seed` de novo com `business-rules.md` e `testData`.

### M16. O `now-sdk init` está incompleto
- **Revisores:** IR, CD · **Onde:** item 6 (l. 264–267)
- **Problema:** o `init` escreve no diretório corrente. O template `base` cria só `package.json` e `now.config.json`, o que contradiz "gera src/fluent/ e src/server/". Faltam `--appName`, `--packageName` e `--template`.
- **Evidência:** `/tmp/sdkpkg/package/docs/guides/developing-apps-guide.md:28-52, 74`, `/tmp/sdkpkg/package/docs/guides/sdlc-guide.md:739-742`.
- **Correção:** dar o comando completo: `cd app && npx @servicenow/sdk init --appName "Cobrança MT" --packageName cobmt --scopeName x_2326104_cobmt --template <t>`. Listar o que o template cria e o que é criado à mão.

### M17. As tasks de segurança achadas no Deliver não chegam ao GitHub
- **Revisor:** IR · **Onde:** não há item
- **Problema:** a `auditoria-de-us` manda as tasks `SEC-NNN` para o ADO e pula o envio quando não há ADO. Sem ele, as tasks de segurança do Deliver nunca viram issue, e o G4 quebra.
- **Evidência:** `.claude/references/seguranca/rastreio-sec.md:31-38, 42-43`.
- **Correção:** pôr o `rastreio-sec.md` na lista de arquivos e publicar as tasks `SEC-NNN` por `sn-tasks-github --change`.

### M18. O item 13 tira um documento que o gate do Explore exige
- **Revisor:** CD · **Onde:** item 13 (l. 317–330)
- **Problema:** a nova ordem do Explore tira o `especificacao-tecnica.md`, que está como `obrigatorio: true` em `DOCS_EXPLORE`, e o `fecho-explore` nega sem ele. A ordem também deixa de fora `spec-frame` e `spec-legacy` sem dizer o destino deles.
- **Evidência:** `.claude/hooks/kit.mjs:27-33`, `.claude/rules/harness/explore.md:66-74`.
- **Correção:** manter o `especificacao-tecnica.md` no passo 5, ou torná-lo opcional em `DOCS_EXPLORE` no item 15. Dizer o destino de `spec-frame` e `spec-legacy`.

### M19. Apagar o `frontend.md` deixa a validação G3 apontando para ele
- **Revisor:** CD · **Onde:** item 11 (l. 304–307)
- **Problema:** `validacao/rules.mjs` fixa `RULE_FRONTEND` e `SECOES_DE_FRONTEND`. Os arquivos `.now.ts` caem em `ehDeFrontend`, então o `validador-rules-tecnicas` recebe bloco vazio. O `servicenow-ui.md` em `rules/harness/` não conta como regra de projeto e nunca chega aos validadores. O `varredura.mjs:399-410` mantém checagens só de Next.js, e `gerar-cursor.mjs` e `gerar-kiro.mjs` também citam o arquivo.
- **Evidência:** `.claude/ferramentas/validacao/rules.mjs:14, 29, 33, 73-77, 93-94`.
- **Correção:** pôr `rules.mjs`, `varredura.mjs`, `gerar-cursor.mjs` e `gerar-kiro.mjs` (Modify) no item 11 ou 32, com `RULE_FRONTEND` apontando para `servicenow-ui.md` e regex de seção novas.

### M20. O `.env*` no `.gitignore` esconde o `.env.example`
- **Revisores:** CD, ST · **Onde:** item 3 (l. 252, 257)
- **Problema:** o `.gitignore` da base já tem `.env`, `.env.*` e `!.env.example`. Acrescentar `.env*` depois volta a ignorar o `.env.example` do item 4.
- **Evidência:** `.gitignore:1-4, 14`.
- **Correção:** não acrescentar `.env*`. Acrescentar só `app/target/` e `outputs/spec/_tmp/`.

### M21. O `harness.json` não tem o campo `geradoDe`
- **Revisor:** CD · **Onde:** item 2 (l. 247)
- **Problema:** o arquivo só tem `nome`, `versao`, `kitVersao`, `runtime` e as listas de zona. O `geradoDe` só existe na saída dos geradores Cursor e Kiro.
- **Evidência:** `harness.json:1-27`, `.claude/ferramentas/gerar-cursor.mjs:545`.
- **Correção:** usar `versao` mais o SHA do commit de base.

### M22. O script `test` da raiz não tem comando
- **Revisores:** CD, IR · **Onde:** item 5 (l. 262), l. 526 e 581
- **Problema:** a base não tem `package.json` na raiz. A suíte completa junta os testes do harness com a pasta `tests/` de cada skill.
- **Evidência:** `MANUTENCAO.md:979-980`, `.claude/hooks/gerar-cursor.test.mjs:303`.
- **Correção:** escrever o comando literal, por exemplo `node --test .claude/hooks/ .claude/ferramentas/ .claude/skills/*/tests/`.

### M23. A origem de uma das cópias não existe
- **Revisores:** CD, IR · **Onde:** item 31 (l. 476), Flow l. 142
- **Problema:** não há `spec-revisao-de-seguranca`. A skill se chama `revisao-de-seguranca`.
- **Evidência:** `.claude/skills/revisao-de-seguranca/SKILL.md`.
- **Correção:** dar `.claude/skills/revisao-de-seguranca/` como origem da cópia.

### M24. O item 21 cobra `snArtifact.table` de tipos que não têm tabela
- **Revisor:** ST · **Onde:** item 21 (l. 393), item 20 (l. 382, 386)
- **Problema:** `sn_role`, `sn_menu`, `sn_flow`, `sn_notification` e `sn_atf` não têm tabela única. O `fluentFile` não é exigido em lugar nenhum.
- **Correção:** fazer uma tabela "tipo → campos obrigatórios de `snArtifact`", ou usar a regra "`table` quando aplicável".

### M25. Falta o número do "limite de laço do Flow"
- **Revisor:** ST · **Onde:** l. 427
- **Problema:** sem o valor, não dá para verificar o critério.
- **Correção:** citar o valor e a fonte no guia do SDK, ou trocar por "no máximo N registros por tabela".

### M26. A versão do SDK fica em aberto
- **Revisor:** ST · **Onde:** l. 267, e o `doutor` na l. 279
- **Problema:** "na que estiver instalada no dia (4.14.x)" não fixa versão, e o `doutor` compara com ela.
- **Correção:** fixar `@servicenow/sdk` em `4.14.<patch>`, lida de `now-sdk --version` e registrada no `ORIGEM.md`.

### M27. O ensaio "sem intervenção" contradiz o CUJ 4
- **Revisor:** ST · **Onde:** l. 587 (CUJ 4 na l. 88)
- **Problema:** o CUJ 4 pede que o FDE autentique o `now-sdk` na instância nova.
- **Correção:** "sem intervenção além da autenticação do `now-sdk`".

### M28. O critério "verde, ou só com as isenções registradas" é ambíguo
- **Revisor:** ST · **Onde:** l. 584
- **Correção:** "verde, exceto as stories com isenção registrada em `<pasta de M1>`".

---

## 🟢 Nits

1. **Item 26, captura** (IR, CD, ST). Faltam:
   - de onde sai o mapa TEL↔story do `--story` (sugestão: `Story.uiContext`);
   - a condição de espera da carga (sugestão: seletor `#sys_readonly` ou `.list2_body`);
   - o que acontece acima de 5 MB.

   O teto de 5 MB passa do limite de 1.5 MB do `spec-tasks-html`, e o plano B do item 42 perderia as imagens (`render-html.mjs:388, 2237-2240`). Correção: teto de 1.5 MB.
2. **Itens 24 e 29** (IR). Faltam o padrão de `$id` das linhas de seed (50 a 300 por tabela), do qual depende a idempotência do item 30, e a tabela tipo → pasta de `app/src/fluent/<tipo>/`.
3. **Itens 7 e 29** (IR, CD). Faltam as strings exatas de `permissions.allow`. A referência usa `Bash(npx @servicenow/sdk explain *)` e a ordem `--list` → `--peek` → tópico completo, e o item 29 só usa `--peek` (`referencias/33-servicenow-ia-rules-wiki.md:28, 73-74`).
4. **Itens 6 e 8, `doutor`** (IR, CD).
   - Prefixo: reaproveitar `now-sdk query sys_properties -q 'name=glide.appcreator.company.code'` (`developing-apps-guide.md:31`).
   - O `doutor` já tem as checagens "Node ≥18" e PAT do Azure DevOps, sempre sai com 0 e lê variável de ambiente, não `.env.instancia` (`doutor.mjs:32-40, 78-82`). Dizer o que fica e o que sai.
5. **Item 9** (IR). Os docs do SDK não mostram comando de desinstalação. Dizer como a app de teste é removida e em qual escopo ela roda.
6. **Itens 41 e 37** (IR). O `spec-product` só lê `inputs/` (`spec-product/SKILL.md:144`). Dizer em que passo ele lê `premissas-ficticias.md` e o que acontece se o score der 40 ou mais.
7. **Item 23, reuso** (CD). O `data-model.schema.json` já tem `operationType`, com NEW, ALTER e EXISTING_REF nas entidades e ALTER_ADD, ALTER_MODIFY e ALTER_DROP nas colunas (`spec-data-model/templates/data-model.schema.json:55, 89`). O `data-model.diff.json` duplica isso.
8. **Itens 26 e 28, reuso** (CD).
   - Aproveitar `spec-tasks-azure/lib/load-dotenv.mjs`.
   - O `lib/publish-plan.mjs` já existe e deve aparecer como cópia, não como Create.
   - O `id-map.json` do Azure só é lido, nunca gravado (`azure-upsert.mjs:8, 39-57`), então "mesmo contrato" não é exato.
9. **L. 565** (ST). "Dossiê em 3 níveis" colide com os níveis N1, N2 e N3 do rastreio. Correção: "3 seções".
10. **L. 546 e 564** (ST). Expandir SNE no primeiro uso.
11. **L. 161 e 420** (ST). O exemplo do token `Now.ID` usa `br`, e o tipo se chama `sn_business_rule`. Correção: tabela `sn_*` → token.
12. **Proposed Changes** (ST). Os itens misturam infinitivo, indicativo e frase nominal. Correção: infinitivo em todos.
13. **L. 285 e 312** (ST). "Itens" serve para os itens do plano e para as checagens. Correção: "checagens" no segundo sentido.
14. **L. 352, 434 e 451** (ST). Print, PNG e screenshot nomeiam a mesma coisa. Correção: "print" no texto e `screenshot` só como campo.
15. **L. 364 e 546** (ST). "Issue number", "choices" e "labels" estão em inglês no meio do texto em português.
16. **L. 235** (ST). Não está claro se a pasta-mãe `deliversuiteServiceNow/` vai junto. Correção: "extraído com o conteúdo da pasta-mãe na raiz do repositório".
17. **L. 288** (ST). O item 9 não tem rótulo de ação. Correção: "(Create e Delete, temporário)".
18. **L. 474** (ST). `--reinstall` (do `now-sdk`) e `--zerar` (do script) se confundem. Deixar claro de quem é cada flag.
19. **L. 485** (ST). As "7 dimensões" não são listadas, e "[AUTO]" não é definido.
20. **L. 489** (ST). `sn-benchmark` aparece como inexistente e não está nos Non-Goals (l. 55).
21. **L. 495–499** (ST). Os nomes dos validadores não têm o prefixo `validador-`.
22. **L. 516** (ST). "§1.2" contrasta com "seção 2.12" (l. 501). Correção: um formato só.
23. **L. 533** (ST). Correção: "depois de rodar o `check_sensivel.py` sem bloqueio".
24. **L. 538** (ST). "Saltos de numeração" não é definido. Correção: "IDs do plano sem correspondente".
25. **L. 544** (ST). "Uma fração dos contribuintes" não tem número. Correção: dar o percentual, como os 10% do item 41.
26. **L. 398** (ST). As camadas `data`, `ui` e `service` não são definidas aqui. Correção: remeter ao `Task.layer` do schema (ver M5).
27. **L. 327** (ST). `gaps.md` aparece sem introdução, e o texto alterna entre "GAP" e "gaps". Correção: dizer a fase em que o arquivo nasce e usar um nome só.
