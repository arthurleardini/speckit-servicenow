---
generated-by: spec-scope-change v1.2
project: "Cobrança MT — piloto 2.6 Cobrança (Speckit ServiceNow)"
date: "2026-11-25"
change-documents: ["docs/designs/ux-cobranca-v1.md", "docs/designs/review-ux/consolidated_review_report.md"]
development-phase: "Em desenvolvimento"
global-risk: "🟡 MÉDIO"
delta-size: "GRANDE"
total-chgs: 18
regressions-identified: 4
changes: "ux-v1 (CHG-001..018, abaixo); ux-v2 (CHG-019..041, docs/designs/ux-cobranca-v2-regua-flow.md v2.1, seção no fim; 23 CHGs, risco 🟡 MÉDIO, delta GRANDE, 5 regressões de risco alto)"
---
# Análise de Alteração de Escopo — Cobrança MT (change ux-v1)

| Campo | Valor |
|---|---|
| Documentos de alteração | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| Data de análise | 2026-11-25 |
| Projeto | Cobrança MT — piloto 2.6 Cobrança (app x_2326104_cob, dev493801) |
| Estado do desenvolvimento | Em desenvolvimento (v0 entregue: estrutura de 7 módulos + 5 stories de RF DONE) |
| Risco global | 🔴 ALTO na Etapa A → 🟡 MÉDIO depois da Etapa B (3 CHGs críticos decididos; resta regressão confirmada em código entregue) |
| Tamanho estimado do delta | GRANDE (15 tasks novas, 4 camadas, 4 regressões de risco alto) |
| CHGs identificados | 18 (3 críticos · 7 altos · 5 médios · 3 baixos), todos decididos |
| Regressões potenciais | 4 grupos de tasks com risco alto, 6 com risco médio |
| Sigla do change | ux-v1 |
| Destino das stories | **Desvio autorizado pelo usuário:** EPIC-008, FEAT-UX-LISTA/CICLO/CASO/NAVEGACAO e STORY-MOD-UX-001..008 (15 tasks) entram direto em `outputs/spec/tasks.json`, não em `tasks-complementary_change-ux-v1.json` |

---

## Resumo executivo

O app foi gerado a partir do modelo de dados: uma tela por tabela e o mesmo menu de 21 entradas para todos. A reformulação organiza o app pelo trabalho de cada pessoa, como validado com a SEFAZ-MT: o atendente trabalha uma lista de ligações (contatos) e o coordenador conduz os casos qualificados, roda o ciclo do mês e acompanha os números. Continua tudo na Core UI clássica.

O que já foi entregue e muda: o caso qualificado deixa de ser do atendente e passa ao coordenador. Isso toca o dossiê (F5-003), a carteira do atendente (F5-007, SEC-002) e 6 testes automáticos, que ficam desligados até serem reescritos. A estrutura gerada dos módulos F2 e F5 é regerada, e o seed do ciclo e do caso passa a ser escrito à mão.

Decisões: as 18 questões foram decididas pelo agente, com autorização do usuário, seguindo as decisões R1–R8 e as correções obrigatórias do design. Nenhuma ficou aberta.

Próximo passo: F2 (modelo de dados → sn-scaffold → seed à mão → reinstall), depois F3 (verbos) e F4 (acessos e testes migrados).

---

## Alterações por documento

### docs/designs/ux-cobranca-v1.md (v1.1) + revisão consolidada

**Data do documento:** 2026-11-25
**Origem:** design do agente (D1–D10), revisão EGM (4 revisores) e decisões finais R1–R8

#### Regras definidas

| # | Regra | Tipo | Camadas afetadas |
|---|---|---|---|
| 1 | Nova tabela «Contato da lista» (lista de cobrança ativa do atendente) | ADIÇÃO | Negócio / Dados / Tela / Testes |
| 2 | Caso qualificado passa do atendente ao coordenador (coluna «Responsável») | RESPONSABILIDADE | Negócio / Dados / Tela / Testes |
| 3 | Interação aponta para contato ou para caso (exatamente um); `caso` deixa de ser obrigatório; + retorno | ALTERAÇÃO | Dados / Testes |
| 4 | Ciclo ganha data e quantidade da distribuição; etapa «Distribuído» por condição (R1) | ADIÇÃO | Dados / Tela |
| 5 | Menu por área de trabalho e por papel; tabelas só em Administração | ALTERAÇÃO | Tela / Testes |
| 6 | Página inicial por papel (preferência dos usuários demo; plano B R8) | ADIÇÃO | Tela / Testes |
| 7 | Verbos: Registrar ligação (tabela de decisão), Encerrar contato, Distribuir lista, Avançar etapa, Encerrar caso | ADIÇÃO | Negócio / Tela / Testes |
| 8 | Trilha de etapas em contato, caso e ciclo | ADIÇÃO | Tela |
| 9 | Atendente sem acesso ao caso; coordenador registra interação no caso (R4) | RESPONSABILIDADE | Negócio / Testes |
| 10 | Grupo de controle protegido também na lista ativa | COMPORTAMENTO_CONDICIONAL | Negócio / Testes |
| 11 | Seed coerente à mão para ciclo, contato e caso (R7); rótulos PT-BR e moeda R$ | ALTERAÇÃO | Dados / Tela |
| 12 | Painel único, «Gerar prévia», Kanban e RN-09 cortados (GAP-021..024) | REMOÇÃO | Negócio / Tela |

#### Impacto por camada

**Negócio:** novas regras RN-NOVO-UX-001 a 012 (lista ativa, filtro de «Minha lista», tabela de decisão da ligação, interação com um pai, encerramento com motivo, distribuição só da massificada, caso do coordenador, ordem dos estágios, home por papel, Analytics, seed coerente, trilha). RN-NOVO-F5-007 (carteira) muda: o caso sai da carteira do atendente e entra o contato. RN-NOVO-F2-005 (grupo de controle) passa a cobrir o contato.

**Contrato de API:** sem impacto. O app não expõe API própria; os verbos são UI Actions e Script Includes da instância. `oasdiff` não se aplica (sem `api-contracts.yaml`).

**Modelo de Dados:** tabela nova `x_2326104_cob_contato`; `interacao` + `contato`, + `retorno_em`, `caso` não obrigatório; `caso.atendente` → `caso.coordenador` (DELETE + ADD no SDK, dados da coluna somem e o seed é refeito); `ciclo` + `distribuido_em`, + `qtd_contatos`; display de caso, contato e ciclo; rótulos de moeda «(R$)»; `modules` com áreas, `adminTables`, `processFlows`, `homes`, `seedManual`.

**Tela / UX:** novas TEL-034 «Minha lista» e TEL-035 «Contato da lista»; TEL-009 vira «Ciclo do mês» com trilha; TEL-023 «Minha fila» substituída no mesmo ID por «Casos qualificados» (coordenador); TEL-024 e TEL-025 passam ao coordenador; TEL-021/022 trocam atendente por coordenador. Menu: atendente com 3 entradas (Minha lista, Meus contribuintes, Meus indicadores), coordenador com 12, Administração com 22 tabelas só para o admin. Telas e etapas derivadas por leitura do design, sem amarração técnica de endpoint `[impacto-llm]`.

**Testes / Homologação:** F5-003 (3 testes) e F5-007 (3 testes) ficam inativos na F2 e são reescritos na F4 (positivo = coordenador, negativo = atendente sem acesso). Novos: 1 ATF por verbo do CUJ + 1 negativo por ACL nova. Verificação por Playwright: home e quantidade de entradas do menu por papel.

#### Fora do escopo desta alteração

Copiado literalmente da seção Non-Goals do design:

*   UI Builder, Workspace, Service Portal e UI Page React. Fica tudo na Core UI clássica.
*   Kanban (Visual Task Board). No v1, a etapa aparece como lista agrupada por etapa mais a trilha no topo do registro.
*   Editor visual de régua com nós. A régua vira registro-pai com etapas editáveis na própria lista.
*   A/B de régua e fila de aprovação de IA, que ficam para depois. A priorização é por regra determinística (o score fica como campo opcional).
*   Integrações reais (seguem simuladas).

Copiado literalmente de «Cortes aplicados» (seção v1.1):

- UI Action "Agendar retorno" (coberta por "Registrar ligação" com retorno);
- módulos "Retornos de hoje" e "Distribuição da lista";
- field styles;
- BR de regularização (RN-09), registrada em GAP;
- cópia de `contato.telefone` (exibido por dot-walk `contribuinte.telefone`);
- `Dashboard()`;
- estado `distribuido`;
- "Gerar prévia";
- seções `homes`, `fieldStyles` e `dashboards` do kit; a home é gerada pelo `sn-seed`;
- documentos, exceto a `spec-scope-change`;
- risco do StateModel: **v1 sem StateModel**, só process flow e UI Actions;
- ATF reduzido a 1 por verbo do CUJ mais 1 negativo por ACL nova.

#### Critérios de aceite de negócio

- O atendente cai em «Minha lista» e o coordenador em «Casos qualificados»; do login à tarefa principal, no máximo 1 clique (M1; plano B R8).
- Atendente vê no máximo 5 entradas no menu; coordenador no máximo 12; as tabelas ficam só em Administração (M2).
- Registrar uma ligação com resultado e retorno: no máximo 3 cliques a partir da lista; ciclo do mês (Publicar, Distribuir): no máximo 3 cliques (M3, R2).
- Trilha de etapas no topo do contato, do caso e do ciclo (M4).
- O atendente trabalha só a própria lista; o coordenador conduz os casos e vê tudo; as ACLs garantem (M5).
- Telas em português, moeda em R$, referências com o campo certo, taxas entre 0 e 100% e grupo de controle menor que os elegíveis (M6).

---

## Análise de regressão

### Código já entregue que a mudança toca

*(Fontes: `app/spec_story.md` (memória do módulo) · estado das tasks: `tasks.json` e `**State:**` do spec_story.md (sem ADO) · inventário 🔴5 da revisão consolidada.)*

| Task ID | Estado | Arquivo e símbolo | Teste que prende o comportamento atual | O que muda |
|---|---|---|---|---|
| TASK-F5-ESTRUTURA-* | DONE | `app/src/fluent/tables/caso.now.ts` — coluna `atendente`; `ui/TEL-021`, `TEL-022`, `TEL-024` — campo `atendente`; `security/acl-base.now.ts` | — | coluna `atendente` → `coordenador` («Responsável»), regerado |
| TASK-MOD-F5-003-01 | DONE | `app/src/fluent/ui/caso-dossie-niveis.now.ts` — campo `atendente` na seção Caso | `tests/US-MOD-F5-003.now.ts` — t_f5003_dossie_pos, t_f5003_dossie_neg, t_f5003_ui | campo → `coordenador`; testes inativos até a F4 |
| TASK-MOD-F5-007-01 | DONE | `app/src/fluent/security/carteira.now.ts` — ACL do caso `podeVer(current, 'atendente')`, interação `caso.atendente`, regularização `['atendente', 'caso.atendente']` | `tests/US-MOD-F5-007.now.ts` — t_f5007_propria_pos, t_f5007_outro_neg, t_f5007_coord_pos | `caso.atendente` → `caso.coordenador`; testes inativos até a F4 |
| TASK-MOD-F5-007-02 | DONE | `app/src/fluent/business-rules/carteira.now.ts` + `src/server/carteira/recusarCasoForaDaCarteira.server.js` — `motivoRecusa(previous, 'atendente')`, `current.atendente.changes()` | idem | campo do dono → `coordenador` |
| TASK-MOD-F5-007-03 | DONE | `src/server/carteira/restringirConsultaCarteira.server.js` — mapa DONO (`caso: [atendente]`, `interacao: [caso.atendente]`) | idem | `coordenador` / `caso.coordenador`; `contato` entra no mapa na F4 |
| TASK-MOD-F5-007-03 | DONE | `src/server/carteira/recusarInteracaoForaDaCarteira.server.js` — `motivoRecusa(current, 'caso.atendente')` | idem | `caso.coordenador` (mínimo); dono por contato ou caso na F3 |
| TASK-MOD-F2-004-01 | DONE | `src/server/qualificacao/QualificacaoCiclo.server.js` — `publicar`, `emControle`; `business-rules/grupo-controle.now.ts` | `tests/US-MOD-F2-004.now.ts` | ganha `distribuir` e a BR do contato (F3); nada muda na F2 |
| TASK-F2-ESTRUTURA-* | DONE | `app/src/fluent/seed/ciclo.now.ts`, `seed/caso.now.ts` (gerados, 51 registros cada) | — | saem do gerador; seed manual em `app/src/fluent/seed-demo/` |

### Tasks com risco 🔴 ALTO de regressão

| Task ID | Título | Motivo | Ação necessária |
|---|---|---|---|
| TASK-MOD-F5-007-01..03 + SEC-002 | Visão restrita do atendente | Dono do caso muda de atendente para coordenador; mapa DONO e ACL de carteira citam `caso.atendente` | Renomear para `caso.coordenador` (F2, mínimo); reescrever ACL e testes (STORY-MOD-UX-006, F4) |
| TASK-MOD-F5-003-01..02 | Dossiê consolidado do caso | Form do dossiê mostra `atendente`; testes afirmam que o atendente lê o próprio caso | Trocar o campo no form (F2); reescrever F5-003 (F4) |
| TASK-F5-ESTRUTURA-* | Estrutura gerada MOD-F5 | Tabela `caso` (coluna atendente → coordenador), `interacao` (caso não obrigatório, + contato, + retorno_em), telas TEL-021..025 | Regerar pelo sn-scaffold (F2) |
| TASK-F2-ESTRUTURA-* | Estrutura gerada MOD-F2 | Ciclo ganha `distribuido_em`/`qtd_contatos`; seed do ciclo sai do gerador (seedManual); TEL-009 vira «Ciclo do mês» | Regerar pelo sn-scaffold e escrever o seed à mão (F2) |

### Tasks com risco 🟡 MÉDIO de regressão

| Task ID | Título | Motivo | Ação necessária |
|---|---|---|---|
| TASK-MOD-F2-004-01..02 + SEC-010 | Sorteio do grupo de controle | Regra do grupo de controle passa a valer também para o contato; o ciclo ganha a etapa «Distribuído» por condição | Acrescentar a BR do contato (STORY-MOD-UX-004); conferir regressão F2-004 |
| TASK-MOD-F2-002-01..03 + SEC-009 | Versão imutável do critério | Ciclo publicado continua imutável; `distribuido_em` e `qtd_contatos` são gravados pela distribuição | Conferir que a BR de imutabilidade do ciclo não recusa os 2 campos novos (STORY-MOD-UX-004) |
| TASK-MOD-F2-005-01..02 | Score com fallback | Seed do ciclo passa a ser manual; segmentações geradas ficam sem ciclo | Nenhuma ação de código; conferir suíte |
| TASK-MOD-F5-001-01, TASK-MOD-F5-002-01 | Distribuição de casos e fila do atendente | A fila do atendente vira «Minha lista» de contatos; a distribuição de casos é do coordenador | Revisar o texto das stories quando forem implementadas |
| TASK-MOD-F5-005-01, TASK-MOD-F5-006-01 | Registro de interação e encerramento | Interação aponta para contato ou caso; RN-09 cortada (GAP-021) | Revisar quando implementadas |
| TASK-MOD-F6-006-01 + SEC-003, TASK-MOD-F6-001-01, TASK-MOD-F6-004-01 | Visões por perfil, funil, efeito incremental | Reports entram no menu Analytics (R5); números do ciclo vêm do seed manual | Revisar quando implementadas |

### Tasks que precisam de novos cenários de teste

| Task ID | Título | Cenário novo necessário |
|---|---|---|
| TASK-MOD-F5-007-01..03 | Carteira do atendente | Atendente lê e grava só os próprios contatos; atendente sem acesso ao caso; coordenador cria interação no caso (R4) |
| TASK-MOD-F5-003-01..02 | Dossiê | Dossiê montado pelo coordenador; negado ao atendente |
| TASK-MOD-F2-004-01 | Grupo de controle | Contato recusado para contribuinte em controle |

### Tasks sem impacto confirmado 🟢

Auditadas contra o delta (estado PENDING, sem código entregue, e sem campo, tela ou regra tocada pelo change): STORY-SEC-TRANSVERSAL (SEC-001, 004–008, 012, 014, 020 — controles transversais; o papel admin e as ACLs base seguem iguais); MOD-F1 (STORY-MOD-F1-001..007, STORY-F1-ESTRUTURA DONE — tabelas de ingestão, débito, parcelamento e contribuinte não mudam de coluna); MOD-F3 (STORY-MOD-F3-001..006, STORY-F3-ESTRUTURA — score); MOD-F4 (STORY-MOD-F4-001..009, STORY-F4-ESTRUTURA — régua e comunicação; só ganham entrada de menu); MOD-T (STORY-MOD-T-001..004, STORY-T-ESTRUTURA — exportação e visão única); STORY-MOD-F2-001, 003, 006 (critério, segmentação, prévia: «Gerar prévia» cortada, GAP-023); STORY-MOD-F5-004 (sinalização coercitiva); STORY-MOD-F6-002, 003, 005, 007. Cenários de aceite (`acceptanceScenarios.testData`) dessas tasks não citam `caso.atendente` nem o estado do ciclo.

Cenários com `testData` desatualizado (regressão confirmada): os de TASK-MOD-F5-007-01..03 e TASK-MOD-F5-003-01..02 usam `caso.atendente = demo.atendente`; passam a `caso.coordenador = demo.coordenador` na F4.

---

## O que pode avançar sem aguardar CHGs

Todos os CHGs foram decididos na Etapa B. Pode avançar: F2 (modelo, scaffold, seed manual, reinstall), F3 (verbos e BRs via sn-implement) e F4 (ACLs e testes migrados).

## O que está bloqueado por CHGs

| CHG ID | Severidade | O que bloqueia |
|---|---|---|
| — | — | Nenhum bloqueio: 18/18 decididos em 2026-11-25 |

## Status dos CHGs (Etapa B)

| CHG | Severidade | Tema | Status | Decisão × sugestão |
|---|---|---|---|---|
| CHG-001 | CRÍTICA | Estado «distribuído» do ciclo | fechado | seguiu sugestão |
| CHG-002 | ALTA | «Gerar prévia» sem algoritmo | fechado | seguiu sugestão |
| CHG-003 | CRÍTICA | Dono do contato × dono do contribuinte | fechado | seguiu sugestão |
| CHG-004 | ALTA | Coordenador registra interação no caso | fechado | seguiu sugestão |
| CHG-005 | ALTA | Painel em Dashboard() | fechado | seguiu sugestão |
| CHG-006 | CRÍTICA | Migração do dono do caso | fechado | seguiu sugestão |
| CHG-007 | ALTA | Seed coerente entre tabelas | fechado | seguiu sugestão |
| CHG-008 | MÉDIA | Página inicial por papel | fechado | seguiu sugestão |
| CHG-009 | ALTA | Tabela de decisão de «Registrar ligação» | fechado | seguiu sugestão |
| CHG-010 | ALTA | Verbos por UI Policy | fechado | seguiu sugestão |
| CHG-011 | ALTA | Atendente sem acesso ao caso | fechado | seguiu sugestão |
| CHG-012 | MÉDIA | Grupo de controle na lista ativa | fechado | seguiu sugestão |
| CHG-013 | MÉDIA | Menu com consultas reais e limite de entradas | fechado | divergiu da sugestão original do design (Integrações também para o coordenador) para fechar o M2 |
| CHG-014 | MÉDIA | Rótulos, display e moeda | fechado | seguiu sugestão |
| CHG-015 | BAIXA | StateModel ambíguo | fechado | seguiu sugestão |
| CHG-016 | BAIXA | Destino das telas do caso do atendente | fechado | seguiu sugestão |
| CHG-017 | BAIXA | Cópia do telefone no contato | fechado | seguiu sugestão |
| CHG-018 | MÉDIA | Regra de regularização (RN-09) | fechado | seguiu sugestão |

---

*Documento gerado por spec-scope-change v1.2 — ver scope-change-gaps.md para os CHGs detalhados.*

---
---

# Análise de Alteração de Escopo — Cobrança MT (change ux-v2)

| Campo | Valor |
|---|---|
| Documentos de alteração | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1, aprovado pelo dono em 25/11/2026) + `docs/designs/review-ux/regua-flow_review_report.md` |
| Data de análise | 2026-11-25 |
| Projeto | Cobrança MT — piloto 2.6 Cobrança (app x_2326104_cob, dev493801) |
| Estado do desenvolvimento | Em desenvolvimento (v0 + UX v1 entregues: STORY-MOD-UX-001..008 DONE, suíte cob-regressao 50/50) |
| Risco global | 🔴 ALTO na Etapa A → 🟡 MÉDIO depois da Etapa B (7 CHGs críticos decididos pelo design; restam a F0 em curso e o DELETE do seed aleatório da régua) |
| Tamanho estimado do delta | GRANDE (19 tasks novas, 1 tabela nova, 5 Flows gerados, 4 custom actions, 5 camadas) |
| CHGs identificados | 23 (7 críticos · 5 altos · 8 médios · 3 baixos), todos decididos |
| Regressões potenciais | 5 grupos de tasks com risco alto, 6 com risco médio |
| Sigla do change | ux-v2 |
| Destino das stories | **Desvio autorizado (mesmo do ux-v1):** FEAT-UX-ACOES (EPIC-008), FEAT-F4-FLOW (EPIC-004) e STORY-MOD-UX-009, UX-010, STORY-MOD-F4-010..014 e F4-016 (opcional) entram direto em `outputs/spec/tasks.json` |

---

## Resumo executivo

Duas mudanças pedidas pelo dono do produto. Primeira: as ações de negócio passam a aparecer onde a pessoa já está, na lista (menu da linha e «Ações nas linhas selecionadas»), com uma coluna «O que fazer agora» em contato, caso e ciclo; o Update sai do form do contato e do ciclo fora da prévia, e o New sai das listas de contato, régua e etapa para quem não é admin. O coordenador e o admin ganham a «Lista da equipe». Segunda: cada régua de cobrança vira um Flow do Flow Designer, que começa quando um contribuinte é inscrito, espera o prazo de cada etapa, confere as guardas (regularização, grupo de controle, régua pausada), envia pelo canal simulado respeitando opt-in, opt-out, teto e fallback e, no fim, encaminha à cobrança ativa ou à qualificada.

O que já foi entregue e muda: a distribuição da lista (UX-004) passa a usar um helper que a régua também chama; o mapa de carteira ganha a tabela de inscrição; o seed aleatório de régua, etapa, canal, comunicação, retorno de envio e consentimento (≈300 registros) sai e vira DELETE no install da F2; o menu do coordenador passa de 12 para 14 módulos (revoga o limite do ux-v1); as listas de contato e caso trocam uma coluna. Os testes da UX-004 não mudam (conferido no design).

Decisões: as 23 questões nascem decididas pelas decisões D1–D20 e P1/P2/P3 do design v2.1, aprovado pelo dono. Os pontos técnicos ainda abertos estão na F0 (spike na instância), com plano B escrito no design; os já respondidos entram nas stories.

Próximo passo: terminar a F0 e registrar sim/não de cada ponto no `sync-log.md`; depois F1 (UX-009 e UX-010), F2 (F4-010, com confirmação do DELETE do seed antes do install), F3 a F5.

---

## Alterações por documento

### docs/designs/ux-cobranca-v2-regua-flow.md (v2.1)

**Data do documento:** 2026-11-25
**Origem:** pedido do dono do produto, rascunho do agente, revisão EGM (8🔴, 24🟡, 12🟢) e decisões do dono P1, P2, P3

#### Regras definidas

| # | Regra | Tipo | Camadas afetadas |
|---|---|---|---|
| 1 | Toda ação de negócio alcançável pela lista em até 2 cliques (UI Actions de lista próprias, D1) | ADIÇÃO | Tela / Testes |
| 2 | Update só para admin no contato; no ciclo, coordenador só na prévia; New de contato, régua e etapa só admin (D2) | ALTERAÇÃO | Tela / Testes |
| 3 | «O que fazer agora» gravado por BR em contato, caso e ciclo; aviso no form do contato (D3) | ADIÇÃO | Negócio / Dados / Tela / Testes |
| 4 | «Lista da equipe» para coordenador e admin; coordenador com 14 módulos (D4, D5, D20) | ALTERAÇÃO | Tela / Testes |
| 5 | Inscrição na régua como tabela própria; nasce na publicação do ciclo por BR after (D6, D7) | ADIÇÃO | Negócio / Dados / Testes |
| 6 | Uma régua = um Flow gerado por script a partir de `outputs/spec/reguas.json`; o motor lê a etapa em tempo de execução (D8, D9, D10) | ADIÇÃO | Negócio / Dados / Testes |
| 7 | Espera configurável por `segundos_por_dia` (60 na demo; 86400 em produção) (D11) | ADIÇÃO | Dados / Testes |
| 8 | Escalonamento só no fecho, depois de `prazo_final_dias` (D13) | COMPORTAMENTO_CONDICIONAL | Negócio / Testes |
| 9 | Encaminhamento à cobrança ativa cria ou reaproveita contato (P1 = ambos, D14) | RESPONSABILIDADE | Negócio / Dados / Testes |
| 10 | Coordenador edita a etapa no form e o Flow no Designer (P2 = ambos, D15) | RESPONSABILIDADE | Negócio / Tela |
| 11 | Régua Parcelamentos dispara com parcelamento «em risco»; guarda por carteira (P3, D16) | ADIÇÃO | Negócio / Testes |
| 12 | Etapa recusa postura fora de sequência, dia fora de ordem, encaminhar fora da última e valor em canal informal (D17) | COMPORTAMENTO_CONDICIONAL | Negócio / Testes |
| 13 | Teto de 1 tentativa por contribuinte e canal na janela de `segundos_por_dia`; fallback SNE → e-mail → SMS (D18, D19) | COMPORTAMENTO_CONDICIONAL | Negócio / Testes |
| 14 | Regularizou, a régua para na mesma transação (G8) | COMPORTAMENTO_CONDICIONAL | Negócio / Testes |
| 15 | Seed de régua, etapa, canal e consentimento escrito à mão; seed aleatório dessas tabelas sai | ALTERAÇÃO | Dados |
| 16 | RN-09 (regularização encerra contato) continua fora; volume de contextos de Flow em produção vira GAP | REMOÇÃO | Negócio |

#### Impacto por camada

**Negócio:** regras novas RN-NOVO-UX-013 (ação na lista), RN-NOVO-UX-014 (Update e New por papel), RN-NOVO-UX-015 («O que fazer agora»), RN-NOVO-UX-016 (Lista da equipe) e RN-NOVO-F4-009 a 014 (inscrição, sequência da etapa, guardas, teto por janela, encaminhamento, parcelamento em risco). Ganham implementação as RN-NOVO-F4-001 a 008, RN-NOVO-F1-002 (regularização encerra a abordagem) e RN-NOVO-F2-005 (grupo de controle fora das ações). RN-NOVO-F4-004 (fallback) e RN-38 (teto) passam a constantes do motor.

**Contrato de API:** sem impacto. O app não expõe API própria; as 4 custom actions e o `ReguaMotor` são internos da instância. `oasdiff` não se aplica (sem `api-contracts.yaml`).

**Modelo de Dados:** tabela nova `x_2326104_cob_regua_inscricao`; `regua` + `codigo`, `flow`, `prazo_final_dias` (`ordem_fallback` sai de lista e form, a coluna fica); `regua_etapa` + `postura`, `acao_sem_resposta` + `encaminhar_ativa`; `comunicacao` e `envio_sim` + `inscricao`; `contato` + `inscricao`, `origem`, `proxima_acao`; `caso` e `ciclo` + `proxima_acao`; `contribuinte` + `encaminhado_qualificada_em`; propriedade `x_2326104_cob.regua.segundos_por_dia`. `seedManual` += regua, regua_etapa, canal_sim, consentimento, comunicacao, envio_sim.

**Tela / UX:** TEL-034 e TEL-023 trocam uma coluna por `proxima_acao`; TEL-013 tira `janela_atribuicao_dias` e `ordem_fallback`; TEL-014 (régua) ganha «Ver execuções» e «Abrir no Flow Designer»; TEL-035 reordena os campos; novas TEL-036 (lista do ciclo para «Ciclo do mês»), TEL-037 (lista de inscrições) e TEL-038 (form da inscrição com comunicações e retornos). Menu: separador «Equipe» com «Lista da equipe» e módulo «Inscrições» em Réguas. Telas derivadas por leitura do design, sem amarração de endpoint `[impacto-llm]`.

**Testes / Homologação:** um arquivo ATF por story nova (B9), com régua de teste `codigo = atf_<caso>` que nenhum Flow casa. Ponta a ponta do Flow (com espera) conferido na instância (CUJ-4 a CUJ-7), porque não há passo ATF de Flow. UX-004 continua verde sem mudança. Teste do gerador por `node --test`.

**Arquitetura (HLD):** `outputs/spec/hld.md` não existe neste projeto (HLD_MISSING, como no ux-v1).

#### Fora do escopo desta alteração

Copiado literalmente da seção Non-Goals do design:

*   Editor visual de régua próprio, UI Page, GlideModal, Workspace e UI Builder.
*   Etapa preventiva (D−5, D−2 do vencimento). D0 = inscrição.
*   A/B de régua, versões de régua e comparação (RN-52). Sem campos de versão.
*   Canal real. Envio continua em `canal_sim` e `envio_sim`.
*   Origem da regularização (RF-MOD-F4-007) e efetividade (RF-MOD-F4-008): ficam como estão.
*   **Encerrar contatos abertos na regularização (RN-09)**: fora da v2, registrado como GAP em `outputs/spec/gaps-document.md`.
*   Ação em massa para "Registrar ligação" e "Encerrar": pedem anotação ou motivo, que não cabem numa ação de lista sem modal.
*   Form do contato em seções novas: o `sn-scaffold` gera uma seção por tela e o gerador é zona imutável. A v2 só reordena os campos.
*   Um Flow genérico que lê as etapas e serve a todas as réguas (descartado pelo dono).
*   Cancelar o contexto do Flow ao encerrar a inscrição: o contexto acorda, vê a inscrição encerrada e termina sem enviar.

#### Critérios de aceite de negócio

- Toda ação de negócio alcançável pela lista em no máximo 2 cliques, para atendente e coordenador (G1).
- No form de contato e de ciclo, só os verbos do estado atual, no máximo 3 botões, sem Update (salvo ciclo em prévia) e sem Delete (G2).
- «O que fazer agora» preenchido em 100% dos contatos, casos e ciclos (G3).
- Coordenador e admin abrem «Lista da equipe» e veem todos os contatos abertos, agrupados por atendente (G4).
- 5 Flows ativos «Régua: <nome>», com um stage por etapa e «Encaminhamento» (G5).
- Com `segundos_por_dia = 60`, a régua IPVA encaminha em até 40 minutos, com 1 comunicação por etapa executada (G6).
- Nenhuma comunicação para grupo de controle, opt-out, sem opt-in, acima do teto ou já regularizado (G7).
- Regularizou, a inscrição fica «Encerrada» na mesma transação e nenhuma etapa seguinte envia (G8).

#### Resultados da F0 já incorporados às stories

| Ponto | Resultado | Onde entra |
|---|---|---|
| `ordem` nas entradas das custom actions | só número; string `'2'` não compila (TS2322) | TASK-MOD-F4-010-03 |
| `relativeDatetime` | pill direto e template literal compilam e serializam igual (`{{<uuid>.executar_em}}`); execução da espera em conferência | TASK-MOD-F4-010-03 |
| Chamada por `sn_fd.FlowAPI…action('x_2326104_cob.<internalName>')` | entrada reference exige GlideRecord (sys_id dá «Invalid GlideRecord input format found»); no script, `inputs.<ref>` chega como GlideRecord e `inputs.ordem` como string vinda do Flow: o script faz `parseInt` | TASK-MOD-F4-010-03 |
| `values: TemplateValue({...})` no `updateRecord` do catch; stage dentro do `try`; `sys_flow_context.source_record` = registro do gatilho | sim | TASK-MOD-F4-010-03, TASK-MOD-F4-014-01 |
| `new_roles` do `sys_ui_list_control` | array (`['x_2326104_cob.admin']`); string solta não compila | TASK-MOD-UX-009-02 |
| Papel do coordenador no Flow Designer | `sys_user_role_contains` com `Now.ref('sys_user_role', { name: ... })` por nome | TASK-MOD-F4-014-02 |
| `regua.flow` no seed | `Now.ref('sys_hub_flow', 'flow_regua_<codigo>')` | TASK-MOD-F4-010-02 |
| `GROUPBY`, `showListChoice`, edição no Designer, transform | em teste; stories seguem o design | UX-009, UX-010, F4-014 |

---

## Análise de regressão

### Código já entregue que a mudança toca

*(Fontes: `app/spec_story.md` (memória do módulo) · estado das tasks no `tasks.json` · tabela «Arquivos (allowlist)» do design.)*

| Task ID | Estado | Arquivo e símbolo | Teste que prende o comportamento atual | O que muda |
|---|---|---|---|---|
| TASK-MOD-UX-004-01 | DONE | `src/server/qualificacao/QualificacaoCiclo.server.js` — `distribuir` (insert do contato dentro do laço) | `tests/US-MOD-UX-004.now.ts` (4 `it()` + `t_ux004_ui`) | insert vira `_criarContato(..., 'distribuicao', '')`; `atribuirContato` novo; nenhum `it()` muda |
| TASK-MOD-UX-004-01, TASK-MOD-F2-004-02 | DONE | `app/src/fluent/ui-actions/ciclo.now.ts` | `t_ux004_ui`, `tests/US-MOD-F2-004.now.ts` | ganha `order`, actions de lista e override de Update no mesmo arquivo |
| TASK-MOD-UX-002-01, UX-003-01, UX-005-01..02 | DONE | `ui-actions/contato.now.ts`, `caso.now.ts`, `criterio.now.ts` | `tests/US-MOD-UX-002/003/005.now.ts` | ganham `order` e actions de lista; as de form não mudam |
| TASK-MOD-UX-001-02, UX-007-02 | DONE | `app/src/fluent/navigation/menu.now.ts` (gerado) | Playwright do ux-v1 (12 módulos do coordenador) | separador «Equipe», «Inscrições», «Ciclo do mês» com view `tel_036`; 14 módulos |
| TASK-MOD-UX-001-01 | DONE | `tables/contato.now.ts`, `ui/TEL-034.now.ts`, `TEL-035.now.ts` (gerados) | `tests/US-MOD-UX-001.now.ts` | + `inscricao`, `origem`, `proxima_acao`; lista troca `status` por `proxima_acao`; form reordenado |
| TASK-MOD-UX-006-01, TASK-MOD-F5-007-03 | DONE | `src/server/carteira/restringirConsultaCarteira.server.js` — mapa `DONO`; `business-rules/carteira.now.ts` | `tests/US-MOD-F5-007.now.ts`, `US-MOD-UX-006.now.ts` | + `x_2326104_cob_regua_inscricao: ['contribuinte.atendente']` |
| TASK-MOD-F2-005-01 | DONE | `src/server/qualificacao/SegmentacaoScore.server.js` — `aplicar` | `tests/US-MOD-F2-005.now.ts` | lê `encaminhado_qualificada_em` → segmento qualificada |
| TASK-MOD-UX-008-01 | DONE | `app/scripts/gerar-seed-demo.mjs`, `seed-demo/ciclo|contato|caso.now.ts` | contagem do reinstall | grava `proxima_acao` e `origem`; gera canal_sim e consentimento |
| TASK-F4-ESTRUTURA-01..06, 08, 09 | DONE | `tables/regua*.now.ts`, `comunicacao.now.ts`, `simulations/envio_sim.now.ts`, `ui/TEL-013/014.now.ts`, `security/acl-base.now.ts:177-209`, `seed/regua|regua_etapa|canal_sim|comunicacao|envio_sim|consentimento.now.ts` | contagem do reinstall | colunas novas pelo scaffold; seed aleatório apagado (DELETE ≈300 registros); regularizacao perde a reference para comunicação |

### Tasks com risco 🔴 ALTO de regressão

| Task ID | Título | Motivo | Ação necessária |
|---|---|---|---|
| TASK-F4-ESTRUTURA-01..06 + seed gerado | Estrutura gerada MOD-F4 | 6 seeds aleatórios saem (≈300 registros viram DELETE); `comunicacao`, `envio_sim` e `consentimento` apontam para réguas sorteadas | Confirmar o DELETE com o usuário antes do install da F2; seed à mão (CHG-029) |
| TASK-MOD-UX-004-01 | Distribuir lista | `distribuir` passa a usar `_criarContato`; a régua cria contato pelo mesmo helper | Extrair sem mudar papel, dedupe, rodízio e mensagem; UX-004 verde sem mudança (CHG-019) |
| TASK-MOD-UX-001-02, UX-007-02 | Menu por área | Limite de 12 módulos do coordenador revogado; 2 módulos novos | Playwright passa a esperar 14 (CHG-033) |
| TASK-MOD-UX-006-01 + SEC-002 | Carteira do atendente | Tabela nova com dado do contribuinte precisa de ACL e BR de query por carteira | Deny por `contribuinte.atendente` + mapa `DONO` (CHG-024) |
| TASK-MOD-F2-005-01 | Segmentação | `aplicar` ganha a regra «esgotou a régua» | ATF novo em F4-012; F2-005 verde |

### Tasks com risco 🟡 MÉDIO de regressão

| Task ID | Título | Motivo | Ação necessária |
|---|---|---|---|
| TASK-MOD-F2-004-01..02 + SEC-010 | Grupo de controle | Inscrição de contribuinte em controle recusada pela mesma BR (`recusarAcaoControle`) | Reutilizar o script; ATF em F4-010 |
| TASK-MOD-F2-002-01..03 + SEC-009 | Ciclo imutável | `proxima_acao` gravado em ciclo publicado | Conferir que não está em `CAMPOS_CICLO_PROTEGIDOS` (não está) |
| TASK-MOD-UX-002-01, UX-003-01 | Verbos do contato | Update some do form; New some da lista | ATF de visibilidade em UX-009 |
| TASK-MOD-UX-005-01..02 | Caso | Coluna `ciclo` sai da lista TEL-023; ação de lista «Avançar etapa» | ATF de lista em UX-009 |
| STORY-MOD-F4-001..006, 009 (PENDING) | Régua, disparo, fallback, opt-in, reenvio, encaminhamento | Os artefatos previstos (flow `comunicacao-disparar-regua`, SI de escalonar e fallback, BR de opt-in) são substituídos por Flow por régua + `ReguaMotor` | Implementar pelas STORY-MOD-F4-010..016 (CHG-040) |
| TASK-MOD-UX-008-02 | Trilha de etapas | Form do contato reordenado | Conferir o formatter como 1º elemento |

### Tasks que precisam de novos cenários de teste

| Task ID | Título | Cenário novo necessário |
|---|---|---|
| TASK-MOD-UX-004-01 | Distribuir lista | `atribuirContato` com e sem contato aberto (em F4-012); `distribuir` intacto |
| TASK-MOD-UX-006-01 | Carteira | Atendente não lê inscrição de outra carteira; coordenador lê todas |
| TASK-MOD-F2-004-01 | Grupo de controle | Inscrição recusada para contribuinte em controle |
| TASK-MOD-F2-005-01 | Segmentação | Contribuinte com `encaminhado_qualificada_em` vira qualificada no ciclo seguinte |

### Tasks sem impacto confirmado 🟢

Auditadas contra o delta: STORY-SEC-TRANSVERSAL (exceto SEC-002, acima); MOD-F1 (STORY-MOD-F1-001..007 e F1-ESTRUTURA: débito e parcelamento só ganham BR after nova em arquivo à parte, sem coluna nova); MOD-F3; MOD-F5 (STORY-MOD-F5-001..006); MOD-F6; MOD-T; STORY-MOD-F2-001, 003, 006; STORY-MOD-F4-007 e 008 (fora, Non-Goals); TASK-MOD-UX-007-01 (home por papel). Cenários de aceite dessas tasks não citam régua, inscrição, `proxima_acao` nem Update/New.

Cenários com `testData` desatualizado: nenhum confirmado. Os cenários de TASK-MOD-F4-002..006 e 009 (PENDING) descrevem disparo e fallback sem inscrição; ficam como estão e a cobertura passa às stories novas (CHG-040).

---

## O que pode avançar sem aguardar CHGs

Todos os CHGs foram decididos na Etapa B. Pode avançar: fim da F0 (pontos em teste), F1 (UX-009, UX-010), F2 (F4-010, depois de confirmar o DELETE do seed com o usuário), F3 a F5.

## O que está bloqueado por CHGs

| CHG ID | Severidade | O que bloqueia |
|---|---|---|
| — | — | Nenhum bloqueio: 23/23 decididos em 2026-11-25. O install da F2 espera a confirmação do DELETE do seed (CHG-029), regra do `CLAUDE.md` |

## Status dos CHGs (Etapa B)

| CHG | Severidade | Tema | Status | Decisão × sugestão |
|---|---|---|---|---|
| CHG-019 | CRÍTICA | Contato da régua × distribuição (P1) | fechado | divergiu: dono escolheu «ambos»; a sugestão era só pela régua |
| CHG-020 | ALTA | Edição da régua: form × Flow Designer (P2) | fechado | divergiu: dono escolheu «ambos»; a sugestão era só o form |
| CHG-021 | ALTA | Régua de parcelamento em risco (P3) | fechado | seguiu sugestão |
| CHG-022 | CRÍTICA | Teto por dia × demo em minutos | fechado | seguiu sugestão |
| CHG-023 | CRÍTICA | Coordenador só lê régua e etapa | fechado | seguiu sugestão |
| CHG-024 | CRÍTICA | Segurança da inscrição | fechado | seguiu sugestão |
| CHG-025 | CRÍTICA | Inscrição só pelo botão Publicar | fechado | seguiu sugestão |
| CHG-026 | CRÍTICA | Idempotência do envio e do escalonamento | fechado | seguiu sugestão |
| CHG-027 | CRÍTICA | Contrato das custom actions e build da F2 | fechado | seguiu sugestão |
| CHG-028 | ALTA | Limites da API Fluent para o Flow | fechado | seguiu sugestão; F0 confirmou `ordem` numérica e reference por GlideRecord |
| CHG-029 | ALTA | Seed aleatório da régua vira DELETE | fechado | seguiu sugestão |
| CHG-030 | ALTA | Fecho e janela de resposta | fechado | seguiu sugestão |
| CHG-031 | MÉDIA | Update, Delete e New por papel | fechado | seguiu sugestão; F0: `new_roles` como array |
| CHG-032 | MÉDIA | Ações de form `isClient` não rodam na lista | fechado | seguiu sugestão |
| CHG-033 | MÉDIA | Limite de 12 módulos do coordenador | fechado | seguiu sugestão (revoga o limite do ux-v1, CHG-013) |
| CHG-034 | MÉDIA | Lista da equipe e admin do app | fechado | seguiu sugestão |
| CHG-035 | MÉDIA | «O que fazer agora» | fechado | seguiu sugestão |
| CHG-036 | MÉDIA | Estrutura da etapa validada só no gerador | fechado | seguiu sugestão |
| CHG-037 | MÉDIA | Consentimento vigente, falha simulada e ordem de fallback | fechado | seguiu sugestão |
| CHG-038 | BAIXA | Regularização encerra contatos (RN-09) | fechado | seguiu sugestão (fora, GAP-154) |
| CHG-039 | BAIXA | Volume de contextos de Flow em produção | fechado | seguiu sugestão (GAP-155) |
| CHG-040 | MÉDIA | Stories F4 pendentes × régua como Flow | fechado | seguiu sugestão |
| CHG-041 | BAIXA | Edição no Designer perdida no reinstall | fechado | seguiu sugestão |

---

*Seção ux-v2 gerada por spec-scope-change v1.3 — ver scope-change-gaps.md (seção ux-v2) para os CHGs detalhados.*
