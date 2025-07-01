import React, { useEffect, useMemo, useState } from 'react';
import { FaDollarSign, FaUsers, FaShoppingCart, FaSearch } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import { Cliente, Venda } from '../../../types/cliente';
import TabelaClientesPF from '../components/TabelaClientesPF';
import ModalConfirmarEnvioPF from '../components/ModalConfirmarEnvioPF';
import MensagemPadraoBoxPF from '../components/MensagemPadraoBoxPF';
import ModalAnaliseCliente from '../components/ModalAnaliseCliente';

const HistoricoVendasPage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [filtro, setFiltro] = useState('');
  const [statusMap, setStatusMap] = useState<Record<string, string>>({});
  const [mensagensPorCor, setMensagensPorCor] = useState<Record<string, string>>({});
  const [modalInfo, setModalInfo] = useState<{ cpf: string; numero: string } | null>(null);
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);

  useEffect(() => {
    const vendasSalvas = localStorage.getItem('vendasMOB');
    if (vendasSalvas) setVendas(JSON.parse(vendasSalvas));

    const statusSalvos = JSON.parse(localStorage.getItem('statusClientesPF') || '{}');
    setStatusMap(statusSalvos);

    const mensagensSalvas = JSON.parse(localStorage.getItem('modelosFixosWppPF') || '{}');
    setMensagensPorCor(mensagensSalvas);
  }, []);

  const totalClientes = useMemo(() => {
    const cpfs = new Set(vendas.map(v => v.cliente?.cpf));
    return cpfs.size;
  }, [vendas]);

  const totalVendas = vendas.length;

  const totalReceita = useMemo(() => {
    return vendas.reduce((soma, venda) => soma + (venda.total_final || 0), 0);
  }, [vendas]);

  const clientesAgrupados = useMemo(() => {
    const mapa = new Map<string, Cliente & {
      totalGasto: number;
      numeroCompras: number;
      ultimaCompra: string;
    }>();

    vendas.forEach(venda => {
      const cliente = venda.cliente;
      const cpf = cliente?.cpf?.replace(/\D/g, '') || '';
      const nome = cliente?.nome?.trim() || '';
      const tel = cliente?.whatsapp?.replace(/\D/g, '') || '';
      if (!cpf || !nome) return;

      const chave = cpf;
      const existente = mapa.get(chave);
      if (existente) {
        existente.totalGasto += venda.total_final || 0;
        existente.numeroCompras += 1;
        if (new Date(venda.data || '') > new Date(existente.ultimaCompra)) {
          existente.ultimaCompra = venda.data || '';
        }
      } else {
        mapa.set(chave, {
          ...cliente,
          nome,
          cpf,
          whatsapp: tel,
          totalGasto: venda.total_final || 0,
          numeroCompras: 1,
          ultimaCompra: venda.data || '',
        });
      }
    });

    return Array.from(mapa.values());
  }, [vendas]);

  const handleStatusClick = (cpf: string, novaCor: string) => {
    const atualizado = { ...statusMap, [cpf]: novaCor };
    setStatusMap(atualizado);
    localStorage.setItem('statusClientesPF', JSON.stringify(atualizado));
  };

  return (
    <div className="p-4 space-y-6" style={{ background: temaAtual.fundo, color: temaAtual.texto }}>
      {/* Cards principais */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg shadow" style={{ background: temaAtual.card }}>
          <FaUsers className="text-xl mb-1" />
          <p className="text-sm">Clientes Ativos</p>
          <strong>{totalClientes}</strong>
        </div>
        <div className="p-4 rounded-lg shadow" style={{ background: temaAtual.card }}>
          <FaShoppingCart className="text-xl mb-1" />
          <p className="text-sm">Vendas Realizadas</p>
          <strong>{totalVendas}</strong>
        </div>
        <div className="p-4 rounded-lg shadow" style={{ background: temaAtual.card }}>
          <FaDollarSign className="text-xl mb-1" />
          <p className="text-sm">Receita Total</p>
          <strong>R$ {totalReceita.toFixed(2)}</strong>
        </div>
      </div>

      {/* Mensagens padrão por status */}
      <MensagemPadraoBoxPF />

      {/* Contadores por status */}
      <div className="flex gap-2 mt-2">
        {(['cinza', 'azul', 'amarelo', 'verde', 'roxo'] as const).map(cor => {
          const total = clientesAgrupados.filter(c => statusMap[c.cpf] === cor).length;
          const corClasses: Record<typeof cor, string> = {
            cinza: 'bg-gray-400',
            azul: 'bg-blue-500',
            amarelo: 'bg-yellow-400',
            verde: 'bg-green-500',
            roxo: 'bg-purple-500',
          };

          return (
            <div
              key={cor}
              className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold text-white ${corClasses[cor]}`}
            >
              {total}
            </div>
          );
        })}
      </div>

      {/* Campo de busca */}
      <div className="flex items-center gap-2 mt-2">
        <FaSearch />
        <input
          type="text"
          placeholder="Buscar por nome ou CPF"
          className="p-2 border rounded w-full max-w-md"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      {/* Tabela de clientes */}
      <TabelaClientesPF
  clientes={clientesAgrupados}
  statusMap={statusMap}
  mensagensPorCor={mensagensPorCor}
  onStatusClick={handleStatusClick}
  filtro={filtro}
  vendas={vendas} // ✅ nova prop
  onAbrirModal={({ cpf, numero }) => setModalInfo({ cpf, numero })}
  onAbrirAnalise={setClienteSelecionado} // ✅ novo callback
/>

      {/* Modal de envio */}
      {modalInfo && (
  <ModalConfirmarEnvioPF
    numero={modalInfo.numero}
    corStatus={(statusMap[modalInfo.cpf] || 'cinza') as 'cinza' | 'azul' | 'amarelo' | 'verde' | 'roxo'}
    onFechar={() => setModalInfo(null)}
  />
)}

{clienteSelecionado && (
  <ModalAnaliseCliente
    cliente={clienteSelecionado}
    vendasDoCliente={vendas.filter(v => v.cliente.cpf === clienteSelecionado.cpf)}
    onFechar={() => setClienteSelecionado(null)}
  />
)}
    </div>
  );
};

export default HistoricoVendasPage;