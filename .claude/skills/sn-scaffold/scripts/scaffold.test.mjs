import { test } from 'node:test';
import assert from 'node:assert/strict';
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { normalizarModelo } from '../../sn-seed/scripts/gerar-seed.mjs';
import { executar, gerarScaffold, montarManifesto, planoDeViews, sysIdDaChave } from './scaffold.mjs';

const RAIZ = resolve(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const APP_REAL = join(RAIZ, 'app');
const ESCOPO = 'x_2326104_cob';

const MODELO = {
  entities: [
    {
      name: 'tstpessoa', label: 'Pessoa (teste)',
      columns: [
        { name: 'nome', label: 'Nome', type: 'string', mandatory: true },
        { name: 'cpf', label: 'CPF', type: 'string', format: 'cpf' },
        { name: 'situacao', label: 'Situação', type: 'choice', choices: [{ value: 'a', label: 'Ativo' }, { value: 'i', label: 'Inativo' }] },
        { name: 'ficticio', label: 'Fictício', type: 'boolean' },
        { name: 'nascimento', label: 'Nascimento', type: 'glide_date' },
      ],
    },
    {
      name: 'tstcanal', label: 'Canal', simulation: true,
      columns: [
        { name: 'descricao', label: 'Descrição', type: 'string' },
        { name: 'pessoa', label: 'Pessoa', type: 'reference', reference: 'tstpessoa' },
        { name: 'valor', label: 'Valor', type: 'decimal' },
      ],
    },
  ],
  screens: [
    { id: 'TEL-T1', title: 'Ficha', table: 'tstpessoa', type: 'form', role: 'atendente' },
    { id: 'TEL-T2', title: 'Lista', table: 'tstpessoa', type: 'list', role: 'coordenador' },
    { id: 'TEL-T3', title: 'Ficha resumida', table: 'tstpessoa', type: 'form', role: 'coordenador', fields: ['nome', 'cpf'] },
    { id: 'TEL-T4', title: 'Canais por pessoa', table: 'tstcanal', type: 'report', role: 'coordenador' },
  ],
  roles: ['coordenador', 'atendente', 'admin'],
  modules: [{ title: 'F1 Cadastro', screens: ['TEL-T1', 'TEL-T2'] }, { title: 'F2 Simulações', tables: ['tstcanal'] }],
};

test('gera tabelas, telas, menu, roles e ACL nos lugares do design', () => {
  const norm = normalizarModelo(MODELO, ESCOPO);
  const arq = gerarScaffold(norm, 'App teste');
  assert.deepEqual(Object.keys(arq).sort(), [
    'navigation/menu.now.ts', 'security/acl-base.now.ts', 'security/roles.now.ts', 'simulations/tstcanal.now.ts',
    'tables/tstpessoa.now.ts', 'ui/TEL-T1.now.ts', 'ui/TEL-T2.now.ts', 'ui/TEL-T3.now.ts', 'ui/TEL-T4.now.ts',
    'ui/_form_tstcanal.now.ts',
  ]);
  const pessoa = arq['tables/tstpessoa.now.ts'];
  assert.match(pessoa, /export const x_2326104_cob_tstpessoa = Table\(/);
  assert.match(pessoa, /audit: true/);
  assert.match(pessoa, /comentarios: GenericColumn\(\{ columnType: "journal_input"/);
  assert.match(arq['simulations/tstcanal.now.ts'], /label: "Canal \(Simulado\)"/);
  assert.match(arq['simulations/tstcanal.now.ts'], /falhar: BooleanColumn/);
  assert.match(arq['ui/TEL-T1.now.ts'], /view: default_view/);
  assert.match(arq['ui/TEL-T1.now.ts'], /Formatter\.Activities_Filtered/);
  assert.match(arq['ui/TEL-T3.now.ts'], /table: 'sys_ui_view'/);
  assert.match(arq['ui/TEL-T4.now.ts'], /table: 'sys_report'/);
  assert.match(arq['security/roles.now.ts'], /name: "x_2326104_cob\.coordenador"/);
  assert.equal((arq['security/acl-base.now.ts'].match(/operation: 'read'/g) ?? []).length, 4);
  assert.match(arq['navigation/menu.now.ts'], /link_type: 'SEPARATOR'/);
  const plano = planoDeViews(norm);
  assert.equal(plano.get('TEL-T1').view, null);
  assert.equal(plano.get('TEL-T3').view, 'x_2326104_cob_tel_t3');
});

test('manifesto: rota de list pelo nome da tabela e de form pelo sys_id do registro demo', () => {
  const norm = normalizarModelo(MODELO, ESCOPO);
  const keys = `
    'TEL-T1_registro_demo': { table: 'x', id: '11111111111111111111111111111111' }
    'TEL-T3_registro_demo': { table: 'x', id: '33333333333333333333333333333333' }
    'TEL-T4_report': { table: 'sys_report', id: '44444444444444444444444444444444' }
    velho: { table: 'x', id: '55555555555555555555555555555555', deleted: true }`;
  assert.equal(sysIdDaChave(keys, 'velho'), null);
  const { manifesto, faltam } = montarManifesto(norm, keys);
  assert.deepEqual(faltam, []);
  const rota = Object.fromEntries(manifesto.screens.map((s) => [s.id, s.route]));
  assert.equal(rota['TEL-T1'], '/x_2326104_cob_tstpessoa.do?sys_id=11111111111111111111111111111111');
  assert.equal(rota['TEL-T2'], '/x_2326104_cob_tstpessoa_list.do');
  assert.equal(rota['TEL-T3'], '/x_2326104_cob_tstpessoa.do?sys_id=33333333333333333333333333333333&sysparm_view=x_2326104_cob_tel_t3');
  assert.equal(rota['TEL-T4'], '/sys_report_template.do?jvar_report_id=44444444444444444444444444444444');
  for (const s of manifesto.screens) assert.ok('screenshot' in s && 'capturedAt' in s && s.type && s.role);
});

test('nome de tabela acima de 30 caracteres é recusado', () => {
  const m = { entities: [{ name: 'nome_bem_comprido_x', columns: [] }] };
  assert.throws(() => normalizarModelo(m, ESCOPO), /máximo 30/);
});

const SDK = join(APP_REAL, 'node_modules', '@servicenow', 'sdk', 'bin', 'index.js');

test('scaffold completo com now-sdk build de verdade', { skip: !existsSync(SDK) && 'SDK não instalado em app/node_modules', timeout: 600000 }, () => {
  const tmp = mkdtempSync(join(tmpdir(), 'sn-scaffold-'));
  try {
    const app = join(tmp, 'app');
    mkdirSync(join(app, 'src', 'fluent'), { recursive: true });
    copyFileSync(join(APP_REAL, 'now.config.json'), join(app, 'now.config.json'));
    copyFileSync(join(APP_REAL, 'package.json'), join(app, 'package.json'));
    symlinkSync(join(APP_REAL, 'node_modules'), join(app, 'node_modules'), 'dir');
    const modelo = join(tmp, 'data-model.previa.json');
    writeFileSync(modelo, JSON.stringify(MODELO));
    const manifestoArq = join(tmp, 'screens-manifest.json');
    executar({ app, modelo, manifesto: manifestoArq, 'por-tabela': '4' });
    const manifesto = JSON.parse(readFileSync(manifestoArq, 'utf8'));
    assert.equal(manifesto.screens.length, 4);
    for (const s of manifesto.screens) assert.doesNotMatch(s.route, /PENDENTE/);
    assert.ok(existsSync(join(app, 'src', 'fluent', 'seed', '_contagem.json')));
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});

// ——— Navegação por área de trabalho, Administração e trilha de etapas (design ux-cobranca-v1, F1) ———

const AREAS = [
  {
    id: 'MOD-UX-LISTA', label: 'Minha lista', tables: ['tstpessoa'],
    items: [
      { label: 'Minha lista', type: 'FILTER', table: 'tstpessoa', filter: 'situacao=a^ORDERBYnome', view: 'minha_lista', roles: ['atendente'] },
      { title: 'Todas as pessoas', type: 'LIST', table: 'x_2326104_cob_tstpessoa' },
    ],
  },
  {
    id: 'MOD-UX-ANALYTICS', label: 'Analytics', roles: ['coordenador'], order: 1000,
    items: [
      { label: 'Canais por pessoa', type: 'REPORT', report: 'TEL-T4' },
      { label: 'Atalhos', type: 'SEPARATOR' },
      { label: 'Ajuda', type: 'DIRECT', link: 'x_ajuda.do', roles: ['coordenador', 'admin'] },
    ],
  },
  { id: 'MOD-F2', label: 'F2 Simulações', tables: ['tstcanal'] },
];

const modulos = (menu) => [...menu.matchAll(/data: \{ (title: [^\n]*) \},/g)].map((m) => m[1]);
const menuDe = (modelo) => gerarScaffold(normalizarModelo(modelo, ESCOPO), 'App')['navigation/menu.now.ts'];

test('menu sem áreas (comportamento atual): separador pelo label do modelo, e title ainda vale', () => {
  const comLabel = { ...MODELO, modules: [{ id: 'MOD-F1', label: 'Cadastro', tables: ['tstpessoa'] }, { id: 'MOD-F2', label: 'Simulações', tables: ['tstcanal'] }] };
  const menu = menuDe(comLabel);
  const m = modulos(menu);
  assert.equal(m.length, 4);
  assert.match(m[0], /^title: "Cadastro", application: menu, link_type: 'SEPARATOR'/);
  assert.match(m[1], /link_type: 'LIST', name: "x_2326104_cob_tstpessoa", roles: \["x_2326104_cob\.coordenador","x_2326104_cob\.atendente","x_2326104_cob\.admin"\]/);
  assert.match(m[2], /^title: "Simulações", application: menu, link_type: 'SEPARATOR'/);
  assert.match(menu, /Now\.ID\["modulo_grupo_1"\]/);
  assert.doesNotMatch(menu, /Administração|filter:|view_name/);
  // O formato antigo (`title`) continua gerando o separador.
  assert.match(menuDe(MODELO), /title: "F1 Cadastro", application: menu, link_type: 'SEPARATOR'/);
  // Sem modules: um LIST por tabela, sem separador.
  const semModules = { ...MODELO };
  delete semModules.modules;
  const cru = menuDe(semModules);
  assert.equal((cru.match(/link_type: 'LIST'/g) ?? []).length, 2);
  assert.doesNotMatch(cru, /SEPARATOR/);
});

test('menu por área: separador por área com items, módulos com tipo, filtro, view, roles e ordem; área sem items fica fora', () => {
  const norm = normalizarModelo({ ...MODELO, modules: AREAS }, ESCOPO);
  assert.equal(norm.porAreas, true);
  const menu = gerarScaffold(norm, 'App')['navigation/menu.now.ts'];
  const m = modulos(menu);
  assert.equal(m.length, 7);
  assert.match(m[0], /^title: "Minha lista", application: menu, link_type: 'SEPARATOR', roles: \["x_2326104_cob\.atendente","x_2326104_cob\.coordenador","x_2326104_cob\.admin"\], active: true, order: 100$/);
  assert.match(m[1], /^title: "Minha lista", application: menu, link_type: 'FILTER', roles: \["x_2326104_cob\.atendente"\], active: true, name: "x_2326104_cob_tstpessoa", filter: "situacao=a\^ORDERBYnome", view_name: "minha_lista", order: 200$/);
  assert.match(m[2], /^title: "Todas as pessoas", application: menu, link_type: 'LIST', roles: \[[^\]]+\], active: true, name: "x_2326104_cob_tstpessoa", order: 300$/);
  assert.match(m[3], /^title: "Analytics", .*link_type: 'SEPARATOR', roles: \["x_2326104_cob\.coordenador"\], active: true, order: 1000$/);
  assert.match(m[4], /^title: "Canais por pessoa", .*link_type: 'REPORT', roles: \["x_2326104_cob\.coordenador"\], active: true, report: Now\.ref\('sys_report', "TEL-T4_report"\), order: 1100$/);
  assert.match(menu, /title: "Atalhos", application: menu, link_type: 'SEPARATOR'/);
  assert.match(menu, /title: "Ajuda", application: menu, link_type: 'DIRECT', roles: \["x_2326104_cob\.coordenador","x_2326104_cob\.admin"\], active: true, query: "x_ajuda\.do"/);
  assert.match(menu, /Now\.ID\["modulo_mod_ux_lista_minha_lista"\]/);
  assert.doesNotMatch(menu, /F2 Simulações|tstcanal/);
});

test('adminTables: área Administração só para o admin, uma LIST por tabela; com e sem áreas', () => {
  for (const modules of [AREAS, undefined]) {
    const m = modulos(menuDe({ ...MODELO, modules, adminTables: true }));
    const i = m.findIndex((x) => x.startsWith('title: "Administração"'));
    assert.ok(i >= 0);
    assert.match(m[i], /link_type: 'SEPARATOR', roles: \["x_2326104_cob\.admin"\]/);
    const adm = m.slice(i + 1);
    assert.equal(adm.length, 2);
    for (const x of adm) assert.match(x, /link_type: 'LIST', name: "x_2326104_cob_tst(pessoa|canal)", roles: \["x_2326104_cob\.admin"\]/);
  }
  // Sem role admin no app, vale o admin da plataforma.
  const semAdmin = menuDe({ ...MODELO, roles: ['coordenador', 'atendente'], screens: MODELO.screens.map((s) => ({ ...s })), adminTables: true });
  assert.match(semAdmin, /title: "Administração", application: menu, link_type: 'SEPARATOR', roles: \["admin"\]/);
});

test('modules com áreas inválidas: tipo, tabela, report, link absoluto, role e label repetido', () => {
  const com = (items) => ({ ...MODELO, modules: [{ id: 'MOD-A', label: 'A', tables: [], items }] });
  const erro = (items, re) => assert.throws(() => normalizarModelo(com(items), ESCOPO), re);
  erro([{ label: 'x', type: 'KANBAN', table: 'tstpessoa' }], /type "KANBAN" inválido/);
  erro([{ label: 'x', type: 'LIST', table: 'nada' }], /tabela "nada" não está em entities/);
  erro([{ label: 'x', type: 'REPORT', report: 'TEL-T2' }], /não é tela report/);
  erro([{ label: 'x', type: 'DIRECT', link: 'https://dev.service-now.com/x.do' }], /precisa ser relativo/);
  erro([{ label: 'x', type: 'LIST', table: 'tstpessoa', roles: ['gerente'] }], /role "gerente" não está em roles/);
  erro([{ label: 'x', table: 'tstpessoa' }, { title: 'x', table: 'tstpessoa' }], /repetido na área/);
});

test('processFlows: formatter process_flow.xml + 1 sys_process_flow por etapa, e a trilha no topo de todo form da tabela', () => {
  const modelo = {
    ...MODELO,
    processFlows: [{
      table: 'tstpessoa', field: 'situacao',
      steps: [{ label: 'Ativo', value: 'a' }, { label: 'Inativo', condition: 'situacao=i^EQ', order: 900 }],
    }],
  };
  const arq = gerarScaffold(normalizarModelo(modelo, ESCOPO), 'App');
  const pf = arq['ui/_processflow_tstpessoa.now.ts'];
  assert.ok(pf);
  assert.match(pf, /export const processFlow_tstpessoa = Record\(/);
  assert.match(pf, /table: 'sys_ui_formatter',\n    data: \{ name: 'Process Flow', type: 'formatter', formatter: 'process_flow\.xml', table: "x_2326104_cob_tstpessoa", active: true \}/);
  assert.equal((pf.match(/table: 'sys_process_flow'/g) ?? []).length, 2);
  assert.match(pf, /label: "Ativo", table: "x_2326104_cob_tstpessoa", condition: "situacao=a", order: "100"/);
  assert.match(pf, /label: "Inativo", .*condition: "situacao=i\^EQ", order: "900"/);
  for (const tel of ['ui/TEL-T1.now.ts', 'ui/TEL-T3.now.ts']) {
    const f = arq[tel];
    assert.match(f, /import \{ processFlow_tstpessoa \} from '\.\/_processflow_tstpessoa\.now'/);
    // Primeiro bloco do content da primeira seção.
    assert.match(f, /content: \[\n {16}\{ layout: 'one-column', elements: \[\{ type: 'formatter', formatterRef: processFlow_tstpessoa, formatterName: 'process_flow\.xml' \}\] \},/);
    assert.equal((f.match(/process_flow\.xml/g) ?? []).length, 1);
  }
  assert.doesNotMatch(arq['ui/_form_tstcanal.now.ts'], /processFlow/);
  // Sem processFlows: nenhum arquivo e nenhum formatter de trilha.
  const sem = gerarScaffold(normalizarModelo(MODELO, ESCOPO), 'App');
  assert.ok(!Object.keys(sem).some((k) => k.includes('processflow')));
  assert.doesNotMatch(sem['ui/TEL-T1.now.ts'], /process_flow/);
});

test('processFlows: tabela sem form ganha a trilha no form padrão; erros de tabela, campo, etapa e repetição', () => {
  const ok = normalizarModelo({ ...MODELO, processFlows: [{ table: 'tstcanal', steps: [{ label: 'Um', condition: 'valor>0' }] }] }, ESCOPO);
  assert.match(gerarScaffold(ok, 'App')['ui/_form_tstcanal.now.ts'], /formatterRef: processFlow_tstcanal/);
  const erro = (processFlows, re) => assert.throws(() => normalizarModelo({ ...MODELO, processFlows }, ESCOPO), re);
  erro([{ table: 'nada', steps: [{ label: 'a', condition: 'x=1' }] }], /tabela "nada" não está em entities/);
  erro([{ table: 'tstpessoa', field: 'estado', steps: [{ label: 'a', condition: 'x=1' }] }], /campo "estado" não existe/);
  erro([{ table: 'tstpessoa', steps: [] }], /steps vazio/);
  erro([{ table: 'tstpessoa', steps: [{ label: 'a' }] }], /etapa sem condition/);
  erro([{ table: 'tstpessoa', steps: [{ label: 'a', condition: 'x=1' }, { label: 'a', condition: 'x=2' }] }], /repetida/);
  erro([{ table: 'tstpessoa', steps: [{ label: 'a', condition: 'x=1' }] }, { table: 'tstpessoa', steps: [{ label: 'b', condition: 'x=1' }] }], /já tem trilha/);
});

test('menu por área, REPORT, trilha de etapas e home passam no now-sdk build de verdade', { skip: !existsSync(SDK) && 'SDK não instalado em app/node_modules', timeout: 600000 }, () => {
  const tmp = mkdtempSync(join(tmpdir(), 'sn-scaffold-ux-'));
  try {
    const app = join(tmp, 'app');
    mkdirSync(join(app, 'src', 'fluent'), { recursive: true });
    copyFileSync(join(APP_REAL, 'now.config.json'), join(app, 'now.config.json'));
    copyFileSync(join(APP_REAL, 'package.json'), join(app, 'package.json'));
    symlinkSync(join(APP_REAL, 'node_modules'), join(app, 'node_modules'), 'dir');
    const modelo = join(tmp, 'data-model.previa.json');
    writeFileSync(modelo, JSON.stringify({
      ...MODELO, modules: AREAS, adminTables: true,
      processFlows: [{ table: 'tstpessoa', field: 'situacao', steps: [{ label: 'Ativo', value: 'a' }, { label: 'Inativo', value: 'i' }] }],
      homes: [{ role: 'atendente', module: 'Minha lista' }],
    }));
    executar({ app, modelo, manifesto: join(tmp, 'screens-manifest.json'), 'por-tabela': '2' });
    const keys = readFileSync(join(app, 'src', 'fluent', 'generated', 'keys.ts'), 'utf8');
    for (const k of ['modulo_mod_ux_analytics_canais_por_pessoa', 'processflow_tstpessoa_formatter', 'processflow_tstpessoa_ativo', 'home_usuario_demo_atendente']) {
      assert.ok(sysIdDaChave(keys, k), `chave ${k} ausente no keys.ts`);
    }
  } finally {
    rmSync(tmp, { recursive: true, force: true });
  }
});
