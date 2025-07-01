# MOB Supply

Sistema completo de gestão para vendas e estoque de suprimentos de tatuagem.  
Permite controle de clientes, histórico de vendas, estoque por marca/tipo e sincronização local/offline.

## Funcionalidades

- Cadastro de clientes com CPF, nascimento, endereço, WhatsApp e e-mail
- Controle de estoque por marcas (SKINK ink e VX Craft)
- Registro de vendas com cálculo automático de subtotal, frete e desconto
- Painel de controle com gráficos (vendas por mês, estoque, receita estimada)
- Modo offline com sincronização para backend
- Geração de relatórios em PDF

## Tecnologias Utilizadas

- **Frontend:** React + Vite + TailwindCSS
- **Gráficos:** Chart.js
- **Backend:** Node.js + SQLite (modo local e portável)
- **PDF Export:** html2pdf.js + jsPDF

## Como rodar localmente

1. Clone este repositório:
   ```bash
   git clone https://github.com/RodrigoMuinhos/mob-supply.git
   ```

2. Acesse a pasta:
   ```bash
   cd mob-supply
   ```

3. Instale as dependências:
   ```bash
   npm install
   ```

4. Rode o frontend:
   ```bash
   npm run dev
   ```

> Certifique-se de que o backend esteja rodando em `http://localhost:5000`

## Licença

Este projeto está sob a licença MIT.
