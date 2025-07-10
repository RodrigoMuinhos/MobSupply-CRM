import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, Legend, PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FaDollarSign, FaBoxes, FaChartLine, FaMoneyBillWave } from 'react-icons/fa';
import ResumoCard from '../../../components/ResumoCard';
import { useTheme } from '../../../context/ThemeContext';

const STORAGE_KEY = 'estoque_local';

const VisaoEstoquePage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [resumo, setResumo] = useState({
    skinkCaixas: 0,
    vxCaixas: 0,
    skinkPago: 0,
    vxPago: 0,
    skinkVenda: 0,
    vxVenda: 0
  });

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return;

    const estoque = JSON.parse(saved);
    let skinkCaixas = 0, skinkPago = 0;
    let vxCaixas = 0, vxPago = 0;

    ['RL', 'RLF', 'RS', 'MGR', 'M2'].forEach(tipo => {
      estoque.skink?.[tipo]?.forEach((item: any) => {
        skinkCaixas += item.quantidade_em_estoque;
        skinkPago += item.quantidade_em_estoque * item.preco_unit;
      });
      estoque.vxcraft?.[tipo]?.forEach((item: any) => {
        vxCaixas += item.quantidade_em_estoque;
        vxPago += item.quantidade_em_estoque * item.preco_unit;
      });
    });

    const skinkVenda = skinkCaixas * 160;
    const vxVenda = vxCaixas * 160;

    setResumo({ skinkCaixas, vxCaixas, skinkPago, vxPago, skinkVenda, vxVenda });
  }, []);

  const graficoLinha = [
    { marca: 'SKINK INK', caixas: resumo.skinkCaixas, pago: resumo.skinkPago },
    { marca: 'VX CRAFT', caixas: resumo.vxCaixas, pago: resumo.vxPago }
  ];

  const graficoPizza = [
    { nome: 'SKINK INK', value: resumo.skinkCaixas },
    { nome: 'VX CRAFT', value: resumo.vxCaixas }
  ];

  const graficoBarras = [
    { nome: 'SKINK INK', value: resumo.skinkPago },
    { nome: 'VX CRAFT', value: resumo.vxPago }
  ];

  const graficoPorTipo: any[] = [];
  ['RL', 'RLF', 'RS', 'MGR', 'M2'].forEach((tipo) => {
    const sk = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').skink?.[tipo] || [];
    const vx = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}').vxcraft?.[tipo] || [];
    graficoPorTipo.push({
      tipo,
      skink: sk.reduce((acc: number, i: any) => acc + i.quantidade_em_estoque, 0),
      vxcraft: vx.reduce((acc: number, i: any) => acc + i.quantidade_em_estoque, 0),
    });
  });

  return (
    <div
      className="p-6 space-y-10 transition-all duration-300"
      style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}
    >
      <h1 className="text-2xl font-bold mb-4" style={{ color: temaAtual.destaque }}>
        Visão de Estoque - MOB Supply
      </h1>

      {/* Cards Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ResumoCard icon={<FaBoxes />} label="SKINK INK - Pago" value={`R$ ${resumo.skinkPago.toFixed(2)}`} />
        <ResumoCard icon={<FaBoxes />} label="VX CRAFT - Pago" value={`R$ ${resumo.vxPago.toFixed(2)}`} />
        <ResumoCard icon={<FaDollarSign />} label="Prospecção Total" value={`R$ ${(resumo.skinkVenda + resumo.vxVenda).toFixed(2)}`} />
        <ResumoCard icon={<FaMoneyBillWave />} label="Lucro Estimado" value={`R$ ${((resumo.skinkVenda + resumo.vxVenda) - (resumo.skinkPago + resumo.vxPago)).toFixed(2)}`} />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Linhas */}
        <div className="p-4 rounded shadow" style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: temaAtual.destaque }}>Caixas vs Valor Pago</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={graficoLinha}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="marca" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="caixas" stroke={temaAtual.destaque} />
              <Line type="monotone" dataKey="pago" stroke={temaAtual.contraste || '#B22222'} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza */}
        <div className="p-4 rounded shadow" style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: temaAtual.destaque }}>Proporção de Caixas</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={graficoPizza}
                dataKey="value"
                nameKey="nome"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                <Cell fill={temaAtual.destaque} />
                <Cell fill={temaAtual.contraste || '#B22222'} />
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras */}
        <div className="p-4 rounded shadow" style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: temaAtual.destaque }}>Valor Pago por Marca</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficoBarras}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill={temaAtual.contraste || '#46e08b'} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Barras por Subcategoria */}
        <div className="p-4 rounded shadow" style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}>
          <h2 className="text-lg font-bold mb-2" style={{ color: temaAtual.destaque }}>Caixas por Subcategoria</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={graficoPorTipo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="tipo" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="skink" fill={temaAtual.destaque} />
              <Bar dataKey="vxcraft" fill={temaAtual.contraste || '#B22222'} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default VisaoEstoquePage;