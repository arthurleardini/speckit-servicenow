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
| 1.0 | AAAA-MM-DD | criação do manifesto |

## Repositórios

| Papel | Repositório no ADO | Pasta local | Para que serve |
|---|---|---|---|
| docs | `<repo-docs>` | `<pasta>` | artefatos de fase; publicado como wiki |
| codigo | `<repo-codigo>` | `<pasta>` | código da solução |
| prototipo | `<repo-prototipo>` | `<pasta>` | protótipo de alta fidelidade |

<!-- harness:workspace -->
- papel: docs
  repositorio: https://dev.azure.com/<org>/<projeto>/_git/<repo-docs>
<!-- codigo entra só no Deliver — descomente as três linhas abaixo quando o repositório de
     código existir, e preencha os tokens:
- papel: codigo
  repositorio: https://dev.azure.com/<org>/<projeto>/_git/<repo-codigo>
  branch-de-integracao: main
-->
- papel: prototipo
  repositorio: https://dev.azure.com/<org>/<projeto>/_git/<repo-prototipo>
<!-- /harness:workspace -->

> `branch-de-integracao` é opcional (default `main`). Declare quando o repo integrar em `master`,
> `develop` ou outro — sem isso o gate não consegue calcular os commits do push e bloqueia.
>
> Cardinalidade: **exatamente um** `docs`; zero ou mais `codigo`; zero ou mais `prototipo`.
> O manifesto nasce no Explore com `docs` e `prototipo`; `codigo` entra no Deliver.
>
> Valide com: `node .claude/hooks/workspace.mjs --validar`
