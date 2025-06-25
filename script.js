// ===================================================================================
// SEÇÃO 1: GERAÇÃO DE TODAS AS QUESTÕES POSSÍVEIS
// ===================================================================================

/**
 * Converte um valor booleano (true/false) para a sua representação textual ('V'/'F').
 * @param {boolean} v - O valor booleano a ser convertido.
 * @returns {string} 'V' se a entrada for true, 'F' se for false.
 */
function boolParaTexto(v) {
  return v ? 'V' : 'F';
}

/**
 * Gera um objeto contendo arrays com todas as questões possíveis para cada nível.
 * @returns {object} Um objeto com chaves 'Fácil', 'Médio', 'Difícil' e valores como arrays de questões.
 */
function gerarTodasAsQuestoes() {
  const valores = [true, false];
  const questoes = {
    'Fácil': [],
    'Médio': [],
    'Difícil': []
  };

  // --- NÍVEL FÁCIL ---
  for (const P of valores) {
    for (const Q of valores) {
      questoes['Fácil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P AND Q?`,
        resposta: P && Q
      });
      questoes['Fácil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P OR Q?`,
        resposta: P || Q
      });
    }
  }

  // --- NÍVEL MÉDIO ---
  for (const P of valores) {
    for (const Q of valores) {
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de (NOT P) OR Q?`,
        resposta: (!P) || Q
      });
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P AND (NOT Q)?`,
        resposta: P && (!Q)
      });
      questoes['Médio'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P XOR Q?`,
        resposta: P !== Q
      });
    }
  }
  
  // --- NÍVEL DIFÍCIL ---
  for (const P of valores) {
    for (const Q of valores) {
      questoes['Difícil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P -> Q?`,
        resposta: (!P) || Q
      });
      questoes['Difícil'].push({
        questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, qual o resultado de P <-> Q?`,
        resposta: P === Q
      });

      for (const R of valores) {
        questoes['Difícil'].push({
          questao: `P=${boolParaTexto(P)}, Q=${boolParaTexto(Q)}, R=${boolParaTexto(R)}, qual o resultado de (P AND Q) OR R?`,
          resposta: (P && Q) || R
        });
      }
    }
  }
  return questoes;
}

/**
 * Embaralha os elementos de um array no lugar usando o algoritmo Fisher-Yates.
 * @param {array} array - O array a ser embaralhado.
 */
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ===================================================================================
// SEÇÃO 2: LÓGICA DE CONTROLE DO JOGO
// ===================================================================================

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

const todasAsQuestoes = gerarTodasAsQuestoes();
let listaDeQuestoes = [];
let questaoAtual = {};
let pontuacao = 0;
const totalQuestoes = 5;
let numeroDaQuestao = 0;

function iniciarJogo(nivel) {
  pontuacao = 0;
  numeroDaQuestao = 0;
  const questoesDoNivel = todasAsQuestoes[nivel];
  shuffleArray(questoesDoNivel);
  listaDeQuestoes = questoesDoNivel.slice(0, totalQuestoes);
  telaInicial.classList.add('hide');
  telaFinal.classList.add('hide');
  telaQuestao.classList.remove('hide');
  proximaQuestao();
}

function proximaQuestao() {
  if (numeroDaQuestao >= totalQuestoes) {
    mostrarTelaFinal();
    return;
  }
  numeroDaQuestao++;
  questaoAtual = listaDeQuestoes[numeroDaQuestao - 1];
  numeroQuestaoEl.textContent = `Questão ${numeroDaQuestao}`;
  textoQuestaoEl.textContent = questaoAtual.questao;
}

function verificarResposta(respostaUsuario) {
  const correta = questaoAtual.resposta;
  if (respostaUsuario === correta) {
    pontuacao++;
  }
  setTimeout(proximaQuestao, 200); 
}

function mostrarTelaFinal() {
  telaQuestao.classList.add('hide');
  telaFinal.classList.remove('hide');
  pontuacaoFinalEl.textContent = `${pontuacao} / ${totalQuestoes}`;
  const aproveitamento = (pontuacao / totalQuestoes);
  let mensagem = '';
  if (aproveitamento >= 0.9) {
    mensagem = "Você é o mestre da lógica!";
  } else if (aproveitamento >= 0.6) {
    mensagem = "Você vai bem em lógica!";
  } else {
    mensagem = "Você precisa estudar lógica!";
  }
  mensagemFinalEl.textContent = mensagem;
}

function reiniciarJogo() {
  telaFinal.classList.add('hide');
  telaInicial.classList.remove('hide');
}

botoesNivel.forEach(botao => {
  botao.addEventListener('click', () => {
    const nivel = botao.dataset.nivel;
    iniciarJogo(nivel);
  });
});

btnV.addEventListener('click', () => verificarResposta(true));
btnF.addEventListener('click', () => verificarResposta(false));
btnReiniciar.addEventListener('click', reiniciarJogo);


// ===================================================================================
// SEÇÃO 3: ANIMAÇÃO DE FUNDO
// ===================================================================================

document.addEventListener("DOMContentLoaded", () => {
  const joysticksContainer = document.createElement("div");
  joysticksContainer.id = "joysticks-container";
  document.body.appendChild(joysticksContainer);
  const gameSymbols = ['🎮', '🕹️', '👾', '🚀', '🎲', '🤖'];

  function createGameSymbol() {
    const symbol = document.createElement("div");
    symbol.classList.add("game-symbol");
    symbol.innerText = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];
    symbol.style.left = Math.random() * 100 + "vw";
    symbol.style.animationDuration = Math.random() * 7 + 5 + "s";
    
    // --- INÍCIO DA ATUALIZAÇÃO ---
    // ADIÇÃO: Define um atraso aleatório antes da animação começar (entre 0 e 5 segundos).
    // Isso faz com que os símbolos não apareçam mais "em fila".
    symbol.style.animationDelay = Math.random() * 5 + 's';
    // --- FIM DA ATUALIZAÇÃO ---

    symbol.style.fontSize = Math.random() * 20 + 10 + "px";
    symbol.style.opacity = Math.random() * 0.7 + 0.3;
    joysticksContainer.appendChild(symbol);

    setTimeout(() => {
      symbol.remove();
    }, 12000);
  }

  setInterval(createGameSymbol, 300);
});
