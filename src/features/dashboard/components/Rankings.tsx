import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  maiorComprador: { nome: string; total: number };
  produtoTop: { nome: string; quantidade: number };
};

const Rankings: React.FC<Props> = ({ maiorComprador, produtoTop }) => {
  const navigate = useNavigate();
  const { temaAtual } = useTheme();

  const cardBase =
    'p-4 rounded-lg shadow border backdrop-blur-md bg-opacity-60 cursor-pointer hover:opacity-90 transition flex justify-between items-center';
  const cardStyle = {
    background: temaAtual.cardGradient || temaAtual.card,
    borderColor: temaAtual.destaque,
    color: temaAtual.texto,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Maior Comprador */}
      <div
        className={cardBase}
        style={cardStyle}
        onClick={() => navigate('/historico-clientes')}
      >
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: temaAtual.destaque }}>
            Maior Comprador
          </h2>
          <p className="text-xl font-semibold">{maiorComprador.nome}</p>
          <p className="text-sm opacity-80">
            {maiorComprador.total} compras
          </p>
        </div>
        <div className="text-4xl">👑</div>
      </div>

      {/* Produto Mais Vendido */}
      <div
        className={cardBase}
        style={cardStyle}
        onClick={() => navigate('/estoque')}
      >
        <div>
          <h2 className="text-lg font-bold mb-1" style={{ color: temaAtual.contraste }}>
            Produto Mais Vendido
          </h2>
          <p className="text-xl font-semibold">{produtoTop.nome}</p>
          <p className="text-sm opacity-80">
            {produtoTop.quantidade} unidades
          </p>
        </div>
        <div className="text-4xl">⭐</div>
      </div>
    </div>
  );
};

export default Rankings;