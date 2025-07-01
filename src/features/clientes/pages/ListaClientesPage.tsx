import React, { useEffect, useState } from 'react';
import {
  FaTrash, FaUsers, FaCrown, FaBirthdayCake, FaSyncAlt, FaGift,
  FaCheck, FaFilePdf, FaMoneyBillWave
} from 'react-icons/fa';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../../../context/ThemeContext';

interface Cliente {
  nome: string;
  cpf: string;
  whatsapp: string;
  nascimento: string;
  sincronizado?: boolean;
  email?: string;
  endereco?: string;
  cep?: string;
}

const ListaClientesPage: React.FC = () => {
  const { temaAtual } = useTheme();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [busca, setBusca] = useState('');
  const [topCliente, setTopCliente] = useState<Cliente | null>(null);
  const [clienteMaisValor, setClienteMaisValor] = useState<Cliente | null>(null);
  const [totalCpfs, setTotalCpfs] = useState(0);
  const [proximoAniversario, setProximoAniversario] = useState<Cliente | null>(null);
  const [corAniversario, setCorAniversario] = useState('bg-white');
  const [clienteExpandidoIndex, setClienteExpandidoIndex] = useState<number | null>(null);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteModal, setClienteModal] = useState<Cliente | null>(null);
  const [cpfsDuplicados, setCpfsDuplicados] = useState<Set<string>>(new Set());

  useEffect(() => {
    const dadosClientes = localStorage.getItem('clientesMOB');
    if (dadosClientes) {
      const lista: Cliente[] = JSON.parse(dadosClientes);
      setClientes(lista);

      setTotalCpfs(new Set(lista.map(c => c.cpf)).size);

      const duplicados = lista
        .map(c => c.cpf)
        .filter((cpf, i, arr) => arr.indexOf(cpf) !== i);
      setCpfsDuplicados(new Set(duplicados));

      const hoje = new Date();
      const ordenados = [...lista].sort((a, b) => {
        const dataA = new Date(a.nascimento);
        dataA.setFullYear(hoje.getFullYear());
        const dataB = new Date(b.nascimento);
        dataB.setFullYear(hoje.getFullYear());
        return dataA.getTime() - dataB.getTime();
      });

      const proximo = ordenados.find(c => {
        const nasc = new Date(c.nascimento);
        nasc.setFullYear(hoje.getFullYear());
        return nasc >= hoje;
      });

      if (proximo) {
        const dataNasc = new Date(proximo.nascimento);
        dataNasc.setFullYear(hoje.getFullYear());
        const diff = Math.floor((dataNasc.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
        if (diff === 2) setCorAniversario('bg-orange-100 border-orange-400');
        else if (diff === 1) setCorAniversario('bg-red-100 border-red-400');
        else setCorAniversario('bg-white');
        setProximoAniversario(proximo);
      }

      const vendas: any[] = JSON.parse(localStorage.getItem('vendasMOB') || '[]');
      const contagem: Record<string, number> = {};
      const somaValores: Record<string, number> = {};

      vendas.forEach(v => {
        const cpf = v.cliente?.cpf;
        if (cpf) {
          contagem[cpf] = (contagem[cpf] || 0) + 1;
          somaValores[cpf] = (somaValores[cpf] || 0) + (v.total_final || 0);
        }
      });

      const maisComprouCpf = Object.entries(contagem).sort((a, b) => b[1] - a[1])[0]?.[0];
      const maiorValorCpf = Object.entries(somaValores).sort((a, b) => b[1] - a[1])[0]?.[0];

      if (maisComprouCpf) {
        const cliente = lista.find(c => c.cpf === maisComprouCpf);
        if (cliente) setTopCliente(cliente);
      }

      if (maiorValorCpf) {
        const cliente = lista.find(c => c.cpf === maiorValorCpf);
        if (cliente) setClienteMaisValor(cliente);
      }
    }
  }, []);

  const salvarClientes = (lista: Cliente[]) => {
    setClientes(lista);
    localStorage.setItem('clientesMOB', JSON.stringify(lista));
  };

  const exportarClienteParaPDF = (cliente: Cliente) => {
    const conteudo = `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2>Ficha do Cliente</h2>
        <p><strong>Nome:</strong> ${cliente.nome}</p>
        <p><strong>CPF:</strong> ${cliente.cpf}</p>
        <p><strong>WhatsApp:</strong> ${cliente.whatsapp}</p>
        <p><strong>Nascimento:</strong> ${new Date(cliente.nascimento).toLocaleDateString()}</p>
        ${cliente.email ? `<p><strong>Email:</strong> ${cliente.email}</p>` : ''}
        ${cliente.endereco ? `<p><strong>Endereço:</strong> ${cliente.endereco}</p>` : ''}
        ${cliente.cep ? `<p><strong>CEP:</strong> ${cliente.cep}</p>` : ''}
        <p><strong>Sincronizado:</strong> ${cliente.sincronizado ? 'Sim' : 'Não'}</p>
      </div>
    `;
    html2pdf().from(conteudo).set({
      margin: 0.5,
      filename: `cliente_${cliente.cpf}.pdf`,
      html2canvas: {},
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  };

  const vendasTotalPorCpf = (cpf: string) => {
    const vendas: any[] = JSON.parse(localStorage.getItem('vendasMOB') || '[]');
    return vendas
      .filter(v => v.cliente?.cpf === cpf)
      .reduce((acc, cur) => acc + (cur.total_final || 0), 0);
  };

  const sincronizarCliente = async (index: number) => {
    try {
      const cliente = clientes[index];
      const res = await fetch('http://localhost:5000/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cliente),
      });
      if (res.ok) {
        const atualizados = [...clientes];
        atualizados[index].sincronizado = true;
        salvarClientes(atualizados);
      }
    } catch (e) {
      console.error("Erro ao sincronizar cliente", e);
    }
  };

  const sincronizarTodos = async () => {
    for (let i = 0; i < clientes.length; i++) {
      if (!clientes[i].sincronizado) await sincronizarCliente(i);
    }
  };

  const isAniversarioHoje = (nasc: string) => {
    const hoje = new Date();
    const data = new Date(nasc);
    return data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth();
  };

  const fecharModal = () => setClienteModal(null);

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    c.cpf.includes(busca)
  );

  const formatarCPF = (cpf: string) => {
  return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
};

const formatarWhatsApp = (numero: string) => {
  const somenteNumeros = numero.replace(/\D/g, '');
  return somenteNumeros.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
};

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold" style={{ color: temaAtual.destaque }}>Lista de Clientes</h2>
        <button
          onClick={sincronizarTodos}
          className="flex items-center gap-2 px-4 py-2 rounded shadow"
          style={{ backgroundColor: temaAtual.destaque, color: temaAtual.card }}
        >
          <FaSyncAlt /> Sincronizar Todos
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {topCliente && (
          <div
            className="rounded shadow p-4 flex items-center gap-4 border cursor-pointer"
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque
            }}
            onClick={() => setClienteModal(topCliente)}
          >
            <FaCrown className="text-yellow-500 text-3xl" />
            <div>
              <p className="text-sm opacity-80">Cliente que mais comprou</p>
              <p className="font-bold">{topCliente.nome}</p>
            </div>
          </div>
        )}

        <div
          className="rounded shadow p-4 flex items-center gap-4 border"
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque
          }}
        >
          <FaUsers className="text-2xl" style={{ color: temaAtual.destaque }} />
          <div>
            <p className="text-sm opacity-80">Total de CPFs únicos</p>
            <p className="font-bold">{totalCpfs}</p>
          </div>
        </div>

        {proximoAniversario && (
          <div
            className={`rounded shadow p-4 flex items-center gap-4 border cursor-pointer`}
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque
            }}
            onClick={() => setClienteModal(proximoAniversario)}
          >
            <FaBirthdayCake className="text-pink-500 text-3xl" />
            <div>
              <p className="text-sm opacity-80">Próx. Aniversariante</p>
              <p className="font-bold">{proximoAniversario.nome}</p>
              <p className="text-sm">
                {new Date(proximoAniversario.nascimento).toLocaleDateString()}
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
              borderColor: temaAtual.destaque
            }}
            onClick={() => setClienteModal(clienteMaisValor)}
          >
            <FaMoneyBillWave className="text-green-500 text-3xl" />
            <div>
              <p className="text-sm opacity-80">Maior Valor de Compras</p>
              <p className="font-bold">{clienteMaisValor.nome}</p>
              <p className="text-sm text-green-700 mt-1">
                R$ {vendasTotalPorCpf(clienteMaisValor.cpf).toFixed(2)}
                {vendasTotalPorCpf(clienteMaisValor.cpf) > 1000 && (
                  <span className="ml-1 text-yellow-400 animate-pulse" title="Cliente VIP">★</span>
                )}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Campo de busca */}
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Buscar por nome ou CPF"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded-l w-full"
        />
        <button className="px-4 rounded-r" style={{ backgroundColor: temaAtual.destaque, color: temaAtual.card }}>
          Buscar
        </button>
      </div>

      <table className="w-full text-left border-collapse">
  <thead style={{ backgroundColor: temaAtual.card, color: temaAtual.destaque }}>
    <tr className="text-sm uppercase tracking-wide border-b" style={{ borderColor: temaAtual.destaque }}>
      <th className="p-2">Nome</th>
      <th>CPF</th>
      <th>WhatsApp</th>
      <th>Nascimento</th>
      <th>Status</th>
      <th>Ações</th>
    </tr>
  </thead>
  <tbody>
    {clientesFiltrados.map((cliente, index) => (
      <React.Fragment key={index}>
        <tr
          className="border-b hover:brightness-110 transition-all"
          style={{
            backgroundColor: index % 2 === 0 ? temaAtual.fundoAlt : temaAtual.fundo,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque,
          }}
        >
          <td
            className="p-2 font-semibold cursor-pointer hover:underline"
            onClick={() => {
              setClienteEditando({ ...cliente });
              setClienteExpandidoIndex(index);
            }}
          >
            {cliente.nome}
            {isAniversarioHoje(cliente.nascimento) && (
              <FaGift className="inline ml-1 text-pink-500" title="Aniversário hoje!" />
            )}
          </td>

          
          <td>
  {formatarCPF(cliente.cpf)}
  {cpfsDuplicados.has(cliente.cpf) && (
    <span className="text-red-500 ml-1" title="CPF duplicado">⚠️</span>
  )}
</td>
<td>{formatarWhatsApp(cliente.whatsapp)}</td>
<td>{new Date(cliente.nascimento).toLocaleDateString()}</td>
<td className="text-center">
  {cliente.sincronizado ? (
    <FaCheck className="text-green-400 inline" />
  ) : (
    <button onClick={() => sincronizarCliente(index)} title="Sincronizar">
      <FaSyncAlt className="text-yellow-400 hover:text-yellow-200" />
    </button>
  )}
</td>
          <td className="text-center">
            <button
              onClick={() => {
                const novos = [...clientes];
                novos.splice(index, 1);
                salvarClientes(novos);
              }}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash />
            </button>
          </td>
        </tr>

        {clienteExpandidoIndex === index && clienteEditando && (
          <tr className="border-b" style={{ backgroundColor: temaAtual.fundoAlt }}>
            <td colSpan={6} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <input
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.nome}
                  placeholder="Nome"
                  onChange={e => setClienteEditando({ ...clienteEditando, nome: e.target.value })}
                />
                <input
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.cpf}
                  placeholder="CPF"
                  onChange={e => setClienteEditando({ ...clienteEditando, cpf: e.target.value })}
                />
                <input
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.whatsapp}
                  placeholder="WhatsApp"
                  onChange={e => setClienteEditando({ ...clienteEditando, whatsapp: e.target.value })}
                />
                <input
                  type="date"
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.nascimento}
                  onChange={e => setClienteEditando({ ...clienteEditando, nascimento: e.target.value })}
                />
                <input
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.email || ''}
                  placeholder="Email"
                  onChange={e => setClienteEditando({ ...clienteEditando, email: e.target.value })}
                />
                <input
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.endereco || ''}
                  placeholder="Endereço"
                  onChange={e => setClienteEditando({ ...clienteEditando, endereco: e.target.value })}
                />
                <input
                  className="p-2 border rounded"
                  style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
                  value={clienteEditando.cep || ''}
                  placeholder="CEP"
                  onChange={e => setClienteEditando({ ...clienteEditando, cep: e.target.value })}
                />

                <div className="col-span-2 flex flex-wrap justify-between items-center mt-2 gap-2">
                  <div className="flex gap-2">
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded"
                      onClick={() => {
                        const atualizados = [...clientes];
                        atualizados[index] = clienteEditando;
                        salvarClientes(atualizados);
                        setClienteEditando(null);
                        setClienteExpandidoIndex(null);
                      }}
                    >
                      Salvar
                    </button>
                    <button
                      className="bg-gray-600 text-white px-4 py-2 rounded"
                      onClick={() => {
                        setClienteEditando(null);
                        setClienteExpandidoIndex(null);
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                  <button
                    className="text-red-400 hover:underline text-sm flex items-center gap-1"
                    onClick={() => exportarClienteParaPDF(clienteEditando)}
                  >
                    <FaFilePdf /> Gerar PDF
                  </button>
                </div>
              </div>
            </td>
          </tr>
        )}
      </React.Fragment>
    ))}
  </tbody>
</table>

      {clienteModal && (
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
            <h3 className="text-xl font-bold mb-4">Informações do Cliente</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Nome:</strong> {clienteModal.nome}</p>
              <p><strong>CPF:</strong> {clienteModal.cpf}</p>
              <p><strong>WhatsApp:</strong> {clienteModal.whatsapp}</p>
              {clienteModal.email && <p><strong>Email:</strong> {clienteModal.email}</p>}
              {clienteModal.endereco && <p><strong>Endereço:</strong> {clienteModal.endereco}</p>}
              {clienteModal.cep && <p><strong>CEP:</strong> {clienteModal.cep}</p>}
              <p><strong>Nascimento:</strong> {new Date(clienteModal.nascimento).toLocaleDateString()}</p>
              <p className="mt-2"><strong>Total Comprado:</strong> R$ {vendasTotalPorCpf(clienteModal.cpf).toFixed(2)}</p>
            </div>
            <div className="mt-6 text-right">
              <button
                onClick={fecharModal}
                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
     )}
    </div>
  );
};

export default ListaClientesPage;