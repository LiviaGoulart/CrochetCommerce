<?php

namespace Source\Models\Store;

use Source\Core\Model;
use Source\Core\Connect;

class Product extends Model
{
    private ?int $id;
    private ?int $usersId;
    private ?int $categoryId;
    private ?string $name;
    private ?float $price;
    private ?int $active;

   

    public function __construct(?int $id = null, ?int $usersId = null, ?int $categoryId = null, ?string $name = null, ?float $price = null, ?int $active = 1)
    {
        $this->id = $id;
        $this->usersId = $usersId;
        $this->categoryId = $categoryId;
        $this->name = $name;
        $this->price = $price;
        $this->active = $active;

        $this->table = 'products'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['usersId', 'categoryId', 'name', 'price', 'active']; // camelCase
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getUsersId(): ?int
    {
        return $this->usersId;
    }

    public function setUsersId(int $usersId): void
    {
        $this->usersId = $usersId;
    }

    public function getCategoryId(): ?int
    {
        return $this->categoryId;
    }

    public function setCategoryId(int $categoryId): void
    {
        $this->categoryId = $categoryId;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getPrice(): ?float
    {
        return $this->price;
    }

    public function setPrice(float $price): void
    {
        $this->price = $price;
    }

    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(int $active): void
    {
        $this->active = $active;
    }

    public function listAll(array $filters = [], ?string $orderBy = 'id', string $direction = 'ASC') : array {
        try {
            $query = "SELECT * FROM {$this->table}";
            if (!empty($filters)) {
                $query .= " WHERE ";
                foreach ($filters as $index => $filter) {
                    $query .= $filter;
                    if ($index < count($filters) - 1) {
                        $query .= " AND ";
                    }
                }
            }
            $stmt = Connect::getInstance()->prepare($query);
            $stmt->execute();
            return $stmt->fetchAll();
        } catch (PDOException $e) {
            $this->errorMessage = $e->getMessage();
            return [];
        }
    }


//    public function insert() : bool {
//     $query = ""
//    }

}