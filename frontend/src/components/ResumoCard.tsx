import React from 'react';
import { useTheme } from '../context/ThemeContext';

interface ResumoCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const ResumoCard: React.FC<ResumoCardProps> = ({ icon, label, value }) => {
  const { temaAtual } = useTheme();

  return (
    <div
      className="flex rounded shadow overflow-hidden border transition-all duration-300"
      style={{
        backgroundColor: temaAtual.card,
        color: temaAtual.texto,
        borderColor: temaAtual.destaque,
        borderWidth: '1px',
      }}
    >
      {/* Barra lateral com a cor de destaque do tema */}
      <div
        className="w-2"
        style={{ backgroundColor: temaAtual.destaque }}
      ></div>

      {/* Conteúdo do card */}
      <div className="p-4 flex items-center space-x-4">
        <div className="text-2xl" style={{ color: temaAtual.icone }}>
          {icon}
        </div>
        <div>
          <p className="text-sm opacity-80">{label}</p>
          <p className="text-xl font-bold">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default ResumoCard;