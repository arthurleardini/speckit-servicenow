# Auditoria de Entrega — [US-MOD-UX-006] Acesso por papel: contato do atendente, caso do coordenador

- **User Story:** US-MOD-UX-006 (nó `STORY-MOD-UX-006` no `outputs/spec/tasks.json`, sem label `fio-condutor`) — RF-MOD-UX-006 · Acesso por papel: contato do atendente, caso do coordenador
- **Features/IDs cobertos:** RF-MOD-UX-006 · RN-NOVO-F5-007 (atendente vê só a própria carteira, revista pelo design UX v1) · AC-RF-MOD-UX-006-01, -02, -03 · TASK-MOD-UX-006-01 (ACL de contato, deny do caso, dono da interação e da regularização) e TASK-MOD-UX-006-02 (reescrita dos testes F5-003 e F5-007) · decisões do design `docs/designs/ux-cobranca-v1.md` seção v1.1: 🔴4, 🔴5, 🔴6, R3, R4, R6
- **Branch/commit auditado:** `feat/v0` @ `4f2390a`. Delta: `62dbed8` (troca do dono da interação para `contato.atendente`), `78add92` (a US) e `4f2390a` (ACL de campo do contato), restrito a `app/src/fluent/security`, `app/src/fluent/business-rules/carteira.now.ts`, `app/src/server/carteira`, `app/src/server/contato/ContatoLigacao.server.js` e aos testes F5-003, F5-007 e UX-006
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Recibos ATF pendentes.** No momento desta auditoria não existe `outputs/spec/auditorias/atf/US-MOD-UX-006.json`. Os recibos `US-MOD-F5-003.json` e `US-MOD-F5-007.json` são anteriores à migração (commits `9c57189` e `5a0e1f7`, de 24/11 às 17h51 e 17h33 UTC), então provam os testes antigos, não os reescritos. Um reinstall completo com a suíte `cob-regressao` estava rodando. A ressalva TEST-001 abaixo fica aberta até os três recibos novos saírem verdes num commit igual ou posterior a `4f2390a`; se algum falhar, a US volta para correção.

> **Isenção g3:** `outputs/spec/auditorias/_isencoes/US-MOD-UX-006-g3.md` dispensa só os validadores de LLM (story fora do fio condutor). Build, install e ATF continuam obrigatórios.

> **Contexto regulatório:** o app vai tratar dado sob sigilo fiscal (CTN art. 198) e dado pessoal (LGPD). No v0 todo dado é fictício. Esta US é a que define quem enxerga o quê depois da reformulação: o atendente passa a trabalhar contatos da lista e o caso qualificado passa a ser só da coordenação.

---

## 1. Inventário do delta

A US muda o dono dos registros. Antes, o caso era do atendente e a carteira era protegida pelo campo `caso.atendente`. Agora o contato da lista é do atendente (`contato.atendente`), o caso é do coordenador (`caso.coordenador`) e o atendente não abre caso nenhum. A proteção continua em duas camadas: uma regra de consulta (Business Rule `before query`, que acrescenta «dono = eu» antes de cada consulta de quem só tem o papel de atendente) e ACL (regras de acesso da plataforma) do tipo «nega, a menos que».

**Arquivos tocados:**

| Arquivo | Papel | O que mudou |
|---|---|---|
| `app/src/fluent/security/carteira.now.ts` | ACL de carteira das 10 tabelas | +2 ACL «nega, a menos que» no contato (leitura e gravação, dono = `atendente`); caso passa a ser gravado só por coordenador e admin do app; criação e gravação de interação ganham o papel coordenador (R4); dono da interação = `contato.atendente` ou `caso.coordenador` (vindo de `62dbed8`) |
| `app/src/fluent/security/caso-sem-atendente.now.ts` (novo) | Deny do caso feito à mão (🔴6) | 2 ACL «nega, a menos que» no caso (linha e campos `*`): só passa quem é coordenador ou admin do app |
| `app/src/fluent/security/contato.now.ts` | Gravação do contato por papel | `4f2390a`: ACL de campo em `status`, `tentativas`, `atendente`, `contribuinte`, `ciclo`, `prioridade` e `valor_em_aberto`, só para coordenador e admin |
| `app/src/fluent/business-rules/carteira.now.ts` | Regras de gravação e consulta da carteira | +1 regra `before update` no contato e +1 regra `before query` no contato |
| `app/src/server/carteira/recusarContatoForaDaCarteira.server.js` (novo) | Corpo da regra de gravação do contato | Confere o dono como estava gravado, recusa troca de dono por quem não vê tudo e recusa «Encerrado» sem motivo |
| `app/src/server/carteira/restringirConsultaCarteira.server.js` | Mapa tabela → campo de dono | +`x_2326104_cob_contato: ['atendente']`; caso já usava `coordenador` |
| `app/src/server/carteira/recusarCasoForaDaCarteira.server.js` | Regra de gravação do caso | Só o comentário mudou (dono = coordenador) |
| `app/src/server/contato/ContatoLigacao.server.js` | Verbos «Registrar ligação» e «Encerrar» | `4f2390a`: grava num registro relido do banco, não no que veio do form |
| `app/src/fluent/tests/US-MOD-UX-006.now.ts` (novo) | 2 testes ATF (testes automáticos que rodam na instância) | Positivo e negativo da story |
| `app/src/fluent/tests/US-MOD-F5-003.now.ts`, `US-MOD-F5-007.now.ts` | Testes do dossiê e da carteira | Reescritos para o novo dono e reativados (saiu `active: false`) |
| `app/src/fluent/tests/suite.now.ts` | Suíte `cob-regressao` | +testes da UX-005 e da UX-006 |

**Endpoints alterados/criados:** nenhuma rota REST, UI Action ou tela nova. As ACL e regras valem em form, lista, related list, report, exportação e Table API de `x_2326104_cob_contato`, `x_2326104_cob_caso` e `x_2326104_cob_interacao`.
**Entidades tocadas:** `contato`, `caso`, `interacao`, `regularizacao` (só o mapa de dono). Nenhum campo novo.
**Stack:** app escopado `x_2326104_cob`, Fluent `@servicenow/sdk` (`Acl`, `BusinessRule`, `Test`); script de servidor ES5; ATF com `impersonate` e `runServerSideScript` (Jasmine 3.1).

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 62dbed8~1 --repo .` → 57 arquivos mudados desde `f78bd09`, **0 achados**.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| `CasoDossie.montar` (`app/src/server/atendimento/CasoDossie.server.js:29-33`) | Lê o caso por `GlideRecordSecure`; o deny novo do caso muda quem passa | médio |
| `ContatoLigacao` (verbos do contato) | Grava o contato e agora passa pela regra nova de gravação do contato | médio |
| `QualificacaoCiclo.distribuir` (`QualificacaoCiclo.server.js:185-206`) | Cria contato e grava `contribuinte.atendente`; a regra nova do contato é só de update | baixo |
| Report TEL-022 «Carga por responsável» (`app/src/fluent/ui/TEL-022.now.ts:8`) | Report do caso publicado também para o papel atendente | baixo |
| Seed de contato (`app/src/fluent/seed-demo/contato.now.ts`) | A regra nova recusa contato «Encerrado» sem motivo em qualquer update | baixo |
| Suíte `cob-regressao` | Testes F5-003 e F5-007 reativados e testes da UX-005 incluídos nesta US | médio |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (design v1.1 e nó da US), segurança (ACL, carteira, sigilo), teste de mesa, bugs, testes, observabilidade, regressão. Performance só na regra de consulta nova.
**Não auditado (e por quê):**
- Injeção — N/A: nenhum valor do usuário é montado em texto de consulta; os filtros usam `addQuery` com o `sys_id` do usuário logado.
- Segredo exposto — N/A: o delta não lê credencial nem `.env`.
- Rate limiting — N/A: nenhuma rota nova.
- Execução dos testes na instância — fora do papel do auditor (instrução de não rodar nada na instância); ver recibos pendentes no topo.
- Menu e home por papel — são da US-MOD-UX-001 e da US-MOD-UX-007.

## 4. Conformidade

Verificado contra a seção v1.1 do design (que prevalece), a tabela de ACL do design, o nó `STORY-MOD-UX-006` do `tasks.json` e os guardrails de `CLAUDE.md` e `.claude/rules/harness/security.md`.

| Diretiva / decisão / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| 🔴4: dono da interação = `contato.atendente` ou `caso.coordenador` (mapa de dono, ACL e regras) | `carteira.now.ts:40`, `:203`, `:214`; `restringirConsultaCarteira.server.js:9`; `recusarInteracaoForaDaCarteira.server.js:4` | ✅ PASS | Os quatro pontos usam os mesmos dois campos |
| 🔴4: regularização = `atendente` ou `caso.coordenador` | `carteira.now.ts:51`; `restringirConsultaCarteira.server.js:10` | ✅ PASS | |
| 🔴5: migração do dono do caso; F5-003 e F5-007 reescritos (positivo = coordenador, negativo = atendente sem acesso) | `US-MOD-F5-003.now.ts` (positivo com `demo.coordenador`, negativo com `demo.atendente`); `US-MOD-F5-007.now.ts` | ✅ PASS | Nenhum `caso.atendente` restante no código de servidor e nas ACL (`grep`) |
| 🔴6: deny do caso para o atendente em arquivo próprio feito à mão | `caso-sem-atendente.now.ts:9-30` | ✅ PASS | Linha e campos `*`; sem cabeçalho de gerado |
| R4: coordenador cria interação no caso; teste F5-007 invertido | `carteira.now.ts:178-185`, `:166-174`; `US-MOD-F5-007.now.ts` (teste do coordenador) | ✅ PASS | |
| R6: coluna de dono do caso = `coordenador` | `carteira.now.ts:18`, `:151`; `restringirConsultaCarteira.server.js:6` | ✅ PASS | |
| Tabela de ACL — contato: atendente lê e grava os próprios; coordenador e admin, tudo | `carteira.now.ts:56-76`; `contato.now.ts:8-34`; `carteira.now.ts:43-53` (regras) | ✅ PASS | Criação só para coordenador e admin (distribuição) |
| Tabela de ACL — contribuinte: atendente lê os da carteira | `carteira.now.ts:22-31` | ✅ PASS | Já existia; sem mudança |
| Tabela de ACL — caso: atendente sem acesso | `caso-sem-atendente.now.ts:9-30`; `carteira.now.ts:11-20`, `:135-164` | ✅ PASS | |
| R3: `contato.atendente` igual a `contribuinte.atendente` | `QualificacaoCiclo.server.js:192-203` | ⚠️ PARCIAL | Garantido na distribuição; reatribuição manual do contato não acompanha (BUG-002) |
| RN-NOVO-F5-007 no `tasks.json`: «filtro de menu e view não contam como proteção» | ACL + regra de consulta | ✅ PASS | |
| `security.md` Camada G: ACL `record` por operação em toda tabela custom | `contato.now.ts` | ⚠️ PARCIAL | Contato sem ACL de delete explícita (CONF-001) |
| AC-RF-MOD-UX-006-01 — atendente não vê contato nem contribuinte de outro atendente por nenhum caminho | `carteira.now.ts:22-31`, `:56-76`; `restringirConsultaCarteira.server.js:7-8` | ✅ PASS | |
| AC-RF-MOD-UX-006-02 — atendente não abre caso qualificado | `caso-sem-atendente.now.ts:9-30`; `CasoDossie.server.js:29-33` | ✅ PASS | |
| AC-RF-MOD-UX-006-03 — coordenador registra interação no caso | `carteira.now.ts:178-185`; `recusarInteracaoForaDaCarteira.server.js:4` (coordenador vê tudo) | ✅ PASS | |

**CA da US cumpridos?** Sim, os três, pela leitura do código. A prova na instância depende dos recibos pendentes (TEST-001).
**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] A regra de gravação da interação confere o dono pelo valor novo, não pelo gravado — BAIXO** · CVSS 3.1 (AV:N/AC:H/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A01 (controle de acesso quebrado) · CWE-639 (autorização por chave controlada pelo usuário) · STRIDE T (adulteração)
> Arquivo: `app/src/server/carteira/recusarInteracaoForaDaCarteira.server.js:4` · Contexto: `x_2326104_cob_interacao`, update
> **Problema:** as regras do caso e do contato conferem o dono em `previous` («como estava gravado»). A da interação confere em `current`. Num update, quem troca o campo `contato` de uma interação alheia para um contato próprio passa na regra.
> **Risco:** pela tela, lista e Table API o atendente não chega à interação alheia: a regra de consulta e a ACL de leitura a escondem. O caminho só existe para script de servidor rodando em nome do atendente (o mesmo cenário que o teste F5-007 usa com `setWorkflow(false)`). Impacto: uma interação de outra carteira muda de pai e passa a aparecer para o atendente.
> **Fix:** no update, conferir o dono em `previous` e em `current` (as duas carteiras precisam ser do usuário), do mesmo jeito que `recusarContatoForaDaCarteira.server.js:6`.
> **TDD RED:** como `demo.atendente2`, achar por `setWorkflow(false)` a interação do contato de `demo.atendente`, ligar `setWorkflow(true)`, trocar `contato` para um contato próprio e `update()`: hoje grava. **TDD GREEN:** a gravação é recusada com «Operação recusada: atendente vê só a própria carteira.».
> GAP recomendado: novo GAP em `outputs/spec/gaps-document.md` (último hoje: GAP-148).

> **[SEC-002] Autor da interação é gravável à mão — BAIXO** · CVSS 3.1 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A09 (falha de registro e monitoramento) · CWE-345 · STRIDE R (repúdio)
> Arquivo: `app/src/fluent/security/carteira.now.ts:166-174` · Contexto: `x_2326104_cob_interacao.atendente`
> **Problema:** a ACL de campo `*` da interação dá gravação em todos os campos para atendente e admin do app e, desde esta US (R4), também para o coordenador. O campo `atendente` da interação, que registra quem fez o contato, aceita qualquer usuário quando a interação é criada pela lista ou pela Table API. O verbo «Registrar ligação» grava o usuário logado (`ContatoLigacao.server.js:74`), mas a criação direta não.
> **Risco:** a trilha de quem ligou para o contribuinte pode ser atribuída a outra pessoa. A auditoria da tabela registra quem gravou, então o rastro real continua existindo.
> **Fix:** ACL de campo em `interacao.atendente` só para admin, mais uma regra `before insert` que preenche o campo com `gs.getUserID()`.
> **TDD RED:** como `demo.atendente`, criar interação no próprio contato com `atendente = demo.atendente2` por `GlideRecordSecure`: hoje grava. **TDD GREEN:** o campo fica com `demo.atendente`.
> GAP recomendado: mesmo GAP do SEC-001.

## 6. Testes de mesa (vetores no delta)

Rastreei cada vetor com os registros e papéis reais da US (`demo.atendente`, `demo.atendente2`, `demo.coordenador`).

| Vetor | Dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR (um usuário acessa o registro de outro) — contato | `demo.atendente2` abre por `sys_id` o contato de `demo.atendente` | ✅ BLOQUEADO | ACL `carteira.now.ts:56-65` nega; regra de consulta `restringirConsultaCarteira.server.js:7` nem traz a linha |
| IDOR — contato, gravação | `demo.atendente2` grava o contato alheio pela API ou pelo verbo | ✅ BLOQUEADO | ACL `carteira.now.ts:67-76`; regra `recusarContatoForaDaCarteira.server.js:6` com `previous`; verbo `ContatoLigacao.server.js:195` relê do banco |
| IDOR — interação de caso | `demo.atendente` lê ou cria interação de caso do coordenador | ✅ BLOQUEADO | `carteira.now.ts:40`, `:203`; o atendente não é `caso.coordenador` |
| IDOR — interação, troca de pai por script | ver SEC-001 | ⚠️ BAIXO | `recusarInteracaoForaDaCarteira.server.js:4` |
| Acesso ao caso pelo atendente (form, lista, report, API, dossiê) | `demo.atendente` abre caso de `demo.coordenador` | ✅ BLOQUEADO | Duas ACL de leitura nega-a-menos-que (`caso-sem-atendente.now.ts:9-18`, `carteira.now.ts:11-20`); regra de consulta com `coordenador`; `CasoDossie.server.js:29-33` devolve «Operação recusada: atendente vê só a própria carteira.» |
| Acesso ao caso quando um atendente consta como `caso.coordenador` (dado legado ou erro de cadastro) | caso com `coordenador = demo.atendente` | ✅ BLOQUEADO | `caso-sem-atendente.now.ts:16` usa só o papel (`veTudo`), independe do campo |
| Escalada de privilégio — troca de dono do contato | `demo.atendente` põe o próprio nome em `atendente` de contato alheio, ou entrega o próprio a outro | ✅ BLOQUEADO | ACL de campo `contato.now.ts:60-68`; regra `recusarContatoForaDaCarteira.server.js:7-9` |
| Escalada — atendente cria contato | `demo.atendente` cria contato pela API | ✅ BLOQUEADO | Criação só coordenador e admin (`contato.now.ts:27-34`) |
| Escalada — atendente grava caso | `demo.atendente` grava caso | ✅ BLOQUEADO | `carteira.now.ts:135-164` sem o papel atendente |
| Mass assignment (gravar campos que o form não deveria aceitar) — contato | atendente grava `status`, `tentativas`, `valor_em_aberto` à mão | ✅ BLOQUEADO | ACL de campo `contato.now.ts:40-108`; «Encerrado» sem motivo recusado em qualquer caminho (`recusarContatoForaDaCarteira.server.js:10`) |
| Mass assignment — interação | autor da interação | ⚠️ BAIXO | SEC-002 |
| Contagem que revela dado alheio | lista do atendente sem o aviso «linhas removidas por segurança» | ✅ BLOQUEADO | Regra de consulta no contato e no caso; teste F5-007 confere a contagem |
| Race condition | — | N/A | A US não acrescenta operação de leitura e escrita concorrente |
| Injeção / segredo / rate limit | — | N/A | Ver seção 3 |

## 7. Findings de Performance

Nenhum. A regra de consulta nova do contato filtra por `atendente`, um campo de referência (a plataforma indexa referência). Para coordenador e admin a regra sai sem filtro (`CarteiraAtendente.server.js:32`).

## 8. Findings de Bugs Técnicos

**[BUG-001] Contato «Encerrado» sem motivo trava qualquer gravação seguinte — BAIXO** · ES5 servidor · `app/src/server/carteira/recusarContatoForaDaCarteira.server.js:10`
Cenário: a regra confere «status encerrado e motivo vazio» em todo update, mesmo quando o update não mexe no status. Um contato que já esteja encerrado sem motivo (carga antiga, importação, gravação com `setWorkflow(false)`) passa a recusar qualquer alteração, inclusive do coordenador e do admin, até alguém preencher o motivo. Hoje o seed tem motivo em todos os encerrados, então o efeito não aparece. Fix: aplicar a condição só quando `current.status.changes()` ou quando o motivo for apagado.

**[BUG-002] Reatribuição manual do contato não acompanha o contribuinte (R3) — BAIXO** · ES5 servidor · `app/src/fluent/security/contato.now.ts:60-68`; `app/src/server/qualificacao/QualificacaoCiclo.server.js:192-203`
Cenário: o design define `contato.atendente := contribuinte.atendente` (R3). A distribuição grava os dois iguais, mas o coordenador pode trocar `contato.atendente` à mão e nada atualiza `contribuinte.atendente`. Consequência: o novo atendente vê o contato e recebe recusa ao abrir o contribuinte, os débitos e o telefone (exibido por `contribuinte.telefone`); o atendente antigo continua vendo o contribuinte. Não amplia acesso além do que o coordenador decidiu, mas deixa as duas carteiras incoerentes. Fix: regra `after update` no contato que propaga o dono ao contribuinte, ou o campo somente leitura também para o coordenador, com a troca feita por um verbo que mexe nos dois.

## 9. Testes

**CA viraram teste?**
- AC-01 (contato e contribuinte alheios): sim — `US-MOD-UX-006.now.ts:142-150` (contato por `get` e por consulta) e `US-MOD-F5-007.now.ts` (contribuinte, interação, débito, parcelamento e contagem).
- AC-02 (atendente não abre caso): sim — `US-MOD-UX-006.now.ts:168-183`, `US-MOD-F5-007.now.ts` (caso não aparece nem é gravado), `US-MOD-F5-003.now.ts` (dossiê negado com a mensagem exata).
- AC-03 (coordenador registra interação no caso): sim — `US-MOD-UX-006.now.ts:79-90` e o teste do coordenador em `US-MOD-F5-007.now.ts`.

**TDD RED/GREEN presente?** Sim: cada ACL nova tem lado positivo e negativo, os testes impersonam os usuários demo e usam `GlideRecordSecure`, então as ACL entram no caminho.
**Cobertura do delta:** boa para leitura e criação. Falta caso de borda do deny feito à mão (TEST-002).

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `US-MOD-UX-006.now.ts` | Sim (dono grava o contato; coordenador lê caso e contato e cria interação) | Sim (outro atendente; caso negado; interação no caso negada; «Encerrado» sem motivo) | Adequado |
| `US-MOD-F5-003.now.ts` | Sim (dossiê do coordenador e form) | Sim (dossiê negado ao atendente com a mensagem) | Adequado |
| `US-MOD-F5-007.now.ts` | Sim (carteira própria; coordenador vê tudo e registra no caso) | Sim (carteira alheia por tela, script e verbo; contagem; caso) | Adequado |

**[TEST-001] Recibos ATF da US e dos testes migrados ainda não existem — MÉDIO** · `outputs/spec/auditorias/atf/` (sem `US-MOD-UX-006.json`; `US-MOD-F5-003.json` do commit `9c57189` e `US-MOD-F5-007.json` do commit `5a0e1f7`, anteriores à migração)
Os testes reescritos e os dois novos não têm execução registrada no commit auditado. Fechar a US exige os três recibos verdes em `4f2390a` ou depois, mais a suíte `cob-regressao` verde (o recibo atual da suíte é do commit `e6cb7c5`, com 26 testes, antes da reativação).

**[TEST-002] O deny feito à mão do caso não tem teste que só ele faça passar — BAIXO** · `app/src/fluent/security/caso-sem-atendente.now.ts:9-30`; `app/src/fluent/tests/US-MOD-UX-006.now.ts:168-183`
Nos testes, o atendente nunca é o `coordenador` do caso, então a ACL de carteira (`carteira.now.ts:11-20`) já nega sozinha. Se o arquivo do 🔴6 sumir, os testes continuam verdes. Caso que só ele cobre: caso com `coordenador = demo.atendente`, impersonado como `demo.atendente`, `GlideRecordSecure.get` deve dar `false`.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Recusa de gravação de contato (fora da carteira, troca de dono, «Encerrado» sem motivo) | Sim — `gs.warn` com `sys_id` do usuário, `sys_id` do contato e a mensagem (`recusarContatoForaDaCarteira.server.js:14`); sem dado pessoal | Não se aplica | — |
| Negação por ACL (contato, caso) | Pela plataforma (sem log próprio, padrão das ACL) | — | — |
| Dossiê negado ao atendente | Sim — `CasoDossie.server.js:31` | — | — |

Sem achado.

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| `CasoDossie.montar` | Não. O coordenador passa; o atendente recebe a mensagem de carteira | `CasoDossie.server.js:29-33`; teste F5-003 negativo |
| `ContatoLigacao` | Não. Grava em registro relido, com motivo sempre preenchido quando encerra, então passa na regra nova | `ContatoLigacao.server.js:91-99`, `:128-133`; `recusarContatoForaDaCarteira.server.js:10` |
| `QualificacaoCiclo.distribuir` | Não. A regra nova do contato é só de update; a criação roda como coordenador | `business-rules/carteira.now.ts:38`; `QualificacaoCiclo.server.js:199-206` |
| Report TEL-022 | Sem impacto de segurança: para o atendente o gráfico do caso sai vazio (a regra de consulta não traz linhas) | `ui/TEL-022.now.ts:8` |
| Seed de contato | Não. Os contatos encerrados do seed têm motivo | `seed-demo/contato.now.ts:178-184`, `:409-415` |
| Suíte `cob-regressao` | Inclui agora os testes da UX-005 (`suite.now.ts:20`, `:39`), que entraram por este commit e não pelo da UX-005; depende do recibo da suíte | TEST-001 |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

O código entrega o que o design v1.1 pede: o contato é do atendente na leitura, na gravação e na consulta; o caso fica fechado para o atendente por duas ACL, uma delas no arquivo próprio do 🔴6; o coordenador cria interação no caso; a interação e a regularização usam os donos novos; os testes F5-003 e F5-007 foram reescritos e reativados. Os achados de segurança são baixos e exigem script de servidor ou só afetam a trilha de autoria. A ressalva de maior peso é o recibo ATF: sem os três recibos verdes no commit auditado, a prova na instância está pendente.

| Condição de bloqueio | Status |
|---|---|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ (pela leitura do código; execução pendente — TEST-001) |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|---|---|---|---|
| 1 | TEST-001 | `outputs/spec/auditorias/atf/` | Gerar os recibos `US-MOD-UX-006.json`, `US-MOD-F5-003.json` e `US-MOD-F5-007.json` verdes em `4f2390a` ou depois, e o recibo da suíte `cob-regressao` com os testes reativados. Se algum falhar, a US volta para correção | recibos ATF |
| 2 | SEC-001 | `app/src/server/carteira/recusarInteracaoForaDaCarteira.server.js:4` | Conferir o dono em `previous` e em `current` no update | `outputs/spec/gaps-document.md` (GAP novo) |
| 3 | SEC-002 | `app/src/fluent/security/carteira.now.ts:166-174` | ACL de campo em `interacao.atendente` e preenchimento pelo servidor | mesmo GAP |
| 4 | BUG-001 | `app/src/server/carteira/recusarContatoForaDaCarteira.server.js:10` | Aplicar a exigência de motivo só quando o status muda ou o motivo é apagado | `outputs/spec/gaps-document.md` |
| 5 | BUG-002 | `app/src/fluent/security/contato.now.ts:60-68` | Propagar a troca de dono do contato ao contribuinte (R3) ou fazer a troca por verbo | `outputs/spec/gaps-document.md` |
| 6 | TEST-002 | `app/src/fluent/tests/US-MOD-UX-006.now.ts:168-183` | Caso de teste com o atendente como `coordenador` do caso | próximo ciclo de testes |
| 7 | CONF-001 | `app/src/fluent/security/contato.now.ts` | ACL de delete explícita no contato (hoje a ausência de ACL nega a todos menos o admin da plataforma, o que já protege; a regra da Camada G pede a ACL por operação) | `outputs/spec/gaps-document.md` |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@4f2390a
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
