import React, { useEffect, useRef, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { estoqueData as estoqueInicial } from '../../../data/estoqueData';
import { ItemEstoque } from '../../../types/estoque';
import { useTheme } from '../../../context/ThemeContext';

import BotaoEstoqueActions from '../components/BotaoEstoqueActions';
import TabelaEstoque from '../components/TabelaEstoque';
import CardsFinanceirosEstoque from '../components/CardsFinanceirosEstoque';
import ResumoPorTipoMarca from '../components/ResumoPorTipoMarca';
import TotaisGeraisEstoque from '../components/TotaisGeraisEstoque';

const STORAGE_KEY = 'estoque_local';

const EstoqueAtualPage: React.FC = () => {
  const { temaAtual } = useTheme();
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

  const removerItem = (categoria: string, tipo: string, index: number) => {
    const copia = { ...estoque };
    copia[categoria][tipo].splice(index, 1);
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

  // 💡 Calcula os totais corretos
  const dadosSkink = Object.values(estoque.skink || {}).flat();
  const dadosVx = Object.values(estoque.vxcraft || {}).flat();

  const totalSkinkCaixas = dadosSkink.reduce((acc, item) => acc + (item.qtdCaixas || 0), 0);
  const totalSkinkPago = dadosSkink.reduce((acc, item) => acc + (item.valorPago || 0), 0);
  const totalSkinkVenda = dadosSkink.reduce((acc, item) => acc + (item.valorVenda || 0), 0);

  const totalVxCaixas = dadosVx.reduce((acc, item) => acc + (item.qtdCaixas || 0), 0);
  const totalVxPago = dadosVx.reduce((acc, item) => acc + (item.valorPago || 0), 0);
  const totalVxVenda = dadosVx.reduce((acc, item) => acc + (item.valorVenda || 0), 0);

  const totalGeralPago = totalSkinkPago + totalVxPago;
  const totalGeralVenda = totalSkinkVenda + totalVxVenda;

  const getCorEstoque = (qtd: number): string => {
    if (qtd === 0) return 'bg-gray-300/40 text-gray-700';
    if (qtd <= 1) return 'bg-red-500/30 text-red-900';
    if (qtd <= 2) return 'bg-yellow-300/30 text-yellow-900';
    if (qtd >= 30) return 'bg-blue-900/30 text-white';
    if (qtd >= 20) return 'bg-blue-600/30 text-white';
    if (qtd >= 15) return 'bg-blue-300/30 text-blue-900';
    return '';
  };

  return (
    <div className="p-6 space-y-10" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <BotaoEstoqueActions
        onSalvar={salvarEstoque}
        onLimpar={limparCache}
        onExportarPDF={exportarPDF}
      />

      <div ref={pdfRef}>
        {categorias.map((categoria) =>
          subcategorias.map((tipo) => (
            <TabelaEstoque
              key={`${categoria}-${tipo}`}
              categoria={categoria}
              tipo={tipo}
              estoque={estoque}
              handleChange={handleChange}
              removerItem={removerItem}
              adicionaNovoItem={adicionaNovoItem}
              getCorEstoque={getCorEstoque}
              categorias={categorias}
              subcategorias={subcategorias}
              temaAtual={temaAtual}
              acumuladores={{
                totalSkinkCaixas,
                totalSkinkVenda,
                totalSkinkPago,
                totalVxCaixas,
                totalVxVenda,
                totalVxPago,
                totalGeralPago,
                totalGeralVenda
              }}
            />
          ))
        )}

        <CardsFinanceirosEstoque
          totalSkinkCaixas={totalSkinkCaixas}
          totalSkinkPago={totalSkinkPago}
          totalSkinkVenda={totalSkinkVenda}
          totalVxCaixas={totalVxCaixas}
          totalVxPago={totalVxPago}
          totalVxVenda={totalVxVenda}
          temaAtual={temaAtual}
        />

        <ResumoPorTipoMarca
  estoque={estoque}
  subcategorias={subcategorias}
  totalSkinkPago={totalSkinkPago}
  totalVxPago={totalVxPago}
  temaAtual={temaAtual}
/>

        <TotaisGeraisEstoque
          totalGeralPago={totalGeralPago}
          totalGeralVenda={totalGeralVenda}
        />
      </div>
    </div>
  );
};

export default EstoqueAtualPage;
