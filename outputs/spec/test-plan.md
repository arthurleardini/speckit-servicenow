# Plano de Testes — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

**Versão:** 1.0 | **Data:** 2026-11-24 | **Gerado por:** spec-test-plan

Roteiro de homologação do app Cobrança MT. Cada caso diz quem executa, o que precisa existir antes, os passos com valores de exemplo e o que deve acontecer. Os casos que repetem um critério de aceite do Plano 2.6 Cobrança mantêm o número do plano (`CT-MOD-F<n>-001` a `-006`, conforme `inputs/de-para-ids.md`); os casos novos do Plan começam em `-101`, para não colidir com os critérios do material refinado ainda não mapeados (GAP-017). Todo dado usado é fictício.

---

## Metadados

| Campo | Valor |
|-------|-------|
| Projeto | Cobrança MT — app `x_2326104_cob` (piloto 2.6 Cobrança, SEFAZ-MT) |
| Épicas cobertas | EPIC-001 a EPIC-007 (todos os módulos do `modules.md`) |
| Total de casos de teste | 100 |
| Responsável | Coordenação de Cobrança (CPRF), com apoio da SQUAD Cobrança |
| Ambiente alvo | Instância `dev493801`, app Cobrança MT, com seed fictício |
| Ambiente de integrações (sandbox/mock) | Simuladores dentro do app: SIM-01 score, SIM-02 canais, SIM-03 fontes (`inputs/simulacoes.md`); nenhuma integração real |
| Perfis de usuário cobertos | Coordenador de Cobrança, Atendente de Cobrança (A e B), Administrador do app |
| Numeração | `CT-MOD-F<n>-<nnn>` e `CT-MOD-T-<nnn>`; épica = módulo na ordem do `requirements.md` |

## Glossário

| Termo | Significado |
|-------|-------------|
| Ciclo | mês de referência da qualificação (premissa: mensal) |
| Grupo de controle | contribuintes sorteados no ciclo que não recebem cobrança, para medir o efeito |
| Sem score | contribuinte sem score de liquidez válido; é avaliado só por valor, atraso e tributo |
| Simulado | tela que imita um sistema externo (score, canal ou fonte de débito) dentro do app |
| Fio condutor | os 5 requisitos com lógica completa no piloto (`inputs/fio-condutor.md`) |

---

## [EPIC-001] — Ingestão e Carteira Consolidada (MOD-F1)

### Pré-requisitos da Épica

- Seed fictício instalado, com as inconsistências plantadas: documento sobreposto entre CCF e SNE, 1 documento com dígito verificador inválido e 1 fonte com falha simulada
- Usuários demo do Anexo A criados
- Integrações das fontes simuladas (ver Anexo C)

### [CT-MOD-F1-001] Consolidar débitos das fontes com a origem registrada [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: consolidar débitos das fontes com a origem registrada. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-001, RN-NOVO-F1-001, RN-NOVO-F1-006 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A) para preparar as linhas; depois Estar logado como demo.coordenador (Anexo A)
- Linhas novas das fontes CCF e SNE para o contribuinte fictício «Comércio Alfa Ltda (fictício)» no Staging de fontes

**Passos:**
1. No menu «Cobrança MT», abra «Staging de fontes (Simulado)» e confira 2 linhas não processadas: CCF, ICMS Normal, R$ 12.000,00; SNE, IPVA, R$ 3.500,00
2. Acione a consolidação do ciclo 2027-01
3. Abra «Carteira consolidada» e filtre o contribuinte «Comércio Alfa Ltda (fictício)»
4. Abra «Integrações e sincronização»

**Resultado esperado:**
- ✅ Os 2 débitos aparecem ligados a «Comércio Alfa Ltda (fictício)», com Origem «CCF» e «SNE»
- ✅ As 2 linhas do staging ficam com «Processado» marcado
- ✅ Há uma execução por fonte no ciclo 2027-01, com o volume de cada uma

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-002] Recusar documento com dígito verificador inválido [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: recusar documento com dígito verificador inválido. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-002, RN-NOVO-F1-004 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Linha do staging com o documento fictício inválido nº 1 do Anexo B

**Passos:**
1. Acione a consolidação do ciclo 2027-01
2. Abra «Carteira consolidada» e procure o ID na fonte da linha inválida
3. Abra «Log de rejeições»

**Resultado esperado:**
- ✅ Nenhum débito é gravado para a linha inválida
- ✅ O log de rejeições mostra a linha com motivo «Documento inválido» e a fonte de origem
- ✅ A execução da fonte mostra «Rejeitados = 1»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-003] Encerrar a abordagem de quem regularizou dentro do ciclo [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: encerrar a abordagem de quem regularizou dentro do ciclo. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-003, RN-NOVO-F1-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício «Transportes Beta Ltda (fictício)» com 1 débito em aberto e comunicação agendada para amanhã

**Passos:**
1. Abra o débito do contribuinte em «Carteira consolidada»
2. Mude o status para «Regularizado» e salve
3. Abra «Execução e status de disparo» e filtre o contribuinte

**Resultado esperado:**
- ✅ A comunicação agendada passa para «Encerrada»
- ✅ Nenhuma etapa nova fica agendada para o contribuinte

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-004] Marcar parcelamento em risco quando uma parcela atrasa [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: marcar parcelamento em risco quando uma parcela atrasa. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-004, RN-NOVO-F1-007 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Parcelamento fictício de 12 parcelas, status «Em dia», 0 parcelas em atraso

**Passos:**
1. Abra «Parcelamentos em risco» e localize o parcelamento
2. Registre 1 parcela em atraso (Parcelas em atraso = 1) e salve
3. Recarregue a lista

**Resultado esperado:**
- ✅ O status muda para «Em risco»
- ✅ «Alerta de risco» fica marcado

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-005] Consolidar as demais fontes quando uma fonte falha [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: consolidar as demais fontes quando uma fonte falha. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-001, RF-MOD-F1-007, RN-NOVO-F1-005 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A) para ligar a falha; depois Estar logado como demo.coordenador (Anexo A)
- Fonte IPVA com «Falha simulada» ligada no staging

**Passos:**
1. Acione a consolidação do ciclo 2027-01
2. Abra «Integrações e sincronização»
3. Abra «Carteira consolidada» e filtre Origem diferente de IPVA

**Resultado esperado:**
- ✅ A execução do IPVA fica «Falha» com mensagem do erro
- ✅ As execuções de CCF, MPI/Big Data, ITCD e SNE ficam «Sucesso»
- ✅ Os débitos dessas 4 fontes estão gravados

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-006] Trocar MPI por Big Data sem mudar a carteira [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: trocar MPI por Big Data sem mudar a carteira. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-006, RN-NOVO-F1-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-01 com 40 débitos de origem «MPI/Big Data»

**Passos:**
1. Anote os contribuintes dos 40 débitos de origem MPI/Big Data
2. Carregue no staging a carga seguinte vinda da Big Data, com os mesmos débitos
3. Acione a consolidação e filtre a origem MPI/Big Data

**Resultado esperado:**
- ✅ Os 40 débitos continuam ligados aos mesmos contribuintes
- ✅ O total de débitos de origem MPI/Big Data continua 40
- ✅ A carteira do ciclo 2027-01 não muda

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-101] Marcar sobreposição e somar o valor em aberto uma vez [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: marcar sobreposição e somar o valor em aberto uma vez. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-002, RF-MOD-F1-005, RN-NOVO-F1-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício «Comércio Alfa Ltda (fictício)» com 1 débito de IPVA de R$ 5.000,00 em aberto
- Staging com o mesmo débito de ICMS Normal, vencimento 10/01/2027, R$ 12.000,00, vindo da CCF e da SNE

**Passos:**
1. Acione a consolidação
2. Abra «Carteira consolidada» e filtre o contribuinte
3. Abra «Contribuintes» e veja o «Valor em aberto» dele

**Resultado esperado:**
- ✅ Os 2 débitos de ICMS Normal ficam com «Sobreposto entre fontes» marcado
- ✅ Valor em aberto = R$ 5.000,00 + R$ 12.000,00 = R$ 17.000,00 (o débito sobreposto conta uma vez)

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-102] Abrir a visão única do contribuinte da própria carteira [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: abrir a visão única do contribuinte da própria carteira. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F1-005, RF-MOD-T-003 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Contribuinte fictício do registro demo da TEL-004 vinculado a demo.atendente

**Passos:**
1. No menu «Cobrança MT», abra «Minha fila» e abra um caso
2. Clique no contribuinte do caso
3. Percorra as listas relacionadas

**Resultado esperado:**
- ✅ Abre a «Visão única do contribuinte» com identificação, segmento, score e valor em aberto
- ✅ Aparecem as listas Débitos, Parcelamentos, Comunicações, Consentimentos e Regularizações
- ✅ O histórico de atividades mostra os comentários do registro

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-103] Ver o status de cada integração [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: ver o status de cada integração. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-007 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Consolidação do ciclo 2027-01 executada

**Passos:**
1. No menu «Cobrança MT», abra «Integrações e sincronização»
2. Filtre Fonte = SNE
3. Abra a execução

**Resultado esperado:**
- ✅ A lista mostra Fonte, Início, Fim, Status, Volume e Rejeitados
- ✅ A execução da SNE mostra o volume e os rejeitados do ciclo

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-104] Recusar linha de fonte sem documento [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: recusar linha de fonte sem documento. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-001, RF-MOD-F1-002, RN-NOVO-F1-004 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A) para preparar a linha; depois Estar logado como demo.coordenador (Anexo A)
- Linha no staging com CPF e CNPJ vazios

**Passos:**
1. Acione a consolidação
2. Abra «Log de rejeições»
3. Procure o ID na fonte da linha

**Resultado esperado:**
- ✅ A linha aparece com motivo «Documento inválido»
- ✅ Nenhum débito é gravado para ela

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-105] Impedir o atendente de ver as telas de consolidação [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: impedir o atendente de ver as telas de consolidação. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-003, RF-MOD-F1-004, RF-MOD-F1-006, RF-MOD-F1-007, RF-MOD-F1-005, RF-MOD-T-003 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)

**Passos:**
1. Abra o menu «Cobrança MT»
2. Procure os módulos «Integrações e sincronização», «Log de rejeições», «Carteira consolidada» e «Parcelamentos em risco»
3. Abra pelo endereço direto a «Visão única» de um contribuinte vinculado a demo.atendente2

**Resultado esperado:**
- ✅ Os 4 módulos não aparecem no menu do atendente
- ✅ O endereço direto não mostra o contribuinte de outra carteira

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-106] Consolidar fonte sem linhas novas [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: consolidar fonte sem linhas novas. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-001, RF-MOD-F1-007 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Nenhuma linha nova da fonte ITCD no staging

**Passos:**
1. Acione a consolidação do ciclo
2. Abra «Integrações e sincronização»
3. Filtre Fonte = ITCD

**Resultado esperado:**
- ✅ A execução do ITCD fica «Sucesso» com Volume = 0
- ✅ As demais fontes são consolidadas

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-107] Manter quitado o parcelamento que recebe atraso [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: manter quitado o parcelamento que recebe atraso. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-004, RN-NOVO-F1-007 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Parcelamento fictício com status «Quitado»

**Passos:**
1. Abra o parcelamento
2. Registre Parcelas em atraso = 1 e salve
3. Recarregue o registro

**Resultado esperado:**
- ✅ O status continua «Quitado»
- ✅ «Alerta de risco» continua desmarcado

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-108] Manter a cobrança do débito que segue em aberto [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: manter a cobrança do débito que segue em aberto. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-003, RN-NOVO-F1-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício com 2 débitos em aberto e régua em andamento

**Passos:**
1. Mude só 1 dos débitos para «Regularizado»
2. Abra «Execução e status de disparo» e filtre o contribuinte
3. Confira as comunicações agendadas

**Resultado esperado:**
- ✅ As comunicações do débito em aberto continuam agendadas

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-109] Não duplicar débito que chega pela MPI e pela Big Data [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: não duplicar débito que chega pela MPI e pela Big Data. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-006, RN-NOVO-F1-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- O mesmo débito fictício (mesmo ID na fonte) chega pela MPI e pela Big Data

**Passos:**
1. Acione a consolidação
2. Abra «Carteira consolidada»
3. Filtre o ID na fonte do débito

**Resultado esperado:**
- ✅ Aparece 1 só débito de origem «MPI/Big Data»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F1-110] Estados das telas de ingestão [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados das telas de ingestão. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-004, RF-MOD-F1-005, RF-MOD-F1-007, RF-MOD-T-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A); para a TEL-004 use demo.atendente; para a TEL-006 use demo.admin

**Passos:**
1. Abra «Integrações e sincronização» (TEL-001), «Log de rejeições» (TEL-002), «Carteira consolidada» (TEL-003), «Parcelamentos em risco» (TEL-005) e «Contribuintes» (TEL-032) e observe a carga
2. Em cada lista, aplique um filtro sem resultado
3. Abra a «Visão única» (TEL-004), apague o Nome e salve
4. Abra «Staging de fontes (Simulado)» (TEL-006) com a rede interrompida no meio da carga

**Resultado esperado:**
- ✅ Carregando: cada tela mostra o indicador de carga da plataforma até exibir as linhas (Sucesso)
- ✅ Vazio: cada lista mostra «Nenhum registro»
- ✅ Erro de validação: a TEL-004 marca o Nome e mostra «Nome é obrigatório»
- ✅ Erro de sistema: a plataforma mostra a mensagem de erro e nada é gravado

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## [EPIC-002] — Qualificação e Parametrização da Carteira (MOD-F2)

### Pré-requisitos da Épica

- Seed fictício instalado, com o critério «ICMS alto valor» versão 2 publicada (registro demo da TEL-008)
- Usuários demo do Anexo A criados
- Score de liquidez simulado com 20% dos contribuintes sem score válido

### [CT-MOD-F2-001] Formar a carteira qualificada pelo critério ICMS, R$ 500 mil e 90 dias [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: formar a carteira qualificada pelo critério ICMS, R$ 500 mil e 90 dias. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-001, RF-MOD-F2-003, RN-NOVO-F2-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Versão publicada: tributo ICMS Normal, valor mínimo R$ 500.000,00, atraso mínimo 90 dias, sem score
- Contribuintes fictícios: A com R$ 820.000,00 de ICMS Normal e 120 dias; B com R$ 480.000,00 e 200 dias; C com R$ 900.000,00 e 60 dias; D com R$ 1.000.000,00 de IPVA e 150 dias

**Passos:**
1. Abra o ciclo 2027-02 (TEL-009)
2. Clique em «Gerar prévia»
3. Abra «Carteira segmentada» filtrada pelo ciclo 2027-02

**Resultado esperado:**
- ✅ A fica «Qualificada»
- ✅ B (valor abaixo), C (atraso abaixo) e D (outro tributo) ficam «Massificada»
- ✅ O ciclo mostra Qualificada = 1 e Massificada = 3 para esses 4 contribuintes

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-002] Editar critério publicado cria nova versão e o ciclo mantém a original [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: editar critério publicado cria nova versão e o ciclo mantém a original. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-002, RN-NOVO-F2-001, RN-NOVO-F2-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Versão 2 de «ICMS alto valor» publicada, com valor mínimo R$ 500.000,00
- Ciclo 2027-01 publicado com a versão 2

**Passos:**
1. Abra a versão 2 (TEL-008) e clique em «Criar nova versão»
2. Na versão 3 em rascunho, mude o valor mínimo para R$ 300.000,00, informe o motivo e clique em «Publicar versão»
3. Abra a versão 2
4. Abra o ciclo 2027-01

**Resultado esperado:**
- ✅ A versão 3 nasce em «Rascunho», com o mesmo código e «Versão anterior» = versão 2
- ✅ Após publicar, a versão 3 fica «Publicada» com data e autor, e a versão 2 fica «Substituída» com R$ 500.000,00
- ✅ O ciclo 2027-01 continua com «Critério aplicado» = versão 2 e a mesma carteira

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-003] Sortear o grupo de controle e deixá-lo fora das ações [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: sortear o grupo de controle e deixá-lo fora das ações. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-004, RN-NOVO-F2-005, RN-NOVO-F2-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-02 em prévia com 200 elegíveis; versão do critério com grupo de controle de 10%

**Passos:**
1. Clique em «Publicar ciclo»
2. Abra «Carteira segmentada» filtrada por Segmento = Grupo de controle
3. Abra «Execução e status de disparo» e «Distribuição da carteira qualificada» filtrando os contribuintes do grupo de controle

**Resultado esperado:**
- ✅ Elegíveis = 200; Grupo de controle = 200 × 10% = 20
- ✅ O ciclo grava a «Semente do sorteio»
- ✅ Nenhuma comunicação nem caso existe para os 20 contribuintes do grupo de controle

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-004] Segmentar só por critérios determinísticos quando falta o score [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: segmentar só por critérios determinísticos quando falta o score. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-005, RN-NOVO-F3-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Versão publicada com «Usar score» marcado e threshold 60
- Contribuinte fictício E com R$ 700.000,00 de ICMS Normal, 100 dias e sem score válido

**Passos:**
1. Gere a prévia do ciclo 2027-02
2. Abra «Carteira segmentada» e localize E
3. Abra o ciclo

**Resultado esperado:**
- ✅ E fica «Qualificada» (valor e atraso atendidos) com «Sem score» marcado
- ✅ O total «Sem score» do ciclo inclui E

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-005] Desempatar pelo maior débito e depois pelo mais antigo [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: desempatar pelo maior débito e depois pelo mais antigo. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-003, RN-NOVO-F2-004 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- 3 contribuintes fictícios qualificados: F com R$ 600.000,00 e débito mais antigo vencido em 10/03/2025; G com R$ 600.000,00 e débito mais antigo vencido em 05/11/2024; H com R$ 750.000,00 vencido em 01/01/2026

**Passos:**
1. Gere a prévia do ciclo 2027-02
2. Abra «Carteira segmentada» filtrada por Segmento = Qualificada
3. Ordene pela prioridade calculada

**Resultado esperado:**
- ✅ A ordem é H (maior valor), G (mesmo valor de F, débito mais antigo) e F

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-101] Criar critério em rascunho [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: criar critério em rascunho. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. No menu «Cobrança MT», abra «Critérios de qualificação» e clique em «Novo»
2. Preencha Nome «ICMS ST alto valor», Código «ICMS-ST-01», Tributo «ICMS ST», Valor mínimo R$ 400.000,00, Atraso mínimo 120 dias, Grupo de controle 10%
3. Salve

**Resultado esperado:**
- ✅ A versão 1 fica em «Rascunho»
- ✅ «Threshold do score» fica desabilitado com «Usar score» desmarcado

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-102] Validar campos do critério nos limites [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: validar campos do critério nos limites. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-001, RF-MOD-F3-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Critério em rascunho

**Passos:**
1. Apague o Nome e salve
2. Marque «Usar score» e informe Threshold -1, depois 0, depois 100, depois 101, salvando a cada valor
3. Informe Grupo de controle 101% e salve

**Resultado esperado:**
- ✅ Sem nome: «Nome é obrigatório»
- ✅ Threshold -1 e 101 são recusados com «Threshold deve ficar entre 0 e 100»; 0 e 100 são aceitos
- ✅ Grupo de controle 101% é recusado com «Percentual deve ficar entre 0 e 100»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-103] Restringir a publicação ao coordenador [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: restringir a publicação ao coordenador. |
| **Perfil do testador** | Administrador do app (demo.admin) e Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-003, RF-MOD-F2-004, RF-MOD-F2-005, RF-MOD-F2-006 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A); depois Estar logado como demo.atendente (Anexo A)

**Passos:**
1. Como demo.admin, abra um critério em rascunho e procure «Publicar versão»
2. Como demo.admin, abra o ciclo em prévia e procure «Gerar prévia» e «Publicar ciclo»
3. Como demo.atendente, procure no menu «Critérios de qualificação», «Ciclo de qualificação» e «Carteira segmentada»

**Resultado esperado:**
- ✅ O administrador edita o rascunho, mas não vê «Publicar versão», «Gerar prévia» nem «Publicar ciclo»
- ✅ Os 3 módulos não aparecem no menu do atendente

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-104] Recusar alteração de versão publicada, inclusive pelo administrador [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: recusar alteração de versão publicada, inclusive pelo administrador. |
| **Perfil do testador** | Administrador do app (demo.admin) |
| **RN/RF relacionado** | RF-MOD-F2-002, RN-NOVO-F2-001 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A)
- Versão 2 publicada

**Passos:**
1. Abra a versão 2
2. Tente mudar o Atraso mínimo de 90 para 60 dias
3. Salve

**Resultado esperado:**
- ✅ O sistema recusa e mostra «Versão publicada não pode ser alterada. Crie uma nova versão.»
- ✅ A versão 2 continua com 90 dias

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-105] Gerar a prévia da carteira [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: gerar a prévia da carteira. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-006, RF-MOD-F2-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-02 sem carteira; versão publicada vigente

**Passos:**
1. Abra o ciclo 2027-02
2. Clique em «Gerar prévia»
3. Confira a seção Totais

**Resultado esperado:**
- ✅ O ciclo fica em «Prévia»
- ✅ Totais de Massificada, Qualificada e Sem score preenchidos
- ✅ A lista relacionada «Carteira segmentada» mostra os contribuintes do ciclo

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-106] Recusar a prévia sem versão publicada [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: recusar a prévia sem versão publicada. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-003, RF-MOD-F2-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-03 com «Critério aplicado» em rascunho

**Passos:**
1. Abra o ciclo 2027-03
2. Clique em «Gerar prévia»
3. Confira a mensagem

**Resultado esperado:**
- ✅ O sistema recusa e mostra «Publique uma versão do critério antes de gerar a prévia»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-107] Refazer o sorteio com a mesma semente [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: refazer o sorteio com a mesma semente. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-004, RN-NOVO-F2-005 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-02 publicado, com semente e 20 contribuintes no grupo de controle

**Passos:**
1. Anote a semente e os 20 contribuintes do grupo de controle
2. Peça ao administrador a reexecução de conferência do sorteio com a mesma semente e os mesmos elegíveis
3. Compare as listas

**Resultado esperado:**
- ✅ As duas listas têm os mesmos 20 contribuintes

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-108] Arredondar para cima o tamanho do grupo de controle [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: arredondar para cima o tamanho do grupo de controle. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-004, RN-NOVO-F2-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-04 em prévia com 205 elegíveis; grupo de controle de 10%

**Passos:**
1. Clique em «Publicar ciclo»
2. Abra o ciclo
3. Confira «Grupo de controle»

**Resultado esperado:**
- ✅ Grupo de controle = arredondar para cima (205 × 10%) = arredondar para cima (20,5) = 21

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-109] Não permitir nova prévia em ciclo publicado [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: não permitir nova prévia em ciclo publicado. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-006, RN-NOVO-F2-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-01 publicado

**Passos:**
1. Abra o ciclo 2027-01
2. Procure «Gerar prévia»
3. Confira a carteira segmentada

**Resultado esperado:**
- ✅ «Gerar prévia» não aparece
- ✅ A carteira do ciclo não muda

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-110] Publicar ciclo sem elegíveis [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: publicar ciclo sem elegíveis. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-004, RF-MOD-F2-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-05 em prévia com 0 elegíveis

**Passos:**
1. Clique em «Publicar ciclo»
2. Abra o ciclo
3. Confira os totais

**Resultado esperado:**
- ✅ O ciclo fica «Publicado» com Elegíveis = 0 e Grupo de controle = 0

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-111] Aceitar um só ciclo por mês de referência [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: aceitar um só ciclo por mês de referência. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-003, RN-NOVO-F1-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-01 existente

**Passos:**
1. Crie um ciclo novo
2. Informe Mês de referência 01/2027
3. Salve

**Resultado esperado:**
- ✅ O sistema recusa e mostra «Já existe ciclo para 01/2027»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-112] Qualificar quem tem score acima do threshold [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: qualificar quem tem score acima do threshold. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-005, RN-NOVO-F3-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Versão publicada com «Usar score» e threshold 60
- Contribuintes fictícios que atendem valor e atraso: J com score válido 72 e K com score válido 41

**Passos:**
1. Gere a prévia do ciclo 2027-02
2. Abra «Carteira segmentada»
3. Localize J e K

**Resultado esperado:**
- ✅ J fica «Qualificada» com Score usado = 72
- ✅ K fica «Massificada»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F2-113] Estados das telas de qualificação [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados das telas de qualificação. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F2-001, RF-MOD-F2-002, RF-MOD-F2-003, RF-MOD-F2-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Critérios de qualificação» (TEL-007) e «Carteira segmentada» (TEL-010), observe a carga e aplique filtro sem resultado
2. Abra a versão em rascunho (TEL-008), apague o Nome e salve
3. Abra o ciclo (TEL-009) com a rede interrompida e tente gerar a prévia

**Resultado esperado:**
- ✅ Carregando e Sucesso: indicador de carga seguido das linhas ou do form
- ✅ Vazio: «Nenhum registro» nas listas
- ✅ Erro de validação: «Nome é obrigatório» na TEL-008
- ✅ Erro de sistema: mensagem de erro da plataforma na TEL-009 e nenhuma carteira gerada

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## [EPIC-003] — Scoring de Liquidez (MOD-F3)

### Pré-requisitos da Épica

- Score de liquidez simulado instalado (ver Anexo C)
- Usuários demo do Anexo A criados

### [CT-MOD-F3-001] Receber a carga de score e ligar ao contribuinte [INTEGRAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: receber a carga de score e ligar ao contribuinte. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-001, RN-NOVO-F3-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Carga simulada «sim-v1» com scores de 0 a 100

**Passos:**
1. Acione a ingestão da carga simulada
2. Abra «Scores ingeridos (Simulado)»
3. Filtre um contribuinte fictício da carga

**Resultado esperado:**
- ✅ Cada score aparece ligado ao contribuinte, com tributo, versão «sim-v1», data de ingestão e status «Válido»
- ✅ O título da tela mostra «Simulado»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-002] Priorizar pelo threshold de score [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: priorizar pelo threshold de score. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-002, RN-NOVO-F3-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Versão publicada com «Usar score» e threshold 60
- 3 contribuintes que atendem valor e atraso, com scores válidos 72, 60 e 59

**Passos:**
1. Gere a prévia do ciclo 2027-02
2. Abra «Carteira segmentada»
3. Localize os 3 contribuintes

**Resultado esperado:**
- ✅ Score 72 → «Qualificada»; score 60 → «Qualificada» (igual ao threshold); score 59 → «Massificada»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-003] Operar em fallback com o modelo indisponível [INTEGRAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: operar em fallback com o modelo indisponível. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-005, RN-NOVO-F3-002 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A) para marcar a versão; depois Estar logado como demo.coordenador (Anexo A)
- Todos os scores da versão vigente marcados «Inválido» (Anexo C)

**Passos:**
1. Gere a prévia do ciclo 2027-02
2. Abra o ciclo
3. Abra «Carteira segmentada»

**Resultado esperado:**
- ✅ Todos os contribuintes ficam «Sem score»
- ✅ A carteira é formada só por valor, atraso e tributo
- ✅ «Sem score» do ciclo = total de elegíveis

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-004] Mostrar o score no resumo do dossiê [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: mostrar o score no resumo do dossiê. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F3-003, RN-NOVO-F5-003 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Caso fictício de demo.atendente com score 72

**Passos:**
1. Abra «Minha fila»
2. Abra o caso
3. Confira a seção Score

**Resultado esperado:**
- ✅ A seção Score mostra 72 e «Sem score» desmarcado

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-005] Usar a versão nova do modelo e preservar a anterior [INTEGRAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: usar a versão nova do modelo e preservar a anterior. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-004, RN-NOVO-F3-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Scores «sim-v1» válidos; carga «sim-v2» disponível

**Passos:**
1. Acione a ingestão da carga «sim-v2»
2. Gere a prévia do ciclo seguinte
3. Abra «Scores ingeridos (Simulado)» e filtre as duas versões

**Resultado esperado:**
- ✅ A prévia usa os scores «sim-v2»
- ✅ Os scores «sim-v1» continuam na lista

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-101] Validar a escala do score nos limites [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: validar a escala do score nos limites. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Carga simulada com 4 linhas de score: -1, 0, 100 e 140

**Passos:**
1. Acione a ingestão
2. Abra «Scores ingeridos (Simulado)»
3. Confira o status de cada linha

**Resultado esperado:**
- ✅ 0 e 100 ficam «Válido»
- ✅ -1 e 140 ficam «Inválido» e não são usados na qualificação

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-102] Ver a cobertura do score por tributo [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: ver a cobertura do score por tributo. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Scores de ICMS Normal, IPVA e ITCD ingeridos

**Passos:**
1. No menu «Cobrança MT», abra «Painel do score de liquidez»
2. Confira os grupos
3. Clique no grupo IPVA

**Resultado esperado:**
- ✅ O relatório mostra a quantidade de scores por tributo
- ✅ O clique abre a lista de scores de IPVA

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-103] Impedir o atendente de ver o score fora do dossiê [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: impedir o atendente de ver o score fora do dossiê. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F3-001, RF-MOD-F3-002, RF-MOD-F3-004, RF-MOD-F3-005, RF-MOD-F3-006 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)

**Passos:**
1. Abra o menu «Cobrança MT»
2. Procure «Painel do score de liquidez» e «Scores ingeridos (Simulado)»
3. Abra pelo endereço direto o painel do score

**Resultado esperado:**
- ✅ Os 2 módulos não aparecem para o atendente
- ✅ O endereço direto não mostra o relatório

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-104] Tratar carga vazia e contribuinte desconhecido [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: tratar carga vazia e contribuinte desconhecido. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-006, RF-MOD-F3-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Nenhuma carga ingerida no ambiente limpo; depois, carga com 1 documento fictício que não existe na carteira

**Passos:**
1. Abra o painel do score sem carga
2. Acione a ingestão da carga com o documento desconhecido
3. Abra «Scores ingeridos (Simulado)»

**Resultado esperado:**
- ✅ Sem carga: «Nenhum dado para exibir»
- ✅ A linha do documento desconhecido não é ligada a contribuinte e conta como rejeitada na ingestão

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-105] Impedir a edição manual do score [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: impedir a edição manual do score. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-001, RN-NOVO-F3-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra um score em «Scores ingeridos (Simulado)»
2. Tente mudar o valor do Score
3. Salve

**Resultado esperado:**
- ✅ O campo Score fica somente leitura para o coordenador

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F3-106] Estados das telas do score [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados das telas do score. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F3-001, RF-MOD-F3-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Painel do score de liquidez» (TEL-011) e «Scores ingeridos (Simulado)» (TEL-012) e observe a carga
2. Aplique filtro sem resultado nas duas
3. Abra a TEL-012 com a rede interrompida

**Resultado esperado:**
- ✅ Carregando e Sucesso: indicador de carga seguido do relatório e das linhas
- ✅ Vazio: «Nenhum dado para exibir» na TEL-011 e «Nenhum registro» na TEL-012
- ✅ Erro de sistema: mensagem de erro da plataforma

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## [EPIC-004] — Réguas de Cobrança Multicanal (MOD-F4)

### Pré-requisitos da Épica

- Canais simulados configurados: e-mail, SMS e SNE contratados; WhatsApp não contratado e com opt-in exigido (Anexo C)
- Régua IPVA do registro demo da TEL-014 com 4 etapas
- Ciclo 2027-01 publicado

### [CT-MOD-F4-001] Avançar para a etapa seguinte quando não há pagamento [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: avançar para a etapa seguinte quando não há pagamento. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-002, RF-MOD-F4-003, RN-NOVO-F4-001, RN-NOVO-F4-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício que recebeu a etapa 1 (SNE) há 10 dias e não pagou

**Passos:**
1. Acione o disparo diário da régua
2. Abra «Execução e status de disparo» e filtre o contribuinte
3. Confira a etapa 2

**Resultado esperado:**
- ✅ A etapa 2 (e-mail) foi disparada sem nenhuma confirmação manual
- ✅ A comunicação da etapa 2 está «Enviada» ou «Entregue»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-002] Encerrar a régua e marcar a origem quando o contribuinte regulariza [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: encerrar a régua e marcar a origem quando o contribuinte regulariza. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-003, RF-MOD-F4-007, RN-NOVO-F1-002, RN-NOVO-F4-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício com e-mail entregue há 12 dias (etapa 2) e etapa 3 agendada

**Passos:**
1. Registre a regularização do débito com data de hoje
2. Abra «Regularizações» e filtre o contribuinte
3. Abra «Execução e status de disparo»

**Resultado esperado:**
- ✅ Origem «Resposta à cobrança», Canal «E-mail», Instrumento «Régua» (12 dias ≤ 30 dias)
- ✅ A etapa 3 passa para «Encerrada»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-003] Pular o WhatsApp sem opt-in [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: pular o WhatsApp sem opt-in. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-005, RN-NOVO-F4-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Régua com etapa por WhatsApp vencendo hoje; contribuinte fictício sem opt-in de WhatsApp

**Passos:**
1. Acione o disparo diário
2. Abra a comunicação da etapa
3. Abra «Retorno de envio (Simulado)» como demo.admin

**Resultado esperado:**
- ✅ A comunicação fica «Pulada» com motivo «sem opt-in»
- ✅ O retorno de envio mostra «Recusado sem opt-in» e nenhum envio por WhatsApp

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-004] Sinalizar a falha de entrega e reenviar [INTEGRAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: sinalizar a falha de entrega e reenviar. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-006, RN-NOVO-F4-005, RN-NOVO-F5-005 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A) para ligar a falha; depois Estar logado como demo.coordenador (Anexo A)
- Canal e-mail com «Forçar falha» ligado

**Passos:**
1. Acione o disparo de uma etapa por e-mail
2. Abra «Execução e status de disparo» e filtre Status = Falha
3. Peça ao administrador para desligar «Forçar falha» e clique em «Reenviar» na comunicação

**Resultado esperado:**
- ✅ A comunicação aparece com «Falha» e Tentativas = 1
- ✅ Após o reenvio fica «Entregue» com Tentativas = 2
- ✅ O histórico da comunicação mostra o reenvio com autor e hora

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-005] Encaminhar à cobrança qualificada quem esgota a régua [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: encaminhar à cobrança qualificada quem esgota a régua. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-009, RN-NOVO-F4-008 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício que passou pelas 4 etapas da régua IPVA sem pagar

**Passos:**
1. Acione o disparo do dia em que vence a etapa 4
2. Publique o ciclo seguinte
3. Abra «Carteira segmentada» do ciclo seguinte

**Resultado esperado:**
- ✅ A régua do contribuinte se encerra
- ✅ No ciclo seguinte ele está entre os elegíveis à qualificada

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-101] Criar e ativar uma régua com 4 etapas [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: criar e ativar uma régua com 4 etapas. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. No menu «Cobrança MT», abra «Réguas de cobrança» e clique em «Novo»
2. Preencha Nome «Régua ITCD teste», Carteira «ITCD», Janela de atribuição 30 dias e salve
3. Inclua 4 etapas: SNE no dia 0, e-mail no dia 10, SMS no dia 20 e «Encaminhar à qualificada» no dia 30
4. Clique em «Ativar»

**Resultado esperado:**
- ✅ A régua fica salva com as 4 etapas na ordem
- ✅ A régua fica «Ativa»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-102] Exigir nome e carteira da régua [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: exigir nome e carteira da régua. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Crie uma régua sem Nome e salve
2. Preencha o Nome, deixe a Carteira vazia e salve
3. Preencha a Carteira «ICMS ST» e salve

**Resultado esperado:**
- ✅ Sem nome: «Nome é obrigatório»
- ✅ Sem carteira: «Carteira é obrigatória»
- ✅ Com os dois campos, a régua é salva

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-103] Restringir réguas e canais simulados por papel [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: restringir réguas e canais simulados por papel. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) e Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F4-001, RF-MOD-F4-002, RF-MOD-F4-003, RF-MOD-F4-004, RF-MOD-F4-005, RF-MOD-F4-006, RF-MOD-F4-007, RF-MOD-F4-008, RF-MOD-F4-009 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A); depois Estar logado como demo.atendente (Anexo A)

**Passos:**
1. Como demo.coordenador, abra «Canais de envio (Simulado)» pelo endereço direto
2. Como demo.atendente, procure no menu «Réguas de cobrança», «Execução e status de disparo» e «Consentimentos por canal»
3. Como demo.atendente, abra pelo endereço direto uma comunicação

**Resultado esperado:**
- ✅ O coordenador não vê os canais simulados (só o administrador)
- ✅ Os módulos de régua não aparecem para o atendente
- ✅ O endereço direto não mostra a comunicação ao atendente

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-104] Respeitar o opt-out no mesmo dia [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: respeitar o opt-out no mesmo dia. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-005, RN-NOVO-F4-003 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício com opt-in de SMS; etapa por SMS vence hoje às 14h

**Passos:**
1. Registre em «Consentimentos por canal» um opt-out de SMS hoje às 10h
2. Acione o disparo das 14h
3. Abra a comunicação da etapa

**Resultado esperado:**
- ✅ Nenhum SMS sai para o contribuinte
- ✅ A comunicação fica «Pulada» e o sistema tenta o próximo canal da ordem

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-105] Seguir a ordem SNE, e-mail, SMS quando um canal falha [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: seguir a ordem SNE, e-mail, SMS quando um canal falha. |
| **Perfil do testador** | Administrador do app (demo.admin) |
| **RN/RF relacionado** | RF-MOD-F4-004, RN-NOVO-F4-004 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A)
- SNE com «Forçar falha» ligado; e-mail e SMS normais

**Passos:**
1. Acione o disparo de uma etapa por SNE
2. Abra «Retorno de envio (Simulado)» filtrando a comunicação
3. Confira a ordem das tentativas

**Resultado esperado:**
- ✅ Tentativa 1: SNE → «Falha»; tentativa 2: e-mail → «Entregue»
- ✅ Nenhuma tentativa por SMS (parou no primeiro «Entregue»)

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-106] Atribuir a regularização dentro da janela de 30 dias [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: atribuir a regularização dentro da janela de 30 dias. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-007, RN-NOVO-F4-007, RN-NOVO-F4-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício L com SMS entregue em 01/02/2027; contribuinte M com SMS entregue em 01/02/2027

**Passos:**
1. Registre a regularização de L em 03/03/2027 (30 dias depois)
2. Registre a regularização de M em 04/03/2027 (31 dias depois)
3. Abra «Regularizações» e filtre L e M

**Resultado esperado:**
- ✅ L: Origem «Resposta à cobrança», Canal «SMS»
- ✅ M: Origem «Espontânea», Canal «Nenhum»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-107] Não disparar régua inativa nem para o grupo de controle [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: não disparar régua inativa nem para o grupo de controle. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-002, RN-NOVO-F4-002, RN-NOVO-F2-005 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Régua ITCD inativa; régua IPVA ativa com 30 contribuintes na etapa 1, dos quais 3 no grupo de controle

**Passos:**
1. Acione o disparo diário
2. Abra «Execução e status de disparo»
3. Filtre a régua ITCD e depois a régua IPVA

**Resultado esperado:**
- ✅ Nenhuma comunicação da régua ITCD
- ✅ 27 comunicações da régua IPVA (30 − 3 do grupo de controle)

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-108] Registrar falha depois de tentar os 3 canais [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: registrar falha depois de tentar os 3 canais. |
| **Perfil do testador** | Administrador do app (demo.admin) |
| **RN/RF relacionado** | RF-MOD-F4-004, RF-MOD-F4-006 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A)
- SNE, e-mail e SMS com «Forçar falha» ligado

**Passos:**
1. Acione o disparo de uma etapa por SNE
2. Abra a comunicação
3. Abra «Retorno de envio (Simulado)»

**Resultado esperado:**
- ✅ A comunicação fica «Falha» com Tentativas = 3
- ✅ Há 3 retornos «Falha»: SNE, e-mail e SMS

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-109] Pular WhatsApp não contratado e tentar o SNE [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: pular WhatsApp não contratado e tentar o SNE. |
| **Perfil do testador** | Administrador do app (demo.admin) |
| **RN/RF relacionado** | RF-MOD-F4-004, RN-NOVO-F4-003, RN-NOVO-F4-004 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A)
- WhatsApp com «Contratado» desmarcado; contribuinte com opt-in de WhatsApp

**Passos:**
1. Acione o disparo de uma etapa por WhatsApp
2. Abra a comunicação
3. Abra «Retorno de envio (Simulado)»

**Resultado esperado:**
- ✅ A tentativa por WhatsApp fica «Pulada»
- ✅ A tentativa seguinte sai pelo SNE

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-110] Ver a efetividade da régua por canal [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: ver a efetividade da régua por canal. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-008 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Comunicações de SNE, e-mail e SMS no ciclo

**Passos:**
1. No menu «Cobrança MT», abra «Efetividade da régua»
2. Confira os grupos por canal
3. Clique no grupo e-mail

**Resultado esperado:**
- ✅ O relatório mostra a quantidade por canal e status
- ✅ O clique abre a lista das comunicações por e-mail

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-111] Não oferecer reenvio de comunicação entregue [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: não oferecer reenvio de comunicação entregue. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-006, RN-NOVO-F4-005 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Comunicação fictícia com status «Entregue»

**Passos:**
1. Abra a comunicação
2. Procure «Reenviar»
3. Volte à lista

**Resultado esperado:**
- ✅ «Reenviar» não aparece

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-112] Não encaminhar quem pagou na última etapa [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: não encaminhar quem pagou na última etapa. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-009, RN-NOVO-F4-008 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício que regularizou durante a etapa 4

**Passos:**
1. Acione o disparo do dia em que a etapa 4 vence
2. Publique o ciclo seguinte
3. Procure o contribuinte entre os elegíveis à qualificada

**Resultado esperado:**
- ✅ O contribuinte não está entre os encaminhados

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F4-113] Estados das telas da régua [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados das telas da régua. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F4-001, RF-MOD-F4-002, RF-MOD-F4-005, RF-MOD-F4-006, RF-MOD-F4-007, RF-MOD-F4-008 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A); para TEL-018 e TEL-019 use demo.admin

**Passos:**
1. Abra TEL-013, TEL-015, TEL-016, TEL-017, TEL-018, TEL-019 e TEL-020, observe a carga e aplique filtro sem resultado
2. Abra a régua (TEL-014), apague o Nome e salve
3. Abra a TEL-015 com a rede interrompida

**Resultado esperado:**
- ✅ Carregando e Sucesso: indicador de carga seguido das linhas, do relatório ou do form
- ✅ Vazio: «Nenhum registro» nas listas e «Nenhum dado para exibir» no relatório
- ✅ Erro de validação: «Nome é obrigatório» na TEL-014
- ✅ Erro de sistema: mensagem de erro da plataforma

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## [EPIC-005] — Cobrança Qualificada (MOD-F5)

### Pré-requisitos da Épica

- Ciclo 2027-01 publicado com carteira qualificada
- Atendentes demo.atendente (Atendente A) e demo.atendente2 (Atendente B) com casos próprios (Anexo A)
- Caso do registro demo da TEL-024 atribuído a demo.atendente, com sinalização coercitiva e 3 interações

### [CT-MOD-F5-001] Distribuir casos por vínculo e equilibrar a carga [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: distribuir casos por vínculo e equilibrar a carga. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F5-001, RN-NOVO-F5-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Atendente A com 12 casos abertos; Atendente B com 8
- 1 caso novo de contribuinte já vinculado ao Atendente A e 4 casos novos sem vínculo

**Passos:**
1. No menu «Cobrança MT», abra «Distribuição da carteira qualificada»
2. Clique em «Distribuir»
3. Abra «Carga por atendente»

**Resultado esperado:**
- ✅ O caso do contribuinte vinculado vai para o Atendente A (13 casos)
- ✅ Os 4 casos sem vínculo vão para o Atendente B: 8 → 9 → 10 → 11 → 12
- ✅ Carga final: A = 13, B = 12

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-002] Ordenar a fila por score e, sem score, pelo valor [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: ordenar a fila por score e, sem score, pelo valor. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-002, RN-NOVO-F5-002, RN-NOVO-F3-002 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Fila do Atendente A com casos de score 85, 72 e 40, e 2 casos «Sem score» com R$ 90.000,00 e R$ 150.000,00 em aberto

**Passos:**
1. No menu «Cobrança MT», abra «Minha fila»
2. Confira a coluna Prioridade
3. Confira a ordem

**Resultado esperado:**
- ✅ Ordem: score 85 (prioridade 1), 72 (2), 40 (3), sem score R$ 150.000,00 (4), sem score R$ 90.000,00 (5)

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-003] Reunir débitos, parcelamentos e sinalizações no dossiê [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: reunir débitos, parcelamentos e sinalizações no dossiê. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-003, RF-MOD-F5-004, RN-NOVO-F5-003, RN-NOVO-F5-004, RN-NOVO-F1-001 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)

**Passos:**
1. Abra «Minha fila»
2. Abra o caso do registro demo da TEL-024
3. Percorra as seções e as listas relacionadas

**Resultado esperado:**
- ✅ Nível 1: listas de Débitos e Parcelamentos do contribuinte
- ✅ Nível 2: listas de Comunicações, Interações (3) e Regularizações
- ✅ Nível 3: seção Score e seção Sinalizações com «Sinalização coercitiva ativa» e a descrição

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-004] Registrar interação com autor, data e resultado [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: registrar interação com autor, data e resultado. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-005, RN-NOVO-F5-005 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Caso próprio em condução

**Passos:**
1. No dossiê, clique em «Registrar interação»
2. Escolha Tipo «Telefone», Resultado «Promessa de pagamento», descreva «Contribuinte promete pagar até 15/03/2027» e salve
3. Volte ao dossiê

**Resultado esperado:**
- ✅ A interação aparece na lista Interações com Atendente = demo.atendente, data e hora
- ✅ O histórico do caso registra a inclusão

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-005] Encerrar o caso quando o contribuinte regulariza tudo [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: encerrar o caso quando o contribuinte regulariza tudo. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F5-006, RN-NOVO-F5-006, RN-NOVO-F4-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Caso do Atendente A com 1 débito em aberto e interação registrada ontem

**Passos:**
1. Registre a regularização do débito
2. Abra o caso
3. Abra a regularização

**Resultado esperado:**
- ✅ O caso fica «Encerrado», motivo «Regularizado», com data de encerramento
- ✅ A regularização fica Origem «Resposta à cobrança», Canal «Atendimento», Instrumento «Qualificada»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-006] Mostrar ao atendente só os próprios casos [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: mostrar ao atendente só os próprios casos. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) e Atendente de Cobrança B (demo.atendente2) |
| **RN/RF relacionado** | RF-MOD-F5-007, RF-MOD-F5-002, RN-NOVO-F5-007 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A); depois logar como demo.atendente2
- Atendente A com 6 casos; Atendente B com 9

**Passos:**
1. Como Atendente A, abra «Minha fila» e conte os casos
2. Como Atendente A, abra a lista de casos pelo endereço direto, sem filtro
3. Como Atendente B, repita os 2 passos

**Resultado esperado:**
- ✅ Atendente A vê 6 casos, todos dele, nos dois caminhos
- ✅ Atendente B vê 9 casos, todos dele
- ✅ Nenhuma tela mostra total ou comparação com o outro atendente

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-101] Exigir o resultado da interação [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: exigir o resultado da interação. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-005 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Caso próprio em condução

**Passos:**
1. Clique em «Registrar interação»
2. Escolha Tipo «E-mail» e deixe Resultado vazio
3. Salve

**Resultado esperado:**
- ✅ O sistema recusa e mostra «Resultado é obrigatório»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-102] Bloquear caso de outro atendente por qualquer caminho [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: bloquear caso de outro atendente por qualquer caminho. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-007, RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F3-003, RN-NOVO-F5-007 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Endereço direto de um caso do Atendente B (Anexo B)

**Passos:**
1. Abra o endereço direto do caso do Atendente B
2. Tente registrar interação nesse caso pelo endereço de nova interação
3. Tente encerrar o caso pela lista

**Resultado esperado:**
- ✅ O caso não é mostrado
- ✅ A interação não é gravada
- ✅ O caso não é encerrado

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-103] Restringir a distribuição ao coordenador [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: restringir a distribuição ao coordenador. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) e Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F5-001, RF-MOD-F5-007 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A); depois Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Como Atendente A, procure «Distribuição da carteira qualificada» e «Carga por atendente»
2. Como coordenador, abra «Distribuição da carteira qualificada»
3. Conte os casos

**Resultado esperado:**
- ✅ Os módulos não aparecem para o atendente
- ✅ O coordenador vê os 15 casos dos dois atendentes

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-104] Sinalizar a medida coercitiva sem oferecer ação [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: sinalizar a medida coercitiva sem oferecer ação. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-004, RN-NOVO-F5-004 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Caso próprio com «Notificação CCF ativa»

**Passos:**
1. Abra o dossiê
2. Confira a seção Sinalizações
3. Procure botões de ação no caso

**Resultado esperado:**
- ✅ A seção mostra o aviso e a descrição
- ✅ Os únicos botões são «Registrar interação» e «Encerrar caso»; nenhuma ação coercitiva

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-105] Fila vazia e contribuinte sem parcelamento [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: fila vazia e contribuinte sem parcelamento. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-002, RF-MOD-F5-003 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A) com fila vazia; depois com 1 caso cujo contribuinte não tem parcelamento

**Passos:**
1. Abra «Minha fila» sem casos
2. Receba 1 caso e abra o dossiê
3. Confira a lista Parcelamentos

**Resultado esperado:**
- ✅ Fila vazia: «Nenhum registro»
- ✅ A lista Parcelamentos aparece vazia e as demais listas carregam

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-106] Manter o caso aberto com regularização parcial [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: manter o caso aberto com regularização parcial. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F5-006, RN-NOVO-F5-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Caso com 2 débitos em aberto

**Passos:**
1. Registre a regularização de só 1 débito
2. Abra o caso
3. Confira o estágio

**Resultado esperado:**
- ✅ O caso continua «Em condução»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-107] Impedir o atendente de apagar interação [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: impedir o atendente de apagar interação. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-005, RN-NOVO-F5-005 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Interação própria registrada

**Passos:**
1. Abra a interação
2. Procure «Excluir»
3. Tente excluir pela lista de interações

**Resultado esperado:**
- ✅ A exclusão não é oferecida e a interação continua no dossiê

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-108] Não criar caso para o grupo de controle [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: não criar caso para o grupo de controle. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F5-001, RN-NOVO-F2-005 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte qualificado sorteado para o grupo de controle do ciclo

**Passos:**
1. Clique em «Distribuir»
2. Abra «Distribuição da carteira qualificada»
3. Filtre o contribuinte

**Resultado esperado:**
- ✅ Nenhum caso existe para o contribuinte no ciclo

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F5-109] Estados das telas do atendimento [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados das telas do atendimento. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F5-001, RF-MOD-F5-002, RF-MOD-F5-003, RF-MOD-F5-005 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A); para TEL-021 e TEL-022 use demo.coordenador

**Passos:**
1. Abra TEL-021, TEL-022 e TEL-023, observe a carga e aplique filtro sem resultado
2. Abra o dossiê (TEL-024) e a interação (TEL-025); na interação, apague o Resultado e salve
3. Abra o dossiê com a rede interrompida

**Resultado esperado:**
- ✅ Carregando e Sucesso: indicador de carga seguido das linhas, do relatório ou do form
- ✅ Vazio: «Nenhum registro» e «Nenhum dado para exibir»
- ✅ Erro de validação: «Resultado é obrigatório» na TEL-025
- ✅ Erro de sistema: mensagem de erro da plataforma

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## [EPIC-006] — Monitoramento, KPIs e Grupo de Controle (MOD-F6)

### Pré-requisitos da Épica

- 3 ciclos fictícios encerrados (Anexo B)
- Metas fictícias cadastradas
- Regularizações fictícias com origem marcada

### [CT-MOD-F6-001] Refletir no funil as regularizações do dia [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: refletir no funil as regularizações do dia. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-001, RN-NOVO-F6-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-01 com 200 identificados, 150 notificados e 30 regularizados

**Passos:**
1. No menu «Cobrança MT», abra «Funil do crédito» filtrado pelo ciclo 2027-01
2. Registre a regularização de 1 contribuinte notificado do ciclo
3. Reabra o funil em até 60 segundos

**Resultado esperado:**
- ✅ Antes: 200, 150 e 30
- ✅ Depois: regularizado = 31, sem extração manual

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-002] Contar regularização após e-mail como resposta à cobrança [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: contar regularização após e-mail como resposta à cobrança. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-003, RN-NOVO-F4-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte fictício com e-mail entregue há 12 dias e nenhuma interação de caso

**Passos:**
1. Registre a regularização
2. Abra «Regularizações por origem e canal»
3. Abra o grupo «Resposta à cobrança / E-mail»

**Resultado esperado:**
- ✅ A regularização está no grupo «Resposta à cobrança / E-mail»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-003] Calcular o efeito incremental do ciclo [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: calcular o efeito incremental do ciclo. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-004, RN-NOVO-F6-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-06 com 180 cobrados (27 regularizados) e 20 no grupo de controle (1 regularizado)

**Passos:**
1. Encerre o ciclo 2027-06
2. Abra «Efeito incremental por ciclo»
3. Localize o ciclo

**Resultado esperado:**
- ✅ Taxa da carteira cobrada = 27 ÷ 180 × 100 = 15,0%
- ✅ Taxa do grupo de controle = 1 ÷ 20 × 100 = 5,0%
- ✅ Efeito incremental = 15,0 − 5,0 = 10,0 p.p.

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-004] Mostrar ao atendente só os próprios indicadores [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: mostrar ao atendente só os próprios indicadores. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F6-006, RN-NOVO-F5-007 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)
- Atendente A com 5 regularizações; Atendente B com 7

**Passos:**
1. No menu «Cobrança MT», abra «Meus indicadores»
2. Confira o total
3. Procure «Funil do crédito» e «Regularizações por tributo» no menu

**Resultado esperado:**
- ✅ O relatório mostra 5 regularizações, por canal, todas do Atendente A
- ✅ Os relatórios institucionais não aparecem para o atendente

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-005] Incluir IPVA e ITCD no monitoramento [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: incluir IPVA e ITCD no monitoramento. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-005, RF-MOD-F6-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Regularizações fictícias de ICMS Normal, IPVA e ITCD

**Passos:**
1. Abra «Regularizações por tributo»
2. Confira os grupos
3. Abra «Metas de KPI» e crie meta escolhendo o tributo

**Resultado esperado:**
- ✅ IPVA e ITCD aparecem como grupos próprios
- ✅ ITCD e IPVA estão entre as opções de tributo da meta

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-101] Cadastrar meta de KPI [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: cadastrar meta de KPI. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. No menu «Cobrança MT», abra «Metas de KPI» e clique em «Novo»
2. Escolha Indicador «Taxa de regularização», Tributo «ICMS Normal», Canal «Todos», Período 01/2027 e Valor 12
3. Salve

**Resultado esperado:**
- ✅ A meta aparece na lista com os valores informados

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-102] Exigir indicador e valor da meta [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: exigir indicador e valor da meta. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-002, RF-MOD-F6-005 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Crie meta sem Indicador e salve
2. Escolha o Indicador, deixe o Valor vazio e salve
3. Informe Valor 12 e salve

**Resultado esperado:**
- ✅ Sem indicador: «Indicador é obrigatório»
- ✅ Sem valor: «Valor da meta é obrigatório»
- ✅ Com os dois, a meta é salva

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-103] Avançar o funil sem voltar estágio [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: avançar o funil sem voltar estágio. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-001, RN-NOVO-F6-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte N identificado no ciclo, sem comunicação; contribuinte P notificado

**Passos:**
1. Registre a regularização de N
2. Registre nova comunicação entregue para P depois da regularização de P
3. Abra «Carteira segmentada» e confira o estágio de N e P

**Resultado esperado:**
- ✅ N passa de «Identificado» direto para «Regularizado»
- ✅ P continua «Regularizado» (o estágio não volta)

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-104] Mostrar ciclo sem grupo de controle [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: mostrar ciclo sem grupo de controle. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-004, RN-NOVO-F6-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-05 encerrado com grupo de controle = 0

**Passos:**
1. Abra «Efeito incremental por ciclo»
2. Localize o ciclo 2027-05
3. Abra o ciclo

**Resultado esperado:**
- ✅ Efeito incremental vazio
- ✅ O ciclo registra «sem grupo de controle»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-105] Mostrar relatório vazio para ciclo sem carteira [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: mostrar relatório vazio para ciclo sem carteira. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-001, RF-MOD-F6-003, RF-MOD-F6-005 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Ciclo 2027-07 sem carteira

**Passos:**
1. Abra «Funil do crédito» filtrado pelo ciclo 2027-07
2. Abra «Regularizações por origem e canal» com o mesmo filtro
3. Abra «Regularizações por tributo» com o mesmo filtro

**Resultado esperado:**
- ✅ Os 3 relatórios mostram «Nenhum dado para exibir»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-106] Exportar os insumos da estratégia [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: exportar os insumos da estratégia. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-007, RN-NOVO-T-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Funil do crédito»
2. Exporte em CSV
3. Peça ao administrador para abrir «Trilha de exportação»

**Resultado esperado:**
- ✅ O arquivo CSV sai com os estágios e as quantidades
- ✅ A trilha mostra a exportação com demo.coordenador, formato CSV e número de registros

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-107] Impedir o atendente de abrir o painel institucional [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: impedir o atendente de abrir o painel institucional. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) |
| **RN/RF relacionado** | RF-MOD-F6-001, RF-MOD-F6-002, RF-MOD-F6-003, RF-MOD-F6-004, RF-MOD-F6-005, RF-MOD-F6-007 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A)

**Passos:**
1. Abra pelo endereço direto «Funil do crédito»
2. Abra pelo endereço direto «Efeito incremental por ciclo»
3. Abra pelo endereço direto «Metas de KPI»

**Resultado esperado:**
- ✅ Nenhuma das 3 telas é mostrada ao atendente

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-F6-108] Estados das telas de monitoramento [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados das telas de monitoramento. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-F6-001, RF-MOD-F6-002, RF-MOD-F6-003, RF-MOD-F6-004, RF-MOD-F6-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A); para TEL-031 use demo.atendente

**Passos:**
1. Abra TEL-026, TEL-027, TEL-028, TEL-029, TEL-030 e TEL-031 e observe a carga
2. Aplique filtro sem resultado em cada uma
3. Abra a TEL-029 com a rede interrompida

**Resultado esperado:**
- ✅ Carregando e Sucesso: indicador de carga seguido do relatório ou das linhas
- ✅ Vazio: «Nenhum dado para exibir» nos relatórios e «Nenhum registro» nas listas
- ✅ Erro de sistema: mensagem de erro da plataforma

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## [EPIC-007] — Transversais (MOD-T)

### Pré-requisitos da Épica

- Seed fictício instalado
- Usuários demo do Anexo A criados

### [CT-MOD-T-001] Exportar lista em CSV e registrar na trilha [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: exportar lista em CSV e registrar na trilha. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-001, RN-NOVO-T-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Carteira consolidada» e filtre Tributo = ICMS Normal
2. Exporte em CSV
3. Peça ao administrador para abrir «Trilha de exportação»

**Resultado esperado:**
- ✅ O arquivo sai com os débitos filtrados
- ✅ A trilha mostra usuário demo.coordenador, a lista, formato CSV, o filtro aplicado, o número de registros e a hora

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-002] Exportar só a própria carteira e esconder a trilha [ACESSO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: exportar só a própria carteira e esconder a trilha. |
| **Perfil do testador** | Atendente de Cobrança A (demo.atendente) e Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-001, RN-NOVO-F5-007, RN-NOVO-T-001 |

**Pré-condições:**
- Estar logado como demo.atendente (Anexo A); depois Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Como Atendente A, abra «Minha fila» e exporte em PDF
2. Confira as linhas do arquivo
3. Como coordenador, abra «Trilha de exportação» pelo endereço direto

**Resultado esperado:**
- ✅ O PDF traz só os casos do Atendente A
- ✅ A trilha registra a exportação do atendente
- ✅ O coordenador não vê a trilha (só o administrador)

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-003] Combinar filtros nas listas [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: combinar filtros nas listas. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Carteira consolidada»
2. Filtre Tributo = IPVA
3. Acrescente Dias de atraso maior que 90

**Resultado esperado:**
- ✅ Primeiro filtro: só débitos de IPVA
- ✅ Filtro combinado: só débitos de IPVA com mais de 90 dias

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-004] Mostrar lista vazia para filtro sem resultado [BORDA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: mostrar lista vazia para filtro sem resultado. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Contribuintes»
2. Filtre pelo documento fictício nº 99 do Anexo B, que não existe no seed
3. Execute o filtro

**Resultado esperado:**
- ✅ A lista mostra «Nenhum registro»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-005] Abrir a visão única a partir de outros registros [PRINCIPAL]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: abrir a visão única a partir de outros registros. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-003, RN-NOVO-F1-001 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra uma comunicação e clique no Contribuinte
2. Volte, abra um caso e clique no Contribuinte
3. Confira as listas relacionadas

**Resultado esperado:**
- ✅ Nos dois caminhos abre a mesma «Visão única do contribuinte»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-006] Usar a mesma marcação de origem na régua e no atendimento [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: usar a mesma marcação de origem na régua e no atendimento. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-004, RN-NOVO-F4-006 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)
- Contribuinte Q com SMS entregue há 5 dias e sem caso; contribuinte R com caso e interação registrada há 3 dias

**Passos:**
1. Registre a regularização de Q
2. Registre a regularização de R
3. Abra «Regularizações» e filtre Q e R

**Resultado esperado:**
- ✅ Q: «Resposta à cobrança», Canal «SMS», Instrumento «Régua»
- ✅ R: «Resposta à cobrança», Canal «Atendimento», Instrumento «Qualificada»

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-007] Conferir que todo contribuinte é fictício [REGRA]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: conferir que todo contribuinte é fictício. |
| **Perfil do testador** | Administrador do app (demo.admin) |
| **RN/RF relacionado** | RF-MOD-T-003, RF-MOD-F1-002, RN-NOVO-T-002 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A)

**Passos:**
1. Abra «Contribuintes» e filtre Fictício = não
2. Abra «Staging de fontes (Simulado)» e filtre Fictício = não
3. Confira os documentos de 5 contribuintes contra a lista de documentos fictícios do seed (Anexo B)

**Resultado esperado:**
- ✅ Os 2 filtros mostram «Nenhum registro»
- ✅ Os 5 documentos constam da lista de fictícios

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-009] Aceitar só número no filtro de dias de atraso [VALIDAÇÃO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: aceitar só número no filtro de dias de atraso. |
| **Perfil do testador** | Coordenador de Cobrança (demo.coordenador) |
| **RN/RF relacionado** | RF-MOD-T-002 |

**Pré-condições:**
- Estar logado como demo.coordenador (Anexo A)

**Passos:**
1. Abra «Carteira consolidada»
2. No filtro, escolha Dias de atraso maior que e informe «noventa»
3. Corrija para 90 e execute

**Resultado esperado:**
- ✅ O valor «noventa» não é aceito e o filtro não é aplicado
- ✅ Com 90, a lista mostra só débitos com mais de 90 dias

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

### [CT-MOD-T-008] Estados da trilha de exportação [ESTADO]

| Campo | Conteúdo |
|-------|----------|
| **Objetivo** | Confirmar: estados da trilha de exportação. |
| **Perfil do testador** | Administrador do app (demo.admin) |
| **RN/RF relacionado** | RF-MOD-T-001 |

**Pré-condições:**
- Estar logado como demo.admin (Anexo A)

**Passos:**
1. Abra «Trilha de exportação» (TEL-033) e observe a carga
2. Aplique filtro sem resultado
3. Abra com a rede interrompida

**Resultado esperado:**
- ✅ Carregando e Sucesso: indicador de carga seguido das linhas
- ✅ Vazio: «Nenhum registro»
- ✅ Erro de sistema: mensagem de erro da plataforma

**Resultado obtido:** _(em branco na emissão)_

**Em caso de falha:** tirar o print da tela com a data e a hora visíveis, anotar o usuário e o registro usados e abrir o relato para a SQUAD Cobrança citando o número do caso.

---

## Matriz de cenários por funcionalidade

Mínimo por requisito: fluxo principal, validação, regra (um por regra aplicável), acesso e borda. Categoria sem caso próprio traz a justificativa.

| RF | PRINCIPAL | VALIDAÇÃO | REGRA | ACESSO | BORDA | ESTADO |
|----|-----------|-----------|-------|--------|-------|--------|
| RF-MOD-F1-001 | CT-MOD-F1-001 | CT-MOD-F1-104 | CT-MOD-F1-005 | CT-MOD-F1-105 | CT-MOD-F1-106 | CT-MOD-F1-110 |
| RF-MOD-F1-002 | — (caminho feliz em CT-MOD-F1-002, CT-MOD-F1-101) | CT-MOD-F1-104 | CT-MOD-F1-002, CT-MOD-F1-101, CT-MOD-T-007 | CT-MOD-F1-105 | — (documento vazio coberto em CT-MOD-F1-104) | CT-MOD-F1-110 |
| RF-MOD-F1-003 | — (caminho feliz em CT-MOD-F1-003) | — (atualização vem da fonte; não há campo digitado pelo usuário) | CT-MOD-F1-003 | CT-MOD-F1-105 | CT-MOD-F1-108 | — |
| RF-MOD-F1-004 | — (caminho feliz em CT-MOD-F1-004, CT-MOD-F1-110) | — (status vem da fonte) | CT-MOD-F1-004 | CT-MOD-F1-105 | CT-MOD-F1-107 | CT-MOD-F1-110 |
| RF-MOD-F1-005 | CT-MOD-F1-102 | — (tela de consulta (atendente não edita a visão única)) | CT-MOD-F1-101 | CT-MOD-F1-105 | — (contribuinte sem comunicações coberto pelo estado Vazio de CT-MOD-F1-110) | CT-MOD-F1-110 |
| RF-MOD-F1-006 | — (caminho feliz em CT-MOD-F1-006) | — (troca de fonte sem entrada do usuário) | CT-MOD-F1-006 | CT-MOD-F1-105 | CT-MOD-F1-109 | — |
| RF-MOD-F1-007 | CT-MOD-F1-103 | — (tela de consulta) | CT-MOD-F1-005 | CT-MOD-F1-105 | CT-MOD-F1-106 | CT-MOD-F1-110 |
| RF-MOD-F2-001 | CT-MOD-F2-101 | CT-MOD-F2-102 | CT-MOD-F2-001 | CT-MOD-F2-103 | — (limites cobertos em CT-MOD-F2-102) | CT-MOD-F2-113 |
| RF-MOD-F2-002 | — (caminho feliz em CT-MOD-F2-002, CT-MOD-F2-104) | — (campos da versão validados em CT-MOD-F2-102) | CT-MOD-F2-104 | CT-MOD-F2-103 | — (versão substituída coberta em CT-MOD-F2-002) | CT-MOD-F2-002, CT-MOD-F2-113 |
| RF-MOD-F2-003 | CT-MOD-F2-105 | CT-MOD-F2-106 | CT-MOD-F2-001, CT-MOD-F2-005, CT-MOD-F2-111 | CT-MOD-F2-103 | CT-MOD-F2-110 | CT-MOD-F2-113 |
| RF-MOD-F2-004 | — (caminho feliz em CT-MOD-F2-003, CT-MOD-F2-107) | — (sorteio sem entrada do usuário) | CT-MOD-F2-003, CT-MOD-F2-107, CT-MOD-F2-108 | CT-MOD-F2-103 | CT-MOD-F2-110 | — |
| RF-MOD-F2-005 | CT-MOD-F2-112 | — (threshold validado em CT-MOD-F2-102) | CT-MOD-F2-004 | CT-MOD-F2-103 | — (score igual ao threshold coberto em CT-MOD-F3-002) | — |
| RF-MOD-F2-006 | CT-MOD-F2-105 | CT-MOD-F2-106 | — (regras do RF cobertas em CT-MOD-F2-001) | CT-MOD-F2-103 | CT-MOD-F2-109 | CT-MOD-F2-113 |
| RF-MOD-F3-001 | — (caminho feliz em CT-MOD-F3-001, CT-MOD-F3-105) | CT-MOD-F3-101 | CT-MOD-F3-105 | CT-MOD-F3-103 | CT-MOD-F3-104 | CT-MOD-F3-106 |
| RF-MOD-F3-002 | — (caminho feliz em CT-MOD-F3-002) | CT-MOD-F2-102 | CT-MOD-F3-002 | CT-MOD-F3-103 | — (threshold 0 e 100 cobertos em CT-MOD-F2-102) | — |
| RF-MOD-F3-003 | CT-MOD-F3-004 | — (tela de consulta) | — (RF sem regra própria) | CT-MOD-F5-102 | — (caso sem score coberto em CT-MOD-F5-002) | — |
| RF-MOD-F3-004 | — (caminho feliz em CT-MOD-F3-005) | — (carga sem entrada do usuário) | — (regras do RF cobertas em CT-MOD-F2-004, CT-MOD-F3-105, CT-MOD-F5-002) | CT-MOD-F3-103 | — (versão nova toda inválida coberta por CT-MOD-F3-003) | — |
| RF-MOD-F3-005 | — (caminho feliz em CT-MOD-F3-003) | — (processamento sem entrada do usuário) | — (regras do RF cobertas em CT-MOD-F2-004, CT-MOD-F5-002) | CT-MOD-F3-103 | — (20% sem score coberto pelo seed de CT-MOD-F2-004) | — |
| RF-MOD-F3-006 | CT-MOD-F3-102 | — (relatório de consulta) | — (regras do RF cobertas em CT-MOD-F3-105) | CT-MOD-F3-103 | CT-MOD-F3-104 | CT-MOD-F3-106 |
| RF-MOD-F4-001 | CT-MOD-F4-101 | CT-MOD-F4-102 | — (regras do RF cobertas em CT-MOD-F4-001) | CT-MOD-F4-103 | — (régua sem etapas não dispara (CT-MOD-F4-107, régua inativa)) | CT-MOD-F4-113 |
| RF-MOD-F4-002 | — (caminho feliz em CT-MOD-F4-001, CT-MOD-F4-113) | — (disparo sem entrada do usuário) | CT-MOD-F4-001 | CT-MOD-F4-103 | CT-MOD-F4-107 | CT-MOD-F4-113 |
| RF-MOD-F4-003 | — (caminho feliz em CT-MOD-F4-001, CT-MOD-F4-002) | — (escalonamento sem entrada do usuário) | CT-MOD-F4-001, CT-MOD-F4-002 | CT-MOD-F4-103 | — (última etapa coberta em CT-MOD-F4-005 e CT-MOD-F4-112) | — |
| RF-MOD-F4-004 | — (caminho feliz em CT-MOD-F4-105) | — (fallback sem entrada do usuário) | CT-MOD-F4-105 | CT-MOD-F4-103 | CT-MOD-F4-108, CT-MOD-F4-109 | — |
| RF-MOD-F4-005 | — (caminho feliz em CT-MOD-F4-003, CT-MOD-F4-104) | — (situação do consentimento é lista fechada (opt-in/opt-out)) | CT-MOD-F4-003, CT-MOD-F4-104 | CT-MOD-F4-103 | — (opt-out no mesmo dia coberto em CT-MOD-F4-104) | CT-MOD-F4-113 |
| RF-MOD-F4-006 | — (caminho feliz em CT-MOD-F4-004, CT-MOD-F4-113) | — (reenvio é um botão, sem campo) | — (regras do RF cobertas em CT-MOD-F5-004, CT-MOD-F5-107) | CT-MOD-F4-103 | CT-MOD-F4-108, CT-MOD-F4-111 | CT-MOD-F4-113 |
| RF-MOD-F4-007 | — (caminho feliz em CT-MOD-F4-002, CT-MOD-F4-106) | — (marcação calculada pelo sistema) | CT-MOD-F4-002, CT-MOD-F4-106 | CT-MOD-F4-103 | — (limite de 30 e 31 dias coberto em CT-MOD-F4-106) | CT-MOD-F4-113 |
| RF-MOD-F4-008 | CT-MOD-F4-110 | — (relatório de consulta) | — (regras do RF cobertas em CT-MOD-F4-002, CT-MOD-F4-106, CT-MOD-F5-005) | CT-MOD-F4-103 | — (sem comunicações coberto pelo estado Vazio de CT-MOD-F4-113) | CT-MOD-F4-113 |
| RF-MOD-F4-009 | — (caminho feliz em CT-MOD-F4-005) | — (encaminhamento sem entrada do usuário) | CT-MOD-F4-005 | CT-MOD-F4-103 | CT-MOD-F4-112 | — |
| RF-MOD-F5-001 | — (caminho feliz em CT-MOD-F5-001, CT-MOD-F5-109) | — (distribuição é um botão, sem campo) | CT-MOD-F5-001 | CT-MOD-F5-103 | CT-MOD-F5-108 | CT-MOD-F5-109 |
| RF-MOD-F5-002 | — (caminho feliz em CT-MOD-F5-002, CT-MOD-F5-109) | — (fila de consulta) | CT-MOD-F5-002 | CT-MOD-F5-006 | CT-MOD-F5-105 | CT-MOD-F5-109 |
| RF-MOD-F5-003 | CT-MOD-F5-003 | — (dossiê de consulta) | — (regras do RF cobertas em CT-MOD-F1-101) | CT-MOD-F5-102 | CT-MOD-F5-105 | CT-MOD-F5-109 |
| RF-MOD-F5-004 | CT-MOD-F5-003 | — (sinalização vem da fonte) | CT-MOD-F5-104 | CT-MOD-F5-102 | — (caso sem sinalização coberto pelo estado do dossiê em CT-MOD-F5-109) | — |
| RF-MOD-F5-005 | — (caminho feliz em CT-MOD-F5-004, CT-MOD-F5-107) | CT-MOD-F5-101 | CT-MOD-F5-004, CT-MOD-F5-107 | CT-MOD-F5-102 | — (resultado vazio coberto em CT-MOD-F5-101) | CT-MOD-F5-109 |
| RF-MOD-F5-006 | — (caminho feliz em CT-MOD-F5-005) | — (encerramento calculado pelo sistema) | CT-MOD-F5-005 | CT-MOD-F5-102 | CT-MOD-F5-106 | — |
| RF-MOD-F5-007 | — (o caminho feliz do requisito é a fila só com os próprios casos, verificado em CT-MOD-F5-006) | — (regra de visibilidade, sem campo) | — (RF sem regra própria) | CT-MOD-F5-006, CT-MOD-F5-102, CT-MOD-F5-103 | — (acesso direto coberto em CT-MOD-F5-102) | — |
| RF-MOD-F6-001 | CT-MOD-F6-001 | — (relatório de consulta) | CT-MOD-F6-103 | CT-MOD-F6-107 | CT-MOD-F6-105 | CT-MOD-F6-108 |
| RF-MOD-F6-002 | CT-MOD-F6-005, CT-MOD-F6-101 | CT-MOD-F6-102 | — (regras do RF cobertas em CT-MOD-F4-002, CT-MOD-F4-106, CT-MOD-F5-005) | CT-MOD-F6-107 | — (meta sem valor coberta em CT-MOD-F6-102) | CT-MOD-F6-108 |
| RF-MOD-F6-003 | — (caminho feliz em CT-MOD-F6-002, CT-MOD-F6-108) | — (relatório de consulta) | CT-MOD-F6-002 | CT-MOD-F6-107 | CT-MOD-F6-105 | CT-MOD-F6-108 |
| RF-MOD-F6-004 | — (caminho feliz em CT-MOD-F6-003, CT-MOD-F6-108) | — (cálculo sem entrada do usuário) | CT-MOD-F6-003 | CT-MOD-F6-107 | CT-MOD-F6-104 | CT-MOD-F6-108 |
| RF-MOD-F6-005 | CT-MOD-F6-005 | CT-MOD-F6-102 | — (regras do RF cobertas em CT-MOD-F4-002, CT-MOD-F4-106, CT-MOD-F5-005) | CT-MOD-F6-107 | CT-MOD-F6-105 | — |
| RF-MOD-F6-006 | — (caminho feliz em CT-MOD-F6-108) | — (relatório de consulta) | — (RF sem regra própria) | CT-MOD-F6-004 | — (atendente sem regularizações coberto pelo estado Vazio de CT-MOD-F6-108) | CT-MOD-F6-108 |
| RF-MOD-F6-007 | CT-MOD-F6-106 | — (exportação usa o componente padrão da plataforma) | — (regras do RF cobertas em CT-MOD-F6-003) | CT-MOD-F6-107 | — (relatório vazio coberto em CT-MOD-F6-105) | — |
| RF-MOD-T-001 | CT-MOD-T-001 | — (exportação usa o componente padrão da plataforma) | — (RF sem regra própria) | CT-MOD-T-002 | — (exportação de lista vazia coberta pelo estado Vazio de CT-MOD-T-008) | CT-MOD-T-008 |
| RF-MOD-T-002 | CT-MOD-T-003 | CT-MOD-T-009 | — (RF sem regra própria) | — (filtro vale igual para todos os papéis nas listas que cada papel já vê) | CT-MOD-T-004 | CT-MOD-F1-110 |
| RF-MOD-T-003 | CT-MOD-F1-102, CT-MOD-T-005 | — (navegação por link) | CT-MOD-T-007 | CT-MOD-F1-105 | — (contribuinte de outra carteira coberto em CT-MOD-F1-105) | — |
| RF-MOD-T-004 | — (caminho feliz em CT-MOD-T-006) | — (marcação calculada pelo sistema) | CT-MOD-T-006 | — (marcação calculada pelo sistema; o acesso às regularizações está em CT-MOD-F5-006 e CT-MOD-F6-004) | — (regularização sem origem calculável coberta em CT-MOD-F4-106) | — |

---

## Cobertura RN × Caso

| RN | Descrição curta | Casos que cobrem | Status |
|----|-----------------|------------------|--------|
| RN-NOVO-F1-001 | Visão única do contribuinte por documento | CT-MOD-F1-001, CT-MOD-F1-101, CT-MOD-F5-003, CT-MOD-T-005 | ✅ Coberta |
| RN-NOVO-F1-002 | Regularização dentro do ciclo encerra a abordagem | CT-MOD-F1-003, CT-MOD-F1-108, CT-MOD-F4-002 | ✅ Coberta |
| RN-NOVO-F1-003 | Troca de MPI por Big Data sem ruptura da carteira | CT-MOD-F1-006, CT-MOD-F1-109 | ✅ Coberta |
| RN-NOVO-F1-004 | Documento inválido é rejeitado e registrado | CT-MOD-F1-002, CT-MOD-F1-104 | ✅ Coberta |
| RN-NOVO-F1-005 | Falha numa fonte não trava as demais | CT-MOD-F1-005 | ✅ Coberta |
| RN-NOVO-F1-006 | Ciclo mensal de consolidação e qualificação (premissa) | CT-MOD-F1-001, CT-MOD-F2-111 | ✅ Coberta |
| RN-NOVO-F1-007 | Parcela em atraso põe o parcelamento em risco | CT-MOD-F1-004, CT-MOD-F1-107 | ✅ Coberta |
| RN-NOVO-F2-001 | Versão publicada do critério é imutável | CT-MOD-F2-002, CT-MOD-F2-104 | ✅ Coberta |
| RN-NOVO-F2-002 | Ciclo publicado guarda a versão aplicada | CT-MOD-F2-002, CT-MOD-F2-109 | ✅ Coberta |
| RN-NOVO-F2-003 | Segmentação entre massificada e qualificada | CT-MOD-F2-001 | ✅ Coberta |
| RN-NOVO-F2-004 | Desempate: maior débito, depois o mais antigo (premissa) | CT-MOD-F2-005 | ✅ Coberta |
| RN-NOVO-F2-005 | Grupo de controle sorteado por ciclo e fora das ações | CT-MOD-F2-003, CT-MOD-F2-107, CT-MOD-F4-107, CT-MOD-F5-108 | ✅ Coberta |
| RN-NOVO-F2-006 | Grupo de controle de 10% dos elegíveis (premissa) | CT-MOD-F2-003, CT-MOD-F2-108 | ✅ Coberta |
| RN-NOVO-F3-001 | Score como variável com threshold configurável | CT-MOD-F2-112, CT-MOD-F3-002 | ✅ Coberta |
| RN-NOVO-F3-002 | Fallback sem score | CT-MOD-F2-004, CT-MOD-F3-003, CT-MOD-F5-002 | ✅ Coberta |
| RN-NOVO-F3-003 | O modelo de score é da UFMT | CT-MOD-F3-001, CT-MOD-F3-005, CT-MOD-F3-105 | ✅ Coberta |
| RN-NOVO-F4-001 | Escalonamento conforme o comportamento | CT-MOD-F4-001 | ✅ Coberta |
| RN-NOVO-F4-002 | Disparo sem confirmação manual em lote | CT-MOD-F4-001, CT-MOD-F4-107 | ✅ Coberta |
| RN-NOVO-F4-003 | Opt-in vigente para canal com consentimento | CT-MOD-F4-003, CT-MOD-F4-104, CT-MOD-F4-109 | ✅ Coberta |
| RN-NOVO-F4-004 | Ordem de fallback de canal: SNE, e-mail, SMS (premissa) | CT-MOD-F4-105, CT-MOD-F4-109 | ✅ Coberta |
| RN-NOVO-F4-005 | Falha de entrega é sinalizada e pode ser reenviada | CT-MOD-F4-004, CT-MOD-F4-111 | ✅ Coberta |
| RN-NOVO-F4-006 | Toda regularização é marcada pela origem | CT-MOD-F4-002, CT-MOD-F4-106, CT-MOD-F5-005, CT-MOD-F6-002, CT-MOD-T-006 | ✅ Coberta |
| RN-NOVO-F4-007 | Janela de atribuição de 30 dias | CT-MOD-F4-106 | ✅ Coberta |
| RN-NOVO-F4-008 | Esgotou a régua sem regularizar vai para a qualificada | CT-MOD-F4-005, CT-MOD-F4-112 | ✅ Coberta |
| RN-NOVO-F5-001 | Distribuição por vínculo, balanceamento e prioridade | CT-MOD-F5-001 | ✅ Coberta |
| RN-NOVO-F5-002 | Ordem da fila do atendente | CT-MOD-F5-002 | ✅ Coberta |
| RN-NOVO-F5-003 | Dossiê em 3 níveis (premissa) | CT-MOD-F3-004, CT-MOD-F5-003 | ✅ Coberta |
| RN-NOVO-F5-004 | Dossiê sinaliza medida coercitiva, não executa | CT-MOD-F5-003, CT-MOD-F5-104 | ✅ Coberta |
| RN-NOVO-F5-005 | Ação relevante registrada com ator, data e resultado | CT-MOD-F4-004, CT-MOD-F5-004, CT-MOD-F5-107 | ✅ Coberta |
| RN-NOVO-F5-006 | Regularização encerra o caso | CT-MOD-F5-005, CT-MOD-F5-106 | ✅ Coberta |
| RN-NOVO-F5-007 | Atendente vê só a própria carteira | CT-MOD-F5-006, CT-MOD-F5-102, CT-MOD-F6-004, CT-MOD-T-002 | ✅ Coberta |
| RN-NOVO-F6-001 | Efeito incremental do ciclo | CT-MOD-F6-003, CT-MOD-F6-104 | ✅ Coberta |
| RN-NOVO-F6-002 | Estágios do funil do crédito | CT-MOD-F6-001, CT-MOD-F6-103 | ✅ Coberta |
| RN-NOVO-T-001 | Toda exportação vai para a trilha | CT-MOD-F6-106, CT-MOD-T-001, CT-MOD-T-002 | ✅ Coberta |
| RN-NOVO-T-002 | Só dado fictício no ambiente do piloto | CT-MOD-T-007 | ✅ Coberta |

---

## Sumário de Execução (preenchido na homologação)

| Épica | Casos | Aprovados | Reprovados | Bloqueados |
|-------|-------|-----------|------------|------------|
| EPIC-001 | 16 | | | |
| EPIC-002 | 18 | | | |
| EPIC-003 | 11 | | | |
| EPIC-004 | 18 | | | |
| EPIC-005 | 15 | | | |
| EPIC-006 | 13 | | | |
| EPIC-007 | 9 | | | |

---

## Anexo A — Usuários de Teste

| Usuário | Papel | Uso |
|---------|-------|-----|
| demo.coordenador | Coordenador de Cobrança (`x_2326104_cob.coordenador`) | parametrização, ciclos, réguas, distribuição, KPIs |
| demo.atendente | Atendente de Cobrança A (`x_2326104_cob.atendente`) | fila, dossiê, interações, indicadores próprios |
| demo.atendente2 | Atendente de Cobrança B (`x_2326104_cob.atendente`) | segundo atendente para os casos de carteira isolada; criado pelo seed regenerado no Plan |
| demo.admin | Administrador do app (`x_2326104_cob.admin`) | telas simuladas, interruptores de falha, trilha de exportação |

Os usuários não têm senha; o acesso no ambiente de demonstração é por personificação feita pelo administrador da instância.

## Anexo B — Dados Pré-necessários

Todos os registros são gerados pelo seed fictício do app. Nenhum documento real é usado.

| Dado | Origem no seed | Usado em |
|------|----------------|----------|
| Contribuintes fictícios «Comércio Alfa Ltda (fictício)» e «Transportes Beta Ltda (fictício)» | registros nomeados do seed | EPIC-001, EPIC-004 |
| Documento fictício inválido nº 1 (dígito verificador errado) | inconsistência plantada (SIM-03) | CT-MOD-F1-002 |
| Documento fictício nº 99, ausente do seed | escolhido fora da lista de documentos fictícios gerados | CT-MOD-T-004 |
| Débito sobreposto entre CCF e SNE | inconsistência plantada (SIM-03) | CT-MOD-F1-101 |
| Critério «ICMS alto valor» versões 1 (substituída) e 2 (publicada) | registro demo da TEL-008 | EPIC-002 |
| Ciclos 2027-01 (publicado), 2027-02 (prévia) e 3 ciclos encerrados | registros demo do seed | EPIC-002, EPIC-006 |
| Régua IPVA com 4 etapas | registro demo da TEL-014 | EPIC-004 |
| Caso em condução com sinalização coercitiva e 3 interações | registro demo da TEL-024 | EPIC-005 |
| Casos dos atendentes A e B e endereço direto de um caso do B | seed regenerado no Plan | CT-MOD-F5-006, CT-MOD-F5-102 |
| Valores dos cenários (contribuintes A a R, scores, datas) | preparados pelo administrador antes do caso, sobre registros do seed | casos que os citam |

## Anexo C — Ambiente

| Item | Configuração |
|------|--------------|
| Instância | `dev493801`, app Cobrança MT reinstalado do repositório |
| Score de liquidez (SIM-01) | escala 0 a 100; 20% dos contribuintes sem score válido; versão «sim-v1»; marcar a versão como «Inválido» simula o modelo indisponível |
| Canais (SIM-02) | e-mail, SMS e SNE contratados; WhatsApp não contratado e com opt-in exigido; «Forçar falha» liga a falha de cada canal |
| Fontes de débito (SIM-03) | staging com as 5 fontes; «Falha simulada» liga a falha de uma fonte |
| Navegador | navegador de mesa em 1440×900 |
