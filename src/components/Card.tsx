import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  title: string;
  children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  const { temaAtual } = useTheme();

  return (
    <div
      className="rounded-lg shadow-md p-4 border transition-all duration-300"
      style={{
        backgroundColor: temaAtual.card,
        color: temaAtual.texto,
        borderColor: temaAtual.destaque,
        borderWidth: '1px',
      }}
    >
      <h2 className="text-lg font-bold mb-2" style={{ color: temaAtual.titulo }}>
        {title}
      </h2>
      {children}
    </div>
  );
};

export default Card;