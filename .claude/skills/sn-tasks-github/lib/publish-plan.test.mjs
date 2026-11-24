import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  checarSchema,
  corpoStory,
  labelsDaStory,
  lerFioCondutor,
  lerIdMap,
  marcador,
  montarItens,
  resolverPrints,
} from './publish-plan.mjs';

function docBase() {
  return {
    metadata: { schemaVersion: 'tasks/v5.4' },
    epics: [{ id: 'EPIC-001', name: 'Cobrança', narrative: { elevatorPitch: 'Pitch do épico' } }],
    features: [{ id: 'FEAT-001', name: 'Qualificação', epicId: 'EPIC-001' }],
    stories: [
      {
        id: 'STORY-002',
        name: 'Sem feature',
        epicId: 'EPIC-001',
        executionOrder: 2,
        tasks: [{ id: 'TASK-002-001', type: 'backend', title: 'Regra', snArtifact: { kind: 'acl', table: 'x_cob_caso', fluentFile: 'app/src/fluent/acl.now.ts', nowId: 'acl_caso' } }],
      },
      {
        id: 'STORY-001',
        name: 'Publicar versão do critério',
        featureId: 'FEAT-001',
        epicId: 'EPIC-001',
        executionOrder: 1,
        userStory: { asA: 'gestor', iWant: 'publicar a versão', soThat: 'o score use o critério novo' },
        traceability: { requirementIds: ['RF-MOD-F2-003'] },
        uiContext: { tela: 'TEL-001', telaNome: 'Critério', screenshot: 'outputs/spec/screens/TEL-001.png' },
        tasks: [
          {
            id: 'TASK-001-001',
            type: 'backend',
            title: 'Business rule de publicação',
            snArtifact: { kind: 'business_rule', table: 'x_cob_criterio', fluentFile: 'app/src/fluent/br.now.ts', nowId: 'RF-MOD-F2-003_br' },
            acceptanceScenarios: [{ id: 'AS-1', title: 'Publica', given: 'versão em rascunho', when: 'o gestor publica', then: ['a versão fica ativa'] }],
          },
          { id: 'TASK-001-002', type: 'frontend', title: 'Form', snArtifact: { kind: 'form', table: 'x_cob_criterio', fluentFile: 'app/src/fluent/form.now.ts', nowId: 'form' } },
        ],
      },
    ],
  };
}

test('schema: aceita v5.3 e v5.4, recusa o resto', () => {
  assert.equal(checarSchema({ metadata: { schemaVersion: 'tasks/v5.3' } }), 'tasks/v5.3');
  assert.equal(checarSchema({ metadata: { schemaVersion: 'tasks/v5.4' } }), 'tasks/v5.4');
  assert.throws(() => checarSchema({ metadata: { schemaVersion: 'tasks/v5.2' } }), /não aceito/);
});

test('fio condutor: lê IDs RF do arquivo; arquivo ausente não aplica label', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sntg-'));
  const f = join(dir, 'fio.md');
  writeFileSync(f, '# Fio\n- RF-MOD-F2-003 publicar versão\n- RF-MOD-T-001 ACL\n');
  const fio = lerFioCondutor(f);
  assert.deepEqual([...fio].sort(), ['RF-MOD-F2-003', 'RF-MOD-T-001']);
  assert.equal(lerFioCondutor(join(dir, 'nao-existe.md')).size, 0);
  const story = docBase().stories[1];
  assert.deepEqual(labelsDaStory(story, fio), ['story', 'sn:business_rule', 'sn:form', 'fio-condutor']);
  assert.deepEqual(labelsDaStory(story, new Set()), ['story', 'sn:business_rule', 'sn:form']);
});

test('corpo da story: marcador primeiro, imagem, checklist com snArtifact e cenários', () => {
  const story = docBase().stories[1];
  const c = corpoStory(story, 'https://github.com/o/r/blob/abc/outputs/spec/screens/TEL-001.png?raw=1');
  assert.ok(c.startsWith(marcador('STORY-001')));
  assert.match(c, /!\[TEL-001 · Critério\]\(https:\/\/github\.com\/o\/r\/blob\/abc\/outputs\/spec\/screens\/TEL-001\.png\?raw=1\)/);
  assert.match(c, /- \[ \] \*\*TASK-001-001\*\* \(backend\) Business rule de publicação/);
  assert.match(c, /snArtifact: kind `business_rule` · table `x_cob_criterio` · fluentFile `app\/src\/fluent\/br\.now\.ts` · nowId `RF-MOD-F2-003_br`/);
  assert.match(c, /`AS-1` Publica: Dado versão em rascunho, quando o gestor publica, então a versão fica ativa/);
  assert.match(c, /> Como gestor, quero publicar a versão, para o score use o critério novo\./);
});

test('itens: ordem epic → feature → stories por executionOrder; pai da story é a feature ou o epic', () => {
  const itens = montarItens(docBase(), { fio: new Set(), permalinks: new Map() });
  assert.deepEqual(itens.map((i) => [i.id, i.pai]), [
    ['EPIC-001', null],
    ['FEAT-001', 'EPIC-001'],
    ['STORY-001', 'FEAT-001'],
    ['STORY-002', 'EPIC-001'],
  ]);
  assert.deepEqual(itens[0].labels, ['epic']);
  assert.deepEqual(itens[1].labels, ['feature']);
  assert.equal(itens[2].titulo, 'STORY-001: Publicar versão do critério');
});

test('prints: falha se não existe, não commitado ou modificado; permalink quando ok', () => {
  const raiz = mkdtempSync(join(tmpdir(), 'sntg-repo-'));
  mkdirSync(join(raiz, 'outputs', 'spec', 'screens'), { recursive: true });
  const doc = docBase();
  doc.stories.push({ id: 'STORY-003', uiContext: { tela: 'TEL-003', screenshot: 'outputs/spec/screens/TEL-003.png' }, tasks: [] });
  doc.stories.push({ id: 'STORY-004', uiContext: { tela: 'TEL-004', screenshot: 'outputs/spec/screens/TEL-004.png' }, tasks: [] });
  doc.stories.push({ id: 'STORY-005', uiContext: { tela: 'TEL-005', screenshot: 'outputs/spec/screens/TEL-005.png' }, tasks: [] });
  for (const t of ['TEL-001', 'TEL-003', 'TEL-004']) writeFileSync(join(raiz, 'outputs', 'spec', 'screens', `${t}.png`), 'png');
  const git = (args) => {
    const alvo = args[args.length - 1];
    if (args[0] === 'ls-files') return { status: alvo.includes('TEL-003') ? 1 : 0, stdout: '' };
    if (args[0] === 'status') return { status: 0, stdout: alvo.includes('TEL-004') ? ` M ${alvo}\n` : '' };
    return { status: 1, stdout: '' };
  };
  const { permalinks, falhas } = resolverPrints(doc, { git, raiz, baseTasks: join(raiz, 'outputs', 'spec'), repo: 'o/r', sha: 'abc123' });
  assert.equal(permalinks.get('STORY-001'), 'https://github.com/o/r/blob/abc123/outputs/spec/screens/TEL-001.png?raw=1');
  assert.deepEqual(falhas.map((f) => [f.tela, f.motivo]), [
    ['TEL-003', 'não está commitado'],
    ['TEL-004', 'tem modificação não commitada'],
    ['TEL-005', 'arquivo não existe'],
  ]);
});

test('id-map: aceita {number,id} e número solto; ausente só falha se obrigatório', () => {
  const dir = mkdtempSync(join(tmpdir(), 'sntg-'));
  const f = join(dir, 'id-map.json');
  writeFileSync(f, JSON.stringify({ 'EPIC-001': { number: 2, id: 900 }, 'FEAT-001': 3, '': 4, X: 'abc' }));
  const m = lerIdMap(f);
  assert.deepEqual(m.get('EPIC-001'), { number: 2, id: 900 });
  assert.deepEqual(m.get('FEAT-001'), { number: 3, id: null });
  assert.equal(m.size, 2);
  assert.equal(lerIdMap(join(dir, 'nada.json')).size, 0);
  assert.throws(() => lerIdMap(join(dir, 'nada.json'), { obrigatorio: true }), /não encontrado/);
});
