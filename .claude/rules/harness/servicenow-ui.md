---
description: Constituição de interface do Speckit ServiceNow — Core UI clássica (UI16) em app escopado, escrita em Fluent. Dona do padrão de form, list, related list, activity, UI Action e UI Policy.
paths: "app/src/fluent/**"
---

# Interface ServiceNow — Core UI clássica

Vale para todo arquivo em `app/src/fluent/**`. A tela do produto é a tela da instância: o protótipo
do Explore e o app do Deliver são o mesmo app (`x_<escopo>`), instalado por `npm run reinstall`.
Antes de escrever cada tipo de objeto, consulte o SDK: `now-sdk explain <tópico> --peek`.

---

## Alvo

- **Core UI clássica (UI16)**: form, list e report do navegador clássico.
- App **escopado**; o escopo é lido de `app/now.config.json`, nunca escrito à mão.
- **Fora do alvo:** Workspace, Service Portal, UI Builder, Next Experience customizada e widget.
- Painel ou tela que a Core UI não faz como o plano pede vira **report simples** (`sys_report`) ou
  **list com group-by**, e a diferença vai como GAP em `outputs/explore/gaps.md`.

---

## Form

- `Form()` com seções de **uma ou duas colunas**, no padrão do `form-layout-guide.md` do SDK.
- A primeira seção traz o que identifica o registro (número, título, estado, responsável).
- **Related lists embutidas** para os filhos da tabela (ex.: dossiê → débitos, ciclos → grupos).
- **Formatter de activity em seção própria**, no fim do form. A tabela com form liga
  `journal_input` e `audit`, e o seed grava 2 a 3 linhas de journal por registro demo — o
  histórico não sai vazio no print.
- Campo de integração simulada leva o rótulo **"Simulado"** (ver `inputs/simulacoes.md`).

## List

- `List()` por tela de lista, com as colunas que o papel da tela usa para decidir; no máximo 8.
- Filtro padrão e ordenação declarados no `List()`; group-by quando a tela pede agregação.
- Edição em lista fica desligada nos campos controlados por UI Policy ou Client Script (RN-SN-68).

## Ações de tela

- **UI Action** para toda ação de tela (publicar versão, sortear grupo, reenviar).
- UI Action destrutiva tem `condition` **e** `roles` (RN-SN-170); depois de atualizar o registro,
  `action.setRedirectURL(current)`. UI Action não troca view (usar View Rule).
- Script de cliente da UI Action em string ou `Now.include()`, nunca módulo (RN-SN-169).

## Comportamento do form

- **UI Policy antes de Client Script** para obrigatório, somente leitura e visível (RN-SN-60,
  RN-SN-172).
- Regra que vale também para import e REST vai em **Data Policy** (RN-SN-173).
- Client Script só para validação de entrada do usuário, dentro de função, sem DOM, sem
  `GlideRecord` e sem `g_form.getReference()` (RN-SN-63, 66, 69).
- **UI Policy, Data Policy, Client Script e filtro de lista são UX, não segurança** (RN-SN-145): o
  dado é protegido por ACL e Business Rule (`.claude/rules/harness/security.md`, Camada G).

## Navegação

- Menu do app em `app/src/fluent/navigation/menu.now.ts`, gerado pelo `sn-scaffold`, **por área
  de trabalho**: `modules` do modelo com áreas (`items`), cada área um separador com os módulos
  daquele trabalho (lista filtrada com view e ordenação, report, link), com `roles` por papel.
- **Tabelas cruas só em "Administração"** (`adminTables: true`), visível só para o admin; o papel de
  negócio não navega por tabela.
- Cada papel entra direto no próprio trabalho: home por papel (`homes`, preferência
  `my_home_navigation_page` gravada pelo `sn-seed`) ou, sem ela, o primeiro módulo do menu do papel.
- Estado do registro visível no topo do form pela trilha de etapas (`processFlows`).
- Módulo aponta para list ou report com filtro; nunca para URL fixa de instância.

## Identificadores

- `$id` de todo registro Fluent usa o ID da spec: `Now.ID['<ID-da-spec>_<tipo>_<nome>']`
  (ex.: `Now.ID['RF-MOD-F2-003_br_publicar_versao']`). O registro demo de cada tela é
  `Now.ID['<TEL>_registro_demo']`.
- Nunca `sys_id` fixo em código (RN-SN-31).

## Estados de tela e acessibilidade

A Core UI já entrega carga, vazio e erro de list e de form; não os reimplemente. Mensagem ao
usuário (`addInfoMessage`, `addErrorMessage`, `setError`) usa texto de mensagem traduzível, não
literal fixo. Rótulo de campo e de coluna em português, sem abreviação que o papel não usa.

---

## MUST NOT (lista compacta)

- Workspace, Service Portal, UI Builder, widget ou página customizada.
- Client Script global, manipulação de DOM, `GlideRecord` ou GlideAjax síncrono no cliente.
- Client Script onde UI Policy resolve.
- UI Action destrutiva sem `condition` e `roles`.
- Segurança só em UI Policy, Client Script ou filtro de lista.
- `sys_id` ou URL de instância fixos; escopo escrito à mão.
- Instalar por `now-sdk install` direto: instalação só por `npm run reinstall`.

## Anti-patterns

- Form com uma seção só e trinta campos: quebre em seções de uma ou duas colunas.
- Related list substituída por campo de texto com a lista "colada".
- Activity stream sem `journal_input`/`audit` ou sem journal no seed: o print sai vazio.
- Tela "custom" para o que um report simples ou uma list com group-by resolve.
