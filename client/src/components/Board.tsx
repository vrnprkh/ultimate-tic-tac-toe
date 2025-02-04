import { useEffect, useRef, useState } from "react";
import "./Board.css";
import { UseGameContext } from "../providers/GameProvider";
import { propogateBoardState } from "../util/GameManager";

// boards can be nested (ultimate tictacotoe) so
// we create a recursive board data object

export interface BoardData {
  data: Array<[number, BoardData | undefined]>;
}

export function createBoardData(levels: number = 3): BoardData {
  return {
    data: [...Array(9)].map((_) => [
      [1, 1, 1, -1, -1, -1, 0, 0][Math.floor(Math.random() * 8)],
      levels == 1 ? undefined : createBoardData(levels - 1),
    ]),
  };
}
const missingBorders = [
  ["minusLeftBorder", "minusTopBorder"],
  ["minusTopBorder"],
  ["minusRightBorder", "minusTopBorder"],
  ["minusLeftBorder"],
  [],
  ["minusRightBorder"],
  ["minusLeftBorder", "minusBottomBorder"],
  ["minusBottomBorder"],
  ["minusRightBorder", "minusBottomBorder"],
];

export default function Board({
  boardData,
  id = [],
}: {
  boardData: BoardData;
  id?: number[];
}) {
  const gameContext = UseGameContext();

  return (
    <>
      <div className="board">
        {boardData.data.map((child, i) => (
          <div
            className="tileContainer"
            key={`tile-${[...id, i].join("-")}`}
            style={{
              background:
                child[0] == 0 || !child[1]
                  ? ""
                  : child[0] == 1
                  ? `rgba(0,63,125,0.5)`
                  : `rgba(255,142,0,0.5)`,
            }}
            onClick={
              !child[1]
                ? () => {
                    console.log(`tile-${[...id, i].join("-")}`);

                    gameContext.setGameState({
                      boardData: propogateBoardState(
                        gameContext.gameState?.boardData
                      ),
                      turn: 1,
                      playerNumber: 1,
                    });
                    console.log(gameContext.gameState);
                  }
                : () => {}
            }
          >
            <div
              className={`tile ${missingBorders[i].join(" ")}`}
              style={{
                borderWidth: Math.floor(Math.max(1, 3 - id.length)),
              }}
            >
              {child[1] ? (
                <Board boardData={child[1]} id={[...id, i]}></Board>
              ) : (
                <>
                  <div
                    className="piece"
                    style={{
                      background:
                        child[0] == 0
                          ? ""
                          : child[0] == 1
                          ? `rgba(0,63,125,1)`
                          : `rgba(255,142,0,1)`,
                    }}
                  ></div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
