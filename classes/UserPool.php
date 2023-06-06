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

  public function addNewWord($userId, $added_at, $wordId, $lang, $description): UserPool
  {
    try {
      $dbh = DBConnect::connect();
      if ($lang === 'en') {
        $sql = "INSERT INTO user_pool VALUES (NULL, :user_id, :added_at, :english_id, NULL, :description)";
      } else {
        $sql = "INSERT INTO user_pool VALUES (NULL, :user_id, :added_at, NULL, :german_id, :description)";
      }
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
      file_put_contents('ab.txt', $id . $added_at . $wordId . $description);
      return $newWord;
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
