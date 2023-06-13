<?php

class User implements JsonSerializable
{
  private int $id;
  private string $name;
  private string $password;
  private string $registered_at;

  /**
   * @param int|null $id
   * @param string|null $name
   * @param string|null $password
   * @param string|null $registered_at
   */
  public function __construct(?int $id=null, ?string $name=null, ?string $password=null, ?string $registered_at=null)
  {
    if (isset($id) && isset($name) && isset($password) && isset($registered_at)) {
      $this->id = $id;
      $this->name = $name;
      $this->password = $password;
      $this->registered_at = $registered_at;
    }
  }

  /**
   * @param $name
   * @param $password
   * @return User
   */
  public function createOrGetUser($name, $password): User
  {
    try {
      $dbh = DBConnect::connect();
      $sql = "SELECT * FROM user WHERE name=:name AND password=:password";
      $stmt = $dbh->prepare($sql);
      $stmt->bindParam('name', $name);
      $stmt->bindParam('password', $password);
      $stmt->execute();
      $user = $stmt->fetchObject(__CLASS__);
      if ($user) {
        return $user;
      } else {
        $registered_at = (new DateTime('now'))->format('Y-m-d H:i:s');
        $sql = "INSERT INTO user VALUES (NULL, :name, :password, :registered_at)";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam('name', $name);
        $stmt->bindParam('password', $password);
        $stmt->bindParam('registered_at', $registered_at);
        $stmt->execute();
        $id = $dbh->lastInsertId();
        return new User($id, $name, $password, $registered_at);
      }
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
    return [
      'id' => $this->id,
      'name' => $this->name,
      'registered_at' => $this->registered_at
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
   * @return string
   */
  public function getName(): string
  {
    return $this->name;
  }

  /**
   * @return string
   */
  public function getPassword(): string
  {
    return $this->password;
  }

  /**
   * @return string
   */
  public function getRegisteredAt(): string
  {
    return $this->registered_at;
  }

}