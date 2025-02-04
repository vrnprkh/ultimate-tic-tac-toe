import Board, { createBoardData } from "../components/Board";
import { UseGameContext } from "../providers/GameProvider";

export default function GamePage() {
  const gameContext = UseGameContext();

  return (
    <>
      <div className="square">
        <Board boardData={gameContext.gameState.boardData} />
      </div>
    </>
  );
}
