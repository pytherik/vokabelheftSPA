<?php

class Statistics implements JsonSerializable
{
  private int $id;
  private int $userId;
  private string $testedAt;
  private int $englishId;
  private int $germanId;
  private bool $isCorrect;

  /**
   * @param int|null $id
   * @param int|null $userId
   * @param string|null $testedAt
   * @param int|null $englishId
   * @param int|null $germanId
   * @param bool|null $isCorrect
   */
  public function __construct(?int $id=null,
                              ?int $userId=null,
                              ?string $testedAt=null,
                              ?int $englishId=null,
                              ?int $germanId=null,
                              ?bool $isCorrect=null)
  {
    if(isset($id) && isset($userId) && isset($testedAt)){
    $this->id = $id;
    $this->userId = $userId;
    $this->testedAt = $testedAt;
    $this->englishId = $englishId;
    $this->germanId = $germanId;
    $this->isCorrect = $isCorrect;
    }
  }

  public function getStatistics($userId, $date): array
  {
    try {
      $dbh = DBConnect::connect();
      $sql = ($date === '0') ? GET_USER_STATISTICS : GET_SESSION_STATISTICS;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $userId);
      if ($date !== '0') {
        $stmt->bindParam('date', $date);
      }
     $stmt->execute();
      if($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        $result =  [$row['is_right'], $row['total']];
      } else {
        $result = [0, 0];
      }
      return $result;
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
  public function getTestedAt(): string
  {
    return $this->testedAt;
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
   * @return bool
   */
  public function isCorrect(): bool
  {
    return $this->isCorrect;
  }

  public function jsonSerialize(): mixed
  {
    return get_object_vars();
  }
}