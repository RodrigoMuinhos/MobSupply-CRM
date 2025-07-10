// src/features/clientes/components/ModalCliente.tsx
import React from 'react';
import { Cliente } from '../../../types/banco';
import { useIdioma } from '../../../context/IdiomaContext';

interface Props {
  cliente: Cliente | null;
  onClose: () => void;
  vendasTotalPorCpf: (cpf: string) => number;
  temaAtual: {
    card: string;
    texto: string;
    destaque: string;
  };
}

const ModalCliente: React.FC<Props> = ({
  cliente,
  onClose,
  vendasTotalPorCpf,
  temaAtual,
}) => {
  const { idioma } = useIdioma();

  if (!cliente) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div
        className="rounded-lg shadow-lg p-6 max-w-md w-full border"
        style={{
          backgroundColor: temaAtual.card,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
          borderWidth: '1px',
        }}
      >
        <h3 className="text-xl font-bold mb-4">
          {idioma.ficha?.titulo ?? 'Informações do Cliente'}
        </h3>
        <div className="space-y-2 text-sm">
          <p><strong>{idioma.ficha?.nome ?? 'Nome'}:</strong> {cliente.nome}</p>
          <p><strong>{idioma.ficha?.cpf ?? 'CPF'}:</strong> {cliente.cpf}</p>
          <p><strong>{idioma.ficha?.whatsapp ?? 'WhatsApp'}:</strong> {cliente.whatsapp}</p>
          {cliente.email && (
            <p><strong>{idioma.ficha?.email ?? 'Email'}:</strong> {cliente.email}</p>
          )}
          {cliente.endereco && (
            <p><strong>{idioma.ficha?.endereco ?? 'Endereço'}:</strong> {cliente.endereco}</p>
          )}
          {cliente.cep && (
            <p><strong>{idioma.ficha?.cep ?? 'CEP'}:</strong> {cliente.cep}</p>
          )}
          {cliente.nascimento && (
            <p>
              <strong>{idioma.ficha?.nascimento ?? 'Nascimento'}:</strong>{' '}
              {new Date(cliente.nascimento).toLocaleDateString()}
            </p>
          )}
          <p className="mt-2">
            <strong>{idioma.ficha?.totalComprado ?? 'Total Comprado'}:</strong>{' '}
            R$ {vendasTotalPorCpf(cliente.cpf).toFixed(2)}
          </p>
        </div>
        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            {idioma.ficha?.fechar ?? 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalCliente;
