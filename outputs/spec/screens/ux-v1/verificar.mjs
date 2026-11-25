// Verificação UX v1 (F2): home e menu por papel (impersonate de demo.atendente e demo.coordenador)
// e prints "depois" em outputs/spec/screens/ux-v1/.
// Uso: node /config/.claude/jobs/2c29c816/tmp/ux/verificar.mjs <raiz do worktree> [--explorar]
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const RAIZ = process.argv[2];
const lib = await import(join(RAIZ, '.claude/skills/sn-reinstall/scripts/lib/instancia.mjs'));
const { carregarCredencial, urlInstancia, buscar, login, abrirNavegador, sysIdDaChave } = lib;
carregarCredencial();
const BASE = urlInstancia();
const OUT = join(RAIZ, 'outputs/spec/screens/ux-v1');
mkdirSync(OUT, { recursive: true });

async function impersonar(page, id) {
  const ck = await page.evaluate(() => window.g_ck);
  const r = await page.request.post(`${BASE}/api/now/ui/impersonate/${id}`, {
    headers: { 'X-UserToken': ck, Accept: 'application/json', 'Content-Type': 'application/json' }, data: {},
  });
  if (r.status() >= 300) throw new Error(`impersonate HTTP ${r.status()}`);
}
async function paginaClassica(page) {
  await page.goto(`${BASE}/sys_user_list.do?sysparm_query=sys_id=-1`, { waitUntil: 'domcontentloaded' });
}

const [eu] = await buscar('sys_user', `user_name=${process.env.SN_SDK_USER}`, 'sys_id', 1);
const users = {};
for (const u of ['demo.atendente', 'demo.coordenador']) users[u] = (await buscar('sys_user', `user_name=${u}`, 'sys_id', 1))[0].sys_id;

// Módulos do menu do app: a contagem por papel sai do que o navegador mostra; a conta pelos roles
// do registro (sys_app_module) vai junto, para conferência.
const [app] = await buscar('sys_app_application', 'title=Cobrança MT', 'sys_id', 1);
const mods = await buscar('sys_app_module', `application=${app.sys_id}^active=true^ORDERBYorder`, 'title,link_type,roles,order', 200);
async function rolesDe(user) {
  const rs = await buscar('sys_user_has_role', `user=${users[user]}`, 'role.name', 50);
  return new Set(rs.map((r) => r['role.name']));
}

const rel = { verificadoEm: new Date().toISOString(), instancia: BASE.replace(/^https?:\/\//, ''), papeis: {} };
const nav = await abrirNavegador();
const ctx = await nav.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
const page = await login(ctx);
await paginaClassica(page);
try {
  for (const [user, papel] of [['demo.atendente', 'atendente'], ['demo.coordenador', 'coordenador']]) {
    await impersonar(page, users[user]);
    const roles = await rolesDe(user);
    const visiveisPorRole = mods.filter((m) => {
      const rs = (m.roles || '').split(',').filter(Boolean);
      return !rs.length || rs.some((r) => roles.has(r));
    });
    // Home: navpage.do leva à página inicial do usuário.
    await page.goto(`${BASE}/navpage.do`, { waitUntil: 'networkidle', timeout: 90000 });
    await page.waitForTimeout(5000);
    const urlHome = decodeURIComponent(page.url());
    // Fecha o tour "Work your way" do Next Experience, se aparecer.
    for (let i = 0; i < 3; i++) {
      const fechar = page.getByRole('button', { name: /Close dialog|Fechar/ }).first();
      if (await fechar.isVisible().catch(() => false)) { await fechar.click().catch(() => {}); await page.waitForTimeout(800); }
    }
    await page.screenshot({ path: join(OUT, `home-${papel}.png`) });
    // Menu: abre "All" (Next Experience) e filtra pelo app.
    let itensMenu = null;
    try {
      await page.getByText(/^(All|Todos)$/).first().click({ timeout: 15000 });
      await page.waitForTimeout(1500);
      const filtro = page.getByPlaceholder(/filter|filtrar/i).first();
      await filtro.fill('Cobrança MT');
      await page.waitForTimeout(3000);
      await page.screenshot({ path: join(OUT, `menu-${papel}.png`) });
      itensMenu = await page.evaluate(() => {
        const out = [];
        const visita = (root) => {
          for (const el of root.querySelectorAll('*')) {
            if (el.shadowRoot) visita(el.shadowRoot);
          }
          for (const a of root.querySelectorAll('a[href]')) {
            const h = a.getAttribute('href') || '';
            const t = (a.innerText || a.textContent || '').trim();
            if (t && /x_2326104_cob|sys_report_template|report_viewer|sysparm_report|\.do/.test(h)) out.push({ t, h });
          }
        };
        visita(document);
        return out;
      });
    } catch (e) {
      rel.papeis[papel] = { ...(rel.papeis[papel] || {}), erroMenu: e.message };
    }
    rel.papeis[papel] = {
      ...(rel.papeis[papel] || {}), user, urlHome,
      modulosPorRole: visiveisPorRole.filter((m) => m.link_type !== 'SEPARATOR').map((m) => m.title),
      separadoresPorRole: visiveisPorRole.filter((m) => m.link_type === 'SEPARATOR').map((m) => m.title),
      itensMenuNavegador: itensMenu,
    };
    await impersonar(page, eu.sys_id);
    await paginaClassica(page);
  }

  // Prints das telas, na visão do papel.
  const k = (c) => sysIdDaChave(c);
  const telas = [
    ['demo.atendente', 'minha-lista', `/x_2326104_cob_contato_list.do?sysparm_query=${encodeURIComponent(mods.find((m) => m.title === 'Minha lista' && m.link_type === 'FILTER') ? 'atendente=javascript:gs.getUserID()^status!=encerrado^proxima_acao_emISEMPTY^ORproxima_acao_em<=javascript:gs.endOfToday()^ORDERBYproxima_acao_em^ORDERBYDESCprioridade' : '')}`],
    ['demo.atendente', 'contato-trilha', `/x_2326104_cob_contato.do?sys_id=${k('TEL-035_registro_demo')}`],
    ['demo.coordenador', 'casos-qualificados', `/x_2326104_cob_caso_list.do?sysparm_query=${encodeURIComponent('estagio!=encerrado^ORDERBYestagio^ORDERBYDESCprioridade')}&sysparm_view=x_2326104_cob_tel_023`],
    ['demo.coordenador', 'ciclo-trilha', `/x_2326104_cob_ciclo.do?sys_id=${k('TEL-009_registro_demo')}`],
    ['demo.coordenador', 'caso-dossie-trilha', `/x_2326104_cob_caso.do?sys_id=${k('TEL-024_registro_demo')}`],
  ];
  let atual = null;
  rel.telas = [];
  for (const [user, nome, rota] of telas) {
    if (atual !== user) { await impersonar(page, users[user]); atual = user; }
    await page.goto(BASE + rota, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(1500);
    const corpo = await page.locator('body').innerText().catch(() => '');
    const linhas = await page.locator('table.list_table tbody tr.list_row').count().catch(() => null);
    await page.screenshot({ path: join(OUT, `${nome}.png`) });
    rel.telas.push({ nome, user, linhas, trilha: /A ligar|Prévia|Em seleção/.test(corpo), erro: /Security constraints|Record not found|Registro não encontrado/.test(corpo) });
  }
  await impersonar(page, eu.sys_id);
} finally {
  await nav.close();
}
writeFileSync(join(OUT, 'verificacao.json'), JSON.stringify(rel, null, 2) + '\n');
console.log(JSON.stringify(rel, null, 2));
