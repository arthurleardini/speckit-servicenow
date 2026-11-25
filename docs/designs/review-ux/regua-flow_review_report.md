# Revisão EGM — ux-cobranca-v2-regua-flow.md

**Alvo:** `/config/workspace/10-elogroup/deliversuiteServiceNow/speckit-servicenow/.claude/worktrees/v0/docs/designs/ux-cobranca-v2-regua-flow.md` (linhas 1-430)

Nenhum arquivo foi gravado, como a tarefa pediu. Os caminhos de código abaixo são relativos ao worktree.

| Revisor (opus) | Standard | Status | Contagem |
|---|---|---|---|
| egm-zoom-out | zoom-out-standard | completed | 0🔴 8🟡 5🟢 |
| egm-design | feature-spec-standard | completed | 6🔴 12🟡 6🟢 |
| egm-implementation-readiness | implementation-readiness-standard | completed | 3🔴 13🟡 6🟢 |
| egm-codebase-details | implementation-readiness-standard | completed | 2🔴 15🟡 7🟢 |

**Consolidado depois da deduplicação: 8🔴, 24🟡 e 12🟢.** Os quatro revisores concluem que o doc ainda não está pronto para implementar.

---

## 🔴 Blocker

**1. P1 = (b), "Escalonar" e "Distribuir lista" se contradizem.** Revisores: todos os quatro. Seções: P1 (l.93), D13, B2 Escalonar (l.274), A3 ciclo (l.178), CUJ-2 (l.107), Riscos (l.368).
- **Problema:** "Escalonar" já cria o contato com atendente (da carteira ou por rodízio). Com isso não sobra "contato sem atendente" para distribuir.
- **Problema:** o `distribuir` atual cria contatos, não atribui. Ele roda uma vez por ciclo: `QualificacaoCiclo.server.js:161` e a `condition` `distribuido_em.nil()` em `ui-actions/ciclo.now.ts:37`.
- **Problema:** os encaminhamentos chegam entre os dias 10 e 30. Os ATF da UX-004 (`tests/US-MOD-UX-004.now.ts:75-85, 194-199, 234`) perdem o objeto.
- **Correção:** escrever um dos dois modelos em P1, B2, A3, CUJ-2 e F4.
  - (i) "Escalonar" atribui o atendente por um helper extraído (por exemplo `atribuirContato`, que usa `_atendentes()` e `prioridadePorValor()`). "Distribuir lista" e o estado "Distribuir lista" saem da massificada.
  - (ii) "Escalonar" deixa `atendente` vazio e `distribuir` passa a poder rodar várias vezes, filtrando `origem=regua^atendenteISEMPTY`.
  - Nos dois casos, listar quais `it()` da UX-004 mudam.

**2. O teto por dia e canal quebra o CUJ-4 e a G6.** Revisores: design, readiness. Seções: B1 Propriedades, B2 Enviar, CUJ-4, Verification.
- **Problema:** com `segundos_por_dia=60`, as 4 etapas caem no mesmo dia de calendário. A etapa 4 (SNE) bate no teto que a etapa 1 já usou, e o fallback esbarra no e-mail e no SMS já usados. Para B, a etapa 3 também cai. Assim "1 comunicação por etapa" falha.
- **Correção:** definir o "dia" do teto como uma janela de `segundos_por_dia` segundos por contribuinte e canal, ou desligar o teto quando o valor for menor que 86400. Incluir em B8 um ATF do teto em modo demo.

**3. Coordenador não grava régua nem etapa.** Revisores: design, codebase. Seções: A2 (l.159, 162), B5, CUJ-6, Ativar/Pausar.
- **Problema:** `security/acl-base.now.ts:177-209` só tem `read` para `regua` e `regua_etapa`. Sem write, o "muda o texto e salva" do CUJ-6 não roda, e o Ativar/Pausar não grava.
- **Correção:**
  - ACL `write` (registro e `*`) em `regua` e `regua_etapa` para coordenador e admin.
  - ACL de campo só leitura para `ordem`, `regua`, `codigo`, `versao` e `flow`.

**4. As ACLs de `regua_inscricao` não estão definidas.** Revisores: design, codebase. Seções: B1, A4, B5.
- **Problema:** sem read, o coordenador não abre "Inscrições ativas". Sem a negação por carteira, o atendente vê inscrições de outras carteiras, o que fere o padrão SEC-002.
- **Correção:**
  - read para atendente, coordenador e admin.
  - deny `podeVer(current,'contribuinte.atendente')`, como em `security/carteira.now.ts:104-119`.
  - BR de query `restringirConsulta(['contribuinte.atendente'])`, como em `business-rules/carteira.now.ts:130-152`.
  - Nenhum create ou write para as personas.

**5. `inscrever` está em `publicar()` (botão), não em todos os caminhos de publicação.** Revisores: design, readiness, codebase. Seções: D7, B3 (l.282).
- **Problema:** a publicação pelo form, pela lista ou por API passa pela BR before `prepararPublicacao` (SEC-010, `QualificacaoCiclo.server.js:64-86`). Nesses caminhos ninguém chamaria `inscrever`.
- **Correção:** BR **after** update em `ciclo` com `previous.estado=='previa' && current.estado=='publicado'`, chamando `ReguaMotor.inscrever`. Precisa ser after, porque o controle é gravado no before.

**6. Falta idempotência no envio e no encaminhamento.** Revisor: design. Seções: B2 Enviar e Escalonar, B1 `comunicacao`.
- **Problema:** se um passo for reexecutado (retry, contexto reiniciado), saem duas comunicações por etapa ou dois contatos por contribuinte e ciclo.
- **Correção:**
  - O Enviar grava `comunicacao.etapa`, `regua` e `ciclo` (o campo `etapa` já existe) e sai sem enviar se já houver comunicação dessa inscrição e etapa que não esteja "agendada".
  - O Escalonar reusa o dedupe `jaTem` e não cria contato se já existe contato aberto.
  - Pôr os dois casos em B8.

**7. A F2 não compila.** Revisor: readiness. Seção: Fases.
- **Problema:** os Flows gerados na F2 importam `../actions/regua.now`, que só nasce na F3.
- **Correção:** criar as 4 custom actions na F2, com contrato final e script mínimo, ou mover o gerador e os Flows para a F3.

**8. O contrato das 4 custom actions não está definido.** Revisores: readiness, codebase. Seções: D10, B2, B4, B8.
- **Problema:** faltam `internalName`, o tipo (Column) de cada input e output, o script `Now.include`, `inputVariables`/`outputVariables`, `wfa.assignActionOutputs` e a forma de chamar o `ReguaMotor`.
  - O Flow passa `ordem: '1'` como string.
  - A fumaça de B8 usa `x_2326104_cob.enviar_comunicacao_regua`, nome que o doc não declara.
- **Correção:** uma tabela por action. Fonte: `docs/api/flow/custom-action-api.md`.

---

## 🟡 Major

**Viabilidade na API Fluent**

1. **`relativeDatetime` tem duas formas e o plano B está incompleto.** Revisores: readiness, codebase. Seções: B2 (l.249) e B7 (l.330).
   - **Problema:** o exemplo usa template literal, que a própria B7 proíbe.
   - **Problema:** o plano B usa `liberada`, que não está em B1, e um ScheduledScript que não está em Arquivos.
   - **Correção:** usar `relativeDatetime: wfa.dataPill(...)` direto e testar as duas formas na F0. Descrever o plano B por completo: coluna, arquivo `scheduled-scripts/…`, intervalo e `waitForCondition`.
2. **D9 contradiz B2.** Revisores: design, readiness. D9 diz que o Flow faz `lookUpRecord` em `regua_etapa`; o B2 lê a etapa no `ReguaMotor`. Alinhar o texto de D9 ao B2.
3. **O bloco final do Flow não está escrito, e o "sem resposta" decide logo após o envio.** Revisores: design, readiness. Seção: B2.
   - **Problema:** o `if` por etapa encerra o Flow, então o "escalonar depois da última" do comentário nunca é alcançado.
   - **Problema:** não há janela de resposta nem nova checagem de guarda antes de escalonar.
   - **Correção:** escrever o código literal da etapa N e do fecho, com espera de resposta → `checarGuardas` → `escalonar`, e remover o caminho duplicado. Lembrar que `wfa.stage` não pode ser a última instrução.
4. **"Agendar" roda antes das guardas.** Revisor: design. Seções: B2, CUJ-5.
   - **Problema:** em inscrição já encerrada, "Agendar" regrava `etapa_atual` e `proxima_etapa_em`, e o contexto espera à toa.
   - **Correção:** "Agendar" sai sem gravar se `status != ativa` e devolve `segue=false`. `encerrarPorRegularizacao` cancela o contexto.
5. **Erro numa custom action deixa a inscrição "ativa" para sempre.** Revisor: design. Correção: `tryCatch` em cada bloco de etapa, status `erro` e filtro "Inscrições com erro". Registrar nos Riscos.
6. **ATF de inscrição dispara o Flow real.** Revisor: readiness. Seção: B8.
   - **Problema:** inserir `regua_inscricao` ativa no ATF dispara o Flow em background, fora do rollback.
   - **Correção:** usar uma régua `codigo=atf_*` que nenhum gatilho casa.
   - Nomear os passos: `atf.list.listUIActionVisibility`, `atf.form.uiActionVisibility`, `atf.applicationNavigator.moduleVisibility`, `atf.server.createUser`, `runServerSideScript`.
   - Casos que faltam: ProximaAcao, recusa de inscrição em controle, reenviar e as validações do gerador.

**Conflito com o que já está implementado**

7. **O override de Update no ciclo impede salvar a prévia.** Revisores: design, codebase. Seções: D2, A2 (l.158).
   - **Problema:** o coordenador grava nome, referência e critério em prévia (`security/ciclo.now.ts:8-24`). A frase "todo dado muda por verbo" não confere com o código.
   - **Correção:** pôr `condition: current.estado != 'previa'` no override de ciclo, ou aplicar o override só ao contato.
8. **G2 contradiz A2 no caso.** Revisor: design. G2 diz "nenhum Update" no form de caso, e a A2 mantém o Update no caso. Tirar "caso" da G2 ou estender o override ao caso.
9. **`encerrarPorRegularizacao` é barrado pelas BRs atuais.** Revisores: design, codebase. Seção: B3 (l.284).
   - **Problema:** `recusarContatoForaDaCarteira.server.js:5-17` e `ContatoLigacao.encerrar` (`_temPapel`) barram o encerramento. `distribuir` começa com `_ehCoordenador()`, o que não serve para um Flow com `runAs: system`.
   - **Correção:** extrair um helper sem checagem de papel (`_criarContato`). Documentar a exceção de sistema na BR de carteira. ATF com regularização gravada por um atendente.
10. **`prepararPublicacao` não decide o segmento.** Revisor: codebase. Seções: B3 (l.287), Arquivos (l.388).
    - **Problema:** quem decide o segmento é `SegmentacaoScore.classificar` (`SegmentacaoScore.server.js:42-60`, chamado pela BR em `business-rules/segmentacao.now.ts`).
    - **Correção:** a leitura de `encaminhado_qualificada_em` entra ali, e `QualificacaoCiclo` não muda nesse ponto.
11. **"Lista da equipe" fica fora de alcance.** Revisores: zoom-out, design, codebase. Seções: A4, D4.
    - **Problema:** o separador "Minha lista" (`navigation/menu.now.ts:14-18`) tem `roles` só de atendente.
    - **Problema:** o filtro usa `ORDERBY` sem `GROUPBY`. A v1 usava `^GROUPBYatendente` (`ux-cobranca-v1.md:105`).
    - **Problema:** o coordenador já tem 12 módulos, o limite da v1. Com os dois novos ficam 14.
    - **Correção:** separador próprio, ou papéis coordenador e admin no separador. Filtro `status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em`. Revogar o limite de 12 de forma explícita, ou levar "Inscrições ativas" para uma related list da régua.
    - **Para o admin:** "Administração > Contato da lista" (`menu.now.ts:254`) já existe.
12. **O admin do app não herda as ações do coordenador.** Revisor: zoom-out. Seções: A1 (l.148), G4, CUJ-3.
    - **Problema:** `role_admin` não tem `containsRoles`, e `_ehCoordenador()` recusa o admin do app.
    - **Correção:** dizer que "admin" é o admin de sistema, ou incluir `containsRoles: [role_coordenador]` em `role_admin`.
13. **As UI Actions de lista não estão especificadas.** Revisores: todos os quatro. Seções: A1, A2, A5, D1.
    - **Problema:** `ua_registrar_ligacao`, `ua_encerrar_contato` e "Encerrar caso" são `isClient` com `g_form`. Elas não podem ganhar o bloco `list`.
    - **Problema:** UI Action não recebe parâmetro nem troca view, então "abre na seção certa" não tem mecanismo.
    - **Problema:** a versão de lista precisa de um `actionName` diferente do da action de form (deduplicação, `ui-action-guide.md:156-158`).
    - **Problema:** `motivo_encerramento` foi para a seção só leitura, mas o Encerrar exige esse campo (`ui-actions/contato.now.ts:59-64`).
    - **Problema:** "Criar nova versão" não aparece na A1. São 8 actions, não 7.
    - **Correção:**
      - Uma tabela por UiAction: `$id`, `actionName`, `table`, `form`/`list`, `condition`, `roles`, `order` e script. Vale também para Ativar/Pausar, Reenviar, Ver execução(ões) e o override.
      - `motivo_encerramento` vai para uma seção editável.
      - Os itens de contexto só redirecionam para o form.
14. **`proxima_acao` não fecha a G3.** Revisores: design, readiness, codebase. Seções: A3, D3, G3.
    - **Problema:** não há backfill do seed.
    - **Problema:** faltam os estados critério publicada/substituída, caso encerrado e ciclo encerrado.
    - **Problema:** não está definido o que é "aberto" por tabela, e os textos com data envelhecem.
    - **Problema:** TEL-034 e TEL-023 (view `tel_023`) já têm 6 colunas e o ciclo não tem `List()`.
    - **Correção:**
      - Fix script de backfill.
      - Tabela de estados completa.
      - Encoded query de "aberto" por tabela.
      - Dizer qual coluna sai de cada lista e criar a `List()` do ciclo.
15. **Seeds dependentes ficam órfãos.** Revisor: codebase. Seções: B1 seed, Arquivos (l.383).
    - **Problema:** `seed/comunicacao.now.ts:10-12` aponta para `seed_regua_*`, `envio_sim` depende da comunicação, e o `consentimento` aleatório conflita com "consentimentos coerentes".
    - **Problema:** o seed novo deixa de fora `janela_atribuicao_dias`, que a RN-NOVO-F4-007 usa.
    - **Correção:** incluir esses seeds em `seedManual` e em Arquivos, junto com o DELETE que geram. Pôr `janela_atribuicao_dias: 30` no seed gerado.

**Modelo e regras**

16. **`ordem_fallback` tem duas fontes.** Revisores: design, readiness, codebase. O campo `regua.ordem_fallback` já existe (`tables/regua.now.ts:22`, TEL-013) e o doc cria também a propriedade. Escolher uma; o zoom-out sugere uma constante no `ReguaMotor`.
17. **A cardinalidade de comunicação × `envio_sim` está indefinida.** Revisores: design, readiness. "Pulada + canal seguinte" sugere 2 registros, e "Falha com 3 tentativas" sugere 1. Fixar 1 comunicação por etapa (canal final) e 1 `envio_sim` por tentativa, definir o status final e ajustar G6 e a Verification.
18. **O consentimento não tem vigência, e a regra de canal é ambígua.** Revisor: codebase.
    - `tables/consentimento.now.ts` só tem `situacao` e `registrado_em`. Regra proposta: vale o registro mais recente por contribuinte e canal; sem registro, não há opt-in.
    - Há dois campos de falha (`canal_sim.forcar_falha`/`falhar` e `envio_sim.falhar`) e o valor `recusado_sem_optin` não é usado. Escolher qual vale.
    - O mapeamento tributo → `regua.carteira` está implícito: Parcelamentos não é tributo.
19. **Os retornos de envio não cabem como related list da inscrição.** Revisor: codebase. Seções: D12, B5. Declarar um `sys_relationship` (no padrão de `ui/caso-dossie-niveis.now.ts:68`) ou criar `envio_sim.inscricao`.
20. **New e `codigo` deixam régua e Flow divergirem.** Revisores: design, readiness. Seções: A2, B1, B2 condition.
    - **Problema:** uma régua ou etapa criada pelo form não tem Flow.
    - **Problema:** trocar o `codigo` solta o gatilho `regua.codigo=ipva`.
    - **Correção:** `new_roles` só admin em `regua` e `regua_etapa` (inclusive na related list) e `codigo` só leitura.
21. **A estrutura só é validada no gerador.** Revisores: design, readiness. Seções: D9, D14, B4. Pelo form, a etapa pode ficar com dia fora de ordem ou a última etapa sem `encaminhar_*`. Levar as duas validações para a BR before de `regua_etapa`.
22. **Mudar a estrutura com execuções em andamento não está tratado.** Revisor: design. Seções: P2 (a), B4 DELETE.
    - **Problema:** um contexto antigo lê a etapa nova por `ordem`, e uma régua removida apaga o Flow com esperas abertas.
    - **Correção:** ao subir a versão, encerrar as inscrições ativas (`regua_alterada`) e cancelar os contextos, ou fazer `checarGuardas` comparar `versao_regua` com `regua.versao`.
    - **Conflito entre revisores:** o zoom-out pede para cortar os dois campos de versão. Se o caminho escolhido for "encerrar ao reinstalar", os campos podem sair.
23. **P3 = (a) conflita com as guardas.** Revisores: readiness, zoom-out.
    - **Problema:** quem tem parcelamento "em risco" tem débito `parcelado`. A guarda e a BR "virou parcelado → encerra" encerram a inscrição na hora, e a inscrição não tem `ciclo` para o `emControle`.
    - **Correção:** escrever a guarda por carteira e qual ciclo a BR de `parcelamento` grava. O zoom-out propõe outro caminho: mudar o padrão para (b), com régua inativa no seed.
24. **A lista de arquivos não serve de allowlist.** Revisores: readiness, codebase. Seção: Arquivos.
    - **Problema:** usa globs e placeholders (`regua*`, `ui-actions/*`, `US-MOD-UX-0xx`).
    - **Problema:** faltam `tests/suite.now.ts`, `SegmentacaoScore.server.js`, a BR after de ciclo, os scripts `Now.include`, os arquivos do plano B e a remoção dos `seed/regua*` e `seed/canal_sim`.
    - **Problema:** "`npm test` do app" não existe: `app/package.json:9-14` não tem script `test`, e o `npm test` da raiz só roda `.claude/**/*.test.mjs`.
    - **Correção:** caminhos exatos, um por linha, com novo, muda ou apaga, e o comando que roda o teste do gerador.

**Simplicidade (zoom-out)**

25. **Cortar `regua.flow`, "Abrir no Flow Designer" e `flow_operator`.**
    - **Motivo:** com P2 = (a), o coordenador não edita o Flow. O corte remove 2 riscos, 2 itens da F0 e um papel global.
    - **O que fica:** "Ver execução" no form da inscrição e "Ver execuções" só para o admin.
    - **Se o dono quiser o link:** o nome "Régua: <nome>" basta para achar o Flow. As URLs `$flow-designer.do` e `sys_flow_context.source_record` são da plataforma, não do SDK, e entram na F0 (readiness).
26. **Encerrar contatos abertos na regularização (RN-09, l.284) volta escopo cortado na v1.1.** Tirar da v2 ou criar uma P4 com padrão "fora".
27. **Campos de versão sem leitor.** `regua.versao` e `versao_regua` não são lidos por nenhum passo, guarda ou teste. Cortar, salvo se o item 22 for resolvido por versão.
28. **B2 e B7 descem ao nível de código.** O B2 traz TS completo e a B7 tem 19 linhas. Trocar o TS pela sequência de cada etapa e mover o código para o B4 ou um anexo. Na B7, manter só as linhas que mudam o desenho.

---

## 🟢 Nit

- Rótulo do stage "Etapa 1 · SNE · utilitária" fica errado quando o coordenador edita a etapa. Usar `Etapa N`. (readiness)
- No CUJ-5, um stage em curso quando o `endFlow` roda termina como `complete`, não como "encerrado" (`wfa-flow-stages-guide` §State Lifecycle). (readiness)
- O template do B2 importa `action` e não usa. (readiness, codebase)
- O JSON usa `dia` e a coluna é `offset_dias`: escrever o mapeamento. Dizer quem incrementa `versao`. `opt_out_todos` não tem quem produza. (readiness, codebase)
- `iniciada_em` sem valor padrão deixa a espera com pill vazio. Preencher em `inscrever`. (design)
- Pausar encerra as inscrições (`regua_pausada`) e reativar não retoma. Escrever isso em B3 e B5. (design)
- O ATF do override precisa do `Now.ref` da UiAction local, não do `sysverb_update` global. (design)
- `teto_dia_canal` e `ordem_fallback` podem ser constantes no `ReguaMotor`, com referência ao RN. Fica só `segundos_por_dia` como propriedade. (zoom-out)
- "Reenviar" (US-MOD-F4-013) não é pedido pela Overview nem por nenhum CUJ. Marcar como opcional ou última story. (zoom-out)
- `proxima_acao` em critério e inscrição, e a BR `display`, repetem informação. Limitar a contato, caso e ciclo, e o aviso só ao contato. (zoom-out)
- Usar `gs.getMessage` no `addInfoMessage`. `server/ui/` sai do padrão por domínio. `codigo`+`versao` pode seguir o modelo do `CriterioVersao`. (codebase)
- `QualificacaoCiclo.motivoRecusaAcao` e `recusarAcaoControle.server.js:1-9` servem direto para a BR de inscrição em controle. Conferir se `new_roles` aceita array, e usar `related_list` para as related lists. (codebase)

**O que o SDK confirma:** `trigger.record.created` com `condition` e `run_flow_in`; `if` com `^OR` entre pills; `FlowStage` dentro de `if`; `new_roles` em `sys_ui_list_control`; override por `actionName`; `containsRoles` com string; propriedade `integer`.

**O que pode ser reusado:** `emControle`, a BR de contato em controle, `CarteiraAtendente.veTudo` (a "Lista da equipe" não precisa de ACL nova) e "Delete sem mudança".

---

## Mudanças mínimas para ficar implementável

1. **P1:** escolher (i) ou (ii) do Blocker 1 e reescrever CUJ-2, A3 e o ajuste da UX-004, listando os `it()` que mudam.
2. **Teto em dias simulados:** janela de `segundos_por_dia` por contribuinte e canal, com um ATF em modo demo.
3. **ACLs:** write em `regua` e `regua_etapa` (com campo `codigo`/`ordem` só leitura); conjunto completo em `regua_inscricao` (read, deny de carteira, BR de query, sem write); `new_roles` só admin em régua e etapa.
4. **`inscrever`:** chamar numa BR after update de `ciclo` (prévia → publicado), não em `publicar()`.
5. **Idempotência:** dedupe por inscrição e etapa no Enviar e por contribuinte e ciclo no Escalonar. Helper `_criarContato` sem checagem de papel, também usado por `encerrarPorRegularizacao`, com exceção de sistema na BR de carteira.
6. **Contrato das custom actions:** uma tabela por action com `internalName`, tipos, script e saídas. Criar as actions na F2 junto com os Flows.
7. **Flow:**
   - Escrever a etapa N e o fecho: espera de resposta → guardas → escalonar.
   - Usar `relativeDatetime: wfa.dataPill(...)` sem template literal.
   - "Agendar" checa o status e devolve `segue`.
   - `tryCatch` com status `erro`.
   - D9 alinhado ao B2.
8. **UI Actions:**
   - Tabela completa por action.
   - Ações de lista novas, só servidor, com `actionName` próprio e que só redirecionam.
   - `motivo_encerramento` editável.
   - Override de Update no ciclo com `estado != previa`; G2 sem o caso.
9. **Navegação e lista:** separador próprio para a "Lista da equipe" com `GROUPBYatendente`; decisão explícita sobre o limite de 12 módulos e o de 6 colunas; `List()` do ciclo; backfill e tabela de estados completa para `proxima_acao`.
10. **Modelo:**
    - Uma fonte para `ordem_fallback`.
    - Regra de vigência do consentimento.
    - Um campo de falha.
    - Mapa tributo → carteira.
    - Cardinalidade de comunicação e `envio_sim`.
    - `sys_relationship` para os retornos.
    - Seeds dependentes e `janela_atribuicao_dias` no plano.
11. **Arquivos:** allowlist com caminhos exatos (com `suite.now.ts`, `SegmentacaoScore.server.js` e as remoções de seed) e o comando real que roda o teste do gerador.
12. **ATF:** régua `atf_*` sem gatilho, com os passos ATF nomeados.
13. **Cortes que reduzem a F0** (decisão do Elephant ou do dono): `regua.flow`, "Abrir no Flow Designer" e `flow_operator`; RN-09 na regularização; P3 com padrão (b), ou guarda por carteira se (a) ficar; campos de versão, se o item 22 não usar versão.
