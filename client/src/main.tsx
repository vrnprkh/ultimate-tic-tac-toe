import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { GameProvider } from "./providers/GameProvider";
import GamePage from "./pages/GamePage";
import { SocketProvider } from "./providers/SocketProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SocketProvider>
      <GameProvider>
        <GamePage>
      
        </GamePage>
      </GameProvider>
    </SocketProvider>
  </StrictMode>
);
