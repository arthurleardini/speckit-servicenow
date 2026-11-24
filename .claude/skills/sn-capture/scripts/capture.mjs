#!/usr/bin/env node
// sn-capture — prints das telas na instância, na visão do papel (item 26 do design v0).
//
// Uso (via `npm run capture -- ...`):
//   (sem flags)          todas as telas do outputs/spec/screens-manifest.json → outputs/spec/screens/<TEL>.png
//   --story <ID>         grava em outputs/spec/screens/deliver/<ID>-<TEL>.png (não mexe no manifesto)
//   --tel <TEL>[,<TEL>]  só as telas listadas
//   --manifesto <arq>    outro manifesto (os PNG ficam em <pasta do manifesto>/screens/)
//   --moldura            abre a rota dentro do cabeçalho da instância (/now/nav/ui/classic/...)
//
// Login como o usuário da credencial (admin), impersonate de demo.<role> da tela, abre a rota,
// espera a carga, PNG 1440×900 (< 5 MB). Desfaz a impersonação no fim. Sai ≠ 0 se alguma rota falhar.
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  RAIZ, abrirNavegador, buscar, carregarCredencial, login, urlInstancia,
} from '../../sn-reinstall/scripts/lib/instancia.mjs';

export const LARGURA = 1440;
export const ALTURA = 900;
export const LIMITE_BYTES = 5 * 1024 * 1024;
/** Textos da UI clássica que indicam rota quebrada ou sem acesso. */
export const RE_FALHA = /Record not found|Registro não encontrado|Security constraints prevent access|Restrições de segurança impedem|Invalid table|Tabela inválida|Page not found|Página não encontrada/i;

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

/** Caminho do PNG relativo à pasta do manifesto (convenção: screens/<TEL>.png). */
export function caminhoPng(tel, story) {
  return story ? `screens/deliver/${story}-${tel}.png` : `screens/${tel}.png`;
}

export function urlDaRota(base, rota, moldura) {
  return moldura ? `${base}/now/nav/ui/classic/params/target/${encodeURIComponent(rota.replace(/^\//, ''))}` : base + rota;
}

async function impersonar(page, userSysId) {
  const ck = await page.evaluate(() => window.g_ck);
  if (!ck) throw new Error('sessão sem g_ck (token de UI) para impersonar');
  const r = await page.request.post(`${urlInstancia()}/api/now/ui/impersonate/${userSysId}`, {
    headers: { 'X-UserToken': ck, Accept: 'application/json', 'Content-Type': 'application/json' },
    data: {},
  });
  if (r.status() >= 300) throw new Error(`impersonate HTTP ${r.status()}`);
}

async function usuarioDaPagina(page) {
  return page.evaluate(() => (window.g_user && window.g_user.userName) || (window.NOW && window.NOW.user_name) || null);
}

export async function executar(args) {
  carregarCredencial();
  const arqManifesto = resolve(RAIZ, args.manifesto ?? 'outputs/spec/screens-manifest.json');
  if (!existsSync(arqManifesto)) throw new Error(`manifesto ausente: ${arqManifesto} (rodar sn-scaffold)`);
  const manifesto = JSON.parse(readFileSync(arqManifesto, 'utf8'));
  const base = dirname(arqManifesto);
  const filtro = args.tel ? new Set(String(args.tel).split(',')) : null;
  const telas = (manifesto.screens ?? []).filter((s) => !filtro || filtro.has(s.id));
  if (!telas.length) throw new Error('nenhuma tela para capturar');

  // Usuários demo por papel, e o próprio usuário (para desfazer a impersonação).
  const papeis = [...new Set(telas.map((t) => t.role).filter(Boolean))];
  const usuarios = new Map();
  for (const p of papeis) {
    const [u] = await buscar('sys_user', `user_name=demo.${p}`, 'sys_id', 1);
    if (!u) throw new Error(`usuário demo.${p} não existe na instância (rodar npm run reinstall)`);
    usuarios.set(p, u.sys_id);
  }
  const [eu] = await buscar('sys_user', `user_name=${process.env.SN_SDK_USER}`, 'sys_id', 1);

  const nav = await abrirNavegador();
  const falhas = [];
  let page;
  let impersonando = null;
  try {
    const ctx = await nav.newContext({ viewport: { width: LARGURA, height: ALTURA }, locale: 'pt-BR' });
    page = await login(ctx);
    await page.goto(`${urlInstancia()}/sys_user_list.do?sysparm_query=sys_id=-1`, { waitUntil: 'domcontentloaded' });
    for (const tela of telas) {
      try {
        const alvo = tela.role ? usuarios.get(tela.role) : eu?.sys_id;
        if (alvo && alvo !== impersonando) {
          await impersonar(page, alvo);
          impersonando = alvo;
        }
        const resp = await page.goto(urlDaRota(urlInstancia(), tela.route, args.moldura), { waitUntil: 'networkidle', timeout: 60000 });
        if (resp && resp.status() >= 400) throw new Error(`HTTP ${resp.status()}`);
        await page.waitForTimeout(args.moldura ? 4000 : 1000);
        if (/login\.do/.test(page.url())) throw new Error('sessão caiu para o login');
        const corpo = await page.locator('body').innerText().catch(() => '');
        const msg = corpo.match(RE_FALHA);
        if (msg) throw new Error(`a tela mostra "${msg[0]}"`);
        const quem = await usuarioDaPagina(page);
        if (tela.role && quem && quem !== `demo.${tela.role}`) throw new Error(`impersonação não aplicada (usuário ${quem})`);
        const rel = caminhoPng(tela.id, args.story);
        const arq = join(base, rel);
        mkdirSync(dirname(arq), { recursive: true });
        await page.screenshot({ path: arq, fullPage: false });
        const tam = statSync(arq).size;
        if (tam >= LIMITE_BYTES) throw new Error(`PNG com ${tam} bytes (limite 5 MB)`);
        if (!args.story) {
          tela.screenshot = rel;
          tela.capturedAt = new Date().toISOString();
        }
        console.log(`capture: ${tela.id} (${tela.role ?? 'admin'}) → ${relative(RAIZ, arq)}`);
      } catch (e) {
        falhas.push(`${tela.id} ${tela.route}: ${e.message}`);
        console.error(`capture: falhou ${tela.id}: ${e.message}`);
      }
    }
  } finally {
    if (page && impersonando && eu && impersonando !== eu.sys_id) {
      try { await impersonar(page, eu.sys_id); console.log('capture: impersonação desfeita'); } catch (e) { console.error(`capture: não desfez a impersonação: ${e.message}`); }
    }
    await nav.close();
  }
  if (!args.story) writeFileSync(arqManifesto, JSON.stringify(manifesto, null, 2) + '\n');
  return { falhas, total: telas.length };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  executar(lerArgs(process.argv.slice(2)))
    .then(({ falhas, total }) => {
      console.log(`capture: ${total - falhas.length}/${total} tela(s)`);
      process.exit(falhas.length ? 1 : 0);
    })
    .catch((e) => { console.error(`capture: ${e.message}`); process.exit(2); });
}
