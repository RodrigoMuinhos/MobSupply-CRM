import React from 'react';
import { estoqueData } from '../../../data/estoqueData';
import { ItemEstoque } from '../../../types/estoque';

const EstoqueTabela: React.FC = () => {
  const categorias = Object.keys(estoqueData);

  const calcularTotal = (preco: number, quantidade: number) =>
    (preco * quantidade).toFixed(2);

  const renderTabela = (
    categoria: string,
    subcategoria: string,
    itens: ItemEstoque[]
  ) => (
    <div key={`${categoria}-${subcategoria}`} className="mb-10">
      <h2 className="text-xl font-bold mb-2 text-green-800">
        {categoria.toUpperCase()} - {subcategoria}
      </h2>
      <table className="min-w-full divide-y divide-gray-200 shadow-md bg-white rounded-lg">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="px-3 py-2 text-left text-sm font-semibold">Código</th>
            <th className="px-3 py-2 text-left text-sm font-semibold">Nome</th>
            <th className="px-3 py-2 text-center text-sm font-semibold">Qtd</th>
            <th className="px-3 py-2 text-center text-sm font-semibold">Preço Unit.</th>
            <th className="px-3 py-2 text-center text-sm font-semibold">Total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {itens.length > 0 ? (
            itens.map((item) => (
              <tr key={item.codigo} className="hover:bg-gray-100">
                <td className="px-3 py-2 text-sm">{item.codigo}</td>
                <td className="px-3 py-2 text-sm">{item.nome}</td>
                <td className="px-3 py-2 text-sm text-center">{item.quantidade_em_estoque}</td>
                <td className="px-3 py-2 text-sm text-center">
                  R$ {item.preco_unit.toFixed(2)}
                </td>
                <td className="px-3 py-2 text-sm text-center">
                  R$ {calcularTotal(item.preco_unit, item.quantidade_em_estoque)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="px-3 py-4 text-center text-gray-500">
                Nenhum item cadastrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6 space-y-10">
      <h1 className="text-3xl font-bold text-green-900 mb-6">Visão Geral do Estoque</h1>

      {categorias.map((cat) =>
        Object.entries(estoqueData[cat as keyof typeof estoqueData]).map(
          ([sub, itens]) =>
            renderTabela(String(cat).toUpperCase(), sub, itens as ItemEstoque[])
        )
      )}
    </div>
  );
};

export default EstoqueTabela;