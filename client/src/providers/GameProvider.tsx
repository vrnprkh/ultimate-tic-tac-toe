import React, { ReactNode, useContext, useState } from "react";
import { GameState } from "../util/GameManager";
import { createBoardData } from "../components/Board";

interface GameContextType {
  gameState: GameState;

  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
}

const GameContext = React.createContext<GameContextType | undefined>(undefined);

const GameProvider = ({ children }: { children: ReactNode }) => {
  const [gameState, setGameState] = useState<GameState>({
    boardData: createBoardData(3),
    player1id: "",
    turn: 1,
    player1name: "",
    player2name: "",
    legalMoves: [],
    roomId : "",
  });
  return (
    <GameContext.Provider value={{ gameState, setGameState }}>
      {children}
    </GameContext.Provider>
  );
};
const UseGameContext = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
};
export { GameProvider, UseGameContext };
