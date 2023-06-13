<?php

class UserContent implements JsonSerializable
{
  private int $word_id;
  private int $id;
  private string $word;
  private string $wordclass;
  private int $created_by;
  private string $author_name;
  private string $created_at;

  /**
   * @param int|null $word_id
   * @param int|null $id
   * @param string|null $word
   * @param string|null $wordclass
   * @param int|null $created_by
   * @param string|null $author_name
   * @param string|null $created_at
   */
  public function __construct(?int    $word_id = null,
                              ?int    $id=null,
                              ?string $word = null,
                              ?string $wordclass = null,
                              ?int    $created_by = null,
                              ?string $author_name = null,
                              ?string $created_at = null)
  {
    if (isset($word_id) &&
      isset($id) &&
      isset($word) &&
      isset($wordclass) &&
      isset($created_by) &&
      isset($author_name) &&
      isset($created_at))
    {
      $this->word_id = $word_id;
      $this->id = $id;
      $this->word = $word;
      $this->wordclass = $wordclass;
      $this->created_by = $created_by;
      $this->author_name = $author_name;
      $this->created_at = $created_at;
    }
  }

  /**
   * @param int $id
   * @param string $lang
   * @return array
   */
  public function getAllAsObjects(int $id, string $lang): array
  {
    //info Der Gesamtbestand der Wörter in der jeweiligen Sprache wird,
    // bezogen auf den Benutzer oder alle Benutzer aus dem Bestand gelesen
    // und in einer kombinierten Anfrage mit weiteren benötigten Informationen
    // angereichert (wordclass, username, created_by, created_at)
    try {
      $dbh = DBConnect::connect();
      if ($lang === 'en') {
        $sql = ($id === 0) ? ALL_USERS_POOL_ENGLISH: USER_POOL_ENGLISH;
      } else {
        $sql = ($id === 0) ? ALL_USERS_POOL_GERMAN: USER_POOL_GERMAN;
      }
      $stmt = $dbh->prepare($sql);
      if ($id !== 0) {
        $stmt->bindParam('userId', $id);
      }
      $stmt->execute();
      $content = [];
      while ($row = $stmt->fetchObject(__CLASS__)) {
        $content[] = $row;
      }
      return $content;
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
}