# Auditoria de Entrega — [US-MOD-UX-005] Caso qualificado do coordenador e «Avançar etapa»

- **User Story:** US-MOD-UX-005 (nó `STORY-MOD-UX-005` no `outputs/spec/tasks.json`, sem label `fio-condutor`) — RF-MOD-UX-005
- **Features/IDs cobertos:** RF-MOD-UX-005 · RN-NOVO-UX-007 (caso é do coordenador e avança em ordem) · RN-NOVO-UX-008 (ordem dos estágios, encerrar com motivo) · AC-RF-MOD-UX-005-01..03 · TASK-MOD-UX-005-01 (coluna `coordenador`, feita na F2) e TASK-MOD-UX-005-02 · telas TEL-023 e TEL-024 · decisões R4 e R6 e correção 🔴3 do design
- **Branch/commit auditado:** `feat/v0` @ `182fd13` (delta: `296fbfc` verbos e ATF, `182fd13` polimento `etapa_ordem`; a ACL R4 do coordenador na interação entrou em `78add92`, da US-MOD-UX-006)
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Contrato usado.** `docs/designs/ux-cobranca-v1.md`, com a seção final «v1.1» prevalecendo; o nó da US no `tasks.json`; os guardrails do `CLAUDE.md`, de `.claude/rules/harness/security.md` e de `.claude/rules/harness/servicenow-ui.md`.
>
> **Pendente.** O recibo ATF `outputs/spec/auditorias/atf/US-MOD-UX-005.json` ainda não existe (reinstalação completa com a suíte em andamento). Esta auditoria não atesta a execução dos 3 testes; a evidência de execução fica pendente do recibo.

---

## 1. Inventário do delta

O delta dá ao coordenador dois botões no form do caso qualificado. «Avançar etapa» leva o caso à etapa seguinte na ordem em seleção, selecionado, dossiê gerado e condução. «Encerrar caso» exige o motivo, grava a data e fecha. A lógica fica no Script Include `CasoConducao`. O polimento acrescenta a coluna «Ordem da etapa» (`etapa_ordem`), mantida por uma Business Rule (regra que roda no servidor antes de gravar), para que «Casos qualificados» ordene pela sequência das etapas e não pelo valor alfabético do estágio.

**Arquivos tocados:**

| Arquivo | Papel |
|---|---|
| `app/src/server/atendimento/CasoConducao.server.js` (novo, 108 linhas) | Classe de servidor: `avancarEtapa()`, `encerrar()`, `preencherOrdemEtapa()` e as recusas com `{ok, mensagem}` |
| `app/src/fluent/script-includes/caso-conducao.now.ts` (novo) | Registra `CasoConducao` como `package_private`, não chamável pelo navegador |
| `app/src/fluent/ui-actions/caso.now.ts` (novo, 61 linhas) | Botões «Avançar etapa» (servidor) e «Encerrar caso» (cliente + servidor), com `roles` e `condition` |
| `app/src/server/atendimento/preencherOrdemEtapa.server.js` (novo) | Corpo da regra que grava `etapa_ordem` |
| `app/src/fluent/business-rules/caso.now.ts` (novo, 16 linhas) | Regra `before insert/update` em `x_2326104_cob_caso`, order 90 |
| `app/src/fluent/tables/caso.now.ts` | Coluna `etapa_ordem` e rótulo no plural |
| `app/src/fluent/navigation/menu.now.ts` e `app/src/fluent/seed/_homes.now.ts` | Filtro «Casos qualificados» passa a `ORDERBYetapa_ordem^ORDERBYDESCprioridade` |
| `app/src/fluent/seed-demo/caso.now.ts` e `app/scripts/gerar-seed-demo.mjs` | Seed com `etapa_ordem` por estágio |
| `app/src/fluent/tests/US-MOD-UX-005.now.ts` (novo, 242 linhas) | 3 testes ATF (positivo, negativo, visibilidade dos botões) |
| `app/src/fluent/generated/keys.ts`, demais `tables/*.now.ts`, `simulations/*` | Chaves geradas e `pluralLabel` das outras tabelas (fora do escopo da US, só rótulo) |

**Endpoints:** nenhuma rota nova; dois caminhos de gravação por botão (`x_cob_avancar_etapa`, `x_cob_encerrar_caso`). A tabela do caso segue com `allowWebServiceAccess: true` (Table API aberta), então as ACL e regras valem também por API.
**Entidades:** `x_2326104_cob_caso` (`estagio`, `motivo_encerramento`, `encerrado_em`, `etapa_ordem` novo); `x_2326104_cob_interacao` (R4, só a ACL).
**Stack:** app escopado `x_2326104_cob`, Fluent SDK (`UiAction`, `ScriptInclude`, `BusinessRule`, `Test`), ES5 de servidor, ATF com Jasmine 3.1.

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 62dbed8 --repo app` → 51 arquivos, 0 achados.
**Isenção dos validadores com modelo de linguagem:** `outputs/spec/auditorias/_isencoes/US-MOD-UX-005-g3.md` (story fora do fio condutor; build, instalação e ATF continuam obrigatórios).

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| `recusarCasoForaDaCarteira.server.js` (BR order 100 em `caso`, `app/src/fluent/business-rules/carteira.now.ts:19-29`) | Os verbos gravam o caso e disparam essa regra; a nova regra order 90 roda antes dela | baixo |
| ACL do caso (`security/carteira.now.ts:136-165`, `security/caso-sem-atendente.now.ts`) | O atendente não lê nem grava o caso; os botões só valem para coordenador e admin | médio |
| ACL de criação/gravação da interação (`security/carteira.now.ts:179-215`, commit `78add92`) | R4: coordenador registra interação no caso | médio |
| `CasoDossie.server.js` e geração de casos | Também gravam o estágio; agora a BR calcula `etapa_ordem` em toda gravação | baixo |
| Menu e página inicial do coordenador | Filtro trocou o campo de ordenação | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade com RN-NOVO-UX-007/008 e os 3 critérios; segurança (quem conduz o caso, caminhos de gravação fora do botão); teste de mesa; bugs de ES5; testes ATF; observabilidade; regressão nos vizinhos.
**Não auditado (e por quê):**
- Injeção, segredo, rate limit, SSRF, prompt injection: N/A, sem texto do usuário em consulta, sem segredo, sem rota pública nem modelo de linguagem.
- Performance: N/A, 1 leitura e 1 gravação por clique; a regra de ordem é uma conta em memória.
- Trilha de etapas (TEL-024) e prints: dependem da view e dos prints do fim da fase, não estão no delta.
- Execução dos testes: recibo ATF pendente.

## 4. Conformidade

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| RN-NOVO-UX-008: avança na ordem em seleção, selecionado, dossiê gerado, condução | `CasoConducao.server.js:12`, `:35-46` | ✅ PASS | |
| De condução em diante só «Encerrar caso» | `CasoConducao.server.js:37-39`; `ui-actions/caso.now.ts:15` | ✅ PASS | Botão some na condução e o servidor recusa com mensagem |
| Encerrar exige motivo (regularizado, esgotado, outro) e grava `encerrado_em` | `CasoConducao.server.js:60-66` | ✅ PASS | `hasOwnProperty` evita motivo herdado do objeto |
| Mensagens exatas `CASO_ENCERRADO` e `SEM_MOTIVO` | `CasoConducao.server.js:15-16` | ✅ PASS | |
| Conferir papel coordenador (passo 1 do algoritmo) | `CasoConducao.server.js:91-95` | ✅ PASS | Papel `coordenador` ou `admin` do app |
| Estágio e dono lidos como gravados, não como vieram do form (lição da US-MOD-UX-002, SEC-002) | `CasoConducao.server.js:30`, `:56`, `:85-89` | ✅ PASS | |
| 🔴3: verbo cliente + servidor (`g_form.setMandatory` + `gsftSubmit` + guarda `typeof window`) | `ui-actions/caso.now.ts:41-60` | ✅ PASS | |
| 🔴3: `{ok, mensagem}`, `condition`, `roles`, `actionName`, `setRedirectURL` | `ui-actions/caso.now.ts:8-27`, `:30-60` | ✅ PASS | |
| RN-SN-146: Script Include chamado pela tela não chamável pelo navegador | `script-includes/caso-conducao.now.ts:7-12` | ✅ PASS | `package_private`, `clientCallable: false` |
| R6: coluna `coordenador` com rótulo «Responsável» | `tables/caso.now.ts:13` | ✅ PASS | Entrega da TASK-MOD-UX-005-01 |
| R4: coordenador registra interação no caso | `security/carteira.now.ts:179-215` | ✅ PASS | Create e write por papel; deny só quem não vê tudo (`CarteiraAtendente.veTudo`) |
| Caso sem acesso para o atendente | `security/caso-sem-atendente.now.ts` | ✅ PASS | Da US-MOD-UX-006 |
| «Casos qualificados» só abertos, por etapa e prioridade | `navigation/menu.now.ts` (filtro), `seed/_homes.now.ts` | ✅ PASS | `estagio!=encerrado^ORDERBYetapa_ordem^ORDERBYDESCprioridade` |
| `etapa_ordem` coerente com a trilha em toda gravação | `business-rules/caso.now.ts:11-14`; `CasoConducao.server.js:79-83` | ✅ PASS | Encerrado = 5; estágio vazio grava vazio |
| Encerrar sem motivo recusado por qualquer caminho (CA-03, «sem editar o campo à mão») | `CasoConducao.server.js:61-66` | ⚠️ PARCIAL | Só o botão exige motivo; form, lista e API gravam `encerrado` sem motivo (SEC-001) |
| ATF: 1 por verbo do CUJ e 1 negativo | `tests/US-MOD-UX-005.now.ts` | ⚠️ PARCIAL | Ver TEST-001 |
| Logs com `gs.info`/`gs.warn`, sem `console.log`, sem dado pessoal | `CasoConducao.server.js:45`, `:70`, `:103` | ✅ PASS | Só sys_id do caso e do usuário |
| Sem consulta em laço; sem tecnologia fora da spec | todo o delta | ✅ PASS | |

**CA da US cumpridos?**
- **AC-RF-MOD-UX-005-01** (lista só de abertos, por etapa e prioridade): cumprido no filtro; nenhum teste verifica a ordem (TEST-001).
- **AC-RF-MOD-UX-005-02** (avançar leva à etapa seguinte e a trilha acompanha): cumprido no servidor e testado; a trilha acompanha porque lê o estágio, e não é testada.
- **AC-RF-MOD-UX-005-03** (encerrar sem motivo não é aceito): cumprido pelo botão e testado no servidor; fora do botão não é recusado (SEC-001).

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes
Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] Caso encerra sem motivo e pula etapa por form, lista ou API — MÉDIO** · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A04 (Insecure Design) · CWE-840 · STRIDE T (adulteração)
> Arquivo: `app/src/server/atendimento/CasoConducao.server.js:61-66` e `app/src/fluent/business-rules/carteira.now.ts:19-29` (regra do caso só confere dono) · Contexto: `x_2326104_cob_caso`, campo `estagio`
> **Problema:** a regra «encerrar exige motivo» e a ordem das etapas vivem só no Script Include. A ACL de campo `*` (`security/carteira.now.ts:157-165`) deixa o coordenador editar `estagio` à mão no form, na lista e pela Table API. Nenhuma regra do caso recusa `estagio = encerrado` sem `motivo_encerramento`, nem salto de etapa. O contato tem essa proteção por qualquer caminho (`app/src/server/carteira/recusarContatoForaDaCarteira.server.js:10`); o caso não.
> **Risco:** caso encerrado sem motivo ou sem `encerrado_em`, ou voltado à etapa anterior, e o indicador «Casos qualificados» perde a confiança. Só coordenador e admin conseguem; a tabela tem `audit: true`.
> **Fix:** em `recusarCasoForaDaCarteira.server.js` (ou regra nova), recusar `estagio = encerrado` sem motivo com a mensagem `CasoConducao.MSG_SEM_MOTIVO` e, se a decisão for manter a ordem por qualquer caminho, recusar mudança de estágio que não seja a próxima da ordem ou o encerramento.
> **TDD RED:** como `demo.coordenador`, `setValue('estagio','encerrado')` sem motivo e `update()` num caso em seleção: hoje grava. **TDD GREEN:** a mesma gravação é recusada com «Operação recusada: informe o motivo de encerramento.»; os botões continuam funcionando.
> GAP recomendado: novo GAP em `outputs/spec/gaps-document.md`, com `SEC-NNN` proposto para o próximo ciclo.

> **[BUG-001] Os botões gravam o registro inteiro que veio do form — BAIXO**
> Arquivo: `app/src/server/atendimento/CasoConducao.server.js:41-42` e `:64-67` · Cenário: o coordenador altera prioridade ou comentário no form e clica «Avançar etapa» sem salvar; o `update()` em `caso` leva tudo junto. A US-MOD-UX-002 corrigiu o mesmo padrão no contato (commit `4f2390a`: grava num registro lido pelo servidor).
> Consequência: só o coordenador pode, e a edição era dele de qualquer forma; o efeito é uma gravação não pedida no clique. Fix: gravar `estagio` (e motivo, data) no registro `gravado` já lido por `_gravado`, e não em `caso`.

> **[BUG-002] `etapa_ordem` repetida em 3 lugares e sem carga para linhas antigas — BAIXO**
> Arquivo: `CasoConducao.server.js:80-82`, `app/scripts/gerar-seed-demo.mjs` (mapa 1 a 5) e `app/src/fluent/seed-demo/caso.now.ts` · Cenário: caso existente antes do polimento não tem `etapa_ordem` até a próxima gravação e aparece no topo da ordenação (valor vazio ordena primeiro). Em demo a reinstalação com seed corrige. Fix: carga única das linhas antigas na instalação e gerar o mapa do seed a partir de `CasoConducao.ORDEM`.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR | Atendente chama o botão no caso de um coordenador | ✅ BLOQUEADO | ACL de leitura do caso nega o atendente (`caso-sem-atendente.now.ts`); o verbo recusa com `MSG_SO_COORDENADOR` (`CasoConducao.server.js:93-95`) |
| Auth Bypass | Botão sem papel `coordenador` | ✅ BLOQUEADO | `roles` na UI Action (`ui-actions/caso.now.ts:14`, `:36`) e conferência no servidor |
| Privilege Escalation | Atendente grava `estagio` pela Table API | ✅ BLOQUEADO | ACL de gravação do caso só coordenador/admin (`carteira.now.ts:136-165`) |
| Adulteração de regra de negócio | Coordenador grava `estagio=encerrado` sem motivo pelo form/API | ❌ VULNERÁVEL (MÉDIO) | SEC-001 |
| Mass Assignment | Campos postados junto do clique | ⚠️ BAIXO | BUG-001 |
| Race Condition | Dois cliques simultâneos em «Avançar» | N/A | Cada clique relê o estágio gravado; o pior caso é avançar duas etapas por dois cliques reais |
| Injeção / Secret / Rate Limit | — | N/A | Sem entrada em consulta, segredo nem rota pública |

## 7. Findings de Performance
Nenhum.

## 8. Findings de Bugs Técnicos
BUG-001 e BUG-002 na seção 5.2.

## 9. Testes

**CA viraram teste?**
- CA-01: não (nenhum teste confere a ordem nem o filtro «só abertos»).
- CA-02: sim no servidor (`t_ux005_pos`, 2 avanços); a trilha não é testada.
- CA-03: sim no servidor (`t_ux005_neg`, motivo vazio recusado e estágio mantido); não pelo form.

**TDD RED/GREEN presente?** O ATF e o código vieram no mesmo commit (`296fbfc`); não há registro de RED separado.
**Cobertura do delta:** caminhos principais cobertos; ver TEST-001.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `app/src/fluent/tests/US-MOD-UX-005.now.ts` — `t_ux005_pos` (`:9-92`) | Sim: avança 2 vezes, encerra com motivo e data, interação no caso (R4) | N/A | Bom; asserções sobre o estado relido do banco |
| `t_ux005_neg` (`:94-205`) | N/A | Sim: sem motivo, além da condução, caso encerrado, atendente | Bom; o atendente é testado pela classe, não pelo botão |
| `t_ux005_ui` (`:207-242`) | Sim: os 2 botões aparecem ao coordenador | Não | Só visibilidade |

> **[TEST-001] Lacunas de teste — BAIXO.** Sem teste da ordem de «Casos qualificados» (CA-01). Sem teste de que o botão some para quem não é coordenador e para o caso em condução (`condition`). Sem teste do clique em «Encerrar caso» sem motivo pelo form. Sem teste da gravação direta sem motivo (SEC-001). Execução dos 3 testes: recibo pendente.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Avançar etapa | Sim, `gs.info` com caso, etapa de origem, destino e usuário (`CasoConducao.server.js:45`) | Não exigida | — |
| Encerrar caso | Sim, `gs.info` com caso, motivo e usuário (`:70`) | Não exigida | — |
| Recusas | Sim, `gs.warn` com origem, caso, usuário e mensagem (`:103`) | Não exigida | — |
| Falha de gravação (`update()` falso) | Não registra log; devolve a mensagem ao usuário (`:43`, `:68`) | Não | OBS-001 BAIXO: acrescentar `gs.warn` nesse retorno |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| BR do caso por carteira (order 100) | Não | Roda depois da BR de ordem (order 90); o coordenador passa por `veTudo` |
| ACL do caso e da interação | Não | `carteira.now.ts:136-215` e `caso-sem-atendente.now.ts` coerentes com R4 e R6; verificado na leitura, sem execução |
| Gravações de estágio fora do botão (`CasoDossie`, seed, geração) | Não | A BR calcula `etapa_ordem` em toda gravação; as linhas do seed trazem o valor |
| Menu e página inicial | Não | Mesmo filtro nos dois lugares |
| Suíte `cob-regressao` | Pendente | Recibo ATF ainda não gerado |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ (CA-03 cumprido pelo botão; ver SEC-001) |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (nenhum) |

O recibo ATF `US-MOD-UX-005.json` precisa existir e mostrar os 3 testes com sucesso antes de fechar a story.

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-001 (MÉDIO) | `app/src/server/carteira/recusarCasoForaDaCarteira.server.js`; referência: `recusarContatoForaDaCarteira.server.js:10` | Recusar `encerrado` sem motivo (e, se decidido, salto de etapa) por qualquer caminho | `outputs/spec/gaps-document.md` (GAP novo) |
| 2 | BUG-001 (BAIXO) | `CasoConducao.server.js:41-42`, `:64-67` | Gravar no registro lido pelo servidor, não no `current` do form | corrigir na US ou GAP |
| 3 | BUG-002 (BAIXO) | `CasoConducao.server.js:80-82`; `gerar-seed-demo.mjs` | Carga de `etapa_ordem` das linhas antigas; um só mapa de ordem | GAP |
| 4 | TEST-001 / OBS-001 (BAIXO) | `tests/US-MOD-UX-005.now.ts`; `CasoConducao.server.js:43`, `:68` | Teste da ordem da lista, do clique sem motivo e da recusa direta; log na falha de gravação | GAP |
| 5 | Recibo ATF | `outputs/spec/auditorias/atf/US-MOD-UX-005.json` | Anexar o recibo com os 3 testes em sucesso | fechamento da story |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@182fd13
achados-bloqueantes: nenhum
<!-- /gate:status -->
