import React from 'react';
import { useIdioma } from '../context/IdiomaContext';

const BotaoIdioma: React.FC = () => {
  const { idioma, setIdioma } = useIdioma();

  const alternarIdioma = () => {
    setIdioma(idioma === 'pt' ? 'en' : 'pt');
  };

  return (
    <button
      onClick={alternarIdioma}
      className="text-sm px-3 py-1 rounded-md border hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {idioma === 'pt' ? '🇧🇷 PT' : '🇺🇸 EN'}
    </button>
  );
};

export default BotaoIdioma;
