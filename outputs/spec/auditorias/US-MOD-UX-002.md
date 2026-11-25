# Auditoria de Entrega — [US-MOD-UX-002] Registrar ligação no contato da lista

- **User Story:** US-MOD-UX-002 (nó `STORY-MOD-UX-002` no `outputs/spec/tasks.json`, sem label `fio-condutor`) — RF-MOD-UX-002 · Registrar ligação no contato da lista
- **Features/IDs cobertos:** RF-MOD-UX-002 · RN-NOVO-UX-003 (tabela de decisão do registro de ligação) · RN-NOVO-UX-004 (interação aponta para um contato ou para um caso, nunca os dois nem nenhum) · AC-RF-MOD-UX-002-01..03 · tasks TASK-MOD-UX-002-01 e TASK-MOD-UX-002-02 · tela TEL-035 (Contato da lista)
- **Branch/commit auditado:** `feat/v0` @ `62dbed8` (delta `f78bd09..62dbed8 -- app/`; `f78bd09` abriu a US)
- **Data:** 2026-11-24
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Contrato usado.** A autoridade é o design `docs/designs/ux-cobranca-v1.md`, e a seção final «Revisão EGM e decisões finais (v1.1)» prevalece sobre o resto do texto: decisões R1 a R8, a tabela de decisão «Registrar ligação» e as correções obrigatórias 🔴3 (verbo como UI Action cliente + servidor) e 🔴4 (interação com um pai só, dono pelo contato ou pelo caso). Junto, o nó da US no `tasks.json` (critérios, regras e mensagens) e os guardrails do `CLAUDE.md`, de `.claude/rules/harness/security.md` e de `.claude/rules/harness/servicenow-ui.md`.

> **Fora deste delta, por desenho.** A ACL de leitura e de gravação do contato por dono (o atendente só lê e grava os próprios contatos) e o bloqueio do caso qualificado para o atendente são da US-MOD-UX-006 (`TASK-MOD-UX-006-01`). Esta auditoria marca esses pontos como N/A e cita a US. Os prints da TEL-035 saem no fim da fase e não foram exigidos aqui.

> **Ponto conhecido e aceito.** A tabela `x_2326104_cob_contato` não tem campo de anotação. O botão usa o campo «Comentários» (`comentarios`, um campo de diário: cada gravação acrescenta uma entrada com autor e hora) como entrada da anotação, e a interação recebe esse texto em `descricao`. Isto cumpre «anotação obrigatória no cliente e no servidor» do design e não é tratado como desvio.

---

## 1. Inventário do delta

O delta põe no form do contato um botão «Registrar ligação». No navegador, o botão torna obrigatórios o resultado e a anotação e envia o form. No servidor, a classe `ContatoLigacao` confere quem pode, exige resultado e anotação, cria a interação ligada ao contato, soma 1 em tentativas e aplica a tabela de decisão do design. Uma Business Rule nova (regra que roda no servidor antes de gravar) recusa interação sem contato e sem caso, ou com os dois. As regras de carteira passam a aceitar o contato como dono da interação.

**Arquivos tocados pela US (12, todos em `app/`):**

| Arquivo | Papel |
|---|---|
| `app/src/server/contato/ContatoLigacao.server.js` (novo, 169 linhas) | Script Include (classe de servidor reutilizável) com `registrar()` (o verbo), `decidir()` (tabela de decisão pura, sem gravar), `motivoRecusaInteracao()` (regra de um pai só) e as recusas comuns (contato inexistente, de outra carteira, encerrado) |
| `app/src/fluent/script-includes/contato-ligacao.now.ts` (novo) | Registra `ContatoLigacao` como `package_private` e não chamável pelo navegador (`clientCallable: false`) |
| `app/src/fluent/ui-actions/contato.now.ts` (novo, 45 linhas) | UI Action (botão do form) «Registrar ligação», cliente + servidor, com `condition`, `roles` e `actionName` |
| `app/src/fluent/business-rules/interacao.now.ts` (novo) | Business Rule `before insert/update` em `x_2326104_cob_interacao`, order 50, que chama `interacaoUmPai.server.js` |
| `app/src/server/contato/interacaoUmPai.server.js` (novo) | Corpo da regra: recusa com a mensagem da RN-NOVO-UX-004 e registra `gs.warn` |
| `app/src/fluent/security/contato.now.ts` (novo, 34 linhas) | 3 ACL (regras de acesso da plataforma) do contato: gravar a linha, gravar os campos (`*`) e criar |
| `app/src/fluent/security/carteira.now.ts` | As 3 ACL de leitura, criação e gravação da interação passam a aceitar `contato.atendente` além de `caso.coordenador` como dono |
| `app/src/server/carteira/recusarInteracaoForaDaCarteira.server.js` | Regra de gravação da interação com o mesmo par de donos; o log ganha o `sys_id` do contato |
| `app/src/server/carteira/restringirConsultaCarteira.server.js` | Mapa `DONO` da interação passa a `['contato.atendente', 'caso.coordenador']` (filtro de consulta do atendente) |
| `app/src/fluent/tests/US-MOD-UX-002.now.ts` (novo, 482 linhas) | 6 testes ATF (Automated Test Framework, testes automáticos que rodam na instância): 5 de servidor e 1 de form |
| `app/src/fluent/tests/suite.now.ts` | Inclui os 6 testes na suíte `cob-regressao` |
| `app/src/fluent/generated/keys.ts` | Chaves geradas pelo build (946 linhas, só ids dos objetos e passos de ATF novos) |

**Endpoints alterados/criados:** nenhuma rota REST nova. Um caminho novo de gravação: o botão «Registrar ligação» (`actionName` `x_cob_registrar_ligacao`) no form de `x_2326104_cob_contato`. As tabelas `contato` e `interacao` continuam com `allowWebServiceAccess: true` (Table API aberta pelo scaffold), então as ACL novas valem também por API.
**Entidades/modelos tocados:** `x_2326104_cob_contato` (grava `ultimo_resultado`, `tentativas`, `status`, `proxima_acao_em`, `motivo_encerramento`, `comentarios`); `x_2326104_cob_interacao` (cria registro com `contato`, `atendente`, `tipo`, `resultado`, `descricao`, `ocorrida_em`, `retorno_em`). Nenhum campo novo no modelo.
**Stack envolvido no delta:** app escopado `x_2326104_cob`, Fluent `@servicenow/sdk` (`UiAction`, `ScriptInclude`, `BusinessRule`, `Acl`, `Test`); script de servidor ES5 (`Class.create`, `GlideRecord`, `GlideDateTime.addDaysLocalTime`, `gs.hasRole`); script de cliente com `g_form.setMandatory` e `gsftSubmit`; ATF com `runServerSideScript` (Jasmine 3.1), `impersonate`, `openExistingRecord` e `uiActionVisibility`.

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo f78bd09 --repo app` → 13 arquivos varridos, **0 achados** (exit 0). A varredura vai até o HEAD do ramo; o 13º arquivo vem do commit seguinte (`318ae01`, só recibo e isenções).

**Evidências de execução (não reexecutadas por esta auditoria):**
- Instalação na instância: linha 44 do `outputs/spec/sync-log.md`, `now-sdk-install` ok, commit `62dbed8`, 1009 registros.
- Recibo ATF `outputs/spec/auditorias/atf/US-MOD-UX-002.json`: commit `62dbed8`, 6 de 6 testes com status `success`.
- Isenção dos validadores com modelo de linguagem: `outputs/spec/auditorias/_isencoes/US-MOD-UX-002-g3.md` (story fora do fio condutor; build, instalação e ATF continuam obrigatórios e estão presentes).

## 2. Mapa de regressão leve

O delta mexe em três pontos que outras stories usam: a classe da carteira, as ACL da interação e o mapa de dono da consulta.

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| `CarteiraAtendente.podeVer()` (`app/src/server/carteira/CarteiraAtendente.server.js`) | Passa a receber lista de campos de dono nas ACL da interação | médio |
| ACL de leitura, criação e gravação da interação (`app/src/fluent/security/carteira.now.ts:36-44`, `:173-192`) | Dono muda de `caso.coordenador` para `contato.atendente` ou `caso.coordenador` | alto |
| Regra de consulta da interação (`restringirConsultaCarteira.server.js:8`) | Filtro do atendente passa a usar o contato | médio |
| Testes da US-MOD-F5-007 e F5-003 na suíte `cob-regressao` | Provavam a carteira pelo caso; a migração é da US-MOD-UX-006 (`TASK-MOD-UX-006-02`) | médio |
| Form TEL-035 (`app/src/fluent/ui/TEL-035.now.ts`) | Recebe o botão; nenhum campo do form mudou | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade com o contrato e com os critérios e regras da US; segurança (autorização por dono, gravação de campos, código de servidor chamado pela tela); teste de mesa nos caminhos reais do botão e da regra; bugs técnicos no ES5 novo; testes ATF; observabilidade (logs novos); regressão nos vizinhos da seção 2.

**Não auditado (e por quê):**
- ACL de leitura e gravação do contato por dono e bloqueio do caso para o atendente: N/A, são da US-MOD-UX-006 (`TASK-MOD-UX-006-01`).
- Reescrita dos testes F5-003 e F5-007 para o coordenador como dono do caso: N/A, `TASK-MOD-UX-006-02`.
- Verbo «Encerrar contato»: N/A, US-MOD-UX-003 (o comentário de `ContatoLigacao` o cita, mas o código não está neste delta).
- Performance: o verbo faz 1 inserção e 1 atualização, sem laço nem consulta em massa. Nada a medir além da leitura.
- Injeção, segredo exposto, rate limit, SSRF, prompt injection: N/A. Não há consulta montada com texto do usuário, segredo, rota pública, URL externa nem modelo de linguagem no delta.
- Prints da TEL-035: tirados no fim da fase, por combinação com quem implementou.

## 4. Conformidade

Verificado contra o design UX v1 (seção v1.1 prevalece), o nó da US no `tasks.json` e os guardrails.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| 🔴3: verbo como UI Action cliente + servidor, `g_form.setMandatory` + `gsftSubmit` + guarda `typeof window` | `app/src/fluent/ui-actions/contato.now.ts:19-29` | ✅ PASS | |
| 🔴3: revalidação no servidor com `{ok, mensagem}`, `condition`, `roles`, `actionName` | `ui-actions/contato.now.ts:11-15`, `:31-43`; `ContatoLigacao.server.js:42-89` | ✅ PASS | |
| `servicenow-ui.md`: depois de atualizar, `action.setRedirectURL(current)` | `ui-actions/contato.now.ts:43` | ✅ PASS | |
| Tabela de decisão, linha 1: promessa → ligado, retorno ou hoje + 7 | `ContatoLigacao.server.js:100-102` | ✅ PASS | |
| Linhas 2 e 3: contato efetivo com retorno → retornar; sem retorno → encerrado, motivo `contato_realizado` | `ContatoLigacao.server.js:103-107` | ✅ PASS | |
| Linhas 4 e 5: sem contato, tentativas após somar 1 < 3 → retornar amanhã; ≥ 3 → encerrado, motivo `sem_contato` | `ContatoLigacao.server.js:57`, `:108-112` | ✅ PASS | |
| Linha 6: recusa → encerrado, motivo `recusa` | `ContatoLigacao.server.js:113-115` | ✅ PASS | |
| Anotação obrigatória no cliente e no servidor | `ui-actions/contato.now.ts:23`; `ContatoLigacao.server.js:49`, `:54-56` | ✅ PASS | Pelo campo «Comentários», ponto conhecido |
| Algoritmo da RN-NOVO-UX-003, passo 1: conferir papel e dono do contato | `ContatoLigacao.server.js:140`, `:149-152` | ⚠️ PARCIAL | Confere o dono pelo valor que veio do form, não pelo gravado (SEC-002) |
| Mensagens `SEM_ANOTACAO`, `SEM_RESULTADO`, `CONTATO_ENCERRADO` com o texto exato do nó | `ContatoLigacao.server.js:25-27` | ✅ PASS | |
| 🔴4 / RN-NOVO-UX-004: exatamente um entre contato e caso, com a mensagem exata | `interacaoUmPai.server.js:3-7`; `ContatoLigacao.server.js:128-132` | ✅ PASS | |
| 🔴4: dono da interação = `contato.atendente` ou `caso.coordenador` no mapa `DONO`, nas ACL e nas BR da carteira | `restringirConsultaCarteira.server.js:8`; `security/carteira.now.ts:40`, `:179`, `:190`; `recusarInteracaoForaDaCarteira.server.js:4` | ✅ PASS | |
| `interacao.caso` deixa de ser obrigatório | `app/src/fluent/tables/interacao.now.ts:13` | ✅ PASS | Já estava no modelo antes do delta |
| Decisão do nó: BR «before insert/update, order 100» | `app/src/fluent/business-rules/interacao.now.ts:14` | ⚠️ PARCIAL | Está com order 50 (CONF-001) |
| Segurança na UI (RN-SN-145): proteção no servidor, não só no form | `ContatoLigacao.server.js:136-147`; BR da interação | ✅ PASS | |
| Script de servidor alcançável pela tela confere acesso antes de gravar (RN-SN-146) | `ContatoLigacao.server.js:44-47` | ✅ PASS | Usa `GlideRecord` com checagem explícita de papel e dono |
| ACL por operação no contato, com roles do app | `security/contato.now.ts:8-34` | ⚠️ PARCIAL | ACL de campo `*` libera ao atendente os campos que a tabela de decisão deveria controlar (SEC-001) |
| ATF: 1 por verbo do CUJ mais 1 negativo por ACL nova | `tests/US-MOD-UX-002.now.ts` | ⚠️ PARCIAL | Sem negativo para as 3 ACL novas do contato (TEST-002) |
| Logs com `gs.info`/`gs.warn`/`gs.error`, sem `console.log` | `ContatoLigacao.server.js:75`, `:87`, `:155`; `interacaoUmPai.server.js:5` | ✅ PASS | |
| Sem consulta dentro de laço | todo o delta | ✅ PASS | |
| Só dado fictício nos testes | `tests/US-MOD-UX-002.now.ts:23-25` e equivalentes | ✅ PASS | Contribuintes marcados `ficticio`, nomes «Contribuinte fictício UX-002 …» |

**CA da US cumpridos?** Sim, os três.
- **AC-RF-MOD-UX-002-01** (registrar em no máximo 3 cliques a partir da lista): cumprido pela construção. Abrir o contato, escolher o resultado e clicar no botão; a anotação é digitação, sem diálogo intermediário. Nenhum teste clica o botão de ponta a ponta (TEST-001); a contagem fica confirmada pelos prints do fim da fase.
- **AC-RF-MOD-UX-002-02** (status, próxima ação e motivo seguem a tabela): cumprido, as 6 linhas testadas por ATF de servidor.
- **AC-RF-MOD-UX-002-03** (sem anotação, nada é registrado e o atendente vê o motivo): cumprido no servidor e no cliente, testado no servidor.

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] Atendente grava à mão os campos que a tabela de decisão deveria controlar — MÉDIO** · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A01 (Broken Access Control) · CWE-915 · STRIDE T (adulteração)
> Arquivo: `app/src/fluent/security/contato.now.ts:17-26` e `app/src/server/contato/ContatoLigacao.server.js:79-86` · Contexto: form TEL-035, lista e Table API de `x_2326104_cob_contato`
> **Problema:** a ACL de campo `*` dá ao atendente gravação em todos os campos do contato, inclusive `status`, `tentativas`, `motivo_encerramento`, `atendente` e `valor_em_aberto`. O form mostra todos editáveis (não há UI Policy no contato). Além do botão «Atualizar», o próprio «Registrar ligação» grava o registro do form inteiro: `contato.update()` leva junto qualquer campo que o atendente tenha mudado à mão.
> **Risco:** o atendente encerra um contato sem ligação, zera tentativas para fugir do encerramento na 3ª, troca o dono do contato ou altera o valor em aberto. O contato deixa de «andar sozinho» pela tabela de decisão (RN-NOVO-UX-003) e o indicador da lista fica sem confiança. A auditoria da tabela (`audit: true`) registra quem mudou, então a ação fica rastreável.
> **Fix:** trocar a ACL de campo `*` por ACL de campo só nos campos que o atendente pode editar (`comentarios`, `ultimo_resultado`, `proxima_acao_em`); deixar `status`, `tentativas`, `motivo_encerramento`, `atendente`, `contribuinte`, `ciclo`, `valor_em_aberto` e `prioridade` somente para coordenador e admin. O servidor (`ContatoLigacao`) continua gravando esses campos, porque `GlideRecord` no servidor não passa por ACL.
> **TDD RED:** como `demo.atendente`, `GlideRecordSecure` no próprio contato, `setValue('status','encerrado')` e `update()`: hoje grava. **TDD GREEN:** a mesma gravação é recusada e o status continua `a_ligar`; «Registrar ligação» continua mudando o status.
> GAP recomendado: novo GAP em `outputs/spec/gaps-document.md` (último hoje é GAP-148), com `SEC-NNN` proposto para o próximo ciclo.

> **[SEC-002] Checagem de dono do verbo lê o atendente que veio do form, não o gravado — MÉDIO** · CVSS 5.4 (AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:L/A:N) · OWASP A01 · CWE-639 (autorização por chave controlada pelo usuário) · STRIDE E (elevação de privilégio)
> Arquivo: `app/src/server/contato/ContatoLigacao.server.js:140` com `app/src/fluent/ui-actions/contato.now.ts:32` · Contexto: botão «Registrar ligação»
> **Problema:** no servidor, `current` já traz os valores que o usuário editou no form. `podeVer(contato, 'atendente')` compara o usuário logado com esse valor editado. Somado ao SEC-001 (campo `atendente` gravável pelo atendente), quem abre o contato de outro atendente põe o próprio nome em «Atendente», clica no botão e passa na checagem: a ligação é registrada e o contato muda de dono. A Business Rule de caso da US-MOD-F5-007 já resolveu o mesmo problema conferindo o dono «como estava gravado».
> **Risco:** hoje o atendente já consegue abrir e gravar contato alheio, porque a ACL de dono do contato é da US-MOD-UX-006. Depois da US-MOD-UX-006, esta checagem passa a ser a última barreira do verbo e continua contornável enquanto o form aceitar a troca de dono.
> **Fix:** em `_recusaBasica`, reler o contato do banco (`new GlideRecord(...).get(sys_id)`) e chamar `podeVer` nesse registro relido, porque a UI Action não recebe `previous`; e recusar quando `contato.atendente.changes()` for verdadeiro para quem não é coordenador nem admin. O fix do SEC-001 fecha o mesmo caminho pela ACL.
> **TDD RED:** como `demo.atendente`, ler um contato de outro atendente com `GlideRecord`, `setValue('atendente', <eu>)` e chamar `registrar()`: hoje devolve `ok: true`. **TDD GREEN:** devolve `ok: false` com «Operação recusada: atendente vê só a própria carteira.» e nenhuma interação é criada.
> GAP recomendado: mesmo GAP do SEC-001, ou registro na US-MOD-UX-006 como critério da ACL de dono.

## 6. Testes de mesa (vetores no delta)

Rastreei o caminho do botão e da regra com os dados do seed fictício (contatos de `demo.atendente`, contribuintes PJ fictícios).

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR (um atendente mexe no registro de outro) pelo verbo | «Registrar ligação» em contato de outro atendente, sem mexer no campo «Atendente» | ✅ BLOQUEADO | `ContatoLigacao.server.js:140` devolve «Operação recusada: atendente vê só a própria carteira.» e o form aborta (`ui-actions/contato.now.ts:40-41`) |
| IDOR pelo verbo com troca de dono no form | mesmo caso, trocando «Atendente» para si antes de clicar | ❌ VULNERÁVEL (MÉDIO) | SEC-002 |
| IDOR pela leitura e pelo «Atualizar» do contato | form, lista e Table API do contato | N/A | ACL de dono do contato é da US-MOD-UX-006 |
| IDOR na interação criada | interação nova com `contato` de outro atendente, por API | ✅ BLOQUEADO | ACL de criação e BR de gravação com `contato.atendente` (`security/carteira.now.ts:179`; `recusarInteracaoForaDaCarteira.server.js:4`) |
| Auth bypass / escalada de papel | usuário sem papel do app chama o verbo | ✅ BLOQUEADO | `roles` da UI Action (`ui-actions/contato.now.ts:14`) e `_temPapel()` no servidor (`ContatoLigacao.server.js:149-152`) |
| Criação de contato por atendente | criar contato pela lista ou API | ✅ BLOQUEADO | ACL create só coordenador e admin (`security/contato.now.ts:28-34`); sem ATF negativo (TEST-002) |
| Mass assignment | campos do contato editados no form e gravados junto com o verbo | ❌ VULNERÁVEL (MÉDIO) | SEC-001 |
| Script Include chamado pelo navegador | `ContatoLigacao` via GlideAjax | ✅ BLOQUEADO | `clientCallable: false`, `package_private` (`script-includes/contato-ligacao.now.ts:11-12`) |
| Injeção | anotação livre | ✅ BLOQUEADO | texto vai por `setValue`, cortado em 4000 (`ContatoLigacao.server.js:69`); nenhuma consulta montada com ele |
| Exposição de dado em mensagem | mensagens ao usuário | ✅ BLOQUEADO | só texto fixo e status; nenhum dado do contribuinte (`ContatoLigacao.server.js:25-31`, `:159-166`) |
| Race condition | dois envios do mesmo contato ao mesmo tempo | ⚠️ baixo | BUG-003 |
| Segredo exposto, rate limit, SSRF, prompt injection | — | N/A | nada disso existe no delta |

## 7. Findings de Performance

Nenhum. O verbo faz 1 `insert` e 1 `update` por clique; a regra de um pai só lê dois campos do registro corrente; as mudanças de carteira só trocam a lista de campos de dono.

## 8. Findings de Bugs Técnicos

**[BUG-001] Resultado pode vir da ligação anterior — MÉDIO** · ES5 servidor + cliente · `app/src/fluent/ui-actions/contato.now.ts:22` e `:33`
Cenário: o campo de entrada do resultado é `ultimo_resultado`, que já guarda o resultado da ligação anterior. Na segunda ligação do mesmo contato, o campo chega preenchido; o `setMandatory` do cliente passa sem o atendente escolher nada, e o servidor usa o valor antigo como resultado da ligação nova.
Consequência: se o atendente só escreve a anotação e clica, o contato anda pela linha errada da tabela (por exemplo, uma promessa antiga volta a «Ligado» com +7 dias quando a pessoa não atendeu).
Fix: no servidor, exigir `current.ultimo_resultado.changes()` quando o contato já tem tentativas (ou limpar o campo no carregamento do form por Client Script `onLoad` e manter a exigência no servidor); recusar com «Operação recusada: informe o resultado da ligação.».

**[BUG-002] Gravação do contato sem conferência depois da interação criada — BAIXO** · ES5 · `app/src/server/contato/ContatoLigacao.server.js:74-88`
Cenário: a interação é inserida primeiro; depois `contato.update()` roda sem conferir o retorno. Se uma regra de gravação do contato abortar (hoje não há, mas a US-MOD-UX-006 e o grupo de controle acrescentam regras nessa tabela), a interação fica gravada, o contato não anda e a mensagem diz «Ligação registrada».
Consequência: contradiz o comentário do próprio arquivo («nada é gravado pela metade», linha 17).
Fix: conferir o retorno de `contato.update()`; se falhar, apagar a interação criada (`i.deleteRecord()`), registrar `gs.error` e devolver `{ok:false, mensagem: MSG_NAO_GRAVOU}`.

**[BUG-003] Tentativas calculadas por leitura e escrita sem trava — BAIXO** · ES5 · `app/src/server/contato/ContatoLigacao.server.js:57`, `:80`
Cenário: dois envios quase simultâneos do mesmo contato (duas abas) leem o mesmo número de tentativas e gravam o mesmo valor.
Consequência: duas interações e só +1 em tentativas; o encerramento por «sem contato» atrasa uma ligação. Raro na operação de um atendente por contato.
Fix: aceitar como débito, ou recalcular tentativas pela contagem de interações do contato no momento de gravar.

**[BUG-004] Retorno no passado é aceito — BAIXO** · ES5 · `app/src/server/contato/ContatoLigacao.server.js:50`, `:100-105`
Cenário: o atendente informa «Retorno em» com data já passada.
Consequência: o contato vai a «Retornar» ou «Ligado» com próxima ação vencida e volta na hora para «Minha lista». Sem perda de dado; o design não proíbe.
Fix: recusar retorno anterior a hoje com mensagem própria, ou registrar no design que é aceito.

## 9. Testes

**CA viraram teste?** AC-02 sim (as 6 linhas da tabela, `tests/US-MOD-UX-002.now.ts:76-101`, `:173-192`, `:264-289`). AC-03 sim no servidor (`:362-371`). AC-01 só pela visibilidade do botão (`:444-482`), sem clique.
**TDD RED/GREEN presente?** Sim para as regras: cada regra tem lado positivo e negativo (sem anotação, sem resultado, contato encerrado, interação com dois pais e sem pai). Os testes impersonam `demo.atendente` e usam `GlideRecordSecure` para reler, então a ACL de leitura entra no caminho.
**Cobertura do delta:** boa em `ContatoLigacao.decidir()` e `registrar()` chamados direto; fraca no trecho que só existe na UI Action.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `US-MOD-UX-002.now.ts` — `t_ux002_promessa` | sim (com e sem retorno) | — | bom; confere status, tentativas, próxima ação, interação e atendente |
| `t_ux002_sem_contato` | sim (1ª e 3ª tentativa) | — | bom |
| `t_ux002_recusa_efetivo` | sim (recusa, efetivo com e sem retorno) | — | bom |
| `t_ux002_neg` | — | sim (sem anotação, sem resultado, encerrado) | bom; confere que nada muda e nenhuma interação nasce |
| `t_ux002_um_pai` | sim (só contato) | sim (dois pais, nenhum pai) | bom; roda como admin, adequado para a BR |
| `t_ux002_ui` | só visibilidade | não | fraco (TEST-001) |

**[TEST-001] Nenhum teste aperta o botão — MÉDIO** · `app/src/fluent/tests/US-MOD-UX-002.now.ts:444-482` e `app/src/fluent/ui-actions/contato.now.ts:31-43`
O que só a UI Action faz fica sem teste: ler a anotação do campo de diário `comentarios` com `getValue`, decidir se houve retorno por `proxima_acao_em.changes()`, abortar o form e mostrar a mensagem. Se `getValue('comentarios')` vier vazio nesse ponto, todo registro pela tela seria recusado com «informe a anotação» e os 5 testes de servidor continuariam verdes. Fix: um ATF de form que preencha resultado e comentário, clique «Registrar ligação» (passo «Click a UI Action») e valide status e interação; e um negativo que clique sem comentário e confira a mensagem.

**[TEST-002] Sem negativo para as ACL novas e para a carteira do verbo — BAIXO** · `app/src/fluent/security/contato.now.ts:8-34`; `ContatoLigacao.server.js:140`
O design pede «1 negativo por ACL nova». Faltam: atendente tentando criar contato (deve falhar) e atendente registrando ligação em contato de outro atendente (deve receber a mensagem da carteira). Fix: dois `it` no `t_ux002_neg`, com um contato fictício de outro usuário demo.

## 10. Observabilidade

Todos os logs novos trazem o código do requisito, `sys_id` do contato ou da interação e `sys_id` do usuário. Nenhum leva nome, documento ou anotação do contribuinte.

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Ligação registrada | sim, `gs.info` com contato, novo status e usuário (`ContatoLigacao.server.js:87`) | a interação criada é o próprio registro de negócio; tabela com `audit: true` | — |
| Verbo recusado (validação, carteira, encerrado) | sim, `gs.warn` com contato, usuário e motivo (`ContatoLigacao.server.js:155`) | — | — |
| Interação não gravada | sim, `gs.error` (`ContatoLigacao.server.js:75`) | — | — |
| Gravação do contato falhou | não (BUG-002) | — | coberto por BUG-002 |
| Interação recusada por pai inválido | sim, `gs.warn` (`interacaoUmPai.server.js:5`) | — | — |
| Interação recusada fora da carteira | sim, `gs.warn` agora com contato e caso (`recusarInteracaoForaDaCarteira.server.js:6`) | — | — |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| `CarteiraAtendente.podeVer()` | Não. A função já aceitava `string` ou lista de campos | `CarteiraAtendente.server.js:52-66` |
| ACL da interação (leitura, criação, gravação) | Esperado pelo design: interação de caso deixa de ser visível ao atendente (dono passa a `caso.coordenador`). Atendente ainda vê a interação do próprio contato | `security/carteira.now.ts:40`, `:179`, `:190` |
| Coordenador cria interação no caso (R4) | Ainda não: a ACL de criação da interação segue só com atendente e admin. O verbo funciona para o coordenador porque grava por `GlideRecord` no servidor. A abertura para o coordenador pela tela é da US-MOD-UX-006 | `security/carteira.now.ts:156-162` |
| Regra de consulta da interação | Sem quebra; o filtro usa `addOrCondition` com dot-walk nos dois campos | `restringirConsultaCarteira.server.js:8`; `CarteiraAtendente.server.js:31-39` |
| Testes F5-003 e F5-007 | Podem falhar enquanto a US-MOD-UX-006 não reescreve os testes para o coordenador; o recibo desta US cobre só os 6 testes dela. Sem regressão nova causada por este delta além da mudança de dono que o design pede | `outputs/spec/auditorias/atf/US-MOD-UX-002.json`; `TASK-MOD-UX-006-02` |
| Form TEL-035 | Sem mudança de campo; botão aparece para o atendente no contato aberto (ATF verde) | `ui-actions/contato.now.ts:15-18`; recibo ATF |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

A US entrega o que o contrato pede: o botão existe com as regras de cliente e servidor do design, as 6 linhas da tabela de decisão estão certas e testadas, a anotação é obrigatória nos dois lados e a interação só aceita um pai. Os achados são médios e baixos. Os dois de segurança vêm do mesmo ponto: o atendente consegue gravar à mão campos do contato que só o verbo deveria mudar, inclusive o dono.

| Condição de bloqueio | Status |
|---|---|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|---|---|---|---|
| 1 | SEC-001 (MÉDIO) | `app/src/fluent/security/contato.now.ts:17-26` | Trocar a ACL de campo `*` por ACL nos campos editáveis pelo atendente; campos de andamento e de dono só para coordenador e admin | `outputs/spec/gaps-document.md` (novo GAP, `SEC-NNN` proposto) ou critério da US-MOD-UX-006 |
| 2 | SEC-002 (MÉDIO) | `app/src/server/contato/ContatoLigacao.server.js:140` | Conferir o dono pelo valor gravado (reler o contato) e recusar troca de `atendente` por quem não é coordenador nem admin | mesmo GAP do item 1 |
| 3 | BUG-001 (MÉDIO) | `app/src/fluent/ui-actions/contato.now.ts:22`, `:33` | Exigir resultado escolhido nesta ligação (`changes()`) ou limpar o campo ao abrir o form | `outputs/spec/gaps-document.md` |
| 4 | TEST-001 (MÉDIO) | `app/src/fluent/tests/US-MOD-UX-002.now.ts:444-482` | ATF de form que clica o botão (positivo e sem comentário) | `outputs/spec/gaps-document.md` |
| 5 | BUG-002 (BAIXO) | `app/src/server/contato/ContatoLigacao.server.js:86` | Conferir `update()` e desfazer a interação se falhar | débito técnico |
| 6 | TEST-002 (BAIXO) | `app/src/fluent/security/contato.now.ts:28-34`; `ContatoLigacao.server.js:140` | Negativos: atendente criando contato; ligação em contato de outro atendente | débito técnico |
| 7 | CONF-001 (BAIXO) | `app/src/fluent/business-rules/interacao.now.ts:14` | Alinhar order (50 no código, 100 no nó da task) ou registrar a escolha | débito técnico |
| 8 | CONF-002 (BAIXO) | `app/src/fluent/security/contato.now.ts:1-2` | O comentário diz que a linha do atendente é conferida pelas ACL de carteira; neste commit não existe ACL de carteira no contato (vem na US-MOD-UX-006). Ajustar o comentário ou citar a US | débito técnico |
| 9 | BUG-003 (BAIXO) | `app/src/server/contato/ContatoLigacao.server.js:57` | Aceitar ou contar tentativas pelas interações | débito técnico |
| 10 | BUG-004 (BAIXO) | `app/src/server/contato/ContatoLigacao.server.js:50` | Recusar retorno no passado ou registrar no design que é aceito | débito técnico |

> O marcador `outputs/spec/em-andamento.md` não foi apagado por esta auditoria: a remoção e o commit ficam com quem implementa. Esta auditoria também não gravou GAP no `gaps-document.md`; a coluna «Onde registrar» é a recomendação.

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@62dbed8
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
