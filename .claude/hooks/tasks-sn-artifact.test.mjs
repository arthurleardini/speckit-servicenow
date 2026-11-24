// Speckit ServiceNow — itens 20 e 21 do design: schema tasks/v5.4 (Task.snArtifact opcional) e os
// validadores do backlog que passam a entender a task ServiceNow.
//
// O que se prende aqui: o schema aceita v5.3 e v5.4 e declara os 17 kinds; a task com snArtifact
// pela metade reprova em SN_ARTIFACT_COMPLETE; `table` só é exigido nos kinds que têm tabela; a task
// ServiceNow sai limpa sem apiContracts (exceto kind=simulation) e com colunas em tipo ServiceNow; a
// mesma coluna em tipo ServiceNow SEM snArtifact continua reprovando (a isenção não vaza para o
// backlog Next.js); e o --write de um validador não apaga os SN_ARTIFACT_ gravados pelo outro.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const TASKS = join(RAIZ, '.claude', 'skills', 'spec-tasks');
const SCHEMA = JSON.parse(readFileSync(join(TASKS, 'templates', 'tasks.schema-atual.json'), 'utf8'));
const EXEMPLO = JSON.parse(readFileSync(join(TASKS, 'templates', 'tasks.sn-story-example.json'), 'utf8'));
const SELF = join(TASKS, 'scripts', 'validate-tasks-selfsufficiency.mjs');
const BUSINESS = join(TASKS, 'scripts', 'validate-tasks-business.mjs');

const clone = (o) => JSON.parse(JSON.stringify(o));

/** Roda um validador num backlog temporário; devolve exit e os achados. */
function rodar(script, doc, ...extra) {
  const dir = mkdtempSync(join(tmpdir(), 'tasks-sn-'));
  const arq = join(dir, 'tasks.json');
  writeFileSync(arq, JSON.stringify(doc, null, 2));
  const r = spawnSync(process.execPath, [script, arq, '--max', '500', ...extra], { encoding: 'utf8' });
  let saida = {};
  try { saida = JSON.parse(r.stdout); } catch { /* exit 2 não emite JSON */ }
  const gravado = JSON.parse(readFileSync(arq, 'utf8'));
  rmSync(dir, { recursive: true, force: true });
  return { codigo: r.status, erros: saida.errors ?? [], avisos: saida.warnings ?? [], gravado, stderr: r.stderr };
}

/** Backlog de uma story com a task do exemplo (alterada por `mexer`). */
function backlog(mexer = () => {}) {
  const story = clone(EXEMPLO);
  delete story._comment;
  mexer(story.tasks[0], story);
  return { metadata: { schemaVersion: 'tasks/v5.4' }, stories: [story] };
}
const codigos = (lista, scope = 'TASK-MOD-F2-003-01') => lista.filter((e) => e.scope === scope).map((e) => e.code);

test('20 — schemaVersion aceita tasks/v5.3 e tasks/v5.4', () => {
  assert.deepEqual(SCHEMA.properties.metadata.properties.schemaVersion.enum, ['tasks/v5.3', 'tasks/v5.4']);
});

test('20 — Task.snArtifact é opcional, com os 17 kinds e kind/fluentFile/nowId obrigatórios', () => {
  const task = SCHEMA.definitions.Task;
  assert.ok(!task.required.includes('snArtifact'));
  assert.equal(task.properties.snArtifact.$ref, '#/definitions/SnArtifact');
  const sn = SCHEMA.definitions.SnArtifact;
  assert.deepEqual(sn.required, ['kind', 'fluentFile', 'nowId']);
  assert.equal(sn.properties.kind.enum.length, 17);
  for (const k of ['table', 'business_rule', 'acl', 'atf', 'seed', 'simulation']) assert.ok(sn.properties.kind.enum.includes(k), k);
  // Task.type não muda (A6): nenhum tipo sn_* entrou no schema.
  assert.doesNotMatch(JSON.stringify(SCHEMA.definitions.Task.properties.type ?? {}), /sn_/);
  // uiContext não ganha instanceUrl: a rota na instância vai em `rota`.
  assert.ok(!('instanceUrl' in SCHEMA.definitions.UiContext.properties));
});

test('21 — o exemplo ServiceNow sai limpo: sem apiContracts e com colunas em tipo ServiceNow', () => {
  const r = rodar(SELF, backlog());
  assert.equal(r.codigo, 0, JSON.stringify(r.erros, null, 1));
  assert.deepEqual(codigos(r.avisos), []);
});

test('21 — snArtifact pela metade reprova em SN_ARTIFACT_COMPLETE (kind, fluentFile, nowId)', () => {
  const r = rodar(SELF, backlog((t) => { t.snArtifact = { kind: 'business_rule', table: 'x_2326104_cob_criterio' }; }));
  assert.equal(r.codigo, 1);
  const campos = r.erros.filter((e) => e.code === 'SN_ARTIFACT_COMPLETE').map((e) => e.field).sort();
  assert.deepEqual(campos, ['snArtifact.fluentFile', 'snArtifact.nowId']);

  const k = rodar(SELF, backlog((t) => { t.snArtifact.kind = 'sn_business_rule'; }));
  assert.ok(k.erros.some((e) => e.code === 'SN_ARTIFACT_COMPLETE' && e.field === 'snArtifact.kind'));
});

test('21 — `table` exigido só nos kinds com tabela única', () => {
  const br = rodar(SELF, backlog((t) => { delete t.snArtifact.table; }));
  assert.ok(br.erros.some((e) => e.code === 'SN_ARTIFACT_COMPLETE' && e.field === 'snArtifact.table'), 'business_rule sem table');

  for (const kind of ['role', 'menu', 'flow', 'notification', 'atf']) {
    const r = rodar(SELF, backlog((t) => { t.snArtifact.kind = kind; delete t.snArtifact.table; }));
    assert.ok(!r.erros.some((e) => e.code === 'SN_ARTIFACT_COMPLETE'), kind);
  }
});

test('21 — apiContracts: dispensado com snArtifact, exceto kind=simulation', () => {
  const citaRota = (t) => { t.description += ' Consulta o serviço /v1/score/contribuinte para o fallback.'; };
  const sn = rodar(SELF, backlog(citaRota));
  assert.ok(!codigos(sn.erros).includes('TASK_MISSING_API_CONTRACT'));

  const sim = rodar(SELF, backlog((t) => { citaRota(t); t.snArtifact.kind = 'simulation'; }));
  assert.ok(codigos(sim.erros).includes('TASK_MISSING_API_CONTRACT'), JSON.stringify(sim.erros));

  const semSn = rodar(SELF, backlog((t) => { citaRota(t); delete t.snArtifact; }));
  assert.ok(codigos(semSn.erros).includes('TASK_MISSING_API_CONTRACT'));
});

test('21 — tipo de coluna ServiceNow só vale com snArtifact; persistenceModel ausente vira aviso', () => {
  const semSn = rodar(SELF, backlog((t) => { delete t.snArtifact; }));
  assert.ok(semSn.erros.some((e) => e.code === 'TASK_HAS_COMPLETE_DATA_MODEL'), 'sem snArtifact, `string`/`reference` não são tipo SQL');

  const semPm = rodar(SELF, backlog((t) => {
    delete t.persistenceModel;
    t.description += ' Grava em tb_criterio_historico.';
  }));
  assert.ok(!codigos(semPm.erros).includes('TASK_MISSING_PERSISTENCE_MODEL'));
  assert.ok(codigos(semPm.avisos).includes('TASK_MISSING_PERSISTENCE_MODEL'));
});

test('21 — testData da task ServiceNow: registro de entrada e estado esperado, sem request HTTP', () => {
  const semRegistro = rodar(SELF, backlog((t) => { delete t.acceptanceScenarios[0].testData.record; }));
  assert.ok(semRegistro.erros.some((e) => e.code === 'TASK_HAS_CONCRETE_TEST_DATA' && /registro de entrada/.test(e.message)));
  const semEstado = rodar(SELF, backlog((t) => { delete t.acceptanceScenarios[1].testData.expectedDatabaseState; }));
  assert.ok(semEstado.erros.some((e) => e.code === 'TASK_HAS_CONCRETE_TEST_DATA' && /expectedDatabaseState/.test(e.field)));
});

test('21 — o --write do validador de negócio preserva os SN_ARTIFACT_ gravados pelo de auto-suficiência', () => {
  const doc = backlog((t) => { delete t.snArtifact.nowId; });
  doc.metadata.fatalErrors = [
    { code: 'SN_ARTIFACT_COMPLETE', scope: 'TASK-MOD-F2-003-01', message: 'nowId ausente' },
    { code: 'UAT_TASK_HAS_SUMMARY', scope: 'TASK-UAT', message: 'x' },
  ];
  const r = rodar(BUSINESS, doc, '--write');
  const mantidos = (r.gravado.metadata.fatalErrors ?? []).map((e) => e.code);
  assert.ok(mantidos.includes('SN_ARTIFACT_COMPLETE'), JSON.stringify(mantidos));
  assert.ok(mantidos.includes('UAT_TASK_HAS_SUMMARY'), JSON.stringify(mantidos));
});
