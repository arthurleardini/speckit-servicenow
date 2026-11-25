# Auditoria de Entrega — [US-MOD-UX-004] Distribuir a lista do ciclo entre os atendentes

- **User Story:** US-MOD-UX-004 (nó `STORY-MOD-UX-004` no `outputs/spec/tasks.json`, sem label `fio-condutor`) — RF-MOD-UX-004 · Distribuir lista do ciclo publicado
- **Features/IDs cobertos:** RF-MOD-UX-004 · RN-NOVO-UX-006 (distribuição só da massificada, fora do grupo de controle, com dono e sem repetir) · RN-NOVO-F2-005 (controle não recebe ação) · AC-RF-MOD-UX-004-01..03 · TASK-MOD-UX-004-01 e TASK-MOD-UX-004-02 · tela TEL-009
- **Branch/commit auditado:** `feat/v0` @ `a719993` (delta `0ac5f07^..a719993 -- app/`)
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Contrato usado.** `docs/designs/ux-cobranca-v1.md`, seção final «Revisão EGM e decisões finais (v1.1)» (prevalece): R1 (sem estado novo; o ciclo ganha `distribuido_em` e `qtd_contatos`), R3 (dono do contato = `contribuinte.atendente`; sem atendente, rodízio entre usuários com o papel atendente, gravado no contato e no contribuinte) e 🟡7 (grupo de controle). Junto, o nó da US no `tasks.json` e os guardrails do `CLAUDE.md`, de `.claude/rules/harness/security.md` e de `.claude/rules/harness/servicenow-ui.md`.

> **Decisões conhecidas, não tratadas como achado.** (a) A prioridade 1–5 do contato vem do valor em aberto do contribuinte, porque o contribuinte não tem campo prioridade. (b) A regra do contato reaproveita a mensagem de RF-MOD-F2-004 («Contribuinte está no Grupo de controle do ciclo e fica fora das ações de cobrança.»), não o texto do `tasks.json`. Os prints da TEL-009 saem no fim da fase e não foram exigidos.

---

## 1. Inventário do delta
**Arquivos/módulos tocados pela US:**
| Arquivo | Papel |
|---|---|
| `app/src/server/qualificacao/QualificacaoCiclo.server.js:13-17,144-261` | Script Include (classe de servidor) do ciclo: novos `distribuir` (`:157-223`), `prioridadePorValor` (`:226`), `_atendentes` (`:236`), `_mensagemDistribuicao` (`:254`) e 3 mensagens |
| `app/src/fluent/ui-actions/ciclo.now.ts:30-50` | UI Action (botão do form) «Distribuir lista» no ciclo |
| `app/src/fluent/business-rules/grupo-controle.now.ts:30-41` | Regra de negócio (BR) antes de inserir `contato`, reaproveitando `recusarAcaoControle.server.js` |
| `app/src/fluent/tests/US-MOD-UX-004.now.ts` + `suite.now.ts` | 3 testes ATF (positivo, negativo, visibilidade do botão) |
| `app/src/fluent/generated/keys.ts` | Chaves geradas pelo build (sem lógica) |

**Endpoints alterados/criados:** nenhuma rota REST nova. Um caminho novo de gravação: o botão `x_cob_distribuir_lista` no form de `x_2326104_cob_ciclo`. A Table API de `contato` continua aberta (scaffold) e passa a ter a BR nova na inserção.
**Entidades/modelos tocados:** `ciclo` (grava `distribuido_em`, `qtd_contatos`), `contato` (insere), `contribuinte` (grava `atendente` no rodízio), `segmentacao` (lê), `sys_user_has_role` (lê).
**Stack envolvido no delta:** ServiceNow Fluent (SDK `@servicenow/sdk`), JavaScript de servidor (ES5, GlideRecord/GlideAggregate), ATF com Jasmine 3.1.

## 2. Mapa de regressão leve
| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| `recusarAcaoControle.server.js:1-9` e `QualificacaoCiclo.motivoRecusaAcao` (`:294-296`) | A mesma função agora também roda na tabela `contato` (lê `current.contribuinte` e `current.ciclo`) | médio |
| `CriterioVersao.motivoRecusaAlteracaoCiclo` (`CriterioVersao.server.js:66-80`) e BR `br_ciclo_publicado_imutavel` (`business-rules/ciclo.now.ts:6-17`) | `distribuir` atualiza um ciclo já publicado; os campos novos não podem estar na lista de protegidos | alto |
| ACL de ciclo (`security/ciclo.now.ts:8-27`) | Gravação do ciclo só em prévia; a gravação do servidor precisa passar | médio |
| ACL de contato (`security/contato.now.ts:27-36`, `security/carteira.now.ts:55-76`) | O coordenador cria contato; o atendente lê só os próprios | médio |
| `contribuinte.atendente` (o rodízio grava na carteira) | Muda o dono do contribuinte para as leituras de carteira (US-MOD-UX-006) | médio |
| Trilha do ciclo `ui/_processflow_ciclo.now.ts:20,26` | «Distribuído» depende de `distribuido_em` preenchido | baixo |

## 3. Plano de auditoria executado
**Dimensões auditadas:** conformidade, segurança (papéis, ACL, mass assignment, race condition, injeção, segredo), teste de mesa, performance, bugs, testes, observabilidade, regressão.
**Varredura determinística:** `varrer-entrega.mjs --base 0ac5f07^` → 0 achado nas linhas acrescentadas.
**Não auditado (e por quê):**
- IDOR da leitura do contato por dono: N/A, é da US-MOD-UX-006 (`TASK-MOD-UX-006-01`).
- Rate limiting: N/A, a ação é de botão para um papel interno, sem rota pública nova.
- SSRF, prompt injection, upload: N/A, o delta não aceita URL, não chama LLM, não recebe arquivo.
- Execução na instância: não feita (reinstall em andamento). A evidência de execução é o recibo ATF `outputs/spec/auditorias/atf/US-MOD-UX-004.json` (3/3 verdes, commit `182fd13`, posterior a `a719993`; `git log` mostra que os 3 arquivos do delta não mudaram depois de `0ac5f07` além do teste em `a719993`).

## 4. Conformidade
| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| R1: sem estado novo; grava `distribuido_em` e `qtd_contatos` | `QualificacaoCiclo.server.js:218-220` | ✅ PASS | O estado fica `publicado`; a trilha «Distribuído» vem da condição `distribuido_emISNOTEMPTY` |
| R3: dono do contato = `contribuinte.atendente`; sem atendente, rodízio gravado nos dois | `:192-198`, `:203` | ✅ PASS | Rodízio sobre usuários ativos com o papel atendente, em ordem de login (`:236-252`) |
| RN-NOVO-UX-006: só segmento `massificada` | `:180-184` | ✅ PASS | Filtro `segmento = massificada` na consulta |
| RN-NOVO-UX-006: nunca contribuinte do grupo de controle | `:180-184`; `grupo-controle.now.ts:30-41` | ✅ PASS | Duas camadas: o filtro e a BR do contato (🟡7) |
| RN-NOVO-UX-006: não distribui o mesmo ciclo duas vezes | `:161-164`, `:169-176`, `:188` | ✅ PASS | Recusa por `distribuido_em`; além disso pula contribuinte que já tem contato no ciclo (retomável após falha no meio) |
| RN-NOVO-UX-006: só o coordenador | `ciclo.now.ts:35`, `QualificacaoCiclo.server.js:158-160` | ✅ PASS | Papel na UI Action e conferido de novo no servidor |
| AC-01: ciclo publicado vira «Distribuído» na trilha com um clique | `ciclo.now.ts:37`; `QualificacaoCiclo.server.js:218-220` | ✅ PASS | O botão some depois de distribuir (`distribuido_em.nil()`) |
| AC-02: nenhum contribuinte do controle recebe contato | `:180-184`; `grupo-controle.now.ts:30-41` | ✅ PASS | ATF negativo cobre a BR |
| AC-03: a mensagem informa quantos contatos cada atendente recebeu | `:254-261` | ✅ PASS | «Lista distribuída: N contatos — Nome: n; …», ordenada por nome |
| Mensagem da BR do contato | `recusarAcaoControle.server.js:6` | ✅ PASS | Decisão conhecida: texto de RF-MOD-F2-004 |
| UI Action no servidor com redirecionamento (servicenow-ui.md) | `ciclo.now.ts:40-48` | ✅ PASS | Verbo de servidor com `action.setRedirectURL` |
| Recusa com log e mensagem ao usuário | `:161-164`, `ciclo.now.ts:42-46` | ⚠️ PARCIAL | Só a recusa «já distribuído» tem `gs.warn`; as recusas por papel e por falta de atendente não (OBS-001) |
| Prioridade 1–5 por faixas de valor | `:226-233` | ⚠️ PARCIAL | Cortes fixos no código (5.000 / 20.000 / 50.000 / 100.000); a spec não os define (CONF-001, só registro) |

**CA da US cumpridos?** Sim: AC-RF-MOD-UX-004-01, -02 e -03 cumpridos no código e cobertos por teste (seção 9, com lacunas parciais).
**Tecnologia fora da spec sem aprovação?** Não. Só Fluent, Script Include e ATF já usados no app.

## 5. Findings de Segurança
### 5.1 CRÍTICOS/ALTOS — bloqueantes
Nenhum.

### 5.2 MÉDIOS/BAIXOS
> **[SEC-001] Dois cliques ao mesmo tempo podem criar contatos repetidos — BAIXO** · CVSS 3.1 · OWASP A04 · STRIDE T
> Arquivo: `QualificacaoCiclo.server.js:161-176,218-220` · Contexto: `ciclo` / `contato`
> Problema: a conferência «já distribuído» e a lista de contatos existentes são lidas no começo, e `distribuido_em` só é gravado no fim (`:218`). Duas execuções que começam antes de qualquer uma terminar leem o mesmo estado e inserem contatos para os mesmos contribuintes.
> Risco: contato duplicado na carteira do atendente e `qtd_contatos` (recontado por COUNT, `:214-219`) maior que o número de contribuintes. Só o coordenador chega ao botão, então a janela é pequena.
> Fix: gravar `distribuido_em` antes do laço (e desfazer se falhar), ou travar o ciclo, ou criar índice único em `contato(ciclo, contribuinte)`.
> TDD RED: duas chamadas de `distribuir` com o ciclo lido antes de ambas (hoje só a sequência normal é testada). TDD GREEN: a segunda recusa e a contagem de contatos continua 3.
> GAP recomendado: GAP-NNN

> **[SEC-002] A BR do contato só roda na inserção — BAIXO** · CVSS 2.7 · OWASP A01 · STRIDE E
> Arquivo: `grupo-controle.now.ts:35` (`action: ['insert']`) · Contexto: `contato.contribuinte`
> Problema: trocar o `contribuinte` de um contato existente para alguém do controle não passa pela regra. O contrato 🟡7 pede «before insert», então o código segue a spec; a lacuna é do contrato.
> Risco: baixo; a ACL de campo `contribuinte` (`security/contato.now.ts:71-77`) limita essa gravação a coordenador e admin do app.
> Fix: incluir `update` com condição de mudança do campo, se o PO quiser fechar a lacuna.
> GAP recomendado: GAP-NNN, só se o PO decidir.

## 6. Testes de mesa (vetores no delta)
| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR | contato criado na carteira de outro atendente | N/A nesta US | A leitura/gravação por dono é da US-MOD-UX-006 (`security/carteira.now.ts:55-76`) |
| Auth Bypass | botão `x_cob_distribuir_lista` chamado por quem não é coordenador | ✅ BLOQUEADO | `ciclo.now.ts:35` (papel) e `QualificacaoCiclo.server.js:158-160` (`gs.hasRole`) |
| Privilege Escalation | rodízio dá papel a alguém | ✅ BLOQUEADO | `_atendentes` (`:236-252`) só lê papéis; nenhuma concessão |
| Injeção | consultas montadas com texto do usuário | ✅ BLOQUEADO | `:172`, `:181-182`, `:238-240` usam `addQuery` com valores; nada vem de entrada livre |
| Secret Exposure | segredo ou dado pessoal em log | ✅ BLOQUEADO | Logs trazem só id do ciclo, contagem e id do usuário (`:162`, `:221`); varredura sem achado |
| Mass Assignment | campos do contato gravados pelo servidor | ✅ BLOQUEADO | `status`, `tentativas`, `atendente`, `ciclo` fixos em código (`:202-208`); a ACL de campo da US-MOD-UX-002 trava a gravação manual |
| Rate Limiting | repetição do botão | N/A | Papel interno, sem rota pública; a repetição é recusada por `distribuido_em` |
| Race Condition | dois cliques ao mesmo tempo | ⚠️ PARCIAL | SEC-001 |
| Controle burlado por inserção direta | `POST` de contato para contribuinte em controle | ✅ BLOQUEADO | BR `grupo-controle.now.ts:30-41`, testada no ATF negativo |

## 7. Findings de Performance
> **[PERF-001] Consulta e gravação por contribuinte dentro do laço — BAIXO** · `QualificacaoCiclo.server.js:185-213,254-261`
> Contexto: para cada contribuinte da massificada, `p.get(pid)` (leitura), eventual `p.update()` e `c.insert()`; na mensagem, um `sys_user.get` por atendente.
> Impacto: a ação roda no clique, de forma síncrona. Para milhares de contribuintes a requisição pode estourar o tempo limite e deixar a distribuição pela metade. A retomada funciona (pula quem já tem contato), mas `distribuido_em` só é gravado no fim.
> Fix: se o volume real passar de alguns milhares, ler os contribuintes em lote ou mover para job. Não há medição de volume nos artefatos, por isso BAIXO.

## 8. Findings de Bugs Técnicos
> **[BUG-001] O rodízio recomeça no primeiro atendente a cada distribuição e ignora a carga — BAIXO** · JavaScript · `QualificacaoCiclo.server.js:178,194`
> Cenário: `vez` reinicia em 0 a cada ciclo e só conta contribuintes sem atendente. Com 3 atendentes e 4 contribuintes sem dono, o primeiro por login recebe 2 e os outros 1, sempre o mesmo. Não considera a carteira que cada um já tem.
> Consequência: desequilíbrio pequeno e repetido. A spec diz «rodízio entre os usuários com o papel atendente» e o código cumpre a letra; fica o registro.
> Fix (se o PO quiser): começar o rodízio por quem tem menos contatos.

> **[BUG-002] O dono já gravado no contribuinte não é conferido contra o papel atendente — BAIXO** · `QualificacaoCiclo.server.js:192,203`
> Cenário: se `contribuinte.atendente` aponta para um usuário sem o papel atendente (ou inativo), o contato nasce com esse dono (R3 manda copiar). Só o rodízio filtra por papel e atividade (`:236-252`).
> Consequência: o contato não aparece na «Minha lista» de quem tem o papel e fica sem trabalhar.
> Fix: conferir o dono existente contra a lista de atendentes e, se faltar, mandar para o rodízio.

## 9. Testes
**CA viraram teste?**
- AC-01 (vira «Distribuído»): parcial. O ATF positivo confere `distribuido_em` e `qtd_contatos = '3'` (`US-MOD-UX-004.now.ts:83-84`); o de UI confere que o botão aparece para o coordenador no ciclo publicado (`:221-235`). Não há teste de que o botão some depois de distribuir.
- AC-02 (controle sem contato): sim, pela distribuição (`:79`, ciclo com 2 do controle e 1 da qualificada, 0 contatos para eles) e pela BR (`:206-207`).
- AC-03 (mensagem por atendente): parcial. O teste confere o prefixo «Lista distribuída: 3 contatos» (`:77`) e que a soma de `porAtendente` é 3 (`:107-109`); não confere o trecho «Nome: n».

**TDD RED/GREEN presente?** Testes e código nasceram no mesmo commit (`0ac5f07`); `a719993` só torna o teste negativo independente da ordem dos casos do Jasmine. Não há registro de RED separado.
**Cobertura do delta:** caminho feliz e segundo clique recusado cobertos. Sem teste: recusa por papel (`:158-160`), ausência de atendente no sistema (`:165-168`), ciclo em prévia e retomada com contribuinte que já tem contato.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `US-MOD-UX-004.now.ts` (positivo, `t_ux004_pos`) | Sim: 3 contatos, dono da carteira (`demo.atendente2`, prioridade 5, valor 120000), dono com papel atendente, 0 para controle e qualificada | Não | Bom; o rodízio é verificado pelo papel do dono, não pela repartição |
| `US-MOD-UX-004.now.ts` (negativo, `t_ux004_neg`) | Sim: primeiro clique ok | Sim: segundo clique recusado com a mensagem exata e contagem estável; BR do controle recusa e a da massificada grava | Bom |
| `US-MOD-UX-004.now.ts` (UI, `t_ux004_ui`) | Sim: botão visível para o coordenador; «Publicar ciclo» não | Não | Suficiente para a visibilidade; falta o caso do atendente |

> **[TEST-001] Faltam testes de recusa por papel, de «sem atendente» e do texto da mensagem por atendente — BAIXO.** `US-MOD-UX-004.now.ts` (sem caso para `QualificacaoCiclo.server.js:158-160,165-168,254-261`). No teste negativo, o contato «aceito» usa contribuinte da qualificada (`:208-213`), não da massificada como diz a descrição do teste (`:120`).

## 10. Observabilidade
| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Distribuição concluída | Sim, `gs.info` com ciclo, contagem e usuário (`:221`) | Não | — |
| Recusa «já distribuído / não publicado» | Sim, `gs.warn` (`:162`) | Não | — |
| Recusa por papel | Não | Não | OBS-001 |
| Recusa «sem atendente» | Não | Não | OBS-001 |
| Contribuinte pulado no laço (`!p.get`, `:188`) | Não | Não | OBS-002 |
| Rodízio gravou atendente no contribuinte (`:196-197`) | Não | Não | OBS-002 |

> **[OBS-001] Recusas por papel e por falta de atendente não deixam rastro no log — BAIXO.** `QualificacaoCiclo.server.js:158-160,165-168`.
> **[OBS-002] Contribuinte pulado e atendente atribuído por rodízio não aparecem no log — BAIXO.** `:188-198`.

## 11. Regressão leve
| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| `motivoRecusaAlteracaoCiclo` e BR `br_ciclo_publicado_imutavel` | Não | `distribuido_em` e `qtd_contatos` não estão entre os protegidos; o ATF positivo grava o ciclo publicado sem recusa (recibo 3/3 verdes) |
| ACL de ciclo (só em prévia) | Não | A gravação é de servidor (`GlideRecord`), que não aplica ACL; a UI Action não depende dela |
| `recusarAcaoControle` na tabela `contato` | Não | `motivoRecusaAcao` lê `contribuinte` e `ciclo`, campos que `contato` também tem; testado em `US-MOD-UX-004.now.ts:206` |
| ACL de contato (criar só coordenador/admin) | Não | `security/contato.now.ts:27-36`; o coordenador do ATF cria via `distribuir` |
| Trilha do ciclo | Não | Condição `estado=publicado^distribuido_emISNOTEMPTY` (`_processflow_ciclo.now.ts:26`) |
| Seed do ciclo (`seed-demo/ciclo.now.ts:26,51`) | Não | Os ciclos de demonstração já trazem `distribuido_em` e `qtd_contatos`; o botão não aparece para eles |

## 12. Veredito
**Resultado:** ⚠️ APROVADA COM RESSALVAS

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

Só há findings BAIXOS. São débito a registrar em `outputs/spec/gaps-document.md`, sem travar a US.

## 13. Pontos a revisar / próximos passos
| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-001 | `QualificacaoCiclo.server.js:161-176,218-220` | Gravar `distribuido_em` antes do laço ou impedir contato repetido por ciclo e contribuinte | `outputs/spec/gaps-document.md` (GAP-NNN) |
| 2 | TEST-001 | `US-MOD-UX-004.now.ts:77,107-109,208-213` | Testar recusa por papel, «sem atendente» e o texto «Nome: n» da mensagem | `gaps-document.md` |
| 3 | BUG-002 | `QualificacaoCiclo.server.js:192,203` | Conferir se o dono já gravado no contribuinte tem o papel atendente | `gaps-document.md` |
| 4 | BUG-001 | `:178,194` | Rodízio começando por quem tem menos contatos (se o PO quiser) | `gaps-document.md` |
| 5 | PERF-001 | `:185-213` | Medir volume; ler em lote ou usar job se passar de alguns milhares | `gaps-document.md` |
| 6 | OBS-001 / OBS-002 | `:158-168,188-198` | Log das recusas por papel e sem atendente, e do rodízio | `gaps-document.md` |
| 7 | SEC-002 | `grupo-controle.now.ts:35` | Incluir `update` na BR do contato, se o PO quiser | `gaps-document.md` |
| 8 | CONF-001 | `QualificacaoCiclo.server.js:226-233` | Registrar na spec os cortes da prioridade | `gaps-document.md` |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@a719993
achados-bloqueantes: nenhum
<!-- /gate:status -->
