import React from 'react';
import { FaShoppingCart, FaUsers, FaBox, FaDollarSign } from 'react-icons/fa';
import ResumoCard from './ResumoCard';

type Props = {
  totalVendas: number;
  totalClientes: number;
  valorTotal: number;
  estoqueAtual: number;
};

const ResumoCards: React.FC<Props> = ({
  totalVendas,
  totalClientes,
  valorTotal,
  estoqueAtual,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <ResumoCard
        titulo="Vendas Realizadas"
        valor={totalVendas}
        icone={<FaShoppingCart />}
        totalVendas={totalVendas}
        totalClientes={totalClientes}
        valorTotal={valorTotal}
        estoqueAtual={estoqueAtual}
      />
      <ResumoCard
        titulo="Clientes Ativos"
        valor={totalClientes}
        icone={<FaUsers />}
        totalVendas={totalVendas}
        totalClientes={totalClientes}
        valorTotal={valorTotal}
        estoqueAtual={estoqueAtual}
      />
      <ResumoCard
        titulo="Itens em Estoque"
        valor={estoqueAtual}
        icone={<FaBox />}
        totalVendas={totalVendas}
        totalClientes={totalClientes}
        valorTotal={valorTotal}
        estoqueAtual={estoqueAtual}
      />
      <ResumoCard
        titulo="Receita Estimada"
        valor={`R$ ${valorTotal.toFixed(2)}`}
        icone={<FaDollarSign />}
        totalVendas={totalVendas}
        totalClientes={totalClientes}
        valorTotal={valorTotal}
        estoqueAtual={estoqueAtual}
      />
    </div>
  );
};

export default ResumoCards;