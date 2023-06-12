<?php

class DBConnect
//info Stellt eine Verbindung mit der Datenbank her, die Zugangsdaten
// sind als Konstanten in config.php definiert und werden in actionSwitch eingebunden
{
  public static function connect() :object
  {
    return new PDO(DB_DSN, DB_USER, DB_PASS);
  }
}