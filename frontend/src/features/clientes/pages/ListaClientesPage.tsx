// src/features/clientes/pages/ListaClientesPage.tsx
import React, { useEffect, useState } from 'react';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../../../context/ThemeContext';
import { Cliente } from '../../../types/banco';
import CardCliente from '../components/CardCliente';
import TabelaClientes from '../components/TabelaClientes';
import ModalCliente from '../components/ModalCliente';
import { useIdioma } from '../../../context/IdiomaContext';
import { clienteStorage } from '../../../services/storage/clienteStorage';

const ListaClientesPage: React.FC = () => {
  const { temaAtual } = useTheme();
  const { idioma } = useIdioma();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [clienteModal, setClienteModal] = useState<Cliente | null>(null);
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [clienteExpandidoIndex, setClienteExpandidoIndex] = useState<number | null>(null);
  const [busca, setBusca] = useState('');
  const [topCliente, setTopCliente] = useState<Cliente | null>(null);
  const [clienteMaisValor, setClienteMaisValor] = useState<Cliente | null>(null);
  const [totalCpfs, setTotalCpfs] = useState(0);
  const [proximoAniversario, setProximoAniversario] = useState<Cliente | null>(null);
  const [cpfsDuplicados, setCpfsDuplicados] = useState<Set<string>>(new Set());

  useEffect(() => {
    const lista = clienteStorage.listar();
    setClientes(lista);
    setTotalCpfs(new Set(lista.map(c => c.cpf)).size);

    const duplicados = lista.map(c => c.cpf).filter((cpf, i, arr) => arr.indexOf(cpf) !== i);
    setCpfsDuplicados(new Set(duplicados));

    const hoje = new Date();
    const ordenados = [...lista]
      .filter(c => !!c.nascimento)
      .sort((a, b) => {
        const aDate = new Date(castData(a.nascimento ?? '2000-01-01'));
        const bDate = new Date(castData(b.nascimento ?? '2000-01-01'));
        aDate.setFullYear(hoje.getFullYear());
        bDate.setFullYear(hoje.getFullYear());
        return aDate.getTime() - bDate.getTime();
      });

    const proximo = ordenados.find(c => {
      const nasc = new Date(castData(c.nascimento ?? '2000-01-01'));
      nasc.setFullYear(hoje.getFullYear());
      return nasc >= hoje;
    });
    if (proximo) setProximoAniversario(proximo);

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
  }, []);

  const castData = (d: string): string => {
    return d?.length >= 8 ? d : '2000-01-01';
  };

  const salvarClientes = (lista: Cliente[]) => {
    setClientes(lista);
    clienteStorage.atualizarTodos(lista);
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

  const exportarClienteParaPDF = (cliente: Cliente) => {
    const conteudo = `
      <div style="font-family: sans-serif; padding: 16px;">
        <h2>${idioma.ficha?.titulo ?? 'Ficha do Cliente'}</h2>
        <p><strong>${idioma.ficha?.nome ?? 'Nome'}:</strong> ${cliente.nome}</p>
        <p><strong>${idioma.ficha?.cpf ?? 'CPF'}:</strong> ${cliente.cpf}</p>
        <p><strong>${idioma.ficha?.whatsapp ?? 'WhatsApp'}:</strong> ${cliente.whatsapp}</p>
        <p><strong>${idioma.ficha?.nascimento ?? 'Nascimento'}:</strong> ${new Date(castData(cliente.nascimento ?? '2000-01-01')).toLocaleDateString()}</p>
        ${cliente.email ? `<p><strong>Email:</strong> ${cliente.email}</p>` : ''}
        ${cliente.endereco ? `<p><strong>${idioma.ficha?.endereco ?? 'Endereço'}:</strong> ${cliente.endereco}</p>` : ''}
        ${cliente.cep ? `<p><strong>${idioma.ficha?.cep ?? 'CEP'}:</strong> ${cliente.cep}</p>` : ''}
        <p><strong>${idioma.ficha?.sincronizado ?? 'Sincronizado'}:</strong> ${cliente.sincronizado ? 'Sim' : 'Não'}</p>
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
    return vendas.filter(v => v.cliente?.cpf === cpf).reduce((acc, cur) => acc + (cur.total_final || 0), 0);
  };

  const clientesFiltrados = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) || c.cpf.includes(busca)
  );

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <h2 className="text-3xl font-bold mb-6" style={{ color: temaAtual.destaque }}>
        {idioma.ficha?.titulo ?? 'Lista de Clientes'}
      </h2>

      <CardCliente
        topCliente={topCliente}
        totalCpfs={totalCpfs}
        proximoAniversario={proximoAniversario}
        clienteMaisValor={clienteMaisValor}
        vendasTotalPorCpf={vendasTotalPorCpf}
        abrirModal={setClienteModal}
        temaAtual={temaAtual}
      />

      <TabelaClientes
        clientes={clientes}
        clientesFiltrados={clientesFiltrados}
        clienteEditando={clienteEditando}
        clienteExpandidoIndex={clienteExpandidoIndex}
        setClienteEditando={setClienteEditando}
        setClienteExpandidoIndex={setClienteExpandidoIndex}
        salvarClientes={salvarClientes}
        sincronizarCliente={sincronizarCliente}
        exportarClienteParaPDF={exportarClienteParaPDF}
        busca={busca}
        setBusca={setBusca}
        cpfsDuplicados={cpfsDuplicados}
        temaAtual={temaAtual}
      />

      <ModalCliente
        cliente={clienteModal}
        onClose={() => setClienteModal(null)}
        vendasTotalPorCpf={vendasTotalPorCpf}
        temaAtual={temaAtual}
      />
    </div>
  );
};

export default ListaClientesPage;
