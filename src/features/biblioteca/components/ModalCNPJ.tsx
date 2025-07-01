import React, { useEffect, useState } from 'react';
import { FaSave, FaWhatsapp, FaTimes, FaPlus } from 'react-icons/fa';

type Cliente = {
  cnpj?: string | null;
  nomeFantasia?: string | null;
  nomeMatriz?: string | null;
  cidade?: string | null;
  uf?: string | null;
  contatos?: string[];
  status?: number;
};

type Props = {
  cliente: Cliente;
  onFechar: () => void;
};

const ModalCNPJ: React.FC<Props> = ({ cliente, onFechar }) => {
  const [editado, setEditado] = useState<Cliente>(() => {
    const salvos = JSON.parse(localStorage.getItem('cnpjValidados') || '[]');
    const existente = salvos.find((c: Cliente) => c.cnpj === cliente.cnpj);
    return {
      ...cliente,
      ...existente,
      contatos: existente?.contatos || [''],
    };
  });

  const [mensagem, setMensagem] = useState<string>('');

  useEffect(() => {
    const nome = editado.nomeFantasia || editado.nomeMatriz || '';
    const cidade = editado.cidade || '';
    setMensagem(`Olá!  Sou da equipe MOB Supply.

Vim conferir se você está precisando de algo no momento.

Temos cartuchos de alta qualidade das marcas SkinInk e VX Craft, ideais para quem busca excelência no resultado!

🛍 Ganhe 10% de desconto ou frete grátis na sua primeira compra.

Aproveite para nos seguir no Instagram e ficar por dentro das novidades:
👉 instagram.com/mob.supplybr

Conte com a gente! 💬.`);
  }, [editado.nomeFantasia, editado.nomeMatriz, editado.cidade]);

  useEffect(() => {
    const match = mensagem.match(/^Olá\s+(.+?),/);
    if (match) {
      setEditado((prev) => ({ ...prev, nomeFantasia: match[1] }));
    }
  }, [mensagem]);

  const gerarLinkWhatsApp = () => {
    const primeiroNumero = editado.contatos?.[0]?.replace(/\D/g, '');
    if (!primeiroNumero || primeiroNumero.length < 10) return '#';
    return `https://wa.me/55${primeiroNumero}?text=${encodeURIComponent(mensagem)}`;
  };

  const corStatusModal = () => {
    switch (editado.status) {
      case 1: return 'bg-yellow-100';
      case 2: return 'bg-green-100';
      default: return 'bg-gray-100';
    }
  };

  const salvarClienteValidado = () => {
    const salvos = JSON.parse(localStorage.getItem('cnpjValidados') || '[]');
    const atualizados = salvos.filter((c: Cliente) => c.cnpj !== editado.cnpj);
    atualizados.push({ ...editado });
    localStorage.setItem('cnpjValidados', JSON.stringify(atualizados));
    alert('Salvo com sucesso no cnpjValidados!');
    onFechar();
  };

  const atualizarContato = (index: number, valor: string) => {
    const contatosAtualizados = [...(editado.contatos || [])];
    contatosAtualizados[index] = valor;
    setEditado({ ...editado, contatos: contatosAtualizados });
  };

  const adicionarContato = () => {
    setEditado({ ...editado, contatos: [...(editado.contatos || []), ''] });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className={`p-6 rounded shadow-md w-full max-w-md relative ${corStatusModal()}`}>
        <button onClick={onFechar} className="absolute top-2 right-2 text-gray-500">
          <FaTimes />
        </button>

        <h2 className="text-lg font-bold mb-4">Ficha do Cliente</h2>

        <div className="space-y-3 text-sm">
          <div><strong>CNPJ:</strong> {editado.cnpj}</div>

          <div>
            <label>Nome Fantasia:</label>
            <input
              className="w-full border p-1"
              value={editado.nomeFantasia || ''}
              onChange={(e) => {
                const nome = e.target.value;
                setEditado({ ...editado, nomeFantasia: nome });
                const cidade = editado.cidade || '';
                setMensagem(`Olá!  Sou da equipe MOB Supply.

Vim conferir se você está precisando de algo no momento.

Temos cartuchos de alta qualidade das marcas SkinInk e VX Craft, ideais para quem busca excelência no resultado!

🛍 Ganhe 10% de desconto ou frete grátis na sua primeira compra.

Aproveite para nos seguir no Instagram e ficar por dentro das novidades:
👉 instagram.com/mob.supplybr

Conte com a gente! 💬..`);
              }}
            />
          </div>

          <div>
            <label>Cidade:</label>
            <input
              className="w-full border p-1"
              value={editado.cidade || ''}
              onChange={(e) => {
                const cidade = e.target.value;
                setEditado({ ...editado, cidade });
                const nome = editado.nomeFantasia || '';
                setMensagem(`Olá! Sou da equipe MOB Supply.

Vim conferir se você está precisando de algo no momento.

Temos cartuchos de alta qualidade das marcas SkinInk e VX Craft, ideais para quem busca excelência no resultado!

🛍 Ganhe 10% de desconto ou frete grátis na sua primeira compra.

Aproveite para nos seguir no Instagram e ficar por dentro das novidades:
👉 instagram.com/mob.supplybr

Conte com a gente! 💬..`);
              }}
            />
          </div>

          <div>
            <label>UF:</label>
            <input
              className="w-full border p-1"
              value={editado.uf || ''}
              onChange={(e) =>
                setEditado({ ...editado, uf: e.target.value.toUpperCase() })
              }
            />
          </div>

          <div>
            <label>Contatos WhatsApp:</label>
            {editado.contatos?.map((contato, i) => (
              <input
                key={i}
                className="w-full border p-1 mb-1"
                placeholder="(DDD) 9 9999-9999"
                value={contato}
                onChange={(e) => atualizarContato(i, e.target.value)}
              />
            ))}
            <button
              onClick={adicionarContato}
              className="text-sm text-blue-600 flex items-center gap-1 mt-1"
            >
              <FaPlus /> Adicionar contato
            </button>
          </div>

          <div>
            <label>Mensagem automática:</label>
            <textarea
              className="w-full border p-2"
              rows={3}
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-between mt-5">
          <button
            onClick={onFechar}
            className="bg-gray-500 px-4 py-2 rounded text-white"
          >
            Fechar
          </button>
          <div className="flex gap-2">
            <a
              href={gerarLinkWhatsApp()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-4 py-2 rounded flex items-center gap-2"
            >
              <FaWhatsapp /> Enviar
            </a>
            <button
              onClick={salvarClienteValidado}
              className="bg-blue-600 px-4 py-2 rounded text-white flex items-center gap-2"
            >
              <FaSave /> Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalCNPJ;