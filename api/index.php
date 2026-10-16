<?php

error_reporting(E_ALL & ~E_DEPRECATED & ~E_USER_DEPRECATED);

date_default_timezone_set('America/Sao_Paulo');

ob_start();

require __DIR__ . "/vendor/autoload.php";

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {

    $json = json_decode(file_get_contents('php://input'), true);

    if (is_array($json)) {
        $_POST = $json;
    }
}

use CoffeeCode\Router\Router;

$route = new Router("http://localhost/crochet/api", ":");

$route->namespace("Source\Controller");



$route->group("/products");

$route->get("/list/{product_id}", "Products:listById");
$route->get("/list", "Products:listAll");
$route->post("/", "Products:insert");
$route->put("/{product_id}", "Products:update");
$route->delete("/{product_id}", "Products:delete");

$route->group(null);




$route->group("/products-categories");

$route->get("/list", "ProductsCategories:list");
$route->get("/list/{product_id}", "ProductsCategories:listById");
$route->post("/", "ProductsCategories:insert");

$route->group(null);




$route->group("/faqs");

$route->get("/list", "Faqs\Faqs:listAll");
$route->get("/list/{faqId}", "Faqs\Faqs:listById");
$route->post("/", "Faqs\Faqs:insert");
$route->put("/{faqId}", "Faqs\Faqs:update");

$route->group(null);



$route->group("/faqs-categories");

$route->get("/list", "Faqs\FaqsCategories:list");
$route->get("/list/{categoryId}", "Faqs\FaqsCategories:listById");
$route->post("/", "Faqs\FaqsCategories:insert");

$route->group(null);



$route->group("/users");

$route->post("/register", "Users:registerCrochet");
//$route->post("/login", "Users:authCrochet");
$route->post("/login", "Users:loginGeral");
$route->put("/update", "Users:updateCrochet");
$route->delete("/delete", "Users:deleteCrochet");

$route->post("/register-client", "Users:registerCliente");
$route->post("/login-client", "Users:auth");
$route->put("/update-client", "Users:updateClient");
$route->delete("/delete-client", "Users:deleteClient");

//$route->group(null);


$route->dispatch();


if ($route->error()) {

    header('Content-Type: application/json; charset=UTF-8');

    http_response_code(404);

    echo json_encode([
        "code" => 404,
        "status" => "not_found",
        "message" => "URL não encontrada"
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}

ob_end_flush();