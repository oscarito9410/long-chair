import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/nunito/latin-400.css";
import "@fontsource/nunito/latin-600.css";
import "@fontsource/nunito/latin-700.css";
import "@fontsource/nunito/latin-800.css";
import "@fontsource/caveat/latin-500.css";
import "@fontsource/caveat/latin-600.css";
import { App } from "./App.tsx";
import "./index.css";

if (window.location.hash === "") {
  window.history.replaceState(null, "", "#/welcome");
}

const root = document.getElementById("root");
if (!root) {
  throw new Error("Root element missing");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
