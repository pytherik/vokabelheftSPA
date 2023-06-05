<?php

class English implements JsonSerializable
{
  private int $id;
  private string $word;
  private string $description;
  private array $translations;

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
    $this->translations = (new German())->getTranslationsById($id);
    }
  }

  public function getTranslationsById($id): array
  {
    $translations = [];
    try {
          $dbh = DBConnect::connect();
          $sql = GET_ENGLISH_TRANSLATIONS;
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

  public function getObjectById($id): English
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM english WHERE id = :id";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('id', $id);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      if ($row['description'] === null) {
        $row['description'] = '';
      }
      return new English($row['id'], $row['word'], $row['description']);
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

  /**
   * @return string
   */
  public function getDescription(): string
  {
    return $this->description;
  }

}