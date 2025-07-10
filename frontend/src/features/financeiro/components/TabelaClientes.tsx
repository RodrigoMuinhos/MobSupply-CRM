// src/features/financeiro/components/TabelaClientes.tsx
'use client';
import React from 'react';
import { Venda } from '../../../types/venda';
import TabelaMensal from './TabelaMensal';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  vendas: Venda[];
  onAtualizarVendas: (vendasAtualizadas: Venda[]) => void;
  onAbrirRecibo: (venda: Venda) => void;
  onAbrirSelecaoRecibo: (lista: Venda[]) => void;
};

const TabelaClientes: React.FC<Props> = ({
  vendas,
  onAtualizarVendas,
  onAbrirRecibo,
  onAbrirSelecaoRecibo,
}) => {
  const { temaAtual } = useTheme();

  // Agrupamento por mês/ano
  const agrupadasPorMes: Record<string, Venda[]> = {};
  vendas.forEach((venda) => {
    const data = new Date(venda.data);
    const chave = `${data.getFullYear()}-${String(data.getMonth() + 1).padStart(2, '0')}`;
    if (!agrupadasPorMes[chave]) agrupadasPorMes[chave] = [];
    agrupadasPorMes[chave].push(venda);
  });

  const mesesOrdenados = Object.keys(agrupadasPorMes).sort((a, b) => b.localeCompare(a));

  return (
    <div>
      {mesesOrdenados.map((chaveMes) => {
        const vendasDoMes = agrupadasPorMes[chaveMes];
        const totalMes = vendasDoMes.reduce((acc, v) => acc + v.total_final, 0);
        const nomeMes = new Date(`${chaveMes}-01`).toLocaleDateString('pt-BR', {
          month: 'long',
          year: 'numeric',
        });

        return (
          <div key={chaveMes} className="mb-12">
            <h2 className="text-xl font-semibold mb-2" style={{ color: temaAtual.destaque }}>
              {nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1)}
            </h2>

            <TabelaMensal
              vendas={vendasDoMes}
              onAtualizarVendas={onAtualizarVendas}
              onAbrirRecibo={onAbrirRecibo}
              onAbrirSelecaoRecibo={onAbrirSelecaoRecibo}
            />

            <div
              className="mt-2 text-right font-bold px-4 py-2 rounded"
              style={{
                backgroundColor: temaAtual.card,
                color: temaAtual.texto,
                border: `1px solid ${temaAtual.destaque}`,
              }}
            >
              Total do mês: R$ {totalMes.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TabelaClientes;