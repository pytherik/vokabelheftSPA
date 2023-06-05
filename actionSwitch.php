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
  default:
    echo 'default case has happened!';
}
