import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { ItemEstoque } from '../../../types/estoque';

interface Props {
  categoria: string;
  tipo: string;
  estoque: Record<string, Record<string, ItemEstoque[]>>;
  handleChange: (
    categoria: string,
    tipo: string,
    index: number,
    campo: keyof ItemEstoque,
    valor: string
  ) => void;
  removerItem: (categoria: string, tipo: string, index: number) => void;
  adicionaNovoItem: (categoria: string, tipo: string) => void;
  getCorEstoque: (qtd: number) => string;
  categorias: string[];
  subcategorias: string[];
  temaAtual: any;
  acumuladores: {
    totalSkinkCaixas: number;
    totalSkinkVenda: number;
    totalSkinkPago: number;
    totalVxCaixas: number;
    totalVxVenda: number;
    totalVxPago: number;
    totalGeralPago: number;
    totalGeralVenda: number;
  };
}

const TabelaEstoque: React.FC<Props> = ({
  categoria,
  tipo,
  estoque,
  handleChange,
  removerItem,
  adicionaNovoItem,
  temaAtual,
  getCorEstoque
}) => {
  const itens: ItemEstoque[] = estoque[categoria]?.[tipo] || [];

  const qtdTotal = itens.reduce((acc, i) => acc + i.quantidade_em_estoque, 0);

  const corCabecalho = categoria.toLowerCase().startsWith('skink')
    ? temaAtual.gradiente1
    : temaAtual.gradiente2;

  return (
    <div className="mb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold" style={{ color: temaAtual.texto }}>
          {categoria.toUpperCase()} / {tipo}
        </h2>
        <button
          onClick={() => adicionaNovoItem(categoria, tipo)}
          className="rounded-full px-3 py-1 text-white"
          style={{ backgroundColor: temaAtual.destaque }}
        >
          ✛
        </button>
      </div>

      <table
        className="min-w-full divide-y rounded shadow"
        style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}
      >
        <thead style={{ backgroundColor: corCabecalho, color: temaAtual.texto }}>
          <tr>
            <th className="px-2 py-2 text-sm text-left w-[140px]">Código</th>
            <th className="px-2 py-2 text-sm text-left w-[60%]">Nome</th>
            <th className="px-2 py-2 text-sm text-center w-[80px]">Qtd</th>
            <th className="px-2 py-2 text-sm text-center w-[100px]">Preço Unidade</th>
            <th className="px-2 py-2 text-sm text-center w-[80px]">Remover</th>
          </tr>
        </thead>
        <tbody>
          {itens.map((item, index) => {
            const corQtd = getCorEstoque(item.quantidade_em_estoque);

            return (
              <tr key={item.codigo} className={`${corQtd} transition`} style={{ color: temaAtual.texto }}>
                <td className="px-2 py-2 text-sm">
                  {item.codigo?.slice(0, 4)}-{item.codigo?.slice(-4)}
                </td>
                <td className="px-2 py-2 text-sm w-[30%]">
                  <input
                    className="w-full px-2 bg-white/10 rounded"
                    value={item.nome}
                    style={{ color: temaAtual.texto }}
                    onChange={(e) =>
                      handleChange(categoria, tipo, index, 'nome', e.target.value)
                    }
                  />
                </td>
                <td className="px-2 py-2 text-center text-sm font-bold">
                  <input
                    type="number"
                    className="w-16 text-center bg-white/10"
                    style={{ color: temaAtual.texto }}
                    value={item.quantidade_em_estoque}
                    onChange={(e) =>
                      handleChange(categoria, tipo, index, 'quantidade_em_estoque', e.target.value)
                    }
                  />
                </td>
                <td className="px-2 py-2 text-center text-sm">
                  <input
                    type="number"
                    step="0.01"
                    className="w-20 text-center bg-white/10"
                    style={{ color: temaAtual.texto }}
                    value={item.preco_unit}
                    onChange={(e) =>
                      handleChange(categoria, tipo, index, 'preco_unit', e.target.value)
                    }
                  />
                </td>
                <td className="px-2 py-2 text-center text-sm">
                  <button
                    onClick={() => removerItem(categoria, tipo, index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            );
          })}

          <tr style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }} className="font-semibold">
            <td colSpan={2} className="px-2 py-2">
              Totais ({tipo})
            </td>
            <td className="text-center">{qtdTotal}</td>
            <td className="text-center">—</td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default TabelaEstoque;
