# Stage 8 — Intermediate Zoom Out

**Alvo:** `docs/designs/speckit-servicenow-v0.md` (l. 1–591)
**Insumos:** `review/zoom_out_report.md`, `review/comprehension_report.md`, `review/critic_report.md`

| Revisor | Status |
| --- | --- |
| `egm-zoom-out` (opus) | concluído |

**Contagem:** 🔴 3 · 🟡 9 · 🟢 3

Este relatório traz só achados novos ou de conciliação entre os três relatórios anteriores. Juntos, eles somam cerca de 60 propostas.

Fatos conferidos nas fontes:
- `RF-MOD-F2-003` e `RF-MOD-T-001` casam com a regex do kit (`harness-claude/.claude/hooks/kit.mjs` l. 704).
- O SDK documenta `cicd testsuite run`, `cicd test run` e `build --frozenKeys` (`/tmp/sdkpkg/package/docs/configuration/ci-integration.md` l. 17–57 e 291–304).
- O `keys.ts` liga cada `Now.ID` ao sys_id e é versionado no git.

Não verificado: `referencias/31-backlog-e-instancia.md` ficou fora das fontes liberadas, então o Z8-13 fica condicionado a ele.

## Achados

### 🔴 Z8-1. A trava da zona (B1) e o estágio dividido (M15) não definem quando o lock nasce
- **Onde:** zoom_out B1 × M15; doc A1 (l. 97), itens 1 e 35, l. 581.
- **Problema:** o B1 gera o lock "no fim do Estágio 1". O M15 divide o Estágio 1 e põe o piloto (itens 23–30 e 37–42) antes do endurecimento. Com as duas propostas juntas, o fio condutor inteiro roda em modo template, e o agente pode alterar qualquer hook durante a demo.
- **Correção:**
  - A A1 diz que o modo template dura até o fim do bloco de endurecimento.
  - O lock é gerado uma vez, ali, e só o ensaio final e a demo rodam travados.
  - O item 35 deixa de dizer "depois de cada bloco".

### 🔴 Z8-2. Duas regras opostas para o `--reinstall` no mesmo relatório
- **Onde:** zoom_out M6 × N6; doc item 30 (l. 474), item 7 (l. 272).
- **Problema:** o M6 libera o `--reinstall` sem confirmação até o `fecho-explore`. O N6 quer que ele continue pedindo confirmação.
- **Correção:**
  - Uma regra só: o `--zerar` sempre pede confirmação.
  - Com o critic N2 (`keys.ts` com `deleted: true` no install incremental), o `--zerar` passa a ser raro.
  - Sai a exceção "sem confirmação até o fecho-explore".

### 🔴 Z8-3. O B2 (seed) e o critic M5 (CPF real) são o mesmo mecanismo
- **Onde:** zoom_out B2 × critic M5; doc A9 (l. 105), NFR Sigilo (l. 226), item 25.
- **Problema:** propostas em separado, viram duas coisas:
  - a lista de documentos gerados que o gate confere (B2);
  - a faixa sentinela ou a máscara na UI (critic M5).

  A máscara mexe em form, list e print de todas as telas, o que é escopo novo.
- **Correção:**
  - O `sn-seed` gera CPF e CNPJ numa faixa sentinela documentada.
  - O gate do Explore confere que todo documento do seed cai nessa faixa.
  - O `check_sensivel.py` continua nos demais caminhos.
  - A opção de máscara sai.

### 🟡 Z8-4. O recibo de ATF (M3) torna o `traceability.live.json` (M4) desnecessário
- **Onde:** zoom_out M3 × M4; doc l. 161, item 33, item 42 (l. 573–576).
- **Problema:** surgem três artefatos para o mesmo fato:
  - o recibo versionado por story (`outputs/spec/auditorias/atf/<STORY>.json`);
  - um arquivo vivo para o ATF e o nível;
  - uma cópia offline para o plano B.
- **Correção:**
  - A `promocao.mjs` lê a coluna `atf` dos recibos, e os `sysIds` saem do `keys.ts`.
  - Nada consulta a instância ao montar a matriz.
  - Saem o `traceability.live.json` e a cópia offline.
  - O plano B do item 42 usa o próprio `traceability.json`.

### 🟡 Z8-5. Com o M12 adotado, a gramática nova perde o sentido
- **Onde:** zoom_out M12 × zoom_out M1 (último bullet) × comprehension #8 × critic N10 (2º bullet); doc A7, itens 18 e 38.
- **Problema:** três relatórios pedem `RF-T-<nn>` e `RF-F<n>-<nn>` na gramática. O formato nativo do M12 já aceita `RF-MOD-F2-003` e `RF-MOD-T-001` (`kit.mjs` l. 704).
- **Correção:**
  - Adotar o M12.
  - Descartar a mudança de gramática para RF no zoom M1, no comprehension #8 e no item 18. Fica só `CT-` e `SIM-`, se não houver família nativa para eles.
  - O N10 deixa de se aplicar.

### 🟡 Z8-6. O M7 tira parte do motivo de rejeição da Alternativa A
- **Onde:** zoom_out M7 × critic M1 (exemplo da A); doc Alternativa A (l. 171), A6.
- **Problema:** sem valores novos no enum `Task.type`, o enum deixa de ser algo que "a camada não alcança". Mesmo assim, o texto sugerido no critic M1 ainda o cita.
- **Correção:**
  - Tirar o enum dos contras da Alternativa A e do exemplo do critic M1.
  - Os demais pontos continuam sustentando a decisão: `fecho-explore`, rule de frontend e checklists.
  - Reescrever a A6 como "campo `snArtifact.kind`".

### 🟡 Z8-7. O M8 cria roteamento e categoria nova quando bastaria nomear a isenção
- **Onde:** zoom_out M8 × comprehension #11 × critic N10 (1º bullet); doc l. 163, itens 29 e 32.
- **Problema:** o M8 acrescenta roteamento por tipo no `roteador.mjs`, o estado "verificado por gerador" e um teto de tokens por story. O doc já limita o G3 pela label `fio-condutor`.
- **Correção:**
  - Uma tabela de três linhas diz o que cada tipo de story exige: G3, build/install, ATF de servidor, ATF de form.
  - Ganham nome duas isenções: de G3 e de ATF de form.
  - Saem a mudança de roteamento e o teto de tokens.

### 🟡 Z8-8. O wrapper do N6 duplica um script que já existe
- **Onde:** zoom_out N6 × doc item 5 (script `reinstall`) e item 30.
- **Problema:** o `npm run install-app` proposto confere alias, prefixo e sigilo. O `sn-reinstall` sem `--zerar` já confere o prefixo e é idempotente.
- **Correção:**
  - Liberar sem confirmação o `npm run reinstall` do item 5, com a checagem de faixa do Z8-3.
  - O `sn-implement` instala por esse script.
  - Não criar wrapper novo.

### 🟡 Z8-9. O agendamento do M10 é mecanismo novo para um risco do dia da demo
- **Onde:** zoom_out M10 × critic C2; doc NFR Volatilidade (l. 228), item 42.
- **Problema:** o `doutor --manter-viva` diário põe a credencial de admin num agendamento. Isso vai contra o critic M6, em que só três scripts tocam a credencial.
- **Correção:**
  - Ficar só com o "reinstall completo na véspera" no roteiro do item 42.
  - A reclamação da PDI vira uma linha na tabela de riscos do C2.
  - O agendamento sai.

### 🟡 Z8-10. O C1 do critic pede usuário com senha por role, mas o impersonate basta
- **Onde:** critic C1 × critic M6; doc A10, item 26, l. 158.
- **Problema:** logar como usuário de seed exige senha em `Record()` e mais credenciais no `.env`, o que amplia o M6.
- **Correção:**
  - O seed cria um `sys_user` demo por role, sem senha.
  - A `sn-capture` entra como admin e faz impersonate do usuário do papel, que já consta na tabela de telas.
  - O `capturedAs` repete o papel e pode sair.

### 🟡 Z8-11. Os testes de viabilidade estão espalhados em quatro propostas
- **Onde:** zoom_out M2 e M11 (repositório privado) × critic M4 (report clássico) e M7 (nomes de tabela); doc item 9.
- **Problema:** cada proposta acrescenta uma checagem própria ao Estágio 0.
- **Correção:** o item 9 vira um único teste descartável, com desfecho registrado para cada checagem:
  1. `cicd test run` executa os testes de servidor e de form, com um terceiro desfecho para quando nada roda;
  2. `sys_report` via `Record()` aparece no UI16;
  3. o PNG aparece numa issue do repositório privado para quem vai assistir à demo;
  4. o nome de tabela mais longo cabe em 30 caracteres.

  O `sn-atf-runner` do M2 só entra se a checagem 1 mostrar que o form não roda. O glossário de abreviações do critic M7 sai.

### 🟡 Z8-12. O documento ganha seções enquanto o plano encolhe
- **Onde:** critic C2 e M3; comprehension #5, #6 e #10.
- **Problema:** propostas em separado, viram seis estruturas novas: tabela de riscos, CUJ 5, CUJ 6, Referências, glossário e tabela de estágios.
- **Correção:**
  - Referências e glossário viram uma seção só.
  - A tabela de estágios é a própria divisão do M15 (Estágio 0 / caminho da demo / endurecimento), com critério de saída.
  - A tabela de riscos fica só com os riscos do dia da demo, e cada linha aponta para um item que já existe.
  - Entra o CUJ 5 (G3).
  - O CUJ 6 sai, porque a l. 33 já tira o G6 do critério de pronto. O critic N7 se resolve dizendo isso no G6.

### 🟢 Z8-13. O M11 traz extras sem necessidade
- **Onde:** zoom_out M11 × critic M8.
- **Correção:**
  - Ficar com o permalink por SHA, que custa uma linha no publicador.
  - Saem a recaptura por hash e o LFS.
  - A atualização do `gh` (critic M8) fica registrada como alternativa, sem adoção. Condicionado à fonte 31, que não foi lida.

### 🟢 Z8-14. Com o M13, o Verification Plan e o CUJ 2 ficam desalinhados
- **Onde:** doc l. 77 e l. 583.
- **Correção:** a idempotência passa a ser conferida pelo marcador `<!-- logical-id -->` com o `id-map.json`, e não pela contagem por label. O "label `logical-id`" sai do CUJ 2.

### 🟢 Z8-15. O M9 vai além do necessário
- **Onde:** zoom_out M9.
- **Correção:**
  - Manter a leitura do escopo de `app/now.config.json`.
  - O teste que reprova o literal dentro de `.claude/` sai, porque o G6 está fora do critério de pronto.

## Conjunto mínimo coerente de mudanças

1. **Ciclo da zona:**
   - B1 com o ajuste do Z8-1: lock gerado uma vez, no fim do endurecimento.
   - Junto com o M14: o commit base recebe a tag `base-harness-2.6.0`, o `ORIGEM.md` fica sem hashes e o `doutor` só confere template ou clone.
2. **Ordem do trabalho:** M15 (caminho da demo antes do endurecimento) serve como a tabela de estágios do comprehension #10.
3. **Tamanho do fork:**
   - M5 junto com o M15.
   - Sai a `sn-api-contracts`.
   - O item 31 fica só com as cópias que de fato mudam de conteúdo.
4. **Tipos:**
   - M7: `snArtifact.kind`, sem o item 22.
   - Ajustar a Alternativa A e o critic M1 (Z8-6).
   - Sai o roteamento do M8.
5. **IDs:** M12. Sai a mudança de gramática para RF do zoom M1, do comprehension #8 e do critic N10 (Z8-5).
6. **Modelo de dados:**
   - M6 sem a prévia descartável sem confirmação.
   - Junto com o critic N2 (`keys.ts` com `deleted: true`).
   - Regra única para o `--zerar` (Z8-2).
7. **ATF e rastreio:**
   - Q2 reescrita do M2 (`cicd test run`, com terceiro desfecho) e recibo do M3.
   - Do M4, só a parte estática (rf, ct, tel, story, tasks, nowIds, `keys.ts`), com o ATF lido dos recibos.
   - Saem o `traceability.live.json` e o `sn-atf-runner`.
   - Definir N1, N2 e N3.
8. **Isenções:** tabela de três linhas (Z8-7), que junta o M8, o comprehension #11 e o critic N10.
9. **Seed e sigilo:**
   - B2 e critic M5 viram uma faixa sentinela conferida pelo gate.
   - A máscara sai (Z8-3).
10. **Prints:**
    - Critic C1 com impersonate e usuários demo sem senha (Z8-10).
    - Permalink por SHA do M11.
    - Critic M8 só como alternativa registrada.
11. **Backlog:** M13, com ajuste da l. 77 e da l. 583 (Z8-14).
12. **Credencial e instalação:**
    - Critic M6 (`permissions.deny`) e zoom N3 (variáveis `SN_SDK_*`).
    - O N6 vira liberar o `npm run reinstall` (Z8-8).
13. **Estágio 0:** o item 9 vira um teste de viabilidade com quatro checagens (Z8-11). Ele absorve o M2, o critic M4, o critic M7 e o M11.
14. **Escopo:**
    - M9 só com a leitura de `now.config.json` (Z8-15).
    - Escolher o sufixo do app antes do item 6.
15. **Documento:**
    - Entram como estão:
      - zoom: M1 (menos o RF-T), N1, N2 e N4;
      - comprehension: #1–#4, #7, #9 e #12–#17;
      - critic: M1 (ajustado), M2, N1 e N3–N11.
    - Referências e glossário numa seção só.
    - Tabela de riscos curta, só com o dia da demo. O M10 entra como uma linha de risco e como reinstall na véspera.
    - Entra o CUJ 5 e sai o CUJ 6.
    - A l. 163 remete ao item 32 (N5).
