// import { useEffect, useRef, useState } from "react";
import "./Board.css";
import { UseGameContext } from "../providers/GameProvider";
// import { propogateBoardState } from "../util/GameManager";
import { useSocketContext } from "../providers/SocketProvider";

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
  resolved = false,
}: {
  boardData: BoardData;
  id?: number[];
  resolved?: boolean;
}) {
  const gameContext = UseGameContext();
  const socketContext = useSocketContext();
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
                  ? gameContext.gameState.legalMoves.every(
                      (val, i) => val === id[i]
                    ) &&
                    !child[1] &&
                    !resolved
                    ? `rgba(219, 204, 0, 0.5)`
                    : ""
                  : child[0] == 1
                  ? `rgba(0,63,125,0.5)`
                  : child[0] != -2
                  ? `rgba(255,142,0,0.5)`
                  : "rgba(30, 30, 30, 0.5)",
            }}
            onClick={
              !child[1]
                ? () => {
                    socketContext.emit("makeMove", [...id, i]);
                  }
                : () => {}
            }
          >
            <div
              className={`tile ${missingBorders[i].join(" ")}`}
              style={{
                borderWidth: Math.min(
                  Math.floor(Math.max(1, 3 - id.length))
                  // Math.min(window.innerHeight, window.innerWidth) * 0
                ),
              }}
            >
              {child[1] ? (
                <Board
                  boardData={child[1]}
                  id={[...id, i]}
                  resolved={child[0] != 0 || resolved}
                ></Board>
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
                      border: child[0] == 0 ? "" : "solid",
                    }}
                  >
                    {" "}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
