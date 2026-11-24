// Speckit ServiceNow — item 23 do design: o data-model no formato ServiceNow (o mesmo da prévia
// `outputs/spec/data-model.previa.json`), validado por `spec-data-model/scripts/validate-data-model.mjs`.
//
// Cada regra da plataforma que o schema não alcança tem um caso que reprova: prefixo de escopo lido
// de `app/now.config.json`, nome de tabela acima de 30 caracteres, tipo de coluna inválido,
// reference para tabela inexistente, coluna com prefixo, campo de tela inexistente, `rf[]` ausente no
// modo final. E os dois controles: o exemplo do kit passa, e o modo `--previa` aceita tabela sem `rf`.
// Rota sem ajv (`--no-npx`): exit 2 = válido em validação reduzida, que é o que a máquina de teste tem.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { spawnSync } from 'node:child_process';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SKILL = join(RAIZ, '.claude', 'skills', 'spec-data-model');
const VALIDADOR = join(SKILL, 'scripts', 'validate-data-model.mjs');
const EXEMPLO = join(SKILL, 'templates', 'data-model.servicenow.example.json');
const exemplo = () => JSON.parse(readFileSync(EXEMPLO, 'utf8'));

/** Projeto temporário com app/now.config.json e o modelo em outputs/spec/. */
function projeto(modelo, { escopo = 'x_0000000_exe', arquivo = 'data-model.json', semConfig = false } = {}) {
  const dir = mkdtempSync(join(tmpdir(), 'dm-sn-'));
  if (!semConfig) {
    mkdirSync(join(dir, 'app'), { recursive: true });
    writeFileSync(join(dir, 'app', 'now.config.json'), JSON.stringify({ scope: escopo, name: 'Exemplo' }));
  }
  mkdirSync(join(dir, 'outputs', 'spec'), { recursive: true });
  writeFileSync(join(dir, 'outputs', 'spec', arquivo), JSON.stringify(modelo, null, 2));
  return dir;
}

function validar(dir, ...extra) {
  const r = spawnSync(process.execPath, [VALIDADOR, '--no-npx', ...extra], { cwd: dir, encoding: 'utf8' });
  rmSync(dir, { recursive: true, force: true });
  return { codigo: r.status, saida: `${r.stdout}\n${r.stderr}` };
}

const valido = (r) => r.codigo === 0 || r.codigo === 2;

test('23 — o exemplo ServiceNow do kit passa no modo final', () => {
  const r = validar(projeto(exemplo()));
  assert.ok(valido(r), r.saida);
  assert.match(r.saida, /formato ServiceNow, final/);
});

test('23 — o exemplo passa no check-traceability (rf/rn por tabela; simulação fica de fora)', async () => {
  const { conferirModelo } = await import(pathToFileURL(join(SKILL, 'scripts', 'check-traceability.mjs')).href);
  const r = conferirModelo(exemplo());
  assert.equal(r.entidades, 3);
  assert.deepEqual(r.achados, []);
  const m = exemplo();
  delete m.entities[0].rf;
  assert.deepEqual(conferirModelo(m).achados.map((a) => a.code), ['TRACEABILITY_PRESENT']);
});

test('23 — escopo diferente do app/now.config.json reprova', () => {
  const r = validar(projeto(exemplo(), { escopo: 'x_9999999_out' }));
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /difere do escopo do app/);
  assert.match(r.saida, /sem o prefixo do escopo "x_9999999_out_"/);
});

test('23 — sem app/now.config.json o escopo não é conferido, e isso é dito', () => {
  const r = validar(projeto(exemplo(), { semConfig: true }));
  assert.ok(valido(r), r.saida);
  assert.match(r.saida, /escopo NÃO foi conferido/);
});

test('23 — tabela com mais de 30 caracteres reprova', () => {
  const m = exemplo();
  const longo = 'x_0000000_exe_nome_muito_comprido';
  assert.ok(longo.length > 30);
  m.entities[2].name = longo;
  m.modules[1].tables = [longo];
  const r = validar(projeto(m));
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /limite da plataforma é 30/);
});

test('23 — tipo de coluna fora dos tipos ServiceNow reprova', () => {
  const m = exemplo();
  m.entities[1].columns[2].type = 'VARCHAR';
  const r = validar(projeto(m));
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /type/);
});

test('23 — reference para tabela que não existe reprova; OOTB conhecida passa', () => {
  const m = exemplo();
  m.entities[1].columns[0].reference = 'x_0000000_exe_inexistente';
  const r = validar(projeto(m));
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /não está no modelo nem na lista de tabelas OOTB/);
  // sys_user (OOTB) é a reference do `responsavel` no exemplo, que passa no primeiro teste.
});

test('23 — coluna de tabela própria com prefixo reprova', () => {
  const m = exemplo();
  m.entities[0].columns[0].name = 'u_nome';
  m.screens.forEach((s) => { if (s.fields) s.fields = s.fields.map((f) => (f === 'nome' ? 'u_nome' : f)); });
  const r = validar(projeto(m));
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /com prefixo/);
});

test('23 — campo de tela que não existe na tabela reprova', () => {
  const m = exemplo();
  m.screens[1].fields.push('campo_fantasma');
  const r = validar(projeto(m));
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /campo "campo_fantasma" da tela TEL-002/);
});

test('23 — modo final exige rf[] em tabela que não é simulação; --previa não exige', () => {
  const m = exemplo();
  delete m.entities[0].rf;
  const final = validar(projeto(m));
  assert.equal(final.codigo, 1, final.saida);
  assert.match(final.saida, /x_0000000_exe_cliente" sem rf\[\]/);
  assert.doesNotMatch(final.saida, /frete_sim" sem rf/);

  const previa = validar(projeto(m, { arquivo: 'data-model.previa.json' }), '--previa');
  assert.ok(valido(previa), previa.saida);
  assert.match(previa.saida, /formato ServiceNow, prévia/);
  assert.match(previa.saida, /data-model\.previa\.json/);
});

test('23 — --previa recusa o formato antigo e recusa arquivo ausente', () => {
  const antigo = JSON.parse(readFileSync(join(SKILL, 'templates', 'data-model.greenfield.example.json'), 'utf8'));
  const r = validar(projeto(antigo, { arquivo: 'data-model.previa.json' }), '--previa');
  assert.equal(r.codigo, 1, r.saida);
  assert.match(r.saida, /não está no formato ServiceNow/);

  const dir = mkdtempSync(join(tmpdir(), 'dm-sn-'));
  const ausente = validar(dir, '--previa');
  assert.equal(ausente.codigo, 1, ausente.saida);
  assert.match(ausente.saida, /prévia do modelo não encontrada/);
});

test('23 — o formato antigo (boundedContexts) continua validado como antes', () => {
  const antigo = JSON.parse(readFileSync(join(SKILL, 'templates', 'data-model.greenfield.example.json'), 'utf8'));
  const r = validar(projeto(antigo));
  assert.ok(valido(r), r.saida);
  assert.doesNotMatch(r.saida, /formato ServiceNow/);
});

test('23 — os renderizadores leem o formato ServiceNow (visão boundedContexts)', async () => {
  const { comoBoundedContexts, ehModeloServiceNow } = await import(pathToFileURL(join(SKILL, 'scripts', 'lib', 'servicenow.mjs')).href);
  const m = exemplo();
  assert.ok(ehModeloServiceNow(m));
  const v = comoBoundedContexts(m);
  assert.deepEqual(v.boundedContexts.map((b) => b.id), ['MOD-F1', 'MOD-T']);
  const pedido = v.boundedContexts[0].entities.find((e) => e.name === 'x_0000000_exe_pedido');
  // reference para tabela do modelo vira relacionamento; para OOTB (sys_user), não.
  assert.deepEqual(pedido.relationships.map((r) => r.targetEntity), ['x_0000000_exe_cliente']);
  assert.equal(v.boundedContexts[0].entities[0].relationships.length, 0);
});
