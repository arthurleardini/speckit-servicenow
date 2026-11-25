# Roteiro da demo: Speckit ServiceNow v0 (piloto 2.6 Cobrança SEFAZ-MT)

Público: diretor da EloGroup. A demo dura cerca de 20 minutos. Todos os dados são fictícios.

## Véspera

1. `npm run doutor`: tudo verde, exceto o `gh` fora do PATH, que é contornado com `GH_BIN`.
2. Regerar o seed manual (ciclos, carteira segmentada, contatos e casos, com datas relativas a hoje): `cd app && node scripts/gerar-seed-demo.mjs`, commitar `app/src/fluent/seed-demo/` e `seed/_contagem.manual.json`, e rodar `node .claude/skills/sn-seed/scripts/gerar-seed.mjs` para juntar a contagem. Sem isso, a «Minha lista» do atendente chega vazia, porque as próximas ações envelhecem (design UX v1, R7).
3. `npm run reinstall`: install ok, contagem igual a `_contagem.json` e suíte `cob-regressao` verde.
4. Entrar na instância com o admin (a PDI é recolhida depois de 10 dias sem login).
5. Abrir as abas da trilha (abaixo) e conferir que a [issue #63](https://github.com/arthurleardini/speckit-servicenow/issues/63) mostra os prints.

## 1. O problema (2 min)

Plano 2.6 Cobrança: 42 RF + 4 transversais e 32 critérios de aceite, hoje sem ligação com a instância. O protótipo antigo tinha visual próprio e o backlog não levava a tela.

## 2. A trilha de um requisito, pronta (8 min, CUJ 1)

RF escolhido: **RF-MOD-F2-002, publicação de versão do critério de qualificação** (fio condutor).

| Passo | Onde | O que mostrar |
|---|---|---|
| Spec | `outputs/spec/requirements/requirements.md` e `business-rules.md` | o RF e as RN (versão publicada é imutável; editar cria versão nova) |
| Teste de aceite | `outputs/spec/test-plan.md` | os CT-MOD-F2 do critério, em linguagem de negócio |
| Backlog | [issue #63](https://github.com/arthurleardini/speckit-servicenow/issues/63) (sub-issue do [épico #10](https://github.com/arthurleardini/speckit-servicenow/issues/10)) | a tela da instância no corpo, as tasks com `snArtifact` e os cenários |
| Código | `app/src/fluent/` (Script Include `CriterioVersao`, business rules, UI Actions) | o `$id` com o ID da spec |
| Instância | [Versão do critério](https://dev493801.service-now.com/x_2326104_cob_criterio.do?sys_id=d5fc10ccc165417891772b280ae1b4c2) | "Publicar versão" bloqueia a edição; "Criar nova versão" |
| Teste | `outputs/spec/auditorias/atf/US-MOD-F2-002.json` + ATF na instância | recibo verde, 13 testes (positivo e negativo por regra) |
| Auditoria | `outputs/spec/auditorias/US-MOD-F2-002.md` | veredito de um revisor sem contexto da implementação |
| Rastreio | `outputs/spec/traceability.json` / `report/tasks.html` | RF em N3, sem órfãos |

Segunda trilha, se houver tempo: **isolamento de carteira** ([issue #68](https://github.com/arthurleardini/speckit-servicenow/issues/68)). Fazer *impersonate* de `demo.atendente` e depois de `demo.atendente2` em [Minha fila](https://dev493801.service-now.com/x_2326104_cob_caso_list.do?sysparm_view=x_2326104_cob_tel_023): cada um vê só os próprios casos.

## 3. Um trecho ao vivo (5 min)

Rodar `npm run reinstall` (sem `--zerar`) e mostrar a linha nova no `outputs/spec/sync-log.md`. Depois `npm run atf -- --suite cob-regressao` e mostrar o recibo atualizado em `outputs/spec/auditorias/atf/cob-regressao.json`.

## 4. Largura (3 min)

Na instância, menu **Cobrança MT**: 21 tabelas, 33 telas na Core UI clássica, 1056 registros fictícios e reports de KPI ([Funil do crédito](https://dev493801.service-now.com/sys_report_template.do?jvar_report_id=1a1426065dd943ab896d646f7625bb90)). No GitHub, 84 issues ([#7](https://github.com/arthurleardini/speckit-servicenow/issues/7) a #90) com prints.

| Situação | Quantidade |
|---|---|
| RF do fio condutor com lógica e ATF (N3) | 5 de 46 |
| Demais RF | estrutura navegável (N1/N2) |
| Integrações (score UFMT, canais, fontes) | simuladas, com rótulo "Simulado" (SIM-01..03) |

## Plano B (offline)

`outputs/spec/report/tasks.html`, com os prints embutidos, e os PNGs em `outputs/spec/screens/`. Use se a instância ou o GitHub não responderem.

## Perguntas previsíveis

| Pergunta | Resposta e onde está |
|---|---|
| De onde vêm os parâmetros de negócio (grupo de controle 10%, ciclo mensal)? | Premissas fictícias do v0, marcadas como premissa (`inputs/premissas-ficticias.md`, GAP-001..005) |
| E as integrações reais? | Fora do v0; tabelas `SIM-` simulam score, canais e fontes |
| Quanto disso o agente fez sozinho? | Spec, app, testes, backlog e auditorias saíram das skills do kit; as decisões de produto ficam com o consultor |
