# Jogo da Tabela Verdade

Este projeto é um jogo interativo desenvolvido para a disciplina de **Resolução de Problemas com Lógica Matemática** do curso de Bacharelado em Ciência da Computação da **PUCPR**. O objetivo do jogo é testar o conhecimento do jogador sobre operadores lógicos e tabelas-verdade de uma forma divertida e desafiadora.

## ▶️ Como Jogar

O projeto está disponível online e pode ser acessado diretamente pelo seu navegador.

**[➡️ Clique aqui para jogar! ⬅️]([https://seu-link-do-vercel.vercel.app](https://jogo-tabela-verdade-eta.vercel.app/))**

## 📜 Sobre o Projeto

O "Desafio da Verdade" é um jogo de perguntas e respostas onde o jogador é apresentado a uma expressão lógica e deve determinar se o resultado é Verdadeiro (V) ou Falso (F). O jogo segue as diretrizes propostas na atividade acadêmica, incluindo:

-   **Rodadas:** Uma partida consiste em 5 rodadas.
-   **Pontuação:** Cada resposta correta vale um ponto.
-   **Feedback:** Ao final das 5 rodadas, o jogo exibe a pontuação total e uma mensagem de incentivo.
-   **Níveis de Dificuldade:** O jogador pode escolher entre os níveis Fácil, Médio e Difícil, cada um com tipos diferentes de expressões lógicas.

## ✨ Funcionalidades

-   **Três Níveis de Dificuldade:**
    -   **Fácil:** Questões envolvendo apenas os operadores **AND** e **OR**.
    -   **Médio:** Adiciona complexidade com operadores **NOT** e **XOR**.
    -   **Difícil:** Introduz o condicional (**->**), o bicondicional (**<->**) e expressões com três variáveis (P, Q, R).
-   **Geração Dinâmica de Questões:** O jogo gera um conjunto completo de questões possíveis para cada nível e as embaralha a cada partida, garantindo que não haja duas partidas iguais.
-   **Interface Gráfica Intuitiva:** Uma interface limpa e responsiva, criada com HTML e CSS, que facilita a jogabilidade em desktops e dispositivos móveis.
-   **Feedback Imediato:** O sistema avança para a próxima questão logo após a resposta do jogador.
-   **Animação de Fundo:** Uma animação sutil de símbolos de jogos caindo, criada com JavaScript puro, para tornar a experiência mais imersiva sem causar distrações.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído utilizando tecnologias web fundamentais, sem a necessidade de frameworks ou bibliotecas externas.

-   **HTML5:** Para a estrutura semântica das telas do jogo.
-   **CSS3:** Para a estilização, responsividade e design visual.
    -   *CSS Variables* para um tema de cores fácil de manter.
    -   *Flexbox* para o layout.
    -   *Keyframes* para as animações.
-   **JavaScript (ES6+):** Para toda a lógica do jogo, incluindo:
    -   Geração e manipulação das questões.
    -   Controle do estado do jogo (pontuação, questão atual).
    -   Manipulação do DOM para atualizar a interface.
    -   Criação dinâmica da animação de fundo.

## 📂 Estrutura do Projeto

```
.
├── 📄 index.html      # Estrutura principal da página com as telas do jogo
├── 🎨 styles.css       # Folha de estilos para o visual e responsividade
└── 🧠 script.js        # Lógica do jogo, geração de questões e animações
```

-   **`index.html`**: Contém a estrutura HTML para as três telas principais: a tela inicial (seleção de nível), a tela de questão e a tela final (pontuação).
-   **`styles.css`**: Define a aparência de todos os elementos, incluindo cores, fontes, botões e o layout das telas. Também contém as regras para a animação de fundo.
-   **`script.js`**: O cérebro da aplicação, dividido em três seções principais:
    1.  **Geração de Questões:** Funções que criam um conjunto exaustivo de todas as questões possíveis para cada nível.
    2.  **Lógica do Jogo:** Funções que controlam o fluxo do jogo, como `iniciarJogo`, `proximaQuestao` e `verificarResposta`.
    3.  **Animação de Fundo:** Código que cria e gerencia a animação dos símbolos caindo.

---

### (Opcional) Execução Local

Se você deseja executar o projeto localmente para fins de desenvolvimento:

1.  **Clone o repositório:**
    ```bash
    git clone https://github.com/sergiocalazans/jogo-tabela-verdade.git
    ```
2.  **Navegue até a pasta do projeto:**
    ```bash
    cd seu-repositorio
    ```
3.  **Abra o arquivo `index.html`** diretamente no seu navegador de preferência.

## Agradecimentos

Este projeto foi desenvolvido como parte da avaliação da disciplina de **Resolução de Problemas com Lógica Matemática** do 
curso de Bacharelado em Ciência da Computação da **Pontifícia Universidade Católica do Paraná (PUCPR)** com a Profª Kelly Rafaela Otemaier.

Feito por Sérgio Calazans.

