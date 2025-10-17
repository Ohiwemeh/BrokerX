import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import { SocketProvider } from "./context/SocketContext";
import { initStorage } from "./utils/storage";
import "./index.css";

// Initialize storage management on app start
initStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <AppRouter />
    </SocketProvider>
  </React.StrictMode>
);
