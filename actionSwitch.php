<?php
include 'config.php';
include 'queries.php';
//info Einbinden aller Klassen und der Konfigurations und Query Dateien,
// die in den Klassen benötigt werden
spl_autoload_register(function ($class) {
  include sprintf('classes/%s.php', $class);
});

$action = $_POST['action'];
switch ($action) {
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
  case 'getUserContent':
    session_start();
    $id = $_POST['userId'];
    $lang = $_POST['lang'];
    $fetchId = $_POST['fetchId'];
    if ($id == $_SESSION['userId']) {
      $content = (new UserContent())->getAllAsObjects($fetchId, $lang);
      echo json_encode($content);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'getTranslation':
    session_start();
    $id = $_POST['id'];
    $lang = $_POST['lang'];
    $wordclass = $_POST['wordclass'];
    if ($lang === 'en') {
      $translation = (new English())->getObjectById($id);
    } else {
      $translation = (new German())->getObjectById($id);
    }
    echo json_encode($translation);
    break;
  case 'addWordToUserPool':
    session_start();
    $id = $_POST['userId'];
    if ($id == $_SESSION['userId']) {
      $date = $_POST['date'];
      $wordId = $_POST['wordId'];
      $lang = $_POST['lang'];
      $description = $_POST['description'];
      $newWord = (new UserPool())->addNewWord($id, $date, $wordId, $lang, $description);
      echo json_encode($newWord);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'removeWordFromUserPool':
    session_start();
    $id = $_POST['userId'];
    if ($id == $_SESSION['userId']) {
      $wordId = $_POST['id'];
      $response = (new UserPool())->removeWordById($wordId);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'getSinglePoolObject':
    session_start();
    $userId = $_POST['userId'];
    if ($userId == $_SESSION['userId']) {
      $wordId = $_POST['wordId'];
      $lang = $_POST['lang'];
      $response = (new UserPool())->getSingleObject($userId, $wordId, $lang);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'createNewWord':
    session_start();
    $authorId = $_POST['authorId'];
    if ($authorId == $_SESSION['userId']) {
      $createdAt = $_POST['createdAt'];
      $lang = $_POST['lang'];
      $word = $_POST['word'];
      $wordclass = $_POST['wordclass'];
      $translations = json_decode($_POST['translations']);
      $description = $_POST['description'];
      $response = (new EnglishGerman())->createNewWord($authorId, $createdAt,
        $lang, $word, $wordclass, $translations, $description);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'getDescription':
    session_start();
    $userId = $_POST['userId'];
    if ($userId == $_SESSION['userId']) {
      $wordId = $_POST['wordId'];
      $lang = $_POST['lang'];
      $response = (new UserPool())->getDescriptionById($userId, $wordId, $lang);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'updateDescription':
    session_start();
    $userId = $_POST['userId'];
    if ($userId == $_SESSION['userId']) {
      $wordId = $_POST['wordId'];
      $lang = $_POST['lang'];
      $description = $_POST['description'];
      $response = (new UserPool())->updateDescription($userId, $wordId, $lang, $description);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  case 'getStatistics':
    session_start();
    $userId = $_POST['userId'];
    if ($userId == $_SESSION['userId']) {
      $date = $_POST['date'];
      $response = (new Statistics())->getStatistics($userId, $date);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
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
    if ($userId == $_SESSION['userId']) {
      $wordId = $_POST['wordId'];
      $lang = $_POST['lang'];
      $date = $_POST['date'];
      $isRight = ($_POST['isRight'] === 'true') ? 1 : 0;
      $response = (new Statistics())->updateStatistics($userId, $date, $wordId, $lang, $isRight);
      echo json_encode($response);
    } else {
      echo json_encode('Deine UserId scheint nicht deine eigene zu sein');
    }
    break;
  default:
    echo 'default case has happened!';
}
