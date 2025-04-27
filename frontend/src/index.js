import React from 'react';
import ReactDOM from 'react-dom/client';  // Corrigido para importar do 'react-dom/client'
import App from './App';
import { LayoutProvider } from './context/LayoutContext'; // Certifique-se de importar o LayoutProvider

// Corrigido para usar createRoot
const root = ReactDOM.createRoot(document.getElementById('root')); 
root.render(
  <LayoutProvider>
    <App />
  </LayoutProvider>
);