# Fio condutor do v0 — RF com lógica completa

> **Versão:** 0.1 · **Data:** 2026-11-24 · Insumo do piloto (item 40 do design, meta M1). Os RF abaixo ganham business rule, flow quando couber, ACL, ATF e G3 com LLM; as stories que os cobrem levam o label `fio-condutor`. IDs conforme `inputs/de-para-ids.md`.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial |

| # | Tema | RF (Plan) | RF (Explore) | CT (Plan) | RN (Explore) | Telas |
|---|---|---|---|---|---|---|
| 1 | F2 · critério versionado e imutável após publicação; editar cria nova versão | RF-MOD-F2-002 | RF-202 | CT-MOD-F2-002 | RN-003 | TEL-007, TEL-008 |
| 2 | F2 · grupo de controle sorteado por ciclo, fora das ações de cobrança | RF-MOD-F2-004 | RF-204 | CT-MOD-F2-003 | RN-009 | TEL-009, TEL-010 |
| 3 | F2 · fallback "sem score": sem score a segmentação usa só critérios determinísticos e marca o contribuinte | RF-MOD-F2-005 | RF-205 | CT-MOD-F2-004 | RN-013 | TEL-009, TEL-010 |
| 4 | F5 · dossiê consolidado do caso | RF-MOD-F5-003 | RF-503 | CT-MOD-F5-003 | RN-001, RN-017 | TEL-024 |
| 5 | F5 · ACL "atendente vê só a própria carteira" | RF-MOD-F5-007 | RF-507 | CT-MOD-F5-006 | RN-011 | TEL-023, TEL-024 |

**Fora do fio condutor:** os demais 41 RF entram como tabela, form, list, menu, role e seed (níveis N1/N2 da matriz de rastreio).
