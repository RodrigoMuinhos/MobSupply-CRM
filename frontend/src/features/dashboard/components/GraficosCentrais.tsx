import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import 'dayjs/locale/pt-br';

import { useTheme } from '../../../context/ThemeContext';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);
dayjs.locale('pt-br');
dayjs.tz.setDefault('America/Fortaleza');

// Tipagens
type VendaMensal = { mes: string; valor: number };
type VendaDiaria = { dia: string; valor: number };
type ProdutoTop = { nome: string; quantidade: number };
type Categoria = { categoria: string; quantidade: number };

type Props = {
  vendasPorMes: VendaMensal[];
  vendasPorDia: VendaDiaria[];
  topProdutos: ProdutoTop[];
  categorias: Categoria[];
};

// Parsing seguro de mês/ano
const formatarMesAno = (data: string): string => {
  if (!data || typeof data !== 'string') return 'Inválido';
  const formatos = ['MM/YYYY', 'M/YYYY', 'DD/MM/YYYY', 'D/M/YYYY', 'YYYY-MM-DD'];

  for (const formato of formatos) {
    const instancia = dayjs(data, formato, 'pt-br', true).tz('America/Fortaleza');
    if (instancia.isValid()) return instancia.format('MM/YYYY');
  }

  return 'Inválido';
};

// Parsing seguro de dia
const formatarDia = (data: string): string => {
  if (!data || typeof data !== 'string') return 'Inválido';
  const formatos = ['DD/MM/YYYY', 'D/M/YYYY', 'YYYY-MM-DD'];

  for (const formato of formatos) {
    const instancia = dayjs(data, formato, 'pt-br', true).tz('America/Fortaleza');
    if (instancia.isValid()) return instancia.format('DD/MM');
  }

  return 'Inválido';
};

const GraficosCentrais: React.FC<Props> = ({
  vendasPorMes,
  vendasPorDia,
  topProdutos,
  categorias,
}) => {
  const { temaAtual } = useTheme();

  const dadosMesFormatados = vendasPorMes
    .filter(item => !!item.mes && !!item.valor)
    .map(item => ({
      mes: formatarMesAno(item.mes),
      valor: Number(item.valor.toFixed(2)),
    }));

  const dadosDiaFormatados = vendasPorDia
    .filter(item => !!item.dia && !!item.valor)
    .map(item => ({
      dia: formatarDia(item.dia),
      valor: Number(item.valor.toFixed(2)),
    }));

  const gerarCorCategoria = (i: number) => {
    const base = [
      temaAtual.destaque,
      temaAtual.contraste,
      temaAtual.textoBranco,
      '#888888',
    ];
    return base[i % base.length];
  };

  const cardClasses = `rounded-lg shadow p-4 border backdrop-blur-md bg-opacity-60`;
  const cardStyle = {
    background: temaAtual.cardGradient || temaAtual.card,
    color: temaAtual.texto,
    borderColor: temaAtual.destaque,
  };

  return (
    <>
      {/* Faturamento Mensal e Top Produtos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={cardClasses} style={cardStyle}>
          <h2 className="text-lg font-bold mb-2">Faturamento Mensal (R$)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={dadosMesFormatados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor" fill={temaAtual.destaque} name="Faturamento" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={cardClasses} style={cardStyle}>
          <h2 className="text-lg font-bold mb-2">Top Produtos Vendidos</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={topProdutos} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="nome" type="category" />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" fill={temaAtual.contraste} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Receita Diária e Categorias */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className={cardClasses} style={cardStyle}>
          <h2 className="text-lg font-bold mb-2">Evolução da Receita Diária</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dadosDiaFormatados}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dia" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="valor"
                stroke={temaAtual.destaque}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className={cardClasses} style={cardStyle}>
          <h2 className="text-lg font-bold mb-2">Distribuição por Categoria</h2>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={categorias}
                dataKey="quantidade"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {categorias.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={gerarCorCategoria(i)} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default GraficosCentrais;