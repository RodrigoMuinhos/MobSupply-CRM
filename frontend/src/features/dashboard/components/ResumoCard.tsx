import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  titulo: string;
  valor: string | number;
  icone: React.ReactNode;
  cor?: string; // opcional, apenas para cor do ícone
  totalVendas: number;
  totalClientes: number;
  valorTotal: number;
  estoqueAtual: number;
};

const ResumoCard: React.FC<Props> = ({
  titulo,
  valor,
  icone,
  cor,
}) => {
  const { temaAtual } = useTheme();

  return (
    <div
      className="rounded-lg p-4 shadow-md flex items-center justify-between border backdrop-blur-md bg-opacity-60 transition-all duration-300"
      style={{
        background: temaAtual.cardGradient,
        color: temaAtual.texto,
        borderColor: temaAtual.destaque,
      }}
    >
      <div>
        <h3 className="text-sm font-semibold">{titulo}</h3>
        <p className="text-xl font-bold">{valor}</p>
      </div>
      <div className="ml-4 text-2xl" style={{ color: cor || temaAtual.contraste }}>
        {icone}
      </div>
    </div>
  );
};

export default ResumoCard;