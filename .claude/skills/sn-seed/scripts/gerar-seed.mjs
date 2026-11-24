#!/usr/bin/env node
// sn-seed — gera o seed fictício do app Fluent a partir do modelo de dados (item 25 do design v0).
//
// Uso:
//   node .claude/skills/sn-seed/scripts/gerar-seed.mjs [--modelo outputs/spec/data-model.previa.json]
//        [--app app] [--por-tabela 50] [--semente 20261124]
//
// Saída em app/src/fluent/seed/: <tabela>.now.ts (Record com installMethod 'demo'), _usuarios.now.ts,
// _journal.now.ts, _documentos.json e _contagem.json. Tudo determinístico: mesma entrada, mesma saída.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
export const RAIZ = resolve(AQUI, '..', '..', '..', '..');

export const MARCA = '// gerado por sn-seed — não editar à mão; regerar com gerar-seed.mjs';
export const SEMENTE_PADRAO = 20261124;
export const POR_TABELA_PADRAO = 50;
export const POR_TABELA_MAX = 300;
export const ROLES_PADRAO = ['coordenador', 'atendente', 'admin'];
export const TIPOS = new Set([
  'string', 'integer', 'decimal', 'boolean', 'reference', 'choice', 'glide_date', 'glide_date_time',
  'journal', 'journal_input', 'currency',
]);

// ——— PRNG determinístico (mulberry32) ———

export function hash32(texto) {
  let h = 2166136261 >>> 0;
  for (const c of String(texto)) h = Math.imul(h ^ c.codePointAt(0), 16777619) >>> 0;
  return h >>> 0;
}

export function criarPrng(semente) {
  let a = semente >>> 0;
  const rng = () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  rng.int = (min, max) => min + Math.floor(rng() * (max - min + 1));
  rng.pick = (lista) => lista[Math.floor(rng() * lista.length)];
  return rng;
}

// ——— CPF / CNPJ com DV válido ———

function dvCpf(digs) {
  const calc = (n) => {
    let s = 0;
    for (let i = 0; i < n; i++) s += digs[i] * (n + 1 - i);
    const r = (s * 10) % 11;
    return r === 10 ? 0 : r;
  };
  const d1 = calc(9);
  digs[9] = d1;
  return [d1, calc(10)];
}

export function gerarCpf(rng) {
  let digs;
  do { digs = Array.from({ length: 9 }, () => rng.int(0, 9)); } while (digs.every((d) => d === digs[0]));
  const [d1, d2] = dvCpf([...digs, 0, 0]);
  const s = [...digs, d1, d2].join('');
  return `${s.slice(0, 3)}.${s.slice(3, 6)}.${s.slice(6, 9)}-${s.slice(9)}`;
}

export function cpfValido(valor) {
  const s = String(valor).replace(/\D/g, '');
  if (s.length !== 11 || /^(\d)\1{10}$/.test(s)) return false;
  const digs = s.split('').map(Number);
  const [d1, d2] = dvCpf(digs.slice(0, 9).concat([0, 0]));
  return d1 === digs[9] && d2 === digs[10];
}

function dvCnpj(base) {
  const pesos1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const pesos2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const calc = (digs, pesos) => {
    const s = digs.reduce((acc, d, i) => acc + d * pesos[i], 0);
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  const d1 = calc(base, pesos1);
  const d2 = calc([...base, d1], pesos2);
  return [d1, d2];
}

export function gerarCnpj(rng) {
  let base;
  do {
    base = [...Array.from({ length: 8 }, () => rng.int(0, 9)), 0, 0, 0, 1];
  } while (base.slice(0, 8).every((d) => d === base[0]));
  const [d1, d2] = dvCnpj(base);
  const s = [...base, d1, d2].join('');
  return `${s.slice(0, 2)}.${s.slice(2, 5)}.${s.slice(5, 8)}/${s.slice(8, 12)}-${s.slice(12)}`;
}

export function cnpjValido(valor) {
  const s = String(valor).replace(/\D/g, '');
  if (s.length !== 14 || /^(\d)\1{13}$/.test(s)) return false;
  const digs = s.split('').map(Number);
  const [d1, d2] = dvCnpj(digs.slice(0, 12));
  return d1 === digs[12] && d2 === digs[13];
}

/** Regex dos documentos formatados como o gerador os escreve (usada também pelo reinstall). */
export const RE_CPF = /\b\d{3}\.\d{3}\.\d{3}[-.]\d{2}\b/g;
export const RE_CNPJ = /\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g;

// ——— Modelo ———

export function lerEscopo(appDir) {
  const cfg = JSON.parse(readFileSync(join(appDir, 'now.config.json'), 'utf8'));
  if (!cfg.scope) throw new Error(`${appDir}/now.config.json sem "scope"`);
  return cfg.scope;
}

export function acharModelo(raiz = RAIZ) {
  for (const nome of ['data-model.json', 'data-model.previa.json']) {
    const p = join(raiz, 'outputs', 'spec', nome);
    if (existsSync(p)) return p;
  }
  throw new Error('modelo não encontrado: passar --modelo ou criar outputs/spec/data-model(.previa).json');
}

function normalizarChoices(choices) {
  if (!choices) return [];
  if (Array.isArray(choices)) {
    return choices.map((c) => (typeof c === 'string' ? { value: c, label: c } : { value: String(c.value), label: c.label ?? String(c.value) }));
  }
  return Object.entries(choices).map(([value, label]) => ({ value, label: typeof label === 'string' ? label : label?.label ?? value }));
}

function curto(nome, escopo) {
  return nome.startsWith(`${escopo}_`) ? nome.slice(escopo.length + 1) : nome;
}

/**
 * Normaliza o modelo: nomes completos de tabela, choices em lista, referências resolvidas, roles com
 * nome completo e, nas tabelas com tela de form, coluna journal_input `comentarios` + audit (Technical
 * Plan, "Telas"). Lança erro com a lista de problemas encontrados.
 */
export function normalizarModelo(modelo, escopo) {
  const erros = [];
  if (!modelo || !Array.isArray(modelo.entities) || !modelo.entities.length) {
    throw new Error('modelo sem entities[]');
  }
  const porCurto = new Map();
  const entidades = modelo.entities.map((e, i) => {
    if (!e?.name) { erros.push(`entities[${i}] sem name`); return null; }
    const short = curto(String(e.name), escopo);
    const name = `${escopo}_${short}`;
    if (name.length > 30) erros.push(`tabela ${name} tem ${name.length} caracteres (máximo 30)`);
    if (!/^[a-z0-9_]*[a-z0-9]$/.test(name)) erros.push(`tabela ${name}: só minúsculas, números e _`);
    const ent = {
      name, short, label: e.label ?? short, extends: e.extends, display: e.display,
      simulation: Boolean(e.simulation), audit: e.audit, pessoa: Boolean(e.pessoa), columns: [],
    };
    porCurto.set(short, ent);
    porCurto.set(name, ent);
    return { ent, cols: e.columns ?? [] };
  }).filter(Boolean);

  for (const { ent, cols } of entidades) {
    const vistos = new Set();
    for (const [j, c] of cols.entries()) {
      if (!c?.name) { erros.push(`${ent.name}.columns[${j}] sem name`); continue; }
      if (!/^[a-z0-9_]+$/.test(c.name) || c.name.startsWith('sys_')) erros.push(`${ent.name}.${c.name}: nome de coluna inválido`);
      if (vistos.has(c.name)) erros.push(`${ent.name}.${c.name}: coluna repetida`);
      vistos.add(c.name);
      const type = c.type ?? 'string';
      if (!TIPOS.has(type)) erros.push(`${ent.name}.${c.name}: tipo "${type}" não suportado`);
      const col = {
        name: c.name, label: c.label ?? c.name, type, mandatory: Boolean(c.mandatory),
        maxLength: c.maxLength, format: c.format, choices: normalizarChoices(c.choices),
      };
      if (type === 'choice' && !col.choices.length) erros.push(`${ent.name}.${c.name}: choice sem choices`);
      if (type === 'reference') {
        if (!c.reference) erros.push(`${ent.name}.${c.name}: reference sem tabela`);
        else col.reference = porCurto.get(c.reference)?.name ?? c.reference;
      }
      if (col.format && !['cpf', 'cnpj'].includes(col.format)) erros.push(`${ent.name}.${c.name}: format "${col.format}" desconhecido`);
      ent.columns.push(col);
    }
    if (ent.simulation && !ent.columns.some((c) => c.name === 'falhar')) {
      ent.columns.push({ name: 'falhar', label: 'Simular falha', type: 'boolean', mandatory: false, choices: [] });
    }
  }

  const telas = (modelo.screens ?? []).map((s, i) => {
    if (!/^TEL-[A-Za-z0-9-]+$/.test(s?.id ?? '')) erros.push(`screens[${i}]: id "${s?.id}" fora do padrão TEL-`);
    const ent = porCurto.get(s?.table);
    if (!ent) erros.push(`screens[${i}] (${s?.id}): tabela "${s?.table}" não está em entities`);
    if (!['form', 'list', 'report'].includes(s?.type)) erros.push(`screens[${i}] (${s?.id}): type "${s?.type}" inválido`);
    return { id: s.id, title: s.title ?? s.id, table: ent?.name ?? s.table, type: s.type, role: s.role ?? null, fields: s.fields ?? null };
  });
  const ids = telas.map((t) => t.id);
  for (const d of ids.filter((x, i) => ids.indexOf(x) !== i)) erros.push(`tela ${d} repetida`);

  const roles = (modelo.roles?.length ? modelo.roles : ROLES_PADRAO).map((r) => {
    const short = curto(String(typeof r === 'string' ? r : r.name).replace(`${escopo}.`, ''), escopo);
    const label = (typeof r === 'object' && r.label) || short.charAt(0).toUpperCase() + short.slice(1);
    return { short, name: `${escopo}.${short}`, label };
  });
  for (const t of telas) {
    if (t.role && !roles.some((r) => r.short === t.role || r.name === t.role)) erros.push(`tela ${t.id}: role "${t.role}" não está em roles`);
    if (t.role) t.role = roles.find((r) => r.short === t.role || r.name === t.role)?.short ?? t.role;
  }

  // Usuários demo: 1 por role (demo.<role>) mais a lista opcional `demoUsers: [{ user, role }]`.
  const usuarios = roles.map((r) => ({ user: `demo.${r.short}`, chave: `usuario_demo_${r.short}`, role: r.short, label: r.label }));
  for (const [i, u] of (Array.isArray(modelo.demoUsers) ? modelo.demoUsers : []).entries()) {
    const user = String(u?.user ?? '');
    const role = roles.find((r) => r.short === u?.role || r.name === u?.role);
    if (!/^demo\.[a-z0-9_.]+$/.test(user)) { erros.push(`demoUsers[${i}]: user "${user}" fora do padrão demo.<nome>`); continue; }
    if (!role) { erros.push(`demoUsers[${i}] (${user}): role "${u?.role}" não está em roles`); continue; }
    if (usuarios.some((x) => x.user === user)) { erros.push(`demoUsers[${i}]: usuário ${user} repetido`); continue; }
    const short = user.slice('demo.'.length).replace(/\./g, '_');
    const n = usuarios.filter((x) => x.role === role.short).length + 1;
    usuarios.push({ user, chave: `usuario_demo_${short}`, role: role.short, label: u.label ?? `${role.label} ${n}` });
  }

  // Tabelas com tela de form ganham journal_input e audit.
  const comForm = new Set(telas.filter((t) => t.type === 'form').map((t) => t.table));
  for (const { ent } of entidades) {
    ent.temForm = comForm.has(ent.name);
    if (ent.temForm) {
      if (ent.audit === undefined) ent.audit = true;
      if (!ent.columns.some((c) => c.type === 'journal_input')) {
        ent.columns.push({ name: 'comentarios', label: 'Comentários', type: 'journal_input', mandatory: false, choices: [] });
      }
    }
  }

  if (erros.length) throw new Error(`modelo inválido:\n  - ${erros.join('\n  - ')}`);
  const modules = Array.isArray(modelo.modules) ? modelo.modules : null;
  return { escopo, entidades: entidades.map((x) => x.ent), telas, roles, usuarios, modules };
}

// ——— Valores fictícios ———

const NOMES = ['Ana', 'Bruno', 'Carla', 'Diego', 'Elisa', 'Fábio', 'Gabriela', 'Heitor', 'Iara', 'João', 'Karina', 'Luís',
  'Marina', 'Nelson', 'Olívia', 'Paulo', 'Quênia', 'Rafael', 'Sílvia', 'Tiago', 'Úrsula', 'Vítor', 'Wanda', 'Yuri'];
const SOBRENOMES = ['Almeida', 'Barros', 'Cardoso', 'Duarte', 'Esteves', 'Figueira', 'Guedes', 'Holanda', 'Ilha', 'Jardim',
  'Leme', 'Moura', 'Nogueira', 'Orvalho', 'Pires', 'Queiroz', 'Rezende', 'Siqueira', 'Toledo', 'Valença'];
const RAMOS = ['Comércio', 'Transportes', 'Agropecuária', 'Serviços', 'Indústria', 'Distribuidora', 'Construções'];
const FRASES = [
  'Contato registrado com o contribuinte fictício.',
  'Documentação conferida pela equipe de atendimento.',
  'Pendência encaminhada para análise da coordenação.',
  'Retorno agendado para a próxima semana.',
  'Dados atualizados a partir do cadastro de demonstração.',
];

function colPreferida(ent) {
  if (ent.display && ent.columns.some((c) => c.name === ent.display)) return ent.display;
  return ent.columns.find((c) => c.type === 'string' && !c.format)?.name ?? null;
}

function textoGenerico(rng, ent, col, n) {
  const nome = col.name;
  const temCnpj = ent.columns.some((c) => c.format === 'cnpj');
  if (/(^|_)(nome|name|razao_social)($|_)/.test(nome)) {
    if (temCnpj) return `${rng.pick(RAMOS)} ${rng.pick(SOBRENOMES)} Fictícia Ltda`;
    return `${rng.pick(NOMES)} ${rng.pick(SOBRENOMES)} ${rng.pick(SOBRENOMES)}`;
  }
  if (/email/.test(nome)) return `contato${String(n).padStart(3, '0')}@exemplo.invalid`;
  if (/telefone|celular|fone/.test(nome)) return `(00) 90000-${String(rng.int(0, 9999)).padStart(4, '0')}`;
  if (/descricao|observacao|resumo|assunto/.test(nome)) return rng.pick(FRASES);
  return `${col.label} ${String(n).padStart(3, '0')}`;
}

function data(rng) {
  const d = new Date(Date.UTC(2026, 0, 1) + rng.int(0, 364) * 86400000);
  return d.toISOString().slice(0, 10);
}

function corta(valor, col) {
  return typeof valor === 'string' && col.maxLength && valor.length > col.maxLength ? valor.slice(0, col.maxLength) : valor;
}

/** Referência a outro registro: emitida como Now.ref(tabela, chave) no .now.ts. */
const ref = (tabela, chave) => ({ __ref: [tabela, chave] });

function valorColuna(ctx, ent, col, n) {
  const { rng, usados, documentos, chavesPorTabela, usuarios } = ctx;
  switch (col.type) {
    case 'journal':
    case 'journal_input':
      return undefined;
    case 'boolean':
      return col.name === 'ficticio' ? true : rng() < 0.5;
    case 'integer':
      return rng.int(1, 999);
    case 'decimal':
    case 'currency':
      return Number((rng.int(100, 9999999) / 100).toFixed(2));
    case 'choice':
      return rng.pick(col.choices).value;
    case 'glide_date':
      return data(rng);
    case 'glide_date_time':
      return `${data(rng)} ${String(rng.int(8, 18)).padStart(2, '0')}:${String(rng.int(0, 59)).padStart(2, '0')}:00`;
    case 'reference': {
      if (chavesPorTabela.has(col.reference)) return ref(col.reference, rng.pick(chavesPorTabela.get(col.reference)));
      if (col.reference === 'sys_user') {
        // Coluna com nome de role (ex.: `atendente`) distribui os registros entre os usuários demo desse
        // role, em rodízio pelo número do registro: é a carteira de cada um.
        // O sorteio acontece sempre, para não deslocar os valores das colunas seguintes.
        const sorteado = rng.pick(ctx.roles).short;
        const doRole = usuarios.filter((u) => u.role === col.name);
        if (doRole.length) return ref('sys_user', doRole[(n - 1) % doRole.length].chave);
        return ref('sys_user', usuarios.find((u) => u.role === sorteado).chave);
      }
      return undefined;
    }
    default: {
      if (col.format === 'cpf' || col.format === 'cnpj') {
        let v;
        do { v = col.format === 'cpf' ? gerarCpf(rng) : gerarCnpj(rng); } while (usados.has(v));
        usados.add(v);
        documentos.push({ valor: v, tipo: col.format, tabela: ent.name, coluna: col.name, id: ctx.chaveAtual });
        return v;
      }
      return corta(textoGenerico(rng, ent, col, n), col);
    }
  }
}

function serializar(valor) {
  if (valor && typeof valor === 'object' && valor.__ref) {
    return `Now.ref(${JSON.stringify(valor.__ref[0])}, ${JSON.stringify(valor.__ref[1])})`;
  }
  return JSON.stringify(valor);
}

function emitirRecord({ chave, tabela, dados }) {
  const linhas = Object.entries(dados)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => `        ${k}: ${serializar(v)},`);
  return [
    'Record({',
    `    $id: Now.ID[${JSON.stringify(chave)}],`,
    "    $meta: { installMethod: 'demo' },",
    `    table: ${JSON.stringify(tabela)},`,
    '    data: {',
    ...linhas,
    '    },',
    '})',
  ].join('\n');
}

function arquivoTs(registros) {
  return [
    MARCA,
    "import '@servicenow/sdk/global'",
    "import { Record } from '@servicenow/sdk/core'",
    '',
    registros.map(emitirRecord).join('\n\n'),
    '',
  ].join('\n');
}

/**
 * Gera o seed em memória. Devolve { arquivos: { nomeArquivo: conteudo }, documentos, contagem }.
 * Não grava nada; `gravarSeed` grava.
 */
export function gerarSeed(modeloNorm, { porTabela = POR_TABELA_PADRAO, semente = SEMENTE_PADRAO } = {}) {
  if (!Number.isInteger(porTabela) || porTabela < 1 || porTabela > POR_TABELA_MAX) {
    throw new Error(`--por-tabela precisa estar entre 1 e ${POR_TABELA_MAX}`);
  }
  const { entidades, telas, roles } = modeloNorm;
  const usuariosDemo = modeloNorm.usuarios ?? roles.map((r) => ({ user: `demo.${r.short}`, chave: `usuario_demo_${r.short}`, role: r.short, label: r.label }));
  const documentos = [];
  const usados = new Set();
  const contagem = { tabelas: {}, extras: [] };
  const arquivos = {};

  // Chaves de cada tabela, conhecidas antes de gerar valores (referências entre tabelas).
  const chavesPorTabela = new Map();
  for (const ent of entidades) {
    const chaves = Array.from({ length: porTabela }, (_, i) => `seed_${ent.short}_${String(i + 1).padStart(3, '0')}`);
    for (const t of telas.filter((x) => x.type === 'form' && x.table === ent.name)) chaves.push(`${t.id}_registro_demo`);
    chavesPorTabela.set(ent.name, chaves);
  }

  const journal = [];
  for (const ent of entidades) {
    const rng = criarPrng(hash32(`${semente}:${ent.name}`));
    const ctx = { rng, usados, documentos, chavesPorTabela, roles, usuarios: usuariosDemo, chaveAtual: null };
    const registros = [];
    const preferida = colPreferida(ent);
    const gerar = (chave, n, demoTel) => {
      ctx.chaveAtual = chave;
      const dados = {};
      for (const col of ent.columns) dados[col.name] = valorColuna(ctx, ent, col, n);
      if (demoTel && preferida) dados[preferida] = corta(`Registro demo ${demoTel.id}`, ent.columns.find((c) => c.name === preferida));
      return { chave, tabela: ent.name, dados };
    };
    for (let i = 1; i <= porTabela; i++) registros.push(gerar(`seed_${ent.short}_${String(i).padStart(3, '0')}`, i, null));
    const demos = telas.filter((t) => t.type === 'form' && t.table === ent.name);
    for (const [k, t] of demos.entries()) {
      const reg = gerar(`${t.id}_registro_demo`, porTabela + k + 1, t);
      registros.push(reg);
      const colJ = ent.columns.find((c) => c.type === 'journal_input');
      if (colJ) {
        const qtd = rng.int(2, 3);
        for (let j = 1; j <= qtd; j++) {
          journal.push({
            chave: `${t.id}_journal_${j}`,
            tabela: 'sys_journal_field',
            dados: { name: ent.name, element: colJ.name, element_id: ref(ent.name, reg.chave), value: FRASES[(j + k) % FRASES.length] },
          });
        }
      }
    }
    arquivos[`${ent.short}.now.ts`] = arquivoTs(registros);
    contagem.tabelas[ent.name] = registros.length;
  }

  // Usuários demo: um por role, mais os de `demoUsers`, todos sem senha.
  const usuarios = [];
  for (const u of usuariosDemo) {
    const r = roles.find((x) => x.short === u.role);
    usuarios.push({
      chave: u.chave,
      tabela: 'sys_user',
      dados: { user_name: u.user, first_name: 'Demo', last_name: u.label, active: true },
    });
    usuarios.push({
      chave: `${u.chave}_role`,
      tabela: 'sys_user_has_role',
      dados: { user: ref('sys_user', u.chave), role: { __ref: ['sys_user_role', { name: r.name }] } },
    });
  }
  arquivos['_usuarios.now.ts'] = arquivoTs(usuarios);
  contagem.extras.push({
    tabela: 'sys_user',
    query: `user_nameIN${usuariosDemo.map((u) => u.user).join(',')}`,
    esperado: usuariosDemo.length,
  });

  if (journal.length) {
    arquivos['_journal.now.ts'] = arquivoTs(journal);
    const porTabelaJ = {};
    for (const j of journal) porTabelaJ[j.dados.name] = (porTabelaJ[j.dados.name] ?? 0) + 1;
    for (const [tab, n] of Object.entries(porTabelaJ)) {
      contagem.extras.push({ tabela: 'sys_journal_field', query: `name=${tab}`, esperado: n, minimo: true });
    }
  }

  return {
    arquivos,
    documentos: { versao: 1, semente, documentos },
    contagem: { versao: 1, semente, porTabela, ...contagem },
  };
}

/** Grava o seed em app/src/fluent/seed/, apagando arquivos gerados antes que não fazem mais parte. */
export function gravarSeed(resultado, appDir) {
  const dir = join(appDir, 'src', 'fluent', 'seed');
  mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) {
    if (f.endsWith('.now.ts') && !(f in resultado.arquivos)) {
      const txt = readFileSync(join(dir, f), 'utf8');
      if (txt.startsWith(MARCA)) rmSync(join(dir, f));
    }
  }
  for (const [nome, conteudo] of Object.entries(resultado.arquivos)) writeFileSync(join(dir, nome), conteudo);
  writeFileSync(join(dir, '_documentos.json'), JSON.stringify(resultado.documentos, null, 2) + '\n');
  writeFileSync(join(dir, '_contagem.json'), JSON.stringify(resultado.contagem, null, 2) + '\n');
  return dir;
}

// ——— CLI ———

export function lerArgs(argv) {
  const a = {};
  for (let i = 0; i < argv.length; i++) {
    const k = argv[i];
    if (!k.startsWith('--')) continue;
    const nome = k.slice(2);
    const prox = argv[i + 1];
    if (prox === undefined || prox.startsWith('--')) a[nome] = true;
    else { a[nome] = prox; i++; }
  }
  return a;
}

function main() {
  const args = lerArgs(process.argv.slice(2));
  const appDir = resolve(RAIZ, args.app ?? 'app');
  const modeloPath = args.modelo ? resolve(process.cwd(), args.modelo) : acharModelo();
  const escopo = lerEscopo(appDir);
  const norm = normalizarModelo(JSON.parse(readFileSync(modeloPath, 'utf8')), escopo);
  const res = gerarSeed(norm, {
    porTabela: args['por-tabela'] ? Number(args['por-tabela']) : POR_TABELA_PADRAO,
    semente: args.semente ? Number(args.semente) : SEMENTE_PADRAO,
  });
  const dir = gravarSeed(res, appDir);
  console.log(`sn-seed: ${Object.keys(res.arquivos).length} arquivo(s) em ${dir}`);
  for (const [t, n] of Object.entries(res.contagem.tabelas)) console.log(`  ${t}: ${n}`);
  console.log(`  documentos: ${res.documentos.documentos.length}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (e) { console.error(`sn-seed: ${e.message}`); process.exit(1); }
}
