'use client';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaUser,
  FaBoxOpen,
  FaDollarSign,
  FaWhatsapp,
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

  // Estilo padrão dos botões flutuantes
  const estiloBotao = (cor: string, texto: string) => ({
    backgroundColor: cor,
    color: texto,
    boxShadow: `0 0 10px ${cor}66`,
  });

  return (
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 animate-fade-in">
      {/* Nova Venda */}
      <button
        onClick={() => navigate('/vendas/nova')}
        className="p-3 rounded-full hover:scale-110 transition-all duration-200"
        style={estiloBotao(temaAtual.destaque, temaAtual.textoBranco)}
        title="Nova Venda"
      >
        <FaPlus />
      </button>

      {/* Estoque Atual */}
      <div className="relative">
        <button
          onClick={() => navigate('/estoque/EstoqueAtual')}
          className="p-3 rounded-full hover:scale-110 transition-all duration-200 relative"
          style={estiloBotao(temaAtual.contraste, temaAtual.textoClaro)}
          title="Estoque Atual"
        >
          <FaBoxOpen />
          {estoqueBaixo > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {estoqueBaixo}
            </span>
          )}
        </button>
      </div>

      {/* Lista de Clientes */}
      <button
        onClick={() => navigate('/clientes/lista')}
        className="p-3 rounded-full hover:scale-110 transition-all duration-200"
        style={estiloBotao(temaAtual.card, temaAtual.texto)}
        title="Lista de Clientes"
      >
        <FaUser />
      </button>

      {/* Relatório de Vendas */}
      <button
        onClick={() => navigate('/financeiro/vendas')}
        className="p-3 rounded-full hover:scale-110 transition-all duration-200"
        style={estiloBotao(temaAtual.fundoAlt, temaAtual.texto)}
        title="Relatório de Vendas"
      >
        <FaDollarSign />
      </button>

      {/* WhatsApp */}
      <button
        onClick={() => window.open('https://wa.me/5585997254989', '_blank')}
        className="p-3 rounded-full hover:scale-110 transition-all duration-200"
        style={estiloBotao(temaAtual.destaque, temaAtual.textoBranco)}
        title="Fale via WhatsApp"
      >
        <FaWhatsapp className="text-xl" />
      </button>
    </div>
  );
};

export default BotoesFlutuantes;
