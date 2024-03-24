import { emitMoveEvent, socket } from "./socketEvents.js";

// get elements
const cells = document.getElementsByClassName("cell");
const winner = document.getElementById("winner");
const playerTurn = document.getElementById("player");
const reset = document.getElementById("reset");

export let player = "X";
let playerSign = null;
let isCreator = false;

// toggle creator
export const toggleCreator = (value) => {
  isCreator = value;
};

// toggle player sign
export const togglePlayerSign = () => {
  playerSign = isCreator ? "X" : "O";
  console.log(playerSign);
};

// toggle player
export const togglePlayer = () => {
  player = player === "X" ? "O" : "X";
  playerTurn.innerHTML = player === playerSign ? "Your Turn" : "Opponent's Turn";
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

// change playable value
export const changePlayable = (value) => {
  playable = value;
};

// toggle cell content and player
export function toggleCell(e) {
  console.log(e);
  if (winner.innerHTML !== "") return;
  if (e?.target?.innerHTML === "" && player === playerSign) {
    e.target.innerHTML = player;
    e.target.removeEventListener("click", e);
    emitMoveEvent(e.target.id, e.target.innerHTML);
    const winner = checkWinner();
    if (winner) {
      document.getElementById("winner").innerHTML = `Winner: ${winner}`;
      removeListeners();
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
export function addListeners() {
  Object.keys(cells).forEach((key) => {
    cells[key].addEventListener("click", toggleCell);
  });
  reset.addEventListener("click", resetBoard);
}

// reset game
export function resetBoard() {
  Object.keys(cells).forEach((key) => {
    cells[key].innerHTML = "";
    cells[key].classList.remove("player-x");
    cells[key].classList.remove("player-o");
  });
  addListeners();
  player = winner.innerHTML === "Winner: X" ? "O" : "X";
  playerTurn.innerHTML = player;
  winner.innerHTML = "";
  changePlayable(false);
}

// 

// initialize game
(function init() {
  addListeners();
  playerTurn.innerHTML = player;
})();
