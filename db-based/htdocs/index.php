<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>David Herren</title>
    <script src="data.js"></script>
</head>
<body>
    <a href="./">David Herren</a>
    <div id="menu">
        <?php
        include 'config.php';
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Verbindung zur Datenbank fehlgeschlagen: " . $conn->connect_error);
        }
        // SQL-Abfrage, um alle Buttons aus der Datenbank zu laden und nach Nummer sortieren
        $sql = "SELECT slug, title FROM works ORDER BY nr DESC";
        $result = $conn->query($sql);
        // Buttons erstellen und anzeigen
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $slug = $row["slug"];
                $title = $row["title"];
                echo '<button onclick="loadData(\'' . $slug . '\')">' . $title . '</button>' . PHP_EOL;
            }
        } else {
            echo "Keine Buttons gefunden.";
        }
        $conn->close();
        ?>
    </div>
    <div id="content"></div>
</body>
</html>
