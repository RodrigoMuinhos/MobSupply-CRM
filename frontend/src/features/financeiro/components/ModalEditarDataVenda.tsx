'use client';
import React, { useState } from 'react';
import { Venda } from '../../../types/venda';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  venda: Venda;
  onClose: () => void;
  onSalvar: (novaData: string) => void;
};

const ModalEditarDataVenda: React.FC<Props> = ({ venda, onClose, onSalvar }) => {
  const { temaAtual } = useTheme();

  const [novaData, setNovaData] = useState(() => {
    const data = new Date(venda.data);
    return data.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });

  const handleSalvar = () => {
    onSalvar(novaData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg p-6 w-[90%] max-w-md shadow-lg"
        style={{
          background: temaAtual.cardGradient,
          color: temaAtual.texto,
          backdropFilter: 'blur(8px)',
          border: `1px solid ${temaAtual.destaque}`,
        }}
      >
        <h2 className="text-lg font-bold mb-4">Editar Data da Venda</h2>

        <label className="block mb-2 text-sm">Nova Data e Hora:</label>
        <input
          type="datetime-local"
          value={novaData}
          onChange={(e) => setNovaData(e.target.value)}
          className="w-full p-2 rounded border"
          style={{ background: temaAtual.input }}
        />

        <div className="mt-6 flex justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarDataVenda;