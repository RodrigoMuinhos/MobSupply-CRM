'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { Venda } from '../../../types/venda';

import BarraDeBusca from '../components/BarraDeBusca';
import ResumoFinanceiro from '../components/ResumoFinanceiro';
import GraficoModelosMaisVendidos from '../components/GraficoModelosMaisVendidos';
import GraficoTopClientes from '../components/GraficoTopClientes';
import TabelaMensal from '../components/TabelaMensal';
import ModalSelecaoRecibo from '../components/ModalSelecaoRecibo';
import ModalRecibo from '../../../components/ModalRecibo';
import ModalRelatorioPDF from '../components/ModalRelatorioPDF';

import { FaFileImport, FaFileExport, FaFilePdf } from 'react-icons/fa';

const RelatorioVendaPage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [vendas, setVendas] = useState<Venda[]>([]);
  const [buscaNome, setBuscaNome] = useState('');
  const [buscaCpf, setBuscaCpf] = useState('');
  const [modoExibicao, setModoExibicao] = useState<'todos' | 'porData'>('todos');
  const [mesSelecionado, setMesSelecionado] = useState<number>(new Date().getMonth());
  const [anoSelecionado, setAnoSelecionado] = useState<number>(new Date().getFullYear());

  const [modelosVendidos, setModelosVendidos] = useState<Record<string, number>>({});
  const [recibosDisponiveis, setRecibosDisponiveis] = useState<Venda[] | null>(null);
  const [vendaSelecionada, setVendaSelecionada] = useState<Venda | null>(null);
  const [abrirModalRelatorio, setAbrirModalRelatorio] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const parseDataVenda = (data: string): string => {
    if (!data) return '';
    if (data.includes('/')) {
      const [dia, mes, ano] = data.split('/');
      const dataFormatada = new Date(`${ano}-${mes}-${dia}`);
      if (!isNaN(dataFormatada.getTime())) return dataFormatada.toISOString();
    }
    const dataPadrao = new Date(data);
    return !isNaN(dataPadrao.getTime()) ? dataPadrao.toISOString() : '';
  };

  const importarJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const json = JSON.parse(event.target?.result as string) as Venda[];
      const vendasAtuais: Venda[] = JSON.parse(localStorage.getItem('vendasMOB') || '[]');

      const novasFormatadas = json.map((v) => ({
        ...v,
        data: new Date(parseDataVenda(v.data)).toISOString(),
        total_final: Number(v.total_final || 0),
        itens: Array.isArray(v.itens) ? v.itens : [],
      }));

      const mapa = new Map<string, Venda>();

      [...vendasAtuais, ...novasFormatadas].forEach((venda) => {
        const chave =
          typeof venda.numero === 'number' && venda.numero > 0
            ? `${venda.numero}`
            : `${venda.cliente?.cpf || 'semcpf'}_${new Date(venda.data).toISOString().split('T')[0]}`;

        const existente = mapa.get(chave);
        if (!existente || new Date(venda.data) > new Date(existente.data)) {
          mapa.set(chave, venda);
        }
      });

      const unificadas = Array.from(mapa.values());

      localStorage.setItem('vendasMOB', JSON.stringify(unificadas));
      setVendas(unificadas);
      alert('✅ Vendas importadas com sucesso!');
    } catch (err) {
      console.error('Erro ao importar JSON:', err);
      alert('❌ Erro ao importar JSON. Verifique o arquivo.');
    }
  };

  reader.readAsText(file);
};

  const exportarJSON = () => {
    const blob = new Blob([JSON.stringify(vendas, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'vendasMOB.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    const dados = localStorage.getItem('vendasMOB');
    const vendasSalvas: Venda[] = dados ? JSON.parse(dados) : [];

    const formatadas = vendasSalvas.map((v) => ({
      ...v,
      data: new Date(parseDataVenda(v.data)).toISOString(),
      total_final: Number(v.total_final || 0),
      itens: Array.isArray(v.itens) ? v.itens : [],
    }));

    setVendas(formatadas);

    const modelos: Record<string, number> = {};
    formatadas.forEach((v) => {
      v.itens.forEach((item) => {
        const modelo = item.nome.trim().split(' ').pop() || '';
        modelos[modelo] = (modelos[modelo] || 0) + item.quantidade;
      });
    });
    setModelosVendidos(modelos);
  }, []);

  const anosDisponiveis = Array.from(
    new Set(vendas.map((v) => new Date(v.data).getFullYear()))
  ).sort((a, b) => b - a);

  const vendasFiltradas = vendas.filter((v) => {
    const nome = v.cliente.nome.toLowerCase();
    const cpf = v.cliente.cpf;
    const data = new Date(v.data);

    const filtroData =
      modoExibicao === 'porData'
        ? data.getMonth() === mesSelecionado && data.getFullYear() === anoSelecionado
        : true;

    return (
      (!buscaNome || nome.includes(buscaNome.toLowerCase())) &&
      (!buscaCpf || cpf.includes(buscaCpf)) &&
      filtroData
    );
  });

  return (
    <div className="p-6 min-h-screen" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold" style={{ color: temaAtual.destaque }}>
          Relatório de Vendas
        </h1>
        <div className="flex gap-4 items-center">
          <button
            onClick={() => setAbrirModalRelatorio(true)}
            title="Gerar Relatório"
            className="text-xl"
          >
            <FaFilePdf />
          </button>

          <button
            onClick={exportarJSON}
            title="Exportar JSON"
            className="text-xl"
          >
            <FaFileExport />
          </button>

          <label className="cursor-pointer text-xl" title="Importar JSON">
            <FaFileImport />
            <input
              type="file"
              accept=".json"
              onChange={importarJSON}
              className="hidden"
              ref={inputRef}
            />
          </label>
        </div>
      </div>

      <BarraDeBusca
        buscaNome={buscaNome}
        setBuscaNome={setBuscaNome}
        buscaCpf={buscaCpf}
        setBuscaCpf={setBuscaCpf}
        modoExibicao={modoExibicao}
        setModoExibicao={setModoExibicao}
        mesSelecionado={mesSelecionado}
        setMesSelecionado={setMesSelecionado}
        anoSelecionado={anoSelecionado}
        setAnoSelecionado={setAnoSelecionado}
        anosDisponiveis={anosDisponiveis}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        <GraficoModelosMaisVendidos dados={modelosVendidos} />
        <GraficoTopClientes vendas={vendasFiltradas} />
        <ResumoFinanceiro vendasFiltradas={vendasFiltradas} />
      </div>

      {Object.entries(
        vendasFiltradas.reduce((acc, venda) => {
          const dataObj = new Date(venda.data);
          if (isNaN(dataObj.getTime())) return acc;
          const key = `${dataObj.getFullYear()}-${String(dataObj.getMonth() + 1).padStart(2, '0')}`;
          if (!acc[key]) acc[key] = [];
          acc[key].push(venda);
          return acc;
        }, {} as Record<string, Venda[]>)
      )
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([mesAno, vendasDoMes]) => (
          <TabelaMensal
            key={mesAno}
            mesReferencia={mesAno}
            vendas={vendasDoMes}
            onAtualizarVendas={(v) => {
              const novas = vendas.map((orig) =>
                v.find((nova) => nova.numero === orig.numero) || orig
              );
              setVendas(novas);
              localStorage.setItem('vendasMOB', JSON.stringify(novas));
            }}
            onAbrirRecibo={(v) => setVendaSelecionada(v)}
            onAbrirSelecaoRecibo={(lista) => setRecibosDisponiveis(lista)}
          />
        ))}

      {recibosDisponiveis && (
        <ModalSelecaoRecibo
          recibos={recibosDisponiveis}
          onSelecionar={(venda) => {
            setVendaSelecionada(venda);
            setRecibosDisponiveis(null);
          }}
          onCancelar={() => setRecibosDisponiveis(null)}
        />
      )}

      {vendaSelecionada && (
        <ModalRecibo
          vendaSelecionada={vendaSelecionada}
          onConfirmar={() => setVendaSelecionada(null)}
          onCancelar={() => setVendaSelecionada(null)}
        />
      )}

      {abrirModalRelatorio && (
        <ModalRelatorioPDF
          vendasFiltradas={vendasFiltradas}
          onClose={() => setAbrirModalRelatorio(false)}
        />
      )}
    </div>
  );
};

export default RelatorioVendaPage;