# Auditoria de Entrega — [US-MOD-F5-003] Dossiê consolidado do caso

- **User Story:** US-MOD-F5-003 — Dossiê consolidado do caso (nó `STORY-MOD-F5-003` no `outputs/spec/tasks.json`, label `fio-condutor`)
- **Features/IDs cobertos:** RF-MOD-F5-003 · TEL-024 · RN-NOVO-F5-003 · RN-NOVO-F5-004 · RN-NOVO-F1-001 · RN-NOVO-F5-007 · AC-RF-MOD-F5-003-01..03 · TASK-MOD-F5-003-01..02
- **Branch/commit auditado:** `feat/v0` @ `9c57189` (delta `bc26301..9c57189`, pasta `app/`)
- **Data:** 2026-11-24
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> Dado usado neste relatório: só o seed fictício do app (nomes de contribuinte terminados em «Fictícia», usuários `demo.*`). Nenhum CPF ou CNPJ é citado.

---

## 1. Inventário do delta

A US acrescenta o dossiê do caso: uma view própria do form do caso, quatro listas relacionadas que saem do contribuinte do caso, uma regra que abre o form sempre nessa view, uma UI Policy que deixa a sinalização somente leitura e um Script Include que conta os itens de cada nível. São 2 commits de código (`2239a96`, `9c57189`).

**Arquivos/módulos tocados pela US:**

| Arquivo | Papel |
|---|---|
| `app/src/server/atendimento/CasoDossie.server.js` (novo, 80 linhas) | Script Include `CasoDossie`: `montar(casoId)` devolve a contagem dos 3 níveis do dossiê (ou a recusa); `filtrarPorContribuinte()` filtra as listas relacionadas pelo contribuinte do caso |
| `app/src/fluent/script-includes/caso-montar-dossie.now.ts` (novo) | Registro Fluent do Script Include (`package_private`, não chamável pelo navegador) |
| `app/src/fluent/ui/caso-dossie-niveis.now.ts` (novo, 140 linhas) | View «Dossiê do caso», form com as seções Caso, Score, Sinalizações, Encerramento e Atividades, 4 relacionamentos (`sys_relationship`), 5 listas relacionadas, View Rule e UI Policy de somente leitura |
| `app/src/fluent/tests/US-MOD-F5-003.now.ts` (novo, 206 linhas) | 3 testes ATF (Automated Test Framework, o teste automático da plataforma): servidor positivo, servidor negativo e form positivo |
| `app/src/fluent/tests/suite.now.ts` | Inclui os 3 testes na suíte `cob-regressao` |
| `app/src/fluent/generated/keys.ts` | Chaves geradas pelo build (+1.410 linhas); nenhuma chave antiga removida — as 2 linhas que aparecem como removidas no diff continuam no arquivo; 41 marcas `deleted: true` antes e depois |

**Endpoints alterados/criados:** nenhuma rota REST nem GlideAjax. Superfície nova para o usuário: o form do caso (`x_2326104_cob_caso.do`), agora sempre na view `x_2326104_cob_dossie`, e as 5 listas relacionadas dele.
**Entidades/modelos tocados:** leitura de `x_2326104_cob_caso`, `_debito`, `_parcelamento`, `_comunicacao`, `_interacao`, `_regularizacao`; metadados de interface (`sys_ui_view`, `sys_relationship`, `sys_ui_related_list(_entry)`, `sysrule_view`, `sys_ui_policy`). Nenhuma tabela nem coluna nova.
**Stack envolvido no delta:** ServiceNow Fluent (`@servicenow/sdk` 4.14.3), Core UI clássica, Script Include ES5 (`Class.create`), `GlideRecordSecure` e `GlideAggregate`, ATF com Jasmine 3.1.

**Varredura determinística do delta** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo bc26301 --repo app`): 7 arquivos mudados, 0 achados (segredo, dado pessoal em log, HTML cru, injeção, erro engolido e consulta em laço). Semgrep e gitleaks não estão instalados.

## 2. Mapa de regressão leve

Pontos já auditados em stories anteriores que o dossiê usa ou encosta:

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| Regra de consulta da carteira (`app/src/fluent/business-rules/carteira.now.ts`, `app/src/server/carteira/restringirConsultaCarteira.server.js`) — restringe toda consulta de quem só tem o papel de atendente à própria carteira | As 5 listas do dossiê e as contagens do `CasoDossie.montar()` dependem dela para não trazer nem contar linha de outro atendente | alto |
| ACL de carteira (`app/src/fluent/security/carteira.now.ts`) — nega a linha que não é do atendente | O `montar()` lê o caso por `GlideRecordSecure`; as listas passam pela ACL de linha | alto |
| Form padrão do caso (`app/src/fluent/ui/TEL-024.now.ts`, gerado) | A View Rule nova abre o form sempre na view do dossiê, por cima da preferência do usuário | médio |
| Lista «Minha fila» (`app/src/fluent/ui/TEL-023.now.ts`, gerada) — mostra a coluna `sinal_coercitivo` | A UI Policy nova só vale no form; a lista continua editável | médio |
| Seed do caso demo da TEL-024 (`app/src/fluent/seed/caso.now.ts:1005`) | É o registro que o print e a demo usam para mostrar o dossiê | médio |
| Suíte `cob-regressao` (`app/src/fluent/tests/suite.now.ts`) | Recebe os 3 testes novos | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (spec, CA e regras da US, rules do harness e `tech-rules/*.mdc`); segurança (carteira, gravação de campo, exposição por lista e por contagem); teste de mesa nos registros reais do seed; performance das contagens e das listas; bugs técnicos do `CasoDossie`; testes ATF; observabilidade; regressão nos vizinhos do item 2.

**Não auditado (e por quê):**
- Injeção — N/A: nenhuma entrada do usuário entra em consulta montada em texto; o `casoId` vai por `get()` e os filtros por `addQuery`.
- Segredo exposto — N/A: o delta não tem credencial; a varredura não achou nada.
- Rate limiting — N/A: não há rota de autenticação nem operação em massa nova.
- Race condition — N/A: o delta só lê dados; nenhuma gravação nova.
- Mass assignment por API — N/A no delta: nenhuma rota nova; a gravação de campo do caso é tratada no SEC-001 (via lista).
- SSRF e prompt injection — N/A: sem URL de usuário e sem LLM.
- Execução do ATF na instância — não refeita pelo auditor; vale o recibo `outputs/spec/auditorias/atf/US-MOD-F5-003.json`.

## 4. Conformidade

Verificado contra a ficha da US no `tasks.json`, o `business-rules.md`, as rules `.claude/rules/harness/{deliver,security,servicenow-ui}.md` e `outputs/spec/tech-rules/*.mdc`.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| AC-RF-MOD-F5-003-01 — dossiê completo: seções Caso, Score, Sinalizações e Encerramento e listas de débitos, parcelamentos, comunicações, interações e regularizações | `app/src/fluent/ui/caso-dossie-niveis.now.ts:16-42` (seções), `:79-107` (listas) | ✅ PASS | As 4 seções e as 5 listas existem (print `US-MOD-F5-003-TEL-024.png` mostra as 5 abas). No caso demo da TEL-024, porém, as listas saem vazias para o próprio dono do caso (BUG-001) |
| AC-RF-MOD-F5-003-02 — contribuinte sem parcelamento: lista de parcelamentos vazia | `app/src/server/atendimento/CasoDossie.server.js:44`, `app/src/fluent/tests/US-MOD-F5-003.now.ts:88` | ✅ PASS | Provado pela contagem `parcelamentos = 0` do `montar()`; a lista da tela não tem teste (TEST-001) |
| AC-RF-MOD-F5-003-03 — caso de outro atendente: o sistema não mostra o registro | `CasoDossie.server.js:29-33`; ACL e regra de consulta da carteira | ✅ PASS | ATF negativo: `montar()` recusa, `GlideRecordSecure.get()` devolve falso, interação não grava, `canWrite()` falso |
| RN-NOVO-F5-003 — dossiê em 3 níveis | `CasoDossie.server.js:39-56`; `caso-dossie-niveis.now.ts:45-107` | ✅ PASS | Nível 1 (débitos, parcelamentos), 2 (comunicações, interações, regularizações) e 3 (score, sinalização) presentes. Níveis efetivos seguem em aberto no GAP-005 |
| RN-NOVO-F5-004 — dossiê sinaliza medida coercitiva, não executa | `caso-dossie-niveis.now.ts:126-140` | ⚠️ PARCIAL | Nenhuma ação coercitiva no form; a sinalização fica somente leitura **só no form**. Na lista TEL-023 e por script o atendente ainda grava o campo (SEC-001) |
| RN-NOVO-F1-001 — visão única do contribuinte por documento | `CasoDossie.server.js:34-37` | N/A | A regra é de ingestão (MOD-F1) e não cabe nesta US; o delta só recusa caso sem contribuinte e reaproveita a mensagem da regra (CONF-002) |
| RN-NOVO-F5-007 — atendente vê só a própria carteira | `CasoDossie.server.js:29`; contagens por `GlideAggregate` sob a regra de consulta | ✅ PASS | Caso de outro atendente recusado; contagens e listas passam pela regra de consulta da carteira. Nome do contribuinte de outra carteira aparece no campo de referência quando os donos divergem (BUG-001, causa do GAP-136) |
| Script Include `package_private`, `clientCallable: false` (`architecture.mdc`, RN-SN-70/72) | `caso-montar-dossie.now.ts:10-11` | ✅ PASS | |
| Consulta em nome do usuário por `GlideRecordSecure` (`security.mdc`, RN-SN-80) | `CasoDossie.server.js:29` | ✅ PASS | As contagens usam `GlideAggregate`, filtradas pela regra de consulta da carteira (ver item 6) |
| Contar com `GlideAggregate`, sem consulta em laço (RN-SN-20/22) | `CasoDossie.server.js:68-77` | ✅ PASS | 5 contagens fixas, nenhuma dentro de laço |
| UI Action não troca view — usar View Rule (`servicenow-ui.md`) | `caso-dossie-niveis.now.ts:109-123` | ✅ PASS | |
| Formatter de activity em seção própria no fim do form (`servicenow-ui.md`) | `caso-dossie-niveis.now.ts:37-40` | ✅ PASS | |
| UI Policy é UX, não segurança; edição em lista desligada nos campos controlados por UI Policy (RN-SN-145, RN-SN-68) | `caso-dossie-niveis.now.ts:127-140`; `app/src/fluent/ui/TEL-023.now.ts:14` | ❌ FAIL | Ver SEC-001 |
| Mensagem diz o que aconteceu e o que fazer (`conventions.mdc`) | `CasoDossie.server.js:12-14` | ⚠️ PARCIAL | Ver CONF-002 |
| `$id` com ID da spec (`conventions.mdc`, RN-SN-06) | todos os `.now.ts` do delta | ✅ PASS | O `Form()` não aceita `$id` (comentário em `caso-dossie-niveis.now.ts:15`); o `nowId` `RF-MOD-F5-003_form_dossie_niveis` da task fica sem registro correspondente |
| Teste positivo e negativo por regra, com usuário demo impersonado (`test-strategy.mdc`, RN-SN-83/110) | `app/src/fluent/tests/US-MOD-F5-003.now.ts` | ⚠️ PARCIAL | Positivo e negativo existem e usam `demo.atendente`/`demo.atendente2`; lacunas no TEST-001 |
| Logs `gs.info` no fim, `gs.warn` na recusa (observabilidade da task) | `CasoDossie.server.js:31` | ⚠️ PARCIAL | Ver OBS-001 |
| G3 do fio condutor com validadores de LLM (`deliver.md`) | `outputs/spec/auditorias/TASK-MOD-F5-003-0{1,2}.validacao.json` | ⚠️ PARCIAL | G3 `APROVADO` em modo `sem-agentes`: as 7 dimensões ficaram sem validador (CONF-003) |
| Pronto da US: install `ok` no commit de `app/src/fluent` + recibo ATF `success` do mesmo commit | `outputs/spec/sync-log.md:17`; `outputs/spec/auditorias/atf/US-MOD-F5-003.json` | ✅ PASS | Install `ok` em `9c57189` (1.056 registros); recibo `success` em `9c57189`, 3/3 testes |

**CA da US cumpridos?** Sim — AC-RF-MOD-F5-003-01, -02 e -03 (e os três cenários BDD equivalentes `AC-STORY-MOD-F5-003-RF-MOD-F5-003-01..03`) cumpridos no código e com teste verde. Ressalvas no BUG-001 (dado do seed) e no TEST-001 (cobertura da tela).
**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] Sinalização coercitiva gravável pelo atendente fora do form — MÉDIO** · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A01 (Broken Access Control) · CWE-284 · STRIDE T (adulteração) · ASVS 5.0 V8
> Arquivo: `app/src/fluent/ui/caso-dossie-niveis.now.ts:127-140` (UI Policy); `app/src/fluent/ui/TEL-023.now.ts:14` (coluna `sinal_coercitivo` na lista «Minha fila»); `app/src/fluent/security/carteira.now.ts` (ACL de campo `*` de gravação do caso)
> Contexto: nível 3 do dossiê (RN-NOVO-F5-004).
> **Problema:** a UI Policy deixa «Sinalização coercitiva ativa» e a descrição somente leitura apenas no form. A lista TEL-023 mostra a coluna `sinal_coercitivo` sem desligar a edição em lista (RN-SN-68), e a ACL de campo `*` deixa o atendente gravar qualquer campo do próprio caso. UI Policy não vale para edição em lista, script nem API (RN-SN-145).
> **Risco:** o atendente liga ou desliga a sinalização do próprio caso pela lista. O dossiê passa a mostrar uma sinalização que não veio da fonte, ou esconde uma que veio, e a regra «o dossiê só mostra a sinalização da fonte» deixa de valer.
> **Fix:** ACL de campo de gravação em `sinal_coercitivo` e `sinal_coercitivo_desc` só para o admin do app (ou para o processo de carga), e edição em lista desligada nessas colunas. É a mesma causa da ACL de campo `*` já registrada no GAP-135 (SEC-023 proposto: «atendente grava prioridade, score e sinalização do próprio caso»).
> **TDD RED:** impersonado como `demo.atendente`, `GlideRecordSecure` no próprio caso, `setValue('sinal_coercitivo', false)` e `update()` — hoje grava.
> **TDD GREEN:** o mesmo `update()` é negado e o valor continua `true`; `canWrite()` do elemento `sinal_coercitivo` devolve falso.
> **GAP recomendado:** somar ao **GAP-135** (mesma causa; acrescentar «inclui a edição em lista da TEL-023 e a UI Policy do dossiê, que só vale no form»).

## 6. Testes de mesa (vetores no delta)

Rastreei o caminho do dado como um atendente mal-intencionado, com os registros do seed e os do ATF.

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| IDOR (um atendente abrir o caso de outro) | `demo.atendente2` chama `CasoDossie.montar()` e abre o form com o `sys_id` de um caso de `demo.atendente` | ✅ BLOQUEADO | `CasoDossie.server.js:29-33` (`GlideRecordSecure.get` falha e devolve a mesma mensagem para caso inexistente, sem revelar se existe); ATF negativo verde |
| IDOR pelas listas relacionadas | Lista «Débitos do contribuinte do caso» num caso próprio cujo contribuinte é de outra carteira | ✅ BLOQUEADO | `filtrarPorContribuinte()` (`:64-66`) + regra de consulta `contribuinte.atendente = usuário`; o print mostra a lista vazia nesse caso (ver BUG-001 para o efeito colateral) |
| Vazamento por contagem («números de outros atendentes nunca aparecem») | `_contar()` com `GlideAggregate` sem `Secure` (`:68-77`) | ✅ BLOQUEADO | A regra de consulta da carteira roda antes de qualquer consulta da sessão do atendente, inclusive agregada; a contagem só soma linhas da carteira dele. Não há teste que prove isso com donos divergentes (TEST-001) |
| Exposição do nome do contribuinte de outra carteira | Campo de referência «Contribuinte» no caso demo da TEL-024 | ⚠️ EXPOSTO (dado fictício, causa pré-existente) | Print `US-MOD-F5-003-TEL-024.png`: `demo.atendente` vê «Distribuidora Almeida Fictícia Ltda», contribuinte de `demo.atendente2` (`seed/contribuinte.now.ts:259`). Causa: GAP-136 (BUG-001) |
| Auth bypass | Script Include não é chamável pelo navegador nem por outro escopo | ✅ BLOQUEADO | `caso-montar-dossie.now.ts:10-11` |
| Escalada de privilégio / gravação indevida | Atendente grava a sinalização do próprio caso pela lista | ❌ VULNERÁVEL (MÉDIO) | SEC-001 |
| Escrita no caso de outro atendente | `demo.atendente2` tenta gravar interação e encerrar | ✅ BLOQUEADO | ACL e BR da carteira; ATF negativo (`US-MOD-F5-003.now.ts:155-161`) |
| Injeção | `casoId` e `contribuinte` | N/A | Entram por `get()` e `addQuery()`, nunca em texto de consulta |
| Segredo exposto | — | N/A | Varredura sem achado |
| Mass assignment | — | N/A | Sem rota nova |
| Rate limit / Race condition | — | N/A | Só leitura |
| Dado pessoal em log | `gs.warn` da recusa | ✅ OK | Loga só `sys_id` do usuário e do caso (`:31`) |

## 7. Findings de Performance

Nenhum finding. As 5 contagens do `montar()` são agregações fixas, fora de laço (RN-SN-20/22). As listas relacionadas usam o filtro do relacionamento e a paginação padrão da Core UI. A View Rule roda um script de uma linha por abertura de form. O custo do dot-walk da ACL por linha já está no GAP-140.

## 8. Findings de Bugs Técnicos

**[BUG-001] Dossiê do caso demo da TEL-024 sai vazio para o próprio dono do caso — MÉDIO** · JavaScript/seed · `app/src/fluent/seed/caso.now.ts:1005-1022` com `app/src/fluent/seed/contribuinte.now.ts:252-259`
- **Cenário:** o caso demo da TEL-024 é de `demo.atendente`, mas o contribuinte dele («Distribuidora Almeida Fictícia Ltda») é da carteira de `demo.atendente2`. O seed tem 2 débitos, 1 parcelamento e 1 comunicação desse contribuinte.
- **Consequência:** ao abrir o dossiê como `demo.atendente`, as listas de débitos, parcelamentos e comunicações saem vazias («No records to display» no print), enquanto o cabeçalho mostra «Valor em aberto 39.425,46» e o nome do contribuinte de outra carteira. O registro que a demo usa para mostrar o dossiê completo mostra um dossiê incompleto. O `montar()` devolveria 0 débitos nesse caso.
- **Fix:** é a mesma causa do **GAP-136** (dono do caso diferente do dono do contribuinte em 22 dos 51 casos do seed). A opção 1 do GAP-136 (o caso herda o atendente do contribuinte; seed coerente) resolve o dossiê. **GAP recomendado:** somar ao **GAP-136**, acrescentando «afeta o dossiê da US-MOD-F5-003: o caso demo da TEL-024 mostra listas vazias e o nome do contribuinte de outra carteira».
- Observação no mesmo registro demo, sem efeito na regra desta US: `score 80914.95` com `sem_score = true`, e `motivo_encerramento`/`encerrado_em` preenchidos com estágio «Caso selecionado». Vêm do gerador do seed.

**Sem outros bugs.** Nulos tratados (`casoId` vazio, caso sem contribuinte, `_contar` com valor vazio); booleano lido por `['1','true']`; sem recurso a fechar; sem data ou fuso.

## 9. Testes

**CA viraram teste?**
- AC-01 (dossiê completo): sim, no servidor (contagens dos 3 níveis com donos coerentes) e no form (seções, somente leitura da sinalização e lista de Interações).
- AC-02 (parcelamentos vazio): sim, só pela contagem `parcelamentos = 0` do `montar()`; a lista da tela não é conferida.
- AC-03 (caso de outro atendente): sim, servidor (recusa do `montar()`, `get` negado, interação não grava, `canWrite` falso).

**TDD RED/GREEN presente?** Sim para a carteira: o commit `9c57189` corrige o teste negativo, que não achava o caso do outro atendente por causa da regra de consulta (`setWorkflow(false)` só para localizar o `sys_id`, com comentário). **Recibo ATF:** `success` em `9c57189`, 3/3.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `app/src/fluent/tests/US-MOD-F5-003.now.ts` — `t_f5003_dossie_pos` | Sim: 2 débitos, 0 parcelamentos, 1 comunicação, 3 interações, 1 regularização, score 72, sinalização com descrição | Sim: caso sem contribuinte recusado | Bom; testa o `montar()`, que nenhuma tela chama (CONF-001) |
| `t_f5003_dossie_neg` | — | Sim: caso de outro atendente, `casoId` vazio, interação e encerramento negados | Bom; encerramento só por `canWrite()`, sem tentar o `update()` |
| `t_f5003_ui` | Sim: view do dossiê abre, campos visíveis, sinalização somente leitura, lista Interações visível | Não | Não confere as 4 listas por relacionamento nem a lista de parcelamentos vazia |

**[TEST-001] Lacunas de teste do dossiê na tela — MÉDIO** · `app/src/fluent/tests/US-MOD-F5-003.now.ts:202-205`
- O ATF de form confere só a lista `x_2326104_cob_interacao.caso`. As 4 listas que dependem do `filtrarPorContribuinte()` (débitos, parcelamentos, comunicações, regularizações) não têm teste — o filtro que o usuário de fato vê não é provado.
- Falta o caso «caso meu, contribuinte de outra carteira» (o do BUG-001): nenhum teste mostra o que a tela e as contagens fazem quando os donos divergem.
- Falta um teste de form negativo: `demo.atendente2` abrindo o form do caso de `demo.atendente`.
- Falta o caso «coordenador vê o dossiê completo de qualquer caso».
- **GAP proposto:** **GAP-144** — «Lacunas de teste do dossiê (US-MOD-F5-003): listas por relacionamento, donos divergentes, form negado e coordenador». Fecha em parte o GAP-137 (o form da TEL-024 passa a ter ATF de form).

**[TEST-002] Suíte de regressão sem recibo no commit auditado — BAIXO** · `outputs/spec/auditorias/atf/cob-regressao.json`
- O único recibo da suíte `cob-regressao` é de `1c417e7` (US-MOD-F2-002), com status `failure`. Não há recibo da suíte em `9c57189`; a linha de install (`sync-log.md:17`) registra só «ok; 1056 registros». A View Rule nova muda a view de todo form do caso, e não há prova de que os testes de form das stories anteriores continuam verdes.
- **GAP proposto:** **GAP-145** — «Suíte cob-regressao sem recibo verde no commit da US».

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| `CasoDossie.montar()` — dossiê montado | Não | Não | OBS-001 |
| `CasoDossie.montar()` — recusa por carteira | Sim, `gs.warn` com `sys_id` do usuário e do caso (`CasoDossie.server.js:31`) | Contável pelo system log (origem `RF-MOD-F5-003`) | — |
| `CasoDossie.montar()` — recusa por caso sem contribuinte ou sem `casoId` | Não | Não | OBS-001 |
| Abertura do form do dossiê e listas relacionadas | Pela plataforma (transação) | Não | — (abertura negada sem log já está no GAP-142) |

**[OBS-001] Dossiê montado e recusas de dado sem log — BAIXO** · `app/src/server/atendimento/CasoDossie.server.js:26-37, 39`
- A task pede `gs.info` no fim do processamento e `gs.warn` em toda recusa. Só a recusa por carteira loga. O dossiê montado e as recusas por caso vazio ou sem contribuinte passam sem registro.
- **GAP proposto:** **GAP-146** — «Dossiê sem log de sucesso e de recusa por dado incompleto».

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| Regra de consulta e ACL da carteira | Não. Nenhum arquivo da carteira mudou; o dossiê só consome | `git diff bc26301..9c57189 -- app/` não toca `security/` nem `business-rules/`; ATF negativo verde |
| Form padrão do caso (TEL-024 gerado) | Sim, esperado: a View Rule `overrides_user_preference: true` abre sempre a view do dossiê, para todos os papéis; a view padrão fica fora do caminho normal | `caso-dossie-niveis.now.ts:109-123`; print com «View: Dossiê do caso» |
| Lista «Minha fila» (TEL-023) | Sim: a sinalização continua editável na lista | SEC-001 |
| Seed do caso demo da TEL-024 | Sim: o dossiê do registro demo sai incompleto | BUG-001 |
| Suíte `cob-regressao` | Não verificável no commit auditado | TEST-002 |
| `keys.ts` | Não: nenhuma chave existente removida | 41 marcas `deleted: true` antes e depois; IDs que aparecem removidos no diff continuam no arquivo |
| Achados de processo | O G3 rodou sem validadores de LLM, como na US-MOD-F5-007 | CONF-003 |

Achados de conformidade não ligados a segurança:

**[CONF-001] `CasoDossie.montar()` não tem consumidor na tela — BAIXO** · `app/src/server/atendimento/CasoDossie.server.js:26-57`
- Nenhuma tela, business rule ou UI Action chama `montar()`; só o ATF. O dossiê que o atendente vê é o form com as listas relacionadas, filtradas por `filtrarPorContribuinte()`. A spec da TASK-MOD-F5-003-01 diz que o Script Include é «chamado por business rule, flow ou UI Action». Hoje o teste positivo prova o método, não a tela.
- **GAP proposto:** **GAP-147** — «Dossiê em 3 níveis montado por Script Include sem uso na tela» (opções: mostrar as contagens no form, por exemplo num formatter ou campo calculado; ou registrar o `montar()` como serviço interno para relatório e teste).

**[CONF-002] Mensagens de recusa do dossiê não dizem o que fazer — BAIXO** · `app/src/server/atendimento/CasoDossie.server.js:12-13`
- «Operação recusada: dossiê em 3 níveis (premissa).» (caso não informado) e «Operação recusada: visão única do contribuinte por documento.» (caso sem contribuinte) foram copiadas do texto genérico da spec. Não dizem o que aconteceu nem o que fazer (`conventions.mdc`, «Mensagens ao usuário»). Hoje elas não chegam à tela (CONF-001), mas chegariam se o `montar()` for usado.
- **GAP proposto:** **GAP-148** — «Mensagens do dossiê copiadas do texto genérico da spec» (ex.: «Informe o caso para abrir o dossiê.» e «Este caso não tem contribuinte; vincule o contribuinte para montar o dossiê.»).

**[CONF-003] G3 do fio condutor sem validadores de LLM — BAIXO** · `outputs/spec/auditorias/TASK-MOD-F5-003-01.validacao.json`, `TASK-MOD-F5-003-02.validacao.json`
- Modo `sem-agentes`; as 7 dimensões aparecem em `dimensoesSemValidador`. O `deliver.md` pede G3 com LLM no fio condutor. Não há isenção de G3 desta story em `outputs/spec/auditorias/_isencoes/`.
- **GAP recomendado:** somar ao **GAP-107** (mesma causa: G3 do fio condutor rodou sem validadores de LLM), acrescentando a US-MOD-F5-003.

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

Os três critérios de aceite estão cumpridos e testados, com recibo ATF verde e install `ok` no commit auditado. O dossiê respeita a carteira: caso de outro atendente é recusado e as listas e contagens só trazem dado da carteira do usuário. As ressalvas são de severidade média e baixa. A sinalização ainda pode ser gravada pela lista (SEC-001, GAP-135). O caso demo da TEL-024 mostra o dossiê vazio por causa do seed (BUG-001, GAP-136). A tela do dossiê tem lacunas de teste (TEST-001).

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há SEC CRÍTICO/ALTO) |

**Resumo dos achados:**

| ID | Severidade | Uma frase | GAP |
|---|---|---|---|
| SEC-001 | MÉDIO | O atendente grava a sinalização coercitiva do próprio caso pela lista; a UI Policy só vale no form | somar ao GAP-135 |
| BUG-001 | MÉDIO | O caso demo da TEL-024 mostra o dossiê vazio e o nome do contribuinte de outra carteira, porque os donos divergem no seed | somar ao GAP-136 |
| TEST-001 | MÉDIO | O ATF de form não confere as 4 listas por relacionamento, os donos divergentes nem o form negado | GAP-144 (novo) |
| TEST-002 | BAIXO | A suíte `cob-regressao` não tem recibo no commit auditado | GAP-145 (novo) |
| OBS-001 | BAIXO | O dossiê montado e as recusas por dado incompleto não geram log | GAP-146 (novo) |
| CONF-001 | BAIXO | `montar()` só é chamado pelo ATF; a tela usa as listas | GAP-147 (novo) |
| CONF-002 | BAIXO | Mensagens de recusa copiadas do texto genérico da spec | GAP-148 (novo) |
| CONF-003 | BAIXO | G3 rodou sem validadores de LLM | somar ao GAP-107 |

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-001 | `app/src/fluent/ui/caso-dossie-niveis.now.ts:127-140`; `app/src/fluent/ui/TEL-023.now.ts:14`; `app/src/fluent/security/carteira.now.ts` | ACL de campo de gravação em `sinal_coercitivo` e `sinal_coercitivo_desc` só para admin do app; desligar edição em lista dessas colunas; teste RED/GREEN de gravação pelo atendente | `outputs/spec/gaps-document.md` (somar ao GAP-135) |
| 2 | BUG-001 | `app/src/fluent/seed/caso.now.ts:1005-1022`; `app/src/fluent/seed/contribuinte.now.ts:259` | Seed coerente: o caso herda o atendente do contribuinte (opção 1 do GAP-136); regerar o print da TEL-024 | `outputs/spec/gaps-document.md` (somar ao GAP-136) |
| 3 | TEST-001 | `app/src/fluent/tests/US-MOD-F5-003.now.ts:202-205` | ATF de form para as 4 listas por relacionamento e lista de parcelamentos vazia; teste com donos divergentes; form negado para `demo.atendente2`; dossiê do coordenador | `outputs/spec/gaps-document.md` (GAP-144) |
| 4 | TEST-002 | `outputs/spec/auditorias/atf/cob-regressao.json` | Rodar a suíte `cob-regressao` em `9c57189` e gravar o recibo | `outputs/spec/gaps-document.md` (GAP-145) |
| 5 | OBS-001 | `app/src/server/atendimento/CasoDossie.server.js:26-39` | `gs.info` no dossiê montado e `gs.warn` nas recusas por caso vazio ou sem contribuinte, só com `sys_id` | `outputs/spec/gaps-document.md` (GAP-146) |
| 6 | CONF-001 | `app/src/server/atendimento/CasoDossie.server.js:26-57` | Decidir se as contagens aparecem no form ou se `montar()` fica como serviço interno documentado | `outputs/spec/gaps-document.md` (GAP-147) |
| 7 | CONF-002 | `app/src/server/atendimento/CasoDossie.server.js:12-13` | Reescrever as duas mensagens dizendo o que aconteceu e o que fazer | `outputs/spec/gaps-document.md` (GAP-148) |
| 8 | CONF-003 | `outputs/spec/auditorias/TASK-MOD-F5-003-0{1,2}.validacao.json` | Rodar o G3 com validadores ou registrar a isenção de G3 da story | `outputs/spec/gaps-document.md` (somar ao GAP-107) |

O marcador `outputs/spec/em-andamento.md` não foi apagado nesta execução: o pedido da auditoria limita a saída a este relatório. Com veredito diferente de BLOQUEADA, a remoção commitada do marcador continua pendente antes do push (o `delivery-gate` nega o push com o marcador na árvore).

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@9c57189
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
