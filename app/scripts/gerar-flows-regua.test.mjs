// Teste do gerador da régua como Flow (US-MOD-F4-010, TASK-MOD-F4-010-02; design ux-v2, Verification «Gerador»).
// Uso: node --test app/scripts/gerar-flows-regua.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gerar, validar, MSG, MARCA, gerarFlow } from './gerar-flows-regua.mjs';

const AQUI = dirname(fileURLToPath(import.meta.url));

const ipva = () => ({
  codigo: 'ipva', nome: 'IPVA', carteira: 'ipva', ativa: true, prazo_final_dias: 5, janela_atribuicao_dias: 30,
  etapas: [
    { ordem: 1, dia: 0, canal: 'sne', postura: 'utilitaria', acao_sem_resposta: 'intensificar', template: 'Há uma mensagem no DT-e.' },
    { ordem: 2, dia: 10, canal: 'email', postura: 'consciente', acao_sem_resposta: 'intensificar', template: 'Mensagem não lida no DT-e.' },
    { ordem: 3, dia: 20, canal: 'sms', postura: 'explicativa', acao_sem_resposta: 'intensificar', template: 'Pendência no DT-e.' },
    { ordem: 4, dia: 30, canal: 'sne', postura: 'ameacadora', acao_sem_resposta: 'encaminhar_ativa', template: 'Cobrança ativa.' },
  ],
});
const itcd = () => ({
  codigo: 'itcd', nome: 'ITCD', carteira: 'itcd', ativa: true, prazo_final_dias: 5,
  etapas: [
    { ordem: 1, dia: 0, canal: 'sne', postura: 'utilitaria', acao_sem_resposta: 'intensificar', template: 'DT-e.' },
    { ordem: 2, dia: 15, canal: 'email', postura: 'consciente', acao_sem_resposta: 'encaminhar_qualificada', template: 'DT-e.' },
  ],
});
const app = () => mkdtempSync(join(tmpdir(), 'regua-'));
const arquivos = (dir, sub) => (existsSync(join(dir, 'src', 'fluent', sub)) ? readdirSync(join(dir, 'src', 'fluent', sub)) : []);

test('JSON de 2 réguas escreve 2 Flows e 1 seed, com o flow por Now.ref no seed', () => {
  const dir = app();
  const r = gerar({ reguas: [ipva(), itcd()] }, dir);
  assert.equal(r.flows.length, 2);
  assert.deepEqual(arquivos(dir, 'flows').sort(), ['regua-ipva.now.ts', 'regua-itcd.now.ts']);
  assert.deepEqual(arquivos(dir, 'seed-demo'), ['regua.now.ts']);
  const seed = readFileSync(join(dir, 'src', 'fluent', 'seed-demo', 'regua.now.ts'), 'utf8');
  assert.match(seed, /flow: Now\.ref\("sys_hub_flow", "flow_regua_ipva"\)/);
  assert.match(seed, /Now\.ID\["TEL-014_registro_demo"\]/);
  assert.match(seed, /Now\.ID\["seed_regua_itcd"\]/);
  assert.equal((seed.match(/table: "x_2326104_cob_regua_etapa"/g) ?? []).length, 6);
  const flow = readFileSync(join(dir, 'src', 'fluent', 'flows', 'regua-ipva.now.ts'), 'utf8');
  assert.ok(flow.startsWith(MARCA));
  assert.match(flow, /name: "Régua: IPVA"/);
  assert.match(flow, /condition: 'regua\.codigo=ipva\^status=ativa'/);
  assert.equal((flow.match(/FlowStage\(/g) ?? []).length, 5);
  assert.match(flow, /label: 'Encaminhamento'/);
  assert.equal((flow.match(/wfa\.action\(enviarComunicacao/g) ?? []).length, 4);
  assert.equal((flow.match(/wfa\.action\(escalonar/g) ?? []).length, 1);
  assert.match(flow, /ordem: 5 \}\)/); // fecho = última + 1
  assert.match(flow, /Duration\(\{ seconds: 1 \}\)/);
  assert.match(flow, /values: TemplateValue\(\{ status: 'erro'/);
});

test('etapa de SMS com «Pague R$ 500» aborta com a mensagem de sigilo e não escreve nada', () => {
  const dir = app();
  const r = ipva();
  r.etapas[2].template = 'Pague R$ 500';
  assert.throws(() => gerar({ reguas: [r] }, dir), (e) => e.message.includes(MSG.SIGILO('ipva', 3, 'sms')));
  assert.deepEqual(arquivos(dir, 'flows'), []);
  assert.deepEqual(arquivos(dir, 'seed-demo'), []);
});

test('cada validação recusa o seu caso', () => {
  const salto = ipva(); salto.etapas[1].postura = 'explicativa';
  assert.ok(validar({ reguas: [salto] }).includes(MSG.POSTURA('ipva', 2)));
  const regride = ipva(); regride.etapas[2].postura = 'utilitaria';
  assert.ok(validar({ reguas: [regride] }).includes(MSG.POSTURA('ipva', 3)));
  const dia = ipva(); dia.etapas[2].dia = 10;
  assert.ok(validar({ reguas: [dia] }).includes(MSG.DIA('ipva', 3)));
  const fora = ipva(); fora.etapas[1].acao_sem_resposta = 'encaminhar_ativa';
  assert.ok(validar({ reguas: [fora] }).includes(MSG.ENCAMINHAR('ipva')));
  const semFim = ipva(); semFim.etapas[3].acao_sem_resposta = 'intensificar';
  assert.ok(validar({ reguas: [semFim] }).includes(MSG.ENCAMINHAR('ipva')));
  const tributo = ipva(); tributo.etapas[1].template = 'Seu {tributo} vence hoje';
  assert.ok(validar({ reguas: [tributo] }).includes(MSG.SIGILO('ipva', 2, 'email')));
  const sne = ipva(); sne.etapas[0].template = 'Valor R$ 10 no DT-e';
  assert.deepEqual(validar({ reguas: [sne] }), []); // SNE é canal formal (D17 vale para e-mail, SMS e WhatsApp)
  assert.ok(validar({ reguas: [ipva(), ipva()] }).includes(MSG.CODIGO('ipva')));
  assert.deepEqual(validar({ reguas: [ipva(), itcd()] }), []);
});

test('régua com flowManual: o seed é escrito e o Flow mantido à mão não é reescrito', () => {
  const dir = app();
  const flows = join(dir, 'src', 'fluent', 'flows');
  mkdirSync(flows, { recursive: true });
  writeFileSync(join(flows, 'regua-itcd.now.ts'), '// mantido à mão (transform)\n');
  const manual = { ...itcd(), flowManual: true };
  const r = gerar({ reguas: [ipva(), manual] }, dir);
  assert.equal(r.flows.length, 1);
  assert.equal(readFileSync(join(flows, 'regua-itcd.now.ts'), 'utf8'), '// mantido à mão (transform)\n');
  assert.match(readFileSync(join(dir, 'src', 'fluent', 'seed-demo', 'regua.now.ts'), 'utf8'), /codigo: "itcd"/);
});

test('Flow de régua que saiu do JSON é apagado só se foi gerado', () => {
  const dir = app();
  gerar({ reguas: [ipva(), itcd()] }, dir);
  writeFileSync(join(dir, 'src', 'fluent', 'flows', 'regua-outra.now.ts'), '// à mão\n');
  gerar({ reguas: [ipva()] }, dir);
  assert.deepEqual(arquivos(dir, 'flows').sort(), ['regua-ipva.now.ts', 'regua-outra.now.ts']);
});

test('outputs/spec/reguas.json do app é válido: 5 réguas, uma por carteira, ITCD encaminha à qualificada', () => {
  const dados = JSON.parse(readFileSync(resolve(AQUI, '..', '..', 'outputs', 'spec', 'reguas.json'), 'utf8'));
  assert.deepEqual(validar(dados), []);
  assert.deepEqual(dados.reguas.map((r) => r.carteira).sort(), ['icms_normal', 'icms_st', 'ipva', 'itcd', 'parcelamentos']);
  const ultima = (c) => dados.reguas.find((r) => r.codigo === c).etapas.at(-1).acao_sem_resposta;
  assert.equal(ultima('itcd'), 'encaminhar_qualificada');
  assert.equal(ultima('ipva'), 'encaminhar_ativa');
  const ip = dados.reguas.find((r) => r.codigo === 'ipva');
  assert.deepEqual(ip.etapas.map((e) => [e.dia, e.canal, e.postura]), [[0, 'sne', 'utilitaria'], [10, 'email', 'consciente'], [20, 'sms', 'explicativa'], [30, 'sne', 'ameacadora']]);
  assert.equal(ip.prazo_final_dias, 5);
  for (const r of dados.reguas) assert.ok(r.etapas.length >= 3 && r.etapas.length <= 4);
  assert.ok(gerarFlow(ip).includes("internalName: \"regua_ipva\""));
});
