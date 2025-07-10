// src/features/financeiro/components/ResumoFinanceiro.tsx
'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip } from 'chart.js';
import { Venda } from '../../../types/venda';
import { useTheme } from '../../../context/ThemeContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

type Props = {
  vendasFiltradas: Venda[];
};

const ResumoFinanceiro: React.FC<Props> = ({ vendasFiltradas }) => {
  const { temaAtual } = useTheme();

  // Agrupamento por mês
  const vendasPorMes: Record<string, Venda[]> = {};
  vendasFiltradas.forEach((v) => {
    const data = new Date(v.data);
    if (isNaN(data.getTime())) return;
    const mes = data.toLocaleString('pt-BR', {
      month: 'long',
      year: 'numeric',
    });
    if (!vendasPorMes[mes]) vendasPorMes[mes] = [];
    vendasPorMes[mes].push(v);
  });

  // Totais por mês
  const totaisPorMes = Object.entries(vendasPorMes).map(([mes, lista]) => {
    const total = lista
      .filter((v) => v.pago)
      .reduce((acc, v) => acc + (v.total_final || 0), 0);
    return { mes, total, qtd: lista.length };
  });

  const totalGeral = totaisPorMes.reduce((acc, item) => acc + item.total, 0);

  // Mini Gráfico
  const chartData = {
    labels: totaisPorMes.map((t) => t.mes),
    datasets: [
      {
        label: 'Total por Mês',
        data: totaisPorMes.map((t) => t.total),
        backgroundColor: temaAtual.destaque,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false as const,
    scales: {
      y: { ticks: { color: temaAtual.texto } },
      x: { ticks: { color: temaAtual.texto } },
    },
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div
      className="shadow rounded-lg p-4 flex flex-col justify-between"
      style={{
        background: temaAtual.cardGradient || temaAtual.card,
        color: temaAtual.texto,
        border: `1px solid ${temaAtual.destaque}`,
        minHeight: 220,
      }}
    >
      <h2 className="text-sm font-semibold mb-2">Total Vendido (Filtrado)</h2>

      <p className="text-3xl font-bold text-green-700 mb-2">R$ {totalGeral.toFixed(2)}</p>

      <div className="text-sm mb-2 space-y-1">
        {totaisPorMes.map((t) => (
          <div key={t.mes} className="flex justify-between text-xs">
            <span>
              {t.mes} ({t.qtd} vendas)
            </span>
            <span>= R$ {t.total.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 h-20">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default ResumoFinanceiro;