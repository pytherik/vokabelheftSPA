<?php
include 'config.php';
spl_autoload_register(function ($class) {
  include sprintf('classes/%s.php', $class);
});

//$action = $_POST['action'];
$action = 'getUserContent';
$_POST['userId'] = 1;
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
    if (isset($_POST['userId'])) {
      $id = $_POST['userId'];
      $content = (new UserContent())->getAllAsObjects($id);
      echo json_encode($content);
    }
    break;
  default:
    echo 'hallo';
}
