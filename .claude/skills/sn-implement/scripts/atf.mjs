#!/usr/bin/env node
// atf.mjs — leitor único de ATF do kit (item 29 do design v0; desfecho A do item 9).
//
// Uso (a partir da raiz, via `npm run atf -- ...`):
//   --story <ID>          roda os Test() de app/src/fluent/tests/<ID>.now.ts (sys_id lido do keys.ts)
//   --suite <nome>        roda a TestSuite pelo nome (`cicd testsuite run`)
//   --test-sys-id <id>    roda um teste pelo sys_id (`cicd test run`)
//   --sem-runner          não abre o Client Test Runner (só teste de servidor)
//   --com-runner          abre o runner mesmo quando a story não tem passo de UI
//   --recibo-dir <dir>    pasta do recibo (padrão outputs/spec/auditorias/atf)
//
// Grava o recibo <dir>/<STORY|suite|test-sysid>.json { sys_id, resultId, status, horario, commit, ... }
// e sai com código ≠ 0 se algum teste falhar.
import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  APP, RAIZ, SDK_BIN, abrirNavegador, buscar, carregarCredencial, commitAtual, extrairJson, login, urlInstancia,
} from '../../sn-reinstall/scripts/lib/instancia.mjs';

/** Passos que precisam de navegador (Client Test Runner). */
export const RE_PASSO_UI = /\batf\.(form|form_SP|list|catalog|catalog_SP|applicationNavigator|uiTestScript|responsiveDashboard|reporting)\./;

export function lerArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) continue;
    const prox = argv[i + 1];
    if (prox === undefined || prox.startsWith('--')) a[k.slice(2)] = true;
    else { a[k.slice(2)] = prox; i++; }
  }
  return a;
}

/** Chaves Now.ID dos Test() de um arquivo, resolvidas para sys_id pelo keys.ts (tabela sys_atf_test). */
export function testesDoArquivo(fonte, keysTxt) {
  const chaves = [...fonte.matchAll(/Test\(\s*\{\s*\$id:\s*Now\.ID\[\s*['"]([^'"]+)['"]\s*\]/g)].map((m) => m[1]);
  return chaves.map((chave) => {
    const esc = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const m = keysTxt.match(new RegExp(`(?:^|\\s)['"]?${esc}['"]?\\s*:\\s*\\{([^}]*)\\}`, 'm'));
    const corpo = m?.[1] ?? '';
    const id = /table:\s*'sys_atf_test'/.test(corpo) && !/deleted:\s*true/.test(corpo) ? corpo.match(/id:\s*'([0-9a-f]{32})'/)?.[1] : null;
    return { chave, sysId: id ?? null };
  });
}

/** Diz se o Test() da chave tem passo de UI: o trecho vai da chave até o próximo `Test(`. */
export function temPassoUi(fonte, chave) {
  const ini = fonte.indexOf(`Now.ID['${chave}']`) >= 0 ? fonte.indexOf(`Now.ID['${chave}']`) : fonte.indexOf(`Now.ID["${chave}"]`);
  if (ini < 0) return RE_PASSO_UI.test(fonte);
  const prox = fonte.indexOf('Test(', ini);
  return RE_PASSO_UI.test(fonte.slice(ini, prox < 0 ? undefined : prox));
}

/** Lê status e id de resultado do envelope JSON do `now-sdk cicd ... -o json`. */
// Formato observado (SDK 4.14.3): { ok, result: {status_label: 'Pending', ...}, progress: { successful,
// statusMessage, links.results.id }, interpretedResult: { successful, summary: { resultId,
// testSuiteStatus|testStatus, successCount, failureCount, ... }, displayMessage } }.
export function lerEnvelope(env) {
  const sum = env?.interpretedResult?.summary ?? {};
  const prog = env?.progress ?? {};
  const sucesso = env?.interpretedResult?.successful ?? prog.successful;
  const status = sum.testSuiteStatus ?? sum.testStatus ?? sum.status
    ?? (sucesso === true ? 'success' : sucesso === false ? 'failure' : null);
  const resultId = sum.resultId ?? prog.links?.results?.id ?? null;
  const resumo = {};
  for (const k of ['successCount', 'failureCount', 'errorCount', 'skipCount']) if (k in sum) resumo[k] = sum[k];
  return {
    status: status == null ? null : String(status),
    resultId,
    resumo,
    mensagem: env?.interpretedResult?.displayMessage ?? prog.statusMessage ?? null,
    url: sum.resultUrl ?? null,
  };
}

async function abrirRunner() {
  const nav = await abrirNavegador();
  const ctx = await nav.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await login(ctx);
  await page.goto(`${urlInstancia()}/atf_test_runner.do?sysparm_nostack=true&sysparm_scheduled_tests_only=true`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000); // o runner precisa se registrar como agendado antes do disparo
  console.log('atf: Client Test Runner aberto (agendados)');
  return nav;
}

/**
 * O CLI do SDK em processo filho ASSÍNCRONO. Com o `spawnSync` de antes, o laço de eventos do Node
 * parava enquanto o teste rodava, o Playwright deixava de ler a conexão com o Chromium do runner, o
 * runner travava ao encher o buffer (ele loga muito) e o teste de form ficava `running` até o timeout
 * de 600 s, com todos os passos verdes (Deliver, 2026-11-24).
 */
function sdkAssincrono(args) {
  return new Promise((ok) => {
    const filho = spawn(process.execPath, [SDK_BIN, ...args], { cwd: APP, env: process.env });
    let stdout = '';
    let stderr = '';
    filho.stdout.on('data', (d) => { stdout += d; });
    filho.stderr.on('data', (d) => { stderr += d; });
    const limite = setTimeout(() => filho.kill('SIGTERM'), 20 * 60 * 1000);
    filho.on('close', (status) => { clearTimeout(limite); ok({ status: status ?? 1, stdout, stderr }); });
  });
}

async function rodar(args) {
  const r = await sdkAssincrono([...args, '-o', 'json']);
  const env = extrairJson(r.stdout) ?? extrairJson(r.stderr);
  const { status, resultId, resumo, mensagem, url } = lerEnvelope(env);
  const ok = r.status === 0 && status !== 'failure' && status !== 'error';
  if (mensagem) console.log(mensagem);
  if (!ok) process.stderr.write((r.stderr || r.stdout).slice(-4000));
  return { ok, exit: r.status, status: status ?? (ok ? 'success' : 'failure'), resultId, resumo, url, envelope: env };
}

export async function executar(args) {
  carregarCredencial();
  const alvo = args.story ? { tipo: 'story', nome: String(args.story) }
    : args.suite ? { tipo: 'suite', nome: String(args.suite) }
      : args['test-sys-id'] ? { tipo: 'teste', nome: `test-${args['test-sys-id']}` }
        : null;
  if (!alvo) throw new Error('informar --story <ID>, --suite <nome> ou --test-sys-id <id>');

  const execucoes = [];
  let precisaRunner = !args['sem-runner'];
  let testes = [];
  let fonteStory = '';
  if (alvo.tipo === 'story') {
    const arq = join(APP, 'src', 'fluent', 'tests', `${alvo.nome}.now.ts`);
    if (!existsSync(arq)) throw new Error(`arquivo de teste ausente: ${arq}`);
    const fonte = readFileSync(arq, 'utf8');
    const keysTxt = readFileSync(join(APP, 'src', 'fluent', 'generated', 'keys.ts'), 'utf8');
    testes = testesDoArquivo(fonte, keysTxt);
    if (!testes.length) throw new Error(`nenhum Test() em ${arq}`);
    const sem = testes.filter((t) => !t.sysId).map((t) => t.chave);
    if (sem.length) throw new Error(`teste sem sys_id no keys.ts (rodar npm run reinstall antes): ${sem.join(', ')}`);
    precisaRunner = !args['sem-runner'] && (Boolean(args['com-runner']) || RE_PASSO_UI.test(fonte));
    fonteStory = fonte;
  }

  let nav = null;
  let usouRunner = false;
  // Story: um runner só, aberto no primeiro Test() com passo de UI e mantido até o fim. Fechar e abrir
  // um runner por teste deixava o teste seguinte atribuído ao agente recém-fechado, que a instância
  // ainda via online — e o teste esperava até o timeout de 600 s (Deliver, 2026-11-24).
  if (precisaRunner && alvo.tipo !== 'story') { nav = await abrirRunner(); usouRunner = true; }
  try {
    if (alvo.tipo === 'story') {
      for (const t of testes) {
        if (!nav && precisaRunner && (args['com-runner'] || temPassoUi(fonteStory, t.chave))) { nav = await abrirRunner(); usouRunner = true; }
        console.log(`atf: rodando ${t.chave} (${t.sysId})`);
        execucoes.push({ chave: t.chave, sys_id: t.sysId, ...await rodar(['cicd', 'test', 'run', '--test-sys-id', t.sysId]) });
      }
    } else if (alvo.tipo === 'suite') {
      const [s] = await buscar('sys_atf_test_suite', `name=${alvo.nome}`, 'sys_id,name', 2);
      if (!s) throw new Error(`suíte "${alvo.nome}" não existe na instância`);
      console.log(`atf: rodando suíte ${alvo.nome} (${s.sys_id})`);
      execucoes.push({ chave: alvo.nome, sys_id: s.sys_id, ...await rodar(['cicd', 'testsuite', 'run', '--test-suite-sys-id', s.sys_id]) });
    } else {
      const id = String(args['test-sys-id']);
      console.log(`atf: rodando teste ${id}`);
      execucoes.push({ chave: id, sys_id: id, ...await rodar(['cicd', 'test', 'run', '--test-sys-id', id]) });
    }
  } finally {
    if (nav) await nav.close();
  }

  const passou = execucoes.every((e) => e.ok);
  const recibo = {
    alvo: alvo.nome,
    tipo: alvo.tipo,
    sys_id: execucoes.length === 1 ? execucoes[0].sys_id : execucoes.map((e) => e.sys_id),
    resultId: execucoes.length === 1 ? execucoes[0].resultId : execucoes.map((e) => e.resultId),
    status: passou ? 'success' : 'failure',
    horario: new Date().toISOString(),
    commit: commitAtual(),
    runner: usouRunner,
    testes: execucoes.map(({ envelope, ...resto }) => { void envelope; return resto; }),
  };
  const dir = resolve(RAIZ, args['recibo-dir'] ?? 'outputs/spec/auditorias/atf');
  mkdirSync(dir, { recursive: true });
  const arq = join(dir, `${alvo.nome}.json`);
  writeFileSync(arq, JSON.stringify(recibo, null, 2) + '\n');
  console.log(`atf: ${recibo.status} — recibo em ${arq}`);
  return { passou, recibo, arquivo: arq };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  executar(lerArgs(process.argv.slice(2)))
    .then((r) => process.exit(r.passou ? 0 : 1))
    .catch((e) => { console.error(`atf: ${e.message}`); process.exit(2); });
}
