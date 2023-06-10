<?php
include 'config.php';
spl_autoload_register(function ($class) {
  include sprintf('classes/%s.php', $class);
});


$dbh = DBConnect::connect();
$sql = "SELECT g.word, e.word, eg.german_id, wordclass FROM english_german eg
    JOIN english e on eg.english_id = e.id
    JOIN german g on eg.german_id = g.id
    WHERE english_id = (SELECT * FROM (SELECT id FROM english ORDER BY RAND() LIMIT 1) AS ei)";

$resul = $dbh->query($sql);
while ($row = $resul->fetch(PDO::FETCH_ASSOC)) {
  $result[] = $row;
}

echo "<pre>";
print_r($result);
echo "</pre>";
