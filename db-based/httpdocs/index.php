<!DOCTYPE html>
<!--Created 2016-2024 by David Herren-->
<html lang="de">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>David Herren</title>
    <link rel="stylesheet" type="text/css" href="/css/style.css">
    <link rel="shortcut icon" href="/favicon.ico">
    <script src="/js/data.js" defer></script>
    <script src="/js/animations.js" defer></script>
    <script type="module" src="https://unpkg.com/@google/model-viewer@latest"></script>
    <script async src="https://www.googletagmanager.com/gtag/js?id=UA-114694374-1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'UA-114694374-1');
    </script>
  </head>
  <body>
<?php
include 'data.php';
$menuResult = $database->fetchMenuItems();
?>
    <div id="menu" class="frame">
      <div id="menu-title">
        <div id="menu-title-left">
          <button id="button-dropdown" class="button-navigation" onclick="dropDownMenu()">
            <svg id="dropdown-svg" width="64px" height="32px" viewBox="0 0 64 32" xmlns="http://www.w3.org/2000/svg">
              <rect x="4"  y="24" id="svg-triangle-1" width="56" height="4"/>
              <rect x="8"  y="20" id="svg-triangle-2" width="48" height="4"/>
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
