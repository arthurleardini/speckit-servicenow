# Workspace do projeto — repositórios e papéis

> **Fonte única de "qual repo é qual".** Lido por `.claude/hooks/workspace.mjs`, e por ele pelo
> `delivery-gate` e pelo `estado`. Vive na **raiz** do repositório de docs — versionado,
> revisável em PR.
>
> **Papel é chave de política, não rótulo:** `codigo` é fiscalizado pelo gate (é onde US integra);
> `docs` e `prototipo` são livres (nunca integram US). O vocabulário é fechado — repositório com
> papel não declarado tem o push **negado**. Acrescentar papel novo é mudança de design.
>
> **Casamento pelo nome do repositório** — último segmento da URL, sem `.git`, case-insensitive.
> Não pelo caminho local: renomear a pasta não redefine política.

## Changelog
| Versão | Data | Mudança |
|---|---|---|
| 1.0 | 2026-11-24 | criação do manifesto: repositório único `speckit-servicenow` (decisão A3 do design) |

## Repositórios

| Papel | Repositório | Pasta local | Para que serve |
|---|---|---|---|
| docs + codigo | `arthurleardini/speckit-servicenow` (GitHub, privado) | `.` | kit, spec (`inputs/`, `outputs/`), app Fluent em `app/` e backlog em issues |

Não há repositório de protótipo: a instância `dev493801` é o protótipo (decisão A2), com prints em `outputs/spec/screens/`.

<!-- harness:workspace -->
- papel: docs
  repositorio: https://github.com/arthurleardini/speckit-servicenow
<!-- /harness:workspace -->

> **Mono-repo.** O mesmo repositório tem os dois papéis. O manifesto aceita um nome de repositório
> uma única vez, então o bloco declara só a entrada `docs`, que é obrigatória. Com a sessão aberta
> na raiz do repositório (sem subpastas candidatas), o harness opera em mono-repo e o
> `delivery-gate` trata o push como `codigo`: o código em `app/` é fiscalizado por story.
>
> Valide com: `node .claude/hooks/workspace.mjs --validar`
