# Execução de ponta a ponta da régua IPVA em modo demo (F3, US-MOD-F4-011)

Data: 2026-11-25. Instância dev493801, app `x_2326104_cob`, commit instalado `7c9e4dd` (F2 + F3). Propriedade
`x_2326104_cob.regua.segundos_por_dia = 60` (um «dia» da régua = 1 minuto).

## O que foi feito

Uma inscrição de teste numa régua real fez o Flow «Régua: IPVA» rodar sozinho, do gatilho ao fecho.

- Massa de teste (não é seed), criada por `now-sdk exec` no escopo do app: contribuinte fictício
  «Contribuinte fictício DEMO-E2E F4-011», débito de IPVA em aberto (R$ 1.250,00) e consentimento com **opt-out
  de SMS**. A inscrição foi criada só com contribuinte e régua IPVA (sem ciclo): nasceu ativa, etapa 0,
  iniciada às 17:03:49 UTC.
- Régua IPVA do seed: dia 0 SNE, dia 10 e-mail, dia 20 SMS, dia 30 SNE (encaminhar à cobrança ativa), prazo final 5.
- Acompanhamento do `sys_flow_context` (source_record = inscrição) a cada 30 s até o estado final.
- No fim, a massa de teste foi apagada (4 retornos de envio, 4 comunicações, a inscrição, o consentimento, o
  débito e o contribuinte). A contagem do seed na instância continua igual à `_contagem.json`.

## Resultado

O Flow terminou **COMPLETE** às 17:39:05 UTC, **35 min 16 s** depois do gatilho (alvo do design: fecho no minuto
35, até 40 min). Cada etapa rodou ~4 s depois do horário agendado: a espera por `GlideDateTime` não atrasou
pelo fuso. Os 5 stages («Etapa 1» a «Etapa 4» e «Encaminhamento») ficaram concluídos.

Uma comunicação por etapa, cada uma com um retorno de envio:

| Etapa | Agendada (UTC) | Enviada (UTC) | Canal da etapa | Canal final | Status | Motivo |
|---|---|---|---|---|---|---|
| 1 | 17:03:49 | 17:03:53 | SNE | SNE | Entregue | — |
| 2 | 17:13:49 | 17:14:05 | e-mail | e-mail | Entregue | — |
| 3 | 17:23:49 | 17:24:05 | SMS | **SNE** | Entregue | «SMS: opt-out» (fallback SMS → SNE; o teto não barrou: o último SNE foi 20 min antes) |
| 4 | 17:33:49 | 17:34:05 | SNE | SNE | Entregue | — |
| Fecho | 17:38:49 | 17:39:05 | — | — | — | guardas passaram; «Escalonar» rodou |

Retornos de envio: `sne:entregue` 17:03:53, `email:entregue` 17:14:05, `sne:entregue` 17:24:05,
`sne:entregue` 17:34:05.

**Status final da inscrição: «Ativa», etapa 4, próxima etapa 17:38:49.** O passo «Escalonar» ainda é o mínimo
da F2 (devolve destino vazio e não encerra): o encaminhamento à cobrança ativa, com o contato e o status
«Encerrada — Encaminhada à cobrança ativa», é da US-MOD-F4-012 (F4 do design).

## Evidência

- Detalhes da execução no Flow Designer (stages concluídos, trigger e ações): `outputs/spec/screens/ux-v2/F4-011-execucao-flow-ipva.png`
- Form da inscrição com as comunicações e os retornos de envio (antes da limpeza): `outputs/spec/screens/ux-v2/F4-011-execucao-inscricao.png`
- Contexto: `sys_flow_context` `ab82f8193170d710ae16a79789651b04`, estado COMPLETE (o registro do contexto fica na
  instância; a inscrição de teste foi apagada).
- O Flow Designer avisa que o «Flow reporting» está desligado (`com.snc.process_flow.reporting.level = OFF`):
  os detalhes mostram stages e ações, sem valores de execução.
