<?php
include 'config.php';
include 'queries.php';
spl_autoload_register(function ($class) {
  include sprintf('classes/%s.php', $class);
});

//$action = 'getUserContent';
//$_POST['userId'] = 1;
//$_POST['lang'] = 'de';
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
      $translation = (new English())->getObjectById($id, $wordclass);
    } else {
      $translation = (new German())->getObjectById($id, $wordclass);
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
  default:
    echo 'default case has happened!';
}
