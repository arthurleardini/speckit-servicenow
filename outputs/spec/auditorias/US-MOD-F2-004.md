# Auditoria de Entrega — [US-MOD-F2-004] Sorteio do grupo de controle por ciclo

- **User Story:** US-MOD-F2-004 (nó `STORY-MOD-F2-004` no `outputs/spec/tasks.json`, label `fio-condutor`) — RF-MOD-F2-004 · Sorteio do grupo de controle por ciclo
- **Features/IDs cobertos:** RF-MOD-F2-004 · RN-NOVO-F2-005, RN-NOVO-F2-006, RN-NOVO-F1-006 · AC-RF-MOD-F2-004-01..03 e AC-STORY-MOD-F2-004-RF-MOD-F2-004-01..03 · tasks TASK-MOD-F2-004-01, TASK-MOD-F2-004-02 e SEC-010 · telas TEL-009 (Ciclo de qualificação) e TEL-010 (Carteira segmentada)
- **Branch/commit auditado:** `feat/v0` @ `a0164b0` (delta `ed5e29a..a0164b0 -- app/`)
- **Data:** 2026-11-24
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Contexto regulatório:** o app trata, no futuro, dado sob sigilo fiscal (CTN art. 198) e dado pessoal (LGPD). No v0 todo dado é fictício. O delta não grava nem registra em log CPF, CNPJ ou nome de contribuinte.

---

## 1. Inventário do delta

O delta cria o sorteio do grupo de controle: quando o coordenador publica um ciclo, o servidor gera uma semente, sorteia 10% dos contribuintes do ciclo e os marca como «Grupo de controle»; depois disso, comunicação e caso para esses contribuintes são recusados.

**Arquivos tocados pela US (11, todos em `app/`):**

| Arquivo | Papel |
|---|---|
| `app/src/server/qualificacao/QualificacaoCiclo.server.js` (novo, 250 linhas) | Script Include (classe de servidor reutilizável) com a regra: tamanho do grupo, sorteio com semente, publicação, «está no controle?» e as recusas |
| `app/src/fluent/script-includes/segmentacao-sortear-grupo-controle.now.ts` (novo) | Registra o Script Include `QualificacaoCiclo` (`package_private`, não chamável pelo navegador) |
| `app/src/fluent/business-rules/grupo-controle.now.ts` (novo) | 4 Business Rules (regras que rodam no servidor ao gravar): sortear ao publicar o ciclo; recusar comunicação e caso de quem está no controle; impedir troca do segmento «controle» depois de publicado |
| `app/src/server/qualificacao/publicarCiclo.server.js`, `recusarAcaoControle.server.js`, `segmentoControleImutavel.server.js` (novos) | Corpo das 3 Business Rules; chamam o Script Include e cancelam a gravação com mensagem |
| `app/src/fluent/ui-actions/ciclo.now.ts` (novo) | Botão «Publicar ciclo» no form do ciclo, só para o papel coordenador e só com o ciclo em prévia |
| `app/src/fluent/security/ciclo.now.ts` (novo) | 3 ACL (regras de acesso da plataforma) do ciclo: gravar registro e campos só em prévia (coordenador e admin do app); criar ciclo (coordenador e admin do app) |
| `app/src/fluent/tests/US-MOD-F2-004.now.ts` (novo, 584 linhas) | 9 testes ATF (Automated Test Framework, os testes automáticos que rodam na instância) |
| `app/src/fluent/tests/suite.now.ts` | Inclui os 9 testes na suíte de regressão `cob-regressao` |
| `app/src/fluent/generated/keys.ts` | Chaves geradas pelo build (não editado à mão) |

**Endpoints alterados/criados:** nenhuma rota REST nova. A ação nova é a UI Action «Publicar ciclo» (`actionName: x_cob_publicar_ciclo`) em `x_2326104_cob_ciclo`. As tabelas tocadas já tinham `allowWebServiceAccess: true` (acesso pela Table API) antes desta US.
**Entidades/modelos tocados:** `x_2326104_cob_ciclo` (grava estado, semente, totais, data e autor), `x_2326104_cob_segmentacao` (grava segmento «controle» e motivo), `x_2326104_cob_comunicacao` e `x_2326104_cob_caso` (só recusa de inclusão), `x_2326104_cob_criterio` (só leitura do percentual e do estado).
**Stack envolvido no delta:** ServiceNow app escopado `x_2326104_cob`, Fluent `@servicenow/sdk` 4.14.3; script de servidor ES5 (`Class.create`, `GlideRecord`, `GlideAggregate`); ATF com `runServerSideScript` (Jasmine 3.1), `createUser`, `recordInsert` e passos de form `uiActionVisibility`.

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo ed5e29a --repo app` → 11 arquivos varridos, **0 achados** (exit 0). Semgrep e gitleaks não estão instalados nesta máquina.

## 2. Mapa de regressão leve

Pontos que o delta encosta e que já existiam antes desta US:

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| `business-rules/ciclo.now.ts` + `CriterioVersao.motivoRecusaAlteracaoCiclo` (`CriterioVersao.server.js:66-80`, US-MOD-F2-002) | Também roda no `before update` do ciclo; as duas regras precisam não se atropelar | médio |
| ACL de leitura do ciclo e da segmentação (`security/acl-base.now.ts:126-157`, gerado) | A US acrescenta ACL de gravação no ciclo; a leitura continua a gerada | baixo |
| Testes da US-MOD-F2-002 na suíte `cob-regressao` (`tests/suite.now.ts`) | A ACL nova de gravação do ciclo pode mudar o resultado de testes que gravam ciclo | médio |
| Tabelas `comunicacao` e `caso` | Ganham Business Rule `before insert` que consulta a segmentação | médio (stories da régua e da distribuição ainda vão gravar nelas) |
| GAP-113 (CONF-004 da auditoria da US-MOD-F2-002) | Ficou marcado para ser tratado «na US-MOD-F2-004» | médio |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (spec, tech-rules, critérios de aceite e regras de negócio), segurança (ACL, papel, regra no servidor, aleatoriedade, adulteração do grupo), teste de mesa, performance do código novo, bugs de script de servidor, testes ATF, observabilidade e regressão nos vizinhos acima.

**Não auditado (e por quê):**
- Rate limiting — N/A: não há autenticação nem rota nova; a publicação é única por ciclo.
- SSRF, upload, prompt injection — N/A: o delta não recebe URL, arquivo nem chama LLM.
- Segredo exposto — varredura sem achado e leitura manual sem credencial ou URL de instância no código.
- ACL de `delete` do ciclo e da segmentação e `allowWebServiceAccess` ligado — vêm do scaffold e são escopo do SEC-001 / story transversal, não deste delta. Aparecem só como contexto do SEC-022.
- Critérios `AC-STORY-MOD-F2-004-RF-MOD-F6-004-01..03` (taxa cobrada, taxa do controle, efeito incremental) — N/A aqui: são os mesmos critérios da `STORY-MOD-F6-004` (task `TASK-MOD-F6-004-01`, ainda PENDING), que calcula o efeito no encerramento do ciclo. Esta US só deixa o grupo pronto para esse cálculo.

## 4. Conformidade

Verificado contra `outputs/spec/tech-rules/*.mdc`, `.claude/rules/harness/{deliver,security,servicenow-ui}.md`, `business-rules.md` e o nó da story no `tasks.json`.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| AC-RF-MOD-F2-004-01 / AC-STORY…-01 — 200 elegíveis e 10%: 20 no «Grupo de controle», semente gravada, «Grupo de controle = 20» | `QualificacaoCiclo.server.js:91-139`; teste `tests/US-MOD-F2-004.now.ts:7-89` | ✅ PASS | ATF verde com 200 contribuintes fictícios |
| AC-RF-MOD-F2-004-02 / AC-STORY…-02 — mesma semente e mesmos elegíveis dão a mesma lista | `QualificacaoCiclo.server.js:48-57, 192-221`; testes `:82-83`, `:135-142` | ✅ PASS | Embaralhamento Fisher-Yates com gerador Park-Miller, ordem fixa por contribuinte |
| AC-RF-MOD-F2-004-03 / AC-STORY…-03 — nenhuma comunicação nem caso para quem está no controle | `business-rules/grupo-controle.now.ts:6-28`; `QualificacaoCiclo.server.js:152-173`; teste `:205-293` | ✅ PASS | A régua ainda não existe; a recusa está na gravação, então vale para qualquer origem futura (régua, distribuição, importação) |
| RN-NOVO-F2-005 passo 1 — elegíveis = massificada + qualificada antes do sorteio | `QualificacaoCiclo.server.js:192-202` | ⚠️ PARCIAL | Conta todas as linhas do ciclo, inclusive as que já estiverem em «controle» antes da publicação (ver SEC-022) |
| RN-NOVO-F2-005 passos 2-5 — semente gravada, arredondar para cima, sem reposição, marcar e totalizar | `QualificacaoCiclo.server.js:32-39, 108-137` | ✅ PASS | 205 × 10% = 21 testado (`:144`) |
| RN-NOVO-F2-005 passo 6 — bloquear comunicação e caso no ciclo | `QualificacaoCiclo.server.js:152-173` | ✅ PASS | Com ressalva de BUG-002 (comunicação sem ciclo) |
| RN-NOVO-F2-006 — 10% gravado na versão do critério | `QualificacaoCiclo.server.js:108-111` | ✅ PASS | Lê `pct_grupo_controle` da versão; 10% só como reserva se a versão vier vazia ou fora de 0-100 |
| RN-NOVO-F1-006 — ciclo mensal | — | N/A | Premissa de cadência; o delta não cria ciclo nem confere mês de referência |
| TASK-MOD-F2-004-02, cenário «Restringir a publicação ao coordenador» — admin do app não vê «Publicar ciclo» | `ui-actions/ciclo.now.ts:13-14`; teste `:474-488` | ✅ PASS | |
| Mesmo cenário — «Ciclo de qualificação» e «Carteira segmentada» não aparecem no menu do atendente | `navigation/menu.now.ts:59, 65`; `security/acl-base.now.ts:126-157` | ❌ FAIL | Ver CONF-002 |
| Arquitetura: sorteio em Script Include `QualificacaoCiclo.sortearControle` chamado pela UI Action «Publicar ciclo» | `QualificacaoCiclo.server.js:66-140` | ✅ PASS | O nome do método mudou (`publicar` + `prepararPublicacao`) e o sorteio foi para a Business Rule, para valer também por lista e API. Escolha mais restritiva que a da spec |
| Business Rule: condição no `condition`, sem `current.update()`, `setWorkflow(false)` só justificado | `grupo-controle.now.ts:41, 52` | ✅ PASS | `setWorkflow(false)` só nos testes, para montar massa |
| UI Action: `roles` + `condition`, `setRedirectURL`, regra reconferida no servidor | `ui-actions/ciclo.now.ts:13-26`; `QualificacaoCiclo.server.js:101-103` | ✅ PASS | |
| Script Include `package_private`, `clientCallable: false` | `segmentacao-sortear-grupo-controle.now.ts:11-12` | ✅ PASS | |
| `$id` com o ID da spec | todos os `.now.ts` do delta | ✅ PASS | `RF-MOD-F2-004_*`; o SEC-010 pedia `SEC-010_<tipo>_<nome>`, mas os controles usam o RF. Rastreio pelo comentário e pela descrição |
| Aleatoriedade por CSPRNG, nunca `Math.random()` (`security.md`, Camada D) | `QualificacaoCiclo.server.js:112` | ❌ FAIL | Ver CONF-001 |
| Mensagem ao usuário em texto traduzível (`servicenow-ui.md`) | `QualificacaoCiclo.server.js:15-21, 80`; `ui-actions/ciclo.now.ts:21-24` | ⚠️ PARCIAL | Literais fixos em português; ver CONF-003 |
| Sem consulta dentro de laço (`architecture.mdc`, Performance) | `QualificacaoCiclo.server.js:122-127` | ⚠️ PARCIAL | Uma gravação por sorteado, e cada gravação dispara uma consulta da Business Rule; ver PERF-001 |
| Log sem dado pessoal | `QualificacaoCiclo.server.js:138`; `publicarCiclo.server.js:6`; `recusarAcaoControle.server.js:5`; `segmentoControleImutavel.server.js:5` | ✅ PASS | Só sys_id, tabela e mensagem |
| GAP-113 (ciclo incluído já «publicado») tratado nesta US | `business-rules/grupo-controle.now.ts:30-41` (só `update`) | ❌ FAIL | Continua aberto; parte do SEC-022 |

**CA da US cumpridos?** Sim. AC-RF-MOD-F2-004-01, -02 e -03 (e os três AC-STORY-MOD-F2-004-RF-MOD-F2-004 equivalentes) estão no código e em teste ATF verde. Os três AC-STORY-MOD-F2-004-RF-MOD-F6-004 são N/A aqui (pertencem à STORY-MOD-F6-004, ver seção 3).
**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-022] Contribuinte entra no «Grupo de controle» sem passar pelo sorteio — MÉDIO** (ID proposto) · CVSS 4.4 (AV:N/AC:L/PR:H/UI:N/S:U/C:N/I:M/A:N) · OWASP A04 (design inseguro), A08 (falha de integridade de dado) · CWE-840 (falha de regra de negócio) · STRIDE T (adulteração) · ASVS 5.0 V2 (lógica de negócio)
> **Arquivo:** `QualificacaoCiclo.server.js:122-127, 179-190, 192-202`; `business-rules/grupo-controle.now.ts:30-54` · **Contexto:** publicação do ciclo, tabelas `x_2326104_cob_ciclo` e `x_2326104_cob_segmentacao`.
> **Problema:** o sorteio só **acrescenta** sorteados ao grupo; não confere quem já estava em «controle». A proteção do segmento (`motivoRecusaSegmento`) só vale **depois** da publicação e só em **alteração**. Sobram três caminhos para pôr ou tirar alguém do grupo sem sorteio:
> 1. com o ciclo em prévia, gravar `segmento = controle` numa linha da segmentação: na publicação essa linha continua no controle, entra na contagem de elegíveis e soma no «Grupo de controle» (fica 20 + N);
> 2. depois de publicado, **incluir** uma linha nova com `segmento = controle`, ou **excluir** uma linha do controle (as regras novas olham só `update`);
> 3. incluir o ciclo já como «publicado» (a regra de publicação olha só `update`; é o GAP-113, que a auditoria anterior deixou para esta US).
> **Risco:** quem consegue gravar na segmentação por script, importação ou papel com escrita escolhe contribuintes que ficam fora da cobrança e distorce o efeito incremental do ciclo — exatamente a manipulação que o SEC-010 quer impedir. Hoje a segmentação não tem ACL de escrita no repositório, então pelo form e pela lista só o admin da plataforma alcança os caminhos 1 e 2. O caminho 3 depende de como a ACL de campo do ciclo trata a inclusão, e não há teste. Por isso MÉDIO, não ALTO.
> **Fix:** (a) na publicação, antes do sorteio, recusar se houver linha em «controle» no ciclo, ou devolver essas linhas ao segmento de origem; (b) Business Rule `before insert` e `before delete` na segmentação que recuse «controle» fora do sorteio e exclusão de linha de ciclo publicado; (c) Business Rule `before insert` no ciclo que exija nascer em «prévia», sem semente, totais e autoria (fecha o GAP-113).
> **TDD RED:** ciclo em prévia com 20 elegíveis, um deles gravado por script como «controle»; publicar → hoje fica `qtd_controle = 3` e o contribuinte escolhido continua no grupo. Incluir ciclo com `estado = publicado` → hoje grava.
> **TDD GREEN:** com o fix, a publicação recusa (ou devolve a linha) e `qtd_controle = 2`; a inclusão de ciclo «publicado» e a inclusão ou exclusão de linha em «controle» de ciclo publicado são recusadas com mensagem.
> **GAP recomendado:** GAP-117 (absorve o GAP-113).

> **[CONF-001] Semente gerada com `Math.random()` — BAIXO** · CWE-330 (aleatoriedade insuficiente) · ASVS 5.0 V11
> **Arquivo:** `QualificacaoCiclo.server.js:112`.
> **Problema:** a rule universal de segurança (Camada D) proíbe `Math.random()` e pede gerador criptográfico (CSPRNG). O próprio SEC-010 cita a CWE-330.
> **Risco:** baixo neste uso. A semente é gerada no servidor uma vez, gravada e não há como repetir a publicação para «tentar outra semente». Fica a não conformidade com a regra do projeto.
> **Fix:** `GlideSecureRandomUtil.getSecureRandomInt()` (limitado a 1..2147483646), mantendo o Park-Miller para reproduzir a partir da semente.
> **GAP recomendado:** GAP-118.

## 6. Testes de mesa (vetores no delta)

Rastreei o fluxo como um usuário mal-intencionado, com as tabelas e papéis reais.

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR (acessar registro de outro) | O ciclo e a segmentação não têm dono; a leitura é por papel, gerada pelo scaffold | N/A | `acl-base.now.ts:126-157` |
| Auth bypass — publicar sem o botão (lista, form trocando «Estado», Table API, script) | Gravar `estado = publicado` direto no ciclo | ✅ BLOQUEADO | A Business Rule `before update` reconfere papel e critério (`QualificacaoCiclo.server.js:101-107`); teste `:490-584` |
| Elevação de privilégio — admin do app publica | Usuário só com `x_2326104_cob.admin` | ✅ BLOQUEADO | Botão oculto (`:474-488`) e servidor recusa (`:295-330`) |
| Adulteração da semente ou dos totais, antes e depois de publicar | Gravar `semente_sorteio = 42` em prévia; trocar semente em ciclo publicado | ✅ BLOQUEADO | `QualificacaoCiclo.server.js:92-99`; `CriterioVersao.server.js:66-80`; testes `:415-425`, `:563-569` |
| Adulteração do grupo — tirar alguém do controle depois de publicar | `update` do segmento | ✅ BLOQUEADO | `QualificacaoCiclo.server.js:179-190`; teste `:426-438` |
| Adulteração do grupo — pôr alguém no controle sem sorteio (prévia, inclusão, exclusão, ciclo incluído publicado) | Segmentação e ciclo | ❌ VULNERÁVEL (MÉDIO) | SEC-022 |
| Ação de cobrança para contribuinte em controle | `insert` em comunicação e caso | ✅ BLOQUEADO | `recusarAcaoControle.server.js:3-8`; teste `:267-281` |
| Injeção | Consultas por `addQuery` com sys_id; sem `addEncodedQuery` montado com texto do usuário | ✅ BLOQUEADO | `QualificacaoCiclo.server.js:119-121, 156-162, 194-198` |
| Segredo exposto | — | ✅ BLOQUEADO | Varredura sem achado |
| Mass assignment (gravar campo do sistema pelo form) | Semente, totais, data e autor do ciclo | ✅ BLOQUEADO | `QualificacaoCiclo.server.js:92-99` (exceto `qtd_sem_score`, que a publicação sobrescreve) |
| Rate limiting | — | N/A | Publicação única por ciclo |
| Race condition — duas publicações ao mesmo tempo | Dois cliques no mesmo ciclo | ✅ BLOQUEADO (aceitável) | A segunda gravação chega com `previous.estado = publicado` e cai na regra de ciclo publicado; sem lock explícito, mas sem dano observado no código |
| Previsibilidade do sorteio | `Math.random()` | ⚠️ BAIXO | CONF-001 |

## 7. Findings de Performance

**[PERF-001] Uma gravação por sorteado, e cada uma dispara uma consulta — BAIXO**
`QualificacaoCiclo.server.js:122-127` grava a segmentação linha a linha; cada `seg.update()` dispara `br_segmento_controle_imutavel`, que faz `ciclo.get()` (`:185-186`). Com 300 linhas por ciclo (limite do seed) são cerca de 30 gravações e 30 consultas na mesma transação: hoje aceitável. Com carteira real de milhares de elegíveis, o tempo do clique cresce na mesma proporção. **Fix:** marcar os sorteados de uma vez (`addQuery('contribuinte', 'IN', lista)` + `updateMultiple()`), ou condicionar a Business Rule a ciclo não-prévia. GAP-119.

## 8. Findings de Bugs Técnicos

**[BUG-001] Contribuinte repetido no mesmo ciclo conta duas vezes — BAIXO** (JavaScript de servidor)
`QualificacaoCiclo.server.js:115-127, 192-202`. O sorteio sorteia linhas, mas marca por contribuinte. Se a segmentação tiver duas linhas do mesmo contribuinte no ciclo (não há índice único `ciclo + contribuinte`), ele vale dois elegíveis e, sorteado, marca as duas linhas: o grupo passa do percentual. **Fix:** índice único `ciclo + contribuinte` pelo `data-model.json` + `sn-scaffold`, ou montar elegíveis por contribuinte distinto. GAP-120.

**[BUG-002] Comunicação ou caso sem ciclo é recusado por controle de qualquer ciclo publicado — BAIXO**
`QualificacaoCiclo.server.js:152-173`. O campo `ciclo` é opcional em comunicação e caso (`tables/comunicacao.now.ts:15`, `tables/caso.now.ts:14`). Sem ciclo, a regra procura «controle» em qualquer ciclo publicado: quem foi controle no ciclo anterior ainda não encerrado fica sem cobrança no ciclo novo. Em sentido oposto, depois de o ciclo ser «encerrado», comunicação ligada a ele para quem era controle passa a ser aceita. A RN-NOVO-F2-005 diz «naquele ciclo». **Fix:** decidir com o PO se comunicação e caso exigem ciclo; considerar «encerrado» na consulta. GAP-121.

## 9. Testes

**Recibo ATF:** `outputs/spec/auditorias/atf/US-MOD-F2-004.json` — status `success`, commit `a0164b0dd34d5411dd5030481c4387c466088dae`, 2026-11-24T19:51Z, 9 de 9 testes verdes (ainda não commitado). Install `ok` do mesmo commit no `outputs/spec/sync-log.md` (linha de 2026-11-24 16:49, alteração ainda não commitada).

**CA viraram teste?** AC-01 sim (`:7-89`); AC-02 sim (`:82-83`, `:135-142`); AC-03 sim, na gravação (`:205-293`). **TDD RED/GREEN presente?** Há caso positivo e negativo por regra, mas nenhuma saída RED guardada (mesma situação do TEST-001 da US-MOD-F2-002). **Cobertura do delta:** boa no caminho feliz e nas recusas principais; faltam os caminhos do SEC-022 e o cenário do menu do atendente.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `t_f2004_sorteio_pos` (`:7-89`) | Sim — 200 → 20, semente, totais, autor, sorteio refeito | — | Bom; publica como coordenador criado pelo ATF |
| `t_f2004_semente_neg` (`:91-152`) | Sim — mesma semente | Sim — semente diferente; 205 → 21; zero | Bom |
| `t_f2004_sem_elegiveis` (`:154-203`) | Sim — publica com zero | — | Bom (cenário de borda da task) |
| `t_f2004_acao_neg` (`:205-293`) | Sim — fora do controle grava | Sim — comunicação e caso recusados | Bom; não cobre comunicação sem ciclo (BUG-002) |
| `t_f2004_publicar_neg` (`:295-360`) | — | Sim — admin do app; sem critério publicado | Bom |
| `t_f2004_imutavel_neg` (`:362-456`) | Sim — troca fora do controle | Sim — semente e saída do controle; `canWrite() = false` com usuário de papel | Bom; não cobre inclusão/exclusão nem prévia (SEC-022) |
| `t_f2004_ui` / `t_f2004_ui_neg` (`:458-488`) | Sim — coordenador vê o botão | Sim — admin do app não vê | Bom (teste de form) |
| `t_f2004_outro_caminho` (`:490-584`) | Sim — publicar trocando «Estado» sorteia | Sim — admin do app recusado; semente à mão recusada | Bom; cobre a publicação fora do botão |

**[TEST-001] Sem evidência de regressão no commit auditado — MÉDIO**
O recibo da suíte `outputs/spec/auditorias/atf/cob-regressao.json` é do commit `1c417e7` (US-MOD-F2-002) e está como `failure`; o recibo desta US roda só os 9 testes novos. A US acrescenta ACL de gravação no ciclo e Business Rules em comunicação e caso, e os 13 testes da US-MOD-F2-002 não têm execução registrada depois disso. **Fix:** rodar a suíte `cob-regressao` no commit atual e guardar o recibo verde; investigar a falha anterior. GAP-122.

**Validação por task (G3):** `outputs/spec/auditorias/TASK-MOD-F2-004-01.validacao.json` existe — veredito APROVADO, rodada 1, **modo `sem-agentes`** (as 7 dimensões sem validador com LLM; build e ATF verdes). Ao fim desta auditoria ainda não existiam os arquivos de `TASK-MOD-F2-004-02` e `SEC-010`. A story é de fio condutor, que pede G3 com LLM: mesma situação do CONF-005 / GAP-107 da US-MOD-F2-002.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Publicar ciclo (sorteio) | Sim — `gs.info` com sys_id do ciclo e total do controle (`QualificacaoCiclo.server.js:138`) | `sys_audit` (tabela com `audit: true`); `publicado_em` e `publicado_por` no registro | OBS-001 |
| Publicação recusada | Sim — `gs.warn` com sys_id e mensagem (`publicarCiclo.server.js:6`) | — | OBS-001 |
| Comunicação/caso recusado por controle | Sim — `gs.warn` com tabela, sys_id e mensagem (`recusarAcaoControle.server.js:5`) | — | OBS-001 |
| Troca do segmento recusada | Sim — `gs.warn` (`segmentoControleImutavel.server.js:5`) | — | OBS-001 |

**[OBS-001] Log sem usuário, operação e código do controle — BAIXO.** A task pede «sys_id, usuário» no `gs.info` e o SEC-010 pede `SEC-010, usuário, tabela, operação` no `gs.warn` de recusa. Os logs trazem só o RF e o sys_id; a semente também não vai para o log de publicação (está no registro). Nenhum dado pessoal no log. **Fix:** incluir `gs.getUserID()`, a operação e `SEC-010`. Somar ao GAP-111 (mesmo achado da US-MOD-F2-002).

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| `br_ciclo_publicado_imutavel` / `motivoRecusaAlteracaoCiclo` (US-MOD-F2-002) | Não. As condições não se cruzam: a regra nova roda com `previous.estado == 'previa'` (`grupo-controle.now.ts:41`, order 50); a antiga com `previous.estado` publicado/encerrado (`business-rules/ciclo.now.ts:15`, order 100). A antiga continua impedindo voltar de «publicado» para «prévia» | `CriterioVersao.server.js:74-78`; teste `:415-425` |
| ACL de leitura gerada | Não. A US só acrescenta `write`/`create`; a leitura gerada continua igual | `security/ciclo.now.ts:8-35` |
| Testes da US-MOD-F2-002 na suíte | Sem evidência — não rodaram no commit auditado | TEST-001 |
| `comunicacao` e `caso` | Sim, intencional: toda inclusão passa a consultar a segmentação (1 consulta com `setLimit(1)`). Comportamento de comunicação sem ciclo em BUG-002 | `QualificacaoCiclo.server.js:152-173` |
| GAP-113 | Continua aberto | SEC-022 |
| Menu e ACL do atendente para ciclo e segmentação | Não regrediu, mas não atende o cenário de autorização da task | CONF-002 |

**[CONF-002] Atendente vê e lê ciclo e carteira segmentada — MÉDIO.** O cenário «Restringir a publicação ao coordenador» da TASK-MOD-F2-004-02 diz que «Ciclo de qualificação» e «Carteira segmentada» não aparecem no menu do atendente. Hoje os dois módulos e as ACL de leitura incluem `x_2326104_cob.atendente` (`navigation/menu.now.ts:59, 65`; `security/acl-base.now.ts:126-157`). Os arquivos são gerados: a correção é no `data-model.json` + `sn-scaffold`, com teste de leitura negada. Mesma causa do CONF-002 / GAP-106 da US-MOD-F2-002 (critério). Somar ao GAP-106.

**[CONF-003] Mensagens em texto fixo — BAIXO.** `QualificacaoCiclo.server.js:15-21, 80` e `ui-actions/ciclo.now.ts:21-24` mostram literais; a rule de interface pede mensagem traduzível (`gs.getMessage`). Sem efeito no v0 (só português). GAP-123.

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

Os três critérios de aceite da US estão no código e em teste ATF verde no commit auditado, e o SEC-010 está entregue nos pontos principais: sorteio só no servidor, semente e totais protegidos, segmento «controle» fixo depois de publicar, recusa de comunicação e caso. Ficam achados MÉDIO e BAIXO, sem bloqueio: o grupo ainda pode receber gente fora do sorteio por caminhos de escrita direta (SEC-022), falta evidência da suíte de regressão (TEST-001) e o atendente vê ciclo e carteira (CONF-002).

| Condição de bloqueio | Status |
|---|---|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há CRÍTICO/ALTO) |

## 13. Pontos a revisar / próximos passos

SEC-022 é **proposto** por esta auditoria (o maior SEC no `tasks.json` é o SEC-020; o SEC-021 já foi proposto na auditoria da US-MOD-F2-002). Os GAP-117 a GAP-123 são **propostos** para `outputs/spec/gaps-document.md` (o maior existente é o GAP-116). Por instrução desta execução, nenhuma task, issue ou GAP foi criado, nenhum código foi alterado, nada foi commitado e o marcador `outputs/spec/em-andamento.md` **não** foi apagado. O fechamento da US (apagar o marcador e commitar a remoção, junto com o recibo ATF e a linha do `sync-log.md`) fica com quem conduz a entrega.

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|---|---|---|---|
| 1 | SEC-022 (MÉDIO, proposto) — contribuinte entra no controle sem sorteio | `QualificacaoCiclo.server.js:122-127, 179-202`; `grupo-controle.now.ts:30-54` | Recusar «controle» pré-existente na publicação; `before insert`/`before delete` na segmentação; ciclo nasce em prévia; testes RED/GREEN | `gaps-document.md` (GAP-117, absorve o GAP-113) + task SEC-022 no próximo sprint |
| 2 | TEST-001 (MÉDIO) — suíte de regressão sem recibo no commit | `outputs/spec/auditorias/atf/cob-regressao.json` | Rodar `cob-regressao` em `a0164b0` (ou no commit seguinte) e guardar recibo verde | `gaps-document.md` (GAP-122) |
| 3 | CONF-002 (MÉDIO) — atendente vê ciclo e carteira segmentada | `navigation/menu.now.ts:59, 65`; `security/acl-base.now.ts:126-157` | Tirar o atendente pelo `data-model.json` + `sn-scaffold`; teste de leitura negada | `gaps-document.md` (somar ao GAP-106) |
| 4 | G3 sem validadores de LLM no fio condutor | `outputs/spec/auditorias/TASK-MOD-F2-004-01.validacao.json` | Rodar o G3 com validadores ou registrar isenção de G3 da story | `gaps-document.md` (somar ao GAP-107) |
| 5 | CONF-001 (BAIXO) — `Math.random()` na semente | `QualificacaoCiclo.server.js:112` | `GlideSecureRandomUtil.getSecureRandomInt()` | `gaps-document.md` (GAP-118) |
| 6 | PERF-001 (BAIXO) — gravação e consulta por sorteado | `QualificacaoCiclo.server.js:122-127, 185-186` | `updateMultiple()` por lista de contribuintes | `gaps-document.md` (GAP-119) |
| 7 | BUG-001 (BAIXO) — contribuinte repetido no ciclo | `QualificacaoCiclo.server.js:115-127, 192-202` | Índice único `ciclo + contribuinte` ou elegíveis distintos | `gaps-document.md` (GAP-120) |
| 8 | BUG-002 (BAIXO) — comunicação/caso sem ciclo e ciclo encerrado | `QualificacaoCiclo.server.js:152-173` | Decidir com o PO se o ciclo é obrigatório; tratar «encerrado» | `gaps-document.md` (GAP-121) |
| 9 | OBS-001 (BAIXO) — log sem usuário, operação e SEC-010 | `QualificacaoCiclo.server.js:138`; `publicarCiclo.server.js:6`; `recusarAcaoControle.server.js:5`; `segmentoControleImutavel.server.js:5` | Incluir usuário, operação e `SEC-010` | `gaps-document.md` (somar ao GAP-111) |
| 10 | CONF-003 (BAIXO) — mensagens em texto fixo | `QualificacaoCiclo.server.js:15-21, 80`; `ui-actions/ciclo.now.ts:21-24` | `gs.getMessage` | `gaps-document.md` (GAP-123) |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@a0164b0
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
