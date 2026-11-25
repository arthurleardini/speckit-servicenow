# Auditoria de Entrega — [US-MOD-F4-010] Régua como Flow: modelo, gerador, custom actions, validação da etapa e ACLs

- **User Story:** US-MOD-F4-010 (nó `STORY-MOD-F4-010` no `outputs/spec/tasks.json`, sem label `fio-condutor`, depende da STORY-MOD-UX-010) — RF-MOD-F4-001, RF-MOD-F4-002
- **Features/IDs cobertos:** RN-NOVO-F4-009 (inscrição na régua na publicação do ciclo — nesta US, só o modelo e a recusa de controle) · RN-NOVO-F4-010 (sequência da etapa e sigilo no texto) · RN-NOVO-F4-001 (escalonamento — nesta US, só o contrato da action) · RN-NOVO-F2-005 (grupo de controle fora das ações) · AC-RF-MOD-F4-010-01 a -04 · TASK-MOD-F4-010-01 a -05 · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2 (B1, B2, B3, B5, B8, B9, D6 a D12, D17, D18, Anexo A) e `docs/designs/review-ux/f0-spike-resultados.md`
- **Branch/commit auditado:** `feat/v0` @ `7c9e4dd`. Delta: `git log 7380c49..7c9e4dd`. Commits desta US: `492b18b` (código), `43adda4`, `f047917`, `75569db`, `4bae381`, `7c9e4dd` (só o ATF da US). O recibo ATF `outputs/spec/auditorias/atf/US-MOD-F4-010.json` foi gerado no commit `7c9e4dd` (8/8 `success`).
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Escopo F2.** A US é a fase F2 do design: modelo, `reguas.json`, gerador e seed, as 4 custom actions com o contrato final, os 5 Flows, `validarEtapa` (a regra que valida a etapa ao gravar), ACLs de régua e etapa e a propriedade `segundos_por_dia`. Guardas e envio são da US-MOD-F4-011 (auditoria própria). `inscrever`, `reavaliar`, pausa e escalonamento são da F4-012; parcelamento em risco e a restrição de leitura da inscrição por carteira são da F4-013.

> **Isenção g3:** `outputs/spec/auditorias/_isencoes/US-MOD-F4-010-g3.md` dispensa só os validadores de LLM. Build, install e ATF continuam obrigatórios e estão no recibo.

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL` registrada no marcador `outputs/spec/em-andamento.md`, seguida por delegação do dono.

---

## 1. Inventário do delta

**Arquivos/módulos tocados pela US** (cada um com o papel dele):
- `outputs/spec/reguas.json` — as 5 réguas (uma por carteira), com etapas, dia, canal, postura, ação sem resposta e texto. É a fonte do gerador.
- `app/scripts/gerar-flows-regua.mjs` (+ `gerar-flows-regua.test.mjs`) — lê `reguas.json`, repete as validações da etapa (D17) e escreve os 5 Flows e o seed de régua e etapa. Apaga só o Flow que ele mesmo gerou quando a régua sai do JSON; régua com `flowManual` não tem o Flow reescrito.
- `app/src/fluent/flows/regua-{parcelamentos,ipva,itcd,icms-normal,icms-st}.now.ts` — os 5 Flows «Régua: <nome>», gerados. Gatilho na criação da inscrição (`regua.codigo=<codigo>^status=ativa`, em background, como system); um stage por etapa e o stage «Encaminhamento»; `tryCatch` que grava `status = erro` na inscrição.
- `app/src/fluent/actions/regua.now.ts` + `app/src/server/regua/acao-{agendar-etapa,checar-guardas,enviar-comunicacao,escalonar}.js` — as 4 custom actions (ações reutilizáveis do Flow Designer). Cada uma só chama o `ReguaMotor`, registra `gs.error` e relança o erro.
- `app/src/server/regua/ReguaMotor.server.js` (L1-127, L369-466 nesta US) + `script-includes/regua-motor.now.ts` — `agendar`, `escalonar` mínimo (contrato), padrões da inscrição, validação da régua (código único, prazo final) e da etapa (D17).
- `app/src/server/regua/validarEtapa.server.js` + `business-rules/regua.now.ts` — 4 business rules (regras que rodam no servidor em toda gravação): validar etapa, validar régua, inscrição nasce ativa, inscrição de contribuinte em controle recusada (reusa `recusarAcaoControle.server.js`).
- `app/src/fluent/security/regua.now.ts` — ACL (regra de acesso da plataforma) de escrita em régua e etapa: coordenador e admin do app gravam; `codigo`, `carteira`, `flow` da régua e `regua`, `ordem` da etapa só o admin do app.
- `app/src/fluent/security/acl-base.now.ts:211-226` — leitura da inscrição para atendente, coordenador e admin.
- `app/src/fluent/properties/regua.now.ts` — propriedade `x_2326104_cob.regua.segundos_por_dia = 60`.
- Tabelas: `tables/regua_inscricao.now.ts` (nova), `regua.now.ts` (+`codigo`, `prazo_final_dias`, `flow`), `regua_etapa.now.ts` (+`postura`, +`encaminhar_ativa`, rótulo «Dia (D+n)»), `comunicacao.now.ts` e `simulations/envio_sim.now.ts` (+`inscricao`), `contato.now.ts` (+`origem`, +`inscricao`).
- Telas: `ui/TEL-013`, `TEL-014`, `TEL-035`, `TEL-037` (nova), `TEL-038` (nova), `_form_comunicacao`, `_form_envio_sim`, `_form_regua_etapa`, `ui/regua-related-lists.now.ts` (related lists da régua e da inscrição); `navigation/menu.now.ts` (módulo «Inscrição na régua» em Administração).
- Seed: `seed/{regua,regua_etapa,canal_sim,comunicacao,envio_sim,consentimento,_journal}.now.ts` apagados (seed aleatório); `seed/regularizacao.now.ts` regerado; `seed-demo/{regua,canal_sim,consentimento,contato,debito,inscricao}.now.ts` novos; `app/scripts/gerar-seed-demo.mjs`; `_contagem*.json`.
- `outputs/spec/data-model.json`, `outputs/spec/screens-manifest.json`; testes `tests/US-MOD-F4-010.now.ts` (8 testes ATF) e `tests/suite.now.ts`.

**Endpoints alterados/criados:** nenhuma API REST própria. A tabela nova `regua_inscricao` nasce com `allowWebServiceAccess: true` (Table API da plataforma, sujeita às ACLs). Chamada por script: `sn_fd.FlowAPI.getRunner().action('x_2326104_cob.regua_*')`.

**Entidades/modelos tocados:** `x_2326104_cob_regua_inscricao` (nova), `_regua`, `_regua_etapa`, `_comunicacao`, `_envio_sim`, `_contato`, `_canal_sim`, `_consentimento`, `_debito` (seed demo), `sys_hub_flow`, `sys_hub_action_type_definition`, `sys_security_acl`, `sys_properties`, `sys_ui_related_list`.

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3, `@servicenow/sdk/automation` para Flow e Action), JavaScript de servidor (Rhino) no Script Include e nas business rules, ACL, Core UI clássica, Node.js no gerador, ATF.

**Varredura determinística** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 7380c49 --repo app`): 51 arquivos mudados, 0 achados.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| `server/qualificacao/recusarAcaoControle.server.js` (recusa ação para contribuinte do grupo de controle) | Passa a rodar também no insert de `regua_inscricao` | médio |
| Seed gerado (`sn-seed`) de regularização e das tabelas que apontam para régua, etapa, canal, comunicação, envio e consentimento | As 6 tabelas foram para `seedManual`; a reference de regularização para comunicação ficou vazia e o sorteio da tabela mudou | médio |
| `ui/list-controls.now.ts` (UX-009: botão New só do admin em régua, etapa e related list de etapas) | Related lists novas no form da régua | baixo |
| `menu.now.ts` (ordem dos módulos de Administração) | Módulo novo desloca a ordem dos seguintes | baixo |
| `tests/US-MOD-UX-004.now.ts` (distribuição do ciclo) | O design afirma que nenhum `it()` muda (B3) | baixo |
| `server/carteira/restringirConsultaCarteira.server.js` (filtro de consulta por carteira do atendente) | A tabela nova `regua_inscricao` ainda não está no mapa `DONO` (é da F4-013) | médio |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (B1, B2, B3, B5, B8, B9, D6 a D12, D17, D18, Anexo A, allowlist; AC -01 a -04; RN-NOVO-F4-010, RN-NOVO-F2-005); segurança (escrita por papel em régua e etapa, leitura da inscrição, execução do Flow como system, sigilo fiscal no texto de canal informal); teste de mesa sobre o código e o seed reais; performance (consultas por gravação de etapa e por passo do Flow); bugs técnicos (fuso de data, tipo da ordem, padrões); testes (ATF e `node --test`); observabilidade (log nos passos e nas recusas); regressão nos vizinhos.

**Não auditado (e por quê):**
- Guardas, envio, fallback, teto e idempotência: são da US-MOD-F4-011 (relatório próprio). Aqui só se confere que o contrato das actions está no lugar.
- Inscrição pela publicação do ciclo, reavaliação, pausa, escalonamento real: F4-012. Parcelamento em risco e restrição de leitura por carteira: F4-013. Links do Flow Designer e papel do coordenador no Designer: F4-014.
- Rate limiting: não há rota nova chamada por usuário; o Flow dispara uma vez por inscrição criada.
- SSRF, prompt injection: não há URL vinda do usuário nem LLM.
- Execução do Flow de ponta a ponta com espera: o design (B9) diz que não cabe em ATF e é conferida na instância; o auditor não acessa a instância.

## 4. Conformidade

Verificado contra o design v2.2, a F0, o `data-model.json`, `.claude/rules/harness/servicenow-ui.md`, o `CLAUDE.md` e os critérios e regras do nó da US.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| B1: `regua_inscricao` com as 13 colunas, display contribuinte, audit | `tables/regua_inscricao.now.ts:5-37` | ✅ PASS | Inclui `comentarios` (journal) pela regra de UI |
| B1: régua + `codigo` (40, obrigatório), `flow`, `prazo_final_dias` (obrigatório) | `tables/regua.now.ts:13,22,25` | ✅ PASS | Padrão 5 vem de BR (desvio 6, declarado) |
| B1: etapa + `postura`, + `encaminhar_ativa`, rótulo «Dia (D+n)» | `tables/regua_etapa.now.ts:14,22-33` | ✅ PASS | |
| B1: `inscricao` em comunicação, envio e contato; `origem` no contato | `comunicacao.now.ts:33`, `envio_sim.now.ts:25`, `contato.now.ts:45-49` | ✅ PASS | |
| B1: `contribuinte.encaminhado_qualificada_em` | — | ⚠️ PARCIAL | Adiado para a F4-012 (desvio 1, já declarado pelo implementador): coluna nova regera o seed de contribuinte. Só a F4-012 lê a coluna; nada nesta US depende dela |
| B1: propriedade `segundos_por_dia = 60` | `properties/regua.now.ts:6-12` | ✅ PASS | |
| D18: `ordem_fallback` sai de lista e form, coluna fica | `ui/TEL-013.now.ts:8`, `ui/TEL-014.now.ts:12` | ✅ PASS | |
| D8: Flows e seed de régua gerados de `reguas.json` | `app/scripts/gerar-flows-regua.mjs`, `seed-demo/regua.now.ts` | ✅ PASS | 5 réguas; ITCD encaminha à qualificada, como o design pede |
| B2: gatilho na criação, `condition` por código e status, background, system | `flows/regua-ipva.now.ts:12,22-23` | ✅ PASS | Igual nos 5 |
| B2: etapa k = agendar → espera relativa → guardas → enviar; fecho = agendar(N+1) → espera → guardas → escalonar; `tryCatch` grava erro | `flows/regua-ipva.now.ts:25-113` | ✅ PASS | Confere com o Anexo A |
| D11: espera relativa com `Duration({seconds:1})` e `relativeDatetime` por pill; `executar_em` como `GlideDateTime` | `flows/regua-ipva.now.ts:33-35`, `ReguaMotor.server.js:118-126` | ✅ PASS | F0 ponto 1 |
| B3: 4 actions com `internalName`, entradas e saídas do contrato | `actions/regua.now.ts:8-121` | ✅ PASS | |
| B3: script de passo com `parseInt(inputs.ordem)`, `gs.error` e relança | `server/regua/acao-*.js` | ✅ PASS | |
| B3: `agendar` — inscrição não ativa → `segue=false` sem gravar; etapa real grava `etapa_atual` e `proxima_etapa_em`; fecho usa `prazo_final_dias` | `ReguaMotor.server.js:94-127` | ✅ PASS | |
| B3: `escalonar` com contrato final, regra mínima (F2) | `ReguaMotor.server.js:370-372` | ✅ PASS | Desvio 5, declarado; é o que a F2 do design pede |
| D17 / RN-NOVO-F4-010: postura não regride nem salta | `ReguaMotor.server.js:449-461` | ✅ PASS | Confere contra a anterior e a seguinte |
| D17: dia depois da etapa anterior | `ReguaMotor.server.js:462-464` | ✅ PASS | |
| D17: só a última encaminha; a última precisa encaminhar | `ReguaMotor.server.js:440-448` | ⚠️ PARCIAL | Na alteração, as duas regras valem. Na criação, só «encaminhar fora da última» vale: uma etapa nova inserida como última sem encaminhar passa quando a anterior também não encaminha (CONF-001). Só o admin cria etapa e o gerador valida a régua inteira |
| D17: sem `R$`, `{valor}`, `{debito}`, `{tributo}` no texto de e-mail, SMS e WhatsApp | `ReguaMotor.server.js:36,420-422` | ✅ PASS | |
| B4: inscrição de contribuinte em controle recusada pela BR que já protege comunicação e contato | `business-rules/regua.now.ts:44-54` | ✅ PASS | Sem ciclo, a regra olha todos os ciclos publicados (desvio 7, declarado). Só fica mais restritiva que o design |
| B5: write de régua e etapa para coordenador e admin; `codigo`, `carteira`, `flow`, `regua`, `ordem` só admin | `security/regua.now.ts:10-96` | ✅ PASS | |
| B5: read de `regua_inscricao` para as 3 personas; sem create/write/delete | `security/acl-base.now.ts:211-226` | ✅ PASS | O deny por carteira é da F4-013 (ver SEC-001) |
| D12: related lists de comunicações e retornos no form da inscrição; etapas e inscrições no form da régua | `ui/regua-related-lists.now.ts:7-47` | ✅ PASS | Arquivo fora da allowlist (desvio 3, declarado). A regra de UI pede related lists embutidas |
| Regra de UI: `$id` do registro demo `<TEL>_registro_demo` | `seed-demo/regua.now.ts` (`TEL-014_registro_demo`), `seed-demo/inscricao.now.ts:7` (`TEL-038_registro_demo`) | ✅ PASS | A régua IPVA usa o id do registro demo e não `seed_regua_ipva` da task (desvio 4, declarado) |
| `seedManual` += régua, etapa, canal, consentimento, comunicação, envio | `data-model.json:3899+` | ✅ PASS | Também `regua_inscricao` (desvio 2, declarado: evita 50 inscrições aleatórias disparando Flow) |
| Allowlist do design | — | ⚠️ PARCIAL | Fora dela: `ui/regua-related-lists.now.ts`, `seed-demo/debito.now.ts`, `seed-demo/inscricao.now.ts` (desvio 3, declarado). Nenhum outro arquivo de código fora |
| Fase F2 «verde quando»: teste do gerador verde | `node --test app/scripts/gerar-flows-regua.test.mjs` | ✅ PASS | 6/6, rodado pelo auditor |
| Fase F2: `npm test` sem falha nova | `npm test` | ✅ PASS | Há falhas em testes do kit em `.claude/**`; o delta não toca `.claude/` (`git diff --stat 7380c49 HEAD -- .claude` vazio), então nenhuma é nova |
| Fase F2: reinstall verde, 5 Flows ativos, ATF F4-010 verdes | `outputs/spec/sync-log.md` (install #25 «ok; 1056 registros»), recibo ATF 8/8 | ✅ PASS | |

**CA da US cumpridos?** Sim.
- **AC-RF-MOD-F4-010-01** (5 réguas com Flow ativo «Régua: <nome>», um stage por etapa e «Encaminhamento») — cumprido; ATF `t_f4010_flows` confere régua, Flow ativo e stages.
- **AC-RF-MOD-F4-010-02** (etapa recusa postura fora de sequência, dia fora de ordem, encaminhar fora da última e valor em canal informal) — cumprido; ATF `t_f4010_etapa_neg` (6 recusas) e `t_f4010_etapa_pos`.
- **AC-RF-MOD-F4-010-03** (coordenador grava texto, canal, dia e postura; código, carteira e ordem só o admin) — cumprido no código (`security/regua.now.ts`); o ATF prova só parte (TEST-001).
- **AC-RF-MOD-F4-010-04** (contribuinte do grupo de controle não é inscrito) — cumprido; ATF `t_f4010_controle`.

**Tecnologia fora da spec sem aprovação?** Não. Flow, custom action, Script Include, BR, ACL e propriedade estão no design.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-001] Atendente lê inscrições na régua de contribuintes fora da própria carteira — MÉDIO** · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:L/I:N/A:N) · OWASP A01 (controle de acesso quebrado) · STRIDE I (vazamento de informação)
> Arquivo: `app/src/fluent/security/acl-base.now.ts:211-226`; `app/src/server/carteira/restringirConsultaCarteira.server.js:5-15` (o mapa `DONO` não tem `x_2326104_cob_regua_inscricao`) · Contexto: tabela nova `regua_inscricao`, lista TEL-037 e Table API (`allowWebServiceAccess: true` em `tables/regua_inscricao.now.ts:10`).
> **Problema:** a ACL de leitura libera a inscrição para o atendente sem o filtro por carteira que contribuinte, débito, comunicação e consentimento já têm. O atendente que abrir `x_2326104_cob_regua_inscricao_list.do` (ou chamar a Table API) vê nome do contribuinte, régua (a régua diz o tributo em atraso), status e motivo de encerramento de quem não é da carteira dele.
> **Risco:** com dado real, é exposição de situação fiscal de terceiros (sigilo fiscal). Nesta instância de demonstração os contribuintes são fictícios, e nenhum módulo do menu leva o atendente até a lista (o módulo é só do admin).
> **Fix:** já planejado no backlog: TASK-MOD-F4-013-02 («atendente lê só as inscrições da própria carteira: ACL deny e business rule de consulta»), conforme B5 do design.
> **TDD RED:** ATF impersonando um atendente, `GlideRecordSecure` em `regua_inscricao` com inscrição de contribuinte de outro atendente → hoje lê. **TDD GREEN:** o mesmo teste não lê; coordenador lê todas (já previsto em B9, linha F4-013).
> **GAP recomendado:** GAP-158 (registro do intervalo até a F4-013).

Sem outros achados. Os pontos conferidos estão no item 6.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| IDOR (um usuário acessa registro de outro) | Leitura de `regua_inscricao` pelo atendente | ❌ (MÉDIO, planejado para F4-013) | SEC-001 |
| Auth Bypass | Gravação de régua e etapa por quem não é coordenador/admin | ✅ BLOQUEADO | `security/regua.now.ts:10-96`; ATF `t_f4010_acl_atendente` (atendente não grava régua nem etapa) |
| Privilege Escalation | Coordenador troca `codigo` (mudaria qual Flow dispara), `carteira`, `flow`, `ordem` ou `regua` da etapa | ✅ BLOQUEADO | ACL de campo só admin (`security/regua.now.ts:29-96`); ATF `t_f4010_acl_coord` confere `codigo`, `carteira`, `ordem` por `canWrite` e `flow` pela gravação |
| Privilege Escalation | Persona cria, altera ou apaga inscrição para forçar o Flow (que roda como system) | ✅ BLOQUEADO | Nenhuma ACL de create/write/delete em `regua_inscricao` para as personas (B5); o Flow só dispara em insert |
| Injeção | Texto da etapa e código da régua | ✅ BLOQUEADO | Valores só entram por `setValue`/`addQuery` com parâmetro; nenhuma consulta montada em texto (`ReguaMotor.server.js:405-410`) |
| Sigilo fiscal no conteúdo | Texto de e-mail/SMS/WhatsApp com valor ou tributo | ✅ BLOQUEADO | `ReguaMotor.server.js:420-422`; gerador repete a validação (teste «Pague R$ 500» aborta); ATF «valor em SMS recusado» |
| Secret Exposure | Código e seed novos | ✅ N/A | Varredura: 0 achados; sem credencial no delta |
| Mass Assignment | Form da régua e da etapa | ✅ BLOQUEADO | ACL de campo por papel; campos de estrutura só admin |
| Rate Limit | — | N/A | Sem rota nova chamada pelo usuário |
| Race Condition | Duas gravações simultâneas de etapa da mesma régua | N/A (baixo) | Só o admin cria etapa e o coordenador não troca ordem; a validação lê as outras etapas na mesma transação |
| Erro no Flow | Exceção numa action deixa a inscrição «ativa» | ✅ BLOQUEADO | `catch` do `tryCatch` grava `status = erro` (`flows/regua-ipva.now.ts:107-112`) |

## 7. Findings de Performance

Nenhum finding. `motivoRecusaEtapa` faz uma consulta às etapas da régua por gravação (3 a 4 linhas). `agendar` faz uma leitura da inscrição e uma das etapas por passo do Flow. O volume de contextos de Flow em espera em produção já está registrado como GAP-155.

## 8. Findings de Bugs Técnicos

Nenhum finding bloqueante. Conferido:
- Fuso: `new GlideDateTime(getValue())` lê o valor em UTC e `executar_em` sai como objeto, como a F0 pediu (`ReguaMotor.server.js:118-126`).
- Tipo da ordem: o passo converte com `parseInt` e o motor compara número com número (`acao-agendar-etapa.js:6`, `ReguaMotor.server.js:80,107`).
- Padrões da inscrição e prazo 5 por BR, porque o scaffold não gera `default` (desvio 6, declarado) — `ReguaMotor.server.js:377-387,398-404`; ATF `t_f4010_modelo` confere.
- Régua sem etapas: `agendar` lança erro e o `catch` do Flow grava `erro` — comportamento previsto.

## 9. Testes

**CA viraram teste?** AC-01 sim (`t_f4010_flows`); AC-02 sim (`t_f4010_etapa_neg`, `t_f4010_etapa_pos`); AC-03 em parte (TEST-001); AC-04 sim (`t_f4010_controle`). **TDD RED/GREEN presente?** Sim: cada regra tem caso que passa e caso que recusa. **Cobertura do delta:** boa no motor e nas BRs; o gerador tem 6 testes de unidade (rodados pelo auditor, 6/6).

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F4-010.now.ts` `t_f4010_modelo` | Sim (inscrição nasce ativa, propriedade 60) | Sim (régua sem código, código repetido) | Bom |
| `t_f4010_flows` | Sim (5 Flows ativos com os stages) | — | Bom |
| `t_f4010_etapa_pos` / `t_f4010_etapa_neg` | Sim | Sim (6 recusas) | Bom |
| `t_f4010_controle` | Sim (massificada grava) | Sim (controle recusado) | Bom |
| `t_f4010_fumaca` | Sim (agendar etapa 1 e fecho pelo FlowAPI) | Sim (inscrição encerrada, reference por sys_id) | Bom |
| `t_f4010_acl_coord` | Parcial | Sim | Ver TEST-001 |
| `t_f4010_acl_atendente` | — | Sim | Bom |
| `app/scripts/gerar-flows-regua.test.mjs` | Sim | Sim (sigilo, validações, `flowManual`, apagar Flow órfão) | Bom |

> **[TEST-001] O ATF da ACL do coordenador não prova toda a parte positiva do AC-03 — BAIXO**
> Arquivo: `app/src/fluent/tests/US-MOD-F4-010.now.ts:642-698`.
> O AC diz «o coordenador grava texto, canal, dia e postura». O teste grava só o texto da etapa e o prazo da régua (e confere `canWrite` de «Ativa»); canal, dia e postura não são gravados pelo coordenador no teste. O código cobre esses campos pela ACL `field: '*'` (`security/regua.now.ts:68-76`), então o comportamento está certo; falta a prova. O caso do campo `flow` (desvio 8, já declarado pelo implementador) é provado só pela gravação: `expect(lidaR.getValue('flow')).toBeFalsy()` passaria também se o elemento não chegasse ao `GlideRecordSecure` por outro motivo que não a ACL. O print `outputs/spec/screens/deliver/US-MOD-F4-010-TEL-014.png` mostra o form sem o campo «Flow» para o coordenador, coerente com a ACL de leitura/escrita.
> **Fix:** gravar `canal`, `offset_dias` e `postura` (respeitando D17) no mesmo passo impersonado e conferir pela releitura. Registrado em GAP-158.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Passos das 4 custom actions | Sim, `gs.error('RF-MOD-F4: ...')` com sys_id da inscrição, só no erro | Execução do Flow (`sys_flow_context`) e stage tracker | — |
| Recusa de gravação de régua/etapa | Sim, `gs.warn` com tabela, sys_id e mensagem (`validarEtapa.server.js:8`) | — | — |
| Flow com erro | `status = erro` e `detalhe` na inscrição | Módulo de inscrições | — |
| PII nos logs | Só sys_id; sem nome, CPF ou valor | — | — |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| `recusarAcaoControle.server.js` | Não. A regra lê `contribuinte` e `ciclo`, que a inscrição tem; sem ciclo fica mais restritiva (desvio 7) | `business-rules/regua.now.ts:44-54`; ATF `t_f4010_controle` |
| Seed gerado (regularização) | Mudança esperada: regularização perdeu a reference a comunicação e o sorteio mudou (registrado no `app/spec_story.md`). Install verde com contagem conferida | `outputs/spec/sync-log.md` install #25 «ok; 1056 registros» |
| `list-controls.now.ts` (UX-009) | Não; o New da related list de etapas continua só do admin | arquivo não muda no delta |
| `menu.now.ts` | Não; só a ordem de Administração (admin) | diff `menu.now.ts` |
| ATF UX-004 | Não muda (o ciclo do teste nasce publicado; BR de publicação é da F4-012) | `tests/US-MOD-UX-004.now.ts` fora do delta |
| Filtro de consulta por carteira | `regua_inscricao` ainda fora do mapa | SEC-001 |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

Os 8 desvios declarados pelo implementador foram conferidos no código. Nenhum quebra critério de aceite. Os achados abertos são MÉDIO (SEC-001, com correção já no backlog) e BAIXO (CONF-001, TEST-001), registrados em GAP-158.

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-001 | `security/acl-base.now.ts:211-226`; `restringirConsultaCarteira.server.js:5-15` | Deny de leitura por carteira e `regua_inscricao` no mapa `DONO` | TASK-MOD-F4-013-02 (já no backlog); `outputs/spec/gaps-document.md` (GAP-158) |
| 2 | CONF-001 | `ReguaMotor.server.js:440-448` | Decidir se a criação de etapa também exige que a última encaminhe, ou deixar como está (só admin cria; gerador valida a régua inteira) | GAP-158 |
| 3 | TEST-001 | `tests/US-MOD-F4-010.now.ts:642-698` | Gravar canal, dia e postura como coordenador no ATF | GAP-158 |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@7c9e4dd
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
