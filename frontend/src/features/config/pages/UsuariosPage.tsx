import React, { useEffect, useState } from 'react';
import { FaTrash, FaEdit, FaIdBadge, FaTh, FaThList } from 'react-icons/fa';
import { useTheme } from '../../../context/ThemeContext';
import CadastroGoogleStyle from '../components/CadastroGoogleStyle';

interface Usuario {
  nome: string;
  email: string;
  tipo: string;
  senha: string;
  cidade: string;
  cpf: string;
  nascimento: string;
  whatsapp: string;
  avatar: string | null;
}

const UsuariosPage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [modoCadastro, setModoCadastro] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [visualModoCard, setVisualModoCard] = useState(true);

  useEffect(() => {
    const salvos = localStorage.getItem('USUARIOS_SISTEMA');
    if (salvos) {
      setUsuarios(JSON.parse(salvos));
    }
  }, []);

  const salvarUsuarios = (lista: Usuario[]) => {
    setUsuarios(lista);
    localStorage.setItem('USUARIOS_SISTEMA', JSON.stringify(lista));
  };

  const remover = (email: string) => {
    const confirm = window.confirm('Remover este usuário?');
    if (confirm) {
      const atualizados = usuarios.filter((u) => u.email !== email);
      salvarUsuarios(atualizados);
    }
  };

  const handleNovoUsuario = (usuario: Usuario) => {
    if (usuarioEditando) {
      const atualizados = usuarios.map((u) =>
        u.email === usuarioEditando.email ? usuario : u
      );
      salvarUsuarios(atualizados);
    } else {
      salvarUsuarios([...usuarios, usuario]);
    }

    setModoCadastro(false);
    setUsuarioEditando(null);
  };

  const editar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setModoCadastro(true);
  };

  return (
    <div className="p-6 min-h-screen" style={{ background: temaAtual.fundo, color: temaAtual.texto }}>
      {modoCadastro ? (
        <CadastroGoogleStyle
          onSubmit={handleNovoUsuario}
          onCancel={() => {
            setModoCadastro(false);
            setUsuarioEditando(null);
          }}
          usuarioEditando={usuarioEditando}
        />
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FaIdBadge /> Usuários Cadastrados
            </h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setVisualModoCard(!visualModoCard)}
                className="px-3 py-2 rounded shadow border border-white hover:scale-105 transition"
                style={{ background: temaAtual.card, color: temaAtual.texto }}
                title={visualModoCard ? 'Visualizar em Tabela' : 'Visualizar em Cards'}
              >
                {visualModoCard ? <FaThList /> : <FaTh />}
              </button>

              <button
                onClick={() => setModoCadastro(true)}
                className="px-4 py-2 rounded font-semibold text-sm"
                style={{
                  background: temaAtual.destaque,
                  color: temaAtual.textoBranco,
                }}
              >
                + Novo Usuário
              </button>
            </div>
          </div>

          {visualModoCard ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {usuarios.map((u, idx) => (
                <div
                  key={idx}
                  className="rounded-lg shadow-md p-4 flex items-center gap-4"
                  style={{ background: temaAtual.card, color: temaAtual.texto }}
                >
                  <img
                    src={u.avatar || '/user-placeholder.png'}
                    alt={u.nome}
                    className="w-16 h-16 rounded-full object-cover border"
                  />
                  <div className="flex-1">
                    <h2 className="font-bold text-lg">{u.nome}</h2>
                    <p className="text-sm">{u.email}</p>
                    <span className="text-xs capitalize opacity-70">{u.tipo}</span>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <button onClick={() => editar(u)} className="text-blue-500 hover:scale-110 transition">
                      <FaEdit />
                    </button>
                    <button onClick={() => remover(u.email)} className="text-red-600 hover:scale-110 transition">
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-auto rounded shadow">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr style={{ background: temaAtual.card }}>
                    <th className="border px-3 py-2 text-left">Nome</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-2 py-2 text-center">Tipo</th>
                    <th className="border px-2 py-2 text-center w-24">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {usuarios.map((u, idx) => (
                    <tr key={idx} style={{ background: temaAtual.card, color: temaAtual.texto }}>
                      <td className="border px-3 py-2">{u.nome}</td>
                      <td className="border px-3 py-2">{u.email}</td>
                      <td className="border px-2 py-2 text-center capitalize">{u.tipo}</td>
                      <td className="border px-2 py-2">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => remover(u.email)}
                            className="hover:scale-110 transition text-red-600 text-sm"
                          >
                            <FaTrash />
                          </button>
                          <button
                            onClick={() => editar(u)}
                            className="hover:scale-110 transition text-blue-500 text-sm"
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UsuariosPage;
