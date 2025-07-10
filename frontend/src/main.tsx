import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext'; 
import { IdiomaProvider } from './context/IdiomaContext'; // ✅ ADICIONE AQUI
import { HashRouter, BrowserRouter } from 'react-router-dom';

const isElectron = navigator.userAgent.toLowerCase().includes('electron');
const Router = isElectron ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <IdiomaProvider> {/* ✅ Envolve App aqui */}
            <App />
          </IdiomaProvider>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);
