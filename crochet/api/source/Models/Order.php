<?php

namespace Source\Models;

use Source\Core\Model;
use Source\Core\Connect;

class Product extends Model
{
    private ?int $id;
    private ?int $clienteId;
    private ?int $vendedoraId;
    private ?float $valorTotal;
    private ?string $status;
    private ?string $dataOrder;

    public function __construct(?int $id = null, ?int $clienteId = null, ?int $vendedoraId = null, ?float $valorTotal = null, ?string $status = null, ?string $dataOrder = null){
        $this->id = $id;
        $this->clienteId = $clienteId;
        $this->vendedoraId = $vendedoraId;
        $this->valorTotal = $valorTotal;
        $this->status = $status;
        $this->dataOrder = $dataOrder;

        $this->table = 'orders'; // nome da tabela do banco
        $this->primaryKey = 'id'; // nome da chave primária da tabela
        $this->fillable = ['clienteId', 'vendedoraId', 'valorTotal', 'status', 'dataOrder', 'active']; // camelCase
    }
}