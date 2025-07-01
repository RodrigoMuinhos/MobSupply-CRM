import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';
import { useTheme } from '../../../context/ThemeContext';

type Cliente = {
  distrito?: string | null;
  uf?: string | null;
  validado?: string | null;
};

const cores = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042',
  '#d0ed57', '#a4de6c', '#8dd1e1', '#83a6ed',
  '#ffbb28', '#ff6666', '#00c49f'
];

const GraficosDadosPage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [ufFiltro, setUfFiltro] = useState<string>('');
  const [statusFiltro, setStatusFiltro] = useState<string>('');

  useEffect(() => {
    fetch('/DadosClientes/clientesBiblioteca.json')
      .then((res) => res.json())
      .then((data: Cliente[]) => {
        setClientes(data);
      });
  }, []);

  const listaUFsUnicas = Array.from(new Set(
    clientes
      .map((c) => (typeof c.uf === 'string' ? c.uf.trim().toUpperCase() : ''))
      .filter((uf) => uf !== '')
  )).sort();

  const clientesFiltrados = clientes.filter((c) => {
    const uf = c.uf?.trim().toUpperCase();
    const status = c.validado;
    const atendeUF = ufFiltro ? uf === ufFiltro : true;
    const atendeStatus = statusFiltro ? status === statusFiltro : true;
    return atendeUF && atendeStatus;
  });

  const contagem = {
    porCidade: {} as Record<string, number>,
    porUF: {} as Record<string, number>,
    valido: 0,
    invalido: 0,
  };

  clientesFiltrados.forEach((c) => {
    const cidade = c.distrito?.trim();
    const uf = c.uf?.trim().toUpperCase();
    if (cidade) contagem.porCidade[cidade] = (contagem.porCidade[cidade] || 0) + 1;
    if (uf) contagem.porUF[uf] = (contagem.porUF[uf] || 0) + 1;
    if (c.validado === 'Válido') contagem.valido++;
    else contagem.invalido++;
  });

  const listaCidades = Object.entries(contagem.porCidade)
    .map(([cidade, quantidade]) => ({ cidade, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const listaUFs = Object.entries(contagem.porUF)
    .map(([uf, quantidade]) => ({ uf, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);

  const estiloCard = {
    background: temaAtual.cardGradient || temaAtual.card,
    color: temaAtual.texto,
    border: `1px solid ${temaAtual.destaque}`,
    backdropFilter: 'blur(6px)',
    WebkitBackdropFilter: 'blur(6px)',
  };

  return (
    <div className="p-6 space-y-12 min-h-screen" style={{ background: temaAtual.fundo, color: temaAtual.texto }}>
      <h1 className="text-2xl font-bold mb-6">Dashboard da Biblioteca de Dados</h1>

      {/* Filtros */}
      <div className="flex flex-wrap gap-4 mb-4">
        <select
          value={ufFiltro}
          onChange={(e) => setUfFiltro(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
          style={{ color: temaAtual.texto, background: temaAtual.card }}
        >
          <option value="">Todas as UFs</option>
          {listaUFsUnicas.map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>

        <select
          value={statusFiltro}
          onChange={(e) => setStatusFiltro(e.target.value)}
          className="px-3 py-1 border rounded text-sm"
          style={{ color: temaAtual.texto, background: temaAtual.card }}
        >
          <option value="">Todos os Status</option>
          <option value="Válido">Válido</option>
          <option value="Inválido">Inválido</option>
        </select>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded shadow text-center" style={estiloCard}>
          <h2 className="text-lg font-semibold">Total de Registros</h2>
          <p className="text-3xl font-bold mt-2">{clientesFiltrados.length}</p>
        </div>
        <div className="p-4 rounded shadow text-center" style={estiloCard}>
          <h2 className="text-lg font-semibold">Cidades Únicas</h2>
          <p className="text-3xl font-bold mt-2">{listaCidades.length}</p>
        </div>
        <div className="p-4 rounded shadow text-center" style={estiloCard}>
          <h2 className="text-lg font-semibold">UFs Únicas</h2>
          <p className="text-3xl font-bold mt-2">{listaUFsUnicas.length}</p>
        </div>
      </div>

      {/* Válidos vs Inválidos */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Validação Geral</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={[
                { nome: 'Válido', valor: contagem.valido },
                { nome: 'Inválido', valor: contagem.invalido },
              ]}
              dataKey="valor"
              nameKey="nome"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label
            >
              <Cell fill="#00C49F" />
              <Cell fill="#FF6666" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Por UF */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Contatos por Estado (UF)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={listaUFs}>
            <XAxis dataKey="uf" stroke={temaAtual.texto} />
            <YAxis stroke={temaAtual.texto} />
            <Tooltip />
            <Bar dataKey="quantidade">
              {listaUFs.map((_, index) => (
                <Cell key={index} fill={cores[index % cores.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Por Cidade - Barras */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Top 10 Cidades com Mais Contatos</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={listaCidades.slice(0, 10)}>
            <XAxis dataKey="cidade" stroke={temaAtual.texto} />
            <YAxis stroke={temaAtual.texto} />
            <Tooltip />
            <Bar dataKey="quantidade">
              {listaCidades.slice(0, 10).map((_, index) => (
                <Cell key={index} fill={cores[index % cores.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Por Cidade - Pizza */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Distribuição por Cidade</h2>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={listaCidades.slice(0, 10)}
              dataKey="quantidade"
              nameKey="cidade"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label
            >
              {listaCidades.slice(0, 10).map((_, index) => (
                <Cell key={index} fill={cores[index % cores.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GraficosDadosPage;