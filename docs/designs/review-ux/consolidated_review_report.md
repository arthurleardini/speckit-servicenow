# Revisão EGM consolidada — ux-cobranca-v1.md

Nenhum arquivo foi gravado, como a tarefa pediu. O relatório vai só nesta mensagem, embora a persona do synthesizer peça artifact.

**Status dos revisores (todos em opus):** egm-zoom-out concluído · egm-design concluído · egm-implementation-readiness concluído · egm-codebase-details concluído.

**Veredito unânime:** não dá para implementar esta noite sem decisão humana. Depois de deduplicar, sobram 13 🔴, 14 🟡 e 7 🟢.

Caminhos relativos ao worktree `/config/workspace/10-elogroup/deliversuiteServiceNow/speckit-servicenow/.claude/worktrees/v0`. "L" é a linha do doc.

---

## 🔴 Bloqueadores

**1. O estado `ciclo.estado=distribuido` é recusado pelo código e, se for liberado, desprotege o grupo de controle.** Revisores: todos. Linhas: D5 L64, L81, L127, L141.
- **Problema:**
  - `app/src/server/qualificacao/CriterioVersao.server.js:74-78` só aceita publicado→encerrado, então o CUJ-B falha no 3º clique.
  - A BR de imutabilidade (`business-rules/ciclo.now.ts:15`) só cobre publicado/encerrado. Com o estado novo, os totais ficariam editáveis.
  - `QualificacaoCiclo.server.js:159` (`emControle`) filtra `estado=publicado`, e `:186` filtra publicado/encerrado. Isso deixa o contribuinte de controle elegível para régua e caso.
  - A ACL `security/ciclo.now.ts:7-26` só permite gravar em prévia.
  - Nenhuma ação leva o ciclo a "encerrado".
- **Correção (escolher uma):**
  - (a) Não criar o estado. Criar o campo `distribuido_em` (mais `qtd_contatos`, se quiser) e montar a etapa "Distribuído" do process flow por condição (`estado=publicado^distribuido_emISNOTEMPTY`).
  - (b) Criar o estado e trocar os 5 pontos para `IN publicado,distribuido,encerrado`, com ATF negativo para distribuido→previa e regressão de F2-002 e F2-004.

**2. "Gerar prévia" não existe e o CUJ-B contradiz o código.** Revisores: todos. Linhas: L79-81, L141.
- **Problema:**
  - O `QualificacaoCiclo` só tem `publicar` e `prepararPublicacao`.
  - Sorteio, semente e totais são gravados **na publicação**. Em prévia, gravar `qtd_*` ou `semente_sorteio` dá `MSG_CAMPO_DO_SISTEMA` (`QualificacaoCiclo.server.js:91-99`).
  - Nada no código define quem é elegível. A classificação acontece no insert da `segmentacao` (`SegmentacaoScore.aplicar`, `:94-115`).
  - O Given ("ciclo em prévia") torna o 1º clique inócuo.
- **Correção:** escrever o algoritmo. "Gerar prévia" lê o critério publicado, apaga e recria as linhas de `segmentacao` do ciclo (a BR classifica), é idempotente e não grava campos protegidos. O sorteio continua no Publicar. Reescrever o CUJ-B como "prévia = segmentação; Publicar = sorteio + totais". Outra opção: cortar "Gerar prévia" e ficar com 2 botões, ajustando a frase "3 botões" do M3.

**3. UI Policy não sabe qual botão foi clicado, e a UI Policy de motivo do caso não existe.** Revisores: todos. Linhas: D6 L65, L137-139, L142.
- **Problema:**
  - Uma policy que torna `ultimo_resultado` obrigatório trava "Agendar retorno", "Encerrar" e qualquer save.
  - `motivo_encerramento` dependeria de um status que só é gravado depois do submit.
  - As únicas UI Policies do app são `ui-policies/criterio.now.ts:7` e `ui/caso-dossie-niveis.now.ts:128-140`. Esta última trata das sinalizações somente leitura, não do motivo.
- **Correção:** cada verbo vira UI Action client+server: `g_form.setMandatory(campo)` + `gsftSubmit(null, g_form.getFormElement(), '<actionName>')` + guard `typeof window == 'undefined'` (`/tmp/sdkpkg/package/docs/guides/ui-action-guide.md:582-633`). O servidor revalida e responde com `addErrorMessage` + abort, no padrão `{ok, mensagem}`. Definir `condition`, `roles` (RN-SN-170) e `actionName` de cada ação. Reescrever L142 como item novo.

**4. Ligar a interação a um `contato` quebra as regras atuais, e a tabela de ACL omite `interacao` e `regularizacao`.** Revisores: todos. Linhas: L60, L122-125, L146-152.
- **Problema:**
  - `tables/interacao.now.ts:12` tem `caso` com `mandatory: true`.
  - `server/carteira/recusarInteracaoForaDaCarteira.server.js:4`, `security/carteira.now.ts:40,51,179,190` e `restringirConsultaCarteira.server.js:8-9` usam `caso.atendente`. Na prática, "Registrar ligação" é recusado e o atendente não vê as próprias ligações.
  - A ACL de create da interação é só atendente/admin (`carteira.now.ts:154-161`). Ou seja, o coordenador que "conduz" o caso não registra interação, e o teste F5-007 (`:277-279`) afirma isso.
- **Correção:**
  - Tirar `mandatory` de `interacao.caso` e criar uma BR "exatamente um entre contato e caso".
  - Dono da interação = `['contato.atendente','caso.responsavel']` nas 4 ACLs, na BR e no mapa `DONO`. Dono da regularização = `['atendente','caso.responsavel']`. Acrescentar `x_2326104_cob_contato: ['atendente']` ao `DONO`, reaproveitando `CarteiraAtendente`, que é genérico.
  - Decidir se o coordenador cria interação no caso. Se sim, `role_coordenador` entra no create e o teste F5-007 test_11 se inverte.
  - Acrescentar as linhas `interacao` e `regularizacao` à tabela de ACL.

**5. A migração `caso.atendente`→`responsavel` não lista o que muda, e a semântica dos testes se inverte.** Revisores: todos. Linhas: D2 L61, L126, L144, L196.
- **O que muda:**
  - Modelo: `data-model.json:1907-1912, 1878, 2770, 2791, 2803, 2826, 2830`.
  - Arquivos gerados: `tables/caso.now.ts:13`, `ui/TEL-021:8`, `TEL-022:8`, `TEL-024:12`, `security/acl-base.now.ts:296-311`.
  - Arquivos à mão:
    - `ui/caso-dossie-niveis.now.ts:23`: o build quebra.
    - `security/carteira.now.ts:18,40,51,111-141,179,190`.
    - `business-rules/carteira.now.ts:19-44`.
    - `server/carteira/recusarCasoForaDaCarteira.server.js:5-6`: `current.atendente.changes()` dá erro de script.
    - `restringirConsultaCarteira.server.js:6,8,9`.
    - `server/atendimento/CasoDossie.server.js:6-7,14`: muda o sentido da regra.
  - ATF: `US-MOD-F5-003.now.ts:28,62,126,187` e `US-MOD-F5-007.now.ts:29,109,167,209,214,251`. A premissa se inverte: antes o atendente lia e gravava o caso, agora fica sem acesso. F2-005 não é afetado.
  - Seed: `seed/caso.now.ts`, com 51 ocorrências.
- **Riscos técnicos:**
  - No SDK, renomear coluna é DELETE + ADD, e os dados da coluna somem (`sn-scaffold/SKILL.md:148-152`).
  - "Padrão: coordenador" não tem mecanismo, e sys_id fixo é proibido.
  - O `gerar-seed.mjs:310-317` só distribui entre usuários demo quando o nome da coluna é igual ao nome do papel, e `responsavel` não é papel.
- **Correção:**
  - Chamar a coluna de `coordenador`, com rótulo "Responsável" (zoom-out). Assim o seed atribui sozinho e não precisa de default. Outra opção: BR before insert + regra no seed.
  - Listar os arquivos acima na story.
  - Reescrever F5-003 e F5-007: positivo = coordenador, negativo = atendente sem acesso.
  - Registrar a mudança de RF-MOD-F5-001/002/003/007 via `spec-scope-change`.

**6. "Atendente sem acesso ao caso" não tem mecanismo.** Revisor: codebase. Linha: L152.
- **Problema:** o scaffold dá leitura a todos os papéis em todas as tabelas (`scaffold.mjs:198-215` → `acl-base.now.ts:296-311`). O schema não aceita papéis por entidade (`spec-data-model/templates/data-model.servicenow.schema.json:35`, `additionalProperties:false`).
- **Correção:** escolher entre ACL deny à mão em arquivo sem cabeçalho de gerado, ou campo de papéis por entidade no schema e no scaffold.

**7. O dono do contato e o dono do contribuinte divergem.** Revisores: design, codebase, readiness. Linhas: L101, L141, L151.
- **Problema:** no rodízio, o atendente A recebe contato da carteira de B. A carteira (`carteira.now.ts:22-31, 56-109`) nega a A o contribuinte, os débitos, os parcelamentos e as comunicações. O CUJ-A quebra, e "Meus contribuintes" diverge de "Minha lista".
- **Correção:** uma regra única de dono. Opção: `contato.atendente := contribuinte.atendente`, com rodízio só para contribuinte sem atendente, gravando os dois campos. Registrar em D1/D2.

**8. Falta a ordem de execução, e as mudanças de modelo não passam pelo `data-model.json`.** Revisores: readiness, design, zoom-out. Linhas: L115-131, L176-188.
- **Problema:**
  - `tables/*`, `ui/TEL-*`, `navigation/menu.now.ts`, `acl-base` e `seed/*` são gerados ("mudança à mão se perde"). O `gravarScaffold` sobrescreve tudo (`scaffold.mjs:269-283`).
  - O `sn-implement` não gera tabela, menu nem seed (SKILL.md:44-46).
  - A tabela "Documentos" omite o `data-model.json`.
- **Correção:** criar uma seção "Fases", cada uma com comando de verificação e critério de verde:
  - F0: `spec-scope-change` + stories.
  - F1: kit.
  - F2: `data-model.json` → `sn-scaffold` → `sn-seed` → `npm run reinstall`.
  - F3: verbos e BR via `sn-implement`.
  - F4: ACL + ATF.
  - F5: painel + home.
  - F6: verificação.

**9. Faltam IDs de story.** Revisor: readiness. Linhas: L186-188.
- **Problema:** o `sn-implement` exige `US-…` no `tasks.json` (SKILL.md:226-228).
- **Correção:** listar no doc as stories com ID, título, aceite e ATF. Por exemplo, US-MOD-UX-001…011: contato, Registrar ligação, Encerrar, BR, Gerar prévia, Distribuir, Avançar/Encerrar caso, ACL, menu/home, painel.

**10. O `Dashboard()` conflita com a regra do projeto e está sem especificação.** Revisores: todos (zoom-out e readiness marcaram 🔴). Linhas: Non-Goals L50, D4 L63, L108, L163, L171, L195.
- **Problema:**
  - `.claude/rules/harness/servicenow-ui.md` diz que painel que a Core UI não faz vira report ou lista agrupada, com registro em `gaps.md`. Next Experience fica fora do alvo. Marcar "aceito" nos Riscos não muda a regra.
  - O módulo DIRECT precisa do sys_id do `par_dashboard` na URL. `Now.ID` não interpola em string, e sys_id fixo é proibido.
  - `Dashboard` usa `permissions:[{role, canRead}]`, não `roles` (`sdk-core/dist/dashboard/Dashboard.d.ts:42-83`).
  - O schema `widgets[{table, groupBy, metric}]` não expressa "regularizado × meta" nem "efeito × controle", que cruzam duas fontes.
- **O que existe no SDK:** o `Dashboard()` existe (`dashboard-guide.md`, grid de 48 colunas, `componentProps.dataSources/groupBy/metrics`).
- **Correção (decidir):**
  - (a) Usar 4 `sys_report` no padrão TEL-011, reaproveitando TEL-026..029 e 022, como módulos REPORT na área Analytics, com GAP em `gaps.md`. A home do coordenador passa a ser um report ou "Casos qualificados". Cortar `dashboards` do kit.
  - (b) Manter o Dashboard com exceção registrada em `servicenow-ui.md` e `gaps.md`, sys_id lido do `keys.ts` (`sysIdDaChave`, `scaffold.mjs:286`) e cada widget especificado: component, `dataSources[]`, `filterQuery`, `groupByField`, `aggregateFunction`, posição e permissions.

**11. A home por persona não tem mecanismo, e a verificação por login é inviável.** Revisores: todos (readiness marcou 🔴). Linhas: D3 L62, L160, L172, L194, L205.
- **Problema:**
  - O doc não diz o nome da preferência (a auditoria P4 cita `my_home_navigation_page` "a conferir"), nem o valor ou o gerador.
  - Os usuários demo vêm do `sn-seed` (`gerar-seed.mjs:425-442`), não do scaffold.
  - Os usuários demo não têm senha, e a captura faz impersonate (`sn-capture/scripts/capture.mjs:11,50`).
  - O plano B ("1º módulo") não cumpre o M1.
- **Correção:**
  - `Record({table:'sys_user_preference', data:{user: Now.ref(...), name:'my_home_navigation_page', value:'<URL relativa da lista de x_2326104_cob_contato com sysparm_query e sysparm_view>'}, $meta:{installMethod:'demo'}})`, gerado pelo `sn-seed` e cobrindo `demo.atendente2`.
  - Valor do coordenador conforme a decisão do item 10.
  - Plano B binário: "se a preferência não tiver efeito na instância, o critério do M1 vira 1º módulo".
  - Verificação: impersonate + `/navpage.do`.

**12. O seed coerente (D9) não sai do `gerar-seed.mjs`.** Revisores: todos (codebase marcou 🔴). Linhas: D9 L68, L74.
- **Problema:**
  - A quantidade é igual por tabela (`:372-404`), então os 6 casos não saem.
  - Os valores são sorteados por coluna: inteiro de 1 a 999 e decimal até 99.999,99 (`:297-301`). É daí que vem a taxa de 81.010%.
  - As datas são fixas em 2026 (`:277-280`).
  - "Hoje até +7 dias" num `Record()` estático envelhece.
  - O CUJ-A (20 contatos, 5 vencendo hoje) não bate com o D9.
- **Correção (decidir):**
  - (a) Seed à mão de `ciclo`, `contato` e `caso` em arquivos sem cabeçalho de gerado, esta noite.
  - (b) Seção `seedRules` no kit: contagem por entidade, faixas, derivação entre tabelas e datas relativas resolvidas no install.
  - Nos dois casos: unificar os números e definir como as datas não envelhecem (regerar antes da demo ou script no reinstall).

**13. A tabela de transição de "Registrar ligação" está incompleta e o CUJ-A não é testável.** Revisores: readiness, design. Linhas: L64, L76, L99, L137.
- **Problema:**
  - Não estão definidos: o status com `sem_contato` na 1ª e na 2ª tentativa, promessa com retorno, quem tira o contato de `ligado`, os campos da `interacao` criada e a anotação obrigatória (J5, `02-personas…:157`).
  - O filtro `status!=encerrado` mantém o contato na lista, contradizendo "sai da lista do dia".
  - O process flow pinta as etapas por `order`, então a→retornar mostra "ligado" como concluído.
- **Correção:**
  - Tabela de decisão: (status atual, resultado, retorno informado, tentativas) → (status, `proxima_acao_em`, motivo).
  - Filtro de "Minha lista": `atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_em<=javascript:gs.endOfToday()^ORproxima_acao_emISEMPTY`.
  - Etapas do process flow por condição.

---

## 🟡 Maiores

1. **StateModel ambíguo** (todos). D5 L64 descarta o StateModel e o risco L197 o reintroduz. O StateModel exige coluna `sttrm_model`, BR de atribuição, BR `evaluateTransition` e cross-scope (`state-model-guide.md:44-53,121-134`). O guia também proíbe barrar transição por BR, o que choca com `CriterioVersao`. **Correção:** declarar "v1 sem StateModel" e apagar L197.
2. **Process flow: onde e como** (readiness, codebase). Existe para tabela custom (`form-formatters-guide.md:263-352`): `sys_ui_formatter` com `process_flow.xml`, um `sys_process_flow` por etapa com `condition` e `order`, e o elemento formatter na 1ª seção do `Form()`. O form do caso abre por View Rule no `ui/caso-dossie-niveis.now.ts:111-125`, escrito à mão. **Correção:** listar esse arquivo e os forms gerados, com a condição de cada etapa.
3. **Filtros do menu em pseudo-sintaxe** (todos). L99-112:
   - `atendente=eu` e `<=hoje` não são encoded query.
   - `GROUPBYatendente` não é metadado de módulo (`list-guide.md:263`).
   - `ORDERBYestagio` (L102) contra "agrupada por etapa" (CUJ-C).
   - As roles não têm nome completo `x_2326104_cob.*`.
   - "21 tabelas" vira 22.
   - "admin" em Integrações (L112) é ambíguo: app ou plataforma?
   - **Correção:** encoded queries finais e `order`/`$id`/`view_name` por módulo.
4. **`navigation` contra o `modules` existente** (todos).
   - O `scaffold.mjs:229-253` já agrupa o menu, mas lê `m.title` enquanto o schema e o modelo usam `label`. Por isso o separador nunca é gerado (`menu.now.ts`: zero SEPARATOR).
   - O fallback "separador Dados" (L168) não é o comportamento atual.
   - `servicenow-ui.md` (Navegação) manda "um módulo por funcionalidade".
   - Os `$id` dos módulos mudam (DELETE/INSERT).
   - O kit usa `link`/`view`, mas os campos são `query`/`view_name`.
   - **Correção:** estender `modules` com `type`, `filter`, `view` e `roles` em vez de criar uma seção paralela, corrigir `title`/`label` e atualizar `servicenow-ui.md`.
5. **Views sem colunas** (readiness, zoom, design). `minha_lista`, `qualificada` e `carteira` estão sem colunas e sem prefixo de escopo (`sn-scaffold/SKILL.md:123-124`). "Até 6 colunas" diverge de L14 (`02-personas…:231`, até 5). **Correção:** lista ordenada de colunas por view, form e related lists da Carteira (D8).
6. **Display values** (readiness, design, codebase). L128-131: o `caso` não tem campo número e o display é um campo só. O `ciclo` já usa `nome`. A "pessoa no nome" (A17) vem do seed (`gerar-seed.mjs:267-269`), não do display. **Correção:** usar `entities[].display`, escolher um campo (`contribuinte` ou um `numero` novo) e escrever os labels, defaults (`status=a_ligar`) e mandatory de `contato`.
7. **Grupo de controle e origem dos casos qualificados** (design). Nenhuma BR protege `contato` contra contribuinte em controle (`QualificacaoCiclo.server.js:6,172-174`). Nenhum verbo cria `caso` do segmento qualificada, então o CUJ-C depende de seed. **Correção:** BR before insert em `contato` chamando `motivoRecusaAcao`, "Distribuir" só com `segmento=massificada` e definição de quem cria os casos.
8. **Meta de cliques não fecha** (design, readiness). O CUJ-A soma 4 a 6 cliques (abrir, lista de resultado, escolher, date picker, botão). **Correção:** definição operacional de clique (por exemplo, seleção de valor não conta) ou meta ajustada.
9. **Verificação não executável** (readiness, design). L199-208:
   - não há caminho nem credenciais do script Playwright;
   - "prints" não têm destino (`sn-capture --story`);
   - "cada seção tem teste" não lista os casos.
   - **Correção:** `npm run atf -- --story <ID>` por story, casos de `scaffold.test.mjs` com e sem cada seção, mais a borda "DIRECT sem link".
10. **BR de regularização vaga** (readiness). L140: faltam `when`/`order`, a definição de "aberto", se encerra o caso e a relação com o grupo de controle.
11. **M6 sem plano técnico** (codebase). Faltam o mecanismo de R$, os booleanos mostrados como `true/false` e os rótulos em inglês.
12. **Telas existentes do caso sem destino** (codebase). TEL-023 ("Minha fila", view `x_2326104_cob_tel_023`), TEL-024 e TEL-025 têm papel atendente (`data-model.json:2797-2858`).
13. **Field styles com formato errado** (todos; codebase marcou 🔴). L162:
    - `sys_ui_style.value` aceita só um valor ou uma expressão `javascript:` booleana, não encoded query.
    - Só vale na lista.
    - No Polaris, o fundo vira um ponto (`field-styles-guide.md:24-28,60,255`).
    - "Prioridade alta" não tem limiar.
    - **Correção:** trocar `condition` por `value`, usar `color`/`font-weight`, ou cortar (ver abaixo).
14. **Falta a lista de arquivos a criar, modificar e apagar** (codebase, readiness). É exigência do standard.

## 🟢 Menores

- L121: `telefone` como cópia desatualiza. Usar dot-walk `contribuinte.telefone`. O `valor_em_aberto` só fica se o retrato por ciclo for requisito.
- L182-186: caminhos completos dos documentos: `outputs/explore/especificacao-funcional.md`, `outputs/spec/product-requirements/product-requirements.md`, `outputs/spec/flow-map.md`, `outputs/spec/screens-manifest.json`, `outputs/spec/tasks.json`.
- L3-4: o status "a validar" não diz se dá para executar antes da validação.
- D3: o custo "alto" da UI Page de redirecionamento diverge da auditoria P4 ("baixo a médio").
- Os Riscos não cobrem ACL nem grupo de controle.
- Reuso que o doc não cita:
  - `CasoDossie.filtrarPorContribuinte` e o padrão `sys_relationship` de `caso-dossie-niveis.now.ts:46-108`, para as related lists. "Ligações" no contribuinte precisa de relação via `contato.contribuinte`.
  - `CarteiraAtendente` genérico.
  - Os 7 reports existentes.
  - As choices `interacao.resultado` (`interacao.now.ts:20-25`) e `parcelamento.alerta_risco` (`parcelamento.now.ts:27`).
- Segundo o zoom-out, o ATF "1 positivo + 1 negativo por ação" dá cerca de 16 testes novos, mais os migrados.

---

## Cortes sem perder M1–M6 (zoom-out, com concordância parcial dos demais)

| Cortar | M afetado |
|---|---|
| UI Action "Agendar retorno" (já coberta por "Registrar ligação" com retorno) | nenhum |
| Módulos "Retornos de hoje" e "Distribuição da lista" (a mensagem do Distribuir já dá a contagem) | nenhum |
| Field styles (`sys_ui_style`) | nenhum |
| BR de regularização (RN-09), adiar | nenhum |
| Cópia de `contato.telefone` | nenhum |
| `Dashboard()` → 4 `sys_report` + módulos REPORT | M1 (só o destino do coordenador) |
| Estado `distribuido` → campo `distribuido_em` | nenhum |
| "Gerar prévia" (opcional, se não houver tempo para o algoritmo) | M3 (reescrever "3 botões") |
| Seções `homes`, `fieldStyles` e `dashboards` do kit; manter só `modules` estendido + `processFlows` | M7 parcial |
| Tabela "Documentos", exceto `spec-scope-change` | nenhum |
| Linha de risco do StateModel | nenhum |
| ATF: 1 por verbo do CUJ + 1 negativo por ACL nova | nenhum |

## Decisões humanas pendentes

1. Ciclo: estado `distribuido` ou campo `distribuido_em` (🔴1).
2. Semântica de "Gerar prévia", ou corte (🔴2).
3. Regra única de dono contato × contribuinte (🔴7).
4. O coordenador registra interação no caso? (🔴4)
5. Painel: Dashboard com exceção, ou reports, e com isso a home do coordenador (🔴10, 🔴11).
6. Nome da coluna: `coordenador` (rótulo "Responsável") ou `responsavel` + default (🔴5).
7. Seed: à mão esta noite ou `seedRules` no kit (🔴12).
8. Critério do M1 se a preferência de home não funcionar (🔴11).

---

## Mudanças mínimas para ficar implementável

1. Seção "Fases" (F0–F6) com a ordem data-model → scaffold → seed → reinstall → sn-implement, comando de verificação e critério de verde por fase.
2. Stories US-MOD-UX-0xx com aceite e ATF.
3. `data-model.json` como 1º artefato, com o JSON exato de `contato`, `interacao` (`caso` não obrigatório, `contato`, `retorno_em`), `caso` (coluna de dono renomeada), `ciclo` e as telas e views novas.
4. Ciclo: escolher entre o estado (com os 5 pontos de código + ATF) e o campo `distribuido_em`. Dizer quem encerra o ciclo.
5. Algoritmo de "Gerar prévia" e de "Distribuir": fonte, idempotência, regra de dono, só massificada, BR de controle em `contato`, origem de prioridade e valor. Ou cortar a prévia.
6. Trocar "UI Policy" por UI Action client+server com revalidação no servidor. Corrigir L142.
7. Tabela de decisão de "Registrar ligação" e o filtro exato de "Minha lista".
8. Inventário da migração `caso.atendente` (lista do 🔴5) e da troca de dono de `interacao`/`regularizacao`/`contato` no `DONO` e nas ACLs, mais o mecanismo de "atendente sem acesso ao caso". Tabela de ACL completa com 5 tabelas.
9. Painel: decisão + especificação (reports TEL-0xx, ou widgets completos com sys_id via `keys.ts` e exceção registrada).
10. Home: registro `sys_user_preference` exato no `sn-seed`, plano B binário e verificação por impersonate.
11. Seed coerente: mecanismo, números unificados e datas que não envelhecem.
12. Remover a linha de risco do StateModel. Declarar process flow + UI Actions e a condição de cada etapa, com o arquivo do form (incluindo `caso-dossie-niveis.now.ts`).
13. Encoded queries reais no menu e regra de convivência `modules`/`navigation` (corrigir o bug `title`/`label` em `scaffold.mjs`).
14. Aplicar os cortes da tabela acima.

Arquivos centrais: `docs/designs/ux-cobranca-v1.md`, `outputs/spec/data-model.json`, `app/src/server/qualificacao/{QualificacaoCiclo,CriterioVersao}.server.js`, `app/src/fluent/security/{carteira,ciclo,acl-base}.now.ts`, `app/src/server/carteira/*`, `app/src/fluent/ui/caso-dossie-niveis.now.ts`, `app/src/fluent/tests/US-MOD-F5-00{3,7}.now.ts`, `.claude/skills/sn-scaffold/scripts/scaffold.mjs`, `.claude/skills/sn-seed/scripts/gerar-seed.mjs` e `.claude/rules/harness/servicenow-ui.md`.
