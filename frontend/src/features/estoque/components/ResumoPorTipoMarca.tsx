import React from 'react';
import { ItemEstoque } from '../../../types/estoque';
import { Tema } from '../../../context/ThemeContext';

interface Props {
  subcategorias: string[];
  estoque: Record<string, Record<string, ItemEstoque[]>>;
  totalSkinkPago: number;
  totalVxPago: number;
  temaAtual: Tema;
}

const ResumoPorTipoMarca: React.FC<Props> = ({
  subcategorias,
  estoque,
  totalSkinkPago,
  totalVxPago,
  temaAtual,
}) => {
  return (
    <div
      className="rounded shadow p-6 col-span-2 mt-10"
      style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}
    >
      <h3 className="text-xl font-bold mb-4">Resumo por Tipo e Marca</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Quantidade por Tipo */}
        <div>
          <h4 className="text-md font-semibold mb-2">Quantidade por Tipo</h4>
          <ul className="text-sm space-y-1">
            {subcategorias.map((tipo) => {
              const qtdSkink =
                estoque.skink?.[tipo]?.reduce((acc, item) => acc + item.quantidade_em_estoque, 0) || 0;
              const qtdVx =
                estoque.vxcraft?.[tipo]?.reduce((acc, item) => acc + item.quantidade_em_estoque, 0) || 0;

              return (
                <li key={tipo}>
                  <strong>{tipo}:</strong> SKINK: {qtdSkink} | VX CRAFT: {qtdVx}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Valor Pago por Marca */}
        <div>
          <h4 className="text-md font-semibold mb-2">Valor Pago por Marca</h4>
          <ul className="text-sm space-y-1">
            <li><strong>SKINK INK:</strong> R$ {totalSkinkPago.toFixed(2)}</li>
            <li><strong>VX CRAFT:</strong> R$ {totalVxPago.toFixed(2)}</li>
            <li
              className="border-t pt-2 mt-2 font-semibold"
              style={{ borderColor: temaAtual.texto }}
            >
              Total Geral: R$ {(totalSkinkPago + totalVxPago).toFixed(2)}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumoPorTipoMarca;
