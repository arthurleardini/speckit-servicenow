# Plano de Segurança — <Nome do Projeto>

<!-- KERNEL de fonte única de segurança. Demais docs referenciam SEC-### por ID, não duplicam.
     Referenciado por ID a partir de outputs/explore/especificacao-tecnica.md. -->

> **ID do doc:** PLANO-SEG · **Versão:** 0.1 · **Atualizado:** <AAAA-MM-DD>

## Changelog
| Versão | Data | Autor | Mudança |
|--------|------|-------|---------|
| 0.1 | <AAAA-MM-DD> | <autor> | Criação (revisao-de-seguranca / plano-geral) |

## Superfície de ameaça
Pontos de entrada, dados sensíveis/PII, fronteiras de confiança, integrações externas e
modelo de autenticação do sistema, cruzados com IDs da spec (F/RN/módulo/entidade de
modelo-de-dados.md). O `tasks.json` ainda não existe neste ponto da cadeia — não há ID de story
para cruzar ainda.

No alvo ServiceNow os elementos são: telas `TEL-` (form, list, report) e exportação, UI Actions,
Business Rules / Script Includes / Flow do escopo, tabelas com dado sensível, tabelas simuladas
`SIM-` e interruptores de falha, outro escopo e Table API, o caminho de instalação (`now-sdk` e
`.env.instancia`), a captura com impersonate e o repositório/issues no GitHub.

| Elemento | Tipo | Dados sensíveis | Fonte (ID spec) |
|----------|------|-----------------|-----------------|
| <TEL-xxx form/list/report · UI Action · tabela `<escopo>_<sufixo>` · INT-NN> | entrada/saída/fronteira | <PII/fiscal/nenhum> | <RF-MOD-… / RN-… / entidade / CON-NN> |

**Modelo de autenticação e autorização:** <login da plataforma; roles `<escopo>.<papel>` lidas de
`security.mdc`; ACL por tabela, campo, operação e linha; usuários demo por role, só por impersonate>.

## Controles transversais
Status de cada controle transversal (catálogo em `.claude/references/seguranca/vetores.md`, lido
na plataforma conforme `references/vetores-servicenow.md` da skill) frente ao que a spec declara.

| Controle | Status | Observação | SEC gerado |
|----------|--------|-----------|-----------|
| Autenticação | ✅ COBERTO / ⚠️ PARCIAL / ❌ AUSENTE | <nota> | SEC-### |
| RBAC / autorização | | | |
| Rate limiting | | | |
| Logging / auditoria | | | |
| Gestão de segredos | | | |
| Headers HTTP | | <no ServiceNow, responsabilidade da plataforma> | |
| Auditoria de dependências (CI) | | | |
| LGPD — direitos do titular | | | |
| Tratamento central de erros | | | |
| MFA (se aplicável) | | | |

## Vetores da plataforma

Os 16 vetores `V-SN-nn` de `references/vetores-servicenow.md`, cada um com o SEC que gerou ou o
motivo de não se aplicar. Nenhum vetor fica sem linha.

| Vetor | Avaliação | SEC gerado |
|-------|-----------|-----------|
| V-SN-01 ACL ausente | <onde falta ACL> | SEC-### |
| V-SN-02 ACL permissiva | | |
| V-SN-03 ACL de linha ausente (IDOR) | | |
| V-SN-04 `GlideRecord` × `GlideRecordSecure` | | |
| V-SN-05 Business Rule grava sem conferir a regra | | |
| V-SN-06 Script Include client-callable sem ACL | | |
| V-SN-07 Cross-scope sem privilégio declarado | | |
| V-SN-08 Role elevada | | |
| V-SN-09 Segurança só na interface | | |
| V-SN-10 Consulta cega em coluna sensível | | |
| V-SN-11 Table API / REST aberta | | |
| V-SN-12 Seed com dado real | | |
| V-SN-13 Credencial da instância exposta | | |
| V-SN-14 Impersonate amplo | | |
| V-SN-15 Depuração que vaza dado | | |
| V-SN-16 Instalação fora do caminho controlado | | |

## Catálogo SEC
Catálogo mestre dos requisitos de segurança. Numeração global `SEC-001`, `SEC-002`…

### SEC-001 — <título do controle>
| Campo | Valor |
|-------|-------|
| Severidade | CRÍTICO / ALTO / MÉDIO / BAIXO |
| DREAD | <n/15> |
| CVSS | <0.0> |
| OWASP / STRIDE | <AXX / letra> |
| Controle esperado | <o que precisa existir, no mecanismo da plataforma: ACL de qual operação em qual tabela, `GlideRecordSecure` em qual script, qual role — com a RN-SN> |
| Vetor | <V-SN-nn de `references/vetores-servicenow.md`, ou — quando o SEC vem só da base compartilhada> |
| Rastreabilidade | <RF-MOD-… · RN-… · módulo · tabela `<escopo>_<sufixo>` · TEL-xxx · CON-NN> |
| Status | ABERTO / COBERTO / ADIADO (sem GAP externo ainda — o `gaps-document.md` só nasce na `spec-tasks`, mais adiante na cadeia) |

## Mapa de aplicabilidade
Quais SEC tendem a cair em quais Features/módulos — o `tasks.json` ainda não existe neste ponto da
cadeia. É este mapa que a `spec-security-review` usa depois para decidir em qual story do
`tasks.json` cada `SEC-###` entra.

| SEC | Feature/Módulos aplicáveis |
|-----|-----------------------------|
| SEC-001 | <MOD-Fn, TEL-xxx> |

## Recomendações de arquitetura
Recomendações de arquitetura de segurança em ordem de prioridade, ligadas aos SEC acima.
