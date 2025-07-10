// src/features/financeiro/components/ModalSelecaoRecibo.tsx
'use client';
import React from 'react';
import { Venda } from '../../../types/venda';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  recibos: Venda[];
  onSelecionar: (venda: Venda) => void;
  onCancelar: () => void;
};

const ModalSelecaoRecibo: React.FC<Props> = ({ recibos, onSelecionar, onCancelar }) => {
  const { temaAtual } = useTheme();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div
        className="rounded-lg shadow p-6 max-w-md w-full"
        style={{
          backgroundColor: temaAtual.card,
          color: temaAtual.texto,
          border: `1px solid ${temaAtual.destaque}`,
        }}
      >
        <h3 className="text-lg font-semibold mb-4 text-center">Escolha o Recibo</h3>

        <ul className="space-y-2 max-h-64 overflow-y-auto">
          {recibos.map((venda, i) => (
            <li key={i}>
              <button
                onClick={() => onSelecionar(venda)}
                className="w-full text-left px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                style={{ borderColor: temaAtual.destaque }}
              >
                {venda.data
                  ? `${new Date(venda.data).toLocaleString('pt-BR')} — R$ ${venda.total_final.toFixed(2)}`
                  : 'Data inválida'}
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-4 text-center">
          <button
            onClick={onCancelar}
            className="text-red-600 underline text-sm hover:text-red-800"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalSelecaoRecibo;