# Isenção g3 — US-MOD-F4-014

A story é da UX v2 (design `docs/designs/ux-cobranca-v2-regua-flow.md`, fase F5) e não tem o label `fio-condutor`: dispensa só os validadores LLM. Build, install e ATF continuam obrigatórios.

<!-- gate:isencao-story -->
story: US-MOD-F4-014
tipo: g3
autor: agente sn-implement (fase F5 do design UX v2, por delegação do usuário)
data: 2026-11-25
motivo: story fora do fio condutor (sem label fio-condutor); a regra do sn-implement § G2b reserva o G3 com LLM ao fio condutor. Cobertura por ATF de servidor e de form com recibo em outputs/spec/auditorias/atf/US-MOD-F4-014.json, verificação por Playwright impersonando demo.coordenador (prints em screens/ux-v2/F4-014-*.png) e auditoria-de-us independente.
<!-- /gate:isencao-story -->
