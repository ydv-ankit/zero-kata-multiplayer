const cells = document.getElementsByClassName("cell");
const winner = document.getElementById("winner");
let player = "X";

// toggle player
const togglePlayer = () => {
  player = player === "X" ? "O" : "X";
};

// winner logic
function checkWinner() {
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
function toggleCell(e) {
  if (e.target.innerHTML === "") {
    player === "X" ? (e.target.innerHTML = "X") : (e.target.innerHTML = "O");
    player === "X"
      ? e.target.classList.add("player-x")
      : e.target.classList.add("player-o");
    e.target.removeEventListener("click", e);
    const winner = checkWinner();
    console.log(winner);
    if (winner) {
      removeListeners();
      document.getElementById("winner").innerHTML = `Winner: ${winner}`;
    }
    togglePlayer();
  }
}

// remove event listeners
function removeListeners() {
  Object.keys(cells).forEach((key) => {
    cells[key].removeEventListener("click", toggleCell);
  });
}

// attach event listener to each cell
Object.keys(cells).forEach((key) => {
  cells[key].addEventListener("click", toggleCell);
});
