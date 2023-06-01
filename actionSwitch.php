<?php
include 'config.php';
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
//      session_start();
      $_SESSION['username'] = $user->getName();
      $_SESSION['id'] = $user->getId();
      $username = $_SESSION['username'];
      echo json_encode($user);
    }
    break;
  default:
    echo 'hallo';
}
