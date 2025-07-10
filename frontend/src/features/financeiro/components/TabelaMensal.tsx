'use client';
import React, { useState } from 'react';
import { FaCircle, FaPaperclip, FaTrash } from 'react-icons/fa';
import { BiTimeFive } from 'react-icons/bi';
import { Venda } from '../../../types/venda';
import { useTheme } from '../../../context/ThemeContext';
import ModalEditarDataVenda from './ModalEditarDataVenda';
import ExportarMesActions from './ExportarMesActions';

type Props = {
  vendas: Venda[];
  mesReferencia: string;
  onAtualizarVendas: (vendasAtualizadas: Venda[]) => void;
  onAbrirRecibo: (venda: Venda) => void;
  onAbrirSelecaoRecibo: (lista: Venda[]) => void;
};

const TabelaMensal: React.FC<Props> = ({
  vendas,
  mesReferencia,
  onAtualizarVendas,
  onAbrirRecibo,
  onAbrirSelecaoRecibo,
}) => {
  const { temaAtual } = useTheme();
  const [clienteExpandido, setClienteExpandido] = useState<number | null>(null);
  const [vendaParaEditar, setVendaParaEditar] = useState<Venda | null>(null);

  const nomeMes = (chave: string) => {
    const [ano, mes] = chave.split('-');
    const nomes = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    return `${nomes[parseInt(mes) - 1]} de ${ano}`;
  };

  const formatarCPF = (cpf: string) =>
    cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');

  // 🚮 Filtrar vendas removidas (Lixeira)
  const lixeiraVendas: Venda[] = JSON.parse(localStorage.getItem('LixeiraVendas') || '[]');
  const vendasFiltradas = vendas.filter(
    (v) => !lixeiraVendas.some((l) => l.numero === v.numero)
  );

  const agrupadoPorCPF = vendasFiltradas.reduce<Record<string, Venda[]>>((acc, venda) => {
    const cpf = venda.cliente?.cpf?.replace(/\D/g, '');
    if (!cpf) return acc;
    if (!acc[cpf]) acc[cpf] = [];
    acc[cpf].push(venda);
    return acc;
  }, {});

  const totalMes = vendasFiltradas.filter((v) => v.pago).reduce((acc, v) => acc + (v.total_final || 0), 0);

  return (
    <div className="overflow-x-auto space-y-6 mb-12">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold" style={{ color: temaAtual.destaque }}>
          {nomeMes(mesReferencia)}
        </h2>
        <ExportarMesActions mesFormatado={nomeMes(mesReferencia)} vendas={vendasFiltradas} />
      </div>

      <table
        className="min-w-full text-sm border rounded shadow"
        style={{
          backgroundColor: temaAtual.fundo,
          color: temaAtual.texto,
          borderColor: temaAtual.destaque,
        }}
      >
        <thead
          className="sticky top-0 z-10"
          style={{
            backgroundColor: temaAtual.destaque,
            color: temaAtual.textoBranco,
          }}
        >
          <tr>
            <th className="p-2 text-center">#</th>
            <th className="p-2 text-left">Cliente</th>
            <th className="p-2 text-left">CPF</th>
            <th className="p-2 text-center">Itens</th>
            <th className="p-2 text-center">Total</th>
            <th className="p-2 text-center">Data</th>
            <th className="p-2 text-center">Pago</th>
            <th className="p-2 text-center">Recibo</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(agrupadoPorCPF).map(([cpf, lista], index) => {
            const cliente = lista[0].cliente;
            const total = lista.reduce((acc, v) => acc + v.total_final, 0);
            const itens = lista.reduce((acc, v) => acc + v.itens.length, 0);
            const ultimaData = new Date(lista[lista.length - 1].data);
            const dataFormatada = isNaN(ultimaData.getTime())
              ? 'Data inválida'
              : ultimaData.toLocaleDateString('pt-BR');

            return (
              <React.Fragment key={cpf}>
                <tr
                  className="cursor-pointer border-b"
                  style={{ borderColor: temaAtual.destaque }}
                  onClick={() =>
                    setClienteExpandido(clienteExpandido === index ? null : index)
                  }
                >
                  <td className="p-2 text-center">{index + 1}</td>
                  <td className="p-2 text-left text-green-700 underline">{cliente.nome}</td>
                  <td className="p-2 text-left">{formatarCPF(cliente.cpf)}</td>
                  <td className="p-2 text-center">{itens}</td>
                  <td className="p-2 text-center">R$ {total.toFixed(2)}</td>
                  <td className="p-2 text-center">{dataFormatada}</td>
                  <td className="p-2 text-center">
                    <FaCircle
                      className={`cursor-pointer transition-transform ${
                        lista.every((v) => v.pago)
                          ? 'text-green-600'
                          : lista.every((v) => !v.pago)
                          ? 'text-red-600'
                          : 'text-yellow-500'
                      } hover:scale-125`}
                      onClick={(e) => {
                        e.stopPropagation();
                        const atualizadas = vendas.map((v) =>
                          v.cliente.cpf === cliente.cpf ? { ...v, pago: !v.pago } : v
                        );
                        onAtualizarVendas(atualizadas);
                      }}
                    />
                  </td>
                  <td className="p-2 text-center">
                    <FaPaperclip
                      className="text-gray-600 hover:text-green-600 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        lista.length === 1
                          ? onAbrirRecibo(lista[0])
                          : onAbrirSelecaoRecibo(lista);
                      }}
                    />
                  </td>
                </tr>

                {clienteExpandido === index && (
                  <tr>
                    <td colSpan={8} className="p-4" style={{ backgroundColor: temaAtual.fundoAlt }}>
                      <h4 className="text-sm font-semibold mb-2">Histórico de Compras</h4>
                      {lista.map((venda, i) => (
                        <div
                          key={i}
                          className="mb-4 border p-2 rounded transition-shadow hover:shadow-md"
                          style={{
                            borderColor: temaAtual.destaque,
                            backgroundColor: temaAtual.card,
                          }}
                        >
                          <div className="flex justify-between items-center text-xs mb-2">
                            <span>
                              Compra em: {new Date(venda.data).toLocaleString('pt-BR')} — Total: R$ {venda.total_final.toFixed(2)}
                            </span>
                            <div className="flex items-center gap-3">
                              <BiTimeFive
                                className="text-blue-600 hover:text-blue-800 cursor-pointer"
                                onClick={() => setVendaParaEditar(venda)}
                              />
                              <FaCircle
                                className={`cursor-pointer transition-transform ${
                                  venda.pago ? 'text-green-600' : 'text-red-600'
                                } hover:scale-125`}
                                onClick={() => {
                                  const novas = vendas.map((v) =>
                                    v.numero === venda.numero ? { ...v, pago: !v.pago } : v
                                  );
                                  onAtualizarVendas(novas);
                                }}
                              />
                              <FaTrash
                                className="text-red-500 hover:text-red-700 cursor-pointer transition-transform hover:scale-110"
                                onClick={() => {
                                  if (confirm('Deseja enviar esta venda para a lixeira?')) {
                                    const atualizadas = vendas.filter(
                                      (v) => v.numero !== venda.numero
                                    );
                                    const lixeiraAtual = JSON.parse(
                                      localStorage.getItem('LixeiraVendas') || '[]'
                                    );
                                    const novaLixeira = [...lixeiraAtual, venda];

                                    localStorage.setItem('vendasMOB', JSON.stringify(atualizadas));
                                    localStorage.setItem('LixeiraVendas', JSON.stringify(novaLixeira));

                                    onAtualizarVendas(atualizadas);
                                  }
                                }}
                              />
                            </div>
                          </div>

                          <table className="w-full text-xs mt-2 mb-2 border border-gray-300">
                            <thead style={{ backgroundColor: temaAtual.fundoAlt }}>
                              <tr>
                                <th className="p-1 border">Produto</th>
                                <th className="p-1 border">Marca</th>
                                <th className="p-1 border">Tipo</th>
                                <th className="p-1 border">Qtd</th>
                                <th className="p-1 border">Unitário</th>
                                <th className="p-1 border">Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {venda.itens.map((item, idx) => (
                                <tr key={idx} className="text-center">
                                  <td className="p-1 border">{item.nome}</td>
                                  <td className="p-1 border">{item.marca}</td>
                                  <td className="p-1 border">{item.tipo}</td>
                                  <td className="p-1 border">{item.quantidade}</td>
                                  <td className="p-1 border">R$ {item.precoUnitario.toFixed(2)}</td>
                                  <td className="p-1 border font-semibold">R$ {item.subtotal.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <p className="text-xs mt-1">
                            Pagamento: <strong>{venda.forma_pagamento}</strong> — Frete: R$ {venda.frete.toFixed(2)} — Desconto: R$ {venda.desconto_aplicado.toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>

      <div className="text-right text-sm mt-2 font-bold" style={{ color: temaAtual.texto }}>
        Total do mês: R$ {totalMes.toFixed(2).replace('.', ',')}
      </div>

      {vendaParaEditar && (
        <ModalEditarDataVenda
          venda={vendaParaEditar}
          onClose={() => setVendaParaEditar(null)}
          onSalvar={(novaData) => {
            const atualizadas = vendas.map((v) =>
              v.numero === vendaParaEditar.numero ? { ...v, data: novaData } : v
            );
            onAtualizarVendas(atualizadas);
            localStorage.setItem('vendasMOB', JSON.stringify(atualizadas));
          }}
        />
      )}
    </div>
  );
};

export default TabelaMensal;