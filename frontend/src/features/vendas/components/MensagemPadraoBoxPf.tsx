import React, { useEffect, useState } from 'react';
import { BsCircleFill } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

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
  const { temaAtual } = useTheme();

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
    <div
      className="p-4 rounded shadow"
      style={{
        background: temaAtual.card,
        color: temaAtual.texto,
        border: `1px solid ${temaAtual.contraste}`,
      }}
    >
      <h3 className="font-semibold mb-3 text-lg">Mensagens padrão por status</h3>

      {/* Círculos de cores */}
      <div className="flex items-center gap-3 mb-4">
        {cores.map((cor) => (
          <BsCircleFill
            key={cor}
            size={22}
            className={`cursor-pointer transition-transform ${
              corSelecionada === cor ? 'scale-125' : ''
            }`}
            style={{ color: corToHex[cor] }}
            onClick={() => setCorSelecionada(cor)}
          />
        ))}
      </div>

      {/* Textarea */}
      <textarea
        value={mensagens[corSelecionada]}
        onChange={(e) =>
          setMensagens({ ...mensagens, [corSelecionada]: e.target.value })
        }
        className="w-full p-2 rounded text-sm mb-3"
        style={{
          background: temaAtual.input,
          color: temaAtual.texto,
          border: `1px solid ${temaAtual.contraste}`,
        }}
        placeholder="Escreva a mensagem para salvar na cor selecionada..."
        rows={4}
      />

      {/* Botão de salvar */}
      <button
        onClick={salvar}
        className="px-4 py-2 rounded flex items-center gap-2 transition-all"
        style={{
          background: temaAtual.destaque,
          color: temaAtual.textoClaro,
        }}
      >
        <FaSave /> Salvar
      </button>
    </div>
  );
};

export default MensagemPadraoBoxPF;
