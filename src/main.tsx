import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Registrar el service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado con éxito:', registration.scope);
      })
      .catch(error => {
        console.error('Error al registrar el Service Worker:', error);
      });
  });
}

createRoot(document.getElementById("root")!).render(<App />);
