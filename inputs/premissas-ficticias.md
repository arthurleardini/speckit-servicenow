# Premissas do piloto — parâmetros em aberto no plano

> **Versão:** 0.1 · **Data:** 2026-11-24 · Insumo do piloto (item 41 do design, resposta à Q3). Todos os valores abaixo são **premissa** do v0, adotados onde o Plano 2.6 Cobrança deixa o parâmetro em aberto. Valem para o seed fictício e para as regras do app até validação com a Coordenação de Cobrança.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial |

| # | Parâmetro | Premissa | Onde o plano deixa em aberto | GAP | RF afetados (Plan) |
|---|---|---|---|---|---|
| P1 | Ciclo de qualificação | **premissa:** mensal | F1, risco "frequência do ciclo indefinida" | GAP-001 | RF-MOD-F1-001, RF-MOD-F2-003, RF-MOD-F2-004 |
| P2 | Desempate massificada × qualificada | **premissa:** maior débito, depois o mais antigo | F2, risco "regra de desempate indefinida" | GAP-002 | RF-MOD-F2-003 |
| P3 | Grupo de controle | **premissa:** 10% da carteira por ciclo | F2, risco "tamanho do grupo de controle a confirmar" | GAP-003 | RF-MOD-F2-004, RF-MOD-F6-004 |
| P4 | Fallback de canal | **premissa:** SNE → e-mail → SMS | F4, risco "ordem de fallback entre canais a confirmar" | GAP-004 | RF-MOD-F4-004 |
| P5 | Dossiê | **premissa:** 3 níveis — (1) débitos e parcelamentos; (2) comunicações, interações e regularizações; (3) score e sinalizações coercitivas | F5, risco "níveis do dossiê a confirmar" | GAP-005 | RF-MOD-F5-003, RF-MOD-F5-004 |

A `spec-product` registra cada valor como `RN` com origem "premissa" no Plan.
