export type Cliente = {
  nome: string;
  cpf: string;
  whatsapp: string;
  nascimento?: string;
  endereco?: string;
};

export type ItemVenda = {
  nome: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
  marca?: string;
  codigo?: string;
  tipo?: string;
};

export type Venda = {
  numero: number;
  data: string;
  hora?: string;
  cliente: Cliente;
  itens: ItemVenda[];
  subtotal: number;
  desconto_aplicado: number;
  frete: number;
  total_final: number;
  forma_pagamento: string;
  pago: boolean;
};

export type Recomendacao = {
  cliente: string;
  intervaloMedio: number;
  ultimaCompraDias: number;
  produtoFrequente: string;
  marcaFrequente: string;
  emAtraso: boolean;
};