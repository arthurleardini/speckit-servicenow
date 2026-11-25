#!/usr/bin/env node
// sn-scaffold — gera o esqueleto Fluent do app a partir do modelo de dados e da tabela de telas (item 24).
//
// Uso:
//   node .claude/skills/sn-scaffold/scripts/scaffold.mjs [--modelo outputs/spec/data-model.previa.json]
//        [--app app] [--por-tabela 50] [--semente N] [--sem-build] [--manifesto <caminho>]
//
// Gera em app/src/fluent/: tables/, simulations/, ui/, navigation/menu.now.ts, security/roles.now.ts,
// security/acl-base.now.ts e o seed (via sn-seed). Depois roda `now-sdk build` e grava o
// outputs/spec/screens-manifest.json com as rotas da instância.
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  acharModelo, gerarSeed, gravarSeed, lerArgs, lerEscopo, normalizarModelo, POR_TABELA_PADRAO, SEMENTE_PADRAO,
} from '../../sn-seed/scripts/gerar-seed.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = resolve(AQUI, '..', '..', '..', '..');
export const MARCA = '// gerado por sn-scaffold — regerar com scaffold.mjs; mudança à mão se perde';

const COLUNA_TS = {
  string: 'StringColumn', integer: 'IntegerColumn', decimal: 'DecimalColumn', boolean: 'BooleanColumn',
  reference: 'ReferenceColumn', choice: 'ChoiceColumn', glide_date: 'DateColumn', glide_date_time: 'DateTimeColumn',
  journal: 'GenericColumn', journal_input: 'GenericColumn', currency: 'GenericColumn',
};

const js = (v) => JSON.stringify(v);
const ident = (s) => s.replace(/[^A-Za-z0-9_]/g, '_');

function cabecalho(imports) {
  return [MARCA, "import '@servicenow/sdk/global'", `import { ${[...new Set(imports)].sort().join(', ')} } from '@servicenow/sdk/core'`, ''];
}

function colunaTs(col) {
  const props = [`label: ${js(col.label)}`];
  if (col.mandatory) props.push('mandatory: true');
  if (col.maxLength) props.push(`maxLength: ${col.maxLength}`);
  else if (col.type === 'string') props.push(`maxLength: ${col.format ? 18 : 100}`);
  if (col.type === 'reference') props.push(`referenceTable: ${js(col.reference)}`);
  if (col.type === 'choice') {
    const ch = col.choices.map((c, i) => `            ${js(c.value)}: { label: ${js(c.label)}, sequence: ${i} },`);
    props.push(`choices: {\n${ch.join('\n')}\n        }`);
    props.push("dropdown: 'dropdown_with_none'");
  }
  if (col.type === 'journal' || col.type === 'journal_input' || col.type === 'currency') {
    props.unshift(`columnType: ${js(col.type)}`);
  }
  return `${COLUNA_TS[col.type]}({ ${props.join(', ')} })`;
}

export function gerarTabela(ent) {
  const imports = ['Table', ...ent.columns.map((c) => COLUNA_TS[c.type])];
  const linhas = cabecalho(imports);
  linhas.push(`export const ${ent.name} = Table({`);
  linhas.push(`    name: ${js(ent.name)},`);
  const rotulo = ent.simulation && !/simulad/i.test(ent.label) ? `${ent.label} (Simulado)` : ent.label;
  // Com pluralLabel, o rótulo vira Documentation[] (sys_documentation da tabela com o plural): título da lista
  // e contagens usam o plural certo em vez do rótulo + "s" da plataforma.
  if (ent.pluralLabel) {
    const plural = ent.simulation && !/simulad/i.test(ent.pluralLabel) ? `${ent.pluralLabel} (Simulado)` : ent.pluralLabel;
    linhas.push(`    label: [{ label: ${js(rotulo)}, plural: ${js(plural)}, language: 'en' }],`);
  } else {
    linhas.push(`    label: ${js(rotulo)},`);
  }
  if (ent.extends) linhas.push(`    extends: ${js(ent.extends)},`);
  const display = ent.display ?? ent.columns.find((c) => c.type === 'string' && !c.format)?.name;
  if (display) linhas.push(`    display: ${js(display)},`);
  if (ent.audit) linhas.push('    audit: true,');
  linhas.push('    allowWebServiceAccess: true,');
  linhas.push('    schema: {');
  for (const c of ent.columns) linhas.push(`        ${c.name}: ${colunaTs(c)},`);
  linhas.push('    },');
  linhas.push('})', '');
  return linhas.join('\n');
}

function curtoCampo(col) {
  return ['boolean', 'integer', 'decimal', 'currency', 'choice', 'reference', 'glide_date', 'glide_date_time'].includes(col.type)
    || (col.type === 'string' && (col.maxLength ?? 100) <= 100);
}

function elementos(campos) {
  return campos.map((c) => `{ field: ${js(c.name)}, type: 'table_field' }`);
}

/** Conteúdo de Form() seguindo a heurística do form-layout-guide. */
function corpoForm(ent, tela, viewExpr, chaveBase, pf = null) {
  const nomes = tela?.fields ?? ent.columns.map((c) => c.name);
  const cols = nomes.map((n) => ent.columns.find((c) => c.name === n)).filter(Boolean);
  const curtos = cols.filter((c) => c.type !== 'journal_input' && c.type !== 'journal' && curtoCampo(c));
  const longos = cols.filter((c) => c.type !== 'journal_input' && c.type !== 'journal' && !curtoCampo(c));
  const journal = ent.columns.filter((c) => c.type === 'journal_input');
  const blocos = [];
  if (curtos.length >= 4) {
    const meio = Math.ceil(curtos.length / 2);
    blocos.push(`{ layout: 'two-column', leftElements: [${elementos(curtos.slice(0, meio)).join(', ')}], rightElements: [${elementos(curtos.slice(meio)).join(', ')}] }`);
  } else if (curtos.length) {
    blocos.push(`{ layout: 'one-column', elements: [${elementos(curtos).join(', ')}] }`);
  }
  if (longos.length || journal.length) blocos.push(`{ layout: 'one-column', elements: [${elementos([...longos, ...journal]).join(', ')}] }`);
  // Trilha de etapas: primeiro elemento da primeira seção, em bloco de uma coluna (form-formatters-guide).
  if (pf) blocos.unshift(`{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: processFlow_${ident(pf.short)}, formatterName: 'process_flow.xml' }] }`);
  const secoes = [
    `        {\n            caption: ${js(tela?.title ?? ent.label)},\n            content: [\n                ${blocos.join(',\n                ')},\n            ],\n        }`,
  ];
  if (journal.length) {
    secoes.push("        {\n            caption: 'Atividades',\n            content: [{ layout: 'one-column', elements: [{ type: 'formatter', formatterRef: Formatter.Activities_Filtered }] }],\n        }");
  }
  void chaveBase;
  return [
    'Form({',
    `    table: ${js(ent.name)},`,
    `    view: ${viewExpr},`,
    '    sections: [',
    secoes.join(',\n') + ',',
    '    ],',
    '})',
  ].join('\n');
}

/**
 * Plano de views: a primeira tela de form (e de list) de cada tabela usa a view padrão; as seguintes
 * ganham uma sys_ui_view própria. Devolve Map tel.id → { view: null | nome }.
 */
export function planoDeViews(norm) {
  const plano = new Map();
  const usados = new Set();
  for (const t of norm.telas) {
    if (t.type === 'report') { plano.set(t.id, { view: null }); continue; }
    const k = `${t.type}:${t.table}`;
    if (!usados.has(k)) { usados.add(k); plano.set(t.id, { view: null }); continue; }
    plano.set(t.id, { view: `${norm.escopo}_${t.id.toLowerCase().replace(/[^a-z0-9]/g, '_')}` });
  }
  return plano;
}

function arquivoView(nomeView, tela, linhas) {
  linhas.push(`const view_${ident(tela.id)} = Record({`);
  linhas.push(`    $id: Now.ID[${js(`${tela.id}_view`)}],`);
  linhas.push("    table: 'sys_ui_view',");
  linhas.push(`    data: { name: ${js(nomeView)}, title: ${js(tela.title)} },`);
  linhas.push('})', '');
  return `view_${ident(tela.id)}`;
}

const importProcessFlow = (pf) => `import { processFlow_${ident(pf.short)} } from './_processflow_${pf.short}.now'`;

export function gerarUi(norm) {
  const arquivos = {};
  const plano = planoDeViews(norm);
  const porTabela = new Map(norm.entidades.map((e) => [e.name, e]));
  const pfPorTabela = new Map((norm.processFlows ?? []).map((pf) => [pf.table, pf]));
  for (const t of norm.telas) {
    const ent = porTabela.get(t.table);
    const { view } = plano.get(t.id);
    if (t.type === 'report') {
      const campo = (t.fields?.[0]) ?? ent.columns.find((c) => c.type === 'choice')?.name ?? ent.columns[0].name;
      const linhas = cabecalho(['Record']);
      linhas.push(`export const report_${ident(t.id)} = Record({`);
      linhas.push(`    $id: Now.ID[${js(`${t.id}_report`)}],`);
      linhas.push("    table: 'sys_report',");
      // Visibilidade: sem `user`/`roles` o report fica restrito ao dono e não abre para o papel da tela.
      // `user: 'GLOBAL'` publica para todos, e `roles` (lista) limita aos papéis do app.
      const papeis = norm.roles.map((r) => r.name);
      linhas.push(`    data: { title: ${js(t.title)}, table: ${js(ent.name)}, type: 'bar', field: ${js(campo)}, aggregate: 'COUNT', is_published: true, user: 'GLOBAL', roles: ${js(papeis)} },`);
      linhas.push('})', '');
      arquivos[`${t.id}.now.ts`] = linhas.join('\n');
      continue;
    }
    const imports = t.type === 'form' ? ['Form'] : ['List'];
    if (!view) imports.push('default_view');
    if (view) imports.push('Record');
    if (t.type === 'form' && ent.columns.some((c) => c.type === 'journal_input')) imports.push('Formatter');
    const linhas = cabecalho(imports);
    const pf = t.type === 'form' ? pfPorTabela.get(ent.name) : null;
    if (pf) linhas.push(importProcessFlow(pf), '');
    const viewExpr = view ? arquivoView(view, t, linhas) : 'default_view';
    if (t.type === 'form') {
      linhas.push(corpoForm(ent, t, viewExpr, t.id, pf), '');
    } else {
      const cols = (t.fields ?? ent.columns.filter((c) => c.type !== 'journal_input' && c.type !== 'journal').slice(0, 6).map((c) => c.name));
      linhas.push('List({', `    table: ${js(ent.name)},`, `    view: ${viewExpr},`, `    columns: ${js(cols)},`, '})', '');
    }
    arquivos[`${t.id}.now.ts`] = linhas.join('\n');
  }
  // Toda tabela precisa de form na view padrão (table-guide, regra 6).
  for (const ent of norm.entidades) {
    const temPadrao = norm.telas.some((t) => t.type === 'form' && t.table === ent.name && !plano.get(t.id).view);
    if (temPadrao) continue;
    const imports = ['Form', 'default_view'];
    if (ent.columns.some((c) => c.type === 'journal_input')) imports.push('Formatter');
    const linhas = cabecalho(imports);
    const pf = pfPorTabela.get(ent.name);
    if (pf) linhas.push(importProcessFlow(pf), '');
    linhas.push(corpoForm(ent, null, 'default_view', `form_${ent.short}`, pf), '');
    arquivos[`_form_${ent.short}.now.ts`] = linhas.join('\n');
  }
  return arquivos;
}

export function gerarRoles(norm) {
  const linhas = cabecalho(['Role']);
  for (const r of norm.roles) {
    linhas.push(`export const role_${ident(r.short)} = Role({`);
    linhas.push(`    $id: Now.ID[${js(`role_${r.short}`)}],`);
    linhas.push(`    name: ${js(r.name)},`);
    linhas.push(`    description: ${js(`Papel ${r.label} do app ${norm.escopo}`)},`);
    linhas.push('})', '');
  }
  return linhas.join('\n');
}

export function gerarAcl(norm) {
  const linhas = cabecalho(['Acl']);
  linhas.push(`import { ${norm.roles.map((r) => `role_${ident(r.short)}`).join(', ')} } from './roles.now'`, '');
  const roles = `[${norm.roles.map((r) => `role_${ident(r.short)}`).join(', ')}]`;
  for (const e of norm.entidades) {
    for (const [sufixo, campo] of [['read', null], ['read_campos', '*']]) {
      linhas.push('Acl({');
      linhas.push(`    $id: Now.ID[${js(`acl_${e.short}_${sufixo}`)}],`);
      linhas.push("    type: 'record',");
      linhas.push(`    table: ${js(e.name)},`);
      if (campo) linhas.push(`    field: ${js(campo)},`);
      linhas.push("    operation: 'read',");
      linhas.push(`    roles: ${roles},`);
      linhas.push('})', '');
    }
  }
  return linhas.join('\n');
}

const slug = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()
  .replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');

/** Papel da área "Administração": o `admin` do app, se existir; senão o `admin` da plataforma. */
function papelAdmin(norm) {
  return norm.roles.find((r) => r.short === 'admin')?.name ?? 'admin';
}

/** Marcador do `application: menu` (identificador, não string). */
const MENU = { codigo: 'menu' };

function moduloRecord(linhas, chave, dados) {
  const campos = Object.entries(dados)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => {
      if (v && typeof v === 'object' && 'codigo' in v) return `${k}: ${v.codigo}`;
      return `${k}: ${k === 'link_type' ? `'${v}'` : js(v)}`;
    });
  linhas.push('Record({', `    $id: Now.ID[${js(chave)}],`, "    table: 'sys_app_module',");
  linhas.push(`    data: { ${campos.join(', ')} },`);
  linhas.push('})', '');
}

/**
 * Menu do app, em uma de três formas:
 * - `modules` com áreas (alguma área tem `items`): cada área com `items` vira um separador seguido
 *   dos módulos dela (FILTER, LIST, DIRECT, REPORT ou SEPARATOR), com filtro, view, roles e ordem.
 *   Área sem `items` não entra no menu: as tabelas cruas ficam em "Administração" (`adminTables`).
 * - `modules` sem áreas: um separador por módulo (o `label`) e um módulo LIST por tabela dele.
 * - sem `modules`: um módulo LIST por tabela.
 * `adminTables: true` acrescenta a área "Administração", só para o papel admin, com uma LIST por tabela.
 */
export function gerarMenu(norm, nomeApp) {
  const linhas = cabecalho(['ApplicationMenu', 'Record']);
  const papeis = norm.roles.map((r) => r.name);
  linhas.push(`import { ${norm.roles.map((r) => `role_${ident(r.short)}`).join(', ')} } from '../security/roles.now'`, '');
  linhas.push('export const menu = ApplicationMenu({');
  linhas.push(`    $id: Now.ID['menu_app'],`);
  linhas.push(`    title: ${js(nomeApp)},`);
  linhas.push(`    roles: [${norm.roles.map((r) => `role_${ident(r.short)}`).join(', ')}],`);
  linhas.push('    active: true,');
  linhas.push('})', '');
  const porTabela = new Map(norm.entidades.map((e) => [e.name, e]));
  const telaPorId = new Map(norm.telas.map((t) => [t.id, t]));
  let ordem = 100;
  const proxima = (explicita) => {
    const o = explicita ?? ordem;
    ordem = Math.max(ordem, o) + 100;
    return o;
  };

  if (norm.porAreas) {
    for (const [g, area] of norm.modules.entries()) {
      if (!area.items) continue;
      const base = `modulo_${slug(area.id ?? `area_${g + 1}`)}`;
      const rolesArea = area.roles ?? [...new Set(area.items.flatMap((it) => it.roles ?? papeis))];
      moduloRecord(linhas, base, {
        title: area.title, application: MENU, link_type: 'SEPARATOR', roles: rolesArea, active: true, order: proxima(area.order),
      });
      for (const it of area.items) {
        const dados = {
          title: it.label, application: MENU, link_type: it.type, roles: it.roles ?? area.roles ?? papeis, active: true,
        };
        if (it.type === 'LIST' || it.type === 'FILTER') {
          dados.name = it.table;
          if (it.filter) dados.filter = it.filter;
          if (it.view) dados.view_name = it.view;
        } else if (it.type === 'DIRECT') {
          dados.query = it.link;
        } else if (it.type === 'REPORT') {
          // sys_id do report pela chave Now.ID['<TEL>_report'] (resolvida pelo build via keys.ts).
          dados.report = { codigo: `Now.ref('sys_report', ${js(`${it.report}_report`)})` };
        }
        dados.order = proxima(it.order);
        moduloRecord(linhas, `${base}_${slug(it.label)}`, dados);
      }
    }
  } else {
    const grupos = norm.modules?.length
      ? norm.modules.map((m) => ({
        title: m.title,
        tabelas: [...new Set([
          ...(m.screens ?? []).map((id) => telaPorId.get(id)?.table).filter(Boolean),
          ...(m.tables ?? []).map((t) => porTabela.get(t)?.name ?? porTabela.get(`${norm.escopo}_${t}`)?.name).filter(Boolean),
        ])],
      }))
      : [{ title: null, tabelas: norm.entidades.map((e) => e.name) }];
    for (const [g, grupo] of grupos.entries()) {
      if (grupo.title) {
        moduloRecord(linhas, `modulo_grupo_${g + 1}`, {
          title: grupo.title, application: MENU, link_type: 'SEPARATOR', roles: papeis, active: true, order: proxima(),
        });
      }
      for (const tab of grupo.tabelas) {
        const ent = porTabela.get(tab);
        moduloRecord(linhas, `modulo_${g + 1}_${ent.short}`, {
          title: ent.label, application: MENU, link_type: 'LIST', name: ent.name, roles: papeis, active: true, order: proxima(),
        });
      }
    }
  }

  if (norm.adminTables) {
    const admin = [papelAdmin(norm)];
    moduloRecord(linhas, 'modulo_administracao', {
      title: 'Administração', application: MENU, link_type: 'SEPARATOR', roles: admin, active: true, order: proxima(),
    });
    for (const ent of norm.entidades) {
      moduloRecord(linhas, `modulo_administracao_${ent.short}`, {
        title: ent.label, application: MENU, link_type: 'LIST', name: ent.name, roles: admin, active: true, order: proxima(),
      });
    }
  }
  return linhas.join('\n');
}

/**
 * Trilha de etapas (process flow) de uma tabela: o `sys_ui_formatter` do macro OOTB
 * `process_flow.xml` para a tabela (na instância o formatter só existe por tabela OOTB, como problem
 * e change_request; não há um global) e um `sys_process_flow` por etapa. O formatter é exportado
 * para os `Form()` da tabela porem a trilha no topo.
 */
export function gerarProcessFlow(pf) {
  const linhas = cabecalho(['Record']);
  linhas.push(`export const processFlow_${ident(pf.short)} = Record({`);
  linhas.push(`    $id: Now.ID[${js(`processflow_${pf.short}_formatter`)}],`);
  linhas.push("    table: 'sys_ui_formatter',");
  linhas.push(`    data: { name: 'Process Flow', type: 'formatter', formatter: 'process_flow.xml', table: ${js(pf.table)}, active: true },`);
  linhas.push('})', '');
  for (const st of pf.steps) {
    linhas.push('Record({');
    linhas.push(`    $id: Now.ID[${js(`processflow_${pf.short}_${slug(st.label)}`)}],`);
    linhas.push("    table: 'sys_process_flow',");
    linhas.push(`    data: { name: ${js(`${pf.label} - ${st.label}`)}, label: ${js(st.label)}, table: ${js(pf.table)}, condition: ${js(st.condition)}, order: ${js(String(st.order))}, active: true },`);
    linhas.push('})', '');
  }
  return linhas.join('\n');
}

/** Gera todos os arquivos em memória: { 'tables/x.now.ts': conteudo, ... }. */
export function gerarScaffold(norm, nomeApp) {
  const saida = {};
  for (const e of norm.entidades) saida[`${e.simulation ? 'simulations' : 'tables'}/${e.short}.now.ts`] = gerarTabela(e);
  for (const [nome, c] of Object.entries(gerarUi(norm))) saida[`ui/${nome}`] = c;
  for (const pf of norm.processFlows ?? []) saida[`ui/_processflow_${pf.short}.now.ts`] = gerarProcessFlow(pf);
  saida['security/roles.now.ts'] = gerarRoles(norm);
  saida['security/acl-base.now.ts'] = gerarAcl(norm);
  saida['navigation/menu.now.ts'] = gerarMenu(norm, nomeApp);
  return saida;
}

/** Grava e remove arquivos gerados antes (com a MARCA) que não fazem mais parte do scaffold. */
export function gravarScaffold(arquivos, appDir) {
  const base = join(appDir, 'src', 'fluent');
  for (const pasta of ['tables', 'simulations', 'ui', 'security', 'navigation']) {
    const dir = join(base, pasta);
    if (!existsSync(dir)) continue;
    for (const f of readdirSync(dir)) {
      const rel = `${pasta}/${f}`;
      if (f.endsWith('.now.ts') && !(rel in arquivos) && readFileSync(join(dir, f), 'utf8').startsWith(MARCA)) rmSync(join(dir, f));
    }
  }
  for (const [rel, c] of Object.entries(arquivos)) {
    mkdirSync(dirname(join(base, rel)), { recursive: true });
    writeFileSync(join(base, rel), c);
  }
}

/** Lê keys.ts e devolve o sys_id de uma chave Now.ID (null se ausente ou deletada). */
export function sysIdDaChave(keysTxt, chave) {
  const esc = chave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const m = keysTxt.match(new RegExp(`(?:^|\\s)['"]?${esc}['"]?\\s*:\\s*\\{([^}]*)\\}`, 'm'));
  if (!m || /deleted:\s*true/.test(m[1])) return null;
  return m[1].match(/id:\s*'([0-9a-f]{32})'/)?.[1] ?? null;
}

/** Monta o screens-manifest.json (contrato em tools/references/screens-manifest.md). */
export function montarManifesto(norm, keysTxt, anterior = null) {
  const plano = planoDeViews(norm);
  const antes = new Map((anterior?.screens ?? []).map((s) => [s.id, s]));
  const faltam = [];
  const screens = norm.telas.map((t) => {
    const { view } = plano.get(t.id);
    const sufView = view ? `sysparm_view=${view}` : '';
    let route;
    if (t.type === 'list') route = `/${t.table}_list.do${sufView ? `?${sufView}` : ''}`;
    else if (t.type === 'form') {
      const id = sysIdDaChave(keysTxt, `${t.id}_registro_demo`);
      if (!id) faltam.push(`${t.id}_registro_demo`);
      route = `/${t.table}.do?sys_id=${id ?? 'PENDENTE'}${sufView ? `&${sufView}` : ''}`;
    } else {
      const id = sysIdDaChave(keysTxt, `${t.id}_report`);
      if (!id) faltam.push(`${t.id}_report`);
      route = `/sys_report_template.do?jvar_report_id=${id ?? 'PENDENTE'}`;
    }
    const velho = antes.get(t.id);
    const mesmaRota = velho?.route === route;
    return {
      id: t.id, title: t.title, route, type: t.type, role: t.role, table: t.table,
      screenshot: mesmaRota ? velho.screenshot ?? null : null,
      capturedAt: mesmaRota ? velho.capturedAt ?? null : null,
    };
  });
  return {
    manifesto: { version: 1, generatedBy: 'sn-scaffold', generatedAt: new Date().toISOString(), screens },
    faltam,
  };
}

function rodarBuild(appDir) {
  const bin = join(appDir, 'node_modules', '@servicenow', 'sdk', 'bin', 'index.js');
  if (!existsSync(bin)) return { status: null, motivo: 'SDK não instalado em app/node_modules' };
  const r = spawnSync(process.execPath, [bin, 'build'], { cwd: appDir, encoding: 'utf8', stdio: 'inherit', timeout: 15 * 60 * 1000 });
  return { status: r.status };
}

export function executar(args) {
  const appDir = resolve(RAIZ, args.app ?? 'app');
  const modeloPath = args.modelo ? resolve(process.cwd(), args.modelo) : acharModelo(RAIZ);
  const escopo = lerEscopo(appDir);
  const cfg = JSON.parse(readFileSync(join(appDir, 'now.config.json'), 'utf8'));
  const norm = normalizarModelo(JSON.parse(readFileSync(modeloPath, 'utf8')), escopo);

  const arquivos = gerarScaffold(norm, cfg.name ?? escopo);
  gravarScaffold(arquivos, appDir);
  const seed = gerarSeed(norm, {
    porTabela: args['por-tabela'] ? Number(args['por-tabela']) : POR_TABELA_PADRAO,
    semente: args.semente ? Number(args.semente) : SEMENTE_PADRAO,
  });
  gravarSeed(seed, appDir);
  console.log(`sn-scaffold: ${Object.keys(arquivos).length} arquivo(s) Fluent + ${Object.keys(seed.arquivos).length} de seed`);

  if (args['sem-build']) {
    console.log('sn-scaffold: --sem-build, manifesto não gravado');
    return { norm, arquivos, seed, manifesto: null };
  }
  const b = rodarBuild(appDir);
  if (b.status !== 0) throw new Error(b.status === null ? b.motivo : `now-sdk build falhou (exit ${b.status})`);
  const keysTxt = readFileSync(join(appDir, 'src', 'fluent', 'generated', 'keys.ts'), 'utf8');
  const manifestoPath = resolve(RAIZ, args.manifesto ?? 'outputs/spec/screens-manifest.json');
  const anterior = existsSync(manifestoPath) ? JSON.parse(readFileSync(manifestoPath, 'utf8')) : null;
  const { manifesto, faltam } = montarManifesto(norm, keysTxt, anterior);
  if (faltam.length) throw new Error(`chaves ausentes no keys.ts depois do build: ${faltam.join(', ')}`);
  mkdirSync(dirname(manifestoPath), { recursive: true });
  writeFileSync(manifestoPath, JSON.stringify(manifesto, null, 2) + '\n');
  console.log(`sn-scaffold: manifesto com ${manifesto.screens.length} tela(s) em ${manifestoPath}`);
  return { norm, arquivos, seed, manifesto };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { executar(lerArgs(process.argv.slice(2))); } catch (e) { console.error(`sn-scaffold: ${e.message}`); process.exit(1); }
}
