// Jogo de Puzzle Deslizante (8-Puzzle)
class SlidingPuzzle {
    constructor() {
        this.board = [];
        this.emptyPos = { row: 2, col: 2 }; // Posição inicial do espaço vazio (inferior direito)
        this.moves = 0;
        this.startTime = null;
        this.timerInterval = null;
        this.isGameStarted = false;
        this.isGameCompleted = false;
        
        this.initializeBoard();
        this.setupEventListeners();
        this.resetStats();
    }

    initializeBoard() {
        // Cria o tabuleiro com números de 1 a 8 e um espaço vazio
        this.board = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, null] // null representa o espaço vazio
        ];
    }

    setupEventListeners() {
        // Event listeners para os botões
        document.getElementById('shuffle-btn').addEventListener('click', () => this.shuffle());
        document.getElementById('reset-btn').addEventListener('click', () => this.reset());
        
        // Adiciona event listener para o tabuleiro
        document.getElementById('puzzle-board').addEventListener('click', (e) => {
            if (e.target.classList.contains('puzzle-tile') && !e.target.classList.contains('empty')) {
                this.handleTileClick(e.target);
            }
        });
    }

    resetStats() {
        this.moves = 0;
        this.updateMovesDisplay();
        this.stopTimer();
        this.updateTimerDisplay('00:00');
    }

    startTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
        
        this.startTime = Date.now();
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const seconds = (elapsed % 60).toString().padStart(2, '0');
            this.updateTimerDisplay(`${minutes}:${seconds}`);
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }

    updateMovesDisplay() {
        document.getElementById('moves-count').textContent = this.moves;
    }

    updateTimerDisplay(timeStr) {
        document.getElementById('timer').textContent = timeStr;
    }

    shuffle() {
        // Embaralha o puzzle realizando movimentos aleatórios
        this.resetStats();
        this.isGameStarted = true;
        this.isGameCompleted = false;
        
        // Remove a classe de resolvido se existir
        const boardElement = document.getElementById('puzzle-board');
        boardElement.classList.remove('puzzle-solved');
        
        // Remove mensagem de vitória se existir
        const existingWinMessage = document.querySelector('.win-message');
        if (existingWinMessage) {
            existingWinMessage.remove();
        }
        
        // Realiza 1000 movimentos aleatórios para embaralhar
        for (let i = 0; i < 1000; i++) {
            const possibleMoves = this.getPossibleMoves();
            const randomMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            this.moveTile(randomMove.row, randomMove.col);
        }
        
        this.renderBoard();
    }

    reset() {
        this.initializeBoard();
        this.emptyPos = { row: 2, col: 2 };
        this.resetStats();
        this.isGameStarted = false;
        this.isGameCompleted = false;
        
        // Remove a classe de resolvido se existir
        const boardElement = document.getElementById('puzzle-board');
        boardElement.classList.remove('puzzle-solved');
        
        // Remove mensagem de vitória se existir
        const existingWinMessage = document.querySelector('.win-message');
        if (existingWinMessage) {
            existingWinMessage.remove();
        }
        
        this.renderBoard();
    }

    handleTileClick(tileElement) {
        // Extrai a posição do tile clicado a partir dos dados armazenados ou da posição no grid
        const row = parseInt(tileElement.dataset.row);
        const col = parseInt(tileElement.dataset.col);
        
        if (this.canMove(row, col)) {
            if (!this.isGameStarted) {
                this.startTimer();
                this.isGameStarted = true;
            }
            
            this.moveTile(row, col);
            this.moves++;
            this.updateMovesDisplay();
            
            // Verifica se o jogo foi resolvido
            if (this.isSolved()) {
                this.handleWin();
            }
        }
    }

    canMove(row, col) {
        // Verifica se o tile está adjacente ao espaço vazio
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);
        
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    moveTile(row, col) {
        // Move o tile para a posição vazia
        this.board[this.emptyPos.row][this.emptyPos.col] = this.board[row][col];
        this.board[row][col] = null;
        
        // Atualiza a posição vazia
        this.emptyPos = { row, col };
        
        this.renderBoard();
    }

    getPossibleMoves() {
        const moves = [];
        const directions = [
            { row: -1, col: 0 },  // cima
            { row: 1, col: 0 },   // baixo
            { row: 0, col: -1 },  // esquerda
            { row: 0, col: 1 }    // direita
        ];
        
        for (const dir of directions) {
            const newRow = this.emptyPos.row + dir.row;
            const newCol = this.emptyPos.col + dir.col;
            
            if (newRow >= 0 && newRow < 3 && newCol >= 0 && newCol < 3) {
                moves.push({ row: newRow, col: newCol });
            }
        }
        
        return moves;
    }

    isSolved() {
        const solvedBoard = [
            [1, 2, 3],
            [4, 5, 6],
            [7, 8, null]
        ];
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (this.board[row][col] !== solvedBoard[row][col]) {
                    return false;
                }
            }
        }
        
        return true;
    }

    handleWin() {
        this.isGameCompleted = true;
        this.stopTimer();
        
        // Adiciona classe de resolvido ao tabuleiro
        const boardElement = document.getElementById('puzzle-board');
        boardElement.classList.add('puzzle-solved');
        
        // Exibe mensagem de vitória
        this.showWinMessage();
    }

    showWinMessage() {
        // Remove mensagem de vitória anterior se existir
        const existingWinMessage = document.querySelector('.win-message');
        if (existingWinMessage) {
            existingWinMessage.remove();
        }
        
        const winMessage = document.createElement('div');
        winMessage.className = 'win-message';
        winMessage.innerHTML = `
            <div>Parabéns! Você resolveu o puzzle!</div>
            <div>Movimentos: ${this.moves}</div>
            <div>Tempo: <span id="final-time">${document.getElementById('timer').textContent}</span></div>
        `;
        
        document.body.appendChild(winMessage);
        
        // Remove a mensagem após 5 segundos
        setTimeout(() => {
            if (winMessage.parentNode) {
                winMessage.remove();
            }
        }, 5000);
    }

    renderBoard() {
        const boardElement = document.getElementById('puzzle-board');
        boardElement.innerHTML = ''; // Limpa o tabuleiro
        
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const tileValue = this.board[row][col];
                const tile = document.createElement('div');
                
                tile.className = tileValue === null ? 'puzzle-tile empty' : 'puzzle-tile';
                tile.textContent = tileValue !== null ? tileValue : '';
                
                // Armazena a posição para referência futura
                tile.dataset.row = row;
                tile.dataset.col = col;
                
                boardElement.appendChild(tile);
            }
        }
    }
}

// Inicializa o jogo quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', () => {
    new SlidingPuzzle();
});