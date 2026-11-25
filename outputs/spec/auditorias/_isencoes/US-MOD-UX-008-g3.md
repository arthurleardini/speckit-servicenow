# Isenção g3 — US-MOD-UX-008

Entregue na fase F2 do design UX v1 (`docs/designs/ux-cobranca-v1.md`): seed manual e rótulos (TASK-MOD-UX-008-01 seed de ciclo, contato e caso em seed-demo/; TASK-MOD-UX-008-02 trilha de etapas em contato, caso e ciclo, rótulos e display). A story não tem o label `fio-condutor` e não tem regra de negócio própria para ATF (modelo, menu, home, seed e rótulos); a prova é o install com contagem, a verificação por papel na instância e os prints.

**Commits:** 8c8784d — seed manual coerente (app/scripts/gerar-seed-demo.mjs → seed-demo/) e trilhas de etapas; e6cb7c5 — taxas parciais explícitas no ciclo do mês do seed manual; 34820de — reinstall ok (contagem 1009 registros) e prints das 35 telas.

**Prints:** `outputs/spec/screens/ux-v1/contato-trilha.png`, `outputs/spec/screens/ux-v1/caso-dossie-trilha.png`, `outputs/spec/screens/ux-v1/ciclo-trilha.png`, `outputs/spec/screens/ux-v1/casos-qualificados.png`.

**Verificação:** `outputs/spec/screens/ux-v1/verificacao.json` — Contagem do reinstall bate com _contagem.json (contato 40, caso 6, ciclo 3); trilha de etapas no topo dos forms do contato, do caso e do ciclo.

<!-- gate:isencao-story -->
story: US-MOD-UX-008
tipo: g3
autor: agente sn-implement (fase F6 do design UX v1, por delegação do usuário)
data: 2026-11-25
motivo: story fora do fio condutor (sem label fio-condutor) e sem regra de negócio a provar por ATF; evidência por reinstall com contagem (sync-log 42–43), verificacao.json e prints em outputs/spec/screens/ux-v1/.
<!-- /gate:isencao-story -->
