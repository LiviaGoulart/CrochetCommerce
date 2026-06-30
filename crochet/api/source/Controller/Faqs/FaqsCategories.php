<?php

namespace Source\Controller\Faqs;

use Source\Controller\Api;
use Source\Models\Faqs\FaqCategory;

class FaqsCategories extends Api {
    
public function list() {

    $faqCategory = new FaqCategory();

    $this->call(
        200,
        "success",
        "Lista de Categorias de FAQ",
        "success"
        )->back($faqCategory->getAll());
}

public function listById(array $data) : void {

    if(!isset($data["categoryId"]) || empty($data["categoryId"]) || !filter_var($data["categoryId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID da categoria é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }

        $faqCategory = new FaqCategory();
        $result = $faqCategory->selectById($data["categoryId"]);

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

        $category = new FaqCategory(
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
            "Categoria de FAQ criada com sucesso",
            "success"
            )->back($response);
}
}