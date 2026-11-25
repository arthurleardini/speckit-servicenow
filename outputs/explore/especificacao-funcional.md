# Especificação Funcional — Cobrança MT (2.6 Cobrança, SEFAZ-MT)

> **Fase:** Explore · **Versão:** 0.1 · **Status:** cobertura completa, profundidade preliminar
> **Documentos irmãos:** [HLD](./hld-funcional.md) · [Técnica](./especificacao-tecnica.md) · [Modelo de Dados](./modelo-de-dados.md) · [GAPs](./gaps.md)
>
> Fonte: `inputs/plano-2.6-cobranca.md`. IDs do plano e do Plan: `inputs/de-para-ids.md`. Parâmetros em aberto: `inputs/premissas-ficticias.md`. Integrações simuladas: `inputs/simulacoes.md`. Toda tela é exibida com dados fictícios.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | 2026-11-24 | versão inicial: 46 RF, 17 RN, 33 telas na Core UI clássica |
| 0.2 | 2026-11-25 | reformulação de UX v1 (`docs/designs/ux-cobranca-v1.md`, v1.1): lista ativa do atendente (TEL-034 «Minha lista», TEL-035 «Contato da lista»); caso qualificado passa ao coordenador (TEL-023 «Casos qualificados», TEL-024, TEL-025); verbos «Registrar ligação», «Encerrar», «Distribuir lista», «Avançar etapa» e «Encerrar caso»; atendente sem acesso ao caso; menu por área de trabalho e home por papel |

## 1. Personas e perfis de acesso

### 1.1 Personas
| Persona | Perfil (role ServiceNow) | Papel no processo |
|---|---|---|
| Coordenador de Cobrança (CPRF) | `x_2326104_cob.coordenador` | Dono do produto. Parametriza e publica critérios, desenha réguas, acompanha integrações, publica o ciclo do mês e distribui a lista de ligações, conduz os casos qualificados (é o responsável pelo caso) e acompanha KPIs, metas e efeito incremental. Entra direto em «Casos qualificados» |
| Atendente de Cobrança | `x_2326104_cob.atendente` | Usuário-chave. Trabalha a própria lista de ligações da cobrança ativa («Minha lista»): registra cada ligação e encerra o contato resolvido; consulta a visão única dos contribuintes da própria carteira e vê os próprios indicadores. Não tem acesso ao caso qualificado. Entra direto em «Minha lista» |
| Administrador do app | `x_2326104_cob.admin` | Mantém o app: tabelas simuladas (SIM-01 a SIM-03), interruptores de falha, trilha de exportação e usuários demo. Herda as permissões do coordenador |

### 1.2 Matriz de acesso

| Ação | `x_2326104_cob.coordenador` | `x_2326104_cob.atendente` | `x_2326104_cob.admin` |
|---|:---:|:---:|:---:|
| Ver status de integrações e log de rejeições (TEL-001, TEL-002) | ✅ | — | ✅ |
| Ver carteira consolidada e lista de contribuintes (TEL-003, TEL-032) | ✅ | — | ✅ |
| Ver visão única do contribuinte (TEL-004) | ✅ | ✅ só contribuintes da própria carteira | ✅ |
| Ver parcelamentos em risco (TEL-005) | ✅ | — | ✅ |
| Criar e editar critério em rascunho (TEL-008) | ✅ | — | ✅ |
| Publicar versão de critério (TEL-008) | ✅ | — | — |
| Publicar o ciclo do mês e distribuir a lista de ligações (TEL-009: «Publicar ciclo», «Distribuir lista») | ✅ | — | — |
| Ver carteira segmentada e grupo de controle (TEL-010) | ✅ | — | ✅ |
| Ver painel e lista de score (TEL-011, TEL-012) | ✅ | — | ✅ |
| Criar e editar régua e etapas (TEL-013, TEL-014) | ✅ | — | ✅ |
| Ver execução, efetividade e consentimentos (TEL-015 a TEL-017) | ✅ | — | ✅ |
| Reenviar comunicação com falha (TEL-015) | ✅ | — | ✅ |
| Operar tabelas simuladas e interruptores de falha (TEL-006, TEL-018, TEL-019) | — | — | ✅ |
| Ver regularizações (TEL-020) | ✅ | ✅ só as da própria carteira | ✅ |
| Ver a própria lista de ligações (TEL-034 «Minha lista») | ✅ todos os contatos | ✅ só os próprios contatos | ✅ |
| Registrar ligação e encerrar contato (TEL-035: «Registrar ligação», «Encerrar») | ✅ | ✅ só no próprio contato | ✅ |
| Distribuir e redistribuir casos qualificados (TEL-021) | ✅ | — | — |
| Ver carga por responsável (TEL-022) | ✅ | — | ✅ |
| Ver casos qualificados (TEL-023 «Casos qualificados») | ✅ só os casos de que é responsável | — sem acesso ao caso | ✅ |
| Ver dossiê do caso (TEL-024) | ✅ só os casos de que é responsável | — sem acesso ao caso | ✅ |
| Avançar etapa e encerrar caso com motivo (TEL-024: «Avançar etapa», «Encerrar caso») | ✅ só os casos de que é responsável | — | ✅ |
| Registrar interação no caso (TEL-025) | ✅ só no caso de que é responsável | — sem acesso ao caso | ✅ |
| Ver painel institucional, KPIs e efeito incremental (TEL-026 a TEL-029) | ✅ | — | ✅ |
| Cadastrar metas (TEL-030) | ✅ | — | ✅ |
| Ver os próprios indicadores (TEL-031) | — | ✅ | — |
| Exportar CSV/PDF (registra trilha) | ✅ | ✅ só dados da própria carteira | ✅ |
| Ver trilha de exportação (TEL-033) | — | — | ✅ |

"Própria carteira" = contatos da lista e contribuintes cujo `atendente` é o usuário logado, e os registros que referenciam esses (interação do contato, regularização, débito do contribuinte) (RN-011). O caso qualificado é do coordenador responsável (`caso.coordenador`, rótulo «Responsável»); quem só tem o papel de atendente não lê nem grava caso, nem a interação de caso (design UX v1, R6).

O estado do contato, do caso e do ciclo muda só pelos botões: no contato, «Registrar ligação» e «Encerrar» (status, tentativas e último resultado não são editáveis à mão pelo atendente); no caso, «Avançar etapa» (uma etapa por vez) e «Encerrar caso» (com motivo), regra que vale também para lista e API (GAP-152).

## 2. Navegação e telas

Core UI clássica (UI16). Menu do app "Cobrança MT" organizado por área de trabalho de cada papel (design UX v1): o atendente vê «Minha lista», «Meus contribuintes» e «Meus indicadores»; o coordenador vê «Casos qualificados», «Ciclo e carteira», «Réguas», «Analytics» e «Configurações»; as tabelas cruas ficam só em "Administração" (admin). Cada papel entra direto no próprio trabalho: atendente em «Minha lista» (TEL-034), coordenador em «Casos qualificados» (TEL-023). Cada tela é um form, uma list ou um report de uma tabela do app; o print de cada `TEL-` é tirado com o usuário demo do papel da tela, sobre o registro demo indicado.

| TEL | Título | Tabela ServiceNow | Tipo | Visão | Papel | Módulo | RF | Registro demo da tela |
|---|---|---|---|---|---|---|---|---|
| TEL-001 | Integrações e sincronização | `x_2326104_cob_sincronizacao` | list | default | coordenador | MOD-F1 | RF-101, RF-106, RF-107 | lista: seed fictício (50) |
| TEL-002 | Log de rejeições | `x_2326104_cob_rejeicao` | list | default | coordenador | MOD-F1 | RF-102 | lista: seed fictício (50) |
| TEL-003 | Carteira consolidada | `x_2326104_cob_debito` | list | default | coordenador | MOD-F1 | RF-101, RF-102, RF-103, RF-902 | lista: seed fictício (50) |
| TEL-004 | Visão única do contribuinte | `x_2326104_cob_contribuinte` | form | visao_unica | atendente | MOD-F1 | RF-105, RF-903 | TEL-004_registro_demo: contribuinte PJ fictício com débitos em CCF e SNE (sobreposição) |
| TEL-005 | Parcelamentos em risco | `x_2326104_cob_parcelamento` | list | default | coordenador | MOD-F1 | RF-104 | lista: seed fictício (50) |
| TEL-006 | Staging de fontes (Simulado) | `x_2326104_cob_debito_stg` | list | default | admin | MOD-F1 | RF-101, RF-102 | lista: seed fictício (50) |
| TEL-007 | Critérios de qualificação | `x_2326104_cob_criterio` | list | default | coordenador | MOD-F2 | RF-201, RF-202 | lista: seed fictício (50) |
| TEL-008 | Versão do critério de qualificação | `x_2326104_cob_criterio` | form | default | coordenador | MOD-F2 | RF-201, RF-202, RF-205 | TEL-008_registro_demo: critério ICMS, valor ≥ R$ 500 mil, atraso ≥ 90 dias, versão 2 publicada |
| TEL-009 | Ciclo do mês | `x_2326104_cob_ciclo` | form | default | coordenador | MOD-F2 | RF-203, RF-204, RF-206 | TEL-009_registro_demo: ciclo 2027-01 em prévia com 10% de grupo de controle |
| TEL-010 | Carteira segmentada | `x_2326104_cob_segmentacao` | list | default | coordenador | MOD-F2 | RF-203, RF-204, RF-205, RF-902 | lista: seed fictício (50) |
| TEL-011 | Painel do score de liquidez | `x_2326104_cob_score_sim` | report | default | coordenador | MOD-F3 | RF-306 | report: seed fictício por tributo e status |
| TEL-012 | Scores ingeridos (Simulado) | `x_2326104_cob_score_sim` | list | default | coordenador | MOD-F3 | RF-301, RF-302, RF-304, RF-305 | lista: seed fictício (50) |
| TEL-013 | Réguas de cobrança | `x_2326104_cob_regua` | list | default | coordenador | MOD-F4 | RF-401 | lista: seed fictício (50) |
| TEL-014 | Editor de régua | `x_2326104_cob_regua` | form | default | coordenador | MOD-F4 | RF-401, RF-403, RF-404, RF-409 | TEL-014_registro_demo: régua IPVA com 4 etapas (SNE, e-mail, SMS, encaminhar à qualificada) |
| TEL-015 | Execução e status de disparo | `x_2326104_cob_comunicacao` | list | default | coordenador | MOD-F4 | RF-402, RF-403, RF-406 | lista: seed fictício (50) |
| TEL-016 | Efetividade da régua | `x_2326104_cob_comunicacao` | report | default | coordenador | MOD-F4 | RF-408 | report: seed fictício por canal e status |
| TEL-017 | Consentimentos por canal | `x_2326104_cob_consentimento` | list | default | coordenador | MOD-F4 | RF-405 | lista: seed fictício (50) |
| TEL-018 | Canais de envio (Simulado) | `x_2326104_cob_canal_sim` | list | default | admin | MOD-F4 | RF-404, RF-405 | lista: 4 canais do seed |
| TEL-019 | Retorno de envio (Simulado) | `x_2326104_cob_envio_sim` | list | default | admin | MOD-F4 | RF-406 | lista: seed fictício (50) |
| TEL-020 | Regularizações | `x_2326104_cob_regularizacao` | list | default | coordenador | MOD-F4 | RF-407, RF-603, RF-904 | lista: seed fictício (50) |
| TEL-021 | Distribuição da carteira qualificada | `x_2326104_cob_caso` | list | default | coordenador | MOD-F5 | RF-501 | lista: seed fictício (50) |
| TEL-022 | Carga por responsável | `x_2326104_cob_caso` | report | default | coordenador | MOD-F5 | RF-501 | report: casos do seed por estágio |
| TEL-023 | Casos qualificados | `x_2326104_cob_caso` | list | x_2326104_cob_tel_023 | coordenador | MOD-F5 | RF-502, RF-507 | lista: 6 casos do coordenador demo, pela sequência das etapas |
| TEL-024 | Dossiê do caso | `x_2326104_cob_caso` | form | dossie | coordenador | MOD-F5 | RF-503, RF-504, RF-505, RF-506, RF-303 | TEL-024_registro_demo: caso fictício em condução, com sinalização coercitiva e 3 interações |
| TEL-025 | Registro de interação | `x_2326104_cob_interacao` | form | default | coordenador | MOD-F5 | RF-505 | TEL-025_registro_demo: interação "promessa de pagamento" do caso da TEL-024 |
| TEL-026 | Funil do crédito | `x_2326104_cob_segmentacao` | report | default | coordenador | MOD-F6 | RF-601, RF-607 | report: seed fictício por estágio do funil |
| TEL-027 | Regularizações por tributo | `x_2326104_cob_regularizacao` | report | default | coordenador | MOD-F6 | RF-602, RF-605, RF-607 | report: seed fictício por tributo |
| TEL-028 | Regularizações por origem e canal | `x_2326104_cob_regularizacao` | report | default | coordenador | MOD-F6 | RF-603, RF-607 | report: seed fictício por origem |
| TEL-029 | Efeito incremental por ciclo | `x_2326104_cob_ciclo` | list | efeito_incremental | coordenador | MOD-F6 | RF-604 | lista: 3 ciclos do seed |
| TEL-030 | Metas de KPI | `x_2326104_cob_meta` | list | default | coordenador | MOD-F6 | RF-602, RF-605 | lista: seed fictício (50) |
| TEL-031 | Meus indicadores | `x_2326104_cob_regularizacao` | report | default | atendente | MOD-F6 | RF-606 | report: regularizações do atendente demo por canal |
| TEL-032 | Contribuintes | `x_2326104_cob_contribuinte` | list | default | coordenador | MOD-F1 | RF-902, RF-903 | lista: seed fictício (50) |
| TEL-033 | Trilha de exportação | `x_2326104_cob_exportacao` | list | default | admin | MOD-T | RF-901 | lista: seed fictício (50) |
| TEL-034 | Minha lista | `x_2326104_cob_contato` | list | default | atendente | MOD-UX-LISTA | RF-505, RF-507 | lista: contatos do atendente demo com próxima ação até hoje, por próxima ação e prioridade |
| TEL-035 | Contato da lista | `x_2326104_cob_contato` | form | default | atendente | MOD-UX-LISTA | RF-505 | TEL-035_registro_demo: contato de demo.atendente em «Retornar», com 1 tentativa e retorno para hoje |

**Related lists e seções dos forms**

| TEL | Seções | Related lists | UI Actions |
|---|---|---|---|
| TEL-004 | Identificação · Carteira · Activity | Débitos, Parcelamentos, Comunicações, Consentimentos, Regularizações (por `contribuinte`) | Exportar |
| TEL-008 | Critério · Score e grupo de controle · Publicação · Activity | Versões posteriores (`versao_anterior`), Ciclos que aplicaram a versão | Publicar versão · Criar nova versão |
| TEL-009 | Trilha de etapas (prévia → publicado → distribuído → encerrado) · Ciclo · Totais · Efeito incremental · Activity | Carteira segmentada (`ciclo`) | Publicar ciclo · Distribuir lista |
| TEL-014 | Régua · Activity | Etapas (`regua`), Comunicações (`regua`) | Ativar · Desativar |
| TEL-024 | Trilha de etapas (em seleção → selecionado → dossiê → condução → encerrado) · Caso · Score · Sinalizações · Encerramento · Activity | Débitos, Parcelamentos, Comunicações (relacionamento pelo `contribuinte` do caso), Interações (`caso`), Regularizações (`caso`) | Avançar etapa · Encerrar caso (motivo obrigatório) |
| TEL-025 | Interação · Activity | — | — |
| TEL-035 | Trilha de etapas (a ligar → ligado → retornar → encerrado) · Contato da lista (com «Resultado desta ligação», que abre vazio) · Activity | Interações (`contato`) | Registrar ligação · Encerrar (motivo obrigatório) |

O dossiê consolidado (TEL-024) e o painel de KPIs (TEL-026 a TEL-031) são entregues como form com related lists e reports simples da Core UI; a diferença para a tela única pedida no plano está em GAP-012 e GAP-013.

## 3. Funcionalidades e regras de negócio, por módulo

### MOD-F1 — Ingestão e Carteira Consolidada

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-101 | Consolidação periódica multifonte | Consolida automaticamente, a cada ciclo, os débitos de CCF, MPI/Big Data, IPVA, ITCD e SNE, com a origem registrada em cada débito |
| RF-102 | Vínculo ao contribuinte e sobreposição | Vincula cada débito ao contribuinte por CPF/CNPJ e resolve a sobreposição entre fontes; documento inválido vai para o log de rejeições |
| RF-103 | Atualização intraciclo | Atualiza o status de regularização e de parcelamento dentro do ciclo e encerra a abordagem de quem regularizou |
| RF-104 | Alerta de parcelamento em risco | Monitora parcelamentos e alerta inadimplência parcial (risco de rompimento) |
| RF-105 | Visão única do contribuinte | Exibe em tela única débitos, parcelamentos, comunicações e histórico do contribuinte |
| RF-106 | Transição MPI → Big Data | Troca a fonte MPI pela Big Data sem ruptura da carteira |
| RF-107 | Status das integrações | Expõe por fonte a última sincronização, o volume e os erros; falha numa fonte não trava as demais |

**Regras de negócio**

| ID | Regra | Afeta |
|---|---|---|
| RN-001 | Débitos de fontes distintas do mesmo contribuinte formam uma única visão; a duplicidade é resolvida por sobreposição (regra em GAP-006) | RF-101, RF-102, RF-105, RF-503, RF-903 |
| RN-002 | O status de regularização/parcelamento é atualizado intraciclo; ao regularizar, o contribuinte deixa de ser abordado | RF-103, RF-104, RF-403, RF-506, RF-601 |
| RN-012 | A transição do MPI para o Big Data preserva a operação, sem ruptura da carteira | RF-101, RF-106 |
| RN-014 | CPF/CNPJ inválido é rejeitado, não é gravado e consta no log de rejeições | RF-102 |

### MOD-F2 — Qualificação e Parametrização da Carteira

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-201 | Parametrização de critérios | Configura critérios por valor mínimo, tributo, tempo de atraso, instrumento e exclusões |
| RF-202 | Versionamento imutável | Cada conjunto de critérios publicado vira versão imutável; editar cria nova versão, e a carteira guarda a versão aplicada |
| RF-203 | Segmentação massificada × qualificada | Segmenta a base automaticamente entre carteira massificada e qualificada por valor, risco e histórico, com desempate definido (GAP-002) |
| RF-204 | Sorteio do grupo de controle | Sorteia, a cada ciclo, o grupo de controle entre os elegíveis e o exclui das ações de cobrança |
| RF-205 | Score como critério | Usa o score de liquidez como critério/threshold quando disponível; sem score, opera só com critérios determinísticos e marca o contribuinte "sem score" |
| RF-206 | Prévia da carteira | Gera a prévia da carteira segmentada antes de publicar o ciclo |

**Regras de negócio**

| ID | Regra | Afeta |
|---|---|---|
| RN-003 | Critérios de qualificação são configuráveis e versionados; a versão aplicada a cada carteira é registrada e fica imutável após a publicação | RF-201, RF-202, RF-206 |
| RN-004 | A base é segmentada automaticamente entre massificada e qualificada por valor, risco e histórico; contribuinte que esgota a régua sem regularizar é elegível à qualificada | RF-203, RF-206, RF-409 |
| RN-009 | Um subconjunto dos elegíveis é sorteado para o grupo de controle a cada ciclo, fora das ações de cobrança; o efeito incremental é a taxa de regularização da carteira cobrada menos a do grupo de controle do mesmo ciclo | RF-204, RF-604 |

### MOD-F3 — Scoring de Liquidez

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-301 | Ingestão do score | Consome o output do modelo da UFMT (API ou arquivo; no piloto, SIM-01), normaliza e associa ao contribuinte |
| RF-302 | Score como variável de priorização | Disponibiliza o score como variável parametrizável, com threshold configurável no critério (RF-205) |
| RF-303 | Score no dossiê | Exibe o score no dossiê do atendente e na configuração da carteira |
| RF-304 | Recalibração periódica | Atualiza o score periodicamente com base em resultados observados; o modelo é da UFMT (RN-015) |
| RF-305 | Fallback sem score | Opera em fallback determinístico quando o output está indisponível ou inválido |
| RF-306 | Painel de cobertura do score | Mostra versão do modelo, cobertura por tributo e última ingestão |

**Regras de negócio**

| ID | Regra | Afeta |
|---|---|---|
| RN-013 | Quando disponível, o score é variável parametrizável de priorização com threshold configurável; na ausência do score, a qualificação usa só critérios determinísticos e o contribuinte é marcado "sem score" | RF-205, RF-302, RF-305, RF-502 |
| RN-015 | O desenvolvimento e a recalibração do modelo são da UFMT, por convênio; o produto trata só da integração e do uso | RF-301, RF-304 |

### MOD-F4 — Réguas de Cobrança Multicanal

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-401 | Editor de régua | Desenha régua por carteira (parcelamentos, IPVA, ITCD, ICMS Normal, ICMS ST) com etapas, offsets, canais e templates |
| RF-402 | Disparo automático | Dispara as comunicações automaticamente, sem confirmação manual em lote |
| RF-403 | Escalonamento por comportamento | Renotifica, intensifica ou encerra conforme o comportamento do contribuinte |
| RF-404 | Multicanal com fallback | Opera e-mail, SMS e SNE na v1 e WhatsApp quando contratado, com ordem de fallback (GAP-004) |
| RF-405 | Opt-in/opt-out por canal | Respeita o consentimento por canal e registra cada mudança |
| RF-406 | Status de entrega e reenvio | Registra o status de entrega de cada comunicação e permite reenviar falhas |
| RF-407 | Marcação de origem da regularização | Marca a origem da regularização pelo canal/instrumento que a antecedeu |
| RF-408 | Efetividade da régua | Monitora a efetividade por segmento, etapa e canal |
| RF-409 | Encaminhamento à qualificada | Encaminha à cobrança qualificada quem esgota a régua sem regularizar |

**Regras de negócio**

| ID | Regra | Afeta |
|---|---|---|
| RN-005 | As ações escalonam conforme o comportamento do contribuinte: sem resposta intensifica, regularização encerra | RF-402, RF-403, RF-409 |
| RN-006 | Disparo por canal sujeito a consentimento (WhatsApp) só ocorre com opt-in vigente; opt-out é respeitado de imediato | RF-404, RF-405 |
| RN-008 | Toda regularização é marcada quanto à origem: espontânea ou resposta à cobrança por canal/instrumento | RF-407, RF-408, RF-506, RF-603, RF-904 |
| RN-016 | A regularização ocorrida até 30 dias após uma comunicação é atribuída ao canal dessa comunicação (janela assumida no plano; GAP-007) | RF-407, RF-603 |

### MOD-F5 — Cobrança Qualificada

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-501 | Distribuição automática | Distribui os casos da carteira qualificada por vínculo, balanceamento de carga e prioridade, sem planilha |
| RF-502 | Fila priorizada | Ordena a fila do atendente por score/estágio; sem score, pelos critérios determinísticos |
| RF-503 | Dossiê consolidado | Monta o dossiê do caso automaticamente: débitos, parcelamentos, comunicações, regularizações, interações e score (3 níveis, GAP-005) |
| RF-504 | Sinalização coercitiva | Sinaliza no dossiê notificações coercitivas ativas em outras coordenadorias (CCF/SNE/SUCOM) |
| RF-505 | Registro de interações | Registra interações por caso, com campos estruturados e texto livre, mantendo o histórico |
| RF-506 | Encerramento por regularização | Encerra o caso ao detectar regularização e marca a origem |
| RF-507 | Visão restrita do atendente | O atendente vê só a própria lista de contatos e a própria carteira, sem comparativo com colegas; o caso qualificado é do coordenador |

**Regras de negócio**

| ID | Regra | Afeta |
|---|---|---|
| RN-007 | Casos são distribuídos automaticamente por vínculo, balanceamento de carga e prioridade, sem planilha | RF-501, RF-502 |
| RN-010 | Toda ação relevante do caso é registrada com ator, data/hora e resultado | RF-505, RF-506, RF-406 |
| RN-011 | O atendente vê apenas a própria carteira/casos, em visão não comparativa; o coordenador vê o painel completo | RF-507, RF-606, RF-901 |
| RN-017 | Medidas coercitivas e articulação com a PGE ficam fora do sistema: o dossiê sinaliza, não executa | RF-504 |

**Lista ativa do atendente e caso do coordenador (design UX v1)**

| Verbo | Onde | Quem | O que acontece |
|---|---|---|---|
| Distribuir lista | TEL-009, ciclo publicado | coordenador | Cria um contato por contribuinte da massificada (fora do grupo de controle), com o atendente do contribuinte (rodízio quando vazio) e prioridade de 1 a 5 pelo valor; a mensagem diz quantos contatos foram para cada atendente |
| Registrar ligação | TEL-035 | atendente dono do contato, coordenador | Exige «Resultado desta ligação» (escolhido na hora; o form abre vazio) e a anotação. Cria a interação, soma 1 em tentativas e decide o status: promessa → ligado (próxima ação no retorno ou em 7 dias); contato efetivo → retornar na data combinada ou encerrado; sem contato → retornar amanhã até a 3ª tentativa, que encerra; recusa → encerrado |
| Encerrar | TEL-035 | atendente dono do contato, coordenador | Exige o motivo; o contato sai de «Minha lista» |
| Avançar etapa | TEL-024 | coordenador responsável | Leva o caso à etapa seguinte; de «Condução» em diante só «Encerrar caso» |
| Encerrar caso | TEL-024 | coordenador responsável | Exige o motivo e grava a data do encerramento |

### MOD-F6 — Monitoramento, KPIs e Grupo de Controle

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-601 | Funil do crédito | Painel do ciclo do crédito (identificado → notificado → regularizado) em tempo quase-real, sem extração manual |
| RF-602 | KPIs com metas | KPIs por tributo, canal, instrumento e atendente, comparados a metas formais |
| RF-603 | Origem da regularização | Apura a regularização por origem: espontânea ou resposta à cobrança por canal |
| RF-604 | Efeito incremental | Calcula, por ciclo, a taxa da carteira cobrada menos a do grupo de controle |
| RF-605 | IPVA e ITCD no monitoramento | Inclui IPVA e ITCD no monitoramento, com metas |
| RF-606 | Visões por perfil | Coordenador vê o painel completo; atendente vê só os próprios indicadores |
| RF-607 | Insumos para revisão da estratégia | Gera insumos analíticos (funil, origem, efeito incremental) para revisar a estratégia de cobrança |

**Regras de negócio**

Regras aplicáveis, definidas nos módulos de origem: RN-008 (MOD-F4), RN-009 (MOD-F2), RN-011 (MOD-F5).

### MOD-T — Transversais

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-901 | Exportação rastreável | Exporta listas e painéis em CSV/PDF e registra cada exportação na trilha de auditoria |
| RF-902 | Busca e filtro padronizados | Filtra por contribuinte/documento, tributo, status, atraso, segmento e atendente em todas as listas |
| RF-903 | Visão única do contribuinte | Débitos, parcelamentos, contatos e histórico do contribuinte num lugar só (lar em MOD-F1, RF-105) |
| RF-904 | Marcação de origem da regularização | Espontânea × resposta à cobrança por canal/instrumento (lar em MOD-F4, RF-407) |

**Regras de negócio**

Regras aplicáveis, definidas em MOD-F5: RN-010 e RN-011.
