---
generated-by: spec-scope-change v1.2
project: "Cobrança MT — piloto 2.6 Cobrança (Speckit ServiceNow)"
date: "2026-11-25"
total-chgs: 18
critical: 3
high: 7
medium: 5
low: 3
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
