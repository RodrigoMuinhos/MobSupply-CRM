import React, { useEffect, useState } from 'react';
import { BsCircleFill } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';

const cores = ['cinza', 'azul', 'amarelo', 'verde', 'roxo'] as const;
type Cor = typeof cores[number];

const corToHex: Record<Cor, string> = {
  cinza: '#9ca3af',
  azul: '#3b82f6',
  amarelo: '#eab308',
  verde: '#22c55e',
  roxo: '#a855f7',
};

const MensagemPadraoBoxPF: React.FC = () => {
  const [corSelecionada, setCorSelecionada] = useState<Cor>('cinza');
  const [mensagens, setMensagens] = useState<Record<Cor, string>>({
    cinza: '',
    azul: '',
    amarelo: '',
    verde: '',
    roxo: '',
  });

  useEffect(() => {
    const salvas = JSON.parse(localStorage.getItem('modelosFixosWppPF') || '{}');
    const atualizadas: Record<Cor, string> = { ...mensagens };
    cores.forEach((cor) => {
      if (salvas[cor]) atualizadas[cor] = salvas[cor];
    });
    setMensagens(atualizadas);
  }, []);

  const salvar = () => {
    localStorage.setItem('modelosFixosWppPF', JSON.stringify(mensagens));
    alert('Mensagem salva com sucesso!');
  };

  return (
    <div className="p-4 rounded shadow bg-white dark:bg-zinc-800">
      <h3 className="font-semibold mb-2">Mensagens padrão por status</h3>

      <div className="flex items-center space-x-3 mb-4">
        {cores.map((cor) => (
          <BsCircleFill
            key={cor}
            size={22}
            className={`cursor-pointer ${corSelecionada === cor ? 'scale-125' : ''}`}
            style={{ color: corToHex[cor] }}
            onClick={() => setCorSelecionada(cor)}
          />
        ))}
      </div>

      <textarea
        value={mensagens[corSelecionada]}
        onChange={(e) =>
          setMensagens({ ...mensagens, [corSelecionada]: e.target.value })
        }
        className="w-full p-2 border rounded text-sm dark:bg-zinc-700 dark:text-white"
        placeholder="Escreva a mensagem para salvar na cor selecionada..."
        rows={4}
      />

      <button
        onClick={salvar}
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded flex items-center gap-2"
      >
        <FaSave /> Salvar
      </button>
    </div>
  );
};

export default MensagemPadraoBoxPF;