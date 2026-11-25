---
generated-by: spec-scope-change v1.2
project: "Cobrança MT — piloto 2.6 Cobrança (Speckit ServiceNow)"
date: "2026-11-25"
total-chgs: 41
critical: 10
high: 12
medium: 13
low: 6
changes: "ux-v1: CHG-001..018 (3 críticos · 7 altos · 5 médios · 3 baixos); ux-v2: CHG-019..041 (7 críticos · 5 altos · 8 médios · 3 baixos), seção no fim"
---
# Gaps da Alteração de Escopo — Cobrança MT (change ux-v1)

**Gerado por:** spec-scope-change v1.2 (Etapa A e Etapa B no mesmo turno)
**Data:** 2026-11-25
**Documentos de alteração analisados:** `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md`
**Total de CHGs:** 18 (3 críticos · 7 altos · 5 médios · 3 baixos) — todos `decidido`

> As respostas foram dadas pelo agente com autorização do usuário (decisões R1–R8 e correções obrigatórias da seção «Revisão EGM e decisões finais (v1.1)» do design). Nenhum CHG ficou aberto.

---

## CHGs por severidade

### 🔴 Críticos — resolver antes de qualquer implementação

### CHG-001

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Estado «distribuído» do ciclo |
| **Descrição** | O design pede o estado `distribuido` no ciclo. O código entregue só aceita publicado → encerrado (`CriterioVersao.server.js`), a regra de imutabilidade do ciclo só cobre publicado/encerrado e o filtro do grupo de controle (`QualificacaoCiclo.emControle`) usa `estado=publicado`. Um estado novo abriria os totais para edição e tiraria o controle da proteção (🔴1 da revisão). |
| **Impacto se não resolvido** | O 3º clique do ciclo falha, ou o grupo de controle recebe ação de cobrança. |
| **Pergunta para o negócio** | O ciclo distribuído vira estado novo ou continua «publicado» com um campo de data de distribuição? |
| **Dono sugerido** | Coordenação de Cobrança + FDE |
| **Sugestão de tratamento** | Sem estado novo: campo `distribuido_em` (data e hora) e `qtd_contatos`; a etapa «Distribuído» da trilha vem da condição `estado=publicado^distribuido_emISNOTEMPTY`. |
| **Afeta camadas** | Negócio / Dados / Tela / Testes |
| **Bloqueante para** | spec-data-model_change / spec-tasks_change |
| **Decisão consolidada** | R1: sem estado novo; `ciclo.distribuido_em` (glide_date_time) + `qtd_contatos` (integer); etapa «Distribuído» por condição; o ciclo vai a «encerrado» pelo caminho existente. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-003

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Dono do contato × dono do contribuinte |
| **Descrição** | No rodízio do «Distribuir», o atendente A pode receber contato de contribuinte da carteira de B; a carteira entregue (SEC-002) nega a A o contribuinte, os débitos e as comunicações (🔴7). |
| **Impacto se não resolvido** | O CUJ-A quebra: o atendente abre o contato e não vê o contribuinte. |
| **Pergunta para o negócio** | Qual é a regra única de dono entre contato e contribuinte? |
| **Dono sugerido** | Coordenação de Cobrança |
| **Sugestão de tratamento** | `contato.atendente := contribuinte.atendente`; contribuinte sem atendente recebe um por rodízio, gravado nos dois. |
| **Afeta camadas** | Negócio / Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | R3: `contato.atendente = contribuinte.atendente`; rodízio só para contribuinte sem atendente, gravando os dois campos. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-006

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Migração do dono do caso |
| **Descrição** | O caso passa do atendente ao coordenador (validação MT de 17/06). Renomear coluna no SDK é DELETE + ADD; o seed só distribui por coluna com nome de papel; 6 arquivos feitos à mão e 2 arquivos de teste usam `caso.atendente` (🔴5). |
| **Impacto se não resolvido** | Build quebra (`caso-dossie-niveis.now.ts`), regras de carteira dão erro de script e os testes F5-003/F5-007 invertem o sentido. |
| **Pergunta para o negócio** | A coluna se chama `coordenador` (rótulo «Responsável») ou `responsavel` com valor padrão? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Coluna `coordenador`, rótulo «Responsável»; inventário de arquivos na story; testes reescritos (positivo = coordenador, negativo = atendente sem acesso). |
| **Afeta camadas** | Negócio / Dados / Tela / Testes |
| **Bloqueante para** | spec-data-model_change / spec-tasks_change |
| **Decisão consolidada** | R6: coluna `coordenador` (reference sys_user, rótulo «Responsável»); `atendente` sai do caso. Na F2 só o mínimo para o build (renomear referências); testes F5-003/F5-007 inativos até a F4. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

---

### 🟡 Altos — resolver antes de spec-tasks_change

### CHG-002

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | «Gerar prévia» sem algoritmo |
| **Descrição** | O CUJ-B pede «Gerar prévia», mas o código só tem `publicar`; sorteio, semente e totais são gravados na publicação e quem é elegível sai do insert da carteira segmentada (🔴2). |
| **Impacto se não resolvido** | O 1º clique do CUJ-B é inócuo ou grava campo protegido. |
| **Pergunta para o negócio** | Escrever o algoritmo da prévia agora ou cortar o botão no v1? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Cortar no v1: o ciclo fica Publicar → Distribuir lista (2 botões); registrar o GAP. |
| **Afeta camadas** | Negócio / Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | R2: «Gerar prévia» cortada; meta M3 passa a «no máximo 3 cliques»; GAP-023. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-004

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Coordenador registra interação no caso |
| **Descrição** | A ACL de create da interação é só atendente/admin e o teste F5-007 afirma que o coordenador não registra interação; com o caso passando ao coordenador, isso contradiz a condução (🔴4). |
| **Impacto se não resolvido** | O coordenador conduz o caso mas não registra o que fez. |
| **Pergunta para o negócio** | O coordenador registra interação no caso qualificado? |
| **Dono sugerido** | Coordenação de Cobrança |
| **Sugestão de tratamento** | Sim: `role_coordenador` entra no create de interação; o teste F5-007 se inverte. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | R4: sim; coordenador no create de `interacao`; teste F5-007 invertido na F4. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-005

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Painel em Dashboard() |
| **Descrição** | O design pede `Dashboard()` (Platform Analytics); a regra de UI do projeto manda painel que a Core UI não faz virar report ou lista com GAP; o módulo DIRECT exigiria sys_id fixo (🔴10). |
| **Impacto se não resolvido** | Painel fora da Core UI e sys_id fixo no menu. |
| **Pergunta para o negócio** | Painel em Dashboard com exceção registrada, ou reports no menu? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Reports TEL-026..029 como entradas da área Analytics; home do coordenador = «Casos qualificados». |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | R5: reports, sem `Dashboard()`; GAP-022; home do coordenador = «Casos qualificados». Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-007

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Seed coerente entre tabelas |
| **Descrição** | O gerador sorteia valor por coluna, com quantidade igual por tabela e datas fixas: daí a taxa de 81.010% e o controle maior que os elegíveis (🔴12, A18). |
| **Impacto se não resolvido** | A demonstração mostra números absurdos e datas vencidas. |
| **Pergunta para o negócio** | Seed à mão agora ou seção de regras de seed no kit? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Seed à mão de ciclo, contato e caso em arquivos sem cabeçalho de gerado; datas relativas recalculadas na véspera. |
| **Afeta camadas** | Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | R7: seed à mão (`app/src/fluent/seed-demo/`), `seedManual` no modelo; o roteiro da véspera regera as datas. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-009

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Tabela de decisão de «Registrar ligação» |
| **Descrição** | Faltavam: status com sem contato na 1ª e 2ª tentativas, promessa com retorno, campos da interação criada, anotação obrigatória e o filtro de «Minha lista» que tira o contato do dia (🔴13). |
| **Impacto se não resolvido** | Cada pessoa implementa um comportamento diferente; o CUJ-A não é testável. |
| **Pergunta para o negócio** | Qual a transição exata por resultado, retorno e tentativas? |
| **Dono sugerido** | Coordenação de Cobrança |
| **Sugestão de tratamento** | Tabela de decisão da seção v1.1 e filtro exato de «Minha lista». |
| **Afeta camadas** | Negócio / Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | Tabela de decisão v1.1 (6 linhas) + anotação obrigatória + filtro `atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade`. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-010

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Verbos por UI Policy |
| **Descrição** | UI Policy não sabe qual botão foi clicado; tornar campo obrigatório por policy trava os outros botões e qualquer gravação (🔴3). |
| **Impacto se não resolvido** | O form trava ou o dado obrigatório não é exigido. |
| **Pergunta para o negócio** | Como o verbo exige o dado obrigatório? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | UI Action client+server (`g_form.setMandatory` + `gsftSubmit` + guard `typeof window`), revalidação no servidor com `{ok, mensagem}`, `condition`, `roles` e `actionName`. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | Correção obrigatória 🔴3 aplicada como descrita. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-011

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Atendente sem acesso ao caso |
| **Descrição** | O scaffold dá leitura a todos os papéis em todas as tabelas e o schema não aceita papel por entidade (🔴6). |
| **Impacto se não resolvido** | O atendente continua lendo caso qualificado. |
| **Pergunta para o negócio** | ACL deny à mão ou papel por entidade no kit? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | ACL deny à mão em arquivo próprio, sem cabeçalho de gerado. |
| **Afeta camadas** | Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | ACL deny à mão (STORY-MOD-UX-006). Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

---

### 🟡 Médios — resolver até o final do sprint

### CHG-008

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | DEPENDÊNCIA_EXTERNA |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Página inicial por papel |
| **Descrição** | A Core UI não tem home por papel; a preferência `my_home_navigation_page` depende do comportamento da release na instância (🔴11). |
| **Impacto se não resolvido** | O critério M1 fica sem verificação objetiva. |
| **Pergunta para o negócio** | Se a preferência não tiver efeito, qual é o critério do M1? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Plano B binário: 1º módulo do menu do papel; verificação por impersonate + navpage.do. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | R8: critério do M1 passa a «1º módulo do menu do papel» se a preferência falhar. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-012

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Grupo de controle na lista ativa |
| **Descrição** | Nenhuma regra protege o contato contra contribuinte do grupo de controle (🟡7). |
| **Impacto se não resolvido** | O efeito incremental fica contaminado. |
| **Pergunta para o negócio** | O contato segue a mesma proteção do grupo de controle? |
| **Dono sugerido** | Coordenação de Cobrança |
| **Sugestão de tratamento** | Regra before insert em contato chamando `motivoRecusaAcao`; «Distribuir» só cria contato para `segmento=massificada`. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | Correção 🟡7 aplicada (STORY-MOD-UX-004). Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-013

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Menu com consultas reais e limite de entradas |
| **Descrição** | Os filtros do menu estavam em pseudo-sintaxe (`atendente=eu`, `GROUPBY`), sem nome completo de papel; somando os módulos do design o coordenador passa de 12 entradas (🟡3, 🟡4). |
| **Impacto se não resolvido** | O menu não instala ou o M2 não fecha. |
| **Pergunta para o negócio** | Quais entradas ficam para o coordenador? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Consultas reais e papéis `x_2326104_cob.*`; cortar «Retornos de hoje» e «Distribuição da lista»; «Integrações» só para o admin. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | Cortes aplicados; «Integrações» só admin (coordenador fica com 12 entradas); `modules` estendido com `items`; «Meus indicadores» (TEL-031) entra para o atendente (3 entradas). Decisor: agente (autorizado por arthurleardini), 25/11/2026. (divergiu da sugestão original do design (Integrações também para o coordenador) para fechar o M2) |

### CHG-014

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Rótulos, display e moeda |
| **Descrição** | Referências mostram o campo errado (caso pela sinalização, critério e ciclo por nome de pessoa), moeda em «$», termos em inglês (🟡6, 🟡11, A17). |
| **Impacto se não resolvido** | O usuário não identifica o registro nem o valor. |
| **Pergunta para o negócio** | Como fixar display e moeda no Fluent? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | `entities[].display`; moeda `currency` com rótulo «(R$)» quando o código BRL não puder ser fixado. |
| **Afeta camadas** | Dados / Tela |
| **Bloqueante para** | spec-data-model_change |
| **Decisão consolidada** | Display: caso e contato = contribuinte, ciclo = nome; colunas de valor com rótulo «(R$)». Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-018

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Regra de regularização (RN-09) |
| **Descrição** | A regra que encerra contatos abertos na regularização não tem momento, definição de «aberto» nem relação com o grupo de controle (🟡10). |
| **Impacto se não resolvido** | Contatos de contribuinte regularizado continuam na lista. |
| **Pergunta para o negócio** | Entra no v1? |
| **Dono sugerido** | Coordenação de Cobrança |
| **Sugestão de tratamento** | Cortar no v1 e registrar GAP. |
| **Afeta camadas** | Negócio |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | Cortada; GAP-021. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

---

### ⚪ Baixos — backlog de qualidade

### CHG-015

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | BAIXA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | StateModel ambíguo |
| **Descrição** | O D5 descarta o StateModel e a linha de risco o reintroduz (🟡1). |
| **Impacto se não resolvido** | Duas implementações possíveis. |
| **Pergunta para o negócio** | v1 usa StateModel? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | v1 sem StateModel: process flow + UI Actions. |
| **Afeta camadas** | Tela |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | v1 sem StateModel. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-016

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | QUESTÃO_ABERTA |
| **Severidade** | BAIXA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Destino das telas do caso do atendente |
| **Descrição** | TEL-023 «Minha fila», TEL-024 e TEL-025 têm papel atendente (🟡12). |
| **Impacto se não resolvido** | Telas órfãs no manifesto e prints errados. |
| **Pergunta para o negócio** | As telas mudam de papel ou são substituídas? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | TEL-023 substituída no mesmo ID por «Casos qualificados» (coordenador); TEL-024 e TEL-025 passam ao coordenador; novas TEL-034 «Minha lista» e TEL-035 «Contato da lista»; TEL-009 vira «Ciclo do mês». |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | Como sugerido. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

### CHG-017

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | BAIXA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v1.md` (v1.1) + `docs/designs/review-ux/consolidated_review_report.md` |
| **Tema** | Cópia do telefone no contato |
| **Descrição** | O design copia o telefone no contato; cópia desatualiza (🟢). |
| **Impacto se não resolvido** | Telefone divergente entre contato e contribuinte. |
| **Pergunta para o negócio** | Copiar ou exibir por dot-walk? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Dot-walk `contribuinte.telefone` na lista. |
| **Afeta camadas** | Dados / Tela |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | Sem coluna telefone; dot-walk na lista TEL-034. Decisor: agente (autorizado por arthurleardini), 25/11/2026. (seguiu sugestão) |

---

## Respostas

### CHG-001
**Decisão:** R1: sem estado novo; `ciclo.distribuido_em` (glide_date_time) + `qtd_contatos` (integer); etapa «Distribuído» por condição; o ciclo vai a «encerrado» pelo caminho existente.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Tela / Testes — spec-data-model_change / spec-tasks_change; seguiu sugestão.

### CHG-002
**Decisão:** R2: «Gerar prévia» cortada; meta M3 passa a «no máximo 3 cliques»; GAP-023.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Tela / Testes — spec-tasks_change; seguiu sugestão.

### CHG-003
**Decisão:** R3: `contato.atendente = contribuinte.atendente`; rodízio só para contribuinte sem atendente, gravando os dois campos.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Testes — spec-tasks_change; seguiu sugestão.

### CHG-004
**Decisão:** R4: sim; coordenador no create de `interacao`; teste F5-007 invertido na F4.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — spec-tasks_change; seguiu sugestão.

### CHG-005
**Decisão:** R5: reports, sem `Dashboard()`; GAP-022; home do coordenador = «Casos qualificados».
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — spec-tasks_change; seguiu sugestão.

### CHG-006
**Decisão:** R6: coluna `coordenador` (reference sys_user, rótulo «Responsável»); `atendente` sai do caso. Na F2 só o mínimo para o build (renomear referências); testes F5-003/F5-007 inativos até a F4.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Tela / Testes — spec-data-model_change / spec-tasks_change; seguiu sugestão.

### CHG-007
**Decisão:** R7: seed à mão (`app/src/fluent/seed-demo/`), `seedManual` no modelo; o roteiro da véspera regera as datas.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados / Testes — spec-tasks_change; seguiu sugestão.

### CHG-008
**Decisão:** R8: critério do M1 passa a «1º módulo do menu do papel» se a preferência falhar.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — nenhum; seguiu sugestão.

### CHG-009
**Decisão:** Tabela de decisão v1.1 (6 linhas) + anotação obrigatória + filtro `atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade`.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Tela / Testes — spec-tasks_change; seguiu sugestão.

### CHG-010
**Decisão:** Correção obrigatória 🔴3 aplicada como descrita.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — spec-tasks_change; seguiu sugestão.

### CHG-011
**Decisão:** ACL deny à mão (STORY-MOD-UX-006).
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados / Testes — spec-tasks_change; seguiu sugestão.

### CHG-012
**Decisão:** Correção 🟡7 aplicada (STORY-MOD-UX-004).
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — spec-tasks_change; seguiu sugestão.

### CHG-013
**Decisão:** Cortes aplicados; «Integrações» só admin (coordenador fica com 12 entradas); `modules` estendido com `items`; «Meus indicadores» (TEL-031) entra para o atendente (3 entradas).
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — spec-tasks_change; divergiu da sugestão original do design (Integrações também para o coordenador) para fechar o M2.

### CHG-014
**Decisão:** Display: caso e contato = contribuinte, ciclo = nome; colunas de valor com rótulo «(R$)».
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados / Tela — spec-data-model_change; seguiu sugestão.

### CHG-015
**Decisão:** v1 sem StateModel.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela — nenhum; seguiu sugestão.

### CHG-016
**Decisão:** Como sugerido.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — spec-tasks_change; seguiu sugestão.

### CHG-017
**Decisão:** Sem coluna telefone; dot-walk na lista TEL-034.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados / Tela — nenhum; seguiu sugestão.

### CHG-018
**Decisão:** Cortada; GAP-021.
**Decidido por:** agente (autorizado por arthurleardini)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio — nenhum; seguiu sugestão.

---

*Todos os CHGs decididos: a F2 (modelo de dados → sn-scaffold → seed → reinstall) está liberada.*

---
---

# Gaps da Alteração de Escopo — Cobrança MT (change ux-v2)

**Gerado por:** spec-scope-change v1.3 (Etapa A e Etapa B no mesmo turno)
**Data:** 2026-11-25
**Documentos de alteração analisados:** `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + `docs/designs/review-ux/regua-flow_review_report.md`
**Total de CHGs:** 23 (7 críticos · 5 altos · 8 médios · 3 baixos), CHG-019 a CHG-041 — todos `decidido`

> Os CHGs nascem decididos: as respostas são as decisões D1–D20 e P1/P2/P3 do design v2.1, aprovado pelo dono do produto em 25/11/2026. Resultados da F0 (spike na instância) já disponíveis entram na decisão; os demais pontos da F0 seguem o design, com o plano B escrito nele.

---

## CHGs por severidade

### 🔴 Críticos — resolver antes de qualquer implementação

### CHG-019

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | QUESTÃO_ABERTA |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Contato da régua × distribuição do ciclo (P1) |
| **Descrição** | O rascunho criava contato quando a régua encaminha à cobrança ativa, mas a UX-004 já cria contato na «Distribuir lista». As duas vias podiam duplicar contato do mesmo contribuinte no ciclo (🔴1 da revisão). |
| **Impacto se não resolvido** | Contato em dobro na lista do atendente, ou contribuinte encaminhado pela régua que nunca chega à lista. |
| **Pergunta para o negócio** | O contribuinte da massificada entra na lista do atendente pela distribuição, pela régua ou pelas duas? |
| **Dono sugerido** | Dono do produto |
| **Sugestão de tratamento** | (b) só pela régua. |
| **Afeta camadas** | Negócio / Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | P1 = ambos (D14). «Distribuir lista» continua igual; «Escalonar» chama `QualificacaoCiclo.atribuirContato` (helper sem checagem de papel) com dedupe por contribuinte + ciclo: contato aberto existente ganha `inscricao` e `proxima_acao_em = agora`; senão nasce contato com `origem = regua`. `contato.origem` (distribuicao, regua). `distribuir` passa a usar `_criarContato`; nenhum `it()` da UX-004 muda. Decisor: dono (design v2.1), 25/11/2026. (divergiu da sugestão) |

### CHG-022

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Teto por dia × demo em minutos |
| **Descrição** | O teto da RN-38 era por dia de calendário; com 60 s por dia simulado, a régua IPVA inteira cai num dia só e a etapa 4 bate no teto da etapa 1 (🔴2). |
| **Impacto se não resolvido** | CUJ-4 e G6 falham na demo, ou o teto é desligado e G7 deixa de ser testável. |
| **Pergunta para o negócio** | Como medir o teto quando o dia é simulado? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Janela móvel de `segundos_por_dia` segundos por contribuinte e canal. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D19 + D18: no máximo `TETO_POR_JANELA = 1` tentativa por contribuinte e canal nos últimos `segundos_por_dia` segundos (24 h em produção, 60 s na demo); constante no `ReguaMotor`. ATF de teto em modo demo (recua `recebido_em` 61 s). Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-023

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Coordenador só lê régua e etapa |
| **Descrição** | `security/acl-base.now.ts:177-209` dá só `read` ao coordenador em `regua` e `regua_etapa`; o CUJ-6 pede que ele edite texto, canal e prazo (🔴3). |
| **Impacto se não resolvido** | O coordenador não ajusta a régua; Pausar e Ativar falham. |
| **Pergunta para o negócio** | O que o coordenador grava na régua e na etapa? |
| **Dono sugerido** | Coordenação de Cobrança + FDE |
| **Sugestão de tratamento** | Write de registro e `*` para coordenador e admin; campos estruturais só admin. |
| **Afeta camadas** | Negócio / Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | B5: write registro e `*` em `regua` e `regua_etapa` para coordenador e admin; `codigo`, `carteira`, `flow` (régua) e `regua`, `ordem` (etapa) só admin; create sem ACL nova (só admin de sistema), New escondido por list control. Arquivo `security/regua.now.ts`. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-024

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Segurança da inscrição na régua |
| **Descrição** | A tabela nova `regua_inscricao` traz contribuinte e situação de cobrança; sem ACL e sem BR de query, o atendente lê a carteira dos outros (🔴4). |
| **Impacto se não resolvido** | Quebra a carteira do atendente (SEC-002, RN-NOVO-F5-007). |
| **Pergunta para o negócio** | Quem lê e quem grava a inscrição? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Read para os 3 papéis com deny por carteira; nenhuma escrita para as personas. |
| **Afeta camadas** | Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | B5: read registro e `*` para atendente, coordenador e admin; read deny `new CarteiraAtendente().podeVer(current, 'contribuinte.atendente')` com `adminOverrides`; BR before query com `x_2326104_cob_regua_inscricao: ['contribuinte.atendente']` no mapa `DONO`; create, write e delete sem ACL (o motor grava no servidor). Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-025

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Inscrição só pelo botão «Publicar ciclo» |
| **Descrição** | O rascunho chamava `inscrever` dentro de `publicar()`; publicação pela lista, pelo form ou por API não inscreveria ninguém (🔴5). |
| **Impacto se não resolvido** | Régua não dispara quando o ciclo é publicado por outro caminho. |
| **Pergunta para o negócio** | Em que momento nasce a inscrição? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | BR after update do ciclo na transição prévia → publicado. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D7: BR after update em `ciclo` com `previous.estado == 'previa' && current.estado == 'publicado'` chama `ReguaMotor.inscrever(ciclo)`: massificada com débito aberto, na régua ativa da carteira do maior débito; sem duplicar inscrição ativa. Parcelamento «em risco» inscreve na régua Parcelamentos (CHG-021). ATF publicando por GlideRecord. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-026

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Idempotência do envio e do escalonamento |
| **Descrição** | Um passo de Flow pode rodar de novo (retomada, reexecução); sem chave, a mesma etapa envia duas vezes e o escalonamento cria dois contatos (🔴6). |
| **Impacto se não resolvido** | Comunicação em dobro ao contribuinte; G6 («1 comunicação por etapa») falha. |
| **Pergunta para o negócio** | Qual é a chave de unicidade do envio e do escalonamento? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Envio por inscrição + etapa; escalonamento por status da inscrição + dedupe do contato. |
| **Afeta camadas** | Negócio / Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | B3: `enviar` devolve a comunicação existente da inscrição e da etapa com status ≠ «agendada» sem enviar; `escalonar` com inscrição não ativa devolve `destino=''` sem mudar nada; `atribuirContato` não cria contato se já há um aberto no ciclo. ATF de idempotência em F4-011 e F4-012. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-027

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | CRÍTICA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Contrato das custom actions e build da F2 |
| **Descrição** | Os Flows referenciam as custom actions; sem contrato fixo (nome interno, entradas, saídas, tipos), a F2 não compila e cada fase muda o Flow gerado (🔴7, 🔴8). |
| **Impacto se não resolvido** | Build quebrado na F2 ou Flows regerados a cada fase. |
| **Pergunta para o negócio** | Qual é o contrato das ações e quando elas nascem? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | 4 custom actions com contrato final na F2, motor mínimo, regra nas fases seguintes. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D10 + B3: `regua_agendar_etapa` (inscricao, ordem → segue, executar_em), `regua_checar_guardas` (inscricao → segue, motivo), `regua_enviar_comunicacao` (inscricao, ordem → status, canal, comunicacao), `regua_escalonar` (inscricao → destino, contato); `actionStep.script` com `Now.include` do script do passo que chama `ReguaMotor`. F0: `ordem` só número; reference exige GlideRecord em `FlowAPI`; o script faz `parseInt(inputs.ordem)`. Na F2 o motor devolve `segue = true` e `status = 'pulada'`. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

---

### 🟡 Altos — resolver antes de spec-tasks_change

### CHG-020

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | QUESTÃO_ABERTA |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Edição da régua: form × Flow Designer (P2) |
| **Descrição** | O coordenador pode mudar a régua no form (parâmetros) e no Flow Designer (estrutura). Edição no Designer exige papel de Flow Designer e é sobrescrita pelo reinstall (🟡25). |
| **Impacto se não resolvido** | Régua e Flow divergem, ou o coordenador perde o que mudou no Designer. |
| **Pergunta para o negócio** | O coordenador edita só no form ou também no Flow Designer? |
| **Dono sugerido** | Dono do produto |
| **Sugestão de tratamento** | (a) só form; cortar o Designer. |
| **Afeta camadas** | Negócio / Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | P2 = ambos (D15). Form: dia, canal, texto, postura, ação sem resposta. Designer: `regua.flow`, «Abrir no Flow Designer» e papel `flow_designer` + `flow_operator` para o coordenador por `sys_user_role_contains` (F0: `Now.ref('sys_user_role', { name: ... })` por nome); mecanismos 2 e 3 de B6 se a instância recusar. Fluxo de `now-sdk transform` antes do reinstall (CHG-041). Decisor: dono (design v2.1), 25/11/2026. (divergiu da sugestão) |

### CHG-021

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | QUESTÃO_ABERTA |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Régua de parcelamento em risco (P3) |
| **Descrição** | A régua Parcelamentos não tem gatilho pela publicação do ciclo, e a guarda «débito parcelado encerra» a encerraria logo de saída (🟡23). |
| **Impacto se não resolvido** | Régua Parcelamentos inativa ou encerrando na primeira etapa. |
| **Pergunta para o negócio** | A régua Parcelamentos entra na v2? Com qual gatilho? |
| **Dono sugerido** | Dono do produto |
| **Sugestão de tratamento** | Sim, gatilho em `parcelamento.status` virando `em_risco`; guarda por carteira. |
| **Afeta camadas** | Negócio / Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | P3 = sim (D16). BR after update em `parcelamento` (`status.changesTo('em_risco')`) chama `inscreverParcelamento`; `ciclo` = último publicado ou vazio. Guarda: `em_risco` segue; `em_dia`/`quitado` → regularizado; `rompido` → parcelamento_rompido. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-028

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | DEPENDÊNCIA_EXTERNA |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Limites da API Fluent (SDK 4.14.3) para o Flow |
| **Descrição** | Um gatilho por Flow, Flow sem inputs, `Duration()` literal, sem JS em `if`, stage fora de `forEach`, saída de `tryCatch` só pelo `return`, sem passo ATF de Flow. Espera por pill e stage dentro do `try` precisavam de prova na instância (🟡1, 🟡5). |
| **Impacto se não resolvido** | Flow que não compila ou não espera; erro deixa a inscrição «ativa». |
| **Pergunta para o negócio** | O desenho do Flow cabe na API? Qual o plano B? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Spike F0 com plano B escrito para cada ponto. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change (só os pontos ainda em teste) |
| **Decisão consolidada** | D11, B2, B8 e Riscos. F0 já respondeu: `relativeDatetime` por pill direto e por template literal compilam e serializam igual; `TemplateValue` no `updateRecord` do catch funciona; stage dentro do `try` funciona; `source_record` = inscrição. Execução da espera, `GROUPBY`, `showListChoice`, edição no Designer e transform seguem em teste; plano B de espera = coluna `liberada` + `waitForCondition` + job de 1 minuto. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-029

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Seed aleatório da régua vira DELETE |
| **Descrição** | O seed gerado tem 51 réguas, 50 etapas e 50 canais sorteados, e `comunicacao`, `envio_sim` e `consentimento` apontam para eles; régua e Flow precisam de seed coerente (🟡15). |
| **Impacto se não resolvido** | Flows sem régua correspondente, ou ≈300 registros apagados sem aviso no install. |
| **Pergunta para o negócio** | O seed dessas 6 tabelas passa a ser escrito à mão? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | `seedManual` para as 6 tabelas; régua e etapa pelo gerador de Flows; DELETE confirmado com o usuário. |
| **Afeta camadas** | Dados |
| **Bloqueante para** | install da F2 |
| **Decisão consolidada** | B1 + allowlist: `seedManual` += regua, regua_etapa, canal_sim, consentimento, comunicacao, envio_sim; 5 réguas (uma por carteira), 3 a 4 etapas, `janela_atribuicao_dias: 30`, ITCD com `encaminhar_qualificada`; `seed/regularizacao.now.ts` perde a reference para comunicação; `regua.flow` por `Now.ref('sys_hub_flow', 'flow_regua_<codigo>')` (F0). Confirmar o DELETE com o usuário antes do install da F2. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-030

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | ALTA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Fecho da régua e janela de resposta |
| **Descrição** | O rascunho escalonava logo depois do envio da última etapa, sem dar tempo de o contribuinte responder; etapas intermediárias também podiam escalonar (🟡3). |
| **Impacto se não resolvido** | Contribuinte encaminhado à cobrança ativa minutos depois do último aviso. |
| **Pergunta para o negócio** | Quando e por onde a régua escalona? |
| **Dono sugerido** | Coordenação de Cobrança |
| **Sugestão de tratamento** | Escalonar só no fecho, depois de um prazo de resposta configurável na régua. |
| **Afeta camadas** | Negócio / Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D13: etapas 1..N−1 com `renotificar` ou `intensificar`; etapa N com `encaminhar_ativa` ou `encaminhar_qualificada`; stage «Encaminhamento» agenda N+1 em `iniciada_em + (dia da etapa N + regua.prazo_final_dias) × segundos_por_dia`, confere guardas e escalona. `prazo_final_dias` padrão 5. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

---

### 🟢 Médios — resolver antes de implementar o cenário específico

### CHG-031

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Update, Delete e New por papel |
| **Descrição** | O admin vê Update e Delete ao lado dos verbos; no ciclo, o coordenador precisa de Update na prévia para editar nome, referência e critério (🟡7, 🟡8, 🟡20). |
| **Impacto se não resolvido** | «Registrar ligação» compete com Update; ciclo em prévia sem edição. |
| **Pergunta para o negócio** | Quem vê Update, Delete e New em cada tabela? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Override de `sysverb_update`; `sys_ui_list_control.new_roles`. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D2 + A2: override `UX-009_ua_update_contato` (só admin) e `UX-009_ua_update_ciclo` (`current.estado == 'previa' \|\| gs.hasRole('x_2326104_cob.admin')`); caso, critério, régua e etapa sem mudança; Delete sem mudança (sem ACL de delete). New de contato, régua e etapa (lista e related list `x_2326104_cob_regua_etapa.regua`) só admin por `new_roles: ['x_2326104_cob.admin']` — F0: array; string solta não compila. Plano B: `omit_new_button: true`. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-032

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Ações de form `isClient` não rodam na lista |
| **Descrição** | As UI Actions de contato e caso usam `g_form` e não funcionam na lista; UI Action não recebe parâmetro nem abre modal (🟡13). |
| **Impacto se não resolvido** | Ação aparece na lista e falha ao clicar. |
| **Pergunta para o negócio** | Como cada verbo aparece na lista? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | UI Actions de lista próprias; as que pedem dado só redirecionam ao form. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D1 + A1: 11 UI Actions de lista com actionName `x_cob_l_*`, `showInsert: false`, `showUpdate: false`; as de servidor executam o mesmo método sem redirecionar (Avançar etapa, Publicar ciclo, Distribuir lista, Publicar versão, Pausar, Ativar, Reenviar); Registrar ligação…, Encerrar…, Encerrar caso… e Criar nova versão… só redirecionam. Sem ação em massa para Registrar ligação e Encerrar. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-033

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Limite de 12 módulos do coordenador |
| **Descrição** | O ux-v1 fixou 12 entradas para o coordenador (M2, CHG-013); «Lista da equipe» e «Inscrições» somam 14 (🟡11). |
| **Impacto se não resolvido** | Um dos dois módulos fica de fora, ou o Playwright do ux-v1 quebra. |
| **Pergunta para o negócio** | O limite sobe ou algum módulo sai? |
| **Dono sugerido** | Dono do produto |
| **Sugestão de tratamento** | Limite sobe para 14; listas seguem com até 6 colunas. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D5: coordenador com 14 módulos (revoga v1 l.35 e l.206 nesse ponto); entra `proxima_acao` e sai uma coluna por lista (A3). Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-034

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Lista da equipe e admin do app |
| **Descrição** | «Minha lista» filtra pelo usuário e o separador é só do atendente; coordenador e admin caem em lista vazia. O papel `x_2326104_cob.admin` não herda o coordenador (🟡11, 🟡12). |
| **Impacto se não resolvido** | Coordenador não vê a lista da equipe; admin sem contatos próprios. |
| **Pergunta para o negócio** | Onde fica a lista da equipe e quem é «admin»? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Separador «Equipe» próprio; admin = admin de sistema, sem herdar o coordenador. |
| **Afeta camadas** | Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D4 + D20: separador «Equipe» (order 150) com «Lista da equipe» = `contato` `status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em`, papéis coordenador e admin; admin vê as linhas por `CarteiraAtendente.veTudo`, mas não os verbos do coordenador. Plano B do `GROUPBY` (F0 em teste): lista ordenada por atendente. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-035

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | «O que fazer agora» |
| **Descrição** | Nenhuma lista diz o próximo passo; o rascunho previa coluna também em critério e inscrição e não dizia como preencher os registros existentes (🟡14). |
| **Impacto se não resolvido** | Coluna vazia em parte dos registros (G3 falha). |
| **Pergunta para o negócio** | Em que tabelas, com que textos e como preencher o que já existe? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Contato, caso e ciclo; BR before; backfill pelo seed. |
| **Afeta camadas** | Negócio / Dados / Tela / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D3 + A3: `proxima_acao` (string 120, só leitura) em contato, caso e ciclo, gravado por BR before insert/update a partir de `ProximaAcao.texto(gr)` (tabela de textos de A3, `gs.getMessage`); aviso «Próximo passo: …» por BR display só no contato aberto; backfill por `gerar-seed-demo.mjs`, sem fix script. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-036

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Estrutura da etapa validada só no gerador |
| **Descrição** | Se só o gerador validar a sequência de postura, a ordem dos dias e o sigilo nos textos, o form grava estrutura inválida (🟡21; L23, RN-13/17). |
| **Impacto se não resolvido** | Régua que salta de postura ou expõe valor em SMS. |
| **Pergunta para o negócio** | Onde a estrutura da etapa é validada? |
| **Dono sugerido** | Coordenação de Cobrança + FDE |
| **Sugestão de tratamento** | BR before insert/update da etapa com as mesmas regras do gerador. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D17: `regua_etapa.postura` (utilitaria, consciente, explicativa, ameacadora); BR `validarEtapa` recusa postura que regride ou salta nível, dia fora de ordem, encaminhar fora da última etapa ou última sem encaminhar, e `R$`, `{valor}`, `{debito}`, `{tributo}` em texto de e-mail, SMS e WhatsApp. O gerador repete as validações. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-037

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Consentimento vigente, falha simulada e ordem de fallback |
| **Descrição** | Vários registros de consentimento por canal, três campos de falha simulada (`canal_sim.forcar_falha`, `canal_sim.falhar`, `envio_sim.falhar`) e ordem de fallback em campo e em regra (🟡16–19). |
| **Impacto se não resolvido** | Cada guarda lê uma fonte diferente; resultados divergem entre teste e demo. |
| **Pergunta para o negócio** | Qual é a fonte única de cada valor? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Uma fonte por valor; constantes no motor. |
| **Afeta camadas** | Dados / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D18 + B1: consentimento vigente = mais recente por contribuinte e canal (`registrado_em`, depois `sys_created_on`); só `canal_sim.forcar_falha` vale; `ORDEM_FALLBACK = ['sne','email','sms']` no motor; `regua.ordem_fallback` sai de lista e form (coluna fica); 1 comunicação por inscrição e etapa, 1 `envio_sim` por tentativa real, canal pulado só em `comunicacao.motivo`. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-040

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | CONFLITO |
| **Severidade** | MÉDIA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Stories F4 pendentes × régua como Flow |
| **Descrição** | STORY-MOD-F4-001..006 e 009 (PENDING) preveem outros artefatos: flow único `comunicacao-disparar-regua`, script includes de escalonar e de fallback, BR de opt-in na comunicação, BR de encaminhar na comunicação. O design implementa os mesmos RF por Flow por régua + `ReguaMotor`. |
| **Impacto se não resolvido** | Dois desenhos para o mesmo RF no backlog; implementação em dobro. |
| **Pergunta para o negócio** | As stories antigas seguem ou dão lugar às novas? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Implementar RF-MOD-F4-001..006 e 009 pelas STORY-MOD-F4-010..016; as antigas ficam no backlog sem implementação própria. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | spec-tasks_change |
| **Decisão consolidada** | D8, D10 e Fases do design: as stories novas carregam os RF (traceability) e os testes de B9; STORY-MOD-F4-001..006 e 009 não são alteradas no `tasks.json` e não geram artefato próprio; F4-007 e F4-008 ficam como estão (Non-Goals). Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

---

### ⚪ Baixos — podem ser resolvidos em sprint

### CHG-038

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | QUESTÃO_ABERTA |
| **Severidade** | BAIXA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Regularização encerra contatos abertos (RN-09) |
| **Descrição** | A régua para ao regularizar (G8), mas o contato aberto na lista do atendente continua aberto; a revisão pediu decidir se a v2 encerra também o contato (🟡9, 🟡26). |
| **Impacto se não resolvido** | Atendente liga para quem já pagou. |
| **Pergunta para o negócio** | A v2 encerra o contato aberto quando o contribuinte regulariza? |
| **Dono sugerido** | Dono do produto |
| **Sugestão de tratamento** | Fora da v2; registrar como GAP. |
| **Afeta camadas** | Negócio |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | Non-Goals: fora da v2; GAP-154 em `outputs/spec/gaps-document.md` (continua o GAP-021 do ux-v1). Nenhuma BR de carteira precisa de exceção de sistema (B5). Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-039

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | DEPENDÊNCIA_EXTERNA |
| **Severidade** | BAIXA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Volume de contextos de Flow em produção |
| **Descrição** | Um contexto de Flow fica esperando por inscrição ativa. Na demo são dezenas; na carteira real da SEFAZ-MT, um por contribuinte inscrito. |
| **Impacto se não resolvido** | Carga de contextos em espera na instância de produção. |
| **Pergunta para o negócio** | O desenho de um contexto por inscrição serve para produção? |
| **Dono sugerido** | FDE + arquitetura da SEFAZ-MT |
| **Sugestão de tratamento** | Fora da demo; registrar GAP com o número do seed e a alternativa de lote agendado. |
| **Afeta camadas** | Negócio |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | Riscos do design: GAP-155 em `outputs/spec/gaps-document.md` com o volume do seed e a alternativa de lote agendado. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

### CHG-041

| Campo | Conteúdo |
|-------|----------|
| **Tipo** | INCOMPLETO |
| **Severidade** | BAIXA |
| **Status** | decidido |
| **Documento de origem** | `docs/designs/ux-cobranca-v2-regua-flow.md` (v2.1) + revisão regua-flow |
| **Tema** | Edição no Flow Designer perdida no reinstall |
| **Descrição** | O `npm run reinstall` reinstala a fonte Fluent e sobrescreve o que o coordenador mudou no Designer; mudança de estrutura com inscrições em andamento deixa contexto órfão (🟡22). |
| **Impacto se não resolvido** | Mudança do coordenador some sem aviso; régua removida vira DELETE do Flow. |
| **Pergunta para o negócio** | Como preservar a edição feita no Designer? |
| **Dono sugerido** | FDE |
| **Sugestão de tratamento** | Conferir `sys_hub_flow` editado antes do reinstall; `now-sdk transform`; `flowManual` no JSON. |
| **Afeta camadas** | Negócio / Testes |
| **Bloqueante para** | nenhum |
| **Decisão consolidada** | B6: antes do reinstall, consultar `sys_hub_flow` `internal_nameSTARTSWITHregua_^sys_updated_by!=<usuário do install>`; havendo edição, `npm run transform` em `app/` e levar à fonte (estrutura → `reguas.json` e regerar; o resto → `"flowManual": true`). Mudança de estrutura com inscrições em andamento: Pausar, reinstalar, Ativar; régua removida do JSON só com confirmação do usuário. Vai para o roteiro e o sync-log. Decisor: dono (design v2.1), 25/11/2026. (seguiu sugestão) |

---

## Respostas

### CHG-019
**Decisão:** P1 = ambos (D14): distribuição igual à UX-004 e encaminhamento da régua por `atribuirContato` com dedupe por contribuinte + ciclo; `contato.origem` e `contato.inscricao`.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Testes — STORY-MOD-F4-012 (TASK-MOD-F4-012-02), STORY-MOD-UX-010 (`origem` no seed); divergiu da sugestão (só pela régua).

### CHG-020
**Decisão:** P2 = ambos (D15): parâmetros no form; Flow no Designer com papel `flow_designer`/`flow_operator` contido no coordenador; transform antes do reinstall.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Tela / Testes — STORY-MOD-F4-014; divergiu da sugestão (cortar o Designer).

### CHG-021
**Decisão:** P3 = sim (D16): gatilho em parcelamento virando «em risco»; guarda pelo parcelamento da inscrição.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Testes — STORY-MOD-F4-013; seguiu sugestão.

### CHG-022
**Decisão:** D19 + D18: teto de 1 tentativa por contribuinte e canal na janela de `segundos_por_dia`.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — STORY-MOD-F4-011; seguiu sugestão.

### CHG-023
**Decisão:** B5: write de régua e etapa para coordenador e admin; campos estruturais só admin.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Testes — STORY-MOD-F4-010 (TASK-MOD-F4-010-05); seguiu sugestão.

### CHG-024
**Decisão:** B5: read para os 3 papéis, deny por carteira, BR de query no mapa `DONO`, sem escrita para as personas.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados / Testes — STORY-MOD-F4-010 (read em acl-base), STORY-MOD-F4-013 (deny e BR de query); seguiu sugestão.

### CHG-025
**Decisão:** D7: BR after update do ciclo prévia → publicado chama `ReguaMotor.inscrever`.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — STORY-MOD-F4-012; seguiu sugestão.

### CHG-026
**Decisão:** B3: `enviar` idempotente por inscrição + etapa; `escalonar` por status da inscrição; `atribuirContato` com dedupe.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Testes — STORY-MOD-F4-011, STORY-MOD-F4-012; seguiu sugestão.

### CHG-027
**Decisão:** D10 + B3: 4 custom actions com contrato final na F2; F0: `ordem` só número, reference por GlideRecord, `parseInt` no script.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — STORY-MOD-F4-010 (TASK-MOD-F4-010-03); seguiu sugestão.

### CHG-028
**Decisão:** D11, B2, B8 e Riscos; F0 confirmou `relativeDatetime` (pill e template), `TemplateValue`, stage no `try` e `source_record`; demais pontos em teste com plano B.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — STORY-MOD-F4-010, STORY-MOD-F4-014; seguiu sugestão.

### CHG-029
**Decisão:** `seedManual` para as 6 tabelas; régua e etapa pelo gerador; DELETE do seed aleatório confirmado com o usuário antes do install da F2.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados — STORY-MOD-F4-010 (TASK-MOD-F4-010-02); seguiu sugestão.

### CHG-030
**Decisão:** D13: escalonar só no stage «Encaminhamento», depois de `prazo_final_dias`.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Testes — STORY-MOD-F4-010, STORY-MOD-F4-012; seguiu sugestão.

### CHG-031
**Decisão:** D2 + A2: override de Update em contato e ciclo; New só admin por `new_roles` em array (F0).
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — STORY-MOD-UX-009; seguiu sugestão.

### CHG-032
**Decisão:** D1 + A1: UI Actions de lista próprias; as que pedem dado redirecionam ao form.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — STORY-MOD-UX-009, STORY-MOD-F4-012, STORY-MOD-F4-016; seguiu sugestão.

### CHG-033
**Decisão:** D5: coordenador com 14 módulos; listas com até 6 colunas.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — STORY-MOD-UX-010, STORY-MOD-F4-012; seguiu sugestão.

### CHG-034
**Decisão:** D4 + D20: separador «Equipe» com «Lista da equipe»; admin = admin de sistema.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Tela / Testes — STORY-MOD-UX-010; seguiu sugestão.

### CHG-035
**Decisão:** D3 + A3: `proxima_acao` em contato, caso e ciclo por BR before; aviso só no contato; backfill pelo seed.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Dados / Tela / Testes — STORY-MOD-UX-010; seguiu sugestão.

### CHG-036
**Decisão:** D17: BR `validarEtapa` com as mesmas validações do gerador.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — STORY-MOD-F4-010 (TASK-MOD-F4-010-04); seguiu sugestão.

### CHG-037
**Decisão:** D18 + B1: uma fonte por valor (consentimento vigente, `forcar_falha`, constantes do motor).
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Dados / Testes — STORY-MOD-F4-011; seguiu sugestão.

### CHG-038
**Decisão:** RN-09 fora da v2; GAP-154.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio — nenhum artefato de código; seguiu sugestão.

### CHG-039
**Decisão:** GAP-155 com o volume do seed e a alternativa de lote agendado.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio — nenhum artefato de código; seguiu sugestão.

### CHG-040
**Decisão:** RF-MOD-F4-001..006 e 009 implementados pelas STORY-MOD-F4-010..016; stories antigas sem alteração e sem artefato próprio.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — tasks.json (FEAT-F4-FLOW); seguiu sugestão.

### CHG-041
**Decisão:** B6: conferir edição no Designer antes do reinstall; transform; `flowManual`; pausar antes de mudança de estrutura.
**Decidido por:** dono (design v2.1)
**Data:** 2026-11-25
**Impacto nos artefatos _change:** Negócio / Testes — STORY-MOD-F4-014 (roteiro); seguiu sugestão.

---

*Todos os CHGs do ux-v2 decididos: F1 (UX-009, UX-010) liberada; F2 liberada com a confirmação do DELETE do seed antes do install.*
