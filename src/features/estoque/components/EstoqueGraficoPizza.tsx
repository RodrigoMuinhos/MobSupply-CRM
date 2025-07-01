import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { ItemEstoque } from '../../../types/estoque';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props {
  itens: ItemEstoque[];
}

const EstoqueGraficoPizza: React.FC<Props> = ({ itens }) => {
  const categorias = ['Descartáveis', 'Medicamentos', 'Limpeza'];

  const dadosPorCategoria = categorias.map(categoria =>
    itens.filter(item => item.categoria === categoria).length
  );

  const data = {
    labels: categorias,
    datasets: [
      {
        label: 'Qtd de Itens',
        data: dadosPorCategoria,
        backgroundColor: ['#34D399', '#60A5FA', '#FBBF24'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded shadow border mb-8">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Distribuição por Categoria</h2>
      <div className="max-w-xs mx-auto">
        <Pie data={data} />
      </div>
    </div>
  );
};

export default EstoqueGraficoPizza;