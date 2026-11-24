import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lerEnvelope, RE_PASSO_UI, testesDoArquivo } from './atf.mjs';

test('testesDoArquivo resolve o sys_id do Test() pelo keys.ts e ignora chave deletada', () => {
  const fonte = `
    Test({ $id: Now.ID['ST-01_positivo'], name: 'a' }, (atf) => {})
    Test(
      {
        $id: Now.ID["ST-01_negativo"],
        name: 'b',
      }, (atf) => {})`;
  const keys = `
    'ST-01_positivo': { table: 'sys_atf_test'
        id: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' }
    'ST-01_negativo': { table: 'sys_atf_test', id: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb', deleted: true }`;
  assert.deepEqual(testesDoArquivo(fonte, keys), [
    { chave: 'ST-01_positivo', sysId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { chave: 'ST-01_negativo', sysId: null },
  ]);
});

test('lerEnvelope lê o formato do now-sdk cicd -o json (SDK 4.14.3)', () => {
  const env = {
    ok: true,
    result: { status: '0', status_label: 'Pending' },
    progress: { successful: true, links: { results: { id: 'r1' } } },
    interpretedResult: {
      successful: true,
      summary: { resultId: 'r1', testSuiteStatus: 'success', successCount: 1, failureCount: 0 },
      displayMessage: 'Suite result: success',
    },
  };
  const r = lerEnvelope(env);
  assert.equal(r.status, 'success');
  assert.equal(r.resultId, 'r1');
  assert.deepEqual(r.resumo, { successCount: 1, failureCount: 0 });
  assert.equal(lerEnvelope({ progress: { successful: false } }).status, 'failure');
  assert.equal(lerEnvelope(null).status, null);
});

test('RE_PASSO_UI detecta passo que precisa do Client Test Runner', () => {
  assert.ok(RE_PASSO_UI.test('atf.form.openNewForm({'));
  assert.ok(RE_PASSO_UI.test('atf.list.recordPresentInList({'));
  assert.ok(!RE_PASSO_UI.test('atf.server.recordInsert({'));
});
