# Isenção g3 — US-MOD-UX-009

A story é da UX v2 (design `docs/designs/ux-cobranca-v2-regua-flow.md`, fase F1) e não tem o label `fio-condutor`: dispensa só os validadores LLM. Build, install e ATF continuam obrigatórios.

<!-- gate:isencao-story -->
story: US-MOD-UX-009
tipo: g3
autor: agente sn-implement (fase F1 do design UX v2, por delegação do usuário)
data: 2026-11-25
motivo: story fora do fio condutor (sem label fio-condutor); a regra do sn-implement § G2b reserva o G3 com LLM ao fio condutor. Cobertura por ATF de servidor, de form e de script de UI com recibo em outputs/spec/auditorias/atf/US-MOD-UX-009.json, verificação por Playwright e auditoria-de-us independente.
<!-- /gate:isencao-story -->
