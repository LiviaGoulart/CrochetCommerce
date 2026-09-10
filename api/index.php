<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);
// timezone para São Paulo América
date_default_timezone_set('America/Sao_Paulo');

ob_start();

require  __DIR__ . "/vendor/autoload.php";

// os headers abaixo são necessários para permitir o acesso a API por clientes externos ao domínio
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header('Access-Control-Allow-Credentials: true'); // Permitir credenciais

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

use CoffeeCode\Router\Router;

$route = new Router(url("api"),":");

$route->namespace("Source\Controller");

// Início - Projeto
// Produtos
$route->group("/products");
$route->get("/list/{product_id}","Products:listById"); // select by id - FUNCIONANDO
$route->get("/list","Products:listAll"); // select all - FUNCIONANDO
$route->post("/","Products:insert"); // insert - FUNCIONANDO
$route->put("/{product_id}","Products:update"); // update - FUNCIONANDO
$route->delete("/{product_id}","Products:delete"); // delete - FUNCIONANDO
$route->group(null);


// Categorias de Produtos
$route->group("/products-categories");
$route->get("/list", "ProductsCategories:list"); //FUNCIONANDO
$route->get("/list/{product_id}","ProductsCategories:listById"); // FUNCIONANDO
$route->post("/", "ProductsCategories:insert"); //FUNCIONANDO
$route->group(null);


// FAQs
$route->group("/faqs");
$route->get("/list", "Faqs\Faqs:listAll"); //FUNCIONANDO
$route->get("/list/{faqId}", "Faqs\Faqs:listById"); //FUNCIONANDO
$route->post("/", "Faqs\Faqs:insert"); //FUNCIONANDO 
$route->put("/{faqId}", "Faqs\Faqs:update"); //FUNCIONANDO
$route->group(null);

// Categorias de FAQs
$route->group("/faqs-categories");
$route->get("/list", "Faqs\FaqsCategories:list"); //FUNCIONANDO
$route->get("/list/{categoryId}", "Faqs\FaqsCategories:listById"); //FUNCIONANDO
$route->post("/", "Faqs\FaqsCategories:insert"); //FUNCIONANDO
$route->group(null);


//Users
$route->group("/users");
$route->post("/register","Users:registerCrochet"); // Registrar crocheteira - FUNCIONANDO
$route->post("/login","Users:loginGeral"); // login GERAL - FUNCIONANDO 
$route->put("/update","Users:updateCrochet"); // update de usuário Crocheteira - FUNCIONANDO (senha ta visivel) :(
$route->post("/register-client","Users:registerCliente"); // Registrar usuário - FUNCIONANDO
$route->post("/login-client","Users:auth"); // login de usuário CLIENTE - FUNCIONANDO
$route->put("/update-client","Users:updateClient"); // update de usuário Cliente - FUNCIONANDO (senha ta visivel) :(
$route->group(null);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = json_decode(file_get_contents('php://input'), true);

    if (is_array($json)) {
        $_POST = $json;
    }
}


$route->dispatch();

/** ERROR REDIRECT */
if ($route->error()) {
    header('Content-Type: application/json; charset=UTF-8');
    //http_response_code(404);

    echo json_encode([
        "code" => 404,
        "status" => "not_found",
        "message" => "URL não encontrada"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

}

ob_end_flush();