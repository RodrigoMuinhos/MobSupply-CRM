import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Tema = {
  fundo: string;
  fundoAlt: string;
  card: string;
  texto: string;
  textoBranco: string;
  destaque: string;
  contraste: string;
  input: string;
  textoClaro: string;
  textoEscuro: string;
  cardGradient?: string;
};

const temas: { [key: string]: Tema } = {
  // 🌿 Tema Classic — Branco e Verde Oliva
  classic: {
    fundo: '#f8fafc',
    fundoAlt: '#e2e8f0',
    card: '#ffffff',
    texto: '#1f2937',
    textoBranco: '#ffffff',
    destaque: '#556b2f', // Verde oliva
    contraste: '#a3b18a',
    input: '#e5e7eb',
    textoClaro: '#ffffff',
    textoEscuro: '#1f2937',
    cardGradient: 'linear-gradient(145deg, #ffffff, #e2e8f0)',
  },

  // 🌑 Tema Dark — Preto e Branco
  dark: {
    fundo: '#0a0a0f',
  fundoAlt: '#1a1a2e',
  card: '#131324',
  texto: '#e0e0ff',
  textoBranco: '#ffffff',
  destaque: '#9f5afd',     // Roxo neon
  contraste: '#00f0ff',     // Azul neon
  input: '#26264f',
  textoClaro: '#ffffff',
  textoEscuro: '#0a0a0a',
  cardGradient: 'linear-gradient(145deg, #131324, #1a1a2e)',
  },

  // 🌌 Tema Cyber — Roxo Escuro e Rosa
  cyber: {
   fundo: '#1a0e10',            // Vinho escuro profundo
  fundoAlt: '#2a1418',         // Um tom mais claro para contraste interno
  card: '#2e1a1c',             // Base para cards
  texto: '#fce7e6',            // Rosa claro suave (quase branco rosado)
  textoBranco: '#ffffff',
  destaque: '#f97316',         // Laranja queimado vivo (ex: para botões principais)
  contraste: '#fb7185',        // Rosa forte vibrante (ex: alertas ou indicadores)
  input: '#5a2e2e',            // Marrom queimado
  textoClaro: '#ffffff',
  textoEscuro: '#1e1e1e',
  cardGradient: 'linear-gradient(145deg, #2e1a1c, #5a2e2e)', // Degradê vinho-laranja
  },
};

type ThemeContextType = {
  temaAtual: Tema;
  temaSelecionado: string;
  setTemaSelecionado: (tema: string) => void;
};

const ThemeContext = createContext<ThemeContextType>({
  temaAtual: temas.classic,
  temaSelecionado: 'classic',
  setTemaSelecionado: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [temaSelecionado, setTemaSelecionado] = useState('classic');
  const temaAtual = temas[temaSelecionado] || temas.classic;

  return (
    <ThemeContext.Provider value={{ temaAtual, temaSelecionado, setTemaSelecionado }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);