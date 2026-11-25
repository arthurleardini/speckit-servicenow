# Auditoria de Entrega — [US-MOD-UX-010] «O que fazer agora», «Lista da equipe», listas e form do contato

- **User Story:** US-MOD-UX-010 (nó `STORY-MOD-UX-010` no `outputs/spec/tasks.json`, sem label `fio-condutor`, depende da STORY-MOD-UX-009) — RF-MOD-UX-010
- **Features/IDs cobertos:** RF-MOD-UX-010 · RN-NOVO-UX-015 («O que fazer agora» em todo contato, caso e ciclo) · RN-NOVO-UX-016 (Lista da equipe para coordenador e admin) · AC-RF-MOD-UX-010-01 a -04 · TASK-MOD-UX-010-01 (`ProximaAcao`, business rules e aviso no form) e TASK-MOD-UX-010-02 («Lista da equipe», TEL-036, colunas de TEL-034/023, ordem do form TEL-035) · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2, seções A3, A4 e A5, com o ajuste da F0 ponto 9 (`docs/designs/review-ux/f0-spike-resultados.md`)
- **Branch/commit auditado:** `feat/v0` @ `d5d5943`. Delta: `git log 2d746ff..d5d5943` (o código do app não muda depois de `8cf89bc`, o commit instalado e testado). Parte desta US: `app/src/fluent/tables/{contato,caso,ciclo}.now.ts`, `business-rules/proxima-acao.now.ts`, `script-includes/proxima-acao.now.ts`, `app/src/server/contato/{ProximaAcao,gravarProximaAcao,avisoProximaAcao}.server.js`, `security/contato.now.ts`, `ui/TEL-023/034/035/036.now.ts`, `navigation/menu.now.ts`, `seed-demo/*`, `app/scripts/gerar-seed-demo.mjs`, `outputs/spec/data-model.json`, `tests/US-MOD-UX-010.now.ts`
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Escopo F1.** A US é auditada contra A3, A4 e A5. As colunas `origem` e `inscricao` do form, as listas TEL-013 e TEL-037 e o módulo «Inscrições» são da F2 em diante e não entram.

> **Isenção g3:** `outputs/spec/auditorias/_isencoes/US-MOD-UX-010-g3.md` dispensa só os validadores de LLM. Build, install e ATF continuam obrigatórios e estão no recibo.

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL` registrada no marcador e no `sync-log.md` (linha #67), seguida por delegação do dono.

---

## 1. Inventário do delta

**Arquivos/módulos tocados pela US:**
- `tables/contato.now.ts:44`, `caso.now.ts:35`, `ciclo.now.ts:33` — coluna nova `proxima_acao` («O que fazer agora», texto de 100 caracteres).
- `app/src/server/contato/ProximaAcao.server.js` — monta o texto pelo estado do registro (quadro A3). Publicado como Script Include (código de servidor reutilizável) em `script-includes/proxima-acao.now.ts`.
- `business-rules/proxima-acao.now.ts` — três regras que rodam antes de gravar contato, caso e ciclo (order 900) e preenchem a coluna; uma regra de exibição que mostra «Próximo passo: …» no topo do form do contato.
- `security/contato.now.ts:122-142` — duas ACL (regras de acesso da plataforma): escrita em `proxima_acao` do contato só para o admin do app; `query_range` (permissão para agrupar e filtrar por faixa) em `contato.atendente` para coordenador e admin.
- `navigation/menu.now.ts:41-51` — separador «Equipe» e módulo «Lista da equipe»; L71 «Ciclo do mês» passa a abrir a view TEL-036.
- `ui/TEL-034.now.ts`, `TEL-023.now.ts`, `TEL-036.now.ts` (nova) — listas com `proxima_acao` e 6 colunas; `TEL-035.now.ts` — ordem dos campos do form do contato.
- `seed-demo/{contato,caso,ciclo}.now.ts` e `app/scripts/gerar-seed-demo.mjs:60-90` — o seed já sai com `proxima_acao` preenchida (o install do seed não roda business rule).
- `outputs/spec/data-model.json` — coluna nova nas três tabelas e área «Equipe».

**Endpoints alterados/criados:** nenhuma API REST. Superfícies novas: um módulo de menu, uma view de lista e uma mensagem no form.

**Entidades/modelos tocados:** `x_2326104_cob_contato`, `_caso`, `_ciclo` (coluna nova), `sys_app_module`, `sys_ui_view`, `sys_security_acl`.

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3), business rules e Script Include em JavaScript de servidor (Rhino), ACL, Core UI clássica (UI16), Node.js no gerador do seed, ATF.

**Varredura determinística** (`varrer-entrega.mjs --desde-o-ramo 2d746ff`): 29 arquivos, 0 achados.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| Business rules antes de gravar em contato, caso e ciclo (carteira, grupo de controle, estágio do caso, bloqueio do ciclo publicado) | A regra nova roda na mesma gravação, depois delas | médio |
| `CriterioVersao.CAMPOS_CICLO_PROTEGIDOS` e a BR que bloqueia mudanças em ciclo publicado | A regra nova grava `proxima_acao` também em ciclo publicado | médio |
| ACL de leitura do contato (carteira do atendente, US-MOD-UX-006) | A ACL `query_range` nova é do campo `atendente` | médio |
| «Minha lista» do atendente (TEL-034) | Saiu a coluna `status` e entrou `proxima_acao` | baixo |
| Lista TEL-023 de casos | Saiu a coluna `ciclo` | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (A3, A4, A5, D3 a D5, F0 ponto 9, RN-NOVO-UX-015/016, AC -01 a -04); segurança (escrita no campo calculado, ampliação de leitura pela ACL `query_range`); teste de mesa com dados reais da instância (consulta REST às três tabelas e aos módulos); performance da regra que roda em toda gravação; bugs técnicos; testes; observabilidade; regressão nas regras vizinhas.

**Não auditado (e por quê):**
- Injeção, SSRF, segredo, mass assignment: o texto vem de um quadro fixo; não há entrada livre que chegue a consulta, URL ou log.
- Rate limiting e race condition: a regra é determinística sobre o próprio registro, sem contador.
- Colunas `origem`/`inscricao`, TEL-013/037, módulo «Inscrições»: fase F2 em diante.

## 4. Conformidade

Verificado contra o design v2.2 (A3 a A5), a F0, o `data-model.json`, `.claude/rules/harness/servicenow-ui.md` e os critérios e regras do nó da US.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| A3: quadro de textos por tabela e estado, via `gs.getMessage` | `server/contato/ProximaAcao.server.js:46-82` | ✅ PASS | Os 15 casos do quadro conferidos (teste L27-41) |
| A3: data da próxima ação gravada, não «hoje» | `ProximaAcao.server.js:84-91` | ✅ PASS | |
| A3: BR antes de inserir e atualizar em contato, caso e ciclo | `business-rules/proxima-acao.now.ts:8-43` | ✅ PASS | order 900, depois das regras vizinhas (≤ 100) |
| A3: BR de exibição só no contato, só se não encerrado | `proxima-acao.now.ts:45-53`; `avisoProximaAcao.server.js:3-6` | ✅ PASS | |
| A3: `proxima_acao` fora de `CAMPOS_CICLO_PROTEGIDOS` | `server/qualificacao/CriterioVersao.server.js:33-36` | ✅ PASS | |
| A3: preenchimento do seed pelo mesmo quadro (sem fix script) | `app/scripts/gerar-seed-demo.mjs:60-90` | ✅ PASS | |
| A3: TEL-034, TEL-023 e TEL-036 com as colunas da tabela A3 | `ui/TEL-034.now.ts:8`; `TEL-023.now.ts:14`; `TEL-036.now.ts:14` | ✅ PASS | 6 colunas cada |
| A4: «Lista da equipe» com `status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em`, papéis coordenador e admin | `navigation/menu.now.ts:41-51` | ✅ PASS | Separador com order 500 (design: 150); desvio registrado em `app/spec_story.md` |
| A4: «Ciclo do mês» abre a view TEL-036 | `menu.now.ts:71` | ✅ PASS | |
| F0 ponto 9: ACL `query_range` em `contato.atendente` para coordenador e admin | `security/contato.now.ts:134-142` | ✅ PASS | |
| D3: `proxima_acao` só leitura | `security/contato.now.ts:122-131` | ✅ PASS | Contato por ACL; em caso e ciclo a BR sobrescreve qualquer valor, desvio registrado em `app/spec_story.md`. Tamanho 100 em vez de 120, também registrado |
| A5: ordem dos campos do form do contato | `ui/TEL-035.now.ts:15` | ✅ PASS | Sem `origem` e `inscricao` (F2) |
| AC-RF-MOD-UX-010-01 — «O que fazer agora» em 100% dos contatos, casos e ciclos | BRs acima + seed | ✅ PASS | REST na instância: 0 registros com `proxima_acaoISEMPTY` em contato (40), caso (6) e ciclo (3); os 40 contatos batem com o quadro A3 |
| AC-RF-MOD-UX-010-02 — form do contato aberto mostra «Próximo passo» no topo | `avisoProximaAcao.server.js:6` | ✅ PASS | `screens/ux-v2/atendente-form-contato-aviso.png` |
| AC-RF-MOD-UX-010-03 — coordenador e admin veem os contatos abertos agrupados por atendente; atendente não vê a lista | `menu.now.ts:41-51`; `contato.now.ts:134-142` | ✅ PASS | `verificacao-f1.json`: coordenador e admin com 2 grupos e 26 linhas; teste L152-165 |
| AC-RF-MOD-UX-010-04 — coordenador vê no máximo 14 módulos e listas com até 6 colunas | `menu.now.ts` | ✅ PASS | REST: 13 módulos com o papel coordenador (fora separadores). As listas que a US mexe têm 6 colunas; ver CONF-001 |

**CA da US cumpridos?** Sim: AC-RF-MOD-UX-010-01, -02, -03 e -04, no escopo F1.
**Tecnologia fora da spec sem aprovação?** Não.

> **[CONF-001] Outras listas do coordenador continuam com mais de 6 colunas — BAIXO**
> Arquivos: `app/src/fluent/ui/TEL-007.now.ts` (Critérios, 8), `TEL-015.now.ts` (Disparos com falha, 9), `TEL-032.now.ts` (Carteira, 9), `TEL-005.now.ts` (Parcelamentos em risco, 7), `TEL-029.now.ts` (Efeito incremental, 7).
> O texto do AC-RF-MOD-UX-010-04 fala de «listas com até 6 colunas» sem restringir quais. O design (D5 e A3) aplica a regra às listas em que entra `proxima_acao`, e essas estão com 6. As listas acima são da v1, o delta não as toca, e passam do limite que a v1 já definia (D7 de `ux-cobranca-v1.md`).
> Fix: reduzir para 6 colunas numa story própria, ou deixar escrito no AC que o limite vale para TEL-034, TEL-023 e TEL-036.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes
Nenhum.

### 5.2 MÉDIOS/BAIXOS
Nenhum. A ACL `query_range` só permite agrupar e filtrar por atendente. Ela não amplia a leitura: o coordenador e o admin do app já liam todos os contatos (`CarteiraAtendente.veTudo`, `server/carteira/CarteiraAtendente.server.js:45`). O atendente fica sem a permissão, e a carteira dele continua restrita pela BR de consulta e pela ACL de leitura da US-MOD-UX-006.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| Privilege Escalation / Mass Assignment (gravar texto falso em «O que fazer agora») | `demo.atendente` tenta gravar `proxima_acao` no próprio contato | ✅ BLOQUEADO | ACL `contato.now.ts:122-131`; teste L102-110 (`canWrite` falso); e a BR sobrescreve qualquer valor (teste L71-83) |
| IDOR via «Lista da equipe» | Atendente abre a URL do módulo ou agrupa por atendente | ✅ BLOQUEADO | Módulo só para coordenador e admin (`menu.now.ts:47`); sem `query_range` para o atendente; a BR de carteira filtra as linhas |
| Auth Bypass | Coordenador lê contatos de dois atendentes por `GlideRecordSecure` (consulta que respeita as ACL) | ✅ comportamento esperado | Teste L135-146; 26 linhas na verificação |
| Information Disclosure no aviso | O aviso mostra só o texto do quadro e a data | ✅ BLOQUEADO | `avisoProximaAcao.server.js:6`; sem dado pessoal |
| Injeção · Secret · SSRF | — | N/A | Texto fixo; varredura com 0 achados |
| Rate Limit · Race Condition | — | N/A | Cálculo no próprio registro, dentro da gravação |

## 7. Findings de Performance
Nenhum. A regra antes de gravar faz uma atribuição sem consulta ao banco. «Lista da equipe» agrupa 26 linhas no seed, sobre `atendente` (coluna de referência).

## 8. Findings de Bugs Técnicos
Nenhum. Conferido: valor vazio de estado cai no primeiro estado do quadro (`ProximaAcao.server.js:46,61,73`); data vazia cai no texto sem data; nenhum código do app grava contato, caso ou ciclo com `setWorkflow(false)` (busca em `app/src/server` sem ocorrência), então a regra roda em toda gravação; a verificação Playwright registra `ro: false` no campo do form do atendente, mas o print mostra o campo só leitura e o teste de servidor confirma `canWrite` falso.

## 9. Testes

**CA viraram teste?**
- AC-01: o quadro inteiro (15 casos, L27-41) e a gravação em insert, update e valor à mão (L71-90). Os 100% da base foram conferidos por REST nesta auditoria; nenhum teste ATF varre a base.
- AC-02: sem teste ATF; coberto pelo print Playwright `atendente-form-contato-aviso.png` e `verificacao-f1.json` (`atendente_form_aviso`).
- AC-03: sim. Coordenador vê o módulo e lê contatos dos dois atendentes (L117-150); atendente não vê o módulo (L152-165).
- AC-04: sem teste ATF da contagem de módulos; contagem feita por REST nesta auditoria (13).

**TDD RED/GREEN presente?** Os testes entram no mesmo commit do código (`24239fa`); há lado positivo e negativo para o campo só leitura e para a «Lista da equipe». Recibo `outputs/spec/auditorias/atf/US-MOD-UX-010.json`: 4/4 verdes no commit `8cf89bc`. Suíte `cob-regressao` 60/60 (install #66 do `sync-log.md`).

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-UX-010.now.ts` | Sim | Sim (valor à mão sobrescrito, atendente sem escrita, atendente sem o módulo) | Boa; lacunas em TEST-001 |

> **[TEST-001] Aviso no form e limite de módulos sem teste na suíte — BAIXO**
> Arquivo: `app/src/fluent/tests/US-MOD-UX-010.now.ts` · Contexto: AC-RF-MOD-UX-010-02 e -04.
> O aviso «Próximo passo» e a contagem de módulos do coordenador foram conferidos por Playwright e por consulta, fora da suíte `cob-regressao`. Uma mudança futura no menu ou na regra de exibição não é pega pelo reinstall.
> Fix: um passo `atf.form` que abre o contato e confere a mensagem; um passo de servidor que conta os `sys_app_module` ativos com o papel coordenador e confere ≤ 14.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Cálculo de «O que fazer agora» | Não; o valor fica no histórico do registro | Não se aplica | — |
| Aviso no form | Não se aplica (só exibição) | — | — |
| «Lista da equipe» | Não se aplica (filtro de módulo) | — | — |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| BRs antes de gravar em contato, caso e ciclo | Não | Todas com order ≤ 100; a nova roda em 900 e só grava `proxima_acao`; suíte 60/60 |
| Ciclo publicado e bloqueio de campos | Não | `proxima_acao` fora da lista protegida; o ciclo publicado da base tem «Acompanhar a lista» |
| Leitura do contato por papel (US-MOD-UX-006) | Não | Testes UX-006 verdes na suíte; `query_range` limitado ao campo `atendente` |
| «Minha lista» e TEL-023 | Não | Colunas conferidas em `verificacao-f1.json` (`atendente_lista_colunas`, `coord_caso_colunas`) |

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
| 1 | CONF-001 (BAIXO) | `app/src/fluent/ui/TEL-007.now.ts`, `TEL-015.now.ts`, `TEL-032.now.ts`, `TEL-005.now.ts`, `TEL-029.now.ts` | Listas do coordenador com 7 a 9 colunas, ou AC restrito às listas da A3 | `outputs/spec/gaps-document.md` (a registrar) |
| 2 | TEST-001 (BAIXO) | `app/src/fluent/tests/US-MOD-UX-010.now.ts` | ATF do aviso «Próximo passo» e da contagem de módulos do coordenador | `outputs/spec/gaps-document.md` (a registrar) |

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
