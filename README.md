<h1 align="center">🧿 MOB Supply CRM</h1>
<p align="center">
  Sistema completo de gestão para vendas e estoque de suprimentos de tatuagem.
  <br/>
  Controle de clientes, vendas, relatórios em PDF, estoque por marca/tipo e modo offline.
</p>

---

## ✨ Funcionalidades

- Cadastro completo de clientes (CPF, nascimento, endereço, WhatsApp, e-mail)
- Controle de estoque por marcas (SKINK ink, VX Craft, etc.)
- Registro de vendas com cálculo automático (subtotal, frete, desconto, forma de pagamento)
- Painel com gráficos (vendas mensais, produtos, receita)
- Geração de relatórios em *PDF*
- Suporte a *modo offline* com dados salvos no navegador (localStorage)
- Relatórios por cliente, mês, produto ou forma de pagamento

---

## 🚀 Tecnologias Utilizadas

- *Frontend:* React + Vite + TailwindCSS + TypeScript  
- *Gráficos:* Chart.js + Recharts  
- *PDF Export:* html2pdf.js + jsPDF  
- *Armazenamento local:* localStorage (com estrutura para sincronização futura)
- *Backend (futuro):* Node.js + SQLite


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
