import React from 'react';
import { FaTimes, FaWhatsapp } from 'react-icons/fa';

interface Props {
  numero: string;
  nome?: string;
  mensagem: string;
  corStatus?: string;
  onFechar: () => void;
}

const formatarWhatsApp = (numero: string): string => {
  const n = numero.replace(/\D/g, '');
  return n.length === 11 ? `(${n.slice(0, 2)}) ${n[2]} ${n.slice(3, 7)}-${n.slice(7)}` : numero;
};

const gerarLinkWhatsApp = (numero: string, mensagem: string): string => {
  const n = numero.replace(/\D/g, '');
  const msg = encodeURIComponent(mensagem);
  return `https://wa.me/55${n}?text=${msg}`;
};

const corBackground: Record<string, string> = {
  azul: '#DBEAFE',
  verde: '#DCFCE7',
  vermelho: '#FEE2E2',
  amarelo: '#FEF9C3',
  roxo: '#EDE9FE',
  cinza: '#F3F4F6',
};

const registrarDisparo = (numero: string) => {
  const n = numero.replace(/\D/g, '');
  const agora = new Date().toLocaleString('pt-BR', {
    timeZone: 'America/Fortaleza',
  });

  const chave = 'disparosWpp';
  const registros = JSON.parse(localStorage.getItem(chave) || '[]');
  const novosRegistros = Array.isArray(registros) ? registros : [];

  novosRegistros.push({ numero: n, data: agora });
  localStorage.setItem(chave, JSON.stringify(novosRegistros));
};

const ModalConfirmarEnvio: React.FC<Props> = ({
  numero,
  nome,
  mensagem,
  corStatus = 'cinza',
  onFechar,
}) => {
  const bgColor = corBackground[corStatus] || corBackground.cinza;

  const handleDisparo = () => {
    registrarDisparo(numero);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 px-4">
      <div
        className="w-full max-w-xs rounded-xl shadow-xl flex flex-col relative overflow-hidden"
        style={{ backgroundColor: bgColor, height: '660px' }}
      >
        {/* Botão fechar */}
        <button
          onClick={onFechar}
          className="absolute top-2 right-3 text-gray-600 hover:text-red-600"
          title="Fechar"
        >
          <FaTimes size={18} />
        </button>

        {/* Conteúdo principal */}
        <div className="flex flex-col h-full p-4 pb-20 overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Confirmar envio</h2>

          {nome && (
            <p className="text-sm mb-1">
              <strong>Nome:</strong> {nome}
            </p>
          )}

          <p className="text-sm mb-2">
            <strong>Número:</strong> {formatarWhatsApp(numero)}
          </p>

          <label className="block text-sm font-medium mb-1">Mensagem a ser enviada:</label>
          <textarea
            readOnly
            value={mensagem}
            className="w-full flex-1 border border-gray-300 bg-white rounded p-2 text-sm resize-none overflow-y-scroll"
            style={{ minHeight: '380px' }}
          />
        </div>

        {/* Rodapé fixo */}
        <div className="absolute bottom-0 left-0 right-0 px-4 py-3 bg-white border-t border-gray-300 flex justify-between">
          <button
            onClick={onFechar}
            className="px-4 py-2 text-sm rounded border border-gray-400 hover:bg-gray-100"
          >
            Cancelar
          </button>

          <a
            href={gerarLinkWhatsApp(numero, mensagem)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleDisparo}
            className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2"
          >
            <FaWhatsapp /> Enviar
          </a>
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmarEnvio;