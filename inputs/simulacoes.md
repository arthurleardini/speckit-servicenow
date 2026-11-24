# Integrações simuladas (SIM-) — piloto 2.6 Cobrança

> **Versão:** 0.1 · **Data:** 2026-11-24 · Insumo do piloto (item 39 do design, decisão A8). App `x_2326104_cob`. Todo registro destas tabelas é **dado fictício** gerado pelo `sn-seed`.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial |

## Regras comuns

- Cada integração externa do plano vira tabela do app com seed fictício. Nenhuma chamada sai da instância.
- Form e list das tabelas `SIM-` levam o rótulo **"Simulado"** (label da tabela termina em "(Simulado)" e o form abre com anotação "Simulado").
- Issues de story que tocam essas tabelas levam o label `sn:simulation`; tasks levam `snArtifact.kind = simulation`.
- O modelo completo das colunas está em `outputs/explore/modelo-de-dados.md` e em `outputs/spec/data-model.previa.json`.

| ID | Integração real (plano) | Tabela(s) simuladas | RF atendidos (Plan) |
|---|---|---|---|
| SIM-01 | Score de liquidez da UFMT (API ou arquivo, a definir) | `x_2326104_cob_score_sim` | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-005, RF-MOD-F2-005 |
| SIM-02 | Canais de envio: e-mail, SMS, SNE; WhatsApp condicionado | `x_2326104_cob_envio_sim`, `x_2326104_cob_canal_sim` | RF-MOD-F4-002, RF-MOD-F4-004, RF-MOD-F4-005, RF-MOD-F4-006 |
| SIM-03 | Fontes de débito: CCF, MPI/Big Data, IPVA, ITCD, SNE | `x_2326104_cob_debito_stg` + campo `origem` em `x_2326104_cob_debito` | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-006, RF-MOD-F1-007 |

## SIM-01 — Score UFMT

Tabela `x_2326104_cob_score_sim` (label "Score de liquidez (Simulado)").

| Comportamento | Como o seed exercita |
|---|---|
| Score por contribuinte, com versão do modelo e data de ingestão | 1 linha por contribuinte com score; `versao_modelo` = `sim-v1` |
| Escala | 0 a 100 (`decimal`), só para simulação; escala real em aberto (GAP-008) |
| Fração "sem score" para o fallback | 20% dos contribuintes ficam sem linha válida: `status = sem_score` ou `invalido`. A qualificação marca `sem_score = true` e usa só critérios determinísticos (RN-013) |
| Cobertura por tributo | campo `tributo`; o report da TEL-011 agrupa por tributo e status |
| Indisponibilidade total do modelo | marcar as linhas da versão com `status = invalido`; toda a carteira cai em fallback (CT-MOD-F3-003) |

## SIM-02 — Envio por canal

Tabela `x_2326104_cob_envio_sim` (label "Retorno de envio (Simulado)"): uma linha por tentativa de envio de uma `x_2326104_cob_comunicacao`.

| Coluna | Valores |
|---|---|
| `canal` | `email`, `sms`, `sne`, `whatsapp` |
| `status_retorno` | `entregue`, `falha`, `recusado_sem_optin` |
| `codigo_retorno` | texto curto simulado (`OK`, `TIMEOUT`, `CAIXA_CHEIA`) |

Tabela `x_2326104_cob_canal_sim` (label "Canal de envio (Simulado)"): uma linha por canal, com o **interruptor de falha**.

| Coluna | Uso |
|---|---|
| `canal` | um dos 4 canais |
| `contratado` | `true` para e-mail, SMS e SNE; `false` para WhatsApp (contrato em aberto, GAP-009) |
| `forcar_falha` | interruptor: `true` faz todo envio do canal voltar `falha` (CT-MOD-F4-004) |
| `exige_opt_in` | `true` só para WhatsApp: sem opt-in vigente em `x_2326104_cob_consentimento` o envio volta `recusado_sem_optin` e a comunicação fica `pulado` (CT-MOD-F4-003) |

Seed: falha de entrega plantada (≈5% das comunicações) e 1 comunicação de WhatsApp pulada por falta de opt-in.

## SIM-03 — Fontes de débito

- `x_2326104_cob_debito.origem`: choice com 5 valores — `ccf` (CCF), `mpi_bigdata` (MPI/Big Data), `ipva` (IPVA), `itcd` (ITCD), `sne` (SNE).
- Staging `x_2326104_cob_debito_stg` (label "Staging de fontes (Simulado)"): linhas como chegariam da fonte, com `cpf`/`cnpj` fictícios, `processado` e `falha_simulada`. A consolidação lê o staging, vincula ao contribuinte e grava `x_2326104_cob_debito`; documento inválido vai para `x_2326104_cob_rejeicao`.
- Cada execução grava uma linha em `x_2326104_cob_sincronizacao` (fonte, status, volume, rejeitados).
- Inconsistências plantadas no seed: documento sobreposto entre duas fontes (mesmo CNPJ fictício em CCF e SNE), 1 documento com DV inválido e 1 fonte com `falha_simulada = true` (degradação segura, CT-MOD-F1-005).
