# Crochet Commerce API

## Sobre o projeto

A **Crochet Commerce API** é a interface responsável pela comunicação entre o banco de dados e a aplicação do sistema Crochet Commerce. Seu objetivo é fornecer serviços para gerenciamento de produtos, usuários e perguntas frequentes (FAQs), utilizando uma arquitetura REST e retornando os dados em formato JSON.

A API foi desenvolvida em PHP utilizando o **CoffeeCode Router** para gerenciamento das rotas e o **Composer** para gerenciamento das dependências.

---

## Funcionalidades

A API disponibiliza recursos para:

- Cadastro, consulta, edição e exclusão de produtos;
- Gerenciamento das categorias de produtos;
- Cadastro e consulta de FAQs;
- Gerenciamento das categorias de FAQs;
- Cadastro e autenticação de usuários (clientes e crocheteiras);
- Atualização dos dados dos usuários.

---

## Tecnologias utilizadas

- PHP
- MySQL
- Composer
- CoffeeCode Router
- JSON
- REST API

---

## Organização das rotas

As rotas estão divididas por módulos, facilitando a manutenção e organização do projeto.

### Produtos

Responsável pelas operações de CRUD dos produtos cadastrados na plataforma.

Exemplos de rotas:

- `GET /products/list`
- `GET /products/list/{id}`
- `POST /products`
- `PUT /products/{id}`
- `DELETE /products/{id}`

---

### Categorias de Produtos

Permite consultar e cadastrar categorias de produtos.

---

### FAQs

Gerencia as perguntas frequentes exibidas na plataforma.

---

### Categorias de FAQs

Responsável pelas categorias das perguntas frequentes.

---

### Usuários

Possui funcionalidades separadas para clientes e crocheteiras, permitindo:

- cadastro;
- autenticação;
- atualização dos dados.

---

## Estrutura do projeto

```
api
├── source
│   ├── Controller
│   ├── Models
│   └── Support
├── vendor
├── composer.json
├── index.php
└── README.md
```

---

## Características da API

- Arquitetura REST;
- Comunicação em JSON;
- Suporte a requisições externas (CORS);
- Organização por controladores;
- Autoload de classes com Composer;
- Tratamento de rotas inexistentes com retorno HTTP 404.

---

## Resposta de erro

Caso uma rota inexistente seja acessada, a API retorna uma resposta semelhante a:

```json
{
  "code": 404,
  "status": "not_found",
  "message": "URL não encontrada"
}
```

---
