const checkLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function createBoardData(levels = 3) {
  return {
    data: [...Array(9)].map((_) => [
      0,
      levels == 1 ? undefined : createBoardData(levels - 1),
    ]),
  };
}
function resolveBoardState(boardState) {
  for (let i = 0; i < checkLines.length; i++) {
    const values = checkLines[i].map((e) => boardState.data[e][0]);
    if (
      values.includes(0) ||
      values.includes(-2) ||
      values[0] != values[1] ||
      values[1] != values[2]
    ) {
      continue;
    }

    return values[0];
  }
  if (boardState.data.every((e) => e[0] != 0)) {
    return -2;
  }

  return 0;
}
function propogateBoardState(currentState) {
  if (!currentState.data[0][1]) {
    return currentState;
  }
  currentState.data.forEach((child, i) => {
    if (child[1]) {
      const childState = propogateBoardState(child[1]);
      currentState.data[i] = [resolveBoardState(childState), childState];
    }
  });
  return currentState;
}
class GameState {
  constructor() {
    this.boardData = createBoardData(3);
    this.player1id = "";
    this.turn = 1;
    this.player1name = "name1";
    this.player2name = "name2"; // minus one
    this.legalMoves = [];
    this.roomId = "";
  }
  propogate() {
    this.boardData = propogateBoardState(this.boardData);
  }
  getSpotValue(cellCoordinates) {
    let boardData = [0, this.boardData];
    cellCoordinates.forEach((c) => {
      boardData = boardData[1].data[c];
    });
    return boardData[0];
  }
  setSpotValue(cellCoordinates, value) {
    let boardData = [0, this.boardData];
    cellCoordinates.forEach((c) => {
      boardData = boardData[1].data[c];
    });
    boardData[0] = value;
  }

  // socket will validate the player
  makeMove(cellCoordinates) {
    for (let i = 0; i < this.legalMoves.length; i++) {
      if (this.legalMoves[i] != cellCoordinates[i]) {
        return false;
      }
    }
    for (let i = 0; i < cellCoordinates.length; i++) {
      if (this.getSpotValue(cellCoordinates.slice(0, i + 1)) != 0) {
        return false;
      }
    }
    if (this.getSpotValue(cellCoordinates) != 0) {
      return false;
    }

    this.setSpotValue(cellCoordinates, this.turn);
    this.propogate();
    this.turn = this.turn * -1;
    this.legalMoves = [cellCoordinates[1], cellCoordinates[2]];

    for (let i = 0; i < this.legalMoves.length; i++) {
      if (this.getSpotValue(this.legalMoves.slice(0, i + 1)) != 0) {
        this.legalMoves = this.legalMoves.slice(0, i);
        break;
      }
    }
    return true;
  }
}

module.exports = { GameState };
