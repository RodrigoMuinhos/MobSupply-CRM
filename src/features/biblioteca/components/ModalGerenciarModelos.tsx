import React, { useEffect, useState } from 'react';
import { FaTimes, FaEdit, FaTrash } from 'react-icons/fa';

type Props = {
  onFechar: () => void;
  onSelecionar: (mensagem: string) => void;
};

const ModalGerenciarModelos: React.FC<Props> = ({ onFechar, onSelecionar }) => {
  const [modelos, setModelos] = useState<string[]>([]);
  const [editandoIndex, setEditandoIndex] = useState<number | null>(null);
  const [novoTexto, setNovoTexto] = useState('');

  useEffect(() => {
    const salvos = localStorage.getItem('modelosWpp');
    if (salvos) {
      setModelos(JSON.parse(salvos));
    }
  }, []);

  const salvarNoStorage = (lista: string[]) => {
    setModelos(lista);
    localStorage.setItem('modelosWpp', JSON.stringify(lista));
  };

  const handleSalvarEdicao = (index: number) => {
    const atualizados = [...modelos];
    atualizados[index] = novoTexto;
    salvarNoStorage(atualizados);
    setEditandoIndex(null);
    setNovoTexto('');
  };

  const handleExcluir = (index: number) => {
    if (confirm('Deseja excluir este modelo?')) {
      const atualizados = modelos.filter((_, i) => i !== index);
      salvarNoStorage(atualizados);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-xl rounded shadow-lg p-6 relative">
        <button
          onClick={onFechar}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          title="Fechar"
        >
          <FaTimes />
        </button>

        <h2 className="text-xl font-semibold mb-4">Gerenciar Modelos de Mensagem</h2>

        {modelos.length === 0 && (
          <p className="text-gray-500">Nenhum modelo salvo ainda.</p>
        )}

        <ul className="space-y-2 max-h-96 overflow-y-auto">
          {modelos.map((modelo, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-gray-100 p-2 rounded"
            >
              {editandoIndex === index ? (
                <>
                  <input
                    value={novoTexto}
                    onChange={(e) => setNovoTexto(e.target.value)}
                    className="border px-2 py-1 w-full mr-2 text-sm rounded"
                  />
                  <button
                    onClick={() => handleSalvarEdicao(index)}
                    className="text-green-600 font-bold mr-2"
                  >
                    Salvar
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="text-sm cursor-pointer flex-1"
                    onClick={() => onSelecionar(modelo)}
                    title="Usar este modelo"
                  >
                    {modelo}
                  </span>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => {
                        setEditandoIndex(index);
                        setNovoTexto(modelo);
                      }}
                      className="text-blue-600"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleExcluir(index)}
                      className="text-red-600"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModalGerenciarModelos;