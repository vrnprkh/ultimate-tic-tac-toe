import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Board from "./components/Board";
import { createBoardData } from "./components/Board";
import { GameProvider } from "./providers/GameProvider";
import GamePage from "./pages/GamePage";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameProvider>
      <GamePage>
    
      </GamePage>
    </GameProvider>
  </StrictMode>
);
