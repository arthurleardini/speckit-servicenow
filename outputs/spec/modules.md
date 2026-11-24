# Registro Canônico de Módulos — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft
Última atualização: 2026-11-24
Fonte de verdade para todos os documentos. Códigos `MOD-XXX` usados em `requirements.md`, `business-rules.md`, `product-requirements.md` e `gaps.md` correspondem a uma linha desta tabela.

Os códigos repetem os do Explore (`outputs/explore/hld-funcional.md` §2) e os prefixos de requisito do `inputs/de-para-ids.md` (`RF-MOD-F<n>-<nnn>`, `RF-MOD-T-<nnn>`). Cada módulo é uma funcionalidade do Plano 2.6 Cobrança.

<!-- id: modules-registry -->

## Catálogo

| Código | Nome canônico (linguagem do cliente) | Aliases aceitos | Atores primários | Objetivo de negócio (1 frase) | Limites (o que NÃO faz) | Status |
|--------|--------------------------------------|-----------------|------------------|-------------------------------|-------------------------|--------|
| MOD-F1 | Ingestão e Carteira Consolidada | F1; Épico 1 Ingestão e Fonte de Dados | Coordenador; Atendente (visão única da própria carteira); Sistema | Juntar os débitos das 5 fontes numa visão única por contribuinte, atualizada dentro do ciclo | Não decide qual fonte prevalece na sobreposição (GAP-006); não integra de verdade no piloto (SIM-03) | ativo |
| MOD-F2 | Qualificação e Parametrização da Carteira | F2; Épico 2 Qualificação | Coordenador | Separar a carteira em massificada e qualificada com critérios versionados e sortear o grupo de controle de cada ciclo | Não calcula score; não dispara comunicação | ativo |
| MOD-F3 | Scoring de Liquidez | F3; score UFMT | Coordenador; Atendente (leitura no dossiê) | Usar o score da UFMT como variável de priorização, com fallback quando faltar | Não desenvolve nem recalibra o modelo (RN-NOVO-F3-003) | ativo |
| MOD-F4 | Réguas de Cobrança Multicanal | F4; régua; Épico 3 Cobrança Automatizada | Coordenador; Sistema | Disparar e escalonar comunicações por canal sem confirmação manual, marcando a origem de cada regularização | Não envia de verdade no piloto (SIM-02); WhatsApp sem contrato | ativo |
| MOD-F5 | Cobrança Qualificada | F5; operação do atendente; Épico 4 | Coordenador; Atendente | Distribuir os casos da carteira qualificada e dar ao atendente fila e dossiê da própria carteira | Não executa medida coercitiva nem aciona a PGE (RN-NOVO-F5-004) | ativo |
| MOD-F6 | Monitoramento, KPIs e Grupo de Controle | F6; KPIs; Épico 5 | Coordenador; Atendente (só os próprios indicadores) | Mostrar o funil, os KPIs contra metas e o efeito incremental de cada ciclo | Não tem painel único com metas sobrepostas (GAP-013) | ativo |
| MOD-T | Transversais | RF-T; transversal | Coordenador; Atendente; Administrador | Exportação com trilha, busca e filtro padronizados, visão única e origem da regularização em todos os módulos | Não tem tela própria além da trilha de exportação | ativo |

**Convenções:**
- **Código:** prefixo `MOD-` + código da funcionalidade do plano.
- **Nome canônico:** a forma exata dos títulos `## Módulo:` dos demais documentos.
- **Status:** `ativo` para todos — o piloto mantém os 6 candidatos a corte (GAP-018).

---

## Regras de uso

1. **Toda referência a módulo** em qualquer documento usa o código canônico desta tabela.
2. **Adição de módulo** só após revisão do Passo 3.0 do `spec-product`.
3. **Renomeação** registra o alias antigo na coluna Aliases.
4. **Validação automática:** `python3 .claude/skills/tools/check-modules.py`.

---

## Histórico de mudanças no catálogo

| Data | Mudança | Motivo |
|------|---------|--------|
| 2026-11-24 | Versão inicial | Passo 3.0 do `spec-product`; lista candidata = módulos do Explore, confirmada no kickoff (sync-log) |
