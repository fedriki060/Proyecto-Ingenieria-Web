import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { initTheme } from "./utils/theme";

// Inicializar tema
initTheme();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename="/Proyecto-Ingenieria-Web/">
      <App />
    </BrowserRouter>
  </StrictMode>
);

// Función para cambiar tema
export function toggleTheme() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}