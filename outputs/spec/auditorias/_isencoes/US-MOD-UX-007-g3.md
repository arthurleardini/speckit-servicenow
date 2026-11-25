# Isenção g3 — US-MOD-UX-007

Entregue na fase F2 do design UX v1 (`docs/designs/ux-cobranca-v1.md`): home por papel e relatórios (TASK-MOD-UX-007-01 preferência de página inicial nos usuários demo; TASK-MOD-UX-007-02 TEL-026..028 e TEL-029 como módulos da área Analytics). A story não tem o label `fio-condutor` e não tem regra de negócio própria para ATF (modelo, menu, home, seed e rótulos); a prova é o install com contagem, a verificação por papel na instância e os prints.

**Commits:** 8c8784d — homes por papel no modelo (seed/_homes.now.ts) e módulos de report no menu; 34820de — reinstall ok (contagem: 3 preferências my_home_navigation_page) e verificação de home e menu por papel.

**Prints:** `outputs/spec/screens/ux-v1/home-atendente.png`, `outputs/spec/screens/ux-v1/home-coordenador.png`, `outputs/spec/screens/ux-v1/menu-coordenador.png`, `outputs/spec/screens/TEL-026.png`, `outputs/spec/screens/TEL-027.png`, `outputs/spec/screens/TEL-028.png`, `outputs/spec/screens/TEL-029.png`.

**Verificação:** `outputs/spec/screens/ux-v1/verificacao.json` — verificacao.json: urlHome do atendente abre «Minha lista»; a do coordenador abre «Casos qualificados»; o menu do coordenador traz «Funil do crédito», «Regularizações por tributo» e «Regularizações por origem e canal».

<!-- gate:isencao-story -->
story: US-MOD-UX-007
tipo: g3
autor: agente sn-implement (fase F6 do design UX v1, por delegação do usuário)
data: 2026-11-25
motivo: story fora do fio condutor (sem label fio-condutor) e sem regra de negócio a provar por ATF; evidência por reinstall com contagem (sync-log 42–43), verificacao.json e prints em outputs/spec/screens/ux-v1/.
<!-- /gate:isencao-story -->
