import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MyProvider } from "./Contexts/MyContext.jsx";
import { GlobalProvider } from "./Contexts/GlobalContext.jsx";
import App from "./App.jsx";
import "./index.css";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GlobalProvider>
      <MyProvider>
        <App />
      </MyProvider>
    </GlobalProvider>
  </StrictMode>
);
