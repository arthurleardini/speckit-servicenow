// atf-receipts.mjs — lê os recibos de ATF do alvo ServiceNow (fork, item 31).
//
// O ATF roda na instância, não na máquina do relatório: quem roda é o `npm run atf -- --story <ID>`
// (`.claude/skills/sn-implement/scripts/atf.mjs`), que grava um recibo por alvo em
// `outputs/spec/auditorias/atf/<STORY|suite>.json`:
//   { alvo, tipo, sys_id, resultId, status: 'success'|'failure', horario, commit, runner,
//     testes: [{ chave, sys_id, ok, status, resultId, resumo, url, exit }] }
//
// Esta camada NÃO executa nada nem consulta a instância. Converte cada recibo em casos no formato
// normalizado do `parse-test-reports.mjs` (runner «ATF (recibo)», kind `integracao`) e os junta ao
// resultado do `runTests`. Recibo de commit diferente do último commit de `app/src/fluent` é
// marcado como desatualizado (AVISO `ATF_RECEIPT_STALE`): não prova o código atual.
// Sem a pasta de recibos, o resultado do `runTests` volta intacto.

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { readText } from "./util.mjs";
import { totalsOf } from "./parse-test-reports.mjs";
import { KINDS } from "./test-runners.mjs";

export const ATF_DIR = join("outputs", "spec", "auditorias", "atf");
const RUNNER = "ATF (recibo)";
const KIND = "integracao";

function ultimoCommitDoApp(root) {
  try {
    return execFileSync("git", ["log", "-1", "--format=%H", "--", "app/src/fluent"], { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim() || null;
  } catch {
    return null;
  }
}

/**
 * Lê os recibos. Devolve `null` sem a pasta; senão `{ suite, cases, receipts, warnings }`.
 * `commitAtual` pode ser injetado (testes); por padrão vem do git.
 */
export function readAtfReceipts(root, { commitAtual } = {}) {
  const dir = join(root, ATF_DIR);
  if (!existsSync(dir)) return null;
  const arquivos = readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  const head = commitAtual === undefined ? ultimoCommitDoApp(root) : commitAtual;
  const cases = [];
  const receipts = [];
  const warnings = [];
  for (const f of arquivos) {
    const raw = readText(join(dir, f));
    let r;
    try { r = JSON.parse(raw); } catch {
      warnings.push({ code: "ATF_RECEIPT_UNPARSED", message: `Recibo ATF ilegível: ${ATF_DIR}/${f}` });
      continue;
    }
    if (!r || typeof r !== "object" || Array.isArray(r)) {
      warnings.push({ code: "ATF_RECEIPT_UNPARSED", message: `Recibo ATF fora do formato: ${ATF_DIR}/${f}` });
      continue;
    }
    const alvo = String(r.alvo || f.replace(/\.json$/, ""));
    const stale = Boolean(head && r.commit && r.commit !== head);
    receipts.push({ alvo, tipo: r.tipo || null, status: r.status || null, horario: r.horario || null, commit: r.commit || null, stale, arquivo: `${ATF_DIR}/${f}` });
    if (stale) {
      warnings.push({ code: "ATF_RECEIPT_STALE", message: `Recibo ATF de ${alvo} é do commit ${String(r.commit).slice(0, 7)}; o último commit de app/src/fluent é ${head.slice(0, 7)} — rodar npm run atf -- --story ${alvo} de novo.` });
    }
    const file = r.tipo === "story" ? `app/src/fluent/tests/${alvo}.now.ts` : null;
    const testes = Array.isArray(r.testes) && r.testes.length ? r.testes : [{ chave: alvo, ok: r.status === "success", status: r.status }];
    for (const t of testes) {
      const ok = t.ok === true || (t.ok === undefined && /^success$/i.test(String(t.status || r.status)));
      cases.push({
        runner: RUNNER, kind: KIND, runnerKind: KIND,
        suite: `ATF · ${alvo}`,
        name: String(t.chave || t.sys_id || alvo),
        status: ok ? "passed" : "failed",
        durationMs: null,
        file,
        message: [ok ? "" : (t.resumo || t.mensagem || t.status || ""), stale ? "recibo de commit anterior" : "", r.horario ? `recibo de ${r.horario}` : ""].filter(Boolean).join(" · "),
        retries: 0,
        atf: { sys_id: t.sys_id || null, resultId: t.resultId || null, commit: r.commit || null, horario: r.horario || null, stale },
      });
    }
  }
  const suite = {
    id: "atf-receipts", label: RUNNER, kind: KIND, ecosystem: "servicenow",
    executed: cases.length > 0, reason: cases.length ? null : "nenhum recibo em " + ATF_DIR,
    source: ATF_DIR, ...totalsOf(cases),
  };
  return { suite, cases, receipts, warnings };
}

/** Junta os recibos ao resultado do `runTests`. Sem recibo, devolve `tests` como veio. */
export function mergeAtfReceipts(tests, root, opts = {}) {
  const atf = readAtfReceipts(root, opts);
  if (!atf || (!atf.cases.length && !atf.warnings.length)) return tests;
  const cases = [...(tests.cases || []), ...atf.cases];
  const byKind = { ...(tests.byKind || {}) };
  const subset = cases.filter((c) => c.kind === KIND);
  if (subset.length) byKind[KIND] = { ...totalsOf(subset), label: KINDS[KIND].label, help: KINDS[KIND].help };
  return {
    ...tests,
    suites: [...(tests.suites || []), atf.suite],
    cases,
    totals: totalsOf(cases),
    byKind,
    warnings: [...(tests.warnings || []), ...atf.warnings],
    atfReceipts: atf.receipts,
  };
}
