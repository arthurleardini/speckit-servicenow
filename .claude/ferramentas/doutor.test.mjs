import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  ITENS, sondar, sondarInstancia, avaliarSondagens, formatarTexto, ehPythonReal, IO_REAL, RUNTIME_PADRAO,
  lerRuntime, nomesComValor, versaoNaFaixa, ghTemRepo, VARIAVEIS_DA_INSTANCIA, CHECK_SENSIVEL,
} from './doutor.mjs';

/** Um `io` de memória: respostas fixas por comando, arquivos por caminho relativo. */
function ioFalso({ comandos = {}, node = 'v22.17.1', ambiente = {}, arquivos = {}, modos = {}, existem = [], prefixo } = {}) {
  return {
    rodar: (cmd, args) => {
      const chave = [cmd, ...(args || [])].join(' ');
      if (Object.prototype.hasOwnProperty.call(comandos, chave)) return comandos[chave];
      if (Object.prototype.hasOwnProperty.call(comandos, cmd)) return comandos[cmd];
      return { ok: false, saida: '', stderr: '', erro: 'ENOENT' };
    },
    versaoDoNode: () => node,
    ambiente: (n) => Boolean(ambiente[n]),
    lerArquivo: (rel) => (Object.prototype.hasOwnProperty.call(arquivos, rel) ? arquivos[rel] : null),
    modoArquivo: (rel) => (Object.prototype.hasOwnProperty.call(modos, rel) ? modos[rel] : null),
    existe: (p) => existem.includes(p),
    ghBin: () => 'gh',
    prefixoDaInstancia: async () => (prefixo === undefined ? { ok: false, erro: 'sem dublê' } : prefixo),
  };
}

const ENV_COMPLETO = 'SN_SDK_NODE_ENV=SN_SDK_CI_INSTALL\nSN_SDK_INSTANCE_URL=https://x.service-now.com\n' +
  'SN_SDK_USER=admin\nSN_SDK_USER_PWD=segredo-que-nao-pode-vazar\nSN_ALIAS=dev493801\n';

/** Máquina completa do Speckit ServiceNow. */
function maquinaCompleta(extra = {}) {
  return {
    comandos: {
      'claude --version': { ok: true, saida: '1.2.3' },
      'git --version': { ok: true, saida: 'git version 2.45.0' },
      'python3 -c import sys; print(sys.executable)': { ok: true, saida: '/usr/bin/python3' },
      'npm --version': { ok: true, saida: '10.9.0' },
      [`${process.execPath} app/node_modules/@servicenow/sdk/bin/index.js --version`]: { ok: true, saida: '4.14.3\n' },
      'gh auth status': { ok: true, saida: '', stderr: "github.com\n  ✓ Logged in to github.com account x\n  - Token scopes: 'gist', 'read:org', 'repo'\n" },
      [`${process.execPath} -e import('playwright').then(m=>console.log(m.chromium.executablePath()))`]: { ok: true, saida: '/c/chrome\n' },
    },
    node: 'v22.17.1',
    arquivos: {
      'package.json': JSON.stringify({ engines: { node: '>=20.18 <27' } }),
      'app/package.json': JSON.stringify({ devDependencies: { '@servicenow/sdk': '4.14.3' } }),
      'app/now.config.json': JSON.stringify({ scope: 'x_2326104_cob' }),
      '.env.instancia': ENV_COMPLETO,
    },
    modos: { '.env.instancia': 0o600 },
    existem: ['/c/chrome', CHECK_SENSIVEL, '.harness-template'],
    prefixo: { ok: true, valor: '2326104' },
    ...extra,
  };
}

const item = (r, chave) => r.itens.find((i) => i.chave === chave);

test('a tabela de itens do fork: sai o PAT do Azure, entram os do ServiceNow', () => {
  const chaves = ITENS.map((i) => i.chave);
  assert.ok(!chaves.includes('pat'), 'Azure DevOps está fora do v0');
  for (const c of ['nowSdk', 'credencial', 'permissao', 'prefixo', 'gh', 'playwright', 'sensivel', 'modo']) {
    assert.ok(chaves.includes(c), `falta o item ${c}`);
  }
  const obrigatorios = ITENS.filter((i) => i.obrigatorio).map((i) => i.chave).sort();
  assert.deepEqual(obrigatorios, ['credencial', 'gh', 'git', 'node', 'nowSdk', 'permissao', 'playwright', 'prefixo', 'python', 'runtime', 'sensivel'].sort());
});

test('máquina completa: nada faltando', async () => {
  const io = ioFalso(maquinaCompleta());
  const r = avaliarSondagens(await sondarInstancia(sondar(io), io));
  assert.deepEqual(r.faltandoObrigatorio, []);
  assert.ok(r.itens.every((i) => i.ok), JSON.stringify(r.itens.filter((i) => !i.ok)));
});

test('o runtime sondado é parâmetro, e o padrão é o Claude Code', () => {
  assert.deepEqual(RUNTIME_PADRAO.cli, 'claude');
  const kiro = { rotulo: 'Kiro (IDE ou CLI)', cli: 'kiro-cli', semCli: 'Se você usa só a IDE, isto é esperado.' };
  const io = ioFalso({ comandos: { 'kiro-cli --version': { ok: true, saida: '3.0.1' } } });
  const r = avaliarSondagens(sondar(io, kiro), kiro);
  const runtime = r.itens.find((i) => i.chave === 'runtime');
  assert.equal(runtime.ok, true);
  assert.equal(runtime.rotulo, 'Kiro (IDE ou CLI)');
  assert.match(runtime.detalhe, /kiro-cli/);
  // A OUTRA PONTA: com o runtime Kiro, `claude` presente não conta.
  const io2 = ioFalso({ comandos: { 'claude --version': { ok: true, saida: '1.2.3' } } });
  const r2 = avaliarSondagens(sondar(io2, kiro), kiro);
  assert.equal(r2.itens.find((i) => i.chave === 'runtime').ok, false);
  assert.match(r2.itens.find((i) => i.chave === 'runtime').detalhe, /só a IDE/);
});

test('lerRuntime: lê o campo do harness.json, e cai no padrão quando ele não existe', () => {
  const comCampo = () => JSON.stringify({ runtime: { rotulo: 'X', cli: 'x', semCli: 'y' } });
  assert.deepEqual(lerRuntime('.', comCampo), { rotulo: 'X', cli: 'x', semCli: 'y' });
  assert.deepEqual(lerRuntime('.', () => JSON.stringify({ versao: '2.0.0' })), RUNTIME_PADRAO);
  const ausente = () => { const e = new Error('x'); e.code = 'ENOENT'; throw e; };
  assert.deepEqual(lerRuntime('.', ausente), RUNTIME_PADRAO);
  // Ilegível NÃO é ausente (Restrição Global 1 do harness): relança.
  const ilegivel = () => { const e = new Error('x'); e.code = 'EACCES'; throw e; };
  assert.throws(() => lerRuntime('.', ilegivel), /x/);
});

test('Node abaixo de 18 é falta, e a mensagem diz a versão encontrada', () => {
  const r = avaliarSondagens(sondar(ioFalso({ node: 'v16.20.2' })));
  assert.ok(r.faltandoObrigatorio.includes('node'));
  assert.match(formatarTexto(r), /v16\.20\.2/);
});

// ————————————————— o item 4: a armadilha do Windows, e é o motivo do módulo —————————————————

test('ehPythonReal: caminho de executável passa', () => {
  assert.equal(ehPythonReal({ ok: true, saida: 'C:\\Python313\\python.exe' }), true);
  assert.equal(ehPythonReal({ ok: true, saida: '/usr/bin/python3' }), true);
});

test('ehPythonReal: App Execution Alias do Windows NÃO passa', () => {
  // O ALIAS É O CASO QUE ESTE MÓDULO EXISTE PARA PEGAR. Ele "roda" com exit 0, não imprime
  // caminho de executável, e abre a Microsoft Store. Um teste que só olhasse `ok` diria que a
  // máquina está pronta — e a `spec-data-model` falharia depois com exit code enganoso.
  assert.equal(ehPythonReal({ ok: true, saida: '' }), false);
  assert.equal(ehPythonReal({ ok: true, saida: '   ' }), false);
  assert.equal(ehPythonReal({ ok: false, saida: '', erro: 'ENOENT' }), false);
  // Saída não vazia mas SEM caminho — por exemplo se algo respondesse com a saída de
  // `--version` em vez de `sys.executable`. Sem barra, não é caminho de executável.
  assert.equal(ehPythonReal({ ok: true, saida: 'Python 3.13.14' }), false);
});

test('python3 alias mas python real: acha o Python e diz qual comando usar', () => {
  const io = ioFalso({
    comandos: {
      'python3 -c import sys; print(sys.executable)': { ok: true, saida: '' },
      'python -c import sys; print(sys.executable)': { ok: true, saida: 'C:\\Python313\\python.exe' },
    },
  });
  const r = avaliarSondagens(sondar(io));
  assert.ok(!r.faltandoObrigatorio.includes('python'), 'Python existe, só não como python3');
  const t = formatarTexto(r);
  assert.match(t, /python/);
  assert.match(t, /App Execution Alias|alias/i);
});

test('nenhum dos dois: Python é falta obrigatória', () => {
  const r = avaliarSondagens(sondar(ioFalso({})));
  assert.ok(r.faltandoObrigatorio.includes('python'));
});

// ————————————————— o que ele declara em vez de sondar —————————————————

test('o registry npm é declarado NÃO SONDADO, com a razão', () => {
  const io = ioFalso({ comandos: { 'npm --version': { ok: true, saida: '10.9.0' } } });
  const t = formatarTexto(avaliarSondagens(sondar(io)));
  assert.match(t, /não sondado/i);
  assert.match(t, /rede/i, 'a razão de não sondar tem que estar escrita — não é omissão');
});

test('io.ambiente devolve boolean, e é o que impede o valor de circular', () => {
  // A ASSERÇÃO É SOBRE A FORMA DO io, e é ela que fecha o vazamento na origem: um
  // `ambiente(n) => process.env[n]` faria o valor entrar no objeto de sondagem, e daí para o
  // `--json` de quem pipar a saída.
  const io = ioFalso({ ambiente: { AZURE_DEVOPS_PAT: 1 } });
  assert.equal(io.ambiente('AZURE_DEVOPS_PAT'), true);
  assert.equal(typeof io.ambiente('AZURE_DEVOPS_PAT'), 'boolean');
});

test('IO_REAL.ambiente devolve boolean de verdade — não só o io.ambiente falso do teste', () => {
  // `ioFalso` (acima) é o dublê usado em todos os outros testes deste arquivo, e o corpo dele já
  // devolve boolean por construção — testar só ele nunca pegaria um `IO_REAL.ambiente` real que
  // devolvesse `process.env[nome]` puro (string | undefined). É o objeto que fala com a máquina
  // de verdade que precisa fechar o vazamento, então é ele que este teste exercita.
  const nomeInexistente = 'DOUTOR_TESTE_VARIAVEL_QUE_NAO_EXISTE_XYZ';
  assert.equal(delete process.env[nomeInexistente], true);
  assert.equal(IO_REAL.ambiente(nomeInexistente), false);
  assert.equal(typeof IO_REAL.ambiente(nomeInexistente), 'boolean');

  process.env.DOUTOR_TESTE_VARIAVEL_PRESENTE = 'valor-que-nao-pode-vazar';
  try {
    assert.equal(IO_REAL.ambiente('DOUTOR_TESTE_VARIAVEL_PRESENTE'), true);
    assert.equal(typeof IO_REAL.ambiente('DOUTOR_TESTE_VARIAVEL_PRESENTE'), 'boolean');
  } finally {
    delete process.env.DOUTOR_TESTE_VARIAVEL_PRESENTE;
  }
});


test('item opcional ausente não entra em faltandoObrigatorio', () => {
  const r = avaliarSondagens(sondar(ioFalso({})));
  assert.ok(!r.faltandoObrigatorio.includes('opcionais'));
  assert.ok(!r.faltandoObrigatorio.includes('npm'));
  assert.ok(!r.faltandoObrigatorio.includes('modo'));
});

// ————————————————— os itens do Speckit ServiceNow (design v0, item 8) —————————————————

test('Node fora do `engines` do package.json da raiz é falta', () => {
  const r = avaliarSondagens(sondar(ioFalso(maquinaCompleta({ node: 'v27.0.0' }))));
  assert.ok(r.faltandoObrigatorio.includes('node'));
  assert.match(item(r, 'node').detalhe, />=20\.18 <27/);
  assert.equal(versaoNaFaixa('v26.2.0', '>=20.18 <27'), true);
  assert.equal(versaoNaFaixa('v20.17.9', '>=20.18 <27'), false);
  assert.equal(versaoNaFaixa('v20.18.0', '>=20.18 <27'), true);
});

test('now-sdk diferente do fixado em app/package.json é falta', () => {
  const m = maquinaCompleta();
  m.comandos[`${process.execPath} app/node_modules/@servicenow/sdk/bin/index.js --version`] = { ok: true, saida: '4.15.0' };
  const r = avaliarSondagens(sondar(ioFalso(m)));
  assert.ok(r.faltandoObrigatorio.includes('nowSdk'));
  assert.match(item(r, 'nowSdk').detalhe, /4\.15\.0.*4\.14\.3/);
});

test('credencial: presença conferida por nome, e o valor NUNCA aparece na saída', async () => {
  const io = ioFalso(maquinaCompleta());
  const s = await sondarInstancia(sondar(io), io);
  const r = avaliarSondagens(s);
  const tudo = JSON.stringify(s) + JSON.stringify(r) + formatarTexto(r);
  assert.ok(!tudo.includes('segredo-que-nao-pode-vazar'), 'vazou a senha');
  assert.ok(!tudo.includes('https://x.service-now.com'), 'vazou a URL');
  for (const n of VARIAVEIS_DA_INSTANCIA) assert.match(tudo, new RegExp(n));
});

test('credencial incompleta: lista as variáveis que faltam, e o prefixo nem é sondado', async () => {
  const m = maquinaCompleta();
  m.arquivos['.env.instancia'] = 'SN_SDK_INSTANCE_URL=https://x\nSN_SDK_USER=\n';
  const io = ioFalso(m);
  const r = avaliarSondagens(await sondarInstancia(sondar(io), io));
  assert.ok(r.faltandoObrigatorio.includes('credencial'));
  assert.match(item(r, 'credencial').detalhe, /faltam: SN_SDK_USER, SN_SDK_USER_PWD, SN_ALIAS/);
  assert.equal(item(r, 'prefixo').pulado, true);
});

test('nomesComValor devolve só nomes e ignora comentário e valor vazio', () => {
  const n = nomesComValor('# SN_X=1\nA=1\nB=\nexport C="2"\n');
  assert.deepEqual([...n].sort(), ['A', 'C']);
});

test('.env.instancia com permissão diferente de 600 é falta, com o comando de correção', () => {
  const r = avaliarSondagens(sondar(ioFalso(maquinaCompleta({ modos: { '.env.instancia': 0o644 } }))));
  assert.ok(r.faltandoObrigatorio.includes('permissao'));
  assert.match(item(r, 'permissao').detalhe, /644.*chmod 600/);
});

test('prefixo da instância diferente do escopo de app/now.config.json é falta', async () => {
  const io = ioFalso(maquinaCompleta({ prefixo: { ok: true, valor: '9999999' } }));
  const r = avaliarSondagens(await sondarInstancia(sondar(io), io));
  assert.ok(r.faltandoObrigatorio.includes('prefixo'));
  assert.match(item(r, 'prefixo').detalhe, /9999999.*x_2326104_cob/);
});

test('--offline pula a rede: o prefixo sai PULADO e não conta como falta', async () => {
  let chamou = false;
  const io = ioFalso(maquinaCompleta());
  io.prefixoDaInstancia = async () => { chamou = true; return { ok: true, valor: '2326104' }; };
  const r = avaliarSondagens(await sondarInstancia(sondar(io), io, { offline: true }));
  assert.equal(chamou, false);
  assert.equal(item(r, 'prefixo').pulado, true);
  assert.ok(!r.faltandoObrigatorio.includes('prefixo'));
  assert.match(formatarTexto(r), /PULADO/);
});

test('falha de rede no prefixo é falta, com o erro', async () => {
  const io = ioFalso(maquinaCompleta({ prefixo: { ok: false, erro: 'HTTP 401' } }));
  const r = avaliarSondagens(await sondarInstancia(sondar(io), io));
  assert.ok(r.faltandoObrigatorio.includes('prefixo'));
  assert.match(item(r, 'prefixo').detalhe, /HTTP 401/);
});

test('gh sem escopo repo é falta', () => {
  assert.equal(ghTemRepo("Token scopes: 'gist', 'read:org'"), false);
  assert.equal(ghTemRepo("Token scopes: 'gist', 'repo'"), true);
  assert.equal(ghTemRepo("Token scopes: 'public_repo'"), false);
  const m = maquinaCompleta();
  m.comandos['gh auth status'] = { ok: true, saida: '', stderr: "✓ Logged in to github.com\n- Token scopes: 'gist'\n" };
  const r = avaliarSondagens(sondar(ioFalso(m)));
  assert.ok(r.faltandoObrigatorio.includes('gh'));
  assert.match(item(r, 'gh').detalhe, /refresh -s repo/);
});

test('Playwright sem Chromium baixado é falta', () => {
  const r = avaliarSondagens(sondar(ioFalso(maquinaCompleta({ existem: [CHECK_SENSIVEL] }))));
  assert.ok(r.faltandoObrigatorio.includes('playwright'));
  assert.match(item(r, 'playwright').detalhe, /playwright install chromium/);
});

test('check_sensivel.py fora do caminho absoluto é falta', () => {
  const r = avaliarSondagens(sondar(ioFalso(maquinaCompleta({ existem: ['/c/chrome'] }))));
  assert.ok(r.faltandoObrigatorio.includes('sensivel'));
});

test('modo do repositório: template, clone, e marcador num clone é vermelho', () => {
  const tpl = avaliarSondagens(sondar(ioFalso(maquinaCompleta())));
  assert.match(item(tpl, 'modo').detalhe, /^template/);
  const clone = avaliarSondagens(sondar(ioFalso(maquinaCompleta({ existem: ['/c/chrome', CHECK_SENSIVEL, 'harness-zona.lock.json'] }))));
  assert.match(item(clone, 'modo').detalhe, /^clone/);
  assert.equal(item(clone, 'modo').ok, true);
  const ambos = avaliarSondagens(sondar(ioFalso(maquinaCompleta({ existem: ['/c/chrome', CHECK_SENSIVEL, 'harness-zona.lock.json', '.harness-template'] }))));
  assert.equal(item(ambos, 'modo').ok, false);
});
