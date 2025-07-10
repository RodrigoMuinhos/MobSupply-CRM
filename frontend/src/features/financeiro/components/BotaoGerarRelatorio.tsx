'use client';
import React from 'react';
import { FaFilePdf } from 'react-icons/fa';

type Props = {
  onClick: () => void;
};

const BotaoGerarRelatorio: React.FC<Props> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded shadow-md transition"
    >
      <FaFilePdf />
      <span className="text-sm font-semibold">Gerar Relatório</span>
    </button>
  );
};

export default BotaoGerarRelatorio;