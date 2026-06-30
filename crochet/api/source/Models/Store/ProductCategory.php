<?php

namespace Source\Models\Store;

use Source\Core\Model;
use Source\Core\Connect;

class ProductCategory extends Model
{
    private ?int $id;
    private ?string $name;
    private ?int $active;


    public function __construct(?int $id = null, ?string $name = null, ?int $active = null){
        $this->id = $id;
        $this->name = $name;
        $this->active = $active; 

        $this->table = 'products_categories'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['id', 'name', 'active']; // camelCase
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }

    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(int $active): void
    {
        $this->active = $active;
    }


    public function getAll () : array {
       
        $query = "SELECT id, name, active FROM products_categories";
        $conn = Connect::getInstance();
        $stmt = $conn->query($query);

        if(!$stmt){
        var_dump($conn->errorInfo());
        die();
    }
        return $stmt->fetchAll();
    }

    public function selectById(int $id): object | bool
    {
        $query = "SELECT * FROM products_categories WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return $stmt->fetch();
        }
        return false;
    }

    public function insert() : bool {
        $query = "INSERT INTO products_categories (name) values (:name)";
        $conn = Connect::getInstance();
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":name", $this->name);

        if (!$stmt->execute()) {
        return false;
    }
        $this->id = $conn->lastInsertId();

        return true;
    }
}