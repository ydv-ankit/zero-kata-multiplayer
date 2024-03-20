// Description: This file contains the game logic for the tic-tac-toe game.
// imports
import { emitMoveEvent } from "./socketEvents.js";

// get elements
const cells = document.getElementsByClassName("cell");
const winner = document.getElementById("winner");
const playerTurn = document.getElementById("player");
const reset = document.getElementById("reset");

let player = "X";

// toggle player
export const togglePlayer = () => {
  player = player === "X" ? "O" : "X";
  playerTurn.innerHTML = player;
};

// winner logic
export function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8],
  ];
  let winner = null;
  winningCombos.forEach((combo) => {
    const [a, b, c] = combo;
    if (
      cells[a].innerHTML &&
      cells[a].innerHTML === cells[b].innerHTML &&
      cells[a].innerHTML === cells[c].innerHTML
    ) {
      winner = cells[a].innerHTML;
    }
  });
  return winner;
}

// toggle cell content and player
export function toggleCell(e) {
  if (e.target.innerHTML === "") {
    player === "X" ? (e.target.innerHTML = "X") : (e.target.innerHTML = "O");
    player === "X"
      ? e.target.classList.add("player-x")
      : e.target.classList.add("player-o");
    e.target.removeEventListener("click", e);
    emitMoveEvent(e.target.id, e.target.innerHTML);
    const winner = checkWinner();
    if (winner) {
      removeListeners();
      document.getElementById("winner").innerHTML = `Winner: ${winner}`;
      return;
    }
    togglePlayer();
  }
}

// remove event listeners
export function removeListeners() {
  Object.keys(cells).forEach((key) => {
    cells[key].removeEventListener("click", toggleCell);
  });
}

// attach event listener to each cell
function addListeners() {
  Object.keys(cells).forEach((key) => {
    cells[key].addEventListener("click", toggleCell);
  });
  reset.addEventListener("click", resetBoard);
}

// reset game
function resetBoard() {
  Object.keys(cells).forEach((key) => {
    cells[key].innerHTML = "";
    cells[key].classList.remove("player-x");
    cells[key].classList.remove("player-o");
  });
  addListeners();
  player = winner.innerHTML === "Winner: X" ? "O" : "X";
  playerTurn.innerHTML = player;
  winner.innerHTML = "";
}

// initialize game
(function init() {
  addListeners();
  playerTurn.innerHTML = player;
})();
