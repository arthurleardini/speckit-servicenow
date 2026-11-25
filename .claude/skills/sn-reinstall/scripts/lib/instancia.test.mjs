import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fetchComRetry } from './instancia.mjs';

const semEspera = { esperaMs: 0, aviso: () => {} };

test('fetchComRetry: «fetch failed» (EPIPE) é refeito e a terceira tentativa vale', async () => {
  let n = 0;
  const fetchFn = async () => {
    n++;
    if (n < 3) throw new TypeError('fetch failed', { cause: { code: 'EPIPE' } });
    return { status: 204 };
  };
  const avisos = [];
  const r = await fetchComRetry('http://x', { method: 'DELETE' }, { ...semEspera, fetchFn, aviso: (m) => avisos.push(m) });
  assert.equal(r.status, 204);
  assert.equal(n, 3);
  assert.equal(avisos.length, 2);
  assert.match(avisos[0], /DELETE falhou: fetch failed \(EPIPE\); tentativa 2 de 4/);
});

test('fetchComRetry: desiste depois do número de tentativas e relança o erro', async () => {
  let n = 0;
  const fetchFn = async () => { n++; throw new TypeError('fetch failed'); };
  await assert.rejects(fetchComRetry('http://x', {}, { ...semEspera, fetchFn, tentativas: 3 }), /fetch failed/);
  assert.equal(n, 3);
});

test('fetchComRetry: erro que não é de rede não é refeito', async () => {
  let n = 0;
  const fetchFn = async () => { n++; throw new Error('outro'); };
  await assert.rejects(fetchComRetry('http://x', {}, { ...semEspera, fetchFn }), /outro/);
  assert.equal(n, 1);
});

test('fetchComRetry: resposta HTTP de erro volta sem nova tentativa', async () => {
  let n = 0;
  const fetchFn = async () => { n++; return { status: 500 }; };
  const r = await fetchComRetry('http://x', {}, { ...semEspera, fetchFn });
  assert.equal(r.status, 500);
  assert.equal(n, 1);
});

test('fetchComRetry: a espera dobra a cada tentativa', async () => {
  let n = 0;
  const fetchFn = async () => { n++; if (n < 4) throw new TypeError('fetch failed'); return { status: 200 }; };
  const avisos = [];
  await fetchComRetry('http://x', {}, { fetchFn, esperaMs: 1, aviso: (m) => avisos.push(m) });
  assert.deepEqual(avisos.map((m) => m.match(/em (\d+) ms/)[1]), ['1', '2', '4']);
});
