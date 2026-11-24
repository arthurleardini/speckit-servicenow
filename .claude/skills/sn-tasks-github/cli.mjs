#!/usr/bin/env node
/**
 * sn-tasks-github — publica o tasks.json (spec-tasks v5.3/v5.4) como issues do GitHub.
 * Contrato do spec-tasks-azure: gate de autossuficiência, --dry-run, --change e --id-map.
 */
import { accessSync, constants, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';
import { loadTasksDocument } from './lib/load-tasks.mjs';
import { checarSchema, formatarPlano, lerFioCondutor, lerIdMap, montarItens, resolverPrints } from './lib/publish-plan.mjs';
import { ClienteGitHub, executar, executorGh, planejar } from './lib/github-upsert.mjs';

const NOME = 'sn-tasks-github';

function parseArgs(argv) {
  const a = { input: null, repo: null, idMap: null, fio: null, change: false, dryRun: false, help: false };
  for (let i = 2; i < argv.length; i++) {
    const x = argv[i];
    if (x === '--input' || x === '-i') a.input = argv[++i];
    else if (x === '--repo' || x === '-R') a.repo = argv[++i];
    else if (x === '--id-map') a.idMap = argv[++i];
    else if (x === '--fio-condutor') a.fio = argv[++i];
    else if (x === '--change') a.change = true;
    else if (x === '--dry-run') a.dryRun = true;
    else if (x === '--help' || x === '-h') a.help = true;
    else if (!x.startsWith('-') && a.input === null) a.input = x;
    else {
      process.stderr.write(`${NOME}: opção desconhecida ${x}\n`);
      process.exit(1);
    }
  }
  return a;
}

function ajuda() {
  console.log(`${NOME} — publica o tasks.json como issues do GitHub (epic e feature → issue; story → sub-issue).

Uso:
  node cli.mjs [opções] [tasks.json]

Opções:
  -i, --input <arquivo>     tasks.json (padrão: outputs/spec/tasks.json)
  -R, --repo <dono/repo>    repositório (padrão: GH_REPO)
      --id-map <arquivo>    id-map.json { "<ID>": { "number", "id" } } (padrão: id-map.json ao lado do tasks.json)
      --fio-condutor <arq>  lista de RF do fio condutor (padrão: inputs/fio-condutor.md na raiz do repo)
      --change              atualiza as issues que já existem e cria as novas
      --dry-run             mostra o plano (criar, atualizar, vincular) sem escrever no GitHub
  -h, --help                esta ajuda

Sem --change, issue que já existe (id-map ou marcador <!-- logical-id -->) não é tocada nem duplicada.

Ambiente:
  GH_BIN    binário do gh (padrão: gh)
  GH_REPO   repositório dono/repo
  SN_TASKS_GITHUB_SKIP_SELFSUFFICIENCY_GATE=1  desliga o gate de autossuficiência (só emergência; registrar no sync-log)

Exit codes:
  0 sucesso · 1 erro fatal · 2 falha parcial · 3 gate de autossuficiência reprovou · 4 print obrigatório ausente ou não commitado
`);
}

function caminhoEntrada(especificado) {
  if (especificado) return resolve(especificado);
  for (const p of [resolve('outputs', 'spec', 'tasks.json'), resolve('outputs', 'tasks.json')]) {
    try {
      accessSync(p, constants.R_OK);
      return p;
    } catch {
      /* próximo */
    }
  }
  return resolve('outputs', 'spec', 'tasks.json');
}

/** Gate de autossuficiência: mesmo validador e mesma semântica do spec-tasks-azure. */
function gateAutossuficiencia(tasksPath) {
  if (process.env.SN_TASKS_GITHUB_SKIP_SELFSUFFICIENCY_GATE === '1') {
    process.stderr.write(`${NOME} [AVISO]: gate de autossuficiência DESATIVADO por variável de ambiente. Registre o motivo no sync-log.\n`);
    return;
  }
  const here = dirname(fileURLToPath(import.meta.url));
  const validador = resolve(here, '..', 'spec-tasks', 'scripts', 'validate-tasks-selfsufficiency.mjs');
  try {
    accessSync(validador, constants.R_OK);
  } catch {
    process.stderr.write(`${NOME}: validador de autossuficiência não encontrado em ${validador}. Publicação abortada.\n`);
    process.exit(3);
  }
  const r = spawnSync(process.execPath, [validador, tasksPath], { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status === 0) {
    process.stderr.write(`${NOME}: gate de autossuficiência OK (0 FATAL).\n`);
    return;
  }
  let out = null;
  try {
    out = r.stdout && r.stdout.trim() ? JSON.parse(r.stdout) : null;
  } catch {
    out = null;
  }
  if (r.status !== 1 || !out) {
    process.stderr.write(
      `${NOME}: o validador não conseguiu analisar ${tasksPath} (exit ${r.status}). Publicação abortada.\n` +
        (r.stderr ? `--- stderr do validador ---\n${r.stderr}\n` : '')
    );
    process.exit(3);
  }
  const porCodigo = Object.entries(out.errorsByCode ?? {}).map(([c, n]) => `  ${String(n).padStart(4)}  ${c}`).join('\n');
  const exemplos = (out.errors ?? []).slice(0, 5).map((e) => `  · [${e.code}] ${e.scope} · ${e.field}\n      ${e.message}`).join('\n');
  process.stderr.write(
    `\n${NOME}: PUBLICAÇÃO ABORTADA — o tasks.json não passa no gate de autossuficiência.\n` +
      `  Tasks: ${out.taskCount} | com FATAL: ${out.tasksWithFatal}\n  FATAL por código:\n${porCodigo}\n${exemplos}\n\n` +
      `Relatório completo: node ${validador} ${tasksPath} --report\n`
  );
  process.exit(3);
}

function git(args, cwd) {
  const r = spawnSync('git', args, { cwd, encoding: 'utf8' });
  return { status: r.status ?? 1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

const args = parseArgs(process.argv);
if (args.help) {
  ajuda();
  process.exit(0);
}

const repo = String(args.repo || process.env.GH_REPO || '').trim();
if (!/^[\w.-]+\/[\w.-]+$/.test(repo)) {
  process.stderr.write(`${NOME}: informe o repositório em --repo dono/repo ou em GH_REPO.\n`);
  process.exit(1);
}

const inputPath = caminhoEntrada(args.input);
let doc;
try {
  doc = loadTasksDocument(inputPath);
  checarSchema(doc);
} catch (e) {
  process.stderr.write(`${NOME}: não foi possível usar ${inputPath}: ${e?.message || e}\n`);
  process.exit(1);
}

gateAutossuficiencia(inputPath);

// Raiz do repositório e commit do permalink.
const top = git(['rev-parse', '--show-toplevel'], dirname(inputPath));
if (top.status !== 0) {
  process.stderr.write(`${NOME}: ${inputPath} não está num repositório git: ${top.stderr.trim()}\n`);
  process.exit(1);
}
const raiz = top.stdout.trim();
const sha = git(['rev-parse', 'HEAD'], raiz).stdout.trim();
const avisos = [];

const { permalinks, falhas } = resolverPrints(doc, { git: (a) => git(a, raiz), raiz, baseTasks: dirname(inputPath), repo, sha });
if (falhas.length) {
  process.stderr.write(`\n${NOME}: PUBLICAÇÃO ABORTADA — ${falhas.length} print(s) obrigatório(s) com problema:\n`);
  for (const f of falhas) process.stderr.write(`  · ${f.tela} (${f.story}): ${f.caminho} — ${f.motivo}\n`);
  process.stderr.write('Gere o print (sn-capture), faça o commit e o push, e rode de novo.\n');
  process.exit(4);
}
if (permalinks.size && !git(['branch', '-r', '--contains', sha], raiz).stdout.trim()) {
  avisos.push(`o commit ${sha.slice(0, 7)} não está em nenhum branch remoto; a imagem só abre no GitHub depois do push`);
}

let idMap;
const idMapPath = resolve(args.idMap ?? resolve(dirname(inputPath), 'id-map.json'));
try {
  idMap = lerIdMap(idMapPath, { obrigatorio: Boolean(args.idMap) && args.change });
} catch (e) {
  process.stderr.write(`${NOME}: ${e.message}\n`);
  process.exit(1);
}

const fio = lerFioCondutor(args.fio ? resolve(args.fio) : resolve(raiz, 'inputs', 'fio-condutor.md'));
const itens = montarItens(doc, { fio, permalinks });
const cliente = new ClienteGitHub({ repo, exec: executorGh() });

let plano;
try {
  plano = planejar(itens, cliente, { idMap, change: args.change });
} catch (e) {
  process.stderr.write(`${NOME}: não foi possível ler o estado do GitHub: ${e.message}\n`);
  process.exit(1);
}
plano.avisos.push(...avisos);

const resumo = (p) => ({
  ...p,
  acoes: p.acoes.map(({ corpo, ...resto }) => ({ ...resto, imagem: /\?raw=1\)/.test(corpo) })),
});

if (args.dryRun) {
  process.stdout.write(`${JSON.stringify({ mode: 'dry-run', ...resumo(plano) }, null, 2)}\n`);
  process.stderr.write(formatarPlano(plano));
  process.stderr.write('\nNada foi enviado ao GitHub (--dry-run).\n');
  process.exit(0);
}

process.stderr.write(formatarPlano(plano));
const salvar = () => {
  const out = Object.fromEntries([...idMap.entries()].sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(idMapPath, `${JSON.stringify(out, null, 2)}\n`);
};
const r = executar(plano, cliente, { idMap, salvar });
salvar();
process.stdout.write(`${JSON.stringify({ mode: plano.modo, repo, idMap: idMapPath, ...r }, null, 2)}\n`);
process.stderr.write(
  `\n${NOME}: ${r.criados.length} criada(s), ${r.atualizados.length} atualizada(s), ${r.semMudanca.length} sem mudança, ` +
    `${r.existentes.length} já existente(s), ${r.vinculados.length} vínculo(s) novo(s), ${r.jaVinculados.length} já vinculado(s); ` +
    `${r.erros.length} erro(s).\n`
);
for (const e of r.erros) process.stderr.write(`  [erro] ${e.item}: ${e.mensagem}\n`);
process.exit(r.erros.length ? 2 : 0);
