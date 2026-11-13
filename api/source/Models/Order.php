<?php

namespace Source\Models;

use Source\Core\Connect;
use PDO;
use Throwable;

class Order
{
    private ?string $errorMessage = null;

    public function getErrorMessage(): ?string
    {
        return $this->errorMessage;
    }

    public function create(int $clientId, array $items): array|false
    {
        $db = Connect::getInstance();

        try {
            if (!$db) {
                throw new \Exception("Não foi possível conectar ao banco.");
            }

            $groupedItems = [];

            foreach ($items as $item) {
                $productId = (int) ($item["product_id"] ?? 0);
                $quantity = (int) ($item["quantidade"] ?? 0);

                if ($productId <= 0 || $quantity <= 0) {
                    throw new \Exception("Produto ou quantidade inválida.");
                }

                $stmt = $db->prepare(
                    "SELECT id, users_id, name, price
                     FROM products
                     WHERE id = :id AND active = 1"
                );
                $stmt->execute([":id" => $productId]);
                $product = $stmt->fetch(PDO::FETCH_ASSOC);

                if (!$product) {
                    throw new \Exception("Um produto não está mais disponível.");
                }

                $sellerId = (int) $product["users_id"];

                if (!isset($groupedItems[$sellerId])) {
                    $groupedItems[$sellerId] = [];
                }

                $groupedItems[$sellerId][] = [
                    "product_id" => $productId,
                    "price" => (float) $product["price"],
                    "quantidade" => $quantity
                ];
            }

            $createdOrders = [];

            $db->beginTransaction();

            foreach ($groupedItems as $sellerId => $sellerItems) {
                $total = 0;

                foreach ($sellerItems as $item) {
                    $total += $item["price"] * $item["quantidade"];
                }

                $stmt = $db->prepare(
                    "INSERT INTO orders
                    (users_id, cliente_id, vendedora_id, total_price, status, date_order)
                    VALUES
                    (:users_id, :cliente_id, :vendedora_id, :total_price, 'Pendente', NOW())"
                );

                $stmt->execute([
                    ":users_id" => $sellerId,
                    ":cliente_id" => (string) $clientId,
                    ":vendedora_id" => (string) $sellerId,
                    ":total_price" => $total
                ]);

                $orderId = (int) $db->lastInsertId();

                foreach ($sellerItems as $item) {
                    $stmt = $db->prepare(
                        "INSERT INTO itens_orders
                        (products_id, orders_id, price, quantidade)
                        VALUES
                        (:product_id, :order_id, :price, :quantidade)"
                    );

                    $stmt->execute([
                        ":product_id" => $item["product_id"],
                        ":order_id" => $orderId,
                        ":price" => $item["price"],
                        ":quantidade" => $item["quantidade"]
                    ]);
                }

                $createdOrders[] = [
                    "id" => $orderId,
                    "vendedora_id" => $sellerId,
                    "total_price" => $total,
                    "status" => "Pendente"
                ];
            }

            $db->commit();

            return $createdOrders;

        } catch (Throwable $e) {
            if ($db && $db->inTransaction()) {
                $db->rollBack();
            }

            $this->errorMessage = $e->getMessage();
            return false;
        }
    }

    public function selectBySeller(int $sellerId): array
    {
        try {
            $query = "SELECT
                        o.id,
                        o.cliente_id,
                        o.total_price,
                        o.status,
                        o.date_order,
                        u.name AS cliente_nome,
                        u.email AS cliente_email,
                        io.products_id,
                        io.price,
                        io.quantidade,
                        p.name AS produto_nome,
                        p.photo AS produto_foto
                      FROM orders o
                      LEFT JOIN users u
                        ON u.id = o.cliente_id
                      LEFT JOIN itens_orders io
                        ON io.orders_id = o.id
                      LEFT JOIN products p
                        ON p.id = io.products_id
                      WHERE o.vendedora_id = :seller_id
                      ORDER BY o.date_order DESC, o.id DESC";

            $stmt = Connect::getInstance()->prepare($query);
            $stmt->execute([":seller_id" => (string) $sellerId]);

            $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $orders = [];

            foreach ($rows as $row) {
                $id = (int) $row["id"];

                if (!isset($orders[$id])) {
                    $orders[$id] = [
                        "id" => $id,
                        "cliente_id" => $row["cliente_id"],
                        "cliente_nome" => $row["cliente_nome"],
                        "cliente_email" => $row["cliente_email"],
                        "total_price" => (float) $row["total_price"],
                        "status" => $row["status"],
                        "date_order" => $row["date_order"],
                        "items" => []
                    ];
                }

                if ($row["products_id"] !== null) {
                    $orders[$id]["items"][] = [
                        "product_id" => (int) $row["products_id"],
                        "produto_nome" => $row["produto_nome"],
                        "produto_foto" => $row["produto_foto"],
                        "price" => (float) $row["price"],
                        "quantidade" => (int) $row["quantidade"]
                    ];
                }
            }

            return array_values($orders);

        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return [];
        }
    }



public function updateStatus(int $orderId, int $sellerId, string $newStatus): bool
{
    $allowedStatuses = [
        "Em Confecção",
        "Enviado",
        "Concluído"
    ];

    if (!in_array($newStatus, $allowedStatuses, true)) {
        $this->errorMessage = "Status inválido.";
        return false;
    }

    try {
        $db = Connect::getInstance();

        $stmt = $db->prepare(
            "SELECT status FROM orders
             WHERE id = :id AND vendedora_id = :seller_id"
        );

        $stmt->execute([
            ":id" => $orderId,
            ":seller_id" => (string) $sellerId
        ]);

        $order = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$order) {
            $this->errorMessage = "Pedido não encontrado.";
            return false;
        }

        $transitions = [
            "Pendente" => "Em Confecção",
            "Em Confecção" => "Enviado",
            "Enviado" => "Concluído"
        ];

        $currentStatus = $order["status"];

        if (
            !isset($transitions[$currentStatus]) ||
            $transitions[$currentStatus] !== $newStatus
        ) {
            $this->errorMessage = "Não é possível realizar essa alteração de status.";
            return false;
        }

        $stmt = $db->prepare(
            "UPDATE orders
             SET status = :status
             WHERE id = :id AND vendedora_id = :seller_id"
        );

        return $stmt->execute([
            ":status" => $newStatus,
            ":id" => $orderId,
            ":seller_id" => (string) $sellerId
        ]);

    } catch (\Throwable $e) {
        $this->errorMessage = $e->getMessage();
        return false;
    }
}



public function selectByClient(int $clientId): array
{
    try {
        $query = "SELECT
                    o.id, o.total_price, o.status, o.date_order,
                    s.name AS vendedora_nome,
                    s.store_name AS loja_nome,
                    io.products_id, io.price, io.quantidade,
                    p.name AS produto_nome, p.photo AS produto_foto
                  FROM orders o
                  LEFT JOIN users s ON s.id = o.vendedora_id
                  LEFT JOIN itens_orders io ON io.orders_id = o.id
                  LEFT JOIN products p ON p.id = io.products_id
                  WHERE o.cliente_id = :client_id
                  ORDER BY o.date_order DESC, o.id DESC";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->execute([":client_id" => (string) $clientId]);

        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $orders = [];

        foreach ($rows as $row) {
            $id = (int) $row["id"];

            if (!isset($orders[$id])) {
                $orders[$id] = [
                    "id" => $id,
                    "total_price" => (float) $row["total_price"],
                    "status" => $row["status"],
                    "date_order" => $row["date_order"],
                    "vendedora_nome" => $row["loja_nome"] ?: $row["vendedora_nome"],
                    "items" => []
                ];
            }

            if ($row["products_id"] !== null) {
                $orders[$id]["items"][] = [
                    "product_id" => (int) $row["products_id"],
                    "produto_nome" => $row["produto_nome"],
                    "produto_foto" => $row["produto_foto"],
                    "price" => (float) $row["price"],
                    "quantidade" => (int) $row["quantidade"]
                ];
            }
        }

        return array_values($orders);

    } catch (\Throwable $e) {
        $this->errorMessage = $e->getMessage();
        return [];
    }
}

}
