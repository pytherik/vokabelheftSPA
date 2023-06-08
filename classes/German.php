<?php

class German implements JsonSerializable
{
  private int $id;
  private string $word;
  private array $translations;

  /**
   * @param int|null $id
   * @param string|null $word
   */
  public function __construct(?int $id=null, ?string $word=null)
  {
    if (isset($id) && isset($word) && isset($description)){
      $this->id = $id;
      $this->word = $word;
      $this->translations = (new English())->getTranslationsById($id);
    }
  }

  public function getTranslationsById($id): array
  {
    $translations = [];
    try {
      $dbh = DBConnect::connect();
      $sql = GET_GERMAN_TRANSLATIONS;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('id', $id);
      $stmt->execute();
      while ($row = $stmt->fetch(PDO::FETCH_NUM)) {
        $translations[] = $row[0];
      }
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
    return $translations;
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
      return new German($row['id'], $row['word']);
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  public function jsonSerialize(): array
  {
    return get_object_vars($this);
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

}