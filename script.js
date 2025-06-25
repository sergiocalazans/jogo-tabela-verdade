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
// SEÇÃO 3: ANIMAÇÃO DE FUNDO (REESCRITA COM BASE NO SEU CÓDIGO)
// ===================================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Cria o container para os símbolos
  const joysticksContainer = document.createElement("div");
  joysticksContainer.id = "joysticks-container";
  document.body.appendChild(joysticksContainer);

  // Lista de símbolos que queremos usar
  const gameSymbols = ['🎮', '🕹️', '👾', '🚀', '🎲', '🤖'];

  // Função que cria um único símbolo caindo
  function createGameSymbol() {
    // Cria o elemento div para o símbolo
    const symbol = document.createElement("div");
    symbol.classList.add("game-symbol");

    // Escolhe um símbolo aleatório da lista
    symbol.innerText = gameSymbols[Math.floor(Math.random() * gameSymbols.length)];

    // Define uma posição HORIZONTAL aleatória
    symbol.style.left = Math.random() * 100 + "vw";

    // Define uma DURAÇÃO de animação aleatória (entre 5s e 12s)
    symbol.style.animationDuration = Math.random() * 7 + 5 + "s";
    
    // CORREÇÃO: Adiciona um ATRASO de animação aleatório para que não caiam em fila
    symbol.style.animationDelay = Math.random() * 5 + 's';

    // Define um TAMANHO de fonte aleatório
    symbol.style.fontSize = Math.random() * 20 + 10 + "px";

    // Define uma OPACIDADE aleatória
    symbol.style.opacity = Math.random() * 0.7 + 0.3;

    // Adiciona o símbolo ao container
    joysticksContainer.appendChild(symbol);

    // CORREÇÃO: Define um tempo para remover o elemento. 
    // O tempo deve ser maior que a duração máxima da animação (12s) + o atraso máximo (5s)
    setTimeout(() => {
      symbol.remove();
    }, 17000); // 17 segundos é um tempo seguro
  }

  // A cada 300ms, chama a função para criar um novo símbolo
  setInterval(createGameSymbol, 300);
});
