# Cobrança MT v2: ações à vista e régua como Flow

*   **Author:** arthurleardini (rascunho do agente em 25/11/2026; v2.1 no mesmo dia)
*   **Status:** Approved (v2.2: ajustes da F0 aplicados, ver `docs/designs/review-ux/f0-spike-resultados.md`)
*   **Date:** 2026-11-25
*   **Base:** `docs/designs/ux-cobranca-v1.md` (inclusive a seção v1.1, que continua valendo)
*   **Revisão aplicada:** `docs/designs/review-ux/regua-flow_review_report.md` (8🔴, 24🟡, 12🟢), com as decisões do dono do produto de 25/11 (P1, P2, P3). Mapa em [Resolução da revisão](#resolução-da-revisão).
*   **Insumos:**
    *   `docs/ux-cobranca/01-teoria-cobranca-para-ux.md` (régua escalonada, encerra ao regularizar, aceite por canal, teto)
    *   `docs/ux-cobranca/02-personas-jornadas-licoes.md` (J4, L5, L7, L17, L23, implicação 7 e 13)
    *   `outputs/spec/requirements/requirements.md` (RF-MOD-F4-001 a 009) e `outputs/spec/business-rules.md` (RN-NOVO-F4-001 a 008, RN-NOVO-F1-002, RN-NOVO-F2-005)
    *   SDK 4.14.3 (`app/node_modules/@servicenow/sdk/docs/` do repositório principal): `api/flow/custom-action-api.md`, `api/flow/wfa-flow-logic-api.md`, `guides/wfa-flow-stages-guide.md`, `guides/ui-action-guide.md`, `guides/list-control-guide.md`, `guides/atf-guide.md`

--------------------------------------------------------------------------------

## Overview

Duas mudanças pedidas pelo dono do produto.

1. **As ações de negócio aparecem onde a pessoa já está.** Hoje elas só existem no cabeçalho do form aberto. Passam a aparecer também na lista (menu de contexto da linha e "Ações nas linhas selecionadas"), com uma coluna "O que fazer agora" em contato, caso e ciclo. O Update sai do form de contato (sempre) e do ciclo (fora da prévia). O New sai das listas de contato, régua e etapa para quem não é admin.
2. **Cada régua de cobrança é um Flow do Flow Designer.** O Flow começa quando um contribuinte é inscrito na régua, espera o prazo de cada etapa, confere guardas (regularização, grupo de controle, régua pausada), envia pelo canal simulado respeitando opt-in, opt-out, teto e fallback e, depois da última etapa e do prazo de resposta, encaminha à cobrança ativa ou à qualificada.

Continua tudo na Core UI clássica, no escopo `x_2326104_cob`.

## The Problem

### A. Descoberta das ações

Fatos verificados no código (`app/src/fluent/`):

| Fato | Onde | Efeito |
|---|---|---|
| As 8 UI Actions de negócio têm só `form: { showButton: true }`, sem `list` | `ui-actions/contato.now.ts`, `caso.now.ts`, `ciclo.now.ts`, `criterio.now.ts` | Na lista, nenhuma ação aparece |
| "Minha lista" filtra `atendente=javascript:gs.getUserID()` e o separador dela só tem o papel atendente | `navigation/menu.now.ts:14-23` | Coordenador e admin não têm lista da equipe; "Distribuição da lista" foi cortado na v1.1 |
| O admin de sistema vê Update, Delete e os verbos juntos no cabeçalho | ACLs de `contato` e `ciclo` | "Registrar ligação" compete com Update |
| Nenhuma lista diz qual é o próximo passo | `ui/TEL-034.now.ts`, `TEL-023.now.ts`; o ciclo usa a lista padrão `TEL-029` (colunas de efeito incremental) | O verbo que move o estado não aparece |

### B. Régua

| Fato | Onde |
|---|---|
| A régua é só cadastro: `regua` e `regua_etapa` não têm lógica, BR, flow nem job | `tables/regua*.now.ts` |
| Disparo, escalonamento, fallback, opt-in, encerramento por regularização e encaminhamento (RF-MOD-F4-002 a 006 e 009) não têm implementação | idem |
| O seed de régua é aleatório (51 réguas, 50 etapas, 50 canais) e `comunicacao`, `envio_sim` e `consentimento` apontam para ele | `seed/regua.now.ts`, `seed/regua_etapa.now.ts`, `seed/canal_sim.now.ts`, `seed/comunicacao.now.ts`, `seed/envio_sim.now.ts`, `seed/consentimento.now.ts` |
| O coordenador só tem `read` em `regua` e `regua_etapa` | `security/acl-base.now.ts:177-209` |
| Não existe registro que diga "este contribuinte está na etapa N desta régua" | `data-model.json` |

## Goals

*   **G1. Toda ação de negócio é alcançável a partir da lista em no máximo 2 cliques** (botão direito na linha → item, ou marcar linhas → "Ações nas linhas selecionadas" → item), para atendente e coordenador.
*   **G2. No form de contato e de ciclo, a persona de negócio vê só os verbos do estado atual**: sem Update (exceto ciclo em prévia, onde o coordenador edita nome, referência e critério), sem Delete; no máximo 3 botões no cabeçalho. O caso mantém o Update (o coordenador edita campos do caso).
*   **G3. "O que fazer agora" preenchido em 100% dos registros de contato, caso e ciclo**, como coluna na lista; no form do contato, também como aviso no topo.
*   **G4. O coordenador e o admin de sistema abrem "Lista da equipe" e veem todos os contatos abertos** (no seed: pelo menos 20), agrupados por atendente.
*   **G5. Uma régua = um Flow.** As 5 réguas do seed têm, cada uma, um Flow ativo chamado "Régua: <nome>", com um stage por etapa e um stage "Encaminhamento".
*   **G6. A demo anda em minutos.** Com `x_2326104_cob.regua.segundos_por_dia = 60`, a régua IPVA (dias 0, 10, 20, 30, prazo final 5) encaminha em no máximo 40 minutos e deixa exatamente 1 comunicação por etapa executada e pelo menos 1 retorno de envio por comunicação com status diferente de "Pulada".
*   **G7. As guardas valem sempre**: 0 comunicações para contribuinte em grupo de controle, com opt-out no canal, sem opt-in em canal que exige, acima do teto, ou já regularizado (ATF positivo e negativo por guarda).
*   **G8. Regularizou, a régua para**: quando o débito da carteira da régua vira regularizado ou parcelado (ou o parcelamento sai de "em risco"), a inscrição fica "Encerrada" na mesma transação e nenhuma etapa seguinte envia.

## Non-Goals

*   Editor visual de régua próprio, UI Page, GlideModal, Workspace e UI Builder.
*   Etapa preventiva (D−5, D−2 do vencimento). D0 = inscrição.
*   A/B de régua, versões de régua e comparação (RN-52). Sem campos de versão.
*   Canal real. Envio continua em `canal_sim` e `envio_sim`.
*   Origem da regularização (RF-MOD-F4-007) e efetividade (RF-MOD-F4-008): ficam como estão.
*   **Encerrar contatos abertos na regularização (RN-09)**: fora da v2, registrado como GAP em `outputs/spec/gaps-document.md`.
*   Ação em massa para "Registrar ligação" e "Encerrar": pedem anotação ou motivo, que não cabem numa ação de lista sem modal.
*   Form do contato em seções novas: o `sn-scaffold` gera uma seção por tela e o gerador é zona imutável. A v2 só reordena os campos.
*   Um Flow genérico que lê as etapas e serve a todas as réguas (descartado pelo dono).
*   Cancelar o contexto do Flow ao encerrar a inscrição: o contexto acorda, vê a inscrição encerrada e termina sem enviar.

## Decisões

| # | Decisão | Por quê | Alternativa descartada |
|---|---|---|---|
| D1 | **Verbos na lista por UI Actions próprias de lista** (actionName próprio, separadas das de form). As de servidor (Avançar etapa, Publicar ciclo, Distribuir lista, Publicar versão, Criar nova versão, Ativar, Pausar) executam o mesmo método sem redirecionar. As que pedem dado (Registrar ligação, Encerrar, Encerrar caso) viram itens de menu de contexto "…" que só redirecionam ao form | As de form de contato e caso são `isClient` com `g_form` e não rodam na lista; UI Action não recebe parâmetro nem troca seção | Pôr o bloco `list` nas actions de form (quebra as `isClient` e mistura redirecionamento de form com execução em lote) |
| D2 | **Esconder Update por override** de `sysverb_update`: em contato, só admin; em ciclo, coordenador vê só na prévia. Delete não aparece para as personas (não há ACL de delete). **New** some por `sys_ui_list_control.new_roles` em contato, régua e etapa (lista e related list). Inscrição e comunicação já não têm ACL de create para as personas | Override por `actionName` é o padrão documentado (`ui-action-guide` §Table Inheritance and Overrides). Em ciclo, o coordenador grava nome, referência e critério na prévia (`security/ciclo.now.ts:8-24`) | Client script escondendo botão |
| D3 | **"O que fazer agora"** (`proxima_acao`, string 120, só leitura) em contato, caso e ciclo, gravado por BR before insert/update a partir do estado (`ProximaAcao`). Aviso `gs.addInfoMessage` só no form do contato | Uma regra, uma coluna ordenável; aviso onde há verbo com dado a preencher | Coluna também em critério e inscrição (repete status) |
| D4 | **"Lista da equipe" em separador próprio "Equipe"** (coordenador, admin): `contato`, `status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em` | O separador "Minha lista" é só do atendente; `GROUPBY` é o que agrupa (v1, l.105) | Abrir o separador "Minha lista" ao coordenador (mistura a lista pessoal com a da equipe) |
| D5 | **Limite de módulos do coordenador sobe de 12 para 14** (v1 l.35 e l.206 revogados nesse ponto): entram "Lista da equipe" e "Inscrições". Listas seguem com até 6 colunas: entra `proxima_acao` e sai uma coluna por lista (A3) | As duas entradas são pedidas pelos Goals; não há módulo atual que possa sair sem perda | Inscrições só como related list da régua (o coordenador perderia a visão de todas as réguas e das inscrições com erro) |
| D6 | **Inscrição na régua como tabela própria** (`regua_inscricao`): contribuinte × régua × ciclo, com status, etapa atual e próxima etapa em. O Flow de cada régua dispara na criação da inscrição | Execução própria do Flow por contribuinte, com histórico | Trigger em `debito`; trigger agendado varrendo a carteira |
| D7 | **A inscrição nasce por BR after update de `ciclo`** (`previous.estado == 'previa' && current.estado == 'publicado'`), por qualquer caminho de publicação: para cada contribuinte da massificada, na régua ativa da carteira do maior débito em aberto. Parcelamento que vira "em risco" inscreve na régua Parcelamentos (P3) | O controle é gravado no before (`prepararPublicacao`); a BR after vê o segmento final. L17, RN-NOVO-F4-002 | Chamar em `publicar()` (pula form, lista e API) |
| D8 | **Flows gerados por script** (`app/scripts/gerar-flows-regua.mjs`) a partir de `outputs/spec/reguas.json`. O mesmo script gera o seed de `regua` e `regua_etapa` | Régua e Flow não divergem no número de etapas. Arquivo separado do `data-model.json` para não depender de como `spec-data-model`, `sn-scaffold` e `sn-seed` tratam chave desconhecida | Seção `reguas` dentro do `data-model.json` |
| D9 | **O Flow passa só inscrição e ordem; o `ReguaMotor` lê a etapa** (dia, canal, texto, postura, ação sem resposta) em tempo de execução. Número de etapas e ordem são fixos no Flow | O coordenador muda prazo, canal e texto no form sem regerar | Valores embutidos no Flow; `lookUpRecord` no Flow (duplica a leitura que o motor já faz) |
| D10 | **Lógica no Script Include `ReguaMotor`**, chamado por 4 custom actions com `actionStep.script` (contrato em B3). As 4 actions nascem na F2, junto com os Flows | Flow legível no Designer; regra testável por ATF de servidor; F2 compila | Tudo num passo de script; tudo em ações nativas |
| D11 | **Espera configurável sem mudar o Flow**: "Agendar etapa" devolve `executar_em = iniciada_em + dia × segundos_por_dia` e o Flow espera com `waitForADuration` relativo, `duration` 1 s (`Duration({ seconds: 1 })`, valor conferido na F0), `relativeDatetime: wfa.dataPill(...)` (pill direto). `executar_em` sai do script como objeto `GlideDateTime` (com `getValue()` em UTC a espera atrasa pelo fuso da sessão; F0 ponto 1). Propriedade `x_2326104_cob.regua.segundos_por_dia` (60 neste app de demo; 86400 em produção) | `Duration()` é literal; só o relativo aceita data vinda de pill | Duração explícita por etapa |
| D12 | **Execução visível em dois lugares**: no app, o form da inscrição (comunicações e retornos de envio como related lists); no Flow Designer, os detalhes da execução com o stage tracker. Form da régua com "Ver execuções" e "Abrir no Flow Designer" | O stage tracker só aparece no Flow Designer, Workspace e Portal | Só Flow Designer |
| D13 | **Escalonamento só no fecho do Flow**: etapas 1..N−1 têm `renotificar` ou `intensificar` (seguem para a próxima); a etapa N tem `encaminhar_ativa` ou `encaminhar_qualificada`. Depois da etapa N, o Flow espera `regua.prazo_final_dias`, confere guardas e escalona | Dá janela de resposta antes de escalonar e um só caminho de escalonamento | Escalonar logo após o envio (sem janela) |
| D14 | **P1 (dono): ambos.** O contribuinte da massificada entra na lista do atendente na distribuição do ciclo ("Distribuir lista" continua igual) **e** quando a régua encaminha à cobrança ativa. "Escalonar" chama `QualificacaoCiclo.atribuirContato` (helper extraído, sem checagem de papel), com dedupe por contribuinte + ciclo: se já há contato aberto, não cria; grava `contato.inscricao` e antecipa `proxima_acao_em` para agora. `contato.origem` (distribuicao, regua) diz por onde o contato nasceu | Decisão do dono | (b) só na régua |
| D15 | **P2 (dono): ambos.** O coordenador edita parâmetros das etapas no form (dia, canal, texto, postura, ação sem resposta) **e** pode editar o Flow no Flow Designer. Mantêm-se `regua.flow`, "Abrir no Flow Designer" e o papel de Flow Designer para o coordenador (mecanismo escolhido na F0, B6). Edição feita no Designer é sobrescrita no próximo `npm run reinstall`, a menos que seja trazida à fonte por `now-sdk transform` (fluxo em B6) | Decisão do dono | (a) só form |
| D16 | **P3 (dono): sim.** Régua Parcelamentos com gatilho em `parcelamento.status` virando `em_risco`. A guarda é por carteira: na régua Parcelamentos olha o parcelamento da inscrição, não o débito | Decisão do dono; resolve o conflito com "débito parcelado encerra" | Régua inativa no seed |
| D17 | **Postura e sigilo na etapa**: `regua_etapa.postura` (utilitaria, consciente, explicativa, ameacadora). BR before insert/update da etapa recusa: postura que regride ou salta nível em relação à etapa anterior; dia fora de ordem; ação de encaminhar fora da última etapa ou última etapa sem ela; `R$`, `{valor}`, `{debito}` ou `{tributo}` no texto de e-mail, SMS e WhatsApp. O gerador repete as mesmas validações | 01: sequência obrigatória (RN-13/17); L23: canal informal só de ciência. Validar só no gerador deixaria o form gravar estrutura inválida | Checar no envio |
| D18 | **Constantes no `ReguaMotor`**: `TETO_POR_JANELA = 1` (RN-38) e `ORDEM_FALLBACK = ['sne','email','sms']` (RN-NOVO-F4-004). Só `segundos_por_dia` é propriedade. O campo existente `regua.ordem_fallback` deixa de ser lido e sai de lista e form (a coluna fica, para não gerar DELETE) | Uma fonte por valor | Propriedades `teto_dia_canal` e `ordem_fallback` |
| D19 | **Teto por janela**: no máximo `TETO_POR_JANELA` tentativas de envio por contribuinte e canal dentro dos últimos `segundos_por_dia` segundos (24 h corridas em produção, 60 s na demo) | Com dia de calendário, a demo de 40 minutos cai num dia só e a etapa 4 bate no teto da etapa 1 | Desligar o teto em modo demo (G7 deixaria de ser testável na demo) |
| D20 | **"Admin" nesta spec é o admin de sistema.** O papel `x_2326104_cob.admin` não herda o coordenador; ele vê "Lista da equipe" (módulo e linhas, por `CarteiraAtendente.veTudo`), mas não os verbos do coordenador | `role_admin` não tem `containsRoles`; mudar isso muda a v1 | `containsRoles: [role_coordenador]` no admin |

## Critical User Journeys

### CUJ-1: Atendente acha a ação na lista (G1, G3)
*   **Given**: `demo.atendente` em "Minha lista", com contatos "A ligar".
*   **When**: lê a coluna "O que fazer agora" ("Ligar e registrar o resultado") e clica com o botão direito na primeira linha.
*   **Then**: o menu mostra "Registrar ligação…" e "Encerrar…". Ao escolher, o form do contato abre com o aviso "Próximo passo: Ligar e registrar o resultado" e `Resultado desta ligação`, `Próxima ação em` e `Motivo de encerramento` no topo da coluna esquerda. O cabeçalho tem só "Registrar ligação" (primário) e "Encerrar". Não há Update.

### CUJ-2: Coordenador publica e distribui pela lista (G1, P1)
*   **Given**: `demo.coordenador` em "Ciclo do mês", com o "Ciclo 2026-12" em prévia.
*   **When**: marca o ciclo e abre "Ações nas linhas selecionadas".
*   **Then**: vê "Publicar ciclo". Ao publicar, a coluna "O que fazer agora" passa a "Distribuir lista" e as inscrições nas réguas nascem para a massificada (D7). Em seguida, "Distribuir lista" pela mesma via cria os contatos da massificada, como na v1 (UX-004), com `origem = distribuicao`. O mesmo vale para "Avançar etapa" em vários casos de uma vez.

### CUJ-3: Admin não cai em lista vazia (G4)
*   **Given**: o admin de sistema, sem contatos próprios.
*   **When**: abre "Equipe > Lista da equipe".
*   **Then**: vê todos os contatos abertos agrupados por atendente.

### CUJ-4: Régua anda sozinha na demo (G5, G6, G7)
*   **Given**: `segundos_por_dia = 60`; régua IPVA ativa (dia 0 SNE utilitária; dia 10 e-mail consciente; dia 20 SMS explicativa; dia 30 SNE ameaçadora com `encaminhar_ativa`; prazo final 5 dias); no "Ciclo 2026-12", os contribuintes de demo A (opt-in em tudo) e B (opt-out de SMS), ambos com débito de IPVA em aberto e massificada (`outputs/spec/demo/roteiro.md` diz quem são).
*   **When**: o coordenador publica o ciclo.
*   **Then**:
    *   nascem inscrições para a massificada com débito em aberto; quem foi sorteado para o controle não tem inscrição;
    *   no minuto 0–1, A e B recebem a comunicação da etapa 1 (SNE, "Entregue", 1 retorno de envio);
    *   no minuto 20, A recebe o SMS; para B, a comunicação da etapa 3 sai com `canal = sne`, status "Entregue" e motivo "SMS: opt-out", porque a ordem de tentativa é SMS → SNE → e-mail (D19 não barra: o último SNE de B foi no minuto 0);
    *   no minuto 30, etapa 4 (SNE) para os dois;
    *   no minuto 35, o Flow passa pelas guardas e escalona: se o ciclo já foi distribuído, o contato existente de A e de B ganha `inscricao` e `proxima_acao_em = agora` e aparece em "Minha lista" do atendente; se não foi, nasce contato com `origem = regua`. As inscrições ficam "Encerrada" com motivo "Encaminhada à cobrança ativa".

### CUJ-5: Regularizou, parou (G8)
*   **Given**: inscrição de A na régua IPVA, esperando a etapa 3.
*   **When**: o admin muda o débito de IPVA de A para "Regularizado" (form do débito).
*   **Then**: a BR after do débito chama `ReguaMotor.reavaliar(A)` e a inscrição fica "Encerrada (regularizado)" na hora. Quando a espera termina, "Agendar etapa" devolve `segue = false` e o Flow termina sem enviar. No Flow Designer, o stage "Etapa 3" aparece como concluído e sem passo de envio executado.

### CUJ-6: Coordenador acompanha e ajusta a régua (G5, P2)
*   **Given**: régua IPVA com execuções em andamento.
*   **When**: abre a régua em "Réguas".
*   **Then**: vê as etapas (related list ordenada por ordem), as inscrições e as comunicações. Muda o texto da etapa 2 e salva; as inscrições que ainda não passaram da etapa 2 usam o texto novo (D9). Tenta mudar o texto da etapa 3 para "Pague R$ 500" com canal SMS: a gravação é recusada (D17). "Ver execuções" abre a lista de execuções do Flow "Régua: IPVA". "Abrir no Flow Designer" abre o Flow para leitura e edição (D15).

### CUJ-7: Parcelamento em risco entra na régua (P3)
*   **Given**: contribuinte D com parcelamento "Em dia" e régua Parcelamentos ativa.
*   **When**: o parcelamento passa a "Em risco".
*   **Then**: nasce inscrição de D na régua Parcelamentos, com `parcelamento` preenchido e `ciclo` = último ciclo publicado (ou vazio se não há). Se depois o parcelamento volta a "Em dia" ou vira "Quitado", a inscrição encerra como "regularizado"; se vira "Rompido", encerra como "parcelamento rompido".

## Technical Plan

### A. Descoberta das ações

#### A1. UI Actions

Form (existentes; só ganham `order` e, quando indicado, mudam):

| `$id` | name | actionName | Tabela | Superfície | condition | roles | order | Script |
|---|---|---|---|---|---|---|---|---|
| `RF-MOD-UX-002_ua_registrar_ligacao` | Registrar ligação | `x_cob_registrar_ligacao` | contato | botão primário | existente | atendente, coordenador | 100 | existente |
| `RF-MOD-UX-003_ua_encerrar_contato` | Encerrar | `x_cob_encerrar_contato` | contato | botão | existente | atendente, coordenador | 200 | existente |
| `RF-MOD-UX-005_ua_avancar_etapa` | Avançar etapa | `x_cob_avancar_etapa` | caso | botão primário | existente | coordenador | 100 | existente |
| `RF-MOD-UX-005_ua_encerrar_caso` | Encerrar caso | `x_cob_encerrar_caso` | caso | botão | existente | coordenador | 200 | existente |
| `RF-MOD-F2-004_ua_publicar_ciclo` | Publicar ciclo | `x_cob_publicar_ciclo` | ciclo | botão primário | existente | coordenador | 100 | existente |
| `RF-MOD-UX-004_ua_distribuir_lista` | Distribuir lista | `x_cob_distribuir_lista` | ciclo | botão primário | existente | coordenador | 100 | existente |
| `RF-MOD-F2-002_ua_publicar_versao` | Publicar versão | `x_cob_publicar_versao` | critério | botão primário | existente | coordenador | 100 | existente |
| `RF-MOD-F2-002_ua_criar_nova_versao` | Criar nova versão | `x_cob_criar_nova_versao` | critério | botão | existente | coordenador | 200 | existente |
| `UX-009_ua_update_contato` | Update | `sysverb_update` | contato | botão | — | admin | 900 | `current.update(); action.setRedirectURL(current);` |
| `UX-009_ua_update_ciclo` | Update | `sysverb_update` | ciclo | botão | `current.estado == 'previa' \|\| gs.hasRole('x_2326104_cob.admin')` | coordenador, admin | 900 | idem |
| `F4-010_ua_pausar_regua` | Pausar | `x_cob_pausar_regua` | régua | botão | `current.ativa == true` | coordenador | 100 | `new ReguaMotor().pausar(current)`; mensagem; `action.setRedirectURL(current)` |
| `F4-010_ua_ativar_regua` | Ativar | `x_cob_ativar_regua` | régua | botão primário | `current.ativa == false` | coordenador | 100 | `new ReguaMotor().ativar(current)`; idem |
| `F4-014_ua_ver_execucoes` | Ver execuções | `x_cob_ver_execucoes` | régua | link | `!current.isNewRecord()` | coordenador | 300 | redireciona a `sys_flow_context_list.do?sysparm_query=name=Régua: <nome>` (URL codificada) |
| `F4-014_ua_abrir_designer` | Abrir no Flow Designer | `x_cob_abrir_designer` | régua | link | `!current.flow.nil()` | coordenador | 310 | redireciona a `/$flow-designer.do#/flow-designer/<regua.flow>` |
| `F4-014_ua_ver_execucao` | Ver execução | `x_cob_ver_execucao` | inscrição | link | `!current.isNewRecord()` | coordenador | 300 | procura `sys_flow_context` com `source_record` = inscrição; abre `/$flow-designer.do#/operations/context/<sys_id>`; sem contexto, mensagem "Execução não encontrada" |
| `F4-016_ua_reenviar` (opcional) | Reenviar | `x_cob_reenviar` | comunicação | botão | `current.status == 'falha'` | coordenador | 100 | `new ReguaMotor().reenviar(current)` |

Lista (novas; uma por ação, `form` ausente, `showInsert: false`, `showUpdate: true` — sem `showUpdate: true` a action não aparece no menu da lista, F0 ponto 7):

| `$id` | name | actionName | Tabela | `list` | condition | roles | order | Script |
|---|---|---|---|---|---|---|---|---|
| `UX-009_ual_registrar_ligacao` | Registrar ligação… | `x_cob_l_registrar_ligacao` | contato | `showContextMenu` | `current.status != 'encerrado'` | atendente, coordenador | 100 | `action.setRedirectURL(current);` |
| `UX-009_ual_encerrar_contato` | Encerrar… | `x_cob_l_encerrar_contato` | contato | `showContextMenu` | idem | atendente, coordenador | 200 | idem |
| `UX-009_ual_avancar_etapa` | Avançar etapa | `x_cob_l_avancar_etapa` | caso | `showContextMenu`, `showListChoice` | igual à de form | coordenador | 100 | `CasoConducao().avancarEtapa(current)`; mensagem; sem redirect |
| `UX-009_ual_encerrar_caso` | Encerrar caso… | `x_cob_l_encerrar_caso` | caso | `showContextMenu` | igual à de form | coordenador | 200 | `action.setRedirectURL(current);` |
| `UX-009_ual_publicar_ciclo` | Publicar ciclo | `x_cob_l_publicar_ciclo` | ciclo | `showContextMenu`, `showListChoice` | igual à de form | coordenador | 100 | `QualificacaoCiclo().publicar(current)`; mensagem; sem redirect |
| `UX-009_ual_distribuir_lista` | Distribuir lista | `x_cob_l_distribuir_lista` | ciclo | `showContextMenu`, `showListChoice` | igual à de form | coordenador | 110 | `QualificacaoCiclo().distribuir(current)`; idem |
| `UX-009_ual_publicar_versao` | Publicar versão | `x_cob_l_publicar_versao` | critério | `showContextMenu` | igual à de form | coordenador | 100 | `CriterioVersao().publicar(current)`; idem |
| `UX-009_ual_criar_nova_versao` | Criar nova versão… | `x_cob_l_criar_nova_versao` | critério | `showContextMenu` | igual à de form | coordenador | 200 | `action.setRedirectURL(current);` (cria a versão pelo form) |
| `F4-010_ual_pausar_regua` | Pausar | `x_cob_l_pausar_regua` | régua | `showContextMenu`, `showListChoice` | `current.ativa == true` | coordenador | 100 | `ReguaMotor().pausar(current)` |
| `F4-010_ual_ativar_regua` | Ativar | `x_cob_l_ativar_regua` | régua | `showContextMenu`, `showListChoice` | `current.ativa == false` | coordenador | 110 | `ReguaMotor().ativar(current)` |
| `F4-016_ual_reenviar` (opcional) | Reenviar | `x_cob_l_reenviar` | comunicação | `showContextMenu`, `showListChoice` | `current.status == 'falha'` | coordenador | 100 | `ReguaMotor().reenviar(current)` |

Notas:
*   As de lista que redirecionam abrem o form; o verbo é executado lá. "Registrar ligação…" e "Encerrar…" abrem o mesmo form.
*   `showListChoice` vira `sys_ui_action.list_choice`, o menu "Ações nas linhas selecionadas" do UI16; a doc do SDK o descreve como "dropdown de campos choice". Confirmado na F0 (ponto 7), com `showUpdate: true`.
*   Os métodos chamados já reconferem papel e estado no servidor (`QualificacaoCiclo._ehCoordenador`, `CasoConducao`, `CriterioVersao`).
*   Pausar grava `ativa = false`; a BR after update da régua (B4) encerra as inscrições ativas com `regua_pausada`. Ativar grava `ativa = true` e não retoma as encerradas; novas inscrições nascem na próxima publicação ou no próximo parcelamento em risco.

#### A2. Update, Delete e New

| Botão | Tabela | Como | Quem vê |
|---|---|---|---|
| Update | contato | override `UX-009_ua_update_contato` | admin |
| Update | ciclo | override `UX-009_ua_update_ciclo` | coordenador na prévia; admin sempre |
| Update | caso, critério, régua, etapa | sem mudança | coordenador, admin |
| Delete | todas | sem mudança: não há ACL de delete para as personas | admin de sistema |
| New | contato, régua, etapa | `Record({ table: 'sys_ui_list_control', data: { name, new_roles: ['x_2326104_cob.admin'] } })` (array de string; string não compila e `[role_admin]` serializa "[object Object]", F0 ponto 8); para a etapa, mais um com `related_list: 'x_2326104_cob_regua_etapa.regua'` | admin |
| New | inscrição, comunicação | sem list control: não há ACL de create para as personas | admin de sistema |
| New | ciclo, critério | sem mudança | coordenador, admin |

#### A3. "O que fazer agora" e listas

`ProximaAcao.texto(gr)` (`app/src/server/contato/ProximaAcao.server.js`), textos por `gs.getMessage`:

| Tabela | Estado | Texto |
|---|---|---|
| contato | a_ligar | "Ligar e registrar o resultado" |
| contato | retornar | "Retornar a ligação em <proxima_acao_em>" ("Retornar a ligação" se vazio) |
| contato | ligado | "Conferir pagamento combinado em <proxima_acao_em>" ("Conferir pagamento combinado" se vazio) |
| contato | encerrado | "Nada a fazer (encerrado)" |
| caso | em_selecao / selecionado / dossie_gerado | "Avançar etapa: Caso selecionado" / "…: Dossiê gerado" / "…: Condução" |
| caso | conducao | "Conduzir e encerrar com motivo" |
| caso | encerrado | "Nada a fazer (encerrado)" |
| ciclo | previa | "Publicar ciclo" |
| ciclo | publicado, `distribuido_em` vazio | "Distribuir lista" |
| ciclo | publicado, distribuído | "Acompanhar a lista" |
| ciclo | encerrado | "Nada a fazer (encerrado)" |

Os textos não envelhecem: a data é a da próxima ação gravada, não "hoje".

*   BR before insert/update em contato, caso e ciclo grava `proxima_acao` (todas as gravações; custo de uma atribuição). `proxima_acao` não está em `CriterioVersao.CAMPOS_CICLO_PROTEGIDOS`, então gravar em ciclo publicado passa.
*   BR `display` só no contato: `gs.addInfoMessage(gs.getMessage('Próximo passo: {0}', texto))` quando `status != encerrado`.
*   **Aberto** por tabela: contato `status!=encerrado`; caso `estagio!=encerrado`; ciclo `estado!=encerrado`. G3 vale para todos os registros (abertos e encerrados).
*   **Backfill:** `gerar-seed-demo.mjs` grava `proxima_acao` nos seeds de ciclo, contato e caso com a mesma tabela (portada para o script). Não há fix script.

Listas (até 6 colunas):

| Tela | Lista | Colunas | Sai |
|---|---|---|---|
| TEL-034 | contato (padrão) | contribuinte, proxima_acao, contribuinte.telefone, valor_em_aberto, proxima_acao_em, prioridade | status |
| TEL-023 | caso (view `tel_023`) | contribuinte, proxima_acao, estagio, prioridade, valor_em_aberto, sinal_coercitivo | ciclo |
| TEL-036 (nova) | ciclo (view `tel_036`, usada por "Ciclo do mês") | nome, proxima_acao, referencia, estado, qtd_massificada, qtd_contatos | — (a lista padrão do ciclo é TEL-029, de efeito incremental, e fica como está) |
| TEL-013 | régua | nome, codigo, carteira, ativa, prazo_final_dias | janela_atribuicao_dias, ordem_fallback |
| TEL-037 (nova) | inscrição (padrão) | contribuinte, regua, status, etapa_atual, proxima_etapa_em, motivo_encerramento | — |

#### A4. Módulos

| Separador | Módulo | Tipo | Destino | Papéis |
|---|---|---|---|---|
| Equipe (novo, order 150) | Lista da equipe | FILTER | `contato`: `status!=encerrado^GROUPBYatendente^ORDERBYproxima_acao_em` | coordenador, admin |
| Ciclo e carteira | Ciclo do mês | FILTER | muda: `view: x_2326104_cob_tel_036` | coordenador |
| Réguas | Réguas | LIST | `regua` (existe) | coordenador |
| Réguas | Inscrições (novo) | FILTER | `regua_inscricao`: `statusINativa,erro^ORDERBYDESCstatus^ORDERBYproxima_etapa_em` | coordenador |
| Réguas | Disparos com falha | FILTER | existe | coordenador |

Coordenador: 14 módulos (D5). O `GROUPBYatendente` exige a ACL `query_range` em `contato.atendente` para coordenador e admin (B5; F0 ponto 9). O admin do app já tem "Administração > Contato da lista" e passa a ter também "Equipe > Lista da equipe".

#### A5. Form do contato (TEL-035)

Ordem dos campos em `screens` (o `sn-scaffold` divide os campos curtos em duas colunas, na ordem): `resultado_ligacao`, `proxima_acao_em`, `motivo_encerramento`, `proxima_acao`, `status`, `contribuinte`, `valor_em_aberto`, `ultimo_resultado`, `tentativas`, `prioridade`, `atendente`, `ciclo`, `origem`, `inscricao`; `comentarios` (journal) fica no bloco longo, como hoje. `motivo_encerramento` continua editável (o "Encerrar" o exige, `ui-actions/contato.now.ts:59-64`). Sem seções novas (Non-Goals).

### B. Régua como Flow

#### B1. Modelo de dados

| Tabela | Mudança |
|---|---|
| `regua` | + `codigo` (string 40, obrigatório; único, validado pelo gerador; ex.: `ipva`), + `flow` (reference `sys_hub_flow`), + `prazo_final_dias` (integer, padrão 5, obrigatório; "Prazo de resposta depois da última etapa (dias)"). `ordem_fallback` sai de lista e form (D18) |
| `regua_etapa` | + `postura` (choice: utilitaria, consciente, explicativa, ameacadora); `acao_sem_resposta` + choice `encaminhar_ativa`; rótulo de `offset_dias` vira "Dia (D+n)" |
| **`regua_inscricao`** (nova, "Inscrição na régua") | `contribuinte` (ref, obrigatório), `regua` (ref, obrigatório), `ciclo` (ref), `parcelamento` (ref), `status` (ativa, encerrada, erro; padrão ativa), `etapa_atual` (integer), `proxima_etapa_em` (glide_date_time), `iniciada_em` (glide_date_time, preenchido por `inscrever`), `encerrada_em` (glide_date_time), `motivo_encerramento` (regularizado, parcelamento_rompido, controle, regua_pausada, encaminhada_ativa, encaminhada_qualificada), `contato` (ref), `detalhe` (string 255; mensagem de erro). Display: contribuinte. Audit |
| `comunicacao` | + `inscricao` (ref) |
| `envio_sim` | + `inscricao` (ref; related list "Retornos de envio" no form da inscrição) |
| `contato` | + `inscricao` (ref), + `origem` (choice: distribuicao, regua; padrão distribuicao), + `proxima_acao` (string 120, só leitura) |
| `caso`, `ciclo` | + `proxima_acao` (string 120, só leitura) |
| `contribuinte` | + `encaminhado_qualificada_em` (glide_date_time) |
| Propriedade | `x_2326104_cob.regua.segundos_por_dia` (integer; 60) |
| `data-model.json` | entidades e colunas acima; `screens` TEL-013, TEL-014, TEL-023, TEL-034, TEL-035 mudam; TEL-036, TEL-037, TEL-038 novas; módulos de A4; `seedManual` += `regua`, `regua_etapa`, `canal_sim`, `consentimento`, `comunicacao`, `envio_sim` |

Regras de campo do modelo:

*   **Consentimento vigente** = o registro mais recente (`registrado_em`, depois `sys_created_on`) por contribuinte e canal. Sem registro: sem opt-in e sem opt-out.
*   **Falha simulada**: só `canal_sim.forcar_falha` vale. `canal_sim.falhar` e `envio_sim.falhar` não são lidos; `envio_sim.status_retorno = recusado_sem_optin` não é usado (canal sem opt-in não gera tentativa).
*   **Carteira → débito**: `ipva`, `itcd`, `icms_normal`, `icms_st` = `debito.tributo` de mesmo valor; `parcelamentos` = o `parcelamento` da inscrição.
*   **Cardinalidade**: 1 `comunicacao` por inscrição e etapa (canal final, status final); 1 `envio_sim` por tentativa real; canal pulado não gera `envio_sim` e fica escrito em `comunicacao.motivo`.
*   **Status final da comunicação**: "Entregue" (alguma tentativa entregue), "Falha" (houve tentativa e todas falharam), "Pulada" (nenhum canal possível). `tentativas` = número de `envio_sim`.

`outputs/spec/reguas.json` (D8; JSON `dia` → `offset_dias`, `template` → `template`):

```json
{ "reguas": [
  { "codigo": "ipva", "nome": "IPVA", "carteira": "ipva", "ativa": true, "prazo_final_dias": 5, "janela_atribuicao_dias": 30,
    "etapas": [
      { "ordem": 1, "dia": 0,  "canal": "sne",   "postura": "utilitaria",  "acao_sem_resposta": "intensificar", "template": "Há uma mensagem para você no DT-e. Acesse o portal da SEFAZ-MT." },
      { "ordem": 2, "dia": 10, "canal": "email", "postura": "consciente",  "acao_sem_resposta": "intensificar", "template": "..." },
      { "ordem": 3, "dia": 20, "canal": "sms",   "postura": "explicativa", "acao_sem_resposta": "intensificar", "template": "..." },
      { "ordem": 4, "dia": 30, "canal": "sne",   "postura": "ameacadora",  "acao_sem_resposta": "encaminhar_ativa", "template": "..." }
    ] }
] }
```

Seed: `flow: Now.ref('sys_hub_flow', 'flow_regua_<codigo>')` em cada régua. 5 réguas, uma por carteira (Parcelamentos, IPVA, ITCD, ICMS Normal, ICMS ST), 3 a 4 etapas cada, `janela_atribuicao_dias: 30` (RN-NOVO-F4-007), textos de ciência do DT-e nos canais informais. Uma régua usa `encaminhar_qualificada` na última etapa (ITCD), para a demo mostrar os dois destinos.

#### B2. Sequência do Flow

Arquivo gerado `app/src/fluent/flows/regua-<codigo>.now.ts`. Código literal da etapa k e do fecho no [Anexo A](#anexo-a-código-do-flow-gerado).

*   **Gatilho**: `trigger.record.created` em `x_2326104_cob_regua_inscricao`, `condition: 'regua.codigo=<codigo>^status=ativa'`, `run_flow_in: 'background'`. `runAs: 'system'`.
*   **Corpo**: um `tryCatch`. No `try`, as etapas e o fecho; no `catch`, `action.core.updateRecord` na inscrição com `status = erro` e `detalhe` = mensagem de erro.
*   **Etapa k** (k = 1..N), stage "Etapa k":
    1. "Agendar etapa" (inscrição, k) → `segue`, `executar_em`; `segue = false` → `endFlow`;
    2. espera relativa até `executar_em`;
    3. "Checar guardas" → `segue = false` → `endFlow`;
    4. "Enviar comunicação (simulado)" (inscrição, k).
*   **Fecho**, stage "Encaminhamento":
    1. "Agendar etapa" (inscrição, N+1): `executar_em = iniciada_em + (dia da etapa N + prazo_final_dias) × segundos_por_dia`; `segue = false` → `endFlow`;
    2. espera relativa;
    3. "Checar guardas" → `segue = false` → `endFlow`;
    4. "Escalonar" (inscrição).
*   `wfa.stage` nunca é a última instrução: cada stage é seguido de ações.
*   Rótulo do stage é "Etapa k", sem canal nem postura (o coordenador muda canal e postura no form).
*   "Renotificar" e "Intensificar" não mudam o fluxo; a diferença está na postura e no texto da etapa seguinte.

#### B3. Custom actions e `ReguaMotor`

Arquivo `app/src/fluent/actions/regua.now.ts`. Cada action tem um `actionStep.script` com `required_run_time: 'instance'`, `script: Now.include('../../server/regua/acao-<nome>.js')`, `inputVariables` com os pills das entradas, `outputVariables` iguais às saídas, e `wfa.assignActionOutputs(params.outputs, ...)` no fim. O script de cada passo é `(function execute(inputs, outputs) { var r = new ReguaMotor().<método>(inputs.inscricao, parseInt(inputs.ordem, 10)); outputs.<x> = r.<x>; })(inputs, outputs);`: `inputs.inscricao` chega como GlideRecord e `inputs.ordem` chega como string vinda do Flow e número vindo do FlowAPI (F0 ponto 2). Os métodos do motor aceitam GlideRecord ou sys_id. Chamada por script: `sn_fd.FlowAPI.getRunner().action('x_2326104_cob.<internalName>')`.

| Action (`name`) | `$id` / `internalName` | Entradas | Saídas | Script / método |
|---|---|---|---|---|
| Régua: agendar etapa | `regua_acao_agendar` / `regua_agendar_etapa` | `inscricao` ReferenceColumn(`x_2326104_cob_regua_inscricao`, obrigatório); `ordem` IntegerColumn (obrigatório) | `segue` BooleanColumn; `executar_em` DateTimeColumn | `acao-agendar-etapa.js` → `agendar(inscricao, ordem)` |
| Régua: checar guardas | `regua_acao_guardas` / `regua_checar_guardas` | `inscricao` | `segue` BooleanColumn; `motivo` StringColumn(40) | `acao-checar-guardas.js` → `checarGuardas(inscricao)` |
| Régua: enviar comunicação (simulado) | `regua_acao_enviar` / `regua_enviar_comunicacao` | `inscricao`; `ordem` IntegerColumn | `status` StringColumn(20); `canal` StringColumn(20); `comunicacao` ReferenceColumn(`x_2326104_cob_comunicacao`) | `acao-enviar-comunicacao.js` → `enviar(inscricao, ordem)` |
| Régua: escalonar | `regua_acao_escalonar` / `regua_escalonar` | `inscricao` | `destino` StringColumn(40); `contato` ReferenceColumn(`x_2326104_cob_contato`) | `acao-escalonar.js` → `escalonar(inscricao)` |

`ReguaMotor` (`app/src/server/regua/ReguaMotor.server.js`):

| Método | Regra |
|---|---|
| `agendar(id, ordem)` | Devolve `executar_em` como objeto `GlideDateTime` (não `getValue()`). Inscrição não ativa → `{segue:false}` sem gravar. Etapa `ordem` existe → `executar_em = iniciada_em + offset_dias × segundos_por_dia`; `ordem` = última + 1 → `executar_em = iniciada_em + (offset_dias da última + prazo_final_dias) × segundos_por_dia`. Grava `etapa_atual` (só para etapa real) e `proxima_etapa_em` |
| `checarGuardas(id)` | Não ativa → `segue=false` (sem regravar). Senão `motivo = motivoParada(insc)`; com motivo → `encerrar(insc, motivo)`, `segue=false` |
| `motivoParada(insc)` | Régua inativa → `regua_pausada`. `ciclo` preenchido e `QualificacaoCiclo.emControle(contribuinte, ciclo)` → `controle` (sem `ciclo`, essa guarda não se aplica; `emControle` com ciclo vazio olharia todos os ciclos e não é chamado). Carteira `parcelamentos`: parcelamento `em_risco` → segue; `em_dia`/`quitado` → `regularizado`; `rompido` → `parcelamento_rompido`. Outras carteiras: nenhum débito `aberto` com `tributo` = carteira → `regularizado` |
| `enviar(id, ordem)` | **Idempotência**: já existe comunicação da inscrição e da etapa com status ≠ "agendada" → devolve a existente sem enviar. Senão cria (ou reaproveita a "agendada") comunicação com `contribuinte`, `regua`, `etapa`, `ciclo`, `inscricao`. Canais = canal da etapa + `ORDEM_FALLBACK` sem repetir. Por canal: pula se `canal_sim` não contratado; exige opt-in e o vigente não é opt-in; o vigente é opt-out; ou `envio_sim` do contribuinte no canal com `recebido_em` nos últimos `segundos_por_dia` s ≥ `TETO_POR_JANELA`. Senão cria `envio_sim` (`comunicacao`, `inscricao`, `canal`, `status_retorno` = falha se `forcar_falha`, senão entregue, `recebido_em` agora). Para no primeiro entregue. Grava status final, canal final, `enviada_em`, `tentativas` e `motivo` ("SMS: opt-out; WhatsApp: sem opt-in"). A BR atual que recusa comunicação de contribuinte em controle continua valendo |
| `escalonar(id)` | **Idempotência**: inscrição não ativa → `destino=''`, nada muda. Lê `acao_sem_resposta` da última etapa. `encaminhar_ativa`: `QualificacaoCiclo.atribuirContato(contribuinte, ciclo, 'regua', inscricao)`; grava `inscricao.contato`; encerra `encaminhada_ativa`. `encaminhar_qualificada`: grava `contribuinte.encaminhado_qualificada_em = agora`; encerra `encaminhada_qualificada` |
| `encerrar(insc, motivo)` | `status = encerrada`, `encerrada_em`, `motivo_encerramento`; comunicações "agendada" da inscrição → "encerrada" (RN-NOVO-F1-002) |
| `inscrever(cicloId)` | Para cada `segmentacao` do ciclo com `segmento = massificada`: carteira = `tributo` com maior soma de `valor` em débitos `aberto`; sem débito aberto → pula; régua ativa da carteira (sem régua → pula); já há inscrição ativa do contribuinte nessa régua → pula. Cria inscrição (`status ativa`, `iniciada_em` agora, `etapa_atual` 0). Depois limpa `encaminhado_qualificada_em` dos contribuintes segmentados no ciclo |
| `inscreverParcelamento(parc)` | Régua ativa `parcelamentos`; sem inscrição ativa do contribuinte nela; `ciclo` = último ciclo publicado (`ORDERBYDESCpublicado_em`), ou vazio; `parcelamento` = o registro. Contribuinte em controle nesse ciclo é recusado pela BR de inscrição |
| `reavaliar(contribuinteId)` | Para cada inscrição ativa do contribuinte: `motivoParada`; com motivo → `encerrar` |
| `pausar(regua)` / `ativar(regua)` | Grava `ativa`; mensagem. O encerramento das inscrições é da BR (B4) |
| `reenviar(com)` (opcional) | Coordenador; status "falha" → nova rodada de tentativas na mesma comunicação, com as mesmas regras de `enviar` |

Cada script de passo envolve a chamada em `try/catch` só para registrar `gs.error('RF-MOD-F4: ...')` e relançar; quem marca `erro` é o `catch` do Flow.

`QualificacaoCiclo` (muda, P1):

*   `_criarContato(p, cicloId, dono, valor, origem, inscricaoId)`: o `insert` que hoje está dentro de `distribuir`, mais `origem` e `inscricao`. Sem checagem de papel.
*   `distribuir(ciclo)`: igual ao de hoje (papel, estado, `jaTem` por qualquer contato do ciclo, rodízio `vez`, mensagem), trocando o `insert` por `_criarContato(..., 'distribuicao', '')`.
*   `atribuirContato(contribuinteId, cicloId, origem, inscricaoId)` (novo, sem checagem de papel): se há contato **aberto** do contribuinte no ciclo → grava `inscricao` e `proxima_acao_em = agora` quando vazio ou futuro, devolve `{contato, criado:false}`; senão escolhe o dono (atendente do contribuinte; sem atendente, o usuário ativo com papel atendente com menos contatos abertos no ciclo, empate por `user_name`, gravado também no contribuinte) e chama `_criarContato(..., origem, inscricaoId)`.

**ATF da UX-004 (`tests/US-MOD-UX-004.now.ts`)**: nenhum `it()` muda. Conferido:
*   "cria 3 contatos só da massificada e grava o ciclo" e "atendente do contato = atendente do contribuinte": `distribuir` mantém papel, dedupe, rodízio, contagem e mensagem; o ciclo do teste nasce já "publicado" por insert, então a BR after update (D7) não roda e não nasce inscrição.
*   "segundo clique não duplica" e "contato para contribuinte do grupo de controle é recusado": a recusa continua em `distribuido_em` e na BR de contato em controle.
*   `t_ux004_ui`: as actions de form não mudam; as de lista são outros registros.

#### B4. Gatilhos que criam ou encerram inscrição

| Evento | Objeto (arquivo) | O que faz |
|---|---|---|
| Ciclo prévia → publicado | BR after update em `ciclo`, `condition: "previous.estado == 'previa' && current.estado == 'publicado'"` (`business-rules/regua.now.ts`) | `ReguaMotor.inscrever(ciclo)` |
| Parcelamento vira "em risco" | BR after update em `parcelamento`, `condition: "current.status.changesTo('em_risco')"` | `inscreverParcelamento(current)` |
| Parcelamento muda de status para outro valor | BR after update em `parcelamento`, `condition: "current.status.changes() && current.status != 'em_risco'"` | `reavaliar(contribuinte)` |
| Débito muda de status | BR after update em `debito`, `condition: "current.status.changes()"` | `reavaliar(contribuinte)` |
| Insert em `regularizacao` | BR after insert | `reavaliar(contribuinte)` |
| Régua `ativa` vira false | BR after update em `regua`, `condition: "current.ativa.changesTo(false)"` | `encerrar` de cada inscrição ativa da régua com `regua_pausada` |
| Insert em `regua_inscricao` de contribuinte em controle | BR before insert reutilizando `server/qualificacao/recusarAcaoControle.server.js` (`motivoRecusaAcao` lê `contribuinte` e `ciclo`, que a inscrição tem) | Recusa |
| Save em `regua_etapa` | BR before insert/update (`server/regua/validarEtapa.server.js`) | D17 |
| Publicação do ciclo seguinte | `SegmentacaoScore.aplicar` (muda) | Contribuinte com `encaminhado_qualificada_em` preenchido → `segmento = qualificada`, motivo "Esgotou a régua (RN-NOVO-F4-008)". O sorteio do controle roda depois, no before update do ciclo, e pode sorteá-lo (decidido em `business-rules.md`). `QualificacaoCiclo.prepararPublicacao` não muda |

#### B5. Segurança

| Tabela | ACL / BR | Papéis |
|---|---|---|
| `regua` | write registro e `*` | coordenador, admin |
| `regua` | write de campo `codigo`, `carteira`, `flow` | admin (só leitura para o coordenador) |
| `regua_etapa` | write registro e `*` | coordenador, admin |
| `regua_etapa` | write de campo `regua`, `ordem` | admin |
| `regua`, `regua_etapa` | create | sem ACL nova (só admin de sistema) |
| `regua_inscricao` | read registro e `*` | atendente, coordenador, admin |
| `regua_inscricao` | read deny `answer = new CarteiraAtendente().podeVer(current, 'contribuinte.atendente');` (`adminOverrides: true`) | — |
| `regua_inscricao` | BR before query `restringirConsultaCarteira.server.js`, com `x_2326104_cob_regua_inscricao: ['contribuinte.atendente']` no mapa `DONO` | — |
| `regua_inscricao` | create, write, delete | nenhuma ACL para as personas; o motor grava por `GlideRecord` no servidor |
| `contato` | create | sem mudança (coordenador, admin); o Flow cria como system |
| `sys_ui_list_control` | `new_roles` | admin (A2) |
| `contato` | `query_range` de campo `atendente` (`app/src/fluent/security/contato.now.ts`) | coordenador, admin (sem ela o `GROUPBYatendente` da "Lista da equipe" dá 0 linhas ao coordenador, F0 ponto 9) |

Nenhuma BR de carteira precisa de exceção de sistema: `recusarContatoForaDaCarteira` é só de update, e o motor não encerra contato (RN-09 fora).

#### B6. Flow Designer (P2), execuções e transform

**Mecanismo (decidido na F0, nesta ordem):**
1. Registro `sys_user_role_contains` em `app/src/fluent/security/coordenador-flow.now.ts` (arquivo à mão; `roles.now.ts` é gerado pelo `sn-scaffold` e não aceita `containsRoles`): `role: Now.ref('sys_user_role', { name: 'x_2326104_cob.coordenador' })` contém `Now.ref('sys_user_role', { name: 'flow_designer' })` e `flow_operator`, por nome nos dois lados (sem sys_id lido; `Now.ref('sys_user_role', 'role_coordenador')` não resolve). Validado na F0 (ponto 5).
2. Se a instância recusar papel global contido em papel de escopo: `sys_user_has_role` de `demo.coordenador` com `flow_designer` e `flow_operator`, no mesmo arquivo.
3. Se o Flow Designer não deixar um não-admin editar Flow do escopo: o coordenador abre para leitura e execuções; a edição no Designer é feita pelo admin. Registrado no `sync-log.md`.

Os Flows não usam `protectionPolicy: 'read'`.

**Edição no Designer e reinstall** (vai para `outputs/spec/demo/roteiro.md` e `outputs/spec/sync-log.md`):
*   O que for mudado no Flow pelo Designer vale até o próximo `npm run reinstall`, que reinstala a fonte Fluent e sobrescreve a mudança.
*   Para manter: antes do reinstall, conferir `sys_hub_flow` com `internal_nameSTARTSWITHregua_^sys_updated_by!=<usuário do install>`; havendo edição, rodar `npm run transform` em `app/` só para ler a edição e levá-la à fonte à mão (a saída crua do transform não compila e nunca é commitada, F0 ponto 10):
    *   mudança de estrutura (etapa nova, removida ou reordenada) → `outputs/spec/reguas.json` e regerar; etapa nova precisa da `regua_etapa` correspondente, criada pelo gerador;
    *   mudança que o gerador não expressa → a régua ganha `"flowManual": true` em `reguas.json`; o gerador para de escrever `regua-<codigo>.now.ts` (continua escrevendo o seed) e o arquivo vindo do transform, corrigido (repor os `const` das ações com saída em pill, tirar `masterSnapshot`, descartar `app/metadata/`), passa a ser mantido à mão.
*   Mudança de estrutura com inscrições em andamento: "Pausar" a régua antes do reinstall (encerra as ativas com `regua_pausada`), reinstalar, "Ativar". Régua removida do JSON vira DELETE do Flow no install: pausar antes e confirmar com o usuário (`CLAUDE.md`).

**Links**: "Abrir no Flow Designer", "Ver execuções" e "Ver execução" (A1). No seed, `flow: Now.ref('sys_hub_flow', 'flow_regua_<codigo>')` (a constante do Flow não compila; F0 ponto 4). `source_record` aponta para a inscrição (F0 ponto 6).

#### B7. Demo sem esperar dias

*   `segundos_por_dia = 60`: dia 30 vira minuto 30; o fecho da IPVA, minuto 35.
*   A espera é uma data absoluta calculada em "Agendar etapa"; mudar a propriedade vale para as próximas etapas agendadas.
*   Roteiro da véspera (`outputs/spec/demo/roteiro.md`): acordar a PDI; publicar o "Ciclo 2026-12" pelo menos 40 minutos antes, para ter inscrições em todas as etapas, ou publicar na hora e mostrar a etapa 1 em 1 minuto; anotar A e B (contribuintes de demo com consentimento preparado pelo seed) e conferir que nenhum dos dois foi sorteado para o controle.

#### B8. Limites da API Fluent que mudam o desenho (4.14.3)

| Ponto | Efeito no desenho | Fonte |
|---|---|---|
| Um gatilho por Flow; Flow não declara inputs | Um Flow por régua, gatilho na inscrição | `wfa-flow-guide` §Rules |
| Flow fica ativo no install; `FlowConfig` não tem `active` | Régua inativa é guarda no Flow e BR de pausa | `flow-api.md` |
| `Duration()` é literal; o relativo aceita `relativeDatetime` | D11 | `wfa-flow-logic-api.md` §waitForADuration |
| Sem JS em condição de `if` | Guardas em custom action, `if` só compara pill | `wfa-flow-logic-guide` |
| Custom action: corpo só com `actionStep`, sem flow logic | Ramificação fica no Flow | `custom-action-api.md` §Body Function |
| Saída de ação dentro de `if` não sobe; dentro de `tryCatch` sobe só pelo `return` | Nada depois do `tryCatch` lê saída de dentro dele | `wfa-flow-logic-api.md` §Hoisting |
| Stage não vai em `forEach` nem `doInParallel` | Etapas desenroladas pelo gerador | `wfa-flow-stages-guide` |
| Não há passo ATF de Flow | Ações testadas por `sn_fd.FlowAPI` em `runServerSideScript`; ponta a ponta na instância | `atf-guide.md` |

#### B9. Testes (ATF)

Massa criada pelo próprio teste. **Régua de teste**: `codigo = atf_<caso>`, que nenhum gatilho de Flow casa; assim inserir inscrição ativa no ATF não dispara Flow em background fora do rollback. Ciclo de teste que precise de inscrição nasce "publicado" por insert ou chama `ReguaMotor.inscrever` direto.

| Story | Test | Passos | Regra |
|---|---|---|---|
| UX-009 | lista: atendente vê "Registrar ligação…" e não vê "Avançar etapa" | `atf.server.createUser` (atendente), `atf.server.recordInsert` (contato), `atf.list.listUIActionVisibility` | G1 |
| UX-009 | lista: coordenador vê "Publicar ciclo" no ciclo em prévia e não vê no publicado | `createUser` (coordenador), `recordInsert` ×2, `listUIActionVisibility` ×2 | G1 |
| UX-009 | Update: atendente não vê `UX-009_ua_update_contato`; coordenador vê `UX-009_ua_update_ciclo` na prévia e não no publicado | `createUser`, `atf.form.openExistingRecord`, `atf.form.uiActionVisibility` com `Now.ref('sys_ui_action', 'UX-009_ua_update_contato')` | G2 |
| UX-010 | `ProximaAcao`: um `it()` por linha da tabela A3 | `runServerSideScript` (jasmine) | G3 |
| UX-010 | "Lista da equipe" visível ao coordenador e invisível ao atendente | `createUser`, `atf.applicationNavigator.moduleVisibility` | G4 |
| F4-010 | `validarEtapa`: salto de postura, regressão, dia fora de ordem, encaminhar fora da última, última sem encaminhar e `R$` em SMS recusados; caso válido grava | `runServerSideScript` | D17 |
| F4-010 | BR de inscrição recusa contribuinte em controle; grava massificada | `runServerSideScript` | RN-NOVO-F2-005 |
| F4-010 | fumaça: `sn_fd.FlowAPI.getRunner().action('x_2326104_cob.regua_agendar_etapa').inForeground().withInputs({ inscricao: <GlideRecord>, ordem: 1 }).run()` (GlideRecord, não sys_id: F0 ponto 2) devolve `segue` e `executar_em` (régua `atf_fumaca`) | `runServerSideScript` | contrato B3 |
| F4-011 | `checarGuardas`: controle, regularizado, parcelamento quitado, rompido, régua pausada, inscrição encerrada → `segue=false` com o motivo; caso limpo → `true` | `runServerSideScript` | G7 |
| F4-011 | `enviar`: WhatsApp sem opt-in → pula e entrega por SNE; SNE com `forcar_falha` → e-mail, 2 `envio_sim`; tudo com falha → "Falha", 3 tentativas; opt-out de SMS → não sai por SMS | `runServerSideScript` | RN-NOVO-F4-003, 004, 005 |
| F4-011 | teto em modo demo: com `segundos_por_dia = 60`, segundo envio no mesmo canal dentro de 60 s pula para o próximo canal; depois de 60 s (`recebido_em` do primeiro recuado 61 s pelo teste) sai no mesmo canal | `runServerSideScript` | D19, RN-38 |
| F4-011 | idempotência: `enviar` duas vezes na mesma etapa → 1 comunicação, mesmos `envio_sim` | `runServerSideScript` | 🔴6 |
| F4-012 | `inscrever`: massificada com débito aberto ganha inscrição; controle, qualificada e sem débito não; segunda chamada não duplica | `runServerSideScript` | D7 |
| F4-012 | BR after de ciclo: publicar por `GlideRecord` (sem botão) cria inscrição (régua `atf_br`, carteira de teste) | `createUser` (coordenador), `runServerSideScript` | 🔴5 |
| F4-012 | `reavaliar`: débito → regularizado encerra a inscrição e a comunicação agendada; débito de outro tributo não encerra | `runServerSideScript` | G8 |
| F4-012 | `escalonar` ativa: sem contato aberto cria com `origem=regua`; com contato aberto não cria, grava `inscricao` e `proxima_acao_em`; segunda chamada não faz nada | `runServerSideScript` | D14, 🔴6 |
| F4-012 | `escalonar` qualificada grava a marca; `SegmentacaoScore.aplicar` classifica como qualificada; `inscrever` limpa a marca | `runServerSideScript` | RN-NOVO-F4-008 |
| F4-012 | Pausar encerra as inscrições ativas com `regua_pausada`; Ativar não retoma | `runServerSideScript` | A1 |
| F4-013 | parcelamento → em risco cria inscrição com `parcelamento` e último ciclo publicado; → quitado encerra `regularizado`; → rompido encerra `parcelamento_rompido` | `runServerSideScript` | D16 |
| F4-013 | ACL: atendente não lê inscrição de outra carteira; coordenador lê todas | `createUser`, `runServerSideScript` com `GlideRecordSecure` | B5 |
| F4-014 | coordenador vê "Abrir no Flow Designer" e "Ver execuções" no form da régua | `createUser`, `openExistingRecord`, `uiActionVisibility` | D12 |
| F4-016 (opcional) | `reenviar` de comunicação com falha cria nova tentativa | `runServerSideScript` | RN-NOVO-F4-005 |

O Flow de ponta a ponta (com espera) não cabe em ATF. Ele é conferido na instância (Verification).

## Riscos e mitigações

| Risco | Mitigação |
|---|---|
| `relativeDatetime: wfa.dataPill(...)` não compila ou não serializa | F0 testa as duas formas (pill direto e template literal). Plano B completo: coluna `regua_inscricao.liberada` (boolean); "Agendar" grava `liberada = false`; o Flow troca a espera por `action.core.waitForCondition` em `liberada=true` na inscrição; `ScheduledScript` `app/src/fluent/scheduled-scripts/regua-liberar.now.ts` (a cada 1 minuto, script `server/regua/liberarEtapas.server.js`) marca `liberada = true` onde `status=ativa^liberada=false^proxima_etapa_em<=agora` |
| Stage dentro do `try` de `tryCatch` não é aceito | Plano B: sem `tryCatch` no Flow; cada script de passo captura a exceção, grava `status = erro` e `detalhe`, e devolve `segue = false`; "Enviar" ganha a saída `segue` e o Flow checa depois dele |
| `regua.flow` por reference no seed não resolve | Plano B em B6 |
| Papel de Flow Designer no coordenador recusado | B6, mecanismos 2 e 3 |
| Edição no Designer perdida no reinstall | Fluxo de transform em B6, no roteiro |
| Erro numa custom action deixa a inscrição "ativa" | `catch` grava `erro`; módulo "Inscrições" mostra ativas e com erro |
| Um contexto de Flow esperando por inscrição: volume alto em produção | Fora da demo. Registrar em `gaps-document.md` com o número do seed e a alternativa de lote agendado |
| PDI hiberna e as esperas param | Acordar antes da demo; esperas vencidas executam ao voltar |
| Override de `sysverb_update` esconde o Update de quem precisa corrigir dado | Só contato (todo dado muda por verbo) e ciclo fora da prévia; admin continua vendo |
| Seed aleatório de régua, etapa, canal, comunicação, envio e consentimento some e vira DELETE (≈300 registros) | Confirmar com o usuário antes do install da F2 (`CLAUDE.md`) |
| `GROUPBY` no filtro de módulo ou `new_roles` como string não funcionam | F0; plano B do `GROUPBY`: lista ordenada por atendente; plano B do `new_roles`: `omit_new_button: true` |

## Detailed Implementation

### Arquivos (allowlist)

Caminhos relativos ao worktree. Só estes arquivos mudam.

| Arquivo | Ação | Origem | Story |
|---|---|---|---|
| `outputs/spec/reguas.json` | novo | à mão | F4-010 |
| `outputs/spec/data-model.json` | muda (B1, A3, A4, A5) | à mão | UX-010, F4-010 |
| `outputs/spec/tasks.json` | muda (stories abaixo) | `spec-scope-change` | F0 |
| `outputs/spec/gaps-document.md` | muda (RN-09 fora; volume de contextos) | à mão | F0 |
| `outputs/spec/sync-log.md` | muda (resultados da F0; installs) | kit | todas |
| `outputs/spec/demo/roteiro.md` | muda (B6, B7) | à mão | F4-014 |
| `app/scripts/gerar-flows-regua.mjs` | novo | à mão | F4-010 |
| `app/scripts/gerar-flows-regua.test.mjs` | novo | à mão | F4-010 |
| `app/scripts/gerar-seed-demo.mjs` | muda (`proxima_acao`, `origem`, canal_sim, consentimento, contagem das réguas) | à mão | UX-010, F4-010 |
| `app/src/fluent/tables/regua.now.ts` | muda | `sn-scaffold` | F4-010 |
| `app/src/fluent/tables/regua_etapa.now.ts` | muda | `sn-scaffold` | F4-010 |
| `app/src/fluent/tables/regua_inscricao.now.ts` | novo | `sn-scaffold` | F4-010 |
| `app/src/fluent/tables/comunicacao.now.ts` | muda | `sn-scaffold` | F4-010 |
| `app/src/fluent/tables/contato.now.ts` | muda | `sn-scaffold` | UX-010, F4-010 |
| `app/src/fluent/tables/caso.now.ts` | muda | `sn-scaffold` | UX-010 |
| `app/src/fluent/tables/ciclo.now.ts` | muda | `sn-scaffold` | UX-010 |
| `app/src/fluent/tables/contribuinte.now.ts` | muda | `sn-scaffold` | F4-010 |
| `app/src/fluent/simulations/envio_sim.now.ts` | muda | `sn-scaffold` | F4-010 |
| `app/src/fluent/navigation/menu.now.ts` | muda | `sn-scaffold` | UX-010, F4-012 |
| `app/src/fluent/ui/TEL-013.now.ts`, `TEL-014.now.ts`, `TEL-023.now.ts`, `TEL-034.now.ts`, `TEL-035.now.ts` | muda | `sn-scaffold` | UX-010, F4-010 |
| `app/src/fluent/ui/TEL-036.now.ts`, `TEL-037.now.ts`, `TEL-038.now.ts` | novo | `sn-scaffold` | UX-010, F4-010 |
| `app/src/fluent/security/acl-base.now.ts` | muda (read de `regua_inscricao`) | `sn-scaffold` | F4-010 |
| `app/src/fluent/security/regua.now.ts` | novo (write de régua e etapa, campos só leitura, deny de inscrição) | `sn-implement` | F4-010, F4-013 |
| `app/src/fluent/security/contato.now.ts` | muda (ACL `query_range` em `contato.atendente`, F0 ponto 9) | `sn-implement` | UX-010 |
| `app/src/fluent/security/coordenador-flow.now.ts` | novo (B6) | `sn-implement` | F4-014 |
| `app/src/fluent/seed/regua.now.ts`, `regua_etapa.now.ts`, `canal_sim.now.ts`, `comunicacao.now.ts`, `envio_sim.now.ts`, `consentimento.now.ts` | apaga | `sn-seed` (seedManual) | F4-010 |
| `app/src/fluent/seed/regularizacao.now.ts` | muda (`comunicacao` fica vazio: a reference para tabela de `seedManual` sai) | `sn-seed` | F4-010 |
| `app/src/fluent/seed/_contagem.json`, `_contagem.manual.json` | muda | `sn-seed`, `gerar-seed-demo.mjs` | F4-010 |
| `app/src/fluent/seed-demo/regua.now.ts` | novo (régua + etapas) | `gerar-flows-regua.mjs` | F4-010 |
| `app/src/fluent/seed-demo/canal_sim.now.ts`, `consentimento.now.ts` | novo | `gerar-seed-demo.mjs` | F4-010 |
| `app/src/fluent/seed-demo/ciclo.now.ts`, `contato.now.ts`, `caso.now.ts` | muda (`proxima_acao`, `origem`) | `gerar-seed-demo.mjs` | UX-010 |
| `app/src/fluent/flows/regua-parcelamentos.now.ts`, `regua-ipva.now.ts`, `regua-itcd.now.ts`, `regua-icms-normal.now.ts`, `regua-icms-st.now.ts` | novo | `gerar-flows-regua.mjs` | F4-010 |
| `app/src/fluent/actions/regua.now.ts` | novo (4 actions) | `sn-implement` | F4-010 |
| `app/src/server/regua/acao-agendar-etapa.js`, `acao-checar-guardas.js`, `acao-enviar-comunicacao.js`, `acao-escalonar.js` | novo | `sn-implement` | F4-010 |
| `app/src/server/regua/ReguaMotor.server.js` | novo (F4-010: `agendar` e contrato; F4-011 a 013: o resto) | `sn-implement` | F4-010 a 013 |
| `app/src/server/regua/validarEtapa.server.js` | novo | `sn-implement` | F4-010 |
| `app/src/server/regua/inscreverAoPublicar.server.js`, `reavaliarContribuinte.server.js`, `inscreverParcelamento.server.js`, `encerrarAoPausar.server.js` | novo (scripts das BRs de B4) | `sn-implement` | F4-012, F4-013 |
| `app/src/fluent/script-includes/regua-motor.now.ts` | novo | `sn-implement` | F4-010 |
| `app/src/fluent/business-rules/regua.now.ts` | novo (BRs de B4 e a de inscrição em controle) | `sn-implement` | F4-010, 012, 013 |
| `app/src/fluent/business-rules/carteira.now.ts` | muda (BR de query de `regua_inscricao`) | `sn-implement` | F4-013 |
| `app/src/server/carteira/restringirConsultaCarteira.server.js` | muda (mapa `DONO`) | `sn-implement` | F4-013 |
| `app/src/server/contato/ProximaAcao.server.js` | novo | `sn-implement` | UX-010 |
| `app/src/server/contato/gravarProximaAcao.server.js`, `avisoProximaAcao.server.js` | novo | `sn-implement` | UX-010 |
| `app/src/fluent/script-includes/proxima-acao.now.ts` | novo | `sn-implement` | UX-010 |
| `app/src/fluent/business-rules/proxima-acao.now.ts` | novo (3 before + 1 display) | `sn-implement` | UX-010 |
| `app/src/server/qualificacao/QualificacaoCiclo.server.js` | muda (`_criarContato`, `atribuirContato`; `distribuir` usa o helper) | `sn-implement` | F4-012 |
| `app/src/server/qualificacao/SegmentacaoScore.server.js` | muda (`aplicar` lê `encaminhado_qualificada_em`) | `sn-implement` | F4-012 |
| `app/src/fluent/ui-actions/contato.now.ts`, `caso.now.ts`, `ciclo.now.ts`, `criterio.now.ts` | muda (`order`; actions de lista e override no mesmo arquivo da tabela) | `sn-implement` | UX-009 |
| `app/src/fluent/ui-actions/regua.now.ts` | novo (Pausar, Ativar, Ver execuções, Abrir no Flow Designer) | `sn-implement` | F4-012, F4-014 |
| `app/src/fluent/ui-actions/inscricao.now.ts` | novo (Ver execução) | `sn-implement` | F4-014 |
| `app/src/fluent/ui-actions/comunicacao.now.ts` | novo (Reenviar, opcional) | `sn-implement` | F4-016 |
| `app/src/fluent/ui/list-controls.now.ts` | novo (A2) | `sn-implement` | UX-009 |
| `app/src/fluent/properties/regua.now.ts` | novo (1 propriedade) | `sn-implement` | F4-010 |
| `app/src/fluent/tests/US-MOD-UX-009.now.ts`, `US-MOD-UX-010.now.ts`, `US-MOD-F4-010.now.ts` … `US-MOD-F4-014.now.ts` (`US-MOD-F4-016.now.ts` opcional) | novo | `sn-implement` | cada story |
| `app/src/fluent/tests/suite.now.ts` | muda (inclui os testes novos) | `sn-implement` | cada story |
| `app/src/fluent/generated/keys.ts` | muda | build | todas |
| Plano B de `relativeDatetime`: `app/src/fluent/scheduled-scripts/regua-liberar.now.ts`, `app/src/server/regua/liberarEtapas.server.js` | novo, só se a F0 der não | `sn-implement` | F4-010 |

`app/src/fluent/tests/US-MOD-UX-004.now.ts` não muda (B3).

### Comandos

| O quê | Comando (na raiz do worktree, salvo indicação) |
|---|---|
| Teste do gerador | `node --test app/scripts/gerar-flows-regua.test.mjs` |
| Gerar Flows e seed de régua | `node app/scripts/gerar-flows-regua.mjs` |
| Seed manual | `cd app && node scripts/gerar-seed-demo.mjs` |
| Testes do kit | `npm test` |
| Build | `cd app && npm run build` |
| Instalar (com a suíte `cob-regressao`) | `npm run reinstall` |
| ATF de uma story | `npm run atf -- --story US-MOD-F4-011` |

### Fases

| Fase | O que | Verde quando |
|---|---|---|
| F0 | Spike na instância, num Flow de 2 etapas fora do app final (apagado depois): `relativeDatetime` por pill direto e por template literal; `actionStep.script` com `inputVariables`/`assignActionOutputs` e chamada por `sn_fd.FlowAPI` pelo `internalName`; stage e `endFlow` dentro do `try` de `tryCatch`; `regua.flow` por reference em `Record`; papel de Flow Designer do coordenador (B6, 1→2→3) e edição de Flow do escopo por ele; `sys_flow_context.source_record`; `showListChoice` em "Ações nas linhas selecionadas"; `new_roles` como string; `GROUPBY` em filtro de módulo; ida e volta `now-sdk transform` de um Flow editado no Designer. `spec-scope-change` e stories | cada ponto com sim/não em `sync-log.md`; plano B escolhido onde deu não |
| F1 | US-MOD-UX-009 e UX-010 (A1–A5): actions de lista, override, list controls, `ProximaAcao`, "Lista da equipe", listas e form | `npm run reinstall` verde; `npm run atf -- --story US-MOD-UX-009` e `UX-010` verdes |
| F2 | US-MOD-F4-010: modelo (B1) → `sn-scaffold`; `reguas.json`; gerador e teste; seed; as 4 custom actions com contrato final e `ReguaMotor.agendar`, `checarGuardas` e `enviar` mínimos (devolvem `segue = true` e `status = 'pulada'`); Flows; `validarEtapa`; ACLs de régua e etapa; propriedade | `node --test app/scripts/gerar-flows-regua.test.mjs` verde; `npm test` sem falha nova; DELETE do seed confirmado com o usuário; reinstall verde; 5 Flows ativos "Régua: …"; ATF F4-010 verdes |
| F3 | US-MOD-F4-011: guardas, envio, fallback, opt-in, teto, idempotência | ATF F4-011 verdes |
| F4 | US-MOD-F4-012 e F4-013: `inscrever` pela BR de ciclo, `reavaliar`, pausa, escalonamento (`atribuirContato`), qualificada no ciclo seguinte, parcelamento em risco, ACL de inscrição | ATF F4-012 e F4-013 verdes; UX-004 verde sem mudança; suíte `cob-regressao` verde |
| F5 | US-MOD-F4-014: links de execução e Designer, papel do coordenador, roteiro (B6, B7); depois, se houver tempo, US-MOD-F4-016 | CUJ-4 a CUJ-7 percorridos na instância; ATF F4-014 verdes |

Stories:
- **US-MOD-UX-009**: ações na lista, override de Update e list controls (A1, A2).
- **US-MOD-UX-010**: "O que fazer agora", listas, "Lista da equipe" e form do contato (A3, A4, A5).
- **US-MOD-F4-010**: modelo, régua como Flow (gerador, seed, custom actions, Flows), validação da etapa, ACLs de régua (B1–B3, D17).
- **US-MOD-F4-011**: guardas e envio simulado com fallback, opt-in, opt-out e teto (RF-MOD-F4-002, 004, 005).
- **US-MOD-F4-012**: inscrição na publicação, regularização encerra, pausa, escalonamento para ativa e qualificada (RF-MOD-F4-003, 009; P1).
- **US-MOD-F4-013**: régua de parcelamento em risco e segurança da inscrição (P3, B5).
- **US-MOD-F4-014**: execuções visíveis e edição no Flow Designer (D12, P2).
- **US-MOD-F4-016** (opcional, última): reenviar falha (RF-MOD-F4-006).

## Verification

*   **Instância:** `npm run reinstall` com a suíte `cob-regressao` verde, incluindo os ATF de B9 e os da UX-004 sem mudança.
*   **Descoberta, por Playwright com impersonate:**
    *   `demo.atendente` em "Minha lista": botão direito mostra "Registrar ligação…" e "Encerrar…"; o form abre com o aviso e sem Update (G1, G2);
    *   `demo.coordenador` em "Ciclo do mês" e "Casos qualificados": "Ações nas linhas selecionadas" lista "Publicar ciclo", "Distribuir lista" e "Avançar etapa" conforme o estado (G1); form do ciclo em prévia com Update, publicado sem Update (G2);
    *   por REST: 0 registros com `proxima_acaoISEMPTY` em contato, caso e ciclo (G3);
    *   admin de sistema em "Lista da equipe": pelo menos 20 linhas agrupadas por atendente (G4);
    *   coordenador vê 14 módulos.
*   **Régua:**
    *   Flow Designer lista 5 Flows "Régua: …" ativos, com stages "Etapa 1..N" e "Encaminhamento" (G5);
    *   CUJ-4 com `segundos_por_dia = 60`: em até 40 minutos, as inscrições de A e B estão encerradas como `encaminhada_ativa`; há 1 comunicação por etapa e por inscrição; a etapa 3 de B tem `canal = sne` e motivo "SMS: opt-out"; nenhum contribuinte do controle tem inscrição nem comunicação; o contato de A está em "Minha lista" do atendente (G6, G7, P1);
    *   CUJ-5: débito regularizado na etapa 2 deixa a inscrição encerrada na hora e nenhuma comunicação da etapa 3 (G8);
    *   CUJ-6: texto com `R$` em SMS recusado; "Ver execuções" e "Abrir no Flow Designer" abrem;
    *   CUJ-7: parcelamento em risco cria inscrição; quitado encerra;
    *   "Ver execução" na inscrição abre os detalhes da execução no Flow Designer.
*   **Gerador:** `node --test app/scripts/gerar-flows-regua.test.mjs` verde (JSON de 2 réguas → 2 Flows e 1 seed; cada validação recusando um caso; `flowManual` não escreve o Flow).
*   **Prints** antes e depois por persona em `outputs/spec/screens/ux-v2/`.

## Resolução da revisão

### Blockers

| 🔴 | Tratado em |
|---|---|
| 1. P1 contraditório | D14 (P1 = ambos), B3 (`_criarContato`, `atribuirContato`, dedupe), CUJ-2, CUJ-4; it() da UX-004 listados em B3 (nenhum muda) |
| 2. Teto quebra CUJ-4/G6 | D19 (janela de `segundos_por_dia` por contribuinte e canal), B3 `enviar`, ATF de teto em modo demo (B9) |
| 3. Coordenador não grava régua/etapa | B5 (write registro e `*`; `codigo`, `carteira`, `flow`, `regua`, `ordem` só leitura) |
| 4. ACLs de `regua_inscricao` | B5 (read, deny por carteira, BR de query, sem write) |
| 5. `inscrever` só no botão | D7, B4 (BR after update prévia → publicado), ATF em B9 |
| 6. Idempotência | B3 (`enviar` por inscrição + etapa; `escalonar` por status e `atribuirContato`), ATF em B9 |
| 7. F2 não compila | D10, Fases: actions nascem na F2 com contrato final |
| 8. Contrato das custom actions | B3 (tabela com `internalName`, tipos, script), Anexo A |

### Mudanças mínimas

| # | Tratado em |
|---|---|
| 1. P1 | D14, B3, CUJ-2, A3 |
| 2. Teto em dias simulados | D19, B9 |
| 3. ACLs | B5, A2 (`new_roles` em contato, régua e etapa) |
| 4. `inscrever` em BR after | D7, B4 |
| 5. Idempotência e helper | B3; RN-09 fora (Non-Goals), então o helper é usado por `distribuir` e `escalonar` e nenhuma BR de carteira precisa de exceção (B5) |
| 6. Contrato e actions na F2 | B3, Fases F2 |
| 7. Flow (etapa N, fecho, pill, Agendar com status, tryCatch, D9) | B2, B3 `agendar`, Anexo A, D9, Riscos (plano B do `tryCatch`) |
| 8. UI Actions | A1 (tabelas form e lista), A2, A5 (`motivo_encerramento` editável), G2 sem caso |
| 9. Navegação e lista | D4, D5 (limite 14), A3 (6 colunas, TEL-036), A4, backfill pelo seed |
| 10. Modelo | D18, B1 (consentimento vigente, um campo de falha, carteira → débito, cardinalidade, `envio_sim.inscricao` no lugar de `sys_relationship`, seedManual, `janela_atribuicao_dias`) |
| 11. Arquivos | Allowlist e Comandos |
| 12. ATF | B9 (régua `atf_*`, passos nomeados, casos que faltavam) |
| 13. Cortes | RN-09 fora; campos de versão cortados; P3 mantido com guarda por carteira (D16); `regua.flow`, "Abrir no Flow Designer" e papel de Flow Designer mantidos por P2 (D15, B6) |

### Majors e nits com mudança de desenho

| Item | Tratado em |
|---|---|
| 🟡1 `relativeDatetime` e plano B | D11, Anexo A, Riscos |
| 🟡2 D9 × B2 | D9 |
| 🟡3 fecho e janela de resposta | D13, B2, `regua.prazo_final_dias` |
| 🟡4 Agendar antes das guardas | B3 `agendar`; cancelamento de contexto fora (Non-Goals) |
| 🟡5 erro deixa inscrição ativa | B2 `tryCatch`, status `erro`, módulo "Inscrições" |
| 🟡6 ATF dispara Flow | B9 |
| 🟡7, 🟡8 Update em ciclo e caso | D2, G2, A2 |
| 🟡9 BRs barram encerramento | RN-09 fora; B5 |
| 🟡10 segmento da qualificada | B4 (`SegmentacaoScore.aplicar`) |
| 🟡11 Lista da equipe | D4, D5, A4 |
| 🟡12 admin do app | D20 |
| 🟡13 UI Actions de lista | A1 |
| 🟡14 `proxima_acao` | D3, A3 |
| 🟡15 seeds dependentes | B1, Allowlist |
| 🟡16–19 modelo | D18, B1 |
| 🟡20 New e `codigo` | A2, B5 |
| 🟡21 estrutura só no gerador | D17 |
| 🟡22 estrutura com execuções em andamento | B6 (pausar antes do reinstall); sem versão |
| 🟡23 P3 × guardas | D16, B3 `motivoParada`, B4 |
| 🟡24 allowlist | Allowlist, Comandos |
| 🟡25 cortar Flow Designer | não cortado: P2 = ambos (D15) |
| 🟡26 RN-09 | fora (Non-Goals, GAP) |
| 🟡27 versão | cortada |
| 🟡28 código no corpo | B2 em sequência; código no Anexo A; B8 reduzida |
| 🟢 stage "Etapa N"; stage termina `complete` (CUJ-5); `action` importado e usado no `catch`; `dia` → `offset_dias`; `opt_out_todos` removido; `iniciada_em` em `inscrever`; Pausar não retoma; `Now.ref` local no ATF do override; constantes; Reenviar opcional; `proxima_acao` em 3 tabelas e aviso só no contato; `gs.getMessage`; `server/contato/` em vez de `server/ui/`; reuso de `recusarAcaoControle`; `related_list` no list control | B2, CUJ-5, Anexo A, B1, B3, A1, B9, D18, Stories, D3, A3, Allowlist, B4, A2 |

## Anexo A: código do Flow gerado

Régua IPVA (N = 4). O gerador repete o bloco da etapa para k = 1..N e escreve o fecho com N+1. `Duration` vem do global do SDK (conferir import no build da F0).

```ts
// gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json, ipva) — não editar à mão
import '@servicenow/sdk/global'
import { Flow, FlowStage, wfa, trigger, action } from '@servicenow/sdk/automation'
import { agendarEtapa, checarGuardas, enviarComunicacao, escalonar } from '../actions/regua.now'

export const flow_regua_ipva = Flow(
  { $id: Now.ID['flow_regua_ipva'], name: 'Régua: IPVA', internalName: 'regua_ipva', runAs: 'system',
    description: 'Gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json, ipva).',
    stages: {
      e1: FlowStage({ label: 'Etapa 1', value: 'e1' }), e2: FlowStage({ label: 'Etapa 2', value: 'e2' }),
      e3: FlowStage({ label: 'Etapa 3', value: 'e3' }), e4: FlowStage({ label: 'Etapa 4', value: 'e4' }),
      fim: FlowStage({ label: 'Encaminhamento', value: 'fim' }),
    } },
  wfa.trigger(trigger.record.created, { $id: Now.ID['flow_regua_ipva_gatilho'] },
    { table: 'x_2326104_cob_regua_inscricao', condition: 'regua.codigo=ipva^status=ativa', run_flow_in: 'background' }),
  (params) => {
    wfa.flowLogic.tryCatch({ $id: Now.ID['ipva_try'] }, {
      try: () => {
        // ---- etapa k (aqui k = 1) ----
        wfa.stage(params.stages.e1)
        const ag1 = wfa.action(agendarEtapa, { $id: Now.ID['ipva_e1_agendar'] },
          { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 1 })
        wfa.flowLogic.if({ $id: Now.ID['ipva_e1_ag_parar'], condition: `${wfa.dataPill(ag1.segue, 'boolean')}=false` },
          () => { wfa.flowLogic.endFlow({ $id: Now.ID['ipva_e1_ag_fim'] }) })
        wfa.flowLogic.waitForADuration({ $id: Now.ID['ipva_e1_esperar'], durationType: 'relative_duration',
          duration: Duration({ seconds: 1 }), relativeOperator: 'after',
          relativeDatetime: wfa.dataPill(ag1.executar_em, 'glide_date_time') })
        const g1 = wfa.action(checarGuardas, { $id: Now.ID['ipva_e1_guardas'] },
          { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
        wfa.flowLogic.if({ $id: Now.ID['ipva_e1_parar'], condition: `${wfa.dataPill(g1.segue, 'boolean')}=false` },
          () => { wfa.flowLogic.endFlow({ $id: Now.ID['ipva_e1_fim'] }) })
        wfa.action(enviarComunicacao, { $id: Now.ID['ipva_e1_enviar'] },
          { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 1 })
        // ---- etapas 2..4: mesmo bloco, com e2..e4, ordem 2..4 e $id ipva_e<k>_* ----

        // ---- fecho ----
        wfa.stage(params.stages.fim)
        const agF = wfa.action(agendarEtapa, { $id: Now.ID['ipva_fim_agendar'] },
          { inscricao: wfa.dataPill(params.trigger.current, 'reference'), ordem: 5 })
        wfa.flowLogic.if({ $id: Now.ID['ipva_fim_ag_parar'], condition: `${wfa.dataPill(agF.segue, 'boolean')}=false` },
          () => { wfa.flowLogic.endFlow({ $id: Now.ID['ipva_fim_ag_fim'] }) })
        wfa.flowLogic.waitForADuration({ $id: Now.ID['ipva_fim_esperar'], durationType: 'relative_duration',
          duration: Duration({ seconds: 1 }), relativeOperator: 'after',
          relativeDatetime: wfa.dataPill(agF.executar_em, 'glide_date_time') })
        const gF = wfa.action(checarGuardas, { $id: Now.ID['ipva_fim_guardas'] },
          { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
        wfa.flowLogic.if({ $id: Now.ID['ipva_fim_parar'], condition: `${wfa.dataPill(gF.segue, 'boolean')}=false` },
          () => { wfa.flowLogic.endFlow({ $id: Now.ID['ipva_fim_fim'] }) })
        wfa.action(escalonar, { $id: Now.ID['ipva_fim_escalonar'] },
          { inscricao: wfa.dataPill(params.trigger.current, 'reference') })
      },
      catch: () => {
        wfa.action(action.core.updateRecord, { $id: Now.ID['ipva_erro'] }, {
          table_name: 'x_2326104_cob_regua_inscricao',
          record: wfa.dataPill(params.trigger.current, 'reference'),
          values: TemplateValue({ status: 'erro', detalhe: 'Erro na execução do Flow; ver detalhes da execução' }),
        })
      },
    })
  })
```

Conferido na F0: `relativeDatetime` por pill direto; `ordem` só como número (`'1'` não compila); stage e `endFlow` dentro do `try`; `values: TemplateValue({...})` no `updateRecord` do `catch`; `Duration({ seconds: 1 })`.

Custom action (as outras três seguem o mesmo molde, com as entradas e saídas de B3):

```ts
import '@servicenow/sdk/global'
import { Action, wfa, actionStep } from '@servicenow/sdk/automation'
import { BooleanColumn, DateTimeColumn, IntegerColumn, ReferenceColumn } from '@servicenow/sdk/core'

export const agendarEtapa = Action({
  $id: Now.ID['regua_acao_agendar'], name: 'Régua: agendar etapa', internalName: 'regua_agendar_etapa',
  description: 'Calcula quando a etapa (ou o fecho, ordem = última + 1) roda; segue=false se a inscrição não está ativa.',
  inputs: {
    inscricao: ReferenceColumn({ label: 'Inscrição', referenceTable: 'x_2326104_cob_regua_inscricao', mandatory: true }),
    ordem: IntegerColumn({ label: 'Ordem', mandatory: true }),
  },
  outputs: { segue: BooleanColumn({ label: 'Segue' }), executar_em: DateTimeColumn({ label: 'Executar em' }) },
}, (params) => {
  const passo = wfa.actionStep(actionStep.script, { $id: Now.ID['regua_acao_agendar_script'], label: 'Agendar' }, {
    required_run_time: 'instance',
    script: Now.include('../../server/regua/acao-agendar-etapa.js'),
    inputVariables: {
      inscricao: { label: 'Inscrição', value: wfa.dataPill(params.inputs.inscricao, 'reference') },
      ordem: { label: 'Ordem', value: wfa.dataPill(params.inputs.ordem, 'integer') },
    },
    outputVariables: { segue: BooleanColumn({ label: 'Segue' }), executar_em: DateTimeColumn({ label: 'Executar em' }) },
  })
  wfa.assignActionOutputs(params.outputs, {
    segue: wfa.dataPill(passo.segue, 'boolean'),
    executar_em: wfa.dataPill(passo.executar_em, 'glide_date_time'),
  })
})
```
