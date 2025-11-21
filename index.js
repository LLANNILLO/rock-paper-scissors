// ============================================
// CONFIGURATION & GAME STATE
// ============================================

const GameStates = {
    SETUP: 'setup',
    PLAYING: 'playing',
    REVEALING: 'revealing',
    ROUND_END: 'round_end',
    GAME_END: 'game_end'
};

const Choices = {
    ROCK: 'rock',
    PAPER: 'paper',
    SCISSORS: 'scissors'
};

const ChoicePictures = {
    rock: './images/rock.png',
    paper: './images/paper.png',
    scissors: './images/scissors.png'
}

//Status in the game
let gameState = {
    currentState: GameStates.SETUP,
    totalRounds: null,
    currentRound: 0,
    playerScore: 0,
    cpuScore: 0,
    playerChoice: null,
    cpuChoice: null,
    roundResult: null
}

// ============================================
// DOM'S ELEMENT REFERENCES
// ============================================

const elements = {
    roundSelector: document.getElementById('roundSelector'),
    scoreBoard: document.getElementById('scoreBoard'),
    gameArena: document.getElementById('gameArena'),
    roundDisplay: document.getElementById('roundDisplay'),
    playerScoreDisplay: document.getElementById('playerScore'),
    cpuScoreDisplay: document.getElementById('cpuScore'),
    playerChoiceDisplay: document.getElementById('playerChoice'),
    cpuChoiceDisplay: document.getElementById('cpuChoice'),
    roundResult: document.getElementById('roundResult'),
    actionBtn: document.getElementById('actionBtn'),
    selectRoundsMsg: document.getElementById('selectRoundsMsg'),
    optionButtons: {
        rock: document.getElementById('rockBtn'),
        paper: document.getElementById('paperBtn'),
        scissors: document.getElementById('scissorsBtn')
    }
}

// ============================================
// GAME LOGIC
// ============================================

function determineWinner(player, cpu) {
    if (player === cpu) return 'draw';

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    }

    return winConditions[player] === cpu ? 'win' : 'lose';
}

/**
 * Generate an aleatroy election for CPU
 */
function getCPUChoice() {
    const choices = Object.values(Choices);
    return choices[Math.floor(Math.random() * choices.length)];
}

/**
 * Update the game score marks
 */
function updateScoreDisplay() {
    elements.roundDisplay.textContent = `${gameState.currentRound}/${gameState.totalRounds}`;
    elements.playerScoreDisplay.textContent = gameState.playerScore;
    elements.cpuScoreDisplay.textContent = gameState.cpuScore;

    // Update animtaions
    elements.playerScoreDisplay.classList.add('bouncing');
    elements.cpuScoreDisplay.classList.add('bouncing');

    setTimeout(() => {
        elements.playerScoreDisplay.classList.remove('bouncing');
        elements.cpuScoreDisplay.classList.remove('bouncing');
    }, 600);
}

/**
 * Show the result of the round with animations
 * @param {string} result - 'win', 'lose', 'draw'
 */
function displayRoundResult(result) {
    const messages = {
        win: 'YOU WIN! 🎉',
        lose: 'YOU LOSE! 😔',
        draw: 'IT\'S A DRAW! 🤝'
    };

    const classes = {
        win: 'result-win',
        lose: 'result-lose',
        draw: 'result-draw'
    }

    elements.roundResult.textContent = messages[result];
    elements.roundResult.className = `round-result ${classes[result]}`;

    if (result === 'win') {
        createConfetti();
    }
}

/**
 * Crete confetti animation
 */
function createConfetti() {
    const colors = ['#D9803B', '#589D6F', '#40809C', '#F9F3E8'];

    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');

            confetti.className = 'confetti';
            confetti.style.top = 0 + 'px';
            confetti.style.left = Math.random() * 80 + '%';
            confetti.style.right = Math.random() * 80 + '%';
            confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDelay = Math.random() * 0.5 + 's';

            document.body.appendChild(confetti);

            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

/**
 * Show the final game result
 */
function showGameEnd() {
    let message, emoji;

    if (gameState.playerScore > gameState.cpuScore) {
        message = 'CONGRATULATIONS! YOU WON THE GAME!';
        emoji = '🎉';
    } else if (gameState.playerScore < gameState.cpuScore) {
        message = 'SORRY! YOU LOST THE GAME!';
        emoji = '😔';
    } else {
        message = 'THE GAME ENDED IN A DRAW!';
        emoji = '🤝';
    }

    elements.roundResult.innerHTML = `
        <div>
            <div style="font-size: 3rem; margin-bottom: 10px;">${emoji}</div>
            <div>${message}</div>
            <div style="font-size: 1.5rem; margin-top: 10px;">
                ${gameState.playerScore} - ${gameState.cpuScore}
            </div>
        </div>
    `

    elements.actionBtn.textContent = 'PLAY AGAIN';
    elements.actionBtn.classList.remove('hidden');
}

/**
 * Reset game to initial state
 */
function resetGame() {
    gameState = {
        currentState: GameStates.SETUP,
        totalRounds: null,
        currentRound: 0,
        playerScore: 0,
        cpuScore: 0,
        playerChoice: null,
        cpuChoice: null,
        roundResult: null
    };

    elements.roundSelector.classList.remove('hidden');
    elements.scoreBoard.classList.add('hidden');
    elements.gameArena.classList.add('hidden');
    elements.roundResult.textContent = '';
    elements.actionBtn.classList.add('hidden');
    elements.selectRoundsMsg.classList.remove('hidden');

    elements.playerChoiceDisplay.textContent = '❓';
    elements.cpuChoiceDisplay.textContent = '❓';

    Object.values(elements.optionButtons).forEach(btn => {
        btn.classList.add('disabled');
    });

    document.querySelectorAll('.round-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
}

// ============================================
// EVENTS MANGEMENT
// ============================================

/**
 * Manage round's number selection
 */
document.querySelectorAll('.round-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const rounds = parseInt(btn.dataset.rounds);

        //Update UI
        document.querySelectorAll('.round-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');

        //Game configuration
        gameState.totalRounds = rounds;
        gameState.currentState = GameStates.PLAYING;

        //Update UI
        elements.roundSelector.classList.add('hidden');
        elements.selectRoundsMsg.classList.add('hidden');
        elements.scoreBoard.classList.remove('hidden');
        elements.gameArena.classList.remove('hidden');


        //Enable option buttons
        Object.values(elements.optionButtons).forEach(btn => {
            btn.classList.remove('disabled');
        });

        updateScoreDisplay();
    });
});

/**
 * Manage player's choice selection (rock, paper, scissors)
 */
Object.values(elements.optionButtons).forEach(btn => {
    btn.addEventListener('click', () => {
        if (gameState.currentState !== GameStates.PLAYING) return;

        //Register player's choice
        const choice = btn.dataset.choice;
        gameState.playerChoice = choice;
        gameState.currentState = GameStates.REVEALING;

        // Show player's choice with animation
        elements.playerChoiceDisplay.innerHTML = `
            <img src="${ChoicePictures[choice]}" alt="${choice}"/>
        `;
        elements.playerChoiceDisplay.classList.add('bouncing');

        // Thinking animation for CPU choice
        let spinCount = 0;
        const spinInterval = setInterval(() => {
            const choices = Object.values(ChoicePictures);
            elements.cpuChoiceDisplay.innerHTML = `
                <img src="${choices[spinCount % choices.length]}" alt="thinking"/>
            `;
            elements.cpuChoiceDisplay.classList.add('spinning');
            spinCount++;

            if (spinCount > 5) {
                clearInterval(spinInterval);
                revealCPUChoice();
            }
        }, 200);
    });
});

/**
 * Reveals CPU's choice and determines the round result
 */
function revealCPUChoice() {
    gameState.cpuChoice = getCPUChoice();
    elements.cpuChoiceDisplay.innerHTML = `
        <img src="${ChoicePictures[gameState.cpuChoice]}" alt="${gameState.cpuChoice}"/>
    `;
    elements.cpuChoiceDisplay.classList.remove('spinning');
    elements.cpuChoiceDisplay.classList.add('bouncing');

    // Determine round result after animation delay
    setTimeout(() => {
        gameState.currentRound++;
        gameState.roundResult = determineWinner(
            gameState.playerChoice,
            gameState.cpuChoice
        );

        console.log(gameState.roundResult);
        // Actualiza puntuación
        if (gameState.roundResult === 'win') {
            gameState.playerScore++;
        } else if (gameState.roundResult === 'lose') {
            gameState.cpuScore++;
        }

        updateScoreDisplay();
        displayRoundResult(gameState.roundResult);

        // Clean animations
        elements.playerChoiceDisplay.classList.remove('bouncing');
        elements.cpuChoiceDisplay.classList.remove('bouncing');

        // Determine next state
        if (gameState.currentRound < gameState.totalRounds) {
            gameState.currentState = GameStates.ROUND_END;
            elements.actionBtn.textContent = 'Next Round';
            elements.actionBtn.classList.remove('hidden');
        } else {
            gameState.currentState = GameStates.GAME_END;
            showGameEnd();
        }
    }, 800);
}

/**
 * Manage action button (next round / play again)
 */
elements.actionBtn.addEventListener('click', function () {
    if (gameState.currentState === GameStates.ROUND_END) {
        // prepare next round
        gameState.currentState = GameStates.PLAYING;
        gameState.playerChoice = null;
        gameState.cpuChoice = null;

        elements.playerChoiceDisplay.textContent = '❓';
        elements.cpuChoiceDisplay.textContent = '❓';
        elements.roundResult.textContent = '';
        elements.actionBtn.classList.add('hidden');

        Object.values(elements.optionButtons).forEach(btn =>
            btn.classList.remove('disabled')
        );
    } else if (gameState.currentState === GameStates.GAME_END) {
        resetGame();
    }
});

// ============================================
// INICIALIZACIÓN
// ============================================

console.log('🎮 Initialized rock,paper, scissors game!');
console.log('INITIAL STATE:', gameState.currentState);
