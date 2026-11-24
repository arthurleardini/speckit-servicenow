# Stage 5 — Initial Zoom Out Review

Revisão do estágio 5 (Zoom Out inicial) feita: 2 Blockers, 15 Majors, 7 Nits. Os dois revisores terminaram (egm-zoom-out: completed; egm-inventive-catalyst: completed; ambos em opus). Os achados repetidos entre os dois foram juntados num só.

Alvo: /config/workspace/10-elogroup/deliversuiteServiceNow/docs/designs/speckit-servicenow-v0.md (linhas 1–591). Nenhum dado de contribuinte aparece abaixo.

---

## 🔴 Blocker

**B1. O fork bate na zona imutável do harness e o item 35 não consegue regenerar o lock**
- **Revisor:** inventive-catalyst
- **Onde:** A1 (l. 97), item 1 (l. 239–242), item 35 (l. 518–521), Estágio 1 (itens 10–36)
- **Problema:** o item 1 faz o commit do zip como veio, com `harness-zona.lock.json` na raiz. Com isso, `zonas.mjs` (`souOTemplate`, `manifestoNoHead`) trata o repositório como **clone**. Num clone, o hook impede o agente de escrever em:
  - `CLAUDE.md`
  - `.claude/hooks/`, `.claude/ferramentas/`, `.claude/settings.json`, `.claude/templates/`, `.claude/rules/harness/`
  - agentes e skills que estão no manifesto (`kit.mjs`, l. 157–167, constante ZONA_IMUTAVEL)

  São justamente os arquivos que os itens 7, 8, 10–22 e 31–36 alteram. O `empacotar.mjs`, citado no item 35, também não regenera o lock:
  - recusa rodar sem `.harness-template`;
  - exige árvore limpa e a tag `v<versão>`;
  - grava o manifesto dentro do zip, não na raiz.

  Criar o marcador num clone também é negado, e apagar o lock não destrava enquanto ele estiver no HEAD (`zonas.mjs` l. 442–447).
- **Correção:**
  - No Estágio 1, tratar o repositório como **template**: o primeiro commit vai sem o lock, e o FDE cria `.harness-template` pelo terminal (como manda o MANUTENCAO.md). A garantia nessa fase é `npm test` a cada commit.
  - No fim do Estágio 1, gerar o manifesto do fork uma vez com `montarManifesto` (de `verificar-zona.mjs`), fazer o commit e remover o marcador. Os estágios 2 em diante rodam travados.
  - Reescrever A1 e os itens 1 e 35 com esse ciclo.
  - Incluir no `doutor` (item 8) a checagem "modo template ou clone".
  - Custo: durante o Estágio 1 o agente pode alterar qualquer hook.

**B2. O gate de sigilo vai barrar o seed sempre ou não protege nada**
- **Revisor:** zoom-out
- **Onde:** l. 159 (gate do Explore), l. 226 (NFR Sigilo), item 16 (l. 353), item 25 (l. 426–429), Verification Plan (l. 586)
- **Problema:** o `/config/workspace/scripts/check_sensivel.py` dá 7 pontos por CPF formatado, até o teto de 55. Soma mais 20 com 3 ou mais termos fiscais, e um seed de cobrança vai ter esses termos. O desconto de "mock" só vale com até 3 CPFs.
  - Um seed de 50 a 300 registros por tabela passa de 40, e o `fecho-explore` nunca libera.
  - A saída fácil é gravar o CPF sem pontuação, porque a regex exige separador. Aí o gate passa sempre e não verifica nada.
- **Correção:**
  - No seed, a `sn-seed` grava a lista dos documentos que gerou a partir da semente fixa, e o gate confere que todo documento do seed está nessa lista.
  - O `check_sensivel.py` continua valendo para `inputs/`, `outputs/*.md` e o corpo das issues.
  - Ajustar juntas as l. 159, 226, 353, 429 e 586.

---

## 🟡 Major

**M1. Contradições internas e referências erradas**
- **Revisores:** os dois
- **Problema e correção:**
  - O `validador-escopo-app` aparece como Non-Goal (l. 55), mas é criado nas l. 116, 491 e 501. Tirar dos Non-Goals.
  - A l. 55 fala em `sn-estimate`, mas o item 31 (l. 489) diz que ela não existe, e o item 22 altera o `forecast.mjs` da `spec-estimate`. Reescrever como "spec-estimate só com o mapeamento de tipos do item 22".
  - O item 9 (l. 291) diz "`delivery-gate`, item 32". O certo é item 19.
  - O item 42 (l. 571) cita "Q4", mas só existem Q2 e Q3 (l. 60–63). Renumerar ou explicar por que Q1 e Q4 sumiram.
  - O item 38 (l. 538) cria `RF-T-<nn>`, que não está na gramática do item 18 (l. 370), e o G1 (l. 37) depende dela. Incluir a família no item 18.

**M2. ATF de form: existe um caminho oficial e falta um terceiro desfecho no item 9**
- **Revisores:** os dois
- **Onde:** Q2 (l. 62), item 9 (l. 288–295), item 19 (l. 375), item 30 passo 4 (l. 471), `sn-status-report` (l. 487)
- **Problema:**
  - O SDK documenta `now-sdk cicd testsuite run … -o json` e `cicd test run`, que saem com erro quando o teste falha (`/tmp/sdkpkg/package/docs/configuration/ci-integration.md`, l. 216–304).
  - Os passos de form precisam de um Client Test Runner aberto num navegador (`atf-guide.md`, l. 494), e o kit já tem Playwright logado na instância (A10, item 26).
  - O item 9 só prevê dois desfechos e deixa de fora o caso em que nenhum dos dois testes roda.
- **Correção:**
  - Reescrever a Q2 como "confirmar que `now-sdk cicd test run` executa testes de servidor e de form na PDI".
  - Usar esse comando no `delivery-gate`, no `sn-reinstall` e no `sn-status-report`.
  - Opção para o form: o `sn-capture` (ou um `sn-atf-runner`) abre o Client Test Runner num Chromium sem tela, com a mesma sessão. O custo é instabilidade de sessão e timeout.
  - Acrescentar o terceiro desfecho e a regra do gate para ele.

**M3. O gate confia num resultado de ATF escrito pelo próprio agente**
- **Revisor:** inventive-catalyst
- **Onde:** item 19 (l. 375), CUJ 3 (l. 83), item 16 (l. 352), Verification Plan (l. 582)
- **Problema:** o gate lê o resultado no `sync-log.md`, que é texto escrito pelo agente que ele deveria fiscalizar. O rastreio já lê o ATF da instância (l. 161, 509), então há duas fontes para o mesmo fato.
  - O item 16 usa "posterior à última alteração", que depende da data do arquivo, e o checkout do git muda essa data.
- **Correção:**
  - Um único leitor (o próprio `cicd test run` de M2, ou `sys_atf_result` via `now-sdk query -o json`) grava um recibo em `outputs/spec/auditorias/atf/<STORY>.json` com sys_id, horário, status e commit.
  - O `delivery-gate` e a `promocao.mjs` passam a ler esse recibo. Se a instância estiver fora do ar, o gate reprova com mensagem clara.
  - No item 16, comparar o commit do install com `git log -1 -- app/src/fluent`. O commit já está na linha nova do item 18 (l. 370).
  - Custo: o push passa a depender de a instância responder.

**M4. `traceability.json` mistura gate estático com dado vivo e duplica o que já existe**
- **Revisores:** os dois
- **Onde:** G1 (l. 37), A7 (l. 103), l. 161, item 33 (l. 507–511), Verification Plan (l. 585)
- **Problema:**
  - O mesmo arquivo é gate do Plan e painel vivo do Deliver. Cada consulta à instância muda o arquivo versionado, e o gate passa a depender da instância estar no ar.
  - Os `sysIds` já estão no `src/fluent/generated/keys.ts`, que o build gera e que vai para o git (ci-integration.md, l. 19–45).
  - O `promocao.mjs` já calcula órfãos e cobertos (l. 505–640). O `tasks.json` já tem `sourceRefs`, e o `data-model.json` já tem `traceability[]` com `check-traceability.mjs`.
  - Os níveis N1, N2 e N3 (l. 509, 585) não estão definidos.
- **Correção:**
  - Parte estática, versionada e usada pelo gate: rf, ct, tel, story, tasks e nowIds, montada a partir do que já existe, mais o `keys.ts`.
  - Parte viva gerada sob demanda (`traceability.live.json`): atf e nível, com data e alias. É a que a demo abre (l. 573), e uma cópia entra no plano B offline.
  - Tirar `sysIds` por `now-sdk query`.
  - Definir N1, N2 e N3.

**M5. Fork maior que o necessário (cópias `sn-*` e alterações na zona)**
- **Revisores:** os dois
- **Onde:** Alternativa A (l. 168–172), A5 (l. 101), Componentes (l. 114), itens 15–18, 23–31 e 36, Non-Goals (l. 58)
- **Problema:**
  - O plano mantém as `spec-*` intactas e cria espelhos `sn-*`. Cada espelho obriga a mexer em `kit`, `cadeia`, `fecho-explore`, `sync-log`, `gramatica`, nos testes (wiring, vendorizacao, skills-prosa) e no lock. O agente fica com duas skills para a mesma etapa.
  - O harness já trata como **extensão do projeto** (regra `ehExtensaoDoProjeto`, `zonas.mjs` l. 182–243) a skill ou o agente novo que não está no manifesto.
- **Correção:**
  - Criar as `sn-*` realmente novas (`scaffold`, `seed`, `capture`, `tasks-github`, `reinstall`, `implement`) e o `validador-escopo-app` como extensões.
  - Quando a mudança numa etapa existente for só de conteúdo, alterar a `spec-*` no lugar. No mínimo, tirar do fork as `spec-*` que ganharam espelho.
  - O fork de verdade fica só nos hooks, no schema `tasks/v5.4`, nas rules, no `roteador.mjs` e nas remoções do item 27.
  - Custo: duas categorias de arquivo para explicar, e as extensões ficam sem a proteção da zona.

**M6. "Prévia × final" com diff e migração custa caro numa PDI descartável**
- **Revisores:** os dois
- **Onde:** l. 143, l. 160, item 14 (l. 336), item 23 (l. 406–407), item 30 (l. 474)
- **Problema:** a regra "renomear coluna gera NEW + migração no seed" vale desde a prévia. O lixo da exploração (colunas órfãs, pares NEW/ALTER) chega ao app final. O Fluent é declarativo, o `$id` é estável e a instância pode ser zerada.
- **Correção:**
  - Até o `fecho-explore`, a instância é descartável e o `--reinstall` roda sem confirmação.
  - No Plan, o `sn-data-model` final reescreve os `Table()`. Se quebrar o install incremental, usar `--zerar`.
  - Tirar do v0 o `data-model.diff.json` e a regra de migração (proposta do zoom-out), ou fazê-los valer só depois do `fecho-explore` (proposta do catalyst).
  - Custo: reinstalar do zero a cada ciclo e recapturar prints.

**M7. 17 valores novos no enum `Task.type`**
- **Revisor:** zoom-out
- **Onde:** A6 (l. 102), itens 20–22 (l. 377–398)
- **Problema:** os 17 tipos forçam mudanças no schema, em 3 validadores, no `forecast`, no `detect-phase` e no `collect-code`. O item 22 só remapeia esses tipos para as camadas que já existem.
- **Correção:** manter os tipos atuais e levar o tipo de objeto ServiceNow em `snArtifact.kind`. O item 22 sai, e os validadores só exigem `snArtifact` quando ele estiver presente.

**M8. A isenção do G3 fora do fio condutor aparece para o diretor como "não validado"**
- **Revisor:** inventive-catalyst
- **Onde:** NFR Custo de tokens (l. 229), l. 163, item 29 (l. 462)
- **Problema:** boa parte do que fica fora do fio condutor (tabela, form, list, menu, role, seed, acl-base) sai de forma determinística dos geradores. Passar isso por um validador LLM é custo sem ganho, e a isenção aparece para o diretor como "não validado".
- **Correção:**
  - O `roteador.mjs` (item 32) roteia pelo tipo da task, ou pelo `snArtifact.kind` de M7.
  - Tipos gerados passam por verificação determinística (`validate-data-model`, lint RN-SN [AUTO], testes do gerador, ATF de servidor) e aparecem como "verificado por gerador".
  - O G3 com LLM fica para código escrito à mão (BR, flow, script include, UI Action, ACL de carteira), com teto de tokens por story.

**M9. Prefixo `2326104` fixo dentro do kit, o que contradiz G6**
- **Revisor:** inventive-catalyst
- **Onde:** G6 (l. 47), l. 164, itens 23 (l. 405), 24 (l. 416), 30 (l. 468) e 34 (l. 516)
- **Problema:** o literal `x_2326104_cobmt` aparece em validadores e roles. A única reação a um prefixo diferente é parar (CUJ 4, l. 89).
- **Correção:**
  - Skills e validadores leem o escopo de `app/now.config.json` ou de `SN_SCOPE_PREFIX` (já no `.env.example`, l. 257).
  - O literal fica só em `app/`, `inputs/` e `outputs/`.
  - Um teste reprova se achar o literal dentro de `.claude/`.

**M10. A PDI reclamada só é tratada depois que acontece**
- **Revisor:** inventive-catalyst
- **Onde:** NFR Volatilidade (l. 228), CUJ 4 (l. 85–89), item 42 (l. 576)
- **Correção:**
  - Um `doutor --manter-viva` diário: login pelo Playwright mais `sn-reinstall --verificar`, sem instalar.
  - Incluir no roteiro do item 42 um `sn-reinstall` completo no dia anterior à demo.
  - Custo: a credencial passa a ser usada por um agendamento.

**M11. O print no backlog aponta para `main`, que muda**
- **Revisor:** inventive-catalyst
- **Onde:** l. 162, item 26 (l. 434), item 28 (l. 451)
- **Problema:** quando o print é recapturado, as issues antigas passam a mostrar outra tela, o que quebra o CUJ 1 (l. 71). Cada PNG novo também faz o repositório crescer.
- **Correção:**
  - Usar permalink com o SHA do commit (`blob/<sha>/…`) no `sn-tasks-github` e no comentário de entrega (item 29).
  - Recapturar só quando o hash da imagem mudar. Git LFS é opcional.
  - No Estágio 0, confirmar que a imagem aparece numa issue de repositório **privado** para quem vai assistir à demo.

**M12. A família `RF-F<n>-<nn>` duplica o formato nativo `RF-MOD-<MÓD>-NNN`**
- **Revisor:** zoom-out
- **Onde:** A7 (l. 103), item 18 (l. 370), item 33 (l. 507), item 38
- **Correção:**
  - Usar `RF-MOD-F2-003`, já reconhecido por `promocao.mjs` (l. 288–378) e `gramatica.mjs`. O `de-para-ids.md` continua mapeando os IDs do plano para os do kit.
  - Antes de criar `CT-F<n>-<nn>`, conferir se já existe família para critério de aceite.

**M13. Um label por `logical-id` e o Project v2 fogem dos objetivos**
- **Revisor:** zoom-out
- **Onde:** A4 (l. 100), item 4 (`GH_PROJECT_NUMBER`), item 8 (escopo `project`), item 28 (l. 448–449)
- **Problema:** labels valem para o repositório inteiro, então seriam centenas. O Project v2 não aparece em nenhum Goal nem CUJ.
- **Correção:**
  - Idempotência pelo `id-map.json` mais um marcador escondido no corpo (`<!-- logical-id: X -->`).
  - Ficar só com os labels de tipo e `fio-condutor`.
  - Project v2 opcional, sem checagem no `doutor`.

**M14. O `ORIGEM.md` com sha256 por arquivo refaz o que o git já faz**
- **Revisor:** zoom-out
- **Onde:** item 2 (l. 244–247), item 8 (l. 285), item 27 (l. 439)
- **Correção:**
  - Dar a tag `base-harness-2.6.0` ao commit base e usar `git diff --stat <base>..HEAD`.
  - O `ORIGEM.md` fica só com versão, data e motivo das remoções.
  - O `doutor` deixa de checar divergência.

**M15. `api-contracts.yaml` vira OpenAPI artificial e a ordem do Estágio 1 atrasa a demo**
- **Revisor:** zoom-out
- **Onde:** A8 (l. 104), l. 144, item 17 (l. 365), item 31; l. 33, G6 (l. 47), itens 10–36, l. 581
- **Problema:**
  - As simulações são tabelas, não APIs. O arquivo 12 (l. 88) diz que a etapa 7b é condicional (só com Scripted REST, REST Message ou Import Set).
  - Os 27 itens que mexem no kit vêm antes da primeira tabela ir para a instância.
- **Correção:**
  - Etapa de contratos opcional no v0: as `SIM-` ficam documentadas em `inputs/simulacoes.md` e no `data-model.json`, e saem a exigência da `cadeia` e a `sn-api-contracts`.
  - Dividir o Estágio 1 em dois blocos:
    - **Caminho da demo:** itens 6, 9, 23–26, 28–30 e 37–42.
    - **Endurecimento do kit:** gates, gramática, wiring, lock e validadores.
  - Fechar o fio condutor na instância antes do segundo bloco, usando a isenção já aceita (`outputs/spec/auditorias/_isencoes/`).

---

## 🟢 Nit

- **N1 (zoom-out).** O plano não cita como base componentes prontos listados no arquivo 33:
  - skills `deploy` e `git-issues-start/end` do starter;
  - `deploy-and-verify` e `add-table` do `sn-app-template`;
  - os 6 revisores do `servicenow-claude-kit`;
  - `check-scope-prefix.py` do `servicenow-agent-skills`.

  Eles cobrem parte dos itens 24, 30, 32 e a checagem de prefixo (l. 164, 468).
- **N2 (zoom-out).** O documento não diz que `app/src/fluent/generated/keys.ts` vai para o git, nem usa `now-sdk build --frozenKeys`. Colocar os dois no item 6 e na l. 580.
- **N3 (zoom-out).** O `.env.example` (item 4) usa `SN_USER`/`SN_PASSWORD`. Trocar pelos nomes que o SDK lê: `SN_SDK_INSTANCE_URL`, `SN_SDK_USER`, `SN_SDK_USER_PWD` (ci-integration.md, l. 159–165).
- **N4 (zoom-out).** O arquivo 12 chama a skill de `sn-seed-instancia`, e o design a chama de `sn-seed` (item 25). Alinhar.
- **N5 (zoom-out).** A l. 163 repete o checklist dos validadores do item 32. Basta remeter ao item 32.
- **N6 (inventive-catalyst).** `now-sdk install` pede confirmação e trava o trecho ao vivo da demo (item 7, l. 272; CUJ 3, l. 82; item 42, l. 574).
  - Liberar sem confirmação só um wrapper `npm run install-app`, que confere alias, prefixo e `check_sensivel` antes de instalar.
  - O `now-sdk install` direto e o `--reinstall` continuam pedindo confirmação.
- **N7 (inventive-catalyst).** O inventive-catalyst não achou compromisso falso nestas escolhas do autor: Core UI clássica, GitHub como backlog, repositório único e integrações simuladas como tabela. Também classificou como restrições da plataforma o navegador exigido pelo ATF de form e o limite de 30 caracteres no nome de tabela.

---

## Contradições e transformações do inventive-catalyst

| Achado | Contradição | Transformação |
|---|---|---|
| B1 | Adaptar o harness desliga a proteção da zona | Separar no tempo: template no Estágio 1, clone depois |
| M5 | Fork maior deixa mais caro receber versões novas do harness | Separar o que é do projeto (skills novas como extensão) |
| M6 | Protótipo fiel congela o modelo de dados cedo | Instância descartável até o `fecho-explore` |
| M3 | Gate barato e offline fica menos confiável | Um só leitor do ATF gravando recibo |
| M2 | Form sem navegador ou isenção | Reaproveitar o Playwright já logado |
| M4 | Arquivo de gate também serve de painel vivo | Separar estático de vivo |
| M9 | Escopo fixo simplifica, mas o kit deixa de ser reaproveitável | Ler o escopo da configuração |
| M10 | Resiliência só depois da perda da PDI | Checagem diária preventiva |
| M8 | Profundidade de validação contra custo em tokens | Validar pelo tipo de task |
| M11 | Print sempre atual perde a evidência histórica | Permalink por SHA |
| N6 | Confirmação no install dá segurança e tira autonomia | Wrapper intermediário com checagens |

Dois pontos para resolver juntos:
- M7 (zoom-out quer menos tipos) e M8 (catalyst roteia pelo tipo) se encaixam se o roteamento usar `snArtifact.kind`.
- M14 (tag em vez de hashes no `ORIGEM.md`) muda o custo que o catalyst aponta em B1, onde o `ORIGEM.md` vira a única trilha de divergência.

Arquivos de apoio citados pelos revisores:
- /config/workspace/scripts/check_sensivel.py
- /config/.claude/jobs/2c29c816/tmp/harness-claude/.claude/hooks/zonas.mjs
- /config/.claude/jobs/2c29c816/tmp/harness-claude/.claude/hooks/kit.mjs
- /config/.claude/jobs/2c29c816/tmp/harness-claude/.claude/ferramentas/empacotar.mjs
- /config/.claude/jobs/2c29c816/tmp/harness-claude/.claude/ferramentas/promocao.mjs
- /tmp/sdkpkg/package/docs/configuration/ci-integration.md
- /tmp/sdkpkg/package/docs/guides/atf-guide.md
