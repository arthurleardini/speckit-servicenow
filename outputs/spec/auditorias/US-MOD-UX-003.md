# Auditoria de Entrega — [US-MOD-UX-003] Encerrar contato da lista com motivo

- **User Story:** US-MOD-UX-003 (nó `STORY-MOD-UX-003` no `outputs/spec/tasks.json`, sem label `fio-condutor`) — RF-MOD-UX-003 · Encerrar contato da lista com motivo
- **Features/IDs cobertos:** RF-MOD-UX-003 · RN-NOVO-UX-005 (encerramento exige motivo) · AC-RF-MOD-UX-003-01 e -02 · task TASK-MOD-UX-003-01 · tela TEL-035 (Contato da lista)
- **Branch/commit auditado:** `feat/v0` @ `b4e03b3` (delta `62dbed8..b4e03b3 -- app/`; o commit seguinte `03a0f4d` só traz o recibo ATF e o registro de instalação)
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Contrato usado.** A autoridade é o design `docs/designs/ux-cobranca-v1.md`; a seção final «Revisão EGM e decisões finais (v1.1)» prevalece (verbo como UI Action cliente + servidor, correção 🔴3). Junto, o nó da US no `tasks.json` (critérios, regra e mensagens) e os guardrails de `CLAUDE.md`, `.claude/rules/harness/security.md` e `servicenow-ui.md`.

> **Fora deste delta, por desenho.** A ACL de linha do contato por dono (o atendente só lê e grava os próprios contatos) é da US-MOD-UX-006 (`TASK-MOD-UX-006-01`). Esta auditoria marca esse ponto como N/A e cita a US. Os prints da TEL-035 saem no fim da fase e não foram exigidos.

> **Estado da árvore.** O worktree tem mudanças não commitadas (`ContatoLigacao.server.js`, `grupo-controle.now.ts`, `QualificacaoCiclo.server.js`). Esta auditoria leu o commit `b4e03b3` (`git show`), não a árvore, e os números de linha abaixo são desse commit.

---

## 1. Inventário do delta

O delta põe no form do contato o botão «Encerrar». No navegador, o botão torna obrigatório o «Motivo de encerramento», solta a obrigatoriedade dos campos da ligação e envia o form. No servidor, `ContatoLigacao.encerrar` confere papel e carteira, recusa contato já encerrado, exige um motivo da lista, grava status «Encerrado», motivo e próxima ação vazia, e devolve `{ok, mensagem}`.

**Arquivos tocados (5, todos em `app/`):**

| Arquivo | Papel |
|---|---|
| `app/src/server/contato/ContatoLigacao.server.js` (+30/-1) | Script Include (classe de servidor reutilizável) ganha `encerrar()` (linhas 102-117), a mensagem `MSG_SEM_MOTIVO` e o mapa `MOTIVOS` (33-34) |
| `app/src/fluent/ui-actions/contato.now.ts` (+35) | UI Action (botão do form) «Encerrar», `actionName` `x_cob_encerrar_contato`, linhas 47-80 |
| `app/src/fluent/tests/US-MOD-UX-003.now.ts` (novo, 165 linhas) | 2 testes ATF (Automated Test Framework, testes que rodam na instância): positivo e negativo |
| `app/src/fluent/tests/suite.now.ts` (+2) | Inclui os 2 testes na suíte `cob-regressao` |
| `app/src/fluent/generated/keys.ts` (+284) | Ids gerados pelo build (UI Action, 2 papéis da ação, 2 testes, 8 passos, ligação à suíte) |

**Endpoints alterados/criados:** nenhuma rota nova. Um caminho novo de gravação: o botão «Encerrar» no form de `x_2326104_cob_contato`.
**Entidades/modelos tocados:** `x_2326104_cob_contato` (grava `status`, `motivo_encerramento`, `proxima_acao_em`). Nenhum campo novo; as 5 opções do campo de motivo já existiam em `app/src/fluent/tables/contato.now.ts:31-37`.
**Stack envolvido:** app escopado `x_2326104_cob`, Fluent `@servicenow/sdk` (`UiAction`, `Test`), script de servidor ES5, script de cliente (`g_form.setMandatory`, `gsftSubmit`), ATF com `runServerSideScript` (Jasmine 3.1) e `impersonate`.

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 62dbed8 --repo app` → 7 arquivos mudados, **0 achados**.

**Evidências de execução (não reexecutadas; esta auditoria não toca a instância):**
- Instalação: linha 45 do `outputs/spec/sync-log.md`, `now-sdk-install` ok, commit `b4e03b3cdcce…`, 1009 registros.
- Recibo ATF `outputs/spec/auditorias/atf/US-MOD-UX-003.json`: commit `b4e03b3cdcce…`, 2 de 2 testes com status `success`.
- Isenção dos validadores com modelo de linguagem: `outputs/spec/auditorias/_isencoes/US-MOD-UX-003-g3.md` (story fora do fio condutor; build, instalação e ATF presentes).

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| `ContatoLigacao.registrar()` e `_recusaBasica()` (`ContatoLigacao.server.js`) | Mesmo arquivo; `encerrar` reaproveita `_recusaBasica` e `_recusar`; a linha de `ROTULO_STATUS` foi reescrita (linha 35) | médio |
| UI Action «Registrar ligação» (`ui-actions/contato.now.ts:8-45`) | Mesmo form e mesmo arquivo; os dois botões mexem em `setMandatory` dos mesmos campos | médio |
| Filtro «Minha lista» (design, linha 266 de `ux-cobranca-v1.md`) | O teste reproduz o filtro à mão para provar que o contato sai da lista | baixo |
| Suíte `cob-regressao` (`tests/suite.now.ts`) | Dois testes novos na lista | baixo |
| ACL do contato (`security/contato.now.ts`, da US-MOD-UX-002) | O botão grava por `contato.update()` e depende destas ACL | médio |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade com o contrato e com CA/RN; segurança (carteira, gravação por outros caminhos, validação do motivo); teste de mesa nos caminhos do botão; bugs técnicos no ES5 novo; testes ATF; observabilidade; regressão nos vizinhos.

**Não auditado (e por quê):**
- ACL de linha do contato por dono: N/A, é da US-MOD-UX-006.
- Performance: N/A. Uma leitura e um `update` por clique, sem laço nem consulta em massa.
- Injeção, segredo exposto, rate limit, SSRF, prompt injection: N/A. O único dado do usuário é o motivo, validado contra uma lista fixa; não há consulta montada com texto, segredo, URL externa nem modelo de linguagem.
- Prints da TEL-035: vêm no fim da fase.
- O conteúdo dos arquivos modificados e não commitados na árvore: fora do commit auditado.

## 4. Conformidade

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| 🔴3 (v1.1): verbo como UI Action cliente + servidor, `g_form.setMandatory` + `gsftSubmit` + guarda `typeof window` | `ui-actions/contato.now.ts:58-68` | ✅ PASS | |
| 🔴3: revalidação no servidor com `{ok, mensagem}`, `condition`, `roles`, `actionName` | `ui-actions/contato.now.ts:50`, `:53-54`, `:70-79`; `ContatoLigacao.server.js:102-117` | ✅ PASS | |
| `servicenow-ui.md`: depois de atualizar, `action.setRedirectURL(current)` | `ui-actions/contato.now.ts:78` | ✅ PASS | |
| Nó da task: `nowId` `RF-MOD-UX-003_ua_encerrar_contato` em `ui-actions/contato.now.ts` | `ui-actions/contato.now.ts:48` | ✅ PASS | |
| Nó da task: botão só com `status != encerrado`, para o papel atendente | `ui-actions/contato.now.ts:53-54` | ✅ PASS | Inclui o coordenador (consistente com o contexto do nó e com «Registrar ligação»); o admin do app não vê o botão, como no verbo da US-MOD-UX-002 |
| RN-NOVO-UX-005, passo 1: conferir dono e status | `ContatoLigacao.server.js:103`, `:164-175` | ⚠️ PARCIAL | Confere o dono pelo valor que veio do form (SEC-001) |
| RN-NOVO-UX-005, passo 2: exigir motivo; mensagem `SEM_MOTIVO` exata | `ContatoLigacao.server.js:33`, `:107-110` | ⚠️ PARCIAL | Texto exato; a validação aceita nomes herdados do objeto (BUG-002) |
| RN-NOVO-UX-005, passo 3: status encerrado e próxima ação vazia | `ContatoLigacao.server.js:111-114` | ✅ PASS | Mas o retorno do `update()` não é conferido (BUG-001) |
| RN: contato já encerrado recusa com «Operação recusada: contato já encerrado.» | `ContatoLigacao.server.js:29`, `:171` | ✅ PASS | |
| RN: contato some de «Minha lista» | `ContatoLigacao.server.js:111`, `:113` | ✅ PASS | Status ≠ encerrado e próxima ação vazia ou vencida é o filtro do design; o `encerrado` sai |
| RN: motivo obrigatório «no cliente e no servidor» | `ui-actions/contato.now.ts:62`; `ContatoLigacao.server.js:107-110` | ⚠️ PARCIAL | Vale pelo botão. Outros caminhos de gravação não exigem motivo (SEC-002) |
| Motivos: regularizado, contato realizado, sem contato, recusa, outro | `ContatoLigacao.server.js:34`; `tables/contato.now.ts:31-37` | ✅ PASS | O texto do design (linha 121) lista 4 valores; vale a RN e o modelo, com 5 |
| Mensagem de sucesso com o rótulo do motivo | `ContatoLigacao.server.js:116` | ✅ PASS | |
| Logs: `gs.info` no fim, `gs.warn` na recusa, `gs.error` na falha, sem `console.log` | `ContatoLigacao.server.js:115`, `:183` | ⚠️ PARCIAL | Sem `gs.error`; origem do `gs.warn` com o código errado (BUG-001, OBS-001) |
| Sem consulta GlideRecord em laço; sem `console.log` | todo o delta | ✅ PASS | O laço do ATF é só montagem de massa |
| Só dado fictício nos testes | `tests/US-MOD-UX-003.now.ts:21-23`, `:75`, `:79` | ✅ PASS | Contribuintes `ficticio=true`, nomes «Contribuinte fictício UX-003 …» |
| Não editar à mão arquivos gerados | `generated/keys.ts` | ✅ PASS | Gerado pelo build |
| Padrão de código do projeto | `ContatoLigacao.server.js:35` | ⚠️ PARCIAL | `ROTULO_STATUS ={` perdeu o espaço (CONF-001) |

**CA da US cumpridos?** Sim, os dois, com ressalva de teste.
- **AC-RF-MOD-UX-003-01** (encerrar sem motivo não é aceito e o atendente vê o motivo da recusa): cumprido. O cliente marca o campo como obrigatório (`ui-actions/contato.now.ts:62`) e o servidor recusa com «Operação recusada: informe o motivo de encerramento.» (`ContatoLigacao.server.js:109`); a UI Action mostra a mensagem e aborta (`:75-76`). Testado só no servidor, `tests/US-MOD-UX-003.now.ts:148-153` (TEST-001).
- **AC-RF-MOD-UX-003-02** (o contato encerrado sai de «Minha lista»): cumprido e testado com o filtro do design, `tests/US-MOD-UX-003.now.ts:63-67`, `:69-79`.

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] O dono do contato é conferido pelo valor do form, não pelo gravado — MÉDIO** · CVSS 5.4 (AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N) · OWASP A01 (Broken Access Control) · CWE-639 · STRIDE E (elevação de privilégio)
> Arquivo: `app/src/server/contato/ContatoLigacao.server.js:103`, `:168` com `app/src/fluent/ui-actions/contato.now.ts:71` · Contexto: botão «Encerrar» no form de `x_2326104_cob_contato`
> **Problema:** o botão passa `current` (o registro com o que o usuário digitou no form) para `encerrar`, e `_recusaBasica` chama `podeVer(contato, 'atendente')` nesse valor. Quem abre o contato de outro atendente e põe o próprio nome em «Atendente» passa na checagem e encerra o contato alheio. É o mesmo ponto já registrado como SEC-002 na auditoria da US-MOD-UX-002; esta US herda o defeito porque reaproveita `_recusaBasica` e o delta não o corrige.
> **Risco:** um atendente tira da lista do colega, com motivo falso, um contato que ainda tem trabalho; o motivo vai para os relatórios da coordenação. A tabela tem `audit: true`, então a ação fica rastreável. Hoje a leitura e a gravação do contato alheio já são possíveis porque a ACL de dono é da US-MOD-UX-006.
> **Fix:** em `_recusaBasica`, reler o contato do banco (`new GlideRecord(...).get(sys_id)`) e conferir o dono nesse registro; recusar quando `atendente` mudou para quem não é coordenador nem admin. Um fix único serve a «Registrar ligação» e a «Encerrar».
> **TDD RED:** como `demo.atendente`, ler um contato de outro atendente, `setValue('atendente', <eu>)` e chamar `encerrar(c, 'outro')`: hoje devolve `ok: true`. **TDD GREEN:** devolve `ok: false` com «Operação recusada: atendente vê só a própria carteira.» e o contato segue aberto.
> GAP recomendado: o mesmo GAP do SEC-002 da US-MOD-UX-002, ou critério da US-MOD-UX-006.

> **[SEC-002] Encerrar sem motivo é possível por outros caminhos de gravação — MÉDIO** · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A04 (Insecure Design) / A01 · CWE-840 (regra de negócio contornável) · STRIDE T
> Arquivo: `app/src/server/contato/ContatoLigacao.server.js:107-114` (a regra só vive em `encerrar`) com `app/src/fluent/security/contato.now.ts:17-25` (ACL de campo `*` libera a gravação de `status`) · Contexto: lista, form «Atualizar» e Table API de `x_2326104_cob_contato`
> **Problema:** o nó da task diz que o motivo é «obrigatório no cliente e no servidor» e que a gravação por script sem motivo é recusada. Isso vale para quem chama `encerrar`. Nada no servidor impede que `status` vire `encerrado` sem motivo por edição de lista, por «Atualizar» ou pela API: nenhuma Business Rule (regra que roda no servidor ao gravar) confere o par status e motivo, e a ACL de campo `*` deixa o atendente gravar `status`.
> **Risco:** contatos saem da lista sem motivo, e o relatório que o design promete à coordenação («saiba por que cada item saiu») fica com buracos. A trilha de auditoria registra quem fez.
> **Fix:** Business Rule `before update` em `x_2326104_cob_contato` que recusa `status` indo a `encerrado` com `motivo_encerramento` vazio (mensagem `SEM_MOTIVO`) e recusa mudança de `encerrado` para outro status por quem não é coordenador ou admin; junto, o fix da ACL de campo registrado no SEC-001 da US-MOD-UX-002.
> **TDD RED:** como `demo.atendente` com `GlideRecordSecure`, `setValue('status','encerrado')` sem motivo e `update()`: hoje grava. **TDD GREEN:** a gravação é recusada e o status segue `a_ligar`; `encerrar(c,'recusa')` continua funcionando.
> GAP recomendado: novo GAP em `outputs/spec/gaps-document.md` (o último hoje é GAP-148) ou critério da US-MOD-UX-006, junto com o SEC-001 da US-MOD-UX-002.

## 6. Testes de mesa (vetores no delta)

Rastreei o botão com os contatos fictícios do seed do `demo.atendente`.

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR pelo verbo, sem mexer no campo «Atendente» | «Encerrar» em contato de outro atendente | ✅ BLOQUEADO | `ContatoLigacao.server.js:168` devolve «atendente vê só a própria carteira»; a UI Action aborta (`ui-actions/contato.now.ts:75-76`) |
| IDOR pelo verbo, trocando «Atendente» no form | mesmo caso, com o próprio nome no campo | ❌ VULNERÁVEL (MÉDIO) | SEC-001 |
| IDOR pela leitura e pela gravação direta do contato | form, lista e Table API | N/A | ACL de dono é da US-MOD-UX-006 |
| Auth bypass / escalada de papel | usuário sem papel do app aciona o verbo | ✅ BLOQUEADO | `roles` da ação (`ui-actions/contato.now.ts:53`) e `_temPapel()` (`ContatoLigacao.server.js:168`, `:177-180`); o Script Include não é chamável pelo navegador (`clientCallable: false`, da US-MOD-UX-002) |
| Mass assignment | campos do contato editados no form e gravados junto com o botão | ❌ VULNERÁVEL (MÉDIO) | `contato.update()` (`:114`) leva junto o que o usuário alterou à mão; mesma causa do SEC-001 da US-MOD-UX-002 e do SEC-002 desta US |
| Contornar a regra do motivo por outro caminho | `status=encerrado` por lista, «Atualizar» ou API | ❌ VULNERÁVEL (MÉDIO) | SEC-002 |
| Valor de motivo fora da lista (form adulterado) | motivo `constructor` ou `toString` | ⚠️ aceito | `ContatoLigacao.server.js:108` testa `MOTIVOS[motivo]`, que acha nomes herdados do objeto (BUG-002) |
| Injeção | campo de motivo | ✅ BLOQUEADO | o valor só entra por `setValue` e a mensagem usa o rótulo do mapa; nenhuma consulta montada com ele |
| Exposição de dado em mensagem/log | mensagens e `gs.info` | ✅ BLOQUEADO | só sys_id do contato, usuário e código do motivo (`:115`, `:183`); sem CPF, CNPJ ou nome |
| Encerrar duas vezes | mesmo contato duas vezes | ✅ BLOQUEADO | `:171` recusa; testado em `tests/US-MOD-UX-003.now.ts:155-160` |
| Race condition | dois envios simultâneos do mesmo contato | ⚠️ baixo | os dois chegam ao mesmo estado final; só o motivo da segunda gravação prevalece; sem perda de dado financeiro |
| Segredo exposto, rate limit, SSRF, prompt injection | — | N/A | nada disso existe no delta |

## 7. Findings de Performance

Nenhum. Uma leitura e uma gravação por clique; sem laço, sem consulta em massa.

## 8. Findings de Bugs Técnicos

**[BUG-001] Gravação do contato sem conferência; sucesso falso se a gravação falhar — BAIXO** · ES5 · `app/src/server/contato/ContatoLigacao.server.js:114-116`
Cenário: `contato.update()` roda sem checar o retorno. Se uma regra de gravação ou uma ACL recusar, o servidor registra o `gs.info` de sucesso e mostra «Contato encerrado: …», mas o contato continua aberto.
Consequência: o atendente acredita que encerrou e o contato volta na lista; sem `gs.error` para quem investiga. Hoje não há regra que aborte o `update` desta tabela, mas as US-MOD-UX-004 e US-MOD-UX-006 acrescentam regras nela. O mesmo defeito foi achado em `registrar()` na US-MOD-UX-002 (BUG-002); a árvore tem uma correção não commitada para o `registrar`, que não cobre `encerrar`.
Fix: `if (!contato.update()) { gs.error('RF-MOD-UX-003_ua_encerrar_contato: contato não gravado; contato ' + sys_id); return {ok:false, mensagem: 'O contato não foi encerrado. Confira a mensagem acima e tente de novo.'}; }`.

**[BUG-002] Validação do motivo aceita nomes herdados do objeto — BAIXO** · ES5 · `app/src/server/contato/ContatoLigacao.server.js:108`
Cenário: `ContatoLigacao.MOTIVOS[motivo]` é verdadeiro para `constructor`, `toString` e outros nomes que todo objeto herda. Um form adulterado que envie `motivo_encerramento=constructor` passa pela validação; o `setValue` grava um valor fora da lista de opções e a mensagem de sucesso concatena o texto de uma função.
Consequência: dado fora do domínio no campo de motivo e mensagem sem sentido. Exige adulterar a requisição; sem ganho de acesso.
Fix: `Object.prototype.hasOwnProperty.call(ContatoLigacao.MOTIVOS, motivo)`. TDD RED: `encerrar(c, 'constructor')` hoje devolve `ok: true`; GREEN: devolve `ok: false` com a mensagem `SEM_MOTIVO`.

## 9. Testes

**CA viraram teste?** AC-02 sim, no servidor, com o filtro de «Minha lista» (`tests/US-MOD-UX-003.now.ts:63-67`, `:69-79`). AC-01 sim no servidor (`:148-153`); a parte do cliente (campo obrigatório, mensagem na tela) não tem teste.
**TDD RED/GREEN presente?** Sim para as regras: cada regra tem lado positivo e negativo (com motivo; sem motivo; já encerrado). Os testes impersonam `demo.atendente` e usam `GlideRecordSecure` para reler, então a ACL de leitura entra no caminho. Recibo: 2 de 2 verdes no commit auditado.
**Cobertura do delta:** boa em `encerrar()` chamado direto; fraca no que só existe na UI Action.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `US-MOD-UX-003.now.ts` — `t_ux003_pos` | sim (motivo «regularizado»: status, motivo, próxima ação vazia, sai de «Minha lista», mensagem exata) | — | bom; confere o estado relido do banco e o filtro oficial do design |
| `t_ux003_neg` | — | sim (sem motivo; contato já encerrado, motivo da primeira vez preservado) | bom; confere que nada muda |

**[TEST-001] Nenhum teste de form: o botão e o campo obrigatório ficam sem cobertura — MÉDIO** · `app/src/fluent/tests/US-MOD-UX-003.now.ts` (arquivo inteiro) e `app/src/fluent/ui-actions/contato.now.ts:58-79`
O que só a UI Action faz fica sem teste: marcar o motivo como obrigatório, soltar a obrigatoriedade de resultado e comentários, ler `motivo_encerramento` do `current`, abortar e mostrar a mensagem. A US-MOD-UX-002 ao menos testa a visibilidade do botão (`uiActionVisibility`); aqui não há nem isso, então «o botão não aparece em contato encerrado» (`condition`, linha 54) nunca é provado. Se `current.getValue('motivo_encerramento')` vier vazio nesse ponto, todo encerramento pela tela seria recusado e os 2 testes de servidor seguiriam verdes. Fix: um ATF de form que abra o contato e confira a visibilidade do botão (visível em «Ligado», oculto em «Encerrado»), e um que clique «Encerrar» com e sem motivo e valide o estado e a mensagem.

**[TEST-002] Faltam negativos e o lado do coordenador — BAIXO** · `app/src/fluent/tests/US-MOD-UX-003.now.ts:148-160`
Faltam: motivo fora da lista (cobriria o BUG-002), atendente encerrando contato de outro atendente (cobriria o SEC-001), usuário sem papel do app, e o coordenador encerrando (o botão e a regra valem para ele). Fix: acrescentar 3 ou 4 `it` ao `t_ux003_neg` e ao `t_ux003_pos`.

## 10. Observabilidade

Os logs trazem o código do requisito, o sys_id do contato e do usuário. Nenhum leva nome, documento ou texto livre do contribuinte.

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Contato encerrado | sim, `gs.info` com contato, motivo e usuário (`ContatoLigacao.server.js:115`) | tabela com `audit: true`; o contato encerrado e o motivo são o registro de negócio | — |
| Encerramento recusado (sem motivo, carteira, já encerrado) | sim, `gs.warn` (`ContatoLigacao.server.js:183`), mas com a origem `RF-MOD-UX-002` | — | OBS-001 |
| Gravação do contato falhou | não | — | coberto por BUG-001 |

**[OBS-001] Recusa do encerramento é logada com a origem da US-MOD-UX-002 — BAIXO** · `app/src/server/contato/ContatoLigacao.server.js:183`
O nó da task manda o `gs.warn` da recusa trazer `RF-MOD-UX-003_ua_encerrar_contato`, para contar as recusas do botão na métrica. `_recusar` é comum aos verbos e escreve sempre `RF-MOD-UX-002`, então a contagem de recusas de «Encerrar» no log de sistema não existe. Fix: `_recusar` receber a origem como parâmetro (`encerrar` passa `RF-MOD-UX-003_ua_encerrar_contato`).

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| `ContatoLigacao.registrar()` | Não. Só constantes e o método novo foram acrescentados; o corpo não mudou | diff de `ContatoLigacao.server.js`: nenhuma linha de `registrar` tocada |
| `ROTULO_STATUS` | Sem impacto de comportamento; só o espaço antes de `{` sumiu | `ContatoLigacao.server.js:35` (CONF-001) |
| UI Action «Registrar ligação» | Não. O arquivo só ganhou a segunda ação; as duas usam `actionName` diferente e cada uma solta a obrigatoriedade do que não é seu (`:21-23` e `:60-62`) | `ui-actions/contato.now.ts` |
| Contato encerrado não aceita nova ligação | Mantido: `registrar` usa o mesmo `_recusaBasica` (`:171`) e a US-MOD-UX-002 já testa o caso | `tests/US-MOD-UX-002.now.ts` (`t_ux002_neg`) |
| Suíte `cob-regressao` | Inclui os 2 testes novos; os testes da US-MOD-UX-002 não foram reexecutados nesta US (o recibo cobre só os 2 da US-MOD-UX-003) | `tests/suite.now.ts:18`, `:34`; recibo ATF |
| ACL do contato | Sem mudança neste delta; limitações herdadas ficam em SEC-001 e SEC-002 | `security/contato.now.ts` |

**CONF-001 — BAIXO** · `app/src/server/contato/ContatoLigacao.server.js:35`: `ROTULO_STATUS ={` ficou sem o espaço antes da chave, quebrando o padrão da linha e do arquivo. Corrigir junto com qualquer outra edição do arquivo.

**Nota de processo (sem peso no veredito):** no commit auditado o marcador `outputs/spec/em-andamento.md` ainda diz `us: US-MOD-UX-002` e `proximo-passo: implementar TASK-MOD-UX-002-01`. Esta auditoria não o apagou nem o alterou, como instruído; quem fecha a US deve apagá-lo e commitar a remoção.

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

A US entrega o pedido: o botão «Encerrar» existe com as regras de cliente e servidor do design, o motivo é validado no servidor com a mensagem exata, o status, o motivo e a próxima ação são gravados como a regra manda, o contato sai de «Minha lista» e contato encerrado recusa novo encerramento. Os dois testes passam na instância. Os achados são médios e baixos. Os dois de segurança vêm da camada de acesso do contato (ACL de campo `*` e checagem de dono sobre o valor do form), já abertos na US-MOD-UX-002 e com destino na US-MOD-UX-006; a lacuna própria desta US é a falta de teste de form.

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-001 (MÉDIO) | `app/src/server/contato/ContatoLigacao.server.js:103`, `:168` | Conferir o dono pelo valor gravado (reler o contato) e recusar troca de `atendente` por quem não é coordenador nem admin; um fix serve aos dois verbos | `outputs/spec/gaps-document.md` (mesmo GAP do SEC-002 da US-MOD-UX-002) ou critério da US-MOD-UX-006 |
| 2 | SEC-002 (MÉDIO) | `ContatoLigacao.server.js:107-114`; `app/src/fluent/security/contato.now.ts:17-25` | Business Rule que recusa `status=encerrado` sem motivo e a reabertura por atendente; ACL de campo só para os campos editáveis | `outputs/spec/gaps-document.md` (novo GAP) ou US-MOD-UX-006 |
| 3 | TEST-001 (MÉDIO) | `app/src/fluent/tests/US-MOD-UX-003.now.ts` | ATF de form: visibilidade do botão (visível em «Ligado», oculto em «Encerrado») e clique com e sem motivo | `outputs/spec/gaps-document.md` |
| 4 | BUG-001 (BAIXO) | `ContatoLigacao.server.js:114-116` | Conferir o retorno de `update()`; `gs.error` e `{ok:false}` se falhar | débito técnico |
| 5 | BUG-002 (BAIXO) | `ContatoLigacao.server.js:108` | `hasOwnProperty` no teste do motivo | débito técnico |
| 6 | TEST-002 (BAIXO) | `tests/US-MOD-UX-003.now.ts:148-160` | Negativos: motivo fora da lista, contato de outro atendente, sem papel; positivo do coordenador | débito técnico |
| 7 | OBS-001 (BAIXO) | `ContatoLigacao.server.js:183` | A recusa levar a origem `RF-MOD-UX-003_ua_encerrar_contato` | débito técnico |
| 8 | CONF-001 (BAIXO) | `ContatoLigacao.server.js:35` | Restaurar o espaço em `ROTULO_STATUS = {` | débito técnico |

> O marcador `outputs/spec/em-andamento.md` não foi apagado por esta auditoria, por instrução; a remoção e o commit ficam com quem fecha a US. Esta auditoria também não gravou GAP no `gaps-document.md`; a coluna «Onde registrar» é a recomendação.

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@b4e03b3
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
