// src/features/financeiro/components/DebugVendasLocalStorage.tsx
'use client';
import React, { useState } from 'react';
import { Venda } from '../../../types/venda';

const DebugVendasLocalStorage: React.FC = () => {
  const [vendas, setVendas] = useState<Venda[]>([]);

  const recuperar = () => {
    const data = localStorage.getItem('vendasMOB');
    if (!data) return alert('Nenhuma venda encontrada no localStorage');

    try {
      const parsed: Venda[] = JSON.parse(data);
      setVendas(parsed);
    } catch (err) {
      alert('Erro ao interpretar dados');
    }
  };

  return (
    <div className="p-4 border rounded mt-4 bg-yellow-50 text-sm max-h-[400px] overflow-y-auto">
      <button
        onClick={recuperar}
        className="mb-2 px-3 py-1 bg-green-700 text-white rounded hover:bg-green-800"
      >
        Ver tudo no localStorage
      </button>
      {vendas.length > 0 && (
        <ul className="space-y-1">
          {vendas.map((venda, i) => (
            <li key={i}>
              #{i + 1} — {venda.cliente?.nome} | {venda.total_final.toFixed(2)} |{' '}
              {venda.data ?? 'Sem data'}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebugVendasLocalStorage;