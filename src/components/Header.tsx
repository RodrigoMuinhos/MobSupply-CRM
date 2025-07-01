import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlusCircle,
  FaBell,
  FaUserCircle,
  FaMoon,
  FaSun,
  FaSatelliteDish,
} from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const { temaSelecionado, setTemaSelecionado, temaAtual } = useTheme();

  const alternarTema = () => {
    if (temaSelecionado === 'dark') setTemaSelecionado('cyber');
    else if (temaSelecionado === 'cyber') setTemaSelecionado('classic');
    else setTemaSelecionado('dark');
  };

  const getIconeTema = () => {
    switch (temaSelecionado) {
      case 'dark':
        return <FaMoon />;
      case 'cyber':
        return <FaSatelliteDish />;
      case 'classic':
        return <FaSun />;
      default:
        return <FaMoon />;
    }
  };

  return (
    <header
      className="w-full shadow-md z-50 backdrop-blur-md relative"
      style={{
        background: temaAtual.cardGradient || temaAtual.card,
        color: temaAtual.texto,
        borderBottom: `1px solid ${temaAtual.destaque}`,
      }}
    >
      {/* Container com altura fixa sem padding vertical */}
      <div className="relative w-full h-[64px] px-4">
        {/* Logo fixa à esquerda */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-extrabold tracking-tight">
          MOBsupply
        </div>

        {/* Ações fixas à direita */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-4">
          <button
            onClick={() => navigate('/vendas/nova')}
            className="flex items-center gap-2 px-3 py-1 rounded font-semibold text-sm hover:scale-105 transition"
            style={{
              backgroundColor: temaAtual.destaque,
              color: temaAtual.textoBranco,
            }}
          >
            <FaPlusCircle />
            <span className="hidden sm:inline">Nova Venda</span>
          </button>

          <button
            onClick={alternarTema}
            className="text-xl hover:opacity-80 transition"
            style={{ color: temaAtual.texto }}
          >
            {getIconeTema()}
          </button>

          <FaBell
            className="text-xl cursor-pointer hover:opacity-80 transition"
            style={{ color: temaAtual.texto }}
          />
          <FaUserCircle
            className="text-2xl cursor-pointer hover:opacity-80 transition"
            style={{ color: temaAtual.texto }}
          />
        </div>
      </div>
    </header>
  );
};

export default Header;