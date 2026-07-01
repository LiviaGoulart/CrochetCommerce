# 🧶 CrochetCommerce

## Sobre o projeto

O **CrochetCommerce** é um **SaaS (Software as a Service)** desenvolvido para conectar **crocheteiras** e **clientes** em uma única plataforma, proporcionando um ambiente seguro, organizado e intuitivo para a comercialização de peças artesanais em crochê.

A plataforma possui dois tipos de usuários:

- 👩‍🧶 **Crocheteiras (Vendedoras):** podem cadastrar, gerenciar e vender seus produtos.
- 🛍️ **Clientes:** podem navegar pelo catálogo, favoritar produtos, realizar compras e acompanhar seus pedidos.

O objetivo do CrochetCommerce é valorizar o artesanato, facilitar a divulgação dos trabalhos das crocheteiras e oferecer aos clientes uma experiência de compra confiável.

---

# 🚀 Objetivos

- Incentivar o comércio de produtos artesanais.
- Facilitar a venda de peças de crochê.
- Centralizar vendedores e compradores em uma única plataforma.
- Oferecer uma experiência simples e segura para ambas as partes.

---

# 💡 Importância do projeto

Atualmente, muitas crocheteiras realizam suas vendas por redes sociais e aplicativos de mensagens, o que pode gerar dificuldades no controle de pedidos, pagamentos e organização dos produtos.

O **CrochetCommerce** surge como uma solução para esses problemas, oferecendo uma plataforma especializada no segmento de artesanato em crochê.

Entre os principais benefícios estão:

- Maior organização das vendas;
- Catálogo centralizado de produtos;
- Facilidade para encontrar peças artesanais;
- Segurança para compradores e vendedores;
- Controle de pedidos;
- Gerenciamento de produtos;
- Ambiente dedicado exclusivamente ao mercado de crochê.

Dessa forma, o sistema fortalece pequenos empreendedores e torna a experiência de compra muito mais prática e confiável.

---

# 👥 Tipos de usuários

## 🧶 Crocheteira

A crocheteira possui acesso ao gerenciamento de sua loja, podendo:

- Cadastrar produtos;
- Editar produtos;
- Excluir produtos;
- Gerenciar pedidos;
- Atualizar informações da conta;
- Acompanhar vendas.

---

## 🛒 Cliente

O cliente pode:

- Criar uma conta;
- Fazer login;
- Visualizar produtos;
- Favoritar produtos;
- Adicionar itens ao carrinho;
- Realizar pedidos;
- Acompanhar compras;
- Atualizar seus dados pessoais.

---

# ✨ Funcionalidades

- Cadastro de usuários
- Autenticação com login
- Dois níveis de usuários (Cliente e Crocheteira)
- Cadastro de categorias
- Cadastro de produtos
- Atualização de produtos
- Exclusão lógica de produtos
- Carrinho de compras
- Lista de desejos (Wishlist)
- Gerenciamento de pedidos
- Perfil do usuário
- API REST
- Autenticação via JWT

---

# 🛠️ Tecnologias utilizadas

## Backend

- PHP 8
- MySQL
- API REST
- JWT (JSON Web Token)
- Composer

## Frontend

- HTML5
- CSS3
- JavaScript (ES6+)
- Consumo da API REST
- Design responsivo

---

# 📂 Estrutura do sistema

```
CrochetCommerce
│
├── API (Backend)
│   ├── Users
│   ├── Products
│   ├── ProductCategories
│   ├── Orders
│   ├── FAQs
│   └──FAQCategories
│
└── views (Frontend)
    ├── Account
    ├── Dashboard
    ├── Home
    ├── Login
    └── Register
```

---

# 🔐 Segurança

O CrochetCommerce utiliza autenticação baseada em **JWT (JSON Web Token)** para proteger as rotas privadas da API.

Além disso:

- Apenas usuários autenticados podem acessar funcionalidades protegidas.
- Cada usuário possui permissões conforme seu tipo (Cliente ou Crocheteira).
- Produtos podem ser removidos por exclusão lógica, preservando o histórico de pedidos.

---

# 🎯 Público-alvo

- Crocheteiras
- Artesãos
- Pequenos empreendedores
- Consumidores interessados em produtos artesanais

---

# 📈 Futuras melhorias

- Sistema de avaliações
- Chat entre cliente e crocheteira
- Integração com gateways de pagamento
- Rastreamento de entregas
- Cupons de desconto
- Dashboard de vendas
- Relatórios financeiros
- Notificações em tempo real

---

# 👨‍💻 Desenvolvido por

**Lívia Goulart Montenegro**

Projeto acadêmico desenvolvido com o objetivo de aplicar conhecimentos em desenvolvimento Full Stack, utilizando arquitetura de APIs REST, autenticação com JWT, banco de dados relacional e integração entre frontend e backend na construção de uma plataforma SaaS voltada ao comércio de produtos artesanais em crochê.
