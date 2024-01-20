<!DOCTYPE html>
<!--index.php for davidherren.ch / 2024-01-20-->
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <title>David Herren</title>
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <script src="/js/data.js" defer></script>
    <script src="/js/animations.js" defer></script>
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
          <svg id="dropdown-svg" width="64px" height="32px" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
            <rect x="4"  y="24" id="svg-triangle-1" width="56" height="4"/>
            <rect x="8"  y="20" id="svg-triangle-2"width="48"  height="4"/>
            <rect x="12" y="16" id="svg-triangle-3" width="40" height="4"/>
            <rect x="16" y="12" id="svg-triangle-4" width="32" height="4"/>
            <rect x="20" y="8"  id="svg-triangle-5" width="24" height="4"/>
            <rect x="24" y="4"  id="svg-triangle-6" width="16" height="4"/>
            <rect x="28" y="0"  id="svg-triangle-7" width="8"  height="4"/>
          </svg>
          </button>
        </div>
        <a href="./" id="menu-title-center">
          <div id="menu-title-center-inner">
            <h1 id="title-text">David Herren</h1>
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
          <button id="button-mail" class="button-navigation" onclick="window.location.href='mailto:info@davidherren.ch'">Mail</button>
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
    <div id="content"></div>
  </body>
</html>
