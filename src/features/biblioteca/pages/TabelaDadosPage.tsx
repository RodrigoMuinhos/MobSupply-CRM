import React, { useEffect, useState } from 'react';
import ModalCNPJ from '../components/ModalCNPJ';
import { capitaisNordeste, ufsNordeste } from '../../../utils/ufsNordeste';

type Cliente = {
  cnpj?: string | null;
  nomeFantasia?: string | null;
  nomeMatriz?: string | null;
  cidade?: string | null;
  distrito?: string | null;
  uf?: string | null;
};

const TabelaDadosPage: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ufSelecionada, setUfSelecionada] = useState<string>('');
  const [cidadeFiltro, setCidadeFiltro] = useState('');
  const [statusFiltro, setStatusFiltro] = useState<string>('');
  const [clienteSelecionado, setClienteSelecionado] = useState<Cliente | null>(null);
  const [statusMap, setStatusMap] = useState<Record<string, number>>({});
  const [cnpjsValidados, setCnpjsValidados] = useState<string[]>([]);

  useEffect(() => {
    const carregarDados = async () => {
      const resposta = await fetch('/DadosClientes/clientesBiblioteca.json');
      const dados = await resposta.json();

      const statusSalvos = JSON.parse(localStorage.getItem('statusClientes') || '{}');
      const validados = JSON.parse(localStorage.getItem('cnpjValidados') || '[]');
      const cnpjs = validados.map((item: any) => String(item.cnpj));

      const dadosCompletos = dados.map((cliente: Cliente) => {
        const cidadeReferencia = cliente.distrito || cliente.cidade;
        if (!cliente.uf && cidadeReferencia) {
          const cidadeNormalizada = cidadeReferencia.trim().toLowerCase();
          const ufDetectada = Object.entries(capitaisNordeste).find(
            ([uf, capital]) => capital === cidadeNormalizada
          );
          if (ufDetectada) {
            return { ...cliente, uf: ufDetectada[0], cidade: cidadeReferencia };
          }
        }
        if (!cliente.cidade && cidadeReferencia) {
          return { ...cliente, cidade: cidadeReferencia };
        }
        return cliente;
      });

      setClientes(dadosCompletos);
      setStatusMap(statusSalvos);
      setCnpjsValidados(cnpjs);
    };

    carregarDados();
  }, []);

  const trocarStatus = (cnpj: string) => {
    const atual = statusMap[cnpj] ?? 0;
    const novo = (atual + 1) % 4;
    const atualizado = { ...statusMap, [cnpj]: novo };
    setStatusMap(atualizado);
    localStorage.setItem('statusClientes', JSON.stringify(atualizado));
  };

  const getCorStatus = (status: number) => {
    switch (status) {
      case 1: return 'bg-yellow-400';
      case 2: return 'bg-green-500';
      case 3: return 'bg-red-700';
      default: return 'bg-gray-400';
    }
  };

  const ordenarPorNome = (lista: Cliente[]) =>
    lista.sort((a, b) =>
      (a.nomeFantasia || a.nomeMatriz || '').localeCompare(b.nomeFantasia || b.nomeMatriz || '')
    );

  const clientesOrdenados = ordenarPorNome(clientes);

  const contagemStatus: Record<number, number> = {};
  clientes.forEach((c) => {
    const cnpj = String(c.cnpj);
    const salvo = cnpjsValidados.includes(cnpj);
    const status = salvo ? 2 : (statusMap[cnpj] ?? 0);
    contagemStatus[status] = (contagemStatus[status] || 0) + 1;
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Biblioteca de Dados</h2>

      <div className="text-sm text-gray-600 mb-4">
        <span className="inline-flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-gray-400 mr-1" />
          Não Conferido: <strong>{contagemStatus[0] || 0}</strong>
        </span>
        <span className="inline-flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-yellow-400 mr-1" />
          Revisar: <strong>{contagemStatus[1] || 0}</strong>
        </span>
        <span className="inline-flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-green-500 mr-1" />
          Ativos: <strong>{contagemStatus[2] || 0}</strong>
        </span>
        <span className="inline-flex items-center mr-4">
          <span className="w-3 h-3 rounded-full bg-red-700 mr-1" />
          Inativos: <strong>{contagemStatus[3] || 0}</strong>
        </span>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div>
          <label>Filtrar por UF:</label>
          <select
            className="ml-2 border px-2 py-1"
            value={ufSelecionada}
            onChange={(e) => setUfSelecionada(e.target.value)}
          >
            <option value="">Todas</option>
            <option value="-">Sem UF</option>
            {ufsNordeste.map((uf) => (
              <option key={uf} value={uf}>{uf}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Filtrar por Cidade:</label>
          <input
            className="ml-2 border px-2 py-1"
            type="text"
            value={cidadeFiltro}
            onChange={(e) => setCidadeFiltro(e.target.value)}
            placeholder="Ex: Fortaleza"
          />
        </div>

        <div>
          <label>Filtrar por Status:</label>
          <select
            className="ml-2 border px-2 py-1"
            value={statusFiltro}
            onChange={(e) => setStatusFiltro(e.target.value)}
          >
            <option value="">Todos</option>
            <option value="0">Não Conferido</option>
            <option value="1">Revisar</option>
            <option value="2">Ativos</option>
            <option value="3">Inativos</option>
          </select>
        </div>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 text-left">#</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">CNPJ</th>
            <th className="p-2 text-left">Nome Fantasia</th>
            <th className="p-2 text-left">Cidade</th>
            <th className="p-2 text-left">UF</th>
          </tr>
        </thead>
        <tbody>
          {clientesOrdenados
            .filter((c) => {
              const cidade = (c.cidade || c.distrito || '').toLowerCase();
              const cnpj = String(c.cnpj);
              const salvo = cnpjsValidados.includes(cnpj);
              const status = salvo ? 2 : (statusMap[cnpj] ?? 0);

              const passaUF =
                ufSelecionada === ''
                  ? true
                  : ufSelecionada === '-'
                    ? !c.uf || c.uf.trim() === ''
                    : c.uf === ufSelecionada;

              const passaCidade =
                cidadeFiltro === '' || cidade.includes(cidadeFiltro.toLowerCase());

              const passaStatus =
                statusFiltro === '' || status === parseInt(statusFiltro);

              return passaUF && passaCidade && passaStatus;
            })
            .map((cliente, index) => {
              const cnpj = String(cliente.cnpj);
              const salvo = cnpjsValidados.includes(cnpj);
              const status = salvo ? 2 : (statusMap[cnpj] ?? 0);
              const numeroLinha = index + 1;

              return (
                <tr key={index} className="border-t">
                  <td className="p-2 text-gray-600 font-mono">{numeroLinha}</td>
                  <td className="p-2">
                    <button
                      className={`w-4 h-4 rounded-full ${getCorStatus(status)}`}
                      onClick={() => cliente.cnpj && trocarStatus(cnpj)}
                    />
                  </td>
                  <td className="p-2">{cliente.cnpj}</td>
                  <td
                    className="p-2 text-blue-600 cursor-pointer underline"
                    onClick={() => setClienteSelecionado(cliente)}
                  >
                    {cliente.nomeFantasia || cliente.nomeMatriz || '---'}
                  </td>
                  <td className="p-2">{cliente.cidade || cliente.distrito || '---'}</td>
                  <td className="p-2">{cliente.uf || '---'}</td>
                </tr>
              );
            })}
        </tbody>
      </table>

      {clienteSelecionado && (
        <ModalCNPJ
          cliente={clienteSelecionado}
          onFechar={() => setClienteSelecionado(null)}
        />
      )}
    </div>
  );
};

export default TabelaDadosPage;