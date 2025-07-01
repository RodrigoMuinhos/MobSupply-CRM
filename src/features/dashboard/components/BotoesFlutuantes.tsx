'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaUser,
  FaBoxOpen,
  FaDollarSign,
  FaWhatsapp
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

const BotoesFlutuantes: React.FC = () => {
  const navigate = useNavigate();
  const { temaAtual } = useTheme();
  const [estoqueBaixo, setEstoqueBaixo] = useState(0);

  useEffect(() => {
    const dados = localStorage.getItem('estoqueMOB');
    if (!dados) return;

    const estoque = JSON.parse(dados);
    let totalCriticos = 0;

    ['skink', 'vxcraft'].forEach((marca) => {
      const grupos = estoque[marca] || {};
      Object.values(grupos).forEach((bloco: any) => {
        if (Array.isArray(bloco)) {
          bloco.forEach((item: any) => {
            if ((item?.quantidade_em_estoque || 0) < 3) {
              totalCriticos++;
            }
          });
        }
      });
    });

    setEstoqueBaixo(totalCriticos);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 animate-fade-in">
      {/* Botão: Nova Venda */}
      <div className="relative group">
        <button
          onClick={() => navigate('/vendas/nova')}
          className="p-3 rounded-full shadow-lg hover:scale-110 transition"
          style={{ backgroundColor: temaAtual.destaque, color: temaAtual.textoClaro }}
        >
          <FaPlus />
        </button>
      </div>

      {/* Botão: Estoque Atual */}
      <div className="relative group">
        <button
          onClick={() => navigate('/estoque/EstoqueAtual')}
          className="p-3 rounded-full shadow-lg hover:scale-110 transition relative"
          style={{ backgroundColor: temaAtual.contraste, color: temaAtual.textoClaro }}
        >
          <FaBoxOpen />
          {estoqueBaixo > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {estoqueBaixo}
            </span>
          )}
        </button>
      </div>

      {/* Botão: Lista de Clientes */}
      <div className="relative group">
        <button
          onClick={() => navigate('/clientes/lista')}
          className="p-3 rounded-full shadow-lg hover:scale-110 transition"
          style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}
        >
          <FaUser />
        </button>
      </div>

      {/* Botão: Relatório de Vendas */}
      <div className="relative group">
        <button
          onClick={() => navigate('/financeiro/vendas')}
          className="p-3 rounded-full shadow-lg hover:scale-110 transition"
          style={{ backgroundColor: temaAtual.fundoAlt, color: temaAtual.texto }}
        >
          <FaDollarSign />
        </button>
      </div>

      {/* Botão: WhatsApp */}
      <div className="relative group">
        <button
          onClick={() => window.open('https://wa.me/5585997254989', '_blank')}
          className="p-3 rounded-full shadow-lg hover:scale-110 transition flex items-center justify-center"
          style={{ backgroundColor: '#25D366', color: '#ffffff' }} // WhatsApp verde
        >
          <FaWhatsapp className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default BotoesFlutuantes;