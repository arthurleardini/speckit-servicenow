# Auditoria de Entrega — [US-MOD-F2-005] Score como critério com fallback

- **User Story:** US-MOD-F2-005 (nó `STORY-MOD-F2-005` no `outputs/spec/tasks.json`, label `fio-condutor`) — RF-MOD-F2-005 · Score como critério com fallback
- **Features/IDs cobertos:** RF-MOD-F2-005 · RN-NOVO-F3-001, RN-NOVO-F3-002 · AC-RF-MOD-F2-005-01..03 e AC-STORY-MOD-F2-005-RF-MOD-F2-005-01..03 · tasks TASK-MOD-F2-005-01 e TASK-MOD-F2-005-02 · telas TEL-008 (Versão do critério de qualificação) e TEL-010 (Carteira segmentada)
- **Branch/commit auditado:** `feat/v0` @ `74aecbc` (delta `f45a8ec..74aecbc -- app/`)
- **Data:** 2026-11-24
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Contexto regulatório:** o app trata, no futuro, dado sob sigilo fiscal (CTN art. 198) e dado pessoal (LGPD). No v0 todo dado é fictício. O delta não grava nem registra em log CPF, CNPJ ou nome de contribuinte.

> **Dependências da story ainda abertas:** `STORY-MOD-F2-003` (segmentação massificada × qualificada, com a ação «Gerar prévia») e `STORY-MOD-F3-001` (ingestão e normalização do score) estão com as tasks em `PENDING` no `tasks.json`. Esta US entrega a regra do score antes das duas. Isso explica parte dos achados de conformidade (CONF-001, CONF-002).

---

## 1. Inventário do delta

O delta faz a carteira segmentada se classificar sozinha quando uma linha nova entra sem segmento. Se a versão do critério usa score, o contribuinte com score válido acima do threshold vai para a «Qualificada»; abaixo, para a «Massificada». Sem score válido, valem só valor e atraso, e a linha, o contribuinte e o total do ciclo ficam marcados «Sem score».

**Arquivos tocados pela US (8, todos em `app/`):**

| Arquivo | Papel |
|---|---|
| `app/src/server/qualificacao/SegmentacaoScore.server.js` (novo, 146 linhas) | Script Include (classe de servidor reutilizável) com a regra: score válido (0 a 100), classificação, leitura de valor e atraso do contribuinte, preenchimento da linha e soma do «Sem score» no ciclo |
| `app/src/fluent/script-includes/segmentacao-fallback-sem-score.now.ts` (novo) | Registra o Script Include `SegmentacaoScore` (`package_private`, não chamável pelo navegador), `$id` `RF-MOD-F2-005_si_fallback_sem_score` |
| `app/src/fluent/business-rules/segmentacao.now.ts` (novo) | 2 Business Rules (regras que rodam no servidor ao gravar) na carteira segmentada: classificar a linha que chega sem segmento (`before insert`) e marcar o contribuinte e o total do ciclo quando a linha fica «Sem score» (`after insert/update`) |
| `app/src/server/qualificacao/marcarSemScore.server.js`, `propagarSemScore.server.js` (novos) | Corpo das 2 Business Rules; chamam o Script Include |
| `app/src/fluent/tests/US-MOD-F2-005.now.ts` (novo, 273 linhas) | 4 testes ATF (Automated Test Framework, os testes automáticos que rodam na instância), todos de servidor |
| `app/src/fluent/tests/suite.now.ts` | Inclui os 4 testes na suíte de regressão `cob-regressao` |
| `app/src/fluent/generated/keys.ts` | Chaves geradas pelo build (não editado à mão) |

**Endpoints alterados/criados:** nenhuma rota REST, UI Action ou tela nova. O comportamento novo dispara na gravação de `x_2326104_cob_segmentacao`, por qualquer caminho (script, importação, form, Table API).
**Entidades/modelos tocados:** `x_2326104_cob_segmentacao` (grava versão, segmento, «Sem score», score usado, valor em aberto e motivo), `x_2326104_cob_contribuinte` (grava `sem_score`; lê `score`), `x_2326104_cob_ciclo` (grava `qtd_sem_score`; lê versão e estado), `x_2326104_cob_criterio` e `x_2326104_cob_debito` (só leitura).
**Stack envolvido no delta:** ServiceNow app escopado `x_2326104_cob`, Fluent `@servicenow/sdk` 4.14.3; script de servidor ES5 (`Class.create`, `GlideRecord`, `GlideAggregate`); ATF com `runServerSideScript` (Jasmine 3.1) e `createUser` (que, por padrão do SDK, já entra como o usuário criado).

**Varredura determinística:** `node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo f45a8ec --repo app` → 8 arquivos varridos, **0 achados** (exit 0).

## 2. Mapa de regressão leve

Pontos que já existiam antes desta US e que o delta encosta:

| Ponto vizinho | Por que o delta o afeta | Risco |
|---|---|---|
| Publicação do ciclo: `br_publicar_ciclo` + `QualificacaoCiclo.prepararPublicacao` (`QualificacaoCiclo.server.js:91-140`, US-MOD-F2-004) | O sorteio grava linhas da segmentação; a nova regra `after update` roda em cada linha sorteada que esteja «Sem score» e pode regravar o ciclo que está sendo publicado | médio |
| `br_segmento_controle_imutavel` (`grupo-controle.now.ts:43-54`) | Também roda na segmentação (`before update`) | baixo |
| Campos de sistema do ciclo protegidos em prévia (`QualificacaoCiclo.server.js:92-99`) | A nova regra grava `qtd_sem_score` no ciclo em prévia; se o campo estivesse na lista protegida, a gravação seria recusada | médio |
| Seed da segmentação, do contribuinte e do ciclo (`seed/segmentacao.now.ts`, `seed/contribuinte.now.ts`, `seed/ciclo.now.ts`) | As regras novas olham `segmento`, `sem_score` e `score`, que o seed já preenche | baixo |
| Suíte `cob-regressao` e testes das US-MOD-F2-002/F2-004 | 4 testes novos na mesma suíte | médio |
| Futura ação «Gerar prévia» (STORY-MOD-F2-003) | A classificação só acontece se a prévia inserir a linha **sem** segmento | médio |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (spec, tech-rules, critérios de aceite, regras de negócio e cenários das tasks), segurança (regra no servidor, escrita na segmentação, origem do score), teste de mesa, performance do código novo, bugs de script de servidor, testes ATF, observabilidade e regressão nos vizinhos acima.

**Não auditado (e por quê):**
- Rate limiting — N/A: não há autenticação nem rota nova.
- SSRF, upload, prompt injection — N/A: o delta não recebe URL, arquivo nem chama LLM.
- IDOR (acesso ao registro de outro usuário) — N/A: segmentação, ciclo e critério não têm dono; a leitura é por papel, gerada pelo scaffold. A carteira do atendente é da STORY-MOD-F5-007.
- ACL de escrita da segmentação e do contribuinte e `allowWebServiceAccess` ligado — vêm do scaffold e são escopo do SEC-001 / SEC-007 (story transversal). Aparecem só como contexto.
- Algoritmo completo da segmentação (RN-NOVO-F2-003) — é da STORY-MOD-F2-003. Audito apenas a parte determinística que este delta passou a calcular (BUG-001, CONF-002).

## 4. Conformidade

Verificado contra `outputs/spec/tech-rules/*.mdc`, `.claude/rules/harness/{deliver,security,servicenow-ui}.md`, `business-rules.md`, `requirements.md` e o nó da story no `tasks.json`.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---|---|---|---|
| AC-RF-MOD-F2-005-01 / AC-STORY…-01 — threshold 60, score válido 72, atende valor e atraso → «Qualificada» com «Score usado = 72» | `SegmentacaoScore.server.js:55-59, 108-113`; teste `tests/US-MOD-F2-005.now.ts:8-96` (`:81-86`) | ✅ PASS | ATF verde, contribuinte J fictício |
| AC-RF-MOD-F2-005-02 / AC-STORY…-02 — score válido 41 → «Massificada» | `SegmentacaoScore.server.js:55-58`; teste `:87-91` | ✅ PASS | Contribuinte K fictício |
| AC-RF-MOD-F2-005-03 / AC-STORY…-03 — sem score válido: só valor e atraso, «Sem score» marcado e o ciclo soma 1 | `SegmentacaoScore.server.js:51-54, 121-143`; teste `:98-178` | ✅ PASS | Linha, contribuinte e `qtd_sem_score = 1` conferidos |
| RN-NOVO-F3-001 — com «usar score», qualifica só com score válido ≥ threshold | `SegmentacaoScore.server.js:46, 55-58` | ✅ PASS | Usa `>=`; ver BUG-003 (threshold vazio vale 0) |
| RN-NOVO-F3-002 passo 1 — procurar o score na **última ingestão com status «válido»** (ausente, inválido ou modelo indisponível = sem score) | `SegmentacaoScore.server.js:28-34, 81-84` | ⚠️ PARCIAL | Lê o campo `score` do contribuinte e julga válido só pela faixa 0–100; ignora `x_2326104_cob_score_sim` (status, data de ingestão, versão do modelo). Ver CONF-001 |
| RN-NOVO-F3-002 passos 2 e 4 — marcar `sem_score` na linha e no contribuinte; somar no total do ciclo | `SegmentacaoScore.server.js:110, 121-143` | ✅ PASS | Marca, mas não desmarca; ver BUG-002 |
| RN-NOVO-F3-002 passo 3 — ignorar o score; «valor, atraso, tributo e exclusões continuam» | `SegmentacaoScore.server.js:43-45, 65-79` | ⚠️ PARCIAL | Tributo sim; exclusão de contumaz não; soma débitos de qualquer status. Ver BUG-001 e CONF-002 |
| Escala do score 0 a 100 (RF-MOD-F3-001 cenário 2, RF-MOD-F3-002) | `SegmentacaoScore.server.js:17-18, 28-34` | ✅ PASS | Score 150 conta como sem score (teste `:204-207`) |
| TASK-MOD-F2-005-01 — Script Include `RF-MOD-F2-005_si_fallback_sem_score` no arquivo da task | `script-includes/segmentacao-fallback-sem-score.now.ts:6-14` | ✅ PASS | |
| TASK-MOD-F2-005-02 — Business Rule `RF-MOD-F2-005_br_marcar_sem_score` em `business-rules/segmentacao.now.ts` | `business-rules/segmentacao.now.ts:7-18` | ✅ PASS | Mais uma regra (`RF-MOD-F2-005_br_propagar_sem_score`, `:20-31`) |
| Cenário AS-TASK-MOD-F2-005-02-01 «Restringir a publicação ao coordenador» (admin do app não vê «Publicar versão», «Gerar prévia», «Publicar ciclo»; atendente não vê os 3 módulos) | `navigation/menu.now.ts`; `security/acl-base.now.ts:126-157` | ⚠️ PARCIAL | Cenário herdado de outra story. «Publicar versão» e «Publicar ciclo» já têm teste nas US-MOD-F2-002/F2-004; «Gerar prévia» não existe (STORY-MOD-F2-003 pendente); o menu do atendente continua mostrando os módulos (GAP-106). O teste desta US cobre outra coisa: atendente não grava a segmentação |
| Arquitetura: RN-NOVO-F3-002 em `QualificacaoCiclo.segmentar(ciclo)` (`architecture.mdc`) | `SegmentacaoScore.server.js` | ✅ PASS (com nota) | Ficou num Script Include próprio, como pede o `snArtifact` da task |
| Arquitetura: integração simulada lida por Script Include próprio (`ScoreUfmt`), com o interruptor de falha lido por ele | `SegmentacaoScore.server.js:81-84` | ❌ FAIL | Lê o score direto do contribuinte. Ver CONF-001 |
| Business Rule: condição no `filterCondition`, sem `current.update()`, `after` atualiza relacionados | `business-rules/segmentacao.now.ts:16, 28`; `SegmentacaoScore.server.js:108-113, 126, 141` | ✅ PASS | `setWorkflow(false)` só no teste, para montar a versão publicada |
| Script Include `package_private`, `clientCallable: false`, ES5, `type` = `name` | `segmentacao-fallback-sem-score.now.ts:8-12`; `SegmentacaoScore.server.js:10, 145` | ✅ PASS | |
| `GlideRecord` simples só em processamento do sistema (`security.mdc`) | `SegmentacaoScore.server.js:66, 81, 97, 102, 123, 129, 133` | ✅ PASS | Chamado só por Business Rule; nada volta para a tela |
| Contar com `GlideAggregate`; sem consulta dentro de laço (`architecture.mdc`) | `SegmentacaoScore.server.js:66-79, 133-138` | ⚠️ PARCIAL | Sem laço no delta, mas 4 a 9 consultas por linha gravada; ver PERF-001 |
| `$id` com o ID da spec; teste com `<STORY>_test_<n>`; nome do teste começa pelo RF | todos os `.now.ts` do delta | ✅ PASS | |
| Fio condutor: ATF de form ou isenção registrada (`deliver.md`, `test-strategy.mdc`) | `tests/US-MOD-F2-005.now.ts`; `outputs/spec/auditorias/_isencoes/` (não existe) | ❌ FAIL | Ver TEST-001 |
| Log sem dado pessoal | — | ✅ PASS | O delta não registra log (ver OBS-001) |

**CA da US cumpridos?** Sim. AC-RF-MOD-F2-005-01, -02 e -03 e os três AC-STORY-MOD-F2-005-RF-MOD-F2-005 equivalentes estão no código e em teste ATF verde no commit auditado. A «prévia do ciclo» dos cenários foi simulada no teste pela inclusão direta da linha, porque a ação «Gerar prévia» ainda não existe.
**Tecnologia fora da spec sem aprovação?** Não.

**[CONF-001] Score lido do campo do contribuinte, e não da última ingestão válida — MÉDIO**
`SegmentacaoScore.server.js:28-34, 81-84`. A RN-NOVO-F3-002 manda procurar o score «na última ingestão com status válido» e tratar como sem score o ausente, o inválido e o do modelo indisponível. A tabela simulada `x_2326104_cob_score_sim` já tem `status` (válido, inválido, sem score), `ingerido_em`, `versao_modelo` e `falhar`. O código ignora essa tabela e usa `contribuinte.score`, julgando válido qualquer número de 0 a 100. A arquitetura pede ainda um Script Include por integração (`ScoreUfmt`), para que trocar a simulação pela UFMT mude um ponto só.
**Consequência:** um score marcado «Inválido» na ingestão, ou com a simulação de falha ligada, continua decidindo a carteira se o campo do contribuinte estiver preenchido. E o score que decide passa a vir de um campo do contribuinte, fora do controle do SEC-020 (só o admin altera score na tabela simulada).
**Causa:** a STORY-MOD-F3-001 (ingestão) não foi entregue. **Fix:** quando a ingestão existir, ler o score por `ScoreUfmt` (última linha `valido` do contribuinte) dentro de `dadosDoContribuinte`, com teste para «Inválido» e para a falha simulada. **GAP proposto:** GAP-124.

**[CONF-002] Exclusão de contumaz ignorada na classificação — BAIXO**
`SegmentacaoScore.server.js:42-46`. A RN-NOVO-F3-002 diz que «exclusões continuam» e a RN-NOVO-F2-003 (passo 4) tira da carteira o contribuinte contumaz quando a versão marca «Excluir contumazes». O delta lê valor, atraso e tributo, mas não `excluir_contumaz`. O modelo de dados também não tem campo que identifique o contumaz. O delta passou a calcular sozinho a parte determinística que é da STORY-MOD-F2-003, e as duas implementações podem divergir. **Fix:** decidir na STORY-MOD-F2-003 se `SegmentacaoScore.classificar` passa a ser o único ponto da regra determinística; incluir a exclusão quando houver o dado. **GAP proposto:** GAP-126.

**[CONF-003] Massa demo com score fora da escala 0–100 — BAIXO**
`seed/contribuinte.now.ts:19, 41, 63` (ex.: `score: 24655.84`), `seed/score_sim.now.ts:12` (`score: 95199.58`), `seed/segmentacao.now.ts:15` (`score_usado: 42402.48`). Com a regra nova, todo contribuinte do seed conta como «sem score» numa linha nova; as telas TEL-010 e TEL-011 mostram números que a regra considera inválidos. O seed é gerado (`sn-seed`) e não é deste delta. **Fix:** faixa 0–100 para `score`, `score_usado` e `threshold_score` no gerador do seed. **GAP proposto:** GAP-133.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

Nenhum SEC novo. Dois pontos de contexto, ligados a achados já registrados:

- **Linha que chega com segmento preenchido não é classificada** (`business-rules/segmentacao.now.ts:16`). Quem grava direto na segmentação (hoje só o admin da plataforma, por script, importação ou Table API) escolhe «Qualificada» e um «Score usado» qualquer, sem passar pelo threshold. É o mesmo caminho de escrita direta do SEC-022 proposto na auditoria da US-MOD-F2-004. Somar ao GAP-117.
- **Origem do score** fora do controle SEC-020: ver CONF-001 (GAP-124).

Nenhum controle `SEC-NNN` do `tasks.json` está ligado a esta story.

## 6. Testes de mesa (vetores no delta)

Rastreei o fluxo como um usuário mal-intencionado, com as tabelas e papéis reais.

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|---|---|---|---|
| IDOR | Segmentação e ciclo sem dono; leitura por papel | N/A | `acl-base.now.ts:144-158` |
| Auth bypass — atendente cria ou altera linha da segmentação | `x_2326104_cob_segmentacao` | ✅ BLOQUEADO | Sem ACL de escrita para o papel; teste `:225-273` (`canCreate()` e `canWrite()` falsos com usuário atendente) |
| Elevação de privilégio — chamar a classificação pelo navegador | Script Include `SegmentacaoScore` | ✅ BLOQUEADO | `clientCallable: false`, `package_private` (`segmentacao-fallback-sem-score.now.ts:11-12`) |
| Burlar o threshold gravando a linha já classificada | Inclusão com `segmento` preenchido | ⚠️ BAIXO (só admin/script hoje) | `business-rules/segmentacao.now.ts:16`; somar ao GAP-117 |
| Burlar o threshold mudando o score | `contribuinte.score` | ⚠️ MÉDIO (dependência) | CONF-001 |
| Mass assignment — gravar `qtd_sem_score` à mão no ciclo em prévia | `x_2326104_cob_ciclo` | ✅ aceitável | O campo não está na lista protegida (`QualificacaoCiclo.server.js:93`), mas a próxima linha e a publicação recalculam (`SegmentacaoScore.server.js:139-142`; `QualificacaoCiclo.server.js:135`) |
| Injeção | Consultas por `addQuery` com sys_id e valor de choice; sem `addEncodedQuery` montado com texto | ✅ BLOQUEADO | `SegmentacaoScore.server.js:68, 71, 134-135` |
| Segredo exposto | — | ✅ BLOQUEADO | Varredura sem achado; sem URL, usuário ou credencial no delta |
| Dado pessoal em log ou mensagem | — | ✅ BLOQUEADO | O delta não loga nem mostra mensagem |
| Rate limiting | — | N/A | Sem rota nova |
| Race condition — duas linhas «Sem score» do mesmo ciclo gravadas ao mesmo tempo | `qtd_sem_score` | ✅ aceitável | Cada gravação reconta tudo (`:133-142`); a última conta certo. Sem lock, mas sem perda permanente |

## 7. Findings de Performance

**[PERF-001] Consultas por linha na classificação e na soma do «Sem score» — BAIXO**
Cada linha incluída faz até 4 leituras na regra `before insert` (`SegmentacaoScore.server.js:97-98, 103, 66-77, 81-82`: ciclo, versão, soma dos débitos, contribuinte). Cada linha «Sem score» faz mais até 5 na regra `after` (`:123-126, 129, 133-141`: contribuinte, gravação do contribuinte, ciclo, contagem do ciclo, gravação do ciclo). A contagem varre todas as linhas do ciclo a cada linha nova. Com 300 linhas por ciclo (limite do seed) são cerca de 2.700 operações numa prévia. Com carteira real, o custo cresce mais rápido que o número de linhas. A regra `after` também roda em **toda** alteração de linha já «Sem score» (sorteio, estágio do funil), sem olhar se `sem_score` mudou.
**Fix:** a ação «Gerar prévia» (STORY-MOD-F2-003) carrega versão e ciclo uma vez e conta o total no fim; a regra `after` ganha `current.sem_score.changes()` na condição. **GAP proposto:** GAP-131.

## 8. Findings de Bugs Técnicos

**[BUG-001] Débito pago, parcelado ou cancelado entra no valor e no atraso — MÉDIO** (JavaScript de servidor)
`SegmentacaoScore.server.js:66-79`. A soma do valor e o maior atraso usam todos os débitos do contribuinte no tributo. A tabela `x_2326104_cob_debito` tem `status` (aberto, parcelado, regularizado, cancelado), e a RN-NOVO-F2-003 (passos 2 e 3) fala em «débito em aberto». O valor somado ainda vai para `valor_em_aberto` da linha (`:112`).
**Cenário:** contribuinte fictício com R$ 600.000,00 de ICMS Normal já regularizado e R$ 10.000,00 em aberto, 100 dias. Hoje fica «Qualificada» com «Valor em aberto = 610.000»; o esperado é «Massificada» com 10.000.
**Fix:** `agg.addQuery('status', 'aberto')` em `dadosDoContribuinte`, com teste do cenário acima. **GAP proposto:** GAP-125.

**[BUG-002] «Sem score» do contribuinte e total do ciclo só sobem — BAIXO**
`SegmentacaoScore.server.js:121-143`; `business-rules/segmentacao.now.ts:28`. O contribuinte marcado «Sem score» nunca é desmarcado, mesmo quando ganha score válido num ciclo seguinte; o dossiê (RF-MOD-F5-002, ligado à RN-NOVO-F3-002) vai mostrar a marca antiga. O total do ciclo também não desce quando uma linha passa de «Sem score» para com score ou é excluída: a regra só roda com `sem_score = true` e não roda em exclusão.
**Fix:** marcar o contribuinte com o resultado da linha (true ou false); regra `after` que rode quando `sem_score` mudar e em `delete`. **GAP proposto:** GAP-128.

**[BUG-003] Threshold vazio vale 0 — BAIXO**
`SegmentacaoScore.server.js:55`. Com «Usar score» marcado e o threshold em branco, `parseFloat('') || 0` dá 0 e qualquer score válido qualifica. A versão do critério pode ser publicada assim (o servidor não exige o threshold quando o score é usado), e o RF-MOD-F3-002 pede threshold de 0 a 100.
**Fix:** exigir threshold de 0 a 100 na publicação da versão quando `usar_score` estiver marcado (Data Policy ou na regra de publicação da US-MOD-F2-002), ou tratar threshold vazio como «não usa score» com motivo explícito. **GAP proposto:** GAP-129.

**[BUG-004] A publicação do ciclo pode regravar o próprio ciclo por dentro — BAIXO**
`SegmentacaoScore.server.js:129-142` chamado durante `QualificacaoCiclo.server.js:122-127`. A publicação roda numa regra `before update` do ciclo. Ela grava as linhas sorteadas; para cada linha sorteada que esteja «Sem score», a regra nova lê o ciclo do banco (ainda em «prévia», porque a publicação não terminou), reconta e, se o total no banco estiver diferente, faz `ciclo.update()` no mesmo registro que está sendo publicado. O total só diverge em ciclo com linhas gravadas antes desta US, gravadas com `setWorkflow(false)` ou desmarcadas (BUG-002), mas aí o ciclo é gravado duas vezes na mesma transação e as regras do ciclo rodam de novo. O valor final fica certo, porque a publicação recalcula `qtd_sem_score` (`QualificacaoCiclo.server.js:135`).
**Fix:** com a condição `current.sem_score.changes()` (PERF-001), o sorteio deixa de disparar a regra; ou a regra ignora a gravação quando o segmento passa a «controle». **GAP proposto:** GAP-130.

## 9. Testes

**Recibo ATF:** `outputs/spec/auditorias/atf/US-MOD-F2-005.json` — status `success`, commit `74aecbca6fa6bbe9b802f6f20d616a69154a970e`, 2026-11-24T20:05Z, 4 de 4 testes verdes, `runner: false` (nenhum teste de form). Install `ok` do mesmo commit no `outputs/spec/sync-log.md` (linha de 2026-11-24 17:04, «1056 registros»). Recibo e linha do sync-log ainda não commitados. Print `outputs/spec/screens/deliver/US-MOD-F2-005-TEL-010.png` existe.

**CA viraram teste?** AC-01 sim (`:81-86`); AC-02 sim (`:87-91`); AC-03 sim (`:149-173`). **TDD RED/GREEN presente?** Há caso positivo e negativo por regra (threshold: J × K; fallback: E × contribuinte abaixo do valor, score 150, critério sem «usar score»), mas nenhuma saída RED guardada (mesma situação do GAP-116). **Cobertura do delta:** boa no caminho feliz e nos lados da regra; faltam bordas e os caminhos dos BUG-001 a BUG-004.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|---|---|---|---|
| `t_f2005_score` (`:8-96`) | Sim — J 72 qualifica com score usado 72 | Sim — K 41 vai para a massificada | Bom; insere como coordenador criado pelo ATF |
| `t_f2005_fallback` (`:98-178`) | Sim — E sem score qualifica, marca linha, contribuinte e ciclo | — | Bom; cobre os 4 passos da RN-NOVO-F3-002 com o score ausente |
| `t_f2005_fallback_neg` (`:180-223`) | — | Sim — sem score abaixo do valor; score 150; critério sem «usar score» | Bom; chama `classificar` direto, sem gravar |
| `t_f2005_autorizacao` (`:225-273`) | — | Sim — atendente não cria nem altera linha | Bom; não é o cenário AS-TASK-MOD-F2-005-02-01 (ver seção 4) |

**[TEST-001] Story de fio condutor sem teste de form e sem isenção — MÉDIO**
`tests/US-MOD-F2-005.now.ts` só tem passos de servidor; `outputs/spec/auditorias/_isencoes/` não existe. O `deliver.md` e o `test-strategy.mdc` pedem, no fio condutor, ATF de form ou a isenção `US-MOD-F2-005-atf-form.md`. As telas da story (TEL-008 e TEL-010) mostram «Usar score», «Threshold», «Score usado» e «Sem score». **Fix:** teste de form que abra a linha «Sem score» na TEL-010 como coordenador e confira os campos, ou registrar a isenção com motivo. **GAP proposto:** GAP-127.

**[TEST-002] Bordas sem teste — BAIXO**
Não há teste para: score igual ao threshold (60 = 60 deve qualificar, pela regra «maior ou igual»); threshold vazio (BUG-003); débito não aberto (BUG-001); linha alterada ou excluída e contribuinte que recupera o score (BUG-002); publicação de ciclo com linhas «Sem score» (BUG-004). **Fix:** um caso por borda, no mesmo arquivo. **GAP proposto:** GAP-134 (a falta de RED guardado soma ao GAP-116).

**Suíte de regressão:** o recibo `outputs/spec/auditorias/atf/cob-regressao.json` continua no commit `1c417e7` com `failure`. Os 4 testes novos entraram na suíte, mas não há execução da suíte inteira no commit auditado. Somar ao GAP-122.

**Validação por task (G3):** `TASK-MOD-F2-005-01.validacao.json` e `TASK-MOD-F2-005-02.validacao.json` existem — veredito APROVADO, rodada 1, **modo `sem-agentes`**, build e ATF verdes, sem bloqueantes. A story é de fio condutor, que pede G3 com validadores de LLM. Somar ao GAP-107. As duas tasks seguem `PENDING` no `tasks.json`.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---|---|---|---|
| Classificar a linha da segmentação | Não | `sys_audit` (tabela com `audit: true`) e o campo «Motivo» da linha | OBS-001 |
| Linha sem versão do critério (classificação não acontece) | Não | — | OBS-001 |
| Marcar contribuinte «Sem score» e recontar o ciclo | Não | `qtd_sem_score` no ciclo | — |

**[OBS-001] Classificação que não acontece fica sem aviso — BAIXO.** Quando a linha não tem versão e o ciclo também não (`SegmentacaoScore.server.js:95-105`), `aplicar` devolve `false` e a linha é gravada sem segmento, sem log e sem mensagem. Essa linha não entra em nenhum total do ciclo. **Fix:** `gs.warn` com o ID da spec e os sys_id da linha e do ciclo (sem nome nem documento do contribuinte), ou recusar a inclusão. **GAP proposto:** GAP-132.

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---|---|---|
| Publicação do ciclo (US-MOD-F2-004) | Sim, sem efeito no resultado: em caso raro o ciclo é gravado duas vezes durante a publicação | BUG-004 |
| `br_segmento_controle_imutavel` | Não. A regra nova de classificação é só `insert`; a antiga é só `update` | `business-rules/segmentacao.now.ts:13`; `grupo-controle.now.ts:49` |
| Campos de sistema do ciclo em prévia | Não. `qtd_sem_score` fica fora da lista protegida, então a gravação do total não é recusada | `QualificacaoCiclo.server.js:93`; teste `:172` verde |
| Seed | Não nas linhas existentes: as 50 linhas do seed já têm `segmento`, então a classificação não roda nelas. A faixa do score no seed não combina com a regra | CONF-003; install `ok` com 1056 registros, mesma contagem do install anterior |
| Suíte `cob-regressao` e testes das US-MOD-F2-002/F2-004 | Sem evidência: a suíte não rodou no commit auditado | GAP-122 |
| Futura «Gerar prévia» (STORY-MOD-F2-003) | Contrato implícito: a prévia precisa incluir a linha sem segmento para a regra classificar | `business-rules/segmentacao.now.ts:16`; CONF-002 |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

Os três critérios de aceite estão no código e em teste ATF verde no commit `74aecbc`, com install registrado do mesmo commit. Não há achado de segurança CRÍTICO ou ALTO nem bug ALTO. Ficam achados MÉDIO e BAIXO: o score vem do campo do contribuinte e não da ingestão válida (CONF-001, depende da STORY-MOD-F3-001), débito não aberto entra na conta (BUG-001) e falta teste de form ou isenção (TEST-001).

| Condição de bloqueio | Status |
|---|---|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há CRÍTICO/ALTO) |

## 13. Pontos a revisar / próximos passos

Os GAP-124 a GAP-134 são **propostos** para `outputs/spec/gaps-document.md` (o maior existente é o GAP-123). Por instrução desta execução, nenhuma task, issue ou GAP foi criado, nenhum código foi alterado, nada foi commitado e o marcador `outputs/spec/em-andamento.md` **não** foi apagado. O fechamento da US (apagar o marcador e commitar a remoção, junto com o recibo ATF, os arquivos de validação e a linha do `sync-log.md`) fica com quem conduz a entrega.

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|---|---|---|---|
| 1 | CONF-001 (MÉDIO) — score do campo do contribuinte, não da ingestão válida | `SegmentacaoScore.server.js:28-34, 81-84` | Ler a última linha `valido` de `score_sim` por `ScoreUfmt`; testar «Inválido» e falha simulada | `gaps-document.md` (GAP-124), com a STORY-MOD-F3-001 |
| 2 | BUG-001 (MÉDIO) — débito não aberto no valor e no atraso | `SegmentacaoScore.server.js:66-79, 112` | Filtrar `status = aberto`; teste do contribuinte com débito regularizado | `gaps-document.md` (GAP-125) |
| 3 | TEST-001 (MÉDIO) — sem ATF de form nem isenção no fio condutor | `tests/US-MOD-F2-005.now.ts` | Teste de form na TEL-010 ou isenção `US-MOD-F2-005-atf-form.md` | `gaps-document.md` (GAP-127) |
| 4 | Suíte `cob-regressao` sem recibo no commit | `outputs/spec/auditorias/atf/cob-regressao.json` | Rodar a suíte em `74aecbc` (ou no commit seguinte) e guardar recibo verde | `gaps-document.md` (somar ao GAP-122) |
| 5 | G3 sem validadores de LLM no fio condutor | `TASK-MOD-F2-005-01.validacao.json`, `TASK-MOD-F2-005-02.validacao.json` | Rodar o G3 com validadores ou registrar isenção de G3 da story | `gaps-document.md` (somar ao GAP-107) |
| 6 | Cenário AS-TASK-MOD-F2-005-02-01 — menu do atendente | `navigation/menu.now.ts`; `security/acl-base.now.ts:126-157` | Mesmo ajuste do GAP-106 | `gaps-document.md` (somar ao GAP-106) |
| 7 | Linha incluída já classificada escapa do threshold | `business-rules/segmentacao.now.ts:16` | Mesmo fix de escrita direta do SEC-022 | `gaps-document.md` (somar ao GAP-117) |
| 8 | CONF-002 (BAIXO) — exclusão de contumaz ignorada | `SegmentacaoScore.server.js:42-46` | Regra determinística num ponto só, com a exclusão, na STORY-MOD-F2-003 | `gaps-document.md` (GAP-126) |
| 9 | BUG-002 (BAIXO) — «Sem score» só sobe | `SegmentacaoScore.server.js:121-143`; `business-rules/segmentacao.now.ts:28` | Marcar true/false; rodar quando `sem_score` mudar e na exclusão | `gaps-document.md` (GAP-128) |
| 10 | BUG-003 (BAIXO) — threshold vazio vale 0 | `SegmentacaoScore.server.js:55` | Exigir threshold 0–100 com «Usar score» | `gaps-document.md` (GAP-129) |
| 11 | BUG-004 (BAIXO) — ciclo regravado durante a publicação | `SegmentacaoScore.server.js:129-142`; `QualificacaoCiclo.server.js:122-127` | `current.sem_score.changes()` na regra `after` | `gaps-document.md` (GAP-130) |
| 12 | PERF-001 (BAIXO) — consultas por linha | `SegmentacaoScore.server.js:66-84, 97-103, 123-141` | Carregar versão e ciclo uma vez na prévia; total no fim; condição `changes()` | `gaps-document.md` (GAP-131) |
| 13 | OBS-001 (BAIXO) — linha sem versão fica sem segmento e sem aviso | `SegmentacaoScore.server.js:95-105` | `gs.warn` com sys_id ou recusar a inclusão | `gaps-document.md` (GAP-132) |
| 14 | CONF-003 (BAIXO) — seed com score fora de 0–100 | `seed/contribuinte.now.ts:19`; `seed/score_sim.now.ts:12`; `seed/segmentacao.now.ts:15` | Faixa 0–100 no gerador do seed | `gaps-document.md` (GAP-133) |
| 15 | TEST-002 (BAIXO) — bordas sem teste | `tests/US-MOD-F2-005.now.ts` | Score = threshold, threshold vazio, débito não aberto, alteração/exclusão, publicação | `gaps-document.md` (GAP-134; RED guardado soma ao GAP-116) |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@74aecbc
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
