// Acesso à instância ServiceNow, compartilhado por reinstall.mjs, capture.mjs e atf.mjs.
//
// A credencial mora em `.env.instancia` (fora do git). Este módulo carrega o arquivo em process.env
// e NUNCA imprime valores: as mensagens citam só o nome das variáveis.
import { existsSync, readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
/** Raiz do repositório: .claude/skills/sn-reinstall/scripts/lib → 5 níveis acima. */
export const RAIZ = resolve(AQUI, '..', '..', '..', '..', '..');
export const APP = join(RAIZ, 'app');
export const SDK_BIN = join(APP, 'node_modules', '@servicenow', 'sdk', 'bin', 'index.js');

const OBRIGATORIAS = ['SN_SDK_INSTANCE_URL', 'SN_SDK_USER', 'SN_SDK_USER_PWD'];

/** Carrega `.env.instancia` (se existir) e confere as variáveis obrigatórias. */
export function carregarCredencial({ arquivo = join(RAIZ, '.env.instancia') } = {}) {
  if (existsSync(arquivo)) process.loadEnvFile(arquivo);
  const faltam = OBRIGATORIAS.filter((v) => !process.env[v]);
  if (faltam.length) {
    throw new Error(`credencial incompleta: faltam ${faltam.join(', ')} (ver .env.example)`);
  }
  if (!process.env.SN_SDK_NODE_ENV) process.env.SN_SDK_NODE_ENV = 'SN_SDK_CI_INSTALL';
  if (!process.env.SN_SDK_AUTH_TYPE) process.env.SN_SDK_AUTH_TYPE = 'basic';
  return { url: process.env.SN_SDK_INSTANCE_URL.replace(/\/+$/, '') };
}

export function urlInstancia() {
  return process.env.SN_SDK_INSTANCE_URL.replace(/\/+$/, '');
}

function cabecalhoBasic() {
  const tok = Buffer.from(`${process.env.SN_SDK_USER}:${process.env.SN_SDK_USER_PWD}`).toString('base64');
  return `Basic ${tok}`;
}

/** Chamada REST com basic auth. Devolve { status, headers, json }. */
export async function rest(caminho, { method = 'GET', body } = {}) {
  const resp = await fetch(urlInstancia() + caminho, {
    method,
    headers: {
      Authorization: cabecalhoBasic(),
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  let json = null;
  try { json = await resp.json(); } catch { /* corpo vazio */ }
  return { status: resp.status, headers: resp.headers, json };
}

/** Lê uma propriedade de sistema (sys_properties). `null` se não existir. */
export async function lerPropriedade(nome) {
  const q = encodeURIComponent(`name=${nome}`);
  const r = await rest(`/api/now/table/sys_properties?sysparm_query=${q}&sysparm_fields=value&sysparm_limit=1`);
  if (r.status !== 200) throw new Error(`sys_properties ${nome}: HTTP ${r.status}`);
  return r.json?.result?.[0]?.value ?? null;
}

/** Conta registros de uma tabela pela Aggregate API (/api/now/stats). `null` se a tabela não existir. */
export async function contar(tabela, query = '') {
  const q = query ? `&sysparm_query=${encodeURIComponent(query)}` : '';
  const r = await rest(`/api/now/stats/${tabela}?sysparm_count=true${q}`);
  if (r.status === 400 || r.status === 404) return null;
  if (r.status !== 200) throw new Error(`stats ${tabela}: HTTP ${r.status}`);
  return Number(r.json?.result?.stats?.count ?? 0);
}

/** Busca registros pela Table API. */
export async function buscar(tabela, query, campos = 'sys_id', limite = 100) {
  const r = await rest(
    `/api/now/table/${tabela}?sysparm_query=${encodeURIComponent(query)}&sysparm_fields=${campos}&sysparm_limit=${limite}`,
  );
  if (r.status !== 200) throw new Error(`table ${tabela}: HTTP ${r.status}`);
  return r.json?.result ?? [];
}

/**
 * Roda o CLI do SDK a partir de app/ com a credencial no ambiente.
 * `eco: true` repassa a saída ao terminal; o retorno traz stdout/stderr capturados quando eco=false.
 */
export function sdk(args, { eco = true, timeout = 20 * 60 * 1000 } = {}) {
  if (!existsSync(SDK_BIN)) throw new Error(`SDK não encontrado em ${SDK_BIN} (rodar npm install em app/)`);
  const r = spawnSync(process.execPath, [SDK_BIN, ...args], {
    cwd: APP,
    env: process.env,
    encoding: 'utf8',
    stdio: eco ? 'inherit' : 'pipe',
    timeout,
    maxBuffer: 64 * 1024 * 1024,
  });
  return { status: r.status ?? 1, stdout: r.stdout ?? '', stderr: r.stderr ?? '' };
}

/** Extrai o primeiro objeto JSON de uma saída de CLI (o SDK imprime o envelope com -o json). */
export function extrairJson(texto) {
  const i = texto.indexOf('{');
  if (i < 0) return null;
  for (let fim = texto.lastIndexOf('}'); fim > i; fim = texto.lastIndexOf('}', fim - 1)) {
    try { return JSON.parse(texto.slice(i, fim + 1)); } catch { /* tenta um fecho anterior */ }
  }
  return null;
}

/** Commit atual (HEAD) ou `null` fora de repositório git. */
export function commitAtual(args = ['rev-parse', 'HEAD']) {
  const r = spawnSync('git', args, { cwd: RAIZ, encoding: 'utf8' });
  return r.status === 0 ? r.stdout.trim() || null : null;
}

/** Escopo do app lido de app/now.config.json. */
export function lerEscopo(appDir = APP) {
  const cfg = JSON.parse(readFileSync(join(appDir, 'now.config.json'), 'utf8'));
  return { scope: cfg.scope, scopeId: cfg.scopeId, name: cfg.name };
}

/** Lê o sys_id de um Now.ID a partir de app/src/fluent/generated/keys.ts. `null` se ausente ou deletado. */
export function sysIdDaChave(chave, appDir = APP) {
  const arq = join(appDir, 'src', 'fluent', 'generated', 'keys.ts');
  if (!existsSync(arq)) return null;
  const txt = readFileSync(arq, 'utf8');
  const esc = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`(?:^|\\s)['"]?${esc}['"]?\\s*:\\s*\\{([^}]*)\\}`, 'm');
  const m = txt.match(re);
  if (!m) return null;
  if (/deleted:\s*true/.test(m[1])) return null;
  const id = m[1].match(/id:\s*'([0-9a-f]{32})'/);
  return id ? id[1] : null;
}

// —— Playwright ——

/** Faz login na UI clássica (/login.do). Devolve a página logada. */
export async function login(contexto) {
  const page = await contexto.newPage();
  await page.goto(urlInstancia() + '/login.do', { waitUntil: 'domcontentloaded' });
  await page.fill('#user_name', process.env.SN_SDK_USER);
  await page.fill('#user_password', process.env.SN_SDK_USER_PWD);
  await Promise.all([
    page.waitForLoadState('domcontentloaded'),
    page.click('#sysverb_login'),
  ]);
  await page.waitForTimeout(1500);
  if (page.url().includes('login.do') && (await page.locator('#user_password').count())) {
    throw new Error('login na instância falhou (conferir usuário e senha em .env.instancia)');
  }
  return page;
}

export async function abrirNavegador() {
  const { chromium } = await import(join(RAIZ, 'node_modules', 'playwright', 'index.mjs'));
  return chromium.launch({ headless: true });
}
