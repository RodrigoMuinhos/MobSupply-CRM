'use client';
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Venda } from '../../../types/venda';

type Props = {
  mesFormatado: string;
  vendas: Venda[];
};

const ExportarMesActions: React.FC<Props> = ({ mesFormatado, vendas }) => {
  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Relatório de Vendas - ${mesFormatado}`, 14, 20);

    const linhas = vendas.map((v, i) => [
      i + 1,
      v.cliente?.nome || '',
      v.cliente?.cpf || '',
      v.total_final?.toFixed(2) || '',
      v.data ? new Date(v.data).toLocaleDateString('pt-BR') : '',
      v.pago ? 'Pago' : 'Pendente',
    ]);

    autoTable(doc, {
      head: [['#', 'Cliente', 'CPF', 'Total', 'Data', 'Status']],
      body: linhas,
      startY: 30,
    });

    doc.save(`Relatorio-${mesFormatado.replace(/\s/g, '-')}.pdf`);
  };

  const baixarJSON = () => {
    const blob = new Blob([JSON.stringify(vendas, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Vendas-${mesFormatado.replace(/\s/g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex gap-2 text-sm text-blue-700 font-medium">
      <button
        onClick={gerarPDF}
        className="hover:underline"
        title="Exportar PDF"
      >
        📄 
      </button>
      <button
        onClick={baixarJSON}
        className="hover:underline"
        title="Exportar JSON"
      >
        🧾 
      </button>
    </div>
  );
};

export default ExportarMesActions;