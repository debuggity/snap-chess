/* script.js */

// Get elements
const knightForkCard = document.getElementById('knightForkCard');
const modal = document.getElementById('lessonModal');
const closeButton = document.querySelector('.close-button');
const puzzleButtons = document.querySelectorAll('.puzzle-button');

// Initialize Chessboard and Chess.js
let board = null;
let game = new Chess();

// Define puzzles
const puzzles = {
    1: {
        position: 'r1bqkbnr/pppp1ppp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        solution: 'Nxe5'
    },
    2: {
        position: 'r2q1rk1/ppp2ppp/2n1bn2/3p4/3P4/2N1BN2/PPP2PPP/R2Q1RK1 w - - 0 10',
        solution: 'Nxd5'
    },
    3: {
        position: 'r1bqk2r/pppp1ppp/2n5/4p3/1b2P3/5N2/PPPP1PPP/RNBQKB1R w KQkq - 2 3',
        solution: 'Nc3'
    }
};

// Function to open modal
function openModal() {
    modal.style.display = 'block';
    loadPuzzle(1); // Load first puzzle by default
}

// Function to close modal
function closeModal() {
    modal.style.display = 'none';
    game.reset();
    board.position(game.fen());
}

// When the user clicks the card, open the modal
knightForkCard.addEventListener('click', openModal);

// When the user clicks on <span> (x), close the modal
closeButton.addEventListener('click', closeModal);

// When the user clicks anywhere outside of the modal, close it
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        closeModal();
    }
});

// Initialize the chessboard
function initChessboard() {
    board = Chessboard('chessboard', {
        draggable: true,
        position: 'start',
        onDragStart: onDragStart,
        onDrop: onDrop,
        onSnapEnd: onSnapEnd,
        pieceTheme: 'https://cdnjs.cloudflare.com/ajax/libs/chessboard.js/1.0.0/img/chesspieces/wikipedia/{piece}.png'
    });
}

// Prevent moving pieces when the game is over or not the player's turn
function onDragStart(source, piece, position, orientation) {
    if (game.game_over()) return false;
    // Only allow moving white pieces
    if (piece.search(/^b/) !== -1) {
        return false;
    }
}

// Handle piece drop
function onDrop(source, target) {
    let move = game.move({
        from: source,
        to: target,
        promotion: 'q' // Always promote to a queen for simplicity
    });

    // Illegal move
    if (move === null) return 'snapback';

    updateStatus();
}

// Update board position after piece snap
function onSnapEnd() {
    board.position(game.fen());
}

// Update game status (not used extensively here)
function updateStatus() {
    // Placeholder for future status updates
}

// Load a specific puzzle
function loadPuzzle(puzzleNumber) {
    const puzzle = puzzles[puzzleNumber];
    game.reset();
    game.load(puzzle.position);
    board.position(puzzle.position);
}

// Handle puzzle button clicks
puzzleButtons.forEach(button => {
    button.addEventListener('click', () => {
        const puzzleNumber = button.getAttribute('data-puzzle');
        loadPuzzle(puzzleNumber);
    });
});

// Initialize the chessboard when the modal is opened
modal.addEventListener('click', function(event) {
    if (board === null) {
        initChessboard();
    }
});
