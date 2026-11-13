<?php

namespace Source\Controller;

use Source\Models\Order;

class Orders extends Api
{
    public function create(): void
    {
        if (!$this->authToken(1)) {
            $this->call(401, "error", "Faça login como cliente.", "error")->back();
            return;
        }

        $items = $_POST["items"] ?? [];

        if (!is_array($items) || empty($items)) {
            $this->call(400, "error", "O carrinho está vazio.", "error")->back();
            return;
        }

        $order = new Order();
        $result = $order->create($this->userAuthId, $items);

        if ($result === false) {
            $this->call(400, "error", $order->getErrorMessage(), "error")->back();
            return;
        }

        $this->call(201, "success", "Pedido realizado com sucesso!", "success")
            ->back($result);
    }

    public function list(): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "error", "Acesso permitido somente para crocheteiras.", "error")->back();
            return;
        }

        $order = new Order();
        $result = $order->selectBySeller($this->userAuthId);

        $this->call(200, "success", "Pedidos encontrados.", "success")
            ->back($result);
    }


   
public function updateStatus(array $data): void
{
    if (!$this->authToken(2)) {
        $this->call(401, "error", "Acesso permitido somente para crocheteiras.", "error")->back();
        return;
    }

    $id = (int) ($data["id"] ?? 0);
    $status = $_POST["status"] ?? "";

    if ($id <= 0) {
        $this->call(400, "error", "ID do pedido inválido.", "error")->back();
        return;
    }

    $order = new Order();

    if (!$order->updateStatus($id, $this->userAuthId, $status)) {
        $this->call(400, "error", $order->getErrorMessage(), "error")->back();
        return;
    }

    $this->call(200, "success", "Status do pedido atualizado!", "success")->back();
}



public function listClient(): void
{
    if (!$this->authToken(1)) {
        $this->call(401, "error", "Acesso permitido somente para clientes.", "error")->back();
        return;
    }

    $order = new Order();
    $result = $order->selectByClient($this->userAuthId);

    $this->call(200, "success", "Pedidos encontrados.", "success")
        ->back($result);
}

}
