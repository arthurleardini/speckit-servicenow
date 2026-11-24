# Mapa de contexto — ingestão micro

Status: draft  
Última atualização: 2026-11-24  
Fontes: `outputs/explore/hld-funcional.md`, `outputs/explore/especificacao-funcional.md`, `outputs/explore/especificacao-tecnica.md`, `outputs/explore/modelo-de-dados.md`, `inputs/plano-2.6-cobranca.md`, `inputs/premissas-ficticias.md`, `inputs/simulacoes.md`, `inputs/fio-condutor.md`, `inputs/de-para-ids.md`

**Instrução:** não apagar seções; preencher ou declarar *não aplicável* / *ausente na fonte*.

Todo dado deste projeto é fictício ou agregado. Nenhum CPF, CNPJ ou nome real de contribuinte aparece nas fontes nem neste mapa.

<!-- id: context-overview -->

## Resumo executivo *(síntese — não substitui as tabelas abaixo)*

- Projeto / produto (nome provisório): Cobrança MT — app escopado `x_2326104_cob` no ServiceNow, piloto 2.6 Cobrança da SEFAZ-MT no Speckit ServiceNow v0.
- Objeto do trabalho (uma frase): transformar o Plano de Implementação 2.6 Cobrança (6 funcionalidades, 46 requisitos, 32 critérios) em especificação rastreável e num app instalado na instância `dev493801`, com integrações simuladas e dados fictícios.
- Modo: inicial (não havia `context-map.md`). Diretório de fontes: `outputs/explore/` (5 documentos) e `inputs/` (5 insumos do piloto). Sem legado digital: o Explore declarou `legado=Não` no kickoff (sync-log #1).

---

<!-- id: source-files -->

## Inventário de arquivos em `inputs/`

| # | Caminho | Tipo | Tamanho / data | Lido na íntegra? |
|---|---------|------|----------------|------------------|
| 1 | `inputs/plano-2.6-cobranca.md` | doc (plano de implementação, cópia saneada) | 104 linhas / 2026-11-24 | sim |
| 2 | `inputs/de-para-ids.md` | doc (conversão de IDs) | 141 linhas / 2026-11-24 | sim |
| 3 | `inputs/fio-condutor.md` | doc (escopo da demo) | 18 linhas / 2026-11-24 | sim |
| 4 | `inputs/premissas-ficticias.md` | doc (premissas P1–P5) | 18 linhas / 2026-11-24 | sim |
| 5 | `inputs/simulacoes.md` | doc (integrações simuladas SIM-) | 61 linhas / 2026-11-24 | sim |
| 6 | `outputs/explore/hld-funcional.md` | doc do Explore | 91 linhas / 2026-11-24 | sim |
| 7 | `outputs/explore/especificacao-funcional.md` | doc do Explore | 252 linhas / 2026-11-24 | sim |
| 8 | `outputs/explore/especificacao-tecnica.md` | doc do Explore | 62 linhas / 2026-11-24 | sim |
| 9 | `outputs/explore/modelo-de-dados.md` | doc do Explore | 415 linhas / 2026-11-24 | sim |
| 10 | `outputs/explore/gaps.md` | doc do Explore (questões abertas) | 42 linhas / 2026-11-24 | sim |
| 11 | `outputs/spec/screens-manifest.json + screens/*.png` | manifesto e 33 prints da instância | 33 telas / 2026-11-24 | sim |

O `gaps.md` não gera `F-xxx`: cada GAP é questão aberta e entra na seção «Questões em aberto». O manifesto e os prints confirmam que as 33 telas existem na instância (F-018); não geram fato novo.

---

<!-- id: atomic-by-source -->

## Extração atômica **por fonte**

### Fonte: `outputs/explore/hld-funcional.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-001 | O produto é o sistema de cobrança da Coordenação de Cobrança (CPRF) da SEFAZ-MT, construído como app escopado x_2326104_cob no ServiceNow | hld-funcional.md §1 Visão geral | Contexto institucional | alta |
| F-002 | A v1 entrega o ciclo completo: consolidação, qualificação, réguas, cobrança qualificada e KPIs com efeito incremental contra grupo de controle | hld-funcional.md §1 Visão geral | Contexto institucional | alta |
| F-003 | Medidas coercitivas e articulação com a PGE ficam fora do sistema: o dossiê sinaliza, não executa | hld-funcional.md §1 Visão geral | Cobrança qualificada | alta |
| F-004 | Módulo MOD-F1 — Ingestão e Carteira Consolidada: Consolidar débitos das 5 fontes por contribuinte, com status intraciclo e alerta de parcelamento em risco | hld-funcional.md §2 MOD-F1 | Ingestão e carteira consolidada | alta |
| F-005 | Módulo MOD-F2 — Qualificação e Parametrização da Carteira: Critérios versionados, segmentação massificada × qualificada e sorteio do grupo de controle por ciclo | hld-funcional.md §2 MOD-F2 | Qualificação da carteira | alta |
| F-006 | Módulo MOD-F3 — Scoring de Liquidez: Ingerir o score da UFMT e usá-lo como variável de priorização, com fallback sem score | hld-funcional.md §2 MOD-F3 | Score de liquidez | alta |
| F-007 | Módulo MOD-F4 — Réguas de Cobrança Multicanal: Desenhar e disparar réguas escalonadas por canal, com opt-in e marcação de origem da regularização | hld-funcional.md §2 MOD-F4 | Réguas multicanal | alta |
| F-008 | Módulo MOD-F5 — Cobrança Qualificada: Distribuir casos aos atendentes, montar o dossiê e registrar interações | hld-funcional.md §2 MOD-F5 | Cobrança qualificada | alta |
| F-009 | Módulo MOD-F6 — Monitoramento, KPIs e Grupo de Controle: Funil do crédito, KPIs com metas e efeito incremental contra o grupo de controle | hld-funcional.md §2 MOD-F6 | Monitoramento e KPIs | alta |
| F-010 | Módulo MOD-T — Transversais: Exportação com trilha, busca e filtro padronizados, visão única do contribuinte e origem da regularização | hld-funcional.md §2 MOD-T | Transversais | alta |

### Fonte: `outputs/explore/especificacao-funcional.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-011 | Persona Coordenador de Cobrança (CPRF), role x_2326104_cob.coordenador: Dono do produto. Parametriza e publica critérios, desenha réguas, acompanha integrações, distribui a carteira qualificada e acompanha KPIs, metas e efeito incremental | especificacao-funcional.md §1.1 Personas | Atores | alta |
| F-012 | Persona Atendente de Cobrança, role x_2326104_cob.atendente: Usuário-chave. Trabalha a própria fila da cobrança qualificada, consulta o dossiê e a visão única do contribuinte, registra interações e vê os próprios indicadores | especificacao-funcional.md §1.1 Personas | Atores | alta |
| F-013 | Persona Administrador do app, role x_2326104_cob.admin: Mantém o app: tabelas simuladas (SIM-01 a SIM-03), interruptores de falha, trilha de exportação e usuários demo. Herda as permissões do coordenador | especificacao-funcional.md §1.1 Personas | Atores | alta |
| F-014 | Matriz de acesso: o atendente vê visão única, regularizações, dossiê e exportação só da própria carteira; registra interação e encerra só caso atribuído a si | especificacao-funcional.md §1.2 RN-011 | Segurança e acesso | alta |
| F-015 | Matriz de acesso: só o coordenador publica versão de critério, gera prévia/publica ciclo e distribui casos; o admin opera tabelas simuladas e vê a trilha de exportação | especificacao-funcional.md §1.2 RN-011 | Segurança e acesso | alta |
| F-016 | "Própria carteira" = registros cujo atendente é o usuário logado (caso, contribuinte vinculado) ou que referenciam esses registros | especificacao-funcional.md §1.2 RN-011 | Segurança e acesso | alta |
| F-017 | Core UI clássica (UI16), menu "Cobrança MT" com um módulo de navegação por MOD-F1 a MOD-F6 mais "Administração"; cada tela é form, list ou report de uma tabela do app | especificacao-funcional.md §2 MOD-F1 | Interface | alta |
| F-018 | 33 telas TEL-001 a TEL-033; o print de cada tela é tirado com o usuário demo do papel da tela sobre o registro demo indicado; as listas filtram por contribuinte, tributo, status, atraso, segmento e atendente | especificacao-funcional.md §2 RF-902 | Interface | alta |
| F-019 | Dossiê (TEL-024) e painel de KPIs (TEL-026 a TEL-031) entram como form com related lists e reports simples da Core UI; a diferença está em GAP-012 e GAP-013 | especificacao-funcional.md §2 RF-503 | Interface | alta |
| F-020 | Consolidação periódica multifonte: Consolida automaticamente, a cada ciclo, os débitos de CCF, MPI/Big Data, IPVA, ITCD e SNE, com a origem registrada em cada débito | especificacao-funcional.md §3 MOD-F1 RF-101 | Ingestão e carteira consolidada | alta |
| F-021 | Vínculo ao contribuinte e sobreposição: Vincula cada débito ao contribuinte por CPF/CNPJ e resolve a sobreposição entre fontes; documento inválido vai para o log de rejeições | especificacao-funcional.md §3 MOD-F1 RF-102 | Ingestão e carteira consolidada | alta |
| F-022 | Atualização intraciclo: Atualiza o status de regularização e de parcelamento dentro do ciclo e encerra a abordagem de quem regularizou | especificacao-funcional.md §3 MOD-F1 RF-103 | Ingestão e carteira consolidada | alta |
| F-023 | Alerta de parcelamento em risco: Monitora parcelamentos e alerta inadimplência parcial (risco de rompimento) | especificacao-funcional.md §3 MOD-F1 RF-104 | Ingestão e carteira consolidada | alta |
| F-024 | Visão única do contribuinte: Exibe em tela única débitos, parcelamentos, comunicações e histórico do contribuinte | especificacao-funcional.md §3 MOD-F1 RF-105 | Ingestão e carteira consolidada | alta |
| F-025 | Transição MPI → Big Data: Troca a fonte MPI pela Big Data sem ruptura da carteira | especificacao-funcional.md §3 MOD-F1 RF-106 | Ingestão e carteira consolidada | alta |
| F-026 | Status das integrações: Expõe por fonte a última sincronização, o volume e os erros; falha numa fonte não trava as demais | especificacao-funcional.md §3 MOD-F1 RF-107 | Ingestão e carteira consolidada | alta |
| F-027 | Débitos de fontes distintas do mesmo contribuinte formam uma única visão; a duplicidade é resolvida por sobreposição (regra em GAP-006) (afeta RF-101, RF-102, RF-105, RF-503, RF-903) | especificacao-funcional.md §3 MOD-F1 RN-001 | Ingestão e carteira consolidada | alta |
| F-028 | O status de regularização/parcelamento é atualizado intraciclo; ao regularizar, o contribuinte deixa de ser abordado (afeta RF-103, RF-104, RF-403, RF-506, RF-601) | especificacao-funcional.md §3 MOD-F1 RN-002 | Ingestão e carteira consolidada | alta |
| F-029 | A transição do MPI para o Big Data preserva a operação, sem ruptura da carteira (afeta RF-101, RF-106) | especificacao-funcional.md §3 MOD-F1 RN-012 | Ingestão e carteira consolidada | alta |
| F-030 | CPF/CNPJ inválido é rejeitado, não é gravado e consta no log de rejeições (afeta RF-102) | especificacao-funcional.md §3 MOD-F1 RN-014 | Ingestão e carteira consolidada | alta |
| F-031 | Parametrização de critérios: Configura critérios por valor mínimo, tributo, tempo de atraso, instrumento e exclusões | especificacao-funcional.md §3 MOD-F2 RF-201 | Qualificação da carteira | alta |
| F-032 | Versionamento imutável: Cada conjunto de critérios publicado vira versão imutável; editar cria nova versão, e a carteira guarda a versão aplicada | especificacao-funcional.md §3 MOD-F2 RF-202 | Qualificação da carteira | alta |
| F-033 | Segmentação massificada × qualificada: Segmenta a base automaticamente entre carteira massificada e qualificada por valor, risco e histórico, com desempate definido (GAP-002) | especificacao-funcional.md §3 MOD-F2 RF-203 | Qualificação da carteira | alta |
| F-034 | Sorteio do grupo de controle: Sorteia, a cada ciclo, o grupo de controle entre os elegíveis e o exclui das ações de cobrança | especificacao-funcional.md §3 MOD-F2 RF-204 | Qualificação da carteira | alta |
| F-035 | Score como critério: Usa o score de liquidez como critério/threshold quando disponível; sem score, opera só com critérios determinísticos e marca o contribuinte "sem score" | especificacao-funcional.md §3 MOD-F2 RF-205 | Qualificação da carteira | alta |
| F-036 | Prévia da carteira: Gera a prévia da carteira segmentada antes de publicar o ciclo | especificacao-funcional.md §3 MOD-F2 RF-206 | Qualificação da carteira | alta |
| F-037 | Critérios de qualificação são configuráveis e versionados; a versão aplicada a cada carteira é registrada e fica imutável após a publicação (afeta RF-201, RF-202, RF-206) | especificacao-funcional.md §3 MOD-F2 RN-003 | Qualificação da carteira | alta |
| F-038 | A base é segmentada automaticamente entre massificada e qualificada por valor, risco e histórico; contribuinte que esgota a régua sem regularizar é elegível à qualificada (afeta RF-203, RF-206, RF-409) | especificacao-funcional.md §3 MOD-F2 RN-004 | Qualificação da carteira | alta |
| F-039 | Um subconjunto dos elegíveis é sorteado para o grupo de controle a cada ciclo, fora das ações de cobrança; o efeito incremental é a taxa de regularização da carteira cobrada menos a do grupo de controle do mesmo ciclo (afeta RF-204, RF-604) | especificacao-funcional.md §3 MOD-F2 RN-009 | Qualificação da carteira | alta |
| F-040 | Ingestão do score: Consome o output do modelo da UFMT (API ou arquivo; no piloto, SIM-01), normaliza e associa ao contribuinte | especificacao-funcional.md §3 MOD-F3 RF-301 | Score de liquidez | alta |
| F-041 | Score como variável de priorização: Disponibiliza o score como variável parametrizável, com threshold configurável no critério (RF-205) | especificacao-funcional.md §3 MOD-F3 RF-302 | Score de liquidez | alta |
| F-042 | Score no dossiê: Exibe o score no dossiê do atendente e na configuração da carteira | especificacao-funcional.md §3 MOD-F3 RF-303 | Score de liquidez | alta |
| F-043 | Recalibração periódica: Atualiza o score periodicamente com base em resultados observados; o modelo é da UFMT (RN-015) | especificacao-funcional.md §3 MOD-F3 RF-304 | Score de liquidez | alta |
| F-044 | Fallback sem score: Opera em fallback determinístico quando o output está indisponível ou inválido | especificacao-funcional.md §3 MOD-F3 RF-305 | Score de liquidez | alta |
| F-045 | Painel de cobertura do score: Mostra versão do modelo, cobertura por tributo e última ingestão | especificacao-funcional.md §3 MOD-F3 RF-306 | Score de liquidez | alta |
| F-046 | Quando disponível, o score é variável parametrizável de priorização com threshold configurável; na ausência do score, a qualificação usa só critérios determinísticos e o contribuinte é marcado "sem score" (afeta RF-205, RF-302, RF-305, RF-502) | especificacao-funcional.md §3 MOD-F3 RN-013 | Score de liquidez | alta |
| F-047 | O desenvolvimento e a recalibração do modelo são da UFMT, por convênio; o produto trata só da integração e do uso (afeta RF-301, RF-304) | especificacao-funcional.md §3 MOD-F3 RN-015 | Score de liquidez | alta |
| F-048 | Editor de régua: Desenha régua por carteira (parcelamentos, IPVA, ITCD, ICMS Normal, ICMS ST) com etapas, offsets, canais e templates | especificacao-funcional.md §3 MOD-F4 RF-401 | Réguas multicanal | alta |
| F-049 | Disparo automático: Dispara as comunicações automaticamente, sem confirmação manual em lote | especificacao-funcional.md §3 MOD-F4 RF-402 | Réguas multicanal | alta |
| F-050 | Escalonamento por comportamento: Renotifica, intensifica ou encerra conforme o comportamento do contribuinte | especificacao-funcional.md §3 MOD-F4 RF-403 | Réguas multicanal | alta |
| F-051 | Multicanal com fallback: Opera e-mail, SMS e SNE na v1 e WhatsApp quando contratado, com ordem de fallback (GAP-004) | especificacao-funcional.md §3 MOD-F4 RF-404 | Réguas multicanal | alta |
| F-052 | Opt-in/opt-out por canal: Respeita o consentimento por canal e registra cada mudança | especificacao-funcional.md §3 MOD-F4 RF-405 | Réguas multicanal | alta |
| F-053 | Status de entrega e reenvio: Registra o status de entrega de cada comunicação e permite reenviar falhas | especificacao-funcional.md §3 MOD-F4 RF-406 | Réguas multicanal | alta |
| F-054 | Marcação de origem da regularização: Marca a origem da regularização pelo canal/instrumento que a antecedeu | especificacao-funcional.md §3 MOD-F4 RF-407 | Réguas multicanal | alta |
| F-055 | Efetividade da régua: Monitora a efetividade por segmento, etapa e canal | especificacao-funcional.md §3 MOD-F4 RF-408 | Réguas multicanal | alta |
| F-056 | Encaminhamento à qualificada: Encaminha à cobrança qualificada quem esgota a régua sem regularizar | especificacao-funcional.md §3 MOD-F4 RF-409 | Réguas multicanal | alta |
| F-057 | As ações escalonam conforme o comportamento do contribuinte: sem resposta intensifica, regularização encerra (afeta RF-402, RF-403, RF-409) | especificacao-funcional.md §3 MOD-F4 RN-005 | Réguas multicanal | alta |
| F-058 | Disparo por canal sujeito a consentimento (WhatsApp) só ocorre com opt-in vigente; opt-out é respeitado de imediato (afeta RF-404, RF-405) | especificacao-funcional.md §3 MOD-F4 RN-006 | Réguas multicanal | alta |
| F-059 | Toda regularização é marcada quanto à origem: espontânea ou resposta à cobrança por canal/instrumento (afeta RF-407, RF-408, RF-506, RF-603, RF-904) | especificacao-funcional.md §3 MOD-F4 RN-008 | Réguas multicanal | alta |
| F-060 | A regularização ocorrida até 30 dias após uma comunicação é atribuída ao canal dessa comunicação (janela assumida no plano; GAP-007) (afeta RF-407, RF-603) | especificacao-funcional.md §3 MOD-F4 RN-016 | Réguas multicanal | alta |
| F-061 | Distribuição automática: Distribui os casos da carteira qualificada por vínculo, balanceamento de carga e prioridade, sem planilha | especificacao-funcional.md §3 MOD-F5 RF-501 | Cobrança qualificada | alta |
| F-062 | Fila priorizada: Ordena a fila do atendente por score/estágio; sem score, pelos critérios determinísticos | especificacao-funcional.md §3 MOD-F5 RF-502 | Cobrança qualificada | alta |
| F-063 | Dossiê consolidado: Monta o dossiê do caso automaticamente: débitos, parcelamentos, comunicações, regularizações, interações e score (3 níveis, GAP-005) | especificacao-funcional.md §3 MOD-F5 RF-503 | Cobrança qualificada | alta |
| F-064 | Sinalização coercitiva: Sinaliza no dossiê notificações coercitivas ativas em outras coordenadorias (CCF/SNE/SUCOM) | especificacao-funcional.md §3 MOD-F5 RF-504 | Cobrança qualificada | alta |
| F-065 | Registro de interações: Registra interações por caso, com campos estruturados e texto livre, mantendo o histórico | especificacao-funcional.md §3 MOD-F5 RF-505 | Cobrança qualificada | alta |
| F-066 | Encerramento por regularização: Encerra o caso ao detectar regularização e marca a origem | especificacao-funcional.md §3 MOD-F5 RF-506 | Cobrança qualificada | alta |
| F-067 | Visão restrita do atendente: O atendente vê só a própria carteira e os próprios casos, sem comparativo com colegas | especificacao-funcional.md §3 MOD-F5 RF-507 | Cobrança qualificada | alta |
| F-068 | Casos são distribuídos automaticamente por vínculo, balanceamento de carga e prioridade, sem planilha (afeta RF-501, RF-502) | especificacao-funcional.md §3 MOD-F5 RN-007 | Cobrança qualificada | alta |
| F-069 | Toda ação relevante do caso é registrada com ator, data/hora e resultado (afeta RF-505, RF-506, RF-406) | especificacao-funcional.md §3 MOD-F5 RN-010 | Cobrança qualificada | alta |
| F-070 | O atendente vê apenas a própria carteira/casos, em visão não comparativa; o coordenador vê o painel completo (afeta RF-507, RF-606, RF-901) | especificacao-funcional.md §3 MOD-F5 RN-011 | Cobrança qualificada | alta |
| F-071 | Medidas coercitivas e articulação com a PGE ficam fora do sistema: o dossiê sinaliza, não executa (afeta RF-504) | especificacao-funcional.md §3 MOD-F5 RN-017 | Cobrança qualificada | alta |
| F-072 | Funil do crédito: Painel do ciclo do crédito (identificado → notificado → regularizado) em tempo quase-real, sem extração manual | especificacao-funcional.md §3 MOD-F6 RF-601 | Monitoramento e KPIs | alta |
| F-073 | KPIs com metas: KPIs por tributo, canal, instrumento e atendente, comparados a metas formais | especificacao-funcional.md §3 MOD-F6 RF-602 | Monitoramento e KPIs | alta |
| F-074 | Origem da regularização: Apura a regularização por origem: espontânea ou resposta à cobrança por canal | especificacao-funcional.md §3 MOD-F6 RF-603 | Monitoramento e KPIs | alta |
| F-075 | Efeito incremental: Calcula, por ciclo, a taxa da carteira cobrada menos a do grupo de controle | especificacao-funcional.md §3 MOD-F6 RF-604 | Monitoramento e KPIs | alta |
| F-076 | IPVA e ITCD no monitoramento: Inclui IPVA e ITCD no monitoramento, com metas | especificacao-funcional.md §3 MOD-F6 RF-605 | Monitoramento e KPIs | alta |
| F-077 | Visões por perfil: Coordenador vê o painel completo; atendente vê só os próprios indicadores | especificacao-funcional.md §3 MOD-F6 RF-606 | Monitoramento e KPIs | alta |
| F-078 | Insumos para revisão da estratégia: Gera insumos analíticos (funil, origem, efeito incremental) para revisar a estratégia de cobrança | especificacao-funcional.md §3 MOD-F6 RF-607 | Monitoramento e KPIs | alta |
| F-079 | Exportação rastreável: Exporta listas e painéis em CSV/PDF e registra cada exportação na trilha de auditoria | especificacao-funcional.md §3 MOD-T RF-901 | Transversais | alta |
| F-080 | Busca e filtro padronizados: Filtra por contribuinte/documento, tributo, status, atraso, segmento e atendente em todas as listas | especificacao-funcional.md §3 MOD-T RF-902 | Transversais | alta |
| F-081 | Visão única do contribuinte: Débitos, parcelamentos, contatos e histórico do contribuinte num lugar só (lar em MOD-F1, RF-105) | especificacao-funcional.md §3 MOD-T RF-903 | Transversais | alta |
| F-082 | Marcação de origem da regularização: Espontânea × resposta à cobrança por canal/instrumento (lar em MOD-F4, RF-407) | especificacao-funcional.md §3 MOD-T RF-904 | Transversais | alta |

### Fonte: `outputs/explore/especificacao-tecnica.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-083 | Instância: ServiceNow PDI `dev493801`, release Brazil — Hospeda o app; é o protótipo desde o Explore | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-084 | App: Aplicação escopada `x_2326104_cob` ("Cobrança MT"), escopo lido de `app/now.config.json` — Tabelas, forms, lists, reports, menu, roles, ACLs, regras e testes | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-085 | Código-fonte do app: Fluent / ServiceNow SDK `@servicenow/sdk` 4.14.3 (`app/package.json`), `@servicenow/glide` 27.0.5 — Metadados em `app/src/fluent/**`, scripts de servidor em `app/src/server/**`; `$id` fixos em `keys.ts` | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-086 | Interface: Core UI clássica (UI16): `Form()` em seções de 1–2 colunas, `List()`, related lists, formatter de activity, UI Action, UI Policy, report simples — Todas as telas `TEL-`; sem Workspace, Service Portal ou UI Builder | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-087 | Segurança: Roles `x_2326104_cob.coordenador`, `.atendente`, `.admin`; ACL de leitura por role e ACL de linha "própria carteira" do atendente — Matriz §1.2 da especificação funcional | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-088 | Testes: ATF (`Test()`, suíte `cob-regressao`) via `now-sdk cicd test run` — Recibo por story; desfecho do teste de form conforme item 9 do design | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-089 | Dados de demonstração: `Record()` com `installMethod: 'demo'` gerado pelo `sn-seed`; CPF/CNPJ fictícios com DV válido e `ficticio = true` — 50 registros por tabela, 1 registro demo por tela de form, 1 usuário demo por role | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-090 | Instalação: `npm run reinstall` (build `--frozenKeys` + install + contagem + suíte ATF) — Idempotente; registra a linha de install no `sync-log.md` | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-091 | Captura de telas: Playwright + Chromium (`sn-capture`), impersonate do papel da tela, 1440×900 — `outputs/spec/screens/<TEL>.png` | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-092 | Backlog e repositório: GitHub privado `arthurleardini/speckit-servicenow`, issues e sub-issues — Spec, app e backlog no mesmo repositório | especificacao-tecnica.md §2 Componentes de infraestrutura | Plataforma | alta |
| F-093 | Integração Modelo de score da UFMT — **SIM-01** (`x_2326104_cob_score_sim`) (entrada): score por contribuinte e tributo, versão do modelo, data de ingestão, status; acompanhamento em TEL-011 (cobertura por tributo), TEL-012; contagem de "sem score" no ciclo | especificacao-tecnica.md §3 Integrações externas | Integrações | alta |
| F-094 | Integração Canais e-mail, SMS, SNE, WhatsApp — **SIM-02** (`x_2326104_cob_envio_sim`, `x_2326104_cob_canal_sim`) (saída): comunicação por canal e retorno de entrega; interruptor de falha por canal; opt-in exigido no WhatsApp; acompanhamento em TEL-015, TEL-018, TEL-019; status da comunicação | especificacao-tecnica.md §3 Integrações externas | Integrações | alta |
| F-095 | Integração Fontes de débito CCF, MPI/Big Data, IPVA, ITCD, SNE — **SIM-03** (`x_2326104_cob_debito_stg`, campo `origem`) (entrada): débitos por documento, tributo, valor e vencimento; acompanhamento em TEL-001 (execução por fonte), TEL-002 (rejeições), TEL-006 | especificacao-tecnica.md §3 Integrações externas | Integrações | alta |
| F-096 | Integração Sinalizações coercitivas de outras coordenadorias (CCF/SNE/SUCOM) (entrada): flag e descrição por caso; acompanhamento em campo `sinal_coercitivo` no caso, preenchido pelo seed (GAP-016) | especificacao-tecnica.md §3 Integrações externas | Integrações | alta |
| F-097 | Premissa técnica — Nome de tabela cabe em 30 caracteres: Prefixo `x_2326104_cob_` (14) + sufixo ≤ 16; maior nome previsto `x_2326104_cob_sincronizacao` (27) | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |
| F-098 | Premissa técnica — Report da Core UI disponível no app escopado: `Record({ table: 'sys_report' })` aparece na UI16; se não aparecer, TEL-011, 016, 022, 026, 027, 028 e 031 viram list com group-by | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |
| F-099 | Premissa técnica — Related list por contribuinte no dossiê: Débitos, parcelamentos e comunicações aparecem no form do caso por relacionamento definido sobre `contribuinte` | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |
| F-100 | Premissa técnica — Integrações simuladas como tabela: Score, canais e fontes viram tabelas do app (A8); contrato real fora do v0 | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |
| F-101 | Premissa técnica — Escala do score na simulação: 0 a 100 (`decimal`), só para o seed | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |
| F-102 | Premissa técnica — ACL de linha do atendente: Leitura de caso, contribuinte, interação e regularização condicionada a `atendente = usuário logado` | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |
| F-103 | Premissa técnica — Volume do seed: 50 registros por tabela no Explore; até 300 no Plan (limite de 1.000 iterações do laço de Flow) | especificacao-tecnica.md §4 Premissas técnicas | Plataforma | alta |

### Fonte: `outputs/explore/modelo-de-dados.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-104 | Entidade x_2326104_cob_contribuinte — Contribuinte e visão única (pessoa); atributos: nome, tipo_pessoa, cpf, cnpj, atendente, segmento, score, sem_score, valor_em_aberto, ficticio; usada por RF-102, RF-105, RF-205, RF-507, RF-903 | modelo-de-dados.md §1 RF-102 | Dados | alta |
| F-105 | Entidade x_2326104_cob_debito — Débito consolidado por origem; atributos: contribuinte, origem (SIM-03), tributo, valor, vencimento, dias_atraso, status, sobreposto; usada por RF-101, RF-102, RF-103, RF-503 | modelo-de-dados.md §1 RF-101 | Dados | alta |
| F-106 | Entidade x_2326104_cob_parcelamento — Parcelamento e risco de rompimento; atributos: contribuinte, parcelas_atraso, status, alerta_risco; usada por RF-103, RF-104, RF-503 | modelo-de-dados.md §1 RF-103 | Dados | alta |
| F-107 | Entidade x_2326104_cob_sincronizacao — Execução de sincronização por fonte; atributos: fonte, status, volume, rejeitados; usada por RF-101, RF-106, RF-107 | modelo-de-dados.md §1 RF-101 | Dados | alta |
| F-108 | Entidade x_2326104_cob_rejeicao — Log de rejeição; atributos: sincronizacao, fonte, motivo; usada por RF-102 | modelo-de-dados.md §1 RF-102 | Dados | alta |
| F-109 | Entidade x_2326104_cob_debito_stg — Staging das fontes (SIM-03, pessoa); atributos: origem, cpf, cnpj, tributo, valor, processado, falha_simulada, ficticio; usada por RF-101, RF-102 | modelo-de-dados.md §1 RF-101 | Dados | alta |
| F-110 | Entidade x_2326104_cob_criterio — Versão de critério de qualificação; atributos: versao, estado, tributo, valor_minimo, atraso_minimo_dias, usar_score, threshold_score, pct_grupo_controle, versao_anterior; usada por RF-201, RF-202, RF-205 | modelo-de-dados.md §1 RF-201 | Dados | alta |
| F-111 | Entidade x_2326104_cob_ciclo — Ciclo de qualificação e efeito incremental; atributos: criterio, estado, totais por segmento, taxa_cobrada, taxa_controle, efeito_incremental; usada por RF-203, RF-204, RF-206, RF-604 | modelo-de-dados.md §1 RF-203 | Dados | alta |
| F-112 | Entidade x_2326104_cob_segmentacao — Contribuinte no ciclo (segmento e funil); atributos: ciclo, contribuinte, criterio, segmento, sem_score, estagio_funil; usada por RF-203, RF-204, RF-205, RF-601 | modelo-de-dados.md §1 RF-203 | Dados | alta |
| F-113 | Entidade x_2326104_cob_score_sim — Score UFMT (SIM-01); atributos: contribuinte, tributo, score, versao_modelo, status; usada por RF-301, RF-302, RF-305, RF-306 | modelo-de-dados.md §1 RF-301 | Dados | alta |
| F-114 | Entidade x_2326104_cob_regua — Régua de cobrança; atributos: carteira, ativa, janela_atribuicao_dias, ordem_fallback; usada por RF-401, RF-404 | modelo-de-dados.md §1 RF-401 | Dados | alta |
| F-115 | Entidade x_2326104_cob_regua_etapa — Etapa da régua; atributos: regua, ordem, offset_dias, canal, template, acao_sem_resposta; usada por RF-401, RF-403, RF-409 | modelo-de-dados.md §1 RF-401 | Dados | alta |
| F-116 | Entidade x_2326104_cob_comunicacao — Comunicação disparada; atributos: contribuinte, regua, etapa, canal, status, tentativas; usada por RF-402, RF-403, RF-406, RF-408 | modelo-de-dados.md §1 RF-402 | Dados | alta |
| F-117 | Entidade x_2326104_cob_envio_sim — Retorno do canal (SIM-02); atributos: comunicacao, canal, status_retorno; usada por RF-406 | modelo-de-dados.md §1 RF-406 | Dados | alta |
| F-118 | Entidade x_2326104_cob_canal_sim — Canal e interruptor de falha (SIM-02); atributos: canal, contratado, forcar_falha, exige_opt_in; usada por RF-404, RF-405 | modelo-de-dados.md §1 RF-404 | Dados | alta |
| F-119 | Entidade x_2326104_cob_consentimento — Opt-in/opt-out por canal; atributos: contribuinte, canal, situacao; usada por RF-405 | modelo-de-dados.md §1 RF-405 | Dados | alta |
| F-120 | Entidade x_2326104_cob_regularizacao — Regularização e origem; atributos: contribuinte, debito, ciclo, tributo, valor, origem, canal, instrumento, grupo_controle, caso, atendente; usada por RF-407, RF-506, RF-602, RF-603, RF-904 | modelo-de-dados.md §1 RF-407 | Dados | alta |
| F-121 | Entidade x_2326104_cob_caso — Caso da cobrança qualificada (dossiê); atributos: contribuinte, atendente, estagio, prioridade, score, sinal_coercitivo; usada por RF-501 a RF-507 | modelo-de-dados.md §1 RF-501 | Dados | alta |
| F-122 | Entidade x_2326104_cob_interacao — Interação do atendente; atributos: caso, atendente, tipo, resultado, descricao; usada por RF-505 | modelo-de-dados.md §1 RF-505 | Dados | alta |
| F-123 | Entidade x_2326104_cob_meta — Meta de KPI; atributos: indicador, tributo, canal, periodo, valor_meta; usada por RF-602, RF-605 | modelo-de-dados.md §1 RF-602 | Dados | alta |
| F-124 | Entidade x_2326104_cob_exportacao — Trilha de exportação; atributos: usuario, tabela, formato, filtro, registros; usada por RF-901 | modelo-de-dados.md §1 RF-901 | Dados | alta |
| F-125 | Tabelas com form ganham journal (comentarios) e audit; tabelas de pessoa têm ficticio=true e CPF/CNPJ só fictícios listados em _documentos.json | modelo-de-dados.md §Convenções | Dados | alta |

### Fonte: `inputs/plano-2.6-cobranca.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-126 | Plano de Implementação 2.6 Cobrança, setembro de 2026, 20 slides | plano-2.6-cobranca.md §cabeçalho | Contexto institucional | alta |
| F-127 | 5 necessidades avaliadas: 2 na v1 e 3 parciais | plano-2.6-cobranca.md §Números-chave | Escopo | alta |
| F-128 | 5 épicos e 6 funcionalidades (F1 a F6) | plano-2.6-cobranca.md §Números-chave | Escopo | alta |
| F-129 | 42 RF (7+6+6+9+7+7) mais 4 transversais RF-T-01 a RF-T-04 | plano-2.6-cobranca.md §Números-chave | Escopo | alta |
| F-130 | 32 critérios de aceite (6+5+5+5+6+5) | plano-2.6-cobranca.md §Números-chave | Escopo | alta |
| F-131 | 5 fontes de débito: CCF, MPI/Big Data, IPVA, ITCD, SNE | plano-2.6-cobranca.md §Números-chave | Ingestão e carteira consolidada | alta |
| F-132 | 5 carteiras prioritárias das réguas: parcelamentos, IPVA, ITCD, ICMS Normal, ICMS ST | plano-2.6-cobranca.md §Números-chave | Réguas multicanal | alta |
| F-133 | Canais das réguas: e-mail, SMS, SNE na v1; WhatsApp condicionado a contratação e opt-in | plano-2.6-cobranca.md §Números-chave | Réguas multicanal | alta |
| F-134 | Dependência externa: score de liquidez da UFMT; dados de cobrança alimentam o modelo a partir de mai/26 | plano-2.6-cobranca.md §Números-chave | Score de liquidez | alta |
| F-135 | Janela de atribuição assumida: 30 dias | plano-2.6-cobranca.md §Números-chave | Monitoramento e KPIs | alta |
| F-136 | Cronograma de 5 meses: dez/26 (plano) a abr/27 (treinamento e operação assistida) | plano-2.6-cobranca.md §Números-chave | Contexto institucional | alta |
| F-137 | SQUAD Cobrança compartilhada com o 2.5 Atendimento | plano-2.6-cobranca.md §Números-chave | Contexto institucional | alta |
| F-138 | 6 candidatos a corte, todos "Em discussão" | plano-2.6-cobranca.md §Números-chave | Escopo | alta |
| F-139 | Horas técnicas não informadas (premissas em branco) | plano-2.6-cobranca.md §Números-chave | Contexto institucional | alta |
| F-140 | Sem score, a qualificação roda em fallback determinístico e o contribuinte fica marcado "sem score" | plano-2.6-cobranca.md §Principais insights | Score de liquidez | alta |
| F-141 | Critérios de qualificação versionados e imutáveis após publicação; editar cria nova versão | plano-2.6-cobranca.md §Principais insights | Qualificação da carteira | alta |
| F-142 | Grupo de controle sorteado a cada ciclo, fora das ações; efeito incremental = taxa da carteira cobrada menos a do grupo de controle | plano-2.6-cobranca.md §Principais insights | Qualificação da carteira | alta |
| F-143 | Régua dispara e escalona sem confirmação manual em lote; regularização encerra a abordagem e marca a origem | plano-2.6-cobranca.md §Principais insights | Réguas multicanal | alta |
| F-144 | Contribuinte que esgota a régua sem regularizar vai para a cobrança qualificada | plano-2.6-cobranca.md §Principais insights | Réguas multicanal | alta |
| F-145 | Atendente vê só a própria carteira, sem comparativo com colegas | plano-2.6-cobranca.md §Principais insights | Cobrança qualificada | alta |
| F-146 | Transição MPI → Big Data (P2.2) sem ruptura da carteira | plano-2.6-cobranca.md §Principais insights | Ingestão e carteira consolidada | alta |
| F-147 | Perfis por funcionalidade: F2 e F4 só Coordenador; F1, F3, F5 e F6 Coordenador e Atendente | plano-2.6-cobranca.md §Épicos e funcionalidades | Atores | alta |
| F-148 | Riscos F1: frequência do ciclo e regra de sobreposição indefinidas | plano-2.6-cobranca.md §Requisitos, regras e critérios F1 | Ingestão e carteira consolidada | alta |
| F-149 | Riscos F2: regra de desempate indefinida; tamanho do grupo de controle a confirmar | plano-2.6-cobranca.md §Requisitos, regras e critérios F2 | Qualificação da carteira | alta |
| F-150 | F3: painel operacional com versão do modelo, cobertura por tributo e última ingestão; integração UFMT por API ou arquivo, a definir | plano-2.6-cobranca.md §Requisitos, regras e critérios F3 | Score de liquidez | alta |
| F-151 | Riscos F4: ordem de fallback entre canais e janela de 30 dias a confirmar; contrato de WhatsApp em aberto | plano-2.6-cobranca.md §Requisitos, regras e critérios F4 | Réguas multicanal | alta |
| F-152 | Riscos F5: níveis do dossiê (grupo econômico, situação patrimonial) e capacidade por atendente indefinidos | plano-2.6-cobranca.md §Requisitos, regras e critérios F5 | Cobrança qualificada | alta |
| F-153 | F6: funil identificado → notificado → regularizado; risco no modelo de atribuição causal e na fonte do pipeline em tempo real (CCF/Oracle) | plano-2.6-cobranca.md §Requisitos, regras e critérios F6 | Monitoramento e KPIs | alta |
| F-154 | Cronograma: jan/27 F1; jan–fev/27 F2 a F6 escalonadas; 2ª metade de fev/27 testes e homologação; início de mar/27 go-live | plano-2.6-cobranca.md §Cronograma | Contexto institucional | alta |
| F-155 | Homologação em 5 etapas: preparação, testes integrados, homologação pela área dona, correção e reteste, aceite e go-live | plano-2.6-cobranca.md §Homologação | Contexto institucional | alta |
| F-156 | Dono do produto: Coordenação de Cobrança (CPRF); usuários-chave: Atendentes de Cobrança; desenvolvimento: SQUAD Cobrança; consultoria: EloGroup; sistemas de origem: TI SEFAZ-MT | plano-2.6-cobranca.md §Homologação | Atores | alta |
| F-157 | Premissas do plano (7 temas) todas "[preencher]" | plano-2.6-cobranca.md §Premissas | Contexto institucional | alta |
| F-158 | Candidatos a corte: WhatsApp, score UFMT, grupo de controle com priorização por score, recalibração do score (Should), sinalização coercitiva no dossiê, insumos analíticos automáticos (Should) | plano-2.6-cobranca.md §Candidatos a corte | Escopo | alta |

### Fonte: `inputs/premissas-ficticias.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-159 | P1 Ciclo de qualificação: premissa: mensal (aberto no plano: F1, risco "frequência do ciclo indefinida"; GAP-001) | premissas-ficticias.md §P1 | Premissas | alta |
| F-160 | P2 Desempate massificada × qualificada: premissa: maior débito, depois o mais antigo (aberto no plano: F2, risco "regra de desempate indefinida"; GAP-002) | premissas-ficticias.md §P2 | Premissas | alta |
| F-161 | P3 Grupo de controle: premissa: 10% da carteira por ciclo (aberto no plano: F2, risco "tamanho do grupo de controle a confirmar"; GAP-003) | premissas-ficticias.md §P3 | Premissas | alta |
| F-162 | P4 Fallback de canal: premissa: SNE → e-mail → SMS (aberto no plano: F4, risco "ordem de fallback entre canais a confirmar"; GAP-004) | premissas-ficticias.md §P4 | Premissas | alta |
| F-163 | P5 Dossiê: premissa: 3 níveis — (1) débitos e parcelamentos; (2) comunicações, interações e regularizações; (3) score e sinalizações coercitivas (aberto no plano: F5, risco "níveis do dossiê a confirmar"; GAP-005) | premissas-ficticias.md §P5 | Premissas | alta |

### Fonte: `inputs/simulacoes.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-164 | SIM-01 score UFMT simulado em x_2326104_cob_score_sim, escala 0–100 só para simulação, 20% dos contribuintes sem score válido | simulacoes.md §SIM-01 | Integrações | alta |
| F-165 | SIM-01: marcar a versão do modelo como inválida faz toda a carteira cair em fallback | simulacoes.md §SIM-01 | Integrações | alta |
| F-166 | SIM-02 canais simulados: envio_sim com status entregue/falha/recusado_sem_optin; canal_sim com contratado, forcar_falha e exige_opt_in | simulacoes.md §SIM-02 | Integrações | alta |
| F-167 | SIM-02: WhatsApp com contratado=false e opt-in exigido; falha de entrega plantada em cerca de 5% das comunicações | simulacoes.md §SIM-02 | Integrações | alta |
| F-168 | SIM-03 fontes de débito: staging debito_stg; a consolidação vincula ao contribuinte, documento inválido vai para rejeicao, cada execução grava sincronizacao | simulacoes.md §SIM-03 | Integrações | alta |
| F-169 | SIM-03: seed planta documento sobreposto entre CCF e SNE, 1 documento com DV inválido e 1 fonte com falha simulada | simulacoes.md §SIM-03 | Integrações | alta |
| F-170 | Tabelas SIM- levam rótulo "Simulado" e nenhuma chamada sai da instância; todo registro é dado fictício | simulacoes.md §Regras comuns | Integrações | alta |

### Fonte: `inputs/fio-condutor.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-171 | Fio condutor 1: F2 · critério versionado e imutável após publicação; editar cria nova versão (RF-MOD-F2-002, CT-MOD-F2-002, telas TEL-007, TEL-008) | fio-condutor.md §1 | Fio condutor | alta |
| F-172 | Fio condutor 2: F2 · grupo de controle sorteado por ciclo, fora das ações de cobrança (RF-MOD-F2-004, CT-MOD-F2-003, telas TEL-009, TEL-010) | fio-condutor.md §2 | Fio condutor | alta |
| F-173 | Fio condutor 3: F2 · fallback "sem score": sem score a segmentação usa só critérios determinísticos e marca o contribuinte (RF-MOD-F2-005, CT-MOD-F2-004, telas TEL-009, TEL-010) | fio-condutor.md §3 | Fio condutor | alta |
| F-174 | Fio condutor 4: F5 · dossiê consolidado do caso (RF-MOD-F5-003, CT-MOD-F5-003, telas TEL-024) | fio-condutor.md §4 | Fio condutor | alta |
| F-175 | Fio condutor 5: F5 · ACL "atendente vê só a própria carteira" (RF-MOD-F5-007, CT-MOD-F5-006, telas TEL-023, TEL-024) | fio-condutor.md §5 | Fio condutor | alta |

### Fonte: `inputs/de-para-ids.md`

#### Fatos atômicos

| ID | Fato (máx. precisão; pode ser citação curta) | Âncora (§ + ID da fonte / minuto) | Domínio candidato | Conf. |
|----|-----------------------------------------------|---------------------------|-------------------|-------|
| F-176 | Conversão de IDs: F<n>/RF-<nn> → RF-<n><nn> (Explore) → RF-MOD-F<n>-<nnn> (Plan); transversais RF-MOD-T-<nnn>; critérios CT-MOD-F<n>-<nnn> | de-para-ids.md §1 Regras de conversão | Rastreio | alta |
| F-177 | Itens do refinado acima da contagem do plano (F1 CT-07 a 09, F3 CT-06, F4 RF-10, F4 CT-06 e 07) não mapeados (GAP-017) | de-para-ids.md §2 Saltos de numeração | Rastreio | alta |
| F-178 | 32 critérios de aceite do plano com o RF verificado por cada um | de-para-ids.md §4 Critérios de aceite | Rastreio | alta |

### Inferências *(explicitamente não verbatim — todas as fontes)*

| ID | Inferência | Fundamento | Risco |
|----|------------|------------|-------|
| INF-001 | O atendente usa o app todo dia (fila, dossiê, interações); o coordenador usa em ciclos (publicar critério, publicar ciclo, acompanhar KPIs) | F-011, F-012, F-159 | baixo — afeta só a prioridade de usabilidade das telas |
| INF-002 | O isolamento de carteira (RN-011) precisa valer também em lista, report e exportação, não só no form, para não haver comparação entre atendentes por outro caminho | F-016, F-070, F-077, F-079 | alto — vazamento de carteira alheia contraria o plano |
| INF-003 | O sorteio do grupo de controle precisa ser reproduzível (semente registrada) para que o efeito incremental do ciclo seja auditável | F-039, F-075, F-142 | médio — sem reprodução, o efeito incremental vira número sem prova |
| INF-004 | A imutabilidade da versão publicada do critério vale também para o administrador do app; só a criação de nova versão altera parâmetros | F-032, F-037, F-141 | médio — exceção para admin quebraria a rastreabilidade do ciclo |
| INF-005 | A troca de fonte MPI → Big Data é transparente para a carteira porque a origem `mpi_bigdata` é única no v0 | F-025, F-029, GAP-015 | médio — se o Big Data trouxer outro identificador, a sobreposição muda |

#### Itens ainda não classificados (NCR)

| ID | Texto / fato | Hipótese |
|----|---------------|----------|
| — | Nenhum NCR remanescente: os itens sem domínio na primeira passada (escala do score, domínio de "instrumento") foram promovidos a fato (F-113, F-110) ou convertidos em questão (Q-03, Q-09) | — |

---

<!-- id: numbers-dates -->

## Números, datas, volumes, SLAs citados *(não perder)*

| Valor | Contexto | Fonte (ID F-xxx ou arquivo) |
|-------|----------|------------------------------|
| 5 necessidades (2 na v1, 3 parciais) | escopo do plano | F-127 |
| 5 épicos, 6 funcionalidades | escopo do plano | F-128 |
| 42 RF + 4 transversais | requisitos do plano | F-129 |
| 32 critérios de aceite | critérios do plano | F-130 |
| 5 fontes de débito | CCF, MPI/Big Data, IPVA, ITCD, SNE | F-131 |
| 5 carteiras prioritárias | parcelamentos, IPVA, ITCD, ICMS Normal, ICMS ST | F-132 |
| 3 canais na v1 + WhatsApp condicionado | réguas | F-133 |
| mai/26 | dados de cobrança começam a alimentar o modelo da UFMT | F-134 |
| 30 dias | janela de atribuição entre comunicação e regularização | F-135, F-060 |
| 5 meses (dez/26 a abr/27) | cronograma | F-136, F-154 |
| início de mar/27 | go-live | F-154 |
| 6 candidatos a corte | todos em discussão | F-138, F-158 |
| R$ 500 mil e 90 dias | exemplo de critério ICMS do CT-MOD-F2-001 | F-178 |
| mensal | ciclo de qualificação (premissa P1) | F-159 |
| 10% | grupo de controle por ciclo (premissa P3) | F-161 |
| SNE → e-mail → SMS | ordem de fallback de canal (premissa P4) | F-162 |
| 3 níveis | dossiê (premissa P5) | F-163 |
| 0 a 100 | escala do score na simulação | F-164 |
| 20% | contribuintes sem score válido no seed | F-164 |
| cerca de 5% | comunicações com falha de entrega plantada no seed | F-167 |
| 30 caracteres | limite do nome de tabela; maior nome previsto com 27 | F-097 |
| 50 / 300 / 1.000 | registros por tabela no Explore / no Plan / iterações do laço de Flow | F-103 |
| 33 telas | inventário de telas na instância | F-018 |
| 21 tabelas | modelo preliminar | F-104 a F-124 |

---

<!-- id: contradictions -->

## Contradições entre fontes

| Tema | Fonte A (ref) | Fonte B (ref) | Como resolver depois |
|------|---------------|----------------|----------------------|
| Contagem de RF e CT | plano: 42 RF e 32 CT (F-129, F-130) | refinado citado no de-para: F4 RF-10 e CT extras (F-177) | GAP-017 — o Plan segue a contagem do plano |
| Visão única do contribuinte em dois lugares | RF-105 em MOD-F1 (F-024) | RF-903 transversal (F-081) | resolvido no Explore: RF-903 tem lar em MOD-F1; o Plan mantém os dois IDs e liga RF-MOD-T-003 a RF-MOD-F1-005 |
| Origem da regularização em dois lugares | RF-407 em MOD-F4 e RF-603 em MOD-F6 (F-054, F-074) | RF-904 transversal (F-082) | resolvido no Explore: lar em MOD-F4 (marca) e MOD-F6 (apura); o Plan mantém os três IDs com a mesma regra |
| Perfis da F1 | plano: F1 para Coordenador e Atendente (F-147) | matriz: atendente só vê a visão única na F1 (F-014) | sem conflito real — o atendente acessa a F1 pela visão única da própria carteira |
| Dossiê em tela única | plano: dossiê em tela única (F-063) | Core UI entrega form com related lists (F-019) | GAP-012 — aceito como diferença registrada |

---

<!-- id: domain-candidates -->

## Domínios de negócio *(candidatos)*

| Domínio (nome de negócio) | IDs de fatos que sustentam | Lacunas |
|---------------------------|-------------------------------|---------|
| Ingestão e carteira consolidada | F-004, F-020 a F-030, F-131, F-146, F-168, F-169 | regra de sobreposição (GAP-006); cronograma MPI → Big Data (GAP-015) |
| Qualificação da carteira | F-005, F-031 a F-039, F-141, F-142, F-159 a F-161, F-171, F-172 | desempate e tamanho do grupo de controle são premissas (GAP-002, GAP-003) |
| Score de liquidez | F-006, F-040 a F-047, F-134, F-140, F-164, F-165, F-173 | contrato técnico e escala do score (GAP-008) |
| Réguas multicanal | F-007, F-048 a F-060, F-132, F-133, F-143, F-144, F-166, F-167 | fallback de canal (GAP-004); WhatsApp (GAP-009); atribuição (GAP-007) |
| Cobrança qualificada | F-008, F-061 a F-071, F-145, F-174, F-175 | capacidade por atendente (GAP-010); fonte das sinalizações coercitivas (GAP-016) |
| Monitoramento e KPIs | F-009, F-072 a F-078, F-135 | metas formais (GAP-019); fonte do tempo quase-real (GAP-011) |
| Transversais (exportação, busca, trilha) | F-010, F-079 a F-082 | — |
| Segurança e acesso | F-011 a F-016, F-091 | — |

---

<!-- id: systems-integrations -->

## Sistemas, integrações, contratos mencionados

| Nome | Papel | Protocolo / dado | Fonte (F-xxx) |
|------|-------|------------------|---------------|
| ServiceNow PDI `dev493801` (release Brazil) | hospeda o app; é o protótipo desde o Explore | instância de desenvolvedor | F-083 |
| App escopado `x_2326104_cob` | tabelas, forms, lists, reports, menu, roles, ACLs, regras e testes | Fluent / ServiceNow SDK 4.14.3 | F-084, F-085 |
| Modelo de score da UFMT | entrada de score por contribuinte e tributo | API ou arquivo, a definir; simulado em SIM-01 | F-093, F-151, F-164 |
| Canais e-mail, SMS, SNE, WhatsApp | saída de comunicações e retorno de entrega | simulado em SIM-02 | F-094, F-166 |
| CCF, MPI/Big Data, IPVA, ITCD, SNE | entrada de débitos por documento | simulado em SIM-03 | F-095, F-168 |
| Sinalizações coercitivas (CCF/SNE/SUCOM) | entrada de flag por caso | preenchido pelo seed no v0 | F-096 |
| CCF/Oracle | fonte candidata do pipeline em tempo real | a definir | F-153 |
| GitHub privado | spec, app Fluent e backlog em issues | `gh` + API REST | F-092 |

---

<!-- id: module-capacity-candidates -->

## Candidatos a módulo / capacidade *(opcional — alimenta spec-product Passo 3.0)*

| Rótulo provisório | Fatos (F-xxx) | Colisão com domínio candidato (Passo 5)? | Nota para spec-product 3.0 |
|-------------------|----------------|-------------------------------------------|-----------------------------|
| MOD-F1 Ingestão e carteira consolidada | F-004 | não | manter o código do Explore |
| MOD-F2 Qualificação e parametrização | F-005 | não | manter |
| MOD-F3 Score de liquidez | F-006 | não | manter |
| MOD-F4 Réguas multicanal | F-007 | não | manter |
| MOD-F5 Cobrança qualificada | F-008 | não | manter |
| MOD-F6 Monitoramento, KPIs e grupo de controle | F-009 | não | manter |
| MOD-T Transversais | F-010 | sim, com Segurança e acesso | manter MOD-T; a segurança fica transversal aos módulos |

---

<!-- id: actors -->

## Atores e papéis

| Ator / papel | Responsabilidade citada | Frequência de uso | Fonte (F-xxx) |
|---------------|-------------------------|-------------------|----------------|
| Coordenador de Cobrança (CPRF) | dono do produto; parametriza e publica critérios, desenha réguas, distribui casos, acompanha KPIs | por ciclo (mensal) e semanal | F-011, F-155, INF-001 |
| Atendente de Cobrança | usuário-chave; trabalha a própria fila, consulta dossiê, registra interações | diária | F-012, F-155, INF-001 |
| Administrador do app | mantém tabelas simuladas, interruptores de falha, trilha e usuários demo | sob demanda | F-013 |
| UFMT | desenvolve e recalibra o modelo de score, por convênio | a cada versão do modelo | F-047, F-134 |
| TI SEFAZ-MT | sistemas de origem (CCF, MPI/Big Data, IPVA, ITCD, SNE) | por integração | F-155 |
| SQUAD Cobrança | desenvolvimento, compartilhada com o 2.5 | contínua | F-137, F-155 |
| EloGroup | consultoria | contínua | F-155 |

---

<!-- id: pains-metrics -->

## Dores e métricas *(com rasto)*

| Dor ou métrica | Impacto citado | Fonte |
|----------------|-----------------|-------|
| Débitos espalhados em 5 fontes, sem visão única do contribuinte | abordagem duplicada ou de quem já regularizou | F-020, F-022, F-027 |
| Distribuição de casos por planilha | sem balanceamento e sem prioridade | F-061, F-068 |
| Sem medida do efeito da cobrança contra quem não foi cobrado | não se separa regularização espontânea da induzida | F-039, F-074, F-075 |
| Dependência do score da UFMT sem data | qualificação precisa rodar sem score | F-040, F-134, F-140 |
| Disparo com confirmação manual em lote | atraso entre etapas da régua | F-049, F-143 |
| Métrica: taxa de regularização da carteira cobrada menos a do grupo de controle | indicador central de efeito | F-075, F-142 |
| Métrica: regularizações por tributo, canal, instrumento e atendente contra metas formais | acompanhamento da estratégia | F-073, F-076 |

---

<!-- id: open-questions -->

## Questões em aberto *(potenciais GAPs — só depois de esgotar fontes; sem criar IDs GAP-XXX aqui)*

As questões abaixo já estão registradas no `outputs/explore/gaps.md`; nenhuma questão nova surgiu da ingestão.

| # | Pergunta | Evidência/contexto (F-xxx ou arquivo:linha) | Bloqueia próxima fase? |
|---|----------|-----------------------------------------------|--------------------------|
| Q-01 | Frequência real do ciclo de consolidação e qualificação (premissa: mensal) | F-148, F-159 · GAP-001 | não — premissa adotada |
| Q-02 | Regra de desempate e tamanho do grupo de controle (premissas: maior débito/mais antigo; 10%) | F-149, F-160, F-161 · GAP-002, GAP-003 | não — premissa adotada |
| Q-03 | Contrato técnico e escala do score da UFMT | F-151, F-164 · GAP-008 | não no v0 — simulado |
| Q-04 | Ordem de fallback de canal e janela de atribuição | F-152, F-162, F-135 · GAP-004, GAP-007 | não — premissa adotada |
| Q-05 | Níveis do dossiê e capacidade por atendente | F-153, F-163 · GAP-005, GAP-010 | não — premissa adotada |
| Q-06 | Regra de qual fonte prevalece na sobreposição | F-148 · GAP-006 | não no v0 — o seed só marca `sobreposto` |
| Q-07 | Contrato de WhatsApp | F-152 · GAP-009 | não — canal com `contratado = false` |
| Q-08 | Fonte do pipeline em tempo real e das sinalizações coercitivas | F-153, F-096 · GAP-011, GAP-016 | não no v0 — tabelas do app |
| Q-09 | Domínio de "instrumento" no critério e valores das metas | F-110, F-123 · GAP-020, GAP-019 | não |
| Q-10 | Itens do refinado acima da contagem e candidatos a corte | F-177, F-158 · GAP-017, GAP-018 | não — o Plan segue o plano |
