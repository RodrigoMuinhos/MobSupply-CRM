'use client';
import React, { useRef } from 'react';
import { FaFileUpload, FaFileDownload, FaFilePdf } from 'react-icons/fa';
import { Venda } from '../../../types/venda';

type Props = {
  onImportar: (arquivo: File) => void;
  onExportar: () => void;
  onGerarRelatorio: () => void;
};

const GrupoBotoesRelatorio: React.FC<Props> = ({ onImportar, onExportar, onGerarRelatorio }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportar(file);
      e.target.value = ''; // reseta o input para aceitar o mesmo arquivo novamente
    }
  };

  return (
    <div className="flex gap-3 items-center">
      {/* Importar JSON */}
      <button
        title="Importar JSON"
        onClick={() => inputRef.current?.click()}
        className="p-2 rounded-full hover:bg-gray-300 transition"
      >
        <FaFileUpload size={18} />
        <input
          type="file"
          accept=".json"
          ref={inputRef}
          onChange={handleInputChange}
          style={{ display: 'none' }}
        />
      </button>

      {/* Exportar JSON */}
      <button
        title="Exportar JSON"
        onClick={onExportar}
        className="p-2 rounded-full hover:bg-gray-300 transition"
      >
        <FaFileDownload size={18} />
      </button>

      {/* Gerar Relatório PDF */}
      <button
        title="Gerar Relatório"
        onClick={onGerarRelatorio}
        className="p-2 rounded-full hover:bg-gray-300 transition"
      >
        <FaFilePdf size={18} />
      </button>
    </div>
  );
};

export default GrupoBotoesRelatorio;