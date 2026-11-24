# Auditoria de Entrega — [US-MOD-F2-002] Versionamento imutável do critério

- **User Story:** US-MOD-F2-002 — Versionamento imutável do critério (nó `STORY-MOD-F2-002` no `outputs/spec/tasks.json`, label `fio-condutor`)
- **Features/IDs cobertos:** RF-MOD-F2-002 e RF-MOD-F2-001 (requisitos funcionais) · RN-NOVO-F2-001, RN-NOVO-F2-002, RN-NOVO-F2-006 (regras de negócio) · 9 critérios de aceite do nó · tasks TASK-MOD-F2-002-01, -02, -03 e o controle de segurança SEC-009 · telas TEL-007 e TEL-008
- **Branch/commit auditado:** `feat/v0` @ `90818c8` (delta desde `3dee33d`, o commit que abriu a US)
- **Data:** 2026-11-24
- **Auditor:** skill `auditoria-de-us` (auditoria do zero no HEAD atual; substitui o relatório anterior, feito no commit `88b697c`)

---

## 1. Inventário do delta

O que a US mudou no app, lido em `git diff 3dee33d..HEAD -- app/`. Mudanças em `.claude/` (ferramentas do kit) ficaram de fora, como pedido.

**Arquivos/módulos tocados pela US:**

| Arquivo | Papel |
|---------|-------|
| `app/src/server/qualificacao/CriterioVersao.server.js` | Script Include (classe de servidor reutilizável) com as regras da versão: publicar, criar a versão seguinte, recusar alteração de versão publicada e de ciclo publicado, conferir gravação |
| `app/src/fluent/script-includes/criterio-versao.now.ts` | registra o Script Include `CriterioVersao` (`package_private`, não chamável pelo navegador) |
| `app/src/fluent/business-rules/criterio.now.ts` | 4 Business Rules (regras que rodam no servidor ao gravar) na tabela do critério: bloquear edição e exclusão de versão publicada, conferir gravação, substituir a versão anterior ao publicar |
| `app/src/fluent/business-rules/ciclo.now.ts` | Business Rule que impede ciclo publicado de trocar o critério aplicado e os totais |
| `app/src/server/qualificacao/bloquearVersaoPublicada.server.js`, `bloquearExclusaoPublicada.server.js`, `conferirGravacaoCriterio.server.js`, `substituirVersaoAnterior.server.js`, `cicloPublicadoImutavel.server.js` | scripts curtos das Business Rules; todos chamam o `CriterioVersao` |
| `app/src/fluent/security/criterio.now.ts` | 4 ACL (regras de acesso da plataforma): gravar só em rascunho (tabela e campos), criar para coordenador e admin do app, excluir só admin do app e só rascunho |
| `app/src/fluent/ui-actions/criterio.now.ts` | botões «Publicar versão» e «Criar nova versão» do form TEL-008, só para o coordenador |
| `app/src/fluent/ui-policies/criterio.now.ts` | UI Policy (regra de tela) que deixa «Threshold do score» somente leitura quando «Usar score de liquidez» está desmarcado |
| `app/src/fluent/tests/US-MOD-F2-002.now.ts` | 13 testes ATF (Automated Test Framework, o framework de teste da plataforma): 9 de servidor e 4 de form |
| `app/src/fluent/tests/suite.now.ts` | suíte `cob-regressao`, que roda a cada `npm run reinstall` |
| `app/src/fluent/generated/keys.ts` | chaves geradas pelo build; não editado à mão |
| `app/spec_story.md` | memória de implementação da story |

**Endpoints alterados/criados:** nenhuma rota REST nova. As entradas novas são as duas UI Actions do form TEL-008 (`x_cob_publicar_versao`, `x_cob_criar_nova_versao`). A tabela `x_2326104_cob_criterio` já tinha acesso pela Table API (`allowWebServiceAccess: true`, do scaffold), e as regras novas valem para esse caminho também.

**Entidades/modelos tocados:** `x_2326104_cob_criterio` (critério de qualificação, uma linha por versão) e `x_2326104_cob_ciclo` (ciclo de qualificação, só a regra de imutabilidade depois de publicado). Nenhuma coluna nova; nenhuma tabela nova.

**Stack envolvido no delta:** ServiceNow, app escopado `x_2326104_cob`, metadados em Fluent (`@servicenow/sdk` 4.14.3), JavaScript de servidor ES5 (`Class.create`, `GlideRecord`, `GlideRecordSecure`, `GlideAggregate`), ATF com Jasmine 3.1 e Client Test Runner.

**Varredura automática do delta** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 3dee33d --repo app`): 16 arquivos lidos, 0 achados (sem segredo, sem dado pessoal em log, sem injeção montada em texto, sem erro engolido, sem consulta dentro de laço detectada). Semgrep e gitleaks não estão instalados.

**Evidências de execução conferidas:**
- Install `ok` (1056 registros) no commit `0fbe508`, o último que tocou `app/src/fluent` (`outputs/spec/sync-log.md`, linha 31).
- Recibo ATF `outputs/spec/auditorias/atf/US-MOD-F2-002.json`: `status: success`, 13 de 13 testes verdes, commit `f80af6b`. Entre `0fbe508` e o HEAD nada mudou em `app/src/fluent`; o recibo vale para o código auditado.
- Validação por task (`outputs/spec/auditorias/{TASK-MOD-F2-002-01,02,03,SEC-009}.validacao.json`): veredito APROVADO nas 4, com build e ATF rodados, em modo `sem-agentes` (ver CONF-005).
- As 4 tasks estão `DONE` no `tasks.json`.

## 2. Mapa de regressão leve

Pontos fora do delta que ele encosta e que podem quebrar:

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| Seed do critério e do ciclo (`app/src/fluent/seed/criterio.now.ts`, `ciclo.now.ts`) | as Business Rules novas recusam critério que nasce «Publicada» e ciclo publicado alterado; o seed tem versões publicadas | médio |
| Tabela do ciclo e as stories futuras de prévia e publicação do ciclo (RF-MOD-F2-003/004) | a regra nova do ciclo congela critério, semente e totais depois de publicado | médio |
| ACL de leitura e menu do scaffold (`security/acl-base.now.ts:110-124`, `navigation/menu.now.ts:51-53`) | a ACL nova de gravar convive com as de leitura geradas; o cenário de autorização da task pede que o atendente não veja o módulo | médio |
| Form TEL-008 (`ui/TEL-008.now.ts:12-13`) | mostra `codigo`, `versao`, `estado`, `versao_anterior`, `publicada_em`, `publicada_por`; a ACL de campo nova decide o que fica editável | médio |
| Suíte `cob-regressao` no `npm run reinstall` | a suíte nasceu nesta US e passa a rodar em todo install | baixo |
| STORY-MOD-F2-001 (Parametrização de critérios) | três critérios de aceite do RF-MOD-F2-001 foram entregues neste nó; a STORY-MOD-F2-001 continua aberta | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (spec, tech-rules, critérios de aceite, regras de negócio, cenários das tasks), segurança (ACL, Business Rule, UI Action chamada por URL, Table API, importação), teste de mesa, performance, bugs técnicos, testes, observabilidade e regressão leve.

**Vetores de segurança aplicáveis:** IDOR, contorno de autenticação, escalada de privilégio, mass assignment (gravar campo que o papel não deveria), injeção, exposição de segredo, condição de corrida, e os específicos da plataforma: chamada de UI Action por URL, Table API e importação.

**Não auditado (e por quê):**
- Rate limiting: N/A. A US não cria login, reset de senha nem rota pública; tudo passa pela sessão da Core UI.
- Prompt injection e SSRF (servidor buscando URL informada pelo usuário): N/A. Não há LLM nem URL de entrada no delta.
- Execução na instância: a auditoria não rodou ATF nem script na instância; usou o recibo e leu o código.
- Configuração do scaffold fora do delta (por exemplo, `allowWebServiceAccess: true` em `tables/criterio.now.ts`): fora do escopo desta US; citada só onde muda o efeito de um achado.

## 4. Conformidade

Verificado contra `outputs/spec/tech-rules/*.mdc`, `.claude/rules/harness/{deliver,security,servicenow-ui}.md`, `outputs/spec/plano-de-seguranca.md` (SEC-009), `outputs/spec/business-rules.md` e o nó `STORY-MOD-F2-002`.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| AC-RF-MOD-F2-002-01 e AC-STORY-…-RF-MOD-F2-002-01: publicar deixa a versão «Publicada» com data e autor, e os campos somente leitura | `CriterioVersao.server.js:97-105, 128-145`; `security/criterio.now.ts:8-27` | ✅ PASS | data e autor gravados pela Business Rule de gravação; somente leitura vem da ACL (testado no servidor com `canWrite()` falso) |
| AC-RF-MOD-F2-002-02 e AC-STORY-…-RF-MOD-F2-002-02: criar nova versão gera a seguinte em «Rascunho», ligada à anterior, e a anterior mantém R$ 500.000,00 | `CriterioVersao.server.js:176-199` | ✅ PASS | teste usa versões 2→3; mesma regra |
| AC-RF-MOD-F2-002-03 e AC-STORY-…-RF-MOD-F2-002-03: qualquer usuário, inclusive o administrador, é recusado com «Versão publicada não pode ser alterada. Crie uma nova versão.» | `CriterioVersao.server.js:13, 47-60`; `bloquearVersaoPublicada.server.js:3-9` | ✅ PASS | texto idêntico ao do critério de aceite |
| AC-STORY-…-RF-MOD-F2-001-01: criar «ICMS alto valor» com ICMS Normal, R$ 500.000,00 e 90 dias deixa a versão 1 em «Rascunho» | `conferirGravacaoCriterio.server.js:4-11`; `CriterioVersao.server.js:94-96` | ✅ PASS | versão 1 e rascunho preenchidos no servidor; no form o «Estado» é obrigatório e começa vazio (CONF-006) |
| AC-STORY-…-RF-MOD-F2-001-02: sem «Usar score de liquidez», «Threshold do score» desabilitado | `ui-policies/criterio.now.ts:7-17` | ✅ PASS | teste de form verde |
| AC-STORY-…-RF-MOD-F2-001-03: salvar sem nome é recusado com «Nome é obrigatório» | `CriterioVersao.server.js:22, 91-93` | ⚠️ PARCIAL | recusa em todo caminho; o texto literal aparece por script, API e importação; no form a plataforma barra antes, com a mensagem própria de campo obrigatório (CONF-001) |
| RN-NOVO-F2-001: versão publicada imutável, inclusive para o admin do app | `criterio.now.ts:7-31`; `CriterioVersao.server.js:47-60` | ✅ PASS | edição e exclusão recusadas para todo papel; ver SEC-021 para os campos de controle do rascunho |
| RN-NOVO-F2-002: ciclo publicado guarda a versão aplicada | `ciclo.now.ts:6-17`; `CriterioVersao.server.js:66-80` | ✅ PASS | troca de critério, totais e volta para «Prévia» recusadas; inclusão direta como publicado fica para a story do ciclo (CONF-004) |
| RN-NOVO-F2-006: grupo de controle de 10% gravado na versão | `CriterioVersao.server.js:27-30, 185-189` | ✅ PASS | `pct_grupo_controle` protegido e copiado na nova versão |
| SEC-009 (ALTO): Business Rule `before update` em «publicada» e «substituída» | `criterio.now.ts:7-18` | ✅ PASS | |
| SEC-009: ACL de write e delete negada nesses estados | `security/criterio.now.ts:8-46`; `criterio.now.ts:20-31` | ✅ PASS | delete também recusado por Business Rule |
| SEC-009: ciclo publicado não troca critério nem totais | `ciclo.now.ts:6-17` | ✅ PASS | |
| SEC-009: `codigo` + `versao` únicos | `CriterioVersao.server.js:107-118` | ⚠️ PARCIAL | por consulta, sem índice único no banco (BUG-002, PERF-001) |
| SEC-009: nova versão exige `motivo_alteracao` | `CriterioVersao.server.js:101-103, 135-137` | ⚠️ PARCIAL | exigido na publicação quando há versão anterior; o próprio campo «Versão anterior» é editável no rascunho (SEC-021) |
| SEC-009: Data Policy para o mesmo bloqueio em importação | — | ⚠️ PARCIAL | não criada; a decisão registrada em `app/spec_story.md` é que a Business Rule cobre importação e API (CONF-003) |
| SEC-009: teste ATF negativo com admin | `tests/US-MOD-F2-002.now.ts:105-162` | ✅ PASS | usuário criado só com `x_2326104_cob.admin` |
| AS-TASK-MOD-F2-002-02-01 (cenário de autorização da task): admin do app não vê «Publicar versão»; os módulos não aparecem no menu do atendente | `ui-actions/criterio.now.ts:13`; `navigation/menu.now.ts:53`; `security/acl-base.now.ts:110-124` | ⚠️ PARCIAL | primeira parte entregue e testada; o atendente ainda vê «Critério de qualificação» no menu e lê os critérios (CONF-002) |
| architecture.mdc: regra no servidor, UI Policy só para tela | delta inteiro | ✅ PASS | proteção em ACL e Business Rule; UI Policy só no threshold |
| architecture.mdc: nunca `current.update()` em Business Rule | `substituirVersaoAnterior.server.js` | ✅ PASS | a regra `after` atualiza outros registros, não o atual |
| conventions.mdc: `$id` com o ID da spec, nomes em português, log com `gs.*` | delta inteiro | ✅ PASS | |
| security.mdc: consulta feita em nome do usuário usa `GlideRecordSecure` ou `canCreate/canWrite` | `CriterioVersao.server.js:128-145, 176-199` | ⚠️ PARCIAL | caminho do botão usa `GlideRecord` com conferência de papel, sem `canCreate/canWrite` (CONF-007) |
| servicenow-ui.md: UI Action de mudança de estado com `roles` e `condition`, `setRedirectURL`, papel reconferido no servidor | `ui-actions/criterio.now.ts:13-14, 35-36`; `CriterioVersao.server.js:129-131, 177-179` | ✅ PASS | |
| deliver.md: fio condutor com G3 (validação por task) com validadores de LLM | `outputs/spec/auditorias/*.validacao.json` | ⚠️ PARCIAL | G3 rodou em modo `sem-agentes` (0 chamadas), sem isenção de G3 registrada (CONF-005) |
| deliver.md: install `ok` no commit de `app/src/fluent` e recibo ATF verde | `sync-log.md` linha 31; recibo ATF | ✅ PASS | |
| test-strategy.mdc: positivo e negativo por regra, ACL testada sem admin da plataforma | `tests/US-MOD-F2-002.now.ts` | ✅ PASS | evidência de RED ausente no histórico (TEST-001) |

**CA da US cumpridos?** Sim, os 9: AC-RF-MOD-F2-002-01, -02, -03; AC-STORY-MOD-F2-002-RF-MOD-F2-002-01, -02, -03; AC-STORY-MOD-F2-002-RF-MOD-F2-001-01, -02 cumpridos. AC-STORY-MOD-F2-002-RF-MOD-F2-001-03 cumprido na recusa (nada é gravado sem nome, por nenhum caminho) e no texto literal pelo servidor; no form o texto é o da plataforma para campo obrigatório. A auditoria classifica como não bloqueante porque o resultado pedido (recusar e apontar o nome como obrigatório) acontece em todos os caminhos (CONF-001).

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum aberto. O controle planejado SEC-009 (ALTO) está implementado e provado por teste: versão publicada ou substituída não muda nem é excluída por nenhum papel, inclusive o admin do app e script sem ACL; o ciclo publicado mantém critério e totais; publicar trocando o «Estado» à mão segue as mesmas regras do botão. As partes do SEC-009 feitas de outro jeito estão nos achados MÉDIO e BAIXO.

### 5.2 MÉDIOS/BAIXOS

> **[SEC-021] Campos de controle da versão editáveis no rascunho — MÉDIO** (ID proposto) · CVSS 4.3 (AV:N/AC:L/PR:L/UI:N/S:U/C:N/I:L/A:N) · OWASP A01 (controle de acesso), A04 (design inseguro) · CWE-915 (atribuição de campo não controlada) · STRIDE T (adulteração), R (repúdio) · ASVS 5.0 V8, V2
> Arquivo: `app/src/fluent/security/criterio.now.ts:18-27`; `app/src/server/qualificacao/CriterioVersao.server.js:47-51, 97-103` · Contexto: form TEL-008 e Table API de `x_2326104_cob_criterio`
> **Problema:** enquanto a versão está em rascunho, a ACL de campo `*` libera para coordenador e admin do app todos os campos, inclusive os que o fluxo de versão deveria controlar: `versao`, `versao_anterior`, `estado`, `publicada_em` e `publicada_por`. O servidor só confere a passagem de «Rascunho» para «Publicada». Duas situações passam: (a) quem edita apaga «Versão anterior» da versão 2 e o coordenador publica sem motivo, porque o motivo só é exigido quando existe versão anterior; (b) quem edita troca o «Estado» de «Rascunho» para «Substituída», e nenhuma regra recusa, porque a regra de bloqueio só roda quando o estado anterior já é publicada ou substituída.
> **Risco:** a trilha de versões perde o elo com a versão anterior e o motivo da mudança, o que o SEC-009 pede ("nova versão exige `motivo_alteracao`"). O admin do app, que não publica, consegue mudar número e elo do rascunho antes de o coordenador publicar. Uma versão em rascunho vira «Substituída» sem nunca ter sido publicada e fica travada para sempre.
> **Fix:** tirar a gravação por usuário de `versao`, `versao_anterior`, `estado`, `publicada_em` e `publicada_por` (ACL de campo `write` própria para esses campos, sem role do app, ou somente leitura no dicionário pelo `data-model.json`); no servidor, recusar toda mudança de estado que não seja rascunho → publicada (pelo coordenador) ou publicada → substituída (feita pela regra de substituição); quando a versão tem o mesmo código de outra já existente, exigir `versao_anterior` e motivo na publicação.
> **TDD RED:** usuário só com `x_2326104_cob.coordenador` abre a versão 2 em rascunho com `GlideRecordSecure`, limpa `versao_anterior` e o motivo e publica; o teste espera recusa com «Informe o motivo da nova versão antes de publicar.» — hoje a publicação passa. Segundo caso: o admin do app grava `estado = substituida` no rascunho; o teste espera o estado «rascunho» — hoje fica «substituida».
> **TDD GREEN:** as duas gravações são recusadas e o rascunho continua como estava.
> **GAP recomendado:** GAP-103.

Não há outro achado de segurança. A exposição dos critérios ao atendente está em CONF-002, porque o dado do critério não é pessoal nem fiscal; é um ponto de conformidade com o cenário de autorização.

## 6. Testes de mesa (vetores no delta)

Rastreio feito como um atacante, com as rotas e tabelas reais da US.

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| IDOR (um usuário acessar registro de outro) | critério não tem dono; o acesso é por papel | N/A | `security/criterio.now.ts`; `acl-base.now.ts:110-124` |
| Contorno de autenticação: chamar «Publicar versão» ou «Criar nova versão» por URL sem o papel | UI Actions `x_cob_publicar_versao`, `x_cob_criar_nova_versao` | ✅ BLOQUEADO | papel reconferido no servidor em `CriterioVersao.server.js:129-131, 177-179` e na Business Rule de gravação `:97-100` |
| Escalada de privilégio: admin do app publica trocando o «Estado» no form ou pela Table API | `x_2326104_cob_criterio.estado` | ✅ BLOQUEADO | `CriterioVersao.server.js:97-100`; teste `US-MOD-F2-002_atf_publicacao_outro_caminho_negativo` |
| Escalada de privilégio: qualquer papel, inclusive admin do app, altera versão publicada | campos de parâmetro do critério | ✅ BLOQUEADO | ACL `security/criterio.now.ts:8-27` + Business Rule `criterio.now.ts:7-18`; teste `…versao_publicada_imutavel_negativo` |
| Exclusão de versão publicada | `delete` em `x_2326104_cob_criterio` | ✅ BLOQUEADO | ACL `security/criterio.now.ts:38-46` + Business Rule `criterio.now.ts:20-31` |
| Mass assignment: gravar campo de controle da versão no rascunho | `versao`, `versao_anterior`, `estado`, `publicada_em`, `publicada_por` | ❌ VULNERÁVEL (MÉDIO) | SEC-021 — `security/criterio.now.ts:18-27`; `CriterioVersao.server.js:47-51, 101` |
| Injeção | consultas do `CriterioVersao` | ✅ BLOQUEADO | só `addQuery` com parâmetro; nenhuma consulta montada em texto (`CriterioVersao.server.js:107-118, 153-159, 201-211`) |
| Exposição de segredo | delta inteiro | ✅ BLOQUEADO | varredura com 0 achados; nenhuma URL, usuário ou senha no código |
| Condição de corrida: dois coordenadores criam a versão seguinte ao mesmo tempo, ou duas gravações do mesmo código + versão | `_proximaVersao` e conferência de unicidade | ❌ VULNERÁVEL (BAIXO) | BUG-002 — `CriterioVersao.server.js:107-118, 201-211` |
| Table API (tabela com `allowWebServiceAccess: true`, do scaffold) | `/api/now/table/x_2326104_cob_criterio` | ✅ BLOQUEADO | as mesmas ACL e Business Rules valem para a API |
| Importação com transform map sem rodar Business Rules | importação na tabela do critério | N/A hoje | o app não tem transform map; a Data Policy pedida no SEC-009 cobriria esse caso (CONF-003) |
| Ciclo publicado trocando critério, totais ou voltando a «Prévia» | `x_2326104_cob_ciclo` | ✅ BLOQUEADO | `CriterioVersao.server.js:66-80`; teste `…ciclo_guarda_versao_negativo` |
| Rate limiting, prompt injection, SSRF | — | N/A | ver seção 3 |

## 7. Findings de Performance

**[PERF-001] Unicidade de código + versão conferida por consulta em toda gravação, sem índice — BAIXO**
- Arquivo: `app/src/server/qualificacao/CriterioVersao.server.js:107-118`; tabela `app/src/fluent/tables/criterio.now.ts:13-14`.
- Contexto: a Business Rule de gravação roda em toda inclusão e alteração do critério, inclusive quando código e versão não mudaram, e consulta a tabela por `codigo` + `versao`. Não há índice nessas colunas.
- Impacto: com poucas dezenas de versões o custo é desprezível; o volume do critério é baixo. Registra-se porque a mesma conferência sem índice também não impede duplicado em gravações simultâneas (BUG-002).
- Fix: índice único em `codigo` + `versao` pelo `data-model.json` + `sn-scaffold`; enquanto isso, só consultar quando `codigo` ou `versao` mudaram.

## 8. Findings de Bugs Técnicos

**[BUG-001] Publicar critério sem código pode marcar como «Substituída» versões de outros critérios — MÉDIO**
- Linguagem: JavaScript de servidor (Glide). Arquivo: `app/src/server/qualificacao/CriterioVersao.server.js:153-159` (substituição) e `:201-211` (número da versão seguinte).
- Cenário: `codigo` é opcional na tabela (`tables/criterio.now.ts:13`) e o critério de aceite de criação («ICMS alto valor» com tributo, valor e atraso) não pede código. O coordenador cria e publica dois critérios diferentes sem código. Na segunda publicação, `substituirAnteriores` consulta `codigo` = valor vazio. `_proximaVersao` faz a mesma coisa ao criar a versão seguinte de um critério sem código. A conferência de unicidade já trata o código vazio (`:109-111`); essas duas funções não.
- Consequência: conforme a plataforma trate o valor vazio na consulta, entram os outros critérios publicados sem código, ou todos os critérios publicados. Eles viram «Substituída» sem que ninguém tenha mexido neles. Como a versão substituída não muda mais e só a publicada gera nova versão, esses critérios ficam sem caminho de evolução pela tela. A versão nova de um critério sem código também recebe o número a partir de outros critérios.
- Fix: em `substituirAnteriores` e `_proximaVersao`, não consultar quando o código está vazio (substituir só pela cadeia de `versao_anterior`, ou tornar `codigo` obrigatório no `data-model.json` e preencher na criação). Teste ATF: dois critérios publicados sem código; publicar o segundo não muda o estado do primeiro.

**[BUG-002] Duas versões com o mesmo código e número em gravações simultâneas — BAIXO**
- Arquivo: `CriterioVersao.server.js:107-118, 201-211`.
- Cenário: dois coordenadores clicam «Criar nova versão» na mesma versão publicada ao mesmo tempo. Os dois calculam o mesmo número (`MAX + 1`) e as duas conferências de unicidade rodam antes de qualquer gravação terminar.
- Consequência: duas versões em rascunho com o mesmo código e número; a regra "código + versão únicos" do SEC-009 fica furada nesse caso.
- Fix: índice único no banco (o mesmo de PERF-001); tratar a recusa do banco com a mensagem de duplicado.

**[BUG-003] Falha ao criar nova versão sempre informada como "versão duplicada" — BAIXO**
- Arquivo: `CriterioVersao.server.js:193-196`.
- Cenário: qualquer recusa da inclusão (por exemplo, uma regra futura) devolve «Já existe esta versão para o código do critério.», e a Business Rule de gravação já mostrou a mensagem real; a tela recebe duas mensagens, uma delas errada.
- Fix: não acrescentar mensagem própria quando a inclusão falha (a Business Rule já informou) ou devolver uma mensagem neutra; registrar `gs.warn` com o sys_id de origem.

**[BUG-004] Comentário não grava em versão publicada — BAIXO**
- Arquivo: `app/src/fluent/security/criterio.now.ts:8-27`.
- Cenário: a ACL de gravar exige estado «rascunho» na tabela e em todos os campos, inclusive `comentarios` (campo de diário do form). A Business Rule deixa o comentário passar (não está em `CAMPOS_PROTEGIDOS`), mas a ACL barra antes.
- Consequência: o coordenador não registra observação na versão publicada; o histórico da TEL-008 fica restrito ao que foi escrito no rascunho. Nenhum critério de aceite pede isso; registra-se porque a regra de interface do harness prevê activity com comentário.
- Fix: ACL de campo `write` para `comentarios` sem a condição de estado, para coordenador e admin do app; a Business Rule continua protegendo os parâmetros.

## 9. Testes

**CA viraram teste?**

| Critério de aceite | Teste ATF | Situação |
|--------------------|-----------|----------|
| Publicar versão (data, autor, somente leitura) | `…publicar_versao_positivo` | coberto no servidor |
| Criar nova versão (rascunho, elo, valor da anterior mantido) | `…criar_nova_versao_positivo` | coberto |
| Alterar versão publicada é recusado, inclusive admin | `…versao_publicada_imutavel_negativo` | coberto |
| Criar «ICMS alto valor» deixa versão 1 em rascunho | `…codigo_versao_unico_negativo` (cria versão 1 em rascunho) | parcial: o teste informa versão e estado; o preenchimento automático não é conferido (TEST-001) |
| Threshold desabilitado sem score | `…ui_threshold_sem_score` | coberto no form |
| Salvar sem nome é recusado com «Nome é obrigatório» | `…nome_obrigatorio_negativo` | coberto no servidor; no form, não (CONF-001) |

**TDD RED/GREEN presente?** GREEN sim: 13 de 13 verdes no recibo. RED sem evidência: testes e código entraram nos mesmos commits (`1c417e7`, `cf737f4`), sem registro de execução falhando antes da regra. Os testes foram escritos de modo a falhar sem a regra (por exemplo, o atraso de 90 dias só se mantém por causa da Business Rule), mas isso é leitura, não execução (TEST-001).

**Cobertura do delta:** boa. Cada Business Rule tem caso positivo e negativo; as ACL são provadas com usuário criado com o papel do app, sem `enforceSecurity: false`; os botões são provados por papel e por estado no form. Faltam: código vazio (BUG-001), campos de controle no rascunho (SEC-021), comentário em versão publicada (BUG-004), cenário do menu do atendente (CONF-002).

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F2-002.now.ts` — 9 testes de servidor | sim (publicar, nova versão, ciclo aceita comentário) | sim (admin não publica, publicada imutável, rascunho não gera versão, sem motivo, duplicado, nasce publicada, ciclo, outro caminho, sem nome) | asserções sobre o banco relido, não só sobre o retorno da função |
| `tests/US-MOD-F2-002.now.ts` — 4 testes de form | sim (botões por estado, threshold liberado com score) | sim (admin sem botão, threshold travado sem score) | somente leitura por ACL provado no servidor, pela limitação do Client Test Runner registrada em `app/spec_story.md` |
| `tests/suite.now.ts` | — | — | os 13 testes estão na suíte `cob-regressao` |

**TEST-001 — BAIXO:** sem evidência de execução RED; preenchimento automático de «Rascunho» e versão 1 não conferido; mensagem «Nome é obrigatório» não conferida no form. Arquivo: `tests/US-MOD-F2-002.now.ts:397-440, 598-628`. Fix: acrescentar um teste que grava sem estado e sem versão e confere `rascunho` e `1`; guardar a saída RED da próxima regra nova antes do código.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Publicar versão (botão) | sim, `gs.info` e `gs.warn` com sys_id (`CriterioVersao.server.js:140, 143`) | histórico do registro (tabela auditada) | — |
| Criar nova versão | sim, `gs.info` com sys_id de origem e nova (`:197`) | histórico do registro | OBS-001 |
| Recusa de alteração, exclusão e gravação do critério | sim, `gs.warn` com sys_id e mensagem (`bloquearVersaoPublicada.server.js:6`, `bloquearExclusaoPublicada.server.js:3`, `conferirGravacaoCriterio.server.js:14`) | não | OBS-001 |
| Recusa de alteração do ciclo publicado | sim, `gs.warn` (`cicloPublicadoImutavel.server.js:5`) | não | OBS-001 |
| Substituição da versão anterior | só a falha (`:165`) | histórico do registro | — |

Nenhum log traz dado pessoal, CPF, CNPJ ou valor de contribuinte.

**[OBS-001] Recusa logada sem quem tentou e sem o ID do controle — BAIXO.** Arquivos acima. A task do SEC-009 pede `gs.warn` com "SEC-009, usuário, tabela, operação". Os logs trazem o RF e o sys_id, mas não o usuário nem a operação. Como a gravação recusada não entra no histórico do registro, a tentativa negada fica sem autor. Fix: incluir `gs.getUserID()` (o sys_id do usuário, não o nome), a tabela, a operação e `SEC-009` na mensagem.

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| Seed do critério e do ciclo | não | install `ok` com 1056 registros depois da US (`sync-log.md` linhas 30 e 31); a contagem bate com a de antes |
| Tabela do ciclo e stories futuras de prévia e publicação | não hoje; uma lacuna para a story do ciclo | a regra nova só roda em alteração; ciclo incluído já como «Publicado», ou publicado com critério em rascunho, não é recusado (CONF-004) |
| ACL de leitura e menu do scaffold | sim, divergência com o cenário da task | atendente tem ACL de leitura (`acl-base.now.ts:110-124`) e o módulo no menu (`menu.now.ts:53`); a matriz de acesso (`especificacao-funcional.md` §1.2) não dá critério ao atendente (CONF-002) |
| Form TEL-008 | sim, nos campos de controle e no comentário | SEC-021 e BUG-004 |
| Suíte `cob-regressao` | não | 13 testes, todos verdes no recibo |
| STORY-MOD-F2-001 | não | os 3 critérios de aceite do RF-MOD-F2-001 presentes neste nó foram entregues aqui; o `sync-log.md` (linha 32) registra a STORY-MOD-F2-001 e a STORY-SEC-TRANSVERSAL ainda abertas como dependências |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

A regra central da US funciona e está provada na instância: versão publicada não muda nem é excluída por ninguém, nova versão nasce em rascunho ligada à anterior, só o coordenador publica (por qualquer caminho, com data e autor), e o ciclo publicado mantém o critério aplicado. Os 9 critérios de aceite estão cumpridos e o controle SEC-009 está implementado com teste negativo pelo admin do app. Os achados restantes são MÉDIO e BAIXO e não bloqueiam.

**Achados por severidade**
- Bloqueantes: nenhum.
- MÉDIO: SEC-021, BUG-001, CONF-001, CONF-002, CONF-005.
- BAIXO: BUG-002, BUG-003, BUG-004, PERF-001, OBS-001, TEST-001, CONF-003, CONF-004, CONF-006, CONF-007.

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ (AC-STORY-MOD-F2-002-RF-MOD-F2-001-03 com a ressalva CONF-001) |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (nenhum SEC CRÍTICO/ALTO aberto; SEC-009 já está no backlog, `DONE`) |

## 13. Pontos a revisar / próximos passos

SEC-021 é **proposto** por esta auditoria (o maior SEC existente é o SEC-020). Os GAP-103 a GAP-116 são **propostos** para `outputs/spec/gaps-document.md` (o maior existente é o GAP-102). Por instrução desta execução, nenhuma task, issue ou GAP foi criado, nenhum arquivo além deste relatório foi alterado, e o marcador `outputs/spec/em-andamento.md` não foi apagado.

Achados de conformidade descritos só aqui:
- **CONF-001 (MÉDIO)** — no form TEL-008, salvar sem nome mostra a mensagem da plataforma para campo obrigatório, não «Nome é obrigatório», porque `nome` é obrigatório no dicionário (`tables/criterio.now.ts:12`) e o form barra antes do servidor. O texto do critério de aceite aparece por script, API e importação.
- **CONF-002 (MÉDIO)** — o cenário AS-TASK-MOD-F2-002-02-01 pede que o atendente não veja «Critério de qualificação» no menu; hoje ele vê e lê os critérios (`menu.now.ts:53`, `acl-base.now.ts:110-124`). Os dois arquivos são gerados pelo `sn-scaffold`; a mudança passa pelo `data-model.json` ou pela story de segurança transversal.
- **CONF-003 (BAIXO)** — a Data Policy pedida no SEC-009 para importação não foi criada; a Business Rule cobre importação que roda Business Rules, mas não transform map configurado para não rodá-las.
- **CONF-004 (BAIXO)** — ciclo incluído já como «Publicado», ou publicado com critério em rascunho, não é recusado; a regra do ciclo só olha alteração (`ciclo.now.ts:12, 15`). Cabe na story de publicação do ciclo (SEC-010).
- **CONF-005 (MÉDIO)** — `deliver.md` pede G3 com validadores de LLM no fio condutor; os 4 `*.validacao.json` registram `modo: sem-agentes` e 0 chamadas, e não há isenção em `outputs/spec/auditorias/_isencoes/`.
- **CONF-006 (BAIXO)** — rascunho e versão 1 são preenchidos por Business Rule (`conferirGravacaoCriterio.server.js:4-11`); `architecture.mdc` põe valor padrão no dicionário (degrau 1). No form, «Estado» é obrigatório e começa vazio, e o coordenador escolhe «Rascunho» à mão.
- **CONF-007 (BAIXO)** — `publicar` e `criarNovaVersao` gravam com `GlideRecord` no caminho do botão, com conferência de papel mas sem `canWrite/canCreate` (`CriterioVersao.server.js:138, 183-193`), diferente do que `security.mdc` pede para consulta feita em nome do usuário.

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | SEC-021 (MÉDIO, proposto) — campos de controle da versão editáveis no rascunho | `security/criterio.now.ts:18-27`; `CriterioVersao.server.js:47-51, 97-103` | Campos de controle sem gravação por usuário; servidor só aceita rascunho → publicada e publicada → substituída; teste RED/GREEN com coordenador e admin do app | `outputs/spec/gaps-document.md` (GAP-103) + task SEC-021 no próximo sprint |
| 2 | BUG-001 (MÉDIO) — critério sem código substitui versões de outros critérios | `CriterioVersao.server.js:153-159, 201-211` | Não consultar por código vazio, ou tornar `codigo` obrigatório; teste com dois critérios sem código | `gaps-document.md` (GAP-104) |
| 3 | CONF-001 (MÉDIO) — «Nome é obrigatório» não aparece no form | `tables/criterio.now.ts:12`; `CriterioVersao.server.js:91-93` | Mensagem do critério de aceite também no form (mensagem de campo por UI Policy ou Client Script de envio) e teste de form | `gaps-document.md` (GAP-105) |
| 4 | CONF-002 (MÉDIO) — atendente vê e lê os critérios | `navigation/menu.now.ts:53`; `security/acl-base.now.ts:110-124` | Tirar o papel atendente do módulo e da ACL de leitura do critério pelo `data-model.json` + `sn-scaffold`; teste de leitura negada | `gaps-document.md` (GAP-106) |
| 5 | CONF-005 (MÉDIO) — G3 do fio condutor sem validadores de LLM | `outputs/spec/auditorias/*.validacao.json` | Rodar o G3 com validadores ou registrar a isenção de G3 da story | `gaps-document.md` (GAP-107) |
| 6 | BUG-002 + PERF-001 (BAIXO) — unicidade por consulta, sem índice, sujeita a corrida | `CriterioVersao.server.js:107-118, 201-211`; `tables/criterio.now.ts:13-14` | Índice único `codigo` + `versao` pelo `data-model.json`; consultar só quando código ou versão mudam | `gaps-document.md` (GAP-108) |
| 7 | BUG-003 (BAIXO) — mensagem de duplicado para qualquer falha | `CriterioVersao.server.js:193-196` | Mensagem neutra ou nenhuma, mais `gs.warn` | `gaps-document.md` (GAP-109) |
| 8 | BUG-004 (BAIXO) — comentário barrado em versão publicada | `security/criterio.now.ts:8-27` | ACL de campo `write` para `comentarios` sem condição de estado | `gaps-document.md` (GAP-110) |
| 9 | OBS-001 (BAIXO) — recusa sem usuário, operação e SEC-009 no log | `bloquearVersaoPublicada.server.js:6`; `bloquearExclusaoPublicada.server.js:3`; `conferirGravacaoCriterio.server.js:14`; `cicloPublicadoImutavel.server.js:5` | Incluir sys_id do usuário, tabela, operação e `SEC-009` | `gaps-document.md` (GAP-111) |
| 10 | CONF-007 (BAIXO) — `GlideRecord` sem `canWrite/canCreate` no caminho do botão | `CriterioVersao.server.js:138, 183-193` | `GlideRecordSecure` ou `canWrite/canCreate` antes de gravar | `gaps-document.md` (GAP-112) |
| 11 | CONF-004 (BAIXO) — ciclo publicado na inclusão ou com critério em rascunho | `business-rules/ciclo.now.ts:12, 15` | Recusar ciclo publicado com critério fora de «Publicada»/«Substituída» e inclusão já publicada, na story do ciclo | `gaps-document.md` (GAP-113), junto com SEC-010 |
| 12 | CONF-003 (BAIXO) — Data Policy do SEC-009 não criada | — | Criar a Data Policy de somente leitura para versão publicada, ou registrar no `plano-de-seguranca.md` a troca pela Business Rule | `gaps-document.md` (GAP-114) |
| 13 | CONF-006 (BAIXO) — padrão de estado e versão por Business Rule, não pelo dicionário | `conferirGravacaoCriterio.server.js:4-11`; `tables/criterio.now.ts:14-15` | Valor padrão `rascunho` e `1` no `data-model.json` | `gaps-document.md` (GAP-115) |
| 14 | TEST-001 (BAIXO) — sem evidência RED; padrão e mensagem no form sem teste | `tests/US-MOD-F2-002.now.ts:397-440, 598-628` | Teste do preenchimento automático; guardar a saída RED da próxima regra | `gaps-document.md` (GAP-116) |
| 15 | Marcador da US | `outputs/spec/em-andamento.md` | Com veredito diferente de BLOQUEADA, a skill apaga o marcador e commita a remoção antes do push; nesta execução isso não foi feito, por instrução. O `proximo-passo` dele ainda diz "implementar TASK-MOD-F2-002-01" | quem integrar a US |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@90818c8
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
