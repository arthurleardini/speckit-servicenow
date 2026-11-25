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
