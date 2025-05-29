const playerScoreSpan = document.getElementById('player-score');
const computerScoreSpan = document.getElementById('computer-score');
const playerChoiceDisplay = document.getElementById('player-choice-display');
const computerChoiceDisplay = document.getElementById('computer-choice-display');
const gameResultDisplay = document.getElementById('game-result');
const choiceButtons = document.querySelectorAll('.choice-btn');
const resetButton = document.getElementById('reset-game');

// Nuevos elementos para el fin de juego y efectos
const gameOverModal = document.getElementById('game-over-modal');
const finalMessage = document.getElementById('final-message');
const playAgainButton = document.getElementById('play-again-btn');
const backgroundEffect = document.getElementById('background-effect'); // Todavía se usa para el efecto de derrota

const MAX_SCORE = 5; // El puntaje máximo para ganar el juego
let playerScore = 0;
let computerScore = 0;
let gameEnded = false; // Nueva variable para controlar si el juego ha terminado

const choices = ['piedra', 'papel', 'tijera'];

// Función para obtener la elección aleatoria de la computadora
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Función para determinar el ganador de la ronda
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'Empate';
    } else if (
        (playerChoice === 'piedra' && computerChoice === 'tijera') ||
        (playerChoice === 'papel' && computerChoice === 'piedra') ||
        (playerChoice === 'tijera' && computerChoice === 'papel')
    ) {
        return 'Ganaste';
    } else {
        return 'Perdiste';
    }
}

// Función principal del juego
function playGame(playerChoice) {
    if (gameEnded) return; // Si el juego ya terminó, no permite más jugadas

    const computerChoice = getComputerChoice();
    const result = determineWinner(playerChoice, computerChoice);

    // Actualizar la interfaz
    playerChoiceDisplay.textContent = `Tú elegiste: ${capitalizeFirstLetter(playerChoice)}`;
    computerChoiceDisplay.textContent = `La computadora eligió: ${capitalizeFirstLetter(computerChoice)}`;

    gameResultDisplay.textContent = `¡${result}!`;

    // Limpiar clases de resultado anteriores
    gameResultDisplay.classList.remove('win', 'lose', 'draw');

    // Actualizar marcador y aplicar clase de estilo
    if (result === 'Ganaste') {
        playerScore++;
        gameResultDisplay.classList.add('win');
    } else if (result === 'Perdiste') {
        computerScore++;
        gameResultDisplay.classList.add('lose');
    } else {
        gameResultDisplay.classList.add('draw');
    }

    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;

    // Verificar si alguien ha ganado el juego
    if (playerScore === MAX_SCORE || computerScore === MAX_SCORE) {
        endGame();
    }
}

// Función para capitalizar la primera letra (para la visualización)
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para terminar el juego
function endGame() {
    gameEnded = true;
    let finalResultMessage = '';

    // Deshabilitar botones de elección
    choiceButtons.forEach(button => {
        button.classList.add('disabled');
        button.removeEventListener('click', handleChoiceClick); // Elimina el listener para evitar clics fantasma
    });
    
    resetButton.style.display = 'none'; // Ocultar el botón de reiniciar normal

    if (playerScore === MAX_SCORE) {
        finalResultMessage = '¡Felicidades, Ganaste el Juego!';
        finalMessage.style.color = '#4CAF50'; // Verde para el mensaje final
        triggerWinEffect(); // Activa el efecto de victoria con confetti.js
    } else {
        finalResultMessage = '¡La Computadora Ganó el Juego!';
        finalMessage.style.color = '#F44336'; // Rojo para el mensaje final
        triggerLoseEffect(); // Activa el efecto de derrota
    }

    finalMessage.textContent = finalResultMessage;
    gameOverModal.classList.add('show'); // Muestra el modal
}

// Función para reiniciar el juego completamente
function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreSpan.textContent = playerScore;
    computerScoreSpan.textContent = computerScore;
    playerChoiceDisplay.textContent = 'Tú elegiste: ';
    computerChoiceDisplay.textContent = 'La computadora eligió: ';
    gameResultDisplay.textContent = '¡Haz tu jugada!';
    gameResultDisplay.classList.remove('win', 'lose', 'draw');

    gameOverModal.classList.remove('show'); // Oculta el modal
    gameEnded = false; // Restablece el estado del juego

    // Habilitar botones de elección y añadir de nuevo el listener
    choiceButtons.forEach(button => {
        button.classList.remove('disabled');
        button.addEventListener('click', handleChoiceClick);
    });
    
    resetButton.style.display = 'block'; // Mostrar el botón de reiniciar normal
    clearBackgroundEffects(); // Limpia los efectos de fondo (especialmente la X de derrota)
}

// Función para el efecto de victoria (¡ahora con la librería confetti!)
function triggerWinEffect() {
    // Dispara confeti desde el centro de la pantalla
    confetti({
        particleCount: 150, // Más partículas
        spread: 120, // Mayor dispersión
        origin: { y: 0.6 } // Origen un poco más arriba
    });

    // También puedes disparar múltiples ráfagas para un efecto más potente
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.6, x: 0.2 } // Desde la izquierda
        });
    }, 200);
    setTimeout(() => {
        confetti({
            particleCount: 100,
            spread: 120,
            origin: { y: 0.6, x: 0.8 } // Desde la derecha
        });
    }, 400);
}

// Función para el efecto de derrota (X grande, usa el mismo CSS)
function triggerLoseEffect() {
    backgroundEffect.classList.add('lose-effect');
}

// Función para limpiar los efectos de fondo
function clearBackgroundEffects() {
    backgroundEffect.classList.remove('win-effect', 'lose-effect');
    // Para confetti.js, no hay elementos DOM que limpiar, la librería lo hace automáticamente.
}


// Unificamos el manejo de clic en los botones de elección para poder removerlo
function handleChoiceClick() {
    const playerChoice = this.dataset.choice;
    playGame(playerChoice);
}


// Event Listeners iniciales
choiceButtons.forEach(button => {
    button.addEventListener('click', handleChoiceClick);
});

// Event Listener para el botón de reiniciar normal
resetButton.addEventListener('click', resetGame);

// Event Listener para el botón "Jugar de Nuevo" del modal
playAgainButton.addEventListener('click', resetGame);