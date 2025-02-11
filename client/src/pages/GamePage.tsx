import { useEffect, useRef, useState } from "react";
import Board from "../components/Board";
import { UseGameContext } from "../providers/GameProvider";
import { useSocketContext } from "../providers/SocketProvider";
import "./GamePage.css";
import { GameState } from "../util/GameManager";
export default function GamePage() {
  const gameContext = UseGameContext();
  const socketContext = useSocketContext();

  useEffect(() => {
    socketContext.on("gameState", (gameState: GameState) => {
      gameContext.setGameState(gameState);
    });
  });
  const inputRef = useRef<HTMLInputElement>(null);

  const handleJoin = () => {
    if (inputRef.current) {
      socketContext.emit("join", inputRef.current.value);
    }
  }

  return (
    <div className="gamePage">
      <div>
        {gameContext.gameState.player1name} vs{" "}
        {gameContext.gameState.player2name}
      </div>
      <div className="gameHolder">
        <div>
          <Board boardData={gameContext.gameState.boardData} />
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            socketContext.emit("create");
          }}
        >
          Create Room
        </button>
        <button onClick={handleJoin}>
          Join room
        </button>
        <input id="roomCode" ref={inputRef}></input>
        
        Current Room : {gameContext.gameState.roomId}
      </div>
    </div>
  );
}
