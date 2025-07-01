import React from 'react';
import { FaSave, FaTimes } from 'react-icons/fa';

interface Props {
  valor: string;
  onFechar: () => void;
  onSalvar: (novo: string) => void;
}

const ModalEditarContato: React.FC<Props> = ({ valor, onFechar, onSalvar }) => {
  const [input, setInput] = React.useState(valor);

  const aoSalvar = () => {
    if (!input.trim()) return;
    onSalvar(input.trim());
    onFechar();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Editar Contato</h3>
          <button onClick={onFechar}><FaTimes /></button>
        </div>

        <input
          type="text"
          className="w-full border p-2 text-sm"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && aoSalvar()}
        />

        <button
          onClick={aoSalvar}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded flex items-center justify-center"
        >
          <FaSave className="mr-2" /> Salvar Contato
        </button>
      </div>
    </div>
  );
};

export default ModalEditarContato;