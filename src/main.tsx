import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Force light mode only
document.documentElement.classList.remove("dark");
try { localStorage.removeItem("alahli-theme"); } catch {}

createRoot(document.getElementById("root")!).render(<App />);
