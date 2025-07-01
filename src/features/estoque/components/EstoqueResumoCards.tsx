import React from 'react';
import { ItemEstoque } from '../../../types/estoque';

interface Props {
  itens: ItemEstoque[];
}

const EstoqueResumoCards: React.FC<Props> = ({ itens }) => {
  const totalItens = itens.length;
  const valorTotal = itens.reduce(
    (total, item) => total + item.quantidade_em_estoque * item.preco_unit,
    0
  );
  const itensCriticos = itens.filter(item => item.quantidade_em_estoque <= item.estoque_minimo).length;

  const cardStyle = 'bg-white p-4 rounded shadow text-center border border-gray-100';
  const numberStyle = 'text-2xl font-bold text-green-800';
  const labelStyle = 'text-gray-600 text-sm';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className={cardStyle}>
        <div className={numberStyle}>R$ {valorTotal.toFixed(2)}</div>
        <div className={labelStyle}>Valor Total em Estoque</div>
      </div>
      <div className={cardStyle}>
        <div className={numberStyle}>{totalItens}</div>
        <div className={labelStyle}>Itens Cadastrados</div>
      </div>
      <div className={cardStyle}>
        <div className={numberStyle}>{itensCriticos}</div>
        <div className={labelStyle}>Itens com Estoque Baixo</div>
      </div>
    </div>
  );
};

export default EstoqueResumoCards;