<?php

class German implements JsonSerializable
{
  private int $id;
  private string $word;
  private array $translations;
  private string $wordclass;

  /**
   * @param int|null $id
   * @param string|null $word
   */
  public function __construct(?int $id=null, ?string $word=null)
  {
    if (isset($id) && isset($word)){
      $this->id = $id;
      $this->word = $word;
      $this->translations = (new English())->getTranslationsById($id);
      $this->wordclass = '';
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

  public function getRandomObject(): German
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM german ORDER BY RAND() LIMIT 1";
      $stmt = $dbh->prepare($sql);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $result = new German($row['id'], $row['word']);
      $id = $row['id'];
      $sql2 = "SELECT distinct(wordclass) FROM english_german WHERE german_id = :id";
      $stmt2 = $dbh->prepare($sql2);
      $stmt2->bindParam('id', $id);
      $stmt2->execute();
      $row = $stmt2->fetch(PDO::FETCH_ASSOC);
      $result->wordclass = $row['wordclass'];
      return $result;
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  public function getRandomUserObject($userId): German
  {
    try {
      $dbh = DBConnect::connect();

      $sql = GET_RANDOM_GERMAN_ID_AND_WORDCLASS_FROM_USERPOOL;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $userId);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $result = $this->getObjectById($row['german_id']);
      $result->wordclass = $row ['wordclass'];
      return $result;
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