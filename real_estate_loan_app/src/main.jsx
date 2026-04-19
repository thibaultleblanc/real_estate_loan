import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import "./index.css";
import App from "./App.jsx";
import { violetTheme } from "./theme.js";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider theme={violetTheme}>
      <App />
    </ThemeProvider>
  </StrictMode>,
);
