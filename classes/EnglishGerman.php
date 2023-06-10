<?php

class EnglishGerman
{
  private int $id;
  private string $createdAt;
  private int $createdBy;
  private int $englishId;
  private int $germanId;
  private string $wordclass;

  /**
   * @param int|null $id
   * @param string|null $createdAt
   * @param int|null $createdBy
   * @param int|null $englishId
   * @param int|null $germanId
   * @param string|null $wordclass
   */
  public function __construct(?int    $id = null,
                              ?string $createdAt = null,
                              ?int    $createdBy = null,
                              ?int    $englishId = null,
                              ?int    $germanId = null,
                              ?string $wordclass = null)
  {
    if (isset($id) && isset($createdAt) && isset($createdBy)) {
      $this->id = $id;
      $this->createdAt = $createdAt;
      $this->createdBy = $createdBy;
      $this->englishId = $englishId;
      $this->germanId = $germanId;
      $this->wordclass = $wordclass;
    }
  }

  public function createNewWord($authorId,
                                $createdAt,
                                $lang,
                                $word,
                                $wordclass,
                                $translations,
                                $description): string
  {
    try {
      $response = 'Das neue Wort wurde hinzugefügt';
      $dbh = DBConnect::connect();

      $sql = ($lang === 'en') ? ENGLISH_WORD_EXISTS : GERMAN_WORD_EXISTS;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('word', $word);
      $stmt->bindParam('wordclass', $wordclass);
      $stmt->execute();
      if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $response = 'Dieses Wort ist schon in der Sammlung!';
      } else {
        $sql = ($lang === 'en') ? INSERT_ENGLISH_WORD : INSERT_GERMAN_WORD;
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam('createdAt', $createdAt);
        $stmt->bindParam('word', $word);
        $stmt->execute();
        $wordId = $dbh->lastInsertId();
        foreach ($translations as $translation) {
          $sql = ($lang === 'en') ? GERMAN_WORD_EXISTS : ENGLISH_WORD_EXISTS;
          $stmt = $dbh->prepare($sql);
          $stmt->bindParam('word', $translation);
          $stmt->bindParam('wordclass', $wordclass);
          $stmt->execute();
          if ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            $translationId = $row['id'];
          } else {
            $sql = ($lang === 'en') ? INSERT_GERMAN_WORD : INSERT_ENGLISH_WORD;
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam('createdAt', $createdAt);
            $stmt->bindParam('word', $translation);
            $stmt->execute();
            $translationId = $dbh->lastInsertId();
          }
          $sql = INSERT_ENGLISH_GERMAN;
          $stmt = $dbh->prepare($sql);
          $stmt->bindParam('createdAt', $createdAt);
          $stmt->bindParam('createdBy', $authorId);

          $sql2 = ($lang === 'en') ? INSERT_GERMAN_INTO_USER_POOL : INSERT_ENGLISH_INTO_USER_POOL;
          $stmt2 = $dbh->prepare($sql2);
          $stmt2->bindParam('user_id', $authorId);
          $stmt2->bindParam('added_at', $createdAt);

          if ($lang === 'en') {
            $stmt->bindParam('english_id', $wordId);
            $stmt->bindParam('german_id', $translationId);

            $stmt2->bindParam('german_id', $translationId);
          } else {
            $stmt->bindParam('english_id', $translationId);
            $stmt->bindParam('german_id', $wordId);

            $stmt2->bindParam('english_id', $translationId);
          }
          $stmt->bindParam('wordclass', $wordclass);

          $empty = '';
          $stmt2->bindParam('description', $empty);

          $stmt->execute();
          $stmt2->execute();
        }
        $sql = ($lang === 'en') ? INSERT_ENGLISH_INTO_USER_POOL: INSERT_GERMAN_INTO_USER_POOL;
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam('user_id', $authorId);
        $stmt->bindParam('added_at', $createdAt);
        if ($lang === 'en') {
          $stmt->bindParam('english_id', $wordId);
        } else {
          $stmt->bindParam('german_id', $wordId);
        }
        $stmt->bindParam('description', $description);
        $stmt->execute();
      }
      return $response;
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
   * @return string
   */
  public function getCreatedAt(): string
  {
    return $this->createdAt;
  }

  /**
   * @return int
   */
  public function getCreatedBy(): int
  {
    return $this->createdBy;
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
  public function getWordclass(): string
  {
    return $this->wordclass;
  }
}