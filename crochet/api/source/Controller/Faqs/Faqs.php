<?php

namespace Source\Controller\Faqs;

use Source\Controller\Api;
use Source\Models\Faqs\Faq;

class Faqs extends Api {

    public function listAll (array $data): void
    {
        $faqs = new Faq();

        $this->call(
            200,
            "success",
            "Lista de FAQs",
            "success"
            )->back($faqs->selectAll());
    }

    public function listById(array $data) : void {

        if(!isset($data["faqId"]) || empty($data["faqId"]) || !filter_var($data["faqId"], FILTER_VALIDATE_INT)) {
            $this->call(
                400,
                "bad_request",
                "ID do FAQ é obrigatório e deve ser um número inteiro",
                "error"
            )->back(null);
            return;
        }

        $faq = new Faq();
        $result = $faq->selectById($data["faqId"]);
        if(!$faq->selectById($data["faqId"])) {
            $this->call(
                404,
                "not_found",
                "FAQ não encontrado",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $result->id,
            "question" => $result->question,
            "answer" => $result->answer,
            "category_name" => $result->category_name
        ];

        $this->call(
        200,
        "success",
        "FAQ encontrado",
        "success"
        )->back($response);
    }


    public function insert(array $data) : void {

    //$body = json_decode(file_get_contents("php://input"), true);
    
    if(empty(trim ($data["question"] ?? "" || $data["answer"] ?? "" || $data["faqs_category_id"] ?? ""))){
            $this->call(
                400,
                "bad_request",
                "Os campos question, answer e faqs_category_id são obrigatórios",
                "error"
            )->back();
            return;
        }

        $faq = new Faq(
            null,
            $data["question"],
            $data["answer"],
            $data["faqs_category_id"],
            1
        );
    
        if(!$faq->insert()){
            $this->call(
                500, 
                "internal_server_error",
                "Não foi possível cadastrar o FAQ", 
                "error"
                )->back();
            return;
        }

        $response = [
            "id" => $faq->getId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer(),
            "faqs_category_id" => $faq->getFaqsCategory()
        ];

        $this->call(
            201,
            "success",
            "FAQ criado com sucesso",
            "success"
            )->back($response);
}


    public function update (array $data): void{


        if(!filter_var($data["faqId"], FILTER_VALIDATE_INT) || empty(trim ($data["question"] ?? "" || $data["answer"] ?? "" || $data["faqs_category_id"] ?? ""))) {
            $this->call(
                400,
                "bad_request",
                "ID inválido ou campos obrigatórios ausentes",
                "error"
            )->back();
            return;
        }

        $faq = new Faq(
            null,
            $data["question"],
            $data["answer"],
            $data["faqs_category_id"],
            1
        );

        if(!$faq->update($data["faqId"], $faq)) {
            $this->call(
                404,
                "not_found",
                "FAQ não encontrado",
                "error"
            )->back(null);
            return;
        }

        $response = [
            "id" => $faq->getId(),
            "question" => $faq->getQuestion(),
            "answer" => $faq->getAnswer(),
            "faqs_category_id" => $faq->getFaqsCategory()
        ];

        $response = $faq->selectJoin($data["faqId"]);

        $this->call(
            200,
            "success",
            "FAQ atualizado com sucesso",
            "success"
            )->back($response);
    }

}