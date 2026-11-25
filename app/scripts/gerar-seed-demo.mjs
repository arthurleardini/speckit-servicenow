#!/usr/bin/env node
// Seed manual coerente da demo (design UX v1, decisão R7): ciclos, contatos da lista e casos
// qualificados, com números que batem entre as tabelas e datas relativas a hoje.
//
// Uso (na pasta app/):  node scripts/gerar-seed-demo.mjs [--hoje AAAA-MM-DD]
//
// Lê os contribuintes e critérios do seed gerado (src/fluent/seed/, sn-seed) e grava:
//   src/fluent/seed-demo/{ciclo,segmentacao,contato,caso}.now.ts
//   src/fluent/seed/_contagem.manual.json e _documentos.manual.json
// As datas (próxima ação de hoje a +7 dias) envelhecem: na véspera da demo, rodar de novo,
// commitar e rodar `npm run reinstall` (ver outputs/spec/demo/roteiro.md, Véspera).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const APP = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SEED = join(APP, 'src', 'fluent', 'seed');
const OUT = join(APP, 'src', 'fluent', 'seed-demo');
const S = 'x_2326104_cob_';

const arg = process.argv.indexOf('--hoje');
// «Hoje» é a data local (não a UTC): à noite no Brasil a data UTC já virou e a lista do dia, que a
// instância filtra pelo fuso do usuário, ficaria vazia.
const local = new Date();
const hoje = arg > 0 ? new Date(`${process.argv[arg + 1]}T12:00:00Z`)
  : new Date(Date.UTC(local.getFullYear(), local.getMonth(), local.getDate(), 12));
const dia = (n) => {
  const d = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), hoje.getUTCDate() + n));
  return d.toISOString().slice(0, 10);
};
const mes = (n) => {
  const d = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() + n, 1));
  return d.toISOString().slice(0, 10);
};

/** Registros de um arquivo de seed gerado: [{ id, campos: {nome: texto cru} }]. */
function lerSeed(arquivo) {
  const txt = readFileSync(join(SEED, arquivo), 'utf8');
  return txt.split('Record({').slice(1).map((b) => {
    const id = b.match(/Now\.ID\["([^"]+)"\]/)[1];
    const campos = {};
    for (const m of b.matchAll(/^\s{8}(\w+): (.+),$/gm)) campos[m[1]] = m[2];
    return { id, campos };
  });
}
const str = (v) => (v ?? '').replace(/^"|"$/g, '');
const usuario = (v) => v?.match(/usuario_demo_\w+/)?.[0] ?? null;

const contribuintes = lerSeed('contribuinte.now.ts').map((r) => ({
  id: r.id, segmento: str(r.campos.segmento), atendente: usuario(r.campos.atendente),
  valor: Number(r.campos.valor_em_aberto ?? 0),
}));
const criterios = lerSeed('criterio.now.ts').filter((r) => str(r.campos.estado) === 'publicada').map((r) => r.id);
if (criterios.length < 2) throw new Error('seed de critério sem 2 versões publicadas');

const ref = (tabela, chave) => `Now.ref(${JSON.stringify(tabela)}, ${JSON.stringify(chave)})`;
const refUser = (u) => ref('sys_user', u);
const COORD = 'usuario_demo_coordenador';

function record(chave, tabela, data) {
  const linhas = Object.entries(data).filter(([, v]) => v !== undefined && v !== null).map(([k, v]) => {
    const val = typeof v === 'object' && v.raw ? v.raw : JSON.stringify(v);
    return `        ${k}: ${val},`;
  });
  return [
    'Record({', `    $id: Now.ID[${JSON.stringify(chave)}],`, "    $meta: { installMethod: 'demo' },",
    `    table: ${JSON.stringify(tabela)},`, '    data: {', ...linhas, '    },', '})', '',
  ].join('\n');
}
const raw = (s) => ({ raw: s });

function arquivo(titulo, registros) {
  return [
    `// Seed manual da demo: ${titulo} (design UX v1, R7). Escrito por app/scripts/gerar-seed-demo.mjs`,
    `// com datas relativas a ${dia(0)}; na véspera da demo, rodar o script de novo (roteiro da demo).`,
    "import '@servicenow/sdk/global'", "import { Record } from '@servicenow/sdk/core'", '', ...registros,
  ].join('\n');
}

// ——— Ciclos: 1 encerrado, 1 publicado e distribuído (o do mês), 1 em prévia ———
// Contribuintes do ciclo do mês: massificada e não avaliados viram contatos; 6 qualificados viram
// casos; o grupo de controle (≈10% dos elegíveis) fica sem contato nem caso.
const massa = contribuintes.filter((c) => ['massificada', 'nao_avaliado'].includes(c.segmento));
const qualificados = contribuintes.filter((c) => c.segmento === 'qualificada').slice(0, 6);
const controleMes = 4;
const elegMes = massa.length + qualificados.length + controleMes;

const CICLO_ENC = 'seed_demo_ciclo_encerrado';
const CICLO_MES = 'TEL-009_registro_demo';
const CICLO_PREVIA = 'seed_demo_ciclo_previa';
const encMassa = 12;
const ciclos = [
  record(CICLO_ENC, `${S}ciclo`, {
    nome: `Ciclo ${mes(-1).slice(0, 7)}`, referencia: mes(-1), criterio: raw(ref(`${S}criterio`, criterios[1])),
    estado: 'encerrado', qtd_elegiveis: encMassa + 4 + 2, semente_sorteio: Number(mes(-1).replace(/-/g, '')),
    qtd_massificada: encMassa, qtd_qualificada: 4, qtd_controle: 2, qtd_sem_score: 1,
    taxa_cobrada: 23.4, taxa_controle: 15.1, efeito_incremental: 8.3,
    publicado_em: `${mes(-1)} 12:00:00`, publicado_por: raw(refUser(COORD)),
    distribuido_em: `${mes(-1)} 13:00:00`, qtd_contatos: encMassa,
  }),
  record(CICLO_MES, `${S}ciclo`, {
    nome: `Ciclo ${mes(0).slice(0, 7)}`, referencia: mes(0), criterio: raw(ref(`${S}criterio`, criterios[0])),
    estado: 'publicado', qtd_elegiveis: elegMes, semente_sorteio: Number(mes(0).replace(/-/g, '')),
    qtd_massificada: massa.length, qtd_qualificada: qualificados.length, qtd_controle: controleMes, qtd_sem_score: 3,
    // Ciclo em andamento: as taxas e o efeito incremental são apurados no encerramento.
    publicado_em: `${mes(0)} 12:00:00`, publicado_por: raw(refUser(COORD)),
    distribuido_em: `${mes(0)} 13:00:00`, qtd_contatos: massa.length,
  }),
  record(CICLO_PREVIA, `${S}ciclo`, {
    nome: `Ciclo ${mes(1).slice(0, 7)}`, referencia: mes(1), criterio: raw(ref(`${S}criterio`, criterios[0])),
    estado: 'previa',
  }),
];

// ——— Contatos ———
// Prioridade de 1 a 5 pelo valor em aberto (maior valor, maior prioridade).
const ordenados = [...contribuintes].sort((a, b) => a.valor - b.valor);
const prioridade = (c) => 1 + Math.floor((ordenados.indexOf(c) * 5) / ordenados.length);

// Padrão por atendente, na ordem dos contribuintes dele (tabela de decisão do «Registrar ligação»).
const PADRAO = [
  { status: 'retornar', d: 0, res: 'sem_contato', t: 1 },
  { status: 'a_ligar', d: 0, t: 0 },
  { status: 'a_ligar', d: 0, t: 0 },
  { status: 'retornar', d: 0, res: 'contato_efetivo', t: 1 },
  { status: 'a_ligar', d: 0, t: 0 },
  { status: 'ligado', d: 7, res: 'promessa_pagamento', t: 1 },
  { status: 'a_ligar', d: 1, t: 0 },
  { status: 'retornar', d: 1, res: 'sem_contato', t: 2 },
  { status: 'a_ligar', d: 2, t: 0 },
  { status: 'a_ligar', d: 3, t: 0 },
  { status: 'encerrado', res: 'recusa', t: 1, motivo: 'recusa' },
  { status: 'retornar', d: 4, res: 'contato_efetivo', t: 1 },
  { status: 'a_ligar', d: 5, t: 0 },
  { status: 'ligado', d: 6, res: 'promessa_pagamento', t: 2 },
  { status: 'encerrado', res: 'sem_contato', t: 3, motivo: 'sem_contato' },
  { status: 'a_ligar', d: 7, t: 0 },
];
const ENC_PADRAO = [
  { res: 'promessa_pagamento', t: 1, motivo: 'regularizado' },
  { res: 'contato_efetivo', t: 1, motivo: 'contato_realizado' },
  { res: 'sem_contato', t: 3, motivo: 'sem_contato' },
  { res: 'promessa_pagamento', t: 2, motivo: 'regularizado' },
  { res: 'recusa', t: 1, motivo: 'recusa' },
  { res: 'contato_efetivo', t: 2, motivo: 'contato_realizado' },
];

const contatos = [];
const porAtendente = new Map();
for (const c of massa) {
  if (!porAtendente.has(c.atendente)) porAtendente.set(c.atendente, []);
  porAtendente.get(c.atendente).push(c);
}
let demoMarcado = false;
const contagemPorAtendente = {};
const statusDoMes = new Map();
for (const [atendente, lista] of [...porAtendente.entries()].sort()) {
  lista.forEach((c, i) => {
    const p = PADRAO[i % PADRAO.length];
    let chave = `seed_demo_contato_${String(contatos.length + 1).padStart(3, '0')}`;
    // Registro demo da TEL-035: contato de demo.atendente em «Retornar», 1 tentativa, retorno hoje.
    if (!demoMarcado && atendente === 'usuario_demo_atendente' && i === 0) { chave = 'TEL-035_registro_demo'; demoMarcado = true; }
    contatos.push(record(chave, `${S}contato`, {
      contribuinte: raw(ref(`${S}contribuinte`, c.id)), atendente: raw(refUser(atendente)),
      ciclo: raw(ref(`${S}ciclo`, CICLO_MES)), status: p.status,
      proxima_acao_em: p.d === undefined ? undefined : dia(p.d), ultimo_resultado: p.res,
      tentativas: p.t, prioridade: prioridade(c), valor_em_aberto: c.valor, motivo_encerramento: p.motivo,
    }));
    contagemPorAtendente[atendente] = (contagemPorAtendente[atendente] ?? 0) + 1;
    statusDoMes.set(c.id, p.status);
  });
}
// Contatos do ciclo encerrado: todos encerrados, com o motivo.
massa.slice(0, encMassa).forEach((c, i) => {
  const p = ENC_PADRAO[i % ENC_PADRAO.length];
  contatos.push(record(`seed_demo_contato_${String(contatos.length + 1).padStart(3, '0')}`, `${S}contato`, {
    contribuinte: raw(ref(`${S}contribuinte`, c.id)), atendente: raw(refUser(c.atendente)),
    ciclo: raw(ref(`${S}ciclo`, CICLO_ENC)), status: 'encerrado', ultimo_resultado: p.res, tentativas: p.t,
    prioridade: prioridade(c), valor_em_aberto: c.valor, motivo_encerramento: p.motivo,
  }));
});

// ——— Casos qualificados do coordenador, um por etapa (dois em condução) ———
const ETAPAS = [
  { estagio: 'em_selecao', score: 81.5 },
  { estagio: 'selecionado', score: 74.0 },
  { estagio: 'dossie_gerado', semScore: true },
  { estagio: 'conducao', score: 68.2, sinal: 'Notificação de protesto ativa na CCF (fictícia)', demo: true },
  { estagio: 'conducao', score: 59.9 },
  { estagio: 'encerrado', score: 77.3, motivo: 'regularizado', encerrado: dia(-3) },
];
const casos = qualificados.map((c, i) => {
  const e = ETAPAS[i];
  return record(e.demo ? 'TEL-024_registro_demo' : `seed_demo_caso_${String(i + 1).padStart(3, '0')}`, `${S}caso`, {
    contribuinte: raw(ref(`${S}contribuinte`, c.id)), coordenador: raw(refUser(COORD)),
    ciclo: raw(ref(`${S}ciclo`, CICLO_MES)), estagio: e.estagio, prioridade: 5 - (i % 5),
    score: e.semScore ? undefined : e.score, sem_score: Boolean(e.semScore), valor_em_aberto: c.valor,
    sinal_coercitivo: Boolean(e.sinal), sinal_coercitivo_desc: e.sinal,
    motivo_encerramento: e.motivo, encerrado_em: e.encerrado ? `${e.encerrado} 15:00:00` : undefined,
  });
});

// ——— Carteira segmentada dos 2 ciclos publicados: bate com os totais do ciclo ———
// Grupo de controle ≈10% dos elegíveis, sorteado entre os contribuintes «controle» do seed; quem está
// em controle não tem contato nem caso. Estágio do funil coerente com o contato ou o caso.
const controle = contribuintes.filter((c) => c.segmento === 'controle');
const qualificadosEnc = contribuintes.filter((c) => c.segmento === 'qualificada').slice(6, 10);
const MOTIVO = {
  massificada: 'Valor e atraso dentro da faixa da cobrança massificada',
  qualificada: 'Valor acima do limite da cobrança qualificada',
  controle: 'Sorteado para o grupo de controle do ciclo',
};
const segmentacao = [];
let nSeg = 0;
function linhaSeg(ciclo, criterio, c, segmento, estagio, semScore) {
  nSeg += 1;
  segmentacao.push(record(`seed_demo_segmentacao_${String(nSeg).padStart(3, '0')}`, `${S}segmentacao`, {
    ciclo: raw(ref(`${S}ciclo`, ciclo)), contribuinte: raw(ref(`${S}contribuinte`, c.id)),
    criterio: raw(ref(`${S}criterio`, criterio)), segmento, valor_em_aberto: c.valor,
    score_usado: semScore ? undefined : 40 + ((nSeg * 37) % 55) + 0.5, sem_score: semScore,
    estagio_funil: estagio, motivo: MOTIVO[segmento],
  }));
}
// Ciclo do mês: 28 massificada, 6 qualificada, 4 controle (3 sem score).
massa.forEach((c, i) => linhaSeg(CICLO_MES, criterios[0], c, 'massificada',
  statusDoMes.get(c.id) === 'a_ligar' ? 'identificado' : 'notificado', i < 2));
qualificados.forEach((c, i) => linhaSeg(CICLO_MES, criterios[0], c, 'qualificada',
  ETAPAS[i].estagio === 'encerrado' ? 'regularizado' : ETAPAS[i].estagio === 'em_selecao' ? 'identificado' : 'notificado',
  Boolean(ETAPAS[i].semScore)));
controle.slice(0, controleMes).forEach((c) => linhaSeg(CICLO_MES, criterios[0], c, 'controle', 'identificado', false));
// Ciclo encerrado: 12 massificada, 4 qualificada, 2 controle (1 sem score).
massa.slice(0, encMassa).forEach((c, i) => linhaSeg(CICLO_ENC, criterios[1], c, 'massificada',
  ENC_PADRAO[i % ENC_PADRAO.length].motivo === 'regularizado' ? 'regularizado' : 'notificado', i === 0));
qualificadosEnc.forEach((c, i) => linhaSeg(CICLO_ENC, criterios[1], c, 'qualificada', i === 0 ? 'regularizado' : 'notificado', false));
controle.slice(controleMes, controleMes + 2).forEach((c) => linhaSeg(CICLO_ENC, criterios[1], c, 'controle', 'identificado', false));

mkdirSync(OUT, { recursive: true });
writeFileSync(join(OUT, 'segmentacao.now.ts'), arquivo('carteira segmentada dos ciclos publicados', segmentacao));
writeFileSync(join(OUT, 'ciclo.now.ts'), arquivo('ciclos de qualificação', ciclos));
writeFileSync(join(OUT, 'contato.now.ts'), arquivo('contatos da lista de cobrança ativa', contatos));
writeFileSync(join(OUT, 'caso.now.ts'), arquivo('casos qualificados do coordenador', casos));
writeFileSync(join(SEED, '_contagem.manual.json'), JSON.stringify({
  tabelas: {
    [`${S}ciclo`]: ciclos.length, [`${S}segmentacao`]: segmentacao.length,
    [`${S}contato`]: contatos.length, [`${S}caso`]: casos.length,
  },
  extras: [],
}, null, 2) + '\n');
writeFileSync(join(SEED, '_documentos.manual.json'), JSON.stringify({ documentos: [] }, null, 2) + '\n');
console.log(JSON.stringify({
  hoje: dia(0), ciclos: ciclos.length, segmentacao: segmentacao.length, contatos: contatos.length, casos: casos.length,
  contatosDoMes: massa.length, porAtendente: contagemPorAtendente, elegiveisMes: elegMes, controleMes,
}));
