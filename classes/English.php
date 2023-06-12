<?php

class English implements JsonSerializable
//info English Objekte enthalten zusätzlich zu den DB Tabellen einträgen
// noch das aus German gelieferte array $translations und die nicht zwingend
// benötigte $wordclass
{
  private int $id;
  private string $word;
  private array $translations;
  private string $wordclass;

  /**
   * @param int|null $id
   * @param string|null $word
   */
  public function __construct(?int $id = null, ?string $word = null)
  {
    if (isset($id) && isset($word)) {
      $this->id = $id;
      $this->word = $word;
      $this->translations = (new German())->getTranslationsById($id);
      $this->wordclass = '';
    }
  }

  /**
   * @param int $id
   * @return array
   */
  public function getTranslationsById(int $id): array
  //info liefert für Objekte der Klasse German die Übersetzung(en)
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

  /**
   * @param $id
   * @return English
   */
  public function getObjectById($id): English
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM english WHERE id = :id";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('id', $id);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      return new English($row['id'], $row['word']);
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  /**
   * @return English
   */
  public function getRandomObject(): English
  //info holt ein zufälliges englisches Wort aus dem Gesamtbestand
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM english ORDER BY RAND() LIMIT 1";
      $stmt = $dbh->prepare($sql);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $result = new English($row['id'], $row['word']);
      $id = $row['id'];
      //info zusätzliche Abfrage in english_german, um die Wortart zum Objekt hinzuzufügen
      $sql2 = "SELECT distinct(wordclass) FROM english_german WHERE english_id = :id";
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

  /**
   * @param $userId
   * @return English
   */
  public function getRandomUserObject($userId): English
  //info holt ein zufälliges englisches Wort aus dem Bestand des Benutzers im user_pool
  {
    try {
      $dbh = DBConnect::connect();

      $sql = GET_RANDOM_ENGLISH_ID_AND_WORDCLASS_FROM_USERPOOL;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $userId);
      $stmt->execute();
      $row = $stmt->fetch(PDO::FETCH_ASSOC);
      $result = $this->getObjectById($row['english_id']);
      $result->wordclass = $row ['wordclass'];
      return $result;
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  /**
   * @return array
   */
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