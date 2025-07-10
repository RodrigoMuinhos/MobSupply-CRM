import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '../../../context/AuthContext';

interface PreLoginScreenProps {
  onContinuar?: () => void;
}

const PreLoginScreen: React.FC<PreLoginScreenProps> = ({ onContinuar }) => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const usuario = JSON.parse(localStorage.getItem('USUARIO_ATUAL') || '{}');
  const nome = usuario?.nome || 'Usuário';
  const avatar = usuario?.avatar || null;
  const primeiroNome = nome.split(' ')[0];

  const executarLogin = () => {
    login(usuario?.tipo);
    navigate('/');
    if (onContinuar) onContinuar();
  };

  const trocarUsuario = () => {
    localStorage.removeItem('LOGIN_LEMBRADO');
    localStorage.removeItem('USUARIO_ATUAL');
    localStorage.removeItem('tipoUsuario');
    if (onContinuar) onContinuar(); // volta para LoginPage
  };

  // Pressionar Enter para entrar
  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') executarLogin();
    };

    // Verificar se houve logout via settings (condição externa)
    const forcarLogout = localStorage.getItem('FORCAR_LOGOUT');
    if (forcarLogout === 'true') {
      trocarUsuario();
      localStorage.removeItem('FORCAR_LOGOUT');
    }

    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative px-4"
      style={{
        backgroundImage: 'url(/loginback/transparencia.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backdropFilter: 'blur(60px)',
        backgroundColor: 'rgba(0,0,0,0.8)',
      }}
    >
      {/* Botão para trocar de login */}
      <button
        onClick={trocarUsuario}
        className="absolute top-6 right-6 flex items-center gap-2 text-white hover:text-orange-400"
        title="Trocar de usuário"
      >
        <FaSignOutAlt className="text-xl" />
        <span className="hidden md:inline">Trocar Usuário</span>
      </button>

      {/* Avatar com transparência */}
      <div className="w-56 h-56 rounded-full bg-white/10 backdrop-blur-2xl flex items-center justify-center shadow-2xl mb-8 border-4 border-orange-300">
        {avatar ? (
          <img
            src={avatar}
            alt="Avatar"
            className="w-full h-full rounded-full object-cover opacity-90"
          />
        ) : (
          <FaUser className="text-[120px] text-orange-300 opacity-70" />
        )}
      </div>

      {/* Saudação */}
      <h1 className="text-white text-3xl mb-6">
        Olá, <span className="font-bold text-orange-400">{primeiroNome}</span>
      </h1>

      {/* Botão Entrar */}
      <button
        onClick={executarLogin}
        className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-xl text-lg font-semibold shadow-lg transition"
      >
        Entrar
      </button>
    </div>
  );
};

export default PreLoginScreen;
