<?php

class UserContent implements JsonSerializable
{
  private int $id;
  private int $userId;
  private string $addedAt;
  private int $englishId;
  private int $germanId;
  private string $description;
  private string $word;

  /**
   * @param int|null $id
   * @param int|null $userId
   * @param string|null $addedAt
   * @param int|null $enlishId
   * @param int|null $germanId
   * @param string|null $description
   * @param string|null $word
   */
  public function __construct(?int $id=null,
                              ?int $userId=null,
                              ?string $addedAt=null,
                              ?int $enlishId=null,
                              ?int $germanId=null,
                              ?string $description=null)
  {
    if (isset($id) && isset($userId) && isset($addedAt)) {
      $this->id = $id;
      $this->userId = $userId;
      $this->addedAt = $addedAt;
      $this->englishId = $enlishId;
      $this->germanId = $germanId;
      $this->description = $description;
      if ($this->englishId !== 0) {
        $english = (new English())->getObjectById($this->englishId);
        $this->word = $english->getWord();
      } else {
        $german = (new German())->getObjectById($this->germanId);
        $this->word = $german->getWord();
      }

    }
  }

  public function getAllAsObjects(int $id): array
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM user_pool WHERE user_id = :userId ORDER BY added_at DESC";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $id);
      $stmt->execute();
      $content = [];
      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if($row['english_id'] === null){
          $row['english_id'] = 0;
        } else {
          $row['german_id'] = 0;
        }
        if($row['description'] === null) {
          $row['description'] = '';
        }
        $content[] = new UserContent($row['id'], $row['user_id'],
          $row['added_at'], $row['english_id'],
          $row['german_id'], $row['description']);
      }
      return $content;
    } catch (PDOException $e) {
      echo $e->getMessage();
      die();
    }
  }

  public function jsonSerialize(): array
  {
    return [
      'id' => $this->id,
      'user_id' => $this->userId,
      'added_at' => $this->addedAt,
      'english_id' => $this->englishId,
      'german_id' => $this->germanId,
      'description' => $this->description,
      'word' => $this->word
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
    return $this->addedAt;
  }

  /**
   * @return int
   */
  public function getEnglishId(): int
  {
    return $this->englishId;
  }

  /**
   * @return int
   */
  public function getGermanId(): int
  {
    return $this->germanId;
  }

  /**
   * @return string
   */
  public function getDescription(): string
  {
    return $this->description;
  }

  /**
   * @return string
   */
  public function getWord(): string
  {
    return $this->word;
  }

}