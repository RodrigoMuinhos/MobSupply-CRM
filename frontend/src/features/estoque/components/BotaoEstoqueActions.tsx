import React from 'react';
import { FaSave, FaTrash, FaPrint } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

interface Props {
  onSalvar: () => void;
  onLimpar: () => void;
  onExportarPDF: () => void;
}

const BotaoEstoqueActions: React.FC<Props> = ({ onSalvar, onLimpar, onExportarPDF }) => {
  const { temaAtual } = useTheme();

  const iconStyle = 'p-2 rounded-full shadow';

  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={onSalvar}
        title="Salvar Estoque"
        className={iconStyle}
        style={{ backgroundColor: temaAtual.texto, color: temaAtual.fundo }}
      >
        <FaSave size={18} />
      </button>

      <button
        onClick={onLimpar}
        title="Limpar Estoque"
        className={iconStyle}
        style={{ backgroundColor: temaAtual.destaque, color: temaAtual.fundo }}
      >
        <FaTrash size={18} />
      </button>

      <button
        onClick={onExportarPDF}
        title="Exportar PDF"
        className={iconStyle}
        style={{ backgroundColor: temaAtual.destaque, color: temaAtual.fundo }}
      >
        <FaPrint size={18} />
      </button>
    </div>
  );
};

export default BotaoEstoqueActions;
