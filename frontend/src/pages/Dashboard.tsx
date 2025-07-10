import React, { useEffect, useState } from 'react';
import {
  FaUsers, FaBoxOpen, FaShoppingCart, FaDollarSign, FaTrash, FaDownload, FaUpload
} from 'react-icons/fa';
import JSZip from 'jszip';
import { useTheme } from '../context/ThemeContext';
import DashboardCharts from '../features/dashboard/components/DashboardCharts';

const Dashboard: React.FC = () => {
  const { temaAtual } = useTheme();

  const [clientes, setClientes] = useState(0);
  const [vendas, setVendas] = useState(0);
  const [estoqueTotal, setEstoqueTotal] = useState(0);
  const [receita, setReceita] = useState(0);

  const tipoUsuario = localStorage.getItem('tipoUsuario');

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

  const exportarJSON = () => {
    const zip = new JSZip();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          zip.file(`${key}.json`, value);
        }
      }
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(content);
      link.download = 'backup-localStorage.zip';
      link.click();
    });
  };

  const importarJSON = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const key = file.name.replace('.json', '');
      const text = await file.text();
      try {
        localStorage.setItem(key, text);
      } catch (err) {
        console.error('Erro ao importar arquivo:', key, err);
      }
    }

    alert('Importação concluída. Recarregue a página.');
  };

  const limparLocalStorage = () => {
    const confirmado = window.confirm(
      'Tem certeza que deseja apagar TODO o histórico? Essa ação não pode ser desfeita.'
    );
    if (confirmado) {
      localStorage.clear();
      alert('Todos os dados foram apagados. A página será recarregada.');
      window.location.reload();
    }
  };

  return (
    <div
      className="p-6 min-h-screen transition-all duration-300"
      style={{
        backgroundColor: temaAtual.fundo,
        color: temaAtual.texto,
      }}
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold" style={{ color: temaAtual.destaque }}>
          Painel Geral - MOB Supply
        </h1>

        <div className="flex gap-2 items-center">
          {/* Exportar JSON */}
          <button
            onClick={exportarJSON}
            title="Exportar JSON"
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.destaque,
              border: `1px solid ${temaAtual.destaque}`,
            }}
          >
            <FaDownload />
          </button>

          {/* Importar JSON */}
          <label
            title="Importar JSON"
            className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-105"
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.destaque,
              border: `1px solid ${temaAtual.destaque}`,
            }}
          >
            <FaUpload />
            <input
              type="file"
              multiple
              accept=".json"
              onChange={importarJSON}
              className="hidden"
            />
          </label>

          {/* Limpar Histórico (ADM) */}
          {tipoUsuario === 'adm' && (
            <button
              onClick={limparLocalStorage}
              title="Limpar Histórico"
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{
                backgroundColor: '#b91c1c',
                color: '#fff',
              }}
            >
              <FaTrash />
            </button>
          )}
        </div>
      </div>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <ResumoCard icon={<FaUsers />} label="Clientes Ativos" value={clientes} />
        <ResumoCard icon={<FaShoppingCart />} label="Vendas Realizadas" value={vendas} />
        <ResumoCard icon={<FaBoxOpen />} label="Itens em Estoque" value={estoqueTotal} />
        <ResumoCard
          icon={<FaDollarSign />}
          label="Receita Estimada"
          value={`R$ ${receita.toLocaleString('pt-BR')}`}
        />
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
        borderColor: temaAtual.destaque,
      }}
    >
      <div className="text-3xl" style={{ color: temaAtual.destaque }}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-400">{label}</p>
        <p className="text-xl font-bold" style={{ color: temaAtual.texto }}>
          {value}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
