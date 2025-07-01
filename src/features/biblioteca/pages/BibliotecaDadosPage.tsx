import React from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';
import CardDisparosPorDia from '../components/CardDisparosPorDia';
import CardProporcaoStatus from '../components/CardProporcaoStatus';
import CardBarraConferidos from '../components/CardBarraConferidos';

const BibliotecaDadosPage: React.FC = () => {
  const location = useLocation();

  const abas = [
    { label: 'Biblioteca de Dados', path: 'dados' },
    { label: 'Clientes Validados', path: 'validados' },
    { label: 'Gráficos', path: 'graficos' },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Biblioteca de Dados</h1>

      {/* Abas de navegação internas (opcional) */}
      <div className="flex gap-4 mb-6 border-b pb-2">
        {abas.map((aba) => (
          <NavLink
            key={aba.path}
            to={aba.path}
            className={({ isActive }) =>
              `px-4 py-2 rounded text-sm font-medium ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-600 hover:text-blue-600'
              }`
            }
          >
            {aba.label}
          </NavLink>
        ))}
      </div>

      {/* Cards de gráficos no topo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CardDisparosPorDia />
        <CardProporcaoStatus />
        <CardBarraConferidos />
      </div>

      {/* Conteúdo dinâmico (dados, validados ou gráficos) */}
      <Outlet />
    </div>
  );
};

export default BibliotecaDadosPage;