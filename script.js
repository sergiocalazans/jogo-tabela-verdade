// ===================================================================================
// SEÇÃO 1: GERAÇÃO DE TODAS AS QUESTÕES POSSÍVEIS
// ===================================================================================

/**
 * Converte um valor booleano (true/false) para a sua representação textual ('V'/'F').
 * @param {boolean} v - O valor booleano a ser convertido.
 * @returns {string} 'V' se a entrada for true, 'F' se for false.
 */
function boolParaTexto(v) {
  // Utiliza um operador ternário: se v for 'true', retorna 'V', senão retorna 'F'.
  return v ? 'V' : 'F';
}

/**
 * Gera um objeto contendo arrays com todas as questões possíveis para cada nível.
 * @returns {object} Um objeto com chaves 'Fácil', 'Médio', 'Difícil' e valores como arrays de questões.
 */
function gerarTodasAsQuestoes() {
  // Define os dois possíveis valores booleanos que as proposições P, Q, R podem assumir.
  const valores = [true, false];
  // Inicializa o objeto que irá armazenar as questões, separadas por nível de dificuldade.
  const questoes = {
    'Fácil': [],
    'Médio': [],
    'Difícil': []
  };

  // --- NÍVEL FÁCIL ---
  // Itera sobre todos os valores possíveis para P.
  for (const P of valores) {
    // Para cada valor de P, itera sobre todos os valores possíveis para Q.
    for (const Q of valores) {
      // Cria e adiciona uma questão de conjunção (AND) para a combinação atual de P e Q.
      questoes['Fácil'].push({
        // A string da questão é formatada com os valores de P e Q convertidos para 'V'/'F'.
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P AND Q?`,
        // A resposta correta é calculada diretamente usando o operador lógico '&&'.
        resposta: P && Q
      });
      // Cria e adiciona uma questão de disjunção (OR) para a combinação atual de P e Q.
      questoes['Fácil'].push({
        // A string da questão é formatada similarmente.
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P OR Q?`,
        // A resposta correta é calculada com o operador lógico '||'.
        resposta: P || Q
      });
    }
  }

  // --- NÍVEL MÉDIO ---
  // Itera sobre todas as combinações de P e Q.
  for (const P of valores) {
    for (const Q of valores) {
      // Questão: Implicação material (Condicional), representada como (NOT P) OR Q.
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de (NOT P) OR Q?`,
        // A resposta é calculada com a negação de P e a disjunção com Q.
        resposta: (!P) || Q
      });
      // Questão: Conjunção de P com a negação de Q.
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P AND (NOT Q)?`,
        // A resposta é calculada com a conjunção de P e a negação de Q.
        resposta: P && (!Q)
      });
      // Questão: Disjunção exclusiva (XOR).
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P XOR Q?`,
        // A resposta do XOR é 'true' se as entradas forem diferentes. Em JS, isso é o mesmo que 'P !== Q'.
        resposta: P !== Q
      });
    }
  }

  // --- NÍVEL DIFÍCIL ---
  // Itera sobre todas as combinações de P e Q.
  for (const P of valores) {
    for (const Q of valores) {
      // Questão: Implicação (P -> Q). Esta é logicamente equivalente a (!P || Q).
      questoes['Difícil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P -> Q?`,
        // A resposta é calculada usando a equivalência lógica.
        resposta: (!P) || Q
      });
      // Questão: Bicondicional (P <-> Q). É 'true' se P e Q tiverem o mesmo valor.
      questoes['Difícil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P <-> Q?`,
        // A resposta é calculada verificando se P é estritamente igual a Q.
        resposta: P === Q
      });
      // Itera sobre todos os valores possíveis para uma terceira proposição, R.
      for (const R of valores) {
        // Questão com três variáveis: (P AND Q) OR R.
        questoes['Difícil'].push({
          questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, R=${boolParaTexto(R)}, qual o resultado de (P AND Q) OR R?`,
          // A resposta é calculada seguindo a ordem das operações.
          resposta: (P && Q) || R
        });
      }
    }
  }
  // Retorna o objeto completo com todas as questões geradas.
  return questoes;
}

/**
 * Embaralha os elementos de um array no lugar (in-place) usando o algoritmo Fisher-Yates.
 * @param {array} array - O array a ser embaralhado.
 */
function shuffleArray(array) {
  // Itera de trás para frente, começando do último elemento do array.
  for (let i = array.length - 1; i > 0; i--) {
    // Gera um índice aleatório 'j' entre 0 e 'i' (inclusive).
    const j = Math.floor(Math.random() * (i + 1));
    // Troca os elementos nas posições 'i' e 'j' usando desestruturação de array (uma forma moderna e concisa de swap).
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===================================================================================
// SEÇÃO 2: LÓGICA DE CONTROLE DO JOGO
// ===================================================================================

// Obtém referências para os elementos principais da interface do usuário (DOM).
const telaInicial = document.getElementById('tela-inicial'); // A tela de seleção de nível.
const telaQuestao = document.getElementById('tela-questao');   // A tela onde as questões são exibidas.
const telaFinal = document.getElementById('tela-final');     // A tela de resultado final.
const botoesNivel = document.querySelectorAll('.botoes-nivel .btn'); // Coleção de botões de nível.
const btnV = document.getElementById('btn-v');               // Botão de resposta "Verdadeiro".
const btnF = document.getElementById('btn-f');               // Botão de resposta "Falso".
const btnReiniciar = document.getElementById('btn-reiniciar'); // Botão para jogar novamente.
const numeroQuestaoEl = document.getElementById('numero-questao'); // Elemento para exibir "Questão X".
const textoQuestaoEl = document.getElementById('texto-questao');   // Elemento para exibir o texto da questão.
const pontuacaoFinalEl = document.getElementById('pontuacao-final'); // Elemento para exibir a pontuação final.
const mensagemFinalEl = document.getElementById('mensagem-final');   // Elemento para exibir a mensagem de feedback.

// Armazena todas as questões possíveis, geradas uma vez no início.
const todasAsQuestoes = gerarTodasAsQuestoes();
// Variáveis para controlar o estado do jogo atual.
let listaDeQuestoes = []; // Array com as questões da partida atual.
let questaoAtual = {};    // O objeto da questão que está sendo exibida.
let pontuacao = 0;        // A pontuação do jogador.
const totalQuestoes = 5;  // O número de questões por partida.
let numeroDaQuestao = 0;  // O número da questão atual (de 1 a 5).

/**
 * Prepara e inicia o jogo para o nível selecionado.
 * @param {string} nivel - O nível de dificuldade escolhido ('Fácil', 'Médio' ou 'Difícil').
 */
function iniciarJogo(nivel) {
  // Zera a pontuação e o contador de questões para uma nova partida.
  pontuacao = 0;
  numeroDaQuestao = 0;
  // Pega a lista completa de questões para o nível selecionado.
  const questoesDoNivel = todasAsQuestoes[nivel];
  // Embaralha essas questões para garantir variedade a cada partida.
  shuffleArray(questoesDoNivel);
  // Seleciona as primeiras 'totalQuestoes' (5) questões do array embaralhado.
  listaDeQuestoes = questoesDoNivel.slice(0, totalQuestoes);
  // Esconde a tela inicial e a tela final.
  telaInicial.classList.add('hide');
  telaFinal.classList.add('hide');
  // Mostra a tela de questões.
  telaQuestao.classList.remove('hide');
  // Chama a função para exibir a primeira questão.
  proximaQuestao();
}

/**
 * Avança para a próxima questão ou, se o jogo terminou, exibe a tela final.
 */
function proximaQuestao() {
  // Verifica se o número de questões respondidas já atingiu o total.
  if (numeroDaQuestao >= totalQuestoes) {
    // Se sim, o jogo acabou, então mostra a tela final.
    mostrarTelaFinal();
    // Interrompe a execução da função.
    return;
  }
  // Incrementa o contador do número da questão.
  numeroDaQuestao++;
  // Obtém a próxima questão da lista (o índice é `numeroDaQuestao - 1` pois o array é base 0).
  questaoAtual = listaDeQuestoes[numeroDaQuestao - 1];
  // Atualiza o texto do número da questão na tela.
  numeroQuestaoEl.textContent = `Questão ${numeroDaQuestao}`;
  // Atualiza o texto da pergunta na tela.
  textoQuestaoEl.textContent = questaoAtual.questao;
}

/**
 * Verifica se a resposta do usuário está correta e atualiza a pontuação.
 * @param {boolean} respostaUsuario - A resposta do usuário (true para 'V', false para 'F').
 */
function verificarResposta(respostaUsuario) {
  // Obtém a resposta correta do objeto da questão atual.
  const correta = questaoAtual.resposta;
  // Compara a resposta do usuário com a resposta correta.
  if (respostaUsuario === correta) {
    // Se estiverem corretas, incrementa a pontuação.
    pontuacao++;
  }
  // Chama a próxima questão após um breve intervalo (200ms).
  // Isso dá tempo para o usuário perceber a interação antes da tela mudar.
  setTimeout(proximaQuestao, 200);
}

/**
 * Exibe a tela final com a pontuação e uma mensagem de feedback.
 */
function mostrarTelaFinal() {
  // Esconde a tela de questão.
  telaQuestao.classList.add('hide');
  // Mostra a tela final.
  telaFinal.classList.remove('hide');
  // Exibe a pontuação final no formato "acertos / total".
  pontuacaoFinalEl.textContent = `${pontuacao} / ${totalQuestoes}`;
  // Calcula a taxa de aproveitamento do jogador.
  const aproveitamento = (pontuacao / totalQuestoes);
  // Define uma mensagem de feedback com base no aproveitamento.
  let mensagem = '';
  if (aproveitamento >= 0.9) { // 90% ou mais de acertos.
    mensagem = "Você é o mestre da lógica!";
  } else if (aproveitamento >= 0.6) { // 60% ou mais.
    mensagem = "Você vai bem em lógica!";
  } else { // Menos de 60%.
    mensagem = "Você precisa estudar lógica!";
  }
  // Exibe a mensagem de feedback na tela.
  mensagemFinalEl.textContent = mensagem;
}

/**
 * Reinicia o jogo, exibindo a tela inicial novamente.
 */
function reiniciarJogo() {
  // Esconde a tela final.
  telaFinal.classList.add('hide');
  // Mostra a tela inicial para que o jogador possa escolher um nível e começar de novo.
  telaInicial.classList.remove('hide');
}

// Adiciona um ouvinte de evento para cada botão de nível.
botoesNivel.forEach(botao => {
  // Quando um botão de nível é clicado...
  botao.addEventListener('click', () => {
    // Obtém o nível do atributo 'data-nivel' do botão.
    const nivel = botao.dataset.nivel;
    // Inicia o jogo com o nível selecionado.
    iniciarJogo(nivel);
  });
});

// Adiciona um ouvinte para o botão 'V'. Quando clicado, verifica a resposta como 'true'.
btnV.addEventListener('click', () => verificarResposta(true));
// Adiciona um ouvinte para o botão 'F'. Quando clicado, verifica a resposta como 'false'.
btnF.addEventListener('click', () => verificarResposta(false));
// Adiciona um ouvinte para o botão de reiniciar, que chama a função para reiniciar o jogo.
btnReiniciar.addEventListener('click', reiniciarJogo);


// ===================================================================================
// SEÇÃO 3: ANIMAÇÃO DE FUNDO 
// ===================================================================================

// Garante que o código de animação só será executado após o carregamento completo do DOM.
document.addEventListener("DOMContentLoaded", () => {
  // Cria um novo elemento 'div' programaticamente para conter os símbolos caindo.
  const joysticksContainer = document.createElement("div");
  // Atribui um ID a este container para possível estilização ou referência.
  joysticksContainer.id = "joysticks-container";
  // Adiciona o container ao corpo (<body>) do documento HTML.
  document.body.appendChild(joysticksContainer);

  // Define uma lista de emojis que serão usados na animação.
  const gameSymbols = ['🎮', '🕹️', '👾', '🚀', '🎲', '🤖'];

  // Função que cria um único símbolo caindo.
  function createGameSymbol() {
    // Cria o elemento 'div' que representará um símbolo individual.
    const symbol = document.createElement("div");
    // Adiciona a classe 'game-symbol' para aplicar estilos CSS (como a animação 'fall').
    symbol.classList.add("game-symbol");

    // Escolhe um símbolo aleatório da lista 'gameSymbols'.
    symbol.innerText = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];

    // Define uma posição horizontal (left) aleatória, de 0vw a 100vw.
    symbol.style.left = Math.random() * 100 + "vw";

    // Define uma duração de animação aleatória (entre 5s e 12s), fazendo os símbolos caírem em velocidades diferentes.
    symbol.style.animationDuration = Math.random() * 7 + 5 + "s";
    
    // Adiciona um atraso de animação aleatório (entre 0s e 5s) para que os símbolos não comecem a cair todos ao mesmo tempo.
    symbol.style.animationDelay = Math.random() * 5 + 's';

    // Define um tamanho de fonte aleatório (entre 10px e 30px), fazendo os símbolos terem tamanhos variados.
    symbol.style.fontSize = Math.random() * 20 + 10 + "px";

    // Define uma opacidade aleatória (entre 0.3 e 1.0) para criar um efeito de profundidade.
    symbol.style.opacity = Math.random() * 0.7 + 0.3;

    // Adiciona o símbolo recém-criado e configurado ao container de animação no DOM.
    joysticksContainer.appendChild(symbol);

    // Agenda a remoção do elemento do DOM após 17 segundos.
    // Este tempo é calculado para ser maior que a duração máxima da animação (12s) mais o atraso máximo (5s).
    // Isso previne o acúmulo de elementos no DOM, o que degradaria a performance da página.
    setTimeout(() => {
      symbol.remove();
    }, 17000); 
  }

  // Configura um intervalo que chama a função 'createGameSymbol' a cada 300ms.
  // Isso cria um fluxo contínuo de novos símbolos aparecendo e caindo.
  setInterval(createGameSymbol, 300);
});
