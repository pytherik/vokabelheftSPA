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
      echo json_encode($user);
    }
    break;
  default:
    echo 'hallo';
}
