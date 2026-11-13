<?php

namespace Source\Models;

use PDO;
use Source\Core\Model;
use Source\Core\Connect;
use Source\Core\JWTToken;


class User extends Model
{
    private ?int $id;
    private ?int $typeId;
    private ?string $name;
    private ?string $email;
    private ?string $password;
    private ?string $bio;
    private ?string $address;
    private ?int $active;

    
    private ?string $storeName;
    private ?string $artName;
    private ?string $cpf;
    private ?string $phone;
    private ?string $instagram;
    private ?string $photo;

    private ?string $token = null;

    public function __construct(?int $id = null, ?int $typeId = null, ?string $name = null, ?string $email = null, ?string $password = null, ?string $bio = null, ?string $address = null, ?int $active = null, ?string $storeName = null, ?string $artName = null, ?string $cpf = null, ?string $phone = null, ?string $instagram = null, ?string $photo = null)
    {
        $this->id = $id;
        $this->typeId = $typeId;
        $this->name = $name;
        $this->email = $email;
        $this->password = $password;
        $this->bio = $bio;
        $this->address = $address;
        $this->active = $active;

        $this->storeName = $storeName;
        $this->artName = $artName;
        $this->cpf = $cpf;
        $this->phone = $phone;
        $this->instagram = $instagram;
        $this->photo = $photo;

        $this->table = 'users'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['typeId', 'name', 'email', 'password', 'bio', 'address', 'active', 'storeName', 'artName', 'cpf', 'phone', 'instagram', 'photo']; // camelCase
        
    }

    public function getId(): ?int
    {
        return $this->id;
    }
    public function setId(?int $id): void
    {
        $this->id = $id;
    }

    public function getTypeId(): ?int
    {
        return $this->typeId;
    }
    public function setTypeId(?int $typeId): void
    {
        $this->typeId = $typeId;
    }

    public function getName(): ?string
    {
        return $this->name;
    }
    public function setName(?string $name): void
    {
        $this->name = $name;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }
    public function setEmail(?string $email): void
    {
        $this->email = $email;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }
    public function setPassword(?string $password): void
    {
        $this->password = $password;
    }

     public function getBio(): ?string
    {
        return $this->bio;
    }
    public function setBio(?string $bio): void
    {
        $this->bio = $bio;
    }

    public function getAddress(): ?string
    {
        return $this->address;
    }
    public function setAddress(?string $address): void
    {
        $this->address = $address;
    }

    public function getActive(): ?int
{
    return $this->active;
}

public function setActive($active): User
{
    $this->active = ($active === null) ? null : (int) $active;
    return $this;
}

    public function getStoreName(): ?string
    {
        return $this->storeName;
    }
    public function setStoreName(?string $storeName): void
    {
        $this->storeName = $storeName;
    }

    public function getArtName(): ?string
    {
        return $this->artName;
    }
    public function setArtName(?string $artName): void
    {
        $this->artName = $artName;
    }

    public function getCpf(): ?int
    {
        return $this->cpf;
    }
    public function setCpf(?int $cpf): void
    {
        $this->cpf = $cpf;
    }

    public function getPhone(): ?int
    {
        return $this->phone;
    }
    public function setPhone(?int $phone): void
    {
        $this->phone = $phone;
    }

    public function getInstagram(): ?string
    {
        return $this->instagram;
    }
    public function setInstagram(?string $instagram): void
    {
        $this->instagram = $instagram;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }
    public function setPhoto(?string $photo): void
    {
        $this->photo = $photo;
    }


    public function getToken(): ?string
    {
        return $this->token;
    }

    public function insert (): bool
    {
        $query = "SELECT * FROM {$this->table} WHERE email = :email";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":email", $this->email);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            $this->errorMessage = "Email já cadastrado";
            return false;
        }
        $this->password = password_hash($this->password, PASSWORD_DEFAULT);

        if(!parent::insert()){
            $this->errorMessage = "Algo deu errado";
            return false;
        }
        return true;
    }


    public function login(string $email, string $password, ?int $typeId = null): bool
{
    $query = "SELECT * FROM {$this->table} WHERE email = :email";

    if ($typeId !== null) {
        $query .= " AND type_id = :typeId";
    }

    $stmt = Connect::getInstance()->prepare($query);
    $stmt->bindParam(":email", $email);

    if ($typeId !== null) {
        $stmt->bindParam(":typeId", $typeId, PDO::PARAM_INT);
    }

    $stmt->execute();

    if ($stmt->rowCount() == 0) {
        $this->errorMessage = "Email não cadastrado";
        return false;
    }

    $user = $stmt->fetch();

    if (isset($user->active) && (int) $user->active === 0) {
    $this->errorMessage = "Esta conta está desativada.";
    return false;
}

    if (!password_verify($password, $user->password)) {
        $this->errorMessage = "Senha incorreta";
        return false;
    }

    $this->id = $user->id;
    $this->typeId = $user->type_id;
    $this->name = $user->name;
    $this->email = $user->email;
    $this->bio = $user->bio ?? null;
    $this->address = $user->address ?? null;
    $this->active = $user->active ?? null;
    $this->storeName = $user->storeName ?? null;
    $this->artName = $user->artName ?? null;
    $this->cpf = $user->cpf ?? null;
    $this->phone = $user->phone ?? null;
    $this->instagram = $user->instagram ?? null;

    $jwt = new JWTToken();

    $this->token = $jwt->encode([
        "id" => $user->id,
        "name" => $user->name,
        "email" => $user->email
    ]);

    return true;
}

    public function permissionVerify (string $email, $typeId): bool
    {
        $query = "SELECT * FROM {$this->table} WHERE email = :email AND type_id = :typeId";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":typeId", $typeId);
        $stmt->execute();
        if($stmt->rowCount() == 0) {
            return false;
        }
        return true;
    }

    public function updatePhoto(int $userId, string $photo): bool
    {
        $query = "UPDATE {$this->table} SET photo = :photo WHERE id = :id";

        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindValue(":photo", $photo);
        $stmt->bindValue(":id", $userId, PDO::PARAM_INT);

        if (!$stmt->execute()) {
            $this->errorMessage = "Não foi possível atualizar a foto.";
            return false;
        }

        $this->photo = $photo;

        return true;
    }

    private function deletePreviousPhoto(?string $oldPhoto, string $uploadDirectory): void
    {
        if (empty($oldPhoto)) {
            return;
        }

        $oldFilename = basename($oldPhoto);
        $oldPath = $uploadDirectory . DIRECTORY_SEPARATOR . $oldFilename;

        if (is_file($oldPath)) {
            unlink($oldPath);
        }
    }


public function deleteById(int $userId): bool
{
    try {
        $db = Connect::getInstance();

        $db->beginTransaction();

        // Desativar os produtos da crocheteira
        $stmt = $db->prepare(
            "UPDATE products SET active = 0 WHERE users_id = :id"
        );

        $stmt->execute([":id" => $userId]);

        // Desativar a conta
        $stmt = $db->prepare(
            "UPDATE users SET active = 0 WHERE id = :id AND type_id = 2"
        );

        $stmt->execute([":id" => $userId]);

        if ($stmt->rowCount() === 0) {
            $db->rollBack();
            $this->errorMessage = "Conta não encontrada ou já desativada.";
            return false;
        }

        $db->commit();

        return true;

    } catch (\Throwable $e) {
        if (isset($db) && $db->inTransaction()) {
            $db->rollBack();
        }

        $this->errorMessage = $e->getMessage();
        return false;
    }
}


}