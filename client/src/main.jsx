import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import AppRouter from "./router";
import { SocketProvider } from "./context/SocketContext";
import { initStorage } from "./utils/storage";
import { queryClient } from "./lib/queryClient";
import "./index.css";

// Initialize storage management on app start
initStorage();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <SocketProvider>
        <AppRouter />
      </SocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
