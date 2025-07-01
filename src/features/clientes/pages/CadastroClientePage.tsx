import React, { useEffect, useState } from 'react';
import {
  FaCheckCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

type Cliente = {
  nome: string;
  whatsapp: string;
  endereco: string;
  cpf: string;
  cep: string;
  nascimento: string;
  email?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
};

const CadastroClientePage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [cliente, setCliente] = useState<Cliente>({
    nome: '',
    whatsapp: '',
    endereco: '',
    cpf: '',
    cep: '',
    nascimento: '',
    email: '',
    bairro: '',
    cidade: '',
    estado: '',
  });

  const [cpfValido, setCpfValido] = useState(true);
  const [totalCpf, setTotalCpf] = useState(0);

  const aplicarMascaraCPF = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const aplicarMascaraWhatsapp = (valor: string) => {
    return valor
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})$/, '$1-$2');
  };

  const validarCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, '');
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    const calc = (factor: number) =>
      cleaned
        .substring(0, factor - 1)
        .split('')
        .reduce((sum, num, index) => sum + parseInt(num) * (factor - index), 0);

    const dig1 = ((calc(10) * 10) % 11) % 10;
    const dig2 = ((calc(11) * 10) % 11) % 10;

    return dig1 === parseInt(cleaned[9]) && dig2 === parseInt(cleaned[10]);
  };

  const buscarCep = async (cep: string) => {
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setCliente(prev => ({
          ...prev,
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || '',
          endereco: prev.endereco || data.logradouro || '',
        }));
      }
    } catch (err) {
      console.error('Erro ao buscar CEP:', err);
    }
  };

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem('clientesMOB') || '[]');
    const cpfs = new Set(dados.map((c: Cliente) => c.cpf));
    setTotalCpf(cpfs.size);
  }, []);

  useEffect(() => {
    const cepLimpo = cliente.cep.replace(/\D/g, '');
    if (cepLimpo.length === 8) {
      buscarCep(cepLimpo);
    }
  }, [cliente.cep]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let novoValor = value;

    if (name === 'cpf') {
      novoValor = aplicarMascaraCPF(value);
      setCpfValido(validarCPF(novoValor));
    }

    if (name === 'whatsapp') {
      novoValor = aplicarMascaraWhatsapp(value);
    }

    setCliente((prev) => ({ ...prev, [name]: novoValor }));
  };

  const salvarCliente = () => {
    if (!cliente.nome || !cliente.whatsapp || !cliente.cpf) {
      alert('Preencha os campos obrigatórios: Nome, WhatsApp e CPF.');
      return;
    }

    const clientesSalvos = JSON.parse(localStorage.getItem('clientesMOB') || '[]');
    const atualizados = [...clientesSalvos, cliente];
    localStorage.setItem('clientesMOB', JSON.stringify(atualizados));

    const cpfsUnicos = new Set(atualizados.map((c: Cliente) => c.cpf));
    setTotalCpf(cpfsUnicos.size);

    alert('Cliente cadastrado com sucesso!');

    setCliente({
      nome: '',
      whatsapp: '',
      endereco: '',
      cpf: '',
      cep: '',
      nascimento: '',
      email: '',
      bairro: '',
      cidade: '',
      estado: '',
    });
  };

  return (
    <div
      className="p-6 min-h-screen transition-all"
      style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}
    >
      <h1 className="text-3xl font-bold mb-6" style={{ color: temaAtual.destaque }}>
        Cadastro de Cliente
      </h1>

      {/* Barra de progresso visual */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1 text-sm">
          <span className="font-semibold">Progresso de Cadastro</span>
          <span>{totalCpf}/100</span>
        </div>
        <div className="w-full bg-gray-300 rounded h-3 overflow-hidden">
          <div
            className="h-full rounded transition-all duration-500"
            style={{
              width: `${Math.min(totalCpf, 100)}%`,
              backgroundColor: temaAtual.destaque
            }}
          ></div>
        </div>
      </div>

      {/* Formulário */}
      <div
        className="rounded-lg shadow p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
        style={{ backgroundColor: temaAtual.card, color: temaAtual.texto }}
      >
        <input
          type="text"
          name="nome"
          placeholder="Nome*"
          value={cliente.nome}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          style={{ backgroundColor: temaAtual.input, color: temaAtual.texto, borderColor: temaAtual.destaque }}
        />

        <input
          type="text"
          name="whatsapp"
          placeholder="WhatsApp*"
          value={cliente.whatsapp}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          style={{ backgroundColor: temaAtual.input, color: temaAtual.texto, borderColor: temaAtual.destaque }}
        />

        <input
          type="text"
          name="endereco"
          placeholder="Endereço"
          value={cliente.endereco}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          style={{ backgroundColor: temaAtual.input, color: temaAtual.texto, borderColor: temaAtual.destaque }}
        />

        {/* CPF com validador */}
        <div className="relative">
          <input
            type="text"
            name="cpf"
            placeholder="CPF*"
            value={cliente.cpf}
            onChange={handleChange}
            className={`border rounded px-4 py-2 w-full pr-10 ${
              cpfValido ? '' : 'border-red-500'
            }`}
            style={{
              backgroundColor: temaAtual.input,
              color: temaAtual.texto,
              borderColor: cpfValido ? temaAtual.destaque : 'red',
            }}
          />
          {cliente.cpf.length >= 14 && (
            <span className="absolute top-2.5 right-3">
              {cpfValido ? (
                <FaCheckCircle className="text-green-500" />
              ) : (
                <FaExclamationCircle className="text-red-500" />
              )}
            </span>
          )}
        </div>

        <input
          type="text"
          name="cep"
          placeholder="CEP"
          value={cliente.cep}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          style={{ backgroundColor: temaAtual.input, color: temaAtual.texto, borderColor: temaAtual.destaque }}
        />

        <input
          type="date"
          name="nascimento"
          value={cliente.nascimento}
          onChange={handleChange}
          className="border rounded px-4 py-2 w-full"
          style={{ backgroundColor: temaAtual.input, color: temaAtual.texto, borderColor: temaAtual.destaque }}
        />

      
      </div>

      <button
        onClick={salvarCliente}
        className="mt-6 font-semibold px-6 py-2 rounded transition-all"
        style={{ backgroundColor: temaAtual.destaque, color: temaAtual.card }}
      >
        Salvar Cliente
      </button>

    </div>
  );
};

export default CadastroClientePage;