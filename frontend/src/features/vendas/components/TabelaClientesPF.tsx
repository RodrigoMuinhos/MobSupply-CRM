import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
import { Cliente, Venda } from '../../../types/cliente';
import ModalAnaliseCliente from './ModalAnaliseCliente';
import { useTheme } from '../../../context/ThemeContext';

interface Props {
  clientes: (Cliente & {
    totalGasto: number;
    numeroCompras: number;
    ultimaCompra: string;
  })[];
  statusMap: Record<string, string>;
  mensagensPorCor: Record<string, string>;
  onStatusClick: (cpf: string, novaCor: string) => void;
  onAbrirModal: (info: { cpf: string; numero: string }) => void;
  onAbrirAnalise: (cliente: Cliente) => void;
  filtro: string;
  vendas: Venda[];
}

const cores = ['cinza', 'azul', 'amarelo', 'verde', 'roxo'] as const;
const classesCor: Record<string, string> = {
  cinza: '#9ca3af',
  azul: '#3b82f6',
  amarelo: '#eab308',
  verde: '#22c55e',
  roxo: '#a855f7',
};

const limparCPF = (cpf: string) => cpf?.replace(/\D/g, '');
const formatarCPF = (cpf: string) =>
  cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

const formatarWhatsApp = (numero: string) => {
  const n = numero.replace(/\D/g, '');
  return n.length === 11 ? n.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4') : numero;
};

const calcularDiasDesde = (data: string) => {
  const hoje = new Date();
  const dataVenda = new Date(data);
  return Math.floor((+hoje - +dataVenda) / (1000 * 60 * 60 * 24));
};

const TabelaClientesPF: React.FC<Props> = ({
  clientes,
  statusMap,
  mensagensPorCor,
  onStatusClick,
  onAbrirModal,
  filtro,
  vendas,
}) => {
  const { temaAtual } = useTheme();
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const proximaCor = (corAtual: string): string => {
    const idx = cores.indexOf(corAtual as any);
    return cores[(idx + 1) % cores.length];
  };

  return (
    <div
      className="overflow-auto mt-4 rounded-lg shadow"
      style={{ background: temaAtual.card, color: temaAtual.texto }}
    >
      <table className="min-w-full text-sm">
        <thead>
          <tr style={{ background: temaAtual.fundoAlt, color: temaAtual.texto }}>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>Status</th>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>Nome</th>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>CPF</th>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>Última Compra</th>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>Compras</th>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>Total Gasto</th>
            <th className="p-2 text-left border-b" style={{ borderColor: temaAtual.contraste }}>Contato</th>
          </tr>
        </thead>
        <tbody>
          {clientes
            .filter(c =>
              c.nome.toLowerCase().includes(filtro.toLowerCase()) ||
              c.cpf.includes(filtro)
            )
            .map((cliente, i) => {
              const cor = statusMap[cliente.cpf] || 'cinza';
              const dias = calcularDiasDesde(cliente.ultimaCompra);

              return (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${temaAtual.contraste}`,
                    background: 'transparent',
                  }}
                  className="hover:brightness-110 transition"
                >
                  <td className="p-2">
                    <button onClick={() => onStatusClick(cliente.cpf, proximaCor(cor))}>
                      <BsCircleFill style={{ color: classesCor[cor] }} />
                    </button>
                  </td>
                  <td
                    onClick={() => setClienteSelecionado(cliente)}
                    className="p-2 cursor-pointer underline"
                    style={{ color: temaAtual.destaque }}
                  >
                    {cliente.nome}
                  </td>
                  <td className="p-2">{formatarCPF(cliente.cpf)}</td>
                  <td className="p-2">
                    <div className="flex flex-col">
                      <span>{dias} dias atrás</span>
                      <span style={{ fontSize: '0.75rem', color: temaAtual.textoClaro }}>
                        {dias > 30
                          ? 'Inativo há 30+ dias'
                          : dias > 15
                          ? 'Sem compra recente'
                          : 'Cliente ativo'}
                      </span>
                    </div>
                  </td>
                  <td className="p-2">{cliente.numeroCompras}</td>
                  <td className="p-2">R$ {cliente.totalGasto.toFixed(2)}</td>
                  <td className="p-2">
                    <button
                      title="Enviar WhatsApp"
                      onClick={() =>
                        onAbrirModal({
                          cpf: cliente.cpf,
                          numero: cliente.whatsapp,
                        })
                      }
                      style={{ color: '#22c55e' }}
                    >
                      <FaWhatsapp />
                    </button>
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {clienteSelecionado && (
        <ModalAnaliseCliente
          cliente={clienteSelecionado}
          vendasDoCliente={vendas.filter(
            v => limparCPF(v.cliente?.cpf) === limparCPF(clienteSelecionado?.cpf)
          )}
          onFechar={() => setClienteSelecionado(null)}
          onAtualizarNome={(novoNome: string) => {
            setClienteSelecionado({
              ...clienteSelecionado,
              nome: novoNome
            });
          }}
        />
      )}
    </div>
  );
};

export default TabelaClientesPF;
