# 03 · Auditoria de UX do app atual (Cobrança MT, SEFAZ-MT 2.6)

Data: 2026-11-24 · Escopo `x_2326104_cob` · Core UI clássica (UI16, tema Polaris) · instância `dev493801`

Fontes lidas (só leitura):

- branch `feat/v0` do worktree `speckit-servicenow/.claude/worktrees/v0`: `app/src/fluent/navigation/menu.now.ts`, `app/src/fluent/ui/*.now.ts`, `ui-actions/`, `ui-policies/`, `security/`, `tables/`, `outputs/spec/screens-manifest.json`, os 33 prints `outputs/spec/screens/TEL-0NN.png` (vistos: 001, 004, 008, 009, 014, 021, 023, 024, 025, 026, 031), `outputs/explore/especificacao-funcional.md`, `outputs/spec/flow-map.md`, `outputs/explore/gaps.md`;
- instância, por consulta GET na Table API (sem escrita): `sys_app_module`, `sys_ui_action`, `sys_ui_related_list`, `sys_ui_policy`, `sys_script_client`, `sysevent_email_action`, `sys_process_flow`, `sys_ui_page`, `sys_ui_view`, `sysrule_view`, `sys_report`, `sys_properties`, `sys_user_has_role`;
- guias do SDK em `/tmp/sdkpkg/package/docs/guides/` e o catálogo `referencias/32-servicenow-boas-praticas-oficiais.md`.

---

## 1. Diagnóstico

### 1.1 O que está instalado (contagem na instância)

| Peça de UX | Especificado (`especificacao-funcional.md` §2) | Na instância |
|---|---|---|
| Tabelas do app | 21 | 21 |
| Módulos no menu | "um módulo de navegação por MOD-F1 a MOD-F6, mais Administração" | 21, um por tabela, todos `List of Records`, sem filtro, sem view, sem separador |
| Papéis por módulo | por matriz de acesso | os 21 módulos liberados para coordenador, atendente e admin |
| UI Actions | 12 (Exportar, Publicar versão, Criar nova versão, Gerar prévia, Publicar ciclo, Ativar, Desativar, Reenviar, Distribuir, Registrar interação, Encerrar caso…) | 3 (Publicar versão, Criar nova versão, Publicar ciclo) |
| Related lists configuradas | TEL-004, 008, 009, 014, 024 | 1 conjunto (view "Dossiê do caso") |
| Views | `visao_unica`, `minha_fila`, `dossie`, `efeito_incremental` | 2 (`x_2326104_cob_tel_023` "Minha fila", `x_2326104_cob_dossie`); nenhum módulo aponta para elas |
| Reports | 7 | 7, nenhum ligado ao menu |
| UI Policies | — | 2 |
| Client Scripts | — | 0 |
| Process flow (`sys_process_flow`) | — | 0 |
| Notificações (`sysevent_email_action`) | — | 0 |
| UI Pages / dashboard / homepage do app | — | 0 |
| Página de entrada | — | `glide.login.home` = página padrão da PDI (`dev.ba_hero_banner_aus.pdi_home`); nenhum usuário demo tem home própria |

O gerador (`sn-scaffold`) produz um módulo `LIST` por tabela e um form/list por `TEL-`. O menu é o modelo de dados.

### 1.2 Achados

Cada achado traz heurística de Nielsen (H1–H10) e, quando cabe, lei de UX.

| # | Achado | Tela | Evidência | Heurística / lei |
|---|---|---|---|---|
| A01 | **Menu = lista de tabelas.** 21 módulos em ordem de tabela (Contribuinte, Débito, Parcelamento, Execução de sincronização, Rejeição de registro, Staging…). Não há agrupamento por área (separador), nem verbo, nem tarefa. | todas | `menu.now.ts`; `sys_app_module` (21 linhas, `filter` vazio, `view_name` vazio) | H2 (linguagem do sistema, não do usuário), H8; Lei de Hick (21 opções planas), Miller/chunking |
| A02 | **Mesmo menu para as três personas.** Os 21 módulos têm `roles: [coordenador, atendente, admin]`. O atendente vê "Staging de fontes (Simulado)", "Canal de envio (Simulado)", "Critério de qualificação", "Meta de KPI", "Exportação" no menu, embora a matriz de acesso (§1.2) não lhe dê essas telas. | menu | `menu.now.ts`, campo `roles` de cada `Record` | H8 (ruído), H5 (convida a erro de acesso) |
| A03 | **Sem ponto de partida.** Ao logar, todos caem na página-banner padrão da PDI. Nada do app aparece até abrir o navegador "All" e achar "Cobrança MT". | entrada | `glide.login.home`; `sys_ui_page` do escopo = 0 | H1, H6 (reconhecer em vez de lembrar); Lei de Jakob (outros apps ServiceNow abrem em "Atribuídos a mim"/lista de trabalho) |
| A04 | **"Minha fila" existe como view mas não como módulo.** A view `x_2326104_cob_tel_023` foi instalada; o módulo "Caso de cobrança qualificada" abre a lista padrão, sem `atendente = eu`, sem excluir encerrados, sem ordenar por prioridade. O print TEL-023 mostra 51 linhas, as mesmas da TEL-021 (que inclui casos do "Demo Atendente B"), em ordem aleatória de prioridade (580, 450, 105, 774…) e com encerrados misturados. | TEL-023, TEL-021 | `TEL-023.now.ts`; `sys_app_module` "Caso de cobrança qualificada" sem `filter`; prints | H1 (não mostra "o que é meu e o que falta"), H7; Zeigarnik (tarefas pendentes não ficam visíveis) |
| A05 | **Telas = CRUD do registro.** Os forms são todos os campos da tabela em duas colunas + Activities. Não há resumo, estado em destaque nem próxima ação. O dossiê (TEL-024) mostra Contribuinte, Atendente, Ciclo, Estágio, Prioridade, Score lado a lado com Motivo de encerramento e Encerrado em. | TEL-004, 008, 009, 014, 024, 025 | `TEL-0NN.now.ts` (seções geradas), prints | H8, H6; Lei da Proximidade/Região comum (campos sem agrupamento por propósito) |
| A06 | **Sem verbos de negócio no caso.** Especificados "Registrar interação" e "Encerrar caso" na TEL-024; a instância não tem nenhuma UI Action na tabela `caso`. Registrar interação exige achar a related list Interações e clicar em New; encerrar exige editar Estágio, Motivo e Encerrado em à mão. | TEL-024, TEL-025 | `sys_ui_action` (3 linhas, nenhuma em `caso`); spec §2 "Related lists e seções" | H3, H7, H5; Lei de Tesler (complexidade empurrada ao usuário) |
| A07 | **Ciclo sem "Gerar prévia".** O ciclo nasce por New com todos os campos calculados abertos (Elegíveis, Massificada, Qualificada, Grupo de controle, Taxas, Efeito incremental). Só "Publicar ciclo" existe, e só aparece no estado Prévia. | TEL-009 | `ui-actions/ciclo.now.ts`; `TEL-009.now.ts`; spec lista "Gerar prévia · Publicar ciclo" | H5 (campos de sistema editáveis), H1 |
| A08 | **Estado não guia a tela.** Estágio do caso (5 valores), estado do ciclo (3), estado do critério são `ChoiceColumn` comuns: sem process flow, sem modelo de estados, sem UI Policy por estado (exceto threshold do score). O usuário não vê em que etapa está nem o que destrava a seguinte. | TEL-008, 009, 024 | `tables/caso.now.ts` (`estagio`), `tables/ciclo.now.ts` (`estado`); `sys_process_flow` = 0 | H1; Goal-gradient (sem sinal de progresso) |
| A09 | **Related lists especificadas não foram montadas.** Editor de régua sem lista de Etapas (para editar etapas é preciso ir ao módulo "Etapa da régua"); ciclo sem Carteira segmentada (é preciso ir a "Carteira segmentada" e filtrar pelo ciclo); Visão única do contribuinte sem Débitos, Parcelamentos, Comunicações, Consentimentos. | TEL-004, 009, 014 | `sys_ui_related_list` = 1 (só dossiê); prints TEL-004, 009, 014 terminam em Activities | H6, H7; Lei de Tesler |
| A10 | **Dossiê em 3 níveis não aparece no print.** A view `x_2326104_cob_dossie` e a View Rule estão instaladas, mas o print TEL-024 mostra o layout da view padrão (sem seções Caso/Score/Sinalizações e sem as 5 listas). | TEL-024 | `ui/caso-dossie-niveis.now.ts`; `sysrule_view` ativo; print TEL-024 | H1 (o que foi entregue não é o que o usuário vê) |
| A11 | **Indicadores sem caminho.** Os 7 reports (Funil, Regularizações por tributo, por origem e canal, Efetividade da régua, Carga por atendente, Painel do score, Meus indicadores) não estão no menu. O atendente não chega a "Meus indicadores" pela navegação. Cada report é um gráfico de barras isolado, sem meta, com rótulo técnico ("Regularização Count", "Carteira segmentada Count") e o banner "Security constraints prevent saving reports". | TEL-011, 016, 022, 026, 027, 028, 031 | `sys_report` (7, todos `Vertical bar`); `sys_app_module` sem `REPORT`; prints TEL-026, 031 | H1, H6, H8 |
| A12 | **"Meus indicadores" agrupa pelo eixo errado.** A spec pede regularizações do atendente "por canal"; o print agrupa por tributo (IPVA, ICMS Normal, ICMS ST, ITCD). | TEL-031 | `flow-map.md` ETP-037; spec §2 TEL-031; print | H2 |
| A13 | **Interface meio em inglês e com formatos fora do padrão BR.** "Search", "All", "Actions on selected rows…", "Activities", "Field changes", "true/false" nas colunas booleanas, moeda "$ 65.900,58" com ícone de globo, plural automático "Caso de cobrança qualificadas". | TEL-001, 021, 023, 024, 026 | prints | H4 (consistência), H2 |
| A14 | **Sinal crítico sem destaque.** "Sinalização coercitiva ativa" e "Sem score" aparecem como texto `true/false` na lista, sem cor nem ícone. Status de sincronização ("Falha", "Parcial") também é texto puro. | TEL-001, 021, 023 | prints; nenhum `sys_ui_style` no escopo | H1; Efeito Von Restorff (o que importa não se destaca) |
| A15 | **Listas sem ordem nem recorte de trabalho.** Integrações, comunicações, casos e débitos abrem em "All", 50 linhas, sem ordenação por data/prioridade e sem filtro de exceção (falhas, em risco, sem atendente). O coordenador precisa montar o filtro a cada visita. | TEL-001, 003, 005, 015, 021 | `sys_app_module` sem `filter`; prints com breadcrumb "All" | H7 (sem atalho), H6 |
| A16 | **Feedback só nas 3 ações existentes.** As únicas mensagens de retorno (`gs.addInfoMessage`) estão em Publicar versão/Criar nova versão/Publicar ciclo. Nenhuma notificação (e-mail) avisa o atendente de caso atribuído nem o coordenador de falha de integração ou de disparo. | geral | `ui-actions/*.ts`; `sysevent_email_action` = 0 | H1 |
| A17 | **Referências exibem o campo errado.** Em TEL-025 o campo Caso mostra "Sinalização coercitiva (descrição) 009"; em TEL-008/009 "Versão anterior" e "Critério aplicado" mostram nome de pessoa. O display value das tabelas não identifica o registro. | TEL-008, 009, 025 | prints | H2, H6 |
| A18 | **Dados de demonstração contraditórios.** Ciclo com título "(prévia)" e estado Publicado, grupo de controle 633 > 592 elegíveis, taxas de 81.010,63 %; critério com "Grupo de controle (%)" 64.340,67 e "Publicada por: Demo Atendente" (atendente não publica); caso em "Caso selecionado" com motivo "Regularizado" e data de encerramento; "Sem score" marcado com score preenchido; sincronização com fim antes do início e rejeitados > volume. | TEL-001, 008, 009, 024 | prints | H1, H2 (o usuário não consegue validar a regra olhando a tela) |
| A19 | **Campos sem distinção editável × leitura.** Nos prints de form, todos os campos aparecem no mesmo estilo preenchido; o usuário não identifica o que pode alterar. | TEL-004, 008, 009, 024, 025 | prints | H4, H5 |

---

## 2. Inventário: o que cada persona vê ao entrar e cliques até a tarefa principal

Contagem de cliques a partir do login, pelo caminho mais curto que a configuração atual oferece (digitar no filtro do navegador conta como 1).

### 2.1 Atendente de cobrança

**Vê ao entrar:** banner padrão da PDI. Para chegar ao app: navegador "All" → "Cobrança MT" → 21 módulos com nome de tabela, inclusive os de admin e coordenação.

| Tarefa principal | Caminho hoje | Cliques |
|---|---|---|
| Abrir o caso mais prioritário da própria fila | All (1) → filtrar "Cobrança" (2) → "Caso de cobrança qualificada" (3) → ordenar por Prioridade (4) → filtrar encerrados fora (5–7) → abrir caso (8) | 8 |
| Registrar interação | a partir do caso aberto: rolar até Interações → New (9) → Tipo, Resultado, Descrição, Ocorrida em (10–14) → Submit (15) | 15 |
| Encerrar caso | a partir do caso: editar Estágio (9), Motivo (10), Encerrado em (11–12), Salvar (13); sem validação de combinação | 13 |
| Ver os próprios indicadores | sem módulo; só por URL do report ou pelo app Reports (busca pelo título) | sem caminho no menu |

### 2.2 Coordenador de cobrança

**Vê ao entrar:** o mesmo banner e os mesmos 21 módulos.

| Tarefa principal | Caminho hoje | Cliques |
|---|---|---|
| Rodar o ciclo do mês (critério → prévia → conferir → publicar) | All + filtro + "Critério de qualificação" (3) → achar versão publicada (4–5) → "Ciclo de qualificação" (6–7) → New (8) → Nome, Referência, Critério (9–11) → Salvar (12) → sem "Gerar prévia" → "Carteira segmentada" (13–14) → filtrar pelo ciclo (15–17) → voltar ao ciclo (18–19) → Publicar ciclo (20) | ~20 |
| Distribuir casos sem atendente | "Caso de cobrança qualificada" (3) → filtrar Atendente vazio (4–6) → abrir um a um e preencher Atendente (3 cliques por caso); sem ação em lote | 6 + 3 por caso |
| Saber se a integração da noite falhou | "Execução de sincronização" (3) → ordenar por Início (4) → filtrar Status ≠ Sucesso (5–7) → abrir execução (8) → "Rejeição de registro" para ver o motivo (9–12) | ~12 |
| Ver como está o mês (funil, regularização × meta, efeito incremental) | reports fora do menu; efeito incremental via "Ciclo de qualificação" sem a view `efeito_incremental` | sem caminho no menu |

### 2.3 Administrador do app

**Vê ao entrar:** o mesmo banner e os mesmos 21 módulos, com as tabelas simuladas no meio das de negócio (posições 6, 10, 14, 15). Tarefa principal (ligar interruptor de falha de canal simulado): All + filtro + "Canal de envio (Simulado)" (3) → abrir canal (4) → marcar (5) → salvar (6). 6 cliques; é o único fluxo em que o menu por tabela coincide com a tarefa.

---

## 3. Repertório de interação da Core UI clássica (via SDK Fluent)

"Custo" = esforço no Fluent: **baixo** (1 arquivo, API tipada ou `Record()` simples), **médio** (vários registros ou script), **alto** (UI Page React).

| # | Padrão | O que resolve (achados) | Como no Fluent | Guia | Custo | Limitação |
|---|---|---|---|---|---|---|
| P1 | **Módulo com filtro e view** ("Minha fila", "Para decidir hoje", "Falhas de hoje") | A01, A04, A15 | `Record({ table: 'sys_app_module', data: { link_type: 'FILTER', name: <tabela>, filter: 'atendente=javascript:gs.getUserID()^estagio!=encerrado^ORDERBYprioridade', view_name: 'x_..._tel_023', roles: [...] } })` | `application-menu-guide.md` | baixo | Filtro é encoded query estático (pode usar `javascript:` para usuário/datas); "hoje" depende de existir campo de data a vencer |
| P2 | **Menu por área com separadores e papéis** | A01, A02 | `link_type: 'SEPARATOR'` para grupos; `roles` por módulo conforme a matriz; `sys_app_category` para estilo | `application-menu-guide.md` | baixo | Navegador UI16 tem um nível de pasta; mais de ~10 itens por grupo volta a ficar longo |
| P3 | **Home por persona — Dashboard** | A03, A11, A12 | `Dashboard({ tabs, permissions, visibilities })` com widgets ligados a tabela (`dataSources`, `metrics`, `groupBy`) e filtros (`dashboard-filters-guide`); módulo `DIRECT` para abrir | `dashboard-guide.md`, `dashboard-filters-guide.md` | médio | É Platform Analytics (`par_dashboard`): abre na experiência de dashboard, não dentro de um form UI16; meta sobreposta exige widget próprio (score + alvo) e não lê a tabela `meta` como linha de referência sem ajuste |
| P4 | **Home por persona — página de entrada** | A03 | Preferência `my_home_navigation_page` por usuário (`Record` em `sys_user_preference`) ou UI Page que redireciona por papel; `glide.login.home` é global | `ui-page-guide.md` | baixo a médio | Preferência é por usuário (seed por usuário demo) ou global; não há "home por papel" nativa na Core UI sem script de redirecionamento — conferir o nome da preferência na versão da instância |
| P5 | **UI Page para tela composta** (dossiê único, painel operacional, "Meu dia") | A05, A09, A10, A11, GAP-012, GAP-013 | `UiPage` + React 18.2 + `@servicenow/react-components` (`NowRecordListConnected`, `RecordProvider`, `Card`, `Button`), Table API com `X-UserToken`; navegação por `URLSearchParams` | `ui-page-guide.md`, `ui-page-patterns-guide.md`, `ui-page-theming-guide.md` | alto | Sem `g_form`, sem Jelly, sem client script; ACL vale via Table API; o resto do app (forms, listas) continua em UI16, então a página precisa linkar para eles; ATF de UI Page é mais limitado |
| P6 | **Modelo de estados** (caso, ciclo, critério, régua) | A07, A08 | `StateModel()` cria modelo, estados, transições e condições; tabela custom precisa da regra genérica `evaluateTransition` | `state-model-guide.md` | médio | Gate fica na condição da transição, nunca em Business Rule com `setAbortAction`; exige ajustar BRs atuais que já mudam estado |
| P7 | **Process flow formatter** (trilha de etapas no topo do form) | A08 | `Record` em `sys_process_flow` por etapa (condição sobre `estagio`/`estado`) + `Form` com `{ type: 'formatter', formatterRef: <sys_ui_formatter process_flow.xml> }` como primeiro elemento da primeira seção | `form-formatters-guide.md` ("Process Flow with Stage Records") | baixo | Só mostra a etapa; não muda estado (isso é P6/P8); uma linha de etapas por tabela |
| P8 | **UI Actions como verbos de negócio** (Gerar prévia, Publicar, Distribuir, Registrar interação, Encerrar caso, Reenviar, Ativar/Desativar) | A06, A07, A15, A16 | `UiAction({ form: { showButton, style: 'primary'|'destructive' }, list: { showButton / showListChoice }, condition: 'current.estagio == …', roles, script })`; cliente com `client.isClient` para `confirm()`; `gs.addInfoMessage` + `action.setRedirectURL` | `ui-action-guide.md`; RN-SN-169/170 | baixo | UI16 não tem modal de entrada nativo: pedir dado (ex.: motivo de encerramento) exige GlideModal com UI Page/Macro (médio) ou UI Policy que torna o campo obrigatório antes do botão |
| P9 | **Ação em lote na lista** ("Atribuir a…", "Distribuir automaticamente", "Reenviar selecionadas") | A15, 2.2 | `UiAction` com `list.showListChoice` (menu "Actions on selected rows") ou `list.showButton` (botão de banner) | `ui-action-guide.md` | baixo | Ação em lote recebe as linhas selecionadas; parâmetro extra (qual atendente) precisa de GlideModal |
| P10 | **UI Policy / Data Policy por estado** | A07, A19, A06 | `UiPolicy({ conditions: 'estagio=encerrado^EQ', actions: [{ field: 'motivo_encerramento', mandatory: true, visible: true }] })`; campos calculados `readOnly`; regra válida também para REST/import vai em Data Policy | `ui-policy-guide.md`, `data-policy-guide.md`; RN-SN-172/173 | baixo | Só cliente (UI Policy); validação servidora em Data Policy ou BR |
| P11 | **Client Script de orientação** (mensagem no campo, aviso de inconsistência) | A05, A18 | `ClientScript` onLoad/onChange com `g_form.showFieldMsg`, `g_form.addInfoMessage`, `g_scratchpad` vindo de BR display | `client-script-guide.md` | baixo | Script em string; sem GlideAjax em UI Policy (RN-SN-172) |
| P12 | **Field styles** (badge de cor para Falha, Sinal coercitivo, Sem score, Em risco) | A14 | `Record` em `sys_ui_style` por tabela/campo/valor | `field-styles-guide.md` | baixo | Cor/ícone na célula; não muda ordenação |
| P13 | **Listas por view + ordenação** (colunas por tarefa, agregados) | A04, A15 | `List({ table, view, columns })`; ordem no `filter` do módulo (`ORDERBYDESC…`); colunas agregadas | `list-guide.md` | baixo | List não define ordem por si; a ordem vem do módulo ou da preferência do usuário |
| P14 | **Related lists com contexto + list control** | A09, A10 | `sys_ui_related_list` + `sys_ui_related_list_entry` por view; `sys_relationship` para lista indireta (já usado no dossiê); `sys_ui_list_control` para esconder New/Edit, omitir lista vazia, editar inline (etapas da régua) | `list-guide.md`, `relationship-guide.md`, `list-control-guide.md` | baixo | Related list é tabela embaixo do form; não é cartão nem resumo |
| P15 | **Views + View Rules por persona** | A05, A10 | `sys_ui_view` + `Form({ view })` + `sysrule_view` (condição ou script por papel) | `view-guide.md`, `view-rule-guide.md` | baixo | Uma view por vez; View Rule com `overrides_user_preference` pode confundir quem trocou de view à mão |
| P16 | **Formatter custom** (cartão-resumo no topo: valor em aberto, dias sem contato, próxima ação) | A05 | `UiMacro` (Jelly) + `sys_ui_formatter` + elemento `formatter` no `Form` | `ui-macro-guide.md`, `jelly-guide.md`, `form-formatters-guide.md` | médio | Jelly; acessibilidade e tema por conta própria |
| P17 | **Notificações** (caso atribuído, promessa vencendo, integração com falha, disparo com erro) | A16 | `EmailNotification` em insert/update ou por evento (`registering-events-guide`); evento disparado por BR, ScheduledScript ou Flow | `email-notification-guide.md`, `registering-events-guide.md`, `scheduled-script-guide.md` | baixo a médio | Core UI não tem notificação in-app nativa além de e-mail e mensagens de form |
| P18 | **Wizard via Service Catalog / Record Producer** | A07 (ciclo novo), cadastro de régua | `CatalogItemRecordProducer` com variáveis, UI policy e client script de catálogo | `service-catalog-guide.md`, `service-catalog-variables-guide.md` | médio | O guia restringe Record Producer a tabelas derivadas de `task`; as tabelas do app não estendem `task`. Alternativas: form por estado (P6+P10 revelando seções) ou UI Page multi-etapa (P5) |
| P19 | **Automação de rotina** (recalcular "parado há N dias", fechar caso regularizado, sinalizar promessa vencida) | A04 ("Para decidir hoje") | `ScheduledScript` ou Flow (`wfa-flow-guide`, `wfa-trigger-guide`) atualizando campos usados nos filtros de P1 | `scheduled-script-guide.md`, `wfa-flow-guide.md` | médio | Precisa de campos novos (ex.: `proxima_acao_em`, `dias_sem_contato`) no modelo |

---

## 4. Proposta de arquitetura de navegação

### 4.1 Menu "Cobrança MT" por área de trabalho

Cada item é módulo `FILTER`/`DIRECT`/`REPORT` com `roles` próprio. Separadores (`SEPARATOR`) delimitam as áreas.

**Meu trabalho** — atendente

| Módulo | Tipo | Destino |
|---|---|---|
| Meu dia | DIRECT | T1 |
| Minha fila | FILTER | `caso`: `atendente=eu ^ estagio!=encerrado ^ ORDERBYprioridade`, view `minha_fila` |
| Para agir hoje | FILTER | `caso`: `atendente=eu ^ proxima_acao_em<=hoje` (campo novo, P19) |
| Meus contribuintes | FILTER | `contribuinte`: `atendente=eu`, view `visao_unica` |
| Meus indicadores | REPORT/DIRECT | TEL-031 (corrigido para canal) ou aba do dashboard |

**Coordenação** — coordenador

| Módulo | Tipo | Destino |
|---|---|---|
| Painel da cobrança | DIRECT | T7 |
| Ciclo do mês | FILTER | `ciclo`: `estado!=encerrado ^ ORDERBYDESCreferencia` (abre T4) |
| Critérios | FILTER | `criterio`: `estado=publicada` (rascunhos acessados de dentro da versão) |
| Distribuir casos | FILTER | `caso`: `atendenteISEMPTY ^ estagio!=encerrado` (T5) |
| Réguas | LIST | `regua` (T6) |
| Disparos com falha | FILTER | `comunicacao`: `status=falha ^ ORDERBYDESCsys_created_on` |
| Integrações | FILTER | `sincronizacao`: `ORDERBYDESCinicio` (T8) |
| Parcelamentos em risco | FILTER | `parcelamento`: campo de alerta = true |
| Metas | LIST | `meta` |

**Administração** — só `x_2326104_cob.admin`

Todas as 21 tabelas em LIST, incluindo as simuladas, sob dois separadores: "Dados" e "Simulação".

### 4.2 Tabelas que saem do menu das personas

Ficam só em Administração; o usuário de negócio chega a elas por related list, ação ou painel.

| Tabela | Como a persona chega |
|---|---|
| `debito_stg` (Staging, Simulado) | — (admin) |
| `canal_sim`, `envio_sim` (Simulado) | — (admin) |
| `score_sim` (Simulado) | widget de cobertura no T7; campo Score no caso/contribuinte |
| `exportacao` | — (admin, trilha) |
| `rejeicao` | related list da execução em T8 |
| `sincronizacao` | T8 e widget "integrações com falha" no T7 |
| `regua_etapa` | related list editável inline em T6 |
| `interacao` | related list + ação "Registrar interação" em T3 |
| `segmentacao` | related list do ciclo em T4 |
| `comunicacao` | módulo "Disparos com falha" + related list em T3 e T6 |
| `consentimento` | related list em T3 / visão única |
| `debito`, `parcelamento`, `regularizacao` | related lists do dossiê (T3) e da visão única; módulo filtrado "Parcelamentos em risco" |
| `contribuinte` | "Meus contribuintes" (atendente); busca global (coordenador) |
| `caso`, `ciclo`, `criterio`, `regua`, `meta` | ficam, mas por módulo filtrado (4.1), não por tabela crua |

### 4.3 Telas-tarefa

| ID | Tela-tarefa | Persona | Substitui | Composição na Core UI |
|---|---|---|---|---|
| T1 | **Meu dia** | atendente | entrada pela PDI + módulos `caso`/`regularizacao` | Dashboard (P3) ou UI Page (P5): contagem da fila por estágio, casos para agir hoje, promessas vencendo, regularizações do mês × meta; links para T2/T3. Definida como home do atendente (P4) |
| T2 | **Minha fila** | atendente | TEL-023 | Módulo FILTER (P1) + view `minha_fila` (P13) + field styles para sinal coercitivo e sem score (P12) |
| T3 | **Dossiê do caso** | atendente (coordenador lê) | TEL-024, TEL-025, TEL-004 | Form na view `dossie` (P15) com process flow do estágio (P7), cartão-resumo (P16), botões "Registrar interação", "Registrar promessa", "Encerrar caso" (P8) com UI Policy de motivo obrigatório (P10), related lists dos 3 níveis (P14). Versão UI Page (P5) se GAP-012 pedir tela única |
| T4 | **Ciclo do mês** | coordenador | TEL-007, 008, 009, 010, 029 | Form do ciclo com modelo de estados Rascunho → Prévia → Publicado → Encerrado (P6) e process flow (P7); ações "Gerar prévia", "Publicar ciclo", "Encerrar ciclo" (P8); campos calculados somente leitura (P10); related list Carteira segmentada agrupada por segmento (P14); seção de efeito incremental visível só em Encerrado |
| T5 | **Distribuição da carteira** | coordenador | TEL-021, TEL-022 | Lista FILTER de casos sem atendente (P1) com ações em lote "Distribuir automaticamente" e "Atribuir a…" (P9); widget de carga por atendente no T7 |
| T6 | **Régua** | coordenador | TEL-013, 014, 015, 016, 017 | Form da régua com Etapas editáveis inline (P14 + list control), ações "Ativar"/"Desativar" (P8), related list de comunicações com "Reenviar" em lote (P9), efetividade como widget |
| T7 | **Painel da cobrança** | coordenador | TEL-011, 016, 022, 026, 027, 028, 030 | Dashboard (P3) com abas Operação (integrações com falha, disparos com falha, parcelamentos em risco, carga por atendente) e Resultado (funil, regularizações por tributo/origem/canal com meta, efeito incremental por ciclo); home do coordenador (P4) |
| T8 | **Saúde das integrações** | coordenador, admin | TEL-001, 002, 006 | Lista FILTER de execuções ordenada por início, status com field style (P12), form da execução com related list de rejeições (P14); notificação de falha (P17) |

Com T1–T8 o menu das personas cai de 21 módulos de tabela para 5 (atendente) e 9 (coordenador), e as tarefas da seção 2 passam a começar na home da persona.
