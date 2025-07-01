import React, { useState, useEffect } from 'react';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

type Props = {
  numero: string;
  mensagem: string;
  onClose: () => void;
  onEnviar: () => void;
};

const formatarNumero = (numero: string) => {
  const n = numero.replace(/\D/g, '');
  return `(${n.slice(0, 2)}) ${n[2]} ${n.slice(3, 7)}-${n.slice(7)}`;
};

const ModalWhatsApp: React.FC<Props> = ({ numero, mensagem, onClose, onEnviar }) => {
  const { temaAtual } = useTheme();
  const [mensagemEditada, setMensagemEditada] = useState(mensagem);

  useEffect(() => {
    setMensagemEditada(mensagem);
  }, [mensagem]);

  const link = `https://wa.me/55${numero.replace(/\D/g, '')}?text=${encodeURIComponent(mensagemEditada)}`;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
      }}
    >
      <div
        style={{
          background: temaAtual.fundo,
          color: temaAtual.texto,
          padding: 24,
          borderRadius: 10,
          width: '90%',
          maxWidth: 500,
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Enviar mensagem</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: temaAtual.texto }}>
            <FaTimes size={20} />
          </button>
        </div>

        <p style={{ marginTop: 16 }}><strong>Para:</strong> {formatarNumero(numero)}</p>

        <textarea
          rows={6}
          value={mensagemEditada}
          onChange={(e) => setMensagemEditada(e.target.value)}
          style={{
            width: '100%',
            marginTop: 12,
            padding: 12,
            borderRadius: 6,
            border: `1px solid ${temaAtual.texto}`,
            backgroundColor: temaAtual.fundoAlt,
            color: temaAtual.texto,
            resize: 'none',
          }}
        />

        <div style={{ marginTop: 20, textAlign: 'right' }}>
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onEnviar}
            style={{
              backgroundColor: '#25D366',
              color: '#fff',
              padding: '10px 16px',
              borderRadius: 6,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              fontWeight: 600,
            }}
          >
            <FaWhatsapp /> Enviar pelo WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default ModalWhatsApp;