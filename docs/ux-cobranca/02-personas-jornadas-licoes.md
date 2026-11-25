# Cobrança SEFAZ-MT 2.6: personas, jornadas e lições dos protótipos anteriores

Insumo para o redesenho do app de cobrança em ServiceNow Core UI, com foco em UX. Consolida as specs refinadas (MT, genérica `knowledge-cob`, SE como contraste), os dois protótipos HTML anteriores e as críticas e validações com a SEFAZ-MT (17/06 e 22/06/2026).

Nomes de servidores e de membros da equipe aparecem só pelo papel. Nenhum dado de contribuinte foi copiado.

## Legenda de fontes

| Código | Arquivo |
|---|---|
| MT-V | `10-elogroup/sefaz-mt/knowledge-mt/mt-produtos/2.6-cobranca/refined/visao.md` |
| MT-REQ | `.../2.6-cobranca/refined/Requisitos/*.md` (T-ING, T-QC, T-SC, T-REG, T-CQ, T-MON) |
| MT-TC | `.../2.6-cobranca/refined/telas-comuns.md` (A1–A6 do MT) |
| PRI | `.../2.6-cobranca/PRIORIZACAO.md` (14 histórias, 5 épicos) |
| VAL | `10-elogroup/sefaz-mt/knowledge-mt/criticas/[SEFAZ-MT] Cadastro, Cobrança e Arrecadação _ Validação do Protótipo.md` (17/06, bloco cobrança) |
| R22 | `.../2.6-cobranca/Reunião com Arthur Leardini.md` (22/06, crítica tela a tela) |
| CRIT | `criticas/Critica_Prototipo_P2.6_Cobranca.md` |
| BL1 | `criticas/Backlog_Ajustes_P2.6_Cobranca.md` (BCob-01..20) |
| BL3 | `criticas/Backlog_Ajustes_v3_P2.6_Cobranca.md` (AL-*) |
| UXA | `criticas/Backlog_UX_A11y_P2.6_Cobranca.md` (UXA-01..14) |
| APR | `criticas/Aprendizados_Prototipo_Cobranca.md` |
| KC-V / KC-TC / KC-REQ | `10-elogroup/cobranca/knowledge-cob/refined/visao.md`, `telas-comuns.md` (A1–A11), `Requisitos/*.md` |
| KC-P6 | `10-elogroup/cobranca/knowledge-cob/cobranca-prototype/README.md` (protótipo hi-fi v6) |
| SE-V / SE-R | `10-elogroup/cobranca/knowledge-cob/cob-se/refined/visao.md`, `visao-requisitos-2026-08.md` |

---

## 1. Personas

O MT tem uma particularidade que muda o desenho: **a cobrança qualificada é conduzida pelo próprio coordenador, sem equipe**. Poucos casos, de valor muito alto, que podem subir ao chefe ou ao secretário. Os atendentes fazem a **cobrança ativa** (lista de ligações), que é massificada por natureza (VAL; CRIT §1, §7). A spec MT-V ainda descreve o atendente como "servidor da equipe de cobrança qualificada"; a validação corrigiu isso.

### P1. Coordenador de cobrança (SEFAZ-MT, CPRF)

| Atributo | Conteúdo |
|---|---|
| Papel | Define a estratégia, parametriza a seleção da carteira e as réguas, distribui a equipe, presta contas. No MT também conduz pessoalmente a cobrança qualificada (Kanban de poucos grandes devedores). |
| Objetivo | Recuperar crédito com cobrança auditável e mensurável; saber o que funcionou em cada cobrança para decidir diferente no ciclo seguinte. |
| Frequência | Diária (Analytics, réguas, casos qualificados); ciclo/mensal para critérios, metas e prestação de contas. |
| O que olha primeiro | Um único Analytics: funil do crédito, regularizado × meta (incl. IPVA/ITCD), efeito incremental vs. grupo de controle, produtividade da equipe; depois as réguas ativas e o Kanban qualificado. |
| Dores | Seleção da carteira por conhecimento tácito; distribuição por planilha/Drive; KPIs por extração manual; confirmações manuais em lote; grupo de controle por sorteio manual (MT-V). Irritação explícita com informação fragmentada: "quero entrar num lugar e ver todas as informações" (VAL). |
| Decisões | Quais critérios compõem a seleção (conjunto curado, nomeado, versionado); quais réguas ativar/editar e com que canais; quem entra na qualificada e qual abordagem; metas por tributo; % do grupo de controle; reatribuição de carga; escalar caso ao chefe/secretário. |
| Nível técnico | Alto no domínio tributário, médio em sistema. Não valida segmentação manualmente ("o algoritmo segmenta e acabou", VAL). Não gosta de gestão à vista (ranking de atendentes exposto a todos) (VAL; CRIT §8). |

### P2. Atendente de cobrança ativa

| Atributo | Conteúdo |
|---|---|
| Papel | Servidor que recebe a lista de cobrança ativa gerada pela massificada e liga para os contribuintes. |
| Objetivo | Trabalhar a lista do dia: ligar, registrar o resultado, agendar retorno, sem abordar quem já regularizou. |
| Frequência | Diária, uso contínuo, muitos registros por sessão. |
| O que olha primeiro | Sua lista (só a dele), com **telefone visível** e status liguei/não liguei; o que já foi enviado pela régua a esse contribuinte (R22; BL3 AL-E2/E3). |
| Dores | Montar contexto em vários sistemas (CCF, SNE, SUCOM); status de regularização só em "foto mensal"; histórico de interações disperso (MT-V); contato-chave da empresa inexistente no cadastro (VAL). |
| Decisões | Ordem de ligação; resultado do contato; follow-up; registrar contato-chave. |
| Nível técnico | Operacional. Precisa de fluxo curto, teclado, poucas colunas. Vê apenas a própria carteira e a própria produtividade (RN-11, MT-V). |

### P3. Administrador da plataforma (TI / parametrização técnica)

| Atributo | Conteúdo |
|---|---|
| Papel | Mantém integrações (CCF, MPI→Big Data, IPVA, ITCD, SNE/DT-e, score UFMT), ingestões curadas (planilha atendente × contador, lista de contumazes), perfis e parâmetros estruturais. |
| Objetivo | Carga diária íntegra, sem degradar a operação. |
| Frequência | Eventual; diária só em falha de fonte. |
| O que olha primeiro | Tabela única de fontes com última sync, volume e status; detalhe da fonte em modal (R22; BL3 AL-C2/C3). |
| Dores | Cargas sem batimento, base legada suja, parâmetros embutidos em código (SE-V, persona 3). |
| Decisões | Reprocessar fonte; tratar rejeições (CPF/CNPJ inválido); ajustar datas de referência e matriz canal × aceite. |
| Nível técnico | Alto. No MT pode ser o próprio coordenador para itens de "Configurações" (critérios, datas & canais). |

### P4. Gestão superior (chefia / secretário) — leitura

| Atributo | Conteúdo |
|---|---|
| Papel | Recebe escalonamento de casos qualificados e o reporte de resultado. |
| Objetivo | Ver crédito recuperado atribuível à cobrança (NSM, MT-V) e decidir sobre grandes devedores. |
| Frequência | Mensal / sob demanda. |
| O que olha primeiro | Número-herói (recuperado incremental) e o dossiê exportado do caso escalado. |
| Decisões | Abordagem institucional em caso de grande valor. |
| Fonte | VAL ("leva para o secretário"); KC-V (gestor reporta à diretoria); SE-V JTBD-09 (painel executivo de grandes contribuintes). |

Fora do escopo de tela no MT: **contribuinte** (recebe a régua, regulariza em canais próprios) e **UFMT** (produz o score; o produto só consome) (MT-V, personas 3 e 4).

### Contraste com a referência genérica e com SE

| Ponto | MT (2.6) | Genérico (`knowledge-cob`) | SE (SRC) |
|---|---|---|---|
| Quem faz a qualificada | Coordenador, sem equipe, poucos casos | Analista/cobrador, por atribuição | Auditor fiscal; é a persona de maior volume |
| Quem liga | Atendentes (ativa, distribuída) | Cobrador (lista de cobrança ativa) | Régua digital + auditor |
| Personas extras | — | Procurador PGE, Auditor de conformidade | Administrador TI, Contribuinte (portal) |
| Priorização | Regras determinísticas; score UFMT só em H2 | Rating A/B/C/D + VER (ML ou regras) | Score bidimensional enxuto, quadrantes |
| "Tempo real" | Atualização intraciclo (diária assumida) | p95 por tela | D-1 (SE-R 5.1) |
| Filtros booleanos e Lista/Kanban | Pedido explícito | — | Tratados como nativos da plataforma, esforço quase nulo (SE-R 5.2) |
| Canal informal | Só ciência ("verifique seu DT-e"), sem débito (RN-13) | Mascaramento (RNF-T-LGPD-02) | Nunca valor nem meio de pagamento, só link (SE-R 2.2) |

---

## 2. Jornadas principais

Cada passo: **tela/ação** → o que acontece. "Atrito anterior" registra o que os protótipos v0–v3 fizeram e foi criticado.

### J1. Carga diária e saúde das fontes (P3, P1)

Gatilho: rotina diária de ingestão; uma fonte falha.

1. **Configurações › Integrações**: tabela única de fontes (sistema, curadas e derivadas juntas), com última sync, volume e status; falha sinalizada na linha.
2. **Clique na fonte** → modal de detalhe com log de rejeições.
3. **Reprocessar** → status volta a OK; operação segue degradada só naquela fonte (RNF-T-DISP-01).
4. Fontes curadas: planilha atendente × contador (alimenta distribuição) e lista de contumazes do coordenador (reusada na seleção, na lista e no dossiê); score UFMT aparece como fonte ingerida.

Resultado: carteira consolidada atualizada.
Atrito anterior: boxes de KPI (sincronizadas, rejeitados) acima da tabela; fontes curadas em tabela separada; cards de "parcelamento em atraso" e "fila ativa" fora de lugar; linha MPI duplicada; Integrações no grupo operacional e não em Configurações; botão de sync no topo que não sincronizava (R22; BL3 AL-B1, AL-C1..C7, AL-N5).

### J2. Consultar a carteira e um contribuinte (P1, P2)

Gatilho: dúvida sobre um contribuinte ou recorte da carteira.

1. **Carteira**: alternar o grão **contribuinte × crédito** (um contribuinte pode ter vários créditos).
2. Filtrar por tributo, instrumento (auto de infração, EFD, notificação de lançamento), parcelamento em atraso; busca única.
3. **Clique na linha** → painel lateral com todos os campos do registro, em abas: débitos, parcelamentos (parcelas atrasadas, tempo para prescrição), comunicações enviadas, histórico de cobranças com taxa de sucesso.
4. Exportar o recorte.

Resultado: contexto completo sem perder a lista.
Atrito anterior: clique trocava de tela; "Visão do Contribuinte" era item de menu próprio e se confundia com o dossiê; tag estranha no título; exportar sem função; filtros e busca pouco intuitivos; coluna de comunicações com "D−/D+" redundante com canal + data (R22; VAL; BL3 AL-D1..D5).

### J3. Definir a seleção da carteira (P1)

Gatilho: novo ciclo ou mudança de estratégia.

1. **Configurações › Critérios de seleção**: marcar um **conjunto** de critérios de uma lista curada (valor, tributo, atraso, instrumento, contumaz) e nomear a seleção.
2. Blocos separados: critério de **qualificação** × critério de **segmentação**; % do grupo de controle.
3. **Publicar versão** com fundamentação obrigatória (versão imutável, RNF-T-AUD-02); edição gera nova versão.
4. O resultado aparece como **aba de leitura no Analytics** (prévia da classificação, contagens por segmento, versões anteriores navegáveis). Sem etapa de confirmação.

Resultado: massificada vai para a régua; qualificada vai para o Kanban do coordenador.
Atrito anterior: "threshold de score" como porta de decisão (score UFMT ainda inexistente); etapa "Confirmar segmentação"; um único critério em vez de conjunto; "alvo de carteira" confuso; prévia como tela isolada; "Confirmar publicação" não validava a fundamentação (VAL; CRIT §4; BL1 BCob-02/03/05/17; UXA-12).

### J4. Desenhar, ativar e acompanhar uma régua massificada (P1)

Gatilho: nova régua para um dos 5 segmentos (Parcelamentos, IPVA, ITCD, ICMS Normal, ICMS-ST) ou ajuste após resultado.

1. **Réguas de Cobrança**: lista das réguas com poucos KPIs (ativas, em execução, retorno).
2. **Clique na régua** → detalhe com linha do tempo das etapas (D−5, D−2, D0 = vencimento/rompimento, D+n) e, no mesmo registro, comunicações e execução.
3. **Editar etapa** em modal: canal, offset, template. Campos travados não editáveis; template pré-dívida-ativa só de ciência do DT-e, sem valor nem débito (RN-13).
4. Canal valida aceite (matriz canal × aceite; WhatsApp exige opt-in).
5. Data de referência opcional (dia do ICMS, cota do IPVA) vem de Configurações.
6. **Ativar / pausar**; editar ativa gera nova versão.
7. Acompanhar execução filtrando por régua, canal e status; reenviar falhas.
8. Histórico de versões com taxa de sucesso para comparar cobranças.

Resultado: comunicações saem sem confirmação manual; regularização marcada com origem.
Atrito anterior: editor e execução como dois itens de menu; botão "Simular" sem comportamento definido; editor de etapa inline que "estica"; dúvida edição × nova versão; regra de sigilo ausente dos templates (VAL; R22; BL1 BCob-04/08/09/10/14/15; BL3 AL-F1..F3).

### J5. Trabalhar a lista de ligações (P2)

Gatilho: início do expediente; lista distribuída automaticamente.

1. **Minha lista** (landing do atendente): só os casos dele, ordenados por regra (valor, tempo para prescrição, instrumento, contumácia), **telefone em destaque**, status liguei/não liguei.
2. **Clique na linha** → painel lateral do contato: comunicações já enviadas pela régua, histórico de interações, contato-chave.
3. **Ligar** → **Registrar interação** (resultado estruturado + anotação obrigatória) e **agendar follow-up** no mesmo painel.
4. Status atualiza; quem regularizou no ciclo sai da lista (atualização intraciclo).

Resultado: lista trabalhada, interação auditada.
Atrito anterior: faixa de KPIs no topo; clique levava ao dossiê da qualificada; "Minha Fila" sem deixar claro que é cobrança ativa; registrar interação e follow-up morando no dossiê; "Salvar interação" aceitava anotação vazia (R22; VAL; BL1 BCob-07/19; BL3 AL-E1..E5; UXA-13).

### J6. Conduzir um caso qualificado (P1, P4)

Gatilho: contribuinte de grande valor entra pela seleção.

1. **Casos qualificados** em Kanban metodológico: Em seleção → Selecionado → Dossiê gerado → Condução → Desfecho.
2. **Clique no card** → dossiê (débitos, parcelamentos, comunicações, grupo econômico, sinalizações coercitivas).
3. Card mostra prioridade de contato e tipo de abordagem sugeridos por regra (valor do débito); litigioso marcado como não-acionável automático.
4. **Exportar dossiê** (portal CI) para escalar a chefe/secretário.
5. Mover o card até Desfecho; parcelamento originado da qualificada fica com flag de origem para acompanhamento.

Resultado: poucos casos, com ritmo próprio ("deixar o processo respirar", VAL).
Atrito anterior: Kanban fraco ou inexistente; card abria "ligação"; ações da ativa (registrar interação/follow-up) misturadas no dossiê; nomenclatura ativa × qualificada confusa para o próprio time (VAL; R22; CRIT §7; BL1 BCob-06/20; BL3 AL-G1..G4).

### J7. Prestar contas e ajustar a estratégia (P1, P4; P2 na visão individual)

Gatilho: rito periódico ou dúvida de efetividade.

1. **Analytics** (uma área só): funil identificado → notificado → regularizado → a regularizar; incremental vs. grupo de controle; metas por tributo (IPVA, ITCD).
2. Visão por perfil: coordenador vê o todo e a **produtividade por atendente**; atendente vê só o seu, sem comparação.
3. Abas no mesmo lugar: Regularizações & origem, prévia da classificação, score de liquidez (H2), efetividade por régua.
4. Alternar período: desde o início, anual, semana × semana, mês × mês.
5. Voltar à régua ou aos critérios para ajustar.

Resultado: decisão com dado, sem extração manual.
Atrito anterior: Painel, Regularizações, Score e Prévia como telas separadas; toggle coordenador/atendente sem efeito; excesso de cards e pouco gráfico; regularização por atendente exposta a todos (R22; VAL; BL1 BCob-16/17; BL3 AL-H1..H5).

### J8. Distribuir a carteira ativa (P1)

Gatilho: nova lista gerada pela massificada ou entrada/saída de atendente.

1. Planilha atendente × contador já ingerida (J1).
2. **Distribuição automática** equilibrada (RN-07).
3. Ver carga por atendente; reatribuir manualmente.

Resultado: lista de cada atendente pronta para J5.
Atrito anterior: distribuição como "config. distribuição" escondida na fila; sem visão de carga (PRI US06; BL1 BCob-07b; MT-REQ T-CQ-01).

---

## 3. Lições dos protótipos e validações anteriores

### Navegação e arquitetura

| # | Lição | Fonte |
|---|---|---|
| L1 | Menu por área de trabalho, não um item por tela. Pedido: "menos telas no menu", subtelas como navegação interna. Resultado v3: 6 grupos, 8 itens (de ~13). | R22; BL3 AL-N1; APR §3 |
| L2 | O que é configuração fica em Configurações; o que é operação fica fora. Integrações foi para Configurações; Editor de régua saiu de lá para a área de cobrança; Score saiu para Analytics. | R22; BL3 AL-B1..B3; UXA-11 |
| L3 | Detalhe abre em painel lateral sobre a lista, sem trocar de tela. Vale para carteira, lista de ligações e qualquer master-detail. | R22; BL3 AL-D2; APR §3; KC-P6 |
| L4 | Analytics é um lugar só. Prévia, regularizações, score e KPIs viram abas da mesma área. | VAL; R22; BL1 BCob-17; BL3 AL-H1 |
| L5 | Uma régua = um registro com editor, execução e comunicações dentro dele; um único item de menu. | R22; BL3 AL-F1..F3 |
| L6 | Visão do contribuinte é o detalhe da carteira, separada do dossiê da qualificada. | R22; BL3 AL-D5 |
| L7 | Modal dentro de modal quebra foco; editor de régua ficou como tela alcançada por clique e o editor de etapa como modal. | BL3 (nota AL-F2); APR §7 |

### Conceitos e nomenclatura

| # | Lição | Fonte |
|---|---|---|
| L8 | Três conceitos com nomes e telas distintos: **Régua** (parametrização/cadência, "tudo vai pra régua"), **Cobrança ativa** (lista de ligações distribuída entre atendentes), **Cobrança qualificada** (Kanban metodológico do coordenador). Misturar ativa e qualificada foi o maior risco de leitura. | VAL; CRIT §1; BL1 BCob-01 |
| L9 | Clique na lista ativa mostra ligação/comunicações; clique no card qualificado mostra dossiê. Nunca o contrário. | R22; BL3 AL-E3, AL-G2 |
| L10 | Carteira é a total (massificada + qualificada), em grão contribuinte ou crédito. | VAL; R22; BL1 BCob-13 |

### Densidade e conteúdo ("parece slide, não sistema")

| # | Lição | Fonte |
|---|---|---|
| L11 | Sem subtítulo narrando a tela, sem banner de ensino, sem regra (RN/RNF) escrita como frase. Tela abre com dado. Regra vira chip ou tooltip. | R22; BL3 AL-N3/N4; UXA-09/10; APR §3 |
| L12 | Sem faixa de KPIs genérica no topo de tela operacional (integrações, lista de ligações). KPIs só onde ajudam a decidir (lista de réguas, Analytics). | R22; BL3 AL-C1, AL-E1, AL-F1 |
| L13 | Mais gráfico, menos card no Analytics. Dashboards lideram com a exceção e os dois números que a provam. | R22; BL3 AL-H2; KC-P6 |
| L14 | Tabelas centralizadas e padronizadas; até 5 colunas na lista, o resto no painel lateral. | VAL; KC-P6 |
| L15 | Coluna sem significado claro sai ou ganha rótulo ("D−/D+" quando já há canal e data). | VAL; CRIT §3 |

### Botões e ações honestas

| # | Lição | Fonte |
|---|---|---|
| L16 | Nada que promete e não cumpre: sino sem notificações, sync que não sincroniza, exportar sem função, FAB "13 telas", botão "Simular" sem regra. Remover ou fazer funcionar. | R22; VAL; BL1 BCob-04; BL3 AL-N2/N5; APR §3 |
| L17 | Nenhuma confirmação manual onde a regra é automática: sem "Confirmar segmentação", disparo da régua sem confirmação em lote. | VAL; BL1 BCob-03; MT-V |
| L18 | Ação auditável exige justificativa de fato: publicação de critério, registro de interação. Validação bloqueia vazio. | UXA-12/13; APR §5 |
| L19 | Desabilitado é atributo real, não classe visual (teclado ainda disparava). | APR §5 |

### Inteligência artificial

| # | Lição | Fonte |
|---|---|---|
| L20 | Postura conservadora: sem gate de score; score UFMT é variável opcional com fallback determinístico e painel H2; assistente IA fora da v1. Priorização por regras (valor, tempo para prescrição, instrumento, contumácia). | VAL; CRIT §2; BL1 BCob-02 |
| L21 | Produto "pronto" mais ambicioso foi descartado ("muita viagem ainda"); seguir o desenho validado. | VAL; CRIT §9 |

### Visibilidade e conformidade

| # | Lição | Fonte |
|---|---|---|
| L22 | Coordenador vê o todo; atendente vê o seu. Sem gestão à vista de regularização por atendente. | VAL; MT-V RN-11; BL1 BCob-16 |
| L23 | Canal informal (WhatsApp/SMS/e-mail) só de ciência ("verifique seu DT-e"), sem valor nem débito, antes da dívida ativa. Matriz canal × aceite; WhatsApp exige opt-in. | VAL; MT-V RN-13; BL1 BCob-08/09 |

### Acessibilidade

| # | Lição | Fonte |
|---|---|---|
| L24 | Contraste de texto secundário ≥ 4,5:1 (o cinza original tinha ~2:1). | UXA-01 |
| L25 | Modal com `role=dialog`, foco entra, trap de Tab, Esc fecha, foco volta ao gatilho. | UXA-02/03 |
| L26 | Abas e linhas clicáveis operáveis por teclado (setas, Enter/Espaço). | UXA-04; APR §4 |
| L27 | Ícone só-ícone com rótulo acessível; skip link; foco no título ao trocar de tela; `prefers-reduced-motion`. | UXA-05/06/07 |
| L28 | Menu lateral não some em tela estreita: vira gaveta. | UXA-08 |
| L29 | Não há RNF de acessibilidade na spec; recomendado registrar WCAG 2.2 AA como transversal. | UXA (fora da rodada) |

### Processo

| # | Lição | Fonte |
|---|---|---|
| L30 | Correção na camada compartilhada (shell, estilos, comportamento de modal) propaga a todas as telas. | APR §1, §4 |
| L31 | Transcrição → backlog MECE com ID → execução → revisão de cobertura separada → reprocesso. Registrar o que ficou mock ou fora. | APR §6 |
| L32 | Dados consistentes entre telas (sem valores aleatórios). | APR §7 |

---

## 4. Arquitetura de informação sugerida

Os materiais convergem para agrupar por **área de trabalho e persona**, não por tabela ou entidade. Três referências:

- **MT v3 (validado com a SEFAZ-MT, 22/06):** Carteira · Cobrança Ativa · Cobrança Massificada · Cobrança Qualificada · Analytics · Configurações (BL3).
- **Genérico v6:** 4 módulos (Massificada, Qualificada, Analytics, Parametrizações), nav e landing dirigidos por persona, command palette, drawers (KC-P6).
- **SE:** funcionalidades por perfil (gestor, auditor, administrador); Lista/Kanban e filtros booleanos como recurso nativo da plataforma (SE-R 5.2).

### Estrutura proposta (6 áreas)

| Área | Conteúdo | Persona principal | Arquétipo (KC-TC / MT-TC) |
|---|---|---|---|
| **Minha lista** (cobrança ativa) | Lista do atendente com telefone e status; painel lateral de contato; registrar interação, follow-up, contato-chave | P2 (landing) | A2 + A4 em painel |
| **Réguas** (cobrança massificada) | Lista de réguas → registro da régua (etapas na linha do tempo, execução, comunicações, versões com taxa de sucesso); etapa em modal | P1 | A3 catálogo / A2 + A5 + A6 |
| **Casos qualificados** | Kanban metodológico; card → dossiê; exportar dossiê | P1 | A10 dossiê + Kanban |
| **Carteira** | Lista contribuinte × crédito; painel lateral 360 somente leitura | P1, P2 | A2 + A4 |
| **Analytics** | Funil, incremental vs. controle, metas, produtividade; abas: regularizações & origem, classificação, efetividade por régua, score (H2) | P1 (landing), P4; P2 na visão individual | A1 |
| **Configurações** | Integrações (fontes + ingestões curadas), critérios de seleção (versionados), datas de referência, canais × aceite, distribuição / atendentes, metas e grupo de controle | P1, P3 | A6 + A5/A3 formulário |

Regras de agrupamento que os materiais sustentam:

- Uma entidade pode aparecer em várias áreas, mas cada **tarefa** tem uma casa só (o contribuinte aparece na carteira, na lista e no dossiê; registrar interação existe só na ativa).
- Subtelas (editor, prévia, detalhe de fonte, detalhe do contribuinte) não entram no menu. São alcançadas por clique, aba, painel lateral ou modal.
- Landing e itens visíveis mudam por perfil: atendente não vê Configurações nem Analytics comparativo.
- Ordem do menu segue o uso diário, não a cadeia de valor da spec. A cadeia de valor (Identificação → Qualificação → Massificada → Qualificada → Monitoramento, PRI) organiza a spec. O menu v0 seguiu essa ordem e foi reorganizado na v3.

---

## 5. Implicações para o redesenho em ServiceNow Core UI

1. **Menu da aplicação com 6 seções e poucos módulos.** As áreas da §4 viram separadores no application menu. Cada módulo abre uma lista filtrada ou um dashboard, nunca uma tabela crua do modelo. Tabelas técnicas (staging, log de integração, de-para) ficam sem módulo ou só para o papel admin.
2. **Módulos por papel.** Atendente vê "Minha lista" (filtro `atribuído a = eu`) como primeiro módulo e homepage. Coordenador cai no dashboard de Analytics. ACLs e roles garantem a visão individual (RN-11), não só a ocultação do menu.
3. **Listas com até 5 colunas e filtros salvos.** Uma list view por papel e contexto: lista de ligações com telefone e status de contato na frente; carteira com grão contribuinte e grão crédito como dois módulos ou dois filtros salvos da mesma lista. Filtros rápidos por tributo, instrumento e status no lugar de construtor de condição livre.
4. **Detalhe sem perder a lista.** Usar a pré-visualização de registro (ícone de referência / hover) e form views enxutas, com seções e related lists como abas: débitos, parcelamentos, comunicações, interações, histórico de cobranças. O form do contribuinte é somente leitura na carteira; o form do contato na ativa concentra as ações.
5. **Form view diferente para cada tarefa sobre a mesma tabela.** "Contato" (ativa) e "Dossiê" (qualificada) são views distintas, sem misturar ações. A regra: clique na lista ativa abre ligação; card qualificado abre dossiê.
6. **Kanban para a qualificada.** Board com colunas pelo campo de etapa (Em seleção → Selecionado → Dossiê → Condução → Desfecho). O card mostra valor, prioridade e abordagem sugeridas e o selo de litigioso. O cartão abre o form view Dossiê.
7. **Régua como registro-pai.** A régua é o form principal, com related lists de etapas (ordenadas por offset), comunicações e execuções e versões. A etapa é editada em modal (GlideModal/UI page) com campos travados por UI policy. Um único módulo "Réguas". Editar régua ativa gera nova versão via UI action.
8. **UI actions só quando funcionam.** Nada de Simular, Sincronizar, Confirmar segmentação ou Exportar sem implementação. Cada botão do form tem efeito e condição de exibição. Os demais saem.
9. **Justificativa obrigatória em ação auditável.** Publicar critério, registrar interação, encerrar caso e reatribuir carga validam o campo por UI policy ou client script e gravam na trilha (RN-10). O botão fica desabilitado de fato até o campo ser preenchido.
10. **Sem texto explicativo nos forms.** Nada de annotations de ensino nem cabeçalho narrativo. Regra de negócio vira field message, ícone de informação ou choice label. O form abre com os campos que decidem a ação.
11. **Analytics num único dashboard com abas.** Funil, incremental vs. controle, metas IPVA/ITCD, produtividade (só coordenador) e efetividade por régua. Regularizações & origem e classificação entram como abas ou relatórios do mesmo dashboard. Seletor de período (ciclo, ano, semana × semana, mês × mês). Mais gráfico, menos tile.
12. **Configurações agrupa parâmetros.** Fontes de integração numa lista única, com detalhe em form ou modal. Critérios de seleção versionados com fundamentação. Datas de referência ICMS/IPVA. Matriz canal × aceite. Distribuição e atendentes. Metas e grupo de controle. Nenhum bloco de configuração dentro das telas operacionais.
13. **Sigilo na própria ferramenta de template.** O template de etapa em canal informal bloqueia campos de valor, tributo, período e processo antes da dívida ativa (RN-13). O texto padrão é de ciência do DT-e.
14. **Score como campo opcional.** O campo de score existe no contribuinte e no critério, vazio por padrão. Nenhuma lista ou filtro depende dele; priorização por regra determinística. O painel do score é aba H2 do Analytics.
15. **Acessibilidade como critério de aceite.** WCAG 2.2 AA registrado como requisito transversal: contraste ≥ 4,5:1 em customizações de tema, rótulo em todo botão só-ícone, modais customizados com foco, trap e Esc, e Kanban e listas operáveis por teclado. Verificar cada UI page/macro customizada, já que componentes nativos não cobrem conteúdo HTML próprio.
