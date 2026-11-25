# Isenção g3 — US-MOD-UX-001

Entregue na fase F2 do design UX v1 (`docs/designs/ux-cobranca-v1.md`): contato da lista e menu por área de trabalho (TASK-MOD-UX-001-01 tabela «Contato da lista»; TASK-MOD-UX-001-02 menu «Cobrança MT» e «Minha lista» com filtro e ordem). A story não tem o label `fio-condutor` e não tem regra de negócio própria para ATF (modelo, menu, home, seed e rótulos); a prova é o install com contagem, a verificação por papel na instância e os prints.

**Commits:** 8c8784d — modelo com contato, menu por área e seed coerente (scaffold: tables/contato.now.ts, navigation/menu.now.ts); 34820de — reinstall ok, prints das 35 telas e verificação de home e menu por papel; eef1dfa — GAP-150: campo «Resultado desta ligação» no contato (F6).

**Prints:** `outputs/spec/screens/ux-v1/minha-lista.png`, `outputs/spec/screens/ux-v1/menu-atendente.png`, `outputs/spec/screens/ux-v1/menu-coordenador.png`, `outputs/spec/screens/ux-v1/contato-trilha.png`, `outputs/spec/screens/TEL-034.png`, `outputs/spec/screens/TEL-035.png`.

**Verificação:** `outputs/spec/screens/ux-v1/verificacao.json` — verificacao.json: menu do atendente = «Minha lista», «Meus contribuintes», «Meus indicadores»; «Minha lista» filtra atendente = usuário, status ≠ encerrado e próxima ação até hoje, ordenada por próxima ação e prioridade. ATF das stories que usam o contato (US-MOD-UX-002, 003, 004, 006) verdes.

<!-- gate:isencao-story -->
story: US-MOD-UX-001
tipo: g3
autor: agente sn-implement (fase F6 do design UX v1, por delegação do usuário)
data: 2026-11-25
motivo: story fora do fio condutor (sem label fio-condutor) e sem regra de negócio a provar por ATF; evidência por reinstall com contagem (sync-log 42–43), verificacao.json e prints em outputs/spec/screens/ux-v1/.
<!-- /gate:isencao-story -->
