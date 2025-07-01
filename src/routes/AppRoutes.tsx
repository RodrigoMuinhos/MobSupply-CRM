import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layout principal
import MainLayout from '../layouts/MainLayout';

// Páginas gerais
import Dashboard from '../pages/Dashboard';
import NotFound from '../pages/NotFound';

// Vendas
import NovaVendaPage from '../features/vendas/pages/NovaVendaPage';
import HistoricoVendasPage from '../features/vendas/pages/HistoricoVendasPage';

// Estoque
import VisaoEstoquePage from '../features/estoque/pages/VisaoEstoquePage';
import EstoqueAtualPage from '../features/estoque/pages/EstoqueAtualPage';

// Clientes
import ClientesPage from '../pages/ClientesPage';
import CadastroClientePage from '../features/clientes/pages/CadastroClientePage';
import ListaClientesPage from '../features/clientes/pages/ListaClientesPage';

// Financeiro
import RelatorioVendaPage from '../features/financeiro/pages/RelatorioVendaPage';
import GastosEstoquePage from '../features/financeiro/pages/GastosEstoquePage';

// Configurações
import ProdutosConfigPage from '../features/config/pages/ProdutosConfigPage';
import EquipeConfigPage from '../features/config/pages/EquipeConfigPage';

// Biblioteca de Dados
import BibliotecaDadosPage from '../features/biblioteca/pages/BibliotecaDadosPage';
import TabelaDadosPage from '../features/biblioteca/pages/TabelaDadosPage';
import GraficosDadosPage from '../features/biblioteca/pages/GraficosDadosPage';
import ClientesValidadosPage from '../features/biblioteca/pages/ClientesValidadosPage';

// Atacado
import AtacadoPage from '../features/atacado/pages/AtacadoPage';

// Distribuição (Envios)
import DistribuicaoPage from '../features/atacado/pages/DistribuicaoPage'; // ✅ nova importação

const AppRoutes = () => {
  return (
    <Routes>
      {/* Layout com Sidebar */}
      <Route element={<MainLayout />}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />

        {/* Vendas */}
        <Route path="/vendas/nova" element={<NovaVendaPage />} />
        <Route path="/vendas/historico" element={<HistoricoVendasPage />} />

        {/* Estoque */}
        <Route path="/estoque/visao" element={<VisaoEstoquePage />} />
        <Route path="/estoque/estoqueAtual" element={<EstoqueAtualPage />} />

        {/* Clientes */}
        <Route path="/clientes" element={<ClientesPage />} />
        <Route path="/clientes/cadastro" element={<CadastroClientePage />} />
        <Route path="/clientes/lista" element={<ListaClientesPage />} />

        {/* Financeiro */}
        <Route path="/financeiro/vendas" element={<RelatorioVendaPage />} />
        <Route path="/financeiro/gastos" element={<GastosEstoquePage />} />

        {/* Configurações */}
        <Route path="/config/produtos" element={<ProdutosConfigPage />} />
        <Route path="/config/equipe" element={<EquipeConfigPage />} />

        {/* Biblioteca de Dados */}
        <Route path="/analise/biblioteca" element={<BibliotecaDadosPage />}>
          <Route index element={<Navigate to="dados" replace />} />
          <Route path="dados" element={<TabelaDadosPage />} />
          <Route path="validados" element={<ClientesValidadosPage />} />
          <Route path="graficos" element={<GraficosDadosPage />} />
        </Route>

        {/* Atacado */}
        <Route path="/atacado" element={<AtacadoPage />} />

        {/* Distribuição */}
        <Route path="/distribuicao" element={<DistribuicaoPage />} /> {/* ✅ nova rota */}
      </Route>

      {/* Página 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;