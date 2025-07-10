import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import CardMembroExtra from '../components/CardMembroExtra';

// Tipagens
export type MembroExtra = {
  id: string;
  nome: string;
  avatar: string;
  usos: number;
  comissao: number;
  salvo: boolean;
};

const STORAGE_KEY = 'vendasMOB';
const MEMBROS_EXTRA_KEY = 'EquipeExtra';

const EquipeConfigPage: React.FC = () => {
  const { temaAtual } = useTheme();

  const [membrosExtras, setMembrosExtras] = useState<MembroExtra[]>([]);
  const [historico, setHistorico] = useState<any[]>([]);

  // Calcula comissões conforme regras de desconto
  const calcularCreditoGerado = (venda: any): number => {
    const { desconto_aplicado, total_final } = venda;
    if (desconto_aplicado === 10) return total_final * 0.02;
    if (desconto_aplicado === 5) return total_final * 0.025;
    return total_final * 0.03;
  };

  const getConquista = (usos: number) => {
    if (usos >= 50) return { nome: 'Elite', icon: '👑' };
    if (usos >= 30) return { nome: 'Destaque', icon: '🏆' };
    if (usos >= 10) return { nome: 'Iniciante', icon: '🥉' };
    return null;
  };

  const salvarMembroExtra = (id: string) => {
    const atualizados = membrosExtras.map((m) => m.id === id ? { ...m, salvo: true } : m);
    setMembrosExtras(atualizados);
    localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
  };

  useEffect(() => {
    const vendas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const extrasSalvos = JSON.parse(localStorage.getItem(MEMBROS_EXTRA_KEY) || '[]') as MembroExtra[];

    const membrosMap: Record<string, MembroExtra> = {};
    extrasSalvos.forEach((m) => {
      membrosMap[m.id] = { ...m, usos: 0, comissao: 0 };
    });

    vendas.forEach((venda: any) => {
      const { destino_desconto, desconto_aplicado, total_final } = venda;
      const perc = desconto_aplicado === 10 ? 0.02 : desconto_aplicado === 5 ? 0.025 : 0.03;

      // Somente computa comissão se o membro já está salvo
      if (destino_desconto in membrosMap) {
        membrosMap[destino_desconto].usos += 1;
        membrosMap[destino_desconto].comissao += total_final * perc;
      }
    });

    const todos = Object.values(membrosMap);
    setMembrosExtras(todos);
    setHistorico([...vendas].reverse().slice(0, 20));
    localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(todos));
  }, []);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Equipe & Comissões</h1>
        <button
          onClick={() => {
            const novo: MembroExtra = {
              id: crypto.randomUUID(),
              nome: 'Novo Membro',
              avatar: '/avatars/default.png',
              usos: 0,
              comissao: 0,
              salvo: false,
            };
            const atualizados = [...membrosExtras, novo];
            setMembrosExtras(atualizados);
            localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Adicionar Membro
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {membrosExtras.map((m) => (
          <CardMembroExtra
            key={m.id}
            id={m.id}
            nome={m.nome}
            avatar={m.avatar}
            usos={m.usos}
            comissao={m.comissao}
            credito={m.comissao}
            conquista={getConquista(m.usos)}
            onUpdate={(id, field, value) => {
              const atualizados = membrosExtras.map((m) => m.id === id ? { ...m, [field]: value } : m);
              setMembrosExtras(atualizados);
              localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
            }}
            onRemove={(id) => {
              const atualizados = membrosExtras.filter((m) => m.id !== id);
              setMembrosExtras(atualizados);
              localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
            }}
            onSalvar={salvarMembroExtra}
            salvo={m.salvo}
          />
        ))}
      </div>
    </div>
  );
};

export default EquipeConfigPage;