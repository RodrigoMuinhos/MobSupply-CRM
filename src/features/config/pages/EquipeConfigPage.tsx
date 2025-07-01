import React, { useEffect, useState } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaInfoCircle, FaCrown, FaTrophy, FaMedal } from 'react-icons/fa';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';

import CardEquipe from '../components/CardEquipe';
import CardMembroExtra from '../components/CardMembroExtra';

type CupomTipo = 'RF' | 'IM' | 'AG';

type EstatisticasCupom = {
  RF: number;
  IM: number;
  AG: number;
};

type ComissaoEquipe = {
  RF: number;
  IM: number;
  AG: number;
  Rafa: number;
};

type MembroExtra = {
  id: string;
  nome: string;
  avatar: string;
  usos: number;
  comissao: number;
  salvo: boolean; 
};

const STORAGE_KEY = 'vendasMOB';
const RECOMPENSAS_KEY = 'recompensasEquipe';
const MEMBROS_EXTRA_KEY = 'EquipeExtra';

const EquipePage: React.FC = () => {
  const { temaAtual } = useTheme();
  const navigate = useNavigate();

  const [estatisticas, setEstatisticas] = useState<EstatisticasCupom>({ RF: 0, IM: 0, AG: 0 });
  const [comissoes, setComissoes] = useState<ComissaoEquipe>({ RF: 0, IM: 0, AG: 0, Rafa: 0 });
  const [recompensas, setRecompensas] = useState<Record<CupomTipo, boolean>>({ RF: false, IM: false, AG: false });
  const [creditosUsaveis, setCreditosUsaveis] = useState<Record<CupomTipo, number>>({ RF: 0, IM: 0, AG: 0 });
  const [mostrarModal, setMostrarModal] = useState<{ ativo: boolean; codigo: CupomTipo | null }>({ ativo: false, codigo: null });
  const [historico, setHistorico] = useState<any[]>([]);
  const [membrosExtras, setMembrosExtras] = useState<MembroExtra[]>([]);

  const calcularCreditoGerado = (venda: any): number => {
    const { destino_desconto, desconto_aplicado, total_final } = venda;
    if (!['RF', 'IM', 'AG', 'Rafa'].includes(destino_desconto)) return 0;
    if (desconto_aplicado === 10) return total_final * 0.02;
    if (desconto_aplicado === 5) return total_final * 0.025;
    return total_final * 0.03;
  };

  const getConquista = (usos: number) => {
    if (usos >= 50) return { nome: 'Elite', icon: <FaCrown />, corFundo: 'bg-yellow-100', corTexto: 'text-yellow-700', corBorda: 'border-yellow-400' };
    if (usos >= 30) return { nome: 'Destaque', icon: <FaTrophy />, corFundo: 'bg-gray-100', corTexto: 'text-gray-700', corBorda: 'border-gray-400' };
    if (usos >= 10) return { nome: 'Iniciante', icon: <FaMedal />, corFundo: 'bg-orange-100', corTexto: 'text-orange-700', corBorda: 'border-orange-400' };
    return null;
  };

  const calcularProgresso = (usos: number) => Math.min((usos / 50) * 100, 100);
  const salvarMembroExtra = (id: string) => {
  const atualizados = membrosExtras.map((m) =>
    m.id === id ? { ...m, salvo: true } : m
  );
  setMembrosExtras(atualizados);
  localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
};

useEffect(() => {
  const vendas = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const recompensasSalvas = JSON.parse(localStorage.getItem(RECOMPENSAS_KEY) || '{"RF":false,"IM":false,"AG":false}');
  const extrasSalvos = JSON.parse(localStorage.getItem(MEMBROS_EXTRA_KEY) || '[]');

  const estatisticasAtualizadas: EstatisticasCupom = { RF: 0, IM: 0, AG: 0 };
  const comissao: ComissaoEquipe = { RF: 0, IM: 0, AG: 0, Rafa: 0 };

  // Garante que o campo salvo seja mantido
  const membrosExtraAtualizados = extrasSalvos.map((m: MembroExtra) => ({
    ...m,
    usos: 0,
    comissao: 0,
    salvo: m.salvo ?? false,
  }));

  vendas.forEach((venda: any) => {
    const { destino_desconto, desconto_aplicado, total_final } = venda;

    // Membros fixos
    if (['RF', 'Rafa'].includes(destino_desconto)) {
      estatisticasAtualizadas.RF++;
      const perc = desconto_aplicado === 10 ? 0.02 : desconto_aplicado === 5 ? 0.025 : 0.03;
      comissao.RF += total_final * perc + total_final * 0.01;
    } else if (['IM', 'AG'].includes(destino_desconto)) {
      estatisticasAtualizadas[destino_desconto]++;
      const perc = desconto_aplicado === 10 ? 0.02 : desconto_aplicado === 5 ? 0.025 : 0.03;
      comissao[destino_desconto] += total_final * perc;
    }

    // Membros extras
    const index = membrosExtraAtualizados.findIndex((m: MembroExtra) => m.nome === destino_desconto);
    if (index !== -1) {
      membrosExtraAtualizados[index].usos += 1;
      membrosExtraAtualizados[index].comissao += total_final * 0.02;
    }
  });

  setEstatisticas(estatisticasAtualizadas);
  setComissoes(comissao);
  setHistorico([...vendas].reverse().slice(0, 20));
  setRecompensas(recompensasSalvas);
  setMembrosExtras(membrosExtraAtualizados);

  // Atualiza localStorage com membros extras já atualizados
  localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(membrosExtraAtualizados));

  // Créditos disponíveis
  const novosCreditos: Record<CupomTipo, number> = {
    RF: comissao.RF >= 0.01 ? comissao.RF : 0,
    IM: comissao.IM >= 0.01 ? comissao.IM : 0,
    AG: comissao.AG >= 0.01 ? comissao.AG : 0
  };
  setCreditosUsaveis(novosCreditos);
  localStorage.setItem('creditosEquipe', JSON.stringify(novosCreditos));
}, []);

  return (
    <div className="p-6 space-y-6" style={{ backgroundColor: temaAtual.fundo, color: temaAtual.texto }}>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Equipe & Comissões</h1>
       <button
  onClick={() =>
    setMembrosExtras(prev => {
     const novo = {
  id: crypto.randomUUID(),
  nome: 'Novo Membro',
  avatar: '/avatars/default.png',
  usos: 0,
  comissao: 0,
  salvo: false, // ✅ importante para o botão aparecer
};
      const atualizados = [...prev, novo];
      localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
      return atualizados;
    })
  }
  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
>
  + Adicionar Membro
</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Membros principais */}
        {(['RF', 'IM', 'AG'] as CupomTipo[]).map((codigo) => (
          <CardEquipe
            key={codigo}
            nome={codigo === 'RF' ? 'Rafa' : codigo}
            avatar={`/avatars/${codigo.toLowerCase()}.png`}
            usos={estatisticas[codigo]}
            comissao={comissoes[codigo]}
            credito={creditosUsaveis[codigo]}
            conquista={getConquista(estatisticas[codigo])}
            onUsarCredito={() => setMostrarModal({ ativo: true, codigo })}
            bloqueado={creditosUsaveis[codigo] <= 0}
          />
        ))}

        {/* Membros Extras */}
        {membrosExtras.map((membro) => (
         <CardMembroExtra
  key={membro.id}
  id={membro.id}
  nome={membro.nome}
  avatar={membro.avatar}
  usos={membro.usos}
  comissao={membro.comissao}
  credito={membro.comissao} // ou outra lógica, se desejar separar
  conquista={getConquista(membro.usos)}
  onUpdate={(id, field, value) =>
    setMembrosExtras((prev) => {
      const atualizados = prev.map((m) =>
        m.id === id ? { ...m, [field]: value } : m
      );
      localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
      return atualizados;
    })
  }
  onRemove={(id) => {
    const atualizados = membrosExtras.filter((m) => m.id !== id);
    setMembrosExtras(atualizados);
    localStorage.setItem(MEMBROS_EXTRA_KEY, JSON.stringify(atualizados));
  }}
  onSalvar={salvarMembroExtra}
  salvo={membro.salvo}
/>
        ))}
      </div>

      {/* Ranking */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Ranking da Equipe</h2>
        <div className="space-y-4">
          {[...['RF', 'IM', 'AG'], ...membrosExtras.map(m => m.id)]
  .map((id) => {
    const membroExtra = membrosExtras.find(m => m.id === id);
    const total = id in estatisticas ? estatisticas[id as CupomTipo] : membroExtra?.usos || 0;
    const nome = id === 'RF' ? 'Rafa' : id in estatisticas ? id : membroExtra?.nome || 'Membro';
    const avatar = id in estatisticas ? `/avatars/${id.toLowerCase()}.png` : membroExtra?.avatar || '';
    const conquista = getConquista(total);
    return { id, nome, avatar, total, conquista };
  })
            .sort((a, b) => b.total - a.total)
            .map(({ id, nome, avatar, total, conquista }, index) => (
              <div key={id} className="flex items-center gap-4 p-4 border rounded-lg"
                style={{
                  backgroundColor: temaAtual.card,
                  color: temaAtual.texto,
                  borderColor: conquista?.corBorda || temaAtual.destaque
                }}>
                <span className="text-2xl font-bold text-indigo-500 w-6">#{index + 1}</span>
                <img src={avatar} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="text-lg font-semibold">{nome}</p>
                  <div className="flex items-center gap-1 text-sm">
                    {conquista?.icon}
                    <span>{conquista?.nome}</span>
                  </div>
                  <p className="text-sm text-gray-400">{total} usos de cupom</p>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
        <div className="p-4 rounded-lg shadow border"
          style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}>
          <h3 className="text-lg font-bold mb-2">Conversões por Cupom</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={[
              { nome: 'Rafa', valor: estatisticas.RF },
              { nome: 'IM', valor: estatisticas.IM },
              { nome: 'AG', valor: estatisticas.AG },
              ...membrosExtras.map((m) => ({ nome: m.nome, valor: m.usos })),
            ]}>
              <XAxis dataKey="nome" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="valor">
                <Cell fill="#4CAF50" />
                <Cell fill="#2196F3" />
                <Cell fill="#FF5722" />
                {membrosExtras.map((_, i) => (
                  <Cell key={i} fill="#9CA3AF" />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="p-4 rounded-lg shadow border"
          style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}>
          <h3 className="text-lg font-bold mb-2">Proporção de Conversões</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { nome: 'Rafa', valor: estatisticas.RF },
                  { nome: 'IM', valor: estatisticas.IM },
                  { nome: 'AG', valor: estatisticas.AG },
                  ...membrosExtras.map((m) => ({ nome: m.nome, valor: m.usos })),
                ]}
                dataKey="valor"
                nameKey="nome"
                cx="50%" cy="50%" outerRadius={80} label
              >
                <Cell fill="#4CAF50" />
                <Cell fill="#2196F3" />
                <Cell fill="#FF5722" />
                {membrosExtras.map((_, i) => (
                  <Cell key={i} fill="#6B7280" />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Histórico de Conversões */}
      <div className="mt-10">
        <h2 className="text-xl font-bold mb-4">Histórico de Conversões</h2>
        <div className="overflow-x-auto rounded-lg shadow border"
          style={{ backgroundColor: temaAtual.card, color: temaAtual.texto, borderColor: temaAtual.destaque }}>
          <table className="min-w-full text-sm text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: temaAtual.destaque }}>
                <th className="px-4 py-2">Cliente</th>
                <th className="px-4 py-2">Cupom</th>
                <th className="px-4 py-2">Data</th>
                <th className="px-4 py-2">Nível</th>
                <th className="px-4 py-2 flex items-center gap-2">
                  Crédito Gerado
                  <FaInfoCircle title="Comissão gerada com base no cupom e desconto aplicado" className="text-green-600 cursor-pointer text-sm" />
                </th>
              </tr>
            </thead>
            <tbody>
              {historico
                .filter((v) => ['RF', 'Rafa', 'IM', 'AG', ...membrosExtras.map(m => m.nome)].includes(v.destino_desconto))
                .map((venda, idx) => {
                  const nomeCupom = venda.destino_desconto === 'Rafa' ? 'RF' : venda.destino_desconto;
                  const usos = nomeCupom in estatisticas
                    ? estatisticas[nomeCupom as CupomTipo]
                    : membrosExtras.find(m => m.nome === nomeCupom)?.usos || 0;
                  const conquista = getConquista(usos);
                  const credito = calcularCreditoGerado(venda);
                  return (
                    <tr key={idx} className="border-t" style={{ borderColor: temaAtual.destaque }}>
                      <td className="px-4 py-2">{venda.cliente?.nome || 'Desconhecido'}</td>
                      <td className="px-4 py-2 font-bold text-indigo-500">{nomeCupom}</td>
                      <td className="px-4 py-2">
                        {(() => {
                          const partes = venda.data?.split('/');
                          if (partes?.length === 3) {
                            const [d, m, a] = partes;
                            const iso = new Date(`${a}-${m}-${d}`);
                            return isNaN(iso.getTime()) ? 'Data inválida' : iso.toLocaleDateString();
                          }
                          const iso = new Date(venda.data);
                          return isNaN(iso.getTime()) ? 'Data inválida' : iso.toLocaleDateString();
                        })()}
                      </td>
                      <td className="px-4 py-2 flex items-center gap-1">
                        {conquista?.icon}
                        <span>{conquista?.nome}</span>
                      </td>
                      <td className={`px-4 py-2 font-semibold ${credito > 10 ? 'text-green-700 font-bold' : 'text-green-600'}`}>
                        R$ {credito.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EquipePage;