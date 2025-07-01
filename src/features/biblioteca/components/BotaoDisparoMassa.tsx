import React from 'react';

type Cliente = {
  cnpj: string | number;
  contatos: string[];
};

type Props = {
  clientes: Cliente[];
  statusMap: Record<string, number>;
  mensagem: string;
};

const BotaoDisparoMassa: React.FC<Props> = ({ clientes, statusMap, mensagem }) => {
  const disparar = () => {
    const numeros: string[] = [];

    clientes.forEach((cliente) => {
      if (statusMap[String(cliente.cnpj)] === 1) {
        cliente.contatos.forEach((numero) => {
          if (numero) {
            numeros.push(numero);
          }
        });
      }
    });

    if (numeros.length === 0) {
      alert('Nenhum número com status verde para disparar.');
      return;
    }

    numeros.forEach((numero, i) => {
      setTimeout(() => {
        const url = `https://wa.me/55${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
      }, i * 1000); // 1s entre cada envio
    });
  };

  return (
    <button
      onClick={disparar}
      className="bg-green-700 text-white px-4 py-2 rounded text-sm mt-1 mb-2"
    >
      📤 Disparar para todos (status verde)
    </button>
  );
};

export default BotaoDisparoMassa;