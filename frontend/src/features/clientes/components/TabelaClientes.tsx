// components/clientes/TabelaClientes.tsx
import React from 'react';
import {
  FaTrash, FaSyncAlt, FaCheck, FaGift, FaFilePdf
} from 'react-icons/fa';
import { useIdioma } from '../../../context/IdiomaContext';
import { Cliente } from '../../../types/banco';

interface Props {
  clientes: Cliente[];
  clientesFiltrados: Cliente[];
  clienteEditando: Cliente | null;
  clienteExpandidoIndex: number | null;
  setClienteEditando: (cliente: Cliente | null) => void;
  setClienteExpandidoIndex: (index: number | null) => void;
  salvarClientes: (clientes: Cliente[]) => void;
  sincronizarCliente: (index: number) => void;
  exportarClienteParaPDF: (cliente: Cliente) => void;
  busca: string;
  setBusca: (valor: string) => void;
  cpfsDuplicados: Set<string>;
  temaAtual: any;
}

const TabelaClientes: React.FC<Props> = ({
  clientes,
  clientesFiltrados,
  clienteEditando,
  clienteExpandidoIndex,
  setClienteEditando,
  setClienteExpandidoIndex,
  salvarClientes,
  sincronizarCliente,
  exportarClienteParaPDF,
  busca,
  setBusca,
  cpfsDuplicados,
  temaAtual
}) => {
  const { idioma } = useIdioma();

  const isAniversarioHoje = (nasc?: string) => {
    if (!nasc) return false;
    const hoje = new Date();
    const data = new Date(nasc);
    return data.getDate() === hoje.getDate() && data.getMonth() === hoje.getMonth();
  };

  const formatarCPF = (cpf?: string) =>
    cpf ? cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4') : '';

  const formatarWhatsApp = (numero?: string) => {
    if (!numero) return '';
    const somenteNumeros = numero.replace(/\D/g, '');
    return somenteNumeros.replace(/^(\d{2})(\d{1})(\d{4})(\d{4})$/, '($1) $2 $3-$4');
  };

  const camposEditaveis: (keyof Cliente)[] = ['nome', 'cpf', 'whatsapp', 'nascimento', 'email', 'endereco', 'cep'];

  return (
    <>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder={idioma.ficha?.buscarPlaceholder ?? "Buscar por nome ou CPF"}
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="border p-2 rounded-l w-full"
          style={{
            backgroundColor: temaAtual.fundoAlt,
            color: temaAtual.texto,
            borderColor: temaAtual.card
          }}
        />
        <button
          className="px-4 rounded-r"
          style={{
            backgroundColor: temaAtual.destaque,
            color: temaAtual.card
          }}
        >
          {idioma.ficha?.botaoBuscar ?? 'Buscar'}
        </button>
      </div>

      <table className="w-full text-left border-collapse">
        <thead style={{ backgroundColor: temaAtual.card, color: temaAtual.destaque }}>
          <tr className="text-sm uppercase tracking-wide border-b" style={{ borderColor: temaAtual.destaque }}>
            <th className="p-2">{idioma.ficha?.nome ?? 'Nome'}</th>
            <th>{idioma.ficha?.cpf ?? 'CPF'}</th>
            <th>{idioma.ficha?.whatsapp ?? 'WhatsApp'}</th>
            <th>{idioma.ficha?.nascimento ?? 'Nascimento'}</th>
            <th>{idioma.ficha?.sincronizado ?? 'Status'}</th>
            <th>{idioma.ficha?.acoes ?? 'Ações'}</th>
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
                    <FaGift className="inline ml-1 text-pink-500" title={idioma.ficha?.aniversarioHoje ?? "Aniversário hoje!"} />
                  )}
                </td>

                <td>
                  {formatarCPF(cliente.cpf)}
                  {cliente.cpf && cpfsDuplicados.has(cliente.cpf) && (
                    <span className="text-red-500 ml-1" title={idioma.ficha?.cpfDuplicado ?? "CPF duplicado"}>⚠️</span>
                  )}
                </td>
                <td>{formatarWhatsApp(cliente.whatsapp)}</td>
                <td>{cliente.nascimento ? new Date(cliente.nascimento).toLocaleDateString() : ''}</td>
                <td className="text-center">
                  {cliente.sincronizado ? (
                    <FaCheck className="text-green-400 inline" />
                  ) : (
                    <button onClick={() => sincronizarCliente(index)} title={idioma.ficha?.botaoSincronizar ?? "Sincronizar"}>
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
                      {camposEditaveis.map((campo) => (
                        <input
                          key={campo}
                          className="p-2 border rounded"
                          placeholder={(idioma.ficha as Record<string, string>)[campo as string] ?? String(campo)}
                          style={{
                            backgroundColor: temaAtual.card,
                            color: temaAtual.texto,
                            borderColor: temaAtual.destaque,
                          }}
                          type={campo === 'nascimento' ? 'date' : 'text'}
                          value={clienteEditando[campo] ?? ''}
                          onChange={(e) =>
                            setClienteEditando({
                              ...clienteEditando,
                              [campo]: e.target.value,
                            })
                          }
                        />
                      ))}

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
                            {idioma.ficha?.botaoSalvar ?? 'Salvar'}
                          </button>
                          <button
                            className="bg-gray-600 text-white px-4 py-2 rounded"
                            onClick={() => {
                              setClienteEditando(null);
                              setClienteExpandidoIndex(null);
                            }}
                          >
                            {idioma.ficha?.botaoCancelar ?? 'Cancelar'}
                          </button>
                        </div>
                        <button
                          className="text-red-400 hover:underline text-sm flex items-center gap-1"
                          onClick={() => exportarClienteParaPDF(clienteEditando)}
                        >
                          <FaFilePdf /> {idioma.ficha?.gerarPdf ?? 'Gerar PDF'}
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
    </>
  );
};

export default TabelaClientes;
