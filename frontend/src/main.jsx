import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import AppRouter from "./Routes/AppRouter"; // Import our new router
import "./index.css"; // Import our styles

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);