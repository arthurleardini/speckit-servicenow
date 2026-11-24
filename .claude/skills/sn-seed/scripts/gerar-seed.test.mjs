import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  cnpjValido, cpfValido, criarPrng, gerarCnpj, gerarCpf, gerarSeed, gravarSeed, normalizarModelo, RE_CNPJ, RE_CPF,
} from './gerar-seed.mjs';

const ESCOPO = 'x_9999999_tst';
const MODELO = {
  entities: [
    {
      name: 'pessoa', label: 'Pessoa', pessoa: true,
      columns: [
        { name: 'nome', label: 'Nome', type: 'string' },
        { name: 'cpf', label: 'CPF', type: 'string', format: 'cpf' },
        { name: 'ficticio', label: 'Fictício', type: 'boolean' },
        { name: 'situacao', label: 'Situação', type: 'choice', choices: ['ativo', 'inativo'] },
      ],
    },
    {
      name: 'empresa', label: 'Empresa',
      columns: [
        { name: 'razao_social', label: 'Razão social', type: 'string' },
        { name: 'cnpj', label: 'CNPJ', type: 'string', format: 'cnpj' },
        { name: 'responsavel', label: 'Responsável', type: 'reference', reference: 'pessoa' },
        { name: 'atendente', label: 'Atendente', type: 'reference', reference: 'sys_user' },
      ],
    },
  ],
  screens: [
    { id: 'TEL-01', table: 'pessoa', type: 'form', role: 'atendente' },
    { id: 'TEL-02', table: 'empresa', type: 'list', role: 'coordenador' },
    { id: 'TEL-03', table: 'empresa', type: 'form', role: 'coordenador' },
  ],
  roles: ['coordenador', 'atendente'],
};

test('CPF e CNPJ gerados têm DV válido; DV trocado é rejeitado', () => {
  const rng = criarPrng(42);
  for (let i = 0; i < 500; i++) {
    const cpf = gerarCpf(rng);
    const cnpj = gerarCnpj(rng);
    assert.ok(cpfValido(cpf), cpf);
    assert.ok(cnpjValido(cnpj), cnpj);
    assert.match(cpf, /^\d{3}\.\d{3}\.\d{3}-\d{2}$/);
    assert.match(cnpj, /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/);
  }
  assert.ok(cpfValido('529.982.247-25'));
  assert.ok(!cpfValido('529.982.247-24'));
  assert.ok(!cpfValido('111.111.111-11'));
  assert.ok(cnpjValido('11.222.333/0001-81'));
  assert.ok(!cnpjValido('11.222.333/0001-80'));
});

test('determinismo: mesma entrada gera exatamente a mesma saída', () => {
  const a = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 20 });
  const b = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 20 });
  assert.deepEqual(a, b);
  const c = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 20, semente: 7 });
  assert.notDeepEqual(a.arquivos, c.arquivos);
});

test('contagem: N por tabela + 1 registro demo por tela de form; usuários e journal', () => {
  const r = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 10 });
  assert.equal(r.contagem.tabelas[`${ESCOPO}_pessoa`], 11);
  assert.equal(r.contagem.tabelas[`${ESCOPO}_empresa`], 11);
  const txt = r.arquivos['pessoa.now.ts'];
  assert.equal((txt.match(/^Record\(/gm) ?? []).length, 11);
  assert.match(txt, /Now\.ID\["TEL-01_registro_demo"\]/);
  assert.match(txt, /installMethod: 'demo'/);
  assert.match(txt, /ficticio: true/);
  assert.doesNotMatch(txt, /ficticio: false/);
  const users = r.arquivos['_usuarios.now.ts'];
  assert.match(users, /user_name: "demo\.coordenador"/);
  assert.match(users, /user_name: "demo\.atendente"/);
  assert.doesNotMatch(users, /password/);
  const journal = r.arquivos['_journal.now.ts'];
  const qtd = (journal.match(/table: "sys_journal_field"/g) ?? []).length;
  assert.ok(qtd >= 4 && qtd <= 6, `journal: ${qtd}`); // 2–3 por registro demo, 2 telas de form
  assert.match(r.arquivos['empresa.now.ts'], /Now\.ref\("x_9999999_tst_pessoa", "seed_pessoa_\d{3}"\)/);
});

test('_documentos.json lista todo CPF/CNPJ que aparece nos arquivos', () => {
  const r = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 30 });
  const lista = new Set(r.documentos.documentos.map((d) => d.valor));
  const todos = Object.values(r.arquivos).flatMap((t) => [...(t.match(RE_CPF) ?? []), ...(t.match(RE_CNPJ) ?? [])]);
  assert.ok(todos.length >= 60);
  for (const v of todos) assert.ok(lista.has(v), v);
  assert.equal(lista.size, r.documentos.documentos.length, 'sem documento repetido');
});

test('limites e validação do modelo', () => {
  const norm = normalizarModelo(MODELO, ESCOPO);
  assert.throws(() => gerarSeed(norm, { porTabela: 301 }), /entre 1 e 300/);
  assert.throws(() => gerarSeed(norm, { porTabela: 0 }), /entre 1 e 300/);
  const longo = { entities: [{ name: 'nome_de_tabela_comprido_demais', columns: [] }] };
  assert.throws(() => normalizarModelo(longo, ESCOPO), /máximo 30/);
  const telaRuim = { ...MODELO, screens: [{ id: 'TEL-9', table: 'inexistente', type: 'form' }] };
  assert.throws(() => normalizarModelo(telaRuim, ESCOPO), /não está em entities/);
});

test('gravarSeed grava os .now.ts e os dois JSON, e remove arquivo gerado que saiu do modelo', () => {
  const app = mkdtempSync(join(tmpdir(), 'sn-seed-'));
  const r = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 3 });
  const dir = gravarSeed(r, app);
  writeFileSync(join(dir, 'velho.now.ts'), r.arquivos['pessoa.now.ts']);
  writeFileSync(join(dir, 'manual.now.ts'), '// feito à mão\n');
  gravarSeed(r, app);
  const nomes = readdirSync(dir).sort();
  assert.ok(nomes.includes('_documentos.json') && nomes.includes('_contagem.json'));
  assert.ok(!nomes.includes('velho.now.ts'));
  assert.ok(nomes.includes('manual.now.ts'));
  assert.equal(JSON.parse(readFileSync(join(dir, '_contagem.json'), 'utf8')).porTabela, 3);
});

test('demoUsers: usuário extra por role e carteira distribuída em rodízio entre os usuários do role', () => {
  const modelo = { ...MODELO, demoUsers: [{ user: 'demo.atendente2', role: 'atendente' }] };
  const r = gerarSeed(normalizarModelo(modelo, ESCOPO), { porTabela: 10 });
  const users = r.arquivos['_usuarios.now.ts'];
  assert.match(users, /user_name: "demo\.atendente2"/);
  assert.match(users, /Now\.ID\["usuario_demo_atendente2_role"\]/);
  const extra = r.contagem.extras.find((e) => e.tabela === 'sys_user');
  assert.equal(extra.esperado, 3);
  assert.match(extra.query, /demo\.atendente2/);
  const empresa = r.arquivos['empresa.now.ts'];
  const a1 = (empresa.match(/atendente: Now\.ref\("sys_user", "usuario_demo_atendente"\)/g) ?? []).length;
  const a2 = (empresa.match(/atendente: Now\.ref\("sys_user", "usuario_demo_atendente2"\)/g) ?? []).length;
  assert.equal(a1 + a2, 11);
  assert.ok(a1 >= 5 && a2 >= 5, `${a1}/${a2}`);
  // Sem demoUsers, a coluna com nome de role aponta sempre para o único usuário do role.
  const sem = gerarSeed(normalizarModelo(MODELO, ESCOPO), { porTabela: 10 }).arquivos['empresa.now.ts'];
  assert.doesNotMatch(sem, /usuario_demo_atendente2/);
});

test('demoUsers inválido: role desconhecido, nome fora do padrão ou repetido', () => {
  const com = (demoUsers) => ({ ...MODELO, demoUsers });
  assert.throws(() => normalizarModelo(com([{ user: 'demo.x', role: 'gerente' }]), ESCOPO), /não está em roles/);
  assert.throws(() => normalizarModelo(com([{ user: 'fulano', role: 'atendente' }]), ESCOPO), /fora do padrão/);
  assert.throws(() => normalizarModelo(com([{ user: 'demo.atendente', role: 'atendente' }]), ESCOPO), /repetido/);
});
