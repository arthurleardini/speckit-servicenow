import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { conferirContagem, conferirDocumentos, executar, orfaosDeDados, prefixoConfere, registrarSyncLog } from './reinstall.mjs';
import { lerLinhasSecaoA } from '../../../hooks/kit.mjs';

test('prefixo da instância precisa abrir o escopo', () => {
  assert.ok(prefixoConfere('x_2326104_cob', '2326104'));
  assert.ok(!prefixoConfere('x_2326104_cob', '999'));
  assert.ok(!prefixoConfere('x_2326104_cob', null));
});

test('documentos do seed: fora da lista e DV inválido são apontados', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sn-reinst-'));
  writeFileSync(join(dir, '_documentos.json'), JSON.stringify({ documentos: [{ valor: '529.982.247-25' }, { valor: '529.982.247-24' }] }));
  writeFileSync(join(dir, 'a.now.ts'), 'cpf: "529.982.247-25"\ncpf: "529.982.247-24"\ncpf: "123.456.789-09"\ncnpj: "11.222.333/0001-81"');
  const p = conferirDocumentos(dir);
  assert.equal(p.length, 3);
  assert.ok(p.some((x) => /529\.982\.247-24 com DV inválido/.test(x)));
  assert.ok(p.some((x) => /123\.456\.789-09 fora/.test(x)));
  assert.ok(p.some((x) => /CNPJ 11\.222\.333\/0001-81 fora/.test(x)));
});

test('contagem: exata por tabela e mínimo nos extras marcados', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'sn-reinst-'));
  writeFileSync(join(dir, '_contagem.json'), JSON.stringify({
    tabelas: { t1: 3, t2: 2 },
    extras: [{ tabela: 'sys_journal_field', query: 'name=t1', esperado: 2, minimo: true }],
  }));
  const ok = await conferirContagem(async (t) => ({ t1: 3, t2: 2, sys_journal_field: 5 })[t], dir);
  assert.deepEqual(ok.divergencias, []);
  assert.equal(ok.total, 5);
  const ruim = await conferirContagem(async (t) => ({ t1: 3, t2: 1, sys_journal_field: 1 })[t], dir);
  assert.equal(ruim.divergencias.length, 2);
});

test('sync-log: cria pelo template e põe a linha mais recente no topo, nas nove colunas', () => {
  const arq = join(mkdtempSync(join(tmpdir(), 'sn-reinst-')), 'sync-log.md');
  const campos = { skill: 'now-sdk-install', modo: 'dev493801', inputs: 'x_2326104_cob', outputs: 'abc123', decisoes: 'ok; 11 registros', decisor: '—', proximo: 'sn-capture' };
  registrarSyncLog(arq, campos, new Date(2026, 10, 24, 9, 5));
  registrarSyncLog(arq, { ...campos, decisoes: 'falha-install; 0 registros' }, new Date(2026, 10, 24, 9, 7));
  const linhas = lerLinhasSecaoA(readFileSync(arq, 'utf8'));
  assert.equal(linhas.length, 2);
  assert.equal(linhas[0].numero, 2);
  assert.equal(linhas[0].decisoes, 'falha-install; 0 registros');
  assert.equal(linhas[1].hora, '09:05');
  assert.equal(linhas[1].skill, 'now-sdk-install');
  assert.equal(linhas[1].outputs, 'abc123');
});

test('órfãos: só registros de dados com deleted: true no keys.ts', () => {
  const keys = `
    seed_a_001: {
        table: 'x_1_app_a'
        id: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
        deleted: true
    }
    seed_a_002: {
        table: 'x_1_app_a'
        id: 'bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb'
    }
    usuario_demo_x: {
        table: 'sys_user'
        id: 'cccccccccccccccccccccccccccccccc'
        deleted: true
    }
    teste: {
        table: 'sys_atf_test'
        id: 'dddddddddddddddddddddddddddddddd'
        deleted: true
    }`;
  assert.deepEqual(orfaosDeDados(keys, 'x_1_app'), [
    { tabela: 'x_1_app_a', sysId: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
    { tabela: 'sys_user', sysId: 'cccccccccccccccccccccccccccccccc' },
  ]);
});

test('--zerar sem --confirmo é recusado antes de qualquer acesso à instância', async () => {
  await assert.rejects(executar({ zerar: true }), /--zerar --confirmo/);
});
