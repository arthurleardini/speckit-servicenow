# Execução de ponta a ponta da régua IPVA até o escalonamento (F4, US-MOD-F4-012)

Data: 2026-11-25. Instância dev493801, app `x_2326104_cob`, commit instalado `b7b589b` (F4). Propriedade
`x_2326104_cob.regua.segundos_por_dia = 60` (um «dia» da régua = 1 minuto).

## O que foi feito

Uma inscrição de teste na régua real IPVA fez o Flow «Régua: IPVA» rodar sozinho do gatilho ao fecho, e o fecho
escalonou de verdade para a cobrança ativa.

- Massa de teste (não é seed), criada por `now-sdk exec` no escopo do app: contribuinte fictício
  «Contribuinte fictício DEMO-E2E F4-012» da carteira de `demo.atendente`, débito de IPVA em aberto (R$ 1.250,00) e
  consentimento com **opt-out de SMS**. A inscrição foi criada com contribuinte, régua IPVA e o último ciclo
  publicado («Ciclo 2026-11», onde o contribuinte não tinha contato): nasceu ativa às 18:37:59 UTC.
- Régua IPVA do seed: dia 0 SNE, dia 10 e-mail, dia 20 SMS, dia 30 SNE (encaminhar à cobrança ativa), prazo final 5.
- Acompanhamento do `sys_flow_context` (source_record = inscrição) a cada 30 s até o estado final.
- No fim, a massa de teste foi apagada (4 retornos de envio, 4 comunicações, o contato criado pela régua, a inscrição,
  o consentimento, o débito e o contribuinte).

## Resultado

O Flow terminou **COMPLETE** às 19:13:35 UTC, **35 min 36 s** depois do gatilho (alvo do design: fecho no minuto 35,
até 40 min). Uma comunicação por etapa, cada uma com um retorno de envio:

| Etapa | Enviada (UTC) | Canal da etapa | Canal final | Status | Motivo |
|---|---|---|---|---|---|
| 1 | 18:38:03 | SNE | SNE | Entregue | — |
| 2 | 18:48:35 | e-mail | e-mail | Entregue | — |
| 3 | 18:58:35 | SMS | **SNE** | Entregue | «SMS: opt-out» |
| 4 | 19:08:35 | SNE | SNE | Entregue | — |
| Fecho | 19:13:35 | — | — | — | guardas passaram; «Escalonar» rodou |

**Escalonamento comprovado.** Às 19:13:35 o passo «Escalonar» criou o contato `d040991193f8d7107a57f7c4b503d62a`:
`origem = regua`, `status = a_ligar`, atendente `demo.atendente`, ciclo «Ciclo 2026-11», `inscricao` = a inscrição de
teste, «O que fazer agora» = «Ligar e registrar o resultado». A inscrição ficou **«Encerrada — Encaminhada à cobrança
ativa»**, com `encerrada_em` 19:13:35 e o campo «Contato da cobrança ativa» preenchido.

Impersonando `demo.atendente`, a lista «Minha lista» (filtro do módulo) trouxe o contribuinte DEMO-E2E F4-012 na
primeira linha, com «Ligar e registrar o resultado» (6 contatos na lista).

## Evidência

- Detalhes da execução no Flow Designer: `outputs/spec/screens/ux-v2/F4-012-execucao-flow-ipva.png`
- Form da inscrição encerrada, com o contato, as comunicações e os retornos: `outputs/spec/screens/ux-v2/F4-012-execucao-inscricao.png`
- «Minha lista» do atendente com o contato criado pela régua: `outputs/spec/screens/ux-v2/F4-012-minha-lista-atendente.png`
- Form do contato com origem «Régua» e a inscrição: `outputs/spec/screens/ux-v2/F4-012-contato-origem-regua.png`
- Contexto: `sys_flow_context` `7e188d51ccb8d7107a026e8319e966a7`, estado COMPLETE (o registro do contexto fica na
  instância; a massa de teste foi apagada).
