<?php
include 'config.php';

if(isset($_GET['slug'])) {
  $slug = $_GET['slug'];

  try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname;charset=utf8", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT slug, title, year, edition, media_de, size_de, text_de FROM works WHERE slug = :slug";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(':slug', $slug, PDO::PARAM_STR);
    $stmt->execute();

    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
      echo "<img src='./img/davidherren-" . htmlspecialchars($row["slug"]) ."-0.jpg' width='100%'>";
      echo "<h1>" . htmlspecialchars($row["title"]) . "</h1>". "<p>" . htmlspecialchars($row["year"]) . ", " . htmlspecialchars($row["media_de"]) . ", " . htmlspecialchars($row["size_de"]);
      if (!empty($row["edition"])) {
        echo ", " . htmlspecialchars($row["edition"]) . "</p>";
      } else { "</p>"; }
      echo "<p>" . html_entity_decode($row["text_de"]) . "</p>";
    } else { echo "No data!"; }

  } catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
  }

  $conn = null;
}
?>
