<?php

namespace Source\Controller;

use Source\Controller\Api;
use Source\Models\Store\ProductCategory;

class ProductsCategories extends Api
{

    public function list ()
    {
        $productsCategories = new ProductCategory();
        $this->call(
            200,
            "success",
            "Lista de Categorias de Produtos",
            "success"
            )->back($productsCategories->getAll());
    }


    public function listById(array $data) : void {


    if(!isset($data["product_id"]) || empty($data["product_id"]) || !filter_var($data["product_id"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID da categoria é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }

        $productCategory = new ProductCategory();
        $result = $productCategory->selectById($data["product_id"]);

        if(!$result) {
            $this->call(
                404,
                "not_found",
                "Categoria não encontrada",
                "error"
            )->back(null);
            return;
        }

    $response = [
        "id" => $result->id,
        "name" => $result->name
    ];

    $this->call(
         200,
        "success",
        "Categoria encontrada",
        "success"
    )->back($response);
}


public function insert(array $data) : void {


    if(empty(trim ($data["name"] ?? ""))){
            $this->call(
                400,
                "bad_request",
                "O campo name é obrigatório",
                "error"
            )->back();
            return;
        }

        $category = new ProductCategory(
            null,
            $data["name"]
        );
    
        if(!$category->insert()){
            $this->call(
                500, 
                "internal_server_error",
                "Não foi possível cadastrar a categoria", 
                "error"
                )->back();
            return;
        }

        $response = [
            "id" => $category->getId(),
            "name" => $category->getName()
        ];

        $this->call(
            201,
            "success",
            "Categoria de Produto criada com sucesso",
            "success"
            )->back($response);
}
}