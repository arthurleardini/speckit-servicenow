# Auditoria de Entrega — [US-MOD-F4-014] Execuções visíveis e edição no Flow Designer

- **User Story:** US-MOD-F4-014 (nó `STORY-MOD-F4-014` no `outputs/spec/tasks.json`, depende da STORY-MOD-F4-013) — RF-MOD-F4-001, RF-MOD-F4-002
- **Features/IDs cobertos:** RN-NOVO-F4-015 (execução da régua visível e editável) · AC-RF-MOD-F4-014-01 a -04 · TASK-MOD-F4-014-01 e -02 · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2 (A1, B5, B6, B9, D12, D15) · GAP-162
- **Branch/commit auditado:** `feat/v0` @ `e6e44f1` (código de `app/` igual ao de `77f5380`; documentos em `e6e44f1`). Delta: `git diff ac7a0cc..e6e44f1 -- app outputs/spec/data-model.json` (sem o gerado `generated/keys.ts`). O código da F4-014 está em `a95f44f`, `0bd02a5` e `77f5380`; os dois últimos também carregam a US-MOD-F4-016 (relatório próprio).
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL` registrada no marcador `outputs/spec/em-andamento.md`, seguida por delegação do dono.

> **Recibo de ATF:** ver seção 9. O recibo da story no disco (`atf/US-MOD-F4-014.json`) é do commit `a95f44f` e marca 7 de 8 testes verdes; a suíte `cob-regressao.json` é do commit `0bd02a5` e marca falha. As duas falhas foram corrigidas no `77f5380`. A suíte rodada depois (commit `e6e44f1`, que tem o código do `77f5380`) passou 97 de 97 (seção 9). O recibo da story continua desatualizado.

---

## 1. Inventário do delta

**Arquivos tocados pela US** (cada um com o papel dele):
- `app/src/fluent/ui-actions/regua.now.ts:76-123` — dois links novos no form da régua: «Ver execuções» (`F4-014_ua_ver_execucoes`) e «Abrir no Flow Designer» (`F4-014_ua_abrir_designer`). Papéis coordenador e admin do app.
- `app/src/fluent/ui-actions/inscricao.now.ts` (novo) — link «Ver execução» no form da inscrição (`F4-014_ua_ver_execucao`). Sem execução, mostra «Execução não encontrada.» e fica no form.
- `app/src/server/regua/ReguaMotor.server.js` — o motor da régua (Script Include, classe de servidor chamada pelas ações). Novos: `flowDaRegua` (L789, acha o Flow da régua pelo campo «Flow» ou, vazio, pelo nome interno `regua_<codigo>`), `urlExecucoes` (L805), `urlDesigner` (L816), `urlExecucao` (L827) e as mensagens `MSG_SEM_EXECUCAO` e `MSG_SEM_FLOW`.
- `app/src/fluent/security/coordenador-flow.now.ts` (novo) — quatro registros `sys_user_role_contains` (tabela que diz que um papel contém outro): coordenador e admin do app passam a conter `flow_designer` e `flow_operator`.
- `app/src/fluent/security/contato.now.ts:132-143` — ACL (regra de acesso) de campo nova: só o admin do app grava «Origem» do contato à mão. É correção da F5 sobre a US-MOD-F4-012, entregue e testada nesta US.
- `outputs/spec/data-model.json` — descrição do campo `origem` do contato.
- `app/src/fluent/tests/US-MOD-F4-014.now.ts` (8 testes ATF — o teste automatizado da plataforma) e `tests/suite.now.ts`.

**Endpoints alterados/criados:** nenhuma API REST própria. Os três links só montam um endereço e redirecionam.

**Entidades/modelos tocados:** leitura de `x_2326104_cob_regua`, `x_2326104_cob_regua_inscricao`, `sys_hub_flow` (Flows) e `sys_flow_context` (execuções de Flow); gravação em `sys_user_role_contains` (pelo install), `sys_ui_action` e `sys_security_acl`.

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3), JavaScript de servidor no Script Include, UI Action da Core UI clássica, ACL, ATF.

**Varredura determinística** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo ac7a0cc --repo app`): 11 arquivos mudados, 0 achados.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| Papel `x_2326104_cob.coordenador` e `x_2326104_cob.admin` | Passam a herdar `flow_designer` e `flow_operator` (e o que eles contêm) | médio |
| Papel `x_2326104_cob.atendente` | Não pode herdar nada de Flow | baixo |
| ACL de campo `regua.flow` (só admin grava, B5) | Com `flow_operator`, o coordenador passa a ler o campo; a escrita precisa continuar recusada | baixo |
| ACL curinga de escrita do contato e `QualificacaoCiclo._criarContato` / `ReguaMotor.escalonar` | A ACL nova de «Origem» pode travar quem grava o campo | médio |
| `ua_pausar_regua` / `ua_ativar_regua` no mesmo arquivo `regua.now.ts` | Links novos no mesmo form | baixo |
| Suíte `cob-regressao` | 8 testes novos na suíte | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (A1, B5, B6, B9, D12, D15; os 4 critérios de aceite; RN-NOVO-F4-015); segurança (herança de papéis de Flow, ACL de «Origem», quem vê os links); teste de mesa sobre o código real; performance (consultas novas a `sys_hub_flow` e `sys_flow_context`); bugs técnicos; testes (8 ATF); observabilidade; regressão nos vizinhos.

**Fontes de evidência além do código:** prints `outputs/spec/screens/ux-v2/F4-014-*.png`, `docs/designs/review-ux/f0-spike-resultados.md` (ponto 5), GAP-162 em `outputs/spec/gaps-document.md`, especificação funcional 0.3, consultas só de leitura aos resultados de ATF na instância.

**Não auditado (e por quê):**
- Edição real de um Flow pelo coordenador no Designer: o auditor não altera a instância. A evidência é o ponto 5 da F0 e o print do Workflow Studio com «Edit flow» para `demo.coordenador`.
- Execução de ponta a ponta da régua IPVA em até 40 minutos (AC-04): o motor do Flow não mudou nesta US. A evidência é `outputs/spec/auditorias/F4-012-execucao-demo.md` (35 min 36 s).
- Injeção, mass assignment, rate limiting, race condition, SSRF: os links não recebem texto do usuário nem gravam dado de negócio.

## 4. Conformidade

Verificado contra o design v2.2, o `data-model.json`, `.claude/rules/harness/servicenow-ui.md`, o `CLAUDE.md` e a ficha da US.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| A1: «Ver execuções», link na régua, `!current.isNewRecord()`, coordenador, ordem 300, lista `sys_flow_context` | `ui-actions/regua.now.ts:79-100`; `ReguaMotor.server.js:805-813` | ⚠️ PARCIAL | O filtro usa o Flow da régua (`flow=<sys_id>`) e só cai em `name=Régua: <nome>` quando não acha Flow. A1 manda filtrar pelo nome. Ver CONF-001 |
| A1: «Abrir no Flow Designer», condição `!current.flow.nil()`, ordem 310, `$flow-designer.do#/flow-designer/<flow>` | `ui-actions/regua.now.ts:102-123`; `ReguaMotor.server.js:816-819` | ✅ PASS | Condição também exclui registro novo |
| A1/D12: «Ver execução» abre `/$flow-designer.do#/operations/context/<sys_id>`; sem contexto, «Execução não encontrada» | `ui-actions/inscricao.now.ts:20-28`; `ReguaMotor.server.js:827-842` | ⚠️ PARCIAL | Com `flow_admin` (o admin), abre o stage tracker. O coordenador abre o form clássico da execução (estado, tempo, log), porque o stage tracker lê tabelas que a plataforma só abre a `flow_admin`. Divergência registrada no GAP-162 (decisão em aberto) e na especificação funcional 0.3; o design v2.2 não foi atualizado. Ver CONF-002 |
| A1: papéis «coordenador» | as três UI Actions | ✅ PASS | Coordenador e admin do app; o admin vê os mesmos links |
| B5: `regua.flow` só leitura para o coordenador | ACL existente; teste `t_f4014_campo_flow` | ✅ PASS | ATF confirma que a escrita é recusada e a leitura agora funciona |
| B6 mecanismo 1: `sys_user_role_contains` por nome, em `coordenador-flow.now.ts`, sem sys_id fixo | `security/coordenador-flow.now.ts:11-45` | ✅ PASS | Igual ao desenho |
| B6: aviso do reinstall no roteiro | `outputs/spec/demo/roteiro.md:9, 119-126` | ✅ PASS | |
| B9: ATF «coordenador vê os dois links» | `tests/US-MOD-F4-014.now.ts:9-41` | ✅ PASS | Mais negativo do atendente, régua sem Flow, endereços, papéis e campo Flow |
| D15: coordenador edita o Flow no Designer | `coordenador-flow.now.ts`; print `F4-014-flow-designer.png` | ✅ PASS | Print com «Edit flow» para `demo.coordenador`; F0 ponto 5 |
| Guardrail: mensagem ao usuário com texto traduzível (`servicenow-ui.md`) | `ReguaMotor.server.js:55-56` | ⚠️ PARCIAL | Literal fixo, mesmo padrão das mensagens anteriores do motor. Ver CONF-003 |
| Guardrail: sem sys_id nem URL de instância fixos | delta inteiro | ✅ PASS | Endereços relativos; Flow achado por nome |
| `$id` com o ID da spec | delta inteiro | ✅ PASS | `F4-014_*` |
| ACL de «Origem» (correção F5) | `security/contato.now.ts:135-143` | ✅ PASS | Fora do escopo original da US, declarada no commit e no `data-model.json`; testada |

**Critérios de aceite da US:**
- **AC-RF-MOD-F4-014-01** («Ver execuções» e «Abrir no Flow Designer» abrem a partir do form da régua): ✅ cumprido — código, ATF de visibilidade e de endereço, prints `F4-014-regua-ipva-coordenador.png` e `F4-014-ver-execucoes.png`.
- **AC-RF-MOD-F4-014-02** («Ver execução» abre os detalhes da execução da inscrição, ou avisa que não há): ⚠️ cumprido com ressalva — para o coordenador, «detalhes» é o form clássico da execução, não o stage tracker (GAP-162, decisão pendente). O aviso sem execução está testado e no print `F4-014-ver-execucao-sem-execucao.png`.
- **AC-RF-MOD-F4-014-03** (o coordenador abre e edita o Flow no Designer): ✅ cumprido — papel herdado (ATF `t_f4014_papel`), print do Workflow Studio com «Edit flow», F0 ponto 5.
- **AC-RF-MOD-F4-014-04** (régua IPVA encaminha em até 40 minutos): ✅ cumprido por evidência anterior (F4-012, 35 min 36 s); o delta não toca o Flow nem o motor de envio.

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] Papéis de Flow herdados pelo coordenador valem para a instância toda, sem registro de risco — MÉDIO** · CVSS 4.7 (AV:N/AC:L/PR:H/UI:N/S:U/C:L/I:L/A:L) · OWASP A01 (controle de acesso) · STRIDE E (elevação de privilégio)
> Arquivo: `app/src/fluent/security/coordenador-flow.now.ts:11-27` · Contexto: papel `x_2326104_cob.coordenador`
> **Problema:** o papel do coordenador passa a conter `flow_designer` e `flow_operator`. Esses papéis não são limitados ao app: o coordenador pode abrir, criar e editar Flows nos escopos em que a plataforma deixa, e cancelar ou reiniciar execuções de Flow (os botões «Cancel» e «Restart» aparecem no print `F4-014-ver-execucao.png`). A F0 mostrou que `demo.coordenador` herda também `flow_write_enabled` e outros papéis contidos. A decisão de dar o papel é do dono (D15, CHG-020); o que falta é o registro do alcance dela como risco aceito.
> **Risco:** um coordenador pode alterar ou parar Flows que não são de régua, e Flow roda por padrão como usuário de sistema. Na PDI com dado fictício o impacto é baixo; em produção, é acesso além da função.
> **Fix:** registrar o alcance como risco aceito num GAP; para produção, avaliar papel restrito ao escopo ou mecanismo 3 de B6 (coordenador só lê; edição pelo admin).
> **TDD RED:** teste que, impersonado como coordenador, tenta gravar um `sys_hub_flow` de outro escopo e espera recusa. **TDD GREEN:** o mesmo teste passa depois da restrição, se adotada.
> **GAP recomendado:** novo GAP em `outputs/spec/gaps-document.md` («Alcance de flow_designer/flow_operator no papel do coordenador — risco aceito na PDI»). Não registrado por esta auditoria.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| IDOR (um usuário acessa registro de outro) | «Ver execução» numa inscrição de outra carteira | ✅ BLOQUEADO | O link só aparece a coordenador e admin, que leem todas as carteiras (B5); a leitura da inscrição segue a ACL e a regra de consulta por carteira da F4-013 |
| Auth Bypass | Atendente chama os links | ✅ BLOQUEADO | `roles` nas três UI Actions; ATF `t_f4014_links_atendente` |
| Privilege Escalation | Atendente herdando papel de Flow | ✅ BLOQUEADO | ATF `t_f4014_papel` (demo.atendente sem `flow_designer`/`flow_operator`) |
| Privilege Escalation | Coordenador com papéis de Flow além do app | ⚠️ ACEITO POR DECISÃO | SEC-001 |
| Privilege Escalation | Coordenador grava o campo «Flow» da régua | ✅ BLOQUEADO | ATF `t_f4014_campo_flow` («não grava o campo Flow») |
| Privilege Escalation | Atendente ou coordenador troca «Origem» do contato | ✅ BLOQUEADO | `contato.now.ts:135-143`; ATF `t_f4014_origem_atendente` e `_coordenador` |
| Injeção / open redirect | Endereço montado com nome da régua | ✅ BLOQUEADO | Filtro passa por `encodeURIComponent` (`ReguaMotor.server.js:812`); demais endereços só usam sys_id |
| Secret Exposure | — | N/A | Nenhum segredo no delta |
| Mass Assignment | — | N/A | Links não gravam |
| Rate Limiting | — | N/A | Sem rota pública nova |
| Race Condition | — | N/A | Nada é gravado pelos links |

## 7. Findings de Performance

Nenhum finding. `urlExecucao` (L831-837) consulta `sys_flow_context` por `source_record`, ordena por data e limita a 1; `flowDaRegua` lê um registro por sys_id e, no plano B, um Flow por `internal_name` com `setLimit(1)`. Cada clique faz no máximo três leituras. O volume de execuções na PDI é pequeno; a existência de índice em `sys_flow_context.source_record` não foi conferida.

## 8. Findings de Bugs Técnicos

Nenhum bug no código novo. Observação fora do delta: o log da execução no print `F4-014-ver-execucao.png` traz o aviso «Encountered undeclared output variable: comunicacao» da ação «Régua: enviar comunicação» (F4-011). Não afeta esta US.

## 9. Testes

**CA viraram teste?**
- AC-01: sim — `t_f4014_links_coordenador`, `t_f4014_sem_flow`, `t_f4014_enderecos` («Ver execuções filtra pelo Flow», «Abrir no Flow Designer», «plano B»).
- AC-02: sim, com ressalva — sem execução: `t_f4014_sem_flow`. Com execução: `t_f4014_enderecos` (admin) e `t_f4014_campo_flow` (coordenador), mas as duas verificações só rodam se já houver execução na instância (TST-001).
- AC-03: sim para o papel (`t_f4014_papel`); a edição no Designer não cabe em ATF (evidência por print e F0).
- AC-04: não é desta US (evidência F4-012).

**TDD RED/GREEN presente?** Sim no histórico: o recibo de `a95f44f` mostra `t_f4014_enderecos` vermelho (o jasmine roda os casos em ordem aleatória e o plano B alterava a régua compartilhada); `77f5380` corrigiu.

**Recibos:**
- `outputs/spec/auditorias/atf/US-MOD-F4-014.json`: commit `a95f44f`, 7 de 8 verdes (`t_f4014_enderecos` falhou).
- `outputs/spec/auditorias/atf/cob-regressao.json`: commit `0bd02a5`, falha. Na instância (consulta só de leitura ao resultado de suíte `07af1511…`): 95 de 97 verdes; falharam `t_f4014_enderecos` e `t_f4016_atendente`, os dois corrigidos no `77f5380`.
- Suíte sobre `77f5380` (reinstall em andamento durante a auditoria): <!-- ATF-HEAD -->**97 de 97 verdes** — recibo `atf/cob-regressao.json`, commit `e6e44f1` (mesmo código de `app/` que `77f5380`), resultado `ec9525d1…`, 2026-11-25T20:59:54Z, gerado pelo `npm run reinstall`. Inclui os 8 testes da F4-014 e os 3 da F4-016.<!-- /ATF-HEAD -->

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F4-014.now.ts` | Sim (links, endereços, papel, leitura do campo) | Sim (atendente sem links, régua sem Flow, inscrição sem execução, escrita do campo Flow e de «Origem» recusada) | Bom. Ressalva TST-001 |

> **[TST-001] Verificação de «Ver execução» com execução depende de dado da instância — BAIXO**
> Arquivo: `app/src/fluent/tests/US-MOD-F4-014.now.ts:177-185` e `:268-277`
> Quando não há nenhuma execução de régua na instância, o `if (c.next())` pula a asserção e o teste passa sem verificar o endereço. Fix: criar o contexto pelo `sn_fd.FlowAPI` numa régua de teste, ou falhar quando não houver execução.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| «Ver execuções», «Abrir no Flow Designer», «Ver execução» | Não (só redirecionam, nada gravam) | N/A | — |
| Concessão de papéis de Flow | Pelo install (`sync-log.md`) e pela auditoria de papéis da plataforma | N/A | — |

Sem finding: operações só de navegação.

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| Papéis coordenador e admin | Ganham os papéis de Flow, como previsto | `t_f4014_papel`; SEC-001 |
| Papel atendente | Não | `t_f4014_papel` |
| ACL de `regua.flow` | Não; a leitura passou a funcionar, a escrita continua recusada | `t_f4014_campo_flow` |
| Gravação de «Origem» pelo motor e pela distribuição | Não; `_criarContato` usa `GlideRecord` (sem ACL) | `QualificacaoCiclo.server.js` (`_criarContato`); suíte com os testes F4-012/UX-004 verdes no resultado `07af1511…` |
| Pausar/Ativar no form da régua | Não | Testes F4-012 verdes no mesmo resultado de suíte |

## 12. Veredito

**Resultado:** <!-- VEREDITO -->⚠️ APROVADA COM RESSALVAS<!-- /VEREDITO -->

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ (AC-02 com ressalva do GAP-162) |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |
| Recibo de ATF verde sobre o commit auditado | <!-- ATF-COND -->✅ suíte 97/97 em `e6e44f1`<!-- /ATF-COND --> |

Ressalvas: SEC-001 (MÉDIO), CONF-001 (BAIXO), CONF-002 (MÉDIO), CONF-003 (BAIXO), TST-001 (BAIXO).

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-001 | `security/coordenador-flow.now.ts:11-27` | Registrar o alcance de `flow_designer`/`flow_operator` na instância como risco aceito na PDI | Novo GAP em `outputs/spec/gaps-document.md` (a criar) |
| 2 | CONF-002 | `ReguaMotor.server.js:840-841` | Decidir o GAP-162 e atualizar A1/D12 do design (stage tracker só com `flow_admin`; coordenador vê o form da execução) | GAP-162 (já existe, decisão em aberto) |
| 3 | CONF-001 | `ReguaMotor.server.js:811` | Atualizar A1 do design: «Ver execuções» filtra pelo Flow da régua e usa o nome só como reserva | Changelog do design ou GAP novo |
| 4 | CONF-003 | `ReguaMotor.server.js:55-56` | Mensagens novas como texto traduzível (`gs.getMessage`), junto com as antigas do motor | Novo GAP em `gaps-document.md` (a criar) |
| 5 | TST-001 | `tests/US-MOD-F4-014.now.ts:177-185, 268-277` | Garantir uma execução no próprio teste ou falhar sem ela | Novo GAP em `gaps-document.md` (a criar) |
| 6 | Recibo | `outputs/spec/auditorias/atf/US-MOD-F4-014.json` | Regerar o recibo da story (o do disco é de `a95f44f`, 7/8); a suíte já está verde | Pelo `npm run atf` do chamador |

> **Marcador:** pela skill, veredito diferente de BLOQUEADA manda apagar `outputs/spec/em-andamento.md` e commitar. Por instrução do chamador, esta auditoria não apagou nem commitou; fica com o chamador.

## 14. Depois da auditoria (implementador, mesma F5)

SEC-001, CONF-001, CONF-003 e TST-001 registrados no GAP-163; CONF-002 no GAP-162. Recibo `atf/US-MOD-F4-014.json` regerado depois do reinstall final.

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@e6e44f1
achados-bloqueantes: nenhum
<!-- /gate:status -->
