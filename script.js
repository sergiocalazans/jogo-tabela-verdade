function valorAleatorio() {
  // 1. Math.random() gera um número de ponto flutuante entre 0 (inclusivo) e 1 (exclusivo).
  // 2. A condição `< 0.5` tem aproximadamente 50% de chance de ser verdadeira e 50% de ser falsa.
  // 3. O resultado é um valor booleano (true ou false) retornado pela função.
  return Math.random() < 0.5; // true ou false
}

function boolParaTexto(v) {
  // Esta função usa um operador ternário, que é uma forma compacta de um if-else.
  // 1. `v ? 'V' : 'F'` significa: "Se a variável 'v' for verdadeira (true), retorne 'V'. Senão, retorne 'F'".
  // 2. O objetivo é converter o resultado booleano (true/false) em um texto amigável ('V'/'F') para ser exibido ao usuário.
  return v ? 'V' : 'F';
}

// Geração de questão
function gerarQuestao(nivel) {
  // Esta é a função principal. Ela recebe o 'nivel' como um argumento (string) e gera um objeto de desafio completo.

  // Gera valores aleatórios para as proposições P, Q e R no início da função.
  // Mesmo que R não seja usado nos níveis "Fácil" e "Médio", ele já é gerado aqui. Isso não é um problema, apenas uma observação.
  const P = valorAleatorio();
  const Q = valorAleatorio();
  const R = valorAleatorio();

  // Inicializa as variáveis que irão armazenar o texto da questão e o resultado booleano.
  // Elas serão preenchidas dentro dos blocos `if` abaixo.
  let expressao = '';
  let resultado = false;

  // Inicia uma estrutura condicional para tratar cada nível de dificuldade.
  if (nivel === "Fácil") {
    // Para o nível "Fácil", escolhe aleatoriamente entre as operações 'AND' e 'OR'.
    const op = Math.random() < 0.5 ? 'AND' : 'OR';
    
    // Usa "template literals" (crases ``) para construir a string da questão de forma dinâmica e legível.
    // As funções `boolParaTexto` são chamadas para formatar os valores de P e Q.
    expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, qual o resultado de P ${op} Q?`;
    
    // Calcula o resultado booleano. Se 'op' for 'AND', calcula (P && Q). Senão, calcula (P || Q).
    resultado = op === 'AND' ? (P && Q) : (P || Q);
  
  } else if (nivel === "Médio") {
    // Cria um array com as operações disponíveis para o nível "Médio".
    const ops = ['NOT_P OR Q', 'P AND NOT Q', 'P XOR Q'];
    
    // Escolhe uma operação aleatória do array 'ops'.
    // 1. `Math.random() * ops.length` gera um número entre 0 e 2.99...
    // 2. `Math.floor()` arredonda para baixo, resultando em um índice válido (0, 1 ou 2).
    const op = ops[Math.floor(Math.random() * ops.length)];

    // Uma nova estrutura condicional para tratar cada operação específica do nível "Médio".
    if (op === 'NOT_P OR Q') {
      expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, qual o resultado de (NOT P) OR Q?`;
      resultado = (!P) || Q; // O operador '!' significa NOT em JavaScript.
    } else if (op === 'P AND NOT Q') {
      expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, qual o resultado de P AND (NOT Q)?`;
      resultado = P && (!Q);
    } else if (op === 'P XOR Q') {
      expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, qual o resultado de P XOR Q?`;
      // Ótima implementação do XOR (OU Exclusivo). Ele é verdadeiro se P OU Q for verdadeiro, mas não ambos.
      // Dica: Em JavaScript, uma forma mais curta de escrever XOR é `P !== Q` (P é diferente de Q).
      resultado = (P || Q) && !(P && Q); // XOR
    }

  } else if (nivel === "Difícil") {
    // Semelhante ao nível médio, define um array de operações para o nível "Difícil".
    const ops = [
      '(P AND Q) OR R',
      'P -> Q',
      'P <-> Q'
    ];
    const op = ops[Math.floor(Math.random() * ops.length)];

    if (op === '(P AND Q) OR R') {
      // Esta é a única operação que usa a variável R.
      expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, R = ${boolParaTexto(R)}, qual o resultado de (P AND Q) OR R?`;
      resultado = (P && Q) || R;
    } else if (op === 'P -> Q') {
      // Operador condicional (implicação).
      expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, qual o resultado de P -> Q?`;
      // A expressão "P implica Q" é logicamente equivalente a "(não P) ou Q". Sua implementação está perfeita.
      resultado = (!P) || Q;
    } else if (op === 'P <-> Q') {
      // Operador bicondicional.
      expressao = `P = ${boolParaTexto(P)}, Q = ${boolParaTexto(Q)}, qual o resultado de P <-> Q?`;
      // O bicondicional é verdadeiro se, e somente se, P e Q têm o mesmo valor. O operador `===` (igualdade estrita) faz exatamente isso.
      resultado = P === Q;
    }
  }

  // Ao final da função, retorna um objeto JavaScript (dicionário) contendo os três itens solicitados.
  return {
    nivel: nivel,
    questao: expressao,
    resposta: resultado // A resposta já está no formato booleano (true/false).
  };
}

// Este bloco de código serve para testar e demonstrar a função `gerarQuestao`.

// Exemplo: gerar 5 questões de nível médio
// Um loop `for` que executa 5 vezes.
for (let i = 0; i < 5; i++) {
  // A cada iteração, chama a função `gerarQuestao` para criar um novo objeto de desafio do nível "Médio".
  const questao = gerarQuestao("Médio");

  // `console.log` é usado para imprimir as informações no console do navegador ou terminal.
  // Ideal para depuração e testes.
  console.log(`Questão ${i + 1}:`);
  console.log(questao.questao); // Imprime o texto da questão.
  console.log(`Resposta correta: ${boolParaTexto(questao.resposta)}`); // Imprime a resposta formatada como 'V' ou 'F'.
  console.log('----------------------------'); // Adiciona uma linha para separar as questões.
}