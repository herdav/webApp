<!DOCTYPE html>
<!--Created 2016-2024 by David Herren-->
<!--Latest Update 2024-03-23-->
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>David Herren</title>
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link rel="shortcut icon" href="/favicon.ico">
    <link rel="canonical" href="https://davidherren.ch"/>
    <script src="/js/data.js" defer></script>
    <script src="/js/animations.js" defer></script>
    <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
  </head>
  <body>
<?php
include 'data.php';
$menuResult = $database->fetchMenuItems();
?>
    <div id="menu" class="frame">
      <div id="menu-title">
        <div id="menu-title-left">
          <button aria-label="button-menu-dropdown" id="button-dropdown" class="button-navigation" onclick="dropDownMenu()">
            <svg id="dropdown-svg" width="56px" height="32px" viewBox="0 0 56 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="0"  y="24" width="56" id="svg-triangle-1" height="8"/>
              <rect x="8"  y="16" width="40" id="svg-triangle-2" height="8"/>
              <rect x="16" y="8"  width="24" id="svg-triangle-3" height="8"/>
              <rect x="24" y="0"  width="8"  id="svg-triangle-4" height="8"/>
            </svg>
          </button>
        </div>
        <a href="/" id="menu-title-center">
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
    echo '          <button id="button-' . htmlspecialchars($slug) . '" class="button-navigation" onclick="loadWorks(\'' . htmlspecialchars($slug) . '\')">' . htmlspecialchars($title) . '</button>' . PHP_EOL;
  }
} else { echo "No Buttons found!"; }
?>
        </div>
        <div id="menu-about">
          <button id="button-about" class="button-navigation" onclick="loadAbout()">About</button>
          <button id="button-mail" class="button-navigation" onclick="window.location.href='mailto:info@davidherren.ch'">Mail</button>
        </div>
      </div>
    </div>
    <div id="index">
      <div id="index-inner">
      </div>
    </div>
    <div id="content"></div>
  </body>
</html>
