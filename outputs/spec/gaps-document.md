# Documento de Gaps — Cobrança MT (piloto 2.6 Cobrança, Speckit ServiceNow v0)

**Gerado por:** spec-tasks (tasks/v5.4)
**Data:** 2026-11-24
**Projeto:** Cobrança MT, app `x_2326104_cob`, dados fictícios

> **Instruções:** preencha a seção `## Respostas` de cada gap. Depois, o agente propaga a resposta
> para o `tasks.json` e registra no `sync-log.md`.
>
> As questões abertas do pré-projeto continuam no registro único delas (GAP-006 a GAP-020). Este
> documento lista só o que a decomposição do backlog levantou, com numeração a partir de GAP-101
> para não colidir com aquele registro.

---

## Gaps Identificados

### GAP-101 — Busca e filtro padronizados sem regra de negócio própria

**Área:** MOD-T, `STORY-MOD-T-002`
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-T-002-01

**Descrição:**
O RF-MOD-T-002 não cita nenhuma RN («Regras de Negócio aplicáveis: —»), e nenhuma RN aponta para ele
no campo «Vinculada a». A story usa a RN-NOVO-F5-007 (atendente vê só a própria carteira), porque o
filtro por atendente nas listas obedece à carteira. O registro fica em `metadata.enrichmentGaps[]`.

**Contexto:**
Cenários do RF: filtrar por tributo, combinar filtros e filtro sem resultado. Casos do plano de
testes CT-MOD-T-003, CT-MOD-T-004 e CT-MOD-T-009 (filtro de dias de atraso só aceita número).

**Opções identificadas:**
1. Manter a RN-NOVO-F5-007 como regra da story: a busca não tem regra própria além da carteira.
2. Criar uma RN própria na `spec-product` (por exemplo, filtros mínimos por lista e validação de tipo do valor filtrado) e trocar a referência na story.

### GAP-102 — Dependências entre RF formam ciclo no nível de épico

**Área:** EPIC-002, EPIC-003, EPIC-005, EPIC-006
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** nenhuma (ordem do backlog)

**Descrição:**
As dependências declaradas nos RF não têm ciclo entre stories, mas ao subir para os épicos formam
um: RF-MOD-F2-005 depende de RF-MOD-F3-001 (EPIC-002 → EPIC-003), RF-MOD-F3-003 depende de
RF-MOD-F5-003 (EPIC-003 → EPIC-005) e RF-MOD-F5-001 depende de RF-MOD-F2-004 (EPIC-005 → EPIC-002).
O ordenador do backlog avisa (BACKLOG_ORDER_ACYCLIC) e deixa os épicos na ordem de desempate.

**Opções identificadas:**
1. Manter: a ordem que importa é a das stories, que não tem ciclo.
2. Rever a dependência do score no dossiê (RF-MOD-F3-003 → RF-MOD-F5-003), que é a que cruza de volta.

---

## Respostas

### GAP-101
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-102
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

---

*Depois de preencher as respostas, peça ao agente para propagar para o tasks.json e o sync-log.md.*
