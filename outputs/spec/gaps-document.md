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

---

*Depois de preencher as respostas, peça ao agente para propagar para o tasks.json e o sync-log.md.*
