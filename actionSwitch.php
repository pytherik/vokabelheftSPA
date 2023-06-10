<?php
include 'config.php';
include 'queries.php';
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
    $id = $_POST['userId'];
    $lang = $_POST['lang'];
    $content = (new UserContent())->getAllAsObjects($id, $lang);
//      echo "<pre>";
//      print_r($content);
//      echo "</pre>";
    echo json_encode($content);
    break;
  case 'getTranslation':
    $id = $_POST['id'];
    $lang = $_POST['lang'];
    $wordclass = $_POST['wordclass'];
    if($lang === 'en') {
      $translation = (new English())->getObjectById($id);
    } else {
      $translation = (new German())->getObjectById($id);
    }
    echo json_encode($translation);
    break;
  case 'addWordToUserPool':
    $id = $_POST['userId'];
    $date = $_POST['date'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $description = $_POST['description'];
    $newWord = (new UserPool())->addNewWord($id, $date, $wordId, $lang, $description);
    echo json_encode($newWord);
    break;
  case 'removeWordFromUserPool':
    $id = $_POST['userId'];
    $wordId = $_POST['id'];
    $response = (new UserPool())->removeWordById($wordId);
    echo json_encode($response);
    break;
  case 'createNewWord':
    $authorId = $_POST['authorId'];
    $createdAt = $_POST['createdAt'];
    $lang = $_POST['lang'];
    $word = $_POST['word'];
    $wordclass = $_POST['wordclass'];
    $translations = json_decode($_POST['translations']);
    $description = $_POST['description'];
    $response = (new EnglishGerman())->createNewWord($authorId, $createdAt,
                      $lang, $word, $wordclass, $translations, $description);
    echo json_encode($response);
    break;
  case 'getDescription':
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $response = (new UserPool())->getDescriptionById($userId, $wordId, $lang);
    echo json_encode($response);
    break;
  case 'updateDescription':
    $userId = $_POST['userId'];
    $wordId = $_POST['wordId'];
    $lang = $_POST['lang'];
    $description = $_POST['description'];
    $response = (new UserPool())->updateDescription($userId, $wordId, $lang, $description);
    echo json_encode($response);
    break;
  case 'getStatistics':
    $userId = $_POST['userId'];
    $date = $_POST['date'];
    $response = (new Statistics())->getStatistics($userId, $date);
    echo json_encode($response);
    break;
  default:
    echo 'default case has happened!';
}
