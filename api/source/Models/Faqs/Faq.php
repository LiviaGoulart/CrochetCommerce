<?php

namespace Source\Models\Faqs;

use Source\Core\Model;
use Source\Core\Connect;

class Faq extends Model
{
    private ?int $id;
    private ?string $question;
    private ?string $answer;
    private ?int $faqs_category;
    private ?int $active;

    public function __construct(?int $id = null, ?string $question = null, ?string $answer = null, ?int $faqs_category = null, ?int $active = null){
        $this->id = $id;
        $this->question = $question;
        $this->answer = $answer;
        $this->faqs_category = $faqs_category;
        $this->active = $active;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getFaqsCategory(): ?int
    {
        return $this->faqs_category;
    }

    public function setFaqsCategory(int $faqs_category): void
    {
        $this->faqs_category = $faqs_category;
    }

    public function getQuestion(): ?string
    {
        return $this->question;
    }

    public function setQuestion(string $question): void
    {
        $this->question = $question;
    }

    public function getAnswer(): ?string
    {
        return $this->answer;
    }

    public function setAnswer(string $answer): void
    {
        $this->answer = $answer;
    }

    public function getActive(): ?int
    {
        return $this->active;
    }

    public function setActive(int $active): void
    {
        $this->active = $active;
    }

    public function selectAll (array $filters = [], ?string $orderBy = 'id', string $direction = 'ASC'): array
    {
        $query = "SELECT faqs.*, faqs_categories.name AS `category_name`
         FROM faqs JOIN faqs_categories
          ON faqs.faqs_category_id = faqs_categories.id";
        $stmt = Connect::getInstance()->query($query);
        return $stmt->fetchAll();
    }


    public function selectById(int $id): object | bool
    {
        $query = "SELECT faqs.*, faqs_categories.name AS `category_name`
         FROM faqs JOIN faqs_categories
          ON faqs.id = faqs_categories.id
          WHERE faqs.id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        if($stmt->rowCount() > 0){
            return $stmt->fetch();
        }
        return false;
    }


    public function insert() : bool {
        $query = "insert into faqs (question, answer, faqs_category_id, active)
                values (:question, :answer, :faqs_category_id, :active);";

        $conn = Connect::getInstance();
        $stmt = $conn->prepare($query);
        $stmt->bindParam(":question", $this->question);
        $stmt->bindParam(":answer", $this->answer);
        $stmt->bindParam(":faqs_category_id", $this->faqs_category);
        $stmt->bindParam(":active", $this->active);

        if (!$stmt->execute()) {
        return false;
    }
        $this->id = $conn->lastInsertId();
        return true;
    }


    public function update(int $id, object $faq): bool
    {
        $query = "UPDATE faqs SET question = :question, answer = :answer, faqs_category_id = :faqs_category_id WHERE id = :id";
        $stmt = Connect::getInstance()->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":question", $faq->question);
        $stmt->bindParam(":answer", $faq->answer);
        $stmt->bindParam(":faqs_category_id", $faq->faqs_category);

        $stmt->execute();
        return true;
    }

    public function selectJoin(int $id): object|bool {
        $query = "SELECT
                faqs.id,
                faqs.question,
                faqs.answer,
                faqs_categories.name AS category_name
              FROM faqs
              INNER JOIN faqs_categories
                ON faqs.faqs_category_id = faqs_categories.id
              WHERE faqs.id = :id";

        $stmt = Connect::getInstance()->prepare($query);

        $stmt->bindParam(":id", $id);

        $stmt->execute();

        return $stmt->fetch();
    }
}