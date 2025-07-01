import React, { useEffect, useState } from 'react';
import {
  FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext'; // IMPORTANTE
import DashboardCharts from '../features/dashboard/components/DashboardCharts';

const Dashboard: React.FC = () => {
  const { temaAtual } = useTheme(); // HOOK DO TEMA

  const [clientes, setClientes] = useState(0);
  const [vendas, setVendas] = useState(0);
  const [estoqueTotal, setEstoqueTotal] = useState(0);
  const [receita, setReceita] = useState(0);

  useEffect(() => {
    const clientesData = JSON.parse(localStorage.getItem('clientes') || '[]');
    const cpfsUnicos = new Set(clientesData.map((c: any) => c.cpf));
    setClientes(cpfsUnicos.size);

    const vendasData = JSON.parse(localStorage.getItem('vendasMOB') || '[]');
    setVendas(vendasData.length);

    const receitaTotal = vendasData.reduce(
      (acc: number, v: any) => acc + (v.total_final || 0),
      0
    );
    setReceita(receitaTotal);

    const estoqueData = JSON.parse(localStorage.getItem('estoqueMOB') || '{}');

    let total = 0;
    ['skink', 'vxcraft'].forEach((marca) => {
      const categorias = estoqueData[marca];
      if (categorias) {
        Object.entries(categorias).forEach(([_, lista]: [string, any]) => {
          if (Array.isArray(lista)) {
            lista.forEach((item: any) => {
              total += Number(item.quantidade_em_estoque || 0);
            });
          }
        });
      }
    });

    setEstoqueTotal(total);
  }, []);

  return (
    <div
      className="p-6 min-h-screen transition-all duration-300"
      style={{
        backgroundColor: temaAtual.fundo,
        color: temaAtual.texto
      }}
    >
      <h1
        className="text-3xl font-bold mb-6 transition-colors"
        style={{ color: temaAtual.destaque }}
      >
        Painel Geral - MOB Supply
      </h1>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ResumoCard icon={<FaUsers />} label="Clientes Ativos" value={clientes} />
        <ResumoCard icon={<FaShoppingCart />} label="Vendas Realizadas" value={vendas} />
        <ResumoCard icon={<FaBoxOpen />} label="Itens em Estoque" value={estoqueTotal} />
        <ResumoCard icon={<FaDollarSign />} label="Receita Estimada" value={`R$ ${receita.toLocaleString('pt-BR')}`} />
      </div>

      <DashboardCharts />
    </div>
  );
};

const ResumoCard = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) => {
  const { temaAtual } = useTheme();

  return (
    <div
      className="rounded-lg shadow-md p-5 flex items-center gap-4 border-l-4 transition-all duration-300"
      style={{
        backgroundColor: temaAtual.card,
        color: temaAtual.texto,
        borderColor: temaAtual.destaque
      }}
    >
      <div className="text-3xl" style={{ color: temaAtual.destaque }}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-bold" style={{ color: temaAtual.texto }}>{value}</p>
      </div>
    </div>
  );
};

export default Dashboard;