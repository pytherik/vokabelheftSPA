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

  /**
   * @param $authorId
   * @param $createdAt
   * @param $lang
   * @param $word
   * @param $wordclass
   * @param $translations
   * @param $description
   * @return string
   */
  public function createNewWord($authorId,
                                $createdAt,
                                $lang,
                                $word,
                                $wordclass,
                                $translations,
                                $description): string
    //info einen neuen Eintrag prüfen und dort in die Tabellen
    // english, german und english_german eintragen. $lang gibt die
    // Sprache an, unter welcher das Wort eingetragen wird, die
    // jeweils andere Sprache wird hier als translation bezeichnet.
    // Gleichzeitig wird das Wort im user_pool des Benutzers($authorId)
    // angelegt, damit es ihm nach der Erstellung als Lerncontent zur
    // verfügung steht. Ist das Wort schon vorhanden, wird die Id des
    // Wortes zurückgegeben, damit weiter geprüft werden kann, ob dem Benutzer
    // das Wort in seinem user_pool schon zur verfügung steht.
  {
    try {
      $response = '0';
      $dbh = DBConnect::connect();
      //info Prüfen auf Vorhandensein im Gesamtbestand
      $sql = ($lang === 'en') ? ENGLISH_WORD_EXISTS : GERMAN_WORD_EXISTS;
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('word', $word);
      $stmt->bindParam('wordclass', $wordclass);
      $stmt->execute();
      if ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        //info Rückgabewert id des Wortes setzen, Wort gibt es schon
        $response = $row['id'];
      } else {
        //info Wort gibt es noch nicht, je nach $lang eintragen
        $sql = ($lang === 'en') ? INSERT_ENGLISH_WORD : INSERT_GERMAN_WORD;
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam('createdAt', $createdAt);
        $stmt->bindParam('word', $word);
        $stmt->execute();
        $wordId = $dbh->lastInsertId();
        foreach ($translations as $translation) {
          //info Alle angegebenen Übersetzungen auf Vorhandensein prüfen
          $sql = ($lang === 'en') ? GERMAN_WORD_EXISTS : ENGLISH_WORD_EXISTS;
          $stmt = $dbh->prepare($sql);
          $stmt->bindParam('word', $translation);
          $stmt->bindParam('wordclass', $wordclass);
          $stmt->execute();
          if ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
            //info das Wort existiert schon, id ist bekannt
            $translationId = $row['id'];
          } else {
            //info das Wort existiert noch nicht, id wird nach dem Eintragen mit lastInsertId geholt
            $sql = ($lang === 'en') ? INSERT_GERMAN_WORD : INSERT_ENGLISH_WORD;
            $stmt = $dbh->prepare($sql);
            $stmt->bindParam('createdAt', $createdAt);
            $stmt->bindParam('word', $translation);
            $stmt->execute();
            $translationId = $dbh->lastInsertId();
          }
          //info die Verbindungen in der Verknüpfungstabelle werden eingetragen
          $sql = INSERT_ENGLISH_GERMAN;
          $stmt = $dbh->prepare($sql);
          $stmt->bindParam('createdAt', $createdAt);
          $stmt->bindParam('createdBy', $authorId);
          //info eine zweite Anfrage stellt auch die Übersetzungen
          // als Lerncontent im user_pool bereit
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
        //info das Wort wird im user_pool als Lerncontent bereitgestellt
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