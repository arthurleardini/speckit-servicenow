# Speckit ServiceNow

Kit para Claude Code que leva um plano de implementação até um app ServiceNow funcionando:

1. especificação do plano;
2. o app instalado na instância, que serve de protótipo;
3. backlog no GitHub com o print de cada tela;
4. implementação das stories com testes automatizados (ATF).

Exemplo completo, no piloto 2.6 Cobrança SEFAZ-MT: branch [`feat/v0`](../../tree/feat/v0) (roteiro em `outputs/spec/demo/roteiro.md`).

## Pré-requisitos

| Precisa de | Onde conseguir |
|---|---|
| Instância ServiceNow própria (PDI) | developer.servicenow.com → *Request Instance* |
| Node 20.18 a 26, Git e Python 3 | instalados na máquina |
| GitHub CLI logado | `gh auth login` |
| Claude Code | `claude` no terminal, aberto **na pasta do repositório** |

Depois de preparar (abaixo), confira tudo com `npm run doutor`, que roda `node .claude/ferramentas/doutor.mjs`.

## Preparar (uma vez, cerca de 15 min)

```bash
# 1. Seu repositório, a partir deste modelo
git clone -b template https://github.com/arthurleardini/speckit-servicenow.git meu-projeto
cd meu-projeto
git remote remove origin
gh repo create <usuario>/<repositorio> --private --source . --push

# 2. Dependências
npm install
npx playwright install chromium

# 3. Credencial da instância (nunca vai para o git)
cp .env.example .env.instancia
chmod 600 .env.instancia
#    preencha SN_SDK_INSTANCE_URL, SN_SDK_USER, SN_SDK_USER_PWD, SN_ALIAS e GH_REPO

# 4. Criar o app na instância
#    O escopo é x_<prefixo>_<sufixo>, com até 18 caracteres. O prefixo aparece na instância em
#    System Properties → glide.appcreator.company.code.
mkdir app && cd app
set -a; . ../.env.instancia; set +a
npx @servicenow/sdk@4.14.3 init --appName "Nome do App" --packageName meuapp --scopeName x_<prefixo>_<sufixo> --template base
npm install
cd ..

# 5. Conferir o ambiente
npm run doutor
```

Mais três passos:

- No `workspace.md`, troque `<usuario>/<repositorio>` pelo seu repositório.
- Na instância, ligue os testes automatizados: em **System Properties** (`sys_properties_list.do`), procure `sn_atf.runner.enabled` e mude para `true`.
- Coloque o seu plano de implementação (`.md` ou `.pdf`) em `inputs/`. Use só dados fictícios ou agregados. Para conferir, rode `python3 scripts/check_sensivel.py inputs/*.md`; score 40 ou mais é sinal de dado pessoal real.

## Usar: três pedidos ao Claude Code

Abra o Claude Code na pasta do repositório e peça uma fase de cada vez. Os gates do kit impedem pular etapas.

| Fase | O que pedir | O que sai |
|---|---|---|
| **1. Explore** | "Rode o Explore com o plano que está em `inputs/`: documentos do Explore, prévia do modelo de dados, gere o app com o sn-scaffold, instale com `npm run reinstall`, tire os prints com `npm run capture` e feche o Explore." | `outputs/explore/`; app com tabelas, telas e dados fictícios na instância; prints em `outputs/spec/screens/` |
| **2. Plan** | "Rode o Plan até publicar o backlog: produto, tech-rules, HLD, plano de segurança, modelo final, plano de testes, tasks, revisão de segurança, rastreio e publicação com o sn-tasks-github." | `outputs/spec/` completo; issues no seu repositório, com o print de cada tela |
| **3. Deliver** | "Implemente a story `<ID>` com o sn-implement." (uma por vez) | lógica no app, teste ATF verde, print, comentário na issue e auditoria |

Para olhar o resultado:

- **Na instância:** menu **All → nome do app**.
- **Visão de cada papel:** *Impersonate User* com `demo.coordenador`, `demo.atendente` ou `demo.admin`.
- **Backlog:** aba **Issues** do seu repositório.

## Comandos úteis

| Comando | Para quê |
|---|---|
| `npm run doutor` | confere ambiente, credencial e instância |
| `npm run reinstall` | instala o app e os dados fictícios e roda a suíte de testes |
| `npm run capture` | tira os prints das telas na visão de cada papel |
| `npm run atf -- --story <ID>` | roda o teste da story e grava o recibo |

## Se algo travar

| Sintoma | O que fazer |
|---|---|
| `doutor` vermelho no `gh` | `gh auth login`; se o `gh` não estiver no PATH, use `GH_BIN=/caminho/do/gh` |
| Teste ATF responde 400 "Start ATF test Failed" | `sn_atf.runner.enabled` ainda está `false` na instância |
| Instância "hibernando" | entre pelo navegador em developer.servicenow.com e acorde a instância. A PDI é recolhida depois de 10 dias sem login |
| Gate do Explore nega | a mensagem diz o que falta. O mais comum é rodar `npm run reinstall` depois de mudar o app e fazer commit antes |

Como o kit foi feito e o que mudou em relação ao harness Elo: `ORIGEM.md` e `docs/designs/speckit-servicenow-v0.md`. Para manter o kit: `MANUTENCAO.md`.

## Manutenção do kit

O maquinário fica em três pastas:

- `.claude/hooks/`: verificadores **disparados por evento** (início de sessão, antes e depois de cada ferramenta). Eles só leem e decidem; não escrevem arquivo.
- `.claude/ferramentas/`: utilitários rodados **por comando**, à mão ou por uma skill, como `promocao.mjs`, `validar.mjs`, `verificar-zona.mjs`, `wiki.mjs` (wiki do cliente) e `bench.mjs` (comparação de rodadas).
- `.claude/skills/`: as skills do kit (`spec-*`) e as do ServiceNow (`sn-*`).

Suíte de testes do kit: `node --test .claude/hooks/*.test.mjs .claude/ferramentas/*.test.mjs` (ou `npm test`, que roda também os testes das skills). Para alterar a zona travada, siga o ciclo do `ORIGEM.md`.
