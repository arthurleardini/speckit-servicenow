# Auditoria de Entrega — [US-MOD-UX-009] Ações na lista, Update e New só para quem precisa

- **User Story:** US-MOD-UX-009 (nó `STORY-MOD-UX-009` no `outputs/spec/tasks.json`, sem label `fio-condutor`) — RF-MOD-UX-009 · Ações na lista, Update e New só para quem precisa
- **Features/IDs cobertos:** RF-MOD-UX-009 · RN-NOVO-UX-013 (ação de negócio a partir da lista) · RN-NOVO-UX-014 (Update e New só para quem precisa) · AC-RF-MOD-UX-009-01 a -04 · TASK-MOD-UX-009-01 (UI Actions de lista, `order` dos botões de form, override de Update) e TASK-MOD-UX-009-02 (New só para o admin por list control) · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2, seções A1 e A2, com os ajustes da F0 (`docs/designs/review-ux/f0-spike-resultados.md`, pontos 7 e 8)
- **Branch/commit auditado:** `feat/v0` @ `d5d5943`. Delta: `git log 2d746ff..d5d5943` (9 commits; o código do app não muda depois de `8cf89bc`, o commit instalado e testado). Parte desta US: `app/src/fluent/ui-actions/{contato,caso,ciclo,criterio}.now.ts`, `app/src/fluent/ui/list-controls.now.ts`, `app/src/fluent/tests/US-MOD-UX-009.now.ts`, `app/src/fluent/tests/suite.now.ts`
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Escopo F1.** A US é auditada só contra A1 e A2 da fase F1. As ações de régua e de comunicação (Pausar, Ativar, Reenviar, `F4-010_*`, `F4-016_*`) e as telas TEL-013/037 são da F2 em diante e não entram.

> **Isenção g3:** `outputs/spec/auditorias/_isencoes/US-MOD-UX-009-g3.md` dispensa só os validadores de LLM (story fora do fio condutor). Build, install e ATF (testes automatizados da instância) continuam obrigatórios e estão no recibo.

> **Dependência:** o marcador `outputs/spec/em-andamento.md` e o `sync-log.md` (linha #67) registram `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL`, seguida por delegação do dono. Não muda o que esta auditoria verifica.

---

## 1. Inventário do delta

**Arquivos/módulos tocados pela US:**
- `app/src/fluent/ui-actions/contato.now.ts` — botões do contato. Ganha `order` nos dois botões de form, duas ações de lista que só abrem o form («Registrar ligação…» L86, «Encerrar…» L101) e o override de Update só para o admin do app (L118).
- `app/src/fluent/ui-actions/caso.now.ts` — botões do caso. Ganha «Avançar etapa» na lista, que roda no servidor (L67), e «Encerrar caso…», que abre o form (L89).
- `app/src/fluent/ui-actions/ciclo.now.ts` — botões do ciclo. Ganha «Publicar ciclo» (L56) e «Distribuir lista» (L78) na lista e o override de Update (L102: coordenador só na prévia, admin sempre).
- `app/src/fluent/ui-actions/criterio.now.ts` — botões do critério. Ganha «Publicar versão» (L58) e «Criar nova versão…» (L80) no menu da linha.
- `app/src/fluent/ui/list-controls.now.ts` — quatro `sys_ui_list_control` (o registro que controla os botões de uma lista) com `new_roles: ['x_2326104_cob.admin']` em contato, régua, etapa e na related list de etapas da régua.
- `app/src/fluent/tests/US-MOD-UX-009.now.ts` (6 testes ATF) e `suite.now.ts` (entra na suíte `cob-regressao`).

**Endpoints alterados/criados:** nenhuma API REST. As superfícies novas são 8 UI Actions de lista (o item de menu que aparece na lista) e 2 overrides de `sysverb_update` (o botão Update padrão da plataforma, substituído na tabela).

**Entidades/modelos tocados:** nenhuma coluna nova. As ações agem sobre `x_2326104_cob_contato`, `_caso`, `_ciclo` e `_criterio`, sempre pelos métodos de servidor que já existiam (`CasoConducao`, `QualificacaoCiclo`, `CriterioVersao`).

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3), UI Actions da Core UI clássica (UI16), JavaScript de servidor (Rhino), ATF com passos de servidor, de form e de script de UI.

**Varredura determinística** (`varrer-entrega.mjs --desde-o-ramo 2d746ff`): 29 arquivos, 0 achados.

## 2. Mapa de regressão leve

Pontos já existentes que o delta encosta:

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| Botões de form `RF-MOD-UX-002/003/005`, `RF-MOD-F2-002/004`, `RF-MOD-UX-004` | Ganharam `order`; as ações de lista usam `actionName` próprio (`x_cob_l_*`) para não colidir com eles | baixo |
| `sysverb_update` global em contato e ciclo | O override troca o botão Update da plataforma nessas duas tabelas | médio |
| `QualificacaoCiclo.publicar/distribuir`, `CasoConducao.avancarEtapa`, `CriterioVersao.publicar` | Passam a ser chamados também pela lista, inclusive em lote («Ações nas linhas selecionadas») | médio |
| Testes da UX v1 (UX-002 a UX-006) na suíte `cob-regressao` | Conferem os mesmos botões de form | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (A1, A2, F0 pontos 7 e 8, RN-NOVO-UX-013/014, AC -01 a -04); segurança (papel e estado reconferidos no servidor quando a ação é chamada pela lista; escalada por Update); teste de mesa nas ações reais; bugs técnicos; testes; observabilidade; regressão nos botões de form.

**Não auditado (e por quê):**
- Performance de consulta: o delta não cria consulta nem laço. O lote em «Ações nas linhas selecionadas» chama, linha a linha, métodos que já existiam.
- Injeção, segredo, SSRF, mass assignment: as ações não recebem entrada do usuário além do registro da linha; não há URL, segredo nem campo livre no delta.
- Rate limiting e race condition: ação manual de tela, sem contador nem saldo; o estado é reconferido no servidor a cada chamada.
- Ações de régua e comunicação: fase F2 em diante.

## 4. Conformidade

Verificado contra o design v2.2 (A1, A2), a F0, o `data-model.json`, `.claude/rules/harness/servicenow-ui.md` e os critérios e regras do nó da US.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| A1: botões de form com `order` 100/200 | `ui-actions/contato.now.ts:18,58`; `caso.now.ts:18,41`; `ciclo.now.ts:18,41`; `criterio.now.ts:17,40` | ✅ PASS | Valores iguais à tabela A1 |
| A1: 8 ações de lista, `actionName` `x_cob_l_*`, `showInsert: false`, `showUpdate: true` (F0 ponto 7) | `contato.now.ts:86-114`; `caso.now.ts:67-102`; `ciclo.now.ts:56-99`; `criterio.now.ts:58-93` | ✅ PASS | Condição, papel e `order` iguais à tabela A1 |
| A1: `showListChoice` só nos verbos de servidor que não pedem dado (Avançar etapa, Publicar ciclo, Distribuir lista) | `caso.now.ts:78`; `ciclo.now.ts:67,89` | ✅ PASS | «Publicar versão» só no menu da linha, como a tabela A1 pede |
| A1: verbos que pedem anotação ou motivo só abrem o form | `contato.now.ts:98,113`; `caso.now.ts:101`; `criterio.now.ts:92` | ✅ PASS | `action.setRedirectURL(current)` |
| A2: Update do contato só admin | `contato.now.ts:118-132` | ✅ PASS | |
| A2: Update do ciclo, coordenador só na prévia, admin sempre | `ciclo.now.ts:102-116` | ✅ PASS | |
| A2: New só admin em contato, régua, etapa e related list (array de string, F0 ponto 8) | `ui/list-controls.now.ts:9-31` | ✅ PASS | |
| Regra de UI: ação que muda registro tem `condition` e `roles` | todas as ações novas | ✅ PASS | |
| Regra de UI: texto ao usuário traduzível | `caso.now.ts:82-85`, `ciclo.now.ts:71-74,93-96` | ✅ PASS | A mensagem vem dos métodos existentes |
| AC-RF-MOD-UX-009-01 — toda ação do papel no menu da linha | ações acima; recibo ATF; `screens/ux-v2/atendente-minha-lista-menu-da-linha.png` | ✅ PASS | No escopo F1: contato, caso, ciclo e critério |
| AC-RF-MOD-UX-009-02 — Publicar ciclo, Distribuir lista e Avançar etapa em «Ações nas linhas selecionadas» conforme o estado | `ciclo.now.ts:67,89`; `caso.now.ts:78`; `tests/US-MOD-UX-009.now.ts:73-100,142-148` | ✅ PASS | |
| AC-RF-MOD-UX-009-03 — form do contato sem Update para quem não é admin; ciclo só na prévia | `contato.now.ts:124`; `ciclo.now.ts:109`; testes L172-238 | ✅ PASS | |
| AC-RF-MOD-UX-009-04 — New some de contato, régua e etapa para quem não é admin | `list-controls.now.ts`; teste L155-166; `verificacao-f1.json` (`atendente_lista_new: 0`, `coord_regua_new: 0`) | ✅ PASS | |
| RN-NOVO-UX-013 — o método do servidor reconfere papel e estado | `server/atendimento/CasoConducao.server.js:117-125`; `server/qualificacao/QualificacaoCiclo.server.js:72,158`; `server/qualificacao/CriterioVersao.server.js:129` | ✅ PASS | |
| RN-NOVO-UX-014 — caso, critério, régua e etapa mantêm o Update; Delete não aparece para as personas | sem mudança no delta; `verificacao-f1.json` (`coord_form_contato` sem Update nem Delete) | ✅ PASS | |

**CA da US cumpridos?** Sim: AC-RF-MOD-UX-009-01, -02, -03 e -04.
**Tecnologia fora da spec sem aprovação?** Não.

**Desvio registrado em `app/spec_story.md`:** o menu da linha do atendente é conferido por teste de servidor (as flags e os papéis gravados em `sys_ui_action`) mais Playwright, porque o Client Test Runner do ATF não monta o menu de contexto da lista.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes
Nenhum.

### 5.2 MÉDIOS/BAIXOS
Nenhum. O override de Update e os list controls mudam só o que a tela mostra; quem protege o dado continuam sendo as ACL e as business rules da v1, que o delta não altera.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| Privilege Escalation | Atendente chama `x_cob_l_avancar_etapa` ou `x_cob_l_publicar_ciclo` (por exemplo, forjando o POST da lista) | ✅ BLOQUEADO | A ação exige o papel coordenador (`caso.now.ts:73`, `ciclo.now.ts:62`) e o método recusa sem o papel (`CasoConducao.server.js:119`, `QualificacaoCiclo.server.js:72`) |
| Auth Bypass por estado | Coordenador marca um ciclo já publicado e usa «Publicar ciclo» em lote | ✅ BLOQUEADO | Condição da ação (`ciclo.now.ts:63`) e checagem no método; teste L142-148 |
| IDOR (acessar registro de outro usuário) | Atendente usa «Registrar ligação…» na linha de contato de outro atendente | ✅ BLOQUEADO | A ação só redireciona ao form (`contato.now.ts:98`); a leitura continua sob as ACL e a BR de carteira da US-MOD-UX-006 |
| Escalada pelo Update | Coordenador grava ciclo publicado pela URL do form | ✅ BLOQUEADO | Esconder o botão é só tela; a ACL de escrita do ciclo exige `estado=previa` (`security/ciclo.now.ts:10-24`) |
| Injeção · Secret · Mass Assignment · SSRF | — | N/A | Sem entrada livre, URL ou segredo no delta; varredura com 0 achados |
| Rate Limit · Race Condition | — | N/A | Ação manual; o método relê o registro gravado antes de agir (`CasoConducao._gravado`) |

## 7. Findings de Performance
Nenhum. O lote de «Ações nas linhas selecionadas» chama um método por linha marcada, o mesmo custo de clicar o botão do form em cada registro.

## 8. Findings de Bugs Técnicos
Nenhum. As condições das ações de lista repetem as do form (o contato não traz `!current.isNewRecord()`, como a tabela A1 define; na lista o registro sempre existe).

## 9. Testes

**CA viraram teste?**
- AC-01: sim, por servidor (flags `list_context_menu`, `form_button`, `show_update` e papéis de cada ação, L46-70) e por Playwright para o menu aberto pelo atendente.
- AC-02: sim. Script de UI do coordenador em «Ciclo do mês» (L85-99) e condições por estado (L142-148). «Avançar etapa» do caso é conferido pela flag `list_choice` (L55-59).
- AC-03: sim. Contato do atendente sem Update (L172-197); ciclo em prévia com Update (L199-217); ciclo publicado sem Update (L219-238).
- AC-04: sim. Os 4 list controls com `new_roles` do admin (L155-166).

**TDD RED/GREEN presente?** Os testes entram no mesmo commit do código (`24239fa`); cada regra tem lado positivo e negativo. Recibo `outputs/spec/auditorias/atf/US-MOD-UX-009.json`: 6/6 verdes no commit `8cf89bc`. Suíte `cob-regressao` 60/60 (`atf/cob-regressao.json`, install #66 do `sync-log.md`).

**Cobertura do delta:** caminho feliz e negativo para cada ação e para os dois overrides.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-UX-009.now.ts` | Sim | Sim (estado fora da condição, papel errado, Update escondido) | Boa; lacunas em TEST-001 |

> **[TEST-001] Faltam três conferências — BAIXO**
> Arquivo: `app/src/fluent/tests/US-MOD-UX-009.now.ts:199-238` · Contexto: override de Update do ciclo e «Ações nas linhas selecionadas» do caso.
> (1) Nenhum teste abre o ciclo publicado como admin para ver o Update (lado «admin sempre» da RN-NOVO-UX-014). A verificação Playwright cobre o admin só no contato. (2) Nenhum teste clica Update e confere que o ciclo em prévia foi gravado. (3) «Avançar etapa» em «Ações nas linhas selecionadas» de «Casos qualificados» é conferido pela flag, não na tela; a seção Verification do design pede as duas listas.
> Fix: acrescentar um `uiActionVisibility` com usuário admin no ciclo publicado e um script de UI em «Casos qualificados», no padrão de L85-99.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Ações de lista que rodam no servidor (avançar, publicar, distribuir, publicar versão) | Sim, pelo método chamado, com usuário e registro | Não se aplica | OBS-001 |
| Ações de lista que só abrem o form | Não (não mudam dado) | — | — |
| Override de Update | Não (gravação comum; o histórico do registro guarda a mudança) | — | — |

> **[OBS-001] Log não diz se a ação veio da lista ou do form — BAIXO**
> Arquivo: `app/src/server/atendimento/CasoConducao.server.js:47`, `app/src/server/qualificacao/QualificacaoCiclo.server.js:221`.
> As ações de lista chamam o mesmo método, que grava o log com o nome da ação de form (`RF-MOD-UX-005_ua_avancar_etapa`, `RF-MOD-UX-004_ua_distribuir_lista`). Quem lê o log não distingue um lote feito pela lista de cliques no form.
> Fix: passar a origem como parâmetro opcional do método e incluí-la na linha de log.

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| Botões de form da UX v1 | Não | Testes UX-002 a UX-006 verdes na suíte 60/60; `verificacao-f1.json` mostra os botões no form do atendente e do coordenador |
| `sysverb_update` em outras tabelas | Não | Override limitado a `table` contato e ciclo (`contato.now.ts:122`, `ciclo.now.ts:106`) |
| Métodos de servidor chamados pela lista | Não | Assinaturas sem mudança; o delta não toca `app/src/server/qualificacao` nem `atendimento` |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

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
| 1 | TEST-001 (BAIXO) | `app/src/fluent/tests/US-MOD-UX-009.now.ts:199-238` | Testes de Update do ciclo publicado pelo admin, do clique em Update na prévia e de «Avançar etapa» em «Ações nas linhas selecionadas» do caso | `outputs/spec/gaps-document.md` (a registrar, junto das baixas da UX v2) |
| 2 | OBS-001 (BAIXO) | `app/src/server/atendimento/CasoConducao.server.js:47` | Origem (lista ou form) na linha de log | `outputs/spec/gaps-document.md` (a registrar) |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@d5d5943
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
