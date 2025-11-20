console.log("Hello, Rock Paper Scissors!");

let humanScore = 0;
let computerScore = 0;


function getComputerChoice() {
    const randomNum = Math.floor(Math.random() * 3);
    switch (randomNum) {
        case 0:
            return "rock";
        case 1:
            return "paper";
        case 2:
            return "scissors";
    }
}

function getHumanChoice() {
    let choice = prompt("Enter rock, paper, or scissors:").toLowerCase();
    return choice;    
}

function playRound(humanChoice, computerChoice) {
    let humanChoiceIns = humanChoice.toLowerCase();
    let computerChoiceIns = computerChoice.toLowerCase(); 
    
    if(humanChoiceIns === computerChoiceIns) {
        return "It's a tie!";
    } else if(
        (humanChoiceIns === "rock" && computerChoiceIns === "scissors") ||
        (humanChoiceIns === "paper" && computerChoiceIns === "rock") ||
        (humanChoiceIns === "scissors" && computerChoiceIns === "paper")
    ) {
        humanScore++;
        return `You win! ${humanChoiceIns} beats ${computerChoiceIns}.`;
    } else {
        computerScore++;
        return `You lose! ${computerChoiceIns} beats ${humanChoiceIns}.`;
    }
}

function playGame() {
    for(let round = 1; round <= 5; round++) {
        const humanChoice = getHumanChoice();
        const computerChoice = getComputerChoice();
        const result = playRound(humanChoice, computerChoice);
        console.log(`Round ${round}: ${result}`);
        console.log(`Score - You: ${humanScore}, Computer: ${computerScore}`);
    }
    
    if(humanScore > computerScore) {
        console.log("Congratulations! You won the game!");
    } else if(computerScore > humanScore) {
        console.log("Sorry! The computer won the game.");
    } else {
        console.log("The game is a tie!");
    }
}

playGame();
