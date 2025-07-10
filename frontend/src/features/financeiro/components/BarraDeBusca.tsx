// src/features/financeiro/components/BarraDeBusca.tsx
'use client';
import React from 'react';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  buscaNome: string;
  setBuscaNome: (value: string) => void;
  buscaCpf: string;
  setBuscaCpf: (value: string) => void;
  modoExibicao: 'todos' | 'porData';
  setModoExibicao: (modo: 'todos' | 'porData') => void;
  mesSelecionado: number;
  setMesSelecionado: (mes: number) => void;
  anoSelecionado: number;
  setAnoSelecionado: (ano: number) => void;
  anosDisponiveis: number[];
};

const BarraDeBusca: React.FC<Props> = ({
  buscaNome,
  setBuscaNome,
  buscaCpf,
  setBuscaCpf,
  modoExibicao,
  setModoExibicao,
  mesSelecionado,
  setMesSelecionado,
  anoSelecionado,
  setAnoSelecionado,
  anosDisponiveis,
}) => {
  const { temaAtual } = useTheme();

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <input
        type="text"
        placeholder="Buscar por nome"
        value={buscaNome}
        onChange={(e) => setBuscaNome(e.target.value)}
        className="p-2 rounded border text-sm"
        style={{
          backgroundColor: temaAtual.input,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
        }}
      />

      <input
        type="text"
        placeholder="Buscar por CPF"
        value={buscaCpf}
        onChange={(e) => setBuscaCpf(e.target.value)}
        className="p-2 rounded border text-sm"
        style={{
          backgroundColor: temaAtual.input,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
        }}
      />

      <select
        value={modoExibicao}
        onChange={(e) => setModoExibicao(e.target.value as 'todos' | 'porData')}
        className="p-2 rounded border text-sm"
        style={{
          backgroundColor: temaAtual.input,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
        }}
      >
        <option value="todos">Ver todos</option>
        <option value="porData">Mostrar por data</option>
      </select>

      {modoExibicao === 'porData' && (
        <>
          <select
            value={mesSelecionado}
            onChange={(e) => setMesSelecionado(Number(e.target.value))}
            className="p-2 rounded border text-sm"
            style={{
              backgroundColor: temaAtual.input,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque,
            }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <option key={i} value={i}>
                {new Date(2025, i).toLocaleString('pt-BR', { month: 'long' })}
              </option>
            ))}
          </select>

          <select
            value={anoSelecionado}
            onChange={(e) => setAnoSelecionado(Number(e.target.value))}
            className="p-2 rounded border text-sm"
            style={{
              backgroundColor: temaAtual.input,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque,
            }}
          >
            {anosDisponiveis.map((ano) => (
              <option key={ano} value={ano}>
                {ano}
              </option>
            ))}
          </select>
        </>
      )}
    </div>
  );
};

export default BarraDeBusca;