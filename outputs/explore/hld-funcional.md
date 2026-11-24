# HLD Funcional — Cobrança MT (2.6 Cobrança, SEFAZ-MT)

> **Fase:** Explore · **Versão:** 0.1 · **Status:** preliminar
> **Documentos irmãos:** [Funcional](./especificacao-funcional.md) · [Técnica](./especificacao-tecnica.md) · [Modelo de Dados](./modelo-de-dados.md) · [GAPs](./gaps.md)
>
> Fonte: `inputs/plano-2.6-cobranca.md`. Correspondência de IDs com o plano e com o Plan: `inputs/de-para-ids.md`. Ambiente de demonstração com dados fictícios.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial a partir do Plano de Implementação 2.6 Cobrança |

## 1. Visão geral do produto/solução

O Cobrança MT é o sistema de cobrança da Coordenação de Cobrança (CPRF) da SEFAZ-MT, construído como app escopado `x_2326104_cob` no ServiceNow. A v1 entrega o ciclo completo de cobrança:

1. consolida os débitos de CCF, MPI/Big Data, IPVA, ITCD e SNE numa visão única do contribuinte;
2. qualifica a carteira por critérios parametrizáveis e versionados, com score de liquidez da UFMT quando disponível e fallback determinístico sem ele;
3. dispara réguas multicanal (e-mail, SMS, SNE; WhatsApp condicionado a contratação e opt-in) para as 5 carteiras prioritárias: parcelamentos, IPVA, ITCD, ICMS Normal e ICMS ST;
4. distribui a carteira qualificada aos atendentes, com dossiê do contribuinte e registro de interações;
5. mede KPIs em tempo quase-real e o efeito incremental da cobrança contra um grupo de controle sorteado por ciclo.

Perfis: Coordenador de Cobrança (dono do produto), Atendente de Cobrança (usuário-chave) e administrador do app. O produto integra e usa o score da UFMT; o modelo é desenvolvido e recalibrado pela UFMT. Medidas coercitivas e articulação com a PGE ficam fora do sistema: o dossiê sinaliza, não executa.

No piloto do Speckit ServiceNow, as integrações externas são simuladas (SIM-01 score UFMT, SIM-02 canais, SIM-03 fontes de débito; `inputs/simulacoes.md`), e os parâmetros que o plano deixa em aberto usam as premissas de `inputs/premissas-ficticias.md`.

## 2. Visão geral dos módulos

| Código | Módulo | Propósito |
|---|---|---|
| MOD-F1 | Ingestão e Carteira Consolidada | Consolidar débitos das 5 fontes por contribuinte, com status intraciclo e alerta de parcelamento em risco |
| MOD-F2 | Qualificação e Parametrização da Carteira | Critérios versionados, segmentação massificada × qualificada e sorteio do grupo de controle por ciclo |
| MOD-F3 | Scoring de Liquidez | Ingerir o score da UFMT e usá-lo como variável de priorização, com fallback sem score |
| MOD-F4 | Réguas de Cobrança Multicanal | Desenhar e disparar réguas escalonadas por canal, com opt-in e marcação de origem da regularização |
| MOD-F5 | Cobrança Qualificada | Distribuir casos aos atendentes, montar o dossiê e registrar interações |
| MOD-F6 | Monitoramento, KPIs e Grupo de Controle | Funil do crédito, KPIs com metas e efeito incremental contra o grupo de controle |
| MOD-T | Transversais | Exportação com trilha, busca e filtro padronizados, visão única do contribuinte e origem da regularização |

## 3. Visão por módulo — principais funcionalidades

### MOD-F1 — Ingestão e Carteira Consolidada

- Consolidação periódica de CCF, MPI/Big Data, IPVA, ITCD e SNE, com origem registrada por débito.
- Vínculo do débito ao contribuinte por CPF/CNPJ, com resolução de sobreposição; documento inválido rejeitado e logado.
- Atualização intraciclo da regularização e do parcelamento; alerta de inadimplência parcial.
- Visão única do contribuinte com débitos, parcelamentos e comunicações.
- Status de cada integração e transição MPI → Big Data sem ruptura.

### MOD-F2 — Qualificação e Parametrização da Carteira

- Critérios por valor, tributo, atraso, instrumento e exclusões.
- Versão publicada imutável; editar cria nova versão, e a carteira guarda a versão aplicada.
- Segmentação automática massificada × qualificada, com prévia antes de publicar.
- Sorteio do grupo de controle a cada ciclo, fora das ações de cobrança.
- Score como critério quando disponível; sem score, só critérios determinísticos.

### MOD-F3 — Scoring de Liquidez

- Ingestão e normalização do output da UFMT.
- Score como variável de priorização com threshold configurável; exibido no dossiê.
- Fallback determinístico e marca "sem score".
- Painel de cobertura por tributo, versão do modelo e última ingestão.

### MOD-F4 — Réguas de Cobrança Multicanal

- Editor de régua: etapas, offsets, canais e templates por carteira.
- Disparo automático e escalonamento por comportamento, sem confirmação manual em lote.
- Opt-in/opt-out por canal; status de entrega e reenvio de falhas.
- Marcação de origem da regularização; encaminhamento à qualificada de quem esgota a régua.

### MOD-F5 — Cobrança Qualificada

- Distribuição automática por vínculo, balanceamento e prioridade.
- Fila do atendente priorizada por score/estágio.
- Dossiê consolidado com sinalização de medidas coercitivas de outras coordenadorias.
- Registro estruturado de interações e encerramento ao detectar regularização.
- Atendente vê só a própria carteira.

### MOD-F6 — Monitoramento, KPIs e Grupo de Controle

- Funil do crédito: identificado → notificado → regularizado.
- KPIs por tributo, canal, instrumento e atendente, com metas formais; IPVA e ITCD incluídos.
- Origem da regularização: espontânea × resposta à cobrança.
- Efeito incremental: taxa da carteira cobrada menos a do grupo de controle.
- Visão completa do coordenador e individual do atendente.

### MOD-T — Transversais

- Exportação CSV/PDF com registro em trilha de auditoria.
- Busca e filtro padronizados.
- Visão única do contribuinte (lar em MOD-F1) e marcação de origem da regularização (lar em MOD-F4).
