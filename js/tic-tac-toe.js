const statusDisplay = document.querySelector('.game--status');
const localStorageKey = 'ticTacToeBestTimes';

let gameActive = false;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];
let startTime;
let bestTimes = JSON.parse(localStorage.getItem(localStorageKey)) || [];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `It's ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

document.querySelectorAll('.cell').forEach(cell => cell.addEventListener('click', handleCellClick));
document.querySelector('.game--restart').addEventListener('click', handleRestartGame);

function handleCellClick(clickedCellEvent) {
    if (!gameActive) {
        startGame();
    }
    
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.innerHTML = currentPlayer;
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleResultValidation() {
    let roundWon = false;
    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        let a = gameState[winCondition[0]];
        let b = gameState[winCondition[1]];
        let c = gameState[winCondition[2]];
        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        endGame(true);
        return;
    }

    let roundDraw = !gameState.includes("");
    if (roundDraw) {
        endGame(false);
        return;
    }

    handlePlayerChange();
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
    if (currentPlayer === 'O') {
        setTimeout(() => {
            makeComputerMove();
        }, 1000);
    }
}

function makeComputerMove() {
    const emptyCells = gameState.reduce((acc, cell, index) => {
        if (cell === '') {
            acc.push(index);
        }
        return acc;
    }, []);

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const cellIndex = emptyCells[randomIndex];
    const cellElement = document.querySelector(`[data-cell-index="${cellIndex}"]`);
    
    handleCellPlayed(cellElement, cellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = false;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = "");
}

function startGame() {
    gameActive = true;
    startTime = Date.now();
}

function endGame(playerWon) {
    gameActive = false;
    if (playerWon) {
        const elapsedTime = (Date.now() - startTime) / 1000; // Convert to seconds
        const playerName = prompt("Congratulations! You won! Enter your name:");
        if (playerName) {
            saveBestTime(playerName, elapsedTime);
        }
    }
}

function saveBestTime(playerName, time) {
    bestTimes.push({ name: playerName, time: time });
    bestTimes.sort((a, b) => a.time - b.time);
    if (bestTimes.length > 10) {
        bestTimes.pop();
    }
    localStorage.setItem(localStorageKey, JSON.stringify(bestTimes));
}

function displayBestTimes() {
    const bestTimesContainer = document.querySelector('.best-times');
    bestTimesContainer.innerHTML = "<h2>Best Times</h2>";
    bestTimes.forEach((record, index) => {
        bestTimesContainer.innerHTML += `<p>${index + 1}. ${record.name} - ${record.time.toFixed(2)}s</p>`;
    });
}

displayBestTimes();
