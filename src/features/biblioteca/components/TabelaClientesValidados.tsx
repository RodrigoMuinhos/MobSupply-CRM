import React, { useState } from 'react';
import { FaWhatsapp, FaTrash, FaSave, FaRandom, FaEraser } from 'react-icons/fa';
import { BsCircleFill } from 'react-icons/bs';
import ModalConfirmarEnvio from '../components/ModalConfirmarEnvio';
import { useTheme } from '../../../context/ThemeContext';

interface Cliente {
  cnpj: string | number;
  nomeFantasia?: string;
  nomeMatriz?: string;
  cidade?: string;
  uf?: string;
  contatos: string[];
}

interface Props {
  clientes: Cliente[];
  statusMap: Record<string, string>;
  busca: string;
  mensagensPorCor: Record<string, string>;
  onStatusClick: (cnpj: string | number, novaCor: string) => void;
  onStatusClickLote: (novoMapa: Record<string, string>) => void;
  onEditarContato: (cnpj: string | number, index: number, novo: string) => void;
  onRemoverContato: (cnpj: string | number, index: number) => void;
  onRemover: (cnpj: string | number) => void;
}

const cores = ['azul', 'verde', 'vermelho', 'amarelo', 'roxo'] as const;

const classesCor: Record<string, string> = {
  cinza: 'text-gray-400',
  azul: 'text-blue-500',
  verde: 'text-green-500',
  vermelho: 'text-red-500',
  amarelo: 'text-yellow-500',
  roxo: 'text-purple-500',
};

const formatarCNPJ = (cnpj: string | number): string =>
  String(cnpj).replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');

const formatarWhatsApp = (numero: string): string => {
  const n = numero.replace(/\D/g, '');
  return n.length === 11 ? n.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4') : numero;
};

const TabelaClientesValidados: React.FC<Props> = ({
  clientes,
  statusMap,
  busca,
  mensagensPorCor,
  onStatusClick,
  onStatusClickLote,
  onEditarContato,
  onRemoverContato,
  onRemover,
}) => {
  const { temaAtual } = useTheme();

  const [editando, setEditando] = useState<{ cnpj: string | number; index: number } | null>(null);
  const [novoNumero, setNovoNumero] = useState('');
  const [modalInfo, setModalInfo] = useState<{
    numero: string;
    nome?: string;
    mensagem: string;
    corStatus?: string;
  } | null>(null);

  const handleSalvar = () => {
    if (editando) {
      onEditarContato(editando.cnpj, editando.index, novoNumero);
      setEditando(null);
      setNovoNumero('');
    }
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSalvar();
  };

  const proximaCor = (corAtual: string): string => {
    const all = ['cinza', ...cores];
    const idx = all.indexOf(corAtual);
    return all[(idx + 1) % all.length];
  };

  const filtrados = clientes.filter((cliente) => {
    const termo = busca.toLowerCase();
    const nome = (cliente.nomeFantasia || cliente.nomeMatriz || '').toLowerCase();
    const cnpj = String(cliente.cnpj).replace(/\D/g, '');
    return nome.includes(termo) || cnpj.includes(termo);
  });

  const gerarStatus = () => {
    const total = filtrados.length;
    const base = Math.floor(total / cores.length);
    const sobra = total % cores.length;

    let distribuicao: string[] = [];
    cores.forEach((cor, i) => {
      const quantidade = base + (i < sobra ? 1 : 0);
      distribuicao.push(...Array(quantidade).fill(cor));
    });

    distribuicao = distribuicao.sort(() => Math.random() - 0.5);

    const novoMapa: Record<string, string> = { ...statusMap };
    filtrados.forEach((cliente, i) => {
      novoMapa[String(cliente.cnpj)] = distribuicao[i];
    });

    onStatusClickLote(novoMapa);
  };

  const desmarcarTodos = () => {
    const novoMapa: Record<string, string> = { ...statusMap };
    filtrados.forEach((cliente) => {
      novoMapa[String(cliente.cnpj)] = 'cinza';
    });
    onStatusClickLote(novoMapa);
  };

  return (
    <>
      {/* Ícones flutuantes com tema */}
      <div className="flex gap-3 mb-4 items-center">
        <button
          onClick={gerarStatus}
          title="Distribuir status aleatórios"
          className="p-2 rounded-full shadow-md transition"
          style={{
            background: temaAtual.destaque,
            color: temaAtual.textoClaro,
          }}
        >
          <FaRandom size={16} />
        </button>

        <button
          onClick={desmarcarTodos}
          title="Desmarcar todos os status"
          className="p-2 rounded-full shadow-md transition"
          style={{
            background: temaAtual.card,
            color: temaAtual.texto,
            border: `1px solid ${temaAtual.destaque}`,
          }}
        >
          <FaEraser size={16} />
        </button>
      </div>

      <table className="w-full text-xs border-collapse rounded overflow-hidden">
        <thead className="bg-green-700 text-white text-left">
          <tr>
            <th className="p-2">#</th>
            <th className="p-2">Status</th>
            <th className="p-2">CNPJ</th>
            <th className="p-2">Nome</th>
            <th className="p-2">Cidade</th>
            <th className="p-2">UF</th>
            <th className="p-2">Contatos</th>
            <th className="p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filtrados.map((cliente, i) => {
            const cor = statusMap[String(cliente.cnpj)] || 'cinza';

            return (
              <tr key={i} className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                <td className="p-2 font-mono text-gray-500">{i + 1}</td>
                <td className="p-1">
                  <button onClick={() => onStatusClick(cliente.cnpj, proximaCor(cor))}>
                    <BsCircleFill className={classesCor[cor]} />
                  </button>
                </td>
                <td className="p-1">{formatarCNPJ(cliente.cnpj)}</td>
                <td className="p-1">{cliente.nomeFantasia || cliente.nomeMatriz || '---'}</td>
                <td className="p-1">{cliente.cidade || '---'}</td>
                <td className="p-1">{cliente.uf || '---'}</td>
                <td className="p-1 whitespace-nowrap text-xs">
                  {cliente.contatos.map((tel, idx) => {
                    const estaEditando = editando?.cnpj === cliente.cnpj && editando.index === idx;

                    return (
                      <div key={idx} className="flex items-center gap-x-1 mb-1">
                        {estaEditando ? (
                          <>
                            <input
                              value={novoNumero}
                              onChange={(e) => setNovoNumero(e.target.value)}
                              onKeyDown={handleEnter}
                              className="border px-1 py-0.5 rounded w-32 text-xs"
                              placeholder="Novo número"
                            />
                            <button onClick={handleSalvar} className="text-blue-600" title="Salvar">
                              <FaSave size={12} />
                            </button>
                          </>
                        ) : (
                          <>
                            <span
                              onClick={() => {
                                setEditando({ cnpj: cliente.cnpj, index: idx });
                                setNovoNumero(tel);
                              }}
                              className="cursor-pointer underline text-gray-600 hover:text-blue-600"
                            >
                              {formatarWhatsApp(tel)}
                            </span>
                            <button
                              className="text-green-600"
                              onClick={() =>
                                setModalInfo({
                                  numero: tel,
                                  nome: cliente.nomeFantasia || cliente.nomeMatriz || '---',
                                  mensagem: mensagensPorCor?.[cor] ?? '',
                                  corStatus: cor,
                                })
                              }
                            >
                              <FaWhatsapp size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    );
                  })}
                </td>
                <td className="p-1">
                  <button
                    onClick={() => onRemover(cliente.cnpj)}
                    className="text-red-600"
                    title="Remover cliente"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {modalInfo && (
        <ModalConfirmarEnvio
          numero={modalInfo.numero}
          nome={modalInfo.nome}
          mensagem={modalInfo.mensagem}
          corStatus={modalInfo.corStatus}
          onFechar={() => setModalInfo(null)}
        />
      )}
    </>
  );
};

export default TabelaClientesValidados;