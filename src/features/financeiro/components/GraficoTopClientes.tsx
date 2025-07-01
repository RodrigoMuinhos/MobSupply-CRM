'use client';
import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Venda } from '../../../types/venda';
import { useTheme } from '../../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

type Props = {
  vendas: Venda[];
};

const GraficoTopClientes: React.FC<Props> = ({ vendas }) => {
  const { temaAtual } = useTheme();

  // Agrupar total por nome do cliente
  const clientesTotais: Record<string, number> = {};
  vendas.forEach((venda) => {
    const nome = venda.cliente?.nome || 'Sem nome';
    if (!clientesTotais[nome]) clientesTotais[nome] = 0;
    clientesTotais[nome] += venda.total_final;
  });

  const top3 = Object.entries(clientesTotais)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const labels = top3.map(([nome]) => nome);
  const totais = top3.map(([_, valor]) => valor);
  const max = Math.max(...totais);
  const min = Math.min(...totais);

  return (
    <div
      className="shadow rounded p-4 h-full flex flex-col justify-between"
      style={{
        background: temaAtual.cardGradient || temaAtual.card,
        color: temaAtual.texto,
        border: `1px solid ${temaAtual.destaque}`,
      }}
    >
      <h2 className="text-sm font-semibold mb-2">Top 3 Clientes</h2>
      <div className="flex-1">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Valor Total (R$)',
                data: totais,
                backgroundColor: totais.map((v) =>
                  v === max
                    ? '#E68C3A' // destaque laranja
                    : v === min
                    ? '#A1D68B' // destaque verde claro
                    : temaAtual.destaque // cor padrão do tema
                ),
              },
            ],
          }}
          options={{
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (context) =>
                    `R$ ${Number(context.raw).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}`,
                },
              },
              datalabels: {
                anchor: 'end',
                align: 'top',
                color: temaAtual.texto,
                font: {
                  weight: 'bold' as const,
                  size: 11,
                },
                formatter: (value: number) =>
                  `R$ ${value.toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,
                  color: temaAtual.texto,
                },
              },
              x: {
                ticks: {
                  color: temaAtual.texto,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default GraficoTopClientes;