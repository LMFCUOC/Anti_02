// @ts-ignore
if (window.vlog) window.vlog("main.tsx cargado");
// @ts-ignore
if (window.vlog) window.vlog("main.tsx cargado - Script Ejecutando");
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './animations.css'
import App from './App.tsx'

try {
  // @ts-ignore
  if (window.vlog) window.vlog("Iniciando createRoot...");
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error("No se encontró el elemento #root");

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  // @ts-ignore
  if (window.vlog) window.vlog("React renderizado.");
} catch (e: any) {
  // @ts-ignore
  if (window.vlog) window.vlog("❌ ERROR REACT: " + e.message);
  console.error(e);
}
