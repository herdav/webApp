<!--index.php for davidherren.ch / 2024-01-06-->
<!DOCTYPE html>
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <title>David Herren</title>
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <script src="/js/data.js" defer></script>
    <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
  </head>
  <body>
    <div id="header">
      <a href="./">David Herren</a>
      <div id="language-switch">
        <button id="button-de" class="button-language" onclick="switchLanguage('de')">de</button>
        <button id="button-en" class="button-language" onclick="switchLanguage('en')">en</button>
      </div>
    </div>
    <?php
    include 'data.php';
    $menuResult = $database->fetchMenuItems();
    $indexResult = $database->fetchIndexItems(["motionstudy"]); // Exclude array of slugs from index site
    ?>
    <div id="menu">
      <div id="menu-works">
        <?php
        if (count($menuResult) > 0) {
          foreach ($menuResult as $row) {
            $slug = $row["slug"];
            $title = $row["title"];
            echo '<button id="button-' . htmlspecialchars($slug) . '" class="button-navigation" onclick="loadWorks(\'' . htmlspecialchars($slug) . '\')">' . htmlspecialchars($title) . '</button>' . PHP_EOL;
          }
        } else { echo "No Buttons found!"; }
        ?>
      </div>
      <div id="menu-about">
        <button id="button-exhibitions" class="button-navigation" onclick="loadExhibitions()">Exhibitions</button>
        <button id="button-about" class="button-navigation" onclick="loadAbout()">About</button>
      </div>
    </div>
    <div id="index">
    <?php
    if (count($indexResult) > 0) {
        foreach ($indexResult as $row) {
            $title = $row["title"];
            $slug = $row["slug"];
            echo "<a onclick='loadWorks(\"{$slug}\")'><div class='index-items'>";
            echo "<img src='/img/prev/{$slug}-prev.jpg'></a></div>" . PHP_EOL;
        }
      } else {
          echo "No works found!";
      }
      ?>
    </div>
    <div id="content"></div
  </body>
</html>
