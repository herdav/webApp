<!--index.php for davidherren.ch / 2024-01-17-->
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
    <?php
    include 'data.php';
    $menuResult = $database->fetchMenuItems();
    $indexResult = $database->fetchIndexItems(["motionstudy"]);
    ?>
    <div id="menu" class="frame">
      <div id="menu-title">
        <div id="menu-title-left">
          <button id="button-dropdown" class="button-navigation" onclick="dropDown()">
          <svg id="dropdown-svg" width="40px" height="40px" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <polygon points="18,3 21,3 38,22 35,27 3,27 0,22 18,3"/>
          </svg>
          </button>
        </div>
        <a href="./" id="menu-title-center">
          <div id="menu-title-center-inner">
            <h1>David Herren</h1>
          </div>
        </a>
        <div id="menu-title-right">
          <div id="language-switch">
            <button id="button-de" class="button-navigation" onclick="switchLanguage('de')">de</button>
            <button id="button-en" class="button-navigation" onclick="switchLanguage('en')">en</button>
          </div>
        </div>
      </div>
      <div id="menu-inner">
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
          <!--<button id="button-exhibitions" class="button-navigation" onclick="loadExhibitions()">Exhibitions</button>-->
          <button id="button-about" class="button-navigation" onclick="loadAbout()">About</button>
        </div>
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
