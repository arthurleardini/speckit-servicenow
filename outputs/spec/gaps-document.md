# Documento de Gaps — Cobrança MT (piloto 2.6 Cobrança, Speckit ServiceNow v0)

**Gerado por:** spec-tasks (tasks/v5.4)
**Data:** 2026-11-24
**Projeto:** Cobrança MT, app `x_2326104_cob`, dados fictícios

> **Instruções:** preencha a seção `## Respostas` de cada gap. Depois, o agente propaga a resposta
> para o `tasks.json` e registra no `sync-log.md`.
>
> As questões abertas do pré-projeto continuam no registro único delas (GAP-006 a GAP-020). Este
> documento lista só o que a decomposição do backlog levantou, com numeração a partir de GAP-101
> para não colidir com aquele registro.

---

## Gaps Identificados

### GAP-101 — Busca e filtro padronizados sem regra de negócio própria

**Área:** MOD-T, `STORY-MOD-T-002`
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-T-002-01

**Descrição:**
O RF-MOD-T-002 não cita nenhuma RN («Regras de Negócio aplicáveis: —»), e nenhuma RN aponta para ele
no campo «Vinculada a». A story usa a RN-NOVO-F5-007 (atendente vê só a própria carteira), porque o
filtro por atendente nas listas obedece à carteira. O registro fica em `metadata.enrichmentGaps[]`.

**Contexto:**
Cenários do RF: filtrar por tributo, combinar filtros e filtro sem resultado. Casos do plano de
testes CT-MOD-T-003, CT-MOD-T-004 e CT-MOD-T-009 (filtro de dias de atraso só aceita número).

**Opções identificadas:**
1. Manter a RN-NOVO-F5-007 como regra da story: a busca não tem regra própria além da carteira.
2. Criar uma RN própria na `spec-product` (por exemplo, filtros mínimos por lista e validação de tipo do valor filtrado) e trocar a referência na story.

### GAP-102 — Dependências entre RF formam ciclo no nível de épico

**Área:** EPIC-002, EPIC-003, EPIC-005, EPIC-006
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** nenhuma (ordem do backlog)

**Descrição:**
As dependências declaradas nos RF não têm ciclo entre stories, mas ao subir para os épicos formam
um: RF-MOD-F2-005 depende de RF-MOD-F3-001 (EPIC-002 → EPIC-003), RF-MOD-F3-003 depende de
RF-MOD-F5-003 (EPIC-003 → EPIC-005) e RF-MOD-F5-001 depende de RF-MOD-F2-004 (EPIC-005 → EPIC-002).
O ordenador do backlog avisa (BACKLOG_ORDER_ACYCLIC) e deixa os épicos na ordem de desempate.

**Opções identificadas:**
1. Manter: a ordem que importa é a das stories, que não tem ciclo.
2. Rever a dependência do score no dossiê (RF-MOD-F3-003 → RF-MOD-F5-003), que é a que cruza de volta.

### GAP-103 — Campos de controle da versão editáveis no rascunho (SEC-021 proposto)

**Área:** MOD-F2, `STORY-MOD-F2-002`
**Impacto:** Média
**Tipo:** SEGURANÇA
**Tasks afetadas:** SEC-009

**Descrição:**
A auditoria da US-MOD-F2-002 (`outputs/spec/auditorias/US-MOD-F2-002.md`, achado SEC-021) aponta que, no rascunho, coordenador e admin do app ainda gravam campos de controle (estado, versão anterior, publicada em/por) pelo form ou pela API; o servidor já recusa a publicação fora do coordenador e completa data e autor.

**Opções identificadas:**
1. ACL de campo sem gravação por usuário nos campos de controle e transições de estado só rascunho → publicada → substituída.
2. Manter: a business rule de gravação já cobre papel, motivo, data e autor.

### GAP-104 — Critério sem código substitui versões de outros critérios (BUG-001)

**Área:** MOD-F2, `STORY-MOD-F2-002`
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
`CriterioVersao.substituirAnteriores` consulta por código; com código vazio, a consulta pega outras versões sem código (auditoria US-MOD-F2-002, BUG-001).

**Opções identificadas:**
1. Tornar `codigo` obrigatório no `data-model.json`.
2. Não substituir quando o código está vazio.

### GAP-105 — «Nome é obrigatório» no form mostra a mensagem da plataforma (CONF-001)

**Área:** MOD-F2, TEL-008
**Impacto:** Média
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
O texto do critério de aceite aparece por script, API e importação; no form o dicionário barra antes com a mensagem padrão de campo obrigatório.

**Opções identificadas:**
1. Aceitar a mensagem da plataforma no form.
2. Mensagem de campo por UI Policy ou Client Script de envio.

### GAP-106 — Atendente vê o módulo e os critérios de qualificação (CONF-002)

**Área:** MOD-F2, menu e ACL gerados
**Impacto:** Média
**Tipo:** SEGURANÇA
**Tasks afetadas:** STORY-SEC-TRANSVERSAL

**Descrição:**
O cenário AS-TASK-MOD-F2-002-02-01 pede o menu sem os 3 módulos para o atendente; o menu e a ACL de leitura são gerados pelo `sn-scaffold`.

**Opções identificadas:**
1. Tirar o papel atendente dos módulos e da ACL de leitura de critério/ciclo/segmentação pelo `data-model.json` + `sn-scaffold`.
2. Tratar na story de segurança transversal.

### GAP-107 — G3 do fio condutor rodou sem validadores de LLM (CONF-005)

**Área:** Deliver, fio condutor
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-01..03, SEC-009

**Descrição:**
Os agentes validadores de `.claude/agents/` não estavam carregados na sessão; o G3 rodou com `--sem-agentes` (parte determinística: build, ATF, varredura e mensagens), como a `sn-implement` prevê.

**Opções identificadas:**
1. Rodar o G3 com validadores numa sessão com os agentes carregados.
2. Registrar a isenção de G3 por story.

### GAP-108 — Código + versão únicos por consulta, sem índice (BUG-002, PERF-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
A unicidade é conferida por consulta na business rule, sujeita a corrida e sem índice.

**Opções identificadas:**
1. Índice único `codigo`+`versao` no `data-model.json`.
2. Manter a consulta.

### GAP-109 — Mensagem de duplicado para qualquer falha ao criar versão (BUG-003)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-03

**Descrição:**
`criarNovaVersao` devolve a mensagem de duplicado para qualquer falha de gravação.

**Opções identificadas:**
1. Mensagem neutra e `gs.warn`.

### GAP-110 — Comentário barrado em versão publicada (BUG-004)

**Área:** MOD-F2, TEL-008
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
A ACL de gravação por estado também bloqueia o campo de comentários na versão publicada.

**Opções identificadas:**
1. ACL de campo para `comentarios` sem condição de estado.
2. Manter: versão publicada sem comentário novo.

### GAP-111 — Log de recusa sem usuário e operação (OBS-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
As recusas geram `gs.warn` com sys_id do registro e a mensagem, sem o usuário e a operação.

**Opções identificadas:**
1. Incluir usuário, tabela, operação e SEC-009 no log.

### GAP-112 — Gravação do botão com GlideRecord e conferência de papel (CONF-007)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** SEGURANÇA
**Tasks afetadas:** TASK-MOD-F2-002-02, TASK-MOD-F2-002-03

**Descrição:**
`publicar` e `criarNovaVersao` conferem o papel e gravam com `GlideRecord`; `security.mdc` pede `GlideRecordSecure` ou `canWrite/canCreate` no código chamado pelo usuário.

**Opções identificadas:**
1. `canWrite/canCreate` antes de gravar.

### GAP-113 — Ciclo incluído já publicado ou com critério em rascunho (CONF-004)

**Área:** MOD-F2, ciclo
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F2-004-02, SEC-010

**Descrição:**
A regra do ciclo olha só alteração; inclusão já publicada não é recusada.

**Opções identificadas:**
1. Tratar na US-MOD-F2-004 (publicação do ciclo).

### GAP-114 — Data Policy do SEC-009 não criada (CONF-003)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** SEGURANÇA
**Tasks afetadas:** SEC-009

**Descrição:**
A business rule cobre importação que roda business rules; transform map configurado para não rodá-las passaria.

**Opções identificadas:**
1. Criar a Data Policy.
2. Registrar no plano de segurança a troca pela business rule.

### GAP-115 — Estado e versão padrão por business rule, não pelo dicionário (CONF-006)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
O padrão «rascunho» e versão 1 vêm da business rule; o form começa com «Estado» vazio.

**Opções identificadas:**
1. Valor padrão no `data-model.json` e regerar.

### GAP-116 — Sem evidência RED guardada; padrão e mensagem no form sem teste (TEST-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-002-01

**Descrição:**
Os testes provam os lados positivo e negativo, mas a saída RED de antes da correção não foi guardada.

**Opções identificadas:**
1. Guardar a saída RED nas próximas regras.

### GAP-117 — Contribuinte entra no grupo de controle sem sorteio (SEC-022 proposto; absorve o GAP-113)

**Área:** MOD-F2, `STORY-MOD-F2-004`
**Impacto:** Média
**Tipo:** SEGURANÇA
**Tasks afetadas:** SEC-010

**Descrição:**
A auditoria da US-MOD-F2-004 (`outputs/spec/auditorias/US-MOD-F2-004.md`, SEC-022) aponta três caminhos: marcar «controle» com o ciclo em prévia (a publicação mantém e soma), incluir ou excluir linha da segmentação depois de publicado, e incluir o ciclo já publicado.

**Opções identificadas:**
1. Recusar «controle» pré-existente na publicação, business rule before insert/delete na segmentação de ciclo publicado e ciclo nascendo em prévia (task SEC-022).
2. Aceitar o risco no piloto.

### GAP-118 — Semente do sorteio gerada com Math.random() (CONF-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** SEGURANÇA
**Tasks afetadas:** TASK-MOD-F2-004-01

**Descrição:**
A regra de segurança do projeto pede gerador criptográfico; a semente é gerada no servidor, na publicação, e gravada.

**Opções identificadas:**
1. `GlideSecureRandomUtil` na semente.

### GAP-119 — Sorteio grava um contribuinte por vez (PERF-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-004-01

**Descrição:**
Cada sorteado é gravado num update próprio, com a consulta da business rule da segmentação.

**Opções identificadas:**
1. `updateMultiple()` por lista de contribuintes.

### GAP-120 — Contribuinte repetido no mesmo ciclo conta duas vezes (BUG-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-004-01

**Descrição:**
Sem índice único ciclo + contribuinte, uma linha repetida entra duas vezes nos elegíveis.

**Opções identificadas:**
1. Índice único no `data-model.json`.
2. Contar elegíveis distintos.

### GAP-121 — Comunicação ou caso sem ciclo e ciclo encerrado (BUG-002)

**Área:** MOD-F2, MOD-F4, MOD-F5
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F2-004-01

**Descrição:**
Sem ciclo informado, a recusa olha qualquer ciclo publicado; depois de encerrado o ciclo, a recusa deixa de valer.

**Opções identificadas:**
1. Decidir com o PO se o ciclo é obrigatório na comunicação e no caso, e o que vale após o encerramento.

### GAP-122 — Suíte cob-regressao sem recibo verde no commit da US (TEST-001)

**Área:** Deliver
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** —

**Descrição:**
Os installs por story rodaram com `--sem-atf` e o ATF por story; a suíte inteira roda no `npm run reinstall` completo do fim do fio condutor.

**Opções identificadas:**
1. Rodar o reinstall completo ao fim do fio condutor e guardar o recibo da suíte.

### GAP-123 — Mensagens ao usuário em texto fixo (CONF-003)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-004-01, TASK-MOD-F2-004-02

**Descrição:**
As mensagens das regras estão em texto fixo, sem `gs.getMessage`.

**Opções identificadas:**
1. Mensagens traduzíveis por `gs.getMessage`.

### GAP-124 — Score lido do contribuinte, não da última ingestão válida do SIM-01 (CONF-001)

**Área:** MOD-F2, MOD-F3
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-01, STORY-MOD-F3-001

**Descrição:**
`SegmentacaoScore` usa `contribuinte.score`; a arquitetura pede ler a última linha válida de `score_sim` por um Script Include `ScoreUfmt` (auditoria US-MOD-F2-005).

**Opções identificadas:**
1. Ler pelo `ScoreUfmt` quando a STORY-MOD-F3-001 entregar a ingestão.
2. Manter o campo do contribuinte no piloto.

### GAP-125 — Débito não aberto entra no valor e no atraso (BUG-001)

**Área:** MOD-F2
**Impacto:** Média
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F2-005-01

**Descrição:**
A soma do valor e o maior atraso consideram todos os débitos do contribuinte, inclusive regularizados.

**Opções identificadas:**
1. Filtrar débitos em aberto.
2. Definir com o PO quais status contam.

### GAP-126 — Exclusão de contumaz não aplicada na classificação (CONF-002)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** STORY-MOD-F2-003

**Descrição:**
A regra determinística não considera «Excluir contumazes» da versão.

**Opções identificadas:**
1. Regra determinística num ponto só, na STORY-MOD-F2-003 (gerar prévia).

### GAP-127 — US-MOD-F2-005 sem teste ATF de form (TEST-001)

**Área:** MOD-F2, TEL-010
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-01, TASK-MOD-F2-005-02

**Descrição:**
A regra é de servidor e está provada por ATF de servidor; não há passo de form na TEL-010 nem isenção `atf-form` registrada.

**Opções identificadas:**
1. Teste de form na TEL-010 (coluna «Sem score»).
2. Registrar a isenção de ATF de form da story.

### GAP-128 — «Sem score» do contribuinte só é marcado, nunca desmarcado (BUG-002)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-02

**Descrição:**
A regra marca o contribuinte quando a linha fica sem score e não desmarca quando o score volta.

**Opções identificadas:**
1. Marcar e desmarcar pela linha mais recente.

### GAP-129 — Threshold vazio vale 0 com «Usar score» (BUG-003)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F2-005-01

**Descrição:**
Com «Usar score» marcado e threshold vazio, todo score válido passa.

**Opções identificadas:**
1. Exigir threshold 0–100 quando «Usar score» está marcado.

### GAP-130 — Total «Sem score» do ciclo regravado durante a publicação (BUG-004)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-02

**Descrição:**
A regra `after` roda em toda gravação de linha sem score, inclusive na marcação do controle.

**Opções identificadas:**
1. Condição `sem_score` mudou na regra `after`.

### GAP-131 — Consultas por linha na classificação (PERF-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-01

**Descrição:**
Versão, ciclo e débitos são lidos a cada linha inserida.

**Opções identificadas:**
1. Carregar versão e ciclo uma vez na prévia e somar o total no fim.

### GAP-132 — Linha sem versão do critério fica sem segmento e sem aviso (OBS-001)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-01

**Descrição:**
Quando nem a linha nem o ciclo têm versão, a linha fica sem segmento.

**Opções identificadas:**
1. `gs.warn` com o sys_id ou recusar a inclusão.

### GAP-133 — Seed com score fora de 0–100 (CONF-003)

**Área:** Seed
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** —

**Descrição:**
O gerador do seed grava scores fora da faixa, que a regra trata como «sem score».

**Opções identificadas:**
1. Faixa 0–100 no gerador do seed.

### GAP-134 — Bordas do score sem teste (TEST-002)

**Área:** MOD-F2
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F2-005-01

**Descrição:**
Score igual ao threshold, threshold vazio, débito não aberto, alteração e exclusão de linha.

**Opções identificadas:**
1. Acrescentar os testes de borda.

### GAP-135 — Atendente grava qualquer campo do próprio caso e o autor da interação (SEC-023 proposto)

**Área:** MOD-F5, `STORY-MOD-F5-007`
**Impacto:** Média
**Tipo:** SEGURANÇA
**Tasks afetadas:** SEC-002

**Descrição:**
A auditoria da US-MOD-F5-007 (`outputs/spec/auditorias/US-MOD-F5-007.md`, SEC-023) aponta que a ACL de campo `*` deixa o atendente gravar prioridade, score e sinalização do próprio caso e o autor da interação; a troca do dono do caso já é recusada.

**Opções identificadas:**
1. ACL de campo só nos campos de encerramento e de interação; `interacao.atendente` preenchido no servidor (task SEC-023).
2. Aceitar no piloto.

### GAP-136 — Dono do caso diverge do dono do contribuinte no seed (BUG-001)

**Área:** MOD-F5, seed
**Impacto:** Média
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F5-007-01, TASK-MOD-F5-007-02

**Descrição:**
Em 22 dos 51 casos do seed o atendente do caso é outro que o do contribuinte; nesses casos o atendente vê o caso, mas não o contribuinte nem os débitos dele.

**Opções identificadas:**
1. Dono único: o caso herda o atendente do contribuinte; seed coerente.
2. ACL do contribuinte também pelo caso.

### GAP-137 — Lacunas de teste da carteira (TEST-001)

**Área:** MOD-F5
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** SEC-002

**Descrição:**
Sem ATF de form na TEL-023/TEL-024 desta story; sem teste de regularização, comunicação, consentimento, score, admin do app, «Meus indicadores» e campo não gravável.

**Opções identificadas:**
1. Acrescentar os testes (o form do dossiê é testado na US-MOD-F5-003).
2. Registrar a isenção de ATF de form.

### GAP-138 — ACL de negação da carteira só com script (CONF-002)

**Área:** MOD-F5
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** SEC-002

**Descrição:**
As ACL «nega, a menos que» usam só o script do `CarteiraAtendente`, sem role do app.

**Opções identificadas:**
1. Acrescentar as roles do app nas ACL de negação.

### GAP-139 — Troca do Data Filter por regra de consulta não está na spec (CONF-003)

**Área:** MOD-F5, spec
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** SEC-002

**Descrição:**
O SEC-002 pede Data Filter com Deny; a entrega usa business rule de consulta nas 9 tabelas, com o mesmo efeito (a lista não traz nem conta linha de outra carteira).

**Opções identificadas:**
1. Atualizar o SEC-002 no `plano-de-seguranca.md` e a tabela da carteira no `security.mdc`.

### GAP-140 — ACL de leitura lê o registro referenciado a cada linha (PERF-001)

**Área:** MOD-F5
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** SEC-002

**Descrição:**
O script da ACL faz dot-walk por linha; a regra de consulta já reduz as linhas.

**Opções identificadas:**
1. Condição de ACL no lugar do script.

### GAP-141 — «Nova interação» em branco negada ao atendente (BUG-002, a confirmar)

**Área:** MOD-F5, TEL-025
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F5-007-03

**Descrição:**
A ACL de criação confere o caso; com o caso vazio (form novo fora da related list), a criação é negada.

**Opções identificadas:**
1. Conferir o botão «Novo» na related list do dossiê; deixar passar com caso vazio e conferir na gravação.

### GAP-142 — Abertura de registro de outra carteira sem log (OBS-001)

**Área:** MOD-F5
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** SEC-002

**Descrição:**
A leitura negada pela ACL ou pela regra de consulta não gera log nem contagem.

**Opções identificadas:**
1. Log quando a abertura de registro único volta vazia.

### GAP-143 — Regra de consulta também filtra lógica de servidor na sessão do atendente (BUG-003)

**Área:** MOD-F5
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** SEC-002

**Descrição:**
Business rule e Script Include que rodam na sessão do atendente só enxergam a carteira dele.

**Opções identificadas:**
1. Registrar no `architecture.mdc` e testar a primeira lógica de sistema que rodar como atendente.

### GAP-144 — ATF de form do dossiê cobre só a lista de Interações (TEST-001)

**Área:** MOD-F5, TEL-024
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F5-003-02

**Descrição:**
Faltam no form: as 4 listas filtradas pelo contribuinte do caso, o caso com dono diferente do dono do contribuinte, o form negado a outro atendente e o dossiê visto pelo coordenador (auditoria US-MOD-F5-003). Fecha em parte o GAP-137.

**Opções identificadas:**
1. Acrescentar os testes de form e lista.

### GAP-145 — Suíte cob-regressao sem recibo no commit da US-MOD-F5-003 (TEST-002)

**Área:** Deliver
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** —

**Descrição:**
Mesma causa do GAP-122: a suíte roda no reinstall completo do fim do fio condutor.

**Opções identificadas:**
1. Guardar o recibo da suíte do reinstall completo.

### GAP-146 — Dossiê sem log de montagem e de recusa por caso vazio (OBS-001)

**Área:** MOD-F5
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F5-003-01

**Descrição:**
`CasoDossie.montar()` só registra a recusa por carteira.

**Opções identificadas:**
1. Log com sys_id e motivo em todas as recusas.

### GAP-147 — CasoDossie.montar() só é chamado pelo ATF (CONF-001)

**Área:** MOD-F5
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F5-003-01

**Descrição:**
A tela mostra o dossiê pelo form e pelas listas relacionadas (o filtro das listas usa o mesmo Script Include); a montagem em 3 níveis serve à exportação e a usos futuros.

**Opções identificadas:**
1. Usar na exportação do dossiê (RF-MOD-T-001).
2. Manter só como API de servidor.

### GAP-148 — Mensagens de recusa do dossiê copiadas do texto genérico da spec (CONF-002)

**Área:** MOD-F5, spec
**Impacto:** Baixa
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F5-003-01

**Descrição:**
As mensagens «Operação recusada: dossiê em 3 níveis (premissa).» e «… visão única do contribuinte por documento.» vêm do `errorMessages` gerado na spec e não dizem o que fazer.

**Opções identificadas:**
1. Reescrever as mensagens na spec e no código.

### GAP-149 — Moeda em R$ nos campos currency (polimento UX v1)

**Área:** MOD-UX
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-UX-001-01

**Descrição:**
Os campos `currency` mostram US$: a instância tem `glide.i18n.single_currency.code = USD` e o BRL inativo em `fx_currency`. O Fluent não fixa a moeda por campo; o código da moeda vai no valor (`BRL;1234,56`) e exige o BRL ativo. As duas saídas mexem em configuração global da instância.

**Opções identificadas:**
1. Ativar o BRL em `fx_currency` e gravar os valores do seed como `BRL;<valor>`.
2. Trocar `currency` por `decimal` com rótulo «(R$)» no data-model (os rótulos já trazem «(R$)»).

### GAP-150 — «Registrar ligação» lê o resultado do campo «Último resultado» (BUG-001 da US-MOD-UX-002)

**Área:** MOD-UX
**Impacto:** Média
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-UX-002-01

**Descrição:**
O form traz o resultado da ligação anterior; se o atendente não trocar, o verbo usa o resultado antigo. Repetir o mesmo resultado (sem contato duas vezes) é o caso comum, então recusar valor inalterado também não serve.

**Opções identificadas:**
1. Campo próprio «Resultado desta ligação» no contato, limpo depois de cada registro.
2. Diálogo do botão com o resultado e a anotação.

**Status:** FECHADO em 2026-11-25 (opção 1, commit eef1dfa). Ver a resposta abaixo.

### GAP-151 — ATF não clica os botões cliente + servidor (TEST-001 das US-MOD-UX-002, 003 e 005)

**Área:** MOD-UX
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-UX-002-01, TASK-MOD-UX-003-01, TASK-MOD-UX-005-02

**Descrição:**
As regras estão provadas no Script Include e a visibilidade dos botões no form; o clique (setMandatory, leitura de Comentários, retorno por `proxima_acao_em.changes()`) foi exercido só pelo script de prints `outputs/spec/screens/ux-v1/acoes.mjs`.

**Opções identificadas:**
1. Teste de form com `clickUIAction` e validação do registro.

### GAP-152 — Encerrar caso e ordem das etapas valem só nos botões (SEC-001 da US-MOD-UX-005)

**Área:** MOD-UX
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-UX-005-02

**Descrição:**
O coordenador grava `estagio=encerrado` sem motivo, ou pula etapa, pelo form, lista ou API. O contato já recusa encerramento sem motivo por business rule.

**Opções identificadas:**
1. Business rule before update no caso: encerrado exige motivo; estágio só anda uma etapa por vez.

**Status:** FECHADO em 2026-11-25 (opção 1 mais ACL de campo, commit eef1dfa). Ver a resposta abaixo.

### GAP-153 — Ressalvas baixas das auditorias UX-002..006

**Área:** MOD-UX
**Impacto:** Baixa
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-UX-002..006

**Descrição:**
Itens baixos registrados nos relatórios `outputs/spec/auditorias/US-MOD-UX-00{2..6}.md`: retorno no passado aceito; dois cliques simultâneos em «Distribuir lista» ou «Registrar ligação»; rodízio sem considerar carga; laço síncrono na distribuição; logs de recusa por papel; dono da interação conferido pelo valor novo; autoria (`interacao.atendente`) livre na criação por lista/API; motivo exigido em todo update de contato encerrado; troca manual do atendente do contato sem acompanhar o contribuinte; ACL de delete do contato implícita; mapa de etapa_ordem repetido no seed; caso grava o `current` do form nos botões.

**Opções identificadas:**
1. Tratar em lote numa story de endurecimento antes da demo.

### GAP-154 — Regularização não encerra os contatos abertos (RN-09 fora da v2)

**Área:** MOD-UX / MOD-F4
**Impacto:** Média
**Tipo:** NEGÓCIO
**Tasks afetadas:** TASK-MOD-F4-012-01, TASK-MOD-UX-003-01

**Descrição:**
Na v2, quando o débito vira regularizado ou parcelado, a inscrição na régua encerra na mesma transação (`ReguaMotor.reavaliar`) e nenhuma etapa seguinte envia. O contato aberto na lista do atendente continua aberto: só sai por «Registrar ligação» ou «Encerrar» com motivo «regularizado». O design v2.1 (25/11/2026, CHG-038) deixou a RN-09 fora, como no ux-v1 (GAP-021 do registro do pré-projeto). Falta decidir momento da regra, o que conta como «aberto» e se o motor encerra contato como sistema (hoje `recusarContatoForaDaCarteira` é só de update e nenhuma BR de carteira tem exceção de sistema).

**Opções identificadas:**
1. Manter fora: o atendente encerra à mão; «O que fazer agora» não muda.
2. `ReguaMotor.reavaliar` encerra também o contato aberto do contribuinte no ciclo, com motivo «regularizado», gravando como sistema.

### GAP-155 — Um contexto de Flow esperando por inscrição: volume em produção

**Área:** MOD-F4
**Impacto:** Média
**Tipo:** TÉCNICO
**Tasks afetadas:** TASK-MOD-F4-010-03, TASK-MOD-F4-012-01

**Descrição:**
Cada inscrição ativa mantém um contexto de Flow em espera (`waitForADuration` relativo) até a etapa seguinte. No seed da demo são 5 réguas e 51 contribuintes; uma publicação inscreve a massificada com débito em aberto (40 segmentações massificadas no seed, 28 contatos no Ciclo 2026-11), ou seja, dezenas de contextos. Em produção, a carteira real da SEFAZ-MT gera um contexto por contribuinte inscrito, cada um esperando até `prazo_final_dias` depois da última etapa (≈35 dias na régua IPVA com 86400 s por dia). O design v2.1 (CHG-039) deixa o volume fora da demo.

**Opções identificadas:**
1. Manter um Flow por inscrição e medir contextos em espera na instância de homologação.
2. Lote agendado: um Scheduled Script diário marca as inscrições com `proxima_etapa_em` vencida e chama as mesmas ações do `ReguaMotor` (mesmo desenho do plano B de `relativeDatetime`: coluna `liberada` + job), sem contexto em espera por inscrição.

---

## Respostas

### GAP-101
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-102
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-103
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-104
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-105
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-106
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-107
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-108
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-109
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-110
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-111
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-112
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-113
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-114
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-115
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-116
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-117
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-118
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-119
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-120
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-121
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-122
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-123
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-124
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-125
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-126
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-127
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-128
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-129
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-130
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-131
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-132
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-133
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-134
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-135
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-136
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-137
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-138
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-139
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-140
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-141
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-142
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-143
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-144
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-145
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-146
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-147
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-148
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-149
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-150
**Decisão:** Opção 1. O contato ganhou o campo «Resultado desta ligação» (`resultado_ligacao`), que abre sempre vazio no form: uma business rule before insert/update limpa o valor em toda gravação, então ele nunca fica gravado. O botão «Registrar ligação» exige esse campo no cliente e o servidor lê só ele; sem escolha nesta ação, recusa com «Operação recusada: informe o resultado da ligação.», mesmo com «Último resultado» preenchido. Repetir o resultado anterior (sem contato de novo) funciona, porque o valor vem da escolha atual. «Último resultado» virou histórico: só o verbo grava (ACL de campo; à mão, só coordenador e admin do app).
**Decidido por:** fase F6 do design UX v1 (orientação do dono do produto: campo de entrada separado, servidor exige valor escolhido na ação)
**Data:** 2026-11-25
**Impacto na task:** TASK-MOD-UX-002-01 — coluna nova no `data-model.json` e no form TEL-035 (scaffold), BR `RF-MOD-UX-002_br_contato_resultado_ligacao`, ACL `RF-MOD-UX-002_acl_contato_write_ultimo_resultado`, UI Action lendo `resultado_ligacao`. ATF: teste novo «o resultado vem só do que o atendente escolhe nesta ligação» (repetir o mesmo resultado registra; sem escolha recusa; gravar o campo por script não fica; atendente não grava «Último resultado») e o teste de form confere «Resultado desta ligação» vazio com «Último resultado» preenchido. Recibo `outputs/spec/auditorias/atf/US-MOD-UX-002.json` (7/7).

### GAP-151
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-152
**Decisão:** Opção 1 mais ACL de campo. Uma business rule before update no caso (`CasoConducao.motivoRecusaEstagio`) aplica as regras dos botões a qualquer caminho (form, lista, API, script): o estágio anda uma etapa por vez («Operação recusada: o caso anda uma etapa por vez; use «Avançar etapa».»), «Encerrado» exige motivo («Operação recusada: informe o motivo de encerramento.») e caso encerrado não volta («Operação recusada: caso encerrado não reabre.»). ACL de campo: «Estágio», «Encerrado em» e «Ordem da etapa» só o admin do app grava à mão; o coordenador muda o estágio pelos botões e continua escolhendo o motivo no form, que o «Encerrar caso» pede.
**Decidido por:** fase F6 do design UX v1 (orientação do dono do produto: bloquear no servidor, só pelos verbos)
**Data:** 2026-11-25
**Impacto na task:** TASK-MOD-UX-005-02 — BR `RF-MOD-UX-005_br_caso_estagio` e ACLs `RF-MOD-UX-005_acl_caso_write_{estagio,encerrado_em,etapa_ordem}`. ATF: teste novo «estágio do caso anda uma etapa por vez e só encerra com motivo, por qualquer caminho» (pular etapa, encerrar sem motivo e reabrir recusados; uma etapa e encerrar com motivo passam; coordenador sem gravação à mão do estágio). Recibo `outputs/spec/auditorias/atf/US-MOD-UX-005.json` (4/4).

### GAP-153
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-154
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

### GAP-155
**Decisão:** _(a preencher)_
**Decidido por:** _(a preencher)_
**Data:** _(a preencher)_
**Impacto na task:** _(a preencher)_

---

*Depois de preencher as respostas, peça ao agente para propagar para o tasks.json e o sync-log.md.*
