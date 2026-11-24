# Stage 7 — Critic Review

**Alvo:** `/config/workspace/10-elogroup/deliversuiteServiceNow/docs/designs/speckit-servicenow-v0.md` (linhas 1–232)

**Contagem:** 🔴 2 · 🟡 8 · 🟢 11

| Revisor | Modelo | Status |
| --- | --- | --- |
| `egm-design` | opus | completed |
| `egm-structural` | opus | completed |
| `egm-style` | sonnet | completed |

Este relatório não repete o que já está em `zoom_out_report.md` nem em `comprehension_report.md`. Quando dois ou mais revisores apontaram o mesmo problema, os achados viraram um só. Também ficaram de fora os achados que pediam fonte para fatos informados pelo autor (ganho do Delivery Suite/CodeForge, 390 mil tokens) ou que discutiam o objetivo da demo. Nenhum dado de contribuinte aparece abaixo.

---

## 🔴 Blocker

### C1. Os prints são tirados como admin, então a tela do backlog não é a tela que o papel vê
- **Revisor:** design
- **Onde:** G3 (l. 39), CUJ 1 Then (l. 71), CUJ 2 (l. 76), A10 (l. 106), tabela de telas com coluna "papel" (l. 158)
- **Problema:** o Playwright faz login com a única credencial da instância, que numa PDI é admin. O admin passa por cima das ACLs e vê todas as UI Actions, campos e linhas. Com isso, cada print de `TEL-` mostra a visão de admin, e não a do `atendente` ou do `coordenador`. O item 40 põe "atendente vê só a própria carteira" no fio condutor, mas o print da issue vai mostrar todas as carteiras. A frase do CUJ 1, "o print na issue é a mesma tela que abre na instância", só vale se quem abre também for admin.
- **Correção:**
  - Criar no seed um usuário fictício por role. O `sys_user` pode entrar como `Record()` com `installMethod: 'demo'`.
  - Acrescentar o campo `capturedAs: <role>` em cada entrada do `screens-manifest.json`.
  - A `sn-capture` faz login como esse usuário, ou usa impersonate.
  - Dizer na A10 e no CUJ 1 qual role cada print representa.

### C2. Falta a seção "Risks & Mitigations" que o padrão exige
- **Revisores:** structural, design
- **Onde:** documento inteiro; l. 33 ("O que pesa contra"), NFRs (l. 224–229)
- **Problema:** o padrão de feature spec pede que cada modo de falha, implicação de segurança e limite de escala venha com uma mitigação. Hoje esse material está espalhado: a l. 33 põe um risco dentro de The Problem, e os NFRs trazem restrições, não uma lista de riscos. Ficam sem registro:
  - a PDI única como ponto único de falha no dia da demo;
  - mudança de comportamento do SDK 4.14.x em demo data e DELETE;
  - objetos que o Fluent ainda cobre pouco (ver M4);
  - falha do trecho ao vivo da demo;
  - indisponibilidade da Anthropic ou falta de tokens;
  - `gh` e API do GitHub.
- **Correção:** criar uma H2 "Risks & Mitigations" logo depois de Alternatives Considered. Formato de tabela: Risco | Tipo (falha/segurança/escala/demo) | Probabilidade e impacto | Mitigação | Gatilho | Item #. Levar a l. 33 para essa tabela e fazer os NFRs apontarem para as linhas dela.

---

## 🟡 Major

### M1. Os motivos de rejeição das alternativas não dizem o trade-off
- **Revisores:** structural, design, style
- **Onde:** l. 172, 178, 184, 190, 196, 202, 208, 214, 220
- **Problema:** as nove alternativas começam com "Rejeitada pelo autor". O padrão pede que a rejeição traga o trade-off técnico ou de escopo, ou então o link para o registro da decisão. Alguns motivos só repetem a decisão tomada:
  - B e C: "a instância é o protótipo (A2)" e "pelo mesmo motivo da alternativa B";
  - D: "O v0 usa Core UI clássica";
  - E e F: "o backlog vai para o GitHub".
- **Correção:** as decisões continuam as mesmas. Só muda a redação:
  - tirar "Rejeitada pelo autor", ou apontar o brief D1–D7 / opção A/C com caminho;
  - abrir cada motivo pelo contra que pesou.

  Exemplos:
  - F: "plugin inativo na `dev493801` e backlog perdido se a instância for zerada".
  - C: "layout feito duas vezes, e o protótipo pode prometer o que a Core UI não faz".
  - A: "a zona imutável bloqueia `fecho-explore`, enum `Task.type`, rule de frontend e checklists dos validadores".

### M2. The Problem mistura solução e risco
- **Revisores:** structural, style
- **Onde:** l. 31, l. 33
- **Problema:** a l. 31 descreve a solução e a l. 33 traz um risco já com a mitigação. O rótulo "O que pesa contra" também é informal para uma spec.
- **Correção:** levar a l. 31 para o fim do Overview ou para o começo do Technical Plan, e a l. 33 para a tabela de riscos (C2). The Problem fica só com os quatro bullets.

### M3. Três Goals ficam sem CUJ
- **Revisores:** structural, style
- **Onde:** Goals (l. 35–47) contra os CUJs (l. 65–89)
- **Problema:**
  - O G3 ("A instância é o protótipo"), que é a principal novidade, não tem jornada. O CUJ 2 já começa com o Explore fechado.
  - O G2 não tem jornada.
  - O G6 também não. A frase "sem depender de quem montou o v0" não tem teste que a confira.
- **Correção:**
  - CUJ 5 "FDE fecha o Explore com a instância como protótipo": spec → `sn-scaffold` → install → `sn-capture` → `fecho-explore` libera ou bloqueia.
  - CUJ 6 "um FDE que não participou do v0 roda o kit noutro projeto só com `CLAUDE.md` e `doutor`".
  - Marcar no título de cada CUJ os Goals que ele comprova.

### M4. O "report simples" da Core UI não tem caminho documentado no Fluent
- **Revisor:** design
- **Onde:** G3 (l. 39), l. 158 (painel de KPIs da F6)
- **Problema:** a documentação do SDK não tem uma API de report. A única superfície de relatório documentada é `Dashboard()` (`/tmp/sdkpkg/package/docs/guides/dashboard-guide.md`), que gera `par_dashboard` (Platform Analytics). Isso bate de frente com o Non-Goal "só Core UI clássica" (l. 54) e com a rejeição da Alternativa D. Sobra um `Record({table:'sys_report'})` com campos que ninguém documentou.
- **Correção:**
  - No Estágio 0, provar um `sys_report` clássico via `Record()`: build, install e renderização no UI16.
  - Se não funcionar, escolher entre duas saídas e registrar o GAP:
    - aceitar Platform Analytics como exceção declarada;
    - trocar os KPIs por uma list com group-by.
  - Escrever no G3 o caminho escolhido.

### M5. CPF e CNPJ "fictícios" com dígito válido podem ser de gente real
- **Revisor:** design
- **Onde:** A9 (l. 105), NFR Sigilo (l. 226)
- **Problema:** um número sorteado com dígito verificador válido pode existir de fato. No seed, esse número fica ligado a débito, ação de cobrança e canal de contato inventados, e depois sai em issue e em PNG. A semente determinística não resolve isso. É um problema diferente do B2 do zoom-out, que trata da pontuação do `check_sensivel.py`.
- **Correção:** escolher uma das saídas e registrar a escolha no NFR:
  - gerar numa faixa documentada que não colide, com prefixo sentinela, mais um campo "fictício" no registro;
  - manter o DV válido só onde uma regra de validação precisar dele, e mascarar (`***.***.***-NN`) em form, list e print.

### M6. O agente consegue ler a credencial da instância
- **Revisor:** design
- **Onde:** NFR Segredos (l. 227), CUJ 2 (l. 76), A10 (l. 106)
- **Problema:** o design protege o `.env.instancia` do git e da saída do `doutor`. Nada impede o Claude Code de ler o arquivo com Read ou `cat`. Se isso acontecer, a senha de admin vai para o contexto e para os transcripts. O `settings.json` do harness não tem regras `deny`.
- **Correção:**
  - No item 7, incluir `permissions.deny` para `Read(./.env*)` e `Bash(cat .env*)` ou um equivalente.
  - Só `capture.mjs`, `doutor` e `reinstall.mjs` carregam o arquivo, via `process.env`.
  - Registrar isso no NFR Segredos.

### M7. Sobram 14 caracteres para o nome das tabelas, e o escopo fica fixo no `init`
- **Revisor:** design
- **Onde:** A3 (l. 99), l. 158; item 6
- **Problema:** o build limita o nome de tabela a 30 caracteres (`/tmp/sdkpkg/package/docs/guides/table-guide.md`, l. 48 e 76). O prefixo `x_2326104_cobmt_` ocupa 16, e sobram 14 para nomes como critério de qualificação, versão ou dossiê. Encurtar depois exige renomear tabela instalada, e o design evita isso. O N7 do zoom-out só citava o limite. Este achado é sobre o orçamento de caracteres e o momento de escolher o escopo.
- **Correção:**
  - Antes do item 6, encurtar o sufixo do app (por exemplo `cob`, que deixa 16) ou criar um glossário de abreviações.
  - Pôr o orçamento na regra de nomes do modelo de dados.
  - No Estágio 0, conferir que os nomes mais longos previstos cabem.

### M8. As alternativas não consideram atualizar o `gh` para anexar imagem
- **Revisor:** design
- **Onde:** l. 162, Alternativa E
- **Problema:** o `referencias/31-backlog-e-instancia.md` (l. 13 e 23) registra que versões novas do `gh` têm `--attach` e chama a atualização de caminho preferido. O design trata "o gh 2.63.2 não anexa imagem" como limite fixo e não pesa nem a atualização nem a extensão `gh-attach`. Commitar os PNGs também traz os problemas de renderização em repositório privado e de crescimento do repositório (M11 do zoom-out).
- **Correção:** pôr a atualização do `gh` como alternativa, com o trade-off dela, ou adotá-la na l. 162.

---

## 🟢 Nit

- **N1 (design). O activity stream do G3 vai sair vazio nos prints** (l. 39, 158). O `Formatter.Activities_Filtered` só mostra conteúdo se a tabela tiver coluna `journal_input` e auditoria ligada. Registro instalado como demo não tem histórico. Correção: exigir `journal_input` e `audit` nas tabelas de `TEL-` e semear algumas linhas de journal, ou tirar o activity stream do G3.
- **N2 (design). A remoção de campo já é tratada pelo `keys.ts`** (l. 160). Desde o SDK 4.14, apagar um campo da fonte marca a chave como `deleted: true`, e o DELETE é aplicado no install seguinte (`sdlc-guide.md`, l. 1260). Complementa o M6 do zoom-out. Correção: citar esse comportamento e fixar o SDK em 4.14 ou superior como pré-condição.
- **N3 (structural). Open Questions está cedo demais** (l. 60–63). Aponta para os itens 9, 19 e 41 antes de o leitor chegar a eles. Correção: mover a seção para antes do Detailed Implementation Plan.
- **N4 (structural, style). A formatação não segue um padrão único.**
  - Bullets `*   ` e `- ` misturados (l. 26–29 e 158–164).
  - H2 em inglês e H3 em português.
  - Régua `---` só em volta dos NFRs (l. 7, 222, 231).
  - Correção: usar um marcador só, uma língua só nos títulos, e régua entre todas as H2 ou entre nenhuma.
- **N5 (structural). Os caminhos da l. 26 e da l. 27 partem de raízes diferentes.** Um começa em `sefaz-mt/knowledge-mt/...` e o outro em `knowledge-mt/mt-produtos/...`. Correção: começar os dois em `10-elogroup/sefaz-mt/...`.
- **N6 (structural, style). A tabela de decisões não liga cada decisão à alternativa que ela descartou** (l. 95–106).
  - A coluna "Origem" mistura dono, opção e fonte.
  - A A1 diz "onde for preciso".
  - Correção:
    - Criar uma coluna "Alternativas descartadas" (A1↔A, A2↔B/C, A3↔G, A4↔E/F).
    - Deixar em "Origem" só fontes com caminho.
    - Trocar "onde for preciso" por "hooks, schema, validadores e rules".
- **N7 (style, structural). O G6 contradiz a Alternativa G e a l. 33.** A Alternativa G (l. 208) diz que "extrair o kit para outro projeto fica para depois do v0", o que bate com o G6 (l. 47). Já a l. 33 conta como critério de pronto só o G1–G5. Correção: dizer se o G6 está dentro ou fora do critério de pronto e alinhar a l. 208.
- **N8 (style). Linguagem coloquial e um termo sem definição** (l. 24, 28, 31, 39).
  - Expressões coloquiais: "se perde no meio", "cada pessoa interpreta de um jeito", "um ID atravessa tudo".
  - Correção: "manual e sem rastreio", "cada desenvolvedor interpreta o protótipo de um jeito", "um ID liga spec, tela, issue, código e teste".
  - "GAP" (l. 39) aparece sem dizer onde é registrado. Correção: indicar o arquivo.
- **N9 (style). O Overview repete os Goals** (l. 13–18 contra l. 37–47). As quatro saídas são G2–G5 de novo. Além disso, o G5 é uma lista de fragmentos e os outros Goals são frases completas. Correção: resumir as saídas em uma linha que remete aos Goals e escrever o G5 no mesmo formato dos demais.
- **N10 (style). Critério de aceite com incerteza e frase ambígua.**
  - A l. 83 diz "(ou a isenção fica registrada, conforme Q2)". Correção: "o ATF fica verde, ou a isenção do ATF de form fica registrada (Q2)".
  - A l. 38 diz "ID único por funcionalidade" e fica ambígua. Correção: "ID único que inclui a funcionalidade (`RF-F<n>-<nn>`)".
  - As l. 82–83 encadeiam seis verbos numa frase. Correção: dividir em dois passos.
- **N11 (style). Um "Then" de CUJ que não dá para verificar** (l. 71). Trocar "Nenhum passo exige explicação fora do que está na tela" por "cada passo exibe o ID do RF".

---

Arquivos de apoio citados pelos revisores:
- /tmp/sdkpkg/package/docs/guides/table-guide.md
- /tmp/sdkpkg/package/docs/guides/dashboard-guide.md
- /tmp/sdkpkg/package/docs/guides/form-layout-guide.md
- /tmp/sdkpkg/package/docs/guides/demo-data-guide.md
- /tmp/sdkpkg/package/docs/guides/sdlc-guide.md
- /config/workspace/10-elogroup/deliversuiteServiceNow/referencias/31-backlog-e-instancia.md
- /config/.claude/jobs/2c29c816/tmp/harness-claude/.claude/settings.json
- /config/.claude/plugins/cache/egm/egm/0.1.1/resources/document_standards/feature-spec-standard.md
