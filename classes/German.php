<?php

class German implements JsonSerializable
{
  private int $id;
  private string $word;
  private string $description;

  /**
   * @param int|null $id
   * @param string|null $word
   * @param string|null $description
   */
  public function __construct(?int $id=null, ?string $word=null, ?string $description=null)
  {
    if (isset($id) && isset($word) && isset($description)){
      $this->id = $id;
      $this->word = $word;
      $this->description = $description;
    }
  }

  public function getObjectById($id): German
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM german WHERE id = :id";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('id', $id);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($row['description'] === null) {
        $row['description'] = '';
      }
      return new German($row['id'], $row['word'], $row['description']);
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  public function jsonSerialize(): array
  {
    return [
      'id' => $this->id,
      'word' => $this->word,
      'description' => $this->description
    ];
  }

  /**
   * @return int
   */
  public function getId(): int
  {
    return $this->id;
  }

  /**
   * @return string
   */
  public function getWord(): string
  {
    return $this->word;
  }

  /**
   * @return string
   */
  public function getDescription(): string
  {
    return $this->description;
  }

}