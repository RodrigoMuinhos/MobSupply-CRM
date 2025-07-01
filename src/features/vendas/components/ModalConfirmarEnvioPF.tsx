import React, { useEffect, useState } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

interface Props {
  numero: string;
  corStatus: 'cinza' | 'azul' | 'amarelo' | 'verde' | 'roxo';
  onFechar: () => void;
}

const coresFundo: Record<Props['corStatus'], string> = {
  cinza: '#f3f4f6',
  azul: '#e0f2fe',
  amarelo: '#fef9c3',
  verde: '#dcfce7',
  roxo: '#ede9fe',
};

const ModalConfirmarEnvioPF: React.FC<Props> = ({ numero, corStatus, onFechar }) => {
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState(false);

  useEffect(() => {
    try {
      const mensagensSalvas = JSON.parse(localStorage.getItem('modelosFixosWppPF') || '{}');
      const texto = mensagensSalvas[corStatus];
      if (!texto) {
        setErro(true);
        setMensagem('');
      } else {
        setMensagem(texto);
        setErro(false);
      }
    } catch (e) {
      setErro(true);
      setMensagem('');
    }
  }, [corStatus]);

  const enviar = () => {
    const textoEncoded = encodeURIComponent(mensagem);
    const numeroLimpo = numero.replace(/\D/g, '');
    const link = `https://wa.me/55${numeroLimpo}?text=${textoEncoded}`;
    window.open(link, '_blank');
    onFechar();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
      <div
        className="w-full max-w-sm md:max-w-md p-6 rounded-xl shadow-xl relative"
        style={{ backgroundColor: coresFundo[corStatus] }}
      >
        <button
          onClick={onFechar}
          className="absolute top-3 right-3 text-gray-700 hover:text-black"
        >
          <FaTimes />
        </button>

        <h2 className="text-lg font-bold text-gray-800 mb-2 text-center">
          Confirmar envio
        </h2>

        <p className="text-sm text-gray-600 mb-1 font-medium">Número:</p>
        <p className="text-md font-semibold text-gray-800 mb-3">({numero})</p>

        <p className="text-sm text-gray-600 mb-1 font-medium">Mensagem a ser enviada:</p>
        <textarea
          className="w-full h-48 p-3 border border-gray-300 rounded-md text-sm bg-white"
          value={mensagem}
          onChange={(e) => setMensagem(e.target.value)}
        />

        {erro && (
          <p className="text-red-600 text-xs mt-1">
            ⚠ Nenhuma mensagem cadastrada para o status <strong>{corStatus}</strong>. Salve uma mensagem em "Mensagens padrão por status".
          </p>
        )}

        <div className="flex justify-between mt-6">
          <button
            onClick={onFechar}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            onClick={enviar}
            disabled={!mensagem.trim()}
            className={`px-4 py-2 rounded-md flex items-center gap-2 ${
              mensagem.trim()
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-400 text-white cursor-not-allowed'
            }`}
          >
            <FaWhatsapp /> Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEnvioPF;