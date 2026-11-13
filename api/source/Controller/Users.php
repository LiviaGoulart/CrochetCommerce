<?php

namespace Source\Controller;

use Source\Models\User;
use Source\Support\Upload;

class Users extends Api
{

    //registro CROCHETEIRA
    public function registerCrochet (array $data): void
    {

    $data = $_POST;
    
        if(!isset($data['password']) || empty($data['password'])) {
            $this->call(400,
                "bad_request",
                "A senha é obrigatória.",
                "error")->back();
            return;
        }

        if(!$this->validateNameEmail($data)){
            $this->call(400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
                "error")->back();
            return;
        }

        $user = new User(
            null,
            2,
            $data['name'],
            $data['email'],
            $data['password']
        );

        if(!$user->insert()) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail()
        ];

        $this->call(201,"success","Usuário inserido com sucesso","created")->back($response);
    }


    //registro CLIENTE
    public function registerCliente (array $data): void
    {
        $data = $_POST;

        if(!isset($data['password']) || empty($data['password'])) {
            $this->call(400,
                "bad_request",
                "A senha é obrigatória.",
                "error")->back();
            return;
        }

        if(!$this->validateNameEmail($data)){
            $this->call(400,
                "bad_request",
                "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
                "error")->back();
            return;
        }

        $user = new User(
            null,
            1,
            $data['name'],
            $data['email'],
            $data['password']
        );

        if(!$user->insert()) {
            $this->call(500, "internal_server_error", $user->getErrorMessage(), "error")->back();
            return;
        }

        $response = [
            "id" => $user->getId(),
            "name" => $user->getName(),
            "email" => $user->getEmail()
        ];

        $this->call(201,"success","Usuário inserido com sucesso","created")->back($response);
    }

   


public function loginGeral(array $data): void
{
    $jsonData = json_decode(file_get_contents("php://input"), true) ?? [];
    $data = array_merge($data, $jsonData);

    if (
        !isset($data['email'], $data['password']) ||
        empty(trim($data['email'])) ||
        empty($data['password']) ||
        !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
    ) {
        $this->call(
            400,
            "bad_request",
            "E-mail e senha são obrigatórios. O e-mail deve ser válido.",
            "error"
        )->back();

        return;
    }

    $user = new User();

    if (!$user->login($data['email'], $data['password'])) {
        $this->call(
            401,
            "unauthorized",
            $user->getErrorMessage(),
            "error"
        )->back();

        return;
    }

    $response = [
        "id" => $user->getId(),
        "name" => $user->getName(),
        "email" => $user->getEmail(),
        "token" => $user->getToken(),
        "typeId" => $user->getTypeId()
    ];

    $this->call(
        200,
        "success",
        "Usuário logado com sucesso",
        "success"
    )->back($response);
}


    
public function auth(array $data): void
{
    $jsonData = json_decode(file_get_contents("php://input"), true) ?? [];
    $data = array_merge($data, $jsonData);

    if (
        !isset($data['email'], $data['password']) ||
        empty(trim($data['email'])) ||
        empty($data['password']) ||
        !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
    ) {
        $this->call(
            400,
            "bad_request",
            "E-mail e senha são obrigatórios. O e-mail deve ser válido.",
            "error"
        )->back();

        return;
    }

    $user = new User();

    if (!$user->login($data['email'], $data['password'], 1)) {
        $this->call(
            401,
            "unauthorized",
            $user->getErrorMessage(),
            "error"
        )->back();

        return;
    }

    $response = [
        "id" => $user->getId(),
        "name" => $user->getName(),
        "email" => $user->getEmail(),
        "typeId" => $user->getTypeId(),
        "token" => $user->getToken()
    ];

    $this->call(
        200,
        "success",
        "Usuário logado com sucesso",
        "success"
    )->back($response);
}


    public function authCrochet (array $data): void
    {

    $jsonData = json_decode(file_get_contents("php://input"), true) ?? [];
    $data = array_merge($data, $jsonData);

        if(!isset($data['email'], $data['password']) ||
            empty($data['email']) || empty($data['password']) ||
            !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            $this->call(
                400,
                "bad_request",
                "E-mail e senha são obrigatórios. O e-mail deve ser válido.",
                "error")->back();
            return;
        }

        $user = new User();
        if(!$user->login($data['email'], $data['password'], 2)) {
            $this->call(
                401,
                "unauthorized",
                $user->getErrorMessage(),
                "error")->back();
            return;
        }

        $response = [
        "id" => $user->getId(),
        "name" => $user->getName(),
        "email" => $user->getEmail(),
        "typeId" => 2,
        "token" => $user->getToken()
    ];


        $this->call(
            200,
            "success",
            "Usuário logado com sucesso",
            "success")->back($response);
    }

   
    public function updateCrochet(array $data): void
{
    $data = json_decode(file_get_contents("php://input"), true) ?? [];

    if (!$this->authToken(2)) {
        $this->call(
            401,
            "unauthorized",
            "Usuário não está autenticado.",
            "error"
        )->back();

        return;
    }

    if (
        !isset($data['name'], $data['email']) ||
        empty(trim($data['name'])) ||
        empty(trim($data['email'])) ||
        !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
    ) {
        $this->call(
            400,
            "bad_request",
            "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
            "error"
        )->back();

        return;
    }

   $user = new User(
    id: null,
    typeId: 2,
    storeName: trim($data['storeName']),
    artName: trim($data['artName']),
    cpf: isset($data['cpf']) ? (int) $data['cpf'] : null,
    phone: isset($data['phone']) ? (int) $data['phone'] : null,
    email: $data['email'] ?? null,
    address: $data['address'] ?? null,
    instagram: $data['instagram'] ?? null,
    bio: $data['bio'] ?? null
);

    if (!$user->updateById($this->userAuthId)) {
        $this->call(
            500,
            "internal_server_error",
            $user->getErrorMessage(),
            "error"
        )->back();

        return;
    }

    $response = [
        "id" => $this->userAuthId,
        "storeName" => $user->getStoreName(),
        "artName" => $user->getArtName(),
        "cpf" => $user-> getCpf(),
        "phone" => $user->getPhone(),
        "email" => $user->getEmail(),
        "address" => $user->getAddress(),
        "instagram" => $user->getInstagram(),
        "bio" => $user->getBio()
        
    ];

    $this->call(
        200,
        "success",
        "Crocheteira atualizada com sucesso.",
        "success"
    )->back($response);
}


public function updateClient(array $data): void
{
    $data = json_decode(file_get_contents("php://input"), true) ?? [];
    
    if (!$this->authToken(1)) {
        $this->call(
            401,
            "unauthorized",
            "Usuário não está autenticado (sem token ou token inválido).",
            "error"
        )->back();

        return;
    }

    if (
        !isset($data['name'], $data['email']) ||
        empty(trim($data['name'])) ||
        empty(trim($data['email'])) ||
        !filter_var($data['email'], FILTER_VALIDATE_EMAIL)
    ) {
        $this->call(
            400,
            "bad_request",
            "Nome e e-mail são obrigatórios. O e-mail deve ser válido.",
            "error"
        )->back();

        return;
    }

    $user = new User(
        null,
        1,
        trim($data['name']),
        trim($data['email']),
        $data['password'] ?? "",
        $data['bio'] ?? null,
        $data['address'] ?? null
    );

    if (!$user->updateById($this->userAuthId)) {
        $this->call(
            500,
            "internal_server_error",
            $user->getErrorMessage(),
            "error"
        )->back();

        return;
    }

    $response = [
        "id" => $this->userAuthId,
        "name" => $user->getName(),
        "email" => $user->getEmail(),
        "token" => $user->getToken(),
        "bio" => $user->getBio(),
        "address" => $user->getAddress()
    ];

    $this->call(
        200,
        "success",
        "Cliente atualizado com sucesso",
        "success"
    )->back($response);
}



public function deleteCrochet(array $data): void
{
    if (!$this->authToken(2)) {
        $this->call(
            401,
            "unauthorized",
            "Usuário não está autenticado.",
            "error"
        )->back();

        return;
    }

    $user = new User();

    if (!$user->deleteById($this->userAuthId)) {
        $this->call(
            500,
            "internal_server_error",
            "Não foi possível excluir a conta.",
            "error"
        )->back();

        return;
    }

    $this->call(
        200,
        "success",
        "Conta excluída com sucesso.",
        "success"
    )->back();
}


public function deleteClient(array $data): void
{
    if (!$this->authToken(1)) {
        $this->call(
            401,
            "unauthorized",
            "Usuário não está autenticado.",
            "error"
        )->back();

        return;
    }

    $user = new User();

    if (!$user->deleteById($this->userAuthId)) {
        $this->call(
            500,
            "internal_server_error",
            "Não foi possível excluir a conta.",
            "error"
        )->back();

        return;
    }

    $this->call(
        200,
        "success",
        "Conta excluída com sucesso.",
        "success"
    )->back();
}
    

    // Valida somente Nome e Email, mas pode ser alterada para validar mais campos
    private function validateNameEmail(array $data): bool
    {
        if(!isset($data["name"],$data["email"]) ||
            empty($data["name"]) || empty($data["email"]) ||
            !filter_var($data["email"], FILTER_VALIDATE_EMAIL)) {
            return false;
        }
        return true;
    }

        public function uploadPhoto (array $data): void
    {
        if (!$this->authToken(2)) {
            $this->call(401, "unauthorized", "Usuário não está autenticado (sem token ou token inválido).", "error")->back();
            return;
        }

        if (!isset($_FILES["photo"]) || !is_array($_FILES["photo"])) {
            $this->call(400, "bad_request", "Selecione uma imagem para enviar.", "error")->back();
            return;
        }

        $user = new User();
        if (!$user->selectById($this->userAuthId)) {
            $this->call(404, "not_found", "Perfil não encontrado.", "error")->back();
            return;
        }
        $oldPhoto = $user->getPhoto();

        $uploadDirectory = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "users";
        $uploader = new Upload($uploadDirectory);
        try {
            $filename = $uploader->image($_FILES["photo"]);
        } catch (\RuntimeException $exception) {
            $this->call(400, "bad_request", $exception->getMessage(), "error")->back();
            return;
        }

        $photoPath = "uploads/users/" . $filename;
        // $photoUrl = $this->photoUrl($photoPath);
        $photoUrl = "http://localhost/crochet/" . $photoPath;
        if (!$user->updatePhoto($this->userAuthId, $photoPath)) {
            $savedPath = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;
            if (is_file($savedPath) && !unlink($savedPath)) {
                error_log("Não foi possível remover a foto enviada após falha ao atualizar o perfil.");
            }
            $this->call(500, "internal_server_error", $user->getErrorMessage() ?? "Não foi possível atualizar a foto.", "error")->back();
            return;
        }

        // $this->deletePreviousPhoto($oldPhoto, $uploadDirectory);

        $this->call(200, "success", "Foto atualizada com sucesso.", "success")->back([
            "photo" => $photoUrl,
        ]);
    }




     public function uploadPhotoClient (array $data): void
    {
        if (!$this->authToken(1)) {
            $this->call(401, "unauthorized", "Usuário não está autenticado (sem token ou token inválido).", "error")->back();
            return;
        }

        if (!isset($_FILES["photo"]) || !is_array($_FILES["photo"])) {
            $this->call(400, "bad_request", "Selecione uma imagem para enviar.", "error")->back();
            return;
        }

        $user = new User();
        if (!$user->selectById($this->userAuthId)) {
            $this->call(404, "not_found", "Perfil não encontrado.", "error")->back();
            return;
        }
        $oldPhoto = $user->getPhoto();

        $uploadDirectory = dirname(__DIR__, 3) . DIRECTORY_SEPARATOR . "uploads" . DIRECTORY_SEPARATOR . "users";
        $uploader = new Upload($uploadDirectory);
        try {
            $filename = $uploader->image($_FILES["photo"]);
        } catch (\RuntimeException $exception) {
            $this->call(400, "bad_request", $exception->getMessage(), "error")->back();
            return;
        }

        $photoPath = "uploads/users/" . $filename;
        // $photoUrl = $this->photoUrl($photoPath);
        $photoUrl = "http://localhost/crochet/" . $photoPath;
        if (!$user->updatePhoto($this->userAuthId, $photoPath)) {
            $savedPath = $uploadDirectory . DIRECTORY_SEPARATOR . $filename;
            if (is_file($savedPath) && !unlink($savedPath)) {
                error_log("Não foi possível remover a foto enviada após falha ao atualizar o perfil.");
            }
            $this->call(500, "internal_server_error", $user->getErrorMessage() ?? "Não foi possível atualizar a foto.", "error")->back();
            return;
        }

        // $this->deletePreviousPhoto($oldPhoto, $uploadDirectory);

        $this->call(200, "success", "Foto atualizada com sucesso.", "success")->back([
            "photo" => $photoUrl,
        ]);
    }
}