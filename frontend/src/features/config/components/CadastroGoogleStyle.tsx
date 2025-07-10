import React, { useRef, useState, useEffect } from 'react';
import {
  FaUserPlus,
  FaKey,
  FaUserShield,
  FaMapMarkerAlt,
  FaIdCard,
  FaBirthdayCake,
  FaPhoneAlt,
  FaEnvelope,
} from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';

interface Usuario {
  nome: string;
  senha: string;
  tipo: string;
  cidade: string;
  cpf: string;
  nascimento: string;
  whatsapp: string;
  email: string;
  avatar: string | null;
}

interface CadastroProps {
  onSubmit: (usuario: Usuario) => void;
  onCancel: () => void;
  usuarioEditando?: Usuario | null;
}

const CadastroGoogleStyle: React.FC<CadastroProps> = ({
  onSubmit,
  onCancel,
  usuarioEditando,
}) => {
  const { temaAtual } = useTheme();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [tipo, setTipo] = useState('');
  const [cidade, setCidade] = useState('');
  const [cpf, setCpf] = useState('');
  const [nascimento, setNascimento] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const usuariosSalvos = localStorage.getItem('USUARIOS_SISTEMA');
    if (usuariosSalvos) {
      setUsuarios(JSON.parse(usuariosSalvos));
    }
  }, []);

  useEffect(() => {
    if (usuarioEditando) {
      setNome(usuarioEditando.nome || '');
      setSenha(usuarioEditando.senha || '');
      setTipo(usuarioEditando.tipo || '');
      setCidade(usuarioEditando.cidade || '');
      setCpf(usuarioEditando.cpf || '');
      setNascimento(usuarioEditando.nascimento || '');
      setWhatsapp(usuarioEditando.whatsapp || '');
      setEmail(usuarioEditando.email || '');
      setAvatar(usuarioEditando.avatar || null);
    }
  }, [usuarioEditando]);

  const salvarUsuarios = (novosUsuarios: Usuario[]) => {
    setUsuarios(novosUsuarios);
    localStorage.setItem('USUARIOS_SISTEMA', JSON.stringify(novosUsuarios));
  };

  const validarCPF = (cpf: string) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf);

  const formatarCPF = (valor: string) => {
    const cpfLimpo = valor.replace(/\D/g, '').slice(0, 11);
    return cpfLimpo
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  };

  const formatarWhatsapp = (valor: string) => {
    const limpo = valor.replace(/\D/g, '').slice(0, 11);
    return limpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarCPF(cpf)) {
      alert('CPF inválido. Use o formato 000.000.000-00');
      return;
    }

    const novoUsuario: Usuario = {
      nome,
      senha,
      tipo,
      cidade,
      cpf,
      nascimento,
      whatsapp,
      email,
      avatar,
    };

    const novos = usuarioEditando
      ? usuarios.map((u) => (u.cpf === usuarioEditando.cpf ? novoUsuario : u))
      : [...usuarios, novoUsuario];

    salvarUsuarios(novos);
    onSubmit(novoUsuario);
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatar(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 py-6"
      style={{ background: temaAtual.fundo }}
    >
      <div
        className="w-full max-w-2xl rounded-3xl shadow-xl backdrop-blur-md"
        style={{
          background: `${temaAtual.card}cc`,
          border: `1px solid ${temaAtual.destaque}`,
          color: temaAtual.texto,
        }}
      >
        <div className="flex flex-col items-center p-6 pb-0">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden border-4 border-white shadow-md hover:scale-105 transition cursor-pointer"
          >
            {avatar ? (
              <img
                src={avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserPlus className="text-3xl text-gray-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            )}
            <div className="absolute bottom-0 right-0 bg-black bg-opacity-60 rounded-full p-1">
              <FaUserShield className="text-xs text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold mt-4">
            {usuarioEditando ? 'Editar Usuário' : 'Novo Usuário'}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <label className="flex items-center gap-2 col-span-2">
            <FaUserPlus className="text-gray-400" />
            <input
              type="text"
              placeholder="Nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{
                background: temaAtual.card,
                color: temaAtual.texto,
                borderColor: temaAtual.destaque,
              }}
            />
          </label>

          <label className="flex items-center gap-2">
            <FaKey className="text-gray-400" />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            />
          </label>

          <label className="flex items-center gap-2">
            <FaIdCard className="text-gray-400" />
            <input
              type="text"
              placeholder="CPF"
              value={cpf}
              onChange={(e) => setCpf(formatarCPF(e.target.value))}
              disabled={!!usuarioEditando}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            />
          </label>

          <label className="flex items-center gap-2">
            <FaMapMarkerAlt className="text-gray-400" />
            <select
              value={cidade}
              onChange={(e) => setCidade(e.target.value)}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            >
              <option value="">Selecione a cidade</option>
              <option value="Belém - PA">Belém - PA</option>
              <option value="Recife - PE">Recife - PE</option>
              <option value="Fortaleza - CE">Fortaleza - CE</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <FaBirthdayCake className="text-gray-400" />
            <input
              type="date"
              value={nascimento}
              onChange={(e) => setNascimento(e.target.value)}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            />
          </label>

          <label className="flex items-center gap-2">
            <FaPhoneAlt className="text-gray-400" />
            <input
              type="text"
              placeholder="(DDD) 90000-0000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(formatarWhatsapp(e.target.value))}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            />
          </label>

          <label className="flex items-center gap-2">
            <FaEnvelope className="text-gray-400" />
            <input
              type="email"
              placeholder="Email (opcional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            />
          </label>

          <label className="flex items-center gap-2 col-span-2">
            <FaUserShield className="text-gray-400" />
            <select
              value={tipo}
              onChange={(e) => setTipo(e.target.value)}
              className="w-full p-2 rounded-md border focus:outline-none"
              style={{ background: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}
            >
              <option value="">Tipo de usuário</option>
              <option value="adm">Administrador</option>
              <option value="filiado">Filiado</option>
              <option value="vendedor">Vendedor</option>
            </select>
          </label>

          <div className="col-span-2 flex justify-between gap-4 mt-4">
            <button
              type="submit"
              className="flex-1 bg-green-600 text-white font-bold py-2 rounded-md hover:bg-green-700 transition"
            >
              {usuarioEditando ? 'Salvar alterações' : 'Cadastrar usuário'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-400 text-black font-bold py-2 rounded-md hover:bg-gray-500 transition"
            >
              Cancelar
            </button>
          </div>
        </form>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};

export default CadastroGoogleStyle;
