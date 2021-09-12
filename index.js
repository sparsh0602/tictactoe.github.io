
 //    CELL0 | CELL1 | CELL2       OUR TIC-TAC-TOE BOARD
 //    CELL3 | CELL4 | CELL5
 //    CELL6 | CELL7 | CELL8                        



//VARIABLE DECLARTION

var origBoard;  // BOARD TO CHECK WHERE ALL 'X' AND 'O'


const huPlayer = 'O'; // HUMAN PLAYER 'O'
const aiPlayer = 'X'; // AI PLAYER 'X'

const winCombos = [ // ALL WINNING COMBINATIONS (ARRAY OF ARRAY)
    //HORIZONTAL COMBINATIONS
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],

    //VERTICAL COMBINATIONS
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],

    //DIAGONAL COMBINATIONS
    [0, 4, 8],
	[6, 4, 2]
]


const cells = document.querySelectorAll('.cell'); 
startGame(); 

function startGame() {
	document.querySelector(".endgame").style.display = "none"; // EVERYTIME WE START GAME WE WANTED TO MAKE OUR ENDGAME DISAPPEAR
	origBoard = Array.from(Array(9).keys()); // JUST MAKE origBoard any array of 9 elements

	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = ''; // MAKE ALL THE 9 CELLS EMPTY (remove O and X) everytime GAME STARTS
		cells[i].style.background = "linear-gradient(rgb(245, 213, 218),rgb(250, 155, 250))";
		cells[i].addEventListener('click', turnClick, false); // BASICALLY WHEN WE CLICK ON ANY CELL WE NEED TO CHECK WHEATHER THAT CELL IS CLICKED BEFORE OR NOT, SO WE MAKE IT FALSE IN BEGINNING
	}
}

function turnClick(square) {
    if(typeof origBoard[square.target.id]=='number') // To check weather clicked cell is already used before (initial id is number and after clicking 'X' || 'O')
    {
	turn(square.target.id, huPlayer) // SQAURE IS NOTHING BUT CELL AND ITS ID WILL RANGE FROM 0-8

    if(!checkTie()) // WE WILL CHECK IF GAME IS TIED AND IF NOT TIED AI PLAYER WILL PLAY
    turn(bestSpot(),aiPlayer); // bestspot is a function for best spot for ai player
}
}
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;  //IF USER CLICK ON ANY CELL WE WILL MAKE IT 'O'
    
    let gamewon=checkwin(origBoard,player);  //AFTER EVERY INPUT WE WILL CHECK IF GAME IS WON BY SOMEWON
    if(gamewon)     // IF ANY PLAYER WINS , WE WILL CALL GAMEOVER FUNCTION 
    gameOver(gamewon);
}


function checkwin(board,player)
{
    let plays=board.reduce((a,e,i) => // we are just traversing through all element with index 'i' , if it is equal to player , we will add it to 'a'
    (e===player)?a.concat(i) : a,[]); // concat means add

    let gamewon=null;

    for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gamewon = {index: index, player: player};
			break;
		}

}
return gamewon;
}


function gameOver(gamewon) {
	for (let index of winCombos[gamewon.index]) {    // we will get the indices of the winning combination and color will be changed to blue if user wins else red if ai wins
		document.getElementById(index).style.background =
			gamewon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) { // we will remove event listner so that no furthur moves can any player play
		cells[i].removeEventListener('click', turnClick, false);
	}
    declareWinner(gamewon.player == huPlayer ? "YOU WIN" : "YOU LOOSE");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard,aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.background = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

// UNBEATABLE UI


function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkwin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkwin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}