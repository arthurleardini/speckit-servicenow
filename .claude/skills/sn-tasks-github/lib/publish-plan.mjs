/**
 * Plano de publicação do sn-tasks-github: o que vira issue, com que título, corpo e labels, e quem
 * é pai de quem. Tudo aqui é calculado a partir do tasks.json, sem rede. O acesso ao git (para o
 * permalink do print) entra por função injetada, para o teste não depender do repositório.
 *
 * Mapeamento (design v0, A4 e item 28):
 *   epic    → issue com label `epic`
 *   feature → issue com label `feature`, sub-issue do epic quando o epic está no arquivo ou no id-map
 *   story   → issue com label `story`, sub-issue da feature (ou do epic, se não houver feature)
 *   task    → item de checklist no corpo da story (tipo, snArtifact, cenários de aceite)
 */

import { existsSync, readFileSync } from 'node:fs';
import { isAbsolute, relative, resolve, sep } from 'node:path';

export const SCHEMAS_ACEITOS = ['tasks/v5.3', 'tasks/v5.4'];
export const LABEL_FIO = 'fio-condutor';
export const CORES_LABEL = {
  epic: '3E4B9E',
  feature: '1D76DB',
  story: '0E8A16',
  [LABEL_FIO]: 'D93F0B',
  sn: 'C5DEF5',
};
const TITULO_MAX = 256;
const CORPO_MAX = 65000; // limite do GitHub é 65536 caracteres
const RE_RF = /\bRF-[A-Z0-9]+(?:-[A-Z0-9]+)+\b/g;

/** @param {unknown} v */
const obj = (v) => (v !== null && typeof v === 'object' && !Array.isArray(v) ? /** @type {Record<string, any>} */ (v) : {});
/** @param {unknown} v */
const lista = (v) => (Array.isArray(v) ? v.filter((x) => x !== null && typeof x === 'object' && !Array.isArray(x)) : []);
/** @param {unknown} v */
const texto = (v) => (typeof v === 'string' && v.trim() ? v.trim() : '');

/** @param {Record<string, any>} doc */
export function checarSchema(doc) {
  const v = texto(obj(doc.metadata).schemaVersion);
  if (!SCHEMAS_ACEITOS.includes(v)) {
    throw new Error(`metadata.schemaVersion "${v}" não aceito. Aceitos: ${SCHEMAS_ACEITOS.join(', ')}.`);
  }
  return v;
}

/** @param {string} id */
export const marcador = (id) => `<!-- logical-id: ${id} -->`;

/**
 * Lê o id-map.json: { "<ID lógico>": { "number": 12, "id": 3456789 } }. Valor numérico solto é
 * aceito como `number` (o `id` é buscado depois). Arquivo ausente → mapa vazio, salvo quando o
 * caminho foi passado explicitamente (`obrigatorio`).
 * @param {string} caminho
 * @param {{ obrigatorio?: boolean }} [opts]
 * @returns {Map<string, { number: number, id: number | null }>}
 */
export function lerIdMap(caminho, { obrigatorio = false } = {}) {
  const mapa = new Map();
  if (!existsSync(caminho)) {
    if (obrigatorio) throw new Error(`id-map não encontrado: ${caminho}`);
    return mapa;
  }
  const raw = JSON.parse(readFileSync(caminho, 'utf8'));
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
    throw new Error(`id-map inválido em ${caminho}: esperado objeto { "<ID>": { "number", "id" } }.`);
  }
  for (const [k, v] of Object.entries(raw)) {
    const chave = k.trim();
    if (!chave) continue;
    if (typeof v === 'number' && v > 0) mapa.set(chave, { number: v, id: null });
    else if (v && typeof v === 'object' && Number(v.number) > 0) {
      mapa.set(chave, { number: Number(v.number), id: Number(v.id) > 0 ? Number(v.id) : null });
    }
  }
  return mapa;
}

/**
 * IDs de RF listados em inputs/fio-condutor.md. Arquivo ausente → conjunto vazio (label não aplica).
 * @param {string} caminho
 */
export function lerFioCondutor(caminho) {
  if (!caminho || !existsSync(caminho)) return new Set();
  return new Set(readFileSync(caminho, 'utf8').match(RE_RF) ?? []);
}

/** RFs que a story cobre: traceability, sourceRefs e traceability das tasks. */
export function rfsDaStory(story) {
  const out = new Set();
  const add = (v) => {
    for (const m of String(v ?? '').match(RE_RF) ?? []) out.add(m);
  };
  const tr = obj(story.traceability);
  for (const v of [...(Array.isArray(tr.requirementIds) ? tr.requirementIds : []), ...(Array.isArray(story.requirementIds) ? story.requirementIds : [])]) add(v);
  for (const r of lista(story.sourceRefs)) add(r.itemId);
  for (const t of lista(story.tasks)) {
    const ttr = obj(t.traceability);
    for (const v of Array.isArray(ttr.requirementIds) ? ttr.requirementIds : []) add(v);
  }
  return out;
}

/** Kinds de snArtifact das tasks da story, sem repetição, na ordem em que aparecem. */
export function kindsDaStory(story) {
  const out = [];
  for (const t of lista(story.tasks)) {
    const k = texto(obj(t.snArtifact).kind);
    if (k && !out.includes(k)) out.push(k);
  }
  return out;
}

export function labelsDaStory(story, fio) {
  const labels = ['story', ...kindsDaStory(story).map((k) => `sn:${k}`)];
  if ([...rfsDaStory(story)].some((rf) => fio.has(rf))) labels.push(LABEL_FIO);
  return labels;
}

/** Labels que esta ferramenta gerencia (podem ser retiradas no --change). */
export const labelGerenciada = (nome) => ['epic', 'feature', 'story', LABEL_FIO].includes(nome) || nome.startsWith('sn:');

export function corDoLabel(nome) {
  return nome.startsWith('sn:') ? CORES_LABEL.sn : CORES_LABEL[nome] ?? 'EDEDED';
}

const titulo = (item) => {
  const t = `${item.id}: ${texto(item.name) || item.id}`;
  return t.length > TITULO_MAX ? `${t.slice(0, TITULO_MAX - 3)}...` : t;
};

/** Ordem do kit: executionOrder; sem ele, a posição no array. */
function porOrdem(itens) {
  return itens
    .map((x, i) => ({ x, i, o: Number.isFinite(x.executionOrder) ? x.executionOrder : Infinity }))
    .sort((a, b) => a.o - b.o || a.i - b.i)
    .map(({ x }) => x);
}

// ---------------------------------------------------------------------------
// Corpo (markdown)
// ---------------------------------------------------------------------------

function blocoNarrativa(n) {
  const l = [];
  const nar = obj(n);
  if (texto(nar.elevatorPitch)) l.push(texto(nar.elevatorPitch), '');
  for (const [k, rot] of [['context', 'Contexto'], ['problem', 'Problema'], ['deliveredValue', 'Valor entregue'], ['operationalImpact', 'Impacto operacional']]) {
    if (texto(nar[k])) l.push(`**${rot}:** ${texto(nar[k])}`, '');
  }
  if (Array.isArray(nar.actors) && nar.actors.length) l.push(`**Atores:** ${nar.actors.join(', ')}`, '');
  if (Array.isArray(nar.mainFlow) && nar.mainFlow.length) {
    l.push('**Fluxo principal:**', ...nar.mainFlow.map((p, i) => `${i + 1}. ${p}`), '');
  }
  return l;
}

function blocoRegras(regras) {
  const rs = lista(regras);
  if (!rs.length) return [];
  return ['### Regras de negócio', ...rs.map((r) => `- **${r.id ?? ''}** ${texto(r.title)}${texto(r.description) ? `: ${texto(r.description)}` : ''}`), ''];
}

function linhaCenario(c) {
  const entao = Array.isArray(c.then) ? c.then.join('; ') : texto(c.then);
  const partes = [texto(c.given) && `Dado ${texto(c.given)}`, texto(c.when) && `quando ${texto(c.when)}`, entao && `então ${entao}`].filter(Boolean);
  return `    - ${c.id ? `\`${c.id}\` ` : ''}${texto(c.title)}${partes.length ? `: ${partes.join(', ')}` : ''}`;
}

/** Checklist das tasks: tipo, snArtifact e cenários de aceite. */
export function checklistTasks(story) {
  const l = [];
  for (const t of porOrdem(lista(story.tasks))) {
    const feita = /^(done|concluida|concluída|closed)$/i.test(texto(t.status));
    l.push(`- [${feita ? 'x' : ' '}] **${t.id}** (${texto(t.type) || 'sem tipo'}) ${texto(t.title)}`);
    const sn = obj(t.snArtifact);
    if (texto(sn.kind)) {
      const partes = [`kind \`${sn.kind}\``];
      if (texto(sn.table)) partes.push(`table \`${sn.table}\``);
      if (texto(sn.fluentFile)) partes.push(`fluentFile \`${sn.fluentFile}\``);
      if (texto(sn.nowId)) partes.push(`nowId \`${sn.nowId}\``);
      l.push(`  - snArtifact: ${partes.join(' · ')}`);
    }
    const cen = lista(t.acceptanceScenarios);
    if (cen.length) l.push('  - Cenários de aceite:', ...cen.map(linhaCenario));
  }
  return l;
}

function blocoHistoria(story) {
  const u = story.userStory;
  if (typeof u === 'string' && u.trim()) return [`> ${u.trim()}`, ''];
  const o = obj(u);
  if (texto(o.asA) || texto(o.iWant)) {
    return [`> Como ${texto(o.asA)}, quero ${texto(o.iWant)}${texto(o.soThat) ? `, para ${texto(o.soThat)}` : ''}.`, ''];
  }
  const st = texto(obj(story.narrative).userStoryStatement);
  return st ? [`> ${st}`, ''] : [];
}

function blocoTela(story, imagem) {
  const ui = obj(story.uiContext);
  if (!Object.keys(ui).length) return [];
  const l = ['### Tela'];
  const cab = [texto(ui.tela), texto(ui.telaNome)].filter(Boolean).join(' · ');
  if (cab) l.push(`**${cab}**${texto(ui.rota) ? ` · rota \`${ui.rota}\`` : ''}${texto(ui.instanceUrl) ? ` · [na instância](${ui.instanceUrl})` : ''}`, '');
  if (imagem) l.push(`![${cab || 'tela'}](${imagem})`, '');
  return l;
}

function truncar(corpo) {
  if (corpo.length <= CORPO_MAX) return corpo;
  return `${corpo.slice(0, CORPO_MAX - 200)}\n\n> Corpo cortado no limite do GitHub. O conteúdo completo está no tasks.json.\n`;
}

export function corpoEpicOuFeature(item, nivel) {
  const l = [marcador(item.id), '', `**Tipo:** ${nivel === 'epic' ? 'épico' : 'funcionalidade'}`, '', ...blocoNarrativa(item.narrative), ...blocoRegras(item.businessRules)];
  return truncar(l.join('\n').trimEnd() + '\n');
}

/** @param {string | null} imagem permalink do print, já validado */
export function corpoStory(story, imagem) {
  const l = [marcador(story.id), '', ...blocoHistoria(story), ...blocoNarrativa(story.narrative), ...blocoTela(story, imagem)];
  const ac = lista(story.acceptanceCriteria);
  if (ac.length) l.push('### Critérios de aceite', ...ac.map((a) => `- ${a.id ? `\`${a.id}\` ` : ''}${texto(a.statement) || texto(a.description)}`), '');
  l.push(...blocoRegras(story.businessRules));
  const rfs = [...rfsDaStory(story)];
  if (rfs.length) l.push(`**Requisitos:** ${rfs.join(', ')}`, '');
  const tasks = checklistTasks(story);
  if (tasks.length) l.push('### Tasks', ...tasks, '');
  return truncar(l.join('\n').trimEnd() + '\n');
}

// ---------------------------------------------------------------------------
// Print por permalink
// ---------------------------------------------------------------------------

/**
 * Confere os prints das stories e devolve o permalink de cada uma. O print tem que existir, estar
 * versionado e sem modificação pendente; senão entra na lista de falhas (o CLI para com erro).
 *
 * @param {Record<string, any>} doc
 * @param {{ git: (args: string[]) => { status: number | null, stdout: string }, raiz: string,
 *   baseTasks: string, repo: string, sha: string }} ctx
 */
export function resolverPrints(doc, { git, raiz, baseTasks, repo, sha }) {
  /** @type {Map<string, string>} */
  const permalinks = new Map();
  /** @type {{ story: string, tela: string, caminho: string, motivo: string }[]} */
  const falhas = [];
  for (const story of lista(doc.stories)) {
    const ui = obj(story.uiContext);
    const shot = texto(ui.screenshot);
    if (!shot) continue;
    const tela = texto(ui.tela) || '(sem TEL)';
    const candidatos = isAbsolute(shot) ? [shot] : [resolve(raiz, shot), resolve(baseTasks, shot)];
    const abs = candidatos.find((c) => existsSync(c));
    if (!abs) {
      falhas.push({ story: story.id, tela, caminho: shot, motivo: 'arquivo não existe' });
      continue;
    }
    const rel = relative(raiz, abs);
    if (rel.startsWith('..') || isAbsolute(rel)) {
      falhas.push({ story: story.id, tela, caminho: shot, motivo: 'fora do repositório' });
      continue;
    }
    const relPosix = rel.split(sep).join('/');
    if (git(['ls-files', '--error-unmatch', '--', relPosix]).status !== 0) {
      falhas.push({ story: story.id, tela, caminho: relPosix, motivo: 'não está commitado' });
      continue;
    }
    if (git(['status', '--porcelain', '--', relPosix]).stdout.trim()) {
      falhas.push({ story: story.id, tela, caminho: relPosix, motivo: 'tem modificação não commitada' });
      continue;
    }
    permalinks.set(story.id, `https://github.com/${repo}/blob/${sha}/${relPosix.split('/').map(encodeURIComponent).join('/')}?raw=1`);
  }
  return { permalinks, falhas };
}

// ---------------------------------------------------------------------------
// Itens a publicar
// ---------------------------------------------------------------------------

/**
 * Lista ordenada dos itens que viram issue: epics → features → stories.
 * @param {Record<string, any>} doc
 * @param {{ fio: Set<string>, permalinks: Map<string, string> }} ctx
 * @returns {{ nivel: 'epic'|'feature'|'story', id: string, titulo: string, corpo: string, labels: string[], pai: string | null }[]}
 */
export function montarItens(doc, { fio, permalinks }) {
  const itens = [];
  const epics = porOrdem(lista(doc.epics));
  const features = porOrdem(lista(doc.features));
  for (const e of epics) itens.push({ nivel: 'epic', id: e.id, titulo: titulo(e), corpo: corpoEpicOuFeature(e, 'epic'), labels: ['epic'], pai: null });
  for (const f of features) {
    itens.push({ nivel: 'feature', id: f.id, titulo: titulo(f), corpo: corpoEpicOuFeature(f, 'feature'), labels: ['feature'], pai: texto(f.epicId) || null });
  }
  for (const s of porOrdem(lista(doc.stories))) {
    itens.push({
      nivel: 'story',
      id: s.id,
      titulo: titulo(s),
      corpo: corpoStory(s, permalinks.get(s.id) ?? null),
      labels: labelsDaStory(s, fio),
      pai: texto(s.featureId) || texto(s.epicId) || null,
    });
  }
  return itens;
}

/** Texto do plano para quem vai confirmar a publicação. */
export function formatarPlano(plano) {
  const l = [`\nsn-tasks-github — plano (${plano.modo}) em ${plano.repo}`];
  const cont = (a) => plano.acoes.filter((x) => x.acao === a).length;
  l.push(`  criar: ${cont('criar')} · atualizar: ${cont('atualizar')} · já existe (sem --change): ${cont('existente')} · vincular: ${plano.vinculos.length}`);
  if (plano.labelsNovos.length) l.push(`  labels a criar: ${plano.labelsNovos.join(', ')}`);
  l.push('');
  for (const a of plano.acoes) {
    const num = a.number ? ` #${a.number}` : '';
    l.push(`  [${a.acao}]${num} ${a.nivel.padEnd(7)} ${a.titulo}  {${a.labels.join(', ')}}`);
  }
  if (plano.vinculos.length) {
    l.push('');
    for (const v of plano.vinculos) l.push(`  [vincular] ${v.filho} → sub-issue de ${v.pai}`);
  }
  for (const w of plano.avisos) l.push(`  [aviso] ${w}`);
  return `${l.join('\n')}\n`;
}
