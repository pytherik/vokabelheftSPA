<?php

class UserPool implements JsonSerializable
{
  private int $id;
  private int $userId;
  private string $added_at;
  private int $english_id;
  private int $german_id;
  private string $description;

  /**
   * @param int|null $id
   * @param int|null $userId
   * @param string|null $added_at
   * @param int|null $english_id
   * @param int|null $german_id
   * @param string|null $description
   */
  public function __construct(?int    $id = null,
                              ?int    $userId = null,
                              ?string $added_at = null,
                              ?int    $english_id = null,
                              ?int    $german_id = null,
                              ?string $description = null)
  {
    if (isset($id) && isset($userId) && isset($added_at)) {
      $this->id = $id;
      $this->userId = $userId;
      $this->added_at = $added_at;
      $this->english_id = $english_id;
      $this->german_id = $german_id;
      $this->description = $description;
    }
  }

  /**
   * @param $userId
   * @param $added_at
   * @param $wordId
   * @param $lang
   * @param $description
   * @return UserPool
   */
  public function addNewWord($userId, $added_at, $wordId, $lang, $description): UserPool
  //info neuer Lerncontent wird dem user_pool hinzugefügt
  {
    try {
      $dbh = DBConnect::connect();

      $sql = ($lang === 'en') ? INSERT_ENGLISH_INTO_USER_POOL: INSERT_GERMAN_INTO_USER_POOL;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('user_id', $userId);
      $stmt->bindParam('added_at', $added_at);
      if ($lang === 'en') {
        $stmt->bindParam('english_id', $wordId);
      } else {
        $stmt->bindParam('german_id', $wordId);
      }
      $stmt->bindParam('description', $description);
      $stmt->execute();
      $id = $dbh->lastInsertId();
      if ($lang === 'en') {
        $newWord = new UserPool($id, $userId, $added_at, $wordId, 0, $description);
      } else {
        $newWord = new UserPool($id, $userId, $added_at, 0, $wordId, $description);
      }
      return $newWord;
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  /**
   * @param $id
   * @return string
   */
  public function removeWordById($id): string
  //info Lerncontent wird aus user_pool entfernt
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "DELETE FROM user_pool WHERE id=:id";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('id', $id);
      $stmt->execute();
      return 'Eintrag erfolgreich entfernt!';
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  /**
   * @param $userId
   * @param $wordId
   * @param $lang
   * @return string
   */
  public function getDescriptionById($userId, $wordId, $lang): string
    //info Die Beschreibung für ein Wort kann hier separat abgefragt werden.
    // Ist für die Edit Funktion notwendig
  {
    try {
      $response = '';
      $dbh = DBConnect::connect();
      if ($lang === 'en') {
        $sql = "SELECT description FROM user_pool WHERE user_id = :userId AND english_id = :wordId";
      } else {
        $sql = "SELECT description FROM user_pool WHERE user_id = :userId AND german_id = :wordId";
      }
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $userId);
      $stmt->bindParam('wordId', $wordId);
      $stmt->execute();
      if ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $response = $row['description'] ?? '';
      }
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
    return $response;
  }

  /**
   * @param $userId
   * @param $wordId
   * @param $lang
   * @param $description
   * @return string
   */
  public function updateDescription($userId, $wordId, $lang, $description): string
  //info Editierte Beschreibungen werden eingetragen.
  {
    $response = '';
    try {
      $dbh = DBConnect::connect();
      $sql = ($lang === 'en') ? UPDATE_ENGLISH_DESCRIPTION : UPDATE_GERMAN_DESCRIPTION;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('description', $description);
      $stmt->bindParam('userId', $userId);
      $stmt->bindParam('wordId', $wordId);
      $stmt->execute();
      $response = ($lang === 'en') ? 'Successfully updated description!' : 'Beschreibung wurde geändert!';
    } catch (PDOException $e) {
      echo $e->getMessage();
    }
    return $response;
  }

  /**
   * @param int $userId
   * @param int $wordId
   * @param string $lang
   * @return mixed|string|void
   */
  public function getSingleObject(int $userId, int $wordId, string $lang)
    //info wird nur zur Überprüfung benötigt, ob ein Wort im user_pool Bestand
    // eines Benutzers ist
  {
    try {
      $dbh = DBConnect::connect();
      $sql = ($lang === 'en') ? GET_SINGLE_ENGLISH_POOL_OBJECT : GET_SINGLE_GERMAN_POOL_OBJECT;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $userId);
      $stmt->bindParam('wordId', $wordId);
      $stmt->execute();
      if($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        return $row;
      } else {
        return 'false';
      }
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  /**
   * @return int
   */
  public function getId(): int
  {
    return $this->id;
  }

  /**
   * @return int
   */
  public function getUserId(): int
  {
    return $this->userId;
  }

  /**
   * @return string
   */
  public function getAddedAt(): string
  {
    return $this->added_at;
  }

  /**
   * @return int
   */
  public function getEnglishId(): int
  {
    return $this->english_id;
  }

  /**
   * @return int
   */
  public function getGermanId(): int
  {
    return $this->german_id;
  }

  /**
   * @return string
   */
  public function getDescription(): string
  {
    return $this->description;
  }

  public function jsonSerialize(): array
  {
    return get_object_vars($this);
  }
}
