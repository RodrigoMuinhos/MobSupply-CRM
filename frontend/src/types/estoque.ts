export interface ItemEstoque {
  codigo: string;
  nome: string;
  quantidade_em_estoque: number;
  preco_unit: number;
  preco_caixa: number;

  // Campos adicionais para cálculo e controle financeiro
  qtdCaixas?: number;        // Total de caixas cadastradas para o item
  valorPago?: number;        // Valor total investido no item
  valorVenda?: number;       // Valor esperado de venda (prospecção)
  estoque_minimo?: number;   // Quantidade mínima para alerta de estoque baixo
}
