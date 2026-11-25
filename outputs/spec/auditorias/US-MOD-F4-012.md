# Auditoria de Entrega — [US-MOD-F4-012] Inscrição na publicação, regularização encerra, pausa e encaminhamento

- **User Story:** US-MOD-F4-012 (nó `STORY-MOD-F4-012` no `outputs/spec/tasks.json`, depende da STORY-MOD-F4-011) — RF-MOD-F4-003, RF-MOD-F4-009
- **Features/IDs cobertos:** RN-NOVO-F4-009 (inscrição na régua na publicação do ciclo) · RN-NOVO-F1-002 (regularização dentro do ciclo encerra a abordagem) · RN-NOVO-F4-013 (encaminhamento no fecho da régua) · RN-NOVO-F4-008 (esgotou a régua vai à qualificada) · RN-NOVO-F4-011 (guardas antes do envio e do encaminhamento) · AC-RF-MOD-F4-012-01 a -04 · TASK-MOD-F4-012-01 a -03 · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2 (A4, B1, B3, B4, B5, B9, D5, D7, D13, D14)
- **Branch/commit auditado:** `feat/v0` @ `b7b589b`. Delta: `git diff 3396619..b7b589b -- app outputs/spec/data-model.json` (sem as mudanças de kit em `.claude/`, `harness-zona.lock.json` e o gerado `generated/keys.ts`). O código das duas stories (F4-012 e F4-013) está no mesmo commit `b7b589b`. Recibo ATF `outputs/spec/auditorias/atf/US-MOD-F4-012.json`: 8/8 `success`, commit `b7b589b`.
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Escopo F4.** Esta US entrega os gatilhos que criam e encerram inscrição (publicação do ciclo, débito, regularização, pausa da régua), o escalonamento real no fecho do Flow, «Pausar»/«Ativar» e o módulo «Inscrições». A régua Parcelamentos e a leitura da inscrição por carteira são da US-MOD-F4-013 (relatório próprio), embora estejam no mesmo commit.

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL` registrada no marcador `outputs/spec/em-andamento.md`, seguida por delegação do dono.

---

## 1. Inventário do delta

**Arquivos/módulos tocados pela US** (cada um com o papel dele):
- `app/src/server/regua/ReguaMotor.server.js` — o motor da régua (Script Include). Nesta US: `escalonar` real (L388), `inscrever` (L431), `reavaliar` (L519), `encerrarDaRegua` (L543), `pausar`/`ativar` e `_gravarAtiva` (L567), e os auxiliares `_reguasAtivas`, `_inscritosAtivos`, `_criarInscricao` (L581-623).
- `app/src/server/qualificacao/QualificacaoCiclo.server.js` — serviço do ciclo. `_criarContato` (L221, o insert que estava dentro de `distribuir`, com `origem` e `inscricao`), `atribuirContato` (L252, novo, sem checagem de papel) e `_atendenteMenosCarregado` (L295). `distribuir` passa a usar o helper (L200).
- `app/src/server/qualificacao/SegmentacaoScore.server.js` — classifica a linha de segmentação. Lê `contribuinte.encaminhado_qualificada_em` (L85) e, com a marca, força `qualificada` com o motivo «Esgotou a régua (RN-NOVO-F4-008)» (L110-115).
- `app/src/server/regua/inscreverAoPublicar.server.js`, `reavaliarContribuinte.server.js`, `encerrarAoPausar.server.js` — corpo das business rules (regras que rodam no servidor em toda gravação); cada um chama o motor.
- `app/src/fluent/business-rules/regua.now.ts` — 4 business rules novas desta US: inscrever ao publicar (L54-65), reavaliar no débito (L67-78), reavaliar na regularização (L80-90), encerrar ao pausar (L92-103).
- `app/src/fluent/ui-actions/regua.now.ts` (novo) — «Pausar» e «Ativar» no form e na lista da régua, papéis coordenador e admin do app.
- `app/src/fluent/navigation/menu.now.ts:92-96` — módulo «Inscrições» no separador Réguas; «Disparos com falha» passa para a ordem 3300.
- `app/src/fluent/tables/contribuinte.now.ts:39` — coluna `encaminhado_qualificada_em` (data e hora).
- `outputs/spec/data-model.json` — a coluna nova (com `semSeed`, para não regerar o seed dos contribuintes) e o módulo «Inscrições».
- `app/src/fluent/tests/US-MOD-F4-012.now.ts` (8 testes ATF) e `tests/suite.now.ts`.

**Endpoints alterados/criados:** nenhuma API REST própria. A publicação do ciclo por Table API, form, lista ou botão dispara a mesma business rule.

**Entidades/modelos tocados:** `x_2326104_cob_regua_inscricao` (criada e encerrada pelo motor), `_contato` (criado ou atualizado pelo escalonamento), `_contribuinte` (marca e atendente), `_segmentacao`, `_debito`, `_regularizacao`, `_regua` (`ativa`), `_comunicacao` (agendada vira encerrada), `sys_ui_action`, `sys_app_module`.

**Stack envolvido no delta:** ServiceNow Fluent (SDK 4.14.3), JavaScript de servidor (Rhino) no Script Include e nas business rules, UI Action da Core UI clássica, ATF.

**Varredura determinística** (`node .claude/ferramentas/varrer-entrega.mjs --desde-o-ramo 3396619 --repo app`): 19 arquivos mudados, 3 achados «erro engolido no catch» (ALTO na ferramenta). Dois são desta US: `inscreverAoPublicar.server.js:6` e `reavaliarContribuinte.server.js:6`. O terceiro (`inscreverParcelamento.server.js:6`) é da F4-013. Conferido no disco: os três registram o erro com `gs.error` e o sys_id do registro, então o erro não some. O efeito real está em BUG-002.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| `QualificacaoCiclo.distribuir` («Distribuir lista», UX-004) | O insert do contato saiu para `_criarContato`; contato criado pela régua antes da distribuição precisa contar no dedupe | médio |
| `QualificacaoCiclo.prepararPublicacao` (before update do ciclo, sorteio do controle) | A BR after nova depende de o segmento final já estar gravado | médio |
| `SegmentacaoScore.aplicar` (classificação da segmentação) | Passa a ler a marca no contribuinte | médio |
| `ReguaMotor.motivoParada` / `encerrar` (F4-011) | `reavaliar` e `encerrarDaRegua` reutilizam os dois | baixo |
| Seed de contribuinte (`sn-seed`) | Coluna nova numa tabela com seed gerado | médio |
| `menu.now.ts` (ordem do separador Réguas) | Módulo novo desloca «Disparos com falha» | baixo |
| BR de consulta por carteira em `regua_inscricao` (F4-013) | Os métodos do motor rodam na sessão de quem dispara a gravação (coordenador ou atendente) | baixo |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (A4, B1, B3, B4, B5, B9, D5, D7, D13, D14; AC -01 a -04; as 5 regras de negócio da US); segurança (quem pausa e ativa, quem dispara inscrição e escalonamento, escalonamento como system); teste de mesa sobre o código real; performance (consultas da publicação e do escalonamento); bugs técnicos (marca da qualificada, erro na BR, datas); testes (8 ATF); observabilidade; regressão nos vizinhos.

**Não auditado (e por quê):**
- Régua Parcelamentos e leitura por carteira: US-MOD-F4-013.
- Execução de ponta a ponta do Flow com escalonamento real: o design (B9) diz que não cabe em ATF. Há uma execução em andamento na instância e o auditor não a acessou.
- Rate limiting, SSRF, prompt injection: não há rota nova chamada pelo usuário, URL vinda do usuário nem LLM.

## 4. Conformidade

Verificado contra o design v2.2, o `data-model.json`, `.claude/rules/harness/servicenow-ui.md`, o `CLAUDE.md` e as tasks da US.

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| D7 / B4: BR after update de ciclo, `previous.estado == 'previa' && current.estado == 'publicado'`, chama `inscrever` | `business-rules/regua.now.ts:54-65` | ✅ PASS | Vale por qualquer caminho; ATF publica por `GlideRecord` |
| B3 `inscrever`: massificada; carteira = tributo com maior soma em aberto; sem débito, sem régua ativa ou já inscrito → pula; status ativa, etapa 0, início agora | `ReguaMotor.server.js:431-470,609-623` | ✅ PASS | Consultas agregadas, sem consulta por contribuinte |
| B3 `inscrever`: depois limpa `encaminhado_qualificada_em` dos segmentados do ciclo | `ReguaMotor.server.js:475-482` | ⚠️ PARCIAL | Segue o texto do design, mas limpa também a marca que a segmentação ainda não leu (BUG-001) |
| B4: débito muda de status → `reavaliar`; insert em regularização → `reavaliar` | `business-rules/regua.now.ts:67-90` | ✅ PASS | |
| B3 `reavaliar`: cada inscrição ativa com motivo de parada encerra | `ReguaMotor.server.js:519-540` | ✅ PASS | Reusa `motivoParada` e `encerrar` (F4-011), que fecham as comunicações agendadas |
| B4: régua `ativa` vira falso → encerra as ativas com `regua_pausada` | `business-rules/regua.now.ts:92-103`, `ReguaMotor.server.js:543-555` | ✅ PASS | |
| B3 / D13 `escalonar`: idempotente; lê a ação da última etapa; ativa → `atribuirContato`, grava `contato`, encerra `encaminhada_ativa`; qualificada → grava a marca, encerra `encaminhada_qualificada` | `ReguaMotor.server.js:388-421` | ✅ PASS | Última etapa sem encaminhar lança erro; o `catch` do Flow grava `erro` |
| D14 `atribuirContato`: contato aberto do ciclo → grava `inscricao` e antecipa `proxima_acao_em`; senão cria com o atendente do contribuinte ou o menos carregado (empate por login), gravado no contribuinte | `QualificacaoCiclo.server.js:252-322` | ✅ PASS | Sem ciclo, o dedupe olha contatos sem ciclo |
| B3 `_criarContato` e `distribuir` com o mesmo comportamento | `QualificacaoCiclo.server.js:200,221-238` | ✅ PASS | `distribuir` continua com papel, `jaTem` por qualquer contato do ciclo e rodízio |
| B4: `SegmentacaoScore.aplicar` com a marca → qualificada, motivo «Esgotou a régua (RN-NOVO-F4-008)» | `SegmentacaoScore.server.js:19,85,110-115` | ✅ PASS | |
| B1: `contribuinte.encaminhado_qualificada_em` | `tables/contribuinte.now.ts:39`, `data-model.json` | ✅ PASS | `semSeed` mantém os 51 contribuintes iguais |
| A1 / D1: «Pausar» e «Ativar» no form e na lista, mesmo método, lista sem redirecionar; `condition` e `roles` | `ui-actions/regua.now.ts:6-96` | ✅ PASS | Regra de UI: ação destrutiva com `condition` e `roles`, `setRedirectURL` no form |
| TASK-MOD-F4-012-03: mensagens «Régua pausada: {n} inscrições encerradas.» e «Régua ativada: novas inscrições nascem na próxima publicação.» | `ReguaMotor.server.js:53-54` | ⚠️ PARCIAL | A mensagem de pausa não traz o número de inscrições encerradas (CONF-002) |
| A4: módulo «Inscrições», FILTER `statusINativa,erro^ORDERBYDESCstatus^ORDERBYproxima_etapa_em`, coordenador | `navigation/menu.now.ts:95`, `data-model.json` | ⚠️ PARCIAL | Filtro igual; a ordenação é `ORDERBYDESCiniciada_em` e não está entre os desvios declarados (CONF-001) |
| D5: coordenador com 14 módulos | `app/spec_story.md` (entrada F4-012/013) | ✅ PASS | «Inscrições» é o 14º; ATF `t_f4012_ui_coordenador` e `t_f4012_ui_atendente` conferem a visibilidade |
| B9: os 6 testes F4-012 do design | `tests/US-MOD-F4-012.now.ts` | ✅ PASS | Mais 2 de UI (coordenador e atendente) |
| Allowlist do design | — | ✅ PASS | Os 3 arquivos `server/regua/*.server.js` novos são corpo de BR por `Now.include`, padrão do repositório |
| Evidência de ponta a ponta citada no `app/spec_story.md` | `outputs/spec/auditorias/F4-012-execucao-demo.md` | ⚠️ PARCIAL | O arquivo citado ainda não existe no repositório (CONF-003) |

**CA da US cumpridos?** Sim.
- **AC-RF-MOD-F4-012-01** (publicar por qualquer caminho inscreve a massificada com débito em aberto) — cumprido; ATF `t_f4012_br_publicar` (publicação por `GlideRecord`, 9 de 10, o sorteado do controle fora, prévia renomeada não inscreve) e `t_f4012_inscrever`.
- **AC-RF-MOD-F4-012-02** (regularizou, a inscrição encerra na mesma transação) — cumprido; ATF `t_f4012_reavaliar` (débito de IPVA e regularização encerram; débito de outro tributo não).
- **AC-RF-MOD-F4-012-03** (esgotou a régua: lista do atendente sem contato em dobro, ou qualificada do ciclo seguinte) — cumprido; ATF `t_f4012_escalonar_ativa` e `t_f4012_escalonar_qualificada`. A janela descrita em BUG-001 não quebra o caso do critério.
- **AC-RF-MOD-F4-012-04** (Pausar encerra as ativas; Ativar não retoma) — cumprido; ATF `t_f4012_pausa`.

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

Nenhum. Os pontos conferidos estão no item 6.

## 6. Testes de mesa (vetores no delta)

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| Auth Bypass | Atendente pausa ou ativa a régua | ✅ BLOQUEADO | UI Actions com `roles: [role_coordenador, role_admin]` (`ui-actions/regua.now.ts:14,37,60,82`); gravar `ativa` exige a ACL de write da régua (coordenador e admin, F4-010); ATF `t_f4012_ui_atendente` |
| Privilege Escalation | Persona força escalonamento ou inscrição (o Flow roda como system) | ✅ BLOQUEADO | `escalonar` só é chamado pelo Flow; inscrição só nasce no servidor (sem ACL de create, B5); `atribuirContato` não tem checagem de papel, como o design pede, e não é exposto em UI Action |
| Privilege Escalation | Quem publica o ciclo | ✅ BLOQUEADO | `prepararPublicacao` recusa quem não é coordenador antes de a BR after rodar (`QualificacaoCiclo.server.js:106-108`) |
| IDOR (um usuário mexe no registro de outro) | Atendente que muda débito ou registra regularização encerra inscrição de outra carteira | ✅ BLOQUEADO | `reavaliar` só encerra quando há motivo real de parada (`ReguaMotor.server.js:528-533`); a escrita em débito e regularização segue a carteira |
| Injeção | sys_ids montados em `addQuery(..., 'IN', lista)` | ✅ BLOQUEADO | As listas vêm de consultas ao banco, não do usuário (`ReguaMotor.server.js:448,478,599`) |
| Mass Assignment | Form do ciclo e da régua | ✅ BLOQUEADO | Campos de publicação são do sistema (`prepararPublicacao`); `ativa` é o único campo que a US lê na régua |
| Secret Exposure | Código novo | N/A | Sem credencial; varredura sem achado de segredo |
| Rate Limit | — | N/A | Sem rota nova chamada pelo usuário |
| Race Condition | Duas publicações do mesmo ciclo | ✅ BLOQUEADO | A BR exige a transição prévia → publicado, que só acontece uma vez |
| Race Condition | Escalonar duas vezes a mesma inscrição | ✅ BLOQUEADO | Inscrição não ativa devolve `destino=''` (`ReguaMotor.server.js:390-392`); ATF «segunda chamada não faz nada» |
| Sigilo / PII em log | Logs novos | ✅ BLOQUEADO | Só sys_id e contagens (`ReguaMotor.server.js:405,416,483,537,553`) |

## 7. Findings de Performance

> **[PERF-001] A publicação do ciclo grava todas as inscrições na mesma transação do clique — BAIXO**
> Arquivo: `app/src/server/regua/ReguaMotor.server.js:463-470` (laço de `_criarInscricao`), `business-rules/regua.now.ts:54-65`.
> Contexto: cada inscrição é um insert com 3 business rules before e o gatilho do Flow. Na demo são dezenas de linhas. Com a carteira real, uma publicação pode inscrever milhares de contribuintes dentro da transação do coordenador, com risco de estourar o tempo da transação.
> Impacto: lentidão ou timeout na publicação em produção; na demo, nenhum.
> Fix: em produção, mover `inscrever` para um evento ou job assíncrono disparado pela BR. O volume de contextos de Flow já está no GAP-155; este achado é sobre o tempo da transação. Registrado em GAP-160.

As outras consultas novas são agregadas ou por lista (`inscrever`, `_inscritosAtivos`, `_reguasAtivas`, `_atendenteMenosCarregado`). Sem consulta dentro de laço.

## 8. Findings de Bugs Técnicos

> **[BUG-001] A publicação limpa a marca da qualificada mesmo quando a segmentação do ciclo não a leu — MÉDIO**
> Linguagem: JavaScript de servidor. Arquivo: `app/src/server/regua/ReguaMotor.server.js:475-482`; `SegmentacaoScore.server.js:110-115`; BR que chama `aplicar` só quando o segmento está vazio (`business-rules/segmentacao.now.ts:16`).
> **Cenário:** o ciclo seguinte já está em prévia, com as linhas de segmentação gravadas. Depois disso, a régua do contribuinte X fecha com «encaminhar à qualificada» e grava a marca. O coordenador publica o ciclo. `aplicar` já tinha rodado sem a marca, então X está como massificada; `inscrever` inscreve X de novo na régua massificada e apaga a marca.
> **Consequência:** X não vai à qualificada em nenhum ciclo (RN-NOVO-F4-008 não se aplica a ele) e volta a receber a régua massificada. Nada avisa.
> **Fix:** limpar só a marca dos contribuintes cuja segmentação no ciclo tem o motivo «Esgotou a régua (RN-NOVO-F4-008)», ou só as marcas gravadas antes da criação da segmentação.
> **TDD RED:** ATF que cria a segmentação do ciclo em prévia, depois escalona à qualificada, depois publica → hoje a marca some e X fica massificada com inscrição nova. **TDD GREEN:** a marca continua e X entra na qualificada na publicação seguinte. O ATF `t_f4012_escalonar_qualificada` grava a marca antes de segmentar, por isso não pega este caso.

> **[BUG-002] Falha na inscrição pela publicação e na reavaliação só vai ao log — BAIXO**
> Linguagem: JavaScript de servidor. Arquivo: `app/src/server/regua/inscreverAoPublicar.server.js:4-8`; `reavaliarContribuinte.server.js:4-8` (achados da varredura).
> **Cenário:** `inscrever` lança erro no meio do laço (ex.: falha de banco). O ciclo fica publicado, parte da massificada fica sem inscrição e o coordenador não vê aviso. A BR não roda de novo, porque a transição prévia → publicado já aconteceu.
> **Consequência:** contribuintes da massificada fora da régua sem ninguém saber, até alguém ler o log. Na reavaliação o efeito é menor: a guarda do Flow (`checarGuardas`) encerra a inscrição antes do envio seguinte.
> **Fix:** na publicação, `gs.addErrorMessage` com o texto do erro para o coordenador, e um caminho de reprocessar (ex.: `inscrever` chamado de novo é seguro, porque não duplica). Registrado em GAP-160.

Conferido e sem achado: `escalonar` relê a inscrição antes de encerrar; `proxima_acao_em` (data) é comparada como texto `AAAA-MM-DD` com a data local de hoje (`QualificacaoCiclo.server.js:253,270-271`); `_gravarAtiva` compara `ativa` com `'1'` como o resto do motor.

## 9. Testes

**CA viraram teste?** AC-01 sim (`t_f4012_br_publicar`, `t_f4012_inscrever`); AC-02 sim (`t_f4012_reavaliar`); AC-03 sim (`t_f4012_escalonar_ativa`, `t_f4012_escalonar_qualificada`); AC-04 sim (`t_f4012_pausa`). **TDD RED/GREEN presente?** Sim: cada regra tem o caso que entra e o que fica de fora. **Cobertura do delta:** boa. Falta o caso de BUG-001.

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F4-012.now.ts` `t_f4012_inscrever` | Sim (régua do maior débito, ativa, com ciclo) | Sim (controle, qualificada e sem débito de fora; segunda chamada não duplica) | Bom |
| `t_f4012_br_publicar` | Sim (publicação por `GlideRecord`, 9 inscrições) | Sim (controle fora; prévia não inscreve) | Bom |
| `t_f4012_reavaliar` | Sim (IPVA regularizado e regularização encerram; comunicação agendada vira encerrada) | Sim (outro tributo não encerra) | Bom |
| `t_f4012_escalonar_ativa` | Sim (cria com origem régua; reaproveita o aberto) | Sim (segunda chamada; sem atendente) | Bom |
| `t_f4012_escalonar_qualificada` | Sim (marca → qualificada → limpa) | Parcial | Ver BUG-001 |
| `t_f4012_pausa` | Sim | Sim (já pausada recusa; outra régua continua) | Bom |
| `t_f4012_ui_coordenador` / `t_f4012_ui_atendente` | Sim | Sim | Bom |

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Inscrição na publicação | Sim, `gs.info` com ciclo, quantidade e usuário (`ReguaMotor.server.js:483`) | Contagem no módulo «Inscrições» | — (falha: BUG-002) |
| Reavaliação | Sim, `gs.info` só quando encerra (`:537`) | — | — |
| Pausa | Sim, `gs.info` com régua, quantidade e usuário (`:553`) | — | — |
| Escalonamento | Sim, `gs.info` com inscrição e contato (`:405,416`); erro sobe ao `catch` do Flow | Execução do Flow e `status = erro` | — |
| PII nos logs | Só sys_id e contagens | — | — |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| `distribuir` (UX-004) | Não. Mesmo papel, dedupe e rodízio; contato criado pela régua conta no `jaTem` | `QualificacaoCiclo.server.js:181-204`; ATF da UX-004 fora do delta e na suíte |
| `prepararPublicacao` | Não. O controle é gravado no before; a BR after vê o segmento final | ATF `t_f4012_br_publicar` («nenhuma inscrição para o sorteado») |
| `SegmentacaoScore.aplicar` | Só quando a marca existe | `SegmentacaoScore.server.js:110-115`; BUG-001 |
| `motivoParada` / `encerrar` | Não; reutilizados sem mudança | diff de `ReguaMotor.server.js` |
| Seed de contribuinte | Não; `semSeed` mantém o seed | `data-model.json` |
| `menu.now.ts` | Só a ordem de «Disparos com falha» | `menu.now.ts:98-102` (ordem 3300) |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

Os 4 critérios de aceite estão cumpridos e testados (8/8 no recibo). Os achados abertos são MÉDIO (BUG-001) e BAIXO (BUG-002, PERF-001, CONF-001 a -003), registrados em GAP-160.

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | BUG-001 | `ReguaMotor.server.js:475-482` | Limpar só a marca que a segmentação do ciclo usou; ATF com a segmentação gravada antes da marca | `outputs/spec/gaps-document.md` (GAP-160) |
| 2 | BUG-002 | `inscreverAoPublicar.server.js:4-8`, `reavaliarContribuinte.server.js:4-8` | Avisar o coordenador da falha na publicação e dar um caminho de reprocessar | GAP-160 |
| 3 | PERF-001 | `ReguaMotor.server.js:463-470` | Inscrição assíncrona em produção | GAP-160 |
| 4 | CONF-001 | `navigation/menu.now.ts:95` | Alinhar a ordenação do módulo «Inscrições» ao design (A4) ou registrar o desvio | GAP-160 |
| 5 | CONF-002 | `ReguaMotor.server.js:53` | Mensagem de pausa com o número de inscrições encerradas (TASK-MOD-F4-012-03) | GAP-160 |
| 6 | CONF-003 | `app/spec_story.md` (entrada F4-012/013) | Gravar `outputs/spec/auditorias/F4-012-execucao-demo.md` com a execução em andamento, ou tirar a citação | GAP-160 |

**Corrigido depois desta auditoria (pelo sn-implement, na mesma F4):** BUG-001 (`inscrever` limpa só a marca com motivo «Esgotou a régua»; o ATF da qualificada ganhou o caso da marca gravada depois da segmentação), CONF-001 (filtro do módulo igual ao A4), CONF-002 (mensagem de pausa com o número; o ATF confere) e CONF-003 (arquivo de execução gravado). Seguem abertos BUG-002 e PERF-001 (GAP-160).

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@b7b589b
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
