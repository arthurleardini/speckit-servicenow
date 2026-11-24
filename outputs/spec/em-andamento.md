# Em andamento — Deliver

> **Marcador efêmero de US pausada.** Existe **se e somente se** há uma user story no meio.
> Ausência é o estado normal — não há histórico, nem `us: nenhuma`, nem menção a US fechadas.
> Quem **cria** é a skill `sn-implement`, na primeira task da US, com
> `node .claude/ferramentas/andamento.mjs abrir-us`, que copia este template e preenche o bloco
> `estado:us` abaixo — não crie à mão.
> Ao fechar a US (veredito APROVADA / APROVADA COM RESSALVAS), a skill `auditoria-de-us` **apaga**
> este arquivo; o `delivery-gate` bloqueia o push se ele ainda estiver na árvore.
> **Não escreva aqui nada derivável:** branch, HEAD, arquivos não-commitados e veredito/commit
> auditado — se ausentes, o hook `estado.mjs` (fusão do antigo `estado-deliver.mjs` neste
> harness) cai num padrão neutro na leitura; não precisam ser preenchidos à mão.
> **Commite este arquivo assim que criá-lo:** o `delivery-gate` lê a árvore do commit
> (`git ls-tree`), não o worktree, e o desaparecimento automático ao trocar de branch só vale para
> arquivo rastreado no git — sem commit, nenhum dos dois mecanismos funciona.
>
> **`repositorios`** declara em quais repos do manifesto esta US trabalha — é o **foco da sessão**.
> A `auditoria-de-us` lê este campo para saber quais repositórios auditar no fecho. É economia de
> contexto, **não** autoridade: o `delivery-gate` decide por papel do repositório (`workspace.md`)
> e nunca lê este campo.

<!-- estado:us -->
us: US-MOD-F2-004
repositorios: speckit-servicenow
proximo-passo: implementar TASK-MOD-F2-004-01
bloqueios: nenhum
<!-- /estado:us -->

## Passos já fechados nesta US
<!-- Até ~5 bullets. Só o que esta US já fechou (CA, SEC). Morre com o arquivo. -->
