import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FaChartPie,
  FaShoppingCart,
  FaWarehouse,
  FaUsers,
  FaDollarSign,
  FaCogs,
  FaBox,
  FaCheckCircle,
  FaChartBar,
  FaBook,
  FaBoxes,
  FaTruck,
} from 'react-icons/fa';
import {
  FaLinesLeaning,
  FaMoneyBills,
  FaPeopleGroup,
  FaUserShield,
} from 'react-icons/fa6';
import { useTheme } from '../context/ThemeContext';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleSidebar = () => setIsOpen(!isOpen);
  const { temaAtual } = useTheme();

  const tipoUsuario = localStorage.getItem('tipoUsuario');
  const isFiliado = tipoUsuario === 'filiado';
  const isVendedor = tipoUsuario === 'vendedor';
  const isADM = tipoUsuario === 'adm';

  const sections = [
    {
      title: 'Dashboard',
      items: [
        { label: 'Painel Geral', icon: <FaChartPie />, to: '/' },
      ],
    },
    {
      title: 'Vendas',
      items: [
        { label: 'Nova Venda', icon: <FaMoneyBills />, to: '/vendas/nova', isFirst: true },
        { label: 'Lista Clientes', icon: <FaUsers />, to: '/clientes/lista' },
        { label: 'Cadastro Clientes', icon: <FaUsers />, to: '/clientes/cadastro' },
      ],
    },
    {
      title: 'Estoque',
      items: [
        { label: 'Visão Estoque', icon: <FaWarehouse />, to: '/estoque/visao', isFirst: true },
        { label: 'Estoque Atual', icon: <FaBox />, to: '/estoque/EstoqueAtual' },
        ...(!isVendedor ? [{ label: 'Histórico Vendas', icon: <FaShoppingCart />, to: '/vendas/historico' }] : []),
      ],
    },
    {
      title: 'Financeiro',
      items: [
        { label: 'Relatório de vendas', icon: <FaDollarSign />, to: '/financeiro/vendas', isFirst: true },
        ...(!isFiliado && !isVendedor ? [
          { label: 'Gastos Estoque', icon: <FaLinesLeaning />, to: '/financeiro/gastos' }
        ] : []),
      ],
    },
    ...(!isFiliado && !isVendedor ? [{
      title: 'Configurações',
      items: [
        { label: 'Produtos', icon: <FaCogs />, to: '/config/produtos', isFirst: true },
        { label: 'Equipe', icon: <FaPeopleGroup />, to: '/config/equipe' },
        { label: 'Usuários', icon: <FaUserShield />, to: '/config/usuarios' },
      ],
    }] : []),
    ...(!isFiliado && !isVendedor ? [{
      title: 'Análise',
      items: [
        { label: 'Biblioteca de Dados', icon: <FaBook />, to: '/analise/biblioteca/dados', isFirst: true },
        { label: 'Clientes Validados', icon: <FaCheckCircle />, to: '/analise/biblioteca/validados' },
        { label: 'Gráficos', icon: <FaChartBar />, to: '/analise/biblioteca/graficos' },
      ],
    }] : []),
    {
      title: '',
      items: [
        ...(!isFiliado && !isVendedor ? [{ label: 'Atacado', icon: <FaBoxes />, to: '/atacado', isFirst: true }] : []),
        ...(!isFiliado && !isVendedor ? [{ label: 'Envios', icon: <FaTruck />, to: '/distribuicao' }] : []),
      ],
    },
  ];

  return (
    <div
      className={`h-screen shadow-md flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}
      style={{
        backgroundColor: temaAtual.card,
        color: temaAtual.texto,
      }}
    >
      <button
        onClick={toggleSidebar}
        className="h-12 flex items-center justify-center transition-colors"
        style={{
          backgroundColor: temaAtual.fundo,
          color: temaAtual.destaque,
        }}
      >
        {isOpen ? '←' : '→'}
      </button>

      <nav className="flex flex-col mt-4">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="mb-3">
            {sIdx !== 0 && <div className="border-t border-gray-300 my-2 mx-2" />}
            {section.items.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3 py-2 rounded-md transition-all group ${
                    isActive ? 'text-white' : 'hover:text-white'
                  }`
                }
                style={({ isActive }) => ({
                  backgroundColor: isActive ? temaAtual.destaque : 'transparent',
                  color: isActive ? '#fff' : item.isFirst ? temaAtual.texto : '#999',
                })}
              >
                <div className="text-[22px] relative group">
                  {item.icon}
                  {!isOpen && (
                    <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-black text-white text-xs rounded px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      {item.label}
                    </span>
                  )}
                </div>
                {isOpen && (
                  <span className="whitespace-nowrap text-sm group-hover:font-semibold">
                    {item.label}
                  </span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
