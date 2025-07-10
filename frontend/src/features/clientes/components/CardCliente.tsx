// src/features/clientes/components/CardCliente.tsx
import React from 'react';
import { FaCrown, FaUsers, FaBirthdayCake, FaMoneyBillWave } from 'react-icons/fa';
import { Cliente } from '../../../types/banco';
import { useIdioma } from '../../../context/IdiomaContext';

interface Props {
  topCliente: Cliente | null;
  totalCpfs: number;
  proximoAniversario: Cliente | null;
  clienteMaisValor: Cliente | null;
  vendasTotalPorCpf: (cpf: string) => number;
  abrirModal: (cliente: Cliente) => void;
  temaAtual: {
    card: string;
    texto: string;
    destaque: string;
  };
}

const CardCliente: React.FC<Props> = ({
  topCliente,
  totalCpfs,
  proximoAniversario,
  clienteMaisValor,
  vendasTotalPorCpf,
  abrirModal,
  temaAtual,
}) => {
  const { idioma } = useIdioma();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      {topCliente && (
        <div
          className="rounded shadow p-4 flex items-center gap-4 border cursor-pointer"
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque,
          }}
          onClick={() => abrirModal(topCliente)}
        >
          <FaCrown className="text-yellow-500 text-3xl" />
          <div>
            <p className="text-sm opacity-80">
              {idioma.ficha?.maisComprou ?? 'Cliente que mais comprou'}
            </p>
            <p className="font-bold">{topCliente.nome}</p>
          </div>
        </div>
      )}

      <div
        className="rounded shadow p-4 flex items-center gap-4 border"
        style={{
          backgroundColor: temaAtual.card,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
        }}
      >
        <FaUsers className="text-2xl" style={{ color: temaAtual.destaque }} />
        <div>
          <p className="text-sm opacity-80">
            {idioma.ficha?.totalCpfs ?? 'Total de CPFs únicos'}
          </p>
          <p className="font-bold">{totalCpfs}</p>
        </div>
      </div>

      {proximoAniversario && (
        <div
          className="rounded shadow p-4 flex items-center gap-4 border cursor-pointer"
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque,
          }}
          onClick={() => abrirModal(proximoAniversario)}
        >
          <FaBirthdayCake className="text-pink-500 text-3xl" />
          <div>
            <p className="text-sm opacity-80">
              {idioma.ficha?.proximoAniversario ?? 'Próx. Aniversariante'}
            </p>
            <p className="font-bold">{proximoAniversario.nome}</p>
            <p className="text-sm">
              {proximoAniversario.nascimento
                ? new Date(proximoAniversario.nascimento).toLocaleDateString()
                : '---'}
            </p>
          </div>
        </div>
      )}

      {clienteMaisValor && (
        <div
          className="rounded shadow p-4 flex items-center gap-4 border cursor-pointer"
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque,
          }}
          onClick={() => abrirModal(clienteMaisValor)}
        >
          <FaMoneyBillWave className="text-green-500 text-3xl" />
          <div>
            <p className="text-sm opacity-80">
              {idioma.ficha?.maiorValorCompras ?? 'Maior Valor de Compras'}
            </p>
            <p className="font-bold">{clienteMaisValor.nome}</p>
            <p className="text-sm text-green-700 mt-1">
              R$ {vendasTotalPorCpf(clienteMaisValor.cpf).toFixed(2)}
              {vendasTotalPorCpf(clienteMaisValor.cpf) > 1000 && (
                <span
                  className="ml-1 text-yellow-400 animate-pulse"
                  title={idioma.ficha?.vip ?? 'Cliente VIP'}
                >
                  ★
                </span>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CardCliente;
