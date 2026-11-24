// Speckit ServiceNow — formato ServiceNow do data-model (prévia e final).
//
// O modelo de um app escopado tem `scope` + `modules[]` + `entities[]` (+ `screens[]`, `roles[]`) na
// raiz — o mesmo formato de outputs/spec/data-model.previa.json, validado por
// templates/data-model.servicenow.schema.json. Os scripts antigos da skill (render-data-model-md,
// render-er) leem `boundedContexts[]`; `comoBoundedContexts` traduz um no outro só para LEITURA, e o
// arquivo em disco continua no formato ServiceNow.

const lista = (v) => (Array.isArray(v) ? v : []);

/** O modelo está no formato ServiceNow? */
export function ehModeloServiceNow(m) {
  return m !== null && typeof m === 'object' && typeof m.scope === 'string' && Array.isArray(m.entities);
}

function descreverColuna(c) {
  const partes = [c?.label ?? ''];
  if (c?.reference) partes.push(`→ ${c.reference}`);
  if (c?.choices && typeof c.choices === 'object') partes.push(`valores: ${Object.keys(c.choices).join(', ')}`);
  if (c?.format) partes.push(`documento ${c.format.toUpperCase()} fictício`);
  return partes.filter(Boolean).join(' — ');
}

function comoEntidade(e, nomesDoModelo) {
  return {
    name: e.name,
    tableName: e.name,
    operationType: 'NEW',
    purpose: e.label + (e.simulation ? ' (integração simulada)' : ''),
    dataOwnership: { mode: e.simulation ? 'EXTERNAL_PROJECTION' : 'OWNED' },
    traceability: [...lista(e.rf), ...lista(e.rn)].map((id) => ({ section: 'requirements', itemId: id })),
    primaryKey: ['sys_id'],
    identifierStrategy: 'sys_id (GUID da plataforma)',
    columns: lista(e.columns).map((c) => ({
      name: c.name,
      type: c.type,
      nullable: c.mandatory !== true,
      operationType: 'NEW',
      notes: descreverColuna(c),
    })),
    // Só reference para tabela do modelo vira relacionamento: a OOTB (sys_user…) não tem nó no ER.
    relationships: lista(e.columns)
      .filter((c) => c?.type === 'reference' && nomesDoModelo.has(c.reference))
      .map((c) => ({ targetEntity: c.reference, type: 'MANY_TO_ONE', foreignKey: c.name, nullable: c.mandatory !== true })),
  };
}

/**
 * Visão `boundedContexts[]` do modelo ServiceNow: um contexto por módulo (MOD-), na ordem do
 * arquivo; tabela fora de qualquer módulo cai num contexto «Sem módulo». Modelo de outro formato
 * volta sem mudança.
 */
export function comoBoundedContexts(m) {
  if (!ehModeloServiceNow(m)) return m;
  const porNome = new Map(lista(m.entities).map((e) => [e.name, e]));
  const nomes = new Set(porNome.keys());
  const usadas = new Set();
  const contextos = lista(m.modules).map((mod) => ({
    id: mod.id,
    name: mod.label,
    moduleIds: [mod.id],
    entities: lista(mod.tables).filter((t) => porNome.has(t)).map((t) => {
      usadas.add(t);
      return comoEntidade(porNome.get(t), nomes);
    }),
  }));
  const soltas = [...porNome.keys()].filter((t) => !usadas.has(t));
  if (soltas.length) {
    contextos.push({ id: 'SEM-MODULO', name: 'Sem módulo', entities: soltas.map((t) => comoEntidade(porNome.get(t), nomes)) });
  }
  return {
    projectName: m.projectName ?? m.scope,
    schemaVersion: 'data-model/servicenow',
    boundedContexts: contextos,
  };
}
