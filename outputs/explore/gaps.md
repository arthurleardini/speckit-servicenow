# GAPs e Questões Abertas — Cobrança MT (2.6 Cobrança, SEFAZ-MT)

> **Fase:** Explore · **Versão:** 0.1 · **KERNEL — registro único de questões abertas.**
> **Documentos irmãos:** [HLD](./hld-funcional.md) · [Funcional](./especificacao-funcional.md) · [Técnica](./especificacao-tecnica.md) · [Modelo de Dados](./modelo-de-dados.md)
>
> Premissas adotadas no v0: `inputs/premissas-ficticias.md`. GAP com premissa fica 🟡 até a validação com a Coordenação de Cobrança.

> **Legenda de Status:** ✅ Respondido · 🟡 Parcialmente · ⏳ Aguardando

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial |
| 0.2 | 2026-11-24 | Plan: GAP-013 atualizado (reports instalados na instância) |
| 0.3 | 2026-11-25 | Change ux-v1 (design UX v1.1, R1–R8): GAP-021 a GAP-024 registram os cortes da reformulação de UX |

## Questões abertas

| ID | Descrição | Status | Impacto | Responsável |
|---|---|---|---|---|
| GAP-001 | Frequência do ciclo de consolidação e qualificação não definida no plano (risco F1). Premissa P1: **mensal**. Afeta RF-101, RF-203, RF-204 | 🟡 Parcialmente | alto | Coordenação de Cobrança (CPRF) |
| GAP-002 | Regra de desempate entre massificada e qualificada não definida (risco F2). Premissa P2: **maior débito, depois o mais antigo**. Afeta RF-203 | 🟡 Parcialmente | médio | Coordenação de Cobrança (CPRF) |
| GAP-003 | Tamanho padrão do grupo de controle a confirmar (risco F2). Premissa P3: **10% da carteira por ciclo**. Afeta RF-204, RF-604 | 🟡 Parcialmente | alto | Coordenação de Cobrança (CPRF) |
| GAP-004 | Ordem de fallback entre canais a confirmar (risco F4). Premissa P4: **SNE → e-mail → SMS**. Afeta RF-404 | 🟡 Parcialmente | médio | Coordenação de Cobrança (CPRF) |
| GAP-005 | Níveis efetivamente disponíveis do dossiê (grupo econômico, situação patrimonial) a confirmar (risco F5). Premissa P5: **3 níveis** — débitos e parcelamentos; comunicações, interações e regularizações; score e sinalizações coercitivas. Afeta RF-503, RF-504 | 🟡 Parcialmente | médio | Coordenação de Cobrança (CPRF) |
| GAP-006 | Regra de sobreposição entre fontes não definida (risco F1). No v0 o seed planta um documento sobreposto (CCF e SNE) e marca `sobreposto = true`; a regra de qual fonte prevalece fica em aberto. Afeta RF-102, RN-001 | ⏳ Aguardando | alto | Coordenação de Cobrança + TI SEFAZ-MT |
| GAP-007 | Modelo de atribuição causal por canal e janela de 30 dias a confirmar (riscos F4 e F6). O v0 usa 30 dias (RN-016). Afeta RF-407, RF-603 | 🟡 Parcialmente | médio | Coordenação de Cobrança (CPRF) |
| GAP-008 | Contrato técnico do output da UFMT (API ou arquivo), escala do score e data de disponibilidade do modelo em aberto (riscos F3). SIM-01 usa escala 0–100 só para simulação. Afeta RF-301, RF-302 | ⏳ Aguardando | alto | UFMT + TI SEFAZ-MT |
| GAP-009 | Status do contrato de WhatsApp em aberto (risco F4). SIM-02 traz o canal com `contratado = false` e opt-in exigido. Afeta RF-404, RF-405 | ⏳ Aguardando | médio | SEFAZ-MT |
| GAP-010 | Capacidade máxima por atendente não definida (risco F5). O v0 distribui só por vínculo e balanceamento, sem teto. Afeta RF-501 | ⏳ Aguardando | médio | Coordenação de Cobrança (CPRF) |
| GAP-011 | Fonte do pipeline em tempo real (CCF/Oracle) a confirmar (risco F6). O v0 calcula os reports sobre as tabelas do app. Afeta RF-601 | ⏳ Aguardando | médio | TI SEFAZ-MT |
| GAP-012 | Dossiê consolidado em tela única (F5): a Core UI clássica entrega o dossiê como form do caso (TEL-024) com seções e related lists; débitos, parcelamentos e comunicações entram por relacionamento sobre o `contribuinte` do caso. Não há layout livre de tela única. Afeta RF-503, RF-504, RF-303 | 🟡 Parcialmente | médio | FDE + Coordenação de Cobrança |
| GAP-013 | Painel de KPIs (F6): a Core UI clássica entrega reports simples (TEL-026, 027, 028, 031) e a list de efeito incremental (TEL-029), não um painel único com metas sobrepostas. Os 7 reports (TEL-011, 016, 022, 026, 027, 028, 031) instalaram pelo app e foram fotografados (`screens-manifest.json`, 2026-11-24); a alternativa de list com group-by não é necessária. Fica em aberto só o painel único com metas sobrepostas. Afeta RF-601, RF-602, RF-604, RF-606 | 🟡 Parcialmente | médio | FDE + Coordenação de Cobrança |
| GAP-014 | Premissas do plano (7 temas: banco de horas, ritos, ambientes, dados e integrações, homologação, treinamento e OA, mudanças de escopo) e horas técnicas estão "[preencher]" no plano | ⏳ Aguardando | baixo | EloGroup + SEFAZ-MT |
| GAP-015 | Cronograma da transição MPI → Big Data (P2.2) não detalhado no plano. O v0 trata `mpi_bigdata` como uma origem única. Afeta RF-106 | ⏳ Aguardando | médio | TI SEFAZ-MT |
| GAP-016 | Fonte e formato das sinalizações coercitivas de outras coordenadorias (CCF/SNE/SUCOM). O v0 preenche `sinal_coercitivo` pelo seed. Afeta RF-504 | ⏳ Aguardando | médio | Coordenação de Cobrança + TI SEFAZ-MT |
| GAP-017 | Itens do material refinado acima da contagem do plano ficaram sem mapeamento: F1 CT-07 a 09, F3 CT-06, F4 item 10 de RF do refinado (bloqueio de template com campo sob sigilo fiscal em canal não autenticado) e F4 CT-06 e 07. Decidir se entram no Plan | ⏳ Aguardando | médio | FDE + Coordenação de Cobrança |
| GAP-018 | Seis candidatos a corte "Em discussão" no plano: WhatsApp (F4), score UFMT (F3), grupo de controle com priorização por score (F2/F6), recalibração do score (F3), sinalização coercitiva no dossiê (F5), insumos analíticos automáticos (F6). O v0 mantém todos | ⏳ Aguardando | médio | SEFAZ-MT |
| GAP-019 | Valores das metas formais por tributo, canal e instrumento não constam no plano. O seed de `x_2326104_cob_meta` usa valores fictícios. Afeta RF-602, RF-605 | ⏳ Aguardando | baixo | Coordenação de Cobrança (CPRF) |
| GAP-020 | Domínio de "instrumento" no critério de qualificação não listado no plano; no v0 é texto livre (`instrumento`, string). Afeta RF-201 | ⏳ Aguardando | baixo | Coordenação de Cobrança (CPRF) |
| GAP-021 | Regra que encerra os contatos abertos da lista ativa quando o contribuinte regulariza (RN-09 do design UX v1) cortada do v1. Hoje o contato só sai da lista por «Registrar ligação» ou «Encerrar» com motivo «regularizado», feitos pelo atendente. Falta definir momento da regra (before/after insert da regularização), o que conta como «aberto» e a relação com o grupo de controle. Afeta STORY-MOD-UX-003, RF-MOD-F5-006 | ⏳ Aguardando | médio | Coordenação de Cobrança (CPRF) + FDE |
| GAP-022 | Painel único da cobrança (`Dashboard()` do Platform Analytics) cortado do v1 (R5): a Core UI clássica entrega os números como 4 entradas da área Analytics do menu: reports TEL-026 (funil do crédito), TEL-027 (regularizações por tributo), TEL-028 (por origem e canal) e a lista TEL-029 (efeito incremental por ciclo), conforme a regra de UI do projeto (painel que a Core UI não faz vira report ou lista). A home do coordenador passa a ser «Casos qualificados». Fica em aberto o painel único com widgets cruzando duas fontes (regularizado × meta, efeito × controle). Complementa GAP-013 | 🟡 Parcialmente | médio | FDE + Coordenação de Cobrança |
| GAP-023 | Ação «Gerar prévia» do ciclo cortada do v1 (R2): o fluxo do ciclo fica Publicar (sorteio do grupo de controle e totais, já existente) → Distribuir lista, 2 botões no mesmo registro. Falta o algoritmo da prévia (ler o critério publicado, apagar e recriar a carteira segmentada do ciclo, idempotente, sem gravar campos protegidos). Afeta STORY-MOD-F2-003, STORY-MOD-F2-006, STORY-MOD-UX-004 | ⏳ Aguardando | médio | FDE |
| GAP-024 | Quadro Kanban (Visual Task Board) dos casos e contatos fora do v1: a etapa aparece como lista ordenada por etapa e prioridade («Casos qualificados», `ORDERBYestagio^ORDERBYDESCprioridade`) mais a trilha de etapas (process flow) no topo do form de contato, caso e ciclo. Agrupamento visual por etapa e arrastar entre colunas ficam em aberto. Afeta STORY-MOD-UX-005, STORY-MOD-UX-008 | ⏳ Aguardando | baixo | FDE + Coordenação de Cobrança |

## Dispensas registradas

Nenhuma dispensa: os cinco documentos do Explore foram produzidos, inclusive o `modelo-de-dados.md`.
