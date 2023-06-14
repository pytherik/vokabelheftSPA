<?php
include 'config.php';
include 'queries.php';
//info Einbinden aller Klassen und der Konfigurations und Query Dateien,
// die in den Klassen benötigt werden
spl_autoload_register(function ($class) {
  include sprintf('classes/%s.php', $class);
});

//info Anfragen aus javaScript beinhalten die action,
// welche den case des switches aufruft
$authorizationError = 'Deine UserId gehört nicht zu dir!';
$action = $_POST['action'];
switch ($action) {
  //info kommt von main.js, user anlegen oder holen
  case 'userLogin':
    if (isset($_POST['name']) && isset($_POST['password'])) {
      $name = $_POST['name'];
      $password = $_POST['password'];
      $user = (new User())->createOrGetUser($name, $password);
      session_start();
      $_SESSION['userId'] = $user->getId();
      echo json_encode($user);
    }
    break;
  //info kommt von listView.js, alle bzw. user Vokabeln holen
  case 'getUserContent':
    session_start();
    $userId = $_POST['userId'];
    $lang = $_POST['lang'];
    $fetchId = $_POST['fetchId'];
    $content = (new UserContent())->getAllAsObjects($fetchId, $lang);
    echo json_encode($content);
    break;
  //info kommt von loadStartPage.js->functions/translateFunctions.js, Übersetzungen zu wordId holen
  case 'getTranslation':
    session_start();
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $wordclass = $_POST['wordclass'];
    if ($lang === 'en') {
      $translation = (new English())->getObjectById($wordId);
    } else {
      $translation = (new German())->getObjectById($wordId);
    }
    echo json_encode($translation);
    break;
  //info kommt von crudView.js, trägt Vokabel aus Gesamtbestand in user_pool ein
  case 'addWordToUserPool':
    session_start();
    $userId = $_POST['userId'];
    $date = $_POST['date'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $description = $_POST['description'];
    $newWord = (new UserPool())->addNewWord($userId, $date, $wordId, $lang, $description);
    echo json_encode($newWord);
    break;
  //info kommt von crudView.js, löscht Vokabel aus user_pool Bestand
  case 'removeWordFromUserPool':
    session_start();
    $userId = $_POST['userId'];
    $wordId = $_POST['id'];
    $response = (new UserPool())->removeWordById($wordId);
    echo json_encode($response);
    break;
  //info kommt von crudView.js, gehört zu createNewWord, überprüft, ob sich das Wort
  // im user_pool befindet, Rückgabewert: boolean
  case 'getSinglePoolObject':
    session_start();
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $response = (new UserPool())->getSingleObject($userId, $wordId, $lang);
    echo json_encode($response);
    break;
  //info kommt von crudView.js, pflegt neue Vokabel in die Tabellen
  // german, english, english_german und user_pool ein
  case 'createNewWord':
    session_start();
    $userId = $_POST['authorId'];
    $createdAt = $_POST['createdAt'];
    $lang = $_POST['lang'];
    $word = $_POST['word'];
    $wordclass = $_POST['wordclass'];
    $translations = json_decode($_POST['translations']);
    $description = $_POST['description'];
    $response = (new EnglishGerman())->createNewWord($userId, $createdAt,
      $lang, $word, $wordclass, $translations, $description);
    echo json_encode($response);
    break;
  //info kommt von crudView.js->functions/getDescription.js holt Beschreibung zu wortId
  case 'getDescription':
    session_start();
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $response = (new UserPool())->getDescriptionById($userId, $wordId, $lang);
    echo json_encode($response);
    break;
  //info kommt von crudView.js eintragen der geänderten Beschreibung in Tabelle user_pool
  case 'updateDescription':
    session_start();
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $description = $_POST['description'];
    $response = (new UserPool())->updateDescription($userId, $wordId, $lang, $description);
    echo json_encode($response);
    break;
  // info kommt von learnView.js, holen des Lerner-Erfolgs aus Tabelle statistics
  case 'getStatistics':
    session_start();
    $userId = $_POST['userId'];
    $date = $_POST['date'];
    $response = (new Statistics())->getStatistics($userId, $date);
    echo json_encode($response);
    break;
  // info kommt von learnView, holen eines Zufallswortes incl. Wortart
  // aus Tabellen english
  case 'getRandomWord':
    $userId = $_POST['userId'];
    $lang = $_POST['lang'];
    $mode = $_POST['mode'];
    if ($mode === 'true') {
      $response = ($lang === 'en') ?
        (new English())->getRandomObject() :
        (new German())->getRandomObject();
    } else {
      $response = ($lang === 'en') ?
        (new English())->getRandomUserObject($userId) :
        (new German())->getRandomUserObject($userId);
    }
    echo json_encode($response);
    break;
  case 'updateStatistics':
    session_start();
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $date = $_POST['date'];
    $isRight = ($_POST['isRight'] === 'true') ? 1 : 0;
    (new Statistics())->updateStatistics($userId, $date, $wordId, $lang, $isRight);
    break;
  default:
    echo 'default case has happened!';
}
