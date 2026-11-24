import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ClienteGitHub, executar, planejar } from './github-upsert.mjs';
import { montarItens } from './publish-plan.mjs';

/** GitHub simulado: guarda issues, labels e sub-issues; registra cada chamada ao gh. */
function ghFalso({ labels = ['bug'], issues = [] } = {}) {
  const estado = { labels: new Set(labels), issues: new Map(), subs: new Map(), proximo: 10, chamadas: [] };
  for (const is of issues) estado.issues.set(is.number, { id: is.number * 1000, labels: [], title: '', ...is });
  const ok = (v) => ({ status: 0, stdout: typeof v === 'string' ? v : JSON.stringify(v), stderr: '' });
  const exec = (args, { input } = {}) => {
    estado.chamadas.push(args.join(' '));
    const [cmd, sub] = args;
    if (cmd === 'label' && sub === 'list') return ok([...estado.labels].map((name) => ({ name })));
    if (cmd === 'label' && sub === 'create') {
      estado.labels.add(args[2]);
      return ok('');
    }
    if (cmd === 'issue' && sub === 'list') return ok([...estado.issues.values()].map((i) => ({ number: i.number, body: i.body })));
    if (cmd === 'issue' && sub === 'edit') {
      const is = estado.issues.get(Number(args[2]));
      is.title = args[args.indexOf('--title') + 1];
      is.body = input;
      const add = args.includes('--add-label') ? args[args.indexOf('--add-label') + 1].split(',') : [];
      const rem = args.includes('--remove-label') ? args[args.indexOf('--remove-label') + 1].split(',') : [];
      is.labels = [...is.labels.filter((l) => !rem.includes(l)), ...add];
      return ok('');
    }
    if (cmd === 'api') {
      const metodo = args.includes('-X') ? args[args.indexOf('-X') + 1] : 'GET';
      const caminho = args.find((a) => a.startsWith('repos/'));
      const m = caminho.match(/issues(?:\/(\d+))?(\/sub_issues)?/);
      if (metodo === 'POST' && !m[1]) {
        const p = JSON.parse(input);
        const number = estado.proximo++;
        const is = { number, id: number * 1000, title: p.title, body: p.body, labels: p.labels };
        estado.issues.set(number, is);
        return ok({ number, id: is.id });
      }
      if (m[2] && metodo === 'POST') {
        const id = Number(args.find((a) => a.startsWith('sub_issue_id=')).split('=')[1]);
        const l = estado.subs.get(Number(m[1])) ?? [];
        l.push(id);
        estado.subs.set(Number(m[1]), l);
        return ok({});
      }
      if (m[2]) return ok((estado.subs.get(Number(m[1])) ?? []).map((id) => ({ id })));
      const is = estado.issues.get(Number(m[1]));
      return ok({ ...is, labels: is.labels.map((name) => ({ name })) });
    }
    return { status: 1, stdout: '', stderr: `comando não simulado: ${args.join(' ')}` };
  };
  return { estado, exec };
}

const ESCRITA = /^(label create|issue edit|api -X POST)/;

function doc() {
  return {
    metadata: { schemaVersion: 'tasks/v5.4' },
    epics: [{ id: 'EPIC-001', name: 'Épico' }],
    features: [{ id: 'FEAT-001', name: 'Feature', epicId: 'EPIC-001' }],
    stories: [
      { id: 'STORY-001', name: 'S1', featureId: 'FEAT-001', tasks: [{ id: 'T1', type: 'backend', title: 't', snArtifact: { kind: 'table' } }] },
      { id: 'STORY-002', name: 'S2', epicId: 'EPIC-001', tasks: [{ id: 'T2', type: 'frontend', title: 't' }] },
    ],
  };
}
const itensDe = (d) => montarItens(d, { fio: new Set(), permalinks: new Map() });

test('dry-run (planejar) não chama escrita e lista criar/vincular/labels', () => {
  const { estado, exec } = ghFalso();
  const cliente = new ClienteGitHub({ repo: 'o/r', exec });
  const plano = planejar(itensDe(doc()), cliente, { idMap: new Map(), change: false });
  assert.deepEqual(plano.acoes.map((a) => a.acao), ['criar', 'criar', 'criar', 'criar']);
  assert.deepEqual(plano.vinculos, [
    { filho: 'FEAT-001', pai: 'EPIC-001' },
    { filho: 'STORY-001', pai: 'FEAT-001' },
    { filho: 'STORY-002', pai: 'EPIC-001' },
  ]);
  assert.deepEqual(plano.labelsNovos.sort(), ['epic', 'feature', 'sn:table', 'story']);
  assert.equal(estado.chamadas.filter((c) => ESCRITA.test(c)).length, 0);
});

test('publicação real cria issues, labels e sub-issues com id numérico; segunda rodada --change não duplica', () => {
  const { estado, exec } = ghFalso();
  const cliente = new ClienteGitHub({ repo: 'o/r', exec });
  const idMap = new Map();
  let salvo = 0;
  const r1 = executar(planejar(itensDe(doc()), cliente, { idMap, change: false }), cliente, { idMap, salvar: () => salvo++ });
  assert.equal(r1.erros.length, 0);
  assert.equal(r1.criados.length, 4);
  assert.equal(salvo, 4);
  assert.deepEqual(idMap.get('STORY-001'), { number: 12, id: 12000 });
  assert.ok(estado.chamadas.includes('api -X POST repos/o/r/issues/11/sub_issues -F sub_issue_id=12000'));
  assert.deepEqual(estado.subs.get(10), [11000, 13000]);
  assert.ok(estado.labels.has('sn:table'));

  // --change com tasks novas (task SEC na STORY-001) e story nova
  const d2 = doc();
  d2.stories[0].tasks.push({ id: 'SEC-01', type: 'security', title: 'Revisar ACL', snArtifact: { kind: 'acl' } });
  d2.stories.push({ id: 'STORY-SEC-01', name: 'SEC', featureId: 'FEAT-001', tasks: [] });
  estado.chamadas.length = 0;
  const p2 = planejar(itensDe(d2), cliente, { idMap, change: true });
  assert.deepEqual(p2.acoes.map((a) => a.acao), ['atualizar', 'atualizar', 'atualizar', 'atualizar', 'criar']);
  const r2 = executar(p2, cliente, { idMap, salvar: () => {} });
  assert.equal(r2.erros.length, 0);
  assert.deepEqual(r2.atualizados.map((x) => x.id), ['STORY-001']);
  assert.deepEqual(r2.semMudanca.map((x) => x.id), ['EPIC-001', 'FEAT-001', 'STORY-002']);
  assert.deepEqual(r2.criados.map((x) => x.id), ['STORY-SEC-01']);
  assert.equal(r2.jaVinculados.length, 3);
  assert.match(estado.issues.get(12).body, /SEC-01/);
  assert.ok(estado.issues.get(12).labels.includes('sn:acl'));
  // cada logical-id em exatamente uma issue
  const ids = [...estado.issues.values()].map((i) => i.body.match(/logical-id: (\S+)/)[1]);
  assert.equal(new Set(ids).size, ids.length);
});

test('sem id-map: acha a issue pelo marcador no corpo e não duplica (modo normal não edita)', () => {
  const { estado, exec } = ghFalso({
    labels: ['epic', 'feature', 'story', 'sn:table'],
    issues: [
      { number: 5, body: '<!-- logical-id: EPIC-001 -->\n', labels: ['epic'] },
      { number: 6, body: '<!-- logical-id: EPIC-0010 -->\n', labels: ['epic'] },
    ],
  });
  const cliente = new ClienteGitHub({ repo: 'o/r', exec });
  const idMap = new Map();
  const plano = planejar(itensDe(doc()), cliente, { idMap, change: false });
  assert.deepEqual(plano.acoes.map((a) => [a.id, a.acao, a.number]), [
    ['EPIC-001', 'existente', 5],
    ['FEAT-001', 'criar', null],
    ['STORY-001', 'criar', null],
    ['STORY-002', 'criar', null],
  ]);
  const r = executar(plano, cliente, { idMap, salvar: () => {} });
  assert.equal(r.erros.length, 0);
  assert.deepEqual(idMap.get('EPIC-001'), { number: 5, id: 5000 });
  assert.equal(estado.chamadas.filter((c) => c.startsWith('issue edit')).length, 0);
  assert.deepEqual(estado.subs.get(5), [10000, 12000]);
});

test('--change tira label gerenciado que saiu e preserva label posto à mão', () => {
  const { estado, exec } = ghFalso({
    labels: ['epic', 'feature', 'story', 'sn:table', 'sn:acl', 'prioridade'],
    issues: [{ number: 7, id: 7000, title: 'velho', body: 'x', labels: ['story', 'sn:acl', 'prioridade'] }],
  });
  const cliente = new ClienteGitHub({ repo: 'o/r', exec });
  const idMap = new Map([['STORY-001', { number: 7, id: 7000 }]]);
  const d = doc();
  const itens = itensDe(d).filter((i) => i.id === 'STORY-001');
  const r = executar(planejar(itens, cliente, { idMap, change: true }), cliente, { idMap, salvar: () => {} });
  assert.deepEqual(r.atualizados.map((x) => x.number), [7]);
  assert.deepEqual(estado.issues.get(7).labels.sort(), ['prioridade', 'sn:table', 'story']);
});
