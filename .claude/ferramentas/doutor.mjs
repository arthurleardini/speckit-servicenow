// Harness Elo v2 — Pré-flight dos pré-requisitos de máquina (§11.2 da spec, Decisão 23).
//
// EXECUTÁVEL DE MÃO (Decisão 20): roda uma vez, no clone recém-feito, por comando digitado.
//
// SÓ RELATA. Nunca bloqueia, nunca dispara sozinho, e sai SEMPRE com código 0 — quem precisar de
// veredito de máquina usa `--json` e lê `faltandoObrigatorio`. O desenho de contingência da §11.1
// previa bloquear as skills que dependem de `tools/*.py`; a Verificação 2 do primeiro dia foi
// executada e NÃO acionou esse fallback (Python real, executável de verdade), então a trava seria
// alcançável só por fato sintético. E ligar a sondagem ao `SessionStart` poria spawn de processo
// no caminho comum de toda sessão, que é o custo que a pré-passagem da rodada R removeu.

/**
 * O runtime que a sonda procura. É PARÂMETRO porque este mesmo módulo vai para a saída do
 * `gerar-kiro.mjs`, onde o runtime é o Kiro — e prosa não se reescreve por tabela de caminhos.
 * O valor de produção vem do `harness.json` (`runtime`), que o gerador reescreve; sem o campo,
 * vale o Claude Code.
 */
export const RUNTIME_PADRAO = {
  rotulo: 'Claude Code',
  cli: 'claude',
  semCli: 'Se você usa o app de desktop, isto é esperado e não é problema.',
};

/**
 * Os itens do pré-flight. `obrigatorio` é o que faz o kit não funcionar; o resto degrada.
 *
 * Fork Speckit ServiceNow (design v0, item 8): sai o PAT do Azure DevOps (o backlog vai para issues
 * do GitHub, e o Azure está fora do v0); o piso «Node ≥18» vira a faixa do `engines` do
 * `package.json` da raiz; entram o SDK do ServiceNow, a credencial da instância (`.env.instancia`,
 * conferida por PRESENÇA, nunca por valor), o prefixo de escopo da instância, o `gh`, o Playwright,
 * o modo do repositório e o `check_sensivel.py`.
 *
 * `runtime` é sondado pelo CLI declarado em `RUNTIME_PADRAO` (ou no `harness.json`, campo
 * `runtime`), e a AUSÊNCIA DELE NÃO É VEREDITO: quem usa só a interface gráfica legitimamente
 * não tem o CLI no PATH. A mensagem (`semCli`) diz isso, em vez de acusar. É a única linha em
 * que "não achei" e "não tem" são coisas diferentes.
 */
export const ITENS = [
  { chave: 'runtime', rotulo: RUNTIME_PADRAO.rotulo, obrigatorio: true, para: 'runtime do agente — rules, skills, verificadores' },
  { chave: 'node', rotulo: 'Node dentro do `engines`', obrigatorio: true, para: 'verificadores do harness, CLIs de skill e o ServiceNow SDK' },
  { chave: 'git', rotulo: 'Git', obrigatorio: true, para: 'branch por US, gate no push, permalink dos prints' },
  { chave: 'python', rotulo: 'Python 3', obrigatorio: true, para: 'os validadores tools/*.py do kit e o check_sensivel.py' },
  { chave: 'npm', rotulo: 'npm', obrigatorio: false, para: 'instalar as dependências da raiz (Playwright) e de app/ (SDK)' },
  { chave: 'nowSdk', rotulo: 'ServiceNow SDK (now-sdk) na versão fixada', obrigatorio: true, para: 'build e install do app Fluent (`npm run reinstall`)' },
  { chave: 'credencial', rotulo: 'Credencial da instância (.env.instancia)', obrigatorio: true, para: 'now-sdk em modo CI, sn-capture, sn-reinstall e o leitor de ATF' },
  { chave: 'permissao', rotulo: '.env.instancia com permissão 600', obrigatorio: true, para: 'segredo legível só pelo dono' },
  { chave: 'prefixo', rotulo: 'Prefixo de escopo da instância = app/now.config.json', obrigatorio: true, para: 'o install não cria escopo errado (CUJ 4)' },
  { chave: 'gh', rotulo: 'GitHub CLI autenticado com escopo repo', obrigatorio: true, para: 'publicar o backlog (sn-tasks-github) e comentar nas issues' },
  { chave: 'playwright', rotulo: 'Playwright com Chromium', obrigatorio: true, para: 'prints da instância (sn-capture) e runner de ATF de form' },
  { chave: 'sensivel', rotulo: 'check_sensivel.py acessível', obrigatorio: true, para: 'check de dado sensível (LGPD + CTN art. 198) antes de publicar' },
  { chave: 'modo', rotulo: 'Modo do repositório', obrigatorio: false, para: 'template (kit editável) ou clone (zona imutável travada)' },
  { chave: 'opcionais', rotulo: 'pytm, scc, ast-grep, vale', obrigatorio: false, para: 'threat model, hotspots, lint — o kit tem rota degradada para cada um' },
];

/** As variáveis que o SDK lê em modo CI, e o alias do projeto. Só a PRESENÇA é conferida. */
export const VARIAVEIS_DA_INSTANCIA = ['SN_SDK_INSTANCE_URL', 'SN_SDK_USER', 'SN_SDK_USER_PWD', 'SN_ALIAS'];
export const ARQUIVO_CREDENCIAL = '.env.instancia';
// No repositório (scripts/), ou no caminho dado por CHECK_SENSIVEL. O npm run doutor roda na raiz.
export const CHECK_SENSIVEL = process.env.CHECK_SENSIVEL || 'scripts/check_sensivel.py';
export const PROPRIEDADE_PREFIXO = 'glide.appcreator.company.code';

/**
 * Os NOMES das variáveis com valor não vazio num texto `.env`. Devolve só nomes: o valor nunca sai
 * desta função, e é isso que fecha o vazamento na origem.
 */
export function nomesComValor(textoEnv) {
  const nomes = new Set();
  for (const linha of String(textoEnv || '').split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(linha);
    if (!m || linha.trim().startsWith('#')) continue;
    const v = m[2].replace(/^(['"])(.*)\1$/, '$2');
    if (v) nomes.add(m[1]);
  }
  return nomes;
}

/** `>=20.18 <27` contra `v26.2.0`. Aceita só os operadores >=, >, <=, <, = (o que o kit usa). */
export function versaoNaFaixa(versao, faixa) {
  const num = (v) => String(v || '').replace(/^v/, '').split('.').map((x) => Number(x) || 0);
  const cmp = (a, b) => { for (let i = 0; i < 3; i++) { const d = (a[i] || 0) - (b[i] || 0); if (d) return Math.sign(d); } return 0; };
  const v = num(versao);
  const partes = String(faixa || '').trim().split(/\s+/).filter(Boolean);
  if (!partes.length) return false;
  for (const p of partes) {
    const m = /^(>=|<=|>|<|=)?v?([\d.]+)$/.exec(p);
    if (!m) return false;
    const c = cmp(v, num(m[2]));
    const op = m[1] || '=';
    if (op === '>=' && c < 0) return false;
    if (op === '>' && c <= 0) return false;
    if (op === '<=' && c > 0) return false;
    if (op === '<' && c >= 0) return false;
    if (op === '=' && c !== 0) return false;
  }
  return true;
}

/** `gh auth status` lista os escopos em «Token scopes: 'repo', ...». */
export function ghTemRepo(saida) {
  const m = /Token scopes:\s*(.*)/i.exec(String(saida || ''));
  return Boolean(m) && /(^|[^\w:])'?repo'?(?![\w:])/.test(m[1]);
}

const SONDA_PYTHON = ['-c', 'import sys; print(sys.executable)'];
/** O Node que roda o doutor roda também o CLI do SDK e a sonda do Playwright (sem depender do PATH). */
const NODE_BIN = process.execPath;
/** O CLI do SDK instalado em app/ — o mesmo que o `sn-reinstall` usa (`lib/instancia.mjs`). */
const SDK_BIN_REL = 'app/node_modules/@servicenow/sdk/bin/index.js';

/**
 * A sonda do Python respondeu com um executável de verdade?
 *
 * ESTA FUNÇÃO É O MOTIVO DO MÓDULO EXISTIR. Em Windows, `python3` costuma ser um *App Execution
 * Alias*: ele "roda", sai com código 0, não imprime caminho nenhum e abre a Microsoft Store. Uma
 * verificação que olhasse só o código de saída declararia a máquina pronta, e a `spec-data-model`
 * falharia depois com exit code enganoso e mensagem que não ajuda.
 *
 * O que separa os dois casos é a SAÍDA: `sys.executable` de um Python real é um caminho — tem
 * barra. Uma saída como `Python 3.13.14` (a de `--version`, não a desta sonda, mas que um
 * `resultado` malformado poderia carregar) não tem barra nenhuma e não deve passar.
 */
export function ehPythonReal(resultado) {
  if (!resultado || !resultado.ok) return false;
  const saida = String(resultado.saida || '').trim();
  if (!saida) return false;
  return /[\\/]/.test(saida);
}

/**
 * Sonda a máquina. Recebe `io` para ser testável sem tocar em processo nenhum.
 *
 * `io` precisa de: `rodar(cmd, args)` → `{ ok, saida, stderr }`; `versaoDoNode()`;
 * `lerArquivo(rel)` → texto ou `null` (relativo à raiz); `modoArquivo(rel)` → bits de permissão ou
 * `null`; `existe(caminho)` → boolean; `ghBin()` → o binário do GitHub CLI. A rede fica fora daqui:
 * ver `sondarInstancia`.
 */
export function sondar(io, runtime = RUNTIME_PADRAO) {
  const cli = io.rodar(runtime.cli, ['--version']);
  const git = io.rodar('git', ['--version']);
  const npm = io.rodar('npm', ['--version']);

  const py3 = io.rodar('python3', SONDA_PYTHON);
  const py = ehPythonReal(py3) ? null : io.rodar('python', SONDA_PYTHON);

  const opcionais = {};
  for (const nome of ['pytm', 'scc', 'ast-grep', 'vale']) {
    opcionais[nome] = io.rodar(nome, ['--version']).ok;
  }

  const lerJson = (rel) => {
    try { const t = io.lerArquivo(rel); return t == null ? null : JSON.parse(t); } catch { return null; }
  };
  const pkgRaiz = lerJson('package.json');
  const pkgApp = lerJson('app/package.json');
  const nowConfig = lerJson('app/now.config.json');

  const deps = pkgApp ? { ...(pkgApp.dependencies || {}), ...(pkgApp.devDependencies || {}) } : {};
  const sdkFixado = deps['@servicenow/sdk'] || null;
  const sdk = io.rodar(NODE_BIN, [SDK_BIN_REL, '--version']);
  const sdkVersao = sdk.ok ? ((/(\d+\.\d+\.\d+\S*)/.exec(String(sdk.saida || '')) || [])[1] || null) : null;

  // BOOLEAN, NÃO VALOR. É aqui que o vazamento de segredo é fechado, na origem: `nomesComValor`
  // devolve só NOMES, então o conteúdo da credencial nunca entra no objeto de sondagem, e não há
  // por onde chegar ao stdout, ao `--json` de quem pipar a saída, ou ao log da sessão.
  const envTexto = io.lerArquivo(ARQUIVO_CREDENCIAL);
  const presentes = envTexto == null ? null : nomesComValor(envTexto);
  const credencial = { existe: envTexto != null, variaveis: {} };
  for (const n of VARIAVEIS_DA_INSTANCIA) credencial.variaveis[n] = Boolean(presentes && presentes.has(n));
  const modoEnv = io.modoArquivo(ARQUIVO_CREDENCIAL);

  const ghBin = (io.ghBin && io.ghBin()) || 'gh';
  const gh = io.rodar(ghBin, ['auth', 'status']);
  const ghSaida = `${gh.saida || ''}\n${gh.stderr || ''}`;

  const pw = io.rodar(NODE_BIN, ['-e', "import('playwright').then(m=>console.log(m.chromium.executablePath()))"]);
  const chromium = pw.ok ? String(pw.saida || '').trim() || null : null;

  return {
    runtime: { versao: cli.ok ? String(cli.saida || '').trim() : null },
    node: { versao: io.versaoDoNode(), engines: pkgRaiz && pkgRaiz.engines ? pkgRaiz.engines.node || null : null },
    git: { versao: git.ok ? String(git.saida || '').trim() : null },
    python: {
      comando: ehPythonReal(py3) ? 'python3' : (ehPythonReal(py) ? 'python' : null),
      aliasNoPython3: !ehPythonReal(py3) && Boolean(py3 && py3.ok),
      executavel: ehPythonReal(py3) ? String(py3.saida).trim() : (ehPythonReal(py) ? String(py.saida).trim() : null),
    },
    npm: { versao: npm.ok ? String(npm.saida || '').trim() : null },
    nowSdk: { fixado: sdkFixado, versao: sdkVersao },
    credencial,
    permissao: { modo: modoEnv == null ? null : (modoEnv & 0o777) },
    escopo: nowConfig ? nowConfig.scope || null : null,
    prefixo: { sondado: false, motivo: 'não sondado' },
    gh: {
      bin: ghBin,
      instalado: gh.ok || /logged in|not logged/i.test(ghSaida),
      logado: /Logged in to/i.test(ghSaida),
      repo: ghTemRepo(ghSaida),
    },
    playwright: { chromium, existe: Boolean(chromium) && io.existe(chromium) },
    sensivel: { existe: io.existe(CHECK_SENSIVEL) },
    modo: { marcador: io.existe('.harness-template'), lock: io.existe('harness-zona.lock.json') },
    opcionais,
  };
}

/**
 * O prefixo da instância (`glide.appcreator.company.code`), por GET na Table API. É a única sonda de
 * rede, e por isso é separada e pulável (`--offline`). `io.prefixoDaInstancia()` devolve
 * `{ ok, valor, erro }` — nunca a credencial.
 */
export async function sondarInstancia(s, io, { offline = false } = {}) {
  const credOk = s.credencial.existe &&
    ['SN_SDK_INSTANCE_URL', 'SN_SDK_USER', 'SN_SDK_USER_PWD'].every((n) => s.credencial.variaveis[n]);
  if (offline) return { ...s, prefixo: { sondado: false, motivo: 'pulado por `--offline`' } };
  if (!credOk) return { ...s, prefixo: { sondado: false, motivo: 'sem credencial completa em `.env.instancia`' } };
  let r;
  try { r = await io.prefixoDaInstancia(); } catch (e) { r = { ok: false, erro: (e && e.message) || String(e) }; }
  return {
    ...s,
    prefixo: {
      sondado: true,
      ok: Boolean(r && r.ok),
      valor: r && r.valor != null ? String(r.valor) : null,
      erro: r && r.erro ? String(r.erro) : null,
    },
  };
}

const modoOctal = (m) => (m == null ? '?' : m.toString(8).padStart(3, '0'));

export function avaliarSondagens(s, runtime = RUNTIME_PADRAO) {
  const itens = [];
  const faltandoObrigatorio = [];
  const registrar = (chave, ok, detalhe, extra = {}) => {
    const meta = ITENS.find((i) => i.chave === chave);
    itens.push({ ...meta, rotulo: chave === 'runtime' ? runtime.rotulo : meta.rotulo, ok, detalhe, ...extra });
    if (meta.obrigatorio && !ok && !extra.pulado) faltandoObrigatorio.push(chave);
  };

  registrar('runtime', Boolean(s.runtime.versao),
    s.runtime.versao
      ? `CLI \`${runtime.cli}\` ${s.runtime.versao}`
      : `CLI \`${runtime.cli}\` não está no PATH. ${runtime.semCli}`);

  const faixa = s.node.engines || '>=18';
  const nodeOk = versaoNaFaixa(s.node.versao, faixa);
  registrar('node', nodeOk,
    `${s.node.versao}${nodeOk ? ` (engines \`${faixa}\`)` : ` — fora da faixa \`${faixa}\` do package.json da raiz`}`);

  registrar('git', Boolean(s.git.versao), s.git.versao || 'não encontrado no PATH');

  if (s.python.comando === 'python3') {
    registrar('python', true, `\`python3\` → ${s.python.executavel}`);
  } else if (s.python.comando === 'python') {
    registrar('python', true,
      `\`python3\` ${s.python.aliasNoPython3 ? 'é um App Execution Alias — roda, não imprime executável, e abre a Microsoft Store' : 'não existe'}; ` +
      `\`python\` → ${s.python.executavel}. Os scripts do kit chamam \`python3\` primeiro e caem para \`python\`, ` +
      'então isto funciona — mas desligar o alias em Configurações › Aplicativos › Aliases de execução de aplicativo evita a próxima confusão.');
  } else {
    registrar('python', false,
      s.python.aliasNoPython3
        ? '`python3` é um App Execution Alias e `python` não existe. O alias abre a Microsoft Store e sai com código 0 — instale o Python de verdade e desligue o alias.'
        : 'nem `python3` nem `python` respondem');
  }

  registrar('npm', Boolean(s.npm.versao),
    (s.npm.versao ? `${s.npm.versao}. ` : 'não encontrado. ') +
    'Acesso ao registry: **não sondado** — sondar o registry exige rede, e sondagem de rede pendura ' +
    'em rede ruim. Confirme à mão se o `npm install` (raiz e app/) ainda não rodou nesta máquina.');

  const sdk = s.nowSdk || {};
  const fixadoLimpo = sdk.fixado ? String(sdk.fixado).replace(/^[\^~=v]+/, '') : null;
  const sdkOk = Boolean(sdk.versao) && Boolean(fixadoLimpo) && sdk.versao === fixadoLimpo;
  registrar('nowSdk', sdkOk,
    !sdk.fixado ? '`@servicenow/sdk` não está fixado em app/package.json'
      : !sdk.versao ? `não encontrado em app/node_modules — rode \`npm install\` em app/ (fixado: ${sdk.fixado})`
        : sdkOk ? `${sdk.versao} (igual ao fixado em app/package.json)`
          : `instalado ${sdk.versao}, fixado ${sdk.fixado} — rode \`npm install\` em app/`);

  const cred = s.credencial || { existe: false, variaveis: {} };
  const faltamCred = VARIAVEIS_DA_INSTANCIA.filter((n) => !cred.variaveis[n]);
  registrar('credencial', cred.existe && !faltamCred.length,
    !cred.existe ? `\`${ARQUIVO_CREDENCIAL}\` não existe — copie o \`.env.example\` e preencha (fora do git)`
      : `presentes: ${VARIAVEIS_DA_INSTANCIA.filter((n) => cred.variaveis[n]).join(', ') || 'nenhuma'}` +
        (faltamCred.length ? ` · faltam: ${faltamCred.join(', ')}` : '') +
        '. Só a PRESENÇA é conferida; o valor não é impresso. Sem keyring, o SDK autentica em modo CI pelas `SN_SDK_*`.');

  const modo = s.permissao ? s.permissao.modo : null;
  registrar('permissao', modo === 0o600,
    modo == null ? `\`${ARQUIVO_CREDENCIAL}\` não existe`
      : `modo ${modoOctal(modo)}${modo === 0o600 ? '' : ` — rode \`chmod 600 ${ARQUIVO_CREDENCIAL}\``}`);

  const p = s.prefixo || { sondado: false };
  if (!p.sondado) {
    registrar('prefixo', false, `não sondado: ${p.motivo || 'sem dados'}`, { pulado: true });
  } else if (!p.ok) {
    registrar('prefixo', false, `GET de \`${PROPRIEDADE_PREFIXO}\` falhou: ${p.erro || 'sem resposta'}`);
  } else {
    const confere = Boolean(p.valor) && Boolean(s.escopo) && String(s.escopo).startsWith(`x_${p.valor}_`);
    registrar('prefixo', confere,
      `instância: \`${p.valor || '(vazio)'}\` · app/now.config.json: \`${s.escopo || '(sem scope)'}\`` +
      (confere ? '' : ' — não confere; o `npm run reinstall` para antes de instalar'));
  }

  const gh = s.gh || {};
  registrar('gh', Boolean(gh.logado && gh.repo),
    !gh.instalado ? `\`${gh.bin || 'gh'}\` não encontrado (defina GH_BIN se o binário não está no PATH)`
      : !gh.logado ? 'não autenticado — rode `gh auth login`'
        : gh.repo ? 'autenticado, com escopo `repo`' : 'autenticado, sem escopo `repo` — rode `gh auth refresh -s repo`');

  const pw = s.playwright || {};
  registrar('playwright', Boolean(pw.existe),
    pw.existe ? `Chromium em ${pw.chromium}`
      : pw.chromium ? 'Playwright instalado, Chromium ausente — rode `npx playwright install chromium`'
        : 'Playwright não encontrado — rode `npm install` na raiz');

  const sens = Boolean(s.sensivel && s.sensivel.existe);
  registrar('sensivel', sens && Boolean(s.python.comando),
    !sens ? `\`${CHECK_SENSIVEL}\` não encontrado`
      : s.python.comando ? `\`${CHECK_SENSIVEL}\` (via \`${s.python.comando}\`)`
        : `\`${CHECK_SENSIVEL}\` existe, mas não há Python para rodá-lo`);

  const m = s.modo || {};
  const descricao = m.lock ? 'clone (manifesto `harness-zona.lock.json` presente; zona imutável travada)'
    : m.marcador ? 'template (`.harness-template` presente e sem manifesto; kit editável)'
      : 'indeterminado (sem manifesto e sem `.harness-template`)';
  registrar('modo', !(m.lock && m.marcador),
    m.lock && m.marcador ? `${descricao} — o marcador não destrava um clone; remova o \`.harness-template\`` : descricao);

  const ok = Object.entries(s.opcionais).filter(([, v]) => v).map(([k]) => k);
  const nao = Object.entries(s.opcionais).filter(([, v]) => !v).map(([k]) => k);
  registrar('opcionais', true, `presentes: ${ok.join(', ') || 'nenhum'}${nao.length ? ` · ausentes: ${nao.join(', ')} (rota degradada)` : ''}`);

  return { itens, faltandoObrigatorio };
}

export function formatarTexto(r) {
  const l = ['PRÉ-REQUISITOS DE MÁQUINA — speckit-servicenow', ''];
  for (const i of r.itens) {
    l.push(`${i.ok ? '  ok  ' : (i.pulado ? ' PULADO' : ' FALTA')} ${i.rotulo}`);
    l.push(`        ${i.detalhe}`);
    l.push(`        para: ${i.para}`);
    l.push('');
  }
  l.push(r.faltandoObrigatorio.length
    ? `Faltando obrigatório: ${r.faltandoObrigatorio.join(', ')}. O kit não funciona assim.`
    : 'Nada obrigatório faltando.');
  return l.join('\n');
}

// ————————————————————————————— casca de I/O —————————————————————————————

import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { isAbsolute, join } from 'node:path';

/** O `runtime` do `harness.json`, ou o padrão. Ausente cai no padrão; ilegível relança. */
export function lerRuntime(raiz, lerArquivo = readFileSync) {
  let bruto;
  try {
    bruto = lerArquivo(join(raiz, 'harness.json'), 'utf8');
  } catch (erro) {
    if (erro && (erro.code === 'ENOENT' || erro.code === 'ENOTDIR')) return RUNTIME_PADRAO;
    throw erro;
  }
  const h = JSON.parse(bruto);
  return h.runtime && h.runtime.cli ? h.runtime : RUNTIME_PADRAO;
}

/**
 * GET do prefixo na instância, com a credencial lida do arquivo para um objeto LOCAL (não vai para
 * `process.env`). Timeout curto: pré-flight que pendura é pior que pré-flight que declara.
 */
async function prefixoReal(raiz, timeoutMs = 8000) {
  const env = {};
  for (const linha of readFileSync(join(raiz, ARQUIVO_CREDENCIAL), 'utf8').split(/\r?\n/)) {
    const m = /^\s*(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(linha);
    if (m && !linha.trim().startsWith('#')) env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
  }
  const url = String(env.SN_SDK_INSTANCE_URL || '').replace(/\/+$/, '');
  const q = encodeURIComponent(`name=${PROPRIEDADE_PREFIXO}`);
  const auth = 'Basic ' + Buffer.from(`${env.SN_SDK_USER}:${env.SN_SDK_USER_PWD}`).toString('base64');
  try {
    const resp = await fetch(`${url}/api/now/table/sys_properties?sysparm_query=${q}&sysparm_fields=value&sysparm_limit=1`, {
      headers: { Authorization: auth, Accept: 'application/json' },
      signal: AbortSignal.timeout(timeoutMs),
    });
    if (resp.status !== 200) return { ok: false, erro: `HTTP ${resp.status}` };
    const json = await resp.json();
    return { ok: true, valor: json && json.result && json.result[0] ? json.result[0].value : null };
  } catch (e) {
    return { ok: false, erro: e && e.name === 'TimeoutError' ? `sem resposta em ${timeoutMs} ms` : ((e && e.code) || (e && e.name) || 'erro de rede') };
  }
}

export function criarIoReal(raiz = process.cwd()) {
  const abs = (p) => (isAbsolute(p) ? p : join(raiz, p));
  return {
    /**
     * `shell: false` de propósito: nada aqui vem de entrada do usuário, e shell no meio
     * transformaria um nome de comando em superfície de injeção sem ganhar nada. `timeout` porque
     * um pré-flight que pendura é pior que um pré-flight que declara.
     */
    rodar: (comando, args) => {
      const r = spawnSync(comando, args || [], { cwd: raiz, encoding: 'utf8', shell: false, timeout: 15000 });
      const base = { saida: String(r.stdout || ''), stderr: String(r.stderr || '') };
      if (r.error || r.status !== 0) return { ok: false, ...base, erro: String((r.error && r.error.code) || r.status) };
      return { ok: true, ...base, erro: '' };
    },
    versaoDoNode: () => 'v' + process.versions.node,
    ambiente: (nome) => Boolean(process.env[nome]),
    lerArquivo: (rel) => { try { return readFileSync(abs(rel), 'utf8'); } catch { return null; } },
    modoArquivo: (rel) => { try { return statSync(abs(rel)).mode & 0o777; } catch { return null; } },
    existe: (p) => existsSync(abs(p)),
    ghBin: () => process.env.GH_BIN || 'gh',
    prefixoDaInstancia: () => prefixoReal(raiz),
  };
}

export const IO_REAL = criarIoReal();

async function main(argv) {
  const raiz = process.cwd();
  const runtime = lerRuntime(raiz);
  const io = criarIoReal(raiz);
  const s = await sondarInstancia(sondar(io, runtime), io, { offline: argv.includes('--offline') });
  const r = avaliarSondagens(s, runtime);
  process.stdout.write((argv.includes('--json') ? JSON.stringify(r, null, 2) : formatarTexto(r)) + '\n');
  // SEMPRE 0 — ver o cabeçalho. Quem quer veredito de máquina lê `faltandoObrigatorio` do `--json`.
  return 0;
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  main(process.argv.slice(2)).then((c) => { process.exitCode = c; });
}
