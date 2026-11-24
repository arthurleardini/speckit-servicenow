# Especificação Funcional — <produto>

> **Fase:** Explore · **Versão:** 0.1 · **Status:** cobertura completa, profundidade preliminar
> **Documentos irmãos:** [HLD](./hld-funcional.md) · [Técnica](./especificacao-tecnica.md) · [Modelo de Dados](./modelo-de-dados.md) · [GAPs](./gaps.md)
>
> <!-- Este documento existe para três coisas: entendimento, revisão preliminar e geração do
>      app preliminar na instância (sn-scaffold). Backlog, critério de aceite e cenário de teste são
>      do Plan — não os escreva aqui. -->

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 0.1 | <data> | versão inicial |

## 1. Personas e perfis de acesso

### 1.1 Personas
| Persona | Perfil (role ServiceNow) | Papel no processo |
|---|---|---|
| <persona> | `<escopo>.<role>` | <o que essa pessoa faz> |

### 1.2 Matriz de acesso
<!-- Uma linha por ação relevante; uma coluna por role do app, no formato `<escopo>.<role>` (o
     escopo é o de app/now.config.json, ex.: `x_2326104_cob.coordenador`). Marque ✅ / — . A ação
     cita as telas (TEL-nnn) em que acontece. -->

| Ação | `<escopo>.coordenador` | `<escopo>.atendente` | `<escopo>.admin` |
|---|:---:|:---:|:---:|
| <ação> (TEL-<nnn>) | — | — | — |

## 2. Navegação e telas
<!-- Esta tabela é ENTRADA do sn-scaffold, que gera um Form() ou List() (ou o report) por linha e
     depois grava a rota de cada tela no outputs/spec/screens-manifest.json. A rota NÃO entra aqui:
     a de form depende do sys_id do registro demo, que só existe depois do build.
     Core UI clássica (UI16) — ver .claude/rules/harness/servicenow-ui.md.
     Tipo: form | list | report. Visão: default ou o nome da view. Papel: a role (sem o escopo) do
     usuário demo com que o print é tirado. Registro demo: o registro do seed que a tela mostra
     (form) ou "lista: seed fictício (N)" (list/report). -->

| TEL | Título | Tabela ServiceNow | Tipo | Visão | Papel | Módulo | RF | Registro demo da tela |
|---|---|---|---|---|---|---|---|---|
| TEL-<nnn> | <título da tela> | `<escopo>_<tabela>` | <form\|list\|report> | default | <role> | MOD-<CODIGO> | RF-<nnn> | <registro demo da tela> |

## 3. Funcionalidades e regras de negócio, por módulo
<!-- Cobertura completa: TODA necessidade de negócio tem que aparecer como RF-nnn. As RN são
     preliminares — o Plan as aprofunda. Toda RN declara quais RF ela afeta. -->

### MOD-<CODIGO> — <nome do módulo>

**Funcionalidades**

| ID | Funcionalidade | Descrição |
|---|---|---|
| RF-<nnn> | <nome da funcionalidade> | <o que ela faz> |

**Regras de negócio**

| ID | Regra | Afeta |
|---|---|---|
| RN-<nnn> | <enunciado da regra> | RF-<nnn> |
