import React, { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import { Venda } from '../types/venda';

type ModalReciboProps = {
  vendaSelecionada: Venda;
  onConfirmar: () => void;
  onCancelar: () => void;
};

const ModalRecibo: React.FC<ModalReciboProps> = ({
  vendaSelecionada,
  onConfirmar,
  onCancelar
}) => {
  const {
    cliente,
    itens,
    subtotal,
    desconto_aplicado,
    total_final,
    data,
    hora,
    forma_pagamento,
    destino_desconto,
    frete
  } = vendaSelecionada;

  const reciboRef = useRef<HTMLDivElement>(null);

 const dataFormatada = !isNaN(Date.parse(data))
  ? new Date(data).toLocaleDateString('pt-BR')
  : 'Data inválida';

const gerarPDF = () => {
  if (reciboRef.current) {
    html2pdf().from(reciboRef.current).set({
      margin: 0.5,
      filename: `Recibo_${cliente.nome}_${dataFormatada}.pdf`,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
    }).save();
  }
};

  const mensagemWhatsApp = encodeURIComponent(`
Olá ${cliente.nome},

Segue o resumo da sua compra realizada em ${dataFormatada}:

Total: R$ ${total_final.toFixed(2)}
Pagamento: ${forma_pagamento}
Itens: ${itens.length}

Obrigado pela preferência!
  `);

  

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 relative">
      <div ref={reciboRef} className="p-6 text-sm text-black font-sans">
  {/* Cabeçalho com logo */}
  <div className="flex items-center justify-between mb-4 border-b pb-2">
    <img src="/logo.png" alt="Logo" className="h-12" />
    <h2 className="text-xl font-bold text-green-800 text-right">Recibo de Venda</h2>
  </div>

  {/* Dados do cliente */}
  <div className="grid grid-cols-2 gap-2 mb-4">
    <p><strong>Cliente:</strong> {cliente.nome}</p>
    <p><strong>CPF:</strong> {cliente.cpf}</p>
    <p><strong>Data:</strong> {dataFormatada}</p>
    <p><strong>Hora:</strong> {hora}</p>
    <p><strong>Pagamento:</strong> {forma_pagamento}</p>
    {destino_desconto && (
      <p><strong>Desconto para:</strong> {destino_desconto}</p>
    )}
  </div>

  {/* Tabela de itens */}
  <table className="w-full text-xs border-t border-b mb-4">
    <thead>
      <tr className="bg-gray-100 border-b">
        <th className="py-2 text-left">Produto</th>
        <th className="py-2 text-center">Qtd</th>
        <th className="py-2 text-center">R$ Unit</th>
        <th className="py-2 text-center">Subtotal</th>
      </tr>
    </thead>
    <tbody>
      {itens.map((item, i) => (
        <tr key={i} className="border-b">
          <td className="py-1">{item.marca} / {item.nome}</td>
          <td className="text-center py-1">{item.quantidade}</td>
          <td className="text-center py-1">R$ {item.precoUnitario.toFixed(2)}</td>
          <td className="text-center py-1">
            R$ {(item.quantidade * item.precoUnitario).toFixed(2)}
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Totais finais */}
  <div className="text-sm text-right space-y-1 pr-1">
    <p><strong>Subtotal:</strong> R$ {subtotal.toFixed(2)}</p>
    <p><strong>Desconto:</strong> - R$ {desconto_aplicado.toFixed(2)}</p>
    <p><strong>Frete:</strong> + R$ {frete.toFixed(2)}</p>
    <p className="font-bold text-lg text-green-700 border-t pt-2">Total: R$ {total_final.toFixed(2)}</p>
  </div>
</div>

        {/* Botões de ação */}
        <div className="flex flex-wrap justify-end gap-3 mt-6">
          
          <button
            onClick={gerarPDF}
            className="px-4 py-2 rounded bg-blue-700 text-white hover:bg-blue-800"
          >
            Gerar PDF
          </button>
          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalRecibo;