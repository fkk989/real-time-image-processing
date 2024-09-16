import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { ImageEditorProvider } from "./context/imageEditorContext.tsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <ImageEditorProvider>
          <App />
        </ImageEditorProvider>
      </QueryClientProvider>
    </Router>
    <Toaster position="top-right" reverseOrder={false} />
  </StrictMode>
);
