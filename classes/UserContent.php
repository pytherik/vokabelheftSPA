<?php

class UserContent implements JsonSerializable
{
  private int $word_id;
  private string $word;
  private string $wordclass;
  private int $created_by;
  private string $author_name;
  private string $created_at;

  /**
   * @param int|null $word_id
   * @param string|null $word
   * @param string|null $wordclass
   * @param int|null $created_by
   * @param string|null $author_name
   * @param string|null $created_at
   */
  public function __construct(?int    $word_id = null,
                              ?string $word = null,
                              ?string $wordclass = null,
                              ?int    $created_by = null,
                              ?string $author_name = null,
                              ?string $created_at = null)
  {
    if (isset($word_id) &&
      isset($word) &&
      isset($wordclass) &&
      isset($created_by) &&
      isset($author_name) &&
      isset($created_at))
    {
      $this->word_id = $word_id;
      $this->word = $word;
      $this->wordclass = $wordclass;
      $this->created_by = $created_by;
      $this->author_name = $author_name;
      $this->created_at = $created_at;
    }
  }


  public function getAllAsObjects(int $id): array
  {
    try {
      $dbh = DBConnect::connect();
      $sql = USER_POOL_ENGLISH;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('userId', $id);
      $stmt->execute();
      $content = [];
//      while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
      while ($row = $stmt->fetchObject(__CLASS__)) {
        $content[] = $row;
      }
      return $content;
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
  public function getWordId(): int
  {
    return $this->word_id;
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
  public function getWordclass(): string
  {
    return $this->wordclass;
  }

  /**
   * @return int
   */
  public function getCreatedBy(): int
  {
    return $this->created_by;
  }

  /**
   * @return string
   */
  public function getAuthorName(): string
  {
    return $this->author_name;
  }

  /**
   * @return int
   */
  public function getCreatedAt(): int
  {
    return $this->created_at;
  }
}