import { BoardData } from "../components/Board";

export interface GameState {
  boardData: BoardData;
  playerNumber: number; // 1 for X -> -1 for O
  turn: number;
}

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

function resolveBoardState(boardState: BoardData): number {
  for (let i = 0; i < checkLines.length; i++) {
    const values = checkLines[i].map((e) => boardState.data[e][0]);
    if (
      values.includes(0) || (values[0] != values[1] || values[1] != values[2])
    ) {
      continue;
    }
    return values[0];
  }
  return 0;
}

export function propogateBoardState(currentState: BoardData ) {
  if (!currentState.data[0][1]) {
    return currentState;
  }
  currentState.data.forEach((child, i) => {
    if (child[1]) {
      const childState = propogateBoardState(child[1]);
			currentState.data[i] = [resolveBoardState(childState), childState]
    }
  });
	return currentState;
}

