<?php

namespace Source\Models;

use Source\Core\Connect;
use PDO;
use Throwable;

class Product
{
    private ?int $id;
    private ?int $usersId;
    private ?int $categoryId;
    private ?string $name;
    private ?float $price;
    private ?int $active;
    private ?string $bio;
    private ?int $stock;
    private ?string $photo;
    private ?string $errorMessage = null;

    public function __construct(
        ?int $id = null,
        ?int $usersId = null,
        ?int $categoryId = null,
        ?string $name = null,
        ?float $price = null,
        ?int $active = 1,
        ?string $bio = null,
        ?int $stock = null,
        ?string $photo = null
    ) {
        $this->id = $id;
        $this->usersId = $usersId;
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->price = $price;
        $this->active = $active;
        $this->bio = $bio;
        $this->stock = $stock;
        $this->photo = $photo;
    }

    public function getId(): ?int 
    {
         return $this->id; 
    }
    public function getUsersId(): ?int
    { 
        return $this->usersId; 
    }
    public function getCategoryId(): ?int 
    { 
        return $this->categoryId; 
    }
    public function getName(): ?string 
    { 
        return $this->name; 
    }
    public function getPrice(): ?float 
    { return $this->price; }

    public function getActive(): ?int 
    { return $this->active; }

    public function getBio(): ?string 
    { return $this->bio; }

    public function getStock(): ?int 
    { return $this->stock; }

    public function getPhoto(): ?string 
    { return $this->photo; }

    public function getErrorMessage(): ?string 
    { return $this->errorMessage; }


    public function setId(int $id): void 
    { $this->id = $id; }

    public function setUsersId(int $usersId): void 
    { $this->usersId = $usersId; }

    public function setCategoryId(int $categoryId): void 
    { $this->categoryId = $categoryId; }

    public function setName(string $name): void 
    { $this->name = $name; }

    public function setPrice(float $price): void 
    { $this->price = $price; }

    public function setActive(int $active): void 
    { $this->active = $active; }

    public function setBio(?string $bio): void 
    { $this->bio = $bio; }

    public function setStock(?int $stock): void 
    { $this->stock = $stock; }

    public function setPhoto(?string $photo): void 
    { $this->photo = $photo; }


    public function insert(): bool
    {
        try {

            $query = "INSERT INTO products
                (users_id, category_id, name, price, active, bio, stock, photo)
                VALUES
                (:users_id, :category_id, :name, :price, :active, :bio, :stock, :photo)";

            $stmt = Connect::getInstance()->prepare($query);
            $stmt->execute([
                ":users_id" => $this->usersId,
                ":category_id" => $this->categoryId,
                ":name" => $this->name,
                ":price" => $this->price,
                ":active" => $this->active ?? 1,
                ":bio" => $this->bio,
                ":stock" => $this->stock,
                ":photo" => $this->photo
            ]);

            $this->id = (int) Connect::getInstance()->lastInsertId();
            return $this->id > 0;
        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return false;
        }
    }

    public function selectAll(): array
    {
        try {
            $query = "SELECT * FROM products ORDER BY id DESC";
            return Connect::getInstance()->query($query)->fetchAll(PDO::FETCH_ASSOC);
        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return [];
        }
    }


    public function selectByUserId(int $usersId): array
    {
        try {
            $query = "SELECT * FROM products
                    WHERE users_id = :users_id
                    ORDER BY id DESC";

            $stmt = Connect::getInstance()->prepare($query);
            $stmt->execute([
                ":users_id" => $usersId
            ]);

            return $stmt->fetchAll(PDO::FETCH_ASSOC);

        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return [];
        }
    }

public function selectStore(): array
{
    try {
        $query = "SELECT 
                    products.*,
                    users.store_name AS storeName
                  FROM products
                  INNER JOIN users ON products.users_id = users.id
                  WHERE products.active = 1
                  ORDER BY products.id DESC";

        return Connect::getInstance()
            ->query($query)
            ->fetchAll(PDO::FETCH_ASSOC);

    } catch (Throwable $e) {
        $this->errorMessage = $e->getMessage();
        return [];
    }
}


    public function selectById(int $id): bool
    {
        try {
            $stmt = Connect::getInstance()->prepare(
                "SELECT * FROM products WHERE id = :id"
            );
            $stmt->execute([":id" => $id]);
            $product = $stmt->fetch(PDO::FETCH_ASSOC);

            if (!$product) {
                return false;
            }

            $this->id = (int) $product["id"];
            $this->usersId = (int) $product["users_id"];
            $this->categoryId = (int) $product["category_id"];
            $this->name = $product["name"];
            $this->price = (float) $product["price"];
            $this->active = (int) $product["active"];
            $this->bio = $product["bio"];
            $this->stock = $product["stock"] !== null ? (int) $product["stock"] : null;
            $this->photo = $product["photo"];

            return true;
        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return false;
        }
    }

    public function updateById(int $id): bool
    {
        try {
            $query = "UPDATE products
                      SET category_id = :category_id,
                          name = :name,
                          price = :price
                      WHERE id = :id AND active = 1";

            $stmt = Connect::getInstance()->prepare($query);
            $stmt->execute([
                ":category_id" => $this->categoryId,
                ":name" => $this->name,
                ":price" => $this->price,
                ":id" => $id
            ]);

            if ($stmt->rowCount() > 0) {
                $this->id = $id;
                return true;
            }

            // Diferencia produto inexistente de dados sem alterações.
            return $this->selectById($id);
        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return false;
        }
    }

    public function softDeleteById(int $id): bool
    {
        try {
            $stmt = Connect::getInstance()->prepare(
                "UPDATE products SET active = 0 WHERE id = :id AND active = 1"
            );
            $stmt->execute([":id" => $id]);

            return $stmt->rowCount() > 0;
        } catch (Throwable $e) {
            $this->errorMessage = $e->getMessage();
            return false;
        }
    }
}
