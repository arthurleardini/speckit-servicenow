# spec-tech-rules

**Fase 6.5 do fluxo de especificação** — gera as regras técnicas de implementação de um projeto antes de `spec-data-model`.

---

## O que é

Uma skill interativa que lê os documentos de negócio já gerados (`discovery-document.md`, `requirements.md`, `product-requirements.md`), monta um perfil do projeto e conduz um kickoff estruturado de decisões técnicas. Ao final, gera as rules em `outputs/spec/tech-rules/*.mdc` (fonte versionada) e **materializa cópias diretamente** em `.cursor/rules/` e/ou `.claude/rules/` do repositório de implementação, conforme o ambiente escolhido no kickoff — nada a copiar manualmente.

Esses arquivos são o "constitution" técnico do projeto — todo agente de IA que implementar neste projeto lerá essas regras automaticamente: o Cursor via `globs`/`alwaysApply` em `.cursor/rules/*.mdc`, o Claude Code/Cowork via `paths` (ou sempre, se ausente) em `.claude/rules/*.md`.

---

## Posição no fluxo

```
spec-product
    ↓
spec-iterate
    ↓
spec-tech-rules  ◄ você está aqui
    ↓
spec-hld → revisao-de-seguranca
    ↓
spec-data-model
    ↓
spec-test-plan
    ↓
spec-tasks
```

---

## Como invocar

No Cursor ou no Claude (Code/Cowork), digitar qualquer um destes triggers:

- `criar regras técnicas`
- `definir arquitetura`
- `tech rules`
- `setup técnico`
- `definir stack`
- `regras de implementação`
- `configurar cursor rules`

---

## O que a skill faz

### Passo 0 — Leitura de contexto

Antes de qualquer pergunta, lê os documentos de produto e extrai sinais que fundamentam as sugestões:

| Sinal | Fonte |
|-------|-------|
| Volume / SLO de latência | RNF em `requirements.md` |
| Dados pessoais / LGPD | `business-rules.md` |
| Integrações externas | `context-map.md`, `discovery-document.md` |
| Módulos de negócio | Seções `## Módulo:` em `requirements.md` |
| Fluxos de UI | `product-requirements.md` |
| Regras de negócio complexas | `business-rules.md` |
| Equipe / prazo | `discovery-document.md` |
| Cliente governamental | `discovery-document.md` |

Toda sugestão cita o documento e a seção que a embasa. Exemplo:
> *"business-rules.md §RN-F5-007 diz que o atendente só vê a própria carteira → ACL de linha em caso e contribuinte"*

### Passos 1–2 — Kickoff interativo (10 blocos, alvo ServiceNow)

Vários itens já vêm decididos pelo repositório (escopo e nome em `app/now.config.json`, versões do SDK
em `app/package.json`, instância no `.env.example`) e aparecem como informação, com a fonte.

| Bloco | Decisões cobertas |
|-------|------------------|
| 1 — Linguagem e Runtime | Fluent + Glide (informação), idioma dos identificadores, Core UI clássica (informação) |
| 2 — Arquitetura | Escopo do app, onde vai cada regra (configurar antes de customizar), tabela/script de outro escopo |
| 3 — Persistência | Tabelas da plataforma, histórico (journal + audit), indicadores (report × gravado), volume do seed |
| 4 — Convenções | Nomenclatura fixa (informação), formato de mensagem ao usuário |
| 5 — Testes | Camadas ATF (informação), ATF de form (desfecho do teste de viabilidade), suíte de regressão |
| 6 — Observabilidade | `gs.*` e system log (informação), propriedade de nível de log |
| 7 — Auth e Autorização | Roles por papel, ACL de linha, LGPD (informação), cross-scope |
| 8 — Deploy e Build | Instância (informação), ambientes, branching |
| 9 — Frontend | Core UI clássica (informação), acessibilidade WCAG 2.2 AA (informação), i18n |
| 10 — Integrações | Integrações simuladas `SIM-` de `inputs/simulacoes.md` |

### Passo 3 — Revisão consolidada

Apresenta resumo de todas as decisões para confirmação antes de gerar.

### Passo 4 — Geração dos arquivos

Copia cada template de `templates/`, substitui todos os placeholders `{{...}}` com os valores reais, e salva em `outputs/spec/tech-rules/`. Na `security.mdc`, só o bloco do projeto muda.

### Passos 5–6 — Sumário e sync-log

Gera `tech-rules-summary.md` com todas as decisões e justificativas, e registra entrada no `sync-log.md`.

---

## Arquivos gerados (alvo ServiceNow)

| Arquivo | `alwaysApply` | Quando gerar |
|---------|--------------|--------------|
| `security.mdc` | `false` (`app/src/**`) | Sempre — parte fixa da plataforma + bloco do projeto |
| `architecture.mdc` | `false` | Sempre |
| `conventions.mdc` | `true` | Sempre |
| `test-strategy.mdc` | `false` | Sempre |
| `deploy-and-build.mdc` | `false` | Sempre |

A tela segue a rule do harness `.claude/rules/harness/servicenow-ui.md` (Core UI clássica). Após gerados, as rules já estão materializadas em `.cursor/rules/*.mdc` e/ou `.claude/rules/*.md`, conforme o ambiente escolhido no kickoff — nenhuma cópia manual é necessária.

---

## Estrutura de arquivos da skill

```
spec-tech-rules/
  SKILL.md                    ← orquestrador principal
  README.md                   ← este arquivo
  references/
    kickoff-blocos.md         ← os 10 blocos do kickoff (ServiceNow)
    placeholders.md           ← de onde sai cada placeholder
  tools/
    mdc_to_md.py              ← conversão .mdc → .md (Claude) e steering (Kiro)
    check-rules.mjs           ← NO_PLACEHOLDER_LEFT, SECURITY_UNMODIFIED, RULES_CONTRADICTION
  templates/
    security.mdc              ← parte fixa da plataforma + bloco <!-- projeto:inicio/fim -->
    architecture.mdc          ← template ServiceNow com placeholders {{...}}
    conventions.mdc           ← template ServiceNow com placeholders {{...}}
    test-strategy.mdc         ← template ServiceNow com placeholders {{...}}
    deploy-and-build.mdc      ← template ServiceNow com placeholders {{...}}
    auth.mdc, database.mdc, observability.mdc, messaging-and-queue.mdc,
    integrations.mdc, frontend.mdc, frontend-default.mdc
                              ← moldes do upstream, fora do alvo (merge com o harness)
    upstream/                 ← originais do upstream dos cinco templates, do kickoff e dos placeholders
```

### Template com parte fixa vs templates com placeholders

**`security.mdc`**: a parte fixa é copiada integralmente; só o bloco entre `<!-- projeto:inicio -->` e `<!-- projeto:fim -->` recebe as roles, a ACL de linha e o cross-scope do projeto. O `check-rules.mjs` confere o resto.

**Templates com placeholders**: cada `{{NOME}}` é substituído pelo valor real da decisão correspondente. Nenhum placeholder sobrevive no output final.

---

## Relação com outras skills

| Skill anterior | Artefatos consumidos |
|---------------|---------------------|
| `spec-product` | `requirements.md`, `product-requirements.md`, `business-rules.md` |
| `spec-iterate` | `gaps.md` respondidos, `sync-log.md` |

| Skill seguinte | Artefatos produzidos para ela |
|---------------|-------------------------------|
| `spec-hld` | rules — escopo, mecanismos e `SIM-` viram containers e ADRs |
| `revisao-de-seguranca` | `security.mdc` — roles, ACL de linha e cross-scope |
| `spec-data-model` | rules — nomenclatura de tabela e coluna |
| `spec-tasks` | rules — cada task gerada é auto-suficiente com base nas rules |
| `sn-implement` | rules — agente de implementação Fluent guiado pelas rules |

---

## Convenções de placeholders

| Sintaxe | Significado |
|---------|-------------|
| `{{NOME}}` | Substituir pelo valor real |
| `{{#if CONDICAO}}...{{/if}}` | Incluir bloco se condição verdadeira |
| `{{#if CONDICAO}}...{{else}}...{{/if}}` | Condicional com alternativa |

---

*Versão 4.1 — Agosto 2026*
