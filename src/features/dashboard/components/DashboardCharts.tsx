'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

import ResumoCards from '../components/ResumoCard';
import GraficosCentrais from '../components/GraficosCentrais';
import Rankings from '../components/Rankings';
import Conquistas from '../components/Conquistas';
import BotoesFlutuantes from '../components/BotoesFlutuantes';

import {
  VendasMes,
  VendasDia,
  ProdutoTop,
  CategoriaEstoque,
  MaiorComprador,
} from '../../../types/dashboardTypes';

const DashboardCharts: React.FC = () => {
  const { temaAtual } = useTheme();
  const navigate = useNavigate();

  const [totalVendas, setTotalVendas] = useState(0);
  const [totalClientes, setTotalClientes] = useState(0);
  const [estoqueAtual, setEstoqueAtual] = useState(0);
  const [valorTotal, setValorTotal] = useState(0);
  const [vendasPorMes, setVendasPorMes] = useState<VendasMes[]>([]);
  const [vendasPorDia, setVendasPorDia] = useState<VendasDia[]>([]);
  const [topProdutos, setTopProdutos] = useState<ProdutoTop[]>([]);
  const [categorias, setCategorias] = useState<CategoriaEstoque[]>([]);
  const [maiorComprador, setMaiorComprador] = useState<MaiorComprador>({ nome: '', total: 0 });
  const [produtoTop, setProdutoTop] = useState<ProdutoTop>({ nome: '', quantidade: 0 });

  // 🧠 Função para normalizar qualquer data em MM/YYYY e DD/MM/YYYY
const normalizarData = (entrada: string): { chaveMes: string; chaveDia: string } | null => {
  if (!entrada) return null;

  let data;
  if (entrada.includes('/')) {
    const partes = entrada.split('/');
    if (partes.length === 3) {
      const [dia, mes, ano] = partes;
      data = new Date(`${ano}-${mes}-${dia}T00:00:00`);
    }
  } else {
    data = new Date(entrada);
  }

  if (!data || isNaN(data.getTime())) return null;

  // 🔧 Corrigir para horário de Fortaleza (GMT-3)
  data.setHours(data.getHours() + 3);

  const dia = String(data.getDate()).padStart(2, '0');
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const ano = data.getFullYear();

  return {
    chaveMes: `${mes}/${ano}`,
    chaveDia: `${dia}/${mes}/${ano}`,
  };
};

  useEffect(() => {
    const vendas = JSON.parse(localStorage.getItem('vendasMOB') || '[]');
    const clientes = JSON.parse(localStorage.getItem('clientes') || '[]');
    const estoque = JSON.parse(localStorage.getItem('estoqueMOB') || '{}');

    setTotalVendas(vendas.length);
    setTotalClientes(clientes.length);

    let valorTotalCalculado = 0;
    const compradores: Record<string, number> = {};
    const produtos: Record<string, number> = {};
    const categoriasData: Record<string, number> = {};
    const porMes: Record<string, number> = {};
    const porDia: Record<string, number> = {};

    vendas.forEach((venda: any) => {
      const total = parseFloat(venda.total_final || 0);
      valorTotalCalculado += total;

      const nome = venda.cliente?.nome || 'Desconhecido';
      compradores[nome] = (compradores[nome] || 0) + 1;

      const normalizado = normalizarData(venda.data);
      if (normalizado) {
        porMes[normalizado.chaveMes] = (porMes[normalizado.chaveMes] || 0) + total;
        porDia[normalizado.chaveDia] = (porDia[normalizado.chaveDia] || 0) + total;
      }

      venda.itens?.forEach((item: any) => {
        produtos[item.nome] = (produtos[item.nome] || 0) + item.quantidade;
        const grupo = item.grupo || 'Outros';
        categoriasData[grupo] = (categoriasData[grupo] || 0) + item.quantidade;
      });
    });

    setValorTotal(valorTotalCalculado);

    const pad = (n: string) => n.padStart(2, '0');

    const mesesOrdenados = Object.keys(porMes).sort((a, b) => {
      const [ma, aa] = a.split('/');
      const [mb, ab] = b.split('/');
      return new Date(`${aa}-${pad(ma)}-01`).getTime() - new Date(`${ab}-${pad(mb)}-01`).getTime();
    });
    setVendasPorMes(mesesOrdenados.map((mes) => ({ mes, valor: porMes[mes] })));

    const diasOrdenados = Object.keys(porDia).sort((a, b) => {
      const [da, ma, aa] = a.split('/');
      const [db, mb, ab] = b.split('/');
      return new Date(`${aa}-${pad(ma)}-${pad(da)}`).getTime() - new Date(`${ab}-${pad(mb)}-${pad(db)}`).getTime();
    });
    setVendasPorDia(diasOrdenados.map((dia) => ({ dia, valor: porDia[dia] })));

    setTopProdutos(
      Object.entries(produtos)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([nome, quantidade]) => ({ nome, quantidade }))
    );

    setCategorias(
      Object.entries(categoriasData).map(([categoria, quantidade]) => ({
        categoria,
        quantidade,
      }))
    );

    const topCliente = Object.entries(compradores).sort((a, b) => b[1] - a[1])[0];
    const topProduto = Object.entries(produtos).sort((a, b) => b[1] - a[1])[0];

    setMaiorComprador({ nome: topCliente?.[0] || '', total: topCliente?.[1] || 0 });
    setProdutoTop({ nome: topProduto?.[0] || '', quantidade: topProduto?.[1] || 0 });

    // Calcular estoque total
    let totalEstoque = 0;
    ['skink', 'vxcraft'].forEach((marca) => {
      const grupos = estoque[marca] || {};
      (Object.values(grupos) as any[][]).forEach((lista) => {
        lista.forEach((item: any) => {
          totalEstoque += item?.quantidade_em_estoque || 0;
        });
      });
    });
    setEstoqueAtual(totalEstoque);
  }, []);

  return (
    <div
      className="min-h-screen p-6 transition-all duration-300 backdrop-blur-md bg-opacity-60"
      style={{
        background: temaAtual.cardGradient,
        color: temaAtual.texto,
      }}
    >
      <h1 className="text-2xl font-bold mb-6 text-center tracking-wider" style={{ color: temaAtual.destaque }}>
        Painel Geral - MOB Supply
      </h1>

      <GraficosCentrais
        vendasPorMes={vendasPorMes}
        vendasPorDia={vendasPorDia}
        topProdutos={topProdutos}
        categorias={categorias}
      />

      <Rankings maiorComprador={maiorComprador} produtoTop={produtoTop} />

      <Conquistas totalClientes={totalClientes} totalVendas={totalVendas} />

      <BotoesFlutuantes />
    </div>
  );
};

export default DashboardCharts;