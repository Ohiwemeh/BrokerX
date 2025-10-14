import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./router";
import { SocketProvider } from "./context/SocketContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <SocketProvider>
      <AppRouter />
    </SocketProvider>
  </React.StrictMode>
);
