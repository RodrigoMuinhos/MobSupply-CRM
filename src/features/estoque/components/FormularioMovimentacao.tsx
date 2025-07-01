import React, { useState } from 'react';
import { ItemEstoque } from '../../../types/estoque';

interface Props {
  itens: ItemEstoque[];
  tipo: 'entrada' | 'saida';
  onMovimentar: (codigo: string, quantidade: number) => void;
}

const FormularioMovimentacao: React.FC<Props> = ({ itens, tipo, onMovimentar }) => {
  const [codigoSelecionado, setCodigoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigoSelecionado || quantidade <= 0) return;
    onMovimentar(codigoSelecionado, quantidade);
    setQuantidade(0);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border rounded p-4 max-w-lg space-y-4">
      <h2 className="text-lg font-bold text-green-700">
        {tipo === 'entrada' ? 'Registrar Entrada' : 'Registrar Saída'}
      </h2>

      <select
        value={codigoSelecionado}
        onChange={(e) => setCodigoSelecionado(e.target.value)}
        className="border rounded px-3 py-2 w-full"
      >
        <option value="">Selecione um item</option>
        {itens.map((item) => (
          <option key={item.codigo} value={item.codigo}>
            {item.nome} — {item.quantidade_em_estoque} unidades
          </option>
        ))}
      </select>

      <input
        type="number"
        value={quantidade}
        onChange={(e) => setQuantidade(Number(e.target.value))}
        placeholder="Quantidade"
        className="border rounded px-3 py-2 w-full"
      />

      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
      >
        Confirmar
      </button>
    </form>
  );
};

export default FormularioMovimentacao;