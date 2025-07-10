import React, { useEffect, useState } from 'react';
import { FaCheck, FaPlus, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext'; // ⬅️ Adicionado

type Produto = {
  codigo: string;
  nome: string;
  quantidade: number;
  preco: number;
  valorVenda: string;
};

const STORAGE_KEY = 'novoProduto';

const formatarMoeda = (valor: number) =>
  `R$ ${valor.toFixed(2).replace('.', ',')}`;

const ProdutosConfigPage: React.FC = () => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [valoresInputs, setValoresInputs] = useState<
    Record<string, { preco: string; valorVenda: string }>
  >({});
  const { temaAtual } = useTheme(); // ⬅️ Tema acessado

  useEffect(() => {
    const salvo = localStorage.getItem(STORAGE_KEY);
    if (salvo) {
      const produtosSalvos: Produto[] = JSON.parse(salvo);
      const corrigidos = produtosSalvos.map(p => ({
        ...p,
        valorVenda: String((p as any).valorVenda || (p as any).vlr_venda || '0').replace(',', '.')
      }));

      setProdutos(corrigidos);

      const valoresIniciais: Record<string, { preco: string; valorVenda: string }> = {};
      corrigidos.forEach((p) => {
        valoresIniciais[p.codigo] = {
          preco: p.preco.toFixed(2).replace('.', ','),
          valorVenda: p.valorVenda.replace('.', ','),
        };
      });
      setValoresInputs(valoresIniciais);
    }
  }, []);

  const salvarProdutos = () => {
    const dadosConvertidos = produtos.map(p => ({
      ...p,
      valorVenda: String(p.valorVenda || '0').replace(',', '.'),
    }));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dadosConvertidos));
    alert('Novos produtos salvos com sucesso!');
  };

  const adicionarProduto = () => {
    const novo: Produto = {
      codigo: `PROD-${Date.now()}`,
      nome: 'Novo Produto',
      quantidade: 0,
      preco: 0,
      valorVenda: '0',
    };
    setProdutos((prev) => [...prev, novo]);
    setValoresInputs((prev) => ({
      ...prev,
      [novo.codigo]: { preco: '', valorVenda: '' },
    }));
  };

  const removerProduto = (index: number) => {
    const copia = [...produtos];
    const removido = copia[index];
    copia.splice(index, 1);
    setProdutos(copia);

    const novaTabela = { ...valoresInputs };
    delete novaTabela[removido.codigo];
    setValoresInputs(novaTabela);
  };

const handleChange = (
  index: number,
  campo: keyof Produto,
  valor: string
) => {
  const novosProdutos = produtos.map((produto, i) => {
    if (i !== index) return produto;

    const atualizado = { ...produto };
    if (campo === 'quantidade') {
      const qtd = parseInt(valor.replace(/\D/g, ''), 10);
      atualizado.quantidade = isNaN(qtd) ? 0 : qtd;
    } else {
      (atualizado as any)[campo] = valor;
    }

    return atualizado;
  });

  setProdutos(novosProdutos);
};


  const handleInputChange = (
    codigo: string,
    campo: 'preco' | 'valorVenda',
    valor: string
  ) => {
    setValoresInputs((prev) => ({
      ...prev,
      [codigo]: {
        ...prev[codigo],
        [campo]: valor,
      },
    }));
  };

const handleBlur = (
  index: number,
  campo: 'preco' | 'valorVenda'
) => {
  const valorDigitado = valoresInputs[produtos[index].codigo]?.[campo] || '';
  const limpo = valorDigitado.replace(/[^\d,]/g, '').replace(',', '.');
  const numero = parseFloat(limpo);

  const novosProdutos = produtos.map((produto, i) => {
    if (i !== index) return produto;

    return {
      ...produto,
      [campo]: campo === 'preco'
        ? isNaN(numero) ? 0 : parseFloat(numero.toFixed(2))
        : isNaN(numero) ? '0' : numero.toFixed(2),
    };
  });

  setProdutos(novosProdutos);

  setValoresInputs((prev) => ({
    ...prev,
    [produtos[index].codigo]: {
      ...prev[produtos[index].codigo],
      [campo]: isNaN(numero) ? '' : numero.toFixed(2).replace('.', ','),
    },
  }));
};


  const getCorEstoque = (qtd: number): string => {
    const isDark = temaAtual.fundo === '#0f0f0f';

    if (qtd === 0) return isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-gray-200 text-gray-800';
    if (qtd <= 10) return isDark ? 'bg-red-900 text-red-300' : 'bg-red-300 text-red-900';
    if (qtd <= 20) return isDark ? 'bg-yellow-900 text-yellow-300' : 'bg-yellow-200 text-yellow-900';
    if (qtd >= 300) return 'bg-blue-900 text-white';
    if (qtd >= 200) return 'bg-blue-600 text-white';
    if (qtd >= 150) return 'bg-blue-300 text-blue-900';
    return '';
  };

  let totalUnidades = 0;
  let totalPago = 0;
  let totalVenda = 0;
  let totalLucro = 0;

  const linhas = produtos.map((p, i) => {
    const valorVendaFloat = parseFloat(p.valorVenda.replace(',', '.')) || 0;
    const valorPago = p.quantidade * p.preco;
    const valorVendaTotal = valorVendaFloat * p.quantidade;
    const lucro = (valorVendaFloat - p.preco) * p.quantidade;

    totalUnidades += p.quantidade;
    totalPago += valorPago;
    totalVenda += valorVendaTotal;
    totalLucro += lucro;

    return (
      <tr key={p.codigo} className={`${getCorEstoque(p.quantidade)} transition`}>
        <td className="px-2 py-2 text-sm">{p.codigo.slice(0, 4)}...{p.codigo.slice(-4)}</td>
        <td className="px-2 py-2 text-sm">
          <input
            type="text"
            className="w-full rounded px-2"
            style={{ backgroundColor: temaAtual.input, color: temaAtual.texto }}
            value={p.nome}
            onChange={(e) => handleChange(i, 'nome', e.target.value)}
          />
        </td>
        <td className="px-2 py-2 text-sm text-center">
          <input
            type="text"
            className="w-16 text-center"
            style={{ backgroundColor: temaAtual.input, color: temaAtual.texto }}
            value={p.quantidade.toString()}
            onChange={(e) => handleChange(i, 'quantidade', e.target.value)}
          />
        </td>
        <td className="px-2 py-2 text-sm text-center">
          R$ <input
            type="text"
            className="w-20 text-center"
            style={{ backgroundColor: temaAtual.input, color: temaAtual.texto }}
            value={valoresInputs[p.codigo]?.preco || ''}
            onChange={(e) => handleInputChange(p.codigo, 'preco', e.target.value)}
            onBlur={() => handleBlur(i, 'preco')}
          />
        </td>
        <td className="px-2 py-2 text-sm text-center">
          R$ <input
            type="text"
            className="w-20 text-center"
            style={{ backgroundColor: temaAtual.input, color: temaAtual.texto }}
            value={valoresInputs[p.codigo]?.valorVenda || ''}
            onChange={(e) => handleInputChange(p.codigo, 'valorVenda', e.target.value)}
            onBlur={() => handleBlur(i, 'valorVenda')}
          />
        </td>
        <td className="px-2 py-2 text-sm text-center">
          {formatarMoeda(valorPago)}
        </td>
        <td className="px-2 py-2 text-sm text-center">
          {formatarMoeda(lucro)}
        </td>
        <td className="px-2 py-2 text-sm text-center">
          <button
            onClick={() => removerProduto(i)}
            className="text-red-600 hover:text-red-800"
          >
            <FaTimes />
          </button>
        </td>
      </tr>
    );
  });

  return (
    <div className="p-6 space-y-8" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <h1 className="text-2xl font-bold mb-1" style={{ color: temaAtual.destaque }}>
        Gerenciar Produtos
      </h1>
      <p className="text-sm" style={{ color: temaAtual.contraste }}>
        Configure categorias e dados de produtos do estoque.
      </p>

      <div className="flex justify-end items-center">
  <div className="flex gap-3">
    <button
      onClick={salvarProdutos}
      title="Salvar Produtos"
      style={{
        backgroundColor: temaAtual.destaque,
        color: temaAtual.textoBranco,
        border: `1px solid ${temaAtual.contraste}`,
      }}
      className="p-2 rounded-full shadow hover:opacity-90 transition"
    >
      <FaCheck />
    </button>

    <button
      onClick={adicionarProduto}
      title="Adicionar Produto"
      style={{
        backgroundColor: temaAtual.contraste,
        color: temaAtual.textoBranco,
        border: `1px solid ${temaAtual.destaque}`,
      }}
      className="p-2 rounded-full shadow hover:opacity-90 transition"
    >
      <FaPlus />
    </button>
  </div>
</div>
      <div className="overflow-x-auto rounded shadow">
        <table className="min-w-full divide-y" style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}>
          <thead style={{ backgroundColor: temaAtual.destaque, color: temaAtual.textoBranco }}>
            <tr>
              <th className="px-2 py-2 text-left">Código</th>
              <th className="px-2 py-2 text-left">Nome</th>
              <th className="px-2 py-2 text-center">Qtd</th>
              <th className="px-2 py-2 text-center">Preço Und</th>
              <th className="px-2 py-2 text-center">Vlr. Venda</th>
              <th className="px-2 py-2 text-center">Valor Pago</th>
              <th className="px-2 py-2 text-center">Lucro</th>
              <th className="px-2 py-2 text-center">Remover</th>
            </tr>
          </thead>
          <tbody>{linhas}</tbody>
        </table>
      </div>

      <div className="mt-6 p-4 rounded shadow text-sm" style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}>
        <p><strong>Produtos cadastrados:</strong> {produtos.length}</p>
        <p><strong>Total de unidades:</strong> {totalUnidades}</p>
        <p><strong>Total Pago:</strong> {formatarMoeda(totalPago)}</p>
        <p><strong>Prospecção de Venda:</strong> {formatarMoeda(totalVenda)}</p>
        <p><strong>Lucro Total:</strong>{' '}
          <span className={totalLucro >= 0 ? 'text-green-400 font-semibold' : 'text-red-500 font-semibold'}>
            {formatarMoeda(totalLucro)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProdutosConfigPage;