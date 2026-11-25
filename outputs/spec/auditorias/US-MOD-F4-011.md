# Auditoria de Entrega — [US-MOD-F4-011] Guardas e envio simulado com fallback, opt-in, opt-out e teto

- **User Story:** US-MOD-F4-011 (nó `STORY-MOD-F4-011` no `outputs/spec/tasks.json`, sem label `fio-condutor`, depende da STORY-MOD-F4-010) — RF-MOD-F4-002, RF-MOD-F4-004, RF-MOD-F4-005
- **Features/IDs cobertos:** RN-NOVO-F4-011 (guardas antes de cada envio e do encaminhamento) · RN-NOVO-F1-002 (regularização encerra a abordagem — nesta US, a parte da guarda; o encerramento na mesma transação é da F4-012) · RN-NOVO-F4-012 (envio simulado com fallback, opt-in, opt-out e teto por janela) · RN-NOVO-F4-003 (opt-in vigente) · AC-RF-MOD-F4-011-01 a -04 · TASK-MOD-F4-011-01 e -02 · design `docs/designs/ux-cobranca-v2-regua-flow.md` v2.2 (B1 «Regras de campo do modelo», B3 `checarGuardas`, `motivoParada`, `encerrar`, `enviar`, D18, D19, B9)
- **Branch/commit auditado:** `feat/v0` @ `7c9e4dd`. Commit desta US: `f69bfc1` (`ReguaMotor.server.js`, `tests/US-MOD-F4-011.now.ts`, `tests/suite.now.ts`). Os commits seguintes (`f047917` a `7c9e4dd`) só mexem no ATF da US-MOD-F4-010. O recibo `outputs/spec/auditorias/atf/US-MOD-F4-011.json` foi gerado no commit `f047917` (6/6 `success`), depois de `f69bfc1` e sem mudança de código entre os dois. O chamador informou que a suíte será reexecutada na rodada final.
- **Data:** 2026-11-25
- **Auditor:** skill `auditoria-de-us` (auditor independente, sem participação na implementação)

> **Escopo F3.** A US é a fase F3 do design: guardas, envio, fallback, opt-in, opt-out, canal não contratado, falha forçada, teto e idempotência, todos no `ReguaMotor`. O modelo, os Flows e as actions vêm da US-MOD-F4-010 (relatório próprio).

> **Isenção g3:** `outputs/spec/auditorias/_isencoes/US-MOD-F4-011-g3.md` dispensa só os validadores de LLM. Ver CONF-002 sobre a evidência que ela cita.

> **Dependência:** `DEPENDENCY_PENDING STORY-SEC-TRANSVERSAL`, seguida por delegação do dono.

---

## 1. Inventário do delta

**Arquivos/módulos tocados pela US:**
- `app/src/server/regua/ReguaMotor.server.js:129-367` — o Script Include (código de servidor reutilizável) que o Flow chama:
  - `checarGuardas` (L133-145): inscrição não ativa → para sem regravar; com motivo de parada → encerra e para.
  - `motivoParada` (L152-186): régua pausada; contribuinte no grupo de controle do ciclo da inscrição; na carteira Parcelamentos, parcelamento em dia/quitado (regularizado) ou rompido; nas outras, nenhum débito em aberto do tributo da carteira (regularizado).
  - `encerrar` (L192-206): grava status, data e motivo; passa as comunicações «agendada» da inscrição para «encerrada» numa só operação.
  - `_canais`, `_consentimentos`, `_tentativasNaJanela` (L209-255): configuração dos canais simulados, consentimento vigente por canal e contagem de tentativas na janela.
  - `enviar` (L264-367): uma comunicação por inscrição e etapa; canal da etapa e depois SNE, e-mail e SMS sem repetir; pula canal não contratado, sem opt-in quando exigido, com opt-out e acima do teto; um retorno de envio por tentativa; para na primeira entregue; grava status, canal final, tentativas, data e motivo.
- `app/src/fluent/tests/US-MOD-F4-011.now.ts` (6 testes ATF) e `tests/suite.now.ts`.

**Endpoints alterados/criados:** nenhum. As regras são chamadas pelas custom actions «Régua: checar guardas» e «Régua: enviar comunicação (simulado)» (US-MOD-F4-010), que rodam no Flow como system.

**Entidades/modelos tocados:** grava `x_2326104_cob_regua_inscricao`, `_comunicacao`, `_envio_sim`; lê `_regua`, `_regua_etapa`, `_canal_sim`, `_consentimento`, `_debito`, `_parcelamento`, `_segmentacao` (por `QualificacaoCiclo.emControle`).

**Stack envolvido no delta:** JavaScript de servidor (Rhino) num Script Include ServiceNow; `GlideRecord`, `GlideAggregate`, `GlideDateTime`; ATF com Jasmine 3.1.

**Varredura determinística** (`varrer-entrega.mjs --desde-o-ramo 7380c49 --repo app`, que inclui este commit): 0 achados.

## 2. Mapa de regressão leve

| Ponto vizinho | Por que o delta o afeta | Risco |
|---------------|-------------------------|-------|
| `QualificacaoCiclo.emControle` (US anteriores do grupo de controle) | A guarda de controle chama o método com ciclo preenchido | médio |
| BR que recusa comunicação de contribuinte em controle (`recusarAcaoControle`) | `enviar` insere comunicação e trata a recusa como erro | médio |
| `canal_sim` e `consentimento` do seed demo (US-MOD-F4-010) | O envio lê os dois | médio |
| Campos antigos `canal_sim.falhar`, `envio_sim.falhar`, `regua.ordem_fallback` | O design manda não lê-los mais (B1, D18) | baixo |
| Contrato das custom actions (US-MOD-F4-010) | As saídas `segue`, `motivo`, `status`, `canal`, `comunicacao` vêm destes métodos | médio |

## 3. Plano de auditoria executado

**Dimensões auditadas:** conformidade (RN-NOVO-F4-011, F1-002, F4-012, F4-003; AC -01 a -04; B1, B3, D18, D19); segurança (a regra que impede comunicação a quem não pode receber é, em si, controle de privacidade e de LGPD); teste de mesa sobre o código; performance (consultas por envio); bugs técnicos (janela de tempo, idempotência, concorrência); testes; observabilidade; regressão.

**Não auditado (e por quê):**
- IDOR, Auth Bypass, Mass Assignment: o delta não cria rota, ACL nem campo; as regras rodam como system dentro do Flow, sem entrada do usuário além do que a US-MOD-F4-010 já protege.
- Injeção, SSRF, segredo: valores entram só por `setValue`/`addQuery` com parâmetro; não há URL nem credencial.
- Encerramento na mesma transação da regularização (`reavaliar`) e escalonamento: F4-012.
- Execução do Flow de ponta a ponta com espera: fora do ATF (B9); o auditor não acessa a instância.

## 4. Conformidade

| Diretiva / decisão da spec / CA | Arquivo:linha | Status | Observação |
|---------------------------------|---------------|--------|------------|
| B3 `checarGuardas`: não ativa → `segue=false` sem regravar; com motivo → `encerrar` | `ReguaMotor.server.js:133-145` | ✅ PASS | |
| B3 `motivoParada`: régua inativa → `regua_pausada` | `ReguaMotor.server.js:157-160` | ✅ PASS | |
| B3: controle só com ciclo preenchido | `ReguaMotor.server.js:161-165` | ✅ PASS | Igual ao design (sem ciclo, a guarda não se aplica) |
| B3: Parcelamentos — `em_risco` segue; `em_dia`/`quitado` → regularizado; `rompido` → `parcelamento_rompido` | `ReguaMotor.server.js:166-177` | ✅ PASS | Inscrição de Parcelamentos sem parcelamento segue (o design não diz; ver BUG-001) |
| B3: outras carteiras — sem débito `aberto` do tributo → regularizado | `ReguaMotor.server.js:178-185` | ✅ PASS | Débito «parcelado» conta como regularizado, como a RN-NOVO-F1-002 pede |
| B3 `encerrar`: status, `encerrada_em`, motivo; comunicações «agendada» → «encerrada» | `ReguaMotor.server.js:192-206` | ✅ PASS | |
| B1: consentimento vigente = o mais recente por `registrado_em`, depois `sys_created_on`; sem registro, nem opt-in nem opt-out | `ReguaMotor.server.js:228-242` | ✅ PASS | |
| B1: só `canal_sim.forcar_falha` vale; `falhar` não é lido | `ReguaMotor.server.js:217-221,341` | ✅ PASS | |
| D18: `ORDEM_FALLBACK = ['sne','email','sms']`, `TETO_POR_JANELA = 1` como constantes; `regua.ordem_fallback` não é lido | `ReguaMotor.server.js:29-31` | ✅ PASS | |
| D19: teto = tentativas por contribuinte e canal nos últimos `segundos_por_dia` segundos | `ReguaMotor.server.js:245-255,332-335` | ✅ PASS | |
| RN-NOVO-F4-012: canal da etapa e fallback sem repetir; pula não contratado, sem opt-in, opt-out, teto | `ReguaMotor.server.js:303-335` | ✅ PASS | |
| RN-NOVO-F4-003: opt-out vigente impede o canal mesmo sem exigir opt-in | `ReguaMotor.server.js:328-331` | ✅ PASS | |
| B1: 1 `envio_sim` por tentativa real; canal pulado não gera `envio_sim` e vai para `comunicacao.motivo` | `ReguaMotor.server.js:336-351,360-361` | ✅ PASS | |
| B1: status final Entregue / Falha / Pulada; `tentativas` = nº de `envio_sim` | `ReguaMotor.server.js:353-358` | ✅ PASS | |
| B3: idempotência — comunicação da inscrição e etapa com status ≠ «agendada» devolve a existente; «agendada» é reaproveitada | `ReguaMotor.server.js:279-301` | ✅ PASS | |
| B3: a BR de comunicação em controle continua valendo | `ReguaMotor.server.js:298-300` | ✅ PASS | Recusa vira erro e o `catch` do Flow grava `erro` |
| Isenção g3 cita «execução de ponta a ponta na instância (auditorias/F4-011-execucao-demo.md)» | `outputs/spec/auditorias/_isencoes/US-MOD-F4-011-g3.md`, `US-MOD-F4-010-g3.md` | ⚠️ PARCIAL | O arquivo não existe no repositório (CONF-002). A fase F3 do design não exige essa execução para ficar verde; a evidência exigida (ATF F4-011 verdes) está no recibo |

**CA da US cumpridos?** Sim.
- **AC-RF-MOD-F4-011-01** (zero comunicações para controle, opt-out, sem opt-in, acima do teto ou regularizado) — cumprido. Controle e regularizado param na guarda e encerram a inscrição; opt-out, sem opt-in e teto pulam o canal sem gerar retorno de envio. Quando nenhum canal é possível, fica uma comunicação «Pulada» sem tentativa, como o design define em B1.
- **AC-RF-MOD-F4-011-02** (uma comunicação por etapa executada, com pelo menos um retorno de envio quando não pulada) — cumprido; ATF de envio e de idempotência.
- **AC-RF-MOD-F4-011-03** (a comunicação mostra o canal final e o motivo dos canais pulados) — cumprido; `canal` e `motivo` gravados (L355-361) e visíveis no form da comunicação (`ui/_form_comunicacao.now.ts`, US-MOD-F4-010).
- **AC-RF-MOD-F4-011-04** (regularizou, nenhuma etapa seguinte envia) — cumprido pela guarda antes de cada etapa; ATF «sem débito em aberto do tributo da carteira: regularizado».

**Tecnologia fora da spec sem aprovação?** Não.

## 5. Findings de Segurança

### 5.1 CRÍTICOS/ALTOS — bloqueantes

Nenhum.

### 5.2 MÉDIOS/BAIXOS

Nenhum finding de segurança. As regras desta US são, elas mesmas, controles de privacidade (não comunicar a quem pediu opt-out, a quem não deu opt-in e a quem está no grupo de controle) e estão cobertas por teste. O texto enviado não é montado aqui: o sigilo do texto é garantido na gravação da etapa (US-MOD-F4-010).

## 6. Testes de mesa (vetores no delta)

Rastreio do fluxo com os dados que o próprio ATF monta e com o seed demo (A com opt-in em tudo, B com opt-out de SMS).

| Vetor | Endpoint/dado real da US | Resultado | Evidência |
|-------|--------------------------|-----------|-----------|
| Comunicação a contribuinte do grupo de controle | Inscrição com ciclo e segmentação «controle» | ✅ BLOQUEADO | Guarda (L163-165) e, como segunda barreira, a BR de comunicação (L298-300); ATF «controle para e encerra; a comunicação agendada vira encerrada» |
| Comunicação com opt-out vigente | Contribuinte B, etapa de SMS | ✅ BLOQUEADO | L328-331; ATF «opt-out de SMS: sai por SNE, nenhum retorno de SMS» |
| Canal que exige opt-in sem opt-in | WhatsApp com `exige_opt_in` | ✅ BLOQUEADO | L324-327; ATF «WhatsApp sem opt-in: entregue por SNE» |
| Excesso de envio (teto) | Duas etapas em SNE dentro de 60 s | ✅ BLOQUEADO | L332-335; ATF de teto (pula SNE na segunda, volta a SNE depois de 61 s) |
| Comunicação depois de regularizar | Débito IPVA regularizado, outro tributo em aberto | ✅ BLOQUEADO | L178-185; ATF «sem débito em aberto do tributo da carteira» (o débito de ITCD em aberto não segura a régua IPVA) |
| Envio duplicado da mesma etapa (Flow reexecutado) | `enviar` duas vezes | ✅ BLOQUEADO | L279-287; ATF de idempotência |
| Race Condition | Duas inscrições do mesmo contribuinte em réguas diferentes enviando no mesmo canal no mesmo instante | ⚠️ BAIXO | `_tentativasNaJanela` conta e o insert vem depois (L332-344); dois Flows em paralelo podem passar os dois pelo teto (BUG-002) |
| Injeção | Canal, contribuinte, inscrição | ✅ BLOQUEADO | Só `addQuery`/`setValue` com parâmetro |
| IDOR / Auth Bypass / Privilege Escalation / Mass Assignment / Secret / Rate Limit | — | N/A | Sem rota, ACL ou campo novo; roda como system dentro do Flow (item 3) |

## 7. Findings de Performance

Nenhum finding. Por envio: 1 leitura da inscrição, 1 das etapas, 1 da comunicação, 1 da tabela de canais (4 linhas), 1 dos consentimentos do contribuinte e até 4 contagens de tentativas (uma por canal tentado). Volume pequeno por etapa e por contribuinte.

## 8. Findings de Bugs Técnicos

> **[BUG-001] Inscrição da régua Parcelamentos sem parcelamento nunca para por regularização — BAIXO** · JavaScript de servidor
> Arquivo: `app/src/server/regua/ReguaMotor.server.js:167-171`.
> **Cenário:** inscrição na régua de carteira «parcelamentos» com `parcelamento` vazio. `motivoParada` devolve vazio e a régua segue até o fim, sem olhar débito nem parcelamento.
> **Consequência:** hoje nenhum caminho cria essa inscrição (a carteira do débito nunca é «parcelamentos»; a inscrição de parcelamento é da F4-013 e grava o parcelamento). Só aconteceria por inscrição manual do admin.
> **Fix:** decidir na F4-013 se inscrição de Parcelamentos sem parcelamento é recusada na gravação ou para com motivo. Registrado em GAP-159.

> **[BUG-002] O teto por janela não é atômico entre Flows simultâneos — BAIXO** · JavaScript de servidor
> Arquivo: `app/src/server/regua/ReguaMotor.server.js:332-344`.
> **Cenário:** o mesmo contribuinte inscrito em duas réguas cujas etapas caem no mesmo segundo no mesmo canal. Cada Flow conta 0 tentativas e envia.
> **Consequência:** duas tentativas no canal dentro da janela (o teto é 1). Na demo, as réguas são escolhidas pela carteira do maior débito, uma por contribuinte por publicação; a chance é baixa.
> **Fix:** aceitar o risco na demo ou serializar por contribuinte (por exemplo, lote agendado do GAP-155, opção 2). Registrado em GAP-159.

Conferido sem achado: comparação de data na janela usa `GlideDateTime` em UTC (L246-251); `motivo` cabe nos 255 caracteres da coluna (4 canais no máximo); status «encerrada» da comunicação é devolvido sem reenviar (idempotência).

## 9. Testes

**CA viraram teste?** AC-01 sim (guardas negativo, envio, teto); AC-02 sim (envio, idempotência); AC-03 sim para canal final e motivo de canal sem opt-in, opt-out e teto; AC-04 sim (guarda de regularizado). **TDD RED/GREEN presente?** Sim: cada guarda tem o caso que para e o caso limpo que segue (`t_f4011_guardas_pos`, parcelamento em risco). **Cobertura do delta:** boa; dois ramos sem teste (TEST-001).

| Arquivo de teste | Cobre caminho feliz? | Cobre erro? | Avaliação |
|------------------|----------------------|-------------|-----------|
| `tests/US-MOD-F4-011.now.ts` `t_f4011_guardas_pos` | Sim | — | Bom |
| `t_f4011_guardas_neg` | — | Sim (controle, pausada, regularizado, quitado, rompido; em risco segue) | Bom |
| `t_f4011_guardas_encerrada` | — | Sim (não regrava) | Bom |
| `t_f4011_envio` | Sim | Sim (sem opt-in, falha forçada, tudo falha, opt-out) | Bom |
| `t_f4011_teto` | Sim | Sim | Bom; recua `recebido_em` em 61 s em vez de esperar |
| `t_f4011_idempotencia` | Sim | Sim | Bom |

> **[TEST-001] Dois ramos do envio sem teste — BAIXO**
> Arquivo: `ReguaMotor.server.js:320-323` (canal não contratado) e L353,361 (status «Pulada» com «Comunicação pulada: …»).
> Nenhum ATF monta canal com `contratado = false` nem o caso em que todos os canais são pulados. O design (B9) não pede esses casos, mas o AC-03 cita o motivo dos canais pulados e a RN-NOVO-F4-012 cita o canal não contratado e o status Pulada.
> **Fix:** acrescentar ao `t_f4011_envio` um contribuinte com opt-out em todos os canais (espera «pulada», 0 retornos, motivo iniciado por «Comunicação pulada:») e um canal não contratado. Registrado em GAP-159.

## 10. Observabilidade

| Operação nova da US | Logada? | Métrica/trace? | Finding OBS-NNN |
|---------------------|---------|----------------|-----------------|
| Guarda para a inscrição | Sim, `gs.info` com sys_id e motivo (L141) | Inscrição encerrada com `motivo_encerramento` | — |
| Envio não entregue (falha ou pulada) | Sim, `gs.warn` com sys_ids, etapa, status e motivo (L363-365) | Comunicação e retornos de envio no form da inscrição | — |
| Envio entregue | Sem log; o registro de comunicação e o retorno de envio são o rastro | Idem | — |
| PII nos logs | Só sys_id e nome de canal | — | — |

## 11. Regressão leve

| Ponto vizinho | Impacto detectado? | Evidência |
|---------------|--------------------|-----------|
| `QualificacaoCiclo.emControle` | Não; chamado só com ciclo, como o design pede | L163 |
| BR de comunicação em controle | Não; continua valendo e é a segunda barreira | L298-300 |
| Seed demo de canal e consentimento | Não; o ATF monta a própria massa e o seed traz os 4 canais | `seed-demo/canal_sim.now.ts`, `consentimento.now.ts` |
| Campos antigos (`falhar`, `ordem_fallback`) | Não lidos, como o design manda | busca no `ReguaMotor.server.js` |
| Contrato das custom actions | Não mudou; o ATF de fumaça da F4-010 (verde no mesmo HEAD) chama guardas e envio pelo contrato | `tests/US-MOD-F4-010.now.ts` «guardas e envio respondem pelo contrato» |

## 12. Veredito

**Resultado:** ⚠️ APROVADA COM RESSALVAS

| Condição de bloqueio | Status |
|----------------------|--------|
| Sem SEC CRÍTICO/ALTO aberto | ✅ |
| Sem BUG ALTO bloqueante | ✅ |
| Todos os CA da US cumpridos | ✅ |
| Nenhuma tecnologia fora da spec sem aprovação | ✅ |
| Todo SEC CRÍTICO/ALTO com GAP registrado | ✅ (não há) |

Os achados são BAIXO (BUG-001, BUG-002, TEST-001, CONF-002), registrados em GAP-159.

> **Depois da auditoria (implementador, 25/11):** CONF-002 resolvido — `outputs/spec/auditorias/F4-011-execucao-demo.md` foi gravado com a execução de ponta a ponta (régua IPVA, COMPLETE em 35 min 16 s). O commit f916cd1 só mudou o ATF de envio para conferir os dois retornos sem depender da ordem de leitura (a suíte final acusou ordem trocada em registros do mesmo segundo); a regra não mudou.

## 13. Pontos a revisar / próximos passos

| # | Finding (ID) | Arquivo:linha | O que corrigir | Onde registrar |
|---|--------------|---------------|----------------|----------------|
| 1 | TEST-001 | `tests/US-MOD-F4-011.now.ts` (`t_f4011_envio`) | Casos «todos os canais pulados» e «canal não contratado» | `outputs/spec/gaps-document.md` (GAP-159) |
| 2 | BUG-001 | `ReguaMotor.server.js:167-171` | Decidir o que acontece com inscrição de Parcelamentos sem parcelamento (F4-013) | GAP-159 |
| 3 | BUG-002 | `ReguaMotor.server.js:332-344` | Aceitar na demo ou serializar o envio por contribuinte | GAP-159 |
| 4 | CONF-002 | `_isencoes/US-MOD-F4-010-g3.md`, `US-MOD-F4-011-g3.md` | Criar `outputs/spec/auditorias/F4-011-execucao-demo.md` com a execução de ponta a ponta ou tirar a referência das duas isenções | GAP-159 |

---

<!-- gate:status -->
veredito: APROVADA COM RESSALVAS
commits-auditados: speckit-servicenow@7c9e4dd
achados-bloqueantes: nenhum
<!-- /gate:status -->

> Bloco lido pelo `delivery-gate` (hook PreToolUse) para liberar ou bloquear a integração da US.
> `commits-auditados` traz **um commit por repositório** da US: o gate, ao ver o push de um repo,
> exige que a entrada **daquele repo** esteja entre os commits do push. Em workspace mono-repo a
> forma escalar `commit-auditado: <sha>` continua aceita.
> `achados-bloqueantes` lista os IDs que sustentam um veredito BLOQUEADA; em APROVADA/COM RESSALVAS use `nenhum`.
