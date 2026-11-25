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

---
---

# Matriz de Impacto — Alteração de Escopo — Cobrança MT (change ux-v2)

**Audiência:** devs, QA
**Propósito:** mapa rápido do que muda em cada camada com o design `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1). Legenda igual à do ux-v1.

---

## Impacto por camada e elemento

| Camada | Elemento | Tipo | Descrição da mudança | CHG relacionado |
|---|---|---|---|---|
| Dados | x_2326104_cob_regua_inscricao | ➕ | Tabela nova: contribuinte × régua × ciclo, status (ativa, encerrada, erro), etapa atual, próxima etapa em, motivo de encerramento, contato, detalhe; audit | CHG-024, CHG-025 |
| Dados | x_2326104_cob_regua | 🔴 | + codigo (único), + flow (ref sys_hub_flow), + prazo_final_dias; ordem_fallback sai de lista e form | CHG-029, CHG-030, CHG-037 |
| Dados | x_2326104_cob_regua_etapa | 🔴 | + postura; acao_sem_resposta + encaminhar_ativa; rótulo «Dia (D+n)» | CHG-030, CHG-036 |
| Dados | comunicacao, envio_sim | 🟡 | + inscricao (ref) | CHG-026 |
| Dados | contato | 🟡 | + inscricao, + origem (distribuicao, regua), + proxima_acao | CHG-019, CHG-035 |
| Dados | caso, ciclo | 🟡 | + proxima_acao | CHG-035 |
| Dados | contribuinte | 🟡 | + encaminhado_qualificada_em | CHG-019 |
| Dados | Propriedade x_2326104_cob.regua.segundos_por_dia | ➕ | 60 na demo, 86400 em produção | CHG-022, CHG-028 |
| Dados | Seed regua, regua_etapa, canal_sim, consentimento, comunicacao, envio_sim | 🔴 | seedManual; seed aleatório apagado (≈300 DELETE); régua e etapa pelo gerador de Flows | CHG-029 |
| Negócio | RN-NOVO-UX-013..016 | ➕ | Ação na lista, Update/New por papel, «O que fazer agora», Lista da equipe | CHG-031..035 |
| Negócio | RN-NOVO-F4-009..014 | ➕ | Inscrição, sequência da etapa, guardas, teto por janela, encaminhamento, parcelamento em risco | CHG-019..022, CHG-025, CHG-036 |
| Negócio | RN-NOVO-F4-001..008, RN-NOVO-F1-002, RN-NOVO-F2-005 | 🟡 | Ganham implementação no `ReguaMotor` | CHG-040 |
| Fluxo | 5 Flows «Régua: <nome>» + 4 custom actions | ➕ | Gerados por `app/scripts/gerar-flows-regua.mjs` a partir de `outputs/spec/reguas.json` | CHG-027, CHG-028 |
| Tela | UI Actions de lista (11) e override de Update (2) | ➕ | Menu de contexto e «Ações nas linhas selecionadas» | CHG-031, CHG-032 |
| Tela | sys_ui_list_control (contato, régua, etapa e related list) | ➕ | New só admin | CHG-031 |
| Tela | TEL-034, TEL-023, TEL-013 | 🟡 | Uma coluna troca por proxima_acao; TEL-013 tira 2 colunas | CHG-033, CHG-035 |
| Tela | TEL-035 | 🟡 | Ordem dos campos; + origem, inscricao | CHG-035 |
| Tela | TEL-036, TEL-037, TEL-038 | ➕ | Lista do ciclo (Ciclo do mês), lista e form da inscrição | CHG-033, CHG-024 |
| Tela | Menu | 🔴 | Separador «Equipe» (Lista da equipe), «Inscrições»; coordenador 14 módulos | CHG-033, CHG-034 |
| Tela | Form da régua e da inscrição | ➕ | Pausar, Ativar, Ver execuções, Abrir no Flow Designer, Ver execução | CHG-020, CHG-023 |
| Segurança | ACL régua e etapa | 🔴 | Write para coordenador e admin; campos estruturais só admin | CHG-023 |
| Segurança | ACL e BR de query da inscrição | ➕ | Read com deny por carteira; mapa DONO | CHG-024 |
| Segurança | Papel coordenador contém flow_designer e flow_operator | ➕ | sys_user_role_contains por nome | CHG-020 |
| Testes | US-MOD-UX-009, UX-010, F4-010..014 (F4-016 opcional) | ➕ | ATF de B9; régua de teste `atf_*` | todos |
| Testes | US-MOD-UX-004 | 🟢 | Nenhum `it()` muda | CHG-019 |
| Testes | Playwright do menu | 🟡 | Coordenador: 14 módulos | CHG-033 |
| Contrato | api-contracts | 🟢 | Sem API própria no app | — |

---

## Tasks existentes afetadas

| Task ID | Risco | Tipo de impacto | Ação necessária |
|---|---|---|---|
| TASK-F4-ESTRUTURA-01..06 + seed gerado | 🔴 ALTO | Seeds aleatórios saem (DELETE ≈300); colunas novas | Confirmar DELETE antes do install da F2; seed à mão |
| TASK-MOD-UX-004-01 | 🔴 ALTO | `distribuir` usa `_criarContato` | Extrair helper sem mudar comportamento; UX-004 verde |
| TASK-MOD-UX-001-02, UX-007-02 | 🔴 ALTO | Menu com 2 módulos novos | Playwright com 14 módulos |
| TASK-MOD-UX-006-01 + SEC-002 | 🔴 ALTO | Inscrição entra na carteira | Deny + mapa DONO |
| TASK-MOD-F2-005-01 | 🔴 ALTO | `aplicar` lê `encaminhado_qualificada_em` | ATF em F4-012 |
| TASK-MOD-F2-004-01..02 + SEC-010 | 🟡 MÉDIO | BR de controle reutilizada na inscrição | ATF em F4-010 |
| TASK-MOD-F2-002-01..03 + SEC-009 | 🟡 MÉDIO | proxima_acao em ciclo publicado | Conferir campos protegidos |
| TASK-MOD-UX-002-01, UX-003-01, UX-005-01..02 | 🟡 MÉDIO | Update some do form; actions de lista no mesmo arquivo | ATF de visibilidade em UX-009 |
| STORY-MOD-F4-001..006, 009 (PENDING) | 🟡 MÉDIO | Artefatos previstos substituídos | Implementar pelas F4-010..016 |
| TASK-MOD-UX-008-02 | 🟡 MÉDIO | Form do contato reordenado | Formatter como 1º elemento |

---

## Novos artefatos necessários

| Artefato | Tipo | Skill geradora | Arquivo de saída |
|---|---|---|---|
| regua_inscricao e colunas novas | entidade | à mão no data-model.json (F1/F2) → sn-scaffold | outputs/spec/data-model.json |
| reguas.json | fonte das réguas | à mão (F2) | outputs/spec/reguas.json |
| Gerador de Flows e seed de régua | script | à mão (F2) | app/scripts/gerar-flows-regua.mjs (+ .test.mjs) |
| FEAT-UX-ACOES, FEAT-F4-FLOW, STORY-MOD-UX-009..010, STORY-MOD-F4-010..014, 016 (19 tasks) | stories e tasks | spec-scope-change (F0) | outputs/spec/tasks.json (desvio autorizado) |
| TEL-036, TEL-037, TEL-038 | tela | sn-scaffold | app/src/fluent/ui/ |
| ATF das stories novas | cenário de teste | sn-implement | app/src/fluent/tests/US-MOD-UX-009..010, US-MOD-F4-010..014(016).now.ts |

## Notas de implementação derivadas das decisões (Etapa B)

- Chamada por script: `sn_fd.FlowAPI.getRunner().action('x_2326104_cob.<internalName>').inForeground().withInputs({...}).run()`; entrada reference recebe o GlideRecord, não o sys_id (CHG-027).
- No script do passo, `inputs.inscricao` chega como GlideRecord e `inputs.ordem` como string (Flow) ou número (FlowAPI): `parseInt` (CHG-027).
- `ordem` no Flow gerado é número; string não compila (TS2322) (CHG-027).
- `relativeDatetime`: pill direto ou template literal; ambos serializam `{{<uuid>.executar_em}}` (CHG-028).
- `values: TemplateValue({ status: 'erro', detalhe: ... })` no `updateRecord` do catch (CHG-028).
- `new_roles: ['x_2326104_cob.admin']` (array) no `sys_ui_list_control` (CHG-031).
- Papel do coordenador: `Record({ table: 'sys_user_role_contains', data: { role: Now.ref('sys_user_role', { name: 'x_2326104_cob.coordenador' }), contains: Now.ref('sys_user_role', { name: 'flow_designer' }) } })` e outro para `flow_operator` (CHG-020).
- `regua.flow` no seed: `Now.ref('sys_hub_flow', 'flow_regua_<codigo>')` (CHG-029).
- «Lista da equipe»: `status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em` (CHG-034).
- «Inscrições»: `statusINativa,erro^ORDERBYDESCstatus^ORDERBYproxima_etapa_em` (CHG-033).

---

*Seção ux-v2 gerada por spec-scope-change v1.3 — ver `scope-change-analysis.md` e `scope-change-gaps.md` (seções ux-v2).*
