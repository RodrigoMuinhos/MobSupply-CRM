import React from 'react';

type Props = {
  totalClientes: number;
  onDistribuir: (mapaDistribuido: Record<string, string>) => void;
  clientes: { cnpj: string | number }[];
};

const coresDisponiveis = ['azul', 'verde', 'vermelho', 'amarelo', 'roxo'];

const DistribuidorStatus: React.FC<Props> = ({ totalClientes, onDistribuir, clientes }) => {
  const gerarStatus = () => {
    if (totalClientes === 0) return;

    const porCor = Math.floor(totalClientes / coresDisponiveis.length);
    const sobra = totalClientes % coresDisponiveis.length;

    const distribuicao: string[] = [];

    coresDisponiveis.forEach(cor => {
      for (let i = 0; i < porCor; i++) {
        distribuicao.push(cor);
      }
    });

    for (let i = 0; i < sobra; i++) {
      distribuicao.push(coresDisponiveis[i]);
    }

    const embaralhado = distribuicao.sort(() => Math.random() - 0.5);

    const novoMapa: Record<string, string> = {};
    clientes.forEach((cliente, i) => {
      const cnpjKey = String(cliente.cnpj);
      novoMapa[cnpjKey] = embaralhado[i];
    });

    onDistribuir(novoMapa);
  };

  const desmarcarTodos = () => {
    const novoMapa: Record<string, string> = {};
    clientes.forEach((cliente) => {
      novoMapa[String(cliente.cnpj)] = 'cinza';
    });
    onDistribuir(novoMapa);
  };

  return (
    <div className="flex gap-3 mt-4">
      <button
        onClick={gerarStatus}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 shadow"
      >
        Gerar Status
      </button>

      <button
        onClick={desmarcarTodos}
        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 shadow"
      >
        Desmarcar Todos
      </button>
    </div>
  );
};

export default DistribuidorStatus;