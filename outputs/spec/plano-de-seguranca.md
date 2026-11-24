# Plano de Segurança — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

<!-- KERNEL de fonte única de segurança. Demais docs referenciam SEC-### por ID, não duplicam.
     Referenciado por ID a partir de outputs/explore/especificacao-tecnica.md. -->

> **ID do doc:** PLANO-SEG · **Versão:** 0.1 · **Atualizado:** 2026-11-24

Este documento é o catálogo único de controles de segurança do app `x_2326104_cob`. Cada controle (`SEC-###`) diz o que o app passa a fazer, por que, e a que requisito, regra ou tela da spec ele está ligado. A `spec-security-review` usa este catálogo para colocar cada controle na story certa do backlog.

Fontes: `outputs/spec/hld.md` (containers CON-01 a CON-09, integrações INT-01 a INT-10, fronteiras TRB-01 a TRB-05, ADR-01 a ADR-11), `outputs/spec/business-rules.md`, `outputs/explore/especificacao-funcional.md` §1.2 (matriz de acesso), `outputs/explore/especificacao-tecnica.md`, `outputs/explore/modelo-de-dados.md`, `outputs/explore/gaps.md` (o `gaps.md` do Plan ainda não existe), `.claude/rules/harness/security.md` (camadas A a J; camada G = plataforma ServiceNow) e o catálogo RN-SN (`referencias/32-servicenow-boas-praticas-oficiais.md`). Contexto regulatório: sigilo fiscal (CTN art. 198) e LGPD; no v0 só há dado fictício.

## Changelog
| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 0.1 | 2026-11-24 | revisao-de-seguranca (plano-geral) | Criação |

## Superfície de ameaça

Pontos de entrada, dados sensíveis, fronteiras de confiança e integrações do app, cruzados com a spec. Dado sensível aqui quer dizer documento de pessoa (CPF/CNPJ), débito fiscal (protegido por sigilo fiscal) e carteira de cada atendente.

| Elemento | Tipo | Dados sensíveis | Fonte (ID spec) |
|----------|------|-----------------|-----------------|
| Telas de form TEL-004, TEL-008, TEL-009, TEL-014, TEL-024, TEL-025 (CON-01) | entrada | CPF/CNPJ fictício, débito, score, sinalização coercitiva | RF-MOD-F1-005, RF-MOD-F2-002, RF-MOD-F2-006, RF-MOD-F4-001, RF-MOD-F5-003, RF-MOD-F5-005 |
| Telas de list TEL-001 a TEL-033 (busca e filtro padrão) | entrada/saída | débito por contribuinte, carteira do atendente | RF-MOD-T-002; RN-NOVO-F5-007 |
| Reports TEL-011, TEL-016, TEL-022, TEL-026 a TEL-028, TEL-031 | saída | totais por atendente, tributo e canal | RF-MOD-F6-002, RF-MOD-F6-006 |
| Exportação CSV/PDF de listas e reports | saída | lista de contribuintes e débitos | RF-MOD-T-001; RN-NOVO-T-001 |
| UI Actions: Publicar versão, Criar nova versão, Gerar prévia, Publicar ciclo, Registrar interação, Encerrar caso, Reenviar | entrada | critério e ciclo (afetam a carteira toda) | RN-NOVO-F2-001, RN-NOVO-F2-005, RN-NOVO-F5-005 |
| Business Rules, Script Includes e Flow do escopo (CON-03) | fronteira | todas as tabelas do escopo | ADR-01; RN-NOVO-F2-001 a RN-NOVO-F6-002 |
| Tabelas simuladas SIM-01/02/03 (CON-05) e interruptores de falha | entrada | CPF/CNPJ fictício no staging; score | INT-01, INT-02, INT-03; RF-MOD-F1-001, RF-MOD-F3-001 |
| Tabela de contribuinte e staging (pessoa) | dado | CPF, CNPJ, nome, e-mail, telefone — só fictícios | entidades `x_2326104_cob_contribuinte`, `x_2326104_cob_debito_stg`; RN-NOVO-T-002 |
| Templates de comunicação da régua | saída | dado fiscal enviado por canal | RF-MOD-F4-001; GAP-017 (F4 RF-10 do refinado) |
| Outro escopo / Table API / REST | fronteira | todas as tabelas | TRB-03; INT-06 |
| `now-sdk install` e `.env.instancia` (CON-08) | fronteira | credencial da instância | TRB-04; INT-07, INT-08 |
| `sn-capture` com login admin e impersonate (CON-09) | fronteira | sessão admin | TRB-04; INT-09; ADR-11 |
| Repositório e issues no GitHub (CON-07) | saída | spec, seed, prints | TRB-05; INT-10 |

**Modelo de autenticação e autorização:** login da plataforma ServiceNow; autorização por três roles do app (`x_2326104_cob.coordenador`, `.atendente`, `.admin`) e ACL por tabela, campo e operação. Usuários demo por role, sem senha, usados só por impersonate.

## Controles transversais

| Controle | Status | Observação | SEC gerado |
|----------|--------|-----------|-----------|
| Autenticação | ✅ COBERTO | Login nativo da plataforma; o app não cria autenticação própria. Usuários demo sem senha só entram por impersonate | SEC-015 |
| RBAC / autorização | ⚠️ PARCIAL | Roles e ACL de leitura por role existem (scaffold); faltam ACL de write/create/delete por tabela, ACL de linha da carteira e ACL de campo | SEC-001, SEC-002, SEC-003, SEC-008 |
| Rate limiting | ✅ COBERTO | Controle da plataforma (sessão e transação); o app não expõe API própria (SEC-007) | — |
| Logging / auditoria | ⚠️ PARCIAL | `audit` e journal nas tabelas de form; faltam trilha de exportação gravada por servidor e autoria das ações relevantes | SEC-010, SEC-011 |
| Gestão de segredos | ✅ COBERTO | Credencial em `.env.instancia` (chmod 600, fora do git, negada ao agente) | SEC-014 |
| Headers HTTP | ✅ COBERTO | Responsabilidade da plataforma; fora do escopo do app (camada G de `security.md`) | — |
| Auditoria de dependências (CI) | ⚠️ PARCIAL | SDK fixado em 4.14.3 e conferido pelo `doutor`; sem varredura de vulnerabilidade no v0 | SEC-016 |
| LGPD — direitos do titular | ✅ COBERTO | Só dado fictício no v0; direitos do titular entram com dado real, fora do v0 | SEC-012 |
| Tratamento central de erros | ⚠️ PARCIAL | Erro de script não pode expor dado ao usuário; usar `gs.error/gs.warn`, sem `gs.addInfoMessage` de depuração | SEC-017 |
| MFA (se aplicável) | ✅ COBERTO | Não aplicável na PDI do v0; na SEFAZ-MT segue a política da instância | — |

## Catálogo SEC

### SEC-001 — ACL por operação em toda tabela do escopo
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 11/15 |
| CVSS | 8.1 |
| OWASP / STRIDE | A01, API5 / Elevação de privilégio |
| Controle esperado | Cada uma das 21 tabelas tem ACL de registro para read, write, create e delete, com role do app; criar exige também write; nenhuma ACL só com script; a tabela não depende da ACL da tabela pai. Escrita: coordenador nas tabelas de F2, F4 e F6; atendente só em interação e encerramento de caso; admin nas tabelas SIM-. Delete só para admin, e nunca em critério publicado, ciclo publicado, interação e trilha (RN-SN-136, RN-SN-138, RN-SN-141, RN-SN-150) |
| Rastreabilidade | especificacao-funcional §1.2 Matriz de acesso · CON-02 · TRB-01 · todas as entidades |
| Status | ABERTO |

### SEC-002 — Atendente vê só a própria carteira (fio condutor 5)
| Campo | Valor |
|-------|-------|
| Severidade | CRÍTICO |
| DREAD | 13/15 |
| CVSS | 8.8 |
| OWASP / STRIDE | A01, API1 (IDOR) / Divulgação de informação |
| Controle esperado | Usuário só com a role atendente lê apenas registros da própria carteira: `caso.atendente`, `contribuinte.atendente`, `interacao.atendente` e `regularizacao.atendente` iguais ao usuário logado; débito, parcelamento, comunicação, consentimento e score por `contribuinte.atendente`. Vale em form, list, related list do dossiê, report (TEL-031) e exportação. Implementação: ACL de registro com condição e Data Filter com Deny para a role atendente (RN-SN-137, RN-SN-139, RN-SN-142, RN-SN-144); filtro de lista e view não contam como proteção (RN-SN-145). Teste ATF negativo com dois atendentes demo, sem `enforceSecurity: false` (RN-SN-83) |
| Rastreabilidade | RF-MOD-F5-007 · RF-MOD-F6-006 · RF-MOD-T-001 · RF-MOD-F1-005 · RN-NOVO-F5-007 · CT-MOD-F5-006 · CT-MOD-F6-004 · TEL-004, TEL-020, TEL-023, TEL-024, TEL-025, TEL-031 · TRB-02 |
| Status | ABERTO |

### SEC-003 — Sem comparativo entre atendentes em reports e agregações
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 10/15 |
| CVSS | 6.5 |
| OWASP / STRIDE | A01 / Divulgação de informação |
| Controle esperado | Reports de carga e KPI por atendente (TEL-022, TEL-026 a TEL-028) com role coordenador; o report do atendente (TEL-031) só agrega linhas que passam na ACL de SEC-002; agrupamento por atendente não aparece para a role atendente |
| Rastreabilidade | RF-MOD-F6-002 · RF-MOD-F6-006 · RN-NOVO-F5-007 · TEL-022, TEL-031 · RSK-03 |
| Status | ABERTO |

### SEC-004 — Script de servidor chamado pelo usuário usa GlideRecordSecure
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 10/15 |
| CVSS | 7.1 |
| OWASP / STRIDE | A01 / Elevação de privilégio |
| Controle esperado | UI Action e Script Include acionados pelo usuário (Gerar prévia, Publicar ciclo, Registrar interação, Encerrar caso, Reenviar, Exportar) leem e gravam com `GlideRecordSecure` ou checam `canRead/canWrite/canCreate` antes; `GlideRecord` puro só em job e Business Rule de sistema, com o motivo em comentário; Business Rule não presume ACL (RN-SN-80, RN-SN-81, RN-SN-147) |
| Rastreabilidade | CON-03 · TRB-02 · RN-NOVO-F2-005, RN-NOVO-F5-005, RN-NOVO-F5-006, RN-NOVO-T-001 |
| Status | ABERTO |

### SEC-005 — UI Action restrita por role e condição
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 10/15 |
| CVSS | 7.1 |
| OWASP / STRIDE | API5 / Elevação de privilégio |
| Controle esperado | Publicar versão, Gerar prévia, Publicar ciclo e distribuir casos só com role coordenador e estado válido; Registrar interação e Encerrar caso só para o atendente do caso ou coordenador; a mesma checagem repete no servidor, porque a UI Action escondida não protege (RN-SN-145, RN-SN-170) |
| Rastreabilidade | especificacao-funcional §1.2 Matriz de acesso · TEL-008, TEL-009, TEL-021, TEL-024 · RN-NOVO-F2-001, RN-NOVO-F5-005 |
| Status | ABERTO |

### SEC-006 — Script Include client-callable só com ACL e role mínima
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 8/15 |
| CVSS | 6.3 |
| OWASP / STRIDE | API5 / Elevação de privilégio |
| Controle esperado | Script Include com `clientCallable: true` só quando houver GlideAjax, com ACL de `client_callable_script_include` e role do app; demais com `accessibleFrom: 'package_private'` e `sandboxCallable` desligado; `glide.script.secure.ajaxgliderecord = true` (RN-SN-71, RN-SN-72, RN-SN-147) |
| Rastreabilidade | CON-03 · TRB-03 · ADR-01 |
| Status | ABERTO |

### SEC-007 — Sem acesso cross-scope nem Table API no v0
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 8/15 |
| CVSS | 5.4 |
| OWASP / STRIDE | A05, API8 / Divulgação de informação |
| Controle esperado | Nenhum `CrossScopePrivilege` declarado; tabelas sem `allowWebServiceAccess`; Application Access das tabelas com `caller_access` restrito ao próprio escopo; quando integração real entrar, um privilégio por operação por alvo (RN-SN-148, RN-SN-149, RN-SN-82) |
| Rastreabilidade | INT-06 · TRB-03 · ADR-09 |
| Status | ABERTO |

### SEC-008 — Roles do app sem privilégio da plataforma e sem herança indevida
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 9/15 |
| CVSS | 7.2 |
| OWASP / STRIDE | A01 / Elevação de privilégio |
| Controle esperado | Roles com prefixo de escopo, referenciadas por nome; `x_2326104_cob.admin` não contém `admin` da plataforma; a herança admin → coordenador, se usada, não concede publicar critério, publicar ciclo nem distribuir casos (matriz §1.2: essas ações são só do coordenador); atendente não herda nenhuma role (RN-SN-135) |
| Rastreabilidade | especificacao-funcional §1.1 Personas e §1.2 Matriz de acesso · CON-02 |
| Status | ABERTO |

### SEC-009 — Versão publicada do critério imutável, inclusive para admin (fio condutor 1)
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 10/15 |
| CVSS | 6.5 |
| OWASP / STRIDE | A04, A08 / Adulteração |
| Controle esperado | Business Rule `before update` recusa qualquer alteração de parâmetro em critério com estado «publicada» ou «substituída», para todas as roles, com mensagem; ACL de write e delete negada nesses estados; ciclo publicado não troca a versão aplicada (`criterio`) nem os totais; `codigo` + `versao` únicos; nova versão exige `motivo_alteracao`; Data Policy para o mesmo bloqueio em import (RN-SN-52, RN-SN-173). Teste ATF negativo com admin |
| Rastreabilidade | RF-MOD-F2-001, RF-MOD-F2-002 · RN-NOVO-F2-001, RN-NOVO-F2-002 · CT-MOD-F2-002 · TEL-007, TEL-008, TEL-009 · FLA-01 |
| Status | ABERTO |

### SEC-010 — Sorteio do grupo de controle reproduzível e não manipulável (fio condutor 2)
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 8/15 |
| CVSS | 5.5 |
| OWASP / STRIDE | A04, A08 / Adulteração, Repúdio |
| Controle esperado | O sorteio roda só no servidor, na publicação do ciclo; `semente_sorteio`, `qtd_elegiveis`, `publicado_em` e `publicado_por` ficam somente leitura depois de gravados; segmento «controle» não muda após a publicação; o mesmo sorteio refeito com a semente dá o mesmo grupo; comunicação e caso para contribuinte em controle são recusados no servidor |
| Rastreabilidade | RF-MOD-F2-004 · RF-MOD-F6-004 · RN-NOVO-F2-005, RN-NOVO-F2-006, RN-NOVO-F6-001 · CT-MOD-F2-003 · TEL-009, TEL-010, TEL-029 · FLA-02 |
| Status | ABERTO |

### SEC-011 — Trilha de exportação gravada pelo servidor
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 8/15 |
| CVSS | 5.3 |
| OWASP / STRIDE | A09 / Repúdio |
| Controle esperado | Toda exportação CSV/PDF grava na trilha usuário, tela, filtro, quantidade e data; a trilha não aceita write nem delete de ninguém além do sistema; leitura só para admin (TEL-033); ação relevante do caso guarda ator, data e resultado (RN-NOVO-F5-005) |
| Rastreabilidade | RF-MOD-T-001 · RN-NOVO-T-001 · RN-NOVO-F5-005 · TEL-033 |
| Status | ABERTO |

### SEC-012 — Só dado fictício no app, no repositório e nas issues
| Campo | Valor |
|-------|-------|
| Severidade | CRÍTICO |
| DREAD | 12/15 |
| CVSS | 7.5 |
| OWASP / STRIDE | A02, LGPD / Divulgação de informação |
| Controle esperado | Registro de pessoa com `ficticio = true` (obrigatório) e documento listado em `_documentos.json`; reinstalação para se achar documento fora da lista; `check_sensivel.py` com score < 40 em `inputs/`, `outputs/**/*.md` e no corpo das issues antes de publicar; dado real de contribuinte nunca entra (sigilo fiscal, CTN art. 198) |
| Rastreabilidade | RN-NOVO-T-002 · RNF-SEGURANCA-001 · entidades contribuinte e debito_stg · TRB-05 · ADR-10 |
| Status | ABERTO |

### SEC-013 — ACL de campo e consulta cega em CPF e CNPJ
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 7/15 |
| CVSS | 4.3 |
| OWASP / STRIDE | A01 / Divulgação de informação |
| Controle esperado | `cpf` e `cnpj` de contribuinte e staging com ACL de campo e ACL `query_match`/`query_range` limitadas às roles do app; staging (SIM-03) só para admin (RN-SN-140) |
| Rastreabilidade | entidades contribuinte e debito_stg · RF-MOD-F1-002 · TEL-004, TEL-006, TEL-032 |
| Status | ABERTO |

### SEC-014 — Credencial da instância fora do git e do agente
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 9/15 |
| CVSS | 7.5 |
| OWASP / STRIDE | A07 / Falsificação |
| Controle esperado | Credencial só em `.env.instancia` (chmod 600, no `.gitignore`, negada ao agente em `permissions.deny`); só `doutor`, `capture.mjs`, `reinstall.mjs` e `atf` carregam o arquivo pelas variáveis `SN_SDK_*` sem imprimir; reinstalação confere o prefixo de escopo antes do install |
| Rastreabilidade | TRB-04 · INT-07, INT-08 · CON-08 |
| Status | ABERTO |

### SEC-015 — Impersonate restrito aos usuários demo
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 7/15 |
| CVSS | 5.0 |
| OWASP / STRIDE | A07 / Falsificação |
| Controle esperado | A captura faz impersonate só dos usuários demo do seed (um por role, sem senha, `ficticio`); a lista vem do seed, não de entrada livre; a sessão admin encerra ao fim da captura; usuários demo não existem fora da PDI |
| Rastreabilidade | ADR-11 · INT-09 · CON-09 · TEL-001 a TEL-033 |
| Status | ABERTO |

### SEC-016 — Versão do SDK fixada e conferida
| Campo | Valor |
|-------|-------|
| Severidade | BAIXO |
| DREAD | 5/15 |
| CVSS | 3.1 |
| OWASP / STRIDE | A06 / Adulteração |
| Controle esperado | `@servicenow/sdk` 4.14.3 fixado no `app/package.json` com lockfile versionado; `doutor` confere a versão; `npm ci` na reinstalação |
| Rastreabilidade | CON-08 · RNF-MANUTENIBILIDADE-001 |
| Status | ABERTO |

### SEC-017 — Erro e depuração sem expor dado
| Campo | Valor |
|-------|-------|
| Severidade | BAIXO |
| DREAD | 6/15 |
| CVSS | 3.7 |
| OWASP / STRIDE | A09 / Divulgação de informação |
| Controle esperado | Scripts usam `gs.error/gs.warn/gs.debug`; sem `gs.log`, `gs.print` nem `gs.addInfoMessage` de depuração; mensagem ao usuário sem CPF, CNPJ ou valor de outro contribuinte (RN-SN-12, RN-SN-84, RN-SN-85) |
| Rastreabilidade | CON-03 · ADR-01 |
| Status | ABERTO |

### SEC-018 — Template de comunicação sem dado sob sigilo em canal não autenticado
| Campo | Valor |
|-------|-------|
| Severidade | ALTO |
| DREAD | 9/15 |
| CVSS | 6.5 |
| OWASP / STRIDE | A01, LGPD / Divulgação de informação |
| Controle esperado | Ao salvar etapa de régua com canal SMS, e-mail ou WhatsApp, o servidor recusa template com campo de débito detalhado (valor, tributo, número do débito); detalhe só por SNE (canal autenticado) |
| Rastreabilidade | GAP-017 (F4 RF-10 do refinado) · RF-MOD-F4-001 · TEL-014 · INT-02 |
| Status | ADIADO — depende da decisão do GAP-017 sobre a entrada do F4 RF-10 no Plan |

### SEC-019 — Opt-out e opt-in aplicados no servidor
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 7/15 |
| CVSS | 4.3 |
| OWASP / STRIDE | LGPD / Adulteração |
| Controle esperado | O disparo confere o consentimento vigente no servidor, na hora do envio; opt-out vale a partir do registro; o histórico de consentimento não é apagado (audit) |
| Rastreabilidade | RF-MOD-F4-005 · RN-NOVO-F4-003 · CT-MOD-F4-003 · TEL-017 |
| Status | ABERTO |

### SEC-020 — Tabelas simuladas e interruptores de falha só para admin
| Campo | Valor |
|-------|-------|
| Severidade | MÉDIO |
| DREAD | 7/15 |
| CVSS | 4.9 |
| OWASP / STRIDE | A01 / Adulteração |
| Controle esperado | Write, create e delete nas tabelas SIM- (`score_sim`, `envio_sim`, `canal_sim`, `debito_stg`) e nos campos `forcar_falha`, `falhar`, `falha_simulada` só com role admin; coordenador lê `score_sim` (TEL-011, TEL-012) e não altera score |
| Rastreabilidade | INT-01, INT-02, INT-03 · CON-05 · TEL-006, TEL-011, TEL-012, TEL-018, TEL-019 · RN-NOVO-F3-003 |
| Status | ABERTO |

## Mapa de aplicabilidade

| SEC | Feature/Módulos aplicáveis |
|-----|-----------------------------|
| SEC-001 | MOD-F1, MOD-F2, MOD-F3, MOD-F4, MOD-F5, MOD-F6, MOD-T (story de roles e ACL base) |
| SEC-002 | MOD-F5 (fio condutor 5), MOD-F1 (TEL-004), MOD-F4 (TEL-020), MOD-F6 (TEL-031), MOD-T (exportação) |
| SEC-003 | MOD-F5 (TEL-022), MOD-F6 |
| SEC-004 | MOD-F2, MOD-F4, MOD-F5, MOD-T |
| SEC-005 | MOD-F2, MOD-F5 |
| SEC-006 | MOD-F2, MOD-F5, MOD-T |
| SEC-007 | MOD-T (configuração do app) |
| SEC-008 | MOD-T (roles) |
| SEC-009 | MOD-F2 (fio condutor 1) |
| SEC-010 | MOD-F2 (fio condutor 2), MOD-F6 |
| SEC-011 | MOD-T, MOD-F5 |
| SEC-012 | MOD-F1, MOD-T (seed e publicação) |
| SEC-013 | MOD-F1 |
| SEC-014 | MOD-T (reinstalação) |
| SEC-015 | MOD-T (captura) |
| SEC-016 | MOD-T (reinstalação) |
| SEC-017 | MOD-F1 a MOD-F6 |
| SEC-018 | MOD-F4 |
| SEC-019 | MOD-F4 |
| SEC-020 | MOD-F1, MOD-F3, MOD-F4 |

## Recomendações de arquitetura

1. **ACL antes de lógica (SEC-001, SEC-002, SEC-008).** Gerar a ACL de registro por operação e a ACL de linha da carteira junto com o scaffold do Plan, antes de qualquer Business Rule (RN-SN-150). A role atendente ganha condição de carteira; coordenador e admin, não.
2. **Fio condutor protegido no servidor (SEC-009, SEC-010, SEC-004).** Imutabilidade, sorteio e bloqueio do grupo de controle vivem em Business Rule `before` e Script Include, com `GlideRecordSecure` no que o usuário aciona. UI Policy e UI Action escondida só melhoram a experiência.
3. **Teste negativo por controle (SEC-002, SEC-009, SEC-010).** Cada controle do fio condutor tem `Test()` ATF com usuário demo da role e caso negado: atendente A não vê caso do atendente B; admin não edita versão publicada; contribuinte em controle não recebe comunicação.
4. **Escopo fechado (SEC-006, SEC-007).** Sem cross-scope, sem Table API e Script Include `package_private` enquanto as integrações forem simuladas.
5. **Sigilo e segredo fora do código (SEC-012, SEC-014, SEC-015).** Seed só fictício conferido no install; credencial só em `.env.instancia`; impersonate só de usuário demo.
