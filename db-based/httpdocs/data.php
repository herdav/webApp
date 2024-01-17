<?php // data.php for davidherren.ch / 2024-01-17

include './php/db.php';
include './php/fetchData.php';
include './php/utilities.php';

$db = new Database();
$conn = $db->getConnection();
$database = new fetchData($conn);

if (isset($_GET['works']) && isset($_GET['lang']) && isset($_GET['slug'])) {
  $lang = sanitizeInput($_GET['lang']);
  $slug = sanitizeInput($_GET['slug']);
  $lang = validateLanguage($lang);
  $slug = validateSlug($slug);

  $workData = $database->fetchWorks($slug, $lang);

  if ($workData) {
    $workimages = $database->fetchWorkImages($slug, $lang);
    $worklinks = $database->fetchWorkLinks($slug);

    $htmlOutput = <<<HTML
    <div id='content-inner'>
      <div id='content-inner-left'>
        <div class="content-left-img-outer"><img src='/img/{$workData["slug"]}-0.jpg'></div>
        <div id='content-inner-left-text'>
    HTML;

    // Inserting the titles of the images here
    foreach ($workimages as $image) {
      $imageText = $image["text_$lang"];
      $workTitle = $workData["title"];
      $htmlOutput .= <<<HTML
      <div class="work-image-title">
        <div class="frame">
          <div class="frame-title">
            <a href="#top" class="frame-title-left button-navigation"></a>
            <h3 class="frame-title-center">$workTitle</h3>
          </div>
          <p>$imageText</p>
        </div>
      </div>
      HTML;
    }

    // Closing the left content div
    $htmlOutput .= "</div></div>";
    $htmlOutput .= <<<HTML
    <div id="content-inner-center">
      <a id="pointer" href="">
        <svg width="72" height="56" viewBox="0 0 72 56" class="svg-arrow">
          <rect id="svg-arrow-0" x="0"  y="24" width="72" height="4"/>
          <rect id="svg-arrow-1" x="64" y="28" width="4" height="4"/>
          <rect id="svg-arrow-2" x="60" y="32" width="4" height="4"/>
          <rect id="svg-arrow-3" x="56" y="36" width="4" height="4"/>
          <rect id="svg-arrow-4" x="52" y="40" width="4" height="4"/>
          <rect id="svg-arrow-5" x="48" y="44" width="4" height="4"/>
          <rect id="svg-arrow-6" x="44" y="48" width="4" height="4"/>
          <rect id="svg-arrow-7" x="64" y="20" width="4" height="4"/>
          <rect id="svg-arrow-8" x="60" y="16" width="4" height="4"/>
          <rect id="svg-arrow-9" x="56" y="12" width="4" height="4"/>
          <rect id="svg-arrow-10" x="52" y="8"  width="4" height="4"/>
          <rect id="svg-arrow-11" x="48" y="4"  width="4" height="4"/>
          <rect id="svg-arrow-12" x="44" y="0"  width="4" height="4"/>
        </svg>
      </a>
    </div>
    <div id='content-inner-right'>
      <div id='work-text'>
        <p>{$workData["text_$lang"]}</p>
      <div id='work-infos'>
    HTML;

    // Check if info_$lang is not empty and use it, otherwise use year, media, size
    if (!empty($workData["info_$lang"])) {
        $htmlOutput .= "<p>{$workData["year"]}, {$workData["info_$lang"]}</p>";
    } else {
        $htmlOutput .= "<p>{$workData["year"]}, {$workData["media_$lang"]}, {$workData["size_$lang"]}";
        if (!empty($workData["edition"])) {
            $htmlOutput .= ", " . htmlspecialchars($workData["edition"]);
        }
        $htmlOutput .= "</p>";
    }

    $htmlOutput .= "</div>"; // Closing tag for work-infos div

    $htmlOutput .= "<div id='work-links'>";
    foreach ($worklinks as $link) {
      $htmlOutput .= "<a href='" . htmlspecialchars($link["address"]) . "' target='_blank'>" . htmlspecialchars($link["description"]) . "</a> ";
    }
    $htmlOutput .= '</div></div>';

    // Code for displaying additional images
    $htmlOutput .= "<div class='work-images'>";
    foreach ($workimages as $image) {
      $imageName   = htmlspecialchars($image["name"]);
      $imageType   = htmlspecialchars($image["datatype"]);
      $htmlOutput .= <<<HTML
      <img src='/img/{$imageName}.{$imageType}'>
      HTML;
    }
    $htmlOutput .= "</div>";
    
    // Code for 3D model viewer
    if (!empty($workData["3d"]) && $workData["3d"] == 1) {
      $htmlOutput .= <<<HTML
      <model-viewer id="embedded-model" src="/3d/{$slug}.gltf" alt="Ein 3D-Modell" camera-controls touch-action="pan-y" tone-mapping="agx" exposure="0.5" autoplay ar ar-modes="webxr scene-viewer" shadow-intensity="0" shadow-softness="1.5"></model-viewer>
      HTML;
    }

    // Code for Vimeo iframes
    function createVimeoIframe($vimeoId, $isLandscape = true) {
      $padding = $isLandscape ? '56.25%' : '177.78%';
      $iframe = <<<HTML
      <div style="padding:{$padding} 0 0 0;position:relative;">
        <iframe src="https://player.vimeo.com/video/{$vimeoId}?title=0&byline=0&portrait=0&badge=0&app_id=58479" frameborder="0" allow="fullscreen; picture-in-picture" style="position:absolute;top:0;left:0;width:100%;height:100%;"></iframe>
      </div>
      <script src="https://player.vimeo.com/api/player.js"></script>
      HTML;
      return $iframe;
    }

    if (!empty($workData["vimeo_landscape"])) {
      $htmlOutput .= "<div id='work-video'>" . createVimeoIframe($workData["vimeo_landscape"]) . "</div>";
    }
    if (!empty($workData["vimeo_portrait"])) {
      $htmlOutput .= "<div id='work-video'>" . createVimeoIframe($workData["vimeo_portrait"], false) . "</div>";
    }
    $htmlOutput .= "</div>";

    $response = [
      'html' => $htmlOutput,
      'title' => $workData['title'],
      'descriptionDe' => $workData["description_$lang"],
      'descriptionEn' => $workData["description_$lang"]
    ];

    echo json_encode($response);
  } else { echo "No Data found!"; }
  $conn = null;
}

if (isset($_GET['exhibitions']) && isset($_GET['lang'])) {
  $lang = sanitizeInput($_GET['lang']);
  $lang = validateLanguage($lang);

  $exhibitionData = $database->fetchExhibitions($lang);

  if ($exhibitionData) {
    $htmlOutput = "";
    foreach ($exhibitionData as $exhibition) {
      $htmlOutput .= "<div class='exhibition'>";
      $htmlOutput .= "<h2>" . htmlspecialchars($exhibition['title']) . "</h2>";
      $htmlOutput .= "<p>" . htmlspecialchars($exhibition["date_start"]) . " bis " . htmlspecialchars($exhibition["date_end"]);
      $htmlOutput .= "<p>" . htmlspecialchars($exhibition['institution']);
      $htmlOutput .= ", " . htmlspecialchars($exhibition['place']) . "</p>";
      $htmlOutput .= "<p>" . htmlspecialchars($exhibition["text_$lang"]) . "</p>";
      $htmlOutput .= "</div>";
    }

    $response = [
      'html' => $htmlOutput
    ];
    echo json_encode($response);
  } else { echo "No Data found!"; }
  $conn = null;
}

if (isset($_GET['about']) && isset($_GET['lang'])) {
  // Sanitize and validate input
  $lang = sanitizeInput($_GET['lang']);
  $lang = validateLanguage($lang);

  // Fetch data from database
  $aboutData = $database->fetchAbout($lang);
  $exhibitionData = $database->fetchExhibitions($lang);

  $htmlOutput = "";
  $htmlOutput .= "<div id='about'>";
  $htmlOutput .= "<div id='about-left'>";

  // Processing aboutData for 'about' and 'education'
  if ($aboutData) {
    foreach ($aboutData as $about) {
      if ($about['section'] === 'about' || $about['section'] === 'education') {
        // Adding section titles
        if (!isset($lastSection) || $lastSection !== $about['section']) {
          if ($lang === 'de') {
            $titleSection = htmlspecialchars(ucfirst($about['section_de']));
          } else {
            $titleSection = htmlspecialchars(ucfirst($about['section']));
          }
          $htmlOutput .= "<h2>" . $titleSection . "</h2>";
          $lastSection = $about['section'];
        }
        // Displaying about-items
        $htmlOutput .= "<div class='about-items' style='display: flex;'>";
        if ($about['time']) {
          $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($about['time']) . "</p></div>";
        }
        if ($about['title']) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $htmlOutput .= "<p>" . htmlspecialchars($about['title']);

        } else if (!$about['title'] && $about["text_$lang"]) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $htmlOutput .= "<p>" . htmlspecialchars($about["text_$lang"]);

        } else if ($about["text_$lang"]) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $htmlOutput .= "<p>" . htmlspecialchars($about["text_$lang"]);
        }

        $htmlOutput .= "</p>" . "</div></div>";
      }
    }
  }

  // Processing exhibitionData for 'exhibition'
  if ($exhibitionData) {
    $lastYear = null;
    $htmlOutput .= "<div id='exhibitions'>";
    if ($lang === 'de') {
      $htmlOutput .= "<h2>Austellungen</h2>";
    } else {
      $htmlOutput .= "<h2>Exhibitions</h2>";
    }
    foreach ($exhibitionData as $exhibition) {
      $yearStart = substr($exhibition["date_start"], 0, 4);
      $htmlOutput .= "<div class='about-items' style='display: flex;'>";
      if ($yearStart !== $lastYear) {
        $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($yearStart) . "</p></div>";
        $lastYear = $yearStart;
      } else {
        $htmlOutput .= "<div style='flex: 1;'></div>";
      }
      $htmlOutput .= "<div style='flex: 3;'>";

      $firstLink = $database->fetchExhibitionMainLink(htmlspecialchars($exhibition['title']));
      if ($firstLink) {
          $htmlOutput .= "<p>" . "<a target='_blank' href='" . htmlspecialchars($firstLink) . "'>" . htmlspecialchars($exhibition['title']) . "</a>" . ", ";
      } else {
          $htmlOutput .= "<p>"  . htmlspecialchars($exhibition['title']) . ", ";
      }
      $htmlOutput .= $exhibition['institution'];
      $htmlOutput .= ", " . htmlspecialchars($exhibition['place']) . "</p>";
      $htmlOutput .= "</div>";
      $htmlOutput .= "</div>";
    }
    $htmlOutput .= "</div>"; // End of Exhibition section
  }

  $htmlOutput .= "</div>"; // End of about-left

  $htmlOutput .= "<div id='about-right'>";
  // Processing aboutData for 'media'
  if ($aboutData) {
    foreach ($aboutData as $about) {
      if ($about['section'] === 'media') {
        // Adding section titles
        if (!isset($lastSection) || $lastSection !== $about['section']) {
          if ($lang === 'de') {
            $titleSection = htmlspecialchars(ucfirst($about['section_de']));
          } else {
            $titleSection = htmlspecialchars(ucfirst($about['section']));
          }
          $htmlOutput .= "<h2>" . $titleSection . "</h2>";
          $lastSection = $about['section'];
        }
        // Displaying about-items
        $htmlOutput .= "<div class='about-items' style='display: flex;'>";
        if ($about['time']) {
          $htmlOutput .= "<div style='flex: 1;'><p>" . htmlspecialchars($about['time']) . "</p></div>";
        }
        if ($about['title']) {
          $htmlOutput .= "<div style='flex: 3;'>";
          $firstLink = $database->fetchMediaLink(htmlspecialchars($about['title']));
          if ($firstLink) {
              $htmlOutput .= "<p>" . "<a target='_blank' href='" . htmlspecialchars($firstLink) . "'>" . htmlspecialchars($about['title']) . "</a>";
          } else {
              $htmlOutput .= "<p>"  . htmlspecialchars($about['title']);
          }
        }
        if ($about["text_$lang"]) {
          $htmlOutput .= ", " . htmlspecialchars($about["text_$lang"]) . "</p>";
        }
        $htmlOutput .= "</div></div>";
      }
    }
    if ($about['section'] === 'imprint') {
      if (!isset($lastSection) || $lastSection !== $about['section']) {
        if ($lang === 'de') {
          $titleSection = htmlspecialchars(ucfirst($about['section_de']));
        } else {
          $titleSection = htmlspecialchars(ucfirst($about['section']));
        }
        $htmlOutput .= "<h2>" . $titleSection . "</h2>";
        $htmlOutput .= "<p>" . $about["text_$lang"] . "</p>";
      }
    }
  }

  $htmlOutput .= "</div>"; // End of about-right
  $htmlOutput .= "</div>"; // End of left

  // Send response
  $response = [
    'html' => $htmlOutput,
    'descriptionDe' => $database->fetchAboutStatement("de"),
    'descriptionEn' => $database->fetchAboutStatement("en")
  ];

  echo json_encode($response);

  // Close database connection
  $conn = null;
}

if (isset($_GET['statement'])) {
  $lang = sanitizeInput($_GET['statement']);
  $lang = validateLanguage($lang);
  echo json_encode(['description' => $database->fetchAboutStatement($lang)]);
}
?>
