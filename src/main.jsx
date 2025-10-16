import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GlobalProvider } from "./Contexts/GlobalContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { App } from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalProvider>
      <App />
    </GlobalProvider>
  </StrictMode>
);
