/**
 * Conversa com o GitHub pelo `gh` (child_process) e aplica o plano: cria labels, cria ou atualiza
 * issues e vincula sub-issues. O executor do `gh` é injetado, para o teste simular o GitHub.
 *
 * Correlação logical-id → issue: id-map.json primeiro; para o que não está nele, uma única busca
 * `gh issue list --search "logical-id in:body"`, conferindo o marcador `<!-- logical-id: X -->` no
 * corpo (a busca do GitHub é aproximada; o marcador é o critério). A busca depende do índice do
 * GitHub, que leva alguns segundos para ver issue recém-criada; por isso o id-map é gravado a cada
 * issue criada e é a fonte principal.
 */

import { spawnSync } from 'node:child_process';
import { corDoLabel, labelGerenciada, marcador } from './publish-plan.mjs';

const RE_MARCADOR = /<!-- logical-id: (\S+) -->/g;

/**
 * @typedef {(args: string[], opts?: { input?: string }) => { status: number, stdout: string, stderr: string }} ExecGh
 */

/** Executor real: roda o binário do `gh` (GH_BIN, padrão `gh`). @returns {ExecGh} */
export function executorGh({ bin = process.env.GH_BIN || 'gh', env = process.env } = {}) {
  return (args, { input } = {}) => {
    const r = spawnSync(bin, args, { input, encoding: 'utf8', env, maxBuffer: 64 * 1024 * 1024 });
    return { status: r.status ?? 1, stdout: r.stdout ?? '', stderr: `${r.stderr ?? ''}${r.error ? r.error.message : ''}` };
  };
}

export class ClienteGitHub {
  /** @param {{ repo: string, exec: ExecGh }} p */
  constructor({ repo, exec }) {
    this.repo = repo;
    this.exec = exec;
  }

  run(args, opts) {
    const r = this.exec(args, opts);
    if (r.status !== 0) {
      const e = new Error(`gh ${args.slice(0, 3).join(' ')} falhou (exit ${r.status}): ${r.stderr.trim() || r.stdout.trim()}`);
      /** @type {any} */ (e).stderr = r.stderr;
      throw e;
    }
    return r.stdout;
  }

  json(args, opts) {
    const out = this.run(args, opts);
    return out.trim() ? JSON.parse(out) : null;
  }

  labelsExistentes() {
    const ls = this.json(['label', 'list', '-R', this.repo, '--json', 'name', '--limit', '1000']) ?? [];
    return new Set(ls.map((l) => l.name));
  }

  criarLabel(nome) {
    const desc = nome.startsWith('sn:') ? `Artefato ServiceNow: ${nome.slice(3)}` : `sn-tasks-github: ${nome}`;
    this.run(['label', 'create', nome, '-R', this.repo, '--force', '--color', corDoLabel(nome), '--description', desc]);
  }

  /** Todas as issues com marcador, numa busca só. @returns {Map<string, number[]>} */
  buscarMarcadores() {
    const issues =
      this.json(['issue', 'list', '-R', this.repo, '--state', 'all', '--search', 'logical-id in:body', '--json', 'number,body', '--limit', '1000']) ?? [];
    /** @type {Map<string, number[]>} */
    const mapa = new Map();
    for (const is of issues) {
      for (const m of String(is.body ?? '').matchAll(RE_MARCADOR)) {
        const l = mapa.get(m[1]) ?? [];
        if (!l.includes(is.number)) l.push(is.number);
        mapa.set(m[1], l.sort((a, b) => a - b));
      }
    }
    return mapa;
  }

  obterIssue(numero) {
    const is = this.json(['api', `repos/${this.repo}/issues/${numero}`]);
    return { number: is.number, id: is.id, title: is.title, body: is.body ?? '', state: is.state, labels: (is.labels ?? []).map((l) => (typeof l === 'string' ? l : l.name)) };
  }

  criarIssue({ titulo, corpo, labels }) {
    const is = this.json(['api', '-X', 'POST', `repos/${this.repo}/issues`, '--input', '-'], {
      input: JSON.stringify({ title: titulo, body: corpo, labels }),
    });
    return { number: is.number, id: is.id };
  }

  editarIssue(numero, { titulo, corpo, adicionar = [], remover = [] }) {
    const args = ['issue', 'edit', String(numero), '-R', this.repo, '--title', titulo, '--body-file', '-'];
    if (adicionar.length) args.push('--add-label', adicionar.join(','));
    if (remover.length) args.push('--remove-label', remover.join(','));
    this.run(args, { input: corpo });
  }

  subIssueIds(numero) {
    const ls = this.json(['api', `repos/${this.repo}/issues/${numero}/sub_issues?per_page=100`]) ?? [];
    return new Set(ls.map((s) => s.id));
  }

  vincular(numeroPai, idFilho) {
    const base = ['api', '-X', 'POST', `repos/${this.repo}/issues/${numeroPai}/sub_issues`, '-F', `sub_issue_id=${idFilho}`];
    try {
      this.run(base);
    } catch (e) {
      // Filho pendurado em outro pai (o tasks.json mudou): move para o pai certo.
      if (!/parent/i.test(String(/** @type {any} */ (e).stderr ?? e.message))) throw e;
      this.run([...base, '-F', 'replace_parent=true']);
    }
  }
}

/**
 * Resolve o que existe no GitHub e monta o plano. Só leitura: serve ao --dry-run.
 * @param {ReturnType<import('./publish-plan.mjs').montarItens>} itens
 * @param {ClienteGitHub} cliente
 * @param {{ idMap: Map<string, { number: number, id: number | null }>, change: boolean }} opts
 */
export function planejar(itens, cliente, { idMap, change }) {
  const avisos = [];
  const faltam = itens.some((i) => !idMap.has(i.id)) || itens.some((i) => i.pai && !idMap.has(i.pai) && !itens.find((x) => x.id === i.pai));
  const marcadores = faltam ? cliente.buscarMarcadores() : new Map();
  const existente = (id) => {
    if (idMap.has(id)) return idMap.get(id).number;
    const ns = marcadores.get(id);
    if (!ns) return null;
    if (ns.length > 1) avisos.push(`${id} aparece em mais de uma issue (${ns.map((n) => `#${n}`).join(', ')}); uso #${ns[0]}`);
    return ns[0];
  };

  const acoes = itens.map((it) => {
    const number = existente(it.id);
    return { ...it, number, acao: number ? (change ? 'atualizar' : 'existente') : 'criar' };
  });

  const vinculos = [];
  for (const it of itens) {
    if (!it.pai) continue;
    if (itens.some((x) => x.id === it.pai) || existente(it.pai)) vinculos.push({ filho: it.id, pai: it.pai });
    else avisos.push(`${it.id}: pai ${it.pai} não está no arquivo nem no GitHub; fica sem vínculo`);
  }

  const desejados = [...new Set(itens.flatMap((i) => i.labels))];
  const atuais = cliente.labelsExistentes();
  const labelsNovos = desejados.filter((l) => !atuais.has(l));
  return { repo: cliente.repo, modo: change ? 'change' : 'normal', acoes, vinculos, labelsNovos, avisos };
}

/**
 * Aplica o plano. Grava o id-map (via `salvar`) a cada issue criada, para uma falha no meio não
 * gerar duplicata na próxima rodada.
 * @param {ReturnType<typeof planejar>} plano
 * @param {ClienteGitHub} cliente
 * @param {{ idMap: Map<string, { number: number, id: number | null }>, salvar: () => void }} opts
 */
export function executar(plano, cliente, { idMap, salvar }) {
  const r = { criados: [], atualizados: [], semMudanca: [], existentes: [], vinculados: [], jaVinculados: [], labelsCriados: [], erros: [] };

  for (const l of plano.labelsNovos) {
    try {
      cliente.criarLabel(l);
      r.labelsCriados.push(l);
    } catch (e) {
      r.erros.push({ item: `label ${l}`, mensagem: e.message });
    }
  }

  for (const a of plano.acoes) {
    try {
      if (a.acao === 'criar') {
        const is = cliente.criarIssue({ titulo: a.titulo, corpo: a.corpo, labels: a.labels });
        idMap.set(a.id, { number: is.number, id: is.id });
        salvar();
        r.criados.push({ id: a.id, number: is.number });
        continue;
      }
      const atual = cliente.obterIssue(a.number);
      const antes = idMap.get(a.id);
      if (!antes || antes.id !== atual.id || antes.number !== atual.number) {
        idMap.set(a.id, { number: atual.number, id: atual.id });
        salvar();
      }
      if (a.acao === 'existente') {
        r.existentes.push({ id: a.id, number: a.number });
        continue;
      }
      const adicionar = a.labels.filter((l) => !atual.labels.includes(l));
      const remover = atual.labels.filter((l) => labelGerenciada(l) && !a.labels.includes(l));
      if (atual.title === a.titulo && atual.body.trimEnd() === a.corpo.trimEnd() && !adicionar.length && !remover.length) {
        r.semMudanca.push({ id: a.id, number: a.number });
        continue;
      }
      cliente.editarIssue(a.number, { titulo: a.titulo, corpo: a.corpo, adicionar, remover });
      r.atualizados.push({ id: a.id, number: a.number });
    } catch (e) {
      r.erros.push({ item: a.id, mensagem: e.message });
    }
  }

  const filhosPorPai = new Map();
  for (const v of plano.vinculos) {
    const pai = idMap.get(v.pai);
    const filho = idMap.get(v.filho);
    if (!pai || !filho?.id) {
      r.erros.push({ item: v.filho, mensagem: `vínculo com ${v.pai} não feito: issue do pai ou do filho não resolvida` });
      continue;
    }
    try {
      if (!filhosPorPai.has(pai.number)) filhosPorPai.set(pai.number, cliente.subIssueIds(pai.number));
      if (filhosPorPai.get(pai.number).has(filho.id)) {
        r.jaVinculados.push({ filho: v.filho, pai: v.pai });
        continue;
      }
      cliente.vincular(pai.number, filho.id);
      filhosPorPai.get(pai.number).add(filho.id);
      r.vinculados.push({ filho: v.filho, pai: v.pai });
    } catch (e) {
      r.erros.push({ item: v.filho, mensagem: e.message });
    }
  }
  return r;
}

export { marcador };
