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
