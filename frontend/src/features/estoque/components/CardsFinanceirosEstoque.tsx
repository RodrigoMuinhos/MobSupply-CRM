import React from 'react';
import { Tema } from '../../../context/ThemeContext';

interface Props {
  totalSkinkCaixas: number;
  totalSkinkPago: number;
  totalSkinkVenda: number;
  totalVxCaixas: number;
  totalVxPago: number;
  totalVxVenda: number;
  temaAtual: Tema;
}

const CardsFinanceirosEstoque: React.FC<Props> = ({
  totalSkinkCaixas,
  totalSkinkPago,
  totalSkinkVenda,
  totalVxCaixas,
  totalVxPago,
  totalVxVenda,
  temaAtual,
}) => {
  const lucroSkink = totalSkinkVenda - totalSkinkPago;
  const lucroVx = totalVxVenda - totalVxPago;

  const cardBaseStyle = {
    backgroundColor: temaAtual.card,
    color: temaAtual.texto,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
      {/* Card SKINK */}
      <div
        className="p-6 border-l-4 rounded shadow"
        style={{ ...cardBaseStyle, borderLeftColor: 'limegreen' }}
      >
        <h3 className="text-lg font-bold mb-2">SKINK INK</h3>
        <p>Total de Caixas: {totalSkinkCaixas}</p>
        <p>Valor Pago: R$ {totalSkinkPago.toFixed(2)}</p>
        <p>Prospecção: R$ {totalSkinkVenda.toFixed(2)}</p>
        <p
          style={{
            color: lucroSkink >= 0 ? 'limegreen' : 'crimson',
            fontWeight: 600,
          }}
        >
          Lucro Líquido: R$ {lucroSkink.toFixed(2)}
        </p>
      </div>

      {/* Card VX CRAFT */}
      <div
        className="p-6 border-l-4 rounded shadow"
        style={{ ...cardBaseStyle, borderLeftColor: 'crimson' }}
      >
        <h3 className="text-lg font-bold mb-2">VX CRAFT</h3>
        <p>Total de Caixas: {totalVxCaixas}</p>
        <p>Valor Pago: R$ {totalVxPago.toFixed(2)}</p>
        <p>Prospecção: R$ {totalVxVenda.toFixed(2)}</p>
        <p
          style={{
            color: lucroVx >= 0 ? 'limegreen' : 'crimson',
            fontWeight: 600,
          }}
        >
          Lucro Líquido: R$ {lucroVx.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default CardsFinanceirosEstoque;
