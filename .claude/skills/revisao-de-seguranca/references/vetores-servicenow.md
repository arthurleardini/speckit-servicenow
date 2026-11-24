# Vetores da plataforma ServiceNow — catálogo SEC do alvo

Complementa a base compartilhada `.claude/references/seguranca/vetores.md` (OWASP, STRIDE, CVSS,
DREAD, mapa operação × risco e controles transversais), que continua valendo inteira. A base
compartilhada não tem vetor específico de ServiceNow: os vetores abaixo traduzem a Camada G de
`.claude/rules/harness/security.md` (RN-SN-135 a RN-SN-150) para o catálogo `SEC-###`.

Cada linha é um **vetor a avaliar** no PG-C. Vetor que se aplica e não está coberto pela spec vira
`SEC-###` no PG-D, com a severidade calculada pela régua DREAD/CVSS da base compartilhada.

| # | Vetor | Como o ataque acontece | Controle esperado | OWASP / STRIDE | Referência |
|---|-------|------------------------|-------------------|----------------|------------|
| V-SN-01 | ACL ausente | Tabela do escopo sem ACL `record` para alguma operação: qualquer usuário com acesso à tabela lê ou grava pela list, pelo report, pela exportação ou pela API | ACL `record` por operação (read, write, create, delete) em toda tabela custom, com role explícita; não depender da ACL da tabela pai | A01 / Elevação de privilégio | RN-SN-136, RN-SN-138 |
| V-SN-02 | ACL permissiva | ACL só com script, sem role nem condição; ACL com role ampla demais; `create` sem `write`; `delete` liberado em registro que precisa de trilha | Roles e condição antes de script; uma ACL por operação por objeto; `create` exige também `write`; `delete` só para o admin do app e nunca em registro de trilha | A01 / Elevação de privilégio, Tampering | RN-SN-137, RN-SN-141 |
| V-SN-03 | ACL de linha ausente (IDOR) | Usuário abre por URL ou vê na list o registro de outro dono (ex.: carteira de outro atendente) | ACL de linha por operação com condição de dono; Data Filter acompanhado de ACL Deny-Unless; reports e exportação passam pela mesma ACL | A01, API1 / Info Disclosure | RN-SN-139, RN-SN-144 |
| V-SN-04 | `GlideRecord` em vez de `GlideRecordSecure` | Script chamado pelo usuário (UI Action, GlideAjax, Script Include da tela) consulta com `GlideRecord` e devolve dado que a ACL negaria | `GlideRecordSecure`, ou `canRead/canWrite/canCreate/canDelete` explícito; `GlideRecord` simples só em processamento de sistema, sem devolver o resultado à tela | A01 / Info Disclosure | RN-SN-80, RN-SN-146 |
| V-SN-05 | Business Rule grava sem conferir a regra | Business Rule não respeita ACL: grava em outra tabela por conta de quem disparou | A Business Rule confere a regra de negócio antes de gravar em tabela relacionada | A04 / Tampering | RN-SN-81 |
| V-SN-06 | Script Include client-callable sem ACL | `clientCallable: true` sem ACL de `client_callable_script_include`: qualquer sessão chama o método por GlideAjax | `clientCallable` só com GlideAjax real, ACL própria e role mínima; `glide.script.secure.ajaxgliderecord = true` | A01, API5 / Elevação de privilégio | RN-SN-71, RN-SN-147 |
| V-SN-07 | Cross-scope sem privilégio declarado | Script de outro escopo lê ou grava tabelas do app, ou o app usa tabela de outro escopo sem registro | `CrossScopePrivilege` declarado, um por operação por alvo; Script Include `package_private`; Web Service Access compatível | A01 / Elevação de privilégio | RN-SN-72, RN-SN-148, RN-SN-149 |
| V-SN-08 | Role elevada | Usuário do app recebe `admin` da plataforma ou role ampla; role referenciada por `sys_id`; herança indevida por `containsRoles` | Roles `<escopo>.<papel>`; nenhuma ação do app exige `admin` global; herança só onde a matriz de acesso pede; role existente referenciada por nome | A01 / Elevação de privilégio | RN-SN-135 |
| V-SN-09 | Segurança só na interface | Dado "protegido" por UI Policy, Client Script, filtro de list ou `condition` de UI Action: pela list, pela URL ou pela API o dado aparece | UI é só experiência (RN-SN-145); quem protege é ACL, Data Filter com Deny e Business Rule; a condição da UI Action é reconferida no servidor | A01, A04 / Tampering | RN-SN-145, RN-SN-170 |
| V-SN-10 | Consulta cega em coluna sensível | Usuário filtra a list por faixa ou igualdade numa coluna sensível (documento, valor) e descobre o dado sem permissão de leitura | ACL `query_range` e `query_match` na coluna sensível | A01 / Info Disclosure | RN-SN-140 |
| V-SN-11 | Table API / REST aberta | Tabela do escopo acessível pela Table API sem necessidade | `allowWebServiceAccess` desligado nas tabelas que não têm integração | API1, A05 / Info Disclosure | RN-SN-82, RN-SN-149 |
| V-SN-12 | Seed com dado real | Registro de pessoa do seed com documento real, ou seed instalado como código (sem `installMethod: 'demo'`) | Seed só por `Record()` com `$meta: { installMethod: 'demo' }`; `ficticio = true`; CPF e CNPJ gerados por semente fixa e listados em `_documentos.json`; `.md` novo passa pelo `check_sensivel.py` | A02 / Info Disclosure (LGPD, CTN art. 198) | RN-SN-103, RN-SN-168 |
| V-SN-13 | Credencial da instância exposta | Usuário, senha ou URL da instância em `.now.ts`, script, teste, issue ou documento; agente lendo o arquivo de credencial | Credencial só em `.env.instancia` (fora do git, negada ao agente), lida pelas variáveis `SN_SDK_*` | A02, A07 / Spoofing | Camada A de `security.md` |
| V-SN-14 | Impersonate amplo | A captura ou o teste entra como admin e assume usuário real ou role elevada | Impersonate só dos usuários demo por role; teste de ACL com usuário demo, nunca com admin nem `enforceSecurity: false` | A07 / Spoofing, Elevação de privilégio | RN-SN-83 |
| V-SN-15 | Depuração que vaza dado | `gs.addInfoMessage` de depuração, propriedade de debug ligada, log com documento | Log com `gs.info/warn/error` sem dado pessoal (logar `sys_id` e ID da spec); propriedades de debug em `false` | A09 / Info Disclosure | RN-SN-84, RN-SN-85, RN-SN-102 |
| V-SN-16 | Instalação fora do caminho controlado | Mudança feita na instância sem voltar ao git, ou install em escopo de outro prefixo | Instalação só por `npm run reinstall`, que confere o prefixo do escopo contra `app/now.config.json` | A05, A08 / Tampering | RN-SN-164 |

## Controles transversais traduzidos para a plataforma

O PG-C avalia os controles transversais da base compartilhada assim, no alvo ServiceNow:

| Controle da base | Leitura no ServiceNow |
|------------------|-----------------------|
| Autenticação | Login nativo da plataforma; o app não cria autenticação própria nem guarda senha. Usuário demo sem senha, só por impersonate (V-SN-14) |
| RBAC / autorização | Roles do escopo + ACL por tabela, campo, operação e linha (V-SN-01 a V-SN-03, V-SN-08) |
| Rate limiting | Controle da plataforma; o app só responde por ele se expuser API própria (V-SN-11) |
| Logging / auditoria | `audit` e journal nas tabelas de form; trilha gravada pelo servidor; log sem dado pessoal (V-SN-15) |
| Gestão de segredos | `.env.instancia` fora do git e do agente (V-SN-13) |
| Headers HTTP | Responsabilidade da plataforma; fora do escopo do app |
| Auditoria de dependências (CI) | Versão do `@servicenow/sdk` fixada e conferida pelo `npm run doutor` |
| LGPD — direitos do titular | Dado fictício no piloto (V-SN-12); com dado real, direitos do titular entram como requisito |
| Tratamento central de erros | Mensagem ao usuário sem dado sensível; erro de script em `gs.error` (V-SN-15) |
| MFA | Política da instância; o app não implementa |
