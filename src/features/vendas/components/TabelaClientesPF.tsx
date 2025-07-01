import React, { useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
import { Cliente, Venda } from '../../../types/cliente';
import ModalAnaliseCliente from '../components/ModalAnaliseCliente';

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
  cinza: 'text-gray-400',
  azul: 'text-blue-500',
  amarelo: 'text-yellow-500',
  verde: 'text-green-500',
  roxo: 'text-purple-500',
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
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  const proximaCor = (corAtual: string): string => {
    const idx = cores.indexOf(corAtual as any);
    return cores[(idx + 1) % cores.length];
  };

  return (
    <div className="overflow-auto mt-4 rounded-lg shadow">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-2">Status</th>
            <th className="p-2">Nome</th>
            <th>CPF</th>
            <th>Última Compra</th>
            <th>Compras</th>
            <th>Total Gasto</th>
            <th>Contato</th>
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
                <tr key={i} className="border-b hover:bg-gray-50">
                  <td className="p-2">
                    <button onClick={() => onStatusClick(cliente.cpf, proximaCor(cor))}>
                      <BsCircleFill className={classesCor[cor]} />
                    </button>
                  </td>
                  <td
                    onClick={() => setClienteSelecionado(cliente)}
                    className="p-2 cursor-pointer text-blue-600 underline"
                  >
                    {cliente.nome}
                  </td>
                  <td>{formatarCPF(cliente.cpf)}</td>
                  <td>
                    <div className="flex flex-col">
                      <span>{dias} dias atrás</span>
                      <span className="text-xs text-gray-600 italic">
                        {dias > 30
                          ? 'Inativo há 30+ dias'
                          : dias > 15
                          ? 'Sem compra recente'
                          : 'Cliente ativo'}
                      </span>
                    </div>
                  </td>
                  <td>{cliente.numeroCompras}</td>
                  <td>R$ {cliente.totalGasto.toFixed(2)}</td>
                  <td className="text-green-600">
                    <button
                      title="Enviar WhatsApp"
                      onClick={() =>
                        onAbrirModal({
                          cpf: cliente.cpf,
                          numero: cliente.whatsapp,
                        })
                      }
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
vendasDoCliente={vendas.filter(v => limparCPF(v.cliente?.cpf) === limparCPF(clienteSelecionado?.cpf))}
    onFechar={() => setClienteSelecionado(null)}
    onAtualizarNome={(novoNome: string) => {
      // Atualiza o nome no cliente selecionado (opcional, se quiser refletir na UI imediatamente)
      setClienteSelecionado({
        ...clienteSelecionado,
        nome: novoNome
      });

      // Atualiza o nome também no array de vendas (se necessário)
      // ou refaça um fetch se for o caso
    }}
  />
)}
    </div>
  );
};

export default TabelaClientesPF;