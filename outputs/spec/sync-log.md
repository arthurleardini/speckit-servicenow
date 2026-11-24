# Log de sincronização — Cobrança MT (Speckit ServiceNow v0, piloto 2.6 Cobrança)

Última atualização: 2026-11-24

Este log é a **memória cronológica do projeto**. Toda execução de skill (`spec-ingest`, `spec-legacy`, `spec-benchmark`, `spec-product`, `spec-prototype`, `spec-iterate`, `spec-report`) registra uma linha aqui ao terminar. Skills subsequentes leem este log no início para entender de onde viemos antes de produzir novo conteúdo.

<!-- id: sync-log -->

---

## Seção A — Execuções de skills (timeline)

Ordem cronológica, mais recente no topo. Cada execução = uma linha.

| # | Data/Hora | Skill | Modo / contexto | Inputs consumidos | Outputs gerados ou atualizados | Decisões-chave (1–3 bullets) | Decisor | Próximo passo recomendado |
|--:|-----------|-------|-----------------|-------------------|-------------------------------|------------------------------|---------|---------------------------|
| 6 | 2026-11-24 12:54 | now-sdk-install | dev493801 | x_2326104_cob | 902d0163b679c9c8a6bc0413cfe230a4226041e0 | ok; 1056 registros | — | sn-capture |
| 5 | 2026-11-24 12:49 | now-sdk-install | dev493801 | x_2326104_cob | 902d0163b679c9c8a6bc0413cfe230a4226041e0 | ok; 1056 registros | — | sn-capture |
| 4 | 2026-11-24 12:46 | now-sdk-install | dev493801 | x_2326104_cob | 902d0163b679c9c8a6bc0413cfe230a4226041e0 | falha-build; 0 registros | — | corrigir e rodar npm run reinstall |
| 3 | 2026-11-24 12:42 | now-sdk-install | dev493801 | x_2326104_cob | 902d0163b679c9c8a6bc0413cfe230a4226041e0 | ok; 1056 registros | — | sn-capture |
| 2 | 2026-11-24 12:39 | now-sdk-install | dev493801 | x_2326104_cob | 902d0163b679c9c8a6bc0413cfe230a4226041e0 | falha-install; 0 registros | — | corrigir e rodar npm run reinstall |
| 1 | 2026-11-24 12:30 | explore | kickoff: legado=Não · ramo=SEFAZ-MT 2.6 Cobrança · ambiente=ServiceNow dev493801, app x_2326104_cob · inputs=inputs/plano-2.6-cobranca.md, inputs/de-para-ids.md, inputs/simulacoes.md, inputs/fio-condutor.md, inputs/premissas-ficticias.md | inputs/plano-2.6-cobranca.md | workspace.md, outputs/explore/hld-funcional.md, especificacao-funcional.md, especificacao-tecnica.md, modelo-de-dados.md, gaps.md, outputs/spec/data-model.previa.json | Integrações externas simuladas (SIM-01 a SIM-03); parâmetros em aberto viram premissa (P1–P5); dossiê F5 e KPIs F6 em form/report da Core UI (GAP-012, GAP-013) | arthurleardini | sn-scaffold → npm run reinstall → sn-capture |

**Convenções de preenchimento:**
- **Modo / contexto:** o que diferenciou esta execução das outras (ex.: `delta` se for re-execução; `proto-first` vs `doc-first` etc.). É também a coluna dos **marcadores de skip** lidos pelo `check-outputs.py`.
- **Inputs consumidos:** lista curta — caminhos de arquivos em `inputs/` ou referências a `outputs/spec/` lidos.
- **Outputs:** apenas arquivos efetivamente criados/modificados nesta execução.
- **Decisões-chave:** o que **mudou** o entendimento do projeto.
- **Decisor:** quem assinou a decisão (consultor / cliente / nome). `—` se foi puramente derivado dos artefatos.
- **Próximo passo:** o que o orquestrador deve invocar depois.

---

## Seção B — Propagações de GAP

Mudanças entre artefatos resultantes do fecho de GAPs (Etapa B do `spec-iterate`).

| Data | Direção | GAP fechado | Origem da decisão | Artefatos tocados | Resumo | Decisor |
|------|---------|-------------|-------------------|-------------------|--------|---------|

*(Direção: `doc→proto` = documento gerou alteração no protótipo; `proto→doc` = protótipo revelou alteração em documento; `doc→doc` = mudança entre documentos sem protótipo.)*
