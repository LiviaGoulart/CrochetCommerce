<?php

namespace source\Controller;

use Source\Controller\Api;
use Source\Models\Product;
use Source\Support\Upload;

class Products extends Api
{
    public function listById(array $data): void
    {
        /*$product = new Product();
        $product->selectById($data["product_id"]);
        echo $product->getName();
        var_dump($product);*/

        if(!isset($data["product_id"]) || empty($data["product_id"]) || !filter_var($data["product_id"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do produto é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }

        $product = new Product();
        if(!$product->selectById($data["product_id"])) {
            $this->call(
                404,
                "not_found",
                "Produto não encontrado",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $product->getId(),
            "category_id" => $product->getCategoryId(),
            "name" => $product->getName(),
            "price" => $product->getPrice(),
            "active" => $product->getActive()
        ];

        $this->call(
        200,
        "success",
        "Produto encontrado",
        "success"
        )->back($response);

    }

    
    public function listAll(array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(
                401,
                "unauthorized",
                "Token de autenticação inválido ou expirado.",
                "error"
            )->back(null);
            return;
        }

        $products = new Product();

        $this->call(200, "success", "Lista de Produtos", "success")
            ->back($products->selectByUserId($this->userAuthId));
    }


    public function listPaginator (array $data): void
    {
        if(!isset($data["page"]) || !isset($data["per_page"]) ||
            empty($data["page"]) || empty($data["per_page"]) ||
            !filter_var($data["page"], FILTER_VALIDATE_INT) ||
            !filter_var($data["per_page"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "Os campos page e per_page são obrigatórios, devem ser números inteiros e maiores que zero",
                "error"
            )->back(null);
            return;
        }

        $products  = new Product();
        $response = $products->selectPaginator($data["page"], $data["per_page"], [], 'id', 'ASC');
        $this->call(200,"success","Lista de Produtos com Paginação","success")->back($response);
    }

    //lista da cliente
    public function listStore(array $data): void
    {
        $products = new Product();

        $this->call(200, "success", "Lista de Produtos da Loja", "success")
            ->back($products->selectStore());
    }


    //INSERT - POST
    public function insert(array $data): void
{
    if (!$this->authToken(2)) {
        $this->call(
            401,
            "unauthorized",
            "Token de autenticação inválido ou expirado.",
            "error"
        )->back();
        return;
    }

    // Dados enviados pelo formulário
    $data = $_POST;

    // Verificar se uma imagem foi enviada
    if (!isset($_FILES["photo"]) || $_FILES["photo"]["error"] !== UPLOAD_ERR_OK) {
        $this->call(
            400,
            "bad_request",
            "Selecione uma imagem para o produto.",
            "error"
        )->back();
        return;
    }

    // Pasta onde as imagens serão salvas
    $uploadDirectory = dirname(__DIR__, 3)
        . DIRECTORY_SEPARATOR . "uploads"
        . DIRECTORY_SEPARATOR . "products";

    if (!is_dir($uploadDirectory)) {
        mkdir($uploadDirectory, 0777, true);
    }

    // Fazer upload
    $uploader = new Upload($uploadDirectory);
    $filename = $uploader->image($_FILES["photo"]);

    if (!$filename) {
        $this->call(
            500,
            "internal_server_error",
            "Não foi possível enviar a imagem.",
            "error"
        )->back();
        return;
    }

    $photoPath = "uploads/products/" . $filename;

    // Criar produto
    $product = new Product(
        null,
        $this->userAuthId,
        $data["categoryId"] ?? null,
        $data["name"] ?? null,
        $data["price"] ?? null,
        $data["active"] ?? 1,
        $data["bio"] ?? null,
        $data["stock"] ?? null,
        $photoPath
    );

    if (!$product->insert()) {
        $this->call(
            500,
            "internal_service_error",
            $product->getErrorMessage(),
            "error"
        )->back();
        return;
    }

    $response = [
        "usersId" => $product->getUsersId(),
        "categoryId" => $product->getCategoryId(),
        "name" => $product->getName(),
        "price" => $product->getPrice(),
        "active" => $product->getActive(),
        "bio" => $product->getBio(),
        "stock" => $product->getStock(),
        "photo" => $photoPath
    ];

    $this->call(
        201,
        "success",
        "Produto cadastrado com sucesso!",
        "success"
    )->back($response);
}

public function update(array $data): void
{
    // Receber os dados enviados pelo JavaScript
    $body = json_decode(file_get_contents("php://input"), true) ?? [];

    // Juntar os dados da rota com os dados do produto
    $data = array_merge($data, $body);

    if (
        !isset($data["product_id"]) ||
        !filter_var($data["product_id"], FILTER_VALIDATE_INT)
    ) {
        $this->call(400, "bad_request", "ID inválido", "error")->back();
        return;
    }

    if (
        empty($data["categoryId"]) ||
        empty($data["name"]) ||
        !isset($data["price"])
    ) {
        $this->call(
            400,
            "bad_request",
            "Dados do produto incompletos",
            "error"
        )->back();
        return;
    }

    $product = new Product(
        null,
        null,
        (int) $data["categoryId"],
        $data["name"],
        (float) $data["price"]
    );

    if (!$product->updateById((int) $data["product_id"])) {
        $this->call(
            500,
            "internal_server_error",
            $product->getErrorMessage() ?? "Erro ao atualizar produto",
            "error"
        )->back();
        return;
    }

    $this->call(
        200,
        "success",
        "Produto atualizado com sucesso",
        "success"
    )->back([
        "id" => (int) $data["product_id"],
        "categoryId" => $product->getCategoryId(),
        "name" => $product->getName(),
        "price" => $product->getPrice()
    ]);
}

    public function delete (array $data): void
    {
        if(!filter_var($data["product_id"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do produto é obrigatório e deve ser um número inteiro",
                "error"
            )->back();
            return;
        }

        $product = new Product();
        // soft delete -> transforma o active = 1 em 0
        if(!$product->softDeleteById($data["product_id"])){
            $this->call(500, "internal_server_error", $product->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(200,"success","Produto excluído com sucesso","success")->back();
    }

    public function newList (array $data): void
    {
        echo "Olá, Mundo!!";

        /**
         * SELEÇÃO DE TODOS OS PRODUTOS
         */
/*
        $product = new Product();
        var_dump($product->selectAll());
*/

        /**
         * SELEÇÃO DE PRODUTOS COM PAGINAÇÃO
         */
        $product = new Product();
        var_dump($product->selectPaginator(1, 10, [], 'id', 'ASC'));

        /**
         * INCLUSÃO
         */
/*
        $product = new Product(
            null,
            3,
            "Notebook",
            1000.00
        );

        var_dump($product);

        if(!$product->insert()){
            var_dump($product->getErrorMessage());
        }
        else {
            var_dump("Inserido com sucesso!");
        }

        var_dump($product);*/

        /**
         * ALTERAÇÃO
         */
/*
        $product = new Product(
            null,
            2,
            "Smartphone",
            500.00
        );

        var_dump($product);

        if(!$product->updateById(54)){
            var_dump($product->getErrorMessage());
        }
        else{
            var_dump("Atualizado com sucesso!");
        }
        var_dump($product);
*/
        /**
         * EXCLUSÃO - HARD
         */
/*
        $product = new Product();
        var_dump($product);
        if(!$product->deleteById(25)){
            var_dump($product->getErrorMessage());
        }
        else{
            var_dump("Excluído com sucesso!");
        }
*/

        /**
         * EXCLUSÃO - SOFT
         */
/*
        $product = new Product();
        if(!$product->softDeleteById(24))
        {
            var_dump($product->getErrorMessage());
        } else
        {
            var_dump("Excluído com sucesso!");
        }
*/

    }

    public function validate (array $data): bool
    {
        if(!isset($data["category_id"]) || !isset($data["name"]) || !isset($data["price"]) ||
            empty($data["category_id"]) || empty($data["name"]) || empty($data["price"]) ||
           !filter_var($data["category_id"], FILTER_VALIDATE_INT) || !filter_var($data["price"], FILTER_VALIDATE_FLOAT)) {
            return false;
        }
        return true;
    }
}