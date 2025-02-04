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
  const [height, setHeight] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const gameContext = UseGameContext();

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.clientHeight);
    }
    const handleResize = () => {
      if (ref.current) {
        setHeight(ref.current.clientHeight);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <div className="board">
        {boardData.data.map((child, i) => (
          <div
            className="tileContainer"
            key={`tile-${[...id, i].join("-")}`}
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
                ""
              )}
            </div>
            <div
              className="overlay"
              ref={ref}
              style={{
                fontSize: height,
                color:
                  child[0] == 1
                    ? `rgba(0,63,125,0.75)`
                    : `rgba(255,142,0,0.75)`,
              }}
            >
              {child[0] == 1 ? "X" : child[0] == -1 ? "O" : ""}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
