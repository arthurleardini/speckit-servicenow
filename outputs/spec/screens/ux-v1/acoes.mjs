// Prints "antes/depois" das ações da UX v1 (F3/F4) na instância, clicando os botões de verdade na visão do papel:
//   - contato antes/depois de «Registrar ligação» (demo.atendente);
//   - ciclo depois de «Distribuir lista» (demo.coordenador), num ciclo fictício criado e apagado pelo script;
//   - caso antes/depois de «Avançar etapa» (demo.coordenador).
// No fim desfaz o que a ação gravou (interação criada, contato, ciclo de teste e contatos, estágio do caso), para a
// contagem do seed continuar igual. Só dado fictício.
// Uso: node outputs/spec/screens/ux-v1/acoes.mjs <raiz do worktree>
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.argv[2];
const lib = await import(join(RAIZ, '.claude/skills/sn-reinstall/scripts/lib/instancia.mjs'));
const { carregarCredencial, urlInstancia, buscar, rest, login, abrirNavegador, sysIdDaChave } = lib;
carregarCredencial();
const BASE = urlInstancia();
const OUT = join(RAIZ, 'outputs/spec/screens/ux-v1');
mkdirSync(OUT, { recursive: true });
const rel = { verificadoEm: new Date().toISOString(), acoes: [] };

async function impersonar(page, id) {
  const ck = await page.evaluate(() => window.g_ck);
  const r = await page.request.post(`${BASE}/api/now/ui/impersonate/${id}`, {
    headers: { 'X-UserToken': ck, Accept: 'application/json', 'Content-Type': 'application/json' }, data: {},
  });
  if (r.status() >= 300) throw new Error(`impersonate HTTP ${r.status()}`);
}
const tab = (t) => `/api/now/table/${t}`;
async function patch(t, id, body) { return rest(`${tab(t)}/${id}`, { method: 'PATCH', body }); }
async function apagar(t, id) { return rest(`${tab(t)}/${id}`, { method: 'DELETE' }); }
async function criar(t, body) { const r = await rest(tab(t), { method: 'POST', body }); return r.json?.result?.sys_id; }
async function abrir(page, rota) {
  await page.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(1500);
}
async function clicar(page, rotulo) {
  await Promise.all([
    page.waitForLoadState('networkidle', { timeout: 60000 }).catch(() => {}),
    page.locator(`button:has-text("${rotulo}")`).first().click(),
  ]);
  await page.waitForTimeout(3000);
}
const mensagens = (page) => page.locator('.outputmsg_text').allInnerTexts().catch(() => []);

const [eu] = await buscar('sys_user', `user_name=${process.env.SN_SDK_USER}`, 'sys_id', 1);
const u = {};
for (const n of ['demo.atendente', 'demo.coordenador']) u[n] = (await buscar('sys_user', `user_name=${n}`, 'sys_id', 1))[0].sys_id;

const nav = await abrirNavegador();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const page = await login(ctx);
await page.goto(`${BASE}/sys_user_list.do?sysparm_query=sys_id=-1`, { waitUntil: 'domcontentloaded' });
const desfazer = [];
try {
  // 1) Registrar ligação — contato «A ligar» de demo.atendente.
  const contatoId = sysIdDaChave('seed_demo_contato_002');
  const [antesContato] = await buscar('x_2326104_cob_contato', `sys_id=${contatoId}`, 'status,tentativas,ultimo_resultado,proxima_acao_em,motivo_encerramento', 1);
  const interAntes = new Set((await buscar('x_2326104_cob_interacao', `contato=${contatoId}`, 'sys_id', 100)).map((x) => x.sys_id));
  desfazer.push(async () => {
    for (const i of await buscar('x_2326104_cob_interacao', `contato=${contatoId}`, 'sys_id', 100)) if (!interAntes.has(i.sys_id)) await apagar('x_2326104_cob_interacao', i.sys_id);
    await patch('x_2326104_cob_contato', contatoId, antesContato);
  });
  await impersonar(page, u['demo.atendente']);
  await abrir(page, `/x_2326104_cob_contato.do?sys_id=${contatoId}`);
  await page.screenshot({ path: join(OUT, 'contato-antes-registrar.png') });
  await page.evaluate(() => {
    window.g_form.setValue('ultimo_resultado', 'promessa_pagamento');
    window.g_form.setValue('comentarios', 'Prometeu pagar a 1ª parcela na sexta (fictício).');
  });
  await page.screenshot({ path: join(OUT, 'contato-preenchido-registrar.png') });
  await clicar(page, 'Registrar ligação');
  await page.screenshot({ path: join(OUT, 'contato-depois-registrar.png') });
  const [depoisContato] = await buscar('x_2326104_cob_contato', `sys_id=${contatoId}`, 'status,tentativas,proxima_acao_em', 1);
  rel.acoes.push({ acao: 'Registrar ligação', usuario: 'demo.atendente', antes: antesContato, depois: depoisContato, mensagens: await mensagens(page) });

  // 2) Distribuir lista — ciclo fictício publicado com 3 contribuintes da massificada que já têm atendente.
  await impersonar(page, eu.sys_id);
  const contribs = await buscar('x_2326104_cob_contribuinte', 'atendenteISNOTEMPTY^segmento=massificada^ORDERBYnome', 'sys_id', 3);
  const cicloId = await criar('x_2326104_cob_ciclo', { nome: 'Ciclo demonstração distribuição (fictício)', estado: 'publicado' });
  desfazer.push(async () => {
    for (const c of await buscar('x_2326104_cob_contato', `ciclo=${cicloId}`, 'sys_id', 100)) await apagar('x_2326104_cob_contato', c.sys_id);
    for (const s of await buscar('x_2326104_cob_segmentacao', `ciclo=${cicloId}`, 'sys_id', 100)) await apagar('x_2326104_cob_segmentacao', s.sys_id);
    await apagar('x_2326104_cob_ciclo', cicloId);
  });
  for (const c of contribs) await criar('x_2326104_cob_segmentacao', { ciclo: cicloId, contribuinte: c.sys_id, segmento: 'massificada' });
  await impersonar(page, u['demo.coordenador']);
  await abrir(page, `/x_2326104_cob_ciclo.do?sys_id=${cicloId}`);
  await page.screenshot({ path: join(OUT, 'ciclo-antes-distribuir.png') });
  await clicar(page, 'Distribuir lista');
  await page.screenshot({ path: join(OUT, 'ciclo-depois-distribuir.png') });
  const [depoisCiclo] = await buscar('x_2326104_cob_ciclo', `sys_id=${cicloId}`, 'distribuido_em,qtd_contatos', 1);
  rel.acoes.push({ acao: 'Distribuir lista', usuario: 'demo.coordenador', depois: depoisCiclo, mensagens: await mensagens(page) });

  // 3) Avançar etapa — caso «Em seleção» de demo.coordenador.
  const casoId = sysIdDaChave('seed_demo_caso_001');
  const [antesCaso] = await buscar('x_2326104_cob_caso', `sys_id=${casoId}`, 'estagio', 1);
  desfazer.push(async () => { await patch('x_2326104_cob_caso', casoId, { estagio: antesCaso.estagio }); });
  await abrir(page, `/x_2326104_cob_caso.do?sys_id=${casoId}`);
  await page.screenshot({ path: join(OUT, 'caso-antes-avancar.png') });
  await clicar(page, 'Avançar etapa');
  await page.screenshot({ path: join(OUT, 'caso-depois-avancar.png') });
  const [depoisCaso] = await buscar('x_2326104_cob_caso', `sys_id=${casoId}`, 'estagio,etapa_ordem', 1);
  rel.acoes.push({ acao: 'Avançar etapa', usuario: 'demo.coordenador', antes: antesCaso, depois: depoisCaso, mensagens: await mensagens(page) });

  // 4) Casos qualificados (lista ordenada pela sequência das etapas) depois do polimento.
  await abrir(page, `/x_2326104_cob_caso_list.do?sysparm_query=${encodeURIComponent('estagio!=encerrado^ORDERBYetapa_ordem^ORDERBYDESCprioridade')}&sysparm_view=x_2326104_cob_tel_023`);
  await page.screenshot({ path: join(OUT, 'casos-qualificados-por-etapa.png') });
  await impersonar(page, eu.sys_id);
} finally {
  for (const f of desfazer.reverse()) { try { await f(); } catch (e) { rel.erroDesfazer = String(e); } }
  await nav.close();
}
writeFileSync(join(OUT, 'acoes.json'), JSON.stringify(rel, null, 2) + '\n');
console.log(JSON.stringify(rel, null, 2));
