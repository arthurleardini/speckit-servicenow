#!/usr/bin/env node
// sn-reinstall — build + install do app Fluent na instância, com conferências (item 30 do design v0).
//
// Uso (via `npm run reinstall -- ...`):
//   (sem flags)          prefixo → documentos → poda do keys.ts → build → install → contagem → suíte cob-regressao → sync-log
//   --frozen             build com --frozenKeys (falha se o keys.ts mudaria; uso em CI/ensaio)
//   --zerar --confirmo   install --reinstall (desinstala e reinstala; apaga o que foi criado na instância)
//   --sem-atf            pula a suíte ATF
//   --suite <nome>       suíte a rodar (padrão cob-regressao)
//   --sync-log <arq>     caminho do sync-log (padrão outputs/spec/sync-log.md)
//
// Idempotente: os $id são fixos, então rodar duas vezes dá a mesma contagem.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  APP, RAIZ, buscar, carregarCredencial, commitAtual, contar, lerEscopo, lerPropriedade, rest, sdk,
} from './lib/instancia.mjs';
import { cnpjValido, cpfValido, RE_CNPJ, RE_CPF } from '../../sn-seed/scripts/gerar-seed.mjs';
import { CABECALHO_SECAO_A, lerLinhasSecaoA, montarLinhaSecaoA } from '../../../hooks/kit.mjs';

const SEED = join(APP, 'src', 'fluent', 'seed');
const KEYS = join(APP, 'src', 'fluent', 'generated', 'keys.ts');
const TEMPLATE_SYNC = join(RAIZ, '.claude', 'skills', 'spec-iterate', 'templates', 'sync-log.md');

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

/** O escopo x_<prefixo>_<app> precisa usar o prefixo da instância. */
export function prefixoConfere(escopo, prefixo) {
  return Boolean(prefixo) && escopo.startsWith(`x_${prefixo}_`);
}

/** Todo CPF/CNPJ que aparece no seed tem DV válido e está em _documentos.json. Devolve a lista de problemas. */
export function conferirDocumentos(dirSeed = SEED) {
  if (!existsSync(dirSeed)) return [];
  const arqDocs = join(dirSeed, '_documentos.json');
  const docs = existsSync(arqDocs) ? JSON.parse(readFileSync(arqDocs, 'utf8')) : { documentos: [] };
  const conhecidos = new Set((docs.documentos ?? []).map((d) => d.valor));
  const problemas = [];
  for (const f of readdirSync(dirSeed).filter((x) => x.endsWith('.now.ts'))) {
    const txt = readFileSync(join(dirSeed, f), 'utf8');
    for (const v of txt.match(RE_CPF) ?? []) {
      if (!conhecidos.has(v)) problemas.push(`${f}: CPF ${v} fora de _documentos.json`);
      else if (!cpfValido(v)) problemas.push(`${f}: CPF ${v} com DV inválido`);
    }
    for (const v of txt.match(RE_CNPJ) ?? []) {
      if (!conhecidos.has(v)) problemas.push(`${f}: CNPJ ${v} fora de _documentos.json`);
      else if (!cnpjValido(v)) problemas.push(`${f}: CNPJ ${v} com DV inválido`);
    }
  }
  return problemas;
}

/** Compara a contagem da instância com _contagem.json. Devolve { linhas, divergencias, total }. */
export async function conferirContagem(contador = contar, dirSeed = SEED) {
  const arq = join(dirSeed, '_contagem.json');
  if (!existsSync(arq)) return { linhas: [], divergencias: [], total: 0 };
  const esperado = JSON.parse(readFileSync(arq, 'utf8'));
  const linhas = [];
  const divergencias = [];
  let total = 0;
  for (const [tab, n] of Object.entries(esperado.tabelas ?? {})) {
    const obtido = await contador(tab, '');
    total += obtido ?? 0;
    linhas.push(`${tab}: ${obtido} (esperado ${n})`);
    if (obtido !== n) divergencias.push(`${tab}: ${obtido} ≠ ${n}`);
  }
  for (const x of esperado.extras ?? []) {
    const obtido = await contador(x.tabela, x.query);
    const ok = x.minimo ? obtido >= x.esperado : obtido === x.esperado;
    linhas.push(`${x.tabela}[${x.query}]: ${obtido} (esperado ${x.minimo ? '≥ ' : ''}${x.esperado})`);
    if (!ok) divergencias.push(`${x.tabela}[${x.query}]: ${obtido} vs ${x.esperado}`);
  }
  return { linhas, divergencias, total };
}

/** Insere a linha no topo da tabela da Seção A (mais recente primeiro). Cria o arquivo pelo template. */
export function registrarSyncLog(arquivo, campos, agora = new Date()) {
  let texto;
  if (existsSync(arquivo)) texto = readFileSync(arquivo, 'utf8');
  else if (existsSync(TEMPLATE_SYNC)) texto = readFileSync(TEMPLATE_SYNC, 'utf8');
  else texto = `# Log de sincronização\n\n## Seção A — Execuções de skills (timeline)\n\n${CABECALHO_SECAO_A}\n`;
  const numero = Math.max(0, ...lerLinhasSecaoA(texto).map((l) => l.numero)) + 1;
  const p2 = (n) => String(n).padStart(2, '0');
  const data = `${agora.getFullYear()}-${p2(agora.getMonth() + 1)}-${p2(agora.getDate())}`;
  const hora = `${p2(agora.getHours())}:${p2(agora.getMinutes())}`;
  const linha = montarLinhaSecaoA({ numero, data, hora, ...campos });
  const linhas = texto.split('\n');
  const iCab = linhas.findIndex((l) => /^\|\s*#\s*\|\s*Data\/Hora\s*\|/.test(l));
  if (iCab < 0) {
    linhas.push('', '## Seção A — Execuções de skills (timeline)', '', CABECALHO_SECAO_A, linha);
  } else {
    linhas.splice(iCab + 2, 0, linha);
  }
  texto = linhas.join('\n').replace(/^Última atualização: .*$/m, `Última atualização: ${data}`);
  mkdirSync(dirname(arquivo), { recursive: true });
  writeFileSync(arquivo, texto);
  return linha;
}

/**
 * Registros de dados que saíram da fonte (`deleted: true` no keys.ts). O install aplica o DELETE de
 * metadado, mas não apaga registro de tabela de dados (seed, sys_user, journal) — verificado em
 * 2026-11-24. Estes ficam para o reinstall apagar pela REST API.
 */
export function orfaosDeDados(keysTxt, escopo) {
  const tabelasDeDados = (t) => t.startsWith(`${escopo}_`) || ['sys_user', 'sys_user_has_role', 'sys_journal_field'].includes(t);
  const out = [];
  const re = /\{\s*table:\s*'([a-z0-9_]+)'\s*id:\s*'([0-9a-f]{32})'\s*deleted:\s*true\s*\}/g;
  for (const m of keysTxt.matchAll(re)) if (tabelasDeDados(m[1])) out.push({ tabela: m[1], sysId: m[2] });
  return out;
}

/**
 * Entradas `deleted: true` do keys.ts e a tabela a que cada uma pertence.
 *
 * LIÇÃO DO ESTÁGIO 1 (2026-11-24): quando uma tabela do app sai do modelo e é apagada da instância
 * (`now-sdk exec`, ver SKILL.md), o keys.ts continua com as entradas `deleted: true` dela — os
 * registros do seed, o `sys_dictionary`, o `sys_documentation`, o `sys_choice`. No install seguinte
 * o SDK as transforma em DELETE no `author_elective_update`, a tabela já não existe e o install
 * quebra com "this.fPrimaryKey is null". A saída é tirar essas entradas do keys.ts antes do build.
 *
 * A tabela-alvo é a do próprio registro quando ela é do app (`<escopo>_*`, como o seed), ou o
 * `key.name` do registro de metadado quando ele aponta para uma tabela do app. Entrada sem alvo do
 * app (role `<escopo>.x`, ACL, módulo) fica de fora: ela não depende de tabela apagada.
 *
 * O keys.ts gerado põe um campo por linha e cada `{`/`}` no fim da linha; a varredura conta chaves
 * por linha. Devolve `[{ inicio, fim, tabela, alvo, id }]`, com `inicio`/`fim` em índice de linha.
 */
export function entradasDeletadas(keysTxt, escopo) {
  const linhas = String(keysTxt).split('\n');
  const abre = (l) => (l.match(/\{/g) || []).length;
  const fecha = (l) => (l.match(/\}/g) || []).length;
  const doApp = (t) => Boolean(t) && t.startsWith(`${escopo}_`);
  const out = [];
  for (let i = 0; i < linhas.length; i++) {
    if (!/^\s*deleted:\s*true\s*,?\s*$/.test(linhas[i])) continue;
    let ini = i - 1;
    for (let d = 0; ini >= 0; ini--) {
      d += fecha(linhas[ini]) - abre(linhas[ini]);
      if (d < 0) break;
    }
    let fim = i + 1;
    for (let d = 0; fim < linhas.length; fim++) {
      d += abre(linhas[fim]) - fecha(linhas[fim]);
      if (d < 0) break;
    }
    if (ini < 0 || fim >= linhas.length) continue;
    let prof = 0;
    let tabela = null; let id = null; let nomeChave = null; let naChave = false;
    for (const l of linhas.slice(ini + 1, fim)) {
      if (prof === 0) {
        const t = /^\s*table:\s*'([^']+)'/.exec(l); if (t) tabela = t[1];
        const k = /^\s*id:\s*'([^']+)'/.exec(l); if (k) id = k[1];
        naChave = /^\s*key:\s*\{\s*$/.test(l);
      } else if (prof === 1 && naChave && nomeChave == null) {
        const n = /^\s*name:\s*'([^']+)'/.exec(l); if (n) nomeChave = n[1];
      }
      prof += abre(l) - fecha(l);
    }
    const alvo = doApp(tabela) ? tabela : (doApp(nomeChave) ? nomeChave : null);
    if (alvo) out.push({ inicio: ini, fim, tabela, alvo, id });
  }
  return out;
}

/** Tira do keys.ts as entradas `deleted: true` cuja tabela-alvo está em `inexistentes`. Puro. */
export function podarKeys(keysTxt, escopo, inexistentes) {
  const fora = new Set(inexistentes);
  const remover = entradasDeletadas(keysTxt, escopo).filter((e) => fora.has(e.alvo));
  const apagar = new Set();
  for (const e of remover) for (let k = e.inicio; k <= e.fim; k++) apagar.add(k);
  const texto = String(keysTxt).split('\n').filter((_, k) => !apagar.has(k)).join('\n');
  return { texto, removidas: remover.map(({ tabela, alvo, id }) => ({ tabela, alvo, id })) };
}

/**
 * Pergunta à instância quais tabelas-alvo de entradas `deleted: true` não existem mais e as poda.
 * `existeTabela(nome) → Promise<boolean>` é injetável: o teste não toca instância.
 */
export async function podarKeysOrfas(keysTxt, escopo, existeTabela) {
  const alvos = [...new Set(entradasDeletadas(keysTxt, escopo).map((e) => e.alvo))];
  const inexistentes = [];
  for (const t of alvos) if (!(await existeTabela(t))) inexistentes.push(t);
  if (!inexistentes.length) return { texto: keysTxt, removidas: [], inexistentes };
  return { ...podarKeys(keysTxt, escopo, inexistentes), inexistentes };
}

async function tabelaExisteNaInstancia(nome) {
  return (await buscar('sys_db_object', `name=${nome}`, 'sys_id', 1)).length > 0;
}

async function apagarOrfaos(orfaos) {
  let apagados = 0;
  for (const o of orfaos) {
    const r = await rest(`/api/now/table/${o.tabela}/${o.sysId}`, { method: 'DELETE' });
    if (r.status === 204 || r.status === 200) apagados++;
    else if (r.status !== 404 && r.status !== 400) console.error(`reinstall: não apagou ${o.tabela}/${o.sysId} (HTTP ${r.status})`);
  }
  return apagados;
}

function lerKeys() {
  return existsSync(KEYS) ? readFileSync(KEYS, 'utf8') : '';
}

export async function executar(args) {
  if (args.zerar && !args.confirmo) {
    throw Object.assign(new Error('--zerar desinstala o app e apaga o que foi criado na instância; repetir com --zerar --confirmo'), { codigo: 4 });
  }
  carregarCredencial();
  const { scope } = lerEscopo();
  const etapas = [];
  const fim = (resultado, extra = {}) => ({ resultado, etapas, ...extra });

  // 1. prefixo
  const prefixo = await lerPropriedade('glide.appcreator.company.code');
  if (!prefixoConfere(scope, prefixo)) {
    throw Object.assign(new Error(`prefixo da instância "${prefixo}" não confere com o escopo ${scope} (app/now.config.json)`), { codigo: 3 });
  }
  etapas.push(`prefixo ${prefixo} ok`);

  // 2. documentos
  const probDocs = conferirDocumentos();
  if (probDocs.length) throw Object.assign(new Error(`documentos do seed:\n  - ${probDocs.join('\n  - ')}`), { codigo: 5 });
  etapas.push('documentos ok');

  // 2b. keys.ts: entradas `deleted: true` de tabela que já não existe na instância (lição do estágio 1)
  if (existsSync(KEYS)) {
    const poda = await podarKeysOrfas(lerKeys(), scope, tabelaExisteNaInstancia);
    if (poda.removidas.length) {
      writeFileSync(KEYS, poda.texto);
      etapas.push(`keys.ts: ${poda.removidas.length} entrada(s) deleted de tabela inexistente removida(s) (${poda.inexistentes.join(', ')}; versionar)`);
    }
  }

  // 3. build
  const keysAntes = lerKeys();
  const b = sdk(args.frozen ? ['build', '--frozenKeys'] : ['build']);
  if (b.status !== 0) return fim('falha-build');
  const keysMudou = lerKeys() !== keysAntes;
  etapas.push(`build ok${keysMudou ? ' (keys.ts atualizado: versionar)' : ''}`);

  // 4. install
  const argsInstall = ['install'];
  if (process.env.SN_SDK_NODE_ENV !== 'SN_SDK_CI_INSTALL' && process.env.SN_ALIAS) argsInstall.push('--auth', process.env.SN_ALIAS);
  if (args.zerar) argsInstall.push('--reinstall');
  const inst = sdk(argsInstall);
  if (inst.status !== 0) return fim('falha-install');
  etapas.push(args.zerar ? 'install --reinstall ok' : 'install ok');

  // 4b. registros de dados que saíram da fonte
  const apagados = await apagarOrfaos(orfaosDeDados(lerKeys(), scope));
  if (apagados) etapas.push(`${apagados} registro(s) de dados fora da fonte apagados`);

  // 5. contagem
  const cont = await conferirContagem();
  for (const l of cont.linhas) console.log(`  ${l}`);
  if (cont.divergencias.length) {
    console.error(`reinstall: contagem divergente:\n  - ${cont.divergencias.join('\n  - ')}`);
    return fim('falha-contagem', { registros: cont.total });
  }
  etapas.push(`contagem ok (${cont.total} registros)`);

  // 6. ATF
  const suite = args.suite ?? 'cob-regressao';
  if (!args['sem-atf']) {
    const existe = (await buscar('sys_atf_test_suite', `name=${suite}`, 'sys_id', 1)).length > 0;
    if (existe) {
      const atf = spawnSync(process.execPath, [join(RAIZ, '.claude', 'skills', 'sn-implement', 'scripts', 'atf.mjs'), '--suite', suite,
        ...(args['recibo-dir'] ? ['--recibo-dir', args['recibo-dir']] : [])], { stdio: 'inherit', env: process.env });
      if (atf.status !== 0) return fim('falha-atf', { registros: cont.total });
      etapas.push(`suíte ${suite} ok`);
    } else {
      etapas.push(`suíte ${suite} ausente`);
    }
  }
  return fim('ok', { registros: cont.total });
}

async function main() {
  const args = lerArgs(process.argv.slice(2));
  let r;
  try {
    r = await executar(args);
  } catch (e) {
    console.error(`reinstall: ${e.message}`);
    process.exit(e.codigo ?? 1);
  }
  const { scope } = lerEscopo();
  const commit = commitAtual(['log', '-1', '--format=%H', '--', 'app/src/fluent']) ?? 'sem-commit';
  const arqLog = resolve(RAIZ, args['sync-log'] ?? 'outputs/spec/sync-log.md');
  const linha = registrarSyncLog(arqLog, {
    skill: 'now-sdk-install',
    modo: process.env.SN_ALIAS || 'alias',
    inputs: scope,
    outputs: commit,
    decisoes: `${r.resultado}; ${r.registros ?? 0} registros`,
    decisor: '—',
    proximo: r.resultado === 'ok' ? 'sn-capture' : 'corrigir e rodar npm run reinstall',
  });
  for (const e of r.etapas) console.log(`reinstall: ${e}`);
  console.log(`reinstall: ${r.resultado} — sync-log: ${linha}`);
  process.exit(r.resultado === 'ok' ? 0 : 1);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
