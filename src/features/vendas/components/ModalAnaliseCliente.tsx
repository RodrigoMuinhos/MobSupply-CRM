import React, { useState } from 'react';
import {
  FaTimes,
  FaWhatsapp,
  FaSave,
  FaEdit
} from 'react-icons/fa';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Cliente, Venda } from '../../../types/cliente';

interface Props {
  cliente: Cliente;
  vendasDoCliente: Venda[];
  onFechar: () => void;
  onAtualizarNome: (novoNome: string) => void;
}

const limparCPF = (cpf: string) => cpf.replace(/\D/g, '');

const normalizarData = (data: string) => {
  const d = new Date(data);
  d.setHours(0, 0, 0, 0);
  return d;
};

const COLORS = [
  '#6366F1', '#10B981', '#F59E0B', '#EF4444',
  '#3B82F6', '#8B5CF6', '#EC4899', '#14B8A6',
  '#F97316', '#6B7280'
];

const formatarCPF = (cpf: string) =>
  cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

const formatarWhatsApp = (numero: string) => {
  const n = numero.replace(/\D/g, '');
  return n.length === 11
    ? n.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4')
    : numero;
};

const formatarData = (data: string) => {
  const d = new Date(data);
  return d.toLocaleDateString('pt-BR');
};

const agruparProdutos = (vendas: Venda[]) => {
  const mapa = new Map<string, number>();
  vendas.forEach(venda => {
    venda.itens.forEach(item => {
      const nome = item.nome || item.codigo || 'Produto';
      mapa.set(nome, (mapa.get(nome) || 0) + item.quantidade);
    });
  });
  return Array.from(mapa.entries())
    .map(([nome, quantidade]) => ({ nome, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade);
};

const calcularRecomendacao = (vendas: Venda[]) => {
  const ordenadas = vendas
    .map(v => new Date(v.data))
    .sort((a, b) => a.getTime() - b.getTime());

  if (ordenadas.length < 2) return { intervalo: 0, atraso: 0 };

  let somaIntervalos = 0;
  for (let i = 1; i < ordenadas.length; i++) {
    const diff = (ordenadas[i].getTime() - ordenadas[i - 1].getTime()) / (1000 * 60 * 60 * 24);
    somaIntervalos += diff;
  }

  const ultimaCompra = ordenadas[ordenadas.length - 1];
  const hoje = new Date();
  const atraso = Math.floor((hoje.getTime() - ultimaCompra.getTime()) / (1000 * 60 * 60 * 24));

  return {
    intervalo: Math.round(somaIntervalos / (ordenadas.length - 1)),
    atraso,
  };
};

const gerarMensagem = (nome: string, atraso: number, produto: string) => `
Olá, ${nome}! Tudo bem?

Já faz ${atraso} dias desde sua última compra. Notei que você costuma comprar ${produto}. Está precisando repor o estoque?

Temos novidades e promoções ativas nesta semana. Quer dar uma olhadinha?

Se precisar de algo, é só chamar 😊
www.instagram.com/mob.supplybr
`;

const ModalAnaliseCliente: React.FC<Props> = ({
  cliente,
  vendasDoCliente,
  onFechar,
  onAtualizarNome
}) => {
  const [nomeEditado, setNomeEditado] = useState(cliente.nome);
  const [editando, setEditando] = useState(false);
  const [msgSucesso, setMsgSucesso] = useState('');

  const dadosGrafico = agruparProdutos(vendasDoCliente);
  const { intervalo } = calcularRecomendacao(vendasDoCliente);
  const produtoFrequente = dadosGrafico[0]?.nome || 'seus produtos favoritos';

  const ultimaCompraData = vendasDoCliente
    .map(v => normalizarData(v.data))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  const ultimaCompra = ultimaCompraData
    ? ultimaCompraData.toLocaleDateString('pt-BR')
    : '—';

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  const diasSemComprar = ultimaCompraData
    ? Math.floor((hoje.getTime() - ultimaCompraData.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const mensagem = gerarMensagem(nomeEditado, diasSemComprar, produtoFrequente);

  const salvarNome = () => {
    const vendas = JSON.parse(localStorage.getItem('vendasMOB') || '[]');
    const atualizadas = vendas.map((v: Venda) =>
      v.cliente.cpf === cliente.cpf
        ? { ...v, cliente: { ...v.cliente, nome: nomeEditado } }
        : v
    );
    localStorage.setItem('vendasMOB', JSON.stringify(atualizadas));
    onAtualizarNome(nomeEditado);
    setEditando(false);
    setMsgSucesso('✅ Nome alterado com sucesso!');
    setTimeout(() => setMsgSucesso(''), 3000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onFechar}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-600"
        >
          <FaTimes />
        </button>

        <h2 className="text-2xl font-bold mb-4">Análise Inteligente do Cliente</h2>

        {msgSucesso && (
          <div className="text-green-600 text-sm mb-2">{msgSucesso}</div>
        )}

        {/* Bloco A - Dados básicos */}
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2 items-center">
            {editando ? (
              <>
                <input
                  value={nomeEditado}
                  onChange={(e) => setNomeEditado(e.target.value)}
                  className="border px-2 py-1 rounded w-full"
                />
                <button onClick={salvarNome} className="text-green-600 hover:text-green-800">
                  <FaSave />
                </button>
              </>
            ) : (
              <div className="flex gap-2 items-center">
                <span className="font-semibold">{nomeEditado}</span>
                <button onClick={() => setEditando(true)} className="text-gray-500 hover:text-blue-500">
                  <FaEdit />
                </button>
              </div>
            )}
          </div>
          <div><strong>CPF:</strong> {formatarCPF(cliente.cpf)}</div>
          <div><strong>WhatsApp:</strong> {formatarWhatsApp(cliente.whatsapp)}</div>
          <div><strong>Última compra:</strong> {ultimaCompra}</div>
          <div><strong>Sem comprar há:</strong> {diasSemComprar} dias</div>
          <div><strong>Intervalo médio:</strong> {intervalo} dias</div>
          {cliente.nascimento && (
            <div><strong>Aniversário:</strong> {formatarData(cliente.nascimento)}</div>
          )}
        </div>

        {/* Bloco B - Gráfico */}
        <h3 className="text-lg font-semibold mb-2 mt-4">Produtos Mais Comprados</h3>
        {dadosGrafico.length > 0 ? (
          <div className="w-full h-80 flex">
            <ResponsiveContainer width="60%" height="100%">
              <PieChart>
                <Pie
                  data={dadosGrafico}
                  dataKey="quantidade"
                  nameKey="nome"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {dadosGrafico.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-2/5 pl-4">
              <h4 className="font-semibold mb-2">Legenda:</h4>
              <ul className="text-sm space-y-1">
                {dadosGrafico.map((item, index) => (
                  <li key={item.nome} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full inline-block"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    {item.nome} ({item.quantidade})
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-gray-500 italic mt-2">Nenhum produto registrado para este cliente ainda.</div>
        )}

        {/* Bloco C - Mensagem inteligente */}
        <h3 className="text-lg font-semibold mt-6 mb-2">Recomendação Inteligente</h3>
        <div className="bg-gray-100 rounded p-4 mb-4 whitespace-pre-wrap text-sm">
          {dadosGrafico.length > 0 ? (
            mensagem
          ) : (
            `Olá, ${cliente.nome}! Tudo bem?\n\nAinda não registramos nenhuma compra sua no sistema. Assim que realizar sua primeira compra, te enviaremos recomendações personalizadas.`
          )}
        </div>

        {/* Botão de envio via WhatsApp */}
        {dadosGrafico.length > 0 && (
          <a
            href={`https://wa.me/55${cliente.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
          >
            <FaWhatsapp /> Enviar pelo WhatsApp
          </a>
        )}
      </div>
    </div>
  );
};

export default ModalAnaliseCliente;