# Revisão de Segurança do Backlog — Cobrança MT (piloto 2.6 Cobrança)

**Data:** 2026-11-24 · **tasks.json:** tasks/v5.4, 54 stories · **Fonte dos controles:** kernel de segurança do projeto (Catálogo SEC, 20 controles) · **Analista:** spec-security-review (agente), injeção pelo inject-sec.mjs

> Avisos: a story transversal e as stories ENABLER de estrutura não trazem cenários de aceite próprios nas tasks de segurança; a verificação está em `tddTests` (RED/GREEN) e nos critérios de aceite de cada task SEC.

## Sumário Executivo

| Métrica | Valor |
|---------|-------|
| Stories analisadas | 54 |
| Stories sem gaps (nenhuma task SEC) | 46 |
| Stories com tasks SEC injetadas | 8 |
| Story de controles transversais | criada (ID: STORY-SEC-TRANSVERSAL, primeira do backlog) |
| **Tasks SEC-NNN injetadas no tasks.json** | **16** |
| Tasks CRÍTICO injetadas | 2 |
| Tasks ALTO injetadas | 7 |
| Tasks MÉDIO injetadas | 7 |
| Findings não injetados (backlog futuro) | 4 |

Todos os controles vêm do kernel com o mesmo ID; a revisão por story não derivou controle novo fora dele.

## Tasks SEC Injetadas por Story

### STORY-MOD-F1-002 — RF-MOD-F1-002 · Vínculo do débito ao contribuinte e sobreposição

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-013 | ACL de campo e consulta cega em CPF e CNPJ | MÉDIO | 4.3 | A01 | S | `cpf` e `cnpj` de contribuinte e staging com ACL de campo e ACL `query_match`/`query_range` limitadas às roles do app; staging (SIM-03) só para admin (RN-SN-140… |

### STORY-MOD-F4-005 — RF-MOD-F4-005 · Opt-in e opt-out por canal

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-019 | Opt-out e opt-in aplicados no servidor | MÉDIO | 4.3 | LGPD | S | O disparo confere o consentimento vigente no servidor, na hora do envio; opt-out vale a partir do registro; o histórico de consentimento não é apagado (audit)… |

### STORY-MOD-T-001 — RF-MOD-T-001 · Exportação com trilha

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-011 | Trilha de exportação gravada pelo servidor | MÉDIO | 5.3 | A09 | S | Toda exportação CSV/PDF grava na trilha usuário, tela, filtro, quantidade e data; a trilha não aceita write nem delete de ninguém além do sistema; leitura só pa… |

### STORY-MOD-F2-002 — RF-MOD-F2-002 · Versionamento imutável do critério

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-009 | Versão publicada do critério imutável, inclusive para admin (fio condutor 1) | ALTO | 6.5 | A04, A08 | S | Business Rule `before update` recusa qualquer alteração de parâmetro em critério com estado «publicada» ou «substituída», para todas as roles, com mensagem; ACL… |

### STORY-MOD-F2-004 — RF-MOD-F2-004 · Sorteio do grupo de controle por ciclo

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-010 | Sorteio do grupo de controle reproduzível e não manipulável (fio condutor 2) | MÉDIO | 5.5 | A04, A08 | S | O sorteio roda só no servidor, na publicação do ciclo; `semente_sorteio`, `qtd_elegiveis`, `publicado_em` e `publicado_por` ficam somente leitura depois de grav… |

### STORY-MOD-F5-007 — RF-MOD-F5-007 · Visão restrita do atendente

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-002 | Atendente vê só a própria carteira (fio condutor 5) | CRÍTICO | 8.8 | A01, API1 (IDOR) | M | Usuário só com a role atendente lê apenas registros da própria carteira: `caso.atendente`, `contribuinte.atendente`, `interacao.atendente` e `regularizacao.aten… |

### STORY-MOD-F6-006 — RF-MOD-F6-006 · Visões por perfil

| Task injetada | Título | Severidade | CVSS | OWASP | Esforço | Controle |
|--------------|--------|------------|------|-------|---------|---------|
| SEC-003 | Sem comparativo entre atendentes em reports e agregações | ALTO | 6.5 | A01 | S | Reports de carga e KPI por atendente (TEL-022, TEL-026 a TEL-028) com role coordenador; o report do atendente (TEL-031) só agrega linhas que passam na ACL de SE… |

## Story de Controles Transversais

STORY-SEC-TRANSVERSAL, no EPIC-007 (feature FEAT-T-SEGURANCA), com `mustImplementFirst`: o ordenador do backlog a põe no início.

| Task | Controle cross-cutting | Severidade | CVSS | Esforço |
|------|----------------------|------------|------|---------|
| SEC-001 | ACL por operação em toda tabela do escopo | ALTO | 8.1 | M |
| SEC-004 | Script de servidor chamado pelo usuário usa GlideRecordSecure | ALTO | 7.1 | M |
| SEC-005 | UI Action restrita por role e condição | ALTO | 7.1 | S |
| SEC-006 | Script Include client-callable só com ACL e role mínima | MÉDIO | 6.3 | XS |
| SEC-007 | Sem acesso cross-scope nem Table API no v0 | MÉDIO | 5.4 | XS |
| SEC-008 | Roles do app sem privilégio da plataforma e sem herança indevida | ALTO | 7.2 | S |
| SEC-012 | Só dado fictício no app, no repositório e nas issues | CRÍTICO | 7.5 | S |
| SEC-014 | Credencial da instância fora do git e do agente | ALTO | 7.5 | XS |
| SEC-020 | Tabelas simuladas e interruptores de falha só para admin | MÉDIO | 4.9 | S |

## Referência de Auditoria — Findings CRÍTICO e ALTO

### [SEC-001] ACL por operação em toda tabela do escopo — ALTO

- **Story:** STORY-SEC-TRANSVERSAL · **CVSS:** 8.1 · **DREAD:** 11/15 · **OWASP / STRIDE:** A01, API5 / Elevação de privilégio · **CWE:** CWE-284
- **Controle:** Cada uma das 21 tabelas tem ACL de registro para read, write, create e delete, com role do app; criar exige também write; nenhuma ACL só com script; a tabela não depende da ACL da tabela pai. Escrita: coordenador nas tabelas de F2, F4 e F6; atendente só em interação e encerramento de caso; admin nas tabelas SIM-. Delete só para admin, e nunca em critério publicado, ciclo publicado, interação e trilha (RN-SN-136, RN-SN-138, RN-SN-141, RN-SN-150)
- **Rastreio:** especificacao-funcional §1.2 Matriz de acesso · CON-02 · TRB-01 · todas as entidades
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-001 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-001, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-002] Atendente vê só a própria carteira (fio condutor 5) — CRÍTICO

- **Story:** STORY-MOD-F5-007 · **CVSS:** 8.8 · **DREAD:** 13/15 · **OWASP / STRIDE:** A01, API1 (IDOR) / Divulgação de informação · **CWE:** CWE-639
- **Controle:** Usuário só com a role atendente lê apenas registros da própria carteira: `caso.atendente`, `contribuinte.atendente`, `interacao.atendente` e `regularizacao.atendente` iguais ao usuário logado; débito, parcelamento, comunicação, consentimento e score por `contribuinte.atendente`. Vale em form, list, related list do dossiê, report (TEL-031) e exportação. Implementação: ACL de registro com condição e Data Filter com Deny para a role atendente (RN-SN-137, RN-SN-139, RN-SN-142, RN-SN-144); filtro de lista e view não contam como proteção (RN-SN-145). Teste ATF negativo com dois atendentes demo, sem `enforceSecurity: false` (RN-SN-83)
- **Rastreio:** RF-MOD-F5-007 · RF-MOD-F6-006 · RF-MOD-T-001 · RF-MOD-F1-005 · RN-NOVO-F5-007 · CT-MOD-F5-006 · CT-MOD-F6-004 · TEL-004, TEL-020, TEL-023, TEL-024, TEL-025, TEL-031 · TRB-02
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-002 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-002, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-003] Sem comparativo entre atendentes em reports e agregações — ALTO

- **Story:** STORY-MOD-F6-006 · **CVSS:** 6.5 · **DREAD:** 10/15 · **OWASP / STRIDE:** A01 / Divulgação de informação · **CWE:** CWE-200
- **Controle:** Reports de carga e KPI por atendente (TEL-022, TEL-026 a TEL-028) com role coordenador; o report do atendente (TEL-031) só agrega linhas que passam na ACL de SEC-002; agrupamento por atendente não aparece para a role atendente
- **Rastreio:** RF-MOD-F6-002 · RF-MOD-F6-006 · RN-NOVO-F5-007 · TEL-022, TEL-031 · RSK-03
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-003 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-003, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-004] Script de servidor chamado pelo usuário usa GlideRecordSecure — ALTO

- **Story:** STORY-SEC-TRANSVERSAL · **CVSS:** 7.1 · **DREAD:** 10/15 · **OWASP / STRIDE:** A01 / Elevação de privilégio · **CWE:** CWE-285
- **Controle:** UI Action e Script Include acionados pelo usuário (Gerar prévia, Publicar ciclo, Registrar interação, Encerrar caso, Reenviar, Exportar) leem e gravam com `GlideRecordSecure` ou checam `canRead/canWrite/canCreate` antes; `GlideRecord` puro só em job e Business Rule de sistema, com o motivo em comentário; Business Rule não presume ACL (RN-SN-80, RN-SN-81, RN-SN-147)
- **Rastreio:** CON-03 · TRB-02 · RN-NOVO-F2-005, RN-NOVO-F5-005, RN-NOVO-F5-006, RN-NOVO-T-001
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-004 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-004, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-005] UI Action restrita por role e condição — ALTO

- **Story:** STORY-SEC-TRANSVERSAL · **CVSS:** 7.1 · **DREAD:** 10/15 · **OWASP / STRIDE:** API5 / Elevação de privilégio · **CWE:** CWE-862
- **Controle:** Publicar versão, Gerar prévia, Publicar ciclo e distribuir casos só com role coordenador e estado válido; Registrar interação e Encerrar caso só para o atendente do caso ou coordenador; a mesma checagem repete no servidor, porque a UI Action escondida não protege (RN-SN-145, RN-SN-170)
- **Rastreio:** especificacao-funcional §1.2 Matriz de acesso · TEL-008, TEL-009, TEL-021, TEL-024 · RN-NOVO-F2-001, RN-NOVO-F5-005
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-005 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-005, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-008] Roles do app sem privilégio da plataforma e sem herança indevida — ALTO

- **Story:** STORY-SEC-TRANSVERSAL · **CVSS:** 7.2 · **DREAD:** 9/15 · **OWASP / STRIDE:** A01 / Elevação de privilégio · **CWE:** CWE-269
- **Controle:** Roles com prefixo de escopo, referenciadas por nome; `x_2326104_cob.admin` não contém `admin` da plataforma; a herança admin → coordenador, se usada, não concede publicar critério, publicar ciclo nem distribuir casos (matriz §1.2: essas ações são só do coordenador); atendente não herda nenhuma role (RN-SN-135)
- **Rastreio:** especificacao-funcional §1.1 Personas e §1.2 Matriz de acesso · CON-02
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-008 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-008, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-009] Versão publicada do critério imutável, inclusive para admin (fio condutor 1) — ALTO

- **Story:** STORY-MOD-F2-002 · **CVSS:** 6.5 · **DREAD:** 10/15 · **OWASP / STRIDE:** A04, A08 / Adulteração · **CWE:** CWE-284
- **Controle:** Business Rule `before update` recusa qualquer alteração de parâmetro em critério com estado «publicada» ou «substituída», para todas as roles, com mensagem; ACL de write e delete negada nesses estados; ciclo publicado não troca a versão aplicada (`criterio`) nem os totais; `codigo` + `versao` únicos; nova versão exige `motivo_alteracao`; Data Policy para o mesmo bloqueio em import (RN-SN-52, RN-SN-173). Teste ATF negativo com admin
- **Rastreio:** RF-MOD-F2-001, RF-MOD-F2-002 · RN-NOVO-F2-001, RN-NOVO-F2-002 · CT-MOD-F2-002 · TEL-007, TEL-008, TEL-009 · FLA-01
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-009 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-009, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-012] Só dado fictício no app, no repositório e nas issues — CRÍTICO

- **Story:** STORY-SEC-TRANSVERSAL · **CVSS:** 7.5 · **DREAD:** 12/15 · **OWASP / STRIDE:** A02, LGPD / Divulgação de informação · **CWE:** CWE-359
- **Controle:** Registro de pessoa com `ficticio = true` (obrigatório) e documento listado em `_documentos.json`; reinstalação para se achar documento fora da lista; `check_sensivel.py` com score < 40 em `inputs/`, `outputs/**/*.md` e no corpo das issues antes de publicar; dado real de contribuinte nunca entra (sigilo fiscal, CTN art. 198)
- **Rastreio:** RN-NOVO-T-002 · RNF-SEGURANCA-001 · entidades contribuinte e debito_stg · TRB-05 · ADR-10
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-012 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-012, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

### [SEC-014] Credencial da instância fora do git e do agente — ALTO

- **Story:** STORY-SEC-TRANSVERSAL · **CVSS:** 7.5 · **DREAD:** 9/15 · **OWASP / STRIDE:** A07 / Falsificação · **CWE:** CWE-522
- **Controle:** Credencial só em `.env.instancia` (chmod 600, no `.gitignore`, negada ao agente em `permissions.deny`); só `doutor`, `capture.mjs`, `reinstall.mjs` e `atf` carregam o arquivo pelas variáveis `SN_SDK_*` sem imprimir; reinstalação confere o prefixo de escopo antes do install
- **Rastreio:** TRB-04 · INT-07, INT-08 · CON-08
- **Verificação:** ATF: usuário sem permissão executa a operação protegida por SEC-014 e o teste espera negação — falha sem o controle. / ATF: com o controle SEC-014, a mesma operação é negada para o usuário sem permissão e permitida para o usuário com permissão.

## Findings não injetados (backlog futuro)

### [SEC-015] Impersonate restrito aos usuários demo — MÉDIO

- **Status no kernel:** ABERTO
- **Motivo:** MÉDIO, esforço M: controle do script de captura (ferramenta do kit), não do app; vai para o backlog do kit
- **Controle esperado:** A captura faz impersonate só dos usuários demo do seed (um por role, sem senha, `ficticio`); a lista vem do seed, não de entrada livre; a sessão admin encerra ao fim da captura; usuários demo não existem fora da PDI

### [SEC-016] Versão do SDK fixada e conferida — BAIXO

- **Status no kernel:** ABERTO
- **Motivo:** BAIXO: dívida técnica (versão do SDK já fixada em 4.14.3; falta só a conferência no doutor)
- **Controle esperado:** `@servicenow/sdk` 4.14.3 fixado no `app/package.json` com lockfile versionado; `doutor` confere a versão; `npm ci` na reinstalação

### [SEC-017] Erro e depuração sem expor dado — BAIXO

- **Status no kernel:** ABERTO
- **Motivo:** BAIXO: dívida técnica, coberto pelas regras de código do projeto
- **Controle esperado:** Scripts usam `gs.error/gs.warn/gs.debug`; sem `gs.log`, `gs.print` nem `gs.addInfoMessage` de depuração; mensagem ao usuário sem CPF, CNPJ ou valor de outro contribuinte (RN-SN-12, RN-SN-84, RN-SN-85)

### [SEC-018] Template de comunicação sem dado sob sigilo em canal não autenticado — ALTO

- **Status no kernel:** ADIADO — depende da decisão do GAP-017 sobre a entrada do F4 RF-10 no Plan
- **Motivo:** ADIADO no kernel até a decisão do GAP-017
- **Controle esperado:** Ao salvar etapa de régua com canal SMS, e-mail ou WhatsApp, o servidor recusa template com campo de débito detalhado (valor, tributo, número do débito); detalhe só por SNE (canal autenticado)

| Severidade | Ação |
|-----------|------|
| MÉDIO (esforço M/L) | Registrar aqui; priorizar como task no próximo sprint — não bloqueia a story atual |
| BAIXO | Registrar aqui como tech debt — sem prazo definido |
| ADIADO | Volta quando a decisão que o adiou for tomada |

## Análise de Cobertura por Story

As 54 stories foram lidas. Com task SEC: STORY-SEC-TRANSVERSAL, STORY-MOD-F1-002, STORY-MOD-F4-005, STORY-MOD-T-001, STORY-MOD-F2-002, STORY-MOD-F2-004, STORY-MOD-F5-007, STORY-MOD-F6-006. 
As stories de RF restantes herdam os controles transversais (ACL por operação, papéis, scripts com GlideRecordSecure, dado fictício) e não pedem controle próprio além deles. As stories ENABLER de estrutura já entregues ficam cobertas pela story transversal, que revisa as ACL de leitura geradas.

## Controles Cross-Cutting

| Controle | Onde | Task |
|---|---|---|
| ACL por operação em toda tabela do escopo | todas as tabelas e telas do app | SEC-001 |
| Script de servidor chamado pelo usuário usa GlideRecordSecure | todas as tabelas e telas do app | SEC-004 |
| UI Action restrita por role e condição | todas as tabelas e telas do app | SEC-005 |
| Script Include client-callable só com ACL e role mínima | todas as tabelas e telas do app | SEC-006 |
| Sem acesso cross-scope nem Table API no v0 | todas as tabelas e telas do app | SEC-007 |
| Roles do app sem privilégio da plataforma e sem herança indevida | todas as tabelas e telas do app | SEC-008 |
| Só dado fictício no app, no repositório e nas issues | todas as tabelas e telas do app | SEC-012 |
| Credencial da instância fora do git e do agente | todas as tabelas e telas do app | SEC-014 |
| Tabelas simuladas e interruptores de falha só para admin | todas as tabelas e telas do app | SEC-020 |

## Ameaças do AS-IS não mitigadas no TO-BE

Não se aplica: projeto sem legado (sem threat-model do AS-IS).

## Recomendações de Arquitetura de Segurança

- Implementar a STORY-SEC-TRANSVERSAL antes das stories do fio condutor: as ACL de linha da carteira (SEC-002) dependem da ACL por operação (SEC-001).
- Manter um teste ATF negativo por controle na suíte cob-regressao, com demo.atendente e demo.atendente2, sem desligar a checagem de segurança.
- Revisar o SEC-018 assim que o GAP-017 for decidido.

## Questões em aberto

- Nenhum controle derivado fora do kernel nesta revisão.
