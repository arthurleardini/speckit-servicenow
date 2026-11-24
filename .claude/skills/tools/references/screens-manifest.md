# Contrato — `screens-manifest.json`

> **Contrato compartilhado — mora aqui, junto do produtor e dos consumidores.** Produtor: `sn-scaffold` (design v0, item 24), depois do build, com a rota de cada tela na instância; `sn-capture` preenche `screenshot` e `capturedAt`. Consumidores: `fecho-explore` (toda `TEL-` com rota e print), `spec-iterate` (colheita das telas), `spec-report` (visões por tela), `spec-tasks` (`uiContext`), `sn-tasks-github` (print na issue).

No fork ServiceNow **a instância é o protótipo** (design v0, A2): cada `TEL-` da tabela de telas da
`especificacao-funcional.md` vira um form, list ou report da Core UI clássica, e o manifesto aponta
cada uma para a rota na instância e para o PNG. Exemplo completo:
[`screens-manifest.example.json`](screens-manifest.example.json).

## Campos

| Campo | Obrigatório | Regra |
|-------|-------------|-------|
| `screens[].id` | **sim** | `TEL-xxx` da tabela de telas da `especificacao-funcional.md` |
| `screens[].route` | **sim — único** | Rota relativa à instância, iniciando com `/`. List: `/<tabela>_list.do`; form: `/<tabela>.do?sys_id=<sys_id>`, com o `sys_id` do registro demo `Now.ID['<TEL>_registro_demo']` lido do `app/src/fluent/generated/keys.ts`; report: `/sys_report_template.do?jvar_report_id=<sys_id>`. `PENDENTE` no lugar do `sys_id` = o build ainda não rodou |
| `screens[].type` | **sim** | `form`, `list` ou `report` |
| `screens[].role` | **sim** | Role do papel que vê a tela (`<escopo>.coordenador`, `<escopo>.atendente`, …). O `sn-capture` faz *impersonate* do usuário demo dessa role |
| `screens[].table` | recomendado | Tabela ServiceNow da tela |
| `screens[].title` | não | Nome da tela |
| `screens[].screenshot` | não (o `fecho-explore` exige) | Caminho relativo a `outputs/spec/` — `screens/<TEL-ID>.png`; `null` até o `sn-capture` rodar |
| `screens[].capturedAt` | não | Timestamp ISO-8601 da captura, gravado pelo `sn-capture` |
| `version` | recomendado | Versão do contrato (atual: `1`) |
| `generatedBy` | recomendado | `sn-scaffold` |
| `generatedAt` | recomendado | Timestamp ISO-8601 |

## Regras

1. **`id` e `route` são obrigatórios e únicos** no manifesto. A URL completa é
   `SN_SDK_INSTANCE_URL` + `route`; o manifesto não guarda a instância, para sobreviver à troca de
   PDI (CUJ 4).
2. **Rota que mudou perde o print:** quando o `sn-scaffold` regrava o manifesto e a rota de uma
   tela muda, `screenshot` e `capturedAt` voltam a `null` — o print antigo não é mais daquela tela.
3. **Prints** — convenção única do kit ([`paths.md`](paths.md) § «Convenção de screenshots de
   tela»): `outputs/spec/screens/<TEL-ID>.png`, 1440×900, citado aqui **relativo a
   `outputs/spec/`**. No Deliver, `sn-capture --story` grava em
   `outputs/spec/screens/deliver/<STORY>-<TEL>.png`, fora do manifesto.
4. O manifesto é JSON puro (sem comentários); este arquivo é a documentação do contrato.
