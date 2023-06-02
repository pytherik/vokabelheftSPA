<?php

class UserContent
{
  private int $id;
  private int $userId;
  private string $addedAt;
  private int $enlishId;
  private int $germanId;
  private string $description;

  /**
   * @param int|null $id
   * @param int|null $userId
   * @param string|null $addedAt
   * @param int|null $enlishId
   * @param int|null $germanId
   * @param string|null $description
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
      $this->enlishId = $enlishId;
      $this->germanId = $germanId;
      $this->description = $description;
  }
  }

  public function getAllAsObjects($id): array
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM user_pool WHERE user_id = :userId ORDER BY added_at DESC";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $id);
      $stmt->execute();
      $content = [];
      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $content[] = $row;
      }
      return $content;
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
    return $this->addedAt;
  }

  /**
   * @return int
   */
  public function getEnlishId(): int
  {
    return $this->enlishId;
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

}