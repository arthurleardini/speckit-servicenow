#!/usr/bin/env node
/**
 * lint-sn.mjs — lint determinístico das RN-SN marcadas [AUTO] sobre o app Fluent (fork ServiceNow,
 * item 31). Lê `app/src/**` (`.now.ts`, `.ts`, `.js`) e devolve achados com `arquivo:linha`.
 *
 * Não substitui o `varrer-entrega.mjs` nem os scanners do Passo 0: é o sinal específico da plataforma
 * que eles não conhecem. Catálogo: `referencias/32-servicenow-boas-praticas-oficiais.md` (RN-SN).
 *
 * Uso:
 *   node .claude/skills/spec-code-audit/scripts/lint-sn.mjs [--app app] [--json]
 *
 * O escopo vem de `<app>/now.config.json` (`scope`); nunca é passado à mão.
 *
 * Exit codes: 0 sem achado ALTO · 1 com achado ALTO · 2 sem `<app>/src` ou sem `now.config.json`.
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const EXT = ['.now.ts', '.ts', '.js'];
const IGNORAR = new Set(['node_modules', 'dist', 'target', 'generated']);

function listar(dir) {
  const saida = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORAR.has(e.name)) continue;
    const p = join(dir, e.name);
    if (e.isDirectory()) saida.push(...listar(p));
    else if (EXT.some((x) => e.name.endsWith(x))) saida.push(p);
  }
  return saida.sort();
}

/** Regras por linha: { id, rn, sev, re, msg, quando? (contexto do arquivo) }. */
const POR_LINHA = [
  { id: 'SN_LOG_PROIBIDO', rn: 'RN-SN-12, RN-SN-84', sev: 'MÉDIO', re: /\bconsole\.(log|debug|info)\s*\(|\bgs\.(log|print)\s*\(|\balert\s*\(/, msg: 'log fora de gs.debug/info/warn/error (gs.log/gs.print não existem em escopo; console.log não vai para o system log)' },
  { id: 'SN_GETROWCOUNT', rn: 'RN-SN-20', sev: 'MÉDIO', re: /\.getRowCount\s*\(/, msg: 'contar com GlideAggregate (COUNT), não getRowCount()' },
  { id: 'SN_EVAL_SLEEP', rn: 'RN-SN-30', sev: 'ALTO', re: /\beval\s*\(|\bgs\.sleep\s*\(/, msg: 'eval() ou gs.sleep() no código' },
  { id: 'SN_SYSID_FIXO', rn: 'RN-SN-31', sev: 'MÉDIO', re: /['"`][0-9a-f]{32}['"`]/, msg: 'sys_id fixo no código — usar Now.ID/$id, gs.getProperty ou consulta' },
  { id: 'SN_CURRENT_UPDATE', rn: 'RN-SN-42', sev: 'ALTO', re: /\bcurrent\.update\s*\(/, msg: 'current.update() em Business Rule' },
  { id: 'SN_SETWORKFLOW_FALSE', rn: 'RN-SN-43', sev: 'BAIXO', re: /\.setWorkflow\s*\(\s*false\s*\)/, msg: 'setWorkflow(false) — exige justificativa escrita no comentário' },
  { id: 'SN_NOME_GENERICO', rn: 'RN-SN-11', sev: 'BAIXO', re: /\b(?:var|let|const)\s+(gr|ga|grs)\s*=/, msg: 'nome genérico de variável (gr/ga) que colide entre scripts' },
  { id: 'SN_GETXMLWAIT', rn: 'RN-SN-62', sev: 'MÉDIO', re: /\.getXMLWait\s*\(/, msg: 'GlideAjax síncrono (getXMLWait) no cliente' },
  { id: 'SN_GETREFERENCE', rn: 'RN-SN-63', sev: 'MÉDIO', re: /g_form\.getReference\s*\(/, msg: 'g_form.getReference() em Client Script' },
  { id: 'SN_ACESSO_PUBLICO', rn: 'RN-SN-72', sev: 'MÉDIO', re: /accessibleFrom\s*:\s*['"]public['"]|sandboxCallable\s*:\s*true/, msg: 'Script Include aberto a outro escopo ou sandboxCallable ligado' },
  { id: 'SN_ADDINFOMESSAGE_DEBUG', rn: 'RN-SN-84, RN-SN-85', sev: 'BAIXO', re: /gs\.addInfoMessage\s*\(\s*['"`](?:debug|DEBUG|teste|TESTE)/, msg: 'addInfoMessage de depuração' },
];

/** Linha dentro de um laço `while (x.next())` / `for`: consulta Glide nova ali é N+1 (RN-SN-22). */
function consultasEmLaco(linhas) {
  const achados = [];
  const pilha = []; // profundidades de chave em que um laço abriu
  let prof = 0;
  linhas.forEach((l, i) => {
    const abreLaco = /\b(while\s*\(.*\.next\s*\(\s*\)|for\s*\(|\.forEach\s*\()/.test(l);
    if (pilha.length && /new\s+(GlideRecord|GlideRecordSecure|GlideAggregate)\s*\(/.test(l)) {
      achados.push({ linha: i + 1, trecho: l.trim() });
    }
    for (const ch of l) {
      if (ch === '{') { prof++; }
      else if (ch === '}') { prof--; while (pilha.length && pilha[pilha.length - 1] > prof) pilha.pop(); }
    }
    if (abreLaco && /\{/.test(l)) pilha.push(prof);
  });
  return achados;
}

export function lint(appDir) {
  const cfgPath = join(appDir, 'now.config.json');
  const src = join(appDir, 'src');
  if (!existsSync(cfgPath) || !existsSync(src) || !statSync(src).isDirectory()) return null;
  const escopo = JSON.parse(readFileSync(cfgPath, 'utf8')).scope;
  const reOutroEscopo = /\bx_\d+_[a-z0-9]+(?=[_.'"`])/g;
  const reEscopoSolto = escopo ? new RegExp(`['"\`]${escopo}['"\`]`) : null;
  const achados = [];
  const add = (a) => achados.push(a);

  for (const arq of listar(src)) {
    const rel = relative(process.cwd(), arq).split(sep).join('/');
    const texto = readFileSync(arq, 'utf8').replace(/\r\n/g, '\n');
    const linhas = texto.split('\n');
    const clientCallable = /clientCallable\s*:\s*true/.test(texto) || /AbstractAjaxProcessor/.test(texto);
    const uiAction = /\bUiAction\s*\(/.test(texto);
    const ehBr = /\bBusinessRule\s*\(/.test(texto) || /[\\/]business-rule[\\/]/.test(arq);
    const ehSeed = /[\\/]seed[\\/]/.test(arq);

    linhas.forEach((l, i) => {
      if (/^\s*(\/\/|\*)/.test(l)) return;
      for (const r of POR_LINHA) {
        if (r.id === 'SN_SETWORKFLOW_FALSE' && setWorkflowJustificado(linhas, i)) continue;
        if (r.id === 'SN_CURRENT_UPDATE' && !ehBr) continue;
        if (r.re.test(l)) add({ regra: r.id, rn: r.rn, severidade: r.sev, arquivo: rel, linha: i + 1, mensagem: r.msg, trecho: l.trim().slice(0, 120) });
      }
      for (const m of l.matchAll(reOutroEscopo)) {
        if (escopo && m[0] !== escopo) add({ regra: 'SN_ESCOPO_ALHEIO', rn: 'RN-SN-148', severidade: 'MÉDIO', arquivo: rel, linha: i + 1, mensagem: `prefixo ${m[0]} diferente do escopo ${escopo} (app/now.config.json) — acesso a outro escopo exige CrossScopePrivilege`, trecho: l.trim().slice(0, 120) });
      }
      if (reEscopoSolto?.test(l) && !/[\\/]generated[\\/]/.test(arq)) {
        add({ regra: 'SN_ESCOPO_DIGITADO', rn: 'RN-SN-05', severidade: 'BAIXO', arquivo: rel, linha: i + 1, mensagem: `nome do escopo digitado no código — o escopo é o de app/now.config.json`, trecho: l.trim().slice(0, 120) });
      }
      if ((clientCallable || uiAction) && /new\s+GlideRecord\s*\(/.test(l) && !/can(Read|Write|Create|Delete)\s*\(/.test(texto)) {
        add({ regra: 'SN_GLIDERECORD_SEM_ACL', rn: 'RN-SN-80, RN-SN-147', severidade: 'ALTO', arquivo: rel, linha: i + 1, mensagem: 'GlideRecord em código chamado pelo usuário (client-callable/UI Action) sem canRead/canWrite — usar GlideRecordSecure', trecho: l.trim().slice(0, 120) });
      }
    });

    if (/clientCallable\s*:\s*true/.test(texto) && !/AbstractAjaxProcessor/.test(texto)) {
      const i = linhas.findIndex((l) => /clientCallable\s*:\s*true/.test(l));
      add({ regra: 'SN_CLIENT_CALLABLE_SEM_AJAX', rn: 'RN-SN-71', severidade: 'MÉDIO', arquivo: rel, linha: i + 1, mensagem: 'clientCallable: true sem estender global.AbstractAjaxProcessor', trecho: linhas[i].trim() });
    }
    if (/\bAcl\s*\(/.test(texto) && /operation\s*:\s*['"]read['"]/.test(texto) && /new\s+Glide(Record|Aggregate)/.test(texto)) {
      const i = linhas.findIndex((l) => /new\s+Glide(Record|Aggregate)/.test(l));
      add({ regra: 'SN_ACL_READ_COM_CONSULTA', rn: 'RN-SN-142', severidade: 'MÉDIO', arquivo: rel, linha: i + 1, mensagem: 'GlideRecord/GlideAggregate em ACL de read — roda por linha em list e report', trecho: linhas[i].trim() });
    }
    if (ehSeed && /\bRecord\s*\(/.test(texto) && !/installMethod\s*:\s*['"]demo['"]/.test(texto)) {
      const i = linhas.findIndex((l) => /\bRecord\s*\(/.test(l));
      add({ regra: 'SN_SEED_SEM_DEMO', rn: 'RN-SN-168', severidade: 'ALTO', arquivo: rel, linha: i + 1, mensagem: "Record() de seed sem $meta: { installMethod: 'demo' }", trecho: linhas[i].trim() });
    }
    for (const c of consultasEmLaco(linhas)) {
      add({ regra: 'SN_GLIDE_EM_LACO', rn: 'RN-SN-22', severidade: 'MÉDIO', arquivo: rel, linha: c.linha, mensagem: 'consulta Glide dentro de laço (N+1) — consultar uma vez fora do laço ou usar GlideAggregate', trecho: c.trecho.slice(0, 120) });
    }
  }
  return { escopo, achados };
}

/** setWorkflow(false) com justificativa na mesma linha ou na anterior não é achado. */
function setWorkflowJustificado(linhas, i) {
  return /justificativa|porque|motivo/i.test(linhas[i] + (linhas[i - 1] ?? ''));
}

function main(argv) {
  const k = argv.indexOf('--app');
  const app = k >= 0 ? argv[k + 1] : 'app';
  const r = lint(app);
  if (!r) {
    process.stderr.write(`lint-sn: ${app}/src ou ${app}/now.config.json ausente — nada a conferir.\n`);
    return 2;
  }
  if (argv.includes('--json')) process.stdout.write(`${JSON.stringify(r, null, 2)}\n`);
  else {
    process.stdout.write(`lint-sn: escopo ${r.escopo}, ${r.achados.length} achado(s).\n`);
    for (const a of r.achados) process.stdout.write(`  [${a.severidade}] ${a.regra} (${a.rn}) ${a.arquivo}:${a.linha} — ${a.mensagem}\n`);
  }
  return r.achados.some((a) => a.severidade === 'ALTO') ? 1 : 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  process.exitCode = main(process.argv.slice(2));
}
