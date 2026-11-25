#!/usr/bin/env node
// Gerador da régua como Flow (design ux-cobranca-v2-regua-flow.md, D8, B2 e Anexo A; US-MOD-F4-010).
//
// Uso (na raiz do worktree):  node app/scripts/gerar-flows-regua.mjs [--reguas outputs/spec/reguas.json] [--app app]
//
// Lê outputs/spec/reguas.json e escreve:
//   app/src/fluent/flows/regua-<codigo>.now.ts  um Flow «Régua: <nome>» por régua (pula a régua com "flowManual": true)
//   app/src/fluent/seed-demo/regua.now.ts       seed das réguas e das etapas (sempre, inclusive flowManual)
// Antes de escrever, valida as réguas com as mesmas regras da business rule da etapa (D17): postura não
// regride nem salta nível, dia em ordem, só a última etapa encaminha (e ela encaminha), texto de e-mail,
// SMS e WhatsApp sem valor nem tributo, código único. Com erro, aborta e não escreve nada.
// Depois de gerar: `cd app && node scripts/gerar-seed-demo.mjs` (contagem) e o sn-scaffold (junta a contagem).
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, rmSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const AQUI = dirname(fileURLToPath(import.meta.url));
const S = 'x_2326104_cob_';
export const MARCA = '// gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json) — não editar à mão';

export const POSTURAS = ['utilitaria', 'consciente', 'explicativa', 'ameacadora'];
export const CANAIS = { sne: 'SNE', email: 'e-mail', sms: 'SMS', whatsapp: 'WhatsApp' };
export const CARTEIRAS = ['parcelamentos', 'ipva', 'itcd', 'icms_normal', 'icms_st'];
export const ACOES = ['renotificar', 'intensificar', 'encaminhar_ativa', 'encaminhar_qualificada'];
const ENCAMINHA = new Set(['encaminhar_ativa', 'encaminhar_qualificada']);
const INFORMAIS = new Set(['email', 'sms', 'whatsapp']);
export const SIGILO = /R\$|\{valor\}|\{debito\}|\{tributo\}/i;

export const MSG = {
  POSTURA: (c, o) => `Régua ${c}, etapa ${o}: postura não pode regredir nem saltar nível.`,
  DIA: (c, o) => `Régua ${c}, etapa ${o}: dia fora de ordem.`,
  ENCAMINHAR: (c) => `Régua ${c}: só a última etapa encaminha, e ela precisa encaminhar.`,
  SIGILO: (c, o, canal) => `Régua ${c}, etapa ${o}: texto de ${CANAIS[canal] ?? canal} não pode trazer valor nem tributo.`,
  CODIGO: (c) => `Código de régua repetido: ${c}.`,
};

/** Valida as réguas. Devolve a lista de erros (vazia quando tudo vale). */
export function validar(dados) {
  const erros = [];
  const reguas = dados?.reguas;
  if (!Array.isArray(reguas) || !reguas.length) return ['reguas.json sem a lista "reguas"'];
  const vistos = new Set();
  for (const r of reguas) {
    const c = r.codigo;
    if (!c || !/^[a-z][a-z0-9_]{0,39}$/.test(c)) { erros.push(`Régua "${r.nome}": código inválido (minúsculas, números e _; até 40)`); continue; }
    if (vistos.has(c)) erros.push(MSG.CODIGO(c));
    vistos.add(c);
    if (!r.nome) erros.push(`Régua ${c}: sem nome`);
    if (!CARTEIRAS.includes(r.carteira)) erros.push(`Régua ${c}: carteira "${r.carteira}" inválida`);
    if (!Number.isInteger(r.prazo_final_dias) || r.prazo_final_dias < 0) erros.push(`Régua ${c}: prazo_final_dias inválido`);
    const etapas = [...(r.etapas ?? [])].sort((a, b) => a.ordem - b.ordem);
    if (!etapas.length) { erros.push(`Régua ${c}: sem etapas`); continue; }
    etapas.forEach((e, i) => {
      const o = e.ordem;
      if (o !== i + 1) erros.push(`Régua ${c}: ordens das etapas precisam ser 1..${etapas.length}`);
      if (!CANAIS[e.canal]) erros.push(`Régua ${c}, etapa ${o}: canal "${e.canal}" inválido`);
      if (!POSTURAS.includes(e.postura)) erros.push(`Régua ${c}, etapa ${o}: postura "${e.postura}" inválida`);
      if (!ACOES.includes(e.acao_sem_resposta)) erros.push(`Régua ${c}, etapa ${o}: ação sem resposta "${e.acao_sem_resposta}" inválida`);
      if (!Number.isInteger(e.dia) || e.dia < 0) erros.push(MSG.DIA(c, o));
      if (i > 0) {
        const ant = etapas[i - 1];
        const nivel = POSTURAS.indexOf(e.postura) - POSTURAS.indexOf(ant.postura);
        if (nivel < 0 || nivel > 1) erros.push(MSG.POSTURA(c, o));
        if (!(e.dia > ant.dia)) erros.push(MSG.DIA(c, o));
      }
      if (INFORMAIS.has(e.canal) && SIGILO.test(e.template ?? '')) erros.push(MSG.SIGILO(c, o, e.canal));
    });
    const encaminham = etapas.map((e) => ENCAMINHA.has(e.acao_sem_resposta));
    if (!encaminham[encaminham.length - 1] || encaminham.slice(0, -1).some(Boolean)) erros.push(MSG.ENCAMINHAR(c));
  }
  return [...new Set(erros)];
}

export const arquivoFlow = (codigo) => `regua-${codigo.replace(/_/g, '-')}.now.ts`;
export const chaveRegua = (codigo) => (codigo === 'ipva' ? 'TEL-014_registro_demo' : `seed_regua_${codigo}`);
const js = (v) => JSON.stringify(v);
const id = (k) => `Now.ID['${k}']`;
const PILL = "wfa.dataPill(params.trigger.current, 'reference')";

/** Código-fonte do Flow de uma régua (Anexo A). */
export function gerarFlow(r) {
  const c = r.codigo;
  const etapas = [...r.etapas].sort((a, b) => a.ordem - b.ordem);
  const n = etapas.length;
  const stages = etapas.map((e) => `            e${e.ordem}: FlowStage({ label: 'Etapa ${e.ordem}', value: 'e${e.ordem}' }),`);
  const bloco = (tag, ordem, stage, final) => {
    const ag = `ag${tag}`;
    const g = `g${tag}`;
    return [
      `                wfa.stage(params.stages.${stage})`,
      `                const ${ag} = wfa.action(agendarEtapa, { $id: ${id(`${c}_${tag}_agendar`)} },`,
      `                    { inscricao: ${PILL}, ordem: ${ordem} })`,
      `                wfa.flowLogic.if({ $id: ${id(`${c}_${tag}_ag_parar`)}, condition: \`\${wfa.dataPill(${ag}.segue, 'boolean')}=false\` },`,
      `                    () => { wfa.flowLogic.endFlow({ $id: ${id(`${c}_${tag}_ag_fim`)} }) })`,
      `                wfa.flowLogic.waitForADuration({ $id: ${id(`${c}_${tag}_esperar`)}, durationType: 'relative_duration',`,
      `                    duration: Duration({ seconds: 1 }), relativeOperator: 'after',`,
      `                    relativeDatetime: wfa.dataPill(${ag}.executar_em, 'glide_date_time') })`,
      `                const ${g} = wfa.action(checarGuardas, { $id: ${id(`${c}_${tag}_guardas`)} },`,
      `                    { inscricao: ${PILL} })`,
      `                wfa.flowLogic.if({ $id: ${id(`${c}_${tag}_parar`)}, condition: \`\${wfa.dataPill(${g}.segue, 'boolean')}=false\` },`,
      `                    () => { wfa.flowLogic.endFlow({ $id: ${id(`${c}_${tag}_fim`)} }) })`,
      final
        ? `                wfa.action(escalonar, { $id: ${id(`${c}_fim_escalonar`)} },\n                    { inscricao: ${PILL} })`
        : `                wfa.action(enviarComunicacao, { $id: ${id(`${c}_${tag}_enviar`)} },\n                    { inscricao: ${PILL}, ordem: ${ordem} })`,
    ].join('\n');
  };
  const corpo = etapas.map((e) => `                // ---- etapa ${e.ordem} (stage «Etapa ${e.ordem}») ----\n${bloco(`e${e.ordem}`, e.ordem, `e${e.ordem}`, false)}`);
  corpo.push(`                // ---- fecho (stage «Encaminhamento»): ordem ${n + 1} = depois da última etapa e do prazo final ----\n${bloco('fim', n + 1, 'fim', true)}`);
  return `${MARCA}
// Régua ${r.nome} (${c}): ${n} etapas e o fecho. Design ux-cobranca-v2-regua-flow.md, B2 e Anexo A (US-MOD-F4-010).
import '@servicenow/sdk/global'
import { Flow, FlowStage, wfa, trigger, action } from '@servicenow/sdk/automation'
import { agendarEtapa, checarGuardas, enviarComunicacao, escalonar } from '../actions/regua.now'

export const flow_regua_${c} = Flow(
    {
        $id: ${id(`flow_regua_${c}`)},
        name: ${js(`Régua: ${r.nome}`)},
        internalName: ${js(`regua_${c}`)},
        runAs: 'system',
        description: ${js(`Gerado por app/scripts/gerar-flows-regua.mjs (outputs/spec/reguas.json, ${c}). Uma inscrição ativa na régua ${r.nome} percorre as etapas e o encaminhamento.`)},
        stages: {
${stages.join('\n')}
            fim: FlowStage({ label: 'Encaminhamento', value: 'fim' }),
        },
    },
    wfa.trigger(trigger.record.created, { $id: ${id(`flow_regua_${c}_gatilho`)} },
        { table: '${S}regua_inscricao', condition: 'regua.codigo=${c}^status=ativa', run_flow_in: 'background' }),
    (params) => {
        wfa.flowLogic.tryCatch({ $id: ${id(`${c}_try`)} }, {
            try: () => {
${corpo.join('\n\n')}
            },
            catch: () => {
                wfa.action(action.core.updateRecord, { $id: ${id(`${c}_erro`)} }, {
                    table_name: '${S}regua_inscricao',
                    record: ${PILL},
                    values: TemplateValue({ status: 'erro', detalhe: 'Erro na execução do Flow; ver detalhes da execução' }),
                })
            },
        })
    })
`;
}

function record(chave, tabela, dados) {
  const linhas = Object.entries(dados).filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `        ${k}: ${typeof v === 'object' && v.raw ? v.raw : js(v)},`);
  return ['Record({', `    $id: Now.ID[${js(chave)}],`, "    $meta: { installMethod: 'demo' },", `    table: ${js(tabela)},`,
    '    data: {', ...linhas, '    },', '})', ''].join('\n');
}
const raw = (s) => ({ raw: s });
const ref = (t, k) => raw(`Now.ref(${js(t)}, ${js(k)})`);

const JOURNAL_IPVA = [
  'Régua revisada com a coordenação: SNE no dia 0, e-mail no dia 10, SMS no dia 20 e SNE no dia 30.',
  'Textos de e-mail e SMS só dão ciência do DT-e, sem valor nem tributo.',
];

/** Seed das réguas e das etapas (o registro demo da TEL-014 é a régua IPVA; nowId da task: seed_regua_ipva). */
export function gerarSeed(dados) {
  const regs = [];
  for (const r of dados.reguas) {
    const chave = chaveRegua(r.codigo);
    regs.push(`// régua ${r.codigo}${r.codigo === 'ipva' ? ' (seed_regua_ipva: registro demo da TEL-014)' : ''}`);
    regs.push(record(chave, `${S}regua`, {
      nome: r.nome, codigo: r.codigo, carteira: r.carteira, ativa: r.ativa !== false,
      prazo_final_dias: r.prazo_final_dias, janela_atribuicao_dias: r.janela_atribuicao_dias ?? 30,
      flow: ref('sys_hub_flow', `flow_regua_${r.codigo}`),
    }));
    for (const e of [...r.etapas].sort((a, b) => a.ordem - b.ordem)) {
      regs.push(record(`seed_regua_etapa_${r.codigo}_${e.ordem}`, `${S}regua_etapa`, {
        regua: ref(`${S}regua`, chave), ordem: e.ordem, offset_dias: e.dia, canal: e.canal, postura: e.postura,
        acao_sem_resposta: e.acao_sem_resposta, template: e.template,
      }));
    }
    if (r.codigo === 'ipva') {
      JOURNAL_IPVA.forEach((v, i) => regs.push(record(`TEL-014_journal_${i + 1}`, 'sys_journal_field', {
        name: `${S}regua`, element: 'comentarios', element_id: ref(`${S}regua`, chave), value: v,
      })));
    }
  }
  return [MARCA, '// Seed das réguas de cobrança e das etapas (design ux-v2, B1). Fonte: outputs/spec/reguas.json.',
    "import '@servicenow/sdk/global'", "import { Record } from '@servicenow/sdk/core'", '', ...regs].join('\n');
}

/** Valida e escreve. Devolve { flows: [arquivos], seed: arquivo }. Lança Error com os erros (nada escrito). */
export function gerar(dados, appDir) {
  const erros = validar(dados);
  if (erros.length) throw new Error(`gerar-flows-regua: réguas inválidas, nada foi escrito:\n- ${erros.join('\n- ')}`);
  const dirFlows = join(appDir, 'src', 'fluent', 'flows');
  const dirSeed = join(appDir, 'src', 'fluent', 'seed-demo');
  mkdirSync(dirFlows, { recursive: true });
  mkdirSync(dirSeed, { recursive: true });
  const esperados = new Set(dados.reguas.map((r) => arquivoFlow(r.codigo)));
  // Flow de régua que saiu do JSON (e foi gerado por aqui) sai da fonte: vira DELETE no install (B6).
  for (const f of readdirSync(dirFlows)) {
    if (/^regua-.*\.now\.ts$/.test(f) && !esperados.has(f) && readFileSync(join(dirFlows, f), 'utf8').startsWith(MARCA)) rmSync(join(dirFlows, f));
  }
  const flows = [];
  for (const r of dados.reguas) {
    if (r.flowManual) continue;
    const arq = join(dirFlows, arquivoFlow(r.codigo));
    writeFileSync(arq, gerarFlow(r));
    flows.push(arq);
  }
  const seed = join(dirSeed, 'regua.now.ts');
  writeFileSync(seed, gerarSeed(dados));
  return { flows, seed };
}

function main() {
  const args = process.argv.slice(2);
  const val = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const raiz = resolve(AQUI, '..', '..');
  const arq = resolve(process.cwd(), val('--reguas', join(raiz, 'outputs', 'spec', 'reguas.json')));
  const appDir = resolve(process.cwd(), val('--app', join(raiz, 'app')));
  if (!existsSync(arq)) { console.error(`gerar-flows-regua: ${arq} não existe`); process.exit(2); }
  try {
    const r = gerar(JSON.parse(readFileSync(arq, 'utf8')), appDir);
    console.log(JSON.stringify({ flows: r.flows.length, seed: r.seed }));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
