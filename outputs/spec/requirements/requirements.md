# Requisitos Funcionais e Não Funcionais (negócio) — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft
Última atualização: 2026-11-24
Versão: 1.0
Escopo: comportamento observável (RF) e qualidades exigíveis pelo negócio (RNF de negócio).
Fonte: context-map.md (F-xxx), discovery-document.md §4, business-rules.md, product-vision.md, inputs/de-para-ids.md, inputs/fio-condutor.md, inputs/premissas-ficticias.md.

Este documento descreve o que o app Cobrança MT faz, requisito por requisito. Cada requisito tem o ID do Plan (`RF-MOD-F<n>-<nnn>` ou `RF-MOD-T-<nnn>`, conforme `inputs/de-para-ids.md`), o ID do Explore de onde veio, três cenários de aceite (caminho feliz, alternativo e bloqueio), as regras que aplica e o fato de origem. Os 5 requisitos do fio condutor (`inputs/fio-condutor.md`) estão marcados. Todo exemplo usa dado fictício.

> **Nota de escopo:** RNF técnico profundo fica em `tech-rules/` e `hld.md`. Aqui ficam os RNF que o negócio decide.

<!-- spec-check-modular: on -->

<!-- id: reqfun-modules -->

## Índice de módulos e cobertura

| Módulo | Objetivo de negócio | Nº RF planejado | Nº RF escritos | Lacunas (QA) |
|--------|---------------------|-----------------|----------------|---------------|
| MOD-F1 | Juntar os débitos das 5 fontes numa visão única por contribuinte | 7 | 7 (3 Must) | — |
| MOD-F2 | Separar a carteira com critérios versionados e sortear o grupo de controle | 6 | 6 (3 Must) | — |
| MOD-F3 | Usar o score da UFMT na priorização, com fallback | 6 | 6 (2 Must) | — |
| MOD-F4 | Disparar e escalonar comunicações e marcar a origem da regularização | 9 | 9 (4 Must) | — |
| MOD-F5 | Distribuir casos e dar ao atendente fila e dossiê da própria carteira | 7 | 7 (3 Must) | — |
| MOD-F6 | Mostrar funil, KPIs e efeito incremental | 7 | 7 (3 Must) | — |
| MOD-T | Exportação com trilha, busca e filtro, visão única e origem em todos os módulos | 4 | 4 (1 Must) | — |

- IDs e enunciados-base vêm do `inputs/de-para-ids.md`; a numeração preserva a do plano (`F2/RF-03` → `RF-MOD-F2-003`).
- Códigos `MOD-XXX` idênticos ao [`modules.md`](../modules.md).

<!-- id: reqfun-coverage-input -->

## Matriz de cobertura (insumos → RF)

| Referência insumo (doc § / ID / tela) | Descrição curta | RF cobrindo | ou QA |
|---------------------------------------|-----------------|-------------|--------|
| especificacao-funcional.md §3 MOD-F1 RF-101 | Consolidação periódica das 5 fontes | RF-MOD-F1-001 | — |
| especificacao-funcional.md §3 MOD-F1 RF-102 | Vínculo do débito ao contribuinte e sobreposição | RF-MOD-F1-002 | — |
| especificacao-funcional.md §3 MOD-F1 RF-103 | Atualização intraciclo da regularização | RF-MOD-F1-003 | — |
| especificacao-funcional.md §3 MOD-F1 RF-104 | Alerta de parcelamento em risco | RF-MOD-F1-004 | — |
| especificacao-funcional.md §3 MOD-F1 RF-105 | Visão única do contribuinte | RF-MOD-F1-005 | — |
| especificacao-funcional.md §3 MOD-F1 RF-106 | Transição MPI → Big Data sem ruptura | RF-MOD-F1-006 | — |
| especificacao-funcional.md §3 MOD-F1 RF-107 | Status de cada integração | RF-MOD-F1-007 | — |
| especificacao-funcional.md §3 MOD-F2 RF-201 | Parametrização de critérios | RF-MOD-F2-001 | — |
| especificacao-funcional.md §3 MOD-F2 RF-202 | Versionamento imutável do critério | RF-MOD-F2-002 | — |
| especificacao-funcional.md §3 MOD-F2 RF-203 | Segmentação massificada × qualificada | RF-MOD-F2-003 | — |
| especificacao-funcional.md §3 MOD-F2 RF-204 | Sorteio do grupo de controle por ciclo | RF-MOD-F2-004 | — |
| especificacao-funcional.md §3 MOD-F2 RF-205 | Score como critério com fallback | RF-MOD-F2-005 | — |
| especificacao-funcional.md §3 MOD-F2 RF-206 | Prévia da carteira antes de publicar | RF-MOD-F2-006 | — |
| especificacao-funcional.md §3 MOD-F3 RF-301 | Ingestão e normalização do score | RF-MOD-F3-001 | — |
| especificacao-funcional.md §3 MOD-F3 RF-302 | Score como variável de priorização | RF-MOD-F3-002 | — |
| especificacao-funcional.md §3 MOD-F3 RF-303 | Score no dossiê | RF-MOD-F3-003 | — |
| especificacao-funcional.md §3 MOD-F3 RF-304 | Atualização periódica do score | RF-MOD-F3-004 | — |
| especificacao-funcional.md §3 MOD-F3 RF-305 | Fallback determinístico sem score | RF-MOD-F3-005 | — |
| especificacao-funcional.md §3 MOD-F3 RF-306 | Cobertura e qualidade do score | RF-MOD-F3-006 | — |
| especificacao-funcional.md §3 MOD-F4 RF-401 | Editor de régua | RF-MOD-F4-001 | — |
| especificacao-funcional.md §3 MOD-F4 RF-402 | Disparo automático | RF-MOD-F4-002 | — |
| especificacao-funcional.md §3 MOD-F4 RF-403 | Escalonamento por comportamento | RF-MOD-F4-003 | — |
| especificacao-funcional.md §3 MOD-F4 RF-404 | Multicanal com fallback | RF-MOD-F4-004 | — |
| especificacao-funcional.md §3 MOD-F4 RF-405 | Opt-in e opt-out por canal | RF-MOD-F4-005 | — |
| especificacao-funcional.md §3 MOD-F4 RF-406 | Status de entrega e reenvio | RF-MOD-F4-006 | — |
| especificacao-funcional.md §3 MOD-F4 RF-407 | Origem da regularização | RF-MOD-F4-007 | — |
| especificacao-funcional.md §3 MOD-F4 RF-408 | Efetividade da régua | RF-MOD-F4-008 | — |
| especificacao-funcional.md §3 MOD-F4 RF-409 | Encaminhamento à cobrança qualificada | RF-MOD-F4-009 | — |
| especificacao-funcional.md §3 MOD-F5 RF-501 | Distribuição automática de casos | RF-MOD-F5-001 | — |
| especificacao-funcional.md §3 MOD-F5 RF-502 | Fila priorizada do atendente | RF-MOD-F5-002 | — |
| especificacao-funcional.md §3 MOD-F5 RF-503 | Dossiê consolidado do caso | RF-MOD-F5-003 | — |
| especificacao-funcional.md §3 MOD-F5 RF-504 | Sinalização de medida coercitiva | RF-MOD-F5-004 | — |
| especificacao-funcional.md §3 MOD-F5 RF-505 | Registro estruturado de interações | RF-MOD-F5-005 | — |
| especificacao-funcional.md §3 MOD-F5 RF-506 | Encerramento por regularização | RF-MOD-F5-006 | — |
| especificacao-funcional.md §3 MOD-F5 RF-507 | Visão restrita do atendente | RF-MOD-F5-007 | — |
| especificacao-funcional.md §3 MOD-F6 RF-601 | Funil do crédito | RF-MOD-F6-001 | — |
| especificacao-funcional.md §3 MOD-F6 RF-602 | KPIs com metas | RF-MOD-F6-002 | — |
| especificacao-funcional.md §3 MOD-F6 RF-603 | Origem da regularização no monitoramento | RF-MOD-F6-003 | — |
| especificacao-funcional.md §3 MOD-F6 RF-604 | Efeito incremental por ciclo | RF-MOD-F6-004 | — |
| especificacao-funcional.md §3 MOD-F6 RF-605 | IPVA e ITCD no monitoramento | RF-MOD-F6-005 | — |
| especificacao-funcional.md §3 MOD-F6 RF-606 | Visões por perfil | RF-MOD-F6-006 | — |
| especificacao-funcional.md §3 MOD-F6 RF-607 | Insumos para revisão da estratégia | RF-MOD-F6-007 | — |
| especificacao-funcional.md §3 MOD-T RF-901 | Exportação com trilha | RF-MOD-T-001 | — |
| especificacao-funcional.md §3 MOD-T RF-902 | Busca e filtro padronizados | RF-MOD-T-002 | — |
| especificacao-funcional.md §3 MOD-T RF-903 | Visão única do contribuinte (transversal) | RF-MOD-T-003 | — |
| especificacao-funcional.md §3 MOD-T RF-904 | Marcação de origem da regularização (transversal) | RF-MOD-T-004 | — |
| especificacao-funcional.md §3 MOD-F1 RN-001 | Visão única do contribuinte por documento (regra) | RF-MOD-F1-001 via RN-NOVO-F1-001 | — |
| especificacao-funcional.md §3 MOD-F1 RN-002 | Regularização dentro do ciclo encerra a abordagem (regra) | RF-MOD-F1-003 via RN-NOVO-F1-002 | — |
| especificacao-funcional.md §3 MOD-F1 RN-012 | Troca de MPI por Big Data sem ruptura da carteira (regra) | RF-MOD-F1-006 via RN-NOVO-F1-003 | — |
| especificacao-funcional.md §3 MOD-F1 RN-014 | Documento inválido é rejeitado e registrado (regra) | RF-MOD-F1-002 via RN-NOVO-F1-004 | — |
| especificacao-funcional.md §3 MOD-F2 RN-003 | Versão publicada do critério é imutável (regra) | RF-MOD-F2-001 via RN-NOVO-F2-001 | — |
| especificacao-funcional.md §3 MOD-F2 RN-003 | Ciclo publicado guarda a versão aplicada (regra) | RF-MOD-F2-002 via RN-NOVO-F2-002 | — |
| especificacao-funcional.md §3 MOD-F2 RN-004 | Segmentação entre massificada e qualificada (regra) | RF-MOD-F2-001 via RN-NOVO-F2-003 | — |
| especificacao-funcional.md §3 MOD-F2 RN-009 | Grupo de controle sorteado por ciclo e fora das ações (regra) | RF-MOD-F2-004 via RN-NOVO-F2-005 | — |
| especificacao-funcional.md §3 MOD-F3 RN-013 | Score como variável com threshold configurável (regra) | RF-MOD-F3-002 via RN-NOVO-F3-001 | — |
| especificacao-funcional.md §3 MOD-F3 RN-013 | Fallback sem score (regra) | RF-MOD-F2-005 via RN-NOVO-F3-002 | — |
| especificacao-funcional.md §3 MOD-F3 RN-015 | O modelo de score é da UFMT (regra) | RF-MOD-F3-001 via RN-NOVO-F3-003 | — |
| especificacao-funcional.md §3 MOD-F4 RN-005 | Escalonamento conforme o comportamento (regra) | RF-MOD-F4-002 via RN-NOVO-F4-001 | — |
| especificacao-funcional.md §3 MOD-F4 RN-006 | Opt-in vigente para canal com consentimento (regra) | RF-MOD-F4-004 via RN-NOVO-F4-003 | — |
| especificacao-funcional.md §3 MOD-F4 RN-008 | Toda regularização é marcada pela origem (regra) | RF-MOD-F4-007 via RN-NOVO-F4-006 | — |
| especificacao-funcional.md §3 MOD-F4 RN-016 | Janela de atribuição de 30 dias (regra) | RF-MOD-F4-007 via RN-NOVO-F4-007 | — |
| especificacao-funcional.md §3 MOD-F4 RN-004 | Esgotou a régua sem regularizar vai para a qualificada (regra) | RF-MOD-F4-009 via RN-NOVO-F4-008 | — |
| especificacao-funcional.md §3 MOD-F5 RN-007 | Distribuição por vínculo, balanceamento e prioridade (regra) | RF-MOD-F5-001 via RN-NOVO-F5-001 | — |
| especificacao-funcional.md §3 MOD-F5 RN-017 | Dossiê sinaliza medida coercitiva, não executa (regra) | RF-MOD-F5-004 via RN-NOVO-F5-004 | — |
| especificacao-funcional.md §3 MOD-F5 RN-010 | Ação relevante registrada com ator, data e resultado (regra) | RF-MOD-F5-005 via RN-NOVO-F5-005 | — |
| especificacao-funcional.md §3 MOD-F5 RN-011 | Atendente vê só a própria carteira (regra) | RF-MOD-F5-007 via RN-NOVO-F5-007 | — |
| especificacao-funcional.md §3 MOD-F6 RN-009 | Efeito incremental do ciclo (regra) | RF-MOD-F6-004 via RN-NOVO-F6-001 | — |
| premissas-ficticias.md §P1 | premissa do piloto | RF-MOD-F1-001, RF-MOD-F2-003, RF-MOD-F2-004 via RN-NOVO-F1-006 | — |
| premissas-ficticias.md §P2 | premissa do piloto | RF-MOD-F2-003 via RN-NOVO-F2-004 | — |
| premissas-ficticias.md §P3 | premissa do piloto | RF-MOD-F2-004, RF-MOD-F6-004 via RN-NOVO-F2-006 | — |
| premissas-ficticias.md §P4 | premissa do piloto | RF-MOD-F4-004 via RN-NOVO-F4-004 | — |
| premissas-ficticias.md §P5 | premissa do piloto | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F3-003 via RN-NOVO-F5-003 | — |
| especificacao-funcional.md §2 TEL-001 | Integrações e sincronização | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 | — |
| especificacao-funcional.md §2 TEL-002 | Log de rejeições | RF-MOD-F1-002 | — |
| especificacao-funcional.md §2 TEL-003 | Carteira consolidada | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 | — |
| especificacao-funcional.md §2 TEL-004 | Visão única do contribuinte | RF-MOD-F1-005, RF-MOD-T-003 | — |
| especificacao-funcional.md §2 TEL-005 | Parcelamentos em risco | RF-MOD-F1-004 | — |
| especificacao-funcional.md §2 TEL-006 | Staging de fontes (Simulado) | RF-MOD-F1-001, RF-MOD-F1-002 | — |
| especificacao-funcional.md §2 TEL-007 | Critérios de qualificação | RF-MOD-F2-001, RF-MOD-F2-002 | — |
| especificacao-funcional.md §2 TEL-008 | Versão do critério de qualificação | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 | — |
| especificacao-funcional.md §2 TEL-009 | Ciclo de qualificação (prévia) | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 | — |
| especificacao-funcional.md §2 TEL-010 | Carteira segmentada | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 | — |
| especificacao-funcional.md §2 TEL-011 | Painel do score de liquidez | RF-MOD-F3-006 | — |
| especificacao-funcional.md §2 TEL-012 | Scores ingeridos (Simulado) | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 | — |
| especificacao-funcional.md §2 TEL-013 | Réguas de cobrança | RF-MOD-F4-001 | — |
| especificacao-funcional.md §2 TEL-014 | Editor de régua | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 | — |
| especificacao-funcional.md §2 TEL-015 | Execução e status de disparo | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 | — |
| especificacao-funcional.md §2 TEL-016 | Efetividade da régua | RF-MOD-F4-008 | — |
| especificacao-funcional.md §2 TEL-017 | Consentimentos por canal | RF-MOD-F4-005 | — |
| especificacao-funcional.md §2 TEL-018 | Canais de envio (Simulado) | RF-MOD-F4-004, RF-MOD-F4-005 | — |
| especificacao-funcional.md §2 TEL-019 | Retorno de envio (Simulado) | RF-MOD-F4-006 | — |
| especificacao-funcional.md §2 TEL-020 | Regularizações | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 | — |
| especificacao-funcional.md §2 TEL-021 | Distribuição da carteira qualificada | RF-MOD-F5-001 | — |
| especificacao-funcional.md §2 TEL-022 | Carga por atendente | RF-MOD-F5-001 | — |
| especificacao-funcional.md §2 TEL-023 | Minha fila | RF-MOD-F5-002, RF-MOD-F5-007 | — |
| especificacao-funcional.md §2 TEL-024 | Dossiê do caso | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 | — |
| especificacao-funcional.md §2 TEL-025 | Registro de interação | RF-MOD-F5-005 | — |
| especificacao-funcional.md §2 TEL-026 | Funil do crédito | RF-MOD-F6-001, RF-MOD-F6-007 | — |
| especificacao-funcional.md §2 TEL-027 | Regularizações por tributo | RF-MOD-F6-002, RF-MOD-F6-005, RF-MOD-F6-007 | — |
| especificacao-funcional.md §2 TEL-028 | Regularizações por origem e canal | RF-MOD-F6-003, RF-MOD-F6-007 | — |
| especificacao-funcional.md §2 TEL-029 | Efeito incremental por ciclo | RF-MOD-F6-004 | — |
| especificacao-funcional.md §2 TEL-030 | Metas de KPI | RF-MOD-F6-002, RF-MOD-F6-005 | — |
| especificacao-funcional.md §2 TEL-031 | Meus indicadores | RF-MOD-F6-006 | — |
| especificacao-funcional.md §2 TEL-032 | Contribuintes | RF-MOD-T-002, RF-MOD-T-003 | — |
| especificacao-funcional.md §2 TEL-033 | Trilha de exportação | RF-MOD-T-001 | — |
| de-para-ids.md §2 (F4 RF-10 do refinado) | bloqueio de template com campo sob sigilo em canal não autenticado | — | QA-01 (GAP-017) |

<!-- id: reqfun-tobe -->

## Visão TO-BE de negócio (delta vs. AS-IS)

| Domínio | Estado AS-IS (legacy.md § ou fonte) | Estado TO-BE (capacidade de negócio) | Delta principal | RFs envolvidos |
|---------|-------------------------------------|--------------------------------------|-----------------|----------------|
| Carteira | débitos em 5 fontes sem visão única (F-020, F-027) | carteira consolidada por contribuinte, com sobreposição marcada e atualização no ciclo | visão única e degradação segura | RF-MOD-F1-001 a RF-MOD-F1-007, RF-MOD-T-003 |
| Qualificação | sem critério versionado nem grupo de controle (F-032, F-034) | critério versionado e imutável, prévia, sorteio do controle por ciclo | rastreio da regra que formou cada carteira | RF-MOD-F2-001 a RF-MOD-F2-006 |
| Score | modelo da UFMT sem data (F-134) | score usado quando existe; fallback marcado quando falta | qualificação não para | RF-MOD-F3-001 a RF-MOD-F3-006, RF-MOD-F2-005 |
| Régua | disparo com confirmação manual em lote (F-049) | disparo e escalonamento automáticos, opt-in respeitado, origem marcada | sem lote manual | RF-MOD-F4-001 a RF-MOD-F4-009, RF-MOD-T-004 |
| Atendimento | distribuição sem sistema (F-061) | distribuição automática, fila priorizada, dossiê, visão só da própria carteira | fim da planilha | RF-MOD-F5-001 a RF-MOD-F5-007 |
| Monitoramento | sem efeito incremental medido (F-075) | funil, KPIs com metas e efeito incremental por ciclo | efeito causal medido | RF-MOD-F6-001 a RF-MOD-F6-007 |

<!-- id: reqfun-traceability -->

## Rastreabilidade global (RF / RNF)

| ID | Tipo | Módulo | Domínio / categoria | Legacy / benchmark / vision | Fato fonte (F-xxx) |
|----|------|--------|---------------------|----------------------------|---------------------|
| RF-MOD-F1-001 | RF | MOD-F1 | Consolidação periódica das 5 fontes | Explore RF-101; product-vision §8 | F-020, F-004, F-105, F-107, F-109 |
| RF-MOD-F1-002 | RF | MOD-F1 | Vínculo do débito ao contribuinte e sobreposição | Explore RF-102; product-vision §8 | F-021, F-004, F-104, F-108 |
| RF-MOD-F1-003 | RF | MOD-F1 | Atualização intraciclo da regularização | Explore RF-103; product-vision §8 | F-022, F-004, F-106 |
| RF-MOD-F1-004 | RF | MOD-F1 | Alerta de parcelamento em risco | Explore RF-104; product-vision §8 | F-023, F-004 |
| RF-MOD-F1-005 | RF | MOD-F1 | Visão única do contribuinte | Explore RF-105; product-vision §8 | F-024, F-004 |
| RF-MOD-F1-006 | RF | MOD-F1 | Transição MPI → Big Data sem ruptura | Explore RF-106; product-vision §8 | F-025, F-004 |
| RF-MOD-F1-007 | RF | MOD-F1 | Status de cada integração | Explore RF-107; product-vision §8 | F-026, F-004 |
| RF-MOD-F2-001 | RF | MOD-F2 | Parametrização de critérios | Explore RF-201; product-vision §8 | F-031, F-005, F-110 |
| RF-MOD-F2-002 | RF | MOD-F2 | Versionamento imutável do critério | Explore RF-202; product-vision §8 | F-032, F-005, F-015 |
| RF-MOD-F2-003 | RF | MOD-F2 | Segmentação massificada × qualificada | Explore RF-203; product-vision §8 | F-033, F-005, F-111, F-112 |
| RF-MOD-F2-004 | RF | MOD-F2 | Sorteio do grupo de controle por ciclo | Explore RF-204; product-vision §8 | F-034, F-005 |
| RF-MOD-F2-005 | RF | MOD-F2 | Score como critério com fallback | Explore RF-205; product-vision §8 | F-035, F-005 |
| RF-MOD-F2-006 | RF | MOD-F2 | Prévia da carteira antes de publicar | Explore RF-206; product-vision §8 | F-036, F-005 |
| RF-MOD-F3-001 | RF | MOD-F3 | Ingestão e normalização do score | Explore RF-301; product-vision §8 | F-040, F-006, F-113 |
| RF-MOD-F3-002 | RF | MOD-F3 | Score como variável de priorização | Explore RF-302; product-vision §8 | F-041, F-006 |
| RF-MOD-F3-003 | RF | MOD-F3 | Score no dossiê | Explore RF-303; product-vision §8 | F-042, F-006 |
| RF-MOD-F3-004 | RF | MOD-F3 | Atualização periódica do score | Explore RF-304; product-vision §8 | F-043, F-006 |
| RF-MOD-F3-005 | RF | MOD-F3 | Fallback determinístico sem score | Explore RF-305; product-vision §8 | F-044, F-006 |
| RF-MOD-F3-006 | RF | MOD-F3 | Cobertura e qualidade do score | Explore RF-306; product-vision §8 | F-045, F-006 |
| RF-MOD-F4-001 | RF | MOD-F4 | Editor de régua | Explore RF-401; product-vision §8 | F-048, F-007, F-114, F-115 |
| RF-MOD-F4-002 | RF | MOD-F4 | Disparo automático | Explore RF-402; product-vision §8 | F-049, F-007, F-116 |
| RF-MOD-F4-003 | RF | MOD-F4 | Escalonamento por comportamento | Explore RF-403; product-vision §8 | F-050, F-007 |
| RF-MOD-F4-004 | RF | MOD-F4 | Multicanal com fallback | Explore RF-404; product-vision §8 | F-051, F-007, F-118 |
| RF-MOD-F4-005 | RF | MOD-F4 | Opt-in e opt-out por canal | Explore RF-405; product-vision §8 | F-052, F-007, F-119 |
| RF-MOD-F4-006 | RF | MOD-F4 | Status de entrega e reenvio | Explore RF-406; product-vision §8 | F-053, F-007, F-117 |
| RF-MOD-F4-007 | RF | MOD-F4 | Origem da regularização | Explore RF-407; product-vision §8 | F-054, F-007, F-120 |
| RF-MOD-F4-008 | RF | MOD-F4 | Efetividade da régua | Explore RF-408; product-vision §8 | F-055, F-007 |
| RF-MOD-F4-009 | RF | MOD-F4 | Encaminhamento à cobrança qualificada | Explore RF-409; product-vision §8 | F-056, F-007 |
| RF-MOD-F5-001 | RF | MOD-F5 | Distribuição automática de casos | Explore RF-501; product-vision §8 | F-061, F-008, F-121, F-015 |
| RF-MOD-F5-002 | RF | MOD-F5 | Fila priorizada do atendente | Explore RF-502; product-vision §8 | F-062, F-008 |
| RF-MOD-F5-003 | RF | MOD-F5 | Dossiê consolidado do caso | Explore RF-503; product-vision §8 | F-063, F-008, F-019 |
| RF-MOD-F5-004 | RF | MOD-F5 | Sinalização de medida coercitiva | Explore RF-504; product-vision §8 | F-064, F-008 |
| RF-MOD-F5-005 | RF | MOD-F5 | Registro estruturado de interações | Explore RF-505; product-vision §8 | F-065, F-008, F-122 |
| RF-MOD-F5-006 | RF | MOD-F5 | Encerramento por regularização | Explore RF-506; product-vision §8 | F-066, F-008 |
| RF-MOD-F5-007 | RF | MOD-F5 | Visão restrita do atendente | Explore RF-507; product-vision §8 | F-067, F-008, F-014, F-016 |
| RF-MOD-F6-001 | RF | MOD-F6 | Funil do crédito | Explore RF-601; product-vision §8 | F-072, F-009, F-019 |
| RF-MOD-F6-002 | RF | MOD-F6 | KPIs com metas | Explore RF-602; product-vision §8 | F-073, F-009, F-123 |
| RF-MOD-F6-003 | RF | MOD-F6 | Origem da regularização no monitoramento | Explore RF-603; product-vision §8 | F-074, F-009 |
| RF-MOD-F6-004 | RF | MOD-F6 | Efeito incremental por ciclo | Explore RF-604; product-vision §8 | F-075, F-009 |
| RF-MOD-F6-005 | RF | MOD-F6 | IPVA e ITCD no monitoramento | Explore RF-605; product-vision §8 | F-076, F-009 |
| RF-MOD-F6-006 | RF | MOD-F6 | Visões por perfil | Explore RF-606; product-vision §8 | F-077, F-009 |
| RF-MOD-F6-007 | RF | MOD-F6 | Insumos para revisão da estratégia | Explore RF-607; product-vision §8 | F-078, F-009 |
| RF-MOD-T-001 | RF | MOD-T | Exportação com trilha | Explore RF-901; product-vision §8 | F-079, F-010, F-124 |
| RF-MOD-T-002 | RF | MOD-T | Busca e filtro padronizados | Explore RF-902; product-vision §8 | F-080, F-010, F-018 |
| RF-MOD-T-003 | RF | MOD-T | Visão única do contribuinte (transversal) | Explore RF-903; product-vision §8 | F-081, F-010 |
| RF-MOD-T-004 | RF | MOD-T | Marcação de origem da regularização (transversal) | Explore RF-904; product-vision §8 | F-082, F-010 |
| RNF-SEGURANCA-002 | RNF | — | qualidade de negócio | product-vision §7 | F-016, F-070, F-145 |
| RNF-SEGURANCA-001 | RNF | — | qualidade de negócio | product-vision §7 | F-089, F-125, F-170 |
| RNF-SEGURANCA-003 | RNF | — | qualidade de negócio | product-vision §7 | F-069, F-079 |
| RNF-DESEMPENHO-001 | RNF | — | qualidade de negócio | product-vision §7 | F-072, F-153 |
| RNF-CONFIABILIDADE-002 | RNF | — | qualidade de negócio | product-vision §7 | F-020, F-140, F-165, F-169 |
| RNF-CONFIABILIDADE-001 | RNF | — | qualidade de negócio | product-vision §7 | F-088, F-090 |
| RNF-MANUTENIBILIDADE-001 | RNF | — | qualidade de negócio | product-vision §7 | F-085, F-090 |
| RNF-USABILIDADE-001 | RNF | — | qualidade de negócio | product-vision §7 | F-017, F-086 |

---

<!-- id: rf -->

## Requisitos funcionais por módulo

## Módulo: Ingestão e Carteira Consolidada (`MOD-F1`)

### RF-MOD-F1-001: Consolidação periódica das 5 fontes

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Consolidação periódica das 5 fontes  
**ID no Explore:** RF-101 · **Telas:** TEL-001, TEL-003, TEL-006 · **Critérios do plano:** CT-MOD-F1-001, CT-MOD-F1-005

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que os débitos das 5 fontes sejam consolidados a cada ciclo,
para que eu possa trabalhar sobre uma carteira única e atualizada.

**Enunciado EARS *(1 padrão)*:** QUANDO começa um ciclo de consolidação, o sistema DEVE ler as linhas das 5 fontes (CCF, MPI/Big Data, IPVA, ITCD, SNE) e gravar cada débito com a fonte de origem.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Consolidação com origem registrada
  Dado que há linhas novas de CCF e SNE na área de entrada das fontes
  Quando a consolidação do ciclo 2027-01 roda
  Então cada linha vira um débito com «Origem» igual à fonte, ligado ao contribuinte, e a execução de sincronização registra o volume por fonte

Cenário 2: Fonte sem linhas novas
  Dado que a fonte ITCD não tem linhas novas
  Quando a consolidação roda
  Então a execução da ITCD fica «sucesso» com volume 0 e as demais fontes são consolidadas

Cenário 3: Fonte com falha não trava as demais
  Dado que a fonte IPVA está com falha simulada ligada
  Quando a consolidação roda
  Então a execução do IPVA fica «falha» com a mensagem do erro e os débitos das outras 4 fontes são gravados
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-001, RN-NOVO-F1-005, RN-NOVO-F1-006, RN-NOVO-T-002  
**Dependências:** —  
**Rastreabilidade:** F-020, F-004, F-105, F-107, F-109 (Explore RF-101)  
**Notas:** —

---

### RF-MOD-F1-002: Vínculo do débito ao contribuinte e sobreposição

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Vínculo do débito ao contribuinte e sobreposição  
**ID no Explore:** RF-102 · **Telas:** TEL-002, TEL-003, TEL-006 · **Critérios do plano:** CT-MOD-F1-002

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que cada débito seja ligado ao contribuinte pelo CPF ou CNPJ,
para que eu possa ver todos os débitos de um contribuinte juntos, sem duplicidade escondida.

**Enunciado EARS *(1 padrão)*:** QUANDO uma linha da fonte é consolidada, o sistema DEVE ligar o débito ao contribuinte do mesmo CPF ou CNPJ e marcar como sobrepostos os débitos repetidos entre fontes.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Documento já cadastrado
  Dado que existe o contribuinte fictício «Comércio Alfa Ltda» com CNPJ fictício cadastrado
  Quando chega um débito de SNE com esse CNPJ
  Então o débito fica ligado a «Comércio Alfa Ltda»

Cenário 2: Sobreposição entre fontes
  Dado que o mesmo débito do contribuinte já veio da CCF
  Quando chega o mesmo débito (tributo e vencimento iguais) pela SNE
  Então os dois débitos ficam com «Sobreposto entre fontes» marcado

Cenário 3: Documento inválido
  Dado que a linha da fonte tem CNPJ com dígito verificador inválido
  Quando a consolidação roda
  Então o débito não é gravado e o log de rejeições mostra a linha com motivo «Documento inválido»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-001, RN-NOVO-F1-004, RN-NOVO-T-002  
**Dependências:** RF-MOD-F1-001  
**Rastreabilidade:** F-021, F-004, F-104, F-108 (Explore RF-102)  
**Notas:** —

---

### RF-MOD-F1-003: Atualização intraciclo da regularização

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Atualização intraciclo da regularização  
**ID no Explore:** RF-103 · **Telas:** TEL-003 · **Critérios do plano:** CT-MOD-F1-003

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que regularizações e parcelamentos sejam atualizados dentro do ciclo,
para que eu possa não cobrar quem já pagou.

**Enunciado EARS *(1 padrão)*:** QUANDO um débito muda para regularizado ou parcelado durante o ciclo, o sistema DEVE encerrar as comunicações pendentes do contribuinte.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Regularização encerra a abordagem
  Dado que o contribuinte tem uma comunicação agendada para amanhã
  Quando o débito dele muda para «Regularizado» hoje
  Então a comunicação agendada passa para «Encerrada» e nenhuma etapa nova é agendada

Cenário 2: Parcelamento no meio do ciclo
  Dado que o contribuinte está na etapa 2 da régua
  Quando ele parcela o débito
  Então a régua dele para e o débito fica «Parcelado»

Cenário 3: Regularização parcial
  Dado que o contribuinte tem 2 débitos em aberto
  Quando só 1 deles é regularizado
  Então as comunicações continuam para o débito que segue em aberto
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-002  
**Dependências:** RF-MOD-F1-001  
**Rastreabilidade:** F-022, F-004, F-106 (Explore RF-103)  
**Notas:** —

---

### RF-MOD-F1-004: Alerta de parcelamento em risco

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Alerta de parcelamento em risco  
**ID no Explore:** RF-104 · **Telas:** TEL-005 · **Critérios do plano:** CT-MOD-F1-004

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ser alertado quando um parcelamento tem parcela em atraso,
para que eu possa agir antes do rompimento.

**Enunciado EARS *(1 padrão)*:** QUANDO um parcelamento passa a ter 1 ou mais parcelas em atraso, o sistema DEVE marcar o parcelamento como «Em risco» e ligar o alerta de risco.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Parcela em atraso
  Dado que um parcelamento de 12 parcelas está «Em dia»
  Quando 1 parcela fica em atraso
  Então o status muda para «Em risco» e o alerta de risco fica marcado

Cenário 2: Atraso regularizado
  Dado que um parcelamento está «Em risco» com 1 parcela em atraso
  Quando a parcela é paga
  Então as parcelas em atraso voltam a 0 e o status volta para «Em dia»

Cenário 3: Parcelamento quitado
  Dado que um parcelamento está «Quitado»
  Quando chega atualização com parcela em atraso
  Então o status continua «Quitado» e o alerta não é ligado
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-007  
**Dependências:** RF-MOD-F1-003  
**Rastreabilidade:** F-023, F-004 (Explore RF-104)  
**Notas:** —

---

### RF-MOD-F1-005: Visão única do contribuinte

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Visão única do contribuinte  
**ID no Explore:** RF-105 · **Telas:** TEL-004 · **Critérios do plano:** —

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver numa tela só os débitos, parcelamentos, comunicações e regularizações do contribuinte,
para que eu possa atender sem consultar outros sistemas.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar, no registro do contribuinte, os débitos, parcelamentos, comunicações, consentimentos e regularizações dele.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Visão completa
  Dado que o contribuinte fictício tem débitos na CCF e na SNE
  Quando o atendente vinculado abre o contribuinte
  Então a tela mostra os dados de identificação e as listas de débitos, parcelamentos, comunicações, consentimentos e regularizações

Cenário 2: Contribuinte sem comunicações
  Dado que o contribuinte ainda não recebeu comunicação
  Quando o atendente abre o contribuinte
  Então a lista de comunicações aparece vazia com a mensagem «Nenhum registro»

Cenário 3: Contribuinte de outra carteira
  Dado que o contribuinte é atendido por outro atendente
  Quando o atendente tenta abrir o registro
  Então o sistema não mostra o registro
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-001, RN-NOVO-F5-007  
**Dependências:** RF-MOD-F1-002  
**Rastreabilidade:** F-024, F-004 (Explore RF-105)  
**Notas:** —

---

### RF-MOD-F1-006: Transição MPI → Big Data sem ruptura

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Transição MPI → Big Data sem ruptura  
**ID no Explore:** RF-106 · **Telas:** TEL-001 · **Critérios do plano:** CT-MOD-F1-006

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero trocar a fonte MPI pela Big Data sem perder a carteira,
para que eu possa manter a cobrança em curso durante a troca.

**Enunciado EARS *(1 padrão)*:** QUANDO a fonte MPI é substituída pela Big Data, o sistema DEVE manter os débitos já consolidados ligados aos mesmos contribuintes.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Troca de fonte
  Dado que o ciclo 2027-01 tem 40 débitos de origem MPI/Big Data
  Quando a próxima carga vem da Big Data
  Então os 40 débitos continuam ligados aos mesmos contribuintes e a carteira do ciclo não muda

Cenário 2: Débito novo da Big Data
  Dado que um débito novo chega só pela Big Data
  Quando a consolidação roda
  Então o débito é gravado com origem «MPI/Big Data»

Cenário 3: Débito repetido na troca
  Dado que o mesmo débito chega pela MPI e pela Big Data
  Quando a consolidação roda
  Então o sistema grava um só débito e não cria duplicidade
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-003  
**Dependências:** RF-MOD-F1-001  
**Rastreabilidade:** F-025, F-004 (Explore RF-106)  
**Notas:** —

---

### RF-MOD-F1-007: Status de cada integração

**Épico:** Ingestão e Carteira Consolidada (MOD-F1)  
**Funcionalidade:** Status de cada integração  
**ID no Explore:** RF-107 · **Telas:** TEL-001 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver por fonte a última sincronização, o volume e os erros,
para que eu possa saber se a carteira está completa.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar, para cada execução de sincronização, a fonte, o início, o fim, o status, o volume e o número de rejeitados.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Execuções do ciclo
  Dado que a consolidação do ciclo rodou para as 5 fontes
  Quando o coordenador abre «Integrações e sincronização»
  Então a lista mostra 5 execuções com status, volume e rejeitados

Cenário 2: Fonte com rejeições
  Dado que a SNE teve 1 linha rejeitada
  Quando o coordenador filtra a fonte SNE
  Então a execução mostra «Rejeitados = 1» e a rejeição aparece no log

Cenário 3: Fonte com falha
  Dado que a fonte IPVA falhou
  Quando o coordenador abre a execução
  Então o status é «Falha» e a mensagem explica o erro
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-004, RN-NOVO-F1-005  
**Dependências:** RF-MOD-F1-001  
**Rastreabilidade:** F-026, F-004 (Explore RF-107)  
**Notas:** —

---

## Módulo: Qualificação e Parametrização da Carteira (`MOD-F2`)

### RF-MOD-F2-001: Parametrização de critérios

**Épico:** Qualificação e Parametrização da Carteira (MOD-F2)  
**Funcionalidade:** Parametrização de critérios  
**ID no Explore:** RF-201 · **Telas:** TEL-007, TEL-008 · **Critérios do plano:** CT-MOD-F2-001

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero configurar critérios por valor, tributo, atraso, instrumento e exclusões,
para que eu possa definir quem vai para a cobrança qualificada.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE permitir ao coordenador criar uma versão de critério em rascunho com tributo, valor mínimo, atraso mínimo, instrumento, exclusão de contumazes, uso de score, threshold e percentual do grupo de controle.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Criar critério
  Dado que o coordenador está na lista de critérios
  Quando ele cria «ICMS alto valor» com tributo ICMS Normal, valor mínimo R$ 500.000,00 e atraso mínimo 90 dias
  Então a versão 1 fica em «Rascunho»

Cenário 2: Critério sem score
  Dado que o coordenador cria um critério
  Quando ele deixa «Usar score de liquidez» desmarcado
  Então o campo «Threshold do score» fica desabilitado

Cenário 3: Campo obrigatório ausente
  Dado que o coordenador cria um critério
  Quando ele salva sem o nome
  Então o sistema recusa e mostra «Nome é obrigatório»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F2-001, RN-NOVO-F2-006  
**Dependências:** —  
**Rastreabilidade:** F-031, F-005, F-110 (Explore RF-201)  
**Notas:** —

---

### RF-MOD-F2-002: Versionamento imutável do critério — fio condutor

**Épico:** Qualificação e Parametrização da Carteira (MOD-F2)  
**Funcionalidade:** Versionamento imutável do critério  
**ID no Explore:** RF-202 · **Telas:** TEL-007, TEL-008 · **Critérios do plano:** CT-MOD-F2-002

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que a versão publicada não mude e que editar crie nova versão,
para que eu possa saber sempre qual regra formou cada carteira.

**Enunciado EARS *(1 padrão)*:** SE alguém tenta alterar uma versão publicada do critério, ENTÃO o sistema DEVE recusar a alteração e oferecer «Criar nova versão».

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Publicar versão
  Dado que a versão 1 de «ICMS alto valor» está em «Rascunho»
  Quando o coordenador clica em «Publicar versão»
  Então a versão fica «Publicada» com data e autor, e os campos ficam somente leitura

Cenário 2: Criar nova versão
  Dado que a versão 1 está publicada
  Quando o coordenador clica em «Criar nova versão» e muda o valor mínimo para R$ 300.000,00
  Então nasce a versão 2 em «Rascunho», ligada à versão 1, e a versão 1 continua com R$ 500.000,00

Cenário 3: Alterar versão publicada
  Dado que a versão 2 está publicada
  Quando qualquer usuário, inclusive o administrador, tenta mudar o atraso mínimo
  Então o sistema recusa e mostra «Versão publicada não pode ser alterada. Crie uma nova versão.»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F2-001, RN-NOVO-F2-002  
**Dependências:** RF-MOD-F2-001  
**Rastreabilidade:** F-032, F-005, F-015 (Explore RF-202)  
**Notas:** —

---

### RF-MOD-F2-003: Segmentação massificada × qualificada

**Épico:** Qualificação e Parametrização da Carteira (MOD-F2)  
**Funcionalidade:** Segmentação massificada × qualificada  
**ID no Explore:** RF-203 · **Telas:** TEL-009, TEL-010 · **Critérios do plano:** CT-MOD-F2-001, CT-MOD-F2-005

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que a carteira seja segmentada automaticamente pelos critérios,
para que eu possa separar quem recebe régua de quem recebe atendimento.

**Enunciado EARS *(1 padrão)*:** QUANDO o coordenador gera a prévia de um ciclo, o sistema DEVE classificar cada contribuinte com débito em aberto como massificada ou qualificada pela versão publicada do critério.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Contribuinte qualificado
  Dado que a versão publicada pede ICMS Normal, valor ≥ R$ 500.000,00 e atraso ≥ 90 dias
  Quando um contribuinte tem R$ 820.000,00 de ICMS Normal com 120 dias de atraso
  Então ele entra na carteira qualificada com o motivo da decisão

Cenário 2: Contribuinte massificado
  Dado que mesma versão
  Quando um contribuinte tem R$ 40.000,00 com 200 dias de atraso
  Então ele entra na carteira massificada

Cenário 3: Ciclo sem versão publicada
  Dado que não existe versão publicada do critério
  Quando o coordenador tenta gerar a prévia
  Então o sistema recusa e mostra «Publique uma versão do critério antes de gerar a prévia»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F2-003, RN-NOVO-F2-004, RN-NOVO-F1-006  
**Dependências:** RF-MOD-F2-002  
**Rastreabilidade:** F-033, F-005, F-111, F-112 (Explore RF-203)  
**Notas:** —

---

### RF-MOD-F2-004: Sorteio do grupo de controle por ciclo — fio condutor

**Épico:** Qualificação e Parametrização da Carteira (MOD-F2)  
**Funcionalidade:** Sorteio do grupo de controle por ciclo  
**ID no Explore:** RF-204 · **Telas:** TEL-009, TEL-010 · **Critérios do plano:** CT-MOD-F2-003

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que o grupo de controle seja sorteado a cada ciclo e fique fora das ações,
para que eu possa medir o efeito real da cobrança.

**Enunciado EARS *(1 padrão)*:** QUANDO o coordenador publica um ciclo, o sistema DEVE sortear o grupo de controle entre os elegíveis, gravar a semente do sorteio e excluir os sorteados das réguas e da distribuição.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Sorteio de 10%
  Dado que o ciclo 2027-01 tem 200 elegíveis e a versão pede 10%
  Quando o coordenador publica o ciclo
  Então 20 contribuintes ficam com segmento «Grupo de controle», o ciclo grava a semente e «Grupo de controle = 20»

Cenário 2: Sorteio reproduzível
  Dado que o ciclo foi publicado com uma semente
  Quando o mesmo sorteio é refeito com a mesma semente e os mesmos elegíveis
  Então o resultado é a mesma lista de 20 contribuintes

Cenário 3: Controle fora das ações
  Dado que um contribuinte está no grupo de controle do ciclo
  Quando a régua do ciclo dispara
  Então nenhuma comunicação nem caso é criado para ele
```

**Regras de Negócio aplicáveis:** RN-NOVO-F2-005, RN-NOVO-F2-006, RN-NOVO-F1-006  
**Dependências:** RF-MOD-F2-003  
**Rastreabilidade:** F-034, F-005 (Explore RF-204)  
**Notas:** —

---

### RF-MOD-F2-005: Score como critério com fallback — fio condutor

**Épico:** Qualificação e Parametrização da Carteira (MOD-F2)  
**Funcionalidade:** Score como critério com fallback  
**ID no Explore:** RF-205 · **Telas:** TEL-008, TEL-010 · **Critérios do plano:** CT-MOD-F2-004

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero usar o score de liquidez no critério quando existir,
para que eu possa priorizar quem tem mais chance de pagar sem parar a qualificação quando o score falta.

**Enunciado EARS *(1 padrão)*:** ONDE a versão do critério usa score, o sistema DEVE exigir score válido maior ou igual ao threshold e, sem score válido, aplicar só os critérios determinísticos e marcar o contribuinte «sem score».

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Score acima do threshold
  Dado que a versão usa score com threshold 60
  Quando um contribuinte que atende valor e atraso tem score válido 72
  Então ele entra na carteira qualificada com «Score usado = 72»

Cenário 2: Score abaixo do threshold
  Dado que mesma versão
  Quando o contribuinte tem score válido 41
  Então ele entra na massificada

Cenário 3: Sem score
  Dado que mesma versão
  Quando o contribuinte não tem score válido
  Então ele é avaliado só por valor e atraso, fica marcado «Sem score» e o ciclo soma 1 em «Sem score»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F3-001, RN-NOVO-F3-002  
**Dependências:** RF-MOD-F2-003, RF-MOD-F3-001  
**Rastreabilidade:** F-035, F-005 (Explore RF-205)  
**Notas:** —

---

### RF-MOD-F2-006: Prévia da carteira antes de publicar

**Épico:** Qualificação e Parametrização da Carteira (MOD-F2)  
**Funcionalidade:** Prévia da carteira antes de publicar  
**ID no Explore:** RF-206 · **Telas:** TEL-009 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver a carteira segmentada antes de publicar o ciclo,
para que eu possa corrigir o critério antes que a cobrança comece.

**Enunciado EARS *(1 padrão)*:** QUANDO o coordenador clica em «Gerar prévia», o sistema DEVE montar a carteira segmentada do ciclo em estado «Prévia» com os totais por segmento.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Gerar prévia
  Dado que o ciclo 2027-02 está sem carteira
  Quando o coordenador clica em «Gerar prévia»
  Então o ciclo fica em «Prévia» com os totais de massificada, qualificada e sem score

Cenário 2: Gerar prévia de novo
  Dado que o ciclo está em «Prévia»
  Quando o coordenador publica nova versão do critério e gera a prévia de novo
  Então a carteira da prévia é refeita com a versão nova

Cenário 3: Ciclo já publicado
  Dado que o ciclo 2027-01 está «Publicado»
  Quando o coordenador tenta gerar a prévia
  Então o botão não aparece e a carteira não muda
```

**Regras de Negócio aplicáveis:** RN-NOVO-F2-002, RN-NOVO-F2-003  
**Dependências:** RF-MOD-F2-003  
**Rastreabilidade:** F-036, F-005 (Explore RF-206)  
**Notas:** —

---

## Módulo: Scoring de Liquidez (`MOD-F3`)

### RF-MOD-F3-001: Ingestão e normalização do score

**Épico:** Scoring de Liquidez (MOD-F3)  
**Funcionalidade:** Ingestão e normalização do score  
**ID no Explore:** RF-301 · **Telas:** TEL-012 · **Critérios do plano:** CT-MOD-F3-001

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que o score da UFMT seja recebido e ligado ao contribuinte,
para que eu possa usar o score na qualificação.

**Enunciado EARS *(1 padrão)*:** QUANDO chega uma carga de score, o sistema DEVE gravar o score por contribuinte e tributo com a versão do modelo, a data de ingestão e o status.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Carga válida
  Dado que a carga «sim-v1» traz scores de 0 a 100
  Quando a ingestão roda
  Então cada score fica ligado ao contribuinte com status «Válido»

Cenário 2: Score fora da escala
  Dado que uma linha traz score 140
  Quando a ingestão roda
  Então a linha fica com status «Inválido» e não é usada na qualificação

Cenário 3: Contribuinte desconhecido
  Dado que uma linha traz documento que não existe na carteira
  Quando a ingestão roda
  Então a linha não é ligada e conta como rejeitada na ingestão
```

**Regras de Negócio aplicáveis:** RN-NOVO-F3-003  
**Dependências:** —  
**Rastreabilidade:** F-040, F-006, F-113 (Explore RF-301)  
**Notas:** —

---

### RF-MOD-F3-002: Score como variável de priorização

**Épico:** Scoring de Liquidez (MOD-F3)  
**Funcionalidade:** Score como variável de priorização  
**ID no Explore:** RF-302 · **Telas:** TEL-012 · **Critérios do plano:** CT-MOD-F3-002

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero configurar o threshold do score no critério,
para que eu possa definir a partir de que score o contribuinte é priorizado.

**Enunciado EARS *(1 padrão)*:** ONDE o score está disponível, o sistema DEVE oferecer no critério o uso do score com threshold de 0 a 100.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Threshold configurado
  Dado que o coordenador edita uma versão em rascunho
  Quando ele marca «Usar score» e informa threshold 60
  Então a versão guarda o threshold 60

Cenário 2: Threshold fora da faixa
  Dado que mesmo rascunho
  Quando ele informa threshold 120
  Então o sistema recusa e mostra «Threshold deve ficar entre 0 e 100»

Cenário 3: Score desligado
  Dado que mesmo rascunho
  Quando ele desmarca «Usar score»
  Então o threshold é limpo e a qualificação ignora o score
```

**Regras de Negócio aplicáveis:** RN-NOVO-F3-001  
**Dependências:** RF-MOD-F3-001  
**Rastreabilidade:** F-041, F-006 (Explore RF-302)  
**Notas:** —

---

### RF-MOD-F3-003: Score no dossiê

**Épico:** Scoring de Liquidez (MOD-F3)  
**Funcionalidade:** Score no dossiê  
**ID no Explore:** RF-303 · **Telas:** TEL-024 · **Critérios do plano:** CT-MOD-F3-004

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver o score do contribuinte no dossiê do caso,
para que eu possa preparar a abordagem.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar no dossiê do caso o score usado e a marca «sem score» quando não houver score válido.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Caso com score
  Dado que o caso tem score 72
  Quando o atendente abre o dossiê
  Então a seção Score mostra 72

Cenário 2: Caso sem score
  Dado que o caso não tem score válido
  Quando o atendente abre o dossiê
  Então a seção Score mostra «Sem score» marcado

Cenário 3: Score de outra carteira
  Dado que o caso é de outro atendente
  Quando o atendente tenta abrir o dossiê
  Então o sistema não mostra o registro
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-003, RN-NOVO-F5-007  
**Dependências:** RF-MOD-F5-003  
**Rastreabilidade:** F-042, F-006 (Explore RF-303)  
**Notas:** —

---

### RF-MOD-F3-004: Atualização periódica do score

**Épico:** Scoring de Liquidez (MOD-F3)  
**Funcionalidade:** Atualização periódica do score  
**ID no Explore:** RF-304 · **Telas:** TEL-012 · **Critérios do plano:** CT-MOD-F3-005

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero receber versões novas do modelo da UFMT,
para que eu possa usar sempre o score mais recente.

**Enunciado EARS *(1 padrão)*:** QUANDO chega uma carga com versão nova do modelo, o sistema DEVE passar a usar os scores da versão nova e manter os anteriores para consulta.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Versão nova
  Dado que os scores «sim-v1» estão válidos
  Quando chega a carga «sim-v2»
  Então a qualificação seguinte usa os scores «sim-v2»

Cenário 2: Versão anterior preservada
  Dado que a carga «sim-v2» foi ingerida
  Quando o coordenador consulta os scores
  Então os scores «sim-v1» continuam na lista

Cenário 3: Versão nova inválida
  Dado que a carga «sim-v2» chega toda inválida
  Quando a qualificação roda
  Então a carteira cai em fallback sem score
```

**Regras de Negócio aplicáveis:** RN-NOVO-F3-003, RN-NOVO-F3-002  
**Dependências:** RF-MOD-F3-001  
**Rastreabilidade:** F-043, F-006 (Explore RF-304)  
**Notas:** —

---

### RF-MOD-F3-005: Fallback determinístico sem score

**Épico:** Scoring de Liquidez (MOD-F3)  
**Funcionalidade:** Fallback determinístico sem score  
**ID no Explore:** RF-305 · **Telas:** TEL-012 · **Critérios do plano:** CT-MOD-F3-003

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que a priorização funcione mesmo com o modelo indisponível,
para que eu possa não parar a cobrança por falta do score.

**Enunciado EARS *(1 padrão)*:** SE o score está indisponível ou inválido, ENTÃO o sistema DEVE priorizar a carteira só pelos critérios determinísticos e marcar «sem score».

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Modelo indisponível
  Dado que todos os scores da versão vigente estão «Inválido»
  Quando o coordenador gera a prévia
  Então todos os contribuintes ficam «Sem score» e a carteira é formada por valor e atraso

Cenário 2: Score parcial
  Dado que 20% dos contribuintes estão sem score
  Quando o coordenador gera a prévia
  Então só esses 20% ficam «Sem score»

Cenário 3: Fila sem score
  Dado que um caso «Sem score» está na fila
  Quando o atendente abre a fila
  Então o caso aparece depois dos casos com score, ordenado por valor em aberto
```

**Regras de Negócio aplicáveis:** RN-NOVO-F3-002, RN-NOVO-F5-002  
**Dependências:** RF-MOD-F3-001  
**Rastreabilidade:** F-044, F-006 (Explore RF-305)  
**Notas:** —

---

### RF-MOD-F3-006: Cobertura e qualidade do score

**Épico:** Scoring de Liquidez (MOD-F3)  
**Funcionalidade:** Cobertura e qualidade do score  
**ID no Explore:** RF-306 · **Telas:** TEL-011 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver a cobertura do score por tributo, a versão do modelo e a última ingestão,
para que eu possa saber quanto da carteira está priorizada pelo score.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar a quantidade de scores por tributo e status, com a versão do modelo e a data da última ingestão.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Painel de cobertura
  Dado que há scores de ICMS, IPVA e ITCD
  Quando o coordenador abre o painel do score
  Então o relatório mostra a quantidade por tributo e status

Cenário 2: Sem ingestão
  Dado que nenhuma carga foi ingerida
  Quando o coordenador abre o painel
  Então o relatório mostra «Nenhum dado para exibir»

Cenário 3: Atendente tenta abrir
  Dado que o usuário é atendente
  Quando ele tenta abrir o painel do score
  Então o sistema não mostra o relatório
```

**Regras de Negócio aplicáveis:** RN-NOVO-F3-003  
**Dependências:** RF-MOD-F3-001  
**Rastreabilidade:** F-045, F-006 (Explore RF-306)  
**Notas:** —

---

## Módulo: Réguas de Cobrança Multicanal (`MOD-F4`)

### RF-MOD-F4-001: Editor de régua

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Editor de régua  
**ID no Explore:** RF-401 · **Telas:** TEL-013, TEL-014 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero desenhar régua por carteira com etapas, prazos, canais e textos,
para que eu possa padronizar a cobrança massificada.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE permitir ao coordenador criar régua por carteira com etapas ordenadas, cada uma com prazo em dias, canal, texto e ação sem resposta.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Criar régua
  Dado que o coordenador abre «Réguas de cobrança»
  Quando ele cria a régua IPVA com 4 etapas: SNE no dia 0, e-mail no dia 10, SMS no dia 20 e encaminhar à qualificada no dia 30
  Então a régua fica salva com as 4 etapas em ordem

Cenário 2: Ativar régua
  Dado que a régua IPVA está inativa
  Quando o coordenador clica em «Ativar»
  Então a régua passa a disparar no próximo ciclo

Cenário 3: Régua sem carteira
  Dado que o coordenador cria uma régua
  Quando ele salva sem escolher a carteira
  Então o sistema recusa e mostra «Carteira é obrigatória»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-001  
**Dependências:** —  
**Rastreabilidade:** F-048, F-007, F-114, F-115 (Explore RF-401)  
**Notas:** —

---

### RF-MOD-F4-002: Disparo automático

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Disparo automático  
**ID no Explore:** RF-402 · **Telas:** TEL-015 · **Critérios do plano:** CT-MOD-F4-001

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que as comunicações sejam disparadas sem confirmação manual em lote,
para que eu possa não atrasar a régua.

**Enunciado EARS *(1 padrão)*:** QUANDO chega o dia de uma etapa, o sistema DEVE disparar as comunicações da etapa sem pedir confirmação.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Disparo no dia
  Dado que a etapa 1 da régua IPVA vence hoje para 30 contribuintes
  Quando o disparo diário roda
  Então 30 comunicações passam a «Enviada» sem ação do coordenador

Cenário 2: Grupo de controle
  Dado que 3 desses contribuintes estão no grupo de controle
  Quando o disparo roda
  Então nenhuma comunicação é criada para os 3

Cenário 3: Régua inativa
  Dado que a régua ITCD está inativa
  Quando o disparo roda
  Então nenhuma comunicação da régua ITCD é criada
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-002, RN-NOVO-F2-005  
**Dependências:** RF-MOD-F4-001  
**Rastreabilidade:** F-049, F-007, F-116 (Explore RF-402)  
**Notas:** —

---

### RF-MOD-F4-003: Escalonamento por comportamento

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Escalonamento por comportamento  
**ID no Explore:** RF-403 · **Telas:** TEL-014, TEL-015 · **Critérios do plano:** CT-MOD-F4-001, CT-MOD-F4-002

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que a régua avance, intensifique ou encerre conforme o contribuinte responde,
para que eu possa cobrar mais forte só quem não responde.

**Enunciado EARS *(1 padrão)*:** QUANDO termina o prazo de uma etapa sem pagamento, o sistema DEVE executar a ação sem resposta da etapa.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Sem pagamento avança
  Dado que o contribuinte recebeu a etapa 1 há 10 dias e não pagou
  Quando o prazo da etapa termina
  Então o sistema agenda a etapa 2 sem confirmação manual

Cenário 2: Pagamento encerra
  Dado que o contribuinte pagou na etapa 2
  Quando a regularização chega
  Então a régua do contribuinte se encerra e a regularização fica marcada com canal e-mail

Cenário 3: Última etapa sem pagamento
  Dado que o contribuinte chegou à etapa «encaminhar à qualificada» sem pagar
  Quando a etapa vence
  Então a régua se encerra e o contribuinte fica elegível à qualificada
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-001, RN-NOVO-F1-002  
**Dependências:** RF-MOD-F4-002  
**Rastreabilidade:** F-050, F-007 (Explore RF-403)  
**Notas:** —

---

### RF-MOD-F4-004: Multicanal com fallback

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Multicanal com fallback  
**ID no Explore:** RF-404 · **Telas:** TEL-014, TEL-018 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero usar e-mail, SMS, SNE e WhatsApp com ordem de fallback,
para que eu possa alcançar o contribuinte pelo canal disponível.

**Enunciado EARS *(1 padrão)*:** SE o envio por um canal falha ou é pulado, ENTÃO o sistema DEVE tentar o próximo canal da ordem SNE → e-mail → SMS.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Fallback após falha
  Dado que o SNE está com falha forçada
  Quando uma comunicação por SNE é disparada
  Então o sistema tenta o e-mail e registra as duas tentativas

Cenário 2: Todos falham
  Dado que SNE, e-mail e SMS estão com falha forçada
  Quando a comunicação é disparada
  Então a comunicação fica «Falha» com 3 tentativas

Cenário 3: WhatsApp não contratado
  Dado que o canal WhatsApp está «Contratado = não»
  Quando uma etapa por WhatsApp vence
  Então a comunicação fica «Pulada» e o sistema tenta o SNE
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-004, RN-NOVO-F4-003  
**Dependências:** RF-MOD-F4-002  
**Rastreabilidade:** F-051, F-007, F-118 (Explore RF-404)  
**Notas:** —

---

### RF-MOD-F4-005: Opt-in e opt-out por canal

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Opt-in e opt-out por canal  
**ID no Explore:** RF-405 · **Telas:** TEL-017, TEL-018 · **Critérios do plano:** CT-MOD-F4-003

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que o consentimento por canal seja respeitado e registrado,
para que eu possa cumprir a vontade do contribuinte.

**Enunciado EARS *(1 padrão)*:** SE o canal exige consentimento e o contribuinte não tem opt-in vigente, ENTÃO o sistema DEVE pular o canal sem enviar.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Sem opt-in de WhatsApp
  Dado que o contribuinte não tem opt-in de WhatsApp
  Quando uma etapa por WhatsApp vence
  Então a comunicação fica «Pulada» com motivo «sem opt-in» e nenhum envio sai

Cenário 2: Com opt-in
  Dado que o contribuinte tem opt-in de WhatsApp registrado ontem e o canal está contratado
  Quando a etapa vence
  Então a comunicação é enviada por WhatsApp

Cenário 3: Opt-out imediato
  Dado que o contribuinte registra opt-out de SMS hoje às 10h
  Quando uma etapa por SMS vence hoje às 14h
  Então a comunicação por SMS não sai
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-003  
**Dependências:** RF-MOD-F4-002  
**Rastreabilidade:** F-052, F-007, F-119 (Explore RF-405)  
**Notas:** —

---

### RF-MOD-F4-006: Status de entrega e reenvio

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Status de entrega e reenvio  
**ID no Explore:** RF-406 · **Telas:** TEL-015, TEL-019 · **Critérios do plano:** CT-MOD-F4-004

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver o status de entrega de cada comunicação e reenviar as falhas,
para que eu possa não perder contato por falha de canal.

**Enunciado EARS *(1 padrão)*:** QUANDO o canal devolve falha de entrega, o sistema DEVE marcar a comunicação como «Falha» e permitir o reenvio.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Falha sinalizada
  Dado que o e-mail está com falha forçada
  Quando a comunicação é disparada
  Então a comunicação fica «Falha» e aparece no filtro de falhas

Cenário 2: Reenvio
  Dado que a comunicação está «Falha» e a falha forçada foi desligada
  Quando o coordenador clica em «Reenviar»
  Então a comunicação fica «Entregue» com tentativas = 2 e o reenvio fica registrado com autor e hora

Cenário 3: Reenvio de comunicação entregue
  Dado que a comunicação está «Entregue»
  Quando o coordenador procura «Reenviar»
  Então o botão não aparece
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-005, RN-NOVO-F5-005  
**Dependências:** RF-MOD-F4-002  
**Rastreabilidade:** F-053, F-007, F-117 (Explore RF-406)  
**Notas:** —

---

### RF-MOD-F4-007: Origem da regularização

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Origem da regularização  
**ID no Explore:** RF-407 · **Telas:** TEL-020 · **Critérios do plano:** CT-MOD-F4-002

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que cada regularização seja marcada com canal e instrumento,
para que eu possa saber o que funcionou.

**Enunciado EARS *(1 padrão)*:** QUANDO um débito é regularizado, o sistema DEVE gravar a origem (espontânea ou resposta à cobrança), o canal e o instrumento.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Resposta a e-mail
  Dado que o contribuinte recebeu e-mail entregue há 12 dias
  Quando ele regulariza
  Então a regularização fica «Resposta à cobrança», canal «E-mail», instrumento «Régua»

Cenário 2: Espontânea
  Dado que o contribuinte não recebeu comunicação nos últimos 30 dias
  Quando ele regulariza
  Então a regularização fica «Espontânea», canal «Nenhum»

Cenário 3: Fora da janela
  Dado que a última comunicação entregue foi há 45 dias
  Quando ele regulariza
  Então a regularização fica «Espontânea»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-006, RN-NOVO-F4-007  
**Dependências:** RF-MOD-F4-003  
**Rastreabilidade:** F-054, F-007, F-120 (Explore RF-407)  
**Notas:** —

---

### RF-MOD-F4-008: Efetividade da régua

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Efetividade da régua  
**ID no Explore:** RF-408 · **Telas:** TEL-016 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver a efetividade por segmento, etapa e canal,
para que eu possa ajustar a régua.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar as comunicações agrupadas por canal e status.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Could  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Relatório por canal
  Dado que há comunicações de SNE, e-mail e SMS
  Quando o coordenador abre «Efetividade da régua»
  Então o relatório mostra a quantidade por canal e status

Cenário 2: Sem comunicações
  Dado que não há comunicações no período
  Quando o coordenador abre o relatório
  Então o relatório mostra «Nenhum dado para exibir»

Cenário 3: Atendente
  Dado que o usuário é atendente
  Quando ele tenta abrir o relatório
  Então o sistema não mostra o relatório
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-006  
**Dependências:** RF-MOD-F4-002  
**Rastreabilidade:** F-055, F-007 (Explore RF-408)  
**Notas:** —

---

### RF-MOD-F4-009: Encaminhamento à cobrança qualificada

**Épico:** Réguas de Cobrança Multicanal (MOD-F4)  
**Funcionalidade:** Encaminhamento à cobrança qualificada  
**ID no Explore:** RF-409 · **Telas:** TEL-014 · **Critérios do plano:** CT-MOD-F4-005

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que quem esgota a régua sem pagar vá para a qualificada,
para que eu possa não deixar devedor sem tratamento.

**Enunciado EARS *(1 padrão)*:** QUANDO o contribuinte termina a última etapa da régua sem regularizar, o sistema DEVE torná-lo elegível à cobrança qualificada no próximo ciclo.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Régua esgotada
  Dado que o contribuinte passou pelas 4 etapas sem pagar
  Quando a última etapa vence
  Então ele fica elegível à qualificada no ciclo seguinte

Cenário 2: Pagou na última etapa
  Dado que o contribuinte pagou na etapa 4
  Quando a etapa vence
  Então ele não é encaminhado

Cenário 3: Sorteado no controle
  Dado que o contribuinte encaminhado é sorteado para o grupo de controle do ciclo seguinte
  Quando o ciclo é publicado
  Então ele não vira caso naquele ciclo
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-008, RN-NOVO-F2-005  
**Dependências:** RF-MOD-F4-003  
**Rastreabilidade:** F-056, F-007 (Explore RF-409)  
**Notas:** —

---

## Módulo: Cobrança Qualificada (`MOD-F5`)

### RF-MOD-F5-001: Distribuição automática de casos

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Distribuição automática de casos  
**ID no Explore:** RF-501 · **Telas:** TEL-021, TEL-022 · **Critérios do plano:** CT-MOD-F5-001

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que os casos sejam distribuídos por vínculo, carga e prioridade,
para que eu possa acabar com a distribuição por planilha.

**Enunciado EARS *(1 padrão)*:** QUANDO o coordenador clica em «Distribuir», o sistema DEVE atribuir cada caso sem atendente ao atendente vinculado ao contribuinte ou, sem vínculo, ao atendente com menos casos abertos.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Vínculo existente
  Dado que o contribuinte já é atendido por Atendente A
  Quando o caso novo dele é distribuído
  Então o caso vai para Atendente A

Cenário 2: Balanceamento
  Dado que Atendente A tem 12 casos abertos e Atendente B tem 8
  Quando chegam 4 casos sem vínculo
  Então os 4 vão para Atendente B

Cenário 3: Grupo de controle
  Dado que o contribuinte está no grupo de controle do ciclo
  Quando a distribuição roda
  Então nenhum caso é criado para ele
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-001, RN-NOVO-F2-005  
**Dependências:** RF-MOD-F2-004  
**Rastreabilidade:** F-061, F-008, F-121, F-015 (Explore RF-501)  
**Notas:** —

---

### RF-MOD-F5-002: Fila priorizada do atendente

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Fila priorizada do atendente  
**ID no Explore:** RF-502 · **Telas:** TEL-023 · **Critérios do plano:** CT-MOD-F5-002

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver minha fila ordenada por score e estágio,
para que eu possa começar pelos casos com mais chance de pagar.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE ordenar a fila do atendente por score decrescente e, sem score, pelo valor em aberto e pelo débito mais antigo.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Fila com score
  Dado que a fila tem casos com score 85, 72 e 40
  Quando o atendente abre «Minha fila»
  Então os casos aparecem na ordem 85, 72, 40

Cenário 2: Casos sem score
  Dado que a fila tem 2 casos sem score de R$ 90.000,00 e R$ 150.000,00
  Quando o atendente abre a fila
  Então os casos sem score aparecem depois dos com score, primeiro o de R$ 150.000,00

Cenário 3: Fila vazia
  Dado que o atendente não tem casos abertos
  Quando ele abre a fila
  Então a lista mostra «Nenhum registro»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-002, RN-NOVO-F3-002  
**Dependências:** RF-MOD-F5-001  
**Rastreabilidade:** F-062, F-008 (Explore RF-502)  
**Notas:** —

---

### RF-MOD-F5-003: Dossiê consolidado do caso — fio condutor

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Dossiê consolidado do caso  
**ID no Explore:** RF-503 · **Telas:** TEL-024 · **Critérios do plano:** CT-MOD-F5-003

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver no caso os débitos, parcelamentos, comunicações, interações, regularizações, score e sinalizações,
para que eu possa conduzir a negociação sem procurar em outros lugares.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar no caso os 3 níveis do dossiê: débitos e parcelamentos; comunicações, interações e regularizações; score e sinalizações coercitivas.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Dossiê completo
  Dado que o caso fictício está em condução com 3 interações
  Quando o atendente responsável abre o caso
  Então o dossiê mostra as seções Caso, Score, Sinalizações e Encerramento e as listas de débitos, parcelamentos, comunicações, interações e regularizações

Cenário 2: Contribuinte sem parcelamento
  Dado que o contribuinte do caso não tem parcelamento
  Quando o atendente abre o dossiê
  Então a lista de parcelamentos aparece vazia

Cenário 3: Caso de outro atendente
  Dado que o caso é de outro atendente
  Quando o atendente tenta abrir o dossiê
  Então o sistema não mostra o registro
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-003, RN-NOVO-F1-001, RN-NOVO-F5-007  
**Dependências:** RF-MOD-F5-001  
**Rastreabilidade:** F-063, F-008, F-019 (Explore RF-503)  
**Notas:** —

---

### RF-MOD-F5-004: Sinalização de medida coercitiva

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Sinalização de medida coercitiva  
**ID no Explore:** RF-504 · **Telas:** TEL-024 · **Critérios do plano:** CT-MOD-F5-003

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver no dossiê se há notificação coercitiva ativa em outra coordenadoria,
para que eu possa não conflitar com outra frente.

**Enunciado EARS *(1 padrão)*:** ONDE existe sinalização coercitiva para o contribuinte do caso, o sistema DEVE mostrá-la no dossiê sem oferecer ação coercitiva.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Could  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Sinalização ativa
  Dado que o caso tem sinalização coercitiva «Notificação CCF ativa»
  Quando o atendente abre o dossiê
  Então a seção Sinalizações mostra o aviso e a descrição

Cenário 2: Sem sinalização
  Dado que o caso não tem sinalização
  Quando o atendente abre o dossiê
  Então a seção mostra «Sinalização coercitiva ativa» desmarcada

Cenário 3: Ação coercitiva
  Dado que o caso tem sinalização ativa
  Quando o atendente procura uma ação coercitiva no caso
  Então nenhum botão de ação coercitiva existe
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-004  
**Dependências:** RF-MOD-F5-003  
**Rastreabilidade:** F-064, F-008 (Explore RF-504)  
**Notas:** —

---

### RF-MOD-F5-005: Registro estruturado de interações

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Registro estruturado de interações  
**ID no Explore:** RF-505 · **Telas:** TEL-024, TEL-025 · **Critérios do plano:** CT-MOD-F5-004

**Descrição (User Story):**
Como Atendente de Cobrança,
quero registrar cada interação com tipo, resultado e descrição,
para que eu possa manter o histórico do caso.

**Enunciado EARS *(1 padrão)*:** QUANDO o atendente registra uma interação no próprio caso, o sistema DEVE gravar tipo, resultado, descrição, data, hora e autor.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Registrar interação
  Dado que o atendente está no próprio caso
  Quando ele registra interação «Telefone», resultado «Promessa de pagamento»
  Então a interação aparece no dossiê com data, hora e o nome dele

Cenário 2: Sem resultado
  Dado que o atendente registra interação
  Quando ele salva sem resultado
  Então o sistema recusa e mostra «Resultado é obrigatório»

Cenário 3: Caso de outro atendente
  Dado que o caso é de outro atendente
  Quando o atendente tenta registrar interação
  Então o sistema não permite
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-005, RN-NOVO-F5-007  
**Dependências:** RF-MOD-F5-003  
**Rastreabilidade:** F-065, F-008, F-122 (Explore RF-505)  
**Notas:** —

---

### RF-MOD-F5-006: Encerramento por regularização

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Encerramento por regularização  
**ID no Explore:** RF-506 · **Telas:** TEL-024 · **Critérios do plano:** CT-MOD-F5-005

**Descrição (User Story):**
Como Atendente de Cobrança,
quero que o caso se encerre quando o contribuinte regulariza,
para que eu possa não gastar tempo com caso resolvido.

**Enunciado EARS *(1 padrão)*:** QUANDO todos os débitos em aberto do contribuinte do caso são regularizados, o sistema DEVE encerrar o caso com motivo «Regularizado» e a origem da regularização.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Regularização total
  Dado que o caso tem 1 débito em aberto
  Quando o débito é regularizado
  Então o caso fica «Encerrado», motivo «Regularizado», com data de encerramento, e a regularização fica com canal «Atendimento»

Cenário 2: Regularização parcial
  Dado que o caso tem 2 débitos em aberto
  Quando só 1 é regularizado
  Então o caso continua em condução

Cenário 3: Encerramento manual de outro atendente
  Dado que o caso é de outro atendente
  Quando o atendente tenta encerrar
  Então o sistema não permite
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-006, RN-NOVO-F4-006, RN-NOVO-F5-005  
**Dependências:** RF-MOD-F5-003  
**Rastreabilidade:** F-066, F-008 (Explore RF-506)  
**Notas:** —

---

### RF-MOD-F5-007: Visão restrita do atendente — fio condutor

**Épico:** Cobrança Qualificada (MOD-F5)  
**Funcionalidade:** Visão restrita do atendente  
**ID no Explore:** RF-507 · **Telas:** TEL-023 · **Critérios do plano:** CT-MOD-F5-006

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver só a minha carteira, sem comparativo com colegas,
para que eu possa trabalhar sem exposição de dados de outros atendentes.

**Enunciado EARS *(1 padrão)*:** ENQUANTO o usuário tem só o papel de atendente, o sistema DEVE mostrar apenas casos, contribuintes, interações e regularizações em que ele é o atendente.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Própria fila
  Dado que Atendente A tem 6 casos e Atendente B tem 9
  Quando Atendente A abre «Minha fila»
  Então a lista mostra só os 6 casos dele

Cenário 2: Acesso direto a caso alheio
  Dado que Atendente A tem o endereço do caso de Atendente B
  Quando ele abre esse endereço
  Então o sistema não mostra o registro

Cenário 3: Coordenador vê tudo
  Dado que o usuário é coordenador
  Quando ele abre a lista de casos
  Então a lista mostra os 15 casos
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-007  
**Dependências:** —  
**Rastreabilidade:** F-067, F-008, F-014, F-016 (Explore RF-507)  
**Notas:** —

---

## Módulo: Monitoramento, KPIs e Grupo de Controle (`MOD-F6`)

### RF-MOD-F6-001: Funil do crédito

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** Funil do crédito  
**ID no Explore:** RF-601 · **Telas:** TEL-026 · **Critérios do plano:** CT-MOD-F6-001

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver o funil identificado → notificado → regularizado do ciclo,
para que eu possa acompanhar a cobrança sem extração manual.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar a quantidade de contribuintes do ciclo por estágio do funil, atualizada a cada regularização.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Funil do ciclo
  Dado que o ciclo 2027-01 tem 200 identificados, 150 notificados e 30 regularizados
  Quando o coordenador abre «Funil do crédito»
  Então o relatório mostra 200, 150 e 30

Cenário 2: Regularização do dia
  Dado que um contribuinte regulariza hoje
  Quando o coordenador abre o funil
  Então o estágio regularizado já soma esse contribuinte

Cenário 3: Ciclo sem carteira
  Dado que o ciclo 2027-03 ainda não tem carteira
  Quando o coordenador filtra o ciclo
  Então o relatório mostra «Nenhum dado para exibir»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F6-002  
**Dependências:** RF-MOD-F2-003  
**Rastreabilidade:** F-072, F-009, F-019 (Explore RF-601)  
**Notas:** —

---

### RF-MOD-F6-002: KPIs com metas

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** KPIs com metas  
**ID no Explore:** RF-602 · **Telas:** TEL-027, TEL-030 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero comparar KPIs por tributo, canal, instrumento e atendente com metas formais,
para que eu possa acompanhar a estratégia.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE permitir cadastrar metas por indicador, tributo, canal e período e mostrar as regularizações agrupadas pelos mesmos eixos.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Cadastrar meta
  Dado que o coordenador abre «Metas de KPI»
  Quando ele cadastra meta de taxa de regularização de 12% para ICMS Normal em 2027-01
  Então a meta fica salva

Cenário 2: Meta sem valor
  Dado que o coordenador cadastra meta
  Quando ele salva sem valor da meta
  Então o sistema recusa e mostra «Valor da meta é obrigatório»

Cenário 3: Regularizações por tributo
  Dado que há regularizações de ICMS e IPVA
  Quando o coordenador abre «Regularizações por tributo»
  Então o relatório mostra o valor regularizado por tributo
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-006  
**Dependências:** RF-MOD-F4-007  
**Rastreabilidade:** F-073, F-009, F-123 (Explore RF-602)  
**Notas:** —

---

### RF-MOD-F6-003: Origem da regularização no monitoramento

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** Origem da regularização no monitoramento  
**ID no Explore:** RF-603 · **Telas:** TEL-020, TEL-028 · **Critérios do plano:** CT-MOD-F6-002

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver as regularizações separadas em espontâneas e respostas à cobrança por canal,
para que eu possa saber o efeito de cada canal.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE mostrar as regularizações agrupadas por origem e canal.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Resposta ao e-mail
  Dado que há uma regularização após e-mail entregue há 12 dias
  Quando o coordenador abre «Regularizações por origem e canal»
  Então ela aparece em «Resposta à cobrança / E-mail»

Cenário 2: Espontânea
  Dado que há uma regularização sem comunicação nos 30 dias anteriores
  Quando o coordenador abre o relatório
  Então ela aparece em «Espontânea»

Cenário 3: Sem regularizações
  Dado que não há regularizações no período
  Quando o coordenador abre o relatório
  Então o relatório mostra «Nenhum dado para exibir»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-006, RN-NOVO-F4-007  
**Dependências:** RF-MOD-F4-007  
**Rastreabilidade:** F-074, F-009 (Explore RF-603)  
**Notas:** —

---

### RF-MOD-F6-004: Efeito incremental por ciclo

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** Efeito incremental por ciclo  
**ID no Explore:** RF-604 · **Telas:** TEL-029 · **Critérios do plano:** CT-MOD-F6-003

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver por ciclo a taxa da carteira cobrada menos a do grupo de controle,
para que eu possa medir o efeito real da cobrança.

**Enunciado EARS *(1 padrão)*:** QUANDO o ciclo é encerrado, o sistema DEVE calcular a taxa da carteira cobrada, a taxa do grupo de controle e o efeito incremental em pontos percentuais.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Alta

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Cálculo do efeito
  Dado que o ciclo teve 180 cobrados com 27 regularizados e 20 no controle com 1 regularizado
  Quando o ciclo é encerrado
  Então taxa cobrada = 15,0%, taxa do controle = 5,0% e efeito incremental = 10,0 p.p.

Cenário 2: Lista por ciclo
  Dado que há 3 ciclos encerrados
  Quando o coordenador abre «Efeito incremental por ciclo»
  Então a lista mostra as três taxas de cada ciclo

Cenário 3: Ciclo sem controle
  Dado que o ciclo teve grupo de controle com 0 contribuintes
  Quando o ciclo é encerrado
  Então o efeito incremental fica vazio e o ciclo registra «sem grupo de controle»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F6-001, RN-NOVO-F2-005  
**Dependências:** RF-MOD-F2-004, RF-MOD-F4-007  
**Rastreabilidade:** F-075, F-009 (Explore RF-604)  
**Notas:** —

---

### RF-MOD-F6-005: IPVA e ITCD no monitoramento

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** IPVA e ITCD no monitoramento  
**ID no Explore:** RF-605 · **Telas:** TEL-027, TEL-030 · **Critérios do plano:** CT-MOD-F6-005

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero ver IPVA e ITCD no monitoramento com metas,
para que eu possa acompanhar as 5 carteiras prioritárias.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE incluir IPVA e ITCD nos relatórios por tributo e nas metas.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: IPVA e ITCD no relatório
  Dado que há regularizações de IPVA e ITCD
  Quando o coordenador abre «Regularizações por tributo»
  Então IPVA e ITCD aparecem como grupos próprios

Cenário 2: Meta de ITCD
  Dado que o coordenador cadastra meta para ITCD
  Quando ele escolhe o tributo
  Então ITCD está entre as opções

Cenário 3: Sem dados de ITCD
  Dado que não há regularizações de ITCD
  Quando o coordenador abre o relatório
  Então ITCD não aparece e os demais tributos aparecem com seus valores
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-006  
**Dependências:** RF-MOD-F6-002  
**Rastreabilidade:** F-076, F-009 (Explore RF-605)  
**Notas:** —

---

### RF-MOD-F6-006: Visões por perfil

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** Visões por perfil  
**ID no Explore:** RF-606 · **Telas:** TEL-031 · **Critérios do plano:** CT-MOD-F6-004

**Descrição (User Story):**
Como Atendente de Cobrança,
quero ver só os meus indicadores, sem comparativo com colegas,
para que eu possa acompanhar meu resultado.

**Enunciado EARS *(1 padrão)*:** ENQUANTO o usuário tem só o papel de atendente, o sistema DEVE mostrar nos indicadores apenas as regularizações em que ele é o atendente.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Meus indicadores
  Dado que Atendente A tem 5 regularizações e Atendente B tem 7
  Quando Atendente A abre «Meus indicadores»
  Então o relatório mostra só as 5 dele, por canal

Cenário 2: Painel institucional
  Dado que o usuário é atendente
  Quando ele tenta abrir «Funil do crédito»
  Então o sistema não mostra o relatório

Cenário 3: Coordenador
  Dado que o usuário é coordenador
  Quando ele abre «Regularizações por tributo»
  Então o relatório soma as 12 regularizações
```

**Regras de Negócio aplicáveis:** RN-NOVO-F5-007  
**Dependências:** RF-MOD-F5-007  
**Rastreabilidade:** F-077, F-009 (Explore RF-606)  
**Notas:** —

---

### RF-MOD-F6-007: Insumos para revisão da estratégia

**Épico:** Monitoramento, KPIs e Grupo de Controle (MOD-F6)  
**Funcionalidade:** Insumos para revisão da estratégia  
**ID no Explore:** RF-607 · **Telas:** TEL-026, TEL-027, TEL-028 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero exportar funil, origem e efeito incremental,
para que eu possa revisar a estratégia de cobrança.

**Enunciado EARS *(1 padrão)*:** ONDE o coordenador pede insumos de estratégia, o sistema DEVE exportar os relatórios de funil, origem e efeito incremental.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Could  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Exportar insumos
  Dado que o coordenador está no relatório «Funil do crédito»
  Quando ele exporta em CSV
  Então o arquivo sai e a exportação vai para a trilha

Cenário 2: Relatório vazio
  Dado que o relatório não tem dados
  Quando o coordenador exporta
  Então o arquivo sai só com o cabeçalho

Cenário 3: Atendente
  Dado que o usuário é atendente
  Quando ele tenta abrir o funil para exportar
  Então o sistema não mostra o relatório
```

**Regras de Negócio aplicáveis:** RN-NOVO-T-001, RN-NOVO-F6-001  
**Dependências:** RF-MOD-F6-001  
**Rastreabilidade:** F-078, F-009 (Explore RF-607)  
**Notas:** —

---

## Módulo: Transversais (`MOD-T`)

### RF-MOD-T-001: Exportação com trilha

**Épico:** Transversais (MOD-T)  
**Funcionalidade:** Exportação com trilha  
**ID no Explore:** RF-901 · **Telas:** TEL-033 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero exportar listas e relatórios em CSV ou PDF com registro na trilha,
para que eu possa prestar contas do uso dos dados.

**Enunciado EARS *(1 padrão)*:** QUANDO alguém exporta uma lista ou relatório, o sistema DEVE registrar na trilha o usuário, a tela, o formato, o filtro, o número de registros e a hora.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Must  
**Complexidade:** Média

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Exportar CSV
  Dado que o coordenador está em «Carteira consolidada» filtrada por ICMS Normal
  Quando ele exporta em CSV
  Então a trilha ganha uma linha com usuário, tabela, formato CSV, filtro e registros

Cenário 2: Atendente exporta
  Dado que o atendente está em «Minha fila»
  Quando ele exporta em PDF
  Então o arquivo traz só os casos dele e a trilha registra a exportação

Cenário 3: Ver a trilha
  Dado que o usuário é coordenador
  Quando ele tenta abrir «Trilha de exportação»
  Então o sistema não mostra a lista; só o administrador vê
```

**Regras de Negócio aplicáveis:** RN-NOVO-T-001, RN-NOVO-F5-007  
**Dependências:** —  
**Rastreabilidade:** F-079, F-010, F-124 (Explore RF-901)  
**Notas:** —

---

### RF-MOD-T-002: Busca e filtro padronizados

**Épico:** Transversais (MOD-T)  
**Funcionalidade:** Busca e filtro padronizados  
**ID no Explore:** RF-902 · **Telas:** TEL-003, TEL-010, TEL-032 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero filtrar por contribuinte ou documento, tributo, status, atraso, segmento e atendente em todas as listas,
para que eu possa achar o registro com até 3 filtros.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE oferecer nas listas do app o filtro por contribuinte ou documento, tributo, status, atraso, segmento e atendente, quando o campo existir na lista.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Filtrar por tributo
  Dado que o coordenador está em «Carteira consolidada»
  Quando ele filtra tributo = IPVA
  Então a lista mostra só débitos de IPVA

Cenário 2: Combinar filtros
  Dado que mesma lista
  Quando ele filtra IPVA e atraso maior que 90 dias
  Então a lista mostra só débitos de IPVA com mais de 90 dias

Cenário 3: Filtro sem resultado
  Dado que mesma lista
  Quando ele filtra um documento fictício que não existe
  Então a lista mostra «Nenhum registro»
```

**Regras de Negócio aplicáveis:** —  
**Dependências:** —  
**Rastreabilidade:** F-080, F-010, F-018 (Explore RF-902)  
**Notas:** —

---

### RF-MOD-T-003: Visão única do contribuinte (transversal)

**Épico:** Transversais (MOD-T)  
**Funcionalidade:** Visão única do contribuinte (transversal)  
**ID no Explore:** RF-903 · **Telas:** TEL-004, TEL-032 · **Critérios do plano:** —

**Descrição (User Story):**
Como Atendente de Cobrança,
quero encontrar a visão única do contribuinte a partir de qualquer módulo,
para que eu possa não repetir consulta.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE abrir a visão única do contribuinte (RF-MOD-F1-005) a partir do campo contribuinte de qualquer registro do app.

**Atores:** Atendente de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: A partir do caso
  Dado que o atendente está no dossiê
  Quando ele clica no contribuinte
  Então abre a visão única do contribuinte

Cenário 2: A partir da comunicação
  Dado que o coordenador está numa comunicação
  Quando ele clica no contribuinte
  Então abre a visão única

Cenário 3: Contribuinte de outra carteira
  Dado que o atendente vê um contribuinte citado em registro alheio
  Quando ele clica
  Então o sistema não mostra o registro
```

**Regras de Negócio aplicáveis:** RN-NOVO-F1-001, RN-NOVO-F5-007, RN-NOVO-T-002  
**Dependências:** RF-MOD-F1-005  
**Rastreabilidade:** F-081, F-010 (Explore RF-903)  
**Notas:** —

---

### RF-MOD-T-004: Marcação de origem da regularização (transversal)

**Épico:** Transversais (MOD-T)  
**Funcionalidade:** Marcação de origem da regularização (transversal)  
**ID no Explore:** RF-904 · **Telas:** TEL-020 · **Critérios do plano:** —

**Descrição (User Story):**
Como Coordenador de Cobrança,
quero que a origem da regularização seja a mesma em todos os módulos,
para que eu possa comparar canais e instrumentos sem ambiguidade.

**Enunciado EARS *(1 padrão)*:** O sistema DEVE usar a mesma marcação de origem (RF-MOD-F4-007) nas regularizações vindas da régua e do atendimento.

**Atores:** Coordenador de Cobrança  
**Prioridade MoSCoW:** Should  
**Complexidade:** Baixa

**Pré-condições:**
- Usuário autenticado com o papel indicado na matriz de acesso (`especificacao-funcional.md` §1.2).
- Dados fictícios do seed instalados.

**Critérios de Aceite (BDD):**

```gherkin
Cenário 1: Origem pela régua
  Dado que a regularização veio após SMS
  Quando ela é gravada
  Então origem «Resposta à cobrança», canal «SMS», instrumento «Régua»

Cenário 2: Origem pelo atendimento
  Dado que a regularização veio após interação no caso
  Quando ela é gravada
  Então origem «Resposta à cobrança», canal «Atendimento», instrumento «Qualificada»

Cenário 3: Origem ausente
  Dado que a regularização chega sem origem calculável
  Quando ela é gravada
  Então origem «Espontânea»
```

**Regras de Negócio aplicáveis:** RN-NOVO-F4-006  
**Dependências:** RF-MOD-F4-007  
**Rastreabilidade:** F-082, F-010 (Explore RF-904)  
**Notas:** —

---

<!-- id: reqfun-integrations -->

## Integrações negociais *(opcional)*

No piloto, toda integração é uma tabela simulada dentro do app (`inputs/simulacoes.md`).

| Sistema / fonte institucional | Finalidade para o processo | Efeito observável para o ator | RF relacionados |
|-------------------------------|----------------------------|-------------------------------|-----------------|
| Fontes de débito CCF, MPI/Big Data, IPVA, ITCD, SNE (SIM-03) | alimentar a carteira consolidada | débitos com origem, execuções por fonte e log de rejeições | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-006, RF-MOD-F1-007 |
| Modelo de score da UFMT (SIM-01) | priorizar a carteira | score no critério, no dossiê e no painel de cobertura | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-005, RF-MOD-F2-005 |
| Canais e-mail, SMS, SNE, WhatsApp (SIM-02) | entregar comunicações | status de entrega, fallback e reenvio | RF-MOD-F4-002, RF-MOD-F4-004, RF-MOD-F4-005, RF-MOD-F4-006 |
| Sinalizações coercitivas CCF/SNE/SUCOM | avisar o atendente | aviso no dossiê | RF-MOD-F5-004 |

<!-- id: rnf -->

## Requisitos Não Funcionais (negócio)

### RNF-SEGURANCA-002: Isolamento da carteira do atendente

**Categoria (ISO 25010):** Segurança
**Prioridade MoSCoW:** Must
**Módulo principal *(opcional)*:** MOD-F5

**Declaração:** o atendente nunca vê, por nenhum caminho (form, lista, relatório, lista relacionada ou exportação), registro de outro atendente.

**Cenário (6 partes):**
- Fonte do estímulo: usuário com papel atendente
- Estímulo: abre lista, relatório, endereço direto ou exportação de caso, contribuinte, interação ou regularização
- Ambiente: operação normal, seed com 2 atendentes demo
- Artefato: app Cobrança MT
- Resposta: o sistema mostra só os registros do próprio atendente
- Medida da resposta *(numérica — obrigatória)*: 0 registros de outro atendente em 100% das verificações de acesso do plano de testes

**Métrica mensurável:**
- Indicador: registros alheios visíveis ao atendente
- Valor alvo: 0
- Condições: todas as telas do atendente (TEL-004, TEL-023, TEL-024, TEL-025, TEL-031) e exportação

**Critério de aceite:** casos de acesso do `test-plan.md` para RF-MOD-F5-007 passam.

**Método de verificação:** teste automatizado de acesso com usuário demo de cada atendente, mais teste de homologação.

**Rastreabilidade:** F-016, F-070, F-145, INF-002
**Vinculado a:** RN-NOVO-F5-007, RF-MOD-F5-007, RF-MOD-F6-006

---

### RNF-SEGURANCA-001: Só dado fictício no piloto

**Categoria (ISO 25010):** Segurança
**Prioridade MoSCoW:** Must

**Declaração:** nenhum dado real de contribuinte entra no app, no repositório ou no backlog (sigilo fiscal e LGPD).

**Cenário (6 partes):**
- Fonte do estímulo: instalação do app ou publicação de documento
- Estímulo: gravação de registro de pessoa ou publicação de `.md`
- Ambiente: ambiente do piloto
- Artefato: seed do app e documentos de `outputs/`
- Resposta: todo registro de pessoa tem a marca de fictício e o documento consta da lista de fictícios; documentos passam no verificador de dado sensível
- Medida da resposta *(numérica — obrigatória)*: 100% dos registros de pessoa com `ficticio = true`; nota do verificador menor que 40 em 100% dos `.md`

**Métrica mensurável:**
- Indicador: registros de pessoa sem a marca; documentos com nota ≥ 40
- Valor alvo: 0
- Condições: a cada instalação e a cada publicação

**Critério de aceite:** contagem zero nas duas métricas.

**Método de verificação:** conferência do seed contra a lista de documentos fictícios e `check_sensivel.py`.

**Rastreabilidade:** F-089, F-125, F-170
**Vinculado a:** RN-NOVO-T-002

---

### RNF-SEGURANCA-003: Registro de ação relevante

**Categoria (ISO 25010):** Segurança
**Prioridade MoSCoW:** Must

**Declaração:** publicação de critério, reenvio, interação, encerramento e exportação ficam registrados com autor e hora.

**Cenário (6 partes):**
- Fonte do estímulo: coordenador ou atendente
- Estímulo: executa uma das ações relevantes
- Ambiente: operação normal
- Artefato: registro afetado e trilha de exportação
- Resposta: o sistema grava autor, data, hora e resultado
- Medida da resposta *(numérica — obrigatória)*: 100% das ações relevantes com autor e hora registrados

**Métrica mensurável:**
- Indicador: ações relevantes sem registro
- Valor alvo: 0
- Condições: todas as tabelas com form têm histórico ligado

**Critério de aceite:** casos de regra de RN-NOVO-F5-005 e RN-NOVO-T-001 passam.

**Método de verificação:** teste automatizado e consulta ao histórico do registro.

**Rastreabilidade:** F-069, F-079
**Vinculado a:** RN-NOVO-F5-005, RN-NOVO-T-001

---

### RNF-DESEMPENHO-001: Indicadores em tempo quase-real

**Categoria (ISO 25010):** Desempenho
**Prioridade MoSCoW:** Should
**Módulo principal *(opcional)*:** MOD-F6

**Declaração:** a regularização aparece no funil e nos relatórios sem extração manual.

**Cenário (6 partes):**
- Fonte do estímulo: regularização registrada
- Estímulo: o coordenador abre o funil ou o relatório por origem
- Ambiente: ambiente do piloto com até 300 registros por tabela
- Artefato: relatórios TEL-026 a TEL-028
- Resposta: o relatório já inclui a regularização
- Medida da resposta *(numérica — obrigatória)*: até 60 segundos entre a regularização e o relatório atualizado; relatório abre em até 3 segundos com 300 registros por tabela

**Métrica mensurável:**
- Indicador: atraso entre regularização e relatório
- Valor alvo: ≤ 60 s
- Condições: volume do seed do Plan

**Critério de aceite:** caso de teste do CT-MOD-F6-001 passa no tempo.

**Método de verificação:** teste de homologação cronometrado.

**Rastreabilidade:** F-072, F-153
**Vinculado a:** RF-MOD-F6-001, GAP-011

---

### RNF-CONFIABILIDADE-002: Degradação segura das integrações

**Categoria (ISO 25010):** Confiabilidade
**Prioridade MoSCoW:** Must

**Declaração:** falha numa integração (fonte, score ou canal) não para o restante do processo.

**Cenário (6 partes):**
- Fonte do estímulo: integração simulada com falha ligada
- Estímulo: consolidação, qualificação ou disparo roda
- Ambiente: 1 fonte, o modelo de score ou 1 canal com falha
- Artefato: consolidação, segmentação e régua
- Resposta: o processo conclui com o que está disponível e registra a falha
- Medida da resposta *(numérica — obrigatória)*: 100% dos débitos das fontes sem falha consolidados; 100% da carteira segmentada em fallback quando o score falha

**Métrica mensurável:**
- Indicador: registros perdidos por falha de outra integração
- Valor alvo: 0
- Condições: interruptores de falha do seed

**Critério de aceite:** CT-MOD-F1-005 e CT-MOD-F3-003 passam.

**Método de verificação:** teste automatizado com os interruptores de falha.

**Rastreabilidade:** F-020, F-140, F-165, F-169
**Vinculado a:** RN-NOVO-F1-005, RN-NOVO-F3-002, RN-NOVO-F4-004

---

### RNF-CONFIABILIDADE-001: App reinstalável do zero

**Categoria (ISO 25010):** Confiabilidade
**Prioridade MoSCoW:** Must

**Declaração:** o app inteiro volta numa instância zerada a partir do repositório, com um comando.

**Cenário (6 partes):**
- Fonte do estímulo: FDE
- Estímulo: roda a reinstalação duas vezes seguidas
- Ambiente: instância de desenvolvedor zerada ou existente
- Artefato: app, roles, ACLs, usuários demo e seed
- Resposta: o app fica igual nas duas execuções
- Medida da resposta *(numérica — obrigatória)*: diferença de 0 registros por tabela entre as duas execuções e contra a contagem esperada do seed

**Métrica mensurável:**
- Indicador: diferença de contagem
- Valor alvo: 0
- Condições: mesmo commit

**Critério de aceite:** linha de instalação «ok» no sync-log com a contagem igual.

**Método de verificação:** reinstalação dupla.

**Rastreabilidade:** F-088, F-090
**Vinculado a:** decisão A9 do design

---

### RNF-MANUTENIBILIDADE-001: Nenhum objeto do app fora do repositório

**Categoria (ISO 25010):** Manutenibilidade
**Prioridade MoSCoW:** Must

**Declaração:** tudo o que o app tem na instância nasce do código versionado no repositório; nada é criado à mão na instância.

**Cenário (6 partes):**
- Fonte do estímulo: FDE ou revisor
- Estímulo: compara os objetos do escopo na instância com os arquivos do repositório
- Ambiente: depois de uma reinstalação
- Artefato: escopo `x_2326104_cob`
- Resposta: cada objeto da instância tem arquivo de origem no repositório
- Medida da resposta *(numérica — obrigatória)*: 0 objetos do escopo sem arquivo de origem

**Métrica mensurável:**
- Indicador: objetos criados fora do repositório
- Valor alvo: 0
- Condições: todo commit que muda o app

**Critério de aceite:** a reinstalação numa instância zerada reproduz o app inteiro.

**Método de verificação:** reinstalação em instância zerada e comparação de contagem.

**Rastreabilidade:** F-085, F-090
**Vinculado a:** decisão A3 do design, RNF-CONFIABILIDADE-001

---

### RNF-USABILIDADE-001: Interface padrão em português

**Categoria (ISO 25010):** Usabilidade
**Prioridade MoSCoW:** Must

**Declaração:** todas as telas usam a interface padrão da plataforma (Core UI) com rótulos em português.

**Cenário (6 partes):**
- Fonte do estímulo: coordenador ou atendente
- Estímulo: abre qualquer tela do app
- Ambiente: navegador de mesa, 1440×900
- Artefato: 33 telas
- Resposta: rótulos, mensagens e opções em português do Brasil
- Medida da resposta *(numérica — obrigatória)*: 100% dos rótulos de tabela, campo e opção em português; 33 de 33 telas com print tirado na visão do papel

**Métrica mensurável:**
- Indicador: rótulos fora do português
- Valor alvo: 0
- Condições: 33 telas do manifesto

**Critério de aceite:** revisão dos prints da instância.

**Método de verificação:** inspeção dos prints `screens/TEL-*.png`.

**Rastreabilidade:** F-017, F-086
**Vinculado a:** PR de todas as telas

---

<!-- id: rf-rnf-matrix -->

## Matriz RF ↔ RNF

| RF | Título | Módulo | RNFs impactados |
|----|--------|--------|-----------------|
| RF-MOD-F1-001 | Consolidação periódica das 5 fontes | MOD-F1 | RNF-SEGURANCA-001, RNF-CONFIABILIDADE-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F1-002 | Vínculo do débito ao contribuinte e sobreposição | MOD-F1 | RNF-SEGURANCA-001, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F1-003 | Atualização intraciclo da regularização | MOD-F1 | RNF-DESEMPENHO-001, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F1-004 | Alerta de parcelamento em risco | MOD-F1 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F1-005 | Visão única do contribuinte | MOD-F1 | RNF-SEGURANCA-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F1-006 | Transição MPI → Big Data sem ruptura | MOD-F1 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F1-007 | Status de cada integração | MOD-F1 | RNF-CONFIABILIDADE-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F2-001 | Parametrização de critérios | MOD-F2 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F2-002 | Versionamento imutável do critério | MOD-F2 | RNF-SEGURANCA-003, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F2-003 | Segmentação massificada × qualificada | MOD-F2 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F2-004 | Sorteio do grupo de controle por ciclo | MOD-F2 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F2-005 | Score como critério com fallback | MOD-F2 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F2-006 | Prévia da carteira antes de publicar | MOD-F2 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F3-001 | Ingestão e normalização do score | MOD-F3 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F3-002 | Score como variável de priorização | MOD-F3 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F3-003 | Score no dossiê | MOD-F3 | RNF-SEGURANCA-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F3-004 | Atualização periódica do score | MOD-F3 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F3-005 | Fallback determinístico sem score | MOD-F3 | RNF-CONFIABILIDADE-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F3-006 | Cobertura e qualidade do score | MOD-F3 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-001 | Editor de régua | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-002 | Disparo automático | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-003 | Escalonamento por comportamento | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-004 | Multicanal com fallback | MOD-F4 | RNF-CONFIABILIDADE-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-005 | Opt-in e opt-out por canal | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-006 | Status de entrega e reenvio | MOD-F4 | RNF-SEGURANCA-003, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-007 | Origem da regularização | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-008 | Efetividade da régua | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F4-009 | Encaminhamento à cobrança qualificada | MOD-F4 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-001 | Distribuição automática de casos | MOD-F5 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-002 | Fila priorizada do atendente | MOD-F5 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-003 | Dossiê consolidado do caso | MOD-F5 | RNF-SEGURANCA-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-004 | Sinalização de medida coercitiva | MOD-F5 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-005 | Registro estruturado de interações | MOD-F5 | RNF-SEGURANCA-002, RNF-SEGURANCA-003, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-006 | Encerramento por regularização | MOD-F5 | RNF-SEGURANCA-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F5-007 | Visão restrita do atendente | MOD-F5 | RNF-SEGURANCA-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-001 | Funil do crédito | MOD-F6 | RNF-DESEMPENHO-001, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-002 | KPIs com metas | MOD-F6 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-003 | Origem da regularização no monitoramento | MOD-F6 | RNF-DESEMPENHO-001, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-004 | Efeito incremental por ciclo | MOD-F6 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-005 | IPVA e ITCD no monitoramento | MOD-F6 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-006 | Visões por perfil | MOD-F6 | RNF-SEGURANCA-002, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-F6-007 | Insumos para revisão da estratégia | MOD-F6 | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-T-001 | Exportação com trilha | MOD-T | RNF-SEGURANCA-002, RNF-SEGURANCA-003, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-T-002 | Busca e filtro padronizados | MOD-T | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-T-003 | Visão única do contribuinte (transversal) | MOD-T | RNF-SEGURANCA-002, RNF-SEGURANCA-001, RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |
| RF-MOD-T-004 | Marcação de origem da regularização (transversal) | MOD-T | RNF-CONFIABILIDADE-001, RNF-MANUTENIBILIDADE-001, RNF-USABILIDADE-001 |

<!-- id: reqfun-open-questions -->

## Questões em aberto

| QA | Descrição | Onde aparece | Sugestão de tratamento |
|----|-----------|---------------|-------------------------|
| QA-01 | F4 RF-10 do material refinado (bloqueio de template com campo sob sigilo fiscal em canal não autenticado) e CT extras do refinado não entram na contagem do plano | matriz de cobertura | já registrado em GAP-017 |
| QA-02 | Prioridade dos 6 candidatos a corte; o piloto mantém todos | MoSCoW de RF-MOD-F3-*, RF-MOD-F4-004, RF-MOD-F5-004, RF-MOD-F6-007 | já registrado em GAP-018 |
