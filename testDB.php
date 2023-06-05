<?php
include 'config.php';
include 'queries.php';
spl_autoload_register(function ($class) {
  include sprintf('classes/%s.php', $class);
});

for ($i = 1; $i <= 7; $i++) {
$result = (new English())->getObjectById($i);
echo "<pre>";
print_r($result);
echo "</pre>";
}
