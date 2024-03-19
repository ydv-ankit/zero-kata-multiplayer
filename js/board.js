const board = document.querySelector("#board");

const cell = (id) => {
  return `<div class="cell" id="${id}"></div>`;
};

function createBoard() {
  board.appendChild(
    document
      .createRange()
      .createContextualFragment(
        cell("0") +
          cell("1") +
          cell("2") +
          cell("3") +
          cell("4") +
          cell("5") +
          cell("6") +
          cell("7") +
          cell("8")
      )
  );
}

createBoard();