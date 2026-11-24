# Regras de Negócio — Cobrança MT (piloto 2.6 Cobrança, SEFAZ-MT)

Status: draft
Última atualização: 2026-11-24
Total de RN: 0 legado · 35 novo produto (5 com origem «premissa»)
Fonte: context-map.md (F-xxx), outputs/explore/especificacao-funcional.md (RN-001 a RN-017), inputs/premissas-ficticias.md (P1–P5)

Este documento lista as regras que o app Cobrança MT aplica. Cada regra diz a condição e o que o sistema faz, de onde veio (fato `F-xxx` do `context-map.md` ou premissa do piloto) e quais requisitos a usam. Regra com origem «premissa» usa um valor que o plano deixou em aberto e que vale até a validação com a Coordenação de Cobrança.

As regras marcadas com **fio condutor** ganham lógica completa no app (regra de servidor, controle de acesso e teste automatizado), conforme `inputs/fio-condutor.md`.

## Seção A — Regras do Legado

Não se aplica: o projeto não tem sistema legado (kickoff do Explore, `legado=Não`). As 17 regras do Explore (RN-001 a RN-017) foram promovidas para a Seção B, e a linha **Origem** de cada bloco cita o fato que as carrega.

## Seção B — Regras do Novo Produto

<!-- id: br-new -->


### Domínio: Ingestão e carteira consolidada (MOD-F1)

#### RN-NOVO-F1-001: Visão única do contribuinte por documento — fio condutor 4

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | F-027 (Explore RN-001); F-021; F-169 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Derivação |
| **Enunciado** | SE chegam débitos de fontes diferentes com o mesmo CPF ou CNPJ ENTÃO o sistema liga todos ao mesmo contribuinte e marca como sobrepostos os débitos que aparecem em mais de uma fonte |
| **Algoritmo** | 1. Limpar o documento (só dígitos) e conferir o dígito verificador. 2. Procurar o contribuinte pelo documento; se não existir, criar com `ficticio = true` no ambiente piloto. 3. Ligar o débito ao contribuinte encontrado ou criado. 4. Se outro débito do mesmo contribuinte, tributo e vencimento já veio de outra fonte, marcar os dois como `sobreposto = true`. 5. Somar os débitos em aberto no campo «valor em aberto» do contribuinte, contando uma vez só cada grupo de débitos sobrepostos. |
| **Exceções** | Qual fonte prevalece na sobreposição fica em aberto (GAP-006); o v0 só marca. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-F1-005, RF-MOD-T-003, RF-MOD-F5-003 |
| **Justificativa** | Sem visão única, o mesmo contribuinte recebe cobrança duplicada de fontes diferentes. |

#### RN-NOVO-F1-002: Regularização dentro do ciclo encerra a abordagem

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | F-028 (Explore RN-002); F-022 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Gatilho |
| **Enunciado** | SE um débito muda para regularizado ou parcelado durante o ciclo ENTÃO o sistema encerra as comunicações pendentes daquele contribuinte e não agenda novas etapas da régua |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Débito parcelado volta a ser cobrado se o parcelamento for rompido (RN-NOVO-F1-007). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-003, RF-MOD-F4-003, RF-MOD-F5-006 |
| **Justificativa** | Evita cobrar quem já pagou. |

#### RN-NOVO-F1-003: Troca de MPI por Big Data sem ruptura da carteira

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | F-029 (Explore RN-012); F-025; F-146 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Restrição |
| **Enunciado** | SE a fonte MPI é substituída pela Big Data ENTÃO os débitos já consolidados continuam ligados aos mesmos contribuintes e a carteira do ciclo em curso não muda |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Cronograma da transição em aberto (GAP-015); no v0 a origem `mpi_bigdata` é única. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-006 |
| **Justificativa** | Plano exige transição P2.2 sem ruptura. |

#### RN-NOVO-F1-004: Documento inválido é rejeitado e registrado

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | F-030 (Explore RN-014); F-021 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Restrição |
| **Enunciado** | SE o CPF ou CNPJ de uma linha da fonte tem dígito verificador inválido ENTÃO o sistema não grava o débito e registra a linha no log de rejeições com o motivo «documento inválido» |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-002, RF-MOD-F1-007 |
| **Justificativa** | Débito sem dono confiável contamina a carteira. |

#### RN-NOVO-F1-005: Falha numa fonte não trava as demais

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | F-020 (Explore RF-101); F-026; F-169 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Restrição |
| **Enunciado** | SE uma das 5 fontes falha durante a consolidação ENTÃO o sistema conclui a consolidação das outras fontes e registra a fonte com falha na execução de sincronização |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-001, RF-MOD-F1-007 |
| **Justificativa** | Critério CT-MOD-F1-005 do plano (degradação segura). |

#### RN-NOVO-F1-006: Ciclo mensal de consolidação e qualificação (premissa)

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | premissa P1 — F-159; F-148 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Fato |
| **Enunciado** | O ciclo de consolidação e de qualificação é mensal: um ciclo por mês de referência |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Valor a validar com a Coordenação de Cobrança (GAP-001). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-001, RF-MOD-F2-003, RF-MOD-F2-004 |
| **Justificativa** | O plano deixa a frequência em aberto; a premissa permite seed e testes. |

#### RN-NOVO-F1-007: Parcela em atraso põe o parcelamento em risco

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F1 |
| **Origem** | F-023 (Explore RF-104); F-028 |
| **Domínio** | Ingestão e carteira consolidada |
| **Tipo** | Gatilho |
| **Enunciado** | SE um parcelamento tem 1 ou mais parcelas em atraso ENTÃO o sistema marca o parcelamento como «em risco» e liga o alerta de risco |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Parcelamento rompido segue a regra do órgão de origem; o app só mostra o status recebido. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-004 |
| **Justificativa** | Critério CT-MOD-F1-004 do plano. |


### Domínio: Qualificação da carteira (MOD-F2)

#### RN-NOVO-F2-001: Versão publicada do critério é imutável — fio condutor 1

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F2 |
| **Origem** | F-037 (Explore RN-003); F-032; F-141; F-171 |
| **Domínio** | Qualificação da carteira |
| **Tipo** | Restrição |
| **Enunciado** | SE uma versão do critério de qualificação está publicada ENTÃO ninguém altera seus parâmetros; para mudar, o coordenador cria uma nova versão em rascunho, com número seguinte e ligada à anterior |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Nenhuma: vale também para o administrador do app (INF-004). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-001, RF-MOD-F2-002 |
| **Justificativa** | Fio condutor 1: a carteira de cada ciclo precisa ser reproduzível pela versão que a formou. |

#### RN-NOVO-F2-002: Ciclo publicado guarda a versão aplicada — fio condutor 1

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F2 |
| **Origem** | F-037 (Explore RN-003); F-032; F-171 |
| **Domínio** | Qualificação da carteira |
| **Tipo** | Restrição |
| **Enunciado** | SE um ciclo de qualificação é publicado ENTÃO ele guarda a versão do critério usada, e publicar uma versão nova depois não muda a carteira nem a versão desse ciclo |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-002, RF-MOD-F2-006 |
| **Justificativa** | Critério CT-MOD-F2-002: a carteira existente mantém a versão original. |

#### RN-NOVO-F2-003: Segmentação entre massificada e qualificada

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F2 |
| **Origem** | F-038 (Explore RN-004); F-033 |
| **Domínio** | Qualificação da carteira |
| **Tipo** | Derivação |
| **Enunciado** | SE o contribuinte atende a todos os critérios da versão publicada ENTÃO ele entra na carteira qualificada; SE não atende ENTÃO entra na massificada |
| **Algoritmo** | 1. Ler a versão publicada do critério ligada ao ciclo. 2. Para cada contribuinte com débito em aberto, somar o valor em aberto do tributo do critério (ou de todos, se o tributo for «todos»). 3. Calcular o maior atraso em dias entre os débitos em aberto. 4. Se o contribuinte está na lista de exclusão do critério (contumaz, quando marcado), deixar fora da carteira do ciclo. 5. Se valor ≥ valor mínimo E atraso ≥ atraso mínimo E (score ≥ threshold, quando o critério usa score e o contribuinte tem score válido), marcar «qualificada»; senão, «massificada». 6. Gravar uma linha de carteira segmentada por contribuinte com o motivo da decisão. |
| **Exceções** | Sem score válido aplica-se RN-NOVO-F3-002. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-001, RF-MOD-F2-003, RF-MOD-F2-006 |
| **Justificativa** | Critério CT-MOD-F2-001: ICMS, valor ≥ R$ 500 mil e atraso ≥ 90 dias forma a carteira qualificada. |

#### RN-NOVO-F2-004: Desempate: maior débito, depois o mais antigo (premissa)

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F2 |
| **Origem** | premissa P2 — F-160; F-149 |
| **Domínio** | Qualificação da carteira |
| **Tipo** | Derivação |
| **Enunciado** | SE a carteira qualificada passa da capacidade do ciclo ou dois contribuintes empatam na prioridade ENTÃO vence o de maior débito em aberto e, empatando no valor, o de débito mais antigo |
| **Algoritmo** | 1. Ordenar os contribuintes pelo valor em aberto, do maior para o menor. 2. No empate de valor, ordenar pelo vencimento mais antigo. 3. Persistindo o empate, ordenar pelo número do registro (ordem estável). |
| **Exceções** | Valor a validar com a Coordenação de Cobrança (GAP-002). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-003 |
| **Justificativa** | O plano deixa o desempate em aberto. |

#### RN-NOVO-F2-005: Grupo de controle sorteado por ciclo e fora das ações — fio condutor 2

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F2 |
| **Origem** | F-039 (Explore RN-009); F-034; F-142; F-172 |
| **Domínio** | Qualificação da carteira |
| **Tipo** | Derivação |
| **Enunciado** | SE um ciclo é publicado ENTÃO o sistema sorteia o grupo de controle entre os elegíveis, marca esses contribuintes como «controle» e nenhuma régua, comunicação ou caso é criado para eles naquele ciclo |
| **Algoritmo** | 1. Contar os elegíveis do ciclo (massificada + qualificada antes do sorteio). 2. Gerar e gravar a semente do sorteio no ciclo. 3. Calcular o tamanho do grupo: arredondar para cima o percentual da versão do critério × elegíveis (RN-NOVO-F2-006). 4. Sortear com a semente os contribuintes do grupo, sem reposição. 5. Mudar o segmento dos sorteados para «controle» e gravar as quantidades no ciclo. 6. Bloquear criação de comunicação e de caso para contribuinte em «controle» no ciclo. |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-004, RF-MOD-F4-002, RF-MOD-F5-001, RF-MOD-F6-004 |
| **Justificativa** | Fio condutor 2: sem grupo de controle limpo não há efeito incremental. |

#### RN-NOVO-F2-006: Grupo de controle de 10% dos elegíveis (premissa)

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F2 |
| **Origem** | premissa P3 — F-161; F-149 |
| **Domínio** | Qualificação da carteira |
| **Tipo** | Fato |
| **Enunciado** | O percentual padrão do grupo de controle é 10% dos elegíveis de cada ciclo, gravado na versão do critério |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Valor a validar com a Coordenação de Cobrança (GAP-003). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-004, RF-MOD-F6-004 |
| **Justificativa** | O plano deixa o tamanho do grupo em aberto. |


### Domínio: Score de liquidez (MOD-F3)

#### RN-NOVO-F3-001: Score como variável com threshold configurável

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F3 |
| **Origem** | F-046 (Explore RN-013); F-041 |
| **Domínio** | Score de liquidez |
| **Tipo** | Restrição |
| **Enunciado** | SE a versão do critério marca «usar score» ENTÃO só entra na carteira qualificada o contribuinte com score válido maior ou igual ao threshold da versão |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Contribuinte sem score válido segue RN-NOVO-F3-002. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F3-002, RF-MOD-F2-005 |
| **Justificativa** | Plano: score como variável de priorização com threshold. |

#### RN-NOVO-F3-002: Fallback sem score — fio condutor 3

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F3 |
| **Origem** | F-046 (Explore RN-013); F-044; F-140; F-173 |
| **Domínio** | Score de liquidez |
| **Tipo** | Derivação |
| **Enunciado** | SE o contribuinte não tem score válido (ausente, inválido ou do modelo marcado indisponível) ENTÃO a segmentação usa só os critérios determinísticos e o contribuinte é marcado «sem score» |
| **Algoritmo** | 1. Procurar o score do contribuinte na última ingestão com status «válido». 2. Se não há score válido, marcar `sem_score = true` na carteira segmentada e no contribuinte. 3. Aplicar a segmentação ignorando a condição de score (valor, atraso, tributo e exclusões continuam). 4. Somar os marcados no total «sem score» do ciclo. |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F2-005, RF-MOD-F3-005, RF-MOD-F5-002 |
| **Justificativa** | Fio condutor 3: o score da UFMT não tem data; a qualificação não pode parar. |

#### RN-NOVO-F3-003: O modelo de score é da UFMT

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F3 |
| **Origem** | F-047 (Explore RN-015); F-043 |
| **Domínio** | Score de liquidez |
| **Tipo** | Fato |
| **Enunciado** | O desenvolvimento e a recalibração do modelo de score são da UFMT, por convênio; o produto recebe, guarda e usa o score, sem calcular |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F3-001, RF-MOD-F3-004 |
| **Justificativa** | Delimita o escopo do produto. |


### Domínio: Réguas multicanal (MOD-F4)

#### RN-NOVO-F4-001: Escalonamento conforme o comportamento

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-057 (Explore RN-005); F-050 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Gatilho |
| **Enunciado** | SE o prazo de uma etapa da régua termina sem pagamento ENTÃO o sistema executa a ação sem resposta da etapa (renotificar, intensificar ou encaminhar à qualificada); SE há regularização ENTÃO encerra a régua |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-002, RF-MOD-F4-003 |
| **Justificativa** | Critérios CT-MOD-F4-001 e CT-MOD-F4-002. |

#### RN-NOVO-F4-002: Disparo sem confirmação manual em lote

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-049 (Explore RF-402); F-143 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Restrição |
| **Enunciado** | O disparo das comunicações de cada etapa é automático; nenhuma etapa espera confirmação manual de lote |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Contribuinte do grupo de controle não recebe comunicação (RN-NOVO-F2-005). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-002 |
| **Justificativa** | Plano: disparo sem confirmação manual em lote. |

#### RN-NOVO-F4-003: Opt-in vigente para canal com consentimento

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-058 (Explore RN-006); F-052; F-133 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Restrição |
| **Enunciado** | SE o canal exige consentimento (WhatsApp) e o contribuinte não tem opt-in vigente ENTÃO o sistema pula o canal sem enviar e marca a comunicação como «pulada»; SE o contribuinte registra opt-out ENTÃO nenhum envio novo sai por aquele canal a partir do registro |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-004, RF-MOD-F4-005 |
| **Justificativa** | Critério CT-MOD-F4-003. |

#### RN-NOVO-F4-004: Ordem de fallback de canal: SNE, e-mail, SMS (premissa)

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | premissa P4 — F-162; F-151 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Derivação |
| **Enunciado** | SE o envio por um canal falha ou o canal é pulado ENTÃO o sistema tenta o próximo canal da ordem SNE → e-mail → SMS, uma vez cada |
| **Algoritmo** | 1. Começar pelo canal da etapa. 2. Se o retorno é «falha» ou o canal foi pulado, passar ao próximo canal da ordem SNE → e-mail → SMS que ainda não foi tentado nesta etapa. 3. Parar no primeiro «entregue» ou quando os três canais foram tentados. 4. Registrar cada tentativa como retorno de envio. |
| **Exceções** | Valor a validar com a Coordenação de Cobrança (GAP-004). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-004 |
| **Justificativa** | O plano deixa a ordem em aberto. |

#### RN-NOVO-F4-005: Falha de entrega é sinalizada e pode ser reenviada

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-053 (Explore RF-406) |
| **Domínio** | Réguas multicanal |
| **Tipo** | Gatilho |
| **Enunciado** | SE o canal devolve falha de entrega ENTÃO a comunicação fica com status «falha», conta a tentativa e passa a aceitar reenvio pelo coordenador |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-006 |
| **Justificativa** | Critério CT-MOD-F4-004. |

#### RN-NOVO-F4-006: Toda regularização é marcada pela origem

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-059 (Explore RN-008); F-054; F-082 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Derivação |
| **Enunciado** | SE um débito é regularizado ENTÃO o sistema grava a origem: «resposta à cobrança» com canal e instrumento, quando houve comunicação ou atendimento na janela de atribuição; «espontânea», quando não houve |
| **Algoritmo** | 1. Procurar a última comunicação entregue ao contribuinte ou interação de caso nos 30 dias anteriores à data da regularização (RN-NOVO-F4-007). 2. Se achou interação de caso, origem = resposta à cobrança, canal = atendimento, instrumento = qualificada. 3. Senão, se achou comunicação, origem = resposta à cobrança, canal = canal da comunicação, instrumento = régua. 4. Senão, origem = espontânea, canal = nenhum, instrumento = nenhum. 5. Copiar a marca de grupo de controle do contribuinte no ciclo. |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-007, RF-MOD-F5-006, RF-MOD-F6-003, RF-MOD-T-004 |
| **Justificativa** | Base da medição de efeito da cobrança. |

#### RN-NOVO-F4-007: Janela de atribuição de 30 dias

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-060 (Explore RN-016); F-135 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Fato |
| **Enunciado** | A janela de atribuição entre comunicação e regularização é de 30 dias corridos |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Modelo de atribuição a confirmar (GAP-007). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-007, RF-MOD-F6-003 |
| **Justificativa** | Valor assumido no plano. |

#### RN-NOVO-F4-008: Esgotou a régua sem regularizar vai para a qualificada

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F4 |
| **Origem** | F-038 (Explore RN-004); F-056; F-144 |
| **Domínio** | Réguas multicanal |
| **Tipo** | Gatilho |
| **Enunciado** | SE o contribuinte termina a última etapa da régua sem regularizar ENTÃO ele fica elegível à cobrança qualificada no próximo ciclo e a régua se encerra |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F4-009 |
| **Justificativa** | Plano: quem esgota a régua vai para a qualificada. |


### Domínio: Cobrança qualificada (MOD-F5)

#### RN-NOVO-F5-001: Distribuição por vínculo, balanceamento e prioridade

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | F-068 (Explore RN-007); F-061 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Derivação |
| **Enunciado** | SE um caso da carteira qualificada fica sem atendente ENTÃO o sistema atribui ao atendente já vinculado ao contribuinte; sem vínculo, ao atendente com menos casos abertos |
| **Algoritmo** | 1. Ordenar os casos sem atendente pela prioridade (RN-NOVO-F5-002). 2. Para cada caso, se o contribuinte já tem atendente vinculado, atribuir a ele. 3. Senão, atribuir ao atendente com menos casos em aberto; no empate, ao de menor número de registro. 4. Gravar o atendente também no contribuinte (vínculo). |
| **Exceções** | Sem teto de capacidade no v0 (GAP-010). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-001 |
| **Justificativa** | Plano: distribuição automática, sem planilha. |

#### RN-NOVO-F5-002: Ordem da fila do atendente

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | F-062 (Explore RF-502); F-046 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Derivação |
| **Enunciado** | A fila do atendente ordena os casos por score, do maior para o menor; casos sem score vêm depois, ordenados pelos critérios determinísticos |
| **Algoritmo** | 1. Separar casos com score válido e casos «sem score». 2. Ordenar os com score pelo score decrescente; empate pelo valor em aberto decrescente. 3. Ordenar os sem score pelo valor em aberto decrescente e, no empate, pelo débito mais antigo. 4. Gravar a posição no campo prioridade (1 = primeiro). |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-002 |
| **Justificativa** | Critério CT-MOD-F5-002. |

#### RN-NOVO-F5-003: Dossiê em 3 níveis (premissa)

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | premissa P5 — F-163; F-153 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Fato |
| **Enunciado** | O dossiê do caso tem 3 níveis: (1) débitos e parcelamentos; (2) comunicações, interações e regularizações; (3) score e sinalizações coercitivas |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Níveis efetivos a validar (GAP-005). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-003, RF-MOD-F5-004, RF-MOD-F3-003 |
| **Justificativa** | O plano deixa os níveis em aberto. |

#### RN-NOVO-F5-004: Dossiê sinaliza medida coercitiva, não executa — fio condutor 4

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | F-071 (Explore RN-017); F-064; F-003 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Restrição |
| **Enunciado** | SE há notificação coercitiva ativa em outra coordenadoria ENTÃO o dossiê mostra a sinalização e a descrição, e o app não oferece nenhuma ação coercitiva |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Fonte das sinalizações em aberto (GAP-016). |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-004 |
| **Justificativa** | Medidas coercitivas e PGE ficam fora do sistema. |

#### RN-NOVO-F5-005: Ação relevante registrada com ator, data e resultado

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | F-069 (Explore RN-010); F-065 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Restrição |
| **Enunciado** | SE alguém registra interação, encerra caso ou reenvia comunicação ENTÃO o sistema grava quem fez, quando e o resultado, e esse registro não pode ser apagado pelo atendente |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-005, RF-MOD-F5-006, RF-MOD-F4-006 |
| **Justificativa** | Rastreio da operação de cobrança. |

#### RN-NOVO-F5-006: Regularização encerra o caso

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | F-066 (Explore RF-506); F-028 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Gatilho |
| **Enunciado** | SE o contribuinte do caso regulariza todos os débitos em aberto ENTÃO o sistema encerra o caso com motivo «regularizado», data de encerramento e a origem da regularização |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Regularização parcial mantém o caso aberto. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-006 |
| **Justificativa** | Critério CT-MOD-F5-005. |

#### RN-NOVO-F5-007: Atendente vê só a própria carteira — fio condutor 5

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F5 |
| **Origem** | F-070 (Explore RN-011); F-067; F-016; F-145; F-175 |
| **Domínio** | Cobrança qualificada |
| **Tipo** | Restrição |
| **Enunciado** | SE o usuário tem só o papel de atendente ENTÃO ele vê, lista, reporta e exporta apenas casos, contribuintes, interações e regularizações em que é o atendente; números de outros atendentes nunca aparecem; o coordenador vê tudo |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | Administrador do app vê tudo para manutenção. |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F5-007, RF-MOD-F6-006, RF-MOD-T-001, RF-MOD-F1-005 |
| **Justificativa** | Fio condutor 5: visão não comparativa exigida no plano. |


### Domínio: Monitoramento e KPIs (MOD-F6)

#### RN-NOVO-F6-001: Efeito incremental do ciclo

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F6 |
| **Origem** | F-039 (Explore RN-009); F-075; F-142 |
| **Domínio** | Monitoramento e KPIs |
| **Tipo** | Derivação |
| **Enunciado** | O efeito incremental do ciclo é a taxa de regularização da carteira cobrada menos a taxa de regularização do grupo de controle do mesmo ciclo, em pontos percentuais |
| **Algoritmo** | 1. Contar os contribuintes cobrados do ciclo (massificada + qualificada) e quantos regularizaram até o fim do ciclo. 2. Taxa cobrada = regularizados cobrados ÷ cobrados × 100. 3. Contar os contribuintes do grupo de controle e quantos regularizaram no mesmo período. 4. Taxa controle = regularizados do controle ÷ controle × 100. 5. Efeito incremental = taxa cobrada − taxa controle, com 1 casa decimal. 6. Se o grupo de controle tem zero contribuintes, não calcular e mostrar «sem grupo de controle». |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F6-004, RF-MOD-F6-007 |
| **Justificativa** | Critério CT-MOD-F6-003. |

#### RN-NOVO-F6-002: Estágios do funil do crédito

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-F6 |
| **Origem** | F-072 (Explore RF-601); F-153 |
| **Domínio** | Monitoramento e KPIs |
| **Tipo** | Derivação |
| **Enunciado** | Cada contribuinte do ciclo está em um estágio do funil: identificado, notificado ou regularizado |
| **Algoritmo** | 1. Ao entrar na carteira segmentada do ciclo, o estágio é «identificado». 2. Na primeira comunicação entregue ou interação registrada no ciclo, passa a «notificado». 3. Na regularização, passa a «regularizado», mesmo sem ter sido notificado. 4. O estágio nunca volta. |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F6-001 |
| **Justificativa** | Plano: funil identificado → notificado → regularizado. |


### Domínio: Transversais (MOD-T)

#### RN-NOVO-T-001: Toda exportação vai para a trilha

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-T |
| **Origem** | F-079 (Explore RF-901) |
| **Domínio** | Transversais |
| **Tipo** | Gatilho |
| **Enunciado** | SE alguém exporta uma lista ou relatório em CSV ou PDF ENTÃO o sistema grava na trilha quem exportou, de qual tela, com qual filtro, quantos registros e quando |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-T-001 |
| **Justificativa** | Plano: exportação com registro em trilha de auditoria. |

#### RN-NOVO-T-002: Só dado fictício no ambiente do piloto

| Campo | Conteúdo |
|-------|----------|
| **Módulo** | MOD-T |
| **Origem** | F-089; F-125; F-170 |
| **Domínio** | Transversais |
| **Tipo** | Restrição |
| **Enunciado** | SE um registro de pessoa é gravado no ambiente do piloto ENTÃO ele tem `ficticio = true` e documento listado entre os fictícios gerados; dado real de contribuinte não entra no app, no repositório nem no backlog |
| **Algoritmo** | — (não é Derivação) |
| **Exceções** | — |
| **Conflitos** | — |
| **Vinculada a** | RF-MOD-F1-001, RF-MOD-F1-002, RF-MOD-T-003 |
| **Justificativa** | Sigilo fiscal (art. 198 do CTN) e LGPD. |

---

<!-- id: br-conflicts -->

## Tabela de conflitos cruzados

| RN A | RN B | Tema do conflito | Resolução |
|------|------|------------------|-----------|
| RN-NOVO-F3-001 | RN-NOVO-F3-002 | Critério com «usar score» e contribuinte sem score | Decidido: sem score válido vale o fallback (RN-NOVO-F3-002); o contribuinte não é excluído pela condição de score |
| RN-NOVO-F2-005 | RN-NOVO-F4-002 | Disparo automático × contribuinte do grupo de controle | Decidido: o grupo de controle não recebe comunicação; o disparo automático vale só para a carteira cobrada |
| RN-NOVO-F4-008 | RN-NOVO-F2-005 | Quem esgota a régua × sorteio do controle no ciclo seguinte | Decidido: quem esgotou a régua entra como elegível e pode ser sorteado para o controle |
| RN-NOVO-F5-007 | RN-NOVO-T-001 | Exportação pelo atendente | Decidido: a exportação respeita o mesmo filtro de carteira e registra a trilha |

---

<!-- id: br-open-questions -->

## Questões em aberto

| QA | RNs envolvidas | Descrição | Sugestão de tratamento |
|----|-----------------|------------|-------------------------|
| QA-01 | RN-NOVO-F1-006, RN-NOVO-F2-004, RN-NOVO-F2-006, RN-NOVO-F4-004, RN-NOVO-F5-003 | Valores de premissa (P1–P5) a validar com a Coordenação de Cobrança | já registrados em GAP-001 a GAP-005 |
| QA-02 | RN-NOVO-F1-001 | Qual fonte prevalece na sobreposição | já registrado em GAP-006 |
| QA-03 | RN-NOVO-F4-006, RN-NOVO-F4-007 | Modelo de atribuição causal por canal | já registrado em GAP-007 |
