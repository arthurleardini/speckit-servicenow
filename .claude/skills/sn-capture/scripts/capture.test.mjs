import { test } from 'node:test';
import assert from 'node:assert/strict';
import { caminhoPng, RE_FALHA, urlDaRota } from './capture.mjs';

test('caminho do PNG segue a convenção do kit (relativo a outputs/spec/)', () => {
  assert.equal(caminhoPng('TEL-01'), 'screens/TEL-01.png');
  assert.equal(caminhoPng('TEL-01', 'ST-07'), 'screens/deliver/ST-07-TEL-01.png');
});

test('rota direta ou dentro do cabeçalho da instância', () => {
  const base = 'https://exemplo.service-now.com';
  assert.equal(urlDaRota(base, '/x_t_list.do', false), 'https://exemplo.service-now.com/x_t_list.do');
  assert.equal(urlDaRota(base, '/x_t.do?sys_id=1', true), 'https://exemplo.service-now.com/now/nav/ui/classic/params/target/x_t.do%3Fsys_id%3D1');
});

test('mensagens de rota quebrada são reconhecidas', () => {
  assert.ok(RE_FALHA.test('Record not found'));
  assert.ok(RE_FALHA.test('Security constraints prevent access to requested page'));
  assert.ok(!RE_FALHA.test('Registro demo TEL-01'));
});
