import React from 'react';

interface Props {
  totalGeralPago: number;
  totalGeralVenda: number;
}

const TotaisGeraisEstoque: React.FC<Props> = ({ totalGeralPago, totalGeralVenda }) => {
  const lucroTotal = totalGeralVenda - totalGeralPago;

  return (
    <div className="mt-10 border-t pt-6 text-right space-y-2 text-lg font-semibold text-gray-800">
      <p>
        <span className="text-gray-700">Total Geral Pago:</span>{' '}
        R$ {totalGeralPago.toFixed(2)}
      </p>
      <p>
        <span className="text-gray-700">Prospecção de Venda:</span>{' '}
        R$ {totalGeralVenda.toFixed(2)}
      </p>
      <p className={lucroTotal >= 0 ? 'text-green-700' : 'text-red-600'}>
        Lucro Total: R$ {lucroTotal.toFixed(2)}
      </p>
    </div>
  );
};

export default TotaisGeraisEstoque;
