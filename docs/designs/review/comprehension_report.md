# Stage 6: Comprehension Test (speckit-servicenow-v0.md)

Contagem: 🔴 0 · 🟡 11 · 🟢 6

## O que isto propõe

O documento propõe o Speckit ServiceNow, um fork do Harness Elo 2.6.0 (o kit para Claude Code que hoje leva um projeto da spec até um app Next.js). O fork muda o destino para um app escopado ServiceNow escrito em Fluent, gerado pelo ServiceNow SDK.

O v0 roda num caso real, o Plano 2.6 Cobrança da SEFAZ-MT, e entrega quatro coisas:
- a spec;
- as telas instaladas cedo na própria instância, que servem de protótipo (Core UI clássica, com dados fictícios);
- um backlog em issues do GitHub com o print de cada tela;
- o app instalado na instância `dev493801`.

Um ID único liga tudo: RF → critério → tela → issue → arquivo `.now.ts` → registro na instância → teste ATF. Uma matriz `traceability.json` registra essa ligação.

O objetivo imediato é uma demonstração para o diretor da EloGroup. Por isso a lógica completa (regras, flow, ATF, validação G3) fica num "fio condutor" (F2 e o dossiê da F5), e o resto do app fica navegável, porém mais raso.

## Como o sistema existente funciona, segundo este documento

No ServiceNow da SEFAZ-MT, o caminho do plano à instância hoje é manual. O precedente (Distribuição de Restituição) usou App Engine Studio, scripts de seed feitos à mão e nenhum teste automatizado. O protótipo de cobrança tem visual próprio, diferente da plataforma, e as stories não levam o print da tela.

O Harness Elo 2.6.0 empacota o Elo Spec Kit em skills `spec-*` e organiza o trabalho em fases (Explore, Plan, Deliver). Hooks (`cadeia`, `fecho-explore`, `sync-log`, `kit`, `delivery-gate`) fazem os gates entre as fases, e validadores independentes rodam num ciclo chamado G3. Uma "zona imutável", protegida por um arquivo de lock, impede alterar partes do kit. O harness assume Next.js, protótipo HTML de alta fidelidade, OpenAPI e Azure DevOps como destino do backlog (via `spec-tasks-azure`).

## Achados

### 🟡 1. As fases do kit aparecem com dois vocabulários e nunca são definidas
- **Onde:** Overview (l. 11), The Problem (l. 31), Fluxo (l. 131–154).
- **Problema:** o Overview fala em "Discovery, Especificação, Dev e Testes". O resto do documento usa Explore, Plan e Deliver, e "Explore" aparece na l. 31 sem explicação. O leitor não sabe se são as mesmas fases com outro nome, nem o que cada uma entrega e qual gate a fecha.
- **Correção:** no Overview, usar um só vocabulário e definir cada fase em uma linha: o que produz e qual hook a fecha.

### 🟡 2. "G3" quer dizer duas coisas
- **Onde:** G3 (l. 39) contra "ciclo G3" e "validadores G3" (l. 116, 150, 163, 229, 456, 462, 491).
- **Problema:** G3 é ao mesmo tempo a meta "A instância é o protótipo" e o ciclo de validação do harness. O ciclo nunca é definido (quais validadores, em que ordem, o que reprova). O mesmo vale para "Test Blueprint" e "auditoria-de-us".
- **Correção:** renomear as metas (M1–M6) ou chamar o ciclo de "validação independente (G3)", e definir o ciclo numa frase.

### 🟡 3. Referência cruzada errada para a regra do ATF
- **Onde:** Q2 (l. 62) e item 9 (l. 291).
- **Problema:** a Q2 aponta o `delivery-gate` (item 19), mas o item 9 diz "item 32", que trata dos validadores. O item 9 também não tem regra para o caso em que nenhum dos dois testes roda sem navegador.
- **Correção:** corrigir a referência para o item 19 e acrescentar o terceiro desfecho com a regra correspondente.

### 🟡 4. A Q4 é citada, mas não existe
- **Onde:** item 42 (l. 571) e Open Questions (l. 60–63).
- **Problema:** o item 42 diz ser a "resposta à Q4", mas a lista só tem Q2 e Q3. Não fica claro o que aconteceu com a Q1 e a Q4.
- **Correção:** reinserir as duas com o status "resolvida no item X", ou renumerar.

### 🟡 5. Fontes externas citadas sem caminho nem descrição
- **Onde:** "arquivo `33`, post de Jon Lind" (item 7), "arquivo `32`" e "seção 2.12" (itens 31–32), as 173 regras RN-SN, "brief D1/D3/D4/D6/D7", "opção A/C".
- **Problema:** o leitor não sabe o que é o catálogo RN-SN, quem o escreveu nem onde ele está. "Arquivo 32/33" e "brief" aparecem sem caminho.
- **Correção:** criar uma seção "Referências" com o caminho de cada fonte e uma frase dizendo o que ela é.

### 🟡 6. Termos internos do harness usados sem definição
- **Onde:** "zona imutável" e "lock de zona" (A1, Alternativa A, item 35); "Camada G" (item 12); "gate de autossuficiência" (l. 162, item 28); "Fidelidade: alta" (l. 159); "colheita" (item 31); "isenção".
- **Problema:** a rejeição da Alternativa A depende de entender a zona imutável, que o documento não explica.
- **Correção:** um glossário curto logo depois do Overview.

### 🟡 7. Os níveis N1/N2/N3 não são definidos
- **Onde:** item 33 (l. 509) e Verification Plan (l. 585).
- **Problema:** há um critério de verificação que depende de N3, sem definição do que é N3.
- **Correção:** definir os níveis no item 33.

### 🟡 8. Os IDs não fecham entre as seções
- **Onde:** G1 (l. 37), A7, item 18, item 38.
- **Problema:** o documento não define "RF transversal". O formato `RF-T-<nn>` do item 38 não está na gramática do item 18, então o validador rejeitaria esses IDs. As siglas RF, CT, RN, TEL e US nunca são expandidas.
- **Correção:** definir "transversal", incluir `RF-T-<nn>` nos itens 18 e 33 e na A7, e expandir as siglas no primeiro uso.

### 🟡 9. Os Non-Goals contradizem o plano detalhado
- **Onde:** Non-Goals (l. 55) contra Componentes (l. 116) e os itens 31–32.
- **Problema:**
  - O `validador-escopo-app` está nos Non-Goals, mas o item 32 cria esse validador.
  - `sn-legacy` e `sn-estimate` aparecem como "cópia" nos Non-Goals e como "não existem" no item 31.
- **Correção:** alinhar os dois trechos, dizendo o que entra, o que fica como cópia e o que não existe.

### 🟡 10. Os estágios não batem entre as menções
- **Onde:** NFR "Volatilidade" (l. 228, "estágio 2"), Alternativa H (l. 214), Detailed Plan (Estágios 0, 1 e "2 em diante").
- **Problema:** não dá para montar a sequência dos estágios nem saber o que fecha cada um.
- **Correção:** uma tabela de estágios com número, conteúdo e critério de saída.

### 🟡 11. "Isenção" mistura dois sentidos
- **Onde:** CUJ 3, "Validação" (l. 163), NFR "Custo", item 19, item 29.
- **Problema:** isenção pode ser dispensa do G3 (fora do fio condutor) ou dispensa do ATF de form (Q2). Fica a dúvida se uma story fora do fio pode fazer push sem nenhum ATF.
- **Correção:** separar "isenção de G3" de "isenção de ATF de form" e criar uma tabela de quem exige o quê.

### 🟢 12. Siglas e nomes da organização sem explicação
FDE, Delivery Suite, CodeForge e SYDLE aparecem no Overview e no The Problem sem dizer o que são. Correção: explicação curta entre parênteses no primeiro uso.

### 🟢 13. O arquivo de credencial aparece com três nomes
`.env` (CUJ 2, A10), `.env.instancia` (Componentes, item 26, NFR) e `.env.example` (item 4). Correção: usar sempre `.env.instancia` e dizer que o `.env.example` é o modelo dele.

### 🟢 14. "sn-install" parece uma skill que não existe
O item 18 (l. 370) registra `sn-install` no `sync-log`, mas o install é o `now-sdk install`. Correção: dizer que é só um rótulo da linha, ou renomear.

### 🟢 15. Dois passos de segurança no Plan sem a diferença explicada
`sn-revisao-de-seguranca` e `spec-security-review` aparecem no Fluxo PLAN (l. 142–145). Correção: uma frase sobre o papel de cada um.

### 🟢 16. A origem da label `fio-condutor` não é explicada
Os itens 29 e 40 não dizem quem aplica a label nem quando. O item 40 inclui o isolamento de carteira, que G1 e a "Validação" não citam. Correção: dizer a origem da label e alinhar o escopo do fio condutor.

### 🟢 17. "Órfão" é definido de dois jeitos
No G1, "sem linha órfã". No item 33, órfão é o RF ausente em todas as fontes, e o gate só olha a coluna `story`. Correção: definir "órfão" uma vez e dizer qual coluna cada gate verifica.
