# Auditoria de Entrega — [US-MOD-F4-016] Reenviar comunicação com falha (opcional)

- **User Story:** US-MOD-F4-016 (nó `STORY-MOD-F4-016` no `outputs/spec/tasks.json`, depende da STORY-MOD-F4-014) — RF-MOD-F4-006
- **Features/IDs cobertos:** RN-NOVO-F4-005 (falha de entrega é sinalizada e pode ser reenviada) · AC-RF-MOD-F4-016-01 a -03 · TASK-MOD-F4-016-01 · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2 (A1, B3, B9)
- **Branch/commit auditado:** `feat/v0` @ `e6e44f1` (código de `app/` igual ao de `77f5380`; documentos em `e6e44f1`). Delta da US: `git diff ac7a0cc..77f5380 -- app/src/fluent/ui-actions/comunicacao.now.ts app/src/server/regua/ReguaMotor.server.js app/src/fluent/tests/US-MOD-F4-016.now.ts app/src/fluent/tests/suite.now.ts`. O código entrou em `0bd02a5`; o `77f5380` corrigiu o teste do atendente.
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL` registrada no marcador `outputs/spec/em-andamento.md`, seguida por delegação do dono.

> **Recibo de ATF:** não existe `outputs/spec/auditorias/atf/US-MOD-F4-016.json`, embora a isenção g3 o cite. A cobertura vem da suíte `cob-regressao`, 97 de 97 verdes em `e6e44f1` (seção 9).

---

## 1. Inventário do delta

**Arquivos tocados pela US** (cada um com o papel dele):
- `app/src/fluent/ui-actions/comunicacao.now.ts` (novo) — botão «Reenviar» no form da comunicação (`F4-016_ua_reenviar`) e a mesma ação no menu da linha e em «Ações nas linhas selecionadas» da lista (`F4-016_ual_reenviar`). Condição `current.status == 'falha'`; papéis coordenador e admin do app.
- `app/src/server/regua/ReguaMotor.server.js:386-419` — método `reenviar(comunicacao)` no motor da régua (Script Include) e as mensagens `MSG_REENVIAR_*` (L57-60). Confere papel e status, volta a comunicação para «agendada», chama `enviar` (o mesmo envio do Flow, com canal, fallback, opt-in, opt-out, contrato e teto) e soma as tentativas novas às anteriores.
- `app/src/fluent/tests/US-MOD-F4-016.now.ts` (3 testes ATF) e `tests/suite.now.ts`.

**Endpoints alterados/criados:** nenhuma API REST própria.

**Entidades/modelos tocados:** `x_2326104_cob_comunicacao` (status, canal, tentativas, motivo, enviada_em), `x_2326104_cob_envio_sim` (retornos de envio simulado, um por tentativa), leitura de `regua_inscricao`, `regua_etapa`, `canal_sim` e consentimentos.

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3), JavaScript de servidor (Script Include), UI Action da Core UI clássica, ATF.

**Varredura determinística** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo ac7a0cc --repo app`): 11 arquivos mudados, 0 achados.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| `ReguaMotor.enviar` (F4-011, usado pelo Flow) | `reenviar` reaproveita `enviar` e conta com a regra «comunicação agendada é reaproveitada» | médio |
| `ReguaMotor.encerrar` (F4-011/F4-012) | Encerrar inscrição só muda comunicações «agendada»; as com falha continuam elegíveis ao reenvio | médio |
| BR «Recusar comunicação para contribuinte em controle» | Só roda no insert; o reenvio é update | baixo |
| BR de consulta por carteira em `comunicacao` (F5-007) | O atendente só vê comunicação da carteira dele | baixo |
| Módulo «Disparos com falha» (lista filtrada por status) | A ação de lista aparece ali | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (A1, B3, B9; os 3 critérios de aceite; RN-NOVO-F4-005); segurança (quem reenvia, checagem no servidor); teste de mesa; performance; bugs técnicos (estado intermediário, guardas, contagem de tentativas); testes; observabilidade; regressão.

**Não auditado (e por quê):**
- Envio real: os canais são simulados (`envio_sim`).
- Injeção, mass assignment, SSRF, rate limiting: a ação não recebe texto nem campo do usuário; só o registro corrente.
- Execução do reenvio na instância pelo auditor: proibido alterar a instância.

## 4. Conformidade

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| A1: botão «Reenviar» no form, `current.status == 'falha'`, coordenador, ordem 100, `new ReguaMotor().reenviar(current)` | `ui-actions/comunicacao.now.ts:8-30` | ✅ PASS | Também admin do app; `action.setRedirectURL(current)` depois de gravar |
| A1: ação de lista com `showContextMenu` e `showListChoice`, `showUpdate: true` | `ui-actions/comunicacao.now.ts:32-51` | ✅ PASS | |
| B3: `reenviar(com)` só coordenador; só status «falha»; nova rodada na mesma comunicação, com as regras de `enviar` | `ReguaMotor.server.js:392-419` | ✅ PASS | Papel conferido no servidor (L393-396); mesma comunicação reaproveitada |
| RN-NOVO-F4-005: atendente não reenvia | `ReguaMotor.server.js:394-396`; roles nas UI Actions | ✅ PASS | ATF `t_f4016_atendente` |
| G7 do design: nenhuma comunicação para regularizado, régua pausada ou controle | `ReguaMotor.server.js:401-409` | ⚠️ PARCIAL | O reenvio não passa pelas guardas. Ver BUG-001 |
| B9: ATF «reenviar de comunicação com falha cria nova tentativa» | `tests/US-MOD-F4-016.now.ts:76-90` | ✅ PASS | |
| Guardrail: mensagem traduzível (`servicenow-ui.md`) | `ReguaMotor.server.js:57-60` | ⚠️ PARCIAL | Literal fixo, mesmo padrão do motor (CONF-003 da US-MOD-F4-014) |

**Critérios de aceite da US:**
- **AC-RF-MOD-F4-016-01** (coordenador reenvia comunicação com falha, na lista ou no form): ✅ cumprido — código das duas ações; ATF de servidor e de visibilidade no form. A ação de lista não tem teste (TST-001).
- **AC-RF-MOD-F4-016-02** (o reenvio respeita consentimento, contrato do canal e teto): ✅ cumprido pelo código — `reenviar` chama `enviar`, que aplica as quatro regras (`ReguaMotor.server.js:337-352`, testadas na F4-011). Não há teste dessas regras pelo caminho do reenvio (TST-001).
- **AC-RF-MOD-F4-016-03** (comunicação entregue não oferece reenvio): ✅ cumprido — condição `status == 'falha'` nas duas ações e recusa no servidor (L398-400); ATF só do servidor.

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

Nenhum. O papel é conferido no servidor, além das `roles` da UI Action; o atendente é recusado mesmo chamando o método direto (ATF).

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| IDOR | Coordenador reenvia comunicação de qualquer carteira | ✅ BLOQUEADO (por desenho) | Coordenador lê todas as carteiras (B5); atendente só vê a dele (BR de consulta) e não reenvia |
| Auth Bypass | Atendente chama `ReguaMotor.reenviar` por script | ✅ BLOQUEADO | `ReguaMotor.server.js:393-396`; ATF `t_f4016_atendente` |
| Privilege Escalation | Atendente vê o botão | ✅ BLOQUEADO | `roles` em `comunicacao.now.ts:14, 37` |
| Injeção | — | N/A | Sem entrada de texto |
| Secret Exposure | — | N/A | |
| Mass Assignment | — | N/A | Só o registro corrente; campos gravados pelo servidor |
| Rate Limiting | Reenvios seguidos no mesmo canal | ✅ BLOQUEADO | O teto por janela de `enviar` (L349-352) vale no reenvio |
| Race Condition | Dois cliques simultâneos em «Reenviar» | ❌ VULNERÁVEL (baixo impacto) | Ver BUG-002 |
| Regra de negócio | Reenvio de comunicação de inscrição encerrada por regularização ou pausa | ❌ VULNERÁVEL | Ver BUG-001 |

## 7. Findings de Performance

Nenhum. Um reenvio faz as mesmas leituras de um envio do Flow, uma vez por comunicação; a ação de lista roda uma vez por linha marcada.

## 8. Findings de Bugs Técnicos

> **[BUG-001] «Reenviar» ignora as guardas da régua — MÉDIO** · JavaScript de servidor
> Arquivo: `app/src/server/regua/ReguaMotor.server.js:401-409`
> **Cenário:** a etapa 1 falha em todos os canais (comunicação «Falha»). Depois o contribuinte regulariza e a inscrição é encerrada com `regularizado`. `encerrar` (L218-222) só muda comunicações «agendada», então a comunicação com falha continua em «Disparos com falha» e com o botão. O coordenador clica «Reenviar».
> **Consequência:** `reenviar` não confere se a inscrição está ativa nem chama `motivoParada`; a comunicação sai para quem já regularizou (ou para régua pausada). Isso contraria o G7 do design («nenhuma comunicação para … regularizado») e a RN-NOVO-F1-002 (regularização encerra a abordagem). Os canais são simulados, por isso MÉDIO.
> **Fix:** antes de voltar o status, recusar quando a inscrição não está «ativa» ou quando `motivoParada(insc)` devolve motivo, com mensagem própria; ou esconder a ação nesses casos.
> **TDD RED:** inscrição encerrada `regularizado` com comunicação «Falha»; `reenviar` hoje devolve `ok` e cria `envio_sim`. **TDD GREEN:** recusa, nenhum `envio_sim` novo, status continua «Falha».

> **[BUG-002] Estado intermediário «agendada» gravado antes do envio — BAIXO** · JavaScript de servidor
> Arquivo: `app/src/server/regua/ReguaMotor.server.js:405-409`; `app/src/fluent/ui-actions/comunicacao.now.ts:21`
> **Cenário 1:** a etapa da comunicação foi removida ou mudou de ordem. `com.etapa.ordem` vira 0 e `enviar` lança erro («etapa 0 não existe na régua») depois que a comunicação já foi gravada como «agendada». **Cenário 2:** dois cliques simultâneos; os dois leem «falha», os dois gravam «agendada» e os dois chamam `enviar`, que reaproveita comunicação «agendada» — duas rodadas.
> **Consequência:** no cenário 1, a comunicação fica presa em «agendada», sai de «Disparos com falha», perde o botão, e a UI Action mostra erro de script sem mensagem amigável. No cenário 2, tentativas e retornos de envio em dobro.
> **Fix:** validar a etapa antes de gravar; envolver `enviar` em `try/catch` que devolve o status «falha» e a mensagem; para o duplo clique, gravar a troca de status com condição (`addQuery('status','falha')` + `updateMultiple`) e seguir só se uma linha mudou.
> **TDD RED:** comunicação «Falha» com etapa apagada; depois do `reenviar`, status «agendada». **TDD GREEN:** status continua «Falha» e a mensagem explica.

## 9. Testes

**CA viraram teste?**
- AC-01: sim no form (`t_f4016_ui`, visibilidade) e no servidor (`t_f4016_reenviar`); a ação de lista não tem teste.
- AC-02: não pelo caminho do reenvio; as regras são as de `enviar`, testadas na F4-011.
- AC-03: sim no servidor («entregue → recusada com a mensagem, nada muda»); não há teste de que o botão some na comunicação entregue.
- Atendente não reenvia: `t_f4016_atendente`.

**TDD RED/GREEN presente?** Sim no histórico: no resultado de suíte `07af1511…` (commit `0bd02a5`), `t_f4016_atendente` falhou porque a comunicação de teste não era da carteira do atendente (a consulta dele é filtrada); `77f5380` pôs o contribuinte na carteira de `demo.atendente`.

**Recibos:**
- `outputs/spec/auditorias/atf/US-MOD-F4-016.json`: não existe.
- `outputs/spec/auditorias/atf/cob-regressao.json`: commit `0bd02a5`, falha (95 de 97; uma das falhas é `t_f4016_atendente`).
- Suíte sobre `77f5380` (reinstall em andamento durante a auditoria): <!-- ATF-HEAD -->**97 de 97 verdes** — recibo `atf/cob-regressao.json`, commit `e6e44f1` (mesmo código de `app/` que `77f5380`), resultado `ec9525d1…`, 2026-11-25T20:59:54Z, gerado pelo `npm run reinstall`. Inclui os 8 testes da F4-014 e os 3 da F4-016.<!-- /ATF-HEAD -->

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F4-016.now.ts` | Sim (falha → entregue, 4 tentativas, 1 retorno entregue) | Sim (entregue recusada; atendente recusado) | Suficiente para o núcleo. Faltam: ação de lista, botão oculto na entregue, reenvio com opt-out/teto, inscrição encerrada (BUG-001) |

> **[TST-001] Lacunas de teste do reenvio — BAIXO**
> Arquivo: `app/src/fluent/tests/US-MOD-F4-016.now.ts:74-101`
> Sem teste: visibilidade da ação de lista (`F4-016_ual_reenviar`); botão oculto em comunicação entregue; reenvio que pula canal por opt-out ou teto; reenvio de inscrição encerrada.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| `reenviar` | Parcial: quando a nova rodada não entrega, `enviar` grava `gs.warn` com comunicação, inscrição e etapa (L380-382). Não há registro de quem pediu o reenvio | Os `envio_sim` novos ficam ligados à comunicação | OBS-001 |

> **[OBS-001] Reenvio sem registro de quem pediu — BAIXO**
> Arquivo: `app/src/server/regua/ReguaMotor.server.js:392-419`
> A comunicação muda de status e soma tentativas, mas nada diz que foi um reenvio manual nem por qual usuário (só o `sys_updated_by`, sobrescrito na próxima gravação). Fix: `gs.info` com comunicação, usuário e resultado, ou anotar no `motivo` («Reenviada por …»).

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| `ReguaMotor.enviar` | Não; `enviar` não mudou. O reenvio usa o caminho «comunicação agendada é reaproveitada» | `ReguaMotor.server.js:296-317`; testes F4-011 verdes no resultado `07af1511…` |
| `ReguaMotor.encerrar` | Não mudou, mas deixa comunicações com falha elegíveis ao reenvio | BUG-001 |
| BR de controle (insert) | Não se aplica ao reenvio (update) | `business-rules/grupo-controle.now.ts:6-16` |
| BR de consulta por carteira | Não; o atendente continua restrito | `t_f4016_atendente` |

## 12. Veredito

**Resultado:** <!-- VEREDITO -->⚠️ APROVADA COM RESSALVAS<!-- /VEREDITO -->

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ (BUG-001 MÉDIO, BUG-002 BAIXO) |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |
| Recibo de ATF verde sobre o commit auditado | <!-- ATF-COND -->✅ suíte 97/97 em `e6e44f1`<!-- /ATF-COND --> |

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | BUG-001 | `ReguaMotor.server.js:401-409` | Recusar reenvio quando a inscrição não está ativa ou `motivoParada` devolve motivo; ATF RED/GREEN | Novo GAP em `outputs/spec/gaps-document.md` (a criar) |
| 2 | BUG-002 | `ReguaMotor.server.js:405-409` | Validar etapa antes de gravar, `try/catch` em `enviar`, troca de status condicional | Novo GAP em `gaps-document.md` (a criar) |
| 3 | TST-001 | `tests/US-MOD-F4-016.now.ts:74-101` | Testes da ação de lista, botão oculto na entregue, opt-out/teto e inscrição encerrada | Novo GAP em `gaps-document.md` (a criar) |
| 4 | OBS-001 | `ReguaMotor.server.js:392-419` | Registrar quem reenviou e o resultado | Novo GAP em `gaps-document.md` (a criar) |
| 5 | Recibo | `outputs/spec/auditorias/atf/` | Gerar `US-MOD-F4-016.json` (citado na isenção g3); a suíte já está verde | Pelo `npm run atf` do chamador |

> **Marcador:** pela skill, veredito diferente de BLOQUEADA manda apagar `outputs/spec/em-andamento.md` e commitar. Por instrução do chamador, esta auditoria não apagou nem commitou; fica com o chamador.

## 14. Correções depois da auditoria (implementador, mesma F5)

BUG-001, BUG-002 e OBS-001 corrigidos em `ReguaMotor.reenviar`: recusa inscrição não ativa ou com motivo de parada (ATF novo «inscrição encerrada»), erro no envio volta a comunicação a «Falha», log com quem reenviou. TST-001 fica no GAP-164. Recibo `atf/US-MOD-F4-016.json` regerado depois do reinstall final.

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@e6e44f1
achados-bloqueantes: nenhum
<!-- /gate:status -->
