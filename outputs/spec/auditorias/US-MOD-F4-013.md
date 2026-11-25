# Auditoria de Entrega — [US-MOD-F4-013] Régua Parcelamentos e leitura da inscrição por carteira

- **User Story:** US-MOD-F4-013 (nó `STORY-MOD-F4-013` no `outputs/spec/tasks.json`, depende da STORY-MOD-F4-012) — RF-MOD-F4-002, RF-MOD-F4-003
- **Features/IDs cobertos:** RN-NOVO-F4-014 (parcelamento em risco entra na régua) · RN-NOVO-F5-007 (atendente vê só a própria carteira) · AC-RF-MOD-F4-013-01 a -04 · TASK-MOD-F4-013-01 e -02 · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2 (B3, B4, B5, B9, D7, D16) · fecha SEC-001 da auditoria US-MOD-F4-010 (GAP-158 item 1) e o item 2 do GAP-159
- **Branch/commit auditado:** `feat/v0` @ `b7b589b`. Delta: `git diff 3396619..b7b589b -- app outputs/spec/data-model.json` (sem as mudanças de kit em `.claude/`, `harness-zona.lock.json` e o gerado `generated/keys.ts`). O código das duas stories (F4-012 e F4-013) está no mesmo commit. Recibo ATF `outputs/spec/auditorias/atf/US-MOD-F4-013.json`: 4/4 `success`, commit `b7b589b`.
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL` registrada no marcador `outputs/spec/em-andamento.md`, seguida por delegação do dono.

---

## 1. Inventário do delta

**Arquivos/módulos tocados pela US** (cada um com o papel dele):
- `app/src/server/regua/ReguaMotor.server.js` — `inscreverParcelamento` (L493-512): inscreve o contribuinte na régua Parcelamentos ativa, com o parcelamento e o último ciclo publicado. `motivoRecusaInscricao` (L632-638): recusa inscrição na régua Parcelamentos sem parcelamento (item 2 do GAP-159).
- `app/src/server/regua/inscreverParcelamento.server.js` — corpo da business rule «parcelamento em risco».
- `app/src/fluent/business-rules/regua.now.ts` — BR de padrões da inscrição passa a recusar Parcelamentos sem parcelamento (L30-52); BR «em risco inscreve» (L107-118) e BR «sai de em risco reavalia» (L120-131, reusa `reavaliarContribuinte.server.js` da F4-012).
- `app/src/fluent/security/regua.now.ts:98-111` — ACL deny-unless (nega a leitura a menos que a condição passe) em `regua_inscricao`: `CarteiraAtendente.podeVer(current, 'contribuinte.atendente')`, `adminOverrides: true`.
- `app/src/fluent/business-rules/carteira.now.ts:166-176` + `app/src/server/carteira/restringirConsultaCarteira.server.js:16` — business rule de consulta (filtra a busca antes de ir ao banco) em `regua_inscricao`, com `contribuinte.atendente` no mapa `DONO`.
- `app/src/fluent/tests/US-MOD-F4-013.now.ts` (4 testes ATF) e `tests/suite.now.ts`.

**Endpoints alterados/criados:** nenhum novo. A tabela `regua_inscricao` já tinha `allowWebServiceAccess: true` (`tables/regua_inscricao.now.ts:10`); a Table API passa a respeitar o filtro por carteira.

**Entidades/modelos tocados:** `x_2326104_cob_regua_inscricao`, `_parcelamento`, `_ciclo` (leitura do último publicado), `sys_security_acl`, `sys_script` (BR de consulta).

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3), JavaScript de servidor (Rhino), ACL com script, business rule de consulta, ATF com `atf.server.impersonate` e `GlideRecordSecure`.

**Varredura determinística** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 3396619 --repo app`): 3 achados «erro engolido no catch»; o desta US é `inscreverParcelamento.server.js:6`. Conferido: o erro é registrado com `gs.error` e o sys_id do parcelamento. Efeito em BUG-002.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| `CarteiraAtendente` (`podeVer`, `restringirConsulta`) | Passa a valer para mais uma tabela | baixo |
| Motor da régua rodando na sessão do atendente (`reavaliar`, `inscreverParcelamento`) | A BR de consulta também filtra o `GlideRecord` do servidor nessa sessão | médio |
| `motivoParada` (F4-011) na carteira Parcelamentos | Dependia de a inscrição ter parcelamento | baixo |
| Related lists e references que mostram a inscrição (form da régua, `contato.inscricao`, `comunicacao.inscricao`) | A ACL nova esconde a inscrição de outra carteira | baixo |
| ACL de leitura da F4-010 (`acl-base.now.ts:211-226`) | O deny se soma a ela | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (B3, B4, B5, B9, D7, D16; AC -01 a -04; RN-NOVO-F4-014, RN-NOVO-F5-007); segurança (leitura por carteira na lista, form, contagem e Table API; criação, alteração e exclusão por persona); teste de mesa; performance; bugs técnicos; testes (4 ATF); observabilidade; regressão.

**Não auditado (e por quê):**
- Execução do Flow da régua Parcelamentos de ponta a ponta: o design (B9) a deixa para a instância; há uma execução em andamento e o auditor não a acessou.
- Rate limiting, SSRF, prompt injection: sem rota nova, sem URL vinda do usuário, sem LLM.

## 4. Conformidade

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| D16 / B4: BR after update em parcelamento, `current.status.changesTo('em_risco')` → `inscreverParcelamento` | `business-rules/regua.now.ts:107-118` | ✅ PASS | |
| B3 `inscreverParcelamento`: régua Parcelamentos ativa; sem inscrição ativa nela; ciclo = último publicado por `publicado_em` ou vazio; parcelamento = o registro | `ReguaMotor.server.js:493-512` | ✅ PASS | Contribuinte em controle é recusado pela BR da inscrição (F4-010) |
| B4: parcelamento muda para outro status → `reavaliar` | `business-rules/regua.now.ts:120-131` | ✅ PASS | `motivoParada` dá `regularizado` (em dia, quitado) e `parcelamento_rompido` |
| GAP-159 item 2: inscrição de Parcelamentos sem parcelamento não para | `ReguaMotor.server.js:632-638`, `business-rules/regua.now.ts:41-46` | ✅ PASS | Agora a gravação é recusada com mensagem; ATF `t_f4013_sem_ciclo` |
| B5: read deny `CarteiraAtendente().podeVer(current, 'contribuinte.atendente')`, `adminOverrides: true` | `security/regua.now.ts:102-111` | ✅ PASS | Igual ao texto do design |
| B5: BR de consulta com `x_2326104_cob_regua_inscricao: ['contribuinte.atendente']` no mapa `DONO` | `carteira.now.ts:166-176`, `restringirConsultaCarteira.server.js:16` | ✅ PASS | |
| B5: nenhuma ACL de create, write ou delete para as personas | `security/acl-base.now.ts:211-226`, `security/regua.now.ts` | ✅ PASS | Só ACLs de leitura na tabela |
| GAP-158 item 1 / SEC-001 da F4-010 | as 3 linhas acima | ✅ FECHADO | ATF `t_f4013_acl_atendente` prova lista, contagem e ACL sem a BR |
| B9: os 2 testes F4-013 do design | `tests/US-MOD-F4-013.now.ts` | ✅ PASS | Mais 2: sem ciclo publicado e ACL do coordenador separada |

**CA da US cumpridos?** Sim.
- **AC-RF-MOD-F4-013-01** (em risco gera inscrição com o último ciclo publicado) — cumprido; ATF `t_f4013_em_risco` e `t_f4013_sem_ciclo` (sem ciclo publicado, nasce sem ciclo e a guarda segue).
- **AC-RF-MOD-F4-013-02** (em dia ou quitado encerra regularizado; rompido, parcelamento rompido) — cumprido; ATF `t_f4013_em_risco`.
- **AC-RF-MOD-F4-013-03** (atendente lê só a própria carteira; coordenador e admin leem todas) — cumprido; ATF `t_f4013_acl_atendente` e `t_f4013_acl_coordenador`.
- **AC-RF-MOD-F4-013-04** (nenhuma persona cria, altera ou apaga inscrição) — cumprido no código (não há ACL de create, write ou delete). O ATF prova criar (atendente e coordenador) e alterar (coordenador); apagar e o atendente alterando a inscrição da própria carteira não têm teste (TEST-001).

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

Nenhum novo. O SEC-001 da auditoria US-MOD-F4-010 (atendente lia inscrição de outra carteira) está fechado por esta US: ACL deny, BR de consulta e teste que falharia sem elas.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| IDOR (um usuário acessa o registro de outro) | Atendente lê inscrição de contribuinte de outra carteira pela lista, pelo form (sys_id na URL) ou pela Table API | ✅ BLOQUEADO | ACL deny por registro (`security/regua.now.ts:102-111`) e BR de consulta (`carteira.now.ts:166-176`); ATF: lê 1 de 2, contagem 1, e sem a BR a ACL sozinha ainda esconde |
| Vazamento por contagem | Total da lista ou relatório revela quantas inscrições há em outras carteiras | ✅ BLOQUEADO | A BR de consulta filtra antes da contagem; ATF «a contagem não revela a outra carteira» |
| Auth Bypass | Contribuinte sem atendente | ✅ BLOQUEADO | `podeVer` compara com o usuário logado; campo vazio não casa (`CarteiraAtendente.server.js:53-65`) |
| Privilege Escalation | Persona cria inscrição para disparar o Flow (que roda como system) | ✅ BLOQUEADO | Sem ACL de create; ATF «inserir inscrição é negado» para atendente e coordenador |
| Privilege Escalation | Persona altera ou apaga inscrição | ✅ BLOQUEADO (alterar provado só para o coordenador; apagar sem teste) | Sem ACL de write e delete; TEST-001 |
| Privilege Escalation | Atendente muda o parcelamento para «em risco» | ✅ BLOQUEADO | Escrita em parcelamento segue a carteira (F5); a inscrição nasce só para o contribuinte do parcelamento |
| Injeção | Consulta do último ciclo e das réguas | ✅ BLOQUEADO | Só `addQuery` com valores fixos ou sys_id do banco (`ReguaMotor.server.js:503-508`) |
| Secret Exposure | Código novo | N/A | Sem credencial |
| Mass Assignment | — | N/A | Persona não grava inscrição |
| Rate Limit | — | N/A | Sem rota nova |
| Race Condition | Dois parcelamentos do mesmo contribuinte viram «em risco» ao mesmo tempo | N/A (baixo) | Pode nascer inscrição em dobro; o volume é por contribuinte e o efeito é uma comunicação a mais por etapa (o teto por janela da F4-011 segura o mesmo canal) |
| Motor na sessão do atendente | `reavaliar`/`inscreverParcelamento` disparados por gravação do atendente passam pela BR de consulta | ✅ sem impacto | O contribuinte do parcelamento ou do débito é da carteira dele, então o filtro não esconde a inscrição que o motor precisa ler |

## 7. Findings de Performance

Nenhum finding. `inscreverParcelamento` faz 4 consultas por mudança de status (parcelamento, réguas ativas, inscrições ativas do contribuinte, último ciclo). A BR de consulta acrescenta uma condição por campo indexado de referência.

## 8. Findings de Bugs Técnicos

> **[BUG-001] Parcelamento em risco fica sem régua em dois casos — BAIXO**
> Linguagem: JavaScript de servidor. Arquivo: `app/src/server/regua/ReguaMotor.server.js:498-500`; `business-rules/regua.now.ts:107-118` (`action: ['update']`).
> **Cenário 1:** o contribuinte tem dois parcelamentos em risco. O primeiro gera a inscrição; o segundo é pulado porque já há inscrição ativa na régua. Depois o primeiro volta a «em dia» e a inscrição encerra como regularizado. O segundo continua em risco, sem régua, até mudar de status de novo.
> **Cenário 2:** parcelamento que já é gravado como «em risco» (insert, por carga ou integração) não inscreve: a BR só olha update.
> **Consequência:** contribuinte com parcelamento em risco sem nenhuma comunicação. Os dois casos seguem o texto da regra («se ainda não tem inscrição ativa nela», «passa a em risco»); nenhum dos dois acontece no seed da demo.
> **Fix:** ao encerrar a inscrição da régua Parcelamentos como regularizado, procurar outro parcelamento em risco do contribuinte e inscrever; incluir `insert` na BR de «em risco». Registrado em GAP-161.

> **[BUG-002] Falha na inscrição por parcelamento só vai ao log — BAIXO**
> Arquivo: `app/src/server/regua/inscreverParcelamento.server.js:4-8` (achado da varredura).
> **Cenário:** `inscreverParcelamento` lança erro. O status do parcelamento grava, a inscrição não nasce e quem gravou não vê aviso; a BR não roda de novo enquanto o status não mudar.
> **Fix:** `gs.addErrorMessage` para quem gravou, ou reprocessar no próximo update. Registrado em GAP-161.

## 9. Testes

**CA viraram teste?** AC-01 sim; AC-02 sim; AC-03 sim; AC-04 em parte (TEST-001). **TDD RED/GREEN presente?** Sim. O teste da ACL roda também sem a BR de consulta, então ele falharia se só a BR existisse. **Cobertura do delta:** boa.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F4-013.now.ts` `t_f4013_em_risco` | Sim (cria com parcelamento e último ciclo) | Sim (quitado, rompido, em dia; não duplica) | Bom |
| `t_f4013_sem_ciclo` | Sim (sem ciclo publicado, guarda segue) | Sim (Parcelamentos sem parcelamento recusada) | Bom |
| `t_f4013_acl_atendente` | Sim (lê a própria) | Sim (outra carteira na lista, na contagem e só pela ACL; insert negado) | Bom |
| `t_f4013_acl_coordenador` | Sim (lê as 2) | Sim (não grava; insert negado) | Bom; ver TEST-001 |

> **[TEST-001] Apagar inscrição e o atendente alterando a inscrição da própria carteira não têm teste — BAIXO**
> Arquivo: `app/src/fluent/tests/US-MOD-F4-013.now.ts` (`t_f4013_acl_atendente`, `t_f4013_acl_coordenador`).
> O AC-04 diz «nenhuma persona cria, altera ou apaga». O código cumpre (não há ACL de write nem de delete). Os testes provam criar para as duas personas e alterar só para o coordenador; `canDelete` não é conferido para ninguém e o atendente não tenta alterar a inscrição que ele lê.
> **Fix:** acrescentar `canWrite()` e `canDelete()` falsos para o atendente (na inscrição da carteira dele) e `canDelete()` falso para o coordenador. Registrado em GAP-161.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Parcelamento em risco | Sim, `gs.info` com parcelamento e inscrição criada ou não (`ReguaMotor.server.js:510`) | Módulo «Inscrições» | — (falha: BUG-002) |
| Inscrição recusada sem parcelamento | Sim, `gs.warn` com a mensagem (`business-rules/regua.now.ts:43`) | — | — |
| Encerramento por parcelamento | Sim, pelo `gs.info` de `reavaliar` (F4-012) | — | — |
| Leitura negada pela ACL | Log da plataforma | — | — |
| PII nos logs | Só sys_id | — | — |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| `CarteiraAtendente` | Não; nenhuma mudança no Script Include | diff |
| Motor na sessão do atendente | Não (ver item 6, última linha) | `restringirConsulta` só filtra quem tem só o papel de atendente |
| `motivoParada` na carteira Parcelamentos | Melhora: a inscrição sem parcelamento não nasce mais | ATF `t_f4013_sem_ciclo` |
| Related lists e references da inscrição | Esperado: o atendente não vê a inscrição de outra carteira; contato e comunicação dele são da mesma carteira | `security/regua.now.ts:102-111` |
| ACL de leitura da F4-010 | Não; o deny se soma | ATF `t_f4013_acl_coordenador` lê as 2 |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

Os 4 critérios de aceite estão cumpridos e o recibo tem 4/4. O SEC-001 da F4-010 (GAP-158 item 1) e o item 2 do GAP-159 estão fechados. Os achados abertos são BAIXO (BUG-001, BUG-002, TEST-001), registrados em GAP-161.

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | BUG-001 | `ReguaMotor.server.js:498-500`; `business-rules/regua.now.ts:107-118` | Reinscrever pelo outro parcelamento em risco; incluir insert na BR | `outputs/spec/gaps-document.md` (GAP-161) |
| 2 | BUG-002 | `inscreverParcelamento.server.js:4-8` | Avisar quem gravou ou reprocessar | GAP-161 |
| 3 | TEST-001 | `tests/US-MOD-F4-013.now.ts` | `canWrite`/`canDelete` do atendente e `canDelete` do coordenador | GAP-161 |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@b7b589b
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
