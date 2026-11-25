---
generated-by: spec-scope-change v1.2
project: "Cobrança MT — piloto 2.6 Cobrança (Speckit ServiceNow)"
date: "2026-11-25"
---
# Matriz de Impacto — Alteração de Escopo — Cobrança MT (change ux-v1)

**Audiência:** devs, QA
**Propósito:** mapa rápido e visual do que muda em cada camada e artefato

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| 🔴 | Impacto direto — alteração necessária |
| 🟡 | Impacto indireto — verificar e possivelmente ajustar |
| 🟢 | Sem impacto confirmado |
| ➕ | Novo artefato / entidade / endpoint |

---

## Impacto por camada e elemento

| Camada | Elemento | Tipo | Descrição da mudança | CHG relacionado |
|---|---|---|---|---|
| Dados | x_2326104_cob_contato | ➕ | Tabela nova da lista ativa (sem telefone; display = contribuinte) | CHG-003, CHG-017 |
| Dados | x_2326104_cob_caso.atendente → coordenador | 🔴 | Coluna renomeada (DELETE + ADD), rótulo «Responsável» | CHG-006 |
| Dados | x_2326104_cob_interacao | 🔴 | + contato, + retorno_em, caso não obrigatório | CHG-004, CHG-009 |
| Dados | x_2326104_cob_ciclo | 🟡 | + distribuido_em, + qtd_contatos; sem estado novo | CHG-001 |
| Dados | display e rótulos de moeda | 🟡 | caso/contato = contribuinte, ciclo = nome; «(R$)» | CHG-014 |
| Dados | seed de ciclo, contato, caso | 🔴 | seed à mão em app/src/fluent/seed-demo/ (seedManual) | CHG-007 |
| Negócio | RN-NOVO-F5-007 (carteira) | 🔴 | Caso sai da carteira do atendente; contato entra; coordenador cria interação | CHG-004, CHG-011 |
| Negócio | RN-NOVO-F2-005 (grupo de controle) | 🟡 | Cobre também o contato | CHG-012 |
| Negócio | RN-NOVO-UX-001..012 | ➕ | Regras novas da lista ativa, verbos, home, trilha e seed | CHG-009, CHG-010 |
| Tela | TEL-034 Minha lista, TEL-035 Contato da lista | ➕ | Telas novas do atendente | CHG-016 |
| Tela | TEL-009 Ciclo do mês | 🟡 | Retítulo + trilha de etapas | CHG-001 |
| Tela | TEL-023 → Casos qualificados | 🔴 | Substituída no mesmo ID; papel coordenador | CHG-016 |
| Tela | TEL-021, 022, 024, 025 | 🟡 | Coordenador no lugar do atendente | CHG-006, CHG-016 |
| Tela | Menu Cobrança MT | 🔴 | Áreas por papel; atendente 3 entradas, coordenador 12; Administração admin | CHG-013 |
| Tela | Página inicial por papel | ➕ | my_home_navigation_page dos usuários demo | CHG-008 |
| Tela | Painel único | 🟢 | Cortado; reports no menu Analytics | CHG-005 |
| Testes | US-MOD-F5-003 (3), US-MOD-F5-007 (3) | 🔴 | Inativos na F2, reescritos na F4 | CHG-006 |
| Testes | ATF dos verbos e ACLs novas | ➕ | 1 por verbo do CUJ + 1 negativo por ACL nova | CHG-010, CHG-011 |
| Contrato | api-contracts | 🟢 | Sem API própria no app | — |

---

## Tasks existentes afetadas

| Task ID | Risco | Tipo de impacto | Ação necessária |
|---|---|---|---|
| TASK-MOD-F5-007-01..03 + SEC-002 | 🔴 ALTO | Dono do caso muda de atendente para coordenador; mapa DONO e ACL de carteira citam `caso.atendente` | Renomear para `caso.coordenador` (F2, mínimo); reescrever ACL e testes (STORY-MOD-UX-006, F4) |
| TASK-MOD-F5-003-01..02 | 🔴 ALTO | Form do dossiê mostra `atendente`; testes afirmam que o atendente lê o próprio caso | Trocar o campo no form (F2); reescrever F5-003 (F4) |
| TASK-F5-ESTRUTURA-* | 🔴 ALTO | Tabela `caso` (coluna atendente → coordenador), `interacao` (caso não obrigatório, + contato, + retorno_em), telas TEL-021..025 | Regerar pelo sn-scaffold (F2) |
| TASK-F2-ESTRUTURA-* | 🔴 ALTO | Ciclo ganha `distribuido_em`/`qtd_contatos`; seed do ciclo sai do gerador (seedManual); TEL-009 vira «Ciclo do mês» | Regerar pelo sn-scaffold e escrever o seed à mão (F2) |
| TASK-MOD-F2-004-01..02 + SEC-010 | 🟡 MÉDIO | Regra do grupo de controle passa a valer também para o contato; o ciclo ganha a etapa «Distribuído» por condição | Acrescentar a BR do contato (STORY-MOD-UX-004); conferir regressão F2-004 |
| TASK-MOD-F2-002-01..03 + SEC-009 | 🟡 MÉDIO | Ciclo publicado continua imutável; `distribuido_em` e `qtd_contatos` são gravados pela distribuição | Conferir que a BR de imutabilidade do ciclo não recusa os 2 campos novos (STORY-MOD-UX-004) |
| TASK-MOD-F2-005-01..02 | 🟡 MÉDIO | Seed do ciclo passa a ser manual; segmentações geradas ficam sem ciclo | Nenhuma ação de código; conferir suíte |
| TASK-MOD-F5-001-01, TASK-MOD-F5-002-01 | 🟡 MÉDIO | A fila do atendente vira «Minha lista» de contatos; a distribuição de casos é do coordenador | Revisar o texto das stories quando forem implementadas |
| TASK-MOD-F5-005-01, TASK-MOD-F5-006-01 | 🟡 MÉDIO | Interação aponta para contato ou caso; RN-09 cortada (GAP-021) | Revisar quando implementadas |
| TASK-MOD-F6-006-01 + SEC-003, TASK-MOD-F6-001-01, TASK-MOD-F6-004-01 | 🟡 MÉDIO | Reports entram no menu Analytics (R5); números do ciclo vêm do seed manual | Revisar quando implementadas |

---

## Novos artefatos necessários

| Artefato | Tipo | Skill geradora | Arquivo de saída |
|---|---|---|---|
| x_2326104_cob_contato e colunas novas | entidade | spec-data-model (direto no data-model.json, F2) | outputs/spec/data-model.json (desvio: sem arquivo _change) |
| EPIC-008, FEAT-UX-*, STORY-MOD-UX-001..008 (15 tasks) | stories e tasks | spec-scope-change (F0) | outputs/spec/tasks.json (desvio autorizado: sem tasks-complementary_change-ux-v1.json) |
| TEL-034, TEL-035 | tela | sn-scaffold (F2) | outputs/spec/screens-manifest.json |
| ATF dos verbos e ACLs | cenário de teste | sn-implement (F3/F4) | app/src/fluent/tests/US-MOD-UX-00n.now.ts |

## Notas de implementação derivadas das decisões (Etapa B)

- Etapa «Distribuído» do ciclo: condição `estado=publicado^distribuido_emISNOTEMPTY` (CHG-001).
- Filtro de «Minha lista»: `atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade` (CHG-009).
- Home: atendente → módulo «Minha lista»; coordenador → módulo «Casos qualificados» (CHG-005, CHG-008).
- Testes F5-003/F5-007 com `active: false` e comentário «migrar na F4» (CHG-006).

---

*Documento gerado por spec-scope-change v1.2 — ver `scope-change-analysis.md` e `scope-change-gaps.md`.*
