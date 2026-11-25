# Teoria de cobrança tributária aplicada ao UX do app de cobrança (SEFAZ-MT 2.6)

Insumo para o redesenho. Só conceitos, método e números agregados. Caminhos abreviados: `K` = `/config/workspace/10-elogroup/cobranca/knowledge-cob`, `MT` = `/config/workspace/10-elogroup/sefaz-mt/knowledge-mt/trusted/transversal/execucao`.

Fontes principais:
- `K/refined/visao.md` (JTBD, RN, IM, personas)
- `K/trusted/mt/0114` (Curso Cobrança Inteligente, Módulo 1: massificada)
- `K/trusted/mt/0115` (Módulo 2: qualificada)
- `K/trusted/mt/0113` (Deck Estratégia Digital)
- `K/trusted/ba/0077` (Manual de Cobrança Integrada)
- `K/trusted/mt/0087` e `0090` (reuniões de trabalho SEFAZ-MT: grupo de controle, operação atual)
- `K/trusted/ms/0170` e `0128` (réguas e operação assistida)
- `K/cursos/modulo-cobranca-ativa-am/` (ligação ativa, EAST/nudge)

---

## 1. O ciclo da cobrança (modelo mental do domínio)

Duas camadas se sobrepõem. **A vida do crédito** é fixa por lei (RN-01): constituição → cobrança administrativa (SEFAZ) → inscrição em dívida ativa (PGE) → cobrança judicial (PGE). Nenhuma fase é saltada. **O ciclo de trabalho da SEFAZ** é o que o app opera, e se repete.

| # | Etapa | Decisão que acontece | Quem decide |
|---|---|---|---|
| 0 | Ingestão e qualificação de dados | Qual contato é válido? Qual crédito entra na carteira elegível? Excluir suspenso, prescrito, parcelado em dia, inativo (RN-08, 25, 29, 32) | Sistema (regras); analista de dados cuida da qualidade |
| 1 | Classificação (rating A/B/C/D, score de propensão 0–1, um modelo por fase do crédito) | Qual a recuperabilidade natural deste crédito? | Modelo/regras; gestor aprova critérios e limiar |
| 2 | Segmentação e priorização (VER = propensão × montante; CAPAG em 24 meses) | Massificada ou qualificada? Quem entra na fila de ligação? Quem fica só na régua? (RN-18, 19, 36) | Gestor define cortes; sistema ranqueia |
| 3 | Prevenção (comunicação antes do vencimento, RN-14) | Qual lembrete, em que dia, por qual canal (com aceite LGPD)? | Gestor configura a régua; motor executa |
| 4 | Régua massificada (postura utilitária → explicativa → ameaçadora, RN-13/17; teto de 1 contato/dia/canal, RN-38) | A régua segue sozinha ou precisa de exceção? A variante A é melhor que a B? | Motor decide por padrão; operador faz exceção fundamentada (RN-44); gestor promove variante (RN-52) |
| 5 | Cobrança ativa (ligação, rating A/B e maior VER, RN-36) | Quem ligo hoje, com que contexto, qual saída ofereço (parcelamento, transação)? | Analista/cobrador |
| 6 | Cobrança qualificada (seleção → dossiê → análise → negociação → instrumento coercitivo → monitoramento; ciclo de ~4 meses, RN-34) | Qual instrumento é proporcional ao caso? Estou pronto para aplicá-lo (dossiê feito, RN-24)? | Auditor/gestor de caso; ações com efeito jurídico imediato exigem aprovação humana (RN-53) |
| 7 | Regularização (pagamento ou parcelamento com 1ª cota paga) | Pagou? Então a cobrança encerra imediatamente (RN-09) | Evento de pagamento; sistema encerra o fluxo |
| 8 | Monitoramento de parcelamento | Há risco de rompimento? Rompeu (3 parcelas ou 90 dias)? O crédito volta à régua (RN-05) | Sistema alerta; analista intervém |
| 9 | Encaminhamento à PGE (controle de legalidade, valor mínimo, dispensa; RN-47, 11, 12) | O crédito está apto (não prescrito, exigibilidade ativa, acima do mínimo)? | Sistema pré-valida; procurador decide |
| 10 | Medição e ajuste | Funcionou? Qual régua/canal/ação teve efeito além do orgânico? Ajustar critério, régua ou modelo | Gestor, em ritos mensal/trimestral/semestral |

O ciclo fecha: o resultado da etapa 10 realimenta 1, 2 e 4. A cobrança massificada não tem ciclo formal (apuração contínua, mensal por régua; RN-35). A qualificada tem ciclo de duração configurável.

---

## 2. Princípios de método que viram requisito de UX

| Princípio | O que a teoria diz | Requisito de UX | Fonte |
|---|---|---|---|
| Segmentar antes de agir | Duas estratégias: massificada (volume, baixo custo, autorregularização) e qualificada (grandes devedores/contumazes, caso a caso). Um contribuinte não está nas duas ao mesmo tempo (RN-18). Segregação por rating: A/B → massa/call center; C/D → investigação | A primeira pergunta de qualquer lista é "em qual estratégia este caso está". Estratégia visível em todo registro; não misturar as duas na mesma tabela | `K/trusted/mt/0114`, `0113`; `K/trusted/ba/0077`; `visao.md` RN-18, RN-36 |
| Ação proporcional ao perfil | Gradação de instrumentos (notificação → parcelamento → dívida ativa → protesto → penhora/execução). Instrumento coercitivo só após dossiê (RN-24) | A tela de caso oferece só as ações cabíveis ao estágio e perfil; ação mais grave exige o dossiê concluído e fundamentação | `K/trusted/mt/0115`; `visao.md` RN-24, RN-AI-12 |
| Priorizar por valor × propensão | VER = probabilidade × montante; na qualificada só o 1º quartil por VER (e CAPAG); sem VER, ordena por montante ou antiguidade (RN-AI-08) | A fila de trabalho já vem ordenada e justificada (mostra o porquê do rank: rating, valor, prazo de prescrição) | `K/trusted/mt/0115`; `visao.md` RN-AI-08 |
| Régua escalonada, sem saltar etapas | Postura utilitária → consciente → explicativa → ameaçadora; sequência obrigatória (RN-13, RN-17); exceção manual só tipada e fundamentada (RN-44) | Mostrar a régua como linha do tempo do caso (onde está, o que veio, o que vem). Intervir = ação explícita com campo de justificativa obrigatório | `K/trusted/mt/0114`; `visao.md` RN-13/17/44; `K/trusted/ms/0170` |
| Comunicação com atrito mínimo (design comportamental / EAST) | Facilitar (Easy), personalizar (Attractive), prova social, momento certo (Timely); CTA único; estrutura em 3 níveis, F-pattern; celebrar pequenas vitórias. Treinamento comportamental de agentes subiu a quitação de 36% para 43% em estudo citado | O mesmo princípio vale para a UI do servidor: um próximo passo claro por tela, informação na ordem em que a decisão a usa | `K/cursos/modulo-cobranca-ativa-am/minuta-aula.md`, `pesquisa/RP-01`; `K/trusted/ms/0170` |
| Medir efeito incremental com grupo de controle | Parte dos elegíveis (~500 sorteados, sem outliers) fica sem ação para separar efeito da cobrança de regularização espontânea; o controle não pode receber cobrança em massa. Pagamento atribuído ao último acionamento em até 30 dias; sem acionamento, é "orgânico" | Marcar visivelmente quem é controle (não cobrar por engano). Painéis separam recuperado atribuído × orgânico | `K/trusted/mt/0087`, `0090`; `visao.md` §Métricas |
| Iterar por teste A/B | Variantes simultâneas em subconjuntos disjuntos, janela mínima, comparação com teste estatístico, gestor promove, continua ou encerra; variantes arquivadas, não apagadas (RN-52). Hoje as réguas são otimizadas "no feeling" | Tela de comparação de variantes com decisão em 3 saídas (promover, continuar, encerrar) | `visao.md` RN-52, JTBD-09; `K/refined/Requisitos/ab-test-reguas.md` |
| Preventivo antes do corretivo | Ao menos uma comunicação pré-vencimento (RN-14); custo menor que o pós-vencimento | O painel do gestor mostra a cobertura preventiva, não só a carteira em atraso | `visao.md` RN-14 |
| Encerrar por regularização, na hora | Pagamento extingue o fluxo imediatamente (RN-09); parcelado em dia sai da massificada (RN-07); suspensão é tipificada e com validade (RN-43) | O caso regularizado sai da fila do analista sem ação dele; suspensão pede tipo (canal/ação) e prazo | `visao.md` RN-07, 09, 43 |
| Dossiê antes da decisão qualificada | 9 seções (perfil, benefícios, atividade, sócios, contato, histórico, débitos por grupo econômico, patrimônio, ações anteriores), montado automaticamente e revisável | Uma visão 360 do caso e do grupo econômico, sem abrir telas paralelas | `K/trusted/ba/0077`; `visao.md` RN-24, RN-45 |
| IA sugere, humano decide | Sugestão de instrumento e de casos é revisável; promoção de caso e evolução de régua exigem aprovação (RN-AI-12/13/15) | Toda sugestão do sistema vem com motivo e botões aceitar/ajustar/recusar | `visao.md` RN-AI-12, 13, 15 |
| Conformidade embutida | Aceite LGPD por canal antes do disparo (RN-16, 51); dados mascarados em canais digitais (RN-41); trilha de auditoria | O sistema bloqueia o canal sem aceite e mostra o motivo, em vez de depender da memória do operador | `visao.md` RN-16, 41, 51 |
| Governança em ritos | Mensal (acompanhamento das quatro frentes), trimestral (ajuste de réguas), semestral (planejamento) | Visões por periodicidade de rito, com o mesmo cálculo padronizado | `K/trusted/ba/0077`; `K/trusted/mt/0115` |

Arranjo de telas já adotado no repositório (pode ser reaproveitado): 11 arquétipos (A1 Painel, A2 Lista/Fila, A4 Detalhe, A6 Linha do tempo, A7 Fila de aprovação, A8 Editor visual, A9 Comparação, A10 Dossiê, entre outros) em `K/refined/telas-comuns.md`.

---

## 3. Perguntas que cada usuário precisa responder na tela

**Analista / cobrador operacional**
- Quem eu cobro hoje e por quê? (rank por VER, rating, prazo)
- Qual o contexto deste contribuinte em 10 segundos? (débitos, contatos, histórico, grupo econômico)
- Já houve contato? Por qual canal, com que resultado? Em que ponto da régua ele está?
- Qual a próxima melhor ação e posso aplicá-la (parcelar, ligar, mandar link, suspender, escalar)?
- Quais contatos são válidos e há aceite para o canal?
- O que mudou desde ontem? (pagou, parcelou, rompeu, contestou)
- Quais casos meus estão parados ou vencendo prazo (ciclo, prescrição)?

**Gestor de cobrança**
- A régua está funcionando? Em que etapa se perde gente?
- Quanto foi recuperado esta semana/mês contra o elegível, e quanto é efeito da cobrança (versus orgânico)?
- Onde está o risco: carteira perto da prescrição, parcelamentos prestes a romper, créditos sem contato válido?
- Quem tem carga demais ou de menos? Como redistribuo a lista?
- A variante nova vence a atual? Promovo?
- Estou cobrindo todos os elegíveis (acionamento) e a que custo por real recuperado?
- O modelo de rating ainda acerta?

**Procurador PGE / legalidade**
- Quais créditos chegaram aptos e quais bloqueados por legalidade (prescrição, exigibilidade suspensa, valor mínimo)?
- O que a SEFAZ já tentou antes de me enviar o caso (histórico administrativo)?
- Por onde começo (priorização objetiva para ajuizamento)?

**Auditor / conformidade**
- Quem fez o quê, quando, com qual fundamentação? Houve intervenção manual sem justificativa?
- Algum disparo ocorreu sem aceite ou fora do teto de frequência?

**Analista de dados / dono do modelo**
- A acurácia e o recall por faixa A/B/C/D estão dentro do limiar? Há data leakage ou viés de faixa?

---

## 4. Métricas centrais (para painéis)

**North Star: Taxa de Recuperação de Cobrança (TRC)** = valor recuperado atribuído / valor elegível. Atribuição pelo último acionamento nos 30 dias anteriores ao pagamento; sem acionamento, o pagamento é orgânico e fica fora do numerador. Cortes nativos: mês, régua, tributo, tipo de crédito, rating, canal, instrumento, cobrador. Referências de baseline de outros estados: cerca de 2% sem régua estruturada, cerca de 5% com réguas automatizadas, meta interna de um estado próxima de 9% (`visao.md` §Métricas). Referência de resultado de régua (PE): 5,15% de retorno em até 30 dias, com variação grande por régua (de 6,8% a 24,6% nos subgrupos citados em `K/trusted/mt/0115`).

**Métricas de entrada (IM)**
- IM-01 cobertura de acionamento (% de elegíveis que receberam ao menos um contato)
- IM-02 conversão por etapa da régua, por rating
- IM-03 proporção da carteira em risco de prescrição (faixa de 3 a 5 anos)
- IM-04 e IM-06 acurácia e precision/recall do rating por faixa
- IM-05 cobertura de contato válido
- IM-07 custo por unidade recuperada

**Guard-rails (não podem piorar)**
- taxa de prescrição
- taxa de rompimento de parcelamento
- % de cobranças anuladas ou contestadas com êxito
- tempo médio até a primeira resposta do contribuinte
- satisfação do servidor operador (proxy de usabilidade)
- % de intervenções manuais sobre o total de ações
- latência da régua (do gatilho ao disparo)

**Operação qualificada**
- retorno por faixa de VER/CAPAG
- casos por etapa do ciclo (seleção, dossiê, negociação, instrumento, monitoramento)
- casos com ciclo estourado
- regularização por estratégia (hoje a SEFAZ-MT mede foto inicial × foto final do mês e a meta mensal de regularização, mas não mede o tempo entre o primeiro contato e a regularização; `K/trusted/mt/0090`)

---

## 5. Implicações diretas para o redesenho

1. **A tela inicial do analista deve ser "Minha fila de hoje"**: lista única ordenada por VER, com rating, valor, estágio na régua, motivo do rank e próxima ação sugerida. Nenhuma navegação por tabela de entidades como ponto de partida.
2. **O registro do caso deve ser uma visão 360 em uma tela** (dossiê, contatos válidos e aceites, débitos, linha do tempo de ações e régua, pagamentos), com a ação principal sempre visível. Substitui o hábito de abrir várias tabelas para montar o contexto.
3. **A estratégia (massificada ou qualificada) e o estágio do ciclo aparecem como primeiro elemento do cabeçalho de todo caso**, e as duas estratégias não dividem a mesma lista.
4. **O ciclo qualificado vira um fluxo guiado de etapas** (seleção → dossiê → análise → negociação → instrumento → monitoramento), com barra de progresso, prazo do ciclo e bloqueio do instrumento coercitivo até o dossiê estar completo.
5. **A régua é mostrada como linha do tempo visual por caso** (passado, ponto atual, próximos disparos, postura de cada etapa), e a intervenção manual é um único fluxo curto com tipo de exceção e justificativa obrigatória.
6. **Ações em um clique no contexto do caso**: registrar contato e resultado (lista de resultados padronizada, sem texto livre como padrão), agendar retorno, gerar condição de parcelamento, suspender (com tipo e validade), escalar à qualificada, encaminhar à PGE. Sem sair da tela.
7. **O sistema encerra e remove da fila o que regularizou**, avisa quando um parcelamento está em risco de romper e quando um caso muda de estado, e traz o que mudou desde a última visita.
8. **A tela inicial do gestor é um painel de decisão, não de estoque**: TRC com atribuído × orgânico, conversão por etapa da régua, cobertura de acionamento, carteira perto da prescrição, parcelamentos em risco e carga por cobrador, cada número com drill-down até o caso.
9. **Distribuição e redistribuição de listas em um fluxo visual** (carga por cobrador, arrastar ou atribuir em lote por critério), no lugar de planilhas por atendente.
10. **A/B de régua e grupo de controle como objetos de primeira classe**: tela de comparação de variantes com o veredito em três saídas (promover, continuar, encerrar); marca de "grupo de controle" visível no caso, com bloqueio de ação.
11. **Fila de aprovação para tudo que tem efeito jurídico ou sugestão de IA**: cada item traz proposta, motivo e predicados verificados, com decisão e fundamentação em uma tela (arquétipo A7).
12. **Conformidade como guarda automática**: canal sem aceite aparece desabilitado com o motivo; teto de frequência e mascaramento aplicados pelo sistema; trilha de auditoria acessível pela linha do tempo do caso.
13. **Configuração da régua por editor visual (fluxo com nós)**, com pré-visualização do texto da mensagem e da postura em cada etapa, publicação com versão e teste em variante antes de virar padrão.
14. **Menos telas, mais arquétipos**: reaproveitar os 11 arquétipos (fila, detalhe, linha do tempo, aprovação, comparação, dossiê, painel) e reduzir as tabelas cruas a uma "visão de dados" secundária para exportação e consulta.
15. **Instrumentar a própria UX com as métricas de saúde da teoria**: % de intervenções manuais e satisfação do servidor operador entram como indicadores do produto, com a pergunta de satisfação dentro do app.
16. **Dois níveis de leitura em toda lista**: resumo para decidir (rank, valor, estágio, próxima ação) e detalhe sob demanda; o que não ajuda a decisão do momento fica recolhido.

*(Os itens 1 a 16 são inferências de UX sobre a teoria acima; a teoria em si está nas seções 1 a 4.)*
