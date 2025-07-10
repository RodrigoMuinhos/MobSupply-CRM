// src/features/financeiro/utils/recuperarVendasAntigas.ts
import { Venda } from '../../../types/venda';

export function recuperarVendasAntigas(): Venda[] {
  const todasChaves = Object.keys(localStorage);
  const vendasAntigas: Venda[] = [];

  todasChaves.forEach((chave) => {
    try {
      const valor = localStorage.getItem(chave);
      if (!valor) return;
      const dado = JSON.parse(valor);

      // Validação básica para identificar se é uma venda
      if (
        dado &&
        typeof dado === 'object' &&
        dado.numero &&
        dado.itens &&
        Array.isArray(dado.itens) &&
        dado.total_final
      ) {
        // Adiciona se for do mês de junho
        const dataVenda = new Date(dado.data || dado.dataHora || dado.hora || '');
        if (dataVenda instanceof Date && !isNaN(dataVenda.getTime())) {
          const mes = dataVenda.getMonth();
          if (mes === 5) {
            vendasAntigas.push({
              ...dado,
              cliente: dado.cliente || { nome: 'Desconhecido', cpf: '00000000000' },
              data: dataVenda.toISOString(),
            });
          }
        }
      }
    } catch (err) {
      // Ignorar valores mal formatados
    }
  });

  return vendasAntigas;
}