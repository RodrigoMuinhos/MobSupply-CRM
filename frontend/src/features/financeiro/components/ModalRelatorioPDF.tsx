'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Venda } from '../../../types/venda';
import { useTheme } from '../../../context/ThemeContext';
import html2pdf from 'html2pdf.js';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { FaTimes } from 'react-icons/fa';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartDataLabels
);

type Props = {
  vendasFiltradas: Venda[];
  onClose: () => void;
};

const limparNomeModelo = (nome: string) => {
  return nome
    .replace(/SKINK SK-RL-NEW-\d+/gi, '')
    .replace(/[^a-zA-Z0-9\-]/g, ' ')
    .trim()
    .split(' ')[0];
};

const ModalRelatorioPDF: React.FC<Props> = ({ vendasFiltradas, onClose }) => {
  const { temaAtual } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);
  const [mesSelecionado, setMesSelecionado] = useState<string>('Todos');

  // Upload de logo
  const [logoBase64, setLogoBase64] = useState<string | null>(
    typeof window !== 'undefined' ? localStorage.getItem('LOGO_MOBSUPPLY') : null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setLogoBase64(base64);
      localStorage.setItem('LOGO_MOBSUPPLY', base64);
    };
    reader.readAsDataURL(file);
  };

  const vendasValidas = vendasFiltradas.filter(
    (v) => v.cliente?.nome?.toLowerCase() !== 'curso' && !(v as any).removido
  );

  const mesesDisponiveis = Array.from(
    new Set(
      vendasValidas.map((v) =>
        new Date(v.data).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      )
    )
  );

  const vendasPorMes = mesSelecionado === 'Todos'
    ? vendasValidas
    : vendasValidas.filter((v) => {
        const data = new Date(v.data);
        const mesAno = data.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        return mesAno === mesSelecionado;
      });

  const totalVendido = vendasPorMes.reduce((acc, v) => acc + v.total_final, 0);

  const vendasPorCliente: Record<string, { nome: string; total: number }> = {};
  vendasPorMes.forEach((v) => {
    const nome = v.cliente.nome;
    if (!vendasPorCliente[nome]) {
      vendasPorCliente[nome] = { nome, total: 0 };
    }
    vendasPorCliente[nome].total += v.total_final;
  });

  const topClientes = Object.values(vendasPorCliente)
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  const modelosMap: Record<string, number> = {};
  vendasPorMes.forEach((v) => {
    v.itens.forEach((item) => {
      const nomeLimpo = limparNomeModelo(item.nome || item.codigo);
      modelosMap[nomeLimpo] = (modelosMap[nomeLimpo] || 0) + item.quantidade;
    });
  });

  const topModelos = Object.entries(modelosMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  useEffect(() => {
    if (mesSelecionado && topModelos.length > 0) {
      const historico = JSON.parse(localStorage.getItem('RANKING_MODELOS') || '{}');
      historico[mesSelecionado] = topModelos;
      localStorage.setItem('RANKING_MODELOS', JSON.stringify(historico));
    }
  }, [mesSelecionado]);

  const coresPaleta = ['#813A26', '#5E5F35', '#D17C1F'];

  const pieData = {
    labels: topModelos.map(([nome]) => nome),
    datasets: [
      {
        data: topModelos.map(([, qtd]) => qtd),
        backgroundColor: coresPaleta,
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  const pieOptions: any = {
    plugins: {
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
        formatter: (value: number) => `${value}`,
      },
      legend: {
        labels: {
          color: '#000',
        },
      },
    },
  };

  const barData = {
    labels: topClientes.map((c) => c.nome),
    datasets: [
      {
        label: 'Valor Vendido',
        data: topClientes.map((c) => c.total),
        backgroundColor: coresPaleta,
      },
    ],
  };

  const barOptions: any = {
    indexAxis: 'y' as const,
    plugins: {
      datalabels: {
        color: '#ffffff',
        anchor: 'end',
        align: 'end',
        font: {
          weight: 'bold' as const,
          size: 14,
        },
        formatter: (value: number) => `R$ ${value.toFixed(2)}`,
      },
      legend: {
        labels: {
          color: '#000',
        },
      },
    },
  };

  const gerarPDF = () => {
    if (!contentRef.current) return;
    html2pdf()
      .set({
        margin: 10,
        filename: `relatorio-mobsupply-${mesSelecionado}.pdf`,
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      })
      .from(contentRef.current)
      .save();
  };

  const imprimir = () => {
    if (!contentRef.current) return;
    const conteudo = contentRef.current.innerHTML;
    const janela = window.open('', '_blank');
    if (!janela) return;
    janela.document.write(`<html><head><title>Imprimir</title></head><body>${conteudo}</body></html>`);
    janela.document.close();
    janela.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 overflow-auto p-4">
      <div className="w-[880px] max-h-[95vh] overflow-auto bg-white shadow-xl p-6 rounded-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-800 hover:text-red-600 text-xl"
          title="Fechar"
        >
          <FaTimes />
        </button>

        {/* Cabeçalho com logo clicável */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div
              className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-400 cursor-pointer hover:opacity-80 transition"
              title="Clique para trocar a logo"
              onClick={handleLogoClick}
            >
              {logoBase64 ? (
                <img
                  src={logoBase64}
                  alt="MobSupply Logo"
                  className="object-cover w-full h-full"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500 bg-gray-100">
                  Logo
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-black">MobSupply</h1>
              <p className="text-xs text-gray-600">Relatório de Vendas</p>
            </div>
          </div>
          <div className="text-right text-sm text-black">
            <p>Responsável:</p>
            <p className="font-semibold">Rodrigo Muinhos</p>
            <p>
              {new Date().toLocaleDateString('pt-BR', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleLogoUpload}
            className="hidden"
          />
        </div>

        {/* Filtro */}
        <div className="mb-4 text-black">
          <label className="mr-2 text-sm">Selecionar mês:</label>
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(e.target.value)}
            className="border px-2 py-1 text-sm"
          >
            <option value="Todos">Todos</option>
            {mesesDisponiveis.map((mes) => (
              <option key={mes} value={mes}>
                {mes.charAt(0).toUpperCase() + mes.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div ref={contentRef} className="text-black">
          <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
            <div className="p-2 border">
              <h3 className="font-semibold mb-1">Top 3 Modelos</h3>
              <ul>
                {topModelos.map(([nome, qtd]) => (
                  <li key={nome}>
                    {nome} - {qtd} unidades
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-2 border">
              <h3 className="font-semibold mb-1">Top 3 Clientes</h3>
              {topClientes.map((info, index) => (
                <p key={index}>
                  <strong>{info.nome}</strong><br />
                  R$ {info.total.toFixed(2)}
                </p>
              ))}
            </div>
            <div className="p-2 border">
              <h3 className="font-semibold mb-1">Total Vendido</h3>
              <p className="text-xl font-bold">R$ {totalVendido.toFixed(2)}</p>
              <p className="text-xs">{mesSelecionado}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-100 p-2 rounded">
              <h3 className="text-center font-medium mb-2">Top Modelos</h3>
              <Pie data={pieData} options={pieOptions} />
            </div>
            <div className="bg-gray-100 p-2 rounded">
              <h3 className="text-center font-medium mb-2">Top Clientes</h3>
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-4">
        
          <button onClick={gerarPDF} className="px-4 py-2 border text-black">📎</button>
        </div>
      </div>
    </div>
  );
};

export default ModalRelatorioPDF;