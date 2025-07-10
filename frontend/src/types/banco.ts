// src/types/banco.ts

export interface Cliente {
  id: string;
  nome: string;
  cpf: string;
  whatsapp: string;
  endereco?: string;
  cep?: string;
  email?: string;
  nascimento?: string;
  criadoEm?: string;
  atualizadoEm?: string;
  sincronizado?: boolean;
  [key: string]: any; // Para permitir campos dinâmicos em idiomas ou ficheiros estendidos
}
