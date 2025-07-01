export interface Produto {
  nome: string;
  marca: string;
  quantidade: number;
  precoUnitario: number;
  tipo: 'caixa' | '5un' | 'unidade';
  subtotal: number;
  codigo: string;
   desconto?: number; 
}

export interface Cliente {
  nome: string;
  cpf: string;
  whatsapp?: string;
  endereco?: string;
  email?: string;
  cep?: string;
  nascimento?: string;
}

export type Venda = {
  numero: number;
  hora: string;
  cliente: Cliente;
  itens: Produto[];
  data: string;
  subtotal: number;
  desconto_aplicado: number;
  frete: number;
  total_final: number;
  forma_pagamento: string;
  destino_desconto: string;
  pago: boolean;
};