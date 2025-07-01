import React, { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { useTheme } from '../../../context/ThemeContext';
import ModalRecibo from '../../../components/ModalRecibo';
import { Cliente, Produto } from '../../../types/venda';

type ProdutoEstoque = {
  codigo: string;
  nome: string;
  marca: string;
  grupo: string;
  quantidade: number;
  valorVenda: string; 
  tipo?: string;     
};

type ItemCarrinho = Produto; 

const NovaVendaPage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [cliente, setCliente] = useState<Cliente>({
    nome: '', cpf: '', whatsapp: '', endereco: '', email: '', cep: '', nascimento: ''
  });
  const [cpfValido, setCpfValido] = useState(true);
  const [listaClientes, setListaClientes] = useState<Cliente[]>([]);
  const [estoque, setEstoque] = useState<ProdutoEstoque[]>([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [tipoSelecionado, setTipoSelecionado] = useState<'caixa' | '5un' | 'unidade'>('caixa');
  const [filtroMarca, setFiltroMarca] = useState('Todos');
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [desconto, setDesconto] = useState(0);
  const [freteTexto, setFreteTexto] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('Dinheiro');
  const [parcelas, setParcelas] = useState(1);
  const [cupom, setCupom] = useState('');
  const [mostrarModalRecibo, setMostrarModalRecibo] = useState(false);
  const [destinoDesconto, setDestinoDesconto] = useState<string>('');
  const [sucesso, setSucesso] = useState(false);
  const reciboRef = useRef<HTMLDivElement>(null);
  const [itemAtual, setItemAtual] = useState({
  nome: '',
  quantidade: 1,
  precoUnitario: 0,
  subtotal: 0,
  marca: '',
  codigo: '',
  tipo: ''
});

const [membrosExtras, setMembrosExtras] = useState<{ nome: string }[]>([]);

useEffect(() => {
  const extras = JSON.parse(localStorage.getItem('EquipeExtra') || '[]');
  setMembrosExtras(extras);
}, []);


  const finalizarVenda = () => {
  if (!cliente.nome || !cliente.cpf || !cliente.whatsapp) {
    alert('Preencha os dados obrigatórios do cliente.');
    return;
  }

  if (!validarCPF(cliente.cpf)) {
    alert('CPF inválido.');
    return;
  }

  if (carrinho.length === 0) {
    alert('Adicione pelo menos um item ao carrinho.');
    return;
  }

  
  const agora = new Date();
  const hora = agora.toLocaleTimeString('pt-BR');
  const data = agora.toLocaleDateString('pt-BR');

  const subtotal = carrinho.reduce((acc, cur) => acc + cur.subtotal, 0);
  const valorDesconto = subtotal * (desconto / 100);
  const frete = parseFloat(freteTexto.replace(',', '.')) || 0;
  const acrescimo = formaPagamento === 'Cartão de Crédito'
    ? (subtotal * tabelaJuros[parcelas]) / 100
    : 0;
  const totalFinal = subtotal - valorDesconto + frete + acrescimo;

  const numero = Number(localStorage.getItem('contadorVendas') || '0') + 1;
  localStorage.setItem('contadorVendas', numero.toString());

  const novaVenda = {
    numero,
    hora,
    cliente,
    itens: carrinho,
    data,
    subtotal,
    desconto_aplicado: valorDesconto,
    frete,
    total_final: totalFinal,
    forma_pagamento: formaPagamento,
    destino_desconto: destinoDesconto,
    pago: false
  };

  const vendasAnteriores = JSON.parse(localStorage.getItem('vendasMOB') || '[]');
  localStorage.setItem('vendasMOB', JSON.stringify([...vendasAnteriores, novaVenda]));

  const clientesSalvos = JSON.parse(localStorage.getItem('clientesMOB') || '[]');
  const existe = clientesSalvos.some((c: Cliente) => c.cpf === cliente.cpf);
  if (!existe) {
    localStorage.setItem('clientesMOB', JSON.stringify([...clientesSalvos, cliente]));
  }

  const estoqueRaw = localStorage.getItem('estoque_local');
  if (estoqueRaw) {
    const estoqueObj = JSON.parse(estoqueRaw);
    carrinho.forEach((item) => {
      const marca = item.marca.toLowerCase();
      const grupo = item.codigo.split('-')[1];
      const lista = estoqueObj[marca]?.[grupo];
      if (lista) {
        const index = lista.findIndex((p: any) => p.codigo === item.codigo);
        if (index !== -1) {
          lista[index].quantidade -= item.tipo === 'caixa' ? 1 : item.tipo === '5un' ? 5 : 1;
        }
      }
    });
    localStorage.setItem('estoque_local', JSON.stringify(estoqueObj));
  }

  setCarrinho([]);
  setCliente({
    nome: '', cpf: '', whatsapp: '', endereco: '', email: '', cep: '', nascimento: ''
  });
  setDesconto(0);
  setFreteTexto('');
  setCupom('');
  setDestinoDesconto('');
  setSucesso(true);
  setTimeout(() => setSucesso(false), 3000);
};

  const tabelaJuros: Record<number, number> = {
    1: 0, 2: 4.25, 3: 6.45, 4: 8.45, 5: 10.25, 6: 11.95,
    7: 13.65, 8: 15.25, 9: 16.85, 10: 18.45, 11: 19.75, 12: 21.25
  };

 useEffect(() => {
  // Carrega produtos do estoque principal
  const dados = localStorage.getItem('estoque_local');
  const lista: ProdutoEstoque[] = [];

  if (dados) {
    const obj = JSON.parse(dados);
    Object.entries(obj).forEach(([marca, grupos]) => {
      Object.entries(grupos as Record<string, any[]>).forEach(([grupo, itens]) => {
        itens.forEach((item: any) => {
          lista.push({ ...item, grupo, marca: marca.toUpperCase() });
        });
      });
    });
  }

  // Carrega produtos personalizados
  const produtosExtras = JSON.parse(localStorage.getItem('novoProduto') || '[]');
const formatados = produtosExtras.map((p: any) => ({
  ...p,
 valorVenda: String(p.valorVenda || p.vlr_venda || '0').replace(',', '.'),
  marca: 'EXTRAS',
  grupo: 'Personalizado',
}));

  const codigosExistentes = new Set(lista.map(p => p.codigo));
  const extrasFiltrados = formatados.filter(p => !codigosExistentes.has(p.codigo));

  setEstoque([...lista, ...extrasFiltrados]);

  // Carrega lista de clientes
  const dadosClientes = localStorage.getItem('clientesMOB');
  if (dadosClientes) {
    setListaClientes(JSON.parse(dadosClientes));
  }
}, []);

// Esse segundo useEffect depende do produtoSelecionado e do estoque carregado
useEffect(() => {
  if (produtoSelecionado && estoque.length > 0) {
    const produto = estoque.find(p => p.codigo === produtoSelecionado);

    if (produto) {
      const precoVenda = parseFloat(String(produto.valorVenda).replace(',', '.'));
      const quantidade = 1;

      setItemAtual({
        nome: produto.nome,
        quantidade,
        precoUnitario: precoVenda,
        subtotal: precoVenda * quantidade,
        marca: produto.marca,
        codigo: produto.codigo,
        tipo: produto.tipo || '',
      });
    }
  }
}, [produtoSelecionado, estoque]);

  const formatarCPF = (valor: string) => {
    const digits = valor.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4');
  };

  const validarCPF = (cpf: string) => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;
    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cleaned[i]) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cleaned[9])) return false;
    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cleaned[i]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cleaned[10]);
  };

  const handleNomeChange = (nomeDigitado: string) => {
    setCliente((prev) => ({ ...prev, nome: nomeDigitado }));
    const encontrado = listaClientes.find((c) =>
      c.nome.toLowerCase() === nomeDigitado.toLowerCase()
    );
    if (encontrado) {
      setCliente({ ...encontrado });
      setCpfValido(validarCPF(encontrado.cpf));
    }
  };

  const handleCpfChange = (valorDigitado: string) => {
    const formatado = formatarCPF(valorDigitado);
    setCliente((prev) => ({ ...prev, cpf: formatado }));
    const isValido = validarCPF(formatado);
    setCpfValido(isValido);
    const encontrado = listaClientes.find((c) =>
      c.cpf.replace(/\D/g, '') === formatado.replace(/\D/g, '')
    );
    if (encontrado) {
      setCliente({ ...encontrado });
    }
  };

  const calcularPreco = (marca: string, tipo: string) => {
    const m = marca.toLowerCase();
    if (m.includes('skink')) {
      if (tipo === 'caixa') return 220 / 20;
      if (tipo === '5un') return 55.9 / 5;
      return 11.9;
    }
    if (m.includes('vx')) {
      if (tipo === 'caixa') return 180 / 20;
      if (tipo === '5un') return 48.9 / 5;
      return 9.9;
    }
    return 0;
  };
const adicionarProdutoSelecionado = () => {
  const produto = estoque.find(p => p.codigo === produtoSelecionado);
  if (!produto) return;

  const unidades = tipoSelecionado === 'caixa' ? 20 : tipoSelecionado === '5un' ? 5 : 1;

  // Detecta se é produto personalizado vindo do localStorage 'novoProduto'
  const veioDeNovoProduto = produto.marca === 'EXTRAS';

let precoUnitario = 0;

if (veioDeNovoProduto) {
  const bruto = produto.valorVenda;
  if (typeof bruto === 'string' || typeof bruto === 'number') {
    const convertido = parseFloat(String(bruto).replace(',', '.'));
    if (!isNaN(convertido) && convertido > 0) {
      precoUnitario = convertido;
    }
  }
} else {
  precoUnitario = calcularPreco(produto.marca, tipoSelecionado);
}
// Validação final

if (isNaN(precoUnitario) || precoUnitario <= 0) {
  alert('Preço inválido.');
  console.warn('Produto:', produto);
  return;
}

  const subtotal = unidades * precoUnitario;

  setCarrinho(prev => {
    const index = prev.findIndex(item =>
      item.codigo === produto.codigo &&
      item.tipo === tipoSelecionado &&
      item.marca === produto.marca
    );
    const novoCarrinho = [...prev];

    if (index !== -1) {
      const itemExistente = novoCarrinho[index];
      const novaQuantidade = itemExistente.quantidade + unidades;
      const novoSubtotal = novaQuantidade * precoUnitario;

      novoCarrinho[index] = {
        ...itemExistente,
        quantidade: novaQuantidade,
        subtotal: parseFloat(novoSubtotal.toFixed(2)),
      };
    } else {
      novoCarrinho.push({
        codigo: produto.codigo,
        nome: produto.nome,
        marca: produto.marca,
        tipo: tipoSelecionado,
        quantidade: unidades,
        precoUnitario: parseFloat(precoUnitario.toFixed(2)),
        subtotal: parseFloat(subtotal.toFixed(2)),
      });
    }

    return novoCarrinho;
  });
};

  const removerDoCarrinho = (index: number) => {
    const atualizado = [...carrinho];
    atualizado.splice(index, 1);
    setCarrinho(atualizado);
  };

  return (
    <div
      className="p-6 min-h-screen transition-all duration-300"
      style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}
    >
      <h1 className="text-2xl font-bold mb-4" style={{ color: temaAtual.destaque }}>
        Nova Venda
      </h1>

      {sucesso && (
        <div
          className="p-3 rounded mb-4 transition-all duration-300"
          style={{
            backgroundColor: '#d1fae5',
            color: '#065f46',
            border: '1px solid #34d399'
          }}
        >
          Venda realizada com sucesso!
        </div>
      )}

      {/* FORMULÁRIO DO CLIENTE */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 rounded shadow"
        style={{
          backgroundColor: temaAtual.card,
          color: temaAtual.texto,
          border: `1px solid ${temaAtual.destaque}`
        }}
      >
        <input
          list="sugestoes-clientesMOB"
          type="text"
          placeholder="Nome"
          className="border p-2 rounded"
          value={cliente.nome}
          onChange={(e) => handleNomeChange(e.target.value)}
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque
          }}
        />
        <datalist id="sugestoes-clientesMOB">
          {listaClientes.map((c, i) => (
            <option key={i} value={c.nome} />
          ))}
        </datalist>

        <input
          type="text"
          placeholder="WhatsApp"
          className="border p-2 rounded"
          value={cliente.whatsapp}
          onChange={(e) => setCliente({ ...cliente, whatsapp: e.target.value })}
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque
          }}
        />

        <input
          type="text"
          placeholder="Endereço"
          className="border p-2 rounded"
          value={cliente.endereco}
          onChange={(e) => setCliente({ ...cliente, endereco: e.target.value })}
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque
          }}
        />

        <input
          list="sugestoes-cpf"
          type="text"
          placeholder="CPF"
          className={`border p-2 rounded transition-all duration-300 ${cpfValido ? '' : 'border-red-500'}`}
          value={cliente.cpf}
          onChange={(e) => handleCpfChange(e.target.value)}
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: cpfValido ? temaAtual.destaque : 'red'
          }}
        />
        <datalist id="sugestoes-cpf">
          {listaClientes.map((c, i) => (
            <option key={i} value={c.cpf} />
          ))}
        </datalist>

        <input
          type="text"
          placeholder="CEP"
          className="border p-2 rounded"
          value={cliente.cep}
          onChange={(e) => setCliente({ ...cliente, cep: e.target.value })}
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque
          }}
        />

        <input
          type="date"
          className="border p-2 rounded"
          value={cliente.nascimento}
          onChange={(e) => setCliente({ ...cliente, nascimento: e.target.value })}
          style={{
            backgroundColor: temaAtual.card,
            color: temaAtual.texto,
            borderColor: temaAtual.destaque
          }}
        />
      </div>

      {/* FILTROS E PRODUTOS */}
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="mr-2 font-medium">Filtrar por marca:</label>
          <select
            className="border p-2 rounded"
            value={filtroMarca}
            onChange={(e) => setFiltroMarca(e.target.value)}
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque
            }}
          >
            <option value="Todos">Todos</option>
            <option value="SKINK">SKINK ink</option>
            <option value="VXCRAFT">VX Craft</option>
            <option value="EXTRAS">Produtos</option>
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Produto:</label>
          <select
            className="border p-2 rounded w-72"
            value={produtoSelecionado}
            onChange={(e) => setProdutoSelecionado(e.target.value)}
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque
            }}
          >
            <option value="">Selecione</option>
            {estoque
              .filter(item => filtroMarca === 'Todos' || item.marca.toLowerCase().startsWith(filtroMarca.toLowerCase()))
              .map(item => (
                <option key={item.codigo} value={item.codigo}>
  {item.nome}
</option>
              ))}
          </select>
        </div>

        <div>
          <label className="mr-2 font-medium">Tipo:</label>
          <select
            className="border p-2 rounded"
            value={tipoSelecionado}
            onChange={(e) => setTipoSelecionado(e.target.value as any)}
            style={{
              backgroundColor: temaAtual.card,
              color: temaAtual.texto,
              borderColor: temaAtual.destaque
            }}
          >
            <option value="caixa">Caixa</option>
            <option value="5un">5 Unidades</option>
            <option value="unidade">Unidade</option>
          </select>
        </div>

        <button
          onClick={adicionarProdutoSelecionado}
          className="px-4 py-2 rounded font-semibold transition-all duration-300"
          style={{
            backgroundColor: temaAtual.destaque,
            color: temaAtual.textoBranco
          }}
        >
          🛒 Adicionar
        </button>
      </div>

      {/* CARRINHO */}
      <div ref={reciboRef}>
        <h2 className="text-xl font-bold mt-6 mb-2" style={{ color: temaAtual.destaque }}>
          Carrinho
        </h2>

        {carrinho.length === 0 ? (
          <p className="text-gray-500">Nenhum item adicionado.</p>
        ) : (
          <>
            <table
              className="min-w-full text-sm rounded shadow overflow-hidden"
              style={{
                backgroundColor: temaAtual.card,
                color: temaAtual.texto,
                border: `1px solid ${temaAtual.destaque}`
              }}
            >
              <thead style={{ backgroundColor: temaAtual.destaque, color: temaAtual.textoBranco }}>
                <tr>
                  <th className="p-2 text-left">Produto</th>
                  <th className="p-2 text-center">Tipo</th>
                  <th className="p-2 text-center">Qtd</th>
                  <th className="p-2 text-right">Preço</th>
                  <th className="p-2 text-right">Subtotal</th>
                  <th className="p-2 text-center">Ação</th>
                </tr>
              </thead>
              <tbody>
                {carrinho.map((item, index) => (
                  <tr key={index} className="border-t" style={{ borderColor: temaAtual.destaque }}>
                    <td className="p-2">
                      <span className="font-medium">{item.marca}</span><br />
                      <span className="text-sm">{item.nome}</span>
                    </td>
                    <td className="p-2 text-center">{item.tipo}</td>
                    <td className="p-2 text-center">{item.quantidade}</td>
                    <td className="p-2 text-right">R$ {item.precoUnitario.toFixed(2)}</td>
                    <td className="p-2 text-right">R$ {item.subtotal.toFixed(2)}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => removerDoCarrinho(index)}
                        style={{ color: temaAtual.destaque }}
                      >
                        ❌
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* CUPOM, DESTINO E FRETE */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <button
                onClick={() => {
                  if (desconto === 0) setDesconto(5);
                  else if (desconto === 5) setDesconto(10);
                  else setDesconto(0);
                }}
                className="w-full px-4 py-2 rounded font-semibold transition-all duration-300"
                style={{
                  backgroundColor:
                    desconto === 0 ? temaAtual.card :
                    desconto === 5 ? temaAtual.destaque :
                    temaAtual.texto,
                  color:
                    desconto === 0 ? temaAtual.texto :
                    desconto === 5 ? temaAtual.textoBranco :
                    temaAtual.fundo
                }}
              >
                {desconto === 0 ? 'Cupom: Off' : `Cupom: ${desconto}%`}
              </button>

<div className="flex gap-2 flex-wrap">
  {/* Botões fixos */}
  {['RF', 'IM', 'AG'].map((tipo) => (
    <button
      key={tipo}
      onClick={() => setDestinoDesconto(tipo as any)}
      className={`px-3 py-2 rounded font-semibold text-sm transition-all duration-300 ${
        destinoDesconto === tipo ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{
        backgroundColor: destinoDesconto === tipo ? temaAtual.destaque : temaAtual.card,
        color: destinoDesconto === tipo ? temaAtual.textoBranco : temaAtual.texto,
        border: `1px solid ${temaAtual.destaque}`
      }}
    >
      {tipo}
    </button>
  ))}

  {/* Botões dinâmicos extras */}
  {membrosExtras.map((membro) => (
    <button
      key={membro.nome}
      onClick={() => setDestinoDesconto(membro.nome)}
      className={`px-3 py-2 rounded font-semibold text-sm transition-all duration-300 ${
        destinoDesconto === membro.nome ? 'ring-2 ring-offset-1' : ''
      }`}
      style={{
        backgroundColor: destinoDesconto === membro.nome ? temaAtual.destaque : temaAtual.card,
        color: destinoDesconto === membro.nome ? temaAtual.textoBranco : temaAtual.texto,
        border: `1px solid ${temaAtual.destaque}`
      }}
    >
      {membro.nome}
    </button>
  ))}
</div>

              <input
                type="text"
                placeholder="ADICIONAR FRETE"
                className="border p-2 rounded italic placeholder:text-sm"
                value={freteTexto}
                onChange={(e) => setFreteTexto(e.target.value)}
                style={{
                  backgroundColor: temaAtual.card,
                  color: temaAtual.texto,
                  borderColor: temaAtual.destaque
                }}
              />
            </div>

            {/* RESUMO DE TOTAIS */}
            {(() => {
              const subtotal = carrinho.reduce((acc, cur) => acc + cur.subtotal, 0);
              const valorDesconto = subtotal * (desconto / 100);
              const valorFrete = parseFloat(freteTexto.replace(',', '.')) || 0;
              const acrescimo = formaPagamento === 'Cartão de Crédito'
                ? (subtotal * tabelaJuros[parcelas]) / 100
                : 0;
              const totalFinal = subtotal - valorDesconto + valorFrete + acrescimo;

              return (
                <div className="text-right font-bold mt-6" style={{ color: temaAtual.texto }}>
                  <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
                  <p>Desconto: -R$ {valorDesconto.toFixed(2)}</p>
                  <p>Frete: +R$ {valorFrete.toFixed(2)}</p>

                  {formaPagamento === 'Cartão de Crédito' && (
                    <>
                      <p>Acréscimo: +R$ {acrescimo.toFixed(2)}</p>
                      <p className="text-sm opacity-80">
                        Em {parcelas}x de R$ {(totalFinal / parcelas).toFixed(2)} com juros
                      </p>
                    </>
                  )}

                  <p className="text-xl mt-2" style={{ color: temaAtual.destaque }}>
                    Total Final: R$ {totalFinal.toFixed(2)}
                  </p>


<div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 text-left">
  <div>
    <label className="block mb-1 font-semibold">Forma de Pagamento:</label>
    <select
      value={formaPagamento}
      onChange={(e) => {
        setFormaPagamento(e.target.value);
        if (e.target.value !== 'Cartão de Crédito') setParcelas(1);
      }}
      className="w-full border p-2 rounded"
      style={{
        backgroundColor: temaAtual.card,
        color: temaAtual.texto,
        borderColor: temaAtual.destaque,
      }}
    >
      <option value="Pix">Pix</option>
      <option value="Dinheiro">Dinheiro</option>
      <option value="Cartão de Débito">Cartão de Débito</option>
      <option value="Cartão de Crédito">Cartão de Crédito</option>
    </select>
  </div>

  {formaPagamento === 'Cartão de Crédito' && (
    <div>
      <label className="block mb-1 font-semibold">Parcelamento:</label>
      <select
        value={parcelas}
        onChange={(e) => setParcelas(Number(e.target.value))}
        className="w-full border p-2 rounded"
        style={{
          backgroundColor: temaAtual.card,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
        }}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            {i + 1}x
          </option>
        ))}
      </select>
    </div>
  )}
</div>


                  {/* BOTÕES DE AÇÃO */}
                  <div className="text-right mt-6 space-x-4">
                                     <button
                    onClick={() => finalizarVenda()}
                      className="px-4 py-2 rounded transition-all duration-300"
                        style={{
                        backgroundColor: temaAtual.destaque,
                        color: temaAtual.textoBranco
                    }}
                  >
                      Finalizar Venda 
                    </button>

                    <button
                      onClick={() => setMostrarModalRecibo(true)}
                      className="px-4 py-2 rounded transition-all duration-300"
                      style={{
                        backgroundColor: temaAtual.destaque,
                        color: temaAtual.textoBranco
                      }}
                    >
                      Gerar PDF
                    </button>
                  </div>


                  {/* MODAL DE RECIBO */}
                  {mostrarModalRecibo && (
                    <ModalRecibo
                      vendaSelecionada={{
                        cliente,
                        itens: carrinho,
                        subtotal,
                        desconto_aplicado: valorDesconto,
                        total_final: totalFinal,
                        data: new Date().toISOString(), 
                        hora: new Date().toLocaleTimeString('pt-BR'),
                        forma_pagamento: formaPagamento,
                        destino_desconto: destinoDesconto,
                        frete: valorFrete,
                        numero: 0,
                        pago: false
                      }}
                      onConfirmar={() => {
                        setMostrarModalRecibo(false);
                        finalizarVenda();
                      }}
                      onCancelar={() => setMostrarModalRecibo(false)}
                    />
                  )}
                </div>
              );
            })()}
          </>
        )}
      </div>
    </div>
  );
};

export default NovaVendaPage;