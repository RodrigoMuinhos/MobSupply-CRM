// src/features/financeiro/components/GraficoModelosMaisVendidos.tsx
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
  dados: Record<string, number>;
};

const GraficoModelosMaisVendidos: React.FC<Props> = ({ dados }) => {
  const { temaAtual } = useTheme();

  const ordenados = Object.entries(dados).sort((a, b) => b[1] - a[1]).slice(0, 10);
  const labels = ordenados.map(([modelo]) => modelo);
  const valores = ordenados.map(([_, qtd]) => qtd);

  return (
    <div className="shadow rounded p-4"
      style={{
        background: temaAtual.cardGradient || temaAtual.card,
        color: temaAtual.texto,
        border: `1px solid ${temaAtual.destaque}`,
      }}
    >
      <h2 className="text-sm font-semibold mb-2">Modelos Mais Vendidos</h2>
      <div className="h-40">
        <Bar
          data={{
            labels,
            datasets: [
              {
                label: 'Qtd',
                data: valores,
                backgroundColor: valores.map((qtd, i, arr) =>
                  qtd === Math.max(...arr) ? '#E68C3A' : '#336021'
                ),
              },
            ],
          }}
          options={{
            plugins: {
              legend: { display: false },
              tooltip: { enabled: true },
              datalabels: {
                anchor: 'end',
                align: 'top',
                color: temaAtual.texto,
                font: { weight: 'bold' as const, size: 11 },
                formatter: (value) => value,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: { beginAtZero: true, ticks: { precision: 0 } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default GraficoModelosMaisVendidos;