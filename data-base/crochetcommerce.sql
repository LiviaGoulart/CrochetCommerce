-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 13-Nov-2026 às 23:53
-- Versão do servidor: 10.4.32-MariaDB
-- versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `crochetcommerce`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `faqs`
--

CREATE TABLE `faqs` (
  `id` int(11) NOT NULL,
  `faqs_category_id` int(11) NOT NULL,
  `question` varchar(255) NOT NULL,
  `answer` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `faqs`
--

INSERT INTO `faqs` (`id`, `faqs_category_id`, `question`, `answer`, `active`) VALUES
(1, 1, 'Quais tipos de linhas são utilizadas nos produtos?', 'Utilizamos linhas de alta qualidade selecionadas para garantir durabilidade, conforto e um excelente acabamento.', 1),
(2, 1, 'Posso escolher a cor da linha para um produto personalizado?', 'Sim, em produtos personalizáveis você pode selecionar entre as cores disponíveis no momento da compra.', 1),
(3, 2, 'Como escolher o tamanho correto do produto?', 'Você pode consultar a tabela de medidas disponível na página do produto para encontrar o tamanho mais adequado.', 1),
(4, 2, 'O que fazer se o tamanho recebido não servir?', 'Entre em contato com nossa equipe de suporte para verificar as opções de troca conforme nossa política vigente.', 1),
(5, 3, 'Os preços dos produtos podem sofrer alterações?', 'Sim, os valores podem ser atualizados sem aviso prévio devido a promoções, custos de materiais ou outras condições de mercado.', 1),
(6, 3, 'Existem descontos para compras em grande quantidade?', 'Dependendo do produto e da quantidade solicitada, podem existir condições especiais. Entre em contato para mais informações.', 1),
(7, 4, 'Como posso entrar em contato com o suporte?', 'Você pode utilizar nossos canais de atendimento disponíveis na página de contato para tirar dúvidas ou solicitar ajuda.', 1),
(8, 4, 'Qual é o horário de atendimento do suporte?', 'Nosso suporte está disponível durante o horário comercial informado em nossos canais oficiais.', 1),
(9, 5, 'Como acompanho o status do meu pedido?', 'Após a confirmação da compra, você poderá acompanhar o andamento do pedido através da sua conta ou pelos avisos enviados por e-mail.', 1),
(10, 5, 'Posso cancelar ou alterar um pedido já realizado?', 'Alterações ou cancelamentos podem ser solicitados antes do início do processamento do pedido, sujeito à análise da crocheteira.', 1),
(11, 6, 'Quais formas de pagamento são aceitas?', 'Aceitamos as formas de pagamento informadas durante a finalização da compra, como cartão de crédito, PIX e outros métodos disponíveis.', 1),
(12, 6, 'Meu pagamento foi recusado. O que devo fazer?', 'Verifique os dados informados e tente novamente. Caso o problema persista, entre em contato com a instituição financeira ou com nosso suporte.', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `faqs_categories`
--

CREATE TABLE `faqs_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `faqs_categories`
--

INSERT INTO `faqs_categories` (`id`, `name`, `active`) VALUES
(1, 'Linhas ', 1),
(2, 'Tamanhos', 1),
(3, 'Valores', 1),
(4, 'Suporte', 1),
(5, 'Pedidos', 1),
(6, 'Pagamentos', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `products_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura da tabela `itens_orders`
--

CREATE TABLE `itens_orders` (
  `id` int(11) NOT NULL,
  `products_id` int(11) NOT NULL,
  `orders_id` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantidade` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `itens_orders`
--

INSERT INTO `itens_orders` (`id`, `products_id`, `orders_id`, `price`, `quantidade`) VALUES
(1, 17, 1, 160.00, 1),
(2, 18, 2, 180.00, 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `cliente_id` varchar(45) NOT NULL,
  `vendedora_id` varchar(45) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` varchar(45) DEFAULT NULL,
  `date_order` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `orders`
--

INSERT INTO `orders` (`id`, `users_id`, `cliente_id`, `vendedora_id`, `total_price`, `status`, `date_order`) VALUES
(1, 15, '16', '15', 160.00, 'Em Confecção', '2026-11-12 20:56:59'),
(2, 17, '18', '17', 180.00, 'Em Confecção', '2026-11-12 21:40:17');

-- --------------------------------------------------------

--
-- Estrutura da tabela `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `active` tinyint(1) NOT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `products`
--

INSERT INTO `products` (`id`, `users_id`, `category_id`, `name`, `price`, `active`, `bio`, `stock`, `photo`) VALUES
(1, 12, 2, 'Vestido', 100.00, 0, NULL, NULL, NULL),
(2, 12, 2, 'Vestido', 100.00, 0, NULL, NULL, NULL),
(3, 12, 6, 'Cachecol', 70.00, 0, NULL, NULL, NULL),
(4, 12, 6, 'Cachecol', 70.00, 0, NULL, NULL, NULL),
(5, 12, 7, 'Sapinho', 50.00, 0, NULL, NULL, NULL),
(6, 13, 2, 'Vestido baby', 100.00, 0, NULL, NULL, NULL),
(7, 13, 6, 'cachecol', 160.00, 0, NULL, NULL, NULL),
(8, 13, 6, 'cachecol', 160.00, 0, NULL, NULL, NULL),
(9, 13, 6, 'labubu', 160.00, 0, NULL, NULL, NULL),
(10, 13, 6, 'cachecol', 5444.00, 0, NULL, NULL, NULL),
(11, 14, 2, 'Vestido baby', 100.00, 0, '', 1, 'uploads/products/59db8a7f6900f8ee6160f42cd5a7b6be.png'),
(12, 14, 2, 'Vestido baby', 150.00, 1, '', 1, 'uploads/products/b63c88915f00a6a937c619003f316fc9.png'),
(13, 14, 1, 'Top azul claro', 70.00, 1, '', 1, 'uploads/products/dfe9c51aea53633570b1299f95a8057e.png'),
(14, 14, 1, 'Top azul escuro', 70.00, 1, '', 1, 'uploads/products/36c9b1f8d0c4ee2a7c98cf24088c6e61.png'),
(15, 14, 3, 'Biquíni azul escuro', 140.00, 1, '', 1, 'uploads/products/f9ce52e6c5774daf84a7d39df941d549.png'),
(16, 15, 2, 'Vestido baby', 140.00, 0, '', 2, 'uploads/products/0390bad745c6e83827e10d507b89c22d.png'),
(17, 15, 6, 'cachecol', 160.00, 0, 'manta super fofa', 1, 'uploads/products/87d1356a747ba4244afea5cc7ebee227.png'),
(18, 17, 4, 'Saia square', 180.00, 1, '', 1, 'uploads/products/cb8f11dfbab928ec8b526b9e4e91ba5c.jpg'),
(19, 19, 7, 'Amigurumi patinho', 75.00, 1, '', 1, 'uploads/products/e08624ac941287e922b1fa99a100bcac.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `products_categories`
--

CREATE TABLE `products_categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `active` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `products_categories`
--

INSERT INTO `products_categories` (`id`, `name`, `active`) VALUES
(1, 'Tops', 1),
(2, 'Baby', 1),
(3, 'Biquínis', 1),
(4, 'Saias', 1),
(5, 'Casacos', 1),
(6, 'Cachecol', 1),
(7, 'Amigurumis', 1);

-- --------------------------------------------------------

--
-- Estrutura da tabela `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `type_id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL,
  `email` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `bio` varchar(255) DEFAULT NULL,
  `address` varchar(45) DEFAULT NULL,
  `active` tinyint(1) DEFAULT NULL,
  `store_name` varchar(45) DEFAULT NULL,
  `art_name` varchar(45) DEFAULT NULL,
  `cpf` varchar(11) DEFAULT NULL,
  `phone` varchar(11) DEFAULT NULL,
  `instagram` varchar(45) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `users`
--

INSERT INTO `users` (`id`, `type_id`, `name`, `email`, `password`, `bio`, `address`, `active`, `store_name`, `art_name`, `cpf`, `phone`, `instagram`, `photo`) VALUES
(6, 1, 'Jerce', 'jerce@gmail.com', '', '', 'Eldorado do Sul, RS', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(7, 2, 'Cassia', 'cassia@gmail.com', '$2y$10$CSD9l07osd9LzLR29Gybxu54f35QjudsDvedPEcQ3msuaul10SKSa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(9, 2, 'Luiz', 'luiz@gmail.com', '$2y$10$yTbXP2T4I4tI/lpweZw87uL/y2DG0hQC6eo2JpUwHT5qYbRgTXVEy', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(10, 2, 'Lavinia ', 'lavinia@gmail.com', '$2y$10$U1fT6frbZWg2gVN5vThvouhEgkiMje1PtKmUsmOvnFhzQsarH./oa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(11, 2, 'Lívia Goulart', 'goulartlivia@gmail.com', '$2y$10$zKUkvwwsMlOG7/55vwPg4uCHKgc5PtUAaF6vCTrUb2pZF5RDhhgl2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(12, 2, 'Natasha ', 'natty@gmail.com', '$2y$10$6xLiE6tXjP0oaTlnfxawru7aVKmvLEsA/4czjJtkPFe3qv5XYKXOa', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(13, 2, 'Janja', 'janja@gmail.com', '$2y$10$avc.myIo3Fr1svwNH0X/2.6wtYNC1DLXDUlZ3j7/4sGouoUX9wrz6', 'Amo o Lula', 'Brasilia, DF', NULL, 'janja lula atelie', 'Janja', '123', '0', 'https://instagram.com/maosdefadacroche', NULL),
(14, 2, 'Lívia Goulart Montenegro', 'liviaa@gmail.com', '$2y$10$Hz4cq7VE3flijFiwnLkaEuS/0JNUzsqcv5jZqCLDGjO4BBRAy5yti', '', '', NULL, 'ponto_livia', 'Lívia Goulart Montenegro', '123', '0', 'https://instagram.com/maosdefadacroche', 'uploads/users/4b64e549326dc1e89ec43b815ac35b4b.png'),
(15, 2, 'Lulu', 'lulu@gmail.com', '$2y$10$g6lDA8GU6Ul1WdbKuUvTyu/AiuZgkku7e2pTrzZ.G0BnVmAIStZT6', '', '', 0, 'lulu malvadao', 'Lulu', '123', '0', 'https://instagram.com/maosdefadacroche', 'uploads/users/1ff11ad058ff07391cfcd0d5737cc60d.jpg'),
(16, 1, 'Clara', 'clara@gmail.com', '$2y$10$IZSn9aDDDRNxWCI9R6D7aeF8YElZuVUJsv9yWvvr9HUoFllXlqzPu', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/users/3ea2ea5edffc3a8c4b7128219b82970a.jpg'),
(17, 2, 'Cintia', 'cintia@gmail.com', '$2y$10$AoY6ZLwKomo7KEnNK0S/8uME1qYrObU6j/69l65Y17.bO1huM22A2', 'Amo meus gatos e velas', 'Floripa, SC', NULL, 'Mistica', 'Cintia', '123', '0', 'https://instagram.com/maosdefadacroche', 'uploads/users/e10e7956dca9e2ada6a4aedd5d7ad9a8.jpg'),
(18, 1, 'Helena', 'helena@gmail.com', '', 'Amo o Lulu', 'Charqueadas, RS', NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/users/b71258d0bd14e9646b24eea289ccbe05.jpg'),
(19, 2, 'Grazi', 'grazi@gmail.com', '$2y$10$YHY80pjiefk2GrufBd3ruePs82qXH6.DYqJfESwnHPtdhI88hFGN2', 'Amo a minha filhinha maite', 'Porto Alegre, RS', NULL, 'Grazi mat', 'Grazi', '123', '0', 'https://instagram.com/maosdefadacroche', 'uploads/users/5cc8384ce6290d35cede36e197779712.jpg'),
(20, 1, 'Elizandra', 'elizandra@gmail.com', '$2y$10$nFqcKDvoJrl1Li.t0aucCe1xMlpA4OBnUMgyz8yABWMMaJYZwxxEW', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'uploads/users/9a41cf7e6e3710d20291a44fe5438fda.jpg');

-- --------------------------------------------------------

--
-- Estrutura da tabela `users_type`
--

CREATE TABLE `users_type` (
  `id` int(11) NOT NULL,
  `name` varchar(45) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Extraindo dados da tabela `users_type`
--

INSERT INTO `users_type` (`id`, `name`) VALUES
(1, 'Cliente'),
(2, 'Crocheteira');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `faqs`
--
ALTER TABLE `faqs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `faqs_category_id` (`faqs_category_id`);

--
-- Índices para tabela `faqs_categories`
--
ALTER TABLE `faqs_categories`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`users_id`,`products_id`),
  ADD KEY `products_id` (`products_id`);

--
-- Índices para tabela `itens_orders`
--
ALTER TABLE `itens_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_id` (`orders_id`),
  ADD KEY `fk_itens_orders_products1` (`products_id`);

--
-- Índices para tabela `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`);

--
-- Índices para tabela `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD KEY `users_id` (`users_id`),
  ADD KEY `fk_products_products_categories1` (`category_id`);

--
-- Índices para tabela `products_categories`
--
ALTER TABLE `products_categories`
  ADD PRIMARY KEY (`id`);

--
-- Índices para tabela `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `type_id` (`type_id`);

--
-- Índices para tabela `users_type`
--
ALTER TABLE `users_type`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `faqs`
--
ALTER TABLE `faqs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de tabela `faqs_categories`
--
ALTER TABLE `faqs_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itens_orders`
--
ALTER TABLE `itens_orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de tabela `products_categories`
--
ALTER TABLE `products_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de tabela `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de tabela `users_type`
--
ALTER TABLE `users_type`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `faqs`
--
ALTER TABLE `faqs`
  ADD CONSTRAINT `faqs_ibfk_1` FOREIGN KEY (`faqs_category_id`) REFERENCES `faqs_categories` (`id`);

--
-- Limitadores para a tabela `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`),
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`);

--
-- Limitadores para a tabela `itens_orders`
--
ALTER TABLE `itens_orders`
  ADD CONSTRAINT `fk_itens_orders_products1` FOREIGN KEY (`products_id`) REFERENCES `products` (`id`),
  ADD CONSTRAINT `itens_orders_ibfk_1` FOREIGN KEY (`orders_id`) REFERENCES `orders` (`id`);

--
-- Limitadores para a tabela `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_products_categories1` FOREIGN KEY (`category_id`) REFERENCES `products_categories` (`id`),
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`);

--
-- Limitadores para a tabela `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`type_id`) REFERENCES `users_type` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
