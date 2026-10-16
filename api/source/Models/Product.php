<?php

namespace Source\Models;

use Source\Core\Connect;

class Product
{
    private ?int $id;
    private ?int $categoryId;
    private ?string $name;
    private ?float $price;
    private ?int $active;
    private ?string $bio;
    private ?int $stock;
    private ?string $photo;

    public function __construct(?int $id = null, ?int $categoryId = null, ?string $name = null, ?float $price = null, ?int $active = null, ?string $bio = null, ?int $stock = null, ?string $photo = null)
    {
        $this->id = $id;
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->price = $price;
        $this->active = $active;
        $this->bio = $bio;
        $this->stock = $stock;
        $this->photo = $photo;
    }

    public function getId(): int
    {
        return $this->id;
    }
    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getCategoryId(): int
    {
        return $this->categoryId;
    }
    public function setCategoryId(int $categoryId): void
    {
        $this->categoryId = $categoryId;
    }

    public function getName(): string
    {
        return $this->name;
    }
    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPrice(): float
    {
        return $this->price;
    }
    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public function getActive(): int
    {
        return $this->active;
    }
    public function setActive(int $active): void
    {
        $this->active = $active;
    }

    public function getBio(): string
    {
        return $this->bio;
    }
    public function setBio(string $bio): void
    {
        $this->bio = $bio;
    }

    public function getStock(): int
    {
        return $this->stock;
    }
    public function setStock(int $stock): void
    {
        $this->stock = $stock;
    }

    public function getPhoto(): string
    {
        return $this->photo;
    }
    public function setPhoto(string $photo): void
    {
        $this->photo = $photo;
    }

    public function listAll (): array
    {
        $query = "SELECT products.*,  products_categories.name as 'category_name'
                  FROM products
                  JOIN products_categories ON products.category_id = products_categories.id";
        $stmt = Connect::getInstance()->query($query);
        return $stmt->fetchAll();
    }

    public function selectById(int $id): object | bool
    {
        $query = "SELECT * FROM products WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return $stmt->fetch();
        }
        return false;
    }

    //category
    public function updateProduct(int $id, object $product): bool
    {
        $query = "UPDATE products SET name = :name, price = :price, category_id = :category_id  WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":name", $product->name);
        $stmt->bindParam(":price", $product->price);
        $stmt->bindParam(":category_id", $product->categoryId);
        $stmt->bindParam(":id", $id);

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

}