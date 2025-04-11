const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let circles = [];
let score = 0; // A pontuação será incrementada de 1 em 1
let gameInterval;
let nextCircleTime = 0;
let currentMultiplication;
let totalPointsNeeded;

const circleRadius = 30;
const speed = 5;

// Carregando o som
const sound = new Audio('https://www.soundjay.com/button/beep-07.wav'); // Link para o som

// Função para gerar um círculo em uma das 4 linhas diferentes
function generateCircle() {
  // Gerar um círculo em uma das 4 linhas diferentes
  const lines = [
    { x: 100, y: -circleRadius },  // Linha para a tecla 'a'
    { x: 200, y: -circleRadius },  // Linha para a tecla 's'
    { x: 300, y: -circleRadius },  // Linha para a tecla 'k'
    { x: 400, y: -circleRadius }   // Linha para a tecla 'l'
  ];

  // Escolher aleatoriamente uma linha para gerar o círculo
  const randomIndex = Math.floor(Math.random() * 4);
  const selectedLine = lines[randomIndex];
  
  const color = 'rgb(' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ',' + Math.floor(Math.random() * 255) + ')';
  
  circles.push({ ...selectedLine, color, lineIndex: randomIndex });
}

// Função para atualizar o jogo
function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Desenha a linha de acerto
  const hitLineY = canvas.height - 70;
  ctx.beginPath();
  ctx.moveTo(0, hitLineY);
  ctx.lineTo(canvas.width, hitLineY);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 20;
  ctx.stroke();

  // Desenha as "notas" (círculos) nas 4 linhas
  circles.forEach((circle, index) => {
    circle.y += speed; // move para baixo

    if (circle.y > canvas.height) {
      circles.splice(index, 1); // Remove o círculo se ultrapassar a tela
      score -= 1; // Penalidade se o jogador não acertar
    }

    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circleRadius, 0, Math.PI * 2);
    ctx.fillStyle = circle.color;
    ctx.fill();
  });

  // Desenha o score
  ctx.font = '20px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 10, 30);

  // Desenha a pergunta de multiplicação
  ctx.font = '25px Arial';
  ctx.fillText(`${currentMultiplication[0]} × ${currentMultiplication[1]} = ?`, canvas.width / 2 - 100, 50);

  // Geração de novos círculos a cada 2 segundos
  const currentTime = Date.now();
  if (currentTime >= nextCircleTime) {
    generateCircle();
    nextCircleTime = currentTime + 2000; // Novo círculo a cada 2 segundos
  }

  // Verifica se o jogador atingiu o número correto de pontos
  if (score >= totalPointsNeeded) {
    alert("Parabéns! Você acertou o número correto de pontos!");
    startNewRound(); // Começa uma nova rodada com outra pergunta de multiplicação
  }
}

// Função de verificação quando a tecla é pressionada
function keyPressHandler(event) {
  const key = event.key.toLowerCase();
  
  // Definindo a linha de acerto
  const hitZoneTop = canvas.height - 90;
  const hitZoneBottom = canvas.height - 50;

  // Mapeando as teclas para as linhas corretas
  const keyMapping = {
    'a': 0,  // Tecla 'a' para o primeiro círculo (linha 0)
    's': 1,  // Tecla 's' para o segundo círculo (linha 1)
    'k': 2,  // Tecla 'k' para o terceiro círculo (linha 2)
    'l': 3   // Tecla 'l' para o quarto círculo (linha 3)
  };

  // Verifica se a tecla pressionada corresponde ao círculo correto
  circles.forEach((circle, index) => {
    if (keyMapping[key] === circle.lineIndex && circle.y > hitZoneTop && circle.y < hitZoneBottom) {
      score += 1;  // Incrementa 1 ponto a cada acerto
      circles.splice(index, 1);  // Remove o círculo se acertado
      sound.play();  // Toca o som ao acertar
    }
  });
}

// Função para começar uma nova rodada com uma nova pergunta de multiplicação
function startNewRound() {
  // Gerar uma nova pergunta de multiplicação
  currentMultiplication = [Math.floor(Math.random() * 9) + 1, Math.floor(Math.random() * 9) + 1];  // Nova pergunta de multiplicação
  totalPointsNeeded = currentMultiplication[0] * currentMultiplication[1];  // Define o número de pontos necessários

  // Resetando a pontuação para começar a próxima rodada
  score = 0;
  circles = []; // Limpa os círculos da tela
}

// Inicializa o jogo
function startGame() {
  startNewRound();  // Inicia a primeira rodada
  gameInterval = setInterval(updateGame, 1000 / 60); // Atualiza o jogo a 60 FPS
  document.addEventListener('keydown', keyPressHandler); // Detecta pressionamento de tecla
}

startGame();
