import React, { useEffect, useRef, useState } from 'react';
import * as html2pdf from 'html2pdf.js';
import { FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { estoqueData as estoqueInicial } from '../../../data/estoqueData';
import { ItemEstoque } from '../../../types/estoque';

const STORAGE_KEY = 'estoque_local';

const EstoqueAtualPage: React.FC = () => {
  const [estoque, setEstoque] = useState<typeof estoqueInicial>({ ...estoqueInicial });
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setEstoque(JSON.parse(saved));
    }
  }, []);

  const salvarEstoque = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(estoque));
    alert('Estoque salvo com sucesso!');
  };

  const limparCache = () => {
    const confirmar = window.confirm('Tem certeza que deseja limpar o estoque?');
    if (confirmar) {
      localStorage.removeItem(STORAGE_KEY);
      setEstoque({ ...estoqueInicial });
    }
  };

  const exportarPDF = () => {
    if (pdfRef.current) {
      html2pdf()
        .set({
          margin: 0.3,
          filename: 'estoque-mob-supply.pdf',
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        })
        .from(pdfRef.current)
        .save();
    }
  };

  const removerItem = (cat: string, tipo: string, index: number) => {
    const copia = { ...estoque };
    copia[cat][tipo].splice(index, 1);
    setEstoque(copia);
  };

  const handleChange = (
    categoria: string,
    tipo: string,
    index: number,
    campo: keyof ItemEstoque,
    valor: string
  ) => {
    const copia = { ...estoque };
    const item = copia[categoria][tipo][index];

    if (campo === 'quantidade_em_estoque') {
      item[campo] = parseInt(valor) as never;
    } else {
      item[campo] = valor as never;
    }

    setEstoque(copia);
  };

  const adicionaNovoItem = (categoria: string, tipo: string) => {
    const novoItem: ItemEstoque = {
      codigo: `${categoria.toUpperCase()}-${tipo}-NEW-${Date.now()}`,
      nome: `${categoria.toUpperCase()} ${tipo} Novo`,
      quantidade_em_estoque: 0,
      preco_unit: 0,
      preco_caixa: 0,
    };
    const copia = { ...estoque };
    copia[categoria][tipo].push(novoItem);
    setEstoque(copia);
  };

  const categorias = Object.keys(estoque) as (keyof typeof estoque)[];
  const subcategorias = ['RL', 'RLF', 'RS', 'MGR', 'M2'];

  const getCorEstoque = (qtd: number): string => {
    if (qtd === 0) return 'bg-gray-300/40 text-gray-700';
    if (qtd <= 1) return 'bg-red-500/30 text-red-900';
    if (qtd <= 2) return 'bg-yellow-300/30 text-yellow-900';
    if (qtd >= 30) return 'bg-blue-900/30 text-white';
    if (qtd >= 20) return 'bg-blue-600/30 text-white';
    if (qtd >= 15) return 'bg-blue-300/30 text-blue-900';
    return '';
  };

  let totalSkinkCaixas = 0;
let totalSkinkVenda = 0;
let totalSkinkPago = 0;

let totalVxCaixas = 0;
let totalVxVenda = 0;
let totalVxPago = 0;

let totalGeralPago = 0;
let totalGeralVenda = 0;

return (
  <div className="p-6 space-y-10">
    <div className="flex gap-4 mb-6">
      <button
        onClick={salvarEstoque}
        className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow"
      >
        <FaCheck />
      </button>

      <button
        onClick={limparCache}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded shadow"
      >
        <FaTrash />
      </button>

      <button
        onClick={exportarPDF}
        className="ml-auto text-white bg-gray-800 hover:bg-blue-900 px-4 py-2 rounded shadow"
      >
        ⎙ 
      </button>
    </div>

    <div ref={pdfRef}>
      {categorias.map((cat) => {
        const corCabecalho = cat === 'skink' ? '#a89e0a' : '#b22222';
        const precoCaixa = cat === 'skink' ? 110 : 85;

        return subcategorias.map((tipo) => {
          const itens = estoque[cat]?.[tipo] || [];
          const totalPago = itens.reduce((acc, i) => acc + i.quantidade_em_estoque * i.preco_unit, 0);
          const qtdTotal = itens.reduce((acc, i) => acc + i.quantidade_em_estoque, 0);
          const venda = qtdTotal * 160;
          const lucro = venda - totalPago;

          

          // Acumuladores
          if (cat === 'skink') {
            totalSkinkCaixas += qtdTotal;
            totalSkinkVenda += venda;
            totalSkinkPago += totalPago; 

          } else {
            totalVxCaixas += qtdTotal;
            totalVxVenda += venda;
            totalVxPago += totalPago;
          }

          totalGeralPago += totalPago;
          totalGeralVenda += venda;

          return (
            <div key={`${cat}-${tipo}`} className="mb-10">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold" style={{ color: corCabecalho }}>
                  {cat.toUpperCase()} / {tipo}
                </h2>
                <button
                  onClick={() => adicionaNovoItem(cat, tipo)}
                  className="bg-gray-700 text-white px-3 py-1 rounded text-sm"
                >
                  ✛
                </button>
              </div>

              <table className="min-w-full divide-y divide-gray-300 bg-white rounded shadow">
                <thead style={{ backgroundColor: corCabecalho }} className="text-white">
  <tr>
    <th className="px-2 py-2 text-sm text-left w-[140px]">Código</th>
    <th className="px-2 py-2 text-sm text-left w-[60%]">Nome</th>
    <th className="px-2 py-2 text-sm text-center w-[80px]">Qtd</th>
    <th className="px-2 py-2 text-sm text-center w-[100px]">Preço Unidade</th>
    <th className="px-2 py-2 text-sm text-center w-[120px]">Valor Pago</th>
    <th className="px-2 py-2 text-sm text-center w-[120px]">Lucro</th>
    <th className="px-2 py-2 text-sm text-center w-[80px]">Remover</th>
  </tr>
</thead>
<tbody className="divide-y divide-gray-200">
  {itens.map((item, index) => {
    const valorPago = item.quantidade_em_estoque * item.preco_unit;
    const venda = item.quantidade_em_estoque * 160;
    const lucro = venda - valorPago;
    const corQtd = getCorEstoque(item.quantidade_em_estoque);

    return (
      <tr key={item.codigo} className={`${corQtd} transition`}>
        <td className="px-2 py-2 text-sm text-gray-800">
          {item.codigo.slice(0, 4)}-{item.codigo.slice(-4)}
        </td>
        <td className="px-2 py-2 text-sm w-[30%]">
          <input
            className="w-full px-2 bg-white/80 text-gray-900 rounded"
            value={item.nome}
            onChange={(e) =>
              handleChange(cat, tipo, index, 'nome', e.target.value)
            }
          />
        </td>
        <td className="px-2 py-2 text-center text-sm font-bold">
          <input
            type="number"
            className="w-16 text-center bg-white/80 text-gray-900"
            value={item.quantidade_em_estoque}
            onChange={(e) =>
              handleChange(cat, tipo, index, 'quantidade_em_estoque', e.target.value)
            }
          />
        </td>
        <td className="px-2 py-2 text-center text-sm">
          <input
            type="number"
            step="0.01"
            className="w-20 text-center bg-white/80 text-gray-900"
            value={item.preco_unit}
            onChange={(e) =>
              handleChange(cat, tipo, index, 'preco_unit', e.target.value)
            }
          />
        </td>
        <td className="px-2 py-2 text-center text-sm">R$ {valorPago.toFixed(2)}</td>
        <td className="px-2 py-2 text-center text-sm">R$ {lucro.toFixed(2)}</td>
        <td className="px-2 py-2 text-center text-sm">
          <button
            onClick={() => removerItem(cat, tipo, index)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTimes />
          </button>
        </td>
      </tr>
    );
  })}

                  <tr className="bg-gray-100 font-semibold">
                    <td colSpan={2} className="px-2 py-2">Totais ({tipo})</td>
                    <td className="text-center">{qtdTotal}</td>
                    <td className="text-center">R$ {totalPago.toFixed(2)}</td>
                    <td className="text-center">R$ {lucro.toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        });
      })}

      {/* Cards de Balanço Financeiro por Marca */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="p-6 bg-green-50 border-l-4 border-green-600 rounded shadow">
          <h3 className="text-lg font-bold text-green-800 mb-2">SKINK INK</h3>
          <p>Total de Caixas: {totalSkinkCaixas}</p>
          <p>Valor Pago: R$ {totalSkinkPago.toFixed(2)}</p>
          <p>Prospecção: R$ {totalSkinkVenda.toFixed(2)}</p>
          <p className={`${(totalSkinkVenda - totalSkinkPago) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            Lucro Líquido: R$ {(totalSkinkVenda - totalSkinkPago).toFixed(2)}
          </p>
        </div>

        <div className="p-6 bg-red-50 border-l-4 border-red-600 rounded shadow">
          <h3 className="text-lg font-bold text-red-800 mb-2">VX CRAFT</h3>
          <p>Total de Caixas: {totalVxCaixas}</p>
          <p>Valor Pago: R$ {totalVxPago.toFixed(2)}</p>
          <p>Prospecção: R$ {totalVxVenda.toFixed(2)}</p>
          <p className={`${(totalVxVenda - totalVxPago) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
            Lucro Líquido: R$ {(totalVxVenda - totalVxPago).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Resumo por Tipo e Marca */}
      <div className="bg-white rounded shadow p-6 col-span-2 mt-10">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Resumo por Tipo e Marca</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Quantidade por Tipo */}
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-2">Quantidade por Tipo</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              {subcategorias.map((tipo) => {
                const qtdSkink = estoque.skink[tipo]?.reduce((acc, i) => acc + i.quantidade_em_estoque, 0) || 0;
                const qtdVx = estoque.vxcraft[tipo]?.reduce((acc, i) => acc + i.quantidade_em_estoque, 0) || 0;
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
            <h4 className="text-md font-semibold text-gray-700 mb-2">Valor Pago por Marca</h4>
            <ul className="text-sm text-gray-800 space-y-1">
              <li><strong>SKINK INK:</strong> R$ {totalSkinkPago.toFixed(2)}</li>
              <li><strong>VX CRAFT:</strong> R$ {totalVxPago.toFixed(2)}</li>
              <li className="border-t pt-2 mt-2 font-semibold text-gray-900">
                Total Geral: R$ {(totalSkinkPago + totalVxPago).toFixed(2)}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Totais Gerais */}
      <div className="mt-10 border-t pt-6 text-right space-y-2 text-lg font-semibold text-gray-800">
        <p>Total Geral Pago: R$ {totalGeralPago.toFixed(2)}</p>
        <p>Prospecção de Venda: R$ {totalGeralVenda.toFixed(2)}</p>
        <p className={`${(totalGeralVenda - totalGeralPago) >= 0 ? 'text-green-700' : 'text-red-600'}`}>
          Lucro Total: R$ {(totalGeralVenda - totalGeralPago).toFixed(2)}
        </p>
      </div>
    </div> {/* Fecha o pdfRef */}

    {/* Botão de exportar PDF fora do conteúdo exportado */}
    <div className="mt-8 text-center">
      <button
        onClick={exportarPDF}
        className="text-white bg-black hover:bg-gray-700 px-6 py-3 rounded-full text-lg shadow inline-flex items-center gap-2"
      >
        ⎙ 
      </button>
    </div>
  </div>
);

};

export default EstoqueAtualPage;