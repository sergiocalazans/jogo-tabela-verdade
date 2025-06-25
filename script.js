// ===================================================================================
// SEÇÃO 1: GERAÇÃO DE TODAS AS QUESTÕES POSSÍVEIS
// Em vez de gerar uma questão aleatória a cada vez, vamos gerar TODAS as
// combinações possíveis para cada nível. Isso garante que podemos selecionar
// 5 questões únicas para cada partida.
// ===================================================================================

/**
 * Converte um valor booleano (true/false) para a sua representação textual ('V'/'F').
 * @param {boolean} v - O valor booleano a ser convertido.
 * @returns {string} 'V' se a entrada for true, 'F' se for false.
 */
function boolParaTexto(v) {
  // Operador ternário: uma forma curta de if-else.
  // Se 'v' for verdadeiro, retorna 'V'. Caso contrário, retorna 'F'.
  return v ? 'V' : 'F';
}

/**
 * Gera um objeto contendo arrays com todas as questões possíveis para cada nível.
 * @returns {object} Um objeto com chaves 'Fácil', 'Médio', 'Difícil' e valores como arrays de questões.
 */
function gerarTodasAsQuestoes() {
  // Array de valores booleanos para iterar sobre todas as possibilidades de P, Q e R.
  const valores = [true, false];
  // Objeto que irá armazenar todas as questões geradas.
  const questoes = {
    'Fácil': [],
    'Médio': [],
    'Difícil': []
  };

  // --- NÍVEL FÁCIL ---
  // Itera sobre cada valor possível de P (V, F).
  for (const P of valores) {
    // Itera sobre cada valor possível de Q (V, F).
    for (const Q of valores) {
      // AND: Cria a questão e a resposta para a operação P AND Q.
      questoes['Fácil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P AND Q?`,
        resposta: P && Q
      });
      // OR: Cria a questão e a resposta para a operação P OR Q.
      questoes['Fácil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P OR Q?`,
        resposta: P || Q
      });
    }
  }

  // --- NÍVEL MÉDIO ---
  for (const P of valores) {
    for (const Q of valores) {
      // (NOT P) OR Q
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de (NOT P) OR Q?`,
        resposta: (!P) || Q
      });
      // P AND (NOT Q)
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P AND (NOT Q)?`,
        resposta: P && (!Q)
      });
      // P XOR Q (XOR é verdadeiro se P e Q forem diferentes)
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P XOR Q?`,
        resposta: P !== Q
      });
    }
  }
  
  // --- NÍVEL DIFÍCIL ---
  for (const P of valores) {
    for (const Q of valores) {
      // Implicação (P -> Q), que é logicamente equivalente a (!P || Q)
      questoes['Difícil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P -> Q?`,
        resposta: (!P) || Q
      });
      // Bicondicional (P <-> Q), que é verdadeiro se P e Q são iguais.
      questoes['Difícil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P <-> Q?`,
        resposta: P === Q
      });

      // Operação com 3 variáveis
      for (const R of valores) {
        // (P AND Q) OR R
        questoes['Difícil'].push({
          questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, R=${boolParaTexto(R)}, qual o resultado de (P AND Q) OR R?`,
          resposta: (P && Q) || R
        });
      }
    }
  }
  // Retorna o objeto com todas as questões.
  return questoes;
}

/**
 * Embaralha os elementos de um array no lugar usando o algoritmo Fisher-Yates.
 * @param {array} array - O array a ser embaralhado.
 */
function shuffleArray(array) {
  // Itera do final do array para o início.
  for (let i = array.length - 1; i > 0; i--) {
    // Escolhe um índice aleatório entre 0 e i (inclusivo).
    const j = Math.floor(Math.random() * (i + 1));
    // Troca o elemento na posição i com o elemento na posição aleatória j.
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===================================================================================
// SEÇÃO 2: LÓGICA DE CONTROLE DO JOGO
// ===================================================================================

// --- Seleção dos Elementos do DOM ---
// Armazena referências aos elementos HTML para que não precisemos procurá-los toda hora.
const telaInicial = document.getElementById('tela-inicial');
const telaQuestao = document.getElementById('tela-questao');
const telaFinal = document.getElementById('tela-final');

const botoesNivel = document.querySelectorAll('.botoes-nivel .btn');
const btnV = document.getElementById('btn-v');
const btnF = document.getElementById('btn-f');
const btnReiniciar = document.getElementById('btn-reiniciar');

const numeroQuestaoEl = document.getElementById('numero-questao');
const textoQuestaoEl = document.getElementById('texto-questao');
const pontuacaoFinalEl = document.getElementById('pontuacao-final');
const mensagemFinalEl = document.getElementById('mensagem-final');

// --- Variáveis de Estado do Jogo ---
// Armazenam o estado atual do jogo.
const todasAsQuestoes = gerarTodasAsQuestoes(); // Gera todas as questões uma única vez.
let listaDeQuestoes = []; // Armazenará as 5 questões selecionadas para a partida atual.
let questaoAtual = {}; // O objeto da questão que está sendo exibida.
let pontuacao = 0; // Pontuação do jogador.
const totalQuestoes = 5; // O número de questões por partida agora é fixo em 5.
let numeroDaQuestao = 0; // Contador para a questão atual (de 1 a 5).

/**
 * Inicia uma nova partida com o nível selecionado.
 * @param {string} nivel - O nível escolhido pelo jogador ('Fácil', 'Médio', 'Difícil').
 */
function iniciarJogo(nivel) {
  // Reseta as variáveis do jogo para uma nova partida.
  pontuacao = 0;
  numeroDaQuestao = 0;

  // Pega a lista completa de questões para o nível escolhido.
  const questoesDoNivel = todasAsQuestoes[nivel];
  // Embaralha essa lista para garantir aleatoriedade a cada partida.
  shuffleArray(questoesDoNivel);
  // Seleciona as 5 primeiras questões da lista embaralhada.
  listaDeQuestoes = questoesDoNivel.slice(0, totalQuestoes);
  
  // Controla a visibilidade das telas.
  telaInicial.classList.add('hide'); // Esconde a tela inicial.
  telaFinal.classList.add('hide'); // Garante que a tela final esteja escondida.
  telaQuestao.classList.remove('hide'); // Mostra a tela de questões.

  // Chama a função para exibir a primeira questão.
  proximaQuestao();
}

/**
 * Exibe a próxima questão da lista ou finaliza o jogo se todas as 5 foram respondidas.
 */
function proximaQuestao() {
  // Verifica se o jogador já respondeu todas as 5 questões.
  if (numeroDaQuestao >= totalQuestoes) {
    // Se sim, chama a função para mostrar o resultado final.
    mostrarTelaFinal();
    return; // Encerra a execução da função aqui.
  }

  // Incrementa o contador do número da questão.
  numeroDaQuestao++;
  // Pega a próxima questão da nossa lista de 5 questões. (Lembre-se que arrays começam em 0).
  questaoAtual = listaDeQuestoes[numeroDaQuestao - 1];

  // Atualiza os elementos na tela com as informações da nova questão.
  numeroQuestaoEl.textContent = `Questão ${numeroDaQuestao}`;
  textoQuestaoEl.textContent = questaoAtual.questao;
}

/**
 * Verifica se a resposta do usuário está correta e avança o jogo.
 * @param {boolean} respostaUsuario - A resposta do usuário (true para 'V', false para 'F').
 */
function verificarResposta(respostaUsuario) {
  // Compara a resposta do usuário com a resposta correta armazenada no objeto da questão.
  const correta = questaoAtual.resposta;
  
  // Se a resposta do usuário for igual à resposta correta...
  if (respostaUsuario === correta) {
    // ...incrementa a pontuação.
    pontuacao++;
  }
  
  // Chama a próxima questão após um pequeno intervalo para o usuário perceber a transição.
  setTimeout(proximaQuestao, 200); 
}

/**
 * Exibe a tela de pontuação final com os resultados da partida.
 */
function mostrarTelaFinal() {
  // Esconde a tela de questões e mostra a tela final.
  telaQuestao.classList.add('hide');
  telaFinal.classList.remove('hide');

  // Exibe a pontuação final no formato "acertos / total".
  pontuacaoFinalEl.textContent = `${pontuacao} / ${totalQuestoes}`;

  // Calcula o percentual de acertos.
  const aproveitamento = (pontuacao / totalQuestoes);
  let mensagem = '';
  
  // Define uma mensagem de feedback baseada na performance do jogador.
  if (aproveitamento >= 0.9) { // 90% ou mais (5 acertos)
    mensagem = "Você é o mestre da lógica!";
  } else if (aproveitamento >= 0.6) { // 60% a 80% (3 ou 4 acertos)
    mensagem = "Você vai bem em lógica!";
  } else { // Menos de 60% (0, 1 ou 2 acertos)
    mensagem = "Você precisa estudar lógica!";
  }
  // Exibe a mensagem de feedback na tela.
  mensagemFinalEl.textContent = mensagem;
}

/**
 * Reinicia o jogo, voltando para a tela de seleção de nível.
 */
function reiniciarJogo() {
  // Esconde a tela final e mostra a tela inicial.
  telaFinal.classList.add('hide');
  telaInicial.classList.remove('hide');
}

// --- Adicionar "Ouvintes" de Eventos (Event Listeners) ---
// Conecta as funções JavaScript aos cliques nos botões.

// Para cada botão de nível...
botoesNivel.forEach(botao => {
  // ...adiciona um evento de clique.
  botao.addEventListener('click', () => {
    // Pega o nível do atributo 'data-nivel' do botão.
    const nivel = botao.dataset.nivel;
    // Chama a função para iniciar o jogo com esse nível.
    iniciarJogo(nivel);
  });
});

// Adiciona um evento de clique ao botão 'V' para verificar a resposta 'true'.
btnV.addEventListener('click', () => verificarResposta(true));
// Adiciona um evento de clique ao botão 'F' para verificar a resposta 'false'.
btnF.addEventListener('click', () => verificarResposta(false));
// Adiciona um evento de clique ao botão 'Reiniciar' para chamar a função de reinício.
btnReiniciar.addEventListener('click', reiniciarJogo);

// ===================================================================================
// SEÇÃO 3: ANIMAÇÃO DE FUNDO
// ===================================================================================

// Espera o conteúdo da página carregar completamente antes de executar o script de animação.
document.addEventListener("DOMContentLoaded", () => {
  // Cria um elemento <div> para servir de container para todos os símbolos animados.
  const joysticksContainer = document.createElement("div");
  // Define um ID para que possamos estilizá-lo com CSS.
  joysticksContainer.id = "joysticks-container";
  // Adiciona o container ao corpo (body) do documento.
  document.body.appendChild(joysticksContainer);

  // Define uma lista de emojis relacionados a jogos para variar a animação.
  const gameSymbols = ['🎮', '🕹️', '👾', '🚀', '🎲', '🤖'];

  // Função que cria e anima um único símbolo.
  function createGameSymbol() {
    // Cria o elemento <div> que será o nosso símbolo.
    const symbol = document.createElement("div");
    // Adiciona uma classe para que possamos aplicar a animação de queda via CSS.
    symbol.classList.add("game-symbol");

    // Escolhe um emoji aleatório da nossa lista e o define como conteúdo do elemento.
    symbol.innerText = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];

    // Define uma posição horizontal aleatória (de 0 a 100% da largura da tela).
    symbol.style.left = Math.random() * 100 + "vw";

    // Define uma duração de animação aleatória (entre 5 e 12 segundos) para que os símbolos caiam em velocidades diferentes.
    symbol.style.animationDuration = Math.random() * 7 + 5 + "s";

    // Define um tamanho de fonte aleatório (entre 10px e 30px).
    symbol.style.fontSize = Math.random() * 20 + 10 + "px";

    // Define uma opacidade aleatória para dar uma sensação de profundidade.
    symbol.style.opacity = Math.random() * 0.7 + 0.3;

    // Adiciona o símbolo recém-criado ao container.
    joysticksContainer.appendChild(symbol);

    // Define um temporizador para remover o símbolo do DOM após 12 segundos.
    // Isso é crucial para não sobrecarregar a página com milhares de elementos.
    setTimeout(() => {
      symbol.remove();
    }, 12000);
  }

  // Define um intervalo para chamar a função createGameSymbol a cada 300 milissegundos.
  // Isso controla a "densidade" de símbolos caindo na tela.
  setInterval(createGameSymbol, 300);
});
