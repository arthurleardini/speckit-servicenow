# Requisitos de Produto / UX — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft
Última atualização: 2026-11-25 (UX v2, `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2: TEL-036 a TEL-038, links de execução e Flow Designer na régua, «Origem» do contato só leitura; antes, UX v1)
Fonte: product-vision.md, requirements/requirements.md, data-model.json, screens-manifest.json (35 telas instaladas e fotografadas na instância `dev493801`)

**Âmbito deste arquivo:** um PR por tela `TEL-` do `screens-manifest.json`. A tela já existe na instância como form, list ou report da Core UI clássica (UI16); o print de cada uma está em `outputs/spec/screens/<TEL>.png`, tirado na visão do papel da tela. O inventário de campos sai do `data-model.json` final, com as opções transcritas.

**Rastreio obrigatório:** cada PR liga a pelo menos um RF de [`../requirements/requirements.md`](../requirements/requirements.md).

<!-- id: pr-module-index -->

## Índice de módulos (PR)

| Módulo | Objetivo negócio (resumo) | Qtd PR |
|--------|---------------------------|--------|
| MOD-F1 | Ingestão e Carteira Consolidada | 7 |
| MOD-F2 | Qualificação e Parametrização da Carteira | 5 |
| MOD-F3 | Scoring de Liquidez | 2 |
| MOD-F4 | Réguas de Cobrança Multicanal | 10 |
| MOD-F5 | Cobrança Qualificada | 5 |
| MOD-F6 | Monitoramento, KPIs e Grupo de Controle | 6 |
| MOD-T | Transversais | 1 |
| MOD-UX-LISTA | Lista ativa do atendente (design UX v1) | 2 |

---

<!-- id: pr-overview -->

## Princípios de experiência

### Princípio: a tela é a da plataforma
**Origem:** F-017, F-086
**Descrição:** toda tela é form, list ou report padrão da Core UI clássica, sem layout próprio; o que o cliente valida é o que vai para produção.
**Como verificar:** 35 de 35 telas com print da instância (RNF-USABILIDADE-001).

### Princípio: cada um vê o que é seu
**Origem:** F-016, F-145
**Descrição:** o atendente só encontra a própria lista de contatos e a própria carteira em qualquer tela; números de colegas nunca aparecem. O caso qualificado é do coordenador responsável; o atendente não o vê.
**Como verificar:** 0 registros alheios nos testes de acesso (RNF-SEGURANCA-002); atendente sem leitura de caso (ATF US-MOD-UX-006).

### Princípio: a regra aparece na tela
**Origem:** F-032, F-140
**Descrição:** versão do critério, marca «sem score», grupo de controle e origem da regularização são campos visíveis, não cálculo escondido.
**Como verificar:** os campos constam do inventário de TEL-008, TEL-009, TEL-010, TEL-020 e TEL-024.

### Princípio: cada um entra no próprio trabalho e age por botão
**Origem:** design UX v1 (M1, M3, M4)
**Descrição:** o atendente cai em «Minha lista» e o coordenador em «Casos qualificados». O estado do contato, do caso e do ciclo muda pelos botões da tela («Registrar ligação», «Encerrar», «Avançar etapa», «Encerrar caso», «Distribuir lista»), com a trilha de etapas no topo do form; o servidor recusa a mesma mudança feita à mão (GAP-150, GAP-152).
**Como verificar:** `outputs/spec/screens/ux-v1/verificacao.json` (home e menu por papel) e `acoes.json` (cliques por jornada).

### Princípio: o que é simulado diz que é
**Origem:** F-170
**Descrição:** tabelas de integração simulada têm o rótulo «(Simulado)» no título.
**Como verificar:** TEL-006, TEL-011, TEL-012, TEL-018 e TEL-019 mostram «Simulado».

---

<!-- id: pr-traceability -->

## Rastreabilidade global (PR)

| ID PR | Módulo | RF relacionado *(≥1)* | Legacy / vision | F-xxx |
|-------|--------|----------------------|-----------------|-------|
| PR-MOD-F1-001 | MOD-F1 | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 | TEL-001; product-vision §6 | F-020, F-025, F-026, F-018 |
| PR-MOD-F1-002 | MOD-F1 | RF-MOD-F1-002 | TEL-002; product-vision §6 | F-021, F-018 |
| PR-MOD-F1-003 | MOD-F1 | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 | TEL-003; product-vision §6 | F-020, F-021, F-022, F-080, F-018 |
| PR-MOD-F1-004 | MOD-F1 | RF-MOD-F1-005, RF-MOD-T-003 | TEL-004; product-vision §6 | F-024, F-081, F-018 |
| PR-MOD-F1-005 | MOD-F1 | RF-MOD-F1-004 | TEL-005; product-vision §6 | F-023, F-018 |
| PR-MOD-F1-006 | MOD-F1 | RF-MOD-F1-001, RF-MOD-F1-002 | TEL-006; product-vision §6 | F-020, F-021, F-018 |
| PR-MOD-F2-001 | MOD-F2 | RF-MOD-F2-001, RF-MOD-F2-002 | TEL-007; product-vision §6 | F-031, F-032, F-018 |
| PR-MOD-F2-002 | MOD-F2 | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 | TEL-008; product-vision §6 | F-031, F-032, F-035, F-018 |
| PR-MOD-F2-003 | MOD-F2 | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 | TEL-009; product-vision §6 | F-033, F-034, F-036, F-018 |
| PR-MOD-F2-004 | MOD-F2 | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 | TEL-010; product-vision §6 | F-033, F-034, F-035, F-080, F-018 |
| PR-MOD-F3-001 | MOD-F3 | RF-MOD-F3-006 | TEL-011; product-vision §6 | F-045, F-018 |
| PR-MOD-F3-002 | MOD-F3 | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 | TEL-012; product-vision §6 | F-040, F-041, F-043, F-044, F-018 |
| PR-MOD-F4-001 | MOD-F4 | RF-MOD-F4-001 | TEL-013; product-vision §6 | F-048, F-018 |
| PR-MOD-F4-002 | MOD-F4 | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 | TEL-014; product-vision §6 | F-048, F-050, F-051, F-056, F-018 |
| PR-MOD-F4-003 | MOD-F4 | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 | TEL-015; product-vision §6 | F-049, F-050, F-053, F-018 |
| PR-MOD-F4-004 | MOD-F4 | RF-MOD-F4-008 | TEL-016; product-vision §6 | F-055, F-018 |
| PR-MOD-F4-005 | MOD-F4 | RF-MOD-F4-005 | TEL-017; product-vision §6 | F-052, F-018 |
| PR-MOD-F4-006 | MOD-F4 | RF-MOD-F4-004, RF-MOD-F4-005 | TEL-018; product-vision §6 | F-051, F-052, F-018 |
| PR-MOD-F4-007 | MOD-F4 | RF-MOD-F4-006 | TEL-019; product-vision §6 | F-053, F-018 |
| PR-MOD-F4-008 | MOD-F4 | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 | TEL-020; product-vision §6 | F-054, F-074, F-082, F-018 |
| PR-MOD-F5-001 | MOD-F5 | RF-MOD-F5-001 | TEL-021; product-vision §6 | F-061, F-018 |
| PR-MOD-F5-002 | MOD-F5 | RF-MOD-F5-001 | TEL-022; product-vision §6 | F-061, F-018 |
| PR-MOD-F5-003 | MOD-F5 | RF-MOD-F5-002, RF-MOD-F5-007 | TEL-023; product-vision §6 | F-062, F-067, F-018 |
| PR-MOD-F5-004 | MOD-F5 | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 | TEL-024; product-vision §6 | F-042, F-063, F-064, F-065, F-066, F-018 |
| PR-MOD-F5-005 | MOD-F5 | RF-MOD-F5-005 | TEL-025; product-vision §6 | F-065, F-018 |
| PR-MOD-F6-001 | MOD-F6 | RF-MOD-F6-001, RF-MOD-F6-007 | TEL-026; product-vision §6 | F-072, F-078, F-018 |
| PR-MOD-F6-002 | MOD-F6 | RF-MOD-F6-002, RF-MOD-F6-005, RF-MOD-F6-007 | TEL-027; product-vision §6 | F-073, F-076, F-078, F-018 |
| PR-MOD-F6-003 | MOD-F6 | RF-MOD-F6-003, RF-MOD-F6-007 | TEL-028; product-vision §6 | F-074, F-078, F-018 |
| PR-MOD-F6-004 | MOD-F6 | RF-MOD-F6-004 | TEL-029; product-vision §6 | F-075, F-018 |
| PR-MOD-F6-005 | MOD-F6 | RF-MOD-F6-002, RF-MOD-F6-005 | TEL-030; product-vision §6 | F-073, F-076, F-018 |
| PR-MOD-F6-006 | MOD-F6 | RF-MOD-F6-006 | TEL-031; product-vision §6 | F-077, F-018 |
| PR-MOD-F1-007 | MOD-F1 | RF-MOD-T-002, RF-MOD-T-003 | TEL-032; product-vision §6 | F-080, F-081, F-018 |
| PR-MOD-T-001 | MOD-T | RF-MOD-T-001 | TEL-033; product-vision §6 | F-079, F-018 |
| PR-MOD-UX-001 | MOD-UX-LISTA | RF-MOD-F5-005, RF-MOD-F5-007 | TEL-034; design UX v1 (CUJ-A) | F-065, F-067 |
| PR-MOD-UX-002 | MOD-UX-LISTA | RF-MOD-F5-005 | TEL-035; design UX v1 (CUJ-A) | F-065 |
| PR-MOD-F2-005 | MOD-F2 | RF-MOD-F2-003, RF-MOD-F2-004 | TEL-036; design UX v2 (CUJ-2) | F-033, F-034 |
| PR-MOD-F4-009 | MOD-F4 | RF-MOD-F4-002, RF-MOD-F4-003 | TEL-037; design UX v2 (CUJ-4, CUJ-6) | F-049, F-050 |
| PR-MOD-F4-010 | MOD-F4 | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006, RF-MOD-F4-009 | TEL-038; design UX v2 (CUJ-4 a CUJ-6) | F-049, F-050, F-053, F-056 |

---

<!-- id: pr-section -->

## Requisitos de produto / UX por módulo

## Módulo: Ingestão e Carteira Consolidada (`MOD-F1`)

### PR-MOD-F1-001 — TEL-001 Integrações e sincronização

**RF relacionado:** RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007  
**Etapa do fluxo:** ETP-003  
**Tela:** `TEL-001` · list da tabela `x_2326104_cob_sincronizacao` (Execução de sincronização) · rota `/x_2326104_cob_sincronizacao_list.do` · print `screens/TEL-001.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Integrações e sincronização» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| fonte | Fonte | select | Sim | única | `ccf` — CCF; `mpi_bigdata` — MPI/Big Data; `ipva` — IPVA; `itcd` — ITCD; `sne` — SNE | `domainTable:x_2326104_cob_sincronizacao.fonte` | — | — | — | vazio → "Fonte é obrigatório" | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |
| inicio | Início | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |
| fim | Fim | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |
| status | Status | select | Não | única | `sucesso` — Sucesso; `parcial` — Parcial; `falha` — Falha | `domainTable:x_2326104_cob_sincronizacao.status` | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |
| volume | Volume | number | Não | — | — | — | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |
| rejeitados | Rejeitados | number | Não | — | — | — | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |
| mensagem | Mensagem | text | Não | — | — | — | — | — | até 255 caracteres | — | RF-MOD-F1-001, RF-MOD-F1-006, RF-MOD-F1-007 |

**Grid / listagem**

- Colunas exibidas (em ordem): fonte, inicio, fim, status, volume, rejeitados, mensagem
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F1-002 — TEL-002 Log de rejeições

**RF relacionado:** RF-MOD-F1-002  
**Etapa do fluxo:** ETP-004  
**Tela:** `TEL-002` · list da tabela `x_2326104_cob_rejeicao` (Rejeição de registro) · rota `/x_2326104_cob_rejeicao_list.do` · print `screens/TEL-002.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Log de rejeições» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| sincronizacao | Sincronização | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_sincronizacao` | — | — | — | — | RF-MOD-F1-002 |
| fonte | Fonte | select | Não | única | `ccf` — CCF; `mpi_bigdata` — MPI/Big Data; `ipva` — IPVA; `itcd` — ITCD; `sne` — SNE | `domainTable:x_2326104_cob_rejeicao.fonte` | — | — | — | — | RF-MOD-F1-002 |
| id_registro | ID do registro na fonte | text | Não | — | — | — | — | — | até 40 caracteres | — | RF-MOD-F1-002 |
| motivo | Motivo | select | Não | única | `documento_invalido` — Documento inválido; `sem_vinculo` — Sem vínculo; `duplicado` — Duplicado | `domainTable:x_2326104_cob_rejeicao.motivo` | — | — | — | — | RF-MOD-F1-002 |
| detalhe | Detalhe | text | Não | — | — | — | — | — | até 255 caracteres | — | RF-MOD-F1-002 |

**Grid / listagem**

- Colunas exibidas (em ordem): sincronizacao, fonte, id_registro, motivo, detalhe
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F1-003 — TEL-003 Carteira consolidada

**RF relacionado:** RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002  
**Etapa do fluxo:** ETP-005, ETP-038  
**Tela:** `TEL-003` · list da tabela `x_2326104_cob_debito` (Débito) · rota `/x_2326104_cob_debito_list.do` · print `screens/TEL-003.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Carteira consolidada» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| origem | Origem | select | Sim | única | `ccf` — CCF; `mpi_bigdata` — MPI/Big Data; `ipva` — IPVA; `itcd` — ITCD; `sne` — SNE | `domainTable:x_2326104_cob_debito.origem` | — | — | — | vazio → "Origem é obrigatório" | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_debito.tributo` | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| valor | Valor | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| vencimento | Vencimento | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| dias_atraso | Dias de atraso | number | Não | — | — | — | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| status | Status | select | Não | única | `aberto` — Aberto; `parcelado` — Parcelado; `regularizado` — Regularizado; `cancelado` — Cancelado | `domainTable:x_2326104_cob_debito.status` | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| sobreposto | Sobreposto entre fontes | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |
| atualizado_em | Atualizado em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-T-002 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, origem, tributo, valor, vencimento, dias_atraso, status, sobreposto, atualizado_em
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F1-004 — TEL-004 Visão única do contribuinte

**RF relacionado:** RF-MOD-F1-005, RF-MOD-T-003  
**Etapa do fluxo:** ETP-008  
**Tela:** `TEL-004` · form da tabela `x_2326104_cob_contribuinte` (Contribuinte) · rota `/x_2326104_cob_contribuinte.do?sys_id=ad022df8dc8a447e8cd5eecf3b0f84d3` · print `screens/TEL-004.png`

**Personas:** Atendente de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Atendente de Cobrança abre «Visão única do contribuinte» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: TEL-004_registro_demo: contribuinte PJ fictício com débitos em CCF e SNE (sobreposição).

**Requisito de experiência:** O form mostra os campos do inventário em seções, o histórico de atividades (comentários e alterações) e as listas relacionadas `x_2326104_cob_debito.contribuinte`, `x_2326104_cob_parcelamento.contribuinte`, `x_2326104_cob_comunicacao.contribuinte`, `x_2326104_cob_consentimento.contribuinte`, `x_2326104_cob_regularizacao.contribuinte`.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- Só aparecem registros da carteira do atendente logado (RNF-SEGURANCA-002).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: campos preenchidos e mensagem de confirmação no topo ao salvar
- Erro de validação: campo obrigatório vazio fica marcado e o topo mostra a mensagem do inventário
- Erro de sistema: o topo mostra a mensagem de erro da plataforma e nada é gravado
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão; a página não carrega)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 120 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F1-005, RF-MOD-T-003 |
| tipo_pessoa | Tipo de pessoa | select | Sim | única | `pf` — Pessoa física; `pj` — Pessoa jurídica | `domainTable:x_2326104_cob_contribuinte.tipo_pessoa` | — | — | — | vazio → "Tipo de pessoa é obrigatório" | RF-MOD-F1-005, RF-MOD-T-003 |
| cpf | CPF | cpf | Não | — | — | — | 000.000.000-00 (fictício) | — | até 14 caracteres | — | RF-MOD-F1-005, RF-MOD-T-003 |
| cnpj | CNPJ | cnpj | Não | — | — | — | 00.000.000/0000-00 (fictício) | — | até 18 caracteres | — | RF-MOD-F1-005, RF-MOD-T-003 |
| municipio | Município | text | Não | — | — | — | — | — | até 80 caracteres | — | RF-MOD-F1-005, RF-MOD-T-003 |
| email | E-mail | text | Não | — | — | — | — | — | até 100 caracteres | — | RF-MOD-F1-005, RF-MOD-T-003 |
| telefone | Telefone | text | Não | — | — | — | — | — | até 20 caracteres | — | RF-MOD-F1-005, RF-MOD-T-003 |
| atendente | Atendente vinculado | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F1-005, RF-MOD-T-003 |
| segmento | Segmento | select | Não | única | `nao_avaliado` — Não avaliado; `massificada` — Massificada; `qualificada` — Qualificada; `controle` — Grupo de controle | `domainTable:x_2326104_cob_contribuinte.segmento` | — | — | — | — | RF-MOD-F1-005, RF-MOD-T-003 |
| score | Score de liquidez | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F1-005, RF-MOD-T-003 |
| sem_score | Sem score | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F1-005, RF-MOD-T-003 |
| valor_em_aberto | Valor em aberto | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F1-005, RF-MOD-T-003 |
| situacao | Situação | select | Não | única | `em_cobranca` — Em cobrança; `parcelado` — Em parcelamento; `regularizado` — Regularizado | `domainTable:x_2326104_cob_contribuinte.situacao` | — | — | — | — | RF-MOD-F1-005, RF-MOD-T-003 |
| ficticio | Fictício | checkbox | Sim | — | — | — | — | — | — | vazio → "Fictício é obrigatório" | RF-MOD-F1-005, RF-MOD-T-003 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | — | RF-MOD-F1-005, RF-MOD-T-003 |

**Grid / listagem** — (form; as listas relacionadas seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** —

---

### PR-MOD-F1-005 — TEL-005 Parcelamentos em risco

**RF relacionado:** RF-MOD-F1-004  
**Etapa do fluxo:** ETP-006  
**Tela:** `TEL-005` · list da tabela `x_2326104_cob_parcelamento` (Parcelamento) · rota `/x_2326104_cob_parcelamento_list.do` · print `screens/TEL-005.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Parcelamentos em risco» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F1-004 |
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_parcelamento.tributo` | — | — | — | — | RF-MOD-F1-004 |
| valor_total | Valor total | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F1-004 |
| parcelas_total | Parcelas | number | Não | — | — | — | — | — | — | — | RF-MOD-F1-004 |
| parcelas_atraso | Parcelas em atraso | number | Não | — | — | — | — | — | — | — | RF-MOD-F1-004 |
| status | Status | select | Não | única | `em_dia` — Em dia; `em_risco` — Em risco; `rompido` — Rompido; `quitado` — Quitado | `domainTable:x_2326104_cob_parcelamento.status` | — | — | — | — | RF-MOD-F1-004 |
| alerta_risco | Alerta de risco | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F1-004 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, tributo, valor_total, parcelas_total, parcelas_atraso, status, alerta_risco
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F1-006 — TEL-006 Staging de fontes (Simulado)

**RF relacionado:** RF-MOD-F1-001, RF-MOD-F1-002  
**Etapa do fluxo:** ETP-001  
**Tela:** `TEL-006` · list da tabela `x_2326104_cob_debito_stg` (Staging de fontes (Simulado)) · rota `/x_2326104_cob_debito_stg_list.do` · print `screens/TEL-006.png`

**Personas:** Administrador do app  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Administrador do app abre «Staging de fontes (Simulado)» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| origem | Origem | select | Sim | única | `ccf` — CCF; `mpi_bigdata` — MPI/Big Data; `ipva` — IPVA; `itcd` — ITCD; `sne` — SNE | `domainTable:x_2326104_cob_debito_stg.origem` | — | — | — | vazio → "Origem é obrigatório" | RF-MOD-F1-001, RF-MOD-F1-002 |
| tipo_pessoa | Tipo de pessoa | select | Não | única | `pf` — Pessoa física; `pj` — Pessoa jurídica | `domainTable:x_2326104_cob_debito_stg.tipo_pessoa` | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| cpf | CPF | cpf | Não | — | — | — | 000.000.000-00 (fictício) | — | até 14 caracteres | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| cnpj | CNPJ | cnpj | Não | — | — | — | 00.000.000/0000-00 (fictício) | — | até 18 caracteres | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| nome | Nome | text | Não | — | — | — | — | — | até 120 caracteres | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_debito_stg.tributo` | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| valor | Valor | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| processado | Processado | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| falha_simulada | Falha simulada | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F1-001, RF-MOD-F1-002 |
| ficticio | Fictício | checkbox | Sim | — | — | — | — | — | — | vazio → "Fictício é obrigatório" | RF-MOD-F1-001, RF-MOD-F1-002 |

**Grid / listagem**

- Colunas exibidas (em ordem): origem, tipo_pessoa, cpf, cnpj, nome, tributo, valor, processado, falha_simulada, ficticio
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F1-007 — TEL-032 Contribuintes

**RF relacionado:** RF-MOD-T-002, RF-MOD-T-003  
**Etapa do fluxo:** ETP-007  
**Tela:** `TEL-032` · list da tabela `x_2326104_cob_contribuinte` (Contribuinte) · rota `/x_2326104_cob_contribuinte_list.do` · print `screens/TEL-032.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Contribuintes» pelo menu «Cobrança MT» › Ingestão e Carteira Consolidada. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 120 caracteres | vazio → "Nome é obrigatório" | RF-MOD-T-002, RF-MOD-T-003 |
| tipo_pessoa | Tipo de pessoa | select | Sim | única | `pf` — Pessoa física; `pj` — Pessoa jurídica | `domainTable:x_2326104_cob_contribuinte.tipo_pessoa` | — | — | — | vazio → "Tipo de pessoa é obrigatório" | RF-MOD-T-002, RF-MOD-T-003 |
| cnpj | CNPJ | cnpj | Não | — | — | — | 00.000.000/0000-00 (fictício) | — | até 18 caracteres | — | RF-MOD-T-002, RF-MOD-T-003 |
| municipio | Município | text | Não | — | — | — | — | — | até 80 caracteres | — | RF-MOD-T-002, RF-MOD-T-003 |
| segmento | Segmento | select | Não | única | `nao_avaliado` — Não avaliado; `massificada` — Massificada; `qualificada` — Qualificada; `controle` — Grupo de controle | `domainTable:x_2326104_cob_contribuinte.segmento` | — | — | — | — | RF-MOD-T-002, RF-MOD-T-003 |
| atendente | Atendente vinculado | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-T-002, RF-MOD-T-003 |
| valor_em_aberto | Valor em aberto | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-T-002, RF-MOD-T-003 |
| situacao | Situação | select | Não | única | `em_cobranca` — Em cobrança; `parcelado` — Em parcelamento; `regularizado` — Regularizado | `domainTable:x_2326104_cob_contribuinte.situacao` | — | — | — | — | RF-MOD-T-002, RF-MOD-T-003 |
| ficticio | Fictício | checkbox | Sim | — | — | — | — | — | — | vazio → "Fictício é obrigatório" | RF-MOD-T-002, RF-MOD-T-003 |

**Grid / listagem**

- Colunas exibidas (em ordem): nome, tipo_pessoa, cnpj, municipio, segmento, atendente, valor_em_aberto, situacao, ficticio
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

## Módulo: Qualificação e Parametrização da Carteira (`MOD-F2`)

### PR-MOD-F2-001 — TEL-007 Critérios de qualificação

**RF relacionado:** RF-MOD-F2-001, RF-MOD-F2-002  
**Etapa do fluxo:** ETP-009  
**Tela:** `TEL-007` · list da tabela `x_2326104_cob_criterio` (Critério de qualificação) · rota `/x_2326104_cob_criterio_list.do` · print `screens/TEL-007.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Critérios de qualificação» pelo menu «Cobrança MT» › Qualificação e Parametrização da Carteira. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 100 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F2-001, RF-MOD-F2-002 |
| codigo | Código do critério | text | Não | — | — | — | — | — | até 40 caracteres | — | RF-MOD-F2-001, RF-MOD-F2-002 |
| versao | Versão | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002 |
| estado | Estado | select | Sim | única | `rascunho` — Rascunho; `publicada` — Publicada; `substituida` — Substituída | `domainTable:x_2326104_cob_criterio.estado` | — | — | — | vazio → "Estado é obrigatório" | RF-MOD-F2-001, RF-MOD-F2-002 |
| tributo | Tributo | select | Não | única | `todos` — Todos; `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_criterio.tributo` | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002 |
| valor_minimo | Valor mínimo | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002 |
| atraso_minimo_dias | Atraso mínimo (dias) | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002 |
| publicada_em | Publicada em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002 |

**Grid / listagem**

- Colunas exibidas (em ordem): nome, codigo, versao, estado, tributo, valor_minimo, atraso_minimo_dias, publicada_em
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F2-002 — TEL-008 Versão do critério de qualificação

**RF relacionado:** RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005  
**Etapa do fluxo:** ETP-010  
**Tela:** `TEL-008` · form da tabela `x_2326104_cob_criterio` (Critério de qualificação) · rota `/x_2326104_cob_criterio.do?sys_id=d5fc10ccc165417891772b280ae1b4c2` · print `screens/TEL-008.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Versão do critério de qualificação» pelo menu «Cobrança MT» › Qualificação e Parametrização da Carteira. Registro de exemplo: TEL-008_registro_demo: critério ICMS, valor ≥ R$ 500 mil, atraso ≥ 90 dias, versão 2 publicada.

**Requisito de experiência:** O form mostra os campos do inventário em seções, o histórico de atividades (comentários e alterações) e as listas relacionadas `x_2326104_cob_criterio.versao_anterior`, `x_2326104_cob_ciclo.criterio`.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: campos preenchidos e mensagem de confirmação no topo ao salvar
- Erro de validação: campo obrigatório vazio fica marcado e o topo mostra a mensagem do inventário
- Erro de sistema: o topo mostra a mensagem de erro da plataforma e nada é gravado
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão; a página não carrega)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 100 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| codigo | Código do critério | text | Não | — | — | — | — | — | até 40 caracteres | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| versao | Versão | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| estado | Estado | select | Sim | única | `rascunho` — Rascunho; `publicada` — Publicada; `substituida` — Substituída | `domainTable:x_2326104_cob_criterio.estado` | — | — | — | vazio → "Estado é obrigatório" | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| tributo | Tributo | select | Não | única | `todos` — Todos; `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_criterio.tributo` | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| valor_minimo | Valor mínimo | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| atraso_minimo_dias | Atraso mínimo (dias) | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| instrumento | Instrumento | text | Não | — | — | — | — | — | até 80 caracteres | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| excluir_contumaz | Excluir contumazes | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| usar_score | Usar score de liquidez | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| threshold_score | Threshold do score | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| pct_grupo_controle | Grupo de controle (%) | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| desempate | Desempate | select | Não | única | `maior_debito_mais_antigo` — Maior débito, depois o mais antigo | `domainTable:x_2326104_cob_criterio.desempate` | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| versao_anterior | Versão anterior | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_criterio` | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| motivo_alteracao | Motivo da nova versão | text | Não | — | — | — | — | — | até 255 caracteres | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| publicada_em | Publicada em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| publicada_por | Publicada por | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | — | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-005 |

**Grid / listagem** — (form; as listas relacionadas seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** GAP-020

---

### PR-MOD-F2-003 — TEL-009 Ciclo de qualificação (prévia)

**RF relacionado:** RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006  
**Etapa do fluxo:** ETP-011, ETP-013  
**Tela:** `TEL-009` · form da tabela `x_2326104_cob_ciclo` (Ciclo de qualificação) · rota `/x_2326104_cob_ciclo.do?sys_id=67fc0380efcd42fe9d3da42308b5384d` · print `screens/TEL-009.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Ciclo de qualificação (prévia)» pelo menu «Cobrança MT» › Qualificação e Parametrização da Carteira. Registro de exemplo: TEL-009_registro_demo: ciclo 2027-01 em prévia com 10% de grupo de controle.

**Requisito de experiência:** O form mostra os campos do inventário em seções, o histórico de atividades (comentários e alterações) e as listas relacionadas `x_2326104_cob_segmentacao.ciclo`.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: campos preenchidos e mensagem de confirmação no topo ao salvar
- Erro de validação: campo obrigatório vazio fica marcado e o topo mostra a mensagem do inventário
- Erro de sistema: o topo mostra a mensagem de erro da plataforma e nada é gravado
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão; a página não carrega)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 60 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| referencia | Mês de referência | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| criterio | Critério aplicado | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_criterio` | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| estado | Estado | select | Não | única | `previa` — Prévia; `publicado` — Publicado; `encerrado` — Encerrado | `domainTable:x_2326104_cob_ciclo.estado` | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| qtd_elegiveis | Elegíveis | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| semente_sorteio | Semente do sorteio | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| qtd_massificada | Massificada | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| qtd_qualificada | Qualificada | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| qtd_controle | Grupo de controle | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| qtd_sem_score | Sem score | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| taxa_cobrada | Taxa da carteira cobrada (%) | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| taxa_controle | Taxa do grupo de controle (%) | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| efeito_incremental | Efeito incremental (p.p.) | number | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| publicado_em | Publicado em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| publicado_por | Publicado por | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-006 |

**Grid / listagem** — (form; as listas relacionadas seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** —

---

### PR-MOD-F2-004 — TEL-010 Carteira segmentada

**RF relacionado:** RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002  
**Etapa do fluxo:** ETP-012  
**Tela:** `TEL-010` · list da tabela `x_2326104_cob_segmentacao` (Carteira segmentada) · rota `/x_2326104_cob_segmentacao_list.do` · print `screens/TEL-010.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Carteira segmentada» pelo menu «Cobrança MT» › Qualificação e Parametrização da Carteira. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| ciclo | Ciclo | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | vazio → "Ciclo é obrigatório" | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| criterio | Versão do critério | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_criterio` | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| segmento | Segmento | select | Não | única | `massificada` — Massificada; `qualificada` — Qualificada; `controle` — Grupo de controle | `domainTable:x_2326104_cob_segmentacao.segmento` | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| valor_em_aberto | Valor em aberto | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| score_usado | Score usado | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| sem_score | Sem score | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |
| motivo | Motivo | text | Não | — | — | — | — | — | até 255 caracteres | — | RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-T-002 |

**Grid / listagem**

- Colunas exibidas (em ordem): ciclo, contribuinte, criterio, segmento, valor_em_aberto, score_usado, sem_score, motivo
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F2-005 — TEL-036 Ciclo do mês

**RF relacionado:** RF-MOD-F2-003, RF-MOD-F2-004
**Etapa do fluxo:** ETP-013, ETP-040
**Tela:** `TEL-036` · lista da tabela `x_2326104_cob_ciclo` (Ciclo de qualificação), view `x_2326104_cob_tel_036` · rota `/x_2326104_cob_ciclo_list.do?sysparm_view=x_2326104_cob_tel_036` · print `screens/TEL-036.png`

**Personas:** Coordenador de Cobrança
**Prioridade:** Must
**Origem:** design UX v2 (CUJ-2), tela instalada na instância na F1

**Contexto de uso:** Coordenador de Cobrança abre «Ciclo do mês» pelo menu. A lista traz os ciclos não encerrados com «O que fazer agora».

**Requisito de experiência:** O coordenador marca o ciclo e escolhe em «Ações nas linhas selecionadas»: «Publicar ciclo» (ciclo em prévia) e «Distribuir lista» (publicado sem distribuição); o menu da linha (botão direito) traz as mesmas ações. Publicar o ciclo inscreve os contribuintes massificados com débito aberto na régua da carteira (TEL-037). Update no form só na prévia.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Publicar ou distribuir a partir da lista em até 2 cliques (G1 do design UX v2).

**Antipadrão (o que evitar):**
- Ação oferecida num estado em que ela recusa (ex.: «Publicar ciclo» num ciclo publicado).

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: mensagem no topo com o resultado da ação
- Vazio: «Nenhum registro» da plataforma
- Erro de sistema: o topo mostra a mensagem de erro e nada é gravado

**Gap associado:** —

---

## Módulo: Scoring de Liquidez (`MOD-F3`)

### PR-MOD-F3-001 — TEL-011 Painel do score de liquidez

**RF relacionado:** RF-MOD-F3-006  
**Etapa do fluxo:** ETP-016  
**Tela:** `TEL-011` · report da tabela `x_2326104_cob_score_sim` (Score de liquidez (Simulado)) · rota `/sys_report_template.do?jvar_report_id=2b9fb315939349ffb1dfb40c6cf6af59` · print `screens/TEL-011.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Painel do score de liquidez» pelo menu «Cobrança MT» › Scoring de Liquidez. Registro de exemplo: report: seed fictício por tributo e status.

**Requisito de experiência:** O relatório agrupa os registros da tabela por `tributo` e mostra a contagem de cada grupo.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_score_sim.tributo` | — | — | — | — | RF-MOD-F3-006 |

**Grid / listagem**

- Colunas exibidas (em ordem): tributo, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-008

---

### PR-MOD-F3-002 — TEL-012 Scores ingeridos (Simulado)

**RF relacionado:** RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005  
**Etapa do fluxo:** ETP-015  
**Tela:** `TEL-012` · list da tabela `x_2326104_cob_score_sim` (Score de liquidez (Simulado)) · rota `/x_2326104_cob_score_sim_list.do` · print `screens/TEL-012.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Scores ingeridos (Simulado)» pelo menu «Cobrança MT» › Scoring de Liquidez. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 |
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_score_sim.tributo` | — | — | — | — | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 |
| score | Score | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 |
| versao_modelo | Versão do modelo | text | Não | — | — | — | — | — | até 20 caracteres | — | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 |
| ingerido_em | Ingerido em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 |
| status | Status | select | Não | única | `valido` — Válido; `invalido` — Inválido; `sem_score` — Sem score | `domainTable:x_2326104_cob_score_sim.status` | — | — | — | — | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, tributo, score, versao_modelo, ingerido_em, status
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

## Módulo: Réguas de Cobrança Multicanal (`MOD-F4`)

### PR-MOD-F4-001 — TEL-013 Réguas de cobrança

**RF relacionado:** RF-MOD-F4-001  
**Etapa do fluxo:** ETP-017  
**Tela:** `TEL-013` · list da tabela `x_2326104_cob_regua` (Régua de cobrança) · rota `/x_2326104_cob_regua_list.do` · print `screens/TEL-013.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Réguas de cobrança» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 100 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F4-001 |
| carteira | Carteira | select | Sim | única | `parcelamentos` — Parcelamentos; `ipva` — IPVA; `itcd` — ITCD; `icms_normal` — ICMS Normal; `icms_st` — ICMS ST | `domainTable:x_2326104_cob_regua.carteira` | — | — | — | vazio → "Carteira é obrigatório" | RF-MOD-F4-001 |
| ativa | Ativa | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F4-001 |
| janela_atribuicao_dias | Janela de atribuição (dias) | number | Não | — | — | — | — | — | — | — | RF-MOD-F4-001 |
| ordem_fallback | Ordem de fallback de canal | text | Não | — | — | — | — | — | até 60 caracteres | — | RF-MOD-F4-001 |

**Grid / listagem**

- Colunas exibidas (em ordem): nome, carteira, ativa, janela_atribuicao_dias, ordem_fallback
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F4-002 — TEL-014 Editor de régua

**RF relacionado:** RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009  
**Etapa do fluxo:** ETP-018  
**Tela:** `TEL-014` · form da tabela `x_2326104_cob_regua` (Régua de cobrança) · rota `/x_2326104_cob_regua.do?sys_id=9a4d959966c4468794d7daa6482851ff` · print `screens/TEL-014.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Editor de régua» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: TEL-014_registro_demo: régua IPVA com 4 etapas (SNE, e-mail, SMS, encaminhar à qualificada).

**Requisito de experiência:** O form mostra os campos do inventário em seções, o histórico de atividades (comentários e alterações) e as listas relacionadas Etapas (`x_2326104_cob_regua_etapa.regua`, por ordem), Inscrições (`x_2326104_cob_regua_inscricao.regua`) e Comunicações (`x_2326104_cob_comunicacao.regua`). Botões «Pausar» (régua ativa) e «Ativar» (régua pausada). Links «Ver execuções» (lista de execuções do Flow da régua, `sys_flow_context`, mais recentes primeiro) e «Abrir no Flow Designer» (o Flow «Régua: <nome>»; só aparece com o campo «Flow» preenchido). O coordenador lê o campo «Flow» e não o grava; código e carteira também são só do admin do app. Edição no Designer vale até o próximo reinstall, salvo se levada à fonte (`outputs/spec/demo/roteiro.md`, design UX v2 D12, D15).

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: campos preenchidos e mensagem de confirmação no topo ao salvar
- Erro de validação: campo obrigatório vazio fica marcado e o topo mostra a mensagem do inventário
- Erro de sistema: o topo mostra a mensagem de erro da plataforma e nada é gravado
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão; a página não carrega)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 100 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 |
| codigo | Código | text | Sim | — | — | — | — | — | até 40 caracteres | só leitura para o coordenador; repetido → "Operação recusada: já existe régua com este código." | RF-MOD-F4-001 |
| carteira | Carteira | select | Sim | única | `parcelamentos` — Parcelamentos; `ipva` — IPVA; `itcd` — ITCD; `icms_normal` — ICMS Normal; `icms_st` — ICMS ST | `domainTable:x_2326104_cob_regua.carteira` | — | — | — | vazio → "Carteira é obrigatório" | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 |
| ativa | Ativa | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 |
| prazo_final_dias | Prazo de resposta depois da última etapa (dias) | number | Sim | — | — | — | — | 5 | — | vazio → "Informe o prazo de resposta depois da última etapa." | RF-MOD-F4-003, RF-MOD-F4-009 |
| janela_atribuicao_dias | Janela de atribuição (dias) | number | Não | — | — | — | — | — | — | — | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 |
| flow | Flow | lookup | Não | única | *(dinâmica)* | `domainTable:sys_hub_flow` | — | Flow «Régua: <nome>» do gerador | — | só leitura para o coordenador (só o admin do app grava) | RF-MOD-F4-002 |
| ordem_fallback | Ordem de fallback de canal | text | Não | — | — | — | — | — | até 60 caracteres | — | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | — | RF-MOD-F4-001, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-009 |

**Grid / listagem** — (form; as listas relacionadas seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** —

---

### PR-MOD-F4-003 — TEL-015 Execução e status de disparo

**RF relacionado:** RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006  
**Etapa do fluxo:** ETP-020  
**Tela:** `TEL-015` · list da tabela `x_2326104_cob_comunicacao` (Comunicação) · rota `/x_2326104_cob_comunicacao_list.do` · print `screens/TEL-015.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Execução e status de disparo» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| regua | Régua | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_regua` | — | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| etapa | Etapa | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_regua_etapa` | — | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| ciclo | Ciclo | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| canal | Canal | select | Não | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp | `domainTable:x_2326104_cob_comunicacao.canal` | — | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| status | Status | select | Não | única | `agendada` — Agendada; `enviada` — Enviada; `entregue` — Entregue; `falha` — Falha; `pulada` — Pulada; `encerrada` — Encerrada | `domainTable:x_2326104_cob_comunicacao.status` | — | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| motivo | Motivo | text | Não | — | — | — | — | — | até 255 caracteres | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| enviada_em | Enviada em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |
| tentativas | Tentativas | number | Não | — | — | — | — | — | — | — | RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, regua, etapa, ciclo, canal, status, motivo, enviada_em, tentativas
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F4-004 — TEL-016 Efetividade da régua

**RF relacionado:** RF-MOD-F4-008  
**Etapa do fluxo:** ETP-025  
**Tela:** `TEL-016` · report da tabela `x_2326104_cob_comunicacao` (Comunicação) · rota `/sys_report_template.do?jvar_report_id=beadc90588a64760ac1c4ff10e3607e9` · print `screens/TEL-016.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Efetividade da régua» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: report: seed fictício por canal e status.

**Requisito de experiência:** O relatório agrupa os registros da tabela por `canal` e mostra a contagem de cada grupo.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| canal | Canal | select | Não | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp | `domainTable:x_2326104_cob_comunicacao.canal` | — | — | — | — | RF-MOD-F4-008 |

**Grid / listagem**

- Colunas exibidas (em ordem): canal, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F4-005 — TEL-017 Consentimentos por canal

**RF relacionado:** RF-MOD-F4-005  
**Etapa do fluxo:** ETP-021  
**Tela:** `TEL-017` · list da tabela `x_2326104_cob_consentimento` (Consentimento por canal) · rota `/x_2326104_cob_consentimento_list.do` · print `screens/TEL-017.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Consentimentos por canal» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F4-005 |
| canal | Canal | select | Sim | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp | `domainTable:x_2326104_cob_consentimento.canal` | — | — | — | vazio → "Canal é obrigatório" | RF-MOD-F4-005 |
| situacao | Situação | select | Sim | única | `opt_in` — Opt-in; `opt_out` — Opt-out | `domainTable:x_2326104_cob_consentimento.situacao` | — | — | — | vazio → "Situação é obrigatório" | RF-MOD-F4-005 |
| registrado_em | Registrado em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F4-005 |
| origem | Origem do registro | text | Não | — | — | — | — | — | até 80 caracteres | — | RF-MOD-F4-005 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, canal, situacao, registrado_em, origem
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F4-006 — TEL-018 Canais de envio (Simulado)

**RF relacionado:** RF-MOD-F4-004, RF-MOD-F4-005  
**Etapa do fluxo:** ETP-022  
**Tela:** `TEL-018` · list da tabela `x_2326104_cob_canal_sim` (Canal de envio (Simulado)) · rota `/x_2326104_cob_canal_sim_list.do` · print `screens/TEL-018.png`

**Personas:** Administrador do app  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Administrador do app abre «Canais de envio (Simulado)» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: lista: 4 canais do seed.

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| canal | Canal | select | Sim | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp | `domainTable:x_2326104_cob_canal_sim.canal` | — | — | — | vazio → "Canal é obrigatório" | RF-MOD-F4-004, RF-MOD-F4-005 |
| contratado | Contratado | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F4-004, RF-MOD-F4-005 |
| forcar_falha | Forçar falha | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F4-004, RF-MOD-F4-005 |
| exige_opt_in | Exige opt-in | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F4-004, RF-MOD-F4-005 |

**Grid / listagem**

- Colunas exibidas (em ordem): canal, contratado, forcar_falha, exige_opt_in
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-009

---

### PR-MOD-F4-007 — TEL-019 Retorno de envio (Simulado)

**RF relacionado:** RF-MOD-F4-006  
**Etapa do fluxo:** ETP-023  
**Tela:** `TEL-019` · list da tabela `x_2326104_cob_envio_sim` (Retorno de envio (Simulado)) · rota `/x_2326104_cob_envio_sim_list.do` · print `screens/TEL-019.png`

**Personas:** Administrador do app  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Administrador do app abre «Retorno de envio (Simulado)» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| comunicacao | Comunicação | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_comunicacao` | — | — | — | vazio → "Comunicação é obrigatório" | RF-MOD-F4-006 |
| canal | Canal | select | Não | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp | `domainTable:x_2326104_cob_envio_sim.canal` | — | — | — | — | RF-MOD-F4-006 |
| status_retorno | Status de retorno | select | Não | única | `entregue` — Entregue; `falha` — Falha; `recusado_sem_optin` — Recusado sem opt-in | `domainTable:x_2326104_cob_envio_sim.status_retorno` | — | — | — | — | RF-MOD-F4-006 |
| codigo_retorno | Código de retorno | text | Não | — | — | — | — | — | até 20 caracteres | — | RF-MOD-F4-006 |
| recebido_em | Recebido em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F4-006 |

**Grid / listagem**

- Colunas exibidas (em ordem): comunicacao, canal, status_retorno, codigo_retorno, recebido_em
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F4-008 — TEL-020 Regularizações

**RF relacionado:** RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004  
**Etapa do fluxo:** ETP-024  
**Tela:** `TEL-020` · list da tabela `x_2326104_cob_regularizacao` (Regularização) · rota `/x_2326104_cob_regularizacao_list.do` · print `screens/TEL-020.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Regularizações» pelo menu «Cobrança MT» › Réguas de Cobrança Multicanal. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_regularizacao.tributo` | — | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| valor | Valor regularizado | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| data | Data | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| origem | Origem | select | Sim | única | `espontanea` — Espontânea; `resposta_cobranca` — Resposta à cobrança | `domainTable:x_2326104_cob_regularizacao.origem` | — | — | — | vazio → "Origem é obrigatório" | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| canal | Canal | select | Não | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp; `atendimento` — Atendimento; `nenhum` — Nenhum | `domainTable:x_2326104_cob_regularizacao.canal` | — | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| instrumento | Instrumento | select | Não | única | `regua` — Régua; `qualificada` — Cobrança qualificada; `nenhum` — Nenhum | `domainTable:x_2326104_cob_regularizacao.instrumento` | — | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| grupo_controle | Grupo de controle | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |
| atendente | Atendente | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F4-007, RF-MOD-F6-003, RF-MOD-T-004 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, tributo, valor, data, origem, canal, instrumento, grupo_controle, atendente
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F4-009 — TEL-037 Inscrições na régua

**RF relacionado:** RF-MOD-F4-002, RF-MOD-F4-003
**Etapa do fluxo:** ETP-044, ETP-045
**Tela:** `TEL-037` · lista da tabela `x_2326104_cob_regua_inscricao` (Inscrição na régua) · rota `/x_2326104_cob_regua_inscricao_list.do` · print `screens/TEL-037.png`

**Personas:** Coordenador de Cobrança
**Prioridade:** Must
**Origem:** design UX v2 (CUJ-4, CUJ-6), tela instalada na instância na F4

**Contexto de uso:** Coordenador de Cobrança abre «Réguas» › «Inscrições». A lista traz as inscrições ativas e com erro, por próxima etapa.

**Requisito de experiência:** Cada linha é um contribuinte numa régua: régua, etapa atual, próxima etapa em, status e motivo de encerramento. Nenhuma persona cria, grava ou apaga inscrição: ela nasce da publicação do ciclo ou do parcelamento em risco e o motor da régua a atualiza. O atendente lê só as inscrições da própria carteira e não tem o módulo no menu.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Inscrição com erro aparece no topo da lista.

**Antipadrão (o que evitar):**
- Botão New ou edição em lista na inscrição.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: lista com as inscrições ativas e com erro
- Vazio: «Nenhum registro» (nenhuma régua disparada)
- Erro de sistema: mensagem de erro da plataforma

**Gap associado:** GAP-160, GAP-161

---

### PR-MOD-F4-010 — TEL-038 Inscrição na régua

**RF relacionado:** RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-006, RF-MOD-F4-009
**Etapa do fluxo:** ETP-045, ETP-046
**Tela:** `TEL-038` · form da tabela `x_2326104_cob_regua_inscricao` (Inscrição na régua) · rota `/x_2326104_cob_regua_inscricao.do?sys_id=59a5b26622ef43809bb13bf963b7c2b7` · print `screens/TEL-038.png`

**Personas:** Coordenador de Cobrança
**Prioridade:** Must
**Origem:** design UX v2 (CUJ-4 a CUJ-6), tela instalada na instância na F2

**Contexto de uso:** Coordenador de Cobrança abre a inscrição pela lista TEL-037 ou pela related list «Inscrições» da régua (TEL-014). Registro de exemplo: TEL-038_registro_demo: inscrição na régua IPVA encerrada por regularização na etapa 2.

**Requisito de experiência:** O form mostra a inscrição (contribuinte, régua, status, etapa atual, próxima etapa em, iniciada e encerrada em, motivo, ciclo, parcelamento, contato da cobrança ativa, detalhe do erro) e as related lists Comunicações e Retornos de envio. O link «Ver execução» abre a execução do Flow dessa inscrição: para o coordenador, o registro da execução (estado, tempo e log); para quem tem `flow_admin` (admin), os detalhes etapa a etapa no Flow Designer (GAP-162); sem execução (registro de exemplo, inscrição antiga), o topo mostra «Execução não encontrada.» e o form continua aberto. Coordenador e admin do app veem o link; o atendente não.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Da inscrição à execução no Flow Designer: 1 clique.

**Antipadrão (o que evitar):**
- Campo editável na inscrição (o motor grava; as personas só leem).

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: campos e related lists preenchidos
- Erro de sistema: o topo mostra a mensagem de erro da plataforma
- Vazio: não se aplica (form sempre abre um registro)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | só leitura | RF-MOD-F4-002 |
| regua | Régua | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_regua` | — | — | — | só leitura | RF-MOD-F4-002 |
| status | Status | select | Não | única | `ativa` — Ativa; `encerrada` — Encerrada; `erro` — Erro | `domainTable:x_2326104_cob_regua_inscricao.status` | — | ativa | — | só leitura | RF-MOD-F4-003 |
| etapa_atual | Etapa atual | number | Não | — | — | — | — | 0 | — | só leitura | RF-MOD-F4-003 |
| proxima_etapa_em | Próxima etapa em | datetime | Não | — | — | — | DD/MM/AAAA hh:mm | — | — | só leitura | RF-MOD-F4-003 |
| iniciada_em | Iniciada em | datetime | Não | — | — | — | DD/MM/AAAA hh:mm | — | — | só leitura | RF-MOD-F4-002 |
| encerrada_em | Encerrada em | datetime | Não | — | — | — | DD/MM/AAAA hh:mm | — | — | só leitura | RF-MOD-F4-003 |
| motivo_encerramento | Motivo de encerramento | select | Não | única | `regularizado` — Regularizado; `parcelamento_rompido` — Parcelamento rompido; `controle` — Grupo de controle; `regua_pausada` — Régua pausada; `encaminhada_ativa` — Encaminhada à cobrança ativa; `encaminhada_qualificada` — Encaminhada à qualificada | `domainTable:x_2326104_cob_regua_inscricao.motivo_encerramento` | — | — | — | só leitura | RF-MOD-F4-003, RF-MOD-F4-009 |
| ciclo | Ciclo | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | só leitura | RF-MOD-F4-002 |
| parcelamento | Parcelamento | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_parcelamento` | — | — | — | só leitura | RF-MOD-F4-002 |
| contato | Contato da cobrança ativa | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_contato` | — | — | — | só leitura | RF-MOD-F4-009 |
| detalhe | Detalhe | text | Não | — | — | — | — | — | até 255 caracteres | só leitura (mensagem de erro do motor) | RF-MOD-F4-003 |

**Grid / listagem** — (form; Comunicações e Retornos de envio seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** —

---

## Módulo: Cobrança Qualificada (`MOD-F5`)

### PR-MOD-F5-001 — TEL-021 Distribuição da carteira qualificada

**RF relacionado:** RF-MOD-F5-001  
**Etapa do fluxo:** ETP-026  
**Tela:** `TEL-021` · list da tabela `x_2326104_cob_caso` (Caso de cobrança qualificada) · rota `/x_2326104_cob_caso_list.do` · print `screens/TEL-021.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Distribuição da carteira qualificada» pela área «Administração» ou pela lista de casos. Registro de exemplo: lista: casos do seed manual (6). O dono do caso é o coordenador responsável (coluna «Responsável»).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F5-001 |
| coordenador | Responsável | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F5-001 |
| ciclo | Ciclo | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | — | RF-MOD-F5-001 |
| estagio | Estágio | select | Não | única | `em_selecao` — Em seleção; `selecionado` — Caso selecionado; `dossie_gerado` — Dossiê gerado; `conducao` — Condução; `encerrado` — Encerrado | `domainTable:x_2326104_cob_caso.estagio` | — | — | — | — | RF-MOD-F5-001 |
| prioridade | Prioridade | number | Não | — | — | — | — | — | — | — | RF-MOD-F5-001 |
| score | Score de liquidez | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F5-001 |
| sem_score | Sem score | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F5-001 |
| valor_em_aberto | Valor em aberto (R$) | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F5-001 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, coordenador (Responsável), ciclo, estagio, prioridade, score, sem_score, valor_em_aberto
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F5-002 — TEL-022 Carga por responsável

**RF relacionado:** RF-MOD-F5-001  
**Etapa do fluxo:** ETP-027  
**Tela:** `TEL-022` · report da tabela `x_2326104_cob_caso` (Caso de cobrança qualificada) · rota `/sys_report_template.do?jvar_report_id=ff58b093be4d42db947a1cfcc7ddd9df` · print `screens/TEL-022.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Carga por responsável» na área «Analytics». Registro de exemplo: report: casos do seed manual por estágio.

**Requisito de experiência:** O relatório mostra a contagem de casos qualificados por estágio, com o responsável (coordenador) como agrupamento disponível.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| coordenador | Responsável | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F5-001 |
| estagio | Estágio | select | Não | única | `em_selecao` — Em seleção; `selecionado` — Caso selecionado; `dossie_gerado` — Dossiê gerado; `conducao` — Condução; `encerrado` — Encerrado | `domainTable:x_2326104_cob_caso.estagio` | — | — | — | — | RF-MOD-F5-001 |

**Grid / listagem**

- Colunas exibidas (em ordem): estagio, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F5-003 — TEL-023 Casos qualificados

**RF relacionado:** RF-MOD-F5-002, RF-MOD-F5-007  
**Etapa do fluxo:** ETP-028  
**Tela:** `TEL-023` · list da tabela `x_2326104_cob_caso` (Caso de cobrança qualificada) · rota `/x_2326104_cob_caso_list.do?sysparm_view=x_2326104_cob_tel_023` · print `screens/TEL-023.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança entra direto em «Casos qualificados» (home do papel) ou pelo menu «Cobrança MT» › Casos qualificados. Registro de exemplo: lista: 6 casos qualificados do coordenador demo, um por etapa. Substitui a antiga «Minha fila» do atendente (design UX v1, R6).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- Só aparecem casos não encerrados de que o coordenador logado é responsável (RNF-SEGURANCA-002); o atendente não tem acesso.
- Da home ao caso aberto: 1 clique (`outputs/spec/screens/ux-v1/acoes.json`).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar caso a quem só tem o papel de atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F5-002, RF-MOD-F5-007 |
| estagio | Estágio | select | Não | única | `em_selecao` — Em seleção; `selecionado` — Caso selecionado; `dossie_gerado` — Dossiê gerado; `conducao` — Condução; `encerrado` — Encerrado | `domainTable:x_2326104_cob_caso.estagio` | — | — | — | — | RF-MOD-F5-002, RF-MOD-F5-007 |
| prioridade | Prioridade | number | Não | — | — | — | — | — | — | — | RF-MOD-F5-002, RF-MOD-F5-007 |
| valor_em_aberto | Valor em aberto (R$) | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F5-002, RF-MOD-F5-007 |
| sinal_coercitivo | Sinalização coercitiva ativa | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F5-002, RF-MOD-F5-007 |
| ciclo | Ciclo | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | — | RF-MOD-F5-002, RF-MOD-F5-007 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, estagio, prioridade, valor_em_aberto, sinal_coercitivo, ciclo
- Filtro do módulo: `estagio!=encerrado`
- Ordenação default: sequência das etapas (`etapa_ordem`) e, dentro da etapa, maior prioridade primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-F5-004 — TEL-024 Dossiê do caso

**RF relacionado:** RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003  
**Etapa do fluxo:** ETP-029, ETP-031  
**Tela:** `TEL-024` · form da tabela `x_2326104_cob_caso` (Caso de cobrança qualificada) · rota `/x_2326104_cob_caso.do?sys_id=541104d723384cd0bd1aaa40e178ae60` · print `screens/TEL-024.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre o caso na lista «Casos qualificados» (TEL-023). Registro de exemplo: TEL-024_registro_demo: caso fictício em condução do coordenador demo, com sinalização coercitiva.

**Requisito de experiência:** A trilha de etapas (em seleção → selecionado → dossiê → condução → encerrado) fica no topo do form. O caso anda pelo botão «Avançar etapa» (uma etapa por vez) e termina pelo botão «Encerrar caso», que exige o motivo; «Estágio» e «Encerrado em» não são editáveis à mão e o servidor recusa pular etapa, encerrar sem motivo ou reabrir, também por lista e API (GAP-152). O form mostra os campos do inventário em seções, o histórico de atividades (comentários e alterações) e as listas relacionadas `x_2326104_cob_debito.contribuinte`, `x_2326104_cob_parcelamento.contribuinte`, `x_2326104_cob_comunicacao.contribuinte`, `x_2326104_cob_interacao.caso`, `x_2326104_cob_regularizacao.caso`.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- Só o coordenador responsável (e o admin) abre o caso; o atendente não tem acesso (RNF-SEGURANCA-002).
- Da home ao caso avançado: 2 cliques (`outputs/spec/screens/ux-v1/acoes.json`).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mudar o estágio fora dos botões.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: campos preenchidos e mensagem de confirmação no topo ao salvar
- Erro de validação: «Encerrar caso» sem motivo marca o campo e o topo mostra «Operação recusada: informe o motivo de encerramento.»
- Erro de sistema: o topo mostra a mensagem de erro da plataforma e nada é gravado
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão; a página não carrega)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| coordenador | Responsável | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| ciclo | Ciclo | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| estagio | Estágio | select | Não | única | `em_selecao` — Em seleção; `selecionado` — Caso selecionado; `dossie_gerado` — Dossiê gerado; `conducao` — Condução; `encerrado` — Encerrado | `domainTable:x_2326104_cob_caso.estagio` | — | — | — | muda só por «Avançar etapa» e «Encerrar caso» → «Operação recusada: o caso anda uma etapa por vez; use «Avançar etapa».» | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| prioridade | Prioridade | number | Não | — | — | — | — | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| score | Score de liquidez | number | Não | — | — | — | — | — | 0 a 100 | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| sem_score | Sem score | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| valor_em_aberto | Valor em aberto (R$) | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| sinal_coercitivo | Sinalização coercitiva ativa | checkbox | Não | — | — | — | — | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| sinal_coercitivo_desc | Sinalização coercitiva (descrição) | text | Não | — | — | — | — | — | até 255 caracteres | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| motivo_encerramento | Motivo de encerramento | select | Não | única | `regularizado` — Regularizado; `esgotado` — Esgotado; `outro` — Outro | `domainTable:x_2326104_cob_caso.motivo_encerramento` | — | — | — | vazio ao encerrar → "Operação recusada: informe o motivo de encerramento." | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| encerrado_em | Encerrado em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | — | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003 |

**Grid / listagem** — (form; as listas relacionadas seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** GAP-012

---

### PR-MOD-F5-005 — TEL-025 Registro de interação

**RF relacionado:** RF-MOD-F5-005  
**Etapa do fluxo:** ETP-030  
**Tela:** `TEL-025` · form da tabela `x_2326104_cob_interacao` (Interação) · rota `/x_2326104_cob_interacao.do?sys_id=385ad7c968ff4f8c93f0d9f1e64350e0` · print `screens/TEL-025.png`

**Personas:** Coordenador de Cobrança (no caso); a interação do contato nasce do botão «Registrar ligação» (TEL-035)  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança registra a interação pela lista relacionada «Interações» do caso (TEL-024). Registro de exemplo: TEL-025_registro_demo: interação «promessa de pagamento» registrada pelo coordenador. A interação aponta para um contato da lista ou para um caso, nunca para os dois.

**Requisito de experiência:** O form mostra os campos do inventário em seções, o histórico de atividades (comentários e alterações) e as listas relacionadas —.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- O atendente vê só interações dos próprios contatos; interação de caso só o coordenador responsável (RNF-SEGURANCA-002).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: campos preenchidos e mensagem de confirmação no topo ao salvar
- Erro de validação: campo obrigatório vazio fica marcado e o topo mostra a mensagem do inventário
- Erro de sistema: o topo mostra a mensagem de erro da plataforma e nada é gravado
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão; a página não carrega)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| caso | Caso qualificado | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_caso` | — | — | — | contato e caso juntos, ou nenhum → "Operação recusada: a interação pertence a um contato ou a um caso." | RF-MOD-F5-005 |
| contato | Contato da lista | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_contato` | — | — | — | contato e caso juntos, ou nenhum → "Operação recusada: a interação pertence a um contato ou a um caso." | RF-MOD-F5-005 |
| atendente | Atendente | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F5-005 |
| tipo | Tipo | select | Não | única | `telefone` — Telefone; `email` — E-mail; `presencial` — Presencial; `dte` — DT-e | `domainTable:x_2326104_cob_interacao.tipo` | — | — | — | — | RF-MOD-F5-005 |
| resultado | Resultado | select | Sim | única | `contato_efetivo` — Contato efetivo; `sem_contato` — Sem contato; `promessa_pagamento` — Promessa de pagamento; `recusa` — Recusa | `domainTable:x_2326104_cob_interacao.resultado` | — | — | — | vazio → "Resultado é obrigatório" | RF-MOD-F5-005 |
| descricao | Anotação | text | Não | — | — | — | — | — | até 4000 caracteres | — | RF-MOD-F5-005 |
| ocorrida_em | Ocorrida em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-F5-005 |
| retorno_em | Retorno em | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F5-005 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | — | RF-MOD-F5-005 |

**Grid / listagem** — (form; as listas relacionadas seguem o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** —

---

## Módulo: Monitoramento, KPIs e Grupo de Controle (`MOD-F6`)

### PR-MOD-F6-001 — TEL-026 Funil do crédito

**RF relacionado:** RF-MOD-F6-001, RF-MOD-F6-007  
**Etapa do fluxo:** ETP-033  
**Tela:** `TEL-026` · report da tabela `x_2326104_cob_segmentacao` (Carteira segmentada) · rota `/sys_report_template.do?jvar_report_id=1a1426065dd943ab896d646f7625bb90` · print `screens/TEL-026.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Funil do crédito» pelo menu «Cobrança MT» › Monitoramento, KPIs e Grupo de Controle. Registro de exemplo: report: seed fictício por estágio do funil.

**Requisito de experiência:** O relatório agrupa os registros da tabela por `estagio_funil` e mostra a contagem de cada grupo.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| estagio_funil | Estágio do funil | select | Não | única | `identificado` — Identificado; `notificado` — Notificado; `regularizado` — Regularizado | `domainTable:x_2326104_cob_segmentacao.estagio_funil` | — | — | — | — | RF-MOD-F6-001, RF-MOD-F6-007 |

**Grid / listagem**

- Colunas exibidas (em ordem): estagio_funil, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-013

---

### PR-MOD-F6-002 — TEL-027 Regularizações por tributo

**RF relacionado:** RF-MOD-F6-002, RF-MOD-F6-005, RF-MOD-F6-007  
**Etapa do fluxo:** ETP-034  
**Tela:** `TEL-027` · report da tabela `x_2326104_cob_regularizacao` (Regularização) · rota `/sys_report_template.do?jvar_report_id=95113251015f4d14bc9811a61ca6b516` · print `screens/TEL-027.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Regularizações por tributo» pelo menu «Cobrança MT» › Monitoramento, KPIs e Grupo de Controle. Registro de exemplo: report: seed fictício por tributo.

**Requisito de experiência:** O relatório agrupa os registros da tabela por `tributo` e mostra a contagem de cada grupo.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| tributo | Tributo | select | Não | única | `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_regularizacao.tributo` | — | — | — | — | RF-MOD-F6-002, RF-MOD-F6-005, RF-MOD-F6-007 |

**Grid / listagem**

- Colunas exibidas (em ordem): tributo, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-013

---

### PR-MOD-F6-003 — TEL-028 Regularizações por origem e canal

**RF relacionado:** RF-MOD-F6-003, RF-MOD-F6-007  
**Etapa do fluxo:** ETP-035  
**Tela:** `TEL-028` · report da tabela `x_2326104_cob_regularizacao` (Regularização) · rota `/sys_report_template.do?jvar_report_id=49853964652145c68ac2fa5593df1070` · print `screens/TEL-028.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Regularizações por origem e canal» pelo menu «Cobrança MT» › Monitoramento, KPIs e Grupo de Controle. Registro de exemplo: report: seed fictício por origem.

**Requisito de experiência:** O relatório agrupa os registros da tabela por `origem` e mostra a contagem de cada grupo.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| origem | Origem | select | Sim | única | `espontanea` — Espontânea; `resposta_cobranca` — Resposta à cobrança | `domainTable:x_2326104_cob_regularizacao.origem` | — | — | — | vazio → "Origem é obrigatório" | RF-MOD-F6-003, RF-MOD-F6-007 |

**Grid / listagem**

- Colunas exibidas (em ordem): origem, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-013

---

### PR-MOD-F6-004 — TEL-029 Efeito incremental por ciclo

**RF relacionado:** RF-MOD-F6-004  
**Etapa do fluxo:** ETP-036  
**Tela:** `TEL-029` · list da tabela `x_2326104_cob_ciclo` (Ciclo de qualificação) · rota `/x_2326104_cob_ciclo_list.do` · print `screens/TEL-029.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Efeito incremental por ciclo» pelo menu «Cobrança MT» › Monitoramento, KPIs e Grupo de Controle. Registro de exemplo: lista: 3 ciclos do seed.

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| nome | Nome | text | Sim | — | — | — | — | — | até 60 caracteres | vazio → "Nome é obrigatório" | RF-MOD-F6-004 |
| referencia | Mês de referência | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F6-004 |
| qtd_qualificada | Qualificada | number | Não | — | — | — | — | — | — | — | RF-MOD-F6-004 |
| qtd_controle | Grupo de controle | number | Não | — | — | — | — | — | — | — | RF-MOD-F6-004 |
| taxa_cobrada | Taxa da carteira cobrada (%) | number | Não | — | — | — | — | — | — | — | RF-MOD-F6-004 |
| taxa_controle | Taxa do grupo de controle (%) | number | Não | — | — | — | — | — | — | — | RF-MOD-F6-004 |
| efeito_incremental | Efeito incremental (p.p.) | number | Não | — | — | — | — | — | — | — | RF-MOD-F6-004 |

**Grid / listagem**

- Colunas exibidas (em ordem): nome, referencia, qtd_qualificada, qtd_controle, taxa_cobrada, taxa_controle, efeito_incremental
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-013

---

### PR-MOD-F6-005 — TEL-030 Metas de KPI

**RF relacionado:** RF-MOD-F6-002, RF-MOD-F6-005  
**Etapa do fluxo:** ETP-032  
**Tela:** `TEL-030` · list da tabela `x_2326104_cob_meta` (Meta de KPI) · rota `/x_2326104_cob_meta_list.do` · print `screens/TEL-030.png`

**Personas:** Coordenador de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Coordenador de Cobrança abre «Metas de KPI» pelo menu «Cobrança MT» › Monitoramento, KPIs e Grupo de Controle. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| indicador | Indicador | select | Sim | única | `taxa_regularizacao` — Taxa de regularização; `valor_recuperado` — Valor recuperado; `tempo_medio` — Tempo médio até regularizar | `domainTable:x_2326104_cob_meta.indicador` | — | — | — | vazio → "Indicador é obrigatório" | RF-MOD-F6-002, RF-MOD-F6-005 |
| tributo | Tributo | select | Não | única | `todos` — Todos; `icms_normal` — ICMS Normal; `icms_st` — ICMS ST; `ipva` — IPVA; `itcd` — ITCD | `domainTable:x_2326104_cob_meta.tributo` | — | — | — | — | RF-MOD-F6-002, RF-MOD-F6-005 |
| canal | Canal | select | Não | única | `todos` — Todos; `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp; `atendimento` — Atendimento | `domainTable:x_2326104_cob_meta.canal` | — | — | — | — | RF-MOD-F6-002, RF-MOD-F6-005 |
| periodo | Período | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F6-002, RF-MOD-F6-005 |
| valor_meta | Valor da meta | number | Sim | — | — | — | — | — | — | vazio → "Valor da meta é obrigatório" | RF-MOD-F6-002, RF-MOD-F6-005 |

**Grid / listagem**

- Colunas exibidas (em ordem): indicador, tributo, canal, periodo, valor_meta
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-019

---

### PR-MOD-F6-006 — TEL-031 Meus indicadores

**RF relacionado:** RF-MOD-F6-006  
**Etapa do fluxo:** ETP-037  
**Tela:** `TEL-031` · report da tabela `x_2326104_cob_regularizacao` (Regularização) · rota `/sys_report_template.do?jvar_report_id=f40880cae4d8479b8758361ce063a033` · print `screens/TEL-031.png`

**Personas:** Atendente de Cobrança  
**Prioridade:** Should  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Atendente de Cobrança abre «Meus indicadores» pelo menu «Cobrança MT» › Monitoramento, KPIs e Grupo de Controle. Registro de exemplo: report: regularizações do atendente demo por canal.

**Requisito de experiência:** O relatório agrupa os registros da tabela por `canal` e mostra a contagem de cada grupo.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- Só aparecem registros da carteira do atendente logado (RNF-SEGURANCA-002).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: gráfico ou tabela agrupada
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum dado para exibir»
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| canal | Canal | select | Não | única | `email` — E-mail; `sms` — SMS; `sne` — SNE; `whatsapp` — WhatsApp; `atendimento` — Atendimento; `nenhum` — Nenhum | `domainTable:x_2326104_cob_regularizacao.canal` | — | — | — | — | RF-MOD-F6-006 |

**Grid / listagem**

- Colunas exibidas (em ordem): canal, contagem
- Ordenação default: maior contagem primeiro
- Paginação: não se aplica
- Ações por linha: abrir a lista filtrada pelo grupo
- Mensagem de lista vazia: «Nenhum dado para exibir»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no filtro do relatório
- Combinação entre filtros: AND
- Limpar todos de uma vez: sim
- Persistência do filtro: definição do relatório
- Dependências entre filtros: nenhuma

**Gap associado:** GAP-013

---

## Módulo: Transversais (`MOD-T`)

### PR-MOD-T-001 — TEL-033 Trilha de exportação

**RF relacionado:** RF-MOD-T-001  
**Etapa do fluxo:** ETP-039  
**Tela:** `TEL-033` · list da tabela `x_2326104_cob_exportacao` (Exportação) · rota `/x_2326104_cob_exportacao_list.do` · print `screens/TEL-033.png`

**Personas:** Administrador do app  
**Prioridade:** Must  
**Origem:** `Protótipo` (tela instalada na instância no Explore)

**Contexto de uso:** Administrador do app abre «Trilha de exportação» pelo menu «Cobrança MT» › Transversais. Registro de exemplo: lista: seed fictício (50).

**Requisito de experiência:** A lista mostra as colunas do inventário, com filtro padrão da plataforma por qualquer coluna, ordenação por coluna e paginação de 20 linhas.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).

**Antipadrão (o que evitar):**
- Layout próprio fora da Core UI.
- Mostrar registro ou total de outro atendente.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta e filtro)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» na lista
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| usuario | Usuário | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-T-001 |
| tabela | Tabela | text | Não | — | — | — | — | — | até 80 caracteres | — | RF-MOD-T-001 |
| formato | Formato | select | Não | única | `csv` — CSV; `pdf` — PDF | `domainTable:x_2326104_cob_exportacao.formato` | — | — | — | — | RF-MOD-T-001 |
| filtro | Filtro aplicado | text | Não | — | — | — | — | — | até 1000 caracteres | — | RF-MOD-T-001 |
| registros | Registros | number | Não | — | — | — | — | — | — | — | RF-MOD-T-001 |
| exportado_em | Exportado em | datetime | Não | — | — | — | DD/MM/AAAA HH:mm | — | — | — | RF-MOD-T-001 |

**Grid / listagem**

- Colunas exibidas (em ordem): usuario, tabela, formato, filtro, registros, exportado_em
- Ordenação default: data de criação, mais recente primeiro
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o registro
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: ao acionar «Executar» no construtor de filtro
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

## Módulo: Lista ativa do atendente (`MOD-UX-LISTA`)

### PR-MOD-UX-001 — TEL-034 Minha lista

**RF relacionado:** RF-MOD-F5-005, RF-MOD-F5-007
**Etapa do fluxo:** ETP-041
**Tela:** `TEL-034` · list da tabela `x_2326104_cob_contato` (Contato da lista) · rota `/x_2326104_cob_contato_list.do` · print `screens/TEL-034.png`

**Personas:** Atendente de Cobrança
**Prioridade:** Must
**Origem:** design UX v1 (CUJ-A), tela instalada na instância na F2

**Contexto de uso:** Atendente de Cobrança entra direto em «Minha lista» (home do papel). Registro de exemplo: lista: contatos do atendente demo com próxima ação até hoje.

**Requisito de experiência:** A lista mostra só os contatos do atendente logado que não estão encerrados e cuja próxima ação é hoje ou antes (ou está vazia), ordenados pela próxima ação e, dentro do dia, pela maior prioridade. Telefone, valor e status aparecem sem abrir o contato.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- Só aparecem contatos do atendente logado (RNF-SEGURANCA-002).
- Do login ao contato aberto: 1 clique; até a ligação registrada: 5 cliques (`outputs/spec/screens/ux-v1/acoes.json`).

**Antipadrão (o que evitar):**
- Mostrar contato de outro atendente ou contato encerrado.
- Ordenar por data de criação.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma
- Sucesso: linhas da lista
- Erro de validação: não se aplica (tela só de consulta)
- Erro de sistema: mensagem de erro da plataforma no topo
- Vazio: «Nenhum registro» (nenhuma ligação para hoje)
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F5-005, RF-MOD-F5-007 |
| contribuinte.telefone | Contribuinte › Telefone | text | Não | — | — | — | — | — | até 20 caracteres | — | RF-MOD-F5-005, RF-MOD-F5-007 |
| valor_em_aberto | Valor em aberto (R$) | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F5-005, RF-MOD-F5-007 |
| status | Status | select | Não | única | `a_ligar` — A ligar; `ligado` — Ligado; `retornar` — Retornar; `encerrado` — Encerrado | `domainTable:x_2326104_cob_contato.status` | — | — | — | — | RF-MOD-F5-005, RF-MOD-F5-007 |
| proxima_acao_em | Próxima ação em | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F5-005, RF-MOD-F5-007 |
| prioridade | Prioridade | number | Não | — | — | — | — | — | — | — | RF-MOD-F5-005, RF-MOD-F5-007 |

**Grid / listagem**

- Colunas exibidas (em ordem): contribuinte, contribuinte.telefone, valor_em_aberto, status, proxima_acao_em, prioridade
- Filtro do módulo: `atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()`
- Ordenação default: próxima ação, depois maior prioridade
- Paginação: 20 linhas por página (padrão da plataforma)
- Ações por linha: abrir o contato (TEL-035)
- Mensagem de lista vazia: «Nenhum registro»

**Comportamento dos filtros**

- Aplica: filtro fixo do módulo; o construtor de filtro da plataforma refina
- Combinação entre filtros: AND (OR disponível no construtor)
- Limpar todos de uma vez: sim (volta ao filtro do módulo pelo menu)
- Persistência do filtro: querystring (`sysparm_query`)
- Dependências entre filtros: nenhuma

**Gap associado:** —

---

### PR-MOD-UX-002 — TEL-035 Contato da lista

**RF relacionado:** RF-MOD-F5-005
**Etapa do fluxo:** ETP-042, ETP-043
**Tela:** `TEL-035` · form da tabela `x_2326104_cob_contato` (Contato da lista) · rota `/x_2326104_cob_contato.do?sys_id=8ca2d0136d084cabb0b53bd4748fc574` · print `screens/TEL-035.png`

**Personas:** Atendente de Cobrança
**Prioridade:** Must
**Origem:** design UX v1 (CUJ-A), tela instalada na instância na F2

**Contexto de uso:** Atendente de Cobrança abre o contato em «Minha lista» (TEL-034). Registro de exemplo: TEL-035_registro_demo: contato de demo.atendente em «Retornar», com 1 tentativa e retorno para hoje.

**Requisito de experiência:** A trilha de etapas (a ligar → ligado → retornar → encerrado) fica no topo. O atendente escolhe «Resultado desta ligação» (o campo abre sempre vazio), escreve a anotação em «Comentários», informa a próxima ação se combinou retorno e clica em «Registrar ligação». O sistema cria a interação, soma 1 em tentativas e decide o status pela tabela de decisão; o resultado vai para «Último resultado», que só o botão grava (GAP-150). «Encerrar» tira o contato da lista e exige o motivo. Status, tentativas e último resultado não são editáveis à mão pelo atendente.

**Critérios mensuráveis:**
- A tela abre em até 3 segundos com até 300 registros por tabela (RNF-DESEMPENHO-001).
- Todos os rótulos em português (RNF-USABILIDADE-001).
- Só o atendente dono do contato, o coordenador e o admin registram ligação (RNF-SEGURANCA-002).
- Da abertura do contato à ligação registrada: 4 cliques mais a digitação da anotação (`outputs/spec/screens/ux-v1/acoes.json`).

**Antipadrão (o que evitar):**
- Reaproveitar o resultado da ligação anterior sem o atendente escolher de novo.
- Encerrar sem motivo.

**Mapa de estados:**
- Carregando: indicador padrão da plataforma enquanto o registro abre
- Sucesso: mensagem no topo, por exemplo «Ligação registrada. Status: Ligado; próxima ação em 01/12/2026.»
- Erro de validação: campo do botão vazio fica marcado e o topo mostra a mensagem do inventário
- Erro de sistema: o topo mostra «A ligação não foi registrada. Confira a mensagem acima e tente de novo.» e nada é gravado pela metade
- Vazio: não se aplica (form sempre abre um registro)
- Offline: não se aplica (a plataforma exige conexão)

**Inventário de campos**

| Campo | Rótulo | Tipo | Obrig. | Seleção | Opções (valor — rótulo) | Origem das opções | Máscara/Formato | Default | Limites | Validação → mensagem | RF/PR |
|-------|--------|------|--------|---------|--------------------------|-------------------|-----------------|---------|---------|----------------------|-------|
| contribuinte | Contribuinte | lookup | Sim | única | *(dinâmica)* | `domainTable:x_2326104_cob_contribuinte` | — | — | — | vazio → "Contribuinte é obrigatório" | RF-MOD-F5-005 |
| atendente | Atendente | lookup | Não | única | *(dinâmica)* | `domainTable:sys_user` | — | — | — | — | RF-MOD-F5-005 |
| ciclo | Ciclo | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_ciclo` | — | — | — | — | RF-MOD-F5-005 |
| status | Status | select | Não | única | `a_ligar` — A ligar; `ligado` — Ligado; `retornar` — Retornar; `encerrado` — Encerrado | `domainTable:x_2326104_cob_contato.status` | — | — | — | só os botões mudam (atendente não edita) | RF-MOD-F5-005 |
| proxima_acao_em | Próxima ação em | date | Não | — | — | — | DD/MM/AAAA | — | — | — | RF-MOD-F5-005 |
| ultimo_resultado | Último resultado | select | Não | única | `contato_efetivo` — Contato efetivo; `sem_contato` — Sem contato; `promessa_pagamento` — Promessa de pagamento; `recusa` — Recusa | `domainTable:x_2326104_cob_contato.ultimo_resultado` | — | — | — | só o botão «Registrar ligação» grava (atendente não edita) | RF-MOD-F5-005 |
| tentativas | Tentativas | number | Não | — | — | — | — | — | — | só o botão «Registrar ligação» soma (atendente não edita) | RF-MOD-F5-005 |
| prioridade | Prioridade | number | Não | — | — | — | — | — | — | — | RF-MOD-F5-005 |
| valor_em_aberto | Valor em aberto (R$) | currency | Não | — | — | — | R$ 0,00 | — | — | — | RF-MOD-F5-005 |
| motivo_encerramento | Motivo de encerramento | select | Não | única | `regularizado` — Regularizado; `contato_realizado` — Contato realizado; `sem_contato` — Sem contato; `recusa` — Recusa; `outro` — Outro | `domainTable:x_2326104_cob_contato.motivo_encerramento` | — | — | — | vazio ao encerrar → "Operação recusada: informe o motivo de encerramento." | RF-MOD-F5-005 |
| resultado_ligacao | Resultado desta ligação | select | Não | única | `contato_efetivo` — Contato efetivo; `sem_contato` — Sem contato; `promessa_pagamento` — Promessa de pagamento; `recusa` — Recusa | `domainTable:x_2326104_cob_contato.resultado_ligacao` | — | — | — | vazio ao registrar → "Operação recusada: informe o resultado da ligação." | RF-MOD-F5-005 |
| origem | Origem | select | Não | única | `distribuicao` — Distribuição do ciclo; `regua` — Régua (encaminhada à cobrança ativa) | `domainTable:x_2326104_cob_contato.origem` | — | — | — | só leitura para atendente e coordenador; gravada na criação | RF-MOD-F4-009 |
| inscricao | Inscrição na régua | lookup | Não | única | *(dinâmica)* | `domainTable:x_2326104_cob_regua_inscricao` | — | — | — | — | RF-MOD-F4-009 |
| comentarios | Comentários | textarea | Não | — | — | — | — | — | — | vazio ao registrar → "Operação recusada: informe a anotação da ligação." | RF-MOD-F5-005 |

**Tabela de decisão de «Registrar ligação»**

| Resultado desta ligação | Retorno informado? | Tentativas após somar 1 | Novo status | Próxima ação em | Motivo |
|---|---|---|---|---|---|
| Promessa de pagamento | — | — | Ligado | retorno informado ou hoje + 7 | — |
| Contato efetivo | sim | — | Retornar | retorno | — |
| Contato efetivo | não | — | Encerrado | vazio | Contato realizado |
| Sem contato | — | < 3 | Retornar | amanhã | — |
| Sem contato | — | ≥ 3 | Encerrado | vazio | Sem contato |
| Recusa | — | — | Encerrado | vazio | Recusa |

**Grid / listagem** — (form; a lista relacionada «Interações» segue o padrão de lista da plataforma)

**Comportamento dos filtros** — (form sem filtro)

**Gap associado:** GAP-150 (fechado)

---

<!-- id: pr-ttfv -->

## Time to First Value (TTFV) por jornada

```
TTFV alvo: 2 minutos para o Atendente registrar a primeira ligação do dia
Passos máximos: 5 cliques entre login e a ligação registrada (home «Minha lista» › contato › Resultado desta ligação › Comentários › Registrar ligação)
Pré-requisitos visíveis ao usuário: lista do ciclo distribuída para o atendente

TTFV alvo: 1 minuto para o Coordenador avançar um caso qualificado
Passos máximos: 2 cliques (home «Casos qualificados» › caso › Avançar etapa)
Pré-requisitos visíveis ao usuário: casos qualificados de que é responsável

TTFV alvo: 5 minutos para o Coordenador publicar uma nova versão de critério
Passos máximos: 4 passos (menu › Critérios › Criar nova versão › Publicar versão)
Pré-requisitos visíveis ao usuário: versão anterior publicada
```

---

<!-- id: pr-language -->

## Linguagem e tom

```
Idioma principal: Português do Brasil
Tom: Profissional
Pessoa do discurso: impessoal

Glossário da interface:
  segmento controle → «Grupo de controle»
  sem_score → «Sem score»
  resposta_cobranca → «Resposta à cobrança»
  versao_anterior → «Versão anterior»

Termos proibidos na UI: nomes técnicos de tabela ou coluna; dado real de contribuinte
```

---

<!-- id: pr-accessibility -->

## Acessibilidade WCAG 2.2

A Core UI clássica entrega os componentes; o app não cria componente visual próprio.

| Nível | Requisito | Como verificar |
|-------|-----------|----------------|
| A | Imagens com alt text | inspeção dos ícones da plataforma |
| A | Navegação por teclado em todos os fluxos | teste manual nas 35 telas |
| AA | Contraste mínimo 4.5:1 | tema padrão da instância |
| AA | Labels em campos de formulário | inventário de campos com rótulo em 100% das linhas |
| AA | Foco não encoberto por header/modal | teste manual |
| AA | Alvo interativo ≥ 24x24px | componentes padrão da plataforma |

---

<!-- id: pr-journeys -->

## Jornadas por persona

### Jornada: publicar nova versão de critério — persona Coordenador de Cobrança

**Espinha padronizada (5 passos):**

| Passo | Descrição | Estado(s) de UI envolvido(s) |
|-------|-----------|------------------------------|
| 1. Entrada | menu Cobrança MT › Critérios de qualificação (TEL-007) | Carregando, Sucesso |
| 2. Ação principal | abre a versão publicada (TEL-008) e clica em «Criar nova versão»; edita o rascunho | Sucesso |
| 3. Confirmação | clica em «Publicar versão»; a versão fica somente leitura com data e autor | Sucesso |
| 4. Erro / recuperação | tenta alterar versão publicada → mensagem «Versão publicada não pode ser alterada. Crie uma nova versão.» | Erro de validação |
| 5. Saída / próximo | gera a prévia do ciclo (TEL-009) | Carregando |

| # | Heurística | Atende? (✅/⚠️/❌) | Evidência / nota |
|---|-----------|--------------------|------------------|
| 1 | Visibilidade do estado do sistema | ✅ | campo Estado e Publicada em |
| 2 | Correspondência sistema ↔ mundo real | ✅ | termos do plano (versão, critério) |
| 3 | Controle e liberdade do usuário | ✅ | rascunho editável até publicar |
| 4 | Consistência e padrões | ✅ | form padrão da plataforma |
| 5 | Prevenção de erros | ✅ | campos somente leitura após publicar |
| 6 | Reconhecimento em vez de memorização | ✅ | lista de versões posteriores no form |
| 7 | Flexibilidade e eficiência de uso | ⚠️ | sem atalho de cópia em lote |
| 8 | Estética e design minimalista | ✅ | seções curtas |
| 9 | Ajudar a reconhecer, diagnosticar e recuperar de erros | ✅ | mensagem diz o que fazer |
| 10 | Ajuda e documentação | ⚠️ | ajuda padrão da plataforma |

### Jornada: trabalhar a lista do dia — persona Atendente de Cobrança

**Espinha padronizada (5 passos):**

| Passo | Descrição | Estado(s) de UI envolvido(s) |
|-------|-----------|------------------------------|
| 1. Entrada | login cai em «Minha lista» (TEL-034), já filtrada e ordenada | Carregando, Sucesso, Vazio |
| 2. Ação principal | abre o contato (TEL-035), escolhe «Resultado desta ligação» e escreve a anotação | Sucesso |
| 3. Confirmação | clica em «Registrar ligação»; a mensagem diz o novo status e a próxima ação; a interação entra no histórico | Sucesso |
| 4. Erro / recuperação | registra sem escolher o resultado → «Operação recusada: informe o resultado da ligação.» | Erro de validação |
| 5. Saída / próximo | o contato sai da lista do dia (retorno futuro ou encerrado); volta a «Minha lista» | Sucesso |

| # | Heurística | Atende? (✅/⚠️/❌) | Evidência / nota |
|---|-----------|--------------------|------------------|
| 1 | Visibilidade do estado do sistema | ✅ | trilha de etapas e mensagem com o novo status |
| 2 | Correspondência sistema ↔ mundo real | ✅ | resultado, retorno e anotação, como numa ligação |
| 3 | Controle e liberdade do usuário | ✅ | «Encerrar» com motivo a qualquer momento |
| 4 | Consistência e padrões | ✅ | form e lista padrão |
| 5 | Prevenção de erros | ✅ | resultado escolhido na hora, sem reaproveitar o anterior (GAP-150) |
| 6 | Reconhecimento em vez de memorização | ✅ | «Último resultado» e histórico no form |
| 7 | Flexibilidade e eficiência de uso | ✅ | 5 cliques do login à ligação registrada |
| 8 | Estética e design minimalista | ✅ | 6 colunas na lista |
| 9 | Ajudar a reconhecer, diagnosticar e recuperar de erros | ✅ | mensagens dizem o que falta |
| 10 | Ajuda e documentação | ⚠️ | dica do botão e ajuda padrão da plataforma |

### Jornada: conduzir um caso qualificado — persona Coordenador de Cobrança

**Espinha padronizada (5 passos):**

| Passo | Descrição | Estado(s) de UI envolvido(s) |
|-------|-----------|------------------------------|
| 1. Entrada | login cai em «Casos qualificados» (TEL-023), na sequência das etapas | Carregando, Sucesso, Vazio |
| 2. Ação principal | abre o caso (TEL-024) e consulta débitos, comunicações, score, sinalizações e interações | Sucesso |
| 3. Confirmação | clica em «Avançar etapa»; a trilha anda uma etapa e a mensagem confirma | Sucesso |
| 4. Erro / recuperação | «Encerrar caso» sem motivo → «Operação recusada: informe o motivo de encerramento.» | Erro de validação |
| 5. Saída / próximo | encerra com motivo; o caso sai da lista | Sucesso |

| # | Heurística | Atende? (✅/⚠️/❌) | Evidência / nota |
|---|-----------|--------------------|------------------|
| 1 | Visibilidade do estado do sistema | ✅ | trilha de etapas no topo |
| 2 | Correspondência sistema ↔ mundo real | ✅ | dossiê nos 3 níveis do plano |
| 3 | Controle e liberdade do usuário | ✅ | volta à lista a qualquer momento |
| 4 | Consistência e padrões | ✅ | form e listas padrão |
| 5 | Prevenção de erros | ✅ | estágio só pelos botões, uma etapa por vez (GAP-152) |
| 6 | Reconhecimento em vez de memorização | ✅ | listas relacionadas no caso |
| 7 | Flexibilidade e eficiência de uso | ✅ | 2 cliques da home ao caso avançado |
| 8 | Estética e design minimalista | ⚠️ | dossiê longo em form (GAP-012) |
| 9 | Ajudar a reconhecer, diagnosticar e recuperar de erros | ✅ | mensagens dizem o que fazer |
| 10 | Ajuda e documentação | ⚠️ | ajuda padrão da plataforma |
