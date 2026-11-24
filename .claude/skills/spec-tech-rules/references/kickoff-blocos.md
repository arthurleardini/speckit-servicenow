# spec-tech-rules — os dez blocos do kickoff (PASSO 2), alvo ServiceNow

> Lido antes de montar o quadro do Modo expresso (Turno 1) ou de começar o modo detalhado.
>
> No alvo ServiceNow boa parte da stack já está decidida pelo design (`docs/designs/`, decisões A1 a
> A10) e pelo próprio repositório: escopo e nome do app em `app/now.config.json`, versões do SDK em
> `app/package.json`, instância e alias no `.env.example`, desfecho do teste de viabilidade no
> `ORIGEM.md`. Esses itens entram no quadro como **informação com a fonte**, fora das exceções por
> número. Só se pergunta o que nenhum arquivo responde.
>
> Catálogo de boas práticas usado nas sugestões: `referencias/32-servicenow-boas-praticas-oficiais.md`
> (regras RN-SN). Toda sugestão cita a RN-SN ou o documento do projeto que a embasa.

### BLOCO 1 — Linguagem e Runtime

**1.1 — Linguagem (não é perguntada):** metadados em **Fluent** (TypeScript, `@servicenow/sdk`) e
script de servidor em **JavaScript Glide** (`@servicenow/glide`), Script Include em ES5 com
`Class.create()` (RN-SN-70). Versões lidas de `app/package.json`. Mostrar como informação.

**1.2 — Idioma dos identificadores:**
```
Em que idioma ficam nomes de tabela, coluna, role e função?
  1. Português sem acento, snake_case/camelCase   ← padrão (o negócio fala português; o rastreio RF → coluna fica legível)
  2. Inglês

[Interface (label, mensagem, descrição de teste) é sempre Português do Brasil com acento.]
```

**1.3 — Frontend (não é perguntado):** **Core UI clássica (UI16)** — form, list, related list,
activity, UI Action, UI Policy e report simples —, constituição em
`.claude/rules/harness/servicenow-ui.md`. Workspace, Service Portal e UI Builder estão fora do alvo.

---

### BLOCO 2 — Arquitetura

**2.1 — Escopo (não é perguntado):** um app escopado, com escopo e `scopeId` de
`app/now.config.json` (A3). Fonte de verdade no git (RN-SN-164).

**2.2 — Onde vai cada regra:** a ordem «configurar antes de customizar» é fixa (dicionário → ACL →
Data Policy → UI Policy → Business Rule → Flow → Script Include). Para cada RN do fio condutor,
propor o mecanismo e as peças, citando a RN do `business-rules.md`:
```
RN-XXX → [mecanismo] — [peças]   (ex.: «versão publicada imutável → BR before update + UI Action "Criar nova versão"»)
Confirma a tabela ou ajusta linha por linha?
```

**2.3 — Tabela e script de outro escopo:**
```
O app altera ou estende algo fora do próprio escopo (task, sys_user, tabela de outro app)?
  1. Não — só referencia (ex.: sys_user para leitura)   ← padrão: não cria dívida de upgrade
  2. Estende `task` (herda número, atribuição, SLA)
  3. Altera tabela, form ou script da plataforma → ADR «configurar × customizar» obrigatório no hld.md

[Sugestão: opção 1, salvo RF que pede SLA/atribuição nativos. Opção 3 sempre gera ponto cego de upgrade
 (skip na atualização da instância) — registrar no hld.md.]
```

---

### BLOCO 3 — Persistência

**3.1 — Tabelas (não é perguntado):** persistência = tabelas da plataforma no escopo do app,
geradas pelo `sn-scaffold` a partir do `data-model.json`. Nome com prefixo do escopo e até 30
caracteres (RN-SN-03). Não há banco, ORM nem migração: campo removido vira DELETE pelo `keys.ts`.

**3.2 — Histórico do registro:**
```
As tabelas com form ligam activity stream (journal_input + audit)?
  1. Sim, em toda tabela com form   ← padrão (servicenow-ui.md: o print não sai vazio; auditoria LGPD)
  2. Só nas tabelas listadas
```

**3.3 — Indicadores:**
```
Números de painel (taxas, totais) são:
  1. Report sobre as tabelas (sys_report)   ← padrão
  2. Gravados no registro quando o ciclo fecha (não recalcula a cada abertura)
  3. Os dois, conforme o indicador
```

**3.4 — Volume do seed fictício:**
```
Até quantos registros demo por tabela?   [padrão: 300 — limite de 1.000 iterações de laço em Flow, RN-SN-154]
```

---

### BLOCO 4 — Convenções

**4.1 — Nomenclatura (não é perguntada):** padrões fixos da `conventions.mdc` (tabela, coluna,
role `<escopo>.<papel>`, `$id` com ID da spec, Script Include UpperCamelCase).

**4.2 — Mensagem ao usuário:**
```
Mensagem de regra violada segue o formato «o que aconteceu + o que fazer»?
  1. Sim   ← padrão
  2. Formato do cliente → descreva
```

---

### BLOCO 5 — Testes

**5.1 — Camadas (não é perguntado):** build (`now-sdk build --frozenKeys`), ATF de servidor e ATF
de form em `Test()` Fluent, positivo e negativo por RN (RN-SN-110), recibo por story em
`outputs/spec/auditorias/atf/<STORY>.json` via `npm run atf`.

**5.2 — ATF de form:** ler o desfecho do teste de viabilidade no `ORIGEM.md`. Se o form roda sem
tela pelo Client Test Runner, informar; se não roda, a isenção de ATF de form por story vira a regra.
Mostrar como informação, com a fonte.

**5.3 — Suíte de regressão:**
```
Nome da TestSuite() que roda ao fim de cada npm run reinstall?   [padrão: <sigla-do-app>-regressao]
```

---

### BLOCO 6 — Observabilidade

**6.1 — Log (não é perguntado):** só `gs.debug/info/warn/error` no escopo (RN-SN-12, RN-SN-84);
sem dado pessoal em log; propriedades de debug em `false`. Evidência de erro: system log e execution
details da instância.

**6.2 — Propriedade de nível de log:**
```
O app tem propriedade própria de nível de log (<escopo>.log.level)?
  1. Não — usar o padrão da plataforma   ← padrão no piloto
  2. Sim
```

---

### BLOCO 7 — Auth e Autorização

**7.1 — Roles:** propor uma role por papel da `especificacao-funcional.md` (tabela de telas `TEL-`),
mais uma role admin do app que contém as demais por `containsRoles` (RN-SN-135). Autenticação e
sessão são da instância (não se pergunta).
```
Roles propostas: <escopo>.<papel1>, <escopo>.<papel2>, <escopo>.admin
Confirma ou ajusta?
```

**7.2 — ACL de linha:**
```
Algum papel só vê parte dos registros (carteira, dono, unidade)?
  1. Não — ACL por role basta
  2. Sim → listar tabela × papel × condição   (vira o bloco do projeto da security.mdc)
```

**7.3 — Auditoria / LGPD:** coluna com documento pessoal ganha ACL `query_range`/`query_match`
(RN-SN-140) e o seed é fictício com `ficticio = true`. Informação, com a fonte em
`business-rules.md`.

**7.4 — Cross-scope:**
```
O app precisa ler ou gravar em outro escopo além de sys_user?
  1. Não   ← padrão
  2. Sim → listar alvo × operação (um CrossScopePrivilege por linha, RN-SN-148)
```

---

### BLOCO 8 — Deploy e Build

**8.1 — Instância (não é perguntada):** alias e release do `.env.example`/`ORIGEM.md`.
Instalação só por `npm run reinstall`.

**8.2 — Ambientes:**
```
  1. Um só (dev)   ← padrão no piloto
  2. dev → test → prod por Application Repository (RN-SN-167)
```

**8.3 — Branching:**
```
  1. Um branch por user story, push pelo delivery-gate   ← padrão
  2. Outro → descreva
```

---

### BLOCO 9 — Frontend (Core UI clássica)

**9.1 — Stack (não é perguntada):** Core UI clássica, regras em
`.claude/rules/harness/servicenow-ui.md`. Se o design deixou pendente o cabeçalho (Next Experience
× UI16, `glide.ui.polaris.experience`), registrar como questão em aberto.

**9.2 — Acessibilidade (não é perguntada):** o nível é **WCAG 2.2 AA**, o mesmo do harness Elo
(no upstream, a rule `.claude/rules/harness/frontend.md`; no fork ServiceNow, a
`.claude/rules/harness/servicenow-ui.md`, que herda o nível). A Core UI entrega form e list; o app
cuida de rótulo e mensagem. Mostrar como informação, com a fonte — no quadro do Modo expresso,
linha informativa, fora das exceções por número — e preencher `{{A11Y_LEVEL}}` com ele.

Exigência maior do cliente (AAA em parte do fluxo, norma setorial citada no `discovery-document.md`)
entra como exceção registrada na `conventions.mdc` do projeto, com a fonte; abaixo de AA, nunca.
Cliente governamental que cita WCAG 2.1 AA: o 2.2 AA atende — registrar a norma citada como fonte.

**9.3 — Internacionalização:**
```
  1. Só pt-BR   ← padrão
  2. Outros idiomas → listar (mensagens traduzíveis da plataforma)
```

---

### BLOCO 10 — Integrações Externas

**10.1 — Integrações simuladas:** listar as `SIM-` de `inputs/simulacoes.md` (tabela do app, seed,
rótulo "Simulado", interruptor de falha). Nenhuma chamada sai da instância no piloto.
```
Para cada SIM-: confirmar tabela, Script Include leitor e campo do interruptor de falha.
Retorna dado pessoal? (impacta ACL e log)
```
